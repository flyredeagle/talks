"""
Generate all base chart images for the logistic map presentation.
Run this first. Requires: numpy, matplotlib, Pillow
  pip install numpy matplotlib Pillow
"""
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec

BG = '#0D1B2A'; ACCENT = '#00D4FF'; ORA = '#FF6B35'
LIGHT = '#E8F4F8'; GRID = '#1E3A5F'; GREEN = '#7FFF00'
PURPLE = '#BB86FC'; YELLOW = '#FFD700'

def styled(ax, title='', xl='', yl=''):
    ax.set_facecolor(BG)
    if title: ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold', pad=6)
    if xl:    ax.set_xlabel(xl, color=LIGHT, fontsize=10)
    if yl:    ax.set_ylabel(yl, color=LIGHT, fontsize=10)
    ax.tick_params(colors=LIGHT, labelsize=9)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.35, linewidth=0.7)

# 1. Bifurcation diagram (r=2.5 to 4.0, detail)
fig, ax = plt.subplots(figsize=(10, 5.5), facecolor=BG)
ax.set_facecolor(BG)
r_vals = np.linspace(2.5, 4.0, 3000)
x = 0.5 * np.ones(len(r_vals))
for _ in range(500): x = r_vals * x * (1 - x)
r_plot, x_plot = [], []
for _ in range(200):
    x = r_vals * x * (1 - x)
    r_plot.extend(r_vals.tolist())
    x_plot.extend(x.tolist())
ax.scatter(r_plot, x_plot, s=0.05, c=ACCENT, alpha=0.3)
ax.set_xlabel('Growth parameter r', color=LIGHT, fontsize=14)
ax.set_ylabel('Population x', color=LIGHT, fontsize=14)
ax.set_title('Bifurcation Diagram of the Logistic Map', color=LIGHT, fontsize=16, fontweight='bold', pad=15)
ax.tick_params(colors=LIGHT)
for spine in ax.spines.values(): spine.set_color(GRID)
ax.set_xlim(2.5, 4.0); ax.set_ylim(0, 1)
for rv, label in [(3.0,'r=3'),(3.449,'r≈3.45'),(3.57,'Chaos onset')]:
    ax.axvline(rv, color=ORA, alpha=0.6, linewidth=1, linestyle='--')
    ax.text(rv+0.01, 0.93, label, color=ORA, fontsize=8, rotation=90, va='top')
plt.tight_layout()
plt.savefig('bifurcation.png', dpi=150, bbox_inches='tight', facecolor=BG)
plt.close()
print("bifurcation.png saved")

# 2. Full bifurcation diagram (r=0 to 4)
fig, ax = plt.subplots(figsize=(12, 6), facecolor=BG)
ax.set_facecolor(BG)
r_vals = np.linspace(0.01, 4.0, 4000)
x = 0.5 * np.ones(len(r_vals))
for _ in range(500): x = r_vals * x * (1 - x)
r_plot, x_plot = [], []
for _ in range(300):
    x = r_vals * x * (1 - x)
    r_plot.extend(r_vals.tolist())
    x_plot.extend(x.tolist())
ax.scatter(r_plot, x_plot, s=0.02, c=ACCENT, alpha=0.25)
ax.set_xlabel('Growth parameter r', color=LIGHT, fontsize=14)
ax.set_ylabel('Population x', color=LIGHT, fontsize=14)
ax.set_title('Bifurcation Diagram of the Logistic Map (full range r ∈ [0,4])', color=LIGHT, fontsize=15, fontweight='bold', pad=14)
ax.tick_params(colors=LIGHT)
for spine in ax.spines.values(): spine.set_color(GRID)
ax.set_xlim(0, 4.0); ax.set_ylim(0, 1)
for rv, label, yp in [(1,'r=1\n(birth)',0.85),(3,'r=3\n(period-2)',0.85),(3.449,'r≈3.45\n(period-4)',0.85),(3.57,'Chaos\nonset',0.85)]:
    ax.axvline(rv, color=ORA, alpha=0.5, linewidth=1, linestyle='--')
    ax.text(rv+0.02, yp, label, color=ORA, fontsize=8, va='top')
plt.tight_layout()
plt.savefig('bifurc_full.png', dpi=150, bbox_inches='tight', facecolor=BG)
plt.close()
print("bifurc_full.png saved")

# 3. Time series — three regimes
fig, axes = plt.subplots(1, 3, figsize=(12, 4), facecolor=BG)
fig.patch.set_facecolor(BG)
configs = [(2.8,'r = 2.8\nStable Fixed Point',ACCENT),(3.5,'r = 3.5\nPeriod-4 Cycle',GREEN),(3.9,'r = 3.9\nChaotic Regime',ORA)]
for ax, (r, title, color) in zip(axes, configs):
    x = 0.4
    for _ in range(200): x = r * x * (1 - x)
    xs = []
    for _ in range(40):
        x = r * x * (1 - x); xs.append(x)
    ax.set_facecolor(BG)
    ax.plot(range(len(xs)), xs, color=color, linewidth=2, marker='o', markersize=4)
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('Time step n', color=LIGHT, fontsize=9)
    ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_ylim(0, 1)
    for spine in ax.spines.values(): spine.set_color(GRID)
    ax.yaxis.grid(True, color=GRID, alpha=0.5)
