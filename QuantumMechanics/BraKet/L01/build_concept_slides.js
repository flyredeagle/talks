/**
 * L01/build_concept_slides.js
 * ===========================
 * Builds the L01 Deep Concept Slides deck.
 * Each core concept from every tier gets its own dedicated slide with:
 *   LEFT  (40%): Full LaTeX-rendered explanation (rendered_card)
 *   RIGHT (58%): matplotlib diagram (geometric analogy)
 *
 * Slide count: ~21 concept slides + cover + tier dividers ≈ 30 slides total
 *
 * Usage:
 *   node L01/build_concept_slides.js \
 *        --data  build/L01/lecture_content.json \
 *        --diag  build/L01/diagrams \
 *        --frm   build/L01/formulas \
 *        --out   build/L01/L01_concepts.pptx
 */

"use strict";
const path = require("path");
const fs   = require("fs");

const {
  initPres, addSlide, slideHeader, slideFooter, accentCard, levelBadge,
  lectureAccent, C, W, H, FONT_HEAD, FONT_BODY, makeShadow,
} = require("../shared/slide_helpers");
const { renderedCard } = require("../shared/rendered_card");

// ── helpers ───────────────────────────────────────────────────────────────────
const trunc = (s, n=280) => s && s.length > n ? s.slice(0,n)+"…" : (s||"");

const TIER_COLOR = { HS:C.hs, BegUG:C.begug, AdvUG:C.advug, MSc:C.msc, PhD:C.phd };
const TIER_LABEL = {
  HS:"High School", BegUG:"Beginning Undergraduate",
  AdvUG:"Advanced Undergraduate", MSc:"Master's Level", PhD:"PhD Level",
};

// ── load image as base64 ──────────────────────────────────────────────────────
function imgB64(imgPath) {
  if (!imgPath || !fs.existsSync(imgPath)) return null;
  return "image/png;base64," + fs.readFileSync(imgPath).toString("base64");
}

// ── place diagram image on slide ──────────────────────────────────────────────
function placeDiagram(slide, diagPath, x, y, maxW, maxH) {
  const data = imgB64(diagPath);
  if (!data) return;
  try {
    slide.addImage({ data, x, y, w: maxW, h: maxH,
      sizing: { type: "contain", w: maxW, h: maxH } });
  } catch(e) {}
}

// ── read PNG dims ─────────────────────────────────────────────────────────────
function pngDims(p) {
  try {
    const b = fs.readFileSync(p);
    if (b[0]===0x89 && b[1]===0x50)
      return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
  } catch(e) {}
  return { w: 900, h: 600 };
}

