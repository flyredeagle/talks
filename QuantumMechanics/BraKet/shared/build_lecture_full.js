/**
 * shared/build_lecture_full.js
 * ============================
 * Generates a fully-expanded lecture deck (~43 slides) from a lecture
 * content JSON.  For every lecture and every tier the deck includes:
 *
 *   FRAME 1  Cover
 *   FRAME 2  90-min overview + outcomes
 *   FRAME 3  Sakurai track (operational)
 *   FRAME 4  Dirac track (axiomatic)
 *   FRAME 5-6  Key formulas (LaTeX-rendered PNGs, 2 pages)
 *
 *   For each of the 5 tiers  (HS / BegUG / AdvUG / MSc / PhD):
 *     FRAME A  Tier intro  — narrative, what/why, connection to other tiers
 *     FRAME B  Core concepts — main ideas + key equations for this tier
 *     FRAME C  Worked example 1  (with full step-by-step)
 *     FRAME D  Worked example 2  (second example or extension)
 *     FRAME E  Concept questions (all 5, with brief guidance)
 *     FRAME F  Problem sets — simple + advanced (full statement + hints)
 *     FRAME G  References — all three categories (hist/edu/research)
 *
 *   FRAME N-1  Common pitfalls (all tiers consolidated)
 *   FRAME N    Homework + project summary
 *
 * CLI:
 *   node shared/build_lecture_full.js \
 *        --data build/L01/lecture_content.json \
 *        --formulas build/L01/formulas \
 *        --out build/L01/L01_full.pptx
 */

"use strict";
const path = require("path");
const fs   = require("fs");
const {
  initPres, addSlide,
  slideHeader, slideFooter,
  accentCard, levelBadge,
  lectureAccent,
  C, W, H, FONT_HEAD, FONT_BODY, LEVELS, makeShadow,
} = require("./slide_helpers");
const { renderedCard } = require("./rendered_card");

// ── tier palette ──────────────────────────────────────────────────────────────
const TIER_COLOR = {
  HS:    C.hs,
  BegUG: C.begug,
  AdvUG: C.advug,
  MSc:   C.msc,
  PhD:   C.phd,
};
const TIER_LABEL = {
  HS:    "High School",
  BegUG: "Beginning Undergraduate",
  AdvUG: "Advanced Undergraduate",
  MSc:   "Master's Level",
  PhD:   "PhD Level",
};
const TIER_ORDER = ["HS","BegUG","AdvUG","MSc","PhD"];

// ── text helpers ──────────────────────────────────────────────────────────────
const trunc = (s, n=260) => s && s.length > n ? s.slice(0,n)+"…" : (s||"");
const trunc2 = (s, n=160) => trunc(s, n);
const bullet = items => items.map((t,i)=>({
  text: trunc(t,200),
  options:{ bullet:true, breakLine: i<items.length-1,
            fontSize:10, color:C.text }
}));
const numberedList = items => items.map((t,i)=>({
  text: `${i+1}. ${trunc(t,200)}`,
  options:{ breakLine: i<items.length-1, fontSize:10, color:C.text }
}));

// ── formula image helper ──────────────────────────────────────────────────────
function frmImg(slide, frmDir, name, x, y, w, h) {
  if (!frmDir || !fs.existsSync(frmDir)) return false;
  const files = fs.readdirSync(frmDir)
    .filter(f => f.startsWith(name+"_") && f.endsWith(".png"));
  if (!files.length) return false;
  try {
    const data = "image/png;base64," +
      fs.readFileSync(path.join(frmDir, files[0])).toString("base64");
    slide.addImage({ data, x, y, w, h, sizing:{ type:"contain", w, h } });
    return true;
  } catch(e) { return false; }
}

// ── divider line ──────────────────────────────────────────────────────────────
function divLine(slide, y, color) {
  slide.addShape(slide._pres.ShapeType.rect, {
    x:0.3, y, w: W-0.6, h:0.012,
    fill:{ color: color||C.textDim }, line:{ color: color||C.textDim },
  });
}

// ── section label pill ────────────────────────────────────────────────────────
function sectionPill(slide, x, y, text, color) {
  const w = Math.max(1.4, text.length * 0.115 + 0.4);
  slide.addShape(slide._pres.ShapeType.rect, {
    x, y, w, h:0.26,
    fill:{ color, transparency:20 },
    line:{ color, width:1 },
  });
  slide.addText(text, {
    x, y, w, h:0.26,
    fontSize:8.5, bold:true, color:C.text,
    fontFace:FONT_HEAD, align:"center", valign:"middle", margin:0,
  });
}

// ── two-column card layout helper ─────────────────────────────────────────────
function twoCards(slide, {
  leftTitle, leftBody, leftAccent,
  rightTitle, rightBody, rightAccent,
  y=0.9, h=5.9, gap=0.12
}) {
  const hw = (W - 0.6 - gap) / 2;
  accentCard(slide, { x:0.3,        y, w:hw, h, accent:leftAccent,
    title:leftTitle,  body:leftBody,  titleSz:11, bodySz:10 });
  accentCard(slide, { x:0.3+hw+gap, y, w:hw, h, accent:rightAccent,
    title:rightTitle, body:rightBody, titleSz:11, bodySz:10 });
}

