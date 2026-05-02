"""
generate_L01_v3_part2.py
Graduate track (SCQG, CCQG, SPSG, CPSG, SPJG, CPJG),
Research track (WRQ×5, ORQ×5), and Bibliography (BIB).
"""

# ─── SCQG ─────────────────────────────────────────────────────────────────
SCQG = {
"questions": [
# (type, question, answer_key)
("ST", "State precisely what it means for a Hilbert space ℋ to be separable.",
 "ℋ is separable if it contains a countable dense subset, equivalently if it admits "
 "a countable orthonormal basis {eₙ}ₙ₌₁^∞. Every element |ψ⟩ ∈ ℋ can then be written "
 "as |ψ⟩ = Σₙ⟨eₙ|ψ⟩|eₙ⟩ with convergence in norm."),

("ST", "State the Riesz representation theorem for Hilbert spaces.",
 "For every continuous linear functional f: ℋ → ℂ there exists a unique |φ⟩ ∈ ℋ such that "
 "f(|ψ⟩) = ⟨φ|ψ⟩ for all |ψ⟩ ∈ ℋ, with ‖f‖ = ‖|φ⟩‖. "
 "This establishes the antilinear isometric isomorphism ℋ → ℋ* that identifies bras with kets."),

("ST", "Define: (a) symmetric operator, (b) self-adjoint operator, (c) essentially self-adjoint. "
       "State where the distinction matters.",
 "(a) Symmetric: ⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩ for all φ,ψ ∈ D(Â), i.e. Â† extends Â but D(Â†) ⊇ D(Â). "
 "(b) Self-adjoint: Â = Â† AND D(Â) = D(Â†). Requires checking domains. "
 "(c) Essentially s.a.: closure Â̄ is self-adjoint. "
 "Distinction: Stone's theorem (unitary groups) requires self-adjoint, not merely symmetric."),

("ST", "Give the precise statement of the Hellinger–Toeplitz theorem.",
 "If Â is a linear operator defined on all of a Hilbert space ℋ (D(Â) = ℋ) and is symmetric "
 "(⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩ for all φ,ψ ∈ ℋ), then Â is bounded. "
 "Equivalently: any symmetric operator whose domain is all of ℋ is automatically bounded. "
 "Corollary: symmetric unbounded operators (x̂, p̂, Ĥ) cannot have D(Â) = ℋ."),

("TF", "True or False (with proof sketch): In an infinite-dimensional separable Hilbert space, "
       "every orthonormal set is a basis.",
 "FALSE. An orthonormal set {eₙ} is a basis (complete) iff span{eₙ} is dense in ℋ, "
 "equivalently iff ⟨eₙ|ψ⟩ = 0 for all n implies |ψ⟩ = 0. "
 "An orthonormal set that misses even one direction fails this. "
 "Counterexample: {e₂, e₃, e₄,...} in ℓ²(ℕ) is orthonormal but not a basis (e₁ is orthogonal to all)."),

("TF", "True or False (with proof sketch): For unbounded operators, Hermitian and self-adjoint "
       "are equivalent.",
 "FALSE. Hermitian (symmetric) means ⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩ on D(Â), requiring D(Â) ⊆ D(Â†). "
 "Self-adjoint additionally requires D(Â†) = D(Â). For p̂ = −iℏd/dx on L²([0,1]) "
 "with domain C_c^∞(0,1): symmetric but NOT self-adjoint since D(p̂†) ⊋ D(p̂)."),

("TF", "True or False (with proof sketch): ‖Â‖ = ‖Â†‖ for all bounded operators.",
 "TRUE. ‖Â†‖ = sup{‖Â†|ψ⟩‖ : ‖|ψ⟩‖=1}. Using ‖Â†|ψ⟩‖² = ⟨Â†ψ|Â†ψ⟩ = ⟨ψ|ÂÂ†|ψ⟩ "
 "≤ ‖Â‖·‖Â†‖·‖|ψ⟩‖², and symmetrically ‖Â‖ ≤ ‖Â†‖, we get ‖Â‖ = ‖Â†‖. "
 "More directly: ‖Â‖² = ‖Â†Â‖ = ‖Â†‖² using the C*-identity."),

("IE", "Identify the precise error in this argument: 'Let Â be symmetric on dense D(Â). "
       "Since ⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩ for all φ,ψ ∈ D(Â), the adjoint Â† satisfies Â†φ = Âφ, "
       "so D(Â†) = D(Â) and Â is self-adjoint.'",
 "Error: the domain of the adjoint D(Â†) is defined as the set of all |φ⟩ ∈ ℋ for which "
 "ψ ↦ ⟨Âψ|φ⟩ is bounded on D(Â). This may be strictly larger than D(Â). "
 "The equation Â†φ = Âφ holds for φ ∈ D(Â), but Â† may be defined on additional vectors "
 "in D(Â†) ⊋ D(Â). Self-adjointness requires explicitly checking D(Â†) = D(Â)."),

("IE", "Identify the error: 'x̂ on L²(ℝ) satisfies ∫ψ*(x)·(xφ(x))dx = ∫(xψ(x))*φ(x)dx "
       "for all ψ,φ ∈ L²(ℝ), so x̂ is self-adjoint with domain all of L²(ℝ).'",
 "Error: the computation is correct for ψ,φ ∈ D(x̂) = {f ∈ L²(ℝ): xf(x) ∈ L²(ℝ)}, "
 "but D(x̂) ≠ L²(ℝ). For a general g ∈ L²(ℝ), xg(x) need not be in L²(ℝ) "
 "(example: g(x) = χ_{[1,∞)}(x)/x). The domain is a proper dense subset. "
 "Hellinger–Toeplitz guarantees x̂ cannot be symmetric AND defined everywhere."),

("IE", "Identify the error: '‖Â+B̂‖ = ‖Â‖ + ‖B̂‖ by the triangle inequality for norms.'",
 "Error: the triangle inequality gives ‖Â+B̂‖ ≤ ‖Â‖+‖B̂‖ (subadditive), not equality. "
 "Equality holds only when Â and B̂ are 'aligned' in the operator sense (e.g. B̂ = λÂ with λ ≥ 0). "
 "For general operators the strict inequality ‖Â+B̂‖ < ‖Â‖+‖B̂‖ typically holds."),
],
"rubric": [
  "Each question: Precise correct statement (1.5 pts) + Brief justification or proof sketch (0.5 pts). "
  "Total: 20 points (10 × 2 pts). Duration: 20–25 minutes.",
],
"tier_routing": [
  ("MSc", "Conceptual statements about operators; standard results; rays/operators"),
  ("PhD", "Precise domain/boundedness conditions; named theorems with proof sketch"),
],
}

