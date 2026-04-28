#!/usr/bin/env python3
"""
Extended diagram renderer — generates all per-slide diagrams for v4 deck.
Produces a JSON cache of base64 PNG images keyed by diagram name.
"""
import sys, json, io, base64
sys.path.insert(0, '/home/claude')

import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import matplotlib.patches as patches
from matplotlib.patches import FancyArrowPatch, Arc
import numpy as np

BG    = "#0D1B2A"
PANEL = "#1A2A3A"
MID   = "#1B2E4A"
ACC1  = "#00B4D8"
ACC2  = "#48CAE4"
ACC3  = "#90E0EF"
TEAL  = "#0096B7"
GOLD  = "#FFB703"
AMBER = "#FB8500"
WHITE = "#FFFFFF"
OFF   = "#E8F4F8"
MUTED = "#8DB0C8"
GREEN = "#06D6A0"
PURP  = "#9B5DE5"
RED   = "#EF476F"
PINK  = "#FF6B9D"

def savefig(fig, dpi=200):
    buf = io.BytesIO()
    fig.savefig(buf, format='png', dpi=dpi, bbox_inches='tight',
                facecolor=fig.get_facecolor(), edgecolor='none')
    plt.close(fig)
    buf.seek(0)
    return "image/png;base64," + base64.b64encode(buf.read()).decode()

