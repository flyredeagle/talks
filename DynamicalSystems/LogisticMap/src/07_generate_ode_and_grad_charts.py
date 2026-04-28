"""
Generate ODE derivation charts and graduate/PhD level charts.
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

def logistic_ode(N0, r, K, t_end=15, dt=0.05):
    t = np.linspace(0, t_end, int(t_end/dt))
    N = K / (1 + (K/N0 - 1)*np.exp(-r*t))
    return t, N

# 1. ODE qualitative behaviours (4-panel)
fig = plt.figure(figsize=(14, 9), facecolor=BG); fig.patch.set_facecolor(BG)
gs = gridspec.GridSpec(2, 2, figure=fig, hspace=0.52, wspace=0.38)
K, r = 100, 0.5
ax1 = fig.add_subplot(gs[0,0]); ax1.set_facecolor(BG)
for N0, col, lbl in [(5,ACCENT,'N₀ = 5 (small IC)'),(50,GREEN,'N₀ = 50 (mid IC)'),(150,ORA,'N₀ = 150 (above K)')]:
    t, N = logistic_ode(N0, r, K)
    ax1.plot(t, N, color=col, linewidth=2.2, label=lbl)
ax1.axhline(K, color=YELLOW, linewidth=1.4, linestyle='--', label=f'Carrying capacity K={K}')
ax1.set_ylim(-5, 175); ax1.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5, loc='center right')
ax1.set_title('Sigmoid Growth: dN/dt = rN(1 − N/K)', color=LIGHT, fontsize=11, fontweight='bold', pad=7)
ax1.set_xlabel('Time t', color=LIGHT, fontsize=10); ax1.set_ylabel('Population N(t)', color=LIGHT, fontsize=10)
ax1.tick_params(colors=LIGHT, labelsize=9)
for sp in ax1.spines.values(): sp.set_color(GRID)
ax1.yaxis.grid(True, color=GRID, alpha=0.35)

ax2 = fig.add_subplot(gs[0,1]); ax2.set_facecolor(BG)
N_vals = np.linspace(-10, 170, 400)
for rv, col in zip([0.3,0.5,0.8],[PURPLE,ACCENT,GREEN]):
    ax2.plot(N_vals, rv*N_vals*(1-N_vals/K), color=col, linewidth=2, label=f'r = {rv}')
ax2.axhline(0, color=LIGHT, linewidth=1, alpha=0.6); ax2.axvline(K, color=YELLOW, linewidth=1.2, linestyle='--', alpha=0.8)
ax2.scatter([0,K],[0,0], color=[ORA,GREEN], s=60, zorder=5)
ax2.set_ylim(-15,25); ax2.set_xlim(-10,170)
ax2.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5)
ax2.set_title('Phase Portrait: dN/dt vs N', color=LIGHT, fontsize=11, fontweight='bold', pad=7)
ax2.set_xlabel('Population N', color=LIGHT, fontsize=10); ax2.set_ylabel('Growth rate dN/dt', color=LIGHT, fontsize=10)
ax2.tick_params(colors=LIGHT, labelsize=9)
for sp in ax2.spines.values(): sp.set_color(GRID)
ax2.yaxis.grid(True, color=GRID, alpha=0.35)

ax3 = fig.add_subplot(gs[1,0]); ax3.set_facecolor(BG)
for rv, col, lbl in [(0.2,PURPLE,'r=0.2 (slow)'),(0.5,ACCENT,'r=0.5 (medium)'),(1.0,GREEN,'r=1.0 (fast)'),(2.0,ORA,'r=2.0 (very fast)')]:
    t, N = logistic_ode(10, rv, 100, t_end=25)
    ax3.plot(t, N, color=col, linewidth=2, label=lbl)
ax3.axhline(100, color=YELLOW, linewidth=1.3, linestyle='--'); ax3.set_ylim(0,115)
ax3.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5)
ax3.set_title('Effect of Growth Rate r on Convergence Speed', color=LIGHT, fontsize=11, fontweight='bold', pad=7)
ax3.set_xlabel('Time t', color=LIGHT, fontsize=10); ax3.set_ylabel('Population N(t)', color=LIGHT, fontsize=10)
ax3.tick_params(colors=LIGHT, labelsize=9)
for sp in ax3.spines.values(): sp.set_color(GRID)
ax3.yaxis.grid(True, color=GRID, alpha=0.35)

ax4 = fig.add_subplot(gs[1,1]); ax4.set_facecolor(BG)
r_range = np.linspace(0, 3, 300)
ax4.plot(r_range, [100]*len(r_range), color=GREEN, linewidth=2.5, label='N*=K (stable)')
ax4.plot(r_range, [0]*len(r_range), color=ORA, linewidth=2.5, linestyle='--', label='N*=0 (unstable)')
ax4.fill_between(r_range, 0, 100, alpha=0.07, color=ACCENT)
ax4.text(1.5, 50, 'Trajectories converge\nto K for ALL r > 0', color=ACCENT, fontsize=9, ha='center')
ax4.set_ylim(-15,120); ax4.set_xlim(0,3)
ax4.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5, loc='center right')
ax4.set_title('ODE: No Chaos — Fixed Points Only', color=LIGHT, fontsize=11, fontweight='bold', pad=7)
ax4.set_xlabel('Growth rate r', color=LIGHT, fontsize=10); ax4.set_ylabel('Fixed-point population N*', color=LIGHT, fontsize=10)
ax4.tick_params(colors=LIGHT, labelsize=9)
for sp in ax4.spines.values(): sp.set_color(GRID)
ax4.yaxis.grid(True, color=GRID, alpha=0.35)

fig.suptitle('The Continuous Logistic ODE: dN/dt = rN(1 − N/K) — Qualitative Behaviours', color=LIGHT, fontsize=14, fontweight='bold', y=1.01)
plt.savefig('ode_behaviours.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("ode_behaviours.png saved")

# 2. ODE to map derivation
fig, axes = plt.subplots(1, 3, figsize=(14, 5), facecolor=BG); fig.patch.set_facecolor(BG)
ax = axes[0]; ax.set_facecolor(BG)
t_cont = np.linspace(0, 6, 400)
N_cont = 1.0 / (1 + (1.0/0.3 - 1)*np.exp(-0.5*t_cont))
ax.plot(t_cont, N_cont, color=ACCENT, linewidth=2, label='Continuous ODE')
Ns = [0.3]
for _ in range(6): n = Ns[-1]; Ns.append(n + 0.5*n*(1-n))
ax.step(range(len(Ns)), Ns, color=ORA, linewidth=2, where='post', label='Euler step h=1')
ax.scatter(range(len(Ns)-1), Ns[:-1], color=ORA, s=40, zorder=5)
ax.axhline(1.0, color=YELLOW, linewidth=1, linestyle='--', alpha=0.7, label='K=1')
ax.set_ylim(0, 1.15); ax.set_xlim(-0.2, 6)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5)
ax.set_title('Step 1: Euler Discretisation\n(h=1, low r — tracks ODE)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('time / generation n', color=LIGHT, fontsize=9); ax.set_ylabel('N / x', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3)

ax = axes[1]; ax.set_facecolor(BG)
xv = np.linspace(0, 1, 200)
for r_eff, col in zip([0.5,1.0,2.0,3.0],[ACCENT,GREEN,ORA,PURPLE]):
    r_disc = 1 + r_eff
    ax.plot(xv, r_disc*xv*(1-xv), color=col, linewidth=2, label=f"r'={r_disc:.1f} (r_eff={r_eff})")
ax.plot(xv, xv, color=LIGHT, linewidth=1, linestyle='--', alpha=0.5, label='y = x')
ax.set_xlim(0,1); ax.set_ylim(0,1)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5)
ax.set_title("Step 2: Rescaled Map  xₙ₊₁ = r'·xₙ(1−xₙ)\nParabola height grows with r' = 1 + r·h", color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('xₙ', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ₊₁', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)

ax = axes[2]; ax.set_facecolor(BG)
r_range2 = np.linspace(0.01, 4.0, 3000)
x_d = 0.5*np.ones(len(r_range2))
for _ in range(500): x_d = r_range2*x_d*(1-x_d)
rp, xp = [], []
for _ in range(200): x_d = r_range2*x_d*(1-x_d); rp.extend(r_range2.tolist()); xp.extend(x_d.tolist())
ax.scatter(rp, xp, s=0.05, c=ACCENT, alpha=0.25, label='Discrete map attractor')
r_ode = np.linspace(1.01, 4.0, 300)
ax.plot(r_ode, 1-1/r_ode, color=GREEN, linewidth=2.5, label='ODE fixed pt x*=1−1/r', zorder=5)
ax.set_xlim(0, 4); ax.set_ylim(0, 1)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8.5, loc='upper left')
ax.set_title('Step 3: ODE fixed pt (green)\nvs Discrete map (cyan) — chaos is new!', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel("r'  (discrete growth rate)", color=LIGHT, fontsize=9); ax.set_ylabel("Attractor x*", color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.axvline(3.0, color=YELLOW, linewidth=1, linestyle=':', alpha=0.7)

fig.suptitle('Deriving the Discrete Logistic Map from the Continuous ODE', color=LIGHT, fontsize=14, fontweight='bold', y=1.01)
plt.savefig('ode_to_map_derivation.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("ode_to_map_derivation.png saved")

# 3. ODE vs map comparison
fig, axes = plt.subplots(2, 3, figsize=(14, 8.5), facecolor=BG); fig.patch.set_facecolor(BG)
def disc_ts(r, n=60, x0=0.5, trans=300):
    x = x0
    for _ in range(trans): x = r*x*(1-x)
    xs = [x]
    for _ in range(n-1): x = r*x*(1-x); xs.append(x)
    return xs
ax = axes[0,0]; ax.set_facecolor(BG)
t, N = logistic_ode(0.05, 0.5, 1.0, t_end=20)
ax.plot(t, N, color=GREEN, linewidth=2.5); ax.axhline(1.0, color=YELLOW, linewidth=1.2, linestyle='--', label='K=1')
ax.set_ylim(0,1.12); ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.set_title('ODE: r=0.5 — Smooth sigmoid\n(all r give same qualitative shape)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('t', color=LIGHT, fontsize=9); ax.set_ylabel('N(t)', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3)
ax = axes[0,1]; ax.set_facecolor(BG)
for Kv, col, lbl in [(0.3,PURPLE,'K=0.3'),(0.6,ACCENT,'K=0.6'),(1.0,GREEN,'K=1.0')]:
    t2, N2 = logistic_ode(0.05, 0.8, Kv, t_end=15)
    ax.plot(t2, N2, color=col, linewidth=2.2, label=lbl)
ax.set_ylim(0,1.12); ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.set_title('ODE: Different carrying capacities\n(population always reaches K smoothly)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('t', color=LIGHT, fontsize=9); ax.set_ylabel('N(t)', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3)
ax = axes[0,2]; ax.set_facecolor(BG)
N_ph = np.linspace(0, 1.3, 8); dN_ph = 0.6*N_ph*(1-N_ph)
for n_val, dn_val in zip(N_ph, dN_ph):
    col = GREEN if dn_val > 0 else ORA
    ax.annotate('', xy=(n_val+0.08*np.sign(dn_val),0), xytext=(n_val,0), arrowprops=dict(arrowstyle='->',color=col,lw=2))
ax.axvline(0, color=ORA, linewidth=2.5, label='N*=0 unstable')
ax.axvline(1.0, color=GREEN, linewidth=2.5, label='N*=K stable')
ax.set_xlim(-0.1,1.35); ax.set_ylim(-0.3,0.3); ax.set_yticks([])
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.set_title('ODE Phase Line: ONE stable attractor\n(No oscillation, no chaos possible)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('N', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax = axes[1,0]; ax.set_facecolor(BG)
xs28 = disc_ts(2.8, n=60, x0=0.05, trans=0)
fp = 1 - 1/2.8
ax.plot(xs28, color=ACCENT, linewidth=2, marker='o', markersize=3.5)
ax.axhline(fp, color=YELLOW, linewidth=1.2, linestyle='--', label=f'x*={fp:.3f}')
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9); ax.set_ylim(0,1.05)
ax.set_title('Map: r=2.8 — Damped oscillation to x*\n(analogous to ODE: same fixed point)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3)
ax = axes[1,1]; ax.set_facecolor(BG)
xs32 = disc_ts(3.3, n=60, trans=500)
ax.plot(xs32, color=ORA, linewidth=2, marker='o', markersize=3.5); ax.set_ylim(0,1.05)
ax.set_title('Map: r=3.3 — Period-2 oscillation\n(NO ODE equivalent — purely discrete!)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3)
ax = axes[1,2]; ax.set_facecolor(BG)
xs39 = disc_ts(3.9, n=80, trans=100)
ax.plot(xs39, color=PURPLE, linewidth=1.5); ax.set_ylim(0,1.05)
ax.set_title('Map: r=3.9 — Chaos\n(completely absent from continuous ODE!)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('xₙ', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
ax.yaxis.grid(True, color=GRID, alpha=0.3)
fig.suptitle('ODE (Continuous) vs Discrete Map — Qualitative Comparison', color=LIGHT, fontsize=14, fontweight='bold', y=1.01)
plt.tight_layout(); plt.savefig('ode_vs_map.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("ode_vs_map.png saved")

# 4. Graduate: Feigenbaum constants
fig, axes = plt.subplots(1, 3, figsize=(13, 4.5), facecolor=BG); fig.patch.set_facecolor(BG)
r_vals = np.linspace(3.82, 3.87, 2000); x = 0.5*np.ones(len(r_vals))
for _ in range(500): x = r_vals*x*(1-x)
rp, xp = [], []
for _ in range(300): x = r_vals*x*(1-x); rp.extend(r_vals.tolist()); xp.extend(x.tolist())
ax = axes[0]; ax.set_facecolor(BG); ax.scatter(rp, xp, s=0.05, c=ACCENT, alpha=0.4)
ax.set_title('Period-3 window zoom\n(r ∈ [3.82, 3.87])', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('r', color=LIGHT, fontsize=9); ax.set_ylabel('x', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
rk = np.array([3.0,3.4494897,3.5440903,3.5644073,3.5687594,3.5696916,3.5698913,3.5699340])
deltas = [(rk[i]-rk[i-1])/(rk[i+1]-rk[i]) for i in range(1,len(rk)-1)]
ax = axes[1]; ax.set_facecolor(BG)
ax.plot(range(1,len(deltas)+1), deltas, color=ACCENT, linewidth=2, marker='o', markersize=7)
ax.axhline(4.6692, color=ORA, linewidth=1.5, linestyle='--', label='δ = 4.6692')
ax.set_title('Convergence of Feigenbaum δ\n(ratio of bifurcation intervals)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('Bifurcation index k', color=LIGHT, fontsize=9); ax.set_ylabel('(rₖ−rₖ₋₁)/(rₖ₊₁−rₖ)', color=LIGHT, fontsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
alphas_approx = [2.8,2.65,2.55,2.515,2.506,2.503,2.5029]
ax = axes[2]; ax.set_facecolor(BG)
ax.plot(range(1,len(alphas_approx)+1), alphas_approx, color=PURPLE, linewidth=2, marker='s', markersize=6)
ax.axhline(2.5029, color=GREEN, linewidth=1.5, linestyle='--', label='α = 2.5029')
ax.set_title('Convergence of Feigenbaum α\n(x-direction scaling)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('Bifurcation index k', color=LIGHT, fontsize=9); ax.set_ylabel('Scaling ratio', color=LIGHT, fontsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
plt.tight_layout(); plt.savefig('grad_feigenbaum.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("grad_feigenbaum.png saved")

# 5. PhD: Stochastic + coupled + complex
fig, axes = plt.subplots(1, 3, figsize=(13, 4.5), facecolor=BG); fig.patch.set_facecolor(BG)
np.random.seed(42)
r_n = np.linspace(2.5, 4.0, 1000); noise_level = 0.02
rp_n, xp_n = [], []
for r in r_n:
    xv = 0.5
    for _ in range(500): xv = np.clip(r*xv*(1-xv)+noise_level*np.random.randn(), 0, 1)
    for _ in range(100): xv = np.clip(r*xv*(1-xv)+noise_level*np.random.randn(), 0, 1); rp_n.append(r); xp_n.append(xv)
ax = axes[0]; ax.set_facecolor(BG); ax.scatter(rp_n, xp_n, s=0.08, c=PURPLE, alpha=0.3)
ax.set_title('Stochastic Logistic Map\n(σ=0.02 additive noise)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('r', color=LIGHT, fontsize=9); ax.set_ylabel('x', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
r_c = 3.9; eps_c = 0.3; N_c = 200
x1 = np.zeros(N_c); x2 = np.zeros(N_c); x1[0] = 0.3; x2[0] = 0.7
for i in range(1, N_c):
    f1 = r_c*x1[i-1]*(1-x1[i-1]); f2 = r_c*x2[i-1]*(1-x2[i-1])
    x1[i] = (1-eps_c)*f1+eps_c*f2; x2[i] = (1-eps_c)*f2+eps_c*f1
ax = axes[1]; ax.set_facecolor(BG)
ax.plot(x1, color=ACCENT, linewidth=1.3, label='x₁(n)', alpha=0.9)
ax.plot(x2, color=ORA, linewidth=1.3, label='x₂(n)', alpha=0.9, linestyle='--')
ax.plot(np.abs(x1-x2), color=GREEN, linewidth=1, label='|x₁−x₂|')
ax.set_title(f'Coupled Logistic Maps\n(ε={eps_c}, r=3.9 — partial sync)', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('n', color=LIGHT, fontsize=9); ax.set_ylabel('x', color=LIGHT, fontsize=9)
ax.legend(facecolor=BG, edgecolor=GRID, labelcolor=LIGHT, fontsize=8)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID); ax.yaxis.grid(True, color=GRID, alpha=0.3)
nx, ny = 300, 300
re_range = np.linspace(-0.5, 4.5, nx); im_range = np.linspace(-2.0, 2.0, ny)
Re, Im = np.meshgrid(re_range, im_range); R = Re + 1j*Im
escape = np.zeros((ny, nx)); z = 0.5*np.ones((ny, nx), dtype=complex)
for i in range(50):
    z = R*z*(1-z); escaped = np.abs(z) > 10; escape[escaped & (escape==0)] = i
ax = axes[2]; ax.set_facecolor(BG)
cmap = LinearSegmentedColormap.from_list('chaos',[BG,'#00D4FF','#7FFF00','#FF6B35','#FFFFFF'])
ax.imshow(escape, extent=[-0.5,4.5,-2,2], origin='lower', cmap=cmap, aspect='auto')
ax.axhline(0, color=LIGHT, linewidth=0.8, alpha=0.4)
ax.set_title('Complex Logistic Map\nConnection to Mandelbrot set', color=LIGHT, fontsize=10, fontweight='bold')
ax.set_xlabel('Re(r)', color=LIGHT, fontsize=9); ax.set_ylabel('Im(r)', color=LIGHT, fontsize=9)
ax.tick_params(colors=LIGHT, labelsize=8)
for sp in ax.spines.values(): sp.set_color(GRID)
plt.tight_layout(); plt.savefig('phd_advanced.png', dpi=150, bbox_inches='tight', facecolor=BG); plt.close()
print("phd_advanced.png saved")

print("\nAll ODE + graduate/PhD charts generated!")