# ─── CCQG ─────────────────────────────────────────────────────────────────
CCQG = {
"questions": [
("DE", "Distinguish Hermitian from self-adjoint operators. Give a concrete example of an operator "
       "that is Hermitian (symmetric) but not self-adjoint, and explain the physical consequence.",
 "Symmetric (Hermitian): ⟨φ|Âψ⟩ = ⟨Âφ|ψ⟩ for φ,ψ ∈ D(Â) with D(Â†) ⊇ D(Â). "
 "Self-adjoint: additionally D(Â†) = D(Â). "
 "Example: p̂ = −iℏd/dx on D₀ = {ψ ∈ L²([0,1]) : ψ(0) = ψ(1) = 0}: symmetric but NOT s.a. "
 "(since D(p̂†) ⊋ D₀). Physical consequence: Stone's theorem fails — p̂ on D₀ does not "
 "generate a one-parameter unitary group; no well-defined momentum observable on this domain."),

("DE", "Distinguish the operator norm ‖Â‖ from the Hilbert–Schmidt norm ‖Â‖_HS = √Tr(Â†Â). "
       "Show they are not equivalent for infinite-dimensional operators.",
 "Operator norm: ‖Â‖ = sup eigenvalue of (Â†Â)^{1/2} = spectral radius of |Â|. "
 "HS norm: ‖Â‖_HS = (Σₙ⟨eₙ|Â†Â|eₙ⟩)^{1/2}; requires ‖Â‖_HS < ∞ (Hilbert–Schmidt class). "
 "Inequalities: ‖Â‖ ≤ ‖Â‖_HS. Not equivalent: diagonal operator with entries (1/n) has "
 "‖Â‖ = 1, ‖Â‖_HS = (Σ1/n²)^{1/2} = π/√6 < ∞. But identity 1̂ on ∞-dim space: ‖1̂‖=1, ‖1̂‖_HS=∞."),

("DE", "What is the Gel'fand triple (rigged Hilbert space) Φ ⊂ ℋ ⊂ Φ'? "
       "Why is this structure physically necessary, and what additional structure beyond ℋ does it provide?",
 "Φ: nuclear (test function) space, e.g. Schwartz space S(ℝ), dense in ℋ = L²(ℝ). "
 "Φ': antidual (continuous antilinear functionals on Φ), e.g. tempered distributions S'(ℝ). "
 "The continuous spectrum of x̂ and p̂ has 'eigenvectors' |x⟩, |p⟩ ∉ ℋ but ∈ Φ'. "
 "Physically necessary: the position/momentum eigenstates ψ_x(y)=δ(y−x) and "
 "momentum plane waves e^{ipx/ℏ}/√(2πℏ) are not normalizable — they live in Φ'. "
 "The triple provides a rigorous home for Dirac's notation."),

("WF", "What fails if we drop the assumption that the map preserving transition probabilities "
       "in Wigner's theorem is bijective (one-to-one and onto)?",
 "Without bijectivity, the map need not be unitary or antiunitary. "
 "Non-bijective maps can preserve transition probabilities: e.g. constant map (sends everything "
 "to a fixed state) trivially preserves |⟨fixed|ψ⟩|² = const but is not a symmetry. "
 "Bijectivity is needed to ensure the map has an inverse that also preserves probabilities, "
 "making it a true symmetry operation (group element). Without it, Wigner's lifting theorem fails."),

("WF", "What fails if the spectral theorem is applied to an operator that is symmetric "
       "but not self-adjoint?",
 "For a merely symmetric (not self-adjoint) operator: (i) real eigenvalues are not guaranteed "
 "for the full operator — the adjoint Â† may have complex eigenvalues on D(Â†)\\D(Â); "
 "(ii) eigenvectors need not form a complete orthonormal system; "
 "(iii) the spectral measure E_λ (projection-valued measure) is not well-defined; "
 "(iv) Stone's theorem fails — e^{iÂt} is not a well-defined unitary group. "
 "The spectral theorem requires self-adjointness."),

("WF", "What fails in the Riesz representation theorem if ℋ is not complete?",
 "In a pre-Hilbert space (inner product but not complete), not every bounded linear functional "
 "has a representing vector in the space. "
 "Example: D = C([0,1]) with L²-inner product is a pre-Hilbert space. "
 "The evaluation functional f(g) = g(0) is bounded on D but its Riesz representative "
 "would be the delta function δ(x), which is not in D. "
 "Completeness (Hilbert space) is precisely what makes the Riesz theorem true."),

("CN", "Connect the C*-identity ‖Â†Â‖ = ‖Â‖² to the physical statement that "
       "observables have well-defined variance.",
 "C*-identity: ‖Â†Â‖ = ‖Â‖². For a Hermitian Â = Â†: ‖Â‖² = ‖Â²‖ = spectral radius of Â². "
 "The variance is (ΔÂ)² = ⟨Â²⟩ − ⟨Â⟩² = ‖(Â−⟨Â⟩)|ψ⟩‖² ≥ 0. "
 "The C*-identity ensures the operator norm controls the spectral radius, "
 "bounding all possible measurement spreads: |⟨Â²⟩| ≤ ‖Â²‖ = ‖Â‖². "
 "This is the backbone of the Robertson–Schrödinger uncertainty relations."),

("CN", "Connect the Riesz representation theorem to the existence of the adjoint operator.",
 "For bounded Â, fix |φ⟩ ∈ ℋ and define f: ℋ → ℂ by f(|ψ⟩) = ⟨φ|Â|ψ⟩. "
 "This is a bounded linear functional (|f(|ψ⟩)| ≤ ‖φ‖·‖Â‖·‖ψ‖). "
 "By Riesz: ∃ unique |χ⟩ s.t. f(|ψ⟩) = ⟨χ|ψ⟩ for all |ψ⟩. "
 "Define Â†|φ⟩ := |χ⟩. This defines Â† uniquely and proves ⟨φ|Â|ψ⟩ = ⟨Â†φ|ψ⟩. "
 "The Riesz theorem is precisely what makes the adjoint well-defined."),

("CN", "Connect separability of L²(ℝ) to the existence of the Fourier basis.",
 "Separability: L²(ℝ) has a countable ONB. "
 "The Fourier basis {eₙ}ₙ∈ℤ (e.g. on L²([0,2π]): eₙ(x)=e^{inx}/√(2π)) is a countable ONB "
 "by the completeness of the trigonometric system (Parseval's theorem). "
 "On L²(ℝ): Hermite functions {hₙ}ₙ≥0 form a countable ONB. "
 "Separability is precisely the assertion that such a countable ONB exists; "
 "the Fourier/Hermite basis is an explicit witness."),

("CN", "How does the von Neumann deficiency index theory connect the structure of the adjoint "
       "to the classification of self-adjoint extensions?",
 "For a symmetric Â on dense D(Â), the deficiency spaces are N± = ker(Â* ∓ i) = ker(Â† ∓ i). "
 "Deficiency indices n± = dim N±. Self-adjoint extensions exist iff n₊ = n₋. "
 "The space of extensions is parametrised by U(n₊) when n₊=n₋=n (isometries N₊→N₋). "
 "For p̂ = −iℏd/dx on C_c^∞(0,1): N₊=N₋=ℂ¹ (n±=1), giving a U(1)-family of s.a. extensions "
 "parametrised by boundary condition ψ(1) = e^{iθ}ψ(0), θ ∈ [0,2π)."),
],
"rubric": [
  "Each question: Correct identification of key distinction/connection (1.0 pt) + "
  "Rigorous short argument or counterexample (1.0 pt). Total: 20 points. Duration: 35–50 minutes.",
],
"tier_routing": [
  ("MSc", "Standard rigorous results; rays and operators; Riesz theorem applications"),
  ("PhD", "Precise domain conditions; deficiency indices; functional analysis depth"),
],
}

