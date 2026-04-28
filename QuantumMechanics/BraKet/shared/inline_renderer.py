"""
shared/inline_renderer.py
=========================
Converts structured slide-content blocks into lists of (type, content) tuples
where every math-containing segment is rendered to a PNG via LatexRenderer.

The key insight: instead of placing math as plain text (which PowerPoint
cannot render), we:
  1. Parse each text block line by line
  2. Detect math content (Unicode math chars, LaTeX notation, Greek letters)
  3. Render math lines/segments as pdflatex PNGs
  4. Return a structured "layout spec" that the Node.js builder can consume:
     { type: "text"|"formula"|"header"|"spacer", content/path, ... }

The Node.js builder (build_lecture_full.js) reads this spec and places
items as text boxes or addImage() calls arranged vertically in a card.

Usage (Python side):
    from shared.inline_renderer import InlineRenderer, render_text_block
    renderer = InlineRenderer("build/L01/formulas", dpi=300)
    spec = render_text_block(renderer, text_with_math)
    # spec is list of {"type": "text"|"formula", "content": str|path, ...}

The JSON spec is embedded inside lecture_content.json under a key
"rendered_blocks" so the Node builder can consume it without extra files.
"""

from __future__ import annotations
import re
import os
import sys
import hashlib
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))
from shared.latex_renderer import LatexRenderer

# ── Math detection ────────────────────────────────────────────────────────────
_MATH_PATTERNS = [
    r'[⟨⟩⟩⟨]',                          # bra-ket angle brackets
    r'[ψφχρσαβγδεζηθικλμνξπστυω]',        # lowercase Greek
    r'[ΨΦΧΡΣΑΒΓΔΕΖΗΘΙΚΛΜΝΞΠΣΤΥΩ]',        # uppercase Greek
    r'[ℋℝℂℕℤℚℙ]',                        # script/blackboard letters
    r'ℏ|ħ',                               # hbar
    r'[∈∉⊂⊃⊆⊇∩∪∀∃∞∑∏∫∂∇≤≥≠≈±∓×÷√]',    # math operators
    r'[₀₁₂₃₄₅₆₇₈₉]',                    # Unicode subscripts
    r'[⁰¹²³⁴⁵⁶⁷⁸⁹]',                    # Unicode superscripts
    r'‖[^‖]+‖',                           # norm ‖·‖
    r'\|[A-Za-z\\{][^|]*\|',              # absolute value with content
    r'\^[\{2-9]|\^[a-zA-Z†]',             # LaTeX superscripts
    r'_[\{a-z0-9n]',                      # LaTeX subscripts
    r'\\[a-zA-Z]{2,}',                    # LaTeX commands \psi \hat etc.
    r'\$[^$\n]+\$',                       # dollar-delimited math
    r'⇒|⟹|⟺|⟷|↦|→|←|↑|↓',             # logical/mapping arrows
    r'Î|Â|Û|Ĥ|ρ̂|P̂',                    # hatted operators
    r'[Ω∧∨¬⊕⊗]',                         # logic/tensor symbols
]
_MATH_RE = re.compile('|'.join(_MATH_PATTERNS))

# Lines that are section headers (ALL CAPS, short, no math symbols)
_HEADER_RE = re.compile(r'^[A-Z][A-Z0-9 –\-:()&/]{3,}$')

