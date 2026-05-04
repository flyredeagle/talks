#!/usr/bin/env python3
"""
generate_instructor_sheets.py
QM Programme — Module I.3
Generates one PDF instructor sheet per lecture (L01–L10).

Each sheet is a full-content reference document derived from the same
data that drives the PPTX slide decks, expanded with instructor notes,
slide-by-slide content mapping, formula derivation hints, concept-question
model answers, and tier-differentiation guidance.

Output: instructor_sheets/L01_instructor_sheet.pdf  … L10_instructor_sheet.pdf
"""

import os, sys, textwrap
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_RIGHT, TA_JUSTIFY
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle,
    HRFlowable, PageBreak, KeepTogether
)
from reportlab.platypus.flowables import BalancedColumns

# ── Colour palette (matches slide dark-theme accent colours) ──────────────────
NAVY      = colors.HexColor("#0D1B2E")
ACCENT    = colors.HexColor("#4F8EF7")   # blue — learning outcomes
TEAL      = colors.HexColor("#28A8A0")   # teal — pacing
GOLD      = colors.HexColor("#D4A843")   # gold — assessment
PURPLE    = colors.HexColor("#7C5CBF")   # purple — connections
RED       = colors.HexColor("#C0392B")   # instructor notes
DARKGRAY  = colors.HexColor("#2C3E50")
MIDGRAY   = colors.HexColor("#5D6D7E")
LIGHTGRAY = colors.HexColor("#ECF0F1")
WHITE     = colors.white

TIER_COLORS = {
    "hs":    (colors.HexColor("#E8C547"), colors.HexColor("#3D3110")),
    "begug": (colors.HexColor("#4CC38A"), colors.HexColor("#0D2A1A")),
    "advug": (colors.HexColor("#4F8EF7"), colors.HexColor("#0D1A40")),
    "msc":   (colors.HexColor("#B57BEE"), colors.HexColor("#1E0D35")),
    "phd":   (colors.HexColor("#EF5757"), colors.HexColor("#3A0A0A")),
}
TIER_LABELS = {"hs":"HS","begug":"BegUG","advug":"AdvUG","msc":"MSc","phd":"PhD"}

# ── Page geometry ──────────────────────────────────────────────────────────────
PAGE_W, PAGE_H = A4
MARGIN_L, MARGIN_R, MARGIN_T, MARGIN_B = 18*mm, 18*mm, 22*mm, 18*mm
CONTENT_W = PAGE_W - MARGIN_L - MARGIN_R

# ── Style factory ──────────────────────────────────────────────────────────────
def xe(text):
    """Escape text for ReportLab XML paragraphs."""
    return (text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace("\"", "&quot;")
    )

def make_styles():
    base = getSampleStyleSheet()
    def S(name, **kw):
        return ParagraphStyle(name, **kw)

    return {
        "h1": S("h1", fontName="Helvetica-Bold", fontSize=18,
                 textColor=NAVY, spaceBefore=0, spaceAfter=6,
                 leading=22),
        "h2": S("h2", fontName="Helvetica-Bold", fontSize=13,
                 textColor=ACCENT, spaceBefore=10, spaceAfter=4,
                 leading=16),
        "h3": S("h3", fontName="Helvetica-Bold", fontSize=10.5,
                 textColor=TEAL, spaceBefore=8, spaceAfter=3,
                 leading=13),
        "h4": S("h4", fontName="Helvetica-Bold", fontSize=9.5,
                 textColor=DARKGRAY, spaceBefore=6, spaceAfter=2,
                 leading=12),
        "body": S("body", fontName="Helvetica", fontSize=9,
                  textColor=DARKGRAY, spaceBefore=2, spaceAfter=2,
                  leading=13, alignment=TA_JUSTIFY),
        "body_sm": S("body_sm", fontName="Helvetica", fontSize=8,
                     textColor=MIDGRAY, spaceBefore=1, spaceAfter=1,
                     leading=11),
        "mono": S("mono", fontName="Courier", fontSize=8.5,
                  textColor=DARKGRAY, spaceBefore=2, spaceAfter=2,
                  leading=12),
        "bullet": S("bullet", fontName="Helvetica", fontSize=9,
                    textColor=DARKGRAY, spaceBefore=1, spaceAfter=1,
                    leading=13, leftIndent=12, bulletIndent=2,
                    bulletFontName="Helvetica", bulletFontSize=9),
        "label": S("label", fontName="Helvetica-Bold", fontSize=7.5,
                   textColor=WHITE, spaceBefore=0, spaceAfter=0,
                   leading=10, alignment=TA_CENTER),
        "meta": S("meta", fontName="Helvetica-Oblique", fontSize=8,
                  textColor=MIDGRAY, spaceBefore=0, spaceAfter=4,
                  leading=11),
        "instr": S("instr", fontName="Helvetica-Oblique", fontSize=8.5,
                   textColor=RED, spaceBefore=3, spaceAfter=3,
                   leading=12),
        "formula": S("formula", fontName="Courier-Bold", fontSize=9.5,
                     textColor=ACCENT, spaceBefore=2, spaceAfter=2,
                     leading=13),
        "formula_label": S("formula_label", fontName="Helvetica-Oblique",
                           fontSize=8, textColor=TEAL, spaceBefore=0,
                           spaceAfter=3, leading=11),
        "note": S("note", fontName="Helvetica", fontSize=8,
                  textColor=DARKGRAY, spaceBefore=2, spaceAfter=2,
                  leading=12, leftIndent=8),
        "header_meta": S("header_meta", fontName="Helvetica", fontSize=8,
                         textColor=MIDGRAY, alignment=TA_RIGHT,
                         spaceBefore=0, spaceAfter=0, leading=10),
    }

# ── Reusable flowable builders ─────────────────────────────────────────────────

def section_rule(color=ACCENT, thickness=1.5):
    return HRFlowable(width="100%", thickness=thickness, color=color,
                      spaceAfter=4, spaceBefore=2)

def thin_rule(color=LIGHTGRAY):
    return HRFlowable(width="100%", thickness=0.5, color=color,
                      spaceAfter=2, spaceBefore=2)

def colored_box(content_rows, bg=LIGHTGRAY, border=ACCENT,
                col_widths=None, padding=5):
    """Wrap a list of Paragraphs inside a 1-cell coloured table."""
    data = [[c] for c in content_rows] if isinstance(content_rows[0], Paragraph) \
           else [content_rows]
    # flatten to single cell
    flat = []
    for r in content_rows:
        if isinstance(r, list):
            flat.extend(r)
        else:
            flat.append(r)
    t = Table([[flat]], colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,-1), bg),
        ("BOX",        (0,0), (-1,-1), 1.2, border),
        ("TOPPADDING",    (0,0), (-1,-1), padding),
        ("BOTTOMPADDING", (0,0), (-1,-1), padding),
        ("LEFTPADDING",   (0,0), (-1,-1), padding+2),
        ("RIGHTPADDING",  (0,0), (-1,-1), padding),
    ]))
    return t

def header_table(lec, ST):
    """Full-width navy header block for the lecture."""
    title_p  = Paragraph(f"<b>{xe(lec['code'])} \u2014 {xe(lec['title'])}</b>", 
                          ParagraphStyle("ht", fontName="Helvetica-Bold",
                                         fontSize=16, textColor=WHITE,
                                         leading=20, spaceBefore=0, spaceAfter=0))
    sub_p    = Paragraph(xe(lec["subtitle"]),
                          ParagraphStyle("hs", fontName="Helvetica-Oblique",
                                         fontSize=10, textColor=TEAL,
                                         leading=13, spaceBefore=2, spaceAfter=0))
    track_p  = Paragraph(f"<b>Track:</b> {xe(lec['track'])}",
                          ParagraphStyle("htr", fontName="Helvetica",
                                         fontSize=8.5, textColor=colors.HexColor("#C9D1D9"),
                                         leading=12, spaceBefore=4, spaceAfter=0))
    tag_p    = Paragraph("INSTRUCTOR REFERENCE SHEET — Module I.3",
                          ParagraphStyle("htag", fontName="Helvetica-Bold",
                                         fontSize=7, textColor=GOLD,
                                         leading=10, spaceBefore=4, spaceAfter=0))

    t = Table([[title_p], [sub_p], [track_p], [tag_p]],
              colWidths=[CONTENT_W])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), NAVY),
        ("TOPPADDING",    (0,0), (-1,-1), 10),
        ("BOTTOMPADDING", (0,0), (-1,-1), 10),
        ("LEFTPADDING",   (0,0), (-1,-1), 14),
        ("RIGHTPADDING",  (0,0), (-1,-1), 14),
        ("BOX",           (0,0), (-1,-1), 2, ACCENT),
    ]))
    return t

