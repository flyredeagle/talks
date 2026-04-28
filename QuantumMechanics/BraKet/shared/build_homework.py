#!/usr/bin/env python3
"""
shared/build_homework.py
========================
Generates three separate PDF documents for each lecture:
  1. PROBLEM SHEET      — problems only (no hints, no solutions)
  2. SUGGESTIONS SHEET  — problems + basic hints + advanced hints
  3. SOLUTIONS SHEET    — full worked solutions

Each document is typeset using ReportLab with the course dark-theme design.
Mathematical expressions are rendered to PNG via LatexRenderer and embedded.

Usage
-----
    python3 shared/build_homework.py --lecture L01 --out build/L01/homework/
    python3 shared/build_homework.py --all
"""

import os, sys, re, argparse
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from shared.design import C as D
from shared.latex_renderer import LatexRenderer

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm, mm
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
    Table, TableStyle, KeepTogether, Image, PageBreak,
)

# ── Colour helpers ────────────────────────────────────────────────────────────
BG      = colors.HexColor("#" + D["bg"])
CARD    = colors.HexColor("#" + D["bgCard"])
ACC1    = colors.HexColor("#" + D["accent1"])
ACC2    = colors.HexColor("#" + D["accent2"])
ACC3    = colors.HexColor("#" + D["accent3"])
ACC4    = colors.HexColor("#" + D["accent4"])
WHITE   = colors.white
TEXT    = colors.HexColor("#" + D["text"])
TEXTSUB = colors.HexColor("#" + D["textSub"])
TEXTDIM = colors.HexColor("#" + D["textDim"])

TIER_COLORS = {
    "HS":    colors.HexColor("#" + D["hs"]),
    "BegUG": colors.HexColor("#" + D["begug"]),
    "AdvUG": colors.HexColor("#" + D["advug"]),
    "MSc":   colors.HexColor("#" + D["msc"]),
    "PhD":   colors.HexColor("#" + D["phd"]),
}
TIER_ACCENT_HEX = {
    "HS":    D["accent4"],
    "BegUG": D["accent3"],
    "AdvUG": D["accent1"],
    "MSc":   D["accent2"],
    "PhD":   D["accent6"],
}

W_PT, H_PT = A4
MARGIN = 1.8 * cm

# ── Styles ────────────────────────────────────────────────────────────────────
def make_styles(accent_color=None):
    acc = accent_color or ACC1
    s = {}
    s["doc_title"] = ParagraphStyle("doc_title",
        fontName="Helvetica-Bold", fontSize=22, textColor=WHITE,
        leading=28, spaceAfter=4, alignment=TA_CENTER)
    s["doc_sub"] = ParagraphStyle("doc_sub",
        fontName="Helvetica", fontSize=11, textColor=acc,
        leading=16, spaceAfter=2, alignment=TA_CENTER)
    s["doc_info"] = ParagraphStyle("doc_info",
        fontName="Helvetica", fontSize=9, textColor=TEXTSUB,
        leading=13, spaceAfter=0, alignment=TA_CENTER)
    s["tier_head"] = ParagraphStyle("tier_head",
        fontName="Helvetica-Bold", fontSize=14, textColor=WHITE,
        leading=18, spaceBefore=14, spaceAfter=6)
    s["prob_id"] = ParagraphStyle("prob_id",
        fontName="Helvetica-Bold", fontSize=11, textColor=acc,
        leading=16, spaceBefore=8, spaceAfter=2)
    s["prob_text"] = ParagraphStyle("prob_text",
        fontName="Helvetica", fontSize=10, textColor=TEXT,
        leading=15, spaceAfter=4, alignment=TA_JUSTIFY)
    s["hint_head"] = ParagraphStyle("hint_head",
        fontName="Helvetica-Bold", fontSize=9.5, textColor=ACC3,
        leading=14, spaceBefore=4, spaceAfter=2)
    s["hint_text"] = ParagraphStyle("hint_text",
        fontName="Helvetica-Oblique", fontSize=9.5, textColor=TEXT,
        leading=14, leftIndent=10, spaceAfter=2)
    s["sol_head"] = ParagraphStyle("sol_head",
        fontName="Helvetica-Bold", fontSize=9.5, textColor=ACC2,
        leading=14, spaceBefore=4, spaceAfter=2)
    s["sol_text"] = ParagraphStyle("sol_text",
        fontName="Helvetica", fontSize=9.5, textColor=TEXT,
        leading=14, leftIndent=10, spaceAfter=4, alignment=TA_JUSTIFY)
    s["body"] = ParagraphStyle("body",
        fontName="Helvetica", fontSize=9.5, textColor=TEXT,
        leading=14, spaceAfter=3)
    s["note"] = ParagraphStyle("note",
        fontName="Helvetica-Oblique", fontSize=8.5, textColor=TEXTSUB,
        leading=13, spaceAfter=2)
    return s

