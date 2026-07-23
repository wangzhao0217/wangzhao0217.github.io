# Computation of the crack opening displacement in the phase-field model

## 1. Overview
- **DOI**: 10.1016/j.ijsolstr.2023.112496
- **arXiv**: 
- **Source Code**: 
- **Extracted Figures**: 9

## 2. Core Abstract & Text Snippet
International Journal of Solids and Structures 283 (2023) 112496
Available online 28 September 2023
0020-7683/© 2023 The Author(s). Published by Elsevier Ltd. This is an open access article under the CC BY license (http://creativecommons.org/licenses/by/4.0/).
Contents lists available at ScienceDirect
International Journal of Solids and Structures
journal homepage: www.elsevier.com/locate/ijsolstr
Computation of the crack opening displacement in the phase-field model
Lin Chen a, Zhao Wang c, Bin Li b, René de Borst c,∗
a Northeastern University, Key Laboratory of Ministry of Education on Safe Mining of Deep Metal Mines, Shenyang 110819, China
b Guangdong Technion-Israel Institute of Technology, Department of Mechanical Engineering, Shantou 515063, China
c University of Sheffield, Department of Civil and Structural Engineering, Sir Frederick Mappin Building, Mappin Street, Sheffield S1 3JD, UK
A R T I C L E
I N F O
Keywords:
Crack opening
Phase field model
Brittle fracture
Cohesive fracture
Smeared crack
A B S T R A C T
The phase-field model treats discrete cracks in a smeared sense by a regularisation technique. It holds attractive
properties: there is no need to consider cracks as geometric discontinuities, and it avoids remeshing around
crack tips. The method has been employed in the analysis of brittle and cohesive fracture problems. In
the brittle fracture model, a Griffith-like energy functional is used in the simulation, while in the cohesive
fracture model, the fractur

## 3. Key Figures & Captions

- **Figure. 1**: (a) a solid body 𝛀with an internal crack 𝛤𝑐. 𝛤𝑐is an interface boundary with positive and negative sides, 𝛤+ 𝑐 and 𝛤− 𝑐, respectively. Tractions 𝒑are prescribed along 𝛤𝑐. Boundary 𝛤𝑢is prescribed with a displacement̄ 𝐮; 𝛤𝑡with a prescribed traction̂ 𝐭; (b) a solid body 𝛀with a smeared crack 𝛤𝜉(blue area). cohesive phase field model and proposed different forms of phase- field models. From their analysis, it appears that the auxiliary field should be prescribed in the whole domain, reducing the computational efficiency. Nguyen et al. (2016) avoided an auxiliary field by computing the displacement jump at two points near the interface. However, the choice of the location of these points seems arbitrary and problem- dependent. Lee et al. (2017) and Yoshioka et al. (2020) employed a level-set approach to compute the normal vector of the crack, which is

- **Figure. 2**: One-dimensional analytical phase field 𝑑(𝐱), crack density function 𝛾𝑐, and Dirac-delta function 𝛿𝑐for a uniaxial bar (length 1) with a crack 𝛤𝑐in the middle. The regularisation length is 𝓁= 0.1. in which the fraction 1 2 stems from the constraint on the Dirac-delta function, ∫∞ −∞𝛿𝑐 (𝑥𝑛 ) d𝑥𝑛= 1. In Fig. 2 we plot the phase field 𝑑(𝑥𝑛 ), the crack density function 𝛾𝑑(𝑑) and the Dirac-delta function 𝛿𝑐 (𝑥𝑛 ). In the figure the distribution

- **Figure. 3**: (a) uniaxial compression of a bar with a crack 𝛤𝑐; (b) smeared crack 𝛤𝜉(blue area). Here a constant pressure 𝑝is applied in the crack 𝛤𝑐, exerted on positive and negative sides, 𝛤+ 𝑐 and 𝛤− 𝑐, respectively. Employing the phase-field model in Eq. (14), we obtain the follow- ing form of the Heaviside function ℋ ℋ(𝒙) = 1 2 ⎧ ⎪ ⎨ ⎪⎩

- **Figure. 4**: Displacement 𝑢1 and stress 𝜎1 for the uniaxial bar in Fig. 3(a). The length of the bar is 𝐿= 1 and the regularisation length is 𝓁= 0.1. which yields the stress 𝜎1 (𝑥1, 𝑥2 ): 𝜎1 (𝑥1, 𝑥2 ) = ⎧ ⎪ ⎪ ⎨ ⎪ ⎪⎩

- **Figure. 5**: (a) 2D inclined line crack (𝑥𝑠= −𝑎to 𝑥𝑠= 𝑎) with 𝑎the half length under a constant pressure 𝑝. The crack is represented by the red line. The inclination angle of the crack is 𝜃. (𝑥1, 𝑥2 ) is the global coordinate with the origin 𝑂, while (𝑥𝑠, 𝑥𝑡 ) is the local coordinate along the crack; (b) normalised crack opening displacement for different values of the inclination angle 𝜃. The normalised crack opening displacement is defined as CODnor = COD∕CODm ana, where CODm ana is the exact solution of the maximum crack opening displacement (Eq. (49)), being at the origin 𝑂𝑙in the current study. For brevity, we only present the results of Verhoosel and de Borst’s approach for 𝜃= 0◦. Fig. 4 presents the comparison between phase-field solutions and the analytical solution. For the cohesive fracture model, the displace- ment shows some discrepancies in the range of the smeared crack 𝛤𝜉(as illustrated in Fig. 3(b)), due to the regularised interface. The displacement is continuous along the bar due to the continuous Dirac-
