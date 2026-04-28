"""
shared/build_lecture_full_data.py
All concept text blocks as raw strings (no f-string / LaTeX escape conflicts).
Lines are tagged: HEADER: / MATH: / TEXT: / MIXED:label|latex
"""
from __future__ import annotations

H = "HEADER:"
M = "MATH:"
T = "TEXT:"
X = "MIXED:"   # MIXED:label | latex

# ── Fixed structural blocks ────────────────────────────────────────────────────

SAKURAI_TRACK = "\n".join([
H + " SAKURAI: PREPARATION TO STATISTICS TO AMPLITUDES",
"",
H + " STEP 1 — PREPARATION",
T + " A preparation is a reproducible laboratory protocol.",
T + " The same procedure always yields the same statistical predictions.",
"",
H + " STEP 2 — MEASUREMENT OUTCOMES",
T + " A measurement device returns outcomes $a_i$ with stable frequencies.",
T + " The state encodes probabilities, not definite property values.",
"",
H + " STEP 3 — WHY AMPLITUDES?",
T + " Interference demands combining paths BEFORE squaring:",
M + r"P = |A_1 + A_2|^2 = |A_1|^2 + |A_2|^2 + 2\,\mathrm{Re}(A_1^* A_2)",
T + " The cross-term is interference — real and measurable.",
T + " Only complex amplitudes can produce this cross-term.",
"",
H + " STEP 4 — OPERATIONAL BORN RULE",
M + r"P(a_i) = |\langle a_i|\psi\rangle|^2",
M + r"\text{Normalisation: } \sum_i P(a_i) = 1 \implies \langle\psi|\psi\rangle = 1",
"",
H + " GLOBAL PHASE IS UNOBSERVABLE",
M + r"|\psi'\rangle = e^{i\theta}|\psi\rangle \implies P'(a_i) = P(a_i) \quad \forall\, a_i",
T + " Physical states are RAYS not vectors.",
])

DIRAC_POSTULATES = "\n".join([
H + " DIRAC: FIVE POSTULATES OF QUANTUM MECHANICS",
"",
H + " POSTULATE 1 — STATE SPACE",
T + r" Every physical state is a ray in a complex Hilbert space $\mathcal{H}$.",
M + r"|\psi\rangle \sim c|\psi\rangle \text{ for any nonzero } c \in \mathbb{C}",
"",
H + " POSTULATE 2 — OBSERVABLES",
T + r" Every observable $A$ corresponds to a Hermitian operator $\hat{A} = \hat{A}^\dagger$.",
M + r"\hat{A}|a\rangle = a|a\rangle, \quad a \in \mathbb{R}",
"",
H + " POSTULATE 3 — COMPLETENESS",
M + r"\langle m|n\rangle = \delta_{mn}, \qquad \sum_n |n\rangle\langle n| = \hat{I}",
M + r"|\psi\rangle = \sum_n c_n|n\rangle, \quad c_n = \langle n|\psi\rangle",
"",
H + " POSTULATE 4 — BORN RULE",
M + r"P(a) = |\langle a|\psi\rangle|^2",
T + r" Post-measurement state (ideal projective): $|\psi\rangle \to |a\rangle$",
"",
H + " POSTULATE 5 — DYNAMICS",
M + r"|\psi(t)\rangle = \hat{U}(t)|\psi(0)\rangle, \quad \hat{U}(t) = e^{-i\hat{H}t/\hbar}",
])

# ── Tier core concept blocks ───────────────────────────────────────────────────

