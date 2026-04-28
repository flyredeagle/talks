// ═══════════════════════════════════════════════════════════════
//  LECTURE 05: Introduction to Polarization
//  Sits between ABCD Matrices (04) and Jones Calculus (06).
//  Run: node lecture_05_polarization_intro.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C,base,cSlide,fImg,dImg,panel,hdr,bul,txt,refSlide,newPres,lectureTitleSlide,makeShadow } = S;

const pres = newPres("Linear Optics — Lecture 05: Introduction to Polarization","05");

lectureTitleSlide(pres,"05",
  "Introduction to Polarization",
  "E-Field Decomposition · Linear · Circular · Elliptical · Fresnel Equations · Birefringence",
  C.teal);

// ─────────────────────────────────────────────────────────────
//  SLIDE 1 — What is polarization?
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"What is Polarization?","POLARIZATION INTRO");
  txt(s,"A transverse electromagnetic wave has its E-field oscillating perpendicular to the propagation direction k. The polarization state describes the direction and time-dependence of that E-field oscillation.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pol_efield_decomp",0.35,1.73,9.3,0.72);

  const states=[
    {t:"Unpolarized",c:C.muted,
     b:"E-field direction changes randomly on a timescale much shorter than detection. e.g. sunlight, thermal lamps. DOP = 0."},
    {t:"Partially polarized",c:C.amber,
     b:"Mix of polarized and unpolarized components. 0 < DOP < 1. e.g. skylight (Rayleigh scattering), reflected light from surfaces."},
    {t:"Linearly polarized",c:C.accent1,
     b:"E-field oscillates along a fixed direction (δ=0 or π). Polarizing filters, laser beams, reflections at Brewster's angle."},
    {t:"Circularly polarized",c:C.green,
     b:"E-field tip traces a circle. Equal amplitudes, δ=±π/2. Optical activity (chiral molecules), quarter-wave plates."},
    {t:"Elliptically polarized",c:C.purple,
     b:"E-field tip traces an ellipse. General case — includes linear and circular as special cases. Arbitrary δ, E₀ₓ≠E₀ᵧ."},
    {t:"Why polarization matters",c:C.gold,
     b:"LCD displays, sunglasses, optical isolators, ellipsometry, astronomy (CMB polarization), LIGO, quantum key distribution."},
  ];
  states.forEach((sv,i)=>{
    const x=0.35+(i%3)*3.2, y=2.58+Math.floor(i/3)*1.42;
    panel(s,pres,x,y,3.05,1.32,sv.c); hdr(s,pres,x,y,3.05,sv.c,sv.t);
    txt(s,sv.b,x+0.1,y+0.32,2.84,0.94,{fs:10.5});
  });
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 2 — Linear polarization
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Linear Polarization: In-Phase Components","POLARIZATION · LINEAR");
  txt(s,"When the x and y components of the E-field are in phase (δ=0) or anti-phase (δ=π), the tip of the E-field vector traces a straight line — linear polarization.",
      0.35,1.12,9.3,0.52,{fs:12});
  fImg(s,"pol_linear",0.35,1.7,9.3,0.72);
  fImg(s,"pol_malus_full",0.35,2.48,9.3,0.68);

  // Polarization angle diagram
  const ox=0.42, oy=3.26, bw=4.35, bh=2.1;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:bw,h:bh,fill:{color:"0A1628"},line:{color:C.accent1,width:1}});
  s.addText("Linear polarization states at various angles θ",{x:ox+0.08,y:oy+0.07,w:bw-0.16,h:0.22,fontSize:8,bold:true,color:C.accent1,fontFace:"Calibri",align:"center"});
  const cx=ox+bw/2, cy=oy+bh/2+0.1;
  // Axes
  s.addShape(pres.shapes.LINE,{x:ox+0.2,y:cy,w:bw-0.4,h:0,line:{color:C.muted,width:0.8,dashType:"dash",transparency:40}});
  s.addShape(pres.shapes.LINE,{x:cx,y:oy+0.35,w:0,h:bh-0.5,line:{color:C.muted,width:0.8,dashType:"dash",transparency:40}});
  const angles=[{a:0,c:C.accent1,l:"H (0°)"},{a:90,c:C.teal,l:"V (90°)"},{a:45,c:C.gold,l:"+45°"},{a:-45,c:C.green,l:"−45°"},{a:30,c:C.amber,l:"30°"}];
  const R=0.62;
  angles.forEach(({a,c,l})=>{
    const rad=a*Math.PI/180;
    const dx=R*Math.cos(rad), dy=-R*Math.sin(rad);
    s.addShape(pres.shapes.LINE,{x:cx-dx,y:cy-dy,w:2*dx,h:2*dy,line:{color:c,width:2.2}});
    s.addShape(pres.shapes.OVAL,{x:cx+dx-0.06,y:cy+dy-0.06,w:0.12,h:0.12,fill:{color:c},line:{color:c,width:0}});
    s.addText(l,{x:cx+dx*1.12-0.3,y:cy+dy*1.12-0.14,w:0.6,h:0.25,fontSize:8,color:c,fontFace:"Calibri",align:"center"});
  });

  panel(s,pres,5.02,3.26,4.63,2.1,C.teal); hdr(s,pres,5.02,3.26,4.63,C.teal,"Malus's law and polarizer cascades");
  bul(s,["A linear polarizer transmits the projection of E onto its transmission axis",
         "Output intensity: I = I₀cos²θ  (Malus's law, 1809)",
         "Two crossed polarizers: I = I₀cos²90° = 0 (complete extinction)",
         "Three polarizers at 0°, 45°, 90°: I = I₀ × cos²45° × cos²45° = I₀/4  (light gets through!)",
         "Extinction ratio (ER): I_max/I_min — sheet: ~10³, Glan-Taylor prism: >10⁵"],
    5.10,3.58,4.45,1.7,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 3 — Circular polarization
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Circular and Elliptical Polarization","POLARIZATION · ELLIPTICAL");
  txt(s,"When the two components have equal amplitude but a 90° phase difference, the E-field tip traces a circle. Unequal amplitudes or arbitrary phase give an ellipse — the most general polarization state.",
      0.35,1.12,9.3,0.52,{fs:12});
  fImg(s,"pol_circular",  0.35,1.7, 9.3,0.68);
  fImg(s,"pol_elliptical",0.35,2.44,9.3,0.82);
  fImg(s,"pol_ellipse_params",0.35,3.32,9.3,0.8);

  panel(s,pres,0.35,4.22,4.55,1.15,C.green); hdr(s,pres,0.35,4.22,4.55,C.green,"Circular polarization properties");
  bul(s,["RCP: E₀ₓ=E₀ᵧ=E₀, δ=−π/2. Tip rotates counter-clockwise viewed toward source",
         "LCP: δ=+π/2. Tip rotates clockwise",
         "Photon spin: RCP carries +ℏ, LCP carries −ℏ angular momentum",
         "Optical activity: chiral molecules rotate the plane of linear polarization"],
    0.43,4.52,4.37,0.78,10.5);
  panel(s,pres,5.1,4.22,4.55,1.15,C.purple); hdr(s,pres,5.1,4.22,4.55,C.purple,"Ellipse parameters ψ and χ");
  bul(s,["ψ ∈ [0,π): orientation angle of ellipse major axis",
         "χ ∈ [−π/4,π/4]: ellipticity angle. χ=0 → linear, χ=±π/4 → circular",
         "Any state lives on the Poincaré sphere: (2ψ,2χ) → (azimuth,elevation)",
         "Linear states on equator, circular at poles, elliptical in between"],
    5.18,4.52,4.37,0.78,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 4 — Fresnel equations: reflection and polarization
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Fresnel Equations: How Interfaces Create Polarization","POLARIZATION · FRESNEL");
  txt(s,"At any dielectric interface, s- and p-polarizations reflect and transmit differently. This is described by the Fresnel equations — derived from Maxwell's boundary conditions (continuity of tangential E and H).",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pol_snell_splane",0.35,1.73,9.3,0.78);
  fImg(s,"pol_snell_pplane",0.35,2.57,9.3,0.78);
  fImg(s,"pol_reflectance", 0.35,3.41,9.3,0.78);

  // s vs p definition box
  panel(s,pres,0.35,4.28,4.55,1.1,C.teal); hdr(s,pres,0.35,4.28,4.55,C.teal,"Defining s and p polarizations");
  bul(s,["s-polarization (TE, senkrecht): E-field perpendicular to the plane of incidence",
         "p-polarization (TM): E-field parallel to the plane of incidence",
         "Any polarization = s + p decomposition at an interface",
         "Convention: plane of incidence = plane containing incident ray and surface normal"],
    0.43,4.58,4.37,0.73,10.5);

  panel(s,pres,5.1,4.28,4.55,1.1,C.gold); hdr(s,pres,5.1,4.28,4.55,C.gold,"Physical consequences");
  bul(s,["Normal incidence (θᵢ=0): Rₛ=Rₚ=(n₁−n₂)²/(n₁+n₂)² — glass~4% per surface",
         "Grazing incidence: both Rₛ→1 and Rₚ→1 (total reflection at θᵢ→90°)",
         "At Brewster's angle: Rₚ=0 — reflected light is purely s-polarized",
         "Phase shift: r<0 means 180° phase flip (e.g. rₛ for n₁<n₂ always negative)"],
    5.18,4.58,4.37,0.73,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 5 — Brewster's angle with diagram
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Brewster's Angle: Zero Reflection for p-Polarization","POLARIZATION · BREWSTER");
  txt(s,"At Brewster's angle θ_B = arctan(n₂/n₁), the reflected and refracted rays are perpendicular. The oscillating dipoles in the glass cannot radiate along their axis — so no p-polarized reflection occurs.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"pol_brewster",0.35,1.73,9.3,0.72);

  // Brewster geometry diagram
  const ox=0.38,oy=2.55,dw=4.35,dh=2.8;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.amber,width:1}});
  s.addText("Brewster angle geometry",{x:ox+0.08,y:oy+0.07,w:dw-0.16,h:0.22,fontSize:8,bold:true,color:C.amber,fontFace:"Calibri",align:"center"});
  const iy=oy+1.52;
  s.addShape(pres.shapes.LINE,{x:ox+0.1,y:iy,w:dw-0.2,h:0,line:{color:C.gold,width:2}});
  s.addShape(pres.shapes.RECTANGLE,{x:ox+0.1,y:iy,w:dw-0.2,h:dh-1.62,fill:{color:C.teal,transparency:90},line:{color:C.teal,width:0}});
  s.addText("n₁ (air)",{x:ox+0.15,y:oy+0.35,w:0.8,h:0.2,fontSize:8,color:C.accent1,fontFace:"Calibri"});
  s.addText("n₂ (glass)",{x:ox+0.15,y:iy+0.08,w:0.9,h:0.2,fontSize:8,color:C.teal,fontFace:"Calibri"});
  // Normal
  const cpx=ox+dw/2, cpy=iy;
  s.addShape(pres.shapes.LINE,{x:cpx,y:oy+0.35,w:0,h:dh-0.48,line:{color:C.muted,width:1,dashType:"dash"}});
  // Incident at ~56° for air/glass
  const tB=56*Math.PI/180;
  s.addShape(pres.shapes.LINE,{x:cpx-Math.sin(tB)*1.0,y:cpy-Math.cos(tB)*1.0,w:Math.sin(tB)*1.0,h:Math.cos(tB)*1.0,line:{color:C.accent1,width:2.2}});
  // Reflected at θB — s only
  s.addShape(pres.shapes.LINE,{x:cpx,y:cpy,w:Math.sin(tB)*1.0,h:-Math.cos(tB)*1.0,line:{color:C.accent2,width:1.8,dashType:"dash"}});
  s.addText("only s",{x:cpx+Math.sin(tB)*0.6,y:cpy-Math.cos(tB)*0.55,w:0.5,h:0.2,fontSize:8,color:C.accent2,fontFace:"Calibri"});
  // Refracted at 90°-θB from normal
  const tR=(90-56)*Math.PI/180;
  s.addShape(pres.shapes.LINE,{x:cpx,y:cpy,w:Math.sin(tR)*1.0,h:Math.cos(tR)*1.0,line:{color:C.green,width:2.2}});
  s.addText("θ_B",{x:cpx-0.62,y:cpy-0.55,w:0.38,h:0.28,fontSize:11,bold:true,color:C.accent1,fontFace:"Georgia"});
  s.addText("θᵣ=90°-θ_B",{x:cpx+0.04,y:cpy+0.25,w:1.1,h:0.22,fontSize:8,color:C.green,fontFace:"Calibri"});
  s.addText("θ_B + θᵣ = 90°",{x:ox+0.15,y:oy+dh-0.38,w:dw-0.3,h:0.26,fontSize:9.5,color:C.gold,fontFace:"Calibri",bold:true,align:"center"});
  // s+p arrows on incident
  s.addText("⊗ s\n→ p",{x:cpx-Math.sin(tB)*0.7-0.3,y:cpy-Math.cos(tB)*0.7,w:0.4,h:0.4,fontSize:9,color:C.accent1,fontFace:"Calibri"});

  panel(s,pres,4.93,2.55,4.72,2.8,C.amber); hdr(s,pres,4.93,2.55,4.72,C.amber,"Brewster angle — key values and uses");
  bul(s,["Air→glass (n₁=1, n₂=1.5): θ_B = arctan(1.5) = 56.3°",
         "Air→water (n₂=1.33): θ_B = 53.1° — glare from wet road is s-polarized",
         "Laser Brewster windows: tilted glass plates at θ_B give zero reflection loss for p-pol",
         "Polarization by reflection: sunlight reflected from non-metallic surfaces is partially s-polarized — sunglasses with vertical-transmission polarizers remove glare",
         "Anti-reflection: Brewster condition used in thin-film design for specific angles",
         "p-pol: oscillating dipoles parallel to reflected direction → cannot radiate back"],
    5.01,2.87,4.52,2.4,10.5);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 6 — Birefringence: how wave plates work
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Birefringence: Two Refractive Indices, One Crystal","POLARIZATION · BIREFRINGENCE");
  txt(s,"In an anisotropic crystal (e.g. calcite, quartz), the permittivity tensor ε is not scalar — it has different values along different crystal axes. Light polarized along the ordinary and extraordinary axes experiences different refractive indices nₒ and nₑ.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"pol_biref_retardance",0.35,1.78,9.3,0.75);

  panel(s,pres,0.35,2.63,4.55,1.72,C.teal); hdr(s,pres,0.35,2.63,4.55,C.teal,"How a wave plate works");
  bul(s,["A birefringent plate cut to thickness t has its optic axis in the plane of the surface",
         "Ordinary ray (⊥ optic axis): travels at c/nₒ — unaffected by crystal direction",
         "Extraordinary ray (‖ optic axis): travels at c/nₑ — different speed",
         "Phase difference (retardance): Γ = (2π/λ)(nₑ−nₒ)t",
         "QWP: Γ=π/2 — converts linear↔circular. HWP: Γ=π — rotates linear by 2θ"],
    0.43,2.93,4.37,1.34,10.5);

  panel(s,pres,5.1,2.63,4.55,1.72,C.gold); hdr(s,pres,5.1,2.63,4.55,C.gold,"Birefringent materials");
  bul(s,["Calcite (CaCO₃): Δn = nₑ−nₒ = −0.172 — largest natural birefringence. Glan prisms.",
         "Quartz (SiO₂ crystal): Δn = +0.009 — UV transparent, stable. Common wave plates.",
         "MgF₂: Δn = +0.011 — UV wave plates to 120nm",
         "YVO₄: Δn = +0.204 — very high birefringence, compact components",
         "LiNbO₃: nₒ=2.286, nₑ=2.200 — EO modulator and wave plate combined"],
    5.18,2.93,4.37,1.34,10.5);

  // Wave plate diagram
  const ox=0.38, oy=4.45, dw=4.35, dh=0.98;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.teal,width:1}});
  // Wave plate body
  s.addShape(pres.shapes.RECTANGLE,{x:ox+1.2,y:oy+0.1,w:1.6,h:0.78,fill:{color:C.teal,transparency:75},line:{color:C.teal,width:1.5}});
  // Fast axis label
  s.addShape(pres.shapes.LINE,{x:ox+1.45,y:oy+0.49,w:1.08,h:0,line:{color:C.gold,width:1.5}});
  s.addText("fast\naxis",{x:ox+1.35,y:oy+0.12,w:0.5,h:0.32,fontSize:7,color:C.gold,fontFace:"Calibri",align:"center"});
  // Input beam
  s.addShape(pres.shapes.LINE,{x:ox+0.18,y:oy+0.32,w:1.0,h:0,line:{color:C.green,width:2}});
  s.addShape(pres.shapes.LINE,{x:ox+0.18,y:oy+0.66,w:1.0,h:0,line:{color:C.accent1,width:2}});
  s.addText("slow nₑ",{x:ox+0.2,y:oy+0.16,w:0.7,h:0.18,fontSize:7,color:C.green,fontFace:"Calibri"});
  s.addText("fast nₒ",{x:ox+0.2,y:oy+0.72,w:0.7,h:0.18,fontSize:7,color:C.accent1,fontFace:"Calibri"});
  // Output beam with phase shift
  s.addShape(pres.shapes.LINE,{x:ox+2.82,y:oy+0.32,w:1.1,h:0,line:{color:C.green,width:2}});
  s.addShape(pres.shapes.LINE,{x:ox+2.82,y:oy+0.66,w:1.1,h:0.0,line:{color:C.accent1,width:2}});
  s.addText("Γ = (2π/λ)(nₑ−nₒ)t",{x:ox+1.22,y:oy+0.75,w:1.56,h:0.18,fontSize:7.5,color:C.gold,fontFace:"Consolas",align:"center"});

  panel(s,pres,5.1,4.45,4.55,0.98,C.purple); hdr(s,pres,5.1,4.45,4.55,C.purple,"Dichroism: polarization by absorption");
  fImg(s,"pol_dichroism",5.18,4.73,4.37,0.62);
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 7 — Polarization by scattering and natural effects
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Polarization in Nature: Scattering, Optical Activity & Stress","POLARIZATION · NATURAL");
  const topics=[
    {t:"Rayleigh Scattering (Sky)",c:C.accent1,
     b:"Sunlight scattered by air molecules (size ≪ λ). Scattered intensity ∝ 1/λ⁴ (blue sky). At 90° from sun, scattered light is ~70% linearly s-polarized. Polarized sunglasses remove glare from sky, water, roads."},
    {t:"Mie Scattering (Clouds)",c:C.muted,
     b:"Scattering from particles ~ λ (water droplets). Much less polarization than Rayleigh. Clouds are white because large droplets scatter all wavelengths equally."},
    {t:"Optical Activity (Chirality)",c:C.green,
     b:"Chiral molecules (sugars, proteins, quartz) rotate the plane of linear polarization. Specific rotation [α]: sugar at 589nm is +66.5°/dm per g/mL. Used in saccharimetry, drug purity testing, molecular biology."},
    {t:"Faraday Effect (Magneto-optic)",c:C.amber,
     b:"Applied magnetic field B rotates polarization: θ_F = VBL (Verdet constant V). Non-reciprocal — backwards traversal rotates further, not back. Basis of optical isolators (Lecture 06, Jones)."},
    {t:"Photoelastic Stress Birefringence",c:C.teal,
     b:"Mechanical stress creates birefringence Δn ∝ stress. Stressed glass/plastic between crossed polarizers shows coloured fringe patterns. Used in engineering stress analysis (photoelasticity)."},
    {t:"Polarization in Astronomy",c:C.purple,
     b:"Starlight polarized by aligned interstellar dust grains → maps galactic magnetic fields. CMB polarization (E/B modes) — evidence for primordial gravitational waves from inflation. Pulsar emission is highly polarized."},
  ];
  topics.forEach((t,i)=>{
    const x=0.35+(i%2)*4.85, y=1.12+Math.floor(i/3)*1.42+Math.floor(i/2%3>0?0:0);
    // 3 rows of 2
    const row=Math.floor(i/2), col=i%2;
    const ry=1.12+row*1.45, rx=0.35+col*4.85;
    panel(s,pres,rx,ry,4.6,1.35,t.c); hdr(s,pres,rx,ry,4.6,t.c,t.t);
    txt(s,t.b,rx+0.1,ry+0.32,4.38,0.95,{fs:10});
  });
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 8 — Polarimetry: measuring polarization state
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Polarimetry: Measuring the Polarization State","POLARIZATION · MEASUREMENT");
  txt(s,"To fully characterise an arbitrary polarization state we need to measure its Stokes parameters S₀–S₃ — four real intensity measurements that capture amplitude, orientation, and handedness.",
      0.35,1.12,9.3,0.52,{fs:12});
  fImg(s,"mueller_stokes",0.35,1.7,5.2,1.38);

  // 4 intensity measurements
  panel(s,pres,5.65,1.7,4.0,1.38,C.accent1); hdr(s,pres,5.65,1.7,4.0,C.accent1,"Four-measurement polarimetry");
  bul(s,["I₁: no filter → I₁ = S₀  (total power)",
         "I₂: H polarizer → I₂ = (S₀+S₁)/2",
         "I₃: +45° polarizer → I₃ = (S₀+S₂)/2",
         "I₄: QWP + H polarizer → I₄ = (S₀+S₃)/2",
         "Solve: S₁=2I₂−I₁, S₂=2I₃−I₁, S₃=2I₄−I₁"],
    5.73,2.0,3.82,1.0,10);

  const methods=[
    {t:"Division-of-time (rotating wave plate)",c:C.teal,
     b:"Rotate QWP + fixed polarizer: measure Stokes by fitting intensity vs. angle. Sequential: slow but simple. Standard lab polarimeter."},
    {t:"Division-of-amplitude (simultaneous)",c:C.gold,
     b:"Beam splitters + 4 detectors simultaneously — fast, no moving parts. Used in real-time polarimetry, biomedical imaging."},
    {t:"Imaging Polarimetry",c:C.purple,
     b:"Wire-grid or nano-patterned micropolarizer arrays on a sensor. Each 2×2 pixel block has 0°,45°,90°,135° polarizers → full Stokes image at video rate."},
    {t:"Ellipsometry",c:C.green,
     b:"Measure Ψ and Δ at various wavelengths and angles → infer film thickness (sub-nm accuracy), optical constants n and k. Semiconductor fabrication, thin film characterization."},
  ];
  methods.forEach((m,i)=>{
    const x=0.35+(i%2)*4.85, y=3.18+Math.floor(i/2)*1.2;
    panel(s,pres,x,y,4.6,1.1,m.c); hdr(s,pres,x,y,4.6,m.c,m.t);
    txt(s,m.b,x+0.1,y+0.32,4.38,0.7,{fs:10.5});
  });
}

