"""
shared/slide_helpers.py
=======================
Reusable slide-building primitives used by every lecture deck and the
syllabus builder.  All functions accept a PptxGenJS slide object (from
the Node.js side via a JSON spec) *or* can be imported by the Python
orchestrator that writes the JS and runs Node.

Because PptxGenJS is a Node.js library, the actual slide construction
happens in Node.js scripts.  This Python module therefore provides:

  1. The canonical list of lecture metadata (used by syllabus + all builders).
  2. Helper functions for generating the per-lecture JS snippet strings,
     so each lecture's build_LXX.js is thin and declarative.
  3. The design-token pass-through so JS files can import JSON constants.

Python callers: build_all.py, build_syllabus.py
Node callers:   shared/slide_helpers.js  (see that file)
"""

from __future__ import annotations
import json
import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.dirname(_HERE))
from shared.design import C, W, H, FONT_HEAD, FONT_BODY, LEVELS, LECTURE_ACCENTS

# ═════════════════════════════════════════════════════════════════════════════
# LECTURE METADATA  (single source of truth)
# ═════════════════════════════════════════════════════════════════════════════

LECTURES: list[dict] = [
    {
        "num": "L01",
        "title": "Why Dirac Notation? States as Rays & Superposition",
        "subtitle": "Sakurai ↔ Dirac Dual-Track — Lecture 1",
        "pacing": [
            "0–15 min: Motivation — representations vs abstract states",
            "15–45 min: Kets as vectors, rays, normalization, global phase",
            "45–70 min: Bras (informal), amplitudes, Born rule preview",
            "70–90 min: Notation dictionary: ket ↔ column vector ↔ wavefunction",
        ],
        "outcomes": [
            "Understand state as equivalence class |ψ⟩ ~ e^{iθ}|ψ⟩",
            "Interpret amplitudes and Born-rule probabilities P(a) = |⟨a|ψ⟩|²",
            "Learn the notation dictionary in a discrete basis",
            "Connect Sakurai (physical) and Dirac (abstract) perspectives",
        ],
        "levels": {
            "HS":    "Complex numbers; |z|² as probability; vector addition & interference",
            "BegUG": "Normalization ⟨ψ|ψ⟩=1; orthogonality; components cₙ = ⟨n|ψ⟩",
            "AdvUG": "Cauchy–Schwarz; triangle inequality; metric viewpoint on states",
            "MSc":   "Rays & projective Hilbert space P(H); Wigner theorem preview",
            "PhD":   "Precise Hilbert-space statements; separability; rays as points in P(H)",
        },
        "formulas": {
            "ray_equiv":    r"$|\psi\rangle \sim e^{i\theta}|\psi\rangle$",
            "born_rule":    r"$P(a_i) = |\langle a_i|\psi\rangle|^2$",
            "superposition":r"$|\phi\rangle = \alpha|\psi_1\rangle + \beta|\psi_2\rangle$",
            "normalization":r"$\langle\psi|\psi\rangle = 1$",
            "component":    r"$c_n = \langle n|\psi\rangle$",
            "completeness": r"$\sum_n |n\rangle\langle n| = \hat{I}$",
            "interference": r"$P = |A_1 + A_2|^2 = |A_1|^2 + |A_2|^2 + 2\Re(A_1^* A_2)$",
        },
        "pitfalls": [
            "Confusing |ψ⟩ (abstract) with a column vector (representation-dependent)",
            "Forgetting complex conjugation when ket → bra: ⟨ψ| = Σ cₙ* ⟨n|",
            "Treating phase difference as extra probability — phase only affects interference",
            "Assuming normalization is automatic — always check ⟨ψ|ψ⟩ = 1",
        ],
        "set_a": [
            "Normalize |ψ⟩ = (1+i)|1⟩ + 2|2⟩",
            "Find P(1) and P(2) for |ψ⟩ = (1/√5)(|1⟩ + 2i|2⟩)",
            "If |φ⟩ = α|1⟩ + β|2⟩, find conditions for |φ⟩ ⊥ |ψ⟩",
            "Verify Σₙ |cₙ|² = 1 for a given normalized state",
            "Compute ⟨ψ|φ⟩ for two given 3-component states",
            "Show |ψ⟩ and e^{iπ/3}|ψ⟩ give identical probabilities",
        ],
        "set_b": [
            "Prove Cauchy-Schwarz: |⟨φ|ψ⟩|² ≤ ⟨φ|φ⟩⟨ψ|ψ⟩  [Hint: ||φ⟩ - λ|ψ⟩||² ≥ 0]",
            "Prove triangle inequality: ||φ+ψ|| ≤ ||φ|| + ||ψ||  [Hint: square; use C-S]",
            "Show unitary basis change preserves Σ|cₙ|²  [Hint: U†U = I]",
            "(MSc+) Interpret physical states as points in P(H)",
        ],
        "history": [
            "Born (1926) — probability interpretation of ψ",
            "Dirac (1927–30) — amplitude formalism, bra-ket notation",
            "von Neumann (1932) — Hilbert-space axiomatics",
            "Wigner — symmetry principles (preview for later lectures)",
        ],
        "key_content": "States, kets, rays, global phase, Born rule preview",
    },
    {
        "num": "L02",
        "title": "Bras, Dual Space & Inner Product Structure",
        "subtitle": "Duality, conjugate linearity, Riesz representation",
        "pacing": [
            "0–20 min: Define bras as linear functionals on H",
            "20–50 min: Conjugate linearity; inner product axioms",
            "50–70 min: Probability amplitude ⟨φ|ψ⟩ and Born rule",
            "70–90 min: Orthonormal basis; Gram–Schmidt sketch",
        ],
        "outcomes": [
            "Define bra ⟨ψ| as element of dual space H*",
            "Master conjugate linearity: (a⟨φ₁|+b⟨φ₂|)|ψ⟩ = a*⟨φ₁|ψ⟩ + b*⟨φ₂|ψ⟩",
            "Derive Born-rule probability from inner product structure",
            "State Riesz representation theorem (intuition)",
        ],
        "levels": {
            "HS":    "Conjugation rules; dot-product analogy for real vectors",
            "BegUG": "Orthonormal bases; Gram–Schmidt procedure",
            "AdvUG": "Riesz representation theorem intuition; proofs",
            "MSc":   "Anti-linear maps; adjoint rigorously defined; continuity",
            "PhD":   "Bounded vs unbounded functionals; Banach space context",
        },
        "formulas": {
            "inner_product":    r"$\langle\phi|\psi\rangle \in \mathbb{C}$",
            "conj_symmetry":    r"$\langle\phi|\psi\rangle = \langle\psi|\phi\rangle^*$",
            "linearity_ket":    r"$\langle\phi|(a|\psi_1\rangle+b|\psi_2\rangle) = a\langle\phi|\psi_1\rangle + b\langle\phi|\psi_2\rangle$",
            "conj_lin_bra":     r"$(a\langle\phi_1|+b\langle\phi_2|)|\psi\rangle = a^*\langle\phi_1|\psi\rangle + b^*\langle\phi_2|\psi\rangle$",
            "component_via_ip": r"$c_n = \langle n|\psi\rangle$",
        },
        "pitfalls": [
            "Forgetting that bra is antilinear: bra of (a|ψ⟩) is a*⟨ψ|",
            "Treating ⟨φ|ψ⟩ as symmetric — it is conjugate symmetric",
            "Confusing row vector (bra in a basis) with abstract dual vector",
        ],
        "set_a": [
            "Compute ⟨φ|ψ⟩ for |φ⟩ = (1/√2)(|1⟩-i|2⟩), |ψ⟩ = (1/√5)(|1⟩+2i|2⟩)",
            "Verify conjugate symmetry for the above pair",
            "Apply Gram–Schmidt to {|1⟩+|2⟩, |1⟩-|2⟩} to get an ONB",
            "Compute the norm of |ψ⟩ = 3|1⟩ - 4i|2⟩ + 2|3⟩",
        ],
        "set_b": [
            "Prove that inner product positive-definiteness implies norm > 0 for |ψ⟩ ≠ 0",
            "Prove Gram–Schmidt produces orthonormal vectors",
            "Show the dual-space map |ψ⟩ ↦ ⟨ψ| is antilinear",
        ],
        "history": [
            "Hilbert (1900s) — inner product spaces formalized",
            "Riesz (1907) — representation theorem for bounded functionals",
            "Dirac (1930) — bra as dual vector, bracket notation",
        ],
        "key_content": "Dual vectors, conjugate linearity, inner product axioms",
    },
    {
        "num": "L03",
        "title": "Linear Operators: Adjoint, Hermitian & Unitary",
        "subtitle": "Operator algebra, observables and symmetries",
        "pacing": [
            "0–20 min: Operators as maps H→H; matrix elements ⟨φ|Â|ψ⟩",
            "20–50 min: Adjoint Â†; Hermitian observables; unitary symmetries",
            "50–70 min: Expectation values; operator algebra",
            "70–90 min: Commutators preview; spectral theorem motivation",
        ],
        "outcomes": [
            "Compute matrix elements ⟨φ|Â|ψ⟩ in any basis",
            "Define adjoint via ⟨φ|Â|ψ⟩ = ⟨Â†φ|ψ⟩",
            "Characterize Hermitian (Â=Â†) and unitary (Û†Û=Î) operators",
            "Prove expectation value of Hermitian operator is real",
        ],
        "levels": {
            "HS":    "Matrices as machines on vectors; 2×2 examples",
            "BegUG": "Eigenvalues basics; expectation value ⟨Â⟩ = ⟨ψ|Â|ψ⟩",
            "AdvUG": "Hermitian ⇒ real expectation; unitary preserves inner product",
            "MSc":   "Spectral theorem preview; commutators; normal operators",
            "PhD":   "Domains of unbounded operators; self-adjoint vs merely Hermitian",
        },
        "formulas": {
            "matrix_element":   r"$A_{mn} = \langle m|\hat{A}|n\rangle$",
            "adjoint_def":      r"$\langle\phi|\hat{A}|\psi\rangle = \langle\hat{A}^\dagger\phi|\psi\rangle$",
            "hermitian":        r"$\hat{A} = \hat{A}^\dagger$",
            "unitary":          r"$\hat{U}^\dagger\hat{U} = \hat{I}$",
            "expectation":      r"$\langle\hat{A}\rangle_\psi = \langle\psi|\hat{A}|\psi\rangle$",
            "exp_eigenbasis":   r"$\langle\hat{A}\rangle = \sum_n |c_n|^2 a_n$",
        },
        "pitfalls": [
            "Confusing adjoint with transpose — must take complex conjugate too",
            "Assuming Hermitian implies bounded — position/momentum are unbounded",
            "Using Û† = Û⁻¹ blindly without checking domain",
        ],
        "set_a": [
            "Find Â† if Â = [[1+i, 2], [3, 4-i]] in matrix representation",
            "Verify Hermiticity of σₓ, σᵧ, σᵤ (Pauli matrices)",
            "Compute ⟨σᵤ⟩ for |+⟩ = (1/√2)(|↑⟩+|↓⟩)",
            "Show UU† = I for U = (1/√2)[[1,1],[1,-1]] (Hadamard)",
        ],
        "set_b": [
            "Prove: if Â = Â† then ⟨ψ|Â|ψ⟩ ∈ ℝ for all |ψ⟩",
            "Prove: if Û is unitary then ⟨Ûφ|Ûψ⟩ = ⟨φ|ψ⟩",
            "Show [Â,B̂] = iĈ with Â,B̂ Hermitian implies Ĉ is Hermitian",
        ],
        "history": [
            "Heisenberg (1925) — matrix mechanics; operators as physical quantities",
            "Born & Jordan (1925) — canonical commutation relations",
            "von Neumann (1927) — operator algebra on Hilbert space",
        ],
        "key_content": "Operator algebra, matrix elements, observables & symmetries",
    },
    {
        "num": "L04",
        "title": "Eigenkets, Projectors & Spectral Decomposition",
        "subtitle": "Measurement postulate, projectors, post-measurement state",
        "pacing": [
            "0–20 min: Eigenvalue equation Â|a⟩ = a|a⟩",
            "20–50 min: Projectors P̂ₐ = |a⟩⟨a|; idempotency and completeness",
            "50–75 min: Spectral decomposition Â = Σₐ a|a⟩⟨a|",
            "75–90 min: Measurement postulate; post-measurement state update",
        ],
        "outcomes": [
            "Use eigenkets to compute measurement probabilities P(a) = |⟨a|ψ⟩|²",
            "Construct and verify projectors P̂ₐ² = P̂ₐ, P̂ₐ† = P̂ₐ",
            "Write spectral decomposition for any discrete observable",
            "State the measurement postulate (Sakurai formulation)",
        ],
        "levels": {
            "HS":    "Filters and outcomes intuition — Stern–Gerlach analogy",
            "BegUG": "Compute P(a) = |⟨a|ψ⟩|² via projectors for simple cases",
            "AdvUG": "Degeneracy; resolution of identity in eigenbasis",
            "MSc":   "Projection postulate subtleties; Lüders rule",
            "PhD":   "Spectral measures; PVMs and POVMs preview; measurement models",
        },
        "formulas": {
            "eigenvalue_eq":    r"$\hat{A}|a\rangle = a|a\rangle$",
            "projector":        r"$\hat{P}_a = |a\rangle\langle a|$",
            "idempotent":       r"$\hat{P}_a^2 = \hat{P}_a$",
            "spectral_decomp":  r"$\hat{A} = \sum_a a\,|a\rangle\langle a|$",
            "prob_projector":   r"$P(a) = \langle\psi|\hat{P}_a|\psi\rangle = |\langle a|\psi\rangle|^2$",
            "post_meas":        r"$|\psi\rangle \rightarrow |a\rangle \;\; (\mathrm{outcome}\;a)$",
        },
        "pitfalls": [
            "Mixing up projector P̂ₐ (idempotent) with general operator",
            "Forgetting to normalize post-measurement state in degenerate case",
            "Applying spectral theorem to non-Hermitian operators",
        ],
        "set_a": [
            "Find eigenkets and eigenvalues of σᵤ = [[1,0],[0,-1]]",
            "Construct projectors P̂₊ and P̂₋; verify P̂₊ + P̂₋ = Î",
            "Compute P(+) for |ψ⟩ = (3/5)|+⟩ + (4/5)|-⟩",
            "Verify P̂ₐ² = P̂ₐ for any rank-1 projector",
        ],
        "set_b": [
            "Prove P̂ₐP̂_b = δ_{ab}P̂ₐ for distinct eigenvalues",
            "Show Σₐ P̂ₐ = Î using completeness of eigenbasis",
            "Derive the spectral theorem for a 2×2 Hermitian matrix from scratch",
        ],
        "history": [
            "Dirac (1930) — transformation theory, eigenvalues as measurement outcomes",
            "von Neumann (1932) — projection postulate, wave-function collapse",
            "Lüders (1951) — generalization of projection postulate",
        ],
        "key_content": "Measurement outcomes, projectors, post-measurement state",
    },
    {
        "num": "L05",
        "title": "Completeness, Change of Basis & Matrix Mechanics",
        "subtitle": "Identity insertion, basis transforms, matrix representation",
        "pacing": [
            "0–20 min: Resolution of identity; inserting 1",
            "20–50 min: Basis expansion and change of representation",
            "50–75 min: Matrix multiplication as inserted identities",
            "75–90 min: Coordinate transforms; unitary basis changes",
        ],
        "outcomes": [
            "Use Σₙ|n⟩⟨n|=Î to evaluate any bracket by inserting identity",
            "Transform between bases using unitary matrices",
            "Derive matrix multiplication from operator composition",
            "Express operator matrix elements Aₘₙ = ⟨m|Â|n⟩",
        ],
        "levels": {
            "HS":    "Coordinate systems analogy; 2D rotation",
            "BegUG": "Compute Aₘₙ and transform vectors between bases",
            "AdvUG": "Abstract operator and matrix representation equivalence",
            "MSc":   "Similarity vs unitary equivalence; trace & spectrum invariants",
            "PhD":   "Representation theory framing; direct integrals preview",
        },
        "formulas": {
            "completeness":     r"$\sum_n |n\rangle\langle n| = \hat{I}$",
            "insert_identity":  r"$\langle\phi|\hat{A}|\psi\rangle = \sum_n \langle\phi|n\rangle\langle n|\hat{A}|\psi\rangle$",
            "matrix_elem":      r"$A_{mn} = \langle m|\hat{A}|n\rangle$",
            "matrix_mult":      r"$(AB)_{mn} = \sum_k A_{mk} B_{kn}$",
            "unitary_change":   r"$A' = U^\dagger A U$",
        },
        "pitfalls": [
            "Inserting identity in wrong basis for the operator",
            "Confusing similarity transform with unitary equivalence",
            "Forgetting that Tr(Â) and spectrum are basis-independent",
        ],
        "set_a": [
            "Compute ⟨φ|Â|ψ⟩ by inserting identity in the σᵤ eigenbasis",
            "Express |ψ⟩ = |+⟩ in the σₓ eigenbasis {|x+⟩, |x-⟩}",
            "Verify (Â·B̂)ₘₙ = Σₖ AₘₖBₖₙ for 2×2 matrices",
        ],
        "set_b": [
            "Prove Tr(Â) is basis-independent using insert-identity twice",
            "Show that unitary equivalence preserves eigenvalues",
            "Prove the determinant is basis-independent",
        ],
        "history": [
            "Heisenberg (1925) — matrix mechanics formulation",
            "Schrödinger (1926) — wave mechanics (different representation)",
            "Dirac (1930) — showed both are representations of same abstract theory",
        ],
        "key_content": "Identity insertion, basis transforms, matrix representation",
    },
    {
        "num": "L06",
        "title": "Continuous Bases: |x⟩, |p⟩ & Delta Functions",
        "subtitle": "Position/momentum bases, wavefunctions, Fourier connection",
        "pacing": [
            "0–20 min: Continuous completeness ∫|x⟩⟨x|dx = Î",
            "20–50 min: Wavefunction as ψ(x) = ⟨x|ψ⟩",
            "50–75 min: Momentum basis; ⟨x|p⟩ = e^{ipx/ℏ}/√(2πℏ)",
            "75–90 min: Fourier connection; delta function identities",
        ],
        "outcomes": [
            "Understand ⟨x|x'⟩ = δ(x−x') as continuous orthonormality",
            "Derive wavefunction ψ(x) as projection onto position basis",
            "Connect Fourier transform to ⟨x|p⟩ inner product",
            "Handle Dirac delta distributions carefully",
        ],
        "levels": {
            "HS":    "What a continuum of outcomes means physically",
            "BegUG": "Basic integrals; qualitative delta function properties",
            "AdvUG": "Careful delta manipulations; normalization conventions",
            "MSc":   "Distribution theory viewpoint; generalized eigenvectors",
            "PhD":   "Rigged Hilbert spaces motivation; Gel'fand triple preview",
        },
        "formulas": {
            "cont_completeness":r"$\int_{-\infty}^{\infty}|x\rangle\langle x|\,dx = \hat{I}$",
            "position_ortho":   r"$\langle x|x'\rangle = \delta(x-x')$",
            "wavefunction":     r"$\psi(x) = \langle x|\psi\rangle$",
            "momentum_kernel":  r"$\langle x|p\rangle = \frac{1}{\sqrt{2\pi\hbar}}e^{ipx/\hbar}$",
            "fourier_via_bk":   r"$\psi(x) = \int \langle x|p\rangle\langle p|\psi\rangle\,dp$",
            "ip_as_integral":   r"$\langle\phi|\psi\rangle = \int\phi^*(x)\psi(x)\,dx$",
        },
        "pitfalls": [
            "Treating δ(x−x') as a regular function — it is a distribution",
            "Wrong normalization: ⟨x|x'⟩ uses δ not Kronecker δ",
            "Confusing momentum eigenstate normalization conventions (ℏ vs 1)",
        ],
        "set_a": [
            "Show ∫|x⟩⟨x|dx=Î implies ⟨φ|ψ⟩ = ∫φ*(x)ψ(x)dx",
            "Verify ψ̃(p) = ⟨p|ψ⟩ is the Fourier transform of ψ(x)",
            "Compute ⟨x|p̂|ψ⟩ using ⟨x|p̂|p⟩ = p⟨x|p⟩",
        ],
        "set_b": [
            "Derive ψ(x) as Fourier transform of φ(p) from ⟨x|p⟩ kernel",
            "Prove Parseval–Plancherel: ∫|ψ|² dx = ∫|φ|² dp from completeness",
            "Show x̂ in p-representation acts as iℏ∂/∂p",
        ],
        "history": [
            "Schrödinger (1926) — wave mechanics and ψ(x)",
            "Dirac (1927) — δ-function introduced (informally)",
            "Schwartz (1950s) — distribution theory: rigorous foundation for δ",
        ],
        "key_content": "Position/momentum bases, wavefunctions, Fourier connection",
    },
    {
        "num": "L07",
        "title": "Measurement Theory: Postulates, Compatibility & Uncertainty",
        "subtitle": "Commutators, Robertson inequality, compatible observables",
        "pacing": [
            "0–20 min: Compatible observables and commutators [Â,B̂]",
            "20–50 min: Uncertainty relation derivation (Robertson inequality)",
            "50–75 min: Measurement update; expectation values",
            "75–90 min: POVM preview; state tomography mention",
        ],
        "outcomes": [
            "Define compatible observables: [Â,B̂]=0 ⟺ common eigenbasis",
            "Derive Robertson–Schrödinger uncertainty inequality",
            "Compute variances and uncertainty products",
            "Distinguish measurement uncertainty from instrumental imprecision",
        ],
        "levels": {
            "HS":    "Uncertainty as statistical spread, not instrument error",
            "BegUG": "Compute variances; simple commutators [x̂,p̂]=iℏ",
            "AdvUG": "Derive Robertson inequality from Cauchy–Schwarz",
            "MSc":   "POVMs, operational view; state tomography preview",
            "PhD":   "Measurement models (von Neumann coupling), disturbance, contextuality",
        },
        "formulas": {
            "commutator":       r"$[\hat{A},\hat{B}] = \hat{A}\hat{B} - \hat{B}\hat{A}$",
            "canonical_CR":     r"$[\hat{x},\hat{p}] = i\hbar$",
            "variance":         r"$(\Delta A)^2 = \langle\hat{A}^2\rangle - \langle\hat{A}\rangle^2$",
            "robertson":        r"$\Delta A\,\Delta B \geq \frac{1}{2}|\langle[\hat{A},\hat{B}]\rangle|$",
            "heisenberg_ur":    r"$\Delta x\,\Delta p \geq \frac{\hbar}{2}$",
        },
        "pitfalls": [
            "Confusing measurement uncertainty (quantum) with experimental error",
            "[x̂,p̂]=iℏ — do not drop the iℏ or reverse the sign",
            "Assuming compatible means 'commuting matrices' without checking domain",
        ],
        "set_a": [
            "Compute [σₓ, σᵧ] and verify = 2iσᵤ",
            "Find ΔSₓ and ΔSᵧ for |+z⟩; verify Robertson bound",
            "Compute variance of σᵤ in state |+x⟩",
        ],
        "set_b": [
            "Derive Robertson inequality using Cauchy–Schwarz on ΔÂ and ΔB̂",
            "Prove: [Â,B̂]=0 ⇒ simultaneous eigenbasis exists (for finite-dim)",
            "Show [Â,B̂] = iĈ with Ĉ Hermitian ⇒ uncertainty product ≥ |⟨Ĉ⟩|/2",
        ],
        "history": [
            "Heisenberg (1927) — uncertainty principle (heuristic)",
            "Robertson (1929) — general algebraic uncertainty relation",
            "Schrödinger (1930) — tighter form (Robertson–Schrödinger)",
        ],
        "key_content": "Commutators, Robertson inequality, compatible observables",
    },
    {
        "num": "L08",
        "title": "Time Evolution & Pictures of Quantum Mechanics",
        "subtitle": "Unitary evolution, Schrödinger/Heisenberg pictures, constants of motion",
        "pacing": [
            "0–20 min: Unitary evolution Û(t) = e^{−iĤt/ℏ}",
            "20–45 min: Schrödinger picture: states evolve, operators fixed",
            "45–70 min: Heisenberg picture: operators evolve",
            "70–90 min: Constants of motion; [Â,Ĥ]=0 ⟺ conserved",
        ],
        "outcomes": [
            "Derive Û(t) from unitarity and time-translation invariance",
            "Work fluently in both Schrödinger and Heisenberg pictures",
            "Derive Heisenberg equation of motion dÂ_H/dt",
            "Identify constants of motion via [Â,Ĥ]=0",
        ],
        "levels": {
            "HS":    "Exponential as repeated tiny evolution steps",
            "BegUG": "Differentiate ⟨Â⟩ with time; simple Hamiltonians",
            "AdvUG": "Heisenberg EOM; Ehrenfest's theorem",
            "MSc":   "Time-ordering; interaction picture preview",
            "PhD":   "Stone's theorem; one-parameter unitary groups; domain issues",
        },
        "formulas": {
            "time_evolution":   r"$|\psi(t)\rangle = \hat{U}(t)|\psi(0)\rangle$",
            "unitary_exp":      r"$\hat{U}(t) = e^{-i\hat{H}t/\hbar}$",
            "schrodinger_eq":   r"$i\hbar\frac{d}{dt}|\psi(t)\rangle = \hat{H}|\psi(t)\rangle$",
            "heisenberg_eom":   r"$\frac{d\hat{A}_H}{dt} = \frac{i}{\hbar}[\hat{H},\hat{A}_H]$",
            "ehrenfest":        r"$\frac{d}{dt}\langle\hat{A}\rangle = \frac{i}{\hbar}\langle[\hat{H},\hat{A}]\rangle$",
        },
        "pitfalls": [
            "Forgetting sign: dÂ_H/dt = (i/ℏ)[Ĥ,Â_H], not [Â_H,Ĥ]",
            "Mixing Schrödinger and Heisenberg pictures in same equation",
            "Assuming e^{Â+B̂} = e^Â·e^{B̂} — only true if [Â,B̂]=0",
        ],
        "set_a": [
            "Show Û†Û = Î if Ĥ is Hermitian",
            "Prove d/dt ⟨ψ(t)|ψ(t)⟩ = 0 under unitary evolution",
            "Compute |ψ(t)⟩ for two-level system Ĥ = ω₀σᵤ/2",
        ],
        "set_b": [
            "Derive Heisenberg EOM from d/dt⟨Â⟩ = d/dt⟨ψ|Â|ψ⟩",
            "Prove Ehrenfest: d⟨x̂⟩/dt = ⟨p̂⟩/m from Ĥ = p̂²/2m + V(x̂)",
            "Show [Â,Ĥ]=0 ⇒ ⟨Â⟩ constant in time in Schrödinger picture",
        ],
        "history": [
            "Schrödinger (1926) — wave equation, Schrödinger picture",
            "Heisenberg (1925) — matrix mechanics, Heisenberg picture",
            "Dirac (1927) — interaction picture; both pictures equivalent",
        ],
        "key_content": "Unitary evolution, Schrödinger/Heisenberg pictures",
    },
    {
        "num": "L09",
        "title": "Tensor Products: Composite Systems & Entanglement",
        "subtitle": "Product vs entangled states, Schmidt decomposition",
        "pacing": [
            "0–20 min: Tensor product space H_A ⊗ H_B",
            "20–50 min: Product vs entangled states; operator action",
            "50–75 min: Entanglement criterion; Schmidt decomposition",
            "75–90 min: Partial measurement; reduced state preview",
        ],
        "outcomes": [
            "Construct product states |i⟩_A ⊗ |j⟩_B and general bipartite states",
            "Identify entanglement by failure of coefficient factorization",
            "Apply Schmidt decomposition to find Schmidt rank",
            "Preview partial trace as reduced description of a subsystem",
        ],
        "levels": {
            "HS":    "Two systems = bigger space — classical analogy & beyond",
            "BegUG": "Compute product basis components; ⊗ of matrices",
            "AdvUG": "Schmidt decomposition (intro); maximally entangled states",
            "MSc":   "Partial trace lightly; entanglement entropy preview",
            "PhD":   "Entanglement measures, operational tasks, reading prompts",
        },
        "formulas": {
            "tensor_product":   r"$|\Psi\rangle = \sum_{ij} c_{ij}|i\rangle_A|j\rangle_B$",
            "product_state":    r"$|\Psi\rangle = |\phi\rangle_A \otimes |\chi\rangle_B$",
            "ip_factorizes":    r"$({}_A\langle\phi|\otimes{}_B\langle\chi|)(|\psi\rangle_A\otimes|\eta\rangle_B) = \langle\phi|\psi\rangle\langle\chi|\eta\rangle$",
            "bell_state":       r"$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle + |11\rangle)$",
            "schmidt":          r"$|\Psi\rangle = \sum_k \lambda_k |\alpha_k\rangle_A|\beta_k\rangle_B$",
        },
        "pitfalls": [
            "Assuming all bipartite states are product states",
            "Forgetting that dim(H_A ⊗ H_B) = dim(H_A) × dim(H_B)",
            "Confusing Schmidt rank 1 (separable) with full Schmidt decomposition",
        ],
        "set_a": [
            "Construct the 4-dim basis for two spin-1/2 particles",
            "Show |Φ+⟩ = (1/√2)(|00⟩+|11⟩) is entangled",
            "Compute (σₓ⊗Î)|Φ+⟩",
        ],
        "set_b": [
            "Find Schmidt decomposition of |Ψ⟩ = (|00⟩+|01⟩+|10⟩-|11⟩)/2",
            "Prove (⟨φ|⊗⟨χ|)(|ψ⟩⊗|η⟩) = ⟨φ|ψ⟩⟨χ|η⟩ from bilinearity",
            "Show separability ⟺ Schmidt rank = 1",
        ],
        "history": [
            "Schrödinger (1935) — 'entanglement' (Verschränkung) coined",
            "Einstein, Podolsky, Rosen (1935) — EPR paradox",
            "Bell (1964) — Bell inequalities; experimental tests",
        ],
        "key_content": "Product vs entangled states, Schmidt decomposition",
    },
    {
        "num": "L10",
        "title": "Spin & Finite-Dimensional Hilbert Spaces (SU(2))",
        "subtitle": "Spin-1/2, Pauli matrices, rotation operators, Bloch sphere",
        "pacing": [
            "0–20 min: Spin-1/2 as 2D Hilbert space; |+⟩, |−⟩ basis",
            "20–50 min: Pauli matrices; spin operators Sₓ, Sᵧ, Sᵤ",
            "50–75 min: Rotation operators U(θ,n̂) = e^{−iθσ·n̂/2}",
            "75–90 min: Angular momentum algebra; SU(2)/SO(3) link",
        ],
        "outcomes": [
            "Work with spin-1/2 as prototype finite-dimensional QM",
            "Compute eigenkets and probabilities for all spin components",
            "Apply rotation operators U(θ,n̂) = e^{−iθσ·n̂/2}",
            "Connect SU(2) group to physical rotations SO(3)",
        ],
        "levels": {
            "HS":    "Two-state systems as qubits — conceptual motivation",
            "BegUG": "Compute spin measurement probabilities; Stern–Gerlach",
            "AdvUG": "Rotation operators; verify [σᵢ,σⱼ] = 2iεᵢⱼₖσₖ",
            "MSc":   "Representation theory; angular momentum J+, J−",
            "PhD":   "SU(2) vs SO(3), projective representations, Wigner theorem",
        },
        "formulas": {
            "pauli_x":          r"$\sigma_x: \; |0\rangle\langle 1| + |1\rangle\langle 0|$",
            "pauli_commutator": r"$[\sigma_i,\sigma_j] = 2i\varepsilon_{ijk}\sigma_k$",
            "spin_op":          r"$\hat{S}_i = \frac{\hbar}{2}\sigma_i$",
            "rotation_op":      r"$U(\theta,\hat{n}) = e^{-i\theta\hat{n}\cdot\boldsymbol{\sigma}/2} = \cos\frac{\theta}{2}\,\hat{I} - i\sin\frac{\theta}{2}\,\hat{n}\cdot\boldsymbol{\sigma}$",
            "bloch_state":      r"$|\psi\rangle = \cos\frac{\theta}{2}|+\rangle + e^{i\phi}\sin\frac{\theta}{2}|-\rangle$",
        },
        "pitfalls": [
            "Off-by-2 in rotation: SU(2) element for 2π rotation is −Î, not +Î",
            "Confusing σᵢ (dimensionless) with Sᵢ = ℏσᵢ/2",
            "Bloch sphere θ is polar angle (0 to π), not azimuthal",
        ],
        "set_a": [
            "Find eigenkets of σₓ in terms of |+z⟩ and |−z⟩",
            "Compute P(+x) for state |+z⟩",
            "Apply U(π,ẑ) to |+z⟩; interpret physically",
        ],
        "set_b": [
            "Prove [σᵢ,σⱼ] = 2iεᵢⱼₖσₖ for all pairs",
            "Derive U(θ,ẑ) = e^{−iθσᵤ/2} explicitly",
            "Show a 4π rotation returns to original state; show 2π gives −|ψ⟩",
        ],
        "history": [
            "Goudsmit & Uhlenbeck (1925) — spin hypothesis",
            "Pauli (1927) — Pauli matrices; spin-1/2 formalism",
            "Cartan (1913) / Weyl (1925) — SU(2) representation theory",
        ],
        "key_content": "Spin-1/2, Pauli matrices, rotation operators",
    },
    {
        "num": "L11",
        "title": "Density Operators, Mixed States & Partial Trace",
        "subtitle": "ρ, Tr(ρA), Bloch sphere, open quantum systems preview",
        "pacing": [
            "0–20 min: Pure vs mixed states; ρ = Σᵢ pᵢ|ψᵢ⟩⟨ψᵢ|",
            "20–50 min: ⟨Â⟩ = Tr(ρÂ); properties of ρ",
            "50–75 min: Partial trace; reduced density matrices",
            "75–90 min: Bloch sphere for spin-1/2; purity Tr(ρ²)",
        ],
        "outcomes": [
            "Construct density operator for ensembles and reduced states",
            "Compute expectation values via Tr(ρÂ)",
            "Apply partial trace to obtain subsystem density matrix",
            "Distinguish pure (Tr(ρ²)=1) from mixed (Tr(ρ²)<1) states",
        ],
        "levels": {
            "HS":    "Classical ignorance vs quantum spread — conceptual distinction",
            "BegUG": "Compute trace in matrix form; verify ρ properties",
            "AdvUG": "Pure vs mixed; Bloch vector parameterization of ρ",
            "MSc":   "Kraus operators; CPTP maps preview; quantum channels",
            "PhD":   "Open systems, master equations; quantum error correction preview",
        },
        "formulas": {
            "density_op":       r"$\hat{\rho} = \sum_i p_i|\psi_i\rangle\langle\psi_i|$",
            "expectation_rho":  r"$\langle\hat{A}\rangle = \mathrm{Tr}(\hat{\rho}\hat{A})$",
            "rho_properties":   r"$\hat{\rho}^\dagger = \hat{\rho},\quad \hat{\rho}\geq 0,\quad \mathrm{Tr}(\hat{\rho})=1$",
            "purity":           r"$\mathrm{Tr}(\hat{\rho}^2) \leq 1,\quad = 1\text{ iff pure}$",
            "bloch_rho":        r"$\hat{\rho} = \frac{1}{2}(\hat{I} + \mathbf{r}\cdot\boldsymbol{\sigma}),\quad |\mathbf{r}|\leq 1$",
            "partial_trace":    r"$\hat{\rho}_A = \mathrm{Tr}_B(\hat{\rho}_{AB})$",
        },
        "pitfalls": [
            "Confusion between statistical mixture and quantum superposition",
            "Trace of a product ≠ product of traces in general",
            "Partial trace order matters: Tr_B ≠ Tr_A in general",
        ],
        "set_a": [
            "Write ρ for the equal-weight mixture of |+z⟩ and |−z⟩; compute Tr(ρ²)",
            "Compute ⟨σᵤ⟩ = Tr(ρσᵤ) for a given 2×2 ρ",
            "Find Bloch vector r for ρ = (3/4)|+⟩⟨+| + (1/4)|−⟩⟨−|",
        ],
        "set_b": [
            "Compute ρ_A = Tr_B(|Φ+⟩⟨Φ+|) for a Bell state; interpret purity",
            "Show that reduced state of any pure entangled state is mixed",
            "Prove Tr(ρ²) ≤ 1 from ρ's spectral decomposition",
        ],
        "history": [
            "von Neumann (1927) — density matrix formalism",
            "Landau (1927) — density matrix for subsystems (independently)",
            "Kraus (1971) — operator-sum (Kraus) representation of channels",
        ],
        "key_content": "rho, Tr(rhoA), partial trace, Bloch sphere, purity",
    },
    {
        "num": "L12",
        "title": "Rigged Hilbert Spaces & Mathematical Foundations",
        "subtitle": "Distributions, self-adjointness, what Dirac notation hides",
        "pacing": [
            "0–20 min: Why |x⟩ is NOT in the Hilbert space",
            "20–50 min: Distributions and test functions; Schwartz space",
            "50–75 min: Self-adjointness vs Hermiticity revisited",
            "75–90 min: What Dirac notation hides — safe usage rules",
        ],
        "outcomes": [
            "Explain why ⟨x|x'⟩ = δ(x−x') requires distribution theory",
            "State the Gel'fand triple Φ ⊂ H ⊂ Φ'",
            "Distinguish self-adjoint from merely Hermitian (deficiency indices)",
            "Apply Dirac notation safely knowing its foundational limits",
        ],
        "levels": {
            "HS":    "Idealized states — measuring infinitely precise position",
            "BegUG": "Cautionary rules for delta functions in calculations",
            "AdvUG": "Unbounded operators (x̂, p̂); domain issues",
            "MSc":   "Rigged Hilbert space triple Φ⊂H⊂Φ'; nuclear spectral theorem",
            "PhD":   "Spectral theorem in full measure-theoretic form; deficiency indices",
        },
        "formulas": {
            "gelfand_triple":   r"$\Phi \subset \mathcal{H} \subset \Phi'$",
            "delta_def":        r"$\int f(x)\delta(x-x')\,dx = f(x')$",
            "sa_condition":     r"$\langle\phi|\hat{A}\psi\rangle = \langle\hat{A}\phi|\psi\rangle\;\forall\,\phi,\psi\in\mathcal{D}(\hat{A})$",
            "momentum_domain":  r"$\hat{p} = -i\hbar\frac{d}{dx},\quad \mathcal{D}(\hat{p}) = H^1(\mathbb{R})$",
        },
        "pitfalls": [
            "Treating |x⟩ as a normalizable state — it is not in H",
            "Assuming Hermitian on a dense domain ⇒ self-adjoint automatically",
            "Using closure of Dirac notation without checking domain conditions",
        ],
        "set_a": [
            "Verify δ(ax) = δ(x)/|a| by integrating against test function",
            "Show x̂ is Hermitian on C∞_c(ℝ) ⊂ L²(ℝ)",
            "Identify the domain of p̂ = −iℏd/dx on L²([0,1])",
        ],
        "set_b": [
            "Show p̂ on [0,∞) with Dirichlet BC is Hermitian but NOT self-adjoint",
            "Construct a self-adjoint extension of p̂ on [0,1]",
            "Explain why Gel'fand triple resolves the 'continuous eigenvector' problem",
        ],
        "history": [
            "Dirac (1930) — δ function and continuous eigenstates (informal)",
            "Schwartz (1950) — rigorous distribution theory",
            "Gel'fand & Kostyuchenko (1955) — rigged Hilbert spaces",
            "Bohm & Gadella (1989) — rigged Hilbert spaces in QM textbooks",
        ],
        "key_content": "Distributions, self-adjointness, what Dirac notation hides",
    },
]

# ── Convenience: dict by lecture number ──────────────────────────────────────
LECTURE_BY_NUM: dict[str, dict] = {lec["num"]: lec for lec in LECTURES}


def get_lecture(num: str) -> dict:
    """Return metadata dict for a lecture by its number string, e.g. 'L01'."""
    if num not in LECTURE_BY_NUM:
        raise KeyError(f"Lecture {num!r} not found. Valid: {list(LECTURE_BY_NUM)}")
    return LECTURE_BY_NUM[num]


def export_design_json(path: str):
    """Write design tokens as JSON for consumption by Node.js builders."""
    tokens = {
        "C": C, "W": W, "H": H,
        "FONT_HEAD": FONT_HEAD, "FONT_BODY": FONT_BODY,
        "LEVELS": LEVELS,
        "LECTURE_ACCENTS": LECTURE_ACCENTS,
    }
    with open(path, "w") as f:
        json.dump(tokens, f, indent=2)
