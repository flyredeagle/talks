"""
L01/concept_diagrams.py
=======================
Generates all geometric analogy diagrams for L01's deep concept slides.
Each diagram uses the dark slide palette and 2D/3D vector-space analogies.

Diagrams produced
-----------------
HS:
  hs_complex_plane       – Complex plane with arrow for z = a+ib
  hs_magnitude_squared   – |z|² = squared length, annotated
  hs_interference        – Two arrows A₁ A₂ and resultant, phase variation
  hs_phase_circle        – P(φ) = 2+2cosφ polar/cartesian plot

BegUG:
  begug_vector_basis     – 2D basis e₁ e₂ with |ψ⟩ = c₁|1⟩+c₂|2⟩ decomposition
  begug_inner_product    – dot product as projection onto basis vector
  begug_normalisation    – unit circle: all normalised states on S¹ in ℂ²
  begug_global_phase     – two arrows same direction, different phases, same |·|²

AdvUG:
  advug_cauchy_schwarz   – angle between two vectors, cosθ = ⟨φ|ψ⟩
  advug_triangle_ineq    – vector triangle in 2D
  advug_fubini_study     – Bloch circle (2D) with Fubini-Study arc distance

MSc:
  msc_projective_space   – lines through origin in ℝ²: rays as equivalence classes
  msc_bloch_sphere       – 3D Bloch sphere with north/south poles and equator state

PhD:
  phd_completeness       – Cauchy sequence converging (function approximation)
  phd_domain_subtlety    – operator domains: D(A) ⊂ D(A†) diagram
"""

import os
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patheffects as pe
from matplotlib.patches import FancyArrowPatch, Arc, Circle, FancyBboxPatch
from mpl_toolkits.mplot3d import Axes3D

# ── Palette ────────────────────────────────────────────────────────────────────
BG      = "#0A0E1A"
BGCARD  = "#111827"
ACC1    = "#6366F1"   # indigo
ACC2    = "#10B981"   # emerald
ACC3    = "#F59E0B"   # amber
ACC4    = "#EC4899"   # pink
ACC5    = "#38BDF8"   # sky
TEXT    = "#F1F5F9"
TEXTSUB = "#94A3B8"
TEXTDIM = "#475569"

def _fig(w=9, h=5.4, dpi=150):
    fig = plt.figure(figsize=(w, h), facecolor=BG, dpi=dpi)
    return fig

def _ax(fig, rect=[0.08, 0.08, 0.84, 0.84], fc=BGCARD):
    ax = fig.add_axes(rect, facecolor=fc)
    ax.tick_params(colors=TEXTSUB, labelsize=9)
    for spine in ax.spines.values():
        spine.set_color(TEXTDIM)
    return ax

def _arrow(ax, x0, y0, dx, dy, color, lw=2.5, hw=0.04, hl=0.08):
    ax.annotate("", xy=(x0+dx, y0+dy), xytext=(x0, y0),
                arrowprops=dict(arrowstyle=f"->,head_width={hw},head_length={hl}",
                                color=color, lw=lw))

def _label(ax, x, y, text, color=TEXT, fs=11, ha="center", va="center", **kw):
    ax.text(x, y, text, color=color, fontsize=fs, ha=ha, va=va,
            fontfamily="DejaVu Sans", **kw)

def _save(fig, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close(fig)


# ═══════════════════════════════════════════════════════════════════════════════
# HS DIAGRAMS
# ═══════════════════════════════════════════════════════════════════════════════

def hs_complex_plane(out_dir):
    """The complex plane: z = a+ib as a 2D arrow."""
    fig = _fig(9, 5.5)
    ax  = _ax(fig, [0.10, 0.10, 0.82, 0.82])

    lim = 2.5
    ax.set_xlim(-lim, lim); ax.set_ylim(-lim, lim)
    ax.set_aspect("equal")
    ax.set_xlabel("Real axis  (a)", color=TEXTSUB, fontsize=10)
    ax.set_ylabel("Imaginary axis  (b)", color=TEXTSUB, fontsize=10)
    ax.set_title("The Complex Plane — z = a + ib as a 2D Arrow", 
                 color=TEXT, fontsize=13, pad=10)
    ax.axhline(0, color=TEXTDIM, lw=0.8, zorder=1)
    ax.axvline(0, color=TEXTDIM, lw=0.8, zorder=1)
    ax.grid(True, color=TEXTDIM, alpha=0.25, lw=0.5)

    # Main vector z = 1.5 + 1.2i
    a, b = 1.5, 1.2
    _arrow(ax, 0, 0, a, b, ACC1, lw=3, hw=0.07, hl=0.12)
    _label(ax, a+0.18, b+0.15, r"$z = a + ib$", ACC1, fs=13, ha="left")

    # Real component
    ax.plot([0, a], [0, 0], "--", color=ACC3, lw=1.8, alpha=0.8)
    _label(ax, a/2, -0.22, "a = Re(z)", ACC3, fs=10)

    # Imaginary component
    ax.plot([a, a], [0, b], "--", color=ACC2, lw=1.8, alpha=0.8)
    _label(ax, a+0.32, b/2, "b = Im(z)", ACC2, fs=10, ha="left")

    # Angle arc
    theta = np.linspace(0, np.arctan2(b, a), 60)
    r_arc = 0.5
    ax.plot(r_arc*np.cos(theta), r_arc*np.sin(theta), color=ACC4, lw=2)
    _label(ax, 0.45, 0.16, "θ", ACC4, fs=12)

    # Magnitude label
    mid_x, mid_y = a/2 - 0.22, b/2 + 0.18
    _label(ax, mid_x, mid_y, r"$r = |z| = \sqrt{a^2+b^2}$", TEXT, fs=11)

    # Conjugate
    _arrow(ax, 0, 0, a, -b, ACC5, lw=1.5, hw=0.05, hl=0.09)
    _label(ax, a+0.18, -b-0.15, r"$z^* = a - ib$", ACC5, fs=11, ha="left")

    # Polar form annotation box
    ax.text(-2.3, 2.1,
            r"Polar form:" + "\n" + r"  $z = r\,e^{i\theta}$" + "\n" + 
            r"  $r = |z|$,  $\theta = \arg(z)$",
            color=TEXT, fontsize=10, va="top",
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, 
                      edgecolor=ACC1, alpha=0.9))

    _save(fig, f"{out_dir}/hs_complex_plane.png")


