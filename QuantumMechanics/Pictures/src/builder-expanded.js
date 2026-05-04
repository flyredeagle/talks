/**
 * builder-expanded.js  — Universal expanded deck builder for L02–L10
 *
 * Uses diagram data from diagrams.js to produce 28-slide expanded decks
 * matching the structure of builder-L01.js exactly.
 */

"use strict";
const pptxgen = require("pptxgenjs");
const { C, FONT_HEAD, FONT_BODY, FONT_MONO, W, H, TIERS, makeHelpers } = require("./theme");
const { LECTURE_DIAGRAMS } = require("./diagrams");

// ─── Shared drawing primitives (same as diagrams.js) ─────────────────────────
function node(s, pres, x, y, w, h, text, bg, fg, fontSize=9, bold=false) {
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {
    x, y, w, h, rectRadius:0.07,
    fill:{color:bg}, line:{color:fg, width:1.2},
  });
  s.addText(text, {x,y,w,h, fontSize, fontFace:FONT_BODY, bold,
    color:fg, align:"center", valign:"middle", margin:0});
}
function vline(s, pres, x, y1, y2, color, dashed=false) {
  s.addShape(pres.shapes.LINE, {
    x, y:y1, w:0, h:y2-y1,
    line:{color, width:1.2, dashType:dashed?"dash":"solid"},
  });
}
function hline(s, pres, x1, y, x2, color, dashed=false) {
  s.addShape(pres.shapes.LINE, {
    x:x1, y, w:x2-x1, h:0,
    line:{color, width:1.2, dashType:dashed?"dash":"solid"},
  });
}
function box(s, pres, x, y, w, h, bg, border, width=1.5) {
  s.addShape(pres.shapes.RECTANGLE, {
    x,y,w,h, fill:{color:bg}, line:{color:border, width},
  });
}

// ─── Section header / footer ──────────────────────────────────────────────────
function diagHeader(s, pres, LCode, sectionTag, title, subtitle, tagColor) {
  s.addShape(pres.shapes.RECTANGLE, {x:0,y:0,w:W,h:0.48,
    fill:{color:"0D1B2E"}, line:{color:"0D1B2E"}});
  s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x:0.18,y:0.07,w:1.1,h:0.24,
    fill:{color:tagColor}, line:{color:tagColor}, rectRadius:0.06});
  s.addText(sectionTag, {x:0.18,y:0.07,w:1.1,h:0.24,
    fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
    align:"center", valign:"middle", margin:0});
  s.addText(title, {x:1.38,y:0.05,w:7.5,h:0.26,
    fontSize:14, fontFace:FONT_HEAD, bold:true, color:C.white, margin:0});
  if (subtitle) s.addText(subtitle, {x:1.38,y:0.3,w:7.5,h:0.15,
    fontSize:8, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0});
  s.addText(LCode, {x:9.4,y:0.07,w:0.5,h:0.3,
    fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.accent, align:"right", margin:0});
}
function diagFooter(s, LCode, sectionTag, idx) {
  s.addText(`QM: Module I.3 · ${LCode} · ${sectionTag} ${idx}`,
    {x:0.2,y:5.38,w:6,h:0.18, fontSize:7, fontFace:FONT_BODY, color:C.muted, margin:0});
}

