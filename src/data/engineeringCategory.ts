import { Calculator } from '../types';

export const ENGINEERING_CALCULATORS: Calculator[] = [
  {
    id: 'eng-electrical',
    name: 'Electrical AC/DC Calculator',
    slug: 'electrical-calculator',
    category: 'engineering',
    description: 'Calculate voltage, current, power, and resistance for AC and DC electrical systems, incorporating power factor metrics.',
    seoTitle: 'AC/DC Electrical Engineering Calculator | Calculatoora',
    seoDescription: 'Obtain precise current, potential reactive power, and phase configurations of multi-phase circuits.',
    inputs: [
      { id: 'system', label: 'Electricity Format', type: 'select', defaultValue: 'dc', options: [
        { label: 'DC System', value: 'dc' },
        { label: 'AC Single-Phase System', value: 'ac1' }
      ]},
      { id: 'voltage', label: 'Line Voltage (V)', type: 'number', defaultValue: 230 },
      { id: 'power', label: 'Active Power (W)', type: 'number', defaultValue: 1500 },
      { id: 'pf', label: 'Power Factor (cos θ) [AC only]', type: 'number', defaultValue: 0.85, min: 0.1, max: 1.0, step: 0.05 }
    ],
    formula: 'DC Current: I = P / V \nAC Phase Current: I = P / (V * Power Factor)',
    explanation: 'DC systems maintain direct currents. AC grids introduce Phase Lag which reduces active Power Factor efficiencies down from perfect 1.0 caps.',
    example: 'A 1500 watt single-phase AC motor running on 230V grid power with a power factor of 0.85 draws approximately 7.67 Amperes.',
    faq: [
      { question: 'What is a Power Factor?', answer: 'The ratio of actual active power flowing to the load over the absolute apparent power in an AC circuit.' }
    ],
    relatedSlugs: ['circuit-calculator', 'resistor-calculator'],
    calculate: (inputs) => {
      const sys = inputs.system || 'dc';
      const v = Number(inputs.voltage) || 230;
      const p = Number(inputs.power) || 1500;
      const pf = Number(inputs.pf) || 0.85;

      let rAmps = 0;
      let apparentPower = p;

      if (sys === 'dc') {
        rAmps = p / v;
      } else {
        rAmps = p / (v * pf);
        apparentPower = p / pf;
      }

      return {
        results: [
          { label: 'Expected Line Current', value: rAmps.toFixed(3), unit: 'Amps', isPrimary: true },
          { label: 'Apparent Power', value: apparentPower.toFixed(1), unit: 'VA' },
          { label: 'Inline Impedance (Resistance equivalent)', value: (v / rAmps).toFixed(2), unit: 'Ohms' }
        ]
      };
    }
  },
  {
    id: 'eng-circuit',
    name: 'Circuit Series/Parallel Calculator',
    slug: 'circuit-calculator',
    category: 'engineering',
    description: 'Calculate equivalent total resistance and capacitance for both series and parallel network arrays.',
    seoTitle: 'Equivalent Series & Parallel Circuit Solver | Calculatoora',
    seoDescription: 'Input multiple passive electrical component parameters to solve for equivalent network properties.',
    inputs: [
      { id: 'type', label: 'Array Format', type: 'select', defaultValue: 'series', options: [
        { label: 'Series Network', value: 'series' },
        { label: 'Parallel Network', value: 'parallel' }
      ]},
      { id: 'compType', label: 'Component Type', type: 'select', defaultValue: 'resistors', options: [
        { label: 'Resistors (Ω)', value: 'resistors' },
        { label: 'Capacitors (μF)', value: 'capacitors' }
      ]},
      { id: 'values', label: 'Values (Comma Separated)', type: 'text', defaultValue: '100, 220, 470' }
    ],
    formula: 'Resistors Series: R_eq = R1 + R2 + ... \nResistors Parallel: 1/R_eq = 1/R1 + 1/R2 + ... \n(Capacitors use inverted formulas)',
    explanation: 'Wiring components in series forces the current through each, compounding resistances. Wiring in parallel splits the current path, lowering equivalent resistance.',
    example: 'Connecting three resistors of 100, 220, and 470 Ohms in parallel drops total equivalent resistance to exactly 59.95 Ohms.',
    faq: [
      { question: 'Why does parallel capacitance add directly?', answer: 'Placing capacitors side-by-side increases the total physical plate surface area, directly boosting equivalent dielectric limits.' }
    ],
    relatedSlugs: ['resistor-calculator', 'resistor-color-code-calculator'],
    calculate: (inputs) => {
      const type = inputs.type || 'series';
      const comp = inputs.compType || 'resistors';
      const raw = inputs.values || '100, 220, 470';

      const arr = raw.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n) && n > 0);

      if (arr.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter valid values.', isPrimary: true }]
        };
      }

      let req = 0;
      if (comp === 'resistors') {
        if (type === 'series') {
          req = arr.reduce((acc, v) => acc + v, 0);
        } else {
          const invSum = arr.reduce((acc, v) => acc + (1 / v), 0);
          req = invSum > 0 ? 1 / invSum : 0;
        }
      } else {
        // Capacitors (opposite of resistors)
        if (type === 'parallel') {
          req = arr.reduce((acc, v) => acc + v, 0);
        } else {
          const invSum = arr.reduce((acc, v) => acc + (1 / v), 0);
          req = invSum > 0 ? 1 / invSum : 0;
        }
      }

      const unit = comp === 'resistors' ? 'Ohms (Ω)' : 'Microfarads (μF)';

      return {
        results: [
          { label: 'Equivalent Network Value', value: req.toFixed(3), unit, isPrimary: true },
          { label: 'Active Components Count', value: arr.length }
        ],
        chartData: arr.map((v, idx) => ({
          name: `Comp ${idx + 1}`,
          value: v,
          color: '#39FF14'
        }))
      };
    }
  },
  {
    id: 'eng-resistor-led',
    name: 'LED Resistor Calculator',
    slug: 'resistor-calculator',
    category: 'engineering',
    description: 'Calculate the accurate current-limiting resistor required to run custom LEDs safely without blowing current thresholds.',
    seoTitle: 'LED Limit Resistor Value Solver | Calculatoora',
    seoDescription: 'Obtain perfect safety resistor values for microelectronics projects.',
    inputs: [
      { id: 'vSource', label: 'Power Source Voltage (V)', type: 'number', defaultValue: 12 },
      { id: 'vLed', label: 'LED Forward Voltage Drop (V)', type: 'number', defaultValue: 2.1, helpText: 'Red ~1.8V, Green ~2.1V, Blue ~3.3V' },
      { id: 'iLed', label: 'Maximum Current Limit (mA)', type: 'number', defaultValue: 20, helpText: 'Standard led is 20 milliamps (0.02 Amps)' }
    ],
    formula: 'Resistor Resistance: R = (V_Source - V_LED) / I_LED \nWattage Rating: P = (V_Source - V_LED) * I_LED',
    explanation: 'LED diodes offer near-zero internal resistance when powered on. Without a current-limiting resistor in series, they draw excess current and burn out.',
    example: 'Powering a red LED (2.1V forward drop) from a 12V supply at 20mA requires a 495 Ohm resistor.',
    faq: [
      { question: 'What is forward voltage?', answer: 'The minimum voltage required to turn the LED on and conduct light.' }
    ],
    relatedSlugs: ['resistor-color-code-calculator', 'circuit-calculator'],
    calculate: (inputs) => {
      const vSrc = Number(inputs.vSource) || 12;
      const vLed = Number(inputs.vLed) || 2.1;
      const mA = Number(inputs.iLed) || 20;

      const amps = mA / 1000;
      const diffV = vSrc - vLed;

      if (diffV <= 0) {
        return {
          results: [{ label: 'Error', value: 'Source voltage must exceed LED forward voltage drop.', isPrimary: true }]
        };
      }

      const resistance = diffV / amps;
      const watts = diffV * amps;

      return {
        results: [
          { label: 'Required Limit Resistor', value: Math.ceil(resistance), unit: 'Ohms (Ω)', isPrimary: true },
          { label: 'Exact Resistance value', value: resistance.toFixed(2), unit: 'Ohms' },
          { label: 'Minimum Resistor Power', value: watts.toFixed(4), unit: 'Watts' }
        ]
      };
    }
  },
  {
    id: 'eng-resistor-color',
    name: 'Resistor Color Code Solver',
    slug: 'resistor-color-code-calculator',
    category: 'engineering',
    description: 'Solve electronics resistor values based on the colored rings printed around their casings.',
    seoTitle: 'Resistor Ring Color Band Solver | Calculatoora',
    seoDescription: 'Obtain precise resistance values from colored standard 4-band components.',
    inputs: [
      { id: 'band1', label: 'Band 1 Color', type: 'select', defaultValue: 'brown', options: [
        { label: 'Brown (1)', value: 'brown' },
        { label: 'Red (2)', value: 'red' },
        { label: 'Orange (3)', value: 'orange' },
        { label: 'Yellow (4)', value: 'yellow' },
        { label: 'Green (5)', value: 'green' },
        { label: 'Blue (6)', value: 'blue' }
      ]},
      { id: 'band2', label: 'Band 2 Color', type: 'select', defaultValue: 'black', options: [
        { label: 'Black (0)', value: 'black' },
        { label: 'Brown (1)', value: 'brown' },
        { label: 'Red (2)', value: 'red' },
        { label: 'Orange (3)', value: 'orange' },
        { label: 'Yellow (4)', value: 'yellow' },
        { label: 'Green (5)', value: 'green' }
      ]},
      { id: 'multiplier', label: 'Band 3 Multiplier', type: 'select', defaultValue: 'red', options: [
        { label: 'Black (x1)', value: 'black' },
        { label: 'Brown (x10)', value: 'brown' },
        { label: 'Red (x100)', value: 'red' },
        { label: 'Orange (x1k)', value: 'orange' },
        { label: 'Yellow (x10k)', value: 'yellow' }
      ]},
      { id: 'tolerance', label: 'Band 4 Tolerance', type: 'select', defaultValue: 'gold', options: [
        { label: 'Gold (±5%)', value: 'gold' },
        { label: 'Silver (±10%)', value: 'silver' },
        { label: 'Brown (±1%)', value: 'brown' }
      ]}
    ],
    formula: 'Resistance = (Band1_Value * 10 + Band2_Value) * Multiplier_Factor',
    explanation: 'Electronic resistors use visual bands to denote their exact ratings, protecting information from rubbing off.',
    example: 'Brown (1), Black (0), Red (x100), and Gold (±5%) translates to a 1000 Ohm (1kΩ) resistor with a tolerance of ±5%.',
    faq: [
      { question: 'What is tolerance?', answer: 'The maximum variance in physical resistance from the specified label value, determined by manufacturing precision.' }
    ],
    relatedSlugs: ['resistor-calculator', 'circuit-calculator'],
    calculate: (inputs) => {
      const b1 = inputs.band1 || 'brown';
      const b2 = inputs.band2 || 'black';
      const mult = inputs.multiplier || 'red';
      const tol = inputs.tolerance || 'gold';

      const d1Map: Record<string, number> = { brown: 1, red: 2, orange: 3, yellow: 4, green: 5, blue: 6 };
      const d2Map: Record<string, number> = { black: 0, brown: 1, red: 2, orange: 3, yellow: 4, green: 5 };
      const multMap: Record<string, number> = { black: 1, brown: 10, red: 100, orange: 1000, yellow: 10000 };
      const tolMap: Record<string, string> = { gold: '±5%', silver: '±10%', brown: '±1%' };

      const baseVal = (d1Map[b1] || 1) * 10 + (d2Map[b2] || 0);
      const ohm = baseVal * (multMap[mult] || 1);

      return {
        results: [
          { label: 'Calculated Resistance', value: ohm >= 1000 ? `${(ohm / 1000).toFixed(1)}k` : ohm, unit: 'Ohms (Ω)', isPrimary: true },
          { label: 'Manufacturing Tolerance', value: tolMap[tol] || '±5%' }
        ]
      };
    }
  },
  {
    id: 'eng-battery',
    name: 'Battery Runtime Life Calculator',
    slug: 'battery-calculator',
    category: 'engineering',
    description: 'Calculate overall battery lifespan runtimes based on discharge capacities and continuous electrical current draw.',
    seoTitle: 'Battery Lifespan & Amp-Hour Solver | Calculatoora',
    seoDescription: 'Accurately map battery drain speeds on microcontrollers or electrical load structures.',
    inputs: [
      { id: 'capacity', label: 'Battery Capacity (mAh)', type: 'number', defaultValue: 2500, helpText: 'Standard AA ~2500mAh' },
      { id: 'load', label: 'Continuous Current Draw (mA)', type: 'number', defaultValue: 150 },
      { id: 'safety', label: 'Safety discharge buffer margin (%)', type: 'number', defaultValue: 15, max: 80 }
    ],
    formula: 'Hours Lifespan = [ Capacity * (1 - Buffer/100) ] / Current_Draw',
    explanation: 'Battery discharge profiles are non-linear. Preserving a safety buffer ensures batteries do not completely discharge and suffer internal material breakdown.',
    example: 'A 2500mAh battery running a 150mA electronic load with a 15% safety buffer lasts approximately 14.17 hours.',
    faq: [
      { question: 'What does mAh stand for?', answer: 'Milliampere-hour, representing a continuous discharge of one milliamp of electrical current for one full hour.' }
    ],
    relatedSlugs: ['solar-calculator', 'electrical-calculator'],
    calculate: (inputs) => {
      const cap = Number(inputs.capacity) || 2500;
      const load = Number(inputs.load) || 100;
      const bufferPct = Number(inputs.safety) || 15;

      const factor = 1 - (bufferPct / 100);
      const hours = (cap * factor) / load;

      return {
        results: [
          { label: 'Expected Active Life Duration', value: hours.toFixed(2), unit: 'Hours', isPrimary: true },
          { label: 'In Days', value: (hours / 24).toFixed(2), unit: 'Days' }
        ],
        chartData: [
          { name: 'Usable Milliamps', value: cap * factor, color: '#39FF14' },
          { name: 'Reserve Safety Margin', value: cap * (1 - factor), color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'eng-solar',
    name: 'Solar Panel System Sizing Calculator',
    slug: 'solar-calculator',
    category: 'engineering',
    description: 'Size solar photovoltaic grid configurations, calculating panel array watt requirements based on consumption targets.',
    seoTitle: 'Solar Panel Array Sizing Calculator | Calculatoora',
    seoDescription: 'Design off-grid and connected home solar setups. Instantly calculate array wattage targets.',
    inputs: [
      { id: 'dailyWh', label: 'Daily Energy Consumption (Wh)', type: 'number', defaultValue: 5000, helpText: 'e.g., standard residential appliances' },
      { id: 'sunHours', label: 'Daily Peak Sun Hours (avg)', type: 'number', defaultValue: 4.5, min: 1, max: 12 },
      { id: 'losses', label: 'Typical Inverter & Cable Losses (%)', type: 'number', defaultValue: 25 }
    ],
    formula: 'Required Grid Array Size = Daily Wh / (Peak sun hours * Efficiency_Ratio)',
    explanation: 'PV panels only operate at maximum efficiency during Peak Sun Hours. Factoring in inverter conversions and line losses ensures solar designs output sufficient power.',
    example: 'A property consuming 5000 Wh daily in a region receiving 4.5 annual sun hours requires a 1.48 kW solar panel array at 25% system loss losses.',
    faq: [
      { question: 'What is a peak sun hour?', answer: 'An hour during which solar irradiance levels reach an average of 1000 Watts per square meter.' }
    ],
    relatedSlugs: ['battery-calculator', 'electrical-calculator'],
    calculate: (inputs) => {
      const wh = Number(inputs.dailyWh) || 5000;
      const sun = Number(inputs.sunHours) || 4;
      const losses = Number(inputs.losses) || 25;

      const efficiency = 1 - (losses / 100);
      const minWat = wh / (sun * efficiency);

      return {
        results: [
          { label: 'Required Solar Array Size', value: minWat.toFixed(0), unit: 'Watts', isPrimary: true },
          { label: 'Array Size in kW', value: (minWat / 1000).toFixed(3), unit: 'kW' },
          { label: 'Approx 400W Panels required', value: Math.ceil(minWat / 400), unit: 'panels' }
        ],
        chartData: [
          { name: 'Active Panel Watts', value: minWat, color: '#39FF14' },
          { name: 'System Deficit loss', value: minWat * (losses / 100), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'eng-mechanical-advantage',
    name: 'Mechanical Advantage Lever Calculator',
    slug: 'mechanical-advantage-calculator',
    category: 'engineering',
    description: 'Determine the mechanical advantage advantage output of simple lever and fulcrum machines.',
    seoTitle: 'Fulcrum Lever Mechanical Advantage Solver | Calculatoora',
    seoDescription: 'Obtain lever force multipliers instantly. Ideal for physics study.',
    inputs: [
      { id: 'effortArm', label: 'Effort Arm Length (Meters)', type: 'number', defaultValue: 2.5 },
      { id: 'loadArm', label: 'Load Arm Length (Meters)', type: 'number', defaultValue: 0.5 },
      { id: 'effortForce', label: 'Input Force Applied (Newtons)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Mechanical Advantage (MA) = Effort Arm / Load Arm \nOutput Force = Input Force * MA',
    explanation: 'Mechanical advantage uses lever ratios to amplify physical forces, minimizing the effort required to lift heavy loads.',
    example: 'A lever with a 2.5 m effort arm and 0.5 m load arm yields a mechanical advantage of 5.0, multiplying a 100 N input into a 500 N force.',
    faq: [
      { question: 'What is Archimedes’ lever quote?', answer: '"Give me a lever long enough and a fulcrum on which to place it, and I shall move the world."' }
    ],
    relatedSlugs: ['gear-ratio-calculator', 'physics-torque-calculator'],
    calculate: (inputs) => {
      const eff = Number(inputs.effortArm) || 1;
      const lod = Number(inputs.loadArm) || 0.1;
      const f = Number(inputs.effortForce) || 100;

      const ma = eff / lod;
      const outF = f * ma;

      return {
        results: [
          { label: 'Mechanical Advantage Factor (MA)', value: ma.toFixed(2), unit: 'x ratio', isPrimary: true },
          { label: 'Amplified Output force', value: outF.toFixed(1), unit: 'Newtons (N)' },
          { label: 'Lifting Mass equivalent', value: (outF / 9.81).toFixed(1), unit: 'kg' }
        ]
      };
    }
  },
  {
    id: 'eng-gear',
    name: 'Gear Ratio Calculator',
    slug: 'gear-ratio-calculator',
    category: 'engineering',
    description: 'Calculate gear ratios, rotary speed reductions, and output torque amplification factors for mechanical drivetrains.',
    seoTitle: 'Rotary Gear Train Ratio Calculator | Calculatoora',
    seoDescription: 'Analyze mechanical transmission speeds and torque adjustments using gear teeth ratios.',
    inputs: [
      { id: 'teethInput', label: 'Input Drive Gear Teeth', type: 'number', defaultValue: 12 },
      { id: 'teethOutput', label: 'Output Driven Gear Teeth', type: 'number', defaultValue: 36 },
      { id: 'inputRPM', label: 'Input Shafter Speed (RPM)', type: 'number', defaultValue: 1800 }
    ],
    formula: 'Gear Ratio = Driven Teeth / Driver Teeth \nOutput Speed = Input speed / Gear Ratio',
    explanation: 'Gear systems trade speed for force. Mesh matching smaller drive gears with larger driven gears amplifies torque while lowering rotational speeds.',
    example: 'Driving a 36-tooth gear with a 12-tooth drive gear yields a 3.0 gear ratio, dropping input speeds of 1800 RPM to 600 RPM.',
    faq: [
      { question: 'What does a high gear ratio signify?', answer: 'Higher ratios yield significant torque output additions but slow down final axle rotation rates.' }
    ],
    relatedSlugs: ['rpm-calculator', 'mechanical-advantage-calculator'],
    calculate: (inputs) => {
      const src = Number(inputs.teethInput) || 12;
      const dest = Number(inputs.teethOutput) || 36;
      const rpm = Number(inputs.inputRPM) || 1000;

      const ratio = dest / src;
      const finalRpm = rpm / ratio;

      return {
        results: [
          { label: 'Gear Ratio', value: `${ratio.toFixed(2)} : 1`, isPrimary: true },
          { label: 'Resulting Output Shaft Speed', value: Math.round(finalRpm), unit: 'RPM' },
          { label: 'Relative Torque Amplifier', value: ratio.toFixed(2), unit: 'x fold' }
        ],
        chartData: [
          { name: 'Input Gear size', value: src, color: '#312e81' },
          { name: 'Output Gear size', value: dest, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'eng-rpm',
    name: 'RPM & Speed Calculator',
    slug: 'rpm-calculator',
    category: 'engineering',
    description: 'Solve shaft RPM speeds, linear surface meters, and motor spindle frequencies easily.',
    seoTitle: 'Rotational RPM Shaft Velocity Calculator | Calculatoora',
    seoDescription: 'Convert linear surface travel rates into equivalent rotation rates based on wheel sizes.',
    inputs: [
      { id: 'diam', label: 'Rotary Wheel Diameter (mm)', type: 'number', defaultValue: 200 },
      { id: 'linearSpeed', label: 'Linear Speed (meters/min)', type: 'number', defaultValue: 150 }
    ],
    formula: 'Circumference = π * Diameter \nRPM = Linear velocity / Circumference',
    explanation: 'RPM conversions help manufacturers set appropriate spindle speeds on machinery relative to blade sizes, protecting items from friction cracking.',
    example: 'Moving a web at 150 meters/min over a 200mm diameter rollers requires a rotational speed of 239 RPM.',
    faq: [
      { question: 'Why does wheel wear affect speed measurements?', answer: 'Wear reduces wheel diameters over time, meaning shafts must rotate faster (higher RPM) to maintain cohesive linear transit rates.' }
    ],
    relatedSlugs: ['gear-ratio-calculator', 'mechanical-advantage-calculator'],
    calculate: (inputs) => {
      const d = Number(inputs.diam) || 100;
      const linear = Number(inputs.linearSpeed) || 100;

      const circumMeters = (Math.PI * d) / 1000;
      const rpm = circumMeters > 0 ? linear / circumMeters : 0;

      return {
        results: [
          { label: 'Required Shaft Rotation', value: Math.round(rpm), unit: 'RPM', isPrimary: true },
          { label: 'Roller Circumference', value: circumMeters.toFixed(4), unit: 'meters' }
        ]
      };
    }
  },
  {
    id: 'eng-efficiency',
    name: 'Industrial Efficiency Calculator',
    slug: 'efficiency-calculator',
    category: 'engineering',
    description: 'Determine machine or thermo energy output efficiency fractions based on inputs.',
    seoTitle: 'Mechanical & Thermodynamic Efficiency Solver | Calculatoora',
    seoDescription: 'Assess thermodynamic efficiency percentages for engines, solar units, and factory setups.',
    inputs: [
      { id: 'inputEnergy', label: 'Input Energy (Joules or Wh)', type: 'number', defaultValue: 2000 },
      { id: 'usefulEnergy', label: 'Useful Output Energy (Joules)', type: 'number', defaultValue: 1450 }
    ],
    formula: 'Efficiency % = (Useful Output / Total Input) * 100',
    explanation: 'Thermodynamics limits prevent real machinery from reaching 100% mechanical efficiency, as friction and thermal losses dissipate energy.',
    example: 'An engine drawing 2000 Joules of fuel power that outputs 1450 Joules of kinetic work is 72.50% efficient.',
    faq: [
      { question: 'What is the Carnot limit?', answer: 'The theoretical maximum efficiency limit any heat engine can achieve under thermodynamic gas expansion laws.' }
    ],
    relatedSlugs: ['physics-power-calculator', 'solar-calculator'],
    calculate: (inputs) => {
      const inp = Number(inputs.inputEnergy) || 1;
      const out = Number(inputs.usefulEnergy) || 0;

      if (out > inp) {
        return {
          results: [{ label: 'Error', value: 'Output energy cannot exceed input energy under conservation laws.', isPrimary: true }]
        };
      }

      const efficiency = (out / inp) * 100;
      const losses = inp - out;

      return {
        results: [
          { label: 'Operational Efficiency', value: efficiency.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Dissipated Energy Loss', value: losses.toFixed(1), unit: 'Joules' }
        ],
        chartData: [
          { name: 'Useful Output', value: out, color: '#39FF14' },
          { name: 'Lost Heat / friction', value: losses, color: '#475569' }
        ]
      };
    }
  },
  {
    id: 'eng-material-weight',
    name: 'Material Weight Calculator',
    slug: 'material-weight-calculator',
    category: 'engineering',
    description: 'Calculate overall bulk physical weights of geometric metal plates, rods, or liquid blocks.',
    seoTitle: 'Engineering Solid Material Weight Solver | Calculatoora',
    seoDescription: 'Obtain net physical cargo weights based on structural densities and bounding dimension profiles.',
    inputs: [
      { id: 'material', label: 'Source Material Density', type: 'select', defaultValue: 'steel', options: [
        { label: 'Mild Steel (7850 kg/m³)', value: 'steel' },
        { label: 'Aluminum (2700 kg/m³)', value: 'aluminum' },
        { label: 'Copper (8960 kg/m³)', value: 'copper' },
        { label: 'Water (1000 kg/m³)', value: 'water' },
        { label: 'Lead (11340 kg/m³)', value: 'lead' }
      ]},
      { id: 'length', label: 'Material Length (mm)', type: 'number', defaultValue: 1000 },
      { id: 'width', label: 'Material Width (mm)', type: 'number', defaultValue: 500 },
      { id: 'thickness', label: 'Material Thickness (mm)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Volume (m³) = (Length * Width * Thickness) / 1,000,000,000 \nWeight (kg) = Volume * Density',
    explanation: 'Calculating material weights is crucial for structural design and shipping logistics, helping engineers ensure physical loads do not compromise structures.',
    example: 'A steel plate measuring 1000mm x 500mm x 10mm thick has a volume of 0.005 m³, weighing exactly 39.25 kg.',
    faq: [
      { question: 'Why does real steel plate weight vary slightly?', answer: 'Minor manufacturing tolerances during sheet rolling and alloy composition variations can cause actual weight to fluctuate by 2–5%.' }
    ],
    relatedSlugs: ['physics-density-calculator', 'efficiency-calculator'],
    calculate: (inputs) => {
      const mat = inputs.material || 'steel';
      const l = Number(inputs.length) || 0;
      const w = Number(inputs.width) || 0;
      const t = Number(inputs.thickness) || 0;

      const densityMap: Record<string, number> = {
        steel: 7850,
        aluminum: 2700,
        copper: 8960,
        water: 1000,
        lead: 11340
      };

      const density = densityMap[mat] || 7850;
      const volM3 = (l * w * t) / 1000000000;
      const weightKg = volM3 * density;

      return {
        results: [
          { label: 'Estimated Material Weight', value: weightKg.toFixed(2), unit: 'kg', isPrimary: true },
          { label: 'Total Volume', value: volM3.toFixed(6), unit: 'm³' },
          { label: 'Imperial Pound weight', value: (weightKg * 2.20462).toFixed(2), unit: 'lbs' }
        ]
      };
    }
  }
];