// ─────────────────────────────────────────────────────────────
//  SLIDE 9 — Summary & connection to Jones/Mueller
// ─────────────────────────────────────────────────────────────
{
  const s = cSlide(pres,"Summary & Road Map: From Physics to Algebra","POLARIZATION · SUMMARY");
  txt(s,"We have seen the physical picture of polarization. The next lectures give us the algebraic tools to calculate with it efficiently: Jones calculus for coherent beams, Mueller calculus for partially polarized light.",
      0.35,1.12,9.3,0.6,{fs:12});

  const table=[
    ["Concept","Physical origin","Mathematical tool","Lecture"],
    ["Polarization state","E-field ellipse (Eₓ,Eᵧ,δ)","Jones 2-vector","06 Jones"],
    ["Polarization component","Selective absorption/reflection","Jones 2×2 matrix","06 Jones"],
    ["Cascade of elements","Multiplication of matrices","M = Jₙ···J₁","06 Jones"],
    ["Partial polarization","Incoherent superposition","Stokes 4-vector","10 Mueller"],
    ["General optical element","Amplitude + depolarization","Mueller 4×4 matrix","10 Mueller"],
    ["Degree of polarization","Mix of coherent + incoherent","DOP = √(S₁²+S₂²+S₃²)/S₀","10 Mueller"],
    ["Birefringence","Anisotropic εᵣ tensor","Wave plate Jones matrix","06 Jones"],
    ["Brewster / Fresnel","Interface boundary conditions","Fresnel rₛ,rₚ → r,t matrices","Lec 05 (here)"],
  ];
  const colW=[2.5,2.5,2.8,1.15], rowH=0.48;
  const tx=0.35, ty=1.82;
  // Header
  table[0].forEach((h,j)=>{
    let cx=tx; for(let k=0;k<j;k++) cx+=colW[k];
    s.addShape(pres.shapes.RECTANGLE,{x:cx,y:ty,w:colW[j],h:0.3,fill:{color:C.teal},line:{color:C.teal,width:0}});
    s.addText(h,{x:cx+0.04,y:ty+0.02,w:colW[j]-0.08,h:0.26,fontSize:9,bold:true,color:C.white,fontFace:"Calibri"});
  });
  const rowCols=[C.accent1,C.accent1,C.accent1,C.purple,C.purple,C.purple,C.teal,C.amber];
  table.slice(1).forEach((row,i)=>{
    row.forEach((cell,j)=>{
      let cx=tx; for(let k=0;k<j;k++) cx+=colW[k];
      const ry=ty+0.3+i*rowH;
      s.addShape(pres.shapes.RECTANGLE,{x:cx,y:ry,w:colW[j],h:rowH-0.04,fill:{color:j===0?rowCols[i]:C.panel},line:{color:C.mid,width:0.4}});
      s.addText(cell,{x:cx+0.04,y:ry+0.04,w:colW[j]-0.08,h:rowH-0.1,fontSize:j===3?9:9.5,bold:j===0,color:j===0?C.dark:j===3?C.gold:C.offwhite,fontFace:j>=2?"Consolas":"Calibri"});
    });
  });
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.5,w:9.3,h:0.12,fill:{color:C.mid},line:{color:C.mid,width:0}});
  txt(s,"Key insight: every polarization state is a point on (or inside) the Poincaré sphere. Every optical element moves that point on the sphere. Jones and Mueller calculus make this movement computable.",
    0.45,5.52,9.1,0.12,{fs:8.5,col:C.muted,italic:true});
}

