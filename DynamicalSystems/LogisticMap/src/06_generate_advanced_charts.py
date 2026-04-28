"""
Generate advanced charts: butterfly effect, phase space, intermittency,
Devaney chaos, period-3 window, invariant density, ODE diagrams,
graduate/PhD level plots.
"""
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib.colors import LinearSegmentedColormap

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

# 1. Butterfly effect (sensitive dependence) — FIXED version
r, eps, N = 3.9, 1e-5, 55
x1, x2 = 0.5, 0.5 + eps
xs1, xs2, diffs = [], [], []
for _ in range(N):
    xs1.append(x1); xs2.append(x2); diffs.append(abs(x1 - x2))
    x1 = r*x1*(1-x1); x2 = r*x2*(1-x2)
ns = np.arange(N)
fig, axes = plt.subplots(1, 2, figsize=(13, 5.5), facecolor=BG)
fig.patch.set_facecolor(BG)
ax = axes[0]; ax.set_facecolor(BG)
ax.plot(ns, xs1, color=ACCENT, linewidth=1.6, label='x₀ = 0.500000', zorder=3)
ax.plot(ns, xs2, color=ORA, linewidth=1.6, linestyle='--', label='x₀ = 0.500010  (ε = 10⁻⁵)', alpha=0.9, zorder=2)
div_n = next(n for n,d in enumerate(diffs) if d > 0.05)
ax.axvspan(0, div_n, alpha=0.08, color=ACCENT); ax.axvspan(div_n, N-1, alpha=0.08, color=ORA)
ax.axvline(div_n, color=GREEN, linewidth=1.4, linestyle=':', alpha=0.8)
ax.text(div_n+0.5, 0.05, f'n≈{div_n}\ndiverge', color=GREEN, fontsize=9)
ax.set_xlim(0, N-1); ax.set_ylim(-0.02, 1.05)
ax.set_title(f'Two Chaotic Orbits — r = {r}\nIdentical-looking until n≈35, then completely different', color=LIGHT, fontsize=11, fontweight='bold', pad=8)
ax.set_xlabel('Time step  n', color=LIGHT, fontsize=10); ax.set_ylabel('xₙ', color=LIGHT, fontsize=10)
ax.tick_params(colors=LIGHT, labelsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9, loc='upper right')
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3, linewidth=0.6)
ax = axes[1]; ax.set_facecolor(BG)
ns_plot = [n for n,d in zip(ns, diffs) if 0 < d < 0.5]
ds_plot = [d for d in diffs if 0 < d < 0.5]
ax.semilogy(ns_plot, ds_plot, color=GREEN, linewidth=2.5, marker='o', markersize=3, label='|δxₙ|  (measured)')
fit_ns = np.array([n for n,d in zip(ns,diffs) if 2<=n<=30 and d>0])
fit_ds = np.array([d for n,d in zip(ns,diffs) if 2<=n<=30 and d>0])
coeffs = np.polyfit(fit_ns, np.log(fit_ds), 1); lam_fit = coeffs[0]; A_fit = np.exp(coeffs[1])
n_th = np.linspace(0, max(ns_plot), 200)
ax.semilogy(n_th, A_fit*np.exp(lam_fit*n_th), color=ORA, linewidth=2.0, linestyle='--', label=f'ε·e^(λn),  λ = {lam_fit:.3f}')
ax.axvline(div_n, color=ACCENT, linewidth=1.3, linestyle=':', alpha=0.7)
ax.text(div_n+0.5, ds_plot[div_n//2] if div_n//2 < len(ds_plot) else ds_plot[-1], f'n≈{div_n}', color=ACCENT, fontsize=9)
ax.set_xlim(0, max(ns_plot)+2)
ax.set_title(f'Exponential Divergence  |δxₙ|  (log scale)\nSlope λ ≈ {lam_fit:.3f}  (theory: ln 2 ≈ 0.693 for r = 4)', color=LIGHT, fontsize=11, fontweight='bold', pad=8)
ax.set_xlabel('Time step  n', color=LIGHT, fontsize=10); ax.set_ylabel('|δxₙ|', color=LIGHT, fontsize=10)
ax.tick_params(colors=LIGHT, labelsize=9); ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3, linewidth=0.6)
plt.tight_layout(pad=1.8); plt.savefig('butterfly.png', dpi=160, bbox_inches='tight', facecolor=BG); plt.close()
print("butterfly.png saved")

# 2. Phase space
fig, axes = plt.subplots(1, 3, figsize=(13, 4.5), facecolor=BG)
fig.patch.set_facecolor(BG)
for ax, (r, title) in zip(axes, [(2.9,'Fixed Point\nr=2.9'),(3.5,'Limit Cycle\nr=3.5'),(3.9,'Chaotic Attractor\nr=3.9')]):
    ax.set_facecolor(BG); x = 0.5
    for _ in range(200): x = r*x*(1-x)
    xs = []
    for _ in range(2000): x = r*x*(1-x); xs.append(x)
    ax.scatter(xs[:-1], xs[1:], s=2, c=ACCENT, alpha=0.5)
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('xₙ', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ₊₁', color=LIGHT, fontsize=9)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_xlim(0,1); ax.set_ylim(0,1)
    for sp in ax.spines.values(): sp.set_color(GRID)
plt.tight_layout(); plt.savefig('phasespace.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("phasespace.png saved")

# 3. Invariant density at r=4
fig, ax = plt.subplots(figsize=(10, 4.5), facecolor=BG); ax.set_facecolor(BG)
r = 4.0; x = 0.5; data = []
for _ in range(100000): x = r*x*(1-x); data.append(x)
ax.hist(data, bins=200, density=True, color=ACCENT, alpha=0.7)
xv = np.linspace(0.001, 0.999, 500)
ax.plot(xv, 1.0/(np.pi*np.sqrt(xv*(1-xv))), color=ORA, linewidth=2.5, label='ρ(x) = 1/[π√(x(1−x))]  (exact)')
ax.set_title('Invariant Density Distribution at r = 4 (fully chaotic)', color=LIGHT, fontsize=14, fontweight='bold', pad=12)
ax.set_xlabel('x', color=LIGHT, fontsize=12); ax.set_ylabel('ρ(x)', color=LIGHT, fontsize=12)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=11)
ax.tick_params(colors=LIGHT); ax.set_ylim(0, 8)
for sp in ax.spines.values(): sp.set_color(GRID)
plt.tight_layout(); plt.savefig('invariant_density.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("invariant_density.png saved")

# 4. Period-3 window zoom
fig, axes = plt.subplots(1, 2, figsize=(12, 5), facecolor=BG); fig.patch.set_facecolor(BG)
for ax, (rlo, rhi, title) in zip(axes, [(3.7,4.0,'Zoom: Chaotic region with period-3 window (r ≈ 3.83)'),(3.82,3.86,'Zoom: Period-3 window in detail')]):
    ax.set_facecolor(BG)
    r_v = np.linspace(rlo, rhi, 2000); x = 0.5*np.ones(len(r_v))
    for _ in range(500): x = r_v*x*(1-x)
    rp, xp = [], []
    for _ in range(200): x = r_v*x*(1-x); rp.extend(r_v.tolist()); xp.extend(x.tolist())
    ax.scatter(rp, xp, s=0.05, c=ACCENT, alpha=0.3)
    ax.set_title(title, color=LIGHT, fontsize=11, fontweight='bold')
    ax.set_xlabel('r', color=LIGHT, fontsize=10); ax.set_ylabel('x', color=LIGHT, fontsize=10)
    ax.tick_params(colors=LIGHT, labelsize=8); ax.set_xlim(rlo, rhi); ax.set_ylim(0, 1)
    for sp in ax.spines.values(): sp.set_color(GRID)
plt.tight_layout(); plt.savefig('period3_window.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("period3_window.png saved")

# 5. Intermittency detail
fig, axes = plt.subplots(1, 2, figsize=(13, 5), facecolor=BG); fig.patch.set_facecolor(BG)
ax = axes[0]; ax.set_facecolor(BG)
xs = make_ts(3.8282, n=300, x0=0.5, transient=0)
ax.plot(xs, color=YELLOW, linewidth=0.9, alpha=0.9)
ax.set_title('Pomeau–Manneville Intermittency at r = 3.8282', color=LIGHT, fontsize=11, fontweight='bold')
ax.set_xlabel('Time step n', color=LIGHT, fontsize=10); ax.set_ylabel('xₙ', color=LIGHT, fontsize=10)
ax.tick_params(colors=LIGHT, labelsize=8); ax.set_ylim(0, 1)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.35)
ax = axes[1]; ax.set_facecolor(BG)
xs_below = make_ts(3.8282, n=60, x0=0.4, transient=0)
xs_at    = make_ts(3.8284, n=60, x0=0.4, transient=500)
xs_above = make_ts(3.845,  n=60, x0=0.4, transient=500)
ax.plot(xs_below, color=YELLOW, linewidth=1.5, label='r=3.8282 (intermittent)', alpha=0.9)
ax.plot(xs_at,    color=GREEN,  linewidth=1.8, label='r=3.8284 (period-3 window)', alpha=0.9)
ax.plot(xs_above, color=ORA,    linewidth=1.5, label='r=3.845 (chaos resumed)', alpha=0.7)
ax.set_title('Transition into and out of Period-3 Window', color=LIGHT, fontsize=11, fontweight='bold')
ax.set_xlabel('Time step n', color=LIGHT, fontsize=10); ax.set_ylabel('xₙ', color=LIGHT, fontsize=10)
ax.tick_params(colors=LIGHT, labelsize=8)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9); ax.set_ylim(0, 1)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.35)
plt.tight_layout(); plt.savefig('intermittency_detail.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("intermittency_detail.png saved")

# 6. Devaney chaos (r=4)
fig, axes = plt.subplots(1, 3, figsize=(14, 4.5), facecolor=BG); fig.patch.set_facecolor(BG)
r = 4.0
ax = axes[0]; ax.set_facecolor(BG)
for x0 in [0.1, 0.3, 0.5, 0.7, 0.9]:
    ax.plot(make_ts(r, n=50, x0=x0), linewidth=1, alpha=0.7)
ax.set_title('r=4: Multiple initial conditions\n(all fill [0,1] — topological mixing)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax = axes[1]; ax.set_facecolor(BG)
xs_long = make_ts(r, n=5000, x0=0.3, transient=100)
ax.scatter(xs_long[:-1], xs_long[1:], s=0.3, c=ACCENT, alpha=0.3)
ax.set_title('r=4: Return map (xₙ vs xₙ₊₁)\n(parabola filled = topological mixing)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('xₙ', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ₊₁', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8); ax.set_xlim(0,1); ax.set_ylim(0,1)
for sp in ax.spines.values(): sp.set_color(GRID)
ax = axes[2]; ax.set_facecolor(BG)
epsilons = [1e-3, 1e-6, 1e-9]; cols_dep = [ACCENT, GREEN, ORA]
for eps, col in zip(epsilons, cols_dep):
    xs_ref = make_ts(r, n=60, x0=0.5); xs_pert = make_ts(r, n=60, x0=0.5+eps)
    diffs = [abs(a-b) for a,b in zip(xs_ref, xs_pert)]
    valid = [(i,d) for i,d in enumerate(diffs) if d > 0]
    if valid: ax.semilogy([i for i,d in valid], [d for i,d in valid], linewidth=1.5, color=col, label=f'ε={eps:.0e}', alpha=0.9)
ax.set_title('r=4: Sensitive dependence\n(3 initial separations, log scale)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('|δxₙ|', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8); ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
for sp in ax.spines.values(): sp.set_color(GRID)
plt.tight_layout(); plt.savefig('devaney_chaos.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("devaney_chaos.png saved")

print("\nAll advanced charts generated!")
