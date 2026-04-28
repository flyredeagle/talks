// ═══════════════════════════════════════════════════════════════
//  LECTURE 03a: The Nature of Light & Wave/Geometric Optics
//  Run: node lecture_03a_nature_of_light.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide } = S;

const pres = newPres("Linear Optics — Lecture 03a: Nature of Light", "03a");

lectureTitleSlide(pres, "03a",
  "The Nature of Light",
  "Electromagnetic Waves · Photons · Geometric Optics · Wave Optics · Historical Gallery",
  C.accent1);

// ── Nature of Light ────────────────────────────────────────────
{
  const s = cSlide(pres,"The Nature of Light: Waves and Photons","NATURE OF LIGHT");
  panel(s,pres,0.35,1.12,4.5,4.28,C.accent1); hdr(s,pres,0.35,1.12,4.5,C.accent1,"Wave Picture");
  bul(s,["Electromagnetic wave — oscillating E and B fields perpendicular to propagation direction",
         "Maxwell's equations predict c = 1/√(ε₀μ₀) ≈ 3×10⁸ m/s in vacuum",
         "Wavelength λ, frequency ν, angular frequency ω = 2πν  →  c = λν",
         "Polarization: the direction of the E-field oscillation",
         "Superposition of waves → interference and diffraction",
         "Visible spectrum: 380 nm (violet) to 740 nm (deep red)"],
    0.43,1.44,4.32,2.05,10.5);
  fImg(s,"bsc_maxwell",   0.43,3.55,4.32,0.85);
  fImg(s,"bsc_plane_wave",0.43,4.45,4.32,0.72);
  panel(s,pres,5.05,1.12,4.6,4.28,C.gold); hdr(s,pres,5.05,1.12,4.6,C.gold,"Quantum Picture (Photons)");
  bul(s,["Light is quantised into photons — discrete energy packets E = hν",
         "Wave-particle duality: single photons still create interference patterns",
         "Photon spin ±ℏ ↔ left/right circular polarization states",
         "Linear optics: photon number unchanged, only paths and phases altered",
         "Coherent states (lasers) are well described by classical E-field",
         "Entangled photons: quantum optics regime, beyond linear optics"],
    5.13,1.44,4.42,2.05,10.5);
  fImg(s,"bsc_photon",5.13,3.55,4.42,0.78);
  fImg(s,"bsc_snell_fermat",5.13,4.38,4.42,0.72);
}

// ── Maxwell in detail ──────────────────────────────────────────
{
  const s = cSlide(pres,"Maxwell's Equations and the EM Wave","NATURE OF LIGHT");
  fImg(s,"bsc_maxwell",0.35,1.12,9.3,0.82);
  fImg(s,"bsc_plane_wave",0.35,2.0,9.3,0.72);
  panel(s,pres,0.35,2.82,4.55,2.58,C.teal); hdr(s,pres,0.35,2.82,4.55,C.teal,"Key consequences");
  bul(s,["c = 1/√(ε₀μ₀) — speed of light predicted from electric and magnetic constants",
         "In a medium: v = c/n  where n = √(εᵣμᵣ) ≥ 1",
         "E and B are perpendicular to each other and to the propagation direction k",
         "The intensity I = ½ε₀c|E₀|² — proportional to E-field amplitude squared",
         "For a plane wave: E(r,t) = E₀cos(k·r − ωt + φ)"],
    0.43,3.12,4.37,2.2,10.5);
  panel(s,pres,5.1,2.82,4.55,2.58,C.gold); hdr(s,pres,5.1,2.82,4.55,C.gold,"Dispersion: n(λ) and the Sellmeier equation");
  bul(s,["n is not constant — it varies with wavelength λ (dispersion)",
         "Sellmeier: n²(λ)=1+Σ Bᵢλ²/(λ²−Cᵢ) — fits glass data precisely",
         "Group velocity: vg = c/(n − λ dn/dλ) — speed of a pulse envelope",
         "Group velocity dispersion (GVD): β₂ = d²k/dω² — pulse broadening per unit length",
         "Normal dispersion (dn/dλ < 0): blue light slower than red — prisms, glass",
         "Anomalous dispersion: red slower than blue — used in fibre optic systems"],
    5.18,3.12,4.37,2.2,10.5);
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.47,w:9.3,h:0.15,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"BK7 glass: n(589nm)=1.517, dn/dλ<0 (normal). Fused SiO₂: anomalous dispersion above 1.27 μm — key for telecom fibre.",
    0.5,5.49,9.1,0.15,{fs:8.5,col:C.muted,italic:true});
}

