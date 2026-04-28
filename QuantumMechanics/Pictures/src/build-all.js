#!/usr/bin/env node
/**
 * build-all.js — Generate all 10 Module I.3 lecture decks
 * QM Programme · Module I.3 — Quantum Dynamics
 *
 * Usage:
 *   node src/build-all.js              # writes to slides/
 *   node src/build-all.js --lecture 3  # single lecture only
 */

const path    = require("path");
const fs      = require("fs");
const lectures = require("./lectures");
const { buildDeck } = require("./builder");

const SLIDES_DIR = path.resolve(__dirname, "../slides");
fs.mkdirSync(SLIDES_DIR, { recursive: true });

// Parse optional --lecture N flag
const args = process.argv.slice(2);
const lectureFlag = args.indexOf("--lecture");
const targetNum   = lectureFlag >= 0 ? parseInt(args[lectureFlag + 1], 10) : null;

const selected = targetNum
  ? lectures.filter(l => l.num === targetNum)
  : lectures;

if (selected.length === 0) {
  console.error(`No lecture found with num=${targetNum}`);
  process.exit(1);
}

(async () => {
  console.log(`\n🎓  QM Module I.3 — Lecture Deck Generator`);
  console.log(`    Generating ${selected.length} deck(s)…\n`);

  for (const lec of selected) {
    const outFile = path.join(SLIDES_DIR, `${lec.code}_${lec.title.replace(/[^a-zA-Z0-9]+/g, "_")}.pptx`);
    process.stdout.write(`  [${lec.code}] ${lec.title} … `);
    try {
      await buildDeck(lec, outFile);
      console.log(`✓  ${path.basename(outFile)}`);
    } catch (err) {
      console.error(`✗  FAILED`);
      console.error(err);
      process.exit(1);
    }
  }

  console.log(`\n✅  Done — ${selected.length} deck(s) written to slides/\n`);
})();