# ─── SPSG ─────────────────────────────────────────────────────────────────
SPSG = {
"partA": [
  ("1", "For Â = [[2,1+i],[1−i,3]] on ℂ², compute: (a) Â†, confirming Â is Hermitian; "
        "(b) eigenvalues λ₁,λ₂ and orthonormal eigenvectors; "
        "(c) spectral decomposition Â = λ₁P̂₁ + λ₂P̂₂; "
        "(d) verify P̂₁+P̂₂ = 1̂ and P̂ᵢP̂ⱼ = δᵢⱼP̂ᵢ. "
        "[MSc: also compute Tr(Â) and verify λ₁+λ₂ = Tr(Â).]"),
  ("2", "The density matrix ρ̂ = (1/3)|+⟩⟨+| + (2/3)|−⟩⟨−|. "
        "(a) Verify ρ̂ ≥ 0 and Tr(ρ̂) = 1. "
        "(b) Compute Tr(ρ̂²) and classify as pure or mixed. "
        "(c) Compute ⟨Ŝz⟩ρ = Tr(ρ̂Ŝz) using the density matrix formalism. "
        "(d) [PhD] Show ρ̂ is trace-class: ‖ρ̂‖₁ = Tr(|ρ̂|) = Tr((ρ̂†ρ̂)^{1/2})."),
  ("3", "For p̂ = −iℏd/dx, compute the commutator [x̂, p̂]ψ(x) explicitly by acting on "
        "a test function ψ ∈ S(ℝ). Verify [x̂, p̂] = iℏ. "
        "[PhD] Identify the precise domain on which this computation is valid and why "
        "it cannot be extended naively to all of L²(ℝ)."),
  ("4", "A Hermitian operator Â has spectrum σ(Â) ⊂ {0,1,2,...}. "
        "Define N̂ = Â and â = (â₁, â₂) via the raising/lowering algebra â|n⟩ = √n|n−1⟩, "
        "â†|n⟩ = √(n+1)|n+1⟩ on the basis {|n⟩}. "
        "Verify: (a) [â, â†] = 1̂; (b) â†â = N̂; "
        "(c) [MSc/PhD] verify â is unbounded and compute its adjoint."),
],
"partB": [
  ("5", "The Fourier transform F: L²(ℝ) → L²(ℝ) defined by (Ff)(k) = ∫f(x)e^{−ikx}dx/√(2π). "
        "(a) Show F is a unitary operator (FF† = 1̂) using Plancherel's theorem. "
        "(b) Verify F†p̂F = x̂/ℏ on Schwartz space S(ℝ). "
        "(c) [PhD] Why can F not be straightforwardly extended to all of L²(ℝ) in the pointwise sense?"),
  ("6", "The delta function δ(x−a) as an element of S'(ℝ). "
        "(a) Show ⟨δₐ, φ⟩ = φ(a) defines a continuous linear functional on S(ℝ). "
        "(b) Interpret ⟨x|a⟩ = δ(x−a) in the Gel'fand triple S ⊂ L² ⊂ S'. "
        "(c) Verify the resolution of identity ∫|x⟩⟨x|dx = 1̂ acts correctly on |ψ⟩ ∈ L²(ℝ)."),
  ("7", "Compute the spectrum of Â = d²/dx² on L²([0,π]) with Dirichlet boundary conditions "
        "ψ(0) = ψ(π) = 0. "
        "(a) Find eigenfunctions and eigenvalues. "
        "(b) Show the eigenfunctions form an ONB for L²([0,π]). "
        "(c) [PhD] Verify Â is self-adjoint (not merely symmetric) on the domain H²([0,π])∩H₀¹([0,π])."),
],
"partC": [
  ("8", "Wigner's theorem: a map T on pure states that preserves |⟨φ|ψ⟩|² is unitary or antiunitary. "
        "(a) State the theorem precisely. "
        "(b) For the map T: |ψ⟩ ↦ |ψ⟩* (complex conjugation in a fixed basis), "
        "    identify whether it is unitary or antiunitary and verify it preserves |⟨φ|ψ⟩|². "
        "(c) [PhD] What is the U(1) ambiguity in the lifting, and why does it not affect physics?"),
  ("9", "Let Û = e^{iθÂ} where Â = Â† is bounded. "
        "(a) Show Û is unitary by computing ÛÛ†. "
        "(b) Compute dÛ/dθ|_{θ=0} and verify it equals iÂ. "
        "(c) [PhD] If Â is unbounded (self-adjoint on dense D(Â)), state which additional "
        "    condition ensures e^{iθÂ} is still a well-defined unitary group (Stone's theorem)."),
  ("10", "[MSc/PhD] The operator norm satisfies ‖Â‖ = sup_{λ ∈ σ(Â)} |λ| for normal operators. "
         "(a) Prove this for Hermitian Â using the spectral theorem: Â = ∫λ dE_λ. "
         "(b) Show ‖Â‖² = ‖Â†Â‖ (C*-identity) for any bounded Â. "
         "(c) Deduce ‖Â‖ = ‖Â†‖."),
],
"rubric": [
  "Per problem: Correct result with domain/condition check (50%) + "
  "Correct method and rigorous notation (35%) + Physical interpretation (15%)",
],
}