def tier_badge_row(ST):
    """A row of five coloured tier pills."""
    badges = []
    for key in ["hs","begug","advug","msc","phd"]:
        fg, bg = TIER_COLORS[key]
        p = Paragraph(f"<b>{TIER_LABELS[key]}</b>",
                       ParagraphStyle("tb", fontName="Helvetica-Bold",
                                       fontSize=7.5, textColor=fg,
                                       alignment=TA_CENTER, leading=10))
        badges.append(p)
    t = Table([badges], colWidths=[CONTENT_W/5]*5)
    for i,(key,(_fg,_bg)) in enumerate(TIER_COLORS.items()):
        fg, bg = TIER_COLORS[key]
        t.setStyle(TableStyle([
            ("BACKGROUND",    (i,0),(i,0), bg),
            ("BOX",           (i,0),(i,0), 1, fg),
            ("TOPPADDING",    (i,0),(i,0), 4),
            ("BOTTOMPADDING", (i,0),(i,0), 4),
        ]))
    return t

def pacing_table(pacing, ST):
    """Colour-striped pacing plan table."""
    rows = [[ Paragraph("<b>Time / Segment</b>", ST["h4"]),
              Paragraph("<b>Content &amp; Activities</b>", ST["h4"]) ]]
    for i, p in enumerate(pacing):
        parts = p.split(": ", 1)
        time_txt    = xe(parts[0]) if len(parts)>1 else ""
        content_txt = xe(parts[1]) if len(parts)>1 else xe(p)
        bg = colors.HexColor("#EAF4FB") if i % 2 == 0 else WHITE
        rows.append([
            Paragraph(f"<b>{time_txt}</b>", ST["body_sm"]),
            Paragraph(content_txt, ST["body"]),
        ])
    t = Table(rows, colWidths=[28*mm, CONTENT_W-28*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",     (0,0), (-1,0), WHITE),
        ("FONTNAME",      (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE",      (0,0), (-1,0), 9),
        ("TOPPADDING",    (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("ROWBACKGROUNDS",(0,1), (-1,-1),
         [colors.HexColor("#EAF4FB"), WHITE]),
        ("BOX",           (0,0), (-1,-1), 0.8, ACCENT),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, colors.HexColor("#D0E8F8")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    return t

def outcomes_table(outcomes, ST):
    """Numbered learning outcomes table with BLOOMS level note."""
    blooms = ["Create / Construct","Verify / Analyse","Apply / Compute","Evaluate / Connect"]
    rows = [[Paragraph("<b>#</b>", ST["h4"]),
             Paragraph("<b>Learning Outcome</b>", ST["h4"]),
             Paragraph("<b>Bloom's level</b>", ST["h4"])]]
    for i, o in enumerate(outcomes):
        bloom = blooms[i] if i < len(blooms) else "Apply"
        rows.append([
            Paragraph(f"<b>LO{i+1}</b>", ParagraphStyle(
                "lon", fontName="Helvetica-Bold", fontSize=9,
                textColor=ACCENT, alignment=TA_CENTER, leading=12)),
            Paragraph(xe(o), ST["body"]),
            Paragraph(f"<i>{bloom}</i>", ST["body_sm"]),
        ])
    t = Table(rows, colWidths=[14*mm, CONTENT_W-14*mm-32*mm, 32*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",     (0,0), (-1,0), WHITE),
        ("FONTNAME",      (0,0), (-1,0), "Helvetica-Bold"),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("ROWBACKGROUNDS",(0,1), (-1,-1),
         [colors.HexColor("#EEF5FF"), WHITE]),
        ("BOX",           (0,0), (-1,-1), 0.8, ACCENT),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, colors.HexColor("#D0E0FF")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("ALIGN",         (0,0), (0,-1), "CENTER"),
    ]))
    return t

def formula_block(formulas, ST):
    """Two-column formula cards grid."""
    rows = []
    pair = []
    for i, f in enumerate(formulas):
        # split formula from label at "  ("
        idx = f.find("  (")
        fml   = xe(f[:idx].strip()) if idx >= 0 else xe(f)
        label = xe(f[idx+2:].strip().strip("()")) if idx >= 0 else ""
        cell = [
            Paragraph(f"<b>F{i+1}</b>  {fml}", ST["formula"]),
        ]
        if label:
            cell.append(Paragraph(label, ST["formula_label"]))
        pair.append(cell)
        if len(pair) == 2:
            rows.append(pair)
            pair = []
    if pair:
        rows.append(pair + [[Paragraph("", ST["body"])]])

    cell_w = (CONTENT_W - 4*mm) / 2
    all_rows = []
    for r in rows:
        all_rows.append([r[0], r[1]])
    if not all_rows:
        return Spacer(1,1)

    t = Table(all_rows, colWidths=[cell_w, cell_w], hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#0D1A2A")),
        ("BOX",           (0,0), (-1,-1), 1.2, ACCENT),
        ("INNERGRID",     (0,0), (-1,-1), 0.5, colors.HexColor("#1A3050")),
        ("TOPPADDING",    (0,0), (-1,-1), 8),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    return t

def concept_questions_table(questions, ST):
    """Numbered concept questions with model-answer prompts."""
    rows = [[Paragraph("<b>#</b>", ST["h4"]),
             Paragraph("<b>Question</b>", ST["h4"]),
             Paragraph("<b>Key point to elicit</b>", ST["h4"])]]
    
    # Instructor model answers — brief teaching pointers per question
    pointers = [
        "Distinction between quantum coherence and classical ignorance; ρ̂ unifies both",
        "Interference terms: off-diagonal ρ-elements ≠ 0 for superposition; = 0 for mixture",
        "All three properties are independent and each has a physical meaning",
        "False: pure iff γ=1 exactly; any γ<1 is mixed regardless of value",
        "Partial trace sums over B basis; information about B is irreversibly discarded",
        "True: S(ρ_A)=0 iff ρ_A is pure iff state is product; any entanglement gives S>0",
        "Tr(|ψ⟩⟨ψ|A) = ⟨ψ|A|ψ⟩ by cyclic trace; extra step for mixture",
        "Pure: r on sphere surface (|r|=1); Mixed: r inside sphere (|r|<1); same ⟨σ_z⟩ possible",
    ]
    for i, q in enumerate(questions):
        pt = pointers[i] if i < len(pointers) else "—"
        bg = colors.HexColor("#F0F8F0") if i % 2 == 0 else WHITE
        rows.append([
            Paragraph(f"<b>CQ{i+1}</b>", ParagraphStyle(
                "cqn", fontName="Helvetica-Bold", fontSize=8.5,
                textColor=TEAL, alignment=TA_CENTER, leading=12)),
            Paragraph(xe(q), ST["body"]),
            Paragraph(f"<i>{xe(pt)}</i>", ST["body_sm"]),
        ])
    t = Table(rows, colWidths=[12*mm, CONTENT_W-12*mm-52*mm, 52*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), colors.HexColor("#0D3825")),
        ("TEXTCOLOR",     (0,0), (-1,0), WHITE),
        ("FONTNAME",      (0,0), (-1,0), "Helvetica-Bold"),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 5),
        ("RIGHTPADDING",  (0,0), (-1,-1), 5),
        ("ROWBACKGROUNDS",(0,1), (-1,-1),
         [colors.HexColor("#F0FAF5"), WHITE]),
        ("BOX",           (0,0), (-1,-1), 0.8, TEAL),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, colors.HexColor("#C0E8D0")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("ALIGN",         (0,0), (0,-1), "CENTER"),
    ]))
    return t

def tier_table(tiers, ST):
    """Five-tier differentiation table."""
    tier_keys = ["hs","begug","advug","msc","phd"]
    tier_names = ["Tier 1 — HS","Tier 2 — BegUG","Tier 3 — AdvUG","Tier 4 — MSc","Tier 5 — PhD"]
    rows = [[Paragraph("<b>Tier</b>",ST["h4"]),
             Paragraph("<b>Differentiated content &amp; focus</b>",ST["h4"]),
             Paragraph("<b>Assessment link</b>",ST["h4"])]]
    assmt_links = ["SCQU Q1-Q4","SPSU Part A","CPSU P1-P3","CPSG P1-P3","CPSG P4-P5 / WRQ"]
    for i, key in enumerate(tier_keys):
        fg, bg = TIER_COLORS[key]
        rows.append([
            Paragraph(f"<b>{tier_names[i]}</b>",
                      ParagraphStyle("tn", fontName="Helvetica-Bold",
                                     fontSize=8, textColor=fg,
                                     leading=11, alignment=TA_LEFT)),
            Paragraph(xe(tiers[key]), ST["body"]),
            Paragraph(f"<i>{assmt_links[i]}</i>", ST["body_sm"]),
        ])
    t = Table(rows, colWidths=[28*mm, CONTENT_W-28*mm-28*mm, 28*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",     (0,0), (-1,0), WHITE),
        ("FONTNAME",      (0,0), (-1,0), "Helvetica-Bold"),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("ROWBACKGROUNDS",(0,1), (-1,-1),
         [colors.HexColor("#F5F0FF"), WHITE]),
        ("BOX",           (0,0), (-1,-1), 0.8, PURPLE),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, colors.HexColor("#DDD0F0")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
    ]))
    return t

def assessment_box(assessment, prev_lec, next_lec, ST):
    """Gold assessment + connections block."""
    rows = [
        [Paragraph("<b>Set A (standard):</b>", ST["h4"]),
         Paragraph(xe(assessment["setA"]), ST["body"])],
        [Paragraph("<b>Set B (proof-level):</b>", ST["h4"]),
         Paragraph(xe(assessment["setB"]), ST["body"])],
        [Paragraph("<b>Preceding lecture:</b>", ST["h4"]),
         Paragraph(f"<i>{xe(prev_lec)}</i>", ST["meta"])],
        [Paragraph("<b>Following lecture:</b>", ST["h4"]),
         Paragraph(f"<i>{xe(next_lec)}</i>", ST["meta"])],
    ]
    t = Table(rows, colWidths=[36*mm, CONTENT_W-36*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#FFFBEF")),
        ("BOX",           (0,0), (-1,-1), 1.5, GOLD),
        ("TOPPADDING",    (0,0), (-1,-1), 5),
        ("BOTTOMPADDING", (0,0), (-1,-1), 5),
        ("LEFTPADDING",   (0,0), (-1,-1), 8),
        ("RIGHTPADDING",  (0,0), (-1,-1), 8),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, colors.HexColor("#F0DCA0")),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("LINEBELOW",     (0,1), (-1,1), 1, GOLD),
    ]))
    return t

