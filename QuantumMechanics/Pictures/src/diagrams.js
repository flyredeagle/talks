/**
 * builder-expanded.js  — Universal expanded deck builder for L02–L10
 *
 * Produces 28 slides per lecture following the same structure as builder-L01.js:
 *  1   Title
 *  2   Lecture Overview
 *  3-6  Learning Objective slides (LO1–LO4), each with a bespoke diagram
 *  7-12 Key Formula slides (F1–F6), each with diagram + explanation + checks
 * 13-20 Concept Question slides (CQ1–CQ8), each with diagram + model answer
 * 21-25 Tier Deep-Dive slides (T1–T5), each with tasks + diagram
 * 26   Key Formulas summary
 * 27   Concept Questions summary
 * 28   Five-Tier Pedagogy + Assessment
 *
 * All diagram content is driven by LECTURE_DIAGRAMS[lec.code], making it
 * straightforward to add or refine diagrams for any lecture.
 */

"use strict";
const pptxgen = require("pptxgenjs");
const { C, FONT_HEAD, FONT_BODY, FONT_MONO, W, H, TIERS, makeHelpers } = require("./theme");

// ─── Shared drawing primitives ────────────────────────────────────────────────

function node(s, pres, x, y, w, h, text, bg, fg, fontSize = 9, bold = false) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius: 0.07,
    fill:{color:bg}, line:{color:fg, width:1.2},
  });
  s.addText(text, { x, y, w, h, fontSize, fontFace:FONT_BODY, bold,
    color:fg, align:"center", valign:"middle", margin:0 });
}

function vline(s, pres, x, y1, y2, color, dashed=false) {
  s.addShape(pres.shapes.LINE, {
    x, y:y1, w:0, h:y2-y1,
    line:{color, width:1.2, dashType:dashed?"dash":"solid"},
  });
}

function hline(s, pres, x1, y, x2, color, dashed=false) {
  s.addShape(pres.shapes.LINE, {
    x:x1, y, w:x2-x1, h:0,
    line:{color, width:1.2, dashType:dashed?"dash":"solid"},
  });
}

function box(s, pres, x, y, w, h, bg, border, width=1.5) {
  s.addShape(pres.shapes.RECTANGLE, {
    x,y,w,h, fill:{color:bg}, line:{color:border, width},
  });
}

function oval(s, pres, cx, cy, rx, ry, fill, stroke) {
  s.addShape(pres.shapes.OVAL, {
    x:cx-rx, y:cy-ry, w:2*rx, h:2*ry,
    fill:{color:fill}, line:{color:stroke||fill},
  });
}

function txt(s, x, y, w, h, text, color, fontSize, fontFace, bold=false, align="left", italic=false) {
  s.addText(text, {x,y,w,h, fontSize, fontFace:fontFace||FONT_BODY,
    bold, italic, color, align, valign:"middle", margin:0});
}

// ─── Section header / footer shared ──────────────────────────────────────────

function diagHeader(s, pres, LCode, sectionTag, title, subtitle, tagColor) {
  s.addShape(pres.shapes.RECTANGLE, {x:0,y:0,w:W,h:0.48,
    fill:{color:"0D1B2E"}, line:{color:"0D1B2E"}});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x:0.18,y:0.07,w:1.1,h:0.24,
    fill:{color:tagColor}, line:{color:tagColor}, rectRadius:0.06});
  txt(s, 0.18,0.07, 1.1,0.24, sectionTag, C.bg, 7.5, FONT_HEAD, true, "center");
  txt(s, 1.38,0.05, 7.5,0.26, title, C.white, 14, FONT_HEAD, true);
  if (subtitle) txt(s, 1.38,0.3, 7.5,0.15, subtitle, C.muted, 8, FONT_BODY, false, "left", true);
  txt(s, 9.4,0.07, 0.5,0.3, LCode, C.accent, 8, FONT_HEAD, true, "right");
}

function diagFooter(s, LCode, sectionTag, idx) {
  s.addText(`QM: Module I.3 · ${LCode} · ${sectionTag} ${idx}`,
    {x:0.2,y:5.38,w:6,h:0.18, fontSize:7, fontFace:FONT_BODY, color:C.muted, margin:0});
}

// ─── LECTURE-SPECIFIC DIAGRAM DATA ───────────────────────────────────────────
// Each entry defines the bespoke content for LO slides, Formula slides,
// CQ slides, and Tier deep-dive slides.

