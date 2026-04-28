// ═══════════════════════════════════════════════════════════════
//  LECTURE 3: Jones Calculus
//  Run: node lecture_03_jones.js
// ═══════════════════════════════════════════════════════════════
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 3: Jones Calculus",3);

lectureTitleSlide(pres,"03","Jones Calculus",
  "Polarization Algebra · Jones Vectors · Component Matrices · Superposition",C.gold);

// ── Jones vectors ──────────────────────────────────────────────
{
  const s=cSlide(pres,"Jones Vectors: Representing Polarization States","JONES CALCULUS");
  fImg(s,"jones_vector",0.35,1.12,5.5,0.92);
  fImg(s,"jones_states",0.35,2.1,9.3,0.88);
  const states=[
    {name:"H linear",vec:"[1, 0]ᵀ",c:C.accent1},{name:"V linear",vec:"[0, 1]ᵀ",c:C.teal},
    {name:"+45° linear",vec:"[1, 1]ᵀ / √2",c:C.gold},{name:"RCP",vec:"[1, −i]ᵀ / √2",c:C.green},
    {name:"LCP",vec:"[1, +i]ᵀ / √2",c:C.amber},{name:"Elliptical",vec:"[cosχ, i sinχ]ᵀ",c:C.purple},
  ];
  states.forEach((sv,i)=>{
    const x=0.35+(i%3)*3.2, y=3.12+(Math.floor(i/3))*1.2;
    panel(s,pres,x,y,3.05,1.1,sv.c); hdr(s,pres,x,y,3.05,sv.c,sv.name);
    txt(s,sv.vec,x+0.1,y+0.32,2.82,0.68,{fs:12,col:C.accent3,font:"Consolas"});
  });
}

