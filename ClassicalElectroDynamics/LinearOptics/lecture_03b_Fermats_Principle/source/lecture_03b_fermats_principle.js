// ═══════════════════════════════════════════════════════════════
//  LECTURE 03b: Fermat's Principle
//  Run: node lecture_03b_fermat.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 03b: Fermat's Principle","03b");

lectureTitleSlide(pres,"03b",
  "Fermat's Principle",
  "Optical Path Length · Derivation of All Ray Laws · GRIN Media · Euler–Lagrange · Huygens Connection",
  C.purple);

// ─────────────────────────────────────────────────────────────
//  SLIDE 1 — Statement & motivation
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Fermat's Principle: Statement and Physical Meaning","FERMAT'S PRINCIPLE");
  txt(s,"Pierre de Fermat (1662) stated that light travels between two points along the path for which the Optical Path Length is stationary — not necessarily minimum, but a saddle point of the OPL functional.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"fermat_opl",      0.35,1.78,9.3,0.82);
  fImg(s,"fermat_principle",0.35,2.66,9.3,0.82);
  panel(s,pres,0.35,3.58,4.55,1.82,C.purple); hdr(s,pres,0.35,3.58,4.55,C.purple,"What 'stationary' means");
  bul(s,["OPL = ∫n ds measures the number of wavelengths along the path",
         "Stationary: δ(OPL) = 0 means small path variations produce no first-order change in OPL",
         "Usually a minimum (ordinary reflection/refraction)",
         "Can be a maximum (e.g. rays through an ellipsoidal mirror at the far focus)",
         "Can be a saddle point (some GRIN and resonator configurations)",
         "Equivalent to the action principle in mechanics (Maupertuis)"],
    0.43,3.88,4.37,1.44,10.5);
  panel(s,pres,5.1,3.58,4.55,1.82,C.gold); hdr(s,pres,5.1,3.58,4.55,C.gold,"Optical Path Length vs. time");
  bul(s,["OPL = n·(geometric length). Time of travel = OPL/c",
         "In vacuum n=1: OPL = geometric length",
         "In glass n=1.5: OPL = 1.5 × geometric length (phase accumulates faster)",
         "Phase accumulated: φ = (2π/λ₀) × OPL = k₀ × OPL",
         "Fermat's 'least time' (original 1662 statement) is a special case when n is constant in each medium"],
    5.18,3.88,4.37,1.44,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 2 — Derivation of Snell's law
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Deriving Snell's Law from Fermat's Principle","FERMAT'S PRINCIPLE · SNELL");
  txt(s,"A ray crosses a flat interface between media n₁ and n₂. We minimise the total OPL over all possible crossing points x, with the geometry fixed (source height a, observation depth b, lateral separation d).",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"fermat_snell_deriv",0.35,1.73,9.3,0.78);
  // Ray geometry diagram
  const ox=0.38,oy=2.62,dw=4.35,dh=2.75;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.teal,width:1}});
  s.addText("Snell derivation geometry",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.22,fontSize:8.5,bold:true,color:C.teal,fontFace:"Calibri",align:"center"});
  // Interface line
  const ify=oy+1.5;
  s.addShape(pres.shapes.LINE,{x:ox+0.1,y:ify,w:dw-0.2,h:0,line:{color:C.gold,width:2}});
  s.addText("Interface",{x:ox+0.12,y:ify-0.22,w:1.2,h:0.2,fontSize:7.5,color:C.gold,fontFace:"Calibri"});
  s.addText("n₁",{x:ox+0.12,y:oy+0.32,w:0.4,h:0.28,fontSize:11,bold:true,color:C.accent1,fontFace:"Georgia"});
  s.addText("n₂",{x:ox+0.12,y:ify+0.08,w:0.4,h:0.28,fontSize:11,bold:true,color:C.teal,fontFace:"Georgia"});
  // Source, crossing point, observation
  const srcX=ox+0.55, srcY=oy+0.45, cpX=ox+2.2, cpY=ify, obsX=ox+3.7, obsY=ify+1.0;
  s.addShape(pres.shapes.LINE,{x:srcX,y:srcY,w:cpX-srcX,h:cpY-srcY,line:{color:C.accent1,width:2.2}});
  s.addShape(pres.shapes.LINE,{x:cpX,y:cpY,w:obsX-cpX,h:obsY-cpY,line:{color:C.teal,width:2.2}});
  s.addShape(pres.shapes.OVAL,{x:srcX-0.07,y:srcY-0.07,w:0.14,h:0.14,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addShape(pres.shapes.OVAL,{x:obsX-0.07,y:obsY-0.07,w:0.14,h:0.14,fill:{color:C.green},line:{color:C.green,width:0}});
  s.addShape(pres.shapes.OVAL,{x:cpX-0.07,y:cpY-0.07,w:0.14,h:0.14,fill:{color:C.white},line:{color:C.white,width:0}});
  // Normal
  s.addShape(pres.shapes.LINE,{x:cpX,y:oy+0.32,w:0,h:dh-0.45,line:{color:C.muted,width:1,dashType:"dash"}});
  s.addText("a",{x:srcX+0.05,y:oy+0.42,w:0.22,h:0.22,fontSize:10,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addText("b",{x:cpX+0.05,y:ify+0.12,w:0.22,h:0.22,fontSize:10,bold:true,color:C.teal,fontFace:"Georgia"});
  s.addText("x",{x:ox+0.55,y:ify+0.05,w:0.35,h:0.22,fontSize:9.5,bold:true,color:C.offwhite,fontFace:"Georgia"});
  s.addText("d-x",{x:cpX+0.12,y:ify+0.05,w:0.55,h:0.22,fontSize:9.5,bold:true,color:C.offwhite,fontFace:"Georgia"});
  s.addText("θ₁",{x:cpX-0.48,y:ify-0.45,w:0.3,h:0.28,fontSize:11,bold:true,color:C.accent1,fontFace:"Georgia"});
  s.addText("θ₂",{x:cpX+0.1,y:ify+0.12,w:0.3,h:0.28,fontSize:11,bold:true,color:C.teal,fontFace:"Georgia"});
  // d total
  s.addShape(pres.shapes.LINE,{x:ox+0.1,y:oy+dh-0.15,w:dw-0.2,h:0,line:{color:C.muted,width:1,dashType:"dash"}});
  s.addText("←  d  →",{x:ox+0.85,y:oy+dh-0.32,w:2.2,h:0.22,fontSize:9,color:C.muted,fontFace:"Calibri",align:"center"});

  panel(s,pres,4.93,2.62,4.72,2.75,C.teal); hdr(s,pres,4.93,2.62,4.72,C.teal,"Step-by-step derivation");
  bul(s,["OPL(x) = n₁·(x/cosθ₁) + n₂·((d−x)/cosθ₂)  [path lengths in each medium]",
         "In terms of geometry: OPL = n₁√(a²+x²) + n₂√(b²+(d−x)²)",
         "Stationarity: d(OPL)/dx = 0",
         "d/dx[n₁√(a²+x²)] = n₁x/√(a²+x²) = n₁sinθ₁",
         "d/dx[n₂√(b²+(d−x)²)] = −n₂(d−x)/√(b²+(d−x)²) = −n₂sinθ₂",
         "Setting sum to zero: n₁sinθ₁ − n₂sinθ₂ = 0",
         "⟹  n₁sinθ₁ = n₂sinθ₂  ✓  (Snell's law derived!)"],
    5.01,2.94,4.55,2.35,10.5);
  fImg(s,"hs_snell",0.35,5.42,9.3,0.2);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 3 — Derivation of reflection law
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Deriving the Law of Reflection from Fermat's Principle","FERMAT'S PRINCIPLE · REFLECTION");
  txt(s,"A ray from source A at height a reflects off a flat mirror and reaches observer B at height b, with both on the same side of the mirror. We minimise OPL = total geometric path length (n=const).",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"fermat_reflection_deriv",0.35,1.73,9.3,0.82);
  // Mirror reflection diagram
  const ox=0.38,oy=2.65,dw=4.35,dh=2.72;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.amber,width:1}});
  s.addText("Reflection geometry",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.22,fontSize:8.5,bold:true,color:C.amber,fontFace:"Calibri",align:"center"});
  // Mirror line at bottom
  const miry=oy+dh-0.35;
  s.addShape(pres.shapes.LINE,{x:ox+0.1,y:miry,w:dw-0.2,h:0,line:{color:C.amber,width:3}});
  s.addShape(pres.shapes.RECTANGLE,{x:ox+0.1,y:miry,w:dw-0.2,h:0.25,fill:{color:C.amber,transparency:85},line:{color:C.amber,width:0}});
  s.addText("Mirror  (n₁ uniform above)",{x:ox+0.4,y:miry+0.06,w:2.8,h:0.2,fontSize:7.5,color:C.amber,fontFace:"Calibri"});
  // Source and observer
  const srcX=ox+0.55,srcY=oy+0.5,cpX=ox+2.0,cpY=miry,obsX=ox+3.65,obsY=oy+0.65;
  s.addShape(pres.shapes.LINE,{x:srcX,y:srcY,w:cpX-srcX,h:cpY-srcY,line:{color:C.accent1,width:2.2}});
  s.addShape(pres.shapes.LINE,{x:cpX,y:cpY,w:obsX-cpX,h:obsY-cpY,line:{color:C.accent1,width:2.2}});
  s.addShape(pres.shapes.OVAL,{x:srcX-0.08,y:srcY-0.08,w:0.16,h:0.16,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addShape(pres.shapes.OVAL,{x:obsX-0.08,y:obsY-0.08,w:0.16,h:0.16,fill:{color:C.green},line:{color:C.green,width:0}});
  s.addShape(pres.shapes.OVAL,{x:cpX-0.07,y:cpY-0.07,w:0.14,h:0.14,fill:{color:C.white},line:{color:C.white,width:0}});
  s.addShape(pres.shapes.LINE,{x:cpX,y:oy+0.32,w:0,h:dh-0.5,line:{color:C.muted,width:1,dashType:"dash"}});
  s.addText("A",{x:srcX-0.22,y:srcY-0.12,w:0.22,h:0.22,fontSize:10,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addText("B",{x:obsX+0.04,y:obsY-0.18,w:0.22,h:0.22,fontSize:10,bold:true,color:C.green,fontFace:"Georgia"});
  s.addText("x",{x:ox+0.55,y:miry-0.28,w:0.3,h:0.22,fontSize:9.5,bold:true,color:C.offwhite,fontFace:"Georgia"});
  s.addText("θᵢ",{x:cpX-0.5,y:cpY-0.55,w:0.32,h:0.28,fontSize:11,bold:true,color:C.accent1,fontFace:"Georgia"});
  s.addText("θᵣ",{x:cpX+0.12,y:cpY-0.55,w:0.32,h:0.28,fontSize:11,bold:true,color:C.accent1,fontFace:"Georgia"});
  // Virtual image trick
  s.addShape(pres.shapes.OVAL,{x:srcX-0.06,y:2*miry-srcY-0.06,w:0.12,h:0.12,fill:{color:C.gold,transparency:50},line:{color:C.gold,width:1,dashType:"dash"}});
  s.addText("A'",{x:srcX-0.25,y:2*miry-srcY+0.04,w:0.3,h:0.22,fontSize:9,color:C.gold,fontFace:"Georgia",italic:true});
  s.addShape(pres.shapes.LINE,{x:srcX,y:2*miry-srcY,w:obsX-srcX,h:obsY-(2*miry-srcY),line:{color:C.gold,width:1,dashType:"dash"}});

  panel(s,pres,4.93,2.65,4.72,2.72,C.amber); hdr(s,pres,4.93,2.65,4.72,C.amber,"Derivation & the mirror-image trick");
  bul(s,["OPL(x) = √(a²+x²) + √(b²+(d−x)²)  [n=1 above mirror]",
         "d(OPL)/dx = 0: sinθᵢ = sinθᵣ  ⟹  θᵢ = θᵣ  ✓",
         "Equivalent construction: reflect source A to virtual image A' below mirror",
         "Straight line A'→B is the shortest path: always gives θᵢ = θᵣ",
         "The virtual-image construction is a direct consequence of Fermat",
         "Applies to curved mirrors too: normal to mirror surface bisects i and r"],
    5.01,2.97,4.55,2.32,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 4 — TIR and the OPL picture
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Total Internal Reflection & OPL Phase Accumulation","FERMAT'S PRINCIPLE · TIR");
  fImg(s,"fermat_tir",  0.35,1.12,9.3,0.68);
  fImg(s,"fermat_phase",0.35,1.86,9.3,0.72);
  panel(s,pres,0.35,2.68,4.55,2.72,C.teal); hdr(s,pres,0.35,2.68,4.55,C.teal,"TIR from Fermat");
  bul(s,["At the critical angle θc = arcsin(n₂/n₁), the refracted ray grazes the interface at θ₂=90°",
         "For θ₁ > θc, Snell's law gives sinθ₂ = (n₁/n₂)sinθ₁ > 1 — no real solution",
         "From the OPL perspective: no stationary-OPL path exists through the interface",
         "Energy cannot propagate as a real transmitted ray → total reflection",
         "Evanescent wave: exponentially decaying field penetrates a few λ into medium 2",
         "Evanescent coupling: tunnelling between closely spaced fibres/prisms (FTIR)"],
    0.43,2.98,4.37,2.34,10.5);
  panel(s,pres,5.1,2.68,4.55,2.72,C.gold); hdr(s,pres,5.1,2.68,4.55,C.gold,"OPL and phase: practical consequences");
  bul(s,["Optical path difference (OPD) between two rays → phase difference Δφ = k₀·OPD",
         "Δφ = 2πm → constructive (bright fringe in interferometer)",
         "Δφ = (2m+1)π → destructive (dark fringe)",
         "Anti-reflection coating: layer thickness t = λ/(4n) → OPL = λ/2 → Δφ = π → destructive reflection",
         "AR coating condition: n_coat = √(n₁ n₂), t = λ₀/(4n_coat)",
         "Fabry-Pérot: resonance when round-trip OPL = mλ (Lec 04, Lasers)"],
    5.18,2.98,4.37,2.34,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 5 — Lens design: equal OPL condition
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Lens Design: The Equal OPL Condition","FERMAT'S PRINCIPLE · LENSES");
  txt(s,"A perfect imaging lens maps every ray from a source point to the same image point. By Fermat's principle this requires that all rays have the same OPL — the lens surface is precisely shaped to enforce this.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"fermat_lens_opl",0.35,1.78,9.3,0.72);
  // Lens OPL diagram
  const ox=0.38,oy=2.6,dw=4.35,dh=2.75;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.gold,width:1}});
  s.addText("Equal-OPL lens construction",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.22,fontSize:8.5,bold:true,color:C.gold,fontFace:"Calibri",align:"center"});
  // Optical axis
  const ay=oy+dh/2;
  s.addShape(pres.shapes.LINE,{x:ox+0.1,y:ay,w:dw-0.2,h:0,line:{color:C.muted,width:1,dashType:"dash"}});
  // Source, lens, image
  const lx=ox+2.1;
  for(let y=-0.55;y<=0.56;y+=0.14){
    s.addShape(pres.shapes.RECTANGLE,{x:lx-0.06,y:ay+y,w:0.12,h:0.1,fill:{color:C.gold},line:{color:C.gold,width:0}});
  }
  s.addShape(pres.shapes.OVAL,{x:ox+0.35,y:ay-0.07,w:0.14,h:0.14,fill:{color:C.green},line:{color:C.green,width:0}});
  s.addShape(pres.shapes.OVAL,{x:ox+dw-0.55,y:ay-0.07,w:0.14,h:0.14,fill:{color:C.red},line:{color:C.red,width:0}});
  s.addText("S",{x:ox+0.18,y:ay-0.05,w:0.2,h:0.22,fontSize:10,bold:true,color:C.green,fontFace:"Georgia"});
  s.addText("P",{x:ox+dw-0.42,y:ay-0.05,w:0.22,h:0.22,fontSize:10,bold:true,color:C.red,fontFace:"Georgia"});
  // Rays — three heights
  const heights=[-0.5,0,0.5];
  heights.forEach(h=>{
    s.addShape(pres.shapes.LINE,{x:ox+0.42,y:ay,w:lx-ox-0.42,h:h,line:{color:C.accent1,width:1.5}});
    s.addShape(pres.shapes.LINE,{x:lx,y:ay+h,w:ox+dw-0.42-lx,h:-h,line:{color:C.teal,width:1.5}});
  });
  s.addText("OPL₁ = OPL₂ = OPL₃ = const",{x:ox+0.15,y:oy+dh-0.38,w:dw-0.3,h:0.28,fontSize:9.5,color:C.gold,fontFace:"Calibri",bold:true,align:"center"});

  panel(s,pres,4.93,2.6,4.72,2.75,C.teal); hdr(s,pres,4.93,2.6,4.72,C.teal,"Consequences of the equal-OPL condition");
  bul(s,["All rays from S to P have the same OPL → arrive in phase → constructive interference → bright image",
         "A ray through the centre of the lens travels all in air → has smallest geometric length",
         "A marginal ray (through edge) travels mostly in glass → geometric length larger but in glass (higher n) fewer wavelengths fit → OPL equalised",
         "Aberrations arise when the lens surface deviates from the ideal equal-OPL shape",
         "Aspherical lenses and multi-element designs aim to satisfy the OPL condition over a wider field"],
    5.01,2.92,4.55,2.35,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 6 — Euler–Lagrange and the ray equation
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Variational Calculus: Euler–Lagrange and the Ray Equation","FERMAT'S PRINCIPLE · VARIATIONAL");
  txt(s,"Fermat's principle is a variational principle — it says δ(OPL)=0 for the true ray. Applying the Euler–Lagrange equations to the OPL integral yields the general ray equation, valid in any medium.",
      0.35,1.12,9.3,0.58,{fs:12});
  fImg(s,"fermat_euler_lagrange",0.35,1.76,9.3,0.82);
  fImg(s,"fermat_grin_ray",      0.35,2.64,9.3,0.78);
  panel(s,pres,0.35,3.52,4.55,1.88,C.purple); hdr(s,pres,0.35,3.52,4.55,C.purple,"Euler–Lagrange derivation outline");
  bul(s,["OPL = ∫n(r) ds  with ds = √(dx²+dy²+dz²)",
         "Treat y(x), z(x) as the unknown functions → Lagrangian L = n√(1+y'²+z'²)",
         "E–L equation for y: d/dx(∂L/∂y') − ∂L/∂y = 0",
         "In vector form: d/ds(n dr/ds) = ∇n  (general 3D ray equation)",
         "In uniform medium (∇n=0): d²r/ds²=0 → straight lines ✓",
         "Analogy with mechanics: n plays the role of mass×speed (momentum)"],
    0.43,3.82,4.37,1.5,10.5);
  panel(s,pres,5.1,3.52,4.55,1.88,C.green); hdr(s,pres,5.1,3.52,4.55,C.green,"Mechanics analogy");
  bul(s,["Fermat ↔ Hamilton's principle: δ∫L dt = 0",
         "OPL ↔ action S = ∫p dq",
         "n(r) ↔ refractive index momentum |p| = n",
         "Ray equation ↔ Newton's law F = dp/ds",
         "Snell's law ↔ conservation of tangential momentum",
         "Hamiltonian optics (Lie group methods) uses this fully"],
    5.18,3.82,4.37,1.5,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 7 — GRIN ray paths
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Fermat in GRIN Media: Curved Ray Paths","FERMAT'S PRINCIPLE · GRIN");
  txt(s,"In a gradient-index (GRIN) medium, ∇n ≠ 0, so the ray equation d/ds(n dr/ds) = ∇n predicts curved ray paths. The OPL of each curved ray is stationary — not minimum nor maximum in general.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"fermat_grin_ray",0.35,1.73,9.3,0.78);
  fImg(s,"abcd_grin",     0.35,2.57,5.5,1.35);
  // GRIN ray diagram
  const ox=5.85,oy=1.73,dw=3.8,dh=3.62;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.teal,width:1}});
  s.addText("Sinusoidal ray paths in GRIN rod",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.22,fontSize:8,bold:true,color:C.teal,fontFace:"Calibri",align:"center"});
  // GRIN rod body
  s.addShape(pres.shapes.RECTANGLE,{x:ox+0.15,y:oy+0.38,w:dw-0.3,h:dh-0.55,fill:{color:C.teal,transparency:90},line:{color:C.teal,width:1.2}});
  const ax=oy+0.38+(dh-0.55)/2;
  s.addShape(pres.shapes.LINE,{x:ox+0.15,y:ax,w:dw-0.3,h:0,line:{color:C.muted,width:0.8,dashType:"dash"}});
  // Sinusoidal rays
  const npts=80;
  const zArr=Array.from({length:npts},(_,i)=>ox+0.22+i*(dw-0.37)/(npts-1));
  [[0.55,C.accent1],[0.28,C.green],[0,C.gold]].forEach(([amp,col])=>{
    for(let i=0;i<npts-1;i++){
      const zi=zArr[i], zi1=zArr[i+1];
      const phase=Math.PI*2*(i)/(npts-1)*3;
      const phase1=Math.PI*2*(i+1)/(npts-1)*3;
      const yi=ax+amp*Math.sin(phase);
      const yi1=ax+amp*Math.sin(phase1);
      s.addShape(pres.shapes.LINE,{x:zi,y:yi,w:zi1-zi,h:yi1-yi,line:{color:col,width:1.6}});
    }
  });
  s.addText("Quarter-pitch → collimate\nHalf-pitch → image",{x:ox+0.2,y:oy+dh-0.5,w:dw-0.4,h:0.4,fontSize:8,color:C.teal,fontFace:"Calibri",align:"center"});
  panel(s,pres,0.35,4.0,5.5,1.38,C.amber); hdr(s,pres,0.35,4.0,5.5,C.amber,"GRIN applications");
  bul(s,["Optical fibre: parabolic n(r) → all modes travel same OPL → minimal pulse spreading (GI fibre)",
         "Selfoc® GRIN lenses: quarter-pitch collimates, half-pitch images — used in laser coupling, endoscopes",
         "Human eye lens: graded n from cortex to centre reduces aberration",
         "Atmosphere: temperature gradient bends light → mirages, astronomical refraction"],
    0.43,4.3,5.3,1.0,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 8 — Fermat → Huygens → wavefronts
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Fermat's Principle and Huygens' Construction","FERMAT'S PRINCIPLE · HUYGENS");
  txt(s,"Fermat's principle and Huygens' wavelet construction are two faces of the same physics. The OPL perspective gives rays; the wavefront perspective gives Huygens wavelets. Together they explain all of geometric and wave optics.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"fermat_huygens",       0.35,1.78,9.3,0.72);
  fImg(s,"fermat_optical_invariant",0.35,2.56,9.3,0.65);
  panel(s,pres,0.35,3.3,4.55,2.08,C.accent1); hdr(s,pres,0.35,3.3,4.55,C.accent1,"Wavefronts from OPL");
  bul(s,["Wavefront W(t): surface where OPL from source = constant","Rays are the orthogonal trajectories to wavefronts (normals)","In homogeneous medium: plane wavefronts → straight rays","At a curved surface: wavefront refraction described by Snell = OPL stationarity","Huygens: each point on W emits a spherical wavelet; next wavefront = envelope"],
    0.43,3.6,4.37,1.7,10.5);
  panel(s,pres,5.1,3.3,4.55,2.08,C.teal); hdr(s,pres,5.1,3.3,4.55,C.teal,"The Lagrange–Helmholtz invariant");
  bul(s,["From Fermat: n sinθ is preserved at each ray-trace step along optical axis","Paraxial form: n y θ = const  (Lagrange invariant)","Relates input and output beam properties for any optical system","A large-field, large-NA system cannot simultaneously have high magnification","Fundamental limit on throughput (étendue = n²A·Ω) in optical instruments"],
    5.18,3.6,4.37,1.7,10.5);
  panel(s,pres,0.35,5.45,9.3,0.2,C.mid);
  txt(s,"Summary: Fermat's principle (δOPL=0) → Snell's law + reflection law + GRIN ray equation + lens design condition + Lagrange invariant + wavefront construction — all from one variational statement.",
    0.45,5.47,9.1,0.17,{fs:8.5,col:C.muted,italic:true});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 9 — Summary diagram
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Summary: Everything Derived from Fermat's Principle","FERMAT'S PRINCIPLE · SUMMARY");
  // Central box
  const cx=5.0, cy=3.0, bw=2.6, bh=1.0;
  s.addShape(pres.shapes.RECTANGLE,{x:cx-bw/2,y:cy-bh/2,w:bw,h:bh,fill:{color:C.purple,transparency:10},line:{color:C.purple,width:2.5},shadow:{type:"outer",color:C.purple,blur:15,offset:0,angle:0,opacity:0.4}});
  s.addText("δ OPL = 0",{x:cx-bw/2+0.1,y:cy-0.3,w:bw-0.2,h:0.55,fontSize:22,bold:true,color:C.white,fontFace:"Georgia",align:"center"});
  s.addText("Fermat's Principle",{x:cx-bw/2+0.1,y:cy+0.18,w:bw-0.2,h:0.25,fontSize:10,color:C.accent3,fontFace:"Calibri",italic:true,align:"center"});

  // Surrounding results with arrow lines
  const results=[
    {x:1.0,y:1.2,t:"Snell's Law",s:"n₁sinθ₁=n₂sinθ₂",c:C.teal},
    {x:5.0,y:1.0,t:"Reflection Law",s:"θᵢ = θᵣ",c:C.amber},
    {x:8.7,y:1.2,t:"TIR Condition",s:"θc=arcsin(n₂/n₁)",c:C.red},
    {x:0.8,y:3.0,t:"GRIN Ray Equation",s:"d/ds(n dr/ds)=∇n",c:C.green},
    {x:9.0,y:3.0,t:"Lagrange Invariant",s:"n y θ = const",c:C.gold},
    {x:1.0,y:4.8,t:"Lens Design",s:"OPL = const for all rays",c:C.accent1},
    {x:5.0,y:5.0,t:"Wavefront / Huygens",s:"rays ⊥ surfaces of const OPL",c:C.accent2},
    {x:8.7,y:4.8,t:"Phase Accumulation",s:"φ = k₀ · OPL",c:C.pink},
  ];
  results.forEach(r=>{
    const pw=2.15, ph=0.88;
    s.addShape(pres.shapes.RECTANGLE,{x:r.x-pw/2,y:r.y-ph/2,w:pw,h:ph,fill:{color:C.panel},line:{color:r.c,width:1.5},shadow:makeShadow()});
    s.addShape(pres.shapes.RECTANGLE,{x:r.x-pw/2,y:r.y-ph/2,w:pw,h:0.26,fill:{color:r.c},line:{color:r.c,width:0}});
    s.addText(r.t,{x:r.x-pw/2+0.06,y:r.y-ph/2+0.01,w:pw-0.12,h:0.24,fontSize:9,bold:true,color:C.dark,fontFace:"Calibri"});
    s.addText(r.s,{x:r.x-pw/2+0.06,y:r.y-ph/2+0.3,w:pw-0.12,h:0.5,fontSize:9.5,color:C.accent3,fontFace:"Consolas"});
    // Arrow from result to centre
    const ax2=r.x<cx?r.x+pw/2:r.x-pw/2;
    const ay2=r.y;
    const acx=r.x<cx?cx-bw/2:cx+bw/2;
    const acy=cy;
    s.addShape(pres.shapes.LINE,{x:Math.min(ax2,acx),y:ay2<acy?ay2:acy,w:Math.abs(acx-ax2),h:Math.abs(acy-ay2),line:{color:r.c,width:1,transparency:40}});
  });
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Fermat's Principle: References, Problems & Projects","FERMAT'S PRINCIPLE · REFERENCES",
  ["Hecht, Optics, 5th ed. — Ch. 4.3–4.5: Fermat's principle, derivation of Snell's law, reflection.",
   "Born & Wolf, Principles of Optics — Ch. 3.1–3.3: Fermat's principle and the eikonal equation.",
   "Jenkins & White, Fundamentals of Optics — Ch. 1–2: Fermat and geometric optics.",
   "Feynman, QED: The Strange Theory of Light and Matter — intuitive path-integral view of Fermat.",
   "Feynman Lectures Vol. I, Ch. 26: 'Optics: the Principle of Least Time'."],
  ["Saleh & Teich, Fundamentals of Photonics — Ch. 1.3: ray optics from Fermat's principle.",
   "Goodman, Introduction to Fourier Optics — App. A: OPL and phase in diffraction integrals.",
   "Luneburg, Mathematical Theory of Optics (1964): rigorous variational optics, Hamiltonian formulation.",
   "Arnold, Mathematical Methods of Classical Mechanics — Ch. 9: geometric optics as classical mechanics.",
   "Sharma, Introduction to Computational Optics (2006): numerical ray-tracing from Fermat."],
  ["[BSc] Starting from OPL(x)=n₁√(a²+x²)+n₂√(b²+(d−x)²), take d(OPL)/dx=0 and show it gives Snell's law exactly.",
   "[BSc] Use Fermat's principle to show that a flat mirror satisfies θᵢ=θᵣ using the virtual-image construction.",
   "[BSc] Prove that a plano-convex lens with R₁=∞ and n=1.5 satisfies the equal-OPL condition for a source at infinity when the curved surface has radius R = f(n−1).",
   "[BSc] Show that the AR coating condition t=λ₀/(4n_coat) with n_coat=√(n₁n₂) follows from requiring OPD=λ/2 for the two surface reflections.",
   "[MSc] Apply the Euler–Lagrange equations to OPL=∫n(r)ds to derive the ray equation d/ds(n dr/ds)=∇n in 3D.",
   "[MSc] For a parabolic GRIN medium n(r)=n₀(1−αr²/2), solve the ray equation to show r(z)=r₀cos(√α z). Confirm with the ABCD matrix.",
   "[MSc Project] Implement a numerical ray-tracer using Fermat's principle (OPL minimisation with Newton's method) and trace a paraxial ray through a biconvex lens. Compare with the thin-lens ABCD result."]);

pres.writeFile({fileName:"/home/claude/lecture_03b_fermat.pptx"})
  .then(()=>console.log("✓ lecture_03b_fermat.pptx"))
  .catch(e=>console.error(e));
