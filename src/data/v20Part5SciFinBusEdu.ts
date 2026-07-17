import { Calculator } from '../types';

export const V20_PART5_CALCULATORS: Calculator[] = [
  // ====================================== SCIENCE ======================================
  {
    id: 'projectile-motion',
    name: 'Projectile Motion Calculator',
    slug: 'projectile-motion',
    category: 'science',
    description: 'Calculate the flight path, maximum height, range, and duration of a projectile launched at an angle.',
    formula: 'Range = (v^2 * sin(2 * θ)) / g | Max Height = (v * sin(θ))^2 / (2 * g) | Time = (2 * v * sin(θ)) / g',
    explanation: 'Tracks two-dimensional kinematics under uniform gravity. Neglects air resistance to compute the standard parabolic trajectory.',
    example: 'Launching a baseball at 30 m/s at a 45-degree angle under standard Earth gravity (9.81 m/s²).',
    inputs: [
      { id: 'velocity', label: 'Initial Velocity (m/s)', type: 'number', defaultValue: 25, min: 0.1, step: 0.1 },
      { id: 'angle', label: 'Launch Angle (Degrees)', type: 'number', defaultValue: 45, min: 0, max: 90, step: 1 },
      { id: 'gravity', label: 'Gravitational Acceleration (m/s²)', type: 'number', defaultValue: 9.806, min: 0.1, step: 0.01 }
    ],
    faq: [
      { question: 'What angle yields the maximum horizontal range?', answer: 'Under ideal conditions on flat ground, a 45-degree angle provides the maximum possible horizontal range. For elevated launches, the ideal angle is slightly less than 45 degrees.' }
    ],
    relatedSlugs: ['kinetic-energy', 'force-calculator', 'wave-speed'],
    seoTitle: 'Theoretical Projectile Kinematics & Parabolic Trajectory Calculator',
    seoDescription: 'Solve two-dimensional projectile motion physics. Compute maximum peak height, total flight duration, and horizontal launch range.',
    calculate: (inputs) => {
      const v = Number(inputs.velocity || 25);
      const angleDeg = Number(inputs.angle || 45);
      const g = Number(inputs.gravity || 9.806);

      const rad = angleDeg * (Math.PI / 180);
      const sin = Math.sin(rad);
      const cos = Math.cos(rad);

      const maxHeight = (v * v * sin * sin) / (2 * g);
      const flightTime = (2 * v * sin) / g;
      const horizontalRange = (v * v * Math.sin(2 * rad)) / g;

      return {
        results: [
          { label: 'Horizontal Flight Range', value: `${horizontalRange.toFixed(2)} m`, isPrimary: true },
          { label: 'Maximum Peak Height', value: `${maxHeight.toFixed(2)} m`, isPrimary: true },
          { label: 'Total Flight Duration', value: `${flightTime.toFixed(2)} s` },
          { label: 'Terminal Landing Speed', value: `${v.toFixed(1)} m/s` }
        ]
      };
    }
  },
  {
    id: 'wave-speed',
    name: 'Wave Speed & Frequency Calculator',
    slug: 'wave-speed',
    category: 'science',
    description: 'Calculate electromagnetic or mechanical wave speeds, frequencies, and wavelength parameters.',
    formula: 'Wave Speed (v) = Frequency (f) * Wavelength (λ)',
    explanation: 'Solves parameters of wave propagation. Connects cycling rates (Hertz) and spatial spans (meters) with bulk propagation velocities.',
    example: 'A sound wave traveling in air at a frequency of 440 Hz (A4 note) has a wavelength of roughly 0.78 meters.',
    inputs: [
      { id: 'frequency', label: 'Wave Frequency (Hz)', type: 'number', defaultValue: 440, min: 0.1, step: 1 },
      { id: 'wavelength', label: 'Wavelength (Meters)', type: 'number', defaultValue: 0.78, min: 0.001, step: 0.01 }
    ],
    faq: [
      { question: 'Does wave speed change when entering different mediums?', answer: 'Yes! The physical properties of the medium (density, temperature, elasticity) command the wave speed. Frequency always remains constant, so wavelength must shrink or expand accordingly.' }
    ],
    relatedSlugs: ['projectile-motion', 'kinetic-energy', 'specific-heat'],
    seoTitle: 'Wave Speed, Frequency & Wavelength physics Calculator',
    seoDescription: 'Determine physical wave propagation speeds or compute acoustic wavelengths using frequency parameters.',
    calculate: (inputs) => {
      const f = Number(inputs.frequency || 440);
      const lambda = Number(inputs.wavelength || 0.78);

      const speed = f * lambda;

      return {
        results: [
          { label: 'Calculated Wave Speed', value: `${speed.toFixed(2)} m/s`, isPrimary: true },
          { label: 'Propagation Period (T)', value: `${(1 / f).toFixed(5)} seconds`, isPrimary: true },
          { label: 'Speed Relative to Sound in Air', value: `${(speed / 343).toFixed(2)} Mach` }
        ]
      };
    }
  },
  {
    id: 'specific-heat',
    name: 'Specific Heat Capacity Calculator',
    slug: 'specific-heat',
    category: 'science',
    description: 'Calculate heat transfers, mass, or specific heat capacity rates of materials.',
    formula: 'Heat Energy (Q) = Mass (m) * Specific Heat (c) * Temperature Delta (ΔT)',
    explanation: 'Analyzes thermochemical energy properties. Computes the thermal energy capacity needed to rise or fall material temperatures.',
    example: 'Finding the Joules required to boil 1,000 grams of liquid water from 20°C up to 100°C.',
    inputs: [
      { id: 'massGrams', label: 'Material Mass (Grams)', type: 'number', defaultValue: 1000, min: 0.1 },
      { id: 'specificHeatCoeff', label: 'Specific Heat Capacity c (J/g°C) (e.g., Water: 4.184)', type: 'number', defaultValue: 4.184, min: 0.01, step: 0.01 },
      { id: 'tempDelta', label: 'Temperature Change ΔT (°C)', type: 'number', defaultValue: 80, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'Why does water have such a high specific heat capacity?', answer: 'Water molecules form tight hydrogen bonds with one another. These bonds require significant thermal vibrational energy to disrupt, causing water to act as an exceptional thermal stabilizer.' }
    ],
    relatedSlugs: ['wave-speed', 'ph-calculator', 'molarity'],
    seoTitle: 'Specific Heat Capacity & Thermal Q Energy Calculator',
    seoDescription: 'Solve thermodynamic heat exchange formulas. Predict required energetic Joules, material mass bounds, and temperature deltas.',
    calculate: (inputs) => {
      const mass = Number(inputs.massGrams || 1000);
      const c = Number(inputs.specificHeatCoeff || 4.184);
      const deltaT = Number(inputs.tempDelta || 80);

      const heatJ = mass * c * deltaT;
      const heatKJ = heatJ / 1000;

      return {
        results: [
          { label: 'Absorbed Heat Energy (Q)', value: `${heatKJ.toFixed(1)} kJ`, isPrimary: true },
          { label: 'Heat Energy in Calories', value: `${(heatJ / 4.184).toFixed(0)} cal`, isPrimary: true },
          { label: 'Raw Energy in Joules', value: `${Math.round(heatJ).toLocaleString()} J` }
        ]
      };
    }
  },
  {
    id: 'molarity',
    name: 'Chemical Solution Molarity Calculator',
    slug: 'molarity',
    category: 'science',
    description: 'Calculate the molar concentration of solutions using solute mass, molar mass, and solution volumes.',
    formula: 'Molarity (M) = (Solute Mass / Molar Mass) / Solution Volume',
    explanation: 'Fundamental chemical solution balancing tool. Establishes molecular concentration levels of solutes inside fluid volumes.',
    example: 'Determining the molarity of 58.44g of Table Salt (NaCl, Molar Mass: 58.44g/mol) dissolved in 1.0 Liters of water.',
    inputs: [
      { id: 'soluteMass', label: 'Solute Mass (Grams)', type: 'number', defaultValue: 58.44, min: 0.001, step: 0.001 },
      { id: 'molarMass', label: 'Molar Mass of Compound (g/mol)', type: 'number', defaultValue: 58.44, min: 0.1, step: 0.01 },
      { id: 'volumeLiters', label: 'Total Solution Volume (Liters)', type: 'number', defaultValue: 1.0, min: 0.001, step: 0.01 }
    ],
    faq: [
      { question: 'What is molar mass?', answer: 'The mass of exactly one mole (Avogadro\'s number: 6.022e23) of atoms or chemical compounds. Equal to the sum of atomic mass coefficients from the periodic table.' }
    ],
    relatedSlugs: ['ph-calculator', 'ideal-gas-law', 'specific-heat'],
    seoTitle: 'Chemical Molarity Molar Concentration Calculator | Lab Tool',
    seoDescription: 'Compute solute molarity concentrations in laboratories. Calculate solute mass weights, molar mass matrices, and fluid Liters.',
    calculate: (inputs) => {
      const mass = Number(inputs.soluteMass || 58.44);
      const mm = Number(inputs.molarMass || 58.44);
      const vol = Number(inputs.volumeLiters || 1.0);

      const moles = mass / mm;
      const molarityValue = moles / vol;

      return {
        results: [
          { label: 'Solute Molarity', value: `${molarityValue.toFixed(4)} M`, unit: 'mol/L', isPrimary: true },
          { label: 'Absolute Solute Moles Sum', value: `${moles.toFixed(4)} mol`, isPrimary: true },
          { label: 'Concentration in Millimolarity', value: `${(molarityValue * 1000).toFixed(1)} mM` }
        ]
      };
    }
  },
  {
    id: 'ph-calculator',
    name: 'Aqueous Solution pH Calculator',
    slug: 'ph-calculator',
    category: 'science',
    description: 'Convert hydrogen and hydroxide ion concentrations into pH index parameters.',
    formula: 'pH = -Log10([H+]) | pOH = 14 - pH',
    explanation: 'Defines chemical acid-alkaline thresholds. Determines logarithmic scale coordinates showing compound activity.',
    example: 'A hydrogen concentration [H+] of 1.0e-7 mol/L represents pure neutral water at a pH of 7.',
    inputs: [
      { id: 'hConcentration', label: 'Hydrogen Ion [H+] Concentration (mol/L)', type: 'number', defaultValue: 0.0001, min: 1e-14, max: 10, step: 1e-6 }
    ],
    faq: [
      { question: 'Why does the pH scale go from 0 to 14?', answer: 'The scale represents the self-ionization constant of water at 25°C, where [H+] * [OH-] = 1e-14, setting limits at 0 and 14.' }
    ],
    relatedSlugs: ['molarity', 'ideal-gas-law', 'specific-heat'],
    seoTitle: 'pH Acid Base Concentration Calculator | Chemistry Solver',
    seoDescription: 'Convert hydrogen ion molarities into precise logarithmic pH scores. Evaluates alkaline limits and chemical status.',
    calculate: (inputs) => {
      const hPlus = Number(inputs.hConcentration || 1e-7);

      const pH = -Math.log10(hPlus);
      const pOH = 14 - pH;
      const ohMinus = Math.pow(10, -pOH);

      let characteristicText = 'Acidic Solution (Corrosive)';
      if (Math.abs(pH - 7.0) < 0.05) characteristicText = 'Completely Neutral Purified Water';
      else if (pH > 7.0) characteristicText = 'Alkaline Base Compound';

      return {
        results: [
          { label: 'Solution pH Level', value: pH.toFixed(2), isPrimary: true },
          { label: 'Inverse pOH Score', value: pOH.toFixed(2), isPrimary: true },
          { label: 'Hydroxide [OH-] Density', value: `${ohMinus.toExponential(3)} mol/L` },
          { label: 'Chemical Classification', value: characteristicText }
        ]
      };
    }
  },
  {
    id: 'ideal-gas-law',
    name: 'Ideal Gas Law Solver',
    slug: 'ideal-gas-law',
    category: 'science',
    description: 'Solve the Ideal Gas Law equation, determining pressure, volume, temperature, or chemical amount variables.',
    formula: 'Pressure * Volume = Moles * Gas Constant * Temperature',
    explanation: 'PV = nRT describes the relationship between physical variables in a theoretical ideal gas.',
    example: 'Calculating pressure of 2 moles of gas inside a 10 Liter canister warmed to 300 Kelvin.',
    inputs: [
      { id: 'solveFor', label: 'Variable to Calculate', type: 'select', defaultValue: 'P', options: [
        { label: 'Pressure (P, atm)', value: 'P' },
        { label: 'Volume (V, Liters)', value: 'V' },
        { label: 'Amount (n, Moles)', value: 'n' },
        { label: 'Temperature (T, Kelvin)', value: 'T' }
      ]},
      { id: 'valP', label: 'Pressure P (atm) (if solving others)', type: 'number', defaultValue: 1.0, min: 0.001 },
      { id: 'valV', label: 'Volume V (Liters) (if solving others)', type: 'number', defaultValue: 22.4, min: 0.001 },
      { id: 'valN', label: 'User Moles Coefficient n (moles)', type: 'number', defaultValue: 1.0, min: 0.001 },
      { id: 'valT', label: 'Temperature T (Kelvin) (if solving others)', type: 'number', defaultValue: 273.15, min: 0.1 }
    ],
    faq: [
      { question: 'What is the universal gas constant (R value)?', answer: 'The universal gas constant R depends on units. This calculator uses R = 0.08206 L·atm/(mol·K) to match standard chemistry atmospheres.' }
    ],
    relatedSlugs: ['molarity', 'specific-heat', 'projectile-motion'],
    seoTitle: 'Ideal Gas Law (PV = nRT) Calculator | Physics Solver',
    seoDescription: 'Solve gas properties. Find volume, molecular mole amounts, atmospheres, and Kelvin temperatures with the PV=nRT formula.',
    calculate: (inputs) => {
      const mode = inputs.solveFor || 'P';
      const P = Number(inputs.valP || 1);
      const V = Number(inputs.valV || 22.4);
      const n = Number(inputs.valN || 1);
      const T = Number(inputs.valT || 273.15);

      const R = 0.082057; // L atm mol-1 K-1

      let resultVal = 0;
      let label = '';
      let unit = '';

      if (mode === 'P') {
        resultVal = (n * R * T) / V;
        label = 'Calculated Pressure (P)';
        unit = 'atm';
      } else if (mode === 'V') {
        resultVal = (n * R * T) / P;
        label = 'Calculated Volume (V)';
        unit = 'Liters';
      } else if (mode === 'n') {
        resultVal = (P * V) / (R * T);
        label = 'Calculated Moles Amount (n)';
        unit = 'moles';
      } else if (mode === 'T') {
        resultVal = (P * V) / (n * R);
        label = 'Calculated Temperature (T)';
        unit = 'K';
      }

      return {
        results: [
          { label, value: `${resultVal.toFixed(3)} ${unit}`, isPrimary: true },
          { label: 'Utilized Gas Constant R Value', value: `${R} L·atm/(mol·K)` }
        ]
      };
    }
  },
  {
    id: 'dna-transcription',
    name: 'DNA to RNA Transcription Calculator',
    slug: 'dna-transcription',
    category: 'science',
    description: 'Transcribe a DNA template sequence into its complementary RNA strain.',
    formula: 'DNA [A, T, C, G] -> RNA [U, A, G, C]',
    explanation: 'Bypasses laboratory strain mapping by simulating biological cellular RNA synthesis, converting thymines into uracils.',
    example: 'DNA template string "ATCG" transcribes into the RNA string "UAGC".',
    inputs: [
      { id: 'dnaSequence', label: 'Primary DNA Sequence Template String', type: 'text', defaultValue: 'ATCGGCTAACGT' }
    ],
    faq: [
      { question: 'What is transcription in cell biology?', answer: 'Transcription is the biological cellular process where a segment of DNA is transcribed into RNA by the RNA polymerase enzyme, allowing subsequent translation into proteins.' }
    ],
    relatedSlugs: ['photosynthesis-yield', 'half-life', 'molarity'],
    seoTitle: 'DNA to RNA Transcription Sequence Calculator | genetics',
    seoDescription: 'Analyze genetic sequences. Performs transcription conversions, identifies faulty bases, and estimates codon bounds.',
    calculate: (inputs) => {
      const rawDna = (inputs.dnaSequence || 'ATCGGCTAACGT').toUpperCase().replace(/[^ATCG]/g, 'N');

      // Transcription map: A->U, T->A, C->G, G->C
      let rna = '';
      for (const char of rawDna) {
        if (char === 'A') rna += 'U';
        else if (char === 'T') rna += 'A';
        else if (char === 'C') rna += 'G';
        else if (char === 'G') rna += 'C';
        else rna += 'N'; // Undefined base
      }

      const codonCount = Math.floor(rna.length / 3);

      return {
        results: [
          { label: 'Synthesized Messenger RNA (mRNA)', value: rna, isPrimary: true },
          { label: 'Total Base Bases Counted', value: rna.length, isPrimary: true },
          { label: 'Available Genetic Codons', value: codonCount }
        ]
      };
    }
  },
  {
    id: 'half-life',
    name: 'Radioactive Half-Life Decay Calculator',
    slug: 'half-life',
    category: 'science',
    description: 'Calculate isotopic half-life periods, decay constants, or remaining active compound masses.',
    formula: 'N(t) = N0 * (1/2)^(t / T_half)',
    explanation: 'Models radioactive decay overtime. Traces isotopes like Carbon-14 or Uranium-235 for nuclear physics applications.',
    example: 'A radioactive element with a 10-day half-life decays down to 25% of its mass after 20 days.',
    inputs: [
      { id: 'initialQuantity', label: 'Initial Radioactive Mass (Grams / %)', type: 'number', defaultValue: 100, min: 0.1 },
      { id: 'halfLifePeriod', label: 'Isotopic Half-Life Lifespan (Days)', type: 'number', defaultValue: 15, min: 0.01 },
      { id: 'decayTime', label: 'Elapsed Decay Process Time (Days)', type: 'number', defaultValue: 30, min: 0 }
    ],
    faq: [
      { question: 'What is carbon dating?', answer: 'It is a radiological method used to find the age of organic materials. Measures the ratio of decayed Carbon-14 (half-life of ~5,730 years) remaining in ancient specimens.' }
    ],
    relatedSlugs: ['projectile-motion', 'force-calculator', 'kinetic-energy'],
    seoTitle: 'Isotope Half-Life & Exponential Decay Calculator | Nuclear Physics',
    seoDescription: 'Obtain decay curves for isotopes. Estimates remaining active mass values and determines system decay constants.',
    calculate: (inputs) => {
      const n0 = Number(inputs.initialQuantity || 100);
      const halfLife = Number(inputs.halfLifePeriod || 15);
      const time = Number(inputs.decayTime || 30);

      const decayedPower = time / halfLife;
      const nt = n0 * Math.pow(0.5, decayedPower);
      const lambdaDecay = Math.LN2 / halfLife;

      return {
        results: [
          { label: 'Remaining Active Mass Nt', value: nt.toFixed(3), isPrimary: true },
          { label: 'Mass Decayed (Lost Material)', value: (n0 - nt).toFixed(3), isPrimary: true },
          { label: 'Isotope Decay Constant (λ)', value: lambdaDecay.toFixed(5), unit: 'day^-1' },
          { label: 'Decay Generations Elapsed', value: decayedPower.toFixed(2), unit: 'half-lives' }
        ]
      };
    }
  },
  {
    id: 'force-calculator',
    name: 'Newton\'s Second Law Force Calculator',
    slug: 'force-calculator',
    category: 'science',
    description: 'Calculate net physical force, mass, or acceleration using Newton\'s Second Law of Motion.',
    formula: 'Force (F) = Mass (m) * Acceleration (a)',
    explanation: 'The foundation of classical mechanics. Formulates linear momentum changes for mass structures under load.',
    example: 'An acceleration of 10 m/s² applied to a 5 kg mass requires exactly 50 Newtons of force.',
    inputs: [
      { id: 'massKg', label: 'Skeletal Mass (kg)', type: 'number', defaultValue: 12, min: 0.001 },
      { id: 'acceleration', label: 'Acceleration Rate (m/s²)', type: 'number', defaultValue: 9.8, min: -1000, step: 0.1 }
    ],
    faq: [
      { question: 'What is 1 Newton of force equal to?', answer: '1 Newton (N) is defined as the force required to accelerate a 1 kilogram mass at a rate of 1 meter per second squared (1 kg·m/s²).' }
    ],
    relatedSlugs: ['kinetic-energy', 'projectile-motion', 'half-life'],
    seoTitle: 'Newton\'s Force Solver | F = m * a Physics Calculator',
    seoDescription: 'Calculate force outputs in Newtons using mass and acceleration rates under standard physical dynamics.',
    calculate: (inputs) => {
      const m = Number(inputs.massKg || 12);
      const a = Number(inputs.acceleration || 9.8);

      const force = m * a;

      return {
        results: [
          { label: 'Net Force Developed (F)', value: `${force.toFixed(2)} N`, isPrimary: true },
          { label: 'Calculated Weight in Dynes', value: (force * 100000).toExponential(2) },
          { label: 'Equivalent Force in Pound-force', value: `${(force * 0.2248).toFixed(3)} lbf` }
        ]
      };
    }
  },
  {
    id: 'kinetic-energy',
    name: 'Kinetic Energy Calculator',
    slug: 'kinetic-energy',
    category: 'science',
    description: 'Calculate the translational kinetic energy of moving objects using mass and velocity parameters.',
    formula: 'Kinetic Energy (E_k) = 1/2 * Mass * Velocity^2',
    explanation: 'Measures the translational mechanical energy of an object in motion.',
    example: 'A car with a mass of 1,500 kg traveling at 25 m/s (~90 kph) develops massive kinetic momentum.',
    inputs: [
      { id: 'massObj', label: 'Moving Objet Mass (kg)', type: 'number', defaultValue: 80, min: 0.01 },
      { id: 'velocityObj', label: 'Physical Velocity (m/s)', type: 'number', defaultValue: 10, min: 0, step: 0.1 }
    ],
    faq: [
      { question: 'Why does doubling speed quadruple kinetic energy?', answer: 'The formula features velocity squared (v²). Doubling velocity yields a 4x increase in kinetic energy, which is why stopping distances expand exponentially at speed.' }
    ],
    relatedSlugs: ['force-calculator', 'projectile-motion', 'specific-heat'],
    seoTitle: 'Kinetic Energy (0.5mv²) Calculator | Classical Physics',
    seoDescription: 'Obtain translational movement energies. Computes kinematic energy bounds using mass coefficients and relative object velocities.',
    calculate: (inputs) => {
      const m = Number(inputs.massObj || 80);
      const v = Number(inputs.velocityObj || 10);

      const ke = 0.5 * m * v * v;

      return {
        results: [
          { label: 'Kinetic Energy Developed', value: `${ke.toFixed(1)} Joules`, isPrimary: true },
          { label: 'Energy in Kilocalories', value: `${(ke / 4184).toFixed(4)} kcal`, isPrimary: true },
          { label: 'Force Potential Impact', value: `Equivalent velocity of ${(v * 3.6).toFixed(1)} km/h` }
        ]
      };
    }
  },
  {
    id: 'photosynthesis-yield',
    name: 'Photosynthetic Performance Index Calculator',
    slug: 'photosynthesis-yield',
    category: 'science',
    description: 'Estimate relative plant carbon fixation rates based on temperature, light spectrum intensity, and CO2 densities.',
    formula: 'Fixation Index = Min(CO2 limits, Light limits, Temp curve)',
    explanation: 'Applies Liebig\'s law of the minimum to identify the limiting factor in crop development.',
    example: 'Growing tomatoes under 400ppm atmospheric carbon limits despite bright grow lights.',
    inputs: [
      { id: 'co2Density', label: 'Ambient Carbon Dioxide Density (ppm)', type: 'number', defaultValue: 420, min: 100, max: 2000 },
      { id: 'lightIntensity', label: 'Light Level Intensity (Lux)', type: 'number', defaultValue: 12000, min: 0, max: 100000 },
      { id: 'temperatureC', label: 'Foliage Environment Temperature (°C)', type: 'number', defaultValue: 24, min: 5, max: 45 }
    ],
    faq: [
      { question: 'What is Liebig\'s Law of the Minimum?', answer: 'A farming principle stating that crop growth is controlled not by the total resources available, but by the scarcest nutrient or limiting factor.' }
    ],
    relatedSlugs: ['dna-transcription', 'half-life', 'molarity'],
    seoTitle: 'Plant Photosynthesis Performance Index Calculator',
    seoDescription: 'Track greenhouse crop carbon fixation limits. Models limiting factors from light intensity, CO2 levels, and temperature curves.',
    calculate: (inputs) => {
      const co2 = Number(inputs.co2Density || 420);
      const lux = Number(inputs.lightIntensity || 12000);
      const temp = Number(inputs.temperatureC || 24);

      // Simple relative model
      const co2Score = (co2 / 1000) * 100;
      const lightScore = (lux / 50000) * 100;
      let tempScore = 0;
      if (temp >= 15 && temp <= 35) {
        tempScore = 100 - Math.pow(temp - 25, 2) * 0.8;
      } else {
        tempScore = Math.max(10, 50 - Math.abs(25 - temp) * 3);
      }

      const efficiency = Math.min(100, Math.max(5, Math.min(co2Score, lightScore, tempScore)));

      let limitsText = 'Carbon Dioxide concentration is the primary limiting resource';
      if (lightScore < co2Score && lightScore < tempScore) {
        limitsText = 'Photosynthetic light levels are low, limiting activity';
      } else if (tempScore < co2Score && tempScore < lightScore) {
        limitsText = 'Extreme folder temperatures are limiting enzyme activity';
      }

      return {
        results: [
          { label: 'Photosynthetic Performance Index', value: `${efficiency.toFixed(1)} / 100`, isPrimary: true },
          { label: 'Z-curve Efficiency Limit', value: limitsText, isPrimary: true },
          { label: 'Ideal Benchmark Target', value: '85.0' }
        ]
      };
    }
  },

  // ====================================== FINANCE ======================================
  {
    id: 'dividend-yield-calc',
    name: 'Dividend Yield Calculator',
    slug: 'dividend-yield-calc',
    category: 'finance',
    description: 'Calculate annual stock dividend yields and project total dividend income.',
    formula: 'Dividend Yield % = (Annual Payout Per Share / Current Stock Price) * 100',
    explanation: 'Helps income investors evaluate yield performance across stock equities, real estate trusts, and funds.',
    example: 'Buying a stock at $100 per share with a quarterly dividend payout of $1.25 ($5.00 annually).',
    inputs: [
      { id: 'stockPrice', label: 'Current Stock Price ($)', type: 'number', defaultValue: 120, min: 0.1 },
      { id: 'annualDividend', label: 'Overall Annual Dividend Payout ($)', type: 'number', defaultValue: 4.8, min: 0 },
      { id: 'numShares', label: 'Total Portfolio Shares Owned', type: 'number', defaultValue: 150, min: 1 }
    ],
    faq: [
      { question: 'What is a dividend payout ratio?', answer: 'The dividend payout ratio is the percentage of a company\'s net income paid out to shareholders as dividends, showing dividend sustainability.' }
    ],
    relatedSlugs: ['cagr-calculator', 'roi-calculator', 'compound-interest-calculator'],
    seoTitle: 'Stock Equity Dividend Yield & Annual Cashflow Calculator | Investor',
    seoDescription: 'Calculate annual portfolio cash flow yields based on stock prices, dividend distributions, and share counts.',
    calculate: (inputs) => {
      const price = Number(inputs.stockPrice || 120);
      const div = Number(inputs.annualDividend || 4.8);
      const shares = Number(inputs.numShares || 150);

      const yieldPercent = (div / price) * 100;
      const yearlyEarnings = div * shares;

      return {
        results: [
          { label: 'Dividend Yield Percentage', value: `${yieldPercent.toFixed(2)}%`, isPrimary: true },
          { label: 'Projected Annual Cash Income', value: yearlyEarnings.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Total Invested Capital Value', value: (price * shares).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'cagr-calculator',
    name: 'Compound Annual Growth Rate (CAGR) Calculator',
    slug: 'cagr-calculator',
    category: 'finance',
    description: 'Calculate the Compound Annual Growth Rate (CAGR) of an investment over time.',
    formula: 'CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1',
    explanation: 'Allows investors to compare returns across diverse asset classes like real estate, ETFs, and venture capital, smoothing out year-over-year volatility.',
    example: 'An investment that grew from $10,000 to $25,000 over a 7-year period.',
    inputs: [
      { id: 'beginVal', label: 'Beginning Portfolio Value ($)', type: 'number', defaultValue: 10000, min: 1 },
      { id: 'endingVal', label: 'Ending Portfolio Value ($)', type: 'number', defaultValue: 25000, min: 1 },
      { id: 'yearsValue', label: 'Hold Period Timeline (Years)', type: 'number', defaultValue: 7, min: 0.1 }
    ],
    faq: [
      { question: 'How is CAGR different from simple average return?', answer: 'Simple average return ignores compounding. CAGR reflects the steady annual rate of return an investment would have achieved if it grew at a constant rate each year.' }
    ],
    relatedSlugs: ['dividend-yield-calc', 'roi-calculator', 'loan-calculator'],
    seoTitle: 'Compound Annual Growth Rate (CAGR) Investment Calculator',
    seoDescription: 'Calculate target portfolio CAGR performance. Compare annual growth rates across index funds and venture capital holdings.',
    calculate: (inputs) => {
      const start = Number(inputs.beginVal || 10000);
      const end = Number(inputs.endingVal || 25000);
      const yrs = Number(inputs.yearsValue || 7);

      const cagrVal = (Math.pow(end / start, 1 / yrs) - 1) * 100;
      const totalGrowthPct = ((end - start) / start) * 100;

      return {
        results: [
          { label: 'Compound Annual Growth Rate (CAGR)', value: `${cagrVal.toFixed(2)}%`, isPrimary: true },
          { label: 'Gross Absolute Portfolio Growth', value: `${totalGrowthPct.toFixed(1)}%`, isPrimary: true },
          { label: 'Absolute Earned Gain', value: (end - start).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'roi-calculator',
    name: 'Return on Investment (ROI) Calculator',
    slug: 'roi-calculator',
    category: 'finance',
    description: 'Calculate the total return on investment (ROI) and annualized returns of your business and financial ventures.',
    formula: 'ROI % = ((Final Value - Initial Invested) / Initial Invested) * 100',
    explanation: 'A key benchmark for comparing financial performance. It shows the net profitability of an asset relative to its acquisition cost.',
    example: 'Buying a commercial asset for $50,000 and selling it for $68,000 two years later.',
    inputs: [
      { id: 'costInvestment', label: 'Initial Costs invested ($)', type: 'number', defaultValue: 50000, min: 1 },
      { id: 'revenueReturns', label: 'Final Value / Lifetime Revenues ($)', type: 'number', defaultValue: 68000, min: 0 },
      { id: 'holdingYears', label: 'Investment Hold Duration (Years)', type: 'number', defaultValue: 2, min: 0.1 }
    ],
    faq: [
      { question: 'Why track Annualized ROI alongside simple ROI?', answer: 'Simple ROI is return-focused, which can be misleading for long-term holds. Annualized ROI incorporates holding time, allowing you to compare short-term flips and decade-long bonds fairly.' }
    ],
    relatedSlugs: ['dividend-yield-calc', 'cagr-calculator', 'debt-equity-index'],
    seoTitle: 'Return on Investment (ROI) & Profit Margin Calculator',
    seoDescription: 'Compute simple and annualized Return on Investment (ROI) percentages for assets, businesses, or real estate campaigns.',
    calculate: (inputs) => {
      const cost = Number(inputs.costInvestment || 50000);
      const returns = Number(inputs.revenueReturns || 68000);
      const holding = Number(inputs.holdingYears || 2);

      const netProfit = returns - cost;
      const roiPercent = (netProfit / cost) * 100;

      // Annualized ROI = (1 + ROI_dec)^(1/years) - 1
      const decimalReturn = returns / cost;
      const annualizedRoi = (Math.pow(decimalReturn, 1 / holding) - 1) * 100;

      return {
        results: [
          { label: 'Simple Return on Investment (ROI)', value: `${roiPercent.toFixed(1)}%`, isPrimary: true },
          { label: 'Annualized ROI Performance', value: `${annualizedRoi.toFixed(2)}%`, isPrimary: true },
          { label: 'Net Profit Earnings Sum', value: netProfit.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'debt-equity-index',
    name: 'Debt-to-Equity Balance Sheet Calculator',
    slug: 'debt-equity-index',
    category: 'finance',
    description: 'Evaluate leverage ratios by comparing total corporate liabilities to outstanding shareholder equity.',
    formula: 'Debt to Equity = Total Liabilities / Total Shareholder Equity',
    explanation: 'Analyzes long-term business health and solvency, showing the portion of business operations funded by lenders versus owners.',
    example: 'An LLC carrying $50K in obligations backed by $40K in shareholder capital.',
    inputs: [
      { id: 'liabilitiesDebts', label: 'Total Liabilities & Bank Debts ($)', type: 'number', defaultValue: 120000, min: 0 },
      { id: 'shareholdersEquity', label: 'Total Shareholder Equity / Net Worth ($)', type: 'number', defaultValue: 150000, min: 1 }
    ],
    faq: [
      { question: 'What is a typical healthy Debt-to-Equity ratio?', answer: 'While relative to your industry, a Debt-to-Equity ratio between 1.0 and 1.5 is generally considered healthy. Ratios above 2.0 can indicate high risk and leverage.' }
    ],
    relatedSlugs: ['roi-calculator', 'cagr-calculator', 'dividend-yield-calc'],
    seoTitle: 'Debt to Equity Solvency Ratio (D/E) Calculator',
    seoDescription: 'Check balance sheet health and solvency ratios using corporate liabilities and equity levels quickly.',
    calculate: (inputs) => {
      const liabilities = Number(inputs.liabilitiesDebts || 120000);
      const equity = Number(inputs.shareholdersEquity || 150000);

      const ratio = liabilities / equity;

      return {
        results: [
          { label: 'Debt to Equity Ratio (D/E)', value: ratio.toFixed(2), isPrimary: true },
          { label: 'Total Capital Structure Sizing', value: (liabilities + equity).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Funding Proportion from Equity', value: `${((equity / (liabilities + equity)) * 100).toFixed(0)}%` }
        ]
      };
    }
  },

  // ====================================== BUSINESS ======================================
  {
    id: 'customer-lifetime-value',
    name: 'Customer Lifetime Value (CLV / LTV) Calculator',
    slug: 'customer-lifetime-value',
    category: 'business',
    description: 'Estimate the average long-term revenue generated by a single customer contract over their lifecycle.',
    formula: 'CLV = Average Purchase Value * Purchase Frequency * Customer Lifespan',
    explanation: 'Designed for marketing teams to set sustainable customer acquisition spend thresholds based on long-term value.',
    example: 'A grocery delivery customer spending $75 once every week, remaining loyal to your brand for 4 years.',
    inputs: [
      { id: 'orderValue', label: 'Average Customer Order Value ($)', type: 'number', defaultValue: 65, min: 1 },
      { id: 'purchaseFreq', label: 'Average Purchases Per Year (Frequency)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'lifespanYears', label: 'Average Client Retention Lifespan (Years)', type: 'number', defaultValue: 3.5, min: 0.1 }
    ],
    faq: [
      { question: 'What is the ideal LTV:CAC ratio?', answer: 'Target an LTV to CAC ratio of 3:1 or higher. Ratios under 2:1 indicate that customer acquisition costs are too high to support profitable growth.' }
    ],
    relatedSlugs: ['customer-acquisition-cost', 'gross-profit-margin', 'customer-churn-rate'],
    seoTitle: 'Customer Lifetime Value (LTV) Calculator | SaaS Pricing',
    seoDescription: 'Find Customer Lifetime Value (CLV) based on ticket pricing, year transactions, and attrition horizons.',
    calculate: (inputs) => {
      const value = Number(inputs.orderValue || 65);
      const freq = Number(inputs.purchaseFreq || 15);
      const lifespan = Number(inputs.lifespanYears || 3.5);

      const annualRevenue = value * freq;
      const totalCLV = annualRevenue * lifespan;

      return {
        results: [
          { label: 'Estimated Customer Lifetime Value (CLV)', value: totalCLV.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Annual Revenue Per Account (ARR)', value: annualRevenue.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Estimated Deliveries Completed', value: Math.ceil(freq * lifespan), unit: 'delivered orders' }
        ]
      };
    }
  },
  {
    id: 'customer-acquisition-cost',
    name: 'Customer Acquisition Cost (CAC) Calculator',
    slug: 'customer-acquisition-cost',
    category: 'business',
    description: 'Track how much your business spends to acquire a single new customer, factoring in marketing spend and team payroll.',
    formula: 'CAC = (Total Sales Costs + Marketing Overhead) / New Customers Acquired',
    explanation: 'Evaluates your marketing efficiency. Low acquisition overheads allow businesses to scale faster and improve profitability.',
    example: 'Spending $10K on digital ads and $5K on sales payroll to sign up 300 users.',
    inputs: [
      { id: 'marketingOverhead', label: 'Total Marketing & Advertising Spend ($)', type: 'number', defaultValue: 12000, min: 0 },
      { id: 'salesPayroll', label: 'Total Sales Team Payroll Expenses ($)', type: 'number', defaultValue: 8000, min: 0 },
      { id: 'newAcquired', label: 'Count of New Customers Signed Up', type: 'number', defaultValue: 450, min: 1 }
    ],
    faq: [
      { question: 'Why include internal salaries in CAC calculations?', answer: 'Including internal sales salaries, agency fees, and software licenses alongside ad spend provides a realistic view of how much it costs to acquire customers.' }
    ],
    relatedSlugs: ['customer-lifetime-value', 'gross-profit-margin', 'customer-churn-rate'],
    seoTitle: 'Customer Acquisition Cost (CAC) Calculator | Marketing Stats',
    seoDescription: 'Calculate customer acquisition costs based on marketing expenses, sales salaries, and new user acquisition.',
    calculate: (inputs) => {
      const marketing = Number(inputs.marketingOverhead || 12000);
      const sales = Number(inputs.salesPayroll || 8000);
      const count = Number(inputs.newAcquired || 450);

      const totalSpent = marketing + sales;
      const cacVal = totalSpent / count;

      return {
        results: [
          { label: 'Customer Acquisition Cost (CAC)', value: cacVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Total Acquisition Expenditures', value: totalSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Marketing Allocation Portion', value: `${((marketing / totalSpent) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'gross-profit-margin',
    name: 'Gross Profit Margin Calculator',
    slug: 'gross-profit-margin',
    category: 'business',
    description: 'Calculate gross margins and markups using product sales price and Cost of Goods Sold (COGS).',
    formula: 'Gross Margin % = ((Price - COGS) / Price) * 100',
    explanation: 'A fundamental profitability metric for physical products and services. Checks if pricing sustains operational overhead.',
    example: 'Selling a retail item for $60 that costs $22 to supply and assemble.',
    inputs: [
      { id: 'sellingPrice', label: 'Item Selling Price ($/unit)', type: 'number', defaultValue: 65, min: 0.01 },
      { id: 'cogsCost', label: 'Cost of Goods Sold (COGS) ($/unit)', type: 'number', defaultValue: 28, min: 0, step: 0.1 }
    ],
    faq: [
      { question: 'How is profit margin different from markup?', answer: 'Margin is calculated relative to the final sales price, whereas markup is calculated as a percentage increase over the original cost.' }
    ],
    relatedSlugs: ['customer-lifetime-value', 'customer-acquisition-cost', 'customer-churn-rate'],
    seoTitle: 'Gross Merchant Profit Margin & Retail Markup Calculator',
    seoDescription: 'Find net margins, gross profits, and retail markups based on Cost of Goods Sold (COGS) and unit pricing.',
    calculate: (inputs) => {
      const price = Number(inputs.sellingPrice || 65);
      const cogs = Number(inputs.cogsCost || 28);

      const validatedCogs = Math.min(price, cogs);
      const grossProfitValue = price - validatedCogs;
      const margin = (grossProfitValue / price) * 100;
      const markupValue = validatedCogs > 0 ? (grossProfitValue / validatedCogs) * 100 : 0;

      return {
        results: [
          { label: 'Gross Profit Margin', value: `${margin.toFixed(1)}%`, isPrimary: true },
          { label: 'Product Markup %', value: `${markupValue.toFixed(1)}%`, isPrimary: true },
          { label: 'Unit Cash Gross Profit', value: grossProfitValue.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'customer-churn-rate',
    name: 'Customer Churn & Retention Calculator',
    slug: 'customer-churn-rate',
    category: 'business',
    description: 'Track customer retention and churn rates to measure product stability and customer loyalty.',
    formula: 'Churn Rate = (Customers Lost at End of Period / Customers at Start) * 100',
    explanation: 'An essential metric for SaaS and subscription businesses, helping monitor customer attrition and business stability.',
    example: 'Losing 35 monthly subscribers of a 500-member service.',
    inputs: [
      { id: 'startCustomers', label: 'Members at Start of Period', type: 'number', defaultValue: 1200, min: 1 },
      { id: 'lostCustomers', label: 'Unsubscribes / Users Lost During Period', type: 'number', defaultValue: 72, min: 0 }
    ],
    faq: [
      { question: 'How does high churn impact business growth?', answer: 'High churn requires the marketing team to continuously acquire new customers just to maintain flat revenue, increasing acquisition overhead.' }
    ],
    relatedSlugs: ['customer-lifetime-value', 'customer-acquisition-cost', 'gross-profit-margin'],
    seoTitle: 'Customer Churn & Subscriber Attrition Rate Calculator',
    seoDescription: 'Determine client churn rates and trace retention percentages on subscription plans.',
    calculate: (inputs) => {
      const start = Number(inputs.startCustomers || 1200);
      const lost = Number(inputs.lostCustomers || 72);

      const validatedLost = Math.min(start, lost);
      const churnRate = (validatedLost / start) * 100;
      const retentionRate = 100 - churnRate;

      return {
        results: [
          { label: 'Customer Monthly Churn Rate', value: `${churnRate.toFixed(2)}%`, isPrimary: true },
          { label: 'Client Retention Performance', value: `${retentionRate.toFixed(2)}%`, isPrimary: true },
          { label: 'Remaining Active User Base', value: (start - validatedLost).toLocaleString() }
        ]
      };
    }
  },

  // ====================================== EDUCATION ======================================
  {
    id: 'gpa-calculator',
    name: 'GPA Grade Point Average Calculator',
    slug: 'gpa-calculator',
    category: 'education',
    description: 'Calculate your weighted or unweighted GPA based on course grades and credit hours.',
    formula: 'GPA = Sum(Grade Points * Credits) / Sum(Credits)',
    explanation: 'Converts school grades into standard numerical GPA scores, helping students track academic achievements and college applications.',
    example: 'E.g., Getting three A grades and one B grade over a standard semester timeline.',
    inputs: [
      { id: 'grade1', label: 'Course 1 - Grade Point (A=4, B=3, C=2, D=1)', type: 'select', defaultValue: '4', options: [
        { label: 'Grade A / Outstanding (4.0 Points)', value: '4' },
        { label: 'Grade B (3.0 Points)', value: '3' },
        { label: 'Grade C (2.0 Points)', value: '2' },
        { label: 'Grade D (1.0 Points)', value: '1' },
         { label: 'Grade F (0 Points)', value: '0' }
      ]},
      { id: 'credit1', label: 'Course 1 - Semester Credits Sizing', type: 'number', defaultValue: 4, min: 1 },
      { id: 'grade2', label: 'Course 2 - Grade Point', type: 'select', defaultValue: '3', options: [
        { label: 'Grade A / Outstanding (4.0 Points)', value: '4' },
        { label: 'Grade B (3.0 Points)', value: '3' },
        { label: 'Grade C (2.0 Points)', value: '2' },
        { label: 'Grade D (1.0 Points)', value: '1' }
      ]},
      { id: 'credit2', label: 'Course 2 - Credits Sizing', type: 'number', defaultValue: 3, min: 1 }
    ],
    faq: [
      { question: 'What is weighted versus unweighted GPA?', answer: 'Unweighted GPA treats all courses equally, whereas weighted GPA factors in difficulty level, allocating 5.0 points for Advanced Placement (AP) classes.' }
    ],
    relatedSlugs: ['grade-needed-calculator', 'test-score', 'study-hours'],
    seoTitle: 'GPA Grade Point Average Calculator | Weighted Student Ledger',
    seoDescription: 'Calculate semester GPA scores with credit hour weights. Supports unweighted and custom options.',
    calculate: (inputs) => {
      const g1 = Number(inputs.grade1 || 4);
      const c1 = Number(inputs.credit1 || 4);
      const g2 = Number(inputs.grade2 || 3);
      const c2 = Number(inputs.credit2 || 3);

      const totalCredits = c1 + c2;
      const totalPoints = (g1 * c1) + (g2 * c2);
      const finalGPA = totalPoints / totalCredits;

      return {
        results: [
          { label: 'Calculated Grade Point Average (GPA)', value: finalGPA.toFixed(2), isPrimary: true },
          { label: 'Total Semester Credits Completed', value: totalCredits, isPrimary: true },
          { label: 'Aggregate Points Earned', value: totalPoints }
        ]
      };
    }
  },
  {
    id: 'grade-needed-calculator',
    name: 'Final Grade Calculator',
    slug: 'grade-needed-calculator',
    category: 'education',
    description: 'Calculate the minimum final exam score required to achieve your target course grade.',
    formula: 'Required Score = (Target - Current * (100 - Exam Weight)) / Exam Weight',
    explanation: 'Saves students stress by showing them exactly what score they need on their final exam to earn their desired grade.',
    example: 'Holding an 85% average going into an exam worth 25% of the overall course grade, aiming for an 88% final grade.',
    inputs: [
      { id: 'currentGrade', label: 'Your Current Course Average (%)', type: 'number', defaultValue: 82, min: 0, max: 200 },
      { id: 'targetGrade', label: 'Your Desired Final Course Grade (%)', type: 'number', defaultValue: 85, min: 0, max: 200 },
      { id: 'examWeight', label: 'Final Exam Grading Weight (%)', type: 'number', defaultValue: 25, min: 1, max: 100 }
    ],
    faq: [
      { question: 'What if final exam scores exceed 100%?', answer: 'This indicates that you need extra credit to reach your desired grade. Consider adjusting your goal or checking for and completing extra assignments.' }
    ],
    relatedSlugs: ['gpa-calculator', 'test-score', 'study-hours'],
    seoTitle: 'Final Exam Target Grade Calculator | Student Planner',
    seoDescription: 'Track how exam weighting affects your course grades and calculate the specific test scores needed to achieve your goals.',
    calculate: (inputs) => {
      const current = Number(inputs.currentGrade || 82);
      const target = Number(inputs.targetGrade || 85);
      const weightRaw = Number(inputs.examWeight || 25);

      const weightVal = weightRaw / 100;
      const nonExamWeight = 1 - weightVal;

      const scoreNeeded = (target - (current * nonExamWeight)) / weightVal;

      return {
        results: [
          { label: 'Minimum Grade Needed on Exam', value: `${scoreNeeded.toFixed(1)}%`, isPrimary: true },
          { label: 'Prior Average Safeguard Value', value: `${(current * nonExamWeight).toFixed(1)}%`, isPrimary: true },
          { label: 'Required Grade Feasibility', value: scoreNeeded > 100 ? 'Requires Extra Credit (Difficult)' : scoreNeeded < 50 ? 'Low Risk (Easy)' : 'In-Reach (Standard study)' }
        ]
      };
    }
  },
  {
    id: 'test-score',
    name: 'Test Score percentage Calculator',
    slug: 'test-score',
    category: 'education',
    description: 'Calculate exam performance percentages and letter grades based on correct answers and question counts.',
    formula: 'Score % = (Correct Answers / Total Questions) * 100',
    explanation: 'Quickly scores tests and assignments. Provides both percentages and conventional letter grades.',
    example: 'Answering 42 out of 50 questions correctly on a midterm.',
    inputs: [
      { id: 'totalQuestions', label: 'Total Exam Questions', type: 'number', defaultValue: 50, min: 1 },
      { id: 'correctAnswers', label: 'Correct Answers Logged', type: 'number', defaultValue: 42, min: 0 }
    ],
    faq: [
      { question: 'What is a typical letter grade scale?', answer: 'Most grading scales use A (90-100%), B (80-89%), C (70-79%), D (60-69%), and F (below 60%).' }
    ],
    relatedSlugs: ['gpa-calculator', 'grade-needed-calculator', 'study-hours'],
    seoTitle: 'Academic Test Score Percentage & Letter Grade Calculator',
    seoDescription: 'Grade tests quickly by inputting correct answers and total questions. Provides percentages and letter grades.',
    calculate: (inputs) => {
      const total = Number(inputs.totalQuestions || 50);
      const correct = Number(inputs.correctAnswers || 42);

      const validatedCorrect = Math.min(total, correct);
      const percent = (validatedCorrect / total) * 100;

      let letter = 'F';
      if (percent >= 90) letter = 'A';
      else if (percent >= 80) letter = 'B';
      else if (percent >= 70) letter = 'C';
      else if (percent >= 60) letter = 'D';

      return {
        results: [
          { label: 'Exam Percentage Score', value: `${percent.toFixed(1)}%`, isPrimary: true },
          { label: 'Relative Letter Grade', value: letter, isPrimary: true },
          { label: 'Wrong Answers Counted', value: (total - validatedCorrect) }
        ]
      };
    }
  },
  {
    id: 'study-hours',
    name: 'Weekly study Schedule Planner',
    slug: 'study-hours',
    category: 'education',
    description: 'Calculate appropriate study hour allocations based on credit course difficulty.',
    formula: 'Study Hours = Sum of (Course Credits * Difficulty Level Weight)',
    explanation: 'Applies collegiate guidelines to help students plan balanced and effective weekly study schedules.',
    example: 'A university student taking two chemistry courses and one literature course.',
    inputs: [
      { id: 'courseCreditsTotal', label: 'Overall Semester Course Credits', type: 'number', defaultValue: 15, min: 1 },
      { id: 'difficultyWeight', label: 'Average Subject Matter Difficulty', type: 'select', defaultValue: '2', options: [
        { label: 'Introductory / Simple (2 study hours/credit)', value: '2' },
        { label: 'Intermediate (3 study hours/credit)', value: '3' },
        { label: 'Intense Advanced (4 study hours/credit)', value: '4' }
      ]}
    ],
    faq: [
      { question: 'What is the standard credit-to-study ratio?', answer: 'The standard collegiate guideline recommends 2 to 3 self-study hours for every 1 classroom credit hour weekly.' }
    ],
    relatedSlugs: ['gpa-calculator', 'grade-needed-calculator', 'test-score'],
    seoTitle: 'Collegiate Study Hour Schedule Planner | Academic Success',
    seoDescription: 'Build personal study schedules based on credit hours and course difficulty. Balanced layouts prevent burnout.',
    calculate: (inputs) => {
      const credits = Number(inputs.courseCreditsTotal || 15);
      const multiplier = Number(inputs.difficultyWeight || '2');

      const expectedStudyTime = credits * multiplier;
      const totalWeeklyCommitment = credits + expectedStudyTime; // class time + self-study

      return {
        results: [
          { label: 'Mandatory Self-Study Hours/Week', value: expectedStudyTime, unit: 'hrs', isPrimary: true },
          { label: 'Weekly Active Academic Commitment', value: totalWeeklyCommitment, unit: 'hrs', isPrimary: true },
          { label: 'Average Prep per Day', value: (expectedStudyTime / 7).toFixed(1), unit: 'hrs' }
        ]
      };
    }
  },

  // ====================================== TRANSPORT ======================================
  {
    id: 'logbook-mileage',
    name: 'Logbook Fuel Mileage & Tax Calculator',
    slug: 'logbook-mileage',
    category: 'transport-pro',
    description: 'Calculate business trip fuel budgets and estimate tax deduction claims using standard mileage rates.',
    formula: 'Tax Deduction = Business Mileage * Standard Rate per Mile',
    explanation: 'Designed for delivery drivers and consultants to calculate fuel efficiency and track tax deductions.',
    example: 'E.g., Recording 450 miles of driving using standard IRS rates.',
    inputs: [
      { id: 'distanceTraveled', label: 'Total Trip Distance (Miles)', type: 'number', defaultValue: 320, min: 1 },
      { id: 'gasPriceGallon', label: 'Local Gas Price per Gallon ($/gal)', type: 'number', defaultValue: 3.65, min: 0.1 },
      { id: 'vehicleMpg', label: 'Your Vehicle Fuel Efficiency (MPG)', type: 'number', defaultValue: 24, min: 1 },
      { id: 'standardMileageRate', label: 'Government Standard Mileage Tax Rate ($/mile) (e.g. IRS: 0.67)', type: 'number', defaultValue: 0.67, min: 0.1, step: 0.01 }
    ],
    faq: [
      { question: 'What is a standard mileage deduction?', answer: 'A tax deduction method where businesses write off a standard flat rate per mile driven for business purposes rather than tracking actual gas and repair expenses.' }
    ],
    relatedSlugs: ['freight-class', 'cargo-load-volume', 'fuel-cost-compare'],
    seoTitle: 'Business Mileage Reimbursement & Gas Cost Calculator',
    seoDescription: 'Calculate actual gas expenses and estimate standard tax write-offs for business travel.',
    calculate: (inputs) => {
      const dist = Number(inputs.distanceTraveled || 320);
      const price = Number(inputs.gasPriceGallon || 3.65);
      const mpg = Number(inputs.vehicleMpg || 24);
      const rate = Number(inputs.standardMileageRate || 0.67);

      const fuelConsumed = dist / mpg;
      const fuelCost = fuelConsumed * price;
      const deductionVal = dist * rate;

      return {
        results: [
          { label: 'Estimated Tax Deduction Claim', value: deductionVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Calculated Gas Trip Cost', value: fuelCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Gas Fuel Consumed', value: `${fuelConsumed.toFixed(1)} gallons`, unit: 'gal' }
        ]
      };
    }
  },
  {
    id: 'freight-class',
    name: 'Trucking Freight Class Estimator',
    slug: 'freight-class',
    category: 'transport-pro',
    description: 'Calculate product dispatch density and estimate NMFC shipping freight classes.',
    formula: 'Density = Weight in lbs / (Length * Width * Height / 1728)',
    explanation: 'Calculates structural cargo density. Lower density freight takes up more space relative to its weight, resulting in higher freight classes.',
    example: 'A pallet holding 450 lbs of cargo boxed inside 48 x 40 x 48 inches boundaries.',
    inputs: [
      { id: 'lengthIn', label: 'Pallet Outer Length (Inches)', type: 'number', defaultValue: 48, min: 1 },
      { id: 'widthIn', label: 'Pallet Outer Width (Inches)', type: 'number', defaultValue: 40, min: 1 },
      { id: 'heightIn', label: 'Pallet Outer Height (Inches)', type: 'number', defaultValue: 48, min: 1 },
      { id: 'weightLbs', label: 'Pallet Gross Weight (Pounds)', type: 'number', defaultValue: 450, min: 1 }
    ],
    faq: [
      { question: 'What does NMFC stand for?', answer: 'National Motor Freight Classification. It is the logistics standard for categorizing LTL freight based on density, handling, and liability.' }
    ],
    relatedSlugs: ['logbook-mileage', 'cargo-load-volume', 'fuel-cost-compare'],
    seoTitle: 'National Motor Freight NMFC Pallet Freight Class Calculator',
    seoDescription: 'Determine freight classifications. Simply calculate pallet shipping density from dimensions and weights.',
    calculate: (inputs) => {
      const l = Number(inputs.lengthIn || 48);
      const w = Number(inputs.widthIn || 40);
      const h = Number(inputs.heightIn || 48);
      const lbs = Number(inputs.weightLbs || 450);

      const cubicInches = l * w * h;
      const cubicFeet = cubicInches / 1728;
      const density = lbs / cubicFeet;

      let freightClass = 'Class 125 (Moderate)';
      if (density > 30) freightClass = 'Class 50 (Very High Density, Low Expense)';
      else if (density > 15) freightClass = 'Class 70 (Standard industrial)';
      else if (density > 10.5) freightClass = 'Class 85';
      else if (density > 8) freightClass = 'Class 100';
      else if (density > 4) freightClass = 'Class 175 (Lightweight bulky box)';
      else freightClass = 'Class 400 (Extra bulky foam components)';

      return {
        results: [
          { label: 'Calculated Freight Density', value: `${density.toFixed(2)} lbs/cu ft`, isPrimary: true },
          { label: 'NMFC Class Estimation', value: freightClass, isPrimary: true },
          { label: 'Cargo Volume Area', value: `${cubicFeet.toFixed(1)} cubic feet` }
        ]
      };
    }
  },
  {
    id: 'cargo-load-volume',
    name: 'Cargo Box Volume & Capacity Calculator',
    slug: 'cargo-load-volume',
    category: 'transport-pro',
    description: 'Calculate container cargo volumes and estimate maximum payload capacities for transport.',
    formula: 'Capacity Volume = Length * Width * Height',
    explanation: 'Designed to help dispatchers and warehouse managers plan cargo loading configurations and choose the right truck sizes.',
    example: 'A standard container holding boxes measuring 12 x 12 x 12 inches.',
    inputs: [
      { id: 'cargoAreaLength', label: 'Carrier Cargo Length (Inches / ft)', type: 'number', defaultValue: 120, min: 1 },
      { id: 'cargoAreaWidth', label: 'Carrier Cargo Width (Inches / ft)', type: 'number', defaultValue: 80, min: 1 },
      { id: 'cargoAreaHeight', label: 'Carrier Cargo Height (Inches / ft)', type: 'number', defaultValue: 72, min: 1 }
    ],
    faq: [
      { question: 'Why plan load layouts carefully?', answer: 'Improperly loaded cargo can shift during transit, damaging goods or creating uneven weight distributions that affect vehicle handling and safety.' }
    ],
    relatedSlugs: ['logbook-mileage', 'freight-class', 'fuel-cost-compare'],
    seoTitle: 'Cargo Box Volume & Carrier Loading Capacity Calculator',
    seoDescription: 'Determine cargo box volume dimensions. Quickly estimate maximum payload bounds to plan shipments.',
    calculate: (inputs) => {
      const l = Number(inputs.cargoAreaLength || 120);
      const w = Number(inputs.cargoAreaWidth || 80);
      const h = Number(inputs.cargoAreaHeight || 72);

      const volInches = l * w * h;
      const volFeet = volInches / 1728;

      return {
        results: [
          { label: 'Total Internal Cargo Volume', value: `${volFeet.toFixed(1)} cubic ft`, isPrimary: true },
          { label: 'Volume in Cubic Meters', value: `${(volFeet * 0.0283).toFixed(2)} m³`, isPrimary: true },
          { label: 'Max Pallets Capacity (standard 48"x40")', value: Math.floor((l * w) / 1920) }
        ]
      };
    }
  },
  {
    id: 'fuel-cost-compare',
    name: 'Transport Fuel Cost Comparison Calculator',
    slug: 'fuel-cost-compare',
    category: 'transport-pro',
    description: 'Compare fuel costs between standard combustion engines and electric vehicles.',
    formula: 'Fuel Cost per 100 Miles = (100 / Efficiency) * Fuel Price',
    explanation: 'Converts diverse energy units (gasoline gallons and electric kWh) into a single cost metric, helping drivers choose efficient vehicles.',
    example: 'Comparing a 25 MPG gasoline car (at $3.50/gal) to a 34 kWh/100-mi EV (at $0.16/kWh).',
    inputs: [
      { id: 'gasPrice', label: 'Gas Price per Gallon ($/gal)', type: 'number', defaultValue: 3.55, min: 0.1 },
      { id: 'gasMpg', label: 'Gasoline Vehicle Efficiency (MPG)', type: 'number', defaultValue: 25, min: 1 },
      { id: 'electricityPrice', label: 'Electricity Utility Price ($/kWh)', type: 'number', defaultValue: 0.16, min: 0.01, step: 0.01 },
      { id: 'evKwhPer100', label: 'EV Power Usage per 100 Miles (kWh)', type: 'number', defaultValue: 32, min: 10 }
    ],
    faq: [
      { question: 'What is e-mpg?', answer: 'MPGe stands for miles per gallon gasoline equivalent, representing the average distance a vehicle can travel using 33.7 kWh of electricity.' }
    ],
    relatedSlugs: ['logbook-mileage', 'freight-class', 'cargo-load-volume'],
    seoTitle: 'Gas vs Electric Vehicle Fuel Cost Comparison Calculator',
    seoDescription: 'Compare fuel costs between gasoline combustion engines and electric vehicles based on local gas rates and utility bills.',
    calculate: (inputs) => {
      const gas = Number(inputs.gasPrice || 3.55);
      const mpg = Number(inputs.gasMpg || 25);
      const kwPrice = Number(inputs.electricityPrice || 0.16);
      const evKwh = Number(inputs.evKwhPer100 || 32);

      const gasCostPer100Miles = (100 / mpg) * gas;
      const evCostPer100Miles = evKwh * kwPrice;

      return {
        results: [
          { label: 'Gasoline Cost per 100 Miles', value: gasCostPer100Miles.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Electric Cost per 100 Miles', value: evCostPer100Miles.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Net Savings from EV driving (per 100mi)', value: (gasCostPer100Miles - evCostPer100Miles).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },

  // ====================================== ENVIRONMENT ======================================
  {
    id: 'env-carbon-footprint',
    name: 'Household Carbon Footprint Calculator',
    slug: 'env-carbon-footprint',
    category: 'environment',
    description: 'Estimate your household\'s yearly carbon dioxide emissions based on utility and vehicle usage.',
    formula: 'Emissions (lbs CO2) = (kwh * 0.92) + (Gas Therms * 11.7) + (Gasoline Gallons * 19.6)',
    explanation: 'Tracks household carbon emissions, helping individuals identify key areas for reducing their environmental footprint.',
    example: 'E.g., A household consuming 800 kWh of electricity and driving 50 gallons of fuel monthly.',
    inputs: [
      { id: 'electricityKwh', label: 'Average Monthly Electricity Use (kWh)', type: 'number', defaultValue: 750, min: 0 },
      { id: 'gasTherms', label: 'Average Monthly Natural Gas (Therms)', type: 'number', defaultValue: 30, min: 0 },
      { id: 'gasolineGallons', label: 'Average Monthly Gasoline Consumption (Gal)', type: 'number', defaultValue: 60, min: 0 }
    ],
    faq: [
      { question: 'Why does electricity emit carbon?', answer: 'Most electrical grids still rely partially on fossil fuels (such as coal and natural gas), generating carbon emissions per kilowatt-hour produced.' }
    ],
    relatedSlugs: ['water-footprint-calc', 'recycling-impact-calc', 'plastic-waste-calc'],
    seoTitle: 'Household CO2 Carbon Footprint Estimator | Climate Tool',
    seoDescription: 'Estimate your household\'s greenhouse gas emissions. Calculate footprints from utilities, natural gas, and vehicle travel.',
    calculate: (inputs) => {
      const kwh = Number(inputs.electricityKwh || 750);
      const therms = Number(inputs.gasTherms || 30);
      const gal = Number(inputs.gasolineGallons || 60);

      // Conversions: lbs CO2 per year
      const electEmissionsYear = kwh * 0.92 * 12;
      const gasEmissionsYear = therms * 11.7 * 12;
      const autoEmissionsYear = gal * 19.6 * 12;

      const totalLbsCO2Year = electEmissionsYear + gasEmissionsYear + autoEmissionsYear;
      const totalTonsCO2Year = totalLbsCO2Year / 2000;

      return {
        results: [
          { label: 'Total Greenhouse Emissions', value: `${totalTonsCO2Year.toFixed(2)} metric tons`, unit: 'CO2 / yr', isPrimary: true },
          { label: 'Emissions per Month', value: `${(totalLbsCO2Year / 12).toFixed(0)} lbs`, unit: 'CO2', isPrimary: true },
          { label: 'Electricity-specific Share', value: `${((electEmissionsYear / totalLbsCO2Year) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'water-footprint-calc',
    name: 'Personal Water Footprint Calculator',
    slug: 'water-footprint-calc',
    category: 'environment',
    description: 'Calculate your household\'s weekly water consumption across indoor and outdoor usage.',
    formula: 'Water Consumption = sum(Activity Frequency * Activity Volume)',
    explanation: 'Tracks household water consumption, helping identify options for reducing usage and cutting utility bills.',
    example: 'Taking daily 8-minute showers paired with occasional garden irrigation cycles.',
    inputs: [
      { id: 'showerCount', label: 'Total Showers Taken per Week (Avg)', type: 'number', defaultValue: 14, min: 0 },
      { id: 'showerDuration', label: 'Average Shower Duration (Minutes)', type: 'number', defaultValue: 8, min: 1 },
      { id: 'dishwasherRounds', label: 'Dishwasher Cycles Loaded per Week', type: 'number', defaultValue: 4, min: 0 },
      { id: 'outdoorHoseMinutes', label: 'Weekly Garden Hose Watering Time (Minutes)', type: 'number', defaultValue: 15, min: 0 }
    ],
    faq: [
      { question: 'What is the average shower flow rate?', answer: 'Standard modern showerheads use about 2.5 gallons per minute (GPM), while high-efficiency heads use 1.8 GPM or less.' }
    ],
    relatedSlugs: ['env-carbon-footprint', 'recycling-impact-calc', 'plastic-waste-calc'],
    seoTitle: 'Household Water Footprint & Conservation Calculator',
    seoDescription: 'Track household water usage across indoor and outdoor activities to identify conservation opportunities.',
    calculate: (inputs) => {
      const showers = Number(inputs.showerCount || 14);
      const duration = Number(inputs.showerDuration || 8);
      const dish = Number(inputs.dishwasherRounds || 4);
      const outdoor = Number(inputs.outdoorHoseMinutes || 15);

      // Average flow rates: Shower: 2.1 gpm. Dishwasher: 5 gal/cycle. Hose: 6 gpm.
      const showerVolume = showers * duration * 2.1;
      const dishVolume = dish * 5;
      const hoseVolume = outdoor * 6.0;

      const totalGallonsWeek = showerVolume + dishVolume + hoseVolume;

      return {
        results: [
          { label: 'Weekly Water Consumption', value: `${Math.round(totalGallonsWeek)} gallons`, isPrimary: true },
          { label: 'Daily Average Water Consumption', value: `${(totalGallonsWeek / 7).toFixed(1)} gallons`, isPrimary: true },
          { label: 'Weekly Shower Consumption Share', value: `${((showerVolume / totalGallonsWeek) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'recycling-impact-calc',
    name: 'Recycling Environmental Impact Calculator',
    slug: 'recycling-impact-calc',
    category: 'environment',
    description: 'Calculate resource savings (trees, water, energy) achieved through recycling paper, glass, and aluminum.',
    formula: 'Energy Saved = Recycled Weight * Material Energy Factor',
    explanation: 'Quantifies the environmental benefits of recycling, showing resource savings across key materials.',
    example: 'E.g., Recycling 15 lbs of aluminum cans and 50 lbs of cardboard boxes.',
    inputs: [
      { id: 'plasticLbs', label: 'Recycled Plastic Weight (lbs)', type: 'number', defaultValue: 25, min: 0 },
      { id: 'paperLbs', label: 'Recycled Paper / Cardboard Weight (lbs)', type: 'number', defaultValue: 80, min: 0 },
      { id: 'aluminumLbs', label: 'Recycled aluminum Cans Weight (lbs)', type: 'number', defaultValue: 15, min: 0 }
    ],
    faq: [
      { question: 'Why does recycling aluminum save so much energy?', answer: 'Recycling aluminum saves about 95% of the energy needed to produce new metal from raw bauxite ore.' }
    ],
    relatedSlugs: ['env-carbon-footprint', 'water-footprint-calc', 'plastic-waste-calc'],
    seoTitle: 'Landfill Diversion & Recycling Resource Calculator',
    seoDescription: 'Calculate the environmental benefits of your recycling efforts, tracking energy, water, and landfill space saved.',
    calculate: (inputs) => {
      const plastic = Number(inputs.plasticLbs || 25);
      const paper = Number(inputs.paperLbs || 80);
      const al = Number(inputs.aluminumLbs || 15);

      // Coefficients: 1 lb paper saves 0.0085 trees, 3 gal water. 1 lb Al saves 7 kWh. 1 lb plastic saves 1.5 kWh.
      const treesSaved = paper * 0.0085;
      const waterSaved = paper * 3.0; // gallons
      const energySaved = (al * 7.0) + (plastic * 1.5) + (paper * 1.8); // kWh

      return {
        results: [
          { label: 'Estimated Energy Saved', value: `${energySaved.toFixed(1)} kWh`, isPrimary: true },
          { label: 'Forest Trees Preserved', value: `${treesSaved.toFixed(2)} trees`, isPrimary: true },
          { label: 'Water Conserved', value: `${Math.round(waterSaved)} gallons` }
        ]
      };
    }
  },
  {
    id: 'plastic-waste-calc',
    name: 'Personal Plastic Waste Footprint Calculator',
    slug: 'plastic-waste-calc',
    category: 'environment',
    description: 'Calculate your yearly plastic waste generation and see your landfill accumulation metrics.',
    formula: 'Plastic Waste per Year = sum(Disposable plastic count * Unit Weight * 365)',
    explanation: 'Tracks personal plastic consumption, helping users identify modifications to reduce plastic waste.',
    example: 'E.g., Consuming 5 single-use plastic water bottles weekly.',
    inputs: [
      { id: 'waterBottlesWeekly', label: 'Single-Use Water Bottles Used per Week', type: 'number', defaultValue: 6, min: 0 },
      { id: 'plasticBagsWeekly', label: 'Generic Grocery Plastic Bags Used per Week', type: 'number', defaultValue: 8, min: 0 },
      { id: 'takeawayContainersWeekly', label: 'Disposable Food Containers used per Week', type: 'number', defaultValue: 3, min: 0 }
    ],
    faq: [
      { question: 'What percentage of plastic is actually recycled?', answer: 'Global estimates show that only about 9% of all plastic waste generated is successfully recycled. The remaining 91% ends up in landfills, incinerators, or natural ecosystems.' }
    ],
    relatedSlugs: ['env-carbon-footprint', 'water-footprint-calc', 'recycling-impact-calc'],
    seoTitle: 'Personal Plastic Waste Landfill Footprint Calculator',
    seoDescription: 'Track your annual plastic waste footprints and find simple daily steps to reduce single-use plastic consumption.',
    calculate: (inputs) => {
      const bottles = Number(inputs.waterBottlesWeekly || 6);
      const bags = Number(inputs.plasticBagsWeekly || 8);
      const containers = Number(inputs.takeawayContainersWeekly || 3);

      // Weights: Bottle: 15g. Bag: 8g. Container: 25g.
      const weeklyWeightGrames = (bottles * 15) + (bags * 8) + (containers * 25);
      const annualWeightKg = (weeklyWeightGrames * 52) / 1000;
      const annualWeightLbs = annualWeightKg * 2.2046;

      return {
        results: [
          { label: 'Yearly Plastic Waste Generated', value: `${annualWeightLbs.toFixed(2)} lbs`, unit: 'plastic / year', isPrimary: true },
          { label: 'Equivalent Mass in Kilograms', value: `${annualWeightKg.toFixed(2)} kg`, isPrimary: true },
          { label: 'Est. 10-Year Plastic Landfill Load', value: `${(annualWeightLbs * 10).toFixed(0)} lbs` }
        ]
      };
    }
  }
];
