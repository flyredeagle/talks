"""
generate_L01_v3_part3.py
Imports data from parts 1 & 2 and builds all 15 PDFs.
Run: python3 generate_L01_v3_part3.py
"""

import sys, os
sys.path.insert(0, '/home/claude')
from generate_L01_v3_part1 import (
    SCQU, CCQU, SPSU, CPSU, SPJU, CPJU,
    sp, hr, p, bp, np_, colored_box,
    ug_concept_box, ug_prob_box, grad_concept_box, grad_prob_box,
    research_box, rubric_box, gold_box, tier_row,
    make_on_page, make_doc, track_header_tbl, doc_header,
    sTitle, sSub, sH1, sH2, sH3, sBody, sSans, sMono,
    sBullet, sSmall, sFooter, sRub, sCode, sCodeG, sCodeR,
    sQnum, sAns, sBibHead, sBibBody, S,
    PAGE_W, MARGIN,
    DARKBLUE, MIDBLUE, LIGHTBLUE, ACCENTGOLD, LIGHTGOLD,
    DARKGRAY, LIGHTGRAY, UGBLUE, LIGHTUGBLUE, UGGREEN, LIGHTUGGREEN,
    GRADRED, LIGHTGRADRED, GRADORANGE, LIGHTORANGE,
    RESPATH, LIGHTRES, ARTPURPLE, LIGHTPURPLE,
    T1C, T2C, T3C, T4C, T5C,
)
from generate_L01_v3_part2 import (
    SCQG, CCQG, SPSG, CPSG, SPJG, CPJG, WRQ, ORQ, BIB,
)
from reportlab.lib import colors
from reportlab.lib.units import cm
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, KeepTogether, PageBreak
)

OUT = "/home/claude/pdf_output_v3"
os.makedirs(OUT, exist_ok=True)

# ─────────────────────────────────────────────────────────────────────────
# QTYPE helpers
# ─────────────────────────────────────────────────────────────────────────
QTYPE_LABELS = {
    "MC":"Multiple Choice", "TF":"True / False + Justify",
    "SA":"Short Answer",    "EW":"Explain Why",
    "WW":"What Would Change","FL":"Find the Flaw",
    "ST":"State Precisely", "IE":"Identify the Error",
    "DE":"Distinguish",     "WF":"What Fails",
    "CN":"Connect",
}

def question_block(story, n, qtype, question, options, answer, dark_ans=True):
    ql = QTYPE_LABELS.get(qtype, qtype)
    story.append(KeepTogether([
        Paragraph(f"<b>Q{n}.</b> [{ql}]", sQnum),
        Paragraph(question, sBody),
    ]))
    for opt in options:
        story.append(Paragraph(f"\u2003{opt}", sSans))
    story.append(sp(2))
    if dark_ans:
        answer_box(story, answer)
    else:
        story.append(Paragraph(f"\u2794 <i>{answer}</i>", sAns))
    story.append(sp(6))

def answer_box(story, text):
    tw = PAGE_W - 2*MARGIN - 4
    tbl = Table([[Paragraph(f"<b>Key:</b> {text}",
                 S("ak","Ser",8.5,12,DARKGRAY,italic=True))]],
                colWidths=[tw])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),colors.Color(0.95,0.97,1.0)),
        ("BOX",(0,0),(-1,-1),0.75,MIDBLUE),
        ("LEFTPADDING",(0,0),(-1,-1),8),
        ("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),5),
        ("BOTTOMPADDING",(0,0),(-1,-1),5),
    ]))
    story.append(tbl)
    story.append(sp(4))

def part_header(story, label, color=DARKBLUE):
    story.append(sp(6))
    story.append(Paragraph(label, S("ph","DS",11,14,color,bold=True,spaceBefore=6,spaceAfter=4)))
    story.append(HRFlowable(width="100%",thickness=1,color=color,spaceAfter=4,spaceBefore=2))

def project_spec_box(story, spec_items):
    tw = PAGE_W - 2*MARGIN - 4
    rows = []
    for label, detail in spec_items:
        rows.append([
            Paragraph(f"<b>{label}</b>", S("spl","DS",9,12,DARKBLUE,bold=True)),
            Paragraph(detail, sBody),
        ])
    tbl = Table(rows, colWidths=[2.5*cm, tw-2.5*cm])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,-1),LIGHTGOLD),
        ("BOX",(0,0),(-1,-1),1.5,ACCENTGOLD),
        ("LINEBELOW",(0,0),(-1,-2),0.5,colors.Color(0.8,0.7,0.4)),
        ("LEFTPADDING",(0,0),(-1,-1),7),
        ("RIGHTPADDING",(0,0),(-1,-1),7),
        ("TOPPADDING",(0,0),(-1,-1),5),
        ("BOTTOMPADDING",(0,0),(-1,-1),5),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(tbl)
    story.append(sp(6))

