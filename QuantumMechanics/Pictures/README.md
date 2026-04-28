# QM Module I.3 — Lecture Slide Generator

Automated PPTX generator for **Module I.3: Quantum Dynamics, Perturbation Theory, and Physical Systems** of the QM Programme.

Each lecture produces a standalone 5-slide deck styled to match the course's dark-theme design language, with full five-tier pedagogical differentiation (HS → PhD).

---

## Repository layout

```
qm-module-i3/
├── src/
│   ├── lectures.js        # All content data (10 lectures)
│   ├── theme.js           # Design tokens, colours, shared helpers
│   ├── builder.js         # Core slide-building logic (buildDeck)
│   ├── build-all.js       # CLI: generate all 10 decks at once
│   ├── generate-L01.js    # CLI: generate L01 only
│   ├── generate-L02.js    # CLI: generate L02 only
│   │   …
│   └── generate-L10.js    # CLI: generate L10 only
├── slides/                # ← generated .pptx files (git-tracked)
│   ├── L01_Pure_Mixed_States_and_the_Density_Matrix.pptx
│   ├── L02_Bases_Discrete_and_Continuous.pptx
│   │   …
│   └── L10_TDPT_Open_Systems_and_Many_Body_Preview.pptx
├── assets/                # Reference files (syllabus, example deck, prompt)
│   ├── quantum_mechanics_syllabus_v7.tex
│   ├── L01_merged.pptx
│   └── lecture_generation_prompt.txt
├── package.json
├── .gitignore
└── README.md
```

---

## Quick start

```bash
# Install dependencies (only pptxgenjs)
npm install

# Build all 10 decks → slides/
npm run build

# Build a single deck
npm run build:L03          # Uncertainty & Commutation Relations
node src/build-all.js --lecture 7   # Heisenberg Picture
```

---

## Lecture map

| Code | Title | Key topics |
|------|-------|-----------|
| L01 | Pure/Mixed States and the Density Matrix | ρ̂, purity, partial trace, entanglement entropy |
| L02 | Bases: Discrete and Continuous | Completeness, wavefunctions, Fourier transform |
| L03 | Uncertainty and Commutation Relations | Robertson inequality, CSCO, Zeno effect |
| L04 | Generators, Symmetries, & Noether | Stone's theorem, conservation laws, CPT |
| L05 | Time Evolution I — Time-Independent Ĥ | TDSE, Û(t), stationary states, probability current |
| L06 | Time Evolution II — Time-Dependent Ĥ | Dyson series, Magnus expansion, Trotter–Suzuki |
| L07 | Pictures of QM & Heisenberg Picture | Heisenberg EOM, Ehrenfest, canonical quantisation |
| L08 | The Dirac (Interaction) Picture | IP transformation, S-matrix, three-picture comparison |
| L09 | Perturbation Theory | RSPT, degenerate PT, variational principle, Feynman–Hellmann |
| L10 | TDPT, Open Systems, Many-Body Preview | Fermi's golden rule, Lindblad, decoherence, singlet/triplet |

---

## Slide structure (per deck)

| # | Slide | Content |
|---|-------|---------|
| 1 | **Title** | Lecture code, title, subtitle, dual-track label, tier badges |
| 2 | **Lecture Overview** | 90-min pacing · 4 learning outcomes · 5 tier summaries · assessment bundle |
| 3 | **Key Formulas** | 6 numbered formula cards with labels · prev/next lecture strip |
| 4 | **Concept Questions** | 8 questions in two columns (T/F, short answer, derivation prompts) |
| 5 | **Five-Tier Pedagogy** | Full-width tier rows (HS → PhD) · assessment sets A & B |

---

## Modifying content

All lecture content lives in **`src/lectures.js`** — a plain JS array of objects.  
Changing any field (formulas, pacing, outcomes, tier notes) and re-running `npm run build` regenerates the affected deck(s).

Design tokens (colours, fonts, layout constants) are in **`src/theme.js`**.  
Slide assembly logic is in **`src/builder.js`**.

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| [pptxgenjs](https://gitbub.com/gitbrent/PptxGenJS) | ^4.0.1 | PPTX generation |

Node.js ≥ 16 required.

---

## Source files

The `assets/` folder contains the three reference files used to generate this module:

- **`quantum_mechanics_syllabus_v7.tex`** — Module I.3 syllabus (LaTeX)
- **`L01_merged.pptx`** — Example lecture deck (design reference)
- **`lecture_generation_prompt.txt`** — Pedagogical framework prompt

---

*QM Programme · Module I.3 · Generated with pptxgenjs*
