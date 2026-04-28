# QM Bra-Ket Notation — Course Build System

A complete build system for a 12-lecture graduate quantum mechanics course
on Dirac bra-ket notation, targeting five pedagogical tiers simultaneously:
High School · Beginning Undergraduate · Advanced Undergraduate · MSc · PhD.

---

## Repository structure

```
qm-course/
├── shared/                     # Shared Python + Node.js modules
│   ├── design.py               # Colour palette, fonts, layout constants
│   ├── design_tokens.json      # Design tokens exported for Node.js
│   ├── slide_helpers.js        # PptxGenJS primitives (cards, headers, badges)
│   ├── latex_renderer.py       # pdflatex → pdftoppm → PIL pipeline (300 DPI)
│   ├── inline_renderer.py      # Tagged-block → formula-image layout specs
│   ├── rendered_card.js        # Node.js: places text + formula PNGs in cards
│   ├── build_lecture_full.js   # 43-slide full deck builder (CLI)
│   ├── build_lecture_full_data.py  # All tier concept text blocks (tagged format)
│   ├── build_homework.py       # Generates 3 PDF homework sheets per lecture
│   ├── quality_standard.py     # Schema validator for lecture content dicts
│   └── lecture_data.py         # Skeleton metadata for all 12 lectures
│
├── L01/                        # Lecture 1 — fully expanded
│   ├── lecture_content.py      # Complete 5-tier content (quality-standard compliant)
│   ├── concept_diagrams.py     # 14 matplotlib geometric analogy diagrams
│   ├── build_concept_slides.js # Deep concept slide deck builder
│   └── build_expanded.js       # L01 12-slide expanded deck builder
│
├── tools/
│   └── merge_pptx.py           # ZIP-level PPTX merger (preserves all media)
│
├── build_all.py                # Master orchestrator
├── QUALITY_STANDARD.md         # Human-readable schema specification
│
└── build/                      # Generated outputs (committed for convenience)
    ├── L01/
    │   ├── L01_merged.pptx     # ★ MAIN OUTPUT: full + concept slides merged (57 slides)
    │   ├── L01_full.pptx       # Full expanded deck (43 slides, all tiers)
    │   ├── L01_concepts.pptx   # Deep concept slides only (20 slides)
    │   ├── L01_expanded.pptx   # Original 12-slide deck
    │   ├── L01.pptx            # Skeleton 5-slide deck
    │   ├── homework/
    │   │   ├── L01_Problem_Sheet.pdf
    │   │   ├── L01_Suggestions.pdf
    │   │   └── L01_Solutions.pdf
    │   ├── formulas/           # 356 pdflatex-rendered formula PNGs (300 DPI)
    │   └── diagrams/           # 14 matplotlib geometric analogy diagrams
    ├── L02/ … L12/             # Skeleton + full decks for all other lectures
    └── QM_Syllabus.pdf
```

---

## Quick start

### Prerequisites

```bash
# Python packages
pip install matplotlib numpy Pillow reportlab python-pptx lxml --break-system-packages

# Node.js
npm install -g pptxgenjs

# System: TeX Live (pdflatex + pdftoppm)
# Ubuntu/Debian: apt-get install texlive-full poppler-utils
```

### Build everything

```bash
# Build all 12 skeleton decks + syllabus
python3 build_all.py

# Build single lecture
python3 build_all.py --lecture L03

# Build L01 full expanded deck
node shared/build_lecture_full.js \
  --data build/L01/lecture_content.json \
  --out  build/L01/L01_full.pptx \
  --formulas build/L01/formulas

# Build L01 concept diagram slides
python3 L01/concept_diagrams.py build/L01/diagrams
node L01/build_concept_slides.js \
  --data build/L01/lecture_content.json \
  --diag build/L01/diagrams \
  --frm  build/L01/formulas \
  --out  build/L01/L01_concepts.pptx

# Merge full + concept slides
python3 tools/merge_pptx.py

# Build homework PDFs
python3 -c "
from L01.lecture_content import L01_FULL
from shared.build_homework import build_homework_pdfs
build_homework_pdfs(L01_FULL, 'build/L01/homework', 'build/L01/formulas')
"
```

### Validate lecture content

```bash
python3 -c "
from L01.lecture_content import L01_FULL
from shared.quality_standard import quality_report
print(quality_report(L01_FULL))
"
# → ✓ L01: Quality standard PASSED — all 5 tiers complete.
```

