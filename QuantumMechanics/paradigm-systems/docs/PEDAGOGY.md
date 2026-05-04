# Pedagogy Reference — Module I.4

## Five-Tier Pedagogy

Every lecture in Module I.4 is designed to serve five distinct learning levels simultaneously.
Content is layered so that each tier is fully engaged while not excluding other tiers.

---

### Tier 1 — High School (HS)

**Goal:** Build physical intuition for the quantum phenomenon without formalism.

**Competencies:**
- Complex numbers as "probability arrows"
- Qualitative understanding of quantisation and confinement
- Recognition of the real-world application of each system

**Action verbs:** identify, describe, interpret, sketch, recognise

**Assessment:** SCQU questions 1–4 (fully qualitative); SPSU Part A (arithmetic only)

**Hallmark phrase per lecture:**
- L01: "A particle in a box cannot stand still — that's zero-point energy."
- L03: "The harmonic oscillator is the building block of all of physics."
- L09: "Hydrogen orbitals are the shapes of atomic structure."

---

### Tier 2 — Beginning Undergraduate (BegUG)

**Goal:** Fluency in the core equations and notation.

**Competencies:**
- Apply the TISE to compute eigenvalues and eigenfunctions
- Compute expectation values ⟨x⟩, ⟨p⟩, ⟨E⟩
- Translate between ket notation and wave functions

**Action verbs:** apply, calculate, expand, translate, verify

**Assessment:** SCQU (all 10), SPSU (all 10), SPJU

---

### Tier 3 — Advanced Undergraduate (AdvUG)

**Goal:** Derive, prove, and understand why the formalism is self-consistent.

**Competencies:**
- Full derivations from first principles
- Perturbation theory calculations (first and second order)
- Completeness and orthonormality proofs

**Action verbs:** prove, derive, construct, verify, show

**Assessment:** CCQU, CPSU (full), CPJU; Tier 3 is the *baseline* for CPSU problems.

---

### Tier 4 — Master's (MSc)

**Goal:** Extend the formalism, connect to symmetry and modern physics.

**Competencies:**
- Formal extensions (transfer matrix, S-matrix, parabolic coordinates)
- Connection to symmetry groups and conservation laws
- Graduate-level mathematical rigour

**Action verbs:** analyse, generalise, connect, reformulate, extend

**Assessment:** SCQG, CCQG, SPSG, CPSG, SPJG; WRQ

---

### Tier 5 — PhD

**Goal:** Rigorous mathematical foundations and research-level extensions.

**Competencies:**
- Self-adjoint extensions, spectral theory, functional analysis
- Domain conditions, deficiency indices, resolvent operators
- Connection to modern research literature

**Action verbs:** formalise, extend, critique, classify rigorously, generalise

**Assessment:** CPSG (full), CPJG, ORQ; Tier 5 extensions marked `\tiertag{tier5col}{Tier 5}`

---

## Dual-Track Content Structure

Each lecture body presents two parallel perspectives:

| Physical/Applications Track | Mathematical Track |
|-----------------------------|-------------------|
| Physical intuition and real-world applications | Algebraic and formal structures |
| Connects to experiments and technology | Connects to functional analysis and symmetry |
| Emphasises the "why it matters" | Emphasises the "why it works" |

Both tracks are present in every section. The `[Tier N]` inline tags indicate where content
becomes tier-specific.

---

## 90-Minute Pacing Template

Typical block structure (adjust per lecture):

| Block | Time | Activity |
|-------|------|----------|
| 0 | 0–5 min | Recap of previous lecture; motivation for today's system |
| 1 | 5–20 min | Physical setup and Hamiltonian; HS/BegUG level |
| 2 | 20–45 min | Core derivation; BegUG/AdvUG level |
| 3 | 45–65 min | Advanced results and extensions; AdvUG/MSc level |
| 4 | 65–80 min | PhD extensions / research connections |
| 5 | 80–90 min | Connections, summary, assessment preview |

---

## Lecture Chaining — Research Arc

When using the research track (WRQ/ORQ) across multiple lectures, build a coherent arc.
Recommended themes for Module I.4:

| Lectures | Research arc theme |
|----------|--------------------|
| L01–L03 | Quantum confinement and spectroscopy |
| L04–L06 | Quantum control and spectroscopy in magnetic fields |
| L07–L09 | Perturbative structure of the hydrogen atom |
| L10–L12 | Tunnelling, scattering, and decay phenomena |

Use `generate_lecture_prompt.py --lecture L05` with the Variant F instruction to chain.

---

## Mixed-Cohort Delivery

For classes with mixed tier attendance:

- **UG-only cohort:** use Variant A (UG artifacts only); skip Tier 4/5 content in lecture
- **Grad-only cohort:** use Variant B; assume all BegUG/AdvUG results as known
- **Mixed HS–PhD:** teach all tiers; use `\tiertag` markers to signal transitions live
- **Grading:** HS/BegUG → Set A problems + simple projects; MSc/PhD → Set B + complex projects
