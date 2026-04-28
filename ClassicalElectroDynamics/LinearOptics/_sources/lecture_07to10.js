// ═══════════════════════════════════════════════════════════════
//  LECTURES 4–7: Gaussian Beams, Fourier Optics, Diffraction, Mueller
//  Run: node lecture_04_gaussian.js  (etc.)
// ═══════════════════════════════════════════════════════════════
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;
const pptxgen = require("pptxgenjs");

// ═════════════════════════════════════════════════════════════════
//  LECTURE 4: GAUSSIAN BEAMS
// ═════════════════════════════════════════════════════════════════
{
const pres = newPres("Linear Optics — Lecture 4: Gaussian Beams",4);
lectureTitleSlide(pres,"04","Gaussian Beams & Beam Optics",
  "Complex q-Parameter · ABCD Kogelnik Law · Focused Beam Worked Example",C.amber);

{
  const s=cSlide(pres,"Gaussian Beam: Field, Parameters & Geometry","GAUSSIAN BEAMS");
  fImg(s,"gauss_field",0.35,1.12,9.3,0.78);
  fImg(s,"gauss_params",0.35,1.96,9.3,0.72);
  dImg(s,"gaussian_beam",0.35,2.72,9.3,1.35);
  fImg(s,"gauss_q",0.35,4.14,4.55,0.68);
  fImg(s,"gauss_abcd",0.35,4.88,4.55,0.62);
  panel(s,pres,5.05,4.14,4.6,1.36,C.teal); hdr(s,pres,5.05,4.14,4.6,C.teal,"Resonator Self-Consistency");
  fImg(s,"gauss_resonator",5.13,4.44,4.42,0.98);
}

{
  const s=cSlide(pres,"Complex q-Parameter & ABCD Kogelnik Transform","GAUSSIAN BEAMS");
  txt(s,"The q-parameter ABCD law (Kogelnik bilinear transform) is the same 2×2 matrix as in geometric ray optics — unifying ray and wave treatments of paraxial beams:",0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"gauss_q",0.35,1.73,9.3,0.72);
  fImg(s,"gauss_abcd",0.35,2.5,9.3,0.65);
  const cases=[
    {t:"Free space (d)",c:C.accent1,eq:"M=[1,d;0,1]\nq₂=q₁+d\n(beam expands)"},
    {t:"Thin lens (f)",c:C.teal,eq:"M=[1,0;−1/f,1]\n1/q₂=1/q₁−1/f\n(curvature shift)"},
    {t:"Resonator eigenmode",c:C.gold,eq:"M=[A,B;C,D]\nCq²+(D−A)q−B=0\n(stable mode)"},
  ];
  cases.forEach((c,i)=>{
    const x=0.35+i*3.2;
    panel(s,pres,x,3.28,3.05,1.85,c.c); hdr(s,pres,x,3.28,3.05,c.c,c.t);
    txt(s,c.eq,x+0.1,3.58,2.85,1.48,{fs:11,col:C.accent3,font:"Consolas"});
  });
  fImg(s,"gauss_resonator",0.35,5.18,9.3,0.4);
}

{
  const s=cSlide(pres,"Worked Example: Focusing a Gaussian Beam with a Thin Lens","GAUSSIAN BEAMS");
  txt(s,"A Gaussian beam (waist w₀ at z=0) propagates to a thin lens at z=d₁, then focuses to waist w₀' at d₂ beyond the lens. We use the q-parameter ABCD method:",0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"gauss_q",0.35,1.73,4.55,0.65);
  fImg(s,"gauss_abcd",0.35,2.42,4.55,0.62);
  dImg(s,"gaussian_focusing",0.35,3.1,4.55,1.2);
  fImg(s,"gauss_focusing",0.35,4.36,4.55,0.78);
  panel(s,pres,5.1,1.12,4.55,4.28,C.teal); hdr(s,pres,5.1,1.12,4.55,C.teal,"Numerical Example & Special Cases");
  bul(s,["λ=1064nm, w₀=1mm, d₁=500mm, f=200mm","z_R = πw₀²/λ = π×1²/0.001064 = 2953 mm","d₁−f = 500−200 = 300 mm","w₀' = 1×200/√(300²+2953²) = 200/2966 ≈ 0.0674 mm","New z_R' = π(0.0674)²/0.001064 ≈ 13.4 mm","Special: d₁=f → w₀'=fλ/(πw₀): lens Fourier-transforms beam!","Special: z_R>>f → w₀'≈fλ/(πw₀): diffraction limit"],5.18,1.44,4.37,2.72,10.5);
  panel(s,pres,5.1,3.9,4.55,1.5,C.gold); hdr(s,pres,5.1,3.9,4.55,C.gold,"Key Physical Insights");
  bul(s,["Focusing tighter requires larger input beam w₀","Diffraction limit: w₀'=fλ/(πw₀) — cannot beat λ/NA","M² factor: real beams w₀'θ=M²λ/π, M²=1 ideal Gaussian"],5.18,4.2,4.37,1.12,10.5);
}

refSlide(pres,"Gaussian Beams: References, Problems & Projects","GAUSSIAN BEAMS · REFERENCES",
  ["Saleh & Teich, Fundamentals of Photonics Ch. 3: Gaussian beam optics — clear and complete.",
   "Hecht, Optics Ch. 5.6: beam optics and coherence.",
   "Svelto, Principles of Lasers Ch. 4: Gaussian modes in laser cavities."],
  ["Siegman, Lasers Ch. 16–20: definitive Gaussian beams, ABCD, and resonators.",
   "Kogelnik & Li (1966) Proc. IEEE 54, 1312: original ABCD Gaussian beam paper.",
   "ISO 11146: Laser beam characterisation (M² measurement standard)."],
  ["[BSc] HeNe laser (λ=633nm), w₀=0.5mm. Calculate beam radius and R(z) at z=1m and z=10m.",
   "[BSc] Using q-parameter: propagate Gaussian through 2m free space then 50mm lens. Find new waist.",
   "[MSc] Design beam expander (two lenses) expanding 0.5mm waist to 5mm, minimum total length.",
   "[MSc] Show that a lens at z=z_R maximises the focal spot area. What is the optimal position for minimum spot?",
   "[Project: BSc] Measure M² of a diode laser using CCD camera + Python. Compare with diffraction-limited prediction.",
   "[Project: MSc] Simulate resonator modes using round-trip q-parameter self-consistency. Plot mode size vs. mirror radius."]);

pres.writeFile({fileName:"/home/claude/lecture_04_gaussian.pptx"})
  .then(()=>console.log("✓ lecture_04_gaussian.pptx")).catch(e=>console.error(e));
}

