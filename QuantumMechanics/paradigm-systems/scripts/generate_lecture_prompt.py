#!/usr/bin/env python3
"""
generate_lecture_prompt.py
--------------------------
Fills the standard LECTURE GENERATION PROMPT for any lecture in Module I.4.

Usage:
    python3 scripts/generate_lecture_prompt.py --lecture L05
    python3 scripts/generate_lecture_prompt.py --lecture L09 --tracks UG Grad Research
    python3 scripts/generate_lecture_prompt.py --all          (prints all 12 prompts)

Output is printed to stdout. Pipe to a file or paste into your AI session.
"""

import argparse
import sys

# ─── Module I.4 lecture catalogue ────────────────────────────────────────────
LECTURES = {
    "L01": {
        "title":    "Free Particle and Particle in a Box",
        "prev":     "I.3 / L10 — Open quantum systems",
        "next":     "I.4 / L02 — The Simple Bloch Electron",
        "key":      "Plane waves; wave packets; quantisation; DOS in 1/2/3D",
        "prereqs":  "Modules I.1–I.3 complete",
    },
    "L02": {
        "title":    "The Simple Bloch Electron",
        "prev":     "I.4 / L01 — Free Particle and Particle in a Box",
        "next":     "I.4 / L03 — The Harmonic Oscillator",
        "key":      "Bloch's theorem; BZ; nearly-free electron gap; tight-binding",
        "prereqs":  "I.4 / L01; periodic boundary conditions; Fourier series",
    },
    "L03": {
        "title":    "The Harmonic Oscillator",
        "prev":     "I.4 / L02 — The Simple Bloch Electron",
        "next":     "I.4 / L04 — Rabi Model and Two-Level Systems",
        "key":      "Ladder operators; coherent states; anharmonic PT; Morse potential",
        "prereqs":  "Modules I.1–I.3; second-order perturbation theory",
    },
    "L04": {
        "title":    "Rabi Model and Two-Level Systems",
        "prev":     "I.4 / L03 — The Harmonic Oscillator",
        "next":     "I.4 / L05 — Minimal Coupling Hamiltonian and Landau Levels",
        "key":      "Jaynes–Cummings; Rabi oscillations; RWA; π-pulses",
        "prereqs":  "I.4 / L03; time-dependent perturbation theory (I.3)",
    },
    "L05": {
        "title":    "Minimal Coupling Hamiltonian and Landau Levels",
        "prev":     "I.4 / L04 — Rabi Model and Two-Level Systems",
        "next":     "I.4 / L06 — Zeeman Effect",
        "key":      "(p̂ − eA)²/2m; gauge invariance; Landau levels; Aharonov–Bohm",
        "prereqs":  "Classical EM; I.3 symmetry lectures; angular momentum",
    },
    "L06": {
        "title":    "Zeeman Effect",
        "prev":     "I.4 / L05 — Minimal Coupling Hamiltonian and Landau Levels",
        "next":     "I.4 / L07 — Stark Effect",
        "key":      "Normal and anomalous Zeeman; Paschen–Back; Breit–Rabi",
        "prereqs":  "I.4 / L05; angular momentum addition; Wigner–Eckart theorem",
    },
    "L07": {
        "title":    "Stark Effect",
        "prev":     "I.4 / L06 — Zeeman Effect",
        "next":     "I.4 / L08 — Spin–Orbit Coupling and Fine Structure",
        "key":      "Linear and quadratic Stark; parabolic coordinates; polarisability",
        "prereqs":  "First- and second-order degenerate PT (I.3); parity",
    },
    "L08": {
        "title":    "Spin–Orbit Coupling and Fine Structure of Hydrogen",
        "prev":     "I.4 / L07 — Stark Effect",
        "next":     "I.4 / L09 — The Hydrogen Atom",
        "key":      "Thomas precession; L̂·Ŝ; E_nj^FS; Lamb shift",
        "prereqs":  "I.4 / L07; relativistic mechanics (classical); Dirac equation preview",
    },
    "L09": {
        "title":    "The Hydrogen Atom",
        "prev":     "I.4 / L08 — Spin–Orbit Coupling and Fine Structure",
        "next":     "I.4 / L10 — Scattering from a Potential Barrier",
        "key":      "Coulomb potential; radial equation; ψ_nlm; SO(4) symmetry",
        "prereqs":  "Spherical harmonics; I.4 / L08; Laguerre polynomials",
    },
    "L10": {
        "title":    "Scattering from a Potential Barrier",
        "prev":     "I.4 / L09 — The Hydrogen Atom",
        "next":     "I.4 / L11 — Scattering from a Potential Well",
        "key":      "Step potential; transmission; tunnelling; T and R coefficients",
        "prereqs":  "I.4 / L01 (free particle); probability current; I.3 time evolution",
    },
    "L11": {
        "title":    "Scattering from a Potential Well",
        "prev":     "I.4 / L10 — Scattering from a Potential Barrier",
        "next":     "I.4 / L12 — Delta-Function Potential and WKB Tunnelling",
        "key":      "Finite square well; bound states; resonance transmission; scattering length",
        "prereqs":  "I.4 / L10; transcendental equations; graphical methods",
    },
    "L12": {
        "title":    "Delta-Function Potential and WKB Tunnelling",
        "prev":     "I.4 / L11 — Scattering from a Potential Well",
        "next":     "Module I.5 — Introductory Physical Systems (Lecture Menu)",
        "key":      "δ(x) bound state; WKB quantisation; tunnelling rate; Geiger–Nuttall law",
        "prereqs":  "I.4 / L10–L11; classical mechanics (action-angle variables)",
    },
}

