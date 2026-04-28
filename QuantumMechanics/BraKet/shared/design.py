"""
shared/design.py
================
Central design tokens for the QM Bra-Ket course deck system.
Import this from any lecture builder or the syllabus builder.
All colours are 6-char hex strings (no '#') for PptxGenJS compatibility.
"""

# ── Colour palette ────────────────────────────────────────────────────────────
C = {
    "bg":       "0A0E1A",   # deep navy background
    "bgCard":   "111827",   # card / panel background
    "bgAlt":    "131C2E",   # alternating row background
    "accent1":  "6366F1",   # indigo  – primary
    "accent2":  "A78BFA",   # violet  – secondary
    "accent3":  "34D399",   # emerald – success / highlight
    "accent4":  "F59E0B",   # amber   – warning / callout
    "accent5":  "38BDF8",   # sky     – extra
    "accent6":  "FB7185",   # rose    – extra
    "text":     "F1F5F9",   # near-white main text
    "textSub":  "94A3B8",   # slate-400 sub-text
    "textDim":  "475569",   # slate-600 dim text
    "divider":  "1E2A3A",   # subtle divider lines
    # level badge colours
    "hs":       "FCD34D",   # yellow – High School
    "begug":    "6EE7B7",   # green  – Beginning UG
    "advug":    "93C5FD",   # blue   – Advanced UG
    "msc":      "C4B5FD",   # purple – Master's
    "phd":      "F87171",   # red    – PhD
}

# ── Typography ────────────────────────────────────────────────────────────────
FONT_HEAD = "Calibri"
FONT_BODY = "Calibri"

# ── Slide dimensions (LAYOUT_WIDE, inches) ───────────────────────────────────
W = 13.3
H = 7.5

# ── Level metadata ────────────────────────────────────────────────────────────
LEVELS = [
    ("HS",    C["hs"]),
    ("BegUG", C["begug"]),
    ("AdvUG", C["advug"]),
    ("MSc",   C["msc"]),
    ("PhD",   C["phd"]),
]

# ── Matplotlib formula render settings ───────────────────────────────────────
FORMULA_DPI        = 200
FORMULA_FONTSIZE   = 18          # pt for standalone formula images
FORMULA_BG         = "#0A0E1A"  # match slide background
FORMULA_FG         = "#F1F5F9"  # near-white text
FORMULA_PAD        = 0.15        # inches padding around formula

# ── Per-lecture accent colours (cycles through accents) ──────────────────────
LECTURE_ACCENTS = [
    C["accent1"],  # L01
    C["accent2"],  # L02
    C["accent3"],  # L03
    C["accent4"],  # L04
    C["accent5"],  # L05
    C["accent6"],  # L06
    C["accent1"],  # L07
    C["accent3"],  # L08
    C["accent2"],  # L09
    C["accent4"],  # L10
    C["accent5"],  # L11
    C["accent6"],  # L12
]