// ═════════════════════════════════════════════════════════════════
//  LECTURE 5: FOURIER OPTICS
// ═════════════════════════════════════════════════════════════════
{
const pres = newPres("Linear Optics — Lecture 5: Fourier Optics",5);
lectureTitleSlide(pres,"05","Fourier Optics",
  "Linear Superposition · Spatial Frequencies · Eigenmodes · Transfer Functions · Rainbow",C.purple);

{
  const s=cSlide(pres,"Wave Equation Linearity & Angular Spectrum","FOURIER OPTICS");
  txt(s,"The wave equation is linear: if E₁ and E₂ are solutions, so is aE₁+bE₂. The general solution is a superposition of plane waves — the angular spectrum:",0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"fourier_wave_eq",0.35,1.73,9.3,0.88);
  fImg(s,"fourier_convolution",0.35,2.67,9.3,0.72);
  fImg(s,"fourier_parseval",0.35,3.44,4.55,0.6);
  panel(s,pres,0.35,4.1,9.3,0.88,C.gold); hdr(s,pres,0.35,4.1,9.3,C.gold,"Optical Components as Linear Integral Operators");
  fImg(s,"fourier_kernel",0.43,4.38,9.1,0.62);
}

{
  const s=cSlide(pres,"The Lens as a Fourier Transform Operator","FOURIER OPTICS");
  fImg(s,"fourier_lens_ft",0.35,1.12,9.3,0.98);
  fImg(s,"fourier_transfer",0.35,2.15,9.3,0.72);
  fImg(s,"fourier_4f",0.35,2.93,9.3,0.68);
  dImg(s,"fourier_4f",0.35,3.68,9.3,1.0);
  const ftops=[
    {t:"4-f Imaging System",c:C.accent1,b:"Object→FT plane (spatial filter H(fx))→image. Low-pass, high-pass, notch, phase-contrast, matched filter."},
    {t:"Angular Spectrum H(f,z)",c:C.teal,b:"H=exp(iπλz(fx²+fy²)) paraxial. Evanescent for |f|>1/λ. Free-space propagation = phase filter."},
    {t:"Coherent vs Incoherent",c:C.gold,b:"Coherent: amplitude CTF H(fx). Incoherent: intensity PSF convolution. Coherent bandwidth 2× narrower than incoherent."},
    {t:"Spatial Filtering",c:C.green,b:"Pinhole → low-pass. π/2 phase ring → Zernike phase contrast. Holographic mask → matched filter."},
  ];
  ftops.forEach((t,i)=>{
    const x=0.35+(i%2)*4.85, y=4.75+(Math.floor(i/2))*0.0;
    // Single row
  });
  [ftops[0],ftops[1]].forEach((t,i)=>{
    const x=0.35+i*4.85;
    panel(s,pres,x,4.75,4.6,0.75,t.c); hdr(s,pres,x,4.75,4.6,t.c,t.t);
    txt(s,t.b,x+0.08,5.02,4.42,0.42,{fs:9.5});
  });
}

// Rainbow
{
  const s=cSlide(pres,"The Rainbow: White Light as a Fourier Superposition","FOURIER OPTICS");
  txt(s,"White light is an equal superposition of all visible wavelengths (380–740 nm). A prism or grating performs an optical Fourier transform, separating the eigenmodes by spatial frequency:",0.35,1.12,9.3,0.55,{fs:12});
  dImg(s,"rainbow_spectrum",0.35,1.73,9.3,3.42);
  txt(s,"Top: continuous rainbow — all Fourier eigenmodes present. Bottom: amplitude spectrum showing major colour components as Fourier coefficients. Green (530nm) has highest spectral weight in white light.",0.35,5.2,9.3,0.35,{fs:10,col:C.muted,italic:true});
}

// Eigenmodes
{
  const s=cSlide(pres,"Fourier Eigenmodes: Plane Waves as Basis Functions","FOURIER OPTICS");
  txt(s,"The Fourier series expresses any periodic function as a sum of sinusoidal eigenmodes. In optics, these eigenmodes are plane waves — the natural solutions of the linear wave equation:",0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"fourier_eigenmode",0.35,1.73,9.3,0.85);
  dImg(s,"fourier_modes",0.35,2.63,9.3,1.42);
  panel(s,pres,0.35,4.12,4.55,1.42,C.accent1); hdr(s,pres,0.35,4.12,4.55,C.accent1,"Eigenmodes & Fourier Series");
  bul(s,["Plane waves are eigenfunctions of any translation-invariant optical system","FT decomposes any field into eigenmodes; IFT reconstructs","Fourier series cₙ=(1/L)∫E(x)e^{-i2πnx/L}dx"],0.43,4.42,4.37,1.05,10);
  panel(s,pres,5.1,4.12,4.55,1.42,C.gold); hdr(s,pres,5.1,4.12,4.55,C.gold,"Rainbow & White Light");
  bul(s,["Prism = optical Fourier analyser: disperses eigenmodes by frequency f=1/λ","Each colour = one eigenmode at spatial frequency fₙ=1/λₙ","Recombine all → white light (Newton's prism experiment, 1672)"],5.18,4.42,4.37,1.05,10);
}

refSlide(pres,"Fourier Optics: References, Problems & Projects","FOURIER OPTICS · REFERENCES",
  ["Hecht, Optics Ch. 11: Fourier methods in optics — accessible introduction.",
   "Saleh & Teich Ch. 4: Fourier optics — wave optics and spatial filtering.",
   "Gaskill, Linear Systems, Fourier Transforms, and Optics (1978) — Wiley: classic systems approach."],
  ["Goodman, Introduction to Fourier Optics, 4th ed. (2017) — definitive graduate reference.",
   "Voelz, Computational Fourier Optics (SPIE 2011): numerical implementation with MATLAB/Python.",
   "Goodman, Statistical Optics (2015): coherence and Fourier methods in speckle and imaging."],
  ["[BSc] Show Fraunhofer pattern of a rectangular aperture (a×b) is a sinc² pattern. Find first zero positions.",
   "[BSc] In a 4-f system (f=100mm), design a filter removing spatial frequencies above 100 cyc/mm. What aperture diameter?",
   "[MSc] Derive coherent transfer function (CTF) and compare with incoherent OTF.",
   "[MSc] Implement angular spectrum propagation method in Python/NumPy. Propagate a Gaussian beam and compare with analytical result.",
   "[Project: MSc] Simulate a phase-contrast microscope using Fourier optics. Show π/2 phase ring converts phase objects to amplitude contrast."]);

pres.writeFile({fileName:"/home/claude/lecture_05_fourier.pptx"})
  .then(()=>console.log("✓ lecture_05_fourier.pptx")).catch(e=>console.error(e));
}

