// ════════════════════════════════════════════════════════════════════
// APPENDIX: Academic sections — BSc, MSc, PhD problem sets,
//           textbooks, and research references
// ════════════════════════════════════════════════════════════════════

// ── Section divider helper ────────────────────────────────────────
function sectionDivider(title, subtitle, bgColor, accentColor) {
  const s = pres.addSlide();
  s.background = { color: bgColor || "0A1628" };
  // Large left accent bar
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.18, h:5.625, fill:{color: accentColor || C.accent}, line:{type:"none"} });
  // Right decorative panel
  s.addShape(pres.shapes.RECTANGLE, { x:8.5, y:0, w:1.5, h:5.625, fill:{color: C.mid}, line:{type:"none"}, transparency:40 });
  s.addText(title, { x:0.5, y:1.5, w:8.0, h:1.4, fontSize:40, fontFace:"Cambria", bold:true, color:C.white });
  if (subtitle) s.addText(subtitle, { x:0.5, y:3.0, w:7.5, h:0.7, fontSize:18, fontFace:"Calibri", color:accentColor || C.accent, italic:true });
  return s;
}

// ── Small card ────────────────────────────────────────────────────
function sCard(s, x, y, w, h, title, body, tcol, opts={}) {
  card(s, x, y, w, h, { topbar: tcol, color: opts.bg || C.mid, shadow: opts.shadow !== false });
  s.addText(title, { x:x+0.12, y:y+0.1, w:w-0.24, h:0.32, fontSize:opts.titleSize||11.5, fontFace:"Cambria", bold:true, color:tcol, margin:0 });
  s.addText(body,  { x:x+0.12, y:y+0.44, w:w-0.24, h:h-0.52, fontSize:opts.bodySize||10.5, fontFace:"Calibri", color:C.light });
}

// ── Reference row ────────────────────────────────────────────────
function refRow(s, x, y, w, num, authors, title, details, col) {
  s.addShape(pres.shapes.RECTANGLE, { x, y:y+0.04, w:0.28, h:0.35, fill:{color:col||C.accent}, line:{type:"none"} });
  s.addText(String(num), { x, y:y+0.04, w:0.28, h:0.35, fontSize:10, fontFace:"Cambria", bold:true, color:C.dark, align:"center", valign:"middle" });
  s.addText(authors, { x:x+0.34, y:y, w:w-0.34, h:0.22, fontSize:10, fontFace:"Cambria", bold:true, color:col||C.accent, margin:0 });
  s.addText(title,   { x:x+0.34, y:y+0.2, w:w-0.34, h:0.2, fontSize:10, fontFace:"Calibri", color:C.light, italic:true, margin:0 });
  if (details) s.addText(details, { x:x+0.34, y:y+0.38, w:w-0.34, h:0.18, fontSize:9, fontFace:"Calibri", color:C.muted, margin:0 });
}

// ════════════════════════════════════════════════════════════════
//  ██████╗ ███████╗ ██████╗     ███████╗███████╗ ██████╗████████╗
//  ██╔══██╗██╔════╝██╔════╝     ██╔════╝██╔════╝██╔════╝╚══██╔══╝
//  ██████╔╝███████╗██║          ███████╗█████╗  ██║        ██║
//  ██╔══██╗╚════██║██║          ╚════██║██╔══╝  ██║        ██║
//  ██████╔╝███████║╚██████╗     ███████║███████╗╚██████╗   ██║
// ════════════════════════════════════════════════════════════════
sectionDivider("BSc Section", "Problem Sets · Q&A · Textbooks", "0A1628", C.green);

