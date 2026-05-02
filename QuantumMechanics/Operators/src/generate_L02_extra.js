/**
 * generate_L02_extra.js
 *
 * Adds to L02 (Unitary Operators and Symmetry Transformations):
 *   A) 20 tier-concept slides  (5 tiers × 4 learning objectives)
 *      — each with a unique programmatic diagram
 *   B) 3 special-topic slides with diagrams
 *      — The Lie Group U(n) and SU(2)
 *      — Stone's Theorem: Rigorous Statement and Proof Sketch
 *      — Noether's Theorem: Symmetry → Conservation Law
 *
 * Output: /home/claude/L02_extra_slides.pptx
 */

const pptxgen = require("pptxgenjs");

// ─────────────────────────────────────────────────────────────────────
// DESIGN CONSTANTS
// ─────────────────────────────────────────────────────────────────────
const C = {
  darkBg:      "0D1B2A", darkBg2:  "0A1422", panelBg: "162236",
  white:       "FFFFFF", lightText:"B0C4DE", mutedText:"7B8FA6",
  darkText:    "0D1B2A", bodyText: "1E2D3D", offWhite: "F0F4F8",
  lightBg:     "FFFFFF",
  cyan:        "00B4D8", teal:     "00897B", gold:   "F4A261",
  green:       "2ECC71", purple:   "9B72CF", coral:  "E07B6A",
  midblue:     "1E5FA8", lightblue:"DCE9FF", adv:    "5B9BD5",
  lightcyan:   "D0F4FB", lightgold:"FFF3E0", lightgreen:"DFF5E8",
  lightpurple: "EDE0FF",
  hs: "F4C430", beg: "4CAF7D", msc: "9B72CF", phd: "E07B6A",
};
const TIERS = [
  { code:"HS",    label:"High School",        color:C.hs,    textDark:true  },
  { code:"BegUG", label:"Beg. Undergraduate", color:C.beg,   textDark:true  },
  { code:"AdvUG", label:"Adv. Undergraduate", color:C.adv,   textDark:false },
  { code:"MSc",   label:"Master's",           color:C.msc,   textDark:false },
  { code:"PhD",   label:"PhD",                color:C.phd,   textDark:false },
];
const LOS = [
  { num:1, short:"Verifying Unitarity ÛÛ† = 1̂",           label:"LO1" },
  { num:2, short:"Unitaries Preserve Norms & Probabilities", label:"LO2" },
  { num:3, short:"Physical Symmetries as Unitary Operators", label:"LO3" },
  { num:4, short:"Û = e^{iĜ} and Stone's Theorem",          label:"LO4" },
];

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────
function header(slide, title, subtitle, tag, darkBg=true) {
  const hc = darkBg ? C.white : C.darkText;
  const sc = darkBg ? C.mutedText : "5B7A9D";
  slide.addText(title,    { x:0.3, y:0.12, w:9.0, h:0.42, fontSize:18, bold:true, color:hc, fontFace:"Cambria" });
  slide.addText(subtitle, { x:0.3, y:0.57, w:8.5, h:0.22, fontSize:9.5, italic:true, color:sc, fontFace:"Calibri" });
  const tc = darkBg ? "1E3A5F" : "E8F0F8";
  const tt = darkBg ? C.adv : "3A6EA5";
  slide.addShape("rect", { x:9.38, y:0.06, w:0.57, h:0.28, fill:{color:tc}, line:{color:tc} });
  slide.addText(tag, { x:9.38, y:0.06, w:0.57, h:0.28, fontSize:8, bold:true, color:tt, fontFace:"Calibri", align:"center", valign:"middle" });
}
function footer(slide, left, right, darkBg=true) {
  const fc = darkBg ? "4A6080" : "9AAABB";
  slide.addText(left,  { x:0.3,  y:5.35, w:5,   h:0.22, fontSize:8, color:fc, fontFace:"Calibri" });
  slide.addText(right, { x:7.5,  y:5.35, w:2.2, h:0.22, fontSize:8, color:fc, fontFace:"Calibri", align:"right" });
}
function tierBadge(slide, tier, x, y, w=0.88, h=0.42) {
  slide.addShape("roundRect", { x, y, w, h, fill:{color:tier.color}, line:{color:tier.color}, rectRadius:0.05 });
  slide.addText(tier.code, { x, y, w, h, fontSize:9.5, bold:true, color:tier.textDark?C.darkText:C.white, fontFace:"Calibri", align:"center", valign:"middle" });
}
function darkPanel(slide, title, items, x, y, w, h, {titleColor=C.cyan}={}) {
  slide.addShape("rect", { x, y, w, h, fill:{color:C.panelBg}, line:{color:"1E3A5F", width:1.5} });
  slide.addText(title, { x:x+0.12, y:y+0.09, w:w-0.2, h:0.22, fontSize:8.5, bold:true, color:titleColor, fontFace:"Calibri", charSpacing:1 });
  const rows = items.map((it,i) => ({
    text: it.replace(/^•\s*/,""),
    options:{ bullet:!it.startsWith("•")&&!it.startsWith("─"), breakLine:i<items.length-1,
              color:it.startsWith("─")?"6A8AAA":C.lightText, fontSize:it.startsWith("─")?8:9, fontFace:"Calibri" }
  }));
  slide.addText(rows, { x:x+0.15, y:y+0.35, w:w-0.28, h:h-0.45, valign:"top" });
}
function lightPanel(slide, title, items, x, y, w, h, accentColor=C.cyan) {
  slide.addShape("rect", { x, y, w, h, fill:{color:C.offWhite}, line:{color:"D0DCE8", width:1} });
  slide.addShape("rect", { x, y, w:0.05, h, fill:{color:accentColor}, line:{color:accentColor} });
  slide.addText(title, { x:x+0.18, y:y+0.08, w:w-0.25, h:0.23, fontSize:9, bold:true, color:accentColor, fontFace:"Calibri", charSpacing:1 });
  const rows = items.map((it,i) => ({
    text: it.replace(/^•\s*/,""),
    options:{ bullet:!it.startsWith("•")&&!it.startsWith("─"), breakLine:i<items.length-1,
              color:it.startsWith("─")?"999999":C.bodyText, fontSize:it.startsWith("─")?8:9, fontFace:"Calibri" }
  }));
  slide.addText(rows, { x:x+0.2, y:y+0.35, w:w-0.3, h:h-0.45, valign:"top" });
}
function formulaBox(slide, lines, x, y, w, h) {
  slide.addShape("rect", { x, y, w, h, fill:{color:"0A1628"}, line:{color:C.cyan, width:1.5} });
  const rows = lines.map((l,i) => ({ text:l, options:{ breakLine:i<lines.length-1, color:"C8E8F8", fontSize:8.5, fontFace:"Courier New" } }));
  slide.addText(rows, { x:x+0.14, y:y+0.1, w:w-0.28, h:h-0.18, valign:"top" });
}
function diagBox(slide, x, y, w, h, color=C.panelBg) {
  slide.addShape("rect", { x, y, w, h, fill:{color}, line:{color:"1E3A5F", width:1} });
}
function arrow(slide, x1, y1, x2, y2, color=C.cyan, width=1.5) {
  slide.addShape("line", { x:x1, y:y1, w:x2-x1, h:y2-y1, line:{color, width, endArrowType:"triangle"} });
}
function dblArrow(slide, x1, y1, x2, y2, color=C.gold, width=1.5) {
  slide.addShape("line", { x:x1, y:y1, w:x2-x1, h:y2-y1, line:{color, width, endArrowType:"triangle", beginArrowType:"triangle"} });
}
function lbl(slide, text, x, y, w, h, {color=C.lightText, size=8, bold=false, align="center", italic=false}={}) {
  slide.addText(text, { x, y, w, h, fontSize:size, color, fontFace:"Calibri", align, valign:"middle", bold, italic });
}
function rndBox(slide, x, y, w, h, fillColor, borderColor, text, textColor, fontSize=9) {
  slide.addShape("roundRect", { x, y, w, h, fill:{color:fillColor}, line:{color:borderColor, width:1.5}, rectRadius:0.06 });
  if (text) lbl(slide, text, x, y, w, h, {color:textColor, size:fontSize, bold:true});
}

// ─────────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
// DIAGRAM FUNCTIONS  (5 tiers × 4 LOs = 20 unique diagrams)
// ══════════════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────

// ── LO1: Verifying Unitarity ÛÛ† = 1̂ ────────────────────────────────