# ─────────────────────────────────────────────────────────────────────────────
def ray_diagram_freespace():
    fig, ax = plt.subplots(figsize=(5.5, 2.2), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-1.8,1.8)
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.5)
    ax.text(5, -1.2, '← d →', color=GOLD, fontsize=12, ha='center', va='center', fontweight='bold')
    for yo in [-0.9, 0, 0.9]:
        ax.annotate('', xy=(9.5,yo), xytext=(0.5,yo),
                    arrowprops=dict(arrowstyle='->', color=ACC1, lw=2.0))
    ax.text(0.3, 0.0, 'P₁', color=ACC3, fontsize=10, ha='center', va='center')
    ax.text(9.7, 0.0, 'P₂', color=ACC3, fontsize=10, ha='center', va='center')
    ax.axvline(0.5, color=MUTED, lw=1, alpha=0.4)
    ax.axvline(9.5, color=MUTED, lw=1, alpha=0.4)
    ax.set_title('Free-space propagation', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def ray_diagram_thinlens():
    fig, ax = plt.subplots(figsize=(5.5, 2.8), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-2,2)
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.5)
    lx = 5.0
    # Lens symbol — biconvex
    theta = np.linspace(-np.pi/2.8, np.pi/2.8, 80)
    R = 2.2
    x1 = R*np.cos(theta) - R*np.cos(np.pi/2.8) + lx + 0.25
    x2 = -R*np.cos(theta) + R*np.cos(np.pi/2.8) + lx - 0.25
    y_  = R*np.sin(theta)
    ax.plot(x1, y_, color=GOLD, lw=2.5)
    ax.plot(x2, y_, color=GOLD, lw=2.5)
    ax.fill_betweenx(y_, x2, x1, alpha=0.12, color=GOLD)
    # Focal points
    f = 2.5
    for fx, lbl in [(lx-f,'F'), (lx+f,"F'")]:
        ax.plot(fx, 0, 'o', color=GOLD, ms=7, zorder=5)
        ax.text(fx, -0.35, lbl, color=GOLD, fontsize=10, ha='center', fontweight='bold')
    # Rays — parallel in, converge to F'
    for yo in [-1.2, 0, 1.2]:
        ax.annotate('', xy=(lx, yo), xytext=(0.5, yo),
                    arrowprops=dict(arrowstyle='->', color=ACC1, lw=1.8))
        ax.annotate('', xy=(lx+f, 0), xytext=(lx, yo),
                    arrowprops=dict(arrowstyle='->', color=GREEN, lw=1.8))
    ax.text(2.5, 1.55, 'Parallel input rays', color=ACC1, fontsize=9, ha='center')
    ax.text(7.5, 0.7, 'Converge at F\'', color=GREEN, fontsize=9, ha='center')
    ax.set_title('Thin converging lens — focal point', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def ray_diagram_mirror():
    fig, ax = plt.subplots(figsize=(5.5, 2.8), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-2,2)
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.5)
    # Concave mirror at x=9
    theta_m = np.linspace(np.pi*0.55, np.pi*1.45, 100)
    R = 4.0; cx = 9+R
    xm = R*np.cos(theta_m) + cx - R; ym = R*np.sin(theta_m)
    ax.plot(xm, ym, color=TEAL, lw=4)
    ax.fill_betweenx(ym, xm, xm+0.18, color=TEAL, alpha=0.35)
    # Focal point
    f = R/2
    ax.plot(9-f, 0, 'o', color=GOLD, ms=7, zorder=5)
    ax.text(9-f, -0.38, 'F', color=GOLD, fontsize=11, ha='center', fontweight='bold')
    # Parallel rays → reflect to F
    for yo in [-1.1, 0, 1.1]:
        ix = xm[50] if yo==0 else xm[50]+0.15*abs(yo)
        iy = ym[50] if yo==0 else yo
        ax.annotate('', xy=(ix, yo), xytext=(0.5, yo),
                    arrowprops=dict(arrowstyle='->', color=ACC1, lw=1.8))
        ax.annotate('', xy=(9-f, 0), xytext=(ix, yo),
                    arrowprops=dict(arrowstyle='->', color=AMBER, lw=1.8, ls='dashed' if yo!=0 else 'solid'))
    ax.text(2.5, 1.55, 'Parallel input rays', color=ACC1, fontsize=9, ha='center')
    ax.text(5.5, 0.9, 'Reflected to F', color=AMBER, fontsize=9, ha='center')
    ax.set_title('Concave mirror — focal point F = R/2', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def ray_diagram_grin():
    fig, ax = plt.subplots(figsize=(5.5, 2.8), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-2,2)
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.5)
    # GRIN rod body
    ax.add_patch(mpatches.Rectangle((2.5,-1.4), 5, 2.8, facecolor=TEAL, alpha=0.12, edgecolor=TEAL, lw=2))
    # Gradient bands
    for i,a in enumerate(np.linspace(0.04,0.22,10)):
        y0 = -1.38 + i*0.25
        ax.axhline(y0, color=TEAL, lw=0.6, alpha=a, xmin=0.26, xmax=0.76)
    ax.text(5, 0, 'n(r)', color=TEAL, fontsize=15, ha='center', va='center', fontweight='bold')
    # Curved ray paths — sinusoidal inside GRIN
    t = np.linspace(2.5, 7.5, 300)
    for amp, col in [(1.2, ACC1), (-1.2, GREEN), (0.0, GOLD)]:
        y = amp * np.cos(np.pi*(t-2.5)/5.0)
        ax.plot(t, y, color=col, lw=2.0)
        if t[0] == t[0]:
            ax.annotate('', xy=(0.5, amp), xytext=(0.5, amp),
                        arrowprops=dict(arrowstyle='->', color=col, lw=1.5))
        ax.plot([0.5, 2.5], [amp, amp], color=col, lw=1.8)
        ax.plot([7.5, 9.5], [amp, y[-1]], color=col, lw=1.8)
    ax.text(1.5, 1.55, 'Input rays', color=OFF, fontsize=9, ha='center')
    ax.text(5.0, -1.72, 'Curved paths inside GRIN rod', color=TEAL, fontsize=9, ha='center')
    ax.set_title('GRIN rod: self-focusing by gradient index', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def ray_diagram_slab():
    fig, ax = plt.subplots(figsize=(5.5, 2.8), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-2,2)
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.5)
    ax.add_patch(mpatches.Rectangle((3.5,-1.5), 3, 3, facecolor=GOLD, alpha=0.12, edgecolor=GOLD, lw=2))
    ax.text(5, 0, 'n', color=GOLD, fontsize=18, ha='center', va='center', fontweight='bold')
    ax.text(5, 1.7, 'thickness t', color=GOLD, fontsize=9, ha='center')
    ax.axvline(3.5, color=GOLD, lw=1.2, alpha=0.6)
    ax.axvline(6.5, color=GOLD, lw=1.2, alpha=0.6)
    for yo in [-0.9, 0, 0.9]:
        # Small refraction at entry (slight bend)
        shift = 0.05
        ax.annotate('', xy=(3.5, yo), xytext=(0.5, yo),
                    arrowprops=dict(arrowstyle='->', color=ACC1, lw=2.0))
        ax.plot([3.5, 6.5], [yo, yo+shift], color=ACC1, lw=2.0)
        ax.annotate('', xy=(9.5, yo), xytext=(6.5, yo+shift),
                    arrowprops=dict(arrowstyle='->', color=ACC1, lw=2.0))
    ax.annotate('', xy=(5.0, -1.75), xytext=(4.2, -1.75),
                arrowprops=dict(arrowstyle='<->', color=GOLD, lw=1.5))
    ax.text(5.0, -1.95, 't', color=GOLD, fontsize=11, ha='center')
    ax.text(1.5, -1.2, 'Apparent shift δ = t(1−1/n)', color=MUTED, fontsize=9)
    ax.set_title('Dielectric slab: lateral shift & reduced distance', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

# ─────────────────────────────────────────────────────────────────────────────
def pol_diagram_polarizer():
    fig, axes = plt.subplots(1, 3, figsize=(7, 2.5), facecolor=BG)
    titles = ['Input: +45°\nlinear', 'H-Polarizer\n(θ=0°)', 'Output: H\nlinear']
    colors_t = [GREEN, ACC1, GOLD]
    for ax, ttl, col in zip(axes, titles, colors_t):
        ax.set_facecolor(PANEL); ax.set_xlim(-1.5,1.5); ax.set_ylim(-1.5,1.5)
        ax.set_aspect('equal'); ax.axis('off')
        ax.set_title(ttl, color=col, fontsize=9, pad=3)
    ax0, ax1, ax2 = axes
    # Input: +45 ellipse
    t = np.linspace(0,2*np.pi,200)
    ax0.plot(np.cos(t)*0.9, np.sin(t)*0.9, color=GREEN, lw=0.5, alpha=0.3)
    ax0.annotate('', xy=(0.75,0.75), xytext=(-0.75,-0.75),
                 arrowprops=dict(arrowstyle='->', color=GREEN, lw=2.5))
    ax0.text(0,-1.3,'E=(1,1)/√2',color=MUTED,fontsize=7.5,ha='center')
    # Polarizer: wire grid
    for yi in np.linspace(-0.9,0.9,12):
        ax1.plot([-0.6,0.6],[yi,yi],color=MUTED,lw=1.5,alpha=0.7)
    ax1.add_patch(mpatches.Rectangle((-0.65,-0.95),1.3,1.9,fill=False,edgecolor=ACC1,lw=2))
    ax1.text(0,1.1,'blocks V',color=MUTED,fontsize=8,ha='center')
    # Output: H arrow
    ax2.annotate('', xy=(1.0,0), xytext=(-1.0,0),
                 arrowprops=dict(arrowstyle='->', color=GOLD, lw=3))
    ax2.text(0,-1.3,'E=(1,0)',color=MUTED,fontsize=7.5,ha='center')
    fig.suptitle('Polarizer: +45° → H-Polarizer → H linear output', color=OFF, fontsize=10, y=1.02)
    fig.tight_layout(pad=0.5)
    return savefig(fig)

def pol_diagram_waveplate():
    fig, axes = plt.subplots(1, 4, figsize=(9, 2.5), facecolor=BG)
    # QWP: linear → circular
    def draw_pol(ax, ptype, title, col):
        ax.set_facecolor(PANEL); ax.set_xlim(-1.5,1.5); ax.set_ylim(-1.5,1.5)
        ax.set_aspect('equal'); ax.axis('off')
        ax.set_title(title, color=col, fontsize=8.5, pad=3)
        t = np.linspace(0,2*np.pi,200)
        if ptype == 'linear45':
            ax.annotate('',xy=(0.9,0.9),xytext=(-0.9,-0.9),arrowprops=dict(arrowstyle='->',color=col,lw=2.5))
        elif ptype == 'rcp':
            ax.plot(np.cos(t)*0.9, np.sin(t)*0.9, color=col, lw=2.5)
            ax.annotate('',xy=(0.9,0.05),xytext=(0.9,-0.05),arrowprops=dict(arrowstyle='->',color=col,lw=2))
            ax.text(0,0,'↻',color=col,fontsize=16,ha='center',va='center')
        elif ptype == 'linearH':
            ax.annotate('',xy=(1.0,0),xytext=(-1.0,0),arrowprops=dict(arrowstyle='->',color=col,lw=2.5))
        elif ptype == 'linear_45':
            ax.annotate('',xy=(0.9,-0.9),xytext=(-0.9,0.9),arrowprops=dict(arrowstyle='->',color=col,lw=2.5))
        elif ptype == 'qwp':
            ax.add_patch(mpatches.Rectangle((-0.25,-0.95),0.5,1.9,facecolor=TEAL,alpha=0.3,edgecolor=TEAL,lw=2))
            ax.text(0,0,'QWP\nΓ=π/2',color=TEAL,fontsize=8,ha='center',va='center')
        elif ptype == 'hwp':
            ax.add_patch(mpatches.Rectangle((-0.25,-0.95),0.5,1.9,facecolor=GOLD,alpha=0.3,edgecolor=GOLD,lw=2))
            ax.text(0,0,'HWP\nΓ=π',color=GOLD,fontsize=8,ha='center',va='center')

    draw_pol(axes[0], 'linear45', 'Input: +45°\nlinear', GREEN)
    draw_pol(axes[1], 'qwp', 'QWP\n(fast axis H)', TEAL)
    draw_pol(axes[2], 'rcp', 'Output: RCP\ncircular', GOLD)
    draw_pol(axes[3], 'hwp', 'HWP: rotates\nlinear by 2θ', AMBER)
    fig.suptitle('Wave plate polarization transformations', color=OFF, fontsize=10, y=1.02)
    fig.tight_layout(pad=0.5)
    return savefig(fig)

def pol_diagram_bs():
    fig, ax = plt.subplots(figsize=(5.5, 3.0), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-2,3)
    # BS cube
    ax.add_patch(mpatches.Rectangle((3.5,0.5),3,2,facecolor=ACC1,alpha=0.12,edgecolor=ACC1,lw=2))
    ax.plot([3.5,6.5],[0.5,2.5],color=MUTED,lw=1.5,alpha=0.6)
    # Input
    ax.annotate('',xy=(3.5,1.5),xytext=(0.5,1.5),arrowprops=dict(arrowstyle='->',color=ACC1,lw=2.5))
    ax.text(0.3,1.5,'E_in',color=ACC1,fontsize=10,ha='center',va='center')
    # Transmitted
    ax.annotate('',xy=(9.5,1.5),xytext=(6.5,1.5),arrowprops=dict(arrowstyle='->',color=GREEN,lw=2.5))
    ax.text(9.8,1.5,'T\n√T·E',color=GREEN,fontsize=10,ha='center',va='center')
    # Reflected
    ax.annotate('',xy=(5,2.8),xytext=(5,2.5),arrowprops=dict(arrowstyle='->',color=GOLD,lw=2.5))
    ax.text(5,3.0,'R\ni√R·E',color=GOLD,fontsize=10,ha='center',va='center')
    ax.text(5,0.1,'Phase factor i\non reflection',color=MUTED,fontsize=9,ha='center')
    ax.set_title('Beamsplitter: T and R ports with phase i on reflection', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def pol_diagram_faraday():
    fig, axes = plt.subplots(1, 2, figsize=(7, 2.5), facecolor=BG)
    for ax in axes: ax.set_facecolor(PANEL); ax.axis('off')

    # Forward pass
    ax = axes[0]; ax.set_xlim(0,10); ax.set_ylim(-1.5,2.5); ax.set_title('Forward pass (isolated)',color=GREEN,fontsize=9)
    elements = [(1.5,'P(0°)',ACC1),(4.0,'Faraday\n45°',AMBER),(6.5,'P(45°)',ACC1)]
    for ex, lbl, col in elements:
        ax.add_patch(mpatches.Rectangle((ex-0.3,-0.8),0.6,2.6,facecolor=col,alpha=0.2,edgecolor=col,lw=1.5))
        ax.text(ex,2.2,lbl,color=col,fontsize=8,ha='center')
    ax.annotate('',xy=(9.5,0.5),xytext=(0.2,0.5),arrowprops=dict(arrowstyle='->',color=GREEN,lw=2.5))
    ax.text(5.0,-1.2,'0° → 45° → passes (✓)',color=GREEN,fontsize=9,ha='center')

    # Backward pass
    ax = axes[1]; ax.set_xlim(0,10); ax.set_ylim(-1.5,2.5); ax.set_title('Backward pass (blocked!)',color=RED,fontsize=9)
    for ex, lbl, col in elements:
        ax.add_patch(mpatches.Rectangle((ex-0.3,-0.8),0.6,2.6,facecolor=col,alpha=0.2,edgecolor=col,lw=1.5))
        ax.text(ex,2.2,lbl,color=col,fontsize=8,ha='center')
    ax.annotate('',xy=(0.5,0.5),xytext=(9.3,0.5),arrowprops=dict(arrowstyle='->',color=RED,lw=2.5))
    ax.text(5.0,-0.3,'45°+45°=90°',color=RED,fontsize=10,ha='center',fontweight='bold')
    ax.text(5.0,-1.2,'→ blocked by P(0°) ✗',color=RED,fontsize=9,ha='center')

    fig.suptitle('Optical Isolator: Faraday rotator non-reciprocal operation', color=OFF, fontsize=10, y=1.02)
    fig.tight_layout(pad=0.5)
    return savefig(fig)

def pol_diagram_eom():
    fig, ax = plt.subplots(figsize=(7, 2.5), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-1.5,2.5)
    voltages = [(0,'V=0\nno change',ACC1),(3.5,'V=Vπ/2\nelliptical',GOLD),(7,'V=Vπ\nV linear',AMBER)]
    t = np.linspace(0,2*np.pi,200)
    for x0, lbl, col in voltages:
        ax.add_patch(mpatches.Rectangle((x0+0.2,0.0),2.2,1.5,facecolor=col,alpha=0.1,edgecolor=col,lw=1.5))
        ax.text(x0+1.3,1.7,lbl,color=col,fontsize=8.5,ha='center')
    # Input H arrow
    ax.annotate('',xy=(0.25,0.75),xytext=(0.0,0.75),arrowprops=dict(arrowstyle='->',color=WHITE,lw=2))
    ax.text(0.0,0.2,'H in',color=MUTED,fontsize=8.5,ha='center')
    # V=0: H out
    ax.annotate('',xy=(2.5,0.75),xytext=(2.2,0.75),arrowprops=dict(arrowstyle='->',color=ACC1,lw=2.2))
    ax.text(2.6,0.2,'H out',color=ACC1,fontsize=8.5,ha='center')
    # V=Vπ/2: elliptical
    te = np.linspace(0,2*np.pi,100)
    ax.plot(6.2+0.35*np.cos(te), 0.75+0.55*np.sin(te), color=GOLD, lw=2)
    ax.text(6.2,0.1,'ellip.',color=GOLD,fontsize=8.5,ha='center')
    # V=Vπ: V arrow
    ax.annotate('',xy=(8.5,1.35),xytext=(8.5,0.15),arrowprops=dict(arrowstyle='->',color=AMBER,lw=2.2))
    ax.text(8.9,0.1,'V out',color=AMBER,fontsize=8.5,ha='center')
    ax.set_title('EOM: voltage-controlled polarization rotation (Pockels effect)', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

# ─────────────────────────────────────────────────────────────────────────────
def gaussian_beam_diagram():
    fig, ax = plt.subplots(figsize=(8, 3.0), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(-4,4); ax.set_ylim(-2,2.5)
    z = np.linspace(-3.8, 3.8, 500)
    zR = 1.2; w0 = 0.45
    w = w0 * np.sqrt(1 + (z/zR)**2)
    # Beam envelope
    ax.fill_between(z, -w, w, color=ACC1, alpha=0.15)
    ax.plot(z, w, color=ACC1, lw=2.2)
    ax.plot(z, -w, color=ACC1, lw=2.2)
    # Optical axis
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.4)
    # Waist
    ax.axvline(0, color=GOLD, lw=1.2, ls=':', alpha=0.7)
    ax.annotate('',xy=(0,w0),xytext=(0,0),arrowprops=dict(arrowstyle='<->',color=GOLD,lw=1.5))
    ax.text(0.12, w0/2, 'w₀', color=GOLD, fontsize=12, va='center', fontweight='bold')
    # Rayleigh range
    ax.axvline(zR, color=GREEN, lw=1.2, ls=':', alpha=0.7)
    ax.axvline(-zR, color=GREEN, lw=1.2, ls=':', alpha=0.7)
    ax.annotate('',xy=(zR,0),xytext=(0,0),arrowprops=dict(arrowstyle='<->',color=GREEN,lw=1.5))
    ax.text(zR/2, -0.25, 'z_R', color=GREEN, fontsize=11, ha='center', fontweight='bold')
    ax.annotate('',xy=(0,w(zR)),xytext=(zR,w(zR)),arrowprops=dict(arrowstyle='-',color=GREEN,lw=1,ls='dashed'))
    ax.text(zR+0.1, w(zR), 'w₀√2', color=GREEN, fontsize=9.5, va='center')
    # Far-field divergence angle
    ax.plot([0, 3.5], [0, 3.5*w0/zR], color=AMBER, lw=1.5, ls='--', alpha=0.7)
    ax.plot([0, 3.5], [0, -3.5*w0/zR], color=AMBER, lw=1.5, ls='--', alpha=0.7)
    ax.text(3.6, 3.5*w0/zR, 'θ_div', color=AMBER, fontsize=10, va='center')
    # Labels
    ax.text(-3.5, -1.7, 'Incoming beam', color=ACC3, fontsize=9.5)
    ax.text(1.8, -1.7, 'Diverging', color=ACC3, fontsize=9.5)
    ax.text(0, 2.3, 'Gaussian Beam Geometry: Waist, Rayleigh Range, Divergence', color=OFF, fontsize=11, ha='center')
    fig.tight_layout()
    return savefig(fig)

def gaussian_focusing_diagram():
    fig, ax = plt.subplots(figsize=(8, 2.8), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,12); ax.set_ylim(-2,2.5)
    # Input beam
    z_in = np.linspace(0,4,200); w_in = 0.8
    ax.fill_between(z_in, -w_in*np.ones_like(z_in), w_in*np.ones_like(z_in), color=ACC1, alpha=0.12)
    ax.plot(z_in, w_in*np.ones_like(z_in), color=ACC1, lw=1.8)
    ax.plot(z_in, -w_in*np.ones_like(z_in), color=ACC1, lw=1.8)
    # Lens at x=4
    theta = np.linspace(-np.pi/2.5, np.pi/2.5, 80); R=1.8
    x1l = R*np.cos(theta)-R*np.cos(np.pi/2.5)+4.22; yl = R*np.sin(theta)
    x2l = -R*np.cos(theta)+R*np.cos(np.pi/2.5)+3.78
    ax.plot(x1l, yl, color=GOLD, lw=2.5)
    ax.plot(x2l, yl, color=GOLD, lw=2.5)
    ax.fill_betweenx(yl, x2l, x1l, color=GOLD, alpha=0.15)
    ax.text(4, 2.2, 'Thin lens (f)', color=GOLD, fontsize=10, ha='center', fontweight='bold')
    # Output focused beam
    d2 = 5.0; w0new = 0.22; zR_new = 0.8
    z_out = np.linspace(4, 12, 400)
    z_local = z_out - (4 + d2)
    w_out = w0new * np.sqrt(1 + (z_local/zR_new)**2)
    ax.fill_between(z_out, -w_out, w_out, color=GREEN, alpha=0.18)
    ax.plot(z_out, w_out, color=GREEN, lw=1.8)
    ax.plot(z_out, -w_out, color=GREEN, lw=1.8)
    # New waist
    ax.axvline(4+d2, color=GREEN, lw=1.2, ls=':', alpha=0.7)
    ax.annotate('',xy=(4+d2, w0new),xytext=(4+d2,0),arrowprops=dict(arrowstyle='<->',color=GREEN,lw=1.5))
    ax.text(4+d2+0.15, w0new/2, "w₀'", color=GREEN, fontsize=11, va='center', fontweight='bold')
    # Optical axis
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.35)
    # Labels
    ax.annotate('',xy=(4,-1.7),xytext=(0,-1.7),arrowprops=dict(arrowstyle='<->',color=ACC1,lw=1.2))
    ax.text(2,-1.95,'d₁',color=ACC1,fontsize=11,ha='center')
    ax.annotate('',xy=(4+d2,-1.7),xytext=(4,-1.7),arrowprops=dict(arrowstyle='<->',color=GREEN,lw=1.2))
    ax.text(4+d2/2,-1.95,'d₂',color=GREEN,fontsize=11,ha='center')
    ax.text(2, 1.05, 'Input w₀', color=ACC1, fontsize=9.5, ha='center')
    ax.set_title("Gaussian beam focusing: q-parameter ABCD method", color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

# ─────────────────────────────────────────────────────────────────────────────
def fourier_4f_diagram():
    fig, ax = plt.subplots(figsize=(9, 2.8), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,12); ax.set_ylim(-2,2.5)
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.4)
    f = 2.5
    positions = {'obj': 0, 'L1': f, 'fourier': 2*f, 'L2': 3*f, 'img': 4*f}
    # Lenses
    for lx, lbl, col in [(f,'L₁',ACC1),(3*f,'L₂',ACC1)]:
        theta = np.linspace(-np.pi/2.5, np.pi/2.5, 80); R=1.6
        x1l = R*np.cos(theta)-R*np.cos(np.pi/2.5)+lx+0.22
        x2l = -R*np.cos(theta)+R*np.cos(np.pi/2.5)+lx-0.22
        yl  = R*np.sin(theta)
        ax.plot(x1l, yl, color=GOLD, lw=2.5)
        ax.plot(x2l, yl, color=GOLD, lw=2.5)
        ax.fill_betweenx(yl, x2l, x1l, color=GOLD, alpha=0.12)
        ax.text(lx, 2.2, lbl, color=GOLD, fontsize=10, ha='center', fontweight='bold')
    # Object plane
    ax.axvline(0, color=GREEN, lw=1.5, alpha=0.6)
    ax.text(0, 2.2, 'Object\nplane', color=GREEN, fontsize=8.5, ha='center')
    # Fourier plane
    ax.axvline(2*f, color=PURP, lw=1.5, alpha=0.7, ls='--')
    ax.text(2*f, 2.2, 'Fourier\nplane\n(filter)', color=PURP, fontsize=8.5, ha='center')
    ax.add_patch(mpatches.Rectangle((2*f-0.15,-0.6),0.3,1.2,facecolor=PURP,alpha=0.3,edgecolor=PURP,lw=1.5))
    ax.text(2*f, -1.0, 'H(fx,fy)', color=PURP, fontsize=9, ha='center')
    # Image plane
    ax.axvline(4*f, color=AMBER, lw=1.5, alpha=0.6)
    ax.text(4*f, 2.2, 'Image\nplane', color=AMBER, fontsize=8.5, ha='center')
    # Rays
    for yo, col in [(-1.1,ACC1),(0,GREEN),(1.1,ACC2)]:
        ax.annotate('',xy=(f,yo),xytext=(0,yo),arrowprops=dict(arrowstyle='->',color=col,lw=1.5))
        ax.plot([f,2*f],[yo,0],color=col,lw=1.5)
        ax.plot([2*f,3*f],[0,yo],color=col,lw=1.5)
        ax.annotate('',xy=(4*f,yo),xytext=(3*f,yo),arrowprops=dict(arrowstyle='->',color=col,lw=1.5))
    ax.annotate('',xy=(2*f,-1.85),xytext=(0,-1.85),arrowprops=dict(arrowstyle='<->',color=MUTED,lw=1))
    ax.text(f,-2.1,'f',color=MUTED,fontsize=10,ha='center')
    ax.annotate('',xy=(4*f,-1.85),xytext=(2*f,-1.85),arrowprops=dict(arrowstyle='<->',color=MUTED,lw=1))
    ax.text(3*f,-2.1,'f',color=MUTED,fontsize=10,ha='center')
    ax.set_title('4-f system: object → FT plane (filter) → image', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def diffraction_aperture_diagram():
    fig, ax = plt.subplots(figsize=(7, 3.2), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off'); ax.set_xlim(0,10); ax.set_ylim(-2.5,2.5)
    # Optical axis
    ax.axhline(0, color=MUTED, lw=0.8, ls='--', alpha=0.4)
    # Opaque screen
    ax.add_patch(mpatches.Rectangle((3.5,-2.4),0.15,1.65,facecolor=MUTED,alpha=0.6))
    ax.add_patch(mpatches.Rectangle((3.5,0.75),0.15,1.65,facecolor=MUTED,alpha=0.6))
    ax.text(3.57,-2.5,'Screen',color=MUTED,fontsize=8,ha='center')
    # Aperture
    ax.annotate('',xy=(3.57,0.75),xytext=(3.57,-0.75),arrowprops=dict(arrowstyle='<->',color=GOLD,lw=1.5))
    ax.text(3.9, 0, 'a', color=GOLD, fontsize=13, ha='center', fontweight='bold')
    # Incoming plane wave (arrows)
    for yo in np.linspace(-2.2, 2.2, 9):
        if abs(yo) < 0.72:
            ax.annotate('',xy=(3.5,yo),xytext=(0.3,yo),arrowprops=dict(arrowstyle='->',color=ACC1,lw=1.5))
        else:
            ax.annotate('',xy=(3.42,yo),xytext=(0.3,yo),arrowprops=dict(arrowstyle='->',color=ACC3,lw=1.0,alpha=0.4))
    ax.text(1.5, 2.2, 'Plane wave\nE₀ e^{ikz}', color=ACC1, fontsize=9, ha='center')
    # Diffracted waves
    fan_angles = np.linspace(-1.3, 1.3, 9)
    for angle in fan_angles:
        dx, dy = 6.0, angle*1.2
        alpha = 0.9 - 0.5*abs(angle)/1.3
        ax.annotate('',xy=(3.65+dx, dy),xytext=(3.65,0),
                    arrowprops=dict(arrowstyle='->',color=GREEN,lw=1.5,alpha=alpha))
    # Observation screen
    ax.axvline(9.65, color=AMBER, lw=2, alpha=0.7)
    ax.text(9.65, 2.3, 'Obs.\nscreen\nz', color=AMBER, fontsize=8.5, ha='center')
    # Airy rings suggestion
    ys = [0, 0.5, -0.5, 1.0, -1.0, 1.5, -1.5]
    ints = [1.0, 0.6, 0.6, 0.17, 0.17, 0.04, 0.04]
    for y_r, inten in zip(ys, ints):
        ax.plot(9.65, y_r, 'o', color=GOLD, ms=12*inten+1, alpha=0.9*inten)
    ax.annotate('',xy=(9.65,-1.85),xytext=(3.65,-1.85),arrowprops=dict(arrowstyle='<->',color=MUTED,lw=1.2))
    ax.text(6.65,-2.2,'z',color=MUTED,fontsize=12,ha='center')
    ax.set_title('Diffraction through circular aperture: Airy pattern formation', color=OFF, fontsize=11, pad=4)
    fig.tight_layout()
    return savefig(fig)

def snell_diagram_detailed():
    """High-quality Snell's law diagram with angles and labels."""
    fig, ax = plt.subplots(figsize=(5.5, 5.5), facecolor=BG)
    ax.set_facecolor(BG); ax.axis('off')
    ax.set_xlim(-3, 3); ax.set_ylim(-3.5, 3.5)

    # Interface line
    ax.axhline(0, color=GOLD, lw=2.5, alpha=0.85, zorder=2)
    ax.text(-2.8, -0.18, 'Interface', color=GOLD, fontsize=10, ha='left')
    ax.text(-2.8, 0.08, 'n₁ = 1.0 (air)', color=ACC3, fontsize=9)
    ax.text(-2.8, -0.45, 'n₂ = 1.5 (glass)', color=TEAL, fontsize=9)

    # Medium shading
    ax.fill_between([-3,3], [0,0], [3.5,3.5], color=ACC1, alpha=0.06)
    ax.fill_between([-3,3], [-3.5,-3.5], [0,0], color=TEAL, alpha=0.08)

    # Normal (dashed vertical)
    ax.axvline(0, color=MUTED, lw=1.5, ls='--', alpha=0.7, ymin=0.02, ymax=0.98, zorder=3)
    ax.text(0.07, 3.2, 'Normal', color=MUTED, fontsize=9, ha='left', style='italic')

    # Incident ray (from top-left)
    theta1 = 35  # degrees
    ang1 = np.radians(theta1)
    ix, iy = -np.sin(ang1)*2.8, np.cos(ang1)*2.8
    ax.annotate('', xy=(0,0), xytext=(ix,iy),
                arrowprops=dict(arrowstyle='->', color=ACC1, lw=2.5, mutation_scale=20))
    ax.text(ix*0.55, iy*0.55+0.3, 'Incident\nray', color=ACC1, fontsize=10, ha='center')

    # Angle arc θ₁
    arc1 = Arc((0,0), 0.9, 0.9, angle=0, theta1=90-theta1, theta2=90,
               color=ACC1, lw=1.8)
    ax.add_patch(arc1)
    ax.text(-0.55, 0.55, 'θ₁', color=ACC1, fontsize=14, fontweight='bold')

    # Reflected ray (top-right, symmetric)
    rx, ry = np.sin(ang1)*2.8, np.cos(ang1)*2.8
    ax.annotate('', xy=(rx,ry), xytext=(0,0),
                arrowprops=dict(arrowstyle='->', color=AMBER, lw=2.0,
                               linestyle='dashed', mutation_scale=18))
    ax.text(rx*0.55, ry*0.55+0.25, "Reflected\nray", color=AMBER, fontsize=10, ha='center')
    arc_r = Arc((0,0), 0.9, 0.9, angle=0, theta1=90, theta2=90+theta1,
                color=AMBER, lw=1.8)
    ax.add_patch(arc_r)
    ax.text(0.45, 0.55, "θ₁'", color=AMBER, fontsize=14, fontweight='bold')
    ax.text(0, 2.8, "θ₁ = θ₁'", color=AMBER, fontsize=11, ha='center',
            style='italic', fontweight='bold')

    # Refracted ray (into glass, closer to normal)
    theta2 = np.degrees(np.arcsin(np.sin(ang1)/1.5))
    ang2 = np.radians(theta2)
    tx, ty = np.sin(ang2)*2.5, -np.cos(ang2)*2.5
    ax.annotate('', xy=(tx,ty), xytext=(0,0),
                arrowprops=dict(arrowstyle='->', color=GREEN, lw=2.5, mutation_scale=20))
    ax.text(tx*0.6+0.3, ty*0.6, "Refracted\nray", color=GREEN, fontsize=10, ha='center')

    # Angle arc θ₂
    arc2 = Arc((0,0), 1.0, 1.0, angle=0, theta1=270, theta2=270+theta2,
               color=GREEN, lw=1.8)
    ax.add_patch(arc2)
    ax.text(0.45, -0.65, 'θ₂', color=GREEN, fontsize=14, fontweight='bold')

    # Snell's law annotation
    ax.text(0, -3.1,
            r'n₁ sin θ₁ = n₂ sin θ₂',
            color=GOLD, fontsize=13, ha='center', fontweight='bold',
            bbox=dict(boxstyle='round,pad=0.3', facecolor='#0A1628', edgecolor=GOLD, lw=1.5))
    ax.text(0, -3.5,
            f'θ₁={theta1:.0f}° → θ₂={theta2:.1f}°  (toward normal, n₂>n₁)',
            color=MUTED, fontsize=9, ha='center', style='italic')

    fig.tight_layout(pad=0.4)
    return savefig(fig, dpi=220)

def stokes_poincare_diagram():
    fig = plt.figure(figsize=(5, 4.5), facecolor=BG)
    ax = fig.add_subplot(111, projection='3d')
    ax.set_facecolor(BG)
    fig.patch.set_facecolor(BG)

    # Sphere wireframe
    u = np.linspace(0, 2*np.pi, 40)
    v = np.linspace(0, np.pi, 40)
    xs = np.outer(np.cos(u), np.sin(v))
    ys = np.outer(np.sin(u), np.sin(v))
    zs = np.outer(np.ones(np.size(u)), np.cos(v))
    ax.plot_wireframe(xs, ys, zs, color=TEAL, alpha=0.1, lw=0.5)
    ax.plot_surface(xs, ys, zs, color=TEAL, alpha=0.04)

    # Equator
    eq_t = np.linspace(0, 2*np.pi, 100)
    ax.plot(np.cos(eq_t), np.sin(eq_t), 0, color=ACC1, lw=1.5, alpha=0.7)

    # Poles
    ax.scatter([0],[0],[1], color=GREEN, s=80, zorder=5)
    ax.scatter([0],[0],[-1], color=AMBER, s=80, zorder=5)
    ax.text(0.05, 0.05, 1.15, 'RCP\n[1,0,0,1]', color=GREEN, fontsize=8)
    ax.text(0.05, 0.05, -1.35, 'LCP\n[1,0,0,-1]', color=AMBER, fontsize=8)

    # Equatorial points
    pts = [(1,0,0,'H\n[1,1,0,0]',ACC1),
           (-1,0,0,'V\n[1,-1,0,0]',TEAL),
           (0,1,0,'+45°\n[1,0,1,0]',GOLD),
           (0,-1,0,'-45°\n[1,0,-1,0]',PURP)]
    for x,y,z,lbl,col in pts:
        ax.scatter([x],[y],[z], color=col, s=70, zorder=5)
        ax.text(x*1.2, y*1.2, z, lbl, color=col, fontsize=7.5)

    # Partially polarized point inside
    ax.scatter([0.4],[0.3],[0.5], color=RED, s=80, marker='*', zorder=5)
    ax.text(0.45, 0.35, 0.55, 'Partial\npol.', color=RED, fontsize=7.5)

    # Axes labels (S1,S2,S3)
    ax.set_xlabel('S₁', color=MUTED, fontsize=10, labelpad=5)
    ax.set_ylabel('S₂', color=MUTED, fontsize=10, labelpad=5)
    ax.set_zlabel('S₃', color=MUTED, fontsize=10, labelpad=5)
    ax.tick_params(colors=MUTED, labelsize=7)
    ax.xaxis.pane.fill = False; ax.yaxis.pane.fill = False; ax.zaxis.pane.fill = False
    ax.xaxis.pane.set_edgecolor(MUTED); ax.yaxis.pane.set_edgecolor(MUTED); ax.zaxis.pane.set_edgecolor(MUTED)
    ax.xaxis.pane.set_alpha(0.1); ax.yaxis.pane.set_alpha(0.1); ax.zaxis.pane.set_alpha(0.1)

    ax.set_title('Poincaré Sphere: all polarization states', color=OFF, fontsize=10, pad=8)
    ax.view_init(elev=25, azim=45)
    fig.tight_layout()
    return savefig(fig, dpi=180)

# ─────────────────────────────────────────────────────────────────────────────
print("Generating all diagrams...")
diagrams = {}

jobs = {
    'ray_freespace':         ray_diagram_freespace,
    'ray_thinlens':          ray_diagram_thinlens,
    'ray_mirror':            ray_diagram_mirror,
    'ray_grin':              ray_diagram_grin,
    'ray_slab':              ray_diagram_slab,
    'pol_polarizer':         pol_diagram_polarizer,
    'pol_waveplate':         pol_diagram_waveplate,
    'pol_bs':                pol_diagram_bs,
    'pol_faraday':           pol_diagram_faraday,
    'pol_eom':               pol_diagram_eom,
    'gaussian_beam':         gaussian_beam_diagram,
    'gaussian_focusing':     gaussian_focusing_diagram,
    'fourier_4f':            fourier_4f_diagram,
    'diffraction_aperture':  diffraction_aperture_diagram,
    'snell_detailed':        snell_diagram_detailed,
    'stokes_poincare':       stokes_poincare_diagram,
}

# Also import the render_diagram function for the gallery diagrams
from latex_render import render_diagram
gallery_jobs = {
    'rainbow_spectrum':          lambda: render_diagram('rainbow_spectrum', dpi=200),
    'fourier_modes':             lambda: render_diagram('fourier_modes', dpi=200),
    'optical_component_gallery': lambda: render_diagram('optical_component_gallery', dpi=180),
    'material_gallery':          lambda: render_diagram('material_gallery', dpi=180),
    'telescope_refractor':       lambda: render_diagram('telescope_refractor', dpi=200),
    'telescope_sct':             lambda: render_diagram('telescope_sct', dpi=200),
}
jobs.update(gallery_jobs)

for key, fn in jobs.items():
    try:
        r = fn()
        if r and r.startswith('image'):
            diagrams[key] = r
            print(f'  ✓ {key}  ({len(r)//1000}kb)')
        else:
            print(f'  ✗ {key}')
    except Exception as e:
        print(f'  ✗ {key}: {e}')
        import traceback; traceback.print_exc()

with open('/home/claude/diagram_cache.json', 'w') as f:
    json.dump(diagrams, f)
print(f'\nSaved {len(diagrams)}/{len(jobs)} diagrams to diagram_cache.json')
