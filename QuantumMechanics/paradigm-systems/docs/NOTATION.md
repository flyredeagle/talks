# Notation Conventions — QM Programme

All materials in Module I.4 use the following notation conventions consistently.
These match the programme standard established in Module I.1.

## Operators

| Notation | Meaning |
|----------|---------|
| `\hat{A}`, `\hat{H}`, `\hat{U}` | General operators (hat notation) |
| `\hat{p}`, `\hat{x}` | Momentum and position operators |
| `\hat{H}` | Hamiltonian |
| `\hat{U}(t)` | Time evolution operator |
| `\hat{\rho}` | Density operator / density matrix |
| `\hat{\mathbb{1}}` | Identity operator |
| `\hat{L}`, `\hat{S}`, `\hat{J}` | Orbital, spin, total angular momentum |
| `\hat{a}`, `\hat{a}^\dagger` | Ladder (annihilation/creation) operators |
| `\hat{\sigma}_x`, `\hat{\sigma}_y`, `\hat{\sigma}_z` | Pauli matrices |

## States

| Notation | Meaning |
|----------|---------|
| `\ket{\psi}`, `\bra{\phi}` | Dirac ket / bra |
| `\braket{\phi}{\psi}` | Inner product ⟨φ\|ψ⟩ |
| `\ket{n}`, `\ket{nlm}` | Energy eigenkets |
| `\ket{\alpha}` | Coherent state with eigenvalue α |
| `\ket{\uparrow}`, `\ket{\downarrow}` | Spin-up / spin-down |

## Operations

| Notation | Meaning |
|----------|---------|
| `[\hat{A},\hat{B}] = \hat{A}\hat{B} - \hat{B}\hat{A}` | Commutator |
| `\{\hat{A},\hat{B}\} = \hat{A}\hat{B} + \hat{B}\hat{A}` | Anti-commutator |
| `\operatorname{Tr}(\hat{A})` | Trace |
| `\operatorname{Tr}_B(\hat{\rho}_{AB})` | Partial trace over subsystem B |
| `\hat{A}^\dagger` | Adjoint (Hermitian conjugate) |

## Physical constants

| Symbol | Meaning |
|--------|---------|
| `\hbar` | Reduced Planck constant |
| `m_e` | Electron mass |
| `a_0` | Bohr radius |
| `\mu_B` | Bohr magneton |
| `\alpha` | Fine-structure constant |
| `E_1 = -13.6\,\text{eV}` | Hydrogen ground-state energy |

## Module-specific symbols (I.4)

| Symbol | First appears | Meaning |
|--------|--------------|---------|
| `E_k = \hbar^2k^2/2m` | L01 | Free-particle dispersion |
| `g(E)` | L01 | Density of states |
| `u_{nk}(x)` | L02 | Bloch periodic factor |
| `\hat{a}, \hat{a}^\dagger` | L03 | HO ladder operators |
| `\Omega_R` | L04 | Rabi frequency |
| `\omega_c = eB/m` | L05 | Cyclotron frequency |
| `l_B = \sqrt{\hbar/eB}` | L05 | Magnetic length |
| `\mu_B` | L06 | Bohr magneton |
| `g_J` | L06 | Landé g-factor |
| `\alpha_{\rm pol}` | L07 | Electric polarisability |
| `E_{nj}^{\rm FS}` | L08 | Fine-structure energy |
| `\hat{\mathbf{A}}` | L09 | Runge–Lenz vector |
| `T, R` | L10 | Transmission/reflection coefficients |
| `a_s` | L11 | Scattering length |
| `G` | L12 | Gamow tunnelling exponent |

## LaTeX macros available in preamble.tex

```latex
\tiertag{tier1col}{Tier 1}   % violet tier badge
\tiertag{tier2col}{Tier 2}   % green tier badge
\tiertag{tier3col}{Tier 3}   % blue tier badge
\tiertag{tier4col}{Tier 4}   % orange tier badge
\tiertag{tier5col}{Tier 5}   % red tier badge

\instructornote{text}         % shaded instructor note box
```

## tcolorbox styles in preamble.tex

| Style | Colour | Use for |
|-------|--------|---------|
| `lecturebox` | Blue | Main lecture content boxes |
| `goldbox` | Gold | Key results and examples |
| `notebox` | Gray | Instructor notes |
| `ugconceptbox` | Light blue | SCQU, CCQU artifacts |
| `ugprobbox` | Light green | SPSU, CPSU, SPJU, CPJU artifacts |
| `gradconceptbox` | Light red | SCQG, CCQG artifacts |
| `gradprobbox` | Light orange | SPSG, CPSG, SPJG, CPJG artifacts |
| `researchbox` | Light purple | WRQ, ORQ artifacts |
| `rubricbox` | Light gray | Rubric tables |
