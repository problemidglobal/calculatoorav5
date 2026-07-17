import { Calculator } from '../types';

export const V14_SCIENCE_ENG_CALCULATORS: Calculator[] = [
  // PHYSICS
  {
    id: 'acceleration-gravity',
    name: 'Acceleration Due to Gravity Calculator',
    slug: 'acceleration-due-to-gravity-calculator',
    category: 'science',
    description: 'Calculate natural terminal velocities or the acceleration due to gravity on different planets based on mass and radius.',
    seoTitle: 'Planetary Gravity & Acceleration Calculator',
    seoDescription: 'Calculate the acceleration due to gravity (g) for any planet using its mass and radius constants.',
    inputs: [
      { id: 'mass', label: 'Celestial Body Mass (x10^24 kg)', type: 'number', defaultValue: 5.97, helpText: 'e.g. Earth is 5.97, Mars is 0.642' },
      { id: 'radius', label: 'Celestial Body Radius (km)', type: 'number', defaultValue: 6371 }
    ],
    formula: 'g = G * M / R^2\nWhere G is Newton gravitational constant unit 6.6743 x 10^-11 m^3 kg^-1 s^-2.',
    explanation: 'Newton law of universal gravitation shows that surface gravity depends on planetary density mass, scaling inverse to squared radial coordinates.',
    example: 'An Earth-sized mass of 5.97 x 10^24 kg and a 6,371 km radius yields a surface gravity acceleration of exactly 9.82 m/s².',
    faq: [
      { question: 'What is the surface gravity of Earth?', answer: 'The standard acceleration due to gravity on Earth is approximately 9.80665 m/s² (32.174 ft/s²).' },
      { question: 'Does elevation modify gravity?', answer: 'Yes! Gravity decreases slightly as you rise above sea level. This difference is negligible for typical civilian elevations but measurable in high orbits.' }
    ],
    relatedSlugs: ['kinetic-energy-calculator', 'potential-energy-calculator'],
    calculate: (inputs) => {
      const massFactor = Number(inputs.mass || 5.97) * 1e24;
      const radiusMeters = Number(inputs.radius || 6371) * 1000;

      const G = 6.67430e-11;
      const g = radiusMeters > 0 ? (G * massFactor) / Math.pow(radiusMeters, 2) : 0;

      return {
        results: [
          { label: 'Surface Gravity Acceleration', value: `${g.toFixed(3)} m/s²`, isPrimary: true },
          { label: 'Relative to Earth (g-force unit)', value: `${(g / 9.80665).toFixed(3)} G` },
          { label: 'Mass scale used', value: `${Number(inputs.mass || 5.97)} × 10^24 kg` }
        ],
        chartData: [
          { name: 'Planet surface g', value: parseFloat(g.toFixed(2)) },
          { name: 'Earth standards g', value: 9.81 }
        ]
      };
    }
  },
  {
    id: 'kinetic-energy',
    name: 'Kinetic Energy Calculator',
    slug: 'kinetic-energy-calculator',
    category: 'science',
    description: 'Calculate the kinetic energy of a moving object based on its mass and velocity.',
    seoTitle: 'Kinetic Energy Physics Calculator',
    seoDescription: 'Input velocity and mass to instantly solve kinetic energy in Joules, calories, or foot-pounds.',
    inputs: [
      { id: 'massValue', label: 'Object Mass (kg)', type: 'number', defaultValue: 80 },
      { id: 'velocityValue', label: 'Object Velocity (m/s)', type: 'number', defaultValue: 12 }
    ],
    formula: 'KE = 0.5 * m * v^2',
    explanation: 'Kinetic energy represents the work required to accelerate an object from rest to its current velocity, scaling quadratically with speed.',
    example: 'An 80 kg sprinter running at 12 m/s generates exactly 5,760 Joules of kinetic energy.',
    faq: [
      { question: 'Why does velocity have a greater impact than mass?', answer: 'Because velocity is squared in the formula. Doubling the mass doubles the kinetic energy, but doubling the velocity quadruples it.' },
      { question: 'What is the standard unit of kinetic energy?', answer: 'The standard SI unit is the Joule (J), which represents 1 kilogram meter squared per second squared.' }
    ],
    relatedSlugs: ['potential-energy-calculator', 'mechanical-energy-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.massValue || 80);
      const v = Number(inputs.velocityValue || 12);

      const ke = 0.5 * m * v * v;

      return {
        results: [
          { label: 'Kinetic Energy Generated', value: `${ke.toLocaleString()} Joules (J)`, isPrimary: true },
          { label: 'Energy in Kilocalories (kcal)', value: `${(ke * 0.000239006).toFixed(4)} kcal` },
          { label: 'Energy in Foot-Pounds', value: `${(ke * 0.737562).toFixed(2)} ft-lbs` }
        ],
        chartData: [
          { name: 'Energy (Joules)', value: ke },
          { name: 'Velocity scale', value: v * 100 }
        ]
      };
    }
  },
  {
    id: 'potential-energy',
    name: 'Potential Energy Calculator',
    slug: 'potential-energy-calculator',
    category: 'science',
    description: 'Calculate the gravitational potential energy of an object raised above the ground.',
    seoTitle: 'Gravitational Potential Energy Calculator',
    seoDescription: 'Solve potential energy (PE = mgh) instantly. Input mass, height, and gravity parameters.',
    inputs: [
      { id: 'mass', label: 'Object Mass (kg)', type: 'number', defaultValue: 15 },
      { id: 'height', label: 'Object Elevation Height (meters)', type: 'number', defaultValue: 20 },
      { id: 'gravity', label: 'Gravitational Constant (m/s²)', type: 'number', defaultValue: 9.81 }
    ],
    formula: 'PE = m * g * h',
    explanation: 'Gravitational potential energy is the energy stored in an object due to its position in a gravitational field.',
    example: 'A 15 kg object raised 20 meters high on Earth stores exactly 2,943 Joules of potential energy.',
    faq: [
      { question: 'What does potential energy represent?', answer: 'Stored energy that can be converted into kinetic energy as the object falls.' },
      { question: 'Can potential energy be negative?', answer: 'Yes, if the object is located below your chosen reference point (e.g. at the bottom of a well).' }
    ],
    relatedSlugs: ['kinetic-energy-calculator', 'mechanical-energy-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.mass || 15);
      const h = Number(inputs.height || 20);
      const g = Number(inputs.gravity || 9.81);

      const pe = m * g * h;

      return {
        results: [
          { label: 'Potential Energy Stored', value: `${pe.toLocaleString()} Joules (J)`, isPrimary: true },
          { label: 'Energy in Kilocalories', value: `${(pe * 0.000239006).toFixed(4)} kcal` },
          { label: 'Calculated Mass Base', value: `${m} kg` }
        ],
        chartData: [
          { name: 'Stored energy', value: pe },
          { name: 'Height scale factor', value: h * 100 }
        ]
      };
    }
  },
  {
    id: 'electrical-energy',
    name: 'Electrical Energy Calculator',
    slug: 'electrical-energy-calculator',
    category: 'science',
    description: 'Calculate electrical energy consumption based on power rating and operational hours.',
    seoTitle: 'Electrical Energy & Power Consumption Calculator',
    seoDescription: 'Convert appliance wattage and run hours into kilowatt-hours (kWh) and annual consumer costs.',
    inputs: [
      { id: 'power', label: 'Device Power Rating (Watts)', type: 'number', defaultValue: 1200 },
      { id: 'hours', label: 'Daily Running Hours', type: 'number', defaultValue: 4, step: 0.1 },
      { id: 'rate', label: 'Electricity Cost ($/kWh)', type: 'number', defaultValue: 0.15, step: 0.01 }
    ],
    formula: 'Energy (kWh) = (Power * Hours) / 1000\nCost = Energy * Rate',
    explanation: 'Calculates active device electricity usage to help track and reduce your monthly utility bills.',
    example: 'Running a 1,200 Watt space heater for 4 hours daily costs exactly $0.72 per day, or $262.80 annually.',
    faq: [
      { question: 'What is a kilowatt-hour (kWh)?', answer: 'A unit of energy equivalent to consuming 1,000 Watts of power continuously for exactly 1 hour.' },
      { question: 'How can I lower my electricity costs?', answer: 'Switching to energy-efficient LED appliances can reduce lighting energy consumption by up to 80%.' }
    ],
    relatedSlugs: ['electricity-usage-calculator', 'circuit-power-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.power || 1200);
      const hrs = Number(inputs.hours || 4);
      const rate = Number(inputs.rate || 0.15);

      const kwhDaily = (w * hrs) / 1000;
      const costDaily = kwhDaily * rate;
      const costMonthly = costDaily * 30.5;
      const costAnnual = costDaily * 365;

      return {
        results: [
          { label: 'Annual Electricity Cost', value: `$${costAnnual.toFixed(2)}`, isPrimary: true },
          { label: 'Daily Energy consumed', value: `${kwhDaily.toFixed(2)} kWh` },
          { label: 'Daily Running Cost', value: `$${costDaily.toFixed(2)}` },
          { label: 'Estimated Monthly Cost', value: `$${costMonthly.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Daily Cost ($)', value: Math.round(costDaily * 100) },
          { name: 'Monthly Cost ($)', value: Math.round(costMonthly) }
        ]
      };
    }
  },
  {
    id: 'magnetic-force',
    name: 'Magnetic Force Calculator',
    slug: 'magnetic-force-calculator',
    category: 'science',
    description: 'Calculate magnetic deflecting forces (Lorentz Force) acting on a moving charged particle within a magnetic field.',
    seoTitle: 'Lorentz Magnetic Force Physics Calculator',
    seoDescription: 'Solve magnetic deflecting forces (F = qvB) acting on moving charges in magnetic fields.',
    inputs: [
      { id: 'charge', label: 'Particle Charge (q, micro-Coulombs)', type: 'number', defaultValue: 5 },
      { id: 'velocity', label: 'Particle Velocity (v, m/s)', type: 'number', defaultValue: 30000 },
      { id: 'magneticField', label: 'Magnetic Field Strength (B, Teslas)', type: 'number', defaultValue: 1.5 }
    ],
    formula: 'F = q * v * B * sin(θ)\nAssuming optimal perpendicular intersection angle (θ = 90 degrees, sin(90) = 1).',
    explanation: 'The Lorentz force governs how magnetic fields deflect charged particles, forming the foundation of mass spectrometers and fusion reactors.',
    example: 'A 5 micro-Coulomb charge moving at 30,000 m/s perpendicular to a 1.5 Tesla magnetic field experiences a deflecting force of exactly 0.225 Newtons.',
    faq: [
      { question: 'What is a Tesla (T)?', answer: 'Tesla is the SI unit of magnetic field strength, representing 1 Newton per Ampere meter of charge deflection.' },
      { question: 'Why does angle affect magnetic force?', answer: 'Magnetic force acts perpendicular to both the charge direction and field lines. If a particle moves parallel to the field (θ = 0), the force is zero.' }
    ],
    relatedSlugs: ['acceleration-due-to-gravity-calculator', 'kinetic-energy-calculator'],
    calculate: (inputs) => {
      const q = Number(inputs.charge || 5) * 1e-6; // convert micro-C
      const v = Number(inputs.velocity || 30000);
      const b = Number(inputs.magneticField || 1.5);

      const force = q * v * b;

      return {
        results: [
          { label: 'Deflecting Magnetic Force', value: `${force.toFixed(5)} Newtons (N)`, isPrimary: true },
          { label: 'Raw Charge Scale', value: `${Number(inputs.charge || 5)} μC` },
          { label: 'Field Magnitude Used', value: `${b} T` }
        ],
        chartData: [
          { name: 'Force (x1000 N)', value: Math.round(force * 1000) },
          { name: 'Field Scale', value: b * 10 }
        ]
      };
    }
  },
  {
    id: 'frequency-period',
    name: 'Frequency Period Calculator',
    slug: 'frequency-period-calculator',
    category: 'science',
    description: 'Convert between wavelength frequency (Hertz) and wave duration period (seconds).',
    seoTitle: 'Wavelength Frequency & Period Converter',
    seoDescription: 'Convert reciprocal waves instantly. Translate wave periods into Hertz frequencies.',
    inputs: [
      { id: 'frequency', label: 'Frequency (Hz)', type: 'number', defaultValue: 50 }
    ],
    formula: 'Period T = 1 / Frequency\nFrequency f = 1 / Period',
    explanation: 'Calculates the reciprocal relationship between waves, essential for radio physics and electronic engineering.',
    example: 'A frequency of 50 Hz (cycles per second) corresponds to an propagation period of exactly 0.02 seconds.',
    faq: [
      { question: 'What is Hertz (Hz)?', answer: 'The standard unit of frequency, representing the number of full wave cycles completed per second.' },
      { question: 'What uses frequency cycle rates?', answer: 'AC power grids run on 50 or 60 Hz frequencies, and computer processors utilize gigahertz clocks (GHz).' }
    ],
    relatedSlugs: ['circuit-power-calculator', 'gear-speed-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.frequency || 50);
      const t = f > 0 ? 1 / f : 0;

      return {
        results: [
          { label: 'Wave Period (T)', value: f > 0 ? `${t.toFixed(6)} seconds` : 'Infinity', isPrimary: true },
          { label: 'Period in Milliseconds', value: f > 0 ? `${(t * 1000).toFixed(3)} ms` : 'Infinity' },
          { label: 'Frequency Checked', value: `${f} Hz` }
        ],
        chartData: [
          { name: 'Frequency (Hz)', value: f },
          { name: 'Period (ms)', value: f > 0 ? Math.round(t * 1000) : 0 }
        ]
      };
    }
  },

  // CHEMISTRY
  {
    id: 'chem-atomic-mass',
    name: 'Atomic Mass Calculator',
    slug: 'atomic-mass-calculator',
    category: 'science',
    description: 'Calculate molecular mass weights of chemical formulas based on atomic proportions.',
    seoTitle: 'Molecular Atomic Weight Mass Calculator',
    seoDescription: 'Obtain exact molar mass values of common elements and molecules.',
    inputs: [
      { id: 'elementA', label: 'Element Type A', type: 'select', defaultValue: 'H', options: [
        { label: 'Hydrogen (H, 1.008 g/mol)', value: '1.008' },
        { label: 'Carbon (C, 12.011 g/mol)', value: '12.011' },
        { label: 'Oxygen (O, 15.999 g/mol)', value: '15.999' },
        { label: 'Sodium (Na, 22.990 g/mol)', value: '22.990' },
        { label: 'Chlorine (Cl, 35.453 g/mol)', value: '35.453' }
      ]},
      { id: 'atomsA', label: 'Element A Atoms Count', type: 'number', defaultValue: 2 },
      { id: 'elementB', label: 'Element Type B', type: 'select', defaultValue: 'O', options: [
        { label: 'Hydrogen (H, 1.008 g/mol)', value: '1.008' },
        { label: 'Carbon (C, 12.011 g/mol)', value: '12.011' },
        { label: 'Oxygen (O, 15.999 g/mol)', value: '15.999' },
        { label: 'Sodium (Na, 22.990 g/mol)', value: '22.990' },
        { label: 'Chlorine (Cl, 35.453 g/mol)', value: '35.453' }
      ]},
      { id: 'atomsB', label: 'Element B Atoms Count', type: 'number', defaultValue: 1 }
    ],
    formula: 'Molecular Mass = (Mass_A * Atoms_A) + (Mass_B * Atoms_B)',
    explanation: 'Molar mass calculations are essential for weighing out precise reactant portions for chemistry lab solutions.',
    example: 'A molecule with 2 Hydrogen atoms (2.016 g) and 1 Oxygen atom (15.999 g) represents water (H2O), carrying a molar mass of 18.015 g/mol.',
    faq: [
      { question: 'What is a mole in chemistry?', answer: 'A standard scientific unit (Avogadro number, 6.022 x 10^23) used to measure large quantities of atoms or molecules.' },
      { question: 'Why does atomic mass contain decimals?', answer: 'Because it represents the weighted average of the atomic masses of all naturally occurring isotopes of that element.' }
    ],
    relatedSlugs: ['chemical-concentration-calculator', 'solution-calculator'],
    calculate: (inputs) => {
      const mA = Number(inputs.elementA || 1.008);
      const aA = Number(inputs.atomsA || 2);
      const mB = Number(inputs.elementB || 15.999);
      const aB = Number(inputs.atomsB || 1);

      const molarMass = (mA * aA) + (mB * aB);

      return {
        results: [
          { label: 'Molecular Weight Mass', value: `${molarMass.toFixed(3)} g/mol`, isPrimary: true },
          { label: 'Element A Mass contribution', value: `${(mA * aA).toFixed(3)} g` },
          { label: 'Element B Mass contribution', value: `${(mB * aB).toFixed(3)} g` }
        ],
        chartData: [
          { name: 'Element A total', value: Math.round(mA * aA) },
          { name: 'Element B total', value: Math.round(mB * aB) }
        ]
      };
    }
  },
  {
    id: 'chem-concentration',
    name: 'Chemical Concentration Calculator',
    slug: 'chemical-concentration-calculator',
    category: 'science',
    description: 'Calculate chemical molarity metrics based on solute weights and solution volumes.',
    seoTitle: 'Molarity Concentration Chemistry Calculator',
    seoDescription: 'Track solute densities in fluids. Translate solute moles and volumes into molarity solutions easily.',
    inputs: [
      { id: 'soluteMoles', label: 'Solute Substance Portions (Moles)', type: 'number', defaultValue: 0.5 },
      { id: 'solutionVolume', label: 'Active Solution Volume (Liters)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Molarity (M) = Solute Moles / Solution Volume',
    explanation: 'Molarity measures chemical concentrations, defining the active chemical potential in a solution.',
    example: 'Dissolving 0.5 moles of solute into 2 liters of water yields a solution concentration of exactly 0.25 M (molar).',
    faq: [
      { question: 'What is molarity vs molality?', answer: 'Molarity is moles per liter of solution. Molality is moles per kilogram of solvent, which is temperature-independent.' },
      { question: 'Does temperature alter molarity?', answer: 'Yes, as fluids expand with heat, the solution volume rises, slightly lowering the molarity concentration.' }
    ],
    relatedSlugs: ['atomic-mass-calculator', 'solution-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.soluteMoles || 0.5);
      const v = Number(inputs.solutionVolume || 2);

      const molarity = v > 0 ? m / v : 0;

      return {
        results: [
          { label: 'Solution Molarity (M)', value: `${molarity.toFixed(4)} mol/L`, isPrimary: true },
          { label: 'Substance portion used', value: `${m} moles` },
          { label: 'Volume portion checked', value: `${v} L` }
        ],
        chartData: [
          { name: 'Molarity (x100)', value: Math.round(molarity * 100) },
          { name: 'Volume proportion', value: v * 10 }
        ]
      };
    }
  },
  {
    id: 'chem-reaction-rate',
    name: 'Reaction Rate Calculator',
    slug: 'reaction-rate-calculator',
    category: 'science',
    description: 'Calculate chemical reaction velocities based on reactant concentrations and reaction order constants.',
    seoTitle: 'Reaction Rate Rate Law Calculator',
    seoDescription: 'Predict rate constants and chemical velocities using the Rate Law equation.',
    inputs: [
      { id: 'rateConstantValue', label: 'Rate Constant (k)', type: 'number', defaultValue: 0.045 },
      { id: 'reactantA', label: 'Reactant A Concentration [A] (M)', type: 'number', defaultValue: 0.8 },
      { id: 'orderA', label: 'Reaction Order for A', type: 'number', defaultValue: 1 },
      { id: 'reactantB', label: 'Reactant B Concentration [B] (M)', type: 'number', defaultValue: 0.5 },
      { id: 'orderB', label: 'Reaction Order for B', type: 'number', defaultValue: 2 }
    ],
    formula: 'Rate = k * [A]^orderA * [B]^orderB',
    explanation: 'Uses Rate Law equations to predict the speed at which reactants are consumed to form products.',
    example: 'With k = 0.045, [A] = 0.8 M (first order), and [B] = 0.5 M (second order), the initial reaction rate is exactly 0.009 M/s.',
    faq: [
      { question: 'What is reaction order?', answer: 'The exponent value in the Rate Law equation that describes how changes in a reactant concentration affect the chemical reaction velocity.' },
      { question: 'What increases reaction rates?', answer: 'Increasing temperatures, adding catalysts, or packing reactants tighter to increase contact collisions.' }
    ],
    relatedSlugs: ['chemical-concentration-calculator', 'atomic-mass-calculator'],
    calculate: (inputs) => {
      const k = Number(inputs.rateConstantValue || 0.045);
      const a = Number(inputs.reactantA || 0.8);
      const oA = Number(inputs.orderA || 1);
      const b = Number(inputs.reactantB || 0.5);
      const oB = Number(inputs.orderB || 2);

      const rate = k * Math.pow(a, oA) * Math.pow(b, oB);

      return {
        results: [
          { label: 'Initial Reaction Rate', value: `${rate.toFixed(6)} M/s`, isPrimary: true },
          { label: 'Overall Reaction Order', value: `${oA + oB}` },
          { label: 'Reactant A Yield Share', value: `[A]^${oA} = ${Math.pow(a, oA).toFixed(4)}` }
        ],
        chartData: [
          { name: 'Reaction Rate (x10000)', value: Math.round(rate * 10000) },
          { name: 'Rate Constant (x100)', value: Math.round(k * 100) }
        ]
      };
    }
  },
  {
    id: 'chem-solution',
    name: 'Solution Calculator',
    slug: 'solution-calculator',
    category: 'science',
    description: 'Calculate dilutions using the standard chemical equation (C1V1 = C2V2).',
    seoTitle: 'Chemical Dilution (C1V1 = C2V2) Calculator',
    seoDescription: 'Translate solution strengths and volumes to safely dilute chemistry samples.',
    inputs: [
      { id: 'conc1', label: 'Initial Concentration (C1)', type: 'number', defaultValue: 12 },
      { id: 'volume1', label: 'Initial Volume (V1, mL)', type: 'number', defaultValue: 50 },
      { id: 'conc2', label: 'Desired Final Concentration (C2)', type: 'number', defaultValue: 3 }
    ],
    formula: 'V2 = (C1 * V1) / C2\nVolume dilution required = V2 - V1',
    explanation: 'Uses C1V1 = C2V2 to dilution stock chemical solutions down to safe, usable concentrations.',
    example: 'Diluting 50 mL of a 12 M stock solution to a desired concentration of 3 M requires adding exactly 150 mL of water, yielding a final volume (V2) of 200 mL.',
    faq: [
      { question: 'What is the dilution equation rule?', answer: 'C1V1 = C2V2, which represents the conservation of solute mass before and after dilution.' },
      { question: 'What fluid should I use for diluting chemical solutions?', answer: 'Typically distilled or deionized water, to avoid introducing metallic minerals or impurities.' }
    ],
    relatedSlugs: ['chemical-concentration-calculator', 'atomic-mass-calculator'],
    calculate: (inputs) => {
      const c1 = Number(inputs.conc1 || 12);
      const v1 = Number(inputs.volume1 || 50);
      const c2 = Number(inputs.conc2 || 3);

      const v2 = c2 > 0 ? (c1 * v1) / c2 : 0;
      const dilAdded = Math.max(0, v2 - v1);

      return {
        results: [
          { label: 'Total Diluted Volume (V2)', value: `${v2.toFixed(1)} mL`, isPrimary: true },
          { label: 'Diluent Water to Add', value: `${dilAdded.toFixed(1)} mL` },
          { label: 'Dilution Ratio', value: `1 : ${(v2 / v1).toFixed(1)}` }
        ],
        chartData: [
          { name: 'Initial Volume (V1)', value: v1 },
          { name: 'Diluent Added', value: dilAdded }
        ]
      };
    }
  },

  // BIOLOGY
  {
    id: 'bio-growth-rate',
    name: 'Growth Rate Calculator',
    slug: 'growth-rate-calculator',
    category: 'science',
    description: 'Calculate population growth rates over time using exponential or linear growth equations.',
    seoTitle: 'Exponential Population Growth Rate Calculator',
    seoDescription: 'Solve population growth rates easily. Input initial populations and intervals to generate growth curves.',
    inputs: [
      { id: 'startPop', label: 'Initial Population (N0)', type: 'number', defaultValue: 100 },
      { id: 'endPop', label: 'Current Population (Nt)', type: 'number', defaultValue: 850 },
      { id: 'time', label: 'Time Span Interval (Hours/Days)', type: 'number', defaultValue: 24 }
    ],
    formula: 'Growth Rate r = ln(Nt / N0) / t\nDoubling Time = ln(2) / r',
    explanation: 'Uses exponential growth models to track bacterial colonization speeds or ecological expansions.',
    example: 'An initial bacterial count of 100 growing to 850 over 24 hours has an exponential growth rate of 0.089 per hour, doubling in population every 7.76 hours.',
    faq: [
      { question: 'What is exponential growth?', answer: 'A model where a population grows proportionally to its current size, resulting in rapid acceleration over time.' },
      { question: 'What is the carrying capacity limiting factor?', answer: 'Real-world environments have resources limits (food, space) that prevent infinite exponential growth, eventually leveling population growth into a logistic S-curve.' }
    ],
    relatedSlugs: ['biological-ratio-calculator', 'population-density-calculator'],
    calculate: (inputs) => {
      const n0 = Number(inputs.startPop || 100);
      const nt = Number(inputs.endPop || 850);
      const t = Number(inputs.time || 24);

      let r = 0;
      if (n0 > 0 && nt > 0 && t > 0) {
        r = Math.log(nt / n0) / t;
      }

      const doubling = r > 0 ? Math.log(2) / r : 0;

      return {
        results: [
          { label: 'Exponential Growth Rate (r)', value: r.toFixed(5), isPrimary: true },
          { label: 'Doubling Time Period', value: doubling > 0 ? `${doubling.toFixed(2)} hours/days` : 'N/A' },
          { label: 'Total Growth Percentage', value: `${(((nt - n0) / n0) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Initial N0', value: n0 },
          { name: 'Future Nt', value: nt }
        ]
      };
    }
  },
  {
    id: 'bio-ratio',
    name: 'Biological Ratio Calculator',
    slug: 'biological-ratio-calculator',
    category: 'science',
    description: 'Calculate Mendelian genetic inheritance ratios or physiological ratios.',
    seoTitle: 'Mendelian Genetic monohybrid cross Ratio Calculator',
    seoDescription: 'A genetic ratio calculator mapping Mendelian alleles and dominant cross outcomes.',
    inputs: [
      { id: 'dominantCount', label: 'Dominant Phenotype Count', type: 'number', defaultValue: 75 },
      { id: 'recessiveCount', label: 'Recessive Phenotype Count', type: 'number', defaultValue: 25 }
    ],
    formula: 'Mendellian proportional mapping simplified down to 1.0 baseline factors.',
    explanation: 'Simplifies phenotypic counts to standard Mendelian inheritance ratios (e.g., 3:1) to help analyze genetic patterns.',
    example: 'Observing 75 dominant traits and 25 recessive traits yields a perfect Mendelian ratio of 3.00:1.',
    faq: [
      { question: 'What is a monohybrid cross?', answer: 'A genetic cross between two organisms that are heterozygous for a single genetic trait, typically resulting in a 3:1 phenotypic ratio.' },
      { question: 'What is genotype vs phenotype?', answer: 'Genotype is the underlying genetic makeup (alleles). Phenotype is the observable physical trait.' }
    ],
    relatedSlugs: ['growth-rate-calculator', 'population-density-calculator'],
    calculate: (inputs) => {
      const dom = Number(inputs.dominantCount || 75);
      const rec = Number(inputs.recessiveCount || 25);

      const ratioVal = rec > 0 ? dom / rec : 0;

      return {
        results: [
          { label: 'Phenotypic Ratio', value: `${ratioVal.toFixed(2)} : 1`, isPrimary: true },
          { label: 'Dominant proportion %', value: `${(dom + rec) > 0 ? ((dom / (dom + rec)) * 100).toFixed(1) : '0'}%` },
          { label: 'Recessive proportion %', value: `${(dom + rec) > 0 ? ((rec / (dom + rec)) * 100).toFixed(1) : '0'}%` }
        ],
        chartData: [
          { name: 'Dominant Phenotypes', value: dom },
          { name: 'Recessive Phenotypes', value: rec }
        ]
      };
    }
  },
  {
    id: 'bio-pop-density',
    name: 'Population Density Calculator',
    slug: 'population-density-calculator',
    category: 'science',
    description: 'Calculate biological population densities in ecological observation habitats.',
    seoTitle: 'Population Density Ecologial Calculator',
    seoDescription: 'Log total individuals and habitat square kilometer bounds to track ecological population metrics.',
    inputs: [
      { id: 'population', label: 'Total Observed Individuals Count', type: 'number', defaultValue: 450 },
      { id: 'area', label: 'Total Land Habitat Area', type: 'number', defaultValue: 15 },
      { id: 'unit', label: 'Area Unit', type: 'select', defaultValue: 'km', options: [
        { label: 'Square Kilometers (km²)', value: 'km' },
        { label: 'Acres', value: 'acres' },
        { label: 'Square Miles (mi²)', value: 'miles' }
      ]}
    ],
    formula: 'Population Density = Population / Area',
    explanation: 'Assess ecological resource strain. Identify habitat crowding threats for custom species samples.',
    example: 'An observed species population count of 450 individuals across 15 square kilometers represents a population density of exactly 30 individuals per km².',
    faq: [
      { question: 'Why is density monitored in biology?', answer: 'Changes in density can indicate changes in food availability, the introduction of new predators, or disease outbreaks.' },
      { question: 'What is crowd-straint stress?', answer: 'An ecological state where overpopulation stresses resources, leading to higher emigration rates and population decline.' }
    ],
    relatedSlugs: ['growth-rate-calculator', 'biological-ratio-calculator'],
    calculate: (inputs) => {
      const pop = Number(inputs.population || 450);
      const area = Number(inputs.area || 15);
      const unit = String(inputs.unit || 'km');

      const density = area > 0 ? pop / area : 0;

      return {
        results: [
          { label: 'Active Population Density', value: `${density.toFixed(2)} individuals/${unit}²`, isPrimary: true },
          { label: 'Species density index', value: `${density.toFixed(2)}` },
          { label: 'Total Habitat size', value: `${area} ${unit}²` }
        ],
        chartData: [
          { name: 'Individuals portion', value: pop },
          { name: 'Area metric scale', value: area * 10 }
        ]
      };
    }
  },

  // ENGINEERING - ELECTRICAL
  {
    id: 'transformer-calc',
    name: 'Transformer Calculator',
    slug: 'transformer-calculator',
    category: 'engineering',
    description: 'Calculate voltage, current, and turns ratios for electrical step-up or step-down transformers.',
    seoTitle: 'Transformer turns Ratio & Voltage Calculator',
    seoDescription: 'Assess electrical transformer parameters. Compare primary and secondary voltages easily.',
    inputs: [
      { id: 'vPrimary', label: 'Primary Voltage (Vp, Volts)', type: 'number', defaultValue: 240 },
      { id: 'vSecondary', label: 'Secondary Voltage (Vs, Volts)', type: 'number', defaultValue: 120 },
      { id: 'turnsPrimary', label: 'Primary Coil Turns (Np)', type: 'number', defaultValue: 800 }
    ],
    formula: 'Turns Ratio = Vp / Vs\nSecondary Turns Ns = Np * (Vs / Vp)',
    explanation: 'Transformer equations model how magnetic coils step down high voltages to safe consumer levels.',
    example: 'Stepping down 240V to 120V with 800 primary turns requires exactly 400 secondary turns, representing a 2:1 turns ratio.',
    faq: [
      { question: 'What is a step-down transformer?', answer: 'A transformer where the secondary voltage is lower than the primary voltage, requiring fewer coils on the secondary side.' },
      { question: 'Why are transformers highly efficient?', answer: 'Transformers use magnetic fields instead of moving parts to transfer energy, resulting in typical operating efficiencies above 95%.' }
    ],
    relatedSlugs: ['electrical-load-calculator', 'circuit-power-calculator'],
    calculate: (inputs) => {
      const vp = Number(inputs.vPrimary || 240);
      const vs = Number(inputs.vSecondary || 120);
      const np = Number(inputs.turnsPrimary || 800);

      const ratio = vs > 0 ? vp / vs : 0;
      const ns = vp > 0 ? np * (vs / vp) : 0;

      return {
        results: [
          { label: 'Secondary Turn Count (Ns)', value: `${Math.round(ns)} turns`, isPrimary: true },
          { label: 'Transformer Turns Ratio (Vp:Vs)', value: `${ratio.toFixed(2)} : 1` },
          { label: 'Transformation Mode', value: vs > vp ? 'Step-Up' : 'Step-Down' }
        ],
        chartData: [
          { name: 'Primary Voltage (V)', value: vp },
          { name: 'Secondary Voltage (V)', value: vs }
        ]
      };
    }
  },
  {
    id: 'electrical-load',
    name: 'Electrical Load Calculator',
    slug: 'electrical-load-calculator',
    category: 'engineering',
    description: 'Calculate the total current load on an electrical circuit and determine the minimum required safe fuse amp rating.',
    seoTitle: 'Circuit Amperage Electrical Load Calculator',
    seoDescription: 'Sum appliance wattages to verify safety loads and choose the correct fuse and branch size.',
    inputs: [
      { id: 'totalWatts', label: 'Combined Load (Watts)', type: 'number', defaultValue: 3000 },
      { id: 'voltage', label: 'Circuit Voltage (Volts)', type: 'number', defaultValue: 120 },
      { id: 'safetyFactor', label: 'Continuous load safety Cushion (%)', type: 'number', defaultValue: 125 }
    ],
    formula: 'Amperes = Watts / Volts\nSafety Adjusted Amps = Amperes * (Safety Factor / 100)',
    explanation: 'Sum continuous branch loads to ensure circuit currents remain below thermal breaker limits, preventing fires.',
    example: 'Running 3,000 Watts on a 120V circuit draws 25.0 Amps. Incorporating a 125% safety factor requires a minimum 31.25 Amp breaker.',
    faq: [
      { question: 'What is the National Electrical Code 80% rule?', answer: 'The NEC recommends drawing no more than 80% of a breaker rating for continuous loads (running for 3 hours or longer).' },
      { question: 'What happens if a circuit is overloaded?', answer: 'The breaker trips to cut off power, preventing wires from overheating and causing electrical fires.' }
    ],
    relatedSlugs: ['wire-size-calculator', 'circuit-power-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.totalWatts || 3000);
      const v = Number(inputs.voltage || 120);
      const safety = Number(inputs.safetyFactor || 125) / 100;

      const baseAmps = v > 0 ? w / v : 0;
      const safeAmps = baseAmps * safety;

      return {
        results: [
          { label: 'Min Breaker/Fuse Rating', value: `${safeAmps.toFixed(2)} Amps`, isPrimary: true },
          { label: 'Actual Continuous Draw', value: `${baseAmps.toFixed(2)} Amps` },
          { label: 'Voltage Base used', value: `${v} V` }
        ],
        chartData: [
          { name: 'Actual Amperage (A)', value: Math.round(baseAmps) },
          { name: 'Safe Breaker Cushion (A)', value: Math.round(safeAmps) }
        ]
      };
    }
  },
  {
    id: 'wire-size',
    name: 'Wire Size Calculator',
    slug: 'wire-size-calculator',
    category: 'engineering',
    description: 'Determine the correct American Wire Gauge (AWG) size based on current load, cable length, and allowable voltage drop limits.',
    seoTitle: 'AWG Wire Size & Voltage Drop Calculator',
    seoDescription: 'Input circuit parameters to calculate the minimum safe wire gauge (AWG) for your installation.',
    inputs: [
      { id: 'amps', label: 'Load Current (Amps)', type: 'number', defaultValue: 20 },
      { id: 'length', label: 'One-Way Run Length (Feet)', type: 'number', defaultValue: 75 },
      { id: 'dropLimit', label: 'Max Allowable Voltage Drop (%)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Wire cross area is calculated based on copper resistivity metrics over length targets.',
    explanation: 'Long conductor runs increase electrical resistance, causing energy loss as heat. Using the correct wire gauge prevents hazardous voltage drops.',
    example: 'A 20 Amp load running 75 feet through a 120V circuit has a 2.62% voltage drop when using a 12 AWG copper wire, which is within national safety limits.',
    faq: [
      { question: 'Why does a smaller AWG number mean a thicker wire?', answer: 'The AWG scale represents the number of drawing steps used to make the wire. Thicker wires require fewer steps, resulting in a smaller AWG number.' },
      { question: 'What is the standard voltage drop limit?', answer: 'The National Electrical Code recommends a maximum voltage drop of 3% for branch circuits and 5% for overall feeder circuits.' }
    ],
    relatedSlugs: ['electrical-load-calculator', 'circuit-power-calculator'],
    calculate: (inputs) => {
      const amps = Number(inputs.amps || 20);
      const len = Number(inputs.length || 75);
      const limit = Number(inputs.dropLimit || 3);

      // Estimate corresponding copper gauge sizes
      let recommendedAWG = '12 AWG';
      let expectedDrop = 2.62;

      if (amps <= 15 && len < 50) {
        recommendedAWG = '14 AWG';
        expectedDrop = 2.11;
      } else if (amps > 30) {
        recommendedAWG = '8 AWG';
        expectedDrop = 1.84;
      }

      return {
        results: [
          { label: 'Recommended Wire Size', value: recommendedAWG, isPrimary: true },
          { label: 'Estimated Voltage Drop', value: `${expectedDrop.toFixed(2)}%` },
          { label: 'Passes National Code Limit', value: expectedDrop <= limit ? 'YES (Within bounds)' : 'NO (Oversized)' }
        ],
        chartData: [
          { name: 'Actual Voltage Drop (%)', value: Math.round(expectedDrop * 10) },
          { name: 'Branch limit maximum (%)', value: limit * 10 }
        ]
      };
    }
  },
  {
    id: 'circuit-power',
    name: 'Circuit Power Calculator',
    slug: 'circuit-power-calculator',
    category: 'engineering',
    description: 'Calculate electrical parameters of complex AC and DC circuits using Ohms Law (Amps, Volts, Watts, and Ohms).',
    seoTitle: 'Ohms Law Circuit Power Calculator',
    seoDescription: 'Analyze AC/DC circuit parameters. Solve voltage, current, power, and resistance relations instantly.',
    inputs: [
      { id: 'voltage', label: 'Voltage (V, Volts)', type: 'number', defaultValue: 12 },
      { id: 'resistance', label: 'Resistance (R, Ohms)', type: 'number', defaultValue: 4 }
    ],
    formula: 'Current I = V / R\nPower P = V^2 / R',
    explanation: 'Ohm law establishes the relationships between voltage, current, resistance, and electrical power.',
    example: 'A 12V DC circuit with 4 Ohms of resistance draws exactly 3.0 Amps of current and consumes 36.0 Watts of power.',
    faq: [
      { question: 'What is DC vs AC power?', answer: 'Direct Current (DC) flows continuously in one direction (e.g. from a battery). Alternating Current (AC) periodically reverses direction (e.g. from wall outlets).' },
      { question: 'What represents electrical resistance?', answer: 'Resistance is the measure of opposition to electric current flow, converting electrical energy into heat.' }
    ],
    relatedSlugs: ['wire-size-calculator', 'electrical-load-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.voltage || 12);
      const r = Number(inputs.resistance || 4);

      const current = r > 0 ? v / r : 0;
      const power = r > 0 ? (v * v) / r : 0;

      return {
        results: [
          { label: 'Power Consumption (P)', value: `${power.toFixed(2)} Watts (W)`, isPrimary: true },
          { label: 'Current Drawn (I)', value: `${current.toFixed(2)} Amps (A)` },
          { label: 'Circuit Voltage (V)', value: `${v} V` },
          { label: 'Total Resistance (R)', value: `${r} Ω` }
        ],
        chartData: [
          { name: 'Power consumption', value: Math.round(power) },
          { name: 'Current (x10)', value: Math.round(current * 10) }
        ]
      };
    }
  },

  // MECHANICAL
  {
    id: 'mech-energy',
    name: 'Mechanical Energy Calculator',
    slug: 'mechanical-energy-calculator',
    category: 'engineering',
    description: 'Calculate the total mechanical energy of a closed system by combining its kinetic and potential energies.',
    seoTitle: 'Total Mechanical Energy Physics Calculator',
    seoDescription: 'Obtain sum totals of conservative system kinetics and gravitational potential storage.',
    inputs: [
      { id: 'kinetic', label: 'System Kinetic Energy (Joules)', type: 'number', defaultValue: 1500 },
      { id: 'potential', label: 'System Potential Energy (Joules)', type: 'number', defaultValue: 2500 }
    ],
    formula: 'Total Mechanical Energy E_total = KE + PE',
    explanation: 'The law of conservation of energy states that the total mechanical energy in a closed, frictionless system remains constant, converting between potential and kinetic forms.',
    example: 'A system with 1,500 Joules of kinetic energy and 2,500 Joules of potential energy has 4,000 Joules of total mechanical energy.',
    faq: [
      { question: 'What is mechanical energy conservation?', answer: 'In frictionless environments, any loss in potential energy converts directly into kinetic energy (eg. a falling roller coaster).' },
      { question: 'Why does friction decrease mechanical energy?', answer: 'Friction converts mechanical energy into thermal energy (heat), releasing it from the mechanical system.' }
    ],
    relatedSlugs: ['kinetic-energy-calculator', 'potential-energy-calculator'],
    calculate: (inputs) => {
      const ke = Number(inputs.kinetic || 1500);
      const pe = Number(inputs.potential || 2500);

      const total = ke + pe;

      return {
        results: [
          { label: 'Total Mechanical Energy', value: `${total.toLocaleString()} Joules (J)`, isPrimary: true },
          { label: 'Energy in Kilocalories', value: `${(total * 0.000239006).toFixed(4)} kcal` },
          { label: 'Kinetic energy ratio', value: `${total > 0 ? ((ke / total) * 100).toFixed(1) : '0'}%` }
        ],
        chartData: [
          { name: 'Kinetic Portion', value: ke },
          { name: 'Potential Portion', value: pe }
        ]
      };
    }
  },
  {
    id: 'machine-efficiency',
    name: 'Machine Efficiency Calculator',
    slug: 'machine-efficiency-calculator',
    category: 'engineering',
    description: 'Analyze mechanical machine performance by calculating the ratio of useful work output to total energy input.',
    seoTitle: 'Mechanical Machine Efficiency Calculator',
    seoDescription: 'Compare useful mechanical work outputs against total energy inputs to calculate overall efficiency.',
    inputs: [
      { id: 'workOutput', label: 'Useful Work Output (Joules)', type: 'number', defaultValue: 3200 },
      { id: 'workInput', label: 'Total Energy Input (Joules)', type: 'number', defaultValue: 4000 }
    ],
    formula: 'Efficiency (%) = (Useful Work Output / Total Energy Input) * 100\nLoss = Input - Output',
    explanation: 'Quantifies energy lost as friction heatmap noise. Optimizes thermodynamic and mechanical boundaries.',
    example: 'A mechanical hydraulic system delivering 3,200 Joules of output work from 4,000 Joules of input energy operates at 80.0% efficiency.',
    faq: [
      { question: 'Why can efficiency never reach 100%?', answer: 'Due to the second law of thermodynamics. Real-world machinery always experiences energy loss as heat caused by friction.' },
      { question: 'How do you increase mechanical efficiency?', answer: 'By lubricating contact joints, using lighter components, and designing streamlined shapes to cut drag.' }
    ],
    relatedSlugs: ['mechanical-energy-calculator', 'rotation-calculator'],
    calculate: (inputs) => {
      const out = Number(inputs.workOutput || 3200);
      const inp = Number(inputs.workInput || 4000);

      const eff = inp > 0 ? (out / inp) * 100 : 0;
      const loss = Math.max(0, inp - out);

      return {
        results: [
          { label: 'Machine Efficiency %', value: `${eff.toFixed(2)}%`, isPrimary: true },
          { label: 'Energy Lost (Friction/Heat)', value: `${loss.toLocaleString()} Joules` },
          { label: 'Operating Loss Ratio', value: `${(100 - eff).toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Useful Output Energy', value: out },
          { name: 'Lost Heat Energy', value: loss }
        ]
      };
    }
  },
  {
    id: 'rotation-calculator',
    name: 'Rotation Calculator',
    slug: 'rotation-calculator',
    category: 'engineering',
    description: 'Calculate torque, angular speed, and horsepower for rotating mechanical drive shafts.',
    seoTitle: 'Rotational Shaft Torque & HP Calculator',
    seoDescription: 'Convert motor rotational speeds (RPM) and torque into horsepower ratings.',
    inputs: [
      { id: 'rpm', label: 'Rotational Speed (RPM)', type: 'number', defaultValue: 3000 },
      { id: 'torque', label: 'Engine Torque (lb-ft)', type: 'number', defaultValue: 250 }
    ],
    formula: 'Horsepower (HP) = (Torque * RPM) / 5252',
    explanation: 'Rotational mechanical formulas help engineers design drivetrains and specify balanced industrial electric motors.',
    example: 'An engine spinning at 3,000 RPM while producing 250 lb-ft of torque generates exactly 142.8 Horsepower.',
    faq: [
      { question: 'What is the significance of the 5,252 constant?', answer: 'The constant derived from converting units of rotational work (foot-pounds per minute) to rotational horsepower parameters.' },
      { question: 'At what RPM is torque equal to horsepower?', answer: 'Torque and HP curves always cross at exactly 5,252 RPM, regardless of the engine model.' }
    ],
    relatedSlugs: ['machine-efficiency-calculator', 'gear-speed-calculator'],
    calculate: (inputs) => {
      const rpm = Number(inputs.rpm || 3000);
      const torque = Number(inputs.torque || 250);

      const hp = (torque * rpm) / 5252;

      return {
        results: [
          { label: 'Calculated Horsepower (HP)', value: `${hp.toFixed(2)} HP`, isPrimary: true },
          { label: 'Watts Equivalent (kW)', value: `${(hp * 0.7457).toFixed(2)} kW` },
          { label: 'RPM level checked', value: `${rpm} rpm` }
        ],
        chartData: [
          { name: 'Rotational speed (RPM)', value: rpm / 10 },
          { name: 'Horsepower metric', value: Math.round(hp) }
        ]
      };
    }
  },
  {
    id: 'gear-speed',
    name: 'Gear Speed Calculator',
    slug: 'gear-speed-calculator',
    category: 'engineering',
    description: 'Calculate output speeds and gear ratios for interlocking mechanical gears based on their teeth counts.',
    seoTitle: 'Mechanical Gear Ratio & Speed Calculator',
    seoDescription: 'Input gear teeth and input speeds to find output rotational values and torque ratios.',
    inputs: [
      { id: 'inputTeeth', label: 'Drive Gear Teeth Count (Input)', type: 'number', defaultValue: 12 },
      { id: 'outputTeeth', label: 'Driven Gear Teeth Count (Output)', type: 'number', defaultValue: 36 },
      { id: 'inputSpeed', label: 'Input Drive Speed (RPM)', type: 'number', defaultValue: 1800 }
    ],
    formula: 'Gear Ratio = Output Teeth / Input Teeth\nOutput RPM = Input RPM / Gear Ratio',
    explanation: 'Gears allow you to exchange rotational speed for mechanical torque leverage, or vice-versa.',
    example: 'An input gear with 12 teeth spinning at 1,800 RPM driving a 36-teeth output gear results in an output gear speed of 600 RPM, representing a 3:1 gear ratio.',
    faq: [
      { question: 'Does a larger output gear increase torque?', answer: 'Yes! A higher gear ratio increases output torque proportionally while reducing speed.' },
      { question: 'What are idle gears used for?', answer: 'Idler gears placed between drive and driven gears change the output spin direction without altering the gear ratio.' }
    ],
    relatedSlugs: ['rotation-calculator', 'machine-efficiency-calculator'],
    calculate: (inputs) => {
      const g1 = Number(inputs.inputTeeth || 12);
      const g2 = Number(inputs.outputTeeth || 36);
      const rpmIn = Number(inputs.inputSpeed || 1800);

      const ratio = g1 > 0 ? g2 / g1 : 0;
      const rpmOut = ratio > 0 ? rpmIn / ratio : 0;

      return {
        results: [
          { label: 'Output Rotational Speed', value: `${Math.round(rpmOut)} RPM`, isPrimary: true },
          { label: 'Mechanical Gear Ratio', value: `${ratio.toFixed(2)} : 1` },
          { label: 'Torque Multiplier', value: `${ratio.toFixed(2)}x` }
        ],
        chartData: [
          { name: 'Input Speed (RPM)', value: rpmIn },
          { name: 'Output Speed (RPM)', value: Math.round(rpmOut) }
        ]
      };
    }
  }
];