plt.tight_layout()
plt.savefig('timeseries.png', dpi=150, bbox_inches='tight', facecolor=BG)
plt.close()
print("timeseries.png saved")

# 4. Cobweb 2-panel
fig, axes = plt.subplots(1, 2, figsize=(10, 5), facecolor=BG)
fig.patch.set_facecolor(BG)
for ax, (r, title) in zip(axes, [(2.9,'r = 2.9 (Stable)'),(3.9,'r = 3.9 (Chaotic)')]):
    ax.set_facecolor(BG)
    xv = np.linspace(0, 1, 300)
    ax.plot(xv, r*xv*(1-xv), color=ACCENT, linewidth=2)
    ax.plot(xv, xv, color=LIGHT, linewidth=1, linestyle='--', alpha=0.5)
    x = 0.2
    for _ in range(5): x = r*x*(1-x)
    for _ in range(30):
        fx = r*x*(1-x)
        ax.plot([x,x],[x,fx], color=ORA, linewidth=0.8, alpha=0.8)
        ax.plot([x,fx],[fx,fx], color=ORA, linewidth=0.8, alpha=0.8)
        x = fx
    ax.set_title(title, color=LIGHT, fontsize=12, fontweight='bold')
    ax.set_xlabel('xₙ', color=LIGHT, fontsize=10); ax.set_ylabel('xₙ₊₁', color=LIGHT, fontsize=10)
    ax.tick_params(colors=LIGHT); ax.set_xlim(0,1); ax.set_ylim(0,1)
    for spine in ax.spines.values(): spine.set_color(GRID)
plt.tight_layout()
plt.savefig('cobweb.png', dpi=150, bbox_inches='tight', facecolor=BG)
plt.close()
print("cobweb.png saved")

# 5. Cobweb 4-panel
fig, axes = plt.subplots(2, 2, figsize=(11, 9), facecolor=BG)
fig.patch.set_facecolor(BG)
axes = axes.flatten()
configs = [(2.5,'r=2.5: Stable fixed point'),(3.2,'r=3.2: Period-2 orbit'),(3.5,'r=3.5: Period-4 orbit'),(3.9,'r=3.9: Chaos')]
for ax, (r, title) in zip(axes, configs):
    ax.set_facecolor(BG)
    xv = np.linspace(0,1,400)
    ax.plot(xv, r*xv*(1-xv), color=ACCENT, linewidth=2)
    ax.plot(xv, xv, color=LIGHT, linewidth=1, linestyle='--', alpha=0.5)
    x = 0.2
    for _ in range(20): x = r*x*(1-x)
    for _ in range(50):
        fx = r*x*(1-x)
        ax.plot([x,x],[x,fx], color=ORA, linewidth=0.9, alpha=0.85)
        ax.plot([x,fx],[fx,fx], color=ORA, linewidth=0.9, alpha=0.85)
        x = fx
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('xₙ', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ₊₁', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_xlim(0,1); ax.set_ylim(0,1)
    for spine in ax.spines.values(): spine.set_color(GRID)
plt.suptitle('Cobweb Diagrams Across Four Regimes', color=LIGHT, fontsize=14, fontweight='bold', y=1.01)
plt.tight_layout()
plt.savefig('cobweb4.png', dpi=150, bbox_inches='tight', facecolor=BG)
plt.close()
print("cobweb4.png saved")

# 6. Lyapunov exponent
fig, ax = plt.subplots(figsize=(10, 4.5), facecolor=BG)
ax.set_facecolor(BG)
r_arr = np.linspace(2.5, 4.0, 2000)
lyap = np.zeros(len(r_arr))
for i, r in enumerate(r_arr):
    x = 0.5
    for _ in range(500): x = r*x*(1-x)
    s = 0
    for _ in range(1000):
        x = r*x*(1-x)
        if abs(r*(1-2*x)) > 0: s += np.log(abs(r*(1-2*x)))
    lyap[i] = s/1000
ax.plot(r_arr, lyap, color=ACCENT, linewidth=1)
ax.axhline(0, color=ORA, linewidth=1.5, linestyle='--', label='λ = 0 (onset of chaos)')
ax.fill_between(r_arr, lyap, 0, where=(lyap > 0), alpha=0.3, color=ORA, label='Chaos (λ > 0)')
ax.fill_between(r_arr, lyap, 0, where=(lyap < 0), alpha=0.2, color=ACCENT, label='Order (λ < 0)')
ax.set_xlabel('Growth parameter r', color=LIGHT, fontsize=13)
ax.set_ylabel('Lyapunov Exponent λ', color=LIGHT, fontsize=13)
ax.set_title('Lyapunov Exponent vs r', color=LIGHT, fontsize=15, fontweight='bold', pad=15)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=10)
ax.tick_params(colors=LIGHT)
for spine in ax.spines.values(): spine.set_color(GRID)
ax.set_xlim(2.5, 4.0); ax.yaxis.grid(True, color=GRID, alpha=0.5)
plt.tight_layout()
plt.savefig('lyapunov.png', dpi=150, bbox_inches='tight', facecolor=BG)
plt.close()
print("lyapunov.png saved")

print("\nAll base charts generated!")