# ─── CPSG ─────────────────────────────────────────────────────────────────
CPSG = {
"problems": [
  {
   "num": "1", "title": "Riesz Representation and the Adjoint",
   "parts": [
     ("a", "State the Riesz representation theorem for Hilbert spaces. "
            "Prove it for finite-dimensional ℋ = ℂⁿ. [Hint: use the ONB.] [8 marks]"),
     ("b", "Using the Riesz theorem, prove the existence and uniqueness of the adjoint Â† "
            "for any bounded operator Â: ℋ → ℋ. [8 marks]"),
     ("c", "Show that the map Â ↦ Â† is antilinear: (αÂ+βB̂)† = α*Â†+β*B̂†. [4 marks]"),
     ("d", "[PhD] In infinite dimensions, explain precisely why the Riesz theorem requires "
            "completeness. Give a counterexample in a pre-Hilbert space. [6 marks]"),
   ],
   "rubric": "Hypotheses (15%) | Proof structure (40%) | Functional analysis arguments (30%) | Connections (15%)"
  },
  {
   "num": "2", "title": "Self-Adjoint Extensions of p̂",
   "parts": [
     ("a", "Define p̂ = −iℏd/dx on D₀ = C_c^∞(0,1) ⊂ L²([0,1]). "
            "Show p̂ is symmetric on D₀: ⟨φ|p̂ψ⟩ = ⟨p̂φ|ψ⟩ for φ,ψ ∈ D₀. [5 marks]"),
     ("b", "Compute the deficiency spaces N± = ker(p̂* ∓ i) and deficiency indices n±. "
            "[Note: p̂*φ = −iℏdφ/dx on D(p̂*) = H¹([0,1]).] [8 marks]"),
     ("c", "Show that each self-adjoint extension p̂_θ is parametrised by θ ∈ [0,2π) via "
            "the boundary condition ψ(1) = e^{iθ}ψ(0). Compute the spectrum of p̂_θ. [8 marks]"),
     ("d", "[PhD] Interpret the different spectra of p̂_θ physically (a particle on a ring "
            "with flux θ). What observable differs between different choices of θ? [5 marks]"),
   ],
   "rubric": "Hypotheses (15%) | Proof structure (40%) | Functional analysis (30%) | Physical insight (15%)"
  },
  {
   "num": "3", "title": "Spectral Theorem and Functional Calculus",
   "parts": [
     ("a", "State the spectral theorem for bounded self-adjoint operators on a Hilbert space: "
            "Â = ∫_{σ(Â)} λ dE_λ. Define projection-valued measure (PVM) E precisely. [6 marks]"),
     ("b", "For the harmonic oscillator Ĥ = ℏω(N̂ + 1/2), construct the spectral measure "
            "explicitly: E_λ = Σ_{n: ℏω(n+1/2) ≤ λ} |n⟩⟨n|. "
            "Verify the PVM axioms: E_{-∞}=0, E_{+∞}=1̂, E_λE_μ = E_{min(λ,μ)}. [8 marks]"),
     ("c", "Using the functional calculus, compute f(Ĥ) for f(x) = e^{−βx} (β > 0). "
            "Evaluate Tr(f(Ĥ)) and identify it as the canonical partition function. [6 marks]"),
     ("d", "[PhD] Prove the Borel functional calculus is the unique *-homomorphism from "
            "bounded Borel functions on σ(Â) to B(ℋ) satisfying f(Â) → 1̂ pointwise. [6 marks]"),
   ],
   "rubric": "Hypotheses (15%) | Proof structure (40%) | Analysis arguments (30%) | Connections (15%)"
  },
  {
   "num": "4", "title": "Rigged Hilbert Space and Continuous Spectrum",
   "parts": [
     ("a", "Define the Gel'fand triple Φ ⊂ ℋ ⊂ Φ' for the case Φ = S(ℝ), ℋ = L²(ℝ). "
            "Explain what 'nuclear' means for Φ and why it is required. [6 marks]"),
     ("b", "Show that the 'eigenvectors' of x̂ with eigenvalue a are δ(x−a), "
            "regarded as elements of S'(ℝ). Verify x̂δ(x−a) = a·δ(x−a) in the distributional sense. [6 marks]"),
     ("c", "State the nuclear spectral theorem: for Â nuclear (or rigged), the generalised "
            "eigenvectors {|a⟩} ∈ Φ' satisfy the resolution of identity ∫|a⟩⟨a|dμ(a) = 1̂ "
            "in the sense of Φ'. Apply to Â = x̂. [8 marks]"),
     ("d", "[PhD] Discuss the sense in which the completeness relation ∫|x⟩⟨x|dx = 1̂ "
            "is NOT an orthonormal basis expansion in ℋ but IS valid in Φ'. [6 marks]"),
   ],
   "rubric": "Hypotheses (15%) | Proof structure (40%) | Analysis arguments (30%) | Connections (15%)"
  },
  {
   "num": "5", "title": "Fubini–Study Metric and Projective Hilbert Space",
   "parts": [
     ("a", "Define projective Hilbert space ℙ(ℋ) as the set of rays [ψ] = {e^{iθ}|ψ⟩ : θ ∈ ℝ}. "
            "Define the Fubini–Study distance: d_FS([φ],[ψ])² = 1 − |⟨φ̂|ψ̂⟩|² "
            "where |φ̂⟩,|ψ̂⟩ are unit representatives. Show d_FS is well-defined on rays. [6 marks]"),
     ("b", "Show d_FS([φ],[ψ])² ∈ [0,1] for unit states, and interpret d_FS = 0 and d_FS = 1 physically. [4 marks]"),
     ("c", "Show the transition probability P(φ→ψ) = |⟨φ|ψ⟩|² = 1 − d_FS([φ],[ψ])² "
            "is a function only of the rays. [5 marks]"),
     ("d", "[PhD] Show that for ℋ = ℂ², ℙ(ℋ) = ℙ¹(ℂ) ≅ S² with the Fubini–Study metric "
            "being 1/4 of the round metric. Relate geodesic distance on S² to d_FS. [7 marks]"),
   ],
   "rubric": "Hypotheses (15%) | Proof structure (40%) | Analysis arguments (30%) | Insight (15%)"
  },
],
}

