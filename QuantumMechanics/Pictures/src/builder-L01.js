/**
 * builder-L01.js  — Expanded slide deck for L01: Pure/Mixed States & Density Matrix
 *
 * Slide map (28 slides total):
 *  1   Title
 *  2   Lecture Overview
 *  ── LEARNING OBJECTIVES (4 slides, one per outcome, each with a diagram) ──
 *  3   LO1 — Construct ρ̂  (diagram: state taxonomy tree)
 *  4   LO2 — Verify properties  (diagram: property checklist geometry)
 *  5   LO3 — Compute ⟨Â⟩ and purity  (diagram: purity spectrum bar)
 *  6   LO4 — Partial trace  (diagram: bipartite subsystem split)
 *  ── KEY FORMULAS (6 slides, one per formula, each with a diagram) ──
 *  7   F1  — ρ̂ pure state  (diagram: Bloch vector at surface)
 *  8   F2  — ρ̂ mixture  (diagram: mixture as weighted ensemble)
 *  9   F3  — ⟨Â⟩ = Tr(ρ̂Â)  (diagram: trace as diagonal sum loop)
 * 10   F4  — purity γ = Tr(ρ̂²)  (diagram: purity axis)
 * 11   F5  — partial trace  (diagram: bipartite tensor grid)
 * 12   F6  — entanglement entropy  (diagram: entropy vs. entanglement)
 *  ── CONCEPT QUESTIONS (8 slides, one per question, each with a diagram) ──
 * 13   CQ1 — Why ρ̂?  (diagram: ket vs. ensemble distinction)
 * 14   CQ2 — Superposition vs. mixture  (diagram: interference pattern)
 * 15   CQ3 — Three properties  (diagram: property triangle)
 * 16   CQ4 — γ = 0.5 pure?  (diagram: Bloch sphere interior)
 * 17   CQ5 — Partial trace discards info  (diagram: tracing out)
 * 18   CQ6 — Entanglement entropy = 0?  (diagram: product state factorisation)
 * 19   CQ7 — When does Tr reduce?  (diagram: pure state ρ² = ρ)
 * 20   CQ8 — Bloch sphere pure vs. mixed  (diagram: sphere surface vs. interior)
 *  ── TIER DEEP-DIVES (5 slides, one per tier, with diagram) ──
 * 21   HS tier  (diagram: coin-flip probability tree)
 * 22   BegUG tier  (diagram: 2×2 matrix computation flow)
 * 23   AdvUG tier  (diagram: spectral decomposition)
 * 24   MSc tier  (diagram: Schmidt decomposition network)
 * 25   PhD tier  (diagram: operator trace-class hierarchy)
 *  ── CLOSING ──
 * 26   Key Formulas summary
 * 27   Concept Questions
 * 28   Five-Tier Pedagogy + Assessment
 */

"use strict";
const pptxgen = require("pptxgenjs");
const { C, FONT_HEAD, FONT_BODY, FONT_MONO, W, H, TIERS, makeHelpers } = require("./theme");

// ─── Shared drawing utilities ────────────────────────────────────────────────

/** Draw an arrow from (x1,y1) to (x2,y2) using a thin rectangle + triangle head */
function arrow(s, pres, x1, y1, x2, y2, color, width = 0.03) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx*dx + dy*dy);
  const angle = Math.atan2(dy, dx) * 180 / Math.PI;
  // shaft
  s.addShape(pres.shapes.RECTANGLE, {
    x: x1, y: y1 - width/2, w: len, h: width,
    fill:{color}, line:{color},
    rotate: angle,
  });
}

/** Label node: rounded rect + centred text */
function node(s, pres, x, y, w, h, text, bg, fg, fontSize = 9, bold = false) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.07,
    fill:{color: bg}, line:{color: fg, width: 1.2},
  });
  s.addText(text, { x, y, w, h, fontSize, fontFace: FONT_BODY, bold,
    color: fg, align:"center", valign:"middle", margin:0 });
}

/** Horizontal connector line */
function hline(s, pres, x1, y, x2, color, dashed = false) {
  s.addShape(pres.shapes.LINE, {
    x: x1, y, w: x2 - x1, h: 0,
    line:{color, width:1.2, dashType: dashed ? "dash" : "solid"},
  });
}

/** Vertical connector line */
function vline(s, pres, x, y1, y2, color, dashed = false) {
  s.addShape(pres.shapes.LINE, {
    x, y: y1, w: 0, h: y2 - y1,
    line:{color, width:1.2, dashType: dashed ? "dash" : "solid"},
  });
}

/** Small circle with label */
function dot(s, pres, cx, cy, r, fill, label, labelColor, fontSize = 8) {
  s.addShape(pres.shapes.OVAL, {
    x: cx - r, y: cy - r, w: 2*r, h: 2*r,
    fill:{color: fill}, line:{color: fill},
  });
  if (label) {
    s.addText(label, { x: cx - 0.4, y: cy + r + 0.04, w: 0.8, h: 0.2,
      fontSize, fontFace: FONT_BODY, color: labelColor || C.offwhite,
      align:"center", margin:0 });
  }
}

// ─── Section header shared for diagram slides ────────────────────────────────
function diagHeader(s, pres, LCode, sectionTag, title, subtitle, tagColor) {
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:W, h:0.48,
    fill:{color:"0D1B2E"}, line:{color:"0D1B2E"} });
  // Section tag pill
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.18, y:0.07, w:1.1, h:0.24,
    fill:{color: tagColor}, line:{color: tagColor}, rectRadius:0.06 });
  s.addText(sectionTag, { x:0.18, y:0.07, w:1.1, h:0.24,
    fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
    align:"center", valign:"middle", margin:0 });
  s.addText(title, { x:1.38, y:0.05, w:7.5, h:0.26,
    fontSize:14, fontFace:FONT_HEAD, bold:true, color:C.white, margin:0 });
  if (subtitle) {
    s.addText(subtitle, { x:1.38, y:0.3, w:7.5, h:0.15,
      fontSize:8, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0 });
  }
  s.addText(LCode, { x:9.4, y:0.07, w:0.5, h:0.3,
    fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.accent, align:"right", margin:0 });
}

function diagFooter(s, sectionTag, idx) {
  s.addText(`QM: Module I.3 · L01 · ${sectionTag} ${idx}`,
    { x:0.2, y:5.38, w:6, h:0.18, fontSize:7, fontFace:FONT_BODY, color:C.muted, margin:0 });
}

// ─── DIAGRAM BUILDERS ────────────────────────────────────────────────────────

/**
 * LO1 diagram — State taxonomy tree
 * Shows: Quantum State → {Pure (ket |ψ⟩) | Mixed (ρ̂ = Σpᵢ|ψᵢ⟩⟨ψᵢ|)}
 *        Pure → (sub-system? → Reduced density matrix)
 */
function drawLO1Diagram(s, pres, ox, oy, scale = 1) {
  const sc = v => v * scale;
  const nodeW = sc(1.55), nodeH = sc(0.34);

  // Root
  node(s, pres, ox, oy, nodeW, nodeH, "Quantum System", C.accent, C.bg, 9, true);

  // Branch lines
  const bx1 = ox - sc(1.0), bx2 = ox + sc(1.0), by = oy + sc(0.72);
  vline(s, pres, ox + sc(nodeW/2), oy + sc(nodeH), oy + sc(0.54), C.muted);
  hline(s, pres, bx1 + sc(nodeW/2), oy + sc(0.54), bx2 + sc(nodeW/2), C.muted);
  vline(s, pres, bx1 + sc(nodeW/2), oy + sc(0.54), by, C.muted);
  vline(s, pres, bx2 + sc(nodeW/2), oy + sc(0.54), by, C.muted);

  // Pure / Mixed
  node(s, pres, bx1, by, nodeW, nodeH, "Pure State  |ψ⟩", "0D3820", C.begCol, 8.5, true);
  node(s, pres, bx2, by, nodeW, nodeH, "Mixed State  ρ̂", "280D0D", C.phdCol, 8.5, true);

  // Pure → ρ̂ = |ψ⟩⟨ψ|
  vline(s, pres, bx1 + sc(nodeW/2), by + sc(nodeH), by + sc(nodeH + 0.5), C.begCol);
  node(s, pres, bx1, by + sc(nodeH + 0.5), nodeW, nodeH, "ρ̂ = |ψ⟩⟨ψ|   γ=1", "091A0F", C.begCol, 8, false);

  // Mixed → ρ̂ = Σpᵢ|ψᵢ⟩⟨ψᵢ|
  vline(s, pres, bx2 + sc(nodeW/2), by + sc(nodeH), by + sc(nodeH + 0.5), C.phdCol);
  node(s, pres, bx2, by + sc(nodeH + 0.5), nodeW, nodeH, "ρ̂ = Σpᵢ|ψᵢ⟩⟨ψᵢ|   γ<1", "1A0909", C.phdCol, 8, false);

  // Subsystem arrow from mixed
  vline(s, pres, bx2 + sc(nodeW/2), by + sc(nodeH*2 + 0.5), by + sc(nodeH*2 + 1.0), C.mscCol, true);
  node(s, pres, bx2, by + sc(nodeH*2 + 1.0), nodeW, nodeH, "Partial Trace ρ̂_A", "1A0F2A", C.mscCol, 8, false);
}

/**
 * LO2 diagram — Property checklist with geometric shapes
 * Hermitian (self-adjoint arrow), unit trace (normalised circle), positivity (eigenvalue line)
 */
function drawLO2Diagram(s, pres, ox, oy) {
  const propW = 2.6, propH = 1.0, gap = 0.22;
  const props = [
    { label:"Hermitian", sub:"ρ̂† = ρ̂", detail:"Real eigenvalues", color:C.accent, bg:"0D1A2A" },
    { label:"Unit Trace", sub:"Tr(ρ̂) = 1", detail:"Probabilities sum to 1", color:C.teal, bg:"0D1E1D" },
    { label:"Positive Semi-def.", sub:"ρ̂ ≥ 0", detail:"All eigenvalues λᵢ ≥ 0", color:C.begCol, bg:"0D1E10" },
  ];
  const totalW = props.length * propW + (props.length-1) * gap;
  let px = ox + (5.5 - totalW) / 2;

  for (const p of props) {
    // Card
    s.addShape(pres.shapes.RECTANGLE, { x:px, y:oy, w:propW, h:propH,
      fill:{color:p.bg}, line:{color:p.color, width:2} });
    // Top accent strip
    s.addShape(pres.shapes.RECTANGLE, { x:px, y:oy, w:propW, h:0.07,
      fill:{color:p.color}, line:{color:p.color} });
    s.addText(p.label, { x:px, y:oy+0.1, w:propW, h:0.22,
      fontSize:10, fontFace:FONT_HEAD, bold:true, color:p.color, align:"center", margin:0 });
    s.addText(p.sub, { x:px, y:oy+0.35, w:propW, h:0.26,
      fontSize:13, fontFace:FONT_MONO, color:C.white, align:"center", margin:0 });
    s.addText(p.detail, { x:px, y:oy+0.66, w:propW, h:0.22,
      fontSize:8.5, fontFace:FONT_BODY, color:C.muted, align:"center", italic:true, margin:0 });
    px += propW + gap;
  }

  // Implication arrow: all three → ρ̂ valid density operator
  const midX = ox + (5.5) / 2 - 0.2;
  vline(s, pres, midX, oy + propH, oy + propH + 0.36, C.gold);
  node(s, pres, midX - 1.4, oy + propH + 0.36, 2.8, 0.34,
    "Valid Density Operator ρ̂", "201700", C.gold, 9, true);
}

