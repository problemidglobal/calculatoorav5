export interface ScientificConstant {
  symbol: string;
  name: string;
  value: number;
  unit: string;
  category: string;
  description: string;
}

export const SCIENTIFIC_CONSTANTS: ScientificConstant[] = [
  // --- UNIVERSAL ---
  { symbol: "c", name: "Speed of Light in Vacuum", value: 299792458, unit: "m/s", category: "Universal", description: "The maximum speed at which all conventional matter and information can travel in the universe." },
  { symbol: "G", name: "Newtonian Constant of Gravitation", value: 6.6743e-11, unit: "m³/(kg·s²)", category: "Universal", description: "An empirical physical constant involved in the calculation of gravitational effects." },
  { symbol: "h", name: "Planck Constant", value: 6.62607015e-34, unit: "J·s", category: "Universal", description: "The quantum of electromagnetic action that relates a photon's energy to its frequency." },
  { symbol: "ħ", name: "Reduced Planck Constant", value: 1.054571817e-34, unit: "J·s", category: "Universal", description: "The Dirac constant, equal to h / (2π)." },
  { symbol: "φ", name: "Golden Ratio", value: 1.6180339887, unit: "dimensionless", category: "Universal", description: "A mathematical constant ratio found throughout nature, art, and geometry." },
  { symbol: "π", name: "Pi", value: 3.1415926535, unit: "dimensionless", category: "Universal", description: "The ratio of a circle's circumference to its diameter." },
  { symbol: "e", name: "Euler's Number", value: 2.7182818284, unit: "dimensionless", category: "Universal", description: "The base of natural logarithms." },
  { symbol: "Z_0", name: "Characteristic Impedance of Vacuum", value: 376.730313668, unit: "Ω", category: "Universal", description: "The ratio of the magnitudes of the electric and magnetic fields in a vacuum." },
  
  // --- ELECTROMAGNETIC ---
  { symbol: "e_charge", name: "Elementary Charge", value: 1.602176634e-19, unit: "C", category: "Electromagnetic", description: "The electric charge carried by a single proton or electron (positive and negative respectively)." },
  { symbol: "ε_0", name: "Vacuum Electric Permittivity", value: 8.8541878128e-12, unit: "F/m", category: "Electromagnetic", description: "The capability of a vacuum to permit electric field lines." },
  { symbol: "μ_0", name: "Vacuum Magnetic Permeability", value: 1.25663706212e-6, unit: "N/A²", category: "Electromagnetic", description: "The measure of the resistance of vacuum against the formation of magnetic fields." },
  { symbol: "G_0", name: "Conductance Quantum", value: 7.748091729e-5, unit: "S", category: "Electromagnetic", description: "The quantized unit of electrical conductance." },
  { symbol: "K_J", name: "Josephson Constant", value: 483597.8484e9, unit: "Hz/V", category: "Electromagnetic", description: "The constant relating electric potential differences to frequency in a Josephson junction." },
  { symbol: "R_K", name: "von Klitzing Constant", value: 25812.80745, unit: "Ω", category: "Electromagnetic", description: "The quantum of electrical resistance." },
  { symbol: "μ_B", name: "Bohr Magneton", value: 9.274010078e-24, unit: "J/T", category: "Electromagnetic", description: "A physical constant and natural unit for expressing the magnetic moment of an electron." },
  { symbol: "μ_N", name: "Nuclear Magneton", value: 5.050783746e-27, unit: "J/T", category: "Electromagnetic", description: "A physical constant of magnetic moment used for nucleons and atomic nuclei." },
  
  // --- ATOMIC & NUCLEAR ---
  { symbol: "m_e", name: "Electron Mass", value: 9.1093837015e-31, unit: "kg", category: "Atomic & Nuclear", description: "The rest mass of a free electron." },
  { symbol: "m_p", name: "Proton Mass", value: 1.67262192369e-27, unit: "kg", category: "Atomic & Nuclear", description: "The rest mass of a free proton." },
  { symbol: "m_n", name: "Neutron Mass", value: 1.67492749804e-27, unit: "kg", category: "Atomic & Nuclear", description: "The rest mass of a free neutron." },
  { symbol: "α", name: "Fine-Structure Constant", value: 0.0072973525693, unit: "dimensionless", category: "Atomic & Nuclear", description: "The coupling constant measuring the strength of the electromagnetic interaction." },
  { symbol: "R_inf", name: "Rydberg Constant", value: 10973731.56816, unit: "1/m", category: "Atomic & Nuclear", description: "The limiting value of the highest wavenumber of any photon that can be emitted from the hydrogen atom." },
  { symbol: "a_0", name: "Bohr Radius", value: 5.29177210903e-11, unit: "m", category: "Atomic & Nuclear", description: "The most probable distance between the proton and electron in a hydrogen atom in its ground state." },
  { symbol: "E_h", name: "Hartree Energy", value: 4.3597447222071e-18, unit: "J", category: "Atomic & Nuclear", description: "The atomic unit of energy." },
  { symbol: "λ_c", name: "Compton Wavelength of Electron", value: 2.42631023867e-12, unit: "m", category: "Atomic & Nuclear", description: "The quantum wavelength of an electron." },
  { symbol: "r_e", name: "Classical Electron Radius", value: 2.8179403262e-15, unit: "m", category: "Atomic & Nuclear", description: "An electrostatic radius of the electron." },
  { symbol: "σ_e", name: "Thomson Cross Section", value: 6.6524587321e-29, unit: "m²", category: "Atomic & Nuclear", description: "The cross-sectional scattering area of free electrons for light." },

  // --- PHYSICOCHEMICAL ---
  { symbol: "N_A", name: "Avogadro Constant", value: 6.02214076e23, unit: "1/mol", category: "Physicochemical", description: "The number of constituent particles (usually atoms or molecules) in one mole of a substance." },
  { symbol: "k_B", name: "Boltzmann Constant", value: 1.380649e-23, unit: "J/K", category: "Physicochemical", description: "The constant relating the average relative kinetic energy of particles in a gas with the thermodynamic temperature." },
  { symbol: "R_gas", name: "Molar Gas Constant", value: 8.314462618, unit: "J/(mol·K)", category: "Physicochemical", description: "The constant of proportionality in the ideal gas law." },
  { symbol: "F", name: "Faraday Constant", value: 96485.33212, unit: "C/mol", category: "Physicochemical", description: "The magnitude of electric charge per mole of electrons." },
  { symbol: "V_m", name: "Molar Volume of Ideal Gas (STP)", value: 0.0224139695, unit: "m³/mol", category: "Physicochemical", description: "The volume occupied by one mole of ideal gas at standard temperature and pressure." },
  { symbol: "n_0", name: "Loschmidt Constant (STP)", value: 2.6867811e25, unit: "1/m³", category: "Physicochemical", description: "The number of particles of an ideal gas in a given volume at standard temperature and pressure." },
  { symbol: "σ", name: "Stefan-Boltzmann Constant", value: 5.670374419e-8, unit: "W/(m²·K⁴)", category: "Physicochemical", description: "The constant of proportionality in the Stefan-Boltzmann law for black-body thermal radiation." },
  { symbol: "C_1", name: "First Radiation Constant", value: 3.741771852e-16, unit: "W·m²", category: "Physicochemical", description: "The constant in Planck's law of radiation representing 2π h c²." },
  { symbol: "C_2", name: "Second Radiation Constant", value: 0.01438776877, unit: "m·K", category: "Physicochemical", description: "The constant in Planck's law of radiation representing h c / k_B." },
  { symbol: "b", name: "Wien Displacement Law Constant", value: 0.002897771955, unit: "m·K", category: "Physicochemical", description: "The peak wavelength-temperature constant of blackbody radiation." },

  // --- ASTRONOMICAL & EARTH ---
  { symbol: "g_earth", name: "Standard Acceleration of Gravity", value: 9.80665, unit: "m/s²", category: "Earth & Astronomy", description: "The nominal acceleration of gravity on Earth's surface at sea level." },
  { symbol: "M_earth", name: "Earth Mass", value: 5.9722e24, unit: "kg", category: "Earth & Astronomy", description: "The mass of planet Earth." },
  { symbol: "R_earth", name: "Mean Earth Radius", value: 6371000, unit: "m", category: "Earth & Astronomy", description: "The average radius of planet Earth." },
  { symbol: "M_sun", name: "Solar Mass", value: 1.98847e30, unit: "kg", category: "Earth & Astronomy", description: "The standard unit of mass in astronomy, equal to the mass of the Sun." },
  { symbol: "R_sun", name: "Solar Radius", value: 695700000, unit: "m", category: "Earth & Astronomy", description: "The nominal radius of the Sun." },
  { symbol: "L_sun", name: "Solar Luminosity", value: 3.828e26, unit: "W", category: "Earth & Astronomy", description: "The nominal electromagnetic power output of the Sun." },
  { symbol: "M_jupiter", name: "Jupiter Mass", value: 1.89813e27, unit: "kg", category: "Earth & Astronomy", description: "The mass of the largest planet in our solar system, Jupiter." },
  { symbol: "M_moon", name: "Moon Mass", value: 7.34767309e22, unit: "kg", category: "Earth & Astronomy", description: "The mass of planet Earth's moon." },
  { symbol: "R_moon", name: "Mean Moon Radius", value: 1737100, unit: "m", category: "Earth & Astronomy", description: "The average radius of Earth's moon." },
  { symbol: "au", name: "Astronomical Unit", value: 149597870700, unit: "m", category: "Earth & Astronomy", description: "The rough average distance from the Earth to the Sun." },
  { symbol: "ly", name: "Light Year", value: 9.4607304725808e15, unit: "m", category: "Earth & Astronomy", description: "The distance light travels in one Julian year in vacuum." },
  { symbol: "pc", name: "Parsec", value: 3.08567758149137e16, unit: "m", category: "Earth & Astronomy", description: "An astronomical distance unit representing approximately 3.26 light-years." },
  { symbol: "H_0", name: "Hubble Constant", value: 2.2685e-18, unit: "1/s", category: "Earth & Astronomy", description: "The unit of measurement used to describe the expansion of the universe (equivalent to ~70 km/s/Mpc)." },

  // --- MATHEMATICAL ACCENTS & RARE ---
  { symbol: "e_Euler", name: "Euler-Mascheroni Constant (γ)", value: 0.5772156649, unit: "dimensionless", category: "Mathematical", description: "The limiting difference between the harmonic series and the natural logarithm." },
  { symbol: "K_catalan", name: "Catalan's Constant", value: 0.9159655941, unit: "dimensionless", category: "Mathematical", description: "A constant appearing in combiniatorics and integrals." },
  { symbol: "G_apery", name: "Apéry's Constant", value: 1.2020569031, unit: "dimensionless", category: "Mathematical", description: "The value of the Riemann zeta function at 3, ζ(3)." },
  { symbol: "δ_Feigen", name: "Feigenbaum Constant Delta (δ)", value: 4.6692016091, unit: "dimensionless", category: "Mathematical", description: "The limiting ratio of consecutive bifurcation intervals in chaos theory." },
  { symbol: "α_Feigen", name: "Feigenbaum Constant Alpha (α)", value: 2.502907875, unit: "dimensionless", category: "Mathematical", description: "The scaling factor between successive branches of the attractor in chaos theory." },
  { symbol: "G_gauss", name: "Gauss's Constant", value: 0.8346268416, unit: "dimensionless", category: "Mathematical", description: "The reciprocal of the arithmetic-geometric mean of 1 and sqrt(2)." },
  { symbol: "C_chaitin", name: "Chaitin's Omega Constant (Ω)", value: 0.00787499699, unit: "dimensionless", category: "Mathematical", description: "A halting probability value representing absolute algorithmic randomness." },
  { symbol: "ρ_plastic", name: "Plastic Ratio", value: 1.3247179572, unit: "dimensionless", category: "Mathematical", description: "The unique real solution to x³ - x - 1 = 0." },
  { symbol: "θ_tribonacci", name: "Tribonacci Constant", value: 1.8392867552, unit: "dimensionless", category: "Mathematical", description: "The ratio of consecutive terms in the Tribonacci sequence." },
  { symbol: "B_brun", name: "Brun's Constant for Twin Primes", value: 1.9021605831, unit: "dimensionless", category: "Mathematical", description: "The sum of the reciprocals of all twin primes." },

  // --- ADDITIONAL EXTENSION PHYSICS ---
  { symbol: "λ_max", name: "Wien Peak Wavelength for 300K", value: 9.659e-6, unit: "m", category: "Atomic & Nuclear", description: "Peak wavelength of thermal radiation from an object at standard room temperature (~27°C)." },
  { symbol: "E_photon_eV", name: "Energy of 500nm Photon", value: 2.4796, unit: "eV", category: "Atomic & Nuclear", description: "Energy of a typical green light photon." },
  { symbol: "a_p", name: "Planck Acceleration", value: 5.5608e51, unit: "m/s²", category: "Universal", description: "The natural unit of acceleration derived from Planck scale quantities." },
  { symbol: "E_p", name: "Planck Energy", value: 1.9561e9, unit: "J", category: "Universal", description: "The unit of energy in the system of Planck units." },
  { symbol: "F_p", name: "Planck Force", value: 1.2103e44, unit: "N", category: "Universal", description: "The gravitational force of attraction between two Planck masses placed one Planck distance apart." },
  { symbol: "l_p", name: "Planck Length", value: 1.6162e-35, unit: "m", category: "Universal", description: "The base physical scale of spacetime fabric." },
  { symbol: "m_p_planck", name: "Planck Mass", value: 2.1764e-8, unit: "kg", category: "Universal", description: "The mass value in quantum Planck units." },
  { symbol: "t_p", name: "Planck Time", value: 5.3912e-44, unit: "s", category: "Universal", description: "The time required for light to travel a distance of one Planck length in vacuum." },
  { symbol: "T_p", name: "Planck Temperature", value: 1.4168e32, unit: "K", category: "Universal", description: "The quantum limit of physical heat and absolute thermal energy." },
  { symbol: "q_p", name: "Planck Charge", value: 1.8755e-18, unit: "C", category: "Universal", description: "The electric charge scale in quantum gravity systems." },

  // --- MATERIAL & SOLID STATE ---
  { symbol: "ρ_copper", name: "Electrical Resistivity of Copper", value: 1.68e-8, unit: "Ω·m", category: "Electromagnetic", description: "Typical resistance of pure copper wire at room temperature." },
  { symbol: "v_sound_air", name: "Speed of Sound in Dry Air (20°C)", value: 343, unit: "m/s", category: "Earth & Astronomy", description: "The nominal speed of acoustic compression wave propagation." },
  { symbol: "ρ_air", name: "Density of Dry Air (STP)", value: 1.204, unit: "kg/m³", category: "Earth & Astronomy", description: "Nominal density of atmospheric air at sea level." },
  { symbol: "P_std", name: "Standard Atmospheric Pressure", value: 101325, unit: "Pa", category: "Earth & Astronomy", description: "The baseline ambient pressure defining normal sea-level conditions." },
  { symbol: "n_water", name: "Refractive Index of Pure Water (20°C)", value: 1.333, unit: "dimensionless", category: "Universal", description: "The ratio of speed of light in vacuum to its speed in pure liquid water." },
  { symbol: "C_water", name: "Specific Heat Capacity of Liquid Water", value: 4184, unit: "J/(kg·K)", description: "The thermal energy required to raise the temperature of 1kg of liquid water by 1°C.", category: "Physicochemical" },
  { symbol: "L_water_fusion", name: "Latent Heat of Fusion of Water", value: 3.34e5, unit: "J/kg", category: "Physicochemical", description: "Heat required to convert 1kg of ice into liquid water without temperature change." },
  { symbol: "L_water_vap", name: "Latent Heat of Vaporization of Water", value: 2.26e6, unit: "J/kg", category: "Physicochemical", description: "Heat required to convert 1kg of boiling liquid water to steam." },
  { symbol: "g_moon", name: "Acceleration of Gravity on Moon", value: 1.62, unit: "m/s²", category: "Earth & Astronomy", description: "Lunar gravity pulling material towards the Moon's core." },
  { symbol: "g_mars", name: "Acceleration of Gravity on Mars", value: 3.71, unit: "m/s²", category: "Earth & Astronomy", description: "Martian surface gravitational pull." },
  { symbol: "g_jupiter", name: "Acceleration of Gravity on Jupiter", value: 24.79, unit: "m/s²", category: "Earth & Astronomy", description: "Gigantic gas-giant gravity scale at its outer cloud layers." },
  { symbol: "M_mars", name: "Mars Mass", value: 6.39e23, unit: "kg", category: "Earth & Astronomy", description: "Mass of the Red Planet." },
  { symbol: "R_mars", name: "Mean Mars Radius", value: 3389500, unit: "m", category: "Earth & Astronomy", description: "Average radial span of planet Mars." },
  { symbol: "P_gas_constant", name: "Molar Gas Constant in Liter-Atmospheres", value: 0.0820573, unit: "L·atm/(mol·K)", category: "Physicochemical", description: "Alternative unit standard for gas calculations in chemistry." },

  // --- MORE DETAILED QUANTUM & NUCLEAR PHYSICAL CONSTANTS ---
  { symbol: "μ_p", name: "Proton Magnetic Moment", value: 1.41060679736e-26, unit: "J/T", category: "Atomic & Nuclear", description: "The magnetic dipole moment of a proton." },
  { symbol: "μ_e", name: "Electron Magnetic Moment", value: -9.2847647043e-24, unit: "J/T", category: "Atomic & Nuclear", description: "The magnetic dipole moment of an electron." },
  { symbol: "g_e", name: "Electron g-factor", value: -2.00231930436256, unit: "dimensionless", category: "Atomic & Nuclear", description: "The anomalous gyromagnetic ratio of the electron." },
  { symbol: "g_p", name: "Proton g-factor", value: 5.5856946893, unit: "dimensionless", category: "Atomic & Nuclear", description: "The dimensionless g-factor of the proton." },
  { symbol: "γ_p", name: "Proton Gyromagnetic Ratio", value: 2.6752218744e8, unit: "rad/(s·T)", category: "Atomic & Nuclear", description: "Proton spin precession angular speed in magnetic flux fields." },
  { symbol: "d_atomic", name: "Standard Silicon Lattice Spacing", value: 5.431020511e-10, unit: "m", category: "Atomic & Nuclear", description: "Interatomic spacing inside highly structured silicon crystals." },
  { symbol: "m_u", name: "Unified Atomic Mass Unit (u)", value: 1.6605390666e-27, unit: "kg", category: "Atomic & Nuclear", description: "One twelfth of the mass of a carbon-12 atom in ground state." },
  { symbol: "E_u", name: "Unified Atomic Mass Energy Equivalent", value: 1.4924180857e-10, unit: "J", category: "Atomic & Nuclear", description: "Energy equivalent of one unified atomic mass unit." },
  { symbol: "E_u_MeV", name: "Unified Atomic Mass in MeV", value: 931.49410242, unit: "MeV", category: "Atomic & Nuclear", description: "Rest mass energy equivalent in mega-electron-volts." },
  { symbol: "m_e_MeV", name: "Electron Rest Mass in MeV", value: 0.51099895, unit: "MeV", category: "Atomic & Nuclear", description: "Electron rest mass expressed in energy units." },
  { symbol: "m_p_MeV", name: "Proton Rest Mass in MeV", value: 938.27208816, unit: "MeV", category: "Atomic & Nuclear", description: "Proton rest mass energy scale." },
  { symbol: "m_n_MeV", name: "Neutron Rest Mass in MeV", value: 939.56542052, unit: "MeV", category: "Atomic & Nuclear", description: "Neutron rest mass energy scale." },
  { symbol: "θ_weak", name: "Weinberg Angle (Weak Mixing Angle)", value: 0.2229, unit: "dimensionless", category: "Atomic & Nuclear", description: "Parameters in the electroweak unification standard model." },
  { symbol: "μ_tau", name: "Tau lepton Mass", value: 3.16754e-27, unit: "kg", category: "Atomic & Nuclear", description: "The mass of the massive tau lepton." },
  { symbol: "μ_muon", name: "Muon rest mass", value: 1.883531627e-28, unit: "kg", category: "Atomic & Nuclear", description: "Mass of the short-lived cosmic muon." },
  { symbol: "λ_c_proton", name: "Compton Wavelength of Proton", value: 1.321409855e-15, unit: "m", category: "Atomic & Nuclear", description: "Compton scattering scale of protons." },
  { symbol: "λ_c_neutron", name: "Compton Wavelength of Neutron", value: 1.319590906e-15, unit: "m", category: "Atomic & Nuclear", description: "Compton scattering scale of neutrons." },

  // --- ASTRONOMICAL EXPANSIONS ---
  { symbol: "T_sun", name: "Solar Core Temperature", value: 1.57e7, unit: "K", category: "Earth & Astronomy", description: "Calculated core temperature of the Sun sustaining fusion." },
  { symbol: "P_sun_core", name: "Solar Core Pressure", value: 2.65e16, unit: "Pa", category: "Earth & Astronomy", description: "Pressure sustained in the sun's central core region." },
  { symbol: "d_earth_sun", name: "Mean Distance of Earth to Sun", value: 1.496e11, unit: "m", category: "Earth & Astronomy", description: "Standard astronomical unit length." },
  { symbol: "d_earth_moon", name: "Mean Distance of Earth to Moon", value: 384400000, unit: "m", category: "Earth & Astronomy", description: "Average orbital distance to the moon." },
  { symbol: "v_earth_orbit", name: "Mean Orbital Velocity of Earth", value: 29780, unit: "m/s", category: "Earth & Astronomy", description: "Average speed of Earth revolving around the Sun." },
  { symbol: "ρ_jupiter", name: "Jupiter Mean Density", value: 1326, unit: "kg/m³", category: "Earth & Astronomy", description: "Overall bulk density of the solar system's gaseous giant." },
  { symbol: "age_universe", name: "Age of the Universe", value: 4.354e17, unit: "s", category: "Earth & Astronomy", description: "Approximate physical time since the Hot Big Bang (~13.8 Billion years)." },
  { symbol: "age_earth", name: "Age of the Earth", value: 1.43e17, unit: "s", category: "Earth & Astronomy", description: "Approximate planetary age (~4.54 Billion years)." },
  { symbol: "L_milkyway", name: "Milky Way Galaxy Diameter", value: 9.46e20, unit: "m", category: "Earth & Astronomy", description: "Approximate diameter of the stellar galactic disk (~100k Light Years)." },
  { symbol: "N_stars_milkyway", name: "Stars in the Milky Way", value: 2.5e11, unit: "dimensionless", category: "Earth & Astronomy", description: "Estimated stellar population inside our home galaxy." },
  { symbol: "P_interstellar", name: "Interstellar Medium Density", value: 1e-21, unit: "kg/m³", category: "Earth & Astronomy", description: "Typical mass density of gas and dust in the galaxy between star systems." }
];