// ── Geometric Optics ───────────────────────────────────────────
{
  const s = cSlide(pres,"Geometric Optics: Rays, Lenses & Mirrors","NATURE OF LIGHT");
  fImg(s,"bsc_thinlens",0.35,1.12,4.85,0.88);
  panel(s,pres,0.35,2.08,4.85,2.42,C.teal); hdr(s,pres,0.35,2.08,4.85,C.teal,"Key Relations");
  bul(s,["Lensmaker's equation: 1/f = (n−1)(1/R₁ − 1/R₂)",
         "Thin lens imaging: 1/f = 1/dₒ + 1/dᵢ",
         "Transverse magnification: m = −dᵢ/dₒ",
         "Spherical mirror focal length: f = R/2 (concave, R>0)",
         "TIR critical angle: θc = arcsin(n₂/n₁) for n₁>n₂",
         "Optical power: P = 1/f in diopters (m⁻¹)"],
    0.43,2.4,4.67,2.0,10.5);
  fImg(s,"bsc_snell_fermat",0.35,4.58,4.85,0.72);
  panel(s,pres,5.4,1.12,4.25,4.28,C.gold); hdr(s,pres,5.4,1.12,4.25,C.gold,"Refractive Index Table (λ=589 nm)");
  bul(s,["Vacuum:     n = 1.000 (exact, by definition)",
         "Air:         n = 1.0003",
         "Water:      n = 1.333",
         "BK7 glass: n = 1.517, Abbe V = 64",
         "Fused SiO₂: n = 1.458, V = 68 (UV grade)",
         "N-SF11 flint: n = 1.784, V = 25",
         "Diamond:   n = 2.417",
         "Silicon:     n = 3.48 (IR, 3–12 μm)"],
    5.48,1.44,4.07,2.55,10.5);
  fImg(s,"bsc_malus",5.48,4.05,4.07,0.72);
}

// ── Wave Optics ────────────────────────────────────────────────
{
  const s = cSlide(pres,"Wave Optics: Interference, Diffraction & Coherence","NATURE OF LIGHT");
  const panels=[
    {t:"Huygens' Principle",c:C.accent1,
     lines:["Every point on a wavefront acts as a new secondary source","Envelope of secondary wavelets = new wavefront","Explains bending of light at apertures (diffraction)","Kirchhoff integral makes this rigorous (Lecture 08)"]},
    {t:"Young's Double Slit",c:C.teal,fk:"bsc_young",
     extra:["Path diff Δ = d sinθ","Bright fringes: Δ = mλ  Dark: Δ = (m+½)λ","Fringe spacing Δy = λL/d"]},
    {t:"Single-Slit Diffraction",c:C.gold,
     lines:["I(θ) = I₀ sinc²(πa sinθ/λ)","First minimum: sinθ = λ/a","Narrower slit → wider diffraction pattern","Resolution limit: Rayleigh criterion"]},
    {t:"Coherence & Optical Path",c:C.green,
     lines:["Temporal coherence length: Lc = λ²/Δλ","OPL = n·d,  phase = 2π·OPL/λ","Path difference Δ < Lc required for stable fringes","Spatial coherence: determines fringe visibility"]},
  ];
  panels.forEach((p,i)=>{
    const x=0.35+(i%2)*4.85, y=1.12+Math.floor(i/2)*2.22;
    panel(s,pres,x,y,4.6,2.12,p.c); hdr(s,pres,x,y,4.6,p.c,p.t);
    if(p.fk){
      fImg(s,p.fk,x+0.08,y+0.32,4.42,0.85);
      bul(s,p.extra,x+0.08,y+1.23,4.42,0.8,10);
    } else {
      bul(s,p.lines,x+0.08,y+0.32,4.42,1.72,10.5);
    }
  });
}