// ── References ─────────────────────────────────────────────────
refSlide(pres,"Polarization: References, Problems & Projects","POLARIZATION · REFERENCES",
  ["Hecht, Optics, 5th ed. — Ch. 8: polarization. Excellent intuitive coverage with worked examples.",
   "Born & Wolf, Principles of Optics — Ch. 1.4–1.5: polarization states; Ch. 1.5: Fresnel equations.",
   "Jenkins & White, Fundamentals of Optics — Ch. 24–26: polarization and crystal optics.",
   "Saleh & Teich, Fundamentals of Photonics — Ch. 6.1: polarization and crystal optics.",
   "Pedrotti, Introduction to Optics — Ch. 14–16: polarization, birefringence, Fresnel."],
  ["Yariv & Yeh, Optical Waves in Crystals (1984): rigorous tensor treatment of polarization in crystals.",
   "Chipman, Handbook of Optics Vol. II, Ch. 22: polarimetry and measurement of polarization.",
   "Azzam & Bashara, Ellipsometry and Polarized Light (1977) — North-Holland. Definitive.",
   "Collett, Field Guide to Polarization (SPIE 2005): compact graduate reference.",
   "Huard, Polarization of Light (1997) — Wiley. Strong on Poincaré sphere and experiments."],
  ["[BSc] Show that for normal incidence on glass (n=1.5), R = ((n−1)/(n+1))² ≈ 4% per surface from the Fresnel equations.",
   "[BSc] A wave plate has Δn=0.009 (quartz) at λ=633nm. What thickness gives (a) a QWP, (b) a HWP? Compute both in mm.",
   "[BSc] Light at 45° passes through three polarizers at 0°, 45°, 90°. Compute output intensity as a fraction of input using Malus's law at each step.",
   "[BSc] Find Brewster's angle for an air-glass interface (n=1.5) and for air-water (n=1.33). Verify θ_B + θ_refracted = 90° in each case.",
   "[MSc] Derive the Fresnel equation for rₛ from Maxwell's boundary conditions (tangential E continuous, tangential H continuous).",
   "[MSc] Starting from the ellipse equation, derive the expressions for ψ (tilt angle) and χ (ellipticity angle) in terms of E₀ₓ, E₀ᵧ, and δ.",
   "[MSc Project] Build a Mueller matrix ellipsometer in simulation: generate synthetic Ψ(λ) and Δ(λ) data for a thin SiO₂ film on Si, then invert to recover film thickness."]);

pres.writeFile({fileName:"/home/claude/lecture_05_polarization_intro.pptx"})
  .then(()=>console.log("✓ lecture_05_polarization_intro.pptx"))
  .catch(e=>console.error(e));
