#!/usr/bin/env node
// generate_deck.js — PptxGenJS slide deck generator for Module I.4
// Usage: node generate_deck.js [LECTURE_CODE]
//   e.g. node generate_deck.js L03
//        node generate_deck.js          (generates all 12 lectures)
// Output: ../slides/<code>/<code>_slides.pptx

"use strict";
const fs = require("fs");
const path = require("path");

// ── Try loading PptxGenJS ──────────────────────────────────────────────────
let PptxGenJS;
try {
  PptxGenJS = require("pptxgenjs");
} catch (e) {
  console.error("PptxGenJS not found. Install it with: npm install -g pptxgenjs");
  process.exit(1);
}

// ── Colour palette (deep quantum-physics navy) ────────────────────────────
const C = {
  dark:      "0D1F35",  // title slide bg
  primary:   "1E3A5F",  // section headers
  secondary: "2E6DA4",  // accent bars
  accent:    "F5A623",  // gold accent
  light:     "EBF2FA",  // content slide bg
  text:      "1A1A2E",  // body text
  white:     "FFFFFF",
  subtext:   "4A5568",
  // Tier colours
  t1: "7B2D8B", t2: "1E7A1E", t3: "1A64B4",
  t4: "B45309", t5: "B91C1C",
};

// ── Helper: create a new deck with shared settings ────────────────────────
function newDeck() {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in
  pptx.defineLayout({ name: "WIDE", width: 13.33, height: 7.5 });
  pptx.layout = "WIDE";
  return pptx;
}

// ── Slide builders ────────────────────────────────────────────────────────

function addTitleSlide(pptx, spec) {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };

  // Gold top bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.06,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  // Series label
  slide.addText(spec.series, {
    x: 0.5, y: 0.3, w: 12, h: 0.4,
    fontSize: 13, color: C.accent, italic: true,
    fontFace: "Calibri",
  });

  // Module + lecture code badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.5, y: 0.9, w: 2.4, h: 0.5,
    fill: { color: C.secondary }, line: { color: C.secondary }, rounding: 0.05,
  });
  slide.addText(`Module I.4 / ${spec.lecture}`, {
    x: 0.5, y: 0.9, w: 2.4, h: 0.5,
    fontSize: 12, bold: true, color: C.white, align: "center",
    fontFace: "Calibri",
  });

  // Title
  slide.addText(spec.title, {
    x: 0.5, y: 1.7, w: 12.3, h: 2.0,
    fontSize: 38, bold: true, color: C.white,
    fontFace: "Calibri",
    valign: "middle",
  });

  // Meta info
  slide.addText(spec.meta || "Five-Tier Pedagogy · Full Assessment Bundle", {
    x: 0.5, y: 3.9, w: 12, h: 0.5,
    fontSize: 15, color: C.accent, italic: true,
    fontFace: "Calibri",
  });

  // Tier badges
  const tiers = [
    { label: "HS",     color: C.t1 },
    { label: "BegUG",  color: C.t2 },
    { label: "AdvUG",  color: C.t3 },
    { label: "MSc",    color: C.t4 },
    { label: "PhD",    color: C.t5 },
  ];
  tiers.forEach((t, i) => {
    slide.addShape(pptx.ShapeType.rect, {
      x: 0.5 + i * 1.5, y: 5.0, w: 1.3, h: 0.45,
      fill: { color: t.color }, line: { color: t.color }, rounding: 0.08,
    });
    slide.addText(t.label, {
      x: 0.5 + i * 1.5, y: 5.0, w: 1.3, h: 0.45,
      fontSize: 13, bold: true, color: C.white, align: "center",
      fontFace: "Calibri",
    });
  });

  // Programme watermark
  slide.addText("QM Programme — Module I.4 — Paradigm Physical Systems", {
    x: 0.5, y: 7.0, w: 12.3, h: 0.35,
    fontSize: 10, color: "607080", align: "right", italic: true,
    fontFace: "Calibri",
  });

  // Gold bottom bar
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 7.44, w: "100%", h: 0.06,
    fill: { color: C.accent }, line: { color: C.accent },
  });
}

