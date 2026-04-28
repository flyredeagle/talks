"""
shared/concept_diagrams_all.py
===============================
Generates all lecture-specific geometric analogy diagrams for L02-L12.
Complements L01/concept_diagrams.py (which handles L01 diagrams).

Each lecture gets 4 diagrams covering its key mathematical concepts,
using 2D/3D geometric analogies matching the dark slide palette.
"""

import os, numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyArrowPatch, Arc, FancyBboxPatch, Ellipse
from mpl_toolkits.mplot3d import Axes3D

BG      = "#0A0E1A"
BGCARD  = "#111827"
ACC1    = "#6366F1"
ACC2    = "#10B981"
ACC3    = "#F59E0B"
ACC4    = "#EC4899"
ACC5    = "#38BDF8"
TEXT    = "#F1F5F9"
TEXTSUB = "#94A3B8"
TEXTDIM = "#475569"

def _fig(w=9, h=5.4):
    return plt.figure(figsize=(w, h), facecolor=BG, dpi=150)

def _ax(fig, rect=[0.09,0.09,0.83,0.83], fc=BGCARD):
    ax = fig.add_axes(rect, facecolor=fc)
    ax.tick_params(colors=TEXTSUB, labelsize=9)
    for sp in ax.spines.values(): sp.set_color(TEXTDIM)
    return ax

def _arr(ax, x0, y0, dx, dy, col, lw=2.5, hw=0.06, hl=0.10):
    ax.annotate("", xy=(x0+dx, y0+dy), xytext=(x0,y0),
        arrowprops=dict(arrowstyle=f"->,head_width={hw},head_length={hl}",
                        color=col, lw=lw))

def _lbl(ax, x, y, t, col=TEXT, fs=11, ha="center", va="center", **kw):
    ax.text(x, y, t, color=col, fontsize=fs, ha=ha, va=va,
            fontfamily="DejaVu Sans", **kw)

def _save(fig, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=BG)
    plt.close(fig)

def _box(ax, text, x, y, col, fs=10, pad=0.4):
    ax.text(x, y, text, color=TEXT, fontsize=fs, ha="center", va="center",
            bbox=dict(boxstyle=f"round,pad={pad}", facecolor=BGCARD,
                      edgecolor=col, alpha=0.95))

# ═══════════════════════════════════════════════════════════════════════════════
# L02: Bras, Dual Space & Inner Product
# ═══════════════════════════════════════════════════════════════════════════════

