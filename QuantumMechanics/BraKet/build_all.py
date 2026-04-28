#!/usr/bin/env python3
"""
build_all.py
============
Master build orchestrator for the QM Bra-Ket course.

Usage
-----
    # Build everything
    python3 build_all.py

    # Build a single lecture
    python3 build_all.py --lecture L03

    # Build only the syllabus PDF
    python3 build_all.py --syllabus-only

    # Skip formula rendering (use cached PNGs)
    python3 build_all.py --no-formulas

    # Clean build outputs
    python3 build_all.py --clean

Output
------
    build/
      QM_Syllabus.pdf
      L01/
        L01.pptx
        formulas/       (PNG formula images, cached)
        lecture_data.json
      L02/ … L12/

Build pipeline per lecture
--------------------------
    1. Python: export design_tokens.json    (once, shared)
    2. Python: render formula PNGs          (LatexRenderer, per-lecture)
    3. Python: write lecture_data.json      (from lecture_data.py metadata)
    4. Node.js: build_lecture.js            (reads JSON, writes PPTX)
    5. Python: build_syllabus.py            (ReportLab PDF)
"""

import os
import sys
import json
import shutil
import argparse
import subprocess
from pathlib import Path

ROOT = Path(__file__).parent
BUILD_DIR = ROOT / "build"
SHARED_DIR = ROOT / "shared"

sys.path.insert(0, str(ROOT))
from shared.lecture_data import LECTURES, export_design_json
from shared.latex_renderer import LatexRenderer


# ── helpers ───────────────────────────────────────────────────────────────────

def log(msg: str):
    print(f"  {msg}", flush=True)

def banner(msg: str):
    w = 60
    print("\n" + "─"*w)
    print(f"  {msg}")
    print("─"*w, flush=True)


# ── step 1: export design tokens for Node.js ─────────────────────────────────

def step_export_tokens():
    path = str(SHARED_DIR / "design_tokens.json")
    export_design_json(path)
    log(f"Design tokens → {path}")


# ── step 2: render formulas for one lecture ──────────────────────────────────

def step_render_formulas(lec: dict, lecture_build_dir: Path):
    formulas_dir = lecture_build_dir / "formulas"
    renderer = LatexRenderer(str(formulas_dir), dpi=300)
    results = renderer.render_batch(lec.get("formulas", {}), max_workers=4)
    ok = sum(1 for p in results.values() if Path(p).stat().st_size > 1000)
    log(f"Rendered {ok}/{len(results)} formula images via pdflatex → {formulas_dir}")
    return str(formulas_dir)


# ── step 3: write lecture JSON for Node.js ───────────────────────────────────

def step_write_lecture_json(lec: dict, lecture_build_dir: Path) -> str:
    json_path = str(lecture_build_dir / "lecture_data.json")
    with open(json_path, "w") as f:
        json.dump(lec, f, indent=2, ensure_ascii=False)
    log(f"Lecture JSON → {json_path}")
    return json_path


# ── step 4: run Node.js PPTX builder ─────────────────────────────────────────

def step_build_pptx(json_path: str, formulas_dir: str,
                    lecture_build_dir: Path, num: str) -> Path:
    out_path = lecture_build_dir / f"{num}.pptx"
    builder  = str(SHARED_DIR / "build_lecture.js")
    cmd = [
        "node", builder,
        "--data",     json_path,
        "--out",      str(out_path),
        "--formulas", formulas_dir,
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, cwd=str(ROOT))
    if result.returncode != 0:
        print(f"[ERROR] Node.js build failed for {num}:\n{result.stderr}")
        raise RuntimeError(f"PPTX build failed: {num}")
    if result.stdout.strip():
        log(result.stdout.strip())
    return out_path


# ── step 5: build syllabus PDF ────────────────────────────────────────────────

def step_build_syllabus(out_path: Path):
    syllabus_builder = str(ROOT / "syllabus" / "build_syllabus.py")
    result = subprocess.run(
        [sys.executable, syllabus_builder, "--out", str(out_path)],
        capture_output=True, text=True, cwd=str(ROOT)
    )
    if result.returncode != 0:
        print(f"[ERROR] Syllabus build failed:\n{result.stderr}")
        raise RuntimeError("Syllabus build failed")
    if result.stdout.strip():
        log(result.stdout.strip())


# ── build one lecture ─────────────────────────────────────────────────────────