/**
 * LO3 diagram — Purity spectrum: a horizontal bar from γ=0 to γ=1
 * with labelled regions and a bloch sphere cross-section hint
 */
function drawLO3Diagram(s, pres, ox, oy) {
  // Full panel width available ≈ 3.9" — keep everything inside it
  const barW = 3.0, barH = 0.34;
  const bx = ox + 0.3;  // slight left indent for γ=0 label

  // Purity bar background
  s.addShape(pres.shapes.RECTANGLE, { x:bx, y:oy+0.32, w:barW, h:barH,
    fill:{color:"1A2850"}, line:{color:C.muted, width:1} });

  // Labels
  s.addText("γ = 0", { x:bx-0.42, y:oy+0.37, w:0.4, h:0.22,
    fontSize:8, fontFace:FONT_MONO, color:C.muted, align:"right", margin:0 });
  s.addText("γ = 1", { x:bx+barW+0.04, y:oy+0.37, w:0.4, h:0.22,
    fontSize:8, fontFace:FONT_MONO, color:C.white, align:"left", margin:0 });
  s.addText("Purity  γ = Tr(ρ̂²)", { x:bx, y:oy+0.04, w:barW, h:0.24,
    fontSize:10, fontFace:FONT_MONO, bold:true, color:C.gold, align:"center", margin:0 });

  // Tick marks + labels
  const ticks = [
    { frac:0,   label:"Max mixed\n(1/d)·I", color:C.phdCol },
    { frac:0.5, label:"Partial\nmixture",   color:C.mscCol },
    { frac:1.0, label:"Pure\nstate",        color:C.begCol },
  ];
  for (const t of ticks) {
    const tx = bx + t.frac * barW;
    s.addShape(pres.shapes.LINE, { x:tx, y:oy+0.32+barH, w:0, h:0.16,
      line:{color:t.color, width:1.8} });
    s.addShape(pres.shapes.OVAL, { x:tx-0.07, y:oy+0.42, w:0.14, h:0.14,
      fill:{color:t.color}, line:{color:t.color} });
    s.addText(t.label, { x:tx-0.46, y:oy+0.32+barH+0.18, w:0.92, h:0.34,
      fontSize:7.5, fontFace:FONT_BODY, color:t.color, align:"center", margin:0 });
  }

  // Bloch sphere cross-section below — fits within ~3.6" wide space
  const cx = bx + barW/2, cy = oy + 1.7;
  const r = 0.72;
  s.addShape(pres.shapes.OVAL, { x:cx-r, y:cy-r, w:2*r, h:2*r,
    fill:{color:"0D1A2A"}, line:{color:C.muted, width:1.2} });
  // equator dashes
  s.addShape(pres.shapes.OVAL, { x:cx-r, y:cy-r*0.18, w:2*r, h:r*0.36,
    fill:{color:"0D1A2A"}, line:{color:C.muted, width:0.8, dashType:"dash"} });
  // vertical axis
  s.addShape(pres.shapes.LINE, { x:cx, y:cy-r-0.1, w:0, h:2*r+0.2,
    line:{color:C.muted, width:0.8, dashType:"dash"} });
  // Pure state dot on surface
  s.addShape(pres.shapes.OVAL, { x:cx+r*0.52-0.07, y:cy-r*0.7-0.07, w:0.14, h:0.14,
    fill:{color:C.begCol}, line:{color:C.begCol} });
  s.addShape(pres.shapes.LINE, { x:cx, y:cy, w:r*0.52, h:-r*0.7,
    line:{color:C.begCol, width:1.8} });
  s.addText("|r|=1 pure", { x:cx+r*0.52+0.04, y:cy-r*0.7-0.14, w:0.88, h:0.28,
    fontSize:7.5, fontFace:FONT_BODY, bold:true, color:C.begCol, margin:0 });
  // Mixed state dot inside
  s.addShape(pres.shapes.OVAL, { x:cx-0.07, y:cy+0.15, w:0.14, h:0.14,
    fill:{color:C.phdCol}, line:{color:C.phdCol} });
  s.addShape(pres.shapes.LINE, { x:cx, y:cy, w:0, h:0.22,
    line:{color:C.phdCol, width:1.5, dashType:"dash"} });
  s.addText("|r|<1 mixed", { x:cx+0.1, y:cy+0.18, w:0.88, h:0.28,
    fontSize:7.5, fontFace:FONT_BODY, bold:true, color:C.phdCol, margin:0 });
  s.addText("Bloch sphere  (d=2)", { x:cx-r, y:cy+r+0.08, w:2*r, h:0.2,
    fontSize:7, fontFace:FONT_BODY, color:C.muted, align:"center", italic:true, margin:0 });
}

/**
 * LO4 diagram — Bipartite system AB → partial trace over B → ρ̂_A
 */
function drawLO4Diagram(s, pres, ox, oy) {
  const bW = 2.4, bH = 1.5;
  // Full system box
  s.addShape(pres.shapes.RECTANGLE, { x:ox, y:oy, w:bW*2 + 0.06, h:bH,
    fill:{color:"0D1A2A"}, line:{color:C.accent, width:1.5} });
  s.addText("ρ̂_AB", { x:ox, y:oy-0.28, w:bW*2+0.06, h:0.24,
    fontSize:10, fontFace:FONT_MONO, bold:true, color:C.accent, align:"center", margin:0 });
  // Subsystem A
  s.addShape(pres.shapes.RECTANGLE, { x:ox, y:oy, w:bW, h:bH,
    fill:{color:"0D1E1D"}, line:{color:C.teal, width:2} });
  s.addText("A", { x:ox, y:oy, w:bW, h:bH,
    fontSize:28, fontFace:FONT_HEAD, bold:true, color:C.teal, align:"center", valign:"middle", margin:0 });
  // Subsystem B
  s.addShape(pres.shapes.RECTANGLE, { x:ox+bW+0.06, y:oy, w:bW, h:bH,
    fill:{color:"1A0D10"}, line:{color:C.phdCol, width:2} });
  s.addText("B", { x:ox+bW+0.06, y:oy, w:bW, h:bH,
    fontSize:28, fontFace:FONT_HEAD, bold:true, color:C.phdCol, align:"center", valign:"middle", margin:0 });

  // Arrow: Tr_B →
  const ax = ox + bW*2 + 0.06 + 0.1;
  s.addShape(pres.shapes.LINE, { x:ax, y:oy+bH/2, w:0.75, h:0,
    line:{color:C.gold, width:2} });
  s.addText("Tr_B", { x:ax, y:oy+bH/2+0.04, w:0.75, h:0.22,
    fontSize:8, fontFace:FONT_MONO, color:C.gold, align:"center", margin:0 });

  // Result box ρ̂_A
  const rx = ax + 0.78;
  s.addShape(pres.shapes.RECTANGLE, { x:rx, y:oy+0.3, w:bW*0.75, h:bH-0.6,
    fill:{color:"0D1E1D"}, line:{color:C.teal, width:2} });
  s.addText("ρ̂_A", { x:rx, y:oy+0.3, w:bW*0.75, h:bH-0.6,
    fontSize:20, fontFace:FONT_MONO, bold:true, color:C.teal, align:"center", valign:"middle", margin:0 });

  // Labels
  s.addText("Discard B → reduced state of A", {
    x:ox, y:oy+bH+0.08, w:bW*2+0.06, h:0.2,
    fontSize:8, fontFace:FONT_BODY, color:C.muted, align:"center", italic:true, margin:0 });
}

/**
 * F1 diagram — Bloch sphere: pure state on surface
 */
function drawF1Diagram(s, pres, ox, oy) {
  const r = 0.9;
  const cx = ox + r + 0.1, cy = oy + r + 0.15;
  // sphere circle
  s.addShape(pres.shapes.OVAL, { x:cx-r, y:cy-r, w:2*r, h:2*r,
    fill:{color:"0D1A2A"}, line:{color:C.muted, width:1.2} });
  // equator ellipse (horizontal dashed)
  s.addShape(pres.shapes.OVAL, { x:cx-r, y:cy-r*0.22, w:2*r, h:r*0.44,
    fill:{color:"transparent", transparency:100}, line:{color:C.muted, width:0.8, dashType:"dash"} });
  // vertical axis
  vline(s, pres, cx, cy-r-0.12, cy+r+0.1, C.muted, true);
  // Bloch vector: arrow to north-ish surface point
  const vx = cx + r*0.42, vy = cy - r*0.78;
  s.addShape(pres.shapes.LINE, { x:cx, y:cy, w:vx-cx, h:vy-cy,
    line:{color:C.accent, width:2.5} });
  s.addShape(pres.shapes.OVAL, { x:vx-0.07, y:vy-0.07, w:0.14, h:0.14,
    fill:{color:C.accent}, line:{color:C.accent} });
  // labels
  s.addText("|ψ⟩", { x:vx+0.06, y:vy-0.14, w:0.5, h:0.22,
    fontSize:9, fontFace:FONT_MONO, color:C.accent, margin:0 });
  s.addText("r = 1\n(pure)", { x:cx+r+0.04, y:cy-0.2, w:0.65, h:0.36,
    fontSize:7.5, fontFace:FONT_BODY, color:C.begCol, margin:0 });
  s.addText("|0⟩", { x:cx-0.2, y:cy-r-0.24, w:0.4, h:0.2,
    fontSize:8, fontFace:FONT_MONO, color:C.muted, align:"center", margin:0 });
  s.addText("|1⟩", { x:cx-0.2, y:cy+r+0.04, w:0.4, h:0.2,
    fontSize:8, fontFace:FONT_MONO, color:C.muted, align:"center", margin:0 });
}

/**
 * F2 diagram — Mixture as weighted ensemble of pure states
 */
function drawF2Diagram(s, pres, ox, oy) {
  const items = [
    { label:"|ψ₁⟩", weight:"p₁", color:C.accent },
    { label:"|ψ₂⟩", weight:"p₂", color:C.teal },
    { label:"|ψ₃⟩", weight:"p₃", color:C.mscCol },
  ];
  const iW = 1.05, iH = 0.84, gap = 0.2;
  const totalW = items.length * iW + (items.length-1)*gap;  // 3.55"
  let ix = ox + (3.6 - totalW)/2;

  for (const item of items) {
    // Probability weight oval
    s.addShape(pres.shapes.OVAL, { x:ix + iW/2 - 0.22, y:oy, w:0.44, h:0.32,
      fill:{color:item.color, transparency:30}, line:{color:item.color, width:1.5} });
    s.addText(item.weight, { x:ix + iW/2 - 0.22, y:oy, w:0.44, h:0.32,
      fontSize:9, fontFace:FONT_MONO, bold:true, color:item.color, align:"center", valign:"middle", margin:0 });
    // Line to state box
    vline(s, pres, ix + iW/2, oy + 0.32, oy + 0.58, item.color);
    // State box
    node(s, pres, ix, oy + 0.58, iW, iH, item.label, "0D1A2A", item.color, 12, true);
    ix += iW + gap;
  }

  // Plus signs between
  const baseX = ox + (3.6 - totalW)/2;
  s.addText("+", { x:baseX + iW + gap/2 - 0.12, y:oy + 0.9, w:0.24, h:0.28,
    fontSize:14, fontFace:FONT_HEAD, color:C.gold, align:"center", margin:0 });
  s.addText("+", { x:baseX + 2*(iW + gap) - gap/2 - 0.12, y:oy + 0.9, w:0.24, h:0.28,
    fontSize:14, fontFace:FONT_HEAD, color:C.gold, align:"center", margin:0 });

  // Result arrow + ρ̂
  const midX = ox + 3.6/2;
  const by = oy + 0.58 + iH + 0.14;
  vline(s, pres, midX, oy + 0.58 + iH, by, C.gold);
  node(s, pres, midX - 1.1, by, 2.2, 0.36, "ρ̂ = Σ pᵢ|ψᵢ⟩⟨ψᵢ|", "201700", C.gold, 8.5, true);
}

