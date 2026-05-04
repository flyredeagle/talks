#!/usr/bin/env node
/**
 * build-all-expanded.js — Generate expanded 28-slide decks for all 10 lectures
 * QM Programme · Module I.3
 *
 * Usage:
 *   node src/build-all-expanded.js              # all lectures
 *   node src/build-all-expanded.js --lecture 5  # single lecture
 *
 * L01 uses its own builder (builder-L01.js); L02–L10 use builder-expanded.js.
 * All outputs go to slides/ with the prefix _expanded_.
 */

"use strict";
const path     = require("path");
const fs       = require("fs");
const lectures = require("./lectures");
const { buildL01Expanded }  = require("./builder-L01");
const { buildExpandedDeck } = require("./builder-expanded");

const SLIDES_DIR = path.resolve(__dirname, "../slides");
fs.mkdirSync(SLIDES_DIR, { recursive: true });

// ── CLI flag parsing ───────────────────────────────────────────────────────────
const args        = process.argv.slice(2);
const lectureFlag = args.indexOf("--lecture");
const targetNum   = lectureFlag >= 0 ? parseInt(args[lectureFlag + 1], 10) : null;
const selected    = targetNum ? lectures.filter(l => l.num === targetNum) : lectures;

if (selected.length === 0) {
  console.error(`No lecture found with num=${targetNum}`);
  process.exit(1);
}

// ── Filename helper ────────────────────────────────────────────────────────────
function outFile(lec) {
  const safe = lec.title.replace(/[^a-zA-Z0-9]+/g, "_").replace(/_+/g, "_");
  return path.join(SLIDES_DIR, `${lec.code}_expanded_${safe}.pptx`);
}

// ── Main ───────────────────────────────────────────────────────────────────────
(async () => {
  console.log("\n🎓  QM Programme — Module I.3 — Expanded Lecture Deck Generator");
  console.log(`    Generating ${selected.length} expanded deck(s) …\n`);

  let ok = 0, fail = 0;
  for (const lec of selected) {
    const dest = outFile(lec);
    process.stdout.write(`  [${lec.code}] ${lec.title.slice(0,52).padEnd(52)} … `);
    try {
      if (lec.code === "L01") {
        await buildL01Expanded(lec, dest);
      } else {
        await buildExpandedDeck(lec, dest);
      }
      const kb = Math.round(fs.statSync(dest).size / 1024);
      console.log(`✓  ${path.basename(dest)}  (${kb} KB)`);
      ok++;
    } catch (err) {
      console.error(`✗  FAILED`);
      console.error("   ", err.message);
      fail++;
    }
  }

  console.log(`\n${fail === 0 ? "✅" : "⚠️ "}  Done — ${ok} succeeded, ${fail} failed.\n`);
  if (fail > 0) process.exit(1);
})();