def hs_magnitude_squared(out_dir):
    """Why |z|² = area of the square on the magnitude."""
    fig = _fig(9, 5.5)
    ax  = _ax(fig, [0.08, 0.08, 0.84, 0.84])

    lim = 3.0
    ax.set_xlim(-0.3, lim); ax.set_ylim(-0.3, lim)
    ax.set_aspect("equal")
    ax.set_title(r"$|z|^2 = z^*z$ — The Squared Magnitude as Area", 
                 color=TEXT, fontsize=13, pad=10)
    ax.axis("off")

    # Draw the right-triangle geometry
    a, b = 1.8, 1.4
    r = np.sqrt(a**2 + b**2)

    # Background triangle
    tri = plt.Polygon([[0,0],[a,0],[a,b]], facecolor=ACC1, alpha=0.12, 
                      edgecolor=ACC1, lw=1.5)
    ax.add_patch(tri)

    # Sides
    ax.plot([0, a], [0, 0], color=ACC3, lw=2.5)
    ax.plot([a, a], [0, b], color=ACC2, lw=2.5)
    ax.plot([0, a], [0, b], color=ACC1, lw=3)

    _arrow(ax, 0, 0, a, b, ACC1, lw=3, hw=0.07, hl=0.12)
    _label(ax, a/2-0.2, b/2+0.15, f"r = {r:.2f}", ACC1, fs=12, fontweight="bold")
    _label(ax, a/2, -0.18, f"a = {a}", ACC3, fs=11)
    _label(ax, a+0.18, b/2, f"b = {b}", ACC2, fs=11, ha="left")

    # Right-angle mark
    sq = 0.12
    ax.plot([a-sq, a-sq, a], [0, sq, sq], color=TEXTSUB, lw=1)

    # Square on hypotenuse (|z|² visualization)
    theta = np.arctan2(b, a)
    perp  = theta + np.pi/2
    pts   = [(0,0), (r*np.cos(theta), r*np.sin(theta)),
             (r*np.cos(theta)+r*np.cos(perp), r*np.sin(theta)+r*np.sin(perp)),
             (r*np.cos(perp), r*np.sin(perp))]
    sq_patch = plt.Polygon(pts, facecolor=ACC1, alpha=0.18, 
                           edgecolor=ACC1, lw=1.5, linestyle="--")
    ax.add_patch(sq_patch)
    cx = np.mean([p[0] for p in pts])
    cy = np.mean([p[1] for p in pts])
    _label(ax, cx+0.1, cy, f"|z|² = {r**2:.2f}", ACC1, fs=11, fontweight="bold")

    # Formula box
    ax.text(0.05, 2.7,
            r"$|z|^2 = z^*z = (a-ib)(a+ib)$" + "\n" + 
            r"$\quad = a^2 + b^2 \geq 0$" + "\n\n" +
            r"Always real, always $\geq 0$",
            color=TEXT, fontsize=11, va="top",
            bbox=dict(boxstyle="round,pad=0.5", facecolor=BGCARD, edgecolor=ACC2, alpha=0.9))

    _save(fig, f"{out_dir}/hs_magnitude_squared.png")


def hs_interference(out_dir):
    """Two complex arrows and their sum: constructive vs destructive."""
    fig = _fig(12, 5.5)

    for i, (phi, title, res_color) in enumerate([
        (0,       "φ = 0: Constructive Interference  (P = 4)", ACC2),
        (np.pi/2, "φ = π/2: Partial Interference  (P = 2)",   ACC3),
        (np.pi,   "φ = π: Destructive Interference  (P = 0)", ACC4),
    ]):
        ax = fig.add_axes([0.04 + i*0.325, 0.10, 0.28, 0.78], facecolor=BGCARD)
        ax.set_xlim(-2.4, 2.4); ax.set_ylim(-2.4, 2.4)
        ax.set_aspect("equal")
        ax.set_title(title, color=TEXT, fontsize=9.5, pad=6)
        ax.axhline(0, color=TEXTDIM, lw=0.7); ax.axvline(0, color=TEXTDIM, lw=0.7)
        ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)
        ax.tick_params(colors=TEXTSUB, labelsize=7)

        # A₁ = 1 (along real axis)
        A1x, A1y = 1.0, 0.0
        # A₂ = e^{iφ}
        A2x, A2y = np.cos(phi), np.sin(phi)
        # Sum
        Sx, Sy = A1x + A2x, A1y + A2y

        # Draw A₁ from origin
        _arrow(ax, 0, 0, A1x, A1y, ACC5, lw=2.5, hw=0.07, hl=0.12)
        ax.text(A1x/2, -0.25, r"$A_1=1$", color=ACC5, fontsize=9, ha="center")

        # Draw A₂ from tip of A₁
        _arrow(ax, A1x, A1y, A2x, A2y, ACC3, lw=2.5, hw=0.07, hl=0.12)
        ax.text(A1x+A2x/2+0.1, A1y+A2y/2+0.1, r"$A_2=e^{i\phi}$", 
                color=ACC3, fontsize=9, ha="left")

        # Draw resultant from origin
        if abs(Sx) + abs(Sy) > 0.05:
            _arrow(ax, 0, 0, Sx, Sy, res_color, lw=3, hw=0.09, hl=0.14)
        
        P = Sx**2 + Sy**2
        ax.text(0, -2.1, f"P = |A₁+A₂|² = {P:.1f}", 
                color=res_color, fontsize=9.5, ha="center", fontweight="bold",
                bbox=dict(boxstyle="round,pad=0.3", facecolor=BG, edgecolor=res_color, alpha=0.8))

        for spine in ax.spines.values():
            spine.set_color(TEXTDIM)

    fig.text(0.5, 0.97, r"Superposition: $P = |A_1 + A_2|^2 = |A_1|^2 + |A_2|^2 + 2\,\mathrm{Re}(A_1^*A_2)$",
             color=TEXT, fontsize=12, ha="center", va="top")
    fig.patch.set_facecolor(BG)
    _save(fig, f"{out_dir}/hs_interference.png")