/**
 * F3 diagram — Trace as sum of diagonal elements loop
 */
function drawF3Diagram(s, pres, ox, oy) {
  // 3×3 matrix schematic
  const cellSize = 0.5, n = 3;
  const labels = [
    ["ρ₁₁A₁₁","ρ₁₂A₂₁","ρ₁₃A₃₁"],
    ["ρ₂₁A₁₂","ρ₂₂A₂₂","ρ₂₃A₃₂"],
    ["ρ₃₁A₁₃","ρ₃₂A₂₃","ρ₃₃A₃₃"],
  ];
  const diag = [[0,0],[1,1],[2,2]];

  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      const isDiag = r === c;
      s.addShape(pres.shapes.RECTANGLE, {
        x: ox + c*cellSize, y: oy + r*cellSize, w: cellSize, h: cellSize,
        fill:{color: isDiag ? "1A2040" : "0D1117"},
        line:{color: isDiag ? C.accent : C.muted, width: isDiag ? 2 : 0.8},
      });
      s.addText(isDiag ? `ρ${r+1}${r+1}·A${r+1}${r+1}` : "·", {
        x: ox + c*cellSize, y: oy + r*cellSize, w: cellSize, h: cellSize,
        fontSize: isDiag ? 7 : 9, fontFace: FONT_MONO,
        color: isDiag ? C.accent : "3A4A5A", align:"center", valign:"middle", margin:0,
      });
    }
  }

  // Diagonal brace annotation
  s.addText("Σ diagonal =\n⟨Â⟩ = Tr(ρ̂Â)", {
    x: ox + n*cellSize + 0.14, y: oy + 0.35, w: 2.1, h: 0.72,
    fontSize:9.5, fontFace:FONT_BODY, color:C.offwhite, margin:0,
  });
  // bracket line along diagonal
  for (let i = 0; i < n; i++) {
    s.addShape(pres.shapes.LINE, {
      x: ox + i*cellSize + cellSize - 0.03, y: oy + i*cellSize + 0.03, w: 0.18, h: 0,
      line:{color:C.accent, width:1.5},
    });
  }
}

/**
 * F4 diagram — Purity axis with labelled points
 */
function drawF4Diagram(s, pres, ox, oy) {
  const axW = 5.0;
  // axis line
  s.addShape(pres.shapes.LINE, { x:ox, y:oy+0.25, w:axW, h:0,
    line:{color:C.muted, width:2} });

  const pts = [
    { frac:0,   label:"1/d", sub:"Maximally\nmixed", color:C.phdCol },
    { frac:0.5, label:"0.5", sub:"Partial\nmixture", color:C.mscCol },
    { frac:1.0, label:"1",   sub:"Pure\nstate",      color:C.begCol },
  ];
  for (const p of pts) {
    const px = ox + p.frac * axW;
    s.addShape(pres.shapes.LINE, { x:px, y:oy+0.1, w:0, h:0.3,
      line:{color:p.color, width:2} });
    s.addShape(pres.shapes.OVAL, { x:px-0.1, y:oy+0.16, w:0.2, h:0.2,
      fill:{color:p.color}, line:{color:p.color} });
    s.addText(`γ=${p.label}`, { x:px-0.4, y:oy-0.18, w:0.8, h:0.22,
      fontSize:8, fontFace:FONT_MONO, bold:true, color:p.color, align:"center", margin:0 });
    s.addText(p.sub, { x:px-0.5, y:oy+0.44, w:1.0, h:0.36,
      fontSize:7.5, fontFace:FONT_BODY, color:p.color, align:"center", margin:0 });
  }
  s.addText("γ = Tr(ρ̂²)", { x:ox+axW/2-0.6, y:oy-0.46, w:1.2, h:0.22,
    fontSize:10, fontFace:FONT_MONO, bold:true, color:C.gold, align:"center", margin:0 });
}

/**
 * F5 diagram — Bipartite tensor grid showing partial trace columns summed
 */
function drawF5Diagram(s, pres, ox, oy) {
  const cW = 0.55, cH = 0.48, nA = 3, nB = 3;
  for (let a = 0; a < nA; a++) {
    for (let b = 0; b < nB; b++) {
      const traced = (b === 1); // illustrate summing over b column
      s.addShape(pres.shapes.RECTANGLE, {
        x: ox + b*cW, y: oy + a*cH, w: cW, h: cH,
        fill:{color: traced ? "1A1A35" : "0D1117"},
        line:{color: traced ? C.mscCol : C.muted, width: traced ? 1.8 : 0.6},
      });
      s.addText(`${a+1}${b+1}`, { x:ox+b*cW, y:oy+a*cH, w:cW, h:cH,
        fontSize:7.5, fontFace:FONT_MONO,
        color: traced ? C.mscCol : "3A4A5A", align:"center", valign:"middle", margin:0 });
    }
    // Row label (A index)
    s.addText(`a=${a+1}`, { x:ox + nB*cW + 0.08, y:oy+a*cH+0.12, w:0.4, h:0.24,
      fontSize:7, fontFace:FONT_MONO, color:C.teal, margin:0 });
  }
  // B-index labels
  for (let b = 0; b < nB; b++) {
    s.addText(`b=${b+1}`, { x:ox+b*cW, y:oy-0.24, w:cW, h:0.22,
      fontSize:7, fontFace:FONT_MONO, color:C.phdCol, align:"center", margin:0 });
  }
  // Summation arrow
  s.addShape(pres.shapes.LINE, { x:ox+nB*cW+0.55, y:oy+nA*cH/2, w:0.7, h:0,
    line:{color:C.gold, width:2} });
  s.addText("Σ_b →", { x:ox+nB*cW+0.55, y:oy+nA*cH/2+0.05, w:0.7, h:0.22,
    fontSize:7.5, fontFace:FONT_MONO, color:C.gold, margin:0 });

  // ρ̂_A box
  const rx = ox + nB*cW + 1.38;
  s.addShape(pres.shapes.RECTANGLE, { x:rx, y:oy, w:cW*nA*0.7, h:cH*nA,
    fill:{color:"0D1E1D"}, line:{color:C.teal, width:2} });
  s.addText("ρ̂_A", { x:rx, y:oy, w:cW*nA*0.7, h:cH*nA,
    fontSize:14, fontFace:FONT_MONO, bold:true, color:C.teal, align:"center", valign:"middle", margin:0 });
}

/**
 * F6 diagram — Entanglement entropy S vs. state purity
 * Bar chart: product state S=0, partial entanglement, max entanglement S=log(d)
 */
function drawF6Diagram(s, pres, ox, oy) {
  const bars = [
    { label:"Product\nstate", S:"S = 0", height:0.05, color:C.begCol },
    { label:"Partial\nentanglement", S:"0 < S < log d", height:0.65, color:C.mscCol },
    { label:"Maximally\nentangled", S:"S = log d", height:1.1, color:C.phdCol },
  ];
  const bW = 1.0, gap = 0.5, axH = 1.2;
  const totalW = bars.length * bW + (bars.length-1)*gap;
  let bx = ox + (4.5 - totalW)/2;

  // Axis
  s.addShape(pres.shapes.LINE, { x:bx-0.1, y:oy+axH, w:totalW+0.3, h:0,
    line:{color:C.muted, width:1.5} });
  s.addShape(pres.shapes.LINE, { x:bx-0.1, y:oy, w:0, h:axH+0.05,
    line:{color:C.muted, width:1.5} });
  s.addText("S", { x:bx-0.32, y:oy-0.1, w:0.22, h:0.22,
    fontSize:9, fontFace:FONT_MONO, color:C.muted, margin:0 });

  for (const b of bars) {
    const bh = b.height === 0.05 ? 0.05 : b.height;
    s.addShape(pres.shapes.RECTANGLE, {
      x:bx, y:oy + axH - bh, w:bW, h:bh,
      fill:{color:b.color, transparency:20}, line:{color:b.color, width:1.5},
    });
    s.addText(b.S, { x:bx-0.1, y:oy + axH - bh - 0.22, w:bW+0.2, h:0.22,
      fontSize:7.5, fontFace:FONT_MONO, bold:true, color:b.color, align:"center", margin:0 });
    s.addText(b.label, { x:bx-0.1, y:oy+axH+0.06, w:bW+0.2, h:0.36,
      fontSize:7, fontFace:FONT_BODY, color:b.color, align:"center", margin:0 });
    bx += bW + gap;
  }
  s.addText("S = −Tr(ρ̂_A ln ρ̂_A)", { x:ox, y:oy-0.3, w:4.5, h:0.22,
    fontSize:9.5, fontFace:FONT_MONO, bold:true, color:C.gold, align:"center", margin:0 });
}

// ─── CQ diagrams (compact, right-panel style) ────────────────────────────────

function drawCQ1Diagram(s, pres, ox, oy) {
  // ket → one outcome vs. ρ̂ → classical ignorance
  node(s, pres, ox, oy, 2.2, 0.38, "Unknown prep.", "1A1A2A", C.muted, 9, true);
  // Branch: ket vs ρ̂
  vline(s, pres, ox+1.1, oy+0.38, oy+0.68, C.muted);
  hline(s, pres, ox+0.2, oy+0.68, ox+2.0, C.muted);
  vline(s, pres, ox+0.2, oy+0.68, oy+0.98, C.accent);
  vline(s, pres, ox+2.0, oy+0.68, oy+0.98, C.phdCol);
  node(s, pres, ox-0.05, oy+0.98, 0.8, 0.34, "|ψ⟩\n(pure)", "0D1E1D", C.begCol, 7.5, false);
  node(s, pres, ox+1.5, oy+0.98, 0.8, 0.34, "ρ̂\n(mixed)", "1A0909", C.phdCol, 7.5, false);
  s.addText("Quantum\ncoherence", { x:ox-0.05, y:oy+1.38, w:0.8, h:0.32, fontSize:7,
    fontFace:FONT_BODY, color:C.muted, align:"center", margin:0 });
  s.addText("Classical\nignorance", { x:ox+1.5, y:oy+1.38, w:0.8, h:0.32, fontSize:7,
    fontFace:FONT_BODY, color:C.muted, align:"center", margin:0 });
}

function drawCQ2Diagram(s, pres, ox, oy) {
  // Interference vs. no interference
  const labels = [
    {l:"Superposition", sub:"|↑⟩+|↓⟩)/√2", note:"Cross term 2Re(A₁*A₂) ≠ 0", color:C.accent},
    {l:"Mixture", sub:"p↑|↑⟩⟨↑|+p↓|↓⟩⟨↓|", note:"No cross term — no interference", color:C.phdCol},
  ];
  let ly = oy;
  for (const lb of labels) {
    s.addShape(pres.shapes.RECTANGLE, { x:ox, y:ly, w:3.4, h:0.82,
      fill:{color:"0D1A2A"}, line:{color:lb.color, width:1.5} });
    s.addText(lb.l, { x:ox+0.1, y:ly+0.04, w:3.2, h:0.22,
      fontSize:9.5, fontFace:FONT_HEAD, bold:true, color:lb.color, margin:0 });
    s.addText(lb.sub, { x:ox+0.1, y:ly+0.28, w:3.2, h:0.22,
      fontSize:8.5, fontFace:FONT_MONO, color:C.white, margin:0 });
    s.addText(lb.note, { x:ox+0.1, y:ly+0.54, w:3.2, h:0.2,
      fontSize:7.5, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0 });
    ly += 0.92 + 0.12;
  }
}

