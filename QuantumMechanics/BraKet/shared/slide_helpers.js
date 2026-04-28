/**
 * shared/slide_helpers.js
 * =======================
 * Reusable PptxGenJS primitives shared by all per-lecture deck builders
 * and the syllabus builder.
 *
 * Usage in a lecture builder:
 *   const { initPres, slideHeader, slideFooter, accentCard,
 *           levelBadge, addSlide } = require("../shared/slide_helpers");
 */

"use strict";
const pptxgen = require("pptxgenjs");
const path    = require("path");
const fs      = require("fs");

// ── Load design tokens (written by Python before Node runs) ──────────────────
const DESIGN_PATH = path.join(__dirname, "design_tokens.json");
let _D;
try {
  _D = JSON.parse(fs.readFileSync(DESIGN_PATH, "utf8"));
} catch {
  // fallback inline tokens (should not happen in normal build)
  _D = {
    C: {
      bg:"0A0E1A", bgCard:"111827", bgAlt:"131C2E",
      accent1:"6366F1", accent2:"A78BFA", accent3:"34D399",
      accent4:"F59E0B", accent5:"38BDF8", accent6:"FB7185",
      text:"F1F5F9", textSub:"94A3B8", textDim:"475569",
      hs:"FCD34D", begug:"6EE7B7", advug:"93C5FD", msc:"C4B5FD", phd:"F87171",
    },
    W: 13.3, H: 7.5,
    FONT_HEAD: "Calibri", FONT_BODY: "Calibri",
    LEVELS: [["HS","FCD34D"],["BegUG","6EE7B7"],["AdvUG","93C5FD"],["MSc","C4B5FD"],["PhD","F87171"]],
    LECTURE_ACCENTS: ["6366F1","A78BFA","34D399","F59E0B","38BDF8","FB7185",
                      "6366F1","34D399","A78BFA","F59E0B","38BDF8","FB7185"],
  };
}
const { C, W, H, FONT_HEAD, FONT_BODY, LEVELS, LECTURE_ACCENTS } = _D;

// ── Factory function: shadow object (fresh each call to avoid PptxGenJS mutation bug) ──
const makeShadow = () => ({ type:"outer", blur:8, offset:3, angle:135, color:"000000", opacity:0.18 });

// ── initPres: create a new presentation with standard settings ───────────────
function initPres(title, author = "Diego Bragato") {
  const pres = new pptxgen();
  pres.layout = "LAYOUT_WIDE";
  pres.title  = title;
  pres.author = author;
  return pres;
}

// ── addSlide: add a dark-background slide ────────────────────────────────────
function addSlide(pres) {
  const s = pres.addSlide();
  s.background = { color: C.bg };
  s._pres = pres;   // back-reference so helpers can access shapes enum
  return s;
}

// ── slideHeader: top bar with title ──────────────────────────────────────────
function slideHeader(slide, title, subtitle, tag, accentColor) {
  const accent = accentColor || C.accent1;
  // semi-transparent accent band
  slide.addShape(slide._pres.ShapeType.rect, {
    x:0, y:0, w:W, h:0.78,
    fill:{ color:accent, transparency:82 },
    line:{ color:"000000", transparency:100 },
  });
  // left accent stripe
  slide.addShape(slide._pres.ShapeType.rect, {
    x:0, y:0, w:0.12, h:0.78,
    fill:{ color:accent }, line:{ color:accent },
  });
  // title
  slide.addText(title, {
    x:0.28, y:0.06, w: W - 2.6, h:0.42,
    fontSize:18, bold:true, color:C.text,
    fontFace:FONT_HEAD, margin:0, valign:"middle",
  });
  // subtitle
  if (subtitle) {
    slide.addText(subtitle, {
      x:0.28, y:0.48, w: W - 2.6, h:0.24,
      fontSize:9.5, color:C.textSub, fontFace:FONT_BODY, margin:0,
    });
  }
  // tag top-right
  if (tag) {
    slide.addText(tag, {
      x: W - 2.3, y:0.12, w:2.1, h:0.3,
      fontSize:9, bold:true, color:accent,
      fontFace:FONT_HEAD, align:"right", margin:0,
    });
  }
}