# ─── SPJG ─────────────────────────────────────────────────────────────────
SPJG = [
{
 "num": "1", "title": "Operator Domain Explorer",
 "time": "4–6 hours",
 "objective": "For p̂ on three different domains, classify as Hermitian/symmetric/self-adjoint; "
               "tabulate deficiency indices.",
 "spec": [
   "Domain A: D_A = C_c^∞(0,1) ⊂ L²([0,1]) — smooth compactly supported",
   "Domain B: D_B = {ψ ∈ H¹([0,1]) : ψ(0)=ψ(1)=0} — Dirichlet BC",
   "Domain C: D_C = {ψ ∈ H¹([0,1]) : ψ(1)=e^{iθ}ψ(0)} — quasi-periodic BC",
   "For each domain: (i) verify symmetric; (ii) compute D(p̂*); "
   "(iii) determine if self-adjoint; (iv) compute n± deficiency indices",
   "Deliverable: 2–3 page technical note + table of results",
 ],
 "rubric": "Mathematical correctness (40%) | Rigour of conditions (25%) | Clarity (25%) | Reproducibility (10%)",
},
{
 "num": "2", "title": "Density Matrix Diagnostics",
 "time": "3–5 hours",
 "objective": "Given six 4×4 complex matrices, test each for validity as a density matrix "
               "and classify: pure/mixed/entangled.",
 "spec": [
   "For each matrix ρ: (i) check ρ = ρ†; (ii) check ρ ≥ 0 (all eigenvalues ≥ 0); "
   "(iii) check Tr(ρ) = 1; (iv) compute Tr(ρ²) to classify pure (=1) or mixed (<1)",
   "For 4×4 matrices on ℂ²⊗ℂ² (two qubits): test entanglement via partial trace ρ_A = Tr_B(ρ); "
   "if ρ_A is mixed while ρ is pure, state is entangled",
   "Include at least one example each of: pure product state, pure entangled state, mixed state",
   "Deliverable: 2–4 page note + code (numpy) + classification table",
 ],
 "rubric": "Mathematical correctness (40%) | Rigour of positivity/trace checks (25%) | Clarity (25%) | Reproducibility (10%)",
},
{
 "num": "3", "title": "Spectral Measure Calculator",
 "time": "4–7 hours",
 "objective": "For the quantum harmonic oscillator truncated at n_max = 30, construct the "
               "spectral projection E_λ numerically and verify the spectral theorem.",
 "spec": [
   "Represent Ĥ = ℏω(N̂+1/2) in the Fock basis {|0⟩,...,|30⟩}: diagonal matrix with entries ℏω(n+1/2)",
   "Spectral projection: E_λ = Σ_{n: Eₙ≤λ} |n⟩⟨n| (step function of λ)",
   "Verify: (i) E_λ² = E_λ; (ii) E_λE_μ = E_{min(λ,μ)}; (iii) E_{+∞} = 1̂; "
   "(iv) ∫λ dE_λ = Ĥ (numerically, as a sum)",
   "Plot the spectral function λ ↦ Tr(E_λ·ρ̂) for the thermal state ρ̂ = e^{−βĤ}/Z",
   "Deliverable: 2–4 page note + Python code + plots",
 ],
 "rubric": "Mathematical correctness (40%) | Rigour of PVM axiom checks (25%) | Clarity (25%) | Reproducibility (10%)",
},
{
 "num": "4", "title": "Wigner Function Sampler",
 "time": "4–6 hours",
 "objective": "Compute and plot the Wigner quasi-probability distribution for four quantum states; "
               "identify negativity signatures of non-classicality.",
 "spec": [
   "States: (i) coherent state |α⟩, α=1.5; (ii) Fock state |n=2⟩; "
   "(iii) Schrödinger cat (|α⟩+|−α⟩)/N; (iv) thermal state ρ̂_th at β=0.5",
   "W(x,p) = (1/πℏ)∫⟨x+y|ρ̂|x−y⟩e^{2ipy/ℏ}dy — compute via density matrix in position basis",
   "Required: (i) verify ∫W(x,p)dxdp = 1 for each state; "
   "(ii) identify regions where W < 0 (non-classical); "
   "(iii) verify marginals: ∫W dp = |⟨x|ψ⟩|², ∫W dx = |⟨p|ψ⟩|²",
   "Deliverable: 2–3 page note + Python code + 4 Wigner plots (colour maps)",
 ],
 "rubric": "Mathematical correctness (40%) | Rigour of checks (25%) | Clarity (25%) | Reproducibility (10%)",
},
{
 "num": "5", "title": "Ray Geometry Visualiser — Bloch Sphere as ℙ¹(ℂ)",
 "time": "3–5 hours",
 "objective": "Implement and visualise the Fubini–Study metric on ℙ¹(ℂ) ≅ S²; "
               "compute geodesic distances between given states.",
 "spec": [
   "Parametrise |ψ(θ,φ)⟩ = cos(θ/2)|0⟩ + e^{iφ}sin(θ/2)|1⟩ (Bloch sphere coordinates)",
   "Compute d_FS([ψ₁],[ψ₂]) = arccos|⟨ψ₁|ψ₂⟩| for five pairs of states; "
   "verify d_FS equals half the geodesic angle on S²",
   "Visualise: 3D Bloch sphere + plot 3 geodesics between specified state pairs",
   "Show: (i) antipodal states (|0⟩ and |1⟩) have d_FS = π/2 (maximum); "
   "(ii) d_FS([ψ],[e^{iα}ψ]) = 0 for any global phase α",
   "Deliverable: 2–3 page note + Python code + Bloch sphere figure",
 ],
 "rubric": "Mathematical correctness (40%) | Rigour of checks (25%) | Clarity (25%) | Reproducibility (10%)",
},
]

# ─── CPJG ─────────────────────────────────────────────────────────────────
CPJG = [
{
 "num": "1", "title": "Real vs. Complex Hilbert Space",
 "time": "12–18 hours",
 "objective": "Identify which quantum phenomena fail in a real Hilbert space; "
               "connect to Wigner's theorem over ℝ.",
 "questions": [
   "Which observables and states can be defined over ℝ?",
   "Show that e^{iĤt/ℏ} cannot be represented as a real orthogonal operator for generic Ĥ",
   "Where does the Born rule fail or become ambiguous over ℝ?",
   "State Wigner's theorem over ℝ — does antiunitary still arise?",
   "Identify at least one operational test distinguishing real from complex QM (cf. Renou et al. 2021)",
 ],
 "deliverable": "6–10 page technical report + appendix with examples",
 "rubric": "Technical rigour (30%) | Conceptual synthesis (30%) | Depth and exposition (25%) | Originality (15%)",
},
{
 "num": "2", "title": "Self-Adjoint Extensions and their Physical Spectra",
 "time": "14–20 hours",
 "objective": "For p̂ on [0,1] with varied boundary conditions, classify all self-adjoint extensions "
               "and compute their spectra; interpret physically.",
 "questions": [
   "Prove the family p̂_θ (ψ(1)=e^{iθ}ψ(0)) exhausts all s.a. extensions of p̂|_{C_c^∞}",
   "Compute σ(p̂_θ) = {ℏ(2πn+θ)/L : n ∈ ℤ} explicitly",
   "Interpret as a particle on [0,L] with magnetic flux Φ; relate θ to Aharonov–Bohm phase",
   "Plot spectra as functions of θ ∈ [0,2π); identify level crossings",
   "Discuss: which extension is 'physical'? Is there a preferred choice without additional input?",
 ],
 "deliverable": "6–10 page report + appendix + plots",
 "rubric": "Technical rigour (30%) | Conceptual synthesis (30%) | Depth (25%) | Originality (15%)",
},
{
 "num": "3", "title": "Rigged Hilbert Space Construction — Harmonic Oscillator",
 "time": "12–16 hours",
 "objective": "Build explicitly the Gel'fand triple Φ ⊂ L²(ℝ) ⊂ Φ' for the harmonic oscillator; "
               "identify the generalised eigenvectors of x̂.",
 "questions": [
   "Define Φ as the intersection of all domains D(Ĥⁿ) for the harmonic oscillator Ĥ; "
   "show Φ coincides with the Schwartz space S(ℝ)",
   "Define the topology on Φ via the seminorms p_n(f) = ‖Ĥⁿf‖₂; show Φ is a Fréchet space",
   "Define Φ' as continuous antilinear functionals on Φ; show δ(x−a) ∈ Φ'",
   "Expand an arbitrary ψ ∈ Φ in Hermite functions; show convergence in Φ-topology",
   "Discuss: in what precise sense is x̂ 'diagonalised' in the rigged sense?",
 ],
 "deliverable": "6–10 page report + appendix",
 "rubric": "Technical rigour (30%) | Conceptual synthesis (30%) | Depth (25%) | Originality (15%)",
},
{
 "num": "4", "title": "Projective Space and Entanglement — Segre Embedding",
 "time": "14–20 hours",
 "objective": "Characterise the image of the Segre embedding ℙ¹(ℂ)×ℙ¹(ℂ) ↪ ℙ³(ℂ); "
               "interpret the complement as entangled states.",
 "questions": [
   "Write the Segre map σ: ([z₀:z₁],[w₀:w₁]) ↦ [z₀w₀:z₀w₁:z₁w₀:z₁w₁] in ℙ³(ℂ); "
   "show its image is the quadric variety {[a:b:c:d]: ad−bc=0}",
   "Show that product states |ψ⟩⊗|φ⟩ in ℂ²⊗ℂ² correspond exactly to image points",
   "Show that the complement (entangled states) corresponds to {ad−bc≠0} — open dense subset",
   "Compute the entanglement entropy S = −Tr(ρ_A log ρ_A) for points in the complement; "
   "show it vanishes iff the state is a product (Segre image) state",
   "Discuss: is the set of entangled states 'large' or 'small' in ℙ³(ℂ)?",
 ],
 "deliverable": "6–10 page report + appendix",
 "rubric": "Technical rigour (30%) | Conceptual synthesis (30%) | Depth (25%) | Originality (15%)",
},
{
 "num": "5", "title": "Measurement Model Analysis — von Neumann, Lüders, POVM",
 "time": "12–18 hours",
 "objective": "Compare von Neumann, Lüders, and POVM update rules; identify conditions "
               "under which they agree and diverge.",
 "questions": [
   "State each update rule: von Neumann (sharp projective), Lüders (selective), POVM (general)",
   "Show they agree when the measurement is sharp (rank-1 projectors) and non-degenerate",
   "Construct a concrete example (degenerate observable with 2-fold degeneracy) where "
   "von Neumann and Lüders give different post-measurement states",
   "Discuss the role of the C*-algebraic framework (POVM = positive operator-valued measure); "
   "show that POVMs subsume both projective schemes",
   "Identify one physically realizable scenario (e.g. photon polarisation measurement) "
   "where the distinction matters operationally",
 ],
 "deliverable": "6–10 page report",
 "rubric": "Technical rigour (30%) | Conceptual synthesis (30%) | Depth (25%) | Originality (15%)",
},
]