def hs_phase_circle(out_dir):
    """P(φ) = 2 + 2cosφ: the interference pattern as a function of phase."""
    fig = _fig(10, 5)
    ax  = _ax(fig, [0.09, 0.12, 0.56, 0.80])
    ax2 = fig.add_axes([0.68, 0.12, 0.28, 0.80], facecolor=BGCARD, polar=True)

    phi = np.linspace(0, 2*np.pi, 400)
    P   = 2 + 2*np.cos(phi)

    # Left: cartesian plot
    ax.plot(phi, P, color=ACC1, lw=2.5)
    ax.fill_between(phi, 0, P, color=ACC1, alpha=0.15)
    ax.axhline(0, color=TEXTDIM, lw=0.7)
    ax.set_xlim(0, 2*np.pi)
    ax.set_ylim(-0.3, 4.5)
    ax.set_xlabel("Phase difference φ", color=TEXTSUB, fontsize=10)
    ax.set_ylabel("Probability P(φ)", color=TEXTSUB, fontsize=10)
    ax.set_title(r"$P(\phi) = |1 + e^{i\phi}|^2 = 2 + 2\cos\phi$", 
                 color=TEXT, fontsize=12, pad=8)
    ax.set_xticks([0, np.pi/2, np.pi, 3*np.pi/2, 2*np.pi])
    ax.set_xticklabels(["0", "π/2", "π", "3π/2", "2π"], color=TEXTSUB, fontsize=9)
    ax.set_yticks([0, 1, 2, 3, 4])

    # Mark constructive and destructive
    ax.scatter([0, 2*np.pi], [4, 4], color=ACC2, s=80, zorder=5)
    ax.scatter([np.pi], [0], color=ACC4, s=80, zorder=5)
    ax.text(0.1, 4.1, "Constructive\nP = 4", color=ACC2, fontsize=9, va="bottom")
    ax.text(np.pi, 0.15, "Destructive\nP = 0", color=ACC4, fontsize=9, ha="center")
    ax.grid(True, color=TEXTDIM, alpha=0.25, lw=0.5)

    # Right: polar plot
    ax2.plot(phi, P, color=ACC3, lw=2)
    ax2.fill(phi, P, color=ACC3, alpha=0.15)
    ax2.set_facecolor(BGCARD)
    ax2.tick_params(colors=TEXTSUB, labelsize=8)
    ax2.set_title("Polar view", color=TEXT, fontsize=10, pad=10)
    ax2.grid(color=TEXTDIM, alpha=0.3)

    _save(fig, f"{out_dir}/hs_phase_circle.png")


# ═══════════════════════════════════════════════════════════════════════════════
# BegUG DIAGRAMS
# ═══════════════════════════════════════════════════════════════════════════════

def begug_vector_basis(out_dir):
    """2D basis decomposition: |ψ⟩ = c₁|1⟩ + c₂|2⟩."""
    fig = _fig(10, 6)
    ax  = _ax(fig, [0.09, 0.09, 0.83, 0.83])

    ax.set_xlim(-0.5, 3.5); ax.set_ylim(-0.5, 3.2)
    ax.set_aspect("equal")
    ax.set_title(r"$|\psi\rangle = c_1|1\rangle + c_2|2\rangle$  —  Basis Decomposition in 2D", 
                 color=TEXT, fontsize=12, pad=10)
    ax.axhline(0, color=TEXTDIM, lw=0.8); ax.axvline(0, color=TEXTDIM, lw=0.8)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)

    # Basis vectors (unit length along axes)
    _arrow(ax, 0, 0, 1, 0, ACC3, lw=2.5, hw=0.07, hl=0.1)
    _arrow(ax, 0, 0, 0, 1, ACC2, lw=2.5, hw=0.07, hl=0.1)
    _label(ax, 1.1, -0.18, r"$|1\rangle$", ACC3, fs=14)
    _label(ax, -0.22, 1.1, r"$|2\rangle$", ACC2, fs=14)

    # State vector |ψ⟩ = 2.0|1⟩ + 1.5|2⟩
    c1, c2 = 2.0, 1.5
    _arrow(ax, 0, 0, c1, c2, ACC1, lw=3.5, hw=0.09, hl=0.14)
    _label(ax, c1+0.18, c2+0.15, r"$|\psi\rangle$", ACC1, fs=15, fontweight="bold")

    # Component projections (dashed)
    ax.plot([0, c1], [0, 0], "--", color=ACC3, lw=1.8, alpha=0.7)
    ax.plot([c1, c1], [0, c2], "--", color=ACC3, lw=1.3, alpha=0.5)
    ax.plot([0, 0], [0, c2], "--", color=ACC2, lw=1.8, alpha=0.7)
    ax.plot([0, c1], [c2, c2], "--", color=ACC2, lw=1.3, alpha=0.5)

    # Component labels
    _label(ax, c1/2, -0.25, f"c₁ = ⟨1|ψ⟩ = {c1}", ACC3, fs=11)
    _label(ax, -0.42, c2/2, f"c₂ = {c2}", ACC2, fs=11, ha="right")

    # Probability annotations
    P1, P2 = c1**2/(c1**2+c2**2), c2**2/(c1**2+c2**2)
    ax.text(2.0, 0.4, 
            f"After normalising:\nP(1) = |c₁|² = {P1:.2f}\nP(2) = |c₂|² = {P2:.2f}\nSum = 1.00 ✓",
            color=TEXT, fontsize=10,
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC1, alpha=0.9))

    # Inner product annotation
    ax.text(0.05, 2.9,
            r"$c_n = \langle n|\psi\rangle$  (projection = inner product)",
            color=TEXTSUB, fontsize=10, style="italic")

    _save(fig, f"{out_dir}/begug_vector_basis.png")