ALL_TRACKS = ["UG", "Grad", "Research"]

PROMPT_TEMPLATE = """\
================================================================================
  LECTURE GENERATION PROMPT — AUTO-FILLED
  Module I.4: Paradigm Physical Systems
  Generated by: scripts/generate_lecture_prompt.py
================================================================================

You are generating a complete lecture document for the following course:

  Programme  : Quantum Mechanics & Quantum Chemistry
  Hierarchy  : Series I > Module I.4 > Lecture {code}
  Series     : Series I — Introductory Quantum Mechanics
  Module     : Module I.4 — Paradigm Physical Systems
  Lecture    : {code} — {title}
  Duration   : 90 minutes
  Active tracks:
    {track_ug}  Undergraduate track  (Tiers 1-3: HS, BegUG, AdvUG)
    {track_grad}  Graduate track       (Tiers 4-5: MSc, PhD)
    {track_res}  Research track       (Tiers 4-5, shared)

CONTEXT FROM SYLLABUS
---------------------
Preceding lecture   : {prev}
Following lecture   : {next}
Module prerequisites: {prereqs}
Key concepts from this lecture (from syllabus overview table):
  {key}


GENERATE THE FOLLOWING SECTIONS
--------------------------------

1. LECTURE HEADER (metadata block)
2. LEARNING OBJECTIVES (per tier, Tiers 1–5)
3. 90-MINUTE PACING PLAN (4-6 time blocks)
4. SECTION-BY-SECTION CONTENT (lecture body, sections {code}.1 through {code}.N)
5. CONNECTIONS (backward / forward / cross-module)
6. ASSESSMENT ARTIFACT BUNDLE (all 14 types, see taxonomy below)
7. EXERCISE PACKAGING (4-layer format for CPSU, CPSG, SPJU)
8. READING AND RESOURCES (tiered bibliography)
9. BIBLIOGRAPHY ADDITIONS (Section 9 — tiered bibliography blocks BIB-T1 through BIB-CAT)

ARTIFACT TAXONOMY (generate all applicable types)
--------------------------------------------------

UNDERGRADUATE TRACK (Tiers 1-3):
  SCQU  Simple Concept Questions — UG          (×10)
  CCQU  Complex Concept Questions — UG         (×10)
  SPSU  Simple Problem Set — UG                (×10)
  CPSU  Complex Problem Set — UG               (×5,  4-layer)
  SPJU  Simple Project — UG                    (×1,  4-layer)
  CPJU  Complex Project — UG                   (×1)

GRADUATE TRACK (Tiers 4-5):
  SCQG  Simple Concept Questions — Grad        (×10)
  CCQG  Complex Concept Questions — Grad       (×10)
  SPSG  Simple Problem Set — Grad              (×10)
  CPSG  Complex Problem Set — Grad             (×5,  4-layer)
  SPJG  Simple Projects — Grad                 (×5)
  CPJG  Complex Projects — Grad                (×5)

RESEARCH TRACK (Tiers 4-5):
  WRQ   Well-Defined Research Questions        (×5)
  ORQ   Open-Ended Research Questions          (×5)

TOTAL: 92 items across 14 types.

RUBRIC WEIGHTS
--------------
SCQU/SCQG : correct 1.5 + justification 0.5 = 2 pts each → 20 pts total
CCQU/CCQG : key point 1.0 + argument 1.0 = 2 pts each → 20 pts total
SPSU/SPSG : Result 60% + Method 30% + Interpretation 10%
CPSU/CPSG : Assumptions 15% + Proof structure 45% + Algebra 25% + Insight 15%
SPJU/SPJG : Correctness 40% + Tests 25% + Clarity 25% + Reproducibility 10%
CPJU/CPJG : Technical 30% + Synthesis 35% + Depth 25% + Originality 10%
WRQ       : Scope/method 25% + Evidence 25% + Technical 25% + Argument 25%
ORQ       : Clarity 25% + Depth 25% + Novelty 25% + Limitations 25%

OUTPUT FORMAT
-------------
- LaTeX source, compilable with the programme preamble (see preamble.tex)
- Section numbers: {code}.N format throughout
- tcolorbox styles: ugconceptbox / ugprobbox / gradconceptbox / gradprobbox / researchbox / rubricbox
- Tier tags: \\tiertag{{tier1col}}{{Tier 1}} through \\tiertag{{tier5col}}{{Tier 5}}
- Equations: \\label{{eq:{code}.N}}
- Do NOT use \\maketitle; begin with \\section*{{{title}}}

QUALITY CHECKLIST
-----------------
  [ ] Section numbers follow {code}.N format
  [ ] All notation matches programme conventions (see preamble.tex)
  [ ] Each active tier has ≥3 distinct learning objectives
  [ ] Pacing plan sums to exactly 90 minutes
  [ ] Artifact counts correct (SCQU=10, CCQU=10, SPSU=10, CPSU=5, SPJU=1, CPJU=1,
                              SCQG=10, CCQG=10, SPSG=10, CPSG=5, SPJG=5, CPJG=5,
                              WRQ=5, ORQ=5)
  [ ] 4-layer packaging present for CPSU, CPSG, SPJU
  [ ] Backward/forward connections reference correct lecture codes
  [ ] Bibliography blocks BIB-T1 through BIB-CAT present

================================================================================
END OF PROMPT — paste the above into your AI session to generate {code}
================================================================================
"""

