/**
 * shared/build_concept_slides_all.js
 * ===================================
 * Builds the concept slide deck for any lecture L02-L12.
 * Uses the same two-column layout as L01:
 *   LEFT  (42%): LaTeX-rendered explanation (renderedCard)
 *   RIGHT (56%): matplotlib geometric diagram
 *
 * CLI:
 *   node shared/build_concept_slides_all.js \
 *        --lecture L05 \
 *        --data  build/L05/lecture_content.json \
 *        --diag  build/L05/diagrams \
 *        --frm   build/L05/formulas \
 *        --lookup build/L05/formula_lookup.json \
 *        --out   build/L05/L05_concepts.pptx
 */

"use strict";
const path   = require("path");
const fs     = require("fs");
const crypto = require("crypto");

const {
  initPres, addSlide, slideHeader, slideFooter,
  accentCard, levelBadge, lectureAccent,
  C, W, H, FONT_HEAD, FONT_BODY, makeShadow,
} = require("./slide_helpers");
const { renderedCard } = require("./rendered_card");

const TIER_COLOR = { HS:C.hs, BegUG:C.begug, AdvUG:C.advug, MSc:C.msc, PhD:C.phd };
const TIER_LABEL = {
  HS:"High School", BegUG:"Beginning Undergraduate",
  AdvUG:"Advanced Undergraduate", MSc:"Master's Level", PhD:"PhD Level",
};

// ── image helpers ─────────────────────────────────────────────────────────────
function imgB64(p) {
  if (!p || !fs.existsSync(p)) return null;
  return "image/png;base64," + fs.readFileSync(p).toString("base64");
}
function placeDiagram(slide, diagPath, x, y, maxW, maxH) {
  const data = imgB64(diagPath);
  if (!data) return;
  try { slide.addImage({ data, x, y, w:maxW, h:maxH,
        sizing:{ type:"contain", w:maxW, h:maxH } }); }
  catch(e) {}
}
function findDiag(diagDir, key) {
  if (!diagDir) return null;
  const candidates = [
    path.join(diagDir, key+".png"),
    path.join(diagDir, key.replace(/-/g,"_")+".png"),
  ];
  for (const c of candidates) if (fs.existsSync(c)) return c;
  // Try glob: any file that contains the key
  try {
    const files = fs.readdirSync(diagDir).filter(f => f.includes(key) && f.endsWith(".png"));
    if (files.length) return path.join(diagDir, files[0]);
  } catch(e) {}
  return null;
}

// ── resolve formula PNG from lookup cache ─────────────────────────────────────
function makeLookup(frmDir, lookupPath) {
  try {
    if (lookupPath && fs.existsSync(lookupPath))
      return JSON.parse(fs.readFileSync(lookupPath,"utf8"));
  } catch(e) {}
  // Build from cache.json
  const cachePath = path.join(frmDir, "cache.json");
  if (!fs.existsSync(cachePath)) return {};
  try {
    const cache = JSON.parse(fs.readFileSync(cachePath,"utf8"));
    const out = {};
    for (const [k,v] of Object.entries(cache)) {
      if (v && v.path) out[k] = v.path;
    }
    return out;
  } catch(e) { return {}; }
}

function resolveSpec(spec, frmLookup) {
  return spec.map(item => {
    if (item.type !== "formula_latex") return item;
    const latex = item.latex || "";
    const key   = crypto.createHash("md5").update(latex).digest("hex");
    const fpath = frmLookup[key];
    if (fpath && fs.existsSync(fpath))
      return { type:"formula", path:fpath, tex:latex };
    // strip math markers for fallback text
    const plain = latex.replace(/^\$/,"").replace(/\$$/,"")
                       .replace(/\\[a-zA-Z]+/g, m=>m.slice(1))
                       .replace(/[{}^_]/g,"");
    return { type:"text", text:plain };
  });
}