function drawCQ3Diagram(s, pres, ox, oy) {
  // Triangle: 3 vertices = 3 properties
  const verts = [
    { x:ox+1.2, y:oy+0.1, label:"Hermitian\nρ̂†=ρ̂", color:C.accent },
    { x:ox+0.1, y:oy+1.7, label:"Unit trace\nTr=1",  color:C.teal },
    { x:ox+2.3, y:oy+1.7, label:"Positive\nρ̂≥0",   color:C.begCol },
  ];
  // edges
  for (let i = 0; i < 3; i++) {
    const a = verts[i], b = verts[(i+1)%3];
    s.addShape(pres.shapes.LINE, { x:a.x+0.12, y:a.y+0.12, w:b.x-a.x, h:b.y-a.y,
      line:{color:C.muted, width:1.2} });
  }
  // vertices
  for (const v of verts) {
    s.addShape(pres.shapes.OVAL, { x:v.x, y:v.y, w:0.24, h:0.24,
      fill:{color:v.color}, line:{color:v.color} });
    s.addText(v.label, { x:v.x-0.35, y:v.y+0.26, w:0.94, h:0.36,
      fontSize:7.5, fontFace:FONT_BODY, bold:true, color:v.color, align:"center", margin:0 });
  }
  // centre label
  s.addText("Valid ρ̂", { x:ox+0.8, y:oy+0.9, w:1.0, h:0.26,
    fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.gold, align:"center", margin:0 });
}

function drawCQ4Diagram(s, pres, ox, oy) {
  // Bloch sphere cross-section with γ = 0.5 point inside
  const cx = ox + 1.0, cy = oy + 1.0, r = 0.85;
  s.addShape(pres.shapes.OVAL, { x:cx-r, y:cy-r, w:2*r, h:2*r,
    fill:{color:"0D1A2A"}, line:{color:C.muted, width:1.5} });
  // γ=1 surface arc label
  s.addText("γ=1 (surface)", { x:cx-r-0.05, y:cy-r-0.24, w:2*r+0.1, h:0.22,
    fontSize:7.5, fontFace:FONT_BODY, color:C.begCol, align:"center", margin:0 });
  // γ=0 centre label
  s.addText("γ=1/d (centre)", { x:cx-0.5, y:cy+r+0.06, w:1.0, h:0.22,
    fontSize:7.5, fontFace:FONT_BODY, color:C.phdCol, align:"center", margin:0 });
  // Point at γ=0.5 (halfway)
  const px = cx + 0.0, py = cy - r*0.5;
  s.addShape(pres.shapes.OVAL, { x:px-0.1, y:py-0.1, w:0.2, h:0.2,
    fill:{color:C.mscCol}, line:{color:C.mscCol} });
  s.addText("γ=0.5\nMIXED", { x:px+0.14, y:py-0.16, w:0.8, h:0.36,
    fontSize:8, fontFace:FONT_BODY, bold:true, color:C.mscCol, margin:0 });
  // Label above sphere
  s.addText("FALSE — Mixed", { x:cx-0.65, y:oy-0.22, w:1.3, h:0.2,
    fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.phdCol, align:"center", margin:0 });
}

function drawCQ5Diagram(s, pres, ox, oy) { drawLO4Diagram(s, pres, ox, oy); }

function drawCQ6Diagram(s, pres, ox, oy) {
  // Product state: ρ̂_AB = ρ̂_A ⊗ ρ̂_B → S = 0
  node(s, pres, ox, oy, 1.4, 0.36, "ρ̂_A", "0D1E1D", C.teal, 13, true);
  s.addText("⊗", { x:ox+1.45, y:oy+0.04, w:0.3, h:0.28,
    fontSize:14, fontFace:FONT_HEAD, color:C.gold, align:"center", margin:0 });
  node(s, pres, ox+1.8, oy, 1.4, 0.36, "ρ̂_B", "1A0D10", C.phdCol, 13, true);
  vline(s, pres, ox+1.6, oy+0.36, oy+0.66, C.muted);
  node(s, pres, ox+0.4, oy+0.66, 2.4, 0.36, "ρ̂_AB = ρ̂_A ⊗ ρ̂_B", "0D1A2A", C.accent, 9.5, true);
  vline(s, pres, ox+1.6, oy+1.02, oy+1.32, C.gold);
  node(s, pres, ox+0.6, oy+1.32, 2.0, 0.36, "S = 0  (no entanglement)", "201700", C.gold, 9, true);
}

function drawCQ7Diagram(s, pres, ox, oy) {
  // ρ̂² = ρ̂ iff pure: show idempotent property
  const pW = 2.8, pH = 0.38;
  node(s, pres, ox, oy, pW, pH, "Pure: ρ̂² = ρ̂   (idempotent)", "0D1E1D", C.begCol, 9, true);
  vline(s, pres, ox+pW/2, oy+pH, oy+pH+0.3, C.muted);
  node(s, pres, ox, oy+pH+0.3, pW, pH, "Tr(ρ̂Â) = ⟨ψ|Â|ψ⟩", "0D1A2A", C.accent, 9, true);
  vline(s, pres, ox+pW/2, oy+2*pH+0.3, oy+2*pH+0.6, C.muted);
  node(s, pres, ox, oy+2*pH+0.6, pW, pH, "Mixed: ρ̂² ≠ ρ̂   (not idempotent)", "1A0D1A", C.phdCol, 9, true);
  vline(s, pres, ox+pW/2, oy+3*pH+0.6, oy+3*pH+0.9, C.muted);
  node(s, pres, ox, oy+3*pH+0.9, pW, pH, "Tr(ρ̂Â) ≠ ⟨ψ|Â|ψ⟩ for any |ψ⟩", "0D1A2A", C.muted, 9, false);
}

function drawCQ8Diagram(s, pres, ox, oy) {
  // Bloch sphere: surface point (pure) vs interior (mixed)
  const cx = ox+1.0, cy = oy+1.0, r = 0.85;
  s.addShape(pres.shapes.OVAL, { x:cx-r, y:cy-r, w:2*r, h:2*r,
    fill:{color:"0D1A2A"}, line:{color:C.muted, width:1.5} });
  // Pure: on surface
  const psx = cx + r*0.6, psy = cy - r*0.6;
  s.addShape(pres.shapes.OVAL, { x:psx-0.09, y:psy-0.09, w:0.18, h:0.18,
    fill:{color:C.begCol}, line:{color:C.begCol} });
  s.addShape(pres.shapes.LINE, { x:cx, y:cy, w:psx-cx, h:psy-cy,
    line:{color:C.begCol, width:1.5} });
  s.addText("|r|=1\nPure", { x:psx+0.1, y:psy-0.2, w:0.65, h:0.36,
    fontSize:7.5, fontFace:FONT_BODY, bold:true, color:C.begCol, margin:0 });
  // Mixed: interior
  s.addShape(pres.shapes.OVAL, { x:cx-0.08, y:cy+0.2, w:0.16, h:0.16,
    fill:{color:C.phdCol}, line:{color:C.phdCol} });
  s.addShape(pres.shapes.LINE, { x:cx, y:cy, w:0, h:0.28,
    line:{color:C.phdCol, width:1.5, dashType:"dash"} });
  s.addText("|r|<1\nMixed", { x:cx+0.1, y:cy+0.3, w:0.65, h:0.36,
    fontSize:7.5, fontFace:FONT_BODY, bold:true, color:C.phdCol, margin:0 });
}

// ─── Tier diagram builders ────────────────────────────────────────────────────

function drawTierHS(s, pres, ox, oy) {
  // Probability tree: coin flip (classical) vs quantum superposition
  const labels = [
    { x:ox, y:oy, text:"Coin flip\n(classical)", color:C.muted },
    { x:ox+2.4, y:oy, text:"Quantum\nsuperposition", color:C.accent },
  ];
  for (const lb of labels) {
    node(s, pres, lb.x, lb.y, 1.8, 0.52, lb.text, "0D1A2A", lb.color, 9.5, true);
    // branches
    vline(s, pres, lb.x+0.9, lb.y+0.52, lb.y+0.82, lb.color);
    hline(s, pres, lb.x+0.3, lb.y+0.82, lb.x+1.5, lb.color);
    vline(s, pres, lb.x+0.3, lb.y+0.82, lb.y+1.12, lb.color);
    vline(s, pres, lb.x+1.5, lb.y+0.82, lb.y+1.12, lb.color);
  }
  // Coin outcomes
  node(s, pres, ox+0.0, oy+1.12, 0.7, 0.34, "H\np=½", "201007", C.gold, 8.5, false);
  node(s, pres, ox+1.1, oy+1.12, 0.7, 0.34, "T\np=½", "201007", C.gold, 8.5, false);
  // Quantum outcomes
  node(s, pres, ox+2.4, oy+1.12, 0.7, 0.34, "|0⟩\nα", "0D1E35", C.accent, 8.5, false);
  node(s, pres, ox+3.5, oy+1.12, 0.7, 0.34, "|1⟩\nβ", "0D1E35", C.accent, 8.5, false);
  // Key difference
  s.addShape(pres.shapes.RECTANGLE, { x:ox, y:oy+1.6, w:4.5, h:0.38,
    fill:{color:"201700"}, line:{color:C.gold, width:1.5} });
  s.addText("Quantum: |α|²+|β|²=1 AND cross-terms (interference) exist", {
    x:ox+0.1, y:oy+1.64, w:4.3, h:0.3,
    fontSize:8.5, fontFace:FONT_BODY, color:C.gold, margin:0 });
}

function drawTierBegUG(s, pres, ox, oy) {
  // 2×2 matrix computation flow
  const mW = 1.3, mH = 1.3;
  // ρ̂ matrix schematic
  s.addShape(pres.shapes.RECTANGLE, { x:ox, y:oy, w:mW, h:mH,
    fill:{color:"0D1A2A"}, line:{color:C.accent, width:1.5} });
  const cells2 = [["ρ₁₁","ρ₁₂"],["ρ₂₁","ρ₂₂"]];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) {
    s.addText(cells2[r][c], {
      x: ox + c*mW/2, y: oy + r*mH/2, w: mW/2, h: mH/2,
      fontSize:9, fontFace:FONT_MONO, color: r===c ? C.accent : C.muted,
      align:"center", valign:"middle", margin:0 });
  }
  s.addText("ρ̂", { x:ox+mW/2-0.15, y:oy-0.28, w:0.3, h:0.24,
    fontSize:11, fontFace:FONT_MONO, bold:true, color:C.accent, margin:0 });

  // Arrow → Tr(ρ̂)
  s.addShape(pres.shapes.LINE, { x:ox+mW+0.08, y:oy+mH/2, w:0.55, h:0,
    line:{color:C.gold, width:2} });
  node(s, pres, ox+mW+0.68, oy+mH/2-0.18, 1.0, 0.36, "Tr(ρ̂)=1", "201700", C.gold, 9, true);

  // Arrow → Tr(ρ̂²)
  s.addShape(pres.shapes.LINE, { x:ox+mW+0.08, y:oy+mH/2+0.28, w:0.55, h:0,
    line:{color:C.mscCol, width:2} });
  node(s, pres, ox+mW+0.68, oy+mH/2+0.1, 1.0, 0.36, "Tr(ρ̂²)≤1", "1A0F2A", C.mscCol, 9, true);

  // Arrow → ⟨Â⟩
  s.addShape(pres.shapes.LINE, { x:ox+mW+0.08, y:oy+mH/2+0.6, w:0.55, h:0,
    line:{color:C.teal, width:2} });
  node(s, pres, ox+mW+0.68, oy+mH/2+0.42, 1.0, 0.36, "⟨Â⟩=Tr(ρ̂Â)", "0D1E1D", C.teal, 8.5, true);
}

