"""
generate_L01_v3_artifacts.py
============================
Generates the complete v3 artifact bundle for L01:
  The Hilbert Space of Quantum States
  Module I.1 | Series I — Introductory Quantum Mechanics

Artifact taxonomy v3 (14 types, 92 items):
  UG track  (Tiers 1-3): SCQU(10) CCQU(10) SPSU(10) CPSU(5) SPJU(1) CPJU(1)
  Grad track(Tiers 4-5): SCQG(10) CCQG(10) SPSG(10) CPSG(5) SPJG(5) CPJG(5)
  Research  (Tiers 4-5): WRQ(5) ORQ(5)
  + BIB: tiered bibliography additions (Section 9)

Output: /home/claude/pdf_output_v3/L01_<CODE>.pdf  (15 PDFs)
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY

# ─── Fonts ────────────────────────────────────────────────────────────────
FD = "/usr/share/fonts/truetype/dejavu"
pdfmetrics.registerFont(TTFont("DS",  f"{FD}/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("DSB", f"{FD}/DejaVuSans-Bold.ttf"))
pdfmetrics.registerFont(TTFont("DSI", f"{FD}/DejaVuSans-Oblique.ttf"))
pdfmetrics.registerFont(TTFont("Ser", f"{FD}/DejaVuSerif.ttf"))
pdfmetrics.registerFont(TTFont("SerB",f"{FD}/DejaVuSerif-Bold.ttf"))
pdfmetrics.registerFont(TTFont("SerI",f"{FD}/DejaVuSerif-Italic.ttf"))
pdfmetrics.registerFont(TTFont("Mono",f"{FD}/DejaVuSansMono.ttf"))

# ─── Colours (matching pedagogical_support_v3.tex) ────────────────────────
DARKBLUE   = colors.Color(10/255,  40/255,  90/255)
MIDBLUE    = colors.Color(30/255,  80/255,  160/255)
LIGHTBLUE  = colors.Color(220/255, 233/255, 255/255)
ACCENTGOLD = colors.Color(180/255, 140/255, 20/255)
LIGHTGOLD  = colors.Color(255/255, 248/255, 220/255)
DARKGRAY   = colors.Color(60/255,  60/255,  60/255)
LIGHTGRAY  = colors.Color(245/255, 245/255, 245/255)

# Track colours
UGBLUE      = colors.Color(25/255,  90/255,  170/255)
LIGHTUGBLUE = colors.Color(215/255, 230/255, 255/255)
UGGREEN     = colors.Color(20/255,  120/255, 70/255)
LIGHTUGGREEN= colors.Color(210/255, 245/255, 225/255)
GRADRED     = colors.Color(160/255, 30/255,  30/255)
LIGHTGRADRED= colors.Color(255/255, 220/255, 215/255)
GRADORANGE  = colors.Color(170/255, 80/255,  10/255)
LIGHTORANGE = colors.Color(255/255, 235/255, 210/255)
RESPATH     = colors.Color(90/255,  20/255,  130/255)
LIGHTRES    = colors.Color(240/255, 220/255, 255/255)
ARTPURPLE   = colors.Color(100/255, 30/255,  130/255)
LIGHTPURPLE = colors.Color(235/255, 215/255, 245/255)

# Tier colours
T1C = colors.Color(180/255, 230/255, 180/255)
T2C = colors.Color(150/255, 210/255, 240/255)
T3C = colors.Color(200/255, 180/255, 240/255)
T4C = colors.Color(255/255, 210/255, 150/255)
T5C = colors.Color(255/255, 170/255, 150/255)

PAGE_W, PAGE_H = A4
MARGIN = 2*cm

# ─── Paragraph styles ─────────────────────────────────────────────────────
def S(name, font="Ser", size=10, leading=14, color=colors.black,
      bold=False, italic=False, align=TA_LEFT, spaceAfter=4, spaceBefore=2,
      leftIndent=0):
    fn = {"Ser":{"bold":"SerB","italic":"SerI","plain":"Ser"},
          "DS": {"bold":"DSB","italic":"DSI","plain":"DS"},
          "Mono":{"bold":"Mono","italic":"Mono","plain":"Mono"}}.get(font,{"plain":font})
    fname = fn.get("bold" if bold else "italic" if italic else "plain", font)
    return ParagraphStyle(name, fontName=fname, fontSize=size, leading=leading,
                          textColor=color, alignment=align, spaceAfter=spaceAfter,
                          spaceBefore=spaceBefore, leftIndent=leftIndent)

sTitle   = S("t",  "DS", 20, 24, DARKBLUE,  bold=True,   align=TA_LEFT, spaceAfter=4)
sSub     = S("s",  "DS", 11, 14, MIDBLUE,   italic=True, align=TA_LEFT, spaceAfter=4)
sH1      = S("h1", "DS", 13, 17, DARKBLUE,  bold=True,   spaceAfter=4, spaceBefore=8)
sH2      = S("h2", "DS", 11, 14, MIDBLUE,   bold=True,   spaceAfter=3, spaceBefore=5)
sH3      = S("h3", "DS", 10, 13, DARKGRAY,  bold=True,   spaceAfter=2, spaceBefore=4)
sBody    = S("b",  "Ser",9.5,13, colors.black, align=TA_JUSTIFY, spaceAfter=3)
sSans    = S("bs", "DS", 9,  12, colors.black, spaceAfter=2)
sMono    = S("m",  "Mono",8.5,12,DARKGRAY, spaceAfter=2)
sBullet  = S("bu", "Ser",9.5,13, colors.black, leftIndent=12, spaceAfter=2)
sSmall   = S("sm", "DS", 8,  11, DARKGRAY,  spaceAfter=1)
sFooter  = S("f",  "DS", 8,  10, DARKGRAY,  italic=True, align=TA_CENTER)
sRub     = S("ru", "Ser",9,  13, colors.black, spaceAfter=2)
sCode    = S("co", "DS", 9.5,13, UGBLUE,    bold=True,   spaceAfter=3)
sCodeG   = S("cg", "DS", 9.5,13, GRADRED,   bold=True,   spaceAfter=3)
sCodeR   = S("cr", "DS", 9.5,13, RESPATH,   bold=True,   spaceAfter=3)
sQnum    = S("qn", "DS", 9.5,13, DARKBLUE,  bold=True,   spaceAfter=1, spaceBefore=4)
sAns     = S("an", "DS", 8.5,12, DARKGRAY,  italic=True, leftIndent=12, spaceAfter=2)
sBibHead = S("bh", "DS", 9,  12, DARKGRAY,  bold=True,   spaceAfter=1)
sBibBody = S("bb", "Ser",8.5,12, colors.black, spaceAfter=1)

def sp(h=6):  return Spacer(1, h)
def hr(col=MIDBLUE, w=1): return HRFlowable(width="100%", thickness=w, color=col, spaceAfter=4, spaceBefore=4)
def p(text, style=None): return Paragraph(text, style or sBody)
def bp(text, indent=0):
    st = S(f"bpx{indent}", "Ser", 9.5, 13, colors.black, leftIndent=12+indent, spaceAfter=2)
    return Paragraph(f"\u2022\u2009{text}", st)
def np_(n, text):
    st = S(f"np{n}", "Ser", 9.5, 13, colors.black, leftIndent=16, spaceAfter=2)
    return Paragraph(f"<b>{n}.</b>\u2009{text}", st)

# ─── Coloured box builder ─────────────────────────────────────────────────
def colored_box(story, title, body_items, bg, border, title_bg=None,
                title_text_color=colors.white, pad=8):
    tb = title_bg or border
    col_w = PAGE_W - 2*MARGIN - 4
    title_row = [Paragraph(f"<b>{title}</b>",
                 S("trow","DS",9.5,13,title_text_color,bold=True))]
    rows = [[title_row]] + [[item] for item in body_items]
    tbl = Table(rows, colWidths=[col_w])
    style = [
        ("BACKGROUND",  (0,0),(0,0), tb),
        ("BACKGROUND",  (0,1),(-1,-1), bg),
        ("TOPPADDING",  (0,0),(0,0), 5), ("BOTTOMPADDING",(0,0),(0,0), 5),
        ("TOPPADDING",  (0,1),(-1,-1), 6), ("BOTTOMPADDING",(0,-1),(-1,-1), 6),
        ("LEFTPADDING", (0,0),(-1,-1), pad), ("RIGHTPADDING",(0,0),(-1,-1), pad),
        ("BOX",         (0,0),(-1,-1), 1.5, border),
        ("VALIGN",      (0,0),(-1,-1), "TOP"),
    ]
    story.append(tbl)
    story.append(sp(6))

def ug_concept_box(story, title, items):
    colored_box(story, title, items, LIGHTUGBLUE, UGBLUE, UGBLUE)

def ug_prob_box(story, title, items):
    colored_box(story, title, items, LIGHTUGGREEN, UGGREEN, UGGREEN)

def grad_concept_box(story, title, items):
    colored_box(story, title, items, LIGHTGRADRED, GRADRED, GRADRED)

def grad_prob_box(story, title, items):
    colored_box(story, title, items, LIGHTORANGE, GRADORANGE, GRADORANGE)

def research_box(story, title, items):
    colored_box(story, title, items, LIGHTRES, RESPATH, RESPATH)

def rubric_box(story, items):
    colored_box(story, "Rubric", items, LIGHTPURPLE, ARTPURPLE, ARTPURPLE)

def gold_box(story, items):
    col_w = PAGE_W - 2*MARGIN - 4
    rows = [[item] for item in items]
    tbl = Table(rows, colWidths=[col_w])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0),(-1,-1), LIGHTGOLD),
        ("BOX",         (0,0),(-1,-1), 1.5, ACCENTGOLD),
        ("LEFTPADDING", (0,0),(-1,-1), 8),
        ("RIGHTPADDING",(0,0),(-1,-1), 8),
        ("TOPPADDING",  (0,0),(-1,-1), 6),
        ("BOTTOMPADDING",(0,-1),(-1,-1), 6),
        ("VALIGN",      (0,0),(-1,-1), "TOP"),
    ]))
    story.append(tbl)
    story.append(sp(6))

def tier_row(story, data):
    """Render a tier routing table."""
    rows = [["Tier", "Routing"]]
    for tier, desc in data:
        rows.append([tier, desc])
    tw = PAGE_W - 2*MARGIN - 4
    tbl = Table(rows, colWidths=[2*cm, tw-2*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",  (0,0),(-1,0), DARKBLUE),
        ("TEXTCOLOR",   (0,0),(-1,0), colors.white),
        ("FONTNAME",    (0,0),(-1,0), "DSB"),
        ("FONTSIZE",    (0,0),(-1,0), 8.5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[LIGHTGRAY, colors.white]),
        ("FONTNAME",    (0,1),(0,-1), "DSB"),
        ("FONTSIZE",    (0,0),(-1,-1), 8.5),
        ("GRID",        (0,0),(-1,-1), 0.5, colors.Color(0.7,0.7,0.7)),
        ("LEFTPADDING", (0,0),(-1,-1), 5),
        ("RIGHTPADDING",(0,0),(-1,-1), 5),
        ("TOPPADDING",  (0,0),(-1,-1), 4),
        ("BOTTOMPADDING",(0,0),(-1,-1), 4),
        ("VALIGN",      (0,0),(-1,-1), "TOP"),
    ]))
    story.append(tbl)
    story.append(sp(4))

# ─── Page template ────────────────────────────────────────────────────────
def make_on_page(lecture, doc_type, track_color=None):
    tc = track_color or DARKBLUE
    def on_page(canvas, doc):
        canvas.saveState()
        W, H = A4
        canvas.setFillColor(DARKBLUE)
        canvas.rect(0, H-1.4*cm, W, 1.4*cm, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont("DSB", 9)
        canvas.drawString(MARGIN, H-0.9*cm, f"QM/QC Programme — Module I.1 — {lecture}")
        canvas.setFont("DS", 9)
        canvas.drawRightString(W-MARGIN, H-0.9*cm, doc_type)
        canvas.setFillColor(tc)
        canvas.rect(0, H-1.7*cm, W, 0.3*cm, fill=1, stroke=0)
        canvas.setFillColor(DARKGRAY)
        canvas.setFont("DS", 7.5)
        canvas.drawString(MARGIN, 0.7*cm,
            "For academic use only | Quantum Mechanics & Quantum Chemistry Programme")
        canvas.drawRightString(W-MARGIN, 0.7*cm, f"Page {doc.page}")
        canvas.restoreState()
    return on_page

def make_doc(path, lecture, doc_type):
    return SimpleDocTemplate(
        path, pagesize=A4,
        leftMargin=MARGIN, rightMargin=MARGIN,
        topMargin=1.9*cm, bottomMargin=1.5*cm,
        title=f"QM Module I.1 — {lecture} — {doc_type}",
        author="QM/QC Programme")

def track_header_tbl(story, label, color):
    tw = PAGE_W - 2*MARGIN - 4
    tbl = Table([[Paragraph(f"<b>{label}</b>",
               S("th","DS",11,14,color,bold=True))]],
               colWidths=[tw])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1), colors.Color(*[c*0.1 for c in color.rgb()])),
        ("BOX",(0,0),(-1,-1),1.5,color),
        ("LEFTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),6),
        ("BOTTOMPADDING",(0,0),(-1,-1),6),
    ]))
    story.append(tbl)
    story.append(sp(8))

# ─── Common header block ──────────────────────────────────────────────────
def doc_header(story, code, full_name, desc, track_label, track_color, counts):
    story.append(Paragraph(f"L01 — {full_name}", sTitle))
    story.append(Paragraph("The Hilbert Space of Quantum States", sSub))
    story.append(Paragraph(
        f"<i>Module I.1 | Series I — Introductory Quantum Mechanics | 90 min</i>", sSmall))
    story.append(sp(3))
    story.append(hr(DARKBLUE, 2))
    story.append(sp(4))
    gold_box(story, [
        p(f"<b>Artifact:</b> {code} — {full_name}", S("gi","DS",9,12,DARKGRAY,bold=False)),
        p(f"<b>Track:</b> {track_label} | <b>Count:</b> {counts} | {desc}", sSmall),
        p("<b>Learning objectives:</b> LO1 — Hilbert space definition (L²(ℝ)); "
          "LO2 — bounded vs. unbounded operators; "
          "LO3 — adjoint Â†; LO4 — Hermitian / anti-Hermitian classification.", sSmall),
    ])

# ══════════════════════════════════════════════════════════════════════════
#  CONTENT DATA  (all 14 artifact types for L01)
# ══════════════════════════════════════════════════════════════════════════

# ─── SCQU ─────────────────────────────────────────────────────────────────
SCQU = {
"questions": [
# (type, question_text, [options_if_MC], answer_key)
("MC", "Which of the following is a correct statement about a Hilbert space?",
 ["(A) It is any vector space over ℂ",
  "(B) It is a complete inner product space over ℂ",
  "(C) It must be finite-dimensional",
  "(D) It requires a norm but not an inner product"],
 "Answer: (B). A Hilbert space is specifically a complete inner product space. "
 "Finite dimension is not required; completeness is the key additional axiom."),

("MC", "The inner product ⟨φ|ψ⟩ satisfies conjugate symmetry. Which equation expresses this?",
 ["(A) ⟨φ|ψ⟩ = ⟨ψ|φ⟩",
  "(B) ⟨φ|ψ⟩ = ⟨ψ|φ⟩*",
  "(C) ⟨φ|ψ⟩ = −⟨ψ|φ⟩",
  "(D) ⟨φ|ψ⟩ = |⟨ψ|φ⟩|"],
 "Answer: (B). Conjugate symmetry: ⟨φ|ψ⟩ = ⟨ψ|φ⟩*. "
 "The inner product reverses order and takes the complex conjugate."),

("MC", "The operator x̂ (multiplication by x) on L²(ℝ) is best described as:",
 ["(A) Bounded, self-adjoint",
  "(B) Bounded, but not self-adjoint",
  "(C) Unbounded, defined on all of L²(ℝ)",
  "(D) Unbounded, defined only on a dense domain"],
 "Answer: (D). x̂ is unbounded: ‖x̂ψₙ‖ can grow without bound for normalised ψₙ. "
 "It is defined on D(x̂) = {ψ ∈ L²(ℝ) : xψ(x) ∈ L²(ℝ)}, which is dense but not all of L²(ℝ)."),

("MC", "For a Hermitian operator Â = Â†, which property holds for its eigenvalues?",
 ["(A) They are purely imaginary",
  "(B) They lie on the unit circle",
  "(C) They are real",
  "(D) They always equal ±1"],
 "Answer: (C). Hermitian operators have real eigenvalues: "
 "if Â|a⟩ = a|a⟩ then a = ⟨a|Â|a⟩/⟨a|a⟩ = ⟨Â†a|a⟩*/⟨a|a⟩ = a* so a ∈ ℝ."),

("TF", "True or False: L²(ℝ) is a Hilbert space. (Justify in one sentence.)",
 [], "TRUE — L²(ℝ) is an inner product space with ⟨f|g⟩ = ∫f*(x)g(x)dx, and it is "
     "complete (Riesz–Fischer theorem: every Cauchy sequence in L²(ℝ) converges in L²(ℝ))."),

("TF", "True or False: Every bounded operator on a Hilbert space is continuous. (Justify.)",
 [], "TRUE — for linear operators on a Hilbert space, boundedness and continuity are equivalent: "
     "if ‖Âψ‖ ≤ M‖ψ‖ for all |ψ⟩, then ‖Â(ψₙ−ψ)‖ ≤ M‖ψₙ−ψ‖ → 0, so Â is continuous."),

("TF", "True or False: The adjoint (Â†)† equals Â for all bounded operators. (Justify.)",
 [], "TRUE — (Â†)† = Â follows directly from the definition of adjoint: "
     "⟨φ|(Â†)†ψ⟩ = ⟨(Â†)φ|ψ⟩ = ⟨φ|Âψ⟩ for all |φ⟩,|ψ⟩, so (Â†)† = Â."),

("TF", "True or False: An anti-Hermitian operator Â = −Â† has real eigenvalues. (Justify.)",
 [], "FALSE — if Â|a⟩ = a|a⟩ and Â = −Â†, then a⟨a|a⟩ = ⟨a|Â|a⟩ = −⟨Â†a|a⟩ = −a*⟨a|a⟩, "
     "so a = −a*, meaning a is purely imaginary."),

("SA", "What is the physical significance of the norm ‖|ψ⟩‖ = √⟨ψ|ψ⟩ = 1 for a quantum state?",
 [], "A unit norm means the total probability of all measurement outcomes sums to one. "
     "Specifically, for any complete orthonormal basis {|n⟩}, Σₙ|⟨n|ψ⟩|² = ⟨ψ|ψ⟩ = 1, "
     "which is the normalisation condition for a probability distribution."),

("SA", "Give one physical example each of a bounded operator and an unbounded operator "
       "in quantum mechanics, and state why each falls in its category.",
 [], "Bounded: spin operator Ŝz on ℂ²; its eigenvalues are ±ℏ/2, so ‖Ŝz‖ = ℏ/2 < ∞. "
     "Unbounded: position x̂ on L²(ℝ); for ψₙ(x) = n⁻½ χ_{[n,n+1]}(x), ‖x̂ψₙ‖ ≈ n → ∞ "
     "while ‖ψₙ‖ = 1, so ‖x̂‖ = ∞."),
],
"rubric": [
  p("Each question: Correct answer (1.5 pts) + Brief justification (0.5 pts)"),
  p("<b>Total: 20 points</b> (10 questions × 2 pts each)"),
  p("Tier HS: full credit for correct qualitative answer without formalism. "
    "Tier BegUG: must show computation. Tier AdvUG: must identify precisely correct option."),
],
"tier_routing": [
  ("HS",    "Qualitative answers accepted; no algebraic manipulation required"),
  ("BegUG", "Qualitative + brief algebraic check (e.g. verify ‖|ψ⟩‖² = 1)"),
  ("AdvUG", "Include near-equivalent option discrimination; one-line proof required for TF"),
],
}

# ─── CCQU ─────────────────────────────────────────────────────────────────
CCQU = {
"questions": [
# (type, question, answer_key)
("EW", "Why is completeness (in the sense of Cauchy sequences) physically necessary for "
       "quantum mechanics — not merely a mathematical luxury?",
 "Time evolution U(t) = e^{−iĤt/ℏ} requires the limit of a sequence of partial sums "
 "to remain in the state space. Without completeness, time-evolved states could 'escape' ℋ, "
 "making unitary dynamics impossible. Similarly, Fourier expansions of wave packets require "
 "limits to stay in L²(ℝ)."),

("EW", "Explain why the inner product ⟨·|·⟩ must be linear in its second argument (not its first) "
       "in physics, even though some mathematics texts use the opposite convention.",
 "The physics convention ⟨φ|αψ+βχ⟩ = α⟨φ|ψ⟩+β⟨φ|χ⟩ (linear in second slot) ensures "
 "that ket vectors |ψ⟩ transform linearly under superposition, matching the superposition "
 "principle. Operators act linearly on kets: Â(α|ψ⟩+β|φ⟩) = αÂ|ψ⟩+βÂ|φ⟩. "
 "The bra ⟨φ| is then an antilinear functional, consistent with conjugate symmetry."),

("EW", "Why does every Hermitian operator Â admit an orthonormal eigenbasis (spectral theorem), "
       "and why is this physically essential for the measurement postulate?",
 "Spectral theorem (finite dim): every Hermitian matrix is unitarily diagonalisable, so its "
 "eigenvectors span the space and can be made orthonormal by Gram–Schmidt. Physically: the "
 "Born rule requires a complete set of mutually exclusive outcomes; orthonormality of eigenstates "
 "ensures P(aₙ) = |⟨aₙ|ψ⟩|² are non-negative and sum to 1."),

("EW", "Explain the physical difference between a Hermitian operator and an anti-Hermitian "
       "operator, and give one role of each in quantum mechanics.",
 "Hermitian (Â = Â†): real eigenvalues → serves as observables; measurement outcomes are real. "
 "Anti-Hermitian (Â = −Â†): purely imaginary eigenvalues → serves as generator of unitary "
 "transformations. If Ĝ is Hermitian, then iĜ is anti-Hermitian and e^{iθĜ} is unitary. "
 "Example: Ĥ is Hermitian (energy observable); iĤ/ℏ is anti-Hermitian (generator of time evolution)."),

("WW", "What would change in quantum mechanics if the inner product space for states were "
       "not required to be complete? Give a concrete example of what goes wrong.",
 "Without completeness, the state space would be only a pre-Hilbert space. A concrete failure: "
 "the Fourier series of a square-wave is a Cauchy sequence of smooth functions converging to a "
 "discontinuous limit. If the state space were only C¹([0,1]) with L²-norm, this limit would "
 "not exist in the space, so Fourier-mode wave packet superposition would be ill-defined. "
 "Time evolution would leave the 'space'."),

("WW", "What would change if we replaced ℂ with ℝ as the scalar field for Hilbert space? "
       "Which quantum phenomena would immediately fail?",
 "Over ℝ, the inner product would be real-valued, preventing complex phases. "
 "Interference cross-terms |A₁+A₂|² − |A₁|² − |A₂|² = 2Re(A₁*A₂) would always be real "
 "but would lose the sign-oscillation needed for destructive interference. "
 "Time evolution e^{−iĤt/ℏ} would not exist as an operator on a real space. "
 "Spin-½ states cannot be represented over ℝ."),

("WW", "What would change about the operator algebra if the adjoint operation were not "
       "an involution — that is, if (Â†)† ≠ Â?",
 "If (Â†)† ≠ Â, the inner product definition ⟨φ|Âψ⟩ = ⟨Â†φ|ψ⟩ would be inconsistent: "
 "applying it twice gives ⟨φ|Âψ⟩ = ⟨Â†φ|ψ⟩ = ⟨φ|(Â†)†ψ⟩, which forces (Â†)† = Â. "
 "The decomposition Â = A_H + A_{AH} would fail. Hermitian and anti-Hermitian parts "
 "would not be uniquely defined."),

("FL", "A student claims: 'The Hilbert space for quantum mechanics is just ℂⁿ for some n, "
       "since all physical systems have finitely many measurable outcomes.' "
       "Identify the flaw.",
 "Flaw: Continuous observables (position x̂, momentum p̂) have continuous spectra — "
 "uncountably many possible outcomes. Their rigorous treatment requires L²(ℝ), which is "
 "infinite-dimensional and not isomorphic to ℂⁿ. Even for spin-½ (ℂ²), the full "
 "dynamical algebra including x̂, p̂ requires L²(ℝ)."),

("FL", "A student computes: '⟨φ|Â†|ψ⟩ = ⟨φ|Â|ψ⟩* because the adjoint just takes "
       "the complex conjugate.' Identify the precise error.",
 "Error: the adjoint is NOT just complex conjugation. The correct relationship is "
 "⟨φ|Â†|ψ⟩ = ⟨ψ|Â|φ⟩* (swap bra and ket AND conjugate). "
 "For matrices: (Â†)ᵢⱼ = Â*ⱼᵢ (conjugate transpose — both conjugate AND transpose). "
 "The student omitted the transpose (index swap)."),

("FL", "A student argues: 'Since ‖Âψ‖ ≤ M‖ψ‖ for all ψ in some dense subset D of ℋ, "
       "then Â is bounded on all of ℋ.' Identify the flaw and state the correct result.",
 "Flaw: boundedness on a dense subset does not immediately imply boundedness on all of ℋ "
 "unless Â is also continuous (or equivalently, closable). The correct statement: "
 "if Â is bounded on D and D is dense in ℋ, then Â extends uniquely to a bounded operator "
 "on all of ℋ by continuity (the BLT theorem — bounded linear transformation theorem)."),
],
"rubric": [
  p("Each question: Correct identification of key point (1.0 pt) + Coherent argument/example (1.0 pt)"),
  p("<b>Total: 20 points</b> (10 questions × 2 pts each)"),
  p("25–35 minutes; homework or tutorial context. Tier BegUG: trace through argument. "
    "Tier AdvUG: identify logical gaps; construct counterexample."),
],
"tier_routing": [
  ("BegUG", "Explain consequences of definitions; trace through an argument step by step"),
  ("AdvUG", "Identify logical gaps; construct a counterexample; compare two approaches"),
],
}

# ─── SPSU ─────────────────────────────────────────────────────────────────
SPSU = {
"partA": [
  ("1", "Verify that ℂ² with ⟨φ|ψ⟩ = φ₁*ψ₁ + φ₂*ψ₂ satisfies all four "
        "inner product axioms. Identify each axiom as you verify it. "
        "[Tier HS: verify axioms IP3 and IP4 only; Tier BegUG: verify all four.]"),
  ("2", "For the operator Â = [[1+i, 2],[3, 4−i]] on ℂ², compute Â†. "
        "Then compute the Hermitian part Â_H = (Â+Â†)/2 and verify Â_H = Â_H†."),
  ("3", "Verify that the Pauli matrix σ₂ = [[0,−i],[i,0]] is Hermitian. "
        "Compute its eigenvalues. Verify they are real."),
  ("4", "Show that the operator norm ‖Â‖ = sup{‖Â|ψ⟩‖ : ‖|ψ⟩‖ = 1} satisfies "
        "‖Â‖ ≥ 0 and ‖Â‖ = 0 iff Â = 0, for any bounded operator on ℋ."),
],
"partB": [
  ("5", "A quantum state is |ψ⟩ = (3/5)|+⟩ + (4i/5)|−⟩. "
        "(a) Verify ⟨ψ|ψ⟩ = 1. "
        "(b) Compute P(+ℏ/2) and P(−ℏ/2) for a measurement of Ŝz. "
        "(c) State which probabilities change if |ψ⟩ is multiplied by e^{iπ/4}. "
        "[Tier HS: part (b) only.]"),
  ("6", "Given ‖|ψ⟩‖ = 1 and |φ⟩ = Û|ψ⟩ where ÛÛ† = 1̂, explain in one sentence "
        "why ‖|φ⟩‖ = 1 without explicit computation. "
        "Then verify algebraically using ‖Û|ψ⟩‖² = ⟨ψ|Û†Û|ψ⟩."),
  ("7", "The operator Ĝ = iÂ where Â = Â† is Hermitian. "
        "Show Ĝ = −Ĝ† (anti-Hermitian). "
        "What does this tell you about the eigenvalues of Ĝ?"),
],
"partC": [
  ("8", "A state is described by ψ(x) = (πσ²)^{−1/4} exp(−x²/(2σ²)) (Gaussian). "
        "(a) Write ⟨ψ|ψ⟩ as an integral and verify it equals 1. "
        "(b) Write this state as |ψ⟩ in Dirac notation without choosing a basis. "
        "(c) [Tier AdvUG] Explain why ψ(x) = ⟨x|ψ⟩ and what type of object ⟨x| is."),
  ("9", "The Pauli matrices {σ₁, σ₂, σ₃} span the space of traceless Hermitian 2×2 matrices. "
        "(a) [Tier BegUG] Verify σ₁† = σ₁. "
        "(b) [Tier AdvUG] Show {σ₁, σ₂, σ₃} are orthonormal under the Hilbert–Schmidt "
        "inner product ⟨A,B⟩_HS = Tr(A†B)/2."),
  ("10", "[Tier BegUG/AdvUG] The anti-commutator {σᵢ,σⱼ} = σᵢσⱼ+σⱼσᵢ and commutator "
         "[σᵢ,σⱼ] = σᵢσⱼ−σⱼσᵢ of Pauli matrices satisfy: {σᵢ,σⱼ} = 2δᵢⱼ1̂ and "
         "[σᵢ,σⱼ] = 2iεᵢⱼₖσₖ. "
         "Verify both identities for i=1, j=2 by direct matrix multiplication."),
],
"rubric": [
  p("Per problem: Correct result (60%) + Correct method and notation (30%) + "
    "Interpretation sentence where asked (10%)"),
  p("Tier HS: arithmetic errors forgiven if method correct. "
    "Tier BegUG: Dirac notation required. "
    "Tier AdvUG: representation independence must be checked."),
],
}

# ─── CPSU ─────────────────────────────────────────────────────────────────
CPSU = {
"problems": [
  {
   "num": "1", "title": "Cauchy–Schwarz and Triangle Inequality",
   "parts": [
     ("a", "State the four axioms of an inner product ⟨·|·⟩ on a complex vector space ℋ. "
            "[4 marks]"),
     ("b", "Prove the Cauchy–Schwarz inequality: |⟨φ|ψ⟩|² ≤ ⟨φ|φ⟩·⟨ψ|ψ⟩. "
            "Hint: consider ‖|ψ⟩ − λ|φ⟩‖² ≥ 0 and choose λ = ⟨φ|ψ⟩/⟨φ|φ⟩. [8 marks]"),
     ("c", "Deduce the triangle inequality ‖|φ⟩+|ψ⟩‖ ≤ ‖|φ⟩‖+‖|ψ⟩‖. [4 marks]"),
     ("d", "Verify Cauchy–Schwarz explicitly for |φ⟩ = (1,i)/√2 and |ψ⟩ = (i,1)/√2 "
            "in ℂ², and confirm equality or strict inequality. [4 marks]"),
   ],
   "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Interpretation (15%)"
  },
  {
   "num": "2", "title": "Properties of the Adjoint",
   "parts": [
     ("a", "Using the definition ⟨φ|Âψ⟩ = ⟨Â†φ|ψ⟩, prove the adjoint is unique. [5 marks]"),
     ("b", "Prove (Â†)† = Â for bounded operators. [5 marks]"),
     ("c", "Prove (ÂB̂)† = B̂†Â†. [5 marks]"),
     ("d", "Decompose Â = [[2+i, 3],[1, 4−2i]] into Â = Â_H + Â_{AH} (Hermitian + anti-Hermitian). "
            "Verify each part satisfies its classification. [5 marks]"),
   ],
   "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Interpretation (15%)"
  },
  {
   "num": "3", "title": "Bounded Operators and Operator Norm",
   "parts": [
     ("a", "Define the operator norm ‖Â‖. Show it satisfies ‖Â‖ ≥ 0, "
            "‖αÂ‖ = |α|‖Â‖, and ‖Â+B̂‖ ≤ ‖Â‖+‖B̂‖. [6 marks]"),
     ("b", "Show ‖ÂB̂‖ ≤ ‖Â‖‖B̂‖ (submultiplicativity). [5 marks]"),
     ("c", "State the Hellinger–Toeplitz theorem. Explain why this implies x̂ (multiplication "
            "by x on L²(ℝ)) cannot be defined on all of L²(ℝ) if it is to be Hermitian. [5 marks]"),
   ],
   "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Interpretation (15%)"
  },
  {
   "num": "4", "title": "Hermitian Operators — Real Eigenvalues and Orthogonality",
   "parts": [
     ("a", "Prove that if Â = Â† and Â|a⟩ = a|a⟩, then a ∈ ℝ. [4 marks]"),
     ("b", "Prove that if Â = Â† and Â|aₘ⟩ = aₘ|aₘ⟩, Â|aₙ⟩ = aₙ|aₙ⟩ with aₘ ≠ aₙ, "
            "then ⟨aₘ|aₙ⟩ = 0. [4 marks]"),
     ("c", "For the 2×2 Hermitian matrix Â = [[3,1],[1,3]], find all eigenvalues and "
            "orthonormal eigenvectors. Write the spectral decomposition Â = Σₙ aₙ|aₙ⟩⟨aₙ|. "
            "[5 marks]"),
     ("d", "Using the spectral decomposition, compute e^{iπÂ/4}. Verify it is unitary. [5 marks]"),
   ],
   "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Interpretation (15%)"
  },
  {
   "num": "5", "title": "L²(ℝ) as a Hilbert Space",
   "parts": [
     ("a", "Define L²(ℝ) precisely, including the equivalence relation that makes it "
            "a vector space. [4 marks]"),
     ("b", "Verify that the formula ⟨f|g⟩ = ∫_{-∞}^{∞} f*(x)g(x)dx satisfies all four "
            "inner product axioms for f,g ∈ L²(ℝ). (You may assume integrability.) [8 marks]"),
     ("c", "State the Riesz–Fischer theorem and explain why it proves L²(ℝ) is complete. "
            "[4 marks]"),
     ("d", "[AdvUG] Give an example of a Cauchy sequence in the normed space (C([0,1]), ‖·‖₂) "
            "that does not converge within C([0,1]). What does this tell you about completeness? "
            "[4 marks]"),
   ],
   "rubric": "Assumptions (15%) | Proof structure (45%) | Algebra (25%) | Interpretation (15%)"
  },
],
}

# ─── SPJU ─────────────────────────────────────────────────────────────────
SPJU = {
"title": "Hilbert Space Verification and Adjoint Calculator",
"time": "3–5 hours",
"objective": "Build a Python tool that accepts a complex matrix, verifies Hilbert space "
              "inner product axioms, computes the adjoint, and classifies the operator.",
"spec": [
  ("INPUTS", "An n×n complex matrix A (numpy array, n = 2,3,4); "
             "optionally, two test vectors φ, ψ ∈ ℂⁿ"),
  ("OUTPUTS", "(i) A† (adjoint/conjugate transpose); "
              "(ii) Classification: Hermitian / anti-Hermitian / unitary / none; "
              "(iii) Inner product ⟨φ|ψ⟩ and verification of Cauchy–Schwarz; "
              "(iv) Eigenvalues of A and A†; confirmation that they are real (Hermitian case)"),
  ("REQUIRED CHECKS", "Verify UU†=1̂ (unitary); A=A† (Hermitian); A=−A† (anti-Hermitian); "
                       "Cauchy–Schwarz |⟨φ|ψ⟩|² ≤ ⟨φ|φ⟩⟨ψ|ψ⟩; "
                       "decomposition A = A_H + A_AH and verify each part; "
                       "tolerance: 10⁻¹⁰"),
  ("DELIVERABLES", "Python script (well-commented) + README (≤1 page) + "
                   "worked example output for: σ₂ = [[0,−i],[i,0]], "
                   "B = [[1+i,2],[3,4−i]], Û = e^{iπσ₁/4}"),
  ("FOUR-LAYER PACKAGING", "Layer 1: problem statement (this spec). "
                            "Layer 2: hint file (suggest numpy.linalg.eig, np.conj.T). "
                            "Layer 3: advanced hint (use numpy.testing.assert_allclose). "
                            "Layer 4: model solution with comments."),
],
"rubric": [
  p("Correctness of adjoint, classification, and Cauchy–Schwarz check (40%)"),
  p("All required verification tests implemented and passing (25%)"),
  p("Clarity of README explanation (25%)"),
  p("Reproducibility: script runs without modification on fresh environment (10%)"),
],
}

# ─── CPJU ─────────────────────────────────────────────────────────────────
CPJU = {
"title": "Bounded vs. Unbounded Operators: A Comparative Investigation",
"time": "10–15 hours",
"objective": "Investigate the distinction between bounded and unbounded operators in "
              "quantum mechanics through analytical arguments and numerical experiments.",
"spec": [
  ("SECTION 1 — ANALYTICAL", "Compare σz (bounded on ℂ²) and x̂ (unbounded on L²(ℝ)): "
    "for each, state domain, compute or estimate operator norm, classify boundedness. "
    "For x̂ restricted to L²([−N,N]): show ‖x̂‖ = N analytically."),
  ("SECTION 2 — NUMERICAL", "Plot ‖x̂‖ as a function of N for N = 1,2,...,50 "
    "by discretising L²([−N,N]) on a grid and computing the matrix norm. "
    "Interpret the divergence as N → ∞."),
  ("SECTION 3 — HELLINGER–TOEPLITZ", "State the Hellinger–Toeplitz theorem precisely. "
    "Explain what it implies about the domain of any Hermitian operator with an unbounded norm. "
    "Give two physical examples (p̂ = −iℏ∂_x, Ĥ of harmonic oscillator)."),
  ("SECTION 4 — REFLECTION", "Why do physicists routinely use unbounded operators despite "
    "the domain difficulties? What mathematical framework (rigged Hilbert space, closable "
    "operators) makes this rigorous?"),
  ("DELIVERABLE", "5–8 page report: analytical work + code appendix + numerical plots + "
    "one-page conclusion. Plots must show clearly labeled axes and convergence behaviour."),
],
"rubric": [
  p("Technical correctness of analytical results (30%)"),
  p("Conceptual synthesis — connecting boundedness to physics (35%)"),
  p("Depth, structure, and exposition of report (25%)"),
  p("Originality / critical insight in reflection section (10%)"),
],
}
