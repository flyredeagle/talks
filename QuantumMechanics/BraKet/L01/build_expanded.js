/**
 * L01/build_expanded.js
 * =====================
 * Builds the full expanded L01 slide deck incorporating all 5-tier content:
 *   - Cover + 90-min overview
 *   - Sakurai track / Dirac track / Synthesis
 *   - Key formula slides
 *   - 5 tier slides (HS → PhD): narrative + concept Qs + problems + projects + research
 *   - Bibliography slide per tier
 *   - Pitfalls + homework summary
 */

"use strict";
const path = require("path");
const fs   = require("fs");
const {
  initPres, addSlide, slideHeader, slideFooter,
  accentCard, levelBadge, sectionDivider, lectureAccent,
  C, W, H, FONT_HEAD, FONT_BODY, LEVELS, makeShadow,
} = require("../shared/slide_helpers");

const ROOT    = path.join(__dirname, "..");
const BUILD   = path.join(ROOT, "build", "L01");
const FRMDIR  = path.join(BUILD, "formulas");
const OUTFILE = path.join(BUILD, "L01_expanded.pptx");

// ── load L01 full data (written by Python) ───────────────────────────────────
const dataPath = path.join(BUILD, "lecture_content.json");
if (!fs.existsSync(dataPath)) {
  console.error("lecture_content.json not found — run build_expanded.py first");
  process.exit(1);
}
const DATA = JSON.parse(fs.readFileSync(dataPath, "utf8"));

const ACCENT = lectureAccent(0);  // indigo for L01

// ── colour map for tiers ──────────────────────────────────────────────────────
const TIER_COLORS = {
  HS:    C.hs,
  BegUG: C.begug,
  AdvUG: C.advug,
  MSc:   C.msc,
  PhD:   C.phd,
};
const TIER_LABELS = {
  HS:    "High School",
  BegUG: "Beginning Undergraduate",
  AdvUG: "Advanced Undergraduate",
  MSc:   "Master's Level",
  PhD:   "PhD Level",
};

// ── formula image helper ──────────────────────────────────────────────────────
function frmImg(slide, name, x, y, maxW, maxH) {
  if (!fs.existsSync(FRMDIR)) return;
  const files = fs.readdirSync(FRMDIR).filter(f => f.includes(name) && f.endsWith(".png"));
  if (!files.length) return;
  try {
    const imgPath = path.join(FRMDIR, files[0]);
    const imgData = fs.readFileSync(imgPath);
    const b64 = 'image/png;base64,' + imgData.toString('base64');
    const w = maxW || 4.0;
    const h = maxH || 0.9;
    slide.addImage({ data: b64, x, y, w, h,
      sizing: { type: 'contain', w, h } });
  } catch(e) { /* skip */ }
}

// ── truncate long text for slide display ──────────────────────────────────────
function trunc(s, max=220) { return s && s.length > max ? s.slice(0,max)+"…" : (s||""); }