def begug_normalisation(out_dir):
    """Unit circle: all normalised states ⟨ψ|ψ⟩=1 lie on it."""
    fig = _fig(9, 5.5)
    ax  = _ax(fig, [0.10, 0.08, 0.82, 0.85])

    ax.set_xlim(-1.6, 1.6); ax.set_ylim(-1.6, 1.6)
    ax.set_aspect("equal")
    ax.set_title(r"Normalisation: $\langle\psi|\psi\rangle = |c_1|^2 + |c_2|^2 = 1$"
                 "\n(All normalised states live on the unit circle)", 
                 color=TEXT, fontsize=11.5, pad=8)
    ax.axhline(0, color=TEXTDIM, lw=0.7); ax.axvline(0, color=TEXTDIM, lw=0.7)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)
    ax.set_xlabel(r"$\mathrm{Re}(c_1)$", color=TEXTSUB, fontsize=10)
    ax.set_ylabel(r"$\mathrm{Re}(c_2)$  (simplified to real)", color=TEXTSUB, fontsize=10)

    # Unit circle
    theta = np.linspace(0, 2*np.pi, 300)
    ax.plot(np.cos(theta), np.sin(theta), color=ACC1, lw=2.5, label="Unit sphere (normalised states)")
    ax.fill_between(np.cos(theta), 0, np.sin(theta), color=ACC1, alpha=0.06)

    # Several normalised states
    states = [(1, 0, r"$|1\rangle$"), (0, 1, r"$|2\rangle$"),
              (1/np.sqrt(2), 1/np.sqrt(2), r"$\frac{1}{\sqrt{2}}(|1\rangle+|2\rangle)$"),
              (np.cos(np.pi/6), np.sin(np.pi/6), r"$|\psi\rangle$")]
    colors  = [ACC3, ACC2, ACC4, ACC1]
    for (cx, cy, lbl), col in zip(states, colors):
        _arrow(ax, 0, 0, cx, cy, col, lw=2, hw=0.05, hl=0.09)
        off = 0.14
        ax.text(cx+off*np.sign(cx+0.01), cy+off*np.sign(cy+0.01), lbl, 
                color=col, fontsize=10, ha="center")

    # Not normalised state
    ax.scatter([1.4], [0.7], color=TEXTDIM, s=60, marker="x", zorder=5)
    ax.text(1.42, 0.75, "not normalised\n|c|² ≠ 1", color=TEXTDIM, fontsize=8.5, va="bottom")

    ax.legend(loc="lower right", fontsize=9, labelcolor=TEXT, 
              facecolor=BGCARD, edgecolor=TEXTDIM, framealpha=0.8)
    _save(fig, f"{out_dir}/begug_normalisation.png")


def begug_inner_product_projection(out_dir):
    """The inner product ⟨n|ψ⟩ as a geometric projection."""
    fig = _fig(10, 5.5)
    ax  = _ax(fig, [0.09, 0.09, 0.83, 0.83])

    ax.set_xlim(-0.3, 3.2); ax.set_ylim(-0.5, 2.8)
    ax.set_aspect("equal")
    ax.set_title(r"$c_n = \langle n|\psi\rangle$  —  The Component as a Projection (Inner Product)", 
                 color=TEXT, fontsize=12, pad=10)
    ax.axhline(0, color=TEXTDIM, lw=0.8); ax.axvline(0, color=TEXTDIM, lw=0.7)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)

    # Basis vector |n⟩ along x
    _arrow(ax, 0, 0, 2.5, 0, ACC3, lw=2.5, hw=0.07, hl=0.1)
    _label(ax, 2.6, -0.2, r"$|n\rangle$", ACC3, fs=14)

    # State |ψ⟩
    psi_x, psi_y = 1.8, 2.0
    _arrow(ax, 0, 0, psi_x, psi_y, ACC1, lw=3, hw=0.07, hl=0.12)
    _label(ax, psi_x+0.12, psi_y+0.12, r"$|\psi\rangle$", ACC1, fs=14, fontweight="bold")

    # Projection of |ψ⟩ onto |n⟩
    proj = psi_x  # since |n⟩ is unit along x: ⟨n|ψ⟩ = psi_x
    ax.plot([proj, psi_x], [0, psi_y], "--", color=TEXTSUB, lw=1.5, alpha=0.6)
    ax.plot([proj, proj], [0, 0], "o", color=ACC2, ms=8, zorder=5)
    ax.plot([0, proj], [0, 0], color=ACC2, lw=3, alpha=0.8)
    _label(ax, proj/2, -0.22, r"$c_n = \langle n|\psi\rangle = $ " + f"{proj:.1f}", ACC2, fs=11)

    # Right angle mark
    sq = 0.12
    ax.plot([proj-sq, proj-sq, proj], [0, sq, sq], color=TEXTSUB, lw=1.2, alpha=0.7)

    # Angle label
    theta = np.arctan2(psi_y, psi_x)
    arc_t = np.linspace(0, theta, 50)
    ax.plot(0.6*np.cos(arc_t), 0.6*np.sin(arc_t), color=ACC4, lw=1.8)
    _label(ax, 0.5, 0.22, "θ", ACC4, fs=12)
    _label(ax, 1.5, 1.4, r"$c_n = |\psi|\cos\theta$", TEXTSUB, fs=10, style="italic")

    ax.text(0.05, 2.55,
            r"$P(n) = |c_n|^2 = |\langle n|\psi\rangle|^2$",
            color=TEXT, fontsize=11,
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC2, alpha=0.9))

    _save(fig, f"{out_dir}/begug_inner_product.png")