def build_lecture(lec: dict, render_formulas: bool = True):
    num = lec["num"]
    banner(f"Building {num}: {lec['title']}")

    lecture_build_dir = BUILD_DIR / num
    lecture_build_dir.mkdir(parents=True, exist_ok=True)

    # 2. formulas
    if render_formulas:
        formulas_dir = step_render_formulas(lec, lecture_build_dir)
    else:
        formulas_dir = str(lecture_build_dir / "formulas")
        log(f"Skipping formula render (--no-formulas); using cache at {formulas_dir}")

    # 3. JSON
    json_path = step_write_lecture_json(lec, lecture_build_dir)

    # 4. PPTX
    pptx_path = step_build_pptx(json_path, formulas_dir, lecture_build_dir, num)
    log(f"✓ PPTX: {pptx_path}")
    return pptx_path


# ── clean ─────────────────────────────────────────────────────────────────────

def do_clean():
    if BUILD_DIR.exists():
        shutil.rmtree(BUILD_DIR)
        print(f"Cleaned: {BUILD_DIR}")
    else:
        print("Nothing to clean.")


# ── main ──────────────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(
        description="QM Bra-Ket Course — master build orchestrator",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument("--lecture",       help="Build only this lecture (e.g. L03)")
    ap.add_argument("--syllabus-only", action="store_true", help="Build only the syllabus PDF")
    ap.add_argument("--no-formulas",   action="store_true", help="Skip formula rendering")
    ap.add_argument("--clean",         action="store_true", help="Remove build/ directory and exit")
    args = ap.parse_args()

    if args.clean:
        do_clean()
        return

    BUILD_DIR.mkdir(parents=True, exist_ok=True)
    banner("QM Bra-Ket Course — Build System")

    # Step 1: always export design tokens
    step_export_tokens()

    if args.syllabus_only:
        banner("Building Syllabus PDF only")
        step_build_syllabus(BUILD_DIR / "QM_Syllabus.pdf")
        return

    if args.lecture:
        # single lecture
        num = args.lecture.upper()
        lec_map = {l["num"]: l for l in LECTURES}
        if num not in lec_map:
            print(f"[ERROR] Unknown lecture '{num}'. Valid: {list(lec_map)}")
            sys.exit(1)
        build_lecture(lec_map[num], render_formulas=not args.no_formulas)
    else:
        # all lectures
        pptx_paths = []
        for lec in LECTURES:
            p = build_lecture(lec, render_formulas=not args.no_formulas)
            pptx_paths.append(p)

        # also build syllabus
        banner("Building Syllabus PDF")
        step_build_syllabus(BUILD_DIR / "QM_Syllabus.pdf")

        banner("Build Summary")
        for p in pptx_paths:
            log(f"✓ {p}")
        log(f"✓ {BUILD_DIR / 'QM_Syllabus.pdf'}")

    banner("Done")


if __name__ == "__main__":
    main()


# ── Extended build: expanded L01 + homework PDFs ──────────────────────────────

def build_L01_expanded():
    """Build the full expanded L01 deck and homework PDFs."""
    import subprocess, json
    from pathlib import Path

    sys.path.insert(0, str(ROOT))
    from L01.lecture_content import L01_FULL
    from shared.build_homework import build_homework_pdfs
    from shared.latex_renderer import LatexRenderer

    lec_dir = BUILD_DIR / "L01"
    lec_dir.mkdir(parents=True, exist_ok=True)

    # Write JSON for Node.js
    json_path = lec_dir / "lecture_content.json"
    with open(json_path, "w") as f:
        json.dump(L01_FULL, f, indent=2, ensure_ascii=False)
    print(f"  Lecture content JSON → {json_path}")

    # Render formulas (reuse cache)
    frm_dir = lec_dir / "formulas"
    frm_dir.mkdir(exist_ok=True)
    renderer = LatexRenderer(str(frm_dir))
    renderer.render_batch(L01_FULL.get("formulas", {}))

    # Build expanded PPTX
    builder = str(ROOT / "L01" / "build_expanded.js")
    result = subprocess.run(["node", builder], capture_output=True, text=True, cwd=str(ROOT))
    if result.returncode != 0:
        print(f"[WARN] Expanded PPTX: {result.stderr[:200]}")
    else:
        print(f"  ✓ Expanded PPTX: {lec_dir / 'L01_expanded.pptx'}")

    # Build homework PDFs
    hw_dir = lec_dir / "homework"
    build_homework_pdfs(L01_FULL, str(hw_dir), str(frm_dir))