HS_CONCEPTS = "\n".join([
H + " COMPLEX NUMBERS AS ARROWS",
T + r" A complex number $z = a + ib$ lives in a 2D plane.",
M + r"z = r\,e^{i\theta},\quad r = |z| = \sqrt{a^2+b^2},\quad z^* = a-ib",
M + r"|z|^2 = z^*z = a^2 + b^2 \geq 0",
"",
H + " AMPLITUDE TO PROBABILITY (BORN RULE)",
T + r" A quantum amplitude $A$ is a complex number for a process.",
M + r"P = |A|^2 = A^*A \geq 0",
T + " Why squaring? Gives a real, non-negative number. Phase alone does not.",
"",
H + " SUPERPOSITION = ARROW ADDITION = INTERFERENCE",
T + r" Two paths: amplitudes $A_1$ and $A_2$. Total: $A = A_1 + A_2$.",
M + r"P = |A_1 + A_2|^2 = |A_1|^2 + |A_2|^2 + 2\,\mathrm{Re}(A_1^* A_2)",
T + " Interference term can be positive (constructive) or negative (destructive).",
"",
H + " WORKED FORMULA: PHASE DEPENDENCE",
T + r" Let $A_1 = 1$, $A_2 = e^{i\phi}$ (unit magnitude, phase $\phi$).",
M + r"P(\phi) = |1 + e^{i\phi}|^2 = 2 + 2\cos\phi",
T + r" Maximum $P=4$ at $\phi=0$ (constructive). Minimum $P=0$ at $\phi=\pi$ (destructive).",
])

BEGUG_CONCEPTS = "\n".join([
H + " HILBERT SPACE FORMALISM — DISCRETE BASIS",
T + r" State vector $|\psi\rangle$ in complex Hilbert space $\mathcal{H}$.",
M + r"\langle m|n\rangle = \delta_{mn} \quad \text{(orthonormality)}",
M + r"\sum_n |n\rangle\langle n| = \hat{I} \quad \text{(completeness)}",
"",
H + " EXPANSION AND COMPONENTS",
M + r"|\psi\rangle = \sum_n c_n|n\rangle, \quad c_n \in \mathbb{C}",
X + r"KEY RESULT | c_n = \langle n|\psi\rangle \quad \text{(components ARE inner products)}",
T + r" Proof: $\langle m|\psi\rangle = \sum_n c_n \langle m|n\rangle = \sum_n c_n\delta_{mn} = c_m$",
"",
H + " NORMALISATION AND PROBABILITIES",
M + r"\langle\psi|\psi\rangle = \sum_n |c_n|^2 = 1 \quad \text{(total probability = 1)}",
M + r"P(n) = |c_n|^2 = |\langle n|\psi\rangle|^2 \quad \text{(Born rule)}",
X + r"Bra from ket | \langle\psi| = \sum_n c_n^*\langle n| \quad \text{(conjugate coefficients!)}",
"",
H + " GLOBAL PHASE INVARIANCE",
M + r"|\psi'\rangle = e^{i\theta}|\psi\rangle \implies |\langle n|\psi'\rangle|^2 = |\langle n|\psi\rangle|^2",
T + " Physical states are RAYS — global phase carries no information.",
])

ADVUG_CONCEPTS = "\n".join([
H + " INNER PRODUCT SPACE GEOMETRY",
M + r"\|\psi\| = \sqrt{\langle\psi|\psi\rangle}",
M + r"\langle\phi|\psi\rangle = \langle\psi|\phi\rangle^* \quad \text{(conjugate symmetry)}",
"",
H + " CAUCHY-SCHWARZ INEQUALITY",
M + r"|\langle\phi|\psi\rangle|^2 \leq \langle\phi|\phi\rangle\,\langle\psi|\psi\rangle",
T + r" Proof: set $f(\lambda) = \| |\phi\rangle - \lambda|\psi\rangle \|^2 \geq 0$.",
T + r" Choose $\lambda = \langle\psi|\phi\rangle / \|\psi\|^2$ to minimise.",
X + r"Physical meaning | \text{For normalised states: } |\langle\phi|\psi\rangle|^2 \leq 1",
"",
H + " TRIANGLE INEQUALITY",
M + r"\|\phi + \psi\| \leq \|\phi\| + \|\psi\|",
T + " Proof: square both sides; apply C-S to the cross term.",
"",
H + " PHASE-INVARIANT DISTANCE",
M + r"d(\phi,\psi) = \min_{\theta}\| |\phi\rangle - e^{i\theta}|\psi\rangle \| = \sqrt{2(1-|\langle\phi|\psi\rangle|)}",
M + r"d_{\mathrm{FS}}(\phi,\psi) = \arccos(|\langle\phi|\psi\rangle|) \quad \text{(Fubini-Study)}",
"",
H + " UNITARY MAPS PRESERVE GEOMETRY",
M + r"\hat{U}^\dagger\hat{U} = \hat{I} \implies \langle\hat{U}\phi|\hat{U}\psi\rangle = \langle\phi|\psi\rangle",
])