// ═════════════════════════════════════════════════════════════════
//  LECTURE 6: DIFFRACTION INTEGRALS
// ═════════════════════════════════════════════════════════════════
{
const pres = newPres("Linear Optics — Lecture 6: Diffraction Integrals",6);
lectureTitleSlide(pres,"06","Diffraction Integrals",
  "Maxwell → Kirchhoff → Fresnel → Circular Aperture Rings → Collins Integral",C.red);

{
  const s=cSlide(pres,"From Maxwell's Equations to Scalar Diffraction","DIFFRACTION");
  txt(s,"Starting from Maxwell's equations in a source-free region, the field satisfies the Helmholtz equation. Green's theorem + free-space Green's function yields the Kirchhoff integral:",0.35,1.12,9.3,0.58,{fs:12});
  fImg(s,"diff_helmholtz",0.35,1.76,9.3,0.88);
  fImg(s,"diff_kirchhoff",0.35,2.7,9.3,0.75);
  txt(s,"Kirchhoff boundary conditions: field=0 on opaque screen; field=unperturbed incident field in the aperture. This converts the surface integral to an aperture integral — the Huygens-Fresnel principle:",0.35,3.52,9.3,0.55,{fs:12});
  fImg(s,"diff_fresnel",0.35,4.13,9.3,0.88);
}

{
  const s=cSlide(pres,"Circular Aperture: Diffraction Rings from the Mathematics","DIFFRACTION");
  txt(s,"A plane wave strikes a flat metal screen with a circular hole of radius a. The Fresnel integral reduces to a Bessel function, giving on-axis oscillations controlled by the Fresnel number N_F:",0.35,1.12,9.3,0.52,{fs:12});
  dImg(s,"diffraction_aperture",0.35,1.7,5.5,1.42);
  fImg(s,"diff_circular",0.35,3.18,5.5,1.0);
  fImg(s,"diff_onaxis",0.35,4.24,5.5,0.82);
  fImg(s,"diff_airy",0.35,5.12,5.5,0.38);
  panel(s,pres,6.05,1.12,3.6,4.28,C.teal); hdr(s,pres,6.05,1.12,3.6,C.teal,"Physical Interpretation");
  bul(s,["Each point in the aperture is a secondary Huygens source (Huygens-Kirchhoff)","Phase of each secondary wavelet depends on its distance to the observation point","Fresnel zones: alternating zones contribute constructive/destructive amplitudes","Increasing z: N_F decreases, pattern transitions from Fresnel to Fraunhofer","N_F=1: aperture equals one Fresnel zone — maximum on-axis intensity","Zone plate: block even zones → constructive interference → focus"],6.13,1.44,3.42,3.62,10.5);
  fImg(s,"diff_zones",6.13,5.08,3.42,0.4);
}

{
  const s=cSlide(pres,"Collins Integral & Near-to-Far-Field Transition","DIFFRACTION");
  fImg(s,"diff_collins",0.35,1.12,9.3,0.95);
  txt(s,"The Collins integral generalises Fresnel diffraction to any ABCD system — free space, lenses, and resonator passes all use the same kernel with respective ABCD elements.",0.35,2.13,9.3,0.55,{fs:12});
  const rows=[
    ["Near field (N_F >> 1)","Fresnel diffraction. Geometrical shadow with fringes. On-axis intensity oscillates with z."],
    ["Transition (N_F ~ 1)","Rich interference structure. Aperture approximately equals beam-waist."],
    ["Far field (N_F << 1)","Fraunhofer diffraction. Pattern = |FT of aperture|². Airy disk for circular aperture."],
    ["ABCD generalisation","Collins (1970): replace λz with λB — covers all paraxial systems."],
  ];
  rows.forEach(([name,desc],i)=>{
    s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:2.78+i*0.52,w:9.3,h:0.48,fill:{color:i%2?C.mid:C.panel},line:{color:C.mid,width:0}});
    s.addText([{text:name+"  ",options:{bold:true,fontSize:10,color:C.accent2,fontFace:"Calibri"}},{text:desc,options:{fontSize:10,color:C.offwhite,fontFace:"Calibri"}}],{x:0.5,y:2.8+i*0.52,w:9.0,h:0.44});
  });
  fImg(s,"diff_fraunhofer",0.35,4.88,9.3,0.82);
}

