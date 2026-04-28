// ═══════════════════════════════════════════════════════════════
//  LECTURE 2: ABCD Ray Transfer Matrices
//  Run: node lecture_02_abcd.js
// ═══════════════════════════════════════════════════════════════
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 2: ABCD Matrices",2);

lectureTitleSlide(pres,"02","ABCD Ray Transfer Matrices",
  "Paraxial Optics · Component Matrices · System Design · Telescope Examples",C.teal);

// ── ABCD Intro ─────────────────────────────────────────────────
{
  const s=cSlide(pres,"The Paraxial Approximation & ABCD Formalism","ABCD MATRICES");
  txt(s,"The paraxial (small-angle) approximation sinθ ≈ θ linearises ray propagation, enabling every optical element to be a 2×2 real matrix:",0.35,1.12,9.3,0.52,{fs:12});
  fImg(s,"abcd_def",0.35,1.7,5.55,1.02);
  fImg(s,"abcd_cascade",0.35,2.78,5.55,0.72);
  fImg(s,"abcd_imaging",0.35,3.55,5.55,0.62);
  panel(s,pres,6.1,1.12,3.55,4.28,C.teal); hdr(s,pres,6.1,1.12,3.55,C.teal,"ABCD Element Meanings");
  bul(s,["A = y₂/y₁ at θ₁=0  (transverse magnification)","B = y₂/θ₁ at y₁=0  (units of length)","C = θ₂/y₁ at θ₁=0  (optical power = −C)","D = θ₂/θ₁ at y₁=0  (angular magnification)","det(M) = 1  (homogeneous medium)","B = 0: imaging condition","C = 0: afocal (telescope)"],6.18,1.44,3.37,2.25,10.5);
  fImg(s,"abcd_resonator",6.18,3.75,3.37,0.85);
}

// ── Component gallery & material gallery ──────────────────────
{
  const s=cSlide(pres,"Optical Component Schematic Symbols","ABCD MATRICES · COMPONENTS");
  txt(s,"Every optical element has a standard schematic symbol used in ray diagrams and system layouts:",0.35,1.12,9.3,0.45,{fs:12});
  dImg(s,"optical_component_gallery",0.35,1.63,9.3,3.62);
  txt(s,"Biconvex lens · Concave mirror · GRIN rod · Dispersing prism · Wave plate (Δφ) · Wire-grid polarizer · BS cube · EOM (LiNbO₃ crystal with electrodes)",0.35,5.32,9.3,0.25,{fs:8.5,col:C.muted,italic:true});
}
{
  const s=cSlide(pres,"Optical Materials: Crystal Structures & Microstructures","ABCD MATRICES · MATERIALS");
  txt(s,"The macroscopic optical properties arise from the microscopic crystal structure. Here is the structural origin of key materials:",0.35,1.12,9.3,0.48,{fs:12});
  dImg(s,"material_gallery",0.35,1.66,9.3,3.52);
  txt(s,"BK7 amorphous SiO₂ · Calcite trigonal R3̄c · LiNbO₃ trigonal R3c · YIG cubic Ia3̄d · GRIN fibre graded GeO₂ core · Si diamond cubic Fd3̄m · Au FCC thin film · TiO₂/SiO₂ DBR multilayer",0.35,5.24,9.3,0.3,{fs:8.5,col:C.muted,italic:true});
}