MSC_CONCEPTS = "\n".join([
H + " PROJECTIVE HILBERT SPACE",
T + r" Physical state space is $\mathbb{P}(\mathcal{H})$, not $\mathcal{H}$ itself.",
M + r"\mathbb{P}(\mathcal{H}) = \bigl(\mathcal{H} \setminus \{0\}\bigr)/{\sim}",
M + r"|\psi\rangle \sim c|\psi\rangle \text{ for any nonzero } c \in \mathbb{C}",
T + r" A ray $[\psi]$ is a one-dimensional complex subspace of $\mathcal{H}$.",
T + r" Example: $\mathbb{P}(\mathbb{C}^2) \cong S^2$ — the Bloch sphere.",
"",
H + " PHYSICALLY INVARIANT QUANTITIES",
M + r"|\langle\phi|\psi\rangle|^2 \quad \text{invariant under } |\phi\rangle\to e^{i\alpha}|\phi\rangle",
M + r"d_{\mathrm{FS}}([\phi],[\psi]) = \arccos(|\langle\phi|\psi\rangle|)",
"",
H + " WIGNER'S THEOREM",
T + r" Any bijection $T:\mathbb{P}(\mathcal{H})\to\mathbb{P}(\mathcal{H})$ preserving $|\langle\phi|\psi\rangle|^2$",
T + r" is implemented by a UNITARY or ANTIUNITARY operator $U$ on $\mathcal{H}$.",
T + " Consequence: all quantum symmetries are (anti)unitary.",
"",
H + " CONSEQUENCES",
T + r" Symmetry group $G$ acting on states gives projective representation of $G$.",
T + r" Forces spin $SO(3)\to SU(2)$, superselection rules, CPT symmetry.",
])

PHD_CONCEPTS = "\n".join([
H + " HILBERT SPACE — PRECISE AXIOMS",
T + r" Definition: a complex vector space $\mathcal{H}$ with $\langle\cdot|\cdot\rangle$ that is COMPLETE.",
T + r" Completeness: every Cauchy sequence $\{\psi_n\}$ converges in $\mathcal{H}$.",
T + " Essential for: spectral theory, Fourier expansions, Stone's theorem.",
"",
H + " SEPARABILITY",
T + r" $\mathcal{H}$ separable $\Leftrightarrow$ countable dense subset $\Leftrightarrow$ countable ONB $\{e_n\}$.",
T + r" All standard NRQM spaces: $L^2(\mathbb{R}^n)$, $\mathbb{C}^n$, $\ell^2(\mathbb{N})$.",
"",
H + " RAYS AS ONE-DIMENSIONAL SUBSPACES",
M + r"[\psi] = \mathrm{span}_{\mathbb{C}}\{\psi\} \subset \mathcal{H}",
T + r" $\mathbb{P}(\mathcal{H})$ is a Kahler manifold with Fubini-Study metric.",
"",
H + " UNBOUNDED OPERATORS — DOMAIN SUBTLETY",
M + r"\text{Hermitian: } \langle\phi|\hat{A}\psi\rangle = \langle\hat{A}\phi|\psi\rangle \;\forall\,\phi,\psi \in \mathcal{D}(\hat{A})",
M + r"\text{Self-adjoint: additionally } \mathcal{D}(\hat{A}) = \mathcal{D}(\hat{A}^\dagger)",
T + r" Self-adjoint $\neq$ Hermitian for unbounded operators ($\hat{x}$, $\hat{p}$).",
T + " Spectral theorem and Stone's theorem REQUIRE self-adjointness.",
])

