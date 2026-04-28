// ═══════════════════════════════════════════════════════════════
//  lo_shared.js  —  Shared helpers for all Linear Optics lectures
//  Usage: const S = require('./lo_shared');
// ═══════════════════════════════════════════════════════════════
const pptxgen = require("pptxgenjs");
const fs      = require("fs");

// ── Caches (loaded once, shared across all lectures) ──────────
const FCACHE = JSON.parse(fs.readFileSync("/home/claude/formula_cache_v3.json","utf8"));
const DCACHE = JSON.parse(fs.readFileSync("/home/claude/diagram_cache.json","utf8"));
const FDIMS  = JSON.parse(fs.readFileSync("/home/claude/formula_dims_v3.json","utf8"));

// ── Colour palette ────────────────────────────────────────────
const C = {
  dark:"0D1B2A", mid:"1B2E4A", panel:"1A2A3A",
  accent1:"00B4D8", accent2:"48CAE4", accent3:"90E0EF",
  teal:"0096B7", gold:"FFB703", amber:"FB8500",
  white:"FFFFFF", offwhite:"E8F4F8", muted:"8DB0C8",
  green:"06D6A0", purple:"9B5DE5", red:"EF476F", pink:"FF6B9D",
};

function makeShadow(){
  return {type:"outer",color:"000000",blur:8,offset:3,angle:135,opacity:0.25};
}

// ── Slide factories ───────────────────────────────────────────
function base(pres){
  const s = pres.addSlide();
  s.background = {color:C.dark};
  return s;
}

function sectionTitle(pres, title, subtitle, tag){
  const s = base(pres);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:C.accent1},line:{color:C.accent1,width:0}});
  s.addShape(pres.shapes.OVAL,{x:7.5,y:-1,w:5,h:5,fill:{color:C.accent1,transparency:90},line:{color:C.accent1,transparency:80,width:1}});
  s.addShape(pres.shapes.OVAL,{x:8.5,y:2,w:3,h:3,fill:{color:C.accent2,transparency:93},line:{color:C.accent2,transparency:85,width:1}});
  if(tag) s.addText(tag,{x:0.4,y:0.3,w:5,h:0.35,fontSize:9,color:C.accent1,bold:true,charSpacing:3,fontFace:"Calibri"});
  s.addText(title,{x:0.4,y:1.0,w:8.5,h:1.6,fontSize:40,bold:true,color:C.white,fontFace:"Georgia"});
  s.addText(subtitle,{x:0.4,y:2.8,w:8,h:1.2,fontSize:17,color:C.accent3,fontFace:"Calibri",italic:true});
  return s;
}

function cSlide(pres, title, tag){
  const s = base(pres);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:10,h:0.08,fill:{color:C.accent1},line:{color:C.accent1,width:0}});
  if(tag) s.addText(tag,{x:0.35,y:0.12,w:7,h:0.22,fontSize:7.5,color:C.muted,bold:true,charSpacing:2,fontFace:"Calibri"});
  s.addText(title,{x:0.35,y:0.32,w:9.3,h:0.68,fontSize:24,bold:true,color:C.white,fontFace:"Georgia"});
  s.addShape(pres.shapes.LINE,{x:0.35,y:1.03,w:9.3,h:0,line:{color:C.accent1,width:1.5,transparency:30}});
  return s;
}

// ── Image helpers ─────────────────────────────────────────────
function fImg(slide, key, x, y, w, maxH=99){
  const data = FCACHE[key];
  if(!data){ console.warn(`Missing formula: ${key}`); return 0; }
  const dims = FDIMS[key];
  if(!dims){ slide.addImage({data, x, y, w, h:maxH===99?1.5:maxH}); return maxH===99?1.5:maxH; }
  const ar = dims[0] / dims[1];          // pixel width / pixel height
  let fw = w;
  let fh = w / ar;                       // natural height at the requested width
  if(maxH < 99 && fh > maxH){
    // Scale both dimensions so height = maxH (never stretch or squash)
    fh = maxH;
    fw = maxH * ar;
  }
  // Centre horizontally within the originally requested width slot
  const cx = x + (w - fw) / 2;
  slide.addImage({data, x:cx, y, w:fw, h:fh});
  return fh;
}

