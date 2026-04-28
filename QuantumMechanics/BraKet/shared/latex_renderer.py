"""
shared/latex_renderer.py  --  Full LaTeX engine for QM course formula images.

Pipeline per formula:
  1. Build standalone LaTeX doc (amsmath / physics / mathtools / braket / xcolor)
  2. pdflatex  ->  .pdf   (dark bg #0A0E1A, white text #F1F5F9)
  3. pdftoppm  ->  .png   (300 dpi)
  4. PIL crop  ->  tight-trimmed PNG with uniform padding

Two critical fixes that make pdflatex reliable:
  A) Always wrap math as  $displaystyle ...$  not  [...]
     Reason: after pagecolor+color, standalone is in text-mode.
     The [ environment triggers a mode conflict -> exit-1 -> fallback.
     Dollar-sign math works in text-mode and is visually identical.
  B) Use providecommand for any macro physics/braket already define (ketbra etc.)
     Reason: newcommand raises an error if the name is taken.

Thread-safe disk cache keyed by MD5 of source.
Parallel batch rendering via ThreadPoolExecutor.
Transparent matplotlib fallback if pdflatex fails.
"""

from __future__ import annotations

import hashlib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import threading
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path

try:
    from PIL import Image
    import numpy as np
    _PIL = True
except ImportError:
    _PIL = False

# ── design tokens ──────────────────────────────────────────────────────────────
_ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(_ROOT))
from shared.design import FORMULA_BG, FORMULA_FG

_BG  = FORMULA_BG.lstrip("#")   # "0A0E1A"
_FG  = FORMULA_FG.lstrip("#")   # "F1F5F9"
_DPI = 300
_PAD = 20   # extra pixels around trimmed content

# ── LaTeX preamble (built as a plain concatenated string) ─────────────────────
_PREAMBLE = "\n".join([
    r"\documentclass[14pt,border=12pt]{standalone}",
    r"\usepackage{amsmath}",
    r"\usepackage{amssymb}",
    r"\usepackage{bm}",
    r"\usepackage{physics}",
    r"\usepackage{mathtools}",
    r"\usepackage{braket}",
    r"\usepackage[dvipsnames,svgnames]{xcolor}",
    r"\usepackage{relsize}",
    r"\pagecolor[HTML]{" + _BG + "}",
    r"\color[HTML]{" + _FG + "}",
    # providecommand silently skips if the name is already defined
    r"\providecommand{\ketbra}[2]{|#1\rangle\langle #2|}",
    r"\providecommand{\myone}{\hat{I}}",
    r"\begin{document}",
    "",
])

_SUFFIX = "\n" + r"\end{document}" + "\n"


# ── math wrapping ──────────────────────────────────────────────────────────────
def _wrap(expr: str) -> str:
    r"""
    Wrap an expression for placement in the standalone document body.

    Always produces   $\displaystyle ...$
    (never  \[...\]  which triggers a LaTeX mode-stack error after \color).

    Input formats accepted:
      "$...$"             ->  inject \displaystyle, keep dollar delimiters
      "\[...\]"           ->  strip brackets, inject \displaystyle, add dollars
      "\begin{align*}..."  ->  wrap in $\displaystyle\begin...\end$
      bare expression     ->  prepend $\displaystyle, append $
    """
    s = expr.strip()

    # already dollar-delimited
    if s.startswith("$") and s.endswith("$"):
        inner = s[1:-1].strip()
        if not inner.startswith(r"\displaystyle"):
            inner = r"\displaystyle " + inner
        return "$" + inner + "$"

    # display brackets  \[ ... \]
    if s.startswith(r"\[") and s.endswith(r"\]"):
        inner = s[2:-2].strip()
        if not inner.startswith(r"\displaystyle"):
            inner = r"\displaystyle " + inner
        return "$" + inner + "$"

    # begin environment  \begin{align*} ... \end{align*}
    if s.startswith(r"\begin"):
        return r"$\displaystyle " + s + "$"

    # bare expression
    return r"$\displaystyle " + s + "$"