# ── Canvas callbacks ──────────────────────────────────────────────────────────
def make_canvas_cb(lec_num, doc_type, accent_hex):
    acc = colors.HexColor("#" + accent_hex)
    def cb(canvas, doc):
        canvas.saveState()
        # background
        canvas.setFillColor(BG)
        canvas.rect(0, 0, W_PT, H_PT, fill=1, stroke=0)
        # top band
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.rect(0, H_PT - 2.2*cm, W_PT, 2.2*cm, fill=1, stroke=0)
        # left accent stripe
        canvas.setFillColor(acc)
        canvas.rect(0, 0, 0.3*cm, H_PT, fill=1, stroke=0)
        # bottom band
        canvas.setFillColor(colors.HexColor("#111827"))
        canvas.rect(0, 0, W_PT, 0.9*cm, fill=1, stroke=0)
        # footer text
        canvas.setFont("Helvetica", 7.5)
        canvas.setFillColor(TEXTDIM)
        canvas.drawString(MARGIN, 0.35*cm,
            f"QM: Bra-Ket Notation — {lec_num} — {doc_type}")
        canvas.drawRightString(W_PT - MARGIN, 0.35*cm, f"Page {doc.page}")
        canvas.restoreState()
    return cb

# ── Formula image helper ──────────────────────────────────────────────────────
def formula_img(expr: str, renderer, name: str,
                max_width: float = 12*cm) -> Image | None:
    """Render a formula and return a ReportLab Image, scaled to max_width."""
    try:
        path = renderer.render(expr, name)
        img = Image(path)
        # scale to fit
        if img.imageWidth > 0:
            ratio = max_width / img.imageWidth
            if ratio < 1.0:
                img.drawWidth  = max_width
                img.drawHeight = img.imageHeight * ratio
            else:
                img.drawWidth  = img.imageWidth
                img.drawHeight = img.imageHeight
        return img
    except Exception:
        return None

# ── Inline-formula substitution (simple: render and return placeholder) ────────
def strip_latex(text: str) -> str:
    """Remove $...$ markers for plain-text fallback in ReportLab paragraphs."""
    # Replace $...$ with the raw expression (for display in text paragraphs)
    text = re.sub(r'\$([^$]+)\$', r'[\1]', text)
    return text

def safe_para(text: str, style) -> Paragraph:
    """Create a Paragraph, stripping LaTeX if needed."""
    clean = strip_latex(text)
    # escape XML-sensitive characters for ReportLab
    clean = clean.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    return Paragraph(clean, style)

# ── Section builders ──────────────────────────────────────────────────────────

def build_header_story(lec_num: str, lec_title: str, doc_type: str,
                       styles, accent_hex: str) -> list:
    acc = colors.HexColor("#" + accent_hex)
    story = [Spacer(1, 0.5*cm)]
    story.append(Paragraph(f"Quantum Mechanics — {lec_num}", styles["doc_title"]))
    story.append(Paragraph(lec_title, styles["doc_sub"]))
    story.append(Paragraph(doc_type, ParagraphStyle("dt2",
        fontName="Helvetica-Bold", fontSize=13, textColor=acc,
        leading=18, spaceAfter=3, alignment=TA_CENTER)))
    story.append(HRFlowable(width="100%", thickness=0.8,
                            color=acc, spaceAfter=6, spaceBefore=4))
    return story


