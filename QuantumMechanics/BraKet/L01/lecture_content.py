"""
L01/lecture_content.py
======================
Complete expanded content for Lecture 1:
  "Why Dirac Notation? States as Rays & Superposition"

This module provides L01_FULL — a dict conforming to quality_standard.py —
which is consumed by the PPTX builder and the homework PDF builder.

All five tiers contain:
  - narrative
  - refs_historical / refs_educational / refs_research  (annotated bibliography)
  - concept_questions
  - problems_simple  / problems_advanced  (full exercise packets)
  - project_simple   / project_advanced
  - research_simple  / research_open
"""

import os, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, ROOT)

# ─────────────────────────────────────────────────────────────────────────────
# CORE METADATA  (same fields as shared/lecture_data.py, extended)
# ─────────────────────────────────────────────────────────────────────────────

L01_FULL = {
    "num":      "L01",
    "title":    "Why Dirac Notation? States as Rays & Superposition",
    "subtitle": "Sakurai ↔ Dirac Dual-Track — Lecture 1",
    "key_content": "States, kets, rays, global phase, Born rule, superposition",

    "pacing": [
        "0--15 min: Motivation --- representations vs abstract states",
        "15--45 min: Kets as vectors, rays, normalization, global phase",
        "45--70 min: Bras (informal), amplitudes, Born rule",
        "70--90 min: Notation dictionary: ket $\\leftrightarrow$ column vector $\\leftrightarrow$ wavefunction",
    ],
    "outcomes": [
        "Understand state as equivalence class $|\\psi\\rangle \\sim e^{i\\theta}|\\psi\\rangle$",
        "Interpret amplitudes and Born-rule probabilities $P(a_i)=|\\langle a_i|\\psi\\rangle|^2$",
        "Learn the discrete-basis dictionary $c_n = \\langle n|\\psi\\rangle$",
        "Connect Sakurai (operational) and Dirac (axiomatic) perspectives",
        "Derive completeness, normalization, and global-phase invariance",
    ],
    "formulas": {
        "ray_equiv":     r"$|\psi\rangle \sim e^{i\theta}|\psi\rangle$",
        "born_rule":     r"$P(a_i) = |\langle a_i|\psi\rangle|^2$",
        "superposition": r"$|\phi\rangle = \alpha|\psi_1\rangle + \beta|\psi_2\rangle$",
        "normalization": r"$\langle\psi|\psi\rangle = 1$",
        "component":     r"$c_n = \langle n|\psi\rangle$",
        "completeness":  r"$\sum_n |n\rangle\langle n| = \hat{I}$",
        "interference":  r"$P = |A_1+A_2|^2 = |A_1|^2+|A_2|^2+2\Re(A_1^*A_2)$",
    },
    "pitfalls": [
        "Confusing $|\\psi\\rangle$ (abstract ket) with a column vector (representation-dependent).",
        "Forgetting complex conjugation: if $|\\psi\\rangle=\\sum c_n|n\\rangle$ then $\\langle\\psi|=\\sum c_n^*\\langle n|$.",
        "Treating global phase as physically meaningful --- only relative phases affect probabilities.",
        "Assuming normalization is automatic --- always verify $\\langle\\psi|\\psi\\rangle=1$.",
    ],
    "history": [
        "Born (1926) --- probability interpretation of the wave function.",
        "Dirac (1927--1930) --- transformation theory and bra-ket formalism.",
        "von Neumann (1932) --- Hilbert-space axiomatic foundations.",
        "Wigner --- symmetry principles and transition probabilities (preview).",
    ],
    "levels": {
        "HS":    "Complex numbers; $|z|^2$ as probability; vector addition and interference.",
        "BegUG": "Normalization $\\langle\\psi|\\psi\\rangle=1$; orthogonality; components $c_n=\\langle n|\\psi\\rangle$.",
        "AdvUG": "Cauchy--Schwarz; triangle inequality; metric viewpoint on state space.",
        "MSc":   "Rays and projective Hilbert space $\\mathbb{P}(\\mathcal{H})$; Wigner theorem preview.",
        "PhD":   "Precise Hilbert space axioms; separability; rays as 1D subspaces; domain caveats.",
    },

    # ─── PER-TIER CONTENT ────────────────────────────────────────────────────
    "tiers": {

        # ═══════════════════════════════════════════════════════════════════
        "HS": {
            "narrative": (
                "At the high-school level the goal is to build the single most important "
                "intuition: a quantum amplitude is a complex number (an arrow in the plane), "
                "and probability is its squared length.  Superposition is simply arrow addition, "
                "which immediately explains interference.  No Hilbert-space vocabulary is needed."
            ),

            # ── BIBLIOGRAPHY ──────────────────────────────────────────────
            "refs_historical": [
                {
                    "authors": "Born, M.",
                    "year": "1926",
                    "title": "Zur Quantenmechanik der Stossvorgange",
                    "venue": "Zeitschrift fur Physik 37, 863--867",
                    "annotation": "The paper that introduced the probability interpretation: "
                                  "$|\\psi|^2$ as probability density.  Read as a historical anchor; "
                                  "do not assign the mathematics to HS students.",
                    "doi": "10.1007/BF01397477",
                },
                {
                    "authors": "Feynman, R. P.",
                    "year": "1965",
                    "title": "The Feynman Lectures on Physics, Vol.~III, Ch.~1",
                    "venue": "Addison-Wesley",
                    "annotation": "The clearest introduction to quantum amplitude addition "
                                  "for a general audience.  The two-slit discussion is ideal "
                                  "for HS motivation.",
                },
            ],
            "refs_educational": [
                {
                    "authors": "Susskind, L. and Friedman, A.",
                    "year": "2014",
                    "title": "Quantum Mechanics: The Theoretical Minimum",
                    "venue": "Basic Books",
                    "annotation": "An accessible first exposure to bra-ket ideas requiring only "
                                  "basic algebra and complex numbers.  Chapters 1--3 are suitable "
                                  "for strong HS students.",
                },
                {
                    "authors": "Zettili, N.",
                    "year": "2009",
                    "title": "Quantum Mechanics: Concepts and Applications, 2nd ed., Ch.~1",
                    "venue": "Wiley",
                    "annotation": "Good review of complex numbers and vectors as preparation "
                                  "for quantum formalism.",
                },
            ],
            "refs_research": [
                {
                    "authors": "Hardy, L.",
                    "year": "2001",
                    "title": "Quantum Theory From Five Reasonable Axioms",
                    "venue": "arXiv:quant-ph/0101012",
                    "annotation": "Accessible reconstruction of quantum mechanics from "
                                  "operational axioms.  Shows why complex numbers and the "
                                  "Born rule are not arbitrary.  Suitable as a curiosity "
                                  "reading for advanced HS students.",
                    "url": "https://arxiv.org/abs/quant-ph/0101012",
                },
            ],

            # ── CONCEPT QUESTIONS ─────────────────────────────────────────
            "concept_questions": [
                "Why can a probability never be negative?",
                "Why do we square the length of an amplitude rather than take the length directly?",
                "How can adding two arrows (amplitudes) make the result shorter than either arrow alone?",
                "If you double every arrow in a superposition, what happens to the probabilities?",
                "What is the difference between an amplitude and a probability?",
            ],

            # ── SIMPLE PROBLEMS ───────────────────────────────────────────
            "problems_simple": [
                {
                    "id": "HS-A1",
                    "statement": (
                        "Compute $|3+4i|^2$."
                    ),
                    "hints": [
                        "Recall $|a+ib|^2 = a^2 + b^2$.",
                        "Identify real and imaginary parts.",
                    ],
                    "advanced_hints": [
                        "Equivalently compute $(3+4i)^*(3+4i)=(3-4i)(3+4i)$.",
                    ],
                    "solution": (
                        "$|3+4i|^2 = 3^2+4^2 = 9+16 = 25.$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "HS-A2",
                    "statement": (
                        "Let $A_1=1$ and $A_2=i$. Compute $|A_1+A_2|^2$ and "
                        "compare with $|A_1|^2+|A_2|^2$."
                    ),
                    "hints": [
                        "Add the complex numbers first: $1+i$.",
                        "Compute the squared magnitude.",
                    ],
                    "advanced_hints": [
                        "The difference $|A_1+A_2|^2 - |A_1|^2 - |A_2|^2 = 2\\Re(A_1^* A_2)$ is the interference term.",
                    ],
                    "solution": (
                        "$|1+i|^2 = 1^2+1^2 = 2$. "
                        "Meanwhile $|A_1|^2+|A_2|^2 = 1+1 = 2$. "
                        "Here the interference term $2\\Re(1\\cdot(-i))=2\\Re(-i)=0$, "
                        "so there is no interference when amplitudes are perpendicular in the complex plane."
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "HS-A3",
                    "statement": (
                        "Let $A_2 = e^{i\\pi} = -1$. Compute $|1+A_2|^2$. "
                        "What does this correspond to physically?"
                    ),
                    "hints": [
                        "$e^{i\\pi} = \\cos\\pi + i\\sin\\pi = -1$.",
                    ],
                    "advanced_hints": [
                        "This is perfect destructive interference.",
                    ],
                    "solution": (
                        "$|1+(-1)|^2 = |0|^2 = 0$. "
                        "The two amplitudes point in opposite directions and cancel exactly: "
                        "this is perfect destructive interference, giving zero probability."
                    ),
                    "difficulty": "simple",
                },
            ],

            # ── ADVANCED PROBLEMS ─────────────────────────────────────────
            "problems_advanced": [
                {
                    "id": "HS-B1",
                    "statement": (
                        "Show that $|1+e^{i\\phi}|^2 = 2+2\\cos\\phi$. "
                        "Find the value(s) of $\\phi\\in[0,2\\pi)$ that maximise and minimise this expression."
                    ),
                    "hints": [
                        "Write $e^{i\\phi}=\\cos\\phi+i\\sin\\phi$ and expand.",
                        "Use $|a+ib|^2=a^2+b^2$.",
                    ],
                    "advanced_hints": [
                        "Alternatively: $|1+e^{i\\phi}|^2=(1+e^{i\\phi})(1+e^{-i\\phi})=2+2\\cos\\phi$.",
                    ],
                    "solution": (
                        "$(1+e^{i\\phi})(1+e^{-i\\phi})=1+e^{-i\\phi}+e^{i\\phi}+1"
                        "=2+(e^{i\\phi}+e^{-i\\phi})=2+2\\cos\\phi.$ "
                        "Maximum at $\\phi=0$: value $4$. Minimum at $\\phi=\\pi$: value $0$."
                    ),
                    "difficulty": "advanced",
                },
                {
                    "id": "HS-B2",
                    "statement": (
                        "Two amplitudes $A_1$ and $A_2$ have $|A_1|=|A_2|=r$. "
                        "Show that $|A_1+A_2|^2$ ranges between $0$ and $4r^2$ "
                        "depending on their relative phase, and find the phase difference achieving each extreme."
                    ),
                    "hints": [
                        "Write $A_1=r$, $A_2=re^{i\\delta}$ and compute.",
                        "Use the result of HS-B1 scaled by $r^2$.",
                    ],
                    "advanced_hints": [
                        "Observe that $|A_1+A_2|^2=2r^2(1+\\cos\\delta)$.",
                    ],
                    "solution": (
                        "Write $A_1=r$, $A_2=re^{i\\delta}$. "
                        "Then $|A_1+A_2|^2=r^2|1+e^{i\\delta}|^2=r^2(2+2\\cos\\delta)=2r^2(1+\\cos\\delta)$. "
                        "Maximum $4r^2$ at $\\delta=0$ (constructive). "
                        "Minimum $0$ at $\\delta=\\pi$ (destructive)."
                    ),
                    "difficulty": "advanced",
                },
            ],

            # ── PROJECTS ──────────────────────────────────────────────────
            "project_simple": {
                "title": "Interference as Arrow Addition",
                "description": (
                    "Draw, by hand or with a spreadsheet, amplitude arrows for "
                    "$A_1=1$ and $A_2=e^{i\\phi}$ for $\\phi=0,\\pi/4,\\pi/2,3\\pi/4,\\pi$. "
                    "Compute and plot $P(\\phi)=|A_1+A_2|^2$ for each value."
                ),
                "deliverable": "A labelled diagram and a table of $(\\phi, P)$ values.",
                "estimated_hours": "1",
                "tools": ["Pen and paper", "Optional: Excel or Google Sheets"],
                "difficulty": "simple",
            },
            "project_advanced": {
                "title": "Interference Pattern Plotter",
                "description": (
                    "Write a short Python script that: (1) takes two complex amplitudes "
                    "$A_1, A_2$ as inputs; (2) plots $|A_1+A_2e^{i\\phi}|^2$ as a function "
                    "of $\\phi \\in [0,2\\pi]$; (3) marks constructive and destructive points."
                ),
                "deliverable": "Python script + one plot with labels and a 200-word interpretation.",
                "estimated_hours": "2-3",
                "tools": ["Python", "matplotlib", "numpy"],
                "difficulty": "advanced",
            },

            # ── RESEARCH QUESTIONS ────────────────────────────────────────
            "research_simple": {
                "question": (
                    "Explain, using only arrow addition in the complex plane, how the "
                    "two-slit experiment produces bright and dark bands. "
                    "Your explanation should be accessible to a 16-year-old."
                ),
                "scope": "well-defined",
                "expected_output": "A 1--2 page written explanation with at least one diagram.",
                "background_needed": ["Complex numbers", "Concept of interference"],
            },
            "research_open": {
                "question": (
                    "Could we build a consistent theory of probability using real-valued amplitudes "
                    "(not complex) and a different rule than squaring the magnitude? "
                    "What would we lose?"
                ),
                "scope": "open",
                "expected_output": None,
                "background_needed": ["HS probability", "Some exposure to quantum experiments"],
                "connection_to_literature": (
                    "See Hardy (2001) for a formal answer; accessible exploration is the goal here."
                ),
            },
        },  # end HS

        # ═══════════════════════════════════════════════════════════════════
        "BegUG": {
            "narrative": (
                "The beginning undergraduate student learns to work fluently with the "
                "bra-ket formalism in a discrete basis: normalization, orthogonality, "
                "the key identity $c_n=\\langle n|\\psi\\rangle$, and the Born rule. "
                "The emphasis is on computational fluency and physical interpretation."
            ),

            "refs_historical": [
                {
                    "authors": "Born, M.",
                    "year": "1926",
                    "title": "Quantenmechanik der Stossvorgange",
                    "venue": "Zeitschrift fur Physik 38, 803--827",
                    "annotation": "Assign guided reading excerpts or a structured summary. "
                                  "Students identify the probability postulate and compare "
                                  "to the modern Born rule statement.",
                    "doi": "10.1007/BF01397184",
                },
                {
                    "authors": "Dirac, P. A. M.",
                    "year": "1927",
                    "title": "The Physical Interpretation of the Quantum Dynamics",
                    "venue": "Proceedings of the Royal Society A 113, 621--641",
                    "annotation": "Dirac's earliest systematic use of transformation theory "
                                  "and probability amplitudes.  Use a guided secondary summary; "
                                  "the notation differs from modern usage.",
                    "doi": "10.1098/rspa.1927.0012",
                },
            ],
            "refs_educational": [
                {
                    "authors": "Sakurai, J. J. and Napolitano, J.",
                    "year": "2021",
                    "title": "Modern Quantum Mechanics, 3rd ed., Ch.~1",
                    "venue": "Cambridge University Press",
                    "annotation": "The primary text for this track. Chapter 1 develops the "
                                  "bra-ket formalism through the Stern-Gerlach experiment --- "
                                  "exactly the measurement-first approach of this lecture.",
                },
                {
                    "authors": "Griffiths, D. J. and Schroeter, D. F.",
                    "year": "2018",
                    "title": "Introduction to Quantum Mechanics, 3rd ed., Ch.~3",
                    "venue": "Cambridge University Press",
                    "annotation": "Accessible treatment of Hilbert-space formalism for beginners. "
                                  "Use alongside Sakurai for complementary perspectives.",
                },
                {
                    "authors": "Shankar, R.",
                    "year": "1994",
                    "title": "Principles of Quantum Mechanics, 2nd ed., Ch.~1",
                    "venue": "Springer",
                    "annotation": "Particularly clear on the mathematical prerequisites "
                                  "(linear algebra review in Chapter 1).",
                },
            ],
            "refs_research": [
                {
                    "authors": "Gleason, A. M.",
                    "year": "1957",
                    "title": "Measures on the Closed Subspaces of a Hilbert Space",
                    "venue": "Journal of Mathematics and Mechanics 6, 885--893",
                    "annotation": "Gleason's theorem: any probability measure on the closed "
                                  "subspaces of a Hilbert space (dim $\\geq 3$) must be of "
                                  "the Born-rule form.  Introduce as a 'why is Born rule the "
                                  "only consistent choice?' motivation.",
                    "doi": "10.1512/iumj.1957.6.56050",
                },
            ],

            "concept_questions": [
                "Why do we impose $\\langle\\psi|\\psi\\rangle=1$? What would happen if we allowed $\\langle\\psi|\\psi\\rangle=2$?",
                "What does orthogonality $\\langle m|n\\rangle=0$ mean in terms of measurement outcomes?",
                "Why does a basis choice correspond to a measurement choice?",
                "If $c_n = \\langle n|\\psi\\rangle$, what happens to $c_n$ if you multiply $|\\psi\\rangle$ by $e^{i\\theta}$?",
                "Can two different states give the same set of probabilities $\\{P(n)\\}$ in some basis?",
            ],

            "problems_simple": [
                {
                    "id": "BegUG-A1",
                    "statement": (
                        "Let $\\{|1\\rangle,|2\\rangle\\}$ be orthonormal. "
                        "Normalize $|\\psi\\rangle = |1\\rangle + i|2\\rangle$."
                    ),
                    "hints": [
                        "Compute $\\langle\\psi|\\psi\\rangle$.",
                        "Divide by $\\sqrt{\\langle\\psi|\\psi\\rangle}$.",
                    ],
                    "advanced_hints": [
                        "Use $\\langle\\psi| = \\langle 1| - i\\langle 2|$ (conjugate coefficients).",
                    ],
                    "solution": (
                        "$\\langle\\psi|\\psi\\rangle = (\\langle 1|-i\\langle 2|)(|1\\rangle+i|2\\rangle)"
                        "=1+0+0+1=2.$ "
                        "Normalized: $|\\psi\\rangle_{\\rm norm}=\\frac{1}{\\sqrt{2}}(|1\\rangle+i|2\\rangle).$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "BegUG-A2",
                    "statement": (
                        "For $|\\psi\\rangle=\\frac{1}{\\sqrt{5}}(|1\\rangle+2i|2\\rangle)$, "
                        "compute $c_1$, $c_2$, $P(1)$, and $P(2)$."
                    ),
                    "hints": [
                        "$c_n = \\langle n|\\psi\\rangle$.",
                        "$P(n)=|c_n|^2$.",
                    ],
                    "advanced_hints": [
                        "Check: $P(1)+P(2)$ should equal $1$.",
                    ],
                    "solution": (
                        "$c_1=1/\\sqrt{5}$, $c_2=2i/\\sqrt{5}$. "
                        "$P(1)=1/5$, $P(2)=4/5$. Sum: $1$. Correct."
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "BegUG-A3",
                    "statement": (
                        "Show, starting from the expansion $|\\psi\\rangle=\\sum_n c_n|n\\rangle$, "
                        "that $c_m = \\langle m|\\psi\\rangle$."
                    ),
                    "hints": [
                        "Multiply on the left by $\\langle m|$.",
                        "Use $\\langle m|n\\rangle=\\delta_{mn}$.",
                    ],
                    "advanced_hints": [
                        "This is the key 'notation dictionary move' of the entire course.",
                    ],
                    "solution": (
                        "$\\langle m|\\psi\\rangle=\\sum_n c_n\\langle m|n\\rangle"
                        "=\\sum_n c_n\\delta_{mn}=c_m.$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "BegUG-A4",
                    "statement": (
                        "Show that global phase invariance holds: "
                        "$|\\langle n|e^{i\\theta}\\psi\\rangle|^2=|\\langle n|\\psi\\rangle|^2$."
                    ),
                    "hints": [
                        "Pull $e^{i\\theta}$ out using linearity of the inner product.",
                        "Use $|e^{i\\theta}|=1$.",
                    ],
                    "advanced_hints": [
                        "Conclude: only rays are physical --- the global phase carries no observable information.",
                    ],
                    "solution": (
                        "$|\\langle n|e^{i\\theta}\\psi\\rangle|^2=|e^{i\\theta}\\langle n|\\psi\\rangle|^2"
                        "=|e^{i\\theta}|^2|\\langle n|\\psi\\rangle|^2=|\\langle n|\\psi\\rangle|^2.$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "BegUG-A5",
                    "statement": (
                        "Using completeness $\\sum_n |n\\rangle\\langle n|=\\hat{I}$, "
                        "prove $\\langle\\psi|\\psi\\rangle=\\sum_n|\\langle n|\\psi\\rangle|^2$."
                    ),
                    "hints": [
                        "Insert the identity between $\\langle\\psi|$ and $|\\psi\\rangle$.",
                    ],
                    "advanced_hints": [
                        "This is the quantum analogue of Parseval's identity.",
                    ],
                    "solution": (
                        "$\\langle\\psi|\\psi\\rangle=\\langle\\psi|\\hat{I}|\\psi\\rangle"
                        "=\\sum_n\\langle\\psi|n\\rangle\\langle n|\\psi\\rangle"
                        "=\\sum_n|\\langle n|\\psi\\rangle|^2.$"
                    ),
                    "difficulty": "simple",
                },
            ],

            "problems_advanced": [
                {
                    "id": "BegUG-B1",
                    "statement": (
                        "Insert the identity to prove: "
                        "$\\langle\\phi|\\psi\\rangle=\\sum_n \\phi_n^*\\psi_n$ "
                        "where $\\phi_n=\\langle n|\\phi\\rangle$ and $\\psi_n=\\langle n|\\psi\\rangle$."
                    ),
                    "hints": [
                        "Insert $\\sum_n|n\\rangle\\langle n|$ between $\\langle\\phi|$ and $|\\psi\\rangle$.",
                    ],
                    "advanced_hints": [
                        "Note $\\langle\\phi|n\\rangle=(\\langle n|\\phi\\rangle)^*=\\phi_n^*$.",
                    ],
                    "solution": (
                        "$\\langle\\phi|\\psi\\rangle=\\langle\\phi|\\hat{I}|\\psi\\rangle"
                        "=\\sum_n\\langle\\phi|n\\rangle\\langle n|\\psi\\rangle"
                        "=\\sum_n\\phi_n^*\\psi_n.$ "
                        "This is the standard inner product formula in coordinates."
                    ),
                    "difficulty": "advanced",
                },
                {
                    "id": "BegUG-B2",
                    "statement": (
                        "Let $|\\psi'\\rangle=\\alpha|1\\rangle+\\beta|2\\rangle$ with $|\\alpha|^2+|\\beta|^2=1$. "
                        "Show that no matter which orthonormal basis $\\{|n\\rangle\\}$ you measure in, "
                        "the total probability is always 1."
                    ),
                    "hints": [
                        "Use the result of BegUG-A5.",
                    ],
                    "advanced_hints": [
                        "The key is that normalization $\\langle\\psi|\\psi\\rangle=1$ is basis-independent.",
                    ],
                    "solution": (
                        "$\\sum_n P(n)=\\sum_n|\\langle n|\\psi\\rangle|^2=\\langle\\psi|\\hat{I}|\\psi\\rangle"
                        "=\\langle\\psi|\\psi\\rangle=1.$ "
                        "This holds for any orthonormal basis, since completeness inserts the identity."
                    ),
                    "difficulty": "advanced",
                },
            ],

            "project_simple": {
                "title": "Basis-Expansion Calculator",
                "description": (
                    "Write a Python function that takes: "
                    "(1) a complex vector $\\psi$ in a 2D or 3D basis; "
                    "(2) a unitary matrix $U$ defining a new basis. "
                    "Output: coefficients in the new basis and the probabilities in both bases."
                ),
                "deliverable": "Python script + 3 worked examples with output tables.",
                "estimated_hours": "2",
                "tools": ["Python", "numpy"],
                "difficulty": "simple",
            },
            "project_advanced": {
                "title": "Representations of the Same State",
                "description": (
                    "Take a fixed physical state $|\\psi\\rangle$ and represent it in three ways: "
                    "(a) as a column vector in the $\\{|1\\rangle,|2\\rangle\\}$ basis; "
                    "(b) as a column vector in the rotated basis $\\{|+\\rangle,|-\\rangle\\}$; "
                    "(c) as a wavefunction $\\psi(x)$ for a simple model. "
                    "Identify which quantities change across representations and which remain invariant."
                ),
                "deliverable": "A 3-page report with explicit computations and a summary table of invariants.",
                "estimated_hours": "4-6",
                "tools": ["Python", "pen and paper"],
                "difficulty": "advanced",
            },

            "research_simple": {
                "question": (
                    "Explain in a 2-page note why the choice of measurement basis "
                    "is equivalent to the choice of observable.  "
                    "Use the normalization and orthogonality conditions to support your argument."
                ),
                "scope": "well-defined",
                "expected_output": "2-page written note with at least two worked examples.",
                "background_needed": ["BegUG problem sets", "Orthogonal bases"],
            },
            "research_open": {
                "question": (
                    "What is the minimum set of axioms from which $c_n=\\langle n|\\psi\\rangle$ "
                    "and the Born rule can be derived, rather than postulated?  "
                    "Explore at least one derivation attempt in the literature."
                ),
                "scope": "open",
                "background_needed": ["BegUG formalism", "Some familiarity with axiomatic approaches"],
                "connection_to_literature": "See Gleason (1957) and Hardy (2001) for starting points.",
            },
        },  # end BegUG

        # ═══════════════════════════════════════════════════════════════════
        "AdvUG": {
            "narrative": (
                "Advanced undergraduates transition from computation to proof.  "
                "The Cauchy--Schwarz and triangle inequalities establish that the Hilbert "
                "space has a genuine geometry: overlaps measure 'angles', norms measure "
                "'lengths', and probabilities are geometrically bounded.  "
                "The subtlety of the physically correct notion of distance (phase-invariant) "
                "motivates the projective Hilbert space perspective at the Master's level."
            ),

            "refs_historical": [
                {
                    "authors": "von Neumann, J.",
                    "year": "1932",
                    "title": "Mathematische Grundlagen der Quantenmechanik",
                    "venue": "Springer, Berlin (English trans. Princeton UP, 1955)",
                    "annotation": "The foundational text establishing quantum mechanics "
                                  "on a rigorous Hilbert-space basis.  Assign selected sections "
                                  "on inner-product axioms and the spectral theorem.",
                },
                {
                    "authors": "Schwarz, H. A.",
                    "year": "1885",
                    "title": "\\\"Uber ein die Fl\\\"achen kleinsten Fl\\\"acheninhalts betreffendes Problem der Variationsrechnung",
                    "venue": "Acta Societatis Scientiarum Fennicae 15, 315--362",
                    "annotation": "Historical origin of the Cauchy--Schwarz inequality in "
                                  "the continuous (integral) setting.  Use as a historical note "
                                  "--- the inequality predates quantum mechanics by 40 years.",
                },
            ],
            "refs_educational": [
                {
                    "authors": "Dirac, P. A. M.",
                    "year": "1958",
                    "title": "The Principles of Quantum Mechanics, 4th ed.",
                    "venue": "Oxford University Press",
                    "annotation": "Read Chapter 1 for the formalist perspective. "
                                  "Dirac introduces bras and kets axiomatically with "
                                  "extraordinary economy of language.",
                },
                {
                    "authors": "Axler, S.",
                    "year": "2015",
                    "title": "Linear Algebra Done Right, 3rd ed., Ch.~6",
                    "venue": "Springer",
                    "annotation": "Best undergraduate proof-based treatment of inner products, "
                                  "norms, and the Cauchy--Schwarz inequality.",
                },
                {
                    "authors": "Cohen-Tannoudji, C., Diu, B., and Lalo\\\"e, F.",
                    "year": "1977",
                    "title": "Quantum Mechanics, Vol.~1, Ch.~II",
                    "venue": "Wiley",
                    "annotation": "Comprehensive mathematical complement sections (II-A through II-D) "
                                  "covering inner products, orthonormal bases, and the Dirac formalism.",
                },
            ],
            "refs_research": [
                {
                    "authors": "Wigner, E. P.",
                    "year": "1959",
                    "title": "Group Theory and Its Application to the Quantum Mechanics of Atomic Spectra",
                    "venue": "Academic Press",
                    "annotation": "Contains the original proof of Wigner's theorem on "
                                  "symmetry transformations.  Assign as preview reading "
                                  "for the Master's tier.",
                },
            ],

            "concept_questions": [
                "Why must $|\\langle\\phi|\\psi\\rangle|\\le 1$ for normalized states?  What would happen if it could exceed 1?",
                "In what sense is probability a 'geometry' on the space of states?",
                "Why is $d(\\phi,\\psi)=\\|\\phi-\\psi\\|$ not a physically meaningful distance on quantum states?",
                "What is the role of completeness of $\\mathcal{H}$ (convergence of Cauchy sequences)?",
                "Is $\\|\\psi\\|$ a norm in the mathematical sense?  Verify all three norm axioms.",
            ],

            "problems_simple": [
                {
                    "id": "AdvUG-A1",
                    "statement": (
                        "Prove the Cauchy--Schwarz inequality: "
                        "$|\\langle\\phi|\\psi\\rangle|^2 \\le \\langle\\phi|\\phi\\rangle\\,\\langle\\psi|\\psi\\rangle$."
                    ),
                    "hints": [
                        "Consider $f(\\lambda)=\\||\\phi\\rangle-\\lambda|\\psi\\rangle\\|^2\\ge 0$ for any complex $\\lambda$.",
                        "Expand $f(\\lambda)$ and choose $\\lambda$ to minimise it.",
                    ],
                    "advanced_hints": [
                        "Choose $\\lambda=\\langle\\psi|\\phi\\rangle/\\langle\\psi|\\psi\\rangle$.",
                        "Identify the resulting inequality as the Cauchy--Schwarz bound.",
                    ],
                    "solution": (
                        "Define $f(\\lambda)=\\langle\\phi-\\lambda\\psi|\\phi-\\lambda\\psi\\rangle"
                        "=\\|\\phi\\|^2 - \\lambda\\langle\\phi|\\psi\\rangle - \\bar\\lambda\\langle\\psi|\\phi\\rangle"
                        "+|\\lambda|^2\\|\\psi\\|^2 \\ge 0.$ "
                        "Set $\\lambda=\\langle\\psi|\\phi\\rangle/\\|\\psi\\|^2$: "
                        "$f=\\|\\phi\\|^2-|\\langle\\phi|\\psi\\rangle|^2/\\|\\psi\\|^2\\ge 0$, "
                        "giving $|\\langle\\phi|\\psi\\rangle|^2\\le\\|\\phi\\|^2\\|\\psi\\|^2.$ $\\square$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "AdvUG-A2",
                    "statement": "Prove the triangle inequality $\\|\\phi+\\psi\\|\\le\\|\\phi\\|+\\|\\psi\\|$.",
                    "hints": [
                        "Square both sides.",
                        "Expand $\\|\\phi+\\psi\\|^2$ and apply $\\Re z \\le |z|$.",
                    ],
                    "advanced_hints": [
                        "Use Cauchy--Schwarz on the cross term $2\\Re\\langle\\phi|\\psi\\rangle$.",
                    ],
                    "solution": (
                        "$\\|\\phi+\\psi\\|^2=\\|\\phi\\|^2+2\\Re\\langle\\phi|\\psi\\rangle+\\|\\psi\\|^2"
                        "\\le \\|\\phi\\|^2+2|\\langle\\phi|\\psi\\rangle|+\\|\\psi\\|^2"
                        "\\le \\|\\phi\\|^2+2\\|\\phi\\|\\|\\psi\\|+\\|\\psi\\|^2"
                        "=(\\|\\phi\\|+\\|\\psi\\|)^2.$ "
                        "Take square roots (both sides non-negative). $\\square$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "AdvUG-A3",
                    "statement": "Show that $\\|\\psi\\|=0$ implies $|\\psi\\rangle=0$.",
                    "hints": [
                        "Use positive-definiteness of the inner product: $\\langle\\psi|\\psi\\rangle\\ge 0$ with equality iff $|\\psi\\rangle=0$.",
                    ],
                    "advanced_hints": [],
                    "solution": (
                        "If $\\|\\psi\\|=0$ then $\\langle\\psi|\\psi\\rangle=0$. "
                        "By positive-definiteness of the inner product, "
                        "$\\langle\\psi|\\psi\\rangle=0\\Rightarrow|\\psi\\rangle=0.$ $\\square$"
                    ),
                    "difficulty": "simple",
                },
            ],

            "problems_advanced": [
                {
                    "id": "AdvUG-B1",
                    "statement": (
                        "Define the phase-invariant distance on normalised states: "
                        "$d(\\phi,\\psi)=\\min_{\\theta\\in[0,2\\pi)}\\||\\phi\\rangle-e^{i\\theta}|\\psi\\rangle\\|$. "
                        "Show that $d(\\phi,\\psi)^2=2(1-|\\langle\\phi|\\psi\\rangle|)$."
                    ),
                    "hints": [
                        "Expand $\\||\\phi\\rangle-e^{i\\theta}|\\psi\\rangle\\|^2$ and use normalisation.",
                        "Minimise over $\\theta$.",
                    ],
                    "advanced_hints": [
                        "Write $\\langle\\phi|\\psi\\rangle=|\\langle\\phi|\\psi\\rangle|e^{i\\alpha}$ "
                        "and choose $\\theta=-\\alpha$ to maximise $\\Re(e^{i\\theta}\\langle\\phi|\\psi\\rangle)$.",
                    ],
                    "solution": (
                        "$\\||\\phi\\rangle-e^{i\\theta}|\\psi\\rangle\\|^2"
                        "=2-2\\Re(e^{i\\theta}\\langle\\psi|\\phi\\rangle)$. "
                        "Minimised when $e^{i\\theta}\\langle\\psi|\\phi\\rangle=|\\langle\\psi|\\phi\\rangle|$, "
                        "giving $\\min_\\theta(\\cdots)=2-2|\\langle\\phi|\\psi\\rangle|=d^2.$ $\\square$"
                    ),
                    "difficulty": "advanced",
                },
                {
                    "id": "AdvUG-B2",
                    "statement": (
                        "Let $\\hat U$ be unitary ($\\hat U^\\dagger \\hat U=\\hat I$). "
                        "Show that $\\langle\\hat U\\phi|\\hat U\\psi\\rangle=\\langle\\phi|\\psi\\rangle$ "
                        "for all $|\\phi\\rangle,|\\psi\\rangle$."
                    ),
                    "hints": [
                        "Use $\\langle\\hat U\\phi|=\\langle\\phi|\\hat U^\\dagger$.",
                    ],
                    "advanced_hints": [
                        "Conclude: unitary maps preserve the entire geometry of the Hilbert space.",
                    ],
                    "solution": (
                        "$\\langle\\hat U\\phi|\\hat U\\psi\\rangle"
                        "=\\langle\\phi|\\hat U^\\dagger\\hat U|\\psi\\rangle"
                        "=\\langle\\phi|\\hat I|\\psi\\rangle=\\langle\\phi|\\psi\\rangle.$ $\\square$"
                    ),
                    "difficulty": "advanced",
                },
            ],

            "project_simple": {
                "title": "Numerical Verification of Cauchy--Schwarz",
                "description": (
                    "Generate 1000 pairs of random complex vectors in $\\mathbb{C}^4$. "
                    "For each pair, compute $|\\langle\\phi|\\psi\\rangle|^2$ and $\\|\\phi\\|^2\\|\\psi\\|^2$. "
                    "Verify numerically that C--S holds for all pairs, and plot the ratio."
                ),
                "deliverable": "Python script + histogram of the ratio $|\\langle\\phi|\\psi\\rangle|^2/(\\|\\phi\\|^2\\|\\psi\\|^2)$.",
                "estimated_hours": "2",
                "tools": ["Python", "numpy", "matplotlib"],
                "difficulty": "simple",
            },
            "project_advanced": {
                "title": "Geometry of State Distinguishability",
                "description": (
                    "Explore how the Fubini--Study distance $d_{FS}=\\arccos|\\langle\\phi|\\psi\\rangle|$ "
                    "relates to the optimal measurement that distinguishes two pure states. "
                    "Compute $d_{FS}$ for several pairs of spin-1/2 states on the Bloch sphere "
                    "and compare with the angle between their Bloch vectors."
                ),
                "deliverable": "4-page report with derivations, numerical results, and a Bloch-sphere diagram.",
                "estimated_hours": "6-8",
                "tools": ["Python", "numpy", "matplotlib"],
                "difficulty": "advanced",
            },

            "research_simple": {
                "question": (
                    "Write a 3-page proof-based note showing that the Cauchy--Schwarz inequality "
                    "guarantees that transition probabilities $|\\langle\\phi|\\psi\\rangle|^2$ "
                    "are always between 0 and 1 for normalised states."
                ),
                "scope": "well-defined",
                "expected_output": "Self-contained 3-page mathematical note with full proofs.",
                "background_needed": ["AdvUG problem sets", "Inner product space axioms"],
            },
            "research_open": {
                "question": (
                    "Are there physically motivated geometries on the space of quantum states "
                    "other than the Fubini--Study metric?  What operational meaning would they carry?"
                ),
                "scope": "open",
                "background_needed": ["Fubini-Study distance", "Basic differential geometry (helpful)"],
                "connection_to_literature": (
                    "See Braunstein & Caves (1994, PRL) on quantum Fisher information metric "
                    "as an alternative operationally motivated geometry."
                ),
            },
        },  # end AdvUG

        # ═══════════════════════════════════════════════════════════════════
        "MSc": {
            "narrative": (
                "Master's students focus on what is physically real vs representational. "
                "States are rays in projective Hilbert space $\\mathbb{P}(\\mathcal{H})$; "
                "the Fubini--Study metric is the natural distance on this space. "
                "Wigner's theorem reveals that any transformation preserving transition "
                "probabilities must be unitary or antiunitary --- a profound structural result "
                "connecting measurement statistics directly to operator structure."
            ),

            "refs_historical": [
                {
                    "authors": "Wigner, E. P.",
                    "year": "1931",
                    "title": "Gruppentheorie und ihre Anwendung auf die Quantenmechanik der Atomspektren",
                    "venue": "Vieweg, Braunschweig",
                    "annotation": "Original source of Wigner's theorem. "
                                  "Use Bargmann's 1964 proof (below) for a rigorous modern version.",
                },
                {
                    "authors": "Bargmann, V.",
                    "year": "1964",
                    "title": "Note on Wigner's Theorem on Symmetry Operations",
                    "venue": "Journal of Mathematical Physics 5, 862--868",
                    "annotation": "The clearest and most rigorous proof of Wigner's theorem. "
                                  "Assign as the primary reference for the theorem at MSc level.",
                    "doi": "10.1063/1.1704188",
                },
            ],
            "refs_educational": [
                {
                    "authors": "Weinberg, S.",
                    "year": "2015",
                    "title": "Lectures on Quantum Mechanics, 2nd ed., Ch.~1",
                    "venue": "Cambridge University Press",
                    "annotation": "Contains a clear discussion of state vectors as rays "
                                  "and a derivation of the Wigner theorem at a level "
                                  "appropriate for MSc students.",
                },
                {
                    "authors": "Isham, C. J.",
                    "year": "1995",
                    "title": "Lectures on Quantum Theory: Mathematical and Structural Foundations",
                    "venue": "Imperial College Press",
                    "annotation": "Rigorous treatment of the projective Hilbert space "
                                  "and the geometric formulation of quantum mechanics.",
                },
            ],
            "refs_research": [
                {
                    "authors": "Braunstein, S. L. and Caves, C. M.",
                    "year": "1994",
                    "title": "Statistical Distance and the Geometry of Quantum States",
                    "venue": "Physical Review Letters 72, 3439--3443",
                    "annotation": "Derives the quantum Fisher information metric as the "
                                  "operationally natural geometry on quantum state space. "
                                  "Advanced reading connecting Fubini--Study geometry to "
                                  "parameter estimation.",
                    "doi": "10.1103/PhysRevLett.72.3439",
                },
            ],

            "concept_questions": [
                "Why is the physical state space $\\mathbb{P}(\\mathcal{H})$ and not $\\mathcal{H}$ itself?",
                "What precisely does 'global phase is gauge redundancy' mean?",
                "Why is $|\\langle\\phi|\\psi\\rangle|^2$ the physically invariant object, not $\\langle\\phi|\\psi\\rangle$ itself?",
                "State Wigner's theorem precisely.  What does 'antiunitary' mean?",
                "How does the Fubini--Study distance reduce to the ordinary angle between unit vectors when $\\mathcal{H}=\\mathbb{R}^n$?",
            ],

            "problems_simple": [
                {
                    "id": "MSc-A1",
                    "statement": (
                        "Show that $|\\langle\\phi|\\psi\\rangle|^2$ is invariant under "
                        "independent global phase changes: "
                        "$|\\phi\\rangle\\to e^{i\\alpha}|\\phi\\rangle$ and $|\\psi\\rangle\\to e^{i\\beta}|\\psi\\rangle$."
                    ),
                    "hints": [
                        "Substitute and use $|e^{i\\alpha}|=1$.",
                    ],
                    "advanced_hints": [],
                    "solution": (
                        "$|\\langle e^{i\\alpha}\\phi|e^{i\\beta}\\psi\\rangle|^2"
                        "=|e^{-i\\alpha}e^{i\\beta}\\langle\\phi|\\psi\\rangle|^2"
                        "=|\\langle\\phi|\\psi\\rangle|^2.$ $\\square$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "MSc-A2",
                    "statement": (
                        "Show that the Fubini--Study distance "
                        "$d_{FS}(\\phi,\\psi)=\\arccos(|\\langle\\phi|\\psi\\rangle|)$ "
                        "satisfies $d_{FS}=0$ if and only if $|\\phi\\rangle$ and $|\\psi\\rangle$ "
                        "represent the same ray."
                    ),
                    "hints": [
                        "$\\arccos(x)=0$ iff $x=1$.",
                        "$|\\langle\\phi|\\psi\\rangle|=1$ iff $|\\phi\\rangle=e^{i\\theta}|\\psi\\rangle$ for normalised states.",
                    ],
                    "advanced_hints": [
                        "Use the equality condition of Cauchy--Schwarz.",
                    ],
                    "solution": (
                        "$d_{FS}=0\\Leftrightarrow|\\langle\\phi|\\psi\\rangle|=1$. "
                        "By C-S equality, this holds iff $|\\phi\\rangle=\\lambda|\\psi\\rangle$ "
                        "for some $\\lambda\\in\\mathbb{C}$, i.e., they represent the same ray. $\\square$"
                    ),
                    "difficulty": "simple",
                },
            ],

            "problems_advanced": [
                {
                    "id": "MSc-B1",
                    "statement": (
                        "Outline the proof of Wigner's theorem: any bijection "
                        "$T:\\mathbb{P}(\\mathcal{H})\\to\\mathbb{P}(\\mathcal{H})$ "
                        "preserving $|\\langle\\phi|\\psi\\rangle|^2$ is induced by "
                        "a unitary or antiunitary operator $U$ on $\\mathcal{H}$."
                    ),
                    "hints": [
                        "Start from an orthonormal basis and show $T$ must map it to an orthonormal set.",
                        "Extend by linearity/antilinearity.",
                    ],
                    "advanced_hints": [
                        "Bargmann (1964) gives the cleanest proof.",
                        "The antiunitary case arises from time-reversal.",
                    ],
                    "solution": (
                        "Sketch: Choose ONB $\\{|e_n\\rangle\\}$. "
                        "Since $T$ preserves $|\\langle e_m|e_n\\rangle|^2=\\delta_{mn}$, "
                        "$\\{T(e_n)\\}$ is also an ONB. "
                        "Define $U$ by $U|e_n\\rangle=T(e_n)$; extend by linearity (or antilinearity). "
                        "Phase-consistency analysis (Bargmann 1964) determines which case applies. $\\square$"
                    ),
                    "difficulty": "advanced",
                },
                {
                    "id": "MSc-B2",
                    "statement": (
                        "Show that a unitary change of basis $|n\\rangle\\to\\hat{U}|n\\rangle$ "
                        "is a representation change, not a physical transformation. "
                        "Concretely: all probabilities $P(m)=|\\langle m|\\psi\\rangle|^2$ "
                        "in the new basis coincide with those computed by applying $\\hat{U}^\\dagger$ to the state."
                    ),
                    "hints": [
                        "Define $|m'\\rangle=\\hat{U}|m\\rangle$ and compute $|\\langle m'|\\psi\\rangle|^2$.",
                    ],
                    "advanced_hints": [
                        "Compare with $|\\langle m|\\hat{U}^\\dagger\\psi\\rangle|^2$ to see both descriptions agree.",
                    ],
                    "solution": (
                        "$|\\langle m'|\\psi\\rangle|^2=|\\langle m|\\hat{U}^\\dagger|\\psi\\rangle|^2$. "
                        "So measuring in basis $\\{|m'\\rangle\\}$ on state $|\\psi\\rangle$ gives the "
                        "same result as measuring in basis $\\{|m\\rangle\\}$ on state $\\hat{U}^\\dagger|\\psi\\rangle$. "
                        "This is the Schrodinger--Heisenberg equivalence in miniature. $\\square$"
                    ),
                    "difficulty": "advanced",
                },
            ],

            "project_simple": {
                "title": "Fubini--Study Distance on the Bloch Sphere",
                "description": (
                    "Parameterise spin-1/2 states by $(\\theta,\\phi)$ on the Bloch sphere. "
                    "Compute $d_{FS}$ between 20 randomly chosen pairs and compare with "
                    "the Euclidean distance between their Bloch vectors."
                ),
                "deliverable": "Python notebook with scatter plot of $d_{FS}$ vs Bloch-vector distance.",
                "estimated_hours": "3",
                "tools": ["Python", "numpy", "matplotlib"],
                "difficulty": "simple",
            },
            "project_advanced": {
                "title": "Symmetries, Unitaries, and Conservation Laws",
                "description": (
                    "Write a 5-page essay connecting: "
                    "(1) Wigner's theorem (symmetries $\\Rightarrow$ unitary/antiunitary operators); "
                    "(2) Stone's theorem (one-parameter unitary groups $\\Rightarrow$ Hermitian generators); "
                    "(3) the quantum analogue of Noether's theorem (symmetry $\\Rightarrow$ conservation law)."
                ),
                "deliverable": "5-page essay with at least one worked example (e.g., rotational symmetry $\\to$ angular momentum conservation).",
                "estimated_hours": "8-10",
                "tools": ["Literature access", "Weinberg (2015)", "Isham (1995)"],
                "difficulty": "advanced",
            },

            "research_simple": {
                "question": (
                    "Write a structured 5-page reading report on Wigner's theorem: "
                    "state the theorem precisely, outline the proof strategy, "
                    "and give two physical examples (one unitary, one antiunitary)."
                ),
                "scope": "well-defined",
                "expected_output": "5-page report with theorem statement, proof outline, and examples.",
                "background_needed": ["Projective Hilbert space", "Unitary operators", "Bargmann (1964)"],
            },
            "research_open": {
                "question": (
                    "Which operational assumptions uniquely single out complex Hilbert spaces "
                    "(versus real or quaternionic) as the arena for quantum mechanics?"
                ),
                "scope": "open",
                "background_needed": ["Wigner theorem", "Projective Hilbert space", "Basic representation theory"],
                "connection_to_literature": (
                    "See Stueckelberg (1960), Adler (1995) for quaternionic QM, "
                    "and Renou et al. (2021, Nature) for a recent experimental test."
                ),
            },
        },  # end MSc

        # ═══════════════════════════════════════════════════════════════════
        "PhD": {
            "narrative": (
                "At the PhD level, all handwaving is removed. "
                "A Hilbert space is precisely a complete complex inner-product space. "
                "Separability (countable ONB) is verified for all standard QM systems. "
                "The physical state space is $\\mathbb{P}(\\mathcal{H})$ --- the space of "
                "one-dimensional complex subspaces (rays). "
                "The critical domain subtlety: Hermitian on a dense domain does not imply "
                "self-adjoint.  This distinction drives the rigged Hilbert space construction "
                "needed to handle $|x\\rangle$ rigorously."
            ),

            "refs_historical": [
                {
                    "authors": "von Neumann, J.",
                    "year": "1929",
                    "title": "Allgemeine Eigenwerttheorie Hermitescher Funktionaloperatoren",
                    "venue": "Mathematische Annalen 102, 49--131",
                    "annotation": "Von Neumann's foundational paper developing spectral theory "
                                  "for Hermitian operators on Hilbert space.  Read selected "
                                  "sections on the spectral theorem and domain questions.",
                    "doi": "10.1007/BF01782338",
                },
                {
                    "authors": "Stone, M. H.",
                    "year": "1932",
                    "title": "On One-Parameter Unitary Groups in Hilbert Space",
                    "venue": "Annals of Mathematics 33, 643--648",
                    "annotation": "Stone's theorem: every strongly continuous one-parameter "
                                  "unitary group has a self-adjoint generator. "
                                  "This underpins all of time evolution in quantum mechanics.",
                    "doi": "10.2307/1968538",
                },
            ],
            "refs_educational": [
                {
                    "authors": "Reed, M. and Simon, B.",
                    "year": "1972",
                    "title": "Methods of Modern Mathematical Physics, Vol.~1: Functional Analysis",
                    "venue": "Academic Press",
                    "annotation": "The standard rigorous reference. "
                                  "Chapter 2 (Hilbert spaces) and Chapter 8 (unbounded operators) "
                                  "are essential for PhD-level quantum mechanics.",
                },
                {
                    "authors": "Galindo, A. and Pascual, P.",
                    "year": "1990",
                    "title": "Quantum Mechanics I, Ch.~1",
                    "venue": "Springer",
                    "annotation": "Provides a careful mathematical treatment of Hilbert spaces, "
                                  "separability, and the domain question at a physics-oriented "
                                  "but rigorous level.",
                },
                {
                    "authors": "Thirring, W.",
                    "year": "2002",
                    "title": "Quantum Mathematical Physics, 2nd ed.",
                    "venue": "Springer",
                    "annotation": "Rigorous treatment of quantum mechanics using $C^*$-algebra "
                                  "and functional analysis.  Chapters 1--2 are relevant.",
                },
            ],
            "refs_research": [
                {
                    "authors": "Gel'fand, I. M. and Vilenkin, N. Ya.",
                    "year": "1964",
                    "title": "Generalized Functions, Vol.~4: Applications of Harmonic Analysis",
                    "venue": "Academic Press",
                    "annotation": "Introduces the rigged Hilbert space (Gel'fand triple) "
                                  "$\\Phi\\subset\\mathcal{H}\\subset\\Phi'$.  "
                                  "The mathematical foundation for continuous spectra and $|x\\rangle$.",
                },
                {
                    "authors": "Bohm, A. and Gadella, M.",
                    "year": "1989",
                    "title": "Dirac Kets, Gamow Vectors and Gel'fand Triplets",
                    "venue": "Springer Lecture Notes in Physics 348",
                    "annotation": "Physics-oriented treatment of rigged Hilbert spaces. "
                                  "Shows how $|x\\rangle$ and $|p\\rangle$ are elements of "
                                  "$\\Phi'$, not of $\\mathcal{H}$.",
                    "doi": "10.1007/3-540-51916-5",
                },
            ],

            "concept_questions": [
                "What precisely does 'completeness' of a Hilbert space mean?  Why does it matter for physics?",
                "Why is separability (countable ONB) typically assumed in non-relativistic QM?",
                "Give an example where 'Hermitian' and 'self-adjoint' differ.  What are the consequences?",
                "Why is $|x\\rangle\\notin\\mathcal{H}$?  What space does it belong to?",
                "State precisely what $\\mathbb{P}(\\mathcal{H})$ is as a topological space.",
            ],

            "problems_simple": [
                {
                    "id": "PhD-A1",
                    "statement": (
                        "Show that any separable Hilbert space has a countable orthonormal basis "
                        "(i.e., that the two definitions of 'separable' are equivalent for Hilbert spaces)."
                    ),
                    "hints": [
                        "Use Gram--Schmidt on a countable dense subset.",
                    ],
                    "advanced_hints": [
                        "Density ensures the resulting ONB spans $\\mathcal{H}$.",
                    ],
                    "solution": (
                        "Let $D=\\{d_k\\}$ be a countable dense subset. Apply Gram--Schmidt "
                        "to $D$ (discarding linearly dependent elements) to obtain a countable "
                        "ONB $\\{e_n\\}$.  For any $|\\psi\\rangle\\in\\mathcal{H}$ and $\\varepsilon>0$, "
                        "there exists $d_k$ with $\\||\\psi\\rangle-|d_k\\rangle\\|<\\varepsilon$, "
                        "hence the ONB expansion converges.  $\\square$"
                    ),
                    "difficulty": "simple",
                },
                {
                    "id": "PhD-A2",
                    "statement": (
                        "Prove rigorously that any two representatives of the same ray "
                        "in $\\mathbb{P}(\\mathcal{H})$ yield the same transition probabilities."
                    ),
                    "hints": [
                        "Two representatives of the same ray satisfy $|\\phi'\\rangle=c|\\phi\\rangle$ for some $c\\neq 0$.",
                    ],
                    "advanced_hints": [
                        "Normalisation reduces to $c=e^{i\\theta}$.",
                    ],
                    "solution": (
                        "Let $|\\phi'\\rangle=e^{i\\alpha}|\\phi\\rangle$ and $|\\psi'\\rangle=e^{i\\beta}|\\psi\\rangle$. "
                        "$|\\langle\\phi'|\\psi'\\rangle|^2=|e^{-i\\alpha}e^{i\\beta}\\langle\\phi|\\psi\\rangle|^2"
                        "=|\\langle\\phi|\\psi\\rangle|^2.$ $\\square$"
                    ),
                    "difficulty": "simple",
                },
            ],

            "problems_advanced": [
                {
                    "id": "PhD-B1",
                    "statement": (
                        "Provide a precise example of an operator that is Hermitian on a dense "
                        "domain but is not self-adjoint.  "
                        "What is the physical consequence of this distinction?"
                    ),
                    "hints": [
                        "Consider $\\hat{p}=-i\\hbar\\frac{d}{dx}$ on $L^2([0,1])$ with "
                        "domain $C^\\infty_0((0,1))$ (smooth functions vanishing at boundary).",
                    ],
                    "advanced_hints": [
                        "Check deficiency indices $(n_+,n_-)$.  "
                        "Self-adjoint extensions correspond to distinct boundary conditions.",
                    ],
                    "solution": (
                        "$\\hat{p}$ on $C^\\infty_0((0,1))\\subset L^2([0,1])$ is symmetric "
                        "(Hermitian) but has deficiency indices $(1,1)$, hence is not self-adjoint. "
                        "Each self-adjoint extension is parameterised by a phase $e^{i\\theta}$ "
                        "in the boundary condition $\\psi(1)=e^{i\\theta}\\psi(0)$. "
                        "Physically: the spectrum (eigenvalues) depends on the choice of extension, "
                        "i.e., on the boundary condition (physical setup). $\\square$"
                    ),
                    "difficulty": "advanced",
                },
                {
                    "id": "PhD-B2",
                    "statement": (
                        "Motivate the rigged Hilbert space construction $\\Phi\\subset\\mathcal{H}\\subset\\Phi'$. "
                        "Explain why $|x\\rangle$ lives in $\\Phi'$ and not in $\\mathcal{H}$, "
                        "and state the nuclear spectral theorem."
                    ),
                    "hints": [
                        "Note that $\\langle x|x\\rangle=\\delta(0)$ is not a finite number.",
                        "$\\Phi$ is a dense nuclear space (e.g., Schwartz space $\\mathcal{S}(\\mathbb{R})$).",
                    ],
                    "advanced_hints": [
                        "Nuclear spectral theorem: if $\\hat{A}$ is self-adjoint on $\\mathcal{H}$ "
                        "and $\\Phi$ is nuclear and invariant under $\\hat{A}$, then $\\hat{A}$ "
                        "has a complete set of generalised eigenvectors in $\\Phi'$.",
                    ],
                    "solution": (
                        "The position operator $\\hat{x}$ has no $L^2(\\mathbb{R})$ eigenvectors "
                        "(since $\\langle x'|x\\rangle=\\delta(x'-x)\\notin L^2$). "
                        "Taking $\\Phi=\\mathcal{S}(\\mathbb{R})$ (Schwartz space, nuclear), "
                        "$\\mathcal{H}=L^2(\\mathbb{R})$, and $\\Phi'$ the space of tempered distributions, "
                        "the nuclear spectral theorem guarantees $|x\\rangle\\in\\Phi'$ with "
                        "$\\hat{x}|x\\rangle=x|x\\rangle$ in the distributional sense. $\\square$"
                    ),
                    "difficulty": "advanced",
                },
            ],

            "project_simple": {
                "title": "Rigor Checklist for Dirac Notation",
                "description": (
                    "Compile a one-page 'safety checklist' for using Dirac notation rigorously: "
                    "for each common manipulation (insert completeness, take $\\langle x|$, "
                    "expand in continuous basis), state the domain/convergence conditions required."
                ),
                "deliverable": "A formatted one-page checklist suitable for posting above a desk.",
                "estimated_hours": "2-3",
                "tools": ["Reed & Simon (1972)", "Pen and paper or LaTeX"],
                "difficulty": "simple",
            },
            "project_advanced": {
                "title": "Projective Hilbert Space in Quantum Information",
                "description": (
                    "Write a 10-page mini-survey on how the projective Hilbert space "
                    "structure appears in quantum information: "
                    "(1) pure state tomography; "
                    "(2) the Bloch sphere as $\\mathbb{P}(\\mathbb{C}^2)$; "
                    "(3) fidelity and trace distance as metrics on $\\mathbb{P}(\\mathcal{H})$; "
                    "(4) one connection to quantum error correction."
                ),
                "deliverable": "10-page survey with full references.",
                "estimated_hours": "15-20",
                "tools": ["Nielsen & Chuang (2000)", "Research literature"],
                "difficulty": "advanced",
            },

            "research_simple": {
                "question": (
                    "Write a 10-page note on separability assumptions in quantum mechanics: "
                    "which physical systems require non-separable Hilbert spaces, "
                    "and what technical complications arise?"
                ),
                "scope": "well-defined",
                "expected_output": "10-page technical note with at least 5 references.",
                "background_needed": ["Reed & Simon Vol. 1", "QFT basics (helpful)"],
            },
            "research_open": {
                "question": (
                    "Operational reconstructions of quantum mechanics: "
                    "what is the minimal set of axioms from which the full Hilbert-space structure "
                    "(including the Born rule, complex amplitudes, and tensor-product composition) "
                    "can be derived?  Is there a unique such derivation?"
                ),
                "scope": "open",
                "background_needed": ["PhD-level QM", "Convex operational theories", "Category theory (helpful)"],
                "connection_to_literature": (
                    "See Hardy (2001), Chiribella et al. (2011, PRA), "
                    "and Masanes & Mueller (2011, NJP) for leading approaches."
                ),
            },
        },  # end PhD

    },  # end tiers
}