function drawTierAdvUG(s, pres, ox, oy) {
  // Spectral decomposition of ρ̂: eigenvalue bar chart + ρ̂ = Σλᵢ|eᵢ⟩⟨eᵢ|
  const eigenvals = [0.65, 0.25, 0.10];
  const barW = 0.7, gap = 0.25, maxH = 1.2;
  let bx = ox;
  for (let i = 0; i < eigenvals.length; i++) {
    const bh = eigenvals[i] * maxH;
    s.addShape(pres.shapes.RECTANGLE, {
      x: bx, y: oy+maxH-bh, w: barW, h: bh,
      fill:{color: [C.accent, C.teal, C.mscCol][i], transparency:20},
      line:{color: [C.accent, C.teal, C.mscCol][i], width:1.5},
    });
    s.addText(`λ${i+1}=${eigenvals[i]}`, { x:bx, y:oy-0.26, w:barW, h:0.22,
      fontSize:8, fontFace:FONT_MONO, bold:true, color:[C.accent, C.teal, C.mscCol][i],
      align:"center", margin:0 });
    s.addText(`|e${i+1}⟩`, { x:bx, y:oy+maxH+0.04, w:barW, h:0.22,
      fontSize:8.5, fontFace:FONT_MONO, color:[C.accent, C.teal, C.mscCol][i],
      align:"center", margin:0 });
    bx += barW + gap;
  }
  // Axis
  s.addShape(pres.shapes.LINE, { x:ox-0.08, y:oy+maxH, w:bx-ox+0.08, h:0,
    line:{color:C.muted, width:1.5} });
  // Formula
  s.addText("ρ̂ = Σᵢ λᵢ |eᵢ⟩⟨eᵢ|\nTr(ρ̂²) = Σᵢ λᵢ² ≤ (Σᵢ λᵢ)² = 1", {
    x:ox, y:oy+maxH+0.34, w:3.2, h:0.52,
    fontSize:9, fontFace:FONT_MONO, color:C.offwhite, margin:0 });
}

function drawTierMSc(s, pres, ox, oy) {
  // Schmidt decomposition network: bipartite state as sum of product states
  const n = 3;
  for (let i = 0; i < n; i++) {
    const y = oy + i * 0.72;
    // Schmidt coefficient
    s.addShape(pres.shapes.OVAL, { x:ox, y:y, w:0.5, h:0.42,
      fill:{color:"201700"}, line:{color:C.gold, width:1.2} });
    s.addText(`√λ${i+1}`, { x:ox, y:y, w:0.5, h:0.42,
      fontSize:7.5, fontFace:FONT_MONO, color:C.gold, align:"center", valign:"middle", margin:0 });
    // Arrow to A
    s.addShape(pres.shapes.LINE, { x:ox+0.5, y:y+0.21, w:0.3, h:0,
      line:{color:C.teal, width:1.2} });
    node(s, pres, ox+0.8, y+0.03, 0.7, 0.36, `|a${i+1}⟩`, "0D1E1D", C.teal, 9, false);
    // ⊗
    s.addText("⊗", { x:ox+1.55, y:y+0.04, w:0.26, h:0.34,
      fontSize:12, fontFace:FONT_HEAD, color:C.muted, align:"center", margin:0 });
    // Arrow to B
    node(s, pres, ox+1.85, y+0.03, 0.7, 0.36, `|b${i+1}⟩`, "1A0D10", C.phdCol, 9, false);
  }
  // Sum brace
  s.addText("Σᵢ", { x:ox-0.35, y:oy+0.6, w:0.32, h:0.5,
    fontSize:16, fontFace:FONT_HEAD, color:C.accent, margin:0 });
  // Entropy
  s.addText("S = −Σᵢ λᵢ ln λᵢ", { x:ox, y:oy+n*0.72+0.08, w:2.7, h:0.26,
    fontSize:9, fontFace:FONT_MONO, color:C.gold, margin:0 });
}

function drawTierPhD(s, pres, ox, oy) {
  // Operator hierarchy: Bounded → Compact → Trace-class → ρ̂
  const levels = [
    { label:"Bounded operators B(H)", color:C.muted, bg:"0D0D0D", w:3.2 },
    { label:"Compact operators", color:C.accent, bg:"0D1A2A", w:2.6 },
    { label:"Trace-class T₁(H)", color:C.teal, bg:"0D1E1D", w:2.0 },
    { label:"Density operators ρ̂", color:C.gold, bg:"201700", w:1.5 },
  ];
  const cxBase = ox + 1.6;
  let ly = oy;
  for (const lv of levels) {
    s.addShape(pres.shapes.RECTANGLE, { x:cxBase - lv.w/2, y:ly, w:lv.w, h:0.36,
      fill:{color:lv.bg}, line:{color:lv.color, width:1.5} });
    s.addText(lv.label, { x:cxBase - lv.w/2, y:ly, w:lv.w, h:0.36,
      fontSize:8.5, fontFace:FONT_BODY, bold:true, color:lv.color,
      align:"center", valign:"middle", margin:0 });
    if (ly < oy + levels.length * 0.46 - 0.5) {
      vline(s, pres, cxBase, ly+0.36, ly+0.5, lv.color);
      s.addText("⊃", { x:cxBase-0.12, y:ly+0.37, w:0.24, h:0.14,
        fontSize:7, fontFace:FONT_HEAD, color:C.muted, align:"center", margin:0 });
    }
    ly += 0.5;
  }
  s.addText("Tr(|ρ̂|) < ∞,  ρ̂ ≥ 0,  Tr(ρ̂)=1", {
    x:ox, y:ly+0.08, w:3.2, h:0.24,
    fontSize:8.5, fontFace:FONT_MONO, color:C.offwhite, align:"center", margin:0 });
}

// ─── MAIN BUILDER ─────────────────────────────────────────────────────────────