def slide_map_table(lec, ST):
    """Full 5-slide map with content from the deck."""
    slides = [
        ("Slide 1", "Title",
         xe(f"{lec['code']} \u00b7 {lec['title']} \u00b7 {lec['subtitle']}") + "<br/>" +
         xe(f"Track: {lec['track']}") + "<br/>" +
         "Tier badges: HS / BegUG / AdvUG / MSc / PhD<br/>" +
         "Feature line: Full expanded deck \u00b7 5 tiers \u00b7 Worked examples \u00b7 Complete problem sets"),
        ("Slide 2", "Lecture Overview",
         "<b>90-Min Pacing:</b><br/>" +
         "<br/>".join(f"\u00a0\u00a0\u2022 {xe(p)}" for p in lec['pacing']) +
         "<br/><br/><b>Core Learning Outcomes:</b><br/>" +
         "<br/>".join(f"\u00a0\u00a0\u2022 {xe(o)}" for o in lec['outcomes']) +
         "<br/><br/>Tier summaries (one box per tier) + Assessment bundle A &amp; B"),
        ("Slide 3", "Key Formulas",
         "<br/>".join(f"\u00a0\u00a0<b>F{i+1}:</b> {xe(f)}" for i,f in enumerate(lec['keyFormulas'])) +
         f"<br/><br/>Connection strip: \u2190 {xe(lec['prev'])}  |  \u2192 {xe(lec['next'])}"),
        ("Slide 4", "Concept Questions",
         "<br/>".join(f"\u00a0\u00a0<b>CQ{i+1}:</b> {xe(q)}" for i,q in enumerate(lec['concepts']))),
        ("Slide 5", "Five-Tier Pedagogy",
         "<br/>".join(
             f"\u00a0\u00a0<b>Tier {i+1} ({TIER_LABELS[k]}):</b> {xe(lec['tiers'][k])}"
             for i,k in enumerate(["hs","begug","advug","msc","phd"])
         ) +
         f"<br/><br/><b>Set A:</b> {xe(lec['assessment']['setA'])}"
         f"<br/><b>Set B:</b> {xe(lec['assessment']['setB'])}"),
    ]
    rows = [[Paragraph("<b>Slide</b>", ST["h4"]),
             Paragraph("<b>Title</b>", ST["h4"]),
             Paragraph("<b>Full slide content</b>", ST["h4"])]]
    for slide_n, slide_t, slide_c in slides:
        rows.append([
            Paragraph(f"<b>{slide_n}</b>", ParagraphStyle(
                "sn", fontName="Helvetica-Bold", fontSize=8.5,
                textColor=ACCENT, alignment=TA_CENTER, leading=12)),
            Paragraph(f"<b>{xe(slide_t)}</b>", ST["h4"]),
            Paragraph(slide_c, ST["note"]),
        ])
    t = Table(rows, colWidths=[16*mm, 28*mm, CONTENT_W-16*mm-28*mm])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,0), NAVY),
        ("TEXTCOLOR",     (0,0), (-1,0), WHITE),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("BOX",           (0,0), (-1,-1), 0.8, ACCENT),
        ("INNERGRID",     (0,0), (-1,-1), 0.4, colors.HexColor("#C8DCFF")),
        ("ROWBACKGROUNDS",(0,1), (-1,-1),
         [colors.HexColor("#EEF5FF"), WHITE]),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("ALIGN",         (0,0), (0,-1), "CENTER"),
    ]))
    return t