# ─── WRQ ──────────────────────────────────────────────────────────────────
WRQ = [
{
 "num": "WRQ-1",
 "question": "Why does quantum mechanics require complex Hilbert space rather than real? "
              "What specific physical phenomena fail or become ambiguous over ℝ?",
 "scope": "5–8 hours",
 "method": [
   "Review: Stueckelberg (1960) on real QM; Hardy (2001) operational axioms; "
   "Renou et al. (2021) experimental test distinguishing real from complex QM",
   "Show: e^{−iĤt/ℏ} requires complex structure — cannot be real-orthogonal for generic Ĥ",
   "Analyse: interference in double-slit experiment — does the cross-term require complex amplitudes?",
   "State Wigner's theorem over ℝ and identify what changes (antiunitary class expands)",
   "Conclude: is complex structure fundamental or emergent from some deeper axiom?",
 ],
 "deliverable": "2–6 page memo: question, method, evidence (math + citations), conclusion, 5–10 refs",
 "rubric": "Clear scope and method (25%) | Evidence quality (25%) | Technical content (25%) | Quality of argument (25%)",
},
{
 "num": "WRQ-2",
 "question": "What exactly is the physical content of the Hellinger–Toeplitz theorem, "
              "and what does it tell us about the structure of quantum observables?",
 "scope": "5–8 hours",
 "method": [
   "State H-T precisely: symmetric + D(Â)=ℋ ⟹ bounded. Proof via closed graph theorem.",
   "Trace consequences: every physical observable corresponding to a continuous spectrum "
   "(x̂, p̂, Ĥ of infinite system) must have a restricted domain",
   "Historical: von Neumann's (1932) mathematical foundations; problem of 'all of ℋ'",
   "Analyse: what physical constraint forces domain restriction in practice? "
   "(Answer: square-integrability of xψ(x) etc.)",
   "Compare: bounded observables (spin) vs. unbounded (position, energy of H-atom)",
 ],
 "deliverable": "2–6 page memo with statement, proof sketch, physical consequences, 5–10 refs",
 "rubric": "Clear scope (25%) | Evidence (25%) | Technical content (25%) | Argument quality (25%)",
},
{
 "num": "WRQ-3",
 "question": "When and why did von Neumann introduce the density operator, and what physical "
              "problem does it solve that pure state vectors cannot address?",
 "scope": "5–8 hours",
 "method": [
   "Primary source: von Neumann (1927) Göttingen lectures; (1932) Chapter IV",
   "Identify the problem: statistical mixtures of pure states vs. coherent superpositions — "
   "both give the same probability distribution for some observables but different for others",
   "Show ρ = Σₖ pₖ|ψₖ⟩⟨ψₖ| is the most general state description encoding classical ignorance",
   "Distinguish mixed state from coherent superposition via off-diagonal elements (coherences)",
   "Physical example: open system + environment; thermal equilibrium ρ = e^{−βĤ}/Z",
 ],
 "deliverable": "2–6 page memo with historical + technical analysis, 5–10 refs",
 "rubric": "Clear scope (25%) | Evidence (25%) | Technical content (25%) | Argument quality (25%)",
},
{
 "num": "WRQ-4",
 "question": "What is the minimal set of axioms on an inner product space that forces "
              "the Born rule to take the form P = |⟨a|ψ⟩|²? Compare Gleason's theorem "
              "with the Dirac–von Neumann postulates.",
 "scope": "6–10 hours",
 "method": [
   "State Gleason's theorem (1957): every measure on closed subspaces of ℋ with dim≥3 "
   "has the form μ(P) = Tr(ρP) for a unique density matrix ρ",
   "Trace the assumptions: (i) ℋ over ℝ or ℂ; (ii) dim ≥ 3; (iii) σ-additivity",
   "Compare with Dirac–von Neumann axioms: direct postulation of Born rule vs. derivation",
   "Analyse: does Gleason's theorem 'derive' Born rule or merely characterise it?",
   "Discuss dim=2 failure: in ℂ² any assignment works (not forced by measure theory)",
 ],
 "deliverable": "2–6 page memo: theorem statement, comparison, assessment, 5–10 refs",
 "rubric": "Clear scope (25%) | Evidence (25%) | Technical content (25%) | Argument quality (25%)",
},
{
 "num": "WRQ-5",
 "question": "How does separability of the Hilbert space enter physically — is it an "
              "assumption about nature, or a mathematical convenience?",
 "scope": "5–8 hours",
 "method": [
   "Define separability: countable ONB exists. Non-separable example: L²(ℝ, Bohr measure)",
   "Physical systems: free particle (L²(ℝ) — separable); many identical bosons "
   "(Fock space — separable if single-particle ℋ is separable)",
   "Problematic cases: QFT with uncountably many degrees of freedom; "
   "von Neumann (1938) algebras with non-separable representations",
   "Operational question: design an experiment distinguishing separable from non-separable "
   "state space. What would constitute evidence?",
   "Conclude: is separability a physical axiom or a technical regularity condition?",
 ],
 "deliverable": "2–6 page memo, 5–10 refs",
 "rubric": "Clear scope (25%) | Evidence (25%) | Technical content (25%) | Argument quality (25%)",
},
]

