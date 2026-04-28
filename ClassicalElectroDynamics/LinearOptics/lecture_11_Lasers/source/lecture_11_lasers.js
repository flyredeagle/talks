// ═══════════════════════════════════════════════════════════════
//  LECTURE 03c: Lasers & Coherent Light Sources
//  Run: node lecture_03c_lasers.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide } = S;

const pres = newPres("Linear Optics — Lecture 03c: Lasers & Coherent Sources","03c");

lectureTitleSlide(pres,"03c",
  "Lasers & Coherent Light Sources",
  "Population Inversion · Stimulated Emission · Resonators · Coherence · Laser Types",
  C.green);

// ── Einstein coefficients & stimulated emission ────────────────
{
  const s = cSlide(pres,"Einstein Coefficients: Absorption, Spontaneous & Stimulated Emission","LASERS");
  txt(s,"Einstein (1917) showed that an electromagnetic field interacting with a two-level atom produces three processes. The ratio of their rates is fixed by thermodynamics — and stimulated emission is the key to laser amplification.",
      0.35,1.12,9.3,0.58,{fs:12});
  const processes=[
    {t:"Absorption",c:C.red,
     b:"Rate: W_abs = B₁₂ ρ(ν) N₁\nAtom in ground state |1⟩ absorbs photon hν → excited state |2⟩.\nRate proportional to radiation density ρ(ν) and population N₁."},
    {t:"Spontaneous Emission",c:C.amber,
     b:"Rate: W_sp = A₂₁ N₂\nExcited atom decays randomly to |1⟩, emitting photon in random direction and phase.\nLifetime τ = 1/A₂₁. This is noise in a laser."},
    {t:"Stimulated Emission",c:C.green,
     b:"Rate: W_st = B₂₁ ρ(ν) N₂\nIncoming photon triggers |2⟩ → |1⟩ + identical photon.\nSame frequency, phase, polarization, direction — coherent amplification!"},
  ];
  processes.forEach((p,i)=>{
    const x=0.35+i*3.2;
    panel(s,pres,x,1.78,3.05,2.25,p.c); hdr(s,pres,x,1.78,3.05,p.c,p.t);
    txt(s,p.b,x+0.1,2.08,2.84,1.88,{fs:10.5,col:C.offwhite,font:"Consolas"});
  });
  panel(s,pres,0.35,4.1,9.3,1.32,C.teal); hdr(s,pres,0.35,4.1,9.3,C.teal,"Einstein relations and the condition for gain");
  bul(s,["B₁₂ = B₂₁ (absorption and stimulated emission coefficients are equal — symmetry)",
         "A₂₁ = 8πhν³/c³ · B₂₁ (spontaneous emission increases steeply with frequency)",
         "Net gain requires N₂ > N₁ (population inversion) — impossible in thermal equilibrium (Boltzmann: N₂/N₁=exp(−hν/kT) < 1)",
         "Population inversion requires a pumping mechanism — 3-level or 4-level system"],
    0.43,4.4,9.1,0.96,10.5);
}

