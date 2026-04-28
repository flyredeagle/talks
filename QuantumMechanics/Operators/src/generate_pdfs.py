"""
QM Module I.1 — PDF Sheet Generator
Produces:
  - 5 lecture summary sheets  (LXX_lecture_sheet.pdf)
  - 35 assessment artifact sheets  (LXX_YYY.pdf)  [7 types × 5 lectures]
Total: 40 PDFs
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import Flowable
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY

# ─────────────────────────────────────────────────────────────
# FONT REGISTRATION
# ─────────────────────────────────────────────────────────────
FONT_DIR = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DejaSans",      f"{FONT_DIR}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DejaSans-Bold", f"{FONT_DIR}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaSans-Obl",  f"{FONT_DIR}/DejaVuSans-Oblique.ttf"))
pdfmetrics.registerFont(TTFont("DejaSerif",     f"{FONT_DIR}/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("DejaSerif-Bold",f"{FONT_DIR}/DejaVuSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DejaSerif-Ital",f"{FONT_DIR}/DejaVuSerif-Italic.ttf"))
pdfmetrics.registerFont(TTFont("DejaMono",      f"{FONT_DIR}/DejaVuSansMono.ttf"))

# ─────────────────────────────────────────────────────────────
# COLOURS  (matching LaTeX pedagogical_support.tex)
# ─────────────────────────────────────────────────────────────
DARKBLUE     = colors.Color(10/255,  40/255,  90/255)
MIDBLUE      = colors.Color(30/255,  80/255,  160/255)
LIGHTBLUE    = colors.Color(220/255, 233/255, 255/255)
ACCENTGOLD   = colors.Color(180/255, 140/255, 20/255)
LIGHTGOLD    = colors.Color(255/255, 248/255, 220/255)
DARKGRAY     = colors.Color(60/255,  60/255,  60/255)
LIGHTGRAY    = colors.Color(245/255, 245/255, 245/255)
ARTTEAL      = colors.Color(20/255,  110/255, 100/255)
LIGHTARTTEAL = colors.Color(210/255, 240/255, 238/255)
ARTPURPLE    = colors.Color(100/255, 30/255,  130/255)
LIGHTPURPLE  = colors.Color(235/255, 215/255, 245/255)
TIER1_BG     = colors.Color(180/255, 230/255, 180/255)   # HS
TIER2_BG     = colors.Color(150/255, 210/255, 240/255)   # BegUG
TIER3_BG     = colors.Color(200/255, 180/255, 240/255)   # AdvUG
TIER4_BG     = colors.Color(255/255, 210/255, 150/255)   # MSc
TIER5_BG     = colors.Color(255/255, 170/255, 150/255)   # PhD
TIER_COLORS  = [TIER1_BG, TIER2_BG, TIER3_BG, TIER4_BG, TIER5_BG]
TIER_LABELS  = ["HS", "BegUG", "AdvUG", "MSc", "PhD"]

PAGE_W, PAGE_H = A4
MARGIN = 2*cm

# ─────────────────────────────────────────────────────────────
# PARAGRAPH STYLES
# ─────────────────────────────────────────────────────────────
def S(name, font="DejaSerif", size=10, leading=14, color=colors.black,
      bold=False, italic=False, align=TA_LEFT, spaceAfter=4, spaceBefore=2,
      leftIndent=0, rightIndent=0):
    fn = "DejaSans-Bold" if (bold and font.startswith("Deja") and "Mono" not in font and "Serif" not in font) else \
         "DejaSerif-Bold" if (bold and "Serif" in font) else \
         "DejaSerif-Ital" if (italic and "Serif" in font) else \
         "DejaSans-Obl" if (italic and "Sans" in font) else font
    return ParagraphStyle(name, fontName=fn, fontSize=size, leading=leading,
                          textColor=color, alignment=align, spaceAfter=spaceAfter,
                          spaceBefore=spaceBefore, leftIndent=leftIndent,
                          rightIndent=rightIndent)

sTitle     = S("sTitle",     font="DejaSans-Bold", size=18, leading=22, color=DARKBLUE,  align=TA_LEFT, spaceAfter=6)
sSubtitle  = S("sSubtitle",  font="DejaSans-Obl",  size=11, leading=14, color=MIDBLUE,   align=TA_LEFT, spaceAfter=4)
sH1        = S("sH1",        font="DejaSans-Bold", size=13, leading=17, color=DARKBLUE,  spaceAfter=4, spaceBefore=8)
sH2        = S("sH2",        font="DejaSans-Bold", size=11, leading=15, color=MIDBLUE,   spaceAfter=3, spaceBefore=5)
sH3        = S("sH3",        font="DejaSans-Bold", size=10, leading=13, color=DARKGRAY,  spaceAfter=2, spaceBefore=4)
sBody      = S("sBody",      font="DejaSerif",     size=9.5, leading=13, color=colors.black, spaceAfter=3, align=TA_JUSTIFY)
sBodySans  = S("sBodySans",  font="DejaSans",      size=9,  leading=12.5, color=colors.black, spaceAfter=2)
sMono      = S("sMono",      font="DejaMono",      size=8.5, leading=12, color=DARKGRAY,  spaceAfter=2)
sBullet    = S("sBullet",    font="DejaSerif",     size=9.5, leading=13, color=colors.black, leftIndent=12, spaceAfter=2)
sSmall     = S("sSmall",     font="DejaSans",      size=8,  leading=11, color=DARKGRAY,  spaceAfter=1)
sFooter    = S("sFooter",    font="DejaSans-Obl",  size=8,  leading=10, color=DARKGRAY,  align=TA_CENTER)
sBoxTitle  = S("sBoxTitle",  font="DejaSans-Bold", size=9.5, leading=13, color=colors.white, spaceAfter=3)
sBoxBody   = S("sBoxBody",   font="DejaSerif",     size=9,  leading=13, color=colors.black,  spaceAfter=2)
sRubric    = S("sRubric",    font="DejaSerif",     size=9,  leading=13, color=colors.black,  spaceAfter=2)
sArtCode   = S("sArtCode",   font="DejaSans-Bold", size=11, leading=15, color=ARTTEAL,   spaceAfter=3)
sTierLabel = S("sTierLabel", font="DejaSans-Bold", size=9,  leading=12, color=DARKBLUE,  spaceAfter=2)
sQNum      = S("sQNum",      font="DejaSans-Bold", size=9.5, leading=13, color=DARKBLUE,  spaceAfter=1, spaceBefore=4)
sAns       = S("sAns",       font="DejaSans-Obl",  size=8.5, leading=12, color=DARKGRAY,  leftIndent=12, spaceAfter=2)

# ─────────────────────────────────────────────────────────────
# FLOWABLE HELPERS
# ─────────────────────────────────────────────────────────────
def hr(color=MIDBLUE, width=1):
    return HRFlowable(width="100%", thickness=width, color=color, spaceAfter=4, spaceBefore=4)

def sp(h=6):
    return Spacer(1, h)

def p(text, style=None):
    return Paragraph(text, style or sBody)

def bp(text, indent=0):
    s = S(f"bp{indent}", font="DejaSerif", size=9.5, leading=13,
          color=colors.black, leftIndent=12+indent, spaceAfter=2)
    return Paragraph(f"\u2022\u2009{text}", s)

def numbered(n, text):
    s = S(f"nb{n}", font="DejaSerif", size=9.5, leading=13,
          color=colors.black, leftIndent=16, spaceAfter=2)
    return Paragraph(f"<b>{n}.</b>\u2009{text}", s)

# ─────────────────────────────────────────────────────────────
# COLOURED BOX FLOWABLE
# ─────────────────────────────────────────────────────────────
class ColorBox(Flowable):
    """A box with a coloured left border and tinted background."""
    def __init__(self, content_list, bg, border, title=None, title_bg=None, width=None):
        super().__init__()
        self.content_list = content_list
        self.bg = bg
        self.border = border
        self.title = title
        self.title_bg = title_bg or border
        self._width = width
        self._height = None

    def wrap(self, availWidth, availHeight):
        self._avail = availWidth
        return (availWidth, 0)

    def draw(self):
        pass

def colored_box(story, content_items, bg, border_color, title=None,
                title_bg=None, pad=8):
    """Append a styled box to story using a Table for reliable rendering."""
    tb_bg = title_bg or border_color
    inner = []
    if title:
        inner.append(Paragraph(f"<b>{title}</b>", sBoxTitle))
        inner.append(sp(3))
    for item in content_items:
        inner.append(item)

    tbl = Table([[inner]], colWidths=[PAGE_W - 2*MARGIN - 4])
    style = [
        ("BACKGROUND",  (0,0), (-1,-1), bg),
        ("LEFTPADDING",  (0,0), (-1,-1), pad),
        ("RIGHTPADDING", (0,0), (-1,-1), pad),
        ("TOPPADDING",   (0,0), (-1,-1), pad),
        ("BOTTOMPADDING",(0,0), (-1,-1), pad),
        ("BOX",          (0,0), (-1,-1), border_color, 1.5),
        ("VALIGN",       (0,0), (-1,-1), "TOP"),
    ]
    if title:
        # Draw a solid title bar by using a nested table approach with table row coloring
        title_row = [Paragraph(f"<b>{title}</b>", sBoxTitle)]
        body_rows = [[c] for c in content_items]
        rows = [[title_row]] + body_rows
        col_w = PAGE_W - 2*MARGIN - 4
        tbl = Table([[title_row]] + [[c] for c in content_items], colWidths=[col_w])
        style = [
            ("BACKGROUND",  (0,0), (0,0), tb_bg),
            ("BACKGROUND",  (0,1), (-1,-1), bg),
            ("LEFTPADDING",  (0,0), (-1,-1), pad),
            ("RIGHTPADDING", (0,0), (-1,-1), pad),
            ("TOPPADDING",   (0,0), (0,0), 5),
            ("BOTTOMPADDING",(0,0), (0,0), 5),
            ("TOPPADDING",   (0,1), (-1,-1), 6),
            ("BOTTOMPADDING",(0,-1),(- 1,-1), 6),
            ("BOX",          (0,0), (-1,-1), border_color, 1.5),
            ("VALIGN",       (0,0), (-1,-1), "TOP"),
        ]
    story.append(tbl)
    story.append(sp(6))

def artifact_box(story, title, items):
    colored_box(story, items, LIGHTARTTEAL, ARTTEAL, title=title, title_bg=ARTTEAL)

def rubric_box(story, items):
    colored_box(story, items, LIGHTPURPLE, ARTPURPLE, title="Rubric", title_bg=ARTPURPLE)

def gold_box(story, items):
    colored_box(story, items, LIGHTGOLD, ACCENTGOLD)

def note_box(story, items):
    colored_box(story, items, LIGHTBLUE, MIDBLUE)

def tier_box(story, tier_idx, title, items):
    colored_box(story, items, TIER_COLORS[tier_idx],
                colors.Color(*[x*0.65 for x in TIER_COLORS[tier_idx].rgb()]),
                title=title, title_bg=colors.Color(*[x*0.7 for x in TIER_COLORS[tier_idx].rgb()]))

# ─────────────────────────────────────────────────────────────
# PAGE TEMPLATE (header/footer via onPage callback)
# ─────────────────────────────────────────────────────────────
def make_on_page(lecture_code, doc_type):
    def on_page(canvas, doc):
        canvas.saveState()
        W, H = A4
        # Header bar
        canvas.setFillColor(DARKBLUE)
        canvas.rect(0, H - 1.4*cm, W, 1.4*cm, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont("DejaSans-Bold", 9)
        canvas.drawString(MARGIN, H - 0.9*cm, f"QM Programme — Module I.1 — {lecture_code}")
        canvas.setFont("DejaSans", 9)
        canvas.drawRightString(W - MARGIN, H - 0.9*cm, doc_type)
        # Footer
        canvas.setFillColor(DARKGRAY)
        canvas.setFont("DejaSans", 7.5)
        canvas.drawString(MARGIN, 0.7*cm, "For academic use only | Quantum Mechanics & Quantum Chemistry Programme")
        canvas.drawRightString(W - MARGIN, 0.7*cm, f"Page {doc.page}")
        canvas.restoreState()
    return on_page

def make_doc(path, lecture_code, doc_type):
    doc = SimpleDocTemplate(
        path,
        pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=1.8*cm, bottomMargin=1.5*cm,
        title=f"QM Module I.1 — {lecture_code} — {doc_type}",
        author="QM/QC Programme"
    )
    return doc

# ─────────────────────────────────────────────────────────────
# LECTURE DATA
# ─────────────────────────────────────────────────────────────
LECTURES = {
"L01": {
  "title": "The Hilbert Space of Quantum States",
  "subtitle": "Geometric and Algebraic Foundations",
  "pacing": [
    ("0–20 min",  "Motivation — why Euclidean space is insufficient; infinite-dimensional necessity"),
    ("20–45 min", "Definition of a Hilbert space \u210b: inner product, norm \u2016\u03c8\u2016 = \u221a\u27e8\u03c8|\u03c8\u27e9, completeness"),
    ("45–70 min", "Bounded vs. unbounded operators; operator norm; adjoint A\u2020 via \u27e8\u03c6|A\u03c8\u27e9 = \u27e8A\u2020\u03c6|\u03c8\u27e9"),
    ("70–90 min", "Anti-Hermitian operators; (A\u2020)\u2020 = A; worked examples and classification"),
  ],
  "outcomes": [
    "State the definition of a Hilbert space and verify L\u00b2(\u211d) is one",
    "Distinguish bounded from unbounded operators and give physical examples",
    "Define the adjoint A\u2020 and compute it for 2\u00d72 matrices",
    "Classify Hermitian (A = A\u2020) and anti-Hermitian (A = \u2212A\u2020) operators",
  ],
  "tier_focus": [
    ("HS",    "Inner product as overlap; norm as length; \u211d\u00b2 and \u2102\u00b2 as tangible examples"),
    ("BegUG", "Verify axioms in \u2102\u207f; compute A\u2020 for explicit matrices"),
    ("AdvUG", "Prove adjoint is unique; show (AB)\u2020 = B\u2020A\u2020"),
    ("MSc",   "L\u00b2 space rigorously; operator norm; boundedness \u21d4 continuity"),
    ("PhD",   "Spectrum of unbounded operators; domain issues; Hellinger\u2013Toeplitz theorem"),
  ],
  "key_formulas": [
    "\u27e8\u03c6|\u03c8\u27e9* = \u27e8\u03c8|\u03c6\u27e9  (conjugate symmetry)",
    "\u2016|\u03c8\u27e9\u2016 = \u221a\u27e8\u03c8|\u03c8\u27e9  (norm from inner product)",
    "(A\u2020)\u1d62\u2c7c = (A)\u2c7c\u1d62*  (conjugate transpose)",
    "(AB)\u2020 = B\u2020A\u2020  (adjoint reverses order)",
    "Hermitian: A = A\u2020;  Anti-Hermitian: A = \u2212A\u2020",
  ],
  "connections": {
    "back": "None (first lecture)",
    "forward": "L02 — unitary operators built from Hermitian generators; L03 — spectral theorem requires adjoint",
    "cross": "Module I.2: bra-ket notation builds directly on the inner product structure defined here",
  },
  "refs": [
    "Sakurai & Napolitano — Modern Quantum Mechanics, Ch. 1",
    "Dirac — Principles of Quantum Mechanics, Ch. 1–2",
    "Reed & Simon — Methods of Modern Mathematical Physics Vol. 1, Ch. 2",
    "von Neumann — Mathematical Foundations of QM (1932), historical origin",
  ],
},
"L02": {
  "title": "Unitary Operators and Symmetry Transformations",
  "subtitle": "Preservation of Structure — Rotations, Translations, Evolution",
  "pacing": [
    ("0–15 min",  "Recap: inner products and adjoint from L01"),
    ("15–40 min", "Definition of unitary: UU\u2020 = U\u2020U = 1\u0302; preservation of inner products"),
    ("40–65 min", "Physical incarnations: rotations U(\u03b8), translations T(a), time evolution e^{\u2212i\u0124t/\u210f}"),
    ("65–90 min", "Unitary equivalence; spectral invariance; Stone\u2019s theorem preview"),
  ],
  "outcomes": [
    "Verify unitarity UU\u2020 = 1\u0302 from definition and examples",
    "Prove that unitary maps preserve norms and transition probabilities",
    "Identify unitary operators from physical symmetries (rotation, translation, phase)",
    "Understand U = e^{i\u011c} for Hermitian generator \u011c (Stone\u2019s theorem preview)",
  ],
  "tier_focus": [
    ("HS",    "Rotations as length-preserving maps; rotating a quantum state without losing information"),
    ("BegUG", "Verify UU\u2020 = 1\u0302 for rotation matrices; compute U|\u03c8\u27e9"),
    ("AdvUG", "Show eigenvalues of unitary lie on unit circle; prove spectral invariance"),
    ("MSc",   "One-parameter groups; Stone\u2019s theorem; generator and Lie algebra connection"),
    ("PhD",   "Strongly continuous unitary groups; Hille\u2013Yosida theorem; domain of generator"),
  ],
  "key_formulas": [
    "UU\u2020 = U\u2020U = 1\u0302  (unitarity)",
    "\u27e8U\u03c6|U\u03c8\u27e9 = \u27e8\u03c6|\u03c8\u27e9  (inner product preserved)",
    "|\u03bb| = 1 for all eigenvalues \u03bb of a unitary operator",
    "U(t) = e^{\u2212i\u0124t/\u210f}  (time evolution)",
    "U = e^{i\u03b8G}, G = G\u2020  (Hermitian generator)",
  ],
  "connections": {
    "back": "L01 — adjoint A\u2020 and Hermitian operators are prerequisites",
    "forward": "L03 — spectral theorem applies to Hermitian generators; L05 — Wigner\u2019s theorem",
    "cross": "Module I.2: unitary basis changes are central to representation theory",
  },
  "refs": [
    "Sakurai & Napolitano — Modern Quantum Mechanics, Ch. 4",
    "Weinberg — Lectures on Quantum Mechanics, Ch. 8",
    "Stone (1932) — On One-Parameter Unitary Groups (Annals of Mathematics)",
    "Wigner (1931) — Gruppentheorie, original symmetry classification",
  ],
},
"L03": {
  "title": "Observables, Hermitian Operators, and the Spectral Theorem",
  "subtitle": "Measurement Postulate and Spectral Decomposition",
  "pacing": [
    ("0–20 min",  "Measurement postulate: observables correspond to Hermitian operators; motivation from real outcomes"),
    ("20–45 min", "Key properties: real eigenvalues, orthogonality of eigenvectors, completeness of eigenbasis"),
    ("45–70 min", "Spectral theorem: A = \u03a3\u2093 a|a\u27e9\u27e8a|; functions f(A) of Hermitian operators"),
    ("70–90 min", "Degenerate eigenvalues; continuous spectrum preview; physical examples x\u0302, p\u0302, \u0124"),
  ],
  "outcomes": [
    "State and apply the measurement postulate linking observables to Hermitian operators",
    "Prove Hermitian operators have real eigenvalues and orthogonal eigenvectors",
    "Write the spectral decomposition A = \u03a3\u2093 a|a\u27e9\u27e8a| and apply it",
    "Compute f(A) from the spectral decomposition for simple functions",
  ],
  "tier_focus": [
    ("HS",    "Measuring an observable always gives one of its eigenvalues \u2014 Stern\u2013Gerlach story"),
    ("BegUG", "Find eigenvalues/eigenvectors of 2\u00d72 Hermitian matrices; write spectral form"),
    ("AdvUG", "Prove real eigenvalues and orthogonality; handle degenerate case with Gram\u2013Schmidt"),
    ("MSc",   "Spectral theorem in full generality; functions of operators; self-adjoint vs Hermitian"),
    ("PhD",   "Spectral measure and projection-valued measure (PVM); Borel functional calculus"),
  ],
  "key_formulas": [
    "P(a\u2099) = |\u27e8a\u2099|\u03c8\u27e9|\u00b2  (Born rule)",
    "\u27e8A\u27e9 = \u27e8\u03c8|A|\u03c8\u27e9  (expectation value)",
    "A = \u03a3\u2099 a\u2099|a\u2099\u27e9\u27e8a\u2099|  (spectral decomposition)",
    "f(A) = \u03a3\u2099 f(a\u2099)|a\u2099\u27e9\u27e8a\u2099|  (functional calculus)",
    "1\u0302 = \u03a3\u2099 |a\u2099\u27e9\u27e8a\u2099|  (resolution of identity)",
  ],
  "connections": {
    "back": "L01 — Hermitian operators and adjoint structure; L02 — unitary operators are exponents of Hermitian generators",
    "forward": "L04 — e^{iA} uses spectral decomposition; L05 — projectors P = |a\u27e9\u27e8a| are spectral projectors",
    "cross": "Module I.3: harmonic oscillator Hamiltonian diagonalised using spectral theorem",
  },
  "refs": [
    "Sakurai & Napolitano — Modern Quantum Mechanics, Ch. 1 (§1.3–1.5)",
    "Cohen-Tannoudji, Diu & Laloë — Quantum Mechanics Vol. 1, Ch. 2",
    "Shankar — Principles of Quantum Mechanics, Ch. 1",
    "von Neumann (1932) — Mathematical Foundations of QM, Ch. 2–3",
  ],
},
"L04": {
  "title": "Operator Algebra and the Exponential Map",
  "subtitle": "Non-commutativity, Matrix Exponentials, and BCH",
  "pacing": [
    ("0–15 min",  "Operator arithmetic: sums, products, scalar multiples; non-commutativity"),
    ("15–40 min", "Functions of operators via power series and spectral decomposition; matrix exponential"),
    ("40–65 min", "The map e^{i\u03b8A} for Hermitian A: unitarity proof; one-parameter families; applications"),
    ("65–90 min", "Baker\u2013Campbell\u2013Hausdorff (BCH): e^A e^B = e^{A+B+[A,B]/2+...}; statement and applications"),
  ],
  "outcomes": [
    "Perform operator arithmetic and recognise non-commutativity [A,B] \u2260 0",
    "Compute matrix exponentials via diagonalisation and power series",
    "Prove U = e^{i\u03b8A} is unitary when A is Hermitian",
    "State the BCH lemma and apply it to first order in the commutator",
  ],
  "tier_focus": [
    ("HS",    "Exponential of a matrix as infinite sum; rotation by small angles"),
    ("BegUG", "Compute e^{i\u03b8\u03c3\u2083}; verify unitarity numerically"),
    ("AdvUG", "Prove unitarity of e^{i\u03b8A} rigorously; derive BCH to first order"),
    ("MSc",   "Full BCH series; Zassenhaus formula; group algebra correspondence"),
    ("PhD",   "Convergence of BCH in Banach algebras; Magnus expansion; quantum control"),
  ],
  "key_formulas": [
    "[A,B] = AB \u2212 BA  (commutator)",
    "e^A = \u03a3\u2099 A\u207f/n!  (power series)",
    "e^{i\u03b8\u03c3\u2099} = cos\u03b8 \u00b7 1\u0302 + i sin\u03b8 \u00b7 \u03c3\u2099  (Pauli exponential)",
    "e^A e^B = e^{A+B+[A,B]/2+...}  (BCH formula)",
    "e^A B e^{\u2212A} = B + [A,B] + [A,[A,B]]/2! + ...  (Hadamard identity)",
  ],
  "connections": {
    "back": "L02 — e^{i\u03b8G} generates unitary operators from Hermitian G; L03 — spectral decomposition used to compute e^{iA}",
    "forward": "L05 — BCH and Hadamard identity appear when composing anti-unitary symmetries",
    "cross": "Quantum computing: gate sequences use BCH and Trotter decompositions",
  },
  "refs": [
    "Sakurai & Napolitano — Modern Quantum Mechanics, Ch. 2 (§2.2)",
    "Hall — Lie Groups, Lie Algebras, and Representations, Ch. 2",
    "Hausdorff (1906) — Die symbolische Exponentialformel (original BCH)",
    "Magnus (1954) — On the exponential solution of ODE (Comm. Pure Appl. Math.)",
  ],
},
"L05": {
  "title": "Types of Symmetry Operators and Wigner's Theorem",
  "subtitle": "Linear/Anti-linear Symmetries, Projectors, and Kramers' Theorem",
  "pacing": [
    ("0–20 min",  "Taxonomy: linear vs anti-linear; unitary vs anti-unitary; time-reversal motivation"),
    ("20–50 min", "Wigner\u2019s theorem: every quantum symmetry is unitary or anti-unitary; statement and significance"),
    ("50–70 min", "Projectors P = |\u03c6\u27e9\u27e8\u03c6|: idempotency P\u00b2 = P, Hermiticity, eigenvalues {0,1}"),
    ("70–90 min", "Time-reversal \u0398 as anti-unitary; \u0398\u00b2 = \u00b11\u0302; Kramers\u2019 theorem preview"),
  ],
  "outcomes": [
    "Distinguish linear/unitary from anti-linear/anti-unitary operators with examples",
    "State Wigner\u2019s theorem and explain its physical necessity",
    "Construct rank-1 projectors P = |\u03c6\u27e9\u27e8\u03c6| and verify P\u00b2 = P",
    "Explain how time-reversal is modelled by an anti-unitary operator",
  ],
  "tier_focus": [
    ("HS",    "Symmetry as \u2018physics looks the same\u2019; time-reversal intuitively"),
    ("BegUG", "Compute P\u00b2 for rank-1 projectors; verify P is Hermitian"),
    ("AdvUG", "Prove eigenvalues of P are 0 and 1; orthogonal projector resolution of identity"),
    ("MSc",   "Wigner\u2019s theorem proof sketch; Kramers\u2019 theorem statement"),
    ("PhD",   "Full proof of Wigner\u2019s theorem via Uhlhorn\u2019s approach; anti-unitary representations"),
  ],
  "key_formulas": [
    "Anti-linear: \u0398(\u03b1|\u03c6\u27e9) = \u03b1* \u0398|\u03c6\u27e9",
    "Anti-unitary: \u27e8\u0398\u03c6|\u0398\u03c8\u27e9 = \u27e8\u03c8|\u03c6\u27e9",
    "Projector: P = |\u03c6\u27e9\u27e8\u03c6|, P\u00b2 = P, P\u2020 = P",
    "\u03c3(P) = {0, 1}  (projector eigenvalues)",
    "Kramers: \u0398\u00b2 = \u22121\u0302, [\u0124,\u0398]=0 \u21d2 two-fold degeneracy",
  ],
  "connections": {
    "back": "L01 — projectors P\u2099 = |a\u2099\u27e9\u27e8a\u2099| appear in spectral decomposition; L02 — unitary operators form one half of Wigner\u2019s classification",
    "forward": "Future modules: anti-unitary symmetries in topological phases; CPT theorem in QFT",
    "cross": "Condensed matter: Kramers degeneracy is protected by time-reversal in topological insulators",
  },
  "refs": [
    "Sakurai & Napolitano — Modern Quantum Mechanics, Ch. 4 (§4.4)",
    "Wigner (1931) — Gruppentheorie (original symmetry theorem)",
    "Kramers (1930) — General Theory of Paramagnetic Rotation",
    "Uhlhorn (1963) — Simplified proof (Arkiv för Fysik 23)",
  ],
},
}

# ─────────────────────────────────────────────────────────────
# ARTIFACT CONTENT PER LECTURE
# ─────────────────────────────────────────────────────────────
ARTIFACTS = {
# ══════════════════════════════════════════════════════════════
"L01": {
# ══════════════════════════════════════════════════════════════
"CQ": {
  "questions": [
    ("MC", "Which of the following is NOT an axiom of an inner product space?",
     ["(A) \u27e8\u03c6|\u03c8\u27e9 = \u27e8\u03c8|\u03c6\u27e9* \u2003 (B) \u27e8\u03c8|\u03c8\u27e9 \u2265 0 \u2003 (C) \u27e8\u03c8|\u03c8\u27e9 = 1 always \u2003 (D) linearity in second argument"],
     "Answer: (C). Normalisation \u27e8\u03c8|\u03c8\u27e9 = 1 is a condition on specific states, not an axiom of the inner product."),
    ("MC", "The adjoint A\u2020 of a matrix A is defined by:",
     ["(A) A\u2020 = A\u1d40 (transpose) \u2003 (B) A\u2020 = A* (complex conjugate) \u2003 (C) A\u2020 = (A*)^\u1d40 (conjugate transpose) \u2003 (D) A\u2020 = A\u22121"],
     "Answer: (C). The adjoint is the conjugate transpose: (A\u2020)\u1d62\u2c7c = A\u2c7c\u1d62*."),
    ("TF", "True or False: Every bounded operator on a Hilbert space is continuous.",
     [], "TRUE. Boundedness and continuity are equivalent for linear operators on Hilbert spaces."),
    ("TF", "True or False: The operator x\u0302 (multiplication by x) on L\u00b2(\u211d) is bounded.",
     [], "FALSE. x\u0302 is unbounded: for \u03c8\u2099 supported near x = n, \u2016x\u0302\u03c8\u2099\u2016 \u2248 n\u2016\u03c8\u2099\u2016 \u2192 \u221e."),
    ("TF", "True or False: If A = A\u2020, all eigenvalues of A are real.",
     [], "TRUE. Proved using \u27e8a|A|a\u27e9 = \u27e8A\u2020a|a\u27e9 = \u27e8Aa|a\u27e9, so a = a*."),
    ("SA", "Why does physics require Hilbert space to be complete (not merely an inner product space)?",
     [], "Completeness ensures that every Cauchy sequence of states converges to a state inside \u210b. Without it, time-evolved states or Fourier-mode limits could \u2018escape\u2019 the space, making dynamics ill-defined."),
    ("SA", "Give one physical example each of a bounded and an unbounded operator on L\u00b2(\u211d).",
     [], "Bounded: spin operator \u015c\u2082 (all eigenvalues \u00b1\u210f/2, so finite norm). Unbounded: position x\u0302 or momentum p\u0302 = \u2212i\u210f\u2202/\u2202x, whose eigenvalues are any real number."),
    ("SA", "State the decomposition of an arbitrary operator A into Hermitian and anti-Hermitian parts, and give its physical significance.",
     [], "A = (A + A\u2020)/2 + (A \u2212 A\u2020)/2 = A_H + A_{AH}. A_H is Hermitian (observable); A_{AH} is anti-Hermitian (generator of unitary). Every operator has a unique such decomposition."),
  ],
  "rubric": "2 points each: correct answer (1 pt) + correct justification (1 pt). Total: 16 pts."
},
"SPS": {
  "preamble": "Complete all problems. Show all steps and state units where relevant. All operators act on \u2102\u00b2 unless stated otherwise.",
  "partA": [
    ("1", "Compute \u27e8\u03c6|\u03c8\u27e9 for |\u03c6\u27e9 = (1+i, 2)\u1d40/\u221a6 and |\u03c8\u27e9 = (1, 1\u2212i)\u1d40/\u221a3. Verify |\u27e8\u03c6|\u03c8\u27e9|\u00b2 \u2264 \u27e8\u03c6|\u03c6\u27e9\u27e8\u03c8|\u03c8\u27e9."),
    ("2", "For A = [[2, 1+i], [1\u2212i, 3]], compute A\u2020. Verify A = A\u2020."),
    ("3", "For B = [[0, i], [\u2212i, 0]], compute B\u2020. Is B Hermitian or anti-Hermitian?"),
    ("4", "Compute (AB)\u2020 for A = [[1,i],[0,2]] and B = [[1,0],[i,1]]. Verify (AB)\u2020 = B\u2020A\u2020."),
  ],
  "partB": [
    ("5", "The operator \u03c3\u2083 = [[1,0],[0,\u22121]] represents the spin-z observable. Its eigenvalues are \u00b11. Explain why they must be real, given that \u03c3\u2083 is Hermitian."),
    ("6", "An anti-Hermitian operator C satisfies C = \u2212C\u2020. Show that if C|c\u27e9 = c|c\u27e9, then c is purely imaginary. Interpret physically."),
    ("7", "The operator A = [[1,0],[0,\u22121]] + i[[0,1],[1,0]]. Decompose A into its Hermitian and anti-Hermitian parts A_H and A_{AH}."),
  ],
  "partC": [
    ("8", "In the basis {|+\u27e9, |\u2212\u27e9} for spin-1/2, the state |\u03c8\u27e9 = (\u03b1, \u03b2)\u1d40 is represented as a column vector. Write |\u03c8\u27e9 as an abstract ket sum. What is \u27e8+|\u03c8\u27e9?"),
    ("9", "The function \u03c8(x) = (\u03c0\u03c3\u00b2)\u207b\u00b9\u141f\u2074 exp(\u2212x\u00b2/2\u03c3\u00b2) is a Gaussian wavefunction. Verify that \u222b|\u03c8(x)|\u00b2 dx = 1, so \u03c8 \u2208 L\u00b2(\u211d)."),
    ("10", "Explain in two sentences: why does the Hilbert space \u210b for quantum mechanics need to be complex (over \u2102) rather than real (over \u211d)?"),
  ],
  "rubric": "Correct result: 60% | Method & notation: 30% | Interpretation sentence: 10%"
},
"CPS": {
  "preamble": "Four multi-part problems. Full proofs are required. State all assumptions explicitly.",
  "problems": [
    {
      "num": "1", "title": "Hilbert Space Axioms and Cauchy\u2013Schwarz",
      "parts": [
        ("a", "State all four axioms of an inner product on a complex vector space \u210b. [4 marks]"),
        ("b", "Prove the Cauchy\u2013Schwarz inequality: |\u27e8\u03c6|\u03c8\u27e9|\u00b2 \u2264 \u27e8\u03c6|\u03c6\u27e9\u27e8\u03c8|\u03c8\u27e9 for all |\u03c6\u27e9, |\u03c8\u27e9 \u2208 \u210b. [Hint: consider \u2016|\u03c8\u27e9 \u2212 \u27e8\u03c6|\u03c8\u27e9/\u2016\u03c6\u2016\u00b2 \u00b7 |\u03c6\u27e9\u2016\u00b2 \u2265 0.] [6 marks]"),
        ("c", "Deduce the triangle inequality \u2016|\u03c6\u27e9 + |\u03c8\u27e9\u2016 \u2264 \u2016|\u03c6\u27e9\u2016 + \u2016|\u03c8\u27e9\u2016. [3 marks]"),
        ("d", "(PhD extension) State precisely what \u2018completeness\u2019 of \u210b means and why the rationals \u211a are not complete. How does this analogy apply to L\u00b2(\u211d)? [4 marks]"),
      ]
    },
    {
      "num": "2", "title": "Adjoint Properties",
      "parts": [
        ("a", "Using the definition \u27e8\u03c6|A\u03c8\u27e9 = \u27e8A\u2020\u03c6|\u03c8\u27e9, prove that the adjoint is unique. [4 marks]"),
        ("b", "Prove (A\u2020)\u2020 = A for bounded operators. [4 marks]"),
        ("c", "Prove (AB)\u2020 = B\u2020A\u2020. [4 marks]"),
        ("d", "Show that if A = A\u2020 and B = B\u2020, then [A,B] = AB\u2212BA is anti-Hermitian. [3 marks]"),
      ]
    },
    {
      "num": "3", "title": "Bounded and Unbounded Operators",
      "parts": [
        ("a", "Define the operator norm \u2016A\u2016. Prove that \u2016A\u2016 \u2265 0 and that \u2016AB\u2016 \u2264 \u2016A\u2016\u2016B\u2016. [5 marks]"),
        ("b", "Show that a linear operator A: \u210b \u2192 \u210b is bounded if and only if it is continuous. [6 marks]"),
        ("c", "State the Hellinger\u2013Toeplitz theorem: a symmetric operator A defined on all of \u210b is bounded. Why does this imply that unbounded symmetric operators (like x\u0302, p\u0302) cannot be defined everywhere? [4 marks]"),
      ]
    },
    {
      "num": "4", "title": "Hermitian Decomposition and Classification",
      "parts": [
        ("a", "Prove that any operator A decomposes uniquely as A = A_H + A_{AH} where A_H = (A+A\u2020)/2 is Hermitian and A_{AH} = (A\u2212A\u2020)/2 is anti-Hermitian. [5 marks]"),
        ("b", "Show that \u2016A\u2016 = \u2016A\u2020\u2016 for bounded operators. [4 marks]"),
        ("c", "(MSc/PhD) Define the spectrum \u03c3(A) of a bounded operator A. Show that if A = A\u2020 then \u03c3(A) \u2286 \u211d. [6 marks]"),
      ]
    },
  ],
  "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Insight/interpretation (15%)"
},
"SPJ": {
  "title": "Adjoint Calculator and Hilbert Space Verifier",
  "time": "2–4 hours",
  "objective": "Build a Python tool that computes adjoints of complex matrices and verifies Hilbert space axioms for given inner products, with visual output.",
  "spec": [
    "INPUTS: an n\u00d7n complex matrix A (numpy array); optionally a list of test vectors",
    "OUTPUTS: A\u2020 (adjoint); classification (Hermitian / anti-Hermitian / neither / unitary); verification results",
    "Required computations: (i) A\u2020 = (A*)^\u1d40; (ii) check A == A\u2020 to tolerance 10\u207b\u00b9\u00b0; (iii) check A == \u2212A\u2020; (iv) check AA\u2020 == I (unitary); (v) if test vectors given: verify Cauchy\u2013Schwarz and triangle inequality",
    "Visualisation: for 2\u00d72 matrices, plot eigenvalues in the complex plane and label Hermitian/anti-Hermitian/unitary classification",
    "Deliverables: Python script + README (max 1 page) + one worked example (use \u03c3\u2082 = [[0,\u2212i],[i,0]])",
  ],
  "rubric": "Correctness (40%) | Verification tests included (25%) | Clarity of explanation (25%) | Reproducibility (10%)"
},
"CPJ": {
  "title": "Bounded vs. Unbounded Operators: A Comparative Study",
  "time": "8–12 hours",
  "objective": "Investigate and compare the properties of bounded and unbounded operators in a concrete setting, combining analytic and numerical approaches.",
  "spec": [
    "Choose three operators: (i) \u03c3\u2083 on \u2102\u00b2 (bounded); (ii) x\u0302 on L\u00b2([\u2212N,N]) for increasing N (bounded on each finite interval); (iii) p\u0302 = \u2212i\u210f d/dx on L\u00b2(\u211d) (unbounded)",
    "For each operator: compute or estimate the operator norm; classify as bounded/unbounded; identify domain and range",
    "Plot the operator norm of x\u0302 restricted to L\u00b2([\u2212N,N]) as a function of N. What does the limit N\u2192\u221e tell you?",
    "Discuss: why do physicists routinely use unbounded operators (x\u0302, p\u0302, \u0124) in QM? What mathematical care is needed?",
    "Deliverable: 5\u20138 page report with: operator analysis, numerical plots, and a section on \u2018domain hazards\u2019",
  ],
  "rubric": "Technical correctness (30%) | Conceptual synthesis (35%) | Depth & structure (25%) | Originality (10%)"
},
"WRQ": {
  "question": "Why is completeness physically necessary in quantum mechanics? Could a non-complete inner product space serve as the state space of a quantum theory?",
  "scope": "5–8 hours",
  "method": [
    "Review the mathematical definition of completeness (Cauchy sequences converging within the space)",
    "Identify at least two specific QM operations that require completeness: e.g., time evolution U(t) = e^{\u2212i\u0124t/\u210f} (limits of partial sums must stay in \u210b); Fourier-mode expansions of wave packets",
    "Construct a concrete counterexample: the space of polynomials P on [0,1] with L\u00b2 inner product is not complete. What goes wrong for a sequence of polynomials converging to a non-polynomial function?",
    "Summarise: which physical predictions would break down in a non-complete state space?",
  ],
  "deliverable": "2–5 page memo: question statement, method, evidence (mathematical + physical), conclusion, 5–8 references",
  "rubric": "Scope & method (25%) | Evidence quality (25%) | Technical content (25%) | Argument quality (25%)"
},
"ORQ": {
  "question": "Is complex Hilbert space essential for quantum mechanics, or could a real or quaternionic Hilbert space work? What would change about observables, interference, and symmetry?",
  "scope": "10–20 hours",
  "framing": [
    "The standard formulation uses \u210b over \u2102. Recent work (Hardy 2001; Chiribella et al. 2011; Renou et al. 2021) revisits whether real QM is operationally distinguishable from complex QM.",
    "Consider: (i) real Hilbert space \u2014 can you define a consistent Born rule and unitary dynamics? (ii) quaternionic QM \u2014 what breaks? (iii) the role of complex structure in defining e^{iA} for Hermitian A.",
    "Focus your analysis on one specific aspect: e.g., interference in a triple-slit experiment as a test of complex structure.",
  ],
  "deliverable": "5\u201310 page proposal-style note: motivation, what is known, your position, how you would test/argue it, limitations",
  "rubric": "Clarity + framing (25%) | Depth of engagement (25%) | Novelty and plausibility (25%) | Awareness of limitations (25%)"
},
},  # end L01

# ══════════════════════════════════════════════════════════════
"L02": {
# ══════════════════════════════════════════════════════════════
"CQ": {
  "questions": [
    ("MC", "A unitary operator U satisfies:",
     ["(A) U\u2020U = 1\u0302 but not UU\u2020 = 1\u0302 in general \u2003 (B) UU\u2020 = U\u2020U = 1\u0302 \u2003 (C) U = U\u2020 \u2003 (D) U = \u2212U\u2020"],
     "Answer: (B). A unitary operator is both left- and right-invertible with inverse U\u207b\u00b9 = U\u2020."),
    ("MC", "If U is unitary and U|\u03bb\u27e9 = \u03bb|\u03bb\u27e9, which must be true?",
     ["(A) \u03bb \u2208 \u211d \u2003 (B) |\u03bb| = 1 \u2003 (C) \u03bb = \u00b11 \u2003 (D) \u03bb = i"],
     "Answer: (B). Eigenvalues of unitary operators lie on the unit circle: |\u03bb| = 1."),
    ("TF", "True or False: e^{i\u03b8A} is unitary for any operator A.",
     [], "FALSE. A must be Hermitian (A = A\u2020) for e^{i\u03b8A} to be unitary. For non-Hermitian A, the result is generally not unitary."),
    ("TF", "True or False: The time-evolution operator U(t) = e^{\u2212i\u0124t/\u210f} conserves probability.",
     [], "TRUE. Since \u0124 is Hermitian, U(t) is unitary, so \u27e8\u03c8(t)|\u03c8(t)\u27e9 = \u27e8\u03c8(0)|\u03c8(0)\u27e9 = 1."),
    ("TF", "True or False: Unitarily equivalent operators always have the same eigenvalues.",
     [], "TRUE. If B = UAU\u2020 and A|a\u27e9 = a|a\u27e9, then B(U|a\u27e9) = a(U|a\u27e9). Same eigenvalues, different eigenvectors."),
    ("SA", "Explain in physical terms why quantum symmetry transformations must preserve transition probabilities |\u27e8\u03c6|\u03c8\u27e9|\u00b2.",
     [], "Transition probabilities are measurable outcomes of experiments. A symmetry transformation \u2018leaves the physics unchanged\u2019, so it must leave all measurable quantities \u2014 including probabilities \u2014 invariant."),
    ("SA", "State Stone\u2019s theorem informally. Why does it make Hermitian operators fundamental to quantum dynamics?",
     [], "Stone\u2019s theorem: every strongly continuous one-parameter unitary group {U(t)} has a unique self-adjoint generator G with U(t) = e^{\u2212itG}. Conversely, every self-adjoint G generates such a group. This means all continuous symmetries and dynamical evolutions are in bijection with self-adjoint (Hermitian) operators."),
    ("SA", "A 2\u00d72 rotation matrix U(\u03b8) rotates vectors by angle \u03b8. For a quantum system, what is conserved under this rotation, and why?",
     [], "The inner product \u27e8U\u03c6|U\u03c8\u27e9 = \u27e8\u03c6|\u03c8\u27e9 is conserved (unitarity). Therefore all transition probabilities |\u27e8U\u03c6|U\u03c8\u27e9|\u00b2 = |\u27e8\u03c6|\u03c8\u27e9|\u00b2 are conserved. The norm \u2016U|\u03c8\u27e9\u2016 = \u2016|\u03c8\u27e9\u2016 is also preserved."),
  ],
  "rubric": "2 points each: correct answer (1 pt) + correct justification (1 pt). Total: 16 pts."
},
"SPS": {
  "preamble": "All operators act on \u2102\u00b2 (spin-1/2) unless stated. Pauli matrices: \u03c3\u2081 = [[0,1],[1,0]], \u03c3\u2082 = [[0,\u2212i],[i,0]], \u03c3\u2083 = [[1,0],[0,\u22121]].",
  "partA": [
    ("1", "Verify that the 2\u00d72 rotation matrix U(\u03b8) = [[cos\u03b8, \u2212sin\u03b8],[sin\u03b8, cos\u03b8]] is unitary."),
    ("2", "The phase gate P\u03c6 = [[1,0],[0,e^{i\u03c6}]]. (a) Verify P\u03c6 is unitary. (b) Compute P\u03c6|\u03c8\u27e9 for |\u03c8\u27e9 = (1/\u221a2)(|+\u27e9 + |\u2212\u27e9)."),
    ("3", "Compute e^{i\u03b8\u03c3\u2083} using the power series (hint: \u03c3\u2083\u00b2 = 1\u0302). Verify it is unitary."),
    ("4", "If A has eigendecomposition A = \u03a3\u2099 a\u2099|a\u2099\u27e9\u27e8a\u2099|, show that e^{iA} has the same eigenvectors and eigenvalues e^{ia\u2099}."),
  ],
  "partB": [
    ("5", "U = e^{i\u03c0\u03c3\u2082/4}. (a) Compute U explicitly. (b) What physical transformation does U represent on the Bloch sphere?"),
    ("6", "If U and V are unitary, show that UV is also unitary."),
    ("7", "Let A = \u03c3\u2083. Compute \u03c3(\u03c3\u2083) (spectrum). Now compute \u03c3(U\u03c3\u2083U\u2020) for U = e^{i\u03c0\u03c3\u2081/4}. What do you observe?"),
  ],
  "partC": [
    ("8", "The Hadamard gate H = (\u03c3\u2081 + \u03c3\u2083)/\u221a2. Verify H is unitary. Find its eigenvalues. Is H its own inverse?"),
    ("9", "Time evolution with H = (\u210f\u03a9/2)\u03c3\u2083: write |\u03c8(t)\u27e9 = U(t)|+\u27e9. What is P(+, t)?"),
    ("10", "In three sentences, explain the difference between a unitary transformation and a Hermitian operator in terms of their physical roles in quantum mechanics."),
  ],
  "rubric": "Correct result: 60% | Method & notation: 30% | Interpretation sentence: 10%"
},
"CPS": {
  "preamble": "Full proofs required. All operators act on a general Hilbert space \u210b unless otherwise specified.",
  "problems": [
    {
      "num": "1", "title": "Unitarity and Inner Product Preservation",
      "parts": [
        ("a", "Prove: U is unitary if and only if U preserves inner products: \u27e8U\u03c6|U\u03c8\u27e9 = \u27e8\u03c6|\u03c8\u27e9 for all |\u03c6\u27e9, |\u03c8\u27e9 \u2208 \u210b. [6 marks]"),
        ("b", "Deduce that U is an isometry: \u2016U|\u03c8\u27e9\u2016 = \u2016|\u03c8\u27e9\u2016 for all |\u03c8\u27e9. [3 marks]"),
        ("c", "Show all eigenvalues of U lie on the unit circle: |\u03bb| = 1. [4 marks]"),
        ("d", "Give a counterexample: a matrix that is isometric (norm-preserving) but not unitary. [2 marks]"),
      ]
    },
    {
      "num": "2", "title": "The Exponential Map and Unitarity",
      "parts": [
        ("a", "Using the power series definition e^A = \u03a3\u2099 A\u207f/n!, prove that (e^A)\u2020 = e^{A\u2020}. [5 marks]"),
        ("b", "Deduce: if A = A\u2020 (Hermitian), then e^{iA} is unitary. [4 marks]"),
        ("c", "Prove that det(e^A) = e^{Tr(A)} for n\u00d7n matrices. [5 marks]"),
        ("d", "(MSc) State Stone\u2019s theorem precisely. What is the role of strong continuity? [4 marks]"),
      ]
    },
    {
      "num": "3", "title": "Spectral Invariance Under Unitary Conjugation",
      "parts": [
        ("a", "Prove: if A|a\u27e9 = a|a\u27e9, then (UAU\u2020)(U|a\u27e9) = a(U|a\u27e9). Conclude \u03c3(UAU\u2020) = \u03c3(A). [5 marks]"),
        ("b", "Show that Tr(UAU\u2020) = Tr(A) and det(UAU\u2020) = det(A). [4 marks]"),
        ("c", "(PhD) Does spectral invariance hold for unbounded operators under bounded unitary conjugation? State any conditions needed. [5 marks]"),
      ]
    },
    {
      "num": "4", "title": "One-Parameter Unitary Groups",
      "parts": [
        ("a", "Verify the group property: U(s)U(t) = U(s+t) for U(t) = e^{itG}, G = G\u2020. [4 marks]"),
        ("b", "Prove U(t)\u2020 = U(\u2212t). [3 marks]"),
        ("c", "Show that d/dt U(t)|\u03c8\u27e9|_{t=0} = iG|\u03c8\u27e9. Interpret this as the Schrödinger equation with G playing the role of the Hamiltonian. [5 marks]"),
        ("d", "(PhD) Define strong continuity of a one-parameter unitary group. Why is it needed in Stone\u2019s theorem? [4 marks]"),
      ]
    },
  ],
  "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Insight/interpretation (15%)"
},
"SPJ": {
  "title": "Unitary Evolution Animator \u2014 Bloch Sphere",
  "time": "2–4 hours",
  "objective": "Build an interactive or animated visualisation of unitary time evolution of a spin-1/2 state on the Bloch sphere.",
  "spec": [
    "INPUTS: Hamiltonian H = (\u210f\u03a9/2) n\u0302\u00b7\u03c3 (direction n\u0302, frequency \u03a9); initial state |\u03c8\u2080\u27e9 \u2208 \u2102\u00b2",
    "OUTPUTS: animated or plotted trajectory of the Bloch vector r(t) = \u27e8\u03c8(t)|\u03c3|\u03c8(t)\u27e9 on the unit sphere",
    "Required: compute U(t) = e^{\u2212iHt/\u210f} via diagonalisation; verify \u2016r(t)\u2016 = 1 at all times (unitarity check)",
    "Generate at least 3 trajectories for different H (x, y, z rotations). Label the period T = 2\u03c0/\u03a9.",
    "Deliverables: Python script + 1-page README + 3 example plots or animation frames",
  ],
  "rubric": "Correctness (40%) | Verification tests (25%) | Clarity (25%) | Reproducibility (10%)"
},
"CPJ": {
  "title": "Comparing U(1), SU(2), and SO(3): Symmetry Groups in QM",
  "time": "8–12 hours",
  "objective": "Investigate the connections between the rotation groups U(1), SU(2), and SO(3) and their roles in quantum mechanics.",
  "spec": [
    "Section 1: U(1) \u2014 phase symmetry; generators; conservation of probability",
    "Section 2: SU(2) \u2014 2\u00d72 unitary matrices with det=1; generators \u03c3\u1d62/2; relation to 3D rotations via 2:1 homomorphism SU(2) \u2192 SO(3)",
    "Section 3: The spinor double cover \u2014 why a 2\u03c0 rotation of a spin-1/2 state gives a minus sign",
    "Numerical component: plot group multiplication tables for Z\u2084 \u2286 U(1); visualise the 4\u03c0 periodicity of spinors",
    "Deliverable: 5\u20138 page report with proofs, diagrams, and numerical examples",
  ],
  "rubric": "Technical correctness (30%) | Conceptual synthesis (35%) | Depth & structure (25%) | Originality (10%)"
},
"WRQ": {
  "question": "How does Stone\u2019s theorem make Hermitian operators fundamental to all of quantum dynamics and symmetry?",
  "scope": "5–8 hours",
  "method": [
    "State Stone\u2019s theorem precisely (for strongly continuous one-parameter unitary groups on a Hilbert space)",
    "Explain the bijection: {strongly continuous one-parameter unitary groups} \u2194 {self-adjoint operators}",
    "Apply to at least two examples: (i) time evolution with generator H; (ii) spatial translation with generator p\u0302",
    "Discuss: why is strong continuity (not norm-continuity) required? What goes wrong without it?",
  ],
  "deliverable": "2–5 page memo: question, method, evidence, conclusion, 5–8 references",
  "rubric": "Scope & method (25%) | Evidence quality (25%) | Technical content (25%) | Argument quality (25%)"
},
"ORQ": {
  "question": "Could a quantum theory be formulated using a non-unitary time evolution? What would break \u2014 and what is preserved \u2014 in such a theory?",
  "scope": "10–20 hours",
  "framing": [
    "Unitary evolution is a postulate, not derived from first principles. Open quantum systems evolve non-unitarily via Lindblad master equations. Some models (PT-symmetric QM) use non-Hermitian Hamiltonians.",
    "Consider: (i) probability conservation under non-unitary evolution; (ii) whether transition amplitudes remain meaningful; (iii) what \u2018symmetry\u2019 would mean for a non-unitary theory.",
    "Ground your analysis in a specific model: e.g., the decay of an unstable state \u03c8(t) = e^{\u2212\u0393t/2}\u03c8(0) (non-normalised \u2014 why?).",
  ],
  "deliverable": "5\u201310 page proposal-style note: motivation, what is known, your position, how to test, limitations",
  "rubric": "Clarity + framing (25%) | Depth (25%) | Novelty (25%) | Limitations (25%)"
},
},  # end L02

# ══════════════════════════════════════════════════════════════
"L03": {
# ══════════════════════════════════════════════════════════════
"CQ": {
  "questions": [
    ("MC", "According to the measurement postulate, when observable A is measured on |\u03c8\u27e9, the result is:",
     ["(A) always \u27e8\u03c8|A|\u03c8\u27e9 \u2003 (B) a random sample from a Gaussian distribution \u2003 (C) always one of the eigenvalues of A \u2003 (D) the largest eigenvalue"],
     "Answer: (C). Measurement outcomes are always eigenvalues of the corresponding Hermitian operator."),
    ("MC", "The probability of obtaining eigenvalue a\u2099 in state |\u03c8\u27e9 is:",
     ["(A) \u27e8\u03c8|a\u2099\u27e9 \u2003 (B) |\u27e8a\u2099|\u03c8\u27e9|\u00b2 \u2003 (C) \u27e8a\u2099|\u03c8\u27e9 \u2003 (D) \u27e8\u03c8|A|\u03c8\u27e9 / a\u2099"],
     "Answer: (B). Born rule: P(a\u2099) = |\u27e8a\u2099|\u03c8\u27e9|\u00b2."),
    ("TF", "True or False: Eigenvectors of a Hermitian operator for different eigenvalues are automatically orthogonal.",
     [], "TRUE. Proof: a\u2099\u27e8a\u2098|a\u2099\u27e9 = \u27e8a\u2098|A|a\u2099\u27e9 = a\u2098\u27e8a\u2098|a\u2099\u27e9 (using A=A\u2020). So (a\u2099\u2212a\u2098)\u27e8a\u2098|a\u2099\u27e9 = 0, giving \u27e8a\u2098|a\u2099\u27e9 = 0 when a\u2099 \u2260 a\u2098."),
    ("TF", "True or False: The expectation value \u27e8A\u27e9 = \u27e8\u03c8|A|\u03c8\u27e9 is always equal to an eigenvalue of A.",
     [], "FALSE. \u27e8A\u27e9 is a weighted average of eigenvalues and generally lies strictly between them. Only if |\u03c8\u27e9 is an eigenstate does \u27e8A\u27e9 equal an eigenvalue."),
    ("TF", "True or False: For a degenerate eigenvalue, the eigenvectors are uniquely determined.",
     [], "FALSE. For a degenerate eigenvalue a, any vector in the degenerate subspace is an eigenvector. One can choose any orthonormal basis for that subspace (e.g., via Gram\u2013Schmidt)."),
    ("SA", "Why must physical observables correspond to Hermitian operators? Give at least two reasons.",
     [], "(i) Measurement outcomes must be real: Hermitian operators have real eigenvalues. (ii) Orthogonal eigenstates represent mutually exclusive outcomes. (iii) Completeness of eigenbasis ensures all states can be expanded in terms of outcomes."),
    ("SA", "State the spectral theorem (for finite-dimensional Hermitian matrices). What does the resolution of identity 1\u0302 = \u03a3|a\u2099\u27e9\u27e8a\u2099| physically mean?",
     [], "Spectral theorem: every n\u00d7n Hermitian matrix has n real eigenvalues and n orthonormal eigenvectors forming a complete basis, with A = \u03a3 a\u2099|a\u2099\u27e9\u27e8a\u2099|. The resolution of identity means that any state can be expanded as |\u03c8\u27e9 = \u03a3|a\u2099\u27e9\u27e8a\u2099|\u03c8\u27e9, i.e., \u2018completeness\u2019 of measurement outcomes."),
    ("SA", "Explain how the Stern\u2013Gerlach experiment directly demonstrates the measurement postulate.",
     [], "The SG apparatus separates silver atoms into discrete spots corresponding to the eigenvalues S_z = +\u210f/2 and S_z = \u2212\u210f/2 of the spin-z operator. No intermediate values are observed, confirming that measurement outcomes are eigenvalues of the Hermitian observable."),
  ],
  "rubric": "2 points each: correct answer (1 pt) + correct justification (1 pt). Total: 16 pts."
},
"SPS": {
  "preamble": "Spin-1/2: |+\u27e9 = (1,0)\u1d40, |\u2212\u27e9 = (0,1)\u1d40. Pauli matrices as defined previously.",
  "partA": [
    ("1", "Diagonalise A = [[3,1],[1,3]]. Find eigenvalues and orthonormal eigenvectors. Write the spectral decomposition A = \u03a3 a\u2099|a\u2099\u27e9\u27e8a\u2099|."),
    ("2", "For |\u03c8\u27e9 = (3/5)|+\u27e9 + (4i/5)|\u2212\u27e9, compute: (a) P(+\u210f/2) and P(\u2212\u210f/2) for S_z; (b) \u27e8S_z\u27e9; (c) (\u0394S_z)\u00b2."),
    ("3", "Use the spectral decomposition of \u03c3\u2081 to compute e^{i\u03b8\u03c3\u2081}. Verify the result matches cos\u03b8 \u00b7 1\u0302 + i sin\u03b8 \u00b7 \u03c3\u2081."),
    ("4", "For A = [[5,0,0],[0,2,0],[0,0,2]] (degenerate), write all possible spectral decompositions. What is the freedom in the degenerate eigenspace?"),
  ],
  "partB": [
    ("5", "A particle is in state |\u03c8\u27e9 = (1/\u221a3)(|+\u27e9 + |\u2212\u27e9 + |0\u27e9) for a spin-1 system with S_z \u2208 {\u210f, 0, \u2212\u210f}. Compute P(\u210f), P(0), P(\u2212\u210f). What is \u27e8S_z\u27e9?"),
    ("6", "After measuring S_z on |\u03c8\u27e9 = (1/\u221a2)(|+\u27e9 + |\u2212\u27e9) and obtaining +\u210f/2, what is the post-measurement state? What is the probability of then obtaining +\u210f/2 again if S_z is measured immediately?"),
    ("7", "The energy eigenvalues of a particle in a box are E\u2099 = n\u00b2\u03c0\u00b2\u210f\u00b2/(2mL\u00b2). For |\u03c8\u27e9 = (1/\u221a5)(|1\u27e9 + 2|2\u27e9), compute \u27e8H\u27e9 and (\u0394H)\u00b2."),
  ],
  "partC": [
    ("8", "In the S_z eigenbasis, |\u03c8\u27e9 has components c\u00b1 = \u27e8\u00b1|\u03c8\u27e9. Write the S_x eigenstates |+_x\u27e9, |\u2212_x\u27e9 in terms of |+\u27e9, |\u2212\u27e9. Compute c\u00b1^x = \u27e8\u00b1_x|\u03c8\u27e9 for |\u03c8\u27e9 = |+\u27e9."),
    ("9", "Define the projection operator P\u2099 = |a\u2099\u27e9\u27e8a\u2099|. Show that \u27e8\u03c8|P\u2099|\u03c8\u27e9 = P(a\u2099). How does this relate the spectral decomposition to the Born rule?"),
    ("10", "In two paragraphs, compare the Sakurai (operational) and Dirac (abstract) perspectives on the measurement postulate. What does each approach take as primary?"),
  ],
  "rubric": "Correct result: 60% | Method & notation: 30% | Interpretation sentence: 10%"
},
"CPS": {
  "preamble": "Full proofs required. Work in a general finite-dimensional Hilbert space unless otherwise specified.",
  "problems": [
    {
      "num": "1", "title": "Real Eigenvalues and Orthogonality for Hermitian Operators",
      "parts": [
        ("a", "Prove: if A = A\u2020 and A|a\u27e9 = a|a\u27e9, then a \u2208 \u211d. [4 marks]"),
        ("b", "Prove: if A = A\u2020 and a\u2099 \u2260 a\u2098, then \u27e8a\u2098|a\u2099\u27e9 = 0. [5 marks]"),
        ("c", "For a degenerate eigenvalue a, the eigenspace E_a = {|\u03c8\u27e9 : A|\u03c8\u27e9 = a|\u03c8\u27e9} is a subspace. Prove this and show how to choose an orthonormal basis for E_a via Gram\u2013Schmidt. [5 marks]"),
        ("d", "State the spectral theorem for finite-dimensional Hermitian matrices. What additional statement is needed to guarantee a complete eigenbasis (not just an orthonormal set)? [3 marks]"),
      ]
    },
    {
      "num": "2", "title": "Spectral Decomposition and Functional Calculus",
      "parts": [
        ("a", "Given A = \u03a3\u2099 a\u2099|a\u2099\u27e9\u27e8a\u2099|, prove that f(A) = \u03a3\u2099 f(a\u2099)|a\u2099\u27e9\u27e8a\u2099| has eigenvalues {f(a\u2099)} and the same eigenvectors {|a\u2099\u27e9}. [4 marks]"),
        ("b", "Show that e^{iA} is unitary when A = A\u2020 using the spectral decomposition. [4 marks]"),
        ("c", "Prove the Parseval identity: for |\u03c8\u27e9 = \u03a3\u2099 c\u2099|a\u2099\u27e9, we have \u2016|\u03c8\u27e9\u2016\u00b2 = \u03a3\u2099 |c\u2099|\u00b2. [4 marks]"),
        ("d", "(MSc/PhD) Discuss why \u2018Hermitian\u2019 and \u2018self-adjoint\u2019 are distinct for unbounded operators. Give an example. [5 marks]"),
      ]
    },
    {
      "num": "3", "title": "Projection-Valued Measures",
      "parts": [
        ("a", "Define a rank-1 projector P = |\u03c6\u27e9\u27e8\u03c6|. Prove: (i) P\u00b2 = P; (ii) P = P\u2020; (iii) eigenvalues of P are 0 and 1. [6 marks]"),
        ("b", "Let {P\u2099} be a set of orthogonal projectors with P\u2099P\u2098 = \u03b4\u2098\u2099P\u2099 and \u03a3\u2099P\u2099 = 1\u0302. Show that A = \u03a3\u2099 a\u2099P\u2099 is Hermitian with eigenvalues {a\u2099}. [5 marks]"),
        ("c", "(PhD) Define a projection-valued measure (PVM) for a Borel subset E \u2286 \u211d. How does it generalise the discrete spectral decomposition to operators with continuous spectrum? [5 marks]"),
      ]
    },
    {
      "num": "4", "title": "Variance and Uncertainty",
      "parts": [
        ("a", "For observable A in state |\u03c8\u27e9, prove (\u0394A)\u00b2 = \u27e8A\u00b2\u27e9 \u2212 \u27e8A\u27e9\u00b2 \u2265 0 using the spectral decomposition. [5 marks]"),
        ("b", "Show \u0394A = 0 if and only if |\u03c8\u27e9 is an eigenstate of A. [4 marks]"),
        ("c", "State and prove the Robertson uncertainty relation \u0394A \u00b7 \u0394B \u2265 \u00bd|\u27e8[A,B]\u27e9| for Hermitian A, B. [6 marks]"),
      ]
    },
  ],
  "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Insight (15%)"
},
"SPJ": {
  "title": "Eigenvalue Explorer and Spectral Decomposition Visualiser",
  "time": "2–4 hours",
  "objective": "Build a Python tool that diagonalises Hermitian matrices, computes spectral decompositions, and visualises measurement probability distributions.",
  "spec": [
    "INPUTS: n\u00d7n Hermitian matrix A (numpy array); optionally a state vector |\u03c8\u27e9",
    "OUTPUTS: eigenvalues, eigenvectors, spectral form A = \u03a3 a\u2099|a\u2099\u27e9\u27e8a\u2099|; if |\u03c8\u27e9 given: probabilities P(a\u2099), expectation \u27e8A\u27e9, variance (\u0394A)\u00b2",
    "Required checks: verify \u03a3 P(a\u2099) = 1; verify spectral reconstruction A = \u03a3 a\u2099 P\u2099 to tolerance 10\u207b\u00b9\u00b0; verify f(A) for f(x) = e^{ix}",
    "Visualisation: bar chart of P(a\u2099) for the given state; eigenvalue plot in the real line",
    "Deliverables: Python script + 1-page README + worked example (use A = [[2,1],[1,2]], |\u03c8\u27e9 = (1,0)\u1d40)",
  ],
  "rubric": "Correctness (40%) | Verification tests (25%) | Clarity (25%) | Reproducibility (10%)"
},
"CPJ": {
  "title": "Spectral Resolution of the Quantum Harmonic Oscillator",
  "time": "8–12 hours",
  "objective": "Implement and analyse the spectral decomposition of the quantum harmonic oscillator Hamiltonian H = \u210f\u03a9(N\u0302 + 1/2), where N\u0302 = a\u2020a is the number operator.",
  "spec": [
    "Represent H on a finite-dimensional Fock space truncated at n_max = 30",
    "Compute: energy eigenvalues E\u2099 = \u210f\u03a9(n + 1/2); eigenstates |n\u27e9; projection operators P\u2099 = |n\u27e9\u27e8n|",
    "For the coherent state |\u03b1\u27e9 (\u03b1 = 1.5): compute P(n) = |\u27e8n|\u03b1\u27e9|\u00b2 (Poisson distribution); compare with exact formula",
    "Compute \u27e8H\u27e9 and \u0394H for the coherent state; compare with \u210f\u03a9(|\u03b1|\u00b2 + 1/2)",
    "Section: discuss why coherent states are not energy eigenstates yet have well-defined classical limit",
    "Deliverable: 5\u20138 page report + appendix with code",
  ],
  "rubric": "Technical correctness (30%) | Conceptual synthesis (35%) | Depth & structure (25%) | Originality (10%)"
},
"WRQ": {
  "question": "How did the Stern\u2013Gerlach experiment (1922) change physicists\u2019 understanding of quantum measurement, and how does it illustrate the measurement postulate as formulated by von Neumann?",
  "scope": "5–8 hours",
  "method": [
    "Describe the experimental setup and results (discrete spots, not a continuous distribution)",
    "Explain how the results forced the conclusion that angular momentum is quantised (eigenvalues of S_z)",
    "Connect to von Neumann\u2019s (1932) measurement postulate: state collapse upon measurement",
    "Discuss: what would a classical spin theory have predicted? How do the results falsify it?",
  ],
  "deliverable": "2–5 page memo: historical + mathematical analysis, 5–8 references",
  "rubric": "Scope & method (25%) | Evidence (25%) | Technical content (25%) | Argument (25%)"
},
"ORQ": {
  "question": "Can the quantum measurement postulate be derived from more primitive axioms, or must it always be postulated independently? What does decoherence theory add?",
  "scope": "10–20 hours",
  "framing": [
    "The measurement postulate (state collapse + Born rule) is arguably the most controversial axiom of QM. Various interpretations (Copenhagen, Many-Worlds, Relational QM, Consistent Histories) treat it differently.",
    "Decoherence (Zeh, Zurek 1970s\u20131990s) shows how classical outcomes emerge from entanglement with the environment, but does not by itself derive the Born rule.",
    "Consider Gleason\u2019s theorem: the Born rule is the unique measure on a Hilbert space satisfying certain natural conditions. Does this constitute a \u2018derivation\u2019?",
  ],
  "deliverable": "5\u201310 page proposal-style note: motivation, what is known, your analysis, limitations",
  "rubric": "Clarity (25%) | Depth (25%) | Novelty (25%) | Limitations (25%)"
},
},  # end L03

# ══════════════════════════════════════════════════════════════
"L04": {
# ══════════════════════════════════════════════════════════════
"CQ": {
  "questions": [
    ("MC", "The commutator [A,B] = AB \u2212 BA satisfies:",
     ["(A) [A,B] = [B,A] \u2003 (B) [A,B] = \u2212[B,A] \u2003 (C) [A,B] = 0 always \u2003 (D) [A,B] = AB always"],
     "Answer: (B). The commutator is antisymmetric: [A,B] = AB \u2212 BA = \u2212(BA \u2212 AB) = \u2212[B,A]."),
    ("MC", "For Pauli matrices, e^{i\u03b8\u03c3\u2099} equals:",
     ["(A) e^{i\u03b8} 1\u0302 \u2003 (B) cos\u03b8 \u00b7 1\u0302 + i sin\u03b8 \u00b7 \u03c3\u2099 \u2003 (C) (1+i\u03b8\u03c3\u2099) \u2003 (D) i\u03b8 \u03c3\u2099"],
     "Answer: (B). Using \u03c3\u2099\u00b2 = 1\u0302: the series splits into even (cosine) and odd (sine) parts."),
    ("TF", "True or False: e^{A+B} = e^A e^B for all operators A, B.",
     [], "FALSE. This holds only when [A,B] = 0. In general, e^A e^B = e^{A+B+[A,B]/2+...} (BCH formula)."),
    ("TF", "True or False: The Hadamard identity states e^A B e^{\u2212A} = B + [A,B] + [A,[A,B]]/2! + ...",
     [], "TRUE. This is the adjoint action of e^A on B, expressed as an exponential of the commutator."),
    ("TF", "True or False: If [A,B] = 0, the BCH formula gives e^A e^B = e^{A+B}.",
     [], "TRUE. When commutators vanish, all higher-order BCH terms vanish, and the formula reduces to the commutative case."),
    ("SA", "Why is non-commutativity of operators fundamental to quantum mechanics? Give the most important physical consequence.",
     [], "Non-commutativity ([A,B] \u2260 0) means operators cannot be simultaneously diagonalised. The most important consequence is the Heisenberg uncertainty principle: for [x\u0302,p\u0302] = i\u210f, we get \u0394x\u00b7\u0394p \u2265 \u210f/2, meaning position and momentum cannot both be sharp simultaneously."),
    ("SA", "Explain the Trotter product formula and one physical application.",
     [], "Trotter: e^{(A+B)} = lim_{N\u2192\u221e} (e^{A/N} e^{B/N})^N. Physical application: quantum simulation. A Hamiltonian H = H_1 + H_2 (non-commuting terms) can be simulated by alternating short-time evolutions under H_1 and H_2 separately, with error O(\u03b5\u00b2[H_1,H_2])."),
    ("SA", "State the BCH formula to first order. When is this first-order approximation exact?",
     [], "BCH first order: e^A e^B \u2248 e^{A+B+[A,B]/2}. This approximation is exact when [A,B] commutes with both A and B (so all higher commutators vanish). Example: A = i\u03b1p\u0302/\u210f, B = i\u03b2x\u0302/\u210f, [A,B] = \u2212\u03b1\u03b2 (a scalar), so BCH is exact: the Weyl relation."),
  ],
  "rubric": "2 points each. Total: 16 pts."
},
"SPS": {
  "preamble": "Pauli matrices as before. Use \u210f = 1 unless specified.",
  "partA": [
    ("1", "Compute [A,B] for A = \u03c3\u2081, B = \u03c3\u2082. Verify your answer equals 2i\u03c3\u2083."),
    ("2", "Compute e^{i\u03b8\u03c3\u2083} using the power series. Show it equals diag(e^{i\u03b8}, e^{\u2212i\u03b8})."),
    ("3", "Compute e^{i\u03c0\u03c3\u2081/2} explicitly. What physical operation does this represent on a spin-1/2 state?"),
    ("4", "Apply the Hadamard identity to compute e^{i\u03b8\u03c3\u2083} \u03c3\u2081 e^{\u2212i\u03b8\u03c3\u2083} to first order in \u03b8. Then compute it exactly."),
  ],
  "partB": [
    ("5", "Verify the Jacobi identity: [[A,B],C] + [[B,C],A] + [[C,A],B] = 0 for A = \u03c3\u2081, B = \u03c3\u2082, C = \u03c3\u2083."),
    ("6", "Use the BCH formula to first order to approximate e^{\u03b5\u03c3\u2081} e^{\u03b5\u03c3\u2082} for small \u03b5. Compare with exact computation for \u03b5 = 0.1."),
    ("7", "Show that det(e^A) = e^{Tr(A)} for A = i\u03b8\u03c3\u2083. Verify numerically."),
  ],
  "partC": [
    ("8", "The time-evolution operator for H = (\u210f\u03a9/2)(cos\u03c6 \u03c3\u2083 + sin\u03c6 \u03c3\u2081) is U(t) = e^{\u2212iHt/\u210f}. Write U(t) in closed form using the Pauli exponential identity."),
    ("9", "The Trotter approximation for e^{\u03b5(\u03c3\u2081+\u03c3\u2083)} is (e^{\u03b5\u03c3\u2081/N} e^{\u03b5\u03c3\u2083/N})^N. For N=1 and \u03b5=0.5, compute both sides explicitly and find the error."),
    ("10", "Explain in two paragraphs why the BCH formula is important for quantum computing. Mention at least one specific application (e.g., Trotterisation, dynamical decoupling, or gate synthesis)."),
  ],
  "rubric": "Correct result: 60% | Method & notation: 30% | Interpretation: 10%"
},
"CPS": {
  "preamble": "Full proofs required. Use operator norm where relevant.",
  "problems": [
    {
      "num": "1", "title": "Unitarity of the Exponential Map",
      "parts": [
        ("a", "Using the power series e^A = \u03a3\u2099 A\u207f/n!, prove (e^A)\u2020 = e^{A\u2020}. [5 marks]"),
        ("b", "Deduce: A = A\u2020 \u21d2 e^{iA} is unitary. Provide full justification for using [A,\u2212A] = 0. [5 marks]"),
        ("c", "Prove the inverse: (e^{iA})\u207b\u00b9 = e^{\u2212iA}. [3 marks]"),
        ("d", "(MSc/PhD) For A = A\u2020 bounded, show \u2016e^{iA}\u2016 = 1. [4 marks]"),
      ]
    },
    {
      "num": "2", "title": "The Hadamard Identity",
      "parts": [
        ("a", "Define f(\u03bb) = e^{\u03bbA} B e^{\u2212\u03bbA}. Show f\u2019(\u03bb) = e^{\u03bbA} [A,B] e^{\u2212\u03bbA}. [4 marks]"),
        ("b", "Show f\u2009\u2033(\u03bb) = e^{\u03bbA} [A,[A,B]] e^{\u2212\u03bbA} and derive the Taylor expansion f(1) = B + [A,B] + [A,[A,B]]/2! + ... [6 marks]"),
        ("c", "Apply to compute e^{i\u03b8\u03c3\u2083} \u03c3\u2081 e^{\u2212i\u03b8\u03c3\u2083} exactly (the series terminates after two terms). [5 marks]"),
      ]
    },
    {
      "num": "3", "title": "BCH Formula to Second Order",
      "parts": [
        ("a", "State the BCH formula. Derive it to second order from the identity d/dt log(e^A e^{tB})|_{t=0}. [8 marks]"),
        ("b", "Show that when [A,B] commutes with A and B, the BCH series terminates at first order. [4 marks]"),
        ("c", "Derive the Weyl relation: e^{iap\u0302/\u210f} e^{ibx\u0302/\u210f} = e^{\u2212iab/\u210f} e^{i(ap\u0302+bx\u0302)/\u210f}. [4 marks]"),
      ]
    },
    {
      "num": "4", "title": "Commutator Algebra and Lie Structure",
      "parts": [
        ("a", "Prove the Jacobi identity: [[A,B],C] + [[B,C],A] + [[C,A],B] = 0. [5 marks]"),
        ("b", "Show that if A = A\u2020 and B = B\u2020, then i[A,B] is Hermitian. [4 marks]"),
        ("c", "The su(2) Lie algebra is generated by {L\u1d62} with [L\u1d62,L\u2c7c] = i\u03b5\u1d62\u2c7c\u2096L\u2096. Verify this for L\u1d62 = \u03c3\u1d62/2. [4 marks]"),
        ("d", "(PhD) Prove convergence of the BCH series for \u2016A\u2016, \u2016B\u2016 < ln2/2. [4 marks]"),
      ]
    },
  ],
  "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Insight (15%)"
},
"SPJ": {
  "title": "Matrix Exponential Calculator and BCH Visualiser",
  "time": "2–4 hours",
  "objective": "Build a Python tool that computes matrix exponentials and compares the BCH approximation against exact products.",
  "spec": [
    "INPUTS: two n\u00d7n complex matrices A, B (for BCH); or single A (for exponential)",
    "OUTPUTS: e^A (via scipy.linalg.expm for reference and via power series to N terms); e^A e^B; BCH estimate e^{A+B+[A,B]/2}; error \u2016e^Ae^B \u2212 e^{A+B+[A,B]/2}\u2016",
    "Required: Hadamard identity computation e^{\u03b8A}Be^{\u2212\u03b8A} plotted as function of \u03b8 \u2208 [0, 2\u03c0]",
    "Visualisation: plot BCH error vs. \u2016A\u2016 for random skew-Hermitian A, B of increasing norm",
    "Deliverables: Python script + 1-page README + worked example (\u03c3\u2081 and \u03c3\u2082)",
  ],
  "rubric": "Correctness (40%) | Verification tests (25%) | Clarity (25%) | Reproducibility (10%)"
},
"CPJ": {
  "title": "Magnus Expansion and Floquet Theory for Driven Quantum Systems",
  "time": "10–14 hours",
  "objective": "Investigate the Magnus expansion as a systematic generalisation of BCH for time-dependent Hamiltonians.",
  "spec": [
    "Background: for time-dependent H(t), the Magnus expansion U(T) = e^{\u03a9\u2081+\u03a9\u2082+...} where \u03a9\u2081 = \u222b H(t)dt and \u03a9\u2082 = (1/2)\u222b\u222b[H(t),H(t\u2019)]dt\u2019dt",
    "Case study: H(t) = (\u210f\u03a9/2)(cos(\u03c9t)\u03c3\u2081 + sin(\u03c9t)\u03c3\u2082) (resonantly driven spin-1/2 qubit)",
    "Compute \u03a9\u2081 and \u03a9\u2082 analytically; implement U(T) = e^{\u03a9\u2081+\u03a9\u2082} numerically and compare with exact Trotterised evolution",
    "Discuss: when does the Magnus expansion converge? (Condition: \u222b\u2080\u1d40\u2016H(t)\u2016dt < \u03c0)",
    "Deliverable: 6\u20138 page report + appendix with code",
  ],
  "rubric": "Technical correctness (30%) | Conceptual synthesis (35%) | Depth (25%) | Originality (10%)"
},
"WRQ": {
  "question": "How does the Trotter product formula enable quantum simulation of many-body Hamiltonians, and what is its error scaling?",
  "scope": "5–8 hours",
  "method": [
    "State the Trotter product formula: e^{(A+B)} = lim_{N\u2192\u221e} (e^{A/N} e^{B/N})^N",
    "Derive the first-order Trotter error: \u2016e^{\u03b5(A+B)} \u2212 e^{\u03b5A}e^{\u03b5B}\u2016 = O(\u03b5\u00b2\u2016[A,B]\u2016)",
    "Apply to the Heisenberg model H = J \u03a3 S\u1d62\u00b7S\u1d62\u208a\u2081: explain how alternating local gates e^{\u2212iJh\u1d62\u1d62\u208a\u2081\u03b5} approximate the full evolution",
    "Discuss: what determines the number of Trotter steps needed for a desired error \u03b5?",
  ],
  "deliverable": "2–5 page memo with mathematical analysis, 5–8 references",
  "rubric": "Scope (25%) | Evidence (25%) | Technical content (25%) | Argument (25%)"
},
"ORQ": {
  "question": "When does the BCH series converge, and what happens at the boundary of convergence in quantum mechanics?",
  "scope": "10–20 hours",
  "framing": [
    "BCH converges for \u2016A\u2016, \u2016B\u2016 < (ln 2)/2 \u2248 0.347 in Banach algebras. For large operators (like the x\u0302, p\u0302 on L\u00b2(\u211d)), the formal BCH series may not converge.",
    "The Weyl algebra relation e^{iap\u0302}e^{ibx\u0302} = e^{\u2212iab}e^{i(ap\u0302+bx\u0302)} is exact but holds in a sense that bypasses BCH convergence. How?",
    "Relate to Stone\u2013von Neumann theorem: all irreducible representations of the Weyl algebra are unitarily equivalent.",
  ],
  "deliverable": "5\u201310 page proposal-style note",
  "rubric": "Clarity (25%) | Depth (25%) | Novelty (25%) | Limitations (25%)"
},
},  # end L04

# ══════════════════════════════════════════════════════════════
"L05": {
# ══════════════════════════════════════════════════════════════
"CQ": {
  "questions": [
    ("MC", "An anti-linear operator \u0398 satisfies:",
     ["(A) \u0398(\u03b1|\u03c8\u27e9) = \u03b1\u0398|\u03c8\u27e9 \u2003 (B) \u0398(\u03b1|\u03c8\u27e9) = \u03b1*\u0398|\u03c8\u27e9 \u2003 (C) \u0398(\u03b1|\u03c8\u27e9) = |\u03b1|\u0398|\u03c8\u27e9 \u2003 (D) \u0398(\u03b1|\u03c8\u27e9) = 0"],
     "Answer: (B). Anti-linearity means complex coefficients are conjugated: \u0398(\u03b1|\u03c8\u27e9) = \u03b1*\u0398|\u03c8\u27e9."),
    ("MC", "Wigner\u2019s theorem states that any quantum symmetry is implemented by an operator that is:",
     ["(A) Hermitian or anti-Hermitian \u2003 (B) Unitary or anti-unitary \u2003 (C) Bounded or compact \u2003 (D) Self-adjoint"],
     "Answer: (B). Wigner\u2019s theorem: every bijection on projective Hilbert space preserving transition probabilities is induced by a unitary or anti-unitary operator."),
    ("TF", "True or False: A rank-1 projector P = |\u03c6\u27e9\u27e8\u03c6| satisfies P\u00b2 = P.",
     [], "TRUE. P\u00b2 = (|\u03c6\u27e9\u27e8\u03c6|)(|\u03c6\u27e9\u27e8\u03c6|) = |\u03c6\u27e9(\u27e8\u03c6|\u03c6\u27e9)\u27e8\u03c6| = |\u03c6\u27e9\u00b7 1 \u00b7\u27e8\u03c6| = P. (Requires \u27e8\u03c6|\u03c6\u27e9 = 1.)"),
    ("TF", "True or False: Time-reversal can be represented by a unitary operator for a spin-1/2 particle.",
     [], "FALSE. Time-reversal must be anti-unitary for a spin-1/2 particle. A linear unitary T with T S\u1d62 T\u207b\u00b9 = \u2212S\u1d62 would require iT = \u2212Ti (from [T,i] involving the complex unit), which is impossible for a linear operator."),
    ("TF", "True or False: Kramers\u2019 theorem states that for \u0398\u00b2 = \u22121\u0302, every energy level of a time-reversal invariant system is at least doubly degenerate.",
     [], "TRUE. If |\u03c8\u27e9 and \u0398|\u03c8\u27e9 have the same energy, and \u0398\u00b2 = \u22121\u0302 implies \u27e8\u03c8|\u0398|\u03c8\u27e9 = 0 (they are orthogonal), so they constitute two distinct eigenstates with the same energy."),
    ("SA", "Explain in physical terms why time-reversal is anti-unitary rather than unitary.",
     [], "Under t \u2192 \u2212t, the Schr\u00f6dinger equation i\u210f\u2202_t|\u03c8\u27e9 = H|\u03c8\u27e9 becomes \u2212i\u210f\u2202_t|\u03c8(\u2212t)\u27e9 = H|\u03c8(\u2212t)\u27e9. For this to equal i\u210f\u2202_t|\u03c8\u2019\u27e9 = H|\u03c8\u2019\u27e9, we need complex conjugation of i \u2192 \u2212i, which is anti-linear. No linear (unitary) operator can implement this while preserving the Schr\u00f6dinger equation."),
    ("SA", "State Wigner\u2019s theorem and explain why it is physically significant.",
     [], "Wigner\u2019s theorem: every bijection T on projective Hilbert space P(\u210b) that preserves transition probabilities |\u27e8\u03c6|\u03c8\u27e9|\u00b2 is implemented by an operator on \u210b that is either unitary or anti-unitary, uniquely up to a global phase. Significance: it proves that all quantum symmetries fit into exactly two categories, providing a complete classification. This underpins all of representation theory in QM."),
    ("SA", "What does \u0398\u00b2 = +1\u0302 vs \u0398\u00b2 = \u22121\u0302 imply physically for a time-reversal invariant system?",
     [], "\u0398\u00b2 = +1\u0302 (integer spin / bosons): no Kramers degeneracy guaranteed. Energy levels may be non-degenerate. \u0398\u00b2 = \u22121\u0302 (half-integer spin / fermions): every energy level is at least doubly degenerate (Kramers pair). The degeneracy is protected by TRS and cannot be lifted by any TRS-preserving perturbation."),
  ],
  "rubric": "2 points each. Total: 16 pts."
},
"SPS": {
  "preamble": "Spin-1/2. K = complex conjugation operator. \u0398 = i\u03c3\u2082K for time-reversal of spin-1/2.",
  "partA": [
    ("1", "Verify P = |+\u27e9\u27e8+| satisfies (i) P\u00b2 = P; (ii) P\u2020 = P; (iii) eigenvalues are {0,1}."),
    ("2", "Compute P_x = |+_x\u27e9\u27e8+_x| where |+_x\u27e9 = (|+\u27e9+|\u2212\u27e9)/\u221a2. Write as a 2\u00d72 matrix. Verify P_x\u00b2 = P_x."),
    ("3", "Show that P_+ + P_\u2212 = 1\u0302 where P_\u00b1 = |\u00b1\u27e9\u27e8\u00b1|."),
    ("4", "Compute \u0398|+\u27e9 and \u0398|\u2212\u27e9 where \u0398 = i\u03c3\u2082K. Verify \u0398\u00b2 = \u22121\u0302."),
  ],
  "partB": [
    ("5", "Classify each operator: (i) \u03c3\u2083; (ii) i\u03c3\u2082; (iii) e^{i\u03b8\u03c3\u2081}; (iv) K (complex conjugation); (v) \u0398 = i\u03c3\u2082K. State: linear/anti-linear? unitary/anti-unitary?"),
    ("6", "The parity operator P acts as P\u03c8(x) = \u03c8(\u2212x) on L\u00b2(\u211d). (a) Is P linear or anti-linear? (b) Verify P is unitary. (c) Show P\u00b2 = 1\u0302."),
    ("7", "For |\u03c8\u27e9 = (\u03b1|+\u27e9 + \u03b2|\u2212\u27e9), compute \u27e8\u03c8|P|\u03c8\u27e9 where P = |+\u27e9\u27e8+|. Interpret as a measurement probability."),
  ],
  "partC": [
    ("8", "Two orthogonal projectors P\u2081 = |1\u27e9\u27e8\u2081| and P\u2082 = |2\u27e9\u27e8\u2082| with \u27e81|2\u27e9 = 0. Show (i) P\u2081P\u2082 = 0 and (ii) P\u2081 + P\u2082 is itself a projector. What subspace does P\u2081 + P\u2082 project onto?"),
    ("9", "The time-reversal operator for a two-electron system is \u0398 = \u0398\u2081 \u2297 \u0398\u2082. Compute \u0398\u00b2 for this system. Does Kramers\u2019 theorem apply?"),
    ("10", "In three sentences, explain the physical significance of Kramers degeneracy in condensed matter physics (mention at least one modern application)."),
  ],
  "rubric": "Correct result: 60% | Method & notation: 30% | Interpretation: 10%"
},
"CPS": {
  "preamble": "Full proofs required.",
  "problems": [
    {
      "num": "1", "title": "Projector Algebra",
      "parts": [
        ("a", "Prove that eigenvalues of any projector P (P\u00b2 = P, P = P\u2020) are exactly 0 and 1. [5 marks]"),
        ("b", "Prove: if P and Q are projectors with PQ = 0, then P + Q is a projector onto the direct sum of their ranges. [5 marks]"),
        ("c", "Show that \u27e8\u03c8|P|\u03c8\u27e9 = |\u27e8\u03c6|\u03c8\u27e9|\u00b2 for P = |\u03c6\u27e9\u27e8\u03c6| and normalised |\u03c6\u27e9. Interpret as the Born rule. [4 marks]"),
        ("d", "(MSc) State Gleason\u2019s theorem: the Born rule is the unique probability measure on projectors in a Hilbert space of dimension \u2265 3. Discuss its significance. [3 marks]"),
      ]
    },
    {
      "num": "2", "title": "Anti-linear and Anti-unitary Operators",
      "parts": [
        ("a", "Define anti-linearity precisely. Show that the composition of two anti-linear maps is linear. [4 marks]"),
        ("b", "Define anti-unitarity. Show that an anti-unitary operator \u0398 satisfies |\u27e8\u0398\u03c6|\u0398\u03c8\u27e9| = |\u27e8\u03c6|\u03c8\u27e9|, so transition probabilities are preserved. [5 marks]"),
        ("c", "Let K be complex conjugation on L\u00b2(\u211d) (K\u03c8(x) = \u03c8*(x)). Prove K is anti-unitary. [4 marks]"),
        ("d", "(PhD) State Uhlhorn\u2019s theorem and explain how it strengthens Wigner\u2019s theorem. [4 marks]"),
      ]
    },
    {
      "num": "3", "title": "Wigner\u2019s Theorem",
      "parts": [
        ("a", "State Wigner\u2019s theorem precisely, including the domain (projective Hilbert space), the hypothesis (preservation of |\u27e8\u03c6|\u03c8\u27e9|\u00b2), and the conclusion (unitary or anti-unitary lift). [5 marks]"),
        ("b", "Sketch the proof strategy: how does preservation of orthogonality determine the action of T on a basis, and how is linearity vs. anti-linearity decided? [7 marks]"),
        ("c", "(PhD) Discuss the uniqueness: in what sense is the lift unique, and what ambiguity remains? [4 marks]"),
      ]
    },
    {
      "num": "4", "title": "Kramers\u2019 Theorem",
      "parts": [
        ("a", "Prove: if \u0398\u00b2 = \u22121\u0302 and \u0398H = H\u0398 (time-reversal invariant Hamiltonian), then \u27e8\u03c8|\u0398|\u03c8\u27e9 = 0 for any normalised |\u03c8\u27e9. [5 marks]"),
        ("b", "Deduce Kramers\u2019 theorem: every energy eigenvalue is at least doubly degenerate. [4 marks]"),
        ("c", "Show \u0398\u00b2 = \u22121\u0302 for the spin-1/2 time-reversal operator \u0398 = i\u03c3\u2082K. [4 marks]"),
        ("d", "(MSc/PhD) Show \u0398\u00b2 = +1\u0302 for a spinless particle with \u0398 = K. What does this imply for Kramers degeneracy? [4 marks]"),
      ]
    },
  ],
  "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Insight (15%)"
},
"SPJ": {
  "title": "Symmetry Classifier for Quantum Operators",
  "time": "2–4 hours",
  "objective": "Build a Python tool that classifies 2\u00d72 and 4\u00d74 operators as linear/anti-linear, Hermitian/anti-Hermitian, unitary/anti-unitary, or projector.",
  "spec": [
    "INPUTS: n\u00d7n complex matrix A (or specify anti-linear type); optionally a complex conjugation basis",
    "OUTPUTS: classification report with all tests and pass/fail results",
    "Required checks: (i) Hermitian: A = A\u2020; (ii) anti-Hermitian: A = \u2212A\u2020; (iii) unitary: AA\u2020 = I; (iv) projector: A\u00b2 = A and A = A\u2020; (v) normal: AA\u2020 = A\u2020A",
    "For anti-unitary (supplied as matrix M acting in a fixed basis + complex conjugation): check \u27e8M\u03c6|M\u03c8\u27e9 = \u27e8\u03c8|\u03c6\u27e9",
    "Deliverables: Python script + 1-page README + classification of all \u03c3\u1d62, i\u03c3\u1d62, and \u0398 = i\u03c3\u2082K",
  ],
  "rubric": "Correctness (40%) | Verification tests (25%) | Clarity (25%) | Reproducibility (10%)"
},
"CPJ": {
  "title": "Kramers Degeneracy and Topological Classification",
  "time": "10–14 hours",
  "objective": "Investigate Kramers degeneracy in a spin-orbit coupled Hamiltonian and connect to the topological classification of quantum systems.",
  "spec": [
    "Model: H(\u03b1) = p\u0302\u00b2/(2m) + \u03b1(p\u0302\u00d7\u03c3)\u00b7z\u0302 (Rashba spin-orbit coupling) in 1D, discretised on a chain of N = 20 sites",
    "Compute energy spectrum as function of \u03b1. Show all levels are doubly degenerate for all \u03b1 (Kramers). Verify numerically.",
    "Break Kramers: add a Zeeman term H_Z = B\u03c3\u2083 and show the degeneracy splits. Interpret: which symmetry is broken?",
    "Section: overview of the 10-fold way for classifying topological phases using \u0398\u00b2, \u039e\u00b2 (particle-hole), and their combination. Place the Rashba chain in this classification.",
    "Deliverable: 6\u20138 page report with numerical plots and classification analysis",
  ],
  "rubric": "Technical correctness (30%) | Conceptual synthesis (35%) | Depth (25%) | Originality (10%)"
},
"WRQ": {
  "question": "What is Wigner\u2019s theorem, and why is it considered the foundation of symmetry in quantum mechanics?",
  "scope": "5–8 hours",
  "method": [
    "State the theorem precisely: maps on projective Hilbert space preserving transition probabilities",
    "Explain the two conclusions: unitary symmetries (continuous, e.g., rotations) and anti-unitary symmetries (discrete, e.g., time-reversal)",
    "Trace the historical context: Wigner (1931), Bargmann (1954), Uhlhorn (1963)",
    "Give one concrete example each of a unitary and anti-unitary quantum symmetry, with physical interpretations",
  ],
  "deliverable": "2–5 page memo, 5–8 references",
  "rubric": "Scope (25%) | Evidence (25%) | Technical content (25%) | Argument (25%)"
},
"ORQ": {
  "question": "Could there be quantum symmetries beyond those classified by Wigner\u2019s theorem? What operational assumptions does Wigner\u2019s theorem make, and are they all physically justified?",
  "scope": "10–20 hours",
  "framing": [
    "Wigner\u2019s theorem assumes: (i) states are rays in a complex Hilbert space; (ii) symmetry is a bijection on rays; (iii) transition probabilities |\u27e8\u03c6|\u03c8\u27e9|\u00b2 are preserved.",
    "If any of these assumptions fail, new \u2018symmetries\u2019 might exist. E.g.: (i) quantum mechanics over real or quaternionic Hilbert spaces; (ii) generalised probability theories; (iii) symmetries of density matrices (not just pure states).",
    "Recent work on Generalised Probabilistic Theories (GPTs) shows quantum mechanics is special among all possible theories satisfying certain axioms. Does Wigner\u2019s theorem extend?",
  ],
  "deliverable": "5\u201310 page proposal-style note",
  "rubric": "Clarity (25%) | Depth (25%) | Novelty (25%) | Limitations (25%)"
},
},  # end L05
}

# ─────────────────────────────────────────────────────────────
# PDF BUILDERS
# ─────────────────────────────────────────────────────────────
def build_lecture_sheet(lcode, ldata, out_path):
    doc = make_doc(out_path, lcode, "Lecture Summary Sheet")
    on_page = make_on_page(lcode, f"Lecture Summary Sheet — {lcode}")
    story = []

    # ── Title block ──────────────────────────────────────────
    story.append(Paragraph(f"{lcode} \u2014 Lecture Summary Sheet", sTitle))
    story.append(Paragraph(ldata["title"], S("lt2", font="DejaSans-Bold", size=14, leading=18, color=MIDBLUE, spaceAfter=2)))
    story.append(Paragraph(ldata["subtitle"], sSubtitle))
    story.append(sp(4))
    story.append(hr(DARKBLUE, 2))
    story.append(sp(6))

    # ── Pacing plan ──────────────────────────────────────────
    story.append(Paragraph("90-Minute Pacing Plan", sH1))
    pacing_rows = [[Paragraph("<b>Time</b>", sBodySans),
                    Paragraph("<b>Topic / Activity</b>", sBodySans)]]
    for t, topic in ldata["pacing"]:
        pacing_rows.append([Paragraph(t, sMono),
                             Paragraph(topic, sBody)])
    tbl = Table(pacing_rows, colWidths=[3.5*cm, PAGE_W - 2*MARGIN - 3.5*cm - 0.4*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,0), DARKBLUE),
        ("TEXTCOLOR",   (0,0), (-1,0), colors.white),
        ("FONTNAME",    (0,0), (-1,0), "DejaSans-Bold"),
        ("FONTSIZE",    (0,0), (-1,0), 9),
        ("BACKGROUND",  (0,1), (-1,-1), LIGHTGOLD),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [LIGHTGOLD, colors.white]),
        ("GRID",        (0,0), (-1,-1), 0.5, colors.Color(0.7,0.7,0.7)),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING",(0,0), (-1,-1), 6),
        ("TOPPADDING",  (0,0), (-1,-1), 4),
        ("BOTTOMPADDING",(0,0), (-1,-1), 4),
        ("VALIGN",      (0,0), (-1,-1), "TOP"),
    ]))
    story.append(tbl)
    story.append(sp(10))

    # ── Learning outcomes ────────────────────────────────────
    story.append(Paragraph("Core Learning Outcomes", sH1))
    for item in ldata["outcomes"]:
        story.append(bp(item))
    story.append(sp(10))

    # ── Tier differentiation ─────────────────────────────────
    story.append(Paragraph("Tier Differentiation", sH1))
    tier_data = [[Paragraph("<b>Tier</b>", sBodySans),
                  Paragraph("<b>Content Focus</b>", sBodySans)]]
    tier_bgs = [TIER1_BG, TIER2_BG, TIER3_BG, TIER4_BG, TIER5_BG]
    for (tlabel, tfocus), tbg in zip(ldata["tier_focus"], tier_bgs):
        tier_data.append([Paragraph(f"<b>{tlabel}</b>", sBodySans),
                          Paragraph(tfocus, sBody)])
    t2 = Table(tier_data, colWidths=[2.5*cm, PAGE_W - 2*MARGIN - 2.5*cm - 0.4*cm])
    t2.setStyle(TableStyle([
        ("BACKGROUND",  (0,0), (-1,0), DARKBLUE),
        ("TEXTCOLOR",   (0,0), (-1,0), colors.white),
        ("FONTNAME",    (0,0), (-1,0), "DejaSans-Bold"),
        ("FONTSIZE",    (0,0), (-1,0), 9),
        ("BACKGROUND",  (0,1), (0,1), TIER1_BG),
        ("BACKGROUND",  (0,2), (0,2), TIER2_BG),
        ("BACKGROUND",  (0,3), (0,3), TIER3_BG),
        ("BACKGROUND",  (0,4), (0,4), TIER4_BG),
        ("BACKGROUND",  (0,5), (0,5), TIER5_BG),
        ("ROWBACKGROUNDS", (0,1), (-1,-1), [colors.white]),
        ("GRID",        (0,0), (-1,-1), 0.5, colors.Color(0.7,0.7,0.7)),
        ("LEFTPADDING", (0,0), (-1,-1), 6),
        ("RIGHTPADDING",(0,0), (-1,-1), 6),
        ("TOPPADDING",  (0,0), (-1,-1), 4),
        ("BOTTOMPADDING",(0,0), (-1,-1), 4),
        ("VALIGN",      (0,0), (-1,-1), "TOP"),
    ]))
    story.append(t2)
    story.append(sp(10))

    # ── Key formulas ─────────────────────────────────────────
    story.append(Paragraph("Key Formulas", sH1))
    gold_box(story, [Paragraph(f, sMono) for f in ldata["key_formulas"]])

    # ── Connections ──────────────────────────────────────────
    story.append(Paragraph("Connections", sH1))
    note_box(story, [
        Paragraph(f"<b>\u25c0 Backward:</b> {ldata['connections']['back']}", sBoxBody),
        Paragraph(f"<b>\u25b6 Forward:</b> {ldata['connections']['forward']}", sBoxBody),
        Paragraph(f"<b>\u21c6 Cross-module:</b> {ldata['connections']['cross']}", sBoxBody),
    ])

    # ── References ───────────────────────────────────────────
    story.append(Paragraph("References", sH1))
    for ref in ldata["refs"]:
        story.append(bp(ref))

    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_cq(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "CQ — Concept Questions")
    on_page = make_on_page(lcode, f"Assessment: CQ — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Concept Questions (CQ)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "CQ \u2014 Concept Questions", [
        p("Purpose: Fast checks that a student has the right mental model, not just algebra."),
        p("Format: 8 questions \u2014 mix of multiple-choice (MC), true/false + justify (TF), and short answer (SA)."),
        p("Time: 10\u201315 minutes in class or as a pre-lecture warm-up."),
    ])

    story.append(Paragraph("Questions", sH1))

    qmap = {"MC": "Multiple Choice", "TF": "True / False + Justify", "SA": "Short Answer"}
    for i, (qtype, question, options, answer) in enumerate(artdata["questions"], 1):
        story.append(KeepTogether([
            Paragraph(f"Q{i}. [{qmap[qtype]}]", sQNum),
            Paragraph(question, sBody),
        ]))
        if options:
            for opt in options:
                story.append(Paragraph(f"\u2003{opt}", sBodySans))
        story.append(sp(2))
        story.append(Paragraph(f"\u2794 Answer key: {answer}", sAns))
        story.append(sp(4))

    story.append(hr(ARTPURPLE))
    rubric_box(story, [
        Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)
    ])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_sps(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "SPS — Simple Problem Set")
    on_page = make_on_page(lcode, f"Assessment: SPS — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Simple Problem Set (SPS)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "SPS \u2014 Simple Problem Set", [
        p("Purpose: Build fluency \u2014 correct use of notation and technique."),
        p("Format: 10 problems in three parts. Mostly 1\u20135 steps each."),
        p("Time: Approximately 2\u20134 hours."),
    ])

    note_box(story, [Paragraph(f"<b>Instructions:</b> {artdata['preamble']}", sBoxBody)])

    for part_label, part_items in [("Part A \u2014 Mechanics", artdata["partA"]),
                                    ("Part B \u2014 Interpretation", artdata["partB"]),
                                    ("Part C \u2014 Translation", artdata["partC"])]:
        story.append(Paragraph(part_label, sH2))
        for num, text in part_items:
            story.append(KeepTogether([
                Paragraph(f"<b>{num}.</b>\u2003{text}", sBody),
                sp(3),
            ]))
        story.append(sp(6))

    story.append(hr(ARTPURPLE))
    rubric_box(story, [Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_cps(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "CPS — Complex Problem Set")
    on_page = make_on_page(lcode, f"Assessment: CPS — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Complex Problem Set (CPS)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "CPS \u2014 Complex Problem Set", [
        p("Purpose: Assess structural mastery \u2014 proofs, derivations, multi-step synthesis."),
        p("Format: 4 multi-part problems (a)(b)(c)... Designed for 3\u20136 hours total work."),
        p("Tiers: AdvUG (guided proofs) | MSc (proofs + interpretation) | PhD (proofs + domain conditions)."),
    ])

    note_box(story, [Paragraph(f"<b>Instructions:</b> {artdata['preamble']}", sBoxBody)])

    for prob in artdata["problems"]:
        story.append(Paragraph(f"Problem {prob['num']}: {prob['title']}", sH2))
        for part_label, part_text in prob["parts"]:
            story.append(KeepTogether([
                Paragraph(f"<b>({part_label})</b>\u2003{part_text}", sBody),
                sp(3),
            ]))
        story.append(sp(8))

    story.append(hr(ARTPURPLE))
    rubric_box(story, [Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_spj(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "SPJ — Simple Project")
    on_page = make_on_page(lcode, f"Assessment: SPJ — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Simple Project (SPJ)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "SPJ \u2014 Simple Project", [
        p("Purpose: Hands-on transfer \u2014 build something that uses the formalism."),
        p(f"Scope: {artdata['time']}; well-scaffolded; suitable for all tiers."),
        p("Deliverable: Short code/worksheet + 1\u20133 page report."),
    ])

    story.append(Paragraph(f"Project: {artdata['title']}", sH1))
    story.append(Paragraph(f"<b>Objective:</b> {artdata['objective']}", sBody))
    story.append(sp(6))
    story.append(Paragraph("Specification", sH2))
    gold_box(story, [Paragraph(f"<b>Estimated time:</b> {artdata['time']}", sBoxBody)] +
                    [bp(spec) for spec in artdata["spec"]])

    story.append(hr(ARTPURPLE))
    rubric_box(story, [Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_cpj(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "CPJ — Complex Project")
    on_page = make_on_page(lcode, f"Assessment: CPJ — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Complex Project (CPJ)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "CPJ \u2014 Complex Project", [
        p("Purpose: Synthesis and transfer \u2014 compare frameworks, defend choices."),
        p(f"Scope: {artdata['time']}; open-ended but guided."),
        p("Deliverable: 5\u20138 page report + appendix with computations."),
    ])

    story.append(Paragraph(f"Project: {artdata['title']}", sH1))
    story.append(Paragraph(f"<b>Objective:</b> {artdata['objective']}", sBody))
    story.append(sp(6))
    story.append(Paragraph("Specification", sH2))
    gold_box(story, [Paragraph(f"<b>Estimated time:</b> {artdata['time']}", sBoxBody)] +
                    [bp(spec) for spec in artdata["spec"]])

    story.append(hr(ARTPURPLE))
    rubric_box(story, [Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_wrq(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "WRQ — Well-Defined Research Question")
    on_page = make_on_page(lcode, f"Assessment: WRQ — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Well-Defined Research Question (WRQ)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "WRQ \u2014 Well-Defined Research Question", [
        p("Purpose: Train research-like thinking while remaining bounded \u2014 clear scope, clear output."),
        p(f"Scope: {artdata['scope']}; answerable with literature + calculation + interpretation."),
        p("Deliverable: 2\u20136 page memo (question, method, evidence, conclusion, 5\u201310 references)."),
    ])

    story.append(Paragraph("Research Question", sH1))
    colored_box(story, [Paragraph(artdata["question"], S("rqq", font="DejaSerif-Bold", size=11, leading=15))],
                LIGHTGOLD, ACCENTGOLD)

    story.append(Paragraph("Suggested Method", sH2))
    for step in artdata["method"]:
        story.append(bp(step))
    story.append(sp(6))

    story.append(Paragraph("Deliverable", sH2))
    note_box(story, [Paragraph(artdata["deliverable"], sBoxBody)])

    story.append(hr(ARTPURPLE))
    rubric_box(story, [Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


def build_orq(lcode, ldata, artdata, out_path):
    doc = make_doc(out_path, lcode, "ORQ — Open-Ended Research Question")
    on_page = make_on_page(lcode, f"Assessment: ORQ — {lcode}")
    story = []

    story.append(Paragraph(f"{lcode} \u2014 Open-Ended Research Question (ORQ)", sTitle))
    story.append(Paragraph(ldata["title"], sSubtitle))
    story.append(sp(2)); story.append(hr(ARTTEAL, 2)); story.append(sp(4))

    artifact_box(story, "ORQ \u2014 Open-Ended Research Question", [
        p("Purpose: Expose the frontier \u2014 no single correct answer; evaluates quality of reasoning."),
        p(f"Scope: {artdata['scope']}; may include proposing new definitions or thought experiments."),
        p("Deliverable: 4\u201310 page proposal-style note (motivation, what is known, proposal, how to argue, limitations)."),
    ])

    story.append(Paragraph("Research Question", sH1))
    colored_box(story, [Paragraph(artdata["question"], S("orqq", font="DejaSerif-Bold", size=11, leading=15))],
                LIGHTGOLD, ACCENTGOLD)

    story.append(Paragraph("Framing Notes", sH2))
    for frame in artdata["framing"]:
        story.append(bp(frame))
    story.append(sp(6))

    story.append(Paragraph("Deliverable", sH2))
    note_box(story, [Paragraph(artdata["deliverable"], sBoxBody)])

    story.append(hr(ARTPURPLE))
    rubric_box(story, [Paragraph(f"<b>Rubric:</b> {artdata['rubric']}", sRubric)])
    doc.build(story, onFirstPage=on_page, onLaterPages=on_page)
    print(f"  \u2713 {os.path.basename(out_path)}")


# ─────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────
ARTIFACT_BUILDERS = {
    "CQ":  build_cq,
    "SPS": build_sps,
    "CPS": build_cps,
    "SPJ": build_spj,
    "CPJ": build_cpj,
    "WRQ": build_wrq,
    "ORQ": build_orq,
}

def main():
    out_dir = "/home/claude/pdf_output"
    os.makedirs(out_dir, exist_ok=True)

    for lcode in ["L01", "L02", "L03", "L04", "L05"]:
        print(f"\n[{lcode}] {LECTURES[lcode]['title']}")
        ldata = LECTURES[lcode]

        # Lecture sheet
        build_lecture_sheet(lcode, ldata, f"{out_dir}/{lcode}_lecture_sheet.pdf")

        # Artifact sheets
        for acode, builder in ARTIFACT_BUILDERS.items():
            artdata = ARTIFACTS[lcode][acode]
            builder(lcode, ldata, artdata, f"{out_dir}/{lcode}_{acode}.pdf")

    print(f"\n\u2714 All 40 PDFs written to {out_dir}/")

if __name__ == "__main__":
    main()
