# QM Module I.1 — Hilbert Space & Operators
### Quantum Mechanics & Quantum Chemistry Programme

A complete, programmatically generated lecture slide deck for **Module I.1** of the QM/QC programme, covering the mathematical foundations of quantum mechanics across five pedagogical tiers.

---

## Repository Structure

```
qm-module-i1/
├── README.md                          ← this file
├── .gitignore
├── package.json                       ← Node.js dependencies
│
├── src/
│   └── generate_lectures.js          ← main generator script (all 5 lectures)
│
├── scripts/
│   └── build.sh                      ← one-command build script
│
├── docs/
│   ├── lecture_generation_prompt.txt ← programme prompt template
│   └── DESIGN.md                     ← design system documentation
│
├── assets/
│   └── L01_merged_reference.pptx     ← original reference deck (style guide)
│
└── generated/
    ├── ModuleI1_L01.pptx             ← The Hilbert Space of Quantum States
    ├── ModuleI1_L02.pptx             ← Unitary Operators & Symmetry Transformations
    ├── ModuleI1_L03.pptx             ← Observables, Hermitian Operators & Spectral Theorem
    ├── ModuleI1_L04.pptx             ← Operator Algebra and the Exponential Map
    └── ModuleI1_L05.pptx             ← Types of Symmetry Operators & Wigner's Theorem
```

---

## Lectures

| Code | Title | Sections | Key Topics |
|------|-------|----------|------------|
| **L01** | The Hilbert Space of Quantum States | L01.1–L01.4 | Inner product, norm, completeness, adjoint Â†, Hermitian/anti-Hermitian operators |
| **L02** | Unitary Operators and Symmetry Transformations | L02.1–L02.3 | Unitarity ÛÛ† = 1̂, Stone's theorem, rotations, translations, time evolution |
| **L03** | Observables, Hermitian Operators & the Spectral Theorem | L03.1–L03.3 | Measurement postulate, spectral decomposition Â = Σaₙ\|aₙ⟩⟨aₙ\|, f(Â), PVM |
| **L04** | Operator Algebra and the Exponential Map | L04.1–L04.3 | Commutator [Â,B̂], matrix exponential e^Â, BCH formula, Hadamard identity |
| **L05** | Types of Symmetry Operators and Wigner's Theorem | L05.1–L05.4 | Anti-linear/anti-unitary operators, Wigner's theorem, projectors, Kramers' theorem |

---

## Each Deck Contains (15 slides)

| Slide | Content |
|-------|---------|
| 1 | **Title slide** — lecture code, title, all 5 tier badges, Ψ motif |
| 2 | **Overview** — 90-min pacing plan, core learning outcomes, tier differentiation, assessment bundle |
| 3 | **Dual-Track** — Geometric/Physical track ↔ Algebraic/Axiomatic track |
| 4–7 | **Content sections** (L0N.1–L0N.4) — derivations, key formulas, worked examples |
| 8–12 | **Per-tier slides** — HS, BegUG, AdvUG, MSc, PhD (objectives, examples, problems, extensions) |
| 13 | **Pitfalls & Misconceptions** — common errors, historical anchors, formula reference |
| 14 | **Assessment & Homework** — 5-tier problem sets, projects, research questions |
| 15 | **References** — primary textbooks, educational refs, historical/research papers |

---

## Five-Tier Pedagogy

| Tier | Level | Focus |
|------|-------|-------|
| **HS** | High School | Geometric intuition; ℝ² and ℂ² as tangible examples |
| **BegUG** | Beginning Undergraduate | Verify axioms; explicit matrix computations |
| **AdvUG** | Advanced Undergraduate | Rigorous proofs; derivations; structural results |
| **MSc** | Master's | Functional analysis; operator theory; spectral measures |
| **PhD** | Doctoral | Domain theory; spectral classification; research extensions |

---

## Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- `pptxgenjs` npm package

### Install & Generate

```bash
# Clone the repo
git clone <repo-url>
cd qm-module-i1

# Install dependencies
npm install

# Generate all 5 lecture decks
npm run generate

# Or use the build script
bash scripts/build.sh
```

Generated `.pptx` files appear in `generated/`.

### Regenerate a Single Lecture

Edit the `lectures` array in `src/generate_lectures.js` and re-run:

```bash
node src/generate_lectures.js
```

---

## Design System

The slide design matches the reference deck (`assets/L01_merged_reference.pptx`):

- **Background**: Deep navy `#0D1B2A` (title/tier/dark slides), white (content slides)
- **Primary accent**: Cyan `#00B4D8`
- **Secondary accents**: Teal `#00897B`, Gold `#F4A261`, Green `#2ECC71`
- **Tier badge colours**: HS=Gold, BegUG=Green, AdvUG=Blue, MSc=Purple, PhD=Coral
- **Fonts**: Cambria (headings), Calibri (body)
- **Layout**: 16:9 (10" × 5.625")

See `docs/DESIGN.md` for full design system documentation.

---

## Programme Context

This module is part of:

```
Series I — Introductory Quantum Mechanics
  └── Module I.1 — Hilbert Space & Operators   ← this repo
       ├── L01: The Hilbert Space of Quantum States
       ├── L02: Unitary Operators & Symmetry Transformations
       ├── L03: Observables, Hermitian Operators & Spectral Theorem
       ├── L04: Operator Algebra and the Exponential Map
       └── L05: Types of Symmetry Operators & Wigner's Theorem
```

The lecture generation prompt template in `docs/lecture_generation_prompt.txt` can be used to generate content for subsequent modules following the same five-tier pedagogical structure.

---

## Extending to New Lectures

1. Add a new entry to the `lectures` array in `src/generate_lectures.js`
2. Follow the data schema defined by existing entries (see comments in source)
3. Run `npm run generate`

To generate a new module from scratch, use the prompt template in `docs/lecture_generation_prompt.txt` with an LLM, then adapt the output into the data schema.

---

## Licence

For academic use only. Content follows the QM/QC Programme pedagogical framework.