const LECTURE_DIAGRAMS = {

  // ══════════════════════════════════════════════════════════════════════════
  "L02": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Use Resolution of Identity",
        goal:"Insert completeness in discrete and continuous forms to evaluate any bracket",
        keyPoints:[
          "Discrete: Î = Σᵢ |eᵢ⟩⟨eᵢ|  — insert between any two operators or states",
          "Continuous: Î = ∫dx |x⟩⟨x|  — use when working in position representation",
          "Application: ⟨x|p̂|ψ⟩ = ∫⟨x|p̂|x'⟩⟨x'|ψ⟩dx'  — two insertions",
          "Unitarity of basis change: U†U = Î follows immediately from completeness",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Resolution of identity chain diagram
          node(s,pres,ox,oy, 1.8,0.38, "⟨φ|Â|ψ⟩", "0D1A2A", C.accent, 10, true);
          vline(s,pres,ox+0.9, oy+0.38, oy+0.7, C.muted);
          txt(s, ox+0.95,oy+0.44, 1.2,0.22, "insert Î=Σᵢ|eᵢ⟩⟨eᵢ|", C.muted, 7.5, FONT_BODY, false,"left", true);
          node(s,pres,ox,oy+0.7, 1.8,0.38, "Σᵢ ⟨φ|eᵢ⟩⟨eᵢ|Â|ψ⟩", "0D1A2A", C.teal, 9, false);
          vline(s,pres,ox+0.9, oy+1.08, oy+1.4, C.muted);
          txt(s, ox+0.95,oy+1.14, 1.2,0.22, "insert Î again", C.muted, 7.5, FONT_BODY, false,"left", true);
          node(s,pres,ox,oy+1.4, 1.8,0.42, "Σᵢⱼ ⟨φ|eᵢ⟩Aᵢⱼ⟨eⱼ|ψ⟩", "0D1A2A", C.gold, 8.5, false);
          txt(s, ox,oy+1.92, 1.8,0.2, "= matrix element sum", C.muted, 7.5, FONT_BODY, false, "center", true);
          // Continuous version on right
          const rx = ox+2.2;
          box(s,pres,rx,oy, 1.9,0.38, "0D1E1D", C.teal);
          txt(s,rx,oy, 1.9,0.38,"Î = ∫dx |x⟩⟨x|", C.teal, 9.5, FONT_MONO, true, "center");
          vline(s,pres,rx+0.95,oy+0.38,oy+0.7,C.teal);
          box(s,pres,rx,oy+0.7, 1.9,0.38,"0D1E1D",C.teal);
          txt(s,rx,oy+0.7, 1.9,0.38,"ψ(x) = ⟨x|ψ⟩", C.offwhite, 9.5, FONT_MONO, false,"center");
          vline(s,pres,rx+0.95,oy+1.08,oy+1.4,C.teal);
          box(s,pres,rx,oy+1.4, 1.9,0.42,"0D1E1D",C.teal);
          txt(s,rx,oy+1.4, 1.9,0.42,"∫|ψ(x)|² dx = 1", C.begCol, 9, FONT_MONO, false,"center");
        },
        diagLabel:"Completeness: discrete (left) and continuous (right) forms",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Derive ψ(x) = ⟨x|ψ⟩",
        goal:"Show that the wavefunction is a coefficient in the position-eigenstate expansion",
        keyPoints:[
          "Insert Î=∫dx|x⟩⟨x| into |ψ⟩: the 'coefficients' are ψ(x)=⟨x|ψ⟩",
          "Position eigenstates |x⟩ satisfy x̂|x⟩=x|x⟩ and ⟨x|x'⟩=δ(x−x')",
          "Momentum eigenstate: ⟨x|p⟩=e^{ipx/ℏ}/√(2πℏ) — a plane wave",
          "Momentum wavefunction: ψ̃(p)=⟨p|ψ⟩=∫⟨p|x⟩ψ(x)dx  — Fourier transform",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Ket → wavefunction hierarchy
          const items = [
            {label:"|ψ⟩", sub:"abstract ket", color:C.accent},
            {label:"ψ(x)=⟨x|ψ⟩", sub:"position rep", color:C.teal},
            {label:"ψ̃(p)=⟨p|ψ⟩", sub:"momentum rep", color:C.mscCol},
            {label:"cₙ=⟨n|ψ⟩", sub:"discrete basis", color:C.gold},
          ];
          node(s,pres,ox+0.5,oy, 2.6,0.36,"|ψ⟩  (state)", "0D1A2A", C.accent, 11, true);
          let cy = oy+0.36;
          hline(s,pres,ox+0.6,cy+0.12, ox+2.6,C.muted);
          for(let i=0;i<3;i++){
            const bx = ox + i*1.32;
            vline(s,pres,bx+0.66,cy+0.12,cy+0.44,items[i+1].color);
            node(s,pres,bx,cy+0.44, 1.25,0.34, items[i+1].label,"0D1A2A",items[i+1].color,8.5,true);
            txt(s,bx,cy+0.82, 1.25,0.2, items[i+1].sub, C.muted,7,FONT_BODY,false,"center",true);
          }
          // Fourier transform arrow connecting position and momentum
          const ay = cy+1.14;
          box(s,pres,ox,ay, 3.96,0.4, "0D1A30", C.accent);
          txt(s,ox+0.1,ay+0.02,3.76,0.36,"ψ̃(p) = ∫ e^{-ipx/ℏ}/√(2πℏ) · ψ(x) dx", C.offwhite,8.5,FONT_MONO,false,"center");
          txt(s,ox,ay+0.44,3.96,0.2,"Fourier transform = basis change from |x⟩ to |p⟩", C.muted,7.5,FONT_BODY,false,"center",true);
        },
        diagLabel:"One state, three representations — all from inserting identity",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Perform Basis Changes via Fourier Transform",
        goal:"Translate freely between position and momentum representations",
        keyPoints:[
          "Forward FT: ψ̃(p) = ∫e^{-ipx/ℏ}/√(2πℏ) ψ(x)dx  (x→p representation)",
          "Inverse FT: ψ(x) = ∫e^{+ipx/ℏ}/√(2πℏ) ψ̃(p)dp  (p→x representation)",
          "FT is unitary: Parseval theorem ∫|ψ(x)|²dx = ∫|ψ̃(p)|²dp",
          "Operators change form: p̂ = −iℏ∂_x in position; x̂ = +iℏ∂_p in momentum",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Two-box diagram with bidirectional arrows
          const bw=1.6, bh=0.9;
          box(s,pres,ox,oy+0.3, bw,bh,"0D1E1D",C.teal,2);
          txt(s,ox,oy+0.3,bw,0.28,"x-space",C.teal,8.5,FONT_HEAD,true,"center");
          txt(s,ox,oy+0.58,bw,0.22,"ψ(x)",C.white,11,FONT_MONO,true,"center");
          txt(s,ox,oy+0.8,bw,0.22,"x̂ = x·",C.muted,8,FONT_MONO,false,"center");
          txt(s,ox,oy+1.0,bw,0.22,"p̂ = -iℏ∂_x",C.muted,8,FONT_MONO,false,"center");

          const rx=ox+2.4;
          box(s,pres,rx,oy+0.3, bw,bh,"1A0D35",C.mscCol,2);
          txt(s,rx,oy+0.3,bw,0.28,"p-space",C.mscCol,8.5,FONT_HEAD,true,"center");
          txt(s,rx,oy+0.58,bw,0.22,"ψ̃(p)",C.white,11,FONT_MONO,true,"center");
          txt(s,rx,oy+0.8,bw,0.22,"p̂ = p·",C.muted,8,FONT_MONO,false,"center");
          txt(s,rx,oy+1.0,bw,0.22,"x̂ = +iℏ∂_p",C.muted,8,FONT_MONO,false,"center");

          // Forward arrow (FT)
          hline(s,pres,ox+bw+0.08,oy+0.55,rx-0.08,C.accent);
          txt(s,ox+bw+0.08,oy+0.38,0.72,0.18,"FT →",C.accent,8,FONT_MONO,true,"center");
          // Inverse arrow (IFT)
          hline(s,pres,ox+bw+0.08,oy+0.9,rx-0.08,C.gold);
          txt(s,ox+bw+0.08,oy+0.92,0.72,0.18,"← FT⁻¹",C.gold,7.5,FONT_MONO,true,"center");

          // Parseval note
          box(s,pres,ox,oy+1.38,rx+bw-ox,0.3,"201700",C.gold);
          txt(s,ox+0.1,oy+1.38,rx+bw-ox-0.2,0.3,"Parseval: ∫|ψ(x)|²dx = ∫|ψ̃(p)|²dp  (unitarity)", C.gold,8.5,FONT_MONO,false,"center");
        },
        diagLabel:"Fourier transform as unitary basis change between x-space and p-space",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Manipulate the Dirac Delta Distribution",
        goal:"Work rigorously with δ(x) as a distribution, not a function",
        keyPoints:[
          "Sifting: ∫δ(x−x₀)f(x)dx = f(x₀)  — the defining property",
          "Fourier representation: δ(x) = ∫e^{ikx}dk/(2π)  — not a pointwise limit",
          "Scaling: δ(ax) = δ(x)/|a|;  δ(f(x)) = Σₖ δ(x−xₖ)/|f'(xₖ)|",
          "Distributional derivative: ∫δ'(x)f(x)dx = −f'(0)  — integration by parts",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Delta function sequence + sifting property
          const bw=3.8, bh=1.5;
          box(s,pres,ox,oy,bw,bh,"080E16",C.mscCol);
          // Approximate delta as narrow Gaussian bar
          const pts=[0.1,0.3,0.5,0.7,0.9,1.1,1.3,1.5,1.7,1.9];
          const vals=[0.02,0.04,0.12,0.38,1.0,0.38,0.12,0.04,0.02,0.01];
          const bw2=0.18, maxH=0.8, bx=ox+0.12;
          for(let i=0;i<pts.length;i++){
            const h=vals[i]*maxH;
            s.addShape(pres.shapes.RECTANGLE,{
              x:bx+pts[i]*1.6, y:oy+bh-0.18-h, w:bw2, h,
              fill:{color:C.mscCol}, line:{color:C.mscCol},
            });
          }
          txt(s,ox+0.1,oy+bh-0.16,3.6,0.14,"δ(x−x₀)  (schematic)", C.muted,7,FONT_BODY,false,"center",true);
          txt(s,ox+0.1,oy+0.08,bw-0.2,0.22,"Sifting: ∫δ(x−x₀)f(x)dx = f(x₀)",C.mscCol,9,FONT_MONO,true,"center");
          txt(s,ox+0.1,oy+0.34,bw-0.2,0.2,"Fourier: δ(x) = ∫eⁱᵏˣdk/2π",C.offwhite,8.5,FONT_MONO,false,"center");
          txt(s,ox+0.1,oy+0.56,bw-0.2,0.2,"Scaling: δ(ax) = δ(x)/|a|",C.offwhite,8.5,FONT_MONO,false,"center");
          txt(s,ox+0.1,oy+0.76,bw-0.2,0.2,"NOT a function — it is a distribution",C.gold,8,FONT_BODY,true,"center");
        },
        diagLabel:"δ(x−x₀) as a distributional spike — defined by its sifting action",
      },
    ],

    formulaAnswers: [
      ["Identity (discrete)", "Î = Σᵢ|eᵢ⟩⟨eᵢ| is the projector onto the full space; inserting it between any two factors changes nothing but exposes structure",
       ["∫|ψ(x)|²dx = ⟨ψ|Î|ψ⟩ = 1  ✓","⟨eᵢ|eⱼ⟩ = δᵢⱼ (orthonormality) ✓","Change of basis: Uᵢⱼ = ⟨eᵢ|fⱼ⟩ unitary ✓"]],
      ["Identity (continuous)", "Î = ∫dx|x⟩⟨x| integrates rank-1 projectors; the integral ranges over all x; produces completeness in position basis",
       ["⟨x|x'⟩ = δ(x−x')  (orthonormality) ✓","∫dx|⟨x|ψ⟩|² = 1 (normalization) ✓","⟨φ|ψ⟩ = ∫φ*(x)ψ(x)dx  ✓"]],
      ["Wavefunction as projection", "ψ(x) = ⟨x|ψ⟩ is the amplitude for finding the particle at x; it is the coefficient of |x⟩ in the position-eigenstate expansion of |ψ⟩",
       ["|ψ(x)|² = probability density for position ✓","∫ψ*(x)φ(x)dx = ⟨ψ|φ⟩  ✓","Basis independence: any ONB {|eₙ⟩} gives ⟨eₙ|ψ⟩"]],
      ["Position-momentum overlap", "⟨x|p⟩ = e^{ipx/ℏ}/√(2πℏ) is the plane wave; it is the matrix element of the basis-change unitary from |p⟩ to |x⟩",
       ["∫⟨p|x⟩⟨x|p'⟩dx = δ(p−p')  ✓","⟨x|p̂|ψ⟩ = −iℏ∂_xψ(x)  ✓","Unitarity: ∫|⟨x|p⟩|²dp = 1  ✓"]],
      ["Fourier transform", "ψ̃(p) = ∫e^{-ipx/ℏ}/√(2πℏ)ψ(x)dx is the Fourier transform; it is ψ in the momentum representation",
       ["Inverse: ψ(x) = ∫e^{+ipx/ℏ}/√(2πℏ)ψ̃(p)dp  ✓","Parseval: ∫|ψ|²dx = ∫|ψ̃|²dp  ✓","p̂ in x-rep: multiply ψ̃(p) by p then inverse FT"]],
      ["Sifting property", "∫δ(x−x₀)f(x)dx = f(x₀) is the defining property of the Dirac delta; it selects the value of f at the point x=x₀",
       ["δ(x) ≥ 0 everywhere and ∫δ(x)dx = 1  ✓","δ(ax) = δ(x)/|a|  (scaling) ✓","Not a function: defined only inside integrals"]],
    ],

    cqPointers: [
      "Resolution of identity: Σ|eᵢ⟩⟨eᵢ| spans the full Hilbert space; inserting it changes nothing",
      "False: ⟨x|x'⟩=δ(x−x') is a distribution, not a number; position eigenstates are not L²-normalisable",
      "FT is unitary: ⟨p|x⟩ plays the role of Uᵢⱼ; unitarity comes from completeness in both bases",
      "ψ(x)=⟨x|ψ⟩ is the inner product with |x⟩; it is the 'coordinate' of |ψ⟩ in the position eigenbasis",
      "False: |p⟩ is plane-wave, not square-integrable; it lives in the rigged Hilbert space Φ′",
      "Insert Î=∫dx|x⟩⟨x| twice: ⟨x|Â²|ψ⟩ = ∫∫A(x,x')A(x',x'')ψ(x'')dx'dx''",
      "Delta is a distribution: defined by its action ∫δ(x)f(x)dx=f(0), not by pointwise values",
      "Discrete: Kronecker δᵢⱼ; Continuous: Dirac δ(x−x'); key change is Σ→∫, δᵢⱼ→δ(x−x')",
    ],

    tierTasks: {
      hs: ["Explain: why does a quantum particle not have a definite position?",
           "Describe what ψ(x) means physically in 2-3 sentences",
           "Sketch a Gaussian wavepacket; identify where it is 'mostly' located"],
      begug: ["Compute ψ(x) for |ψ⟩=c₁|e₁⟩+c₂|e₂⟩ using ⟨x|eₙ⟩=φₙ(x)",
              "Evaluate the Fourier transform of ψ(x)=e^{-x²/4σ²}/(2πσ²)^{1/4}",
              "Verify ∫|ψ̃(p)|²dp=1 for the Gaussian using Parseval"],
      advug: ["Prove Parseval–Plancherel from completeness in both bases",
              "Show p̂ becomes −iℏ∂_x in position representation via insertion of Î",
              "Evaluate ⟨x|p̂²|ψ⟩ by inserting identity twice"],
      msc: ["Prove the Fourier transform is a unitary map on L²(ℝ) (Plancherel theorem)",
            "Define generalised eigenvectors rigorously; show |x⟩ ∈ Φ′ (rigged Hilbert)",
            "State the nuclear spectral theorem and explain its role"],
      phd: ["Construct the Gel'fand triple Φ ⊂ L²(ℝ) ⊂ Φ′ for the harmonic oscillator",
            "Prove the delta function is a tempered distribution",
            "Discuss frame theory: when is a non-orthogonal continuous basis still complete?"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L03": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Derive Robertson's Uncertainty Inequality",
        goal:"Prove ΔA·ΔB ≥ ½|⟨[Â,B̂]⟩| from Cauchy–Schwarz",
        keyPoints:[
          "Define δÂ = Â−⟨Â⟩ and δB̂ = B̂−⟨B̂⟩; variance (ΔA)²=⟨(δÂ)²⟩",
          "Cauchy–Schwarz: |⟨δÂ|δB̂⟩|² ≤ ⟨(δÂ)²⟩⟨(δB̂)²⟩",
          "Decompose ⟨δÂδB̂⟩ into symmetric (real) + antisymmetric (imaginary = ½⟨[Â,B̂]⟩) parts",
          "Robertson inequality: ΔA·ΔB ≥ ½|⟨[Â,B̂]⟩|; saturated by coherent/squeezed states",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Derivation flow chart
          const steps=[
            {label:"Cauchy–Schwarz", sub:"|⟨u|v⟩|² ≤ ⟨u|u⟩⟨v|v⟩", color:C.accent},
            {label:"set |u⟩=δÂ|ψ⟩, |v⟩=δB̂|ψ⟩", sub:"(ΔA)²(ΔB)² ≥ |⟨δÂδB̂⟩|²", color:C.teal},
            {label:"decompose ⟨δÂδB̂⟩", sub:"= ½⟨{δÂ,δB̂}⟩ + ½⟨[Â,B̂]⟩", color:C.mscCol},
            {label:"Robertson inequality", sub:"ΔA·ΔB ≥ ½|⟨[Â,B̂]⟩|", color:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            node(s,pres,ox,y, 3.8,0.38, steps[i].label,"0D1A2A",steps[i].color,9,true);
            txt(s,ox,y+0.38, 3.8,0.18, steps[i].sub,steps[i].color,8,FONT_MONO,false,"center",true);
            if(i<steps.length-1){ vline(s,pres,ox+1.9,y+0.56,y+0.72,C.muted); }
            y+=0.72;
          }
        },
        diagLabel:"Proof flow: Cauchy–Schwarz → decomposition → Robertson inequality",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Evaluate Commutators for x̂ and p̂",
        goal:"Compute commutators of polynomial functions using [x̂,p̂]=iℏ",
        keyPoints:[
          "[x̂,p̂]=iℏ  — the canonical commutation relation (CCR); verified in position rep",
          "Product rule: [Â,B̂Ĉ]=[Â,B̂]Ĉ+B̂[Â,Ĉ]  — like the Leibniz rule",
          "[x̂,p̂²] = 2iℏp̂;  [x̂ⁿ,p̂] = iℏnx̂^{n-1}  — from repeated application",
          "Jacobi identity: [Â,[B̂,Ĉ]]+[B̂,[Ĉ,Â]]+[Ĉ,[Â,B̂]]=0  — always holds",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Commutator tree: [x,p^2] derivation
          box(s,pres,ox,oy,3.6,0.32,"0D1A2A",C.teal,2);
          txt(s,ox,oy, 3.6,0.32,"[x̂, p̂²] = ?",C.teal,11,FONT_MONO,true,"center");
          vline(s,pres,ox+1.8,oy+0.32,oy+0.56,C.muted);
          txt(s,ox+1.85,oy+0.35,1.6,0.2,"product rule",C.muted,7.5,FONT_BODY,false,"left",true);
          box(s,pres,ox,oy+0.56,3.6,0.32,"0D1A2A",C.teal);
          txt(s,ox,oy+0.56, 3.6,0.32,"[x̂,p̂]p̂ + p̂[x̂,p̂]",C.offwhite,9.5,FONT_MONO,false,"center");
          vline(s,pres,ox+1.8,oy+0.88,oy+1.12,C.muted);
          txt(s,ox+1.85,oy+0.92,1.6,0.2,"[x̂,p̂]=iℏ",C.muted,7.5,FONT_MONO,false,"left",true);
          box(s,pres,ox,oy+1.12,3.6,0.32,"0D1A2A",C.begCol);
          txt(s,ox,oy+1.12, 3.6,0.32,"= iℏp̂ + p̂·iℏ = 2iℏp̂",C.begCol,10,FONT_MONO,true,"center");
          // Jacobi identity note
          box(s,pres,ox,oy+1.6,3.6,0.32,"201700",C.gold);
          txt(s,ox+0.1,oy+1.6,3.4,0.32,"Jacobi: [Â,[B̂,Ĉ]]+[B̂,[Ĉ,Â]]+[Ĉ,[Â,B̂]]=0",C.gold,8,FONT_MONO,false,"center");
        },
        diagLabel:"Derivation of [x̂,p̂²]=2iℏp̂ using product rule and CCR",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Define CSCO and Quantum Number Labelling",
        goal:"Identify a complete set of commuting observables and explain unique state labelling",
        keyPoints:[
          "If [Â,B̂]=0: they share a common eigenbasis (simultaneous diagonalisation)",
          "CSCO: {Â₁,Â₂,...,Âₖ} all mutually commuting; eigenvalues {a₁,a₂,...,aₖ} label states uniquely",
          "Hydrogen: {Ĥ,L̂²,L̂_z,Ŝ_z} — four operators needed for unique labelling (n,l,m,mₛ)",
          "Non-commuting observables: measuring Â then B̂ changes state; order matters",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // H atom CSCO diagram
          box(s,pres,ox,oy,3.8,0.36,"0D1A2A",C.begCol,2);
          txt(s,ox,oy,3.8,0.36,"Hydrogen CSCO: {Ĥ, L̂², L̂_z, Ŝ_z}",C.begCol,9,FONT_HEAD,true,"center");
          const labels=[
            {op:"Ĥ",qn:"n",desc:"principal q.n.",color:C.accent},
            {op:"L̂²",qn:"l",desc:"orbital q.n.",color:C.teal},
            {op:"L̂_z",qn:"m",desc:"magnetic q.n.",color:C.mscCol},
            {op:"Ŝ_z",qn:"mₛ",desc:"spin q.n.",color:C.gold},
          ];
          const cw=0.95;
          for(let i=0;i<labels.length;i++){
            const bx=ox+i*cw;
            box(s,pres,bx,oy+0.44,cw,0.9,labels[i].color+"22",labels[i].color);
            txt(s,bx,oy+0.5,cw,0.26,labels[i].op,labels[i].color,10,FONT_MONO,true,"center");
            txt(s,bx,oy+0.78,cw,0.22,"→ "+labels[i].qn,C.white,10,FONT_MONO,true,"center");
            txt(s,bx,oy+1.02,cw,0.26,labels[i].desc,C.muted,7,FONT_BODY,false,"center",true);
          }
          box(s,pres,ox,oy+1.44,3.8,0.32,"1A1A0D",C.gold);
          txt(s,ox,oy+1.44,3.8,0.32,"|n,l,m,mₛ⟩  —  unique state label",C.gold,9.5,FONT_MONO,true,"center");
        },
        diagLabel:"Hydrogen CSCO: four commuting operators → four quantum numbers",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Distinguish Compatible and Incompatible Observables",
        goal:"Predict measurement outcomes and ordering effects for commuting vs. non-commuting operators",
        keyPoints:[
          "Compatible [Â,B̂]=0: measuring Â then B̂ leaves state unchanged; order irrelevant",
          "Incompatible [Â,B̂]≠0: measuring Â disturbs the state; B̂ outcome is random afterwards",
          "Sequential measurements: Π_a Π_b Π_a projects via eigenspaces; generally irreversible",
          "Quantum Zeno effect: repeated rapid measurements freeze evolution",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Side-by-side compatible vs incompatible measurement sequences
          const colW=1.8;
          box(s,pres,ox,oy,colW,0.3,"0D1E1D",C.teal,2);
          txt(s,ox,oy,colW,0.3,"Compatible",C.teal,9,FONT_HEAD,true,"center");
          const stepsC=["State |ψ⟩","Measure Â → a","State |a⟩","Measure B̂ → b","State |a,b⟩"];
          for(let i=0;i<stepsC.length;i++){
            node(s,pres,ox,oy+0.38+i*0.44, colW,0.34,stepsC[i],"0D1E1D",i===4?C.teal:C.offwhite,8,i===4);
            if(i<stepsC.length-1) vline(s,pres,ox+colW/2,oy+0.72+i*0.44,oy+0.82+i*0.44,C.teal);
          }

          const rx=ox+colW+0.22;
          box(s,pres,rx,oy,colW,0.3,"1A0D20",C.phdCol,2);
          txt(s,rx,oy,colW,0.3,"Incompatible",C.phdCol,9,FONT_HEAD,true,"center");
          const stepsI=["State |ψ⟩","Measure Â → a","State |a⟩","Measure B̂ → b","State |b⟩ ≠ |a,b⟩"];
          for(let i=0;i<stepsI.length;i++){
            node(s,pres,rx,oy+0.38+i*0.44, colW,0.34,stepsI[i],"1A0D20",i===4?C.phdCol:C.offwhite,8,i===4);
            if(i<stepsI.length-1) vline(s,pres,rx+colW/2,oy+0.72+i*0.44,oy+0.82+i*0.44,C.phdCol);
          }
        },
        diagLabel:"Compatible (left): order irrelevant. Incompatible (right): measurement disturbs state.",
      },
    ],

    formulaAnswers: [
      ["CCR", "The canonical commutation relation [x̂,p̂]=iℏ is the algebraic heart of QM; it encodes the Heisenberg uncertainty and follows from p̂=−iℏ∂_x in position representation",
       ["[x̂,p̂]f = x(−iℏ∂_x f)−(−iℏ∂_x)(xf) = iℏf  ✓","(ΔxΔp)_min = ℏ/2 for Gaussian wavepackets  ✓","Generalises to [xᵢ,pⱼ]=iℏδᵢⱼ  ✓"]],
      ["Variance", "(ΔA)²=⟨Â²⟩−⟨Â⟩² measures the spread of measurement outcomes around their mean; it is the quantum analogue of statistical variance",
       ["ΔA=0 iff |ψ⟩ is an eigenstate of Â  ✓","(ΔA)²=⟨(Â−⟨Â⟩)²⟩ ≥ 0  ✓","For the HO ground state: ΔxΔp=ℏ/2  ✓"]],
      ["Robertson inequality", "ΔA·ΔB ≥ ½|⟨[Â,B̂]⟩| is tightest bound consistent with QM; derived from Cauchy–Schwarz; saturated when δÂ|ψ⟩=iλδB̂|ψ⟩ for real λ",
       ["For x̂,p̂: ΔxΔp ≥ ℏ/2  ✓","Saturated by Gaussian minimum-uncertainty states  ✓","For commuting observables: bound is 0 (trivial)"]],
      ["Saturation condition", "Minimum uncertainty states satisfy δÂ|ψ⟩=iλδB̂|ψ⟩; for x̂,p̂ this gives Gaussian wavefunctions (coherent states of HO)",
       ["Coherent states: ΔxΔp=ℏ/2  ✓","Squeezed states: ΔxΔp=ℏ/2 but Δx≠Δp  ✓","Non-Gaussian states generally have ΔxΔp>ℏ/2"]],
      ["Compatibility criterion", "[Â,B̂]=0 is equivalent to existence of a common eigenbasis; this means Â and B̂ can be measured simultaneously without disturbing each other",
       ["Proof: simultaneous eigenstates iff [Â,B̂]=0  ✓","CSCO uniquely labels all states in the spectrum  ✓","Degenerate case needs more operators in the CSCO"]],
      ["CSCO completeness", "A CSCO {Â₁,...,Âₖ} satisfies: all mutually commuting; joint eigenvalues {a₁,...,aₖ} label each eigenstate uniquely (no degeneracy remains)",
       ["H-atom: 4 operators needed (n,l,m,mₛ)  ✓","1D harmonic oscillator: Ĥ alone is a CSCO  ✓","3D HO: {Ĥ,L̂²,L̂_z} or {Ĥ_x,Ĥ_y,Ĥ_z} both work"]],
    ],

    cqPointers: [
      "[Â,B̂]≠0 means they have no common eigenbasis; measuring one randomises the other",
      "False: uncertainty principle is about the state, not the act of measurement; it holds even without any measurement",
      "Robertson: ΔA·ΔB≥½|⟨[Â,B̂]⟩|; saturated when δÂ|ψ⟩=iλδB̂|ψ⟩",
      "CSCO: four operators for H-atom to distinguish all (n,l,m,mₛ); degeneracy removed by each operator added",
      "True: if [Â,B̂]=0 they share at least a complete common eigenbasis (more subtle with degeneracy)",
      "Zeno effect: rapid projective measurements inhibit transition; survival probability P→1 as measurement frequency→∞",
      "[x̂²,p̂] = [x̂,p̂]x̂ + x̂[x̂,p̂] = iℏx̂ + x̂·iℏ = 2iℏx̂",
      "ΔEΔt is not a Heisenberg relation — Δt is not an operator; it refers to the lifetime of a state or the timescale of evolution",
    ],

    tierTasks: {
      hs: ["Explain in plain words why you cannot know both position AND momentum exactly",
           "Describe one experiment that demonstrates quantum uncertainty (not measurement disturbance)",
           "What does ΔxΔp≥ℏ/2 say about a particle at rest?"],
      begug: ["Compute [x̂,p̂²] and [x̂²,p̂] using the product rule and CCR",
              "Evaluate ΔxΔp for the ground state of the harmonic oscillator",
              "Verify Robertson inequality numerically for a spin-1/2 state"],
      advug: ["Derive Robertson's inequality from scratch using Cauchy–Schwarz",
              "Prove [Â,B̂]=0 iff they have a common complete eigenbasis",
              "State and prove the saturation condition for the Heisenberg inequality"],
      msc: ["Derive Schrödinger's stronger inequality (adds symmetric anticommutator term)",
            "Show the CSCO for the hydrogen atom (n,l,m,mₛ) and explain each operator",
            "State Stone–von Neumann theorem and explain its uniqueness implication"],
      phd: ["State the Weyl form of the CCR and explain its domain advantages",
            "Construct a non-equivalent representation of the CCR (violation of S–vN assumptions)",
            "Derive entropic uncertainty relations and compare to Robertson"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L04": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Identify Generators via Stone's Theorem",
        goal:"Given U(θ), extract the generator Ĝ; know the physical operator for each symmetry",
        keyPoints:[
          "Stone's theorem: every strongly continuous one-parameter unitary group U(θ)=e^{iθĜ} has a self-adjoint generator Ĝ",
          "Generator extracted: Ĝ = −i dU/dθ|_{θ=0}",
          "Translation U_a = e^{iap̂/ℏ}: generator is p̂/ℏ  (momentum / ℏ)",
          "Rotation U_α = e^{iαL̂_z/ℏ}: generator is L̂_z/ℏ;  Phase U_φ = e^{iφN̂}: generator is N̂",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const groups=[
            {sym:"Translation",U:"e^{iap̂/ℏ}",G:"p̂/ℏ",phys:"momentum",color:C.accent},
            {sym:"Rotation",U:"e^{iαL̂_z/ℏ}",G:"L̂_z/ℏ",phys:"ang. momentum",color:C.teal},
            {sym:"Time evolution",U:"e^{-iĤt/ℏ}",G:"-Ĥ/ℏ",phys:"Hamiltonian",color:C.mscCol},
            {sym:"Phase (U(1))",U:"e^{iφN̂}",G:"N̂",phys:"particle number",color:C.gold},
          ];
          for(let i=0;i<groups.length;i++){
            const g=groups[i], bx=ox+(i%2)*2.02, by=oy+Math.floor(i/2)*1.1;
            box(s,pres,bx,by,1.95,1.0,g.color+"18",g.color);
            txt(s,bx,by+0.04,1.95,0.22,g.sym,g.color,8.5,FONT_HEAD,true,"center");
            txt(s,bx,by+0.28,1.95,0.22,"U = "+g.U,C.offwhite,8,FONT_MONO,false,"center");
            txt(s,bx,by+0.52,1.95,0.22,"G = "+g.G,C.white,8.5,FONT_MONO,true,"center");
            txt(s,bx,by+0.76,1.95,0.22,g.phys,C.muted,7.5,FONT_BODY,false,"center",true);
          }
        },
        diagLabel:"Four canonical unitary groups and their self-adjoint generators",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Prove Noether's Theorem in QM",
        goal:"Show [Ĥ,Ĝ]=0 implies d⟨Ĝ⟩/dt=0 via Heisenberg EOM",
        keyPoints:[
          "Heisenberg EOM: dĜ_H/dt = (i/ℏ)[Ĥ,Ĝ_H] + (∂_tĜ)_H",
          "If [Ĥ,Ĝ]=0 and Ĝ has no explicit time dependence: dĜ_H/dt=0",
          "Therefore d⟨Ĝ⟩/dt=0 — the expectation value is constant in time",
          "Physical meaning: the symmetry transformation U(θ)=e^{iθĜ} leaves Ĥ invariant",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const steps=[
            {t:"Symmetry: [Ĥ,U(θ)]=0",c:C.accent},
            {t:"⟺  [Ĥ,Ĝ]=0  (expand to first order in θ)",c:C.teal},
            {t:"Heisenberg EOM: dĜ_H/dt = (i/ℏ)[Ĥ,Ĝ]",c:C.offwhite},
            {t:"⟹  dĜ_H/dt = 0",c:C.begCol},
            {t:"⟹  d⟨Ĝ⟩/dt = 0  (conservation law)",c:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            box(s,pres,ox,y,3.6,0.34,i===4?"201700":"0D1A2A",steps[i].c);
            txt(s,ox+0.1,y,3.4,0.34,steps[i].t,steps[i].c,8.5,FONT_MONO,i===4,i===4?"center":"left");
            if(i<steps.length-1){ vline(s,pres,ox+1.8,y+0.34,y+0.5,C.muted); }
            y+=0.5;
          }
        },
        diagLabel:"Noether's theorem in 5 steps: symmetry → generator → EOM → conservation",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Classify Discrete Symmetries",
        goal:"Identify parity, time reversal, and charge conjugation; unitary vs. anti-unitary",
        keyPoints:[
          "Parity Π̂: unitary, Π̂|x⟩=|−x⟩; Π̂x̂Π̂⁻¹=−x̂, Π̂p̂Π̂⁻¹=−p̂, Π̂L̂Π̂⁻¹=+L̂",
          "Time reversal T̂: anti-unitary (T̂(α|ψ⟩)=α*T̂|ψ⟩); T̂iT̂⁻¹=−i",
          "Charge conjugation Ĉ: maps particle ↔ antiparticle; unitary in QM",
          "CPT theorem: the combined CPT is an exact symmetry of any local Lorentz-invariant QFT",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const syms=[
            {name:"Parity Π̂",type:"Unitary",action:"x→−x, p→−p, L→+L",color:C.accent},
            {name:"Time rev. T̂",type:"Anti-unitary",action:"t→−t, p→−p, L→−L",color:C.phdCol},
            {name:"Charge conj. Ĉ",type:"Unitary",action:"q→−q, ψ→ψ^c",color:C.teal},
            {name:"CPT combined",type:"Exact symmetry",action:"product of C, P, T",color:C.gold},
          ];
          for(let i=0;i<syms.length;i++){
            const g=syms[i]; const bx=ox+(i%2)*2.0, by=oy+Math.floor(i/2)*1.08;
            box(s,pres,bx,by,1.92,0.98,g.color+"18",g.color);
            txt(s,bx,by+0.06,1.92,0.26,g.name,g.color,9,FONT_HEAD,true,"center");
            txt(s,bx,by+0.34,1.92,0.22,g.type,C.offwhite,8,FONT_BODY,true,"center");
            txt(s,bx,by+0.58,1.92,0.32,g.action,C.muted,7.5,FONT_MONO,false,"center");
          }
        },
        diagLabel:"Four discrete symmetries: type (unitary/anti-unitary) and action on observables",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Distinguish Explicit vs. Spontaneous Symmetry Breaking",
        goal:"Identify when a symmetry is broken and describe the physical consequences",
        keyPoints:[
          "Explicit breaking: Ĥ does not commute with Ĝ; the symmetry is not present in the Lagrangian",
          "Spontaneous breaking: Ĥ commutes with Ĝ but the ground state does not: Ĝ|0⟩≠0",
          "Goldstone theorem: continuous spontaneously broken symmetry → massless Goldstone bosons",
          "Examples: ferromagnetism (SO(3)→SO(2)); superconductivity (U(1) breaking → Meissner)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Mexican hat potential schematic using circles
          const cx=ox+1.9, cy=oy+1.4, R=1.0, r=0.3;
          // Outer ring (degenerate ground states)
          for(let a=0;a<12;a++){
            const angle=a*Math.PI/6;
            const px=cx+R*Math.cos(angle), py=cy+R*0.38*Math.sin(angle);
            oval(s,pres,px,py,0.12,0.12,C.teal,C.teal);
          }
          // Centre max
          oval(s,pres,cx,cy,r*0.6,r*0.25,"1A0D2A",C.mscCol);
          txt(s,cx-0.5,cy-0.14,1.0,0.18,"V(φ)",C.mscCol,7.5,FONT_MONO,true,"center");
          // Labels
          txt(s,ox,oy,3.8,0.26,"Spontaneous Symmetry Breaking",C.gold,9,FONT_HEAD,true,"center");
          txt(s,ox,oy+0.3,3.8,0.22,"Ĥ symmetric, but ground state is not",C.offwhite,8.5,FONT_BODY,false,"center",true);
          txt(s,cx-1.3,cy+1.08,2.6,0.2,"Degenerate ground states (ring)",C.teal,7.5,FONT_BODY,false,"center",true);
          txt(s,cx-0.8,cy-0.36,1.6,0.2,"Local maximum",C.mscCol,7.5,FONT_BODY,false,"center",true);
          box(s,pres,ox,oy+2.36,3.8,0.26,"201700",C.gold);
          txt(s,ox+0.1,oy+2.36,3.6,0.26,"Goldstone: broken continuous sym. → massless modes",C.gold,8,FONT_MONO,false,"center");
        },
        diagLabel:"Mexican-hat potential: symmetric Hamiltonian, asymmetric ground state",
      },
    ],

    formulaAnswers: [
      ["One-parameter unitary group", "U(θ)=e^{iθĜ} is generated by the self-adjoint Ĝ; unitarity follows from Hermiticity of Ĝ; the group property U(θ₁+θ₂)=U(θ₁)U(θ₂) holds",
       ["U(0)=Î  ✓","U(θ)†=U(−θ)=U(θ)⁻¹  ✓","dU/dθ|₀ = iĜ; extract Ĝ = −i dU/dθ|₀  ✓"]],
      ["Noether's theorem", "[Ĥ,Ĝ]=0 implies d⟨Ĝ⟩/dt=0; derived directly from the Heisenberg equation of motion; the classical analogue is Noether's theorem via Poisson brackets",
       ["dĜ_H/dt=(i/ℏ)[Ĥ,Ĝ]=0  ✓","⟨Ĝ⟩(t) = const  ✓","Converse: d⟨Ĝ⟩/dt=0 ∀ states iff [Ĥ,Ĝ]=0"]],
      ["Parity action", "Π̂x̂Π̂⁻¹=−x̂, Π̂p̂Π̂⁻¹=−p̂, Π̂L̂Π̂⁻¹=+L̂  — derived from Π̂|x⟩=|−x⟩; orbital angular momentum L̂=r̂×p̂ is a pseudovector (even under parity)",
       ["Π̂²=Î  ✓","Eigenvalues: ±1 (even/odd parity states)  ✓","Selection rule: parity-changing transition allowed only if [Ĥ,Π̂]≠0"]],
      ["Time reversal anti-unitary", "T̂ is anti-unitary: T̂(α|ψ⟩)=α*T̂|ψ⟩; this is required so T̂ maps the Schrödinger equation to itself under t→−t; T̂iT̂⁻¹=−i",
       ["T̂ = ÛK where Û unitary and K = complex conjugation  ✓","T̂p̂T̂⁻¹=−p̂, T̂x̂T̂⁻¹=+x̂  ✓","T̂²=−1 for half-integer spin → Kramers degeneracy"]],
      ["Stone's theorem formula", "Ĝ = −i dU/dθ|_{θ=0} extracts the self-adjoint generator from any strongly continuous one-parameter unitary group; domain of Ĝ is the set of states where this derivative exists",
       ["For U_a=e^{iap̂/ℏ}: Ĝ=p̂/ℏ  ✓","For U_φ=e^{-iĤt/ℏ}: Ĝ=−Ĥ/ℏ  ✓","Self-adjointness of Ĝ guarantees unitarity of U(θ)"]],
      ["CPT theorem", "CPT is an exact symmetry of all local Lorentz-invariant quantum field theories; C, P, T individually can each be violated (weak interaction violates P and CP), but their product is preserved",
       ["Weak interaction: violates P (parity)  ✓","K mesons: violate CP  ✓","CPT: all known particle physics preserves it  ✓"]],
    ],

    cqPointers: [
      "Stone's theorem: Ĝ is self-adjoint; U(θ)=e^{iθĜ} strongly continuous; Ĝ unique on its domain",
      "Noether via Heisenberg: [Ĥ,Ĝ]=0 → dĜ_H/dt=0 → d⟨Ĝ⟩/dt=0 for any state",
      "False: T̂ is anti-unitary (involves complex conjugation); unitary would not reverse time",
      "Translation invariance ⟺ [Ĥ,p̂]=0 ⟺ momentum conserved (Noether's theorem)",
      "Explicit: Ĥ breaks symmetry; Spontaneous: Ĥ symmetric, ground state asymmetric",
      "False: CPT is exact; C and P are individually violated by the weak interaction",
      "Atoms: parity symmetric (Coulomb V(r)); ammonia: parity broken by geometry if N is off-center",
      "Goldstone modes appear when a continuous symmetry is spontaneously broken; one massless mode per broken generator",
    ],

    tierTasks: {
      hs: ["'If physics looks the same after turning everything upside down, something is conserved.' What is conserved?",
           "Give one example of a physical symmetry and state the corresponding conservation law",
           "Why does the weak force violate parity? Describe the Wu experiment qualitatively"],
      begug: ["Verify [Ĥ,p̂]=0 for a translationally invariant Hamiltonian Ĥ=p̂²/2m",
              "Check the parity of the wavefunctions ψ₀(x), ψ₁(x) of the harmonic oscillator",
              "Show U(θ₁)U(θ₂)=U(θ₁+θ₂) for U(θ)=e^{iθĜ}"],
      advug: ["Prove Noether's theorem in QM using the Heisenberg equation of motion",
              "Derive parity selection rule: ⟨m|x̂|n⟩=0 unless m and n have opposite parity",
              "Show Π̂x̂Π̂⁻¹=−x̂ from the definition Π̂|x⟩=|−x⟩"],
      msc: ["State the su(2) Lie algebra [Jᵢ,Jⱼ]=iℏεᵢⱼₖJₖ and derive the structure constants",
            "Prove Kramers degeneracy from T̂²=−1 for half-integer spin systems",
            "Classify all unitary irreducible representations of U(1) and SO(2)"],
      phd: ["Define projective representations and explain why they arise in QM",
            "State and prove Goldstone's theorem (boson counting for broken generators)",
            "Discuss Wigner–Eckart theorem as a consequence of rotational symmetry"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L05": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Derive Û(t) = e^{-iĤt/ℏ}",
        goal:"Show the time-evolution operator follows from the TDSE and must be unitary",
        keyPoints:[
          "TDSE: iℏ∂_t|ψ(t)⟩ = Ĥ|ψ(t)⟩; linearity implies |ψ(t)⟩=Û(t)|ψ(0)⟩",
          "Û satisfies: iℏ∂_tÛ = ĤÛ with Û(0)=Î; solution: Û(t)=e^{-iĤt/ℏ} for time-indep Ĥ",
          "Unitarity: Û†Û=e^{+iĤ†t/ℏ}e^{-iĤt/ℏ}=Î since Ĥ†=Ĥ (Hermitian)",
          "Group property: Û(t₂)Û(t₁)=Û(t₁+t₂) — composing evolutions is additive in time",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const steps=[
            {t:"TDSE: iℏ∂_t|ψ⟩ = Ĥ|ψ⟩",c:C.accent},
            {t:"Û satisfies iℏ∂_tÛ = ĤÛ",c:C.teal},
            {t:"Solution: Û(t) = e^{-iĤt/ℏ}",c:C.begCol},
            {t:"Ĥ†=Ĥ ⟹ Û†Û=Î (unitary)",c:C.gold},
            {t:"Prob. conserved: ⟨ψ(t)|ψ(t)⟩=1",c:C.mscCol},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            box(s,pres,ox,y,3.8,0.36,i===2?"0D2A1A":"0D1A2A",steps[i].c,i===2?2:1.5);
            txt(s,ox+0.1,y,3.6,0.36,steps[i].t,steps[i].c,i===2?10:9,FONT_MONO,i===2,"center");
            if(i<steps.length-1){ vline(s,pres,ox+1.9,y+0.36,y+0.52,C.muted); }
            y+=0.52;
          }
          txt(s,ox,y+0.06,3.8,0.22,"Group: Û(t₂)Û(t₁) = Û(t₁+t₂)",C.muted,8,FONT_MONO,false,"center",true);
        },
        diagLabel:"Derivation chain: TDSE → Û equation → solution → unitarity → conservation",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Evolve States in the Energy Eigenbasis",
        goal:"Expand any initial state in energy eigenstates and apply phase factors",
        keyPoints:[
          "Expand: |ψ(0)⟩ = Σₙ cₙ|Eₙ⟩ where cₙ=⟨Eₙ|ψ(0)⟩",
          "Each energy eigenstate evolves simply: e^{-iĤt/ℏ}|Eₙ⟩ = e^{-iEₙt/ℏ}|Eₙ⟩",
          "General solution: |ψ(t)⟩ = Σₙ cₙ e^{-iEₙt/ℏ}|Eₙ⟩",
          "Stationary state: if |ψ(0)⟩=|Eₙ⟩, all probabilities are constant — no evolution of ⟨Â⟩",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Two-level system evolution diagram
          const levels=[{E:"E₁",color:C.teal},{E:"E₂",color:C.accent},{E:"E₃",color:C.mscCol}];
          const bx=ox, w=3.8;
          txt(s,bx,oy,w,0.22,"Two-state superposition evolution",C.gold,8.5,FONT_HEAD,true,"center");
          // Energy level lines
          for(let i=0;i<levels.length;i++){
            const ly=oy+0.32+i*0.55;
            hline(s,pres,bx+0.1,ly+0.12,bx+w-0.1,levels[i].color,false);
            txt(s,bx,ly,0.5,0.24,levels[i].E,levels[i].color,8.5,FONT_MONO,true,"left");
            // Phase factor
            txt(s,bx+w-1.6,ly-0.02,1.5,0.22,"× e^{-iE"+String(i+1)+"t/ℏ}",levels[i].color,7.5,FONT_MONO,false,"right",true);
          }
          const ry=oy+0.32+3*0.55+0.08;
          box(s,pres,bx,ry,w,0.36,"0D1A2A",C.gold,2);
          txt(s,bx,ry,w,0.36,"|ψ(t)⟩ = Σₙ cₙ e^{-iEₙt/ℏ}|Eₙ⟩",C.gold,9.5,FONT_MONO,true,"center");
          txt(s,bx,ry+0.4,w,0.22,"Probabilities |cₙ|² constant — only phases change",C.muted,7.5,FONT_BODY,false,"center",true);
        },
        diagLabel:"Phase factors e^{-iEₙt/ℏ} accumulate independently on each energy eigenstate",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Exploit Stationary State Structure",
        goal:"Identify when expectation values are constant and compute time-dependent ones",
        keyPoints:[
          "Stationary state |Eₙ⟩: all probabilities constant; ⟨Â⟩(t)=⟨Eₙ|Â|Eₙ⟩ independent of t",
          "Time dependence appears only when [Â,Ĥ]≠0 and state is a superposition",
          "Ehrenfest: d⟨x̂⟩/dt=⟨p̂⟩/m;  d⟨p̂⟩/dt=−⟨∇V⟩  (both derived from Heisenberg EOM)",
          "Energy conservation: d⟨Ĥ⟩/dt=0 always (since [Ĥ,Ĥ]=0)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Comparison table: stationary vs superposition
          const cols=["Property","Stationary |Eₙ⟩","Superposition Σcₙ|Eₙ⟩"];
          const rows=[
            ["⟨Ĥ⟩","Eₙ = const","Σₙ|cₙ|²Eₙ = const"],
            ["⟨Â⟩ for [Â,Ĥ]=0","⟨Eₙ|Â|Eₙ⟩ const","Σₙ|cₙ|²⟨n|Â|n⟩ const"],
            ["⟨Â⟩ for [Â,Ĥ]≠0","⟨Eₙ|Â|Eₙ⟩ const","Oscillates at ωₘₙ=(Eₘ-Eₙ)/ℏ"],
            ["P(outcome a)","constant","oscillates"],
          ];
          const cw=[1.0,1.38,1.38], ch=0.3;
          const bx=ox;
          for(let c=0;c<3;c++){
            let cx2=bx+cw.slice(0,c).reduce((a,b)=>a+b,0);
            box(s,pres,cx2,oy,cw[c],ch,"0D1B2E",C.accent);
            txt(s,cx2,oy,cw[c],ch,cols[c],C.white,8,FONT_HEAD,true,"center");
          }
          for(let r=0;r<rows.length;r++){
            const ry=oy+ch+r*ch;
            const bg=r%2===0?"0D1A2A":"0D1420";
            for(let c=0;c<3;c++){
              let cx2=bx+cw.slice(0,c).reduce((a,b)=>a+b,0);
              box(s,pres,cx2,ry,cw[c],ch,bg,C.muted,0.5);
              txt(s,cx2+0.04,ry,cw[c]-0.08,ch,rows[r][c],c===0?C.teal:C.offwhite,7.5,FONT_MONO,false,"center");
            }
          }
        },
        diagLabel:"When does ⟨Â⟩ vary in time? Only in superpositions with [Â,Ĥ]≠0",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Derive the Probability Current",
        goal:"Show ∂_t|ψ|² + ∇·j = 0 and identify j",
        keyPoints:[
          "Start from TDSE and its conjugate; multiply and subtract: ∂_t|ψ|² = (iℏ/2m)(ψ*∇²ψ−ψ∇²ψ*)",
          "Identify: j = (ℏ/2mi)(ψ*∇ψ−ψ∇ψ*)  — the probability current density",
          "Continuity: ∂_t ρ + ∇·j = 0 where ρ=|ψ|² — probability is locally conserved",
          "Integrated: d/dt ∫|ψ|²d³r = −∮j·dS = 0  (probability doesn't leak out to ∞)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Continuity equation derivation flow
          const steps=[
            {t:"iℏ∂_tψ = −(ℏ²/2m)∇²ψ + Vψ",c:C.accent},
            {t:"− c.c.: ∂_t|ψ|² = (iℏ/2m)∇·(ψ*∇ψ−ψ∇ψ*)",c:C.teal},
            {t:"j ≡ (ℏ/2mi)(ψ*∇ψ−ψ∇ψ*)",c:C.mscCol},
            {t:"∂_t ρ + ∇·j = 0  (continuity equation)",c:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            box(s,pres,ox,y,3.8,0.38,i===3?"201700":"0D1A2A",steps[i].c,i===3?2:1.5);
            txt(s,ox+0.08,y,3.64,0.38,steps[i].t,steps[i].c,8,FONT_MONO,i===3,"center");
            if(i<steps.length-1) vline(s,pres,ox+1.9,y+0.38,y+0.54,C.muted);
            y+=0.54;
          }
          box(s,pres,ox,y+0.06,3.8,0.3,"0D1E1D",C.teal);
          txt(s,ox,y+0.06,3.8,0.3,"∫d³r ∂_t|ψ|² = 0  ⟹  norm conserved globally",C.teal,8,FONT_MONO,false,"center");
        },
        diagLabel:"Derivation: TDSE − c.c. → identify j → continuity equation → global conservation",
      },
    ],

    formulaAnswers: [
      ["TDSE", "The time-dependent Schrödinger equation iℏ∂_t|ψ(t)⟩=Ĥ|ψ(t)⟩ is the quantum analogue of Hamilton's equations; it is first-order in time, linear, and deterministic",
       ["Linearity: superpositions evolve linearly  ✓","Hermitian Ĥ ensures unitarity  ✓","Reduces to TISE Ĥ|E⟩=E|E⟩ for stationary states"]],
      ["Time-evolution operator", "Û(t)=e^{-iĤt/ℏ} is unitary (Ĥ Hermitian) and satisfies Û(0)=Î and Û(t₂)Û(t₁)=Û(t₁+t₂); it generates a one-parameter unitary group",
       ["Û†(t)Û(t)=Î  ✓","∂_tÛ = −(iĤ/ℏ)Û  ✓","Group property: Û(t₁+t₂)=Û(t₁)Û(t₂)  ✓"]],
      ["General solution", "|ψ(t)⟩=Σₙcₙe^{-iEₙt/ℏ}|Eₙ⟩ is the most general solution for time-independent Ĥ; coefficients cₙ=⟨Eₙ|ψ(0)⟩ are set by initial conditions",
       ["Σₙ|cₙ|²=1 (normalization conserved)  ✓","Each term oscillates at frequency Eₙ/ℏ  ✓","Beats at frequencies (Eₘ−Eₙ)/ℏ in ⟨Â⟩"]],
      ["Probability current", "j=(ℏ/2mi)(ψ*∇ψ−ψ∇ψ*) is the current associated with the probability density ρ=|ψ|²; derived from the Schrödinger equation minus its complex conjugate",
       ["j is real-valued  ✓","For a plane wave e^{ikx}: j = ℏk/m  ✓","For a stationary state: j=0 (standing wave)"]],
      ["Continuity equation", "∂_t|ψ|²+∇·j=0 expresses local conservation of probability; it is exact (no approximation); the integrated form gives d/dt∫|ψ|²d³r=0",
       ["Exact, no approximation  ✓","Integrated: total probability constant  ✓","Analogue of charge conservation in electrodynamics"]],
      ["Kramers degeneracy", "T̂²=−1 for half-integer spin implies every energy level is at least 2-fold degenerate in a time-reversal-invariant system; no perturbation can split it",
       ["T̂²=+1 for integer spin (no Kramers)  ✓","Kramers pair: |ψ⟩ and T̂|ψ⟩ are orthogonal  ✓","Important for topological insulators and spin-orbit coupled systems"]],
    ],

    cqPointers: [
      "Unitarity of Û follows from Hermiticity of Ĥ; ensures ⟨ψ(t)|ψ(t)⟩=1 for all t",
      "False: stationary state means all probabilities constant, not ⟨Ĥ⟩ changing",
      "Group property Û(t₂)Û(t₁)=Û(t₁+t₂) means evolution composes correctly; time is additive",
      "d⟨Â⟩/dt = (i/ℏ)⟨[Ĥ,Â]⟩; if [Ĥ,Â]=0 then ⟨Â⟩ constant",
      "False: T̂=ÛK (antiunitary); complex conjugation K makes T̂ anti-unitary",
      "Kramers: T̂²=−1 for half-integer spin; every energy level doubly degenerate in T-invariant system",
      "Continuity: ∂_tρ = source of probability; ∇·j = how it flows; together they state local conservation",
      "Insert x̂=∫dx|x⟩⟨x|: ⟨x|Ĥ|ψ⟩ = [−(ℏ²/2m)∂²_x + V(x)]ψ(x); position-rep TDSE emerges",
    ],

    tierTasks: {
      hs: ["'The Hamiltonian is the quantum clock.' Explain what this means",
           "Why does a stationary state not mean the particle is stationary?",
           "Draw an energy level diagram and show how a superposition oscillates between levels"],
      begug: ["Evolve |ψ(0)⟩=cos(θ)|E₁⟩+sin(θ)|E₂⟩; compute ⟨σ_z⟩(t)",
              "Derive the Rabi oscillation frequency for a two-level system",
              "Verify the continuity equation for a plane wave"],
      advug: ["Prove Û is unitary from Hermiticity of Ĥ using the series expansion",
              "Derive the probability current from the Schrödinger equation",
              "Show that purity is conserved under unitary evolution"],
      msc: ["Prove Kramers degeneracy from T̂²=−1",
            "Connect Û(t)=e^{-iĤt/ℏ} to Stone's theorem for unbounded generators",
            "Discuss self-adjoint extensions for Ĥ=−d²/dx² on [0,L] with different BCs"],
      phd: ["Discuss the domain of −d²/dx² and conditions for self-adjointness",
            "Prove the quantum Zeno effect rigorously using projection-valued measures",
            "Relate Û(t) to the resolvent operator (Ĥ−z)⁻¹ via the Laplace transform"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L06": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Derive the Dyson Series",
        goal:"Solve the integral equation for Û_I iteratively to get the time-ordered expansion",
        keyPoints:[
          "Start from iℏ∂_tÛ_I = V̂_I(t)Û_I; integrate: Û_I(t)=Î−(i/ℏ)∫V̂_I(t')Û_I(t')dt'",
          "Iterate: substitute Û_I on the right, repeat → Dyson series Û_I=Î+Û^{(1)}+Û^{(2)}+...",
          "First order: Û^{(1)}=−(i/ℏ)∫₀ᵗV̂_I(t')dt'",
          "Second order: Û^{(2)}=(−i/ℏ)²∫₀ᵗdt'∫₀^{t'}dt''V̂_I(t')V̂_I(t'')",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const steps=[
            {t:"iℏ∂_tÛ = V̂_I(t)Û",c:C.accent},
            {t:"Û = Î − (i/ℏ)∫V̂_I Û dt'",c:C.teal},
            {t:"Iterate: substitute Û on RHS",c:C.offwhite},
            {t:"Û^(1) = −(i/ℏ)∫V̂_I dt'",c:C.mscCol},
            {t:"Û^(2) = (−i/ℏ)² ∫∫ T[V̂V̂] dt'dt''",c:C.begCol},
            {t:"Û = T exp(−i/ℏ ∫V̂_I dt)",c:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            const isLast=i===steps.length-1;
            box(s,pres,ox,y,3.8,0.34,isLast?"201700":"0D1A2A",steps[i].c,isLast?2:1.5);
            txt(s,ox+0.08,y,3.64,0.34,steps[i].t,steps[i].c,8,FONT_MONO,isLast,"center");
            if(!isLast) vline(s,pres,ox+1.9,y+0.34,y+0.48,C.muted);
            y+=0.48;
          }
        },
        diagLabel:"Iterative construction of the Dyson series from the integral equation",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Write and Evaluate the Time-Ordered Exponential",
        goal:"Express Û as a time-ordered exponential and compute first two terms explicitly",
        keyPoints:[
          "T ordering: T[Â(t₁)B̂(t₂)] places later times to the left — essential when [V̂(t₁),V̂(t₂)]≠0",
          "Compact: Û = T exp(−i/ℏ ∫₀ᵗ V̂_I(t')dt') — only meaningful as a shorthand for Dyson series",
          "First term evaluated: Û^{(1)}(t,0) = −(i/ℏ)∫₀ᵗ e^{iω_{fi}t'} V̂_I(0) dt' for const V̂",
          "Transition amplitude: ⟨f|Û^{(1)}|i⟩ gives first-order probability amplitude",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Time ordering diagram: triangle integration region
          box(s,pres,ox,oy,3.8,0.26,"0D1A2A",C.teal);
          txt(s,ox,oy,3.8,0.26,"Time-ordering: T[A(t₁)B(t₂)]",C.teal,9,FONT_HEAD,true,"center");
          // Integration region schematic
          box(s,pres,ox,oy+0.34,1.8,1.8,"080E16",C.muted,0.8);
          txt(s,ox,oy+2.18,1.8,0.2,"Integration region",C.muted,7.5,FONT_BODY,false,"center",true);
          // Draw triangle inside box
          const bx=ox+0.1, by=oy+0.44;
          s.addShape(pres.shapes.LINE,{x:bx,y:by,w:1.5,h:0,line:{color:C.muted,width:0.8}});
          s.addShape(pres.shapes.LINE,{x:bx,y:by,w:0,h:1.5,line:{color:C.muted,width:0.8}});
          s.addShape(pres.shapes.LINE,{x:bx,y:by+1.5,w:1.5,h:-1.5,line:{color:C.teal,width:1.5}});
          txt(s,bx+0.15,by+0.4,1.1,0.3,"t₂ < t₁\n(ordered)",C.teal,8,FONT_BODY,false,"center",true);
          txt(s,bx+1.35,by,0.3,0.22,"t₁",C.muted,8,FONT_MONO,false,"right");
          txt(s,bx-0.22,by+1.5,0.3,0.22,"t₂",C.muted,8,FONT_MONO,false,"left");
          // Key formulas on right
          const fx=ox+2.0;
          box(s,pres,fx,oy+0.34,1.7,0.54,"0D1A2A",C.accent);
          txt(s,fx+0.08,oy+0.38,1.54,0.46,"t₁>t₂:\nT[A(t₁)B(t₂)]=A(t₁)B(t₂)",C.offwhite,7.5,FONT_MONO,false,"center");
          box(s,pres,fx,oy+0.96,1.7,0.54,"0D1A2A",C.teal);
          txt(s,fx+0.08,oy+1.0,1.54,0.46,"t₁<t₂:\nT[A(t₁)B(t₂)]=B(t₂)A(t₁)",C.offwhite,7.5,FONT_MONO,false,"center");
        },
        diagLabel:"Time ordering: the triangular region t''>t' in the double integral",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Why Magnus Preserves Unitarity",
        goal:"Contrast Dyson (not term-by-term unitary) with Magnus (exactly unitary at each order)",
        keyPoints:[
          "Dyson series: each term Û^{(n)} is not individually unitary; unitarity only restored at all orders",
          "Magnus ansatz: Û(t)=e^{Ω(t)} where Ω = Ω₁+Ω₂+... is anti-Hermitian",
          "Ω anti-Hermitian ⟹ e^Ω is unitary — exactly at every order",
          "Ω₁=−(i/ℏ)∫V̂_I dt'; Ω₂=−(1/2ℏ²)∫∫[V̂_I(t'),V̂_I(t'')]dt'dt''",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Side-by-side comparison
          const w=1.85;
          box(s,pres,ox,oy,w,0.28,"0D1A2A",C.accent,2);
          txt(s,ox,oy,w,0.28,"Dyson series",C.accent,9,FONT_HEAD,true,"center");
          const drows=["Û=Î+Û^(1)+Û^(2)+...","Each term ≠ unitary","Sum: unitary at all orders","Diverges for large V or t"];
          for(let i=0;i<drows.length;i++){
            const ry=oy+0.28+i*0.36;
            box(s,pres,ox,ry,w,0.34,i%2===0?"0D1420":"0D1820",C.accent,0.5);
            txt(s,ox+0.08,ry,w-0.16,0.34,drows[i],i===1?C.phdCol:C.offwhite,8,FONT_MONO,false,"center");
          }
          const rx=ox+w+0.12;
          box(s,pres,rx,oy,w,0.28,"0D1A2A",C.teal,2);
          txt(s,rx,oy,w,0.28,"Magnus expansion",C.teal,9,FONT_HEAD,true,"center");
          const mrows=["Û=e^{Ω₁+Ω₂+...}","Each e^Ωₙ is unitary","Ω anti-Hermitian","Better for long-time sim."];
          for(let i=0;i<mrows.length;i++){
            const ry=oy+0.28+i*0.36;
            box(s,pres,rx,ry,w,0.34,i%2===0?"0D1E1D":"0D1E15",C.teal,0.5);
            txt(s,rx+0.08,ry,w-0.16,0.34,mrows[i],i===1?C.begCol:C.offwhite,8,FONT_MONO,false,"center");
          }
        },
        diagLabel:"Dyson vs. Magnus: only Magnus guarantees unitarity at each truncation order",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Apply Piecewise-Constant Approximation",
        goal:"Discretise time and apply the Trotter product formula for driven systems",
        keyPoints:[
          "Divide [0,t] into N steps of width Δt=t/N; within each step, treat Ĥ as constant",
          "Û ≈ ∏ₖ e^{-iĤ(tₖ)Δt/ℏ}  — Trotter product formula (first order in Δt)",
          "Error: |Û_exact − Û_Trotter| = O(Δt²) from BCH formula [Ĥ(t₁),Ĥ(t₂)]≠0 contributions",
          "Suzuki–Trotter 2nd order: symmetric splitting reduces error to O(Δt³)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Time discretisation bar diagram
          const N=5, bw=0.68, bh=0.7, gap=0.04;
          txt(s,ox,oy,3.8,0.22,"Trotter product formula (Δt steps)",C.mscCol,8.5,FONT_HEAD,true,"center");
          for(let i=0;i<N;i++){
            const bx=ox+i*(bw+gap)+0.1;
            const intensity=0.3+i*0.12;
            const col=C.mscCol;
            box(s,pres,bx,oy+0.28,bw,bh,col+"40",col);
            txt(s,bx,oy+0.28,bw,bh,"e^{-iĤₖΔt/ℏ}",col,7.5,FONT_MONO,false,"center");
            txt(s,bx,oy+1.02,bw,0.2,"t"+i,C.muted,7,FONT_MONO,false,"center");
          }
          hline(s,pres,ox,oy+1.26,ox+N*(bw+gap)+0.1-gap,C.muted);
          box(s,pres,ox,oy+1.4,3.8,0.3,"1A0F2A",C.mscCol);
          txt(s,ox,oy+1.4,3.8,0.3,"Û ≈ e^{-iĤ₄Δt} ··· e^{-iĤ₀Δt}  (right to left)",C.mscCol,8,FONT_MONO,false,"center");
          box(s,pres,ox,oy+1.76,3.8,0.26,"201700",C.gold);
          txt(s,ox,oy+1.76,3.8,0.26,"Error O(Δt²); Suzuki–Trotter 2nd order → O(Δt³)",C.gold,7.5,FONT_BODY,false,"center",true);
        },
        diagLabel:"Trotter product: compose N short exact evolutions under constant Ĥ(tₖ)",
      },
    ],

    formulaAnswers: [
      ["Dyson / time-ordered exponential", "T exp(−i/ℏ ∫Ĥdt) is a compact notation for the Dyson series; the T-ordering is essential when [Ĥ(t₁),Ĥ(t₂)]≠0 since operators at different times don't commute",
       ["Without T: e^{A+B}≠e^Ae^B when [A,B]≠0  ✓","T-ordering gives correct time-ordered product  ✓","Reduces to e^{-iĤt/ℏ} when Ĥ is time-independent  ✓"]],
      ["First Dyson term", "Û^{(1)}=−(i/ℏ)∫V̂_I dt' is the leading perturbative correction; gives transition amplitudes to first order; used directly in Fermi's golden rule derivation",
       ["⟨f|Û^(1)|i⟩ = first-order transition amplitude  ✓","P_{i→f} = |⟨f|Û^(1)|i⟩|² to first order  ✓","Valid when V̂ is weak relative to Ĥ₀"]],
      ["First Magnus cumulant", "Ω₁=−(i/ℏ)∫V̂_I dt' is the same as the first Dyson term; but as the exponent Ω₁ it generates exactly unitary evolution even at this order",
       ["e^{Ω₁} is unitary for any Hermitian V̂  ✓","Agrees with Dyson to first order  ✓","Fails to account for ordering effects (corrected by Ω₂)"]],
      ["Second Magnus cumulant", "Ω₂=−(1/2ℏ²)∫∫[V̂_I(t'),V̂_I(t'')]dt'dt'' captures the commutator correction; vanishes if V̂ commutes at all times",
       ["Ω₂=0 if [V̂(t₁),V̂(t₂)]=0 for all t₁,t₂  ✓","Anti-Hermitian: Ω₂†=−Ω₂ → e^{Ω₂} unitary  ✓","Second-order correction to time ordering"]],
      ["Magnus unitarity", "e^{Ω₁+Ω₂+...} is exactly unitary because each Ωₙ is anti-Hermitian (Ωₙ†=−Ωₙ); the exponential of an anti-Hermitian operator is unitary",
       ["Anti-Hermitian Ω → unitary e^Ω always  ✓","Preserves norm at each truncation order  ✓","Dyson does not: each term breaks unitarity"]],
      ["Trotter product formula", "Û≈∏ₖe^{-iĤ(tₖ)Δt/ℏ} approximates continuous evolution by N short steps; error comes from BCH: e^A e^B = e^{A+B+½[A,B]+...}",
       ["First-order Trotter error: O(Δt²)  ✓","Suzuki–Trotter 2nd order: O(Δt³)  ✓","Basis for quantum simulation algorithms (Trotterisation)"]],
    ],

    cqPointers: [
      "[Ĥ(t₁),Ĥ(t₂)]≠0 means the operators at different times do not commute; simple exponential fails due to BCH formula",
      "T places later times to the left: T[Â(t₁)B̂(t₂)]=Â(t₁)B̂(t₂) if t₁>t₂",
      "False: each Dyson term is a nested integral, not a unitary operator; unitarity only restored in the full sum",
      "Magnus: Ωₙ anti-Hermitian → e^Ω unitary at each truncation order; Dyson lacks this structure",
      "Ω₁ = first Dyson term in the exponent; same first-order content, but unitarity built in",
      "False: Trotter error is O(Δt²) from the non-commuting terms; exact only in the limit Δt→0",
      "Time-dependent Hamiltonians: NMR pulses, laser-atom interaction, driven qubits, Floquet systems",
      "Floquet: if Ĥ(t+T)=Ĥ(t), Magnus expansion over one period gives effective static Ĥ_eff",
    ],

    tierTasks: {
      hs: ["'When the Hamiltonian changes in time, history matters.' Give a physical example",
           "Describe what a rotating magnetic field does to a spin-1/2 particle qualitatively",
           "Why can't we just use e^{-iĤt/ℏ} when Ĥ depends on time?"],
      begug: ["Compute the first-order Dyson term for V̂(t)=V₀cos(ωt)σ_x",
              "Apply piecewise-constant approximation for a 2-step evolution",
              "Evaluate the transition probability P_{0→1} at first order for a driven qubit"],
      advug: ["Derive the Dyson series from the integral equation by iteration",
              "Compute Ω₁ and Ω₂ of the Magnus expansion for a rotating field",
              "Prove that time-ordering is necessary by showing BCH failure for non-commuting operators"],
      msc: ["State the convergence condition for the Magnus expansion",
            "Derive the Trotter–Suzuki second-order formula and compute its error",
            "Show how Floquet theory emerges from the Magnus expansion for periodic Ĥ(t)"],
      phd: ["Magnus expansion in Lie algebraic language: show each Ωₙ ∈ g where g is the Lie algebra",
            "Derive the Berry phase from the Magnus expansion adiabatic limit",
            "Discuss quantum simulation circuit depth vs. Trotter step count tradeoff"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L07": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Transform Between Schrödinger and Heisenberg Pictures",
        goal:"Convert operators and states between the two pictures consistently",
        keyPoints:[
          "Schrödinger picture: |ψ_S(t)⟩ time-dependent; Â_S time-independent (usually)",
          "Heisenberg picture: Â_H(t)=Û†(t)Â_S Û(t) time-dependent; |ψ_H⟩=|ψ(0)⟩ static",
          "Physical predictions identical: ⟨Â⟩=⟨ψ_S(t)|Â_S|ψ_S(t)⟩=⟨ψ_H|Â_H(t)|ψ_H⟩",
          "Conversion: multiply/divide by Û(t)=e^{-iĤt/ℏ} on left or right as needed",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Side-by-side comparison with arrows
          const w=1.8;
          box(s,pres,ox,oy,w,0.3,"0D1A2A",C.accent,2);
          txt(s,ox,oy,w,0.3,"Schrödinger",C.accent,9,FONT_HEAD,true,"center");
          const srows=["States: |ψ_S(t)⟩","Ops: Â_S (static)","TDSE evolves states","Natural for wavefunctions"];
          for(let i=0;i<srows.length;i++){
            box(s,pres,ox,oy+0.3+i*0.38,w,0.36,i%2===0?"0D1420":"0D1820",C.accent,0.5);
            txt(s,ox+0.08,oy+0.3+i*0.38,w-0.16,0.36,srows[i],C.offwhite,8,FONT_BODY,false,"center");
          }
          const rx=ox+w+0.22;
          box(s,pres,rx,oy,w,0.3,"0D1A2A",C.teal,2);
          txt(s,rx,oy,w,0.3,"Heisenberg",C.teal,9,FONT_HEAD,true,"center");
          const hrows=["States: |ψ_H⟩ static","Ops: Â_H(t) evolve","EOM drives operators","Natural for algebra"];
          for(let i=0;i<hrows.length;i++){
            box(s,pres,rx,oy+0.3+i*0.38,w,0.36,i%2===0?"0D1E1D":"0D1E15",C.teal,0.5);
            txt(s,rx+0.08,oy+0.3+i*0.38,w-0.16,0.36,hrows[i],C.offwhite,8,FONT_BODY,false,"center");
          }
          // Arrow both ways
          const ay=oy+1.04;
          hline(s,pres,ox+w+0.04,ay,rx-0.04,C.gold);
          txt(s,ox+w+0.04,ay-0.14,0.18,0.14,"⟺",C.gold,10,FONT_HEAD,true,"center");
          txt(s,ox+w+0.03,ay+0.04,0.2,0.16,"Û",C.gold,8,FONT_MONO,false,"center",true);
        },
        diagLabel:"Same physics, different bookkeeping — connected by Û(t)",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Derive and Apply Heisenberg EOM",
        goal:"Use dÂ_H/dt=(i/ℏ)[Ĥ,Â_H] to solve for operators in the Heisenberg picture",
        keyPoints:[
          "Derivation: d/dt(Û†ÂÛ)=(dÛ†/dt)ÂÛ+Û†Â(dÛ/dt)=Û†(i/ℏ)[Ĥ,Â]Û=(i/ℏ)[Ĥ,Â_H]",
          "For harmonic oscillator: dx̂_H/dt=(i/ℏ)[Ĥ,x̂]=p̂_H/m;  dp̂_H/dt=−mω²x̂_H",
          "Solution: x̂_H(t)=x̂cos(ωt)+(p̂/mω)sin(ωt);  p̂_H(t)=−mωx̂sin(ωt)+p̂cos(ωt)",
          "Constants of motion: [Ĥ,Â]=0 ⟹ dÂ_H/dt=0 ⟹ ⟨Â⟩ is conserved",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const steps=[
            {t:"Â_H(t) = Û†(t) Â Û(t)",c:C.accent},
            {t:"d/dt Â_H = (i/ℏ)[Ĥ,Â_H]+(∂Â/∂t)_H",c:C.teal},
            {t:"HO: dx/dt=(i/ℏ)[Ĥ,x]=p/m",c:C.offwhite},
            {t:"dp/dt=(i/ℏ)[Ĥ,p]=−mω²x",c:C.offwhite},
            {t:"x_H(t) = x cos(ωt) + (p/mω)sin(ωt)",c:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            box(s,pres,ox,y,3.8,0.36,i===4?"201700":"0D1A2A",steps[i].c,i===4?2:1.5);
            txt(s,ox+0.08,y,3.64,0.36,steps[i].t,steps[i].c,8,FONT_MONO,i===4,"center");
            if(i<steps.length-1) vline(s,pres,ox+1.9,y+0.36,y+0.5,C.muted);
            y+=0.5;
          }
        },
        diagLabel:"From EOM to HO solution: d/dt Â_H = (i/ℏ)[Ĥ,Â_H]",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Prove Ehrenfest's Theorem and Virial Theorem",
        goal:"Show that quantum expectation values obey classical-like equations of motion",
        keyPoints:[
          "Ehrenfest I: d⟨x̂⟩/dt = ⟨p̂⟩/m  — from Heisenberg EOM for x̂",
          "Ehrenfest II: d⟨p̂⟩/dt = −⟨∇V(x̂)⟩  — from Heisenberg EOM for p̂",
          "Classical limit: if ∇V(x̂)≈∇V(⟨x̂⟩), Ehrenfest → Newton's 2nd law exactly",
          "Virial theorem: ⟨T̂⟩=½⟨x̂ dV/dx⟩ in energy eigenstates (from stationarity of ⟨xp⟩)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Two Ehrenfest equations + virial
          const eqs=[
            {title:"Ehrenfest I",eq:"d⟨x̂⟩/dt = ⟨p̂⟩/m",sub:"from [Ĥ,x̂]=(iℏ/m)p̂",color:C.accent},
            {title:"Ehrenfest II",eq:"d⟨p̂⟩/dt = −⟨∇V⟩",sub:"from [Ĥ,p̂]=iℏ∇V",color:C.teal},
            {title:"Virial Theorem",eq:"2⟨T̂⟩ = ⟨x·∇V⟩",sub:"for energy eigenstates",color:C.gold},
          ];
          for(let i=0;i<eqs.length;i++){
            const by=oy+i*0.84;
            box(s,pres,ox,by,3.8,0.76,eqs[i].color+"18",eqs[i].color);
            txt(s,ox+0.1,by+0.06,3.6,0.22,eqs[i].title,eqs[i].color,9,FONT_HEAD,true,"center");
            txt(s,ox+0.1,by+0.3,3.6,0.26,eqs[i].eq,C.white,10,FONT_MONO,true,"center");
            txt(s,ox+0.1,by+0.58,3.6,0.18,eqs[i].sub,C.muted,7.5,FONT_BODY,false,"center",true);
          }
        },
        diagLabel:"Ehrenfest I & II + Virial theorem: classical equations from quantum EOM",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Apply Dirac's Canonical Quantisation Rule",
        goal:"Replace Poisson brackets with commutators; identify ordering ambiguities",
        keyPoints:[
          "Dirac's rule: {f,g}_PB → [f̂,ĝ]/(iℏ)  — the quantisation postulate",
          "CCR from classical: {x,p}_PB=1 → [x̂,p̂]=iℏ  ✓",
          "Ordering ambiguity: x²p has three orderings; Weyl ordering: ½(x̂²p̂+p̂x̂²)=x̂p̂x̂",
          "Groenewold–Van Hove: no quantisation map from all classical observables consistent with Dirac's rule",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Classical → Quantum with ordering options
          box(s,pres,ox,oy,3.8,0.36,"0D1A2A",C.mscCol,2);
          txt(s,ox,oy,3.8,0.36,"Classical: {x,p}_PB = 1",C.mscCol,10,FONT_MONO,true,"center");
          vline(s,pres,ox+1.9,oy+0.36,oy+0.56,C.muted);
          txt(s,ox+1.96,oy+0.42,1.5,0.18,"Dirac: {·,·}_PB → [·,·]/(iℏ)",C.muted,7.5,FONT_BODY,false,"left",true);
          box(s,pres,ox,oy+0.56,3.8,0.36,"0D1E1D",C.teal,2);
          txt(s,ox,oy+0.56,3.8,0.36,"Quantum: [x̂,p̂] = iℏ ✓",C.teal,10,FONT_MONO,true,"center");
          // Ordering ambiguity
          box(s,pres,ox,oy+1.06,3.8,0.3,"1A0D2A",C.mscCol);
          txt(s,ox,oy+1.06,3.8,0.3,"Ordering ambiguity for x²p:",C.mscCol,8.5,FONT_HEAD,true,"center");
          const ords=["x̂²p̂","x̂p̂x̂  (Weyl)","p̂x̂²"];
          for(let i=0;i<ords.length;i++){
            const bx=ox+i*1.28;
            box(s,pres,bx,oy+1.42,1.22,0.34,i===1?"0D2A1A":"0D1420",i===1?C.teal:C.muted,i===1?2:0.8);
            txt(s,bx,oy+1.42,1.22,0.34,ords[i],i===1?C.teal:C.muted,9,FONT_MONO,i===1,"center");
          }
          box(s,pres,ox,oy+1.82,3.8,0.3,"201700",C.gold);
          txt(s,ox,oy+1.82,3.8,0.3,"G–vH: no consistent global quantisation map exists",C.gold,7.5,FONT_BODY,false,"center",true);
        },
        diagLabel:"Dirac's rule works for low-degree polynomials; ordering must be specified for higher-degree",
      },
    ],

    formulaAnswers: [
      ["Heisenberg picture operator", "Â_H(t)=Û†(t)Â_S Û(t) transforms any operator; it evolves under conjugation by the time-evolution operator; preserves all algebraic relations",
       ["⟨Â⟩ = ⟨ψ_H|Â_H(t)|ψ_H⟩ = ⟨ψ_S(t)|Â_S|ψ_S(t)⟩  ✓","[Â_H,B̂_H] = [Â,B̂]_H  ✓","Â_H(0) = Â_S  ✓"]],
      ["Heisenberg EOM", "dÂ_H/dt=(i/ℏ)[Ĥ,Â_H]+(∂Â/∂t)_H is the operator equation of motion; the classical analogue is df/dt={f,H}_PB+∂f/∂t via canonical Poisson brackets",
       ["For x̂: dx̂_H/dt = p̂_H/m  ✓","For p̂: dp̂_H/dt = −∂V/∂x̂_H  ✓","For Ĥ: dĤ/dt = ∂Ĥ/∂t (if no explicit time dep, dĤ/dt=0)"]],
      ["Ehrenfest theorem I", "d⟨x̂⟩/dt=⟨p̂⟩/m follows from the Heisenberg EOM for x̂; it is exact (not an approximation); it says the average position moves like a classical particle",
       ["Derived from [Ĥ,x̂]=(iℏ/m)p̂ for Ĥ=p̂²/2m+V  ✓","d⟨x̂⟩/dt = ⟨p̂_H⟩/m = ⟨p̂⟩/m  ✓","Classical limit: centroid of wavepacket follows Newton"]],
      ["Ehrenfest theorem II", "d⟨p̂⟩/dt=−⟨∇V(x̂)⟩ is exact; it becomes Newton's 2nd law when ⟨∇V(x̂)⟩≈∇V(⟨x̂⟩), i.e. for linear or quadratic V, or for narrow wavepackets",
       ["For harmonic oscillator (quadratic V): exact Newton's law  ✓","For anharmonic V: ⟨V'(x̂)⟩≠V'(⟨x̂⟩) — quantum corrections  ✓","Ehrenfest does NOT say 'quantum = classical'"]],
      ["Dirac quantisation rule", "{f,g}_PB→[f̂,ĝ]/(iℏ) is Dirac's postulate; it works for canonical variables and low-degree polynomials; fails globally (Groenewold–Van Hove theorem)",
       ["{x,p}_PB=1 → [x̂,p̂]=iℏ  ✓","{L_x,L_y}_PB=L_z → [L̂_x,L̂_y]=iℏL̂_z  ✓","Higher-degree polynomials require additional ordering prescription"]],
      ["Virial theorem", "2⟨T̂⟩=⟨x̂·∇V⟩ in energy eigenstates; derived from stationarity of d⟨x̂p̂⟩/dt=0 in a stationary state; gives ratio ⟨T⟩/⟨V⟩ without solving TISE",
       ["Coulomb V=-e²/r: ⟨T⟩=-½⟨V⟩=-E_n  ✓","Harmonic V=½mω²x²: ⟨T⟩=⟨V⟩=E/2  ✓","Virial ratio n: V∝rⁿ → 2⟨T⟩=n⟨V⟩"]],
    ],

    cqPointers: [
      "Physical predictions (expectation values) are invariant; states and operators merely redistribute time-dependence",
      "HO Heisenberg EOM: dx/dt=(i/ℏ)[Ĥ,x]=p/m; dp/dt=(i/ℏ)[Ĥ,p]=−mω²x → SHO equations",
      "False: |ψ_H⟩=|ψ(0)⟩ is time-independent by definition in the Heisenberg picture",
      "Ehrenfest reduces to Newton's 2nd when ⟨V'(x)⟩=V'(⟨x⟩); exact for harmonic/linear V",
      "Quantum constant of motion: [Ĥ,Â]=0 → dÂ_H/dt=0 → ⟨Â⟩ conserved",
      "False: Weyl ordering is one prescription; others (normal, antinormal) also exist; Groenewold–vH shows no global consistent choice",
      "Free particle: d²x̂_H/dt²=0 → x̂_H(t)=x̂+p̂t/m (linear in t, like classical free particle)",
      "Virial: ⟨T⟩/⟨V⟩ determined by potential power law; for Coulomb: -1/2; for HO: 1",
    ],

    tierTasks: {
      hs: ["'In one picture the states move; in the other the clocks move.' Draw a diagram showing this",
           "Give an analogy from classical mechanics where you can choose the 'frame' (active vs. passive)",
           "What stays the same in every picture of QM?"],
      begug: ["Transform x̂(t) and p̂(t) to Heisenberg picture for HO; verify they satisfy SHO equations",
              "Verify Ehrenfest's theorem for ⟨x̂⟩ and ⟨p̂⟩ numerically for a Gaussian wavepacket",
              "Show [Ĥ,p̂]=0 for V=constant and interpret physically"],
      advug: ["Derive the Heisenberg EOM by differentiating Â_H=Û†ÂÛ",
              "Prove the virial theorem from d⟨x̂p̂⟩/dt=0 in stationary states",
              "Solve HO Heisenberg equations and express x̂_H(t) in terms of â and â†"],
      msc: ["Connect Heisenberg EOM to classical Poisson brackets {f,H}",
            "Discuss Weyl ordering and its symmetry properties",
            "Derive the Moyal bracket as the quantum deformation of the Poisson bracket"],
      phd: ["Formulate QM in C*-algebra language: states as functionals, observables as algebra elements",
            "Discuss the Wigner function as the phase-space representation in the Heisenberg picture",
            "Prove the Groenewold–Van Hove theorem on the impossibility of consistent global quantisation"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L08": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Transform to the Interaction Picture",
        goal:"Split Ĥ=Ĥ₀+V̂ and rotate states and operators into the IP consistently",
        keyPoints:[
          "Split: Ĥ=Ĥ₀+V̂(t); Ĥ₀ exactly solvable with Û₀(t)=e^{-iĤ₀t/ℏ}",
          "IP state: |ψ_I(t)⟩=Û₀†(t)|ψ_S(t)⟩  — undoes Ĥ₀ evolution",
          "IP operator: V̂_I(t)=Û₀†(t)V̂Û₀(t)  — rotates into Heisenberg picture under Ĥ₀ only",
          "IP Schrödinger equation: iℏ∂_t|ψ_I⟩=V̂_I(t)|ψ_I⟩  — driven only by V̂",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Three pictures comparison
          const pics=[
            {name:"Schrödinger",st:"states move",op:"ops static",drv:"H=H₀+V drives",color:C.accent},
            {name:"Interaction",st:"states: V drives",op:"ops: H₀ drives",drv:"split nicely!",color:C.gold},
            {name:"Heisenberg",st:"states static",op:"ops: H drives",drv:"full H drives ops",color:C.teal},
          ];
          for(let i=0;i<pics.length;i++){
            const bx=ox+i*1.3;
            box(s,pres,bx,oy,1.22,0.28,pics[i].color+"22",pics[i].color,2);
            txt(s,bx,oy,1.22,0.28,pics[i].name,pics[i].color,8,FONT_HEAD,true,"center");
            box(s,pres,bx,oy+0.32,1.22,0.26,"0D1A2A",pics[i].color,0.8);
            txt(s,bx,oy+0.32,1.22,0.26,pics[i].st,C.offwhite,7.5,FONT_BODY,false,"center");
            box(s,pres,bx,oy+0.62,1.22,0.26,"0D1A2A",pics[i].color,0.8);
            txt(s,bx,oy+0.62,1.22,0.26,pics[i].op,C.offwhite,7.5,FONT_BODY,false,"center");
            box(s,pres,bx,oy+0.92,1.22,0.26,i===1?"1A1A0D":"0D1A2A",i===1?C.gold:C.muted,i===1?1.5:0.5);
            txt(s,bx,oy+0.92,1.22,0.26,pics[i].drv,i===1?C.gold:C.muted,7.5,FONT_BODY,i===1,"center");
          }
          // Key IP equations below
          const ry=oy+1.28;
          box(s,pres,ox,ry,3.88,0.28,"0D1A2A",C.gold);
          txt(s,ox,ry,3.88,0.28,"|ψ_I⟩ = Û₀†|ψ_S⟩;  V̂_I = Û₀†V̂Û₀",C.gold,8.5,FONT_MONO,true,"center");
          box(s,pres,ox,ry+0.32,3.88,0.28,"0D1A2A",C.teal);
          txt(s,ox,ry+0.32,3.88,0.28,"iℏ∂_t|ψ_I⟩ = V̂_I(t)|ψ_I⟩",C.teal,8.5,FONT_MONO,true,"center");
        },
        diagLabel:"Interaction picture: states driven by V̂ only; operators rotate under Ĥ₀",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Derive the IP Schrödinger Equation",
        goal:"Show the IP equation of motion follows from the full TDSE by unitary rotation",
        keyPoints:[
          "Differentiate |ψ_I⟩=Û₀†|ψ_S⟩; use TDSE for |ψ_S⟩ and dÛ₀†/dt=+(iĤ₀/ℏ)Û₀†",
          "Result: iℏ∂_t|ψ_I⟩ = Û₀†(Ĥ−Ĥ₀)|ψ_S⟩ = Û₀†V̂Û₀|ψ_I⟩ = V̂_I(t)|ψ_I⟩",
          "The free Ĥ₀ part cancels exactly — the IP removes the 'trivial' dynamics",
          "Physical: in the IP, the state is already in the 'rotating frame' of Ĥ₀",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const steps=[
            {t:"iℏ∂_t|ψ_S⟩ = (Ĥ₀+V̂)|ψ_S⟩  (full TDSE)",c:C.accent},
            {t:"|ψ_I⟩ = Û₀†|ψ_S⟩  (define IP state)",c:C.teal},
            {t:"iℏ∂_t|ψ_I⟩ = iℏ(dÛ₀†/dt)|ψ_S⟩ + iℏÛ₀†∂_t|ψ_S⟩",c:C.offwhite},
            {t:"= (iℏ)(iĤ₀/ℏ)Û₀†|ψ_S⟩ + Û₀†(Ĥ₀+V̂)|ψ_S⟩",c:C.offwhite},
            {t:"= (−Ĥ₀+Ĥ₀+V̂_I)|ψ_I⟩ = V̂_I|ψ_I⟩  ✓",c:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            const isLast=i===steps.length-1;
            box(s,pres,ox,y,3.8,0.36,isLast?"201700":"0D1A2A",steps[i].c,isLast?2:1.2);
            txt(s,ox+0.08,y,3.64,0.36,steps[i].t,steps[i].c,7.5,FONT_MONO,isLast,"center");
            if(!isLast) vline(s,pres,ox+1.9,y+0.36,y+0.5,C.muted);
            y+=0.5;
          }
        },
        diagLabel:"Ĥ₀ terms cancel exactly — IP Schrödinger equation driven by V̂_I only",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Construct the Dyson Series in the IP",
        goal:"Expand the IP propagator as a perturbative series in V̂_I",
        keyPoints:[
          "IP propagator Û_I(t,0): iℏ∂_tÛ_I=V̂_I(t)Û_I; Û_I(0,0)=Î",
          "Dyson series: Û_I = Î + (−i/ℏ)∫V̂_I dt' + (−i/ℏ)²∫∫T[V̂_IV̂_I]dt'dt'' + ...",
          "Transition amplitude: c_f^{(n)}(t) = ⟨f|Û_I^{(n)}(t,0)|i⟩  — nth order in V̂",
          "S-matrix: Ŝ = Û_I(∞,−∞) — full probability amplitude from t=−∞ to +∞",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const rows=[
            {order:"0th",term:"Î",phys:"no interaction",color:C.muted},
            {order:"1st",term:"−(i/ℏ)∫V̂_I dt'",phys:"single scattering event",color:C.accent},
            {order:"2nd",term:"(−i/ℏ)²∫∫T[V̂_IV̂_I]",phys:"two scattering events",color:C.teal},
            {order:"nth",term:"(−i/ℏ)ⁿ ∫...∫ T[V̂_Iⁿ]",phys:"n-fold interaction",color:C.mscCol},
          ];
          box(s,pres,ox,oy,3.8,0.28,"0D1B2E",C.accent);
          txt(s,ox,oy,1.0,0.28,"Order",C.white,8,FONT_HEAD,true,"center");
          txt(s,ox+1.0,oy,1.8,0.28,"IP Dyson Term",C.white,8,FONT_HEAD,true,"center");
          txt(s,ox+2.8,oy,1.0,0.28,"Physical meaning",C.white,8,FONT_HEAD,true,"center");
          for(let i=0;i<rows.length;i++){
            const ry=oy+0.28+i*0.4, r=rows[i];
            const bg=i%2===0?"0D1420":"0D1820";
            box(s,pres,ox,ry,3.8,0.38,bg,r.color,0.5);
            txt(s,ox,ry,1.0,0.38,r.order,r.color,8,FONT_MONO,true,"center");
            txt(s,ox+1.0,ry,1.8,0.38,r.term,C.offwhite,7.5,FONT_MONO,false,"center");
            txt(s,ox+2.8,ry,1.0,0.38,r.phys,C.muted,7,FONT_BODY,false,"center",true);
          }
        },
        diagLabel:"Dyson series: each order = one more power of V̂_I and one more time integration",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Connect the S-Matrix to Scattering Amplitudes",
        goal:"Identify Ŝ=Û_I(∞,−∞) and relate its matrix elements to measurable cross-sections",
        keyPoints:[
          "S-matrix: Ŝ = Û_I(∞,−∞) = T exp(−i/ℏ ∫_{-∞}^{∞}V̂_I dt)",
          "Transition amplitude: ⟨f|Ŝ|i⟩ = probability amplitude for scattering i→f",
          "Unitarity: Ŝ†Ŝ = Î (probability conservation); optical theorem follows",
          "Cross section: dσ/dΩ ∝ |⟨f|Ŝ|i⟩|² — the Born approximation is first order",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // S-matrix: in-state → interaction region → out-state
          box(s,pres,ox,oy+0.3,0.9,1.2,"0D1A2A",C.accent);
          txt(s,ox,oy+0.1,0.9,0.2,"|i⟩",C.accent,9,FONT_MONO,true,"center");
          txt(s,ox,oy+0.3,0.9,1.2,"in-\nstate\nt→-∞",C.accent,7.5,FONT_BODY,false,"center");
          hline(s,pres,ox+0.9,oy+0.9,ox+1.5,C.gold);
          // Interaction blob
          oval(s,pres,ox+1.9,oy+0.9,0.42,0.42,"1A1A0D",C.gold);
          txt(s,ox+1.52,oy+0.72,0.76,0.36,"V̂_I\n(inter-\naction)",C.gold,7,FONT_BODY,true,"center");
          hline(s,pres,ox+2.32,oy+0.9,ox+2.9,C.gold);
          box(s,pres,ox+2.9,oy+0.3,0.9,1.2,"0D1A2A",C.teal);
          txt(s,ox+2.9,oy+0.1,0.9,0.2,"|f⟩",C.teal,9,FONT_MONO,true,"center");
          txt(s,ox+2.9,oy+0.3,0.9,1.2,"out-\nstate\nt→+∞",C.teal,7.5,FONT_BODY,false,"center");
          // S-matrix box below
          box(s,pres,ox,oy+1.66,3.8,0.3,"0D1A2A",C.gold);
          txt(s,ox,oy+1.66,3.8,0.3,"Ŝ = Û_I(+∞,−∞);  ⟨f|Ŝ|i⟩ = amplitude",C.gold,8.5,FONT_MONO,true,"center");
          box(s,pres,ox,oy+2.02,3.8,0.28,"0D1E1D",C.teal);
          txt(s,ox,oy+2.02,3.8,0.28,"dσ/dΩ ∝ |⟨f|Ŝ|i⟩|²  (measurable cross-section)",C.teal,8,FONT_MONO,false,"center");
        },
        diagLabel:"S-matrix encodes all scattering information: in→interaction→out",
      },
    ],

    formulaAnswers: [
      ["IP state", "|ψ_I(t)⟩=Û₀†(t)|ψ_S(t)⟩ removes the trivial Ĥ₀ evolution; in the IP the state evolves only under the perturbation V̂_I; convenient for perturbative calculations",
       ["At t=0: |ψ_I(0)⟩=|ψ_S(0)⟩=|i⟩  ✓","Norm preserved: ⟨ψ_I|ψ_I⟩=1  ✓","Reduces to Schrödinger picture when V̂=0"]],
      ["IP operator", "V̂_I(t)=Û₀†(t)V̂Û₀(t) is the perturbation in the Heisenberg picture of Ĥ₀; it oscillates at transition frequencies; key for identifying resonances",
       ["For V̂=const: V̂_I(t)=Û₀†V̂Û₀ oscillates  ✓","[Ĥ₀,V̂_I]=(i/ℏ)Û₀†[Ĥ₀,V̂]Û₀  ✓","Matrix element: ⟨m|V̂_I|n⟩=⟨m|V̂|n⟩e^{iω_{mn}t}"]],
      ["IP Schrödinger equation", "iℏ∂_t|ψ_I⟩=V̂_I(t)|ψ_I⟩ has Ĥ₀ completely removed; only V̂_I drives the evolution; the exact solution is the Dyson series in V̂_I",
       ["Exactly equivalent to full TDSE  ✓","Without V̂: |ψ_I⟩ static (no evolution)  ✓","Small V̂: perturbative expansion makes sense"]],
      ["IP propagator", "Û_I(t,0)=T exp(−i/ℏ∫V̂_I dt') solves the IP equation; it contains all orders of perturbation theory; truncating at nth order gives the nth Dyson approximation",
       ["Û_I(0,0)=Î  ✓","Û_I†Û_I=Î (unitary)  ✓","⟨f|Û_I^{(1)}|i⟩=first-order amplitude  ✓"]],
      ["S-matrix definition", "Ŝ=Û_I(+∞,−∞) is the full propagator from the remote past to the remote future; its matrix elements are transition amplitudes between asymptotic states",
       ["Ŝ†Ŝ=Î (unitarity = probability conservation)  ✓","⟨f|Ŝ|i⟩=1 for f=i (no scattering) at zeroth order  ✓","First Born approx: ⟨f|Ŝ|i⟩≈⟨f|Î+Û^{(1)}|i⟩"]],
      ["Transition amplitude", "⟨f|Ŝ|i⟩ is the probability amplitude for starting in |i⟩ and ending in |f⟩; |⟨f|Ŝ|i⟩|² gives the transition probability; cross-sections follow from Fermi's golden rule",
       ["P_{i→f}=|⟨f|Ŝ|i⟩|²  ✓","Optical theorem: Im⟨i|Ŝ|i⟩=(1/2)Σ_f|⟨f|Ŝ|i⟩|²  ✓","Born approx: ⟨f|Û^{(1)}|i⟩=−(i/ℏ)∫⟨f|V̂|i⟩e^{iω_{fi}t}dt"]],
    ],

    cqPointers: [
      "IP splits Ĥ₀ (exactly solved) from V̂ (treated perturbatively); makes V̂ the only driver of state evolution",
      "True: states |ψ_I⟩ and operators V̂_I(t)=Û₀†V̂Û₀ both carry time-dependence in the IP",
      "IP Schrödinger equation: iℏ∂_t|ψ_I⟩=V̂_I|ψ_I⟩; full TDSE has (Ĥ₀+V̂) driving states",
      "S-matrix encodes all scattering: input state → interaction → output state; cross-sections come from |⟨f|Ŝ|i⟩|²",
      "True: Ŝ†Ŝ=Î iff probability is conserved; optical theorem is a consequence",
      "Schrödinger: states move, ops static; Heisenberg: ops move, states static; IP: both move under their respective parts of Ĥ",
      "First-order Dyson: ⟨f|Û_I^{(1)}|i⟩=−(i/ℏ)∫⟨f|V̂_I(t')|i⟩dt'=−(i/ℏ)∫⟨f|V̂|i⟩e^{iω_{fi}t'}dt'",
      "Cross section: dσ/dΩ∝|T-matrix|²; T-matrix extracted from Ŝ=Î+iT; optical theorem relates Im(T_{ii}) to total cross-section",
    ],

    tierTasks: {
      hs: ["'Park the easy part in the operators; let the hard part drive the states.' Draw a diagram",
           "What is a scattering cross-section physically? Give an everyday analogy",
           "Why would a physicist want to split Ĥ=Ĥ₀+V̂?"],
      begug: ["Transform V̂=λx̂ into the IP for Ĥ₀=p̂²/2m",
              "Compute the first-order Dyson term for V̂(t)=V₀e^{-iωt}|f⟩⟨i|+h.c.",
              "Show that Û_I reduces to Î when V̂=0"],
      advug: ["Derive the IP equation of motion by differentiating |ψ_I⟩=Û₀†|ψ_S⟩",
              "Write the Dyson series to second order and identify the integration regions",
              "Prove all three pictures give identical expectation values"],
      msc: ["Derive the optical theorem from unitarity of the S-matrix",
            "Connect the Born approximation to the Lippmann–Schwinger equation",
            "Sketch how Feynman diagrams emerge from the Dyson series in QFT"],
      phd: ["Discuss adiabatic switching and its role in the Gell-Mann–Low theorem",
            "Define the S-matrix in QFT; relate to the IP propagator via the LSZ reduction formula",
            "Analyse conditions under which the Dyson series converges in a quantum optical context"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L09": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Derive First- and Second-Order Energy Corrections",
        goal:"Apply RSPT systematically: match powers of λ in the perturbed TISE",
        keyPoints:[
          "Ansatz: Eₙ=Eₙ^{(0)}+λEₙ^{(1)}+λ²Eₙ^{(2)}+...; |n⟩=|n⁰⟩+λ|n^{(1)}⟩+...",
          "First order [λ¹]: E_n^{(1)} = ⟨n⁰|V̂|n⁰⟩  — expectation value of V̂ in unperturbed state",
          "First-order state: |n^{(1)}⟩ = Σ_{m≠n} ⟨m⁰|V̂|n⁰⟩/(Eₙ⁰−Eₘ⁰) |m⁰⟩",
          "Second order [λ²]: Eₙ^{(2)} = Σ_{m≠n} |⟨m⁰|V̂|n⁰⟩|²/(Eₙ⁰−Eₘ⁰) — always negative for ground state",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Power-matching diagram
          box(s,pres,ox,oy,3.8,0.28,"0D1B2E",C.accent);
          txt(s,ox,oy,3.8,0.28,"(Ĥ₀+λV̂)(|n⁰⟩+λ|n¹⟩+...) = (Eₙ⁰+λEₙ¹+...)(|n⁰⟩+...)",C.white,7.5,FONT_MONO,false,"center");
          const orders=[
            {ord:"λ⁰:",eq:"Ĥ₀|n⁰⟩ = Eₙ⁰|n⁰⟩",result:"unperturbed TISE",color:C.muted},
            {ord:"λ¹:",eq:"Ĥ₀|n¹⟩ + V̂|n⁰⟩ = Eₙ⁰|n¹⟩ + Eₙ¹|n⁰⟩",result:"→ Eₙ¹=⟨n⁰|V̂|n⁰⟩",color:C.accent},
            {ord:"λ²:",eq:"Ĥ₀|n²⟩ + V̂|n¹⟩ = Eₙ⁰|n²⟩ + Eₙ¹|n¹⟩ + Eₙ²|n⁰⟩",result:"→ Eₙ²=Σ|Vmn|²/ΔE",color:C.teal},
          ];
          for(let i=0;i<orders.length;i++){
            const ry=oy+0.34+i*0.66;
            box(s,pres,ox,ry,0.5,0.6,"0D1A2A",orders[i].color,2);
            txt(s,ox,ry,0.5,0.6,orders[i].ord,orders[i].color,9,FONT_MONO,true,"center");
            box(s,pres,ox+0.54,ry,2.32,0.3,"0D1A2A",C.muted,0.8);
            txt(s,ox+0.56,ry,2.28,0.3,orders[i].eq,C.offwhite,7,FONT_MONO,false,"center");
            box(s,pres,ox+0.54,ry+0.3,2.32,0.28,orders[i].color+"22",orders[i].color,0.8);
            txt(s,ox+0.56,ry+0.3,2.28,0.28,orders[i].result,orders[i].color,8,FONT_MONO,true,"center");
          }
        },
        diagLabel:"Order-by-order matching: each power of λ gives one correction equation",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Compute First-Order State Corrections",
        goal:"Find |n^{(1)}⟩ by expanding in the unperturbed basis and projecting",
        keyPoints:[
          "Project first-order equation onto ⟨m⁰| (m≠n): ⟨m⁰|V̂|n⁰⟩=(Eₙ⁰−Eₘ⁰)⟨m⁰|n^{(1)}⟩",
          "State correction: |n^{(1)}⟩ = Σ_{m≠n} ⟨m⁰|V̂|n⁰⟩/(Eₙ⁰−Eₘ⁰) |m⁰⟩",
          "Diverges when Eₙ⁰≈Eₘ⁰ — degenerate perturbation theory needed",
          "Physical: V̂ mixes unperturbed states; mixing amplitude ∝ V̂-matrix-element/energy gap",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Energy level diagram with mixing arrows
          const levels=[
            {E:"E₃⁰",color:C.mscCol,y:oy+0.1},
            {E:"E₂⁰",color:C.teal,y:oy+0.7},
            {E:"Eₙ⁰",color:C.accent,y:oy+1.3,target:true},
            {E:"E₁⁰",color:C.begCol,y:oy+1.9},
          ];
          for(const lv of levels){
            hline(s,pres,ox+0.1,lv.y+0.14,ox+1.4,lv.color);
            txt(s,ox,lv.y,0.6,0.28,lv.E,lv.color,8,FONT_MONO,lv.target,lv.target?"left":"left");
            if(lv.target){
              box(s,pres,ox,lv.y,1.4,0.28,C.accent+"30",C.accent,1.5);
            }
          }
          // Mixing arrows from target level
          const targetY=oy+1.44;
          for(let i=0;i<levels.length;i++){
            if(levels[i].target) continue;
            const fromY=levels[i].y+0.14;
            s.addShape(pres.shapes.LINE,{x:ox+1.5,y:fromY,w:0,h:targetY-fromY,line:{color:levels[i].color,width:1.2,dashType:"dash"}});
            txt(s,ox+1.56,Math.min(fromY,targetY),1.6,Math.abs(targetY-fromY),"⟨m|V̂|n⟩/(Eₙ-Eₘ)",levels[i].color,7,FONT_MONO,false,"left",true);
          }
          box(s,pres,ox,oy+2.28,3.8,0.3,"0D1A2A",C.teal);
          txt(s,ox,oy+2.28,3.8,0.3,"|n¹⟩ = Σ_{m≠n} V_mn/(E_n-E_m) |m⁰⟩",C.teal,8.5,FONT_MONO,true,"center");
        },
        diagLabel:"First-order state: V̂ mixes |n⁰⟩ with all other levels; amplitude ∝ V/ΔE",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Handle Degenerate Perturbation Theory",
        goal:"Diagonalise V̂ in the degenerate subspace to find correct zeroth-order states",
        keyPoints:[
          "Problem: |n^{(1)}⟩ diverges when Eₙ⁰=Eₘ⁰; the 'good' basis must be found first",
          "Step 1: Identify the degenerate subspace D={|n⟩: Ĥ₀|n⟩=E⁰|n⟩}",
          "Step 2: Compute V̂ restricted to D; diagonalise → find correct zeroth-order states |ñ⁰⟩",
          "Step 3: Apply non-degenerate RSPT to {|ñ⁰⟩} — no divergence now",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Before/after degeneracy splitting
          txt(s,ox,oy,3.8,0.22,"Perturbation splits degenerate levels",C.begCol,8.5,FONT_HEAD,true,"center");
          // Before: two coincident levels
          txt(s,ox+0.3,oy+0.3,0.8,0.2,"Before",C.muted,7.5,FONT_BODY,false,"center",true);
          hline(s,pres,ox+0.1,oy+0.56,ox+1.1,C.phdCol);
          hline(s,pres,ox+0.1,oy+0.62,ox+1.1,C.phdCol);
          txt(s,ox+0.1,oy+0.65,1.0,0.2,"E⁰ (2-fold degenerate)",C.phdCol,7,FONT_BODY,false,"center",true);
          // Arrow
          hline(s,pres,ox+1.2,oy+0.6,ox+1.8,C.gold);
          txt(s,ox+1.2,oy+0.44,0.6,0.2,"+ V̂",C.gold,8,FONT_MONO,true,"center");
          // After: two split levels
          txt(s,ox+1.9,oy+0.3,0.8,0.2,"After",C.muted,7.5,FONT_BODY,false,"center",true);
          hline(s,pres,ox+1.9,oy+0.44,ox+3.7,C.teal);
          hline(s,pres,ox+1.9,oy+0.78,ox+3.7,C.accent);
          txt(s,ox+1.92,oy+0.3,1.76,0.16,"E₊=E⁰+E^{(1)}_+",C.teal,7,FONT_MONO,false,"center",true);
          txt(s,ox+1.92,oy+0.82,1.76,0.16,"E₋=E⁰+E^{(1)}_-",C.accent,7,FONT_MONO,false,"center",true);
          // Secular equation box
          box(s,pres,ox,oy+1.08,3.8,0.32,"0D1A2A",C.begCol);
          txt(s,ox,oy+1.08,3.8,0.32,"Secular equation: det(V̂_D − E^(1)Î) = 0",C.begCol,8.5,FONT_MONO,true,"center");
          box(s,pres,ox,oy+1.46,3.8,0.28,"0D1E1D",C.teal);
          txt(s,ox,oy+1.46,3.8,0.28,"Eigenstates of V̂_D are the 'good' zeroth-order states",C.teal,8,FONT_BODY,false,"center",true);
        },
        diagLabel:"Degenerate PT: diagonalise V̂ in the subspace first, then apply RSPT",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Apply Feynman–Hellmann and Ritz Variational Principle",
        goal:"Use Feynman–Hellmann for energy derivatives; Ritz for upper bounds on ground state energy",
        keyPoints:[
          "Feynman–Hellmann: ∂Eₙ/∂λ = ⟨n|∂Ĥ/∂λ|n⟩  — exact for any parameter λ",
          "Application: ∂E_HO/∂ω = ⟨T̂⟩+⟨V̂⟩... use this to extract ⟨T̂⟩ and ⟨V̂⟩ separately",
          "Ritz variational principle: E₀ ≤ ⟨φ|Ĥ|φ⟩/⟨φ|φ⟩ for any trial state |φ⟩",
          "Strategy: choose |φ(α)⟩ with parameter α; minimise ⟨Ĥ⟩_α over α",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Variational funnel diagram
          txt(s,ox,oy,3.8,0.22,"Ritz variational method",C.mscCol,8.5,FONT_HEAD,true,"center");
          // Trial states at top
          const trials=["φ₁(α)","φ₂(β)","φ₃(γ)"];
          for(let i=0;i<trials.length;i++){
            box(s,pres,ox+i*1.28,oy+0.28,1.22,0.34,C.mscCol+"25",C.mscCol,1.2);
            txt(s,ox+i*1.28,oy+0.28,1.22,0.34,trials[i],C.mscCol,9,FONT_MONO,false,"center");
            // Arrow down to energy evaluation
            vline(s,pres,ox+i*1.28+0.61,oy+0.62,oy+0.86,C.muted);
          }
          box(s,pres,ox,oy+0.86,3.8,0.36,"0D1A2A",C.accent);
          txt(s,ox,oy+0.86,3.8,0.36,"compute ⟨φ(α)|Ĥ|φ(α)⟩  for each",C.accent,8.5,FONT_MONO,false,"center");
          vline(s,pres,ox+1.9,oy+1.22,oy+1.46,C.muted);
          txt(s,ox+1.96,oy+1.28,1.5,0.18,"minimise over α",C.muted,7.5,FONT_BODY,false,"left",true);
          box(s,pres,ox+0.5,oy+1.46,2.8,0.36,"1A0D2A",C.gold,2);
          txt(s,ox+0.5,oy+1.46,2.8,0.36,"E_var ≥ E₀  (Ritz bound)",C.gold,9.5,FONT_MONO,true,"center");
          box(s,pres,ox,oy+1.9,3.8,0.28,"0D1A2A",C.teal);
          txt(s,ox,oy+1.9,3.8,0.28,"F-H: ∂Eₙ/∂λ = ⟨n|∂Ĥ/∂λ|n⟩ (exact)",C.teal,8.5,FONT_MONO,true,"center");
        },
        diagLabel:"Variational method: minimize ⟨Ĥ⟩ over trial states → upper bound on E₀",
      },
    ],

    formulaAnswers: [
      ["Perturbation splitting", "Ĥ=Ĥ₀+λV̂ splits into exactly-solved Ĥ₀ and small perturbation λV̂; λ is a formal bookkeeping parameter (often set to 1 at the end); convergence requires |λV̂|≪|ΔE|",
       ["λ=0: recover unperturbed solutions  ✓","λ=1: physical perturbation fully switched on  ✓","Convergence: max|V_mn/ΔE|≪1 required"]],
      ["First-order energy correction", "E_n^{(1)}=⟨n⁰|V̂|n⁰⟩ is simply the expectation value of the perturbation; physically it is the shift in energy due to the average effect of V̂ in the unperturbed state",
       ["Can be zero by symmetry (parity selection rule)  ✓","For H-atom ground state in E-field: linear Stark effect = 0 by parity  ✓","For n=2 degenerate states: use degenerate PT"]],
      ["First-order state correction", "|n^{(1)}⟩=Σ_{m≠n}V_mn/(E_n-E_m)|m⁰⟩ mixes in excited states; denominator (energy gap) suppresses mixing; diverges for degenerate levels",
       ["Mixing amplitude ∝ V_mn/ΔE  ✓","Normalisation: ⟨n⁰|n^{(1)}⟩=0 by convention  ✓","Second-order energy uses |n^{(1)}⟩: E^{(2)}=⟨n⁰|V̂|n^{(1)}⟩"]],
      ["Second-order energy correction", "E_n^{(2)}=Σ_{m≠n}|V_mn|²/(E_n-E_m); always negative for the ground state (all denominators E₀-E_m<0); physically it is the stabilisation from level repulsion",
       ["For ground state: E_0^{(2)}<0 always  ✓","Diverges near degeneracy: need degenerate PT  ✓","E_n^{(2)}=⟨n⁰|V̂|n^{(1)}⟩  ✓"]],
      ["Feynman–Hellmann theorem", "∂Eₙ/∂λ=⟨n|∂Ĥ/∂λ|n⟩ is exact for any parameter λ; it allows extraction of expectation values without integrating wavefunctions directly",
       ["For HO: ∂E/∂ω → extract ⟨T⟩ and ⟨V⟩  ✓","For H-atom: ∂E/∂Z → extract ⟨1/r⟩  ✓","Proof: differentiate ⟨n|Ĥ|n⟩=Eₙ and use ⟨n|n⟩=1"]],
      ["Ritz variational principle", "E₀≤⟨φ|Ĥ|φ⟩/⟨φ|φ⟩ for any normalised |φ⟩; equality iff |φ⟩=|E₀⟩; follows from expanding |φ⟩ in eigenstates and using Eₙ≥E₀",
       ["Better trial state → tighter bound  ✓","Gaussian trial for H-atom: E≥−13.6 eV  ✓","Applies only to ground state energy (not excited)"]],
    ],

    cqPointers: [
      "λ must be small vs. energy gap: max_{m≠n}|⟨m|V̂|n⟩|/|Eₙ-Eₘ|≪1",
      "False: E^{(1)}=⟨n|V̂|n⟩ can be zero by symmetry; e.g. H-atom ground state in E-field (odd parity of r·E)",
      "Degenerate PT needed when Eₙ=Eₘ for m≠n; non-degenerate formula diverges; must diagonalise V̂ in the subspace",
      "F-H: ∂Eₙ/∂λ=⟨n|∂Ĥ/∂λ|n⟩; e.g. for HO ∂E/∂ω=nℏ → extract ⟨T⟩ via ω-derivative",
      "True: Ritz bound E₀≤⟨φ|Ĥ|φ⟩; equality iff |φ⟩ is exact ground state; always an overestimate",
      "Near degeneracy: denominator E_n-E_m→0; perturbative expansion breaks down; degenerate PT required",
      "Secular equation: det(V̂_D - E^{(1)}Î)=0 where V̂_D is V̂ restricted to degenerate subspace",
      "Born–Oppenheimer: electrons move on adiabatic potential surface; valid when nuclear motion slow vs. electronic frequencies → adiabatic theorem guarantees no excitation",
    ],

    tierTasks: {
      hs: ["'A small push changes energy levels slightly.' Give a physical example from atomic physics",
           "Describe what the linear Stark effect and quadratic Stark effect mean qualitatively",
           "What is an energy level diagram and how does a perturbation shift the levels?"],
      begug: ["Compute E^{(1)} for a particle in a box with perturbation V̂=V₀sin(πx/L)",
              "Apply the linear Stark effect for hydrogen n=2 by diagonalising V̂ in the 4-fold degenerate subspace",
              "Use the Ritz variational method with a Gaussian trial function for the hydrogen ground state"],
      advug: ["Derive the second-order energy formula E^{(2)}=Σ_{m≠n}|V_mn|²/ΔE_mn from the first-order state",
              "Prove that E₀^{(2)}≤0 for the ground state",
              "Apply degenerate PT to H-atom n=2; identify the correct zeroth-order states"],
      msc: ["State the Kato–Rellich theorem for the stability of self-adjointness under perturbation",
            "Derive the Born–Oppenheimer approximation using the adiabatic theorem",
            "Discuss the Brillouin–Wigner perturbation theory and its relationship to RSPT"],
      phd: ["Define the resolvent R_z=(Ĥ-z)⁻¹ and use it to derive perturbation theory for the spectrum",
            "Discuss the divergence of the perturbation series for anharmonic oscillator (Dyson's argument)",
            "Introduce Borel resummation as a method to extract physical predictions from divergent PT"],
    },
  },

  // ══════════════════════════════════════════════════════════════════════════
  "L10": {
    loData: [
      {
        n:1, color:C.accent, tagBg:C.accent,
        title:"Derive Fermi's Golden Rule",
        goal:"Obtain Γ_{i→f}=(2π/ℏ)|V_{fi}|²ρ(E_f) from first-order TDPT",
        keyPoints:[
          "First-order amplitude: c_f^{(1)}(t)=−(i/ℏ)∫₀ᵗe^{iω_{fi}t'}V_{fi}dt'",
          "For constant V̂: |c_f^{(1)}|² = (4|V_{fi}|²/ℏ²)sin²(ω_{fi}t/2)/ω_{fi}²",
          "Long-time limit: sin²(ωt/2)/ω² → πt/2 δ(ω); transition rate Γ=d|c|²/dt is constant",
          "Fermi's golden rule: Γ_{i→f}=(2π/ℏ)|⟨f|V̂|i⟩|²ρ(E_f)  — rate to continuum of states",
        ],
        drawDiag: (s, pres, ox, oy) => {
          const steps=[
            {t:"c_f^(1)(t) = −(i/ℏ)∫V_fi e^{iω_{fi}t'} dt'",c:C.accent},
            {t:"|c_f|² = (4|V_fi|²/ℏ²) sin²(ω_fi t/2)/ω_fi²",c:C.teal},
            {t:"t→∞: sin²(xt)/x² → πt δ(x)  (distributional limit)",c:C.offwhite},
            {t:"Γ = d|c_f|²/dt = (2π/ℏ)|V_fi|² δ(E_f−E_i)",c:C.mscCol},
            {t:"Sum over final states: Γ = (2π/ℏ)|V_fi|² ρ(E_f)",c:C.gold},
          ];
          let y=oy;
          for(let i=0;i<steps.length;i++){
            const isLast=i===steps.length-1;
            box(s,pres,ox,y,3.8,0.36,isLast?"201700":"0D1A2A",steps[i].c,isLast?2:1.2);
            txt(s,ox+0.08,y,3.64,0.36,steps[i].t,steps[i].c,7.5,FONT_MONO,isLast,"center");
            if(!isLast) vline(s,pres,ox+1.9,y+0.36,y+0.5,C.muted);
            y+=0.5;
          }
        },
        diagLabel:"From first-order amplitude to rate: distributional limit of sinc² → delta function",
      },
      {
        n:2, color:C.teal, tagBg:C.teal,
        title:"Write the Lindblad Master Equation",
        goal:"Identify each term physically: unitary evolution + quantum jumps + anti-commutator",
        keyPoints:[
          "Lindblad form: dρ̂/dt = −(i/ℏ)[Ĥ,ρ̂] + Σ_k(L̂_k ρ̂ L̂_k† − ½{L̂_k†L̂_k, ρ̂})",
          "First term: −(i/ℏ)[Ĥ,ρ̂]  — coherent unitary evolution (Liouville–von Neumann)",
          "Jump term L̂_k ρ̂ L̂_k†: quantum jump from state k; reduces coherences if L̂_k non-Hermitian",
          "Anti-commutator −½{L̂_k†L̂_k,ρ̂}: norm-preserving term (cancels jump gain elsewhere)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Anatomy of Lindblad equation
          box(s,pres,ox,oy,3.8,0.3,"0D1B2E",C.teal,2);
          txt(s,ox,oy,3.8,0.3,"dρ̂/dt = (coherent) + (dissipative)",C.teal,9,FONT_HEAD,true,"center");
          const terms=[
            {t:"−(i/ℏ)[Ĥ,ρ̂]",phys:"Unitary evolution\n(reversible)",color:C.accent},
            {t:"Σ_k L̂_k ρ̂ L̂_k†",phys:"Quantum jumps\n(incoherent gain)",color:C.begCol},
            {t:"−½{L̂_k†L̂_k, ρ̂}",phys:"Anti-commutator\n(norm restoration)",color:C.phdCol},
          ];
          for(let i=0;i<terms.length;i++){
            const bx=ox+(i%2)*1.92, ry=oy+0.36+Math.floor(i/2===0&&i<2?i:1)*0.86;
            const by=oy+0.36+i*0.76;
            box(s,pres,ox+i*0,by,3.8,0.68,terms[i].color+"20",terms[i].color,1.5);
            txt(s,ox+0.1,by+0.06,3.6,0.3,terms[i].t,terms[i].color,10,FONT_MONO,true,"center");
            txt(s,ox+0.1,by+0.38,3.6,0.26,terms[i].phys,C.muted,7.5,FONT_BODY,false,"center",true);
          }
          box(s,pres,ox,oy+0.36+3*0.76+0.04,3.8,0.28,"0D1E1D",C.teal);
          txt(s,ox,oy+0.36+3*0.76+0.04,3.8,0.28,"Trace-preserving: Tr(dρ̂/dt)=0 ✓",C.teal,8.5,FONT_MONO,true,"center");
        },
        diagLabel:"Lindblad equation: three terms — coherent, jump gain, anti-commutator",
      },
      {
        n:3, color:C.begCol, tagBg:"106038",
        title:"Explain Decoherence and Pointer States",
        goal:"Show how the environment selects pointer states by suppressing off-diagonal ρ̂ elements",
        keyPoints:[
          "Decoherence: environment interaction rapidly suppresses off-diagonal ρ̂ elements",
          "Off-diagonal element: ρ_{01}(t)→0 at rate Γ_φ (dephasing rate) — exponential decay",
          "Pointer basis: eigenstates of the system–environment interaction Hamiltonian H_SE",
          "Pointer states are 'classical': they are not destroyed by environmental monitoring",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Density matrix before/after decoherence
          txt(s,ox,oy,3.8,0.22,"Decoherence: density matrix evolution",C.begCol,8.5,FONT_HEAD,true,"center");
          // Before
          const bx=ox+0.1, bw=1.5;
          txt(s,bx,oy+0.28,bw,0.2,"Before",C.muted,7.5,FONT_BODY,false,"center",true);
          const matB=[[C.accent,"ρ₀₀",C.teal,"ρ₀₁"],[C.teal,"ρ₁₀",C.accent,"ρ₁₁"]];
          for(let r=0;r<2;r++) for(let c2=0;c2<2;c2++){
            const col = matB[r][c2===0?0:2];
            const lab = matB[r][c2===0?1:3];
            const isOff=r!==c2;
            box(s,pres,bx+c2*0.72,oy+0.5+r*0.48,0.68,0.44,isOff?C.teal+"30":"0D1A2A",isOff?C.teal:C.accent,isOff?2:1);
            txt(s,bx+c2*0.72,oy+0.5+r*0.48,0.68,0.44,lab,isOff?C.teal:C.accent,9,FONT_MONO,true,"center");
          }
          // Arrow
          hline(s,pres,ox+1.72,oy+0.76,ox+2.12,C.gold);
          txt(s,ox+1.72,oy+0.6,0.4,0.16,"t≫τ_dec",C.gold,7,FONT_BODY,false,"center",true);
          // After
          const rx=ox+2.2;
          txt(s,rx,oy+0.28,bw,0.2,"After decoherence",C.muted,7.5,FONT_BODY,false,"center",true);
          const matA=[[C.accent,"ρ₀₀","0D1A2A","≈0"],["0D1A2A","≈0",C.accent,"ρ₁₁"]];
          for(let r=0;r<2;r++) for(let c2=0;c2<2;c2++){
            const isOff=r!==c2;
            box(s,pres,rx+c2*0.72,oy+0.5+r*0.48,0.68,0.44,isOff?"080808":"0D1A2A",isOff?C.muted:C.accent,isOff?0.5:1.5);
            txt(s,rx+c2*0.72,oy+0.5+r*0.48,0.68,0.44,matA[r][c2===0?1:3],isOff?C.muted:C.accent,9,FONT_MONO,isOff?false:true,"center");
          }
          box(s,pres,ox,oy+1.56,3.8,0.28,"0D1E1D",C.teal);
          txt(s,ox,oy+1.56,3.8,0.28,"Off-diagonals → 0: classical mixture emerges",C.teal,8,FONT_BODY,false,"center",true);
        },
        diagLabel:"Decoherence suppresses off-diagonal coherences → effective classical mixture",
      },
      {
        n:4, color:C.mscCol, tagBg:"2D1850",
        title:"Construct Singlet and Triplet States",
        goal:"Build two-electron spin states from antisymmetry and explain exchange interaction",
        keyPoints:[
          "Antisymmetry: for fermions, total wavefunction must be antisymmetric under exchange",
          "Singlet (S=0): |S⟩=(|↑↓⟩−|↓↑⟩)/√2  — antisymmetric spin; symmetric spatial",
          "Triplet (S=1): three states |T⁺⟩=|↑↑⟩; |T⁰⟩=(|↑↓⟩+|↓↑⟩)/√2; |T⁻⟩=|↓↓⟩  — symmetric spin",
          "Exchange energy: J=E_triplet−E_singlet arises from Pauli antisymmetry (not a new force)",
        ],
        drawDiag: (s, pres, ox, oy) => {
          // Singlet and triplet construction
          box(s,pres,ox,oy,3.8,0.28,"0D1B2E",C.mscCol,2);
          txt(s,ox,oy,3.8,0.28,"Two-electron spin states (antisymmetry)",C.mscCol,9,FONT_HEAD,true,"center");
          const states=[
            {label:"Singlet S=0",state:"(|↑↓⟩ − |↓↑⟩)/√2",type:"antisymm. spin",color:C.accent},
            {label:"Triplet M=+1",state:"|↑↑⟩",type:"symm. spin",color:C.phdCol},
            {label:"Triplet M=0",state:"(|↑↓⟩ + |↓↑⟩)/√2",type:"symm. spin",color:C.phdCol},
            {label:"Triplet M=-1",state:"|↓↓⟩",type:"symm. spin",color:C.phdCol},
          ];
          for(let i=0;i<states.length;i++){
            const ry=oy+0.34+i*0.48;
            box(s,pres,ox,ry,3.8,0.44,states[i].color+"20",states[i].color,i===0?2:1);
            txt(s,ox+0.1,ry+0.04,1.1,0.2,states[i].label,states[i].color,8,FONT_HEAD,true,"center");
            txt(s,ox+1.2,ry+0.04,1.8,0.2,states[i].state,C.white,9,FONT_MONO,true,"center");
            txt(s,ox+3.0,ry+0.04,0.76,0.2,states[i].type,C.muted,7,FONT_BODY,false,"center",true);
          }
          box(s,pres,ox,oy+0.34+4*0.48+0.04,3.8,0.28,"201700",C.gold);
          txt(s,ox,oy+0.34+4*0.48+0.04,3.8,0.28,"Exchange J=E_triplet−E_singlet from antisymmetry alone",C.gold,8,FONT_BODY,false,"center",true);
        },
        diagLabel:"One singlet and three triplet states — total of 2⊗2=4 states in two-spin system",
      },
    ],

    formulaAnswers: [
      ["Transition amplitude", "c_f^{(1)}(t)=−(i/ℏ)∫e^{iω_{fi}t'}⟨f|V̂(t')|i⟩dt' is the first-order amplitude; |c_f^{(1)}|² gives the transition probability to first order in V̂",
       ["For constant V̂: |c|²=4|V_{fi}|²sin²(ω_{fi}t/2)/(ℏω_{fi})²  ✓","P_{i→f}=|c_f^{(1)}|² valid when ≪1  ✓","Fails at resonance ω_{fi}=0: use degenerate PT"]],
      ["Fermi's golden rule", "Γ=(2π/ℏ)|⟨f|V̂|i⟩|²ρ(E_f) is the transition rate to a continuum; ρ(E_f) is the density of final states; derived from the distributional limit t→∞ of sinc²",
       ["Units: [Γ] = s⁻¹ (rate)  ✓","Valid for: t≫ℏ/V but t small enough for first-order  ✓","Applications: spontaneous emission, β-decay, phonon scattering"]],
      ["Lindblad master equation", "dρ̂/dt=−(i/ℏ)[Ĥ,ρ̂]+Σ_k(L̂_kρ̂L̂_k†−½{L̂_k†L̂_k,ρ̂}) is the most general Markovian master equation preserving ρ̂ positive, Hermitian, unit trace; GKSL theorem",
       ["Trace-preserving: Tr(dρ̂/dt)=0  ✓","Complete positivity preserved  ✓","Reduces to von Neumann equation when L̂_k=0"]],
      ["Pointer states", "Pointer states satisfy [H_SE,|ptr⟩⟨ptr|]=0; they are left unchanged by the environment interaction; they become the 'classical' outcomes after decoherence",
       ["Example: spin with H_SE=g σ_z ⊗ E_env → pointer states |↑⟩,|↓⟩  ✓","Superpositions of pointer states lose coherence rapidly  ✓","Pointer basis = eigenbasis of system-environment coupling"]],
      ["Singlet state", "|S=0⟩=(|↑↓⟩−|↓↑⟩)/√2 is antisymmetric under particle exchange; for two electrons it must be paired with a symmetric spatial wavefunction",
       ["⟨S=0|S⃗₁·S⃗₂|S=0⟩=−3ℏ²/4  ✓","Energy: E_singlet below E_triplet for H₂ (bonding)  ✓","Antisymmetric: P₁₂|S=0⟩=−|S=0⟩  ✓"]],
      ["Triplet states", "Three triplet states (M=+1,0,−1) are symmetric under exchange; paired with antisymmetric spatial wavefunction; split by spin-orbit coupling in magnetic field",
       ["⟨S=1|S⃗₁·S⃗₂|S=1⟩=+ℏ²/4  ✓","Zeeman splitting: 3 levels separated by μ_B B  ✓","Exchange J=E_T−E_S quantifies singlet-triplet gap"]],
    ],

    cqPointers: [
      "FGR: first-order TDPT + distributional limit of sinc²; valid when rate constant in time, i.e. continuous spectrum of final states",
      "False: FGR requires continuum of final states (density of states ρ); for discrete spectrum use the oscillatory |c|² formula directly",
      "Jump operators L̂_k represent different decay channels (e.g. L₁=√γ σ_- for spontaneous emission); each contributes one dissipation channel",
      "True: Tr(L̂ρ̂L̂†−½{L̂†L̂,ρ̂})=Tr(L̂L̂†ρ̂)−½Tr(L̂†L̂ρ̂)−½Tr(ρ̂L̂†L̂)=0 by cyclic trace",
      "Decoherence: environment entangles with system; tracing out environment suppresses off-diagonal ρ̂ elements — no word 'collapse' needed",
      "Exchange from antisymmetry: Pauli exclusion forces electrons apart or together depending on spin state; different spatial overlap → different energy",
      "True: triplet states |↑↑⟩, (|↑↓⟩+|↓↑⟩)/√2, |↓↓⟩ are all symmetric under particle exchange",
      "Pointer states: environmental monitoring effectively measures in pointer basis continuously; only pointer states survive without decoherence",
    ],

    tierTasks: {
      hs: ["'Open systems as a leaky box.' Draw a diagram showing energy and information flow",
           "Explain radioactive decay qualitatively using Fermi's golden rule",
           "What is the difference between a pure state and a state that has undergone decoherence?"],
      begug: ["Compute Γ_{0→1} for constant perturbation V̂=V₀σ_x using Fermi's golden rule",
              "Evolve ρ̂ under the amplitude damping Lindblad equation for one qubit",
              "Construct the singlet and triplet states and verify their normalisation and orthogonality"],
      advug: ["Derive Fermi's golden rule from the first-order TDPT amplitude",
              "Verify the Lindblad equation preserves Tr(ρ̂)=1 and ρ̂≥0",
              "Show the exchange energy J=E_T−E_S arises from Coulomb repulsion + antisymmetry"],
      msc: ["State the GKSL theorem and explain the role of complete positivity",
            "Derive the Born–Markov approximation leading to the Lindblad equation",
            "Compute the decoherence rate for a spin-boson model in the Markovian limit"],
      phd: ["Discuss the Nakajima–Zwanzig projection technique for non-Markovian dynamics",
            "Derive the Floquet–Lindblad equation for periodically driven open systems",
            "Analyse entanglement generation and decay in a two-qubit Lindblad system"],
    },
  },

};

module.exports = { LECTURE_DIAGRAMS };
