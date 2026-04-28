# QM Course — Lecture Quality Standard

> **Every lecture in this course must conform to this standard.**
> Enforced programmatically by `shared/quality_standard.py`.

---

## Per-Lecture Required Deliverables

| Deliverable | File | Description |
|---|---|---|
| Slide deck (skeleton) | `build/LXX/LXX.pptx` | 5-slide overview deck |
| Slide deck (expanded) | `build/LXX/LXX_expanded.pptx` | Full 12-slide deck with tier content |
| Problem Sheet | `build/LXX/homework/LXX_Problem_Sheet.pdf` | Problems only |
| Suggestions Sheet | `build/LXX/homework/LXX_Suggestions.pdf` | Problems + hints |
| Solutions Sheet | `build/LXX/homework/LXX_Solutions.pdf` | Full worked solutions + bibliography |
| Formula images | `build/LXX/formulas/*.png` | Matplotlib mathtext renders (cached) |
| Lecture JSON | `build/LXX/lecture_content.json` | Machine-readable source of truth |

---

## Per-Tier Structure (×5 tiers per lecture)

Each lecture must contain all five tiers:

| Tier | Label | Audience |
|---|---|---|
| `HS` | High School | Pre-university; complex numbers and arrows |
| `BegUG` | Beginning Undergraduate | First linear algebra + QM course |
| `AdvUG` | Advanced Undergraduate | Proof-based; functional analysis vocabulary |
| `MSc` | Master's Level | Research-ready; Wigner theorem, C*-algebras |
| `PhD` | PhD Level | Domain subtleties, rigged Hilbert spaces |

---

## Per-Tier Required Content

### 1. Narrative
A 1–2 paragraph description of what this tier covers and why.
Must connect to the tier below (prerequisites) and above (what it motivates).

---

### 2. Annotated Bibliography — Three Categories

#### (a) Historical Publications
Original papers that created the ideas taught in this lecture.
- Minimum: **2 entries per tier**
- Each entry must include: authors, year, title, venue, **annotation** (1–2 sentences explaining pedagogical relevance)
- Annotation must say: what to look for, what level to read at, and what it connects to

#### (b) Educational References
Textbooks, lecture notes, and review articles.
- Minimum: **2 entries per tier**
- Entries should increase in sophistication from HS to PhD
- Must include specific chapter/section references where possible

#### (c) Research-Level Material
Research papers, monographs, advanced reviews.
- Minimum: **1 entry per tier** (HS may use accessible reconstruction papers)
- Must include DOI or arXiv URL where available
- Annotation must state: what background is needed to read it

---

### 3. Concept Questions
- Minimum: **5 short questions** per tier
- No calculation required — purely conceptual
- Should expose common misconceptions
- Questions must increase in sophistication across tiers on the same topic

---

### 4. Problem Sets — Two Levels

#### Simple Problems (`problems_simple`)
- Minimum: **3 exercises** per tier
- Each exercise must include:
  - `id` (e.g. `BegUG-A2`)
  - `statement` (complete problem text, LaTeX-formatted)
  - `hints` (2–3 basic hints for the suggestions sheet)
  - `advanced_hints` (1–2 deeper hints)
  - `solution` (complete worked solution for the solutions sheet)
- Accessible with the background stated in the tier narrative
- Focus: computation, translation between forms, direct application

#### Advanced Problems (`problems_advanced`)
- Minimum: **2 exercises** per tier
- Higher difficulty: multi-step derivations, proofs, synthesis across ideas
- Same format as simple problems
- At AdvUG+ level: must contain at least one proof
- At MSc+ level: must connect to research-level ideas

---

### 5. Projects — Two Levels

#### Simple Project (`project_simple`)
- A structured project, **1–3 hours**
- Must include: title, description, deliverable (what the student submits), estimated hours, tools
- Should be completable with the tier's stated background
- Examples: Python calculator, spreadsheet visualization, short written note

#### Advanced Project (`project_advanced`)
- An open-ended project, **5–20 hours**
- Must include same fields as simple project
- Should require synthesis, original exploration, or connection to the next tier
- Examples: mini-survey, mathematical derivation, computational investigation

---

### 6. Research Questions — Two Levels

#### Well-Defined (`research_simple`)
- Scope must be explicitly stated
- `expected_output` must be stated (e.g. "5-page written report with proof outline")
- Background needed must be listed
- Should be achievable in 1–2 weeks of focused work

#### Fully Open (`research_open`)
- Frontier question — no single correct answer
- `connection_to_literature` should point to at least 2 papers
- Should be phrased as a genuine open question, not a disguised exercise
- Background needed must be listed

---

## Formula Rendering Standard

All key formulas must be listed in the `formulas` dict and must:
- Use matplotlib mathtext syntax (no `\xrightarrow`, `\begin{pmatrix}`, `\tfrac`)
- Render cleanly at DPI ≥ 200
- Be cached in `build/LXX/formulas/cache.json`
- Pass the `validate_all_formulas()` check in `shared/formula_renderer.py`

**Forbidden mathtext commands** (replace with alternatives):
| Forbidden | Replacement |
|---|---|
| `\xrightarrow{...}` | `\rightarrow` with text in statement |
| `\begin{pmatrix}` | Use bra-ket form or text description |
| `\tfrac` | `\frac` |
| `\text{...}` inside `\xrightarrow` | Move text outside |

---

## Naming Conventions

| Object | Convention | Example |
|---|---|---|
| Exercise IDs | `TIER-LEVEL+INDEX` | `AdvUG-B1`, `PhD-A2` |
| Formula keys | `snake_case` descriptive | `born_rule`, `completeness` |
| Project difficulty | `"simple"` or `"advanced"` | |
| Research scope | `"well-defined"` or `"open"` | |

---

## Programmatic Validation

Run before every build:
```bash
python3 -c "
from shared.lecture_data import LECTURES
from L01.lecture_content import L01_FULL
from shared.quality_standard import quality_report
print(quality_report(L01_FULL))
"
```

Or validate all loaded lectures:
```bash
python3 -c "
from shared.quality_standard import quality_report, validate_lecture
from L01.lecture_content import L01_FULL
errors = validate_lecture(L01_FULL)
print(f'Errors: {len(errors)}')
for e in errors: print(e)
"
```

---

## Expansion to L02–L12

When expanding a lecture from skeleton to full quality standard:

1. Create `LXX/lecture_content.py` with `LXX_FULL` dict
2. Run `python3 -c "from shared.quality_standard import quality_report; from LXX.lecture_content import LXX_FULL; print(quality_report(LXX_FULL))"` — must pass
3. Run `python3 build_all.py --lecture LXX` — generates skeleton PPTX + formula cache
4. Write `LXX/build_expanded.js` following `L01/build_expanded.js` pattern
5. Add `build_LXX_expanded()` call to `build_all.py`
6. Final build: `python3 build_all.py` — all 13 outputs generated

---

*Quality standard version: 1.0 — April 2026*
*Author: Diego Bragato*
