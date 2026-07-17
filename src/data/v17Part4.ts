import { Calculator } from '../types';

export const V17_PART4_CALCULATORS: Calculator[] = [
  // ====================================== ENGINEERING ======================================
  {
    id: 'eng-voltage-drop',
    name: 'Electrical Voltage Drop Calculator',
    slug: 'eng-voltage-drop',
    category: 'engineering',
    description: 'Calculate copper wire line resistance losses and voltage drop percentages.',
    formula: 'Drop = (2 * length * resistance per ft * Current)',
    explanation: 'Applies NEC guidelines to prevent power delivery drops across long electrical wiring hookups.',
    example: 'Running a 15-amp load over 150 feet of standard 12 AWG copper wire causes a drop of 4.38V (3.65%).',
    inputs: [
      { id: 'vBase', label: 'Injected Source Voltage', type: 'number', defaultValue: 120, min: 1, max: 600, unit: 'Volts' },
      { id: 'lengthFt', label: 'One-Way Run Length', type: 'number', defaultValue: 100, min: 1, step: 5, unit: 'feet' },
      { id: 'currentAmps', label: 'Active Circuit Load', type: 'number', defaultValue: 15, min: 1, max: 200, unit: 'Amps' },
      { id: 'wireSize', label: 'Copper Wire Gauge Class (AWG)', type: 'select', defaultValue: '12', options: [
        { label: '14 AWG (1.6 ohm/1000ft)', value: '14' },
        { label: '12 AWG (1.0 ohm/1000ft)', value: '12' },
        { label: '10 AWG (0.64 ohm/1000ft)', value: '10' },
        { label: '8 AWG (0.40 ohm/1000ft)', value: '8' }
      ]}
    ],
    faq: [
      { question: 'What is the NEC maximum voltage drop limit?', answer: 'The National Electrical Code (NEC) recommends a maximum voltage drop of 3% for branch circuit conductors and 5% combined overall.' }
    ],
    relatedSlugs: ['sci-wavelength-frequency', 'eng-beam-bending'],
    seoTitle: 'Copper AWG Wire Voltage Drop Resistance Calculator',
    seoDescription: 'Obtain estimated voltage losses and final voltage levels across long distances.',
    calculate: (inputs) => {
      const v = Number(inputs.vBase || 120);
      const l = Number(inputs.lengthFt || 50);
      const i = Number(inputs.currentAmps || 10);
      const awg = String(inputs.wireSize || '12');
      
      let ohmPerK = 1.0; 
      switch (awg) {
        case '14': ohmPerK = 1.624; break;
        case '12': ohmPerK = 1.021; break;
        case '10': ohmPerK = 0.642; break;
        case '8': ohmPerK = 0.403; break;
      }
      
      const singleWayResistance = (ohmPerK / 1000) * l;
      const vDrop = 2 * singleWayResistance * i; // single phase calculation
      const pct = (vDrop / v) * 100;
      const remains = Math.max(0, v - vDrop);
      
      return {
        results: [
          { label: 'Deliverable Output Voltage', value: Number(remains.toFixed(2)), unit: 'Volts', isPrimary: true },
          { label: 'Voltage Losses Drop', value: Number(vDrop.toFixed(2)), unit: 'V' },
          { label: 'Percentage System drop', value: Number(pct.toFixed(2)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'eng-beam-bending',
    name: 'Beam Deflection Calculator',
    slug: 'eng-beam-bending',
    category: 'engineering',
    description: 'Calculate maximum bending displacement of structural beams under point loads.',
    formula: 'Deflection y = (F * L^3) / (48 * E * I)',
    explanation: 'Models mechanics formulas to verify structural load deflection limits are not exceeded.',
    example: 'An A36 steel beam spanned 120in under 5,000lb point limits deflects exactly 0.12 inches.',
    inputs: [
      { id: 'load', label: 'Concentrated Load Force (F)', type: 'number', defaultValue: 3000, min: 10, step: 100, unit: 'lbs' },
      { id: 'length', label: 'Overall Beam Span Length (L)', type: 'number', defaultValue: 144, min: 12, step: 6, unit: 'inches' },
      { id: 'elasticity', label: 'Elastic Modulus (E) - ASTM Standard', type: 'select', defaultValue: '29000000', options: [
        { label: 'Structural Steel (29,000,000 psi)', value: '29000000' },
        { label: 'Structural Aluminum (10,000,000 psi)', value: '10000000' }
      ]},
      { id: 'inertia', label: 'Moment of Inertia (I)', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.5, unit: 'in^4' }
    ],
    faq: [
      { question: 'What is structural Moment of Inertia?', answer: 'A geometric property measuring cross-section stiffness based on profile shapes. Larger heights (such as I-beams) yield massive boosts in deflection holding limits.' }
    ],
    relatedSlugs: ['eng-voltage-drop', 'eng-thermal-expansion'],
    seoTitle: 'Structural Steel Beam Point Load Deflection Calculator',
    seoDescription: 'Obtain structural bend limits based on elasticity scores and span lengths.',
    calculate: (inputs) => {
      const f = Number(inputs.load || 1000);
      const l = Number(inputs.length || 60);
      const e = Number(inputs.elasticity || 29000000);
      const i = Number(inputs.inertia || 5);
      
      const deflection = (f * Math.pow(l, 3)) / (48 * e * i);
      
      return {
        results: [
          { label: 'Max Beam center deflection', value: Number(deflection.toFixed(4)), unit: 'inches', isPrimary: true },
          { label: 'Core Structural Stiffness (EI)', value: (e * i).toExponential(2), unit: 'lb-in^2' }
        ]
      };
    }
  },
  {
    id: 'eng-piping-flow-rate',
    name: 'Piping Volumetric Flow Rate Calculator',
    slug: 'eng-piping-flow-rate',
    category: 'engineering',
    description: 'Calculate fluid pipe velocity capacities and volumetric throughput parameters.',
    formula: 'Flow GPM = Velocity fps * area sq ft * conversion multipliers',
    explanation: 'Converts tube sizing diameters and velocities into metric gallon flow counts.',
    example: 'A standard 2-inch pipe running clear liquid at 8.0 feet/sec discharges 78.3 gallons per minute.',
    inputs: [
      { id: 'pipeDia', label: 'Internal Pipe Diameter', type: 'number', defaultValue: 2.0, min: 0.1, step: 0.1, unit: 'inches' },
      { id: 'velocity', label: 'Fluid Flow Velocity Speed', type: 'number', defaultValue: 5.0, min: 0.1, step: 0.5, unit: 'ft/sec' }
    ],
    faq: [
      { question: 'What is a safe fluid piping velocity?', answer: 'Typical commercial water lines target speeds between 4 and 8 feet per second. Exceeding 10 fps triggers high friction and wear issues.' }
    ],
    relatedSlugs: ['eng-voltage-drop', 'eng-hydraulic-cylinder-force'],
    seoTitle: 'Hydraulic Pipe Velocity Volumetric GPM Calculator',
    seoDescription: 'Accurately convert pipe dimensions into system discharge volumes.',
    calculate: (inputs) => {
      const d = Number(inputs.pipeDia || 1);
      const v = Number(inputs.velocity || 5);
      
      const radiusFt = (d / 2) / 12;
      const areaSqFt = Math.PI * Math.pow(radiusFt, 2);
      const flowCfs = areaSqFt * v; // Cubic feet per second
      
      // 1 cubic foot per second = 448.83 gallons per minute
      const flowGpm = flowCfs * 448.8311;
      
      return {
        results: [
          { label: 'Volumetric Fluid Flow', value: Number(flowGpm.toFixed(1)), unit: 'GPM (gallons/min)', isPrimary: true },
          { label: 'Continuous Flow rate', value: Number(flowCfs.toFixed(3)), unit: 'Cubic ft / sec' },
          { label: 'Day-span cumulative discharges', value: Math.round(flowGpm * 1440), unit: 'gallons/day' }
        ]
      };
    }
  },
  {
    id: 'eng-limits-fits-tolerance',
    name: 'Shaft Limits & Tolerances Calculator',
    slug: 'eng-limits-fits-tolerance',
    category: 'engineering',
    description: 'Calculate shaft boundaries and fit sizes specified for machinery parts.',
    formula: 'Max Hole = Basic Size + Tolerance',
    explanation: 'Tracks mechanical clearance margins, ensuring parts assemble correctly.',
    example: 'A basic machine setting 50mm diameters with 0.15mm hole clearances limits fits cleanly.',
    inputs: [
      { id: 'basicSize', label: 'Shaft Basic Core Dimension', type: 'number', defaultValue: 50, min: 0.1, step: 0.5, unit: 'mm' },
      { id: 'holeDev', label: 'Selected Hole deviation', type: 'number', defaultValue: 0.05, min: -1, step: 0.01, unit: 'mm' },
      { id: 'shaftDev', label: 'Selected Shaft deviation', type: 'number', defaultValue: -0.02, min: -1, step: 0.01, unit: 'mm' }
    ],
    faq: [
      { question: 'What is hole-basis system?', answer: 'A design practice that sets hole sizes as standard constants while varying shaft sizes to achieve clearances or press fits.' }
    ],
    relatedSlugs: ['eng-beam-bending', 'eng-gear-ratio'],
    seoTitle: 'Machinery Fit Limits and Tolerance Calculator',
    seoDescription: 'Obtain estimated minimum and maximum hole tolerances on manufacturing plans.',
    calculate: (inputs) => {
      const base = Number(inputs.basicSize || 10);
      const hole = Number(inputs.holeDev || 0);
      const shaft = Number(inputs.shaftDev || 0);
      
      const realHole = base + hole;
      const realShaft = base + shaft;
      const clearance = realHole - realShaft;
      
      return {
        results: [
          { label: 'Overall Structural Clearance Gap', value: Number(clearance.toFixed(3)), unit: 'mm', isPrimary: true },
          { label: 'Pristine Core Hole Sizes', value: Number(realHole.toFixed(3)), unit: 'mm' },
          { label: 'Finalized Shaft Sizes', value: Number(realShaft.toFixed(3)), unit: 'mm' }
        ]
      };
    }
  },
  {
    id: 'eng-thermal-expansion',
    name: 'Thermal Linear Expansion Calculator',
    slug: 'eng-thermal-expansion',
    category: 'engineering',
    description: 'Calculate linear thermal expansion changes across temperature differences.',
    formula: 'Change in Length (dL) = a * L0 * dT',
    explanation: 'Determines expansion values to help design bridge joint and concrete pad expansion lines.',
    example: 'Sustaining a 100-foot structural concrete pad through a 50°F warmth variance stretches lines by 0.33 inches.',
    inputs: [
      { id: 'length', label: 'Starting Length Value (L0)', type: 'number', defaultValue: 100, min: 1, unit: 'feet' },
      { id: 'material', label: 'Structural Asset Material', type: 'select', defaultValue: 'steel', options: [
        { label: 'Steel (12.0 * 10^-6 / °C)', value: '12e-6' },
        { label: 'Copper (16.5 * 10^-6 / °C)', value: '16.5e-6' },
        { label: 'Aluminum (23.0 * 10^-6 / °C)', value: '23e-6' },
        { label: 'Structural Concrete (10.0 * 10^-6 / °C)', value: '10e-6' }
      ]},
      { id: 'dT', label: 'Fahrenheit/Celsius Temperature Difference', type: 'number', defaultValue: 40, min: -200, max: 1000, unit: '°C' }
    ],
    faq: [
      { question: 'Why plan thermal clearance lines?', answer: 'Without safety spaces or expansion joints, expanding concrete pads build extreme shear forces, cracking structural supports.' }
    ],
    relatedSlugs: ['eng-beam-bending', 'eng-voltage-drop'],
    seoTitle: 'ASTP Thermal Linear Expansion Coefficient Calculator',
    seoDescription: 'Verify expected elongation metrics online.',
    calculate: (inputs) => {
      const length = Number(inputs.length || 10);
      const coeff = Number(inputs.material || 12e-6);
      const temp = Number(inputs.dT || 0);
      
      const deltaL = coeff * length * temp;
      const finalLength = length + deltaL;
      
      return {
        results: [
          { label: 'Elongation Change in Length (dL)', value: Number((deltaL * 12).toFixed(4)), unit: 'inches', isPrimary: true },
          { label: 'Cumulative Extended Value', value: Number(finalLength.toFixed(4)), unit: 'ft' },
          { label: 'Calculated stretching factor', value: Number((deltaL / length * 100).toFixed(5)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'eng-hydraulic-cylinder-force',
    name: 'Hydraulic Cylinder Force Calculator',
    slug: 'eng-hydraulic-cylinder-force',
    category: 'engineering',
    description: 'Calculate extension and retraction force profiles for pneumatic or hydraulic pistons.',
    formula: 'Push Force = Pressure * Area of Piston: Force = P * Pi * D^2 / 4',
    explanation: 'Sizes pump pressures and piston bores to verify load handling requirements can be met.',
    example: 'Pressurizing a 4-inch bore cylinder to 2,000 PSI exerts exactly 25,133 pounds of linear force.',
    inputs: [
      { id: 'bore', label: 'Piston Core Bore Diameter', type: 'number', defaultValue: 3.0, min: 0.1, step: 0.1, unit: 'inches' },
      { id: 'pressure', label: 'Circuit Operating Hydraulic Pressure', type: 'number', defaultValue: 1500, min: 100, step: 100, unit: 'PSI' }
    ],
    faq: [
      { question: 'Why does retraction force differ from extension push force?', answer: 'Retraction pull forces are slightly weaker because the internal metal rod blocks a portion of the active piston surface area.' }
    ],
    relatedSlugs: ['eng-piping-flow-rate', 'eng-limits-fits-tolerance'],
    seoTitle: 'Linear force hydraulic piston sizing calculator',
    seoDescription: 'Obtain hydraulic cylinders load extension potentials using pressure baselines.',
    calculate: (inputs) => {
      const bore = Number(inputs.bore || 1);
      const psi = Number(inputs.pressure || 1000);
      
      const area = Math.PI * Math.pow(bore / 2, 2);
      const pushForce = area * psi;
      
      return {
        results: [
          { label: 'Total Cylinder Push Force', value: Math.round(pushForce), unit: 'lbs force', isPrimary: true },
          { label: 'Cylinder cross-sectional surface area', value: Number(area.toFixed(2)), unit: 'sq inches' },
          { label: 'Weight rating metric equivalents', value: Number((pushForce / 2000).toFixed(2)), unit: 'tons force' }
        ]
      };
    }
  },
  {
    id: 'eng-gear-ratio',
    name: 'Mechanical Gear Ratio Calculator',
    slug: 'eng-gear-ratio',
    category: 'engineering',
    description: 'Calculate gear ratios, rotational speeds, and mechanical torque multipliers.',
    formula: 'Ratio = Driven Teeth / Drive Teeth; Torque Out = Torque In * Ratio',
    explanation: 'Models drive system velocities, checking output RPMs and mechanical gear limits.',
    example: 'Connecting a 12-tooth drive pin to a 48-tooth gear gives a 4:1 torque reduction step.',
    inputs: [
      { id: 'drive', label: 'Total Drive Gear Teeth pin', type: 'number', defaultValue: 12, min: 1 },
      { id: 'driven', label: 'Total Driven Gear Teeth pin', type: 'number', defaultValue: 36, min: 1 },
      { id: 'inRpm', label: 'Core Motor Input Velocity Standard', type: 'number', defaultValue: 1500, min: 1, step: 50, unit: 'RPM' }
    ],
    faq: [
      { question: 'What is gear reduction?', answer: 'A design method that trades shaft rotation speed (RPM) to gain mechanical leverage and rotational force (torque).' }
    ],
    relatedSlugs: ['eng-limits-fits-tolerance', 'eng-beam-bending'],
    seoTitle: 'Gearbox Reducer Ratio Speeds and Torque Calculator',
    seoDescription: 'Determine gear ratios and output RPM velocity reductions online.',
    calculate: (inputs) => {
      const d = Number(inputs.drive || 1);
      const dr = Number(inputs.driven || 1);
      const rpm = Number(inputs.inRpm || 100);
      
      const ratio = dr / d;
      const outRpm = ratio > 0 ? rpm / ratio : 0;
      
      return {
        results: [
          { label: 'Mechanical Gear Ratio', value: `${ratio.toFixed(2)}:1`, isPrimary: true },
          { label: 'Output Speeds Ratio', value: Math.round(outRpm), unit: 'RPM' },
          { label: 'Output Holding Force Leverage Multiplier', value: Number(ratio.toFixed(2)), unit: 'x raw torque' }
        ]
      };
    }
  },

  // ====================================== SCIENCE ======================================
  {
    id: 'sci-ideal-gas-law',
    name: 'Ideal Gas Law Calculator',
    slug: 'sci-ideal-gas-law',
    category: 'science',
    description: 'Solve for the unknowns of the Ideal Gas thermodynamic formula (PV = nRT).',
    formula: 'Moles (n) = [P * V] / [R * T] where R is the global gas constant 0.0821',
    explanation: 'Integrates thermodynamic properties to help calculate accurate pressure and temperature limits.',
    example: 'Confining 2.5 atm in a 10.0L cylinder under 298 Kelvin holds exactly 1.02 moles of gas.',
    inputs: [
      { id: 'pressure', label: 'Measured System Pressure (P)', type: 'number', defaultValue: 2.0, min: 0.1, step: 0.1, unit: 'atm' },
      { id: 'volume', label: 'Total Container Capacity (V)', type: 'number', defaultValue: 8.5, min: 0.1, step: 0.5, unit: 'Liters' },
      { id: 'tempK', label: 'Thermodynamic Temperature (T)', type: 'number', defaultValue: 298.15, min: 1, step: 5, unit: 'Kelvin' }
    ],
    faq: [
      { question: 'What does R represent in the formula?', answer: 'The universal gas constant, standardizing coordinate volumes at 0.082057 L·atm/(mol·K).' }
    ],
    relatedSlugs: ['sci-half-life', 'sci-newton-force'],
    seoTitle: 'PV=nRT Ideal Gas Law mole solver calculator',
    seoDescription: 'Solve for the number of moles contained within standard gas configurations easily.',
    calculate: (inputs) => {
      const p = Number(inputs.pressure || 1);
      const v = Number(inputs.volume || 1);
      const t = Number(inputs.tempK || 273.15);
      
      const r = 0.082057; // Gas constant
      const moles = (p * v) / (r * t);
      
      return {
        results: [
          { label: 'Calculated Content Moles (n)', value: Number(moles.toFixed(4)), unit: 'moles', isPrimary: true },
          { label: 'Thermodynamic Gas constant R value', value: r, unit: 'L-atm/mol-K' }
        ]
      };
    }
  },
  {
    id: 'sci-half-life',
    name: 'Radioactive Half-Life & Decay Calculator',
    slug: 'sci-half-life',
    category: 'science',
    description: 'Calculate the remaining mass of a substance over exponential half-life decay windows.',
    formula: 'Final Mass N(t) = N0 * (1/2) ^ (t / h)',
    explanation: 'Applies physics decay equations to demonstrate radioactivity and material decomposition curves.',
    example: 'An initial 100g sample with a 50-year half-life leaves exactly 25g after 100 years of decay.',
    inputs: [
      { id: 'n0', label: 'Starting Substance Mass (N0)', type: 'number', defaultValue: 100, min: 0.1, step: 1, unit: 'grams' },
      { id: 'halfYears', label: 'Substance Half-life Cycles (h)', type: 'number', defaultValue: 10, min: 0.1, step: 1, unit: 'years' },
      { id: 'elapsed', label: 'Total Elapsed Duration (t)', type: 'number', defaultValue: 30, min: 0, step: 1, unit: 'years' }
    ],
    faq: [
      { question: 'What is a half-life?', answer: 'The duration needed for half of a radioactive sample to decay into stable daughter isotopes.' }
    ],
    relatedSlugs: ['sci-ideal-gas-law', 'sci-pendulum-period'],
    seoTitle: 'Exponential isotope mass radioactive decay calculator',
    seoDescription: 'Trace physical half-life curves and find remaining material mass values.',
    calculate: (inputs) => {
      const n0 = Number(inputs.n0 || 10);
      const h = Number(inputs.halfYears || 5);
      const t = Number(inputs.elapsed || 1);
      
      const exponent = t / h;
      const finalMass = n0 * Math.pow(0.5, exponent);
      
      return {
        results: [
          { label: 'Calculated Remaining Mass', value: Number(finalMass.toFixed(3)), unit: 'grams', isPrimary: true },
          { label: 'Proportion decayed away', value: Number(((1 - finalMass / n0) * 100).toFixed(1)), unit: '%' },
          { label: 'Completed Half-life Cycles', value: Number(exponent.toFixed(2)), unit: 'terms' }
        ]
      };
    }
  },
  {
    id: 'sci-newton-force',
    name: 'Newtonian Force & Acceleration Calculator',
    slug: 'sci-newton-force',
    category: 'science',
    description: 'Solve for force, mass, or acceleration using Newton\'s second law (F = ma).',
    formula: 'Force F = Mass * Acceleration (a)',
    explanation: 'Calculates dynamic force outputs to help verify mechanical work and movement loads.',
    example: 'Pushing a 1,500kg car at 2.0 meters/sec^2 demands exactly 3,000 Newtons of force.',
    inputs: [
      { id: 'mass', label: 'Object Mass load (m)', type: 'number', defaultValue: 1500, min: 0.1, step: 10, unit: 'kg' },
      { id: 'force', label: 'Target Applied Force (F)', type: 'number', defaultValue: 3000, min: 0.1, step: 10, unit: 'Newtons' }
    ],
    faq: [
      { question: 'What are Newton\'s laws of motion?', answer: '(1) Objects remain at rest or steady motion unless acted upon. (2) Acceleration scales with net force (F=ma). (3) Every action has an equal, opposite reaction.' }
    ],
    relatedSlugs: ['sci-ideal-gas-law', 'eng-hydraulic-cylinder-force'],
    seoTitle: 'Newtonian Force and Mass Acceleration Calculator',
    seoDescription: 'Determine acceleration values and force limits easily.',
    calculate: (inputs) => {
      const mass = Number(inputs.mass || 1);
      const force = Number(inputs.force || 1);
      
      const acceleration = force / mass;
      
      return {
        results: [
          { label: 'Calculated Acceleration pace (a)', value: Number(acceleration.toFixed(4)), unit: 'm/s^2', isPrimary: true },
          { label: 'Translational weight force results', value: Number((mass * 9.806).toFixed(1)), unit: 'Newtons on Earth' }
        ]
      };
    }
  },
  {
    id: 'sci-pendulum-period',
    name: 'Simple Pendulum Oscillation Calculator',
    slug: 'sci-pendulum-period',
    category: 'science',
    description: 'Calculate simple pendulum oscillation periods across different planetary gravity environments.',
    formula: 'T = 2 * Pi * Sqrt(L / g)',
    explanation: 'Models gravity swing rates to determine period intervals and structural pendulum lengths.',
    example: 'A 1.0-meter pendulum swinging on Earth has a back-and-forth period of exactly 2.01 seconds.',
    inputs: [
      { id: 'length', label: 'Pendulum String Length (L)', type: 'number', defaultValue: 1.0, min: 0.1, step: 0.1, unit: 'meters' },
      { id: 'gravity', label: 'Planetary Gravity Environment', type: 'select', defaultValue: 'earth', options: [
        { label: 'Earth Standard (g = 9.806 m/s^2)', value: '9.80665' },
        { label: 'Moon Gravity (g = 1.62 m/s^2)', value: '1.62' },
        { label: 'Mars Surface (g = 3.71 m/s^2)', value: '3.711' }
      ]}
    ],
    faq: [
      { question: 'Why does pendulum weight not affect period?', answer: 'In simple pendulums, inertia scaling and gravity forces balance out exactly, making mass irrelevant to the back-and-forth swing time.' }
    ],
    relatedSlugs: ['sci-half-life', 'sci-wavelength-frequency'],
    seoTitle: 'Planetary simple pendulum Swing timeline calculator',
    seoDescription: 'Obtain oscillation swing speed periods using physics formulas.',
    calculate: (inputs) => {
      const l = Number(inputs.length || 1);
      const g = Number(inputs.gravity || 9.80665);
      
      const rawTerm = l / g;
      const period = 2 * Math.PI * Math.sqrt(rawTerm);
      const freq = period > 0 ? 1 / period : 0;
      
      return {
        results: [
          { label: 'Pendulum Oscillation Period (T)', value: Number(period.toFixed(3)), unit: 'seconds', isPrimary: true },
          { label: 'Oscillation Frequency Rate', value: Number(freq.toFixed(3)), unit: 'Hz (Hertz)' }
        ]
      };
    }
  },
  {
    id: 'sci-wavelength-frequency',
    name: 'Wavelength & Frequency Calculator',
    slug: 'sci-wavelength-frequency',
    category: 'science',
    description: 'Calculate photon wave parameters across multiple physical mediums.',
    formula: 'Wavelength (lambda) = Speed / Frequency',
    explanation: 'Maps electromagnetic signals, checking transmission speeds and frequencies.',
    example: 'A 5.0 GHz wireless router signal has a physical wavelength of exactly 6.0 centimeters.',
    inputs: [
      { id: 'freqHz', label: 'Signal Base Frequency', type: 'number', defaultValue: 5000000000, min: 100, step: 1000000, unit: 'Hz' },
      { id: 'medium', label: 'Wave Transmission Medium', type: 'select', defaultValue: 'vacuum', options: [
        { label: 'Vacuum or Air (c = 2.997 * 10^8 m/s)', value: '299792458' },
        { label: 'Pure Water (c = 2.25 * 10^8 m/s)', value: '225000000' }
      ]}
    ],
    faq: [
      { question: 'Why does color shift in water?', answer: 'As light enters denser mediums, the waves slow down. This compression shortens their wavelength, though their frequency remains constant.' }
    ],
    relatedSlugs: ['sci-pendulum-period', 'sci-ideal-gas-law'],
    seoTitle: 'Electromagnetic Wavelength Frequency calculator',
    seoDescription: 'Determine physical wavelength lengths across different propagation speeds.',
    calculate: (inputs) => {
      const f = Number(inputs.freqHz || 1000);
      const c = Number(inputs.medium || 299792458);
      
      const wavelength = f > 0 ? c / f : 0;
      
      return {
        results: [
          { label: 'Wave Physical Wavelength', value: wavelength >= 1 ? Number(wavelength.toFixed(3)) : Number((wavelength * 100).toFixed(3)), unit: wavelength >= 1 ? 'meters' : 'cm', isPrimary: true },
          { label: 'Photon frequency check', value: (f / 1000000).toFixed(2), unit: 'MHz' }
        ]
      };
    }
  },

  // ====================================== EDUCATION ======================================
  {
    id: 'edu-gpa-converter',
    name: 'GPA Scale & Converter Calculator',
    slug: 'edu-gpa-converter',
    category: 'education',
    description: 'Convert custom grade percentages into standardized 4.0 and 5.0 GPA scale values.',
    formula: 'GPA = (Percentage / 100) * Scale',
    explanation: 'Formulates basic conversions to help align school transcripts with standard grading rules.',
    example: 'A class percentage score of 88% translates cleanly to a standard 3.5 GPA.',
    inputs: [
      { id: 'percent', label: 'Overall Class Grade average', type: 'number', defaultValue: 88, min: 1, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What is a weighted GPA?', answer: 'A grading scale (often capping at 5.0) that awards extra GPA points for passing advanced AP or Honors courses.' }
    ],
    relatedSlugs: ['edu-study-planner', 'edu-readability'],
    seoTitle: 'GPA Percentage scaling letter grade converter',
    seoDescription: 'Standardize academic transcript scores into unified letter grades.',
    calculate: (inputs) => {
      const p = Number(inputs.percent || 80);
      
      let gpa4 = 0;
      let letter = 'F';
      
      if (p >= 93) { gpa4 = 4.0; letter = 'A'; }
      else if (p >= 90) { gpa4 = 3.7; letter = 'A-'; }
      else if (p >= 87) { gpa4 = 3.3; letter = 'B+'; }
      else if (p >= 83) { gpa4 = 3.0; letter = 'B'; }
      else if (p >= 80) { gpa4 = 2.7; letter = 'B-'; }
      else if (p >= 77) { gpa4 = 2.3; letter = 'C+'; }
      else if (p >= 73) { gpa4 = 2.0; letter = 'C'; }
      else if (p >= 70) { gpa4 = 1.7; letter = 'C-'; }
      else if (p >= 60) { gpa4 = 1.0; letter = 'D'; }
      
      const gpa5 = (p / 100) * 5.0;
      
      return {
        results: [
          { label: 'Unweighted 4.0 GPA Equivalent', value: gpa4.toFixed(2), isPrimary: true },
          { label: 'Calculated Letter Grade Conversion', value: letter },
          { label: 'Standard 5.0 GPA Scale equivalent', value: gpa5.toFixed(2) }
        ]
      };
    }
  },
  {
    id: 'edu-study-planner',
    name: 'Study Schedule Planner',
    slug: 'edu-study-planner',
    category: 'education',
    description: 'Calculate recommended weekly study hours based on course credit weight and difficulty.',
    formula: 'Study Hours = Course Credits * Difficulty Index multiplier',
    explanation: 'Sparsest standard scheduling guide, allocating time to ensure deep academic retention.',
    example: 'Enrolling in 12 hard credits demands keeping up with 36 weekly study hours outside of lectures.',
    inputs: [
      { id: 'credits', label: 'Current Semester Credits load', type: 'number', defaultValue: 12, min: 1, max: 30 },
      { id: 'difficulty', label: 'Estimated Course Rigor', type: 'select', defaultValue: 'hard', options: [
        { label: 'Easy course (1.0x hours/credit)', value: '1.0' },
         { label: 'Medium challenge (2.0x hours/credit)', value: '2.0' },
         { label: 'Hard / Heavy STEM course (3.0x hours/credit)', value: '3.0' }
      ]}
    ],
    faq: [
      { question: 'What is the "carnegie rule of study"?', answer: 'The academic standard recommending that students commit 2 to 3 out-of-class study hours for every single credit hour registered.' }
    ],
    relatedSlugs: ['edu-gpa-converter', 'edu-syllabus-schedule'],
    seoTitle: 'Weekly credit study calendar planner',
    seoDescription: 'Obtain required study targets and map schedule paces online.',
    calculate: (inputs) => {
      const cr = Number(inputs.credits || 10);
      const d = Number(inputs.difficulty || 2.0);
      
      const weeklyHours = cr * d;
      
      return {
        results: [
          { label: 'Required Weekly Study Time', value: weeklyHours, unit: 'hours / week', isPrimary: true },
          { label: 'Target Daily Session (6-day schedule)', value: Number((weeklyHours / 6).toFixed(1)), unit: 'hours/day' }
        ]
      };
    }
  },
  {
    id: 'edu-readability',
    name: 'Flesch Reading Ease Calculator',
    slug: 'edu-readability',
    category: 'education',
    description: 'Calculate text readability scores based on word, sentence, and syllable counts.',
    formula: 'Score = 206.835 - 1.015 * (Total Words / Total Sentences) - 84.6 * (Total Syllables / Total Words)',
    explanation: 'Applies Flesch-Kincaid index rules to check the clear semantic density of drafted copy.',
    example: 'An article with 10 words per sentence and simple syllables scores 80, indicating a clear, easy-to-read style.',
    inputs: [
      { id: 'sentences', label: 'Total Sentences in Text', type: 'number', defaultValue: 12, min: 1 },
      { id: 'words', label: 'Total Words in Text', type: 'number', defaultValue: 180, min: 1 },
      { id: 'syllables', label: 'Total Word Syllables Count', type: 'number', defaultValue: 250, min: 1 }
    ],
    faq: [
      { question: 'What does a high Flesch score indicate?', answer: 'Scores above 80 indicate plain, highly accessible language suited to a general audience. Scores below 30 point to dense, complex legal and academic writing.' }
    ],
    relatedSlugs: ['edu-gpa-converter', 'edu-syllabus-schedule'],
    seoTitle: 'Flesch Reading Ease Formula & readability estimator',
    seoDescription: 'Obtain clear reading indices to optimize readability.',
    calculate: (inputs) => {
      const s = Number(inputs.sentences || 1);
      const w = Number(inputs.words || 1);
      const syl = Number(inputs.syllables || 1);
      
      const score = 206.835 - 1.015 * (w / s) - 84.6 * (syl / w);
      
      let level = 'High School';
      if (score >= 90) level = '5th Grade (Very Easy)';
      else if (score >= 80) level = '6th Grade (Easy)';
      else if (score >= 60) level = '8th to 9th Grade (Standard Plain)';
      else if (score >= 30) level = 'College Student';
      else level = 'College Graduate (Extremely Difficult)';
      
      return {
        results: [
          { label: 'Flesch Reading Ease Score', value: Number(score.toFixed(1)), unit: '/ 100', isPrimary: true },
          { label: 'Estimated Audience level', value: level },
          { label: 'Average sentence length', value: Number((w / s).toFixed(1)), unit: 'words' }
        ]
      };
    }
  },
  {
    id: 'edu-syllabus-schedule',
    name: 'Syllabus Assignment Pacing Calculator',
    slug: 'edu-syllabus-schedule',
    category: 'education',
    description: 'Map out textbook readings evenly over semester schedules.',
    formula: 'Pace = Total chapters / Semester length',
    explanation: 'Models clear pacing goals to prevent stressful, last-minute exam cramming.',
    example: 'Completing a heavy 30-chapter manual in 15 weeks demands addressing exactly 2 chapters weekly.',
    inputs: [
      { id: 'chapters', label: 'Total Assignments / Chapters count', type: 'number', defaultValue: 24, min: 1 },
      { id: 'weeks', label: 'Target Weeks in Term', type: 'number', defaultValue: 12, min: 1 },
      { id: 'daysWeek', label: 'Available Active Study Days', type: 'number', defaultValue: 3, min: 1, max: 7, unit: 'days/week' }
    ],
    faq: [
      { question: 'Why plan assignments week-by-week?', answer: 'Constructing bite-sized, scheduled sub-tasks prevents study fatigue and builds solid, long-term cognitive retention.' }
    ],
    relatedSlugs: ['edu-study-planner', 'edu-gpa-converter'],
    seoTitle: 'Academic syllabus pacing & chapter coordinator',
    seoDescription: 'Benchmark clear assignment schedules and map daily study loads easily.',
    calculate: (inputs) => {
      const ch = Number(inputs.chapters || 10);
      const w = Number(inputs.weeks || 4);
      const d = Number(inputs.daysWeek || 3);
      
      const paceW = ch / w;
      const paceD = paceW / d;
      
      return {
        results: [
          { label: 'Weekly chapter targets', value: Number(paceW.toFixed(1)), unit: 'chapters/week', isPrimary: true },
          { label: 'Daily Session tasks', value: Number(paceD.toFixed(1)), unit: 'chapters/day' }
        ]
      };
    }
  },
  {
    id: 'edu-test-grade',
    name: 'Test Grade Calculator',
    slug: 'edu-test-grade',
    category: 'education',
    description: 'Calculate overall exam scores and letter grades based on incorrect answers count.',
    formula: 'Score = (Correct Questions / Total Questions) * 100',
    explanation: 'Provides a clean, direct conversion of raw test scores into letter grades.',
    example: 'Missing 4 questions on a 40-item quiz yields a 90% score, translating to an A- grade.',
    inputs: [
      { id: 'total', label: 'Total Exam Questions', type: 'number', defaultValue: 40, min: 1 },
      { id: 'missed', label: 'Incorrect/Missed Answers', type: 'number', defaultValue: 4, min: 0 }
    ],
    faq: [
      { question: 'What is a typical passing threshold?', answer: 'In most US schools, a grade of 60% or 70% is required to pass classes.' }
    ],
    relatedSlugs: ['edu-gpa-converter', 'edu-study-planner'],
    seoTitle: 'Teacher Test Grade & Percentage Point Calculator',
    seoDescription: 'Input exam questions and find equivalent letter grades instantly on academic curves.',
    calculate: (inputs) => {
      const total = Number(inputs.total || 10);
      const missed = Number(inputs.missed || 0);
      
      const correct = Math.max(0, total - missed);
      const score = (correct / total) * 100;
      
      let letter = 'F';
      if (score >= 90) letter = 'A';
      else if (score >= 80) letter = 'B';
      else if (score >= 70) letter = 'C';
      else if (score >= 60) letter = 'D';
      
      return {
        results: [
          { label: 'Final Exam Grade Score', value: `${score.toFixed(1)}%`, isPrimary: true },
          { label: 'Equivalent Letter Conversion', value: letter },
          { label: 'Correct Responses count', value: correct, unit: 'answers' }
        ]
      };
    }
  },

  // ====================================== CONTENT CREATOR ======================================
  {
    id: 'creator-tiktok-engagement',
    name: 'TikTok Video Engagement Calculator',
    slug: 'creator-tiktok-engagement',
    category: 'creator-tools',
    description: 'Calculate social media engagement indexes relative to overall views or profiles.',
    formula: 'Engagement % = (Likes + Shares + Comments) / Views * 100',
    explanation: 'Measures content resonance to help creators optimize posting structures.',
    example: 'Receiving 1,200 likes and 150 comments on a 15,000 view clip represents standard 9.0% interactions.',
    inputs: [
      { id: 'views', label: 'Overall Video View Count', type: 'number', defaultValue: 10000, min: 10 },
      { id: 'likes', label: 'Likes registered', type: 'number', defaultValue: 800, min: 0 },
      { id: 'shares', label: 'Shares / Reposts count', type: 'number', defaultValue: 150, min: 0 }
    ],
    faq: [
      { question: 'What is a healthy engagement rate?', answer: 'TikTok averages between 4% and 10% engagement. Rates above 15% indicate strong viral momentum.' }
    ],
    relatedSlugs: ['creator-cpm-earnings', 'creator-sponsorship-rate'],
    seoTitle: 'Social Media Video Engagement Rate Calculator',
    seoDescription: 'Obtain TikTok engagement statistics and find channel quality benchmarks.',
    calculate: (inputs) => {
      const views = Number(inputs.views || 100);
      const likes = Number(inputs.likes || 0);
      const shares = Number(inputs.shares || 0);
      
      const engagements = likes + shares;
      const rate = views > 0 ? (engagements / views) * 100 : 0;
      
      return {
        results: [
          { label: 'Social Engagement Rate', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Total registered interactions', value: engagements, unit: 'interactions' },
          { label: 'Audience Interest Category', value: rate > 10 ? 'Viral Momentum' : rate > 4 ? 'Steady Interest' : 'Low Interaction' }
        ]
      };
    }
  },
  {
    id: 'creator-video-file-size',
    name: 'Video Render File Size Calculator',
    slug: 'creator-video-file-size',
    category: 'creator-tools',
    description: 'Calculate estimated export video file sizes across standard resolutions and compression bitrates.',
    formula: 'File Size GB = Bitrate Mbps * 60 * Duration / 8 / 1024',
    explanation: 'Models video bit depths and timeline durations to predict storage needs before final rendering.',
    example: 'Exporting 10 minutes of 4K ProRes footage (150 Mbps) consumes approximately 11.2 Gigabytes of disk storage.',
    inputs: [
      { id: 'dur', label: 'Video Timeline Duration', type: 'number', defaultValue: 10, min: 1, unit: 'minutes' },
      { id: 'preset', label: 'Resolution & Format Presets', type: 'select', defaultValue: 'h264_1080', options: [
        { label: 'YouTube Standard 1080p (h.264 @ 15 Mbps)', value: '15' },
        { label: 'YouTube Standard 4K (h.264 @ 45 Mbps)', value: '45' },
        { label: 'ProRes 422 Edit Master (140 Mbps)', value: '140' }
      ]}
    ],
    faq: [
      { question: 'Which codec yields maximum compression?', answer: 'HEVC (h.265) provides identical visual quality to standard h.264 at roughly half the file size.' }
    ],
    relatedSlugs: ['creator-tiktok-engagement', 'backup-time'],
    seoTitle: 'Video export file storage size estimator',
    seoDescription: 'Project render storage limits based on preset video formatting ratios.',
    calculate: (inputs) => {
      const min = Number(inputs.dur || 1);
      const mbps = Number(inputs.preset || 15);
      
      const seconds = min * 60;
      const totalMb = mbps * seconds;
      const totalGb = totalMb / 8 / 1024;
      
      return {
        results: [
          { label: 'Projected Render File Size', value: totalGb >= 1 ? Number(totalGb.toFixed(2)) : Math.round(totalGb * 1024), unit: totalGb >= 1 ? 'GB' : 'MB', isPrimary: true },
          { label: 'Calculated Video Export Bitrate', value: mbps, unit: 'Mbps' }
        ]
      };
    }
  },
  {
    id: 'creator-cpm-earnings',
    name: 'AdSense CPM Earnings Calculator',
    slug: 'creator-cpm-earnings',
    category: 'creator-tools',
    description: 'Calculate channel revenue earnings based on video views, CPM metrics, and platform cuts.',
    formula: 'Revenue = views * (CPM / 1000) * Creator Share %',
    explanation: 'Translates raw advertising traffic metrics into passive creator cash returns.',
    example: 'A clip hitting 500,000 views at a $6.00 CPM under a 55% share earns the creator exactly $1,650.',
    inputs: [
      { id: 'views', label: 'Total Monetized Video Views', type: 'number', defaultValue: 250000, min: 100, step: 10000 },
      { id: 'cpm', label: 'Ad network CPM rate', type: 'number', defaultValue: 5.5, min: 0.1, step: 0.1, unit: '$/1k views' },
      { id: 'share', label: 'Creator Revenue Share Split', type: 'number', defaultValue: 55, min: 10, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What factors determine video CPM?', answer: 'Content topics (finance, real estate, and tech pay premiums), viewer locations, and seasonal advertising cycles determine final CPM.' }
    ],
    relatedSlugs: ['creator-sponsorship-rate', 'creator-tiktok-engagement'],
    seoTitle: 'YouTube Creator AdSense revenue calculator',
    seoDescription: 'Estimate your video earnings after applying platform ad revenue share splits.',
    calculate: (inputs) => {
      const views = Number(inputs.views || 1000);
      const cpm = Number(inputs.cpm || 4);
      const share = Number(inputs.share || 55) / 100;
      
      const gross = (views / 1000) * cpm;
      const payout = gross * share;
      
      return {
        results: [
          { label: 'Estimated Creator Payout', value: `$${Math.round(payout).toLocaleString()}`, isPrimary: true },
          { label: 'Gross Ad Revenue Generated', value: `$${Math.round(gross).toLocaleString()}` },
          { label: 'Platform Revenue Share cut', value: `$${Math.round(gross - payout).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'creator-sponsorship-rate',
    name: 'Sponsorship Value Calculator',
    slug: 'creator-sponsorship-rate',
    category: 'creator-tools',
    description: 'Calculate fair-market flat rates when quoting corporate brands for brand deals.',
    formula: 'Deal Rate = Avg Video Views * (Industry Niche Multiplier / 1000)',
    explanation: 'Assesses standard viewership profiles and conversion coefficients to determine pricing structures.',
    example: 'A business channel averaging 40,000 views quotes around $1,200 standard flat rates.',
    inputs: [
      { id: 'avgViews', label: 'Averaged Video Views count', type: 'number', defaultValue: 15000, min: 100, step: 500 },
      { id: 'nicheFactor', label: 'Content Niche conversion value', type: 'select', defaultValue: '30', options: [
        { label: 'Finance & B2B Tech ($30 CPM Equivalent)', value: '30' },
        { label: 'Lifestyle & Fitness ($20 CPM Equivalent)', value: '20' },
        { label: 'Gaming & Recreation ($10 CPM Equivalent)', value: '10' }
      ]}
    ],
    faq: [
      { question: 'Should I price flat rates or CPAs?', answer: 'A flat fee ensures stable compensation for your production effort, whereas CPA (Cost Per Acquisition) pays commissions on sales link conversions.' }
    ],
    relatedSlugs: ['creator-cpm-earnings', 'creator-tiktok-engagement'],
    seoTitle: 'Influencer sponsorship brand deal quotation calculator',
    seoDescription: 'Size custom campaign rates following established industry niche CPM CPM matrices.',
    calculate: (inputs) => {
      const views = Number(inputs.avgViews || 1000);
      const rate = Number(inputs.nicheFactor || 20);
      
      const baseQuote = (views / 1000) * rate;
      
      return {
        results: [
          { label: 'Recommended Flat rate Quote', value: `$${Math.round(baseQuote).toLocaleString()}`, isPrimary: true },
          { label: 'Target brand CPM standard', value: `$${rate}.00` },
          { label: 'Safe Negotiation margin span', value: `$${Math.round(baseQuote * 0.8)} to $${Math.round(baseQuote * 1.2)}` }
        ]
      };
    }
  },
  {
    id: 'creator-audio-bitrate',
    name: 'Audio Render File Size Calculator',
    slug: 'creator-audio-bitrate',
    category: 'creator-tools',
    description: 'Calculate absolute PCM uncompressed audio sizes based on sample rates.',
    formula: 'Bitrate (kbps) = sampleRate * bitDepth * channelsCount; Size = Bitrate * time',
    explanation: 'Sizes uncompressed WAV recording buffers to verify disk storage limits.',
    example: 'A 60-minute stereo session at 44.1 kHz 24-bit tracks at roughly 950 Megabytes.',
    inputs: [
      { id: 'durMin', label: 'Audio Tracks Duration', type: 'number', defaultValue: 60, min: 1, unit: 'minutes' },
      { id: 'rateKhz', label: 'Session Sample Rate', type: 'select', defaultValue: '44.1', options: [
        { label: '44.1 kHz (CD Standard Quality)', value: '44.1' },
         { label: '48.0 kHz (Video Standard Quality)', value: '48.0' },
         { label: '96.0 kHz (High-res Studio Project)', value: '96.0' }
      ]},
      { id: 'depth', label: 'Encoding Bit Depth', type: 'select', defaultValue: '16', options: [
        { label: '16-bit encoding', value: '16' },
         { label: '24-bit studio standard', value: '24' }
      ]}
    ],
    faq: [
      { question: 'What is sample rate?', answer: 'The frequency at which system cards capture vertical analog wave sound values per second to save them digitally.' }
    ],
    relatedSlugs: ['creator-video-file-size', 'backup-time'],
    seoTitle: 'WAV Linear PCM Export uncompressed Audio size calculator',
    seoDescription: 'Obtain estimated physical folder capacity needed for audio recordings.',
    calculate: (inputs) => {
      const min = Number(inputs.durMin || 5);
      const rateG = Number(inputs.rateKhz || 44.1);
      const bits = Number(inputs.depth || 16);
      
      const seconds = min * 60;
      const rateHz = rateG * 1000;
      
      const bps = rateHz * bits * 2; // Fixed stereo count 2
      const totalBits = bps * seconds;
      const totalBytes = totalBits / 8;
      const totalMb = totalBytes / (1024 * 1024);
      
      return {
        results: [
          { label: 'Expected Uncompressed WAV size', value: Math.round(totalMb), unit: 'MB', isPrimary: true },
          { label: 'Required Combined streaming rate', value: Math.round(bps / 1000), unit: 'kbps' }
        ]
      };
    }
  }
];
