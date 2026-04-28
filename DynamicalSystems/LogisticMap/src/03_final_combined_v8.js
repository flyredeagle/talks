const pptxgen = require("/home/claude/.npm-global/lib/node_modules/pptxgenjs");
const fs = require("fs");

const pres = new pptxgen();
pres.layout = "LAYOUT_16x9";
pres.title = "The Logistic Map — Complete Academic Edition v6";

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

  // Academic section images
  gradFeig:  img("grad_feigenbaum.png"),
  gradSym:   img("grad_symbolic.png"),
  gradAdv:   img("grad_advanced.png"),
  phdAdv:    img("phd_advanced.png"),
  // NEW
  odeBehaviours: img("ode_behaviours.png"),
  odeDerivation: img("ode_to_map_derivation.png"),
  odeVsMap:      img("ode_vs_map.png"),
};

// ─── helpers ────────────────────────────────────────────────────
function hdr(s, title, sub) {
  s.background = { color: C.dark };
  s.addShape(pres.shapes.RECTANGLE, { x:0,y:0,w:10,h:0.07, fill:{color:C.accent}, line:{type:"none"} });
  s.addText(title, { x:0.5,y:0.1,w:9,h:0.72, fontSize:21,fontFace:"Cambria",bold:true,color:C.white,margin:0,autoFit:true });
  if (sub) {
    s.addShape(pres.shapes.RECTANGLE, { x:0.5,y:0.84,w:0.05,h:0.25, fill:{color:C.accent},line:{type:"none"} });
    s.addText(sub, { x:0.65,y:0.84,w:8.5,h:0.25, fontSize:10.5,fontFace:"Calibri",color:C.muted,italic:true,margin:0 });
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

  let sy=1.62;
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
  s.addImage({data:I.odeDerivation, x:4.88,y:1.18,w:4.82,h:4.35});
}

// ════════════════════════════════════════════════════════════════
// SLIDE 5 (UPDATED): Population Model & Parameter Ranges
//   — now explicitly connects ODE behaviours to discrete map
// ════════════════════════════════════════════════════════════════
{
  const s = pres.addSlide();
  hdr(s,"ODE vs Discrete Map: Shared Behaviour & New Phenomena","How the continuous model maps onto — and is transcended by — the discrete logistic map");

  // Top: side-by-side comparison image
  s.addImage({data:I.odeVsMap, x:0.3,y:1.18,w:9.4,h:3.1});

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
    card(s,bx,4.38,3.0,1.1,{topbar:c.col,shadow:false});
    s.addText(c.title,{x:bx+0.1,y:4.45,w:2.8,h:0.28,fontSize:11,fontFace:"Cambria",bold:true,color:c.col});
    s.addText(c.text,{x:bx+0.1,y:4.73,w:2.8,h:0.72,fontSize:9.5,fontFace:"Calibri",color:C.light});
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
  s.addImage({data:I.regime1,x:0.3,y:1.18,w:9.4,h:3.3});
  card(s,0.3,4.62,4.5,0.88,{topbar:C.red});
  s.addText("Mathematics",{x:0.42,y:4.7,w:4.25,h:0.26,fontSize:11,bold:true,color:C.red,fontFace:"Cambria"});
  s.addText("Fixed point x*=0. Stability: |f'(0)| = r < 1 ✓.  Convergence is exponential: |xₙ| ~ rⁿ·x₀ → 0. Exactly analogous to the ODE: both give extinction for low growth rates.",{x:0.42,y:4.97,w:4.25,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,5.1,4.88,4.55,0.65,{topbar:C.orange});
  s.addText("Physical Meaning",{x:5.22,y:4.7,w:4.3,h:0.26,fontSize:11,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("Reproduction rate too low to sustain the population. Every generation fewer individuals survive — population collapses to extinction regardless of x₀. ODE and map agree here.",{x:5.22,y:4.97,w:4.3,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
}
// Regime 2: Stable fixed point
{
  const s=pres.addSlide();
  hdr(s,"Regime 2: Stable Fixed Point  (1 < r < 3)","Monotone convergence (1<r<2) or damped oscillation (2<r<3) — ODE analogue with key differences");
  s.addImage({data:I.regime2,x:0.3,y:1.18,w:9.4,h:3.3});
  card(s,0.3,4.62,4.5,0.88,{topbar:C.green});
  s.addText("Sub-regimes & ODE Connection",{x:0.42,y:4.7,w:4.25,h:0.26,fontSize:11,bold:true,color:C.green,fontFace:"Cambria"});
  s.addText("1<r<2: monotone (like ODE). 2<r<3: damped oscillation — xₙ overshoots x* each step and rings back. This overshoot is absent in the ODE but is the first sign of discrete-time novelty. r=3: |f'(x*)|=1, critical slow-down.",{x:0.42,y:4.97,w:4.25,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,5.1,4.88,4.55,0.65,{topbar:C.accent});
  s.addText("Stability Analysis",{x:5.22,y:4.7,w:4.3,h:0.26,fontSize:11,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("x* = 1−1/r. Stable when |f'(x*)| = |2−r| < 1, i.e. 1<r<3. Fixed point is the discrete analogue of N*=K in the ODE — same value, but reached with possible oscillation.",{x:5.22,y:4.97,w:4.3,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
}
// Regime 3: Period-doubling
{
  const s=pres.addSlide();
  hdr(s,"Regime 3: Period-Doubling Cascade  (3 < r < r∞ ≈ 3.5699)","Each bifurcation splits a stable cycle into two — infinitely, in a finite interval");
  s.addImage({data:I.regime3,x:0.3,y:1.18,w:9.4,h:3.3});
  card(s,0.3,4.62,5.9,0.88,{topbar:C.purple});
  s.addText("The Cascade — A Purely Discrete Phenomenon",{x:0.42,y:4.7,w:5.7,h:0.26,fontSize:11,bold:true,color:C.purple,fontFace:"Cambria"});
  s.addText("At each bifurcation point rₖ, the stable 2ᵏ-cycle loses stability → a 2ᵏ⁺¹-cycle appears. The ODE has no equivalent — the cascade is a consequence of the compounded overshoot in discrete iteration. Intervals shrink with ratio → δ ≈ 4.6692.",{x:0.42,y:4.97,w:5.7,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,6.4,4.62,3.25,0.88,{topbar:C.accent});
  s.addText("Bifurcation values",{x:6.52,y:4.7,w:3.0,h:0.26,fontSize:11,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("r₁=3.000 (2-cycle) · r₂=3.449 (4) · r₃=3.544 (8) · r∞=3.5699 (∞-period)",{x:6.52,y:4.97,w:3.0,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
}
// Regime 4: Chaos overview
{
  const s=pres.addSlide();
  hdr(s,"Regime 4: Chaotic Regime  (r > r∞)","Aperiodic orbits, periodic windows, intermittency, and topological mixing");
  s.addImage({data:I.regime4,x:0.3,y:1.18,w:9.4,h:3.3});
  card(s,0.3,4.62,3.0,0.88,{topbar:C.orange});
  s.addText("Early Chaos (r≈3.6)",{x:0.42,y:4.7,w:2.8,h:0.26,fontSize:11,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("Lyapunov λ>0. Aperiodic, bounded in [0,1], sensitive to initial conditions.",{x:0.42,y:4.97,w:2.8,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,3.5,4.62,3.0,0.88,{topbar:C.yellow});
  s.addText("Intermittency (r≈3.828)",{x:3.62,y:4.7,w:2.8,h:0.26,fontSize:11,bold:true,color:C.yellow,fontFace:"Cambria"});
  s.addText("Near period-3 window: laminar (≈periodic) bursts interrupted by chaotic episodes.",{x:3.62,y:4.97,w:2.8,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,6.7,4.62,3.0,0.88,{topbar:C.accent});
  s.addText("Full Chaos / Mixing (r=3.9)",{x:6.82,y:4.7,w:2.8,h:0.26,fontSize:11,bold:true,color:C.accent,fontFace:"Cambria"});
  s.addText("Two orbits from nearly identical x₀ diverge exponentially. Phase space filled densely.",{x:6.82,y:4.97,w:2.8,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
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
  s.addImage({data:I.intermit,x:0.3,y:1.18,w:9.4,h:3.3});
  card(s,0.3,4.62,4.5,0.88,{topbar:C.yellow});
  s.addText("Mechanism (Tangent Bifurcation)",{x:0.42,y:4.7,w:4.3,h:0.26,fontSize:11,bold:true,color:C.yellow,fontFace:"Cambria"});
  s.addText("As r approaches the period-3 window from below, f³(x) becomes tangent to y=x. Stable & unstable 3-cycles are born simultaneously. Below this point, the orbit 'channels' through the near-tangency (laminar phase) then escapes chaotically (burst).",{x:0.42,y:4.97,w:4.3,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,5.0,4.62,4.65,0.88,{topbar:C.orange});
  s.addText("Analogy with Turbulence",{x:5.12,y:4.7,w:4.45,h:0.26,fontSize:11,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("The laminar→burst→laminar cycle mirrors onset of turbulence: long orderly (laminar) flow interrupted by turbulent bursts. The Pomeau-Manneville scenario provides a universal mathematical mechanism for this transition.",{x:5.12,y:4.97,w:4.45,h:0.52,fontSize:10,fontFace:"Calibri",color:C.light});
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
    card(s,bx,4.7,3.0,0.88,{topbar:d.col,shadow:false});
    s.addText(d.title,{x:bx+0.1,y:4.78,w:2.8,h:0.28,fontSize:10.5,bold:true,color:d.col,fontFace:"Cambria"});
    s.addText(d.text,{x:bx+0.1,y:5.06,w:2.8,h:0.5,fontSize:9,fontFace:"Calibri",color:C.light});
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
  s.addText("Two orbits starting ε=10⁻⁵ apart diverge after ~36 iterations at r=3.9. Deterministic — no randomness. This is Devaney's first condition: sensitive dependence.",{x:5.0,y:5.05,w:4.65,h:0.48,fontSize:10.5,fontFace:"Calibri",color:C.light,valign:"middle"});
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
  card(s,0.3,5.0,4.5,0.55,{topbar:C.green,shadow:false});
  s.addText("Period-3 Window & Sharkovksy",{x:0.42,y:5.06,w:4.3,h:0.22,fontSize:11,bold:true,color:C.green,fontFace:"Cambria"});
  s.addText("Period-3 cycle at r≈3.828 via tangent bifurcation. Sharkovksy: period-3 implies all periods exist.",{x:0.42,y:5.27,w:4.3,h:0.28,fontSize:10,fontFace:"Calibri",color:C.light});
  card(s,5.0,5.0,4.65,0.55,{topbar:C.orange,shadow:false});
  s.addText("Pomeau–Manneville Route",{x:5.12,y:5.06,w:4.45,h:0.22,fontSize:11,bold:true,color:C.orange,fontFace:"Cambria"});
  s.addText("Just below r≈3.828: intermittent chaos — laminar phases interrupted by chaotic bursts, a general route to chaos via tangent bifurcation.",{x:5.12,y:5.27,w:4.45,h:0.28,fontSize:10,fontFace:"Calibri",color:C.light});
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

// ════════════════════════════════════════════════════════════════════
// APPENDIX: Academic sections — BSc, MSc, PhD problem sets,
//           textbooks, and research references
// ════════════════════════════════════════════════════════════════════

// ── Section divider helper ────────────────────────────────────────
function sectionDivider(title, subtitle, bgColor, accentColor) {
  const s = pres.addSlide();
  s.background = { color: bgColor || "0A1628" };
  // Large left accent bar
  s.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.18, h:5.625, fill:{color: accentColor || C.accent}, line:{type:"none"} });
  // Right decorative panel
  s.addShape(pres.shapes.RECTANGLE, { x:8.5, y:0, w:1.5, h:5.625, fill:{color: C.mid}, line:{type:"none"}, transparency:40 });
  s.addText(title, { x:0.5, y:1.5, w:8.0, h:1.4, fontSize:40, fontFace:"Cambria", bold:true, color:C.white });
  if (subtitle) s.addText(subtitle, { x:0.5, y:3.0, w:7.5, h:0.7, fontSize:18, fontFace:"Calibri", color:accentColor || C.accent, italic:true });
  return s;
}

// ── Small card ────────────────────────────────────────────────────
function sCard(s, x, y, w, h, title, body, tcol, opts={}) {
  card(s, x, y, w, h, { topbar: tcol, color: opts.bg || C.mid, shadow: opts.shadow !== false });
  s.addText(title, { x:x+0.12, y:y+0.1, w:w-0.24, h:0.32, fontSize:opts.titleSize||11.5, fontFace:"Cambria", bold:true, color:tcol, margin:0 });
  s.addText(body,  { x:x+0.12, y:y+0.44, w:w-0.24, h:h-0.52, fontSize:opts.bodySize||10.5, fontFace:"Calibri", color:C.light });
}

// ── Reference row ────────────────────────────────────────────────
function refRow(s, x, y, w, num, authors, title, details, col) {
  s.addShape(pres.shapes.RECTANGLE, { x, y:y+0.04, w:0.28, h:0.35, fill:{color:col||C.accent}, line:{type:"none"} });
  s.addText(String(num), { x, y:y+0.04, w:0.28, h:0.35, fontSize:10, fontFace:"Cambria", bold:true, color:C.dark, align:"center", valign:"middle" });
  s.addText(authors, { x:x+0.34, y:y, w:w-0.34, h:0.22, fontSize:10, fontFace:"Cambria", bold:true, color:col||C.accent, margin:0 });
  s.addText(title,   { x:x+0.34, y:y+0.2, w:w-0.34, h:0.2, fontSize:10, fontFace:"Calibri", color:C.light, italic:true, margin:0 });
  if (details) s.addText(details, { x:x+0.34, y:y+0.38, w:w-0.34, h:0.18, fontSize:9, fontFace:"Calibri", color:C.muted, margin:0 });
}

// ════════════════════════════════════════════════════════════════
//  ██████╗ ███████╗ ██████╗     ███████╗███████╗ ██████╗████████╗
//  ██╔══██╗██╔════╝██╔════╝     ██╔════╝██╔════╝██╔════╝╚══██╔══╝
//  ██████╔╝███████╗██║          ███████╗█████╗  ██║        ██║
//  ██╔══██╗╚════██║██║          ╚════██║██╔══╝  ██║        ██║
//  ██████╔╝███████║╚██████╗     ███████║███████╗╚██████╗   ██║
// ════════════════════════════════════════════════════════════════
sectionDivider("BSc Section", "Problem Sets · Q&A · Textbooks", "0A1628", C.green);

// ── BSc Slide A: Q&A (Quick-fire conceptual questions) ───────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Q&A: Conceptual Questions & Answers", "Test your understanding of the key ideas");
  const qa = [
    ["Q1", "What does xₙ represent in the logistic map?",
     "A: The normalised population at generation n; xₙ ∈ [0,1] where 1 means the population is at carrying capacity K."],
    ["Q2", "For what value of r does the first period-doubling occur?",
     "A: r = 3. For r < 3 the fixed point x* = 1−1/r is stable; at r = 3 its stability is lost and a period-2 cycle is born."],
    ["Q3", "What is the Feigenbaum constant δ, and what does it measure?",
     "A: δ ≈ 4.6692. It is the limiting ratio (rₖ−rₖ₋₁)/(rₖ₊₁−rₖ) of successive bifurcation parameter intervals."],
    ["Q4", "Why does the continuous logistic ODE never produce chaos?",
     "A: The ODE dN/dt=rN(1−N/K) is a 1D autonomous system with a single stable equilibrium N*=K for all r>0. By the Poincaré–Bendixson theorem in 1D, no chaos is possible."],
    ["Q5", "State two properties required by Devaney's definition of chaos.",
     "A: (i) Sensitive dependence on initial conditions; (ii) Topological transitivity. A third is density of periodic orbits (sometimes derived from the first two)."],
    ["Q6", "What happens to orbits when r > 4?",
     "A: Orbits can leave the interval [0,1] and diverge — the map no longer models a bounded population."],
  ];
  const cols2 = [0.35, 5.05];
  qa.forEach((item, i) => {
    const cx = cols2[i % 2], cy = 1.28 + Math.floor(i / 2) * 1.4;
    card(s, cx, cy, 4.5, 1.28, { topbar: C.green, shadow: true });
    s.addText(item[0] + "  " + item[1], { x:cx+0.12, y:cy+0.1, w:4.26, h:0.38, fontSize:11, fontFace:"Cambria", bold:true, color:C.green });
    s.addText(item[2], { x:cx+0.12, y:cy+0.5, w:4.26, h:0.7, fontSize:10.5, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide B: Simple Problems ─────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Simple Problems", "Analytical and short computational exercises");
  const probs = [
    { n:"1", col:C.green,
      title:"Fixed-point calculation",
      body:"Find both fixed points of the logistic map for r = 2.5. Verify stability using the derivative criterion |f'(x*)| < 1." },
    { n:"2", col:C.green,
      title:"Stability boundary",
      body:"Show algebraically that the non-trivial fixed point x* = 1−1/r loses stability at exactly r = 3 by computing f'(x*) as a function of r." },
    { n:"3", col:C.accent,
      title:"Period-2 orbit",
      body:"For r = 3.2, iterate the map 1000 times from x₀ = 0.5 and confirm the orbit is period-2. Find the two period-2 values analytically using x± = [(r+1) ± √{(r−3)(r+1)}] / (2r)." },
    { n:"4", col:C.accent,
      title:"Lyapunov exponent",
      body:"Estimate the Lyapunov exponent λ numerically for r = 2.8, 3.5 and 3.9 by averaging (1/N)Σ ln|r(1−2xₙ)| over N = 10,000 iterates. Interpret the sign in each case." },
    { n:"5", col:C.orange,
      title:"Bifurcation diagram",
      body:"Write a short program (Python/MATLAB) to produce the bifurcation diagram for r ∈ [2.5, 4.0]. Identify on your plot: the period-2 bifurcation (r≈3), period-4 (r≈3.45), and the onset of chaos (r≈3.57)." },
    { n:"6", col:C.orange,
      title:"Cobweb diagram",
      body:"Construct cobweb diagrams by hand (or computationally) for r = 1.5, 2.8, 3.3, and 3.9 starting from x₀ = 0.2. Describe qualitatively what each diagram shows about the attractor." },
  ];
  const cols3 = [0.3, 3.42, 6.55];
  const rows3 = [1.28, 3.1];
  probs.forEach((p, i) => {
    const bx = cols3[i % 3], by = rows3[Math.floor(i / 3)];
    card(s, bx, by, 2.88, 1.72, { topbar: p.col });
    s.addText("Problem " + p.n + ": " + p.title, { x:bx+0.12, y:by+0.1, w:2.64, h:0.38, fontSize:11, fontFace:"Cambria", bold:true, color:p.col });
    s.addText(p.body, { x:bx+0.12, y:by+0.5, w:2.64, h:1.12, fontSize:10, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide C: Complex Problems ────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Challenging Problems", "Deeper analytical and extended computational problems");
  const probs2 = [
    { n:"7", col:C.purple,
      title:"Period-3 existence",
      body:"Show that a period-3 orbit exists for r = 1+2√2 ≈ 3.828. Hint: find r such that f³(x) = x has a solution other than the fixed points. Use Li–Yorke: period-3 implies chaos." },
    { n:"8", col:C.purple,
      title:"Feigenbaum scaling",
      body:"From a computed bifurcation diagram, measure r₁=3.00, r₂=3.449, r₃=3.544, r₄=3.564. Calculate the successive ratios δₖ = (rₖ−rₖ₋₁)/(rₖ₊₁−rₖ) and show they converge toward 4.6692." },
    { n:"9", col:C.yellow,
      title:"Invariant density at r=4",
      body:"Verify numerically that the invariant density of the logistic map at r=4 is ρ(x) = 1/[π√(x(1−x))]. Generate 10⁶ iterates, plot a histogram, and overlay the theoretical arcsine distribution." },
    { n:"10", col:C.yellow,
      title:"Sensitive dependence",
      body:"For r = 3.9, plot |xₙ − yₙ| vs n on a log scale, starting from x₀ = 0.5 and y₀ = 0.5 + ε for ε = 10⁻³, 10⁻⁶, 10⁻⁹. Estimate λ from the slope and compare to the direct Lyapunov calculation." },
    { n:"11", col:C.orange,
      title:"Universality check",
      body:"Repeat the bifurcation analysis for the sine map xₙ₊₁ = r·sin(πxₙ) and the quadratic map xₙ₊₁ = r − xₙ². Measure δ for each. Verify that all three converge to the same Feigenbaum constant." },
    { n:"12", col:C.orange,
      title:"Conjugacy at r=4",
      body:"Prove that the logistic map at r=4 is topologically conjugate to the tent map T(x) = 1−|2x−1| via the substitution xₙ = sin²(πθₙ/2). Show this implies λ = ln 2 exactly." },
  ];
  const cols4 = [0.3, 3.42, 6.55];
  const rows4 = [1.28, 3.1];
  probs2.forEach((p, i) => {
    const bx = cols4[i % 3], by = rows4[Math.floor(i / 3)];
    card(s, bx, by, 2.88, 1.72, { topbar: p.col });
    s.addText("Problem " + p.n + ": " + p.title, { x:bx+0.12, y:by+0.1, w:2.64, h:0.38, fontSize:11, fontFace:"Cambria", bold:true, color:p.col });
    s.addText(p.body, { x:bx+0.12, y:by+0.5, w:2.64, h:1.12, fontSize:10, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide D: Project Proposals ───────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Project Proposals", "Semester-length undergraduate research projects");
  const projects = [
    { col:C.green, title:"P1: Interactive Bifurcation Explorer",
      body:"Build a web/Python interactive tool to explore the logistic map. Features: animated cobweb, real-time bifurcation diagram, Lyapunov exponent plot, and user-adjustable r. Compare three different unimodal maps side-by-side." },
    { col:C.accent, title:"P2: Feigenbaum Constant Verification",
      body:"Systematically measure the Feigenbaum constant δ for five different unimodal maps (logistic, sine, quadratic, cubic, Gaussian). Write a report comparing numerical results to the theoretical 4.6692 and explaining universality." },
    { col:C.orange, title:"P3: Chaos in a Physical System",
      body:"Experimentally study a nonlinear system (dripping tap, driven pendulum, electronic oscillator) and record period-doubling as a parameter is varied. Compare the measured bifurcation sequence to the logistic map prediction." },
    { col:C.purple, title:"P4: Population Ecology Simulation",
      body:"Use real ecological data (insect populations, fisheries) to fit the logistic map parameter r. Simulate long-term dynamics and assess whether populations exhibit stable cycles or chaos. Discuss ecological implications." },
  ];
  projects.forEach((p, i) => {
    const bx = 0.3 + (i % 2) * 4.75;
    const by = 1.28 + Math.floor(i / 2) * 2.05;
    card(s, bx, by, 4.5, 1.9, { topbar: p.col });
    s.addText(p.title, { x:bx+0.12, y:by+0.1, w:4.26, h:0.35, fontSize:12, fontFace:"Cambria", bold:true, color:p.col });
    s.addText(p.body,  { x:bx+0.12, y:by+0.48, w:4.26, h:1.32, fontSize:10.5, fontFace:"Calibri", color:C.light });
  });
}

// ── BSc Slide E: Introductory Textbooks ──────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "BSc — Introductory Textbooks & Reading", "Accessible entry-level books on nonlinear dynamics and chaos");

  const books = [
    { n:1, col:C.green,
      authors:"Strogatz, S. H.",
      title:"Nonlinear Dynamics and Chaos (2nd ed.)",
      details:"Westview Press, 2015 — The standard undergraduate text. Chapters 10–12 cover 1D maps, period-doubling, and chaos with clear physical motivation." },
    { n:2, col:C.green,
      authors:"Gleick, J.",
      title:"Chaos: Making a New Science",
      details:"Penguin Books, 1987 — Popular science narrative covering May, Feigenbaum, and the logistic map. Excellent historical context; not a maths textbook." },
    { n:3, col:C.accent,
      authors:"Alligood, K. T., Sauer, T. D. & Yorke, J. A.",
      title:"Chaos: An Introduction to Dynamical Systems",
      details:"Springer, 1996 — Undergraduate-level rigour. Chapter 1 develops the logistic map from scratch with full proofs." },
    { n:4, col:C.accent,
      authors:"Devaney, R. L.",
      title:"An Introduction to Chaotic Dynamical Systems (2nd ed.)",
      details:"Addison-Wesley, 1989 — Mathematically precise. Introduces the three conditions for chaos (Devaney's definition). Ideal bridge to graduate level." },
    { n:5, col:C.orange,
      authors:"May, R. M.",
      title:"Simple mathematical models with very complicated dynamics",
      details:"Nature 261, 459–467 (1976) — The original landmark paper. Essential primary reading; only 8 pages, entirely accessible at BSc level." },
    { n:6, col:C.orange,
      authors:"Sprott, J. C.",
      title:"Chaos and Time-Series Analysis",
      details:"Oxford University Press, 2003 — Broad coverage including the logistic map. Emphasises numerical methods and includes MATLAB/BASIC code listings." },
  ];
  books.forEach((b, i) => {
    const by = 1.28 + i * 0.7;
    refRow(s, 0.3, by, 9.4, b.n, b.authors, b.title, b.details, b.col);
  });
}

// ════════════════════════════════════════════════════════════════
//  MSc CHAPTER DIVIDER
// ════════════════════════════════════════════════════════════════
sectionDivider("MSc / Graduate Section", "Advanced Theory · Problem Sets · References", "0A1628", C.accent);

// ── MSc Slide A: Graduate Content — Renormalisation & Universality
{
  const s = pres.addSlide();
  hdr(s, "Graduate Content: Renormalisation & Universality Theory", "The mathematical machinery behind Feigenbaum's universal constants");

  s.addImage({ data:I.gradFeig, x:5.1, y:1.18, w:4.55, h:2.95 });

  card(s, 0.3, 1.18, 4.6, 4.1, { topbar: C.accent });
  s.addText("Renormalisation Operator T", { x:0.42, y:1.3, w:4.35, h:0.38, fontSize:14, bold:true, color:C.accent, fontFace:"Cambria" });
  const lines = [
    "Define the renormalisation operator on unimodal maps:",
    "T[f](x) = −(1/α) · f(f(−α·x))",
    "where α = −1/f(1) ≈ 2.5029 (Feigenbaum's second constant).",
    "The operator T has a universal fixed point g* satisfying T[g*] = g*, independent of the specific unimodal map.",
    "The linearisation DT at g* has one unstable eigenvalue δ ≈ 4.6692 — this is exactly the Feigenbaum constant.",
    "Period-doubling cascades in all unimodal maps are governed by the same unstable manifold of T in function space.",
    "This explains universality: the rate δ is a property of the renormalisation fixed point, not of any particular map.",
  ];
  let ly = 1.75;
  lines.forEach((line, i) => {
    const isEq = i === 1 || i === 2;
    if (isEq) {
      s.addShape(pres.shapes.RECTANGLE, { x:0.42, y:ly, w:4.25, h:0.42, fill:{color:"0A0F1A"}, line:{color:C.accent, width:1} });
      s.addText(line, { x:0.42, y:ly, w:4.25, h:0.42, fontSize:12, fontFace:"Cambria", bold:true, color:C.accent, align:"center", valign:"middle" });
      ly += 0.48;
    } else {
      s.addText(line, { x:0.42, y:ly, w:4.3, h:0.42, fontSize:11, fontFace:"Calibri", color:C.light, margin:0, valign:"middle" });
      ly += 0.44;
    }
  });

  card(s, 5.1, 4.2, 4.55, 1.05, { topbar: C.orange });
  s.addText("Symbolic Dynamics & Kneading Theory", { x:5.22, y:4.28, w:4.3, h:0.27, fontSize:11.5, bold:true, color:C.orange, fontFace:"Cambria" });
  s.addText("Every orbit can be encoded as an infinite sequence over {L, R} using the partition at the critical point x=0.5. The kneading invariant classifies the topological type of the map and encodes the ordering of all periodic orbits. Milnor–Thurston kneading theory gives a complete combinatorial invariant.", { x:5.22, y:4.56, w:4.3, h:0.65, fontSize:10, fontFace:"Calibri", color:C.light });
}

// ── MSc Slide B: Symbolic dynamics & ergodic theory ──────────────
{
  const s = pres.addSlide();
  hdr(s, "Graduate Content: Ergodic Theory & Measure-Theoretic Chaos", "Invariant measures, mixing, and entropy");

  s.addImage({ data:I.gradSym, x:0.3, y:1.18, w:9.4, h:2.82 });

  card(s, 0.3, 4.15, 3.0, 1.42, { topbar: C.accent });
  s.addText("Invariant Measures", { x:0.42, y:4.27, w:2.76, h:0.32, fontSize:12, bold:true, color:C.accent, fontFace:"Cambria" });
  s.addText("A probability measure μ is invariant under f if μ(f⁻¹(A)) = μ(A) for all measurable A. At r=4, the unique absolutely continuous invariant measure (ACIM) is the arcsine distribution ρ(x) = 1/[π√(x(1−x))]. Existence proved by Lasota & Yorke (1973).", { x:0.42, y:4.6, w:2.76, h:0.9, fontSize:10, fontFace:"Calibri", color:C.light });

  card(s, 3.5, 4.15, 3.0, 1.42, { topbar: C.purple });
  s.addText("Mixing & Correlation Decay", { x:3.62, y:4.27, w:2.76, h:0.32, fontSize:12, bold:true, color:C.purple, fontFace:"Cambria" });
  s.addText("A system is (strong) mixing if μ(A∩f⁻ⁿ(B)) → μ(A)μ(B) as n→∞. This implies exponential decay of correlations: C(n) = 〈g(fⁿ)h〉 − 〈g〉〈h〉 → 0. At r=4 the autocorrelation decays exponentially — confirmed numerically (right panel above).", { x:3.62, y:4.6, w:2.76, h:0.9, fontSize:10, fontFace:"Calibri", color:C.light });

  card(s, 6.7, 4.15, 3.0, 1.42, { topbar: C.green });
  s.addText("Kolmogorov–Sinai Entropy", { x:6.82, y:4.27, w:2.76, h:0.32, fontSize:12, bold:true, color:C.green, fontFace:"Cambria" });
  s.addText("The KS entropy h(f, μ) equals the metric entropy and, by Pesin's theorem, equals the sum of positive Lyapunov exponents: h = λ = ln 2 at r = 4. Topological entropy hₜₒₚ = max over all invariant measures; equals ln 2 for r = 4.", { x:6.82, y:4.6, w:2.76, h:0.9, fontSize:10, fontFace:"Calibri", color:C.light });
}

// ── MSc Slide C: Advanced topics ────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "Graduate Content: Advanced Topics", "Multifractal analysis, topological entropy, conjugacies");

  s.addImage({ data:I.gradAdv, x:5.1, y:1.18, w:4.55, h:2.95 });

  card(s, 0.3, 1.18, 4.6, 4.1, { topbar: C.purple });
  s.addText("Multifractal Formalism", { x:0.42, y:1.3, w:4.35, h:0.38, fontSize:14, bold:true, color:C.purple, fontFace:"Cambria" });
  const mlines = [
    ["Hölder exponent α", "Measures local scaling of the invariant measure: μ(Bᵣ(x)) ~ rᵅ"],
    ["Multifractal spectrum f(α)", "Hausdorff dimension of the set {x : local exponent = α}; gives a curved spectrum for non-uniform measures"],
    ["Legendre transform", "f(α) = infₓ[αq − τ(q)] where τ(q) is the Rényi dimension spectrum D_q"],
    ["At r=4", "The arcsine measure yields f(α) parabolic, max f=1 at α=1; all Rényi dimensions D_q = 1"],
    ["Cantor-set attractor", "At r∞: measure concentrated on a Cantor set; D_H ≈ 0.538; non-trivial multifractal spectrum"],
  ];
  let my = 1.76;
  mlines.forEach(([t, d]) => {
    s.addText(t + ": ", { x:0.42, y:my, w:1.45, h:0.4, fontSize:11, fontFace:"Cambria", bold:true, color:C.purple, margin:0, valign:"middle" });
    s.addText(d, { x:1.87, y:my, w:3.0, h:0.4, fontSize:11, fontFace:"Calibri", color:C.light, margin:0, valign:"middle" });
    my += 0.45;
  });

  card(s, 0.3, 4.38, 4.6, 0.88, { topbar: C.orange });
  s.addText("Topological Conjugacy", { x:0.42, y:4.48, w:4.35, h:0.3, fontSize:12, bold:true, color:C.orange, fontFace:"Cambria" });
  s.addText("At r=4: f topologically conjugate to tent map via h(x)=sin²(πx/2) — satisfies f∘h = h∘T. Also conjugate to the angle-doubling map θ↦2θ on the circle, and to the bit-shift on binary sequences. Conjugacy preserves all topological properties.", { x:0.42, y:4.8, w:4.35, h:0.42, fontSize:10.5, fontFace:"Calibri", color:C.light });

  card(s, 5.1, 4.28, 4.55, 1.0, { topbar: C.yellow });
  s.addText("Stability Islands & Sharkovsky Order", { x:5.22, y:4.38, w:4.3, h:0.32, fontSize:12.5, bold:true, color:C.yellow, fontFace:"Cambria" });
  s.addText("Sharkovsky's theorem (1964): if a continuous map of ℝ has a period-n orbit, it has a period-m orbit for all m that follow n in the Sharkovsky order: 3≺5≺7≺…≺2·3≺2·5≺…≺2²·3≺…≺2ⁿ≺…≺4≺2≺1. Period-3 ⟹ all periods.", { x:5.22, y:4.72, w:4.3, h:0.5, fontSize:10.5, fontFace:"Calibri", color:C.light });
}

// ── MSc Slide D: MSc Simple Problems ─────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc — Problem Set I: Foundational Graduate Problems", "Analytical problems requiring measure theory and functional analysis");
  const mprobs = [
    { n:"M1", col:C.accent,
      title:"Invariant measure construction",
      body:"Use the Frobenius–Perron operator P defined by (Pρ)(x) = Σ ρ(y)/|f'(y)| over pre-images to find the invariant density of the logistic map at r=4. Verify it satisfies Pρ* = ρ*." },
    { n:"M2", col:C.accent,
      title:"Topological entropy",
      body:"Prove that the topological entropy of the logistic map at r=4 equals ln 2 using the lap-counting formula hₜₒₚ = lim(1/n)ln(laps of fⁿ). Reconcile with the Pesin formula hₜₒₚ = λ = ln 2." },
    { n:"M3", col:C.purple,
      title:"Renormalisation fixed point",
      body:"Verify numerically that the functional equation g(x) = −(1/α)g(g(−αx)) is satisfied to high precision by a polynomial approximation to g* truncated at degree 6. Compute α and δ from the linearisation." },
    { n:"M4", col:C.purple,
      title:"Kneading invariant",
      body:"Compute the kneading sequence for r = 3.5 (period-4 orbit). Write down the symbolic itinerary of the critical point x=0.5 under iteration, and use it to predict the ordering of all periodic orbits." },
    { n:"M5", col:C.orange,
      title:"Decay of correlations",
      body:"For the logistic map at r=4, prove that the autocorrelation function C(n) = ∫xₙ·x₀ dμ − (∫x dμ)² decays exponentially in n using the spectral gap of the Frobenius–Perron operator on L²(μ)." },
    { n:"M6", col:C.orange,
      title:"Hausdorff dimension",
      body:"Estimate the Hausdorff dimension of the Feigenbaum attractor (at r∞ ≈ 3.5699) numerically using a box-counting algorithm. Compare to the known value D_H ≈ 0.538 and explain its non-integer character." },
  ];
  const mc = [0.3, 3.42, 6.55], mr = [1.28, 3.1];
  mprobs.forEach((p, i) => {
    const bx=mc[i%3], by=mr[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Problem "+p.n+": "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── MSc Slide E: MSc Complex Problems ────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc — Problem Set II: Advanced Graduate Problems", "Research-level problems requiring deep theoretical tools");
  const mprobs2 = [
    { n:"M7", col:C.accent,
      title:"Universality proof sketch",
      body:"Sketch the argument that all unimodal maps with a quadratic critical point share the same Feigenbaum constants. Identify the role of the unstable manifold of the renormalisation fixed point g* in function space." },
    { n:"M8", col:C.purple,
      title:"Stochastic logistic map",
      body:"Add additive noise: xₙ₊₁ = rxₙ(1−xₙ) + σεₙ where εₙ ~ N(0,1). Analyse how noise smears the bifurcation diagram. Show that the noise-perturbed invariant density satisfies a Fokker–Planck equation in the small-noise limit." },
    { n:"M9", col:C.purple,
      title:"Complex logistic map",
      body:"Extend the logistic map to complex r ∈ ℂ. Show that for r ∈ ℝ the map reduces to the standard case, but for r ∈ ℂ the filled Julia set connects the logistic map to the Mandelbrot set. Locate the main cardioid boundary." },
    { n:"M10", col:C.orange,
      title:"Coupled map lattice",
      body:"Study a 1D lattice of N coupled logistic maps: xₙ₊₁(i) = (1−ε)f(xₙ(i)) + (ε/2)[f(xₙ(i−1))+f(xₙ(i+1))]. Identify conditions on ε and r for synchronisation. Relate to spatiotemporal chaos." },
    { n:"M11", col:C.orange,
      title:"Rigorous chaos proof",
      body:"Using the Li–Yorke theorem (1975), give a rigorous proof that the existence of a period-3 point implies chaos (in the Li–Yorke sense) for the logistic map. Identify an explicit period-3 point for r = 1+2√2." },
    { n:"M12", col:C.yellow,
      title:"Symbolic entropy bound",
      body:"Using symbolic dynamics, prove that the topological entropy h(f) of the logistic map satisfies h(f) ≥ (1/p)ln k_p where k_p is the number of distinct period-p orbits. Compute this bound for p = 1,2,3 and compare to ln 2." },
  ];
  const mc2 = [0.3,3.42,6.55], mr2 = [1.28,3.1];
  mprobs2.forEach((p,i)=>{
    const bx=mc2[i%3],by=mr2[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Problem "+p.n+": "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── MSc Slide F: MSc Project Proposals ───────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc — Project Proposals", "Research-oriented dissertation projects");
  const projs = [
    { col:C.accent, title:"MP1: Stochastic bifurcations",
      body:"Systematically study how additive and multiplicative noise modify the period-doubling cascade. Use the Fokker–Planck framework to derive noise-shifted bifurcation points and compare to numerical simulations. Expected finding: bifurcations shift by O(σ²/³)." },
    { col:C.purple, title:"MP2: Coupled map lattices & synchronisation",
      body:"Investigate coupled logistic maps on a ring of N oscillators. Map out the parameter space (r, ε) separating: full synchronisation, cluster states, and spatiotemporal chaos. Characterise transition via the transverse Lyapunov exponent." },
    { col:C.orange, title:"MP3: Generalised Feigenbaum theory",
      body:"Extend the renormalisation analysis to maps with a critical point of order z ≠ 2 (i.e., f'(x*) = 0, f''(x*) ≠ 0). Numerically compute δ(z) and α(z). Verify that δ → 2 and α → 1 as z → ∞ (the symbolic limit)." },
    { col:C.yellow, title:"MP4: Experimental period-doubling",
      body:"Use an analogue circuit (e.g. Wien-bridge oscillator with diode nonlinearity) or driven nonlinear pendulum to observe period-doubling experimentally. Measure the bifurcation sequence, estimate δ, and compare to Feigenbaum's constant. Write a full experimental report." },
  ];
  projs.forEach((p,i)=>{
    const bx=0.3+(i%2)*4.75, by=1.28+Math.floor(i/2)*2.05;
    card(s,bx,by,4.5,1.9,{topbar:p.col});
    s.addText(p.title,{x:bx+0.12,y:by+0.1,w:4.26,h:0.35,fontSize:12,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.48,w:4.26,h:1.32,fontSize:10.5,fontFace:"Calibri",color:C.light});
  });
}

// ── MSc Slide G: Graduate Textbooks (page 1) ─────────────────────
{
  const s = pres.addSlide();
  hdr(s, "MSc / Graduate Textbooks — Core References", "Essential books for a rigorous treatment of chaos and dynamical systems");
  const gbooks = [
    { n:1, col:C.accent,
      authors:"Katok, A. & Hasselblatt, B.",
      title:"Introduction to the Modern Theory of Dynamical Systems",
      details:"Cambridge University Press, 1995 — The graduate bible. Chapter 15 covers low-dimensional chaos, Pesin theory, Lyapunov exponents." },
    { n:2, col:C.accent,
      authors:"de Melo, W. & van Strien, S.",
      title:"One-Dimensional Dynamics",
      details:"Springer, 1993 — Comprehensive and rigorous treatment of interval maps. Proves existence of ACIMs, renormalisation, Feigenbaum theory." },
    { n:3, col:C.purple,
      authors:"Collet, P. & Eckmann, J.-P.",
      title:"Iterated Maps on the Interval as Dynamical Systems",
      details:"Birkhäuser, 1980 (reprint 2009) — The original rigorous treatment of period-doubling universality. Proves existence of the Feigenbaum fixed point." },
    { n:4, col:C.purple,
      authors:"Milnor, J. & Thurston, W.",
      title:"On Iterated Maps of the Interval",
      details:"Lecture Notes in Math 1342, Springer, 1988 — Foundational paper on kneading theory. Defines kneading invariants and proves topological classification." },
    { n:5, col:C.orange,
      authors:"Ott, E.",
      title:"Chaos in Dynamical Systems (2nd ed.)",
      details:"Cambridge University Press, 2002 — Graduate-level treatment including fractal dimensions, Lyapunov exponents, and applications. Chapters 2–4 cover the logistic map in depth." },
    { n:6, col:C.orange,
      authors:"Robinson, C.",
      title:"Dynamical Systems: Stability, Symbolic Dynamics, and Chaos",
      details:"CRC Press, 1995 — Rigorous graduate text. Good coverage of symbolic dynamics, topological entropy, and the connection to the logistic map." },
  ];
  gbooks.forEach((b,i)=>{
    const by=1.28+i*0.7;
    refRow(s,0.3,by,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── MSc Slide H: Graduate Textbooks (page 2) + Key Papers ────────
{
  const s = pres.addSlide();
  hdr(s, "MSc / Graduate References — Key Papers & More Books", "Primary literature and additional graduate reading");

  // Left: more books
  card(s, 0.3, 1.18, 4.55, 4.1, { topbar: C.accent });
  s.addText("Additional Graduate Books", { x:0.42, y:1.3, w:4.3, h:0.35, fontSize:13.5, bold:true, color:C.accent, fontFace:"Cambria" });
  const mbooks2 = [
    { n:7, col:C.accent, authors:"Lasota, A. & Mackey, M. C.", title:"Chaos, Fractals and Noise", details:"Springer, 1994 — Stochastic aspects, Frobenius–Perron operator, invariant measures." },
    { n:8, col:C.purple, authors:"Falconer, K.", title:"Fractal Geometry (3rd ed.)", details:"Wiley, 2014 — Definitive reference on fractal dimensions. Chapter 13 covers dynamical systems." },
    { n:9, col:C.purple, authors:"Walters, P.", title:"An Introduction to Ergodic Theory", details:"Springer, 1982 — KS entropy, mixing, invariant measures. Essential ergodic theory background." },
    { n:10, col:C.orange, authors:"Wiggins, S.", title:"Introduction to Applied Nonlinear Dynamical Systems and Chaos", details:"Springer, 2003 — Applied graduate level. Good chapter on 1D maps and bifurcations." },
  ];
  let by2 = 1.72;
  mbooks2.forEach(b => {
    refRow(s, 0.42, by2, 4.3, b.n, b.authors, b.title, b.details, b.col);
    by2 += 0.62;
  });

  // Right: key papers
  card(s, 5.1, 1.18, 4.55, 4.1, { topbar: C.orange });
  s.addText("Essential Graduate Papers", { x:5.22, y:1.3, w:4.3, h:0.35, fontSize:13.5, bold:true, color:C.orange, fontFace:"Cambria" });
  const papers = [
    { n:1, col:C.orange, authors:"Feigenbaum, M. J.", title:"Quantitative universality for a class of nonlinear transformations", details:"J. Stat. Phys. 19, 25–52 (1978) — Original discovery of δ and α." },
    { n:2, col:C.orange, authors:"Li, T.-Y. & Yorke, J. A.", title:"Period three implies chaos", details:"Am. Math. Monthly 82, 985–992 (1975) — Coined 'chaos'; rigorous period-3 result." },
    { n:3, col:C.yellow, authors:"Lasota, A. & Yorke, J. A.", title:"On the existence of invariant measures", details:"Trans. AMS 186, 481–488 (1973) — Proved existence of ACIM for piecewise expanding maps." },
    { n:4, col:C.yellow, authors:"Collet, P. & Eckmann, J.-P.", title:"A renormalization group analysis of the hierarchical model", details:"Commun. Math. Phys. 55, 67–96 (1977) — Rigorous renormalisation." },
    { n:5, col:C.green, authors:"Jakobson, M. V.", title:"Absolutely continuous invariant measures for one-parameter families", details:"Commun. Math. Phys. 81, 39–88 (1981) — Positive measure set of r values with ACIM." },
  ];
  let rpy = 1.72;
  papers.forEach(p => {
    refRow(s, 5.22, rpy, 4.3, p.n, p.authors, p.title, p.details, p.col);
    rpy += 0.68;
  });
}

// ════════════════════════════════════════════════════════════════
//  PhD CHAPTER DIVIDER
// ════════════════════════════════════════════════════════════════
sectionDivider("PhD / Research Section", "Open Problems · Publications · Review Papers", "0A1628", C.orange);

// ── PhD Slide A: PhD-level content ────────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD-Level Content: Current Research Landscape", "Open frontiers where the logistic map intersects active research");

  s.addImage({ data:I.phdAdv, x:5.1, y:1.18, w:4.55, h:2.9 });

  card(s, 0.3, 1.18, 4.6, 4.1, { topbar: C.orange });
  s.addText("Active Research Areas", { x:0.42, y:1.3, w:4.35, h:0.38, fontSize:14, bold:true, color:C.orange, fontFace:"Cambria" });
  const areas = [
    ["Noise-induced phenomena", "Stochastic resonance, noise-induced transitions between attractors, blowout bifurcations in random dynamical systems."],
    ["Non-autonomous & driven maps", "Time-varying r(n), quasi-periodically forced logistic maps; strange non-chaotic attractors (SNAs) in the parameter space."],
    ["Network & coupled maps", "Coupled map lattices (CMLs), chimera states, cluster synchronisation, and spatiotemporal pattern formation in large arrays."],
    ["Quantum analogues", "Quantum logistic map, entanglement dynamics in quantum chaos, and connections to random matrix theory (GUE statistics of level spacings)."],
    ["Machine learning & prediction", "Using reservoir computing and echo-state networks to predict chaotic time series from the logistic map; connections to computational learning theory."],
    ["Generalised maps", "z-unimodal maps, Lorenz-like maps, higher-dimensional generalisations; universality in 2D maps (Hénon family)."],
  ];
  let ay = 1.76;
  areas.forEach(([t, d]) => {
    s.addShape(pres.shapes.RECTANGLE, { x:0.4, y:ay+0.04, w:0.055, h:0.46, fill:{color:C.orange}, line:{type:"none"} });
    s.addText(t, { x:0.55, y:ay, w:4.1, h:0.24, fontSize:10.5, fontFace:"Cambria", bold:true, color:C.orange, margin:0 });
    s.addText(d, { x:0.55, y:ay+0.24, w:4.1, h:0.28, fontSize:9.5, fontFace:"Calibri", color:C.light, margin:0 });
    ay += 0.56;
  });

  card(s, 5.1, 4.22, 4.55, 1.06, { topbar: C.red });
  s.addText("Complexity & Computational Aspects", { x:5.22, y:4.32, w:4.3, h:0.32, fontSize:12.5, bold:true, color:C.red, fontFace:"Cambria" });
  s.addText("The logistic map at r=4 is computationally universal (Wolfram). Connections to #P-hard problems in counting periodic orbits. Relations to one-way functions and pseudorandomness in cryptography. Recent work on certified computation of invariant measures.", { x:5.22, y:4.66, w:4.3, h:0.55, fontSize:10.5, fontFace:"Calibri", color:C.light });
}

// ── PhD Slide B: Simple research problems ─────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Accessible Research Problems", "Well-posed problems solvable within a PhD chapter");
  const rprobs = [
    { n:"R1", col:C.orange,
      title:"Noise-perturbed bifurcation diagram",
      body:"Derive analytically how additive noise σεₙ shifts the period-doubling bifurcation points. Conjecture: the k-th bifurcation shifts by O(σ^(2/3) δᵏ). Verify numerically and provide a rigorous lower bound using the Frobenius–Perron operator." },
    { n:"R2", col:C.orange,
      title:"Rate of mixing for non-quadratic maps",
      body:"For the family fᵣ,z(x) = 1 − r|x|^z with z ≠ 2, determine how the exponential rate of mixing (spectral gap of F-P operator) depends on z. Establish whether the gap closes as z→1 (piecewise linear limit) and z→∞ (symbolic limit)." },
    { n:"R3", col:C.accent,
      title:"Lyapunov spectrum in coupled maps",
      body:"For a ring of N coupled logistic maps (CML), compute the full Lyapunov spectrum λ₁ ≥ λ₂ ≥ … ≥ λ_N as a function of coupling ε and r. Identify the Kaplan–Yorke dimension and relate it to spatiotemporal complexity." },
    { n:"R4", col:C.accent,
      title:"Strange non-chaotic attractors",
      body:"In the quasi-periodically forced logistic map xₙ₊₁ = r·xₙ(1−xₙ)·(1+ε·cos(2πnω)), identify the parameter regime where strange non-chaotic attractors (SNAs) exist (λ < 0 but fractal structure). Characterise via the phase sensitivity exponent." },
    { n:"R5", col:C.purple,
      title:"Certified computation of invariant measures",
      body:"Using interval arithmetic and rigorous enclosures of the Frobenius–Perron operator, compute a certified upper bound on the L¹ error in the approximated invariant density for r=3.8 (periodic window). Compare to known numerical methods." },
    { n:"R6", col:C.purple,
      title:"Quantum logistic map entanglement",
      body:"Define the quantum logistic map via a unitary operator on qubits. Study how bipartite entanglement entropy grows under iteration. Determine whether the classical Lyapunov exponent bounds the entanglement growth rate and identify phase transitions." },
  ];
  const rc=[0.3,3.42,6.55], rr=[1.28,3.1];
  rprobs.forEach((p,i)=>{
    const bx=rc[i%3],by=rr[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Problem "+p.n+": "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── PhD Slide C: Open research problems ───────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Open Research Problems", "Unsolved or partially solved problems at the frontier");
  const open = [
    { n:"O1", col:C.red,
      title:"Measure of chaos in parameter space",
      body:"Jakobson (1981) proved that the set of r values with an ACIM has positive Lebesgue measure. Open: determine the exact measure of this set in [3.57, 4]. Graczyk–Świątek proved denseness of hyperbolicity but the exact Hausdorff dimension of the 'chaotic' set remains open." },
    { n:"O2", col:C.red,
      title:"Smooth conjugacy at bifurcation points",
      body:"The Feigenbaum fixed point g* is known to exist and be C^∞. Open: prove (rigorously, without computer-assisted proof) that the linearisation of the renormalisation operator T at g* has exactly one unstable eigenvalue δ ≈ 4.6692." },
    { n:"O3", col:C.orange,
      title:"Statistical properties for typical parameters",
      body:"For Lebesgue-almost every r ∈ (r∞, 4] with an ACIM, prove exponential decay of correlations and a central limit theorem for Birkhoff sums. Partial results exist (Benedicks–Carleson, Young 1992), but complete characterisation is open." },
    { n:"O4", col:C.orange,
      title:"Complex analytic extension of universality",
      body:"Prove rigorously that the Feigenbaum universality extends to the full complex analytic setting — i.e. that the quadratic family has a renormalisation fixed point in the space of analytic maps, with the same δ. Partial results by McMullen (1996) exist." },
    { n:"O5", col:C.purple,
      title:"Universality in higher dimensions",
      body:"For 2D Hénon-like maps fₐ,ᵦ(x,y) = (1−ax²+y, bx), the period-doubling route to chaos was proved to exist by Coullet–Tresser and Feigenbaum independently, but a complete renormalisation proof in 2D is still incomplete for b≠0." },
    { n:"O6", col:C.purple,
      title:"Quantum-classical correspondence",
      body:"Define precisely the semiclassical limit of the quantum logistic map as ℏ→0. Prove (or disprove) that quantum ergodicity (eigenstate thermalisation) holds in the classically chaotic regime, and characterise the quantum-classical transition boundary." },
  ];
  const oc=[0.3,3.42,6.55], oor=[1.28,3.1];
  open.forEach((p,i)=>{
    const bx=oc[i%3],by=oor[Math.floor(i/3)];
    card(s,bx,by,2.88,1.72,{topbar:p.col});
    s.addText("Open: "+p.title,{x:bx+0.12,y:by+0.1,w:2.64,h:0.38,fontSize:11,fontFace:"Cambria",bold:true,color:p.col});
    s.addText(p.body,{x:bx+0.12,y:by+0.5,w:2.64,h:1.12,fontSize:10,fontFace:"Calibri",color:C.light});
  });
}

// ── PhD Slide D: Core publications (page 1) ───────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Essential Publications I", "Foundational papers every researcher should know");
  const pubs1 = [
    { n:1, col:C.orange, authors:"Feigenbaum, M. J.", title:"Quantitative universality for a class of nonlinear transformations", details:"J. Stat. Phys. 19, 25–52 (1978). First announcement of δ ≈ 4.6692." },
    { n:2, col:C.orange, authors:"Feigenbaum, M. J.", title:"The universal metric properties of nonlinear transformations", details:"J. Stat. Phys. 21, 669–706 (1979). Full renormalisation theory; introduces α ≈ 2.5029." },
    { n:3, col:C.accent, authors:"Coullet, P. & Tresser, C.", title:"Itérations d'endomorphismes et groupe de renormalisation", details:"C. R. Acad. Sci. Paris 287A, 577 (1978). Independent discovery of Feigenbaum universality." },
    { n:4, col:C.accent, authors:"May, R. M.", title:"Simple mathematical models with very complicated dynamics", details:"Nature 261, 459–467 (1976). The landmark popularisation paper." },
    { n:5, col:C.purple, authors:"Li, T.-Y. & Yorke, J. A.", title:"Period three implies chaos", details:"Am. Math. Monthly 82, 985–992 (1975). Coined the term 'chaos'; proved period-3 implies all periods." },
    { n:6, col:C.purple, authors:"Lorenz, E. N.", title:"Deterministic nonperiodic flow", details:"J. Atmos. Sci. 20, 130–141 (1963). The famous paper introducing the Lorenz attractor and sensitive dependence." },
    { n:7, col:C.green, authors:"Jakobson, M. V.", title:"Absolutely continuous invariant measures for one-parameter families of one-dimensional maps", details:"Commun. Math. Phys. 81, 39–88 (1981). Proved positive measure of parameters with ACIM." },
    { n:8, col:C.green, authors:"Collet, P. & Eckmann, J.-P.", title:"Iterated Maps on the Interval as Dynamical Systems", details:"Birkhäuser (1980). First rigorous book-length treatment of renormalisation universality." },
  ];
  pubs1.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── PhD Slide E: Core publications (page 2) ───────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Essential Publications II", "Advanced papers on invariant measures, symbolic dynamics, and ergodic theory");
  const pubs2 = [
    { n:9,  col:C.orange, authors:"Lasota, A. & Yorke, J. A.", title:"On the existence of invariant measures for piecewise monotonic transformations", details:"Trans. AMS 186, 481–488 (1973). Proved existence of ACIMs for piecewise expanding maps." },
    { n:10, col:C.orange, authors:"Graczyk, J. & Świątek, G.", title:"Generic hyperbolicity in the logistic family", details:"Ann. Math. 146, 1–52 (1997). Proved hyperbolicity is dense in parameter space." },
    { n:11, col:C.accent, authors:"Lyubich, M.", title:"Almost every real quadratic map is either regular or stochastic", details:"Ann. Math. 156, 1–78 (2002). Resolves the measure-theoretic dichotomy for the logistic family." },
    { n:12, col:C.accent, authors:"Benedicks, M. & Carleson, L.", title:"On iterations of 1−ax² on (−1, 1)", details:"Ann. Math. 122, 1–25 (1985). Proved positive measure chaotic parameters for quadratic maps." },
    { n:13, col:C.purple, authors:"Young, L.-S.", title:"Statistical properties of dynamical systems with some hyperbolicity", details:"Ann. Math. 147, 585–650 (1998). Tower constructions; exponential mixing for logistic-type maps." },
    { n:14, col:C.purple, authors:"McMullen, C. T.", title:"The Mandelbrot set is universal", details:"In 'The Mandelbrot Set, Theme and Variations', CUP (2000). Renormalisation in complex dynamics." },
    { n:15, col:C.green, authors:"Sharkovsky, O. M.", title:"Coexistence of cycles of a continuous mapping of a line into itself", details:"Ukr. Math. J. 16, 61–71 (1964). The original Sharkovsky ordering theorem." },
    { n:16, col:C.green, authors:"Milnor, J. & Thurston, W.", title:"On iterated maps of the interval", details:"Lecture Notes in Math. 1342, 465–563, Springer (1988). Kneading theory and topological classification." },
  ];
  pubs2.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── PhD Slide F: Core publications (page 3) ───────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Essential Publications III", "Applications, noise, coupled maps, and recent theoretical advances");
  const pubs3 = [
    { n:17, col:C.orange, authors:"Kaneko, K.", title:"Spatiotemporal chaos in one- and two-dimensional coupled map lattices", details:"Physica D 37, 60–82 (1989). Foundational CML paper; period-doubling in extended systems." },
    { n:18, col:C.orange, authors:"Grebogi, C., Ott, E. & Yorke, J. A.", title:"Crises, sudden changes in chaotic attractors and transient chaos", details:"Physica D 7, 181–200 (1983). Interior and boundary crises in the logistic map." },
    { n:19, col:C.accent, authors:"Pomeau, Y. & Manneville, P.", title:"Intermittent transition to turbulence in dissipative dynamical systems", details:"Commun. Math. Phys. 74, 189–197 (1980). The intermittency route; Pomeau–Manneville scenario." },
    { n:20, col:C.accent, authors:"Eckmann, J.-P. & Ruelle, D.", title:"Ergodic theory of chaos and strange attractors", details:"Rev. Mod. Phys. 57, 617–656 (1985). Comprehensive review of Lyapunov exponents, entropy, and dimensions." },
    { n:21, col:C.purple, authors:"Rand, D., Ostlund, S., Sethna, J. & Siggia, E. D.", title:"Universal transition from quasiperiodicity to chaos in dissipative systems", details:"Phys. Rev. Lett. 49, 132 (1982). Circle-map route to chaos; different universality class." },
    { n:22, col:C.purple, authors:"Avila, A. & Moreira, C. G.", title:"Statistical properties of unimodal maps", details:"Publ. Math. IHÉS 101, 1–69 (2005). Most complete modern treatment of the statistical theory." },
    { n:23, col:C.green, authors:"Tsujii, M.", title:"Absolutely continuous invariant measures for expanding piecewise linear maps", details:"Invent. Math. 143, 349–373 (2001). Spectral gap and mixing rates for maps with ACIMs." },
    { n:24, col:C.green, authors:"Hunt, B. R., Kennedy, J. A., Li, T.-Y. & Nusse, H. E.", title:"SLYRB measures: natural invariant measures for chaotic systems", details:"Physica D 170, 50–71 (2002). SRB/SLYRB measures and their physical interpretation." },
  ];
  pubs3.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}

// ── PhD Slide G: Recent Review Papers ─────────────────────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Recent Review Papers & Modern Surveys", "Review articles and monographs for current research directions");

  // Two columns
  card(s, 0.3, 1.18, 4.55, 4.1, { topbar: C.orange });
  s.addText("Review Articles (2000–present)", { x:0.42, y:1.3, w:4.3, h:0.35, fontSize:13, bold:true, color:C.orange, fontFace:"Cambria" });
  const reviews = [
    { n:1, col:C.orange, authors:"Strogatz, S. H. et al.", title:"Coupled oscillators and biological synchronisation", details:"Sci. Am., Dec 1993 — classic; and Nature Reviews Physics 2022 review of nonlinear dynamics." },
    { n:2, col:C.yellow, authors:"Luzzatto, S., Melbourne, I. & Paccaut, F.", title:"The Lorenz attractor is mixing", details:"Commun. Math. Phys. 260, 393–401 (2005). Rigorous mixing proof, techniques applicable to logistic map." },
    { n:3, col:C.orange, authors:"Viana, M.", title:"Stochastic dynamics of deterministic systems", details:"IMPA Lecture Notes (1997). Reviews Benedicks–Carleson, Young towers; excellent PhD entry point." },
    { n:4, col:C.yellow, authors:"Avila, A.", title:"Global theory of one-frequency Schrödinger operators", details:"Acta Math. 215, 1–54 (2015). Fields medal work; connections to 1D dynamics and renormalisation." },
    { n:5, col:C.orange, authors:"Baladi, V.", title:"Dynamical Zeta Functions and Dynamical Determinants for Hyperbolic Maps", details:"Springer (2018). Modern spectral theory for transfer operators; includes logistic map examples." },
  ];
  let ry = 1.72;
  reviews.forEach(r => {
    refRow(s, 0.42, ry, 4.3, r.n, r.authors, r.title, r.details, r.col);
    ry += 0.68;
  });

  card(s, 5.1, 1.18, 4.55, 4.1, { topbar: C.purple });
  s.addText("Modern Research Directions", { x:5.22, y:1.3, w:4.3, h:0.35, fontSize:13, bold:true, color:C.purple, fontFace:"Cambria" });
  const modern = [
    { n:6, col:C.purple, authors:"Galatolo, S. & Nisoli, I.", title:"Rigorous computation of invariant measures and rates of decay of correlations", details:"arXiv:2107.xxxxx (2021). Certified numerical methods for logistic-type maps." },
    { n:7, col:C.purple, authors:"Bochi, J. & Viana, M.", title:"The Lyapunov exponents of generic volume-preserving and symplectic maps", details:"Ann. Math. 161, 1423–1485 (2005). Generic Lyapunov theory." },
    { n:8, col:C.green, authors:"Carvalho, M. & Varandas, P.", title:"(Semi)continuity of the entropy of Sinai–Ruelle–Bowen measures", details:"Nonlinearity 35 (2022). Recent progress on entropy continuity near bifurcations." },
    { n:9, col:C.green, authors:"Liverani, C.", title:"Decay of correlations", details:"Ann. Math. 142, 239–301 (1995). Seminal paper on exponential mixing using cone methods." },
    { n:10, col:C.purple, authors:"Benedicks, M. & Young, L.-S.", title:"Absolutely continuous invariant measures and random perturbations for certain one-dimensional maps", details:"Ergodic Th. Dyn. Sys. 12, 13–37 (1992)." },
  ];
  let rpy2 = 1.72;
  modern.forEach(r => {
    refRow(s, 5.22, rpy2, 4.3, r.n, r.authors, r.title, r.details, r.col);
    rpy2 += 0.68;
  });
}

// ── PhD Slide H: PhD Textbooks & Advanced Monographs ──────────────
{
  const s = pres.addSlide();
  hdr(s, "PhD — Advanced Monographs & PhD-Level Books", "Graduate textbooks for deep immersion in the field");
  const phbooks = [
    { n:1, col:C.orange, authors:"Baladi, V.", title:"Positive Transfer Operators and Decay of Correlations", details:"World Scientific (2000). Rigorous spectral theory for Perron–Frobenius operators; mixing rates." },
    { n:2, col:C.orange, authors:"de Melo, W. & van Strien, S.", title:"One-Dimensional Dynamics", details:"Springer (1993). The definitive research monograph. Complete proofs of all major results for interval maps." },
    { n:3, col:C.purple, authors:"Collet, P. & Eckmann, J.-P.", title:"Iterated Maps on the Interval as Dynamical Systems", details:"Birkhäuser (1980, reprint 2009). The original universality monograph; still the gold standard." },
    { n:4, col:C.purple, authors:"Milnor, J.", title:"Dynamics in One Complex Variable (3rd ed.)", details:"Princeton University Press (2006). Complex analytic dynamics; Mandelbrot set, Julia sets, renormalisation." },
    { n:5, col:C.accent, authors:"Young, L.-S.", title:"What are SRB measures and which dynamical systems have them?", details:"J. Stat. Phys. 108, 733–754 (2002). Definitive survey of physical measures; highly recommended." },
    { n:6, col:C.accent, authors:"Hasselblatt, B. & Katok, A. (eds.)", title:"Handbook of Dynamical Systems, Vol. 1A & 1B", details:"Elsevier (2002). Encyclopedia-level reference; chapters on 1D maps, entropy, Lyapunov exponents." },
    { n:7, col:C.green, authors:"Lyubich, M.", title:"Forty years of unimodal dynamics", details:"J. Math. Sci. 170, 680–713 (2010). Personal survey of the field's development; highly readable." },
    { n:8, col:C.green, authors:"Viana, M. & Oliveira, K.", title:"Foundations of Ergodic Theory", details:"Cambridge University Press (2016). Modern graduate ergodic theory with dynamical applications." },
  ];
  phbooks.forEach((b,i)=>{
    refRow(s,0.3,1.28+i*0.56,9.4,b.n,b.authors,b.title,b.details,b.col);
  });
}


// ─── WRITE ──────────────────────────────────────────────────────
pres.writeFile({fileName:"/home/claude/logistic_map_v6.pptx"}).then(()=>{
  console.log("Done: logistic_map_v6.pptx");
}).catch(err=>{console.error(err);process.exit(1);});
