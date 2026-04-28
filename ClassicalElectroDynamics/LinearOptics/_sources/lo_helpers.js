// ─── SHARED HELPERS & PALETTE ─────────────────────────────────────────────
const C = {
  dark:     "0D1B2A",
  mid:      "1B2E4A",
  panel:    "1A2A3A",
  accent1:  "00B4D8",
  accent2:  "48CAE4",
  accent3:  "90E0EF",
  teal:     "0096B7",
  gold:     "FFB703",
  amber:    "FB8500",
  white:    "FFFFFF",
  offwhite: "E8F4F8",
  muted:    "8DB0C8",
  green:    "06D6A0",
  purple:   "9B5DE5",
  red:      "EF476F",
  pink:     "FF6B9D",
};

function makeShadow() {
  return { type: "outer", color: "000000", blur: 8, offset: 3, angle: 135, opacity: 0.25 };
}

function addSlideBase(pres) {
  const slide = pres.addSlide();
  slide.background = { color: C.dark };
  return slide;
}

function sectionTitle(pres, title, subtitle, tag) {
  const slide = addSlideBase(pres);
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:0.18, h:5.625, fill:{color:C.accent1}, line:{color:C.accent1,width:0} });
  slide.addShape(pres.shapes.OVAL, { x:7.5, y:-1, w:5, h:5, fill:{color:C.accent1,transparency:90}, line:{color:C.accent1,transparency:80,width:1} });
  slide.addShape(pres.shapes.OVAL, { x:8.5, y:2, w:3, h:3, fill:{color:C.accent2,transparency:93}, line:{color:C.accent2,transparency:85,width:1} });
  if(tag) slide.addText(tag, { x:0.4, y:0.3, w:4, h:0.35, fontSize:9, color:C.accent1, bold:true, charSpacing:3, fontFace:"Calibri" });
  slide.addText(title, { x:0.4, y:1.0, w:8.5, h:1.6, fontSize:40, bold:true, color:C.white, fontFace:"Georgia" });
  slide.addText(subtitle, { x:0.4, y:2.8, w:8, h:1.2, fontSize:17, color:C.accent3, fontFace:"Calibri", italic:true });
  return slide;
}

function contentSlide(pres, title, sectionTag) {
  const slide = addSlideBase(pres);
  slide.addShape(pres.shapes.RECTANGLE, { x:0, y:0, w:10, h:0.08, fill:{color:C.accent1}, line:{color:C.accent1,width:0} });
  if(sectionTag) slide.addText(sectionTag, { x:0.35, y:0.12, w:6, h:0.22, fontSize:7.5, color:C.muted, bold:true, charSpacing:2, fontFace:"Calibri" });
  slide.addText(title, { x:0.35, y:0.32, w:9.3, h:0.68, fontSize:24, bold:true, color:C.white, fontFace:"Georgia", align:"left" });
  slide.addShape(pres.shapes.LINE, { x:0.35, y:1.03, w:9.3, h:0, line:{color:C.accent1,width:1.5,transparency:30} });
  return slide;
}

function mathBox(slide, pres, x, y, w, h, label, formula) {
  slide.addShape(pres.shapes.RECTANGLE, { x, y, w, h, fill:{color:"0A1628"}, line:{color:C.gold,width:1} });
  if(label) slide.addText(label, { x:x+0.1, y:y+0.05, w:w-0.2, h:0.25, fontSize:8, color:C.gold, bold:true, italic:true, fontFace:"Calibri" });
  slide.addText(formula, { x:x+0.1, y:y+(label?0.28:0.1), w:w-0.2, h:h-(label?0.35:0.2), fontSize:12, color:C.accent2, fontFace:"Consolas", align:"center" });
}

function card(slide, pres, x, y, w, h, headerText, headerColor, bodyLines) {
  slide.addShape(pres.shapes.RECTANGLE, { x,y,w,h, fill:{color:C.panel}, line:{color:headerColor||C.teal,width:0.75,transparency:50}, shadow:makeShadow() });
  slide.addShape(pres.shapes.RECTANGLE, { x,y,w,h:0.32, fill:{color:headerColor||C.teal}, line:{color:headerColor||C.teal,width:0} });
  slide.addText(headerText, { x:x+0.08,y:y+0.03,w:w-0.16,h:0.28, fontSize:9, bold:true, color:C.white, fontFace:"Calibri", margin:0 });
  if(bodyLines&&bodyLines.length>0) {
    const items = bodyLines.map((b,i)=>({ text:b, options:{bullet:true, breakLine:i<bodyLines.length-1, fontSize:10, color:C.offwhite, fontFace:"Calibri"} }));
    slide.addText(items, { x:x+0.1, y:y+0.37, w:w-0.18, h:h-0.45 });
  }
}

function refSlide(pres, title, sectionTag, bscRefs, mscRefs, problems) {
  const slide = contentSlide(pres, title, sectionTag);
  // BSc references
  slide.addShape(pres.shapes.RECTANGLE, { x:0.35, y:1.1, w:4.55, h:2.55, fill:{color:C.panel}, line:{color:C.accent1,width:0.8} });
  slide.addShape(pres.shapes.RECTANGLE, { x:0.35, y:1.1, w:4.55, h:0.28, fill:{color:C.accent1}, line:{color:C.accent1,width:0} });
  slide.addText("BSc References & Reading", { x:0.43,y:1.12,w:4.37,h:0.24, fontSize:9, bold:true, color:C.dark, fontFace:"Calibri" });
  const bItems = bscRefs.map((r,i)=>({text:r, options:{bullet:true, breakLine:i<bscRefs.length-1, fontSize:9.5, color:C.offwhite, fontFace:"Calibri"}}));
  slide.addText(bItems, { x:0.43, y:1.42, w:4.37, h:2.15 });
  // MSc references
  slide.addShape(pres.shapes.RECTANGLE, { x:5.1, y:1.1, w:4.55, h:2.55, fill:{color:C.panel}, line:{color:C.purple,width:0.8} });
  slide.addShape(pres.shapes.RECTANGLE, { x:5.1, y:1.1, w:4.55, h:0.28, fill:{color:C.purple}, line:{color:C.purple,width:0} });
  slide.addText("MSc / Advanced References", { x:5.18,y:1.12,w:4.37,h:0.24, fontSize:9, bold:true, color:C.white, fontFace:"Calibri" });
  const mItems = mscRefs.map((r,i)=>({text:r, options:{bullet:true, breakLine:i<mscRefs.length-1, fontSize:9.5, color:C.offwhite, fontFace:"Calibri"}}));
  slide.addText(mItems, { x:5.18, y:1.42, w:4.37, h:2.15 });
  // Problems
  slide.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.75, w:9.3, h:1.65, fill:{color:C.panel}, line:{color:C.gold,width:0.8} });
  slide.addShape(pres.shapes.RECTANGLE, { x:0.35, y:3.75, w:9.3, h:0.28, fill:{color:C.gold}, line:{color:C.gold,width:0} });
  slide.addText("Problem Sets & Projects", { x:0.43,y:3.77,w:9.1,h:0.24, fontSize:9, bold:true, color:C.dark, fontFace:"Calibri" });
  const pItems = problems.map((p,i)=>({text:p, options:{bullet:true, breakLine:i<problems.length-1, fontSize:9.5, color:C.offwhite, fontFace:"Calibri"}}));
  slide.addText(pItems, { x:0.43, y:4.07, w:9.1, h:1.28 });
  return slide;
}

module.exports = { C, makeShadow, addSlideBase, sectionTitle, contentSlide, mathBox, card, refSlide };
