#!/usr/bin/env bash
#=============================================================
#  build_all.sh — Build all Module I.4 materials
#  Usage: ./scripts/build_all.sh [--latex-only] [--slides-only]
#=============================================================
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# ── Colour output ─────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
ok()   { echo -e "${GREEN}✓${NC} $*"; }
warn() { echo -e "${YELLOW}⚠${NC} $*"; }
err()  { echo -e "${RED}✗${NC} $*"; }

echo "============================================================"
echo "  Module I.4 — Paradigm Physical Systems — Full Build"
echo "  $(date)"
echo "============================================================"

DO_LATEX=true
DO_SLIDES=true

for arg in "$@"; do
  case $arg in
    --latex-only)  DO_SLIDES=false ;;
    --slides-only) DO_LATEX=false  ;;
    *) warn "Unknown argument: $arg" ;;
  esac
done

# ── LaTeX build ───────────────────────────────────────────
if $DO_LATEX; then
  echo ""
  echo "--- LaTeX: master_document.tex ---"
  mkdir -p build/pdf

  if command -v pdflatex &>/dev/null; then
    # Two passes for ToC and cross-references
    pdflatex -interaction=nonstopmode -output-directory=build/pdf master_document.tex \
      > build/pdf/pdflatex_pass1.log 2>&1 && ok "LaTeX pass 1 complete" || {
        warn "LaTeX pass 1 had warnings (check build/pdf/pdflatex_pass1.log)"; }

    pdflatex -interaction=nonstopmode -output-directory=build/pdf master_document.tex \
      > build/pdf/pdflatex_pass2.log 2>&1 && ok "LaTeX pass 2 complete" || {
        warn "LaTeX pass 2 had warnings"; }

    if [[ -f build/pdf/master_document.pdf ]]; then
      ok "PDF written: build/pdf/master_document.pdf"
    else
      err "PDF not produced — check build/pdf/pdflatex_pass2.log"
    fi

    # Per-lecture PDFs
    echo ""
    echo "--- Per-lecture PDFs ---"
    for code in L01 L02 L03 L04 L05 L06 L07 L08 L09 L10 L11 L12; do
      SRC="lectures/${code}/${code}_lecture.tex"
      if [[ -f "$SRC" ]]; then
        # Wrap in standalone document for individual compilation
        TMPFILE=$(mktemp /tmp/lec_XXXXXX.tex)
        cat > "$TMPFILE" << TEXEOF
\\input{preamble.tex}
\\begin{document}
\\input{${SRC}}
\\end{document}
TEXEOF
        pdflatex -interaction=nonstopmode -output-directory=build/pdf "$TMPFILE" \
          > /dev/null 2>&1 && ok "  ${code}.pdf" || warn "  ${code}: LaTeX errors (non-fatal)"
        mv "build/pdf/$(basename $TMPFILE .tex).pdf" "build/pdf/${code}_lecture.pdf" 2>/dev/null || true
        rm -f "$TMPFILE"
      fi
    done

  else
    warn "pdflatex not found — skipping LaTeX build"
    warn "Install TeX Live: https://tug.org/texlive/"
  fi
fi

# ── Slide deck build ──────────────────────────────────────
if $DO_SLIDES; then
  echo ""
  echo "--- PptxGenJS slide decks ---"
  mkdir -p build/pptx

  if command -v node &>/dev/null; then
    # Check pptxgenjs is available
    if node -e "require('pptxgenjs')" 2>/dev/null; then
      node scripts/generate_pptx.js 2>&1 | while IFS= read -r line; do
        echo "  $line"
      done
      # Copy all generated .pptx to build/pptx/
      find slides -name "*.pptx" -exec cp {} build/pptx/ \;
      NPPTX=$(find build/pptx -name "*.pptx" | wc -l)
      ok "${NPPTX} .pptx files written to build/pptx/"
    else
      warn "PptxGenJS not installed — run: npm install -g pptxgenjs"
    fi
  else
    warn "Node.js not found — skipping slide deck build"
    warn "Install Node.js: https://nodejs.org"
  fi
fi

# ── Summary ───────────────────────────────────────────────
echo ""
echo "============================================================"
echo "  Build complete."
echo ""
$DO_LATEX  && echo "  LaTeX:  build/pdf/master_document.pdf"
$DO_SLIDES && echo "  Slides: build/pptx/*.pptx  (12 decks)"
echo ""
echo "  Module I.4 — 12 lectures — 90 min each"
echo "  Five-tier pedagogy (HS → PhD)"
echo "  14-type assessment taxonomy — 92 items/lecture"
echo "============================================================"
