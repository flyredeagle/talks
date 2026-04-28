/**
 * shared/rendered_card.js
 * =======================
 * Layout engine for slides that mix prose and rendered formula images.
 *
 * Takes a "layout spec" (array of items produced by inline_renderer.py)
 * and places them vertically inside a card rectangle:
 *
 *   { type: "header",  text: "SECTION TITLE" }     → bold accent text
 *   { type: "text",    text: "prose sentence" }     → normal text
 *   { type: "formula", path: "/abs/path/to.png" }   → image, auto-height
 *   { type: "spacer" }                              → small vertical gap
 *
 * The card draws its own background + left accent stripe then places
 * items top-to-bottom with a small margin, scaling formula images to
 * fit the card width.
 */

"use strict";
const fs   = require("fs");
const path = require("path");
const { C, FONT_HEAD, FONT_BODY, makeShadow } = require("./slide_helpers");

// ── image dimensions via PNG header parsing ───────────────────────────────────
function pngDims(filePath) {
  try {
    const buf = fs.readFileSync(filePath);
    // PNG width at offset 16, height at 20 (4 bytes big-endian each)
    if (buf[0] === 0x89 && buf[1] === 0x50) {  // PNG magic
      const w = buf.readUInt32BE(16);
      const h = buf.readUInt32BE(20);
      return { w, h };
    }
  } catch (e) {}
  return { w: 300, h: 60 };  // fallback
}

/**
 * renderedCard
 * ============
 * Place a layout spec inside a card on the slide.
 *
 * @param {object} slide       PptxGenJS slide object
 * @param {object} pres        PptxGenJS presentation (for ShapeType)
 * @param {Array}  spec        Layout spec from inline_renderer.py
 * @param {object} opts
 *   x, y, w, h               Card geometry (inches)
 *   accent                   Hex accent colour (no #)
 *   title                    Optional card title line
 *   titleSz                  Title font size (default 11)
 *   cardBg                   Card background colour (default C.bgCard)
 *   maxImgH                  Max formula image height in inches (default 0.55)
 *   textSz                   Body text font size (default 10)
 *   headerSz                 Section header font size (default 10)
 */
