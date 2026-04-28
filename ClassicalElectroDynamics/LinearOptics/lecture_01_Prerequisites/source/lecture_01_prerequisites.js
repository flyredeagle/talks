// ═══════════════════════════════════════════════════════════════
//  LECTURE 0: Senior High School Prerequisites
//  Run: node lecture_00_prerequisites.js
// ═══════════════════════════════════════════════════════════════
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 0: Prerequisites", 0);

// ── Title ──────────────────────────────────────────────────────
lectureTitleSlide(pres, "00",
  "Prerequisites for Senior High Schoolers",
  "Light, Refraction, Snell's Law, Matrices — Everything You Need Before the Course",
  C.green
);

// ── What is light? ─────────────────────────────────────────────
{
  const s = cSlide(pres,"What Is Light? Waves, Rays & Photons","PREREQUISITES");
  panel(s,pres,0.35,1.12,4.45,4.28,C.accent1); hdr(s,pres,0.35,1.12,4.45,C.accent1,"Wave Picture");
  bul(s,["Electromagnetic wave — oscillating E and B fields","Speed c = 1/√(ε₀μ₀) ≈ 3×10⁸ m/s in vacuum","Wavelength λ: crest-to-crest distance (visible: 380–740 nm)","Frequency ν: oscillations per second. Relation: c = λν","Polarization: direction of the E-field oscillation","Colour is determined by wavelength: red ~700 nm, blue ~450 nm"],0.43,1.44,4.27,2.2,10.5);
  fImg(s,"hs_wave_basic",0.43,3.68,4.27,0.95);
  panel(s,pres,5.0,1.12,4.65,4.28,C.gold); hdr(s,pres,5.0,1.12,4.65,C.gold,"The Ray Model & Photons");
  bul(s,["Light travels in straight lines (rays) when λ ≪ objects","Ray optics is the basis of lenses, mirrors, telescopes","Light is quantized into photons: energy E = hν","Wave-particle duality: single photons produce interference","Linear optics: photon number unchanged, only paths & phases altered"],5.08,1.44,4.42,2.0,10.5);
  fImg(s,"bsc_photon",5.08,3.42,4.42,0.85);
}

// ── Snell's Law diagram ────────────────────────────────────────
{
  const s = cSlide(pres,"Snell's Law: Refraction & Reflection — Detailed Diagram","PREREQUISITES");
  panel(s,pres,0.35,1.12,5.0,2.0,C.amber); hdr(s,pres,0.35,1.12,5.0,C.amber,"Law of Reflection");
  bul(s,["Angle of incidence θᵢ = angle of reflection θᵣ (from normal)","Incident ray, reflected ray, and normal are coplanar","θᵢ = θᵣ  for all smooth (specular) surfaces"],0.43,1.44,4.82,1.58,10.5);
  panel(s,pres,0.35,3.22,5.0,2.15,C.green); hdr(s,pres,0.35,3.22,5.0,C.green,"Snell's Law of Refraction");
  bul(s,["Light bends when crossing a boundary between two media","n₂ > n₁: beam bends toward normal (e.g. air → glass)","n₂ < n₁: beam bends away (e.g. glass → air)","θ₁ > θc = arcsin(n₂/n₁): Total Internal Reflection (TIR)"],0.43,3.54,4.82,1.75,10.5);
  fImg(s,"hs_snell",0.43,5.1,4.82,0.45);
  dImg(s,"snell_detailed",5.5,1.12,4.15,4.25);
}

