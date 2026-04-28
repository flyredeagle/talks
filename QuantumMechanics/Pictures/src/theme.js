/**
 * theme.js — Shared design tokens and helper functions
 * QM Programme · Module I.3 slide deck generator
 */

// ─── COLOUR PALETTE ──────────────────────────────────────────────────────────
const C = {
  bg:       "0D1117",   // near-black background
  bgCard:   "161B22",   // card background
  bgHeader: "0D2137",   // dark navy header bar
  dimblue:  "1A2B4A",   // Ψ symbol circle background
  accent:   "4F8EF7",   // blue — learning outcomes, slide code
  teal:     "28A8A0",   // teal — pacing, Sakurai track
  purple:   "7C5CBF",   // purple — connections
  gold:     "D4A843",   // gold — assessment, tier 1
  white:    "FFFFFF",
  offwhite: "C9D1D9",   // body text
  muted:    "8B949E",   // captions / footers
  // Tier badge foreground / background pairs
  hsCol:    "E8C547", hsBg:  "3D3110",
  begCol:   "4CC38A", begBg: "103320",
  advCol:   "4F8EF7", advBg: "0D2050",
  mscCol:   "B57BEE", mscBg: "2D1850",
  phdCol:   "EF5757", phdBg: "400E0E",
};

// ─── TYPOGRAPHY ──────────────────────────────────────────────────────────────
const FONT_HEAD = "Trebuchet MS";
const FONT_BODY = "Calibri";
const FONT_MONO = "Consolas";

// ─── SLIDE DIMENSIONS ────────────────────────────────────────────────────────
const W = 10;    // inches
const H = 5.625; // inches (16:9)

// ─── TIER DEFINITIONS ────────────────────────────────────────────────────────
const TIERS = [
  { key: "hs",    label: "HS",    fg: C.hsCol,  bg: C.hsBg  },
  { key: "begug", label: "BegUG", fg: C.begCol, bg: C.begBg },
  { key: "advug", label: "AdvUG", fg: C.advCol, bg: C.advBg },
  { key: "msc",   label: "MSc",   fg: C.mscCol, bg: C.mscBg },
  { key: "phd",   label: "PhD",   fg: C.phdCol, bg: C.phdBg },
];

// ─── HELPER: content card ────────────────────────────────────────────────────
function makeCard(pres, slide, { x, y, w, h, title, titleColor, borderColor,
                                 bgColor, body, bodyFontSize = 11, titleFontSize = 9.5 }) {
  slide.addShape(pres.shapes.RECTANGLE, {
    x, y, w, h,
    fill: { color: bgColor || "1A2433" },
    line: { color: borderColor, width: 1.5 },
  });
  const items = [];
  if (title) {
    items.push({ text: title, options: { bold: true, color: titleColor || borderColor,
      fontSize: titleFontSize, breakLine: true, charSpacing: 1 } });
    items.push({ text: "\n", options: { fontSize: 3, breakLine: true } });
  }
  for (const line of body) {
    if (typeof line === "string") {
      items.push({ text: line, options: { color: C.offwhite, fontSize: bodyFontSize, breakLine: true } });
    } else {
      items.push(line);
    }
  }
  slide.addText(items, { x: x + 0.12, y: y + 0.1, w: w - 0.24, h: h - 0.15,
                          valign: "top", fontFace: FONT_BODY, margin: 0 });
}

// ─── HELPER: header bar ──────────────────────────────────────────────────────
function addContentHeader(slide, lectureCode, title, subtitle) {
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:W, h:0.55,
    fill:{color:"0D1B2E"}, line:{color:"0D1B2E"} });
  slide.addText(`${lectureCode} — ${title}`, {
    x:0.25, y:0.05, w:8.5, h:0.28,
    fontSize:16, fontFace:FONT_HEAD, bold:true, color:C.white, margin:0 });
  slide.addText(subtitle, {
    x:0.25, y:0.32, w:8.5, h:0.18,
    fontSize:9, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0 });
  slide.addText(lectureCode, {
    x:9.4, y:0.05, w:0.5, h:0.45,
    fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.accent, align:"right", margin:0 });
}

// addContentHeader needs pres in scope — export a factory instead
function makeHelpers(pres) {
  return {
    makeCard: (slide, opts) => makeCard(pres, slide, opts),

    addContentHeader(slide, lectureCode, title, subtitle) {
      slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:W, h:0.55,
        fill:{color:"0D1B2E"}, line:{color:"0D1B2E"} });
      slide.addText(`${lectureCode} — ${title}`, {
        x:0.25, y:0.05, w:8.5, h:0.28,
        fontSize:16, fontFace:FONT_HEAD, bold:true, color:C.white, margin:0 });
      slide.addText(subtitle, {
        x:0.25, y:0.32, w:8.5, h:0.18,
        fontSize:9, fontFace:FONT_BODY, color:C.muted, italic:true, margin:0 });
      slide.addText(lectureCode, {
        x:9.4, y:0.05, w:0.5, h:0.45,
        fontSize:9, fontFace:FONT_HEAD, bold:true, color:C.accent, align:"right", margin:0 });
    },

    addFooter(slide, leftText, rightText) {
      slide.addText(leftText,  { x:0.2, y:5.35, w:5,   h:0.2, fontSize:7, fontFace:FONT_BODY, color:C.muted, margin:0 });
      slide.addText(rightText, { x:5,   y:5.35, w:4.8, h:0.2, fontSize:7, fontFace:FONT_BODY, color:C.muted, align:"right", margin:0 });
    },
  };
}

module.exports = { C, FONT_HEAD, FONT_BODY, FONT_MONO, W, H, TIERS, makeHelpers };
