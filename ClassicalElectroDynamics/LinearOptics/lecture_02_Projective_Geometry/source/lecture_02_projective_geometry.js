// ═══════════════════════════════════════════════════════════════
//  LECTURE 00b: Projective Geometry & Metric Tensors
//  Prerequisite bridge between high school and the BSc overview.
//  Run: node lecture_00b_projective.js
// ═══════════════════════════════════════════════════════════════
"use strict";
const S = require('./lo_shared');
const { C, base, cSlide, fImg, dImg, panel, hdr, bul, txt, refSlide, newPres, lectureTitleSlide } = S;

const pres = newPres("Linear Optics — Lecture 00b: Projective Geometry", "00b");

// ─────────────────────────────────────────────────────────────
//  TITLE SLIDE
// ─────────────────────────────────────────────────────────────
lectureTitleSlide(pres, "00b",
  "Projective Geometry & Metric Tensors",
  "Scalar Products · Homogeneous Coordinates · Transformations · Distances on Curved Spaces",
  C.purple
);

// ═══════════════════════════════════════════════════════════════
//  PART A — HIGH SCHOOL PREREQUISITES
// ═══════════════════════════════════════════════════════════════
{
  const s = base(pres);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:C.green},line:{color:C.green,width:0}});
  s.addShape(pres.shapes.OVAL,{x:7,y:-1,w:5.5,h:5.5,fill:{color:C.green,transparency:90},line:{color:C.green,transparency:80,width:1}});
  s.addText("PART A — HIGH SCHOOL PREREQUISITES",{x:0.4,y:0.35,w:8,h:0.3,fontSize:9,color:C.green,bold:true,charSpacing:3,fontFace:"Calibri"});
  s.addText("The Scalar (Dot) Product",{x:0.4,y:0.78,w:8.5,h:1.0,fontSize:38,bold:true,color:C.white,fontFace:"Georgia"});
  s.addText("From geometric projection to Euclidean distance — the common thread running through all of this lecture",{x:0.4,y:1.95,w:8.2,h:0.75,fontSize:15,color:C.accent3,fontFace:"Calibri",italic:true});
  const bullets = [
    ["Geometric meaning","The dot product a·b = |a||b|cosθ measures how much of a lies along b — it is a projection."],
    ["Coordinate formula","a·b = a₁b₁ + a₂b₂ + a₃b₃ — sum of products of components; no angles needed."],
    ["Distance via dot product","The Euclidean distance is d(a,b) = √((a−b)·(a−b)) — derived entirely from the dot product."],
    ["Generalisation","Replacing the identity matrix I with any symmetric positive-definite matrix g changes which distances are measured — this is the metric tensor."],
  ];
  bullets.forEach(([title, desc], i) => {
    const y = 2.88 + i * 0.65;
    s.addShape(pres.shapes.RECTANGLE,{x:0.38,y,w:9.25,h:0.58,fill:{color:C.panel},line:{color:i===0?C.green:C.mid,width:0.6}});
    s.addShape(pres.shapes.RECTANGLE,{x:0.38,y,w:1.55,h:0.58,fill:{color:i===0?C.green:C.mid},line:{color:i===0?C.green:C.mid,width:0}});
    s.addText(title,{x:0.44,y:y+0.08,w:1.42,h:0.42,fontSize:9.5,bold:true,color:C.dark,fontFace:"Calibri",align:"center"});
    s.addText(desc,{x:2.02,y:y+0.07,w:7.5,h:0.44,fontSize:10.5,color:C.offwhite,fontFace:"Calibri"});
  });
}