// ── TIR numerical example ──────────────────────────────────────
{
  const s = cSlide(pres,"Snell's Law: Numerical Example & Total Internal Reflection","PREREQUISITES");
  fImg(s,"hs_snell",0.35,1.12,5.3,0.65);
  panel(s,pres,0.35,1.85,5.3,1.4,C.teal); hdr(s,pres,0.35,1.85,5.3,C.teal,"Step-by-step: air → glass (n₁=1.0, n₂=1.5, θ₁=30°)");
  bul(s,["1. Write Snell's law: n₁ sinθ₁ = n₂ sinθ₂","2. Substitute: (1.0)×sin(30°) = (1.5)×sinθ₂","3. sin(30°)=0.5, so sinθ₂ = 0.5/1.5 = 0.333","4. θ₂ = arcsin(0.333) ≈ 19.5° — beam bends toward normal ✓"],0.43,2.17,5.12,1.0,10.5);
  panel(s,pres,0.35,3.32,5.3,1.42,C.red); hdr(s,pres,0.35,3.32,5.3,C.red,"Total Internal Reflection (TIR)");
  txt(s,"When n₁ > n₂ there is a critical angle θc = arcsin(n₂/n₁). For θ₁ > θc, NO refracted ray exists — all light reflects. This is the basis of optical fibers.",0.43,3.64,5.12,0.95,{fs:11});
  fImg(s,"hs_tir",0.43,4.64,5.12,0.62);
  panel(s,pres,5.85,1.12,3.8,4.25,C.panel); hdr(s,pres,5.85,1.12,3.8,C.accent1,"TIR — Fibre Optic Principle");
  bul(s,["Glass core n₁=1.46, cladding n₂=1.44","θc = arcsin(1.44/1.46) = 80.5°","Light launched within acceptance cone totally internally reflects","Propagates km with <0.2 dB/km loss (single-mode fibre)","Basis of global internet infrastructure"],5.93,1.44,3.62,2.7,10.5);
  fImg(s,"hs_reflection",5.93,4.18,3.62,0.62);
}

// ── Matrices intro ─────────────────────────────────────────────
{
  const s = cSlide(pres,"Introduction to Matrices: From Linear Equations to ABCD","PREREQUISITES");
  txt(s,"A matrix is a rectangular array of numbers. Multiplying a 2×2 matrix by a 2-vector transforms one vector into another — exactly what an optical element does to a ray.",0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"hs_matrix_def",0.35,1.73,5.3,1.05);
  panel(s,pres,0.35,2.88,5.3,1.75,C.gold); hdr(s,pres,0.35,2.88,5.3,C.gold,"Step-by-step rule for 2×2 × 2-vector");
  bul(s,["Top output:    y₂ = A·y₁ + B·θ₁  (top row dotted with input vector)","Bottom output: θ₂ = C·y₁ + D·θ₁  (bottom row dotted with input)","Each output is a weighted sum — this is a linear map","System of N elements: multiply matrices right-to-left"],0.43,3.18,5.12,1.38,10.5);
  fImg(s,"hs_cascade",0.35,4.7,5.3,0.6);
  panel(s,pres,5.85,1.12,3.8,4.28,C.teal); hdr(s,pres,5.85,1.12,3.8,C.teal,"Worked Example: Air → Glass");
  txt(s,"n₁=1.0, n₂=1.5, ray: y₁=2mm, θ₁=0.1 rad",5.93,1.44,3.62,0.38,{fs:10.5,col:C.gold,bold:true});
  fImg(s,"hs_interface_matrix",5.88,1.86,3.65,0.88);
  bul(s,["y₂ = 1·2.0 + 0·0.1 = 2.0 mm  (height unchanged)","θ₂ = 0·2.0 + 0.667·0.1 = 0.0667 rad","Bends toward normal ✓  (0.1 → 0.067 rad)","Check: sin(0.1)≈0.1, ×(1.0/1.5) = 0.067 ✓"],5.93,2.82,3.62,1.55,10.5);
  fImg(s,"hs_lens_matrix",5.88,4.42,3.65,0.75);
}