# Convert line to LaTeX string for pdflatex
_UNICODE_TO_LATEX = [
    # Greek lowercase
    ('α','\\alpha'), ('β','\\beta'), ('γ','\\gamma'), ('δ','\\delta'),
    ('ε','\\epsilon'), ('ζ','\\zeta'), ('η','\\eta'), ('θ','\\theta'),
    ('ι','\\iota'), ('κ','\\kappa'), ('λ','\\lambda'), ('μ','\\mu'),
    ('ν','\\nu'), ('ξ','\\xi'), ('π','\\pi'), ('ρ','\\rho'),
    ('σ','\\sigma'), ('τ','\\tau'), ('υ','\\upsilon'), ('φ','\\phi'),
    ('χ','\\chi'), ('ψ','\\psi'), ('ω','\\omega'),
    # Greek uppercase
    ('Γ','\\Gamma'), ('Δ','\\Delta'), ('Θ','\\Theta'), ('Λ','\\Lambda'),
    ('Ξ','\\Xi'), ('Π','\\Pi'), ('Σ','\\Sigma'), ('Φ','\\Phi'),
    ('Ψ','\\Psi'), ('Ω','\\Omega'),
    # Special symbols
    ('ℏ','\\hbar'), ('ħ','\\hbar'),
    ('ℋ','\\mathcal{H}'), ('ℝ','\\mathbb{R}'), ('ℂ','\\mathbb{C}'),
    ('ℕ','\\mathbb{N}'), ('ℤ','\\mathbb{Z}'), ('ℚ','\\mathbb{Q}'),
    ('ℙ','\\mathbb{P}'),
    # Bra-ket  
    ('⟨','\\langle '), ('⟩','\\rangle'),
    # Operators
    ('∈','\\in'), ('∉','\\notin'), ('⊂','\\subset'), ('⊃','\\supset'),
    ('⊆','\\subseteq'), ('⊇','\\supseteq'),
    ('∩','\\cap'), ('∪','\\cup'),
    ('∀','\\forall'), ('∃','\\exists'),
    ('∞','\\infty'), ('∂','\\partial'), ('∇','\\nabla'),
    ('≤','\\leq'), ('≥','\\geq'), ('≠','\\neq'), ('≈','\\approx'),
    ('±','\\pm'), ('∓','\\mp'), ('×','\\times'), ('÷','\\div'),
    ('√','\\sqrt'), ('∑','\\sum'), ('∏','\\prod'), ('∫','\\int'),
    # Subscripts/superscripts (Unicode)
    ('₀','_0'), ('₁','_1'), ('₂','_2'), ('₃','_3'), ('₄','_4'),
    ('₅','_5'), ('₆','_6'), ('₇','_7'), ('₈','_8'), ('₉','_9'),
    ('₊','{+}'), ('₋','{-}'), ('₌','{=}'),
    ('⁰','^0'), ('¹','^1'), ('²','^2'), ('³','^3'), ('⁴','^4'),
    ('⁵','^5'), ('⁶','^6'), ('⁷','^7'), ('⁸','^8'), ('⁹','^9'),
    ('⁺','^+'), ('⁻','^-'),
    # Norms and absolute value
    ('‖','\\|'),
    # Hatted operators (common ones)
    ('Î','\\hat{I}'), ('Â','\\hat{A}'), ('Û','\\hat{U}'),
    ('Ĥ','\\hat{H}'), ('B̂','\\hat{B}'),
    # Arrows
    ('→','\\rightarrow'), ('←','\\leftarrow'),
    ('⟹','\\Rightarrow'), ('⟺','\\Leftrightarrow'),
    ('⇒','\\Rightarrow'), ('⟷','\\leftrightarrow'),
    ('↦','\\mapsto'),
    # Logic
    ('⊕','\\oplus'), ('⊗','\\otimes'),
    # Dots
    ('·','\\cdot'), ('…','\\ldots'),
    # Superscript Greek (modifier letters)
    ('\u1dbf', '{\\theta}'),  # modifier letter small theta ᶿ
    ('\u1d60', '{\\phi}'),    # modifier letter small phi ᵠ  
    ('\u1d45', '{\\alpha}'),  # modifier letter small alpha ᵅ
    ('\u1d66', '{\\beta}'),   # modifier letter small beta ᵝ
    ('\u2113', '\\ell'),      # script small l ℓ
    # Checkmark
    ('\u2713', '\\checkmark'),  # ✓
    # Middle dot
    ('\u00b7', '\\cdot'),    # ·
    # Misc
    ('∝','\\propto'), ('∼','\\sim'), ('≡','\\equiv'),
    # More subscript/superscript
    ('ᵢ', '_i'), ('ₙ', '_n'), ('ₘ', '_m'), ('ₖ', '_k'),
    ('ⁱ', '^i'), ('ⁿ', '^n'),
    # More math symbols  
    ('≅', '\\cong'), ('∖', '\\setminus'),
    ('𝒟', '\\mathcal{D}'),
    # Combining hat - strip (already converted via letter+hat combos)
    ('̂', ''),
    ('ℐ','\\mathcal{I}'), ('𝒟','\\mathcal{D}'),
]

def unicode_to_latex(s: str) -> str:
    """Convert Unicode math notation to LaTeX commands."""
    for uni, lat in _UNICODE_TO_LATEX:
        s = s.replace(uni, lat)
    return s


def _is_math_line(line: str) -> bool:
    """Return True if this line contains mathematical content needing rendering."""
    stripped = line.strip()
    if not stripped:
        return False
    if _HEADER_RE.match(stripped) and len(stripped) < 60:
        # Pure section header — render as text only if it has no math chars
        if not _MATH_RE.search(stripped):
            return False
    return bool(_MATH_RE.search(stripped))