// ── Population inversion and pumping ──────────────────────────
{
  const s = cSlide(pres,"Population Inversion: 3-Level and 4-Level Systems","LASERS");
  txt(s,"Thermal equilibrium always has more atoms in lower levels (Boltzmann). Pumping drives the system away from equilibrium. The key requirement: upper laser level lifetime τ₂ ≫ lower level lifetime τ₁.",
      0.35,1.12,9.3,0.55,{fs:12});

  // 3-level diagram
  panel(s,pres,0.35,1.75,4.55,3.62,C.teal); hdr(s,pres,0.35,1.75,4.55,C.teal,"3-level system (e.g. Ruby, 694nm)");
  const lx3=0.65, lw3=3.95;
  [[5.4,C.gold,"3: pump band"],[4.5,C.orange,"(fast decay)"],[3.6,C.red,"2: upper laser level\n(long lifetime τ~3ms)"],[1.82,C.accent1,"1: ground state"]].forEach(([yf,col,lbl],i)=>{
    const ya=1.75+5.4-yf*0.55;
    if(i!==1){
      s.addShape(pres.shapes.LINE,{x:lx3,y:ya,w:lw3,h:0,line:{color:col||C.teal,width:2.5}});
      s.addText(lbl,{x:lx3+0.06,y:ya-0.28,w:lw3-0.1,h:0.26,fontSize:8.5,color:col||C.teal,fontFace:"Calibri"}); }
  });
  // Transitions
  s.addShape(pres.shapes.LINE,{x:lx3+0.5,y:1.75+5.4-5.4*0.55,w:0,h:0.55,line:{color:C.gold,width:2}});
  s.addText("pump",{x:lx3+0.55,y:1.75+5.4-5.4*0.55+0.05,w:0.65,h:0.2,fontSize:7.5,color:C.gold,fontFace:"Calibri"});
  s.addShape(pres.shapes.LINE,{x:lx3+1.5,y:1.75+5.4-3.6*0.55,w:0,h:(3.6-1.82)*0.55,line:{color:C.red,width:2.5}});
  s.addText("laser\n694nm",{x:lx3+1.58,y:1.75+5.4-3.0*0.55,w:0.8,h:0.4,fontSize:8,color:C.red,fontFace:"Calibri"});
  bul(s,["Lower level = ground state → needs >50% inversion → hard to achieve","Requires strong pumping (flashlamp)","First laser (Maiman 1960): pulsed ruby"],lx3-0.22,4.65,lw3+0.22,0.62,9.5);

  // 4-level diagram
  panel(s,pres,5.1,1.75,4.55,3.62,C.gold); hdr(s,pres,5.1,1.75,4.55,C.gold,"4-level system (e.g. Nd:YAG, 1064nm)");
  const lx4=5.4, lw4=3.95;
  [[5.5,C.gold,"4: pump band"],[4.5,C.muted,"(fast decay)"],[3.6,C.green,"3: upper laser level (τ~230μs)"],[2.0,C.accent1,"2: lower laser level (fast decay)"],[1.0,C.offwhite,"1: ground state"]].forEach(([yf,col,lbl],i)=>{
    const ya=1.75+5.5-yf*0.52;
    if(i!==1){
      s.addShape(pres.shapes.LINE,{x:lx4,y:ya,w:lw4,h:0,line:{color:col,width:2.5}});
      s.addText(lbl,{x:lx4+0.06,y:ya-0.27,w:lw4-0.1,h:0.25,fontSize:8,color:col,fontFace:"Calibri"});
    }
  });
  s.addShape(pres.shapes.LINE,{x:lx4+0.5,y:1.75+5.5-5.5*0.52,w:0,h:0.52,line:{color:C.gold,width:2}});
  s.addText("pump",{x:lx4+0.55,y:1.75+5.5-5.5*0.52+0.04,w:0.65,h:0.2,fontSize:7.5,color:C.gold,fontFace:"Calibri"});
  s.addShape(pres.shapes.LINE,{x:lx4+1.5,y:1.75+5.5-3.6*0.52,w:0,h:(3.6-2.0)*0.52,line:{color:C.green,width:2.5}});
  s.addText("laser\n1064nm",{x:lx4+1.58,y:1.75+5.5-3.0*0.52,w:0.9,h:0.4,fontSize:8,color:C.green,fontFace:"Calibri"});
  bul(s,["Lower level depleted rapidly → easy inversion even at low pump","CW operation straightforward","Most practical solid-state and gas lasers"],lx4-0.27,4.65,lw4+0.2,0.62,9.5);
}