# ── PIL tight-crop ─────────────────────────────────────────────────────────────
def _trim(path: str) -> None:
    """Crop the background colour and re-add uniform padding."""
    if not _PIL:
        return
    img  = Image.open(path).convert("RGBA")
    arr  = np.array(img)
    br   = int(_BG[0:2], 16)
    bg_  = int(_BG[2:4], 16)
    bb   = int(_BG[4:6], 16)
    mask = ~((arr[:, :, 0] == br) & (arr[:, :, 1] == bg_) & (arr[:, :, 2] == bb))
    rows = np.any(mask, axis=1)
    cols = np.any(mask, axis=0)
    if not rows.any():
        return
    r0 = max(0,              int(np.where(rows)[0][0])  - _PAD)
    r1 = min(arr.shape[0]-1, int(np.where(rows)[0][-1]) + _PAD)
    c0 = max(0,              int(np.where(cols)[0][0])  - _PAD)
    c1 = min(arr.shape[1]-1, int(np.where(cols)[0][-1]) + _PAD)
    img.crop((c0, r0, c1 + 1, r1 + 1)).save(path)


# ── matplotlib fallback ────────────────────────────────────────────────────────
def _mpl_fallback(expr: str, path: str) -> None:
    """Render via matplotlib mathtext when pdflatex is unavailable or fails."""
    try:
        import matplotlib
        matplotlib.use("Agg")
        import matplotlib.pyplot as plt

        s = expr.strip()
        # strip display-math wrappers unsupported by mathtext
        if s.startswith(r"\[") and s.endswith(r"\]"):
            s = "$" + s[2:-2].strip() + "$"
        elif s.startswith(r"\begin"):
            s = "$" + s + "$"
        if not (s.startswith("$") and s.endswith("$")):
            s = "$" + s + "$"
        s = re.sub(r"\\displaystyle\s*", "", s)

        fig, ax = plt.subplots(figsize=(0.1, 0.1))
        fig.patch.set_facecolor(f"#{_BG}")
        ax.set_facecolor(f"#{_BG}")
        ax.axis("off")
        ax.text(0, 0, s, fontsize=18, color=f"#{_FG}",
                ha="left", va="bottom", transform=ax.transAxes)
        fig.savefig(path, dpi=200, bbox_inches="tight",
                    pad_inches=0.12, facecolor=f"#{_BG}")
        plt.close(fig)
    except Exception:
        if _PIL:
            Image.new("RGBA", (400, 60), (10, 14, 26, 255)).save(path)


# ── slug helper ────────────────────────────────────────────────────────────────
def _slug(text: str, maxlen: int = 48) -> str:
    s = re.sub(r"[^a-zA-Z0-9]+", "_", text).strip("_")[:maxlen]
    h = hashlib.md5(text.encode()).hexdigest()[:6]
    return f"{s}_{h}" if s else h


