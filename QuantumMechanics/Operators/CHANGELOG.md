# Changelog

All notable changes to this project are documented here.

---

## [1.0.0] — 2026-04-26

### Added

#### Generated Lectures
- `ModuleI1_L01.pptx` — The Hilbert Space of Quantum States
- `ModuleI1_L02.pptx` — Unitary Operators and Symmetry Transformations
- `ModuleI1_L03.pptx` — Observables, Hermitian Operators & the Spectral Theorem
- `ModuleI1_L04.pptx` — Operator Algebra and the Exponential Map
- `ModuleI1_L05.pptx` — Types of Symmetry Operators & Wigner's Theorem

#### Source
- `src/generate_lectures.js` — Complete PptxGenJS generator for all 5 lectures
  - 8 reusable slide builder functions
  - Full lecture data schema (pacing, outcomes, sections, tier content, pitfalls, refs)
  - Design constants matching reference deck colour palette

#### Documentation
- `docs/DESIGN.md` — Full design system: colours, typography, layout templates
- `docs/lecture_generation_prompt.txt` — QM/QC programme prompt template
- `assets/L01_merged_reference.pptx` — Original reference deck (style guide)

#### Infrastructure
- `package.json` — npm package manifest with `generate` and `build` scripts
- `scripts/build.sh` — One-command build script with dependency check
- `.gitignore` — Standard Node.js + OS + build artifact exclusions
- `README.md` — Full project documentation

### Slide Structure (per lecture, 15 slides)
1. Title slide
2. Overview (pacing, outcomes, tier differentiation, assessment)
3. Dual-track (Geometric/Physical ↔ Algebraic/Axiomatic)
4–7. Content sections (L0N.1–L0N.4) with key formulas and worked examples
8–12. Per-tier slides (HS, BegUG, AdvUG, MSc, PhD)
13. Common pitfalls & misconceptions
14. Assessment & homework (all 5 tiers)
15. References & bibliography
