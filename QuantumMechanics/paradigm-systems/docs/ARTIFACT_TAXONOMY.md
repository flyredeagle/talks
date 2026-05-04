# Assessment Artifact Taxonomy — Module I.4

## Overview

Every lecture in Module I.4 ships **92 assessment items** across **14 types**
organised in three tracks. This document defines each type, its format, duration,
and rubric weights.

---

## Undergraduate Track (Tiers 1–3)

### SCQU — Simple Concept Questions (UG) ×10

**Purpose:** Fast check that the student has the right mental model.  
**Format:** Mix of multiple-choice (4), true/false + 1-sentence justification (4), short answer (2).  
**Duration:** 15–20 minutes (in-class warm-up or pre-lecture).  
**Tier routing:**
- HS: fully qualitative; no equations required
- BegUG: qualitative + very short computations
- AdvUG: includes "near-equivalent option discrimination"

**Rubric:** 2 pts each (1.5 correct answer + 0.5 justification) → 20 pts total.

---

### CCQU — Complex Concept Questions (UG) ×10

**Purpose:** Assess deeper understanding: causation, failure modes, logical structure.  
**Format:** "explain why" (4), "what would change if…" (3), "identify the flaw in this argument" (3).  
**Duration:** 25–35 minutes (homework or tutorial).  
**Tier routing:**
- BegUG: trace through an argument step by step
- AdvUG: find a counterexample or identify the hidden assumption

**Rubric:** 2 pts each (1.0 key point + 1.0 argument/example) → 20 pts total.

---

### SPSU — Simple Problem Set (UG) ×10

**Purpose:** Build procedural fluency.  
**Format:** 10 problems, 1–5 steps each. Three parts:
- Part A: Mechanics (4 problems) — compute eigenvalues, expectation values, etc.
- Part B: Interpretation (3 problems) — what does the computed number mean?
- Part C: Translation (3 problems) — convert between representations/formulations

**Duration:** 60–90 minutes.  
**Tier routing:** HS = arithmetic; BegUG = components + probabilities; AdvUG = representation-independence

**Rubric:** Result 60%, Method 30%, Interpretation 10%.

---

### CPSU — Complex Problem Set (UG) ×5, **4-layer format**

**Purpose:** Assess structural mastery through proofs and multi-step derivations.  
**Format:** 5 problems, multi-part (a)(b)(c); proof/derivation based; 3–6 hours total.

**4-Layer Packaging:**
1. `ex##_problem.tex` — Problem statement only (no hints)
2. `ex##_hints.tex` — Scaffolded hints (Layer 2)
3. `ex##_adv_hints.tex` — Structural hints and alternative approaches (Layer 3)
4. `ex##_solution.tex` — Full derivation + commentary + common pitfalls (Layer 4)

**Rubric:** Assumptions 15%, Proof structure 45%, Algebra 25%, Insight 15%.

---

### SPJU — Simple Project (UG) ×1, **4-layer format**

**Purpose:** Hands-on transfer — build something that uses the formalism.  
**Scope:** 2–6 hours; structured; well-scaffolded.  
**Deliverable:** Code/worksheet + 1–3 page report.  
**Rubric:** Correctness 40%, Verification tests 25%, Clarity 25%, Reproducibility 10%.

---

### CPJU — Complex Project (UG) ×1

**Purpose:** Synthesis and conceptual transfer across topics.  
**Scope:** 8–15 hours; open-ended but guided.  
**Deliverable:** 5–8 page report + code appendix.  
**Rubric:** Technical 30%, Synthesis 35%, Depth 25%, Originality 10%.

---

## Graduate Track (Tiers 4–5)

### SCQG — Simple Concept Questions (Grad) ×10

**Format:** Short statement (4), true/false + proof sketch (3), "identify the precise error" (3).  
**Duration:** 20–25 minutes.  
**Tier routing:** MSc = standard results; PhD = domain/boundedness conditions, named theorems.  
**Rubric:** same as SCQU.

---

### CCQG — Complex Concept Questions (Grad) ×10

**Format:** "distinguish and explain" (4), "what fails without X" (3), "connect these two results" (3).  
**Duration:** 35–50 minutes.  
**Tier routing:** MSc = conceptual connections; PhD = mathematical precision and counterexamples.  
**Rubric:** same as CCQU.

---

### SPSG — Simple Problem Set (Grad) ×10

**Format:** Part A: operator mechanics (4), Part B: rigorous translation (3), Part C: symmetry & invariance (3).  
**Tier routing:** MSc = density-matrix formalism + trace-class conditions; PhD = domain checks + functional calculus.  
**Rubric:** Result + conditions 50%, Method 35%, Meaning 15%.

---

### CPSG — Complex Problem Set (Grad) ×5, **4-layer format**

**Format:** Multi-part; 5–10 hours total; no guidance scaffolding at Layer 1.  
Problems at graduate proof standard (functional analysis level).  
**Rubric:** Hypotheses 15%, Proof structure 40%, Analysis 30%, Insight 15%.

---

### SPJG — Simple Projects (Grad) ×5

**Scope:** 3–8 hours each; structured; each independently completable.  
**Deliverable:** Tech note (2–4 pp) + code.  
**Rubric:** Correctness 40%, Rigour 25%, Clarity 25%, Reproducibility 10%.

---

### CPJG — Complex Projects (Grad) ×5

**Scope:** 10–20 hours each; open-ended; requires graduate synthesis.  
**Deliverable:** 6–10 page report + appendix.  
**Rubric:** Rigour 30%, Synthesis 30%, Depth 25%, Originality 15%.

---

## Research Track (Tiers 4–5)

### WRQ — Well-Defined Research Questions ×5

**Purpose:** Answer a specific question from the literature using calculation + reading.  
**Scope:** 5–10 hours each.  
**Deliverable:** 2–6 page memo (question, method, evidence, conclusion, 5–10 references).  
**Rubric:** Scope/method 25%, Evidence 25%, Technical 25%, Argument 25%.

---

### ORQ — Open-Ended Research Questions ×5

**Purpose:** Propose a research direction; no single correct answer.  
**Scope:** 10–20 hours each.  
**Deliverable:** 4–10 page proposal (motivation, what's known, proposal, how to test, limitations).  
**Rubric:** Clarity 25%, Depth 25%, Novelty 25%, Limitations 25%.

---

## Summary Table

| Code | Type | Track | Count | Duration |
|------|------|-------|-------|----------|
| SCQU | Simple concept Q | UG | 10 | 15–20 min |
| CCQU | Complex concept Q | UG | 10 | 25–35 min |
| SPSU | Simple problem set | UG | 10 | 60–90 min |
| CPSU | Complex problem set | UG | 5 | 3–6 hrs |
| SPJU | Simple project | UG | 1 | 2–6 hrs |
| CPJU | Complex project | UG | 1 | 8–15 hrs |
| SCQG | Simple concept Q | Grad | 10 | 20–25 min |
| CCQG | Complex concept Q | Grad | 10 | 35–50 min |
| SPSG | Simple problem set | Grad | 10 | 60–90 min |
| CPSG | Complex problem set | Grad | 5 | 5–10 hrs |
| SPJG | Simple projects | Grad | 5 | 3–8 hrs each |
| CPJG | Complex projects | Grad | 5 | 10–20 hrs each |
| WRQ | Research Q (defined) | Research | 5 | 5–10 hrs each |
| ORQ | Research Q (open) | Research | 5 | 10–20 hrs each |
| **Total** | | | **92** | |
