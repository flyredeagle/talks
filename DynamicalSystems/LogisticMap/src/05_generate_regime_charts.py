"""
Generate regime-specific chart images.
Run after 04_generate_base_charts.py
"""
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

BG = '#0D1B2A'; ACCENT = '#00D4FF'; ORA = '#FF6B35'
LIGHT = '#E8F4F8'; GRID = '#1E3A5F'; GREEN = '#7FFF00'
PURPLE = '#BB86FC'; YELLOW = '#FFD700'

def make_ts(r, n=80, x0=0.5, transient=0):
    x = x0
    for _ in range(transient): x = r*x*(1-x)
    xs = [x]
    for _ in range(n-1):
        x = r*x*(1-x); xs.append(x)
    return xs

def styled(ax, title='', xl='', yl=''):
    ax.set_facecolor(BG)
    if title: ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold', pad=6)
    if xl:    ax.set_xlabel(xl, color=LIGHT, fontsize=9)
    if yl:    ax.set_ylabel(yl, color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.35, linewidth=0.7)

# --- regime1: extinction
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), facecolor=BG)
fig.patch.set_facecolor(BG)
for ax, (r, col, title) in zip(axes, [(0.5,ORA,'r = 0.5  →  Extinction\n(exponential decay to 0)'),(0.9,ORA,'r = 0.9  →  Slower Extinction\n(still converges to 0)'),(1.0,YELLOW,'r = 1.0  →  Transcritical Bifurcation\n(sub-linear convergence)')]):
    xs = make_ts(r, n=60, x0=0.7)
    ax.set_facecolor(BG); ax.plot(xs, color=col, linewidth=2, marker='o', markersize=4)
    ax.axhline(0, color=ACCENT, linewidth=1, linestyle='--', alpha=0.7)
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('Time step n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_ylim(-0.05, 1.05)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.35)
fig.suptitle('Regime 1: 0 < r ≤ 1 — Extinction', color=LIGHT, fontsize=13, fontweight='bold', y=1.01)
plt.tight_layout(); plt.savefig('regime1_extinction.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("regime1_extinction.png saved")

# --- regime2: stable fixed point
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), facecolor=BG)
fig.patch.set_facecolor(BG)
for ax, (r, col, title) in zip(axes, [(1.5,GREEN,'r = 1.5  →  Monotone Convergence\n(1 < r < 2: no oscillation)'),(2.5,GREEN,'r = 2.5  →  Damped Oscillation\n(2 < r < 3: oscillates, then converges)'),(2.9,GREEN,'r = 2.9  →  Strongly Damped\n(near bifurcation: slow convergence)')]):
    xs = make_ts(r, n=50, x0=0.1)
    fp = 1 - 1/r
    ax.set_facecolor(BG); ax.plot(xs, color=col, linewidth=2, marker='o', markersize=4)
    ax.axhline(fp, color=ACCENT, linewidth=1.5, linestyle='--', alpha=0.8, label=f'x*={fp:.3f}')
    ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('Time step n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_ylim(-0.05, 1.05)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.35)
fig.suptitle('Regime 2: 1 < r < 3 — Stable Fixed Point x* = 1 − 1/r', color=LIGHT, fontsize=13, fontweight='bold', y=1.01)
plt.tight_layout(); plt.savefig('regime2_fixed.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("regime2_fixed.png saved")

# --- regime3: period doubling
fig, axes = plt.subplots(1, 4, figsize=(16, 4.5), facecolor=BG)
fig.patch.set_facecolor(BG)
for ax, (r, period, col, title) in zip(axes, [(3.2,2,ACCENT,'r = 3.2  →  Period-2\n(3 < r < 3.449)'),(3.5,4,PURPLE,'r = 3.5  →  Period-4\n(3.449 < r < 3.544)'),(3.55,8,YELLOW,'r = 3.55  →  Period-8\n(3.544 < r < 3.565)'),(3.567,16,ORA,'r = 3.567  →  Period-16\n(near chaos onset)')]):
    xs = make_ts(r, n=60, transient=500)
    ax.set_facecolor(BG); ax.plot(xs, color=col, linewidth=1.8, marker='o', markersize=3.5)
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('Time step n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_ylim(-0.05, 1.05)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.35)
fig.suptitle('Regime 3: Period-Doubling Cascade — 3 < r < r∞ ≈ 3.5699', color=LIGHT, fontsize=13, fontweight='bold', y=1.01)
plt.tight_layout(); plt.savefig('regime3_perioddoubling.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("regime3_perioddoubling.png saved")

# --- regime4: chaos
fig, axes = plt.subplots(1, 4, figsize=(16, 4.5), facecolor=BG)
fig.patch.set_facecolor(BG)
cfgs = [(3.6,'Early Chaos',ORA,80,100),(3.8282,'Intermittency',YELLOW,120,0),(3.8284,'Period-3 Window',GREEN,60,500),(3.9,'Topological Mixing',PURPLE,80,200)]
for ax, (r, label, col, n, trans) in zip(axes, cfgs):
    xs = make_ts(r, n=n, x0=0.4 if label=='Period-3 Window' else 0.5, transient=trans)
    ax.set_facecolor(BG); ax.plot(xs, color=col, linewidth=1.5, marker='o' if n<=60 else None, markersize=2.5)
    ax.set_title(f'r = {r}  →  {label}', color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('Time step n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_ylim(-0.05, 1.05)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.35)
fig.suptitle('Regime 4: Chaotic Regime — r > r∞', color=LIGHT, fontsize=13, fontweight='bold', y=1.01)
plt.tight_layout(); plt.savefig('regime4_chaos.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("regime4_chaos.png saved")

# --- all regimes mosaic
fig = plt.figure(figsize=(14, 10), facecolor=BG)
fig.patch.set_facecolor(BG)
gs = gridspec.GridSpec(3, 3, figure=fig, hspace=0.6, wspace=0.4)
regime_configs = [(0.5,'r=0.5: Extinction',ORA,40,0.7,0),(1.5,'r=1.5: Stable Fixed Point',GREEN,40,0.1,0),(2.5,'r=2.5: Damped Oscillation',GREEN,50,0.1,0),(3.2,'r=3.2: Period-2 Orbit',ACCENT,50,0.5,500),(3.5,'r=3.5: Period-4 Orbit',PURPLE,50,0.5,500),(3.567,'r=3.567: Period-16 Orbit',YELLOW,60,0.5,500),(3.6,'r=3.6: Chaos (early)',ORA,70,0.5,200),(3.8284,'r=3.8284: Period-3 Window',GREEN,60,0.5,500),(3.9,'r=3.9: Full Chaos',ORA,70,0.5,200)]
for i, (r, title, col, n, x0, trans) in enumerate(regime_configs):
    ax = fig.add_subplot(gs[i//3, i%3])
    ax.set_facecolor(BG)
    xs = make_ts(r, n=n, x0=x0, transient=trans)
    ax.plot(xs, color=col, linewidth=1.6, marker='o', markersize=2.5)
    ax.set_title(title, color=LIGHT, fontsize=9, fontweight='bold', pad=4)
    ax.set_ylim(-0.05, 1.05); ax.tick_params(colors=LIGHT, labelsize=7)
    for spine in ax.spines.values(): spine.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.3)
fig.suptitle('All Dynamical Regimes of the Logistic Map', color=LIGHT, fontsize=16, fontweight='bold', y=1.01)
plt.savefig('all_regimes.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("all_regimes.png saved")

print("\nAll regime charts generated!")