function diag_LO1_HS(slide, x, y, w, h) {
  // Rotation of a clock arrow — same length, different direction
  diagBox(slide, x, y, w, h);
  lbl(slide, "Rotation Preserves Length", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const cx=x+w/2, cy=y+h*0.48, r=0.75;
  // Circle
  slide.addShape("ellipse", {x:cx-r, y:cy-r, w:r*2, h:r*2, fill:{color:"1A3A5A", transparency:50}, line:{color:C.adv, width:1.5}});
  // Original vector
  arrow(slide, cx, cy, cx+r*0.82, cy-r*0.57, C.gold, 2.5);
  lbl(slide, "|ψ⟩", cx+r*0.85, cy-r*0.65, 0.4, 0.2, {color:C.gold, size:9, bold:true});
  lbl(slide, "‖|ψ⟩‖=1", cx+r*0.55, cy+0.12, 0.7, 0.2, {color:C.gold, size:7.5});
  // Rotated vector (after U)
  const ang = 1.1;
  arrow(slide, cx, cy, cx+r*Math.cos(ang)*0.95, cy-r*Math.sin(ang)*0.95, C.cyan, 2.5);
  lbl(slide, "Û|ψ⟩", cx+r*Math.cos(ang)*1.0, cy-r*Math.sin(ang)*1.02-0.08, 0.52, 0.22, {color:C.cyan, size:9, bold:true});
  // Arc showing rotation angle
  slide.addShape("arc", {x:cx-0.3, y:cy-0.3, w:0.6, h:0.6, fill:{color:"1A3A5A", transparency:60}, line:{color:C.green, width:1}});
  lbl(slide, "θ", cx+0.04, cy-0.2, 0.18, 0.18, {color:C.green, size:8});
  // "same length" annotation
  slide.addShape("line", {x:cx+r*0.1, y:cy+r+0.08, w:r*0.72, h:0, line:{color:C.gold, width:1, dashType:"dash"}});
  slide.addShape("line", {x:cx-r*0.02, y:cy+r+0.08, w:r*Math.cos(ang)*0.93+0.02, h:0, line:{color:C.cyan, width:1, dashType:"dash"}});
  // Formula
  slide.addShape("rect", {x:x+0.1, y:y+h-0.6, w:w-0.2, h:0.5, fill:{color:"0A1628"}, line:{color:C.cyan, width:1}});
  lbl(slide, "‖Û|ψ⟩‖ = ‖|ψ⟩‖  (lengths equal!)", x+0.14, y+h-0.58, w-0.28, 0.46, {color:"C8E8F8", size:8});
}

function diag_LO1_BegUG(slide, x, y, w, h) {
  // Step-by-step: rotation matrix × its adjoint = I
  diagBox(slide, x, y, w, h);
  lbl(slide, "Verification: U(θ) U†(θ) = 1̂", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const bh=0.5, bw=1.1, row1y=y+0.32, row2y=y+1.0, row3y=y+1.7, cx=x+w/2;
  // U(θ) matrix
  rndBox(slide, x+0.15, row1y, bw, bh, "0A2040", C.gold, "", C.gold);
  lbl(slide, "U(θ) =\n[[cosθ, −sinθ],\n [sinθ,  cosθ]]", x+0.15, row1y, bw, bh, {color:C.gold, size:8});
  lbl(slide, "×", x+0.15+bw+0.05, row1y+0.12, 0.22, 0.25, {color:C.white, size:13, bold:true});
  // U†(θ) matrix
  rndBox(slide, x+0.15+bw+0.32, row1y, bw, bh, "0A4020", C.green, "", C.green);
  lbl(slide, "U†(θ) =\n[[cosθ,  sinθ],\n [−sinθ, cosθ]]", x+0.15+bw+0.32, row1y, bw, bh, {color:C.green, size:8});
  // Equals sign + arrow
  arrow(slide, cx, row1y+bh+0.04, cx, row2y-0.04, C.cyan, 1.5);
  lbl(slide, "multiply", cx+0.06, row1y+bh+0.04, 0.6, 0.22, {color:C.mutedText, size:7.5, italic:true});
  // Result row
  rndBox(slide, x+0.15, row2y, w-0.3, bh, "1A3A5A", C.cyan, "", C.cyan);
  lbl(slide, "[[cos²θ+sin²θ,  cosθ·sinθ−sinθ·cosθ],\n [sinθ·cosθ−cosθ·sinθ,  sin²θ+cos²θ]]", x+0.18, row2y, w-0.36, bh, {color:C.lightText, size:7.5});
  arrow(slide, cx, row2y+bh+0.04, cx, row3y-0.04, C.green, 1.5);
  lbl(slide, "simplify (cos²+sin²=1)", cx-0.55, row2y+bh+0.05, 1.3, 0.2, {color:C.mutedText, size:7.5, italic:true});
  // Final = I
  rndBox(slide, cx-0.55, row3y, 1.1, bh, "0A3820", C.green, "", C.green);
  lbl(slide, "[[1, 0],\n [0, 1]] = 1̂  ✓", cx-0.55, row3y, 1.1, bh, {color:C.green, size:9, bold:true});
}

function diag_LO1_AdvUG(slide, x, y, w, h) {
  // Logical equivalences: UU†=1 ⟺ isometry ⟺ inner product preserving ⟺ invertible + norm preserving
  diagBox(slide, x, y, w, h);
  lbl(slide, "Equivalent Characterisations of Unitarity", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const boxes = [
    {text:"UU† = U†U = 1̂\n(algebraic)", color:C.cyan,   y:y+0.34},
    {text:"‖U|ψ⟩‖ = ‖|ψ⟩‖\n(isometry)", color:C.gold,   y:y+1.22},
    {text:"⟨Uφ|Uψ⟩ = ⟨φ|ψ⟩\n(inner product)", color:C.green,  y:y+2.10},
    {text:"Bijective + bounded\n+ bounded inverse", color:C.purple, y:y+2.98},
  ];
  const bw=w-0.28, bh=0.55;
  boxes.forEach((b,i) => {
    rndBox(slide, x+0.14, b.y, bw, bh, "0A1525", b.color, b.text, b.color, 9);
    if (i<boxes.length-1) {
      dblArrow(slide, x+0.14+bw/2, b.y+bh+0.02, x+0.14+bw/2, b.y+bh+0.3, C.adv, 1.2);
      lbl(slide, "⟺", x+0.14+bw/2+0.04, b.y+bh+0.04, 0.3, 0.22, {color:C.adv, size:11, bold:true});
    }
  });
  slide.addShape("rect", {x:x+0.14, y:y+h-0.52, w:bw, h:0.42, fill:{color:"0A1628"}, line:{color:C.cyan, width:1}});
  lbl(slide, "On finite-dim spaces, any ONE implies all others.\nOn infinite-dim ℋ, must verify UU† = U†U = 1̂ explicitly.", x+0.18, y+h-0.51, bw-0.08, 0.4, {color:"A0C4D8", size:7.5});
}

function diag_LO1_MSc(slide, x, y, w, h) {
  // Unitary group U(n) as a Lie group — manifold, Lie algebra u(n)
  diagBox(slide, x, y, w, h);
  lbl(slide, "U(n) as a Lie Group", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Group axioms table
  const rows = [
    ["Closure",   "UV ∈ U(n) when U,V ∈ U(n)", C.cyan],
    ["Identity",  "1̂ ∈ U(n): 1̂·1̂† = 1̂", C.gold],
    ["Inverse",   "U⁻¹ = U† ∈ U(n)", C.green],
    ["Assoc.",    "(UV)W = U(VW) ✓", C.adv],
    ["Manifold",  "dim U(n) = n²  (real)", C.purple],
    ["Lie alg.",  "u(n) = {A : A† = −A}", C.coral],
  ];
  rows.forEach(([prop, val, col], i) => {
    const ry = y+0.35+i*0.52;
    slide.addShape("rect", {x:x+0.14, y:ry, w:1.2, h:0.42, fill:{color:"0A1828"}, line:{color:col, width:1}});
    lbl(slide, prop, x+0.14, ry, 1.2, 0.42, {color:col, size:8.5, bold:true});
    slide.addShape("rect", {x:x+1.38, y:ry, w:w-1.52, h:0.42, fill:{color:"07111E"}, line:{color:"1A3A5A", width:0.75}});
    lbl(slide, val, x+1.42, ry, w-1.6, 0.42, {color:C.lightText, size:8.5, align:"left"});
  });
  // Subgroup chain
  slide.addShape("rect", {x:x+0.14, y:y+h-0.7, w:w-0.28, h:0.58, fill:{color:"0A1628"}, line:{color:C.teal, width:1}});
  lbl(slide, "SU(n) ⊂ U(n):  det(U) = 1  (special unitary)\ndim SU(n) = n²−1;  SU(2) ≅ S³ (3-sphere)", x+0.18, y+h-0.68, w-0.36, 0.54, {color:"A0C4D8", size:8, align:"left"});
}

function diag_LO1_PhD(slide, x, y, w, h) {
  // Spectral theorem for unitary operators: spectrum on S¹, spectral measure
  diagBox(slide, x, y, w, h);
  lbl(slide, "Spectral Theory of Unitary Operators", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Complex plane with unit circle
  const cx=x+w*0.42, cy=y+h*0.44, r=1.0;
  slide.addShape("ellipse", {x:cx-r, y:cy-r*0.85, w:r*2, h:r*1.7, fill:{color:"0A1628", transparency:20}, line:{color:"2A5A7A", width:1}});
  // Unit circle
  slide.addShape("ellipse", {x:cx-r*0.68, y:cy-r*0.58, w:r*1.36, h:r*1.16, fill:{color:"0D1B2A", transparency:40}, line:{color:C.cyan, width:2}});
  // Axes
  arrow(slide, cx-r*0.9, cy, cx+r*0.9, cy, "4A7A9A", 1);
  arrow(slide, cx, cy+r*0.82, cx, cy-r*0.82, "4A7A9A", 1);
  lbl(slide, "Re", cx+r*0.9+0.04, cy-0.1, 0.22, 0.2, {color:"6AAABB", size:8});
  lbl(slide, "Im", cx-0.14, cy-r*0.82-0.2, 0.3, 0.18, {color:"6AAABB", size:8});
  // Eigenvalues on S¹
  const angles = [0.3, 0.9, 1.6, 2.4, 3.5, 4.8, 5.6];
  angles.forEach(a => {
    slide.addShape("ellipse", {x:cx+r*0.66*Math.cos(a)-0.065, y:cy-r*0.56*Math.sin(a)-0.065, w:0.13, h:0.13, fill:{color:C.cyan}, line:{color:C.cyan}});
  });
  lbl(slide, "σ(U) ⊆ S¹", cx+r*0.28, cy-r*0.52, 0.72, 0.2, {color:C.cyan, size:8, bold:true});
  // Spectral theorem box
  const bx = x+w*0.55, by = y+0.34;
  rndBox(slide, bx, by, w*(1-0.55)-0.12, 1.42, "0A1A2A", C.gold, "", C.gold);
  lbl(slide, "Spectral Theorem\nfor Unitary U:\nU = ∫_{S¹} λ dP(λ)\nwhere P is a PVM\non the unit circle.\nSpectrum is arc-like.", bx+0.06, by+0.04, w*(1-0.55)-0.22, 1.34, {color:C.gold, size:8, align:"left"});
  // Properties
  const props = ["• Finite dim: U diagonalisable", "• Infinite dim: spectral meas.", "• U normal ⟹ spectral thm", "• Connected: e^{iA} form"];
  props.forEach((p,i) => lbl(slide, p, x+0.14, y+h-1.05+i*0.24, w-0.28, 0.23, {color:C.lightText, size:8, align:"left"}));
}

// ── LO2: Unitaries Preserve Norms & Probabilities ────────────────────

function diag_LO2_HS(slide, x, y, w, h) {
  // Before/after diagram: arrows same length after rotation
  diagBox(slide, x, y, w, h);
  lbl(slide, "Probability Is Physical — Must Be Preserved", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Two side-by-side experiment diagrams
  const left_x = x+0.18, right_x = x+w/2+0.1;
  ["BEFORE", "AFTER U"].forEach((lab, side) => {
    const bx = side===0 ? left_x : right_x;
    const col = side===0 ? C.gold : C.cyan;
    lbl(slide, lab, bx, y+0.32, w/2-0.2, 0.22, {color:col, size:8, bold:true});
    // State vector
    const vcx = bx+0.55, vcy = y+1.3;
    slide.addShape("ellipse", {x:vcx-0.08, y:vcy-0.08, w:0.16, h:0.16, fill:{color:col}, line:{color:col}});
    arrow(slide, vcx, vcy, vcx+0.55, vcy-0.45, col, 2);
    arrow(slide, vcx, vcy, vcx-0.35, vcy-0.55, col, 1.5);
    lbl(slide, side===0?"|ψ⟩":"U|ψ⟩", vcx+0.56, vcy-0.55, 0.45, 0.22, {color:col, size:8.5, bold:true});
    // Probability bars
    ["α²","β²"].forEach((p,i) => {
      const bary = y+2.05+i*0.45, barh=0.32, barw=(i===0?0.7:0.45);
      slide.addShape("rect", {x:bx, y:bary, w:barw, h:barh, fill:{color:col, transparency:30}, line:{color:col, width:1}});
      lbl(slide, p, bx+barw+0.04, bary, 0.3, barh, {color:col, size:8});
    });
    lbl(slide, "P(a₁)=|α|²", bx, y+3.1, 0.85, 0.2, {color:C.mutedText, size:7.5});
    lbl(slide, "P(a₂)=|β|²", bx, y+3.32, 0.85, 0.2, {color:C.mutedText, size:7.5});
  });
  // = sign between
  lbl(slide, "=", x+w/2-0.12, y+2.1, 0.24, 0.7, {color:C.white, size:16, bold:true});
  // Formula at bottom
  slide.addShape("rect", {x:x+0.1, y:y+h-0.58, w:w-0.2, h:0.48, fill:{color:"0A1628"}, line:{color:C.cyan, width:1}});
  lbl(slide, "|⟨aₙ|Uψ⟩|² = |⟨U†aₙ|ψ⟩|² = |⟨aₙ|ψ⟩|²  ✓", x+0.14, y+h-0.56, w-0.28, 0.44, {color:"C8E8F8", size:8});
}

function diag_LO2_BegUG(slide, x, y, w, h) {
  // Proof chain with arrows: UU†=1 → ⟨Uφ|Uψ⟩=⟨φ|ψ⟩ → |⟨Uφ|Uψ⟩|²=|⟨φ|ψ⟩|²
  diagBox(slide, x, y, w, h);
  lbl(slide, "Proof Chain: Unitarity → Probability Preservation", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const steps = [
    {top:"Given", body:"UU† = 1̂", color:C.cyan},
    {top:"Step 1", body:"⟨Uφ|Uψ⟩ = ⟨φ|U†Uψ⟩ = ⟨φ|ψ⟩", color:C.gold},
    {top:"Step 2", body:"‖U|ψ⟩‖² = ⟨Uψ|Uψ⟩ = ⟨ψ|ψ⟩ = ‖|ψ⟩‖²", color:C.green},
    {top:"Step 3", body:"|⟨Uφ|Uψ⟩|² = |⟨φ|ψ⟩|²\n(transition probabilities equal)", color:C.purple},
  ];
  steps.forEach((s,i) => {
    const sy = y+0.34+i*0.95;
    rndBox(slide, x+0.14, sy, w-0.28, 0.78, "0A1525", s.color, "", s.color);
    lbl(slide, s.top, x+0.22, sy+0.04, 0.7, 0.2, {color:s.color, size:8, bold:true, align:"left"});
    lbl(slide, s.body, x+0.22, sy+0.26, w-0.46, 0.46, {color:C.lightText, size:8.5, align:"left"});
    if (i<steps.length-1) {
      arrow(slide, x+w/2, sy+0.78+0.01, x+w/2, sy+0.95-0.01, s.color, 1.2);
    }
  });
}

function diag_LO2_AdvUG(slide, x, y, w, h) {
  // Spectral invariance: σ(UAU†) = σ(A) — proof diagram
  diagBox(slide, x, y, w, h);
  lbl(slide, "Spectral Invariance Under Unitary Conjugation", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Center column: σ(A) = σ(UAU†)
  const cx=x+w/2;
  // Original operator
  rndBox(slide, x+0.14, y+0.34, w-0.28, 0.5, "0A2040", C.gold, "Â  with  Â|aₙ⟩ = aₙ|aₙ⟩", C.gold);
  arrow(slide, cx, y+0.84, cx, y+1.12, C.cyan, 1.5);
  lbl(slide, "conjugate by U", cx+0.06, y+0.85, 1.0, 0.22, {color:C.cyan, size:7.5, italic:true});
  // Conjugated
  rndBox(slide, x+0.14, y+1.15, w-0.28, 0.5, "0A2040", C.green, "Â' = ÛÂÛ†  with eigenvectors Û|aₙ⟩", C.green);
  arrow(slide, cx, y+1.65, cx, y+1.93, C.green, 1.5);
  lbl(slide, "same eigenvalues", cx+0.06, y+1.66, 1.0, 0.22, {color:C.green, size:7.5, italic:true});
  // Key formula box
  slide.addShape("rect", {x:x+0.14, y:y+1.96, w:w-0.28, h:0.52, fill:{color:"0A3020"}, line:{color:C.green, width:1.5}});
  lbl(slide, "σ(ÛÂÛ†) = σ(Â)  [eigenvalues unchanged]\nÛÂÛ†(Û|aₙ⟩) = aₙ(Û|aₙ⟩)  [eigenvectors rotated]", x+0.18, y+1.98, w-0.36, 0.48, {color:C.green, size:9, align:"left"});
  // Physical meaning
  slide.addShape("rect", {x:x+0.14, y:y+2.62, w:w-0.28, h:0.62, fill:{color:"0A1820"}, line:{color:C.teal, width:1}});
  lbl(slide, "Physical meaning: measurement outcomes (eigenvalues)\nare the same in any unitarily equivalent basis.\nPhysics is representation-independent!", x+0.18, y+2.64, w-0.36, 0.58, {color:C.lightText, size:8, align:"left"});
  // Trace and determinant
  rndBox(slide, x+0.14, y+h-0.68, (w-0.36)/2, 0.54, "0A1020", C.adv, "Tr(UAU†)=Tr(A)", C.adv, 8);
  rndBox(slide, x+0.14+(w-0.36)/2+0.08, y+h-0.68, (w-0.36)/2, 0.54, "0A1020", C.purple, "det(UAU†)=det(A)", C.purple, 8);
}

function diag_LO2_MSc(slide, x, y, w, h) {
  // Unitary equivalence of representations — basis independence diagram
  diagBox(slide, x, y, w, h);
  lbl(slide, "Unitary Equivalence & Representation Independence", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Two bases connected by U
  const bx1=x+0.14, bx2=x+w-1.5-0.14, bw2=1.5, bh2=0.6, by=y+0.38;
  rndBox(slide, bx1, by, bw2, bh2, "0A2040", C.cyan, "Basis {|eₙ⟩}\nH = ΣEₙ|eₙ⟩⟨eₙ|", C.cyan, 8);
  rndBox(slide, bx2, by, bw2, bh2, "0A4020", C.green, "Basis {|fₙ⟩=U|eₙ⟩}\nH'= UHU†", C.green, 8);
  dblArrow(slide, bx1+bw2+0.04, by+bh2/2, bx2-0.04, by+bh2/2, C.gold, 1.8);
  lbl(slide, "U (unitary)", bx1+bw2+0.06, by+bh2/2-0.2, bx2-bx1-bw2-0.1, 0.22, {color:C.gold, size:8.5, bold:true});
  // Equivalence statement
  slide.addShape("rect", {x:x+0.14, y:y+1.18, w:w-0.28, h:0.5, fill:{color:"0A1628"}, line:{color:C.gold, width:1.5}});
  lbl(slide, "Unitarily equivalent: σ(H) = σ(H')\nTr(e^{-βH}) = Tr(e^{-βH'})  [partition function the same]", x+0.18, y+1.2, w-0.36, 0.46, {color:"C8E8F8", size:8.5, align:"left"});
  // Practical consequence — 3 coloured items
  [[C.cyan,"Same energy spectrum", y+1.85],
   [C.gold,"Same time evolution dynamics", y+2.22],
   [C.green,"Different matrix form — same physics", y+2.59],
   [C.purple,"All unitary reps of same algebra are equiv.", y+2.96],
  ].forEach(([col, text, ry]) => {
    slide.addShape("rect", {x:x+0.14, y:ry, w:w-0.28, h:0.3, fill:{color:"0A1220"}, line:{color:col, width:1}});
    lbl(slide, "▶  "+text, x+0.22, ry, w-0.38, 0.3, {color:col, size:8.5, align:"left"});
  });
}

function diag_LO2_PhD(slide, x, y, w, h) {
  // Topological group structure of U(ℋ) with norm and strong topologies
  diagBox(slide, x, y, w, h);
  lbl(slide, "Topologies on U(ℋ) and Their Physical Roles", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const topo = [
    {name:"Norm topology", def:"Uₙ→U iff ‖Uₙ−U‖→0", prop:"Strongest; rarely physically relevant", col:C.coral, ex:"Finite-dimensional U(n)"},
    {name:"Strong topology", def:"Uₙ→U iff ‖Uₙ|ψ⟩−U|ψ⟩‖→0 ∀|ψ⟩", prop:"Stone's thm uses this; Schrödinger evo", col:C.cyan, ex:"e^{−iHt} as t→t₀"},
    {name:"Weak topology", def:"Uₙ→U iff ⟨φ|Uₙψ⟩→⟨φ|Uψ⟩ ∀|φ⟩,|ψ⟩", prop:"Weakest; used in vN algebra theory", col:C.gold, ex:"Infinite tensor products"},
  ];
  topo.forEach((t,i) => {
    const ty = y+0.35+i*1.3;
    rndBox(slide, x+0.14, ty, w-0.28, 1.12, "0A1020", t.col, "", t.col);
    lbl(slide, t.name, x+0.22, ty+0.04, w-0.44, 0.22, {color:t.col, size:9, bold:true, align:"left"});
    lbl(slide, t.def, x+0.22, ty+0.28, w-0.44, 0.24, {color:C.lightText, size:8, align:"left"});
    lbl(slide, t.prop, x+0.22, ty+0.54, w-0.44, 0.22, {color:C.mutedText, size:7.5, italic:true, align:"left"});
    slide.addShape("line", {x:x+0.22, y:ty+0.78, w:w-0.52, h:0, line:{color:"1A3A5A", width:0.5}});
    lbl(slide, "Ex: "+t.ex, x+0.22, ty+0.82, w-0.44, 0.22, {color:"7ABADB", size:7.5, align:"left"});
  });
}

// ── LO3: Physical Symmetries as Unitary Operators ────────────────────

function diag_LO3_HS(slide, x, y, w, h) {
  // Bloch sphere with three rotation axes labelled
  diagBox(slide, x, y, w, h);
  lbl(slide, "Quantum Rotations on the Bloch Sphere", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const cx=x+w/2, cy=y+h*0.5;
  const R=1.1;
  // Sphere outline
  slide.addShape("ellipse", {x:cx-R, y:cy-R*0.85, w:R*2, h:R*1.7, fill:{color:"0D1B2A"}, line:{color:"2A5A7A", width:1.5}});
  slide.addShape("ellipse", {x:cx-R, y:cy-R*0.28, w:R*2, h:R*0.56, fill:{color:"0D1B2A"}, line:{color:"1A3A5A", width:1, dashType:"dash"}});
  // Axes
  arrow(slide, cx, cy+R*0.82, cx, cy-R*0.82, C.cyan, 1.8);
  lbl(slide, "z (Ŝz)", cx+0.04, cy-R*0.88, 0.5, 0.2, {color:C.cyan, size:8, bold:true});
  arrow(slide, cx-R*0.92, cy, cx+R*0.92, cy, C.gold, 1.5);
  lbl(slide, "x (Ŝx)", cx+R*0.9, cy-0.12, 0.42, 0.2, {color:C.gold, size:8, bold:true});
  // Diagonal axis (y)
  arrow(slide, cx+0.28, cy+R*0.35, cx-0.28, cy-R*0.35, C.green, 1.5);
  lbl(slide, "y (Ŝy)", cx-0.64, cy-R*0.42, 0.42, 0.2, {color:C.green, size:8, bold:true});
  // State point
  const sx = cx+R*0.5, sy = cy-R*0.6;
  slide.addShape("ellipse", {x:sx-0.09, y:sy-0.09, w:0.18, h:0.18, fill:{color:C.white}, line:{color:C.white}});
  slide.addShape("line", {x:cx, y:cy, w:sx-cx, h:sy-cy, line:{color:C.white, width:1.2, dashType:"dash"}});
  lbl(slide, "|ψ⟩", sx+0.1, sy-0.18, 0.32, 0.2, {color:C.white, size:8.5, bold:true});
  // Legend
  slide.addShape("rect", {x:x+0.1, y:y+h-0.7, w:w-0.2, h:0.6, fill:{color:"0A1628"}, line:{color:C.cyan, width:1}});
  lbl(slide, "Uz(θ) = e^{−iθŜz/ℏ}  (z-rotation, cyan)\nUx(φ) = e^{−iφŜx/ℏ}  (x-rotation, gold)", x+0.14, y+h-0.68, w-0.28, 0.56, {color:"C8E8F8", size:8, align:"left"});
}

function diag_LO3_BegUG(slide, x, y, w, h) {
  // Three physical symmetries: rotation, translation, phase — boxes with generators and examples
  diagBox(slide, x, y, w, h);
  lbl(slide, "Three Fundamental Physical Symmetries", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const symms = [
    {name:"Phase", oper:"Û_φ = e^{iφ}", gen:"Generator: 1̂", example:"Global phase e^{iφ}|ψ⟩\nobservable unchanged", col:C.adv, conserved:"probability"},
    {name:"Rotation", oper:"Û(θ) = e^{−iθJ/ℏ}", gen:"Generator: Ĵ (angular mom.)", example:"Spin rotation on Bloch sphere\nUz(θ)|+⟩ = e^{−iθ/2}|+⟩", col:C.gold, conserved:"angular momentum"},
    {name:"Translation", oper:"T̂(a) = e^{−iap̂/ℏ}", gen:"Generator: p̂ (momentum)", example:"T̂(a)ψ(x) = ψ(x−a)\nshifts wavefunction by a", col:C.green, conserved:"momentum"},
  ];
  const bw=(w-0.38)/3, bh=h-0.55;
  symms.forEach((s,i) => {
    const bx = x+0.12+i*(bw+0.07);
    rndBox(slide, bx, y+0.32, bw, bh-0.18, "0A1525", s.col, "", s.col);
    lbl(slide, s.name, bx, y+0.35, bw, 0.26, {color:s.col, size:9, bold:true});
    slide.addShape("line", {x:bx+0.06, y:y+0.63, w:bw-0.12, h:0, line:{color:"2A4A6A", width:0.75}});
    lbl(slide, s.oper, bx+0.06, y+0.67, bw-0.12, 0.24, {color:"C8E8F8", size:8, align:"left"});
    lbl(slide, s.gen, bx+0.06, y+0.93, bw-0.12, 0.22, {color:C.lightText, size:7.5, align:"left"});
    slide.addShape("line", {x:bx+0.06, y:y+1.17, w:bw-0.12, h:0, line:{color:"2A4A6A", width:0.75}});
    lbl(slide, s.example, bx+0.06, y+1.21, bw-0.12, 0.55, {color:C.mutedText, size:7.5, align:"left"});
    slide.addShape("rect", {x:bx+0.06, y:y+bh-0.52, w:bw-0.12, h:0.3, fill:{color:s.col, transparency:70}, line:{color:s.col, width:0.75}});
    lbl(slide, "Conserves: "+s.conserved, bx+0.06, y+bh-0.52, bw-0.12, 0.3, {color:s.col, size:7, bold:true});
  });
}

function diag_LO3_AdvUG(slide, x, y, w, h) {
  // Noether connection: [H,G]=0 ↔ symmetry ↔ conservation
  diagBox(slide, x, y, w, h);
  lbl(slide, "Noether Correspondence: Symmetry ↔ Conservation", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Central triangle diagram
  const cx=x+w/2, cy=y+h*0.42;
  const pts = [[cx, y+0.34],[x+0.2, y+h*0.72],[x+w-0.2, y+h*0.72]];
  // Triangle edges
  pts.forEach((_,i) => {
    const j=(i+1)%3;
    slide.addShape("line", {x:pts[i][0], y:pts[i][1], w:pts[j][0]-pts[i][0], h:pts[j][1]-pts[i][1], line:{color:"2A5A7A", width:1, dashType:"dash"}});
  });
  // Three corner boxes
  rndBox(slide, cx-0.75, y+0.28, 1.5, 0.52, "0A2040", C.cyan, "Continuous\nSymmetry Û(θ)", C.cyan, 8);
  rndBox(slide, x+0.1, y+h*0.72-0.0, 1.65, 0.52, "0A3020", C.green, "Hermitian\nGenerator Ĝ", C.green, 8);
  rndBox(slide, x+w-1.75, y+h*0.72, 1.55, 0.52, "2A2000", C.gold, "Conserved\nQuantity ⟨Ĝ⟩=const", C.gold, 8);
  // Arrows with conditions
  arrow(slide, cx-0.1, y+0.8, x+0.82, y+h*0.72-0.04, C.cyan, 1.2);
  lbl(slide, "Stone: Û=e^{iθĜ}", x+0.2, y+h*0.44, 0.85, 0.3, {color:C.cyan, size:7.5, italic:true});
  arrow(slide, x+1.75, y+h*0.72+0.26, x+w-1.76, y+h*0.72+0.26, C.gold, 1.2);
  lbl(slide, "[Ĥ,Ĝ]=0", x+0.2+1.6, y+h*0.72+0.08, 1.0, 0.22, {color:C.gold, size:8, bold:true});
  arrow(slide, x+w-1.78, y+h*0.72, cx+0.2, y+0.8, C.green, 1.2);
  lbl(slide, "d⟨Ĝ⟩/dt=0", x+w-1.3, y+h*0.44, 1.0, 0.3, {color:C.green, size:7.5, italic:true});
  // Examples table
  slide.addShape("rect", {x:x+0.14, y:y+h-0.92, w:w-0.28, h:0.8, fill:{color:"0A1628"}, line:{color:"2A5A7A", width:1}});
  [["Rotation U(θ)", "Ĵ", "[Ĥ,Ĵ]=0", "angular momentum"],
   ["Translation T(a)", "p̂", "[Ĥ,p̂]=0", "momentum"],
   ["Time evolution U(t)", "Ĥ", "[Ĥ,Ĥ]=0", "energy"],
  ].forEach(([sym,gen,comm,cons],i) => {
    const cols = [1.3, 0.55, 1.0, 1.6];
    const vals = [sym, gen, comm, cons];
    const colColors = [C.cyan, C.gold, C.adv, C.green];
    let tx = x+0.18;
    vals.forEach((v, ci) => {
      lbl(slide, v, tx, y+h-0.9+i*0.25, cols[ci]-0.04, 0.24, {color:i===0?C.mutedText:colColors[ci], size:7.5, align:"left"});
      tx += cols[ci];
    });
  });
}

function diag_LO3_MSc(slide, x, y, w, h) {
  // SU(2) ↔ SO(3) double cover diagram with spinor phase flip
  diagBox(slide, x, y, w, h);
  lbl(slide, "SU(2) → SO(3): The Double Cover", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Two circles: SU(2) (large) → SO(3) (smaller)
  const cx1=x+w*0.3, cy=y+h*0.42, r1=0.75;
  const cx2=x+w*0.75, r2=0.55;
  slide.addShape("ellipse", {x:cx1-r1, y:cy-r1*0.8, w:r1*2, h:r1*1.6, fill:{color:"1A2A4A", transparency:40}, line:{color:C.cyan, width:2}});
  lbl(slide, "SU(2)\ndim=3, S³", cx1-0.42, cy-0.3, 0.84, 0.6, {color:C.cyan, size:9, bold:true});
  slide.addShape("ellipse", {x:cx2-r2, y:cy-r2*0.8, w:r2*2, h:r2*1.6, fill:{color:"1A4A2A", transparency:40}, line:{color:C.green, width:2}});
  lbl(slide, "SO(3)\ndim=3, RP³", cx2-0.42, cy-0.3, 0.84, 0.6, {color:C.green, size:9, bold:true});
  // 2:1 arrow
  arrow(slide, cx1+r1+0.04, cy, cx2-r2-0.04, cy, C.gold, 2);
  lbl(slide, "2:1\nhomomorphism", cx1+r1+0.06, cy-0.32, 0.72, 0.38, {color:C.gold, size:8});
  // Kernel {+1,-1}
  lbl(slide, "ker = {+1̂, −1̂}", cx1+r1*0.04, cy+r1*0.74, 0.82, 0.22, {color:C.coral, size:8});
  // Spinor phase flip
  slide.addShape("rect", {x:x+0.14, y:y+h-1.58, w:w-0.28, h:1.48, fill:{color:"0A1025"}, line:{color:C.cyan, width:1}});
  lbl(slide, "Key: Spinor Double Cover", x+0.18, y+h-1.56, w-0.36, 0.24, {color:C.cyan, size:8.5, bold:true, align:"left"});
  const lines2 = [
    "• 2π rotation in SO(3): physical body returns to start",
    "• 2π rotation in SU(2): spinor gains phase −1̂",
    "• 4π rotation: spinor returns to +1̂ (original)",
    "• R_z(2π) = e^{−iπσ_z} = −1̂  (not +1̂ !)",
    "• Detectable via neutron interference experiments",
  ];
  lines2.forEach((l,i) => lbl(slide, l, x+0.18, y+h-1.3+i*0.22, w-0.36, 0.22, {color:C.lightText, size:8, align:"left"}));
}

function diag_LO3_PhD(slide, x, y, w, h) {
  // Projective representations, central extensions, U(1) cocycle
  diagBox(slide, x, y, w, h);
  lbl(slide, "Projective Representations and Central Extensions", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Two-row comparison
  const items = [
    {title:"True Representation",   body:"π: G → U(ℋ)\nπ(g₁g₂) = π(g₁)π(g₂)\n(strict homomorphism)", color:C.green},
    {title:"Projective Repr.",      body:"π: G → U(ℋ)/U(1)\nπ(g₁)π(g₂) = ω(g₁,g₂)π(g₁g₂)\nwhere ω: G×G → U(1) (cocycle)", color:C.gold},
    {title:"Central Extension",     body:"1 → U(1) → Ĝ → G → 1\nLift projective repr. to true repr. of Ĝ\nExample: SU(2) is central ext. of SO(3)", color:C.cyan},
    {title:"Physical consequence",  body:"Spin-½ particles carry projective rep. of SO(3)\nSO(3) has no faithful spin-½ true repr.\nMust use its cover SU(2)", color:C.adv},
  ];
  items.forEach((it,i) => {
    const iy = y+0.34+i*1.0;
    rndBox(slide, x+0.14, iy, w-0.28, 0.85, "0A1020", it.color, "", it.color);
    lbl(slide, it.title, x+0.22, iy+0.04, w-0.44, 0.22, {color:it.color, size:8.5, bold:true, align:"left"});
    lbl(slide, it.body, x+0.22, iy+0.28, w-0.44, 0.52, {color:C.lightText, size:7.5, align:"left"});
  });
}

// ── LO4: Û = e^{iĜ} and Stone's Theorem ──────────────────────────────

function diag_LO4_HS(slide, x, y, w, h) {
  // Taylor series visualisation for e^{iθ} on unit circle
  diagBox(slide, x, y, w, h);
  lbl(slide, "Building e^{iθ} as an Infinite Sum", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Show partial sums converging to unit circle point
  const cx=x+w*0.55, cy=y+h*0.48, r=0.85;
  slide.addShape("ellipse", {x:cx-r, y:cy-r*0.88, w:r*2, h:r*1.76, fill:{color:"0A1628"}, line:{color:C.adv, width:1.5, dashType:"dash"}});
  // Exact value
  slide.addShape("ellipse", {x:cx+r*0.54-0.08, y:cy-r*0.6-0.08, w:0.16, h:0.16, fill:{color:C.green}, line:{color:C.green}});
  lbl(slide, "e^{iθ}", cx+r*0.6, cy-r*0.68, 0.38, 0.2, {color:C.green, size:9, bold:true});
  // Partial sum vectors (tail to head)
  const terms = [[1,0],[0,0.7],[-0.24,0],[-0.0,0.08]];
  let px=cx, py=cy;
  const tcolors=[C.gold, C.cyan, C.coral, C.green];
  terms.forEach(([dx,dy],i) => {
    const nx=px+dx*r*0.75, ny=py-dy*r*0.75;
    arrow(slide, px, py, nx, ny, tcolors[i], 1.8);
    px=nx; py=ny;
  });
  // Term labels
  slide.addShape("rect", {x:x+0.12, y:y+0.32, w:w*0.38, h:1.8, fill:{color:"0A1020"}, line:{color:"2A4A6A", width:1}});
  const termLabels=["1   (n=0)","iθ   (n=1)","(iθ)²/2!","(iθ)³/3!"];
  termLabels.forEach((tl,i) => {
    slide.addShape("rect", {x:x+0.18, y:y+0.4+i*0.42, w:0.12, h:0.12, fill:{color:tcolors[i]}, line:{color:tcolors[i]}});
    lbl(slide, tl, x+0.34, y+0.38+i*0.42, w*0.38-0.26, 0.22, {color:tcolors[i], size:8, align:"left"});
  });
  lbl(slide, "Add these\nvectors head\nto tail →", x+0.15, y+0.38+4*0.42, w*0.38-0.1, 0.55, {color:C.mutedText, size:7.5, italic:true});
  slide.addShape("rect", {x:x+0.12, y:y+h-0.58, w:w-0.24, h:0.48, fill:{color:"0A1628"}, line:{color:C.cyan, width:1}});
  lbl(slide, "e^{iθ} = 1 + iθ + (iθ)²/2! + (iθ)³/3! + ...\n= cos θ + i sin θ  ← Euler's formula!", x+0.16, y+h-0.56, w-0.32, 0.44, {color:"C8E8F8", size:8});
}

function diag_LO4_BegUG(slide, x, y, w, h) {
  // e^{iθσz} computed step by step — matrix to Bloch sphere
  diagBox(slide, x, y, w, h);
  lbl(slide, "Computing e^{iθσ_z} Step by Step", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const steps = [
    {lab:"Step 1: Eigendecompose σ_z", body:"σ_z = [[1,0],[0,−1]]\nEigenvalues: +1 (|+⟩), −1 (|−⟩)", col:C.cyan},
    {lab:"Step 2: Apply e to eigenvalues", body:"e^{iθσ_z} = e^{iθ}|+⟩⟨+| + e^{−iθ}|−⟩⟨−|", col:C.gold},
    {lab:"Step 3: Write as matrix", body:"e^{iθσ_z} = diag(e^{iθ}, e^{−iθ})", col:C.green},
    {lab:"Step 4: Verify unitarity", body:"diag(e^{iθ},e^{−iθ})·diag(e^{−iθ},e^{iθ}) = 1̂  ✓", col:C.purple},
    {lab:"Step 5: Physical meaning", body:"Rotation by 2θ around z-axis on Bloch sphere", col:C.adv},
  ];
  steps.forEach((s,i) => {
    const sy = y+0.32+i*0.82;
    slide.addShape("rect", {x:x+0.14, y:sy, w:w-0.28, h:0.7, fill:{color:"0A1020"}, line:{color:s.col, width:1.2}});
    lbl(slide, s.lab, x+0.22, sy+0.03, w-0.44, 0.2, {color:s.col, size:8.5, bold:true, align:"left"});
    lbl(slide, s.body, x+0.22, sy+0.26, w-0.44, 0.4, {color:C.lightText, size:8, align:"left"});
  });
}

function diag_LO4_AdvUG(slide, x, y, w, h) {
  // One-parameter group property + Stone's theorem diagram
  diagBox(slide, x, y, w, h);
  lbl(slide, "One-Parameter Unitary Groups & Stone's Theorem", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Group properties
  const grpProps = [
    ["Group property", "U(s+t) = U(s)U(t)", C.cyan],
    ["Identity",       "U(0) = 1̂", C.gold],
    ["Inverse",        "U(−t) = U(t)† = U(t)⁻¹", C.green],
    ["Strong cont.",   "‖U(t)|ψ⟩−|ψ⟩‖→0 as t→0", C.adv],
  ];
  grpProps.forEach(([name,val,col],i) => {
    const gy = y+0.34+i*0.54;
    slide.addShape("rect", {x:x+0.14, y:gy, w:1.5, h:0.44, fill:{color:"0A1828"}, line:{color:col, width:1}});
    lbl(slide, name, x+0.14, gy, 1.5, 0.44, {color:col, size:8, bold:true});
    slide.addShape("rect", {x:x+1.68, y:gy, w:w-1.82, h:0.44, fill:{color:"07111E"}, line:{color:"1A3A5A", width:0.75}});
    lbl(slide, val, x+1.72, gy, w-1.9, 0.44, {color:C.lightText, size:8.5, align:"left"});
  });
  // Stone's theorem box
  slide.addShape("rect", {x:x+0.14, y:y+2.56, w:w-0.28, h:0.68, fill:{color:"0A2A40"}, line:{color:C.cyan, width:2}});
  lbl(slide, "Stone's Theorem", x+0.18, y+2.58, w-0.36, 0.22, {color:C.cyan, size:9, bold:true, align:"left"});
  lbl(slide, "{U(t)} strongly cont. one-param. unitary group\n⟺  ∃! self-adjoint Ĝ s.t. U(t) = e^{−itĜ}", x+0.18, y+2.82, w-0.36, 0.38, {color:"C8E8F8", size:8.5, align:"left"});
  // Generator extraction
  rndBox(slide, x+0.14, y+3.35, (w-0.36)/2, 0.52, "0A1020", C.gold, "d/dt U(t)|ψ⟩|_{t=0}\n= −iĜ|ψ⟩", C.gold, 8);
  rndBox(slide, x+0.14+(w-0.36)/2+0.08, y+3.35, (w-0.36)/2, 0.52, "0A1020", C.green, "|ψ⟩ ∈ D(Ĝ) iff\nlimit exists in ℋ", C.green, 8);
  // Physical examples at bottom
  slide.addShape("rect", {x:x+0.14, y:y+h-0.72, w:w-0.28, h:0.6, fill:{color:"0A1628"}, line:{color:C.teal, width:1}});
  lbl(slide, "U(t)=e^{−iĤt/ℏ}: generator=Ĥ (energy) | T(a)=e^{−iap̂/ℏ}: generator=p̂ (momentum)", x+0.18, y+h-0.70, w-0.36, 0.56, {color:"A0C4D8", size:8});
}

function diag_LO4_MSc(slide, x, y, w, h) {
  // Lie algebra connection: u(n) = {A: A†=−A}, exponential map, flow diagram
  diagBox(slide, x, y, w, h);
  lbl(slide, "Lie Algebra u(n) ↔ Lie Group U(n)", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  // Two boxes: Lie algebra and Lie group
  const lax=x+0.14, lgx=x+w*0.52, bw2=(w-0.38)/2, bh2=0.7, by=y+0.34;
  rndBox(slide, lax, by, bw2, bh2, "0A2040", C.cyan, "", C.cyan);
  lbl(slide, "u(n)  (Lie algebra)", lax, by+0.04, bw2, 0.24, {color:C.cyan, size:8.5, bold:true});
  lbl(slide, "{A ∈ M_n(ℂ) : A†=−A}\nanti-Hermitian matrices\nreal dim = n²", lax+0.06, by+0.28, bw2-0.1, 0.38, {color:C.lightText, size:8, align:"left"});
  rndBox(slide, lgx, by, bw2, bh2, "0A4020", C.green, "", C.green);
  lbl(slide, "U(n)  (Lie group)", lgx, by+0.04, bw2, 0.24, {color:C.green, size:8.5, bold:true});
  lbl(slide, "{U ∈ M_n(ℂ) : UU†=1}\nunitary matrices\nreal dim = n²", lgx+0.06, by+0.28, bw2-0.1, 0.38, {color:C.lightText, size:8, align:"left"});
  // Exponential map arrow
  arrow(slide, lax+bw2+0.04, by+bh2/2, lgx-0.04, by+bh2/2, C.gold, 2);
  lbl(slide, "exp: A ↦ e^A", lax+bw2+0.06, by+bh2/2-0.2, lgx-lax-bw2-0.1, 0.2, {color:C.gold, size:8.5, bold:true});
  // Log map arrow (back)
  arrow(slide, lgx-0.04, by+bh2/2+0.06, lax+bw2+0.04, by+bh2/2+0.06, C.adv, 1.2);
  lbl(slide, "log (local)", lax+bw2+0.06, by+bh2/2+0.08, lgx-lax-bw2-0.1, 0.2, {color:C.adv, size:7.5, italic:true});
  // Tangent space
  slide.addShape("rect", {x:x+0.14, y:y+1.24, w:w-0.28, h:0.6, fill:{color:"0A1628"}, line:{color:C.cyan, width:1}});
  lbl(slide, "u(n) = T₁U(n): the tangent space to U(n) at the identity.\nLie bracket [A,B]=AB−BA (commutator) makes u(n) a Lie algebra.", x+0.18, y+1.26, w-0.36, 0.56, {color:"A0C4D8", size:8, align:"left"});
  // One-parameter subgroup picture
  const rows2 = [
    ["A ∈ u(n)", "e^{tA} ∈ U(n) for all t ∈ ℝ", C.cyan],
    ["iĜ ∈ u(n)", "U(t)=e^{itĜ}: one-param. group", C.gold],
    ["[A,B]→", "BCH: e^A e^B = e^{A+B+[A,B]/2+...}", C.green],
  ];
  rows2.forEach(([a,b,col],i) => {
    const ry = y+1.96+i*0.54;
    slide.addShape("rect", {x:x+0.14, y:ry, w:1.35, h:0.44, fill:{color:"0A1020"}, line:{color:col, width:1}});
    lbl(slide, a, x+0.14, ry, 1.35, 0.44, {color:col, size:8, bold:true});
    slide.addShape("rect", {x:x+1.53, y:ry, w:w-1.67, h:0.44, fill:{color:"07111E"}, line:{color:"1A3A5A", width:0.75}});
    lbl(slide, b, x+1.57, ry, w-1.75, 0.44, {color:C.lightText, size:8, align:"left"});
  });
}

function diag_LO4_PhD(slide, x, y, w, h) {
  // Hille-Yosida theorem and domain of generator
  diagBox(slide, x, y, w, h);
  lbl(slide, "Hille–Yosida and the Domain of the Generator", x, y+0.06, w, 0.2, {color:C.cyan, size:8.5, bold:true});
  const items = [
    {title:"Stone's Theorem (precise)", body:"If {U(t)}_{t∈ℝ} is a strongly cts.\none-param. unitary group on ℋ,\nthen ∃! self-adjoint Ĝ with D(Ĝ) dense\ns.t. U(t) = e^{−itĜ}  (C₀-group).", col:C.cyan, hy:y+0.32},
    {title:"Generator domain", body:"D(Ĝ) = {|ψ⟩ : lim_{t→0} (U(t)−1̂)|ψ⟩/t exists}\nThis is a dense linear subspace of ℋ.\nNot all of ℋ! (unless Ĝ is bounded)", col:C.gold, hy:y+1.38},
    {title:"Hille–Yosida theorem", body:"A closed densely-defined operator Â is\nthe generator of a C₀-semigroup iff\n‖(λ−Â)⁻ⁿ‖ ≤ M/(λ−ω)ⁿ\nfor all λ>ω and n∈ℕ.", col:C.green, hy:y+2.44},
    {title:"Quantum consequence", body:"Self-adjoint Ĝ ⟹ Hille–Yosida satisfied\nwith M=1, ω=0 (unitary group!)\nAny self-adjoint operator generates dynamics.", col:C.adv, hy:y+3.5},
  ];
  items.forEach(it => {
    rndBox(slide, x+0.14, it.hy, w-0.28, 0.92, "0A1020", it.col, "", it.col);
    lbl(slide, it.title, x+0.22, it.hy+0.04, w-0.44, 0.22, {color:it.col, size:8.5, bold:true, align:"left"});
    lbl(slide, it.body, x+0.22, it.hy+0.28, w-0.44, 0.6, {color:C.lightText, size:7.5, align:"left"});
  });
}

// ─────────────────────────────────────────────────────────────────────
// ══════════════════════════════════════════════════════════════════════
// SPECIAL TOPIC SLIDES
// ══════════════════════════════════════════════════════════════════════
// ─────────────────────────────────────────────────────────────────────

function buildLieGroupSlide(pres) {
  const slide = pres.addSlide();
  slide.background = {color:C.lightBg};
  header(slide, "L02 — The Lie Groups U(n) and SU(2)", "From unitary matrices to manifolds, Lie algebras, and the exponential map", "L02", false);
  footer(slide, "QM: Module I.1 — L02", "L02 · Lie Groups U(n) & SU(2)", false);

  lightPanel(slide, "LIE GROUP DEFINITION", [
    "A Lie group is a group that is also a smooth manifold, where group multiplication and inversion are smooth maps.",
    "─",
    "U(n): the set of n×n complex unitary matrices under multiplication. Compact, connected Lie group. dim = n².",
    "─",
    "SU(n): the subgroup with det(U) = 1 (special unitary). dim = n²−1. For n=2: SU(2) ≅ S³ (3-sphere).",
    "─",
    "U(1) = {e^{iθ} : θ ∈ ℝ}: the circle group. Generator: i (or i·1̂). Parametrises global phase.",
  ], 0.25, 0.88, 5.3, 2.32, C.cyan);

  lightPanel(slide, "LIE ALGEBRA AND EXPONENTIAL MAP", [
    "Lie algebra u(n) = {A ∈ M_n(ℂ) : A† = −A} (anti-Hermitian n×n matrices).",
    "─",
    "Exponential map: exp: u(n) → U(n), A ↦ e^A. Local diffeomorphism near 0.",
    "─",
    "Every unitary can be written locally as e^A for A ∈ u(n). Globally: U(n) is connected, exp is surjective.",
    "─",
    "Physical generators: Ĝ Hermitian ⟹ iĜ ∈ u(n) ⟹ e^{iθĜ} ∈ U(n).",
    "─",
    "Lie bracket: [A,B] = AB − BA (commutator). Makes u(n) into a Lie algebra.",
  ], 0.25, 3.3, 5.3, 2.38, C.teal);

  lightPanel(slide, "SU(2) IN QUANTUM MECHANICS", [
    "SU(2) acts on spin-½ particles: Û_n(θ) = cos(θ/2)·1̂ − i sin(θ/2) n̂·σ",
    "SU(2) is the universal cover of SO(3): every rotation in 3D lifts to ±U in SU(2)",
    "Pauli matrices {iσ₁/2, iσ₂/2, iσ₃/2} form the Lie algebra su(2) basis",
  ], 0.25, 5.76, 5.3, 0.9, C.green);

  // RIGHT: comprehensive diagram
  const dx=5.75, dy=0.88, dw=3.95, dh=5.78;
  slide.addShape("rect", {x:dx, y:dy, w:dw, h:dh, fill:{color:C.offWhite}, line:{color:"D0DCE8", width:1}});
  lbl(slide, "Lie Group Hierarchy and Structure", dx, dy+0.07, dw, 0.22, {color:C.darkText, size:9, bold:true, align:"center"});

  // Three groups stacked with exponential connections
  const groups = [
    {g:"U(1)", la:"u(1)={iθ}", dim:"dim=1", col:C.adv,  ex:"e^{iθ}: global phase\ngenerator: 1̂", gy:dy+0.38},
    {g:"SU(2)", la:"su(2)=span{iσᵢ/2}", dim:"dim=3", col:C.cyan, ex:"e^{iθn̂·σ/2}: spin rot.\ngenerators: σᵢ/2", gy:dy+1.56},
    {g:"U(n)", la:"u(n)={A:A†=−A}", dim:"dim=n²", col:C.green, ex:"general unitary\ngenerators: Hermitian", gy:dy+2.74},
  ];
  const gbw=1.1, gbh=0.7;
  groups.forEach(g => {
    rndBox(slide, dx+0.22, g.gy, gbw, gbh, "0A1828", g.col, "", g.col);
    lbl(slide, g.g, dx+0.22, g.gy+0.04, gbw, 0.28, {color:g.col, size:10, bold:true});
    lbl(slide, g.dim, dx+0.22, g.gy+0.32, gbw, 0.22, {color:C.mutedText, size:7.5});
    rndBox(slide, dx+gbw+0.32, g.gy, 1.3, gbh, "0A1020", "2A4A6A", "", "2A4A6A");
    lbl(slide, g.la, dx+gbw+0.36, g.gy+0.04, 1.22, 0.28, {color:"7ABADB", size:7.5, align:"left"});
    lbl(slide, g.ex, dx+gbw+0.36, g.gy+0.34, 1.22, 0.32, {color:C.mutedText, size:7.5, align:"left"});
    // exp arrow
    const ex2 = dx+gbw+0.32+1.3+0.04;
    rndBox(slide, ex2, g.gy+0.12, 0.78, gbh*0.72, "0A1628", C.gold, "exp\nA↦e^A", C.gold, 7.5);
  });

  // SU(2) → SO(3) double cover
  const dcY = dy+3.98;
  lbl(slide, "SU(2) Double Cover of SO(3)", dx+0.15, dcY, dw-0.3, 0.22, {color:C.teal, size:8.5, bold:true, align:"center"});
  rndBox(slide, dx+0.22, dcY+0.26, 1.38, 0.56, "0A2040", C.cyan, "SU(2)  S³\ndim=3", C.cyan, 8);
  rndBox(slide, dx+dw-1.6, dcY+0.26, 1.38, 0.56, "0A4020", C.green, "SO(3)  RP³\ndim=3", C.green, 8);
  arrow(slide, dx+0.22+1.38+0.04, dcY+0.54, dx+dw-1.6-0.04, dcY+0.54, C.gold, 1.8);
  lbl(slide, "2:1  homo.", dx+0.22+1.38+0.06, dcY+0.32, dx+dw-1.6-dx-0.22-1.38-0.1, 0.24, {color:C.gold, size:8});
  lbl(slide, "kernel = {±1̂}", dx+0.22+1.38+0.06, dcY+0.56, dx+dw-1.6-dx-0.22-1.38-0.1, 0.22, {color:C.coral, size:7.5});

  // Pauli matrices table
  slide.addShape("rect", {x:dx+0.15, y:dcY+0.92, w:dw-0.3, h:0.88, fill:{color:"0A1628"}, line:{color:C.gold, width:1}});
  lbl(slide, "su(2) Lie algebra basis:", dx+0.2, dcY+0.94, dw-0.4, 0.22, {color:C.gold, size:8, bold:true, align:"left"});
  [["Xᵢ = iσᵢ/2","i=1,2,3","[X₁,X₂]=X₃","[X₂,X₃]=X₁","[X₃,X₁]=X₂"]].forEach(row => {
    row.forEach((val,ci) => lbl(slide, val, dx+0.2+ci*0.68, dcY+1.18, 0.66, 0.2, {color:C.lightText, size:7.5, align:"left"}));
  });
  lbl(slide, "Structure constants εᵢⱼₖ (Levi-Civita): [Xᵢ,Xⱼ] = εᵢⱼₖXₖ", dx+0.2, dcY+1.42, dw-0.4, 0.32, {color:C.mutedText, size:7.5, align:"left"});
}

function buildStoneTheoremSlide(pres) {
  const slide = pres.addSlide();
  slide.background = {color:C.lightBg};
  header(slide, "L02 — Stone's Theorem: Rigorous Statement and Proof Sketch", "The fundamental link between self-adjoint operators and unitary dynamics", "L02", false);
  footer(slide, "QM: Module I.1 — L02", "L02 · Stone's Theorem", false);

  lightPanel(slide, "STONE'S THEOREM — PRECISE STATEMENT", [
    "Let ℋ be a Hilbert space. The following are in bijection:",
    "─",
    "(A) Strongly continuous one-parameter unitary groups: families {U(t)}_{t∈ℝ} of unitary operators on ℋ with (i) U(s+t)=U(s)U(t); (ii) U(0)=1̂; (iii) ‖U(t)|ψ⟩−|ψ⟩‖→0 as t→0 for all |ψ⟩∈ℋ.",
    "─",
    "(B) Self-adjoint operators Ĝ on ℋ (with dense domain D(Ĝ)).",
    "─",
    "The bijection is: U(t) = e^{−itĜ}. The generator Ĝ is recovered as Ĝ|ψ⟩ = i·lim_{t→0}(U(t)−1̂)|ψ⟩/t for |ψ⟩∈D(Ĝ).",
  ], 0.25, 0.88, 5.3, 2.88, C.cyan);

  lightPanel(slide, "WHY STRONG (NOT NORM) CONTINUITY?", [
    "Norm continuity: ‖U(t)−1̂‖→0 as t→0 is too strong — it forces Ĝ to be bounded (finite-dimensional-like).",
    "─",
    "Strong continuity: only ‖U(t)|ψ⟩−|ψ⟩‖→0 for each fixed |ψ⟩. This is satisfied by e^{−iĤt/ℏ} even when Ĥ is unbounded (e.g., harmonic oscillator, free particle).",
    "─",
    "The Schrödinger equation i ℏ ∂_t|ψ⟩ = Ĥ|ψ⟩ is exactly the strong-continuity condition differentiated at t=0.",
  ], 0.25, 3.86, 5.3, 1.92, C.teal);

  lightPanel(slide, "PHYSICAL CONTENT", [
    "Every Hermitian observable generates a one-parameter symmetry (e.g., Ĥ→time, p̂→translation, Ĵ→rotation)",
    "Conversely, every continuous quantum symmetry has a conserved Hermitian generator → Noether's theorem",
    "Stone's theorem is the mathematical backbone of the Heisenberg picture of QM",
  ], 0.25, 5.86, 5.3, 0.8, C.green);

  // RIGHT diagram
  const dx=5.75, dy=0.88, dw=3.95, dh=5.78;
  slide.addShape("rect", {x:dx, y:dy, w:dw, h:dh, fill:{color:C.offWhite}, line:{color:"D0DCE8", width:1}});
  lbl(slide, "Stone's Theorem — Proof Sketch", dx, dy+0.07, dw, 0.22, {color:C.darkText, size:9, bold:true, align:"center"});

  // Proof step boxes
  const proofSteps = [
    {n:"→", title:"Group → Generator", body:"Define Ĝ|ψ⟩ = i·(d/dt)U(t)|ψ⟩|_{t=0}.\nProve Ĝ is symmetric: ⟨φ|Ĝψ⟩ = ⟨Ĝφ|ψ⟩.\nProve Ĝ is self-adjoint (Cayley transform).", col:C.cyan},
    {n:"←", title:"Generator → Group", body:"Given self-adjoint Ĝ, define U(t)=e^{−itĜ}\nvia functional calculus (spectral theorem).\nVerify group property: U(s)U(t)=U(s+t).", col:C.gold},
    {n:"SC", title:"Strong Continuity", body:"Need ‖(e^{−itĜ}−1̂)|ψ⟩‖→0 as t→0.\nFor |ψ⟩∈D(Ĝ): ‖(U(t)−1̂)|ψ⟩‖≤|t|·‖Ĝ|ψ⟩‖→0.\nFor general |ψ⟩: density argument.", col:C.green},
    {n:"↔", title:"Uniqueness", body:"If U(t)=e^{−itĜ}=e^{−itĜ'}, then Ĝ=Ĝ'.\nProof: differentiate and use self-adjointness.\nThe generator is uniquely determined by the group.", col:C.purple},
  ];
  proofSteps.forEach((ps,i) => {
    const ry = dy+0.34+i*1.3;
    slide.addShape("roundRect", {x:dx+0.2, y:ry, w:dw-0.4, h:1.14, fill:{color:"0A1020"}, line:{color:ps.col, width:1.5}, rectRadius:0.06});
    slide.addShape("roundRect", {x:dx+0.22, y:ry+0.04, w:0.38, h:0.38, fill:{color:ps.col}, line:{color:ps.col}, rectRadius:0.04});
    lbl(slide, ps.n, dx+0.22, ry+0.04, 0.38, 0.38, {color:C.darkText, size:9, bold:true});
    lbl(slide, ps.title, dx+0.66, ry+0.06, dw-0.9, 0.24, {color:ps.col, size:8.5, bold:true, align:"left"});
    lbl(slide, ps.body, dx+0.28, ry+0.34, dw-0.52, 0.76, {color:C.lightText, size:8, align:"left"});
  });

  // Key formula at bottom
  slide.addShape("rect", {x:dx+0.2, y:dy+dh-0.72, w:dw-0.4, h:0.62, fill:{color:"0A1628"}, line:{color:C.gold, width:1.5}});
  lbl(slide, "{U(t)} ↔ Ĝ  via  U(t) = e^{−itĜ}\nĜ = i·d/dt U(t)|_{t=0}  (on D(Ĝ))\nStone (1932): Ann. of Math.", dx+0.24, dy+dh-0.70, dw-0.48, 0.58, {color:"C8E8F8", size:8.5, align:"left"});
}

function buildNoetherSlide(pres) {
  const slide = pres.addSlide();
  slide.background = {color:C.lightBg};
  header(slide, "L02 — Noether's Theorem in Quantum Mechanics", "Continuous symmetry ↔ conserved observable: the quantum Noether correspondence", "L02", false);
  footer(slide, "QM: Module I.1 — L02", "L02 · Noether's Theorem", false);

  lightPanel(slide, "QUANTUM NOETHER THEOREM", [
    "If the Hamiltonian Ĥ is invariant under a continuous symmetry generated by Hermitian Ĝ, then ⟨Ĝ⟩ is conserved in time.",
    "─",
    "Precise form: [Ĥ, Ĝ] = 0 ↔ d⟨Ĝ⟩/dt = 0 for all states.",
    "─",
    "Proof: d⟨Ĝ⟩/dt = (i/ℏ)⟨[Ĥ,Ĝ]⟩ = 0 (Heisenberg equation of motion with [Ĥ,Ĝ]=0).",
    "─",
    "Equivalent: Ĥ commutes with the unitary group e^{iθĜ} iff [Ĥ,Ĝ]=0 iff ⟨Ĝ⟩ conserved.",
  ], 0.25, 0.88, 5.3, 2.2, C.cyan);

  lightPanel(slide, "CONSERVATION TABLE", [
    "Symmetry              Generator Ĝ       Conserved quantity",
    "─",
    "Time translation      Ĥ (Hamiltonian)   energy ⟨Ĥ⟩",
    "Spatial translation   p̂ (momentum)      momentum ⟨p̂⟩",
    "Rotation              Ĵ (ang. mom.)     angular momentum",
    "Phase U(1)            1̂ (identity)      probability (norm)",
    "Gauge transform       Q̂ (charge)        electric charge",
    "─",
    "Each row: [Ĥ, Ĝ] = 0 iff Ĥ is unchanged by the corresponding symmetry",
  ], 0.25, 3.18, 5.3, 2.6, C.teal);

  lightPanel(slide, "HEISENBERG EQUATION OF MOTION", [
    "d/dt Ô_H = (i/ℏ)[Ĥ, Ô_H] + ∂Ô/∂t  (Heisenberg picture)",
    "If [Ĥ,Ô]=0 and ∂Ô/∂t=0: d/dt⟨Ô⟩ = 0  (conserved!)",
    "This is the quantum analogue of Poisson brackets {H,O}=0",
  ], 0.25, 5.88, 5.3, 0.78, C.green);

  // RIGHT diagram: symmetry ↔ conservation flow
  const dx=5.75, dy=0.88, dw=3.95, dh=5.78;
  slide.addShape("rect", {x:dx, y:dy, w:dw, h:dh, fill:{color:C.offWhite}, line:{color:"D0DCE8", width:1}});
  lbl(slide, "Noether Correspondence Diagram", dx, dy+0.07, dw, 0.22, {color:C.darkText, size:9, bold:true, align:"center"});

  // Central flow: symmetry → invariance → commutator → conservation
  const flowItems = [
    {label:"Continuous Symmetry", sub:"e^{iθĜ}: smooth family of\nunitary transformations", col:C.cyan, gy:dy+0.36},
    {label:"Ĥ Invariant", sub:"e^{iθĜ} Ĥ e^{−iθĜ} = Ĥ\nfor all θ ∈ ℝ", col:C.gold, gy:dy+1.36},
    {label:"Commutation", sub:"Differentiate at θ=0:\n[Ĝ, Ĥ] = 0", col:C.green, gy:dy+2.36},
    {label:"Conservation Law", sub:"d⟨Ĝ⟩/dt = (i/ℏ)⟨[Ĥ,Ĝ]⟩ = 0\n⟨Ĝ⟩ = const for all t", col:C.purple, gy:dy+3.36},
  ];
  const fbw=dw-0.4, fbh=0.78;
  flowItems.forEach((fi,i) => {
    rndBox(slide, dx+0.2, fi.gy, fbw, fbh, "0A1020", fi.col, "", fi.col);
    lbl(slide, fi.label, dx+0.28, fi.gy+0.04, fbw-0.16, 0.24, {color:fi.col, size:9, bold:true, align:"left"});
    lbl(slide, fi.sub, dx+0.28, fi.gy+0.3, fbw-0.16, 0.44, {color:C.lightText, size:8, align:"left"});
    if (i<flowItems.length-1) {
      arrow(slide, dx+0.2+fbw/2, fi.gy+fbh+0.01, dx+0.2+fbw/2, fi.gy+fbh+0.22, fi.col, 1.5);
      lbl(slide, "⟺", dx+0.2+fbw/2+0.04, fi.gy+fbh+0.02, 0.3, 0.2, {color:fi.col, size:11, bold:true});
    }
  });

  // Three concrete examples side by side at bottom
  const ex3Y = dy+dh-0.95;
  lbl(slide, "Examples", dx+0.2, ex3Y-0.04, fbw, 0.2, {color:C.teal, size:8.5, bold:true, align:"center"});
  const examples3 = [["[Ĥ,p̂]=0\n→ free particle", C.cyan], ["[Ĥ,Ĵ]=0\n→ central force", C.gold], ["[Ĥ,Q̂]=0\n→ EM field", C.green]];
  const ew = (fbw-0.1)/3;
  examples3.forEach(([txt, col],i) => {
    rndBox(slide, dx+0.2+i*(ew+0.05), ex3Y+0.2, ew, 0.65, "0A1020", col, txt, col, 7.5);
  });
}

// ─────────────────────────────────────────────────────────────────────
// TIER CONTENT DATA
// ─────────────────────────────────────────────────────────────────────
const tierContent = {
  "LO1-HS": {
    body:["A unitary operator is a rotation or reflection in Hilbert space — it preserves lengths.",
          "The condition UU† = 1̂ means: U's inverse equals its conjugate transpose.",
          "All eigenvalues of a unitary operator lie on the unit circle |λ| = 1.",
          "Think: rotating a clock hand — the arrow length stays the same, only direction changes.",
          "Example: rotation matrices Rz(θ) = [[cosθ, −sinθ],[sinθ, cosθ]] are unitary."],
    formula:["UU† = U†U = 1̂  (both ways!)", "U⁻¹ = U†  (inverse = adjoint)", "|λ| = 1  (eigenvalues on circle)"],
    summary:"Verify: Rz(θ)·Rz(θ)ᵀ = [[cos²θ+sin²θ, 0],[0, sin²θ+cos²θ]] = 1̂ ✓"
  },
  "LO1-BegUG": {
    body:["Definition: Û is unitary iff ÛÛ† = Û†Û = 1̂.",
          "Equivalent formulation: Û preserves inner products ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩.",
          "For n×n matrices: check both ÛÛ† = 1̂ AND Û†Û = 1̂ (for infinite-dimensional, both needed).",
          "Pauli matrices σᵢ are Hermitian, not unitary. But e^{iθσᵢ} IS unitary.",
          "The Hadamard gate H = (σ₁+σ₃)/√2 satisfies HH† = 1̂ — verify explicitly."],
    formula:["ÛÛ† = 1̂  (right inverse)", "Û†Û = 1̂  (left inverse)", "⟨Ûφ|Ûψ⟩ = ⟨φ|U†Uψ⟩ = ⟨φ|ψ⟩"],
    summary:"Verify Hadamard H = [[1,1],[1,−1]]/√2: H·H† = (1/2)[[1,1],[1,−1]]·[[1,1],[1,−1]] = 1̂ ✓"
  },
  "LO1-AdvUG": {
    body:["Proof: UU† = 1̂ ⟺ ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩ for all |φ⟩,|ψ⟩.",
          "(⟹): ⟨Ûφ|Ûψ⟩ = ⟨φ|Û†Ûψ⟩ = ⟨φ|ψ⟩. (⟸): set |φ⟩=Û†|χ⟩ to get Û†Û=1̂.",
          "For infinite-dimensional spaces: isometry (‖Û|ψ⟩‖=‖|ψ⟩‖) does NOT imply surjectivity.",
          "Example of isometric non-unitary: right shift on ℓ²: S(x₁,x₂,...)=(0,x₁,x₂,...), ‖S‖=1 but S is not surjective.",
          "Full unitarity requires ÛÛ† = 1̂ AND Û†Û = 1̂ simultaneously."],
    formula:["Isometry: ‖Û|ψ⟩‖=‖|ψ⟩‖  (not enough!)", "Unitary: Û†Û = ÛÛ† = 1̂", "Shift: S†S=1̂ but SS†≠1̂"],
    summary:"Right shift S on ℓ²: S†(x₁,x₂,...)=(x₂,x₃,...). S†S=1̂ ✓ but SS†≠1̂ (misses (1,0,0,...) direction). Isometry but NOT unitary."
  },
  "LO1-MSc": {
    body:["U(n) is a compact connected Lie group of real dimension n².",
          "Topology: U(n) ≅ (S¹ × SU(n)) locally; π₁(U(n)) = ℤ (fundamental group).",
          "U(∞): the infinite-dimensional unitary group on a Hilbert space. Not locally compact.",
          "Operator U on infinite-dimensional ℋ: U is unitary iff it is a surjective isometry.",
          "Unitary group U(ℋ) with norm topology: equivalent to B(ℋ)¹ (closed unit ball intersect unitaries). With strong topology: a topological group but not locally compact."],
    formula:["U(n) compact, dim=n²", "π₁(U(n))=ℤ (not simply conn.)", "SU(n)⊂U(n), det=1, dim=n²−1"],
    summary:"SU(2) ≅ S³ (the 3-sphere): parametrise by U=[[α,−β̄],[β,ᾱ]] with |α|²+|β|²=1 — this is the unit sphere in ℂ²≅ℝ⁴."
  },
  "LO1-PhD": {
    body:["Von Neumann algebras: unitary group U(M) of a vN algebra M carries the strong operator topology.",
          "Unitary equivalence of representations: two representations π₁,π₂: A→B(ℋ) are unitarily equiv. iff ∃ unitary U with Uπ₁(a)U†=π₂(a) for all a.",
          "Kadison's theorem: any ∗-automorphism of B(ℋ) is of the form A ↦ UAU† for some unitary U.",
          "Spectral theorem for unitary U: U = ∫_{S¹} λ dP(λ) where P is a PVM on the unit circle S¹ ⊂ ℂ.",
          "Borel functional calculus: f(U) = ∫f(λ)dP(λ) for bounded Borel f on S¹."],
    formula:["U=∫_{S¹}λ dP(λ)  (spectral meas.)", "Kadison: Aut(B(ℋ))=Inn(U(ℋ))", "vN: U(M)={U∈M : UU*=1}"],
    summary:"Spectral theorem for unitary U: the spectral measure P lives on S¹ ⊂ ℂ. For finite dim, P = Σₙ |uₙ⟩⟨uₙ|·δ_{λₙ} with |λₙ|=1."
  },
  "LO2-HS": {
    body:["A unitary transformation is like rotating a coordinate system — all distances and angles preserved.",
          "If ⟨φ|ψ⟩ = 0.7 (states have 70% overlap), after applying U: ⟨Uφ|Uψ⟩ = 0.7 still.",
          "Measurement probabilities |⟨aₙ|ψ⟩|² are physical — they must not change under symmetry.",
          "Transition probability |⟨φ|ψ⟩|² = |⟨Uφ|Uψ⟩|²: this is Wigner's physical requirement.",
          "Physical consequence: doing an experiment before or after a symmetry transformation gives identical statistics."],
    formula:["⟨Uφ|Uψ⟩ = ⟨φ|ψ⟩  (inner product)", "|⟨Uφ|Uψ⟩|² = |⟨φ|ψ⟩|²  (prob.)", "‖U|ψ⟩‖ = ‖|ψ⟩‖  (norm = 1)"],
    summary:"If |ψ⟩ = (3/5)|+⟩ + (4i/5)|−⟩, then ‖U|ψ⟩‖² = |3/5|² + |4i/5|² = 9/25+16/25 = 1 ✓ for any unitary U."
  },
  "LO2-BegUG": {
    body:["Proof that UU†=1̂ implies ⟨Uφ|Uψ⟩ = ⟨φ|ψ⟩:",
          "⟨Uφ|Uψ⟩ = ⟨φ|U†Uψ⟩ = ⟨φ|1̂ψ⟩ = ⟨φ|ψ⟩. □",
          "Proof of norm preservation: ‖U|ψ⟩‖² = ⟨Uψ|Uψ⟩ = ⟨ψ|ψ⟩ = ‖|ψ⟩‖².",
          "Transition probability: |⟨Uφ|Uψ⟩|² = |⟨φ|U†Uψ⟩|² = |⟨φ|ψ⟩|².",
          "Born rule: P(aₙ|Uψ⟩) = |⟨aₙ|Uψ⟩|². For unitary U: this equals |⟨U†aₙ|ψ⟩|² — just a change of basis."],
    formula:["⟨Uφ|Uψ⟩ = ⟨φ|U†Uψ⟩ = ⟨φ|ψ⟩", "‖Uψ‖² = ⟨ψ|U†U|ψ⟩ = ‖ψ‖²", "|⟨Uφ|Uψ⟩|² = |⟨φ|ψ⟩|²"],
    summary:"Verify for U=e^{iπσ_z/4}=diag(e^{iπ/4},e^{−iπ/4}): ⟨U+|U+⟩ = e^{−iπ/4}·e^{iπ/4}·⟨+|+⟩ = 1 ✓"
  },
  "LO2-AdvUG": {
    body:["Spectral invariance proof: Û|aₙ⟩ is an eigenvector of ÛÂÛ† with eigenvalue aₙ.",
          "ÛÂÛ†(Û|aₙ⟩) = ÛÂ(Û†Û)|aₙ⟩ = ÛÂ|aₙ⟩ = aₙÛ|aₙ⟩. □",
          "Tr(ÛÂÛ†) = Tr(Â): cyclic property of trace.",
          "det(ÛÂÛ†) = det(Û)det(Â)det(Û†) = det(Â): |det(Û)|=1.",
          "Corollary: any unitary equivalent pair (Â, ÛÂÛ†) describe identical physics — all observables, entropies, correlators agree."],
    formula:["σ(ÛÂÛ†) = σ(Â)  (same spectrum)", "Tr(ÛÂÛ†) = Tr(Â)", "det(ÛÂÛ†) = det(Â)"],
    summary:"Compute σ(Û σ_z Û†) for Û=H (Hadamard): H σ_z H† = σ_x. Spectrum of σ_x = {±1} = spectrum of σ_z ✓"
  },
  "LO2-MSc": {
    body:["Unitary equivalence as an equivalence relation: Â ~ B̂ iff ∃ unitary Û with B̂=ÛÂÛ†.",
          "Preserves: spectrum σ(Â), trace Tr(Â), determinant det(Â), von Neumann entropy S(ρ̂)=-Tr(ρ̂ log ρ̂).",
          "Unitary invariants: any quantity invariant under Â ↦ ÛÂÛ† is a physical observable.",
          "Schur's lemma: if [Â,Û]=0 for all Û in an irreducible representation, then Â = λ1̂.",
          "Stone–von Neumann theorem: all irreducible representations of [x̂,p̂]=iℏ on a separable Hilbert space are unitarily equivalent."],
    formula:["Â~B̂ iff ∃U: B̂=ÛÂÛ†", "S(Ûρ̂Û†) = S(ρ̂)  (entropy)", "Stone-vN: CCR reps equiv."],
    summary:"Stone–von Neumann: the Schrödinger rep ψ(x) and momentum rep ψ̃(p) of [x̂,p̂]=iℏ are unitarily related by the Fourier transform — a unitary operator on L²(ℝ)."
  },
  "LO2-PhD": {
    body:["Strong vs. norm topology on U(ℋ): norm topology makes U(ℋ) a topological group; strong topology is more physically relevant.",
          "Fell topology on representations: controls continuity of induced representations.",
          "Connes' theorem: any two separable hyperfinite II₁ factors are isomorphic — implies uniqueness up to unitary equivalence.",
          "Ultraweakly continuous functionals on B(ℋ): characterise normal states ρ = Tr(ρ̂·) — preserved by unitary equivalence.",
          "Modular theory: for a vN algebra M with cyclic vector |Ω⟩, the modular operator Δ and modular conjugation J satisfy JMJ = M'."],
    formula:["Strong top.: Uₙ→U iff ‖Uₙψ−Uψ‖→0", "Modular: ΔitMΔ−it=M (KMS)", "Connes: hyperfinite II₁ unique"],
    summary:"The Tomita–Takesaki modular group {σ_t(·) = Δ^{it}·Δ^{−it}} is a one-parameter unitary group on the vN algebra — an instance of Stone's theorem in the algebraic setting."
  },
  "LO3-HS": {
    body:["Every physical symmetry — rotating, translating, shifting time — is implemented by a unitary operator.",
          "ROTATION: Û_z(θ) rotates a spin state by angle θ around the z-axis on the Bloch sphere.",
          "TRANSLATION: T̂(a) shifts a quantum particle's position by a: T̂(a)|x⟩ = |x+a⟩.",
          "TIME EVOLUTION: Û(t) = e^{−iĤt/ℏ} evolves the state forward in time.",
          "All three are unitary because they must preserve probabilities (physical outcomes unchanged)."],
    formula:["Û_z(θ) = e^{−iθŜ_z/ℏ}  (rotation)", "T̂(a) = e^{−iap̂/ℏ}  (translation)", "Û(t) = e^{−iĤt/ℏ}  (time evo.)"],
    summary:"For spin-½: Û_z(π)|+⟩ = e^{−iπ/2}|+⟩. But Û_z(2π)|+⟩ = e^{−iπ}|+⟩ = −|+⟩ (spinor phase flip!)."
  },
  "LO3-BegUG": {
    body:["Each continuous symmetry has a Hermitian generator Ĝ via Û(θ) = e^{iθĜ}.",
          "Verify e^{iθσ_z} is unitary: (e^{iθσ_z})† = e^{−iθσ_z} = (e^{iθσ_z})⁻¹. ✓",
          "Translation T̂(a)=e^{−iap̂/ℏ}: acts as T̂(a)ψ(x) = ψ(x−a). Generator = p̂.",
          "Time evolution Û(t)=e^{−iĤt/ℏ}: Schrödinger equation is iℏ∂_t|ψ⟩ = Ĥ|ψ⟩.",
          "Global phase e^{iφ}: trivial symmetry, generator = 1̂. Observable: nothing changes."],
    formula:["e^{iθσ_z} = diag(e^{iθ}, e^{−iθ})", "T̂(a)ψ(x) = ψ(x−a)", "iℏ∂_t|ψ⟩ = Ĥ|ψ⟩  (Schrödinger)"],
    summary:"Compute Û_x(π/2)|+⟩: e^{−iπσ_x/4} = cos(π/4)1̂ − i sin(π/4)σ_x = (1̂ − iσ_x)/√2. Apply to |+⟩=(1,0)ᵀ → (1,−i)ᵀ/√2."
  },
  "LO3-AdvUG": {
    body:["Symmetry of Ĥ: Û(θ)ĤÛ†(θ) = Ĥ for all θ iff [Ĝ,Ĥ] = 0.",
          "Proof: differentiate Û(θ)ĤÛ†(θ)=Ĥ at θ=0: iĜĤ − iĤĜ = 0, i.e., [Ĝ,Ĥ]=0.",
          "Quantum Noether: [Ĝ,Ĥ]=0 ⟹ d⟨Ĝ⟩/dt = (i/ℏ)⟨[Ĥ,Ĝ]⟩ = 0.",
          "SU(2) and SO(3): Û_n(θ) = e^{−iθn̂·Ĵ/ℏ} generates rotations in the Hilbert space.",
          "2π vs 4π: Û_z(2π)|integer spin⟩ = +|...⟩, but Û_z(2π)|half-integer spin⟩ = −|...⟩."],
    formula:["Û(θ)ĤÛ†(θ)=Ĥ ↔ [Ĝ,Ĥ]=0", "d⟨Ĝ⟩/dt=(i/ℏ)⟨[Ĥ,Ĝ]⟩", "Û_z(2π)=±1̂ (half/int spin)"],
    summary:"Prove: if [Ĝ,Ĥ]=0 then ⟨Ĝ⟩ is time-independent. d/dt⟨ψ(t)|Ĝ|ψ(t)⟩ = ⟨ψ|[Ĝ,Ĥ]/iℏ|ψ⟩ = 0 □"
  },
  "LO3-MSc": {
    body:["Wigner's classification: particle types labelled by irreducible representations of the Poincaré group U_P.",
          "Massive particles: labelled by (m,s) = (mass, spin); U_P restricted to little group SO(3) ≅ SU(2)/Z₂.",
          "Massless particles: labelled by helicity h ∈ ℤ/2; little group ISO(2) → U(1).",
          "SU(3) in strong force: flavour symmetry group of QCD (approximate); colour symmetry (exact gauge).",
          "Gauge symmetries: local unitary transformations U(x) = e^{iα(x)Ĝ} — give rise to gauge fields (photon, gluon, W/Z)."],
    formula:["Poincaré group: ISO(3,1)⋊SL(2,ℂ)", "Massive: little grp = SU(2)", "Massless: helicity h=±s"],
    summary:"Wigner's mass-spin classification: all fundamental particles are irreps of the Poincaré group. Spin-½ electron: massive, spin-½ rep of SU(2) little group."
  },
  "LO3-PhD": {
    body:["Mackey's imprimitivity theorem: a unitary representation of G on L²(X) (X a G-space) decomposes via induced representations from stabiliser subgroups.",
          "Projective representations: spin-½ carries projective rep of SO(3); lifted to true rep of SU(2) via central extension.",
          "Bogoliubov transformations: canonical unitaries on Fock space relating different vacua (used in QFT and quantum optics).",
          "Super-selection rules: not all unitary operators are physical. Superselection sectors (charge, baryon number) restrict observable algebra.",
          "Gauge theory: local gauge symmetry G(x) = Map(M, G) → connections on principal bundles → gauge fields."],
    formula:["Mackey: Ind_H^G(ρ)  (induced rep)", "Bogoliubov: Û_B a Û_B† = αâ+βâ†", "Gauge: ∂_μ → D_μ=∂_μ+igA_μ"],
    summary:"Bogoliubov transformation on Fock space: û_B = e^{iΘ} where Θ = ∫(f(k)â†â†−h.c.)dk/2. Maps vacuum to squeezed state — a unitary but 'non-trivial' symmetry of the CCR algebra."
  },
  "LO4-HS": {
    body:["The matrix exponential e^A is defined by the infinite sum: e^A = 1̂ + A + A²/2! + A³/3! + ...",
          "For a Hermitian operator Ĝ, e^{iθĜ} is a rotation-like transformation (unitary).",
          "The parameter θ is like an 'angle' — θ=0 gives e⁰=1̂ (no rotation); θ=2π gives e^{2πiĜ}.",
          "Physical example: e^{−iĤt/ℏ} evolves the quantum state — Ĥ is the 'generator' of time evolution.",
          "Euler identity: e^{iθ} = cosθ + i sinθ is the simplest case (1×1 'matrix')."],
    formula:["e^A = 1̂ + A + A²/2! + ...", "e^{iθĜ} unitary when Ĝ=Ĝ†", "e^{iθ} = cosθ + i sinθ  (Euler)"],
    summary:"Compute e^{iπσ_z/2}: σ_z = diag(1,−1), so e^{iπσ_z/2} = diag(e^{iπ/2}, e^{−iπ/2}) = diag(i, −i) = iσ_z."
  },
  "LO4-BegUG": {
    body:["Step-by-step: e^{iθĜ} for Ĝ = Hermitian n×n matrix.",
          "(1) Diagonalise: Ĝ = Σₙ gₙ|gₙ⟩⟨gₙ| (spectral decomposition).",
          "(2) Apply function: e^{iθĜ} = Σₙ e^{iθgₙ}|gₙ⟩⟨gₙ|.",
          "(3) Verify unitary: each e^{iθgₙ} has |e^{iθgₙ}| = 1 (since gₙ ∈ ℝ). □",
          "For Pauli matrices: σₙ² = 1̂ ⟹ e^{iθσₙ} = cosθ·1̂ + i sinθ·σₙ (use Taylor series)."],
    formula:["Ĝ=ΣgₙPₙ ⟹ e^{iθĜ}=Σe^{iθgₙ}Pₙ", "e^{iθσₙ} = cosθ 1̂ + i sinθ σₙ", "|e^{iθg}|=1 when g∈ℝ  (unitary ✓)"],
    summary:"Compute e^{iθσ_y}: σ_y eigenvalues ±1 with eigenvectors |±y⟩. e^{iθσ_y} = e^{iθ}|+y⟩⟨+y| + e^{−iθ}|−y⟩⟨−y| = cos θ 1̂ + i sinθ σ_y."
  },
  "LO4-AdvUG": {
    body:["One-parameter group property: U(s+t) = U(s)U(t) for U(t) = e^{itĜ}.",
          "Proof: e^{isĜ}e^{itĜ} = e^{i(s+t)Ĝ} — valid because isĜ and itĜ commute (both ∝ Ĝ).",
          "The generator extracted from the group: Ĝ = −i·d/dt U(t)|_{t=0}.",
          "Stone's theorem: U(t) = e^{−itĜ} iff Ĝ is self-adjoint (not just Hermitian!) on D(Ĝ).",
          "Differentiation: d/dt U(t)|ψ⟩ = −iĜU(t)|ψ⟩ for |ψ⟩ ∈ D(Ĝ) — the Schrödinger equation."],
    formula:["U(s)U(t) = U(s+t)  [commuting exps]", "Ĝ = i·d/dt e^{−itĜ}|_{t=0}", "d/dt U(t)|ψ⟩ = −iĜU(t)|ψ⟩"],
    summary:"Prove U(s+t)=U(s)U(t): e^{−isĜ}e^{−itĜ} = e^{−isĜ−itĜ} (using [−isĜ,−itĜ]=0) = e^{−i(s+t)Ĝ} = U(s+t) □"
  },
  "LO4-MSc": {
    body:["Stone's theorem (precise): {U(t)} is a strongly continuous one-parameter unitary group iff ∃ unique self-adjoint Ĝ with U(t) = e^{−itĜ}.",
          "Generator domain: D(Ĝ) = {|ψ⟩ : lim_{t→0}(U(t)−1̂)|ψ⟩/t exists}. Dense subspace of ℋ.",
          "Lie algebra connection: iĜ ∈ u(n) (anti-Hermitian); the map Ĝ ↦ e^{−itĜ} is the exponential map u(n) → U(n).",
          "BCH formula: e^{−itĜ₁}e^{−itĜ₂} = e^{−it(Ĝ₁+Ĝ₂)+t²[Ĝ₁,Ĝ₂]/2+O(t³)}.",
          "Magnus expansion: for time-dependent Ĥ(t), U(T)=e^{Ω₁+Ω₂+...} where Ω₁=∫₀ᵀĤ(t)dt."],
    formula:["D(Ĝ)={|ψ⟩: limit exists} (dense)", "Stone: {U(t)} ↔ Ĝ self-adjoint", "BCH: e^Ae^B=e^{A+B+[A,B]/2+...}"],
    summary:"For U(t)=e^{−iĤt/ℏ} with Ĥ=ℏω(N̂+½): D(Ĥ)={|ψ⟩=Σcₙ|n⟩: Σn²|cₙ|²<∞}. The generator Ĥ is self-adjoint on this dense domain."
  },
  "LO4-PhD": {
    body:["Hille–Yosida: a densely-defined closed Â generates a C₀-semigroup iff ‖(λ−Â)⁻ⁿ‖≤M(λ−ω)⁻ⁿ for λ>ω.",
          "For self-adjoint Ĝ: M=1, ω=0 (contractive unitary group) — Hille–Yosida trivially satisfied.",
          "Essential self-adjointness: Ĝ is essentially s.a. on D₀ iff its closure is self-adjoint. Then e^{−itĜ} is well-defined.",
          "Quantum field theory: e^{−iĤt/ℏ} with Ĥ = ∫ω(k)â†(k)â(k)dk requires Fock space and normal ordering to define Ĥ as s.a.",
          "Trotter product formula: e^{−it(Ĝ₁+Ĝ₂)} = lim_{N→∞}(e^{−itĜ₁/N}e^{−itĜ₂/N})^N (for s.a. Ĝ₁, Ĝ₂)."],
    formula:["H-Y: ‖(λ−Â)⁻ⁿ‖≤(λ−ω)⁻ⁿ (M=1)", "Ess. s.a.: closure is s.a.", "Trotter: e^{−it(G₁+G₂)}=lim(...)^N"],
    summary:"Trotter formula applied to Ĥ=Ĥ₀+V̂: approximate e^{−iĤt/ℏ} ≈ (e^{−iĤ₀ε/ℏ}e^{−iV̂ε/ℏ})^N for ε=t/N. Error O(ε²[Ĥ₀,V̂]). Used in quantum simulation."
  },
};

// ─────────────────────────────────────────────────────────────────────
// BUILD ALL SLIDES
// ─────────────────────────────────────────────────────────────────────
const diagFunctions = [
  [diag_LO1_HS, diag_LO1_BegUG, diag_LO1_AdvUG, diag_LO1_MSc, diag_LO1_PhD],
  [diag_LO2_HS, diag_LO2_BegUG, diag_LO2_AdvUG, diag_LO2_MSc, diag_LO2_PhD],
  [diag_LO3_HS, diag_LO3_BegUG, diag_LO3_AdvUG, diag_LO3_MSc, diag_LO3_PhD],
  [diag_LO4_HS, diag_LO4_BegUG, diag_LO4_AdvUG, diag_LO4_MSc, diag_LO4_PhD],
];

async function main() {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_16x9";
  pres.title = "L02 Extra Slides — Tier Concepts + Special Topics";

  // ── SECTION A DIVIDER ──────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = {color:C.darkBg2};
    s.addShape("rect", {x:0, y:2.2, w:10, h:1.25, fill:{color:C.panelBg}, line:{color:C.panelBg}});
    s.addText("SECTION A", {x:0.5, y:1.5, w:9, h:0.4, fontSize:11, color:C.mutedText, bold:true, fontFace:"Calibri", charSpacing:4, align:"center"});
    s.addText("Tier-Differentiated Concept Slides", {x:0.5, y:2.25, w:9, h:0.75, fontSize:28, color:C.white, bold:true, fontFace:"Cambria", align:"center", valign:"middle"});
    s.addText("L02: Unitary Operators and Symmetry Transformations\n20 slides — 5 tiers × 4 learning objectives — each with diagram", {x:0.5, y:3.15, w:9, h:0.55, fontSize:12, color:C.mutedText, fontFace:"Calibri", align:"center"});
    let bx=1.5;
    TIERS.forEach(t => {
      s.addShape("roundRect", {x:bx, y:4.0, w:1.2, h:0.36, fill:{color:t.color}, line:{color:t.color}, rectRadius:0.05});
      s.addText(t.code, {x:bx, y:4.0, w:1.2, h:0.36, fontSize:11, bold:true, color:t.textDark?C.darkText:C.white, fontFace:"Calibri", align:"center", valign:"middle"});
      bx += 1.42;
    });
  }

  // ── 20 TIER CONCEPT SLIDES ─────────────────────────────────────────
  LOS.forEach((lo, loIdx) => {
    // LO divider
    {
      const s = pres.addSlide();
      s.background = {color:C.darkBg};
      s.addShape("rect", {x:0, y:2.0, w:10, h:1.7, fill:{color:C.panelBg}, line:{color:C.panelBg}});
      s.addText(lo.label, {x:0.5, y:2.1, w:9, h:0.35, fontSize:11, color:C.cyan, bold:true, fontFace:"Calibri", charSpacing:3, align:"center"});
      s.addText(`Learning Objective ${lo.num}: ${lo.short}`, {x:0.5, y:2.52, w:9, h:0.65, fontSize:20, color:C.white, bold:true, fontFace:"Cambria", align:"center", valign:"middle"});
      s.addText("5 slides — one per tier (HS / BegUG / AdvUG / MSc / PhD)", {x:0.5, y:3.25, w:9, h:0.3, fontSize:11, color:C.mutedText, fontFace:"Calibri", align:"center"});
    }
    // 5 tier slides
    TIERS.forEach((tier, tierIdx) => {
      const key = `${lo.label}-${tier.code}`;
      const content = tierContent[key] || {body:[], formula:[], summary:""};
      const slide = pres.addSlide();
      slide.background = {color:C.darkBg};

      // Header bar
      slide.addShape("rect", {x:0, y:0, w:10, h:0.78, fill:{color:C.darkBg2}, line:{color:C.darkBg2}});
      tierBadge(slide, tier, 0.3, 0.17);
      slide.addText(`L02 — ${lo.label}: ${lo.short}  |  ${tier.label} Track`, {x:1.28, y:0.17, w:7.6, h:0.28, fontSize:13, bold:true, color:C.white, fontFace:"Cambria", valign:"middle"});
      slide.addText("Unitary Operators and Symmetry Transformations", {x:1.28, y:0.48, w:7.6, h:0.2, fontSize:9, color:C.mutedText, fontFace:"Calibri", italic:true});
      slide.addShape("rect", {x:9.38, y:0.06, w:0.57, h:0.28, fill:{color:"1E3A5F"}, line:{color:"1E3A5F"}});
      slide.addText("L02", {x:9.38, y:0.06, w:0.57, h:0.28, fontSize:8, bold:true, color:C.adv, fontFace:"Calibri", align:"center", valign:"middle"});

      // Content panels
      darkPanel(slide, "CONCEPT EXPLANATION", content.body, 0.25, 0.86, 5.55, 2.85, {titleColor:tier.color});
      formulaBox(slide, content.formula, 0.25, 3.8, 5.55, 0.72);
      darkPanel(slide, "WORKED EXAMPLE / SUMMARY", [content.summary], 0.25, 4.6, 5.55, 0.95, {titleColor:C.gold});

      // Diagram
      diagFunctions[loIdx][tierIdx](slide, 6.0, 0.86, 3.7, 4.69);
      footer(slide, "QM: Module I.1 — L02", `L02 · ${lo.label} · ${tier.code}`, true);
    });
  });

  // ── SECTION B DIVIDER ──────────────────────────────────────────────
  {
    const s = pres.addSlide();
    s.background = {color:C.darkBg2};
    s.addShape("rect", {x:0, y:2.2, w:10, h:1.25, fill:{color:C.panelBg}, line:{color:C.panelBg}});
    s.addText("SECTION B", {x:0.5, y:1.5, w:9, h:0.4, fontSize:11, color:C.mutedText, bold:true, fontFace:"Calibri", charSpacing:4, align:"center"});
    s.addText("Special Topic Slides", {x:0.5, y:2.25, w:9, h:0.75, fontSize:28, color:C.white, bold:true, fontFace:"Cambria", align:"center", valign:"middle"});
    s.addText("L02: Advanced Mathematical Foundations — each with diagram\nLie Groups U(n) & SU(2)  ·  Stone's Theorem  ·  Noether's Theorem", {x:0.5, y:3.15, w:9, h:0.65, fontSize:11, color:C.mutedText, fontFace:"Calibri", align:"center"});
  }

  buildLieGroupSlide(pres);
  buildStoneTheoremSlide(pres);
  buildNoetherSlide(pres);

  await pres.writeFile({fileName:"/home/claude/L02_extra_slides.pptx"});
  console.log("✓ Written: /home/claude/L02_extra_slides.pptx");
}

main().catch(console.error);
