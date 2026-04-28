// ═══════════════════════════════════════════════════════════════
//  LECTURE 04b: Maxwell's Equations → Waves → Eikonal → Hamilton-Jacobi
//  Inserted between ABCD Matrices (04) and Polarization Intro (05).
//  Run: node lecture_04b_maxwell_waves.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 04b: Maxwell, Waves & Eikonal","04b");

lectureTitleSlide(pres,"04b",
  "Maxwell's Equations, Waves & the Eikonal",
  "Wave Equation Derivation · Plane & Spherical Waves · Geometric Optics Limit · Wavefronts · Hamilton–Jacobi",
  C.accent1);

// ─────────────────────────────────────────────────────────────
//  SLIDE 1 — Maxwell's equations in matter
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Maxwell's Equations in Matter (Macroscopic, SI)","MAXWELL'S EQUATIONS");
  txt(s,"Maxwell (1865) unified electricity, magnetism, and optics into four coupled PDEs. In a macroscopic linear isotropic medium they take the form below — the starting point for all of electromagnetic optics.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"max_full",         0.35,1.73,9.3,0.78);
  fImg(s,"max_constitutive", 0.35,2.57,9.3,0.72);

  panel(s,pres,0.35,3.38,4.55,2.02,C.accent1); hdr(s,pres,0.35,3.38,4.55,C.accent1,"Physical meaning of each equation");
  bul(s,["∇·D = ρf  — Gauss's law: free charges are sources of electric displacement",
         "∇·B = 0   — no magnetic monopoles: B-field lines always close",
         "∇×E = −∂B/∂t  — Faraday: changing B induces E (basis of generators, transformers)",
         "∇×H = Jf + ∂D/∂t  — Ampère + Maxwell: currents and changing E produce H",
         "The ∂D/∂t term (displacement current) was Maxwell's addition — it predicts radiation"],
    0.43,3.68,4.37,1.64,10.5);

  panel(s,pres,5.1,3.38,4.55,2.02,C.gold); hdr(s,pres,5.1,3.38,4.55,C.gold,"In source-free non-magnetic optical media");
  bul(s,["ρf = 0, Jf = 0 (no free charges or currents in glass, air, fibre)",
         "μr ≈ 1 (optical frequencies: μ ≈ μ₀ for all dielectrics)",
         "So B = μ₀H, D = ε₀εr E = ε₀n²E",
         "These simplifications give the optical wave equations on the next slides",
         "n = √εr (for μr=1): refractive index from the dielectric function",
         "Complex n = n + iκ: κ is the extinction coefficient (absorption)"],
    5.18,3.68,4.37,1.64,10.5);
  fImg(s,"max_energy",0.35,5.46,9.3,0.18);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 2 — Deriving the wave equation
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Deriving the Vector Wave Equation","MAXWELL'S EQUATIONS · DERIVATION");
  txt(s,"Take the curl of Faraday's law, then substitute Ampère's law and the vector identity ∇×(∇×E) = ∇(∇·E) − ∇²E. In a uniform source-free medium ∇·E = 0:",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"max_wave_deriv",0.35,1.73,9.3,0.72);
  fImg(s,"max_wave_E",    0.35,2.51,9.3,0.82);
  fImg(s,"max_wave_scalar",0.35,3.39,9.3,0.78);

  panel(s,pres,0.35,4.25,4.55,1.12,C.teal); hdr(s,pres,0.35,4.25,4.55,C.teal,"Key steps of the derivation");
  bul(s,["∇×(∇×E) = −μ ∂/∂t (∇×H) = −μ ∂/∂t (∂D/∂t) = −με ∂²E/∂t²",
         "Use ∇×(∇×E) = ∇(∇·E) − ∇²E and ∇·E=0 in uniform medium",
         "Result: ∇²E = με ∂²E/∂t²   with   v² = 1/(με) = c²/n²"],
    0.43,4.55,4.37,0.74,10.5);

  panel(s,pres,5.1,4.25,4.55,1.12,C.gold); hdr(s,pres,5.1,4.25,4.55,C.gold,"Scalar approximation: when is it valid?");
  bul(s,["Each Cartesian component of E satisfies the scalar wave equation independently",
         "Valid when: n(r) varies slowly on scale λ (slowly-varying envelope / paraxial)",
         "Breaks down at: sharp interfaces, high-NA focusing (d ~ λ), sub-λ structures",
         "Polarization effects then require the full vector theory"],
    5.18,4.55,4.37,0.74,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 3 — Plane waves
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Plane Waves: The Elementary Solutions","PLANE WAVES");
  txt(s,"The simplest solution of the wave equation in a uniform medium is the monochromatic plane wave. Any solution can be written as a superposition of plane waves (Fourier / angular spectrum decomposition).",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pw_solution",      0.35,1.73,9.3,0.82);
  fImg(s,"pw_dispersion",    0.35,2.61,9.3,0.82);
  fImg(s,"pw_transversality",0.35,3.49,9.3,0.78);

  // Plane wave diagram
  const ox=0.38, oy=4.35, dw=4.35, dh=1.0;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.accent1,width:1}});
  s.addText("Plane wave geometry",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.2,fontSize:8,bold:true,color:C.accent1,fontFace:"Calibri",align:"center"});
  const ay=oy+dh/2;
  s.addShape(pres.shapes.LINE,{x:ox+0.18,y:ay,w:dw-0.36,h:0,line:{color:C.muted,width:1,dashType:"dash"}});
  // Wavefront planes (vertical lines)
  [1.0,2.2,3.3].forEach(xf=>{
    s.addShape(pres.shapes.LINE,{x:ox+xf,y:oy+0.28,w:0,h:dh-0.42,line:{color:C.teal,width:1.5,transparency:30}});
  });
  // k arrow
  s.addShape(pres.shapes.LINE,{x:ox+0.25,y:ay,w:dw-0.55,h:0,line:{color:C.gold,width:2.5}});
  s.addText("k",{x:ox+dw-0.42,y:ay-0.26,w:0.22,h:0.24,fontSize:12,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addText("λ",{x:ox+1.52,y:oy+0.06,w:0.25,h:0.2,fontSize:9,color:C.teal,fontFace:"Georgia"});
  // E arrows (vertical)
  [0.6,1.7,2.8].forEach(xf=>{
    s.addShape(pres.shapes.LINE,{x:ox+xf,y:ay-0.24,w:0,h:0.48,line:{color:C.accent1,width:1.8}});
  });
  s.addText("E⊥k, B⊥k, E⊥B",{x:ox+0.15,y:oy+dh-0.28,w:dw-0.3,h:0.22,fontSize:9,color:C.offwhite,fontFace:"Calibri",align:"center"});

  panel(s,pres,4.93,4.35,4.72,1.0,C.teal); hdr(s,pres,4.93,4.35,4.72,C.teal,"Phase vs group velocity — physical meaning");
  bul(s,["v_φ = ω/k = c/n: speed of phase fronts (wavefronts)","v_g = dω/dk: speed of pulse envelope, energy, information","In a non-dispersive medium: v_g = v_φ","Dispersion (n=n(ω)): v_g ≠ v_φ → pulse spreading in fibres"],
    5.01,4.65,4.55,0.62,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 4 — Angular spectrum superposition
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Angular Spectrum: Any Wave as a Sum of Plane Waves","PLANE WAVES · SUPERPOSITION");
  txt(s,"By Fourier's theorem, any solution of the wave equation in a uniform medium can be written as a continuous superposition of plane waves. This is the angular spectrum representation — the foundation of Fourier optics.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"pw_superposition",0.35,1.78,9.3,0.78);

  const cases=[
    {t:"Plane wave (single k)",c:C.accent1,
     eq:"Ẽ(k) = E₀ δ³(k−k₀)\n→ E(r,t) = E₀ exp(ik₀·r − iωt)\nInfinitely extended, perfectly coherent"},
    {t:"Gaussian beam",c:C.gold,
     eq:"Ẽ(k) = Gaussian in kₓ,kᵧ\n→ E(r,t) = Gaussian profile in x,y\nFinite waist w₀, divergence θ=λ/(πw₀)"},
    {t:"Spherical wave",c:C.green,
     eq:"Equal weight for all directions\nẼ(k̂) = const for |k|=nω/c\n→ u = (A/r)exp(ikr−iωt)"},
    {t:"Pulsed beam",c:C.purple,
     eq:"Ẽ(k,ω) also spread in ω\n→ finite temporal extent\nGroup velocity dispersion broadens it"},
  ];
  cases.forEach((c,i)=>{
    const x=0.35+(i%2)*4.85, y=2.68+Math.floor(i/2)*1.45;
    panel(s,pres,x,y,4.6,1.35,c.c); hdr(s,pres,x,y,4.6,c.c,c.t);
    txt(s,c.eq,x+0.1,y+0.32,4.38,0.96,{fs:10.5,col:C.offwhite,font:"Consolas"});
  });
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.46,w:9.3,h:0.18,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"The angular spectrum + transfer function H(kₓ,kᵧ;z) = exp(ikzz) gives exact free-space propagation (no paraxial approximation). Paraxial limit: kz ≈ k − (kₓ²+kᵧ²)/2k → Fresnel propagator.",
    0.45,5.48,9.1,0.16,{fs:8.5,col:C.muted,italic:true});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 5 — Spherical waves
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Spherical Waves: Point Sources and Green's Functions","SPHERICAL WAVES");
  txt(s,"A point source radiates energy equally in all directions, producing spherical wavefronts. The spherical wave is the fundamental building block of Huygens' construction and the Kirchhoff diffraction integral.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"sw_solution",      0.35,1.73,9.3,0.82);
  fImg(s,"sw_phase_surfaces",0.35,2.61,9.3,0.72);
  fImg(s,"sw_green",         0.35,3.39,9.3,0.72);

  // Spherical wave diagram
  const ox=0.38,oy=4.18,dw=4.35,dh=1.18;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.green,width:1}});
  s.addText("Spherical wavefronts expanding from point source",{x:ox+0.08,y:oy+0.06,w:dw-0.16,h:0.2,fontSize:8,bold:true,color:C.green,fontFace:"Calibri",align:"center"});
  const cx=ox+0.55, cy=oy+dh/2;
  s.addShape(pres.shapes.OVAL,{x:cx-0.07,y:cy-0.07,w:0.14,h:0.14,fill:{color:C.gold},line:{color:C.gold,width:0}});
  s.addText("S",{x:cx-0.12,y:cy+0.05,w:0.22,h:0.2,fontSize:9,bold:true,color:C.gold,fontFace:"Georgia"});
  [0.45,0.85,1.25,1.65].forEach((r,i)=>{
    const alpha=80-i*15;
    s.addShape(pres.shapes.OVAL,{x:cx-r,y:cy-r*0.55,w:2*r,h:2*r*0.55,fill:{color:"0A1628",transparency:0},line:{color:C.green,width:1.5,transparency:alpha}});
  });
  // Ray arrows
  [0,-30,30,-60,60].forEach(deg=>{
    const rad=deg*Math.PI/180, len=1.4;
    s.addShape(pres.shapes.LINE,{x:cx,y:cy,w:len*Math.cos(rad),h:-len*Math.sin(rad),line:{color:C.accent1,width:1.2,transparency:30}});
  });
  s.addText("A/r · exp(ikr)",{x:cx+0.6,y:oy+dh-0.3,w:1.6,h:0.22,fontSize:9,color:C.green,fontFace:"Consolas"});

  panel(s,pres,4.93,4.18,4.72,1.18,C.teal); hdr(s,pres,4.93,4.18,4.72,C.teal,"Connecting to Huygens and diffraction");
  bul(s,["Every point on a wavefront acts as a secondary point source → emits a spherical wavelet (amplitude ∝ A/r exp(ikr))",
         "Huygens' envelope = superposition of all wavelets → next wavefront",
         "Kirchhoff integral = rigorous version: ∫G(r,r') ∂E/∂n dS → diffraction formula",
         "Collins integral generalises to ABCD systems (Lecture 09)"],
    5.01,4.5,4.55,0.78,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 6 — Eikonal ansatz: deriving geometric optics
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"From Wave Equation to Geometric Optics: The Eikonal Ansatz","EIKONAL · DERIVATION");
  txt(s,"When the wavelength λ is much smaller than all length scales of interest (variation of n, beam size, feature size), the wave equation reduces to geometric optics. This is the eikonal limit — made precise by the WKB / short-wave expansion.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"eikonal_ansatz",  0.35,1.78,9.3,0.72);
  fImg(s,"eikonal_expand",  0.35,2.56,9.3,0.72);

  // Order-by-order analysis panel
  const ords=[
    ["Order k₀² (leading)","−k₀²A|∇S|² + k₀²An² = 0\n→ |∇S|² = n²  (Eikonal equation)",C.gold],
    ["Order k₀¹","2ik₀(∇A·∇S) + ik₀A∇²S = 0\n→ ∇·(A²∇S) = 0  (Transport equation)",C.teal],
    ["Order k₀⁰","∇²A = 0  (wave corrections — diffraction)\nNeglected in geometric optics limit",C.muted],
  ];
  ords.forEach(([title,body,col],i)=>{
    const y=3.36+i*0.68;
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y,w:9.3,h:0.62,fill:{color:C.panel},line:{color:col,width:0.8}});
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y,w:1.8,h:0.62,fill:{color:col,transparency:i===2?50:0},line:{color:col,width:0}});
    s.addText(title,{x:0.42,y:y+0.08,w:1.65,h:0.46,fontSize:9,bold:true,color:C.dark,fontFace:"Calibri",align:"center"});
    txt(s,body,2.22,y+0.05,7.35,0.52,{fs:10,col:C.offwhite,font:"Consolas"});
  });
  fImg(s,"eikonal_validity",0.35,5.4,9.3,0.22);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 7 — Eikonal equation and Fermat's principle
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Eikonal Equation and Fermat's Principle","EIKONAL · FERMAT");
  txt(s,"The eikonal equation |∇S|²=n² is fully equivalent to Fermat's principle δ(OPL)=0. Both describe the same rays. The eikonal makes the connection to wave optics precise: S is the OPL from a reference wavefront.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"eikonal_eq",       0.35,1.73,9.3,0.68);
  fImg(s,"eikonal_transport",0.35,2.47,9.3,0.68);
  fImg(s,"fermat_euler_lagrange",0.35,3.21,9.3,0.78);

  panel(s,pres,0.35,4.08,4.55,1.3,C.purple); hdr(s,pres,0.35,4.08,4.55,C.purple,"Eikonal → Ray equation");
  bul(s,["Differentiate |∇S|²=n² along a ray: d/ds(∇S) = ∇n","Since ∇S = n dr/ds (ray direction scaled by n)","→ d/ds(n dr/ds) = ∇n  (Fermat/Euler-Lagrange ray equation ✓)","The eikonal equation is the Hamilton-Jacobi equation for light (next slide)"],
    0.43,4.38,4.37,0.92,10.5);

  panel(s,pres,5.1,4.08,4.55,1.3,C.gold); hdr(s,pres,5.1,4.08,4.55,C.gold,"Transport equation → energy conservation");
  bul(s,["∇·(A²∇S) = 0 means div of energy flux = 0","A²∇S is proportional to the Poynting vector ⟨S⟩","In a ray tube: A²n × (cross-section area) = const","Amplitude A decreases as the ray tube expands → 1/r for spherical wave ✓"],
    5.18,4.38,4.37,0.92,10.5);

  // Hierarchy diagram
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.45,w:9.3,h:0.17,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"Hierarchy: Maxwell (exact) ⊃ Scalar wave eq. (paraxial/slowly-varying n) ⊃ Helmholtz (monochromatic) ⊃ Eikonal (λ→0) = Fermat = Ray optics",
    0.45,5.47,9.1,0.14,{fs:8.5,col:C.muted,italic:true});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 8 — Wavefronts, phases, and singularities
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Wavefronts, Phases, and Phase Singularities","WAVEFRONTS · PHASES");
  txt(s,"A wavefront is a surface of constant phase. Rays are perpendicular to wavefronts. But phase is not always well-defined everywhere — wherever the amplitude vanishes, the phase is singular. These singularities are topologically protected.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"wavefront_def",    0.35,1.78,9.3,0.68);
  fImg(s,"wavefront_normal", 0.35,2.52,9.3,0.78);
  fImg(s,"phase_singularity",0.35,3.36,9.3,0.68);
  fImg(s,"phase_vortex",     0.35,4.1, 9.3,0.78);

  panel(s,pres,0.35,4.95,4.55,0.65,C.red); hdr(s,pres,0.35,4.95,4.55,C.red,"When is phase undefined?");
  bul(s,["Amplitude node: E(r)=0 → φ=arg(0) undefined","Dark fringe centres, beam vortices, speckle nulls","Phase winds by 2πm around each singularity (topological charge m)"],
    0.43,5.22,4.37,0.32,9.5);

  panel(s,pres,5.1,4.95,4.55,0.65,C.green); hdr(s,pres,5.1,4.95,4.55,C.green,"Optical vortices — applications");
  bul(s,["Laguerre-Gaussian beams: charge m carry orbital angular momentum mℏ/photon","STED microscopy uses donut beams (m=1) for sub-diffraction imaging","Optical tweezers: transfer OAM to trapped particles → rotation","Quantum information: vortex modes as high-dimensional qudit basis"],
    5.18,5.22,4.37,0.32,9.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 9 — Wavefronts, action, and wave vector
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Wavefronts as Surfaces of Constant Action","WAVEFRONTS · ACTION");
  txt(s,"The eikonal S(r) plays the role of action in mechanics. Surfaces S=const are wavefronts; ∇S gives the wave vector (optical momentum). This is the precise link between wave and geometric optics.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"action_optical",  0.35,1.73,9.3,0.78);
  fImg(s,"momentum_optical",0.35,2.57,9.3,0.68);

  panel(s,pres,0.35,3.35,4.55,2.02,C.amber); hdr(s,pres,0.35,3.35,4.55,C.amber,"Wave vector k and optical momentum");
  bul(s,["k = k₀∇S = (nω/c)ŝ  where ŝ is the ray direction unit vector",
         "k is perpendicular to wavefronts S=const (k·∇S surface tangent = 0)",
         "|k| = nω/c = nk₀  — larger in denser media (more oscillations per metre)",
         "Phase matching at interface: k_tangential continuous → Snell's law!",
         "k = ∇φ only if φ is a well-defined smooth function (no singularities)",
         "At singularities: k = ∇φ is undefined → ray picture breaks down"],
    0.43,3.65,4.37,1.64,10.5);

  panel(s,pres,5.1,3.35,4.55,2.02,C.teal); hdr(s,pres,5.1,3.35,4.55,C.teal,"Snell's law from phase matching");
  // Small diagram
  const ox=5.2,oy=3.68,dw=4.3,dh=1.28;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.teal,width:0.8}});
  const iy=oy+dh/2;
  s.addShape(pres.shapes.LINE,{x:ox+0.12,y:iy,w:dw-0.24,h:0,line:{color:C.gold,width:1.5}});
  s.addText("n₁",{x:ox+0.15,y:oy+0.1,w:0.35,h:0.25,fontSize:10,bold:true,color:C.accent1,fontFace:"Georgia"});
  s.addText("n₂",{x:ox+0.15,y:iy+0.08,w:0.35,h:0.25,fontSize:10,bold:true,color:C.teal,fontFace:"Georgia"});
  const cpx=ox+dw/2;
  // Incident and refracted rays
  const t1=35*Math.PI/180, t2=22.5*Math.PI/180;
  s.addShape(pres.shapes.LINE,{x:cpx-Math.sin(t1)*0.9,y:iy-Math.cos(t1)*0.9,w:Math.sin(t1)*0.9,h:Math.cos(t1)*0.9,line:{color:C.accent1,width:2}});
  s.addShape(pres.shapes.LINE,{x:cpx,y:iy,w:Math.sin(t2)*0.9,h:Math.cos(t2)*0.9,line:{color:C.teal,width:2}});
  // k_tangential arrows
  s.addShape(pres.shapes.LINE,{x:ox+0.55,y:iy-0.04,w:1.1,h:0,line:{color:C.gold,width:1.5}});
  s.addText("k_t continuous →",{x:ox+0.15,y:iy+0.28,w:2.5,h:0.22,fontSize:9,color:C.gold,fontFace:"Calibri"});
  s.addText("n₁sinθ₁ = n₂sinθ₂",{x:ox+0.15,y:iy+0.5,w:2.5,h:0.22,fontSize:9.5,bold:true,color:C.gold,fontFace:"Consolas"});

  txt(s,"At interface: tangential component of k must be continuous (boundary condition for E tangential).\n\nn₁k₀ sinθ₁ = n₂k₀ sinθ₂  →  n₁sinθ₁ = n₂sinθ₂  ✓\n\nSnell's law follows directly from phase matching of the wave vector!",
    ox+0.1,oy+dh+0.08,dw-0.2,0.95,{fs:10.5});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 10 — Hamilton-Jacobi equation
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Hamilton–Jacobi Equation for Light","HAMILTON–JACOBI");
  txt(s,"The eikonal equation |∇S|²=n² is the optical Hamilton–Jacobi equation. Hamilton's equations then give the ray equations — identical to Fermat's principle. Optics and classical mechanics are the same mathematical structure.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"hj_optical",  0.35,1.73,9.3,0.68);
  fImg(s,"hj_hamilton", 0.35,2.47,9.3,0.78);

  panel(s,pres,0.35,3.35,4.55,1.72,C.purple); hdr(s,pres,0.35,3.35,4.55,C.purple,"Hamiltonian structure of ray optics");
  bul(s,["Hamiltonian: H(r,p) = |p|² − n²(r) = 0 (on-shell constraint)",
         "Canonical position: r = (x,y,z)  Canonical momentum: p = n ŝ = ∇S",
         "Hamilton's equations: dr/dσ = ∂H/∂p = 2p,  dp/dσ = −∂H/∂r = ∇(n²)",
         "Reparametrising σ → s (arc length): dp/ds = ∇n  → Fermat ray eq. d(nŝ)/ds = ∇n ✓",
         "Snell's law: pₜ = n sinθ conserved across interface (∇n has no tangential component)"],
    0.43,3.65,4.37,1.34,10.5);

  panel(s,pres,5.1,3.35,4.55,1.72,C.gold); hdr(s,pres,5.1,3.35,4.55,C.gold,"Paraxial limit → ABCD matrices");
  bul(s,["Near optical axis: r=(x,y) small, p=(pₓ,pᵧ) small","Hamiltonian linearises: H ≈ p²/2n − (n−n₀)n₀  (paraxial)","Phase space: (y,p) = (y, n sinθ) ≈ (y, nθ) → symplectic 2D space","ABCD matrix: linear map on (y,nθ) — det=1 is Liouville's theorem!","Lagrange invariant nyθ = const ↔ phase-space area conservation"],
    5.18,3.65,4.37,1.34,10.5);

  fImg(s,"hj_mechanics",0.35,5.13,9.3,0.35);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 11 — Connection to quantum mechanics / WKB
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Deep Analogy: Optics ↔ Mechanics ↔ Quantum","HAMILTON–JACOBI · ANALOGY");
  txt(s,"The same mathematical passage — wave equation → eikonal / Hamilton-Jacobi — occurs in quantum mechanics (Schrödinger → classical mechanics, WKB approximation). Light waves are to ray optics as quantum waves are to classical mechanics.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"hj_schrodinger",0.35,1.78,9.3,0.78);
  fImg(s,"hj_mechanics",  0.35,2.62,9.3,0.8);

  // Analogy table
  const rows=[
    ["Domain","Wave equation","Short-wave limit","Action","Momentum","Particle/ray"],
    ["Optics","(∇²−n²/c²∂²/∂t²)u=0","λ→0 (high freq.)","S = OPL = ∫n ds","p = ∇S = nŝ","Ray: d(nŝ)/ds=∇n"],
    ["Mechanics","iℏ∂ψ/∂t = Ĥψ","ℏ→0 (WKB)","S = ∫p dq (action)","p = ∇S = mẋ","d(mẋ)/dt = −∇V"],
    ["de Broglie link","ψ~exp(iS/ℏ)","λ_dB = h/p","S same role","p = ℏk","particle follows ray"],
  ];
  const cW=[1.55,2.55,1.62,1.55,1.52,1.51], rH=0.46;
  const tx=0.35, ty=3.52;
  rows[0].forEach((h,j)=>{
    let cx=tx; for(let k=0;k<j;k++) cx+=cW[k];
    s.addShape(pres.shapes.RECTANGLE,{x:cx,y:ty,w:cW[j],h:0.28,fill:{color:C.purple},line:{color:C.purple,width:0}});
    s.addText(h,{x:cx+0.04,y:ty+0.02,w:cW[j]-0.08,h:0.24,fontSize:8.5,bold:true,color:C.white,fontFace:"Calibri"});
  });
  const rowCols=[C.accent1,C.teal,C.gold];
  rows.slice(1).forEach((row,i)=>{
    row.forEach((cell,j)=>{
      let cx=tx; for(let k=0;k<j;k++) cx+=cW[k];
      const ry=ty+0.28+i*rH;
      s.addShape(pres.shapes.RECTANGLE,{x:cx,y:ry,w:cW[j],h:rH-0.04,fill:{color:j===0?rowCols[i]:C.panel},line:{color:C.mid,width:0.4}});
      s.addText(cell,{x:cx+0.04,y:ry+0.04,w:cW[j]-0.08,h:rH-0.1,fontSize:j===0?9.5:9,bold:j===0,color:j===0?C.dark:C.offwhite,fontFace:j>=1?"Consolas":"Calibri"});
    });
  });

  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.48,w:9.3,h:0.15,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"Schrödinger's 1926 paper was motivated by the optical analogy: he wrote the wave equation for matter waves by reverse-engineering from the Hamilton-Jacobi equation, just as Maxwell's eq. reverse-engineers from the eikonal.",
    0.45,5.5,9.1,0.14,{fs:8.5,col:C.muted,italic:true});
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 12 — Summary: the hierarchy of optics theories
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"The Hierarchy of Optical Theories","SUMMARY");
  txt(s,"All the theories we have studied are nested approximations of Maxwell's equations, each valid when a particular small parameter (λ/L or 1/k₀) justifies dropping certain terms.",
      0.35,1.12,9.3,0.52,{fs:12});

  const levels=[
    {t:"Maxwell's Equations",sub:"Exact vector EM theory. Governs all light propagation.",tag:"Exact",c:C.red,
     detail:"Accounts for: diffraction, interference, polarization, near-field evanescent fields, photonic bandgap structures, sub-λ imaging."},
    {t:"Scalar Wave Equation",sub:"∇²u − (n²/c²)∂²u/∂t² = 0.  Drops polarization.",tag:"λ/L arbitrary",c:C.amber,
     detail:"Valid when: polarization unimportant, n(r) varies slowly on scale λ. Adds: full diffraction, coherence, Fourier optics (Lectures 08,09)."},
    {t:"Helmholtz Equation",sub:"∇²U + k²U = 0.  Monochromatic, time-separated.",tag:"Single freq.",c:C.gold,
     detail:"Valid when: monochromatic (single wavelength). All of scalar wave optics. Green's function → Kirchhoff, Fresnel, Fraunhofer integrals."},
    {t:"Eikonal / Geometric Optics",sub:"|∇S|² = n².  Rays, wavefronts, OPL.",tag:"λ → 0",c:C.teal,
     detail:"Valid when: λ ≪ all length scales. Gives: ray tracing, ABCD matrices, Fermat, imaging. Breaks down at: diffraction, singularities."},
    {t:"Paraxial / ABCD",sub:"Linear ray equations.  2×2 matrix calculus.",tag:"θ ≪ 1",c:C.accent1,
     detail:"Valid when: rays at small angles to optical axis. Gives: all of Lecture 04 (ABCD matrices), Gaussian beams (Lecture 07). Very widely used."},
  ];

  levels.forEach((lv,i)=>{
    const y=1.72+i*0.74;
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y,w:9.3,h:0.68,fill:{color:C.panel},line:{color:lv.c,width:1.2},shadow:makeShadow()});
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y,w:0.22,h:0.68,fill:{color:lv.c},line:{color:lv.c,width:0}});
    // Tag badge
    s.addShape(pres.shapes.RECTANGLE,{x:8.32,y:y+0.12,w:1.28,h:0.3,fill:{color:lv.c,transparency:20},line:{color:lv.c,width:0.8}});
    s.addText(lv.tag,{x:8.36,y:y+0.14,w:1.2,h:0.26,fontSize:9,bold:true,color:C.dark,fontFace:"Calibri",align:"center"});
    s.addText(lv.t,{x:0.65,y:y+0.04,w:7.55,h:0.28,fontSize:11.5,bold:true,color:C.white,fontFace:"Georgia"});
    s.addText(lv.detail,{x:0.65,y:y+0.34,w:7.55,h:0.3,fontSize:9.5,color:C.muted,fontFace:"Calibri",italic:true});
    // Arrow down
    if(i<levels.length-1){
      s.addShape(pres.shapes.LINE,{x:4.98,y:y+0.68,w:0,h:0.06,line:{color:lv.c,width:1.5,transparency:40}});
    }
  });
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Maxwell, Waves & Eikonal: References, Problems & Projects","MAXWELL · REFERENCES",
  ["Born & Wolf, Principles of Optics, 7th ed. — Ch. 1: Maxwell's equations, wave equations; Ch. 3.1: eikonal equation. The standard graduate reference.",
   "Saleh & Teich, Fundamentals of Photonics — Ch. 5.1–5.3: wave optics, plane waves, spherical waves.",
   "Hecht, Optics — Ch. 2: light as an EM wave; derivation of wave equation from Maxwell.",
   "Griffiths, Introduction to Electrodynamics — Ch. 9: EM waves. Excellent undergraduate treatment.",
   "Feynman Lectures Vol. II, Ch. 20–22: Maxwell's equations and their consequences."],
  ["Sommerfeld, Lectures on Theoretical Physics Vol. 4: Optics — Ch. 4: eikonal. Classic rigorous treatment.",
   "Luneburg, Mathematical Theory of Optics (1964): Hamiltonian optics, eikonal, full geometric optics theory.",
   "Arnold, Mathematical Methods of Classical Mechanics — App. 11: geometric optics and mechanics analogy.",
   "Berry & Mount (1972) Rep. Prog. Phys. 35, 315: semiclassical approximations (WKB) — optics and QM unified.",
   "Nye & Berry (1974) Proc. R. Soc. A 336, 165: original paper on wavefront dislocations (phase singularities)."],
  ["[BSc] Take the curl of Faraday's law ∇×E=−∂B/∂t, substitute Ampère, use the vector identity and ∇·E=0 to derive ∇²E = με∂²E/∂t². Show c=1/√(μ₀ε₀).",
   "[BSc] Verify that E=E₀exp(i(k·r−ωt)) satisfies the wave equation. Show the dispersion relation k²=n²ω²/c² and derive k·E=0 from ∇·E=0.",
   "[BSc] Show that u=A/r exp(ikr) satisfies the scalar wave equation ∇²u+k²u=0 for r≠0 by computing ∇²(1/r exp(ikr)) in spherical coordinates.",
   "[BSc] Substitute u=A(r)exp(ik₀S(r)) into the scalar wave equation and collect terms by powers of k₀ to derive the eikonal and transport equations.",
   "[MSc] Starting from the Hamilton–Jacobi equation H(r,∇S)=|∇S|²−n²=0, derive Hamilton's equations and show they reduce to d/ds(n dr/ds)=∇n.",
   "[MSc] Show that Snell's law n₁sinθ₁=n₂sinθ₂ follows from continuity of the tangential component of k=k₀∇S at a flat interface.",
   "[MSc Project] Implement a 2D eikonal solver (fast marching method) for a GRIN lens with n(r)=n₀(1−αr²/2). Plot the wavefront surfaces and overlay ray paths. Compare with the ABCD sinusoidal solution."]);

pres.writeFile({fileName:"/home/claude/lecture_04b_maxwell_waves.pptx"})
  .then(()=>console.log("✓ lecture_04b_maxwell_waves.pptx"))
  .catch(e=>console.error(e));