// ── Optical cavity & modes ─────────────────────────────────────
{
  const s = cSlide(pres,"The Optical Resonator: Modes and Threshold","LASERS");
  txt(s,"Two mirrors form a Fabry-Pérot resonator. The gain medium inside provides amplification; the mirrors provide feedback. Lasing starts when the round-trip gain equals the round-trip loss.",
      0.35,1.12,9.3,0.55,{fs:12});
  // Cavity diagram
  const ox=0.38,oy=1.75,dw=9.25,dh=1.95;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.teal,width:1}});
  s.addText("Fabry-Pérot laser cavity",{x:ox+0.08,y:oy+0.07,w:dw-0.16,h:0.22,fontSize:8.5,bold:true,color:C.teal,fontFace:"Calibri",align:"center"});
  const ay2=oy+dh/2;
  s.addShape(pres.shapes.LINE,{x:ox+0.18,y:ay2,w:dw-0.36,h:0,line:{color:C.muted,width:0.8,dashType:"dash"}});
  // Mirrors
  s.addShape(pres.shapes.RECTANGLE,{x:ox+0.18,y:ay2-0.58,w:0.22,h:1.16,fill:{color:C.teal},line:{color:C.teal,width:0}});
  s.addShape(pres.shapes.RECTANGLE,{x:ox+dw-0.4,y:ay2-0.58,w:0.22,h:1.16,fill:{color:C.accent1,transparency:40},line:{color:C.accent1,width:2}});
  s.addText("HR\nR=100%",{x:ox+0.04,y:ay2-0.28,w:0.42,h:0.56,fontSize:7,color:C.teal,fontFace:"Calibri",align:"center"});
  s.addText("OC\nR<100%",{x:ox+dw-0.45,y:ay2-0.28,w:0.48,h:0.56,fontSize:7,color:C.accent1,fontFace:"Calibri",align:"center"});
  // Gain medium
  s.addShape(pres.shapes.RECTANGLE,{x:ox+2.2,y:ay2-0.45,w:4.8,h:0.9,fill:{color:C.green,transparency:82},line:{color:C.green,width:1.5}});
  s.addText("Gain medium  (stimulated emission)",{x:ox+2.3,y:ay2-0.2,w:4.6,h:0.4,fontSize:9,color:C.green,fontFace:"Calibri",align:"center"});
  // Beam arrows
  for(let i=0;i<3;i++){
    const yoff=(i-1)*0.18;
    s.addShape(pres.shapes.LINE,{x:ox+0.42,y:ay2+yoff,w:dw-0.84,h:0,line:{color:C.accent1,width:0.8,transparency:20+i*15}});
  }
  // Output beam
  s.addShape(pres.shapes.LINE,{x:ox+dw-0.18,y:ay2-0.22,w:0.55,h:0,line:{color:C.gold,width:2.5}});
  s.addShape(pres.shapes.LINE,{x:ox+dw-0.18,y:ay2+0.22,w:0.55,h:0,line:{color:C.gold,width:2.5}});
  s.addText("Output\nbeam",{x:ox+dw+0.12,y:ay2-0.22,w:0.8,h:0.44,fontSize:8,color:C.gold,fontFace:"Calibri"});
  s.addText("L",{x:ox+dw/2-0.15,y:oy+dh-0.42,w:0.3,h:0.3,fontSize:12,bold:true,color:C.muted,fontFace:"Georgia"});

  panel(s,pres,0.35,3.78,4.55,1.62,C.teal); hdr(s,pres,0.35,3.78,4.55,C.teal,"Longitudinal modes & threshold");
  bul(s,["Resonance: round-trip phase = 2πm → ν_m = mc/(2nL)","Mode spacing: Δν = c/(2nL) (FSR — free spectral range)","Threshold: round-trip gain G = R₁R₂exp(2gL) ≥ 1","Above threshold: gain clamps to threshold; power grows in cavity"],
    0.43,4.08,4.37,1.24,10.5);

  panel(s,pres,5.1,3.78,4.55,1.62,C.gold); hdr(s,pres,5.1,3.78,4.55,C.gold,"Transverse modes (TEM)");
  bul(s,["TEM₀₀ (fundamental Gaussian): lowest loss, best beam quality, M²=1","TEM₁₀, TEM₀₁ (Hermite-Gaussian): higher-order spatial modes","Ring/unstable cavities: different mode structure and output coupling","Mode selection: aperture inside cavity kills higher-order modes"],
    5.18,4.08,4.37,1.24,10.5);
}

// ── Coherence ─────────────────────────────────────────────────
{
  const s = cSlide(pres,"Laser Coherence: Temporal and Spatial","LASERS · COHERENCE");
  txt(s,"A laser's coherence properties follow directly from its spectral purity and the spatial quality of its mode. Both far exceed any thermal light source.",
      0.35,1.12,9.3,0.52,{fs:12});
  panel(s,pres,0.35,1.72,4.55,3.68,C.accent1); hdr(s,pres,0.35,1.72,4.55,C.accent1,"Temporal coherence");
  bul(s,["Coherence time: τc = 1/Δν  (inverse of linewidth)",
         "Coherence length: Lc = c·τc = c/Δν = λ²/Δλ",
         "Single-mode HeNe (Δν~1MHz): Lc ≈ 300m",
         "Multimode laser (Δν~1GHz): Lc ≈ 30cm",
         "Thermal lamp (Δλ~1nm at 590nm): Lc ≈ 0.35mm",
         "Interference fringes visible only for path difference < Lc",
         "Holography requires Lc larger than depth of object"],
    0.43,2.02,4.37,3.28,10.5);
  panel(s,pres,5.1,1.72,4.55,3.68,C.green); hdr(s,pres,5.1,1.72,4.55,C.green,"Spatial coherence");
  bul(s,["Spatial coherence: correlation of E-field across the beam wavefront",
         "Single transverse mode (TEM₀₀): fully spatially coherent across beam",
         "Spatial coherence radius: rc ≈ λ/(2θ_div)  (van Cittert–Zernike)",
         "Fully coherent beam: can be focused to a diffraction-limited spot",
         "M² = 1: ideal Gaussian. Real beams M²>1",
         "Sun: spatially coherent over only ~0.1mm (small angular diameter)",
         "Required for laser cutting, holography, coherent LiDAR"],
    5.18,2.02,4.37,3.28,10.5);
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.47,w:9.3,h:0.15,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"Schawlow-Townes linewidth: Δν_min = 2πhν(Δν_cavity)²/P_out — quantum limit. Single-mode semiconductor lasers approach this.",
    0.5,5.49,9.0,0.14,{fs:8.5,col:C.muted,italic:true});
}