// ── HS-1: Dot product as projection ──────────────────────────
{
  const s = cSlide(pres, "The Scalar Product as a Geometric Projection", "PREREQUISITES · SCALAR PRODUCT");
  txt(s,"The scalar (dot) product has a precise geometric meaning: it measures the signed length of the projection of one vector onto another. This is the foundation of everything that follows.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"hs_dot_def",     0.35,1.73,9.3,0.72);
  fImg(s,"hs_dot_projection",0.35,2.5, 9.3,0.78);

  // Hand-drawn projection diagram
  const ox=0.6, oy=3.45, dw=4.1, dh=1.9;
  s.addShape(pres.shapes.RECTANGLE,{x:ox,y:oy,w:dw,h:dh,fill:{color:"0A1628"},line:{color:C.teal,width:1}});
  s.addText("Projection diagram",{x:ox+0.06,y:oy+0.06,w:dw-0.12,h:0.22,fontSize:8,color:C.teal,bold:true,fontFace:"Calibri",align:"center"});
  // Vectors
  s.addShape(pres.shapes.LINE,{x:ox+0.35,y:oy+1.45,w:3.25,h:0,line:{color:C.gold,width:2.5}});
  s.addText("b",{x:ox+3.6,y:oy+1.3,w:0.25,h:0.3,fontSize:13,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addShape(pres.shapes.LINE,{x:ox+0.35,y:oy+1.45,w:1.6,h:-1.0,line:{color:C.accent1,width:2.5}});
  s.addText("a",{x:ox+1.85,y:oy+0.22,w:0.25,h:0.3,fontSize:13,bold:true,color:C.accent1,fontFace:"Georgia"});
  // Projection foot
  s.addShape(pres.shapes.LINE,{x:ox+1.95,y:oy+1.45,w:0,h:-0.32,line:{color:C.green,width:1.2,dashType:"dash"}});
  s.addShape(pres.shapes.LINE,{x:ox+0.35,y:oy+1.45,w:1.6,h:0,line:{color:C.green,width:2.2}});
  s.addText("proj",{x:ox+0.8,y:oy+1.52,w:0.9,h:0.22,fontSize:8.5,color:C.green,fontFace:"Calibri",align:"center"});
  // Angle arc
  s.addText("θ",{x:ox+0.65,y:oy+1.05,w:0.25,h:0.28,fontSize:12,color:C.offwhite,fontFace:"Georgia"});

  panel(s,pres,4.85,3.45,5.1,1.9,C.green); hdr(s,pres,4.85,3.45,5.1,C.green,"Worked example: a=(3,1), b=(4,0)");
  bul(s,["a·b = 3×4 + 1×0 = 12","|a| = √(9+1) = √10 ≈ 3.16,  |b| = 4","cosθ = 12/(3.16×4) = 0.949 → θ ≈ 18.4°","proj_b(a) = (a·b/|b|²)b = (12/16)(4,0) = (3,0)","Component: a·b/|b| = 12/4 = 3.0  ✓"],4.93,3.77,4.92,1.5,10.5);

  fImg(s,"hs_dot_properties",0.35,5.3,9.3,0.32);
}

// ── HS-2: Dot product → Euclidean distance ───────────────────
{
  const s = cSlide(pres,"From Scalar Product to Euclidean Distance","PREREQUISITES · SCALAR PRODUCT");
  txt(s,"The Euclidean distance between two points is completely determined by the scalar product. This connection will generalise: changing the scalar product changes which distances are measured.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"hs_euclid_dist",0.35,1.73,9.3,0.85);

  panel(s,pres,0.35,2.68,4.5,1.55,C.teal); hdr(s,pres,0.35,2.68,4.5,C.teal,"Derivation in 2D");
  txt(s,"Let a=(a₁,a₂), b=(b₁,b₂). Difference vector: d = a−b = (a₁−b₁, a₂−b₂).\n\nd·d = (a₁−b₁)²+(a₂−b₂)²\n\nd(a,b) = √(d·d) = √((a₁−b₁)²+(a₂−b₂)²)  (Pythagoras ✓)",
      0.43,2.98,4.32,1.15,{fs:10.5,col:C.offwhite,font:"Consolas"});

  panel(s,pres,5.0,2.68,4.65,1.55,C.gold); hdr(s,pres,5.0,2.68,4.65,C.gold,"Matrix form (key insight)");
  txt(s,"d(a,b)² = (a−b)ᵀ I (a−b)   where  I = identity matrix\n\nThe matrix I defines which scalar product we use.\n\nReplace I with any matrix g → different geometry!\nThis is the metric tensor (Section C of this lecture).",
      5.08,2.98,4.47,1.15,{fs:10.5});

  panel(s,pres,0.35,4.32,9.3,1.12,C.purple); hdr(s,pres,0.35,4.32,9.3,C.purple,"Why this matters for the rest of the lecture");
  bul(s,["The scalar product ℓ·x = 0 (a point lies on a line) is the central concept in projective geometry","Euclidean geometry: g = I₃ (identity) gives the familiar flat distances","Minkowski spacetime: g = diag(1,−1,−1,−1) gives relativistic intervals","Sphere: g_ij(θ,φ) encodes curved distances on the surface of a globe"],
      0.43,4.62,9.1,0.76,10.5);
}

// ═══════════════════════════════════════════════════════════════
//  PART B — PROJECTIVE GEOMETRY
// ═══════════════════════════════════════════════════════════════
{
  const s = base(pres);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:C.purple},line:{color:C.purple,width:0}});
  s.addShape(pres.shapes.OVAL,{x:6.5,y:-0.5,w:6,h:6,fill:{color:C.purple,transparency:90},line:{color:C.purple,transparency:80,width:1}});
  s.addText("PART B — PROJECTIVE GEOMETRY",{x:0.4,y:0.35,w:8,h:0.3,fontSize:9,color:C.purple,bold:true,charSpacing:3,fontFace:"Calibri"});
  s.addText("From Ordinary Planes to the Projective Plane",{x:0.4,y:0.78,w:8.5,h:1.0,fontSize:36,bold:true,color:C.white,fontFace:"Georgia"});
  s.addText("Parallel lines meet · Points at infinity · Duality between points and lines",{x:0.4,y:1.95,w:8,h:0.6,fontSize:15,color:C.accent3,fontFace:"Calibri",italic:true});
  const items=[
    ["Axioms","Two points determine a unique line. Two lines determine a unique point. No exceptions — no 'parallel' lines."],
    ["Homogeneous coordinates","Points and lines both become 3-vectors. The scalar product between them has an exact meaning: incidence (lying on)."],
    ["Duality","Every theorem about points and lines has a dual theorem — swap the words and it still holds."],
    ["Transformations","3×3 invertible matrices (homographies H) act on points and lines while preserving incidence."],
  ];
  items.forEach(([title,desc],i)=>{
    const y=2.72+i*0.68;
    s.addShape(pres.shapes.RECTANGLE,{x:0.38,y,w:9.25,h:0.6,fill:{color:C.panel},line:{color:i===0?C.purple:C.mid,width:0.6}});
    s.addShape(pres.shapes.RECTANGLE,{x:0.38,y,w:1.55,h:0.6,fill:{color:i===0?C.purple:C.mid},line:{color:i===0?C.purple:C.mid,width:0}});
    s.addText(title,{x:0.44,y:y+0.1,w:1.42,h:0.4,fontSize:9.5,bold:true,color:C.dark,fontFace:"Calibri",align:"center"});
    s.addText(desc,{x:2.02,y:y+0.08,w:7.5,h:0.44,fontSize:10.5,color:C.offwhite,fontFace:"Calibri"});
  });
}

// ── B-1: Axioms ───────────────────────────────────────────────
{
  const s = cSlide(pres,"Axioms of Projective Geometry","PROJECTIVE GEOMETRY · AXIOMS");
  txt(s,"Ordinary (Euclidean) geometry has an awkward exception: parallel lines never meet. Projective geometry removes this exception by adding 'points at infinity'. The result is a cleaner, more symmetric theory.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"proj_axioms",0.35,1.78,9.3,0.72);

  panel(s,pres,0.35,2.6,4.5,1.42,C.purple); hdr(s,pres,0.35,2.6,4.5,C.purple,"The three axioms");
  bul(s,["P1: Any two distinct points lie on a unique line","P2: Any two distinct lines meet in a unique point","P3: There exist four points, no three of which are collinear (non-degenerate quadrilateral — prevents trivial models)"],
      0.43,2.9,4.32,1.05,10.5);

  panel(s,pres,5.0,2.6,4.65,1.42,C.gold); hdr(s,pres,5.0,2.6,4.65,C.gold,"The Duality Principle");
  txt(s,"Swap the words 'point' and 'line' in any true theorem → get another true theorem.\n\nP1 dual: Any two distinct lines lie on a unique point (= P2).\nEvery configuration has a dual configuration. Every proof has a dual proof.",
      5.08,2.9,4.47,1.05,{fs:10.5});

  panel(s,pres,0.35,4.1,4.5,1.35,C.teal); hdr(s,pres,0.35,4.1,4.5,C.teal,"Parallel lines in the projective plane");
  bul(s,["Parallel lines in ℝ² (same direction d) both pass through the point at infinity (d₁:d₂:0)","Distinct parallel families → distinct points at infinity","All points at infinity lie on the line at infinity: (0:0:1) row vector","So the Euclidean plane ℝ² ⊂ ℙ² as the complement of the line at infinity"],
      0.43,4.4,4.32,0.98,10.5);

  panel(s,pres,5.0,4.1,4.65,1.35,C.red); hdr(s,pres,5.0,4.1,4.65,C.red,"Classical theorems");
  bul(s,["Pappus' theorem: six points on two lines → three intersection points are collinear","Desargues' theorem: two triangles perspective from a point ↔ perspective from a line","Cross-ratio: the one projective invariant of four collinear points","These all follow cleanly from the axioms — no coordinates needed!"],
      5.08,4.4,4.47,0.98,10.5);
}

// ── B-2: Homogeneous coordinates ─────────────────────────────
{
  const s = cSlide(pres,"Homogeneous Coordinates: Points and Lines as 3-Vectors","PROJECTIVE GEOMETRY · COORDINATES");
  txt(s,"To compute with projective geometry we use homogeneous coordinates. Points become column 3-vectors; lines become row 3-vectors. Both are defined only up to a non-zero scalar multiple.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"proj_homog_point",0.35,1.73,4.55,1.18);
  fImg(s,"proj_homog_line", 5.1, 1.73,4.55,0.72);
  fImg(s,"proj_affine_embed",5.1,2.5,4.55,1.18);

  panel(s,pres,0.35,3.0,4.55,2.38,C.teal); hdr(s,pres,0.35,3.0,4.55,C.teal,"Reading homogeneous coordinates");
  bul(s,["(x₁:x₂:x₃) with x₃≠0 corresponds to affine point (x₁/x₃, x₂/x₃) ∈ ℝ²","(x₁:x₂:0) is a point at infinity in direction (x₁,x₂)","Scale doesn't matter: (2:4:2) and (1:2:1) are the same point (1,2)","Affine line ax+by+c=0 ↔ row vector (a : b : c) in projective coordinates","Line at infinity: (0 : 0 : 1) — contains all points (d₁:d₂:0)"],
      0.43,3.3,4.37,2.0,10.5);

  panel(s,pres,5.1,3.0,4.55,2.38,C.gold); hdr(s,pres,5.1,3.0,4.55,C.gold,"Examples");
  bul(s,["Point (3,2) ↔ column (3:2:1)ᵀ","Point at infinity 'rightward' ↔ (1:0:0)ᵀ","Horizontal line y=5 (i.e. 0·x+1·y−5=0) ↔ row (0:1:−5)","Line at infinity ↔ row (0:0:1)","Check: (0:1:−5)·(3:5:1)ᵀ = 0+5−5 = 0 ✓ (point (3,5) lies on y=5)","Check: (0:0:1)·(d₁:d₂:0)ᵀ = 0 ✓ (all points at infinity lie on line at infinity)"],
      5.18,3.3,4.37,2.0,10.5);
}

// ── B-3: Incidence — scalar product ──────────────────────────
{
  const s = cSlide(pres,"Incidence as a Scalar Product: ℓ · x = 0","PROJECTIVE GEOMETRY · INCIDENCE");
  txt(s,"The central operation in projective geometry is the scalar product between a line (row vector) and a point (column vector). It is zero if and only if the point lies on the line — this is the incidence condition.",
      0.35,1.12,9.3,0.6,{fs:12});
  fImg(s,"proj_incidence",   0.35,1.78,9.3,0.68);
  fImg(s,"proj_join_meet",   0.35,2.52,9.3,0.72);
  fImg(s,"proj_infinity",    0.35,3.3, 9.3,1.15);

  panel(s,pres,0.35,4.52,4.55,1.0,C.teal); hdr(s,pres,0.35,4.52,4.55,C.teal,"Join and meet via cross product");
  bul(s,["Line through p and q: ℓ = p × q  (treat column vectors as 3D vectors, take cross product)","Intersection of lines ℓ and m: x = ℓ × m  (same operation — duality!)","Cross product yields a 3-vector; treat result as column (point) or row (line) as needed"],
      0.43,4.82,4.37,0.62,10);

  panel(s,pres,5.1,4.52,4.55,1.0,C.purple); hdr(s,pres,5.1,4.52,4.55,C.purple,"Worked example: where do two lines meet?");
  txt(s,"ℓ₁ = (1:0:−2) [line x=2]  and  ℓ₂ = (0:1:−3) [line y=3]\n\nx = ℓ₁ × ℓ₂ = (0·(−3)−(−2)·1 , (−2)·0−1·(−3) , 1·1−0·0)\n            = (2 : 3 : 1)\n\nAffine point: (2/1, 3/1) = (2, 3)  ✓",
      5.18,4.82,4.37,0.62,{fs:10.5,col:C.offwhite,font:"Consolas"});
}

// ── B-4: How 3×3 matrices act on points ──────────────────────
{
  const s = cSlide(pres,"3×3 Matrix Transformations: Points, Lines and Invariance","PROJECTIVE GEOMETRY · TRANSFORMATIONS");
  txt(s,"A 3×3 invertible real matrix H (homography) transforms the entire projective plane. It acts differently on points (column vectors) and lines (row vectors) so that incidence is always preserved.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"proj_point_transform",0.35,1.73,9.3,0.65);
  fImg(s,"proj_line_transform", 0.35,2.44,9.3,0.65);
  fImg(s,"proj_invariance",     0.35,3.15,9.3,0.65);

  panel(s,pres,0.35,3.9,4.5,1.62,C.gold); hdr(s,pres,0.35,3.9,4.5,C.gold,"Why ℓ transforms by H⁻ᵀ");
  txt(s,"We need ℓ'x' = 0 whenever ℓx = 0.\n\nx' = Hx   so   ℓ' must satisfy ℓ'(Hx) = 0\n⟹  (ℓ'H)x = 0  for all x on ℓ\n⟹   ℓ'H = ℓ   ⟹  ℓ' = ℓH⁻¹\n\nEquivalently: ℓ'ᵀ = H⁻ᵀ ℓᵀ (column form: covariant).",
      0.43,4.2,4.32,1.22,{fs:10.5,col:C.offwhite,font:"Consolas"});

  panel(s,pres,5.0,3.9,4.65,1.62,C.purple); hdr(s,pres,5.0,3.9,4.65,C.purple,"Types of homographies");
  bul(s,["Euclidean motions (rotation + translation): H = [R|t; 0ᵀ|1], preserves distances","Similarities: H = s[R|t; 0ᵀ|1], preserves angles, not distances","Affinities: H = [A|t; 0ᵀ|1], preserves parallelism","General projectivity: any 8-dof H, preserves collinearity and cross-ratio only","Each subgroup has its own invariants — projective is the most general"],
      5.08,4.2,4.47,1.22,10.5);
}

// ── B-5: Full projective diagram ─────────────────────────────
{
  const s = cSlide(pres,"Summary: The Projective Plane at a Glance","PROJECTIVE GEOMETRY · SUMMARY");
  // Large central diagram showing the full story
  const bx=0.35, by=1.12, bw=9.3, bh=4.28;
  s.addShape(pres.shapes.RECTANGLE,{x:bx,y:by,w:bw,h:bh,fill:{color:"0A1628"},line:{color:C.purple,width:1.2}});

  // Points zone
  panel(s,pres,0.5,1.25,2.8,1.75,C.purple); hdr(s,pres,0.5,1.25,2.8,C.purple,"POINT  x");
  txt(s,"Column 3-vector:\n\nx = (x₁, x₂, x₃)ᵀ\ndefined up to scale\n\nAffine: (x₁/x₃, x₂/x₃)\nAt ∞:  x₃ = 0",0.58,1.57,2.62,1.35,{fs:10.5,col:C.accent3,font:"Consolas"});

  // Lines zone
  panel(s,pres,6.85,1.25,2.65,1.75,C.teal); hdr(s,pres,6.85,1.25,2.65,C.teal,"LINE  ℓ");
  txt(s,"Row 3-vector:\n\nℓ = (ℓ₁  ℓ₂  ℓ₃)\ndefined up to scale\n\nAffine: ℓ₁x+ℓ₂y+ℓ₃=0\nAt ∞: (0  0  1)",6.93,1.57,2.47,1.35,{fs:10.5,col:C.accent3,font:"Consolas"});

  // Centre: incidence
  s.addShape(pres.shapes.OVAL,{x:3.55,y:1.38,w:2.95,h:1.55,fill:{color:C.gold,transparency:85},line:{color:C.gold,width:2}});
  s.addText("ℓ · x = 0",{x:3.72,y:1.62,w:2.6,h:0.5,fontSize:20,bold:true,color:C.gold,fontFace:"Georgia",align:"center"});
  s.addText("point lies on line",{x:3.65,y:2.14,w:2.72,h:0.3,fontSize:9.5,color:C.gold,fontFace:"Calibri",italic:true,align:"center"});

  // Arrows
  s.addShape(pres.shapes.LINE,{x:3.3,y:2.1,w:-0.05,h:0,line:{color:C.gold,width:1}});
  s.addShape(pres.shapes.LINE,{x:6.85,y:2.1,w:-0.05,h:0,line:{color:C.gold,width:1}});

  // Transformation zone
  panel(s,pres,0.5,3.12,2.8,1.15,C.accent1); hdr(s,pres,0.5,3.12,2.8,C.accent1,"x' = H x");
  txt(s,"H ∈ GL(3,ℝ)\n3×3 invertible matrix\n8 degrees of freedom",0.58,3.42,2.62,0.78,{fs:10.5,col:C.offwhite,font:"Consolas"});

  panel(s,pres,6.85,3.12,2.65,1.15,C.amber); hdr(s,pres,6.85,3.12,2.65,C.amber,"ℓ' = ℓ H⁻¹");
  txt(s,"Dual transform\npreserves incidence:\nℓ'x' = ℓx always",6.93,3.42,2.47,0.78,{fs:10.5,col:C.offwhite,font:"Consolas"});

  // Join/meet
  panel(s,pres,3.45,3.12,3.2,1.15,C.green); hdr(s,pres,3.45,3.12,3.2,C.green,"Join & Meet");
  txt(s,"Line p∨q:   ℓ = p × q\nPoint ℓ∧m: x = ℓ × m\n(same operation — duality!)",3.53,3.42,3.02,0.78,{fs:10.5,col:C.offwhite,font:"Consolas"});

  // Invariance banner
  s.addShape(pres.shapes.RECTANGLE,{x:bx,y:by+bh-0.38,w:bw,h:0.38,fill:{color:C.purple,transparency:20},line:{color:C.purple,width:0}});
  s.addText("Key invariant:  ℓ'x' = (ℓH⁻¹)(Hx) = ℓx  — incidence is invariant under all projective transformations",
    {x:bx+0.15,y:by+bh-0.33,w:bw-0.3,h:0.28,fontSize:10,bold:true,color:C.white,fontFace:"Calibri",align:"center"});
}

// ═══════════════════════════════════════════════════════════════
//  PART C — DISTANCES VIA SCALAR PRODUCTS & METRIC TENSORS
// ═══════════════════════════════════════════════════════════════
{
  const s = base(pres);
  s.addShape(pres.shapes.RECTANGLE,{x:0,y:0,w:0.18,h:5.625,fill:{color:C.amber},line:{color:C.amber,width:0}});
  s.addShape(pres.shapes.OVAL,{x:6,y:-0.5,w:6.5,h:6.5,fill:{color:C.amber,transparency:90},line:{color:C.amber,transparency:80,width:1}});
  s.addText("PART C — DISTANCES VIA SCALAR PRODUCTS",{x:0.4,y:0.35,w:9,h:0.3,fontSize:9,color:C.amber,bold:true,charSpacing:3,fontFace:"Calibri"});
  s.addText("Euclidean, Minkowski & Metric Tensors",{x:0.4,y:0.78,w:8.8,h:1.0,fontSize:36,bold:true,color:C.white,fontFace:"Georgia"});
  s.addText("Changing the matrix in the scalar product changes which distances are measured",{x:0.4,y:1.95,w:8,h:0.6,fontSize:15,color:C.accent3,fontFace:"Calibri",italic:true});
  const rows=[
    ["Euclidean distance","g = I (identity). Gives the familiar flat-space Pythagoras theorem. Preserved by rotations and reflections."],
    ["Minkowski distance","g = diag(1,−1,−1,−1). Gives spacetime interval. Preserved by Lorentz boosts. Can be negative!"],
    ["Metric tensor","g_ij(u) varying with position. Gives distances on curved 2D surfaces embedded in 3D space."],
  ];
  rows.forEach(([title,desc],i)=>{
    const y=2.72+i*0.78;
    s.addShape(pres.shapes.RECTANGLE,{x:0.38,y,w:9.25,h:0.7,fill:{color:C.panel},line:{color:i===0?C.amber:C.mid,width:0.6}});
    s.addShape(pres.shapes.RECTANGLE,{x:0.38,y,w:1.85,h:0.7,fill:{color:i===0?C.amber:C.mid},line:{color:i===0?C.amber:C.mid,width:0}});
    s.addText(title,{x:0.44,y:y+0.12,w:1.72,h:0.46,fontSize:9.5,bold:true,color:C.dark,fontFace:"Calibri",align:"center"});
    s.addText(desc,{x:2.32,y:y+0.1,w:7.2,h:0.5,fontSize:10.5,color:C.offwhite,fontFace:"Calibri"});
  });
}

// ── C-1: Euclidean metric ─────────────────────────────────────
{
  const s = cSlide(pres,"Euclidean Distance: Scalar Product with Identity Matrix","METRIC TENSORS · EUCLIDEAN");
  txt(s,"The familiar Euclidean distance is just a scalar product in disguise. The identity matrix I acts as the 'metric' — it tells us how to compute distances in flat space.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"metric_euclidean",0.35,1.73,9.3,1.18);

  panel(s,pres,0.35,3.0,4.55,1.48,C.teal); hdr(s,pres,0.35,3.0,4.55,C.teal,"The scalar product with g = I");
  txt(s,"⟨u,v⟩_I = uᵀ I v = u₁v₁ + u₂v₂ + u₃v₃\n\n|u|² = uᵀ I u = u₁² + u₂² + u₃²\n\nd(a,b)² = (a−b)ᵀ I (a−b)  =  Pythagoras ✓",
      0.43,3.28,4.37,1.12,{fs:10.5,col:C.offwhite,font:"Consolas"});

  panel(s,pres,5.1,3.0,4.55,1.48,C.gold); hdr(s,pres,5.1,3.0,4.55,C.gold,"Symmetries preserved by g = I");
  bul(s,["Rotations: R ᵀ I R = I — all rotations preserve the distance","Reflections: same property","The group of symmetries is O(3) — the orthogonal group","Translations also preserve d, giving the Euclidean group E(3)"],
      5.18,3.28,4.37,1.12,10.5);

  panel(s,pres,0.35,4.55,9.3,0.88,C.amber); hdr(s,pres,0.35,4.55,9.3,C.amber,"Key insight: the matrix g IS the geometry");
  txt(s,"Any real symmetric positive-definite matrix g defines a valid inner product and distance. Changing g changes the geometry. The Euclidean case g=I is just the simplest choice. The same scalar product structure xᵀg y applies to all the geometries below.",
      0.43,4.83,9.1,0.55,{fs:10.5});
}

// ── C-2: Lorentz metric ───────────────────────────────────────
{
  const s = cSlide(pres,"Lorentz (Minkowski) Distance: Spacetime Intervals","METRIC TENSORS · LORENTZ");
  txt(s,"Replace I with η = diag(1,−1,−1,−1). The resulting 'distance' is the spacetime interval of special relativity — it can be positive, zero (light-like), or negative.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"metric_lorentz",0.35,1.73,9.3,1.42);

  panel(s,pres,0.35,3.25,4.55,2.18,C.red); hdr(s,pres,0.35,3.25,4.55,C.red,"Three types of spacetime interval");
  bul(s,["ds² > 0  (time-like): causally connected events. A massive particle can travel between them. |ds| = proper time elapsed on the particle's clock.",
         "ds² = 0  (light-like / null): events connected by a light ray. Photons travel on these paths. No proper time elapses.",
         "ds² < 0  (space-like): events that cannot influence each other. No physical signal can connect them. |ds| = proper length in rest frame."],
      0.43,3.55,4.37,1.8,10.5);

  panel(s,pres,5.1,3.25,4.55,2.18,C.amber); hdr(s,pres,5.1,3.25,4.55,C.amber,"Same scalar-product structure");
  txt(s,"Lorentz inner product:\n⟨u,v⟩_η = uᵀ η v\n             = u⁰v⁰ − u¹v¹ − u²v² − u³v³\n\nThis looks identical to the projective incidence\nscalar product ℓ·x — just a bilinear form with\na specific matrix. The geometry is different but\nthe algebraic machinery is the same.\n\nLorentz boosts Λ satisfy: Λᵀ η Λ = η\n(analogous to Rᵀ I R = I for rotations).",
      5.18,3.55,4.37,1.8,{fs:10.5,col:C.offwhite,font:"Consolas"});
}

// ── C-3: Metric tensor on a 2D surface ───────────────────────
{
  const s = cSlide(pres,"Metric Tensor on a Curved 2D Surface Embedded in 3D","METRIC TENSORS · SURFACE");
  txt(s,"A 2D surface embedded in 3D inherits a metric from the ambient Euclidean space. The metric tensor g_ij(u,v) encodes how distances in the surface relate to the coordinate changes (du, dv).",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"metric_tensor_def",0.35,1.73,9.3,0.75);
  fImg(s,"metric_sphere",    0.35,2.54,9.3,0.95);

  // Sphere diagram
  const sx=0.38, sy=3.58, sw=4.25, sh=1.95;
  s.addShape(pres.shapes.RECTANGLE,{x:sx,y:sy,w:sw,h:sh,fill:{color:"0A1628"},line:{color:C.teal,width:1}});
  s.addText("Sphere — coordinates (θ,φ)",{x:sx+0.08,y:sy+0.06,w:sw-0.16,h:0.22,fontSize:9,bold:true,color:C.teal,fontFace:"Calibri",align:"center"});
  // Draw sphere ellipse
  s.addShape(pres.shapes.OVAL,{x:sx+0.4,y:sy+0.35,w:1.6,h:1.45,fill:{color:C.teal,transparency:82},line:{color:C.teal,width:1.5}});
  // Meridian
  s.addShape(pres.shapes.OVAL,{x:sx+0.4,y:sy+0.35,w:0.55,h:1.45,fill:{color:"0A1628",transparency:0},line:{color:C.teal,width:1,dashType:"dash"}});
  // Parallels
  s.addShape(pres.shapes.OVAL,{x:sx+0.42,y:sy+1.0,w:1.55,h:0.38,fill:{color:"0A1628",transparency:0},line:{color:C.gold,width:1,dashType:"dash"}});
  // Labels
  s.addText("θ",{x:sx+1.48,y:sy+0.52,w:0.25,h:0.28,fontSize:12,bold:true,color:C.gold,fontFace:"Georgia"});
  s.addText("φ",{x:sx+0.52,y:sy+1.2,w:0.25,h:0.28,fontSize:12,bold:true,color:C.accent1,fontFace:"Georgia"});
  s.addText("R",{x:sx+0.95,y:sy+1.6,w:0.25,h:0.28,fontSize:12,bold:true,color:C.white,fontFace:"Georgia"});
  // Formula box
  s.addText("g = R²[1  0 ; 0  sin²θ]\n\nds² = R²(dθ² + sin²θ dφ²)\n\nAt equator (θ=π/2): ds² = R²(dθ²+dφ²)\nAt pole (θ→0):       dφ becomes irrelevant",{x:sx+2.2,y:sy+0.34,w:1.9,h:1.55,fontSize:9.5,color:C.accent3,fontFace:"Consolas"});

  panel(s,pres,4.75,3.58,5.0,1.95,C.gold); hdr(s,pres,4.75,3.58,5.0,C.gold,"Computing g from the embedding");
  txt(s,"Given r(θ,φ) = R(sinθcosφ, sinθsinφ, cosθ) ∈ ℝ³:\n\n∂r/∂θ = R(cosθcosφ, cosθsinφ, −sinθ)\n∂r/∂φ = R(−sinθsinφ, sinθcosφ, 0)\n\ng_θθ = (∂r/∂θ)·(∂r/∂θ) = R²\ng_φφ = (∂r/∂φ)·(∂r/∂φ) = R²sin²θ\ng_θφ = (∂r/∂θ)·(∂r/∂φ) = 0\n\n→ g = R²diag(1, sin²θ)  ✓",
      4.83,3.86,4.82,1.58,{fs:9.5,col:C.offwhite,font:"Consolas"});
}

// ── C-4: Inner product from g ─────────────────────────────────
{
  const s = cSlide(pres,"General Inner Product, Lengths and Angles via g","METRIC TENSORS · INNER PRODUCT");
  txt(s,"Once we have the metric tensor g, we can define all of geometry: inner products, lengths, angles, and distances — all via the same scalar-product formula with g replacing I.",
      0.35,1.12,9.3,0.55,{fs:12});
  fImg(s,"metric_inner_product",0.35,1.73,9.3,0.68);

  const concepts=[
    {t:"Length of a vector",c:C.accent1,b:"On the sphere with g=R²diag(1,sin²θ):\n|dθ ê_θ| = R dθ   (a step in latitude)\n|dφ ê_φ| = R sinθ dφ  (shorter near poles!)"},
    {t:"Angle between vectors",c:C.teal,b:"cosα = ⟨u,v⟩_g / (|u|_g |v|_g)\nOn sphere: coordinate lines θ=const and φ=const are orthogonal (g_θφ=0) → g is diagonal ✓"},
    {t:"Geodesic (shortest path)",c:C.gold,b:"Minimise ∫ds = ∫√(g_ij u'ⁱ u'ʲ) dt\nOn sphere: great circles. On flat plane: straight lines. The metric determines 'straight'."},
    {t:"Gaussian curvature",c:C.amber,b:"K = −(1/√g) ∂/∂u[√g Γ] — derived from g\nSphere: K = 1/R². Flat plane: K = 0. g encodes everything about intrinsic geometry."},
  ];
  concepts.forEach((c,i)=>{
    const x=0.35+(i%2)*4.85, y=2.5+Math.floor(i/2)*1.55;
    panel(s,pres,x,y,4.6,1.45,c.c); hdr(s,pres,x,y,4.6,c.c,c.t);
    txt(s,c.b,x+0.1,y+0.32,4.38,1.06,{fs:10.5,col:C.offwhite,font:"Consolas"});
  });
  s.addShape(pres.shapes.RECTANGLE,{x:0.35,y:5.6,w:9.3,h:0.0,fill:{color:C.mid},line:{color:C.mid,width:0}});
}

// ── C-5: Unifying picture ─────────────────────────────────────
{
  const s = cSlide(pres,"The Unifying Picture: Scalar Products Everywhere","METRIC TENSORS · UNIFICATION");
  txt(s,"The scalar product — a bilinear form defined by a matrix g — appears identically in projective geometry (incidence), in Euclidean geometry, in special relativity, and on curved surfaces. Only the matrix changes.",
      0.35,1.12,9.3,0.6,{fs:12});

  const table=[
    ["Geometry","Matrix g","Scalar product","What it measures","Symmetry group"],
    ["Projective ℙ²","any g","ℓᵀg x = 0","Incidence (point on line)","GL(3,ℝ) homographies"],
    ["Euclidean ℝⁿ","I (identity)","uᵀI v = Σ uᵢvᵢ","Flat distance, angle","O(n) rotations + translations"],
    ["Minkowski ℝ³ˡ¹","diag(1,−1,−1,−1)","uᵀη v = u⁰v⁰−Σ uⁱvⁱ","Spacetime interval","SO(3,1) Lorentz group"],
    ["Sphere S²(R)","R²diag(1,sin²θ)","g_ij uⁱ vʲ","Arc length on sphere","SO(3) rotations"],
    ["General surface","g_ij(u,v) from ∂r/∂uⁱ","g_ij uⁱ vʲ","Curved-surface distance","Diffeomorphisms preserving g"],
  ];
  const colW=[1.9,1.9,2.55,2.1,1.5], rowH=0.52;
  const tx=0.35, ty=1.82;
  // Header
  table[0].forEach((h,j)=>{
    let cx=tx; for(let k=0;k<j;k++) cx+=colW[k];
    s.addShape(pres.shapes.RECTANGLE,{x:cx,y:ty,w:colW[j],h:0.3,fill:{color:C.purple},line:{color:C.purple,width:0}});
    s.addText(h,{x:cx+0.04,y:ty+0.02,w:colW[j]-0.08,h:0.26,fontSize:8.5,bold:true,color:C.white,fontFace:"Calibri"});
  });
  const rowCols=[C.accent1,C.teal,C.red,C.amber,C.green];
  table.slice(1).forEach((row,i)=>{
    row.forEach((cell,j)=>{
      let cx=tx; for(let k=0;k<j;k++) cx+=colW[k];
      const ry=ty+0.3+i*rowH;
      s.addShape(pres.shapes.RECTANGLE,{x:cx,y:ry,w:colW[j],h:rowH-0.04,fill:{color:j===0?rowCols[i]:C.panel},line:{color:C.mid,width:0.4}});
      s.addText(cell,{x:cx+0.04,y:ry+0.03,w:colW[j]-0.08,h:rowH-0.1,fontSize:j===0?9.5:9,bold:j===0,color:j===0?C.dark:C.offwhite,fontFace:j>=2?"Consolas":"Calibri"});
    });
  });
}

// ═══════════════════════════════════════════════════════════════
//  REFERENCES, EXERCISES & PROBLEM SETS
// ═══════════════════════════════════════════════════════════════
refSlide(pres,"References, Exercises & Problem Sets","PROJECTIVE GEOMETRY · REFERENCES",
  ["Semple & Kneebone, Algebraic Projective Geometry (1952) — Oxford. The classical rigorous introduction.",
   "Coxeter, The Real Projective Plane, 3rd ed. (1993) — Springer. Elegant synthetic treatment.",
   "Hartley & Zisserman, Multiple View Geometry in Computer Vision, 2nd ed. (2004) — Cambridge. Ch. 1–4: homogeneous coords and homographies.",
   "Needham, Visual Complex Analysis — Ch. 3: Möbius transformations as projective maps of ℙ¹.",
   "Strang, Linear Algebra and its Applications — dot products, projections, symmetric matrices."],
  ["Misner, Thorne & Wheeler, Gravitation (1973) — Freeman. Box 2.1–2.4: metric tensors, line elements.",
   "Carroll, Spacetime and Geometry (2004) — Pearson. Ch. 1–2: special relativity, metric, Lorentz group.",
   "do Carmo, Differential Geometry of Curves and Surfaces (1976) — Prentice Hall. Ch. 1–2: first fundamental form = metric tensor.",
   "Faugeras, Three-Dimensional Computer Vision (1993) — MIT Press. Ch. 3: projective geometry applied to cameras.",
   "Penrose & Rindler, Spinors and Space-Time Vol. 1 — Cambridge. Abstract index notation and metric geometry."],
  ["[HS] Show that (1:2:1), (3:4:1) lie on the line (2:−1:0). Verify ℓ·x=0.",
   "[HS] Find the projective intersection of y=2x+1 and y=−x+4. Express both lines as row vectors and compute the cross product.",
   "[BSc] Prove the dual of Pappus' theorem by swapping 'point' and 'line' in the statement and the proof.",
   "[BSc] Show that for a homography H ∈ GL(3,ℝ), the cross-ratio (ABCD) = (A'B'C'D') is preserved.",
   "[BSc] Compute the metric tensor for the cylinder r(θ,z)=(cosθ, sinθ, z). Show that ds² = dθ²+dz² (flat!).",
   "[MSc] Derive the geodesic equations on the sphere from the metric g=R²diag(1,sin²θ). Show that great circles are solutions.",
   "[MSc] Show that the Lorentz boost Λ(β) with velocity β satisfies Λᵀ η Λ = η. What is the geometric meaning?",
   "[MSc Project] Implement a projective homography estimator in Python using the DLT algorithm. Unwarp a photographed planar surface using 4-point correspondences."]);

// ─────────────────────────────────────────────────────────────
pres.writeFile({fileName:"/home/claude/lecture_00b_projective.pptx"})
  .then(()=> console.log("✓ lecture_00b_projective.pptx"))
  .catch(e => console.error(e));