// ── three-column card layout ──────────────────────────────────────────────────
function threeCards(slide, cards, y=0.9, h=5.9) {
  const cw = (W - 0.6 - 0.2) / 3;
  cards.slice(0,3).forEach(({title,body,accent}, i) => {
    accentCard(slide, { x: 0.3 + i*(cw+0.1), y, w:cw, h,
      accent, title, body, titleSz:10.5, bodySz:9.5 });
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// SLIDE BUILDERS
// ══════════════════════════════════════════════════════════════════════════════

// ── SLIDE 1: Cover ────────────────────────────────────────────────────────────
function slideCover(pres, D, accent) {
  const s = addSlide(pres);
  s.addShape(pres.ShapeType.ellipse, {
    x:9.5, y:-1.8, w:5.5, h:5.5,
    fill:{ color:accent, transparency:91 },
    line:{ color:accent, transparency:85, width:1 }
  });
  s.addText("Ψ", {
    x:9.3, y:0.0, w:4, h:4, fontSize:170, color:accent,
    fontFace:"Cambria", transparency:74, margin:0, align:"center"
  });
  s.addText("QUANTUM MECHANICS — BRA–KET NOTATION", {
    x:0.6, y:1.0, w:8.5, h:0.45, fontSize:10, bold:true,
    color:C.accent2, charSpacing:6, fontFace:FONT_HEAD, margin:0
  });
  s.addText(D.num, { x:0.6, y:1.5, w:2, h:0.65,
    fontSize:28, bold:true, color:accent, fontFace:FONT_HEAD, margin:0 });
  s.addText(D.title, { x:0.6, y:2.18, w:8.8, h:1.85,
    fontSize:34, bold:true, color:C.text, fontFace:FONT_HEAD, margin:0 });
  s.addText(D.subtitle, { x:0.6, y:4.1, w:8.8, h:0.45,
    fontSize:14, color:C.accent3, fontFace:FONT_BODY, margin:0 });
  LEVELS.forEach(([lbl,col],i) => levelBadge(s, 0.6+i*0.88, 4.72, lbl, col));
  s.addText("Full expanded deck  ·  5 tiers  ·  Worked examples  ·  Complete problem sets", {
    x:0.6, y:5.22, w:9, h:0.3, fontSize:9.5, color:C.textSub,
    fontFace:FONT_BODY, margin:0
  });
  slideFooter(s, `QM: Bra–Ket Notation — ${D.num}`, D.num);
}

// ── SLIDE 2: Overview ─────────────────────────────────────────────────────────
function slideOverview(pres, D, accent) {
  const s = addSlide(pres);
  slideHeader(s, `${D.num} — Lecture Overview`, D.title, D.num, accent);
  const pacingBody = (D.pacing||[]).join("\n");
  accentCard(s, { x:0.3, y:0.92, w:4.6, h:3.0, accent:C.accent3,
    title:"90-MIN PACING", body:pacingBody, titleSz:10, bodySz:9.5 });
  const outBody = (D.outcomes||[]).map(o=>`• ${o}`).join("\n");
  accentCard(s, { x:5.15, y:0.92, w:7.85, h:3.0, accent,
    title:"CORE LEARNING OUTCOMES", body:outBody, titleSz:10, bodySz:10 });
  TIER_ORDER.forEach((tier,i) => {
    const col = TIER_COLOR[tier];
    const txt = trunc2((D.levels||{})[tier]||"", 95);
    accentCard(s, { x:0.3+i*2.54, y:4.07, w:2.46, h:1.68,
      accent:col, title:tier, body:txt, titleSz:10, bodySz:9 });
  });
  const asBody = `Set A: ${((D.set_a||[]).slice(0,2).join(" · "))}\n`+
                 `Set B: ${((D.set_b||[]).slice(0,2).join(" · "))}`;
  accentCard(s, { x:0.3, y:5.9, w:12.7, h:1.28, accent:C.accent4,
    title:"ASSESSMENT BUNDLE", body:asBody, titleSz:10, bodySz:9 });
  slideFooter(s, `QM: ${D.num}`, `${D.num} · Overview`);
}

// ── SLIDES 3-4: Tracks ────────────────────────────────────────────────────────
function slideTracks(pres, D, accent) {
  // Slide 3 — Sakurai track
  {
    const s = addSlide(pres);
    slideHeader(s, `${D.num} — Sakurai Track`, "Measurement-first, operational approach", D.num, C.accent3);
    // Build Sakurai content from outcomes / pitfalls
    const sakBody = [
      "• Preparation: a reproducible laboratory protocol defines a quantum state",
      "• Measurement outcomes aᵢ occur with stable, reproducible frequencies",
      "• Why amplitudes? Interference demands combining paths before squaring:",
      "   P = |A₁ + A₂|² = |A₁|² + |A₂|² + 2Re(A₁*A₂)  [cross term = interference]",
      "• Operational Born rule: P(aᵢ) = |⟨aᵢ|ψ⟩|²",
      "• Normalization: Σᵢ P(aᵢ) = 1  ⟹  ⟨ψ|ψ⟩ = 1",
      "• Global phase is unobservable: |e^{iθ}ψ⟩ gives identical P(aᵢ) for all bases",
    ].join("\n");
    const sakSpec = (D.rendered_specs || {})["sakurai_track"] || [];
    if (sakSpec.length > 0) {
      renderedCard(s, pres, sakSpec, {
        x:0.3, y:0.92, w:7.9, h:5.9, accent:C.accent3,
        title:"SAKURAI: PREPARATION → STATISTICS → AMPLITUDES", titleSz:11,
      });
    } else {
      accentCard(s, { x:0.3, y:0.92, w:7.9, h:5.9, accent:C.accent3,
        title:"SAKURAI: PREPARATION → STATISTICS → AMPLITUDES", body:sakBody,
        titleSz:11, bodySz:10.5 });
    }
    // Connection to Dirac
    const diracConn = [
      "• Preparation procedure  ↔  ket |ψ⟩ (ray in ℋ)",
      "• Measurement outcome aᵢ  ↔  basis ket |aᵢ⟩",
      "• Transition amplitude  ↔  inner product ⟨aᵢ|ψ⟩",
      "• Probability rule  ↔  |⟨aᵢ|ψ⟩|²",
      "• Total prob. = 1  ↔  ⟨ψ|ψ⟩ = 1",
      "• Interference  ↔  complex phase structure",
    ].join("\n");
    accentCard(s, { x:8.45, y:0.92, w:4.55, h:5.9, accent:C.accent2,
      title:"BRIDGE TO DIRAC", body:diracConn, titleSz:11, bodySz:10 });
    slideFooter(s, `QM: ${D.num}`, `${D.num} · Sakurai Track`);
  }
  // Slide 4 — Dirac track
  {
    const s = addSlide(pres);
    slideHeader(s, `${D.num} — Dirac Track`, "Abstract, representation-independent axioms", D.num, accent);
    const diracBody = [
      "POSTULATE 1: STATE SPACE",
      "  Every physical state corresponds to a ray in a complex Hilbert space ℋ",
      "  Ray: |ψ⟩ ~ c|ψ⟩ for any nonzero c ∈ ℂ  (global phase unobservable)",
      "",
      "POSTULATE 2: OBSERVABLES",
      "  Every physical observable corresponds to a Hermitian operator Â = Â† on ℋ",
      "",
      "POSTULATE 3: BASIS & COMPLETENESS",
      "  Choose orthonormal basis {|n⟩}:  ⟨m|n⟩ = δₘₙ  and  Σₙ |n⟩⟨n| = Î",
      "  Expansion:  |ψ⟩ = Σₙ cₙ|n⟩  where  cₙ = ⟨n|ψ⟩  (components ARE inner products)",
      "",
      "POSTULATE 4: MEASUREMENT",
      "  Probability of outcome a:  P(a) = |⟨a|ψ⟩|²",
      "  Post-measurement state:   |ψ⟩  →  |a⟩  (ideal projective measurement)",
      "",
      "POSTULATE 5: DYNAMICS",
      "  Time evolution:  |ψ(t)⟩ = Û(t)|ψ(0)⟩  where  Û(t) = e^{-iĤt/ℏ}  is unitary",
    ].join("\n");
    const diracSpec = (D.rendered_specs || {})["dirac_postulates"] || [];
    if (diracSpec.length > 0) {
      renderedCard(s, pres, diracSpec, {
        x:0.3, y:0.92, w:12.7, h:5.9, accent,
        title:"DIRAC: FIVE POSTULATES", titleSz:11,
      });
    } else {
      accentCard(s, { x:0.3, y:0.92, w:12.7, h:5.9, accent,
        title:"DIRAC: FIVE POSTULATES", body:diracBody, titleSz:11, bodySz:10 });
    }
    slideFooter(s, `QM: ${D.num}`, `${D.num} · Dirac Track`);
  }
}

// ── SLIDES 5-6: Formulas ──────────────────────────────────────────────────────
function slideFormulas(pres, D, accent, frmDir) {
  const entries = Object.entries(D.formulas||{});
  // split into two pages
  const pages = [ entries.slice(0, 6), entries.slice(6) ];
  pages.forEach((page, pi) => {
    if (!page.length) return;
    const s = addSlide(pres);
    const tag = pages[1].length ? `${pi===0?"1":"2"}/2` : "";
    slideHeader(s, `${D.num} — Key Formulas ${tag}`,
      "LaTeX-rendered formula reference", D.num, accent);
    const cols = Math.min(page.length, 3);
    const rows = Math.ceil(page.length / cols);
    const cw = (W-0.7)/cols, ch = (H-1.3)/rows;
    page.forEach(([name, expr], idx) => {
      const col = idx%cols, row = Math.floor(idx/cols);
      const cx = 0.35+col*cw, cy = 1.05+row*ch;
      accentCard(s, { x:cx, y:cy, w:cw-0.1, h:ch-0.1, accent,
        title:name.replace(/_/g," "), body:"", titleSz:9 });
      frmImg(s, frmDir, name, cx+0.12, cy+0.38, cw-0.28, ch-0.55);
    });
    slideFooter(s, `QM: ${D.num}`, `${D.num} · Formulas`);
  });
}

// ══════════════════════════════════════════════════════════════════════════════
// PER-TIER SLIDES  (7 slides per tier)
// ══════════════════════════════════════════════════════════════════════════════

function buildTier(pres, D, accent, frmDir, tierName, tierData) {
  const tc  = TIER_COLOR[tierName];
  const tl  = TIER_LABEL[tierName];
  const num = D.num;

  // ── TIER A: Intro ──────────────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: ${tl}`,
      "Tier introduction and learning context", num, tc);

    // Narrative card
    accentCard(s, { x:0.3, y:0.9, w:8.0, h:2.45, accent:tc,
      title:"WHAT THIS TIER COVERS",
      body: trunc(tierData.narrative||"", 400),
      titleSz:11, bodySz:10.5 });

    // Prerequisites + what it unlocks
    const prevTier = TIER_ORDER[TIER_ORDER.indexOf(tierName)-1];
    const nextTier = TIER_ORDER[TIER_ORDER.indexOf(tierName)+1];
    const prereqBody = prevTier
      ? `Builds on: ${TIER_LABEL[prevTier]}\n\nRequired background:\n${
          (D.levels||{})[prevTier]||"Foundations from the previous tier"}`
      : "Starting point: pre-university mathematics\n\nRequired: basic algebra and complex arithmetic";
    const unlockBody = nextTier
      ? `Unlocks access to: ${TIER_LABEL[nextTier]}\n\nThis tier equips you for:\n${
          (D.levels||{})[nextTier]||"More rigorous treatment"}`
      : "Frontier level: connects to active research\n\nThis tier equips you for:\nPrimary literature and open problems";

    accentCard(s, { x:8.5, y:0.9, w:4.5, h:2.45, accent:C.accent4,
      title:"PREREQUISITES", body:prereqBody, titleSz:11, bodySz:9.5 });

    accentCard(s, { x:0.3, y:3.5, w:6.0, h:3.28, accent:C.accent2,
      title:"WHAT THIS TIER UNLOCKS", body:unlockBody, titleSz:11, bodySz:10 });

    // Key message for this tier
    const keyMsg = (D.levels||{})[tierName]||"";
    accentCard(s, { x:6.6, y:3.5, w:6.4, h:3.28, accent:tc,
      title:"KEY MESSAGE FOR THIS TIER",
      body:trunc(keyMsg, 300), titleSz:11, bodySz:11 });

    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · Intro`);
  }

  // ── TIER B: Core Concepts ─────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: Core Concepts`,
      "Main ideas, key equations, and their meaning", num, tc);

    const coreSpec = (D.rendered_specs || {})["core_" + tierName] || [];
    if (coreSpec.length > 0) {
      renderedCard(s, pres, coreSpec, {
        x:0.3, y:0.9, w:12.7, h:5.9, accent:tc,
        title:"CORE CONCEPTS & KEY RESULTS", titleSz:11,
      });
    } else {
      const concepts = buildCoreConcepts(D, tierName, tierData);
      accentCard(s, { x:0.3, y:0.9, w:12.7, h:5.9, accent:tc,
        title:"CORE CONCEPTS & KEY RESULTS",
        body:concepts, titleSz:11, bodySz:10.5 });
    }

    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · Concepts`);
  }

  // ── TIER C: Worked Example 1 ──────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: Worked Example 1`,
      "Step-by-step solved example with commentary", num, tc);

    const ex1 = (tierData.problems_simple||[])[0];
    if (ex1) {
      buildExampleSlide(s, pres, ex1, tc, "EXAMPLE 1", num, tierName, true, D);
    } else {
      accentCard(s, { x:0.3, y:0.9, w:12.7, h:5.9, accent:tc,
        title:"WORKED EXAMPLE",
        body:"See problem set for detailed worked examples at this level.",
        titleSz:11, bodySz:10 });
    }
    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · Example 1`);
  }

  // ── TIER D: Worked Example 2 ──────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: Worked Example 2`,
      "Second example — deeper or alternative approach", num, tc);

    const ex2 = (tierData.problems_simple||[])[1]
             || (tierData.problems_advanced||[])[0];
    if (ex2) {
      buildExampleSlide(s, pres, ex2, tc, "EXAMPLE 2", num, tierName, true, D);
    } else {
      const ex1adv = (tierData.problems_advanced||[])[0];
      if (ex1adv) buildExampleSlide(s, pres, ex1adv, tc, "ADVANCED EXAMPLE", num, tierName, true, D);
    }
    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · Example 2`);
  }

  // ── TIER E: Concept Questions ──────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: Concept Questions`,
      "Think before computing — conceptual understanding checks", num, tc);

    const cqs = tierData.concept_questions||[];
    // Split into two columns
    const half = Math.ceil(cqs.length/2);
    const leftCQs  = cqs.slice(0, half);
    const rightCQs = cqs.slice(half);

    const cqBody = (qs) => qs.map((q,i) =>
      `${i+1}. ${trunc(q,200)}`).join("\n\n");

    accentCard(s, { x:0.3, y:0.9, w:6.2, h:5.9, accent:tc,
      title:"CONCEPT QUESTIONS",
      body: cqBody(leftCQs), titleSz:11, bodySz:10.5 });

    // Right side: guidance notes
    const guidanceBody = buildGuidanceNotes(D, tierName, cqs);
    accentCard(s, { x:6.75, y:0.9, w:6.25, h:5.9, accent:C.accent2,
      title: rightCQs.length ? "MORE QUESTIONS + GUIDANCE" : "DISCUSSION GUIDANCE",
      body: rightCQs.length
        ? cqBody(rightCQs) + "\n\n─────\n" + trunc(guidanceBody, 150)
        : guidanceBody,
      titleSz:11, bodySz:10 });

    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · Concept Qs`);
  }

  // ── TIER F: Problem Sets ───────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: Problem Sets`,
      "Simple problems (Set A) and advanced problems (Set B)", num, tc);

    const simpleProbs = tierData.problems_simple||[];
    const advProbs    = tierData.problems_advanced||[];

    // Set A — full statements + hints
    const setABody = simpleProbs.map((p, i) => {
      const hint = (p.hints||[])[0]||"";
      return `[${p.id}]  ${trunc(p.statement,140)}\n   Hint: ${trunc(hint,90)}`;
    }).join("\n\n");

    accentCard(s, { x:0.3, y:0.9, w:6.2, h:5.9, accent:C.accent3,
      title:`PROBLEM SET A — SIMPLE  (${simpleProbs.length} problems)`,
      body: setABody||"See homework sheet for problems at this level.",
      titleSz:11, bodySz:9.5 });

    // Set B — with advanced hints
    const setBBody = advProbs.map((p, i) => {
      const hint  = (p.hints||[])[0]||"";
      const ahint = (p.advanced_hints||[])[0]||"";
      return `[${p.id}]  ${trunc(p.statement,140)}\n   Hint: ${trunc(hint,80)}\n   Key idea: ${trunc(ahint,80)}`;
    }).join("\n\n");

    accentCard(s, { x:6.75, y:0.9, w:6.25, h:5.9, accent:accent,
      title:`PROBLEM SET B — ADVANCED  (${advProbs.length} problems)`,
      body: setBBody||"See homework sheet for advanced problems at this level.",
      titleSz:11, bodySz:9.5 });

    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · Problems`);
  }

  // ── TIER G: References ─────────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    slideHeader(s, `${num} — ${tierName}: References & Bibliography`,
      "Historical, educational, and research-level reading", num, tc);

    const histRefs = (tierData.refs_historical||[]).map(r =>
      `[${r.year}] ${r.authors}\n"${trunc(r.title,70)}"\n${trunc(r.venue,60)}\n↳ ${trunc(r.annotation,130)}`
    ).join("\n\n");

    const eduRefs = (tierData.refs_educational||[]).map(r =>
      `${r.authors} (${r.year})\n"${trunc(r.title,70)}"\n${trunc(r.venue,60)}\n↳ ${trunc(r.annotation,120)}`
    ).join("\n\n");

    const resRefs = (tierData.refs_research||[]).map(r =>
      `${r.authors} (${r.year})\n"${trunc(r.title,70)}"\n${trunc(r.venue,60)}\n↳ ${trunc(r.annotation,120)}`
    ).join("\n\n");

    accentCard(s, { x:0.3, y:0.9, w:4.05, h:5.9,
      accent:C.accent4,
      title:`HISTORICAL  (${(tierData.refs_historical||[]).length})`,
      body:histRefs||"No historical references listed.", titleSz:10.5, bodySz:8.5 });

    accentCard(s, { x:4.65, y:0.9, w:4.05, h:5.9,
      accent:C.accent3,
      title:`EDUCATIONAL  (${(tierData.refs_educational||[]).length})`,
      body:eduRefs||"No educational references listed.", titleSz:10.5, bodySz:8.5 });

    accentCard(s, { x:9.25, y:0.9, w:3.75, h:5.9,
      accent:C.accent1,
      title:`RESEARCH  (${(tierData.refs_research||[]).length})`,
      body:resRefs||"No research references listed.", titleSz:10.5, bodySz:8.5 });

    slideFooter(s, `QM: ${num} · ${tierName}`, `${num} · ${tierName} · References`);
  }
}

// ── Build worked-example slide content ────────────────────────────────────────
function buildExampleSlide(s, pres, ex, tc, label, num, tierName, showSolution, D) {
  // Left: problem + hints
  const problemBody = [
    trunc(ex.statement, 350),
    "",
    "HINTS:",
    ...(ex.hints||[]).map(h => `• ${trunc(h,120)}`),
    "",
    "ADVANCED HINTS:",
    ...(ex.advanced_hints||[]).map(h => `• ${trunc(h,120)}`),
  ].join("\n");

  // Build spec for problem side
  const exId  = ex.id || "?";
  const specKey  = "prob_" + exId + "_full";
  const probSpec = ((D || {}).rendered_specs || {})[specKey] || [];
  if (probSpec.length > 0) {
    renderedCard(s, pres, probSpec, {
      x:0.3, y:0.9, w:5.9, h:5.9, accent:tc,
      title:`${label}: ${exId}`, titleSz:11,
    });
  } else {
    accentCard(s, { x:0.3, y:0.9, w:5.9, h:5.9, accent:tc,
      title:`${label}: ${exId}`, body:problemBody, titleSz:11, bodySz:10 });
  }
  // Solution side
  const solKey  = "prob_" + exId + "_sol";
  const solSpec = ((D || {}).rendered_specs || {})[solKey] || [];
  if (solSpec.length > 0) {
    renderedCard(s, pres, solSpec, {
      x:6.45, y:0.9, w:6.55, h:5.9, accent:C.accent2,
      title:"WORKED SOLUTION", titleSz:11,
    });
  } else {
    const solBody = showSolution && ex.solution
      ? "FULL SOLUTION:\n\n" + trunc(ex.solution, 600)
      : "See the Solutions Sheet for the full worked answer.";
    accentCard(s, { x:6.45, y:0.9, w:6.55, h:5.9, accent:C.accent2,
      title:"WORKED SOLUTION", body:solBody, titleSz:11, bodySz:10 });
  }
}

// ── Build core-concepts body text from tier context ───────────────────────────
function buildCoreConcepts(D, tierName, tierData) {
  // Extract key ideas from narrative + problems
  const narrative = tierData.narrative||"";

  const tierSpecific = {
    HS: [
      "COMPLEX NUMBERS AS ARROWS",
      "  A complex number z = a + ib is a 2D vector (a,b) in the complex plane",
      "  Polar form: z = r·e^{iθ}  where r = |z| = √(a²+b²) is the magnitude",
      "  Key rule: |z|² = z*z = a² + b²  — always real, always ≥ 0",
      "",
      "AMPLITUDE → PROBABILITY (Born rule at HS level)",
      "  You compute a complex amplitude A",
      "  The probability is P = |A|² = A*A",
      "  Why square? Need a non-negative real number; |A|² is always ≥ 0",
      "",
      "SUPERPOSITION = ARROW ADDITION → INTERFERENCE",
      "  Two paths give amplitudes A₁ and A₂",
      "  Total amplitude: A = A₁ + A₂",
      "  Total probability: P = |A₁ + A₂|² = |A₁|² + |A₂|² + 2Re(A₁*A₂)",
      "  The last term is the INTERFERENCE TERM — positive (constructive) or negative (destructive)",
      "  Phase difference φ = arg(A₂) - arg(A₁) controls the sign",
      "  φ = 0: maximum (arrows align)   φ = π: minimum (arrows cancel)",
    ].join("\n"),
    BegUG: [
      "HILBERT SPACE FORMALISM (discrete basis)",
      "  State vector: |ψ⟩ lives in complex vector space ℋ with inner product",
      "  Orthonormal basis {|n⟩}: ⟨m|n⟩ = δₘₙ (orthogonal + unit length)",
      "  Completeness: Σₙ |n⟩⟨n| = Î (every state can be expanded)",
      "",
      "EXPANSION AND COMPONENTS",
      "  |ψ⟩ = Σₙ cₙ|n⟩  where cₙ ∈ ℂ are probability amplitudes",
      "  KEY: cₙ = ⟨n|ψ⟩  — components ARE inner products",
      "  Proof: ⟨m|ψ⟩ = Σₙ cₙ⟨m|n⟩ = Σₙ cₙδₘₙ = cₘ  ✓",
      "",
      "NORMALIZATION AND PROBABILITIES",
      "  Require: ⟨ψ|ψ⟩ = Σₙ|cₙ|² = 1  (total probability = 1)",
      "  Born rule: P(n) = |cₙ|² = |⟨n|ψ⟩|²",
      "  BRA: ⟨ψ| = Σₙ cₙ*⟨n|  — NOTE the complex conjugate!",
      "",
      "GLOBAL PHASE INVARIANCE",
      "  |ψ'⟩ = e^{iθ}|ψ⟩ ⟹ P'(n) = |⟨n|e^{iθ}ψ⟩|² = |⟨n|ψ⟩|² = P(n)",
      "  Physical states are RAYS — the global phase carries no information",
    ].join("\n"),
    AdvUG: [
      "INNER PRODUCT SPACE GEOMETRY",
      "  Norm: ‖ψ‖ = √⟨ψ|ψ⟩  (satisfies all three norm axioms)",
      "  CAUCHY–SCHWARZ: |⟨φ|ψ⟩|² ≤ ⟨φ|φ⟩⟨ψ|ψ⟩",
      "    Proof: f(λ) = ‖|φ⟩ - λ|ψ⟩‖² ≥ 0 for all λ ∈ ℂ",
      "    Choose λ = ⟨ψ|φ⟩/‖ψ‖²  → minimise → get bound",
      "  TRIANGLE INEQUALITY: ‖φ+ψ‖ ≤ ‖φ‖ + ‖ψ‖",
      "    Proof: square both sides, apply C–S to cross term",
      "",
      "PHYSICAL MEANING OF C–S",
      "  For normalised states: |⟨φ|ψ⟩|² ≤ 1  — transition probs bounded",
      "  |⟨φ|ψ⟩| = cos θ where θ is the 'angle' between states",
      "  C–S equality iff |φ⟩ ∝ |ψ⟩  — same ray, P = 1",
      "",
      "PHASE-INVARIANT DISTANCE",
      "  d(φ,ψ) = ‖φ-ψ‖ is NOT physically meaningful (phase-dependent)",
      "  Correct: d(φ,ψ) = min_θ ‖|φ⟩ - e^{iθ}|ψ⟩‖ = √(2(1-|⟨φ|ψ⟩|))",
      "  Fubini–Study: d_FS = arccos(|⟨φ|ψ⟩|)  — the natural metric on rays",
      "",
      "UNITARY MAPS PRESERVE GEOMETRY",
      "  Û†Û = Î ⟹ ⟨Ûφ|Ûψ⟩ = ⟨φ|Û†Û|ψ⟩ = ⟨φ|ψ⟩  — all distances preserved",
    ].join("\n"),
    MSc: [
      "PROJECTIVE HILBERT SPACE",
      "  Physical state space is NOT ℋ but ℙ(ℋ) = (ℋ\\{0})/∼",
      "  where |ψ⟩ ∼ c|ψ⟩ for any nonzero c ∈ ℂ",
      "  A ray [ψ] is an equivalence class of vectors — a point in ℙ(ℋ)",
      "  dim_ℝ ℙ(ℂⁿ) = 2n-2  (for finite-dimensional ℋ = ℂⁿ)",
      "",
      "PHYSICALLY INVARIANT QUANTITIES",
      "  Transition probability: |⟨φ|ψ⟩|² — invariant under |φ⟩→e^{iα}|φ⟩",
      "  Fubini–Study: d_FS([φ],[ψ]) = arccos(|⟨φ|ψ⟩|)",
      "    This is the Riemannian metric on ℙ(ℋ)",
      "    Geodesic distance = arc of great circle on the Bloch sphere (n=2)",
      "",
      "WIGNER'S THEOREM",
      "  Any bijection T: ℙ(ℋ) → ℙ(ℋ) preserving |⟨φ|ψ⟩|²",
      "  is implemented by a UNITARY or ANTIUNITARY operator on ℋ",
      "  Implication: all quantum symmetries are (anti)unitary  — not a choice!",
      "  Antiunitary arises for: time reversal, complex conjugation",
      "",
      "WHY THIS MATTERS",
      "  Symmetry group G acts on ℙ(ℋ) → projective representation of G",
      "  Wigner: must lift to unitary/antiunitary rep of central extension of G",
      "  This is the origin of spin, and of superselection sectors",
    ].join("\n"),
    PhD: [
      "HILBERT SPACE — PRECISE DEFINITION",
      "  A Hilbert space ℋ is a complex vector space with an inner product ⟨·|·⟩",
      "  such that the induced norm ‖ψ‖ = √⟨ψ|ψ⟩ makes ℋ COMPLETE (Banach space)",
      "  Completeness: every Cauchy sequence converges in ℋ",
      "  Essential for: spectral theorem, Fourier expansions, function spaces",
      "",
      "SEPARABILITY",
      "  ℋ is separable ⟺ it has a countable dense subset",
      "  Equivalently (for Hilbert spaces): countable orthonormal basis {eₙ}",
      "  All standard QM Hilbert spaces are separable: L²(ℝⁿ), ℂⁿ, Fock spaces",
      "  Non-separable: some QFT constructions — not needed for NRQM",
      "",
      "RAYS AND PROJECTIVE SPACE (rigorous)",
      "  Ray = one-dimensional complex subspace of ℋ  (not just {e^{iθ}|ψ⟩})",
      "  ℙ(ℋ) is a Kähler manifold with Fubini–Study metric",
      "  For ℋ = ℂ²: ℙ(ℂ²) ≅ S² (Bloch sphere) as a Riemannian manifold",
      "",
      "UNBOUNDED OPERATORS — DOMAIN SUBTLETY",
      "  Hermitian ≠ self-adjoint for unbounded operators (positions, momenta)",
      "  Hermitian: ⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩  for all φ,ψ ∈ 𝒟(Â)  (symmetric)",
      "  Self-adjoint: additionally 𝒟(Â) = 𝒟(Â†)  (domain equality)",
      "  Spectral theorem, Stone's theorem REQUIRE self-adjointness",
      "  Deficiency indices (n₊,n₋): count self-adjoint extensions",
      "  Example: p̂ = -iℏd/dx on [0,1] — Hermitian but not SA; SA extensions = U(1)",
    ].join("\n"),
  };

  return (tierSpecific[tierName]||narrative).slice(0, 1200);
}

// ── Build guidance notes for concept questions ────────────────────────────────
function buildGuidanceNotes(D, tierName, cqs) {
  const guidanceMap = {
    HS: "These questions have no calculation — think about what probability MEANS.\n\nKey insight: squaring is the minimal operation that gives a non-negative real from a complex number.\n\nFor the interference question: draw the arrows on the complex plane and see when they cancel.",
    BegUG: "Work from the definition: write out the expansion, act with ⟨m| on the left, use δₘₙ.\n\nFor normalization: total probability must equal 1 — that is the only constraint.\n\nFor basis choice: different measurements correspond to different orthonormal bases.",
    AdvUG: "For C–S: the proof idea is to consider ‖|φ⟩ - λ|ψ⟩‖² ≥ 0 and choose the minimising λ.\n\nFor the geometry questions: draw a unit circle in ℂ²; overlap |⟨φ|ψ⟩| is the cosine of the angle between rays.\n\nFor distance: the physically correct distance must be invariant under global phase changes.",
    MSc: "For projective space: think of it as points on a sphere (for 2D), or more generally a complex manifold.\n\nFor Wigner: the key word is 'preserves transition probabilities' — this is a very strong constraint.\n\nFor Fubini–Study: verify the triangle inequality and check it reduces to arccos for real unit vectors.",
    PhD: "For completeness: construct Cauchy sequences that don't converge to a square-integrable function in a non-complete space.\n\nFor separability: construct the countable ONB via Gram–Schmidt on the rational-linear span.\n\nFor domain subtlety: compute the adjoint of p̂ on [0,∞) — the domain of p̂† is strictly larger than that of p̂.",
  };
  return guidanceMap[tierName]||"Think carefully about what the notation means.\n\nWork from the definition and verify your answer is consistent with the physical interpretation.";
}

// ── Pitfalls slide ─────────────────────────────────────────────────────────────
function slidePitfalls(pres, D, accent) {
  const s = addSlide(pres);
  slideHeader(s, `${D.num} — Common Pitfalls & Misconceptions`,
    "Consolidated pitfalls across all tiers", D.num, C.accent4);

  const pitfalls = D.pitfalls||[];
  const half = Math.ceil(pitfalls.length / 2);
  const pitLeft  = pitfalls.slice(0, half).map(p=>`• ${p}`).join("\n");
  const pitRight = pitfalls.slice(half).map(p=>`• ${p}`).join("\n");

  accentCard(s, { x:0.3, y:0.9, w:6.2, h:3.1, accent:C.accent4,
    title:"⚠  PITFALLS (A)", body:pitLeft, titleSz:11, bodySz:10.5 });
  accentCard(s, { x:6.75, y:0.9, w:6.25, h:3.1, accent:C.accent4,
    title:"⚠  PITFALLS (B)", body:pitRight||"See pitfalls (A)", titleSz:11, bodySz:10.5 });

  // Historical anchors
  const histBody = (D.history||[]).map(h=>`• ${h}`).join("\n");
  accentCard(s, { x:0.3, y:4.15, w:6.2, h:2.65, accent:"F472B6",
    title:"HISTORICAL ANCHORS", body:histBody, titleSz:11, bodySz:10.5 });

  // Key formulas reminder
  const fmls = Object.keys(D.formulas||{}).slice(0,6).join("  ·  ");
  accentCard(s, { x:6.75, y:4.15, w:6.25, h:2.65, accent:accent,
    title:"FORMULA QUICK REFERENCE",
    body:`Key formulas in this lecture:\n${fmls}\n\nSee formula slides for full LaTeX-rendered versions.`,
    titleSz:11, bodySz:10.5 });

  slideFooter(s, `QM: ${D.num}`, `${D.num} · Pitfalls`);
}

// ── Homework summary slide ────────────────────────────────────────────────────
function slideHomework(pres, D, accent) {
  const s = addSlide(pres);
  slideHeader(s, `${D.num} — Homework & Project Summary`,
    "Assessment overview across all tiers", D.num, C.accent3);

  // Tier summary table
  TIER_ORDER.forEach((tier,i) => {
    const td  = (D.tiers||{})[tier]||{};
    const tc  = TIER_COLOR[tier];
    const ns  = (td.problems_simple||[]).length;
    const na  = (td.problems_advanced||[]).length;
    const ps  = td.project_simple;
    const pa  = td.project_advanced;
    const rs  = td.research_simple;
    const ro  = td.research_open;
    const body = [
      `Problems: ${ns} simple + ${na} advanced`,
      ps ? `Project (simple, ~${ps.estimated_hours}h): ${trunc(ps.title,50)}` : "",
      pa ? `Project (advanced, ~${pa.estimated_hours}h): ${trunc(pa.title,50)}` : "",
      rs ? `Research (defined): ${trunc(rs.question,80)}` : "",
      ro ? `Research (open): ${trunc(ro.question,80)}` : "",
    ].filter(Boolean).join("\n");
    accentCard(s, { x:0.3+i*2.54, y:0.9, w:2.46, h:4.0,
      accent:tc, title:tier, body, titleSz:10, bodySz:9 });
  });

  // Homework assignment strip
  const hwBody = [
    "REQUIRED (all students): Problems from your track's Set A",
    "HONOURS (optional): Set B problems from your track",
    "PROJECT: Choose simple OR advanced track from your tier",
    "RESEARCH: At least one well-defined question; open questions for MSc/PhD",
  ].join("\n");
  accentCard(s, { x:0.3, y:5.05, w:12.7, h:2.23, accent:C.accent3,
    title:"HOMEWORK ASSIGNMENT", body:hwBody, titleSz:11, bodySz:10.5 });

  slideFooter(s, `QM: ${D.num}`, `${D.num} · Homework`);
}

// ══════════════════════════════════════════════════════════════════════════════
// MAIN BUILD
// ══════════════════════════════════════════════════════════════════════════════
async function buildFull(data, outPath, frmDir) {
  const D      = data;
  const idx    = parseInt((D.num||"L01").replace("L",""), 10) - 1;
  const accent = lectureAccent(idx);
  const pres   = initPres(`QM ${D.num} (full): ${D.title}`);

  // ── Fixed opening slides ────────────────────────────────────────────────────
  slideCover(pres, D, accent);
  slideOverview(pres, D, accent);
  slideTracks(pres, D, accent);
  slideFormulas(pres, D, accent, frmDir);

  // ── Per-tier block (7 slides each × 5 tiers = 35 slides) ───────────────────
  for (const tier of TIER_ORDER) {
    const td = (D.tiers||{})[tier];
    if (!td) continue;
    buildTier(pres, D, accent, frmDir, tier, td);
  }

  // ── Closing slides ──────────────────────────────────────────────────────────
  slidePitfalls(pres, D, accent);
  slideHomework(pres, D, accent);

  await pres.writeFile({ fileName: outPath });
  const slideCount = pres._slides ? pres._slides.length : "?";
  console.log(`✓ ${D.num} full deck (${slideCount} slides): ${outPath}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const args    = process.argv.slice(2);
  const get     = (flag) => { const i = args.indexOf(flag); return i>=0 ? args[i+1] : null; };
  const dataPath = get("--data");
  const outPath  = get("--out");
  const frmDir   = get("--formulas");

  if (!dataPath || !outPath) {
    console.error("Usage: node build_lecture_full.js --data <json> --out <pptx> [--formulas <dir>]");
    process.exit(1);
  }
  const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  buildFull(data, outPath, frmDir).catch(e => { console.error(e); process.exit(1); });
}

module.exports = buildFull;