def build_tier_section(tier_name: str, tier_data: dict, styles,
                       mode: str, renderer) -> list:
    """
    mode: "problems" | "suggestions" | "solutions"
    """
    tier_color = TIER_COLORS.get(tier_name, ACC1)
    story = []

    # Tier header band
    tier_label_row = [[Paragraph(f"{tier_name} — {_TIER_LABELS[tier_name]}",
                                 ParagraphStyle("tl", fontName="Helvetica-Bold",
                                                fontSize=12, textColor=WHITE,
                                                alignment=TA_LEFT))]]
    t = Table(tier_label_row,
              colWidths=[W_PT - 2*MARGIN - 0.3*cm])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), tier_color),
        ("TOPPADDING", (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING", (0,0), (-1,-1), 8),
    ]))
    story.append(Spacer(1, 0.4*cm))
    story.append(t)
    story.append(Spacer(1, 0.2*cm))

    # narrative (all modes)
    if tier_data.get("narrative"):
        story.append(safe_para(tier_data["narrative"], styles["body"]))
        story.append(Spacer(1, 0.15*cm))

    # concept questions (all modes)
    cqs = tier_data.get("concept_questions", [])
    if cqs:
        story.append(safe_para("Concept Questions", styles["hint_head"]))
        for i, q in enumerate(cqs, 1):
            story.append(safe_para(f"{i}. {q}", styles["body"]))
        story.append(Spacer(1, 0.15*cm))

    # exercises
    for difficulty in ("simple", "advanced"):
        key = f"problems_{difficulty}"
        problems = tier_data.get(key, [])
        if not problems:
            continue
        label = "Simple Problems" if difficulty == "simple" else "Advanced Problems"
        story.append(safe_para(label, styles["hint_head"]))

        for prob in problems:
            block = []
            prob_id   = prob.get("id", "?")
            statement = prob.get("statement", "")
            hints     = prob.get("hints", [])
            adv_hints = prob.get("advanced_hints", [])
            solution  = prob.get("solution", "")

            block.append(safe_para(f"Problem {prob_id}", styles["prob_id"]))
            block.append(safe_para(statement, styles["prob_text"]))

            # render any inline formula images from statement
            # (simple substitution — real LaTeX rendering would go here)

            if mode in ("suggestions", "solutions") and hints:
                block.append(safe_para("Hints", styles["hint_head"]))
                for h in hints:
                    block.append(safe_para(f"• {h}", styles["hint_text"]))

            if mode in ("suggestions", "solutions") and adv_hints:
                block.append(safe_para("Advanced Hints", styles["hint_head"]))
                for h in adv_hints:
                    block.append(safe_para(f"• {h}", styles["hint_text"]))

            if mode == "solutions" and solution:
                block.append(safe_para("Solution", styles["sol_head"]))
                block.append(safe_para(solution, styles["sol_text"]))

            block.append(HRFlowable(width="100%", thickness=0.3,
                                    color=TEXTDIM, spaceAfter=4, spaceBefore=4))
            story.append(KeepTogether(block[:4]))
            story.extend(block[4:])

    # projects
    for pdiff in ("simple", "advanced"):
        pk = f"project_{pdiff}"
        proj = tier_data.get(pk)
        if not proj:
            continue
        label = f"Project ({pdiff.capitalize()}): {proj.get('title','')}"
        story.append(safe_para(label, styles["prob_id"]))
        story.append(safe_para(proj.get("description",""), styles["prob_text"]))
        story.append(safe_para(
            f"Deliverable: {proj.get('deliverable','')}  |  "
            f"Estimated time: {proj.get('estimated_hours','')} hours",
            styles["note"]))
        if proj.get("tools"):
            story.append(safe_para(
                "Tools: " + ", ".join(proj["tools"]), styles["note"]))
        story.append(Spacer(1, 0.1*cm))

    # research questions
    for rk, rlabel in (("research_simple","Research (Well-Defined)"),
                        ("research_open",  "Research (Open-Ended)")):
        rq = tier_data.get(rk)
        if not rq:
            continue
        story.append(safe_para(rlabel, styles["prob_id"]))
        story.append(safe_para(rq.get("question",""), styles["prob_text"]))
        if rq.get("expected_output") and mode != "problems":
            story.append(safe_para(
                f"Expected output: {rq['expected_output']}", styles["note"]))
        if rq.get("connection_to_literature") and mode == "solutions":
            story.append(safe_para(
                f"Literature: {rq['connection_to_literature']}", styles["note"]))
        story.append(Spacer(1, 0.1*cm))

    return story


def build_bibliography(tier_data: dict, styles) -> list:
    story = [safe_para("References & Bibliography", styles["hint_head"])]
    for cat, label in (
        ("refs_historical",  "Historical Publications"),
        ("refs_educational", "Educational References"),
        ("refs_research",    "Research Level"),
    ):
        refs = tier_data.get(cat, [])
        if not refs:
            continue
        story.append(safe_para(label, styles["sol_head"]))
        for ref in refs:
            authors = ref.get("authors","")
            year    = ref.get("year","")
            title   = ref.get("title","")
            venue   = ref.get("venue","")
            ann     = ref.get("annotation","")
            line = f"[{year}] {authors}. \\u201c{title}.\\u201d {venue}."
            story.append(safe_para(line, styles["body"]))
            if ann:
                story.append(safe_para(f"  ↳ {ann}", styles["note"]))
    return story


_TIER_LABELS = {
    "HS":    "High School",
    "BegUG": "Beginning Undergraduate",
    "AdvUG": "Advanced Undergraduate",
    "MSc":   "Master's Level",
    "PhD":   "PhD Level",
}