refSlide(pres,"Diffraction Integrals: References, Problems & Projects","DIFFRACTION · REFERENCES",
  ["Hecht, Optics Ch. 10: diffraction — Kirchhoff, Fresnel, Fraunhofer with worked examples.",
   "Born & Wolf Ch. 8: Fresnel-Kirchhoff diffraction theory — rigorous derivation from Maxwell.",
   "Saleh & Teich Ch. 4.3: Fresnel and Fraunhofer diffraction and relation to ABCD."],
  ["Goodman, Introduction to Fourier Optics Ch. 3–5: scalar diffraction theory in depth.",
   "Born & Wolf Ch. 9: diffraction from apertures, Babinet's principle, vector theory.",
   "Lalor (1968) J. Opt. Soc. Am 58, 1235: angular spectrum rigorous derivation."],
  ["[BSc] Compute on-axis intensity I(0,z) for circular aperture a=1mm, λ=633nm, z=1mm to 10m. At what distances is I maximum?",
   "[BSc] Show that blocking every other Fresnel zone (zone plate) creates a focusing element. What is the focal length?",
   "[MSc] Evaluate the Fresnel diffraction integral numerically for a rectangular slit using the FFT angular-spectrum method. Compare with analytical result.",
   "[MSc] Derive the Collins integral from Huygens-Fresnel by substituting the ABCD system matrix. What conditions on B make this valid?",
   "[Project: MSc] Simulate diffraction of a Gaussian beam through an obstacle (Babinet) using angular spectrum method. Compare with Kirchhoff theory."]);