// ── Historical Gallery ─────────────────────────────────────────
{
  const s = cSlide(pres,"Pioneers of Optics: A Historical Gallery","HISTORY OF OPTICS");
  const people=[
    {name:"Ibn al-Haytham (Alhazen)",years:"965–1040",
     contrib:"Book of Optics (1021): first rigorous theory of vision, reflection, refraction, camera obscura. Introduced experimental method.",c:C.gold},
    {name:"Willebrord Snellius",years:"1580–1626",
     contrib:"Discovered the law of refraction experimentally (1621). Published posthumously by Descartes as 'Snell's law'.",c:C.accent1},
    {name:"Pierre de Fermat",years:"1601–1665",
     contrib:"Principle of least time (1662): light takes the path that minimises travel time — predicts Snell's law from a single variational statement.",c:C.purple},
    {name:"Christiaan Huygens",years:"1629–1695",
     contrib:"Traité de la Lumière (1678): wave theory of light, Huygens' principle, double refraction in Iceland spar (calcite).",c:C.teal},
    {name:"Isaac Newton",years:"1643–1727",
     contrib:"Opticks (1704): dispersion of white light into spectrum, corpuscular theory, Newton's rings, first diffraction observations.",c:C.amber},
    {name:"Thomas Young",years:"1773–1829",
     contrib:"Double-slit experiment (1801): definitively proved the wave nature of light. First to use the word 'wavelength'.",c:C.green},
    {name:"Augustin-Jean Fresnel",years:"1788–1827",
     contrib:"Wave theory of diffraction (1818), polarization, Fresnel equations, Fresnel zones, Fresnel lens. Synthesis of Huygens and Young.",c:C.red},
    {name:"James Clerk Maxwell",years:"1831–1879",
     contrib:"A Treatise on Electricity and Magnetism (1873): unified EM theory. Predicted c = 1/√(ε₀μ₀) — light is an electromagnetic wave.",c:C.pink},
  ];
  people.forEach((p,i)=>{
    const x=0.35+(i%2)*4.85, y=1.12+Math.floor(i/2)*1.08;
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:4.6,h:0.98,fill:{color:C.panel},line:{color:p.c,width:0.8}});
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:0.18,h:0.98,fill:{color:p.c},line:{color:p.c,width:0}});
    s.addText(`${p.name}  (${p.years})`,{x:x+0.26,y:y+0.06,w:4.26,h:0.28,fontSize:10.5,bold:true,color:C.white,fontFace:"Georgia"});
    s.addText(p.contrib,{x:x+0.26,y:y+0.38,w:4.26,h:0.54,fontSize:9.5,color:C.offwhite,fontFace:"Calibri"});
  });
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Nature of Light: References, Problems & Projects","NATURE OF LIGHT · REFERENCES",
  ["Hecht, Optics, 5th ed. (2017) — Pearson. Chapters 1–5. The standard BSc optics text.",
   "Jenkins & White, Fundamentals of Optics, 4th ed. (2001) — McGraw-Hill. Chapters 1–4.",
   "Born & Wolf, Principles of Optics, 7th ed. (1999) — Cambridge. Chapters 1–3.",
   "Feynman Lectures on Physics, Vol. I, Ch. 26–33. Free at feynmanlectures.caltech.edu.",
   "Newton, Opticks (1704) — Dover reprint. Original dispersion and colour experiments."],
  ["Saleh & Teich, Fundamentals of Photonics, 3rd ed. (2019) — Wiley. Chapters 1–5.",
   "Mandel & Wolf, Optical Coherence and Quantum Optics (1995) — Cambridge. Coherence theory.",
   "Born & Wolf, Chapters 8–12: polarization, coherence, interference at graduate level.",
   "Agrawal, Nonlinear Fiber Optics (2019): dispersion engineering in modern fibres.",
   "Dirac, The Principles of Quantum Mechanics Ch. 1: single-photon interference."],
  ["[BSc] Starting from Maxwell's equations in vacuum, derive the wave equation and show c = 1/√(ε₀μ₀).",
   "[BSc] A BK7 glass lens (n=1.517) has R₁=50mm, R₂=−50mm. Compute f, then verify with the thin-lens imaging formula for dₒ=200mm.",
   "[BSc] Calculate the coherence length of a sodium lamp (Δλ=0.6nm at λ=589nm). How many fringes are visible in a Michelson interferometer?",
   "[MSc] Using the Sellmeier equation for BK7, compute the GVD β₂ at 800nm. How long does a 100fs Gaussian pulse remain transform-limited after propagating 10 cm?",
   "[Project: BSc] Write a Python simulation of Young's double-slit with finite-width slits. Plot fringe visibility vs. slit separation for different coherence lengths."]);

pres.writeFile({fileName:"/home/claude/lecture_03a_nature_of_light.pptx"})
  .then(()=>console.log("✓ lecture_03a_nature_of_light.pptx"))
  .catch(e=>console.error(e));