def _is_header(line: str) -> bool:
    """Return True if this is a section header (should render bigger/bold)."""
    stripped = line.strip()
    return (bool(_HEADER_RE.match(stripped))
            and len(stripped) < 70
            and not _MATH_RE.search(stripped))


def _line_to_latex(line: str) -> str:
    """
    Convert a mixed prose+math line to a LaTeX expression suitable for pdflatex.
    
    All converted lines are wrapped in math mode $...$  using:
    - For "Label: formula" lines: text{Label:} math_formula
    - For pure math lines: $formula$
    - Prose words embedded in math use \text{...}
    """
    s = line.strip()
    
    # Already dollar-delimited
    if s.startswith("$") and s.endswith("$"):
        return s
    
    # Convert ALL Unicode math to LaTeX
    s = unicode_to_latex(s)
    
    # Additional conversions not in the main table
    import re as _re
    extra = [
        ("ᵢ", "_i"), ("ₙ", "_n"), ("ₘ", "_m"), ("ₖ", "_k"),
        ("ⁱ", "^i"), ("ⁿ", "^n"),
        ("≅", "\\cong"), ("∖", "\\setminus"),
        ("𝒟", "\\mathcal{D}"),
        ("\u0302", ""),  # combining hat
    ]
    for uni, lat in extra:
        s = s.replace(uni, lat)
    
    # Detect if line has a "Label: formula" structure with pure-ASCII label
    colon_idx = s.find(":")
    if 0 < colon_idx < 40:
        label = s[:colon_idx].strip()
        rest  = s[colon_idx+1:].strip()
        # Label must be pure ASCII text (no LaTeX commands yet)
        if _re.match(r"^[A-Za-z0-9 \\-–_()+]+$", label) and rest:
            # Wrap label in \text{}, put rest in math mode
            label_clean = label.replace("\\", "")
            return ("$\\text{" + label_clean + ":}\\ " + rest + "$")
    
    # Default: entire line in math mode
    return "$" + s + "$"




# ── Main rendering class ──────────────────────────────────────────────────────