// ── Laser types gallery ────────────────────────────────────────
{
  const s = cSlide(pres,"Laser Types: A Gallery of Coherent Sources","LASERS · TYPES");
  const types=[
    {t:"He-Ne (gas)",λ:"632.8 nm",c:C.red,
     b:"DC discharge tube; 4-level; cw; M²≈1.05. Holography, metrology. Δν<1MHz possible."},
    {t:"Nd:YAG (solid state)",λ:"1064 nm",c:C.amber,
     b:"Flashlamp or diode-pumped; Q-switch → ns pulses; SHG→532nm. Material processing, ranging."},
    {t:"Ti:Sapphire (tunable)",λ:"700–1000 nm",c:C.purple,
     b:"Tunable ultrabroadband; mode-locked → <10 fs pulses; pumped by 532nm. Ultrafast science."},
    {t:"CO₂ (gas)",λ:"10.6 μm",c:C.teal,
     b:"IR; kW average power possible; cutting/welding steel. Gas flow cooling required."},
    {t:"Diode (semiconductor)",λ:"375–2000 nm",c:C.green,
     b:"Electrically pumped p-n junction; tiny, efficient, cheap; M²~2–10. Telecom, pumping, LiDAR."},
    {t:"Fibre (Er:fibre)",λ:"1550 nm",c:C.accent1,
     b:"Er³⁺ doped SiO₂ fibre; cw or pulsed; excellent beam quality; used in telecom amplifiers (EDFA)."},
    {t:"Excimer (UV)",λ:"193–351 nm",
     c:C.pink,b:"KrF 248nm, ArF 193nm; pulsed; UV lithography (chip manufacture), eye surgery (LASIK)."},
    {t:"Free-Electron Laser",λ:"tunable, X-ray",c:C.gold,
     b:"Relativistic electrons wiggling in undulator → coherent X-rays. Brightest X-ray source; large facility."},
  ];
  types.forEach((t,i)=>{
    const x=0.35+(i%2)*4.85, y=1.12+Math.floor(i/2)*1.08;
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:4.6,h:0.98,fill:{color:C.panel},line:{color:t.c,width:0.8}});
    s.addShape(pres.shapes.RECTANGLE,{x,y,w:0.18,h:0.98,fill:{color:t.c},line:{color:t.c,width:0}});
    s.addText(`${t.t}  —  λ = ${t.λ}`,{x:x+0.26,y:y+0.06,w:4.26,h:0.28,fontSize:10.5,bold:true,color:C.white,fontFace:"Georgia"});
    s.addText(t.b,{x:x+0.26,y:y+0.38,w:4.26,h:0.54,fontSize:9.5,color:C.offwhite,fontFace:"Calibri"});
  });
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Lasers & Coherence: References, Problems & Projects","LASERS · REFERENCES",
  ["Hecht, Optics, 5th ed. — Ch. 13: lasers. Clear undergraduate treatment.",
   "Saleh & Teich, Fundamentals of Photonics — Ch. 14–15: laser amplifiers and oscillators.",
   "Yariv & Yeh, Photonics (2006) — Ch. 5–6: laser oscillation, coherence.",
   "Svelto, Principles of Lasers, 5th ed. (2010): comprehensive from Einstein coefficients to ultrafast."],
  ["Siegman, Lasers (1986) — University Science Books. The definitive graduate text.",
   "Saleh & Teich, Fundamentals of Photonics — Ch. 11: Coherence theory (temporal and spatial).",
   "Mandel & Wolf, Optical Coherence and Quantum Optics (1995): rigorous coherence theory.",
   "Diels & Rudolph, Ultrashort Laser Pulse Phenomena (2006): mode-locking, fs pulses.",
   "Schawlow & Townes (1958) Phys. Rev. 112, 1940: original laser proposal paper."],
  ["[BSc] For a 1m long HeNe laser cavity (n≈1), find the FSR and the approximate number of cavity modes under the 1.5 GHz gain bandwidth.",
   "[BSc] Show that for a 4-level system, the threshold inversion density is N_th = α_loss/(B₂₁ · hν · τ_rt). Explain each symbol.",
   "[BSc] Calculate the coherence length of (a) a single-mode HeNe laser with Δν=1 MHz, (b) a multimode diode laser with Δλ=3nm at 780nm.",
   "[MSc] Derive the Schawlow-Townes linewidth formula from the spontaneous-emission noise model. What limits real lasers above this?",
   "[MSc Project] Model a Gaussian-beam resonator using ABCD matrices. Find the eigenmode waist for a plano-concave cavity (L=300mm, R=500mm) at 1064nm."]);

pres.writeFile({fileName:"/home/claude/lecture_03c_lasers.pptx"})
  .then(()=>console.log("✓ lecture_03c_lasers.pptx"))
  .catch(e=>console.error(e));