// ══════════════════════════════════════════════════════════════════════════════
// BUILD
// ══════════════════════════════════════════════════════════════════════════════
async function build() {
  const pres = initPres(`QM L01 (expanded): ${DATA.title}`);

  // ── SLIDE 1: COVER ─────────────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    s.addShape(pres.ShapeType.ellipse, { x:9.5, y:-1.8, w:5.5, h:5.5,
      fill:{ color:ACCENT, transparency:91 }, line:{ color:ACCENT, transparency:85, width:1 }});
    s.addText("Ψ", { x:9.3, y:0.0, w:4, h:4, fontSize:170, color:ACCENT, fontFace:"Cambria",
      transparency:74, margin:0, align:"center" });
    s.addText("QUANTUM MECHANICS — BRA–KET NOTATION", { x:0.6, y:1.0, w:8.5, h:0.45,
      fontSize:10, bold:true, color:C.accent2, charSpacing:6, fontFace:FONT_HEAD, margin:0 });
    s.addText("L01", { x:0.6, y:1.5, w:2.0, h:0.65,
      fontSize:28, bold:true, color:ACCENT, fontFace:FONT_HEAD, margin:0 });
    s.addText(DATA.title, { x:0.6, y:2.15, w:8.8, h:1.9,
      fontSize:36, bold:true, color:C.text, fontFace:FONT_HEAD, margin:0 });
    s.addText(DATA.subtitle, { x:0.6, y:4.1, w:8.8, h:0.45,
      fontSize:14, color:C.accent3, fontFace:FONT_BODY, margin:0 });
    LEVELS.forEach(([lbl,col],i) => levelBadge(s, 0.6+i*0.88, 4.72, lbl, col));
    s.addText("90-minute lecture  ·  Dirac + Sakurai Dual-Track  ·  5 Tiers", {
      x:0.6, y:5.2, w:9, h:0.3, fontSize:10, color:C.textSub, fontFace:FONT_BODY, margin:0 });
    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01");
  }

  // ── SLIDE 2: 90-MIN OVERVIEW + OUTCOMES ────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, "L01 — Lecture Overview", DATA.title, "L01", ACCENT);
    accentCard(s, { x:0.3, y:0.92, w:4.6, h:2.9, accent:C.accent3,
      title:"90-MIN PACING", body:DATA.pacing.join("\n"), titleSz:10, bodySz:9.5 });
    accentCard(s, { x:5.15, y:0.92, w:7.85, h:2.9, accent:ACCENT,
      title:"CORE LEARNING OUTCOMES",
      body: DATA.outcomes.map(o=>`• ${o}`).join("\n"), titleSz:10, bodySz:10 });
    LEVELS.forEach(([lbl,col],i) => {
      const txt = DATA.levels[lbl] || "";
      accentCard(s, { x:0.3+i*2.54, y:3.97, w:2.46, h:1.78,
        accent:col, title:lbl, body:trunc(txt,90), titleSz:10, bodySz:9 });
    });
    accentCard(s, { x:0.3, y:5.9, w:12.7, h:1.28, accent:C.accent4,
      title:"ASSESSMENT BUNDLE",
      body:"Set A: Normalization, amplitudes, global phase, completeness\n"
          +"Set B: Cauchy–Schwarz, triangle inequality, unitary basis change",
      titleSz:10, bodySz:9 });
    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01 · Overview");
  }

  // ── SLIDE 3: SAKURAI TRACK ─────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, "L01 — Sakurai Track: Operational Starting Point",
      "Measurement-first derivation of bra-ket structure", "L01", C.accent3);
    accentCard(s, { x:0.3, y:0.92, w:6.1, h:5.9, accent:C.accent3,
      title:"SAKURAI: Preparation → Statistics → Amplitudes",
      body:"1. PREPARATION\n   A reproducible lab protocol defines a 'state'.\n\n"
          +"2. OUTCOMES\n   Measurement device returns outcomes aᵢ with stable frequencies.\n\n"
          +"3. WHY AMPLITUDES?\n   Interference demands combining before squaring:\n"
          +"   P = |A₁ + A₂|² = |A₁|² + |A₂|² + 2Re(A₁*A₂)\n"
          +"   The cross-term is interference — only complex numbers carry this.\n\n"
          +"4. OPERATIONAL BORN RULE (postulated)\n   P(aᵢ) = |⟨aᵢ|ψ⟩|²\n"
          +"   Normalization: Σᵢ P(aᵢ) = 1  ⟹  ⟨ψ|ψ⟩ = 1",
      bodySz:10.5 });
    accentCard(s, { x:6.65, y:0.92, w:6.35, h:5.9, accent:ACCENT,
      title:"DIRAC TRACK: Abstract Axioms",
      body:"1. STATE SPACE\n   States = rays in complex Hilbert space ℋ\n"
          +"   |ψ⟩ ~ e^{iθ}|ψ⟩  (global phase unobservable)\n\n"
          +"2. BASIS & ORTHONORMALITY\n   ⟨m|n⟩ = δₘₙ\n"
          +"   Σₙ |n⟩⟨n| = Î  (completeness)\n\n"
          +"3. COMPONENTS ARE INNER PRODUCTS\n   |ψ⟩ = Σₙ cₙ|n⟩  →  cₘ = ⟨m|ψ⟩\n"
          +"   (multiply expansion by ⟨m|, use δₘₙ)\n\n"
          +"4. NORMALIZATION\n   ⟨ψ|ψ⟩ = Σₙ|⟨n|ψ⟩|² = Σₙ|cₙ|² = 1\n\n"
          +"5. GLOBAL PHASE INVARIANCE\n   |⟨n|e^{iθ}ψ⟩|² = |⟨n|ψ⟩|²  ∀ basis {|n⟩}",
      bodySz:10.5 });
    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01 · Tracks");
  }

  // ── SLIDE 4: SYNTHESIS DICTIONARY ──────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, "L01 — Synthesis: Operational ↔ Structural", "", "L01", C.accent2);
    accentCard(s, { x:0.3, y:0.92, w:12.7, h:1.1, accent:C.accent2,
      title:"SYNTHESIS DICTIONARY", body:"" });
    const dict = [
      ["Physical preparation", "↔", "Ket |ψ⟩  (ray in ℋ)"],
      ["Measurement outcomes aᵢ", "↔", "Basis kets |aᵢ⟩"],
      ["Transition amplitude", "↔", "Inner product ⟨aᵢ|ψ⟩"],
      ["Probability", "↔", "|⟨aᵢ|ψ⟩|²"],
      ["Total probability = 1", "↔", "Normalization ⟨ψ|ψ⟩ = 1"],
      ["Interference", "↔", "Complex phase structure  Re(A₁*A₂)"],
    ];
    dict.forEach(([left,arr,right],i) => {
      const y = 2.1 + i*0.77;
      const bg = i%2===0 ? C.bgCard : C.bgAlt;
      s.addShape(pres.ShapeType.rect, { x:0.3, y, w:12.7, h:0.72,
        fill:{ color:bg }, line:{ color:"000000", transparency:100 }});
      s.addShape(pres.ShapeType.rect, { x:0.3, y, w:0.06, h:0.72,
        fill:{ color:C.accent2 }, line:{ color:C.accent2 }});
      s.addText(left, { x:0.55, y:y+0.12, w:4.2, h:0.48, fontSize:10.5,
        bold:true, color:C.accent2, fontFace:FONT_HEAD, margin:0 });
      s.addText(arr, { x:4.8, y:y+0.12, w:0.8, h:0.48, fontSize:14,
        color:C.accent3, fontFace:"Cambria", align:"center", margin:0 });
      s.addText(right, { x:5.7, y:y+0.12, w:7.1, h:0.48, fontSize:10.5,
        color:C.text, fontFace:FONT_BODY, margin:0 });
    });
    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01 · Synthesis");
  }

  // ── SLIDE 5: KEY FORMULAS ──────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, "L01 — Key Formulas", "Pre-rendered formula reference", "L01", ACCENT);
    const fnames = Object.keys(DATA.formulas||{});
    const cols = 3, rows = Math.ceil(fnames.length/cols);
    const cellW = (W-0.7)/cols, cellH = (H-1.35)/rows;
    fnames.forEach((name,idx) => {
      const col=idx%cols, row=Math.floor(idx/cols);
      const cx=0.35+col*cellW, cy=1.05+row*cellH;
      accentCard(s, { x:cx, y:cy, w:cellW-0.1, h:cellH-0.1, accent:ACCENT,
        title:name.replace(/_/g," "), body:"", titleSz:9 });
      frmImg(s, name, cx+0.12, cy+0.40, cellW-0.30, cellH-0.60);
    });
    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01 · Formulas");
  }

  // ── SLIDES 6-10: ONE PER TIER ──────────────────────────────────────────────
  const TIER_ORDER = ["HS","BegUG","AdvUG","MSc","PhD"];
  TIER_ORDER.forEach(tier => {
    const tData = (DATA.tiers||{})[tier];
    if (!tData) return;
    const tCol   = TIER_COLORS[tier];
    const tLabel = TIER_LABELS[tier];

    const s = addSlide(pres);
    slideHeader(s, `L01 — ${tier}: ${tLabel}`, tData.narrative ? trunc(tData.narrative,80) : "", "L01", tCol);

    // concept questions (left)
    const cqs = (tData.concept_questions||[]).slice(0,5).map((q,i)=>`${i+1}. ${trunc(q,80)}`).join("\n");
    accentCard(s, { x:0.3, y:0.92, w:4.4, h:2.9, accent:tCol,
      title:"CONCEPT QUESTIONS", body:cqs, titleSz:10, bodySz:9 });

    // simple problems (middle)
    const sp = (tData.problems_simple||[]).slice(0,3).map(p=>`[${p.id}] ${trunc(p.statement,70)}`).join("\n\n");
    accentCard(s, { x:4.95, y:0.92, w:4.05, h:2.9, accent:C.accent3,
      title:"SIMPLE PROBLEMS", body:sp, titleSz:10, bodySz:8.5 });

    // advanced problems (right)
    const ap = (tData.problems_advanced||[]).slice(0,2).map(p=>`[${p.id}] ${trunc(p.statement,70)}`).join("\n\n");
    accentCard(s, { x:9.25, y:0.92, w:3.75, h:2.9, accent:ACCENT,
      title:"ADVANCED PROBLEMS", body:ap, titleSz:10, bodySz:8.5 });

    // projects (bottom-left)
    const ps = tData.project_simple;
    const pa = tData.project_advanced;
    accentCard(s, { x:0.3, y:3.97, w:6.2, h:1.8, accent:C.accent4,
      title:`PROJECT (SIMPLE): ${ps?ps.title:''}`,
      body: ps ? trunc(ps.description,160) : "",
      titleSz:9.5, bodySz:9 });
    accentCard(s, { x:6.75, y:3.97, w:6.25, h:1.8, accent:C.accent2,
      title:`PROJECT (ADVANCED): ${pa?pa.title:''}`,
      body: pa ? trunc(pa.description,160) : "",
      titleSz:9.5, bodySz:9 });

    // research questions (bottom)
    const rs = tData.research_simple;
    const ro = tData.research_open;
    accentCard(s, { x:0.3, y:5.93, w:6.2, h:1.25, accent:"38BDF8",
      title:"RESEARCH (Well-Defined)", body: rs ? trunc(rs.question,130):"", titleSz:9.5, bodySz:8.5 });
    accentCard(s, { x:6.75, y:5.93, w:6.25, h:1.25, accent:"FB7185",
      title:"RESEARCH (Open-Ended)", body: ro ? trunc(ro.question,130):"", titleSz:9.5, bodySz:8.5 });

    slideFooter(s, `QM: Bra–Ket Notation — L01`, `L01 · ${tier}`);
  });

  // ── SLIDE 11: BIBLIOGRAPHY (consolidated) ──────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, "L01 — Bibliography", "Annotated references by tier and category", "L01", ACCENT);

    let y = 0.92;
    const catColors = { historical:"F59E0B", educational:"34D399", research:"6366F1" };

    TIER_ORDER.forEach((tier,ti) => {
      if (y > 6.5) return;
      const tData = (DATA.tiers||{})[tier];
      if (!tData) return;
      const tCol = TIER_COLORS[tier];

      s.addShape(pres.ShapeType.rect, { x:0.3, y, w:0.85, h:0.28,
        fill:{ color:tCol }, line:{ color:tCol } });
      s.addText(tier, { x:0.3, y, w:0.85, h:0.28,
        fontSize:8, bold:true, color:"000000", fontFace:FONT_HEAD, align:"center", margin:0, valign:"middle" });

      const allRefs = [
        ...(tData.refs_historical||[]).map(r=>({...r,cat:"historical"})),
        ...(tData.refs_educational||[]).map(r=>({...r,cat:"educational"})),
        ...(tData.refs_research||[]).map(r=>({...r,cat:"research"})),
      ];
      const refStr = allRefs.slice(0,3).map(r=>{
        const catBadge = r.cat.slice(0,3).toUpperCase();
        return `[${catBadge}] ${r.authors} (${r.year}). ${trunc(r.title,60)}`;
      }).join("\n");

      s.addText(refStr, { x:1.3, y:y+0.02, w:11.7, h:0.52,
        fontSize:8.5, color:C.text, fontFace:FONT_BODY, margin:0, valign:"top" });
      y += 0.6;
    });

    // legend
    Object.entries(catColors).forEach(([cat,col],i) => {
      s.addShape(pres.ShapeType.rect, { x:0.3+i*2, y:H-0.75, w:0.35, h:0.2,
        fill:{ color:col }, line:{ color:col }});
      s.addText(cat.charAt(0).toUpperCase()+cat.slice(1), { x:0.75+i*2, y:H-0.75, w:1.5, h:0.2,
        fontSize:8, color:C.textSub, fontFace:FONT_BODY, margin:0, valign:"middle" });
    });

    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01 · Bibliography");
  }

  // ── SLIDE 12: PITFALLS + HOMEWORK SUMMARY ──────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, "L01 — Common Pitfalls & Homework", "", "L01", C.accent4);
    const pitfalls = (DATA.pitfalls||[]).map(p=>`• ${p}`).join("\n");
    accentCard(s, { x:0.3, y:0.92, w:6.2, h:2.9, accent:C.accent4,
      title:"⚠  COMMON PITFALLS", body:pitfalls, titleSz:11, bodySz:10 });
    accentCard(s, { x:6.75, y:0.92, w:6.25, h:2.9, accent:"F472B6",
      title:"HISTORICAL ANCHORS",
      body: (DATA.history||[]).map(h=>`• ${h}`).join("\n"),
      titleSz:11, bodySz:10 });
    accentCard(s, { x:0.3, y:3.97, w:12.7, h:1.35, accent:C.accent3,
      title:"HOMEWORK ASSIGNMENT",
      body:"Required: HS-A1, BegUG-A1..A3, AdvUG-A1  |  "
          +"Optional honors: AdvUG-B1..B2, MSc-A1..B1  |  "
          +"PhD elective: PhD-A1..B2\n"
          +"Project (choose): Basis-expansion calculator (simple) OR Representations comparison (advanced)",
      titleSz:10, bodySz:9.5 });

    // 5 tier summary badges
    TIER_ORDER.forEach((tier,i) => {
      const tCol = TIER_COLORS[tier];
      const tData = (DATA.tiers||{})[tier];
      const ns = (tData?.problems_simple||[]).length;
      const na = (tData?.problems_advanced||[]).length;
      accentCard(s, { x:0.3+i*2.54, y:5.47, w:2.46, h:1.71, accent:tCol,
        title:tier,
        body:`${ns} simple / ${na} advanced\n2 projects · 2 research Qs\n${((tData?.refs_historical||[]).length+(tData?.refs_educational||[]).length+(tData?.refs_research||[]).length)} references`,
        titleSz:10, bodySz:9 });
    });

    slideFooter(s, "QM: Bra–Ket Notation — L01", "L01 · Pitfalls & HW");
  }

  await pres.writeFile({ fileName: OUTFILE });
  console.log(`✓ Expanded L01: ${OUTFILE}`);
}

build().catch(e => { console.error(e); process.exit(1); });
