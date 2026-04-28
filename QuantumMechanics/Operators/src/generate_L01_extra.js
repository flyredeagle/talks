/**
 * generate_L01_extra.js
 *
 * Adds to L01 (The Hilbert Space of Quantum States):
 *   A) 20 tier-concept slides  (5 tiers × 4 learning objectives)
 *      — each with a programmatic diagram
 *   B) 3 special-topic slides with diagrams
 *      — Lebesgue Integration
 *      — Banach Spaces
 *      — Banach Duality (operators ↔ distributions)
 *
 * Output: /home/claude/L01_extra_slides.pptx
 * (merged into full L01 by the Python merge script)
 */

const pptxgen = require("pptxgenjs");

// ─────────────────────────────────────────────────────────────────────
// DESIGN CONSTANTS  (matching main deck)
// ─────────────────────────────────────────────────────────────────────
const C = {
  darkBg:      "0D1B2A",
  darkBg2:     "0A1422",
  panelBg:     "162236",
  white:       "FFFFFF",
  lightText:   "B0C4DE",
  mutedText:   "7B8FA6",
  darkText:    "0D1B2A",
  bodyText:    "1E2D3D",
  offWhite:    "F0F4F8",
  lightBg:     "FFFFFF",

  cyan:        "00B4D8",
  teal:        "00897B",
  gold:        "F4A261",
  green:       "2ECC71",
  purple:      "9B72CF",
  coral:       "E07B6A",
  midblue:     "1E5FA8",
  lightblue:   "DCE9FF",
  lightcyan:   "D0F4FB",
  lightgold:   "FFF3E0",
  lightgreen:  "DFF5E8",
  lightpurple: "EDE0FF",

  hs:    "F4C430",
  beg:   "4CAF7D",
  adv:   "5B9BD5",
  msc:   "9B72CF",
  phd:   "E07B6A",
};

const TIERS = [
  { code: "HS",    label: "High School",        color: C.hs,    textDark: true  },
  { code: "BegUG", label: "Beg. Undergraduate", color: C.beg,   textDark: true  },
  { code: "AdvUG", label: "Adv. Undergraduate", color: C.adv,   textDark: false },
  { code: "MSc",   label: "Master's",           color: C.msc,   textDark: false },
  { code: "PhD",   label: "PhD",                color: C.phd,   textDark: false },
];

const LOS = [
  { num: 1, short: "Hilbert Space Definition",  label: "LO1" },
  { num: 2, short: "Bounded vs Unbounded Ops",  label: "LO2" },
  { num: 3, short: "The Adjoint Operator Â†",   label: "LO3" },
  { num: 4, short: "Operator Classification",   label: "LO4" },
];

// ─────────────────────────────────────────────────────────────────────
// HELPER UTILITIES
// ─────────────────────────────────────────────────────────────────────
function header(slide, title, subtitle, tag, darkBg = true) {
  const bg = darkBg ? C.darkBg : C.lightBg;
  const hc = darkBg ? C.white : C.darkText;
  const sc = darkBg ? C.mutedText : "5B7A9D";

  slide.addText(title, {
    x: 0.3, y: 0.12, w: 9.0, h: 0.42,
    fontSize: 18, bold: true, color: hc, fontFace: "Cambria"
  });
  slide.addText(subtitle, {
    x: 0.3, y: 0.57, w: 8.5, h: 0.22,
    fontSize: 9.5, italic: true, color: sc, fontFace: "Calibri"
  });
  // Tag badge top-right
  const tc = darkBg ? "1E3A5F" : "E8F0F8";
  const tt = darkBg ? C.adv : "3A6EA5";
  slide.addShape("rect", { x: 9.38, y: 0.06, w: 0.57, h: 0.28, fill: { color: tc }, line: { color: tc } });
  slide.addText(tag, {
    x: 9.38, y: 0.06, w: 0.57, h: 0.28,
    fontSize: 8, bold: true, color: tt, fontFace: "Calibri", align: "center", valign: "middle"
  });
}

function footer(slide, left, right, darkBg = true) {
  const fc = darkBg ? "4A6080" : "9AAABB";
  slide.addText(left,  { x: 0.3, y: 5.35, w: 5, h: 0.22, fontSize: 8, color: fc, fontFace: "Calibri" });
  slide.addText(right, { x: 7.5, y: 5.35, w: 2.2, h: 0.22, fontSize: 8, color: fc, fontFace: "Calibri", align: "right" });
}

function tierBadge(slide, tier, x, y, w = 0.82, h = 0.28) {
  slide.addShape("roundRect", { x, y, w, h, fill: { color: tier.color }, line: { color: tier.color }, rectRadius: 0.05 });
  slide.addText(tier.code, {
    x, y, w, h, fontSize: 9.5, bold: true,
    color: tier.textDark ? C.darkText : C.white,
    fontFace: "Calibri", align: "center", valign: "middle"
  });
}

function darkPanel(slide, title, items, x, y, w, h, { titleColor = C.cyan } = {}) {
  slide.addShape("rect", { x, y, w, h, fill: { color: C.panelBg }, line: { color: "1E3A5F", width: 1.5 } });
  slide.addText(title, {
    x: x+0.12, y: y+0.09, w: w-0.2, h: 0.22,
    fontSize: 8.5, bold: true, color: titleColor, fontFace: "Calibri", charSpacing: 1
  });
  const rows = items.map((it, i) => ({
    text: it.replace(/^•\s*/, ""),
    options: { bullet: !it.startsWith("•") && !it.startsWith("─"),
               breakLine: i < items.length-1,
               color: it.startsWith("─") ? "6A8AAA" : C.lightText,
               fontSize: it.startsWith("─") ? 8 : 9,
               fontFace: "Calibri" }
  }));
  slide.addText(rows, { x: x+0.15, y: y+0.35, w: w-0.28, h: h-0.45, valign: "top" });
}

function lightPanel(slide, title, items, x, y, w, h, accentColor = C.cyan) {
  slide.addShape("rect", { x, y, w, h, fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 } });
  slide.addShape("rect", { x, y, w: 0.05, h, fill: { color: accentColor }, line: { color: accentColor } });
  slide.addText(title, {
    x: x+0.18, y: y+0.08, w: w-0.25, h: 0.23,
    fontSize: 9, bold: true, color: accentColor, fontFace: "Calibri", charSpacing: 1
  });
  const rows = items.map((it, i) => ({
    text: it.replace(/^•\s*/, ""),
    options: { bullet: !it.startsWith("•") && !it.startsWith("─"),
               breakLine: i < items.length-1,
               color: it.startsWith("─") ? "999999" : C.bodyText,
               fontSize: it.startsWith("─") ? 8 : 9,
               fontFace: "Calibri" }
  }));
  slide.addText(rows, { x: x+0.2, y: y+0.35, w: w-0.3, h: h-0.45, valign: "top" });
}

function formulaBox(slide, lines, x, y, w, h) {
  slide.addShape("rect", { x, y, w, h, fill: { color: "0A1628" }, line: { color: C.cyan, width: 1.5 } });
  const rows = lines.map((l, i) => ({
    text: l,
    options: { breakLine: i < lines.length-1, color: "C8E8F8", fontSize: 8.5, fontFace: "Courier New" }
  }));
  slide.addText(rows, { x: x+0.14, y: y+0.1, w: w-0.28, h: h-0.18, valign: "top" });
}

function diagramBox(slide, x, y, w, h, color = C.panelBg) {
  slide.addShape("rect", { x, y, w, h, fill: { color }, line: { color: "1E3A5F", width: 1 } });
}

function arrow(slide, x1, y1, x2, y2, color = C.cyan, width = 1.5) {
  slide.addShape("line", {
    x: x1, y: y1, w: x2-x1, h: y2-y1,
    line: { color, width, endArrowType: "triangle" }
  });
}

function label(slide, text, x, y, w, h, { color = C.lightText, size = 8, bold = false, align = "center", italic = false } = {}) {
  slide.addText(text, {
    x, y, w, h, fontSize: size, color, fontFace: "Calibri",
    align, valign: "middle", bold, italic
  });
}

// ─────────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
// DIAGRAM FUNCTIONS  (one per tier-LO combination)
// ══════════════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────

// ── LO1 DIAGRAMS: Hilbert Space Definition ───────────────────────────

function diag_LO1_HS(slide, x, y, w, h) {
  // Two arrows in 2D showing "overlap" = inner product
  diagramBox(slide, x, y, w, h);
  const cx = x + w/2, cy = y + h/2;

  // Axes
  slide.addShape("line", { x: cx-1.0, y: cy+0.5, w: 2.0, h: 0, line: { color: "3A5A7A", width: 1 } });
  slide.addShape("line", { x: cx-0.5, y: cy+1.0, w: 0, h: -2.0, line: { color: "3A5A7A", width: 1 } });

  // Vector |φ⟩ — blue
  arrow(slide, cx, cy+0.5, cx+0.8, cy-0.5, C.cyan, 2.5);
  label(slide, "|φ⟩", cx+0.82, cy-0.62, 0.4, 0.22, { color: C.cyan, size: 9, bold: true });

  // Vector |ψ⟩ — gold
  arrow(slide, cx, cy+0.5, cx-0.3, cy-0.8, C.gold, 2.5);
  label(slide, "|ψ⟩", cx-0.72, cy-0.92, 0.4, 0.22, { color: C.gold, size: 9, bold: true });

  // Angle arc
  slide.addShape("arc", {
    x: cx-0.22, y: cy+0.12, w: 0.44, h: 0.44,
    fill: { color: "1E4060", transparency: 40 },
    line: { color: C.green, width: 1 }
  });
  label(slide, "θ", cx-0.08, cy+0.1, 0.2, 0.2, { color: C.green, size: 8 });

  // Projection dashed line
  slide.addShape("line", { x: cx+0.8, y: cy-0.5, w: -0.8, h: -0.08,
    line: { color: "5A7A9A", width: 1, dashType: "dash" } });

  // Formula box
  slide.addShape("rect", { x: x+0.1, y: y+h-0.62, w: w-0.2, h: 0.52,
    fill: { color: "0A1628" }, line: { color: C.cyan, width: 1 } });
  slide.addText("⟨φ|ψ⟩ = ||φ|| ||ψ|| cos θ  ∈ ℂ", {
    x: x+0.14, y: y+h-0.59, w: w-0.28, h: 0.46,
    fontSize: 8, color: "C8E8F8", fontFace: "Courier New", align: "center", valign: "middle"
  });

  label(slide, "Inner Product = Overlap", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });
}