# ─── ORQ ──────────────────────────────────────────────────────────────────
ORQ = [
{
 "num": "ORQ-1",
 "question": "Can quantum mechanics be formulated over a quaternionic Hilbert space ℍ? "
              "What would change about the structure of observables, symmetries, and the Born rule?",
 "scope": "12–20 hours",
 "framing": [
   "Adler (1995) 'Quaternionic Quantum Mechanics and Quantum Fields' — the primary reference",
   "Over ℍ: inner products are ℍ-valued; observables must be self-adjoint but ℍ is non-commutative",
   "The spectral theorem fails in the naive sense (ℍ has no algebraic closure analogous to ℂ)",
   "Wigner's theorem: antiunitary symmetries still arise but the classification changes",
   "Physical question: has any experimental prediction distinguished quaternionic from complex QM?",
   "Consider: Barnum et al. (2014) on no-go theorems for quaternionic QM with local tomography",
 ],
 "deliverable": "4–10 page proposal note: motivation, what is known, your proposal, how to test, limitations",
 "rubric": "Clarity of framing (25%) | Depth of engagement (25%) | Novelty/plausibility (25%) | Awareness of limitations (25%)",
},
{
 "num": "ORQ-2",
 "question": "Can quantum measurement be formulated without projective collapse — "
              "reproducing all observed statistics while avoiding the measurement problem?",
 "scope": "14–20 hours",
 "framing": [
   "Projective collapse: immediate post-measurement state is an eigenstate of the observable",
   "Alternatives: many-worlds (Everett), consistent histories (Griffiths), relational QM (Rovelli), "
   "objective collapse models (GRW, CSL), POVMs without specifying post-measurement state",
   "Focus: construct a mathematically minimal formulation using only CPTP maps (no wavefunction collapse)",
   "Question: can such a formulation reproduce all experimental predictions including Bell tests?",
   "Propose: what observable would distinguish different collapse schemes? Is there any?",
 ],
 "deliverable": "4–10 page proposal note",
 "rubric": "Clarity (25%) | Depth (25%) | Novelty/plausibility (25%) | Limitations (25%)",
},
{
 "num": "ORQ-3",
 "question": "Can the Gel'fand triple be replaced by an alternative foundation that "
              "avoids distributions entirely while retaining a rigorous continuous spectrum?",
 "scope": "12–18 hours",
 "framing": [
   "The Gel'fand triple handles continuous spectrum (x̂, p̂) but requires distributional machinery",
   "Alternative 1: spectral theorem for self-adjoint operators — no distributions needed, "
   "but 'eigenvectors' are not in ℋ",
   "Alternative 2: non-standard analysis (Robinson) — infinitesimals allow delta functions as actual functions",
   "Alternative 3: algebraic approach (C*-algebras) — observables as algebra elements, no state space needed",
   "Propose: which approach is mathematically simplest while retaining full physical content?",
 ],
 "deliverable": "4–10 page proposal note",
 "rubric": "Clarity (25%) | Depth (25%) | Novelty/plausibility (25%) | Limitations (25%)",
},
{
 "num": "ORQ-4",
 "question": "Are there physically motivated generalisations of Wigner's theorem — to mixed states, "
              "open systems, or approximate symmetries — requiring a structurally different result?",
 "scope": "14–20 hours",
 "framing": [
   "Wigner (1931): bijections on ℙ(ℋ) preserving |⟨φ|ψ⟩|² lift to unitary or antiunitary",
   "Uhlhorn (1963): weaker assumption (preserves orthogonality) still gives same result for dim≥3",
   "For mixed states (density matrices): Kadison (1965) symmetries of density matrices = "
   "unitary or antiunitary conjugation on the underlying Hilbert space",
   "For open systems: quantum channels (CPTP maps) — what symmetries preserve the channel?",
   "Approximate symmetries: ε-approximate unitary — what is the stability of Wigner's theorem?",
 ],
 "deliverable": "4–10 page proposal note",
 "rubric": "Clarity (25%) | Depth (25%) | Novelty/plausibility (25%) | Limitations (25%)",
},
{
 "num": "ORQ-5",
 "question": "Is separability of the Hilbert space a physical assumption or a mathematical "
              "regularity condition? Design an operational test distinguishing separable "
              "from non-separable state spaces in principle.",
 "scope": "12–18 hours",
 "framing": [
   "Separable ℋ: admits countable ONB; sufficient for all standard QM and QFT (in finite volume)",
   "Non-separable: arises in QFT in infinite volume (thermodynamic limit), von Neumann factors "
   "of type III (KMS states, Haag-Kastler algebras)",
   "The question: is there any observable difference between physics in a separable vs. "
   "non-separable Hilbert space for a finite observer?",
   "Proposal: define an operational test — what sequence of measurements would distinguish them?",
   "Connect to: algebraic QFT (local algebras), superselection sectors, DHR analysis",
 ],
 "deliverable": "4–10 page proposal note",
 "rubric": "Clarity (25%) | Depth (25%) | Novelty/plausibility (25%) | Limitations (25%)",
},
]