# ═══════════════════════════════════════════════════════════════════════════════
# AdvUG DIAGRAMS
# ═══════════════════════════════════════════════════════════════════════════════

def advug_cauchy_schwarz(out_dir):
    """C-S: angle between vectors, |cos θ| ≤ 1."""
    fig = _fig(10, 5.5)
    ax  = _ax(fig, [0.09, 0.09, 0.83, 0.83])

    ax.set_xlim(-0.3, 3.5); ax.set_ylim(-0.3, 2.8)
    ax.set_aspect("equal")
    ax.set_title(r"Cauchy-Schwarz: $|\langle\phi|\psi\rangle|^2 \leq \|\phi\|^2\|\psi\|^2$"
                 "  —  Angle Between States", 
                 color=TEXT, fontsize=12, pad=10)
    ax.axhline(0, color=TEXTDIM, lw=0.7); ax.axvline(0, color=TEXTDIM, lw=0.7)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)

    # Two vectors
    phi = np.array([2.5, 0.5])
    psi = np.array([1.2, 2.0])
    _arrow(ax, 0, 0, *phi, ACC3, lw=3, hw=0.07, hl=0.12)
    _arrow(ax, 0, 0, *psi, ACC1, lw=3, hw=0.07, hl=0.12)
    _label(ax, phi[0]+0.15, phi[1]+0.1, r"$|\phi\rangle$", ACC3, fs=14)
    _label(ax, psi[0]+0.12, psi[1]+0.12, r"$|\psi\rangle$", ACC1, fs=14)

    # Angle between them
    cos_theta = np.dot(phi, psi) / (np.linalg.norm(phi) * np.linalg.norm(psi))
    theta_rad = np.arccos(cos_theta)
    angle_phi = np.arctan2(phi[1], phi[0])
    angle_psi = np.arctan2(psi[1], psi[0])
    arc_t = np.linspace(angle_phi, angle_psi, 60)
    r_arc = 0.7
    ax.plot(r_arc*np.cos(arc_t), r_arc*np.sin(arc_t), color=ACC4, lw=2.5)
    mid_angle = (angle_phi + angle_psi) / 2
    _label(ax, 0.85*np.cos(mid_angle), 0.85*np.sin(mid_angle), 
           f"θ", ACC4, fs=13)

    # Projection of psi onto phi
    proj_len = np.dot(psi, phi/np.linalg.norm(phi))
    proj_vec = proj_len * phi/np.linalg.norm(phi)
    ax.plot([proj_vec[0], psi[0]], [proj_vec[1], psi[1]], 
            "--", color=TEXTSUB, lw=1.5, alpha=0.7)
    ax.plot(*proj_vec, "o", color=ACC2, ms=7, zorder=5)
    ax.plot([0, proj_vec[0]], [0, proj_vec[1]], color=ACC2, lw=2.5, alpha=0.7)
    _label(ax, proj_vec[0]/2, -0.2, r"$\langle\phi|\psi\rangle / \|\phi\|$", ACC2, fs=10)

    # CS box
    ax.text(1.7, 0.1, 
            f"|⟨φ|ψ⟩| = {abs(np.dot(phi,psi)):.2f}\n"
            f"‖φ‖·‖ψ‖ = {np.linalg.norm(phi)*np.linalg.norm(psi):.2f}\n"
            f"cos θ = {cos_theta:.3f}\n"
            r"$|\langle\phi|\psi\rangle|^2 \leq \|\phi\|^2\|\psi\|^2$  ✓",
            color=TEXT, fontsize=10, va="bottom",
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC4, alpha=0.9))

    _save(fig, f"{out_dir}/advug_cauchy_schwarz.png")


def advug_triangle_inequality(out_dir):
    """Vector triangle in 2D illustrating ‖φ+ψ‖ ≤ ‖φ‖+‖ψ‖."""
    fig = _fig(9, 5.5)
    ax  = _ax(fig, [0.09, 0.09, 0.83, 0.83])

    ax.set_xlim(-0.5, 4.0); ax.set_ylim(-0.5, 3.0)
    ax.set_aspect("equal")
    ax.set_title(r"Triangle Inequality: $\|\phi + \psi\| \leq \|\phi\| + \|\psi\|$", 
                 color=TEXT, fontsize=12, pad=10)
    ax.axhline(0, color=TEXTDIM, lw=0.7); ax.axvline(0, color=TEXTDIM, lw=0.7)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)

    phi = np.array([2.0, 0.4])
    psi = np.array([0.8, 1.8])
    tot = phi + psi

    # φ from origin
    _arrow(ax, 0, 0, *phi, ACC3, lw=3, hw=0.07, hl=0.12)
    _label(ax, phi[0]/2, phi[1]/2-0.22, r"$|\phi\rangle$", ACC3, fs=13)

    # ψ from tip of φ
    _arrow(ax, phi[0], phi[1], psi[0], psi[1], ACC2, lw=3, hw=0.07, hl=0.12)
    _label(ax, phi[0]+psi[0]/2+0.12, phi[1]+psi[1]/2+0.1, r"$|\psi\rangle$", ACC2, fs=13)

    # Resultant φ+ψ
    _arrow(ax, 0, 0, *tot, ACC1, lw=3.5, hw=0.09, hl=0.14)
    _label(ax, tot[0]/2-0.3, tot[1]/2+0.18, r"$|\phi\rangle+|\psi\rangle$", ACC1, fs=12, fontweight="bold")

    # Norm labels
    nphi = np.linalg.norm(phi)
    npsi = np.linalg.norm(psi)
    ntot = np.linalg.norm(tot)
    ax.text(0.1, 2.65,
            f"‖φ‖ = {nphi:.2f}\n‖ψ‖ = {npsi:.2f}\n"
            f"‖φ‖+‖ψ‖ = {nphi+npsi:.2f}\n\n"
            f"‖φ+ψ‖ = {ntot:.2f}  ✓\n({ntot:.2f} ≤ {nphi+npsi:.2f})",
            color=TEXT, fontsize=10, va="top",
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC1, alpha=0.9))

    _save(fig, f"{out_dir}/advug_triangle_inequality.png")


