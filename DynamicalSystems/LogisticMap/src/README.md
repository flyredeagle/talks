# The Logistic Map — Complete Academic Presentation

A 51-slide PowerPoint deck covering the logistic map from BSc through PhD level,
including problem sets, textbooks, and research references.

## Repository Structure

```
logistic_map_code/
├── README.md                          ← this file
├── 01_core_presentation.js            ← PptxGenJS: slides 1–27 (core content)
├── 02_academic_appendix.js            ← PptxGenJS: slides 28–51 (BSc/MSc/PhD sections)
├── 03_final_combined_v8.js            ← Combined final script (run this to build)
├── 04_generate_base_charts.py         ← Python: bifurcation, time series, cobweb, Lyapunov
├── 05_generate_regime_charts.py       ← Python: all 4 regime panels + mosaic
├── 06_generate_advanced_charts.py     ← Python: butterfly, phase space, density, intermittency
├── 07_generate_ode_and_grad_charts.py ← Python: ODE derivation + PhD stochastic/coupled maps
└── 08_generate_grad_advanced.py       ← Python: symbolic dynamics, multifractal, renormalisation
```

## Prerequisites

### Node.js (for the presentation)
```bash
npm install -g pptxgenjs
```

### Python (for the charts)
```bash
pip install numpy matplotlib Pillow
```

## How to Build

**Step 1** — Generate all chart images (run from the project directory):
```bash
python 04_generate_base_charts.py
python 05_generate_regime_charts.py
python 06_generate_advanced_charts.py
python 07_generate_ode_and_grad_charts.py
python 08_generate_grad_advanced.py
```

This produces ~25 PNG files in the current directory.

**Step 2** — Build the PowerPoint:
```bash
# Edit the output path at the bottom of 03_final_combined_v8.js if needed
node 03_final_combined_v8.js
```

This produces `logistic_map_v8.pptx` (51 slides).

## Slide Structure

| Slides | Content |
|--------|---------|
| 1 | Title |
| 2 | Definition & History |
| 3 | Continuous Logistic ODE — qualitative behaviours |
| 4 | ODE → Discrete Map derivation (Euler discretisation) |
| 5 | ODE vs Map: shared behaviour & new phenomena |
| 6 | Parameter ranges & behaviour summary |
| 7 | Wikipedia animation frame + regime overview |
| 8–12 | All four dynamical regimes + mosaic |
| 13–14 | Intermittency & Devaney chaos / topological mixing |
| 15 | Turbulence analogy |
| 16 | Full bifurcation diagram (r ∈ [0,4]) |
| 17 | Fixed points & stability analysis |
| 18 | Cobweb diagrams |
| 19 | Period-doubling cascade detail |
| 20 | Feigenbaum universality |
| 21 | Lyapunov exponents |
| 22 | Sensitive dependence on initial conditions |
| 23 | Phase space & Poincaré return maps |
| 24 | Periodic windows & Sharkovksy's theorem |
| 25 | Fully chaotic regime r=4 — exact results |
| 26 | Applications across science |
| 27 | Key takeaways |
| **28** | **BSc Section divider** |
| 29 | BSc Q&A (6 questions with answers) |
| 30 | BSc Simple Problems (6 problems) |
| 31 | BSc Challenging Problems (6 problems) |
| 32 | BSc Project Proposals (4 projects) |
| 33 | BSc Introductory Textbooks (6 references) |
| **34** | **MSc/Graduate Section divider** |
| 35 | Graduate: Renormalisation & Universality Theory |
| 36 | Graduate: Ergodic Theory & Measure-Theoretic Chaos |
| 37 | Graduate: Advanced Topics (multifractal, conjugacy) |
| 38 | MSc Problem Set I (6 foundational graduate problems) |
| 39 | MSc Problem Set II (6 advanced problems) |
| 40 | MSc Project Proposals (4 projects) |
| 41 | Graduate Textbooks I (6 core references) |
| 42 | Graduate Textbooks II + Key Papers |
| **43** | **PhD/Research Section divider** |
| 44 | PhD: Current Research Landscape |
| 45 | PhD: Accessible Research Problems (6 problems) |
| 46 | PhD: Open Research Problems (6 unsolved problems) |
| 47 | PhD: Essential Publications I (8 papers) |
| 48 | PhD: Essential Publications II (8 papers) |
| 49 | PhD: Essential Publications III (8 papers) |
| 50 | PhD: Recent Reviews & Modern Surveys |
| 51 | PhD: Advanced Monographs (8 books) |

## Design System

- **Background**: `#0D1B2A` (deep navy)
- **Primary accent**: `#00D4FF` (cyan)
- **Secondary accent**: `#FF6B35` (orange)
- **BSc section colour**: `#7FFF00` (green)
- **MSc section colour**: `#00D4FF` (cyan)
- **PhD section colour**: `#FF6B35` (orange)
- **Fonts**: Cambria (headings), Calibri (body)
- **Layout**: 16:9, 10" × 5.625"

## Notes

- All charts are generated at 150 DPI and embedded as base64 PNG in the PPTX
- The Wikipedia animation frame (`wikipedia_animation_frame.jpg`) must be
  downloaded separately from Wikipedia and placed in the working directory
- Slide 4 has a tight layout: the final equation sits close to the bottom edge
  and may need a small nudge in PowerPoint
