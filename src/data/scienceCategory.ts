import { Calculator } from '../types';

export const SCIENCE_CALCULATORS: Calculator[] = [
  // ====================================== PHYSICS ======================================
  {
    id: 'physics-force',
    name: 'Force Calculator',
    slug: 'physics-force-calculator',
    category: 'science',
    description: 'Calculate force, mass, or acceleration using Newton’s Second Law of Motion (F = m * a).',
    seoTitle: 'Newton’s Second Law Force Calculator | Calculatoora',
    seoDescription: 'Solve for Force (F), Mass (m), or Acceleration (a) instantly. Perfect for physics students and engineering professionals.',
    inputs: [
      { id: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'f', options: [
        { label: 'Force (F)', value: 'f' },
        { label: 'Mass (m)', value: 'm' },
        { label: 'Acceleration (a)', value: 'a' }
      ]},
      { id: 'force', label: 'Force (F)', type: 'number', defaultValue: 50, helpText: 'Enter force in Newtons' },
      { id: 'mass', label: 'Mass (m)', type: 'number', defaultValue: 10, helpText: 'Enter mass in kilograms' },
      { id: 'acceleration', label: 'Acceleration (a)', type: 'number', defaultValue: 5, helpText: 'Enter acceleration in m/s²' }
    ],
    formula: 'F = m * a \n(m = F/a, a = F/m)',
    explanation: 'Newton’s Second Law states that the acceleration of an object is directly proportional to the net force acting on it, and inversely proportional to its mass.',
    example: 'A mass of 10 kg accelerated at 5 m/s² requires a force of 50 Newtons.',
    faq: [
      { question: 'What is a Newton (N)?', answer: 'One Newton is the force needed to accelerate one kilogram of mass at the rate of one meter per second squared.' }
    ],
    relatedSlugs: ['physics-energy-calculator', 'physics-acceleration-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'f';
      const fVal = Number(inputs.force) || 0;
      const mVal = Number(inputs.mass) || 1;
      const aVal = Number(inputs.acceleration) || 0;

      let res = 0;
      let label = '';
      let unit = '';

      if (solve === 'f') {
        res = mVal * aVal;
        label = 'Calculated Force';
        unit = 'N';
      } else if (solve === 'm') {
        res = aVal !== 0 ? fVal / aVal : 0;
        label = 'Calculated Mass';
        unit = 'kg';
      } else {
        res = mVal !== 0 ? fVal / mVal : 0;
        label = 'Calculated Acceleration';
        unit = 'm/s²';
      }

      return {
        results: [
          { label, value: res.toFixed(3), unit, isPrimary: true },
          { label: 'Formula Used', value: solve === 'f' ? 'F = m * a' : solve === 'm' ? 'm = F / a' : 'a = F / m' }
        ],
        chartData: [
          { name: 'Mass (kg)', value: Number(mVal.toFixed(2)), color: '#3b82f6' },
          { name: 'Acceleration (m/s²)', value: Number(aVal.toFixed(2)), color: '#39FF14' },
          { name: 'Force Product (N)', value: Number(fVal.toFixed(2)), color: '#a855f7' }
        ]
      };
    }
  },
  {
    id: 'physics-energy',
    name: 'Energy Calculator',
    slug: 'physics-energy-calculator',
    category: 'science',
    description: 'Calculate Kinetic Energy (KE) and Gravitational Potential Energy (PE) of a moving object.',
    seoTitle: 'Kinetic & Potential Energy Calculator | Calculatoora',
    seoDescription: 'Obtain Kinetic Energy and Gravitational Potential Energy values from mass, velocity, and height variables.',
    inputs: [
      { id: 'mass', label: 'Mass (kg)', type: 'number', defaultValue: 5 },
      { id: 'velocity', label: 'Velocity (m/s)', type: 'number', defaultValue: 10 },
      { id: 'height', label: 'Height (m)', type: 'number', defaultValue: 8 }
    ],
    formula: 'KE = 0.5 * m * v² \nPE = m * g * h (g = 9.81 m/s²)',
    explanation: 'Kinetic Energy represents energy in motion. Gravitational Potential Energy measures stored energy relative to physical height elevation.',
    example: 'A 5 kg mass at 10 m/s velocity has a Kinetic Energy of 250 Joules. At 8 meters height, its Potential Energy is 392.4 Joules.',
    faq: [
      { question: 'What is the law of conservation of energy?', answer: 'Energy cannot be created or destroyed, only transformed from one form to another, such as potential energy turning into kinetic energy during freefall.' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-work-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.mass) || 0;
      const v = Number(inputs.velocity) || 0;
      const h = Number(inputs.height) || 0;
      const g = 9.81;

      const ke = 0.5 * m * v * v;
      const pe = m * g * h;
      const total = ke + pe;

      return {
        results: [
          { label: 'Kinetic Energy (KE)', value: ke.toFixed(2), unit: 'J', isPrimary: true },
          { label: 'Potential Energy (PE)', value: pe.toFixed(2), unit: 'J' },
          { label: 'Total Mechanical Energy', value: total.toFixed(2), unit: 'J' }
        ],
        chartData: [
          { name: 'Kinetic', value: ke, color: '#39FF14' },
          { name: 'Potential', value: pe, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'physics-work',
    name: 'Work Calculator',
    slug: 'physics-work-calculator',
    category: 'science',
    description: 'Calculate physical work done by a force over a distance, complete with relative angles.',
    seoTitle: 'Physics Work Done Calculator | Calculatoora',
    seoDescription: 'Calculate work done (W = F * d * cos θ) easily. Includes simple force/displacement and angular vectors.',
    inputs: [
      { id: 'force', label: 'Force (N)', type: 'number', defaultValue: 30 },
      { id: 'displacement', label: 'Displacement (m)', type: 'number', defaultValue: 12 },
      { id: 'angle', label: 'Angle of Force (Degrees θ)', type: 'number', defaultValue: 0 }
    ],
    formula: 'W = F * d * cos(θ)',
    explanation: 'Work measures energy transferred when an applied force moves an object across a measurable distance.',
    example: 'Applying 30 N over 12 m at a parallel angle (0°) yields 360 Joules of physical work.',
    faq: [
      { question: 'What does a negative work value mean?', answer: 'Negative work occurs when the acting force opposes the direction of movement (e.g., friction on a moving cart).' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-power-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.force) || 0;
      const d = Number(inputs.displacement) || 0;
      const deg = Number(inputs.angle) || 0;

      const rad = (deg * Math.PI) / 180;
      const work = f * d * Math.cos(rad);

      return {
        results: [
          { label: 'Work Done (W)', value: work.toFixed(2), unit: 'J', isPrimary: true },
          { label: 'Cosine Component (cos θ)', value: Math.cos(rad).toFixed(4) }
        ],
        chartData: [
          { name: 'Effective Work', value: Math.max(0, work), color: '#39FF14' },
          { name: 'Force Vector', value: f, color: '#a855f7' }
        ]
      };
    }
  },
  {
    id: 'physics-power',
    name: 'Power Calculator',
    slug: 'physics-power-calculator',
    category: 'science',
    description: 'Determine mechanical or electrical power from work performed or energy consumed over time.',
    seoTitle: 'Physics Power Calculator | Calculatoora',
    seoDescription: 'Determine power in Watts, kilowatts, and Horsepower. Work/Time configurations solved instantly.',
    inputs: [
      { id: 'work', label: 'Work Done (J) or Energy (J)', type: 'number', defaultValue: 1500 },
      { id: 'time', label: 'Time Elapsed (Seconds)', type: 'number', defaultValue: 5, min: 0.001 }
    ],
    formula: 'Power (P) = Work (W) / Time (t)',
    explanation: 'Power is the rate at which work is executed or energy is converted over a defined duration.',
    example: 'Performing 1500 J of work inside 5 seconds registers 300 Watts of kinetic power.',
    faq: [
      { question: 'How is Watts related to Horsepower?', answer: 'One mechanical Horsepower (hp) is equivalent to approximately 745.7 Watts.' }
    ],
    relatedSlugs: ['physics-work-calculator', 'electrical-power-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.work) || 0;
      const t = Number(inputs.time) || 1;

      const power = w / t;
      const hp = power / 745.7;

      return {
        results: [
          { label: 'Power output', value: power.toFixed(2), unit: 'W', isPrimary: true },
          { label: 'Power (Kilowatts)', value: (power / 1000).toFixed(4), unit: 'kW' },
          { label: 'Equivalent Horsepower', value: hp.toFixed(3), unit: 'hp' }
        ],
        chartData: [
          { name: 'Time factor', value: t, color: '#3b82f6' },
          { name: 'Power magnitude', value: power, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'physics-velocity',
    name: 'Velocity Calculator',
    slug: 'physics-velocity-calculator',
    category: 'science',
    description: 'Calculate elapsed velocity, initial displacement, or timing intervals for simple physics systems.',
    seoTitle: 'Average Speed & Velocity Calculator | Calculatoora',
    seoDescription: 'Obtain average swiftness, displacement, or timeline intervals from simple vector parameters.',
    inputs: [
      { id: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'v', options: [
        { label: 'Velocity (v)', value: 'v' },
        { label: 'Distance / Displacement (d)', value: 'd' },
        { label: 'Time (t)', value: 't' }
      ]},
      { id: 'velocity', label: 'Velocity (m/s)', type: 'number', defaultValue: 25 },
      { id: 'distance', label: 'Distance / Displacement (m)', type: 'number', defaultValue: 500 },
      { id: 'time', label: 'Time Elapsed (s)', type: 'number', defaultValue: 20 }
    ],
    formula: 'v = d / t \n(d = v * t, t = d / v)',
    explanation: 'Velocity measures displacement change over time in a particular directional vector.',
    example: 'Traveling 500 meters in 20 seconds equates to an average velocity of 25.0 m/s.',
    faq: [
      { question: 'What is the speed of light?', answer: 'The universal constant speed of light is approximately 299,792,458 m/s.' }
    ],
    relatedSlugs: ['physics-acceleration-calculator', 'wave-speed-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'v';
      const v = Number(inputs.velocity) || 0;
      const d = Number(inputs.distance) || 0;
      const t = Number(inputs.time) || 1;

      let res = 0;
      let label = '';
      let unit = '';

      if (solve === 'v') {
        res = t !== 0 ? d / t : 0;
        label = 'Velocity';
        unit = 'm/s';
      } else if (solve === 'd') {
        res = v * t;
        label = 'Distance / Displacement';
        unit = 'm';
      } else {
        res = v !== 0 ? d / v : 0;
        label = 'Required Time';
        unit = 's';
      }

      return {
        results: [
          { label, value: res.toFixed(2), unit, isPrimary: true },
          { label: 'In Kilometers/Hour (km/h)', value: solve === 'v' ? ((d / t) * 3.6).toFixed(2) : 'N/A' }
        ]
      };
    }
  },
  {
    id: 'physics-acceleration',
    name: 'Acceleration Calculator',
    slug: 'physics-acceleration-calculator',
    category: 'science',
    description: 'Calculate average linear acceleration from initial velocity, terminal speed, and change in time.',
    seoTitle: 'Linear Acceleration Formula Solver | Calculatoora',
    seoDescription: 'Find average speed accelerations based on initial and final velocities over elapsed durations.',
    inputs: [
      { id: 'v0', label: 'Initial Velocity (m/s)', type: 'number', defaultValue: 0 },
      { id: 'v1', label: 'Final Velocity (m/s)', type: 'number', defaultValue: 30 },
      { id: 'time', label: 'Time Interval (Seconds)', type: 'number', defaultValue: 6, min: 0.001 }
    ],
    formula: 'a = (v_final - v_initial) / t',
    explanation: 'Acceleration designates the rate of change of an object’s velocity vector relative to a timeframe.',
    example: 'Accelerating from 0 to 30 m/s in 6 seconds yields an acceleration of 5.0 m/s².',
    faq: [
      { question: 'What does a negative acceleration mean?', answer: 'A negative acceleration indicates that the speed in the positive direction is decreasing, often referred to as deceleration.' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-velocity-calculator'],
    calculate: (inputs) => {
      const v0 = Number(inputs.v0) || 0;
      const v1 = Number(inputs.v1) || 0;
      const t = Number(inputs.time) || 1;

      const acc = (v1 - v0) / t;

      return {
        results: [
          { label: 'Average Acceleration', value: acc.toFixed(3), unit: 'm/s²', isPrimary: true },
          { label: 'Velocity Shift Amount', value: (v1 - v0).toFixed(1), unit: 'm/s' }
        ],
        chartData: [
          { name: 'Initial Velocity', value: v0, color: '#3b82f6' },
          { name: 'Final Velocity', value: v1, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'physics-momentum',
    name: 'Momentum Calculator',
    slug: 'physics-momentum-calculator',
    category: 'science',
    description: 'Calculate momentum, mass, or velocity of moving bodies using the classic equation (p = m * v).',
    seoTitle: 'Physics Momentum (p = m*v) Solver | Calculatoora',
    seoDescription: 'Obtain mass momentum parameters instantly. Perfect for crash vectors and kinetic impulse math.',
    inputs: [
      { id: 'mass', label: 'Object Mass (kg)', type: 'number', defaultValue: 80 },
      { id: 'velocity', label: 'Velocity Speed (m/s)', type: 'number', defaultValue: 12 }
    ],
    formula: 'p = m * v',
    explanation: 'Momentum measures the mass of an object in motion. It takes more force to halt an object with higher momentum.',
    example: 'An 80 kg runner running at 12 m/s holds 960 kg·m/s of momentum.',
    faq: [
      { question: 'Is momentum conserved?', answer: 'Yes, inside isolated systems, the overall momentum of intersecting parts remains fixed (Law of Conservation of Momentum).' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-velocity-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.mass) || 0;
      const v = Number(inputs.velocity) || 0;
      const p = m * v;

      return {
        results: [
          { label: 'Calculated Momentum (p)', value: p.toFixed(2), unit: 'kg·m/s', isPrimary: true },
          { label: 'Equivalent Impulse', value: p.toFixed(2), unit: 'N·s' }
        ],
        chartData: [
          { name: 'Mass Factor', value: m, color: '#3b82f6' },
          { name: 'Velocity Factor', value: v, color: '#eab308' },
          { name: 'Momentum', value: p, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'physics-pressure',
    name: 'Pressure Calculator',
    slug: 'physics-pressure-calculator',
    category: 'science',
    description: 'Calculate physical pressure (P = F / A) acting on a surface area, with full physical unit scaling.',
    seoTitle: 'Pressure & Area Force Calculator | Calculatoora',
    seoDescription: 'Verify pressure across variable boundaries in Pascals, PSI, and Bar units.',
    inputs: [
      { id: 'force', label: 'Applied Force (N)', type: 'number', defaultValue: 150 },
      { id: 'area', label: 'Surface Area (m²)', type: 'number', defaultValue: 0.5, min: 0.0001 }
    ],
    formula: 'Pressure (P) = Force (F) / Area (A)',
    explanation: 'Pressure measures force applied uniformly over a surface boundary. Concentrating the same force on a smaller area raises total pressure.',
    example: 'A force of 150 N spread across 0.5 m² produces a pressure of 300 Pascals (Pa).',
    faq: [
      { question: 'What is atmospheric pressure?', answer: 'Average sea level air pressure holds steady at 101,325 Pa, or 1 atmosphere (atm).' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-density-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.force) || 0;
      const a = Number(inputs.area) || 1;

      const pressure = f / a; // Pa
      const psi = pressure * 0.0001450377;
      const bar = pressure / 100000;

      return {
        results: [
          { label: 'Pressure (P)', value: pressure.toFixed(2), unit: 'Pa (N/m²)', isPrimary: true },
          { label: 'In PSI units', value: psi.toFixed(5), unit: 'lb/in²' },
          { label: 'In Bar scale', value: bar.toFixed(5), unit: 'bar' }
        ],
        chartData: [
          { name: 'Area (m²)', value: a, color: '#3b82f6' },
          { name: 'Force (N)', value: f, color: '#eef2f6' }
        ]
      };
    }
  },
  {
    id: 'physics-density',
    name: 'Density Calculator',
    slug: 'physics-density-calculator',
    category: 'science',
    description: 'Find substance density, mass volume, or water buoyancy parameters using the equation D = m / V.',
    seoTitle: 'Substance Density (D = m/V) Solver | Calculatoora',
    seoDescription: 'Input volumetric mass to solve density limits. Perfect for fluid statics research.',
    inputs: [
      { id: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'd', options: [
        { label: 'Density (D)', value: 'd' },
        { label: 'Mass (m)', value: 'm' },
        { label: 'Volume (V)', value: 'v' }
      ]},
      { id: 'density', label: 'Density (kg/m³)', type: 'number', defaultValue: 1000, helpText: 'Pure water has density ~1000 kg/m³' },
      { id: 'mass', label: 'Mass (kg)', type: 'number', defaultValue: 250 },
      { id: 'volume', label: 'Volume (m³)', type: 'number', defaultValue: 0.25 }
    ],
    formula: 'Density (D) = Mass (m) / Volume (V)',
    explanation: 'Density signifies how compactly mass is packed together inside a specified geometric volume.',
    example: 'A block of mass 250 kg occupying 0.25 m³ has a density of 1000 kg/m³, matching pure water.',
    faq: [
      { question: 'Will an object float in water?', answer: 'Objects float if their density is less than water’s density (1000 kg/m³), and sink if their density exceeds it.' }
    ],
    relatedSlugs: ['physics-pressure-calculator', 'material-weight-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'd';
      const d = Number(inputs.density) || 1;
      const m = Number(inputs.mass) || 0;
      const v = Number(inputs.volume) || 1;

      let res = 0;
      let label = '';
      let unit = '';

      if (solve === 'd') {
        res = v !== 0 ? m / v : 0;
        label = 'Material Density';
        unit = 'kg/m³';
      } else if (solve === 'm') {
        res = d * v;
        label = 'Material Mass';
        unit = 'kg';
      } else {
        res = d !== 0 ? m / d : 0;
        label = 'Occupied Volume';
        unit = 'm³';
      }

      return {
        results: [
          { label, value: res.toFixed(3), unit, isPrimary: true },
          { label: 'Water relative specific gravity', value: (solve === 'd' ? (m/v)/1000 : d/1000).toFixed(3) }
        ]
      };
    }
  },
  {
    id: 'physics-gravity',
    name: 'Gravity Force Calculator',
    slug: 'physics-gravity-calculator',
    category: 'science',
    description: 'Calculate Gravitational Pull between two cosmic masses separated by a defined orbital gap.',
    seoTitle: 'Universal Gravitational Attraction Solver | Calculatoora',
    seoDescription: 'Input target planet masses and distance parameters to calculate gravitational force vectors via Newton’s Law.',
    inputs: [
      { id: 'm1', label: 'Mass of Body 1 (kg)', type: 'number', defaultValue: 5.972e24, helpText: 'e.g., Earth: 5.97e24' },
      { id: 'm2', label: 'Mass of Body 2 (kg)', type: 'number', defaultValue: 7.348e22, helpText: 'e.g., Moon: 7.35e22' },
      { id: 'radius', label: 'Separation Distance (Meters)', type: 'number', defaultValue: 384400000, helpText: 'e.g., Earth-Moon: 3.84e8 m' }
    ],
    formula: 'F = G * (m1 * m2) / r² \n(G = 6.6743 × 10^-11 m³/kg·s²)',
    explanation: 'Newton’s Law of Universal Gravitation shows the attractive pull acting between all bodies of mass everywhere.',
    example: 'Earth and the Moon attract each other with a massive force of roughly 1.98 × 10^20 Newtons.',
    faq: [
      { question: 'What is the gravitational constant G?', answer: 'G is a physical constant measuring 6.6743 × 10^-11 N·m²/kg², distinct from local planet acceleration g (~9.81 m/s²).' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-acceleration-calculator'],
    calculate: (inputs) => {
      const m1 = Number(inputs.m1) || 1;
      const m2 = Number(inputs.m2) || 1;
      const r = Number(inputs.radius) || 1;
      const G = 6.6743e-11;

      const f = G * (m1 * m2) / (r * r);

      return {
        results: [
          { label: 'Gravitational Pull (F)', value: f.toExponential(4), unit: 'N', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'physics-friction',
    name: 'Friction Force Calculator',
    slug: 'physics-friction-calculator',
    category: 'science',
    description: 'Obtain Friction threshold bounds based on surface contact coefficients and normal force masses.',
    seoTitle: 'Static & Kinetic Friction Force Calculator | Calculatoora',
    seoDescription: 'Input normal weights and friction coefficients to isolate resistance forces.',
    inputs: [
      { id: 'coeff', label: 'Friction Coefficient (μ)', type: 'number', defaultValue: 0.4, min: 0, max: 2, step: 0.05 },
      { id: 'normal', label: 'Normal Force (N)', type: 'number', defaultValue: 200 }
    ],
    formula: 'F_fric = μ * F_normal',
    explanation: 'Friction acts to oppose motion between contacting flat layers. Coefficients (μ) alter limits based on material friction roughness.',
    example: 'A crate bearing 200 N normal force over a wood floor (coefficient 0.4) demands 80 N of force to slide.',
    faq: [
      { question: 'Friction coefficient limits?', answer: 'Rough rubber can have a coefficient greater than 1.0, while ice slides near 0.05.' }
    ],
    relatedSlugs: ['physics-force-calculator', 'physics-work-calculator'],
    calculate: (inputs) => {
      const mu = Number(inputs.coeff) || 0;
      const normal = Number(inputs.normal) || 0;
      const fric = mu * normal;

      return {
        results: [
          { label: 'Frictional Resistance Force', value: fric.toFixed(2), unit: 'N', isPrimary: true },
          { label: 'Normal force mass equivalent', value: (normal / 9.81).toFixed(2), unit: 'kg' }
        ],
        chartData: [
          { name: 'Normal Force (N)', value: normal, color: '#3b82f6' },
          { name: 'Frictional resistance (N)', value: fric, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'physics-torque',
    name: 'Torque Calculator',
    slug: 'physics-torque-calculator',
    category: 'science',
    description: 'Evaluate physical rotating forces (Torque = F * r * sin θ) with angular vectors.',
    seoTitle: 'Rotational Torque Force Calculator | Calculatoora',
    seoDescription: 'Measure wrench torque or lever rotational parameters instantly in Newton-meters.',
    inputs: [
      { id: 'force', label: 'Applied Force (N)', type: 'number', defaultValue: 50 },
      { id: 'radius', label: 'Lever Arm Radius (Meters)', type: 'number', defaultValue: 0.3 },
      { id: 'angle', label: 'Angle of Application (Degrees θ)', type: 'number', defaultValue: 90 }
    ],
    formula: 'τ = F * r * sin(θ)',
    explanation: 'Torque represents rotational vector force. Maximum effectiveness is achieved when applying force at 90 degrees.',
    example: 'Applying 50 N at 90° on a 0.3 meter wrench provides 15.0 Newton-meters of rotational torque.',
    faq: [
      { question: 'What is torque equivalent in Imperial?', answer: 'Torque in Newton-meters (N·m) is equivalent to 0.73756 lb-ft.' }
    ],
    relatedSlugs: ['physics-force-calculator', 'gear-ratio-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.force) || 0;
      const r = Number(inputs.radius) || 0;
      const deg = Number(inputs.angle) || 90;

      const rad = (deg * Math.PI) / 180;
      const t = f * r * Math.sin(rad);

      return {
        results: [
          { label: 'Rotational Torque (τ)', value: t.toFixed(3), unit: 'N·m', isPrimary: true },
          { label: 'Imperial Foot-pounds', value: (t * 0.73756).toFixed(3), unit: 'lb-ft' }
        ],
        chartData: [
          { name: 'Rotary torque', value: t, color: '#39FF14' },
          { name: 'Lever radius (m)', value: r * 100, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'physics-frequency',
    name: 'Frequency Calculator',
    slug: 'physics-frequency-calculator',
    category: 'science',
    description: 'Convert wave cycle intervals or compute overall frequency thresholds from elapsed time parameters.',
    seoTitle: 'Wave Frequency & Hertz Calculator | Calculatoora',
    seoDescription: 'Solve cycle frequencies (f = 1/T) instantly in Hertz, MegaHertz or nano-limits.',
    inputs: [
      { id: 'period', label: 'Cycle Period (Seconds T)', type: 'number', defaultValue: 0.02, min: 0.0000001 }
    ],
    formula: 'Frequency (f) = 1 / Period (T)',
    explanation: 'Frequency tracks complete wave oscillations achieved within one standard second.',
    example: 'An oscillation period of 0.02 seconds defines a target frequency of exactly 50 Hertz (Hz).',
    faq: [
      { question: 'What is Hertz (Hz)?', answer: 'Hertz is the international unit of frequency, signifying one cycle per second.' }
    ],
    relatedSlugs: ['wavelength-calculator', 'wave-speed-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.period) || 1;
      const f = 1 / p;

      return {
        results: [
          { label: 'Frequency (f)', value: f.toFixed(2), unit: 'Hz', isPrimary: true },
          { label: 'Kilohertz', value: (f / 1000).toFixed(4), unit: 'kHz' },
          { label: 'Megahertz', value: (f / 1000000).toFixed(6), unit: 'MHz' }
        ]
      };
    }
  },
  {
    id: 'physics-wave-speed',
    name: 'Wave Speed Calculator',
    slug: 'wave-speed-calculator',
    category: 'science',
    description: 'Pinpoint acoustic or electromagnetic wave velocities knowing wave cycle wavelengths and frequencies.',
    seoTitle: 'Wave velocity (v = f * λ) Solver | Calculatoora',
    seoDescription: 'Obtain propagation speed velocities easily by combining frequency and wavelength.',
    inputs: [
      { id: 'freq', label: 'Frequency (Hz)', type: 'number', defaultValue: 440 },
      { id: 'wavelength', label: 'Wavelength (Meters λ)', type: 'number', defaultValue: 0.78 }
    ],
    formula: 'v = f * λ',
    explanation: 'Propagating speed tells how fast an auditory or electromagnetic pulse progresses through physical dimensions.',
    example: 'A 440 Hz sound wave spanning 0.78 meters wavelength travels at 343.2 m/s (approximating sound speed in 20°C air).',
    faq: [
      { question: 'What determines wave speed?', answer: 'The medium determines wave speed (e.g. sound travels faster in steel than in water, and water faster than air).' }
    ],
    relatedSlugs: ['physics-frequency-calculator', 'wavelength-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.freq) || 1;
      const w = Number(inputs.wavelength) || 0;
      const speed = f * w;

      return {
        results: [
          { label: 'Wave Velocity (v)', value: speed.toFixed(2), unit: 'm/s', isPrimary: true },
          { label: 'In km/h equivalence', value: (speed * 3.6).toFixed(1), unit: 'km/h' }
        ]
      };
    }
  },
  {
    id: 'physics-wavelength',
    name: 'Wavelength Calculator',
    slug: 'wavelength-calculator',
    category: 'science',
    description: 'Solve physical wavelengths (λ = v / f) across electromagnetics or standard sound waves.',
    seoTitle: 'Acoustic & Optics Wavelength Solver | Calculatoora',
    seoDescription: 'Identify geometric wave cycle wavelength bounds instantly.',
    inputs: [
      { id: 'speed', label: 'Wave Speed / Velocity (m/s)', type: 'number', defaultValue: 343 },
      { id: 'frequency', label: 'Frequency (Hz)', type: 'number', defaultValue: 1000 }
    ],
    formula: 'λ = v / f',
    explanation: 'Wavelength evaluates physical distance parameters separating sequential repeating nodes in waves.',
    example: 'A wave speeding at 343 m/s oscillating at 1000 Hz prints a wavelength of 0.343 meters (or 34.3 centimeters).',
    faq: [
      { question: 'Visible light wavelengths?', answer: 'Human sight limits distinguish wavelengths roughly between 400 nanometers (violet) and 700 nanometers (red).' }
    ],
    relatedSlugs: ['physics-frequency-calculator', 'wave-speed-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.speed) || 343;
      const f = Number(inputs.frequency) || 1;
      const l = v / f;

      return {
        results: [
          { label: 'Calculated Wavelength (λ)', value: l.toFixed(5), unit: 'm', isPrimary: true },
          { label: 'In Centimeters', value: (l * 100).toFixed(3), unit: 'cm' },
          { label: 'In Millimeters', value: (l * 1000).toFixed(2), unit: 'mm' }
        ]
      };
    }
  },
  {
    id: 'physics-heat-energy',
    name: 'Heat Energy Calculator',
    slug: 'heat-energy-calculator',
    category: 'science',
    description: 'Solve latent specific thermal limits to heat materials using specific heat constants.',
    seoTitle: 'Specific Heat Energy (Q = m*c*ΔT) Solver | Calculatoora',
    seoDescription: 'Track raw heat Joules required to adjust solid or liquid temperatures.',
    inputs: [
      { id: 'mass', label: 'Material Mass (kg)', type: 'number', defaultValue: 2 },
      { id: 'shc', label: 'Specific Heat Capacity (J/kg·°C)', type: 'number', defaultValue: 4184, helpText: 'Water = ~4184 J/kg·°C' },
      { id: 'tempDiff', label: 'Temperature Shift Range (°C ΔT)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Q = m * c * ΔT',
    explanation: 'Thermal energy transfers change temperatures based on mass and specific heat coefficients unique to each substance.',
    example: 'Elevating 2 kg of water by 15°C demands 125,520 Joules of heat energy.',
    faq: [
      { question: 'What is Specific Heat Capacity?', answer: 'Specific heat capacity represents thermal quantity needed to shift 1 kg of an element by 1 degree Celsius.' }
    ],
    relatedSlugs: ['physics-energy-calculator', 'physics-temperature-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.mass) || 0;
      const c = Number(inputs.shc) || 0;
      const t = Number(inputs.tempDiff) || 0;

      const q = m * c * t;

      return {
        results: [
          { label: 'Required Heat Energy (Q)', value: q.toFixed(1), unit: 'Joules', isPrimary: true },
          { label: 'In Kilojoules (kJ)', value: (q / 1000).toFixed(3), unit: 'kJ' },
          { label: 'Equivalent Kilocalories (kcal)', value: (q / 4184).toFixed(2), unit: 'kcal' }
        ]
      };
    }
  },
  {
    id: 'physics-temperature',
    name: 'Temperature Calculator',
    slug: 'physics-temperature-calculator',
    category: 'science',
    description: 'Transform heat indicators instantly between Celsius, Fahrenheit and Kelvin scales.',
    seoTitle: 'Celsius to Fahrenheit & Kelvin Converter | Calculatoora',
    seoDescription: 'Transform metric and imperial temperature values. Multi-system temperature calculator.',
    inputs: [
      { id: 'inputTemp', label: 'Source Temperature Value', type: 'number', defaultValue: 100 },
      { id: 'unit', label: 'Source Unit Scale', type: 'select', defaultValue: 'c', options: [
        { label: 'Celsius (°C)', value: 'c' },
        { label: 'Fahrenheit (°F)', value: 'f' },
        { label: 'Kelvin (K)', value: 'k' }
      ]}
    ],
    formula: 'F = C * 1.8 + 32 \nK = C + 273.15',
    explanation: 'Quickly map thermal references. Perfect for cooking metrics, academic science tasks, and meteorological lookups.',
    example: '100 degrees Celsius translates to exactly 212 degrees Fahrenheit, or 373.15 Kelvin.',
    faq: [
      { question: 'What is absolute zero?', answer: 'Absolute zero (0 K, -273.15°C, or -459.67°F) is the theoretical lowest limit of temperature where thermodynamic action stops.' }
    ],
    relatedSlugs: ['heat-energy-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.inputTemp) || 0;
      const u = inputs.unit || 'c';

      let c = 0;
      let f = 0;
      let k = 0;

      if (u === 'c') {
        c = v;
        f = v * 1.8 + 32;
        k = v + 273.15;
      } else if (u === 'f') {
        c = (v - 32) / 1.8;
        f = v;
        k = c + 273.15;
      } else {
        c = v - 273.15;
        f = c * 1.8 + 32;
        k = v;
      }

      return {
        results: [
          { label: 'Celsius Value', value: c.toFixed(2), unit: '°C', isPrimary: u === 'c' },
          { label: 'Fahrenheit Value', value: f.toFixed(2), unit: '°F', isPrimary: u === 'f' },
          { label: 'Kelvin Value', value: k.toFixed(2), unit: 'K', isPrimary: u === 'k' }
        ]
      };
    }
  },
  {
    id: 'physics-ohms-law',
    name: 'Ohm’s Law Calculator',
    slug: 'physics-ohms-law-calculator',
    category: 'science',
    description: 'Solve the foundational electronics equation (V = I * R) evaluating circuits.',
    seoTitle: 'Ohm’s Law Electronics Solver | Calculatoora',
    seoDescription: 'Obtain voltage, current, or electrical resistance parameters easily for electronics design.',
    inputs: [
      { id: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'v', options: [
        { label: 'Voltage (V)', value: 'v' },
        { label: 'Current (I)', value: 'i' },
        { label: 'Resistance (R)', value: 'r' }
      ]},
      { id: 'voltage', label: 'Voltage (Volts)', type: 'number', defaultValue: 12 },
      { id: 'current', label: 'Current (Amperes)', type: 'number', defaultValue: 2 },
      { id: 'resistance', label: 'Resistance (Ohms Ω)', type: 'number', defaultValue: 6 }
    ],
    formula: 'V = I * R \n(I = V/R, R = V/I)',
    explanation: 'Ohm’s Law establishes relationships binding electrical pressure (Voltage), flow rates (Current), and medium bottlenecks (Resistance).',
    example: 'Drawing 2 Amps of current across a 6 Ohm resistance demands 12 Volts of initial electrical pressure.',
    faq: [
      { question: 'What is electrical current?', answer: 'Current describes physical electron flow volumes advancing past a copper point per second, measured in Amps.' }
    ],
    relatedSlugs: ['physics-voltage-calculator', 'electric-power-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'v';
      const v = Number(inputs.voltage) || 0;
      const i = Number(inputs.current) || 0;
      const r = Number(inputs.resistance) || 1;

      let res = 0;
      let label = '';
      let unit = '';

      if (solve === 'v') {
        res = i * r;
        label = 'Voltage';
        unit = 'Volts (V)';
      } else if (solve === 'i') {
        res = r !== 0 ? v / r : 0;
        label = 'Electrical Current';
        unit = 'Amperes (A)';
      } else {
        res = i !== 0 ? v / i : 0;
        label = 'Resistance';
        unit = 'Ohms (Ω)';
      }

      return {
        results: [
          { label, value: res.toFixed(3), unit, isPrimary: true }
        ],
        chartData: [
          { name: 'Voltage (V)', value: v, color: '#39FF14' },
          { name: 'Current (A)', value: i, color: '#3b82f6' },
          { name: 'Resistance (Ω)', value: r, color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'physics-ohms-voltage',
    name: 'Voltage Calculator',
    slug: 'physics-voltage-calculator',
    category: 'science',
    description: 'Calculate voltage potential drop using electrical resistance values and current rates.',
    seoTitle: 'Voltage Drop & Power potential Solver | Calculatoora',
    seoDescription: 'Obtain precise circuit voltages. Ideal for home engineering and DIY repairs.',
    inputs: [
      { id: 'current', label: 'Current (Amps)', type: 'number', defaultValue: 1.5 },
      { id: 'resistance', label: 'Resistance (Ohms)', type: 'number', defaultValue: 8 }
    ],
    formula: 'V = I * R',
    explanation: 'Voltage establishes the electrical pressure potential difference pushing electrons along conductors.',
    example: '1.5 Amps passing through an 8 Ohm lightbulb creates a voltage drop of 12 Volts.',
    faq: [
      { question: 'What causes voltage drop?', answer: 'Resistance in long wires consumes voltage energy, reducing terminal voltage potential at point components.' }
    ],
    relatedSlugs: ['physics-ohms-law-calculator', 'electric-power-calculator'],
    calculate: (inputs) => {
      const i = Number(inputs.current) || 0;
      const r = Number(inputs.resistance) || 0;
      const v = i * r;

      return {
        results: [
          { label: 'Voltage Potential (V)', value: v.toFixed(3), unit: 'Volts', isPrimary: true },
          { label: 'Total power generated', value: (v * i).toFixed(2), unit: 'Watts' }
        ]
      };
    }
  },
  {
    id: 'physics-ohms-current',
    name: 'Current Calculator',
    slug: 'physics-current-calculator',
    category: 'science',
    description: 'Solve for electrical current flows knowing circuit voltage pressures and terminal wire blockages.',
    seoTitle: 'Electrical Current Flow Calculator | Calculatoora',
    seoDescription: 'Calculate amperage limits in electronics systems. Fast and simple calculations.',
    inputs: [
      { id: 'voltage', label: 'Voltage Pressure (V)', type: 'number', defaultValue: 120 },
      { id: 'resistance', label: 'Resistance (Ω)', type: 'number', defaultValue: 24 }
    ],
    formula: 'I = V / R',
    explanation: 'Ampere current levels reflect electrical volumes passing along power lines. Decreasing inline bottlenecks raises electrical currents.',
    example: 'Forming a circuit of 24 Ohms across 120 Volts draws 5 Amperes of current.',
    faq: [
      { question: 'What is a fuse?', answer: 'A safety strip built to melt and break circuit connections if currents exceed unsafe margins.' }
    ],
    relatedSlugs: ['physics-ohms-law-calculator', 'physics-resistance-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.voltage) || 0;
      const r = Number(inputs.resistance) || 1;
      const i = v / r;

      return {
        results: [
          { label: 'Electrical Current (I)', value: i.toFixed(3), unit: 'Amperes', isPrimary: true }
        ],
        chartData: [
          { name: 'Current Intensity', value: i, color: '#39FF14' },
          { name: 'Resistance (Ω)', value: r, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'physics-ohms-resistance',
    name: 'Resistance Calculator',
    slug: 'physics-resistance-calculator',
    category: 'science',
    description: 'Solve for the electrical resistance needed to restrict current draw under set voltages.',
    seoTitle: 'Inline Electrical Resistance Solver | Calculatoora',
    seoDescription: 'Determine circuit resistors required in Ohms using Ohm’s Law calculations.',
    inputs: [
      { id: 'voltage', label: 'Voltage Source (V)', type: 'number', defaultValue: 5 },
      { id: 'current', label: 'Target Current (Amps)', type: 'number', defaultValue: 0.02, helpText: 'e.g., standard LED = 0.02 A (20mA)' }
    ],
    formula: 'R = V / I',
    explanation: 'Resistance measures material opposition to electric currents. It defines how much voltage is required to force an Amp along a path.',
    example: 'Hooking up a smart LED pulling 0.02 Amps onto a 5 Volt pin demands 250 Ohms of circuit restriction.',
    faq: [
      { question: 'What is a superconductor?', answer: 'Materials cooled below extreme temp limits that register zero inline electrical resistance.' }
    ],
    relatedSlugs: ['physics-ohms-law-calculator', 'physics-current-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.voltage) || 0;
      const i = Number(inputs.current) || 1;
      const r = v / i;

      return {
        results: [
          { label: 'Required Resistance (R)', value: r.toFixed(2), unit: 'Ohms (Ω)', isPrimary: true },
          { label: 'Minimum safe resistor wattage', value: (v * i).toFixed(4), unit: 'Watts' }
        ]
      };
    }
  },
  {
    id: 'physics-volt-power',
    name: 'Electric Power Calculator',
    slug: 'electric-power-calculator',
    category: 'science',
    description: 'Calculate raw electric power variables combining voltage, current, and resistances.',
    seoTitle: 'Electric Power (P = V * I) Solver | Calculatoora',
    seoDescription: 'Obtain watt power outputs, currents, and voltage drop rates of electronic circuits.',
    inputs: [
      { id: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'p', options: [
        { label: 'Power (Watts - P)', value: 'p' },
        { label: 'Voltage (Volts - V)', value: 'v' },
        { label: 'Current (Amps - I)', value: 'i' }
      ]},
      { id: 'power', label: 'Power (W)', type: 'number', defaultValue: 60 },
      { id: 'voltage', label: 'Voltage (V)', type: 'number', defaultValue: 120 },
      { id: 'current', label: 'Current (A)', type: 'number', defaultValue: 0.5 }
    ],
    formula: 'P = I * V \n(P = I² * R, P = V² / R)',
    explanation: 'Electric Power registers the physical energy rate of conversion in circuits. It tells you electricity usage volumes over time.',
    example: 'A lightbulb drawing 0.5 Amps on 120 Volts uses 60 Watts of electrical power.',
    faq: [
      { question: 'What is a Kilowatt-hour?', answer: 'One Kilowatt-hour is equivalent to 1000 Watts drawing energy steadily over one full hour.' }
    ],
    relatedSlugs: ['physics-ohms-law-calculator', 'physics-power-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'p';
      const p = Number(inputs.power) || 0;
      const v = Number(inputs.voltage) || 0;
      const i = Number(inputs.current) || 1;

      let res = 0;
      let label = '';
      let unit = '';

      if (solve === 'p') {
        res = v * i;
        label = 'Electric Power';
        unit = 'W';
      } else if (solve === 'v') {
        res = i !== 0 ? p / i : 0;
        label = 'Required Voltage';
        unit = 'V';
      } else {
        res = v !== 0 ? p / v : 0;
        label = 'Required Current';
        unit = 'A';
      }

      return {
        results: [
          { label, value: res.toFixed(3), unit, isPrimary: true }
        ],
        chartData: [
          { name: 'Power W', value: solve === 'p' ? v * i : p, color: '#39FF14' },
          { name: 'Voltage V', value: v, color: '#3b82f6' }
        ]
      };
    }
  },

  // ====================================== CHEMISTRY ======================================
  {
    id: 'chem-molar-mass',
    name: 'Molar Mass Calculator',
    slug: 'molar-mass-calculator',
    category: 'science',
    description: 'Build chemical element layouts and isolate total molar mass weight averages in g/mol.',
    seoTitle: 'Molecular & Molar Mass Weight Solver | Calculatoora',
    seoDescription: 'Obtain exact molecular masses of compounds instantly to assist in stoichiometric chemistry problems.',
    inputs: [
      { id: 'compound', label: 'Compound Selection', type: 'select', defaultValue: 'H2O', options: [
        { label: 'Water (H₂O)', value: 'H2O' },
        { label: 'Carbon Dioxide (CO₂)', value: 'CO2' },
        { label: 'Glucose (C₆H₁₂O₆)', value: 'sugar' },
        { label: 'Ethanol (C₂H₅OH)', value: 'ethanol' },
        { label: 'Sodium Chloride (NaCl)', value: 'salt' },
        { label: 'Methane (CH₄)', value: 'methane' }
      ]}
    ],
    formula: 'M = Sum of (Atomic Weight * Element Count)',
    explanation: 'Molar mass lists total mass in grams of one mole of compound elements.',
    example: 'Standard Water (H₂O) weighs exactly 18.015 g/mol (2 x Hydrogen @ 1.008 + 1 x Oxygen @ 15.999).',
    faq: [
      { question: 'What is Avogadro’s Constant?', answer: 'The exact number of molecules inside one element mole: 6.02214 × 10^23 particles.' }
    ],
    relatedSlugs: ['chem-mole-calculator', 'chem-molarity-calculator'],
    calculate: (inputs) => {
      const comp = inputs.compound || 'H2O';
      let mass = 18.015;
      let label = 'Water';

      if (comp === 'CO2') {
        mass = 44.01;
        label = 'Carbon Dioxide';
      } else if (comp === 'sugar') {
        mass = 180.16;
        label = 'Glucose';
      } else if (comp === 'ethanol') {
        mass = 46.07;
        label = 'Ethanol';
      } else if (comp === 'salt') {
        mass = 58.44;
        label = 'Sodium Chloride';
      } else if (comp === 'methane') {
        mass = 16.04;
        label = 'Methane';
      }

      return {
        results: [
          { label: `Molar Mass of ${label}`, value: mass.toFixed(3), unit: 'g/mol', isPrimary: true },
          { label: 'Avogadro Count Fraction', value: '1.0 Mole contains ~6.022 × 10²³ individual molecules.' }
        ]
      };
    }
  },
  {
    id: 'chem-mole',
    name: 'Mole Calculator',
    slug: 'chem-mole-calculator',
    category: 'science',
    description: 'Transform raw chemical species weight into equivalent moles based on material molecular masses.',
    seoTitle: 'Stoichiometric Grams to Moles Solver | Calculatoora',
    seoDescription: 'Transform chemical specimen grams into corresponding moles quickly with water equivalents.',
    inputs: [
      { id: 'grams', label: 'Material Weight (Grams)', type: 'number', defaultValue: 36 },
      { id: 'molarMass', label: 'Material Molar Mass (g/mol)', type: 'number', defaultValue: 18.015, helpText: 'Water weighs 18.015 g/mol' }
    ],
    formula: 'Moles (n) = Mass (g) / Molar Mass (M)',
    explanation: 'Moles link atomic scales to tangible macro measurements in laboratory chemistry setups.',
    example: 'Weighing 36.0 grams of water registers 2.0 chemical moles.',
    faq: [
      { question: 'Can moles be fractional?', answer: 'Yes, moles are decimal measurements used to maintain balanced stoichiometric reaction fractions.' }
    ],
    relatedSlugs: ['molar-mass-calculator', 'chem-molarity-calculator'],
    calculate: (inputs) => {
      const g = Number(inputs.grams) || 0;
      const mm = Number(inputs.molarMass) || 1;
      const moles = g / mm;

      return {
        results: [
          { label: 'Compound Moles (n)', value: moles.toFixed(4), unit: 'mol', isPrimary: true },
          { label: 'Total Molecule particles', value: (moles * 6.022e23).toExponential(3), unit: 'molecules' }
        ],
        chartData: [
          { name: 'Mass Weight (g)', value: g, color: '#39FF14' },
          { name: 'Molar Mass limit', value: mm, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'chem-molarity',
    name: 'Molarity Calculator',
    slug: 'chem-molarity-calculator',
    category: 'science',
    description: 'Solve solution molarity metrics by comparing compound solute moles against total liquid volumes.',
    seoTitle: 'Solution Molarity (M = n / V) Solver | Calculatoora',
    seoDescription: 'Obtain precise solution concentration ratios in moles per liter constants.',
    inputs: [
      { id: 'moles', label: 'Solute quantity (Moles)', type: 'number', defaultValue: 0.5 },
      { id: 'volume', label: 'Total Solution Volume (Liters)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Molarity (M) = solute moles (n) / solution volume (V)',
    explanation: 'Molarity characterizes chemical solution concentration levels, telling how densely a dissolved solute is packed inside a fluid volume.',
    example: 'Dissolving 0.5 moles of solute into 2.0 Liters of water creates a solution of 0.25 Molar (M) ratio.',
    faq: [
      { question: 'Does temperature affect molarity?', answer: 'Yes, because solutions expand or contract with temperature variations, changing the volume denominator and the resulting molarity.' }
    ],
    relatedSlugs: ['chem-mole-calculator', 'chem-molality-calculator'],
    calculate: (inputs) => {
      const n = Number(inputs.moles) || 0;
      const v = Number(inputs.volume) || 1;
      const m = n / v;

      return {
        results: [
          { label: 'Solution Molarity', value: m.toFixed(4), unit: 'mol/L (M)', isPrimary: true },
          { label: 'In Milimolar (mM)', value: (m * 1000).toFixed(1), unit: 'mM' }
        ]
      };
    }
  },
  {
    id: 'chem-molality',
    name: 'Molality Calculator',
    slug: 'chem-molality-calculator',
    category: 'science',
    description: 'Calculate molal concentration proportions combining solute moles and dry solvent mass weights.',
    seoTitle: 'Solvent Molality (m = n/kg) Solver | Calculatoora',
    seoDescription: 'Calculate mass-based molecular distributions using molality formulas.',
    inputs: [
      { id: 'moles', label: 'Solute quantity (Moles)', type: 'number', defaultValue: 0.15 },
      { id: 'massSolvent', label: 'Mass of Solvent (Kilograms)', type: 'number', defaultValue: 0.5 }
    ],
    formula: 'Molality (m) = Solute Moles / Kilograms of Solvent',
    explanation: 'Molality measures solute concentrations relative to dry solvent mass. Because mass stays constant regardless of heat, molality is highly precise for temperature experiments.',
    example: 'Adding 0.15 moles solute to 0.5 kg of dry alcohol prints a molality of 0.30 m.',
    faq: [
      { question: 'How do molarity and molality differ?', answer: 'Molarity uses overall Liters of fluid solution. Molality focuses solely on dry weights of the added solvent.' }
    ],
    relatedSlugs: ['chem-molarity-calculator', 'chem-normality-calculator'],
    calculate: (inputs) => {
      const n = Number(inputs.moles) || 0;
      const kg = Number(inputs.massSolvent) || 1;
      const molality = n / kg;

      return {
        results: [
          { label: 'Molality', value: molality.toFixed(4), unit: 'mol/kg (m)', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'chem-normality',
    name: 'Normality Calculator',
    slug: 'chem-normality-calculator',
    category: 'science',
    description: 'Verify solution normality ratios based on equivalent reactive ions inside volumetric fluids.',
    seoTitle: 'Chemical Acid/Base Normality Solver | Calculatoora',
    seoDescription: 'Obtain solution normality outputs for titration calculations and redox chemical experiments particles.',
    inputs: [
      { id: 'molarity', label: 'Base Molarity (M)', type: 'number', defaultValue: 0.1 },
      { id: 'equiv', label: 'Equivalent H+ / OH- ions per molecule', type: 'number', defaultValue: 2, helpText: 'H₂SO₄ has equivalence of 2' }
    ],
    formula: 'Normality (N) = Molarity (M) * Equivalence factor (f_eq)',
    explanation: 'Normality describes reactive solute capacity in acid-base titration reactions, representing the equivalent amount of hydrogen or hydroxide ions active in the liquid.',
    example: 'A 0.1 M solution of Sulfuric Acid (H₂SO₄, equivalence 2) is a 0.2 Normality (N) solution.',
    faq: [
      { question: 'Titration neutral equilibrium definition?', answer: 'Neutralization is reached when acid value N1 * V1 equals base value N2 * V2.' }
    ],
    relatedSlugs: ['chem-molarity-calculator', 'chem-dilution-calculator'],
    calculate: (inputs) => {
      const m = Number(inputs.molarity) || 0;
      const eq = Number(inputs.equiv) || 1;
      const norm = m * eq;

      return {
        results: [
          { label: 'Calculated Normality', value: norm.toFixed(3), unit: 'Eq/L (N)', isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'chem-dilution',
    name: 'Dilution Calculator',
    slug: 'chem-dilution-calculator',
    category: 'science',
    description: 'Solve chemical dilution targets (C1 * V1 = C2 * V2) when preparing lower concentration lab mixtures.',
    seoTitle: 'Solution Dilution (C1*V1 = C2*V2) Solver | Calculatoora',
    seoDescription: 'Determine target stock volumes or terminal concentrations required in dilution tasks.',
    inputs: [
      { id: 'solveFor', label: 'Solve For Missing', type: 'select', defaultValue: 'v1', options: [
        { label: 'Stock Volume (V1)', value: 'v1' },
        { label: 'Final Concentration (C2)', value: 'c2' },
        { label: 'Final Volume (V2)', value: 'v2' }
      ]},
      { id: 'c1', label: 'Stock Concentration (C1)', type: 'number', defaultValue: 10 },
      { id: 'v1', label: 'Stock Volume to Use (V1)', type: 'number', defaultValue: 50 },
      { id: 'c2', label: 'Final Concentration (C2)', type: 'number', defaultValue: 2 },
      { id: 'v2', label: 'Final Target Volume (V2)', type: 'number', defaultValue: 250 }
    ],
    formula: 'C1 * V1 = C2 * V2',
    explanation: 'This conservation formula applies as long as solute volume remains unmodified when adding more pure solvents.',
    example: 'To make 250 mL of a 2M solution from 10M stock, you require exactly 50 mL of stock diluted with 200 mL of pure solvent.',
    faq: [
      { question: 'What is a stock solution?', answer: 'A highly concentrated solution prepared in advance to save chemical storage volume, diluted prior to actual laboratory usage.' }
    ],
    relatedSlugs: ['chem-molarity-calculator', 'chem-normality-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'v1';
      const c1 = Number(inputs.c1) || 1;
      const v1 = Number(inputs.v1) || 0;
      const c2 = Number(inputs.c2) || 0;
      const v2 = Number(inputs.v2) || 1;

      let res = 0;
      let label = '';
      let detail = '';

      if (solve === 'v1') {
        res = c1 !== 0 ? (c2 * v2) / c1 : 0;
        label = 'Required Stock Volume (V1)';
        detail = `Dilute ${res.toFixed(1)} units of stock with ${(v2 - res).toFixed(1)} units of solvent.`;
      } else if (solve === 'c2') {
        res = v2 !== 0 ? (c1 * v1) / v2 : 0;
        label = 'Final Concentration (C2)';
      } else {
        res = c2 !== 0 ? (c1 * v1) / c2 : 0;
        label = 'Final Volume (V2)';
        detail = `Add ${(res - v1).toFixed(1)} units of pure solvent to the stock mixture.`;
      }

      return {
        results: [
          { label, value: res.toFixed(3), isPrimary: true },
          { label: 'Usage Steps', value: detail || 'Adjust parameters as required.' }
        ]
      };
    }
  },
  {
    id: 'chem-ph',
    name: 'pH Calculator',
    slug: 'ph-calculator',
    category: 'science',
    description: 'Solve solution pH logarithmic limits based on dissolved hydrogen [H+] hydronium ion concentration rates.',
    seoTitle: 'Logarithmic Chemical pH Solver | Calculatoora',
    seoDescription: 'Input hydronium ions to evaluate solution acidity/alkalinity indexes.',
    inputs: [
      { id: 'hcon', label: 'Hydrogen ion [H+] Concentration (mol/L)', type: 'number', defaultValue: 0.0001, helpText: 'H+ counts e.g., 1e-4 = 0.0001 mol/L' }
    ],
    formula: 'pH = -log10([H+])',
    explanation: 'The pH scale ranges from 0 to 14. Lower numbers represent strong acids, values near 7 indicate neutral water, and higher values represent basic/alkaline solutions.',
    example: 'An [H+] of 0.0001 mol/L yields a pH of exactly 4.0.',
    faq: [
      { question: 'What is neutral water pH?', answer: 'Pure water at 25°C dissociation registers a pH of exactly 7.0.' }
    ],
    relatedSlugs: ['poh-calculator', 'chem-molarity-calculator'],
    calculate: (inputs) => {
      const h = Number(inputs.hcon) || 1e-7;
      let ph = 7;
      try {
        ph = -Math.log10(h);
      } catch (e) {
        ph = 7;
      }

      if (isNaN(ph) || ph < 0 || ph > 14) ph = 7;

      const pOH = 14 - ph;
      const status = ph < 6.8 ? 'Acidic 🔴' : ph > 7.2 ? 'Alkaline 🔵' : 'Neutral 🟢';

      return {
        results: [
          { label: 'Solution pH Level', value: ph.toFixed(2), isPrimary: true },
          { label: 'Solution Nature', value: status },
          { label: 'Corresponding pOH Level', value: pOH.toFixed(2) }
        ],
        chartData: [
          { name: 'pH scale index', value: Math.min(14, Math.max(0, ph)), color: '#39FF14' },
          { name: 'pOH scale index', value: Math.min(14, Math.max(0, pOH)), color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'chem-poh',
    name: 'pOH Calculator',
    slug: 'poh-calculator',
    category: 'science',
    description: 'Obtain pOH indicators using dissolved hydroxide [OH-] molecule indexes inside liquids.',
    seoTitle: 'Solution pOH Alkaline Index Solver | Calculatoora',
    seoDescription: 'Obtain precise basic water measurements based on hydroxide ion counts.',
    inputs: [
      { id: 'ohcon', label: 'Hydroxide ion [OH-] Concentration (mol/L)', type: 'number', defaultValue: 0.001 }
    ],
    formula: 'pOH = -log10([OH-]) \npH + pOH = 14',
    explanation: 'Like pH, pOH details hydroxide potential concentration ranges. Swapping metrics is done by subtracting from 14.',
    example: 'An [OH-] count of 0.001 mol/L records a pOH of exactly 3.0.',
    faq: [
      { question: 'Alkaline pH equivalence?', answer: 'A low pOH of 3.0 equates to a high alkaline pH of 11.0 on standard scales.' }
    ],
    relatedSlugs: ['ph-calculator', 'chem-molarity-calculator'],
    calculate: (inputs) => {
      const oh = Number(inputs.ohcon) || 1e-7;
      let poh = 7;
      try {
        poh = -Math.log10(oh);
      } catch (e) {
        poh = 7;
      }
      if (isNaN(poh) || poh < 0 || poh > 14) poh = 7;

      const ph = 14 - poh;

      return {
        results: [
          { label: 'Solution pOH Level', value: poh.toFixed(2), isPrimary: true },
          { label: 'Equivalent pH Scale', value: ph.toFixed(2) },
          { label: 'Acidity status', value: ph < 6.8 ? 'Acidic 🔴' : ph > 7.2 ? 'Alkaline 🔵' : 'Neutral 🟢' }
        ]
      };
    }
  },
  {
    id: 'chem-concentration',
    name: 'Concentration Calculator',
    slug: 'concentration-calculator',
    category: 'science',
    description: 'Calculate mass-by-volume percent concentrations of solutions with step-by-step guidance.',
    seoTitle: 'Percent Solution Concentration Solver | Calculatoora',
    seoDescription: 'Input solute dry mass and overall liquid targets to solve percent concentrations.',
    inputs: [
      { id: 'solute', label: 'Solute Weight (Grams)', type: 'number', defaultValue: 15 },
      { id: 'solvent', label: 'Solvent / Water Weight (Grams)', type: 'number', defaultValue: 185 }
    ],
    formula: 'Concentration % = [ Solute / (Solute + Solvent) ] * 100',
    explanation: 'This calculator gives the percentage of solute relative to total solution mass (mass-by-mass concentration).',
    example: 'Dissolving 15 grams of table salt into 185 grams of pure water forms a 7.50% concentration solution.',
    faq: [
      { question: 'What is saturated concentration?', answer: 'The point where solvents cannot dissolve any further solute additions, causing extra particles to settle at the base.' }
    ],
    relatedSlugs: ['chem-molarity-calculator', 'chem-dilution-calculator'],
    calculate: (inputs) => {
      const solute = Number(inputs.solute) || 0;
      const solvent = Number(inputs.solvent) || 1;
      const total = solute + solvent;
      const pct = total > 0 ? (solute / total) * 100 : 0;

      return {
        results: [
          { label: 'Solution Concentration', value: pct.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Total active Solution Mass', value: total.toFixed(1), unit: 'grams' }
        ],
        chartData: [
          { name: 'Dry Solute', value: solute, color: '#39FF14' },
          { name: 'Solvent Water', value: solvent, color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'chem-gas-law',
    name: 'Charles & Boyle Law Calculator',
    slug: 'gas-law-calculator',
    category: 'science',
    description: 'Solve classical Boyles and Charles gas laws relating volumes, temperatures and pressures.',
    seoTitle: 'Boyle’s & Charles’ Gas Law Solver | Calculatoora',
    seoDescription: 'Model quick temperature, volume, or pressure shifts in enclosed ideal gas environments.',
    inputs: [
      { id: 'gasLaw', label: 'Gas Law Selection', type: 'select', defaultValue: 'boyle', options: [
        { label: "Boyle's Law (P1*V1 = P2*V2)", value: 'boyle' },
        { label: "Charles's Law (V1/T1 = V2/T2)", value: 'charles' }
      ]},
      { id: 'p1', label: 'Initial Pressure (P1)', type: 'number', defaultValue: 1.0 },
      { id: 'v1', label: 'Initial Volume (V1)', type: 'number', defaultValue: 10.0 },
      { id: 'p2', label: 'Final Pressure (P2) [Boyle]', type: 'number', defaultValue: 2.0 },
      { id: 't1', label: 'Initial Temp (T1 Kelvin) [Charles]', type: 'number', defaultValue: 300 },
      { id: 't2', label: 'Final Temp (T2 Kelvin) [Charles]', type: 'number', defaultValue: 450 }
    ],
    formula: "Boyle: P1 * V1 = P2 * V2 \nCharles: V1 / T1 = V2 / T2",
    explanation: "Boyle’s Law shows that pressure and volume are inversely proportional at constant temperatures. Charles's Law shows volume directly scales with temperature when pressures are fixed.",
    example: "Compressing 10 Liters of gas from 1.0 atm to 2.0 atm drops total volume down to 5.0 Liters.",
    faq: [
      { question: 'Why use Kelvin scale in gases?', answer: 'Gas molecular speed drops to absolute zero at 0 K, meaning other scales like Celsius would falsely compute negative volumes.' }
    ],
    relatedSlugs: ['ideal-gas-calculator'],
    calculate: (inputs) => {
      const mode = inputs.gasLaw || 'boyle';
      const p1 = Number(inputs.p1) || 1;
      const v1 = Number(inputs.v1) || 1;
      const p2 = Number(inputs.p2) || 1;
      const t1 = Number(inputs.t1) || 300;
      const t2 = Number(inputs.t2) || 300;

      let res = 0;
      let label = '';
      let unit = '';

      if (mode === 'boyle') {
        res = p2 !== 0 ? (p1 * v1) / p2 : 0;
        label = 'Resulting Volume (V2)';
        unit = 'Liters';
      } else {
        res = t1 !== 0 ? (v1 * t2) / t1 : 0;
        label = 'Resulting Volume (V2)';
        unit = 'Liters';
      }

      return {
        results: [
          { label, value: res.toFixed(3), unit, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'chem-ideal-gas',
    name: 'Ideal Gas Calculator',
    slug: 'ideal-gas-calculator',
    category: 'science',
    description: 'Solve the universal Ideal Gas thermodynamic formula (P * V = n * R * T) across standard units.',
    seoTitle: 'Ideal Gas Law (PV = nRT) Solver | Calculatoora',
    seoDescription: 'Obtain precise ideal gas properties combining pressures, volumes, mole counts and heats.',
    inputs: [
      { id: 'solveFor', label: 'Solve For', type: 'select', defaultValue: 'p', options: [
        { label: 'Pressure (P)', value: 'p' },
        { label: 'Volume (V)', value: 'v' },
        { label: 'Moles count (n)', value: 'n' },
        { label: 'Temperature (T Kelvin)', value: 't' }
      ]},
      { id: 'pressure', label: 'Pressure (atm)', type: 'number', defaultValue: 1.2 },
      { id: 'volume', label: 'Volume (Liters)', type: 'number', defaultValue: 20 },
      { id: 'moles', label: 'Moles count (n)', type: 'number', defaultValue: 0.8 },
      { id: 'temp', label: 'Temperature (Kelvin)', type: 'number', defaultValue: 300 }
    ],
    formula: 'P * V = n * R * T \n(R = 0.082057 L·atm/(mol·K))',
    explanation: 'The Ideal Gas Law relates state conditions of standard hypothetical gases. It applies with high accuracy to standard real gases under ambient pressures.',
    example: 'A 0.8 mole sample of ideal gas locked inside 20 Liters heated to 300 K exerts 0.984 atm of physical pressure.',
    faq: [
      { question: 'What is STP?', answer: 'Standard Temperature and Pressure (STP) equals exactly 0°C (273.15 K) and 1 atmosphere.' }
    ],
    relatedSlugs: ['gas-law-calculator'],
    calculate: (inputs) => {
      const solve = inputs.solveFor || 'p';
      const p = Number(inputs.pressure) || 1;
      const v = Number(inputs.volume) || 1;
      const n = Number(inputs.moles) || 1;
      const t = Number(inputs.temp) || 300;
      const R = 0.0820571; // L atm / (mol K)

      let res = 0;
      let label = '';
      let unit = '';

      if (solve === 'p') {
        res = v !== 0 ? (n * R * t) / v : 0;
        label = 'Computed Gas Pressure';
        unit = 'atm';
      } else if (solve === 'v') {
        res = p !== 0 ? (n * R * t) / p : 0;
        label = 'Computed Gas Volume';
        unit = 'Liters';
      } else if (solve === 'n') {
        res = (R * t) !== 0 ? (p * v) / (R * t) : 0;
        label = 'Solute quantity';
        unit = 'mol';
      } else {
        res = (n * R) !== 0 ? (p * v) / (n * R) : 0;
        label = 'Thermodynamic Temperature';
        unit = 'Kelvin';
      }

      return {
        results: [
          { label, value: res.toFixed(3), unit, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'chem-eq-solver',
    name: 'Chemical Equation Calculator',
    slug: 'chemical-equation-calculator',
    category: 'science',
    description: 'Structure simple stoichiometry reactant moles and calculate theoretical product yield weight values.',
    seoTitle: 'Reaction Theoretical Yield Calculator | Calculatoora',
    seoDescription: 'Model simple chemical reaction molar ratios and theoretical yields.',
    inputs: [
      { id: 'reactionRatio', label: 'Moles of Reactant per Product mole', type: 'number', defaultValue: 2, helpText: 'e.g., 2 Hydrogen molecules yield 2 Water molecules (1:1)' },
      { id: 'molesReactant', label: 'Available Reactant moles', type: 'number', defaultValue: 1.5 },
      { id: 'productMolarMass', label: 'Product Molar Mass (g/mol)', type: 'number', defaultValue: 18.015 }
    ],
    formula: 'Yield Moles = Reactant Moles * (Product ratio Coefficient / Reactant ratio Coefficient) \nProduct Grams = Yield Moles * Product Molar Mass',
    explanation: 'Theoretical yield defines the maximum amount of product that can be generated through basic chemical reactions before factoring in experimental material loss.',
    example: 'With a 1:1 reaction ratio, 1.5 moles of reactant will yield 1.5 moles of product, weighing 27.02 grams.',
    faq: [
      { question: 'Why is actual chemical yield often lower?', answer: 'Material transfer loss, incomplete reactions, and secondary side reactions reduce actual yield in physical laboratories.' }
    ],
    relatedSlugs: ['chem-mole-calculator', 'molar-mass-calculator'],
    calculate: (inputs) => {
      const ratio = Number(inputs.reactionRatio) || 1;
      const moles = Number(inputs.molesReactant) || 0;
      const mm = Number(inputs.productMolarMass) || 1;

      const productMoles = moles / ratio;
      const producedGrams = productMoles * mm;

      return {
        results: [
          { label: 'Theoretical Product Yield', value: producedGrams.toFixed(2), unit: 'grams', isPrimary: true },
          { label: 'Theoretical Product moles', value: productMoles.toFixed(3), unit: 'mol' }
        ]
      };
    }
  },

  // ====================================== BIOLOGY ======================================
  {
    id: 'bio-population',
    name: 'Population Growth Calculator',
    slug: 'population-growth-calculator',
    category: 'science',
    description: 'Analyze ecological populations using exponential and carrying limit logistic algorithms.',
    seoTitle: 'Logistic & Exponential Population Growth Solver | Calculatoora',
    seoDescription: 'Obtain biological species expansion models over generations with environmental limits.',
    inputs: [
      { id: 'model', label: 'Ecological Growth Model', type: 'select', defaultValue: 'logistic', options: [
        { label: 'Logistic Growth (Limits Cap)', value: 'logistic' },
        { label: 'Exponential Growth (Unlimited)', value: 'exponential' }
      ]},
      { id: 'startPop', label: 'Initial Population (N0)', type: 'number', defaultValue: 100 },
      { id: 'rate', label: 'Growth constant rate (r % per cycle)', type: 'number', defaultValue: 10, min: 0, max: 200 },
      { id: 'time', label: 'Generations / Time elapsed', type: 'number', defaultValue: 12 },
      { id: 'limit', label: 'Carrying Capacity Limit (K)', type: 'number', defaultValue: 1000 }
    ],
    formula: 'Exponential: N_t = N_0 * e^(r*t) \nLogistic: N_t = K / (1 + ((K - N_0)/N_0) * e^(-r*t))',
    explanation: 'Exponential growth assume unlimited nutrients, leading to runaway population spikes. Logistic growth introduces a carrying capacity limit (K) to reflect natural environmental resource constraints.',
    example: 'Starting with 100 individuals at a 10% rate, the population reaches 274 under logistic constraints after 12 cycles, but would hit 332 without any constraints.',
    faq: [
      { question: 'What is Carrying Capacity (K)?', answer: 'The maximum population size of a species that an ecosystem can sustain indefinitely given the available food, water, and space.' }
    ],
    relatedSlugs: ['bio-cell-growth-calculator', 'ecology-calculator'],
    calculate: (inputs) => {
      const mode = inputs.model || 'logistic';
      const n0 = Number(inputs.startPop) || 10;
      const r = (Number(inputs.rate) || 5) / 100;
      const t = Number(inputs.time) || 0;
      const K = Number(inputs.limit) || 1000;

      let finalPop = 0;
      const series = [];

      for (let i = 0; i <= Math.min(30, t); i += Math.max(1, Math.floor(t / 10))) {
        let p = 0;
        if (mode === 'exponential') {
          p = n0 * Math.exp(r * i);
        } else {
          p = K / (1 + ((K - n0) / n0) * Math.exp(-r * i));
        }
        series.push({ name: `G-${i}`, count: Math.round(p) });
      }

      if (mode === 'exponential') {
        finalPop = n0 * Math.exp(r * t);
      } else {
        finalPop = K / (1 + ((K - n0) / n0) * Math.exp(-r * t));
      }

      return {
        results: [
          { label: 'Terminal Species Population', value: Math.round(finalPop), unit: 'individuals', isPrimary: true },
          { label: 'Percentage of resource limit used', value: mode === 'logistic' ? ((finalPop/K) * 100).toFixed(1) : '∞ %' }
        ],
        chartData: series.map(s => ({
          name: s.name,
          value: s.count,
          color: '#39FF14'
        }))
      };
    }
  },
  {
    id: 'bio-genetics',
    name: 'Genetics Probability Calculator',
    slug: 'genetics-probability-calculator',
    category: 'science',
    description: 'Run classic monohybrid Mendelian gene crosses to isolate genotype and phenotype percentages.',
    seoTitle: 'Mendelian Genetics Punnett Square Solver | Calculatoora',
    seoDescription: 'Obtain allele combinations and probability outputs of genetic outcomes.',
    inputs: [
      { id: 'parent1', label: 'Parent 1 Genotype', type: 'select', defaultValue: 'Aa', options: [
        { label: 'Homozygous Dominant (AA)', value: 'AA' },
        { label: 'Heterozygous (Aa)', value: 'Aa' },
        { label: 'Homozygous Recessive (aa)', value: 'aa' }
      ]},
      { id: 'parent2', label: 'Parent 2 Genotype', type: 'select', defaultValue: 'Aa', options: [
        { label: 'Homozygous Dominant (AA)', value: 'AA' },
        { label: 'Heterozygous (Aa)', value: 'Aa' },
        { label: 'Homozygous Recessive (aa)', value: 'aa' }
      ]}
    ],
    formula: 'Punnett Cross: combining gamete alleles to determine 4 possible combinations.',
    explanation: 'Genotypes track the genetic code inherited. Dominant alleles mask recessive ones, dictating final bodily visual phenotypes.',
    example: 'Crossing Aa and Aa heterozygotics has a 25% chance of AA, 50% Aa, and 25% aa, resulting in a 75% dominant phenotype appearance rate.',
    faq: [
      { question: 'Phenotype vs Genotype?', answer: 'Genotype is the internal genetic code (e.g. Aa). Phenotype is the physical expression of that code (e.g. brown eye color).' }
    ],
    relatedSlugs: ['probability-calculator', 'bio-biodiversity-calculator'],
    calculate: (inputs) => {
      const p1 = inputs.parent1 || 'Aa';
      const p2 = inputs.parent2 || 'Aa';

      // Parse letters
      const cross: string[] = [];
      for (const a1 of p1) {
        for (const a2 of p2) {
          // Sort to keep dominant letter first
          const sorted = [a1, a2].sort().join('');
          cross.push(sorted);
        }
      }

      // Count combinations
      const freq: Record<string, number> = {};
      for (const gene of cross) {
        // Standardize sorting: 'Aa', 'AA', 'aa'
        let norm = gene;
        if (gene === 'aA') norm = 'Aa';
        freq[norm] = (freq[norm] || 0) + 1;
      }

      const aaProb = ((freq['AA'] || 0) / 4) * 100;
      const aaMixedProb = ((freq['Aa'] || 0) / 4) * 100;
      const recessiveProb = ((freq['aa'] || 0) / 4) * 100;

      const phenotypeDom = aaProb + aaMixedProb;

      return {
        results: [
          { label: 'Homozygous Dominant (AA)', value: aaProb, unit: '%', isPrimary: true },
          { label: 'Heterozygous (Aa)', value: aaMixedProb, unit: '%' },
          { label: 'Homozygous Recessive (aa)', value: recessiveProb, unit: '%' },
          { label: 'Physical Dominant Outcome', value: phenotypeDom, unit: '%' },
          { label: 'Physical Recessive Outcome', value: recessiveProb, unit: '%' }
        ],
        chartData: [
          { name: 'Dominant Phenotype', value: phenotypeDom, color: '#39FF14' },
          { name: 'Recessive Phenotype', value: recessiveProb, color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'bio-dna',
    name: 'DNA Calculator',
    slug: 'dna-calculator',
    category: 'science',
    description: 'Input DNA base sequences to compute GC content, transcribe to RNA, and predict potential amino acids.',
    seoTitle: 'GC Content & DNA Transcription Solver | Calculatoora',
    seoDescription: 'Decode DNA sequences into mRNA structure with full GC mole balance ratios.',
    inputs: [
      { id: 'seq', label: 'DNA Sequence (A, T, C, G only)', type: 'text', defaultValue: 'ATGCGATCGATCGATCGATC' }
    ],
    formula: 'GC Content % = [ (G + C) / (A + T + C + G) ] * 100',
    explanation: 'GC content represents molecular holding forces. DNA transcription matches adenine (A) with uracil (U) inside RNA structures.',
    example: 'The sequence "ATGCGATCG" has a 55.6% GC ratio. It transcribes to RNA: "UACGCUAGC".',
    faq: [
      { question: 'Why is GC percentage important in labs?', answer: 'Higher GC ratios require higher temperatures to separate due to three hydrogen bonds, unlike AT pairs which have only two.' }
    ],
    relatedSlugs: ['bio-biodiversity-calculator', 'genetics-probability-calculator'],
    calculate: (inputs) => {
      const raw = (inputs.seq || 'ATGCGATCGATCGATCGATC').toUpperCase().replace(/[^ATCG]/g, '');

      if (raw.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter valid nucleobases.', unit: 'invalid', isPrimary: true }]
        };
      }

      let gcCount = 0;
      let rna = '';

      for (const char of raw) {
        if (char === 'G' || char === 'C') gcCount++;
        // Transcription map
        if (char === 'A') rna += 'U';
        else if (char === 'T') rna += 'A';
        else if (char === 'C') rna += 'G';
        else if (char === 'G') rna += 'C';
      }

      const gcPct = (gcCount / raw.length) * 100;

      return {
        results: [
          { label: 'Overall GC Base Percentage', value: gcPct.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Transcribed mRNA sequence', value: rna, unit: 'string' },
          { label: 'Valid Nucleotides Count', value: raw.length, unit: 'base' }
        ],
        chartData: [
          { name: 'GC Pairs', value: gcCount, color: '#39FF14' },
          { name: 'AT Pairs', value: raw.length - gcCount, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'bio-cell-growth',
    name: 'Cell Growth Calculator',
    slug: 'cell-growth-calculator',
    category: 'science',
    description: 'Calculate mitotic cellular division rates and final counts of bacterial cultures.',
    seoTitle: 'Bacterial Cell Mitotic Division Solver | Calculatoora',
    seoDescription: 'Obtain cell quantities over variable hours. Simple helper tool for lab research.',
    inputs: [
      { id: 'initial', label: 'Initial Cells count', type: 'number', defaultValue: 50 },
      { id: 'doubles', label: 'Generation doubling speed (hours)', type: 'number', defaultValue: 2, min: 0.1 },
      { id: 'time', label: 'Culturing Time (Hours)', type: 'number', defaultValue: 12 }
    ],
    formula: 'N_f = N_i * 2^(Time / Doubling Speed)',
    explanation: 'Cell division proceeds via classic exponential scaling. Doubling times dictate how rapidly cultures build.',
    example: 'Starting with 50 cells that double every 2 hours, the culture expands to 3,200 cells in 12 hours.',
    faq: [
      { question: 'What is doubling time?', answer: 'The duration required for a microbial population to double in size during the logarithmic growth phase.' }
    ],
    relatedSlugs: ['population-growth-calculator', 'bio-genetics-probability-calculator'],
    calculate: (inputs) => {
      const init = Number(inputs.initial) || 1;
      const d = Number(inputs.doubles) || 1;
      const t = Number(inputs.time) || 0;

      const gens = t / d;
      const finalCount = init * Math.pow(2, gens);

      return {
        results: [
          { label: 'Final Microbe Count', value: Math.round(finalCount), unit: 'cells', isPrimary: true },
          { label: 'Completed Generations', value: gens.toFixed(1), unit: 'cycles' }
        ]
      };
    }
  },
  {
    id: 'bio-ecology',
    name: 'Ecology Energy Calculator',
    slug: 'ecology-calculator',
    category: 'science',
    description: 'Estimate biochemical energy transfers through trophic levels in standard ecosystems.',
    seoTitle: 'Trophic Level 10% Ecological Energy Calculator | Calculatoora',
    seoDescription: 'Isolate calorie allocations passing upwards along biological food pyramids.',
    inputs: [
      { id: 'producerEnergy', label: 'Primary Producer Energy (kcal)', type: 'number', defaultValue: 10000 },
      { id: 'transferEfficiency', label: 'Trophic Transfer Efficiency (%)', type: 'number', defaultValue: 10, min: 1, max: 50 }
    ],
    formula: 'Trophic Level N = Level(N-1) * (Efficiency / 100)',
    explanation: 'The ecological ten-percent law dictates that only a fraction of energy is preserved in organic tissues to pass up trophic levels.',
    example: '10,000 kcal produced by lakeside algae provides 1,000 kcal to herbivores, and 100 kcal to secondary carnivores.',
    faq: [
      { question: 'Where does the other 90% of energy go?', answer: 'Lost to atmospheric heat, cellular respiration, physical movement, and waste decay processes.' }
    ],
    relatedSlugs: ['population-growth-calculator', 'bio-biodiversity-calculator'],
    calculate: (inputs) => {
      const prod = Number(inputs.producerEnergy) || 10000;
      const eff = (Number(inputs.transferEfficiency) || 10) / 100;

      const l2 = prod * eff;
      const l3 = l2 * eff;
      const l4 = l3 * eff;

      return {
        results: [
          { label: 'Level 1: Primary Producers', value: prod.toFixed(0), unit: 'kcal', isPrimary: true },
          { label: 'Level 2: Herbivores (Primary Consumers)', value: l2.toFixed(0), unit: 'kcal' },
          { label: 'Level 3: Carnivores (Secondary Consumers)', value: l3.toFixed(0), unit: 'kcal' },
          { label: 'Level 4: Apex Predators (Tertiary Consumers)', value: l4.toFixed(0), unit: 'kcal' }
        ],
        chartData: [
          { name: 'Producers', value: prod, color: '#10b981' },
          { name: 'Herbivores', value: l2, color: '#39FF14' },
          { name: 'Carnivores', value: l3, color: '#a855f7' },
          { name: 'Apex Predators', value: l4, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'bio-biodiversity',
    name: 'Biodiversity Index Calculator',
    slug: 'biodiversity-calculator',
    category: 'science',
    description: 'Calculate Simpson’s and Shannon diversity indexes to analyze ecosystem species balance.',
    seoTitle: 'Simpson’s & Shannon Biodiversity index Solver | Calculatoora',
    seoDescription: 'Obtain biological diversity richness scores based on sample species population ratios.',
    inputs: [
      { id: 'populations', label: 'Species populations (comma-separated)', type: 'text', defaultValue: '50, 30, 15, 5' }
    ],
    formula: 'Simpson’s D = Sum of (n_i * (n_i - 1)) / (N * (N - 1)) \nShannon’s H = -Sum of (p_i * ln(p_i))',
    explanation: 'Simpson’s index scales from 0 (infinite diversity) to 1 (monoculture). Lower numbers indicate a balanced ecology. Shannon’s index registers higher scores for systems with rich species distributions.',
    example: 'For populations of 50, 30, 15, and 5, Simpson’s Dominance D is 0.368, and Shannon’s H value is 1.139.',
    faq: [
      { question: 'What does Simpson’s Index of Diversity (1 - D) signify?', answer: 'The probability that two individuals randomly selected from a sample belong to completely distinct species.' }
    ],
    relatedSlugs: ['bio-genetics-probability-calculator', 'ecology-calculator'],
    calculate: (inputs) => {
      const raw = inputs.populations || '50, 30, 15, 5';
      const arr = raw.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n) && n > 0);

      if (arr.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter valid species population sizes.', isPrimary: true }]
        };
      }

      const N = arr.reduce((acc, v) => acc + v, 0);

      // Simpson D
      let simpsonSum = 0;
      let shannon = 0;
      for (const n of arr) {
        simpsonSum += n * (n - 1);
        const pi = n / N;
        shannon += pi * Math.log(pi);
      }

      const D = N > 1 ? simpsonSum / (N * (N - 1)) : 1;
      const shannonH = -shannon;
      const diversityIndex = 1 - D;

      return {
        results: [
          { label: 'Simpson’s Index of Diversity (1 - D)', value: diversityIndex.toFixed(3), isPrimary: true },
          { label: 'Simpson’s Dominance Index (D)', value: D.toFixed(3) },
          { label: 'Shannon’s Wiener Index (H)', value: shannonH.toFixed(3) },
          { label: 'Total Ecosystem Sample size', value: N }
        ],
        chartData: arr.map((val, idx) => ({
          name: `Specie ${idx + 1}`,
          value: val,
          color: idx === 0 ? '#10b981' : idx === 1 ? '#39FF14' : '#3b82f6'
        }))
      };
    }
  }
];