def make_prompt(code, tracks=None):
    if code not in LECTURES:
        print(f"ERROR: Unknown lecture code '{code}'. Valid codes: {', '.join(LECTURES)}", file=sys.stderr)
        sys.exit(1)

    L = LECTURES[code]
    tracks = tracks or ALL_TRACKS

    def tick(t): return "[x]" if t in tracks else "[ ]"

    return PROMPT_TEMPLATE.format(
        code=code,
        title=L["title"],
        prev=L["prev"],
        next=L["next"],
        key=L["key"],
        prereqs=L["prereqs"],
        track_ug=tick("UG"),
        track_grad=tick("Grad"),
        track_res=tick("Research"),
    )

def main():
    parser = argparse.ArgumentParser(
        description="Generate filled lecture generation prompts for Module I.4."
    )
    parser.add_argument("--lecture", "-l", metavar="CODE",
                        help="Lecture code, e.g. L05")
    parser.add_argument("--all", "-a", action="store_true",
                        help="Generate prompts for all 12 lectures")
    parser.add_argument("--tracks", nargs="+", choices=["UG", "Grad", "Research"],
                        default=["UG", "Grad", "Research"],
                        help="Active tracks (default: all three)")
    args = parser.parse_args()

    if args.all:
        for code in LECTURES:
            print(make_prompt(code, args.tracks))
            print("\n" + "="*80 + "\n")
    elif args.lecture:
        print(make_prompt(args.lecture.upper(), args.tracks))
    else:
        parser.print_help()
        print("\nExample: python3 scripts/generate_lecture_prompt.py --lecture L05")
        sys.exit(0)

if __name__ == "__main__":
    main()