def advug_fubini_study(out_dir):
    """Fubini-Study distance on the Bloch circle (2D cross-section)."""
    fig = _fig(9, 5.5)
    ax  = _ax(fig, [0.09, 0.09, 0.83, 0.83])

    ax.set_xlim(-1.55, 1.55); ax.set_ylim(-1.55, 1.55)
    ax.set_aspect("equal")
    ax.set_title(r"Fubini-Study Distance: $d_{\mathrm{FS}} = \arccos(|\langle\phi|\psi\rangle|)$"
                 "\n(The natural metric on rays = Bloch circle arcs)", 
                 color=TEXT, fontsize=11, pad=8)
    ax.axhline(0, color=TEXTDIM, lw=0.7); ax.axvline(0, color=TEXTDIM, lw=0.7)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)

    # Unit circle (rays = points on circle up to sign)
    theta = np.linspace(0, 2*np.pi, 300)
    ax.plot(np.cos(theta), np.sin(theta), color=TEXTDIM, lw=1.5, alpha=0.6, ls="--")

    # Two states as rays (upper semicircle only)
    phi_angle = np.pi/6   # 30°
    psi_angle = np.pi/2   # 90°

    phi_vec = np.array([np.cos(phi_angle), np.sin(phi_angle)])
    psi_vec = np.array([np.cos(psi_angle), np.sin(psi_angle)])

    # Draw rays (line through origin)
    for v, col, lbl in [(phi_vec, ACC3, r"$[\phi]$"), (psi_vec, ACC1, r"$[\psi]$")]:
        ax.plot([-v[0], v[0]], [-v[1], v[1]], color=col, lw=1.5, alpha=0.4, ls=":")
        _arrow(ax, 0, 0, *v, col, lw=3, hw=0.06, hl=0.10)
        _arrow(ax, 0, 0, -v[0], -v[1], col, lw=1.5, hw=0.04, hl=0.08)
        ax.text(v[0]*1.12, v[1]*1.12, lbl, color=col, fontsize=12, ha="center")
        ax.text(-v[0]*1.12, -v[1]*1.12, lbl, color=col, fontsize=9, ha="center", alpha=0.5)

    # FS arc on upper semicircle
    arc_t = np.linspace(phi_angle, psi_angle, 80)
    ax.plot(np.cos(arc_t), np.sin(arc_t), color=ACC4, lw=3)
    mid = (phi_angle + psi_angle) / 2
    ax.text(1.2*np.cos(mid), 1.2*np.sin(mid), 
            r"$d_{\mathrm{FS}}$", color=ACC4, fontsize=12, ha="center")

    # Overlap annotation
    overlap = abs(np.dot(phi_vec, psi_vec))
    dfs = np.arccos(overlap)
    ax.text(-1.4, -1.35,
            f"|⟨φ|ψ⟩| = {overlap:.3f}\n"
            f"d_FS = arccos({overlap:.3f})\n"
            f"     = {np.degrees(dfs):.1f}°",
            color=TEXT, fontsize=10,
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC4, alpha=0.9))

    ax.text(-0.2, -1.48, "Same ray → d = 0", color=TEXTSUB, fontsize=9, ha="center")

    _save(fig, f"{out_dir}/advug_fubini_study.png")


# ═══════════════════════════════════════════════════════════════════════════════
# MSc DIAGRAMS
# ═══════════════════════════════════════════════════════════════════════════════

def msc_projective_space(out_dir):
    """Lines through origin in ℝ²: rays as equivalence classes."""
    fig = _fig(10, 5.5)
    ax  = _ax(fig, [0.09, 0.09, 0.83, 0.83])

    ax.set_xlim(-2.5, 2.5); ax.set_ylim(-2.5, 2.5)
    ax.set_aspect("equal")
    ax.set_title(r"Projective Space $\mathbb{P}(\mathcal{H})$: States are Rays (Lines Through Origin)", 
                 color=TEXT, fontsize=12, pad=10)
    ax.axhline(0, color=TEXTDIM, lw=0.7); ax.axvline(0, color=TEXTDIM, lw=0.7)
    ax.grid(True, color=TEXTDIM, alpha=0.15, lw=0.5)

    # Draw several rays (lines through origin)
    ray_angles = [0, np.pi/5, 2*np.pi/5, 3*np.pi/5, 4*np.pi/5]
    ray_colors = [ACC1, ACC2, ACC3, ACC4, ACC5]
    for angle, col in zip(ray_angles, ray_colors):
        dx, dy = np.cos(angle), np.sin(angle)
        ax.plot([-2.2*dx, 2.2*dx], [-2.2*dy, 2.2*dy], 
                color=col, lw=2, alpha=0.7)
        # Mark one representative on each ray (upper half)
        rx, ry = 1.5*dx, 1.5*dy
        if ry < 0: rx, ry = -rx, -ry
        ax.scatter([rx], [ry], color=col, s=80, zorder=5)
        ax.scatter([-rx], [-ry], color=col, s=80, zorder=5,
                   marker="o", facecolors="none", edgecolors=col, lw=2)

        # Phase arrows (different vectors on same ray)
        for scale, alpha in [(0.9, 0.9), (1.2, 0.6)]:
            _arrow(ax, 0, 0, scale*rx, scale*ry, col, 
                   lw=1.5 if scale < 1 else 2, hw=0.05, hl=0.08)

    ax.text(-2.4, 2.3,
            "Each line = one RAY = one physical state\n"
            r"$|\psi\rangle$ and $e^{i\theta}|\psi\rangle$ → same ray",
            color=TEXT, fontsize=10, va="top",
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC1, alpha=0.9))

    ax.text(1.0, -2.2,
            "Filled = representative\nHollow = same ray,\ndifferent global phase",
            color=TEXTSUB, fontsize=9, ha="center",
            bbox=dict(boxstyle="round,pad=0.3", facecolor=BGCARD, edgecolor=TEXTDIM, alpha=0.8))

    _save(fig, f"{out_dir}/msc_projective_space.png")