// ── per-lecture concept slide definitions ─────────────────────────────────────
function getConceptSlides(lectureNum, lectureData) {
  const title  = lectureData.title  || lectureNum;
  const levels = lectureData.levels || {};
  const prefix = lectureNum.toLowerCase() + "_";

  const CONCEPTS = {
    L02: [
      { tier:"HS",    title:"Bras as Row Vectors", subtitle:"⟨φ| is the transpose-conjugate of |φ⟩",
        diagKey:prefix+"bra_dot_product",
        explainSpec:[
          {type:"header",text:"THE BRA IS A DUAL VECTOR"},
          {type:"text",  text:"Every ket |ψ⟩ has a corresponding bra ⟨ψ|. In a finite basis, the bra is the conjugate-transpose (row vector) of the ket (column vector)."},
          {type:"formula_latex",latex:"$|\psi\rangle \to (c_1,c_2)^T, \quad \langle\psi| = (c_1^*, c_2^*)$"},
          {type:"formula_latex",latex:"$\\langle\\phi|\\psi\\rangle = \\sum_n \\phi_n^* \\psi_n \\in \\mathbb{C}$"},
          {type:"spacer"},
          {type:"header",text:"GEOMETRIC MEANING"},
          {type:"text",  text:"The inner product ⟨φ|ψ⟩ is the complex dot product — the projection of |ψ⟩ onto |φ⟩."},
          {type:"formula_latex",latex:"$|\\langle\\phi|\\psi\\rangle|^2 = \\text{transition probability}$"},
        ]},
      { tier:"BegUG", title:"Gram-Schmidt Process", subtitle:"Building an orthonormal basis from any linearly independent set",
        diagKey:prefix+"gram_schmidt",
        explainSpec:[
          {type:"header",text:"GRAM-SCHMIDT ORTHOGONALISATION"},
          {type:"text",  text:"Given any set of linearly independent vectors, Gram-Schmidt builds an orthonormal basis step by step:"},
          {type:"formula_latex",latex:"$|e_1\\rangle = v_1/\\|v_1\\|$"},
          {type:"formula_latex",latex:"$|e_2\\rangle \\propto |v_2\\rangle - \\langle e_1|v_2\\rangle|e_1\\rangle$"},
          {type:"spacer"},
          {type:"header",text:"WHY THIS MATTERS"},
          {type:"text",  text:"Any Hilbert space has an orthonormal basis. Gram-Schmidt proves it constructively — it converts any independent set into one with ⟨eᵢ|eⱼ⟩ = δᵢⱼ."},
          {type:"formula_latex",latex:"$\\langle e_i|e_j\\rangle = \\delta_{ij}$"},
        ]},
      { tier:"AdvUG", title:"Riesz Representation Theorem", subtitle:"Every bounded linear functional on ℋ is an inner product",
        diagKey:prefix+"riesz_representation",
        explainSpec:[
          {type:"header",text:"RIESZ REPRESENTATION THEOREM"},
          {type:"text",  text:"Let f: ℋ → ℂ be a bounded linear functional. Then there exists a unique |φ_f⟩ ∈ ℋ such that:"},
          {type:"formula_latex",latex:"$f(|\\psi\\rangle) = \\langle\\phi_f|\\psi\\rangle \\quad \\forall\\,|\\psi\\rangle \\in \\mathcal{H}$"},
          {type:"spacer"},
          {type:"header",text:"CONSEQUENCE: H ≅ H*"},
          {type:"text",  text:"The map |φ⟩ ↦ ⟨φ| is an anti-linear isomorphism between ℋ and its dual ℋ*. This is WHY bra-ket notation works — every bra is a ket in disguise."},
          {type:"formula_latex",latex:"$\\mathcal{H} \\ni |\\phi\\rangle \\longleftrightarrow \\langle\\phi| \\in \\mathcal{H}^*$"},
          {type:"text",  text:"Anti-linear: ⟨cφ| = c*⟨φ| (note the conjugate). This reflects the sesquilinear nature of the inner product."},
        ]},
      { tier:"MSc",   title:"Dual Space as Functionals", subtitle:"ℋ* = {bounded linear maps ℋ → ℂ}",
        diagKey:prefix+"dual_space_functionals",
        explainSpec:[
          {type:"header",text:"THE DUAL SPACE ℋ*"},
          {type:"text",  text:"The dual space ℋ* consists of all bounded linear functionals f: ℋ → ℂ. Each bra ⟨φ| is such a functional:"},
          {type:"formula_latex",latex:"$\\langle\\phi|: |\\psi\\rangle \\longmapsto \\langle\\phi|\\psi\\rangle \\in \\mathbb{C}$"},
          {type:"spacer"},
          {type:"header",text:"NORM ON ℋ*"},
          {type:"formula_latex",latex:"$\\|\\langle\\phi|\\| = \\sup_{\\|\\psi\\|=1}|\\langle\\phi|\\psi\\rangle| = \\|\\phi\\|$"},
          {type:"text",  text:"By Riesz, ‖⟨φ|‖ = ‖|φ⟩‖ — the dual norm equals the original norm. ℋ and ℋ* are isometrically anti-isomorphic."},
          {type:"spacer"},
          {type:"header",text:"WHY BOUNDED?"},
          {type:"text",  text:"Unbounded functionals exist on infinite-dimensional spaces but are not continuous. Physics requires continuous operations — hence we restrict to bounded (= continuous) functionals."},
        ]},
      { tier:"PhD",   title:"Reflexivity and Bidual", subtitle:"ℋ ≅ ℋ** — Hilbert spaces are reflexive",
        diagKey:prefix+"dual_space_functionals",
        explainSpec:[
          {type:"header",text:"REFLEXIVITY OF HILBERT SPACES"},
          {type:"text",  text:"For a Hilbert space ℋ, the bidual ℋ** = (ℋ*)* is naturally isometric to ℋ itself. This is reflexivity."},
          {type:"formula_latex",latex:"$\\mathcal{H} \\cong \\mathcal{H}^{**}$"},
          {type:"spacer"},
          {type:"header",text:"IMPLICATION"},
          {type:"text",  text:"Every element of ℋ** is evaluation at some point of ℋ. In physics: there are no 'exotic' second-order duals — the double bra ⟨⟨φ|| is just |φ⟩ back."},
          {type:"spacer"},
          {type:"header",text:"COMPARISON: BANACH SPACES"},
          {type:"text",  text:"General Banach spaces need not be reflexive (example: L¹ is not). Reflexivity of Hilbert spaces is a deep consequence of the parallelogram law and completeness."},
          {type:"formula_latex",latex:"$\\|x+y\\|^2 + \\|x-y\\|^2 = 2(\\|x\\|^2+\\|y\\|^2) \\implies \\text{reflexive}$"},
        ]},
    ],

    L03: [
      { tier:"HS",    title:"Operators as Transformations", subtitle:"Â|ψ⟩ maps one vector to another",
        diagKey:prefix+"matrix_operator_2d",
        explainSpec:[
          {type:"header",text:"WHAT IS A QUANTUM OPERATOR?"},
          {type:"text",  text:"An operator Â takes a state |ψ⟩ and produces a new state Â|ψ⟩. In 2D it is exactly a matrix acting on a column vector."},
          {type:"formula_latex",latex:"$\\hat{A}|\\psi\\rangle = |\\psi'\\rangle$"},
          {type:"text",  text:"The diagram shows the unit circle (all normalised states) being mapped to an ellipse by the operator — stretching some directions and squeezing others."},
          {type:"spacer"},
          {type:"header",text:"LINEARITY IS THE KEY"},
          {type:"formula_latex",latex:"$\\hat{A}(\\alpha|\\psi\\rangle + \\beta|\\phi\\rangle) = \\alpha\\hat{A}|\\psi\\rangle + \\beta\\hat{A}|\\phi\\rangle$"},
          {type:"text",  text:"Linearity means superposition is preserved. This is why quantum mechanics is a linear theory."},
        ]},
      { tier:"BegUG", title:"Hermitian Operators", subtitle:"Â = Â† — real eigenvalues, observable quantities",
        diagKey:prefix+"hermitian_symmetry",
        explainSpec:[
          {type:"header",text:"THE HERMITIAN CONDITION"},
          {type:"formula_latex",latex:"$\\hat{A} = \\hat{A}^\\dagger \\iff \\langle\\phi|\\hat{A}|\\psi\\rangle = \\langle\\psi|\\hat{A}|\\phi\\rangle^*$"},
          {type:"text",  text:"Hermitian operators are the QM analogue of real symmetric matrices in 2D. The diagram shows a reflection — eigenvalues ±1 are real."},
          {type:"spacer"},
          {type:"header",text:"WHY HERMITIAN = OBSERVABLE"},
          {type:"text",  text:"Measurement outcomes must be real numbers. The eigenvalues of a Hermitian operator are always real:"},
          {type:"formula_latex",latex:"$\\hat{A}|a\\rangle = a|a\\rangle \\implies a = \\langle a|\\hat{A}|a\\rangle = \\langle a|\\hat{A}^\\dagger|a\\rangle^* = a^*$"},
          {type:"text",  text:"So a = a* — the eigenvalue is real. This is why Hermitian operators represent physical observables."},
        ]},
      { tier:"AdvUG", title:"Unitary Operators", subtitle:"Û†Û = Î — preserve all geometry",
        diagKey:prefix+"unitary_rotation",
        explainSpec:[
          {type:"header",text:"THE UNITARY CONDITION"},
          {type:"formula_latex",latex:"$\\hat{U}^\\dagger\\hat{U} = \\hat{I} \\iff \\langle\\hat{U}\\phi|\\hat{U}\\psi\\rangle = \\langle\\phi|\\psi\\rangle$"},
          {type:"text",  text:"Unitary operators preserve all inner products — all angles, lengths, and probabilities. They are the quantum analogue of rigid rotations in 2D."},
          {type:"spacer"},
          {type:"header",text:"PHYSICAL IMPORTANCE"},
          {type:"text",  text:"Time evolution is unitary (Û = e^{-iĤt/ℏ}). This guarantees probability conservation: if ⟨ψ|ψ⟩=1 at t=0, it stays 1 for all t."},
          {type:"formula_latex",latex:"$\\langle\\psi(t)|\\psi(t)\\rangle = \\langle\\psi_0|\\hat{U}^\\dagger\\hat{U}|\\psi_0\\rangle = 1$"},
          {type:"text",  text:"Wigner's theorem: all quantum symmetries are implemented by unitary (or antiunitary) operators."},
        ]},
      { tier:"MSc",   title:"Eigenvalue Geometry", subtitle:"Â|a⟩ = a|a⟩ — eigenvectors as special directions",
        diagKey:prefix+"eigenvalue_geometry",
        explainSpec:[
          {type:"header",text:"SPECTRAL DECOMPOSITION"},
          {type:"text",  text:"For a Hermitian operator Â with orthonormal eigenbasis {|aₙ⟩}:"},
          {type:"formula_latex",latex:"$\\hat{A} = \\sum_n a_n|a_n\\rangle\\langle a_n|$"},
          {type:"text",  text:"Each eigenvector is a special direction that Â only scales, not rotates. The eigenvalue aₙ is the scale factor."},
          {type:"spacer"},
          {type:"header",text:"SPECTRAL THEOREM"},
          {type:"text",  text:"Every Hermitian operator on a finite-dimensional Hilbert space (or bounded self-adjoint operator on infinite-dimensional ℋ) has a complete orthonormal eigenbasis."},
          {type:"formula_latex",latex:"$\\sum_n |a_n\\rangle\\langle a_n| = \\hat{I} \\quad (\\text{completeness})$"},
          {type:"text",  text:"For unbounded operators (x̂, p̂): need the spectral theorem for self-adjoint operators — eigenvectors live in the rigged Hilbert space Φ'."},
        ]},
      { tier:"PhD",   title:"Functional Calculus", subtitle:"f(Â) — applying functions to operators",
        diagKey:prefix+"eigenvalue_geometry",
        explainSpec:[
          {type:"header",text:"FUNCTIONAL CALCULUS"},
          {type:"text",  text:"Given f: ℝ → ℂ and a self-adjoint Â = ∫a dÊ(a), define:"},
          {type:"formula_latex",latex:"$f(\\hat{A}) = \\int f(a)\\,d\\hat{E}(a)$"},
          {type:"text",  text:"On the eigenbasis: f(Â)|aₙ⟩ = f(aₙ)|aₙ⟩. The function f is applied to the eigenvalues."},
          {type:"spacer"},
          {type:"header",text:"KEY EXAMPLES"},
          {type:"formula_latex",latex:"$e^{-i\\hat{H}t/\\hbar} = \\int e^{-iEt/\\hbar}\\,d\\hat{E}(E)$"},
          {type:"text",  text:"This gives time evolution. The spectral measure dÊ(E) is the resolution of identity for Ĥ."},
          {type:"spacer"},
          {type:"header",text:"DOMAIN ISSUES"},
          {type:"text",  text:"For unbounded Â, f(Â) may only be defined on a dense domain. The domain requires careful specification — f must be integrable with respect to the spectral measure."},
        ]},
    ],
  };

  // Generic concept slides for lectures without custom definitions
  function genericConceptSlides(num, data) {
    const lprefix = num.toLowerCase() + "_";
    return [
      { tier:"HS",    title:"Core Concept — High School",    subtitle:"Physical intuition and geometric picture",
        diagKey: lprefix + Object.keys(data.diagrams || {}).find(k=>k.startsWith(lprefix)) || lprefix+"diagram1",
        explainSpec:buildGenericSpec(data,'HS') },
      { tier:"BegUG", title:"Core Concept — Beginning UG",   subtitle:"Computational tools and bra-ket algebra",
        diagKey: lprefix + "diagram2",
        explainSpec:buildGenericSpec(data,'BegUG') },
      { tier:"AdvUG", title:"Core Concept — Advanced UG",    subtitle:"Proofs, derivations, geometric meaning",
        diagKey: lprefix + "diagram3",
        explainSpec:buildGenericSpec(data,'AdvUG') },
      { tier:"MSc",   title:"Core Concept — Master's Level", subtitle:"Structural results and symmetry",
        diagKey: lprefix + "diagram4",
        explainSpec:buildGenericSpec(data,'MSc') },
    ];
  }

  function buildGenericSpec(data, tier) {
    const td = (data.tiers || {})[tier] || {};
    const narrative = td.narrative || "";
    const levels    = (data.levels || {})[tier] || "";
    return [
      {type:"header", text:`${tier.toUpperCase()} LEVEL`},
      {type:"text",   text: narrative || levels || "See lecture notes for this tier's content."},
      {type:"spacer"},
      {type:"header", text:"KEY MATHEMATICAL CONTENT"},
      {type:"text",   text: levels || "Refer to the core concepts slide for the main formulas at this level."},
    ];
  }

  // Lecture-specific diagram key prefix
  const diagGroups = {
    L02: { keys:["bra_dot_product","gram_schmidt","riesz_representation","dual_space_functionals"] },
    L03: { keys:["matrix_operator_2d","hermitian_symmetry","unitary_rotation","eigenvalue_geometry"] },
    L04: { keys:["stern_gerlach_filter","projector_geometry","spectral_decomp","resolution_identity"] },
    L05: { keys:["basis_rotation_2d","matrix_representation","trace_invariant","similarity_transform"] },
    L06: { keys:["continuum_limit","delta_function","position_momentum","fourier_duality"] },
    L07: { keys:["uncertainty_spread","commutator_geometry","robertson_diagram","compatible_observables"] },
    L08: { keys:["unitary_flow","heisenberg_schrodinger","ehrenfest","exponential_steps"] },
    L09: { keys:["product_space_grid","entangled_vs_product","schmidt_decomp","partial_trace"] },
    L10: { keys:["bloch_sphere_spin","pauli_matrices","su2_rotation","angular_momentum_ladder"] },
    L11: { keys:["density_bloch","pure_vs_mixed","kraus_channel","decoherence"] },
    L12: { keys:["gelfand_triple","distributional_delta","spectral_measure","deficiency_indices"] },
  };

  if (CONCEPTS[lectureNum]) return CONCEPTS[lectureNum];

  // Build from diagram keys + tier data
  const dg = diagGroups[lectureNum] || { keys:[] };
  const tiers = ["HS","BegUG","AdvUG","MSc"];
  return dg.keys.slice(0,4).map((key,i) => {
    const tier = tiers[i] || "AdvUG";
    const tc   = TIER_COLOR[tier];
    const td   = (lectureData.tiers || {})[tier] || {};
    const narrative = td.narrative || (lectureData.levels||{})[tier] || "";
    const diagKey = prefix + key;
    return {
      tier,
      title: key.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase()),
      subtitle: `${TIER_LABEL[tier]} — ${title}`,
      diagKey,
      explainSpec: [
        {type:"header", text: tier + " — " + key.replace(/_/g," ").toUpperCase()},
        {type:"text",   text: narrative.slice(0,300) || "See lecture notes for detailed content."},
        {type:"spacer"},
        {type:"header", text:"GEOMETRIC INTERPRETATION"},
        {type:"text",   text:"The diagram on the right shows the 2D/3D geometric analogy for this concept. Use it to build physical intuition before working through the formalism."},
        ...((td.concept_questions||[]).slice(0,2).map(q=>({type:"text",text:"• "+q.slice(0,120)}))),
      ],
    };
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN BUILD
// ═════════════════════════════════════════════════════════════════════════════

async function buildConceptSlides(lectureNum, dataPath, diagDir, frmDir, lookupPath, outPath) {
  const D      = JSON.parse(fs.readFileSync(dataPath,"utf8"));
  const lecIdx = parseInt(lectureNum.replace("L",""),10)-1;
  const accent = lectureAccent(lecIdx);
  const pres   = initPres(`${lectureNum} Deep Concept Slides`);
  const lookup = makeLookup(frmDir, lookupPath);

  const concepts = getConceptSlides(lectureNum, D);
  console.log(`  Building ${concepts.length} concept slides for ${lectureNum}`);

  // ── Cover ──────────────────────────────────────────────────────────────────
  {
    const s = addSlide(pres);
    s.addShape(pres.ShapeType.ellipse,{x:9.5,y:-1.8,w:5.5,h:5.5,
      fill:{color:accent,transparency:91},line:{color:accent,transparency:85,width:1}});
    s.addText(lectureNum,{x:0.6,y:1.4,w:2,h:0.65,fontSize:28,bold:true,color:accent,fontFace:FONT_HEAD,margin:0});
    s.addText("Deep Concept Slides",{x:0.6,y:2.1,w:9,h:1.3,fontSize:38,bold:true,color:C.text,fontFace:FONT_HEAD,margin:0});
    s.addText(D.title||lectureNum,{x:0.6,y:3.5,w:9,h:0.5,fontSize:16,color:C.accent3,fontFace:FONT_BODY,margin:0});
    s.addText("One slide per core concept  ·  Full explanation  ·  Geometric diagram",
      {x:0.6,y:4.2,w:9,h:0.35,fontSize:11,color:C.textSub,fontFace:FONT_BODY,margin:0});
    const TIERS=[["HS",C.hs],["BegUG",C.begug],["AdvUG",C.advug],["MSc",C.msc],["PhD",C.phd]];
    TIERS.forEach(([t,c],i)=>levelBadge(s,0.6+i*0.88,4.8,t,c));
    s.addText(`${concepts.length} concept slides`,
      {x:0.6,y:5.4,w:9,h:0.3,fontSize:10,color:C.textSub,fontFace:FONT_BODY,margin:0});
    slideFooter(s,`QM: Bra-Ket — ${lectureNum} Concepts`,lectureNum);
  }

  // ── Tier dividers + concept slides ────────────────────────────────────────
  let lastTier = null;
  for (const concept of concepts) {
    const tc = TIER_COLOR[concept.tier] || accent;
    const tl = TIER_LABEL[concept.tier] || concept.tier;

    // Tier divider
    if (concept.tier !== lastTier) {
      lastTier = concept.tier;
      const sd = addSlide(pres);
      sd.addShape(pres.ShapeType.rect,{x:0,y:0,w:W,h:H,fill:{color:tc},line:{color:tc}});
      sd.addText(concept.tier,{x:1,y:2.0,w:11,h:1.2,fontSize:72,bold:true,
        color:"000000",fontFace:FONT_HEAD,transparency:25,align:"center"});
      sd.addText(tl,{x:1,y:3.4,w:11,h:0.7,fontSize:28,color:"000000",
        fontFace:FONT_HEAD,transparency:20,align:"center"});
      const tierSlides = concepts.filter(c=>c.tier===concept.tier);
      sd.addText(tierSlides.map((c,i)=>`${i+1}. ${c.title}`).join("\n"),
        {x:2,y:4.3,w:9,h:2.5,fontSize:13,color:"000000",
         fontFace:FONT_BODY,transparency:25,align:"center"});
      slideFooter(sd,`QM: ${lectureNum} — ${tl}`,lectureNum);
    }

    // Concept slide
    const s = addSlide(pres);
    slideHeader(s,`${lectureNum} — ${concept.tier}: ${concept.title}`,
      concept.subtitle,lectureNum,tc);

    const explLeft  = 0.3;
    const explW     = 5.5;
    const diagLeft  = 6.05;
    const diagW     = W - diagLeft - 0.3;
    const contentY  = 0.92;
    const contentH  = H - contentY - 0.55;

    // Resolve formulas in spec
    const spec = resolveSpec(concept.explainSpec || [], lookup);

    renderedCard(s, pres, spec, {
      x:explLeft, y:contentY, w:explW, h:contentH,
      accent:tc, title:concept.title.toUpperCase(), titleSz:10.5,
    });

    // Diagram
    const diagPath = findDiag(diagDir, concept.diagKey);
    if (diagPath) {
      placeDiagram(s, diagPath, diagLeft, contentY, diagW, contentH);
    } else {
      accentCard(s,{x:diagLeft,y:contentY,w:diagW,h:contentH,
        accent:tc,title:"DIAGRAM",body:`Diagram: ${concept.diagKey}\n(not found)`,
        titleSz:10,bodySz:9});
    }

    slideFooter(s,`QM: ${lectureNum} — ${concept.tier} · ${concept.title}`,
      `${lectureNum} · ${concept.tier}`);
  }

  await pres.writeFile({ fileName: outPath });
  const n = pres._slides ? pres._slides.length : "?";
  console.log(`  ✓ ${lectureNum} concept slides (${n} slides): ${outPath}`);
}

// ── CLI ───────────────────────────────────────────────────────────────────────
if (require.main === module) {
  const args  = process.argv.slice(2);
  const get   = f => { const i=args.indexOf(f); return i>=0?args[i+1]:null; };
  const lec   = get("--lecture") || "L02";
  const data  = get("--data")    || `build/${lec}/lecture_content.json`;
  const diag  = get("--diag")    || `build/${lec}/diagrams`;
  const frm   = get("--frm")     || `build/${lec}/formulas`;
  const look  = get("--lookup")  || `build/${lec}/formula_lookup.json`;
  const out   = get("--out")     || `build/${lec}/${lec}_concepts.pptx`;

  buildConceptSlides(lec, data, diag, frm, look, out)
    .catch(e => { console.error(e); process.exit(1); });
}

module.exports = buildConceptSlides;