// ─── MAIN BUILDER ─────────────────────────────────────────────────────────────
async function buildExpandedDeck(lec, outputPath) {
  const D = LECTURE_DIAGRAMS[lec.code];
  if (!D) throw new Error(`No diagram data for ${lec.code}`);

  const pres = new pptxgen();
  pres.layout  = "LAYOUT_16x9";
  pres.title   = `Module I.3 · ${lec.code} (Expanded) — ${lec.title}`;
  pres.author  = "QM Programme";
  pres.subject = "Quantum Dynamics";

  const { makeCard, addContentHeader, addFooter } = makeHelpers(pres);
  const LCode = lec.code;
  const footLeft = `QM: Module I.3 — ${lec.title}`;

  const TEXT_COL_X = 0.28, TEXT_COL_W = 5.0;
  const DIAG_COL_X = 5.45, DIAG_COL_W = 4.35;
  const CONTENT_TOP = 0.58, CONTENT_H = 4.62;

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 1 — TITLE
  // ════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = {color:C.bg};
    s.addShape(pres.shapes.OVAL, {x:7.0,y:-0.3,w:3.2,h:3.2,
      fill:{color:C.dimblue}, line:{color:C.dimblue}});
    s.addText("Ψ", {x:7.6,y:0.05,w:2.0,h:2.0,
      fontSize:80, fontFace:"Georgia", color:"1A3055",
      bold:true, align:"center", valign:"middle", margin:0});
    s.addText("QUANTUM MECHANICS — MODULE I.3 — QUANTUM DYNAMICS", {
      x:0.45,y:0.62,w:6.5,h:0.22, fontSize:7.5, fontFace:FONT_BODY, bold:true,
      color:C.muted, charSpacing:2, margin:0});
    s.addText(LCode, {x:0.45,y:0.88,w:1.0,h:0.32,
      fontSize:22, fontFace:FONT_HEAD, bold:true, color:C.accent, margin:0});
    s.addText(lec.title, {x:0.45,y:1.28,w:6.4,h:1.1,
      fontSize:28, fontFace:FONT_HEAD, bold:true, color:C.white, valign:"top", margin:0});
    s.addText(lec.subtitle, {x:0.45,y:2.45,w:6.4,h:0.3,
      fontSize:11, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0});
    s.addText(lec.track, {x:0.45,y:2.85,w:6.4,h:0.22,
      fontSize:9.5, fontFace:FONT_BODY, color:C.muted, margin:0});
    const badges=[
      {label:"HS",fg:C.hsCol,bg:C.hsBg},{label:"BegUG",fg:C.begCol,bg:C.begBg},
      {label:"AdvUG",fg:C.advCol,bg:C.advBg},{label:"MSc",fg:C.mscCol,bg:C.mscBg},
      {label:"PhD",fg:C.phdCol,bg:C.phdBg},
    ];
    let bx=0.45;
    for (const b of badges) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x:bx,y:3.22,w:0.72,h:0.24,
        fill:{color:b.bg}, line:{color:b.fg,width:1}, rectRadius:0.05});
      s.addText(b.label, {x:bx,y:3.22,w:0.72,h:0.24,
        fontSize:8.5, fontFace:FONT_BODY, bold:true, color:b.fg,
        align:"center", valign:"middle", margin:0});
      bx += 0.80;
    }
    s.addText("Full expanded deck  ·  5 tiers  ·  Worked examples  ·  Complete problem sets  ·  Diagram slides", {
      x:0.45,y:3.60,w:6.4,h:0.2, fontSize:8, fontFace:FONT_BODY, color:C.muted, margin:0});
    addFooter(s, `QM: ${LCode} — ${lec.title}`, LCode);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 2 — LECTURE OVERVIEW
  // ════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = {color:C.bg};
    addContentHeader(s, LCode, "Lecture Overview", lec.title);
    makeCard(s, {x:0.18,y:0.65,w:4.55,h:2.0, title:"90-MIN PACING",
      titleColor:C.teal, borderColor:C.teal, bgColor:"0D1E1D",
      body:lec.pacing, bodyFontSize:10.5});
    makeCard(s, {x:4.84,y:0.65,w:5.0,h:2.0, title:"CORE LEARNING OUTCOMES",
      titleColor:C.accent, borderColor:C.accent, bgColor:"0D1830",
      body:lec.outcomes.map(o=>"• "+o), bodyFontSize:10.5});
    const tierW=1.9, tierH=1.2, tierGap=0.02;
    let tx=0.18;
    for (const t of TIERS) {
      s.addShape(pres.shapes.RECTANGLE, {x:tx,y:2.76,w:tierW,h:tierH,
        fill:{color:t.bg}, line:{color:t.fg,width:1.5}});
      s.addText(t.label, {x:tx,y:2.78,w:tierW,h:0.2,
        fontSize:9, fontFace:FONT_HEAD, bold:true, color:t.fg, align:"center", margin:0});
      s.addText(lec.tiers[t.key], {x:tx+0.08,y:3.01,w:tierW-0.16,h:0.9,
        fontSize:9, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0});
      tx += tierW+tierGap;
    }
    makeCard(s, {x:0.18,y:4.04,w:9.66,h:0.78, title:"ASSESSMENT BUNDLE",
      titleColor:C.gold, borderColor:C.gold, bgColor:"201700",
      body:[`Set A: ${lec.assessment.setA}`, `Set B: ${lec.assessment.setB}`],
      bodyFontSize:10});
    addFooter(s, `QM: ${LCode}`, `${LCode} · Overview`);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDES 3–6 — LEARNING OBJECTIVE SLIDES
  // ════════════════════════════════════════════════════════════════════════
  for (const lo of D.loData) {
    const s = pres.addSlide();
    s.background = {color:C.bg};
    diagHeader(s, pres, LCode, `LO ${lo.n}`, lo.title,
      "Learning Objective — "+lo.goal, lo.tagBg);

    // Left text panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X, y:CONTENT_TOP, w:TEXT_COL_W, h:CONTENT_H,
      fill:{color:"0D1A2A"}, line:{color:lo.color, width:1.5},
    });
    s.addText("OBJECTIVE", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.1,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:lo.color, charSpacing:1, margin:0});
    s.addText(lo.goal, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.32,w:TEXT_COL_W-0.24,h:0.3,
      fontSize:10.5, fontFace:FONT_BODY, color:C.white, italic:true, margin:0});
    s.addShape(pres.shapes.LINE, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.68,w:TEXT_COL_W-0.24,h:0,
      line:{color:lo.color, width:0.8, transparency:60}});
    s.addText("KEY POINTS", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.76,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:lo.color, charSpacing:1, margin:0});
    const ptItems = lo.keyPoints.map((p,i) => ({
      text:`${i+1}.  ${p}`,
      options:{color:C.offwhite, fontSize:10.5, breakLine:true, paraSpaceAfter:7},
    }));
    s.addText(ptItems, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.0,w:TEXT_COL_W-0.24,h:3.4,
      valign:"top", fontFace:FONT_BODY, margin:0});

    // Right diagram panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X, y:CONTENT_TOP, w:DIAG_COL_W, h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:lo.color, width:1.5},
    });
    s.addText("DIAGRAM", {x:DIAG_COL_X+0.12,y:CONTENT_TOP+0.08,w:DIAG_COL_W-0.24,h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:lo.color, charSpacing:1, margin:0});
    lo.drawDiag(s, pres, DIAG_COL_X+0.2, CONTENT_TOP+0.38);
    s.addText(lo.diagLabel, {
      x:DIAG_COL_X+0.1, y:CONTENT_TOP+CONTENT_H-0.34, w:DIAG_COL_W-0.2, h:0.28,
      fontSize:7.5, fontFace:FONT_BODY, color:C.muted, italic:true, align:"center", margin:0});

    diagFooter(s, LCode, "Learning Objective", lo.n);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDES 7–12 — KEY FORMULA SLIDES
  // ════════════════════════════════════════════════════════════════════════
  for (let fi = 0; fi < lec.keyFormulas.length; fi++) {
    const formula  = lec.keyFormulas[fi];
    const ans      = D.formulaAnswers[fi] || [formula, "See lecture notes.", []];
    const [flabel, explanation, checks] = ans;

    const idx      = formula.indexOf("  (");
    const fml      = idx >= 0 ? formula.slice(0, idx) : formula;
    const label    = idx >= 0 ? formula.slice(idx+2).replace(/^\(/,"").replace(/\)$/,"") : flabel;

    // Colour cycles through accent palette
    const fColors = [C.accent, C.teal, C.begCol, C.gold, C.mscCol, C.phdCol];
    const fc = fColors[fi % fColors.length];

    const s = pres.addSlide();
    s.background = {color:C.bg};
    diagHeader(s, pres, LCode, `F${fi+1}`, fml, label, fc);

    // Left
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X,y:CONTENT_TOP,w:TEXT_COL_W,h:CONTENT_H,
      fill:{color:"0D1A2A"}, line:{color:fc,width:1.5},
    });
    s.addText(fml, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.1,w:TEXT_COL_W-0.24,h:0.44,
      fontSize:16, fontFace:FONT_MONO, bold:true, color:fc, valign:"middle", margin:0});
    s.addText(label, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.55,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8.5, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0});
    s.addShape(pres.shapes.LINE, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.78,w:TEXT_COL_W-0.24,h:0,
      line:{color:fc,width:0.8,transparency:60}});
    s.addText("EXPLANATION", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.86,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:fc, charSpacing:1, margin:0});
    s.addText(explanation, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.08,w:TEXT_COL_W-0.24,h:1.2,
      fontSize:10, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0});
    s.addText("CHECKS / CONSEQUENCES", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+2.36,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:fc, charSpacing:1, margin:0});
    const chkItems = (checks||[]).map((c,i)=>({
      text:`${i+1}. ${c}`,
      options:{color:C.offwhite, fontSize:10, breakLine:true, paraSpaceAfter:5},
    }));
    s.addText(chkItems, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+2.58,w:TEXT_COL_W-0.24,h:1.8,
      valign:"top", fontFace:FONT_BODY, margin:0});

    // Right — generic formula diagram (dark box with formula + number badge)
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X,y:CONTENT_TOP,w:DIAG_COL_W,h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:fc,width:1.5},
    });
    s.addText("DIAGRAM", {x:DIAG_COL_X+0.12,y:CONTENT_TOP+0.08,w:DIAG_COL_W-0.24,h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:fc, charSpacing:1, margin:0});

    // Formula card visual in right panel
    const fx=DIAG_COL_X+0.3, fy=CONTENT_TOP+0.42;
    box(s,pres, fx,fy, DIAG_COL_W-0.6,1.0, "0D1A2A", fc, 2);
    s.addShape(pres.shapes.OVAL, {x:fx+0.1,y:fy+0.12,w:0.36,h:0.36,
      fill:{color:fc}, line:{color:fc}});
    s.addText(`F${fi+1}`, {x:fx+0.1,y:fy+0.12,w:0.36,h:0.36,
      fontSize:10, fontFace:FONT_HEAD, bold:true, color:C.bg,
      align:"center", valign:"middle", margin:0});
    s.addText(fml, {x:fx+0.54,y:fy+0.1,w:DIAG_COL_W-1.2,h:0.48,
      fontSize:14, fontFace:FONT_MONO, bold:true, color:C.white, valign:"middle", margin:0});
    if (label) s.addText(label, {x:fx+0.54,y:fy+0.6,w:DIAG_COL_W-1.2,h:0.28,
      fontSize:9, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0});

    // Explanation excerpt
    const exY = fy+1.1;
    box(s,pres, fx,exY, DIAG_COL_W-0.6,1.2, "0D1220",C.muted,0.8);
    s.addText("Physical interpretation:", {x:fx+0.1,y:exY+0.06,w:DIAG_COL_W-0.8,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.muted, margin:0});
    s.addText(explanation.slice(0,180)+(explanation.length>180?"...":""),
      {x:fx+0.1,y:exY+0.28,w:DIAG_COL_W-0.8,h:0.82,
      fontSize:8.5, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0});

    // Connections strip
    const connY = CONTENT_TOP+CONTENT_H-0.62;
    box(s,pres, DIAG_COL_X+0.1,connY, DIAG_COL_W-0.2,0.52, "1A0F2A",C.purple,1.2);
    s.addText([
      {text:"← Prev: ",options:{bold:true,color:C.purple,fontSize:8}},
      {text:lec.prev+"  ",options:{color:C.offwhite,fontSize:8}},
      {text:"→ Next: ",options:{bold:true,color:C.teal,fontSize:8}},
      {text:lec.next,options:{color:C.offwhite,fontSize:8}},
    ], {x:DIAG_COL_X+0.2,y:connY+0.08,w:DIAG_COL_W-0.4,h:0.36, fontFace:FONT_BODY, margin:0});

    diagFooter(s, LCode, "Formula", fi+1);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDES 13–20 — CONCEPT QUESTION SLIDES
  // ════════════════════════════════════════════════════════════════════════
  const cqColors = [C.accent,C.teal,C.begCol,C.gold,C.mscCol,C.phdCol,C.accent,C.teal];

  for (let qi = 0; qi < lec.concepts.length; qi++) {
    const q       = lec.concepts[qi];
    const pointer = D.cqPointers[qi] || "See lecture notes for key insight.";
    const qc      = cqColors[qi % cqColors.length];

    const s = pres.addSlide();
    s.background = {color:C.bg};
    diagHeader(s, pres, LCode, `CQ ${qi+1}`, q,
      "Concept Question — think before computing", qc);

    // Left — answer panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X,y:CONTENT_TOP,w:TEXT_COL_W,h:CONTENT_H,
      fill:{color:"0D1A2A"}, line:{color:qc,width:1.5},
    });
    s.addText("QUESTION", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.08,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:qc, charSpacing:1, margin:0});
    s.addText(q, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.3,w:TEXT_COL_W-0.24,h:0.6,
      fontSize:10.5, fontFace:FONT_BODY, color:C.white, italic:true, margin:0});
    s.addShape(pres.shapes.LINE, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.95,w:TEXT_COL_W-0.24,h:0,
      line:{color:qc,width:0.8,transparency:60}});
    s.addText("KEY INSIGHT / MODEL ANSWER", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.02,
      w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:qc, charSpacing:1, margin:0});
    s.addText(pointer, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.24,w:TEXT_COL_W-0.24,h:2.0,
      fontSize:10.5, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0});
    s.addShape(pres.shapes.LINE, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+3.3,w:TEXT_COL_W-0.24,h:0,
      line:{color:C.phdCol,width:0.8,transparency:60}});
    s.addText("⚠  COMMON PITFALL", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+3.38,
      w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.phdCol, charSpacing:1, margin:0});
    // Generate a brief pitfall from the pointer (last sentence or a short note)
    const pitfall = pointer.length > 100
      ? `Avoid: ${pointer.split(";")[pointer.split(";").length-1].trim()}`
      : "Check all conditions carefully before applying this result.";
    s.addText(pitfall, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+3.60,w:TEXT_COL_W-0.24,h:0.8,
      fontSize:9.5, fontFace:FONT_BODY, color:C.phdCol, valign:"top", margin:0});

    // Right — diagram panel with numbered question visual
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X,y:CONTENT_TOP,w:DIAG_COL_W,h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:qc,width:1.5},
    });
    s.addText("DIAGRAM", {x:DIAG_COL_X+0.12,y:CONTENT_TOP+0.08,w:DIAG_COL_W-0.24,h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:qc, charSpacing:1, margin:0});

    // Question number badge
    s.addShape(pres.shapes.OVAL, {x:DIAG_COL_X+0.15,y:CONTENT_TOP+0.38,w:0.6,h:0.6,
      fill:{color:qc}, line:{color:qc}});
    s.addText(`CQ\n${qi+1}`, {x:DIAG_COL_X+0.15,y:CONTENT_TOP+0.38,w:0.6,h:0.6,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.bg,
      align:"center", valign:"middle", margin:0});

    // Question text in right panel
    box(s,pres, DIAG_COL_X+0.9,CONTENT_TOP+0.38, DIAG_COL_W-1.05,0.72, qc+"22",qc,1.5);
    s.addText(q, {x:DIAG_COL_X+1.0,y:CONTENT_TOP+0.42,w:DIAG_COL_W-1.2,h:0.64,
      fontSize:9.5, fontFace:FONT_BODY, color:C.white, valign:"top", margin:0});

    // Key insight visual box
    const ky=CONTENT_TOP+1.26;
    box(s,pres, DIAG_COL_X+0.15,ky, DIAG_COL_W-0.3,1.5,"0D1A2A",qc,1.5);
    s.addText("KEY INSIGHT", {x:DIAG_COL_X+0.25,y:ky+0.08,w:DIAG_COL_W-0.5,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:qc, charSpacing:1, margin:0});
    s.addText(pointer.slice(0,200)+(pointer.length>200?"...":""),
      {x:DIAG_COL_X+0.25,y:ky+0.3,w:DIAG_COL_W-0.5,h:1.1,
      fontSize:9, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0});

    // Tier hint strip
    const ty=CONTENT_TOP+CONTENT_H-0.56;
    const tierColors=[C.hsCol,C.begCol,C.advCol,C.mscCol,C.phdCol];
    const tierKeys=["hs","begug","advug","msc","phd"];
    const tw=(DIAG_COL_W-0.3)/5;
    for (let ti=0;ti<5;ti++){
      box(s,pres,DIAG_COL_X+0.15+ti*tw,ty,tw,0.44,tierColors[ti]+"28",tierColors[ti],0.8);
      s.addText(["HS","T2","T3","T4","T5"][ti], {
        x:DIAG_COL_X+0.15+ti*tw,y:ty,w:tw,h:0.44,
        fontSize:8.5, fontFace:FONT_HEAD, bold:true, color:tierColors[ti],
        align:"center", valign:"middle", margin:0});
    }

    diagFooter(s, LCode, "Concept Question", qi+1);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDES 21–25 — TIER DEEP-DIVE SLIDES
  // ════════════════════════════════════════════════════════════════════════
  const tierDeepDefs = [
    {key:"hs",    label:"Tier 1 — HS",    fg:C.hsCol,  bg:C.hsBg,  tasks:D.tierTasks.hs},
    {key:"begug", label:"Tier 2 — BegUG", fg:C.begCol, bg:C.begBg, tasks:D.tierTasks.begug},
    {key:"advug", label:"Tier 3 — AdvUG", fg:C.advCol, bg:C.advBg, tasks:D.tierTasks.advug},
    {key:"msc",   label:"Tier 4 — MSc",   fg:C.mscCol, bg:C.mscBg, tasks:D.tierTasks.msc},
    {key:"phd",   label:"Tier 5 — PhD",   fg:C.phdCol, bg:C.phdBg, tasks:D.tierTasks.phd},
  ];

  const focusByTier = {
    hs:    "Conceptual gateway — intuition, analogy, physical picture",
    begug: "Computational entry — apply formulas, verify properties numerically",
    advug: "Structural understanding — proofs, derivations, basis-independence",
    msc:   "Graduate depth — advanced formalism, information theory, open systems",
    phd:   "Research frontier — functional analysis, rigorous formulation, connections",
  };

  for (const td of tierDeepDefs) {
    const s = pres.addSlide();
    s.background = {color:C.bg};

    // Header
    s.addShape(pres.shapes.RECTANGLE, {x:0,y:0,w:W,h:0.48,
      fill:{color:"0D1B2E"}, line:{color:"0D1B2E"}});
    s.addShape(pres.shapes.ROUNDED_RECTANGLE, {x:0.18,y:0.07,w:1.55,h:0.24,
      fill:{color:td.fg}, line:{color:td.fg}, rectRadius:0.06});
    s.addText(td.label, {x:0.18,y:0.07,w:1.55,h:0.24,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
      align:"center", valign:"middle", margin:0});
    s.addText(`${LCode} — ${td.label} Deep Dive`, {x:1.83,y:0.05,w:7.1,h:0.26,
      fontSize:13, fontFace:FONT_HEAD, bold:true, color:C.white, margin:0});
    s.addText(focusByTier[td.key], {x:1.83,y:0.3,w:7.1,h:0.16,
      fontSize:7.5, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0});
    s.addText(LCode, {x:9.4,y:0.07,w:0.5,h:0.3,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:C.accent, align:"right", margin:0});

    // Left panel
    s.addShape(pres.shapes.RECTANGLE, {
      x:TEXT_COL_X,y:CONTENT_TOP,w:TEXT_COL_W,h:CONTENT_H,
      fill:{color:td.bg}, line:{color:td.fg,width:1.8},
    });
    s.addText("TIER SUMMARY", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.1,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:td.fg, charSpacing:1, margin:0});
    s.addText(lec.tiers[td.key], {x:TEXT_COL_X+0.12,y:CONTENT_TOP+0.33,w:TEXT_COL_W-0.24,h:0.7,
      fontSize:10, fontFace:FONT_BODY, color:C.white, italic:true, valign:"top", margin:0});
    s.addShape(pres.shapes.LINE, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.08,w:TEXT_COL_W-0.24,h:0,
      line:{color:td.fg,width:0.8,transparency:60}});
    s.addText("ACTIVITIES & TASKS", {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.15,w:TEXT_COL_W-0.24,h:0.2,
      fontSize:8, fontFace:FONT_HEAD, bold:true, color:td.fg, charSpacing:1, margin:0});
    const taskItems = (td.tasks||[]).map((t,i)=>({
      text:`${i+1}.  ${t}`,
      options:{color:C.offwhite, fontSize:10, breakLine:true, paraSpaceAfter:8},
    }));
    s.addText(taskItems, {x:TEXT_COL_X+0.12,y:CONTENT_TOP+1.38,w:TEXT_COL_W-0.24,h:3.0,
      valign:"top", fontFace:FONT_BODY, margin:0});

    // Right — diagram panel with tier-themed visual
    s.addShape(pres.shapes.RECTANGLE, {
      x:DIAG_COL_X,y:CONTENT_TOP,w:DIAG_COL_W,h:CONTENT_H,
      fill:{color:"080E16"}, line:{color:td.fg,width:1.5},
    });
    s.addText("DIAGRAM", {x:DIAG_COL_X+0.12,y:CONTENT_TOP+0.08,w:DIAG_COL_W-0.24,h:0.2,
      fontSize:7.5, fontFace:FONT_HEAD, bold:true, color:td.fg, charSpacing:1, margin:0});

    // Tier context visual: show all 5 tiers with this one highlighted
    const allTiers=[
      {k:"hs",l:"HS",fg:C.hsCol},
      {k:"begug",l:"BegUG",fg:C.begCol},
      {k:"advug",l:"AdvUG",fg:C.advCol},
      {k:"msc",l:"MSc",fg:C.mscCol},
      {k:"phd",l:"PhD",fg:C.phdCol},
    ];
    const tierRowH=0.72, tierStartY=CONTENT_TOP+0.38;
    for (let ti=0;ti<allTiers.length;ti++){
      const at=allTiers[ti];
      const isThis=at.k===td.key;
      const rowY=tierStartY+ti*tierRowH;
      box(s,pres, DIAG_COL_X+0.15,rowY, DIAG_COL_W-0.3,tierRowH-0.06,
        isThis?at.fg+"35":"0D1A2A", isThis?at.fg:C.muted, isThis?2:0.5);
      // Tier label
      box(s,pres, DIAG_COL_X+0.15,rowY, 0.7,tierRowH-0.06,
        isThis?at.fg:"0D1A2A", isThis?at.fg:C.muted);
      s.addText(at.l, {x:DIAG_COL_X+0.15,y:rowY,w:0.7,h:tierRowH-0.06,
        fontSize:8, fontFace:FONT_HEAD, bold:true, color:isThis?C.bg:C.muted,
        align:"center", valign:"middle", margin:0});
      // Content preview (truncated)
      const content = lec.tiers[at.k] || "";
      s.addText(content.slice(0,80)+(content.length>80?"...":""),
        {x:DIAG_COL_X+0.92,y:rowY+0.06,w:DIAG_COL_W-1.12,h:tierRowH-0.18,
        fontSize:isThis?8.5:7.5, fontFace:FONT_BODY, color:isThis?C.white:C.muted,
        valign:"middle", margin:0});
    }

    s.addText(`QM: Module I.3 · ${LCode} · ${td.label}`,
      {x:0.2,y:5.38,w:7,h:0.18, fontSize:7, fontFace:FONT_BODY, color:C.muted, margin:0});
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 26 — KEY FORMULAS SUMMARY
  // ════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = {color:C.bg};
    addContentHeader(s, LCode, "Key Formulas — Summary", "All six core results at a glance");
    const cardW=4.7,cardH=0.9,gapX=0.12,gapY=0.12,startX=0.18,startY=0.7;
    for (let i=0;i<lec.keyFormulas.length;i++) {
      const col=i%2,row=Math.floor(i/2);
      const x=startX+col*(cardW+gapX),y=startY+row*(cardH+gapY);
      const formula=lec.keyFormulas[i];
      const idx=formula.indexOf("  (");
      const label=idx>=0?formula.slice(idx+2).replace(/^\(/,"").replace(/\)$/,""):"";
      const fml=idx>=0?formula.slice(0,idx):formula;
      s.addShape(pres.shapes.RECTANGLE, {x,y,w:cardW,h:cardH,
        fill:{color:"0D1A2A"}, line:{color:C.accent,width:1.2}});
      s.addShape(pres.shapes.OVAL, {x:x+0.1,y:y+0.12,w:0.3,h:0.3,
        fill:{color:C.accent}, line:{color:C.accent}});
      s.addText(`${i+1}`, {x:x+0.1,y:y+0.12,w:0.3,h:0.3,
        fontSize:8.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
        align:"center", valign:"middle", margin:0});
      s.addText(fml, {x:x+0.48,y:y+0.1,w:cardW-0.6,h:0.48,
        fontSize:13, fontFace:FONT_MONO, color:C.white, valign:"middle", margin:0});
      if (label) s.addText(label, {x:x+0.48,y:y+0.57,w:cardW-0.6,h:0.25,
        fontSize:9, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0});
    }
    const connY=startY+3*(cardH+gapY)+0.05;
    makeCard(s, {x:0.18,y:connY,w:9.66,h:0.52, title:null,
      borderColor:C.purple, bgColor:"1A0F2A",
      body:[
        {text:"← Prev: ",options:{bold:true,color:C.purple,fontSize:9.5}},
        {text:lec.prev+"   ",options:{color:C.offwhite,fontSize:9.5}},
        {text:"→ Next: ",options:{bold:true,color:C.teal,fontSize:9.5}},
        {text:lec.next,options:{color:C.offwhite,fontSize:9.5}},
      ],
    });
    addFooter(s, footLeft, `${LCode} · Formulas`);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 27 — CONCEPT QUESTIONS SUMMARY
  // ════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = {color:C.bg};
    addContentHeader(s, LCode, "Concept Questions — Summary",
      "Think before computing — conceptual understanding checks");
    const qs=lec.concepts,half=Math.ceil(qs.length/2);
    s.addShape(pres.shapes.RECTANGLE, {x:0.18,y:0.65,w:4.7,h:4.7,
      fill:{color:"0D1A2A"}, line:{color:C.accent,width:1.5}});
    s.addText(`CONCEPT QUESTIONS (1–${half})`, {x:0.3,y:0.68,w:4.5,h:0.22,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.accent, margin:0});
    s.addText(qs.slice(0,half).map((q,i)=>({
      text:`${i+1}. ${q}`,options:{color:C.offwhite,fontSize:10.5,breakLine:true,paraSpaceAfter:6},
    })), {x:0.3,y:0.95,w:4.5,h:4.2, valign:"top", fontFace:FONT_BODY, margin:0});
    s.addShape(pres.shapes.RECTANGLE, {x:5.07,y:0.65,w:4.77,h:4.7,
      fill:{color:"0D1A2A"}, line:{color:C.teal,width:1.5}});
    s.addText(`CONCEPT QUESTIONS (${half+1}–${qs.length})`, {x:5.19,y:0.68,w:4.5,h:0.22,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.teal, margin:0});
    s.addText(qs.slice(half).map((q,i)=>({
      text:`${half+i+1}. ${q}`,options:{color:C.offwhite,fontSize:10.5,breakLine:true,paraSpaceAfter:6},
    })), {x:5.19,y:0.95,w:4.5,h:4.2, valign:"top", fontFace:FONT_BODY, margin:0});
    addFooter(s, footLeft, `${LCode} · Concept Qs`);
  }

  // ════════════════════════════════════════════════════════════════════════
  // SLIDE 28 — FIVE-TIER PEDAGOGY + ASSESSMENT
  // ════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = {color:C.bg};
    addContentHeader(s, LCode, "Five-Tier Pedagogy",
      "Differentiated content for all levels — HS through PhD");
    const tH=0.82,tGap=0.04,startY=0.66;
    const tierRows=[
      {key:"hs",   label:"Tier 1 — HS",   fg:C.hsCol,  bg:C.hsBg},
      {key:"begug",label:"Tier 2 — BegUG",fg:C.begCol, bg:C.begBg},
      {key:"advug",label:"Tier 3 — AdvUG",fg:C.advCol, bg:C.advBg},
      {key:"msc",  label:"Tier 4 — MSc",  fg:C.mscCol, bg:C.mscBg},
      {key:"phd",  label:"Tier 5 — PhD",  fg:C.phdCol, bg:C.phdBg},
    ];
    for (let i=0;i<tierRows.length;i++){
      const t=tierRows[i],y=startY+i*(tH+tGap);
      s.addShape(pres.shapes.RECTANGLE, {x:0.18,y,w:9.66,h:tH,
        fill:{color:t.bg}, line:{color:t.fg,width:1.5}});
      s.addShape(pres.shapes.RECTANGLE, {x:0.18,y,w:1.5,h:tH,
        fill:{color:t.fg}, line:{color:t.fg}});
      s.addText(t.label, {x:0.18,y,w:1.5,h:tH,
        fontSize:9.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
        align:"center", valign:"middle", margin:0});
      s.addText(lec.tiers[t.key], {x:1.78,y:y+0.08,w:8.0,h:tH-0.16,
        fontSize:11, fontFace:FONT_BODY, color:C.offwhite, valign:"middle", margin:0});
    }
    const connY=startY+5*(tH+tGap)+0.02;
    makeCard(s, {x:0.18,y:connY,w:9.66,h:0.55, title:null,
      borderColor:C.gold, bgColor:"201700",
      body:[
        {text:"Assessment Set A: ",options:{bold:true,color:C.gold,fontSize:9.5}},
        {text:lec.assessment.setA+"  |  ",options:{color:C.offwhite,fontSize:9.5}},
        {text:"Set B: ",options:{bold:true,color:C.gold,fontSize:9.5}},
        {text:lec.assessment.setB,options:{color:C.offwhite,fontSize:9.5}},
      ],
    });
    addFooter(s, footLeft, `${LCode} · Tier Pedagogy`);
  }

  await pres.writeFile({fileName: outputPath});
}

module.exports = { buildExpandedDeck };