pres.writeFile({fileName:"/home/claude/lecture_06_diffraction.pptx"})
  .then(()=>console.log("✓ lecture_06_diffraction.pptx")).catch(e=>console.error(e));
}

// ═════════════════════════════════════════════════════════════════
//  LECTURE 7: MUELLER CALCULUS & STOKES FORMALISM
// ═════════════════════════════════════════════════════════════════
{
const pres = newPres("Linear Optics — Lecture 7: Mueller Calculus",7);
lectureTitleSlide(pres,"07","Mueller Calculus & Stokes Formalism",
  "Partial Polarization · Stokes Vectors · Mueller Matrices · Poincaré Sphere · Polarimetry",C.pink);

{
  const s=cSlide(pres,"Stokes Parameters: Describing Partially Polarized Light","MUELLER CALCULUS");
  txt(s,"Jones vectors describe only fully coherent, fully polarized light. Stokes parameters S₀–S₃ are real, time-averaged intensity differences — they describe any polarization state:",0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"mueller_stokes",0.35,1.78,5.5,1.42);
  fImg(s,"mueller_dop",0.35,3.25,5.5,0.82);
  dImg(s,"stokes_poincare",5.85,1.55,4.1,2.6);
  const sv=[
    {s:"[1, 1, 0, 0]ᵀ",n:"H linear",c:C.accent1},{s:"[1, −1, 0, 0]ᵀ",n:"V linear",c:C.teal},
    {s:"[1, 0, 1, 0]ᵀ",n:"+45° linear",c:C.gold},{s:"[1, 0, 0, 1]ᵀ",n:"RCP",c:C.green},
    {s:"[1, 0, 0, −1]ᵀ",n:"LCP",c:C.amber},{s:"[1, 0, 0, 0]ᵀ",n:"Unpolarized",c:C.muted},
  ];
  sv.forEach((sv2,i)=>{
    const x=0.35+(i%3)*3.2, y=4.15+(Math.floor(i/3))*0.72;
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:3.05,h:0.65,fill:{color:C.panel},line:{color:sv2.c,width:0.8}});
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:0.18,h:0.65,fill:{color:sv2.c},line:{color:sv2.c,width:0}});
    s.addText(sv2.n,{x:x+0.25,y:y+0.04,w:2.72,h:0.24,fontSize:9.5,bold:true,color:C.white,fontFace:"Calibri"});
    s.addText(sv2.s,{x:x+0.25,y:y+0.3,w:2.72,h:0.3,fontSize:10,color:C.accent3,fontFace:"Consolas"});
  });
}

