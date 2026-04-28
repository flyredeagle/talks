# Linear Optics Course — 14 Lectures, 130 Slides

## Lecture index

| Directory | Slide file | Slides |
|-----------|-----------|--------|
| lecture_01_Prerequisites | lecture_01_prerequisites.pptx | 7 |
| lecture_02_Projective_Geometry | lecture_02_projective_geometry.pptx | 17 |
| lecture_03a_Nature_of_Light | lecture_03a_nature_of_light.pptx | 7 |
| lecture_03b_Fermats_Principle | lecture_03b_fermats_principle.pptx | 11 |
| lecture_04_ABCD_Matrices | lecture_04_abcd_matrices.pptx | 12 |
| lecture_04b_Maxwell_Waves_Eikonal | lecture_04b_maxwell_waves_eikonal.pptx | 14 |
| lecture_04c_Propagators_Feynman | lecture_04c_propagator_feynman.pptx | 13 |
| lecture_05_Polarization_Intro | lecture_05_polarization_intro.pptx | 11 |
| lecture_06_Jones_Calculus | lecture_06_jones_calculus.pptx | 10 |
| lecture_07_Gaussian_Beams | lecture_07_gaussian_beams.pptx | 5 |
| lecture_08_Fourier_Optics | lecture_08_fourier_optics.pptx | 6 |
| lecture_09_Diffraction_Integrals | lecture_09_diffraction_integrals.pptx | 5 |
| lecture_10_Mueller_Calculus | lecture_10_mueller_calculus.pptx | 5 |
| lecture_11_Lasers | lecture_11_lasers.pptx | 7 |

## Regenerate a lecture

```bash
npm install pptxgenjs          # once
node lecture_01_prerequisites.js
node lecture_02_projective_geometry.js
node lecture_03a_nature_of_light.js
node lecture_03b_fermats_principle.js
node lecture_04_abcd_matrices.js
node lecture_04b_maxwell_waves_eikonal.js
node lecture_04c_propagator_feynman.js
node lecture_05_polarization_intro.js
node lecture_06_jones_calculus.js
node lecture_07to10.js          # Gaussian, Fourier, Diffraction, Mueller
node lecture_11_lasers.js
```

## Formula rendering notes

Formulas rendered at border=4pt, fontsize=large, dpi=200.
This produces compact images that display at their natural aspect ratio.
The lo_shared.js fImg() function automatically centres and scales formulas
to fit the available width while NEVER distorting the aspect ratio.

## Regenerate caches (if editing formulas)

```bash
python3 prerender_formulas.py   # 176 formulas → formula_cache_v3.json
python3 prerender_diagrams.py   # 22 diagrams  → diagram_cache.json
```