def l02_bra_dot_product(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.3,3.5); ax.set_ylim(-0.5,2.8); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"$\langle\phi|\psi\rangle$ as Dot Product — The Dual Space in 2D",
                 color=TEXT, fontsize=12, pad=8)

    # ket |ψ⟩
    px,py = 2.5,1.8
    _arr(ax,0,0,px,py,ACC1,lw=3,hw=0.08,hl=0.13)
    _lbl(ax,px+0.18,py+0.12,r"$|\psi\rangle$",ACC1,fs=14,ha="left")

    # ket |φ⟩
    fx,fy = 2.0,0.5
    _arr(ax,0,0,fx,fy,ACC3,lw=3,hw=0.08,hl=0.13)
    _lbl(ax,fx+0.18,fy-0.12,r"$|\phi\rangle$",ACC3,fs=14,ha="left")

    # projection (dot product)
    proj = (px*fx + py*fy) / np.sqrt(fx**2+fy**2)
    ux,uy = fx/np.sqrt(fx**2+fy**2), fy/np.sqrt(fx**2+fy**2)
    pvx,pvy = proj*ux, proj*uy
    ax.plot([pvx,px],[pvy,py],"--",color=TEXTSUB,lw=1.5,alpha=0.7)
    ax.plot([0,pvx],[0,pvy],color=ACC2,lw=3)
    ax.scatter([pvx],[pvy],color=ACC2,s=60,zorder=5)
    _lbl(ax,pvx/2-0.18,pvy/2,r"$\langle\phi|\psi\rangle$",ACC2,fs=12)
    ax.plot([pvx-0.12*uy,pvx-0.12*uy+0.12*ux,pvx+0.12*ux],
            [pvy+0.12*ux,pvy+0.12*ux+0.12*uy,pvy+0.12*uy],
            color=TEXTSUB,lw=1.2,alpha=0.7)

    # bra as row vector
    ax.text(0.1,2.55,
        r"Bra $\langle\phi|$ = transpose-conjugate of $|\phi\rangle$"+"\n"
        r"$\langle\phi|\psi\rangle = \phi_1^*\psi_1 + \phi_2^*\psi_2$ (complex dot product)",
        color=TEXT, fontsize=10, va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l02_bra_dot_product.png")


def l02_gram_schmidt(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.4,3.8); ax.set_ylim(-0.4,3.2); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title("Gram-Schmidt: Building an Orthonormal Basis",
                 color=TEXT, fontsize=12, pad=8)

    # Original vectors
    v1 = np.array([2.0,1.0]); v2 = np.array([1.0,2.5])

    # Step 1: normalise v1
    e1 = v1/np.linalg.norm(v1)

    # Step 2: subtract projection of v2 onto e1
    v2_perp = v2 - np.dot(v2,e1)*e1
    e2 = v2_perp/np.linalg.norm(v2_perp)

    # Draw original (dashed)
    for v,col,lbl in [(v1,TEXTDIM,r"$v_1$"),(v2,TEXTDIM,r"$v_2$")]:
        ax.annotate("",xy=v,xytext=(0,0),
            arrowprops=dict(arrowstyle="->,head_width=0.06",color=col,lw=1.5,linestyle="dashed"))
        _lbl(ax,v[0]+0.12,v[1]+0.12,lbl,TEXTSUB,fs=11)

    # Draw orthonormal result
    scale = 2.3
    _arr(ax,0,0,e1[0]*scale,e1[1]*scale,ACC3,lw=3)
    _arr(ax,0,0,e2[0]*scale,e2[1]*scale,ACC2,lw=3)
    _lbl(ax,e1[0]*scale+0.18,e1[1]*scale-0.12,r"$|e_1\rangle$",ACC3,fs=13)
    _lbl(ax,e2[0]*scale+0.12,e2[1]*scale+0.12,r"$|e_2\rangle$",ACC2,fs=13)

    # Right-angle mark
    mid = e1*scale
    perp_dir = np.array([-e1[1],e1[0]])*0.2
    ax.plot([mid[0],mid[0]+perp_dir[0],mid[0]+perp_dir[0]+e2[0]*0.2],
            [mid[1],mid[1]+perp_dir[1],mid[1]+perp_dir[1]+e2[1]*0.2],
            color=ACC4,lw=2)

    ax.text(0.1,2.95,
        r"$|e_1\rangle = v_1/\|v_1\|$"+"\n"
        r"$|e_2\rangle \propto v_2 - \langle e_1|v_2\rangle|e_1\rangle$"+"\n"
        r"$\langle e_i|e_j\rangle = \delta_{ij}$  ✓",
        color=TEXT, fontsize=10, va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l02_gram_schmidt.png")


def l02_riesz_representation(d):
    fig = _fig(10,5.4)
    ax = fig.add_axes([0.05,0.05,0.90,0.90], facecolor=BG)
    ax.set_xlim(0,10); ax.set_ylim(0,7); ax.axis("off")
    ax.set_title("Riesz Representation Theorem: Every Functional is an Inner Product",
                 color=TEXT, fontsize=12)

    def ellipse(cx,cy,rx,ry,col,alpha=0.18):
        e = mpatches.Ellipse((cx,cy),2*rx,2*ry,facecolor=col,alpha=alpha,
                             edgecolor=col,linewidth=2)
        ax.add_patch(e)

    # Hilbert space H (left)
    ellipse(2.5,3.5,2.0,2.5,ACC1)
    ax.text(2.5,5.7,r"$\mathcal{H}$",color=ACC1,fontsize=16,ha="center")
    for y,lbl in [(4.5,r"$|\psi\rangle$"),(3.5,r"$|\phi\rangle$"),(2.5,r"$|\chi\rangle$")]:
        ax.text(2.5,y,lbl,color=TEXT,fontsize=12,ha="center")
        ax.scatter([2.5],[y],color=ACC1,s=40,zorder=5)

    # Dual space H* (right)
    ellipse(7.5,3.5,2.0,2.5,ACC3)
    ax.text(7.5,5.7,r"$\mathcal{H}^*$",color=ACC3,fontsize=16,ha="center")
    for y,lbl in [(4.5,r"$\langle\psi|$"),(3.5,r"$\langle\phi|$"),(2.5,r"$\langle\chi|$")]:
        ax.text(7.5,y,lbl,color=TEXT,fontsize=12,ha="center")
        ax.scatter([7.5],[y],color=ACC3,s=40,zorder=5)

    # Isomorphism arrows
    for y in [4.5,3.5,2.5]:
        ax.annotate("",xy=(6.2,y),xytext=(3.8,y),
            arrowprops=dict(arrowstyle="<->",color=ACC2,lw=2))
    ax.text(5.0,5.2,r"$|\psi\rangle \;\longleftrightarrow\; \langle\psi|$",
            color=ACC2,fontsize=11,ha="center")
    ax.text(5.0,4.85,"(anti-linear isomorphism)",color=TEXTSUB,fontsize=9,ha="center")

    # The key formula
    ax.text(5.0,1.4,r"$f \in \mathcal{H}^* \;\Rightarrow\; \exists!\,|\phi_f\rangle \in \mathcal{H}:\quad f(|\psi\rangle) = \langle\phi_f|\psi\rangle$",
            color=TEXT, fontsize=11, ha="center",
            bbox=dict(boxstyle="round,pad=0.5",facecolor=BGCARD,edgecolor=ACC2,alpha=0.95))
    _save(fig, f"{d}/l02_riesz_representation.png")


def l02_dual_space_functionals(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.08,0.10,0.84,0.82])
    x = np.linspace(-3,3,400)
    ax.set_title(r"Functionals on $\mathcal{H}$: $f:|\psi\rangle \mapsto \mathbb{C}$"
                 "  —  the dual space takes vectors to numbers",
                 color=TEXT,fontsize=11,pad=8)
    ax.set_xlabel("Component index n",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Amplitude",color=TEXTSUB,fontsize=10)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)

    # A state |ψ⟩ as bar chart
    ns = np.arange(1,7)
    psi = np.array([0.6, -0.4, 0.5, 0.3, -0.3, 0.2])
    psi /= np.linalg.norm(psi)
    phi = np.array([0.5, 0.4, -0.3, 0.5, 0.1, -0.4])
    phi /= np.linalg.norm(phi)

    ax.bar(ns-0.22, psi, width=0.4, color=ACC1, alpha=0.8, label=r"$|\psi\rangle$: ket")
    ax.bar(ns+0.22, phi, width=0.4, color=ACC3, alpha=0.8, label=r"$\langle\phi|$: bra (functional)")
    ax.axhline(0,color=TEXTDIM,lw=0.8)

    # inner product annotation
    ip = np.dot(np.conj(phi), psi)
    ax.set_xlim(0,7); ax.set_ylim(-0.65,0.85)
    ax.legend(loc="upper right",fontsize=10,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.text(0.5,0.78,
        f"$\\langle\\phi|\\psi\\rangle = \\sum_n \\phi_n^* \\psi_n = {ip:.3f}$\n"
        r"The bra $\langle\phi|$ is a linear map: $|\psi\rangle \mapsto \mathbb{C}$",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l02_dual_space_functionals.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L03: Linear Operators
# ═══════════════════════════════════════════════════════════════════════════════

def l03_matrix_operator_2d(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-2.5,2.5); ax.set_ylim(-2.5,2.5); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Linear Operator $\hat{A}$ as a Matrix — Acting on Vectors",
                 color=TEXT,fontsize=12,pad=8)

    # Original vector
    v = np.array([1.2, 0.8])
    # Apply rotation+stretch: [[1.5, -0.5],[0.3, 1.2]]
    A = np.array([[1.5,-0.5],[0.3,1.2]])
    Av = A @ v

    _arr(ax,0,0,v[0],v[1],ACC1,lw=3)
    _arr(ax,0,0,Av[0],Av[1],ACC3,lw=3)
    _lbl(ax,v[0]+0.15,v[1]+0.12,r"$|\psi\rangle$",ACC1,fs=14)
    _lbl(ax,Av[0]+0.15,Av[1]+0.12,r"$\hat{A}|\psi\rangle$",ACC3,fs=14)

    # Unit circle → ellipse
    theta = np.linspace(0,2*np.pi,200)
    circ = np.array([np.cos(theta), np.sin(theta)])
    ell = A @ circ
    ax.plot(circ[0],circ[1],"--",color=ACC1,lw=1.2,alpha=0.5,label="Unit sphere")
    ax.plot(ell[0],ell[1],"-",color=ACC3,lw=1.2,alpha=0.7,label=r"$\hat{A}$(unit sphere)")
    ax.legend(loc="lower right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)

    ax.text(-2.3,2.2,
        "A = [[1.5,-0.5],[0.3,1.2]]"+"\n"
        "Linear: stretches & rotates\nbut keeps origin fixed",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l03_matrix_operator_2d.png")


def l03_hermitian_symmetry(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.5,3.8); ax.set_ylim(-0.5,3.2); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Hermitian $\hat{A}=\hat{A}^\dagger$: Reflection Symmetry, Real Eigenvalues",
                 color=TEXT,fontsize=12,pad=8)

    # Reflection matrix (Hermitian example)
    A = np.array([[0.6, 0.8],[0.8,-0.6]])  # reflection — Hermitian, eigenvalues ±1
    e1 = np.array([np.cos(np.arctan2(0.8,0.6)/2),np.sin(np.arctan2(0.8,0.6)/2)])
    e2 = np.array([-e1[1],e1[0]])

    # eigenvectors
    for ev,col,lbl,sc in [(e1,ACC3,r"$|e_1\rangle$, $\lambda_1=+1$",1.8),
                           (e2,ACC4,r"$|e_2\rangle$, $\lambda_2=-1$",1.8)]:
        _arr(ax,0,0,ev[0]*sc,ev[1]*sc,col,lw=3)
        _lbl(ax,ev[0]*sc+0.15,ev[1]*sc+0.1,lbl,col,fs=11,ha="left")

    # Show reflection of a vector
    v = np.array([2.0,1.5])
    Av = A @ v
    _arr(ax,0,0,v[0],v[1],ACC1,lw=2.5)
    _arr(ax,0,0,Av[0],Av[1],ACC2,lw=2.5)
    _lbl(ax,v[0]+0.12,v[1]+0.12,r"$|\psi\rangle$",ACC1,fs=12)
    _lbl(ax,Av[0]+0.12,Av[1]-0.2,r"$\hat{A}|\psi\rangle$",ACC2,fs=12)
    ax.plot([0,v[0],Av[0]],[0,v[1],Av[1]],":",color=TEXTSUB,lw=1,alpha=0.5)

    ax.text(0.1,2.9,
        r"$\langle\phi|\hat{A}|\psi\rangle = \langle\hat{A}\phi|\psi\rangle$"+"\n"
        r"Eigenvalues always real  $\Rightarrow$  observable!",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l03_hermitian_symmetry.png")


def l03_unitary_rotation(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-1.6,1.6); ax.set_ylim(-1.6,1.6); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Unitary $\hat{U}^\dagger\hat{U}=\hat{I}$: Rotations Preserve Inner Products",
                 color=TEXT,fontsize=12,pad=8)

    theta = np.linspace(0,2*np.pi,300)
    ax.plot(np.cos(theta),np.sin(theta),color=TEXTDIM,lw=1.5,alpha=0.5,ls="--")

    # Several vectors and their rotated images
    angle = np.pi/5  # rotation angle
    R = np.array([[np.cos(angle),-np.sin(angle)],[np.sin(angle),np.cos(angle)]])
    vecs = [(np.array([1,0]),ACC1,r"$|\psi_1\rangle$"),
            (np.array([0.7,0.7])/np.sqrt(2),ACC3,r"$|\psi_2\rangle$"),
            (np.array([0,1]),ACC2,r"$|\psi_3\rangle$")]
    for v,col,lbl in vecs:
        Rv = R@v
        _arr(ax,0,0,v[0],v[1],col,lw=2)
        _arr(ax,0,0,Rv[0],Rv[1],col,lw=2.5)
        ax.annotate("",xy=Rv,xytext=v,
            arrowprops=dict(arrowstyle="->,head_width=0.04",color=ACC4,lw=1.5,
                            connectionstyle="arc3,rad=0.3"))
        _lbl(ax,Rv[0]*1.2,Rv[1]*1.2,r"$\hat{U}$"+lbl,col,fs=9)

    # rotation arc label
    arc = np.linspace(0,angle,40); r_arc=0.4
    ax.plot(r_arc*np.cos(arc),r_arc*np.sin(arc),color=ACC4,lw=2)
    _lbl(ax,0.25,0.12,f"θ={np.degrees(angle):.0f}°",ACC4,fs=10)

    ax.text(-1.5,-1.45,
        r"$\langle\hat{U}\phi|\hat{U}\psi\rangle = \langle\phi|\psi\rangle$"+"\n"
        "Angles & lengths preserved\nPhysical symmetries are unitary",
        color=TEXT,fontsize=9,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l03_unitary_rotation.png")


def l03_eigenvalue_geometry(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.4,3.5); ax.set_ylim(-0.4,2.8); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Eigenkets: $\hat{A}|a\rangle = a|a\rangle$ — Along Its Own Direction",
                 color=TEXT,fontsize=12,pad=8)

    # Two eigenvectors (along x and y)
    _arr(ax,0,0,2.0,0,ACC3,lw=3)
    _arr(ax,0,0,0,1.5,ACC2,lw=3)
    _lbl(ax,2.1,-0.18,r"$|a_1\rangle$, $a_1=2.0$",ACC3,fs=11,ha="left")
    _lbl(ax,-0.22,1.5,r"$|a_2\rangle$, $a_2=1.5$",ACC2,fs=11,ha="right")

    # A general vector and its expansion
    v = np.array([1.4,1.1])
    _arr(ax,0,0,v[0],v[1],ACC1,lw=3)
    _lbl(ax,v[0]+0.12,v[1]+0.12,r"$|\psi\rangle = c_1|a_1\rangle+c_2|a_2\rangle$",
         ACC1,fs=10,ha="left")

    # Action of A: scale along eigenvectors
    Av = np.array([2.0*v[0], 1.5*v[1]])
    _arr(ax,0,0,Av[0],Av[1],ACC4,lw=2.5)
    _lbl(ax,Av[0]+0.12,Av[1]+0.12,r"$\hat{A}|\psi\rangle$",ACC4,fs=11,ha="left")

    # dashed projections
    ax.plot([0,v[0]],[0,0],"--",color=ACC3,lw=1.2,alpha=0.6)
    ax.plot([v[0],v[0]],[0,v[1]],"--",color=ACC3,lw=0.8,alpha=0.4)

    ax.text(0.1,2.55,
        r"$\hat{A}|\psi\rangle = a_1 c_1|a_1\rangle + a_2 c_2|a_2\rangle$"+"\n"
        r"Each component scaled by its eigenvalue",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l03_eigenvalue_geometry.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L04: Eigenkets, Projectors & Spectral Decomposition
# ═══════════════════════════════════════════════════════════════════════════════

def l04_stern_gerlach_filter(d):
    fig = _fig(10,5.4)
    ax = fig.add_axes([0.05,0.08,0.90,0.84], facecolor=BG); ax.axis("off")
    ax.set_title("Stern-Gerlach as a Projector Filter — Eigenket Extraction",
                 color=TEXT,fontsize=12)

    def box(x,y,w,h,col,label,sublabel=""):
        ax.add_patch(FancyBboxPatch((x,y),w,h,boxstyle="round,pad=0.02",
            facecolor=BGCARD,edgecolor=col,lw=2))
        ax.text(x+w/2,y+h/2+0.04,label,color=col,fontsize=11,ha="center",va="center",
                fontweight="bold")
        if sublabel:
            ax.text(x+w/2,y+h/2-0.08,sublabel,color=TEXTSUB,fontsize=9,
                    ha="center",va="center")

    ax.set_xlim(0,10); ax.set_ylim(0,4)
    # Input beam
    ax.annotate("",xy=(1.8,2.0),xytext=(0.3,2.0),
        arrowprops=dict(arrowstyle="->,head_width=0.12",color=ACC1,lw=2.5))
    ax.text(0.3,2.3,r"$|\psi\rangle = \sum_m c_m |m\rangle$",
            color=ACC1,fontsize=10,ha="left")

    # SG apparatus
    box(1.9,1.2,1.8,1.6,ACC3,"S-G\nApparatus",r"$\hat{S}_z$")
    ax.annotate("",xy=(4.5,3.0),xytext=(3.7,2.0),
        arrowprops=dict(arrowstyle="->,head_width=0.10",color=ACC2,lw=2))
    ax.annotate("",xy=(4.5,2.0),xytext=(3.7,2.0),
        arrowprops=dict(arrowstyle="->,head_width=0.10",color=ACC3,lw=2))
    ax.annotate("",xy=(4.5,1.0),xytext=(3.7,2.0),
        arrowprops=dict(arrowstyle="->,head_width=0.10",color=ACC4,lw=2))

    # Outputs
    for y,lbl,col,prob in [(3.0,r"$|+\rangle$, $P=|c_+|^2$",ACC2,None),
                            (2.0,r"$|0\rangle$, $P=|c_0|^2$",ACC3,None),
                            (1.0,r"$|-\rangle$, $P=|c_-|^2$",ACC4,None)]:
        ax.text(4.7,y,lbl,color=col,fontsize=10,va="center")

    # Blocked beam → projector
    box(5.8,2.8,1.4,0.6,ACC2,"Select\n|+⟩")
    ax.annotate("",xy=(7.5,3.1),xytext=(7.2,3.1),
        arrowprops=dict(arrowstyle="->,head_width=0.10",color=ACC2,lw=2))
    ax.text(7.6,3.1,r"$\hat{P}_+|\psi\rangle = c_+|+\rangle$",
            color=ACC2,fontsize=10,va="center")

    ax.text(5.0,0.3,
        r"Projector: $\hat{P}_m = |m\rangle\langle m|,\quad \hat{P}_m|\psi\rangle = c_m|m\rangle$"+"\n"
        r"Probability: $P(m) = \langle\psi|\hat{P}_m|\psi\rangle = |c_m|^2$",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l04_stern_gerlach_filter.png")


def l04_projector_geometry(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.4,3.5); ax.set_ylim(-0.4,2.8); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Projector $\hat{P}_a = |a\rangle\langle a|$: Geometric Projection",
                 color=TEXT,fontsize=12,pad=8)

    # Eigenket direction |a⟩
    ea = np.array([1,0]); ea2 = np.array([0,1])
    _arr(ax,0,0,2.5,0,ACC3,lw=3)
    _arr(ax,0,0,0,2.0,ACC2,lw=3)
    _lbl(ax,2.6,-0.18,r"$|a\rangle$",ACC3,fs=13)
    _lbl(ax,-0.2,2.0,r"$|b\rangle$",ACC2,fs=13)

    # State and its projection
    psi = np.array([1.8,1.5])
    Pa_psi = np.dot(psi,ea)*ea
    Pb_psi = np.dot(psi,ea2)*ea2

    _arr(ax,0,0,psi[0],psi[1],ACC1,lw=3)
    _lbl(ax,psi[0]+0.12,psi[1]+0.12,r"$|\psi\rangle$",ACC1,fs=14,fontweight="bold")

    # Projections
    ax.plot([Pa_psi[0],psi[0]],[Pa_psi[1],psi[1]],"--",color=ACC3,lw=1.5,alpha=0.7)
    ax.plot([0,Pa_psi[0]],[0,Pa_psi[1]],color=ACC3,lw=3,alpha=0.7)
    ax.scatter([Pa_psi[0]],[Pa_psi[1]],color=ACC3,s=70,zorder=5)
    _lbl(ax,Pa_psi[0]/2,-0.22,
         r"$\hat{P}_a|\psi\rangle = \langle a|\psi\rangle|a\rangle$",ACC3,fs=10)

    ax.plot([Pb_psi[0],psi[0]],[Pb_psi[1],psi[1]],"--",color=ACC2,lw=1.5,alpha=0.7)
    ax.plot([0,Pb_psi[0]],[0,Pb_psi[1]],color=ACC2,lw=3,alpha=0.7)

    ax.text(1.5,2.55,
        r"$\hat{P}_a^2 = \hat{P}_a$ (idempotent)"+"\n"
        r"$P(a)=|\langle a|\psi\rangle|^2$ (Born rule)",
        color=TEXT,fontsize=10,ha="center",va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l04_projector_geometry.png")


def l04_spectral_decomposition(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.4,3.5); ax.set_ylim(-0.4,2.8); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Spectral Decomposition: $\hat{A} = \sum_n a_n |a_n\rangle\langle a_n|$",
                 color=TEXT,fontsize=12,pad=8)

    # Eigenvectors with different eigenvalues
    _arr(ax,0,0,2.0,0,ACC3,lw=3); _arr(ax,0,0,1,0,ACC3,lw=1.5)
    _arr(ax,0,0,0,1.2,ACC2,lw=3); _arr(ax,0,0,0,1,ACC2,lw=1.5)
    _lbl(ax,2.18,0.1,r"$|a_1\rangle$, $a=2.0$",ACC3,fs=10,ha="left")
    _lbl(ax,0.12,1.3,r"$|a_2\rangle$, $a=1.2$",ACC2,fs=10,ha="left")

    # Show Â acting on |ψ⟩
    psi = np.array([1.3,1.5])
    Apsi = np.array([2.0*psi[0],1.2*psi[1]])
    _arr(ax,0,0,psi[0],psi[1],ACC1,lw=2.5)
    _arr(ax,0,0,Apsi[0],Apsi[1],ACC4,lw=2.5)
    _lbl(ax,psi[0]+0.12,psi[1]+0.12,r"$|\psi\rangle$",ACC1,fs=12)
    _lbl(ax,Apsi[0]+0.12,Apsi[1]+0.12,r"$\hat{A}|\psi\rangle$",ACC4,fs=12)
    ax.plot([0,psi[0],Apsi[0]],[0,psi[1],Apsi[1]],":",color=TEXTSUB,lw=1,alpha=0.5)

    ax.text(0.1,2.6,
        r"$\hat{A}|\psi\rangle = \sum_n a_n \langle a_n|\psi\rangle\, |a_n\rangle$"+"\n"
        "Each eigenspace scaled by its eigenvalue",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l04_spectral_decomp.png")


def l04_resolution_identity(d):
    fig = _fig(9,5.4); ax = _ax(fig,[0.08,0.10,0.84,0.82])
    ax.set_title(r"Completeness / Resolution of Identity: $\sum_n |n\rangle\langle n| = \hat{I}$",
                 color=TEXT,fontsize=12,pad=8)
    ax.set_xlim(0,7); ax.set_ylim(-0.3,1.3)
    ax.axhline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_xlabel("Basis index n",color=TEXTSUB,fontsize=10)
    ax.set_ylabel(r"$|\langle n|\psi\rangle|^2 = P(n)$",color=TEXTSUB,fontsize=10)

    ns = np.arange(1,7)
    psi = np.array([0.5,0.6,0.4,0.3,0.25,0.2])
    psi /= np.linalg.norm(psi)
    probs = psi**2

    colors = [ACC1,ACC3,ACC2,ACC4,ACC5,ACC1]
    bars = ax.bar(ns, probs, color=colors, width=0.6, alpha=0.85)
    ax.bar(ns, probs, color="none", edgecolor=[c for c in colors], linewidth=2, width=0.6)

    # Cumulative sum → identity
    cumsum = np.cumsum(probs)
    ax2 = ax.twinx()
    ax2.plot(np.r_[0,ns],np.r_[0,cumsum],"--o",color=TEXT,lw=2,ms=6,alpha=0.8,
             label="Cumulative sum → 1")
    ax2.axhline(1.0,color=ACC2,lw=1.5,ls=":")
    ax2.set_ylim(-0.3,1.3); ax2.tick_params(colors=TEXTSUB,labelsize=9)
    ax2.set_ylabel("Cumulative probability",color=TEXTSUB,fontsize=9)
    ax2.legend(loc="upper left",fontsize=9,labelcolor=TEXT,
               facecolor=BGCARD,edgecolor=TEXTDIM)

    total = probs.sum()
    ax.text(3.5,1.18,f"$\\sum_n P(n) = \\sum_n |c_n|^2 = {total:.3f} \\approx 1$"+"\n"
            r"Completeness guarantees $\sum_n\hat{P}_n = \hat{I}$",
            color=TEXT,fontsize=10,ha="center",va="top",
            bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l04_resolution_identity.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L05: Completeness, Change of Basis & Matrix Mechanics
# ═══════════════════════════════════════════════════════════════════════════════

def l05_basis_rotation_2d(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-2.5,2.5); ax.set_ylim(-2.5,2.5); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title("Change of Basis = Coordinate Rotation — Same Vector, New Frame",
                 color=TEXT,fontsize=12,pad=8)

    # Original basis (black)
    _arr(ax,0,0,1,0,TEXTDIM,lw=1.5)
    _arr(ax,0,0,0,1,TEXTDIM,lw=1.5)
    _lbl(ax,1.1,-0.15,r"$|1\rangle$",TEXTSUB,fs=11)
    _lbl(ax,-0.15,1.1,r"$|2\rangle$",TEXTSUB,fs=11)

    # Rotated basis (coloured)
    angle = np.pi/4
    R = np.array([[np.cos(angle),-np.sin(angle)],[np.sin(angle),np.cos(angle)]])
    e1r = R[:,0]; e2r = R[:,1]
    scale = 1.6
    _arr(ax,0,0,e1r[0]*scale,e1r[1]*scale,ACC3,lw=2.5)
    _arr(ax,0,0,e2r[0]*scale,e2r[1]*scale,ACC2,lw=2.5)
    _lbl(ax,e1r[0]*scale+0.15,e1r[1]*scale+0.1,r"$|1'\rangle$",ACC3,fs=12)
    _lbl(ax,e2r[0]*scale+0.1,e2r[1]*scale+0.12,r"$|2'\rangle$",ACC2,fs=12)

    # The state |ψ⟩ — same in both
    psi = np.array([1.5,1.0])
    _arr(ax,0,0,psi[0],psi[1],ACC1,lw=3)
    _lbl(ax,psi[0]+0.12,psi[1]+0.12,r"$|\psi\rangle$",ACC1,fs=14,fontweight="bold")

    # Show components in both bases
    c1 = psi[0]; c2 = psi[1]  # original
    cprime = R.T @ psi  # rotated
    ax.text(-2.3,-2.1,
        f"Old basis: $c_1={c1:.2f}$, $c_2={c2:.2f}$\n"
        f"New basis: $c_1'={cprime[0]:.2f}$, $c_2'={cprime[1]:.2f}$\n"
        r"$|\psi\rangle$ unchanged — only coordinates change!",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l05_basis_rotation_2d.png")


def l05_matrix_representation(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.06,0.08,0.88,0.84])
    ax.set_title(r"Matrix Representation: $A_{mn} = \langle m|\hat{A}|n\rangle$ — Basis Dependent",
                 color=TEXT,fontsize=12,pad=8)
    ax.axis("off"); ax.set_xlim(0,10); ax.set_ylim(0,5.5)

    # Two bases and their matrix representations
    def draw_matrix(ax, x, y, mat, title, col):
        ax.text(x+1.2,y+4.8,title,color=col,fontsize=11,ha="center",fontweight="bold")
        for i in range(3):
            for j in range(3):
                val = mat[i,j]
                fc = col if abs(val) > 0.01 else BGCARD
                alpha = min(0.8, abs(val)+0.1)
                rect = FancyBboxPatch((x+j*0.8,y+3-i*0.9),0.75,0.75,
                    boxstyle="round,pad=0.05",facecolor=fc,alpha=alpha,
                    edgecolor=col,lw=1.2)
                ax.add_patch(rect)
                ax.text(x+j*0.8+0.375,y+3-i*0.9+0.375,f"{val:.2f}",
                        color="white" if abs(val)>0.2 else TEXTSUB,
                        fontsize=9,ha="center",va="center")

    # Original basis: diagonal matrix
    A_orig = np.diag([2.0,1.2,0.5])
    draw_matrix(ax, 0.5, 0.5, A_orig, r"$\{|n\rangle\}$ basis (eigenbasis)", ACC3)
    ax.text(2.3,2.5,r"$\hat{A}=\mathrm{diag}(2,1.2,0.5)$"+"\n"
            "Diagonal in eigenbasis",color=TEXTSUB,fontsize=9,ha="left",va="center")

    # Arrow
    ax.annotate("",xy=(5.8,3.0),xytext=(4.2,3.0),
        arrowprops=dict(arrowstyle="<->",color=ACC2,lw=2.5))
    ax.text(5.0,3.6,r"$\hat{U}^\dagger \hat{A}\hat{U}$",color=ACC2,fontsize=11,ha="center")
    ax.text(5.0,3.25,"unitary\ntransformation",color=TEXTSUB,fontsize=9,ha="center")

    # Rotated basis: non-diagonal
    angle = np.pi/5
    R3 = np.eye(3)
    c,s = np.cos(angle),np.sin(angle)
    R3[:2,:2] = [[c,-s],[s,c]]
    A_new = R3.T @ A_orig @ R3
    draw_matrix(ax, 6.2, 0.5, A_new, r"$\{|m'\rangle\}$ basis (rotated)", ACC4)

    ax.text(5.0,0.8,
        r"Eigenvalues $\{2, 1.2, 0.5\}$ unchanged! "+r"$\mathrm{Tr}(\hat{A})=\mathrm{const}$",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l05_matrix_representation.png")


def l05_trace_invariant(d):
    fig = _fig(9,5.4); ax = _ax(fig,[0.08,0.10,0.84,0.82])
    ax.set_title(r"Trace & Spectrum Invariants: $\mathrm{Tr}(\hat{A})=\sum_n a_n$, "
                 r"$\det(\hat{A})=\prod_n a_n$",
                 color=TEXT,fontsize=11,pad=8)

    # Show eigenvalues as points on complex plane
    eigenvalues = [2.0+0j, 1.2+0j, 0.5+0j, 0.3+0.8j, 0.3-0.8j]
    x = [e.real for e in eigenvalues]
    y = [e.imag for e in eigenvalues]

    ax.axhline(0,color=TEXTDIM,lw=0.8); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_xlabel("Re(eigenvalue)",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Im(eigenvalue)",color=TEXTSUB,fontsize=10)

    colors_eig = [ACC3,ACC3,ACC3,ACC4,ACC4]
    for xi,yi,col,ev in zip(x,y,colors_eig,eigenvalues):
        ax.scatter([xi],[yi],color=col,s=120,zorder=5,edgecolors=TEXT,lw=1.5)
        label = f"${ev.real:.1f}{'%+.1fi'%ev.imag if ev.imag else ''}$"
        ax.text(xi+0.06,yi+0.12,label,color=col,fontsize=10)

    tr  = sum(e.real for e in eigenvalues[:3])  # Hermitian example
    det = 2.0*1.2*0.5
    ax.set_xlim(-0.3,2.5); ax.set_ylim(-1.2,1.2)

    ax.text(0.05,1.1,
        f"$\\mathrm{{Tr}}(\\hat{{A}}) = {sum(x):.1f}$ (sum of eigenvalues)\n"
        f"$\\mathrm{{Tr}}$ is basis-independent\n"
        r"$\langle\hat{A}\rangle = \mathrm{Tr}(\hat{\rho}\hat{A})$ uses this fact",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l05_trace_invariant.png")


def l05_similarity_transform(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-1.5,1.5); ax.set_ylim(-1.5,1.5); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Unitary Equivalence: $\hat{A}' = \hat{U}^\dagger\hat{A}\hat{U}$ — Same Physics",
                 color=TEXT,fontsize=12,pad=8)

    # Ellipse (action of A in original basis)
    theta = np.linspace(0,2*np.pi,300)
    a_stretch, b_stretch = 1.3, 0.7
    ell1 = np.array([a_stretch*np.cos(theta), b_stretch*np.sin(theta)])

    # Rotated ellipse (A' in new basis)
    angle = np.pi/4
    R = np.array([[np.cos(angle),-np.sin(angle)],[np.sin(angle),np.cos(angle)]])
    ell2 = R @ ell1

    ax.plot(ell1[0],ell1[1],color=ACC3,lw=2.5,label=r"$\hat{A}$ in $\{|n\rangle\}$")
    ax.plot(ell2[0],ell2[1],color=ACC2,lw=2.5,ls="--",label=r"$\hat{U}^\dagger\hat{A}\hat{U}$ in $\{|n'\rangle\}$")
    ax.plot(np.cos(theta),np.sin(theta),color=TEXTDIM,lw=1,ls=":",alpha=0.5)

    # Axes
    _arr(ax,0,0,a_stretch,0,ACC3,lw=2)
    _arr(ax,0,0,0,b_stretch,ACC3,lw=2)
    _arr(ax,0,0,a_stretch*R[0,0],a_stretch*R[1,0],ACC2,lw=2)
    _arr(ax,0,0,b_stretch*R[0,1],b_stretch*R[1,1],ACC2,lw=2)

    ax.legend(loc="lower right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.text(-1.45,-1.4,
        "Same shape (spectrum)\nDifferent orientation (basis)\n"
        r"Eigenvalues $\{a_n\}$ unchanged",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l05_similarity_transform.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L06: Continuous Bases
# ═══════════════════════════════════════════════════════════════════════════════

def l06_continuum_limit(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"Discrete $\to$ Continuous: $\sum_n \to \int dx$, "
                 r"$\delta_{mn} \to \delta(x-x')$",
                 color=TEXT,fontsize=12,pad=8)
    ax.set_xlabel("Position x",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Amplitude",color=TEXTSUB,fontsize=10)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.axhline(0,color=TEXTDIM,lw=0.7)

    x = np.linspace(0,6,400)
    psi = np.exp(-0.5*(x-3)**2)*np.cos(3*x)
    ax.plot(x,psi,color=ACC1,lw=2.5,label=r"$\psi(x)=\langle x|\psi\rangle$ (continuous)")

    # Discrete sampling
    for n_samp in [8]:
        xs = np.linspace(0.3,5.7,n_samp)
        dx = xs[1]-xs[0]
        ys = np.exp(-0.5*(xs-3)**2)*np.cos(3*xs)
        ax.bar(xs, ys, width=dx*0.7, color=ACC3, alpha=0.5, label=f"Discrete, N={n_samp}")
        ax.scatter(xs,ys,color=ACC3,s=40,zorder=5)

    ax.legend(loc="upper left",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.text(0.3,-0.85,
        r"$\langle x|x'\rangle = \delta(x-x')$ (orthonormality)"+"\n"
        r"$\int |x\rangle\langle x|\,dx = \hat{I}$ (completeness)"+"\n"
        r"$\psi(x) = \langle x|\psi\rangle$ (wavefunction as inner product)",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l06_continuum_limit.png")


def l06_delta_function(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"$\delta(x-x_0)$: The Continuous Orthonormality Kernel",
                 color=TEXT,fontsize=12,pad=8)
    ax.set_xlabel("x",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Amplitude",color=TEXTSUB,fontsize=10)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.axhline(0,color=TEXTDIM,lw=0.7)

    x = np.linspace(-3,3,2000)
    x0 = 0.5

    # Approximate delta as narrow Gaussians
    sigmas = [0.8,0.4,0.15,0.05]
    colors_d = [ACC4,ACC3,ACC2,ACC1]
    labels   = [f"σ={s}" for s in sigmas]
    for sig,col,lbl in zip(sigmas,colors_d,labels):
        delta_approx = np.exp(-0.5*((x-x0)/sig)**2)/(sig*np.sqrt(2*np.pi))
        delta_approx = np.clip(delta_approx,0,8)
        ax.plot(x,delta_approx,color=col,lw=2,label=lbl,alpha=0.85)

    ax.set_ylim(-0.3,8.5); ax.set_xlim(-3,3)
    ax.axvline(x0,color=TEXT,lw=1,ls=":",alpha=0.5)
    ax.text(x0+0.08,7.5,f"$x_0={x0}$",color=TEXT,fontsize=10)
    ax.legend(loc="upper left",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.text(-2.9,7.5,
        r"$\delta(x-x_0) = \lim_{\sigma\to 0}$" "\n"
        r"  Gaussian$(\sigma)$ at $x_0$" "\n\n"
        r"$\int f(x)\delta(x-x_0)\,dx = f(x_0)$" "\n"
        r"$\langle x|x'\rangle = \delta(x-x')$",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l06_delta_function.png")


def l06_position_momentum_plane(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"Position $|x\rangle$ vs Momentum $|p\rangle$ — Fourier-Dual Bases",
                 color=TEXT,fontsize=12,pad=8)

    x = np.linspace(-4,4,1000)
    x0 = 1.0; p0 = 2.0; sigma = 0.8
    psi_x = np.exp(-0.5*((x-x0)/sigma)**2) * np.exp(1j*p0*x)
    psi_x /= np.sqrt(np.trapezoid(np.abs(psi_x)**2,x))

    # Momentum space via FFT
    dx = x[1]-x[0]
    p  = np.fft.fftfreq(len(x),dx)*2*np.pi
    p  = np.fft.fftshift(p)
    phi_p = np.fft.fftshift(np.fft.fft(psi_x)) * dx / np.sqrt(2*np.pi)

    ax.plot(x, np.abs(psi_x)**2, color=ACC1, lw=2.5, label=r"$|\psi(x)|^2$ (position)")
    p_plot = p[(p>-8)&(p<8)]
    phi_plot = phi_p[(p>-8)&(p<8)]
    ax.plot(p_plot/3+x0, np.abs(phi_plot)**2*3, color=ACC3, lw=2.5, ls="--",
            label=r"$|\tilde{\psi}(p)|^2$ (momentum, rescaled)")

    ax.axvline(x0,color=ACC1,lw=1,ls=":",alpha=0.5)
    ax.axvline(p0/3+x0,color=ACC3,lw=1,ls=":",alpha=0.5)
    ax.set_xlabel(r"$x$ (position units),  $p/3+x_0$ (momentum)",
                  color=TEXTSUB,fontsize=9)
    ax.set_ylabel("Probability density",color=TEXTSUB,fontsize=10)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.text(-3.9,0.48,
        r"$\langle x|p\rangle = \frac{1}{\sqrt{2\pi\hbar}}e^{ipx/\hbar}$"+"\n"
        r"$\tilde{\psi}(p) = \langle p|\psi\rangle = $ Fourier transform",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l06_position_momentum.png")


def l06_fourier_duality(d):
    fig, (ax1,ax2) = plt.subplots(1,2,figsize=(10,5),facecolor=BG)
    for ax in [ax1,ax2]:
        ax.set_facecolor(BGCARD)
        ax.tick_params(colors=TEXTSUB,labelsize=9)
        for sp in ax.spines.values(): sp.set_color(TEXTDIM)
        ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
        ax.axhline(0,color=TEXTDIM,lw=0.7)

    x = np.linspace(-5,5,1000)
    p = np.linspace(-8,8,1000)
    # Position-space: Gaussian
    psi_x = np.exp(-x**2/2) / np.pi**0.25
    ax1.plot(x,psi_x,color=ACC1,lw=2.5)
    ax1.fill_between(x,0,psi_x,color=ACC1,alpha=0.2)
    ax1.set_title(r"$\psi(x) = \langle x|\psi\rangle$",color=TEXT,fontsize=12)
    ax1.set_xlabel("Position x",color=TEXTSUB)
    # Momentum-space: also Gaussian (FT of Gaussian is Gaussian)
    phi_p = np.exp(-p**2/2) / np.pi**0.25
    ax2.plot(p,phi_p,color=ACC3,lw=2.5,ls="--")
    ax2.fill_between(p,0,phi_p,color=ACC3,alpha=0.2)
    ax2.set_title(r"$\tilde\psi(p) = \langle p|\psi\rangle$",color=TEXT,fontsize=12)
    ax2.set_xlabel("Momentum p",color=TEXTSUB)

    # Width annotations
    ax1.annotate("",xy=(1,0.2),xytext=(-1,0.2),
        arrowprops=dict(arrowstyle="<->",color=TEXT,lw=1.5))
    ax1.text(0,0.26,r"$\Delta x \approx 1$",color=TEXT,fontsize=10,ha="center")
    ax2.annotate("",xy=(1,0.2),xytext=(-1,0.2),
        arrowprops=dict(arrowstyle="<->",color=TEXT,lw=1.5))
    ax2.text(0,0.26,r"$\Delta p \approx 1$",color=TEXT,fontsize=10,ha="center")

    fig.text(0.5,0.02,
        r"Fourier duality: $\Delta x \cdot \Delta p \geq \hbar/2$"+
        "  — narrow in $x$ ↔ broad in $p$",
        color=TEXT,fontsize=11,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    fig.patch.set_facecolor(BG)
    plt.tight_layout(pad=1.5)
    _save(fig, f"{d}/l06_fourier_duality.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L07: Measurement Theory & Uncertainty
# ═══════════════════════════════════════════════════════════════════════════════

def l07_uncertainty_spread(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"Quantum Uncertainty: $(\Delta A)^2 = \langle\hat{A}^2\rangle - \langle\hat{A}\rangle^2$"
                 " — Statistical Spread",
                 color=TEXT,fontsize=12,pad=8)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)

    x = np.linspace(-4,4,500)
    distributions = [
        (0.0, 0.5, ACC2, r"Small $\Delta A$ (precise)"),
        (0.5, 1.2, ACC3, r"Medium $\Delta A$"),
        (0.0, 2.0, ACC4, r"Large $\Delta A$ (spread)"),
    ]
    for mu,sig,col,lbl in distributions:
        y = np.exp(-0.5*((x-mu)/sig)**2)/(sig*np.sqrt(2*np.pi))
        ax.plot(x,y,color=col,lw=2.5,label=lbl)
        ax.fill_between(x,0,y,color=col,alpha=0.12)
        ax.axvline(mu,color=col,lw=1,ls=":")
        ax.annotate("",xy=(mu+sig,0.25/sig),xytext=(mu,0.25/sig),
            arrowprops=dict(arrowstyle="<->",color=col,lw=1.5))
        ax.text(mu+sig/2,0.28/sig,f"σ={sig}",color=col,fontsize=9,ha="center")

    ax.set_xlabel(r"Measurement outcome $a$",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Probability density",color=TEXTSUB,fontsize=10)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.text(-3.9,0.72,
        r"$\langle\hat{A}\rangle = \langle\psi|\hat{A}|\psi\rangle$ (mean)"+"\n"
        r"$(\Delta A)^2 = \langle\hat{A}^2\rangle - \langle\hat{A}\rangle^2$ (variance)"+"\n"
        "Uncertainty is intrinsic, NOT measurement error",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l07_uncertainty_spread.png")


def l07_commutator_geometry(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-0.4,3.2); ax.set_ylim(-0.4,2.8); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Commutator $[\hat{A},\hat{B}] = \hat{A}\hat{B}-\hat{B}\hat{A}$ — Order Matters",
                 color=TEXT,fontsize=12,pad=8)

    v = np.array([1.5,0.8])
    A = np.array([[1.5,-0.3],[0.1,1.2]])  # stretch+shear
    B = np.array([[0.8,0.4],[-0.2,1.4]])

    ABv = A @ (B @ v)
    BAv = B @ (A @ v)
    comm_v = ABv - BAv

    for vec,col,lbl,lw in [
        (v,   TEXTDIM,r"$|\psi\rangle$",2),
        (ABv, ACC3,   r"$\hat{A}\hat{B}|\psi\rangle$",2.5),
        (BAv, ACC2,   r"$\hat{B}\hat{A}|\psi\rangle$",2.5),
        (comm_v,ACC4, r"$[\hat{A},\hat{B}]|\psi\rangle$",3),
    ]:
        _arr(ax,0,0,vec[0],vec[1],col,lw=lw)
        _lbl(ax,vec[0]+0.12,vec[1]+0.1,lbl,col,fs=10,ha="left")

    ax.annotate("",xy=comm_v,xytext=BAv,
        arrowprops=dict(arrowstyle="->,head_width=0.07",color=ACC4,lw=2,ls="dashed"))

    ax.text(0.1,2.6,
        r"$[\hat{x},\hat{p}]=i\hbar \neq 0$ — non-commuting!"+"\n"
        r"$[\hat{A},\hat{B}]=0 \Rightarrow$ simultaneously measurable",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l07_commutator_geometry.png")


def l07_robertson_diagram(d):
    fig = _fig(9,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"Robertson Inequality: $\Delta A\,\Delta B \geq \frac{1}{2}|\langle[\hat{A},\hat{B}]\rangle|$",
                 color=TEXT,fontsize=12,pad=8)

    # Plot the uncertainty product vs state parameter
    theta = np.linspace(0,np.pi,300)
    # For spin-1/2: ΔSx ΔSy ≥ ½|⟨Sz⟩| = ½|cosθ/2|
    delta_sx = 0.5*np.sqrt(1-np.cos(theta)**2/4)  # simplified
    delta_sy = 0.5*np.sqrt(1-np.cos(theta)**2/4)
    product  = delta_sx * delta_sy
    bound    = 0.25*np.abs(np.cos(theta))

    ax.plot(theta, product, color=ACC1, lw=2.5, label=r"$\Delta S_x \cdot \Delta S_y$")
    ax.fill_between(theta, bound, product, color=ACC1, alpha=0.2, label="Allowed region")
    ax.plot(theta, bound, color=ACC3, lw=2.5, ls="--",
            label=r"Robertson bound $\frac{1}{2}|\langle S_z\rangle|$")
    ax.fill_between(theta, 0, bound, color=ACC3, alpha=0.12)

    ax.set_xlabel(r"State parameter $\theta$ (Bloch angle)", color=TEXTSUB, fontsize=10)
    ax.set_ylabel("Uncertainty", color=TEXTSUB, fontsize=10)
    ax.set_xticks([0,np.pi/4,np.pi/2,3*np.pi/4,np.pi])
    ax.set_xticklabels(["0","π/4","π/2","3π/4","π"],color=TEXTSUB)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.text(0.3,0.22,
        "Product always ≥ bound\nEquality at eigenstate of $S_z$\n"
        r"(min uncertainty for $[\hat{A},\hat{B}]|\psi\rangle \propto |\psi\rangle$)",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l07_robertson_diagram.png")


def l07_compatible_observables(d):
    fig = _fig(10,5.4)
    ax = fig.add_axes([0.05,0.05,0.90,0.90], facecolor=BG); ax.axis("off")
    ax.set_title("Compatible vs Incompatible Observables — Shared Eigenbasis",
                 color=TEXT,fontsize=12)
    ax.set_xlim(0,10); ax.set_ylim(0,6)

    # Compatible (commuting)
    ax.text(2.5,5.5,"COMPATIBLE: $[\\hat{A},\\hat{B}]=0$",
            color=ACC2,fontsize=12,ha="center",fontweight="bold")
    # Shared eigenbasis diagram
    for y,lbl,pa,pb in [(4.2,r"$|1\rangle$",1,2),(3.2,r"$|2\rangle$",3,1),(2.2,r"$|3\rangle$",-1,3)]:
        ax.text(1.0,y,lbl,color=TEXT,fontsize=11,va="center")
        ax.text(2.5,y,f"$a={pa}$",color=ACC3,fontsize=10,va="center",ha="center")
        ax.text(4.0,y,f"$b={pb}$",color=ACC2,fontsize=10,va="center",ha="center")
    ax.text(2.5,1.5,r"Shared eigenbasis $\Rightarrow$"+"\n"+"simultaneously measurable",
            color=TEXT,fontsize=10,ha="center",
            bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))

    # Divider
    ax.plot([5,5],[0.3,5.8],color=TEXTDIM,lw=1.5,ls="--")

    # Incompatible (non-commuting)
    ax.text(7.5,5.5,"INCOMPATIBLE: $[\\hat{A},\\hat{B}]\\neq 0$",
            color=ACC4,fontsize=12,ha="center",fontweight="bold")
    ax.text(7.5,4.2,r"$\hat{A}$ eigenbasis: $\{|a_1\rangle,|a_2\rangle\}$",
            color=ACC3,fontsize=10,ha="center")
    ax.text(7.5,3.2,r"$\hat{B}$ eigenbasis: $\{|b_1\rangle,|b_2\rangle\}$",
            color=ACC2,fontsize=10,ha="center")
    ax.annotate("",xy=(7.5,3.7),xytext=(7.5,4.0),
        arrowprops=dict(arrowstyle="<->",color=ACC4,lw=2))
    ax.text(7.5,2.3,"Different eigenbases\n"
            r"$\Delta A \cdot \Delta B \geq \frac{1}{2}|\langle[\hat{A},\hat{B}]\rangle|>0$",
            color=TEXT,fontsize=10,ha="center",
            bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l07_compatible_observables.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L08: Time Evolution
# ═══════════════════════════════════════════════════════════════════════════════

def l08_unitary_flow(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-1.55,1.55); ax.set_ylim(-1.55,1.55); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"Time Evolution $\hat{U}(t)=e^{-i\hat{H}t/\hbar}$ — Rotation on State Space",
                 color=TEXT,fontsize=12,pad=8)

    # Unit circle
    theta = np.linspace(0,2*np.pi,300)
    ax.plot(np.cos(theta),np.sin(theta),color=TEXTDIM,lw=1.5,ls="--",alpha=0.6)

    # Initial state
    psi0 = np.array([0.8,0.6])
    psi0 /= np.linalg.norm(psi0)

    # Time evolved states (rotation by ωt)
    omega = 1.0
    times = np.linspace(0,2*np.pi*0.8,8)
    colors_t = plt.cm.plasma(np.linspace(0.2,0.9,len(times)))

    for i,(t,col) in enumerate(zip(times,colors_t)):
        angle = omega*t
        R = np.array([[np.cos(angle),-np.sin(angle)],[np.sin(angle),np.cos(angle)]])
        psit = R @ psi0
        if i==0:
            _arr(ax,0,0,psit[0],psit[1],ACC1,lw=3)
            _lbl(ax,psit[0]+0.12,psit[1]+0.12,r"$|\psi(0)\rangle$",ACC1,fs=12)
        elif i==len(times)-1:
            _arr(ax,0,0,psit[0],psit[1],ACC4,lw=3)
            _lbl(ax,psit[0]+0.12,psit[1]+0.12,r"$|\psi(t)\rangle$",ACC4,fs=12)
        else:
            ax.scatter([psit[0]],[psit[1]],color=col,s=30,zorder=5,alpha=0.7)

    # Trajectory arc
    arc_t = np.linspace(0,omega*times[-1],100)
    arc_x = np.cos(arc_t+np.arctan2(psi0[1],psi0[0]))
    arc_y = np.sin(arc_t+np.arctan2(psi0[1],psi0[0]))
    ax.plot(arc_x,arc_y,color=ACC5,lw=2,alpha=0.7)

    ax.text(-1.45,-1.42,
        r"$|\psi(t)\rangle = e^{-i\hat{H}t/\hbar}|\psi(0)\rangle$"+"\n"
        r"‖ψ(t)‖ = 1 preserved (unitary!)",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC5,alpha=0.9))
    _save(fig, f"{d}/l08_unitary_flow.png")


def l08_heisenberg_schrodinger(d):
    fig = _fig(10,5.4)
    ax = fig.add_axes([0.04,0.06,0.92,0.86], facecolor=BG); ax.axis("off")
    ax.set_title("Schrödinger vs Heisenberg Pictures — Same Physics, Different Bookkeeping",
                 color=TEXT,fontsize=13)
    ax.set_xlim(0,10); ax.set_ylim(0,6.5)

    # Schrödinger side
    ax.add_patch(FancyBboxPatch((0.2,0.3),4.4,5.8,boxstyle="round,pad=0.1",
        facecolor=BGCARD,edgecolor=ACC1,lw=2))
    ax.text(2.4,5.8,"SCHRÖDINGER PICTURE",color=ACC1,fontsize=11,
            ha="center",fontweight="bold")
    items_s = [
        (r"State $|\psi(t)\rangle$ evolves with $t$","States rotate"),
        (r"$i\hbar\partial_t|\psi\rangle = \hat{H}|\psi\rangle$","SE for state"),
        (r"Operators $\hat{A}$ are static (fixed)","Operators fixed"),
        (r"$\langle\hat{A}\rangle(t) = \langle\psi(t)|\hat{A}|\psi(t)\rangle$","Expectation value"),
    ]
    for i,(main,sub) in enumerate(items_s):
        ax.text(2.4,4.8-i*1.05,main,color=TEXT,fontsize=10,ha="center",va="center",
                bbox=dict(boxstyle="round,pad=0.3",facecolor=BG,edgecolor=ACC1,alpha=0.7))

    # Middle = sign
    ax.text(5.0,3.5,r"$\Leftrightarrow$",color=ACC2,fontsize=22,ha="center",va="center")
    ax.text(5.0,2.8,"Same\npredictions",color=ACC2,fontsize=10,ha="center")

    # Heisenberg side
    ax.add_patch(FancyBboxPatch((5.4,0.3),4.4,5.8,boxstyle="round,pad=0.1",
        facecolor=BGCARD,edgecolor=ACC3,lw=2))
    ax.text(7.6,5.8,"HEISENBERG PICTURE",color=ACC3,fontsize=11,
            ha="center",fontweight="bold")
    items_h = [
        (r"State $|\psi\rangle$ is static (frozen)","States fixed"),
        (r"$\frac{d\hat{A}_H}{dt}=\frac{i}{\hbar}[\hat{H},\hat{A}_H]$","EOM for operator"),
        (r"Operators $\hat{A}_H(t)$ evolve with $t$","Operators rotate"),
        (r"$\langle\hat{A}\rangle(t) = \langle\psi|\hat{A}_H(t)|\psi\rangle$","Expectation value"),
    ]
    for i,(main,sub) in enumerate(items_h):
        ax.text(7.6,4.8-i*1.05,main,color=TEXT,fontsize=10,ha="center",va="center",
                bbox=dict(boxstyle="round,pad=0.3",facecolor=BG,edgecolor=ACC3,alpha=0.7))
    _save(fig, f"{d}/l08_heisenberg_schrodinger.png")


def l08_ehrenfest(d):
    fig = _fig(10,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"Ehrenfest's Theorem: $m\frac{d}{dt}\langle\hat{x}\rangle = \langle\hat{p}\rangle$"
                 " — Quantum ↔ Classical",
                 color=TEXT,fontsize=12,pad=8)

    t = np.linspace(0,4*np.pi,500)
    omega = 1.0

    # Classical trajectory
    x_cl = 2.0*np.cos(omega*t)
    p_cl = -2.0*np.sin(omega*t)

    # Quantum expectation values (same for coherent state)
    x_qm = x_cl + 0.05*np.random.RandomState(42).randn(len(t)).cumsum()*0.02
    p_qm = p_cl + 0.05*np.random.RandomState(43).randn(len(t)).cumsum()*0.02

    ax.plot(t,x_cl,color=ACC3,lw=2.5,label=r"Classical $x(t)$",ls="--")
    ax.plot(t,p_cl,color=ACC2,lw=2.5,label=r"Classical $p(t)$",ls="--")
    ax.plot(t,x_qm,color=ACC1,lw=2,alpha=0.85,label=r"$\langle\hat{x}\rangle(t)$")
    ax.plot(t,p_qm,color=ACC4,lw=2,alpha=0.85,label=r"$\langle\hat{p}\rangle(t)$")
    ax.axhline(0,color=TEXTDIM,lw=0.7)
    ax.set_xlabel("Time t",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Position / Momentum",color=TEXTSUB,fontsize=10)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.text(0.5,-1.8,
        r"Ehrenfest: $\langle x\rangle$, $\langle p\rangle$ obey Newton's laws"+"\n"
        "Quantum centre-of-mass follows classical orbit",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l08_ehrenfest.png")


def l08_exponential_steps(d):
    fig = _fig(9,5.4); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"$e^{-i\hat{H}t/\hbar}$ as Repeated Tiny Rotations (HS Intuition)",
                 color=TEXT,fontsize=12,pad=8)

    # Show unit circle with progressive rotations
    theta_total = np.pi*0.9
    ax.set_xlim(-1.6,1.6); ax.set_ylim(-1.6,1.6); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)

    theta_arc = np.linspace(0,2*np.pi,300)
    ax.plot(np.cos(theta_arc),np.sin(theta_arc),color=TEXTDIM,lw=1.2,ls="--",alpha=0.5)

    # Initial state
    psi0_angle = 0.0
    n_steps = 6
    step_angle = theta_total/n_steps
    colors_s = plt.cm.viridis(np.linspace(0.3,0.9,n_steps+1))

    current = psi0_angle
    for i in range(n_steps+1):
        x0 = np.cos(current); y0 = np.sin(current)
        lbl = f"$t_{i}$" if i in [0,3,n_steps] else ""
        ax.scatter([x0],[y0],color=colors_s[i],s=80,zorder=5)
        if lbl:
            ax.text(x0*1.18,y0*1.18,lbl,color=colors_s[i],fontsize=10,ha="center")
        if i < n_steps:
            next_angle = current+step_angle
            ax.annotate("",
                xy=(np.cos(next_angle),np.sin(next_angle)),
                xytext=(np.cos(current),np.sin(current)),
                arrowprops=dict(arrowstyle="->,head_width=0.07",
                                color=colors_s[i],lw=1.8,
                                connectionstyle=f"arc3,rad=0.2"))
            current = next_angle

    ax.text(-1.5,-1.45,
        r"Each step: $e^{-i\hat{H}\Delta t/\hbar} \approx \hat{I} - \frac{i\hat{H}\Delta t}{\hbar}$"+"\n"
        "Infinitely many infinitesimal steps → full rotation",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC5,alpha=0.9))
    _save(fig, f"{d}/l08_exponential_steps.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L09: Tensor Products & Entanglement
# ═══════════════════════════════════════════════════════════════════════════════

def l09_product_space_grid(d):
    fig = _fig(9,5.5); ax = _ax(fig,[0.10,0.10,0.82,0.82])
    ax.set_title(r"Tensor Product: $\mathcal{H}_A \otimes \mathcal{H}_B$ — Grid of Basis States",
                 color=TEXT,fontsize=12,pad=8)
    ax.set_xlim(-0.5,3.5); ax.set_ylim(-0.5,2.8)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_xlabel(r"System A basis: $|0_A\rangle, |1_A\rangle, |2_A\rangle$",
                  color=TEXTSUB,fontsize=10)
    ax.set_ylabel(r"System B basis: $|0_B\rangle, |1_B\rangle$",color=TEXTSUB,fontsize=10)

    labels_a = [r"$|0_A\rangle$",r"$|1_A\rangle$",r"$|2_A\rangle$"]
    labels_b = [r"$|0_B\rangle$",r"$|1_B\rangle$"]
    colors_g = [[ACC1,ACC3,ACC2],[ACC4,ACC5,ACC1]]

    for j,lb in enumerate(labels_b):
        for i,la in enumerate(labels_a):
            col = colors_g[j][i]
            circle = plt.Circle((i,j),0.35,color=col,alpha=0.8,zorder=3)
            ax.add_patch(circle)
            lbl = f"$|{i}_A{j}_B\\rangle$"
            ax.text(i,j,lbl,color="black",fontsize=8.5,ha="center",va="center",
                    fontweight="bold",zorder=4)

    ax.set_xticks([0,1,2]); ax.set_xticklabels(labels_a,color=TEXTSUB,fontsize=9)
    ax.set_yticks([0,1]);   ax.set_yticklabels(labels_b,color=TEXTSUB,fontsize=9)
    ax.text(1.0,2.45,
        r"$\dim(\mathcal{H}_A\otimes\mathcal{H}_B) = \dim\mathcal{H}_A \times \dim\mathcal{H}_B = 3\times 2 = 6$",
        color=TEXT,fontsize=10,ha="center",va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l09_product_space_grid.png")


def l09_entangled_vs_product(d):
    fig, (ax1,ax2) = plt.subplots(1,2,figsize=(10,5.5),facecolor=BG)
    for ax in [ax1,ax2]:
        ax.set_facecolor(BGCARD); ax.axis("off")
        ax.set_xlim(0,4); ax.set_ylim(0,4)

    # Product state
    ax1.set_title("PRODUCT STATE",color=ACC2,fontsize=12,fontweight="bold",pad=8)
    ax1.text(2,3.5,r"$|\psi\rangle = |\psi_A\rangle \otimes |\psi_B\rangle$",
             color=TEXT,fontsize=11,ha="center")
    for i,lbl in enumerate([r"$|0_A\rangle$",r"$|1_A\rangle$"]):
        for j,lblb in enumerate([r"$|0_B\rangle$",r"$|1_B\rangle$"]):
            alpha_val = 0.5  # separable: all amplitudes factorise
            c = plt.Circle((0.8+i*1.8,0.8+j*1.4),0.5,color=ACC2,
                           alpha=alpha_val,zorder=3)
            ax1.add_patch(c)
            ax1.text(0.8+i*1.8,0.8+j*1.4,f"{alpha_val:.1f}",
                    color="white",fontsize=9,ha="center",va="center")
    ax1.text(2,0.2,"Amplitudes factorise\n"
             r"$c_{ij}=\alpha_i\beta_j$ — NO correlations",
             color=TEXT,fontsize=9,ha="center",
             bbox=dict(boxstyle="round,pad=0.3",facecolor=BG,edgecolor=ACC2,alpha=0.9))

    # Entangled state
    ax2.set_title("ENTANGLED STATE",color=ACC4,fontsize=12,fontweight="bold",pad=8)
    ax2.text(2,3.5,r"$|\Phi^+\rangle = \frac{1}{\sqrt{2}}(|00\rangle+|11\rangle)$",
             color=TEXT,fontsize=11,ha="center")
    entangle = {(0,0):0.707,(0,1):0.0,(1,0):0.0,(1,1):0.707}
    for i in range(2):
        for j in range(2):
            val = entangle[(i,j)]
            alpha_val = max(0.15,abs(val)*1.2)
            col = ACC4 if val>0.1 else BGCARD
            c = plt.Circle((0.8+i*1.8,0.8+j*1.4),0.5,color=col,
                           alpha=alpha_val,zorder=3)
            ax2.add_patch(c)
            if val>0.01:
                ax2.text(0.8+i*1.8,0.8+j*1.4,f"{val:.2f}",
                        color="white",fontsize=9,ha="center",va="center")
    ax2.text(2,0.2,"Cannot factorise!\nMeasuring A instantly determines B",
             color=TEXT,fontsize=9,ha="center",
             bbox=dict(boxstyle="round,pad=0.3",facecolor=BG,edgecolor=ACC4,alpha=0.9))
    fig.patch.set_facecolor(BG)
    _save(fig, f"{d}/l09_entangled_vs_product.png")


def l09_schmidt_decomp(d):
    fig = _fig(10,5.5); ax = _ax(fig,[0.08,0.10,0.84,0.82])
    ax.set_title(r"Schmidt Decomposition: $|\Psi\rangle = \sum_k\lambda_k|\alpha_k\rangle_A|\beta_k\rangle_B$",
                 color=TEXT,fontsize=12,pad=8)

    # Bar chart of Schmidt coefficients for different states
    n_schmidt = 4
    ns = np.arange(1,n_schmidt+1)

    # Product state: only one non-zero
    prod = np.array([1.0,0.0,0.0,0.0])
    # Partially entangled
    part = np.array([0.8,0.5,0.2,0.1]); part /= np.linalg.norm(part)
    # Maximally entangled
    maxe = np.ones(n_schmidt)/np.sqrt(n_schmidt)

    width = 0.25
    ax.bar(ns-width, prod**2, width, color=ACC2, alpha=0.85, label="Product state")
    ax.bar(ns,       part**2, width, color=ACC3, alpha=0.85, label="Partially entangled")
    ax.bar(ns+width, maxe**2, width, color=ACC4, alpha=0.85, label="Maximally entangled")
    ax.axhline(0,color=TEXTDIM,lw=0.7)

    ax.set_xlabel("Schmidt index k",color=TEXTSUB,fontsize=10)
    ax.set_ylabel(r"$\lambda_k^2$ (Schmidt coefficient squared)",color=TEXTSUB,fontsize=10)
    ax.set_xticks(ns); ax.set_xticklabels([f"k={k}" for k in ns],color=TEXTSUB)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)

    entropies = [0.0,
                 -sum(p**2*np.log2(p**2+1e-12) for p in part),
                 np.log2(n_schmidt)]
    ax.text(2.5,0.88,
        f"Entanglement entropy $S=-\\sum_k\\lambda_k^2\\log\\lambda_k^2$:\n"
        f"  Product: {entropies[0]:.2f}   Partial: {entropies[1]:.2f}   "
        f"Maximal: {entropies[2]:.2f}",
        color=TEXT,fontsize=10,ha="center",va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l09_schmidt_decomp.png")


def l09_partial_trace(d):
    fig = _fig(10,5.5)
    ax = fig.add_axes([0.04,0.05,0.92,0.88], facecolor=BG); ax.axis("off")
    ax.set_title(r"Partial Trace: $\hat{\rho}_A = \mathrm{Tr}_B(\hat{\rho}_{AB})$ — Ignoring a Subsystem",
                 color=TEXT,fontsize=13)
    ax.set_xlim(0,10); ax.set_ylim(0,6)

    # Full density matrix (bipartite, 4×4)
    ax.text(1.8,5.6,r"$\hat{\rho}_{AB}$ (4×4 matrix)",color=ACC1,fontsize=11,
            ha="center",fontweight="bold")
    for i in range(4):
        for j in range(4):
            alpha_v = 0.9 if i==j else (0.5 if abs(i-j)==1 else 0.15)
            col = ACC1 if i==j else (ACC5 if abs(i-j)==1 else BGCARD)
            rect = FancyBboxPatch((0.2+j*0.65,3.0+i*(-0.65)),0.58,0.58,
                boxstyle="round,pad=0.03",facecolor=col,alpha=alpha_v,
                edgecolor=TEXTDIM,lw=0.8)
            ax.add_patch(rect)
            ax.text(0.2+j*0.65+0.29,3.0+i*(-0.65)+0.29,f"ρ{i}{j}",
                    color="white" if alpha_v>0.3 else TEXTDIM,
                    fontsize=6.5,ha="center",va="center")

    # Arrow
    ax.annotate("",xy=(5.0,3.5),xytext=(3.0,3.5),
        arrowprops=dict(arrowstyle="->,head_width=0.2",color=ACC2,lw=3))
    ax.text(4.0,4.2,r"$\mathrm{Tr}_B$",color=ACC2,fontsize=14,ha="center",
            fontweight="bold")
    ax.text(4.0,3.85,"Sum over\nB states",color=TEXTSUB,fontsize=9,ha="center")

    # Reduced density matrix (2×2)
    ax.text(7.0,5.6,r"$\hat{\rho}_A$ (2×2 reduced)",color=ACC3,fontsize=11,
            ha="center",fontweight="bold")
    for i in range(2):
        for j in range(2):
            alpha_v = 0.9 if i==j else 0.4
            col = ACC3 if i==j else ACC5
            rect = FancyBboxPatch((5.8+j*1.1,3.2+(1-i)*1.1),0.95,0.95,
                boxstyle="round,pad=0.05",facecolor=col,alpha=alpha_v,
                edgecolor=TEXTDIM,lw=1.2)
            ax.add_patch(rect)
            ax.text(5.8+j*1.1+0.475,3.2+(1-i)*1.1+0.475,f"ρ_A{i}{j}",
                    color="white",fontsize=9,ha="center",va="center")

    ax.text(5.0,1.5,
        r"$(\hat{\rho}_A)_{ij} = \sum_k \langle ik|\hat{\rho}_{AB}|jk\rangle$"+"\n"
        r"$\mathrm{Tr}(\hat{\rho}_A)=1$, but $\hat{\rho}_A^2\neq\hat{\rho}_A$ if entangled (mixed state)",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.5",facecolor=BGCARD,edgecolor=ACC3,alpha=0.95))
    _save(fig, f"{d}/l09_partial_trace.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L10: Spin & SU(2)
# ═══════════════════════════════════════════════════════════════════════════════

def l10_bloch_sphere_spin(d):
    """3D Bloch sphere with spin states labelled — reuse + extend L01 version."""
    fig = plt.figure(figsize=(9,7),facecolor=BG,dpi=150)
    ax  = fig.add_subplot(111,projection="3d",facecolor=BG)
    u = np.linspace(0,2*np.pi,40); v = np.linspace(0,np.pi,30)
    xs = np.outer(np.cos(u),np.sin(v)); ys = np.outer(np.sin(u),np.sin(v))
    zs = np.outer(np.ones_like(u),np.cos(v))
    ax.plot_wireframe(xs,ys,zs,color=TEXTDIM,alpha=0.12,lw=0.5,rstride=3,cstride=3)

    spin_states = [
        ((0,0,1), r"|↑⟩=|+z⟩", ACC1),((0,0,-1), r"|↓⟩=|-z⟩", ACC4),
        ((1,0,0), r"|+x⟩", ACC3),((-1,0,0), r"|-x⟩", ACC3),
        ((0,1,0), r"|+y⟩", ACC2),((0,-1,0), r"|-y⟩", ACC2),
    ]
    for (x,y,z),lbl,col in spin_states:
        ax.scatter([x],[y],[z],color=col,s=80,zorder=5)
        ax.text(x*1.22,y*1.22,z*1.22,lbl,color=col,fontsize=9,va="center")

    # General state on sphere
    th,ph = np.pi/3, np.pi/4
    bx = np.sin(th)*np.cos(ph); by = np.sin(th)*np.sin(ph); bz = np.cos(th)
    ax.quiver(0,0,0,bx,by,bz,color=ACC5,lw=2.5,arrow_length_ratio=0.15)
    ax.text(bx*1.22,by*1.22,bz*1.22,r"$|\psi\rangle=\cos\frac{θ}{2}|↑⟩+e^{iφ}\sin\frac{θ}{2}|↓⟩$",
            color=ACC5,fontsize=8)

    # Axes
    for start,end,col in [((-1.3,0,0),(1.3,0,0),ACC3),
                           ((0,-1.3,0),(0,1.3,0),ACC2),((0,0,-1.3),(0,0,1.3),ACC1)]:
        ax.quiver(*start,*(np.array(end)-np.array(start)),color=col,lw=1.2,
                  alpha=0.5,arrow_length_ratio=0.1)

    eq = np.linspace(0,2*np.pi,100)
    ax.plot(np.cos(eq),np.sin(eq),0,color=TEXTDIM,lw=1,alpha=0.4,ls="--")

    ax.set_title("Bloch Sphere: Spin-1/2 State Space\n"
                 r"$\mathbb{P}(\mathbb{C}^2)\cong S^2$",color=TEXT,fontsize=11,pad=10)
    for pane in [ax.xaxis.pane,ax.yaxis.pane,ax.zaxis.pane]:
        pane.fill=False; pane.set_edgecolor(TEXTDIM)
    ax.tick_params(colors=TEXTSUB,labelsize=7)
    ax.set_xlabel("X",color=ACC3,fontsize=9); ax.set_ylabel("Y",color=ACC2,fontsize=9)
    ax.set_zlabel("Z",color=ACC1,fontsize=9)
    _save(fig, f"{d}/l10_bloch_sphere_spin.png")


def l10_pauli_matrices(d):
    fig = _fig(10,5.5)
    ax = fig.add_axes([0.04,0.04,0.92,0.90], facecolor=BG); ax.axis("off")
    ax.set_title(r"Pauli Matrices: $\sigma_x,\sigma_y,\sigma_z$ — Generators of SU(2)",
                 color=TEXT,fontsize=12)
    ax.set_xlim(0,10); ax.set_ylim(0,6)

    paulis = [
        (r"$\sigma_x$: bit flip (X)",
         "Flips spin\n(NOT gate)", r"$|+x\rangle,|-x\rangle$", 1.5, ACC3),
        (r"$\sigma_y$: flip+rotate (Y)",
         "Flips+rotates\n(complex flip)", r"$|+y\rangle,|-y\rangle$", 5.0, ACC2),
        (r"$\sigma_z$: phase flip (Z)",
         "Phase flip\n(Z gate)", r"$|↑\rangle,|↓\rangle$", 8.5, ACC1),
    ]
    for formula,action,eigs,x,col in paulis:
        ax.add_patch(FancyBboxPatch((x-1.3,1.2),2.6,3.8,boxstyle="round,pad=0.1",
            facecolor=BGCARD,edgecolor=col,lw=2))
        ax.text(x,4.6,formula,color=col,fontsize=11,ha="center",va="center")
        ax.text(x,3.0,action,color=TEXT,fontsize=10,ha="center",va="center")
        ax.text(x,1.8,f"Eigenstates:\n{eigs}",color=TEXTSUB,fontsize=9,ha="center",va="center")

    ax.text(5.0,0.5,
        r"$[\sigma_i,\sigma_j]=2i\varepsilon_{ijk}\sigma_k$  (Lie algebra su(2))"+"\n"
        r"$\sigma_i^2=\hat{I}$  ·  $\mathrm{Tr}(\sigma_i)=0$  ·  eigenvalues $\pm 1$",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l10_pauli_matrices.png")


def l10_su2_rotation(d):
    fig = _fig(); ax = _ax(fig)
    ax.set_xlim(-1.6,1.6); ax.set_ylim(-1.6,1.6); ax.set_aspect("equal")
    ax.axhline(0,color=TEXTDIM,lw=0.7); ax.axvline(0,color=TEXTDIM,lw=0.7)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_title(r"SU(2) Rotation: $U(\theta,\hat{n})=e^{-i\theta\hat{n}\cdot\boldsymbol{\sigma}/2}$"
                 "\n(on Bloch circle cross-section)",
                 color=TEXT,fontsize=11,pad=8)

    theta_circ = np.linspace(0,2*np.pi,300)
    ax.plot(np.cos(theta_circ),np.sin(theta_circ),color=TEXTDIM,lw=1.2,ls="--",alpha=0.5)

    # Initial state on Bloch circle
    psi0_angle = np.pi/6
    psi0 = np.array([np.cos(psi0_angle),np.sin(psi0_angle)])
    _arr(ax,0,0,psi0[0],psi0[1],ACC1,lw=3)
    _lbl(ax,psi0[0]+0.12,psi0[1]+0.12,r"$|\psi_0\rangle$",ACC1,fs=12)

    # Rotations by different angles
    for angle,col in [(np.pi/4,ACC3),(np.pi/2,ACC2),(np.pi,ACC4)]:
        R = np.array([[np.cos(angle),-np.sin(angle)],[np.sin(angle),np.cos(angle)]])
        psit = R @ psi0
        _arr(ax,0,0,psit[0],psit[1],col,lw=2)
        ax.text(psit[0]*1.15,psit[1]*1.15,
                f"θ={np.degrees(angle):.0f}°",color=col,fontsize=9,ha="center")

    # Note: π rotation in SU(2) ≠ π in SO(3)
    ax.text(-1.5,-1.42,
        r"SU(2) double cover of SO(3)"+"\n"
        r"Spin-1/2 needs $4\pi$ rotation to return!",
        color=TEXT,fontsize=10,va="bottom",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l10_su2_rotation.png")


def l10_angular_momentum_ladder(d):
    fig = _fig(9,5.5)
    ax = fig.add_axes([0.05,0.05,0.90,0.88], facecolor=BG); ax.axis("off")
    ax.set_title(r"Angular Momentum Ladder: $\hat{J}_\pm|j,m\rangle \propto |j,m\pm1\rangle$",
                 color=TEXT,fontsize=12)
    ax.set_xlim(0,10); ax.set_ylim(0,6.5)

    # For j=3/2: m = -3/2,-1/2,+1/2,+3/2
    ms = [-1.5,-0.5,0.5,1.5]
    ys = [1.5,2.8,4.1,5.4]
    for m,y in zip(ms,ys):
        ax.add_patch(FancyBboxPatch((3.8,y-0.35),2.4,0.7,
            boxstyle="round,pad=0.08",facecolor=BGCARD,edgecolor=ACC1,lw=2))
        ax.text(5.0,y,f"$|j=3/2,\\ m={m:+.1f}\\rangle$",
                color=ACC1,fontsize=11,ha="center",va="center")

    # Ladder operators
    for i in range(len(ms)-1):
        y_lo,y_hi = ys[i],ys[i+1]
        coeff = np.sqrt(1.5*(1.5+1)-ms[i]*(ms[i]+1))
        ax.annotate("",xy=(6.6,y_hi-0.1),xytext=(6.6,y_lo+0.1),
            arrowprops=dict(arrowstyle="->,head_width=0.12",color=ACC2,lw=2))
        ax.text(7.2,(y_hi+y_lo)/2,r"$\hat{J}_+$"+f"\n×{coeff:.2f}",
                color=ACC2,fontsize=9,ha="left",va="center")
        ax.annotate("",xy=(3.4,y_lo+0.1),xytext=(3.4,y_hi-0.1),
            arrowprops=dict(arrowstyle="->,head_width=0.12",color=ACC3,lw=2))
        ax.text(2.8,(y_hi+y_lo)/2,r"$\hat{J}_-$",color=ACC3,fontsize=9,ha="right",va="center")

    ax.text(5.0,0.5,
        r"$\hat{J}_\pm = \hat{J}_x \pm i\hat{J}_y$"+"\n"
        r"$[\hat{J}_z,\hat{J}_\pm]=\pm\hbar\hat{J}_\pm$  (raising/lowering commutation)",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l10_angular_momentum_ladder.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L11: Density Operators & Mixed States
# ═══════════════════════════════════════════════════════════════════════════════

def l11_density_bloch(d):
    fig = plt.figure(figsize=(9,7),facecolor=BG,dpi=150)
    ax  = fig.add_subplot(111,projection="3d",facecolor=BG)
    u = np.linspace(0,2*np.pi,40); v = np.linspace(0,np.pi,30)
    xs = np.outer(np.cos(u),np.sin(v)); ys = np.outer(np.sin(u),np.sin(v))
    zs = np.outer(np.ones_like(u),np.cos(v))
    ax.plot_wireframe(xs,ys,zs,color=TEXTDIM,alpha=0.12,lw=0.5,rstride=3,cstride=3)

    # Pure states on surface
    pure_states = [(0,0,1,r"$|↑\rangle$ (pure)",ACC1),
                   (0,0,-1,r"$|↓\rangle$ (pure)",ACC4),
                   (1/np.sqrt(2),0,1/np.sqrt(2),r"Pure superposition",ACC3)]
    for x,y,z,lbl,col in pure_states:
        ax.scatter([x],[y],[z],color=col,s=100,zorder=5)
        ax.text(x*1.2,y*1.2,z*1.2,lbl,color=col,fontsize=8)
        ax.quiver(0,0,0,x,y,z,color=col,lw=1.5,alpha=0.7,arrow_length_ratio=0.1)

    # Mixed states inside sphere
    mixed = [(0,0,0.6,"Partially mixed",ACC5),
             (0,0,0,"Maximally mixed\n(centre)",TEXT)]
    for x,y,z,lbl,col in mixed:
        ax.scatter([x],[y],[z],color=col,s=120,zorder=5,marker="^")
        ax.text(x+0.12,y,z+0.12,lbl,color=col,fontsize=8)

    eq = np.linspace(0,2*np.pi,100)
    ax.plot(np.cos(eq),np.sin(eq),0,color=TEXTDIM,lw=1,alpha=0.4,ls="--")

    ax.set_title(r"Bloch Ball: Pure States on Surface, Mixed States Inside"+"\n"
                 r"$|\mathbf{r}|=1$ (pure)  ·  $|\mathbf{r}|<1$ (mixed)",
                 color=TEXT,fontsize=10,pad=10)
    for pane in [ax.xaxis.pane,ax.yaxis.pane,ax.zaxis.pane]:
        pane.fill=False; pane.set_edgecolor(TEXTDIM)
    ax.tick_params(colors=TEXTSUB,labelsize=7)
    _save(fig, f"{d}/l11_density_bloch.png")


def l11_pure_vs_mixed(d):
    fig, axes = plt.subplots(1,3,figsize=(11,5),facecolor=BG)
    titles = ["Pure State\n$\\hat{\\rho}=|\\psi\\rangle\\langle\\psi|$",
              "Partially Mixed\n$\\hat{\\rho}=\\sum_i p_i|\\psi_i\\rangle\\langle\\psi_i|$",
              "Maximally Mixed\n$\\hat{\\rho}=\\hat{I}/d$"]
    matrices = [
        np.array([[1,0],[0,0]]),
        np.array([[0.7,0.2],[0.2,0.3]]),
        np.array([[0.5,0],[0,0.5]]),
    ]
    colors_m = [ACC1,ACC3,ACC4]

    for ax,mat,title,col in zip(axes,matrices,titles,colors_m):
        ax.set_facecolor(BGCARD)
        ax.set_title(title,color=col,fontsize=10,pad=6)
        for sp in ax.spines.values(): sp.set_color(TEXTDIM)
        ax.tick_params(colors=TEXTSUB,labelsize=9)
        im = ax.imshow(mat,cmap="Blues",vmin=0,vmax=1,aspect="equal")
        for i in range(2):
            for j in range(2):
                ax.text(j,i,f"{mat[i,j]:.1f}",ha="center",va="center",
                        color="white" if mat[i,j]>0.4 else TEXTSUB,fontsize=14)
        ax.set_xticks([0,1]); ax.set_yticks([0,1])
        purity = np.trace(mat@mat)
        ax.set_xlabel(f"Tr(ρ²)={purity:.2f}  {'(pure ✓)' if abs(purity-1)<0.01 else '(mixed)'}",
                      color=TEXTSUB,fontsize=9)

    fig.patch.set_facecolor(BG)
    plt.tight_layout(pad=1.2)
    _save(fig, f"{d}/l11_pure_vs_mixed.png")


def l11_kraus_channel(d):
    fig = _fig(10,5.5)
    ax = fig.add_axes([0.04,0.04,0.92,0.90], facecolor=BG); ax.axis("off")
    ax.set_title(r"Quantum Channel: $\hat{\rho}' = \sum_k \hat{K}_k\hat{\rho}\hat{K}_k^\dagger$"
                 "  (Kraus representation)",
                 color=TEXT,fontsize=12)
    ax.set_xlim(0,10); ax.set_ylim(0,6)

    # Input state
    ax.add_patch(FancyBboxPatch((0.3,2.2),1.8,1.6,boxstyle="round,pad=0.1",
        facecolor=BGCARD,edgecolor=ACC1,lw=2))
    ax.text(1.2,3.0,r"$\hat{\rho}$"+"\n(input)",color=ACC1,fontsize=11,
            ha="center",va="center")

    # Channel box
    ax.add_patch(FancyBboxPatch((3.2,1.2),3.6,3.6,boxstyle="round,pad=0.1",
        facecolor=BGCARD,edgecolor=ACC3,lw=2.5))
    ax.text(5.0,4.5,"QUANTUM CHANNEL",color=ACC3,fontsize=11,
            ha="center",fontweight="bold")
    for i,(k,lbl) in enumerate([(r"$\hat{K}_0 = \sqrt{1-p}\hat{I}$","Identity (no error)"),
                                  (r"$\hat{K}_1 = \sqrt{p}\hat{\sigma}_x$","Bit flip")]):
        ax.text(5.0,3.5-i*0.8,k,color=TEXT,fontsize=10,ha="center")
        ax.text(5.0,3.1-i*0.8,lbl,color=TEXTSUB,fontsize=8.5,ha="center")
    ax.text(5.0,1.5,r"$\sum_k\hat{K}_k^\dagger\hat{K}_k=\hat{I}$ (trace-preserving)",
            color=TEXTSUB,fontsize=9,ha="center")

    # Output state
    ax.add_patch(FancyBboxPatch((7.9,2.2),1.8,1.6,boxstyle="round,pad=0.1",
        facecolor=BGCARD,edgecolor=ACC4,lw=2))
    ax.text(8.8,3.0,r"$\hat{\rho}'$"+"\n(output)",color=ACC4,fontsize=11,
            ha="center",va="center")

    # Arrows
    ax.annotate("",xy=(3.2,3.0),xytext=(2.1,3.0),
        arrowprops=dict(arrowstyle="->,head_width=0.18",color=ACC2,lw=2.5))
    ax.annotate("",xy=(7.9,3.0),xytext=(6.8,3.0),
        arrowprops=dict(arrowstyle="->,head_width=0.18",color=ACC2,lw=2.5))

    ax.text(5.0,0.5,
        "CPTP map: Completely Positive & Trace-Preserving\n"
        "Most general physical evolution of an open quantum system",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC2,alpha=0.9))
    _save(fig, f"{d}/l11_kraus_channel.png")


def l11_decoherence(d):
    fig = _fig(10,5.5); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title("Decoherence: Off-Diagonal Elements Decay → Classical Mixture",
                 color=TEXT,fontsize=12,pad=8)

    t = np.linspace(0,5,300)
    gamma = 0.8

    # Off-diagonal (coherences): decay exponentially
    rho_01 = 0.5*np.exp(-gamma*t)
    # Diagonal: approach 0.5
    rho_00 = 0.5 + 0.5*np.exp(-2*gamma*t)
    rho_11 = 1 - rho_00

    ax.plot(t,rho_00,color=ACC1,lw=2.5,label=r"$\hat{\rho}_{00}$ (population)")
    ax.plot(t,rho_11,color=ACC4,lw=2.5,label=r"$\hat{\rho}_{11}$ (population)")
    ax.plot(t,rho_01,color=ACC3,lw=2.5,label=r"$|\hat{\rho}_{01}|$ (coherence)")
    ax.fill_between(t,0,rho_01,color=ACC3,alpha=0.15)
    ax.axhline(0.5,color=TEXTDIM,lw=1,ls=":")
    ax.axhline(0,color=TEXTDIM,lw=0.7)

    ax.set_xlabel("Time t",color=TEXTSUB,fontsize=10)
    ax.set_ylabel(r"$\hat{\rho}_{ij}(t)$",color=TEXTSUB,fontsize=10)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.set_ylim(-0.08,1.08)
    ax.text(2.5,0.75,"Coherences $\\to$ 0\n"
            r"$\hat{\rho}\to\mathrm{diag}(1/2,\ 1/2)$ (classical mixture)",
            color=TEXT,fontsize=10,ha="center",
            bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC3,alpha=0.9))
    _save(fig, f"{d}/l11_decoherence.png")


# ═══════════════════════════════════════════════════════════════════════════════
# L12: Rigged Hilbert Spaces
# ═══════════════════════════════════════════════════════════════════════════════

def l12_gelfand_triple(d):
    fig = _fig(10,5.5)
    ax = fig.add_axes([0.04,0.04,0.92,0.90], facecolor=BG); ax.axis("off")
    ax.set_title(r"Gel'fand Triple (Rigged Hilbert Space): $\Phi \subset \mathcal{H} \subset \Phi'$",
                 color=TEXT,fontsize=13)
    ax.set_xlim(0,10); ax.set_ylim(0,6.5)

    # Nested ellipses
    for (cx,cy,rx,ry,col,alpha,lbl,sublbl) in [
        (5,3.5,4.5,2.8,TEXTDIM,0.06,r"$\Phi'$ (distributions)","Contains |x⟩, |p⟩, δ(x)"),
        (5,3.5,3.2,2.0,ACC1,0.12,r"$\mathcal{H}=L^2(\mathbb{R})$","Normalisable wavefunctions"),
        (5,3.5,1.8,1.1,ACC2,0.20,r"$\Phi$ (Schwartz space)","Test functions, smooth & decaying"),
    ]:
        e = mpatches.Ellipse((cx,cy),2*rx,2*ry,facecolor=col,alpha=alpha,
                             edgecolor=col,linewidth=2)
        ax.add_patch(e)
        ax.text(cx+rx*0.55,cy+ry*0.7,lbl,color=col,fontsize=11,ha="center",fontweight="bold")
        ax.text(cx+rx*0.55,cy+ry*0.7-0.45,sublbl,color=TEXTSUB,fontsize=9,ha="center")

    ax.text(5.0,0.5,
        r"$|x\rangle\notin\mathcal{H}$  (not normalizable: $\langle x|x\rangle=\delta(0)$)"+"\n"
        r"$|x\rangle\in\Phi'$  (exists as a distribution, acts on $\Phi$ functions)"+"\n"
        r"Nuclear spectral theorem: self-adjoint ops have eigenvectors in $\Phi'$",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.5",facecolor=BGCARD,edgecolor=ACC1,alpha=0.95))
    _save(fig, f"{d}/l12_gelfand_triple.png")


def l12_distributional_delta(d):
    fig = _fig(10,5.5); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"$\delta(x)$ as a Distribution — Acts on Test Functions, Not a Function Itself",
                 color=TEXT,fontsize=12,pad=8)

    x = np.linspace(-3,3,2000)
    test_fn = np.exp(-x**2/0.5)*np.cos(2*x)
    test_fn /= np.max(np.abs(test_fn))

    ax.plot(x,test_fn,color=ACC2,lw=2,label=r"Test function $f(x)\in\Phi$",alpha=0.8)
    ax.fill_between(x,0,test_fn,color=ACC2,alpha=0.12)

    # Approximation of delta
    eps = 0.15
    x0  = 0.0
    delta_approx = np.exp(-0.5*((x-x0)/eps)**2)/(eps*np.sqrt(2*np.pi))
    delta_approx = np.clip(delta_approx,0,4)
    ax.fill_between(x,0,delta_approx,where=delta_approx>0.05,
                    color=ACC4,alpha=0.4,label=r"$\delta_\epsilon(x)$ approx")
    ax.plot(x,delta_approx,color=ACC4,lw=2)

    # The action
    f_at_0 = np.interp(x0,x,test_fn)
    ax.scatter([x0],[f_at_0],color=TEXT,s=120,zorder=6,
               label=f"$f(0)={f_at_0:.3f}$ = action of δ")
    ax.axvline(x0,color=TEXTDIM,lw=1,ls=":")
    ax.axhline(0,color=TEXTDIM,lw=0.7)

    ax.set_xlabel("x",color=TEXTSUB,fontsize=10)
    ax.set_ylabel("Value",color=TEXTSUB,fontsize=10)
    ax.set_ylim(-1.5,4.5); ax.set_xlim(-3,3)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.text(-2.9,4.2,
        r"$\int\delta(x)f(x)\,dx = f(0)$"+"\n"
        r"$\delta(x)$ is NOT a function (no pointwise value)"+"\n"
        r"It IS a continuous linear functional on $\Phi$",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC4,alpha=0.9))
    _save(fig, f"{d}/l12_distributional_delta.png")


def l12_spectral_measure(d):
    fig = _fig(10,5.5); ax = _ax(fig,[0.09,0.10,0.83,0.82])
    ax.set_title(r"Spectral Measure (PVM): $\hat{A} = \int a\, d\hat{E}(a)$"
                 " — Continuous Analogue of Spectral Decomposition",
                 color=TEXT,fontsize=12,pad=8)

    a = np.linspace(-3,3,500)
    # Spectral measure: dP/da = probability density
    psi_coeff = np.exp(-a**2/2)/np.pi**0.25
    dP_da = np.abs(psi_coeff)**2

    ax.fill_between(a,0,dP_da,color=ACC1,alpha=0.3)
    ax.plot(a,dP_da,color=ACC1,lw=2.5,label=r"$\frac{dP}{da} = |\langle a|\psi\rangle|^2$")

    # Highlight a region
    a_lo, a_hi = 0.5, 1.5
    mask = (a>=a_lo)&(a<=a_hi)
    ax.fill_between(a[mask],0,dP_da[mask],color=ACC3,alpha=0.6)
    prob_region = np.trapezoid(dP_da[mask],a[mask])
    ax.text((a_lo+a_hi)/2,dP_da[mask].max()/2,
            f"P([{a_lo},{a_hi}])\n={prob_region:.3f}",
            color="black",fontsize=9,ha="center",fontweight="bold")
    ax.annotate("",xy=(a_lo,0.05),xytext=(a_hi,0.05),
        arrowprops=dict(arrowstyle="<->",color=ACC3,lw=2))

    ax.set_xlabel("Eigenvalue a",color=TEXTSUB,fontsize=10)
    ax.set_ylabel(r"Spectral density $dP/da$",color=TEXTSUB,fontsize=10)
    ax.legend(loc="upper right",fontsize=9,labelcolor=TEXT,
              facecolor=BGCARD,edgecolor=TEXTDIM)
    ax.grid(True,color=TEXTDIM,alpha=0.2,lw=0.5)
    ax.axhline(0,color=TEXTDIM,lw=0.7)
    ax.text(-2.9,0.36,
        r"$\hat{E}(\Delta) = \int_\Delta|a\rangle\langle a|\,da$ (projection-valued measure)"+"\n"
        r"$P(\Delta) = \langle\psi|\hat{E}(\Delta)|\psi\rangle = \int_\Delta|\psi(a)|^2 da$",
        color=TEXT,fontsize=10,va="top",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l12_spectral_measure.png")


def l12_deficiency_indices(d):
    fig = _fig(10,5.5)
    ax = figure_axes = fig.add_axes([0.04,0.04,0.92,0.90], facecolor=BG)
    ax.axis("off"); ax.set_xlim(0,10); ax.set_ylim(0,6.5)
    ax.set_title(r"Deficiency Indices $(n_+,n_-)$ — Counting Self-Adjoint Extensions",
                 color=TEXT,fontsize=12)

    cases = [
        ((1,1),"$\\hat{p}$ on $L^2([0,1])$\nwith $C^\\infty_c(0,1)$ domain",
         r"$U(1)$ family of extensions","$\\psi(1)=e^{i\\theta}\\psi(0)$",
         "Different spectra!",ACC3),
        ((0,0),"$\\hat{p}$ on $L^2(\\mathbb{R})$\nwith Schwartz domain",
         "Unique self-adjoint\nextension","Already self-adjoint",
         "Unique spectrum",ACC2),
        ((2,2),"$\\hat{H}$ with defect\nspace dimension 2",
         "Larger family of\nextensions","Parameterised by $U(2)$",
         "Multiple spectra",ACC4)[:-1] + ("Multiple spectra",ACC4),
    ]

    for i,((np_,nm),name,ext,param,spec,col) in enumerate(
        [((1,1),"$\\hat{p}$ on $L^2([0,1])$",
          r"Circle $U(1)$","$\\psi(1)=e^{i\\theta}\\psi(0)$","1-param. family of spectra",ACC3),
         ((0,0),"$\\hat{p}$ on $L^2(\\mathbb{R})$",
          "Unique","Already SA","Single spectrum",ACC2),
         ((2,2),"$\\hat{H}$ with 2D defect",
          r"$U(2)$ family","4 real parameters","Many spectra",ACC4)]):

        x0 = 0.4 + i*3.2
        ax.add_patch(FancyBboxPatch((x0,0.8),2.8,5.0,
            boxstyle="round,pad=0.1",facecolor=BGCARD,edgecolor=col,lw=2))
        ax.text(x0+1.4,5.5,f"$(n_+,n_-)=({np_},{nm})$",color=col,fontsize=11,
                ha="center",fontweight="bold")
        ax.text(x0+1.4,4.6,name,color=TEXT,fontsize=9,ha="center")
        ax.text(x0+1.4,3.6,"Extensions:",color=TEXTSUB,fontsize=9,ha="center")
        ax.text(x0+1.4,3.0,ext,color=col,fontsize=10,ha="center",fontweight="bold")
        ax.text(x0+1.4,2.2,param,color=TEXT,fontsize=9,ha="center")
        ax.text(x0+1.4,1.4,spec,color=TEXTSUB,fontsize=9,ha="center",style="italic")

    ax.text(5.0,0.2,
        r"Self-adjoint extension exists $\Leftrightarrow$ $(n_+,n_-)=(n,n)$ for some $n\geq 0$"+"\n"
        r"Unique SA extension $\Leftrightarrow$ $(n_+,n_-)=(0,0)$ (operator already self-adjoint)",
        color=TEXT,fontsize=10,ha="center",
        bbox=dict(boxstyle="round,pad=0.4",facecolor=BGCARD,edgecolor=ACC1,alpha=0.9))
    _save(fig, f"{d}/l12_deficiency_indices.png")


# ═══════════════════════════════════════════════════════════════════════════════
# REGISTRY
# ═══════════════════════════════════════════════════════════════════════════════

ALL_DIAGRAMS = {
    # L02
    "l02_bra_dot_product":      l02_bra_dot_product,
    "l02_gram_schmidt":         l02_gram_schmidt,
    "l02_riesz_representation": l02_riesz_representation,
    "l02_dual_space_functionals": l02_dual_space_functionals,
    # L03
    "l03_matrix_operator_2d":   l03_matrix_operator_2d,
    "l03_hermitian_symmetry":   l03_hermitian_symmetry,
    "l03_unitary_rotation":     l03_unitary_rotation,
    "l03_eigenvalue_geometry":  l03_eigenvalue_geometry,
    # L04
    "l04_stern_gerlach_filter": l04_stern_gerlach_filter,
    "l04_projector_geometry":   l04_projector_geometry,
    "l04_spectral_decomp":      l04_spectral_decomposition,
    "l04_resolution_identity":  l04_resolution_identity,
    # L05
    "l05_basis_rotation_2d":    l05_basis_rotation_2d,
    "l05_matrix_representation":l05_matrix_representation,
    "l05_trace_invariant":      l05_trace_invariant,
    "l05_similarity_transform": l05_similarity_transform,
    # L06
    "l06_continuum_limit":      l06_continuum_limit,
    "l06_delta_function":       l06_delta_function,
    "l06_position_momentum":    l06_position_momentum_plane,
    "l06_fourier_duality":      l06_fourier_duality,
    # L07
    "l07_uncertainty_spread":   l07_uncertainty_spread,
    "l07_commutator_geometry":  l07_commutator_geometry,
    "l07_robertson_diagram":    l07_robertson_diagram,
    "l07_compatible_observables":l07_compatible_observables,
    # L08
    "l08_unitary_flow":         l08_unitary_flow,
    "l08_heisenberg_schrodinger":l08_heisenberg_schrodinger,
    "l08_ehrenfest":            l08_ehrenfest,
    "l08_exponential_steps":    l08_exponential_steps,
    # L09
    "l09_product_space_grid":   l09_product_space_grid,
    "l09_entangled_vs_product": l09_entangled_vs_product,
    "l09_schmidt_decomp":       l09_schmidt_decomp,
    "l09_partial_trace":        l09_partial_trace,
    # L10
    "l10_bloch_sphere_spin":    l10_bloch_sphere_spin,
    "l10_pauli_matrices":       l10_pauli_matrices,
    "l10_su2_rotation":         l10_su2_rotation,
    "l10_angular_momentum_ladder": l10_angular_momentum_ladder,
    # L11
    "l11_density_bloch":        l11_density_bloch,
    "l11_pure_vs_mixed":        l11_pure_vs_mixed,
    "l11_kraus_channel":        l11_kraus_channel,
    "l11_decoherence":          l11_decoherence,
    # L12
    "l12_gelfand_triple":       l12_gelfand_triple,
    "l12_distributional_delta": l12_distributional_delta,
    "l12_spectral_measure":     l12_spectral_measure,
    "l12_deficiency_indices":   l12_deficiency_indices,
}


def generate_for_lecture(lecture_num, out_dir):
    """Generate all diagrams for one lecture. Returns {name: path}."""
    import time
    prefix = lecture_num.lower() + "_"
    matching = {k: v for k, v in ALL_DIAGRAMS.items() if k.startswith(prefix)}
    os.makedirs(out_dir, exist_ok=True)
    paths = {}
    for name, fn in matching.items():
        t0 = time.time()
        fn(out_dir)
        p = f"{out_dir}/{name}.png"
        sz = os.path.getsize(p) // 1024
        print(f"    {name:<35} {sz:4d}KB  ({time.time()-t0:.1f}s)")
        paths[name] = p
    return paths


def generate_all(out_base_dir):
    """Generate all diagrams for all lectures, into per-lecture subdirs."""
    import time
    all_paths = {}
    for lec in ["L02","L03","L04","L05","L06","L07","L08","L09","L10","L11","L12"]:
        out_dir = f"{out_base_dir}/{lec}/diagrams"
        print(f"  {lec}:")
        t0 = time.time()
        paths = generate_for_lecture(lec, out_dir)
        all_paths.update(paths)
        print(f"    → {len(paths)} diagrams in {time.time()-t0:.1f}s")
    return all_paths


if __name__ == "__main__":
    import sys
    out = sys.argv[1] if len(sys.argv) > 1 else "build"
    print(f"Generating {len(ALL_DIAGRAMS)} diagrams for L02-L12...")
    generate_all(out)
    print("Done.")
