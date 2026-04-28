const pptxgen = require("/home/claude/.npm-global/lib/node_modules/pptxgenjs");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "The Logistic Map — Complete Edition v4";

const C = {
  dark:   "0D1B2A", mid:    "1E3A5F", mid2:   "132940",
  accent: "00D4FF", orange: "FF6B35", white:  "FFFFFF",
  light:  "E8F4F8", muted:  "7CA9C4", green:  "7FFF00",
  purple: "BB86FC", yellow: "FFD700", red:    "FF4444",
};

function img(name) {
  const buf = fs.readFileSync(`/home/claude/${name}`);
  const ext = name.endsWith('.jpg') ? 'image/jpeg' : 'image/png';
  return ext + ";base64," + buf.toString("base64");
}

const I = {
  bifurc:       img("bifurcation.png"),
  bifurcFull:   img("bifurc_full.png"),
  timeseries:   img("timeseries.png"),
  cobweb4:      img("cobweb4.png"),
  lyapunov:     img("lyapunov.png"),
  butterfly:    img("butterfly.png"),
  phasespace:   img("phasespace.png"),
  period3:      img("period3_window.png"),
  density:      img("invariant_density.png"),
  wikiAnim:     img("wikipedia_animation_frame.jpg"),
  allRegimes:   img("all_regimes.png"),
  regime1:      img("regime1_extinction.png"),
  regime2:      img("regime2_fixed.png"),
  regime3:      img("regime3_perioddoubling.png"),
  regime4:      img("regime4_chaos.png"),
  intermit:     img("intermittency_detail.png"),
  devaney:      img("devaney_chaos.png"),
  // NEW
  odeBehaviours: img("ode_behaviours.png"),
  odeDerivation: img("ode_to_map_derivation.png"),
  odeVsMap:      img("ode_vs_map.png"),
};

// ─── helpers ────────────────────────────────────────────────────
function hdr(s, title, sub) {
  s.background = { color: C.dark };
  s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:10,h:0.07, fill:{color:C.accent}, line:{type:"none"} });
  s.addText(title, { x:0.5,y:0.13,w:9,h:0.68, fontSize:26,fontFace:"Cambria",bold:true,color:C.white,margin:0 });
  if (sub) {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5,y:0.83,w:0.05,h:0.3, fill:{color:C.accent},line:{type:"none"} });
    s.addText(sub, { x:0.65,y:0.83,w:8.5,h:0.3, fontSize:11.5,fontFace:"Calibri",color:C.muted,italic:true,margin:0 });
  }
}
function card(s,x,y,w,h,opts={}) {
  s.addShape(pres.shapes.RECTANGLE, {
    x,y,w,h, fill:{color:opts.color||C.mid}, line:{type:"none"},
    shadow: opts.shadow!==false ? {type:"outer",blur:7,offset:2,angle:135,color:"000000",opacity:0.28} : undefined
  });
  if (opts.topbar) s.addShape(pres.shapes.RECTANGLE,{x,y,w,h:0.055,fill:{color:opts.topbar},line:{type:"none"}});
}
function eqBox(s,x,y,w,h,text,opts={}) {
  s.addShape(pres.shapes.RECTANGLE, {x,y,w,h, fill:{color:"0A0F1A"}, line:{color:opts.borderColor||C.accent,width:opts.bw||1.5}});
  s.addText(text, {x,y,w,h, fontSize:opts.fs||18,fontFace:"Cambria",bold:true,color:opts.color||C.accent,align:"center",valign:"middle"});
}
function bullet(s,x,y,w,h,col,text,opts={}) {
  s.addShape(pres.shapes.RECTANGLE,{x,y:y+0.06,w:0.055,h:h-0.06,fill:{color:col},line:{type:"none"}});
  s.addText(text,{x:x+0.1,y,w:w-0.1,h, fontSize:opts.fs||11.5,fontFace:"Calibri",color:opts.textColor||C.light,margin:0,valign:"middle"});
}

// ════════════════════════════════════════════════════════════════
// SLIDE 1: Title
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  s.background = { color: C.dark };
  s.addShape(pres.shapes.RECTANGLE,{x:7.1,y:0,w:2.9,h:5.625,fill:{color:C.mid},line:{type:"none"}});
  s.addShape(pres.shapes.RECTANGLE,{x:9.5,y:0,w:0.5,h:5.625,fill:{color:C.accent},line:{type:"none"}});
  s.addImage({data:I.bifurcFull,x:7.15,y:0.05,w:2.3,h:5.5,transparency:40});
  s.addText("The Logistic Map",{x:0.5,y:0.75,w:6.4,h:1.2,fontSize:44,fontFace:"Cambria",bold:true,color:C.white});
  s.addText("From Order to Chaos — Complete Edition",{x:0.5,y:1.85,w:6.4,h:0.65,fontSize:22,fontFace:"Cambria",color:C.accent,italic:true});
  s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:2.62,w:5.5,h:0.04,fill:{color:C.accent},line:{type:"none"}});
  s.addText("ODE derivation · All dynamical regimes · Wikipedia summary · BSc Physics",{x:0.5,y:2.72,w:6.3,h:0.45,fontSize:12.5,fontFace:"Calibri",color:C.muted});
  const topics=["From the Verhulst ODE → discrete map derivation","Extinction · Fixed Points · Damped Oscillation · Period-Doubling","Feigenbaum Universality · Intermittency · Topological Mixing · Devaney Chaos"];
  topics.forEach((t,i)=>s.addText(t,{x:0.5,y:3.25+i*0.38,w:6.3,h:0.35,fontSize:11,fontFace:"Calibri",color:C.muted,italic:true}));
  s.addText("BSc Physics · Nonlinear Dynamics & Chaos",{x:0.5,y:5.08,w:4,h:0.38,fontSize:12,fontFace:"Calibri",color:C.muted});
}