# ─── BIBLIOGRAPHY ADDITIONS ───────────────────────────────────────────────
BIB = {
"BIB-T1": [
  {
   "author": "Penrose, R.",
   "title": "The Road to Reality: A Complete Guide to the Laws of the Universe",
   "pub": "Jonathan Cape, 2004.",
   "badges": ["T1","T2"],
   "type": "N",
   "stars": "★★",
   "annotation": "Chapters 12–17 cover complex numbers, Hilbert space, and quantum state vectors "
     "at an expansive but accessible level. Chapter 14 on the quantum particle introduces "
     "inner products and norms intuitively using geometric language. Ideal T1 pre-reading for "
     "Module I.1 L01 before engaging with any formal axioms. Supports SCQU warmup questions "
     "on what ‖|ψ⟩‖=1 means physically.",
   "categories": ["A"],
  },
],
"BIB-T2": [
  {
   "author": "Shankar, R.",
   "title": "Principles of Quantum Mechanics (2nd ed.)",
   "pub": "Springer, 1994.",
   "badges": ["T2"],
   "type": "T",
   "stars": "★★★",
   "annotation": "Chapter 1 (Mathematical Introduction) provides a complete self-contained "
     "treatment of vector spaces, inner products, and operators — directly mapping onto "
     "Module I.1 L01 LO1–LO4. The worked exercises in §1.7–1.9 (adjoint, Hermitian, "
     "unitary) are ideal companions to SPSU Part A problems 1–4. Already in Cat. [B9]; "
     "no new catalogue entry needed.",
   "categories": [],
   "existing": "B9",
  },
  {
   "author": "Byron, F. W. & Fuller, R. W.",
   "title": "Mathematics of Classical and Quantum Physics",
   "pub": "Dover, 1992.",
   "badges": ["T2","T3"],
   "type": "T",
   "stars": "★★",
   "annotation": "Chapters 4–5 (Hilbert spaces, operators) provide a bridge between Shankar-level "
     "and the full functional analysis of Tier 3. Covers inner products, completeness, and adjoint "
     "rigorously but without measure theory. Supports CPSU Problem 5 (L²(ℝ) completeness) and "
     "CCQU questions on the Riesz–Fischer theorem. Already in Cat. [B3]; no new entry.",
   "categories": [],
   "existing": "B3",
  },
],
"BIB-T3": [
  {
   "author": "Isham, C. J.",
   "title": "Lectures on Quantum Theory: Mathematical and Structural Foundations",
   "pub": "Imperial College Press, 1995.",
   "badges": ["T3"],
   "type": "T",
   "stars": "★★",
   "annotation": "Chapters 2–4 develop Hilbert spaces, bounded/unbounded operators, and the "
     "spectral theorem at AdvUG level without full measure theory. Particularly valuable for "
     "CPSU Problems 3–5 (Hellinger–Toeplitz, adjoint properties, L² completeness). "
     "Supports WRQ-2 (Hellinger–Toeplitz physical content). Already in Cat. [B7]; no new entry.",
   "categories": [],
   "existing": "B7",
  },
  {
   "author": "Hellinger, E. & Toeplitz, O.",
   "title": "Grundlagen für eine Theorie der unendlichen Matrizen",
   "pub": "Math. Ann. 69, 289–330 (1910). [P]",
   "badges": ["T3","T4"],
   "type": "P",
   "stars": "★",
   "annotation": "Original source for the Hellinger–Toeplitz theorem that every symmetric "
     "operator defined on all of a Hilbert space is bounded. Historically significant; "
     "the abstract accessible to T3 students. Directly relevant to CPSU Problem 3 "
     "and WRQ-2 (physical content of H-T). New entry [E15] in Category E.",
   "categories": ["E"],
   "new_code": "E15",
  },
],
"BIB-T4": [
  {
   "author": "Weinberg, S.",
   "title": "Lectures on Quantum Mechanics (2nd ed.)",
   "pub": "Cambridge University Press, 2015.",
   "badges": ["T4"],
   "type": "T",
   "stars": "★★★",
   "annotation": "Chapter 3 ('Mathematical Tools') is the cleanest graduate-level treatment of "
     "Hilbert spaces, including rigged Hilbert spaces and the Gel'fand triple, directly supporting "
     "Module I.1 L01 at MSc level. Supports CPSG Problem 4 (Gel'fand triple) and WRQ-4 "
     "(Born rule axiomatics). Already in Cat. [C15]; no new entry.",
   "categories": [],
   "existing": "C15",
  },
  {
   "author": "Gleason, A. M.",
   "title": "Measures on the closed subspaces of a Hilbert space",
   "pub": "J. Math. Mech. 6, 885–893 (1957). [P]",
   "badges": ["T4","T5"],
   "type": "P",
   "stars": "★★★",
   "annotation": "Derives the Born rule P=|⟨a|ψ⟩|² from measure theory on closed subspaces. "
     "The deepest axiomatic justification of the probability postulate. Essential for "
     "Module I.1 L01 WRQ-4 ('minimal axioms forcing Born rule'). Already in Cat. [E4]; "
     "no new entry. Annotation updated: now also relevant to CPSG Problem 1 (Riesz theorem).",
   "categories": [],
   "existing": "E4",
  },
  {
   "author": "Kadison, R. V. & Ringrose, J. R.",
   "title": "Fundamentals of the Theory of Operator Algebras, Vol. I",
   "pub": "Academic Press, 1983. [M]",
   "badges": ["T4","T5"],
   "type": "M",
   "stars": "★★",
   "annotation": "Definitive treatment of C*-algebras and von Neumann algebras, directly relevant to "
     "CPJG Project 5 (POVM measurement models) and ORQ-4 (generalisations of Wigner's theorem). "
     "Chapter 4 on von Neumann algebras and Chapter 7 on states and representations "
     "are the primary reading for T5 students. New entry [D8] in Category D.",
   "categories": ["D"],
   "new_code": "D8",
  },
],
"BIB-T5": [
  {
   "author": "Reed, M. & Simon, B.",
   "title": "Methods of Modern Mathematical Physics, Vol. I–II",
   "pub": "Academic Press, 1972–1975. [M]",
   "badges": ["T5"],
   "type": "M",
   "stars": "★★★",
   "annotation": "Vol. I (Functional Analysis) Chapters 2–8: rigorous Hilbert space theory, "
     "operators, spectral theorem. Vol. II (Fourier Analysis, Self-Adjointness): "
     "self-adjoint extensions, deficiency indices, Gel'fand triple. The foundation for "
     "CPSG Problems 2–4 and CPJG Projects 2–3. Already in Cat. [D6]; no new entry. "
     "Annotation updated: now explicitly linked to CPSG Problem 2 (p̂ extensions).",
   "categories": [],
   "existing": "D6",
  },
  {
   "author": "Adler, S. L.",
   "title": "Quaternionic Quantum Mechanics and Quantum Fields",
   "pub": "Oxford University Press, 1995. [M]",
   "badges": ["T5"],
   "type": "M",
   "stars": "★",
   "annotation": "Comprehensive development of quantum mechanics over the quaternions ℍ. "
     "Chapters 1–3 provide the essential formalism for ORQ-1 ('quaternionic Hilbert space'). "
     "Covers observables, spectrum, and the absence of complex phase in the quaternionic setting. "
     "New entry [D9] in Category D.",
   "categories": ["D"],
   "new_code": "D9",
  },
  {
   "author": "Renou, M.-O. et al.",
   "title": "Quantum theory based on real numbers can be experimentally falsified",
   "pub": "Nature 600, 625–629 (2021). [P]",
   "badges": ["T4","T5"],
   "type": "P",
   "stars": "★★★",
   "annotation": "Proves that real and complex Hilbert space quantum mechanics are operationally "
     "distinguishable — an experimental test using bipartite entanglement distinguishes them. "
     "Essential for WRQ-1 (why complex?) and ORQ-1 (quaternionic QM). Landmark recent paper; "
     "new entry [E16] in Category E.",
   "categories": ["E"],
   "new_code": "E16",
  },
  {
   "author": "Barnum, H. et al.",
   "title": "Local tomography and the role of the complex numbers in quantum mechanics",
   "pub": "Phil. Trans. R. Soc. A 380, 20210302 (2022). [P]",
   "badges": ["T5"],
   "type": "P",
   "stars": "★★",
   "annotation": "Proves that local tomography (state determined by local measurements) "
     "forces the complex field over real or quaternionic alternatives. "
     "Directly relevant to ORQ-1 and WRQ-1 (axioms forcing complex Hilbert space). "
     "New entry [E17] in Category E.",
   "categories": ["E"],
   "new_code": "E17",
  },
],
}