def msc_bloch_sphere(out_dir):
    """3D Bloch sphere with key states labelled."""
    fig = plt.figure(figsize=(9, 7), facecolor=BG, dpi=150)
    ax  = fig.add_subplot(111, projection="3d", facecolor=BG)
    ax.set_facecolor(BG)

    # Sphere surface (wireframe)
    u = np.linspace(0, 2*np.pi, 40)
    v = np.linspace(0, np.pi, 30)
    xs = np.outer(np.cos(u), np.sin(v))
    ys = np.outer(np.sin(u), np.sin(v))
    zs = np.outer(np.ones_like(u), np.cos(v))
    ax.plot_wireframe(xs, ys, zs, color=TEXTDIM, alpha=0.15, lw=0.5, rstride=3, cstride=3)

    # Axes
    for (start, end, col) in [
        ((-1.4,0,0),(1.4,0,0), ACC3),
        ((0,-1.4,0),(0,1.4,0), ACC2),
        ((0,0,-1.4),(0,0,1.4), ACC1),
    ]:
        ax.quiver(*start, *(np.array(end)-np.array(start)), 
                  color=col, lw=1.5, alpha=0.6, arrow_length_ratio=0.12)

    # Key states
    states_3d = [
        ((0, 0,  1), r"|+z⟩ = |0⟩", ACC1, "top"),
        ((0, 0, -1), r"|-z⟩ = |1⟩", ACC4, "bottom"),
        ((1, 0,  0), r"|+x⟩", ACC3, "top"),
        ((0, 1,  0), r"|+y⟩", ACC2, "top"),
    ]
    for (x,y,z), lbl, col, va in states_3d:
        ax.scatter([x], [y], [z], color=col, s=80, zorder=5)
        ax.text(x*1.18, y*1.18, z*1.18, lbl, color=col, fontsize=10, va=va)

    # A general state vector
    theta0, phi0 = np.pi/4, np.pi/5
    bx = np.sin(theta0)*np.cos(phi0)
    by = np.sin(theta0)*np.sin(phi0)
    bz = np.cos(theta0)
    ax.quiver(0, 0, 0, bx, by, bz, color=ACC5, lw=2.5, arrow_length_ratio=0.15)
    ax.text(bx*1.22, by*1.22, bz*1.22, r"$|\psi\rangle$", color=ACC5, fontsize=12, fontweight="bold")

    # Equator circle
    eq_t = np.linspace(0, 2*np.pi, 100)
    ax.plot(np.cos(eq_t), np.sin(eq_t), 0, color=TEXTDIM, lw=1, alpha=0.5, ls="--")

    ax.set_title("Bloch Sphere: $\\mathbb{P}(\\mathbb{C}^2) \\cong S^2$\n"
                 "Every pure qubit state = one point on the sphere",
                 color=TEXT, fontsize=11, pad=10)
    ax.tick_params(colors=TEXTSUB, labelsize=7)
    ax.set_xlabel("X", color=ACC3, fontsize=9); ax.set_ylabel("Y", color=ACC2, fontsize=9)
    ax.set_zlabel("Z", color=ACC1, fontsize=9)
    for pane in [ax.xaxis.pane, ax.yaxis.pane, ax.zaxis.pane]:
        pane.fill = False
        pane.set_edgecolor(TEXTDIM)

    _save(fig, f"{out_dir}/msc_bloch_sphere.png")


# ═══════════════════════════════════════════════════════════════════════════════
# PhD DIAGRAMS
# ═══════════════════════════════════════════════════════════════════════════════

def phd_completeness_cauchy(out_dir):
    """A Cauchy sequence of functions converging in L²."""
    fig = _fig(10, 5.5)
    ax  = _ax(fig, [0.09, 0.10, 0.83, 0.82])

    x = np.linspace(0, 1, 400)
    ax.set_xlim(0, 1); ax.set_ylim(-0.3, 1.5)
    ax.set_title("Completeness: Every Cauchy Sequence Converges in $\\mathcal{H}$\n"
                 r"Approx. $f(x) = \sqrt{x}$ by partial Fourier sums in $L^2([0,1])$",
                 color=TEXT, fontsize=11.5, pad=8)
    ax.set_xlabel("x", color=TEXTSUB, fontsize=10)
    ax.set_ylabel("$f_n(x)$", color=TEXTSUB, fontsize=10)
    ax.grid(True, color=TEXTDIM, alpha=0.2, lw=0.5)

    # Target function √x
    f_exact = np.sqrt(x)
    ax.plot(x, f_exact, color=TEXT, lw=2.5, label=r"$f(x) = \sqrt{x}$ (limit)", zorder=5)

    # Partial sums approximating √x
    colors_seq = [ACC4, ACC3, ACC2, ACC1]
    for n, col in zip([2, 5, 15, 40], colors_seq):
        # Fourier-like approximation
        approx = np.zeros_like(x)
        for k in range(1, n+1):
            coeff = 2 * np.trapezoid(f_exact * np.sin(k*np.pi*x), x)
            approx += coeff * np.sin(k*np.pi*x)
        err = np.sqrt(np.trapezoid((approx - f_exact)**2, x))
        ax.plot(x, approx, color=col, lw=1.5, alpha=0.85,
                label=f"$f_{{{n}}}$: {n} terms  (‖err‖ = {err:.3f})")

    ax.legend(loc="upper left", fontsize=9, labelcolor=TEXT,
              facecolor=BGCARD, edgecolor=TEXTDIM, framealpha=0.85)
    ax.text(0.55, 0.12,
            "Without completeness:\nthe limit might not exist\nin the space!\n"
            r"($L^2$ is complete, so $f \in L^2$  ✓)",
            color=TEXT, fontsize=10,
            bbox=dict(boxstyle="round,pad=0.4", facecolor=BGCARD, edgecolor=ACC1, alpha=0.9))

    _save(fig, f"{out_dir}/phd_completeness.png")


