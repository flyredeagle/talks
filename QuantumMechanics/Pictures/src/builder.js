/**
 * builder.js — Shared slide-building logic
 * QM Programme · Module I.3 slide deck generator
 *
 * Exports:  buildDeck(lec, outputPath)
 * Requires: pptxgenjs, theme.js
 */

const pptxgen  = require("pptxgenjs");
const { C, FONT_HEAD, FONT_BODY, FONT_MONO, W, H, TIERS, makeHelpers } = require("./theme");

/**
 * Builds a 5-slide PPTX for one lecture and writes it to outputPath.
 * @param {Object} lec      - lecture data object from lectures.js
 * @param {string} outputPath - absolute file path for the .pptx output
 * @returns {Promise<void>}
 */
async function buildDeck(lec, outputPath) {
  const pres = new pptxgen();
  pres.layout  = "LAYOUT_16x9";
  pres.title   = `Module I.3 · ${lec.code} — ${lec.title}`;
  pres.author  = "QM Programme";
  pres.subject = "Quantum Dynamics, Perturbation Theory, and Physical Systems";

  const { makeCard, addContentHeader, addFooter } = makeHelpers(pres);
  const footLeft = `QM: Module I.3 — ${lec.title}`;
  const LCode    = lec.code;

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 1 — TITLE
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };

    // Decorative Ψ circle (right side)
    s.addShape(pres.shapes.OVAL, { x:7.0, y:-0.3, w:3.2, h:3.2,
      fill:{color:C.dimblue}, line:{color:C.dimblue} });
    s.addText("Ψ", { x:7.6, y:0.05, w:2.0, h:2.0,
      fontSize:80, fontFace:"Georgia", color:"1A3055",
      bold:true, align:"center", valign:"middle", margin:0 });

    // Module label
    s.addText("QUANTUM MECHANICS — MODULE I.3 — QUANTUM DYNAMICS", {
      x:0.45, y:0.62, w:6.5, h:0.22,
      fontSize:7.5, fontFace:FONT_BODY, bold:true,
      color:C.muted, charSpacing:2, margin:0 });

    // Lecture code
    s.addText(LCode, { x:0.45, y:0.88, w:1.0, h:0.32,
      fontSize:22, fontFace:FONT_HEAD, bold:true, color:C.accent, margin:0 });

    // Title
    s.addText(lec.title, { x:0.45, y:1.28, w:6.4, h:1.1,
      fontSize:28, fontFace:FONT_HEAD, bold:true,
      color:C.white, valign:"top", margin:0 });

    // Subtitle (teal italic)
    s.addText(lec.subtitle, { x:0.45, y:2.45, w:6.4, h:0.3,
      fontSize:11, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0 });

    // Dual-track label
    s.addText(lec.track, { x:0.45, y:2.85, w:6.4, h:0.22,
      fontSize:9.5, fontFace:FONT_BODY, color:C.muted, margin:0 });

    // Tier badges
    const badgeDefs = [
      {label:"HS",    fg:C.hsCol,  bg:C.hsBg},
      {label:"BegUG", fg:C.begCol, bg:C.begBg},
      {label:"AdvUG", fg:C.advCol, bg:C.advBg},
      {label:"MSc",   fg:C.mscCol, bg:C.mscBg},
      {label:"PhD",   fg:C.phdCol, bg:C.phdBg},
    ];
    let bx = 0.45;
    for (const b of badgeDefs) {
      s.addShape(pres.shapes.ROUNDED_RECTANGLE, { x:bx, y:3.22, w:0.72, h:0.24,
        fill:{color:b.bg}, line:{color:b.fg, width:1}, rectRadius:0.05 });
      s.addText(b.label, { x:bx, y:3.22, w:0.72, h:0.24,
        fontSize:8.5, fontFace:FONT_BODY, bold:true, color:b.fg,
        align:"center", valign:"middle", margin:0 });
      bx += 0.80;
    }

    // Feature line
    s.addText("Full expanded deck  ·  5 tiers  ·  Worked examples  ·  Complete problem sets", {
      x:0.45, y:3.60, w:6.4, h:0.2,
      fontSize:8, fontFace:FONT_BODY, color:C.muted, margin:0 });

    addFooter(s, `QM: Bra–Ket Notation — ${LCode}`, LCode);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 2 — LECTURE OVERVIEW
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Lecture Overview", lec.title);

    // 90-min pacing card (left)
    makeCard(s, {
      x:0.18, y:0.65, w:4.55, h:2.0,
      title:"90-MIN PACING",
      titleColor:C.teal, borderColor:C.teal, bgColor:"0D1E1D",
      body: lec.pacing, bodyFontSize: 10.5,
    });

    // Core learning outcomes card (right)
    makeCard(s, {
      x:4.84, y:0.65, w:5.0, h:2.0,
      title:"CORE LEARNING OUTCOMES",
      titleColor:C.accent, borderColor:C.accent, bgColor:"0D1830",
      body: lec.outcomes.map(o => "• " + o), bodyFontSize: 10.5,
    });

    // 5-tier row
    const tierW = 1.9, tierH = 1.2, tierGap = 0.02;
    let tx = 0.18;
    for (const t of TIERS) {
      s.addShape(pres.shapes.RECTANGLE, { x:tx, y:2.76, w:tierW, h:tierH,
        fill:{color:t.bg}, line:{color:t.fg, width:1.5} });
      s.addText(t.label, { x:tx, y:2.78, w:tierW, h:0.2,
        fontSize:9, fontFace:FONT_HEAD, bold:true, color:t.fg, align:"center", margin:0 });
      s.addText(lec.tiers[t.key], { x:tx+0.08, y:3.01, w:tierW-0.16, h:0.9,
        fontSize:9, fontFace:FONT_BODY, color:C.offwhite, valign:"top", margin:0 });
      tx += tierW + tierGap;
    }

    // Assessment card
    makeCard(s, {
      x:0.18, y:4.04, w:9.66, h:0.78,
      title:"ASSESSMENT BUNDLE",
      titleColor:C.gold, borderColor:C.gold, bgColor:"201700",
      body:[
        `Set A: ${lec.assessment.setA}`,
        `Set B: ${lec.assessment.setB}`,
      ], bodyFontSize: 10,
    });

    addFooter(s, `QM: ${LCode}`, `${LCode} · Overview`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 3 — KEY FORMULAS
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Key Formulas", "Core mathematical results for this lecture");

    const nF = lec.keyFormulas.length;
    const cols = 2;
    const rows = Math.ceil(nF / cols);
    const cardW = 4.7, cardH = 0.9, gapX = 0.12, gapY = 0.12;
    const startX = 0.18, startY = 0.7;

    for (let i = 0; i < nF; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);
      const x = startX + col * (cardW + gapX);
      const y = startY + row * (cardH + gapY);
      const formula = lec.keyFormulas[i];

      // Split label from formula at "  (" pattern
      const parenIdx = formula.indexOf("  (");
      const label = parenIdx >= 0
        ? formula.slice(parenIdx + 2).replace(/^\(/, "").replace(/\)$/, "")
        : "";
      const fml = parenIdx >= 0 ? formula.slice(0, parenIdx) : formula;

      s.addShape(pres.shapes.RECTANGLE, { x, y, w:cardW, h:cardH,
        fill:{color:"0D1A2A"}, line:{color:C.accent, width:1.2} });

      // Numbered circle
      s.addShape(pres.shapes.OVAL, { x:x+0.1, y:y+0.12, w:0.3, h:0.3,
        fill:{color:C.accent}, line:{color:C.accent} });
      s.addText(`${i+1}`, { x:x+0.1, y:y+0.12, w:0.3, h:0.3,
        fontSize:8.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
        align:"center", valign:"middle", margin:0 });

      // Formula text
      s.addText(fml, { x:x+0.48, y:y+0.1, w:cardW-0.6, h:0.48,
        fontSize:13, fontFace:FONT_MONO, color:C.white, valign:"middle", margin:0 });

      // Label below
      if (label) {
        s.addText(label, { x:x+0.48, y:y+0.57, w:cardW-0.6, h:0.25,
          fontSize:9, fontFace:FONT_BODY, color:C.teal, italic:true, margin:0 });
      }
    }

    // Connections strip
    const connY = startY + rows * (cardH + gapY) + 0.05;
    makeCard(s, {
      x:0.18, y:connY, w:9.66, h:0.52,
      title:null,
      borderColor:C.purple, bgColor:"1A0F2A",
      body:[
        { text:"← Prev: ", options:{bold:true, color:C.purple, fontSize:9.5} },
        { text:lec.prev + "   ", options:{color:C.offwhite, fontSize:9.5} },
        { text:"→ Next: ", options:{bold:true, color:C.teal, fontSize:9.5} },
        { text:lec.next, options:{color:C.offwhite, fontSize:9.5} },
      ],
    });

    addFooter(s, `QM: Module I.3 — ${LCode}`, `${LCode} · Formulas`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 4 — CONCEPT QUESTIONS
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Concept Questions",
                     "Think before computing — conceptual understanding checks");

    const qs   = lec.concepts;
    const half = Math.ceil(qs.length / 2);
    const leftQs  = qs.slice(0, half);
    const rightQs = qs.slice(half);

    // Left column
    s.addShape(pres.shapes.RECTANGLE, { x:0.18, y:0.65, w:4.7, h:4.7,
      fill:{color:"0D1A2A"}, line:{color:C.accent, width:1.5} });
    s.addText(`CONCEPT QUESTIONS (1–${half})`, {
      x:0.3, y:0.68, w:4.5, h:0.22,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.accent, margin:0 });
    const leftItems = leftQs.map((q, i) => ({
      text: `${i+1}. ${q}`,
      options: { color:C.offwhite, fontSize:10.5, breakLine:true, paraSpaceAfter:6 },
    }));
    s.addText(leftItems, { x:0.3, y:0.95, w:4.5, h:4.2,
      valign:"top", fontFace:FONT_BODY, margin:0 });

    // Right column
    s.addShape(pres.shapes.RECTANGLE, { x:5.07, y:0.65, w:4.77, h:4.7,
      fill:{color:"0D1A2A"}, line:{color:C.teal, width:1.5} });
    s.addText(`CONCEPT QUESTIONS (${half+1}–${qs.length})`, {
      x:5.19, y:0.68, w:4.5, h:0.22,
      fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.teal, margin:0 });
    const rightItems = rightQs.map((q, i) => ({
      text: `${half+i+1}. ${q}`,
      options: { color:C.offwhite, fontSize:10.5, breakLine:true, paraSpaceAfter:6 },
    }));
    s.addText(rightItems, { x:5.19, y:0.95, w:4.5, h:4.2,
      valign:"top", fontFace:FONT_BODY, margin:0 });

    addFooter(s, footLeft, `${LCode} · Concept Qs`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // SLIDE 5 — FIVE-TIER PEDAGOGY
  // ══════════════════════════════════════════════════════════════════════════
  {
    const s = pres.addSlide();
    s.background = { color: C.bg };
    addContentHeader(s, LCode, "Five-Tier Pedagogy",
                     "Differentiated content for all levels — HS through PhD");

    const tierFull = [
      {key:"hs",    label:"Tier 1 — HS",    fg:C.hsCol,  bg:C.hsBg,  desc:lec.tiers.hs},
      {key:"begug", label:"Tier 2 — BegUG", fg:C.begCol, bg:C.begBg, desc:lec.tiers.begug},
      {key:"advug", label:"Tier 3 — AdvUG", fg:C.advCol, bg:C.advBg, desc:lec.tiers.advug},
      {key:"msc",   label:"Tier 4 — MSc",   fg:C.mscCol, bg:C.mscBg, desc:lec.tiers.msc},
      {key:"phd",   label:"Tier 5 — PhD",   fg:C.phdCol, bg:C.phdBg, desc:lec.tiers.phd},
    ];

    const tH = 0.82, tGap = 0.04, startY = 0.66;
    for (let i = 0; i < tierFull.length; i++) {
      const t = tierFull[i];
      const y = startY + i * (tH + tGap);
      s.addShape(pres.shapes.RECTANGLE, { x:0.18, y, w:9.66, h:tH,
        fill:{color:t.bg}, line:{color:t.fg, width:1.5} });
      // Solid label block
      s.addShape(pres.shapes.RECTANGLE, { x:0.18, y, w:1.5, h:tH,
        fill:{color:t.fg}, line:{color:t.fg} });
      s.addText(t.label, { x:0.18, y, w:1.5, h:tH,
        fontSize:9.5, fontFace:FONT_HEAD, bold:true, color:C.bg,
        align:"center", valign:"middle", margin:0 });
      s.addText(t.desc, { x:1.78, y:y+0.08, w:8.0, h:tH-0.16,
        fontSize:11, fontFace:FONT_BODY, color:C.offwhite, valign:"middle", margin:0 });
    }

    // Assessment strip at bottom
    const connY = startY + 5 * (tH + tGap) + 0.02;
    makeCard(s, {
      x:0.18, y:connY, w:9.66, h:0.55,
      title:null,
      borderColor:C.gold, bgColor:"201700",
      body:[
        { text:"Assessment Set A: ", options:{bold:true, color:C.gold, fontSize:9.5} },
        { text:lec.assessment.setA + "  |  ", options:{color:C.offwhite, fontSize:9.5} },
        { text:"Set B: ", options:{bold:true, color:C.gold, fontSize:9.5} },
        { text:lec.assessment.setB, options:{color:C.offwhite, fontSize:9.5} },
      ],
    });

    addFooter(s, footLeft, `${LCode} · Tier Pedagogy`);
  }

  // ── Write file ─────────────────────────────────────────────────────────────
  await pres.writeFile({ fileName: outputPath });
}

module.exports = { buildDeck };