// ── Linear Polarizer ───────────────────────────────────────────
{
  const s=cSlide(pres,"Jones Matrix: Linear Polarizer","JONES CALCULUS");
  fImg(s,"jones_polarizer",0.35,1.12,5.35,1.05);
  dImg(s,"pol_polarizer",0.35,2.22,5.35,1.38);
  fImg(s,"bsc_malus",0.35,3.68,5.35,0.62);
  panel(s,pres,0.35,4.38,5.35,1.0,C.accent1); hdr(s,pres,0.35,4.38,5.35,C.accent1,"Key Properties");
  bul(s,["J_H · J_V = 0  (crossed polarizers block each other)","ER = I_max/I_min: sheet ~10³:1, Glan-Taylor >10⁵:1","Acceptance angle, wavelength range, damage threshold are key specs"],0.43,4.68,5.12,0.62,10.5);
  panel(s,pres,5.9,1.12,3.75,4.28,C.accent1); hdr(s,pres,5.9,1.12,3.75,C.accent1,"Microscopic Structure & Materials");
  txt(s,"Sheet polarizers (Polaroid™): PVA film stretched to align polymer chains, doped with iodine chains that absorb the E-component parallel to the stretch direction (dichroism). ER~10³:1.\n\nWire-grid polarizers: sub-λ Al or Au wires on ZnSe or fused silica substrate. TM transmitted, TE reflected. Used in IR/THz.\n\nGlan-Taylor prism: calcite birefringence (nₑ=1.658, nₒ=1.486) separates polarizations via TIR at the cemented interface. ER>10⁵:1.",5.98,1.44,3.57,3.05,{fs:10.5});
  txt(s,"Thorlabs LPVIS100 (sheet)\nGlan-Taylor calcite (ER>10⁵:1)\nIR wire-grid: ZnSe substrate\nPBS cube: MacNeille coating",5.98,4.52,3.57,0.82,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── Wave plate ─────────────────────────────────────────────────
{
  const s=cSlide(pres,"Jones Matrix: Wave Plate (Phase Retarder)","JONES CALCULUS");
  fImg(s,"jones_waveplate",0.35,1.12,9.3,0.95);
  dImg(s,"pol_waveplate",0.35,2.12,9.3,1.15);
  const types=[
    {n:"QWP (Γ=π/2)",c:C.teal,d:"Converts +45° linear → RCP. Converts circular → linear. Used in optical isolators and ellipsometry."},
    {n:"HWP (Γ=π)",c:C.gold,d:"Rotates linear polarization by 2θ. Converts RCP → LCP. Used in beam steering and polarization rotation."},
    {n:"Full wave (Γ=2π)",c:C.green,d:"Identity for all polarization states except at oblique angles. Used in birefringence compensators."},
  ];
  types.forEach((t,i)=>{
    const x=0.35+i*3.2;
    panel(s,pres,x,3.38,3.05,1.65,t.c); hdr(s,pres,x,3.38,3.05,t.c,t.n);
    txt(s,t.d,x+0.08,3.68,2.88,1.28,{fs:10.5});
  });
  s.addShape(S.base(pres).constructor, {});
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.1,w:9.3,h:0.32,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"Materials: Calcite Δn=0.172 · Quartz Δn=0.009 · MgF₂ Δn=0.011 · LiNbO₃ (tunable EO) · YVO₄ nₑ=2.149,nₒ=1.945 · PVA polymer films",0.5,5.12,9.1,0.28,{fs:8.5,col:C.muted});
}

// ── Beamsplitter ───────────────────────────────────────────────
{
  const s=cSlide(pres,"Jones Matrix: Beamsplitter & Polarizing Beamsplitter","JONES CALCULUS");
  fImg(s,"jones_bs",0.35,1.12,5.35,0.95);
  dImg(s,"pol_bs",0.35,2.12,5.35,1.22);
  panel(s,pres,0.35,3.42,5.35,1.32,C.purple); hdr(s,pres,0.35,3.42,5.35,C.purple,"PBS matrices & interference condition");
  txt(s,"J_T = [1,0;0,0]  (transmits p-pol / H)\nJ_R = [0,0;0,1]  (reflects s-pol / V)\nInterference visibility = 1 only when both beams have same polarization state",0.43,3.72,5.12,0.95,{fs:10.5,col:C.offwhite,font:"Consolas"});
  panel(s,pres,5.9,1.12,3.75,4.28,C.purple); hdr(s,pres,5.9,1.12,3.75,C.purple,"Microscopic Structure & Materials");
  txt(s,"Cube BS: two right-angle prisms cemented (optical cement n~1.52) with metal-dielectric or all-dielectric coating at hypotenuse, designed for R≈T at 45°.\n\nPlate BS: tilted glass plate — introduces walk-off astigmatism. Simpler but less achromatic.\n\nPBS MacNeille design: multilayer coating on hypotenuse. TIR-based PBS (Glan-Thompson): very high ER.\n\nMaterials: BK7 (VIS), fused silica (UV), ZnSe (mid-IR), CaF₂ (broad IR).",5.98,1.44,3.57,3.05,{fs:10.5});
  txt(s,"50:50 cube: Thorlabs BS010\nPBS cube: ER>500:1\nGlan-Thompson: TIR-based, high ER\nNon-polarizing cube: equal R/T",5.98,4.52,3.57,0.82,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── Faraday Rotator ────────────────────────────────────────────
{
  const s=cSlide(pres,"Jones Matrix: Faraday Rotator & Optical Isolator","JONES CALCULUS");
  fImg(s,"jones_faraday",0.35,1.12,5.35,0.95);
  dImg(s,"pol_faraday",0.35,2.12,5.35,1.22);
  txt(s,"Non-reciprocal: back-propagating light rotates by ADDITIONAL +θ_F (not −θ_F). Breaks time-reversal symmetry.",0.35,3.42,5.35,0.55,{fs:11});
  panel(s,pres,0.35,4.05,5.35,1.28,C.amber); hdr(s,pres,0.35,4.05,5.35,C.amber,"Optical Isolator (30–60 dB isolation)");
  txt(s,"P(0°) → Faraday 45° → P(45°)  [forward: 0°→45°→pass]\nBackward: 45°→45°+45°=90° → blocked by P(0°)",0.43,4.33,5.12,0.92,{fs:10.5});
  panel(s,pres,5.9,1.12,3.75,4.28,C.amber); hdr(s,pres,5.9,1.12,3.75,C.amber,"Microscopic Structure & Materials");
  txt(s,"Magneto-optical effect: applied B-field lifts degeneracy of LCP/RCP modes via Zeeman splitting → n₊≠n₋ (circular birefringence). θ_F = (n₋−n₊)πL/λ.\n\nYIG (Y₃Fe₅O₁₂): cubic garnet, Ia3̄d space group. V≈−0.12°/(Oe·cm) at 1064nm.\n\nTGG (Tb₃Ga₅O₁₂): V≈−134 rad/(T·m) at 1064nm. Dominant for high-power lasers.\n\nBi:YIG thin film: very high Verdet for integrated photonics isolators.",5.98,1.44,3.57,3.05,{fs:10.5});
  txt(s,"YIG: V≈−0.12°/(Oe·cm)\nTGG: V≈−134 rad/(T·m)\nBi:YIG: integrated photonics\nInsertion loss: <0.3 dB",5.98,4.52,3.57,0.82,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── EOM ────────────────────────────────────────────────────────
{
  const s=cSlide(pres,"Jones Matrix: Electro-Optic Modulator (Pockels EOM)","JONES CALCULUS");
  fImg(s,"jones_eom",0.35,1.12,5.35,0.92);
  dImg(s,"pol_eom",0.35,2.08,5.35,1.2);
  panel(s,pres,0.35,3.35,5.35,1.58,C.green); hdr(s,pres,0.35,3.35,5.35,C.green,"Pockels Effect Fundamentals");
  txt(s,"χ⁽²⁾ ≠ 0 required (non-centrosymmetric crystal). Applied E-field changes n via Δn = −½n³rE (linear EO / Pockels coefficient r). LiNbO₃: r₃₃≈31 pm/V. AC voltage V(t) modulates polarization state dynamically for RF modulation up to ~40 GHz.",0.43,3.65,5.12,1.2,{fs:10.5});
  panel(s,pres,5.9,1.12,3.75,4.28,C.green); hdr(s,pres,5.9,1.12,3.75,C.green,"Microscopic Structure & Materials");
  txt(s,"LiNbO₃: trigonal (R3c), ferroelectric at RT. r₃₃=31 pm/V, Vπ~200–400V for cm-length crystal. Telecom modulator workhorse.\n\nKTP (KTiOPO₄): orthorhombic (Pna2₁). r₃₃=35 pm/V, lower Vπ.\n\nBBO (β-BaB₂O₄): UV range, r₂₂=2.7 pm/V. For UV pulse pickers.\n\nLithium niobate on insulator (LNOI): Vπ<1V in nanophotonic waveguide, >100GHz bandwidth.",5.98,1.44,3.57,3.05,{fs:10.5});
  txt(s,"RF EOM: GHz modulation\nQ-switch, pulse picker\nMach-Zehnder modulator\nLNOI: Vπ<1V, >100GHz BW",5.98,4.52,3.57,0.82,{fs:10.5,col:C.accent3,font:"Consolas"});
}

// ── Superposition ──────────────────────────────────────────────
{
  const s=cSlide(pres,"Linear Superposition & Cascade in Jones Calculus","JONES CALCULUS");
  txt(s,"Jones calculus is a direct application of linear algebra. The linearity of Maxwell's equations means both Jones vectors and matrices obey the superposition principle:",0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"jones_superpos",0.35,1.73,9.3,0.72);
  fImg(s,"jones_cascade",0.35,2.5,9.3,0.72);
  panel(s,pres,0.35,3.3,4.55,2.08,C.teal); hdr(s,pres,0.35,3.3,4.55,C.teal,"Superposition Examples");
  bul(s,["H + V (δ=0): E=[1,1]ᵀ/√2 → +45° linear polarization","H + V (δ=π/2): E=[1,i]ᵀ/√2 → right circular polarization","Any elliptical state is a superposition of H and V basis states","RCP and LCP are a complete circular basis"],0.43,3.6,4.37,1.68,10.5);
  panel(s,pres,5.1,3.3,4.55,2.08,C.gold); hdr(s,pres,5.1,3.3,4.55,C.gold,"Linearity Across Multiple Components");
  bul(s,["System J = Jₙ·...·J₂·J₁ — product of all element matrices","J·(aE₁+bE₂) = aJ·E₁ + bJ·E₂ for any complex a,b","Holds through any number of elements: full linearity retained","Consequence: polarization state space is a complex vector space"],5.18,3.6,4.37,1.68,10.5);
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Jones Calculus: References, Problems & Projects","JONES CALCULUS · REFERENCES",
  ["Hecht, Optics Ch. 8: polarization — intuitive introduction with diagrams.",
   "Pedrotti Ch. 14–16: matrix methods for polarization.",
   "Saleh & Teich Ch. 6: polarization optics and Jones matrices.",
   "Hecht Ch. 9: birefringence, wave plates, polarizing elements."],
  ["Yariv & Yeh, Optical Waves in Crystals (1984): definitive Jones/Mueller with crystal physics.",
   "Chipman, Handbook of Optics Vol. II Ch. 22–27: Jones and Mueller — comprehensive.",
   "Collett, Field Guide to Polarization (SPIE 2005): compact graduate reference.",
   "Azzam & Bashara, Ellipsometry and Polarized Light (1977): Mueller/Stokes depth."],
  ["[BSc] Compute J = J_QWP(45°)·J_HWP(22.5°). Verify it rotates horizontal → vertical polarization.",
   "[BSc] Show a HWP with fast axis at 45° converts RCP to LCP. Use Jones matrix formalism.",
   "[BSc] An isolator: Faraday 45° between two polarizers. Compute forward and backward transmission in dB.",
   "[MSc] Derive the Jones matrix for a Babinet-Soleil compensator; show it generates any polarization state from horizontal input.",
   "[MSc] Compute the Jones matrix for a Lyot filter and plot the transmission spectrum vs. wavelength.",
   "[Project: MSc] Simulate a full Stokes polarimeter (4-state measurement); reconstruct Stokes vector from noisy intensity data."]);

pres.writeFile({fileName:"/home/claude/lecture_03_jones.pptx"})
  .then(()=>console.log("✓ lecture_03_jones.pptx"))
  .catch(e=>console.error(e));
