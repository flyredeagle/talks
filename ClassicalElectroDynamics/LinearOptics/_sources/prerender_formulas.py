#!/usr/bin/env python3
"""Pre-render every formula in the deck to base64 PNG and save a JSON lookup table."""
import sys, json
sys.path.insert(0, '/home/claude')
from latex_render import render_formula

FORMULAS = {

# ── PREREQUISITES ────────────────────────────────────────────────────────────
"hs_wave_basic": (
    r"c = \lambda\nu \qquad E = h\nu = \hbar\omega \qquad p = \hbar k = \frac{h}{\lambda}",
    "Wave relations and photon energy"
),
"hs_snell": (
    r"n_1 \sin\theta_1 = n_2 \sin\theta_2",
    "Snell's Law of Refraction"
),
"hs_reflection": (
    r"\theta_i = \theta_r \quad \text{(angles from normal)}",
    "Law of Reflection"
),
"hs_tir": (
    r"\theta_c = \arcsin\!\left(\frac{n_2}{n_1}\right) \quad (n_1 > n_2)",
    "Critical angle for Total Internal Reflection"
),
"hs_matrix_def": (
    r"\begin{pmatrix} y_2 \\ \theta_2 \end{pmatrix} = \begin{pmatrix} A & B \\ C & D \end{pmatrix} \begin{pmatrix} y_1 \\ \theta_1 \end{pmatrix}",
    "ABCD ray transfer matrix"
),
"hs_interface_matrix": (
    r"M_{\text{interface}} = \begin{pmatrix} 1 & 0 \\ 0 & n_1/n_2 \end{pmatrix}",
    "Flat dielectric interface matrix"
),
"hs_lens_matrix": (
    r"M_{\text{lens}} = \begin{pmatrix} 1 & 0 \\ -1/f & 1 \end{pmatrix}, \quad M_{\text{free}}(d) = \begin{pmatrix} 1 & d \\ 0 & 1 \end{pmatrix}",
    "Thin lens and free-space matrices"
),
"hs_cascade": (
    r"M_{\text{system}} = M_N \cdots M_2 M_1 \quad \text{(right-to-left order)}",
    "System matrix: cascade rule"
),

# ── BSc OVERVIEW ─────────────────────────────────────────────────────────────
"bsc_maxwell": (
    r"\nabla^2 \mathbf{E} = \mu_0\epsilon_0\,\frac{\partial^2\mathbf{E}}{\partial t^2}, \qquad c = \frac{1}{\sqrt{\mu_0\epsilon_0}} \approx 3\times10^8\,\text{m/s}",
    "Maxwell wave equation"
),
"bsc_plane_wave": (
    r"\mathbf{E}(\mathbf{r},t) = \mathbf{E}_0\cos(\mathbf{k}\cdot\mathbf{r} - \omega t + \phi)",
    "Monochromatic plane wave"
),
"bsc_photon": (
    r"E = h\nu = \hbar\omega, \qquad p = \hbar k = \frac{h}{\lambda}",
    "Photon energy and momentum"
),
"bsc_snell_fermat": (
    r"n_1\sin\theta_1 = n_2\sin\theta_2, \qquad \text{OPL} = \int n(\mathbf{r})\,ds",
    "Snell's law and Fermat's principle"
),
"bsc_thinlens": (
    r"\frac{1}{f} = (n-1)\!\left(\frac{1}{R_1} - \frac{1}{R_2}\right), \qquad \frac{1}{f} = \frac{1}{d_o} + \frac{1}{d_i}",
    "Thin lens: lensmaker's equation and imaging"
),
"bsc_young": (
    r"\Delta = d\sin\theta, \quad \text{bright: }\Delta = m\lambda, \quad \Delta y = \frac{\lambda L}{d}",
    "Young's double slit fringe spacing"
),
"bsc_malus": (
    r"I_{\text{out}} = I_0 \cos^2\!\theta \quad \text{(Malus's law)}",
    "Malus's law for linear polarizers"
),

# ── ABCD MATRICES ────────────────────────────────────────────────────────────
"abcd_def": (
    r"\begin{pmatrix} y_2 \\ \theta_2 \end{pmatrix} = \underbrace{\begin{pmatrix} A & B \\ C & D \end{pmatrix}}_{M} \begin{pmatrix} y_1 \\ \theta_1 \end{pmatrix}, \quad \det(M)=1",
    "ABCD ray transfer matrix"
),
"abcd_cascade": (
    r"M_{\text{sys}} = M_N \cdots M_2\,M_1, \qquad \det(M) = \frac{n_1}{n_2}",
    "System cascade and determinant"
),
"abcd_imaging": (
    r"B = 0 \Rightarrow \text{imaging}: \quad \frac{1}{f} = \frac{1}{d_1} + \frac{1}{d_2}",
    "Imaging condition B = 0"
),
"abcd_freespace": (
    r"M_{\text{free}}(d) = \begin{pmatrix} 1 & d \\ 0 & 1 \end{pmatrix}, \quad d_{\text{eff}} = \frac{d}{n} \text{ in medium}",
    "Free-space propagation matrix"
),
"abcd_thinlens": (
    r"M_{\text{lens}}(f) = \begin{pmatrix} 1 & 0 \\ -1/f & 1 \end{pmatrix}, \quad P = 1/f \;\text{[diopters]}",
    "Thin lens ABCD matrix"
),
"abcd_mirror": (
    r"M_{\text{mirror}}(R) = \begin{pmatrix} 1 & 0 \\ -2/R & 1 \end{pmatrix} \equiv M_{\text{lens}}(f{=}R/2)",
    "Curved mirror matrix (R > 0: concave)"
),
"abcd_interface": (
    r"M_{\text{refraction}} = \begin{pmatrix} 1 & 0 \\ \dfrac{n_1-n_2}{n_2 R} & \dfrac{n_1}{n_2} \end{pmatrix}",
    "Refracting spherical surface matrix"
),
"abcd_slab": (
    r"M_{\text{slab}}(t,n) = \begin{pmatrix} 1 & t/n \\ 0 & 1 \end{pmatrix}, \quad \delta = t\!\left(1 - \frac{1}{n}\right)",
    "Dielectric slab and apparent shift"
),
"abcd_thicklens": (
    r"M_{\text{thick}} = \begin{pmatrix} 1 & 0 \\ -1/f_2 & 1 \end{pmatrix} \begin{pmatrix} 1 & t/n \\ 0 & 1 \end{pmatrix} \begin{pmatrix} 1 & 0 \\ -1/f_1 & 1 \end{pmatrix}",
    "Thick lens: refraction-propagation-refraction"
),
"abcd_grin": (
    r"n(r) = n_0\!\left(1 - \tfrac{\alpha}{2}r^2\right), \quad M_{\text{GRIN}} = \begin{pmatrix} \cos(\sqrt{\alpha}L) & \dfrac{\sin(\sqrt{\alpha}L)}{\sqrt{n_0\alpha}} \\ -\sqrt{n_0\alpha}\sin(\sqrt{\alpha}L) & \cos(\sqrt{\alpha}L) \end{pmatrix}",
    "GRIN parabolic profile and ABCD matrix"
),
"abcd_resonator": (
    r"g_i = 1 - \frac{L}{R_i}, \quad 0 \leq g_1 g_2 \leq 1 \quad \text{(stability)}",
    "Two-mirror resonator stability condition"
),
"abcd_telescope": (
    r"M_{\text{refractor}} = \begin{pmatrix} -f_o/f_e & 0 \\ 0 & -f_e/f_o \end{pmatrix}, \quad m_\theta = -\frac{f_o}{f_e}",
    "Afocal refractor: angular magnification"
),
"abcd_cassegrain": (
    r"M_{\text{SCT}} = M_{\text{free}}(d_3)\,M_{\text{mirror}}(R_2)\,M_{\text{free}}(d_2)\,M_{\text{mirror}}(R_1)\,M_{\text{free}}(d_1)\,M_{\text{schmidt}}",
    "Schmidt-Cassegrain ABCD cascade"
),

# ── JONES CALCULUS ───────────────────────────────────────────────────────────
"jones_vector": (
    r"\mathbf{E} = \begin{pmatrix} E_x \\ E_y \end{pmatrix} = \begin{pmatrix} A_x e^{i\phi_x} \\ A_y e^{i\phi_y} \end{pmatrix}, \quad |E_x|^2 + |E_y|^2 = 1",
    "Jones vector (normalised)"
),
"jones_states": (
    r"\hat{H} = \begin{pmatrix}1\\0\end{pmatrix}\; \hat{V} = \begin{pmatrix}0\\1\end{pmatrix}\; \hat{+45} = \frac{1}{\sqrt{2}}\begin{pmatrix}1\\1\end{pmatrix}\; \hat{R} = \frac{1}{\sqrt{2}}\begin{pmatrix}1\\-i\end{pmatrix}",
    "Common Jones vectors"
),
"jones_polarizer": (
    r"J_{\text{pol}}(\theta) = \begin{pmatrix} \cos^2\!\theta & \sin\theta\cos\theta \\ \sin\theta\cos\theta & \sin^2\!\theta \end{pmatrix}",
    "Linear polarizer Jones matrix at angle θ"
),
"jones_waveplate": (
    r"J_{\text{wp}}(\Gamma,\theta) = R(-\theta)\begin{pmatrix} e^{i\Gamma/2} & 0 \\ 0 & e^{-i\Gamma/2} \end{pmatrix}R(\theta), \quad \Gamma = \frac{2\pi(n_e - n_o)\,t}{\lambda}",
    "Wave plate Jones matrix: retardance Γ, fast axis θ"
),
"jones_qhwp": (
    r"J_{\text{QWP}} = e^{i\pi/4}\begin{pmatrix}1 & 0\\0 & -i\end{pmatrix}\!(\text{H fast}), \quad J_{\text{HWP}} = \begin{pmatrix}1 & 0\\0 & -1\end{pmatrix}\!(\text{H fast})",
    "QWP and HWP Jones matrices (fast axis horizontal)"
),
"jones_bs": (
    r"J_{\text{BS}} = \begin{pmatrix} \sqrt{T} & i\sqrt{R} \\ i\sqrt{R} & \sqrt{T} \end{pmatrix}, \quad T = R = \tfrac{1}{2} \Rightarrow \det(J) = -(T+R) = -1",
    "50:50 beamsplitter Jones matrix (unitary)"
),
"jones_faraday": (
    r"J_F(\theta) = \begin{pmatrix}\cos\theta & -\sin\theta \\ \sin\theta & \cos\theta\end{pmatrix}, \quad \theta_F = V B L \quad\text{(non-reciprocal!)}",
    "Faraday rotator Jones matrix"
),
"jones_eom": (
    r"J_{\text{EOM}}(V) = J_{\text{wp}}\!\left(\frac{\pi V}{V_\pi},\theta\right), \quad I(V) = I_0\sin^2\!\left(\frac{\pi V}{2V_\pi}\right)",
    "Pockels EOM: voltage-controlled retarder"
),
"jones_superpos": (
    r"J\bigl(a\mathbf{E}_1 + b\mathbf{E}_2\bigr) = a\,J\mathbf{E}_1 + b\,J\mathbf{E}_2 \quad \forall\, a,b\in\mathbb{C}",
    "Linearity of Jones calculus"
),
"jones_cascade": (
    r"M_{\text{sys}} = J_N \cdots J_2\,J_1, \qquad \mathbf{E}_{\text{out}} = M_{\text{sys}}\,\mathbf{E}_{\text{in}}",
    "Jones cascade: multiply matrices right-to-left"
),

# ── GAUSSIAN BEAMS ───────────────────────────────────────────────────────────
"gauss_field": (
    r"E(r,z) = E_0\frac{w_0}{w(z)}\exp\!\left(-\frac{r^2}{w^2(z)}\right)\exp\!\left(-ikz - \frac{ikr^2}{2R(z)} + i\zeta(z)\right)",
    "Gaussian beam electric field"
),
"gauss_params": (
    r"w(z) = w_0\!\sqrt{1+\!\left(\tfrac{z}{z_R}\right)^{\!2}}, \quad R(z) = z\!\left(1+\!\left(\tfrac{z_R}{z}\right)^{\!2}\right), \quad z_R = \frac{\pi w_0^2}{\lambda}",
    "Beam radius, wavefront radius, Rayleigh range"
),
"gauss_gouy": (
    r"\zeta(z) = \arctan\!\left(\frac{z}{z_R}\right), \quad \theta_{\text{div}} = \frac{\lambda}{\pi w_0}, \quad M^2 = \frac{w_0\,\theta}{\lambda/\pi}",
    "Gouy phase, divergence, M² beam quality"
),
"gauss_q": (
    r"\frac{1}{q(z)} = \frac{1}{R(z)} - \frac{i\lambda}{\pi w^2(z)}, \qquad q(z) = z + iz_R",
    "Complex beam parameter q"
),
"gauss_abcd": (
    r"q_2 = \frac{A q_1 + B}{C q_1 + D} \quad \text{[Kogelnik bilinear transform]}",
    "ABCD law for Gaussian beams"
),
"gauss_focusing": (
    r"w_0' = \frac{w_0\,|f|}{\sqrt{(d_1-f)^2 + z_R^2}}, \qquad d_2 = f + \frac{f^2(d_1-f)}{(d_1-f)^2+z_R^2}",
    "New waist size and position after thin lens"
),
"gauss_resonator": (
    r"C q^2 + (D-A)q - B = 0 \quad \text{(eigenmode)}, \qquad \left|\frac{A+D}{2}\right| \leq 1 \;\text{(stable)}",
    "Resonator self-consistency and stability"
),

# ── FOURIER OPTICS ───────────────────────────────────────────────────────────
"fourier_wave_eq": (
    r"\nabla^2 E - \frac{1}{c^2}\frac{\partial^2 E}{\partial t^2} = 0 \quad\Rightarrow\quad E = \iint \tilde{A}(f_x,f_y)\,e^{i2\pi(f_x x+f_y y+f_z z)}\,df_x\,df_y",
    "Wave equation → angular spectrum superposition"
),
"fourier_lens_ft": (
    r"U(x',y') = \frac{e^{ikf}}{i\lambda f}\iint U(x,y)\,e^{-i2\pi(xf_x + yf_y)}\,dx\,dy, \quad f_x = \frac{x'}{\lambda f}",
    "Lens as 2D Fourier transform operator"
),
"fourier_transfer": (
    r"H(f_x,f_y;z) = \exp\!\left(i\pi\lambda z\,(f_x^2+f_y^2)\right) \quad \text{[paraxial propagator]}",
    "Angular spectrum transfer function (free space)"
),
"fourier_convolution": (
    r"\mathcal{F}\{E_1 * E_2\} = \mathcal{F}\{E_1\}\cdot\mathcal{F}\{E_2\}, \qquad \mathcal{F}\{aE_1+bE_2\} = a\mathcal{F}\{E_1\}+b\mathcal{F}\{E_2\}",
    "FT linearity and convolution theorem"
),
"fourier_kernel": (
    r"E_{\text{out}}(x') = \int K(x',x)\,E_{\text{in}}(x)\,dx, \quad K_{\text{free}} = \frac{e^{ikz}}{i\lambda z}e^{i\pi(x'-x)^2/\lambda z}",
    "Optical elements as linear integral operators"
),
"fourier_eigenmode": (
    r"f(x) = \sum_{n=-\infty}^{\infty} c_n\,e^{in\omega_0 x}, \quad c_n = \frac{1}{T}\int_0^T f(x)\,e^{-in\omega_0 x}\,dx",
    "Fourier series: eigenmodes and coefficients"
),
"fourier_parseval": (
    r"\int_{-\infty}^{\infty}|E(x)|^2\,dx = \int_{-\infty}^{\infty}|\tilde{E}(f_x)|^2\,df_x \quad \text{(Parseval)}",
    "Parseval's theorem: energy conservation"
),
"fourier_4f": (
    r"\text{4-f system: } E_{\text{out}}(x) = \int H(f_x)\,\tilde{E}_{\text{in}}(f_x)\,e^{i2\pi f_x x}\,df_x",
    "4-f system: spatial filtering via H(fx)"
),

# ── DIFFRACTION ──────────────────────────────────────────────────────────────
"diff_helmholtz": (
    r"\nabla^2 E + k^2 E = 0, \quad k = \frac{2\pi}{\lambda}, \quad G(\mathbf{r},\mathbf{r}') = \frac{e^{ik|\mathbf{r}-\mathbf{r}'|}}{4\pi|\mathbf{r}-\mathbf{r}'|}",
    "Helmholtz equation and free-space Green's function"
),
"diff_kirchhoff": (
    r"E(P) = \frac{1}{4\pi}\oiint_S\!\left[E\frac{\partial G}{\partial n} - G\frac{\partial E}{\partial n}\right]dS",
    "Kirchhoff integral theorem"
),
"diff_fresnel": (
    r"E(x',y') = \frac{e^{ikz}}{i\lambda z}\iint_{\Sigma} E(x,y)\,\exp\!\left(\frac{i\pi}{\lambda z}\left[(x'-x)^2+(y'-y)^2\right]\right)dx\,dy",
    "Fresnel (paraxial) diffraction integral"
),
"diff_fraunhofer": (
    r"E(x',y') = \frac{e^{ikz}}{i\lambda z}\,e^{i\pi(x'^2+y'^2)/\lambda z}\,\mathcal{F}\{E(x,y)\}\bigg|_{f_x = x'/\lambda z}",
    "Fraunhofer diffraction = Fourier transform of aperture"
),
"diff_circular": (
    r"E(r',z) = \frac{2\pi}{i\lambda z}e^{ikz}\int_0^a E_0\,e^{ikr^2/2z}\,J_0\!\left(\frac{kr'r}{z}\right)r\,dr",
    "Fresnel integral for circular aperture"
),
"diff_onaxis": (
    r"I(0,z) = 4I_0\sin^2\!\left(\frac{N_F\pi}{2}\right), \quad N_F = \frac{a^2}{\lambda z} \quad\text{(Fresnel number)}",
    "On-axis intensity and Fresnel number"
),
"diff_airy": (
    r"I(\theta) = I_0\left[\frac{2J_1(ka\sin\theta)}{ka\sin\theta}\right]^{\!2}, \quad \sin\theta_{\min} = \frac{1.22\lambda}{D}",
    "Airy pattern and Rayleigh criterion"
),
"diff_collins": (
    r"E_2(x_2) = \sqrt{\frac{i}{\lambda B}}\int E_1(x_1)\exp\!\left(\frac{i\pi}{\lambda B}\left[Ax_1^2 - 2x_1 x_2 + Dx_2^2\right]\right)dx_1",
    "Collins integral: Fresnel for ABCD system"
),
"diff_zones": (
    r"r_m = \sqrt{m\lambda z}, \quad \text{zone plate: block even zones} \Rightarrow \text{focus at } f = r_1^2/\lambda",
    "Fresnel zone radii and zone plate focus"
),

# ── MUELLER CALCULUS ─────────────────────────────────────────────────────────
"mueller_stokes": (
    r"\mathbf{S} = \begin{pmatrix}S_0\\S_1\\S_2\\S_3\end{pmatrix} = \begin{pmatrix}\langle|E_x|^2\rangle+\langle|E_y|^2\rangle\\\langle|E_x|^2\rangle-\langle|E_y|^2\rangle\\2\,\mathrm{Re}\langle E_x E_y^*\rangle\\2\,\mathrm{Im}\langle E_x E_y^*\rangle\end{pmatrix}",
    "Stokes vector definition"
),
"mueller_dop": (
    r"\text{DOP} = \frac{\sqrt{S_1^2+S_2^2+S_3^2}}{S_0} \in [0,1], \qquad S_1^2+S_2^2+S_3^2 \leq S_0^2",
    "Degree of polarization and Poincaré sphere"
),
"mueller_transform": (
    r"\mathbf{S}_{\text{out}} = M\,\mathbf{S}_{\text{in}}, \quad M \in \mathbb{R}^{4\times 4}, \quad M_{\text{sys}} = M_N\cdots M_1",
    "Mueller calculus: 4×4 real matrix on Stokes vector"
),
"mueller_hpol": (
    r"M_H = \frac{1}{2}\begin{pmatrix}1&1&0&0\\1&1&0&0\\0&0&0&0\\0&0&0&0\end{pmatrix}",
    "Mueller matrix: horizontal linear polarizer"
),
"mueller_qwp": (
    r"M_{\text{QWP,H}} = \begin{pmatrix}1&0&0&0\\0&1&0&0\\0&0&0&{-1}\\0&0&1&0\end{pmatrix}",
    "Mueller matrix: QWP with fast axis horizontal"
),
"mueller_conversion": (
    r"M = A\,(J\otimes J^*)\,A^{-1}, \quad A = \begin{pmatrix}1&0&0&1\\1&0&0&-1\\0&1&1&0\\0&i&-i&0\end{pmatrix}",
    "Jones-to-Mueller conversion"
),
"mueller_coherency": (
    r"\Phi = \begin{pmatrix}\langle E_x E_x^*\rangle & \langle E_x E_y^*\rangle \\ \langle E_y E_x^*\rangle & \langle E_y E_y^*\rangle\end{pmatrix}, \quad \mathrm{tr}(\Phi) = S_0, \quad \det(\Phi) = 0 \Leftrightarrow \text{fully pol.}",
    "Coherency (density) matrix"
),
}

print(f"Total formulas to render: {len(FORMULAS)}")
results = {}
failed = []

for key, (body, label) in FORMULAS.items():
    try:
        r = render_formula(body, label, font_size="large", dpi=200)
        if r and r.startswith("image"):
            results[key] = r
            print(f"  ✓ {key}")
        else:
            failed.append(key)
            print(f"  ✗ {key} — render returned None")
    except Exception as e:
        failed.append(key)
        print(f"  ✗ {key} — {e}")

print(f"\nRendered: {len(results)}/{len(FORMULAS)}  Failed: {len(failed)}")
if failed:
    print("Failed keys:", failed)

with open("/home/claude/formula_cache.json", "w") as f:
    json.dump(results, f)
print("Saved to formula_cache.json")
