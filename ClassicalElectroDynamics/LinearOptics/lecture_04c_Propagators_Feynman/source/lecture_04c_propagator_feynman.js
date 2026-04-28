// ═══════════════════════════════════════════════════════════════
//  LECTURE 04c: Optical Propagators & the Feynman Path Integral
//  Derives propagators from Fermat's principle via sum-over-paths.
//  Inserted between 04b (Maxwell/Eikonal) and 05 (Polarization).
//  Run: node lecture_04c_propagator_feynman.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 04c: Propagators & Feynman Path Integral","04c");

lectureTitleSlide(pres,"04c",
  "Propagators & the Feynman Path Integral",
  "Sum Over All Paths · Optical Propagator · Huygens Derived · Collins Integral · Feynman Diagrams for Light",
  C.green);

// ─────────────────────────────────────────────────────────────
//  SLIDE 1 — The Big Idea
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Big Idea: Light Takes ALL Paths — Not Just Fermat's","PROPAGATORS · INTRODUCTION");
  txt(s,"Fermat's principle says light takes the path of stationary OPL. Feynman (1948, inspired by Dirac) revealed the deeper truth: light simultaneously takes ALL paths, each contributing a phasor exp(ik₀·OPL). Interference between paths cancels all but the stationary one — recovering Fermat.",
      0.35,1.12,9.3,0.65,{fs:12});

  // Two-column side-by-side comparison
  panel(s,pres,0.35,1.85,4.55,2.22,C.amber); hdr(s,pres,0.35,1.85,4.55,C.amber,"Fermat's Principle (Classical)");
  bul(s,["Light travels on ONE path: the path where δ(OPL)=0","All other paths are forbidden","Gives exact rays in the geometric limit λ→0","Cannot explain diffraction, interference, tunnelling",
         "A rule — but WHY does light 'know' which path to take?"],
    0.43,2.15,4.37,1.84,10.5);

  panel(s,pres,5.1,1.85,4.55,2.22,C.green); hdr(s,pres,5.1,1.85,4.55,C.green,"Feynman Path Integral (Wave)");
  bul(s,["Light travels on ALL paths simultaneously","Each path contributes amplitude exp(ik₀·OPL)","Paths near stationary OPL add coherently → ray","Paths far from stationary OPL cancel by destructive interference",
         "Fermat's principle EMERGES as a consequence"],
    5.18,2.15,4.37,1.84,10.5);

  fImg(s,"pi_sum_paths",0.35,4.15,9.3,0.82);

  panel(s,pres,0.35,5.05,9.3,0.55,C.mid);
  txt(s,"Key: the phasor exp(ik₀·OPL) for each path depends on the path's OPL = ∫n ds. When k₀ is large (λ small), the phases oscillate rapidly between nearby paths — cancellation is near-total everywhere except near the stationary-OPL Fermat path.",
      0.43,5.07,9.1,0.5,{fs:10.5,col:C.muted,italic:true});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 2 — The optical propagator
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Optical Propagator K(B,A): Definition and Properties","PROPAGATORS · DEFINITION");
  txt(s,"The optical propagator K(B,A) is the amplitude for a photon to travel from point A to point B. It equals the sum (functional integral) of exp(ik₀·OPL) over all possible trajectories from A to B.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pi_propagator_def",0.35,1.73,9.3,0.82);

  // Properties panels
  const props=[
    {t:"Composition rule",c:C.teal,
     b:"K(C,A) = ∫K(C,B)·K(B,A) dB\nInsert a complete set of intermediate points — propagation is concatenation of propagators. This is the semigroup property."},
    {t:"Unitarity",c:C.accent1,
     b:"∫|K(B,A)|² dB = 1  (in lossless media)\nTotal probability of arriving somewhere = 1. Propagation through lossless optics is unitary — a Fourier transform in disguise."},
    {t:"Initial condition",c:C.gold,
     b:"K(B,A) → δ²(B−A) as z→0\nIn the limit of zero propagation distance, the propagator is a delta function — a point stays a point."},
    {t:"Connection to Green's function",c:C.purple,
     b:"K(B,A) is the outgoing Green's function of the Helmholtz equation: (∇²+k²)K = −δ(B−A)\nFull wave: K=exp(ikr)/r  Paraxial: Fresnel kernel."},
  ];
  props.forEach((p,i)=>{
    const x=0.35+(i%2)*4.85, y=2.65+Math.floor(i/2)*1.38;
    panel(s,pres,x,y,4.6,1.28,p.c); hdr(s,pres,x,y,4.6,p.c,p.t);
    txt(s,p.b,x+0.1,y+0.32,4.38,0.9,{fs:10.5,col:C.offwhite,font:"Consolas"});
  });
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 3 — Stationary phase → Fermat's principle recovered
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Recovering Fermat's Principle from the Path Integral","PROPAGATORS · STATIONARY PHASE");
  txt(s,"When k₀ = 2π/λ is large (geometric optics limit), the phase k₀·OPL[path] oscillates rapidly as we vary the path. The dominant contribution comes from paths where the phase is stationary — the method of stationary phase.",
      0.35,1.12,9.3,0.58,{fs:12});
  fImg(s,"sp_integral",         0.35,1.76,9.3,0.82);
  fImg(s,"pi_stationary_phase", 0.35,2.64,9.3,0.75);

  // Path cancellation diagram
  const ox=0.38,oy=3.48,dw=4.35,dh=1.9;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.green,width:1}});
  s.addText("Phasor cancellation — why Fermat emerges",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.22,fontSize:8,bold:true,color:C.green,fontFace:"Calibri",align:"center"});
  // Source, screen, two destination points
  const ay=oy+dh/2+0.05;
  const srcX=ox+0.35, dstX=ox+dw-0.35;
  s.addShape(pres.shapes.OVAL,{x:srcX-0.07,y:ay-0.07,w:0.14,h:0.14,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("A",{x:srcX-0.22,y:ay-0.02,w:0.22,h:0.2,fontSize:9,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addShape(pres.shapes.OVAL,{x:dstX-0.07,y:ay-0.07,w:0.14,h:0.14,fill:{color:C.accent1},line:{color:C.accent1,width:0}});
  s.addText("B",{x:dstX+0.04,y:ay-0.02,w:0.22,h:0.2,fontSize:9,bold:true,color:C.accent1,fontFace:"Georgia"});
  // Paths — many curves converging to straight line
  const nPaths=9;
  for(let i=0;i<nPaths;i++){
    const frac=(i-(nPaths-1)/2)/((nPaths-1)/2);
    const mid_y=ay+frac*0.52;
    const col=Math.abs(frac)<0.25?C.green:C.muted;
    const alpha=Math.abs(frac)<0.25?0:55+Math.abs(frac)*35;
    // Simple arc via 3-point polyline
    s.addShape(pres.shapes.LINE,{x:srcX,y:ay,w:(dstX-srcX)/2,h:mid_y-ay,line:{color:col,width:Math.abs(frac)<0.12?2.5:1.2,transparency:alpha}});
    s.addShape(pres.shapes.LINE,{x:srcX+(dstX-srcX)/2,y:mid_y,w:(dstX-srcX)/2,h:ay-mid_y,line:{color:col,width:Math.abs(frac)<0.12?2.5:1.2,transparency:alpha}});
  }
  // Labels
  s.addText("Fermat path\n(stationary OPL)",{x:srcX+1.1,y:ay-0.52,w:1.6,h:0.42,fontSize:8,color:C.green,fontFace:"Calibri",align:"center"});
  s.addText("Off-path: phases cancel",{x:srcX+0.25,y:oy+dh-0.38,w:3.5,h:0.22,fontSize:8,color:C.muted,fontFace:"Calibri",align:"center",italic:true});

  panel(s,pres,4.93,3.48,4.72,1.9,C.amber); hdr(s,pres,4.93,3.48,4.72,C.amber,"What this means physically");
  bul(s,["For large k₀: paths far from Fermat have rapidly varying phase → their phasors point in random directions → sum ≈ 0",
         "Paths within Δpath ~ √(λz) of the Fermat path have |ΔPhase| < π → add coherently",
         "This coherent strip has width √(λz) — the first Fresnel zone radius!",
         "Geometric optics (λ→0): strip shrinks to a line → single ray",
         "Wave optics (finite λ): strip has finite width → diffraction"],
    5.01,3.8,4.55,1.48,10.5);

  fImg(s,"pi_path_width",0.35,5.42,9.3,0.2);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 4 — Free-space propagator: exact and paraxial
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Free-Space Propagator: Spherical Wave and Fresnel Kernel","PROPAGATORS · FREE SPACE");
  txt(s,"The path integral over all straight-line paths in free space (n=1) can be evaluated exactly. In 3D it gives a spherical wave; in the paraxial approximation it gives the Fresnel diffraction kernel.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"sw_green",      0.35,1.73,9.3,0.75);
  fImg(s,"pi_free_space", 0.35,2.54,9.3,0.75);
  fImg(s,"pi_huygens",    0.35,3.35,9.3,0.72);

  panel(s,pres,0.35,4.15,4.55,1.22,C.teal); hdr(s,pres,0.35,4.15,4.55,C.teal,"Exact → paraxial derivation");
  bul(s,["Exact 3D: K(B,A) = exp(ikr)/(iλr)  where r=|B−A| (spherical wave)",
         "Paraxial (small angles, r≈z+ρ²/2z): expand r in powers of (x₂−x₁)/z",
         "K_paraxial = (i/λz)^½ exp(iπ(x₂−x₁)²/λz)  — the Fresnel kernel",
         "Full free-space propagator: B=z, A=D=1, C=0 in ABCD notation"],
    0.43,4.45,4.37,0.85,10.5);

  panel(s,pres,5.1,4.15,4.55,1.22,C.gold); hdr(s,pres,5.1,4.15,4.55,C.gold,"Huygens–Fresnel from path integral");
  bul(s,["Convolving U(x₁) with K_free gives U(x₂) at distance z",
         "Every point x₁ on the input wavefront acts as a secondary source",
         "K(x₂,x₁) = amplitude contribution from that secondary source to x₂",
         "This IS Huygens' principle — now derived, not postulated"],
    5.18,4.45,4.37,0.85,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 5 — ABCD propagator: Collins integral
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The ABCD Propagator: Collins Integral","PROPAGATORS · ABCD");
  txt(s,"For any paraxial optical system described by an ABCD matrix, the path integral can be evaluated in closed form. The result is the Collins integral — the universal propagator for paraxial optics.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pi_paraxial_prop",0.35,1.73,9.3,0.82);
  fImg(s,"pi_collins",      0.35,2.61,9.3,0.75);
  fImg(s,"pi_opl_quadratic",0.35,3.42,9.3,0.68);

  // OPL from A to B through ABCD diagram
  const ox=0.38,oy=4.18,dw=4.35,dh=1.22;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.purple,width:1}});
  s.addText("OPL of paraxial ray through ABCD system",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.2,fontSize:8,bold:true,color:C.purple,fontFace:"Calibri",align:"center"});
  // Simple ABCD system diagram
  const elems=[{x:0.5,col:C.teal},{x:1.55,col:C.gold},{x:2.6,col:C.teal},{x:3.6,col:C.red}];
  const ly=oy+dh/2;
  s.addShape(pres.shapes.LINE,{x:ox+0.18,y:ly,w:dw-0.36,h:0,line:{color:C.muted,width:0.8,dashType:"dash"}});
  elems.forEach(e=>{
    s.addShape(pres.shapes.RECTANGLE,{x:ox+e.x,y:ly-0.35,w:0.12,h:0.7,fill:{color:e.col,transparency:40},line:{color:e.col,width:1}});
  });
  s.addShape(pres.shapes.OVAL,{x:ox+0.18,y:ly-0.07,w:0.14,h:0.14,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addShape(pres.shapes.OVAL,{x:ox+dw-0.32,y:ly-0.07,w:0.14,h:0.14,fill:{color:C.accent1},line:{color:C.accent1,width:0}});
  s.addText("x₁",{x:ox+0.06,y:ly+0.06,w:0.3,h:0.2,fontSize:9,color:C.gold,fontFace:"Georgia",bold:true});
  s.addText("x₂",{x:ox+dw-0.28,y:ly+0.06,w:0.3,h:0.2,fontSize:9,color:C.accent1,fontFace:"Georgia",bold:true});
  s.addText("[A B; C D]",{x:ox+1.0,y:oy+dh-0.3,w:2.0,h:0.22,fontSize:9,color:C.purple,fontFace:"Consolas",align:"center"});
  s.addText("OPL = (Ax₁²−2x₁x₂+Dx₂²)/(2B)",{x:ox+0.12,y:oy+0.3,w:dw-0.24,h:0.22,fontSize:9,color:C.gold,fontFace:"Consolas",align:"center"});

  panel(s,pres,5.1,4.18,4.55,1.22,C.purple); hdr(s,pres,5.1,4.18,4.55,C.purple,"Special cases of Collins integral");
  bul(s,["B=0: imaging condition — Collins kernel → δ(x₂−Ax₁) (magnified image)",
         "A=D=0, B=f: Fourier transform — lens at focal plane",
         "Free space d: A=D=1, B=d, C=0 → Fresnel kernel",
         "Thin lens f: A=D=1, B=0, C=−1/f → quadratic phase screen"],
    5.18,4.5,4.37,0.82,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 6 — Thin lens as a phase screen propagator
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Thin Lens as a Quadratic Phase Screen","PROPAGATORS · THIN LENS");
  txt(s,"A thin lens imparts a quadratic phase to the field — it does not propagate the field spatially, it multiplies it by a phase factor that converts a plane wave into a converging spherical wave.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pi_thin_lens_prop",0.35,1.73,9.3,0.72);

  // Path-integral picture of lens focusing
  const ox=0.38,oy=2.55,dw=9.25,dh=2.0;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.gold,width:1}});
  s.addText("Why the lens phase screen focuses: path-integral picture",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.22,fontSize:9,bold:true,color:C.gold,fontFace:"Calibri",align:"center"});
  const ay2=oy+dh/2+0.12;
  const lx=ox+dw/2;
  // Lens body
  for(let y=-0.55;y<=0.56;y+=0.12){
    s.addShape(pres.shapes.RECTANGLE,{x:lx-0.06,y:ay2+y,w:0.12,h:0.08,fill:{color:C.gold,transparency:30},line:{color:C.gold,width:0}});
  }
  s.addShape(pres.shapes.LINE,{x:ox+0.18,y:ay2,w:dw-0.36,h:0,line:{color:C.muted,width:0.8,dashType:"dash"}});
  // Incoming parallel rays
  const heights=[-0.48,-0.28,0,0.28,0.48];
  const focalX=ox+dw-0.55;
  heights.forEach(h=>{
    // Ray from left at height h
    s.addShape(pres.shapes.LINE,{x:ox+0.25,y:ay2+h,w:lx-ox-0.25,h:0,line:{color:C.accent1,width:1.8}});
    // Ray converges to focal point after lens
    s.addShape(pres.shapes.LINE,{x:lx,y:ay2+h,w:focalX-lx,h:-h,line:{color:C.teal,width:1.8}});
  });
  s.addShape(pres.shapes.OVAL,{x:focalX-0.08,y:ay2-0.08,w:0.16,h:0.16,fill:{color:C.red},line:{color:C.red,width:0}});
  s.addText("F (focal point)",{x:focalX+0.06,y:ay2-0.14,w:1.0,h:0.28,fontSize:9,color:C.red,fontFace:"Calibri"});
  // OPL labels
  s.addText("OPL via edge = longer geometric path, thinner glass → shorter glass OPL → equal total OPL",{x:ox+0.15,y:oy+dh-0.35,w:dw-0.3,h:0.28,fontSize:9,color:C.gold,fontFace:"Calibri",italic:true,align:"center"});

  panel(s,pres,0.35,4.62,4.55,0.78,C.teal); hdr(s,pres,0.35,4.62,4.55,C.teal,"Free space + lens + free space = imaging");
  txt(s,"K_system = K_free(d₂) · K_lens(f) · K_free(d₁)\nResult: imaging when 1/d₁ + 1/d₂ = 1/f  (thin lens formula — derived from propagator convolution)",
    0.43,4.9,4.37,0.42,{fs:10.5,col:C.offwhite,font:"Consolas"});

  panel(s,pres,5.1,4.62,4.55,0.78,C.gold); hdr(s,pres,5.1,4.62,4.55,C.gold,"Lens as Fourier transform (object at front focal plane)");
  txt(s,"d₁=f: K_system = K_free(f) · K_lens(f) · K_free(f)\nOutput field at back focal plane ∝ FT{U_in(x₁)} at spatial frequency x₂/(λf)",
    5.18,4.9,4.37,0.42,{fs:10.5,col:C.offwhite,font:"Consolas"});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 7 — Feynman diagram approach to reflection
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Feynman Diagrams for Optics I: Mirror Reflection","FEYNMAN DIAGRAMS · REFLECTION");
  txt(s,"A Feynman diagram represents one class of paths. For mirror reflection: integrate the propagator product K(B,Q)·r(Q)·K(Q,A) over all possible reflection points Q on the mirror surface. Stationary phase selects the specular point.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"fd_amplitude",          0.35,1.78,9.3,0.68);
  fImg(s,"fd_reflection_integral",0.35,2.52,9.3,0.78);

  // Mirror reflection diagram
  const ox=0.38,oy=3.4,dw=4.35,dh=2.0;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.amber,width:1}});
  s.addText("All reflection points Q (Feynman)",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.2,fontSize:8,bold:true,color:C.amber,fontFace:"Calibri",align:"center"});
  const miy=oy+dh-0.32;
  s.addShape(pres.shapes.LINE,{x:ox+0.12,y:miy,w:dw-0.24,h:0,line:{color:C.amber,width:2.5}});
  s.addShape(pres.shapes.RECTANGLE,{x:ox+0.12,y:miy,w:dw-0.24,h:0.2,fill:{color:C.amber,transparency:82},line:{color:C.amber,width:0}});
  const srcX2=ox+0.55, srcY2=oy+0.45, obsX=ox+3.65, obsY=oy+0.55;
  s.addShape(pres.shapes.OVAL,{x:srcX2-0.07,y:srcY2-0.07,w:0.14,h:0.14,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addShape(pres.shapes.OVAL,{x:obsX-0.07,y:obsY-0.07,w:0.14,h:0.14,fill:{color:C.green},line:{color:C.green,width:0}});
  s.addText("A",{x:srcX2-0.22,y:srcY2-0.1,w:0.2,h:0.2,fontSize:9,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addText("B",{x:obsX+0.04,y:obsY-0.1,w:0.2,h:0.2,fontSize:9,bold:true,color:C.green,fontFace:"Georgia"});
  // Many Q points with rays
  const Qpoints=[0.28,0.65,1.05,1.45,1.85,2.25,2.65,3.05];
  const specI=3;
  Qpoints.forEach((qx,i)=>{
    const qX=ox+qx+0.18, qY=miy;
    const alpha=i===specI?0:50+Math.abs(i-specI)*8;
    const col=i===specI?C.red:C.muted;
    const w=i===specI?2:1;
    s.addShape(pres.shapes.LINE,{x:srcX2,y:srcY2,w:qX-srcX2,h:qY-srcY2,line:{color:col,width:w,transparency:alpha}});
    s.addShape(pres.shapes.LINE,{x:qX,y:qY,w:obsX-qX,h:obsY-qY,line:{color:col,width:w,transparency:alpha}});
    s.addShape(pres.shapes.OVAL,{x:qX-0.04,y:qY-0.04,w:0.08,h:0.08,fill:{color:col,transparency:alpha},line:{color:col,width:0}});
  });
  s.addText("Q₀ (specular,\nstationary OPL)",{x:ox+Qpoints[specI]+0.02,y:miy-0.52,w:1.1,h:0.42,fontSize:8,color:C.red,fontFace:"Calibri",align:"center"});
  s.addText("All Q integrate\n→ stationary phase",{x:ox+0.12,y:oy+dh-0.6,w:2.5,h:0.35,fontSize:8.5,color:C.muted,italic:true,fontFace:"Calibri"});

  panel(s,pres,4.93,3.4,4.72,2.0,C.amber); hdr(s,pres,4.93,3.4,4.72,C.amber,"Result of stationary-phase analysis");
  bul(s,["Path OPL(Q) = |Q−A|+|Q−B| is stationary at Q=Q₀ where θᵢ=θᵣ",
         "Stationary-phase integral → amplitude r(Q₀)·K(B,Q₀)·K(Q₀,A)",
         "Law of reflection DERIVED — not assumed",
         "Non-specular paths contribute corrections of order (λ/L) — the Goos-Hänchen shift",
         "At grazing incidence: many Q contribute → diffuse scattering from rough surfaces",
         "This is exactly how Feynman explains reflection in his book QED (1985)"],
    5.01,3.72,4.55,1.58,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 8 — Feynman diagrams: refraction, double slit
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Feynman Diagrams for Optics II: Refraction & Double Slit","FEYNMAN DIAGRAMS");
  txt(s,"The same path-integral machinery gives Snell's law for refraction and the double-slit interference pattern — both as consequences of the same principle: sum exp(ik₀·OPL) over all paths.",
      0.35,1.12,9.3,0.52,{fs:12});
  fImg(s,"fd_refraction_integral",0.35,1.7,9.3,0.75);
  fImg(s,"fd_double_slit",        0.35,2.51,9.3,0.68);

  // Double slit diagram
  const ox=0.38,oy=3.28,dw=4.35,dh=2.12;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.accent1,width:1}});
  s.addText("Double slit: two Feynman paths",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.2,fontSize:8,bold:true,color:C.accent1,fontFace:"Calibri",align:"center"});
  const cy2=oy+dh/2;
  // Source
  s.addShape(pres.shapes.OVAL,{x:ox+0.22,y:cy2-0.07,w:0.14,h:0.14,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("S",{x:ox+0.18,y:cy2+0.06,w:0.22,h:0.2,fontSize:8,bold:true,color:C.gold,fontFace:"Georgia"});
  // Slit screen
  const slitX=ox+1.75;
  s.addShape(pres.shapes.RECTANGLE,{x:slitX,y:oy+0.3,w:0.1,h:0.6,fill:{color:C.offwhite,transparency:20},line:{color:C.offwhite,width:0}});
  s.addShape(pres.shapes.RECTANGLE,{x:slitX,y:oy+1.1,w:0.1,h:0.6,fill:{color:C.offwhite,transparency:20},line:{color:C.offwhite,width:0}});
  const s1Y=oy+0.98, s2Y=oy+1.72;
  s.addShape(pres.shapes.OVAL,{x:slitX-0.03,y:s1Y-0.06,w:0.12,h:0.12,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addShape(pres.shapes.OVAL,{x:slitX-0.03,y:s2Y-0.06,w:0.12,h:0.12,fill:{color:C.purple},line:{color:C.purple,width:0}});
  s.addText("S₁",{x:slitX+0.1,y:s1Y-0.08,w:0.3,h:0.2,fontSize:8,color:C.teal,fontFace:"Georgia"});
  s.addText("S₂",{x:slitX+0.1,y:s2Y-0.08,w:0.3,h:0.2,fontSize:8,color:C.purple,fontFace:"Georgia"});
  // Path 1 and 2 to observation point P
  const pX=ox+dw-0.35, pY=cy2-0.2;
  s.addShape(pres.shapes.OVAL,{x:pX-0.07,y:pY-0.07,w:0.14,h:0.14,fill:{color:C.green},line:{color:C.green,width:0}});
  s.addText("P",{x:pX+0.06,y:pY-0.06,w:0.2,h:0.2,fontSize:8,bold:true,color:C.green,fontFace:"Georgia"});
  s.addShape(pres.shapes.LINE,{x:ox+0.36,y:cy2,w:slitX-ox-0.36,h:s1Y-cy2,line:{color:C.teal,width:1.8}});
  s.addShape(pres.shapes.LINE,{x:slitX+0.08,y:s1Y,w:pX-slitX-0.08,h:pY-s1Y,line:{color:C.teal,width:1.8}});
  s.addShape(pres.shapes.LINE,{x:ox+0.36,y:cy2,w:slitX-ox-0.36,h:s2Y-cy2,line:{color:C.purple,width:1.8}});
  s.addShape(pres.shapes.LINE,{x:slitX+0.08,y:s2Y,w:pX-slitX-0.08,h:pY-s2Y,line:{color:C.purple,width:1.8}});
  s.addText("K₁",{x:slitX+0.35,y:pY-0.62,w:0.3,h:0.2,fontSize:8,color:C.teal,fontFace:"Georgia"});
  s.addText("K₂",{x:slitX+0.35,y:pY+0.18,w:0.3,h:0.2,fontSize:8,color:C.purple,fontFace:"Georgia"});
  s.addText("U=K₁+K₂\nI=|K₁+K₂|²",{x:ox+0.12,y:oy+dh-0.48,w:dw-0.24,h:0.4,fontSize:9,color:C.offwhite,fontFace:"Consolas",align:"center"});

  panel(s,pres,4.93,3.28,4.72,2.12,C.teal); hdr(s,pres,4.93,3.28,4.72,C.teal,"Refraction and double slit from one principle");
  bul(s,["Refraction: integrate K(B,Q)·t(Q)·K(Q,A) over interface. Stationary phase at Q₀ gives n₁sinθ₁=n₂sinθ₂ — Snell's law derived",
         "t(Q) = Fresnel transmission coefficient (amplitude and phase from Maxwell boundary conditions)",
         "Double slit: two discrete paths S₁ and S₂. No integral needed — only two terms",
         "I(P) = |K₁+K₂|² = I₁+I₂+2√(I₁I₂)cos(Δφ) — standard interference",
         "Δφ = k₀(OPL₂−OPL₁) = k₀d sinθ → fringes at sinθ = mλ/d ✓"],
    5.01,3.6,4.55,1.72,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 9 — Fresnel zones from the path integral
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Fresnel Zones as Path-Integral Grouping","PROPAGATORS · FRESNEL ZONES");
  txt(s,"Fresnel zones are the natural partition of the path integral: each zone is the annular region of the wavefront whose OPL to the observation point P lies within one half-wavelength of the previous zone. Adjacent zones contribute opposite-sign amplitudes.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"pi_fresnel_zones",0.35,1.78,9.3,0.72);
  fImg(s,"pi_zone_cancel",  0.35,2.56,9.3,0.68);
  fImg(s,"pi_zone_plate",   0.35,3.3, 9.3,0.72);

  panel(s,pres,0.35,4.1,4.55,1.28,C.teal); hdr(s,pres,0.35,4.1,4.55,C.teal,"Zone radii and Fresnel number");
  bul(s,["Zone m radius: rₘ = √(mλz)  (from OPL = z+mλ/2)",
         "Area of each zone ≈ πλz = const (zones have equal area!)",
         "Fresnel number N_F = a²/(λz): number of zones in aperture of radius a",
         "N_F ≫ 1: many zones cancel → geometric shadow (ray optics regime)",
         "N_F ~ 1: ~1 zone → strong diffraction → maximum on-axis intensity"],
    0.43,4.4,4.37,0.9,10.5);

  panel(s,pres,5.1,4.1,4.55,1.28,C.gold); hdr(s,pres,5.1,4.1,4.55,C.gold,"Zone plate: constructive interference by design");
  bul(s,["Block all even zones: odd zones add constructively → focus!",
         "Zone plate focal length: f = r₁²/λ  (r₁ = radius of first zone)",
         "Zone plate has multiple foci: f, f/3, f/5, ... (higher diffraction orders)",
         "X-ray zone plates: only focusing element for hard X-rays (lenses don't work)"],
    5.18,4.4,4.37,0.9,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 10 — Babinet's principle
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Babinet's Principle and the Semiclassical Propagator","PROPAGATORS · BABINET & WKB");
  txt(s,"Babinet's principle follows immediately from the linearity of the path integral. The semiclassical propagator generalises beyond the single-ray Fermat limit, capturing interference between multiple classical paths.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pi_babinet",     0.35,1.73,9.3,0.72);
  fImg(s,"sp_semiclassical",0.35,2.51,9.3,0.82);

  panel(s,pres,0.35,3.42,4.55,1.32,C.red); hdr(s,pres,0.35,3.42,4.55,C.red,"Babinet's principle derivation");
  bul(s,["Path integral over aperture + path integral over obstacle = path integral over free plane",
         "U_aperture(P) + U_obstacle(P) = U_free(P)",
         "Consequence: diffraction pattern of aperture and its complement are related",
         "At points where U_free=0 (dark fringes of free aperture): U_aperture = −U_obstacle"],
    0.43,3.72,4.37,0.94,10.5);

  panel(s,pres,5.1,3.42,4.55,1.32,C.amber); hdr(s,pres,5.1,3.42,4.55,C.amber,"Semiclassical propagator (WKB)");
  bul(s,["Beyond single Fermat ray: sum over ALL classical paths (multiple reflections, diffraction paths)",
         "van Vleck determinant |det ∂²S/∂x_A∂x_B|^½ = amplitude weight (encodes ray-tube spreading)",
         "Maslov index μ: counts caustic crossings (π/2 phase shift each)",
         "Breakdown at caustics: ray density → ∞, need full wave treatment",
         "Applications: ray-tracing in resonators, tunnelling, catastrophe optics"],
    5.18,3.72,4.37,0.94,10.5);

  panel(s,pres,0.35,4.82,9.3,0.62,C.mid); hdr(s,pres,0.35,4.82,9.3,C.purple,"The complete hierarchy: Path integral → Fermat → ABCD");
  txt(s,"Path integral K=∫D[r]exp(ik₀OPL)  ⟶  Stationary phase (k₀→∞)  ⟶  Fermat ray  ⟶  Paraxial (small angles)  ⟶  ABCD matrices\n        [Wave optics: all λ effects]              [Single ray, no diffraction]                      [Linear ray optics]",
    0.45,5.1,9.1,0.28,{fs:10,col:C.offwhite,font:"Consolas"});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 11 — The unifying picture
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Summary: Everything from One Principle","PROPAGATORS · SUMMARY");
  txt(s,"The optical path integral K = ∫D[r] exp(ik₀ OPL) is the most complete description of paraxial light propagation. All other results are approximations or special cases.",
      0.35,1.12,9.3,0.48,{fs:12});

  // Central hub
  const cx=5.0, cy=3.15;
  s.addShape(pres.shapes.OVAL,{x:cx-1.3,y:cy-0.55,w:2.6,h:1.1,fill:{color:C.green,transparency:10},line:{color:C.green,width:2.5},shadow:makeShadow()});
  s.addText("K = ∫D[r] e^{ik₀OPL}",{x:cx-1.22,y:cy-0.28,w:2.44,h:0.32,fontSize:11.5,bold:true,color:C.white,fontFace:"Consolas",align:"center"});
  s.addText("Optical Path Integral",{x:cx-1.22,y:cy+0.07,w:2.44,h:0.22,fontSize:9,color:C.accent3,fontFace:"Calibri",italic:true,align:"center"});

  const nodes=[
    {t:"Huygens–Fresnel",sub:"insert intermediate plane",x:1.5,y:1.5,c:C.teal},
    {t:"Fermat's Principle",sub:"stationary phase k₀→∞",x:5.0,y:1.38,c:C.amber},
    {t:"ABCD / Collins",sub:"paraxial + closed-form eval",x:8.5,y:1.5,c:C.purple},
    {t:"Lens = phase screen",sub:"quadratic OPL",x:1.5,y:4.78,c:C.gold},
    {t:"Fresnel / Babinet",sub:"zones, apertures",x:5.0,y:4.98,c:C.red},
    {t:"Semiclassical WKB",sub:"sum over classical paths",x:8.5,y:4.78,c:C.pink},
  ];
  nodes.forEach(n=>{
    const pw=2.15,ph=0.72;
    s.addShape(pres.shapes.RECTANGLE,{x:n.x-pw/2,y:n.y-ph/2,w:pw,h:ph,fill:{color:C.panel},line:{color:n.c,width:1.5},shadow:makeShadow()});
    s.addShape(pres.shapes.RECTANGLE,{x:n.x-pw/2,y:n.y-ph/2,w:pw,h:0.24,fill:{color:n.c},line:{color:n.c,width:0}});
    s.addText(n.t,{x:n.x-pw/2+0.06,y:n.y-ph/2+0.01,w:pw-0.12,h:0.22,fontSize:9,bold:true,color:C.dark,fontFace:"Calibri"});
    s.addText(n.sub,{x:n.x-pw/2+0.06,y:n.y-ph/2+0.28,w:pw-0.12,h:0.36,fontSize:9.5,color:C.accent3,fontFace:"Consolas"});
    // Line to centre
    const edgeX=n.x<cx?n.x+pw/2:n.x-pw/2;
    const edgeY=n.y<cy?n.y+ph/2:n.y-ph/2;
    const centEdgeX=n.x<cx?cx-1.3:n.x>cx?cx+1.3:cx;
    const centEdgeY=n.y<cy?cy-0.55:n.y>cy?cy+0.55:cy;
    s.addShape(pres.shapes.LINE,{x:Math.min(edgeX,centEdgeX),y:Math.min(edgeY,centEdgeY),
      w:Math.abs(centEdgeX-edgeX),h:Math.abs(centEdgeY-edgeY),
      line:{color:n.c,width:1.2,transparency:45}});
  });
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Propagators & Feynman: References, Problems & Projects","PROPAGATORS · REFERENCES",
  ["Feynman, QED: The Strange Theory of Light and Matter (1985) — Princeton. Chapter 1–2: the path-integral view of light, reflection, refraction, lenses — intuitive and non-technical.",
   "Hecht, Optics — Ch. 10: Fresnel diffraction; Ch. 4.4: Huygens–Fresnel principle.",
   "Born & Wolf, Principles of Optics — Ch. 8: Fresnel zones, Babinet, Kirchhoff integral.",
   "Saleh & Teich, Fundamentals of Photonics — Ch. 4.3: Fresnel diffraction and Collins integral."],
  ["Goodman, Introduction to Fourier Optics, 4th ed. — Ch. 3–5: scalar diffraction and the propagator viewpoint.",
   "Collins (1970) J. Opt. Soc. Am 60, 1168: original paper on the ABCD diffraction integral.",
   "Feynman & Hibbs, Quantum Mechanics and Path Integrals (1965) — Dover. Original path-integral formulation; optics analogy in Ch. 2.",
   "Berry & Upstill (1980) Prog. Optics 18, 257: catastrophe optics — semiclassical propagator at caustics.",
   "Siegman, Lasers — Ch. 16–17: Huygens' integral and ABCD propagation for Gaussian beams."],
  ["[BSc] Use the Fresnel zone formula rₘ=√(mλz) to find the radius of the 5th Fresnel zone for λ=633nm and z=1m. Verify that all zones have approximately equal area πλz.",
   "[BSc] Show that blocking odd Fresnel zones (keeping even zones) gives a zone plate with the same focal length f=r₁²/λ but a phase-shifted focus.",
   "[BSc] Using U=K₁+K₂ for a double slit with slit separation d, derive the fringe spacing Δy=λL/d at a screen distance L.",
   "[BSc] Apply Babinet's principle: if a circular disk of radius a produces diffraction pattern U_disk(P), what is U_aperture(P) for a circular hole of the same radius?",
   "[MSc] Evaluate the Collins integral for free space (A=D=1, B=z, C=0) applied to a Gaussian input U(x₁)=exp(−x₁²/w₀²). Show the output is a Gaussian beam and find w(z).",
   "[MSc] Apply stationary phase to the mirror reflection integral ∫K(B,Q)·K(Q,A)dQ. Show that the stationary point satisfies θᵢ=θᵣ, deriving the law of reflection.",
   "[MSc Project] Implement the Collins integral numerically in Python using the FFT (angular-spectrum method). Propagate a top-hat aperture field through 10cm of free space and compare with the analytical Fresnel pattern."]);

pres.writeFile({fileName:"/home/claude/lecture_04c_propagator_feynman.pptx"})
  .then(()=>console.log("✓ lecture_04c_propagator_feynman.pptx"))
  .catch(e=>console.error(e));