# ── Instructor notes per lecture ───────────────────────────────────────────────
INSTRUCTOR_NOTES = {
    "L01": [
        "Open with the Stern–Gerlach ensemble thought experiment before writing any equations. "
        "T1 students anchor to the coin-flip analogy; T2–T3 should be pushed to identify why "
        "interference distinguishes a superposition from a mixture.",
        "Draw the Bloch sphere on the board during the purity discussion — label the surface, "
        "the interior, and the centre explicitly. Ask: 'If I told you γ = 0.7, where is the state?'",
        "The Bell-state partial trace example (ρ_A = ½𝐈) is often surprising. "
        "Emphasise: the global state is pure (zero entropy) but the subsystem is maximally mixed. "
        "This is the signature of entanglement — use it to motivate L10.",
        "T4–T5 students should be directed to the purification construction "
        "(Eq. L01.8 in the lecture body) and asked to verify Schmidt decomposition.",
        "Assessment timing: SCQU / CCQU in class this week; SPSU as homework; "
        "CPSU released to T3 students with Layer 1 only; revisit after next lecture.",
    ],
    "L02": [
        "Start with the completeness resolution Î = Σᵢ|eᵢ⟩⟨eᵢ| in finite dimensions before moving "
        "to the continuous case. The transition Σ→∫ and δᵢⱼ→δ(x−x′) is where many students stumble.",
        "Explicitly insert identity twice in ⟨x|p̂²|ψ⟩ to build the habit. "
        "T3 students should do this in both position and momentum representations.",
        "Fourier transform as a unitary change of basis: write it on the board as "
        "ψ̃(p) = ⟨p|ψ⟩ = ∫⟨p|x⟩⟨x|ψ⟩dx and let students identify each factor.",
        "The Dirac δ-function: stress that it is a distribution, not a function. "
        "T5 students need the Gel'fand triple Φ ⊂ L² ⊂ Φ′ for rigour.",
        "Link to L01: 'The partial trace used the resolution of identity over B — "
        "today we see where that formula comes from.'",
    ],
    "L03": [
        "Lead with [x̂,p̂]=iℏ computed explicitly in position representation: "
        "[x, -iℏ∂_x]f = iℏf. T1 students: 'they don't commute → you can't know both exactly.'",
        "Robertson inequality derivation: walk through Cauchy–Schwarz carefully. "
        "T3 students should do the proof at the board; T2 students verify numerically for Gaussians.",
        "CSCO discussion: use hydrogen (n,l,m) as the canonical example. "
        "Ask why m alone doesn't label states uniquely — leads naturally to degeneracy.",
        "Quantum Zeno effect: give the 1-minute intuition ('watched pot') before the formula. "
        "T4–T5 can be directed to the rigorous projection-valued measure treatment.",
        "Energy–time uncertainty: emphasise that Δt is NOT an operator. "
        "This is a common misconception that resurfaces in scattering (L08, L09).",
    ],
    "L04": [
        "Stone's theorem: build up from the finite-dimensional matrix exponential "
        "e^{iθG} before stating the infinite-dimensional version. "
        "T5 students need the domain issues for unbounded generators.",
        "Noether's theorem proof in QM: [Ĥ,Ĝ]=0 → d⟨Ĝ⟩/dt=0 from Heisenberg EOM. "
        "Connect immediately to the classical Noether theorem students know from Lagrangian mechanics.",
        "Parity: verify Π̂x̂Π̂⁻¹=−x̂ explicitly using Π̂|x⟩=|−x⟩. "
        "Selection rules are the practical payoff — connect to spectroscopy.",
        "Time reversal T̂ is anti-unitary: spend time here as it is non-intuitive. "
        "Kramers degeneracy follows and appears again in L05.",
        "Spontaneous symmetry breaking (qualitative): Mexican hat potential visual. "
        "Goldstone modes are mentioned here and developed in Series II.",
    ],
    "L05": [
        "Unitarity of Û(t): derive from Hermiticity of Ĥ using the series expansion. "
        "T3: prove e^{−iĤt/ℏ} is unitary when Ĥ†=Ĥ. T5: Stone's theorem domain issues.",
        "General solution |ψ(t)⟩=Σcₙe^{−iEₙt/ℏ}|Eₙ⟩: make students write "
        "cₙ=⟨Eₙ|ψ(0)⟩ explicitly. Stationary states are the special case cₙ=δₙₖ.",
        "Probability current: derive from Schrödinger equation + complex conjugate. "
        "T1: 'current of probability like water current.' T3: verify continuity equation ∂_t|ψ|²+∇·j=0.",
        "Kramers degeneracy: connect to L04 time-reversal discussion. "
        "Half-integer spin systems have T̂²=−1 → every energy level at least 2-fold degenerate.",
        "Forward link to L06: 'Today Ĥ was constant — what if it changes in time?' "
        "Use a physically motivated example (microwave pulse on a spin).",
    ],
    "L06": [
        "Motivate failure of simple e^{−iĤt/ℏ}: write [Ĥ(t₁),Ĥ(t₂)]≠0 explicitly "
        "for a rotating field Ĥ(t)=ω(σ_x cos(ωt)+σ_y sin(ωt)). Show the product formula fails.",
        "Time-ordering operator T: stress it is a bookkeeping device, not a physical observable. "
        "Analogy: path-ordered exponential in gauge theory (for T5 students).",
        "Dyson series to second order: write each term explicitly and count the integration regions. "
        "T3: the 1/n! factors come from time-ordering, not from the Taylor expansion.",
        "Magnus expansion: emphasise Ω₁+Ω₂+... gives exactly unitary result at every order "
        "whereas Dyson series is only unitary when summed to all orders.",
        "Trotter–Suzuki: practical quantum simulation connection. "
        "T4–T5: error scaling Δt² for first-order, Δt⁴ for Suzuki–Trotter second order.",
    ],
    "L07": [
        "Picture equivalence: write side by side: S-picture (states move, ops static) "
        "vs H-picture (ops move, states static). Physical predictions identical — "
        "this is a coordinate change in Hilbert space.",
        "Heisenberg EOM dÂ_H/dt=(i/ℏ)[Ĥ,Â_H]: derive carefully. "
        "Verify for x̂_H(t) in a harmonic potential — students should get SHO solution.",
        "Ehrenfest: d⟨x̂⟩/dt=⟨p̂⟩/m. Push T3 students to identify when this gives Newton's 2nd law exactly "
        "(when ⟨∇V⟩=∇V(⟨x̂⟩), i.e. for linear and quadratic potentials).",
        "Virial theorem: useful for energy estimates in bound states. "
        "Ask: 'For a hydrogen atom, what is ⟨T̂⟩/⟨V̂⟩?' Answer: −1/2.",
        "Canonical quantisation ambiguity: the operator xp vs px — demonstrate "
        "Weyl ordering as one resolution. T5: Groenewold–Van Hove obstruction.",
    ],
    "L08": [
        "Motivate the interaction picture: 'We want Ĥ₀ to drive the operators "
        "and V̂(t) to drive the states — then perturbation theory is natural.'",
        "Transformation derivation: write |ψ_I⟩=e^{iĤ₀t/ℏ}|ψ_S⟩ and differentiate. "
        "T3: verify iℏ∂_t|ψ_I⟩=V̂_I(t)|ψ_I⟩ step by step.",
        "S-matrix: Ŝ=Û_I(∞,−∞). The (i,f) matrix element is the transition amplitude. "
        "T4–T5: connection to LSZ reduction and Feynman diagrams (preview, not detail).",
        "Three-picture comparison table (Slide 2 of deck): use this as a consolidation exercise. "
        "Students fill in the blank cells for which quantity is time-dependent in each picture.",
        "Forward link to L09: 'The Dyson series in the interaction picture IS perturbation theory — "
        "truncate after first order and you get Fermi's golden rule (L10).'",
    ],
    "L09": [
        "Non-degenerate RSPT setup: stress the ansatz E_n=E_n^{(0)}+λE_n^{(1)}+λ²E_n^{(2)}+... "
        "and the importance of the same-order matching on both sides of the TISE.",
        "First-order energy E_n^{(1)}=⟨n⁰|V̂|n⁰⟩: this is just the expectation value "
        "of the perturbation in the unperturbed state. Students find this intuitive.",
        "Degenerate PT: the secular equation is the key step. "
        "Work through the 2×2 case explicitly (linear Stark effect for H n=2). "
        "T3 students often struggle to identify the correct zeroth-order basis.",
        "Feynman–Hellmann theorem: ∂E_n/∂λ=⟨n|∂Ĥ/∂λ|n⟩. "
        "Applications: bond lengths in molecules, pressure in Fermi gas.",
        "Variational principle: Ritz bound E₀≤⟨φ|Ĥ|φ⟩/⟨φ|φ⟩. "
        "Gaussian trial wavefunction for hydrogen gives E ≥ −13.6 eV — use this as a check.",
    ],
    "L10": [
        "TDPT first-order amplitude: c_f^{(1)}(t)=−(i/ℏ)∫e^{iω_{fi}t′}⟨f|V̂(t′)|i⟩dt′. "
        "Constant perturbation: the sinc-squared transition probability is key. "
        "Demonstrate how the delta function emerges in the long-time limit.",
        "Fermi's golden rule Γ=(2π/ℏ)|⟨f|V̂|i⟩|²ρ(E_f): "
        "units check (energy/time × states/energy = rate). "
        "Applications: radioactive decay, photoionisation, phonon scattering.",
        "Lindblad master equation: identify the three parts — "
        "(1) unitary evolution, (2) jump L̂_kρ̂L̂_k† (quantum jumps), "
        "(3) anti-commutator {L̂_k†L̂_k,ρ̂} (norm preservation). "
        "Verify trace-preserving: Tr(L̂ρ̂L̂†)−½Tr({L̂†L̂,ρ̂})=0.",
        "Decoherence: pointer states are those that commute with Ĥ_env. "
        "The Bloch vector shrinks toward the z-axis under dephasing — "
        "connect to the Bloch sphere discussion from L01.",
        "Singlet/triplet: construct from antisymmetry. "
        "Exchange interaction sign (singlet lower for H₂ due to Pauli). "
        "This is the bridge to Series II many-body physics.",
    ],
}

# ── Main per-lecture PDF builder ───────────────────────────────────────────────

