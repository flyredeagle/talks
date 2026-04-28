#!/usr/bin/env bash
# ============================================================
# build.sh — Generate all Module I.1 lecture decks
# Usage: bash scripts/build.sh
# ============================================================

set -e

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SRC="$REPO_ROOT/src/generate_lectures.js"
OUT="$REPO_ROOT/generated"

echo "=============================================="
echo "  QM Module I.1 — Lecture Deck Generator"
echo "=============================================="
echo ""

# Check Node.js
if ! command -v node &>/dev/null; then
  echo "ERROR: Node.js is not installed. Please install Node.js v18+."
  exit 1
fi

NODE_VERSION=$(node -e "process.stdout.write(process.version)")
echo "Node.js: $NODE_VERSION"

# Install deps if needed
if [ ! -d "$REPO_ROOT/node_modules" ]; then
  echo "Installing dependencies..."
  cd "$REPO_ROOT" && npm install --silent
fi

# Ensure output directory exists
mkdir -p "$OUT"

# Run generator
echo ""
echo "Generating lecture decks..."
echo ""
node "$SRC"

echo ""
echo "Output files:"
ls -lh "$OUT"/*.pptx 2>/dev/null || echo "  (none found)"

echo ""
echo "Done. Files written to: $OUT/"

# PDF generation (requires Python 3 + reportlab)
generate_pdfs() {
  echo ""
  echo "Generating PDF assessment sheets..."
  if ! python3 -c "import reportlab" 2>/dev/null; then
    echo "Installing reportlab..."
    pip install reportlab --break-system-packages -q
  fi
  mkdir -p "$REPO_ROOT/pdf_sheets"
  cd "$REPO_ROOT" && python3 src/generate_pdfs.py
  echo ""
  echo "PDF output:"
  ls -lh "$REPO_ROOT/pdf_sheets/"*.pdf 2>/dev/null | head -10
  echo "  (and more — $(ls "$REPO_ROOT/pdf_sheets/"*.pdf 2>/dev/null | wc -l) total)"
}

if [[ "${1:-}" == "--pdf" ]]; then
  generate_pdfs
fi