// ── slideFooter ───────────────────────────────────────────────────────────────
function slideFooter(slide, left, right) {
  slide.addText(left || "", {
    x:0.25, y: H - 0.32, w:8, h:0.25,
    fontSize:7.5, color:C.textDim, fontFace:FONT_BODY, margin:0,
  });
  if (right) {
    slide.addText(right, {
      x: W - 2.6, y: H - 0.32, w:2.5, h:0.25,
      fontSize:7.5, color:C.textDim, fontFace:FONT_BODY, align:"right", margin:0,
    });
  }
}

// ── accentCard: bordered card with optional title + body ─────────────────────
function accentCard(slide, { x, y, w, h, accent, title, body, titleSz=12, bodySz=10, bodyColor }) {
  // card background
  slide.addShape(slide._pres.ShapeType.rect, {
    x, y, w, h,
    fill:{ color: C.bgCard },
    line:{ color: accent, width:1.5 },
    shadow: makeShadow(),
  });
  // left accent stripe
  slide.addShape(slide._pres.ShapeType.rect, {
    x, y, w:0.07, h,
    fill:{ color: accent }, line:{ color: accent },
  });
  if (title) {
    slide.addText(title, {
      x: x+0.18, y: y+0.08, w: w-0.26, h:0.28,
      fontSize: titleSz, bold:true, color: accent,
      fontFace: FONT_HEAD, margin:0, valign:"top",
    });
  }
  if (body) {
    slide.addText(body, {
      x: x+0.18,
      y: y + (title ? 0.38 : 0.1),
      w: w - 0.26,
      h: h - (title ? 0.46 : 0.16),
      fontSize: bodySz,
      color: bodyColor || C.text,
      fontFace: FONT_BODY,
      valign:"top", margin:0,
    });
  }
}

// ── levelBadge: coloured pill label ─────────────────────────────────────────
function levelBadge(slide, x, y, label, color) {
  slide.addShape(slide._pres.ShapeType.roundRect, {
    x, y, w:0.75, h:0.26, rectRadius:0.06,
    fill:{ color, transparency:28 },
    line:{ color, width:1 },
  });
  slide.addText(label, {
    x, y, w:0.75, h:0.26,
    fontSize:8, bold:true, color,
    fontFace:FONT_HEAD, align:"center", valign:"middle", margin:0,
  });
}

// ── formulaImage: insert a pre-rendered formula PNG ─────────────────────────
function formulaImage(slide, imgPath, x, y, maxH) {
  if (!fs.existsSync(imgPath)) {
    console.warn(`[slide_helpers] Formula image not found: ${imgPath}`);
    return;
  }
  // Use sharp/jimp size or fixed maxH; PptxGenJS will scale from path
  slide.addImage({ path: imgPath, x, y, h: maxH, sizing:{ type:"contain", h:maxH, w:8 } });
}

// ── bulletList: helper for consistent bullet arrays ─────────────────────────
function bulletList(items, opts = {}) {
  const { bold = false, sz = 10.5, color } = opts;
  return items.map((txt, i) => ({
    text: txt,
    options: {
      bullet: true,
      breakLine: i < items.length - 1,
      bold,
      fontSize: sz,
      color: color || C.text,
    },
  }));
}

// ── sectionDivider: thin horizontal line ─────────────────────────────────────
function sectionDivider(slide, x, y, w, color) {
  slide.addShape(slide._pres.ShapeType.line, {
    x, y, w, h:0,
    line:{ color: color || C.textDim, width:0.5 },
  });
}

// ── lectureAccent: get per-lecture colour by 0-based index ───────────────────
function lectureAccent(index) {
  return LECTURE_ACCENTS[index % LECTURE_ACCENTS.length];
}

module.exports = {
  initPres, addSlide,
  slideHeader, slideFooter,
  accentCard, levelBadge,
  formulaImage, bulletList, sectionDivider,
  lectureAccent,
  C, W, H, FONT_HEAD, FONT_BODY, LEVELS, LECTURE_ACCENTS,
  makeShadow,
};