def questions_tbl(story, items, q_col_title="Conserved quantity"):
    """Generic table for Noether-style data."""
    tw = PAGE_W - 2*MARGIN - 4
    rows = [["#","Symmetry","Generator Ĝ",q_col_title]]
    for row in items:
        rows.append(row)
    tbl = Table(rows, colWidths=[0.6*cm,(tw-0.6*cm)/3,(tw-0.6*cm)/3,(tw-0.6*cm)/3])
    tbl.setStyle(TableStyle([
        ("BACKGROUND",(0,0),(-1,0),DARKBLUE),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("FONTNAME",(0,0),(-1,0),"DSB"),
        ("FONTSIZE",(0,0),(-1,-1),8.5),
        ("ROWBACKGROUNDS",(0,1),(-1,-1),[LIGHTGRAY,colors.white]),
        ("GRID",(0,0),(-1,-1),0.5,colors.Color(0.7,0.7,0.7)),
        ("LEFTPADDING",(0,0),(-1,-1),5),
        ("RIGHTPADDING",(0,0),(-1,-1),5),
        ("TOPPADDING",(0,0),(-1,-1),4),
        ("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]))
    story.append(tbl)
    story.append(sp(6))

# ─────────────────────────────────────────────────────────────────────────
# PDF BUILDERS
# ─────────────────────────────────────────────────────────────────────────

def build_scqu():
    path = f"{OUT}/L01_SCQU.pdf"
    doc  = make_doc(path, "L01", "SCQU — Short-Answer Concept Questions (UG)")
    op   = make_on_page("L01", "SCQU — UG Track", UGBLUE)
    story = []
    doc_header(story, "SCQU",
               "Short-Answer Concept Questions — Undergraduate Track",
               "10 questions: MC, TF, Short Answer | 20 min in-class or pre-lecture warm-up",
               "UG Track — Tiers 1, 2, 3", UGBLUE, "10 questions × 2 pts = 20 pts total")
    track_header_tbl(story, "UG TRACK — Tiers 1–3: HS / BegUG / AdvUG", UGBLUE)
    tier_row(story, SCQU["tier_routing"])
    story.append(Paragraph("Questions", sH1))
    for i,(qtype,question,options,answer) in enumerate(SCQU["questions"],1):
        question_block(story, i, qtype, question, options, answer)
    story.append(hr(ARTPURPLE))
    rubric_box(story, SCQU["rubric"])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_SCQU.pdf")

def build_ccqu():
    path = f"{OUT}/L01_CCQU.pdf"
    doc  = make_doc(path, "L01", "CCQU — Critical Concept Questions (UG)")
    op   = make_on_page("L01", "CCQU — UG Track", UGGREEN)
    story = []
    doc_header(story, "CCQU",
               "Critical Concept Questions — Undergraduate Track",
               "10 questions: Explain Why, What Would Change, Find the Flaw | 25–35 min",
               "UG Track — Tiers 2, 3: BegUG / AdvUG", UGGREEN,
               "10 questions × 2 pts = 20 pts total")
    track_header_tbl(story, "UG TRACK — Tiers 2–3: BegUG / AdvUG", UGGREEN)
    tier_row(story, CCQU["tier_routing"])
    story.append(Paragraph("Questions", sH1))
    for i,(qtype,question,answer) in enumerate(CCQU["questions"],1):
        question_block(story, i, qtype, question, [], answer)
    story.append(hr(ARTPURPLE))
    rubric_box(story, CCQU["rubric"])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_CCQU.pdf")

def build_spsu():
    path = f"{OUT}/L01_SPSU.pdf"
    doc  = make_doc(path, "L01", "SPSU — Simple Problem Set (UG)")
    op   = make_on_page("L01", "SPSU — UG Track", UGBLUE)
    story = []
    doc_header(story, "SPSU",
               "Simple Problem Set — Undergraduate Track",
               "10 problems across 3 parts | Approx. 3–5 hours | Tiers 1–3",
               "UG Track — Tiers 1, 2, 3", UGBLUE, "10 problems")
    track_header_tbl(story, "UG TRACK — Tiers 1–3: HS / BegUG / AdvUG", UGBLUE)
    gold_box(story, [
        p("<b>Instructions:</b> Show all working. State which tier-specific sub-part you are "
          "attempting where indicated. Dirac notation required for BegUG and above. "
          "Justify every equation where a derivation is requested."),
    ])
    for label, items in [("Part A — Mechanics and Verification", SPSU["partA"]),
                          ("Part B — Interpretation and Reasoning", SPSU["partB"]),
                          ("Part C — Translation and Synthesis",    SPSU["partC"])]:
        part_header(story, label, UGBLUE)
        for num, text in items:
            story.append(KeepTogether([
                Paragraph(f"<b>{num}.</b>\u2003{text}", sBody),
                sp(4),
            ]))
    story.append(hr(ARTPURPLE))
    rubric_box(story, SPSU["rubric"])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_SPSU.pdf")

def build_cpsu():
    path = f"{OUT}/L01_CPSU.pdf"
    doc  = make_doc(path, "L01", "CPSU — Complex Problem Set (UG)")
    op   = make_on_page("L01", "CPSU — UG Track", UGGREEN)
    story = []
    doc_header(story, "CPSU",
               "Complex Problem Set — Undergraduate Track",
               "5 multi-part proof problems | Approx. 5–9 hours | Tiers 2–3",
               "UG Track — Tiers 2–3: BegUG / AdvUG", UGGREEN, "5 problems")
    track_header_tbl(story, "UG TRACK — Tiers 2–3: BegUG / AdvUG", UGGREEN)
    gold_box(story, [
        p("<b>Instructions:</b> Full proofs required. State all assumptions explicitly before "
          "using them. Use correct Dirac notation and functional analysis language where appropriate. "
          "Parts labelled [AdvUG] are optional extension for Tier 3."),
    ])
    for prob in CPSU["problems"]:
        story.append(KeepTogether([
            Paragraph(f"Problem {prob['num']}: {prob['title']}", sH2),
        ]))
        for part_label, part_text in prob["parts"]:
            story.append(KeepTogether([
                Paragraph(f"<b>({part_label})</b>\u2003{part_text}", sBody),
                sp(3),
            ]))
        story.append(sp(4))
        ug_prob_box(story, "Rubric for this problem",
                    [p(prob["rubric"])])
        story.append(sp(6))
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_CPSU.pdf")

def build_spju():
    path = f"{OUT}/L01_SPJU.pdf"
    doc  = make_doc(path, "L01", "SPJU — Simple Project (UG)")
    op   = make_on_page("L01", "SPJU — UG Track", UGBLUE)
    story = []
    doc_header(story, "SPJU",
               "Simple Project — Undergraduate Track",
               f"Coding/worksheet project | {SPJU['time']} | Tiers 1–3",
               "UG Track — Tiers 1–3: all undergraduate tiers", UGBLUE,
               "1 project")
    track_header_tbl(story, "UG TRACK — Tiers 1–3", UGBLUE)
    story.append(Paragraph(f"Project: {SPJU['title']}", sH1))
    story.append(Paragraph(f"<b>Objective:</b> {SPJU['objective']}", sBody))
    story.append(sp(6))
    story.append(Paragraph("Specification", sH2))
    project_spec_box(story, SPJU["spec"])
    story.append(Paragraph("Four-Layer Packaging System", sH2))
    ug_concept_box(story, "Layer structure (built into every project)", [
        p("Layer 1 — Problem statement: this document (spec only, no hints)"),
        p("Layer 2 — Hint file: algorithmic hints (numpy methods, formula reminders)"),
        p("Layer 3 — Advanced hint: structural solution sketch (pseudocode)"),
        p("Layer 4 — Model solution: fully commented reference implementation"),
    ])
    story.append(hr(ARTPURPLE))
    rubric_box(story, SPJU["rubric"])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_SPJU.pdf")

def build_cpju():
    path = f"{OUT}/L01_CPJU.pdf"
    doc  = make_doc(path, "L01", "CPJU — Complex Project (UG)")
    op   = make_on_page("L01", "CPJU — UG Track", UGGREEN)
    story = []
    doc_header(story, "CPJU",
               "Complex Project — Undergraduate Track",
               f"Extended research-style project | {CPJU['time']} | Tiers 2–3",
               "UG Track — Tiers 2–3: BegUG / AdvUG", UGGREEN, "1 project")
    track_header_tbl(story, "UG TRACK — Tiers 2–3", UGGREEN)
    story.append(Paragraph(f"Project: {CPJU['title']}", sH1))
    story.append(Paragraph(f"<b>Objective:</b> {CPJU['objective']}", sBody))
    story.append(sp(6))
    for label, detail in CPJU["spec"]:
        part_header(story, f"Section: {label}", UGGREEN)
        story.append(p(detail))
    story.append(hr(ARTPURPLE))
    rubric_box(story, CPJU["rubric"])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_CPJU.pdf")

def build_scqg():
    path = f"{OUT}/L01_SCQG.pdf"
    doc  = make_doc(path, "L01", "SCQG — Short-Answer Concept Questions (Grad)")
    op   = make_on_page("L01", "SCQG — Grad Track", GRADRED)
    story = []
    doc_header(story, "SCQG",
               "Short-Answer Concept Questions — Graduate Track",
               "10 questions: State Precisely, TF with proof sketch, Identify Error | 20–25 min",
               "Grad Track — Tiers 4–5: MSc / PhD", GRADRED,
               "10 questions × 2 pts = 20 pts total")
    track_header_tbl(story, "GRADUATE TRACK — Tiers 4–5: MSc / PhD", GRADRED)
    tier_row(story, SCQG["tier_routing"])
    story.append(Paragraph("Questions", sH1))
    for i,(qtype,question,answer) in enumerate(SCQG["questions"],1):
        question_block(story, i, qtype, question, [], answer)
    story.append(hr(ARTPURPLE))
    rubric_box(story, [p(r) for r in SCQG["rubric"]])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_SCQG.pdf")

def build_ccqg():
    path = f"{OUT}/L01_CCQG.pdf"
    doc  = make_doc(path, "L01", "CCQG — Critical Concept Questions (Grad)")
    op   = make_on_page("L01", "CCQG — Grad Track", GRADORANGE)
    story = []
    doc_header(story, "CCQG",
               "Critical Concept Questions — Graduate Track",
               "10 questions: Distinguish, What Fails, Connect | 35–50 min",
               "Grad Track — Tiers 4–5: MSc / PhD", GRADORANGE,
               "10 questions × 2 pts = 20 pts total")
    track_header_tbl(story, "GRADUATE TRACK — Tiers 4–5: MSc / PhD", GRADORANGE)
    tier_row(story, CCQG["tier_routing"])
    story.append(Paragraph("Questions", sH1))
    for i,(qtype,question,answer) in enumerate(CCQG["questions"],1):
        question_block(story, i, qtype, question, [], answer)
    story.append(hr(ARTPURPLE))
    rubric_box(story, [p(r) for r in CCQG["rubric"]])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_CCQG.pdf")

def build_spsg():
    path = f"{OUT}/L01_SPSG.pdf"
    doc  = make_doc(path, "L01", "SPSG — Simple Problem Set (Grad)")
    op   = make_on_page("L01", "SPSG — Grad Track", GRADRED)
    story = []
    doc_header(story, "SPSG",
               "Simple Problem Set — Graduate Track",
               "10 problems | Approx. 4–7 hours | Tiers 4–5",
               "Grad Track — Tiers 4–5: MSc / PhD", GRADRED, "10 problems")
    track_header_tbl(story, "GRADUATE TRACK — Tiers 4–5: MSc / PhD", GRADRED)
    gold_box(story, [
        p("<b>Instructions:</b> Full proofs with domain and boundary conditions stated. "
          "Functional analysis arguments required (not just matrix computation). "
          "Parts labelled [PhD] are required for Tier 5 only."),
    ])
    for label, items in [("Part A — Operators and Spectral Theory",     SPSG["partA"]),
                          ("Part B — Functional Analysis and Distributions", SPSG["partB"]),
                          ("Part C — Advanced Structures",              SPSG["partC"])]:
        part_header(story, label, GRADRED)
        for num, text in items:
            story.append(KeepTogether([
                Paragraph(f"<b>{num}.</b>\u2003{text}", sBody),
                sp(4),
            ]))
    story.append(hr(ARTPURPLE))
    rubric_box(story, [p(r) for r in SPSG["rubric"]])
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_SPSG.pdf")

def build_cpsg():
    path = f"{OUT}/L01_CPSG.pdf"
    doc  = make_doc(path, "L01", "CPSG — Complex Problem Set (Grad)")
    op   = make_on_page("L01", "CPSG — Grad Track", GRADORANGE)
    story = []
    doc_header(story, "CPSG",
               "Complex Problem Set — Graduate Track",
               "5 multi-part proof problems | Approx. 8–14 hours | Tiers 4–5",
               "Grad Track — Tiers 4–5: MSc / PhD", GRADORANGE, "5 problems")
    track_header_tbl(story, "GRADUATE TRACK — Tiers 4–5: MSc / PhD", GRADORANGE)
    gold_box(story, [
        p("<b>Instructions:</b> Functional analysis proofs required. "
          "Hypotheses must be stated before use; domain conditions made explicit. "
          "Parts labelled [PhD] are compulsory for Tier 5, strongly encouraged for Tier 4."),
    ])
    for prob in CPSG["problems"]:
        story.append(KeepTogether([
            Paragraph(f"Problem {prob['num']}: {prob['title']}", sH2),
        ]))
        for part_label, part_text in prob["parts"]:
            story.append(KeepTogether([
                Paragraph(f"<b>({part_label})</b>\u2003{part_text}", sBody),
                sp(3),
            ]))
        story.append(sp(4))
        grad_prob_box(story, "Rubric for this problem", [p(prob["rubric"])])
        story.append(sp(6))
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_CPSG.pdf")

def build_spjg():
    path = f"{OUT}/L01_SPJG.pdf"
    doc  = make_doc(path, "L01", "SPJG — Simple Graduate Projects (×5)")
    op   = make_on_page("L01", "SPJG — Grad Track", GRADRED)
    story = []
    doc_header(story, "SPJG",
               "Simple Projects — Graduate Track (5 projects)",
               "Each project: 3–7 hours | Mathematical/computational | Tiers 4–5",
               "Grad Track — Tiers 4–5: MSc / PhD", GRADRED,
               "5 projects")
    track_header_tbl(story, "GRADUATE TRACK — Tiers 4–5: MSc / PhD", GRADRED)
    for proj in SPJG:
        story.append(Paragraph(f"Project SPJG-{proj['num']}: {proj['title']}", sH1))
        story.append(Paragraph(
            f"<b>Time:</b> {proj['time']} | "
            f"<b>Objective:</b> {proj['objective']}", sBody))
        story.append(sp(4))
        part_header(story, "Specification", GRADRED)
        for s in proj["spec"]:
            story.append(bp(s))
        story.append(sp(4))
        rubric_box(story, [p(proj["rubric"])])
        story.append(sp(8))
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_SPJG.pdf")

def build_cpjg():
    path = f"{OUT}/L01_CPJG.pdf"
    doc  = make_doc(path, "L01", "CPJG — Complex Graduate Projects (×5)")
    op   = make_on_page("L01", "CPJG — Grad Track", GRADORANGE)
    story = []
    doc_header(story, "CPJG",
               "Complex Projects — Graduate Track (5 projects)",
               "Each project: 12–20 hours | Research-style | Tiers 4–5",
               "Grad Track — Tiers 4–5: MSc / PhD", GRADORANGE, "5 projects")
    track_header_tbl(story, "GRADUATE TRACK — Tiers 4–5: MSc / PhD", GRADORANGE)
    for proj in CPJG:
        story.append(Paragraph(f"Project CPJG-{proj['num']}: {proj['title']}", sH1))
        story.append(Paragraph(
            f"<b>Time:</b> {proj['time']} | "
            f"<b>Objective:</b> {proj['objective']}", sBody))
        story.append(sp(4))
        part_header(story, "Guiding Research Questions", GRADORANGE)
        for q in proj["questions"]:
            story.append(bp(q))
        story.append(sp(4))
        grad_concept_box(story, "Deliverable and Format", [
            p(proj["deliverable"]),
        ])
        rubric_box(story, [p(proj["rubric"])])
        story.append(sp(8))
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_CPJG.pdf")

def build_wrq():
    path = f"{OUT}/L01_WRQ.pdf"
    doc  = make_doc(path, "L01", "WRQ — Well-Defined Research Questions (×5)")
    op   = make_on_page("L01", "WRQ — Research Track", RESPATH)
    story = []
    doc_header(story, "WRQ",
               "Well-Defined Research Questions — Research Track (5 questions)",
               "Each: 5–10 hours | Scoped memo | Tiers 4–5",
               "Research Track — Tiers 4–5: MSc / PhD", RESPATH, "5 WRQs")
    track_header_tbl(story, "RESEARCH TRACK — Tiers 4–5: MSc / PhD", RESPATH)
    gold_box(story, [
        p("<b>Format for each WRQ:</b> A 2–6 page memo structured as: "
          "(1) restate the question precisely, (2) describe your method, "
          "(3) develop the evidence (mathematical + citations), "
          "(4) state a conclusion, (5) provide 5–10 references."),
        p("<b>Assessment:</b> Scope and method clarity (25%) | "
          "Evidence quality (25%) | Technical content (25%) | Argument quality (25%)"),
    ])
    for wrq in WRQ:
        story.append(Paragraph(f"Research Question {wrq['num']}", sH1))
        research_box(story, "Question", [
            Paragraph(f"<b>{wrq['question']}</b>",
                      S("wq","Ser",10.5,14,colors.black,bold=True))
        ])
        story.append(Paragraph(f"<b>Estimated scope:</b> {wrq['scope']}", sSans))
        story.append(sp(3))
        part_header(story, "Suggested Method", RESPATH)
        for step in wrq["method"]:
            story.append(bp(step))
        story.append(sp(3))
        research_box(story, "Deliverable", [p(wrq["deliverable"])])
        story.append(sp(8))
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_WRQ.pdf")

def build_orq():
    path = f"{OUT}/L01_ORQ.pdf"
    doc  = make_doc(path, "L01", "ORQ — Open-Ended Research Questions (×5)")
    op   = make_on_page("L01", "ORQ — Research Track", ARTPURPLE)
    story = []
    doc_header(story, "ORQ",
               "Open-Ended Research Questions — Research Track (5 questions)",
               "Each: 12–20 hours | Proposal note | Tiers 4–5",
               "Research Track — Tiers 4–5: MSc / PhD", ARTPURPLE, "5 ORQs")
    track_header_tbl(story, "RESEARCH TRACK — Tiers 4–5: MSc / PhD", ARTPURPLE)
    gold_box(story, [
        p("<b>Format for each ORQ:</b> A 4–10 page proposal-style note structured as: "
          "(1) motivation and context, (2) what is known, (3) your proposal or conjecture, "
          "(4) how you would argue or test it, (5) limitations and open directions."),
        p("<b>Assessment:</b> Clarity of framing (25%) | Depth of engagement (25%) | "
          "Novelty and plausibility (25%) | Awareness of limitations (25%)"),
        p("<b>Note:</b> There is no single correct answer. Rigour of reasoning and depth "
          "of engagement with the literature are the primary criteria."),
    ])
    for orq in ORQ:
        story.append(Paragraph(f"Open Research Question {orq['num']}", sH1))
        colored_box(story, "Question", [
            Paragraph(f"<b>{orq['question']}</b>",
                      S("oq","Ser",10.5,14,colors.black,bold=True))
        ], LIGHTPURPLE, ARTPURPLE, ARTPURPLE)
        story.append(Paragraph(f"<b>Estimated scope:</b> {orq['scope']}", sSans))
        story.append(sp(3))
        part_header(story, "Framing Notes and Key Literature", ARTPURPLE)
        for frame in orq["framing"]:
            story.append(bp(frame))
        story.append(sp(3))
        research_box(story, "Deliverable", [p(orq["deliverable"])])
        story.append(sp(8))
    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_ORQ.pdf")

def build_bib():
    path = f"{OUT}/L01_BIB.pdf"
    doc  = make_doc(path, "L01", "BIB — Tiered Bibliography Additions")
    op   = make_on_page("L01", "BIB — Bibliography", DARKBLUE)
    story = []

    # Header
    story.append(Paragraph("L01 — Tiered Bibliography Additions", sTitle))
    story.append(Paragraph("The Hilbert Space of Quantum States", sSub))
    story.append(Paragraph(
        "<i>Module I.1 | Section 9 of the QM/QC Programme Bibliography</i>", sSmall))
    story.append(sp(3))
    story.append(hr(DARKBLUE, 2))
    story.append(sp(6))

    gold_box(story, [
        p("<b>Purpose:</b> This section lists bibliography additions and annotation updates "
          "specific to Module I.1 Lecture L01. Entries are organised by tier (T1–T5) and "
          "cross-referenced to the master catalogue (Categories A–E). New entries are "
          "marked with their assigned catalogue codes."),
        p("<b>Type codes:</b> T = Textbook | M = Monograph | P = Paper | N = Non-specialist | "
          "★ = useful | ★★ = recommended | ★★★ = essential"),
        p("<b>Annotation format:</b> Each entry includes: content description → "
          "L01 relevance → artifact mapping → any existing catalogue cross-reference."),
    ])

    tier_names = {
        "BIB-T1": ("T1 — High School", T1C),
        "BIB-T2": ("T2 — Beginning Undergraduate", T2C),
        "BIB-T3": ("T3 — Advanced Undergraduate", T3C),
        "BIB-T4": ("T4 — Master's Level",   T4C),
        "BIB-T5": ("T5 — PhD Level", T5C),
    }

    tw = PAGE_W - 2*MARGIN - 4

    for tier_key, (tier_label, tier_col) in tier_names.items():
        entries = BIB.get(tier_key, [])
        if not entries:
            continue

        story.append(Paragraph(f"Tier {tier_label}", sH1))
        story.append(hr(tier_col, 1))
        story.append(sp(4))

        for entry in entries:
            is_new = bool(entry.get("new_code"))
            is_existing = bool(entry.get("existing"))
            badge_color = colors.Color(0.0,0.5,0.2) if is_new else DARKGRAY

            # Reference block
            ref_text = (
                f"<b>{entry['author']}</b> — "
                f"<i>{entry['title']}</i>. "
                f"{entry['pub']}"
            )
            badges = " ".join(f"[{b}]" for b in entry.get("badges", []))
            type_str = entry.get("type","")
            stars = entry.get("stars","")

            # Header row for this entry
            header_items = [ref_text, f"{badges} {type_str} {stars}"]
            new_flag = ""
            if is_new:
                new_flag = f"  ← NEW ENTRY [{entry['new_code']}]"
            elif is_existing:
                new_flag = f"  (existing: [{entry['existing']}] — annotation updated)"

            tbl_data = [[
                Paragraph(ref_text, S("re","Ser",9,13,colors.black,bold=False)),
                Paragraph(f"{badges} <b>{type_str}</b> {stars}{new_flag}",
                          S("rb","DS",8.5,12,badge_color,bold=False)),
            ]]
            ref_tbl = Table(tbl_data, colWidths=[tw*0.68, tw*0.32])
            ref_tbl.setStyle(TableStyle([
                ("BACKGROUND",(0,0),(-1,-1),
                 colors.Color(0.95,0.97,1.0) if is_new else LIGHTGRAY),
                ("BOX",(0,0),(-1,-1),
                 1.5, colors.Color(0.0,0.5,0.2) if is_new else tier_col),
                ("LEFTPADDING",(0,0),(-1,-1),6),
                ("RIGHTPADDING",(0,0),(-1,-1),6),
                ("TOPPADDING",(0,0),(-1,-1),5),
                ("BOTTOMPADDING",(0,0),(-1,-1),5),
                ("VALIGN",(0,0),(-1,-1),"TOP"),
            ]))

            # Annotation box
            ann_tbl = Table([[
                Paragraph(entry["annotation"],
                          S("an","Ser",9,13,colors.black))
            ]], colWidths=[tw])
            ann_tbl.setStyle(TableStyle([
                ("BACKGROUND",(0,0),(-1,-1),colors.white),
                ("BOX",(0,0),(-1,-1),0.75,tier_col),
                ("LEFTPADDING",(0,0),(-1,-1),8),
                ("RIGHTPADDING",(0,0),(-1,-1),8),
                ("TOPPADDING",(0,0),(-1,-1),5),
                ("BOTTOMPADDING",(0,0),(-1,-1),5),
            ]))

            # Catalogue categories
            cats = entry.get("categories",[])
            if cats:
                cat_text = f"<b>Adds to catalogue categories:</b> " + ", ".join(f"[{c}]" for c in cats)
                cat_para = Paragraph(cat_text, S("cat","DS",8,11,DARKGRAY,italic=True))
            else:
                cat_para = None

            block = [ref_tbl, sp(2), ann_tbl]
            if cat_para:
                block += [sp(2), cat_para]
            block += [sp(8)]
            story.append(KeepTogether(block))

    # Summary of new entries
    story.append(hr(DARKBLUE, 1))
    story.append(Paragraph("Summary of New Catalogue Entries", sH2))
    new_entries = []
    for tier_key in ["BIB-T1","BIB-T2","BIB-T3","BIB-T4","BIB-T5"]:
        for e in BIB.get(tier_key,[]):
            if e.get("new_code"):
                new_entries.append((e["new_code"],
                                    e["author"].split(",")[0],
                                    e["title"][:55]+"...",
                                    ", ".join(e.get("categories",[])),
                                    e.get("type",""), e.get("stars","")))
    if new_entries:
        rows = [["Code","Author","Title (truncated)","Cat.","Type","★"]]
        for row in new_entries:
            rows.append(list(row))
        tbl = Table(rows, colWidths=[1.1*cm, 2.2*cm, tw-6.6*cm, 0.9*cm, 0.9*cm, 1.5*cm])
        tbl.setStyle(TableStyle([
            ("BACKGROUND",(0,0),(-1,0),DARKBLUE),
            ("TEXTCOLOR",(0,0),(-1,0),colors.white),
            ("FONTNAME",(0,0),(-1,0),"DSB"),
            ("FONTSIZE",(0,0),(-1,-1),8.5),
            ("ROWBACKGROUNDS",(0,1),(-1,-1),[colors.Color(0.93,0.98,0.95),colors.white]),
            ("GRID",(0,0),(-1,-1),0.5,colors.Color(0.7,0.7,0.7)),
            ("LEFTPADDING",(0,0),(-1,-1),5),
            ("RIGHTPADDING",(0,0),(-1,-1),5),
            ("TOPPADDING",(0,0),(-1,-1),4),
            ("BOTTOMPADDING",(0,0),(-1,-1),4),
            ("VALIGN",(0,0),(-1,-1),"TOP"),
        ]))
        story.append(tbl)

    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_BIB.pdf")

def build_overview():
    """Master overview sheet listing all 14 artifacts + bibliography."""
    path = f"{OUT}/L01_v3_OVERVIEW.pdf"
    doc  = make_doc(path, "L01", "v3 Artifact Bundle — Overview")
    op   = make_on_page("L01", "v3 Overview", DARKBLUE)
    story = []

    story.append(Paragraph("L01 — v3 Artifact Bundle Overview", sTitle))
    story.append(Paragraph("The Hilbert Space of Quantum States", sSub))
    story.append(Paragraph(
        "<i>Module I.1 | Series I — Introductory QM | "
        "Pedagogical Support v3 | 14 artifact types + Bibliography</i>", sSmall))
    story.append(sp(3))
    story.append(hr(DARKBLUE, 2))
    story.append(sp(8))

    gold_box(story, [
        p("This bundle aligns L01 with the v3 pedagogical framework. "
          "14 artifact types (92 items total) span three tracks: UG (Tiers 1–3), "
          "Grad (Tiers 4–5), and Research (Tiers 4–5). A tiered bibliography section "
          "provides annotated references with catalogue cross-references."),
    ])

    tw = PAGE_W - 2*MARGIN - 4
    artifacts = [
        # Code, Name, Track, Tiers, Count, Time, Description
        ("SCQU","Short Concept Qs (UG)","UG","1–3","10","20 min",
         "MC, TF, SA — foundational checks on LO1–LO4"),
        ("CCQU","Critical Concept Qs (UG)","UG","2–3","10","25–35 min",
         "Explain why, what changes, find the flaw"),
        ("SPSU","Simple Problem Set (UG)","UG","1–3","10","3–5 h",
         "3-part set: mechanics, interpretation, translation"),
        ("CPSU","Complex Problem Set (UG)","UG","2–3","5","5–9 h",
         "5 multi-part proof problems: Cauchy–Schwarz through L²(ℝ)"),
        ("SPJU","Simple Project (UG)","UG","1–3","1","3–5 h",
         "Adjoint calculator and Hilbert space verifier (Python)"),
        ("CPJU","Complex Project (UG)","UG","2–3","1","10–15 h",
         "Bounded vs. unbounded operator comparative investigation"),
        ("SCQG","Short Concept Qs (Grad)","Grad","4–5","10","20–25 min",
         "State precisely, TF with proof sketch, identify error"),
        ("CCQG","Critical Concept Qs (Grad)","Grad","4–5","10","35–50 min",
         "Distinguish, what fails, connect — functional analysis depth"),
        ("SPSG","Simple Problem Set (Grad)","Grad","4–5","10","4–7 h",
         "3-part: operators, functional analysis, advanced structures"),
        ("CPSG","Complex Problem Set (Grad)","Grad","4–5","5","8–14 h",
         "5 proofs: Riesz, self-adjoint extensions, spectral theorem, Gel'fand, FS metric"),
        ("SPJG","Simple Projects (Grad, ×5)","Grad","4–5","5","3–7 h each",
         "Domain explorer, density matrices, spectral measure, Wigner fn., Bloch sphere"),
        ("CPJG","Complex Projects (Grad, ×5)","Grad","4–5","5","12–20 h each",
         "Real vs. complex QM, s.a. extensions, Gel'fand triple, Segre embedding, measurement"),
        ("WRQ","Well-Defined Research Qs (×5)","Research","4–5","5","5–10 h each",
         "Why complex?, H-T theorem, density operator history, Born rule axioms, separability"),
        ("ORQ","Open Research Qs (×5)","Research","4–5","5","12–20 h each",
         "Quaternionic QM, collapse-free measurement, Gel'fand alternatives, generalised Wigner, separability test"),
        ("BIB","Tiered Bibliography","All","1–5","—","—",
         "Annotated refs with catalogue codes; 4 new entries [D8,D9,E15,E16,E17]"),
    ]

    # Track colour map
    track_colors = {"UG": UGBLUE, "Grad": GRADRED, "Research": RESPATH, "All": DARKBLUE}
    rows = [["Code","Name","Track","Tiers","N","Time","Description"]]
    for code,name,track,tiers,count,time,desc in artifacts:
        rows.append([code,name,track,tiers,count,time,desc])

    col_ws = [1.1*cm, 2.8*cm, 1.5*cm, 0.8*cm, 0.6*cm, 1.3*cm,
              tw - 1.1*cm - 2.8*cm - 1.5*cm - 0.8*cm - 0.6*cm - 1.3*cm]
    tbl = Table(rows, colWidths=col_ws)
    style = [
        ("BACKGROUND",(0,0),(-1,0),DARKBLUE),
        ("TEXTCOLOR",(0,0),(-1,0),colors.white),
        ("FONTNAME",(0,0),(-1,0),"DSB"),
        ("FONTSIZE",(0,0),(-1,-1),8.5),
        ("GRID",(0,0),(-1,-1),0.5,colors.Color(0.7,0.7,0.7)),
        ("LEFTPADDING",(0,0),(-1,-1),4),
        ("RIGHTPADDING",(0,0),(-1,-1),4),
        ("TOPPADDING",(0,0),(-1,-1),4),
        ("BOTTOMPADDING",(0,0),(-1,-1),4),
        ("VALIGN",(0,0),(-1,-1),"TOP"),
    ]
    # Color-code track column (col 2) per row
    for i,(code,name,track,*_) in enumerate(artifacts, 1):
        tc = track_colors.get(track, DARKBLUE)
        style.append(("TEXTCOLOR",(2,i),(2,i), tc))
        style.append(("FONTNAME",(2,i),(2,i),"DSB"))
        # Alternate row backgrounds
        bg = colors.Color(0.97,0.97,0.97) if i%2==0 else colors.white
        style.append(("BACKGROUND",(0,i),(-1,i), bg))
    tbl.setStyle(TableStyle(style))
    story.append(tbl)
    story.append(sp(10))

    # Count summary
    story.append(Paragraph("Item Count Summary", sH2))
    ug_total   = sum(int(r[4]) for r in artifacts[:6] if r[4] != "—")
    grad_total = sum(int(r[4]) for r in artifacts[6:12] if r[4] != "—")
    res_total  = sum(int(r[4]) for r in artifacts[12:14] if r[4] != "—")
    grand      = ug_total + grad_total + res_total
    summary = [
        [Paragraph("<b>UG Track (SCQU+CCQU+SPSU+CPSU+SPJU+CPJU)</b>",sSans),
         Paragraph(f"<b>{ug_total} items</b>",sSans)],
        [Paragraph("<b>Grad Track (SCQG+CCQG+SPSG+CPSG+SPJG+CPJG)</b>",sSans),
         Paragraph(f"<b>{grad_total} items</b>",sSans)],
        [Paragraph("<b>Research Track (WRQ×5 + ORQ×5)</b>",sSans),
         Paragraph(f"<b>{res_total} items</b>",sSans)],
        [Paragraph("<b>TOTAL (excluding BIB)</b>",
                   S("tot","DS",10,13,DARKBLUE,bold=True)),
         Paragraph(f"<b>{grand} items</b>",
                   S("tot2","DS",10,13,DARKBLUE,bold=True))],
    ]
    stbl = Table(summary, colWidths=[tw*0.78, tw*0.22])
    stbl.setStyle(TableStyle([
        ("ROWBACKGROUNDS",(0,0),(-1,-2),[LIGHTGRAY, colors.white]),
        ("BACKGROUND",(0,-1),(-1,-1), LIGHTBLUE),
        ("BOX",(0,0),(-1,-1),1.5,DARKBLUE),
        ("LINEABOVE",(0,-1),(-1,-1),1.5,DARKBLUE),
        ("LEFTPADDING",(0,0),(-1,-1),8),
        ("RIGHTPADDING",(0,0),(-1,-1),8),
        ("TOPPADDING",(0,0),(-1,-1),5),
        ("BOTTOMPADDING",(0,0),(-1,-1),5),
    ]))
    story.append(stbl)

    doc.build(story, onFirstPage=op, onLaterPages=op)
    print(f"  ✓ L01_v3_OVERVIEW.pdf")

# ─────────────────────────────────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    print(f"\n[L01 v3] Generating 15 PDFs to {OUT}/\n")

    print("UG Track:")
    build_scqu()
    build_ccqu()
    build_spsu()
    build_cpsu()
    build_spju()
    build_cpju()

    print("\nGrad Track:")
    build_scqg()
    build_ccqg()
    build_spsg()
    build_cpsg()
    build_spjg()
    build_cpjg()

    print("\nResearch Track:")
    build_wrq()
    build_orq()

    print("\nBibliography + Overview:")
    build_bib()
    build_overview()

    all_pdfs = sorted(os.listdir(OUT))
    total_mb = sum(os.path.getsize(f"{OUT}/{f}") for f in all_pdfs) / 1e6
    print(f"\n✔  {len(all_pdfs)} PDFs generated  |  {total_mb:.1f} MB total")
    for f in all_pdfs:
        sz = os.path.getsize(f"{OUT}/{f}") // 1024
        print(f"   {f}  ({sz} KB)")