// ── Matrix multiplication by hand ─────────────────────────────
{
  const s = cSlide(pres,"Matrix Multiplication & Cascading Two Elements","PREREQUISITES");
  fImg(s,"hs_matrix_def",0.35,1.12,5.5,1.0);
  panel(s,pres,0.35,2.22,5.5,1.68,C.gold); hdr(s,pres,0.35,2.22,5.5,C.gold,"Thin lens example: f=100mm, y₁=5mm, θ₁=0 rad");
  bul(s,["Lens matrix: M = [1,0; -1/f, 1] = [1,0; -0.01, 1]","Top:    y₂ = 1×5 + 0×0 = 5.0 mm  (height unchanged)","Bottom: θ₂ = -0.01×5 + 1×0 = -0.05 rad  (tilted toward axis)","After 100mm free space: y = 5 + (-0.05)×100 = 0 → focused! ✓"],0.43,2.52,5.32,1.3,10.5);
  panel(s,pres,0.35,3.98,5.5,1.62,C.teal); hdr(s,pres,0.35,3.98,5.5,C.teal,"Cascading: 50mm free space then lens f=100mm");
  fImg(s,"hs_cascade",0.43,4.3,5.3,0.55);
  txt(s,"M = M_lens × M_free = [1,0;-0.01,1] × [1,50;0,1] = [1,50;-0.01,0.5]  ← one matrix replaces both elements",0.43,4.9,5.3,0.6,{fs:10.5,col:C.accent3,font:"Consolas"});
  panel(s,pres,6.0,1.12,3.65,4.48,C.panel); hdr(s,pres,6.0,1.12,3.65,C.accent1,"Why matrices are powerful");
  bul(s,["Each optical element → one 2×2 matrix","Any number of elements → one matrix product","Trace a ray through a telescope with one multiply","This is the ABCD (Ray Transfer Matrix) method","Covered in full depth in Lecture 2"],6.08,1.44,3.47,2.5,10.5);
  fImg(s,"abcd_freespace",6.08,3.98,3.47,0.85);
}

// ── Reading list ───────────────────────────────────────────────
{
  const s = cSlide(pres,"High School Reading List & Resources","PREREQUISITES");
  const books=[
    {t:"Feynman Lectures on Physics, Vol. I — Ch. 26–36",sub:"Optics, reflection, refraction, diffraction, interference. Free at feynmanlectures.caltech.edu",c:C.gold},
    {t:"Hecht, Optics (5th ed.) — Chapters 1–4",sub:"Nature of light, reflection, refraction, basic wave optics. The standard BSc optics text with excellent diagrams.",c:C.accent1},
    {t:"Jenkins & White, Fundamentals of Optics — Ch. 1–3",sub:"Classic clear introduction to ray optics and laws of reflection/refraction.",c:C.teal},
    {t:"Halliday, Resnick & Walker, Physics — Ch. 33–36",sub:"EM waves, reflection, refraction, interference, diffraction. Standard pre-university text.",c:C.green},
  ];
  books.forEach((b,i)=>{
    const y=1.12+i*1.08;
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y,w:9.3,h:0.98,fill:{color:C.panel},line:{color:b.c,width:0.8}});
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y,w:0.22,h:0.98,fill:{color:b.c},line:{color:b.c,width:0}});
    s.addText(b.t,{x:0.65,y:y+0.05,w:8.55,h:0.32,fontSize:12,bold:true,color:C.white,fontFace:"Georgia"});
    s.addText(b.sub,{x:0.65,y:y+0.4,w:8.55,h:0.52,fontSize:10.5,color:C.muted,fontFace:"Calibri",italic:true});
  });
  txt(s,"Online: PhET 'Bending Light' & 'Wave Interference' (phet.colorado.edu)  ·  Khan Academy: Geometric Optics unit",0.5,5.45,9.1,0.18,{fs:9,col:C.muted,italic:true});
}

pres.writeFile({fileName:"/home/claude/lecture_00_prerequisites.pptx"})
  .then(()=>console.log("✓ lecture_00_prerequisites.pptx"))
  .catch(e=>console.error(e));