class InlineRenderer:
    """
    Render text blocks with inline math to a structured layout spec.
    
    Each item in the spec is a dict:
      {"type": "header",  "text": str}          – section header, bold
      {"type": "text",    "text": str}           – plain prose line
      {"type": "formula", "path": str, "tex": str}  – rendered PNG
      {"type": "spacer"}                         – empty line
    """
    
    def __init__(self, formulas_dir: str, dpi: int = 300):
        self.renderer = LatexRenderer(formulas_dir, dpi=dpi)
        self._cache: dict[str, str] = {}
    
    def render_block(self, text: str) -> list[dict]:
        """
        Parse a multiline text block and return a layout spec.
        Every line with math content is rendered as a formula PNG.
        """
        spec = []
        lines = text.split('\n')
        
        for raw_line in lines:
            stripped = raw_line.strip()
            
            # Empty line → spacer
            if not stripped:
                spec.append({"type": "spacer"})
                continue
            
            # Section header (ALL CAPS, no math)
            if _is_header(stripped):
                spec.append({"type": "header", "text": stripped})
                continue
            
            # Math line → render
            if _is_math_line(stripped):
                latex = _line_to_latex(stripped)
                # Use hash as cache key
                key = hashlib.md5(latex.encode()).hexdigest()
                if key in self._cache:
                    path = self._cache[key]
                else:
                    # Generate a slug from the line
                    slug = re.sub(r'[^a-zA-Z0-9]', '_', stripped[:30]).strip('_')
                    path = self.renderer.render(latex, f"inline_{slug}_{key[:6]}")
                    self._cache[key] = path
                spec.append({"type": "formula", "path": path, "tex": latex})
            else:
                # Plain prose
                spec.append({"type": "text", "text": stripped})
        
        return spec
    
    def render_tagged_block(self, tagged_text: str) -> list[dict]:
        """
        Parse a tagged block (HEADER:/MATH:/TEXT:/MIXED: prefixes) 
        into a layout spec, rendering MATH lines via pdflatex.
        """
        import hashlib as _hlib, re as _re
        HDR  = "HEADER:"
        MATH = "MATH:"
        TXT  = "TEXT:"
        MIX  = "MIXED:"
        spec = []
        for raw in tagged_text.strip().split("\n"):
            line = raw.strip()
            if not line:
                spec.append({"type": "spacer"})
            elif line.startswith(HDR):
                spec.append({"type": "header", "text": line[len(HDR):].strip()})
            elif line.startswith(TXT):
                spec.append({"type": "text", "text": line[len(TXT):].strip()})
            elif line.startswith(MATH):
                latex = line[len(MATH):].strip()
                if not (latex.startswith("$") and latex.endswith("$")):
                    latex = f"${latex}$"
                key  = _hlib.md5(latex.encode()).hexdigest()
                slug = _re.sub(r"[^a-zA-Z0-9]","_", latex[1:31]).strip("_")
                name = f"inline_{slug}_{key[:6]}"
                if key in self._cache:
                    path = self._cache[key]
                else:
                    path = self.renderer.render(latex, name)
                    self._cache[key] = path
                spec.append({"type": "formula", "path": path, "tex": latex})
            elif line.startswith(MIX):
                content = line[len(MIX):].strip()
                if "|" in content:
                    label, formula = content.split("|", 1)
                    latex = f"$\\text{{{label.strip()}}}\\; {formula.strip()}$"
                else:
                    latex = f"${content}$"
                key  = _hlib.md5(latex.encode()).hexdigest()
                slug = _re.sub(r"[^a-zA-Z0-9]","_", latex[1:31]).strip("_")
                name = f"inline_{slug}_{key[:6]}"
                if key in self._cache:
                    path = self._cache[key]
                else:
                    path = self.renderer.render(latex, name)
                    self._cache[key] = path
                spec.append({"type": "formula", "path": path, "tex": latex})
            else:
                # Untagged: plain text
                spec.append({"type": "text", "text": line})
        return spec

    def render_tagged_blocks_batch(
        self,
        blocks: dict[str, str],
        max_workers: int = 6,
    ) -> dict[str, list[dict]]:
        """
        Render all MATH: lines in a batch of tagged blocks.
        Returns {block_key: layout_spec}.
        """
        import hashlib as _hlib, re as _re
        from concurrent.futures import ThreadPoolExecutor, as_completed

        MATH = "MATH:"
        MIX  = "MIXED:"

        # Collect all unique MATH expressions first
        all_formulas: dict[str, str] = {}   # name -> latex
        key_to_name:  dict[str, str] = {}   # md5key -> name

        for text in blocks.values():
            for raw in text.strip().split("\n"):
                line = raw.strip()
                latex = None
                if line.startswith(MATH):
                    latex = line[len(MATH):].strip()
                    if not (latex.startswith("$") and latex.endswith("$")):
                        latex = f"${latex}$"
                elif line.startswith(MIX):
                    content = line[len(MIX):].strip()
                    if "|" in content:
                        label, formula = content.split("|", 1)
                        latex = f"$\\text{{{label.strip()}}}\\; {formula.strip()}$"
                    else:
                        latex = f"${content}$"
                if latex is None:
                    continue
                key  = _hlib.md5(latex.encode()).hexdigest()
                if key not in self._cache:
                    slug = _re.sub(r"[^a-zA-Z0-9]","_", latex[1:31]).strip("_")
                    name = f"inline_{slug}_{key[:6]}"
                    all_formulas[name] = latex
                    key_to_name[key]   = name

        # Batch render all new formulas
        if all_formulas:
            paths = self.renderer.render_batch(all_formulas, max_workers=max_workers)
            for name, path in paths.items():
                # find key for this name
                for key, n in key_to_name.items():
                    if n == name:
                        self._cache[key] = path
                        break

        # Build specs for all blocks
        return {key: self.render_tagged_block(text) for key, text in blocks.items()}


    def render_blocks_batch(self, blocks: dict[str, str], max_workers: int = 6) -> dict[str, list[dict]]:
        """
        Render multiple named text blocks in parallel.
        Returns {name: spec}.
        """
        from concurrent.futures import ThreadPoolExecutor, as_completed
        
        # Collect all math lines first for batch rendering
        all_math: dict[str, str] = {}  # key → latex
        line_map: dict[str, str] = {}  # key → slug
        
        for name, text in blocks.items():
            for raw_line in text.split('\n'):
                stripped = raw_line.strip()
                if stripped and _is_math_line(stripped):
                    latex = _line_to_latex(stripped)
                    key   = hashlib.md5(latex.encode()).hexdigest()
                    if key not in self._cache:
                        slug = re.sub(r'[^a-zA-Z0-9]', '_', stripped[:30]).strip('_')
                        all_math[f"inline_{slug}_{key[:6]}"] = latex
                        line_map[key] = f"inline_{slug}_{key[:6]}"
        
        # Batch render all math lines
        if all_math:
            paths = self.renderer.render_batch(all_math, max_workers=6)
            for fname, path in paths.items():
                # Reverse-map fname → key
                for key, slug in line_map.items():
                    if slug == fname:
                        self._cache[key] = path
        
        # Now build specs
        return {name: self.render_block(text) for name, text in blocks.items()}