---

## The LaTeX engine

All formulas are rendered via a full pdflatex pipeline (`shared/latex_renderer.py`).

**Two critical design decisions:**

1. **Always wrap math as `$\displaystyle ...$`**, never `\[ ... \]`  
   Reason: `\pagecolor` + `\color` put the standalone class into text-mode before
   `\[` is reached, causing exit-code 1 and falling back to matplotlib.

2. **Use `\providecommand`** for any macro the `physics`/`braket` packages already define  
   Reason: `\newcommand` raises an error if the name is already taken.

**Packages loaded:** `amsmath`, `amssymb`, `bm`, `physics`, `mathtools`, `braket`,
`xcolor`, `relsize`, `standalone`.

**Cache:** MD5-keyed JSON cache in each `build/LXX/formulas/cache.json`.
All 12 lectures share the core concept formula cache — only 38 unique renders
needed for the concept text, L02-L12 hit cache instantly.

---

## Inline formula rendering pipeline

Content slides use a three-stage pipeline:

```
build_lecture_full_data.py    →  tagged text blocks
    HEADER: Section Title
    MATH:   \sum_n |n\rangle\langle n| = \hat{I}
    TEXT:   Prose explanation of the result.
    MIXED:  Key result | c_n = \langle n|\psi\rangle

    ↓  InlineRenderer.render_tagged_blocks_batch()

    [{type:"header", text:...},
     {type:"formula", path:"/abs/path/to/formula.png"},
     {type:"text",   text:...}, ...]

    ↓  renderedCard() in rendered_card.js

    Slide card with alternating text + formula images
```

---

## Geometric analogy diagrams (L01)

14 matplotlib diagrams illustrate each core concept through 2D/3D vector-space analogies:

| Tier | Concept | Diagram |
|---|---|---|
| HS | Complex plane | z = a+ib as 2D arrow with components, polar form, conjugate |
| HS | \|z\|² as probability | Right triangle + square on hypotenuse = \|z\|² |
| HS | Interference | 3-panel: φ=0/π/2 constructive/partial/destructive |
| HS | Phase dependence | Cartesian + polar plot of P(φ) = 2+2cosφ |
| BegUG | Basis decomposition | \|ψ⟩ = c₁\|1⟩+c₂\|2⟩ with projection dashes |
| BegUG | Normalisation | Unit circle with normalised states |
| BegUG | Inner product | Projection shadow = c_n = ⟨n\|ψ⟩ |
| AdvUG | Cauchy-Schwarz | Angle between vectors, \|cosθ\| ≤ 1 |
| AdvUG | Triangle inequality | Vector triangle with numerical verification |
| AdvUG | Fubini-Study | Bloch circle with arc = d_FS = arccos\|⟨φ\|ψ⟩\| |
| MSc | Projective space | Lines through origin in ℝ² = rays |
| MSc | Bloch sphere | Full 3D S² with \|0⟩, \|1⟩ poles and general \|ψ⟩ |
| PhD | Completeness | Fourier partial sums converging to √x in L² |
| PhD | Domain subtlety | 𝒟(Â) ⊊ 𝒟(Â†) Venn diagram |

---

## Quality standard

Every lecture must conform to `shared/quality_standard.py`. Per tier (×5):

- **Annotated bibliography**: historical / educational / research (≥2+2+1 entries each with annotation)
- **Concept questions**: ≥5 per tier (no calculation, conceptual)
- **Problem sets**: ≥3 simple + ≥2 advanced (each with statement, hints, advanced hints, full solution)
- **Projects**: 1 simple (1–3h) + 1 advanced (5–20h) with deliverable and tools
- **Research questions**: 1 well-defined (expected output stated) + 1 fully open (literature pointers)

L01 passes with **25 exercises** and **29 annotated references** across 5 tiers.

---

## Expanding to L02–L12

1. Create `L02/lecture_content.py` with `L02_FULL` dict
2. Run quality validator
3. Pre-render formulas: `InlineRenderer(...).render_tagged_blocks_batch(...)`
4. Build full deck: `node shared/build_lecture_full.js --data ... --out ...`
5. Build concept diagrams: `python3 L02/concept_diagrams.py build/L02/diagrams`
6. Build concept slides: `node L02/build_concept_slides.js ...`
7. Merge: `python3 tools/merge_pptx.py` (update insertions for L02)

---

## Authors

Diego Bragato — QM Bra-Ket Notation Course, April 2026