function renderedCard(slide, pres, spec, opts = {}) {
  const {
    x, y, w, h,
    accent      = C.accent1,
    title       = null,
    titleSz     = 11,
    cardBg      = C.bgCard,
    maxImgH     = 0.50,   // inches
    textSz      = 9.5,
    headerSz    = 10,
  } = opts;

  const DPI_PT = 96;  // pptxgenjs coordinates are in inches; PNG dims are pixels

  // ── draw card background ─────────────────────────────────────────────────
  slide.addShape(pres.ShapeType.rect, {
    x, y, w, h,
    fill: { color: cardBg },
    line: { color: accent, width: 1.5 },
    shadow: makeShadow(),
  });
  // left accent stripe
  slide.addShape(pres.ShapeType.rect, {
    x, y, w: 0.07, h,
    fill: { color: accent }, line: { color: accent },
  });

  const xInner  = x + 0.18;
  const wInner  = w - 0.26;
  let   cursor  = y + 0.10;   // current vertical position

  // ── optional card title ──────────────────────────────────────────────────
  if (title) {
    slide.addText(title, {
      x: xInner, y: cursor, w: wInner, h: 0.28,
      fontSize: titleSz, bold: true, color: accent,
      fontFace: FONT_HEAD, margin: 0, valign: "top",
    });
    cursor += 0.30;
  }

  const bottom = y + h - 0.08;  // don't go below card bottom

  // ── place each spec item ─────────────────────────────────────────────────
  for (const item of spec) {
    if (cursor >= bottom - 0.05) break;  // no more space

    if (item.type === "spacer") {
      cursor += 0.08;
      continue;
    }

    if (item.type === "header") {
      const lineH = 0.22;
      if (cursor + lineH > bottom) break;
      slide.addText((item.text || ""), {
        x: xInner, y: cursor, w: wInner, h: lineH,
        fontSize: headerSz, bold: true, color: accent,
        fontFace: FONT_HEAD, margin: 0, valign: "top",
      });
      cursor += lineH + 0.03;
      continue;
    }

    if (item.type === "text") {
      // Estimate lines needed
      const charsPerLine = Math.floor(wInner / (textSz * 0.0105));
      const text = item.text || "";
      const nLines = Math.max(1, Math.ceil(text.length / charsPerLine));
      const lineH = nLines * (textSz * 0.0145) + 0.03;
      if (cursor + lineH > bottom) break;
      // Clean inline LaTeX from prose text for display
      const cleanText = text
        .replace(/\$\\mathcal\{([^}]+)\}\$/g, (_, c) => c)  // $\mathcal{H}$ -> H
        .replace(/\$\\mathbb\{([^}]+)\}\$/g, (_, c) => c)   // $\mathbb{R}$ -> R
        .replace(/\$\\hat\{([^}]+)\}\$/g, (_, c) => c+'̂')  // $\hat{A}$ -> Â
        .replace(/\$([^$]+)\$/g, (_, m) => m               // $expr$ -> expr
          .replace(/\\langle/g,'⟨').replace(/\\rangle/g,'⟩')
          .replace(/\\psi/g,'ψ').replace(/\\phi/g,'φ')
          .replace(/\\hat\{([^}]+)\}/g, (_,c)=>c)
          .replace(/\\mathcal\{([^}]+)\}/g,(_,c)=>c)
          .replace(/\\mathbb\{([^}]+)\}/g,(_,c)=>c)
          .replace(/\\to/g,'→').replace(/\\sim/g,'~')
          .replace(/\\in/g,'∈').replace(/\\geq/g,'≥')
          .replace(/\\leq/g,'≤').replace(/\\neq/g,'≠')
          .replace(/\\Leftrightarrow/g,'⟺').replace(/\\dagger/g,'†')
          .replace(/\\forall/g,'∀').replace(/\\/g,'')
        );
      slide.addText(cleanText, {
        x: xInner, y: cursor, w: wInner, h: lineH,
        fontSize: textSz, color: C.text,
        fontFace: FONT_BODY, margin: 0, valign: "top",
        wrap: true,
      });
      cursor += lineH + 0.01;
      continue;
    }

    if (item.type === "formula") {
      const imgPath = item.path;
      if (!imgPath || !fs.existsSync(imgPath)) {
        // Fallback: show raw TeX as dim text
        const fallback = (item.tex || "").replace(/\$/g,"").slice(0, 80);
        const lineH = 0.20;
        if (cursor + lineH > bottom) break;
        slide.addText(fallback, {
          x: xInner, y: cursor, w: wInner, h: lineH,
          fontSize: 8.5, color: C.textSub,
          fontFace: FONT_BODY, margin: 0, italic: true,
        });
        cursor += lineH + 0.02;
        continue;
      }

      // Read PNG dimensions and scale to fit width
      const dims   = pngDims(imgPath);
      const dpiScale = 300;  // our renderer uses 300dpi
      // px → inches
      const natW   = dims.w / dpiScale;
      const natH   = dims.h / dpiScale;
      // scale so width fits, but cap height at maxImgH
      let imgW = Math.min(natW, wInner);
      let imgH = natH * (imgW / natW);
      if (imgH > maxImgH) {
        imgH = maxImgH;
        imgW = natW * (imgH / natH);
        imgW = Math.min(imgW, wInner);
      }
      // minimum sensible size
      imgH = Math.max(imgH, 0.18);
      imgW = Math.max(imgW, 0.5);

      if (cursor + imgH > bottom) break;

      try {
        const imgData = "image/png;base64," +
          fs.readFileSync(imgPath).toString("base64");
        slide.addImage({
          data: imgData,
          x: xInner,
          y: cursor,
          w: imgW,
          h: imgH,
          sizing: { type: "contain", w: imgW, h: imgH },
        });
      } catch (e) {
        // skip corrupt image
      }
      cursor += imgH + 0.06;
      continue;
    }
  }
}

module.exports = { renderedCard };
