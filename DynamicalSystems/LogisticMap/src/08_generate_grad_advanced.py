"""
Generate graduate symbolic dynamics and multifractal charts.
"""
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt

BG = '#0D1B2A'; ACCENT = '#00D4FF'; ORA = '#FF6B35'
LIGHT = '#E8F4F8'; GRID = '#1E3A5F'; GREEN = '#7FFF00'
PURPLE = '#BB86FC'; YELLOW = '#FFD700'

def make_ts(r, n=80, x0=0.5, transient=0):
    x = x0
    for _ in range(transient): x = r*x*(1-x)
    xs = [x]
    for _ in range(n-1): x = r*x*(1-x); xs.append(x)
    return xs

# 1. Symbolic dynamics + autocorrelation
fig, axes = plt.subplots(1, 3, figsize=(13, 4.5), facecolor=BG); fig.patch.set_facecolor(BG)
for ax, (r, col, title) in zip(axes[:2], [(3.8,ACCENT,'Symbolic sequence r=3.8\n(L/R partition at x=0.5)'),(3.95,ORA,'Symbolic sequence r=3.95\n(denser mixing)')]):
    ax.set_facecolor(BG); x = 0.3
    for _ in range(100): x = r*x*(1-x)
    xs = []
    for _ in range(60): x = r*x*(1-x); xs.append(x)
    cols_s = [GREEN if v > 0.5 else ORA for v in xs]
    for i, (v, c) in enumerate(zip(xs, cols_s)): ax.bar(i, v, color=c, alpha=0.8, width=0.9)
    ax.axhline(0.5, color=YELLOW, linewidth=1.5, linestyle='--', label='partition x=0.5')
    ax.set_ylim(0,1); ax.set_title(title, color=LIGHT, fontsize=10, fontweight='bold')
    ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8)
    for sp in ax.spines.values(): sp.set_color(GRID)
    ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8)
ax = axes[2]; ax.set_facecolor(BG)
r = 4.0; x = 0.4; traj = []
for _ in range(5000): x = r*x*(1-x); traj.append(x)
traj = np.array(traj); mean = np.mean(traj); traj_c = traj - mean
lags = range(0, 40)
corrs = [np.mean(traj_c[:-lag if lag>0 else len(traj_c)]*traj_c[lag:])/np.var(traj_c) if lag>0 else 1.0 for lag in lags]
ax.plot(lags, corrs, color=PURPLE, linewidth=2, marker='o', markersize=3)
ax.axhline(0, color=LIGHT, linewidth=0.8, alpha=0.5)
ax.fill_between(lags, corrs, 0, where=np.array(corrs)>0, alpha=0.2, color=PURPLE)
ax.set_title('Autocorrelation function (r=4)\nRapid decay → mixing', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('Lag', color=LIGHT, fontsize=9); ax.set_ylabel('C(lag)', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
plt.tight_layout(); plt.savefig('grad_symbolic.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("grad_symbolic.png saved")

# 2. Topological entropy, multifractal, renormalisation
fig, axes = plt.subplots(1, 3, figsize=(13, 4.5), facecolor=BG); fig.patch.set_facecolor(BG)
r_arr = np.linspace(2.5, 4.0, 2000); lyap = np.zeros(len(r_arr))
for i, r in enumerate(r_arr):
    xv = 0.5
    for _ in range(500): xv = r*xv*(1-xv)
    s = 0
    for _ in range(2000):
        xv = r*xv*(1-xv)
        d = abs(r*(1-2*xv))
        if d > 1e-12: s += np.log(d)
    lyap[i] = s/2000
ax = axes[0]; ax.set_facecolor(BG)
ax.plot(r_arr, np.maximum(lyap,0), color=ACCENT, linewidth=1.5, label='Topological entropy h(r)')
ax.axhline(np.log(2), color=ORA, linewidth=1.2, linestyle='--', label='ln 2 (max at r=4)')
ax.fill_between(r_arr, np.maximum(lyap,0), 0, alpha=0.2, color=ACCENT)
ax.set_title('Topological Entropy h(r)\n(zero in ordered regime, ln2 at r=4)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('r', color=LIGHT, fontsize=9); ax.set_ylabel('h(r)', color=LIGHT, fontsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
ax = axes[1]; ax.set_facecolor(BG)
alpha_vals = np.linspace(0.3, 1.7, 200); f_alpha = 1 - 2*(alpha_vals-1)**2
ax.plot(alpha_vals, f_alpha, color=GREEN, linewidth=2.5, label='f(α) spectrum (r=4, approx)')
ax.axvline(1.0, color=YELLOW, linewidth=1.2, linestyle='--', alpha=0.7, label='α=1 (typical pts)')
ax.fill_between(alpha_vals, 0, f_alpha, where=f_alpha>0, alpha=0.2, color=GREEN)
ax.set_xlim(0.2,1.8); ax.set_ylim(-0.1,1.15)
ax.set_title('Multifractal Spectrum f(α)\n(r=4: parabolic, Hölder exponent α)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('α (Hölder exponent)', color=LIGHT, fontsize=9); ax.set_ylabel('f(α)', color=LIGHT, fontsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
ax = axes[2]; ax.set_facecolor(BG)
x_s = np.linspace(-1,1,400)
g0 = 1 - 1.527633*x_s**2; g1 = 1 - 1.527633*(1-1.527633*x_s**2)**2
ax.plot(x_s, g0, color=ACCENT, linewidth=2, label='f (logistic, rescaled)')
ax.plot(x_s, g1, color=ORA, linewidth=2, linestyle='--', label='T(f) after 1 renorm step')
ax.axhline(0, color=LIGHT, linewidth=0.5, alpha=0.4); ax.axvline(0, color=LIGHT, linewidth=0.5, alpha=0.4)
ax.set_ylim(-2,1.2); ax.set_xlim(-1,1)
ax.set_title('Renormalisation Operator T\nConvergence to universal fixed pt g*', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('x', color=LIGHT, fontsize=9); ax.set_ylabel('g(x)', color=LIGHT, fontsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
plt.tight_layout(); plt.savefig('grad_advanced.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("grad_advanced.png saved")

print("\nAll graduate advanced charts generated!")