# ══════════════════════════════════════════════════════════════════════════════
class LatexRenderer:
    """
    Thread-safe pdflatex -> PNG renderer with disk cache.

    Parameters
    ----------
    output_dir : str or Path
        Directory where PNGs and cache.json are written.
    dpi : int, default 300
        Render resolution. Values below 300 are silently raised to 300.
    engine : str, default 'pdflatex'
        LaTeX engine binary: 'pdflatex' | 'xelatex' | 'lualatex'.
    timeout : int, default 30
        Seconds before the engine subprocess is killed.
    """

    def __init__(
        self,
        output_dir,
        dpi: int    = 300,
        engine: str = "pdflatex",
        timeout: int = 30,
    ):
        self.out     = Path(output_dir)
        self.out.mkdir(parents=True, exist_ok=True)
        self.dpi     = max(dpi, _DPI)
        self.engine  = engine
        self.timeout = timeout
        self._cp     = self.out / "cache.json"
        self._lock   = threading.Lock()
        self._cache: dict = {}
        self._load()

    # ── cache helpers ──────────────────────────────────────────────────────────
    def _load(self) -> None:
        if self._cp.exists():
            try:
                self._cache = json.loads(self._cp.read_text())
            except Exception:
                self._cache = {}

    def _save(self) -> None:
        self._cp.write_text(json.dumps(self._cache, indent=2))

    def _key(self, expr: str) -> str:
        return hashlib.md5(expr.encode()).hexdigest()

    # ── public: single render ──────────────────────────────────────────────────
    def render(self, expression: str, name: str | None = None) -> str:
        """
        Render one LaTeX expression to a PNG. Returns absolute path.

        expression : str
            Any LaTeX math: dollar-delimited, display brackets, begin-env, or bare.
        name : str, optional
            Human label for the PNG filename.
        """
        key     = self._key(expression)
        slug    = _slug(name or expression)
        out_png = str(self.out / f"{slug}.png")

        with self._lock:
            if key in self._cache and Path(out_png).exists():
                return out_png

        ok = self._run(expression, out_png)
        if not ok:
            _mpl_fallback(expression, out_png)

        with self._lock:
            self._cache[key] = {
                "name":   name,
                "path":   out_png,
                "engine": "pdflatex" if ok else "matplotlib",
            }
            self._save()

        return out_png

    # ── public: batch render ───────────────────────────────────────────────────
    def render_batch(
        self,
        formulas: dict[str, str],
        max_workers: int = 4,
    ) -> dict[str, str]:
        """
        Render multiple formulas in parallel.
        Returns {name: png_path}.
        """
        results: dict[str, str] = {}
        pending: dict[str, str] = {}

        for name, expr in formulas.items():
            slug = _slug(name)
            png  = str(self.out / f"{slug}.png")
            if self._key(expr) in self._cache and Path(png).exists():
                results[name] = png
            else:
                pending[name] = expr

        if not pending:
            return results

        with ThreadPoolExecutor(max_workers=max_workers) as ex:
            futs = {ex.submit(self.render, expr, name): name
                    for name, expr in pending.items()}
            for fut in as_completed(futs):
                nm = futs[fut]
                try:
                    results[nm] = fut.result()
                except Exception as exc:
                    print(f"  [latex] batch error for {nm!r}: {exc}")

        return results

    # ── public: validate a lecture dict ───────────────────────────────────────
    def validate(self, lecture: dict) -> dict[str, bool]:
        """Render every formula in lecture['formulas']; return name -> ok."""
        out = {}
        for name, expr in (lecture.get("formulas") or {}).items():
            png = self.render(expr, name)
            out[name] = Path(png).stat().st_size > 1000
        return out

    # ── public: purge cache ────────────────────────────────────────────────────
    def purge(self) -> None:
        """Delete all cached PNGs and reset the manifest."""
        for p in self.out.glob("*.png"):
            p.unlink()
        self._cache = {}
        if self._cp.exists():
            self._cp.unlink()

    # ── pdflatex pipeline ──────────────────────────────────────────────────────
    def _run(self, expression: str, out_png: str) -> bool:
        """pdflatex -> pdftoppm -> PIL trim. Returns True on success."""
        body   = _wrap(expression)
        source = _PREAMBLE + body + "\n" + _SUFFIX

        with tempfile.TemporaryDirectory(prefix="qm_tex_") as tmp:
            tex = Path(tmp) / "f.tex"
            pdf = Path(tmp) / "f.pdf"
            tex.write_text(source, encoding="utf-8")

            # ── 1. pdflatex ────────────────────────────────────────────────
            try:
                proc = subprocess.run(
                    [self.engine,
                     "-interaction=nonstopmode",
                     "-halt-on-error",
                     str(tex)],
                    cwd=tmp,
                    capture_output=True,
                    timeout=self.timeout,
                )
            except (subprocess.TimeoutExpired, FileNotFoundError):
                return False

            if proc.returncode != 0 or not pdf.exists():
                for ln in proc.stdout.decode(errors="ignore").splitlines():
                    if ln.startswith("!"):
                        print(f"  [latex] {ln}")
                        break
                return False

            # ── 2. pdftoppm -> PNG ─────────────────────────────────────────
            pfx = str(Path(tmp) / "p")
            try:
                subprocess.run(
                    ["pdftoppm", "-png", "-r", str(self.dpi), str(pdf), pfx],
                    capture_output=True,
                    timeout=20,
                )
            except (subprocess.TimeoutExpired, FileNotFoundError):
                return False

            raw = Path(tmp) / "p-1.png"
            if not raw.exists():
                return False

            # ── 3. copy + crop ─────────────────────────────────────────────
            shutil.copy(str(raw), out_png)
            _trim(out_png)
            return True