// ── Free space ─────────────────────────────────────────────────
{
  const s=cSlide(pres,"ABCD: Free-Space Propagation","ABCD MATRICES");
  dImg(s,"ray_freespace",0.35,1.12,4.5,1.75);
  fImg(s,"abcd_freespace",0.35,2.95,4.5,0.88);
  txt(s,"Height increases with angle (y₂ = y₁ + d·θ₁). Angle unchanged. In medium n: replace d with d/n (reduced distance).",0.35,3.9,4.5,0.65,{fs:10.5,col:C.muted,italic:true});
  fImg(s,"abcd_slab",0.35,4.62,4.5,0.75);
  panel(s,pres,5.05,1.12,4.6,4.28,C.teal); hdr(s,pres,5.05,1.12,4.6,C.teal,"Microscopic Origin & Materials");
  txt(s,"In vacuum light travels at c with no interaction. In a dielectric, the macroscopic n = √εᵣ emerges from the Clausius-Mossotti relation linking atomic polarizability to εᵣ. Electrons oscillate driven by E; their re-radiated field slows propagation to c/n.\n\n1 m of BK7 (n=1.517) → d_eff = 0.659 m for ray-matrix purposes.\n1 m of Si (n=3.48) → d_eff = 0.287 m.",5.13,1.44,4.42,2.15,{fs:10.5});
  txt(s,"n (λ=589nm):\nAir 1.0003 · BK7 1.517 · SiO₂ 1.458\nSi 3.48 · Ge 4.0 · GaAs 3.6",5.13,3.65,4.42,0.75,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── Thin Lens ──────────────────────────────────────────────────
{
  const s=cSlide(pres,"ABCD: Thin Lens","ABCD MATRICES");
  dImg(s,"ray_thinlens",0.35,1.12,4.5,1.75);
  fImg(s,"abcd_thinlens",0.35,2.95,4.5,0.88);
  txt(s,"Lens changes angle but not height. Cascade M_free(d₂)·M_lens·M_free(d₁), set B=0 to get 1/f = 1/d₁+1/d₂.",0.35,3.9,4.5,0.62,{fs:10.5,col:C.muted,italic:true});
  fImg(s,"abcd_imaging",0.35,4.58,4.5,0.7);
  panel(s,pres,5.05,1.12,4.6,4.28,C.accent1); hdr(s,pres,5.05,1.12,4.6,C.accent1,"Microscopic Structure & Materials");
  txt(s,"Glass lenses are amorphous SiO₂ networks. Curved surfaces ground/polished to sub-λ roughness. AR coatings reduce Fresnel reflection <0.1% per surface.\n\nRefractive index from electronic polarizability of Si-O bonds (Kramers-Kronig). Dispersion from UV electronic and mid-IR phonon resonances.",5.13,1.44,4.42,2.0,{fs:10.5});
  txt(s,"BK7: n=1.517, V=64\nFused SiO₂: n=1.458, V=68, UV grade\nN-SF11: n=1.784, V=25 (dense flint)\nCaF₂: n=1.434, UV & IR range\nSi, Ge: mid-IR optics (3–12 μm)",5.13,3.5,4.42,1.38,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── Curved Mirror ──────────────────────────────────────────────
{
  const s=cSlide(pres,"ABCD: Curved Mirror","ABCD MATRICES");
  dImg(s,"ray_mirror",0.35,1.12,4.5,1.75);
  fImg(s,"abcd_mirror",0.35,2.95,4.5,0.88);
  txt(s,"Equivalent to thin lens with f = R/2. In an unfolded cavity diagram, mirrors → equivalent lenses.",0.35,3.9,4.5,0.55,{fs:10.5,col:C.muted,italic:true});
  fImg(s,"abcd_resonator",0.35,4.52,4.5,0.72);
  panel(s,pres,5.05,1.12,4.6,4.28,C.teal); hdr(s,pres,5.05,1.12,4.6,C.teal,"Microscopic Structure & Materials");
  txt(s,"Metallic mirrors: Al, Ag, Au thin films (~100 nm) evaporated onto polished glass. Ag: R~98% VIS; Au: R~98% NIR/IR.\n\nDielectric mirrors: alternating λ/4 layers TiO₂ (n~2.3)/SiO₂ (n~1.45). 20–40 pairs → R>99.99%. Supermirrors for cavity QED reach R>99.9999%.\n\nSubstrate: Zerodur® or ULE® glass-ceramic for ultra-low thermal expansion.",5.13,1.44,4.42,2.15,{fs:10.5});
  txt(s,"Al: telescopes, broadband\nAg: spectroscopy, optical clocks\nAu: IR/THz, λ>700nm\nDBR stacks: laser cavities",5.13,3.65,4.42,0.85,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── Thick Lens & Slab ──────────────────────────────────────────
{
  const s=cSlide(pres,"ABCD: Thick Lens & Dielectric Slab","ABCD MATRICES");
  dImg(s,"ray_slab",0.35,1.12,4.5,1.75);
  fImg(s,"abcd_thicklens",0.35,2.95,4.5,1.02);
  fImg(s,"abcd_slab",0.35,4.05,4.5,0.75);
  panel(s,pres,5.05,1.12,4.6,4.28,C.gold); hdr(s,pres,5.05,1.12,4.6,C.gold,"Thick Lens & Apparent Shift");
  bul(s,["Principal planes H,H' shift inward from vertices for biconvex lens","EFL measured from H,H' — not from lens surfaces","Slab shifts apparent object position: δ = t(1−1/n) toward observer","Critical in microscopy: coverslip correction collar, oil immersion (n=1.515)","Example: 0.17mm coverslip, n=1.515: δ = 0.17×(1−1/1.515) ≈ 0.058 mm","Apparent thickness of a fish tank wall from outside"],5.13,1.44,4.42,3.65,10.5);
}

// ── GRIN ───────────────────────────────────────────────────────
{
  const s=cSlide(pres,"ABCD: Gradient-Index (GRIN) Medium","ABCD MATRICES");
  fImg(s,"abcd_grin",0.35,1.12,5.5,1.42);
  panel(s,pres,0.35,2.62,5.5,2.78,C.green); hdr(s,pres,0.35,2.62,5.5,C.green,"Microscopic Structure & Materials");
  txt(s,"GRIN lenses fabricated by controlled ion-exchange: immersing glass in molten salt bath (AgNO₃ or TlNO₃) replaces Na⁺ ions, creating graded dopant → parabolic n(r). Quarter-pitch rod (L=π/2√α) collimates a point source; half-pitch images input to output plane.\n\nFiber GRIN preforms: modified CVD (MCVD) — layer-by-layer SiO₂/GeO₂ deposition with graded Ge doping.",0.43,2.94,5.32,1.85,{fs:10.5});
  txt(s,"NSG Selfoc® GRIN rods · GRIN fiber collimators\nGRIN endoscope objectives · LIDAR · OM3/OM4/OM5",0.43,4.85,5.32,0.48,{fs:10.5,col:C.accent3,font:"Consolas"});
  dImg(s,"ray_grin",6.05,1.12,3.6,4.28);
}

// ── Refractor Telescope ────────────────────────────────────────
{
  const s=cSlide(pres,"Extended Example: Refracting Telescope (Two Doublet Groups)","ABCD MATRICES · TELESCOPE");
  txt(s,"A refractor telescope is an afocal (C=0) system: objective + eyepiece separated by f_obj+f_eye. We trace a ray through all planes using the ABCD cascade:",0.35,1.12,9.3,0.55,{fs:12});
  dImg(s,"telescope_refractor",0.35,1.73,9.3,1.62);
  fImg(s,"abcd_cascade",0.35,3.42,9.3,0.65);
  fImg(s,"abcd_telescope",0.35,4.14,4.85,0.88);
  panel(s,pres,5.35,4.14,4.3,2.12,C.gold); hdr(s,pres,5.35,4.14,4.3,C.gold,"Key Results & Interpretation");
  bul(s,["C=0 confirms afocal design: collimated input → collimated output","Angular magnification = −f_obj/f_eye = −500/25 = −20× (inverted)","Add erecting prism (M=−1) → upright image for terrestrial use","B-element gives the tube length (entrance pupil location)"],5.43,4.44,4.12,1.72,10.5);
}

// ── Schmidt-Cassegrain ─────────────────────────────────────────
{
  const s=cSlide(pres,"Extended Example: Schmidt-Cassegrain Reflector","ABCD MATRICES · TELESCOPE");
  txt(s,"The SCT combines a spherical primary mirror (M₁), a Schmidt corrector plate, and a convex secondary mirror (M₂). Beam folded through hole in primary (shown unfolded):",0.35,1.12,9.3,0.55,{fs:12});
  dImg(s,"telescope_sct",0.35,1.73,9.3,1.62);
  fImg(s,"abcd_cassegrain",0.35,3.42,9.3,0.72);
  panel(s,pres,0.35,4.22,4.85,1.9,C.teal); hdr(s,pres,0.35,4.22,4.85,C.teal,"Typical 8\" f/10 SCT Parameters");
  bul(s,["R₁ = −1000 mm (primary concave), R₂ = +300 mm (secondary convex)","d₁ = 200 mm, d₂ = 300 mm","EFL ≈ 2000 mm (f/10), FOV ~0.5°","Secondary provides ~5× Cassegrain amplification of EFL"],0.43,4.52,4.67,1.52,10.5);
  panel(s,pres,5.35,4.22,4.3,1.9,C.amber); hdr(s,pres,5.35,4.22,4.3,C.amber,"Key Results");
  bul(s,["Schmidt corrector removes spherical aberration of primary","Back focal distance = B-element of system matrix","Folded path: compact and mechanically stiff","Used by Meade and Celestron for 8–16\" amateur scopes"],5.43,4.52,4.12,1.52,10.5);
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"ABCD Matrices: References, Problems & Projects","ABCD MATRICES · REFERENCES",
  ["Hecht, Optics Ch. 5–6: lenses, mirrors, instruments — ABCD introduced informally.",
   "Saleh & Teich, Fundamentals of Photonics Ch. 1–2: ray optics and matrix methods.",
   "Smith, Modern Optical Engineering (2000): practical lens design with matrix methods.",
   "Pedrotti & Pedrotti, Introduction to Optics: ray-matrix chapter with exercises."],
  ["Siegman, Lasers Ch. 15: ABCD matrices and Gaussian beam propagation — definitive.",
   "Gerrard & Burch, Introduction to Matrix Methods in Optics (1975) — Dover. Classic text.",
   "Saleh & Teich Ch. 9: resonators and Gaussian beams via ABCD.",
   "Yariv, Quantum Electronics Ch. 2: resonator stability, matrix approach."],
  ["[BSc] Compute system matrix for a Galilean telescope (positive + negative lens). Show C=0 and find the angular magnification.",
   "[BSc] A plano-convex BK7 lens (R=50mm, n=1.517, t=8mm) — compute the thick-lens matrix and compare EFL with thin-lens approximation.",
   "[BSc] Derive the stability condition 0≤g₁g₂≤1 for a two-mirror cavity using ABCD matrices.",
   "[MSc] Using ABCD matrices, design a beam expander that expands a 1mm Gaussian beam waist to 10mm with minimum overall length.",
   "[MSc] Model the unfolded cavity of a Nd:YAG laser (R₁=∞, R₂=1m, L=0.5m). Find the intracavity Gaussian beam parameters.",
   "[Project: MSc] Implement a Zemax-like paraxial ray-tracer in Python using ABCD matrices. Simulate a Cassegrain telescope and plot spot diagrams."]);

pres.writeFile({fileName:"/home/claude/lecture_02_abcd.pptx"})
  .then(()=>console.log("✓ lecture_02_abcd.pptx"))
  .catch(e=>console.error(e));