_TIER_CONCEPTS = {
    "HS":    HS_CONCEPTS,
    "BegUG": BEGUG_CONCEPTS,
    "AdvUG": ADVUG_CONCEPTS,
    "MSc":   MSC_CONCEPTS,
    "PhD":   PHD_CONCEPTS,
}

# ── Public API ─────────────────────────────────────────────────────────────────

def get_sakurai_track() -> str:
    return SAKURAI_TRACK

def get_dirac_postulates() -> str:
    return DIRAC_POSTULATES

def get_core_concepts(lecture_num: str, tier: str, tier_data: dict) -> str:
    base      = _TIER_CONCEPTS.get(tier, "")
    narrative = (tier_data.get("narrative") or "").strip()
    if narrative and lecture_num != "L01":
        return T + " " + narrative + "\n\n" + base
    return base

def get_tier_intro_block(tier: str, tier_data: dict, levels: dict,
                          tier_order: list) -> str:
    narrative = (tier_data.get("narrative") or "").strip()
    key_msg   = (levels.get(tier) or "").strip()
    idx       = tier_order.index(tier)
    prev      = tier_order[idx-1] if idx > 0 else None
    nxt       = tier_order[idx+1] if idx < len(tier_order)-1 else None

    lines = []
    if narrative:
        lines += [T + " " + narrative]
    if key_msg:
        lines += ["", H + " KEY MATHEMATICAL CONTENT", T + " " + key_msg]
    if prev:
        prev_msg = (levels.get(prev) or "previous tier content")[:80]
        lines += ["", H + " BUILDS ON", T + " " + prev + ": " + prev_msg]
    if nxt:
        nxt_msg = (levels.get(nxt) or "next tier content")[:80]
        lines += ["", H + " UNLOCKS", T + " " + nxt + ": " + nxt_msg]
    return "\n".join(lines)

def build_problem_block(prob: dict) -> str:
    lines = []
    stmt = (prob.get("statement") or "").strip()
    if stmt:
        lines.append(T + " " + stmt)
    hints = prob.get("hints", [])
    if hints:
        lines += ["", H + " HINTS"]
        for h in hints:
            lines.append(T + " * " + h)
    ahints = prob.get("advanced_hints", [])
    if ahints:
        lines += ["", H + " ADVANCED HINTS"]
        for h in ahints:
            lines.append(T + " * " + h)
    return "\n".join(lines)

def build_solution_block(prob: dict) -> str:
    sol = (prob.get("solution") or "").strip()
    if not sol:
        return T + " See Solutions Sheet for the complete worked answer."
    lines = [H + " FULL SOLUTION", ""]
    for line in sol.split("\n"):
        s = line.strip()
        lines.append((T + " " + s) if s else "")
    return "\n".join(lines)

def build_cq_block(cqs: list, tier: str) -> str:
    lines = [H + " CONCEPT QUESTIONS — " + tier]
    for i, q in enumerate(cqs, 1):
        lines += ["", T + " " + str(i) + ". " + q.strip()]
    return "\n".join(lines)

def get_all_blocks_for_lecture(lecture_data: dict) -> dict:
    blocks = {
        "sakurai_track":    get_sakurai_track(),
        "dirac_postulates": get_dirac_postulates(),
    }
    tier_order = ["HS", "BegUG", "AdvUG", "MSc", "PhD"]
    tiers  = lecture_data.get("tiers", {})
    levels = lecture_data.get("levels", {})
    num    = lecture_data.get("num", "L01")

    for tier in tier_order:
        td = tiers.get(tier, {})
        blocks["core_" + tier]  = get_core_concepts(num, tier, td)
        blocks["intro_" + tier] = get_tier_intro_block(tier, td, levels, tier_order)
        cqs = td.get("concept_questions", [])
        if cqs:
            blocks["cq_" + tier] = build_cq_block(cqs, tier)
        for p in td.get("problems_simple", []) + td.get("problems_advanced", []):
            pid = p.get("id", "X")
            blocks["prob_" + pid + "_full"] = build_problem_block(p)
            blocks["prob_" + pid + "_sol"]  = build_solution_block(p)
    return blocks