// ── resolve diagram for a concept ─────────────────────────────────────────────
function findDiagram(diagDir, key) {
  const candidates = [
    path.join(diagDir, key + ".png"),
    path.join(diagDir, key.replace(/-/g,"_") + ".png"),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE DEFINITIONS
// Each entry: { tier, title, subtitle, specKey, diagKey, notes }
// ─────────────────────────────────────────────────────────────────────────────
const CONCEPT_SLIDES = [

  // ── HS ──────────────────────────────────────────────────────────────────────
  {
    tier: "HS", title: "Complex Numbers as Arrows",
    subtitle: "The complex plane — z = a+ib as a 2D vector",
    specKey: "core_HS_section_0",
    diagKey: "hs_complex_plane",
    explainSpec: [
      { type:"header", text:"WHAT IS A COMPLEX NUMBER?" },
      { type:"text",   text:"A complex number z = a + ib is a 2D vector in a plane." },
      { type:"formula_latex", latex:"$z = a + ib, \\quad i^2 = -1$" },
      { type:"text",   text:"The plane has two axes: real (a) and imaginary (b)." },
      { type:"spacer" },
      { type:"header", text:"POLAR FORM" },
      { type:"formula_latex", latex:"$z = r\\,e^{i\\theta}, \\quad r = |z| = \\sqrt{a^2+b^2}$" },
      { type:"text",   text:"r is the length (magnitude). θ is the angle (phase)." },
      { type:"spacer" },
      { type:"header", text:"KEY IDENTITY" },
      { type:"formula_latex", latex:"$|z|^2 = z^*z = (a-ib)(a+ib) = a^2+b^2 \\geq 0$" },
      { type:"text",   text:"The squared magnitude is always real and non-negative." },
      { type:"spacer" },
      { type:"header", text:"WHY THIS MATTERS FOR QM" },
      { type:"text",   text:"Quantum amplitudes ARE complex numbers. The probability is their squared magnitude." },
    ],
  },

  {
    tier: "HS", title: "Magnitude Squared as Probability",
    subtitle: "P = |A|² — squaring gives a valid probability",
    diagKey: "hs_magnitude_squared",
    explainSpec: [
      { type:"header", text:"THE BORN RULE (HIGH SCHOOL VERSION)" },
      { type:"text",   text:"A quantum amplitude A is a complex number describing a process." },
      { type:"formula_latex", latex:"$P = |A|^2 = A^*A \\geq 0$" },
      { type:"text",   text:"Why must we SQUARE? Two reasons:" },
      { type:"spacer" },
      { type:"header", text:"REASON 1 — POSITIVITY" },
      { type:"text",   text:"Probabilities must be ≥ 0. Complex numbers can be negative or imaginary. Squaring always gives a non-negative real number." },
      { type:"spacer" },
      { type:"header", text:"REASON 2 — INTERFERENCE" },
      { type:"text",   text:"If we used |A| instead of |A|², the interference term would look different. Only |A|² gives the correct two-slit experiment result." },
      { type:"spacer" },
      { type:"header", text:"GEOMETRIC PICTURE" },
      { type:"text",   text:"The diagram shows: |z|² = (squared length) = the area of the square on the hypotenuse. It is always the sum of the squares of the sides." },
    ],
  },

  {
    tier: "HS", title: "Superposition and Interference",
    subtitle: "Adding amplitude arrows — constructive vs destructive",
    diagKey: "hs_interference",
    explainSpec: [
      { type:"header", text:"SUPERPOSITION = ARROW ADDITION" },
      { type:"text",   text:"When two processes can both contribute to an outcome, we ADD their amplitudes (not their probabilities)." },
      { type:"formula_latex", latex:"$A_{\\mathrm{total}} = A_1 + A_2$" },
      { type:"formula_latex", latex:"$P = |A_1 + A_2|^2 = |A_1|^2 + |A_2|^2 + 2\\,\\mathrm{Re}(A_1^* A_2)$" },
      { type:"spacer" },
      { type:"header", text:"THE INTERFERENCE TERM" },
      { type:"text",   text:"The extra term 2Re(A₁*A₂) is interference. It can be positive (constructive) or negative (destructive)." },
      { type:"spacer" },
      { type:"header", text:"PHASE CONTROLS THE SIGN" },
      { type:"text",   text:"φ = 0: arrows align → P = 4 (maximum, constructive)." },
      { type:"text",   text:"φ = π: arrows cancel → P = 0 (minimum, destructive)." },
      { type:"text",   text:"φ = π/2: perpendicular → P = 2 (no interference)." },
    ],
  },

  {
    tier: "HS", title: "Phase Dependence of Probability",
    subtitle: "P(φ) = 2 + 2cosφ — the interference pattern",
    diagKey: "hs_phase_circle",
    explainSpec: [
      { type:"header", text:"A COMPLETE INTERFERENCE PATTERN" },
      { type:"text",   text:"Let A₁ = 1 and A₂ = e^{iφ}. As we vary the relative phase φ:" },
      { type:"formula_latex", latex:"$P(\\phi) = |1 + e^{i\\phi}|^2 = 2 + 2\\cos\\phi$" },
      { type:"spacer" },
      { type:"header", text:"READING THE GRAPH" },
      { type:"text",   text:"Maximum P = 4 at φ = 0, 2π (constructive). Minimum P = 0 at φ = π (destructive). The oscillation between 0 and 4 is a hallmark of wave-like behaviour." },
      { type:"spacer" },
      { type:"header", text:"KEY INSIGHT" },
      { type:"text",   text:"If we had used probabilities directly (not amplitudes), we would get P = P₁ + P₂ = 2, always. NO interference. The interference pattern PROVES we must add amplitudes first." },
      { type:"spacer" },
      { type:"header", text:"TWO-SLIT ANALOGY" },
      { type:"text",   text:"This is exactly the pattern seen in the double-slit experiment — bright and dark bands as the phase difference varies across the screen." },
    ],
  },

  // ── BegUG ────────────────────────────────────────────────────────────────────
  {
    tier: "BegUG", title: "Basis Vectors and State Decomposition",
    subtitle: "|ψ⟩ = c₁|1⟩ + c₂|2⟩ — expanding in a basis",
    diagKey: "begug_vector_basis",
    explainSpec: [
      { type:"header", text:"THE HILBERT SPACE AS A VECTOR SPACE" },
      { type:"text",   text:"A quantum state |ψ⟩ lives in a vector space, just like a 2D or 3D arrow." },
      { type:"formula_latex", latex:"$|\\psi\\rangle = c_1|1\\rangle + c_2|2\\rangle$" },
      { type:"spacer" },
      { type:"header", text:"ORTHONORMAL BASIS" },
      { type:"text",   text:"The basis vectors |1⟩ and |2⟩ play the role of x̂ and ŷ in 2D space:" },
      { type:"formula_latex", latex:"$\\langle m|n\\rangle = \\delta_{mn} = \\begin{cases}1 & m=n \\\\ 0 & m\\neq n\\end{cases}$" },
      { type:"spacer" },
      { type:"header", text:"COMPONENTS ARE INNER PRODUCTS" },
      { type:"formula_latex", latex:"$c_n = \\langle n|\\psi\\rangle \\quad \\text{(the projection onto }|n\\rangle\\text{)}$" },
      { type:"text",   text:"This is the key identity. Just like a 2D dot product gives the component along each axis." },
      { type:"spacer" },
      { type:"header", text:"DIAGRAM" },
      { type:"text",   text:"The diagram shows |ψ⟩ decomposed along |1⟩ (x-axis) and |2⟩ (y-axis) with dashed projection lines, exactly as in 2D vector geometry." },
    ],
  },

  {
    tier: "BegUG", title: "Normalisation and the Unit Sphere",
    subtitle: "⟨ψ|ψ⟩ = 1 — all states live on the unit sphere",
    diagKey: "begug_normalisation",
    explainSpec: [
      { type:"header", text:"WHY NORMALISATION?" },
      { type:"text",   text:"Total probability must equal 1. This forces:" },
      { type:"formula_latex", latex:"$\\langle\\psi|\\psi\\rangle = \\sum_n |c_n|^2 = 1$" },
      { type:"spacer" },
      { type:"header", text:"GEOMETRIC MEANING" },
      { type:"text",   text:"In 2D (real amplitudes): normalised states lie exactly on the unit circle. In 2D complex (a qubit): they lie on the Bloch sphere." },
      { type:"spacer" },
      { type:"header", text:"HOW TO NORMALISE" },
      { type:"text",   text:"Given any |ψ⟩ ≠ 0, divide by its norm:" },
      { type:"formula_latex", latex:"$|\\psi\\rangle_{\\mathrm{norm}} = \\frac{|\\psi\\rangle}{\\|\\psi\\|} = \\frac{|\\psi\\rangle}{\\sqrt{\\langle\\psi|\\psi\\rangle}}$" },
      { type:"spacer" },
      { type:"header", text:"DIAGRAM" },
      { type:"text",   text:"All normalised states sit on the circle. Non-normalised states sit outside. Physical states must be on the circle — normalisation is a physical constraint, not just a convention." },
    ],
  },

  {
    tier: "BegUG", title: "The Inner Product as Projection",
    subtitle: "c_n = ⟨n|ψ⟩ — the component IS the projection",
    diagKey: "begug_inner_product",
    explainSpec: [
      { type:"header", text:"INNER PRODUCT = OVERLAP" },
      { type:"text",   text:"The inner product ⟨φ|ψ⟩ measures how much |ψ⟩ overlaps with |φ⟩. Geometrically: it is the projection (shadow) of |ψ⟩ onto the direction of |φ⟩." },
      { type:"spacer" },
      { type:"header", text:"THE COMPONENT FORMULA" },
      { type:"formula_latex", latex:"$c_n = \\langle n|\\psi\\rangle = \\|\\psi\\|\\cos\\theta$" },
      { type:"text",   text:"where θ is the angle between |ψ⟩ and the basis vector |n⟩." },
      { type:"spacer" },
      { type:"header", text:"BORN RULE FROM PROJECTION" },
      { type:"formula_latex", latex:"$P(n) = |c_n|^2 = |\\langle n|\\psi\\rangle|^2 = \\cos^2\\theta$" },
      { type:"text",   text:"(for normalised states). The probability is the SQUARED projection — the squared shadow length." },
      { type:"spacer" },
      { type:"header", text:"KEY INSIGHT" },
      { type:"text",   text:"The diagram shows the projection construction. This is identical to decomposing a 2D vector along a coordinate axis. The only new feature in QM: the components are complex numbers." },
    ],
  },

  // ── AdvUG ────────────────────────────────────────────────────────────────────
  {
    tier: "AdvUG", title: "Cauchy-Schwarz and the Geometry of Overlap",
    subtitle: "|⟨φ|ψ⟩|² ≤ ‖φ‖²‖ψ‖² — why probabilities are bounded",
    diagKey: "advug_cauchy_schwarz",
    explainSpec: [
      { type:"header", text:"THE CAUCHY-SCHWARZ INEQUALITY" },
      { type:"formula_latex", latex:"$|\\langle\\phi|\\psi\\rangle|^2 \\leq \\langle\\phi|\\phi\\rangle\\,\\langle\\psi|\\psi\\rangle$" },
      { type:"text",   text:"For normalised states this gives |⟨φ|ψ⟩|² ≤ 1 — transition probabilities are always bounded by 1." },
      { type:"spacer" },
      { type:"header", text:"PROOF IDEA (MINIMISATION)" },
      { type:"text",   text:"For any complex λ, define f(λ) = ‖|φ⟩ − λ|ψ⟩‖² ≥ 0." },
      { type:"formula_latex", latex:"$f(\\lambda) = \\|\\phi\\|^2 - 2\\,\\mathrm{Re}(\\lambda^*\\langle\\phi|\\psi\\rangle) + |\\lambda|^2\\|\\psi\\|^2$" },
      { type:"text",   text:"Choose λ = ⟨ψ|φ⟩/‖ψ‖² to minimise f → the inequality falls out." },
      { type:"spacer" },
      { type:"header", text:"GEOMETRIC MEANING" },
      { type:"text",   text:"The diagram shows two vectors. |⟨φ|ψ⟩| = ‖φ‖‖ψ‖|cosθ| ≤ ‖φ‖‖ψ‖ because |cosθ| ≤ 1. C-S is just the statement that the absolute cosine of an angle is ≤ 1." },
    ],
  },

  {
    tier: "AdvUG", title: "Triangle Inequality",
    subtitle: "‖φ+ψ‖ ≤ ‖φ‖+‖ψ‖ — the norm behaves like geometric length",
    diagKey: "advug_triangle_inequality",
    explainSpec: [
      { type:"header", text:"THE TRIANGLE INEQUALITY" },
      { type:"formula_latex", latex:"$\\|\\phi + \\psi\\| \\leq \\|\\phi\\| + \\|\\psi\\|$" },
      { type:"text",   text:"The length of the sum is at most the sum of the lengths. This is exactly the triangle inequality from Euclidean geometry." },
      { type:"spacer" },
      { type:"header", text:"PROOF" },
      { type:"text",   text:"Square both sides (both sides ≥ 0):" },
      { type:"formula_latex", latex:"$\\|\\phi+\\psi\\|^2 = \\|\\phi\\|^2 + 2\\,\\mathrm{Re}\\langle\\phi|\\psi\\rangle + \\|\\psi\\|^2$" },
      { type:"text",   text:"Use Re⟨φ|ψ⟩ ≤ |⟨φ|ψ⟩| ≤ ‖φ‖‖ψ‖ (by C-S):" },
      { type:"formula_latex", latex:"$\\|\\phi+\\psi\\|^2 \\leq (\\|\\phi\\|+\\|\\psi\\|)^2$" },
      { type:"text",   text:"Taking square roots gives the result." },
      { type:"spacer" },
      { type:"header", text:"WHY IT MATTERS" },
      { type:"text",   text:"The triangle inequality makes ‖·‖ a proper norm, and (ℋ, ‖·‖) a metric space. Limits, continuity, and convergence all rely on this." },
    ],
  },

  {
    tier: "AdvUG", title: "The Fubini-Study Metric on Rays",
    subtitle: "d_FS = arccos|⟨φ|ψ⟩| — the physical distance between states",
    diagKey: "advug_fubini_study",
    explainSpec: [
      { type:"header", text:"WHY ‖φ−ψ‖ IS NOT THE RIGHT DISTANCE" },
      { type:"text",   text:"Physical states are rays — |ψ⟩ and e^{iθ}|ψ⟩ are the same state. But ‖|ψ⟩ − e^{iθ}|ψ⟩‖ depends on θ. So ‖φ−ψ‖ is NOT phase-invariant." },
      { type:"spacer" },
      { type:"header", text:"THE CORRECT DISTANCE" },
      { type:"formula_latex", latex:"$d(\\phi,\\psi) = \\min_\\theta \\| |\\phi\\rangle - e^{i\\theta}|\\psi\\rangle \\| = \\sqrt{2(1-|\\langle\\phi|\\psi\\rangle|)}$" },
      { type:"spacer" },
      { type:"header", text:"FUBINI-STUDY METRIC" },
      { type:"formula_latex", latex:"$d_{\\mathrm{FS}}([\\phi],[\\psi]) = \\arccos(|\\langle\\phi|\\psi\\rangle|)$" },
      { type:"text",   text:"This is the angle between rays — invariant under global phase. On the Bloch circle (diagram), it is the arc length between two points." },
      { type:"spacer" },
      { type:"header", text:"SPECIAL VALUES" },
      { type:"text",   text:"d_FS = 0 iff same ray (same physical state). d_FS = π/2 iff orthogonal states (mutually exclusive outcomes). d_FS = π/2 is the maximum distinguishability." },
    ],
  },

  // ── MSc ──────────────────────────────────────────────────────────────────────
  {
    tier: "MSc", title: "Projective Hilbert Space",
    subtitle: "ℙ(ℋ) — states as lines through the origin",
    diagKey: "msc_projective_space",
    explainSpec: [
      { type:"header", text:"RAYS = EQUIVALENCE CLASSES" },
      { type:"text",   text:"Two vectors represent the same physical state if they differ by a non-zero complex scalar:" },
      { type:"formula_latex", latex:"$|\\psi\\rangle \\sim c|\\psi\\rangle, \\quad c \\in \\mathbb{C}\\setminus\\{0\\}$" },
      { type:"text",   text:"A ray [ψ] is the equivalence class — a one-dimensional complex subspace." },
      { type:"spacer" },
      { type:"header", text:"PROJECTIVE HILBERT SPACE" },
      { type:"formula_latex", latex:"$\\mathbb{P}(\\mathcal{H}) = (\\mathcal{H}\\setminus\\{0\\})/\\!\\sim$" },
      { type:"text",   text:"Each point of ℙ(ℋ) is a ray — a physical pure state." },
      { type:"spacer" },
      { type:"header", text:"DIAGRAM" },
      { type:"text",   text:"The diagram shows ℝ² (or ℂ²). Each line through the origin is one ray — one physical state. Points on the same line (same colour) differ only by phase or scale." },
      { type:"spacer" },
      { type:"header", text:"DIMENSION" },
      { type:"formula_latex", latex:"$\\dim_{\\mathbb{R}}\\,\\mathbb{P}(\\mathbb{C}^n) = 2n-2$" },
      { type:"text",   text:"For a qubit (n=2): dim = 2 real dimensions → the Bloch sphere S²." },
    ],
  },

  {
    tier: "MSc", title: "The Bloch Sphere",
    subtitle: "ℙ(ℂ²) ≅ S² — every qubit state is a point on a 3-sphere",
    diagKey: "msc_bloch_sphere",
    explainSpec: [
      { type:"header", text:"QUBIT STATES AS SPHERE POINTS" },
      { type:"text",   text:"Any normalised qubit state can be written:" },
      { type:"formula_latex", latex:"$|\\psi\\rangle = \\cos\\tfrac{\\theta}{2}|0\\rangle + e^{i\\phi}\\sin\\tfrac{\\theta}{2}|1\\rangle$" },
      { type:"text",   text:"Two real parameters (θ,φ) label a point on S² — the Bloch sphere." },
      { type:"spacer" },
      { type:"header", text:"KEY STATES" },
      { type:"text",   text:"|0⟩ and |1⟩ are the North and South poles." },
      { type:"text",   text:"Superpositions (|0⟩+|1⟩)/√2 live on the equator." },
      { type:"spacer" },
      { type:"header", text:"ANTIPODAL POINTS = ORTHOGONAL STATES" },
      { type:"formula_latex", latex:"$\\langle\\phi|\\psi\\rangle = 0 \\iff d_{\\mathrm{FS}} = \\pi/2 \\iff \\text{antipodal on }S^2$" },
      { type:"spacer" },
      { type:"header", text:"FUBINI-STUDY ON THE SPHERE" },
      { type:"text",   text:"The Fubini-Study metric on ℙ(ℂ²) is exactly the round metric on S² (up to a factor). The geodesics are great circle arcs." },
    ],
  },

  // ── PhD ──────────────────────────────────────────────────────────────────────
  {
    tier: "PhD", title: "Completeness and Cauchy Sequences",
    subtitle: "Why ℋ must be complete — limits must stay in the space",
    diagKey: "phd_completeness",
    explainSpec: [
      { type:"header", text:"THE COMPLETENESS AXIOM" },
      { type:"text",   text:"A Hilbert space ℋ must be COMPLETE: every Cauchy sequence converges in ℋ." },
      { type:"formula_latex", latex:"$\\|\\psi_n - \\psi_m\\| \\to 0 \\implies \\exists\\,\\psi \\in \\mathcal{H}: \\psi_n \\to \\psi$" },
      { type:"spacer" },
      { type:"header", text:"WHY PHYSICISTS NEED THIS" },
      { type:"text",   text:"In QM we constantly take limits: Fourier series, perturbation theory, time evolution, spectral expansions. If ℋ were not complete, these limits might not exist in the space." },
      { type:"spacer" },
      { type:"header", text:"THE DIAGRAM" },
      { type:"text",   text:"The diagram shows partial Fourier sums approximating √x in L²([0,1]). Each partial sum is in L², and their L²-norm distance shrinks (Cauchy sequence). The limit f(x) = √x is also in L² because L² is complete." },
      { type:"spacer" },
      { type:"header", text:"CONTRAST: NON-COMPLETE SPACE" },
      { type:"text",   text:"The rationals ℚ are NOT complete: the sequence 1, 1.4, 1.41, 1.414, … is Cauchy in ℚ but converges to √2 ∉ ℚ. Physics needs ℝ or ℂ, not ℚ." },
    ],
  },

  {
    tier: "PhD", title: "Hermitian vs Self-Adjoint Operators",
    subtitle: "Domain subtlety — why this distinction is physical",
    diagKey: "phd_domain_subtlety",
    explainSpec: [
      { type:"header", text:"THE DISTINCTION" },
      { type:"text",   text:"For bounded operators on a finite-dimensional space, Hermitian = self-adjoint. For UNBOUNDED operators (p̂, x̂), these are different:" },
      { type:"formula_latex", latex:"$\\text{Hermitian: }\\langle\\phi|\\hat{A}\\psi\\rangle = \\langle\\hat{A}\\phi|\\psi\\rangle\\;\\forall\\,\\phi,\\psi \\in \\mathcal{D}(\\hat{A})$" },
      { type:"formula_latex", latex:"$\\text{Self-adjoint: additionally }\\mathcal{D}(\\hat{A}) = \\mathcal{D}(\\hat{A}^\\dagger)$" },
      { type:"spacer" },
      { type:"header", text:"PHYSICAL CONSEQUENCE" },
      { type:"text",   text:"The spectral theorem (real eigenvalues, complete eigenbasis) REQUIRES self-adjointness, not just Hermitian symmetry. Physical observables must be self-adjoint." },
      { type:"spacer" },
      { type:"header", text:"EXAMPLE: p̂ on [0,1]" },
      { type:"text",   text:"p̂ = -iℏd/dx on C^∞_c(0,1) is Hermitian but NOT self-adjoint. Each boundary condition ψ(1) = e^{iθ}ψ(0) gives a different self-adjoint extension, with a different spectrum." },
      { type:"spacer" },
      { type:"header", text:"DIAGRAM" },
      { type:"text",   text:"The domain diagram shows 𝒟(Â) ⊊ 𝒟(Â†). The self-adjoint case (green) has equal domains." },
    ],
  },
];

// ═════════════════════════════════════════════════════════════════════════════
// SLIDE BUILDER
// ═════════════════════════════════════════════════════════════════════════════

async function buildConceptSlides(dataPath, diagDir, frmDir, outPath) {
  const D      = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const accent = lectureAccent(0);  // L01 = indigo
  const pres   = initPres("L01 Deep Concept Slides");

  // ── Cover ──────────────────────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    s.addShape(pres.ShapeType.ellipse, {
      x:9.5, y:-1.8, w:5.5, h:5.5,
      fill:{ color:accent, transparency:91 },
      line:{ color:accent, transparency:85, width:1 },
    });
    s.addText("L01", { x:0.6, y:1.4, w:2, h:0.65,
      fontSize:28, bold:true, color:accent, fontFace:FONT_HEAD, margin:0 });
    s.addText("Deep Concept Slides", { x:0.6, y:2.1, w:9, h:1.3,
      fontSize:38, bold:true, color:C.text, fontFace:FONT_HEAD, margin:0 });
    s.addText("Why Dirac Notation? States as Rays & Superposition", {
      x:0.6, y:3.5, w:9, h:0.5,
      fontSize:16, color:C.accent3, fontFace:FONT_BODY, margin:0,
    });
    s.addText(
      "One slide per core concept  ·  Full LaTeX derivation  ·  2D/3D geometric diagram",
      { x:0.6, y:4.2, w:9, h:0.35, fontSize:11, color:C.textSub, fontFace:FONT_BODY, margin:0 });

    // Tier badges
    const TIERS = [["HS",C.hs],["BegUG",C.begug],["AdvUG",C.advug],["MSc",C.msc],["PhD",C.phd]];
    TIERS.forEach(([t,c],i) => levelBadge(s, 0.6+i*0.88, 4.8, t, c));
    s.addText(`${CONCEPT_SLIDES.length} concept slides`, {
      x:0.6, y:5.4, w:9, h:0.3, fontSize:10, color:C.textSub, fontFace:FONT_BODY, margin:0 });
    slideFooter(s, "QM: Bra-Ket Notation — L01 Concepts", "L01");
  }

  // ── Tier divider + per-concept slides ──────────────────────────────────────
  let lastTier = null;

  for (const concept of CONCEPT_SLIDES) {
    const tc = TIER_COLOR[concept.tier];
    const tl = TIER_LABEL[concept.tier];

    // Tier divider slide
    if (concept.tier !== lastTier) {
      lastTier = concept.tier;
      const sd = addSlide(pres);
      sd.addShape(pres.ShapeType.rect, {
        x:0, y:0, w:W, h:H, fill:{ color:tc }, line:{ color:tc },
      });
      sd.addText(concept.tier, {
        x:1, y:2.0, w:11, h:1.2, fontSize:72, bold:true, color:"000000",
        fontFace:FONT_HEAD, transparency:25, align:"center",
      });
      sd.addText(tl, {
        x:1, y:3.4, w:11, h:0.7, fontSize:28, color:"000000",
        fontFace:FONT_HEAD, transparency:20, align:"center",
      });
      // List this tier's concept slides
      const tierConcepts = CONCEPT_SLIDES.filter(c => c.tier === concept.tier);
      const listing = tierConcepts.map((c,i) => `${i+1}. ${c.title}`).join("\n");
      sd.addText(listing, {
        x:2, y:4.3, w:9, h:2.5, fontSize:13, color:"000000",
        fontFace:FONT_BODY, transparency:25, align:"center",
      });
      slideFooter(sd, `QM: L01 — ${tl}`, "L01");
    }

    // ── Concept slide (two-column: explanation LEFT, diagram RIGHT) ───────────
    const s = addSlide(pres);
    slideHeader(s, `L01 — ${concept.tier}: ${concept.title}`,
      concept.subtitle, "L01", tc);

    const explLeft  = 0.3;
    const explW     = 5.5;
    const diagLeft  = 6.05;
    const diagW     = W - diagLeft - 0.3;
    const contentY  = 0.92;
    const contentH  = H - contentY - 0.55;

    // LEFT: explanation using renderedCard with the spec
    const spec = concept.explainSpec || [];

    // Load the formula lookup table (md5(latex) -> png_path)
    const lookupPath = path.join(path.dirname(frmDir), "formula_lookup.json");
    const frmLookup  = fs.existsSync(lookupPath)
      ? JSON.parse(fs.readFileSync(lookupPath, "utf8")) : {};

    // Render any formula_latex items in spec
    const frmRendered = spec.map(item => {
      if (item.type !== "formula_latex") return item;
      const latex = item.latex;
      const key   = require("crypto").createHash("md5").update(latex).digest("hex");
      // Look up in cache
      const fpath = frmLookup[key];
      if (fpath && fs.existsSync(fpath)) {
        return { type:"formula", path:fpath, tex:latex };
      }
      // Fallback: strip math markers for plain text
      const plain = latex.replace(/^\$/, "").replace(/\$$/, "")
                         .replace(/\\[a-zA-Z]+/g, m => m.slice(2))
                         .replace(/[{}^_]/g,"");
      return { type:"text", text: plain };
    });

    renderedCard(s, pres, frmRendered, {
      x: explLeft, y: contentY, w: explW, h: contentH,
      accent: tc, title: concept.title.toUpperCase(), titleSz: 10.5,
    });

    // RIGHT: diagram
    const diagPath = findDiagram(diagDir, concept.diagKey);
    if (diagPath) {
      placeDiagram(s, diagPath, diagLeft, contentY, diagW, contentH);
    } else {
      accentCard(s, { x:diagLeft, y:contentY, w:diagW, h:contentH,
        accent:tc, title:"DIAGRAM", body:"Diagram not found:\n" + concept.diagKey,
        titleSz:10, bodySz:10 });
    }

    slideFooter(s, `QM: L01 — ${concept.tier} · ${concept.title}`, `L01 · ${concept.tier}`);
  }

  await pres.writeFile({ fileName: outPath });
  const nSlides = pres._slides ? pres._slides.length : "?";
  console.log(`✓ L01 concept slides (${nSlides} slides): ${outPath}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const args = process.argv.slice(2);
  const get  = flag => { const i=args.indexOf(flag); return i>=0?args[i+1]:null; };
  const dataPath = get("--data") || "build/L01/lecture_content.json";
  const diagDir  = get("--diag") || "build/L01/diagrams";
  const frmDir   = get("--frm")  || "build/L01/formulas";
  const outPath  = get("--out")  || "build/L01/L01_concepts.pptx";

  buildConceptSlides(dataPath, diagDir, frmDir, outPath)
    .catch(e => { console.error(e); process.exit(1); });
}