# ── Main PDF builder ──────────────────────────────────────────────────────────

def build_homework_pdfs(lecture_content: dict, out_dir: str,
                        formulas_dir: str | None = None):
    """
    Build three PDFs for a lecture: problems, suggestions, solutions.
    lecture_content must conform to quality_standard.py schema.
    """
    Path(out_dir).mkdir(parents=True, exist_ok=True)

    lec_num   = lecture_content["num"]
    lec_title = lecture_content["title"]
    tiers     = lecture_content.get("tiers", {})

    if formulas_dir is None:
        formulas_dir = str(Path(out_dir) / "formulas")
    renderer = LatexRenderer(formulas_dir, dpi=300)

    DOCS = [
        ("problems",    f"{lec_num}_Problem_Sheet.pdf",   "PROBLEM SHEET",    ACC1),
        ("suggestions", f"{lec_num}_Suggestions.pdf",     "SUGGESTIONS SHEET",ACC3),
        ("solutions",   f"{lec_num}_Solutions.pdf",       "SOLUTIONS SHEET",  ACC2),
    ]

    for mode, fname, doc_label, doc_accent in DOCS:
        acc_hex = {ACC1: D["accent1"], ACC3: D["accent3"], ACC2: D["accent2"]}[doc_accent]
        styles  = make_styles(doc_accent)
        out_path = str(Path(out_dir) / fname)

        doc = SimpleDocTemplate(
            out_path,
            pagesize=A4,
            leftMargin=MARGIN + 0.3*cm,
            rightMargin=MARGIN,
            topMargin=2.5*cm,
            bottomMargin=1.2*cm,
            title=f"{lec_num} {doc_label}",
            author="Diego Bragato",
        )

        story = build_header_story(lec_num, lec_title, doc_label, styles, acc_hex)

        # intro note for each document type
        intros = {
            "problems": (
                "This sheet contains problems only.  "
                "Attempt each problem independently before consulting the Suggestions sheet."
            ),
            "suggestions": (
                "This sheet contains problems with basic and advanced hints.  "
                "Try the problem before reading the hints; use them only if stuck."
            ),
            "solutions": (
                "This sheet contains complete worked solutions.  "
                "Study the solutions only after making a genuine attempt at the problems."
            ),
        }
        story.append(safe_para(intros[mode],
                               ParagraphStyle("intro", fontName="Helvetica-Oblique",
                                              fontSize=9.5, textColor=TEXTSUB,
                                              leading=14, spaceAfter=6,
                                              alignment=TA_CENTER)))
        story.append(HRFlowable(width="100%", thickness=0.5,
                                color=doc_accent, spaceAfter=8))

        for tier_name in ["HS", "BegUG", "AdvUG", "MSc", "PhD"]:
            if tier_name not in tiers:
                continue
            tier_data = tiers[tier_name]
            story += build_tier_section(tier_name, tier_data, styles, mode, renderer)

            # bibliography only in solutions sheet
            if mode == "solutions":
                story += build_bibliography(tier_data, styles)

            story.append(PageBreak())

        cb = make_canvas_cb(lec_num, doc_label, acc_hex)
        doc.build(story, onFirstPage=cb, onLaterPages=cb)
        print(f"  ✓ {mode:12s} → {out_path}")

    return out_dir


# ── CLI ───────────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--lecture", help="Lecture number, e.g. L01")
    ap.add_argument("--out",     help="Output directory")
    ap.add_argument("--all",     action="store_true")
    args = ap.parse_args()

    if args.lecture or args.all:
        from shared.lecture_data import LECTURES
        lectures_to_build = LECTURES if args.all else []
        if args.lecture:
            from shared.lecture_data import LECTURE_BY_NUM
            lectures_to_build = [LECTURE_BY_NUM[args.lecture.upper()]]

        BUILD = Path(__file__).parent.parent / "build"
        for lec in lectures_to_build:
            num = lec["num"]
            # Try to load expanded content if available
            lec_path = Path(__file__).parent.parent / num / "lecture_content.py"
            if lec_path.exists():
                import importlib.util
                spec = importlib.util.spec_from_file_location("lc", str(lec_path))
                mod  = importlib.util.module_from_spec(spec)
                spec.loader.exec_module(mod)
                content = getattr(mod, f"{num}_FULL", lec)
            else:
                content = lec

            out_dir = args.out or str(BUILD / num / "homework")
            frm_dir = str(BUILD / num / "formulas")
            print(f"\nBuilding homework PDFs for {num}...")
            build_homework_pdfs(content, out_dir, frm_dir)
    else:
        ap.print_help()
