# Module I.4 — Paradigm Physical Systems

**Series I: Introductory Quantum Mechanics**  
**Quantum Mechanics & Quantum Chemistry Programme**

---

## Overview

Module I.4 develops **twelve canonical quantum systems** in full depth, applying
the algebraic formalism of Modules I.1–I.3. Each lecture is self-contained and
may be taught in any order after Module I.3 L10.

| # | Lecture | Key Topics |
|---|---------|------------|
| L01 | Free Particle & Particle in a Box | Plane waves, wave packets, DOS in 1/2/3D |
| L02 | Simple Bloch Electron | Bloch's theorem, BZ, nearly-free electron gap, tight-binding |
| L03 | Harmonic Oscillator | Ladder operators, coherent states, anharmonic PT |
| L04 | Rabi Model & Two-Level Systems | Jaynes–Cummings, Rabi oscillations, RWA, π-pulses |
| L05 | Minimal Coupling & Landau Levels | Gauge invariance, Landau levels, Aharonov–Bohm |
| L06 | Zeeman Effect | Normal/anomalous Zeeman, Paschen–Back, Breit–Rabi |
| L07 | Stark Effect | Linear/quadratic Stark, parabolic coordinates, polarisability |
| L08 | Spin–Orbit & Fine Structure | Thomas precession, L·S coupling, complete fine structure |
| L09 | Hydrogen Atom | Coulomb potential, radial equation, SO(4) symmetry |
| L10 | Scattering from a Potential Barrier | Transfer matrix, tunnelling, Gamow factor |
| L11 | Scattering from a Potential Well | Finite square well, bound states, Ramsauer–Townsend |
| L12 | Delta-Function Potential & WKB | δ(x) bound state, WKB quantisation, Geiger–Nuttall law |

**Duration:** 12 × 90 minutes  
**Prerequisites:** Modules I.1, I.2, I.3 (complete)

---

## Repository Structure

```
module-I4-paradigm-physical-systems/
│
├── README.md                    ← This file
├── preamble.tex                 ← Shared LaTeX preamble (all lectures)
├── master_document.tex          ← Compiles all 12 lectures as one book
│
├── lectures/                    ← Full 90-min lecture bodies (LaTeX)
│   ├── L01/
│   │   ├── L01_lecture.tex      ← Main lecture content
│   │   └── L01_artifacts.tex    ← Assessment bundle (14 artifact types)
│   ├── L02/ … L12/              ← Same structure for all 12 lectures
│
├── slides/                      ← PptxGenJS slide-deck source (JSON + JS)
│   ├── L01/ … L12/
│   │   ├── deck_spec.json       ← Slide content specification
│   │   └── generate_deck.js     ← PptxGenJS script to build .pptx
│
├── assessments/                 ← Aggregated assessment files
│   ├── concept-questions/       ← SCQU + CCQU + SCQG + CCQG for all lectures
│   ├── problem-sets/            ← SPSU + CPSU + SPSG + CPSG (with 4-layer format)
│   ├── projects/                ← SPJU + CPJU + SPJG + CPJG specs
│   └── research-questions/      ← WRQ + ORQ for all lectures
│
├── scripts/
│   ├── build_all.sh             ← Compile all LaTeX + generate all decks
│   ├── generate_pptx.sh         ← Generate slide decks only
│   └── generate_lecture_prompt.py ← Fill lecture_generation_prompt for any L##
│
└── docs/
    ├── PEDAGOGY.md              ← Five-tier pedagogy reference
    ├── ARTIFACT_TAXONOMY.md     ← 14-type artifact taxonomy + rubrics
    ├── NOTATION.md              ← Programme notation conventions
    └── BIBLIOGRAPHY.md          ← Module I.4 tiered bibliography
```

---

## Five-Tier Pedagogy

Every lecture targets all five learning tiers simultaneously:

| Tier | Audience | Action verbs | Depth |
|------|----------|-------------|-------|
| **T1** HS | High school | identify, describe, interpret | Physical intuition only |
| **T2** BegUG | Beginning undergraduate | apply, calculate, expand | Notation + computation |
| **T3** AdvUG | Advanced undergraduate | prove, derive, construct | Full derivations |
| **T4** MSc | Master's | analyse, generalise, connect | Formal extensions |
| **T5** PhD | Doctoral | formalise, extend, classify | Research-level rigour |

---

## Artifact Taxonomy (per lecture)

Each lecture ships **92 assessment items** in 14 types:

### Undergraduate Track (Tiers 1–3)
- **SCQU** Simple Concept Questions — UG (×10)
- **CCQU** Complex Concept Questions — UG (×10)
- **SPSU** Simple Problem Set — UG (×10)
- **CPSU** Complex Problem Set — UG (×5, 4-layer format)
- **SPJU** Simple Project — UG (×1)
- **CPJU** Complex Project — UG (×1)

### Graduate Track (Tiers 4–5)
- **SCQG** Simple Concept Questions — Grad (×10)
- **CCQG** Complex Concept Questions — Grad (×10)
- **SPSG** Simple Problem Set — Grad (×10)
- **CPSG** Complex Problem Set — Grad (×5, 4-layer format)
- **SPJG** Simple Projects — Grad (×5)
- **CPJG** Complex Projects — Grad (×5)

### Research Track (Tiers 4–5)
- **WRQ** Well-Defined Research Questions (×5)
- **ORQ** Open-Ended Research Questions (×5)

---

## Building the Materials

### Prerequisites

```bash
# LaTeX (TeX Live or MiKTeX)
pdflatex --version

# Node.js + PptxGenJS
npm install -g pptxgenjs
node --version

# Python 3 (for generation utilities)
python3 --version
```

### Build Everything

```bash
chmod +x scripts/build_all.sh
./scripts/build_all.sh
```

### Build a Single Lecture

```bash
# LaTeX
cd lectures/L03
pdflatex L03_lecture.tex

# Slide deck
cd ../../slides/L03
node generate_deck.js
```

### Generate a Lecture Prompt

```bash
python3 scripts/generate_lecture_prompt.py --lecture L05
```

---

## Course-Level Assessment

| Component | Weight |
|-----------|--------|
| Weekly homework (best 9/12) | 40% |
| System synthesis project (one system, deep study) | 35% |
| Final oral / whiteboard exam | 25% |

Mixed cohorts: HS/UG → Set A + simple projects; MSc/PhD → Set B + complex projects.

---

## Notation Conventions

| Symbol | Meaning |
|--------|---------|
| `\hat{A}`, `\hat{H}` | Operators (hat notation) |
| `\ket{\psi}`, `\bra{\phi}` | Dirac ket/bra |
| `\hat{\rho}` | Density operator |
| `[\hat{A},\hat{B}]` | Commutator |
| `\{\hat{A},\hat{B}\}` | Anti-commutator |
| `\hat{\mathbb{1}}` | Identity operator |

---

## Primary References

- Sakurai & Napolitano, *Modern Quantum Mechanics* Ch. 2, 4, 5
- Griffiths, *Introduction to Quantum Mechanics* Ch. 2–6
- Cohen-Tannoudji, Diu & Laloë, *Quantum Mechanics* Vol. II
- Landau & Lifshitz, *Quantum Mechanics* (Non-Relativistic Theory)

---

*Series I · Module I.4 · 12 lectures · 90 min each · Five-tier pedagogy*