function addContentSlide(pptx, spec, slideData) {
  const slide = pptx.addSlide();
  slide.background = { color: C.light };

  // Primary bar (left side stripe)
  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: 0.08, h: "100%",
    fill: { color: C.primary }, line: { color: C.primary },
  });

  // Section code badge
  slide.addShape(pptx.ShapeType.rect, {
    x: 0.2, y: 0.15, w: 1.5, h: 0.38,
    fill: { color: C.secondary }, line: { color: C.secondary }, rounding: 0.05,
  });
  slide.addText(slideData.section, {
    x: 0.2, y: 0.15, w: 1.5, h: 0.38,
    fontSize: 11, bold: true, color: C.white, align: "center",
    fontFace: "Calibri",
  });

  // Tier badge
  const tierColor = { "T1": C.t1, "T2": C.t2, "T3": C.t3, "T4": C.t4, "T5": C.t5 }[
    (slideData.tier || "T2").substring(0, 2)
  ] || C.t3;
  slide.addShape(pptx.ShapeType.rect, {
    x: 11.8, y: 0.15, w: 1.3, h: 0.38,
    fill: { color: tierColor }, line: { color: tierColor }, rounding: 0.05,
  });
  slide.addText(slideData.tier || "T2–T5", {
    x: 11.8, y: 0.15, w: 1.3, h: 0.38,
    fontSize: 10, bold: true, color: C.white, align: "center",
    fontFace: "Calibri",
  });

  // Slide title
  slide.addText(slideData.title, {
    x: 0.2, y: 0.7, w: 12.9, h: 0.7,
    fontSize: 26, bold: true, color: C.primary,
    fontFace: "Calibri",
  });

  // Divider
  slide.addShape(pptx.ShapeType.line, {
    x: 0.2, y: 1.45, w: 12.9, h: 0,
    line: { color: C.secondary, width: 1.5 },
  });

  // Bullets
  const bullets = (slideData.bullets || []).map(b => ({
    text: b,
    options: { bullet: { type: "bullet" }, fontSize: 17, color: C.text, fontFace: "Calibri" }
  }));
  slide.addText(bullets, {
    x: 0.5, y: 1.6, w: 12.5, h: 5.5,
    fontSize: 17, color: C.text, fontFace: "Calibri",
    valign: "top", paraSpaceBefore: 6,
  });

  // Footer
  slide.addText(`QM · Module I.4 / ${spec.lecture} — ${spec.title}`, {
    x: 0.2, y: 7.15, w: 12.9, h: 0.28,
    fontSize: 9, color: "8090A0", italic: true, align: "right",
    fontFace: "Calibri",
  });
}

function addAssessmentSlide(pptx, spec, slideData) {
  const slide = pptx.addSlide();
  slide.background = { color: C.dark };

  slide.addShape(pptx.ShapeType.rect, {
    x: 0, y: 0, w: "100%", h: 0.06,
    fill: { color: C.accent }, line: { color: C.accent },
  });

  slide.addText(slideData.title, {
    x: 0.5, y: 0.3, w: 12.3, h: 0.8,
    fontSize: 28, bold: true, color: C.white, fontFace: "Calibri",
  });

  slide.addShape(pptx.ShapeType.line, {
    x: 0.5, y: 1.2, w: 12.3, h: 0,
    line: { color: C.accent, width: 1.5 },
  });

  // Two-column layout for artifact items
  const items = slideData.items || [];
  const mid = Math.ceil(items.length / 2);
  const leftItems = items.slice(0, mid);
  const rightItems = items.slice(mid);

  const renderColumn = (arr, x) => arr.map(it => ({
    text: it, options: { bullet: { code: "25B6" }, fontSize: 15, color: "D0E8FF", fontFace: "Calibri" }
  }));

  slide.addText(renderColumn(leftItems, 0), {
    x: 0.5, y: 1.4, w: 6.0, h: 5.5,
    valign: "top", paraSpaceBefore: 8,
  });
  slide.addText(renderColumn(rightItems, 0), {
    x: 6.8, y: 1.4, w: 6.0, h: 5.5,
    valign: "top", paraSpaceBefore: 8,
  });

  slide.addText("92 assessment items across 14 types per lecture", {
    x: 0.5, y: 7.1, w: 12.3, h: 0.3,
    fontSize: 11, color: C.accent, italic: true, align: "center",
    fontFace: "Calibri",
  });
}

// ── Generate a single deck ────────────────────────────────────────────────
async function generateDeck(specPath, outDir) {
  const spec = JSON.parse(fs.readFileSync(specPath, "utf8"));
  const pptx = newDeck();

  for (const s of spec.slides) {
    if (s.type === "title")      addTitleSlide(pptx, spec);
    else if (s.type === "content")    addContentSlide(pptx, spec, s);
    else if (s.type === "assessment") addAssessmentSlide(pptx, spec, s);
  }

  const outFile = path.join(outDir, `${spec.lecture}_slides.pptx`);
  await pptx.writeFile({ fileName: outFile });
  console.log(`✓ Generated: ${outFile}`);
}

// ── Main ──────────────────────────────────────────────────────────────────
(async () => {
  const arg = process.argv[2];
  const basePath = path.resolve(__dirname, "..");
  const slidesDir = path.join(basePath, "slides");

  const codes = ["L01","L02","L03","L04","L05","L06","L07","L08","L09","L10","L11","L12"];
  const targets = arg ? [arg.toUpperCase()] : codes;

  for (const code of targets) {
    const specFile = path.join(slidesDir, code, "deck_spec.json");
    const outDir   = path.join(slidesDir, code);
    if (!fs.existsSync(specFile)) {
      console.warn(`⚠ Spec not found: ${specFile}`);
      continue;
    }
    await generateDeck(specFile, outDir);
  }
  console.log("\nDone. All .pptx files written to slides/<code>/");
})();
