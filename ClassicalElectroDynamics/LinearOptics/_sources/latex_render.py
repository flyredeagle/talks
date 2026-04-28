#!/usr/bin/env python3
"""
latex_render.py — Render LaTeX formula strings to base64-encoded PNG images.
Usage from Node.js: execSync(`python3 latex_render.py "${escaped_latex}"`)
Or call render_formula(latex_str) and get base64 string back.
"""

import subprocess, os, sys, base64, tempfile, hashlib, json

CACHE_DIR = "/tmp/latex_cache"
os.makedirs(CACHE_DIR, exist_ok=True)

BG_COLOR  = "0D1B2A"   # dark navy (match slide background)
FG_COLOR  = "90E0EF"   # pale cyan (formula text)
LABEL_COLOR = "FFB703" # gold (for label line)

def _make_preamble():
    lines = [
        "\\documentclass[preview,border=6pt]{standalone}",
        "\\usepackage{amsmath,amssymb,bm,mathtools}",
        "\\usepackage[table]{xcolor}",
        "\\renewcommand{\\arraystretch}{1.4}",
        "\\pagecolor[HTML]{" + BG_COLOR + "}",
        "\\color[HTML]{" + FG_COLOR + "}",
    ]
    return "\n".join(lines) + "\n"
PREAMBLE = _make_preamble()

def render_formula(latex_body, label="", font_size="Large", dpi=220):
    """
    Render a LaTeX formula to PNG and return as base64 data URI string.
    latex_body: the formula/display-math content (no $ or \[...\] needed for display)
    label: optional label text (gold, small, above formula)
    Returns: "image/png;base64,<data>"
    """
    # Build full TeX source
    label_tex = ""
    if label:
        label_tex = r"\noindent{\small\color[HTML]{" + LABEL_COLOR + r"}\textit{" + label.replace('_', r'\_').replace('&', r'\&') + r"}}\par\smallskip" + "\n"

    tex_src = PREAMBLE + r"\begin{document}" + "\n"
    tex_src += label_tex
    tex_src += "{\\" + font_size + "\n"
    tex_src += r"\[" + "\n" + latex_body + "\n" + r"\]}" + "\n"
    tex_src += r"\end{document}" + "\n"

    # Hash for caching
    h = hashlib.md5(tex_src.encode()).hexdigest()
    png_path = os.path.join(CACHE_DIR, h + ".png")

    if os.path.exists(png_path):
        with open(png_path, "rb") as f:
            return "image/png;base64," + base64.b64encode(f.read()).decode()

    with tempfile.TemporaryDirectory() as td:
        tex_file = os.path.join(td, "formula.tex")
        pdf_file = os.path.join(td, "formula.pdf")

        with open(tex_file, "w") as f:
            f.write(tex_src)

        # Compile with pdflatex
        r = subprocess.run(
            ["pdflatex", "-interaction=nonstopmode", "-output-directory", td, tex_file],
            capture_output=True, text=True, timeout=30
        )
        if r.returncode != 0 or not os.path.exists(pdf_file):
            # Fallback: strip problematic parts and try simpler version
            print(f"LaTeX error for: {latex_body[:60]}...", file=sys.stderr)
            print(r.stdout[-300:], file=sys.stderr)
            return None

        # Convert PDF to PNG
        r2 = subprocess.run(
            ["pdftoppm", "-png", "-r", str(dpi), pdf_file, os.path.join(td, "out")],
            capture_output=True
        )
        out_png = os.path.join(td, "out-1.png")
        if not os.path.exists(out_png):
            return None

        # Copy to cache
        import shutil
        shutil.copy(out_png, png_path)

        with open(png_path, "rb") as f:
            return "image/png;base64," + base64.b64encode(f.read()).decode()