{
  const s=cSlide(pres,"Mueller Matrices & Component Examples","MUELLER CALCULUS");
  fImg(s,"mueller_transform",0.35,1.12,9.3,0.72);
  fImg(s,"mueller_hpol",0.35,1.9,4.55,1.12);
  fImg(s,"mueller_qwp",5.1,1.9,4.55,1.12);
  panel(s,pres,0.35,3.1,9.3,1.3,C.gold); hdr(s,pres,0.35,3.1,9.3,C.gold,"Mueller vs Jones Comparison");
  const cmp=[["Jones (2×2 complex)","Mueller (4×4 real)"],["Fully polarized only","Any DOP (0 to 1)"],["8 real parameters","16 real parameters"],["No depolarization","Depolarization natural"],["Phase-sensitive","Intensity averages only"]];
  cmp.slice(1).forEach(([j,m],i)=>{
    s.addText(j,{x:0.43,y:3.4+i*0.38,w:4.35,h:0.35,fontSize:10.5,color:C.offwhite,fontFace:"Calibri"});
    s.addText(m,{x:5.18,y:3.4+i*0.38,w:4.35,h:0.35,fontSize:10.5,color:C.offwhite,fontFace:"Calibri"});
  });
  s.addShape(pres.shapes.LINE,{x:5.1,y:3.1,w:0,h:1.3,line:{color:C.gold,width:1}});
  s.addText("Jones",{x:1.5,y:3.12,w:2,h:0.25,fontSize:10,bold:true,color:C.accent1,fontFace:"Calibri",align:"center"});
  s.addText("Mueller",{x:6.5,y:3.12,w:2,h:0.25,fontSize:10,bold:true,color:C.gold,fontFace:"Calibri",align:"center"});
  fImg(s,"mueller_conversion",0.35,4.47,9.3,0.92);
  fImg(s,"mueller_coherency",0.35,5.44,9.3,0.18);
}

{
  const s=cSlide(pres,"Mueller Matrix: Polarizer and Wave Plate","MUELLER CALCULUS");
  txt(s,"The Mueller matrix acts on the 4-component Stokes vector. Here are the matrices for the key polarization elements:",0.35,1.12,9.3,0.5,{fs:12});
  panel(s,pres,0.35,1.7,4.55,2.1,C.accent1); hdr(s,pres,0.35,1.7,4.55,C.accent1,"Horizontal Linear Polarizer");
  fImg(s,"mueller_hpol",0.43,2.0,4.37,1.52);
  panel(s,pres,5.1,1.7,4.55,2.1,C.teal); hdr(s,pres,5.1,1.7,4.55,C.teal,"QWP (fast axis horizontal)");
  fImg(s,"mueller_qwp",5.18,2.0,4.37,1.52);
  panel(s,pres,0.35,3.88,9.3,1.5,C.gold); hdr(s,pres,0.35,3.88,9.3,C.gold,"Jones → Mueller Conversion");
  fImg(s,"mueller_conversion",0.43,4.18,9.1,1.05);
  fImg(s,"mueller_coherency",0.43,5.28,9.1,0.35);
}

refSlide(pres,"Mueller Calculus: References, Problems & Projects","MUELLER CALCULUS · REFERENCES",
  ["Hecht, Optics Ch. 8.12: Stokes parameters and degree of polarization.",
   "Saleh & Teich Ch. 6.6: Mueller matrices and Stokes vectors.",
   "Pedrotti Ch. 16: partial polarization and Mueller calculus."],
  ["Chipman, Handbook of Optics Vol. II Ch. 22–27 — most comprehensive Mueller/Jones reference.",
   "Azzam & Bashara, Ellipsometry and Polarized Light (1977): Mueller and coherency matrices.",
   "Gil & Ossikovski, Polarized Light, Fundamentals and Applications (2016) — Cambridge UP.",
   "Cloude (1986) Optik 75, 26: eigenvalue decomposition of Mueller matrices."],
  ["[BSc] Compute Stokes vector for +45° linear light through QWP (fast axis horizontal). What polarization results?",
   "[BSc] Verify that Mueller matrix for H polarizer satisfies M²=M (idempotent). What does this mean physically?",
   "[BSc] Show that for a non-depolarizing element, det(M) = (det J)² where J is the Jones matrix.",
   "[MSc] Design a Stokes polarimeter using 4 intensity measurements. Write the measurement matrix and show it can be inverted.",
   "[MSc] Decompose a general Mueller matrix using the Lu-Chipman polar decomposition into depolarizer, retarder, and diattenuator.",
   "[Project: MSc] Implement Mueller matrix spectropolarimeter simulation in Python. Model polarimetric properties of a cholesteric liquid crystal layer."]);

pres.writeFile({fileName:"/home/claude/lecture_07_mueller.pptx"})
  .then(()=>console.log("✓ lecture_07_mueller.pptx")).catch(e=>console.error(e));
}
