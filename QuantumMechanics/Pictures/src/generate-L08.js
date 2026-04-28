#!/usr/bin/env node
/**
 * generate-L08.js — Generate slide deck for Lecture 8 only
 * QM Programme · Module I.3
 *
 * Usage:  node src/generate-L08.js
 */
const path    = require("path");
const fs      = require("fs");
const lectures = require("./lectures");
const { buildDeck } = require("./builder");

const SLIDES_DIR = path.resolve(__dirname, "../slides");
fs.mkdirSync(SLIDES_DIR, { recursive: true });

const lec = lectures.find(l => l.num === 8);
if (!lec) { console.error("Lecture 8 not found"); process.exit(1); }

const outFile = path.join(SLIDES_DIR, `${lec.code}_${lec.title.replace(/[^a-zA-Z0-9]+/g, "_")}.pptx`);
console.log(`Generating [${lec.code}] ${lec.title} …`);
buildDeck(lec, outFile)
  .then(() => console.log(`✓  ${path.basename(outFile)}`))
  .catch(e => { console.error(e); process.exit(1); });