def build_instructor_sheet(lec, out_dir, version_str):
    code = lec["code"]
    safe_title = lec["title"].replace("/","").replace("&","and").replace("—","-")
    fname = f"{code}_instructor_sheet.pdf"
    fpath = os.path.join(out_dir, fname)

    doc = SimpleDocTemplate(
        fpath,
        pagesize=A4,
        leftMargin=MARGIN_L, rightMargin=MARGIN_R,
        topMargin=MARGIN_T,  bottomMargin=MARGIN_B,
        title=f"Instructor Sheet — {code} — {lec['title']}",
        author="QM Programme",
        subject="Module I.3 — Instructor Reference",
    )

    ST = make_styles()
    story = []

    # ── HEADER ────────────────────────────────────────────────────────────────
    story.append(header_table(lec, ST))
    story.append(Spacer(1, 4*mm))
    story.append(Paragraph(
        f"Version {xe(version_str)}  \u00b7  Module I.3: Quantum Dynamics, "
        f"Perturbation Theory &amp; Physical Systems  \u00b7  QM Programme",
        ST["meta"]))
    story.append(tier_badge_row(ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 1: SLIDE MAP ──────────────────────────────────────────────────
    story.append(Paragraph("1. Slide-by-Slide Content Map", ST["h2"]))
    story.append(section_rule(ACCENT))
    story.append(Paragraph(
        "Complete content inventory for all 5 slides in the lecture deck. "
        "Use this as a delivery checklist and reference during class.",
        ST["body_sm"]))
    story.append(Spacer(1, 2*mm))
    story.append(slide_map_table(lec, ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 2: PACING PLAN ────────────────────────────────────────────────
    story.append(Paragraph("2. 90-Minute Pacing Plan", ST["h2"]))
    story.append(section_rule(TEAL))
    story.append(pacing_table(lec["pacing"], ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 3: LEARNING OUTCOMES ─────────────────────────────────────────
    story.append(Paragraph("3. Learning Outcomes", ST["h2"]))
    story.append(section_rule(ACCENT))
    story.append(outcomes_table(lec["outcomes"], ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 4: KEY FORMULAS ───────────────────────────────────────────────
    story.append(Paragraph("4. Key Formulas — Slide 3 Content", ST["h2"]))
    story.append(section_rule(ACCENT))
    story.append(Paragraph(
        "All six formulas appearing on Slide 3 of the deck. "
        "Each formula card includes the label from the slide.",
        ST["body_sm"]))
    story.append(Spacer(1, 2*mm))
    story.append(formula_block(lec["keyFormulas"], ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 5: CONCEPT QUESTIONS ─────────────────────────────────────────
    story.append(Paragraph("5. Concept Questions — Slide 4 Content", ST["h2"]))
    story.append(section_rule(TEAL))
    story.append(Paragraph(
        "All eight concept questions from Slide 4, with brief instructor "
        "pointers on the key point each question is designed to elicit.",
        ST["body_sm"]))
    story.append(Spacer(1, 2*mm))
    story.append(concept_questions_table(lec["concepts"], ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 6: TIER DIFFERENTIATION ──────────────────────────────────────
    story.append(Paragraph("6. Five-Tier Differentiation — Slide 5 Content", ST["h2"]))
    story.append(section_rule(PURPLE))
    story.append(tier_table(lec["tiers"], ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 7: ASSESSMENT & CONNECTIONS ──────────────────────────────────
    story.append(Paragraph("7. Assessment Bundle &amp; Lecture Connections", ST["h2"]))
    story.append(section_rule(GOLD))
    story.append(assessment_box(lec["assessment"], lec["prev"], lec["next"], ST))
    story.append(Spacer(1, 4*mm))

    # ── SECTION 8: INSTRUCTOR NOTES ──────────────────────────────────────────
    story.append(Paragraph("8. Instructor Delivery Notes", ST["h2"]))
    story.append(section_rule(RED))
    notes = INSTRUCTOR_NOTES.get(code, [
        "See the lecture body document for detailed instructor notes.",
    ])
    note_rows = []
    for i, note in enumerate(notes):
        note_rows.append([
            Paragraph(f"<b>Note {i+1}</b>", ParagraphStyle(
                "nn", fontName="Helvetica-Bold", fontSize=8,
                textColor=RED, alignment=TA_CENTER, leading=11)),
            Paragraph(xe(note), ST["body"]),
        ])
    nt = Table(note_rows, colWidths=[16*mm, CONTENT_W-16*mm])
    nt.setStyle(TableStyle([
        ("BACKGROUND",    (0,0), (-1,-1), colors.HexColor("#FFF5F5")),
        ("BOX",           (0,0), (-1,-1), 1, RED),
        ("INNERGRID",     (0,0), (-1,-1), 0.3, colors.HexColor("#FFD0D0")),
        ("TOPPADDING",    (0,0), (-1,-1), 6),
        ("BOTTOMPADDING", (0,0), (-1,-1), 6),
        ("LEFTPADDING",   (0,0), (-1,-1), 6),
        ("RIGHTPADDING",  (0,0), (-1,-1), 6),
        ("VALIGN",        (0,0), (-1,-1), "TOP"),
        ("ALIGN",         (0,0), (0,-1), "CENTER"),
        ("ROWBACKGROUNDS",(0,0), (-1,-1),
         [colors.HexColor("#FFF0F0"), colors.HexColor("#FFF8F8")]),
    ]))
    story.append(nt)
    story.append(Spacer(1, 6*mm))

    # ── FOOTER NOTE ───────────────────────────────────────────────────────────
    story.append(thin_rule())
    story.append(Paragraph(
        f"QM Programme \u00b7 Module I.3 \u00b7 {xe(code)} Instructor Sheet \u00b7 {xe(version_str)} \u00b7 "
        "Slides: src/builder-L01.js (expanded) / src/builder.js (L02\u2013L10) \u00b7 "
        "Artifacts: L01-artifacts/ \u00b7 NOT FOR STUDENT DISTRIBUTION",
        ST["body_sm"]))

    doc.build(story)
    size_kb = os.path.getsize(fpath) // 1024
    print(f"  {fname}  ({size_kb} KB)")
    return fpath


# ── Data — all 10 lectures (matching lectures.js) ─────────────────────────────
LECTURES = [
    {
        "code": "L01", "num": 1,
        "title": "Pure/Mixed States and the Density Matrix",
        "subtitle": "§2.3-2.5 — Density Operator Formalism",
        "track": "Sakurai <-> Dirac Dual-Track — Lecture 1",
        "pacing": [
            "0-20 min: Motivation — why a single ket is insufficient for sub-systems or ensembles",
            "20-45 min: Mixed states: rho = sum_i p_i|psi_i><psi_i|; classical vs. quantum uncertainty",
            "45-70 min: Properties of rho: Hermiticity, unit trace, positivity; purity gamma = Tr(rho^2)",
            "70-90 min: Bipartite systems; partial trace rho_A = Tr_B(rho_AB); entanglement entropy preview",
        ],
        "outcomes": [
            "Construct rho for pure states, statistical mixtures, and subsystems of composite systems",
            "Verify the three defining properties (rho-dagger=rho, Tr(rho)=1, rho>=0) for given matrices",
            "Compute expectation values <A>=Tr(rho*A) and purity; distinguish pure from mixed states",
            "Apply the partial trace to obtain reduced density matrices and compute entanglement entropy",
        ],
        "tiers": {
            "hs":    "Classical probability analogy: coin-flip vs. genuine quantum superposition; Bloch sphere intuition",
            "begug": "Compute rho, Tr(rho^2), and <A> for 2x2 examples; verify properties numerically",
            "advug": "Prove Tr(rho^2)<=1 via spectral decomposition; Bloch vector parameterisation; partial trace",
            "msc":   "Purification of mixed states; Schmidt decomposition; entanglement entropy and sub-additivity",
            "phd":   "Trace-class operators in inf dimensions; von Neumann entropy; quantum relative entropy; CP maps",
        },
        "keyFormulas": [
            "rho = |psi><psi|  (pure state)",
            "rho = sum_i p_i |psi_i><psi_i|  (mixture)",
            "<A> = Tr(rho A)  (expectation value)",
            "gamma = Tr(rho^2) <= 1  (purity)",
            "rho_A = Tr_B(rho_AB)  (partial trace)",
            "S = -Tr(rho_A ln rho_A)  (entanglement entropy)",
        ],
        "concepts": [
            "Why is rho needed when a ket |psi> is insufficient?",
            "What is the physical difference between a coherent superposition and a classical mixture?",
            "State the three mathematical properties that every density operator must satisfy.",
            "True/False: A state with purity gamma=0.5 is a pure state. Justify.",
            "How does the partial trace 'discard' information about subsystem B?",
            "True/False: Entanglement entropy is zero for a product state. Justify.",
            "When does <A>=Tr(rho*A) reduce to the usual <psi|A|psi>?",
            "Compare the Bloch sphere representation of a pure vs. mixed spin-1/2 state.",
        ],
        "assessment": {
            "setA": "Construct rho for explicit mixtures; compute purity and <sigma_z>; partial trace for 2-qubit Bell states",
            "setB": "Prove Tr(rho^2)<=(Tr rho)^2 with equality iff rank-1; show entanglement entropy vanishes for product states",
        },
        "prev": "I.2 — L12: Tensor Products, Spin & Density Operators (intro)",
        "next": "L02 — Bases: Discrete and Continuous",
    },
    {
        "code": "L02", "num": 2,
        "title": "Bases: Discrete and Continuous",
        "subtitle": "Resolution of Identity · Wavefunctions · Fourier Transform",
        "track": "Computational <-> Mathematical Dual-Track — Lecture 2",
        "pacing": [
            "0-20 min: Discrete ONB; <e_i|e_j>=delta_ij; I=sum|e_i><e_i|; basis changes via unitary matrices",
            "20-45 min: Continuous bases: x|x>=x|x>; <x|x'>=delta(x-x'); I=integral dx|x><x|; psi(x)=<x|psi>",
            "45-70 min: Momentum representation psi(p)=<p|psi>; <x|p>=exp(ipx/hbar)/sqrt(2pi hbar); Fourier transform",
            "70-90 min: Dirac delta distribution: properties, Fourier representation; over-completeness preview",
        ],
        "outcomes": [
            "Use the resolution of identity in discrete and continuous forms to evaluate any bracket",
            "Derive the wavefunction psi(x)=<x|psi> as a projection onto the position basis",
            "Perform basis changes between position and momentum representations via Fourier transforms",
            "Manipulate delta functions and understand their distributional nature",
        ],
        "tiers": {
            "hs":    "'Snapshots in different languages' — why psi(x) is just one way to describe the same state",
            "begug": "Compute psi(x) from a discrete-basis ket; evaluate simple Fourier transforms; use delta-function properties",
            "advug": "Prove Parseval-Plancherel from completeness; handle delta(x) carefully in operator matrix elements",
            "msc":   "Distribution theory; generalised eigenvectors; Fourier transform as unitary map on L^2(R)",
            "phd":   "Gel'fand triple Phi subset L^2 subset Phi'; nuclear spectral theorem; coherent states and frame theory",
        },
        "keyFormulas": [
            "I = sum_i |e_i><e_i|  (discrete completeness)",
            "I = integral dx |x><x|  (continuous completeness)",
            "psi(x) = <x|psi>  (wavefunction as projection)",
            "<x|p> = exp(ipx/hbar)/sqrt(2pi hbar)  (position-momentum overlap)",
            "psi_tilde(p) = integral exp(-ipx/hbar)/sqrt(2pi hbar) psi(x) dx  (Fourier transform)",
            "integral delta(x-x0) f(x) dx = f(x0)  (sifting property)",
        ],
        "concepts": [
            "What is the resolution of identity and why is it called 'completeness'?",
            "True/False: <x|x'>=delta(x-x') means position eigenstates are normalisable. Justify.",
            "How is the Fourier transform a unitary change of basis?",
            "What is psi(x)=<x|psi> geometrically — what does it mean?",
            "True/False: The momentum eigenstate |p> is square-integrable. Justify.",
            "Insert identity twice to convert <x|A^2|psi> into position-space integrals.",
            "What is the Dirac delta distribution — not a function but a...?",
            "Compare discrete vs. continuous completeness relations. What fundamentally changes?",
        ],
        "assessment": {
            "setA": "Compute psi(x) and psi-tilde(p) for Gaussian and square-well states; evaluate <x|p-hat|psi> via completeness",
            "setB": "Prove Fourier transform is unitary on L^2; delta-function identities and distributional derivatives",
        },
        "prev": "L01 — Pure/Mixed States and the Density Matrix",
        "next": "L03 — Uncertainty and Commutation Relations",
    },
    {
        "code": "L03", "num": 3,
        "title": "Uncertainty and Commutation Relations",
        "subtitle": "Robertson Inequality · CSCO · Quantum Zeno Effect",
        "track": "Physical <-> Mathematical Dual-Track — Lecture 3",
        "pacing": [
            "0-20 min: Commutators as algebraic fingerprint; [x,p]=i hbar; Jacobi identity",
            "20-45 min: Robertson inequality Delta_A * Delta_B >= (1/2)|<[A,B]>| via Cauchy-Schwarz",
            "45-65 min: CCRs [x_i,p_j]=i hbar delta_ij; Stone-von Neumann (statement); CSCO",
            "65-90 min: Compatible/incompatible measurements; projection postulate; Zeno effect; Delta_E Delta_t",
        ],
        "outcomes": [
            "Derive Robertson's uncertainty inequality from the Cauchy-Schwarz inequality",
            "Evaluate commutators for polynomial functions of x and p",
            "Define a complete set of commuting observables (CSCO) and explain how it labels states uniquely",
            "Distinguish compatible from incompatible observables and their measurement implications",
        ],
        "tiers": {
            "hs":    "'You cannot know both position and momentum exactly' — why it is NOT about clumsy measurements",
            "begug": "Compute [x,p^2], [x^2,p] from CCR; evaluate Delta_x * Delta_p for a Gaussian wavepacket",
            "advug": "Full derivation of Robertson inequality; saturation conditions; prove [A,B]=0 <=> common eigenbasis",
            "msc":   "Schrodinger's stronger uncertainty relation; CSCO for hydrogen; Stone-von Neumann theorem",
            "phd":   "Weyl form of CCR; non-equivalent representations; quantum Zeno rigorously; entropic uncertainty",
        },
        "keyFormulas": [
            "[x,p] = i hbar  (canonical commutation relation)",
            "(Delta A)^2 = <A^2> - <A>^2  (variance)",
            "Delta_A * Delta_B >= (1/2)|<[A,B]>|  (Robertson inequality)",
            "Saturation: |delta A|psi> = i lambda |delta B|psi>  (minimum uncertainty)",
            "[A,B]=0 <=> simultaneous eigenbasis exists  (compatibility)",
            "CSCO: {A_1, A_2, ...} mutually commuting, labels states uniquely",
        ],
        "concepts": [
            "Why does [A,B]!=0 imply A and B cannot be simultaneously sharp?",
            "True/False: The uncertainty principle is a statement about measurement disturbance. Justify.",
            "State the Robertson inequality and identify when it is saturated.",
            "What is a CSCO and why does hydrogen need three quantum numbers (n,l,m)?",
            "True/False: If [A,B]=0, both operators share at least one common eigenvector. Justify.",
            "Explain the quantum Zeno effect in one sentence.",
            "Compute [x^2, p] using [x,p]=i hbar.",
            "What is the energy-time uncertainty relation and why is Delta_t not an operator?",
        ],
        "assessment": {
            "setA": "Evaluate commutators; compute variances for HO eigenstates; verify Robertson inequality numerically",
            "setB": "Derive Robertson inequality from scratch; prove saturation condition; CSCO for 3D central potential",
        },
        "prev": "L02 — Bases: Discrete and Continuous",
        "next": "L04 — Infinitesimal Generators, Symmetries, and Noether's Theorem",
    },
    {
        "code": "L04", "num": 4,
        "title": "Infinitesimal Generators, Symmetries, & Noether",
        "subtitle": "Stone's Theorem · Conservation Laws · Discrete Symmetries",
        "track": "Physical <-> Mathematical Dual-Track — Lecture 4",
        "pacing": [
            "0-20 min: One-parameter unitary groups U(theta)=exp(i theta G); Stone's theorem; generators",
            "20-45 min: [H,G]=0 <=> d<G>/dt=0; conservation in Heisenberg picture = Noether's theorem",
            "45-65 min: Discrete symmetries: parity, charge conjugation, time reversal (anti-unitary); CPT",
            "65-90 min: Symmetry breaking: explicit vs. spontaneous; degenerate ground states; Goldstone modes",
        ],
        "outcomes": [
            "Identify the generator of a given one-parameter unitary group using Stone's theorem",
            "Prove Noether's theorem in quantum mechanics via the Heisenberg equation of motion",
            "Classify discrete symmetries and their representations (unitary vs. anti-unitary)",
            "Distinguish explicit from spontaneous symmetry breaking and describe physical consequences",
        ],
        "tiers": {
            "hs":    "'If physics looks the same after a transformation, something is conserved' — deepest symmetry principle",
            "begug": "Verify [H,p]=0 for translationally invariant H; check parity of simple wavefunctions",
            "advug": "Prove Noether's theorem from Heisenberg EOM; parity selection rules; show Pi x Pi^(-1)=-x",
            "msc":   "Lie algebra generators; structure constants; su(2) algebra; Wigner classification of discrete symmetries",
            "phd":   "Projective representations; central extensions; spontaneous breaking; Goldstone theorem; Wigner-Eckart",
        },
        "keyFormulas": [
            "U(theta) = exp(i theta G)  (one-parameter unitary group)",
            "[H,G]=0 <=> d<G>/dt=0  (Noether's theorem)",
            "Pi x Pi^(-1) = -x,  Pi p Pi^(-1) = -p  (parity action)",
            "T is anti-unitary: T(alpha|psi>) = alpha* T|psi>  (time reversal)",
            "G = -i dU/dtheta at theta=0  (Stone's theorem — generator)",
            "CPT is an exact symmetry of all local QFTs  (CPT theorem)",
        ],
        "concepts": [
            "What does Stone's theorem guarantee about the generator of a unitary group?",
            "State Noether's theorem in quantum mechanics using the Heisenberg equation.",
            "True/False: Time reversal T is a unitary symmetry. Justify.",
            "Why is momentum conservation linked to translation invariance?",
            "What distinguishes explicit symmetry breaking from spontaneous symmetry breaking?",
            "True/False: CPT is violated by the weak interaction. Justify.",
            "Give an example of a system with parity symmetry and one without.",
            "What are Goldstone modes and when do they appear?",
        ],
        "assessment": {
            "setA": "Identify generators for rotations/translations/phase shifts; verify conservation laws; parity of wavefunctions",
            "setB": "Prove Noether's theorem in Heisenberg picture; classify H-atom symmetries; analyse CPT invariance",
        },
        "prev": "L03 — Uncertainty and Commutation Relations",
        "next": "L05 — Time Evolution I: Time-Independent Hamiltonians",
    },
    {
        "code": "L05", "num": 5,
        "title": "Time Evolution I — Time-Independent Hamiltonians",
        "subtitle": "Schrodinger Equation · U(t) · Stationary States · Probability Current",
        "track": "Wave-Mechanics <-> Operator Dual-Track — Lecture 5",
        "pacing": [
            "0-15 min: Time-evolution postulate i hbar d/dt|psi>=H|psi>; linearity and unitarity requirements",
            "15-40 min: Time evolution operator U(t,t0): group property, unitarity; time-independent U=exp(-iHt/hbar)",
            "40-65 min: Stationary states H|E_n>=E_n|E_n>; general solution; expectation values of time-indep operators",
            "65-90 min: Time-reversal T (anti-unitary); Kramers degeneracy; probability current j; continuity equation",
        ],
        "outcomes": [
            "Derive U(t)=exp(-iHt/hbar) from the time-evolution postulate",
            "Evolve an arbitrary initial state by expanding in the energy eigenbasis",
            "Identify and exploit stationary state structure for computing expectation values",
            "Derive the probability current and continuity equation in position representation",
        ],
        "tiers": {
            "hs":    "'The Hamiltonian is the quantum engine of time evolution' — energy eigenstates oscillate simply",
            "begug": "Evolve a two-level system; compute <sigma_z>(t); derive Rabi oscillation frequency",
            "advug": "Full derivation of U; probability current; prove unitarity of exp(-iHt/hbar) for Hermitian H",
            "msc":   "Time-reversal symmetry; Kramers degeneracy proof for half-integer spin; Stone's theorem connection",
            "phd":   "Stone's theorem and generator domain; self-adjoint extensions; Zeno paradox and its resolution",
        },
        "keyFormulas": [
            "i hbar d/dt|psi(t)> = H|psi(t)>  (TDSE)",
            "U(t) = exp(-iHt/hbar)  (time-independent H)",
            "|psi(t)> = sum_n c_n exp(-iE_n t/hbar)|E_n>  (general solution)",
            "j = (hbar/2mi)(psi* grad psi - psi grad psi*)  (probability current)",
            "d/dt|psi|^2 + div j = 0  (continuity equation)",
            "Kramers: T^2=-1 => at least 2-fold degeneracy",
        ],
        "concepts": [
            "Why must the time-evolution operator be unitary?",
            "True/False: The energy expectation value changes with time for a stationary state. Justify.",
            "What is the group property of U(t,t0) and what does it imply physically?",
            "Derive the time derivative of <A> for a time-independent operator A.",
            "True/False: T is a unitary operator. Justify (hint: T involves complex conjugation).",
            "What is Kramers degeneracy and when does it occur?",
            "Write the continuity equation for probability density and identify each term.",
            "How does the position-space Schrodinger equation emerge from the abstract TDSE?",
        ],
        "assessment": {
            "setA": "Evolve superposition states; compute <E>(t), <x>(t); derive probability current for plane waves",
            "setB": "Prove group property of U; unitarity; derive continuity equation; analyse Kramers degeneracy",
        },
        "prev": "L04 — Generators, Symmetries, and Noether's Theorem",
        "next": "L06 — Time Evolution II: Time-Dependent Hamiltonians",
    },
    {
        "code": "L06", "num": 6,
        "title": "Time Evolution II — Time-Dependent Hamiltonians",
        "subtitle": "Dyson Series · Magnus Expansion · Floquet Preview",
        "track": "Physical <-> Mathematical Dual-Track — Lecture 6",
        "pacing": [
            "0-20 min: Failure of exp(-iHt/hbar) when [H(t1),H(t2)]!=0; integral equation; iterative solution",
            "20-45 min: Time-ordered exponential T exp(-i/hbar integral H dt'); first and second order terms",
            "45-65 min: Piecewise-constant approximation; product formula; Trotter-Suzuki and quantum simulation",
            "65-90 min: Magnus expansion Omega_1, Omega_2,...; unitarity preservation; convergence; Berry phase preview",
        ],
        "outcomes": [
            "Derive the Dyson series for a time-dependent Hamiltonian from the integral equation",
            "Write the time-ordered exponential and evaluate its first two terms explicitly",
            "Explain why the Magnus expansion preserves unitarity while the Dyson series does not term-by-term",
            "Apply the piecewise-constant approximation to a simple driven system",
        ],
        "tiers": {
            "hs":    "'When the Hamiltonian changes in time, the future depends on the full history' — spinning top analogy",
            "begug": "First-order Dyson term; transition probability formula; numerical piecewise evolution for a qubit",
            "advug": "Full Dyson series derivation; prove time-ordering is necessary; compute Omega_1 and Omega_2 of Magnus",
            "msc":   "Magnus convergence; Trotter-Suzuki error; connection to quantum simulation circuits",
            "phd":   "Magnus in Lie algebraic language; Floquet theory for periodic H(t); geometric phases",
        },
        "keyFormulas": [
            "U = T exp(-i/hbar integral H(t') dt')  (Dyson / time-ordered)",
            "U^(1) = -(i/hbar) integral H(t') dt'  (first Dyson term)",
            "Omega_1(t) = -(i/hbar) integral H(t') dt'  (first Magnus cumulant)",
            "Omega_2 = -(1/2hbar^2) double_integral [H(t'),H(t'')] dt' dt''  (second cumulant)",
            "U approx exp(Omega_1 + Omega_2 + ...)  (Magnus — exactly unitary)",
            "U_Trotter approx product_k exp(-iH(t_k) Delta_t/hbar)  (Trotter-Suzuki)",
        ],
        "concepts": [
            "Why does exp(-iHt/hbar) fail when the Hamiltonian is time-dependent?",
            "What does the time-ordering operator T do to a product of operators?",
            "True/False: Each term in the Dyson series is individually unitary. Justify.",
            "Why does the Magnus expansion preserve unitarity term-by-term?",
            "What is the physical meaning of the first Magnus cumulant Omega_1?",
            "True/False: The Trotter product formula is exact for all step sizes Delta_t. Justify.",
            "State one physical context where time-dependent Hamiltonians are essential.",
            "How does the Magnus expansion connect to Floquet theory for periodic H(t)?",
        ],
        "assessment": {
            "setA": "Compute first-order Dyson term for oscillating H; piecewise evolution of a qubit; transition probability",
            "setB": "Derive Dyson series from integral equation; prove Omega_1 of Magnus; convergence criterion application",
        },
        "prev": "L05 — Time Evolution I: Time-Independent Hamiltonians",
        "next": "L07 — Pictures of QM and the Heisenberg Picture",
    },
    {
        "code": "L07", "num": 7,
        "title": "Pictures of QM and the Heisenberg Picture",
        "subtitle": "Heisenberg EOM · Ehrenfest Theorem · Canonical Quantisation",
        "track": "Physical <-> Algebraic Dual-Track — Lecture 7",
        "pacing": [
            "0-15 min: Picture equivalence — physical predictions are picture-independent; S-picture reviewed",
            "15-40 min: Heisenberg picture: A_H(t)=U-dagger A U; Heisenberg EOM dA_H/dt=(i/hbar)[H,A_H]+(dA/dt)_H",
            "40-65 min: Ehrenfest d<x>/dt=<p>/m; virial theorem; constants of motion [H,A]=0 => dA_H/dt=0",
            "65-90 min: Canonical quantisation: Poisson brackets -> commutators; Dirac's rule; ordering ambiguities",
        ],
        "outcomes": [
            "Transform operators and states between the Schrodinger and Heisenberg pictures",
            "Derive and apply the Heisenberg equation of motion",
            "Prove and use Ehrenfest's theorem and the virial theorem",
            "Apply Dirac's canonical quantisation rule and identify operator ordering issues",
        ],
        "tiers": {
            "hs":    "'In one picture the states move, in the other the clocks move' — active vs. passive view",
            "begug": "Transform x(t) and p(t) for harmonic oscillator; verify Ehrenfest's theorem numerically",
            "advug": "Full derivation of Heisenberg EOM; virial theorem proof; solve x_H(t) and p_H(t) for quadratic V",
            "msc":   "Dirac quantisation rule; Weyl ordering; connection to classical integrability and action-angle variables",
            "phd":   "Algebraic QM; Heisenberg picture in C*-algebra language; Moyal bracket and Wigner function",
        },
        "keyFormulas": [
            "A_H(t) = U-dagger(t) A_S U(t)  (Heisenberg picture operator)",
            "dA_H/dt = (i/hbar)[H,A_H] + (dA/dt)_H  (Heisenberg EOM)",
            "d<x>/dt = <p>/m  (Ehrenfest theorem I)",
            "d<p>/dt = -<grad V>  (Ehrenfest theorem II)",
            "{f,g}_PB -> [f,g]/(i hbar)  (Dirac's quantisation rule)",
            "2<T> = <x cdot grad V>  (virial theorem)",
        ],
        "concepts": [
            "What is invariant across all pictures of quantum mechanics?",
            "Write the Heisenberg EOM for x_H(t) in a harmonic potential V=m omega^2 x^2/2.",
            "True/False: The Heisenberg-picture state ket is time-dependent. Justify.",
            "State Ehrenfest's theorem and identify when it reduces to Newton's second law.",
            "What is the quantum analogue of a classical constant of motion?",
            "True/False: Canonical quantisation is unique — there is no ordering ambiguity. Justify.",
            "Compute x_H(t) for a free particle (V=0) using the Heisenberg EOM.",
            "What is the virial theorem and in what systems is it most useful?",
        ],
        "assessment": {
            "setA": "Solve Heisenberg EOM for HO; compute <x>(t) and <p>(t); verify Ehrenfest for cubic potential",
            "setB": "Prove virial theorem; apply canonical quantisation to a classical system; ordering ambiguities for x^2 p",
        },
        "prev": "L06 — Time Evolution II: Time-Dependent Hamiltonians",
        "next": "L08 — The Dirac (Interaction) Picture",
    },
    {
        "code": "L08", "num": 8,
        "title": "The Dirac (Interaction) Picture",
        "subtitle": "S-Matrix · Dyson Series in IP · Three-Picture Comparison",
        "track": "Physical <-> Mathematical Dual-Track — Lecture 8",
        "pacing": [
            "0-15 min: Motivation: split H=H0+V(t); use exact H0 dynamics for operators",
            "15-40 min: IP states |psi_I>=exp(iH0t/hbar)|psi_S>; operators V_I=exp(iH0t/hbar)V exp(-iH0t/hbar)",
            "40-65 min: IP propagator U_I; Dyson series in IP; perturbative transition amplitudes; S=U_I(inf,-inf)",
            "65-90 min: Comparison table of all three pictures: states, operators, EOM, preferred use-cases",
        ],
        "outcomes": [
            "Transform states and operators into and out of the interaction picture",
            "Derive the interaction picture Schrodinger equation from the full equation of motion",
            "Write the Dyson series in the interaction picture to any desired order",
            "Connect the S-matrix to the interaction picture propagator and physical scattering amplitudes",
        ],
        "tiers": {
            "hs":    "'Park the easy part in the operators; let the hard part drive the states' — practical bookkeeping",
            "begug": "Transform V=lambda x into IP for HO H0; compute first-order Dyson term for simple perturbation",
            "advug": "Full transformation procedure; Dyson series to second order; prove equivalence of all three pictures",
            "msc":   "S-matrix and cross-sections; optical theorem; Lippmann-Schwinger preview; Feynman diagram structure",
            "phd":   "S-matrix in QFT; adiabatic switching; Gell-Mann-Low theorem; LSZ reduction formula (conceptual)",
        },
        "keyFormulas": [
            "|psi_I(t)> = exp(iH0 t/hbar)|psi_S(t)>  (IP state)",
            "V_I(t) = exp(iH0 t/hbar) V exp(-iH0 t/hbar)  (IP operator)",
            "i hbar d/dt|psi_I> = V_I(t)|psi_I>  (IP Schrodinger equation)",
            "U_I = T exp(-i/hbar integral V_I dt')  (IP propagator)",
            "S = U_I(inf,-inf)  (S-matrix definition)",
            "<f|S|i> = transition amplitude from i to f",
        ],
        "concepts": [
            "What motivates splitting H=H0+V in the interaction picture?",
            "True/False: In the interaction picture, both states and operators are time-dependent. Justify.",
            "How does the IP Schrodinger equation differ from the full Schrodinger equation?",
            "What is the S-matrix physically — what does it encode?",
            "True/False: The S-matrix is unitary if probability is conserved. Justify.",
            "Compare the three pictures: which quantity is time-dependent in each?",
            "Write the first-order term of the Dyson series in the interaction picture.",
            "What is the connection between the S-matrix and measurable cross-sections?",
        ],
        "assessment": {
            "setA": "Transform operators/states to IP; compute first-order transition amplitude for harmonic perturbation",
            "setB": "Derive IP EOM; prove unitarity of S-matrix; second-order Dyson series for constant perturbation",
        },
        "prev": "L07 — Pictures of QM and the Heisenberg Picture",
        "next": "L09 — Perturbation Theory",
    },
    {
        "code": "L09", "num": 9,
        "title": "Perturbation Theory",
        "subtitle": "RSPT · Degenerate PT · Variational Principle · Feynman-Hellmann",
        "track": "Applied <-> Formal Dual-Track — Lecture 9",
        "pacing": [
            "0-20 min: Setup: H=H0+lambda V; perturbative ansatz; non-degenerate case; convergence conditions",
            "20-45 min: RSPT: E_n^(1)=<n0|V|n0>; first-order state correction; second-order energy; breakdown",
            "45-65 min: Degenerate PT: degenerate subspace; block-diagonalise V; secular equation; correct zeroth-order states",
            "65-90 min: Feynman-Hellmann theorem; adiabatic theorem (statement); Ritz variational principle",
        ],
        "outcomes": [
            "Derive first- and second-order energy corrections in non-degenerate RSPT",
            "Compute first-order state corrections and apply them to matrix elements",
            "Handle degenerate perturbation theory by diagonalising V in the degenerate subspace",
            "Apply the Feynman-Hellmann theorem and the Ritz variational principle",
        ],
        "tiers": {
            "hs":    "'A small push changes energy levels slightly' — first-order PT as quantum Taylor expansion for energies",
            "begug": "First-order energy corrections; linear Stark effect for hydrogen n=2 by diagonalisation",
            "advug": "Second-order energy; convergence conditions; full degenerate PT; Feynman-Hellmann proof",
            "msc":   "Kato-Rellich theorem; Brillouin-Wigner PT; Born-Oppenheimer; adiabatic theorem proof sketch",
            "phd":   "Resolvent formalism; Dyson equation for resolvent; divergence of PT series and resummation methods",
        },
        "keyFormulas": [
            "H = H0 + lambda V  (perturbation splitting)",
            "E_n^(1) = <n0|V|n0>  (first-order energy correction)",
            "|n^(1)> = sum_{m!=n} <m0|V|n0>/(E_n0-E_m0) |m0>  (first-order state)",
            "E_n^(2) = sum_{m!=n} |<m0|V|n0>|^2/(E_n0-E_m0)  (second-order energy)",
            "dE_n/dlambda = <n|dH/dlambda|n>  (Feynman-Hellmann theorem)",
            "E0 <= <phi|H|phi>/<phi|phi>  (Ritz variational principle)",
        ],
        "concepts": [
            "What is the expansion parameter lambda in RSPT and when is the perturbation series valid?",
            "True/False: The first-order energy correction is always nonzero. Justify with a counter-example.",
            "Why does degenerate PT require diagonalising V in the degenerate subspace first?",
            "State the Feynman-Hellmann theorem and give one physical application.",
            "True/False: The variational energy is always an overestimate of the ground-state energy. Justify.",
            "What breaks down in non-degenerate PT when two unperturbed levels are nearly degenerate?",
            "Write the secular equation for degenerate PT in a 2-fold degenerate subspace.",
            "How does the Born-Oppenheimer approximation use the adiabatic theorem?",
        ],
        "assessment": {
            "setA": "First-order corrections for anharmonic oscillator lambda x^4; Stark effect; variational bound for helium",
            "setB": "Second-order energy for shifted HO; degenerate PT for n=2 hydrogen; Feynman-Hellmann for HO",
        },
        "prev": "L08 — The Dirac (Interaction) Picture",
        "next": "L10 — Time-Dependent PT, Open Systems, and Many-Body Preview",
    },
    {
        "code": "L10", "num": 10,
        "title": "TDPT, Open Systems, and Many-Body Preview",
        "subtitle": "Fermi's Golden Rule · Lindblad Equation · Decoherence",
        "track": "Applied <-> Structural Dual-Track — Lecture 10",
        "pacing": [
            "0-20 min: TDPT: first-order amplitude c_f(t); transition probability |c_f|^2; sudden and adiabatic limits",
            "20-40 min: Fermi's golden rule: density of states rho(E_f); Gamma=(2pi/hbar)|<f|V|i>|^2 rho(E_f)",
            "40-65 min: Open systems: Lindblad master equation; jump operators L_k; decay channels; dephasing",
            "65-90 min: Decoherence and pointer states; many-body: 2-electron system, exchange, singlet/triplet",
        ],
        "outcomes": [
            "Derive Fermi's golden rule from first-order time-dependent perturbation theory",
            "Write the Lindblad master equation and identify the physical role of each term",
            "Explain decoherence as environment-induced suppression of off-diagonal density matrix elements",
            "Construct two-electron spin states (singlet and triplet) and explain their exchange interaction origin",
        ],
        "tiers": {
            "hs":    "'Open systems as a leaky box' — energy and information escaping to environment; radioactive decay as Fermi's rule",
            "begug": "Compute Gamma for constant perturbation; simple Lindblad evolution (amplitude damping) for a qubit",
            "advug": "Derive Fermi's golden rule; verify Lindblad preserves Tr(rho)=1 and positivity; singlet/triplet construction",
            "msc":   "GKSL theorem and complete positivity; Kraus representation; spin-boson model; Born-Markov approximation",
            "phd":   "Nakajima-Zwanzig projection; non-Markovian dynamics; Floquet-Lindblad; entanglement in many-body systems",
        },
        "keyFormulas": [
            "c_f^(1)(t) = -(i/hbar) integral exp(i omega_fi t')<f|V(t')|i>dt'  (amplitude)",
            "Gamma_{i->f} = (2pi/hbar)|<f|V|i>|^2 rho(E_f)  (Fermi's golden rule)",
            "drho/dt = -(i/hbar)[H,rho] + sum_k(L_k rho L_k-dagger - (1/2){L_k-dagger L_k, rho})  (Lindblad)",
            "Pointer states: [H_env, |ptr><ptr|]=0  (environment selection)",
            "|S=0> = (|up-down> - |down-up>)/sqrt(2)  (singlet — antisymmetric)",
            "|S=1,M=0> = (|up-down> + |down-up>)/sqrt(2)  (triplet — symmetric)",
        ],
        "concepts": [
            "From what approximation does Fermi's golden rule emerge and when is it valid?",
            "True/False: Fermi's golden rule applies only when the final state is discrete. Justify.",
            "What is the physical role of the jump operators L_k in the Lindblad equation?",
            "True/False: The Lindblad equation preserves the trace of the density matrix. Justify.",
            "Explain decoherence in one sentence without using the word 'collapse'.",
            "What is the exchange interaction and why does it arise from antisymmetry alone?",
            "True/False: A triplet spin state is symmetric under particle exchange. Justify.",
            "What is a pointer state and why is it selected by the environment?",
        ],
        "assessment": {
            "setA": "Compute Gamma for atom in oscillating field; simple Lindblad evolution; singlet/triplet state construction",
            "setB": "Derive Fermi's golden rule; prove Lindblad trace-preserving; exchange from antisymmetry of 2e wavefunction",
        },
        "prev": "L09 — Perturbation Theory",
        "next": "L11 — Example Systems and Physical Effects (Module I.3 finale)",
    },
]


# ── Entry point ────────────────────────────────────────────────────────────────
if __name__ == "__main__":
    version = sys.argv[1] if len(sys.argv) > 1 else "v1.0"
    out_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "instructor_sheets")
    os.makedirs(out_dir, exist_ok=True)

    print(f"\n  QM Programme — Module I.3 — Instructor Sheets ({version})")
    print(f"  Output: {out_dir}\n")

    generated = []
    for lec in LECTURES:
        path = build_instructor_sheet(lec, out_dir, version)
        generated.append(path)

    print(f"\n  {len(generated)} sheets generated.\n")