// ── BSc Slide A: Q&A (Quick-fire conceptual questions) ───────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Q&A: Conceptual Questions & Answers", "Test your understanding of the key ideas");
  const qa = [
    ["Q1", "What does xₙ represent in the logistic map?",
     "A: The normalised population at generation n; xₙ ∈ [0,1] where 1 means the population is at carrying capacity K."],
    ["Q2", "For what value of r does the first period-doubling occur?",
     "A: r = 3. For r < 3 the fixed point x* = 1−1/r is stable; at r = 3 its stability is lost and a period-2 cycle is born."],
    ["Q3", "What is the Feigenbaum constant δ, and what does it measure?",
     "A: δ ≈ 4.6692. It is the limiting ratio (rₖ−rₖ₋₁)/(rₖ₊₁−rₖ) of successive bifurcation parameter intervals."],
    ["Q4", "Why does the continuous logistic ODE never produce chaos?",
     "A: The ODE dN/dt=rN(1−N/K) is a 1D autonomous system with a single stable equilibrium N*=K for all r>0. By the Poincaré–Bendixson theorem in 1D, no chaos is possible."],
    ["Q5", "State two properties required by Devaney's definition of chaos.",
     "A: (i) Sensitive dependence on initial conditions; (ii) Topological transitivity. A third is density of periodic orbits (sometimes derived from the first two)."],
    ["Q6", "What happens to orbits when r > 4?",
     "A: Orbits can leave the interval [0,1] and diverge — the map no longer models a bounded population."],
  ];
  const cols2 = [0.35, 5.05];
  qa.forEach((item, i) => {
    const cx = cols2[i % 2], cy = 1.28 + Math.floor(i / 2) * 1.4;
    card(s, cx, cy, 4.5, 1.28, { topbar: C.green, shadow: true });
    s.addText(item[0] + "  " + item[1], { x:cx+0.12, y:cy+0.1, w:4.26, h:0.38, fontSize:11, fontFace:"Cambria", bold:true, color:C.green });
    s.addText(item[2], { x:cx+0.12, y:cy+0.5, w:4.26, h:0.7, fontSize:10.5, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide B: Simple Problems ─────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Simple Problems", "Analytical and short computational exercises");
  const probs = [
    { n:"1", col:C.green,
      title:"Fixed-point calculation",
      body:"Find both fixed points of the logistic map for r = 2.5. Verify stability using the derivative criterion |f'(x*)| < 1." },
    { n:"2", col:C.green,
      title:"Stability boundary",
      body:"Show algebraically that the non-trivial fixed point x* = 1−1/r loses stability at exactly r = 3 by computing f'(x*) as a function of r." },
    { n:"3", col:C.accent,
      title:"Period-2 orbit",
      body:"For r = 3.2, iterate the map 1000 times from x₀ = 0.5 and confirm the orbit is period-2. Find the two period-2 values analytically using x± = [(r+1) ± √{(r−3)(r+1)}] / (2r)." },
    { n:"4", col:C.accent,
      title:"Lyapunov exponent",
      body:"Estimate the Lyapunov exponent λ numerically for r = 2.8, 3.5 and 3.9 by averaging (1/N)Σ ln|r(1−2xₙ)| over N = 10,000 iterates. Interpret the sign in each case." },
    { n:"5", col:C.orange,
      title:"Bifurcation diagram",
      body:"Write a short program (Python/MATLAB) to produce the bifurcation diagram for r ∈ [2.5, 4.0]. Identify on your plot: the period-2 bifurcation (r≈3), period-4 (r≈3.45), and the onset of chaos (r≈3.57)." },
    { n:"6", col:C.orange,
      title:"Cobweb diagram",
      body:"Construct cobweb diagrams by hand (or computationally) for r = 1.5, 2.8, 3.3, and 3.9 starting from x₀ = 0.2. Describe qualitatively what each diagram shows about the attractor." },
  ];
  const cols3 = [0.3, 3.42, 6.55];
  const rows3 = [1.28, 3.1];
  probs.forEach((p, i) => {
    const bx = cols3[i % 3], by = rows3[Math.floor(i / 3)];
    card(s, bx, by, 2.88, 1.72, { topbar: p.col });
    s.addText("Problem " + p.n + ": " + p.title, { x:bx+0.12, y:by+0.1, w:2.64, h:0.38, fontSize:11, fontFace:"Cambria", bold:true, color:p.col });
    s.addText(p.body, { x:bx+0.12, y:by+0.5, w:2.64, h:1.12, fontSize:10, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide C: Complex Problems ────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Challenging Problems", "Deeper analytical and extended computational problems");
  const probs2 = [
    { n:"7", col:C.purple,
      title:"Period-3 existence",
      body:"Show that a period-3 orbit exists for r = 1+2√2 ≈ 3.828. Hint: find r such that f³(x) = x has a solution other than the fixed points. Use Li–Yorke: period-3 implies chaos." },
    { n:"8", col:C.purple,
      title:"Feigenbaum scaling",
      body:"From a computed bifurcation diagram, measure r₁=3.00, r₂=3.449, r₃=3.544, r₄=3.564. Calculate the successive ratios δₖ = (rₖ−rₖ₋₁)/(rₖ₊₁−rₖ) and show they converge toward 4.6692." },
    { n:"9", col:C.yellow,
      title:"Invariant density at r=4",
      body:"Verify numerically that the invariant density of the logistic map at r=4 is ρ(x) = 1/[π√(x(1−x))]. Generate 10⁶ iterates, plot a histogram, and overlay the theoretical arcsine distribution." },
    { n:"10", col:C.yellow,
      title:"Sensitive dependence",
      body:"For r = 3.9, plot |xₙ − yₙ| vs n on a log scale, starting from x₀ = 0.5 and y₀ = 0.5 + ε for ε = 10⁻³, 10⁻⁶, 10⁻⁹. Estimate λ from the slope and compare to the direct Lyapunov calculation." },
    { n:"11", col:C.orange,
      title:"Universality check",
      body:"Repeat the bifurcation analysis for the sine map xₙ₊₁ = r·sin(πxₙ) and the quadratic map xₙ₊₁ = r − xₙ². Measure δ for each. Verify that all three converge to the same Feigenbaum constant." },
    { n:"12", col:C.orange,
      title:"Conjugacy at r=4",
      body:"Prove that the logistic map at r=4 is topologically conjugate to the tent map T(x) = 1−|2x−1| via the substitution xₙ = sin²(πθₙ/2). Show this implies λ = ln 2 exactly." },
  ];
  const cols4 = [0.3, 3.42, 6.55];
  const rows4 = [1.28, 3.1];
  probs2.forEach((p, i) => {
    const bx = cols4[i % 3], by = rows4[Math.floor(i / 3)];
    card(s, bx, by, 2.88, 1.72, { topbar: p.col });
    s.addText("Problem " + p.n + ": " + p.title, { x:bx+0.12, y:by+0.1, w:2.64, h:0.38, fontSize:11, fontFace:"Cambria", bold:true, color:p.col });
    s.addText(p.body, { x:bx+0.12, y:by+0.5, w:2.64, h:1.12, fontSize:10, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide D: Project Proposals ───────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Project Proposals", "Semester-length undergraduate research projects");
  const projects = [
    { col:C.green, title:"P1: Interactive Bifurcation Explorer",
      body:"Build a web/Python interactive tool to explore the logistic map. Features: animated cobweb, real-time bifurcation diagram, Lyapunov exponent plot, and user-adjustable r. Compare three different unimodal maps side-by-side." },
    { col:C.accent, title:"P2: Feigenbaum Constant Verification",
      body:"Systematically measure the Feigenbaum constant δ for five different unimodal maps (logistic, sine, quadratic, cubic, Gaussian). Write a report comparing numerical results to the theoretical 4.6692 and explaining universality." },
    { col:C.orange, title:"P3: Chaos in a Physical System",
      body:"Experimentally study a nonlinear system (dripping tap, driven pendulum, electronic oscillator) and record period-doubling as a parameter is varied. Compare the measured bifurcation sequence to the logistic map prediction." },
    { col:C.purple, title:"P4: Population Ecology Simulation",
      body:"Use real ecological data (insect populations, fisheries) to fit the logistic map parameter r. Simulate long-term dynamics and assess whether populations exhibit stable cycles or chaos. Discuss ecological implications." },
  ];
  projects.forEach((p, i) => {
    const bx = 0.3 + (i % 2) * 4.75;
    const by = 1.28 + Math.floor(i / 2) * 2.05;
    card(s, bx, by, 4.5, 1.9, { topbar: p.col });
    s.addText(p.title, { x:bx+0.12, y:by+0.1, w:4.26, h:0.35, fontSize:12, fontFace:"Cambria", bold:true, color:p.col });
    s.addText(p.body,  { x:bx+0.12, y:by+0.48, w:4.26, h:1.32, fontSize:10.5, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide E: Introductory Textbooks ──────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Introductory Textbooks & Reading", "Accessible entry-level books on nonlinear dynamics and chaos");

  const books = [
    { n:1, col:C.green,
      authors:"Strogatz, S. H.",
      title:"Nonlinear Dynamics and Chaos (2nd ed.)",
      details:"Westview Press, 2015 — The standard undergraduate text. Chapters 10–12 cover 1D maps, period-doubling, and chaos with clear physical motivation." },
    { n:2, col:C.green,
      authors:"Gleick, J.",
      title:"Chaos: Making a New Science",
      details:"Penguin Books, 1987 — Popular science narrative covering May, Feigenbaum, and the logistic map. Excellent historical context; not a maths textbook." },
    { n:3, col:C.accent,
      authors:"Alligood, K. T., Sauer, T. D. & Yorke, J. A.",
      title:"Chaos: An Introduction to Dynamical Systems",
      details:"Springer, 1996 — Undergraduate-level rigour. Chapter 1 develops the logistic map from scratch with full proofs." },
    { n:4, col:C.accent,
      authors:"Devaney, R. L.",
      title:"An Introduction to Chaotic Dynamical Systems (2nd ed.)",
      details:"Addison-Wesley, 1989 — Mathematically precise. Introduces the three conditions for chaos (Devaney's definition). Ideal bridge to graduate level." },
    { n:5, col:C.orange,
      authors:"May, R. M.",
      title:"Simple mathematical models with very complicated dynamics",
      details:"Nature 261, 459–467 (1976) — The original landmark paper. Essential primary reading; only 8 pages, entirely accessible at BSc level." },
    { n:6, col:C.orange,
      authors:"Sprott, J. C.",
      title:"Chaos and Time-Series Analysis",
      details:"Oxford University Press, 2003 — Broad coverage including the logistic map. Emphasises numerical methods and includes MATLAB/BASIC code listings." },
  ];
  books.forEach((b, i) => {
    const by = 1.28 + i * 0.7;
    refRow(s, 0.3, by, 9.4, b.n, b.authors, b.title, b.details, b.col);
  });
}

// ════════════════════════════════════════════════════════════════
//  MSc CHAPTER DIVIDER
// ════════════════════════════════════════════════════════════════
sectionDivider("MSc / Graduate Section", "Advanced Theory · Problem Sets · References", "0A1628", C.accent);

// ── MSc Slide A: Graduate Content — Renormalisation & Universality
{
  const s = pres.addSlide();
  hdr(s, "Graduate Content: Renormalisation & Universality Theory", "The mathematical machinery behind Feigenbaum's universal constants");

  s.addImage({ data:I.gradFeig, x:5.1, y:1.18, w:4.55, h:2.95 });

  card(s, 0.3, 1.18, 4.6, 4.1, { topbar: C.accent });
  s.addText("Renormalisation Operator T", { x:0.42, y:1.3, w:4.35, h:0.38, fontSize:14, bold:true, color:C.accent, fontFace:"Cambria" });
  const lines = [
    "Define the renormalisation operator on unimodal maps:",
    "T[f](x) = −(1/α) · f(f(−α·x))",
    "where α = −1/f(1) ≈ 2.5029 (Feigenbaum's second constant).",
    "The operator T has a universal fixed point g* satisfying T[g*] = g*, independent of the specific unimodal map.",
    "The linearisation DT at g* has one unstable eigenvalue δ ≈ 4.6692 — this is exactly the Feigenbaum constant.",
    "Period-doubling cascades in all unimodal maps are governed by the same unstable manifold of T in function space.",
    "This explains universality: the rate δ is a property of the renormalisation fixed point, not of any particular map.",
  ];
  let ly = 1.75;
  lines.forEach((line, i) => {
    const isEq = i === 1 || i === 2;
    if (isEq) {
      s.addShape(pres.shapes.RECTANGLE, { x:0.42, y:ly, w:4.25, h:0.42, fill:{color:"0A0F1A"}, line:{color:C.accent, width:1} });
      s.addText(line, { x:0.42, y:ly, w:4.25, h:0.42, fontSize:12, fontFace:"Cambria", bold:true, color:C.accent, align:"center", valign:"middle" });
      ly += 0.48;
    } else {
      s.addText(line, { x:0.42, y:ly, w:4.3, h:0.42, fontSize:11, fontFace:"Calibri", color:C.light, margin:0, valign:"middle" });
      ly += 0.44;
    }
  });

  card(s, 5.1, 4.28, 4.55, 1.0, { topbar: C.orange });
  s.addText("Symbolic Dynamics & Kneading Theory", { x:5.22, y:4.38, w:4.3, h:0.32, fontSize:12.5, bold:true, color:C.orange, fontFace:"Cambria" });
  s.addText("Every orbit can be encoded as an infinite sequence over {L, R} using the partition at the critical point x=0.5. The kneading invariant classifies the topological type of the map and encodes the ordering of all periodic orbits. Milnor–Thurston kneading theory gives a complete combinatorial invariant.", { x:5.22, y:4.72, w:4.3, h:0.5, fontSize:10.5, fontFace:"Calibri", color:C.light });
}

// ── MSc Slide B: Symbolic dynamics & ergodic theory ──────────────
{
  const s = pres.addSlide();
  hdr(s, "Graduate Content: Ergodic Theory & Measure-Theoretic Chaos", "Invariant measures, mixing, and entropy");

  s.addImage({ data:I.gradSym, x:0.3, y:1.18, w:9.4, h:2.82 });

  card(s, 0.3, 4.15, 3.0, 1.42, { topbar: C.accent });
  s.addText("Invariant Measures", { x:0.42, y:4.27, w:2.76, h:0.32, fontSize:12, bold:true, color:C.accent, fontFace:"Cambria" });
  s.addText("A probability measure μ is invariant under f if μ(f⁻¹(A)) = μ(A) for all measurable A. At r=4, the unique absolutely continuous invariant measure (ACIM) is the arcsine distribution ρ(x) = 1/[π√(x(1−x))]. Existence proved by Lasota & Yorke (1973).", { x:0.42, y:4.6, w:2.76, h:0.9, fontSize:10, fontFace:"Calibri", color:C.light });

  card(s, 3.5, 4.15, 3.0, 1.42, { topbar: C.purple });
  s.addText("Mixing & Correlation Decay", { x:3.62, y:4.27, w:2.76, h:0.32, fontSize:12, bold:true, color:C.purple, fontFace:"Cambria" });
  s.addText("A system is (strong) mixing if μ(A∩f⁻ⁿ(B)) → μ(A)μ(B) as n→∞. This implies exponential decay of correlations: C(n) = 〈g(fⁿ)h〉 − 〈g〉〈h〉 → 0. At r=4 the autocorrelation decays exponentially — confirmed numerically (right panel above).", { x:3.62, y:4.6, w:2.76, h:0.9, fontSize:10, fontFace:"Calibri", color:C.light });

  card(s, 6.7, 4.15, 3.0, 1.42, { topbar: C.green });
  s.addText("Kolmogorov–Sinai Entropy", { x:6.82, y:4.27, w:2.76, h:0.32, fontSize:12, bold:true, color:C.green, fontFace:"Cambria" });
  s.addText("The KS entropy h(f, μ) equals the metric entropy and, by Pesin's theorem, equals the sum of positive Lyapunov exponents: h = λ = ln 2 at r = 4. Topological entropy hₜₒₚ = max over all invariant measures; equals ln 2 for r = 4.", { x:6.82, y:4.6, w:2.76, h:0.9, fontSize:10, fontFace:"Calibri", color:C.light });
}

// ── MSc Slide C: Advanced topics ────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "Graduate Content: Advanced Topics", "Multifractal analysis, topological entropy, conjugacies");

  s.addImage({ data:I.gradAdv, x:5.1, y:1.18, w:4.55, h:2.95 });

  card(s, 0.3, 1.18, 4.6, 4.1, { topbar: C.purple });
  s.addText("Multifractal Formalism", { x:0.42, y:1.3, w:4.35, h:0.38, fontSize:14, bold:true, color:C.purple, fontFace:"Cambria" });
  const mlines = [
    ["Hölder exponent α", "Measures local scaling of the invariant measure: μ(Bᵣ(x)) ~ rᵅ"],
    ["Multifractal spectrum f(α)", "Hausdorff dimension of the set {x : local exponent = α}; gives a curved spectrum for non-uniform measures"],
    ["Legendre transform", "f(α) = infₓ[αq − τ(q)] where τ(q) is the Rényi dimension spectrum D_q"],
    ["At r=4", "The arcsine measure yields f(α) parabolic, max f=1 at α=1; all Rényi dimensions D_q = 1"],
    ["Cantor-set attractor", "At r∞: measure concentrated on a Cantor set; D_H ≈ 0.538; non-trivial multifractal spectrum"],
  ];
  let my = 1.76;
  mlines.forEach(([t, d]) => {
    s.addText(t + ": ", { x:0.42, y:my, w:1.45, h:0.4, fontSize:11, fontFace:"Cambria", bold:true, color:C.purple, margin:0, valign:"middle" });
    s.addText(d, { x:1.87, y:my, w:3.0, h:0.4, fontSize:11, fontFace:"Calibri", color:C.light, margin:0, valign:"middle" });
    my += 0.45;
  });

  card(s, 0.3, 4.38, 4.6, 0.88, { topbar: C.orange });
  s.addText("Topological Conjugacy", { x:0.42, y:4.48, w:4.35, h:0.3, fontSize:12, bold:true, color:C.orange, fontFace:"Cambria" });
  s.addText("At r=4: f topologically conjugate to tent map via h(x)=sin²(πx/2) — satisfies f∘h = h∘T. Also conjugate to the angle-doubling map θ↦2θ on the circle, and to the bit-shift on binary sequences. Conjugacy preserves all topological properties.", { x:0.42, y:4.8, w:4.35, h:0.42, fontSize:10.5, fontFace:"Calibri", color:C.light });

  card(s, 5.1, 4.28, 4.55, 1.0, { topbar: C.yellow });
  s.addText("Stability Islands & Sharkovsky Order", { x:5.22, y:4.38, w:4.3, h:0.32, fontSize:12.5, bold:true, color:C.yellow, fontFace:"Cambria" });
  s.addText("Sharkovsky's theorem (1964): if a continuous map of ℝ has a period-n orbit, it has a period-m orbit for all m that follow n in the Sharkovsky order: 3≺5≺7≺…≺2·3≺2·5≺…≺2²·3≺…≺2ⁿ≺…≺4≺2≺1. Period-3 ⟹ all periods.", { x:5.22, y:4.72, w:4.3, h:0.5, fontSize:10.5, fontFace:"Calibri", color:C.light });
}

// ── MSc Slide D: MSc Simple Problems ─────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc — Problem Set I: Foundational Graduate Problems", "Analytical problems requiring measure theory and functional analysis");
  const mprobs = [
    { n:"M1", col:C.accent,
      title:"Invariant measure construction",
      body:"Use the Frobenius–Perron operator P defined by (Pρ)(x) = Σ ρ(y)/|f'(y)| over pre-images to find the invariant density of the logistic map at r=4. Verify it satisfies Pρ* = ρ*." },
    { n:"M2", col:C.accent,
      title:"Topological entropy",
      body:"Prove that the topological entropy of the logistic map at r=4 equals ln 2 using the lap-counting formula hₜₒₚ = lim(1/n)ln(laps of fⁿ). Reconcile with the Pesin formula hₜₒₚ = λ = ln 2." },
    { n:"M3", col:C.purple,
      title:"Renormalisation fixed point",
      body:"Verify numerically that the functional equation g(x) = −(1/α)g(g(−αx)) is satisfied to high precision by a polynomial approximation to g* truncated at degree 6. Compute α and δ from the linearisation." },
    { n:"M4", col:C.purple,
      title:"Kneading invariant",
      body:"Compute the kneading sequence for r = 3.5 (period-4 orbit). Write down the symbolic itinerary of the critical point x=0.5 under iteration, and use it to predict the ordering of all periodic orbits." },
    { n:"M5", col:C.orange,
      title:"Decay of correlations",
      body:"For the logistic map at r=4, prove that the autocorrelation function C(n) = ∫xₙ·x₀ dμ − (∫x dμ)² decays exponentially in n using the spectral gap of the Frobenius–Perron operator on L²(μ)." },
    { n:"M6", col:C.orange,
      title:"Hausdorff dimension",
      body:"Estimate the Hausdorff dimension of the Feigenbaum attractor (at r∞ ≈ 3.5699) numerically using a box-counting algorithm. Compare to the known value D_H ≈ 0.538 and explain its non-integer character." },
  ];
  const mc = [0.3, 3.42, 6.55], mr = [1.28, 3.1];
  mprobs.forEach((p, i) => {
    const bx=mc[i%3], by=mr[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Problem "+p.n+": "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── MSc Slide E: MSc Complex Problems ────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc — Problem Set II: Advanced Graduate Problems", "Research-level problems requiring deep theoretical tools");
  const mprobs2 = [
    { n:"M7", col:C.accent,
      title:"Universality proof sketch",
      body:"Sketch the argument that all unimodal maps with a quadratic critical point share the same Feigenbaum constants. Identify the role of the unstable manifold of the renormalisation fixed point g* in function space." },
    { n:"M8", col:C.purple,
      title:"Stochastic logistic map",
      body:"Add additive noise: xₙ₊₁ = rxₙ(1−xₙ) + σεₙ where εₙ ~ N(0,1). Analyse how noise smears the bifurcation diagram. Show that the noise-perturbed invariant density satisfies a Fokker–Planck equation in the small-noise limit." },
    { n:"M9", col:C.purple,
      title:"Complex logistic map",
      body:"Extend the logistic map to complex r ∈ ℂ. Show that for r ∈ ℝ the map reduces to the standard case, but for r ∈ ℂ the filled Julia set connects the logistic map to the Mandelbrot set. Locate the main cardioid boundary." },
    { n:"M10", col:C.orange,
      title:"Coupled map lattice",
      body:"Study a 1D lattice of N coupled logistic maps: xₙ₊₁(i) = (1−ε)f(xₙ(i)) + (ε/2)[f(xₙ(i−1))+f(xₙ(i+1))]. Identify conditions on ε and r for synchronisation. Relate to spatiotemporal chaos." },
    { n:"M11", col:C.orange,
      title:"Rigorous chaos proof",
      body:"Using the Li–Yorke theorem (1975), give a rigorous proof that the existence of a period-3 point implies chaos (in the Li–Yorke sense) for the logistic map. Identify an explicit period-3 point for r = 1+2√2." },
    { n:"M12", col:C.yellow,
      title:"Symbolic entropy bound",
      body:"Using symbolic dynamics, prove that the topological entropy h(f) of the logistic map satisfies h(f) ≥ (1/p)ln k_p where k_p is the number of distinct period-p orbits. Compute this bound for p = 1,2,3 and compare to ln 2." },
  ];
  const mc2 = [0.3,3.42,6.55], mr2 = [1.28,3.1];
  mprobs2.forEach((p,i)=>{
    const bx=mc2[i%3],by=mr2[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Problem "+p.n+": "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── MSc Slide F: MSc Project Proposals ───────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc — Project Proposals", "Research-oriented dissertation projects");
  const projs = [
    { col:C.accent, title:"MP1: Stochastic bifurcations",
      body:"Systematically study how additive and multiplicative noise modify the period-doubling cascade. Use the Fokker–Planck framework to derive noise-shifted bifurcation points and compare to numerical simulations. Expected finding: bifurcations shift by O(σ²/³)." },
    { col:C.purple, title:"MP2: Coupled map lattices & synchronisation",
      body:"Investigate coupled logistic maps on a ring of N oscillators. Map out the parameter space (r, ε) separating: full synchronisation, cluster states, and spatiotemporal chaos. Characterise transition via the transverse Lyapunov exponent." },
    { col:C.orange, title:"MP3: Generalised Feigenbaum theory",
      body:"Extend the renormalisation analysis to maps with a critical point of order z ≠ 2 (i.e., f'(x*) = 0, f''(x*) ≠ 0). Numerically compute δ(z) and α(z). Verify that δ → 2 and α → 1 as z → ∞ (the symbolic limit)." },
    { col:C.yellow, title:"MP4: Experimental period-doubling",
      body:"Use an analogue circuit (e.g. Wien-bridge oscillator with diode nonlinearity) or driven nonlinear pendulum to observe period-doubling experimentally. Measure the bifurcation sequence, estimate δ, and compare to Feigenbaum's constant. Write a full experimental report." },
  ];
  projs.forEach((p,i)=>{
    const bx=0.3+(i%2)*4.75, by=1.28+Math.floor(i/2)*2.05;
    card(s,bx,by,4.5,1.9,{topbar:p.col});
    s.addText(p.title,{x:bx+0.12,y:by+0.1,w:4.26,h:0.35,fontSize:12,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.48,w:4.26,h:1.32,fontSize:10.5,fontFace:"Calibri",color:C.light});
  });
}

// ── MSc Slide G: Graduate Textbooks (page 1) ─────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc / Graduate Textbooks — Core References", "Essential books for a rigorous treatment of chaos and dynamical systems");
  const gbooks = [
    { n:1, col:C.accent,
      authors:"Katok, A. & Hasselblatt, B.",
      title:"Introduction to the Modern Theory of Dynamical Systems",
      details:"Cambridge University Press, 1995 — The graduate bible. Chapter 15 covers low-dimensional chaos, Pesin theory, Lyapunov exponents." },
    { n:2, col:C.accent,
      authors:"de Melo, W. & van Strien, S.",
      title:"One-Dimensional Dynamics",
      details:"Springer, 1993 — Comprehensive and rigorous treatment of interval maps. Proves existence of ACIMs, renormalisation, Feigenbaum theory." },
    { n:3, col:C.purple,
      authors:"Collet, P. & Eckmann, J.-P.",
      title:"Iterated Maps on the Interval as Dynamical Systems",
      details:"Birkhäuser, 1980 (reprint 2009) — The original rigorous treatment of period-doubling universality. Proves existence of the Feigenbaum fixed point." },
    { n:4, col:C.purple,
      authors:"Milnor, J. & Thurston, W.",
      title:"On Iterated Maps of the Interval",
      details:"Lecture Notes in Math 1342, Springer, 1988 — Foundational paper on kneading theory. Defines kneading invariants and proves topological classification." },
    { n:5, col:C.orange,
      authors:"Ott, E.",
      title:"Chaos in Dynamical Systems (2nd ed.)",
      details:"Cambridge University Press, 2002 — Graduate-level treatment including fractal dimensions, Lyapunov exponents, and applications. Chapters 2–4 cover the logistic map in depth." },
    { n:6, col:C.orange,
      authors:"Robinson, C.",
      title:"Dynamical Systems: Stability, Symbolic Dynamics, and Chaos",
      details:"CRC Press, 1995 — Rigorous graduate text. Good coverage of symbolic dynamics, topological entropy, and the connection to the logistic map." },
  ];
  gbooks.forEach((b,i)=>{
    const by=1.28+i*0.7;
    refRow(s,0.3,by,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── MSc Slide H: Graduate Textbooks (page 2) + Key Papers ────────
{
  const s = pres.addSlide();
  hdr(s, "MSc / Graduate References — Key Papers & More Books", "Primary literature and additional graduate reading");

  // Left: more books
  card(s, 0.3, 1.18, 4.55, 4.1, { topbar: C.accent });
  s.addText("Additional Graduate Books", { x:0.42, y:1.3, w:4.3, h:0.35, fontSize:13.5, bold:true, color:C.accent, fontFace:"Cambria" });
  const mbooks2 = [
    { n:7, col:C.accent, authors:"Lasota, A. & Mackey, M. C.", title:"Chaos, Fractals and Noise", details:"Springer, 1994 — Stochastic aspects, Frobenius–Perron operator, invariant measures." },
    { n:8, col:C.purple, authors:"Falconer, K.", title:"Fractal Geometry (3rd ed.)", details:"Wiley, 2014 — Definitive reference on fractal dimensions. Chapter 13 covers dynamical systems." },
    { n:9, col:C.purple, authors:"Walters, P.", title:"An Introduction to Ergodic Theory", details:"Springer, 1982 — KS entropy, mixing, invariant measures. Essential ergodic theory background." },
    { n:10, col:C.orange, authors:"Wiggins, S.", title:"Introduction to Applied Nonlinear Dynamical Systems and Chaos", details:"Springer, 2003 — Applied graduate level. Good chapter on 1D maps and bifurcations." },
  ];
  let by2 = 1.72;
  mbooks2.forEach(b => {
    refRow(s, 0.42, by2, 4.3, b.n, b.authors, b.title, b.details, b.col);
    by2 += 0.62;
  });

  // Right: key papers
  card(s, 5.1, 1.18, 4.55, 4.1, { topbar: C.orange });
  s.addText("Essential Graduate Papers", { x:5.22, y:1.3, w:4.3, h:0.35, fontSize:13.5, bold:true, color:C.orange, fontFace:"Cambria" });
  const papers = [
    { n:1, col:C.orange, authors:"Feigenbaum, M. J.", title:"Quantitative universality for a class of nonlinear transformations", details:"J. Stat. Phys. 19, 25–52 (1978) — Original discovery of δ and α." },
    { n:2, col:C.orange, authors:"Li, T.-Y. & Yorke, J. A.", title:"Period three implies chaos", details:"Am. Math. Monthly 82, 985–992 (1975) — Coined 'chaos'; rigorous period-3 result." },
    { n:3, col:C.yellow, authors:"Lasota, A. & Yorke, J. A.", title:"On the existence of invariant measures", details:"Trans. AMS 186, 481–488 (1973) — Proved existence of ACIM for piecewise expanding maps." },
    { n:4, col:C.yellow, authors:"Collet, P. & Eckmann, J.-P.", title:"A renormalization group analysis of the hierarchical model", details:"Commun. Math. Phys. 55, 67–96 (1977) — Rigorous renormalisation." },
    { n:5, col:C.green, authors:"Jakobson, M. V.", title:"Absolutely continuous invariant measures for one-parameter families", details:"Commun. Math. Phys. 81, 39–88 (1981) — Positive measure set of r values with ACIM." },
  ];
  let rpy = 1.72;
  papers.forEach(p => {
    refRow(s, 5.22, rpy, 4.3, p.n, p.authors, p.title, p.details, p.col);
    rpy += 0.68;
  });
}

// ════════════════════════════════════════════════════════════════
//  PhD CHAPTER DIVIDER
// ════════════════════════════════════════════════════════════════
sectionDivider("PhD / Research Section", "Open Problems · Publications · Review Papers", "0A1628", C.orange);

// ── PhD Slide A: PhD-level content ────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD-Level Content: Current Research Landscape", "Open frontiers where the logistic map intersects active research");

  s.addImage({ data:I.phdAdv, x:5.1, y:1.18, w:4.55, h:2.9 });

  card(s, 0.3, 1.18, 4.6, 4.1, { topbar: C.orange });
  s.addText("Active Research Areas", { x:0.42, y:1.3, w:4.35, h:0.38, fontSize:14, bold:true, color:C.orange, fontFace:"Cambria" });
  const areas = [
    ["Noise-induced phenomena", "Stochastic resonance, noise-induced transitions between attractors, blowout bifurcations in random dynamical systems."],
    ["Non-autonomous & driven maps", "Time-varying r(n), quasi-periodically forced logistic maps; strange non-chaotic attractors (SNAs) in the parameter space."],
    ["Network & coupled maps", "Coupled map lattices (CMLs), chimera states, cluster synchronisation, and spatiotemporal pattern formation in large arrays."],
    ["Quantum analogues", "Quantum logistic map, entanglement dynamics in quantum chaos, and connections to random matrix theory (GUE statistics of level spacings)."],
    ["Machine learning & prediction", "Using reservoir computing and echo-state networks to predict chaotic time series from the logistic map; connections to computational learning theory."],
    ["Generalised maps", "z-unimodal maps, Lorenz-like maps, higher-dimensional generalisations; universality in 2D maps (Hénon family)."],
  ];
  let ay = 1.76;
  areas.forEach(([t, d]) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.4, y:ay+0.06, w:0.055, h:0.42, fill:{color:C.orange}, line:{type:"none"} });
    s.addText(t + ": ", { x:0.52, y:ay, w:1.5, h:0.28, fontSize:11, fontFace:"Cambria", bold:true, color:C.orange, margin:0 });
    s.addText(d, { x:0.52, y:ay+0.26, w:4.2, h:0.24, fontSize:10, fontFace:"Calibri", color:C.light, margin:0 });
    ay += 0.58;
  });

  card(s, 5.1, 4.22, 4.55, 1.06, { topbar: C.red });
  s.addText("Complexity & Computational Aspects", { x:5.22, y:4.32, w:4.3, h:0.32, fontSize:12.5, bold:true, color:C.red, fontFace:"Cambria" });
  s.addText("The logistic map at r=4 is computationally universal (Wolfram). Connections to #P-hard problems in counting periodic orbits. Relations to one-way functions and pseudorandomness in cryptography. Recent work on certified computation of invariant measures.", { x:5.22, y:4.66, w:4.3, h:0.55, fontSize:10.5, fontFace:"Calibri", color:C.light });
}

// ── PhD Slide B: Simple research problems ─────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Accessible Research Problems", "Well-posed problems solvable within a PhD chapter");
  const rprobs = [
    { n:"R1", col:C.orange,
      title:"Noise-perturbed bifurcation diagram",
      body:"Derive analytically how additive noise σεₙ shifts the period-doubling bifurcation points. Conjecture: the k-th bifurcation shifts by O(σ^(2/3) δᵏ). Verify numerically and provide a rigorous lower bound using the Frobenius–Perron operator." },
    { n:"R2", col:C.orange,
      title:"Rate of mixing for non-quadratic maps",
      body:"For the family fᵣ,z(x) = 1 − r|x|^z with z ≠ 2, determine how the exponential rate of mixing (spectral gap of F-P operator) depends on z. Establish whether the gap closes as z→1 (piecewise linear limit) and z→∞ (symbolic limit)." },
    { n:"R3", col:C.accent,
      title:"Lyapunov spectrum in coupled maps",
      body:"For a ring of N coupled logistic maps (CML), compute the full Lyapunov spectrum λ₁ ≥ λ₂ ≥ … ≥ λ_N as a function of coupling ε and r. Identify the Kaplan–Yorke dimension and relate it to spatiotemporal complexity." },
    { n:"R4", col:C.accent,
      title:"Strange non-chaotic attractors",
      body:"In the quasi-periodically forced logistic map xₙ₊₁ = r·xₙ(1−xₙ)·(1+ε·cos(2πnω)), identify the parameter regime where strange non-chaotic attractors (SNAs) exist (λ < 0 but fractal structure). Characterise via the phase sensitivity exponent." },
    { n:"R5", col:C.purple,
      title:"Certified computation of invariant measures",
      body:"Using interval arithmetic and rigorous enclosures of the Frobenius–Perron operator, compute a certified upper bound on the L¹ error in the approximated invariant density for r=3.8 (periodic window). Compare to known numerical methods." },
    { n:"R6", col:C.purple,
      title:"Quantum logistic map entanglement",
      body:"Define the quantum logistic map via a unitary operator on qubits. Study how bipartite entanglement entropy grows under iteration. Determine whether the classical Lyapunov exponent bounds the entanglement growth rate and identify phase transitions." },
  ];
  const rc=[0.3,3.42,6.55], rr=[1.28,3.1];
  rprobs.forEach((p,i)=>{
    const bx=rc[i%3],by=rr[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Problem "+p.n+": "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── PhD Slide C: Open research problems ───────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Open Research Problems", "Unsolved or partially solved problems at the frontier");
  const open = [
    { n:"O1", col:C.red,
      title:"Measure of chaos in parameter space",
      body:"Jakobson (1981) proved that the set of r values with an ACIM has positive Lebesgue measure. Open: determine the exact measure of this set in [3.57, 4]. Graczyk–Świątek proved denseness of hyperbolicity but the exact Hausdorff dimension of the 'chaotic' set remains open." },
    { n:"O2", col:C.red,
      title:"Smooth conjugacy at bifurcation points",
      body:"The Feigenbaum fixed point g* is known to exist and be C^∞. Open: prove (rigorously, without computer-assisted proof) that the linearisation of the renormalisation operator T at g* has exactly one unstable eigenvalue δ ≈ 4.6692." },
    { n:"O3", col:C.orange,
      title:"Statistical properties for typical parameters",
      body:"For Lebesgue-almost every r ∈ (r∞, 4] with an ACIM, prove exponential decay of correlations and a central limit theorem for Birkhoff sums. Partial results exist (Benedicks–Carleson, Young 1992), but complete characterisation is open." },
    { n:"O4", col:C.orange,
      title:"Complex analytic extension of universality",
      body:"Prove rigorously that the Feigenbaum universality extends to the full complex analytic setting — i.e. that the quadratic family has a renormalisation fixed point in the space of analytic maps, with the same δ. Partial results by McMullen (1996) exist." },
    { n:"O5", col:C.purple,
      title:"Universality in higher dimensions",
      body:"For 2D Hénon-like maps fₐ,ᵦ(x,y) = (1−ax²+y, bx), the period-doubling route to chaos was proved to exist by Coullet–Tresser and Feigenbaum independently, but a complete renormalisation proof in 2D is still incomplete for b≠0." },
    { n:"O6", col:C.purple,
      title:"Quantum-classical correspondence",
      body:"Define precisely the semiclassical limit of the quantum logistic map as ℏ→0. Prove (or disprove) that quantum ergodicity (eigenstate thermalisation) holds in the classically chaotic regime, and characterise the quantum-classical transition boundary." },
  ];
  const oc=[0.3,3.42,6.55], oor=[1.28,3.1];
  open.forEach((p,i)=>{
    const bx=oc[i%3],by=oor[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Open: "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── PhD Slide D: Core publications (page 1) ───────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Essential Publications I", "Foundational papers every researcher should know");
  const pubs1 = [
    { n:1, col:C.orange, authors:"Feigenbaum, M. J.", title:"Quantitative universality for a class of nonlinear transformations", details:"J. Stat. Phys. 19, 25–52 (1978). First announcement of δ ≈ 4.6692." },
    { n:2, col:C.orange, authors:"Feigenbaum, M. J.", title:"The universal metric properties of nonlinear transformations", details:"J. Stat. Phys. 21, 669–706 (1979). Full renormalisation theory; introduces α ≈ 2.5029." },
    { n:3, col:C.accent, authors:"Coullet, P. & Tresser, C.", title:"Itérations d'endomorphismes et groupe de renormalisation", details:"C. R. Acad. Sci. Paris 287A, 577 (1978). Independent discovery of Feigenbaum universality." },
    { n:4, col:C.accent, authors:"May, R. M.", title:"Simple mathematical models with very complicated dynamics", details:"Nature 261, 459–467 (1976). The landmark popularisation paper." },
    { n:5, col:C.purple, authors:"Li, T.-Y. & Yorke, J. A.", title:"Period three implies chaos", details:"Am. Math. Monthly 82, 985–992 (1975). Coined the term 'chaos'; proved period-3 implies all periods." },
    { n:6, col:C.purple, authors:"Lorenz, E. N.", title:"Deterministic nonperiodic flow", details:"J. Atmos. Sci. 20, 130–141 (1963). The famous paper introducing the Lorenz attractor and sensitive dependence." },
    { n:7, col:C.green, authors:"Jakobson, M. V.", title:"Absolutely continuous invariant measures for one-parameter families of one-dimensional maps", details:"Commun. Math. Phys. 81, 39–88 (1981). Proved positive measure of parameters with ACIM." },
    { n:8, col:C.green, authors:"Collet, P. & Eckmann, J.-P.", title:"Iterated Maps on the Interval as Dynamical Systems", details:"Birkhäuser (1980). First rigorous book-length treatment of renormalisation universality." },
  ];
  pubs1.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── PhD Slide E: Core publications (page 2) ───────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Essential Publications II", "Advanced papers on invariant measures, symbolic dynamics, and ergodic theory");
  const pubs2 = [
    { n:9,  col:C.orange, authors:"Lasota, A. & Yorke, J. A.", title:"On the existence of invariant measures for piecewise monotonic transformations", details:"Trans. AMS 186, 481–488 (1973). Proved existence of ACIMs for piecewise expanding maps." },
    { n:10, col:C.orange, authors:"Graczyk, J. & Świątek, G.", title:"Generic hyperbolicity in the logistic family", details:"Ann. Math. 146, 1–52 (1997). Proved hyperbolicity is dense in parameter space." },
    { n:11, col:C.accent, authors:"Lyubich, M.", title:"Almost every real quadratic map is either regular or stochastic", details:"Ann. Math. 156, 1–78 (2002). Resolves the measure-theoretic dichotomy for the logistic family." },
    { n:12, col:C.accent, authors:"Benedicks, M. & Carleson, L.", title:"On iterations of 1−ax² on (−1, 1)", details:"Ann. Math. 122, 1–25 (1985). Proved positive measure chaotic parameters for quadratic maps." },
    { n:13, col:C.purple, authors:"Young, L.-S.", title:"Statistical properties of dynamical systems with some hyperbolicity", details:"Ann. Math. 147, 585–650 (1998). Tower constructions; exponential mixing for logistic-type maps." },
    { n:14, col:C.purple, authors:"McMullen, C. T.", title:"The Mandelbrot set is universal", details:"In 'The Mandelbrot Set, Theme and Variations', CUP (2000). Renormalisation in complex dynamics." },
    { n:15, col:C.green, authors:"Sharkovsky, O. M.", title:"Coexistence of cycles of a continuous mapping of a line into itself", details:"Ukr. Math. J. 16, 61–71 (1964). The original Sharkovsky ordering theorem." },
    { n:16, col:C.green, authors:"Milnor, J. & Thurston, W.", title:"On iterated maps of the interval", details:"Lecture Notes in Math. 1342, 465–563, Springer (1988). Kneading theory and topological classification." },
  ];
  pubs2.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── PhD Slide F: Core publications (page 3) ───────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Essential Publications III", "Applications, noise, coupled maps, and recent theoretical advances");
  const pubs3 = [
    { n:17, col:C.orange, authors:"Kaneko, K.", title:"Spatiotemporal chaos in one- and two-dimensional coupled map lattices", details:"Physica D 37, 60–82 (1989). Foundational CML paper; period-doubling in extended systems." },
    { n:18, col:C.orange, authors:"Grebogi, C., Ott, E. & Yorke, J. A.", title:"Crises, sudden changes in chaotic attractors and transient chaos", details:"Physica D 7, 181–200 (1983). Interior and boundary crises in the logistic map." },
    { n:19, col:C.accent, authors:"Pomeau, Y. & Manneville, P.", title:"Intermittent transition to turbulence in dissipative dynamical systems", details:"Commun. Math. Phys. 74, 189–197 (1980). The intermittency route; Pomeau–Manneville scenario." },
    { n:20, col:C.accent, authors:"Eckmann, J.-P. & Ruelle, D.", title:"Ergodic theory of chaos and strange attractors", details:"Rev. Mod. Phys. 57, 617–656 (1985). Comprehensive review of Lyapunov exponents, entropy, and dimensions." },
    { n:21, col:C.purple, authors:"Rand, D., Ostlund, S., Sethna, J. & Siggia, E. D.", title:"Universal transition from quasiperiodicity to chaos in dissipative systems", details:"Phys. Rev. Lett. 49, 132 (1982). Circle-map route to chaos; different universality class." },
    { n:22, col:C.purple, authors:"Avila, A. & Moreira, C. G.", title:"Statistical properties of unimodal maps", details:"Publ. Math. IHÉS 101, 1–69 (2005). Most complete modern treatment of the statistical theory." },
    { n:23, col:C.green, authors:"Tsujii, M.", title:"Absolutely continuous invariant measures for expanding piecewise linear maps", details:"Invent. Math. 143, 349–373 (2001). Spectral gap and mixing rates for maps with ACIMs." },
    { n:24, col:C.green, authors:"Hunt, B. R., Kennedy, J. A., Li, T.-Y. & Nusse, H. E.", title:"SLYRB measures: natural invariant measures for chaotic systems", details:"Physica D 170, 50–71 (2002). SRB/SLYRB measures and their physical interpretation." },
  ];
  pubs3.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── PhD Slide G: Recent Review Papers ─────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Recent Review Papers & Modern Surveys", "Review articles and monographs for current research directions");

  // Two columns
  card(s, 0.3, 1.18, 4.55, 4.1, { topbar: C.orange });
  s.addText("Review Articles (2000–present)", { x:0.42, y:1.3, w:4.3, h:0.35, fontSize:13, bold:true, color:C.orange, fontFace:"Cambria" });
  const reviews = [
    { n:1, col:C.orange, authors:"Strogatz, S. H. et al.", title:"Coupled oscillators and biological synchronisation", details:"Sci. Am., Dec 1993 — classic; and Nature Reviews Physics 2022 review of nonlinear dynamics." },
    { n:2, col:C.yellow, authors:"Luzzatto, S., Melbourne, I. & Paccaut, F.", title:"The Lorenz attractor is mixing", details:"Commun. Math. Phys. 260, 393–401 (2005). Rigorous mixing proof, techniques applicable to logistic map." },
    { n:3, col:C.orange, authors:"Viana, M.", title:"Stochastic dynamics of deterministic systems", details:"IMPA Lecture Notes (1997). Reviews Benedicks–Carleson, Young towers; excellent PhD entry point." },
    { n:4, col:C.yellow, authors:"Avila, A.", title:"Global theory of one-frequency Schrödinger operators", details:"Acta Math. 215, 1–54 (2015). Fields medal work; connections to 1D dynamics and renormalisation." },
    { n:5, col:C.orange, authors:"Baladi, V.", title:"Dynamical Zeta Functions and Dynamical Determinants for Hyperbolic Maps", details:"Springer (2018). Modern spectral theory for transfer operators; includes logistic map examples." },
  ];
  let ry = 1.72;
  reviews.forEach(r => {
    refRow(s, 0.42, ry, 4.3, r.n, r.authors, r.title, r.details, r.col);
    ry += 0.68;
  });

  card(s, 5.1, 1.18, 4.55, 4.1, { topbar: C.purple });
  s.addText("Modern Research Directions", { x:5.22, y:1.3, w:4.3, h:0.35, fontSize:13, bold:true, color:C.purple, fontFace:"Cambria" });
  const modern = [
    { n:6, col:C.purple, authors:"Galatolo, S. & Nisoli, I.", title:"Rigorous computation of invariant measures and rates of decay of correlations", details:"arXiv:2107.xxxxx (2021). Certified numerical methods for logistic-type maps." },
    { n:7, col:C.purple, authors:"Bochi, J. & Viana, M.", title:"The Lyapunov exponents of generic volume-preserving and symplectic maps", details:"Ann. Math. 161, 1423–1485 (2005). Generic Lyapunov theory." },
    { n:8, col:C.green, authors:"Carvalho, M. & Varandas, P.", title:"(Semi)continuity of the entropy of Sinai–Ruelle–Bowen measures", details:"Nonlinearity 35 (2022). Recent progress on entropy continuity near bifurcations." },
    { n:9, col:C.green, authors:"Liverani, C.", title:"Decay of correlations", details:"Ann. Math. 142, 239–301 (1995). Seminal paper on exponential mixing using cone methods." },
    { n:10, col:C.purple, authors:"Benedicks, M. & Young, L.-S.", title:"Absolutely continuous invariant measures and random perturbations for certain one-dimensional maps", details:"Ergodic Th. Dyn. Sys. 12, 13–37 (1992)." },
  ];
  let rpy2 = 1.72;
  modern.forEach(r => {
    refRow(s, 5.22, rpy2, 4.3, r.n, r.authors, r.title, r.details, r.col);
    rpy2 += 0.68;
  });
}

// ── PhD Slide H: PhD Textbooks & Advanced Monographs ──────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Advanced Monographs & PhD-Level Books", "Graduate textbooks for deep immersion in the field");
  const phbooks = [
    { n:1, col:C.orange, authors:"Baladi, V.", title:"Positive Transfer Operators and Decay of Correlations", details:"World Scientific (2000). Rigorous spectral theory for Perron–Frobenius operators; mixing rates." },
    { n:2, col:C.orange, authors:"de Melo, W. & van Strien, S.", title:"One-Dimensional Dynamics", details:"Springer (1993). The definitive research monograph. Complete proofs of all major results for interval maps." },
    { n:3, col:C.purple, authors:"Collet, P. & Eckmann, J.-P.", title:"Iterated Maps on the Interval as Dynamical Systems", details:"Birkhäuser (1980, reprint 2009). The original universality monograph; still the gold standard." },
    { n:4, col:C.purple, authors:"Milnor, J.", title:"Dynamics in One Complex Variable (3rd ed.)", details:"Princeton University Press (2006). Complex analytic dynamics; Mandelbrot set, Julia sets, renormalisation." },
    { n:5, col:C.accent, authors:"Young, L.-S.", title:"What are SRB measures and which dynamical systems have them?", details:"J. Stat. Phys. 108, 733–754 (2002). Definitive survey of physical measures; highly recommended." },
    { n:6, col:C.accent, authors:"Hasselblatt, B. & Katok, A. (eds.)", title:"Handbook of Dynamical Systems, Vol. 1A & 1B", details:"Elsevier (2002). Encyclopedia-level reference; chapters on 1D maps, entropy, Lyapunov exponents." },
    { n:7, col:C.green, authors:"Lyubich, M.", title:"Forty years of unimodal dynamics", details:"J. Math. Sci. 170, 680–713 (2010). Personal survey of the field's development; highly readable." },
    { n:8, col:C.green, authors:"Viana, M. & Oliveira, K.", title:"Foundations of Ergodic Theory", details:"Cambridge University Press (2016). Modern graduate ergodic theory with dynamical applications." },
  ];
  phbooks.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}