function diag_LO1_BegUG(slide, x, y, w, h) {
  // 4 axiom boxes in a 2×2 grid with connecting arrows
  diagramBox(slide, x, y, w, h);
  label(slide, "The 4 Inner Product Axioms", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const axioms = [
    { label: "IP1", text: "Conjugate\nSymmetry\n⟨φ|ψ⟩=⟨ψ|φ⟩*", color: C.cyan },
    { label: "IP2", text: "Linearity\nin 2nd slot\nα|ψ⟩+β|χ⟩", color: C.gold },
    { label: "IP3", text: "Positive\nSemidefinite\n⟨ψ|ψ⟩ ≥ 0", color: C.green },
    { label: "IP4", text: "Non-\nDegenerate\n⟨ψ|ψ⟩=0⟺0", color: C.coral },
  ];

  const bw = (w-0.35)/2, bh = (h-0.75)/2;
  const positions = [
    [x+0.1, y+0.32], [x+0.2+bw, y+0.32],
    [x+0.1, y+0.38+bh], [x+0.2+bw, y+0.38+bh]
  ];

  axioms.forEach((ax, i) => {
    const [bx, by] = positions[i];
    slide.addShape("roundRect", { x: bx, y: by, w: bw, h: bh, fill: { color: "0F2035" }, line: { color: ax.color, width: 1.5 }, rectRadius: 0.06 });
    slide.addText(ax.label, { x: bx+0.04, y: by+0.03, w: 0.4, h: 0.17, fontSize: 8, bold: true, color: ax.color, fontFace: "Calibri" });
    slide.addText(ax.text, { x: bx+0.06, y: by+0.2, w: bw-0.1, h: bh-0.24, fontSize: 7.5, color: C.lightText, fontFace: "Calibri", valign: "top" });
  });

  // COMPLETE label at bottom
  slide.addShape("rect", { x: x+0.3, y: y+h-0.3, w: w-0.6, h: 0.22, fill: { color: C.teal }, line: { color: C.teal } });
  label(slide, "+ COMPLETENESS  ⟹  Hilbert Space", x, y+h-0.31, w, 0.23, { color: C.white, size: 8, bold: true, align: "center" });
}

function diag_LO1_AdvUG(slide, x, y, w, h) {
  // Cauchy sequence converging — dots getting closer on a number line, then completeness
  diagramBox(slide, x, y, w, h);
  label(slide, "Completeness: No Missing Limits", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Two rows: complete (H) vs incomplete (ℚ)
  const cy1 = y + 0.75, cy2 = y + 2.55;

  // Row 1: complete Hilbert space
  label(slide, "Complete: ℋ", x+0.12, cy1-0.2, 1.1, 0.2, { color: C.green, size: 8, bold: true });
  const lineX1 = x+0.15, lineX2 = x+w-0.2;
  slide.addShape("line", { x: lineX1, y: cy1, w: lineX2-lineX1, h: 0, line: { color: "2A5A7A", width: 1.5 } });

  // Convergent Cauchy dots
  const dotXs = [0.18, 0.38, 0.52, 0.62, 0.68, 0.72, 0.75];
  dotXs.forEach((dx, i) => {
    const alpha = Math.min(40 + i*10, 100);
    slide.addShape("ellipse", {
      x: x+dx*(w-0.3), y: cy1-0.07, w: 0.14, h: 0.14,
      fill: { color: C.cyan }, line: { color: C.cyan }
    });
  });
  // Limit point (green star/circle)
  slide.addShape("ellipse", { x: x+w-0.28, y: cy1-0.1, w: 0.18, h: 0.18, fill: { color: C.green }, line: { color: C.green } });
  label(slide, "limit ∈ ℋ ✓", x+w-0.55, cy1-0.3, 0.5, 0.2, { color: C.green, size: 7.5 });

  // Cauchy criterion label
  slide.addShape("rect", { x: x+0.12, y: cy1+0.12, w: w-0.25, h: 0.3,
    fill: { color: "0A1628" }, line: { color: C.teal, width: 1 } });
  label(slide, "‖|ψₙ⟩ − |ψₘ⟩‖ → 0  ⟹  limit ∈ ℋ", x+0.12, cy1+0.12, w-0.25, 0.3, { color: "C8E8F8", size: 7.5 });

  // Divider
  slide.addShape("line", { x: x+0.1, y: cy1+0.52, w: w-0.2, h: 0, line: { color: "2A4A6A", width: 0.75, dashType: "dash" } });

  // Row 2: incomplete space
  label(slide, "Incomplete: C([0,1]) with L² norm", x+0.12, cy2-0.22, w-0.2, 0.2, { color: C.coral, size: 8, bold: true });
  slide.addShape("line", { x: lineX1, y: cy2, w: lineX2-lineX1, h: 0, line: { color: "2A5A7A", width: 1.5 } });

  // Dots converging but limit OUTSIDE
  dotXs.slice(0,6).forEach((dx) => {
    slide.addShape("ellipse", {
      x: x+dx*(w-0.3), y: cy2-0.07, w: 0.14, h: 0.14,
      fill: { color: C.gold }, line: { color: C.gold }
    });
  });
  // Gap + outside marker
  slide.addShape("line", { x: x+w-0.3, y: cy2-0.15, w: 0, h: 0.3, line: { color: C.coral, width: 2 } });
  slide.addShape("ellipse", { x: x+w-0.22, y: cy2-0.1, w: 0.18, h: 0.18,
    fill: { color: C.coral, transparency: 30 }, line: { color: C.coral, dashType: "dash", width: 1.5 } });
  label(slide, "limit ∉ space ✗", x+w-0.52, cy2-0.3, 0.5, 0.2, { color: C.coral, size: 7.5 });

  label(slide, "Sequence of polynomials → non-polynomial (not in space!)", x+0.12, cy2+0.12, w-0.25, 0.35, { color: C.mutedText, size: 7.5, align: "left" });
}

function diag_LO1_MSc(slide, x, y, w, h) {
  // L²(ℝ) function space diagram: wave function, integral area, norm
  diagramBox(slide, x, y, w, h);
  label(slide, "L²(ℝ) as a Hilbert Space", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Axes for function plot
  const ax0 = x+0.25, ay0 = y+2.0, axw = w-0.4, axh = 1.3;
  arrow(slide, ax0, ay0, ax0+axw, ay0, "4A7A9A", 1.2);
  arrow(slide, ax0, ay0, ax0, ay0-axh, "4A7A9A", 1.2);
  label(slide, "x", ax0+axw+0.04, ay0-0.08, 0.18, 0.18, { color: "4A7A9A", size: 8 });
  label(slide, "ψ(x)", ax0-0.22, ay0-axh-0.04, 0.35, 0.18, { color: "4A7A9A", size: 8 });

  // Gaussian curve using line segments
  const N = 20;
  const pts = [];
  for (let i = 0; i <= N; i++) {
    const t = (i/N);
    const xi = ax0 + t*axw*0.95 + 0.02;
    const xv = (t - 0.5) * 6;
    const yi = ay0 - axh * 0.85 * Math.exp(-xv*xv/4);
    pts.push([xi, yi]);
  }
  for (let i = 0; i < pts.length-1; i++) {
    slide.addShape("line", {
      x: pts[i][0], y: pts[i][1], w: pts[i+1][0]-pts[i][0], h: pts[i+1][1]-pts[i][1],
      line: { color: C.cyan, width: 2 }
    });
  }

  // Fill under curve (approximate with thin rect strips)
  const midX = ax0 + axw*0.5;
  const fillW = axw * 0.55;
  slide.addShape("rect", {
    x: midX-fillW/2, y: ay0-axh*0.72, w: fillW, h: axh*0.72,
    fill: { color: C.cyan, transparency: 80 }, line: { color: C.cyan, transparency: 80, width: 0 }
  });

  label(slide, "∫|ψ(x)|²dx", midX-0.28, ay0-axh*0.42, 0.56, 0.2, { color: C.gold, size: 8, bold: true });

  // Properties list
  const props = [
    "• ψ ∈ L²(ℝ): square-integrable",
    "• ⟨φ|ψ⟩ = ∫φ*(x)ψ(x)dx",
    "• ‖ψ‖² = ∫|ψ(x)|²dx < ∞",
    "• Complete: Riesz–Fischer theorem",
  ];
  props.forEach((prop, i) => {
    label(slide, prop, x+0.1, y+h-1.1+i*0.22, w-0.18, 0.22, { color: i===3 ? C.green : C.lightText, size: 8, align: "left" });
  });
}

function diag_LO1_PhD(slide, x, y, w, h) {
  // Nested hierarchy: metric → normed → Banach → Hilbert with labels
  diagramBox(slide, x, y, w, h);
  label(slide, "Mathematical Hierarchy of Spaces", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const cx = x+w/2, cy = y+h*0.48;
  const rings = [
    { rx: w*0.46, ry: h*0.38, color: "2A4A6A", label: "Metric Space\n(d(x,y))", lpos: [cx-w*0.4, cy-h*0.32] },
    { rx: w*0.36, ry: h*0.29, color: "1A5A7A", label: "Normed Space\n(‖x‖)", lpos: [cx+w*0.16, cy-h*0.24] },
    { rx: w*0.26, ry: h*0.21, color: "0A7A9A", label: "Banach Space\n(complete norm)", lpos: [cx-w*0.38, cy+h*0.14] },
    { rx: w*0.16, ry: h*0.13, color: C.cyan,   label: "Hilbert Space\n⟨·|·⟩", lpos: [cx-0.2, cy-h*0.06] },
  ];

  rings.forEach(r => {
    slide.addShape("ellipse", {
      x: cx-r.rx, y: cy-r.ry, w: r.rx*2, h: r.ry*2,
      fill: { color: r.color, transparency: 70 },
      line: { color: r.color, width: 1.5 }
    });
  });

  // Labels with lines to rings
  const ringLabels = [
    { text: "Metric\nSpace", x: cx-w*0.44, y: cy-h*0.38, color: "5A8AAA" },
    { text: "Normed\nSpace",  x: cx+w*0.22, y: cy-h*0.3,  color: "5AAAAA" },
    { text: "Banach\nSpace",  x: cx-w*0.44, y: cy+h*0.18, color: C.teal   },
    { text: "Hilbert\nSpace", x: cx-0.22,   y: cy-h*0.08, color: C.cyan   },
  ];
  ringLabels.forEach(rl => {
    slide.addText(rl.text, { x: rl.x, y: rl.y, w: 0.65, h: 0.32,
      fontSize: 7.5, bold: true, color: rl.color, fontFace: "Calibri", align: "center", valign: "middle" });
  });

  // Extra label: + inner product
  label(slide, "+ complete inner product ⟨·|·⟩", cx-w*0.35, y+h-0.35, w*0.7, 0.22, { color: C.gold, size: 8 });
  // completeness arrow
  label(slide, "each ⊂ previous + extra structure", x+0.08, y+h-0.58, w-0.16, 0.2, { color: C.mutedText, size: 7.5, italic: true });
}

// ── LO2 DIAGRAMS: Bounded vs Unbounded Operators ─────────────────────

function diag_LO2_HS(slide, x, y, w, h) {
  // Simple "ball stays inside box" vs "ball grows without bound"
  diagramBox(slide, x, y, w, h);
  label(slide, "Bounded vs. Unbounded", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const half = w/2;

  // LEFT: bounded
  label(slide, "BOUNDED", x+0.12, y+0.32, half-0.2, 0.2, { color: C.green, size: 8, bold: true });
  slide.addShape("rect", { x: x+0.12, y: y+0.55, w: half-0.22, h: h-1.15,
    fill: { color: "0F2035" }, line: { color: C.green, width: 1.5 } });
  // Multiple small arrows (inputs)
  [[0.3, 0.3],[0.3, 0.5],[0.3, 0.7]].forEach(([ax, ay]) => {
    arrow(slide, x+0.18, y+0.55+ay*h*0.5, x+0.3+ax*half, y+0.55+ay*h*0.5, C.cyan, 1.2);
  });
  // Box label
  label(slide, "Â", x+half/2-0.05, y+h/2+0.12, 0.3, 0.3, { color: C.green, size: 14, bold: true });
  label(slide, "‖Â‖ < ∞", x+0.12, y+h-0.45, half-0.22, 0.2, { color: C.green, size: 8 });

  // RIGHT: unbounded
  label(slide, "UNBOUNDED", x+half+0.08, y+0.32, half-0.15, 0.2, { color: C.coral, size: 8, bold: true });
  // Growing arrows
  [[0.15, 0.2],[0.28, 0.45],[0.55, 0.7]].forEach(([alen, ay]) => {
    arrow(slide, x+half+0.15, y+0.55+ay*h*0.5, x+half+0.15+alen*(w-half-0.2)*1.8, y+0.55+ay*h*0.5, C.coral, 1.2);
  });
  label(slide, "x̂, p̂ on L²(ℝ)", x+half+0.08, y+h-0.45, half-0.15, 0.2, { color: C.coral, size: 8 });

  // Divider
  slide.addShape("line", { x: x+half, y: y+0.28, w: 0, h: h-0.4, line: { color: "2A4A6A", width: 1 } });
}

function diag_LO2_BegUG(slide, x, y, w, h) {
  // Operator norm definition diagram with sup over unit ball
  diagramBox(slide, x, y, w, h);
  label(slide, "The Operator Norm ‖Â‖", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Unit sphere
  const cx = x+w*0.35, cy = y+h*0.48, r = 0.55;
  slide.addShape("ellipse", { x: cx-r, y: cy-r*0.7, w: r*2, h: r*1.4,
    fill: { color: "1A3A5A", transparency: 40 }, line: { color: C.adv, width: 1.5 } });
  label(slide, "Unit ball\n{|ψ⟩: ‖|ψ⟩‖=1}", cx-r, cy-r*0.7-0.22, r*2, 0.28, { color: C.adv, size: 7.5, align: "center" });

  // Arrow from ball → image
  arrow(slide, cx+r, cy, cx+r+0.55, cy, C.gold, 2);
  label(slide, "Â", cx+r+0.2, cy-0.2, 0.25, 0.2, { color: C.gold, size: 10, bold: true });

  // Image ellipse (stretched)
  const ix = cx+r+0.62;
  slide.addShape("ellipse", { x: ix, y: cy-r*1.1, w: r*1.0, h: r*2.2,
    fill: { color: "1A3520", transparency: 50 }, line: { color: C.green, width: 1.5 } });
  label(slide, "Image\nÂ(unit ball)", ix, cy-r*1.1-0.22, r*1.0, 0.28, { color: C.green, size: 7.5, align: "center" });

  // Max radius arrow
  const ir = r*1.1;
  slide.addShape("line", { x: ix+r*0.5, y: cy, w: 0, h: -ir,
    line: { color: C.gold, width: 1.5, dashType: "dash" } });
  label(slide, "‖Â‖ = max\nstretching", ix+r*0.52, cy-ir-0.24, 0.65, 0.28, { color: C.gold, size: 7.5 });

  // Formula
  slide.addShape("rect", { x: x+0.08, y: y+h-0.5, w: w-0.16, h: 0.4,
    fill: { color: "0A1628" }, line: { color: C.cyan, width: 1 } });
  label(slide, "‖Â‖ := sup{ ‖Â|ψ⟩‖ : ‖|ψ⟩‖ = 1 }", x+0.1, y+h-0.5, w-0.2, 0.4, { color: "C8E8F8", size: 8 });
}

function diag_LO2_AdvUG(slide, x, y, w, h) {
  // Bounded ⟺ Continuous proof diagram
  diagramBox(slide, x, y, w, h);
  label(slide, "Bounded  ⟺  Continuous", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Two boxes with double arrow between
  const bw = w*0.38, bh = h*0.28, by1 = y+0.35, by2 = y+h-bh-0.35;
  const bx1 = x+0.12, bx2 = x+w-bw-0.12;

  // Bounded box
  slide.addShape("roundRect", { x: bx1, y: by1, w: bw, h: bh,
    fill: { color: "0A2540" }, line: { color: C.cyan, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "BOUNDED\n‖Â|ψ⟩‖ ≤ M‖|ψ⟩‖\nfor all |ψ⟩ ∈ ℋ", bx1, by1, bw, bh, { color: C.cyan, size: 8 });

  // Continuous box
  slide.addShape("roundRect", { x: bx2, y: by1, w: bw, h: bh,
    fill: { color: "0A2530" }, line: { color: C.green, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "CONTINUOUS\n|ψₙ⟩→|ψ⟩ ⟹\nÂ|ψₙ⟩→Â|ψ⟩", bx2, by1, bw, bh, { color: C.green, size: 8 });

  // Double arrow between
  const arrY = by1 + bh/2;
  arrow(slide, bx1+bw+0.04, arrY, bx2-0.04, arrY, C.gold, 1.5);
  arrow(slide, bx2-0.04, arrY+0.04, bx1+bw+0.04, arrY+0.04, C.gold, 1.5);
  label(slide, "⟺", bx1+bw+0.04, arrY-0.16, bx2-bx1-bw-0.08, 0.2, { color: C.gold, size: 11, bold: true });

  // Proof sketch boxes
  slide.addShape("roundRect", { x: bx1, y: by2, w: bw, h: bh,
    fill: { color: "0A1520" }, line: { color: "3A6A9A", width: 1 }, rectRadius: 0.04 });
  label(slide, "⟹ proof:\nε-δ argument\n‖Â(|ψ⟩-|φ⟩)‖≤M‖|ψ⟩-|φ⟩‖", bx1, by2, bw, bh, { color: "7ABADB", size: 7.5 });

  slide.addShape("roundRect", { x: bx2, y: by2, w: bw, h: bh,
    fill: { color: "0A1520" }, line: { color: "3A6A9A", width: 1 }, rectRadius: 0.04 });
  label(slide, "⟸ proof:\nContradiction via\nunbounded sequence", bx2, by2, bw, bh, { color: "7ABADB", size: 7.5 });
}

function diag_LO2_MSc(slide, x, y, w, h) {
  // x̂ on L²([-N,N]): operator norm = N, graph vs N
  diagramBox(slide, x, y, w, h);
  label(slide, "‖x̂‖ on L²([−N,N]) = N", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Graph of ‖x̂‖ vs N
  const ax0 = x+0.3, ay0 = y+h-0.55, axw = w-0.45, axh = h-0.9;
  arrow(slide, ax0, ay0, ax0+axw, ay0, "4A7A9A", 1.2);
  arrow(slide, ax0, ay0, ax0, ay0-axh, "4A7A9A", 1.2);
  label(slide, "N", ax0+axw+0.04, ay0-0.08, 0.15, 0.18, { color: "6AAABB", size: 8 });
  label(slide, "‖x̂‖", ax0-0.3, ay0-axh-0.04, 0.3, 0.18, { color: "6AAABB", size: 8 });

  // Linear line ‖x̂‖ = N
  slide.addShape("line", { x: ax0, y: ay0, w: axw*0.88, h: -axh*0.88, line: { color: C.coral, width: 2 } });

  // Dashed line to ∞
  slide.addShape("line", { x: ax0+axw*0.88, y: ay0-axh*0.88, w: axw*0.1, h: -axh*0.1,
    line: { color: C.coral, width: 2, dashType: "dash" } });
  label(slide, "→ ∞ as N→∞\n(unbounded on L²(ℝ)!)", ax0+axw*0.5, ay0-axh*0.75, 1.1, 0.35, { color: C.coral, size: 7.5 });

  // N-axis ticks
  [1,2,3,4].forEach(n => {
    const tx = ax0 + n*axw/5;
    slide.addShape("line", { x: tx, y: ay0-0.04, w: 0, h: 0.08, line: { color: "4A7A9A", width: 1 } });
    label(slide, `${n}`, tx-0.08, ay0+0.04, 0.16, 0.16, { color: "6AAABB", size: 7 });
  });

  // Norm-axis ticks
  [1,2,3,4].forEach(n => {
    const ty = ay0 - n*axh/5;
    slide.addShape("line", { x: ax0-0.04, y: ty, w: 0.08, h: 0, line: { color: "4A7A9A", width: 1 } });
    label(slide, `${n}`, ax0-0.2, ty-0.08, 0.16, 0.16, { color: "6AAABB", size: 7 });
  });

  label(slide, "Key: finite interval → bounded; ℝ → unbounded", x+0.1, y+h-0.35, w-0.2, 0.25, { color: C.gold, size: 7.5, italic: true });
}

function diag_LO2_PhD(slide, x, y, w, h) {
  // Spectrum types: point / continuous / residual
  diagramBox(slide, x, y, w, h);
  label(slide, "Spectrum of Unbounded Operators", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Complex plane
  const cx = x+w/2, cy = y+h*0.44, pr = h*0.28;
  slide.addShape("ellipse", { x: cx-pr, y: cy-pr*0.8, w: pr*2, h: pr*1.6,
    fill: { color: "0A1628", transparency: 20 }, line: { color: "2A5A7A", width: 1 } });
  arrow(slide, cx-pr-0.12, cy, cx+pr+0.12, cy, "3A6A8A", 1.2);
  arrow(slide, cx, cy+pr*0.85, cx, cy-pr*0.85-0.12, "3A6A8A", 1.2);
  label(slide, "Re", cx+pr+0.14, cy-0.1, 0.25, 0.2, { color: "5A8AAA", size: 8 });
  label(slide, "Im", cx-0.12, cy-pr*0.85-0.22, 0.22, 0.18, { color: "5A8AAA", size: 8 });

  // Point spectrum (dots on real axis — Hermitian)
  [-0.4, -0.15, 0.2, 0.52].forEach(dx => {
    slide.addShape("ellipse", { x: cx+dx*pr*1.8-0.05, y: cy-0.05, w: 0.1, h: 0.1, fill: { color: C.cyan }, line: { color: C.cyan } });
  });

  // Continuous spectrum (line segment)
  slide.addShape("line", { x: cx-pr*0.8, y: cy+pr*0.3, w: pr*1.6, h: 0, line: { color: C.gold, width: 2 } });

  // Legend
  const ly = y+h-0.72;
  slide.addShape("ellipse", { x: x+0.2, y: ly+0.05, w: 0.12, h: 0.12, fill: { color: C.cyan }, line: { color: C.cyan } });
  label(slide, "σₚ(A): point spectrum (eigenvalues)", x+0.36, ly, w-0.44, 0.22, { color: C.cyan, size: 7.5, align: "left" });

  slide.addShape("line", { x: x+0.2, y: ly+0.35, w: 0.3, h: 0, line: { color: C.gold, width: 2 } });
  label(slide, "σ_c(A): continuous spectrum (x̂, p̂)", x+0.56, ly+0.25, w-0.64, 0.22, { color: C.gold, size: 7.5, align: "left" });

  slide.addShape("line", { x: x+0.2, y: ly+0.57, w: 0.3, h: 0, line: { color: C.coral, width: 2, dashType: "dash" } });
  label(slide, "σ_r(A): residual spectrum (rare)", x+0.56, ly+0.48, w-0.64, 0.22, { color: C.coral, size: 7.5, align: "left" });
}

// ── LO3 DIAGRAMS: The Adjoint Operator Â† ────────────────────────────

function diag_LO3_HS(slide, x, y, w, h) {
  // Step-by-step conjugate transpose with arrows on a 2×2 matrix
  diagramBox(slide, x, y, w, h);
  label(slide, "Computing the Adjoint A†", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const mx = x+0.2, my = y+0.35;
  const mw = 0.9, mh = 0.7;

  // Original matrix A
  label(slide, "A =", mx, my+0.2, 0.35, 0.3, { color: C.lightText, size: 10, bold: true });
  slide.addShape("line", { x: mx+0.38, y: my, w: 0, h: mh, line: { color: C.lightText, width: 1.5 } });
  slide.addShape("line", { x: mx+0.38+mw, y: my, w: 0, h: mh, line: { color: C.lightText, width: 1.5 } });
  label(slide, "a  b\nc  d", mx+0.44, my+0.05, mw-0.08, mh-0.08, { color: C.cyan, size: 10 });

  // Step 1 arrow: transpose
  const step1X = mx+mw+0.5;
  arrow(slide, mx+mw+0.42, my+mh/2, step1X+0.5, my+mh/2, C.gold, 1.5);
  label(slide, "① Transpose\n(swap rows↔cols)", step1X+0.52, my, 0.95, mh, { color: C.gold, size: 7.5 });

  // Transposed matrix
  const m2x = step1X+1.52;
  slide.addShape("line", { x: m2x, y: my, w: 0, h: mh, line: { color: C.lightText, width: 1.5 } });
  slide.addShape("line", { x: m2x+mw, y: my, w: 0, h: mh, line: { color: C.lightText, width: 1.5 } });
  label(slide, "a  c\nb  d", m2x+0.06, my+0.05, mw-0.08, mh-0.08, { color: C.gold, size: 10 });

  // Row 2: conjugate
  const r2y = my+mh+0.35;
  arrow(slide, m2x+mw/2, r2y-0.08, m2x+mw/2, r2y+0.08, C.green, 1.5);
  label(slide, "② Complex Conjugate (z → z*)", mx+0.36, r2y-0.08, w-0.5, 0.2, { color: C.green, size: 7.5 });

  // Final A†
  label(slide, "A† =", mx, r2y+0.14, 0.45, 0.32, { color: C.lightText, size: 10, bold: true });
  slide.addShape("line", { x: mx+0.48, y: r2y+0.1, w: 0, h: mh, line: { color: C.cyan, width: 2 } });
  slide.addShape("line", { x: mx+0.48+mw, y: r2y+0.1, w: 0, h: mh, line: { color: C.cyan, width: 2 } });
  label(slide, "a*  c*\nb*  d*", mx+0.54, r2y+0.15, mw-0.08, mh-0.08, { color: C.green, size: 10 });

  // Rule box
  slide.addShape("rect", { x: m2x-0.04, y: r2y+0.12, w: w-(m2x-x)+0.02, h: 0.58,
    fill: { color: "0A1628" }, line: { color: C.cyan, width: 1 } });
  label(slide, "(A†)ᵢⱼ = (A)ⱼᵢ*\n(conjugate transpose)", m2x, r2y+0.14, w-(m2x-x)-0.04, 0.54, { color: "C8E8F8", size: 8 });
}

function diag_LO3_BegUG(slide, x, y, w, h) {
  // Inner product equality diagram: ⟨φ|Aψ⟩ = ⟨A†φ|ψ⟩
  diagramBox(slide, x, y, w, h);
  label(slide, "Adjoint via Inner Product", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const cy1 = y+0.75, cy2 = y+h-1.05;
  const bw = (w-0.35)/2;

  // Left box: ⟨φ|Aψ⟩
  slide.addShape("roundRect", { x: x+0.1, y: cy1, w: bw, h: 0.65,
    fill: { color: "0A2040" }, line: { color: C.cyan, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "⟨φ | Â | ψ⟩", x+0.1, cy1, bw, 0.65, { color: C.cyan, size: 11, bold: true });

  // = sign
  label(slide, "=", x+0.12+bw, cy1+0.15, 0.2, 0.35, { color: C.white, size: 14, bold: true });

  // Right box: ⟨A†φ|ψ⟩
  slide.addShape("roundRect", { x: x+0.15+bw+0.2, y: cy1, w: bw, h: 0.65,
    fill: { color: "0A4020" }, line: { color: C.green, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "⟨Â†φ | ψ⟩", x+0.15+bw+0.2, cy1, bw, 0.65, { color: C.green, size: 11, bold: true });

  // Arrows showing what A acts on
  arrow(slide, x+0.3+bw*0.6, cy1+0.65, x+0.3+bw*0.6, cy1+0.95, C.cyan, 1.2);
  label(slide, "Â acts on |ψ⟩\n(right side)", x+0.1+bw*0.3, cy1+0.66, bw*0.8, 0.35, { color: C.cyan, size: 7.5 });

  arrow(slide, x+0.28+bw+0.2+bw*0.3, cy1+0.65, x+0.28+bw+0.2+bw*0.3, cy1+0.95, C.green, 1.2);
  label(slide, "Â† acts on ⟨φ|\n(left side)", x+0.15+bw+0.2, cy1+0.66, bw, 0.35, { color: C.green, size: 7.5 });

  // Matrix example
  slide.addShape("rect", { x: x+0.1, y: cy2, w: w-0.2, h: 0.85,
    fill: { color: "0A1628" }, line: { color: C.gold, width: 1 } });
  label(slide, "Example: A = σ₊ = [[0,1],[0,0]]", x+0.14, cy2+0.04, w-0.28, 0.22, { color: C.gold, size: 8, bold: true, align: "left" });
  label(slide, "A† = [[0,0],[1,0]] = σ₋  (lowering operator)", x+0.14, cy2+0.26, w-0.28, 0.2, { color: C.lightText, size: 8, align: "left" });
  label(slide, "Check: ⟨φ|σ₊ψ⟩ = ⟨σ₋φ|ψ⟩  ✓", x+0.14, cy2+0.48, w-0.28, 0.2, { color: C.green, size: 8, align: "left" });
  label(slide, "∴ (σ₊)† = σ₋", x+0.14, cy2+0.65, w-0.28, 0.18, { color: C.lightText, size: 8, italic: true, align: "left" });
}

function diag_LO3_AdvUG(slide, x, y, w, h) {
  // Proof diagram: uniqueness of adjoint + reversal property
  diagramBox(slide, x, y, w, h);
  label(slide, "Key Adjoint Properties", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const props = [
    { prop: "(A†)† = A", proof: "Apply definition twice:\n⟨φ|(A†)†ψ⟩ = ⟨A†φ|ψ⟩* ... = ⟨Aφ|ψ⟩\n⟹ (A†)† = A  □", color: C.cyan },
    { prop: "(AB)† = B†A†", proof: "⟨φ|(AB)ψ⟩ = ⟨A†φ|Bψ⟩ = ⟨B†A†φ|ψ⟩\nOrder reverses!  □", color: C.gold },
    { prop: "‖A‖ = ‖A†‖", proof: "Follows from ‖A‖² = ‖A†A‖\nand ‖A†A‖ = ‖AA†‖ for bounded A", color: C.green },
  ];

  props.forEach((p, i) => {
    const by = y+0.35+i*1.38;
    slide.addShape("roundRect", { x: x+0.12, y: by, w: w-0.24, h: 1.25,
      fill: { color: "0A1525" }, line: { color: p.color, width: 1.5 }, rectRadius: 0.06 });
    label(slide, p.prop, x+0.18, by+0.06, 1.4, 0.28, { color: p.color, size: 11, bold: true });
    label(slide, p.proof, x+0.18, by+0.36, w-0.38, 0.8, { color: C.lightText, size: 8, align: "left", italic: false });
  });
}

function diag_LO3_MSc(slide, x, y, w, h) {
  // Dual space pairing and Riesz representation
  diagramBox(slide, x, y, w, h);
  label(slide, "Riesz Representation and the Adjoint", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const bh = 0.5, bw = (w-0.35)/2;
  const row1y = y+0.36, row2y = y+1.2, row3y = y+2.1;

  // H box
  slide.addShape("roundRect", { x: x+0.12, y: row1y, w: bw, h: bh,
    fill: { color: "0A2040" }, line: { color: C.cyan, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "ℋ  (ket space)\n|φ⟩, |ψ⟩ ∈ ℋ", x+0.12, row1y, bw, bh, { color: C.cyan, size: 9 });

  // H* dual
  slide.addShape("roundRect", { x: x+w-bw-0.12, y: row1y, w: bw, h: bh,
    fill: { color: "0A4020" }, line: { color: C.green, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "ℋ* (bra space)\n⟨φ|, ⟨ψ| ∈ ℋ*", x+w-bw-0.12, row1y, bw, bh, { color: C.green, size: 9 });

  // Riesz arrow
  const midY = row1y+bh/2;
  arrow(slide, x+0.12+bw+0.04, midY, x+w-bw-0.14, midY, C.gold, 1.5);
  arrow(slide, x+w-bw-0.14, midY+0.08, x+0.12+bw+0.04, midY+0.08, C.gold, 1.5);
  label(slide, "Riesz: |φ⟩ ↔ ⟨φ|", x+0.12+bw+0.04, midY-0.22, w-2*bw-0.24, 0.2, { color: C.gold, size: 8 });

  // A: H→H box
  slide.addShape("roundRect", { x: x+0.12, y: row2y, w: bw, h: bh,
    fill: { color: "1A2A40" }, line: { color: C.adv, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "Â: ℋ → ℋ\n|ψ⟩ ↦ Â|ψ⟩", x+0.12, row2y, bw, bh, { color: C.adv, size: 9 });

  // A†: H→H box
  slide.addShape("roundRect", { x: x+w-bw-0.12, y: row2y, w: bw, h: bh,
    fill: { color: "1A4030" }, line: { color: C.teal, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "Â†: ℋ → ℋ\n⟨φ| ↦ ⟨φ|Â", x+w-bw-0.12, row2y, bw, bh, { color: C.teal, size: 9 });

  // Adjoint arrow
  const mid2Y = row2y+bh/2;
  arrow(slide, x+0.12+bw+0.04, mid2Y, x+w-bw-0.14, mid2Y, C.purple, 1.5);
  label(slide, "adjoint", x+0.12+bw+0.04, mid2Y-0.2, w-2*bw-0.24, 0.2, { color: C.purple, size: 8 });

  // Riesz theorem statement
  slide.addShape("rect", { x: x+0.12, y: row3y, w: w-0.24, h: 0.72,
    fill: { color: "0A1628" }, line: { color: C.cyan, width: 1 } });
  label(slide, "Riesz Theorem: For every f ∈ ℋ*, ∃! |φ⟩ ∈ ℋ\nsuch that f(|ψ⟩) = ⟨φ|ψ⟩ for all |ψ⟩\nThis makes ℋ ≅ ℋ* (self-dual)", x+0.16, row3y+0.05, w-0.32, 0.62, { color: "C8E8F8", size: 8, align: "left" });
}

function diag_LO3_PhD(slide, x, y, w, h) {
  // Domain of adjoint for unbounded operators
  diagramBox(slide, x, y, w, h);
  label(slide, "Domain Issues for Unbounded Adjoints", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const bh = 0.52;
  // D(A) box (smaller)
  const da_w = w*0.32, da_x = x+0.18, da_y = y+0.38;
  slide.addShape("roundRect", { x: da_x, y: da_y, w: da_w, h: bh,
    fill: { color: "1A3050" }, line: { color: C.cyan, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "D(Â) ⊊ ℋ\ndense subset", da_x, da_y, da_w, bh, { color: C.cyan, size: 9 });

  // D(A†) box (could be bigger or smaller)
  const dat_w = w*0.38, dat_x = x+w-dat_w-0.15, dat_y = y+0.38;
  slide.addShape("roundRect", { x: dat_x, y: dat_y, w: dat_w, h: bh,
    fill: { color: "1A4030" }, line: { color: C.green, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "D(Â†) ⊇ D(Â) ?\nNot always!", dat_x, dat_y, dat_w, bh, { color: C.green, size: 9 });

  arrow(slide, da_x+da_w+0.04, da_y+bh/2, dat_x-0.04, dat_y+bh/2, C.gold, 1.5);
  label(slide, "compare\ndomains", da_x+da_w+0.04, da_y, dat_x-da_x-da_w-0.04, bh, { color: C.gold, size: 8 });

  // Three cases
  const cases = [
    { label: "Symmetric:", body: "D(Â) ⊂ D(Â†) and Â†|_{D(A)} = Â\n(but Â† ≠ Â — domains differ!)", color: C.gold, y: y+1.05 },
    { label: "Self-adjoint:", body: "D(Â†) = D(Â) and Â† = Â\n(observables require this!)", color: C.green, y: y+1.75 },
    { label: "Essentially self-adj.:", body: "Â has a unique s.a. extension = Â̄†", color: C.purple, y: y+2.45 },
  ];

  cases.forEach(c => {
    slide.addShape("roundRect", { x: x+0.12, y: c.y, w: w-0.24, h: 0.62,
      fill: { color: "0A1525" }, line: { color: c.color, width: 1.2 }, rectRadius: 0.04 });
    label(slide, c.label, x+0.18, c.y+0.04, 1.5, 0.22, { color: c.color, size: 8.5, bold: true, align: "left" });
    label(slide, c.body, x+0.18, c.y+0.27, w-0.38, 0.3, { color: C.lightText, size: 8, align: "left" });
  });
}

// ── LO4 DIAGRAMS: Operator Classification ────────────────────────────

function diag_LO4_HS(slide, x, y, w, h) {
  // Number line: real eigenvalues for Hermitian, imaginary for anti-Hermitian
  diagramBox(slide, x, y, w, h);
  label(slide, "Where Do Eigenvalues Live?", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const cx = x+w/2, cy = y+h*0.45;
  // Axes
  arrow(slide, cx-1.3, cy, cx+1.3, cy, "4A7A9A", 1.5);
  arrow(slide, cx, cy+1.1, cx, cy-1.1, "4A7A9A", 1.5);
  label(slide, "Re(λ)", cx+1.32, cy-0.1, 0.5, 0.2, { color: "6AAABB", size: 8 });
  label(slide, "Im(λ)", cx-0.15, cy-1.2, 0.38, 0.18, { color: "6AAABB", size: 8 });

  // Hermitian: real line dots
  [-0.8, -0.3, 0.2, 0.7, 1.1].forEach(dx => {
    slide.addShape("ellipse", { x: cx+dx-0.07, y: cy-0.07, w: 0.14, h: 0.14,
      fill: { color: C.cyan }, line: { color: C.cyan } });
  });
  label(slide, "Hermitian\nA = A†\neigenvalues ∈ ℝ", cx-1.28, cy+0.15, 1.0, 0.5, { color: C.cyan, size: 8 });

  // Anti-Hermitian: imaginary axis dots
  [-0.7, -0.25, 0.35, 0.75].forEach(dy => {
    slide.addShape("ellipse", { x: cx-0.07, y: cy+dy-0.07, w: 0.14, h: 0.14,
      fill: { color: C.coral }, line: { color: C.coral } });
  });
  label(slide, "Anti-Hermitian\nA = −A†\neigenvalues ∈ iℝ", cx+0.15, cy-0.85, 1.15, 0.5, { color: C.coral, size: 8 });

  // Unit circle for unitary
  slide.addShape("ellipse", { x: cx-0.55, y: cy-0.55, w: 1.1, h: 1.1,
    fill: { color: "0D1B2A", transparency: 100 }, line: { color: C.gold, width: 1.5, dashType: "dash" } });
  label(slide, "Unitary |λ|=1", cx+0.44, cy-0.78, 0.85, 0.2, { color: C.gold, size: 7.5, italic: true });
}

function diag_LO4_BegUG(slide, x, y, w, h) {
  // Decision tree: is A = A†? is A = -A†?
  diagramBox(slide, x, y, w, h);
  label(slide, "Classification Decision Tree", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Root question
  const qw = w*0.55, qh = 0.4, qx = x+(w-qw)/2, qy = y+0.32;
  slide.addShape("roundRect", { x: qx, y: qy, w: qw, h: qh,
    fill: { color: "1A3A5A" }, line: { color: C.adv, width: 1.5 }, rectRadius: 0.08 });
  label(slide, "Compute A†.\nDoes A = A†?", qx, qy, qw, qh, { color: C.white, size: 9 });

  // YES branch
  arrow(slide, qx, qy+qh, qx-0.2, qy+qh+0.35, C.green, 1.5);
  label(slide, "YES", qx-0.55, qy+qh+0.05, 0.5, 0.22, { color: C.green, size: 9, bold: true });
  slide.addShape("roundRect", { x: x+0.12, y: qy+qh+0.38, w: w*0.35, h: 0.52,
    fill: { color: "0A3020" }, line: { color: C.green, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "HERMITIAN\nA = A†\nreal eigenvalues\nobservable ✓", x+0.12, qy+qh+0.38, w*0.35, 0.52, { color: C.green, size: 8.5 });

  // NO branch — check -A†
  arrow(slide, qx+qw, qy+qh, qx+qw+0.15, qy+qh+0.35, C.coral, 1.5);
  label(slide, "NO →\nDoes A = −A†?", qx+qw+0.04, qy+qh+0.04, 0.82, 0.35, { color: C.coral, size: 8 });

  const q2x = qx+qw-0.04, q2y = qy+qh+0.42;
  // YES branch of NO
  arrow(slide, q2x+0.12, q2y+0.35, q2x+0.12, q2y+0.75, C.gold, 1.5);
  label(slide, "YES", q2x, q2y+0.36, 0.35, 0.2, { color: C.gold, size: 9, bold: true });
  slide.addShape("roundRect", { x: q2x-0.04, y: q2y+0.78, w: w*0.33, h: 0.52,
    fill: { color: "2A1A00" }, line: { color: C.gold, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "ANTI-HERMITIAN\nA = −A†\nimaginary eigenvalues\ngenerator ✓", q2x-0.04, q2y+0.78, w*0.33, 0.52, { color: C.gold, size: 8.5 });

  // NO branch of NO
  arrow(slide, q2x+w*0.33+0.1, q2y+0.55, q2x+w*0.33+0.1, q2y+0.78, C.mutedText, 1.2);
  label(slide, "NO", q2x+w*0.35, q2y+0.6, 0.3, 0.2, { color: C.mutedText, size: 9 });
  slide.addShape("roundRect", { x: q2x+w*0.3+0.04, y: q2y+0.78, w: w*0.28, h: 0.52,
    fill: { color: "1A1A1A" }, line: { color: "4A4A4A", width: 1 }, rectRadius: 0.06 });
  label(slide, "GENERAL\nComplex eigenvalues\nnot observable", q2x+w*0.3+0.04, q2y+0.78, w*0.28, 0.52, { color: "7A9AAA", size: 8 });
}

function diag_LO4_AdvUG(slide, x, y, w, h) {
  // Decomposition A = A_H + A_AH diagram
  diagramBox(slide, x, y, w, h);
  label(slide, "Hermitian Decomposition of Any Operator", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const cx = x+w/2;

  // A box at top
  slide.addShape("roundRect", { x: cx-0.5, y: y+0.32, w: 1.0, h: 0.5,
    fill: { color: "1A3A5A" }, line: { color: C.adv, width: 2 }, rectRadius: 0.08 });
  label(slide, "Â (any operator)", cx-0.5, y+0.32, 1.0, 0.5, { color: C.adv, size: 9, bold: true });

  // Split arrows
  arrow(slide, cx-0.2, y+0.82, cx-0.9, y+1.22, C.cyan, 1.5);
  arrow(slide, cx+0.2, y+0.82, cx+0.9, y+1.22, C.gold, 1.5);

  // Hermitian part
  slide.addShape("roundRect", { x: x+0.12, y: y+1.25, w: w*0.42, h: 0.65,
    fill: { color: "0A2A40" }, line: { color: C.cyan, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "Â_H\n(Hermitian part)\n(Â + Â†) / 2", x+0.12, y+1.25, w*0.42, 0.65, { color: C.cyan, size: 9 });

  // + sign
  label(slide, "+", cx-0.1, y+1.48, 0.22, 0.26, { color: C.white, size: 14, bold: true });

  // Anti-Hermitian part
  slide.addShape("roundRect", { x: x+w-w*0.42-0.12, y: y+1.25, w: w*0.42, h: 0.65,
    fill: { color: "2A1A00" }, line: { color: C.gold, width: 1.5 }, rectRadius: 0.06 });
  label(slide, "Â_AH\n(Anti-Hermitian)\n(Â − Â†) / 2", x+w-w*0.42-0.12, y+1.25, w*0.42, 0.65, { color: C.gold, size: 9 });

  // Properties
  const propsY = y+2.05;
  slide.addShape("line", { x: x+0.12, y: propsY, w: w-0.24, h: 0, line: { color: "2A4A6A", width: 0.75 } });
  const propRows = [
    ["Â_H = Â_H†", "real eigenvalues", C.cyan],
    ["Â_AH = −Â_AH†", "imaginary eigenvalues", C.gold],
    ["iÂ_AH is Hermitian", "generators of unitaries", C.green],
    ["unique decomposition", "for all bounded Â", C.lightText],
  ];
  propRows.forEach(([a, b, col], i) => {
    const py = propsY+0.08+i*0.32;
    label(slide, a, x+0.14, py, w*0.45, 0.28, { color: col, size: 8.5, bold: true, align: "left" });
    label(slide, "→ " + b, x+0.14+w*0.45, py, w*0.42, 0.28, { color: C.mutedText, size: 8, align: "left" });
  });
}

function diag_LO4_MSc(slide, x, y, w, h) {
  // Spectrum on real/imaginary axis for each class, + normal operators
  diagramBox(slide, x, y, w, h);
  label(slide, "Spectra of Operator Classes", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  const classes = [
    { name: "Hermitian\nA = A†", spec: "σ(A) ⊆ ℝ", color: C.cyan, pos: "real axis" },
    { name: "Anti-Hermitian\nA = −A†", spec: "σ(A) ⊆ iℝ", color: C.gold, pos: "imaginary axis" },
    { name: "Unitary\nAA† = 1̂", spec: "σ(A) ⊆ S¹", color: C.green, pos: "unit circle" },
    { name: "Normal\nAA† = A†A", spec: "σ(A) ⊆ ℂ", color: C.purple, pos: "full plane" },
  ];

  const cw = (w-0.3)/4;
  classes.forEach((c, i) => {
    const bx = x+0.12+i*(cw+0.04);

    slide.addShape("roundRect", { x: bx, y: y+0.32, w: cw, h: 0.62,
      fill: { color: "0A1A2A" }, line: { color: c.color, width: 1.5 }, rectRadius: 0.05 });
    label(slide, c.name, bx, y+0.32, cw, 0.62, { color: c.color, size: 7.5 });

    // Mini complex plane diagram
    const px = bx+cw*0.1, py = y+1.02, pr = cw*0.38;
    slide.addShape("ellipse", { x: px, y: py, w: pr*2, h: pr*2,
      fill: { color: "0A1020", transparency: 30 }, line: { color: "2A4A6A", width: 0.75 } });
    slide.addShape("line", { x: px, y: py+pr, w: pr*2, h: 0, line: { color: "3A6A9A", width: 0.75 } });
    slide.addShape("line", { x: px+pr, y: py, w: 0, h: pr*2, line: { color: "3A6A9A", width: 0.75 } });

    if (c.spec.includes("ℝ")) {
      slide.addShape("line", { x: px, y: py+pr, w: pr*2, h: 0, line: { color: c.color, width: 2 } });
    } else if (c.spec.includes("iℝ")) {
      slide.addShape("line", { x: px+pr, y: py, w: 0, h: pr*2, line: { color: c.color, width: 2 } });
    } else if (c.spec.includes("S¹")) {
      slide.addShape("ellipse", { x: px+pr*0.27, y: py+pr*0.27, w: pr*1.46, h: pr*1.46,
        fill: { color: "0D1B2A", transparency: 100 }, line: { color: c.color, width: 2 } });
    } else {
      slide.addShape("ellipse", { x: px+pr*0.27, y: py+pr*0.27, w: pr*1.46, h: pr*1.46,
        fill: { color: c.color, transparency: 60 }, line: { color: c.color, width: 1 } });
    }

    label(slide, c.spec, bx, py+pr*2+0.06, cw, 0.2, { color: c.color, size: 7.5, bold: true });
  });

  // Implication chain
  slide.addShape("rect", { x: x+0.12, y: y+h-0.62, w: w-0.24, h: 0.52,
    fill: { color: "0A1628" }, line: { color: "2A5A7A", width: 1 } });
  label(slide, "self-adjoint ⟹ normal;  unitary ⟹ normal;  normal ⟺ diagonalisable (spectral theorem)", x+0.16, y+h-0.60, w-0.32, 0.48, { color: "A0C4D8", size: 8 });
}

function diag_LO4_PhD(slide, x, y, w, h) {
  // C*-algebra structure and Gelfand-Naimark
  diagramBox(slide, x, y, w, h);
  label(slide, "C*-Algebra Classification & GNS", x, y+0.06, w, 0.2, { color: C.cyan, size: 8.5, bold: true, align: "center" });

  // Hierarchy boxes
  const items = [
    { name: "Banach algebra", extra: "‖AB‖ ≤ ‖A‖‖B‖", color: "3A7AAA", w: w*0.9 },
    { name: "C*-algebra", extra: "‖A*A‖ = ‖A‖²  (C*-identity)", color: C.adv, w: w*0.75 },
    { name: "von Neumann algebra", extra: "closed in weak operator topology", color: C.purple, w: w*0.58 },
    { name: "B(ℋ) bounded operators", extra: "universal: every C*-algebra ↪ B(ℋ)", color: C.cyan, w: w*0.42 },
  ];

  items.forEach((it, i) => {
    const bx = x + (w-it.w)/2;
    const by = y+0.33+i*0.9;
    slide.addShape("roundRect", { x: bx, y: by, w: it.w, h: 0.75,
      fill: { color: "0A1A2A" }, line: { color: it.color, width: i===3 ? 2 : 1.2 }, rectRadius: 0.06 });
    label(slide, it.name, bx, by+0.03, it.w, 0.28, { color: it.color, size: 9, bold: true });
    label(slide, it.extra, bx, by+0.3, it.w, 0.4, { color: C.mutedText, size: 7.5, italic: true });
    if (i < items.length-1) {
      arrow(slide, x+w/2, by+0.75, x+w/2, by+0.9, "3A6A8A", 1.2);
    }
  });

  // GNS note
  label(slide, "Gelfand–Naimark–Segal: every C*-algebra is ∗-isomorphic to a subalgebra of B(ℋ)", x+0.1, y+h-0.38, w-0.2, 0.32, { color: C.gold, size: 7.5, italic: true });
}

// ─────────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
// SPECIAL TOPIC SLIDES (Lebesgue, Banach, Banach Duality)
// ══════════════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────

function buildLebesgueSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  header(slide, "L01 — Lebesgue Integration and L²(ℝ)", "From step functions to square-integrable wavefunctions — the measure-theoretic foundation", "L01", false);
  footer(slide, "QM: Module I.1 — L01", "L01 · Lebesgue Integration", false);

  // Left panel: explanation
  lightPanel(slide, "WHY LEBESGUE, NOT RIEMANN?", [
    "The Riemann integral fails for: pointwise limits of sequences, functions with many discontinuities, infinite-dimensional completeness.",
    "─",
    "Lebesgue's key insight: measure the domain first. For f: ℝ → ℝ, partition the RANGE [a,b] into strips of height ε, then measure the set {x : a ≤ f(x) < a+ε}.",
    "─",
    "This allows integration of far more functions than Riemann, and crucially makes L²(ℝ) complete (Riesz–Fischer theorem).",
  ], 0.25, 0.88, 5.3, 2.35, C.cyan);

  lightPanel(slide, "L²(ℝ) FORMALLY", [
    "L²(ℝ) = { f: ℝ→ℂ measurable | ∫|f(x)|²dμ < ∞ }",
    "─",
    "Inner product: ⟨f|g⟩ = ∫f*(x)g(x)dμ(x)",
    "Norm: ‖f‖² = ∫|f(x)|²dμ(x)",
    "─",
    "Key: identify f ~ g when ∫|f−g|²dμ = 0\n(equal almost everywhere — measure zero sets ignored)",
    "─",
    "Riesz–Fischer: every Cauchy sequence in L²\nconverges to a function in L² → COMPLETE.",
  ], 0.25, 3.32, 5.3, 2.18, C.teal);

  lightPanel(slide, "PHYSICAL SIGNIFICANCE", [
    "Wavefunctions ψ(x) ∈ L²(ℝ): normalisable quantum states",
    "Riemann integral would exclude physically reasonable ψ (e.g., limits of wave packets)",
    "Lebesgue theory makes ‖ψ(t)‖ = const rigorous for all t",
    "Dirac delta δ(x) lives in L²-dual, not L² itself",
  ], 0.25, 5.58-0.1, 5.3, 1.1, C.green);

  // RIGHT: Lebesgue integral diagram
  const dx = 5.75, dy = 0.88, dw = 3.95, dh = 5.7;
  slide.addShape("rect", { x: dx, y: dy, w: dw, h: dh, fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 } });

  label(slide, "Lebesgue vs. Riemann Integration", dx, dy+0.06, dw, 0.22, { color: C.darkText, size: 9, bold: true, align: "center" });

  // Draw axes for both diagrams side by side
  const ax1x = dx+0.22, ax2x = dx+dw/2+0.15, axy = dy+2.35, axw = dw/2-0.35, axh = 1.6;

  ["Riemann", "Lebesgue"].forEach((method, mi) => {
    const axx = mi===0 ? ax1x : ax2x;
    const col = mi===0 ? C.midblue : C.teal;

    label(slide, method, axx, dy+0.32+mi*0.01, axw, 0.2, { color: col, size: 8, bold: true, align: "center" });
    arrow(slide, axx, axy, axx+axw, axy, "5A7A9A", 1);
    arrow(slide, axx, axy, axx, axy-axh, "5A7A9A", 1);
    label(slide, "x", axx+axw+0.04, axy-0.1, 0.16, 0.18, { color: "7A9AAA", size: 7 });
    label(slide, "f", axx-0.14, axy-axh-0.04, 0.16, 0.18, { color: "7A9AAA", size: 7 });

    // Curve (piecewise Gaussian)
    const N = 15;
    for (let j = 0; j < N; j++) {
      const t1 = j/N, t2 = (j+1)/N;
      const f1 = axh*0.8*Math.exp(-(Math.pow((t1-0.5)*5, 2)));
      const f2 = axh*0.8*Math.exp(-(Math.pow((t2-0.5)*5, 2)));
      slide.addShape("line", {
        x: axx+t1*axw, y: axy-f1, w: (t2-t1)*axw, h: -(f2-f1),
        line: { color: col, width: 1.8 }
      });
    }

    if (mi === 0) {
      // Riemann: vertical bars (partition x-axis)
      const nBars = 6;
      for (let j = 0; j < nBars; j++) {
        const t = j/nBars;
        const midT = (j+0.5)/nBars;
        const fh = axh*0.8*Math.exp(-(Math.pow((midT-0.5)*5, 2)));
        const barW = axw/nBars;
        slide.addShape("rect", { x: axx+t*axw, y: axy-fh, w: barW-0.01, h: fh,
          fill: { color: C.midblue, transparency: 70 }, line: { color: C.midblue, width: 0.5 } });
      }
      label(slide, "partition x-axis\n→ vertical strips", axx, axy+0.08, axw, 0.32, { color: C.midblue, size: 7 });
    } else {
      // Lebesgue: horizontal slabs (partition range/y-axis)
      const nSlabs = 5;
      for (let j = 0; j < nSlabs; j++) {
        const fLow = j*axh*0.72/nSlabs;
        const fHigh = (j+1)*axh*0.72/nSlabs;
        const fMid = (fLow+fHigh)/2;
        // Width = measure of {x: f_low ≤ f(x) < f_high}
        const sigma = 1/(5*Math.sqrt(2*Math.log(axh*0.8/(fMid+0.01))||0.1));
        const measW = Math.min(axw*sigma*0.8, axw*0.85);
        const mx = axx + (axw-measW)/2;
        slide.addShape("rect", { x: mx, y: axy-fHigh, w: measW, h: fHigh-fLow,
          fill: { color: C.teal, transparency: 60 }, line: { color: C.teal, width: 0.5 } });
      }
      label(slide, "partition f-range\n→ horizontal slabs", axx, axy+0.08, axw, 0.32, { color: C.teal, size: 7 });
    }
  });

  // Divider between the two
  slide.addShape("line", { x: dx+dw/2, y: dy+0.55, w: 0, h: dh-0.65, line: { color: "C0D0E0", width: 0.75 } });

  // Convergence diagram below
  label(slide, "Convergence in L²(ℝ)", dx, dy+dh-1.55, dw, 0.2, { color: C.darkText, size: 8.5, bold: true, align: "center" });
  slide.addShape("rect", { x: dx+0.15, y: dy+dh-1.32, w: dw-0.3, h: 1.12,
    fill: { color: "EAF4FF" }, line: { color: C.adv, width: 1 } });
  const convLines = [
    "fₙ → f in L²: ‖fₙ − f‖² = ∫|fₙ(x) − f(x)|²dx → 0",
    "Riesz–Fischer: every Cauchy sequence converges in L²",
    "Pointwise a.e. limit ≠ L² limit in general",
    "but: dominated convergence → L² convergence",
  ];
  convLines.forEach((l, i) => {
    label(slide, l, dx+0.22, dy+dh-1.28+i*0.25, dw-0.4, 0.24, { color: C.bodyText, size: 7.5, align: "left" });
  });
}

function buildBanachSlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  header(slide, "L01 — Banach Spaces", "Complete normed vector spaces: the broader family containing Hilbert spaces", "L01", false);
  footer(slide, "QM: Module I.1 — L01", "L01 · Banach Spaces", false);

  lightPanel(slide, "DEFINITION: BANACH SPACE", [
    "A Banach space is a complete normed vector space (X, ‖·‖) over ℝ or ℂ.",
    "─",
    "Norm axioms: (N1) ‖x‖ ≥ 0, = 0 iff x = 0; (N2) ‖αx‖ = |α|‖x‖; (N3) ‖x+y‖ ≤ ‖x‖ + ‖y‖.",
    "─",
    "Complete: every Cauchy sequence {xₙ} with ‖xₙ−xₘ‖→0 converges to a limit in X.",
    "─",
    "Key difference from Hilbert: a Banach space has a NORM but no INNER PRODUCT in general.",
  ], 0.25, 0.88, 5.3, 2.2, C.cyan);

  lightPanel(slide, "HILBERT VS. BANACH", [
    "Hilbert space ℋ: inner product ⟨·|·⟩ → norm ‖ψ‖ = √⟨ψ|ψ⟩. Every Hilbert space is Banach.",
    "─",
    "Banach space: norm ‖·‖ only. NOT every norm comes from an inner product.",
    "─",
    "Test (Parallelogram law): a normed space is Hilbert iff\n‖x+y‖² + ‖x−y‖² = 2(‖x‖² + ‖y‖²) for all x, y.",
    "─",
    "Lᵖ(ℝ) for p ≠ 2 is Banach but NOT Hilbert: the parallelogram law fails.",
  ], 0.25, 3.18, 5.3, 2.15, C.teal);

  lightPanel(slide, "QUANTUM MECHANICS CONNECTION", [
    "QM state space is specifically a Hilbert space (needs inner product for Born rule and probabilities)",
    "Observable algebras (C*-algebras) are Banach *-algebras with the C*-identity ‖A*A‖ = ‖A‖²",
    "Sobolev spaces (domains of differential operators) are Banach, often not Hilbert",
  ], 0.25, 5.42, 5.3, 1.26, C.green);

  // RIGHT: comprehensive hierarchy diagram
  const dx = 5.75, dy = 0.88, dw = 3.95, dh = 5.8;
  slide.addShape("rect", { x: dx, y: dy, w: dw, h: dh, fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 } });
  label(slide, "Space Hierarchy & Examples", dx, dy+0.07, dw, 0.22, { color: C.darkText, size: 9, bold: true, align: "center" });

  const levels = [
    { name: "Vector Space", extra: "addition + scalar mult.", example: "any linear space", color: "4A7AAA", ry: 0.38 },
    { name: "Normed Space", extra: "‖·‖ satisfies N1–N3", example: "polynomials P[0,1]", color: "3A9AAA", ry: 0.72 },
    { name: "Banach Space", extra: "+ completeness", example: "Lᵖ(ℝ), C(K), ℓᵖ", color: C.teal, ry: 1.06 },
    { name: "Inner Product Space", extra: "⟨·|·⟩ → norm", example: "pre-Hilbert space", color: C.adv, ry: 1.40 },
    { name: "Hilbert Space ℋ", extra: "+ complete inner product", example: "L²(ℝ), ℂⁿ, ℓ²", color: C.cyan, ry: 1.74 },
  ];

  const boxW = dw-0.4, boxH = 0.48;
  levels.forEach((lv, i) => {
    const bx = dx+0.2, by = dy+0.33+i*0.9;
    slide.addShape("roundRect", { x: bx, y: by, w: boxW, h: boxH,
      fill: { color: "0A1825" }, line: { color: lv.color, width: i===4 ? 2 : 1.2 }, rectRadius: 0.06 });
    label(slide, lv.name, bx+0.08, by+0.03, boxW*0.5, 0.22, { color: lv.color, size: 9, bold: true, align: "left" });
    label(slide, lv.extra, bx+0.08, by+0.26, boxW*0.5, 0.18, { color: C.mutedText, size: 7.5, italic: true, align: "left" });
    label(slide, lv.example, bx+boxW*0.5, by+0.06, boxW*0.48, 0.38, { color: "7ABADB", size: 7.5 });

    if (i < levels.length-1) {
      arrow(slide, dx+dw/2, by+boxH, dx+dw/2, by+boxH+0.42, "4A7A9A", 1.2);
      label(slide, "⊂", dx+dw/2-0.08, by+boxH+0.1, 0.25, 0.22, { color: "7AAABB", size: 10 });
    }
  });

  // Parallelogram law box
  slide.addShape("rect", { x: dx+0.2, y: dy+dh-0.82, w: boxW, h: 0.72,
    fill: { color: "0A1628" }, line: { color: C.gold, width: 1.5 } });
  label(slide, "Parallelogram Law (Hilbert iff...)", dx+0.24, dy+dh-0.80, boxW-0.1, 0.22, { color: C.gold, size: 8, bold: true, align: "left" });
  label(slide, "‖x+y‖² + ‖x−y‖² = 2(‖x‖² + ‖y‖²)", dx+0.24, dy+dh-0.56, boxW-0.1, 0.2, { color: "C8E8F8", size: 8, align: "left" });
  label(slide, "Fails for ‖·‖₁ and ‖·‖∞: not Hilbert!", dx+0.24, dy+dh-0.36, boxW-0.1, 0.2, { color: C.coral, size: 8, align: "left" });
}

function buildBanachDualitySlide(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.lightBg };
  header(slide, "L01 — Banach Duality: Operators and Distributions", "The dual pairing between function spaces and their duals — from bras to Schwartz distributions", "L01", false);
  footer(slide, "QM: Module I.1 — L01", "L01 · Banach Duality", false);

  lightPanel(slide, "BANACH DUAL SPACE X*", [
    "For a Banach space X, the dual X* = B(X, ℂ) is the space of all continuous linear functionals f: X → ℂ.",
    "─",
    "Norm on X*: ‖f‖_* = sup{ |f(x)| : ‖x‖ ≤ 1 }.",
    "─",
    "The dual pairing ⟨f, x⟩ = f(x) is bilinear in (f, x) and bounded: |⟨f,x⟩| ≤ ‖f‖_* ‖x‖.",
    "─",
    "Riesz representation: For Hilbert ℋ, the map |φ⟩ ↦ ⟨φ|·⟩ is an ANTILINEAR isometric isomorphism ℋ → ℋ*. Hence ℋ ≅ ℋ* (self-dual).",
  ], 0.25, 0.88, 5.3, 2.35, C.cyan);

  lightPanel(slide, "ADJOINT OPERATORS AND DUAL MAPS", [
    "Given A: X → Y (bounded operator), the adjoint (Banach sense) A*: Y* → X* is defined by:",
    "─",
    "  (A*g)(x) = g(Ax)   for g ∈ Y*, x ∈ X",
    "─",
    "This is the BANACH adjoint (also called transpose). For Hilbert spaces, it coincides with the Hilbert adjoint A†.",
    "─",
    "Key: ‖A*‖ = ‖A‖  (norm is preserved under dualisation).",
  ], 0.25, 3.33, 5.3, 2.0, C.teal);

  lightPanel(slide, "DISTRIBUTIONS: L²-DUAL AND SOBOLEV", [
    "Schwartz space S(ℝ) ⊂ L²(ℝ) ⊂ S*(ℝ) — the Gel'fand triple (rigged Hilbert space).",
    "─",
    "S*(ℝ) = tempered distributions: |δ(x)⟩ (Dirac delta) ∈ S*, not in L².",
    "─",
    "⟨δ, ψ⟩ = ψ(0): a functional on S(ℝ). This is Banach duality in action.",
    "─",
    "Sobolev Hˢ(ℝ): dual is H⁻ˢ(ℝ). The pair (Hˢ, H⁻ˢ) is a Banach dual pair relevant to PDE and QM.",
  ], 0.25, 5.42, 5.3, 1.26, C.green);

  // RIGHT diagram: Gel'fand triple + adjoint arrow diagram
  const dx = 5.75, dy = 0.88, dw = 3.95, dh = 5.8;
  slide.addShape("rect", { x: dx, y: dy, w: dw, h: dh, fill: { color: C.offWhite }, line: { color: "D0DCE8", width: 1 } });
  label(slide, "Banach Duality Diagrams", dx, dy+0.07, dw, 0.22, { color: C.darkText, size: 9, bold: true, align: "center" });

  // ── Gel'fand triple ──
  label(slide, "Gel'fand Triple (Rigged Hilbert Space)", dx+0.15, dy+0.33, dw-0.3, 0.2, { color: C.teal, size: 8.5, bold: true, align: "center" });

  const spaces = [
    { name: "S(ℝ)", sub: "Schwartz\ntest functions", color: C.cyan, x: dx+0.18 },
    { name: "L²(ℝ)", sub: "square-integrable\nwavefunctions", color: C.green, x: dx+dw/2-0.42 },
    { name: "S*(ℝ)", sub: "distributions\n|x⟩, |p⟩, δ(x)", color: C.coral, x: dx+dw-1.0 },
  ];
  const sY = dy+0.58, sH = 0.82, sW = 1.0;
  spaces.forEach(sp => {
    slide.addShape("roundRect", { x: sp.x, y: sY, w: sW, h: sH,
      fill: { color: "0A1525" }, line: { color: sp.color, width: 1.5 }, rectRadius: 0.06 });
    label(slide, sp.name, sp.x, sY+0.04, sW, 0.28, { color: sp.color, size: 11, bold: true });
    label(slide, sp.sub, sp.x, sY+0.34, sW, 0.44, { color: C.lightText, size: 7.5, italic: true });
  });

  // ⊂ arrows between spaces
  const sy = sY+sH/2;
  arrow(slide, spaces[0].x+sW+0.02, sy, spaces[1].x-0.02, sy, C.adv, 1.5);
  arrow(slide, spaces[1].x+sW+0.02, sy, spaces[2].x-0.02, sy, C.adv, 1.5);
  label(slide, "⊂", spaces[0].x+sW+0.05, sy-0.16, spaces[1].x-spaces[0].x-sW-0.06, 0.2, { color: C.adv, size: 11 });
  label(slide, "⊂", spaces[1].x+sW+0.05, sy-0.16, spaces[2].x-spaces[1].x-sW-0.06, 0.2, { color: C.adv, size: 11 });
  label(slide, "dense embeddings", dx+0.15, sY+sH+0.06, dw-0.3, 0.2, { color: C.mutedText, size: 7.5, italic: true, align: "center" });

  // ── Adjoint diagram ──
  const adjY = dy+1.72;
  slide.addShape("line", { x: dx+0.15, y: adjY, w: dw-0.3, h: 0, line: { color: "C0D0E0", width: 0.75 } });
  label(slide, "Operator Adjoint = Dual Map", dx+0.15, adjY+0.08, dw-0.3, 0.2, { color: C.teal, size: 8.5, bold: true, align: "center" });

  // Commutative diagram: X →A→ Y, X* ←A*← Y*
  const bw2 = 0.82, bh2 = 0.42;
  const Xx = dx+0.28, Yx = dx+dw-bw2-0.28, Dy1 = adjY+0.36, Dy2 = Dy1+1.1;

  // X, Y boxes
  [[Xx,"X",C.cyan],[Yx,"Y",C.green]].forEach(([bx,nm,col]) => {
    slide.addShape("roundRect", { x: bx, y: Dy1, w: bw2, h: bh2,
      fill: { color: "0A1828" }, line: { color: col, width: 1.5 }, rectRadius: 0.05 });
    label(slide, nm, bx, Dy1, bw2, bh2, { color: col, size: 11, bold: true });
  });
  arrow(slide, Xx+bw2+0.04, Dy1+bh2/2, Yx-0.04, Dy1+bh2/2, C.gold, 1.8);
  label(slide, "A", (Xx+bw2+Yx)/2-0.12, Dy1, 0.25, bh2*0.8, { color: C.gold, size: 10, bold: true });

  // X*, Y* boxes (swapped, dual)
  [[Xx,"X*",C.coral],[Yx,"Y*",C.purple]].forEach(([bx,nm,col]) => {
    slide.addShape("roundRect", { x: bx, y: Dy2, w: bw2, h: bh2,
      fill: { color: "0A1828" }, line: { color: col, width: 1.5 }, rectRadius: 0.05 });
    label(slide, nm, bx, Dy2, bw2, bh2, { color: col, size: 11, bold: true });
  });
  // A* arrow goes BACKWARDS: Y* → X*
  arrow(slide, Yx-0.04, Dy2+bh2/2, Xx+bw2+0.04, Dy2+bh2/2, C.purple, 1.8);
  label(slide, "A*", (Xx+bw2+Yx)/2-0.12, Dy2+bh2*0.1, 0.28, bh2*0.8, { color: C.purple, size: 10, bold: true });

  // Vertical lines (functoriality)
  slide.addShape("line", { x: Xx+bw2/2, y: Dy1+bh2, w: 0, h: Dy2-Dy1-bh2, line: { color: "4A7A9A", width: 1, dashType: "dash" } });
  slide.addShape("line", { x: Yx+bw2/2, y: Dy1+bh2, w: 0, h: Dy2-Dy1-bh2, line: { color: "4A7A9A", width: 1, dashType: "dash" } });
  label(slide, "dualise", Xx+bw2+0.04, Dy1+bh2+0.15, Yx-Xx-bw2-0.06, 0.2, { color: "4A7A9A", size: 7.5, italic: true });

  label(slide, "A* reverses arrows!\n(A*)ᵀ = contravariant functor", dx+0.15, Dy2+bh2+0.08, dw-0.3, 0.32, { color: C.lightText, size: 7.5, italic: true, align: "center" });

  // Dirac delta example
  slide.addShape("rect", { x: dx+0.15, y: dy+dh-0.78, w: dw-0.3, h: 0.68,
    fill: { color: "0A1628" }, line: { color: C.gold, width: 1 } });
  label(slide, "Example: δ ∈ S*(ℝ)  ⟺  ⟨δ, ψ⟩ = ψ(0)\nx̂*δ = −δ'  (adjoint in distribution sense)\nEvery ⟨x|ψ⟩ = ψ(x) is a dual pairing", dx+0.2, dy+dh-0.76, dw-0.38, 0.64, { color: "C8E8F8", size: 7.8, align: "left" });
}

// ─────────────────────────────────────────────────────────────────────
// BUILD ALL SLIDES
// ─────────────────────────────────────────────────────────────────────

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "L01 Extra Slides — Tier Concepts + Special Topics";

  // ── SECTION DIVIDER: Tier Concept Slides ────────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg2 };
    s.addShape("rect", { x: 0, y: 2.2, w: 10, h: 1.25, fill: { color: C.panelBg }, line: { color: C.panelBg } });
    s.addText("SECTION A", { x: 0.5, y: 1.5, w: 9, h: 0.4, fontSize: 11, color: C.mutedText, bold: true, fontFace: "Calibri", charSpacing: 4, align: "center" });
    s.addText("Tier-Differentiated Concept Slides", { x: 0.5, y: 2.25, w: 9, h: 0.75, fontSize: 28, color: C.white, bold: true, fontFace: "Cambria", align: "center", valign: "middle" });
    s.addText("L01: The Hilbert Space of Quantum States\n20 slides — 5 tiers × 4 learning objectives — each with diagram", {
      x: 0.5, y: 3.15, w: 9, h: 0.55, fontSize: 12, color: C.mutedText, fontFace: "Calibri", align: "center"
    });
    let bx = 1.5;
    TIERS.forEach(t => {
      s.addShape("roundRect", { x: bx, y: 4.0, w: 1.2, h: 0.36, fill: { color: t.color }, line: { color: t.color }, rectRadius: 0.05 });
      s.addText(t.code, { x: bx, y: 4.0, w: 1.2, h: 0.36, fontSize: 11, bold: true, color: t.textDark ? C.darkText : C.white, fontFace: "Calibri", align: "center", valign: "middle" });
      bx += 1.42;
    });
  }

  // ── 20 TIER CONCEPT SLIDES ──────────────────────────────────────────
  const diagFunctions = [
    [diag_LO1_HS, diag_LO1_BegUG, diag_LO1_AdvUG, diag_LO1_MSc, diag_LO1_PhD],
    [diag_LO2_HS, diag_LO2_BegUG, diag_LO2_AdvUG, diag_LO2_MSc, diag_LO2_PhD],
    [diag_LO3_HS, diag_LO3_BegUG, diag_LO3_AdvUG, diag_LO3_MSc, diag_LO3_PhD],
    [diag_LO4_HS, diag_LO4_BegUG, diag_LO4_AdvUG, diag_LO4_MSc, diag_LO4_PhD],
  ];

  const tierContent = {
    // LO1 × all tiers
    "LO1-HS": {
      body: ["The inner product ⟨φ|ψ⟩ measures the 'overlap' between two quantum states.",
             "If ⟨φ|ψ⟩ = 0, the states are orthogonal — perfectly distinguishable.",
             "The norm ‖|ψ⟩‖ = √⟨ψ|ψ⟩ gives the 'length' of a state.",
             "Normalisation ⟨ψ|ψ⟩ = 1 ensures probabilities add to 1.",
             "Think: the Hilbert space is like ℝ² or ℂ², but possibly infinite-dimensional."],
      formula: ["⟨φ|ψ⟩ ∈ ℂ  (complex number)",
                "‖|ψ⟩‖ = √⟨ψ|ψ⟩  (real ≥ 0)",
                "⟨ψ|ψ⟩ = 1  (normalised state)"],
      summary: "Concrete: use ℂ² spin states. |+⟩=(1,0)ᵀ, |−⟩=(0,1)ᵀ, ⟨+|−⟩ = 0 (orthogonal), ‖|+⟩‖ = 1."
    },
    "LO1-BegUG": {
      body: ["A Hilbert space ℋ is a complete complex inner product space.",
             "(IP1) Conjugate symmetry: ⟨φ|ψ⟩ = ⟨ψ|φ⟩*",
             "(IP2) Linearity in second slot: ⟨φ|αψ + βχ⟩ = α⟨φ|ψ⟩ + β⟨φ|χ⟩",
             "(IP3) Positive semidefinite: ⟨ψ|ψ⟩ ≥ 0",
             "(IP4) Non-degenerate: ⟨ψ|ψ⟩ = 0 iff |ψ⟩ = 0",
             "Completeness: every Cauchy sequence converges within ℋ."],
      formula: ["In ℂⁿ: ⟨φ|ψ⟩ = Σᵢ φᵢ* ψᵢ",
                "Cauchy: ‖|ψₙ⟩ − |ψₘ⟩‖ → 0",
                "Complete: limit ∈ ℋ"],
      summary: "Exercise: Verify all 4 axioms for ⟨φ|ψ⟩ = Σᵢ φᵢ* ψᵢ on ℂⁿ."
    },
    "LO1-AdvUG": {
      body: ["A Hilbert space ℋ over ℂ satisfies all four inner product axioms (IP1–IP4) and is complete.",
             "Completeness means: if ‖|ψₙ⟩ − |ψₘ⟩‖ → 0, then ∃ |ψ⟩ ∈ ℋ with ‖|ψₙ⟩ − |ψ⟩‖ → 0.",
             "Examples: ℂⁿ (finite), L²(ℝ) (infinite). Non-example: C([0,1]) with L²-norm.",
             "Cauchy–Schwarz: |⟨φ|ψ⟩|² ≤ ⟨φ|φ⟩⟨ψ|ψ⟩ — prove using ‖|ψ⟩ − λ|φ⟩‖² ≥ 0."],
      formula: ["‖|ψ⟩ − |ψₙ⟩‖ → 0  (convergence)",
                "|⟨φ|ψ⟩|² ≤ ‖φ‖²‖ψ‖² (C-S)",
                "ℂⁿ, L²(ℝ), ℓ²(ℤ) are Hilbert"],
      summary: "Proof task: Show C([0,1]) with ‖f‖₂ = (∫|f|²dx)^½ is NOT complete."
    },
    "LO1-MSc": {
      body: ["L²(ℝ) is the canonical infinite-dimensional separable Hilbert space.",
             "Formally: equivalence classes [f] where f ~ g iff ∫|f−g|²dμ = 0 (a.e. equal).",
             "The Riesz–Fischer theorem (1907) proves L²(ℝ) is complete.",
             "Separability: L²(ℝ) has a countable orthonormal basis {eₙ} (e.g., Hermite functions).",
             "Sobolev spaces H^s(ℝ) ⊂ L²(ℝ) for s > 0 carry additional regularity."],
      formula: ["‖f‖² = ∫_{ℝ} |f(x)|² dμ(x)",
                "⟨f|g⟩ = ∫ f*(x) g(x) dμ(x)",
                "Riesz–Fischer: L² is complete"],
      summary: "Theorem (Riesz–Fischer): Every L²-Cauchy sequence has a subsequence converging pointwise a.e. to its L²-limit."
    },
    "LO1-PhD": {
      body: ["Separable Hilbert spaces: all infinite-dimensional separable Hilbert spaces are isomorphic to ℓ²(ℤ).",
             "Non-separable: L∞ and certain von Neumann algebra Hilbert spaces.",
             "Completion theorem: every inner product space has a unique Hilbert space completion.",
             "Domain theory: operators like x̂, p̂ are defined on dense domains D(Â) ⊊ L²(ℝ).",
             "Gel'fand triple: S(ℝ) ⊂ L²(ℝ) ⊂ S*(ℝ) — rigged Hilbert space for continuous spectrum."],
      formula: ["ℓ²(ℤ) ≅ L²(ℝ) (separable ∞-dim)",
                "Ī = closure of inner product space",
                "S ⊂ L² ⊂ S* (Gel'fand triple)"],
      summary: "Key: all separable infinite-dimensional Hilbert spaces are unitarily isomorphic — there is essentially ONE such space."
    },
    // LO2 × all tiers
    "LO2-HS": {
      body: ["A BOUNDED operator Â has a finite 'stretching factor': ‖Â|ψ⟩‖ ≤ M‖|ψ⟩‖ for all states.",
             "An UNBOUNDED operator can stretch states by arbitrarily large amounts.",
             "Bounded: spin operators Ŝₓ, Ŝᵧ, Ŝᵤ (eigenvalues ±ℏ/2 — always finite).",
             "Unbounded: position x̂ (eigenvalues any real x ∈ ℝ) and momentum p̂.",
             "Physicists use both: bounded for two-level systems, unbounded for continuous degrees of freedom."],
      formula: ["Bounded: ∃M < ∞, ‖Â|ψ⟩‖ ≤ M‖|ψ⟩‖",
                "Unbounded: sup ‖Â|ψ⟩‖/‖|ψ⟩‖ = ∞"],
      summary: "Rule of thumb: finite matrix → bounded. Differential operator → unbounded."
    },
    "LO2-BegUG": {
      body: ["Definition: Â is bounded if ‖Â‖ := sup{‖Â|ψ⟩‖/‖|ψ⟩‖ : |ψ⟩ ≠ 0} < ∞.",
             "Equivalent: Â is bounded iff Â is continuous (linear maps).",
             "Operator norm submultiplicativity: ‖ÂB̂‖ ≤ ‖Â‖‖B̂‖.",
             "Spin operators on ℂ²: ‖σₓ‖ = ‖σᵧ‖ = ‖σᵤ‖ = 1.",
             "Position x̂ on L²([−N,N]): ‖x̂‖ = N → ∞ as N → ∞."],
      formula: ["‖Â‖ = sup{ ‖Â|ψ⟩‖ : ‖|ψ⟩‖ = 1 }",
                "‖σₙ‖ = 1  (bounded)",
                "‖x̂‖ on L²([-N,N]) = N"],
      summary: "Compute ‖σ₃‖ using the definition. Eigenvectors |+⟩, |−⟩: σ₃|±⟩ = ±|±⟩, so ‖σ₃‖ = 1."
    },
    "LO2-AdvUG": {
      body: ["Theorem: A linear map Â: ℋ → ℋ is bounded iff it is continuous.",
             "Proof (→): If ‖Â‖ ≤ M, then ‖Â|ψ⟩ − Â|φ⟩‖ = ‖Â(|ψ⟩−|φ⟩)‖ ≤ M‖|ψ⟩−|φ⟩‖ → 0.",
             "Proof (←): By contradiction — assume ‖Â|ψₙ⟩‖ ≥ n‖|ψₙ⟩‖. Normalise to get a contradiction with continuity.",
             "Hellinger–Toeplitz: if Â is everywhere defined and Hermitian, then Â is bounded.",
             "Consequence: x̂ and p̂ (unbounded) CANNOT be defined on all of L²(ℝ)."],
      formula: ["Bounded ⟺ continuous",
                "Proof via ε-δ argument",
                "Hellinger–Toeplitz theorem"],
      summary: "The Hellinger–Toeplitz theorem shows that genuine physical observables (x̂, p̂, Ĥ) must have restricted domains."
    },
    "LO2-MSc": {
      body: ["The operator norm ‖Â‖ = sup{‖Â|ψ⟩‖ : ‖|ψ⟩‖=1} makes B(ℋ) into a Banach algebra.",
             "Spectral radius formula: r(Â) = lim_{n→∞} ‖Âⁿ‖^{1/n} = sup{|λ| : λ ∈ σ(Â)}.",
             "For self-adjoint Â: ‖Â‖ = r(Â) = sup{|λ| : λ ∈ σ(Â)} (norm = spectral radius).",
             "Compact operators: a special class — limits of finite-rank operators; spectrum is discrete (except 0).",
             "Hilbert–Schmidt operators: ‖Â‖_HS = (Tr Â†Â)^½ < ∞; a subset of compact operators."],
      formula: ["r(Â) = lim ‖Âⁿ‖^{1/n}",
                "Self-adjoint: ‖Â‖ = r(Â)",
                "‖Â‖_HS = √Tr(Â†Â)"],
      summary: "For Hermitian Â: the operator norm equals the spectral radius, which equals the largest |eigenvalue|."
    },
    "LO2-PhD": {
      body: ["Unbounded operators require careful domain specification. Key example: p̂ = −iℏd/dx on L²([0,1]).",
             "Deficiency indices (n₊, n₋): count dimensions of ker(Â* ∓ i).",
             "Self-adjoint extensions exist iff n₊ = n₋.",
             "For p̂ on L²([0,1]): n₊ = n₋ = 1 → one-parameter family of s.a. extensions p̂_θ with boundary conditions ψ(1) = e^{iθ}ψ(0).",
             "Different θ give different physics (different spectra)!"],
      formula: ["n± = dim ker(Â*∓i)",
                "s.a. extension iff n₊ = n₋",
                "p̂_θ: ψ(1) = e^{iθ}ψ(0)"],
      summary: "Von Neumann deficiency index theorem: the space of s.a. extensions is parametrised by U(n₊) when n₊ = n₋ = n."
    },
    // LO3 × all tiers
    "LO3-HS": {
      body: ["The adjoint A† is the 'mirror image' of A in the inner product.",
             "For matrices: A† = conjugate transpose = take transpose, then complex conjugate each entry.",
             "Rule: (A†)ᵢⱼ = (A)ⱼᵢ* (swap row↔col, take complex conjugate).",
             "Example: σ₊ = [[0,1],[0,0]] raises spin. σ₊† = σ₋ = [[0,0],[1,0]] lowers spin.",
             "The adjoint reverses the action: where A raises, A† lowers."],
      formula: ["(A†)ᵢⱼ = (A)ⱼᵢ*",
                "(A†)† = A  (involution)",
                "σ₊† = σ₋"],
      summary: "Quick check: compute [[1+i, 2],[3, 4−i]]†. Answer: [[1−i, 3],[2, 4+i]]."
    },
    "LO3-BegUG": {
      body: ["Definition: A† is the unique operator satisfying ⟨φ|Aψ⟩ = ⟨A†φ|ψ⟩ for all |φ⟩, |ψ⟩.",
             "For n×n matrices: (A†)ᵢⱼ = (A)ⱼᵢ* (conjugate transpose).",
             "Key properties: (i) (A†)† = A; (ii) (AB)† = B†A† (reversal!); (iii) (αA)† = α*A†.",
             "Hermitian: A = A† (real eigenvalues — observables). Anti-Hermitian: A = −A†.",
             "Pauli matrices σₓ, σᵧ, σᵤ are all Hermitian: σᵢ† = σᵢ."],
      formula: ["⟨φ|Aψ⟩ = ⟨A†φ|ψ⟩  (definition)",
                "(AB)† = B†A†  (reversal)",
                "σᵢ† = σᵢ  (Hermitian)"],
      summary: "Prove (AB)† = B†A†: ⟨φ|(AB)ψ⟩ = ⟨A†φ|Bψ⟩ = ⟨B†A†φ|ψ⟩ by applying adjoint definition twice."
    },
    "LO3-AdvUG": {
      body: ["Uniqueness of adjoint: if A† and Ã both satisfy ⟨φ|Aψ⟩ = ⟨A†φ|ψ⟩ = ⟨Ãφ|ψ⟩, then ⟨(A†−Ã)φ|ψ⟩ = 0 for all |ψ⟩, so A† = Ã.",
             "Proof of (A†)† = A: ⟨φ|(A†)†ψ⟩ = ⟨(A†)φ|ψ⟩* by anti-linearity ... (show details).",
             "Decomposition: A = (A+A†)/2 + (A−A†)/2 = A_H + A_AH (unique, A_H Hermitian, A_AH anti-Hermitian).",
             "If A = A†, all eigenvalues real and eigenvectors orthogonal (proved in L03)."],
      formula: ["Uniqueness: ⟨(A†−Ã)φ|ψ⟩=0 ⟹ A†=Ã",
                "A = A_H + A_AH (unique decomp.)",
                "A_H = (A+A†)/2"],
      summary: "Decompose A = [[1+i, 2],[3, 4−i]] into A_H and A_AH. Verify A_H = A_H†, A_AH = −A_AH†."
    },
    "LO3-MSc": {
      body: ["For bounded operators: Â† is the Hilbert space adjoint, related to the Banach adjoint by the Riesz map.",
             "Riesz representation: every f ∈ ℋ* is of the form f = ⟨φ|·⟩ for a unique |φ⟩ ∈ ℋ.",
             "Banach adjoint A*: Y* → X* defined by (A*g)(x) = g(Ax). Coincides with Hilbert adjoint via Riesz map.",
             "For unbounded operators: domain of A† may differ from domain of A (subtle distinction between symmetric and self-adjoint).",
             "Criterion: Â is self-adjoint iff A = A† AND D(Â) = D(A†)."],
      formula: ["Riesz: ℋ ≅ ℋ* (anti-linear iso)",
                "Banach: (A*g)(x) = g(Ax)",
                "D(Â) = D(A†) for self-adjoint"],
      summary: "Theorem: For bounded Â on ℋ, the Hilbert adjoint Â† exists uniquely and ‖Â†‖ = ‖Â‖."
    },
    "LO3-PhD": {
      body: ["Self-adjoint vs. Hermitian: for unbounded Â, 'Hermitian' (symmetric on dense domain) ≠ 'self-adjoint' (Â = Â† with D(Â) = D(A†)).",
             "Von Neumann theory: self-adjoint extensions of symmetric operators classified by deficiency spaces N± = ker(Â* ∓ i).",
             "For p̂ = −iℏd/dx on L²([0,1]) with domain C∞_c(0,1): symmetric but not s.a. — n₊ = n₋ = 1.",
             "Self-adjoint extensions p̂_θ: ψ(1) = e^{iθ}ψ(0), θ ∈ [0,2π).",
             "Physical: different θ = different boundary conditions = different quantum mechanics!"],
      formula: ["Symmetric: D(Â)⊂D(Â†), Â†|_{D}=Â",
                "Self-adjoint: D(Â)=D(Â†)",
                "n± = dim ker(Â*∓i)"],
      summary: "Hellinger–Toeplitz: a symmetric operator with D(Â) = ℋ is automatically bounded. So all unbounded symmetric ops have proper domain."
    },
    // LO4 × all tiers
    "LO4-HS": {
      body: ["HERMITIAN operators (A = A†) always have REAL eigenvalues — perfect for measurement outcomes!",
             "ANTI-HERMITIAN operators (A = −A†) have PURELY IMAGINARY eigenvalues.",
             "UNITARY operators (AA† = 1̂) have eigenvalues ON THE UNIT CIRCLE |λ| = 1.",
             "Examples: σ₃ (Hermitian, λ = ±1); iσ₃ (anti-Hermitian, λ = ±i); e^{iθ} (unitary, |e^{iθ}|=1).",
             "The type of eigenvalue tells you the physical role of the operator."],
      formula: ["Hermitian: λ ∈ ℝ  (observable)",
                "Anti-Hermitian: λ ∈ iℝ  (generator)",
                "Unitary: |λ| = 1  (symmetry)"],
      summary: "Quick classification: compute Aσ₂A† for A arbitrary. Does σ₂ = σ₂†? Eigenvalues: ±1 ∈ ℝ → Hermitian ✓."
    },
    "LO4-BegUG": {
      body: ["Classification of 2×2 operators: given A, compute A† = (A*)ᵀ, then check:",
             "(i) A = A†? → HERMITIAN. Real eigenvalues, orthogonal eigenvectors.",
             "(ii) A = −A†? → ANTI-HERMITIAN. Imaginary eigenvalues. i×(anti-Hermitian) = Hermitian.",
             "(iii) AA† = A†A = 1̂? → UNITARY. Eigenvalues on unit circle, preserves inner products.",
             "(iv) None of the above? → general complex operator.",
             "Every operator decomposes: A = (A+A†)/2 + (A−A†)/2 (Hermitian + anti-Hermitian)."],
      formula: ["A = A†  →  eigenvalues ∈ ℝ",
                "A = −A†  →  eigenvalues ∈ iℝ",
                "AA† = 1̂  →  |eigenvalues| = 1"],
      summary: "Classify: σ₁ (Hermitian), iσ₁ (anti-Hermitian), e^{iθσ₁} (unitary). Verify each classification."
    },
    "LO4-AdvUG": {
      body: ["For finite-dimensional operators, classification by spectrum and adjoint relation:",
             "Hermitian A = A†: all λₙ ∈ ℝ, orthonormal eigenbasis, spectral theorem applies.",
             "Normal operators AA† = A†A: same as Hermitian but eigenvalues can be complex; still diagonalisable.",
             "Unitaries form a group U(n) under composition; Hermitians form a real vector space.",
             "Commutator: if A = A†, B = B†, then i[A,B] is Hermitian (key for quantum mechanics!)."],
      formula: ["Normal: AA† = A†A  (diag'able)",
                "i[A,B] Hermitian if A,B Hermitian",
                "U(n) group, Herm = Lie algebra u(n)"],
      summary: "Prove: if A = A†, B = B†, then i[A,B] = i(AB−BA) is Hermitian. [Check: (i[A,B])† = −i[A,B]† = i[A,B] ✓]"
    },
    "LO4-MSc": {
      body: ["Spectral theorem for bounded self-adjoint operators: A = ∫λ dP(λ) where P is a projection-valued measure.",
             "For normal operators: same but λ ∈ ℂ. Unitary operators: spectrum on S¹.",
             "Fuglede's theorem: if AN = NA* for normal N, then AN* = N*A.",
             "Borel functional calculus: f(A) = ∫f(λ)dP(λ) for any bounded Borel f: σ(A) → ℂ.",
             "Von Neumann algebras: closed under weak limits; generated by spectral projections of self-adjoint operators."],
      formula: ["A = ∫λ dP(λ)  (spectral meas.)",
                "f(A) = ∫f(λ) dP(λ)  (func. calc.)",
                "σ(A) ⊂ ℝ iff A = A†"],
      summary: "The Borel functional calculus extends the spectral theorem: any bounded Borel function of a self-adjoint operator is a well-defined bounded operator."
    },
    "LO4-PhD": {
      body: ["C*-algebra perspective: B(ℋ) is a C*-algebra with involution A ↦ A†, satisfying ‖A†A‖ = ‖A‖².",
             "Gelfand–Naimark: every C*-algebra is ∗-isomorphic to a closed subalgebra of B(ℋ).",
             "GNS construction: from a state ω on a C*-algebra, construct a Hilbert space ℋ_ω and representation.",
             "Tomita–Takesaki: for von Neumann algebras, the modular operator Δ and modular conjugation J classify the algebra.",
             "Physical: KMS states, thermal equilibrium, and quantum statistical mechanics emerge from Tomita–Takesaki."],
      formula: ["C*: ‖A*A‖ = ‖A‖² (identity)",
                "GNS: ω → (ℋ_ω, π_ω, |Ω⟩)",
                "Tomita: JMJ = M' (commutant)"],
      summary: "Every abstract quantum theory (C*-algebra + state) can be concretely realised as operators on a Hilbert space via the GNS construction."
    },
  };

  LOS.forEach((lo, loIdx) => {
    // LO divider slide
    {
      const s = pres.addSlide();
      s.background = { color: C.darkBg };
      s.addShape("rect", { x: 0, y: 2.0, w: 10, h: 1.7, fill: { color: C.panelBg }, line: { color: C.panelBg } });
      s.addText(lo.label, { x: 0.5, y: 2.1, w: 9, h: 0.35, fontSize: 11, color: C.cyan, bold: true, fontFace: "Calibri", charSpacing: 3, align: "center" });
      s.addText(`Learning Objective ${lo.num}: ${lo.short}`, { x: 0.5, y: 2.52, w: 9, h: 0.65, fontSize: 20, color: C.white, bold: true, fontFace: "Cambria", align: "center", valign: "middle" });
      s.addText("5 slides — one per tier (HS / BegUG / AdvUG / MSc / PhD)", {
        x: 0.5, y: 3.25, w: 9, h: 0.3, fontSize: 11, color: C.mutedText, fontFace: "Calibri", align: "center"
      });
    }

    TIERS.forEach((tier, tierIdx) => {
      const key = `${lo.label}-${tier.code}`;
      const content = tierContent[key] || { body: [], formula: [], summary: "" };

      const slide = pres.addSlide();
      slide.background = { color: C.darkBg };

      // Header bar
      slide.addShape("rect", { x: 0, y: 0, w: 10, h: 0.78, fill: { color: C.darkBg2 }, line: { color: C.darkBg2 } });
      tierBadge(slide, tier, 0.3, 0.17, 0.88, 0.42);
      slide.addText(`L01 — ${lo.label}: ${lo.short}  |  ${tier.label} Track`, {
        x: 1.28, y: 0.17, w: 7.6, h: 0.28, fontSize: 13, bold: true, color: C.white, fontFace: "Cambria", valign: "middle"
      });
      slide.addText("The Hilbert Space of Quantum States", {
        x: 1.28, y: 0.48, w: 7.6, h: 0.2, fontSize: 9, color: C.mutedText, fontFace: "Calibri", italic: true
      });
      slide.addShape("rect", { x: 9.38, y: 0.06, w: 0.57, h: 0.28, fill: { color: "1E3A5F" }, line: { color: "1E3A5F" } });
      slide.addText("L01", { x: 9.38, y: 0.06, w: 0.57, h: 0.28, fontSize: 8, bold: true, color: C.adv, fontFace: "Calibri", align: "center", valign: "middle" });

      // Content panel (left: 0.25 to 5.8)
      darkPanel(slide, "CONCEPT EXPLANATION", content.body, 0.25, 0.86, 5.55, 2.85, { titleColor: tier.color });
      formulaBox(slide, content.formula, 0.25, 3.8, 5.55, 0.72);

      // Summary box
      darkPanel(slide, "WORKED EXAMPLE / SUMMARY", [content.summary], 0.25, 4.6, 5.55, 0.95, { titleColor: C.gold });

      // DIAGRAM (right: 6.0 to 9.7)
      const diagFn = diagFunctions[loIdx][tierIdx];
      diagFn(slide, 6.0, 0.86, 3.7, 4.69);

      footer(slide, "QM: Module I.1 — L01", `L01 · ${lo.label} · ${tier.code}`, true);
    });
  });

  // ── SECTION DIVIDER: Special Topic Slides ───────────────────────────
  {
    const s = pres.addSlide();
    s.background = { color: C.darkBg2 };
    s.addShape("rect", { x: 0, y: 2.2, w: 10, h: 1.25, fill: { color: C.panelBg }, line: { color: C.panelBg } });
    s.addText("SECTION B", { x: 0.5, y: 1.5, w: 9, h: 0.4, fontSize: 11, color: C.mutedText, bold: true, fontFace: "Calibri", charSpacing: 4, align: "center" });
    s.addText("Special Topic Slides", { x: 0.5, y: 2.25, w: 9, h: 0.75, fontSize: 28, color: C.white, bold: true, fontFace: "Cambria", align: "center", valign: "middle" });
    s.addText("L01: Advanced Mathematical Foundations — each with diagram\nLebesgue Integration  ·  Banach Spaces  ·  Banach Duality", {
      x: 0.5, y: 3.15, w: 9, h: 0.65, fontSize: 11, color: C.mutedText, fontFace: "Calibri", align: "center"
    });
  }

  buildLebesgueSlide(pres);
  buildBanachSlide(pres);
  buildBanachDualitySlide(pres);

  const outPath = "/home/claude/L01_extra_slides.pptx";
  await pres.writeFile({ fileName: outPath });
  console.log(`✓ Written: ${outPath}`);
}

main().catch(console.error);