async function buildL01Expanded(lec, outputPath) {
  const pres = new pptxgen();
  pres.layout  = "LAYOUT_16x9";
  pres.title   = `Module I.3 · L01 (Expanded) — ${lec.title}`;
  pres.author  = "QM Programme";
  pres.subject = "Quantum Dynamics — Density Matrix";

  const { makeCard, addContentHeader, addFooter } = makeHelpers(pres);
  const LCode = "L01";
  const footLeft = `QM: Module I.3 — ${lec.title}`;

  // ── Reusable text block layout constants ──────────────────────────────────
  const TEXT_COL_X = 0.28, TEXT_COL_W = 5.0;
  const DIAG_COL_X = 5.45, DIAG_COL_W = 4.35;
  const CONTENT_TOP = 0.58, CONTENT_H = 4.62;

  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 1 — TITLE (unchanged)
  // ════════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    s.addShape(pres.shapes.OVAL, { x:7.0, y:-0.3, w:3.2, h:3.2,
      fill:{color:C.dimblue}, line:{color:C.dimblue} });
    s.addText("Ψ", { x:7.6, y:0.05, w:2.0, h:2.0,
      fontSize:80, fontFace:"Georgia", color:"1A3055",
      bold:true, align:"center", valign:"middle", margin:0 });
    s.addText("QUANTUM MECHANICS — MODULE I.3 — QUANTUM DYNAMICS", {
      x:0.45, y:0.62, w:6.5, h:0.22, fontSize:7.5, fontFace:FONT_BODY, bold:true,
      color:C.muted, charSpacing:2, margin:0 });
    s.addText(LCode, { x:0.45, y:0.88, w:1.0, h:0.32,
      fontSize:22, fontFace:FONT_HEAD, bold:true, color:C.accent, margin:0 });
    s.addText(lec.title, { x:0.45, y:1.28, w:6.4, h:1.1,
      fontSize:28, fontFace:FONT_HEAD, bold:true, color:C.white, valign:"top", margin:0 });
    s.addText(lec.subtitle, { x:0.45, y:2.45, w:6.4, h:0.3,
      fontSize:11, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0 });
    s.addText(lec.track, { x:0.45, y:2.85, w:6.4, h:0.22,
      fontSize:9.5, fontFace:FONT_BODY, color:C.muted, margin:0 });
    const badges = [
      {label:"HS",fg:C.hsCol,bg:C.hsBg},{label:"BegUG",fg:C.begCol,bg:C.begBg},
      {label:"AdvUG",fg:C.advCol,bg:C.advBg},{label:"MSc",fg:C.mscCol,bg:C.mscBg},
      {label:"PhD",fg:C.phdCol,bg:C.phdBg},
    ];
    let bx = 0.45;
    for (const b of badges) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:bx, y:3.22, w:0.72, h:0.24,
        fill:{color:b.bg}, line:{color:b.fg, width:1}, rectRadius:0.05 });
      s.addText(b.label, { x:bx, y:3.22, w:0.72, h:0.24,
        fontSize:8.5, fontFace:FONT_BODY, bold:true, color:b.fg,
        align:"center", valign:"middle", margin:0 });
      bx += 0.80;
    }
    s.addText("Full expanded deck  ·  5 tiers  ·  Worked examples  ·  Complete problem sets  ·  Diagram slides", {
      x:0.45, y:3.60, w:6.4, h:0.2, fontSize:8, fontFace:FONT_BODY, color:C.muted, margin:0 });
    addFooter(s, `QM: Bra–Ket Notation — ${LCode}`, LCode);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE 2 — LECTURE OVERVIEW (unchanged)
  // ════════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Lecture Overview", lec.title);
    makeCard(s, { x:0.18, y:0.65, w:4.55, h:2.0, title:"90-MIN PACING",
      titleColor:C.teal, borderColor:C.teal, bgColor:"0D1E1D",
      body:lec.pacing, bodyFontSize:10.5 });
    makeCard(s, { x:4.84, y:0.65, w:5.0, h:2.0, title:"CORE LEARNING OUTCOMES",
      titleColor:C.accent, borderColor:C.accent, bgColor:"0D1830",
      body:lec.outcomes.map(o => "• " + o), bodyFontSize:10.5 });
    const tierW = 1.9, tierH = 1.2, tierGap = 0.02;
    let tx = 0.18;
    for (const t of TIERS) {
      s.addShape(pres.shapes.RECTANGLE, { x:tx, y:2.76, w:tierW, h:tierH,
        fill:{color:t.bg}, line:{color:t.fg, width:1.5} });
      s.addText(t.label, { x:tx, y:2.78, w:tierW, h:0.2,
        fontSize:9, fontFace:FONT_HEAD, bold:true, color:t.fg, align:"center", margin:0 });
      s.addText(lec.tiers[t.key], { x:tx+0.08, y:3.01, w:tierW-0.16, h:0.9,
        fontSize:9, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0 });
      tx += tierW + tierGap;
    }
    makeCard(s, { x:0.18, y:4.04, w:9.66, h:0.78, title:"ASSESSMENT BUNDLE",
      titleColor:C.gold, borderColor:C.gold, bgColor:"201700",
      body:[`Set A: ${lec.assessment.setA}`, `Set B: ${lec.assessment.setB}`], bodyFontSize:10 });
    addFooter(s, `QM: ${LCode}`, `${LCode} · Overview`);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // LEARNING OBJECTIVE SLIDES (LO1–LO4)
  // ════════════════════════════════════════════════════════════════════════════
  const loData = [
    {
      n:1, color:C.accent, tagBg:C.accent,
      title:"Construct the Density Operator ρ̂",
      goal:"Build ρ̂ for any preparation — pure, mixture, or subsystem",
      keyPoints:[
        "Pure state: ρ̂ = |ψ⟩⟨ψ|  — rank-1 projector onto |ψ⟩",
        "Statistical mixture: ρ̂ = Σᵢ pᵢ |ψᵢ⟩⟨ψᵢ|  where Σpᵢ = 1",
        "Subsystem of AB: ρ̂_A = Tr_B(ρ̂_AB)  — partial trace over B",
        "Same formalism unifies all three cases via the density matrix",
      ],
      diag: drawLO1Diagram,
      diagLabel:"State taxonomy: how ρ̂ encodes any preparation",
    },
    {
      n:2, color:C.teal, tagBg:C.teal,
      title:"Verify the Three Defining Properties",
      goal:"Check Hermiticity, unit trace, and positive semi-definiteness",
      keyPoints:[
        "Hermitian:  ρ̂† = ρ̂  ⟹  real eigenvalues (observable quantities)",
        "Unit trace:  Tr(ρ̂) = 1  ⟹  total probability normalised",
        "Positive semi-definite:  ρ̂ ≥ 0  ⟹  ⟨ψ|ρ̂|ψ⟩ ≥ 0  for all |ψ⟩",
        "Any Hermitian matrix with unit trace and non-negative eigenvalues is a valid ρ̂",
      ],
      diag: drawLO2Diagram,
      diagLabel:"Three properties → valid density operator",
    },
    {
      n:3, color:C.begCol, tagBg:"106038",
      title:"Compute ⟨Â⟩ and Purity γ",
      goal:"Extract physical predictions and quantify how mixed a state is",
      keyPoints:[
        "Expectation value:  ⟨Â⟩ = Tr(ρ̂ Â)  — works for all states, pure or mixed",
        "Purity:  γ = Tr(ρ̂²) ∈ [1/d, 1]  where d = Hilbert space dimension",
        "Pure state: γ = 1  (Bloch sphere surface)",
        "Maximally mixed: γ = 1/d  (centre of Bloch sphere for d=2)",
      ],
      diag: drawLO3Diagram,
      diagLabel:"Purity spectrum from mixed (γ=1/d) to pure (γ=1)",
    },
    {
      n:4, color:C.mscCol, tagBg:"2D1850",
      title:"Apply the Partial Trace",
      goal:"Obtain ρ̂_A by tracing over subsystem B in a bipartite state",
      keyPoints:[
        "Bipartite system: H_AB = H_A ⊗ H_B  — tensor product structure",
        "Partial trace: ρ̂_A = Tr_B(ρ̂_AB) = Σⱼ (I_A ⊗ ⟨j|_B) ρ̂_AB (I_A ⊗ |j⟩_B)",
        "Discards all information about subsystem B",
        "If ρ̂_AB is entangled: ρ̂_A is mixed even if ρ̂_AB was pure",
      ],
      diag: drawLO4Diagram,
      diagLabel:"Tracing out B: ρ̂_AB → ρ̂_A (reduced density matrix)",
    },
  ];

  for (const lo of loData) {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    diagHeader(s, pres, LCode, `LO ${lo.n}`, lo.title,
      "Learning Objective — " + lo.goal, lo.tagBg);

    // Left: structured text
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X, y:CONTENT_TOP, w:TEXT_COL_W, h:CONTENT_H,
      fill:{color:"0D1A2A"}, line:{color:lo.color, width:1.5},
    });
    s.addText("OBJECTIVE", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.1, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:lo.color, charSpacing:1, margin:0 });
    s.addText(lo.goal, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.32, w:TEXT_COL_W-0.24, h:0.3,
      fontSize:10.5, fontFace:FONT_BODY, color:C.white, italic:true, margin:0 });
    // Divider
    s.addShape(pres.shapes.LINE, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.68, w:TEXT_COL_W-0.24, h:0,
      line:{color:lo.color, width:0.8, transparency:60} });
    s.addText("KEY POINTS", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.76, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:lo.color, charSpacing:1, margin:0 });
    const ptItems = lo.keyPoints.map((p,i) => ({
      text:`${i+1}.  ${p}`,
      options:{color:C.offwhite, fontSize:10.5, breakLine:true, paraSpaceAfter:7},
    }));
    s.addText(ptItems, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.0, w:TEXT_COL_W-0.24, h:3.4,
      valign:"top", fontFace:FONT_BODY, margin:0 });

    // Right: diagram panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X, y:CONTENT_TOP, w:DIAG_COL_W, h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:lo.color, width:1.5},
    });
    s.addText("DIAGRAM", { x:DIAG_COL_X+0.12, y:CONTENT_TOP+0.08, w:DIAG_COL_W-0.24, h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:lo.color, charSpacing:1, margin:0 });
    // Draw the diagram inside the right panel
    lo.diag(s, pres, DIAG_COL_X + 0.2, CONTENT_TOP + 0.38);
    // Diagram caption
    s.addText(lo.diagLabel, {
      x:DIAG_COL_X+0.1, y:CONTENT_TOP+CONTENT_H-0.34, w:DIAG_COL_W-0.2, h:0.28,
      fontSize:7.5, fontFace:FONT_BODY, color:C.muted, italic:true, align:"center", margin:0,
    });

    diagFooter(s, "Learning Objective", lo.n);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // KEY FORMULA SLIDES (F1–F6)
  // ════════════════════════════════════════════════════════════════════════════
  const formulaData = [
    {
      n:1, formula:"ρ̂ = |ψ⟩⟨ψ|", label:"Pure-state density operator",
      color:C.accent,
      explanation:"For a pure state |ψ⟩ the density operator is the rank-1 projector onto |ψ⟩. It carries all quantum information and satisfies ρ̂² = ρ̂ (idempotent).",
      checks:["Tr(ρ̂) = ⟨ψ|ψ⟩ = 1  ✓", "ρ̂† = (|ψ⟩⟨ψ|)† = |ψ⟩⟨ψ| = ρ̂  ✓", "γ = Tr(ρ̂²) = Tr(ρ̂) = 1  ✓"],
      diag: drawF1Diagram, diagLabel:"Bloch sphere: pure state sits on the surface (|r|=1)",
    },
    {
      n:2, formula:"ρ̂ = Σᵢ pᵢ |ψᵢ⟩⟨ψᵢ|", label:"Statistical mixture",
      color:C.teal,
      explanation:"A classical mixture of quantum states |ψᵢ⟩ with probabilities pᵢ ≥ 0 summing to 1. The pᵢ are classical — the states |ψᵢ⟩ need NOT be orthogonal; the decomposition is non-unique.",
      checks:["Σᵢ pᵢ = 1  ✓  (probabilities)", "ρ̂ ≥ 0 since each |ψᵢ⟩⟨ψᵢ| ≥ 0  ✓", "γ = Tr(ρ̂²) < 1  (strictly mixed)"],
      diag: drawF2Diagram, diagLabel:"Weighted ensemble: each |ψᵢ⟩ contributes pᵢ to ρ̂",
    },
    {
      n:3, formula:"⟨Â⟩ = Tr(ρ̂ Â)", label:"Expectation value via trace",
      color:C.begCol,
      explanation:"Works for any state, pure or mixed. For a pure state reduces to ⟨ψ|Â|ψ⟩. Basis-independent: the trace is invariant under unitary change of basis.",
      checks:["Pure: Tr(|ψ⟩⟨ψ|Â) = ⟨ψ|Â|ψ⟩  ✓", "Mixed: ⟨Â⟩ = Σᵢ pᵢ ⟨ψᵢ|Â|ψᵢ⟩  ✓", "Trace cyclic: Tr(ρ̂Â) = Tr(Âρ̂)  ✓"],
      diag: drawF3Diagram, diagLabel:"Trace = sum of diagonal elements of ρ̂Â in any ONB",
    },
    {
      n:4, formula:"γ = Tr(ρ̂²) ≤ 1", label:"Purity of a state",
      color:C.gold,
      explanation:"Purity γ measures how pure a state is: γ=1 for a pure state, γ=1/d for the maximally mixed state in a d-dimensional space. Note γ ≥ 1/d always.",
      checks:["γ = 1  ⟺  ρ̂² = ρ̂  ⟺  pure", "γ = 1/d  ⟺  ρ̂ = I/d  (max mixed)", "Linear entropy: S_L = 1 − γ ∈ [0, 1−1/d]"],
      diag: drawF4Diagram, diagLabel:"Purity axis: γ=1/d (max mixed) to γ=1 (pure)",
    },
    {
      n:5, formula:"ρ̂_A = Tr_B(ρ̂_AB)", label:"Partial trace — reduced density matrix",
      color:C.mscCol,
      explanation:"Obtained by summing over a basis {|j⟩} of B: ρ̂_A = Σⱼ (I_A⊗⟨j|_B) ρ̂_AB (I_A⊗|j⟩_B). Gives the reduced state of A irrespective of B.",
      checks:["If ρ̂_AB = ρ̂_A ⊗ ρ̂_B: Tr_B gives ρ̂_A  ✓", "If ρ̂_AB entangled: ρ̂_A is mixed", "Tr(ρ̂_A) = 1 always  ✓"],
      diag: drawF5Diagram, diagLabel:"Summing over B-index columns yields the A-block ρ̂_A",
    },
    {
      n:6, formula:"S = −Tr(ρ̂_A ln ρ̂_A)", label:"von Neumann entanglement entropy",
      color:C.phdCol,
      explanation:"S = −Σᵢ λᵢ ln λᵢ where λᵢ are eigenvalues of ρ̂_A. Vanishes for product states; equals ln(d) for maximally entangled states in d dimensions.",
      checks:["S = 0  ⟺  ρ̂_A pure  ⟺  no entanglement", "S = ln d  ⟺  ρ̂_A = I/d  ⟺  max entanglement", "Sub-additivity: S(AB) ≤ S(A) + S(B)"],
      diag: drawF6Diagram, diagLabel:"Entropy S increases with degree of entanglement",
    },
  ];

  for (const f of formulaData) {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    diagHeader(s, pres, LCode, `F${f.n}`, f.formula, f.label, f.color);

    // Left panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X, y:CONTENT_TOP, w:TEXT_COL_W, h:CONTENT_H,
      fill:{color:"0D1A2A"}, line:{color:f.color, width:1.5},
    });
    // Formula displayed large
    s.addText(f.formula, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.1, w:TEXT_COL_W-0.24, h:0.44,
      fontSize:16, fontFace:FONT_MONO, bold:true, color:f.color, valign:"middle", margin:0 });
    s.addText(f.label, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.55, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8.5, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0 });
    s.addShape(pres.shapes.LINE, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.78, w:TEXT_COL_W-0.24, h:0,
      line:{color:f.color, width:0.8, transparency:60} });
    s.addText("EXPLANATION", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.86, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:f.color, charSpacing:1, margin:0 });
    s.addText(f.explanation, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.08, w:TEXT_COL_W-0.24, h:1.2,
      fontSize:10, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0 });
    s.addText("CHECKS / CONSEQUENCES", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+2.36, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:f.color, charSpacing:1, margin:0 });
    const chkItems = f.checks.map((c,i) => ({
      text: `${i+1}. ${c}`,
      options:{color:C.offwhite, fontSize:10, breakLine:true, paraSpaceAfter:5},
    }));
    s.addText(chkItems, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+2.58, w:TEXT_COL_W-0.24, h:1.8,
      valign:"top", fontFace:FONT_BODY, margin:0 });

    // Right panel — diagram
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X, y:CONTENT_TOP, w:DIAG_COL_W, h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:f.color, width:1.5},
    });
    s.addText("DIAGRAM", { x:DIAG_COL_X+0.12, y:CONTENT_TOP+0.08, w:DIAG_COL_W-0.24, h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:f.color, charSpacing:1, margin:0 });
    f.diag(s, pres, DIAG_COL_X + 0.18, CONTENT_TOP + 0.42);
    s.addText(f.diagLabel, {
      x:DIAG_COL_X+0.1, y:CONTENT_TOP+CONTENT_H-0.34, w:DIAG_COL_W-0.2, h:0.28,
      fontSize:7.5, fontFace:FONT_BODY, color:C.muted, italic:true, align:"center", margin:0,
    });

    diagFooter(s, "Formula", f.n);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // CONCEPT QUESTION SLIDES (CQ1–CQ8)
  // ════════════════════════════════════════════════════════════════════════════
  const cqData = [
    {
      n:1, q:"Why is ρ̂ needed when a ket |ψ⟩ is insufficient?",
      color:C.accent,
      answer:"A ket only represents a pure quantum state. For mixed states (ensembles, subsystems, statistical uncertainty) there is no single |ψ⟩ that reproduces all predictions. ρ̂ handles both: it reduces to |ψ⟩⟨ψ| for pure states and generalises smoothly to mixtures and subsystems.",
      pitfall:"Common mistake: confusing 'don't know |ψ⟩' with 'state is mixed'. Ignorance of a pure state is still classical — the real state is still pure.",
      diag:drawCQ1Diagram,
    },
    {
      n:2, q:"Physical difference: coherent superposition vs. classical mixture?",
      color:C.teal,
      answer:"A superposition (|↑⟩+|↓⟩)/√2 has coherences ρ₁₂ ≠ 0 — it produces interference in measurements. A mixture p|↑⟩⟨↑|+p|↓⟩⟨↓| has no off-diagonal elements — no interference. The density matrices are physically distinct even if both have ⟨σ_z⟩=0.",
      pitfall:"A 50:50 mixture of |↑⟩ and |↓⟩ has the same ⟨σ_z⟩ as the superposition but its ρ̂ is diagonal — interference patterns differ.",
      diag:drawCQ2Diagram,
    },
    {
      n:3, q:"State the three properties every density operator must satisfy.",
      color:C.begCol,
      answer:"(1) Hermitian: ρ̂† = ρ̂ → real, observable eigenvalues.  (2) Unit trace: Tr(ρ̂)=1 → probability normalised.  (3) Positive semi-definite: ρ̂ ≥ 0 → ⟨ψ|ρ̂|ψ⟩ ≥ 0 for all |ψ⟩, so probabilities are non-negative.",
      pitfall:"A Hermitian matrix with Tr=1 is NOT necessarily positive. All three conditions are independent and must all hold.",
      diag:drawCQ3Diagram,
    },
    {
      n:4, q:"True/False: A state with purity γ = 0.5 is a pure state. Justify.",
      color:C.gold,
      answer:"FALSE. A pure state has γ = Tr(ρ̂²) = 1. Any γ < 1 indicates a mixed state. For a qubit (d=2), γ = 0.5 lies halfway between the maximally mixed state (γ=0.5) and the pure surface (γ=1). In fact for d=2, γ_min = 1/d = 0.5 is the maximally mixed state.",
      pitfall:"For d=2: the maximally mixed state (½I) has γ=½, NOT a pure state. Bloch vector: |r|=0 (centre), not |r|=1 (surface).",
      diag:drawCQ4Diagram,
    },
    {
      n:5, q:"How does the partial trace 'discard' information about subsystem B?",
      color:C.mscCol,
      answer:"Tr_B sums over a complete basis {|j⟩_B} of B: ρ̂_A = Σⱼ ⟨j|_B ρ̂_AB |j⟩_B. This averages over all B outcomes — effectively integrating out B's degrees of freedom. The result depends on B's Hilbert space dimension but not on B's particular state.",
      pitfall:"Partial trace does not depend on any specific measurement of B. It is a mathematical operation, not a physical collapse.",
      diag:drawCQ5Diagram,
    },
    {
      n:6, q:"True/False: Entanglement entropy is zero for a product state. Justify.",
      color:C.phdCol,
      answer:"TRUE. If ρ̂_AB = ρ̂_A ⊗ ρ̂_B then ρ̂_A is pure (γ_A=1) if the full state is pure, so S_A = 0. More precisely, if ρ̂_AB is a pure product state then ρ̂_A = |ψ_A⟩⟨ψ_A| which has a single non-zero eigenvalue (λ=1), giving S = −1·ln1 = 0.",
      pitfall:"S=0 iff ρ̂_A is pure iff the full pure state ρ̂_AB is a product state. Any entanglement → S > 0.",
      diag:drawCQ6Diagram,
    },
    {
      n:7, q:"When does ⟨Â⟩ = Tr(ρ̂Â) reduce to the usual ⟨ψ|Â|ψ⟩?",
      color:C.accent,
      answer:"When ρ̂ = |ψ⟩⟨ψ| (pure state): Tr(|ψ⟩⟨ψ|Â) = ⟨ψ|Â|ψ⟩. For a mixed state ρ̂ = Σpᵢ|ψᵢ⟩⟨ψᵢ|: ⟨Â⟩ = Σpᵢ⟨ψᵢ|Â|ψᵢ⟩ — a weighted classical average of quantum expectations. There is no single |ψ⟩ that gives this.",
      pitfall:"For a mixed state one cannot write ⟨Â⟩ = ⟨ψ|Â|ψ⟩ for any |ψ⟩ — this is precisely why ρ̂ is indispensable.",
      diag:drawCQ7Diagram,
    },
    {
      n:8, q:"Compare Bloch sphere representation: pure vs. mixed spin-½.",
      color:C.teal,
      answer:"Pure states live on the surface of the Bloch sphere: r⃗ = (⟨σ_x⟩,⟨σ_y⟩,⟨σ_z⟩), |r⃗|=1. Mixed states live strictly inside: |r⃗| < 1. The maximally mixed state ρ̂=½I is the centre (r⃗=0, γ=½). ρ̂ = ½(I + r⃗·σ⃗) parameterises all qubit states.",
      pitfall:"The Bloch sphere is specific to qubits (d=2). For d>2 the state space is not a ball — it is a higher-dimensional convex body with a much more complex structure.",
      diag:drawCQ8Diagram,
    },
  ];

  for (const cq of cqData) {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    diagHeader(s, pres, LCode, `CQ ${cq.n}`, cq.q,
      "Concept Question — think before computing", cq.color);

    // Left: answer panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X, y:CONTENT_TOP, w:TEXT_COL_W, h:CONTENT_H,
      fill:{color:"0D1A2A"}, line:{color:cq.color, width:1.5},
    });
    s.addText("QUESTION", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.08, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:cq.color, charSpacing:1, margin:0 });
    s.addText(cq.q, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.3, w:TEXT_COL_W-0.24, h:0.6,
      fontSize:10.5, fontFace:FONT_BODY, color:C.white, italic:true, margin:0 });
    s.addShape(pres.shapes.LINE, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.95, w:TEXT_COL_W-0.24, h:0,
      line:{color:cq.color, width:0.8, transparency:60} });
    s.addText("MODEL ANSWER", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.02, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:cq.color, charSpacing:1, margin:0 });
    s.addText(cq.answer, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.24, w:TEXT_COL_W-0.24, h:2.1,
      fontSize:10, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0 });
    s.addShape(pres.shapes.LINE, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+3.42, w:TEXT_COL_W-0.24, h:0,
      line:{color:C.phdCol, width:0.8, transparency:60} });
    s.addText("⚠ COMMON PITFALL", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+3.5, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.phdCol, charSpacing:1, margin:0 });
    s.addText(cq.pitfall, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+3.72, w:TEXT_COL_W-0.24, h:0.75,
      fontSize:9.5, fontFace:FONT_BODY, color:C.phdCol, valign:"top", margin:0 });

    // Right: diagram panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X, y:CONTENT_TOP, w:DIAG_COL_W, h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:cq.color, width:1.5},
    });
    s.addText("DIAGRAM", { x:DIAG_COL_X+0.12, y:CONTENT_TOP+0.08, w:DIAG_COL_W-0.24, h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:cq.color, charSpacing:1, margin:0 });
    cq.diag(s, pres, DIAG_COL_X + 0.22, CONTENT_TOP + 0.42);

    diagFooter(s, "Concept Question", cq.n);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // TIER DEEP-DIVE SLIDES (T1–T5)
  // ════════════════════════════════════════════════════════════════════════════
  const tierDeepData = [
    {
      key:"hs", label:"Tier 1 — HS", fg:C.hsCol, bg:C.hsBg,
      title:"High-School Track — Intuitive Gateway",
      desc:lec.tiers.hs,
      focus:"Analogy: classical ignorance vs. quantum superposition. No matrix mechanics.",
      tasks:[
        "Visualise |↑⟩+|↓⟩ vs. 50:50 mixture on a coin-flip tree",
        "Explain why |α|² gives probability: normalisation |α|²+|β|²=1",
        "Describe the Bloch sphere: sphere surface = pure, inside = mixed",
        "Discuss: 'Why does quantum mechanics need complex numbers?'",
      ],
      diag: drawTierHS,
    },
    {
      key:"begug", label:"Tier 2 — BegUG", fg:C.begCol, bg:C.begBg,
      title:"Beginning Undergraduate — Computational Entry",
      desc:lec.tiers.begug,
      focus:"Matrix computations: build ρ̂, verify properties, compute ⟨Â⟩.",
      tasks:[
        "Write ρ̂ for |+⟩=(|0⟩+|1⟩)/√2; compute Tr(ρ̂²), ⟨σ_z⟩",
        "For ρ̂ = 0.7|0⟩⟨0|+0.3|1⟩⟨1|: find purity, ⟨σ_x⟩",
        "Verify Hermiticity and positive semi-definiteness numerically",
        "Compute partial trace for |Φ+⟩=(|00⟩+|11⟩)/√2",
      ],
      diag: drawTierBegUG,
    },
    {
      key:"advug", label:"Tier 3 — AdvUG", fg:C.advCol, bg:C.advBg,
      title:"Advanced Undergraduate — Structural Understanding",
      desc:lec.tiers.advug,
      focus:"Proofs and spectral theory: derive Tr(ρ̂²)≤1, Bloch vector, partial trace.",
      tasks:[
        "Prove Tr(ρ̂²) ≤ 1 using spectral decomposition and Cauchy–Schwarz",
        "Parameterise a qubit ρ̂ via Bloch vector; show γ = ½(1+|r|²)",
        "Derive partial trace formula from tensor product structure",
        "Show global phase is unobservable: Tr(ρ̂Â) invariant under |ψ⟩→e^{iθ}|ψ⟩",
      ],
      diag: drawTierAdvUG,
    },
    {
      key:"msc", label:"Tier 4 — MSc", fg:C.mscCol, bg:C.mscBg,
      title:"Masters Level — Entanglement and Information",
      desc:lec.tiers.msc,
      focus:"Schmidt decomposition, purification, entanglement entropy and its properties.",
      tasks:[
        "Decompose any bipartite pure state via SVD (Schmidt decomposition)",
        "Purify ρ̂_A: construct |Ψ⟩_AB such that Tr_B(|Ψ⟩⟨Ψ|) = ρ̂_A",
        "Prove sub-additivity: S(AB) ≤ S(A) + S(B)",
        "Show S(A) = S(B) for a pure bipartite state |Ψ⟩_AB",
      ],
      diag: drawTierMSc,
    },
    {
      key:"phd", label:"Tier 5 — PhD", fg:C.phdCol, bg:C.phdBg,
      title:"Doctoral Level — Functional Analysis & Open Systems",
      desc:lec.tiers.phd,
      focus:"Trace-class operators, von Neumann entropy, quantum channels, and CP maps.",
      tasks:[
        "Define trace-class operators on infinite-dim. H; show ρ̂ ∈ T₁(H)",
        "Prove concavity of von Neumann entropy: S(Σpᵢρ̂ᵢ) ≥ Σpᵢ S(ρ̂ᵢ)",
        "Define completely positive trace-preserving (CPTP) maps (quantum channels)",
        "Show Kraus decomposition ε(ρ̂) = Σ_k K_k ρ̂ K_k† characterises all CPTP maps",
      ],
      diag: drawTierPhD,
    },
  ];

  for (const td of tierDeepData) {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    // Header with tier colour
    s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:W, h:0.48,
      fill:{color:"0D1B2E"}, line:{color:"0D1B2E"} });
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:0.18, y:0.07, w:1.55, h:0.24,
      fill:{color:td.fg}, line:{color:td.fg}, rectRadius:0.06 });
    s.addText(td.label, { x:0.18, y:0.07, w:1.55, h:0.24,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
      align:"center", valign:"middle", margin:0 });
    s.addText(td.title, { x:1.83, y:0.05, w:7.1, h:0.26,
      fontSize:13, fontFace:FONT_HEAD, bold:true, color:C.white, margin:0 });
    s.addText(td.focus, { x:1.83, y:0.3, w:7.1, h:0.16,
      fontSize:7.5, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0 });
    s.addText(LCode, { x:9.4, y:0.07, w:0.5, h:0.3,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.accent, align:"right", margin:0 });

    // Left: tier content
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X, y:CONTENT_TOP, w:TEXT_COL_W, h:CONTENT_H,
      fill:{color:td.bg}, line:{color:td.fg, width:1.8},
    });
    s.addText("TIER SUMMARY", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.1, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:td.fg, charSpacing:1, margin:0 });
    s.addText(td.desc, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+0.33, w:TEXT_COL_W-0.24, h:0.7,
      fontSize:10, fontFace:FONT_BODY, color:C.white, italic:true, valign:"top", margin:0 });
    s.addShape(pres.shapes.LINE, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.08, w:TEXT_COL_W-0.24, h:0,
      line:{color:td.fg, width:0.8, transparency:60} });
    s.addText("ACTIVITIES & TASKS", { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.15, w:TEXT_COL_W-0.24, h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:td.fg, charSpacing:1, margin:0 });
    const taskItems = td.tasks.map((t,i) => ({
      text:`${i+1}.  ${t}`,
      options:{color:C.offwhite, fontSize:10, breakLine:true, paraSpaceAfter:8},
    }));
    s.addText(taskItems, { x:TEXT_COL_X+0.12, y:CONTENT_TOP+1.38, w:TEXT_COL_W-0.24, h:3.0,
      valign:"top", fontFace:FONT_BODY, margin:0 });

    // Right: diagram
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X, y:CONTENT_TOP, w:DIAG_COL_W, h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:td.fg, width:1.5},
    });
    s.addText("DIAGRAM", { x:DIAG_COL_X+0.12, y:CONTENT_TOP+0.08, w:DIAG_COL_W-0.24, h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:td.fg, charSpacing:1, margin:0 });
    td.diag(s, pres, DIAG_COL_X + 0.22, CONTENT_TOP + 0.42);

    s.addText(`QM: Module I.3 · L01 · ${td.label}`,
      { x:0.2, y:5.38, w:7, h:0.18, fontSize:7, fontFace:FONT_BODY, color:C.muted, margin:0 });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE N-2 — KEY FORMULAS SUMMARY (original slide 3)
  // ════════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Key Formulas — Summary", "All six core results at a glance");
    const cardW = 4.7, cardH = 0.9, gapX = 0.12, gapY = 0.12;
    const startX = 0.18, startY = 0.7;
    for (let i = 0; i < lec.keyFormulas.length; i++) {
      const col = i % 2, row = Math.floor(i / 2);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const formula = lec.keyFormulas[i];
      const parenIdx = formula.indexOf("  (");
      const label = parenIdx >= 0 ? formula.slice(parenIdx+2).replace(/^\(/,"").replace(/\)$/,"") : "";
      const fml = parenIdx >= 0 ? formula.slice(0, parenIdx) : formula;
      s.addShape(pres.shapes.RECTANGLE, { x, y, w:cardW, h:cardH,
        fill:{color:"0D1A2A"}, line:{color:C.accent, width:1.2} });
      s.addShape(pres.shapes.OVAL, { x:x+0.1, y:y+0.12, w:0.3, h:0.3,
        fill:{color:C.accent}, line:{color:C.accent} });
      s.addText(`${i+1}`, { x:x+0.1, y:y+0.12, w:0.3, h:0.3,
        fontSize:8.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
        align:"center", valign:"middle", margin:0 });
      s.addText(fml, { x:x+0.48, y:y+0.1, w:cardW-0.6, h:0.48,
        fontSize:13, fontFace:FONT_MONO, color:C.white, valign:"middle", margin:0 });
      if (label) {
        s.addText(label, { x:x+0.48, y:y+0.57, w:cardW-0.6, h:0.25,
          fontSize:9, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0 });
      }
    }
    const connY = startY + 3 * (cardH + gapY) + 0.05;
    makeCard(s, { x:0.18, y:connY, w:9.66, h:0.52, title:null,
      borderColor:C.purple, bgColor:"1A0F2A",
      body:[
        {text:"← Prev: ",options:{bold:true,color:C.purple,fontSize:9.5}},
        {text:lec.prev+"   ",options:{color:C.offwhite,fontSize:9.5}},
        {text:"→ Next: ",options:{bold:true,color:C.teal,fontSize:9.5}},
        {text:lec.next,options:{color:C.offwhite,fontSize:9.5}},
      ],
    });
    addFooter(s, footLeft, `${LCode} · Formulas`);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE N-1 — CONCEPT QUESTIONS SUMMARY
  // ════════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Concept Questions — Summary",
      "Think before computing — conceptual understanding checks");
    const qs = lec.concepts, half = Math.ceil(qs.length/2);
    s.addShape(pres.shapes.RECTANGLE, { x:0.18, y:0.65, w:4.7, h:4.7,
      fill:{color:"0D1A2A"}, line:{color:C.accent, width:1.5} });
    s.addText(`CONCEPT QUESTIONS (1–${half})`, { x:0.3, y:0.68, w:4.5, h:0.22,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.accent, margin:0 });
    s.addText(qs.slice(0,half).map((q,i)=>({
      text:`${i+1}. ${q}`,options:{color:C.offwhite,fontSize:10.5,breakLine:true,paraSpaceAfter:6},
    })), { x:0.3, y:0.95, w:4.5, h:4.2, valign:"top", fontFace:FONT_BODY, margin:0 });
    s.addShape(pres.shapes.RECTANGLE, { x:5.07, y:0.65, w:4.77, h:4.7,
      fill:{color:"0D1A2A"}, line:{color:C.teal, width:1.5} });
    s.addText(`CONCEPT QUESTIONS (${half+1}–${qs.length})`, { x:5.19, y:0.68, w:4.5, h:0.22,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.teal, margin:0 });
    s.addText(qs.slice(half).map((q,i)=>({
      text:`${half+i+1}. ${q}`,options:{color:C.offwhite,fontSize:10.5,breakLine:true,paraSpaceAfter:6},
    })), { x:5.19, y:0.95, w:4.5, h:4.2, valign:"top", fontFace:FONT_BODY, margin:0 });
    addFooter(s, footLeft, `${LCode} · Concept Qs`);
  }

  // ════════════════════════════════════════════════════════════════════════════
  // SLIDE N — FIVE-TIER PEDAGOGY + ASSESSMENT
  // ════════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Five-Tier Pedagogy",
      "Differentiated content for all levels — HS through PhD");
    const tierFull = [
      {key:"hs",    label:"Tier 1 — HS",    fg:C.hsCol,  bg:C.hsBg,  desc:lec.tiers.hs},
      {key:"begug", label:"Tier 2 — BegUG", fg:C.begCol, bg:C.begBg, desc:lec.tiers.begug},
      {key:"advug", label:"Tier 3 — AdvUG", fg:C.advCol, bg:C.advBg, desc:lec.tiers.advug},
      {key:"msc",   label:"Tier 4 — MSc",   fg:C.mscCol, bg:C.mscBg, desc:lec.tiers.msc},
      {key:"phd",   label:"Tier 5 — PhD",   fg:C.phdCol, bg:C.phdBg, desc:lec.tiers.phd},
    ];
    const tH = 0.82, tGap = 0.04, startY = 0.66;
    for (let i = 0; i < tierFull.length; i++) {
      const t = tierFull[i], y = startY + i*(tH+tGap);
      s.addShape(pres.shapes.RECTANGLE, { x:0.18, y, w:9.66, h:tH,
        fill:{color:t.bg}, line:{color:t.fg, width:1.5} });
      s.addShape(pres.shapes.RECTANGLE, { x:0.18, y, w:1.5, h:tH,
        fill:{color:t.fg}, line:{color:t.fg} });
      s.addText(t.label, { x:0.18, y, w:1.5, h:tH,
        fontSize:9.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
        align:"center", valign:"middle", margin:0 });
      s.addText(t.desc, { x:1.78, y:y+0.08, w:8.0, h:tH-0.16,
        fontSize:11, fontFace:FONT_BODY, color:C.offwhite, valign:"middle", margin:0 });
    }
    const connY = startY + 5*(tH+tGap) + 0.02;
    makeCard(s, { x:0.18, y:connY, w:9.66, h:0.55, title:null,
      borderColor:C.gold, bgColor:"201700",
      body:[
        {text:"Assessment Set A: ",options:{bold:true,color:C.gold,fontSize:9.5}},
        {text:lec.assessment.setA+"  |  ",options:{color:C.offwhite,fontSize:9.5}},
        {text:"Set B: ",options:{bold:true,color:C.gold,fontSize:9.5}},
        {text:lec.assessment.setB,options:{color:C.offwhite,fontSize:9.5}},
      ],
    });
    addFooter(s, footLeft, `${LCode} · Tier Pedagogy`);
  }

  await pres.writeFile({ fileName: outputPath });
}

module.exports = { buildL01Expanded };