function dImg(slide, key, x, y, w, h){
  const data = DCACHE[key];
  if(!data){ console.warn(`Missing diagram: ${key}`); return; }
  slide.addImage({data, x, y, w, h});
}

// ── Panel / text helpers ──────────────────────────────────────
function panel(s, pres, x, y, w, h, col){
  s.addShape(pres.shapes.RECTANGLE,{x,y,w,h,fill:{color:C.panel},line:{color:col||C.accent1,width:0.8},shadow:makeShadow()});
}
function hdr(s, pres, x, y, w, col, txt){
  s.addShape(pres.shapes.RECTANGLE,{x,y,w,h:0.28,fill:{color:col},line:{color:col,width:0}});
  s.addText(txt,{x:x+0.08,y:y+0.01,w:w-0.16,h:0.25,fontSize:9.5,bold:true,color:C.dark,fontFace:"Calibri",margin:0});
}
function bul(s, lines, x, y, w, h, fs=10.5){
  const items = lines.map((t,i)=>({text:t,options:{bullet:true,breakLine:i<lines.length-1,fontSize:fs,color:C.offwhite,fontFace:"Calibri"}}));
  s.addText(items,{x,y,w,h});
}
function txt(s, text, x, y, w, h, opts={}){
  s.addText(text,{x,y,w,h,fontSize:opts.fs||11,color:opts.col||C.offwhite,fontFace:opts.font||"Calibri",...opts});
}

// ── Reference slide ───────────────────────────────────────────
function refSlide(pres, title, tag, bscRefs, mscRefs, problems){
  const s = cSlide(pres, title, tag);
  panel(s,pres,0.35,1.1,4.55,2.55,C.accent1); hdr(s,pres,0.35,1.1,4.55,C.accent1,"BSc References & Reading");
  bul(s,bscRefs,0.43,1.42,4.37,2.15,9.5);
  panel(s,pres,5.1,1.1,4.55,2.55,C.purple); hdr(s,pres,5.1,1.1,4.55,C.purple,"MSc / Advanced References");
  bul(s,mscRefs,5.18,1.42,4.37,2.15,9.5);
  panel(s,pres,0.35,3.75,9.3,1.65,C.gold); hdr(s,pres,0.35,3.75,9.3,C.gold,"Problem Sets & Projects");
  bul(s,problems,0.43,4.07,9.1,1.28,9.5);
}

// ── New presentation factory ──────────────────────────────────
function newPres(lectureTitle, lectureNum){
  const pres = new pptxgen();
  pres.layout  = "LAYOUT_16x9";
  pres.title   = lectureTitle;
  pres.author  = "Linear Optics Course";
  pres.subject = `Lecture ${lectureNum}`;
  return pres;
}

// ── Standard lecture title slide ──────────────────────────────
function lectureTitleSlide(pres, num, title, subtitle, accentCol){
  const col = accentCol || C.accent1;
  const s = base(pres);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.22,h:5.625,fill:{color:col},line:{color:col,width:0}});
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:4.82,w:10,h:0.805,fill:{color:C.mid},line:{color:C.mid,width:0}});
  for(let i=0;i<6;i++) s.addShape(pres.shapes.OVAL,{x:7+i*0.35,y:-0.3+i*0.85,w:4,h:0.045,fill:{color:col,transparency:78+i*2},line:{color:col,transparency:78+i*2,width:1}});
  s.addText(`LECTURE ${num}`,{x:0.55,y:0.55,w:9,h:0.4,fontSize:11,color:col,bold:true,charSpacing:6,fontFace:"Calibri"});
  s.addText(title,{x:0.55,y:1.05,w:8.5,h:1.4,fontSize:38,bold:true,color:C.white,fontFace:"Georgia"});
  s.addText(subtitle,{x:0.55,y:2.6,w:8.5,h:0.85,fontSize:14,color:C.accent3,fontFace:"Calibri",italic:true});
  s.addText("Linear Optics Course  ·  All formulas typeset with LaTeX",{x:0.55,y:4.88,w:9.1,h:0.35,fontSize:10,color:C.muted,fontFace:"Calibri"});
  return s;
}

module.exports = {
  C, makeShadow, base, sectionTitle, cSlide,
  fImg, dImg, panel, hdr, bul, txt, refSlide,
  newPres, lectureTitleSlide,
  FCACHE, DCACHE, FDIMS,
};
