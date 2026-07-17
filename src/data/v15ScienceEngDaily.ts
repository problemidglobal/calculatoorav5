import { Calculator } from '../types';

export const V15_SCIENCE_ENG_DAILY_CALCULATORS: Calculator[] = [
  // ENGINEERING
  {
    id: 'v15-elec-cost',
    name: 'Electrical Cost Calculator',
    slug: 'v15-elec-cost-calculator',
    category: 'engineering',
    description: 'Calculate the electricity cost of operating appliances based on wattage and local utility utility schedules.',
    seoTitle: 'Household Electrical Appliance Cost Calculator',
    seoDescription: 'Find appliance electricity costs. Input device wattage and utility rates to see hourly, monthly, and yearly operating expenses.',
    inputs: [
      { id: 'applianceWatt', label: 'Appliance Power Draw (Watts)', type: 'number', defaultValue: 1500, helpText: 'e.g. Space heater 1500W, TV 100W' },
      { id: 'dailyHours', label: 'Hours Operating per Day', type: 'number', defaultValue: 4 },
      { id: 'utilityRate', label: 'Local Electricity Rate ($ / kWh)', type: 'number', defaultValue: 0.16, step: 0.01 }
    ],
    formula: 'Daily energy consumption = (Watts * Hours) / 1000 kWh\nDaily Operating Cost = Kilowatt-hours * Utility Rate',
    explanation: 'Calculating your electricity costs helps you identify household power drains and lower your utility bills.',
    example: 'Operating a 1,500W appliance for 4 hours daily at $0.16/kWh consumes 6 kWh daily, costing exactly $0.96 per day (or $29.20 per month).',
    faq: [
      { question: 'What is a Kilowatt-hour (kWh)?', answer: 'A unit of energy measuring 1,000 watts of power consumed consistently over exactly 1 hour of time.' },
      { question: 'How can I find my exact local rate?', answer: 'Check your monthly electricity bill for the cost per kilowatt-hour (kWh) charged by your utility provider.' }
    ],
    relatedSlugs: ['v15-energy-usage-calculator', 'v15-machine-cost-calculator'],
    calculate: (inputs) => {
      const watts = Number(inputs.applianceWatt || 100);
      const hrs = Number(inputs.dailyHours || 1);
      const rate = Number(inputs.utilityRate || 0.15);

      const dailyKwh = (watts * hrs) / 1000;
      const dailyCost = dailyKwh * rate;
      const monthlyCost = dailyCost * 30.4;
      const annualCost = dailyCost * 365;

      return {
        results: [
          { label: 'Operating Cost / Month', value: `$${monthlyCost.toFixed(2)}`, isPrimary: true },
          { label: 'Operating Cost / Day', value: `$${dailyCost.toFixed(2)}` },
          { label: 'Energy Consumed Daily', value: `${dailyKwh.toFixed(3)} kWh` },
          { label: 'Operating Cost / Year', value: `$${annualCost.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Monthly Bill portion', value: Math.round(monthlyCost) },
          { name: 'Daily cost portion', value: Math.round(dailyCost * 100) }
        ]
      };
    }
  },
  {
    id: 'v15-energy-usage',
    name: 'Energy Usage Calculator',
    slug: 'v15-energy-usage-calculator',
    category: 'engineering',
    description: 'Calculate and analyze energy consumption profiles for your household appliances or heating units.',
    seoTitle: 'Household Energy Usage & Carbon Footprint Calculator',
    seoDescription: 'Audit your home energy consumption. Track daily kilowatt-hour (kWh) usage and see estimated carbon emissions.',
    inputs: [
      { id: 'dailyKwh', label: 'Average Daily Energy Usage (kWh)', type: 'number', defaultValue: 30 },
      { id: 'carbonFactor', label: 'Grid Carbon Intensity (kg CO2 / kWh)', type: 'number', defaultValue: 0.38, helpText: 'US Average is approx 0.38 - 0.45 kg' }
    ],
    formula: 'Carbon Footprint (kg CO2) = Energy (kWh) * Carbon Intensity Factor',
    explanation: 'Tracking your household energy usage is the first step toward lowering your utility costs and reducing your environmental footprint.',
    example: 'Consuming 30 kWh daily with a 0.38 carbon factor generates exactly 11.40 kg of carbon dioxide daily, totaling 4,161 kg of CO2 annually.',
    faq: [
      { question: 'What is household grid carbon intensity?', answer: 'The amount of carbon dioxide emitted per kilowatt-hour of energy generated, depending on your region\'s power sources (coal, gas, wind).' },
      { question: 'How can I reduce my grid carbon footprint?', answer: 'Shift heavier appliance use to off-peak hours, transition to LED bulbs, and choose energy-efficient appliances.' }
    ],
    relatedSlugs: ['v15-elec-cost-calculator', 'v15-machine-cost-calculator'],
    calculate: (inputs) => {
      const kwh = Number(inputs.dailyKwh || 10);
      const factor = Number(inputs.carbonFactor || 0.4);

      const dailyCarbonKg = kwh * factor;
      const annualCarbonTonnes = (dailyCarbonKg * 365) / 1000;

      return {
        results: [
          { label: 'Annual Carbon Footprint', value: `${annualCarbonTonnes.toFixed(2)} Metric Tonnes CO2`, isPrimary: true },
          { label: 'Daily Carbon Released', value: `${dailyCarbonKg.toFixed(2)} kg CO2` },
          { label: 'Monthly Energy Consumption', value: `${(kwh * 30.4).toFixed(1)} kWh` }
        ],
        chartData: [
          { name: 'Daily CO2 (kg)', value: Math.round(dailyCarbonKg) },
          { name: 'Target Baseline', value: 10 }
        ]
      };
    }
  },
  {
    id: 'v15-mech-power',
    name: 'Mechanical Power Calculator',
    slug: 'v15-mech-power-calculator',
    category: 'engineering',
    description: 'Calculate mechanical work rates, motor horsepower (HP), and watt values based on force and velocity.',
    seoTitle: 'Mechanical Power & Motor Horsepower Calculator',
    seoDescription: 'Find motor horsepower and watt ratings. Input load force and velocity to calculate mechanical work rates.',
    inputs: [
      { id: 'forceNewton', label: 'Applied Force (Newtons)', type: 'number', defaultValue: 500 },
      { id: 'velocityMs', label: 'Velocity (Meters/Second)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Power (Watts) = Force (N) * Velocity (m/s)\nHorsepower (HP) = Power (Watts) / 745.7',
    explanation: 'Power measures the rate of mechanical work. Horsepower is the matching Imperial standard, used to size mechanical engines and motors.',
    example: 'Applying 500 Newtons of force to move an object at 3 m/s generates exactly 1,500 Watts (or 2.01 Horsepower).',
    faq: [
      { question: 'What is mechanical horsepower?', answer: 'An imperial unit of power equivalent to 745.7 Watts, originally defined to compare steam engine capacity with draft animals.' },
      { question: 'How is mechanical work related to power?', answer: 'Work measures the overall energy transferred, while power measures the rate of that energy transfer over time.' }
    ],
    relatedSlugs: ['v15-machine-cost-calculator', 'v15-eng-conversion-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.forceNewton || 100);
      const v = Number(inputs.velocityMs || 1);

      const watts = f * v;
      const hp = watts / 745.7;

      return {
        results: [
          { label: 'Generated Power (Watts)', value: `${watts.toFixed(1)} W`, isPrimary: true },
          { label: 'Motor Rating in Horsepower', value: `${hp.toFixed(2)} HP` },
          { label: 'Calculated Work per Minute', value: `${(watts * 60).toLocaleString()} Joules` }
        ],
        chartData: [
          { name: 'Watts', value: Math.round(watts) },
          { name: 'HP scaled (x300)', value: Math.round(hp * 300) }
        ]
      };
    }
  },
  {
    id: 'v15-machine-cost',
    name: 'Machine Cost Calculator',
    slug: 'v15-machine-cost-calculator',
    category: 'engineering',
    description: 'Calculate the real business cost of operating heavy machinery based on acquisition costs and fuel rates.',
    seoTitle: 'Industrial Machine & Equipment Operating Cost Estimator',
    seoDescription: 'Estimate industrial machinery operations costs. Balance fuel fuel budgets and equipment depreciation.',
    inputs: [
      { id: 'machinePrice', label: 'Machine Purchase Price ($)', type: 'number', defaultValue: 45000 },
      { id: 'hourlyMaintenance', label: 'Maintenance Cost ($ / Operating Hour)', type: 'number', defaultValue: 8.5 },
      { id: 'fuelGph', label: 'Fuel Draw (Gallons / Hour)', type: 'number', defaultValue: 1.8 },
      { id: 'fuelCostGas', label: 'Fuel Price ($ / Gallon)', type: 'number', defaultValue: 3.8 }
    ],
    formula: 'Operating Hour Cost = (Purchase Price / Lifetime hours) + Maintenance/hr + (Fuel rate * Fuel price)',
    explanation: 'Calculating machinery operating costs helps you optimize bidding rates for construction jobs, keeping operations profitable.',
    example: 'Pruning a $45,000 backhoe over 5,000 lifetime hours with a $1.8GPH fuel rate and $8.50/hr maintenance totals exactly $24.34 per operating hour.',
    faq: [
      { question: 'What is machine depreciation?', answer: 'The systematic spreading of a machine\'s initial purchase price across its expected useful lifespan.' },
      { question: 'How can we lower machine costs?', answer: 'Conduct preventative maintenance to minimize breakdowns and optimize motor idle speeds to limit fuel waste.' }
    ],
    relatedSlugs: ['v15-elec-cost-calculator', 'v15-mech-power-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.machinePrice || 10000);
      const maintenance = Number(inputs.hourlyMaintenance || 5);
      const fuelRate = Number(inputs.fuelGph || 1);
      const fuelCost = Number(inputs.fuelCostGas || 3.5);

      const amortizedLifespanHours = 5000; // industry standard assumption
      const depreciationPerHr = price / amortizedLifespanHours;
      const fuelPerHr = fuelRate * fuelCost;
      const totalHrCost = depreciationPerHr + maintenance + fuelPerHr;

      return {
        results: [
          { label: 'Overall Cost / Operating Hour', value: `$${totalHrCost.toFixed(2)}`, isPrimary: true },
          { label: 'Direct Fuel Burn / Hour', value: `$${fuelPerHr.toFixed(2)}` },
          { label: 'Amortized Depreciation / Hour', value: `$${depreciationPerHr.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Depreciation', value: Math.round(depreciationPerHr) },
          { name: 'Maintenance', value: Math.round(maintenance) },
          { name: 'Fuel', value: Math.round(fuelPerHr) }
        ]
      };
    }
  },
  {
    id: 'v15-eng-conversion',
    name: 'Engineering Conversion Calculator',
    slug: 'v15-eng-conversion-calculator',
    category: 'engineering',
    description: 'Convert mechanical engineering units across standard metric and imperial systems.',
    seoTitle: 'Industrial Engineering & Torque Converter',
    seoDescription: 'Convert torque, temperature, and length metrics across systems. Handle foot-pounds to Newton-meters with ease.',
    inputs: [
      { id: 'primaryValue', label: 'Value to Convert', type: 'number', defaultValue: 100 },
      { id: 'convertType', label: 'Engineering Unit Pair', type: 'select', defaultValue: 'tq', options: [
        { label: 'Torque: Foot-pounds to Newton-meters', value: 'tq' },
        { label: 'Power: Gallons to Liters volumetric', value: 'gal' }
      ]}
    ],
    formula: 'Torque: 1 ft-lb = 1.35582 Nm\nVolume: 1 Gallon = 3.78541 Liters',
    explanation: 'Converting engineering units accurately protects structural designs and prevents alignment errors on cross-border manufacturing runs.',
    example: 'Converting 100 foot-pounds of torque yields exactly 135.58 Newton-meters (Nm).',
    faq: [
      { question: 'Why use Newton-meters for torque?', answer: 'Newton-meters (Nm) is the standard metric system unit for torque, representing the torque output from 1 Newton applied' },
      { question: 'What represents the standard conversion factor for gallons?', answer: 'One US liquid gallon converts to exactly 3.78541 liters.' }
    ],
    relatedSlugs: ['v15-mech-power-calculator', 'v15-accel-convert-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.primaryValue || 1);
      const type = String(inputs.convertType || 'tq');

      let result = 0;
      let label = 'Result';

      if (type === 'tq') {
        result = val * 1.35582;
        label = 'Resulting Torque Value (Nm)';
      } else {
        result = val * 3.78541;
        label = 'Resulting Fluid Volume (Liters)';
      }

      return {
        results: [
          { label, value: result.toFixed(3), isPrimary: true },
          { label: 'Original value units', value: val.toString() }
        ],
        chartData: [
          { name: 'Original', value: Math.round(val) },
          { name: 'Converted', value: Math.round(result) }
        ]
      };
    }
  },

  // SCIENCE - PHYSICS
  {
    id: 'v15-accel-convert',
    name: 'Acceleration Converter',
    slug: 'v15-accel-convert-calculator',
    category: 'science',
    description: 'Convert acceleration measurements across standard systems like G-force, and meters per second squared.',
    seoTitle: 'Sub-Sonic Acceleration G-Force Converter',
    seoDescription: 'Convert acceleration metrics. Plug meters-per-second-squared (m/s^2) in to find equivalent standard G-force ratings.',
    inputs: [
      { id: 'accelVal', label: 'Acceleration Rate', type: 'number', defaultValue: 9.80665 },
      { id: 'convertFrom', label: 'Source Unit', type: 'select', defaultValue: 'm-s2', options: [
        { label: 'Meters/second² (m/s²)', value: 'm-s2' },
        { label: 'Standard G-force (g)', value: 'g-force' }
      ]}
    ],
    formula: 'G-force = Acceleration in m/s² / 9.80665',
    explanation: 'Converting acceleration metrics helps you analyze vehicle dynamics and understand environmental safety limits.',
    example: 'An acceleration rate of 9.81 m/s² is equivalent to exactly 1.00 G-Force standard.',
    faq: [
      { question: 'What is standard gravity acceleration?', answer: 'Average acceleration due to gravity on Earth is 9.80665 m/s², which equals exactly 1.0 G-Force.' },
      { question: 'Why does G-Force mapping matter for pilots?', answer: 'High G-forces can restrict blood flow, requiring fighter pilots to use G-suits to prevent blackouts.' }
    ],
    relatedSlugs: ['v15-force-unit-calculator', 'v15-eng-conversion-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.accelVal || 0);
      const from = String(inputs.convertFrom || 'm-s2');

      let gValue = 0;
      let ms2Value = 0;

      if (from === 'm-s2') {
        ms2Value = val;
        gValue = val / 9.80665;
      } else {
        gValue = val;
        ms2Value = val * 9.80665;
      }

      return {
        results: [
          { label: 'Standard Gravitational G-Force', value: `${gValue.toFixed(4)} g`, isPrimary: true },
          { label: 'Metric Acceleration Rate', value: `${ms2Value.toFixed(4)} m/s²` }
        ],
        chartData: [
          { name: 'm/s2 rate', value: Math.round(ms2Value) },
          { name: 'G value (x10)', value: Math.round(gValue * 10) }
        ]
      };
    }
  },
  {
    id: 'v15-force-unit',
    name: 'Force Unit Calculator',
    slug: 'v15-force-unit-calculator',
    category: 'science',
    description: 'Convert force measurements across scientific systems, including Newtons, Pound-force, and Dynes.',
    seoTitle: 'Scientific Force Unit Newton & Pound Converter',
    seoDescription: 'Convert physical force units. Bridge Newtons and pound-force metrics with high precision.',
    inputs: [
      { id: 'forceVal', label: 'Force Value to Convert', type: 'number', defaultValue: 100 },
      { id: 'convertType', label: 'Force System Conversion', type: 'select', defaultValue: 'n-lb', options: [
        { label: 'Newtons to Pound-force (lbf)', value: 'n-lb' },
        { label: 'Pound-force to Newtons (N)', value: 'lb-n' }
      ]}
    ],
    formula: '1 Newton = 0.224809 lbf\n1 lbf = 4.44822 Newtons',
    explanation: 'Converting force units accurately is a fundamental requirement for physicists and structural engineers working on cross-border manufacturing.',
    example: 'Converting 100 Newtons of force yields exactly 22.48 pounds-force (lbf).',
    faq: [
      { question: 'What is a Newton (N)?', answer: 'The standard SI unit of force, representing the force needed to accelerate a 1 kg mass at 1 m/s².' },
      { question: 'How is a dyne related to a Newton?', answer: 'One dyne is a precision CGS unit of force, equivalent to exactly 10^-5 Newtons.' }
    ],
    relatedSlugs: ['v15-accel-convert-calculator', 'v15-pressure-unit-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.forceVal || 0);
      const type = String(inputs.convertType || 'n-lb');

      let result = 0;
      let label = 'Result';

      if (type === 'n-lb') {
        result = val * 0.224809;
        label = 'Resulting Force (lbf)';
      } else {
        result = val * 4.44822;
        label = 'Resulting Force (Newtons)';
      }

      return {
        results: [
          { label, value: result.toFixed(4), isPrimary: true },
          { label: 'Input original force', value: val.toString() }
        ],
        chartData: [
          { name: 'Original', value: Math.round(val) },
          { name: 'Converted', value: Math.round(result) }
        ]
      };
    }
  },
  {
    id: 'v15-energy-unit',
    name: 'Energy Unit Calculator',
    slug: 'v15-energy-unit-calculator',
    category: 'science',
    description: 'Convert energy units across scientific systems, including Joules, Calories, and British Thermal Units (BTU).',
    seoTitle: 'Scientific Energy Unit Joule & Calorie Converter',
    seoDescription: 'Convert physical energy metrics. Convert Joules, Kilocalories, and BTUs instantly.',
    inputs: [
      { id: 'energyVal', label: 'Energy Value', type: 'number', defaultValue: 1000 },
      { id: 'convertType', label: 'Energy Unit Conversion', type: 'select', defaultValue: 'j-cal', options: [
        { label: 'Joules to Calories', value: 'j-cal' },
        { label: 'BTU to Joules', value: 'b-j' }
      ]}
    ],
    formula: '1 Joule = 0.239006 Calories\n1 BTU = 1055.06 Joules',
    explanation: 'Converting energy units is vital for managing heating, cooling, thermodynamic systems, and mechanical engine designs.',
    example: 'Converting 1,000 Joules of energy yields approximately 239.01 Calories.',
    faq: [
      { question: 'What is a British Thermal Unit (BTU)?', answer: 'The amount of heat energy needed to raise the temperature of 1 pound of water by 1 degree Fahrenheit.' },
      { question: 'How is a food Calorie defined?', answer: 'A food Calorie (capital C) represents 1 Kilocalorie (1,000 small chemistry calories), which equals 4,184 Joules.' }
    ],
    relatedSlugs: ['v15-force-unit-calculator', 'v15-pressure-unit-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.energyVal || 0);
      const type = String(inputs.convertType || 'j-cal');

      let result = 0;
      let label = 'Result';

      if (type === 'j-cal') {
        result = val * 0.239006;
        label = 'Converted Energy (Calories)';
      } else {
        result = val * 1055.06;
        label = 'Converted Energy (Joules)';
      }

      return {
        results: [
          { label, value: result.toFixed(3), isPrimary: true },
          { label: 'Original value unit', value: val.toString() }
        ],
        chartData: [
          { name: 'Original', value: Math.round(val) },
          { name: 'Converted', value: Math.round(result) }
        ]
      };
    }
  },
  {
    id: 'v15-pressure-unit',
    name: 'Pressure Unit Calculator',
    slug: 'v15-pressure-unit-calculator',
    category: 'science',
    description: 'Convert pressure measurements across scientific systems, including Pascals, PSI, and standard atmospheres.',
    seoTitle: 'Atmospheric Pressure pascal & PSI Converter',
    seoDescription: 'Convert operational pressure ratings. Translate Pascals (Pa), PSI, and atmospheres with high precision.',
    inputs: [
      { id: 'pressureVal', label: 'Pressure Value', type: 'number', defaultValue: 101325 },
      { id: 'convertType', label: 'Pressure Unit Conversion', type: 'select', defaultValue: 'pa-atm', options: [
        { label: 'Pascals (Pa) to Atmospheres (atm)', value: 'pa-atm' },
        { label: 'PSI to Pascals (Pa)', value: 'psi-pa' }
      ]}
    ],
    formula: '1 atm = 101,325 Pascals\n1 PSI = 6,894.76 Pascals',
    explanation: 'Converting pressure units is critical for fluid dynamics, weather forecasting, mechanical safety designs, and scuba diving plans.',
    example: 'Converting 101,325 Pascals yields exactly 1.00 Standard Atmosphere (atm).',
    faq: [
      { question: 'What is a Pascal (Pa)?', answer: 'The standard SI unit of pressure, representing a force of 1 Newton applied over 1 square meter.' },
      { question: 'What is standard atmospheric pressure at sea level?', answer: 'Exactly 1.0 atmosphere, which is equivalent to 101,325 Pascals or approximately 14.7 PSI.' }
    ],
    relatedSlugs: ['v15-force-unit-calculator', 'v15-wave-length-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.pressureVal || 0);
      const type = String(inputs.convertType || 'pa-atm');

      let result = 0;
      let label = 'Result';

      if (type === 'pa-atm') {
        result = val / 101325;
        label = 'Converted Pressure (atm)';
      } else {
        result = val * 6894.76;
        label = 'Converted Pressure (Pascals)';
      }

      return {
        results: [
          { label, value: result.toFixed(5), isPrimary: true },
          { label: 'Original pressure amount', value: val.toString() }
        ],
        chartData: [
          { name: 'Original', value: Math.round(val / 100) },
          { name: 'Converted', value: Math.round(result * 100) }
        ]
      };
    }
  },
  {
    id: 'v15-wave-length',
    name: 'Wavelength Calculator',
    slug: 'v15-wave-length-calculator',
    category: 'science',
    description: 'Calculate physics wave frequencies and lengths based on electromagnetic speed standards.',
    seoTitle: 'Electromagnetic Wavelength & Wave Frequency Calculator',
    seoDescription: 'Determine electromagnetic wavelength metrics. Enter wave frequency (Hz) to calculate lengths in nanometer scales.',
    inputs: [
      { id: 'frequencyHz', label: 'Wave Frequency (MHz)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Wavelength (λ) = Speed of Light (c) / Frequency (f)',
    explanation: 'Electromagnetic waves travel at the speed of light (approximately 299,792,458 meters per second in a vacuum). Wavelength and frequency are inversely proportional.',
    example: 'An FM radio frequency of 100 MHz has an electromagnetic wavelength of exactly 3.00 meters.',
    faq: [
      { question: 'What is the speed of light?', answer: 'Exactly 299,792,458 meters per second limit of velocity in universal vacuums.' },
      { question: 'Why are wavelength and frequency inversely proportional?', answer: 'Since the speed of light is constant, higher frequencies force waves closer together, resulting in shorter wavelengths.' }
    ],
    relatedSlugs: ['v15-pressure-unit-calculator', 'v15-accel-convert-calculator'],
    calculate: (inputs) => {
      const fMhz = Number(inputs.frequencyHz || 100);

      const c = 299792458; // m/s
      const hz = fMhz * 1000000;
      const lambda = hz > 0 ? c / hz : 0;

      return {
        results: [
          { label: 'Calculated Wavelength (λ)', value: `${lambda.toFixed(4)} Meters`, isPrimary: true },
          { label: 'Wave Frequency', value: `${fMhz} MHz` },
          { label: 'Estimated Wave Energy', value: `${(6.626e-34 * (c / lambda)).toExponential(4)} Joules (approximate photon charge)` }
        ],
        chartData: [
          { name: 'Frequency (MHz)', value: fMhz }
        ]
      };
    }
  },

  // SCIENCE - CHEMISTRY
  {
    id: 'v15-chem-unit',
    name: 'Chemistry Unit Converter',
    slug: 'v15-chem-unit-calculator',
    category: 'science',
    description: 'Convert gas volume and temperature measurements across standard chemical laboratory systems.',
    seoTitle: 'Scientific Chemistry Lab Metric Converter',
    seoDescription: 'Convert laboratory volume and temperature measurements. Translate Kelvins, Celsius, and milliliters instantly.',
    inputs: [
      { id: 'temperatureC', label: 'Temperature in Celsius (°C)', type: 'number', defaultValue: 25 }
    ],
    formula: 'Kelvin = Celsius + 273.15\nFahrenheit = (Celsius * 9/5) + 32',
    explanation: 'Converting chemistry units is a fundamental requirement for executing physical gas laws and preparing accurate solution blends.',
    example: 'A room temperature of 25 °C is equivalent to exactly 298.15 Kelvin.',
    faq: [
      { question: 'Why does scientific gas law use Kelvin?', answer: 'The Kelvin scale starts at absolute zero, preventing negative numbers in volumetric gas ratios, which would break calculations.' },
      { question: 'What is absolute zero?', answer: 'The theoretical temperature representing zero molecular energy, equivalent to exactly -273.15 °C.' }
    ],
    relatedSlugs: ['v15-concentration-convert-calculator', 'v15-chem-qty-calculator'],
    calculate: (inputs) => {
      const c = Number(inputs.temperatureC || 0);

      const k = c + 273.15;
      const f = (c * 9) / 5 + 32;

      return {
        results: [
          { label: 'Thermodynamic Temperature (Kelvin)', value: `${k.toFixed(2)} K`, isPrimary: true },
          { label: 'Imperial Fahrenheit temperature', value: `${f.toFixed(1)} °F` },
          { label: 'Absolute Zero Delta Shift', value: `${(c + 273.15).toFixed(2)} K` }
        ],
        chartData: [
          { name: 'Celsius', value: Math.round(c) },
          { name: 'Kelvin', value: Math.round(k) }
        ]
      };
    }
  },
  {
    id: 'v15-concentration-convert',
    name: 'Concentration Converter',
    slug: 'v15-concentration-convert-calculator',
    category: 'science',
    description: 'Convert solution concentration values across standard laboratory metrics, such as molarity and parts-per-million (ppm).',
    seoTitle: 'Chemistry solution Concentration Converter',
    seoDescription: 'Convert solution concentrations. Translate molarity, ppm, and mass percentage metrics with high precision.',
    inputs: [
      { id: 'solutePpm', label: 'Solution Concentration (ppm)', type: 'number', defaultValue: 150 }
    ],
    formula: 'Concentration (mg/L) = parts-per-million (ppm) in aqueous standard solutions.',
    explanation: 'Parts-per-million is the standard unit for tracking solute dilution, used to monitor water purity and environmental safety limits.',
    example: 'A water sample containing 150 ppm of dissolved solids has a concentration of exactly 150 mg per liter of water.',
    faq: [
      { question: 'What does ppm measure?', answer: 'Ppm measures the mass ratio of solute to solvent, representing 1 milligram of solute per 1 kilogram (approx 1 liter) of liquid.' },
      { question: 'What is water hardness in ppm?', answer: 'Water containing over 120 ppm of dissolved calcium and magnesium is classified as hard water.' }
    ],
    relatedSlugs: ['v15-chem-unit-calculator', 'v15-chem-qty-calculator'],
    calculate: (inputs) => {
      const ppm = Number(inputs.solutePpm || 0);

      const mgL = ppm;
      const gL = ppm / 1000;

      return {
        results: [
          { label: 'Concentration in Milligrams / Liter', value: `${mgL.toFixed(1)} mg/L`, isPrimary: true },
          { label: 'Concentration in Grams / Liter', value: `${gL.toFixed(4)} g/L` },
          { label: 'Water Purity Grade', value: ppm <= 50 ? 'Pure Drinking Water' : ppm <= 300 ? 'Hard / Mineral Water' : 'High TDS / Waste water' }
        ],
        chartData: [
          { name: 'ppm level', value: ppm },
          { name: 'EPA baseline limit', value: 500 }
        ]
      };
    }
  },
  {
    id: 'v15-chem-qty',
    name: 'Chemical Quantity Calculator',
    slug: 'v15-chem-qty-calculator',
    category: 'science',
    description: 'Calculate solute mass requirements for chemical solutions based on molarity and volume.',
    seoTitle: 'Molarity Solution Solute Mass Calculator',
    seoDescription: 'Calculate required solute mass in grams. Balance volume and target molarity to prepare precise chemistry solutions.',
    inputs: [
      { id: 'molarityVal', label: 'Target Molarity (mol / L)', type: 'number', defaultValue: 0.5, step: 0.05 },
      { id: 'solutionVolume', label: 'Solution Volume (Liters)', type: 'number', defaultValue: 2 },
      { id: 'molecularWeight', label: 'Solute Molecular Weight (g/mol)', type: 'number', defaultValue: 58.44, helpText: 'e.g. Sodium Chloride (NaCl) is 58.44 g/mol' }
    ],
    formula: 'Moles required = Molarity * Volume\nMass required (Grams) = Moles * Molecular Weight',
    explanation: 'Calculating solute mass requirements is the foundation of chemistry lab prep, ensuring solutions match desired molar concentration targets.',
    example: 'Preparing 2 Liters of a 0.5M Sodium Chloride (NaCl, 58.44 g/mol) solution requires exactly 58.44 grams of solute.',
    faq: [
      { question: 'What is molarity (M)?', answer: 'A unit of concentration measured in moles of solute dissolved per 1 liter of liquid solution.' },
      { question: 'How is molecular weight determined?', answer: 'The sum of the atomic weights of all atoms in a molecule\'s chemical formula (found on the Periodic Table).' }
    ],
    relatedSlugs: ['v15-chem-unit-calculator', 'v15-concentration-convert-calculator'],
    calculate: (inputs) => {
      const molarity = Number(inputs.molarityVal || 0.1);
      const vol = Number(inputs.solutionVolume || 1);
      const mw = Number(inputs.molecularWeight || 40);

      const moles = molarity * vol;
      const massGrams = moles * mw;

      return {
        results: [
          { label: 'Required Solute Mass', value: `${massGrams.toFixed(3)} Grams`, isPrimary: true },
          { label: 'Target Solute moles', value: `${moles.toFixed(3)} moles` },
          { label: 'Target Solution Volume', value: `${vol} Liters` }
        ],
        chartData: [
          { name: 'Mass needed (g)', value: Math.round(massGrams) }
        ]
      };
    }
  },

  // SCIENCE - BIOLOGY
  {
    id: 'v15-bio-measure',
    name: 'Biology Measurement Calculator',
    slug: 'v15-bio-measure-calculator',
    category: 'science',
    description: 'Calculate cell magnification scales and micro-measurement values in biological studies.',
    seoTitle: 'Cell Magnification & Microscope Scale Calculator',
    seoDescription: 'Determine cell magnification variables. Convert real size and image sizes to guide microscope studies.',
    inputs: [
      { id: 'imageSizeMm', label: 'Observed Image Size (mm)', type: 'number', defaultValue: 45 },
      { id: 'magnificationPower', label: 'Microscope Magnification Power (x)', type: 'number', defaultValue: 400 }
    ],
    formula: 'Real Cell Size (µm) = (Image Size in mm * 1000) / Magnification Power',
    explanation: 'Cells are too small to measure directly. This calculator uses microscope magnification power to back-calculate the actual microscopic size of your biological samples.',
    example: 'An observed cell image measuring 45 mm under 400x magnification has an actual cell size of exactly 112.50 micrometers (µm).',
    faq: [
      { question: 'What is a micrometer (µm)?', answer: 'A metric unit of length equal to 1 millionth of a meter, or 1 thousandth of a millimeter.' },
      { question: 'What is the average size of human cells?', answer: 'Most human cells range from 10 to 100 micrometers (µm) in size, though red blood cells are smaller, averaging 7 to 8 µm.' }
    ],
    relatedSlugs: ['v15-growth-pct-calculator', 'v15-chem-unit-calculator'],
    calculate: (inputs) => {
      const img = Number(inputs.imageSizeMm || 1);
      const mag = Number(inputs.magnificationPower || 100);

      const realSizeMicrons = (img * 1000) / mag;

      return {
        results: [
          { label: 'Actual Micro-Cell Size', value: `${realSizeMicrons.toFixed(2)} µm (Microns)`, isPrimary: true },
          { label: 'Observed Image Size', value: `${img} mm` },
          { label: 'Cell Size in Millimeters', value: `${(realSizeMicrons / 1000).toFixed(5)} mm` }
        ],
        chartData: [
          { name: 'Image Size (mm)', value: img },
          { name: 'Real Size (µm)', value: Math.round(realSizeMicrons) }
        ]
      };
    }
  },
  {
    id: 'v15-growth-pct',
    name: 'Growth Percentage Calculator',
    slug: 'v15-growth-pct-calculator',
    category: 'science',
    description: 'Calculate growing cells or biological colony population expansion rate percentages.',
    seoTitle: 'Colony Population Growth Percentage Solver',
    seoDescription: 'Determine colony population growth rates. Track growing bacteria counts to map exponential expansion trends.',
    inputs: [
      { id: 'initialBacteria', label: 'Starting Population Count', type: 'number', defaultValue: 500 },
      { id: 'finalBacteria', label: 'Ending Population Count', type: 'number', defaultValue: 8000 }
    ],
    formula: 'Overall Population Increase (%) = ((Ending - Starting) / Starting) * 100',
    explanation: 'Tracking population expansion rates is the standard approach for measuring bacterial growth velocities and testing antibiotic effectiveness in biology labs.',
    example: 'Growing from a starting population of 500 to 8,000 bacteria represents an overall growth of exactly 1,500.00%.',
    faq: [
      { question: 'How is bacterial exponential growth defined?', answer: 'A growth pattern where populations double at standard intervals as long as nutrients remain abundant.' },
      { question: 'Why does biological growth eventually slow down?', answer: 'Colony growth slows as organisms deplete local nutrient supplies and metabolic waste products build up.' }
    ],
    relatedSlugs: ['v15-bio-measure-calculator', 'v15-chem-unit-calculator'],
    calculate: (inputs) => {
      const init = Number(inputs.initialBacteria || 100);
      const fin = Number(inputs.finalBacteria || 100);

      const shift = ((fin - init) / init) * 100;
      const doublingGens = Math.log2(fin / init);

      return {
        results: [
          { label: 'Population Growth Rate', value: `${shift.toFixed(2)}% Increase`, isPrimary: true },
          { label: 'Population Doublings Count', value: `${doublingGens.toFixed(2)} Generations` },
          { label: 'Bacterial Growth Shift count', value: (fin - init).toLocaleString() }
        ],
        chartData: [
          { name: 'Start', value: init },
          { name: 'Final', value: fin }
        ]
      };
    }
  },

  // DAILY LIFE
  {
    id: 'v15-monthly-cost',
    name: 'Monthly Cost Calculator',
    slug: 'v15-monthly-cost-calculator',
    category: 'daily-life',
    description: 'Track and consolidate your recurring expenses to find your true monthly household overhead.',
    seoTitle: 'Integrated Monthly Cost Tracker & Budget Solver',
    seoDescription: 'Consolidate monthly household expenses. Group rents, utilities, and daily costs into a single budget overview.',
    inputs: [
      { id: 'rentHousing', label: 'Monthly Rent or Mortgage ($)', type: 'number', defaultValue: 1800 },
      { id: 'monthlyGroceries', label: 'Average Weekly Groceries ($)', type: 'number', defaultValue: 150 },
      { id: 'utilityBills', label: 'Monthly Utilities ($)', type: 'number', defaultValue: 250, helpText: 'Power, water, high-speed fiber internet' },
      { id: 'leisureSpend', label: 'Discretionary / Leisure Spend ($/mo)', type: 'number', defaultValue: 500 }
    ],
    formula: 'Monthly Total = Housing + (Groceries * 4.33) + Utilities + Leisure Spend',
    explanation: 'Converting weekly expenses like groceries to their monthly equivalent is essential for accurate budgeting and household cost planning.',
    example: 'Consolidating an $1,800 mortgage, $150 weekly groceries ($649.50 monthly), $250 utilities, and $500 leisure spend totals exactly $3,199.50 monthly.',
    faq: [
      { question: 'How is a weekly cost converted to monthly?', answer: 'Multiply your average weekly expense by 4.33 (the average weeks in a month) to find the true monthly equivalent.' },
      { question: 'What is discretionary spend?', answer: 'Non-essential spending on lifestyle choices, like dining out, shopping, hobbies, and weekend travel.' }
    ],
    relatedSlugs: ['v15-family-expense-calculator', 'v15-subscription-tracker-calculator'],
    calculate: (inputs) => {
      const hsg = Number(inputs.rentHousing || 0);
      const groc = Number(inputs.monthlyGroceries || 0) * 4.33; // average weeks per month
      const util = Number(inputs.utilityBills || 0);
      const leis = Number(inputs.leisureSpend || 0);

      const total = hsg + groc + util + leis;

      return {
        results: [
          { label: 'Consolidated Monthly Cost', value: `$${total.toFixed(2)}`, isPrimary: true },
          { label: 'Weekly Grocery Subtotal', value: `$${(groc / 4.33).toFixed(2)}` },
          { label: 'Annual Household Outflow', value: `$${(total * 12).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Shelter Rent', value: hsg },
          { name: 'Weekly Groceries', value: Math.round(groc) },
          { name: 'Internet Utilities', value: util },
          { name: 'Leisures', value: leis }
        ]
      };
    }
  },
  {
    id: 'v15-family-expense',
    name: 'Family Expense Calculator',
    slug: 'v15-family-expense-calculator',
    category: 'daily-life',
    description: 'Calculate average monthly living expenses for families factoring in childcare and insurance costs.',
    seoTitle: 'Family Living Expense & Budget Estimator',
    seoDescription: 'Estimate your family living expenses. Calculate costs for childcare, groceries, and insurance to plan ahead.',
    inputs: [
      { id: 'familyMembers', label: 'Number of Household Dependents', type: 'number', defaultValue: 3 },
      { id: 'monthlyBaseHousing', label: 'Base Housing & Maintenance ($)', type: 'number', defaultValue: 2000 },
      { id: 'childcareCost', label: 'Monthly Childcare / Schooling ($)', type: 'number', defaultValue: 800 },
      { id: 'memberHealthcare', label: 'Monthly Family Healthcare & Insurance ($)', type: 'number', defaultValue: 600 }
    ],
    formula: 'Total Family Cost = Housing + Childcare + Healthcare + (Dependents * $250 base grocery buffer)',
    explanation: 'Raising a family introduces dynamic costs from schooling, childcare, and insurance, requiring careful budget planning to protect cash reserves.',
    example: 'For a family of 3 with $2,000 housing, $800 childcare, and $600 healthcare, budgeting a $250 grocery buffer per dependent totals exactly $4,150 monthly.',
    faq: [
      { question: 'How is the family grocery buffer calculated?', answer: 'The USDA recommends budgeting a baseline of $220 to $300 monthly per child to cover nutritious groceries.' },
      { question: 'Why plan a separate family emergency fund?', answer: 'Family households face higher unexpected costs (medical, dental, car repairs), requiring a larger emergency buffer.' }
    ],
    relatedSlugs: ['v15-monthly-cost-calculator', 'v15-budget-split-calculator'],
    calculate: (inputs) => {
      const size = Number(inputs.familyMembers || 2);
      const hsg = Number(inputs.monthlyBaseHousing || 1000);
      const kids = Number(inputs.childcareCost || 0);
      const health = Number(inputs.memberHealthcare || 0);

      const foodBuffer = size * 250;
      const total = hsg + kids + health + foodBuffer;

      return {
        results: [
          { label: 'Target Monthly Family Outflow', value: `$${total.toLocaleString()}`, isPrimary: true },
          { label: 'Grocery food support subtotal', value: `$${foodBuffer.toLocaleString()}` },
          { label: 'Fixed Housing & Health', value: `$${(hsg + health).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Shelter', value: hsg },
          { name: 'School Care', value: kids },
          { name: 'Health Insurance', value: health },
          { name: 'Food Buffer Stack', value: foodBuffer }
        ]
      };
    }
  },
  {
    id: 'v15-subscription-tracker',
    name: 'Subscription Tracker Calculator',
    slug: 'v15-subscription-tracker-calculator',
    category: 'daily-life',
    description: 'Track and sum your recurring subscriptions (streaming, gym, software) to audit your monthly and annual recurring costs.',
    seoTitle: 'Recurring Subscription Tracker & Audit Solver',
    seoDescription: 'Audit your recurring subscription costs. Factor in gym memberships, streaming services, and utility bills to see annual totals.',
    inputs: [
      { id: 'videoStreaming', label: 'Monthly Entertainment & Video ($)', type: 'number', defaultValue: 45 },
      { id: 'gymMemberships', label: 'Monthly Gym & Fitness ($)', type: 'number', defaultValue: 60 },
      { id: 'softwareSas', label: 'Monthly Software / Cloud Storage ($)', type: 'number', defaultValue: 25 },
      { id: 'otherRecurring', label: 'Other Monthly Subscriptions ($)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Monthly Totals = Sum of all subscription inputs\nAnnual Total = Monthly Totals * 12',
    explanation: 'Small monthly subscriptions can quietly leak resources, forming a significant annual expense that could otherwise be saved.',
    example: 'A family paying $45 for video streaming, $60 for the gym, $25 for software, and $15 for other subscriptions spends $145 monthly, totaling $1,740 per year.',
    faq: [
      { question: 'What is subscription creep?', answer: 'The gradual accumulation of small, recurring digital bills that you may forget to cancel, leading to unnecessary spending.' },
      { question: 'How can I lower my subscription expenses?', answer: 'Audit your active memberships quarterly, cancel unused services, and look for family or bundle discounts.' }
    ],
    relatedSlugs: ['v15-monthly-cost-calculator', 'v15-shopping-savings-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.videoStreaming || 0);
      const g = Number(inputs.gymMemberships || 0);
      const s = Number(inputs.softwareSas || 0);
      const o = Number(inputs.otherRecurring || 0);

      const monthlySum = v + g + s + o;
      const annualSum = monthlySum * 12;

      return {
        results: [
          { label: 'Total Monthly Subscription cost', value: `$${monthlySum.toFixed(2)}`, isPrimary: true },
          { label: 'Ad-Free Annual Cost equivalent', value: `$${annualSum.toFixed(2)}` },
          { label: 'Weekly Subscription Outward', value: `$${(monthlySum / 4.33).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Video Streaming', value: v },
          { name: 'Gym membership', value: g },
          { name: 'Software', value: s },
          { name: 'Other bills', value: o }
        ]
      };
    }
  },
  {
    id: 'v15-budget-split',
    name: 'Budget Split Calculator',
    slug: 'v15-budget-split-calculator',
    category: 'daily-life',
    description: 'Divide shared household bills and rents among roommates or partners based on individual income ratios.',
    seoTitle: 'Income-Weighted Rent & Bill Budget Splitter',
    seoDescription: 'Split household bills and rents fairly among roommates. Calculate income-weighted or flat-rate splits in real-time.',
    inputs: [
      { id: 'totalSharedBill', label: 'Rent or Shared Bill Amount ($)', type: 'number', defaultValue: 2400 },
      { id: 'incomeA', label: 'Monthly Income Person A ($)', type: 'number', defaultValue: 6000 },
      { id: 'incomeB', label: 'Monthly Income Person B ($)', type: 'number', defaultValue: 4000 },
      { id: 'splitMethod', label: 'Split Method', type: 'select', defaultValue: 'proportional', options: [
        { label: 'Proportional to Income (Weighted)', value: 'proportional' },
        { label: 'Equal Split (50 / 50)', value: 'equal' }
      ]}
    ],
    formula: 'Proportional Split: Share A = Bill * (Income A / Total Income)\nEqual Split: Share = Bill / 2',
    explanation: 'Splitting bills in proportion to individual income keeps shared costs fair and affordable for both roommates or partners.',
    example: 'Roommates with incomes of $6,000 and $4,000 splitting a $2,400 rent proportionally allocate $1,440 to Person A and $960 to Person B.',
    faq: [
      { question: 'Why use proportional bill splitting?', answer: 'Proportional splitting ensures that shared housing expenses remain affordable, fitting both roommates\' actual budgets.' },
      { question: 'Should utilities be split proportionally as well?', answer: 'Roommates often split fixed costs (like rent) proportionally, while splitting variable costs (like electricity) 50/50.' }
    ],
    relatedSlugs: ['v15-monthly-cost-calculator', 'v15-family-expense-calculator'],
    calculate: (inputs) => {
      const bill = Number(inputs.totalSharedBill || 1000);
      const incA = Number(inputs.incomeA || 1);
      const incB = Number(inputs.incomeB || 1);
      const method = String(inputs.splitMethod || 'proportional');

      let shareA = bill / 2;
      let shareB = bill / 2;

      if (method === 'proportional') {
        const totalInc = incA + incB;
        if (totalInc > 0) {
          shareA = bill * (incA / totalInc);
          shareB = bill * (incB / totalInc);
        }
      }

      return {
        results: [
          { label: 'Person A Share Contribution', value: `$${Math.round(shareA).toLocaleString()}`, isPrimary: true },
          { label: 'Person B Share Contribution', value: `$${Math.round(shareB).toLocaleString()}`, isPrimary: true },
          { label: 'Person A Share Proportion', value: `${((shareA / bill) * 100).toFixed(1)}%` },
          { label: 'Person B Share Proportion', value: `${((shareB / bill) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Person A', value: Math.round(shareA) },
          { name: 'Person B', value: Math.round(shareB) }
        ]
      };
    }
  },
  {
    id: 'v15-shopping-savings',
    name: 'Shopping Savings Calculator',
    slug: 'v15-shopping-savings-calculator',
    category: 'daily-life',
    description: 'Calculate discount savings, coupon values, and tax totals for your purchases.',
    seoTitle: 'Retail Shopping Coupon & Discount Savings Solver',
    seoDescription: 'Find shopping savings instantly. Input label prices, coupon percentage discounts, and local tax rates to see your final checkout price.',
    inputs: [
      { id: 'originalPrice', label: 'Item Label Price ($)', type: 'number', defaultValue: 120 },
      { id: 'discountPercent', label: 'Primary Discount / Coupon (%)', type: 'number', defaultValue: 25 },
      { id: 'salesTaxPercent', label: 'Local Store Sales Tax (%)', type: 'number', defaultValue: 8.5 }
    ],
    formula: 'Discount Amount = Original Price * (Discount / 100)\nFinal Checkout = (Original - Discount) * (1 + Sales Tax / 100)',
    explanation: 'Calculating your total discount savings, including local sales tax, helps you stay within your budget while shopping.',
    example: 'An item priced at $120 with a 25% discount coupon under an 8.5% sales tax regime costs exactly $97.65 at checkout, saving you $30.00.',
    faq: [
      { question: 'Is sales tax calculated before or after coupon discounts?', answer: 'In most states, sales tax is calculated on the discounted checkout price, rather than the original label price.' },
      { question: 'What is a double discount coupon?', answer: 'Using two coupons (such as a 10% member coupon on top of a 20% sale) is calculated sequentially rather than adding them to 30%.' }
    ],
    relatedSlugs: ['v15-subscription-tracker-calculator', 'v15-monthly-cost-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.originalPrice || 0);
      const disc = Number(inputs.discountPercent || 0) / 100;
      const tax = Number(inputs.salesTaxPercent || 0) / 100;

      const discountAmt = price * disc;
      const subtotal = price - discountAmt;
      const taxPaid = subtotal * tax;
      const finalCheckout = subtotal + taxPaid;

      return {
        results: [
          { label: 'Final Checkout Price', value: `$${finalCheckout.toFixed(2)}`, isPrimary: true },
          { label: 'Total Cash Saved', value: `$${discountAmt.toFixed(2)}` },
          { label: 'Sales Tax Paid portion', value: `$${taxPaid.toFixed(2)}` }
        ],
        chartData: [
          { name: 'You Paid', value: Math.round(finalCheckout) },
          { name: 'You Saved', value: Math.round(discountAmt) }
        ]
      };
    }
  }
];