def phd_domain_subtlety(out_dir):
    """Hermitian vs self-adjoint: domain diagram."""
    fig = _fig(10, 5.5)
    ax  = fig.add_axes([0.05, 0.05, 0.90, 0.90], facecolor=BG)
    ax.set_xlim(0, 10); ax.set_ylim(0, 7)
    ax.axis("off")
    ax.set_title("Hermitian vs Self-Adjoint: Domain Diagram", 
                 color=TEXT, fontsize=13, pad=0)

    def ellipse(cx, cy, rx, ry, color, alpha=0.18, ls="-", lw=2):
        e = mpatches.Ellipse((cx, cy), 2*rx, 2*ry, 
                              facecolor=color, alpha=alpha,
                              edgecolor=color, linewidth=lw, linestyle=ls)
        ax.add_patch(e)
        return e

    # Hilbert space H (outermost)
    ellipse(5, 3.5, 4.6, 3.0, TEXTDIM, alpha=0.08, lw=1.5, ls="--")
    ax.text(9.2, 6.1, r"$\mathcal{H}$", color=TEXTDIM, fontsize=14)

    # D(A†) — domain of adjoint
    ellipse(5, 3.5, 3.5, 2.2, ACC3, alpha=0.12, lw=2)
    ax.text(8.2, 5.4, r"$\mathcal{D}(\hat{A}^\dagger)$", color=ACC3, fontsize=12)

    # D(A) — domain of A (strictly smaller for merely Hermitian)
    ellipse(4.5, 3.5, 2.2, 1.4, ACC1, alpha=0.20, lw=2.5)
    ax.text(2.0, 4.6, r"$\mathcal{D}(\hat{A})$", color=ACC1, fontsize=12)

    # Self-adjoint case: D(A) = D(A†) — shown as equal circles
    ellipse(7.5, 1.5, 1.0, 0.7, ACC2, alpha=0.25, lw=2.5)
    ellipse(7.5, 1.5, 1.0, 0.7, ACC2, alpha=0, lw=2, ls="--")
    ax.text(7.5, 2.38, "Self-adjoint:", color=ACC2, fontsize=10, ha="center")
    ax.text(7.5, 2.05, r"$\mathcal{D}(\hat{A}) = \mathcal{D}(\hat{A}^\dagger)$", 
            color=ACC2, fontsize=10, ha="center")

    # Labels
    ax.text(4.5, 3.5,
            "Hermitian\n(symmetric)\nregion",
            color=ACC1, fontsize=10, ha="center", va="center",
            bbox=dict(boxstyle="round,pad=0.3", facecolor=BG, alpha=0.7))

    ax.text(6.3, 3.8,
            r"Extra domain:" + "\n" + r"$\mathcal{D}(\hat{A}^\dagger) \setminus \mathcal{D}(\hat{A})$",
            color=ACC3, fontsize=9.5, ha="center",
            bbox=dict(boxstyle="round,pad=0.3", facecolor=BG, alpha=0.7))

    ax.text(0.4, 1.0,
            "Merely Hermitian: $\\hat{A}$ symmetric on $\\mathcal{D}(\\hat{A})$,\n"
            "   but $\\mathcal{D}(\\hat{A}) \\subsetneq \\mathcal{D}(\\hat{A}^\\dagger)$\n"
            "   → no spectral theorem, no Stone's theorem\n\n"
            "Self-adjoint: $\\mathcal{D}(\\hat{A}) = \\mathcal{D}(\\hat{A}^\\dagger)$\n"
            "   → spectral theorem holds ✓",
            color=TEXT, fontsize=10, va="bottom",
            bbox=dict(boxstyle="round,pad=0.5", facecolor=BGCARD, edgecolor=ACC1, alpha=0.9))

    _save(fig, f"{out_dir}/phd_domain_subtlety.png")


# ═══════════════════════════════════════════════════════════════════════════════
# RUNNER
# ═══════════════════════════════════════════════════════════════════════════════

ALL_DIAGRAMS = {
    # HS
    "hs_complex_plane":        hs_complex_plane,
    "hs_magnitude_squared":    hs_magnitude_squared,
    "hs_interference":         hs_interference,
    "hs_phase_circle":         hs_phase_circle,
    # BegUG
    "begug_vector_basis":      begug_vector_basis,
    "begug_normalisation":     begug_normalisation,
    "begug_inner_product":     begug_inner_product_projection,
    # AdvUG
    "advug_cauchy_schwarz":    advug_cauchy_schwarz,
    "advug_triangle_ineq":     advug_triangle_inequality,
    "advug_fubini_study":      advug_fubini_study,
    # MSc
    "msc_projective_space":    msc_projective_space,
    "msc_bloch_sphere":        msc_bloch_sphere,
    # PhD
    "phd_completeness":        phd_completeness_cauchy,
    "phd_domain_subtlety":     phd_domain_subtlety,
}


def generate_all(out_dir: str) -> dict[str, str]:
    """Generate all diagrams. Returns {name: path}."""
    import time
    os.makedirs(out_dir, exist_ok=True)
    paths = {}
    for name, fn in ALL_DIAGRAMS.items():
        t0 = time.time()
        fn(out_dir)
        path = f"{out_dir}/{name}.png"
        size = os.path.getsize(path) // 1024
        print(f"  {name:<30} {size:4d}KB  ({time.time()-t0:.1f}s)")
        paths[name] = path
    return paths


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "build/L01/diagrams"
    print(f"Generating {len(ALL_DIAGRAMS)} concept diagrams → {out}/")
    paths = generate_all(out)
    print(f"\nDone: {len(paths)} diagrams")