// ════════════════════════════════════════════════════════════════
// SLIDE 2: Definition & History
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"Definition & Historical Background","From population ecology to chaos theory");
  card(s,0.35,1.28,4.55,4.05,{topbar:C.accent});
  s.addText("The Logistic Map",{x:0.5,y:1.4,w:4.25,h:0.38,fontSize:14,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("A discrete dynamical system defined by:",{x:0.5,y:1.82,w:4.25,h:0.3,fontSize:12,fontFace:"Calibri",color:C.light});
  eqBox(s,0.55,2.12,4.15,0.7,"xₙ₊₁ = r · xₙ · (1 − xₙ)");
  const defs=[["xₙ ∈ [0,1]","normalised population (ratio to max)"],["r ∈ [0,4]","growth/reproduction rate parameter"],["n = 0,1,2…","discrete generation / time step"]];
  let dy=2.96; defs.forEach(([k,v])=>{
    s.addText(k,{x:0.6,y:dy,w:1.5,h:0.38,fontSize:12,fontFace:"Cambria",bold:true,color:C.accent,margin:0,valign:"middle"});
    s.addText(v,{x:2.1,y:dy,w:2.65,h:0.38,fontSize:12,fontFace:"Calibri",color:C.light,margin:0,valign:"middle"});
    dy+=0.42;
  });
  s.addText("It is a polynomial mapping of degree 2 — a recurrence relation that maps the phase space [0,1] to itself.",{x:0.5,y:4.28,w:4.3,h:0.75,fontSize:11.5,fontFace:"Calibri",color:C.muted,italic:true});
  card(s,5.1,1.28,4.55,4.05,{topbar:C.orange});
  s.addText("Key Contributors",{x:5.25,y:1.4,w:4.2,h:0.38,fontSize:14,bold:true,color:C.orange,fontFace:"Cambria"});
  const ppl=[["Verhulst","1838","Original logistic ODE for population dynamics"],["Ulam & von Neumann","1940s","Map as pseudo-random number generator"],["Edward Lorenz","1960s","Irregular solutions in climate systems"],["Robert May","1976","Landmark paper; complex/chaotic behaviour in ecology"],["Mitchell Feigenbaum","1975–78","Universal constant δ ≈ 4.6692 via renormalisation"],["Oleksandr Sharkovsky","1964","Period-3 ⟹ all periods (Sharkovksy's theorem)"]];
  let py=1.88; ppl.forEach(([n,y,d])=>{
    s.addShape(pres.shapes.RECTANGLE,{x:5.2,y:py,w:0.055,h:0.52,fill:{color:C.orange},line:{type:"none"}});
    s.addText(n+" ("+y+")",{x:5.32,y:py,w:4.2,h:0.26,fontSize:11.5,fontFace:"Cambria",bold:true,color:C.orange,margin:0});
    s.addText(d,{x:5.32,y:py+0.25,w:4.2,h:0.27,fontSize:10.5,fontFace:"Calibri",color:C.light,margin:0});
    py+=0.58;
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 3 (NEW): The Continuous Logistic ODE & its Qualitative Behaviours
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"The Continuous Logistic ODE: dN/dt = rN(1 − N/K)","Qualitative behaviour of the differential equation — before discretisation");

  // Top: image occupies most of the slide
  s.addImage({data:I.odeBehaviours, x:0.3,y:1.18,w:9.4,h:3.72});

  // Bottom row: 4 key facts as compact callout boxes
  const facts=[
    {col:C.green,  icon:"📈", title:"Sigmoid Growth",    text:"All trajectories with N₀∈(0,K) follow an S-curve to K — no oscillation, no chaos."},
    {col:C.accent, icon:"🎯", title:"Two Fixed Points",   text:"N*=0 (unstable) and N*=K (globally stable). The phase portrait has ONE attractor for all r>0."},
    {col:C.orange, icon:"⏱", title:"Speed via r",        text:"Larger r → faster convergence to K. The growth rate parameter controls speed, not qualitative behaviour."},
    {col:C.purple, icon:"🚫", title:"No Chaos Possible",  text:"The ODE has a single stable equilibrium for every r>0. Chaos and oscillation require discretisation."},
  ];
  facts.forEach((f,i)=>{
    const bx=0.3+i*2.42;
    card(s,bx,5.02,2.28,0.55,{topbar:f.col,shadow:false});
    s.addText(f.icon+" "+f.title,{x:bx+0.1,y:5.07,w:2.08,h:0.26,fontSize:11,fontFace:"Cambria",bold:true,color:f.col});
    s.addText(f.text,{x:bx+0.1,y:5.3,w:2.08,h:0.27,fontSize:9.5,fontFace:"Calibri",color:C.light});
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 4 (NEW): From ODE to Discrete Map — the Derivation
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"From ODE to Discrete Map — Step-by-Step Derivation","How xₙ₊₁ = r·xₙ(1−xₙ) emerges from the Verhulst differential equation");

  // Left column: derivation chain as equation steps
  card(s,0.3,1.18,4.38,4.42,{topbar:C.accent});
  s.addText("The Derivation",{x:0.42,y:1.3,w:4.12,h:0.38,fontSize:14,bold:true,color:C.accent,fontFace:"Cambria"});

  const steps=[
    {n:"Step 1",col:C.green,  text:"Start with the Verhulst ODE:"},
    {n:"Eq 1",  col:null,     eq:"dN/dt = rN(1 − N/K)",fs:16},
    {n:"Step 2",col:C.green,  text:"Discretise with forward Euler, step h=1 generation:"},
    {n:"Eq 2",  col:null,     eq:"Nₙ₊₁ = Nₙ + r·Nₙ(1 − Nₙ/K)  =  (1+r)·Nₙ − (r/K)·Nₙ²",fs:12},
    {n:"Step 3",col:C.green,  text:"Rescale: let xₙ = Nₙ/K  (normalise by carrying capacity):"},
    {n:"Eq 3",  col:null,     eq:"xₙ₊₁ = (1+r)·xₙ − r·xₙ²  =  (1+r)·xₙ·(1 − r/(1+r)·xₙ)",fs:12},
    {n:"Step 4",col:C.green,  text:"Absorb (1+r) by relabelling r' = 1+r and y = r/(1+r)·x:"},
    {n:"Eq 4",  col:null,     eq:"xₙ₊₁ = r'·xₙ(1 − xₙ)",fs:17, col2:C.accent},
    {n:"Result",col:C.orange, text:"The logistic map! r' ∈ [1,5] for r ∈ [0,4]; conventionally relabelled r ∈ [0,4] with x∈[0,1]."},
  ];

  let sy=1.75;
  steps.forEach(st=>{
    if(st.eq){
      const bc=st.col2||C.muted;
      s.addShape(pres.shapes.RECTANGLE,{x:0.4,y:sy,w:4.15,h:st.n==="Eq 4"?0.55:0.48,fill:{color:"0A0F1A"},line:{color:bc,width:st.n==="Eq 4"?1.8:1}});
      s.addText(st.eq,{x:0.4,y:sy,w:4.15,h:st.n==="Eq 4"?0.55:0.48,fontSize:st.fs||13,fontFace:"Cambria",bold:st.n==="Eq 4",color:bc,align:"center",valign:"middle"});
      sy+=(st.n==="Eq 4"?0.62:0.56);
    } else {
      s.addShape(pres.shapes.RECTANGLE,{x:0.38,y:sy+0.05,w:0.055,h:0.36,fill:{color:st.col||C.accent},line:{type:"none"}});
      s.addText(st.n+": "+st.text,{x:0.5,y:sy,w:4.0,h:0.44,fontSize:11,fontFace:"Calibri",color:st.col===C.orange?C.orange:C.light,margin:0,valign:"middle"});
      sy+=0.47;
    }
  });

  // Right column: three diagrams
  s.addImage({data:I.odeDerivation, x:4.88,y:1.18,w:4.82,h:4.42});
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 (UPDATED): Population Model & Parameter Ranges
//   — now explicitly connects ODE behaviours to discrete map
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"ODE vs Discrete Map: Shared Behaviour & New Phenomena","How the continuous model maps onto — and is transcended by — the discrete logistic map");

  // Top: side-by-side comparison image
  s.addImage({data:I.odeVsMap, x:0.3,y:1.18,w:9.4,h:3.28});

  // Bottom: three comparison cards
  const cmp=[
    {col:C.green, title:"Shared: Stable Fixed Point",
     text:"For 1<r<3 the map converges to x*=1−1/r — exactly the ODE equilibrium N*=K. Damped oscillations appear because the discrete step can overshoot K, unlike the smooth ODE."},
    {col:C.orange,title:"New: Periodic Orbits (r>3)",
     text:"The ODE cannot oscillate — it has only one stable equilibrium. Discrete time allows orbits to jump past the fixed point each step, creating stable 2-, 4-, 8-cycles with no ODE counterpart."},
    {col:C.purple,title:"New: Chaos (r>r∞≈3.57)",
     text:"The ODE is entirely non-chaotic: dN/dt=rN(1−N/K) produces a sigmoid for every r. Chaos is a purely discrete-time phenomenon arising from the compounded nonlinearity of repeated iteration."},
  ];
  cmp.forEach((c,i)=>{
    const bx=0.3+i*3.18;
    card(s,bx,4.6,3.0,0.98,{topbar:c.col,shadow:false});
    s.addText(c.title,{x:bx+0.1,y:4.66,w:2.8,h:0.3,fontSize:11.5,fontFace:"Cambria",bold:true,color:c.col});
    s.addText(c.text,{x:bx+0.1,y:4.95,w:2.8,h:0.6,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 6: Parameter range table (was slide 3 in v3)
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"Parameter Ranges & Behaviour Summary","Complete classification of behaviour for all r ∈ [0, 4]");

  card(s,0.35,1.28,4.55,4.05,{topbar:C.accent});
  s.addText("Two Competing Effects",{x:0.5,y:1.4,w:4.25,h:0.38,fontSize:14,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText([
    {text:"Reproduction",options:{bold:true,color:C.accent,fontSize:13,breakLine:true}},
    {text:"The population grows at a rate proportional to its current size. When xₙ is small, xₙ₊₁ ≈ r·xₙ — exponential growth (same as ODE for small N).\n\n",options:{color:C.light,fontSize:11.5,breakLine:false}},
    {text:"Starvation / Carrying Capacity",options:{bold:true,color:C.orange,fontSize:13,breakLine:true}},
    {text:"The (1−xₙ) factor limits growth. As x→1, the next iterate is suppressed. In the ODE this damps growth smoothly; in the discrete map it can cause overshoot, oscillation, and chaos.",options:{color:C.light,fontSize:11.5}},
  ],{x:0.5,y:1.86,w:4.25,h:2.55,fontFace:"Calibri",paraSpaceAfter:3});
  s.addText("Key distinction from ODE: the discrete step size (h=1 generation) means the population can overshoot K each time step. This overshoot is the seed of oscillation and chaos.",{x:0.5,y:4.48,w:4.3,h:0.72,fontSize:11,fontFace:"Calibri",color:C.muted,italic:true});

  card(s,5.1,1.28,4.55,4.05,{topbar:C.orange});
  s.addText("Behaviour by Parameter Range",{x:5.25,y:1.4,w:4.2,h:0.38,fontSize:14,bold:true,color:C.orange,fontFace:"Cambria"});
  const ranges=[
    ["0 < r < 1",         C.red,    "Extinction — converges to x=0 (ODE analogue: population dies)"],
    ["1 < r < 2",         C.green,  "Monotone convergence to x*=1−1/r (ODE: smooth approach to K)"],
    ["2 < r < 3",         C.green,  "Damped oscillation to x* (ODE analogue but with overshoot)"],
    ["r = 3",             C.accent, "First bifurcation: period-1 → period-2 (NO ODE equivalent)"],
    ["3 < r < 3.449",     C.accent, "Stable period-2 oscillation (purely discrete phenomenon)"],
    ["3.449 < r < 3.544", C.accent, "Period-4 oscillation (second bifurcation)"],
    ["3.544 < r < 3.570", C.orange, "Period-8, 16, 32… cascade (Feigenbaum sequence)"],
    ["r > 3.570",         C.orange, "Chaotic regime (with periodic windows) — no ODE equivalent"],
    ["r > 4",             C.red,    "Orbits leave [0,1] — unphysical (map breaks down)"],
  ];
  let ry=1.9; ranges.forEach(([range,col,desc])=>{
    s.addShape(pres.shapes.RECTANGLE,{x:5.15,y:ry+0.04,w:1.55,h:0.3,fill:{color:"0A0F1A"},line:{color:col,width:0.8}});
    s.addText(range,{x:5.15,y:ry+0.04,w:1.55,h:0.3,fontSize:9.5,fontFace:"Cambria",bold:true,color:col,align:"center",valign:"middle"});
    s.addText(desc,{x:6.78,y:ry,w:2.77,h:0.4,fontSize:10,fontFace:"Calibri",color:C.light,valign:"middle",margin:0});
    ry+=0.41;
  });
}

// ════════════════════════════════════════════════════════════════
// SLIDE 7: Wikipedia regime overview + animation frame
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"Overview of All Dynamical Regimes","A Wikipedia animation frame shows the variety of behaviour as r increases from 0 to 4");
  card(s,0.3,1.2,4.5,4.1,{color:C.mid2});
  s.addText("Wikipedia: Logistic map (r = 0.02, t = 0…200)",{x:0.4,y:1.25,w:4.3,h:0.35,fontSize:11,fontFace:"Calibri",color:C.muted,italic:true});
  s.addImage({data:I.wikiAnim,x:0.35,y:1.6,w:4.45,h:3.55});
  card(s,5.05,1.2,4.6,4.1,{topbar:C.accent});
  s.addText("The Six Qualitative Regimes",{x:5.2,y:1.32,w:4.3,h:0.38,fontSize:14,bold:true,color:C.accent,fontFace:"Cambria"});
  const regs=[
    [C.red,    "0 < r < 1",       "Extinction — exponential decay to x=0"],
    [C.green,  "1 < r < 3",       "Stable Fixed Point — monotone or damped oscillation"],
    [C.accent, "3 < r < 3.449",   "Period-2 — stable 2-cycle oscillation"],
    [C.purple, "3.449 < r < r∞",  "Period-doubling cascade — 4, 8, 16… cycles"],
    [C.yellow, "r > r∞ ≈ 3.5699", "Chaos with periodic windows (intermittency)"],
    [C.orange, "r → 4",           "Fully developed chaos / topological mixing"],
  ];
  let ry=1.78; regs.forEach(([col,range,desc])=>{
    s.addShape(pres.shapes.RECTANGLE,{x:5.1,y:ry+0.03,w:0.055,h:0.5,fill:{color:col},line:{type:"none"}});
    s.addShape(pres.shapes.RECTANGLE,{x:5.18,y:ry,w:1.55,h:0.26,fill:{color:"0A0F1A"},line:{color:col,width:0.8}});
    s.addText(range,{x:5.18,y:ry,w:1.55,h:0.26,fontSize:9.5,fontFace:"Cambria",bold:true,color:col,align:"center",valign:"middle"});
    s.addText(desc,{x:6.82,y:ry,w:2.7,h:0.52,fontSize:10.5,fontFace:"Calibri",color:C.light,margin:0,valign:"middle"});
    ry+=0.6;
  });
  s.addText("Animation from Wikipedia shows x vs t as r sweeps 0→4: observe extinction, convergence, oscillation, period-doubling, and chaos in sequence.",{x:0.3,y:5.12,w:9.4,h:0.42,fontSize:11,fontFace:"Calibri",color:C.muted,align:"center"});
}

// ════════════════════════════════════════════════════════════════
// SLIDES 8–12: Regime slides (unchanged from v3 slides 4–8)
// ════════════════════════════════════════════════════════════════
// Regime 1: Extinction
{
  const s=pres.addSlide();
  hdr(s,"Regime 1: Extinction  (0 < r < 1)","Exponential decay to zero — the trivial fixed point is globally stable");
  s.addImage({data:I.regime1,x:0.3,y:1.18,w:9.4,h:3.55});
  card(s,0.3,4.88,4.5,0.65,{topbar:C.red});
  s.addText("Mathematics",{x:0.42,y:4.93,w:4.25,h:0.28,fontSize:12,bold:true,color:C.red,fontFace:"Cambria"});
  s.addText("Fixed point x*=0. Stability: |f'(0)| = r < 1 ✓.  Convergence is exponential: |xₙ| ~ rⁿ·x₀ → 0. Exactly analogous to the ODE: both give extinction for low growth rates.",{x:0.42,y:5.17,w:4.25,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
  card(s,5.1,4.88,4.55,0.65,{topbar:C.orange});
  s.addText("Physical Meaning",{x:5.22,y:4.93,w:4.3,h:0.28,fontSize:12,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("Reproduction rate too low to sustain the population. Every generation fewer individuals survive — population collapses to extinction regardless of x₀. ODE and map agree here.",{x:5.22,y:5.17,w:4.3,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
}
// Regime 2: Stable fixed point
{
  const s=pres.addSlide();
  hdr(s,"Regime 2: Stable Fixed Point  (1 < r < 3)","Monotone convergence (1<r<2) or damped oscillation (2<r<3) — ODE analogue with key differences");
  s.addImage({data:I.regime2,x:0.3,y:1.18,w:9.4,h:3.55});
  card(s,0.3,4.88,4.5,0.65,{topbar:C.green});
  s.addText("Sub-regimes & ODE Connection",{x:0.42,y:4.93,w:4.25,h:0.28,fontSize:12,bold:true,color:C.green,fontFace:"Cambria"});
  s.addText("1<r<2: monotone (like ODE). 2<r<3: damped oscillation — xₙ overshoots x* each step and rings back. This overshoot is absent in the ODE but is the first sign of discrete-time novelty. r=3: |f'(x*)|=1, critical slow-down.",{x:0.42,y:5.17,w:4.25,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
  card(s,5.1,4.88,4.55,0.65,{topbar:C.accent});
  s.addText("Stability Analysis",{x:5.22,y:4.93,w:4.3,h:0.28,fontSize:12,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("x* = 1−1/r. Stable when |f'(x*)| = |2−r| < 1, i.e. 1<r<3. Fixed point is the discrete analogue of N*=K in the ODE — same value, but reached with possible oscillation.",{x:5.22,y:5.17,w:4.3,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
}
// Regime 3: Period-doubling
{
  const s=pres.addSlide();
  hdr(s,"Regime 3: Period-Doubling Cascade  (3 < r < r∞ ≈ 3.5699)","Each bifurcation splits a stable cycle into two — infinitely, in a finite interval");
  s.addImage({data:I.regime3,x:0.3,y:1.18,w:9.4,h:3.55});
  card(s,0.3,4.88,5.9,0.65,{topbar:C.purple});
  s.addText("The Cascade — A Purely Discrete Phenomenon",{x:0.42,y:4.93,w:5.7,h:0.28,fontSize:12,bold:true,color:C.purple,fontFace:"Cambria"});
  s.addText("At each bifurcation point rₖ, the stable 2ᵏ-cycle loses stability → a 2ᵏ⁺¹-cycle appears. The ODE has no equivalent — the cascade is a consequence of the compounded overshoot in discrete iteration. Intervals shrink with ratio → δ ≈ 4.6692.",{x:0.42,y:5.17,w:5.7,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
  card(s,6.4,4.88,3.25,0.65,{topbar:C.accent});
  s.addText("Bifurcation values",{x:6.52,y:4.93,w:3.0,h:0.28,fontSize:12,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("r₁=3.000 (2-cycle) · r₂=3.449 (4) · r₃=3.544 (8) · r∞=3.5699 (∞-period)",{x:6.52,y:5.17,w:3.0,h:0.32,fontSize:10.5,fontFace:"Calibri",color:C.light});
}
// Regime 4: Chaos overview
{
  const s=pres.addSlide();
  hdr(s,"Regime 4: Chaotic Regime  (r > r∞)","Aperiodic orbits, periodic windows, intermittency, and topological mixing");
  s.addImage({data:I.regime4,x:0.3,y:1.18,w:9.4,h:3.55});
  card(s,0.3,4.88,3.0,0.65,{topbar:C.orange});
  s.addText("Early Chaos (r≈3.6)",{x:0.42,y:4.93,w:2.8,h:0.28,fontSize:11.5,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("Lyapunov λ>0. Aperiodic, bounded in [0,1], sensitive to initial conditions.",{x:0.42,y:5.17,w:2.8,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
  card(s,3.5,4.88,3.0,0.65,{topbar:C.yellow});
  s.addText("Intermittency (r≈3.828)",{x:3.62,y:4.93,w:2.8,h:0.28,fontSize:11.5,bold:true,color:C.yellow,fontFace:"Cambria"});
  s.addText("Near period-3 window: laminar (≈periodic) bursts interrupted by chaotic episodes.",{x:3.62,y:5.17,w:2.8,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
  card(s,6.7,4.88,3.0,0.65,{topbar:C.accent});
  s.addText("Full Chaos / Mixing (r=3.9)",{x:6.82,y:4.93,w:2.8,h:0.28,fontSize:11.5,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("Two orbits from nearly identical x₀ diverge exponentially. Phase space filled densely.",{x:6.82,y:5.17,w:2.8,h:0.32,fontSize:11,fontFace:"Calibri",color:C.light});
}
// All regimes mosaic
{
  const s=pres.addSlide();
  hdr(s,"All Regimes at a Glance","Nine representative parameter values across the full range of behaviour");
  s.addImage({data:I.allRegimes,x:0.3,y:1.18,w:9.4,h:4.15});
  s.addText("Reading order: extinction → fixed point → damped oscillation → period-2 → period-4 → period-16 → early chaos → period-3 window → fully developed chaos (r=3.9).",{x:0.3,y:5.12,w:9.4,h:0.42,fontSize:11.5,fontFace:"Calibri",color:C.muted,align:"center"});
}

// ════════════════════════════════════════════════════════════════
// Remaining slides from v3 (13 onwards — verbatim)
// ════════════════════════════════════════════════════════════════

// Intermittency
{
  const s=pres.addSlide();
  hdr(s,"Intermittency: The Pomeau–Manneville Scenario","Ordered and disordered phases alternate near periodic windows — an analogy with turbulence");
  s.addImage({data:I.intermit,x:0.3,y:1.18,w:9.4,h:3.55});
  card(s,0.3,4.88,4.5,0.65,{topbar:C.yellow});
  s.addText("Mechanism (Tangent Bifurcation)",{x:0.42,y:4.93,w:4.3,h:0.28,fontSize:12,bold:true,color:C.yellow,fontFace:"Cambria"});
  s.addText("As r approaches the period-3 window from below, f³(x) becomes tangent to y=x. Stable & unstable 3-cycles are born simultaneously. Below this point, the orbit 'channels' through the near-tangency (laminar phase) then escapes chaotically (burst).",{x:0.42,y:5.17,w:4.3,h:0.32,fontSize:10.5,fontFace:"Calibri",color:C.light});
  card(s,5.0,4.88,4.65,0.65,{topbar:C.orange});
  s.addText("Analogy with Turbulence",{x:5.12,y:4.93,w:4.45,h:0.28,fontSize:12,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("The laminar→burst→laminar cycle mirrors onset of turbulence: long orderly (laminar) flow interrupted by turbulent bursts. The Pomeau-Manneville scenario provides a universal mathematical mechanism for this transition.",{x:5.12,y:5.17,w:4.45,h:0.32,fontSize:10.5,fontFace:"Calibri",color:C.light});
}
// Devaney
{
  const s=pres.addSlide();
  hdr(s,"Topological Mixing & Devaney's Definition of Chaos","The three ingredients that define 'true' mathematical chaos");
  s.addImage({data:I.devaney,x:0.3,y:1.18,w:9.4,h:3.4});
  const devaney=[
    {col:C.accent,title:"1. Sensitive Dependence",text:"∃δ>0: for any x and ε>0, ∃y with |x−y|<ε and n such that |fⁿ(x)−fⁿ(y)|>δ. Nearby orbits diverge exponentially (positive Lyapunov exponent)."},
    {col:C.purple,title:"2. Topological Transitivity",text:"For any two open sets U,V⊂[0,1], ∃n≥0: fⁿ(U)∩V≠∅. The map cannot be split into two invariant pieces — analogous to turbulent mixing."},
    {col:C.green, title:"3. Dense Periodic Orbits",text:"Periodic points are dense in [0,1]. For any x and ε>0, ∃ a periodic point within ε of x. Infinite unstable cycles lurk everywhere in the chaotic attractor."},
  ];
  devaney.forEach((d,i)=>{
    const bx=0.3+i*3.18;
    card(s,bx,4.72,3.0,0.88,{topbar:d.col});
    s.addText(d.title,{x:bx+0.1,y:4.82,w:2.8,h:0.3,fontSize:11,bold:true,color:d.col,fontFace:"Cambria"});
    s.addText(d.text,{x:bx+0.1,y:5.1,w:2.8,h:0.47,fontSize:9.5,fontFace:"Calibri",color:C.light});
  });
}
// Turbulence analogy
{
  const s=pres.addSlide();
  hdr(s,"Analogy with Turbulence","The logistic map as a low-dimensional model for fluid turbulence");
  card(s,0.35,1.28,4.55,4.1,{topbar:C.accent});
  s.addText("Logistic Map",{x:0.5,y:1.4,w:4.25,h:0.38,fontSize:14,bold:true,color:C.accent,fontFace:"Cambria"});
  const mapR=[["Laminar phase","Periodic window (stable orbit)"],["Turbulent burst","Chaotic episode (λ>0)"],["Intermittency","Pomeau-Manneville switching"],["Onset parameter r","Analogous to Reynolds number Re"],["Feigenbaum point r∞","Critical transition point"],["Topological mixing","Phase space filled densely"],["Sensitive dependence","Butterfly effect / unpredictability"],["Strange attractor","Low-dimensional chaos"]];
  let my=1.85; mapR.forEach(([l,r])=>{
    s.addText(l,{x:0.48,y:my,w:2.0,h:0.35,fontSize:11,fontFace:"Calibri",color:C.accent,bold:true,margin:0,valign:"middle"});
    s.addShape(pres.shapes.LINE,{x:2.5,y:my+0.175,w:0.3,h:0,line:{color:C.muted,width:1}});
    s.addText(r,{x:2.85,y:my,w:1.88,h:0.35,fontSize:11,fontFace:"Calibri",color:C.light,margin:0,valign:"middle"});
    my+=0.41;
  });
  card(s,5.1,1.28,4.55,4.1,{topbar:C.orange});
  s.addText("Fluid Turbulence",{x:5.25,y:1.4,w:4.25,h:0.38,fontSize:14,bold:true,color:C.orange,fontFace:"Cambria"});
  const turbL=[["Kolmogorov energy cascade","Chaos present at all scales — as in the logistic map frequency spectrum"],["Reynolds number Re","Increasing Re→instability→turbulence, just as r→chaos"],["Lorenz attractor (1963)","Edward Lorenz's strange attractor arose from the same logistic-map study"],["Rayleigh-Bénard convection","Period-doubling route to turbulence with same Feigenbaum δ measured experimentally"],["Navier-Stokes equations","High-Re limit produces Devaney chaos in the velocity field — identical structure"]];
  let ty=1.88; turbL.forEach(([t,d])=>{
    s.addShape(pres.shapes.RECTANGLE,{x:5.18,y:ty+0.06,w:0.055,h:0.5,fill:{color:C.orange},line:{type:"none"}});
    s.addText(t,{x:5.3,y:ty,w:4.25,h:0.27,fontSize:11.5,fontFace:"Cambria",bold:true,color:C.orange,margin:0});
    s.addText(d,{x:5.3,y:ty+0.26,w:4.25,h:0.27,fontSize:10.5,fontFace:"Calibri",color:C.light,margin:0});
    ty+=0.66;
  });
}
// Full bifurcation diagram
{
  const s=pres.addSlide();
  hdr(s,"Full Bifurcation Diagram (r ∈ [0, 4])","From extinction to chaos — the complete orbital diagram");
  s.addImage({data:I.bifurcFull,x:0.3,y:1.2,w:9.4,h:4.0});
  s.addText("Each vertical slice shows the asymptotic attractor for that r. Single dot=fixed point · pair of dots=period-2 · cloud=chaos · gaps in cloud=periodic windows.",{x:0.3,y:5.1,w:9.4,h:0.42,fontSize:11.5,fontFace:"Calibri",color:C.muted,align:"center"});
}
// Fixed points & stability
{
  const s=pres.addSlide();
  hdr(s,"Fixed Points & Stability Analysis","The mathematics behind steady-state behaviour");
  const c3=[
    {x:0.35,title:"Finding Fixed Points",col:C.accent,lines:["Solve x* = f(x*) = r·x*(1−x*):","⇒ x*(r − 1 − r·x*) = 0","⇒ x* = 0  (trivial, always present)","⇒ x* = 1 − 1/r  (exists for r > 1)",""]},
    {x:3.42,title:"Stability Criterion",col:C.orange,lines:["Fixed point stable if |f'(x*)| < 1","f'(x) = r(1 − 2x)","x*=0: stable for r < 1","x*=1−1/r: |2−r|<1 → 1<r<3","At r=3: first period-doubling"]},
    {x:6.5, title:"Period-2 Points",col:C.purple,lines:["Satisfy f²(x) = x (not fixed)","x± = {(r+1) ± √[(r−3)(r+1)]} / 2r","Stable for 3 < r < 1+√6 ≈ 3.449","Period-4 next: solve f⁴(x)=x","(12th-degree polynomial — no closed form)"]},
  ];
  c3.forEach(c=>{
    card(s,c.x,1.28,3.0,3.95,{topbar:c.col});
    s.addText(c.title,{x:c.x+0.12,y:1.4,w:2.76,h:0.38,fontSize:12.5,bold:true,color:c.col,fontFace:"Cambria"});
    let ly=1.84; c.lines.forEach(line=>{
      s.addText(line,{x:c.x+0.12,y:ly,w:2.76,h:0.42,fontSize:11,fontFace:"Calibri",color:line.startsWith("⇒")||line.startsWith("x")||line.startsWith("f")||line.startsWith("(")? C.accent:C.light,margin:0,valign:"middle"});
      ly+=0.44;
    });
  });
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.12,w:9.3,h:0.44,fill:{color:"0A0F1A"},line:{color:C.accent,width:1}});
  s.addText("Stability of a periodic orbit: the orbit is stable if |∏ f'(xₖ)| < 1 over one full cycle — a generalisation of the fixed-point criterion.",{x:0.45,y:5.12,w:9.1,h:0.44,fontSize:12,fontFace:"Calibri",color:C.accent,align:"center",valign:"middle"});
}
// Cobweb
{
  const s=pres.addSlide();
  hdr(s,"Cobweb Diagrams — Four Regimes","Geometric visualisation of the iteration process");
  s.addImage({data:I.cobweb4,x:0.3,y:1.18,w:9.4,h:4.2});
  s.addText("The cobweb traces orbits by bouncing between the parabola f(x) and the diagonal y=x. Stable orbits spiral inward; chaotic orbits fill the parabola densely.",{x:0.3,y:5.12,w:9.4,h:0.42,fontSize:11.5,fontFace:"Calibri",color:C.muted,align:"center"});
}
// Period-doubling detail + table
{
  const s=pres.addSlide();
  hdr(s,"The Period-Doubling Cascade in Detail","Infinite bifurcations in a finite parameter interval");
  s.addImage({data:I.bifurc,x:0.3,y:1.18,w:5.9,h:4.0});
  card(s,6.4,1.18,3.25,4.0,{topbar:C.accent});
  s.addText("Bifurcation Table",{x:6.55,y:1.3,w:2.95,h:0.38,fontSize:13,bold:true,color:C.accent,fontFace:"Cambria"});
  const tbl=[[{text:"k",options:{bold:true,color:C.accent}},{text:"Period",options:{bold:true,color:C.accent}},{text:"rₖ",options:{bold:true,color:C.accent}}],["1","2","3.0000000"],["2","4","3.4494896"],["3","8","3.5440903"],["4","16","3.5644073"],["5","32","3.5687594"],["6","64","3.5696916"],["7","128","3.5698913"],["8","256","3.5699340"],["∞","∞","3.5699456…"]];
  s.addTable(tbl,{x:6.5,y:1.72,w:3.05,h:2.8,colW:[0.6,0.8,1.65],border:{pt:0.5,color:C.mid},fontSize:10.5,fontFace:"Calibri",color:C.light,fill:{color:"0A0F1A"}});
  s.addText("The ratio of successive interval lengths → δ ≈ 4.6692:",{x:6.5,y:4.6,w:3.05,h:0.38,fontSize:10.5,fontFace:"Calibri",color:C.light});
  s.addShape(pres.shapes.RECTANGLE,{x:6.5,y:5.0,w:3.05,h:0.55,fill:{color:"0A0F1A"},line:{color:C.accent,width:1.2}});
  s.addText("δ = lim (rₖ−rₖ₋₁)/(rₖ₊₁−rₖ) ≈ 4.6692",{x:6.5,y:5.0,w:3.05,h:0.55,fontSize:12,fontFace:"Cambria",bold:true,color:C.accent,align:"center",valign:"middle"});
}
// Feigenbaum
{
  const s=pres.addSlide();
  hdr(s,"Feigenbaum Universality","A constant shared by all unimodal maps and real experiments");
  card(s,0.35,1.28,4.55,4.05,{topbar:C.accent});
  s.addText("The Feigenbaum Constant δ",{x:0.5,y:1.4,w:4.25,h:0.38,fontSize:14,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:1.84,w:4.25,h:0.64,fill:{color:"0A0F1A"},line:{color:C.accent,width:1}});
  s.addText("δ = 4.669201609102990671853…",{x:0.5,y:1.84,w:4.25,h:0.64,fontSize:16,fontFace:"Cambria",bold:true,color:C.accent,align:"center",valign:"middle"});
  const fi=["Discovered by Feigenbaum (1975) on a programmable pocket calculator.","Universal for ALL unimodal maps — not just the logistic map.","A second constant α ≈ 2.5029 describes x-direction scaling.","The Feigenbaum attractor at r∞ is a Cantor set with Hausdorff dim ≈ 0.54.","Derived by exploiting self-similarity via renormalisation group methods."];
  let fy=2.56; fi.forEach(f=>{
    s.addShape(pres.shapes.RECTANGLE,{x:0.5,y:fy+0.07,w:0.055,h:0.4,fill:{color:C.accent},line:{type:"none"}});
    s.addText(f,{x:0.65,y:fy,w:4.1,h:0.52,fontSize:11,fontFace:"Calibri",color:C.light,margin:0,valign:"middle"});
    fy+=0.55;
  });
  card(s,5.1,1.28,4.55,4.05,{topbar:C.orange});
  s.addText("Physical Universality",{x:5.25,y:1.4,w:4.25,h:0.38,fontSize:14,bold:true,color:C.orange,fontFace:"Cambria"});
  const pe=[["Dripping taps","Period-doubling in droplet intervals measured; δ matches"],["Electronic diode circuits","Libchaber & Maurer (1980) confirmed δ experimentally"],["Rayleigh-Bénard convection","Fluid heated from below; same bifurcation sequence & δ"],["Belousov-Zhabotinsky reaction","Chemical oscillator shows identical period-doubling"],["Cardiac alternans","Alternating beat intervals in cardiac tissue follow same route"]];
  let pey=1.92; pe.forEach(([sys,desc])=>{
    s.addText(sys,{x:5.25,y:pey,w:4.25,h:0.26,fontSize:12,fontFace:"Cambria",bold:true,color:C.orange,margin:0});
    s.addText(desc,{x:5.25,y:pey+0.25,w:4.25,h:0.26,fontSize:11,fontFace:"Calibri",color:C.light,margin:0});
    pey+=0.63;
  });
}
// Lyapunov
{
  const s=pres.addSlide();
  hdr(s,"Lyapunov Exponents","Quantifying chaos — the fingerprint of unpredictability");
  card(s,0.35,1.28,9.3,1.0,{color:"0A0F1A",shadow:false});
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:1.28,w:9.3,h:1.0,fill:{color:"0A0F1A"},line:{color:C.accent,width:1}});
  s.addText("λ = lim(N→∞) (1/N) Σₙ ln|f'(xₙ)|  =  lim (1/N) Σₙ ln|r(1 − 2xₙ)|",{x:0.45,y:1.33,w:9.1,h:0.55,fontSize:16,fontFace:"Cambria",bold:true,color:C.accent,align:"center"});
  s.addText("λ < 0 → stable, predictable orbit    |    λ = 0 → bifurcation point    |    λ > 0 → chaos (exponential divergence)    |    λ = ln 2 at r = 4 (exact)",{x:0.45,y:1.88,w:9.1,h:0.35,fontSize:11.5,fontFace:"Calibri",color:C.light,align:"center"});
  s.addImage({data:I.lyapunov,x:0.3,y:2.38,w:9.4,h:2.85});
  s.addText("The deep dips to −∞ correspond to bifurcation points where λ=0. The positive regions coincide exactly with the chaotic bands seen in the bifurcation diagram.",{x:0.3,y:5.1,w:9.4,h:0.42,fontSize:11.5,fontFace:"Calibri",color:C.muted,align:"center"});
}
// Sensitive dependence
{
  const s=pres.addSlide();
  hdr(s,"Sensitive Dependence on Initial Conditions","The butterfly effect made quantitative");
  s.addImage({data:I.butterfly,x:0.3,y:1.18,w:9.4,h:3.85});
  card(s,0.3,5.05,4.5,0.48,{color:"0A0F1A",shadow:false});
  s.addShape(pres.shapes.RECTANGLE,{x:0.3,y:5.05,w:4.5,h:0.48,fill:{color:"0A0F1A"},line:{color:C.accent,width:1}});
  s.addText("|δxₙ| ≈ ε · eλn   (exponential divergence)",{x:0.3,y:5.05,w:4.5,h:0.48,fontSize:13,fontFace:"Cambria",bold:true,color:C.accent,align:"center",valign:"middle"});
  s.addText("Two orbits starting just 10⁻⁹ apart diverge to macroscopic differences after ~29 iterations at r=3.9. Deterministic — no randomness. This is Devaney's first condition: sensitive dependence.",{x:5.0,y:5.05,w:4.65,h:0.48,fontSize:11,fontFace:"Calibri",color:C.light,valign:"middle"});
}
// Phase space
{
  const s=pres.addSlide();
  hdr(s,"Phase Space & Poincaré Return Maps","Visualising attractors in the (xₙ, xₙ₊₁) plane");
  s.addImage({data:I.phasespace,x:0.3,y:1.18,w:9.4,h:3.9});
  const psl=[{x:0.3,l:"Fixed-Point Attractor",c:C.accent},{x:3.4,l:"Limit Cycle (Period-4)",c:C.green},{x:6.5,l:"Strange Attractor (Chaos)",c:C.orange}];
  psl.forEach(p=>{
    s.addShape(pres.shapes.RECTANGLE,{x:p.x,y:5.05,w:3.15,h:0.44,fill:{color:"0A0F1A"},line:{color:p.c,width:1}});
    s.addText(p.l,{x:p.x,y:5.05,w:3.15,h:0.44,fontSize:11,fontFace:"Calibri",bold:true,color:p.c,align:"center",valign:"middle"});
  });
}
// Periodic windows
{
  const s=pres.addSlide();
  hdr(s,"Periodic Windows & Sharkovksy's Theorem","Order re-appearing inside the chaotic sea");
  s.addImage({data:I.period3,x:0.3,y:1.18,w:9.4,h:3.7});
  card(s,0.3,5.0,4.5,0.55,{topbar:C.green});
  s.addText("Period-3 Window & Sharkovksy",{x:0.42,y:5.06,w:4.3,h:0.28,fontSize:12,bold:true,color:C.green,fontFace:"Cambria"});
  s.addText("Period-3 cycle appears at r≈3.828 via tangent bifurcation. By Sharkovksy's theorem, period-3 implies all periods exist (as unstable orbits).",{x:0.42,y:5.3,w:4.3,h:0.25,fontSize:11,fontFace:"Calibri",color:C.light});
  card(s,5.0,5.0,4.65,0.55,{topbar:C.orange});
  s.addText("Pomeau–Manneville Route",{x:5.12,y:5.06,w:4.45,h:0.28,fontSize:12,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("Just below r≈3.828: intermittent chaos — laminar (≈periodic) phases interrupted by chaotic bursts, a general route to chaos via tangent bifurcation.",{x:5.12,y:5.3,w:4.45,h:0.25,fontSize:11,fontFace:"Calibri",color:C.light});
}
// r=4 exact results
{
  const s=pres.addSlide();
  hdr(s,"Fully Chaotic Regime: r = 4 — Exact Results","When the map is analytically tractable even in chaos");
  s.addImage({data:I.density,x:0.3,y:1.18,w:6.5,h:3.6});
  card(s,7.05,1.18,2.6,3.6,{topbar:C.accent});
  s.addText("Key r = 4 Facts",{x:7.18,y:1.3,w:2.35,h:0.38,fontSize:13,bold:true,color:C.accent,fontFace:"Cambria"});
  const r4=[["Lyapunov λ","= ln 2 ≈ 0.693"],["Invariant density","ρ(x)=1/[π√(x(1−x))]"],["Hausdorff dim.","≈ 0.538"],["Information dim.","≈ 0.5171"],["Topological equiv.","bit-shift & tent maps"],["Devaney chaos","on [0,1] (all 3 criteria)"]];
  let r4y=1.74; r4.forEach(([k,v])=>{
    s.addText(k+":",{x:7.15,y:r4y,w:1.25,h:0.38,fontSize:10,fontFace:"Cambria",bold:true,color:C.accent,margin:0,valign:"middle"});
    s.addText(v,{x:8.42,y:r4y,w:1.15,h:0.38,fontSize:10,fontFace:"Calibri",color:C.light,margin:0,valign:"middle"});
    r4y+=0.44;
  });
  s.addText("The arcsine (Beta) distribution explains the high density near x=0 and x=1.",{x:0.3,y:4.9,w:6.5,h:0.38,fontSize:11,fontFace:"Calibri",color:C.muted,align:"center"});
}
// Applications
{
  const s=pres.addSlide();
  hdr(s,"Applications Across Science","From biology to cryptography — universality in action");
  const apps=[{icon:"🌿",title:"Population Ecology",text:"May's model for insect boom/crash cycles; fish stock fluctuations"},{icon:"💧",title:"Fluid Mechanics",text:"Dripping taps, Rayleigh-Bénard convection: same δ measured in lab"},{icon:"🔌",title:"Electronic Circuits",text:"Driven diode circuits bifurcate with universal δ (Libchaber 1982)"},{icon:"💊",title:"Cardiac Physiology",text:"Heart alternans and arrhythmias modelled by discrete nonlinear maps"},{icon:"🔐",title:"Cryptography",text:"r=4 sequences are pseudo-random; von Neumann proposed this in 1940s"},{icon:"🌡️",title:"Climate & Meteorology",text:"Lorenz used the map to find irregular climate solutions (1960s)"},{icon:"📡",title:"Semiconductors",text:"Pomeau-Manneville intermittency in semiconductor device feedback"},{icon:"🔬",title:"Chemistry",text:"Belousov-Zhabotinsky reaction shows period-doubling route to chaos"}];
  const cols=[0.3,2.75,5.2,7.65]; const rows=[1.28,3.1];
  apps.forEach((app,i)=>{
    const cx=cols[i%4],cy=rows[Math.floor(i/4)];
    card(s,cx,cy,2.28,1.65,{topbar:i%2===0?C.accent:C.orange});
    s.addText(app.icon+"  "+app.title,{x:cx+0.1,y:cy+0.1,w:2.08,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:i%2===0?C.accent:C.orange});
    s.addText(app.text,{x:cx+0.1,y:cy+0.5,w:2.08,h:1.0,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}
// Key Takeaways
{
  const s=pres.addSlide();
  s.background={color:C.dark};
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:5.52,w:10,h:0.1,fill:{color:C.accent},line:{type:"none"}});
  s.addText("Key Takeaways",{x:0.5,y:0.2,w:9,h:0.65,fontSize:32,fontFace:"Cambria",bold:true,color:C.white,align:"center"});
  const tks=[
    {title:"ODE → Discrete Map",text:"Euler discretisation of dN/dt=rN(1−N/K) with h=1 and rescaling N→x gives xₙ₊₁=r'xₙ(1−xₙ)",col:C.green},
    {title:"Period-Doubling Cascade",text:"2→4→8→16→∞ cycles in a finite r-interval; ratio → Feigenbaum δ ≈ 4.6692",col:C.purple},
    {title:"Feigenbaum Universality",text:"δ appears in all unimodal maps and real physical experiments",col:C.orange},
    {title:"Lyapunov λ > 0 = Chaos",text:"Quantifies exponential divergence — the mathematical fingerprint of chaos",col:C.accent},
    {title:"Intermittency",text:"Laminar/burst switching near periodic windows — mirrors onset of turbulence",col:C.yellow},
    {title:"Devaney / Topological Mixing",text:"3 conditions: sensitivity + transitivity + dense periodic orbits = rigorously defined chaos",col:C.accent},
  ];
  const cx=[0.3,3.42,6.55]; const cy=[1.05,3.0];
  tks.forEach((t,i)=>{
    const x=cx[i%3],y=cy[Math.floor(i/3)];
    card(s,x,y,2.88,1.72,{topbar:t.col});
    s.addText(t.title,{x:x+0.12,y:y+0.1,w:2.64,h:0.42,fontSize:12,fontFace:"Cambria",bold:true,color:t.col});
    s.addText(t.text,{x:x+0.12,y:y+0.52,w:2.64,h:1.0,fontSize:11.5,fontFace:"Calibri",color:C.light});
  });
  s.addText("\"Period three implies chaos.\"  — Li & Yorke (1975)   |   \"The most complicated, beautiful objects mathematics has ever seen.\"  — Gleick (1987)",{x:0.5,y:5.14,w:9,h:0.38,fontSize:11,fontFace:"Calibri",color:C.muted,italic:true,align:"center"});
}

// ─── WRITE ────────────────────────────────────────────────────────
pres.writeFile({fileName:"/home/claude/logistic_map_v4.pptx"}).then(()=>{
  console.log("Done: logistic_map_v4.pptx");
}).catch(err=>{console.error(err);process.exit(1);});