def render_diagram(diagram_type, params=None, dpi=200):
    """
    Render a matplotlib diagram to base64 PNG.
    diagram_type: one of 'rainbow', 'optical_component', 'ray_diagram', etc.
    """
    import matplotlib
    matplotlib.use('Agg')
    import matplotlib.pyplot as plt
    import matplotlib.patches as mpatches
    import numpy as np
    import io

    BG = "#0D1B2A"
    PANEL = "#1A2A3A"
    ACC1 = "#00B4D8"
    GOLD = "#FFB703"
    GREEN = "#06D6A0"
    MUTED = "#8DB0C8"
    WHITE = "#FFFFFF"
    OFFWHITE = "#E8F4F8"

    fig = None
    p = params or {}

    if diagram_type == "rainbow_spectrum":
        fig, axes = plt.subplots(2, 1, figsize=(8, 4.5), facecolor=BG,
                                  gridspec_kw={'height_ratios': [2, 1], 'hspace': 0.45})

        # Top: continuous rainbow spectrum
        ax = axes[0]
        ax.set_facecolor(BG)
        wavelengths = np.linspace(380, 740, 1000)
        # Use HSV colourmap mapped to visible spectrum
        from matplotlib.colors import hsv_to_rgb
        def wl_to_rgb(wl):
            # Rough but visually nice mapping
            if wl < 440:
                r, g, b = -(wl - 440) / 60, 0, 1
            elif wl < 490:
                r, g, b = 0, (wl - 440) / 50, 1
            elif wl < 510:
                r, g, b = 0, 1, -(wl - 510) / 20
            elif wl < 580:
                r, g, b = (wl - 510) / 70, 1, 0
            elif wl < 645:
                r, g, b = 1, -(wl - 645) / 65, 0
            else:
                r, g, b = 1, 0, 0
            # Intensity roll-off at edges
            factor = 1.0
            if wl < 420:
                factor = 0.3 + 0.7 * (wl - 380) / 40
            elif wl > 700:
                factor = 0.3 + 0.7 * (740 - wl) / 40
            return min(1, max(0, r*factor)), min(1, max(0, g*factor)), min(1, max(0, b*factor))

        for i, wl in enumerate(wavelengths):
            rgb = wl_to_rgb(wl)
            ax.axvline(wl, color=rgb, linewidth=0.8, alpha=0.9)

        # Mark major colour bands
        colors_info = [
            (405, "Violet\n405nm"), (450, "Blue\n450nm"), (495, "Cyan\n495nm"),
            (530, "Green\n530nm"), (580, "Yellow\n580nm"), (625, "Orange\n625nm"),
            (700, "Red\n700nm"),
        ]
        for wl, name in colors_info:
            rgb = wl_to_rgb(wl)
            ax.axvline(wl, color='white', linewidth=0.5, linestyle='--', alpha=0.4)
            ax.text(wl, 1.08, name, ha='center', va='bottom', fontsize=6.5,
                    color=rgb, fontweight='bold', transform=ax.get_xaxis_transform())

        ax.set_xlim(380, 740)
        ax.set_ylim(0, 1)
        ax.set_xlabel("Wavelength (nm)", color=MUTED, fontsize=10)
        ax.set_title("Visible Spectrum: Continuous Fourier Decomposition of White Light",
                     color=OFFWHITE, fontsize=11, pad=18)
        ax.tick_params(colors=MUTED)
        ax.spines[:].set_color(MUTED)
        ax.spines[:].set_alpha(0.4)
        ax.set_yticks([])

        # Bottom: amplitude (intensity) spectrum — discrete spikes for named colours
        ax2 = axes[1]
        ax2.set_facecolor(BG)
        named = [(405, "V"), (450, "B"), (495, "C"), (530, "G"), (580, "Y"), (625, "O"), (700, "R")]
        amps  = [0.6, 0.85, 0.75, 1.0, 0.9, 0.8, 0.7]
        for (wl, nm), amp in zip(named, amps):
            rgb = wl_to_rgb(wl)
            ax2.bar(wl, amp, width=10, color=rgb, alpha=0.9, edgecolor='white', linewidth=0.3)
            ax2.text(wl, amp + 0.04, nm, ha='center', va='bottom',
                     fontsize=8, color=rgb, fontweight='bold')

        ax2.set_xlim(380, 740)
        ax2.set_ylim(0, 1.3)
        ax2.set_xlabel("Wavelength (nm)", color=MUTED, fontsize=10)
        ax2.set_title("Amplitude Spectrum: Major Colour Components (Fourier Coefficients)",
                      color=OFFWHITE, fontsize=11)
        ax2.tick_params(colors=MUTED)
        ax2.spines[:].set_color(MUTED)
        ax2.spines[:].set_alpha(0.4)
        ax2.set_yticks([0, 0.5, 1.0])
        ax2.set_yticklabels(['0', '0.5', '1.0'], color=MUTED, fontsize=8)

        fig.patch.set_facecolor(BG)

    elif diagram_type == "fourier_modes":
        fig, axes = plt.subplots(1, 3, figsize=(9, 3.5), facecolor=BG)
        x = np.linspace(0, 2 * np.pi, 500)
        mode_colors = [ACC1, GOLD, GREEN, "#EF476F", "#9B5DE5"]
        freqs = [1, 2, 3, 4, 5]
        amps  = [1.0, 0.5, 0.33, 0.25, 0.2]

        # Left: individual Fourier eigenmodes
        ax = axes[0]
        ax.set_facecolor(PANEL)
        for f, a, c in zip(freqs, amps, mode_colors):
            ax.plot(x, a * np.sin(f * x), color=c, linewidth=1.5, label=f"n={f}")
        ax.set_title("Fourier Eigenmodes", color=OFFWHITE, fontsize=10)
        ax.set_xlabel("x", color=MUTED, fontsize=9)
        ax.axhline(0, color=MUTED, linewidth=0.4)
        ax.tick_params(colors=MUTED, labelsize=7)
        ax.spines[:].set_color(MUTED); ax.spines[:].set_alpha(0.3)
        ax.legend(fontsize=7, framealpha=0.2, labelcolor=OFFWHITE)
        ax.set_facecolor(BG)

        # Middle: partial sums building up the square wave
        ax2 = axes[1]
        ax2.set_facecolor(BG)
        partial = np.zeros_like(x)
        for i, (f, a, c) in enumerate(zip(freqs, amps, mode_colors)):
            partial += a * np.sin(f * x)
            ax2.plot(x, partial, color=c, linewidth=1.2 + i * 0.3, alpha=0.7)
        # Target
        sq = np.sign(np.sin(x)) * 0.9
        ax2.plot(x, sq, color='white', linewidth=0.7, linestyle='--', alpha=0.5, label="target")
        ax2.set_title("Fourier Series (partial sums)", color=OFFWHITE, fontsize=10)
        ax2.set_xlabel("x", color=MUTED, fontsize=9)
        ax2.axhline(0, color=MUTED, linewidth=0.4)
        ax2.tick_params(colors=MUTED, labelsize=7)
        ax2.spines[:].set_color(MUTED); ax2.spines[:].set_alpha(0.3)
        ax2.legend(fontsize=7, framealpha=0.2, labelcolor=OFFWHITE)

        # Right: frequency domain coefficients
        ax3 = axes[2]
        ax3.set_facecolor(BG)
        ns = np.array(freqs)
        as_ = np.array(amps)
        ax3.bar(ns, as_, color=mode_colors, width=0.5, edgecolor='white', linewidth=0.3)
        ax3.set_xlabel("Frequency n", color=MUTED, fontsize=9)
        ax3.set_title("Fourier Coefficients |cₙ|", color=OFFWHITE, fontsize=10)
        ax3.tick_params(colors=MUTED, labelsize=7)
        ax3.spines[:].set_color(MUTED); ax3.spines[:].set_alpha(0.3)
        ax3.set_xticks(ns)
        ax3.set_xticklabels([f"n={n}" for n in ns], color=MUTED, fontsize=7)

        fig.patch.set_facecolor(BG)
        fig.tight_layout(pad=0.8)

    elif diagram_type == "optical_component_gallery":
        # Draw symbolic representations of optical components
        fig, axes = plt.subplots(2, 4, figsize=(10, 4.5), facecolor=BG)
        components = [
            ("Thin Lens\n(converging)", "lens_conv"),
            ("Mirror\n(concave)", "mirror_conc"),
            ("GRIN Rod", "grin"),
            ("Prism", "prism"),
            ("Wave Plate\n(birefringent)", "waveplate"),
            ("Polarizer\n(wire-grid)", "polarizer"),
            ("Beamsplitter\ncube", "bscube"),
            ("EOM\n(LiNbO₃)", "eom"),
        ]
        for ax, (name, ctype) in zip(axes.flat, components):
            ax.set_facecolor(BG)
            ax.set_xlim(-1.5, 1.5)
            ax.set_ylim(-1.5, 1.5)
            ax.set_aspect('equal')
            ax.axis('off')
            ax.set_title(name, color=OFFWHITE, fontsize=8, pad=2)

            if ctype == "lens_conv":
                # Biconvex lens
                theta = np.linspace(-np.pi/3, np.pi/3, 100)
                r = 1.2
                x1 = r * np.cos(theta) - r * np.cos(np.pi/3) + 0.3
                y1 = r * np.sin(theta)
                x2 = -r * np.cos(theta) + r * np.cos(np.pi/3) - 0.3
                ax.plot(x1, y1, color=ACC1, linewidth=2)
                ax.plot(x2, y1, color=ACC1, linewidth=2)
                ax.fill_betweenx(y1, x2, x1, alpha=0.15, color=ACC1)
                # Optical axis
                ax.axhline(0, color=MUTED, linewidth=0.5, linestyle='--', alpha=0.5)
                # Focal points
                ax.plot([-1.1, 1.1], [0, 0], 'o', color=GOLD, markersize=5)
                ax.text(1.1, -0.25, 'F', color=GOLD, fontsize=9, ha='center')
                ax.text(-1.1, -0.25, 'F', color=GOLD, fontsize=9, ha='center')

            elif ctype == "mirror_conc":
                theta = np.linspace(np.pi * 0.55, np.pi * 1.45, 100)
                r = 1.0
                xm = r * np.cos(theta) + r
                ym = r * np.sin(theta)
                ax.plot(xm, ym, color=ACC1, linewidth=3)
                ax.fill_betweenx(ym, xm, xm + 0.12, alpha=0.4, color=ACC1)
                ax.axhline(0, color=MUTED, linewidth=0.5, linestyle='--', alpha=0.5)
                # Focal point
                ax.plot([0.5], [0], 'o', color=GOLD, markersize=6)
                ax.text(0.5, -0.25, 'F', color=GOLD, fontsize=9, ha='center')
                # Rays
                for yoff in [-0.5, 0, 0.5]:
                    ax.annotate("", xy=(xm[50], ym[50] if yoff == 0 else yoff), xytext=(-1.3, yoff),
                                arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.2))

            elif ctype == "grin":
                # Cylinder with gradient fill
                from matplotlib.patches import FancyBboxPatch
                rect = FancyBboxPatch((-0.9, -0.6), 1.8, 1.2,
                                      boxstyle="round,pad=0.05", facecolor=ACC1,
                                      alpha=0.2, edgecolor=ACC1, linewidth=2)
                ax.add_patch(rect)
                # Gradient bands suggesting index variation
                for i, alpha in enumerate(np.linspace(0.05, 0.25, 8)):
                    y_b = -0.55 + i * 0.12
                    ax.axhline(y_b, color=ACC1, linewidth=0.5, alpha=alpha, xmin=0.1, xmax=0.9)
                ax.text(0, 0, 'n(r)', color=ACC1, fontsize=12, ha='center', va='center', fontweight='bold')
                ax.axhline(0, color=MUTED, linewidth=0.5, linestyle='--', alpha=0.5)
                # Curved rays through GRIN
                t = np.linspace(-0.9, 0.9, 100)
                for sign in [-1, 1]:
                    yw = sign * 0.4 * np.cos(np.pi * t / 1.8)
                    ax.plot(t, yw, color=GREEN, linewidth=1.5)

            elif ctype == "prism":
                tri_x = [-0.8, 0.8, 0, -0.8]
                tri_y = [-0.8, -0.8, 0.9, -0.8]
                ax.fill(tri_x, tri_y, alpha=0.2, color=GOLD)
                ax.plot(tri_x, tri_y, color=GOLD, linewidth=2)
                # Dispersed rays
                colors_r = ['#EF476F', '#FB8500', '#FFD700', '#06D6A0', '#00B4D8', '#9B5DE5']
                for i, c in enumerate(colors_r):
                    angle = -0.5 + i * 0.2
                    ax.annotate("", xy=(-0.2 + i * 0.05, -0.5), xytext=(-1.2, -0.3 + i * 0.05),
                                arrowprops=dict(arrowstyle='->', color=c, lw=1.2))

            elif ctype == "waveplate":
                rect = mpatches.Rectangle((-0.2, -0.9), 0.4, 1.8, color=ACC1, alpha=0.25, linewidth=2,
                                          edgecolor=ACC1)
                ax.add_patch(rect)
                ax.axhline(0, color=MUTED, linewidth=0.5, linestyle='--', alpha=0.5)
                # Show polarization ellipses
                theta2 = np.linspace(0, 2*np.pi, 100)
                ax.plot(-0.9 + 0.35*np.cos(theta2), 0.35*np.sin(theta2), color=GREEN, linewidth=1.5)
                theta3 = np.linspace(0, 2*np.pi, 100)
                ax.plot(0.7 + 0.25*np.cos(theta3), 0.5*np.sin(theta3), color=GOLD, linewidth=1.5)
                ax.text(0, 0.0, 'Δφ', color=OFFWHITE, fontsize=11, ha='center', va='center')

            elif ctype == "polarizer":
                # Wire grid lines
                ax.add_patch(mpatches.Rectangle((-0.4, -0.9), 0.8, 1.8, color=MUTED, alpha=0.1,
                                                 edgecolor=MUTED, linewidth=1))
                for yi in np.linspace(-0.85, 0.85, 16):
                    ax.plot([-0.38, 0.38], [yi, yi], color=MUTED, linewidth=1, alpha=0.6)
                # Input arrow (two components)
                ax.annotate("", xy=(-0.42, 0), xytext=(-1.2, 0),
                            arrowprops=dict(arrowstyle='->', color=GREEN, lw=2))
                ax.annotate("", xy=(-0.42, 0), xytext=(-0.85, 0.5),
                            arrowprops=dict(arrowstyle='->', color=GOLD, lw=2))
                # Output: one polarization
                ax.annotate("", xy=(1.2, 0), xytext=(0.42, 0),
                            arrowprops=dict(arrowstyle='->', color=GREEN, lw=2))
                ax.text(0, -1.1, '→ selects H', color=GREEN, fontsize=7, ha='center')

            elif ctype == "bscube":
                # Cube with diagonal
                sq = mpatches.Rectangle((-0.6, -0.6), 1.2, 1.2, color=ACC1, alpha=0.15,
                                         edgecolor=ACC1, linewidth=2)
                ax.add_patch(sq)
                ax.plot([-0.6, 0.6], [-0.6, 0.6], color=MUTED, linewidth=1.5, alpha=0.7)
                # Two output arrows
                ax.annotate("", xy=(0.9, 0), xytext=(-0.9, 0),
                            arrowprops=dict(arrowstyle='->', color=ACC1, lw=1.8))
                ax.annotate("", xy=(0, 0.9), xytext=(0, 0),
                            arrowprops=dict(arrowstyle='->', color=GOLD, lw=1.8))
                ax.text(1.0, 0.15, 'T', color=ACC1, fontsize=10, fontweight='bold')
                ax.text(0.1, 1.0, 'R', color=GOLD, fontsize=10, fontweight='bold')

            elif ctype == "eom":
                # LiNbO3 crystal with electrodes
                rect2 = mpatches.Rectangle((-0.8, -0.4), 1.6, 0.8, color=GOLD, alpha=0.2,
                                            edgecolor=GOLD, linewidth=2)
                ax.add_patch(rect2)
                ax.add_patch(mpatches.Rectangle((-0.85, 0.42), 1.7, 0.12, color=MUTED, alpha=0.6,
                                                  edgecolor=MUTED, linewidth=0))
                ax.add_patch(mpatches.Rectangle((-0.85, -0.54), 1.7, 0.12, color=MUTED, alpha=0.6,
                                                  edgecolor=MUTED, linewidth=0))
                ax.text(0, 0, 'LiNbO₃', color=GOLD, fontsize=8, ha='center', va='center', fontweight='bold')
                ax.text(0, 0.7, 'V(t)', color=MUTED, fontsize=8, ha='center')
                ax.axhline(0, color=MUTED, linewidth=0.5, linestyle='--', alpha=0.5)
                ax.annotate("", xy=(1.2, 0), xytext=(-1.2, 0),
                            arrowprops=dict(arrowstyle='->', color=ACC1, lw=2))

        fig.patch.set_facecolor(BG)
        fig.suptitle("Optical Component Gallery — Schematic Symbols", color=OFFWHITE,
                     fontsize=11, y=1.01)
        fig.tight_layout(pad=0.5)

    elif diagram_type == "material_gallery":
        # Visual representations of key optical materials
        fig, axes = plt.subplots(2, 4, figsize=(10, 4.5), facecolor=BG)
        materials = [
            ("BK7 Glass\n(SiO₂-based)", "bk7"),
            ("Calcite\n(birefringent)", "calcite"),
            ("LiNbO₃\n(EO crystal)", "linbo3"),
            ("YIG\n(Faraday)", "yig"),
            ("GRIN Fiber\n(GeO₂ doped)", "grin_fiber"),
            ("Silicon\n(IR optics)", "silicon"),
            ("Gold Mirror\n(Au thin film)", "gold_mirror"),
            ("TiO₂/SiO₂\nDBR Stack", "dbr"),
        ]
        for ax, (name, mtype) in zip(axes.flat, materials):
            ax.set_facecolor(BG)
            ax.set_aspect('equal')
            ax.axis('off')
            ax.set_title(name, color=OFFWHITE, fontsize=8, pad=3)
            ax.set_xlim(-1.2, 1.2)
            ax.set_ylim(-1.2, 1.2)

            if mtype == "bk7":
                # Amorphous glass — random network
                np.random.seed(42)
                pts = np.random.randn(20, 2) * 0.5
                for i in range(len(pts)):
                    for j in range(i+1, len(pts)):
                        if np.linalg.norm(pts[i]-pts[j]) < 0.6:
                            ax.plot([pts[i,0], pts[j,0]], [pts[i,1], pts[j,1]],
                                    color=ACC1, alpha=0.4, linewidth=1)
                ax.plot(pts[:,0], pts[:,1], 'o', color=ACC1, markersize=5, alpha=0.8)
                ax.text(0, -1.0, 'amorphous SiO₂', color=MUTED, fontsize=7, ha='center')

            elif mtype == "calcite":
                # Rhombohedral crystal lattice
                for i in range(-2, 3):
                    for j in range(-2, 3):
                        x0, y0 = i * 0.4, j * 0.35
                        if abs(x0) < 1.0 and abs(y0) < 1.0:
                            ax.plot(x0, y0, 's', color=GOLD, markersize=5, alpha=0.8)
                ax.text(0, -1.0, 'trigonal R3̄c', color=MUTED, fontsize=7, ha='center')
                # Show optical axes
                ax.annotate("", xy=(0.7, 0.7), xytext=(-0.7, -0.7),
                            arrowprops=dict(arrowstyle='->', color='#EF476F', lw=1.5))
                ax.text(0.5, 0.85, 'c-axis', color='#EF476F', fontsize=6.5)

            elif mtype == "linbo3":
                # Trigonal crystal
                for i in range(-2, 3):
                    for j in range(-2, 3):
                        x0 = i * 0.38 + (j % 2) * 0.19
                        y0 = j * 0.33
                        if abs(x0) < 1.0 and abs(y0) < 1.0:
                            c = ACC1 if (i+j) % 2 == 0 else GOLD
                            ax.plot(x0, y0, 'o', color=c, markersize=5, alpha=0.8)
                ax.text(0, -1.0, 'trigonal R3c', color=MUTED, fontsize=7, ha='center')
                ax.text(0, -1.2, 'Li● Nb○', color=MUTED, fontsize=7, ha='center')

            elif mtype == "yig":
                # Cubic garnet lattice
                for i in range(-2, 3):
                    for j in range(-2, 3):
                        x0, y0 = i * 0.4, j * 0.4
                        if abs(x0) <= 0.85 and abs(y0) <= 0.85:
                            c = "#9B5DE5" if (i+j) % 2 == 0 else GOLD
                            marker = 'D' if (i+j) % 3 == 0 else 'o'
                            ax.plot(x0, y0, marker, color=c, markersize=5, alpha=0.8)
                ax.text(0, -1.0, 'cubic Ia3̄d', color=MUTED, fontsize=7, ha='center')
                ax.text(0, -1.2, 'Y●  Fe◆', color=MUTED, fontsize=7, ha='center')

            elif mtype == "grin_fiber":
                # Fiber cross section with gradient
                theta_f = np.linspace(0, 2*np.pi, 200)
                # Cladding
                ax.fill(np.cos(theta_f)*1.0, np.sin(theta_f)*1.0, color=MUTED, alpha=0.15)
                ax.plot(np.cos(theta_f)*1.0, np.sin(theta_f)*1.0, color=MUTED, linewidth=1.5)
                # Core with gradient rings
                for r_val in np.linspace(0.6, 0.05, 8):
                    alpha_val = 0.1 + (0.6 - r_val)
                    ax.fill(np.cos(theta_f)*r_val, np.sin(theta_f)*r_val, color=GREEN, alpha=alpha_val)
                ax.text(0, 0, 'n(r)', color=GREEN, fontsize=9, ha='center', va='center', fontweight='bold')
                ax.text(0, -1.2, 'GRIN core (GeO₂)', color=MUTED, fontsize=7, ha='center')

            elif mtype == "silicon":
                # Diamond cubic lattice
                pts_si = [(-0.4,-0.4),(0.4,-0.4),(0,-0.0),(-0.4,0.4),(0.4,0.4),
                           (0.0,-0.8),(0.8,0.0),(0.0,0.8),(-0.8,0.0)]
                bonds = [(0,2),(1,2),(3,2),(4,2),(5,0),(5,1),(6,1),(6,4),(7,3),(7,4),(8,0),(8,3)]
                for i,j in bonds:
                    ax.plot([pts_si[i][0],pts_si[j][0]],[pts_si[i][1],pts_si[j][1]],
                            color=ACC1, linewidth=1.5, alpha=0.5)
                for px,py in pts_si:
                    ax.plot(px, py, 'o', color=ACC1, markersize=8, alpha=0.9)
                ax.text(0, -1.1, 'diamond cubic (Fd3̄m)', color=MUTED, fontsize=7, ha='center')

            elif mtype == "gold_mirror":
                # FCC lattice cross section + surface reflection sketch
                for i in range(-2, 3):
                    for j in range(-1, 2):
                        x0, y0 = i*0.4 + (j%2)*0.2, j*0.35 + 0.3
                        if abs(x0) < 1.05:
                            ax.plot(x0, y0, 'o', color=GOLD, markersize=6, alpha=0.85)
                ax.axhline(-0.2, color=GOLD, linewidth=2, alpha=0.7)
                ax.fill_between(np.linspace(-1.1,1.1,5), -1.2, -0.2, color=GOLD, alpha=0.12)
                ax.annotate("", xy=(-0.6, -0.6), xytext=(-0.6, 0.6),
                            arrowprops=dict(arrowstyle='->', color=MUTED, lw=1.5))
                ax.annotate("", xy=(0.6, 0.6), xytext=(0.2, -0.6),
                            arrowprops=dict(arrowstyle='->', color='#EF476F', lw=1.5))
                ax.text(0, -1.1, 'FCC Au thin film', color=MUTED, fontsize=7, ha='center')

            elif mtype == "dbr":
                # DBR multilayer stack
                n_pairs = 6
                y0 = -0.9
                colors_dbr = [ACC1, GOLD]
                for i in range(n_pairs * 2):
                    col = colors_dbr[i % 2]
                    height = 0.27
                    ax.fill_between([-1, 1], y0, y0+height, color=col,
                                    alpha=0.55 if i%2==0 else 0.35)
                    ax.axhline(y0, color=col, linewidth=0.5, alpha=0.4)
                    y0 += height
                ax.text(-1.15, 0.0, 'TiO₂', color=ACC1, fontsize=7, va='center', rotation=90)
                ax.text(-0.75, 0.0, 'SiO₂', color=GOLD, fontsize=7, va='center', rotation=90)
                # Incoming ray
                ax.annotate("", xy=(0.3, 0.92), xytext=(0.0, 1.15),
                            arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.5))
                ax.annotate("", xy=(-0.3, 1.15), xytext=(0.0, 0.92),
                            arrowprops=dict(arrowstyle='->', color='#EF476F', lw=1.5, linestyle='--'))
                ax.text(0, -1.1, 'λ/4 pairs, R>99.9%', color=MUTED, fontsize=7, ha='center')

        fig.patch.set_facecolor(BG)
        fig.suptitle("Optical Materials — Crystal Structures & Microstructures", color=OFFWHITE,
                     fontsize=11, y=1.01)
        fig.tight_layout(pad=0.4)

    elif diagram_type == "telescope_refractor":
        fig, ax = plt.subplots(figsize=(9.5, 3.5), facecolor=BG)
        ax.set_facecolor(BG)
        ax.set_xlim(-0.5, 10.5)
        ax.set_ylim(-1.5, 1.8)
        ax.axis('off')

        GOLD2 = "#FFB703"; ACC1_2 = "#00B4D8"; GREEN2 = "#06D6A0"; MUTED2 = "#8DB0C8"

        # Optical axis
        ax.axhline(0, color=MUTED2, linewidth=0.8, linestyle='--', alpha=0.4)

        # Objective doublet group (L1+L2)
        for x_l, col, lbl in [(1.5, ACC1_2, "L₁"), (2.2, ACC1_2, "L₂")]:
            ax.plot([x_l, x_l], [-1.0, 1.0], color=col, linewidth=3)
            ax.annotate("", xy=(x_l + 0.15, 0.5), xytext=(x_l - 0.15, 0.5),
                        arrowprops=dict(arrowstyle='->', color=col, lw=1.0))
            ax.annotate("", xy=(x_l + 0.15, -0.5), xytext=(x_l - 0.15, -0.5),
                        arrowprops=dict(arrowstyle='->', color=col, lw=1.0))
            ax.text(x_l, 1.25, lbl, color=col, fontsize=9, ha='center', fontweight='bold')

        # Back focal plane marker
        ax.axvline(5.0, color=GOLD2, linewidth=1, linestyle=':', alpha=0.7)
        ax.text(5.0, 1.55, "Back\nFocal\nPlane", color=GOLD2, fontsize=7, ha='center')

        # Eyepiece doublet (L3+L4)
        for x_l, col, lbl in [(7.0, GREEN2, "L₃"), (7.7, GREEN2, "L₄")]:
            ax.plot([x_l, x_l], [-1.0, 1.0], color=col, linewidth=3)
            ax.text(x_l, 1.25, lbl, color=col, fontsize=9, ha='center', fontweight='bold')

        # Input plane
        ax.axvline(0.0, color=MUTED2, linewidth=1, alpha=0.5)
        ax.text(0.0, 1.55, "P₁\nInput", color=MUTED2, fontsize=7, ha='center')

        # Output plane
        ax.axvline(9.5, color=GREEN2, linewidth=1, alpha=0.7)
        ax.text(9.5, 1.55, "P₂\nOutput", color=GREEN2, fontsize=7, ha='center')

        # f_obj and f_eye brackets
        ax.annotate("", xy=(5.0, -1.3), xytext=(0.0, -1.3),
                    arrowprops=dict(arrowstyle='<->', color=ACC1_2, lw=1.2))
        ax.text(2.5, -1.55, "f_obj = 500 mm", color=ACC1_2, fontsize=8, ha='center')
        ax.annotate("", xy=(9.5, -1.3), xytext=(5.0, -1.3),
                    arrowprops=dict(arrowstyle='<->', color=GREEN2, lw=1.2))
        ax.text(7.25, -1.55, "f_eye = 25 mm", color=GREEN2, fontsize=8, ha='center')

        # Rays
        # Top marginal ray: comes in parallel, deflects at objective, converges at BFP, diverges through eyepiece, exits parallel
        rx = [0.0, 1.5, 2.2, 5.0, 7.0, 7.7, 9.5]
        ry_top = [0.85, 0.85, 0.85, 0.0, -0.85*5/25, -0.85*5/25, -0.85*5/25*1.05]
        ry_bot = [-0.85, -0.85, -0.85, 0.0, 0.85*5/25, 0.85*5/25, 0.85*5/25*1.05]
        ax.plot(rx, ry_top, color=ACC1_2, linewidth=1.5, alpha=0.85)
        ax.plot(rx, ry_bot, color=ACC1_2, linewidth=1.5, alpha=0.85)

        # Matrix labels
        ax.text(0.75, 0.95, "M_free(f_obj)", color=MUTED2, fontsize=6.5, ha='center')
        ax.text(3.6, 0.95, "M_free(f+f_e)", color=MUTED2, fontsize=6.5, ha='center')
        ax.text(8.6, 0.95, "M_free(f_eye)", color=MUTED2, fontsize=6.5, ha='center')

        ax.set_title("Refracting Telescope (Two Doublet Groups) — ABCD Cascade",
                     color=OFFWHITE, fontsize=11, pad=6)
        fig.tight_layout()

    elif diagram_type == "telescope_sct":
        fig, ax = plt.subplots(figsize=(9.5, 3.8), facecolor=BG)
        ax.set_facecolor(BG)
        ax.set_xlim(-0.5, 10.5)
        ax.set_ylim(-2.0, 2.2)
        ax.axis('off')

        GOLD2="#FFB703"; ACC1_2="#00B4D8"; GREEN2="#06D6A0"; MUTED2="#8DB0C8"; RED2="#EF476F"
        ax.axhline(0, color=MUTED2, linewidth=0.8, linestyle='--', alpha=0.4)

        # Schmidt corrector plate (weak lens symbol)
        ax.plot([1.2, 1.2], [-1.3, 1.3], color=ACC1_2, linewidth=2)
        ax.text(1.2, 1.6, "Schmidt\nCorrector", color=ACC1_2, fontsize=7.5, ha='center')

        # Primary mirror (large concave, at right)
        theta_pm = np.linspace(np.pi*0.6, np.pi*1.4, 80)
        r_pm = 1.2
        xpm = r_pm * np.cos(theta_pm) + 8.5
        ypm = r_pm * np.sin(theta_pm)
        ax.plot(xpm, ypm, color=GREEN2, linewidth=4)
        ax.fill_betweenx(ypm, xpm, xpm+0.15, color=GREEN2, alpha=0.3)
        ax.text(9.1, 0, "M₁\n(concave)", color=GREEN2, fontsize=7.5, ha='center')

        # Secondary mirror (small convex, near centre)
        theta_sm = np.linspace(-np.pi*0.35, np.pi*0.35, 60)
        r_sm = 0.55
        xsm = -r_sm * np.cos(theta_sm) + 4.5
        ysm = r_sm * np.sin(theta_sm)
        ax.plot(xsm, ysm, color=RED2, linewidth=3)
        ax.fill_betweenx(ysm, xsm - 0.12, xsm, color=RED2, alpha=0.3)
        ax.text(4.2, 0.8, "M₂\n(convex)", color=RED2, fontsize=7.5, ha='center')

        # Hole in primary
        ax.fill_between([8.0, 8.5], -0.25, 0.25, color=BG)

        # Input plane
        ax.axvline(0.0, color=MUTED2, linewidth=1, alpha=0.5)
        ax.text(0.0, 1.85, "P₁\nInput", color=MUTED2, fontsize=7, ha='center')

        # Focal plane (behind primary)
        ax.axvline(6.5, color=GOLD2, linewidth=1, linestyle=':', alpha=0.7)
        ax.text(6.5, 1.85, "Focal\nPlane", color=GOLD2, fontsize=7, ha='center')

        # Rays: two marginal rays from left
        # Incoming parallel
        ax.annotate("", xy=(1.2, 1.0), xytext=(0.0, 1.0),
                    arrowprops=dict(arrowstyle='->', color=ACC1_2, lw=1.5))
        ax.annotate("", xy=(1.2, -1.0), xytext=(0.0, -1.0),
                    arrowprops=dict(arrowstyle='->', color=ACC1_2, lw=1.5))

        # After corrector → primary
        ax.plot([1.2, xpm[40]], [1.0, ypm[40]], color=ACC1_2, linewidth=1.5)
        ax.plot([1.2, xpm[40]], [-1.0, ypm[40]], color=ACC1_2, linewidth=1.5)

        # Reflected from primary → secondary
        ax.plot([xpm[40], xsm[30]], [ypm[40], ysm[30]], color=GREEN2, linewidth=1.5)
        ax.plot([xpm[-40], xsm[-30]], [ypm[-40], ysm[-30]], color=GREEN2, linewidth=1.5)

        # Reflected from secondary → through hole → focal point
        ax.plot([xsm[30], 6.5], [ysm[30], 0.0], color=RED2, linewidth=1.5)
        ax.plot([xsm[-30], 6.5], [ysm[-30], 0.0], color=RED2, linewidth=1.5)
        ax.plot(6.5, 0.0, 'o', color=GOLD2, markersize=8)
        ax.text(6.5, -0.35, "focus", color=GOLD2, fontsize=7.5, ha='center')

        # Distance annotations
        ax.annotate("", xy=(8.5, -1.7), xytext=(1.2, -1.7),
                    arrowprops=dict(arrowstyle='<->', color=MUTED2, lw=1.0))
        ax.text(4.85, -1.95, "d₁ (corrector→M₁)", color=MUTED2, fontsize=7.5, ha='center')
        ax.annotate("", xy=(8.3, -1.35), xytext=(4.8, -1.35),
                    arrowprops=dict(arrowstyle='<->', color=GREEN2, lw=1.0))
        ax.text(6.55, -1.6, "d₂ (M₁→M₂)", color=GREEN2, fontsize=7.5, ha='center')

        ax.set_title("Schmidt-Cassegrain Telescope — Ray Path & ABCD Components",
                     color=OFFWHITE, fontsize=11, pad=6)
        fig.tight_layout()

    if fig is None:
        return None

    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=dpi, bbox_inches='tight',
                facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    return "image/png;base64," + base64.b64encode(buf.read()).decode()


if __name__ == "__main__":
    # Called from Node.js: first arg is latex body, second optional is label
    if len(sys.argv) >= 2:
        latex_body = sys.argv[1]
        label = sys.argv[2] if len(sys.argv) >= 3 else ""
        result = render_formula(latex_body, label)
        if result:
            print(result)
        else:
            print("ERROR", file=sys.stderr)
            sys.exit(1)
