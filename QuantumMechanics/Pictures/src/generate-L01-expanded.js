#!/usr/bin/env node
/**
 * generate-L01-expanded.js — Generate the expanded L01 deck with diagram slides
 * QM Programme · Module I.3
 *
 * Usage:  node src/generate-L01-expanded.js
 */
const path     = require("path");
const fs       = require("fs");
const lectures = require("./lectures");
const { buildL01Expanded } = require("./builder-L01");

const SLIDES_DIR = path.resolve(__dirname, "../slides");
fs.mkdirSync(SLIDES_DIR, { recursive: true });

const lec = lectures.find(l => l.num === 1);
if (!lec) { console.error("Lecture 1 not found"); process.exit(1); }

const outFile = path.join(SLIDES_DIR, "L01_expanded_Pure_Mixed_States_and_the_Density_Matrix.pptx");
console.log(`\n🎓  Generating expanded L01 deck…`);
console.log(`    ${lec.code} — ${lec.title}`);
console.log(`    Output: ${path.basename(outFile)}\n`);

buildL01Expanded(lec, outFile)
  .then(() => console.log(`✓  Done — ${path.basename(outFile)}\n`))
  .catch(e => { console.error("✗  FAILED:", e); process.exit(1); });
