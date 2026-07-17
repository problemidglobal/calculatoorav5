import { Calculator } from '../types';

export const V16_ENGINEERING_CS_CALCULATORS: Calculator[] = [
  // ELECTRICAL (35-39)
  {
    id: 'voltage-drop',
    name: 'Voltage Drop Calculator',
    slug: 'voltage-drop',
    category: 'engineering',
    description: 'Calculate electrical voltage drop over a run of conductor copper or aluminum wire.',
    formula: 'Drop = (2 * K * I * L) / CircularMils',
    explanation: 'Combines direct current loads, standard gauge material resistivity coefficients, and path distances to ensure safety bounds.',
    example: 'A 20A circuit carrying 120V through 100 feet of #12 AWG copper wire features a calculated voltage drop of ~3.98V (3.3%).',
    inputs: [
      { id: 'voltage', label: 'Source Voltage', type: 'number', defaultValue: 120, min: 1, unit: 'Volts' },
      { id: 'current', label: 'Circuit Load Current', type: 'number', defaultValue: 20, min: 0.1, step: 0.5, unit: 'Amps' },
      { id: 'length', label: 'Conductor Path Length (One-Way)', type: 'number', defaultValue: 100, min: 1, unit: 'feet' },
      { id: 'gauge', label: 'Conductor Size (AWG)', type: 'select', defaultValue: '12', options: [
        { label: '#14 AWG (Copper)', value: '14' },
        { label: '#12 AWG (Copper)', value: '12' },
        { label: '#10 AWG (Copper)', value: '10' },
        { label: '#8 AWG (Copper)', value: '8' }
      ]}
    ],
    faq: [
      { question: 'What is the maximum recommended voltage drop?', answer: 'The National Electrical Code (NEC) recommends keeping the voltage drop below 3% for branch circuits and 5% overall for optimal efficiency.' }
    ],
    relatedSlugs: ['electrical-cost', 'circuit-load'],
    seoTitle: 'Electrical Conductor Voltage Drop Calculator',
    seoDescription: 'Obtain estimated voltage losses and percentage drops across copper wiring layouts dynamically.',
    calculate: (inputs) => {
      const vol = Number(inputs.voltage || 120);
      const cur = Number(inputs.current || 15);
      const len = Number(inputs.length || 50);
      const gauge = String(inputs.gauge || '12');
      
      // Resistance per 1000 feet for copper
      let ohmsPerK = 3.07; // #14
      if (gauge === '12') ohmsPerK = 1.93;
      else if (gauge === '10') ohmsPerK = 1.24;
      else if (gauge === '8') ohmsPerK = 0.779;
      
      const totalR = (ohmsPerK * (len * 2)) / 1000;
      const drop = cur * totalR;
      const pctValue = (drop / vol) * 100;
      
      return {
        results: [
          { label: 'Voltage Drop Amount', value: Number(drop.toFixed(2)), unit: 'Volt(s)', isPrimary: true },
          { label: 'Voltage Drop Percentage', value: Number(pctValue.toFixed(2)), unit: '%' },
          { label: 'Receiving End Voltage', value: Number((vol - drop).toFixed(1)), unit: 'Volts' }
        ]
      };
    }
  },
  {
    id: 'electrical-cost',
    name: 'Electrical Cost Calculator',
    slug: 'electrical-cost',
    category: 'engineering',
    description: 'Calculate daily, monthly, and annual operational costs of electrical equipment.',
    formula: 'Cost = (Power Watts * Hours * Utility Rate) / 1000',
    explanation: 'Multiplies continuous load power consumptions by standard provincial or corporate rate schemas.',
    example: 'A 1500W space heater running 8 hours daily at a $0.15/kWh rate costs approximately $1.80/day or $54/month.',
    inputs: [
      { id: 'watts', label: 'Equipment Power Draw', type: 'number', defaultValue: 1500, min: 1, unit: 'Watts' },
      { id: 'hours', label: 'Operational Duration', type: 'number', defaultValue: 8, min: 0.1, max: 24, step: 0.5, unit: 'hrs/day' },
      { id: 'rate', label: 'Power Utility Rate Cost', type: 'number', defaultValue: 0.15, min: 0.01, max: 1.50, step: 0.01, unit: '$/kWh' }
    ],
    faq: [
      { question: 'What is a kilowatt-hour (kWh)?', answer: 'A unit of energy equivalent to consuming exactly 1,000 watts of power continuously for one full hour.' }
    ],
    relatedSlugs: ['voltage-drop', 'circuit-load'],
    seoTitle: 'Household Appliances Electrical Cost Calculator',
    seoDescription: 'Forecast the daily, monthly, and yearly real-world costs of operating standard appliances.',
    calculate: (inputs) => {
      const w = Number(inputs.watts || 1000);
      const h = Number(inputs.hours || 12);
      const r = Number(inputs.rate || 0.12);
      
      const dailyKwh = (w * h) / 1000;
      const dailyCost = dailyKwh * r;
      const monthlyCost = dailyCost * 30;
      const annualCost = dailyCost * 365;
      
      return {
        results: [
          { label: 'Monthly Utility Overhead', value: Number(monthlyCost.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Daily Electricity Cost', value: Number(dailyCost.toFixed(2)), unit: '$' },
          { label: 'Annual Electricity Cost', value: Number(annualCost.toFixed(2)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'circuit-load',
    name: 'Circuit Load Calculator',
    slug: 'circuit-load',
    category: 'engineering',
    description: 'Assess electrical breaker capacity limits and active load thresholds safely.',
    formula: 'Safe Continuous Capacity = Circuit Rating Amps * Volts * 0.80',
    explanation: 'Applies standard continuous-load safety factor corrections (80% rule) to prevent safety switches from tripping.',
    example: 'A standard 15-amp, 120V room circuit features a continuous safe threshold cap of 1,440 Watts.',
    inputs: [
      { id: 'ampsRating', label: 'Breaker Rating Cap', type: 'number', defaultValue: 15, min: 10, max: 200, unit: 'Amps' },
      { id: 'voltsLine', label: 'Line Voltage', type: 'number', defaultValue: 120, min: 100, max: 480, unit: 'Volts' },
      { id: 'loadWatts', label: 'Connected Total Applied Loads', type: 'number', defaultValue: 1200, min: 0, unit: 'Watts' }
    ],
    faq: [
      { question: 'What is the National Electrical Code 80% rule?', answer: 'It mandates that a branch breaker should not carry a continuous load (running for 3 hours or longer) exceeding 80% of its rated capacity.' }
    ],
    relatedSlugs: ['voltage-drop', 'electrical-cost'],
    seoTitle: 'Circuit Breaker Capacity Load Calculator',
    seoDescription: 'Safely evaluate circuit loads and determine standard load safety triggers online.',
    calculate: (inputs) => {
      const rAmps = Number(inputs.ampsRating || 15);
      const volts = Number(inputs.voltsLine || 120);
      const watts = Number(inputs.loadWatts || 0);
      
      const maxWatts = rAmps * volts;
      const safeWatts = maxWatts * 0.8;
      const loadPct = (watts / maxWatts) * 100;
      
      return {
        results: [
          { label: 'Breaker Max Capacity', value: maxWatts, unit: 'Watts', isPrimary: true },
          { label: 'Safe Continuous Load Limit', value: safeWatts, unit: 'Watts' },
          { label: 'Current Load Capacity Used', value: Number(loadPct.toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'battery-energy',
    name: 'Battery Energy Calculator',
    slug: 'battery-energy',
    category: 'engineering',
    description: 'Calculate battery capacity parameters, discharge rates, and total energy reserves.',
    formula: 'Energy Wh = Capacity Ah * Voltage V',
    explanation: 'Converts chemical amp-hour ratings into raw mechanical watt-hour metrics to establish backup limits.',
    example: 'A 12V marine deep-cycle battery certified at 100 Ah stores exactly 1,200 Watt-hours of total raw energy.',
    inputs: [
      { id: 'ah', label: 'Battery Rated Capacity', type: 'number', defaultValue: 100, min: 1, unit: 'Ah' },
      { id: 'v', label: 'Battery Nominal Voltage', type: 'number', defaultValue: 12, min: 1, unit: 'Volts' },
      { id: 'discharge', label: 'Planned Target Load Draw', type: 'number', defaultValue: 120, min: 0.1, unit: 'Watts' }
    ],
    faq: [
      { question: 'What is deep discharge limits?', answer: 'Lead-acid batteries should only be drained to 50% capacity to preserve cells, while lithium storage units easily support 80% to 90% depths.' }
    ],
    relatedSlugs: ['solar-energy', 'electrical-cost'],
    seoTitle: 'Battery Capacity watt-Hour & Run Time Calculator',
    seoDescription: 'Establish battery backup run times under specific load draws using custom capacity specifications.',
    calculate: (inputs) => {
      const ah = Number(inputs.ah || 100);
      const v = Number(inputs.v || 12);
      const draw = Number(inputs.discharge || 50);
      
      const wh = ah * v;
      // Backup time assuming 85% real inverter conversion efficiency
      const runtimeHrs = draw > 0 ? (wh * 0.85) / draw : 0;
      
      return {
        results: [
          { label: 'Storage Energy Reserves', value: wh, unit: 'Watt-hours', isPrimary: true },
          { label: 'Run Time under Applied draw', value: Number(runtimeHrs.toFixed(1)), unit: 'hours' },
          { label: 'Safe Useful Capacity (80% Lith)', value: Math.round(wh * 0.8), unit: 'Wh' }
        ]
      };
    }
  },
  {
    id: 'solar-energy',
    name: 'Solar Energy Calculator',
    slug: 'solar-energy',
    category: 'engineering',
    description: 'Estimate daily solar photovoltaic panel array energy production based on peak solar hours.',
    formula: 'Daily Output = Array Size Watts * Peak Hours * Derating Factor',
    explanation: 'Accounts for thermal heat losses and conversion losses to predict actual grid-tie power outputs.',
    example: 'A 4kW (4,000 W) solar array running under 5 peak sunshine hours producing at 78% efficiency yields 15.6 kWh of daily electricity.',
    inputs: [
      { id: 'arraySize', label: 'Total Solar Array Size', type: 'number', defaultValue: 4000, min: 100, step: 100, unit: 'Watts' },
      { id: 'peakHours', label: 'Local Daily Sun Hours', type: 'number', defaultValue: 4.8, min: 1, max: 10, step: 0.1, unit: 'hrs/day' },
      { id: 'derate', label: 'Equipment Loss Derating Factor', type: 'number', defaultValue: 80, min: 50, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What is peak sun hours?', answer: 'The length of time during which solar radiation averages 1,000 watts per square meter, occurring primarily in the middle of the day.' }
    ],
    relatedSlugs: ['battery-energy', 'electrical-cost'],
    seoTitle: 'Solar Panel Array Daily kWh Yield Calculator',
    seoDescription: 'Estimate daily and seasonal clean energy production from local photovoltaic setups.',
    calculate: (inputs) => {
      const watts = Number(inputs.arraySize || 3000);
      const hrs = Number(inputs.peakHours || 4.5);
      const factor = (Number(inputs.derate || 80)) / 100;
      
      const dailyKwh = (watts * hrs * factor) / 1000;
      const annualKwh = dailyKwh * 365;
      
      return {
        results: [
          { label: 'Daily Energy Production', value: Number(dailyKwh.toFixed(1)), unit: 'kWh/day', isPrimary: true },
          { label: 'Estimated Annual Yield', value: Math.round(annualKwh), unit: 'kWh' },
          { label: 'Annual Utility Value ($0.15/kWh)', value: Math.round(annualKwh * 0.15), unit: '$' }
        ]
      };
    }
  },

  // MECHANICAL (40-44)
  {
    id: 'mechanical-efficiency',
    name: 'Mechanical Efficiency Calculator',
    slug: 'mechanical-efficiency',
    category: 'engineering',
    description: 'Calculate the mechanical energy conversion efficiency of physical gearboxes, internal engines, or electric motors.',
    formula: 'Efficiency% = (Useful Work Output / Total Energy Input) * 100',
    explanation: 'Compares real output power metrics with supplied kinetic currents to analyze heat and friction losses.',
    example: 'A diesel engine requiring 100 kW of fuel heat energy that outputs 42 kW of kinetic torque operates at 42% thermal mechanical efficiency.',
    inputs: [
      { id: 'inputEnergy', label: 'Supplied Input Power/Work', type: 'number', defaultValue: 100, min: 1, unit: 'kW / J' },
      { id: 'outputEnergy', label: 'Measured Output Work/Power', type: 'number', defaultValue: 42, min: 0.1, unit: 'kW / J' }
    ],
    faq: [
      { question: 'Where does the energy loss occur in mechanical gears?', answer: 'Frictional resistances across gear tooth meshes, mechanical oil viscosity, and structural heat dissipation represent key losses.' }
    ],
    relatedSlugs: ['machine-power', 'rotation-speed'],
    seoTitle: 'Kinetic Conversion Mechanical Efficiency Calculator',
    seoDescription: 'Quickly find kinetic efficiency percentages and relative thermal loss levels for gearboxes.',
    calculate: (inputs) => {
      const inp = Number(inputs.inputEnergy || 1);
      const out = Number(inputs.outputEnergy || 1);
      
      const eff = (out / inp) * 100;
      const loss = Math.max(0, inp - out);
      
      return {
        results: [
          { label: 'Gearing Efficiency Rating', value: Number(eff.toFixed(2)), unit: '%', isPrimary: true },
          { label: 'dissipated Friction Loss', value: Number(loss.toFixed(1)), unit: 'kW/J' }
        ]
      };
    }
  },
  {
    id: 'machine-power',
    name: 'Machine Power Calculator',
    slug: 'machine-power',
    category: 'engineering',
    description: 'Evaluate physical shaft torque, rotation speed, and resulting mechanical power metrics.',
    formula: 'Power kW = (Torque Nm * RPM * 2 * PI) / 60000',
    explanation: 'Correlates force leverage parameters with shaft revolutions to calculate horsepowers and kilowatt totals.',
    example: 'A drive motor delivering 150 Nm of torque spinning at 3,000 RPM produces exactly 47.1 kW (63.2 Horsepower).',
    inputs: [
      { id: 'torque', label: 'Rotational Shaft Torque', type: 'number', defaultValue: 150, min: 0, unit: 'N·m' },
      { id: 'rpm', label: 'Revolution Speed (RPM)', type: 'number', defaultValue: 3000, min: 1, unit: 'RPM' }
    ],
    faq: [
      { question: 'What is the relationship between torque and horsepower?', answer: 'Horsepower is work done over time. Torque represents absolute physical twisting force: Hp = (Torque in lb-ft * RPM) / 5252.' }
    ],
    relatedSlugs: ['mechanical-efficiency', 'rotation-speed'],
    seoTitle: 'Rotational Torque and Horsepower Kinetic Power Calculator',
    seoDescription: 'Convert torque and rotational speeds (RPM) into machine horsepowers and physical kW ratings.',
    calculate: (inputs) => {
      const torque = Number(inputs.torque || 100);
      const rpm = Number(inputs.rpm || 1000);
      
      const powerKw = (torque * rpm * (2 * Math.PI)) / 60000;
      const hp = powerKw * 1.34102;
      
      return {
        results: [
          { label: 'Mechanical Power Out', value: Number(powerKw.toFixed(1)), unit: 'kW', isPrimary: true },
          { label: 'Rotational Horsepower', value: Number(hp.toFixed(1)), unit: 'HP' }
        ]
      };
    }
  },
  {
    id: 'rotation-speed',
    name: 'Rotation Speed & Gearing Ratio Calculator',
    slug: 'rotation-speed',
    category: 'engineering',
    description: 'Calculate gear and belt pulley speeds and diameters across multi-stage ratios.',
    formula: 'Drivers RPM * Drivers Teeth = Driven RPM * Driven Teeth',
    explanation: 'Uses teeth counts or diameter sizes to calculate revolution speeds (RPM) across drive configurations.',
    example: 'A motor shaft turning at 1,800 RPM carrying a 12-tooth driver gear spins a 36-tooth driven gear at 600 RPM.',
    inputs: [
      { id: 'driverRpm', label: 'Driver Shaft Speed', type: 'number', defaultValue: 1800, min: 1, unit: 'RPM' },
      { id: 'driverTeeth', label: 'Driver Gear Teeth (or Diameter)', type: 'number', defaultValue: 12, min: 1, unit: 'Teeth' },
      { id: 'drivenTeeth', label: 'Driven Gear Teeth (or Diameter)', type: 'number', defaultValue: 36, min: 1, unit: 'Teeth' }
    ],
    faq: [
      { question: 'Does a higher gearing ratio increase speed?', answer: 'No. Higher mechanical reduction gear ratios multiply output torque while proportionally lowering output RPM.' }
    ],
    relatedSlugs: ['machine-power', 'mechanical-efficiency'],
    seoTitle: 'Gear RPM Reduction and Gearing Ratio Calculator',
    seoDescription: 'Obtain precise driven gear rotational speed and gearing step-down ratios.',
    calculate: (inputs) => {
      const dRpm = Number(inputs.driverRpm || 1000);
      const dTeeth = Number(inputs.driverTeeth || 10);
      const drTeeth = Number(inputs.drivenTeeth || 20);
      
      const ratio = drTeeth / dTeeth;
      const drivenRpm = dRpm / ratio;
      
      return {
        results: [
          { label: 'Driven Shaft Speed', value: Math.round(drivenRpm), unit: 'RPM', isPrimary: true },
          { label: 'Mechanical Gear Ratio', value: Number(ratio.toFixed(2)), unit: ':1' }
        ]
      };
    }
  },
  {
    id: 'force-balance',
    name: 'Force Balance Calculator',
    slug: 'force-balance',
    category: 'engineering',
    description: 'Calculate structural lever equilibriums, balances, and mechanical advantages.',
    formula: 'F1 * D1 = F2 * D2 (Moment Equilibrium)',
    explanation: 'Solves pivot balancing formulas to reveal load capacities and mechanical lifting advantages.',
    example: 'A fulcrum leveraging a 50 lb load 4 feet away balanced by an effort arm 10 feet away requires a 20 lb force.',
    inputs: [
      { id: 'loadForce', label: 'Applied Load Weight', type: 'number', defaultValue: 50, min: 1, unit: 'lbs/kg' },
      { id: 'loadDistance', label: 'Load Pivot Arm Distance', type: 'number', defaultValue: 4, min: 0.1, step: 0.1, unit: 'feet/m' },
      { id: 'effortDistance', label: 'Effort Pivot Arm Distance', type: 'number', defaultValue: 10, min: 0.1, step: 0.1, unit: 'feet/m' }
    ],
    faq: [
      { question: 'What is Mechanical Advantage (MA)?', answer: 'The amplification of force achieved by using a specialized mechanical tool or lever: MA = Effort Distance / Load Distance.' }
    ],
    relatedSlugs: ['material-strength', 'machine-power'],
    seoTitle: 'Mechanical Advantage Lever Force Balance Calculator',
    seoDescription: 'Evaluate balancing loads and mechanical leverage multipliers across lever configurations.',
    calculate: (inputs) => {
      const lf = Number(inputs.loadForce || 100);
      const ld = Number(inputs.loadDistance || 2);
      const ed = Number(inputs.effortDistance || 5);
      
      const neededForce = (lf * ld) / ed;
      const ma = ed / ld;
      
      return {
        results: [
          { label: 'Required Effort Force', value: Number(neededForce.toFixed(2)), unit: 'lbs / kg', isPrimary: true },
          { label: 'Calculated Mechanical Advantage', value: Number(ma.toFixed(2)), unit: 'x' }
        ]
      };
    }
  },
  {
    id: 'material-strength',
    name: 'Material Strength & Stress Calculator',
    slug: 'material-strength',
    category: 'engineering',
    description: 'Estimate engineering stress, strain levels, and structural safety margins of columns.',
    formula: 'Stress = Force / Cross-Sectional Area; Margin = Yield Strength / Stress',
    explanation: 'Cross-sections tensional force inputs against structural yield limits of metals/polymers to protect builders.',
    example: 'Applying 12,000 lbs of load on a 2" round structural steel rod (3.14 sq in Area) creates 3,821 PSI of tensile stress.',
    inputs: [
      { id: 'axialForce', label: 'Applied Structural Tensile Load', type: 'number', defaultValue: 12000, min: 1, unit: 'lbs' },
      { id: 'rodDiameter', label: 'Round Bar Diameter sizing', type: 'number', defaultValue: 2.0, min: 0.1, step: 0.1, unit: 'inches' },
      { id: 'yieldStrength', label: 'Material Yield Strength limit', type: 'number', defaultValue: 36000, min: 100, unit: 'PSI (e.g. A36 Steel)' }
    ],
    faq: [
      { question: 'What is a safety factor ratio?', answer: 'The ratio of material ultimate capacity strength to actual structural load stress. Solid standards target indices between 1.5 and 3.0.' }
    ],
    relatedSlugs: ['force-balance', 'concrete-volume'],
    seoTitle: 'Mechanical Column Tension Elastic Stress Calculator',
    seoDescription: 'Check raw structural column stresses and calculate load safety factors under static forces.',
    calculate: (inputs) => {
      const force = Number(inputs.axialForce || 5000);
      const dia = Number(inputs.rodDiameter || 1);
      const yieldS = Number(inputs.yieldStrength || 36000);
      
      const area = Math.PI * Math.pow(dia / 2, 2);
      const stress = force / area;
      const safetyFactor = yieldS / stress;
      
      return {
        results: [
          { label: 'Calculated Mechanical Stress', value: Math.round(stress), unit: 'PSI', isPrimary: true },
          { label: 'Factor of Safety (FoS) ratio', value: Number(safetyFactor.toFixed(2)), unit: 'x' },
          { label: 'Conductor cross Area', value: Number(area.toFixed(3)), unit: 'sq in' }
        ]
      };
    }
  },

  // CIVIL (45-48)
  {
    id: 'concrete-volume-v16',
    name: 'Concrete Volume Calculator',
    slug: 'concrete-volume-v16',
    category: 'engineering',
    description: 'Calculate wet concrete volumes needed for slabs, columns, or footers alongside raw sack counts.',
    formula: 'Volume (Yards) = Length (ft) * Width (ft) * Depth (in/12) / 27',
    explanation: 'Takes basic dimensions, yields volumetric outputs in Yards or Meters, and returns correct counts of pre-mixed bag blends.',
    example: 'A 24\' x 24\' building slab cast at a depth of 4" requires exactly 7.1 cubic yards of concrete.',
    inputs: [
      { id: 'length', label: 'Slab Length', type: 'number', defaultValue: 24, min: 0.1, unit: 'feet' },
      { id: 'width', label: 'Slab Width', type: 'number', defaultValue: 24, min: 0.1, unit: 'feet' },
      { id: 'depth', label: 'Slab Depth (Thickness)', type: 'number', defaultValue: 4, min: 1, max: 24, unit: 'inches' }
    ],
    faq: [
      { question: 'What safety margin is recommended for concrete?', answer: 'Standard practice is to order 5% to 10% extra material to account for grade variations, form deflection, and minor spillage.' }
    ],
    relatedSlugs: ['structural-load', 'foundation-calc'],
    seoTitle: 'Civil Construction Concrete Yardage & Bag count Calculator',
    seoDescription: 'Determine volumetric concrete requirements in yards or cubic meters, and calculate 80lb/60lb sack allocations.',
    calculate: (inputs) => {
      const len = Number(inputs.length || 10);
      const wid = Number(inputs.width || 10);
      const dep = Number(inputs.depth || 4) / 12;
      
      const cubicFeet = len * wid * dep;
      const cubicYards = cubicFeet / 27;
      const cubicMeters = cubicFeet * 0.0283168;
      
      // 80lb premix bags yield ~0.6 cubic feet each
      const bags80 = Math.ceil(cubicFeet / 0.6);
      
      return {
        results: [
          { label: 'Required Volume', value: Number(cubicYards.toFixed(2)), unit: 'Cubic Yards', isPrimary: true },
          { label: 'Metric Volume Equivalent', value: Number(cubicMeters.toFixed(2)), unit: 'm³' },
          { label: 'Required 80-lb Ready Mix Bags', value: bags80, unit: 'bags' }
        ]
      };
    }
  },
  {
    id: 'structural-load',
    name: 'Structural Load Calculator',
    slug: 'structural-load',
    category: 'engineering',
    description: 'Sum architectural Dead Loads and residential Live Loads to scale load-bearing spans.',
    formula: 'Total Load = Dead Load (Materials) + Live Load (Occupants)',
    explanation: 'Models building materials weights alongside safety live loads to check overall area metrics.',
    example: 'A residential room floor balancing 15 PSF of subfloor structures + 40 PSF active safety margins totals 55 PSF load.',
    inputs: [
      { id: 'area', label: 'Tributary Span Area', type: 'number', defaultValue: 200, min: 1, unit: 'sq ft' },
      { id: 'deadLoad', label: 'Dead Load (Material weights)', type: 'number', defaultValue: 15, min: 0, unit: 'PSF (lbs/sq ft)' },
      { id: 'liveLoad', label: 'Live Load (Design safety code)', type: 'number', defaultValue: 40, min: 10, unit: 'PSF (lbs/sq ft)' }
    ],
    faq: [
      { question: 'What represents dead load?', answer: 'The permanent, static weight of building structures, sheetrock panels, joists, tile underlayment, and utility copper pipe runs.' }
    ],
    relatedSlugs: ['concrete-volume-v16', 'foundation-calc'],
    seoTitle: 'Civil structural Column Span Load Calculator',
    seoDescription: 'Compile architectural roof and floor dead loads with standard occupant live loads easily.',
    calculate: (inputs) => {
      const area = Number(inputs.area || 100);
      const dl = Number(inputs.deadLoad || 10);
      const ll = Number(inputs.liveLoad || 40);
      
      const psf = dl + ll;
      const total = psf * area;
      
      return {
        results: [
          { label: 'Total Load Bearing Support', value: total, unit: 'lbs', isPrimary: true },
          { label: 'Combined Pressure PSF', value: psf, unit: 'lbs/sq ft' }
        ]
      };
    }
  },
  {
    id: 'foundation-calc',
    name: 'Foundation Sizing Calculator',
    slug: 'foundation-calc',
    category: 'engineering',
    description: 'Calculate concrete spread footing area dimensions based on soil bearing capacities.',
    formula: 'Footing Area (sq ft) = Column Load (lbs) / Soil Bearing Capacity (PSF)',
    explanation: 'Drains heavy architectural column weights, validating they spread safely across structural clays or sand boundaries.',
    example: 'A column delivering 20,000 lbs of load on clay soil carrying 2,000 PSF capacity requires a 10 sq ft spread footing (3.2\' x 3.2\').',
    inputs: [
      { id: 'load', label: 'Column Load Force', type: 'number', defaultValue: 20000, min: 1, unit: 'lbs' },
      { id: 'soilCapacity', label: 'Soil Bearing Capacity', type: 'select', defaultValue: '2000', options: [
        { label: 'Soft Clay / Sand (1,500 PSF)', value: '1500' },
        { label: 'Firm Clay/Medium Sand (2,000 PSF)', value: '2000' },
        { label: 'Compacted gravel mixes (3,000 PSF)', value: '3000' }
      ]}
    ],
    faq: [
      { question: 'What is Soil Bearing Capacity?', answer: 'The absolute maximum pressure that a unit area of soil can withstand without experiencing settlement or structural shear failures.' }
    ],
    relatedSlugs: ['concrete-volume-v16', 'structural-load'],
    seoTitle: 'Civil foundation Concrete Footer Sizing Calculator',
    seoDescription: 'Establishes mechanical footing metrics for columns of diverse dimensions to match soil parameters.',
    calculate: (inputs) => {
      const load = Number(inputs.load || 10000);
      const capacity = Number(inputs.soilCapacity || 2000);
      
      const minArea = load / capacity;
      const footDimension = Math.sqrt(minArea);
      
      return {
        results: [
          { label: 'Required Footer Area', value: Number(minArea.toFixed(2)), unit: 'sq ft', isPrimary: true },
          { label: 'Minimum Footer Dimensions', value: `${footDimension.toFixed(1)}' x ${footDimension.toFixed(1)}'`, unit: 'ft' }
        ]
      };
    }
  },
  {
    id: 'building-material',
    name: 'Building Material Calculator',
    slug: 'building-material',
    category: 'engineering',
    description: 'Calculate framing wood studs, drywall panels, and safety wall elements for partition walls.',
    formula: 'Studs = (Length / Spacing) + Corner Extras',
    explanation: 'Models building framing details (stud spacing, top/bottom plates, corner sheets) to streamline material purchase logs.',
    example: 'Framing a 40-foot divider partition with standard 16-inch centers requires exactly 33 wood studs plus double top plates.',
    inputs: [
      { id: 'length', label: 'Total Wall Length', type: 'number', defaultValue: 40, min: 1, unit: 'feet' },
      { id: 'spacing', label: 'Stud Spacing (Centers)', type: 'select', defaultValue: '16', options: [
        { label: '16-inch center spacing', value: '16' },
        { label: '24-inch center spacing', value: '24' }
      ]},
      { id: 'height', label: 'Finished Wall Height', type: 'number', defaultValue: 8, min: 4, max: 14, unit: 'feet' }
    ],
    faq: [
      { question: 'What are framing plates?', answer: 'The horizontal lumber running along the ceiling (double top plate) and the floor (single bottom sill plate) that secure vertical studs.' }
    ],
    relatedSlugs: ['concrete-volume-v16', 'material-strength'],
    seoTitle: 'Wall Stud Framing and Drywall Sheet Calculator',
    seoDescription: 'Obtain precise counts of timber studs, framing plates, and standard 4x8 drywall sheets for room partitions.',
    calculate: (inputs) => {
      const len = Number(inputs.length || 10);
      const spacingIn = Number(inputs.spacing || 16);
      const h = Number(inputs.height || 8);
      
      // Calculate framing studs
      // Standard formula: length / (spacing/12) + 1, plus 2 studs for corners/safety additions
      const spacingFt = spacingIn / 12;
      const studs = Math.ceil(len / spacingFt) + 1 + 2;
      
      // Drywall sheets: Area of wall / area of standard 4x8 sheet (32 sq ft) multiplied by 2 faces
      const wallArea = len * h;
      const sheets = Math.ceil((wallArea * 2) / 32);
      
      return {
        results: [
          { label: 'Framing Wood Studs needed', value: studs, unit: 'studs', isPrimary: true },
          { label: 'Required 4x8 Drywall Sheets', value: sheets, unit: 'sheets' },
          { label: 'Timber Plates (Linear Footage)', value: Math.ceil(len * 3), unit: 'ft' }
        ]
      };
    }
  },

  // COMPUTER SCIENCE ADVANCED (49-55)
  {
    id: 'algorithm-runtime',
    name: 'Algorithm Runtime Calculator',
    slug: 'algorithm-runtime',
    category: 'programming',
    description: 'Check theoretical instruction operations count and wall-clock execution times across Big-O complexities.',
    formula: 'Operations = f(N) depending on Big-O profile',
    explanation: 'Models O(1), O(N), O(N log N), and O(N²) worst-case runtime scalings for software performance analysis.',
    example: 'An O(N²) quadratic sorting routine processing 100,000 arrays triggers 10 billion operations, running in ~10 seconds.',
    inputs: [
      { id: 'n', label: 'Input Size (Elements N)', type: 'number', defaultValue: 100000, min: 1, step: 1000, unit: 'N' },
      { id: 'complexity', label: 'Big-O Complexity Class', type: 'select', defaultValue: 'nlogn', options: [
        { label: 'O(N) - Linear progression', value: 'n' },
        { label: 'O(N log N) - Efficient sort', value: 'nlogn' },
        { label: 'O(N²) - Quadratic/Bubble Sort', value: 'nSquared' }
      ]},
      { id: 'clockSpeed', label: 'CPU Operations Processing frequency', type: 'number', defaultValue: 1, min: 0.1, max: 10, step: 0.1, unit: 'GHz' }
    ],
    faq: [
      { question: 'What is Big O notation?', answer: 'A mathematical notation used in computer science to describe the theoretical limiting behavior of an algorithm as data size scales.' }
    ],
    relatedSlugs: ['database-cost', 'code-complexity'],
    seoTitle: 'Big-O Algorithm Complexity Runtime Estimator',
    seoDescription: 'Calculate instruction scaling parameters and execution durations across diverse operational thresholds.',
    calculate: (inputs) => {
      const n = Number(inputs.n || 1000);
      const comp = String(inputs.complexity || 'n');
      const ghz = Number(inputs.clockSpeed || 2) * 1e9; // 1 GHz = 1,000,000,000 operations/sec
      
      let ops = 0;
      if (comp === 'n') {
        ops = n;
      } else if (comp === 'nlogn') {
        ops = n * Math.log2(n || 1);
      } else if (comp === 'nSquared') {
        ops = Math.pow(n, 2);
      }
      
      const seconds = ops / ghz;
      
      return {
        results: [
          { label: 'Theoretical Operations Count', value: Math.round(ops).toLocaleString(), unit: 'ops', isPrimary: true },
          { label: 'Estimated CPU Time', value: seconds < 0.001 ? '< 1 ms' : `${seconds.toFixed(4)} s`, unit: '' }
        ]
      };
    }
  },
  {
    id: 'big-data-storage',
    name: 'Big Data Storage Calculator',
    slug: 'big-data-storage',
    category: 'programming',
    description: 'Calculate text raw sizing data bounds, compressed storage footprint sizes, and daily index bloats.',
    formula: 'Raw Size = Records Count * Average Row Bytes; Compressed Size = Raw Size / Comp Ratio',
    explanation: 'Models huge table record logs, applying standard compression factors alongside database indexing margins.',
    example: 'Storing 1 billion user log lines averaging 250 bytes results in 250 GB of raw storage, which compresses to 75 GB.',
    inputs: [
      { id: 'records', label: 'Estimated Total Record Rows', type: 'number', defaultValue: 1000000000, min: 10000, step: 100000, unit: 'rows' },
      { id: 'rowBytes', label: 'Average Bytes size per Row', type: 'number', defaultValue: 250, min: 1, unit: 'bytes' },
      { id: 'compRatio', label: 'Compression Savings Factor', type: 'number', defaultValue: 3, min: 1, max: 20, unit: 'x' }
    ],
    faq: [
      { question: 'Why does database storage bloat over raw data sizes?', answer: 'Databases maintain indexing keys (B-Trees or LSM trees) and audit trails to optimize query performance, requiring extra storage.' }
    ],
    relatedSlugs: ['database-cost', 'server-requirements'],
    seoTitle: 'Big Data Database Disk Storage sizing Calculator',
    seoDescription: 'Calculate required server database disk space given record tallies and compression ratios.',
    calculate: (inputs) => {
      const records = Number(inputs.records || 1000000);
      const row = Number(inputs.rowBytes || 100);
      const compression = Number(inputs.compRatio || 3);
      
      const rawGb = (records * row) / 1e9; // Raw GB
      const compressedGb = rawGb / compression;
      
      // Index bloat: standard +20% overhead
      const totalDiskGb = compressedGb * 1.20;
      
      return {
        results: [
          { label: 'Required Disk space', value: Number(totalDiskGb.toFixed(2)), unit: 'GB', isPrimary: true },
          { label: 'Raw Uncompressed Volume', value: Number(rawGb.toFixed(2)), unit: 'GB' },
          { label: 'Cumulative Index Overhead', value: Number((compressedGb * 0.20).toFixed(2)), unit: 'GB' }
        ]
      };
    }
  },
  {
    id: 'database-cost',
    name: 'Database Cost Calculator',
    slug: 'database-cost',
    category: 'programming',
    description: 'Estimate monthly pricing limits of cloud relational or NoSQL database instances based on throughput.',
    formula: 'Total Cost = Instance Tier pricing + Storage Cost + IOPS surcharge',
    explanation: 'Combines cloud database server categories, gigabyte volumes, and IOPS requirements into single monthly forecasts.',
    example: 'A multi-AZ PostgreSQL setup hosting 500 GB on AWS RDS with 3,000 IOPS runs approximately $345/month.',
    inputs: [
      { id: 'instanceClass', label: 'Server Instance Category Class', type: 'select', defaultValue: 'medium', options: [
        { label: 'Small Dev (2 vCPU, 4GB RAM)', value: 'small' },
        { label: 'Production Mid (4 vCPU, 16GB RAM)', value: 'medium' },
        { label: 'High Perf Scale (16 vCPU, 64GB RAM)', value: 'large' }
      ]},
      { id: 'storageGb', label: 'Allocated SSD Storage Size', type: 'number', defaultValue: 500, min: 10, unit: 'GB' },
      { id: 'provisionedIops', label: 'Provisioned IOPS speed', type: 'number', defaultValue: 3000, min: 0, step: 500, unit: 'IOPS' }
    ],
    faq: [
      { question: 'What is IOPS in database pricing?', answer: 'Input/Output Operations Per Second. Provisioning dedicated IOPS Guarantees high database request speeds and prevents query delays under peak loads.' }
    ],
    relatedSlugs: ['big-data-storage', 'server-requirements'],
    seoTitle: 'AWS & GCP Database Instance Cost Calculator',
    seoDescription: 'Estimate monthly operating charges for cloud SQL database instances and disk volumes.',
    calculate: (inputs) => {
      const cls = String(inputs.instanceClass || 'medium');
      const storage = Number(inputs.storageGb || 100);
      const iops = Number(inputs.provisionedIops || 0);
      
      let basePrice = 50;
      if (cls === 'medium') basePrice = 180;
      else if (cls === 'large') basePrice = 720;
      
      // Standard AWS/GCP storage averages ~ $0.115 per GB month
      const diskCost = storage * 0.115;
      
      // IOPS pricing averages ~ $0.05 per provisioned unit above 3000 free threshold
      const iopsCost = Math.max(0, iops - 3000) * 0.05;
      
      const totalCost = basePrice + diskCost + iopsCost;
      
      return {
        results: [
          { label: 'Monthly Database operational cost', value: Number(totalCost.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'Pure Storage cost amount', value: Number(diskCost.toFixed(2)), unit: '$' },
          { label: 'Instance Compute cost share', value: basePrice, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'server-requirements',
    name: 'Server Requirement Calculator',
    slug: 'server-requirements',
    category: 'programming',
    description: 'Calculate server core nodes and RAM capacities required to seamlessly support peak concurrent connections.',
    formula: 'Nodes Needed = (RPS * Response Time ms) / Concurrent capacity limit per node',
    explanation: 'Models real-time transactions, scaling node counts to protect system capacity limits during spikes.',
    example: 'Handling 10,000 Requests/sec averaging 100ms processing times on 400 concurrency nodes requires exactly 3 active instances.',
    inputs: [
      { id: 'rps', label: 'Peak Requests Per Second (RPS)', type: 'number', defaultValue: 10000, min: 1, unit: 'req/sec' },
      { id: 'latency', label: 'Average Endpoint Response Latency', type: 'number', defaultValue: 100, min: 10, max: 5000, step: 10, unit: 'ms' },
      { id: 'nodeCapacity', label: 'Concurrent Request limit per node', type: 'number', defaultValue: 500, min: 10, unit: 'threads' }
    ],
    faq: [
      { question: 'How do I handle sudden server traffic spikes?', answer: 'Implement horizontal autoscaling (K8s HPA) paired with global CDN edge caching to handle requests before they reach your servers.' }
    ],
    relatedSlugs: ['cloud-resource-calc', 'database-cost'],
    seoTitle: 'Web Application Server Node and Concurrency Sizing Calculator',
    seoDescription: 'Estimate minimum server instance nodes required to support high-throughput API endpoints.',
    calculate: (inputs) => {
      const rps = Number(inputs.rps || 1000);
      const latencySec = (Number(inputs.latency || 100)) / 1000;
      const capacity = Number(inputs.nodeCapacity || 500);
      
      // Concurrent transactions active at any microsecond
      const activeConcurrences = rps * latencySec;
      const instancesNeeded = Math.ceil(activeConcurrences / capacity);
      
      return {
        results: [
          { label: 'Minimum Server Instances Nodes', value: Math.max(1, instancesNeeded), unit: 'servers', isPrimary: true },
          { label: 'Active Concurrent Transactions', value: Math.round(activeConcurrences), unit: 'connections' }
        ]
      };
    }
  },
  {
    id: 'cloud-resource-calc',
    name: 'Cloud Resource Calculator',
    slug: 'cloud-resource',
    category: 'programming',
    description: 'Estimate monthly cloud cluster fees based on virtual machine counts and egress network volumes.',
    formula: 'Cost = VMs * Cost_VM + Databases * Cost_DB + Egress GB * Rate',
    explanation: 'Collates computing servers, network bandwidth spikes, and container storage counts into complete monthly budgets.',
    example: 'Running 5 production web cluster VMs, 1 standard replica database, and transferring 5,000 GB yields a $335 monthly bill.',
    inputs: [
      { id: 'vmsCount', label: 'Production App Virtual Machines', type: 'number', defaultValue: 5, min: 0, unit: 'VMs' },
      { id: 'dbsCount', label: 'Cloud Relational Database Clusters', type: 'number', defaultValue: 1, min: 0, unit: 'DBS' },
      { id: 'egressGb', label: 'Monthly Ingress/Egress Bandwidth', type: 'number', defaultValue: 5000, min: 0, unit: 'GB' }
    ],
    faq: [
      { question: 'Why is cloud network egress expensive?', answer: 'Hyperscalers charge premium transit rates for data leaving their datacenters to prioritize traffic routing control and security.' }
    ],
    relatedSlugs: ['server-requirements', 'database-cost'],
    seoTitle: 'AWS GCP Hyperscale Cloud Infrastructure Cost Estimator',
    seoDescription: 'Estimate monthly compute, data storage, and exit bandwidth budgets across key providers.',
    calculate: (inputs) => {
      const vms = Number(inputs.vmsCount || 1);
      const dbs = Number(inputs.dbsCount || 0);
      const egress = Number(inputs.egressGb || 0);
      
      const vmCost = vms * 32; // Assume average $32/mo per balanced compute instance
      const dbCost = dbs * 95; // Assume average $95/mo database instance
      const networkCost = egress * 0.08; // $0.08 per GB standard cloud egress
      
      const totalCloudBudget = vmCost + dbCost + networkCost;
      
      return {
        results: [
          { label: 'Monthly Cloud Infrastructure bill', value: Number(totalCloudBudget.toFixed(2)), unit: '$', isPrimary: true },
          { label: 'VM Compute Charges', value: vmCost, unit: '$' },
          { label: 'Data Egress egress cost share', value: Number(networkCost.toFixed(2)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'software-maintenance',
    name: 'Software Maintenance and Technical Debt Calculator',
    slug: 'software-maintenance',
    category: 'programming',
    description: 'Estimate long-term technical debt and software maintenance costs based on legacy codebase size.',
    formula: 'Maintenance Cost = Total Lines * Defect Rate * Dev Hourly rate',
    explanation: 'Models technical codebase liabilities and standard debugging hours needed to sustain enterprise applications.',
    example: 'A legacy system running 150,000 lines of code requires approximately $36,200 annually for bug fixes and patches.',
    inputs: [
      { id: 'loc', label: 'Lines of Code (LOC)', type: 'number', defaultValue: 150000, min: 1000, step: 5000, unit: 'lines' },
      { id: 'complexityMultiplier', label: 'Code Base Complexity', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Low (Well Documented, Modern Framework)', value: 'low' },
        { label: 'Moderate (Standard, some legacy dependencies)', value: 'moderate' },
        { label: 'High Legacy Spaghetti code', value: 'high' }
      ]},
      { id: 'hourlyRate', label: 'Developer Maintenance Compensation', type: 'number', defaultValue: 75, min: 15, max: 250, unit: '$/hr' }
    ],
    faq: [
      { question: 'What is technical debt in software systems?', answer: 'The implied long-term cost of choosing an easy, fast software solution today instead of using a better, highly scalable architectural design.' }
    ],
    relatedSlugs: ['code-complexity-calc', 'algorithm-runtime'],
    seoTitle: 'Software Technical Debt & Maintenance Cost Calculator',
    seoDescription: 'Estimate technical refactoring hours and maintenance costs for legacy applications.',
    calculate: (inputs) => {
      const loc = Number(inputs.loc || 50000);
      const complexity = String(inputs.complexityMultiplier || 'moderate');
      const rate = Number(inputs.hourlyRate || 75);
      
      let complexityFactor = 1.0;
      if (complexity === 'low') complexityFactor = 0.5;
      else if (complexity === 'high') complexityFactor = 2.2;
      
      // Standard model: average of 0.05 refactoring hours per line of code annually under moderate complexity
      const basicMaintenanceHours = loc * 0.04 * complexityFactor;
      const cost = basicMaintenanceHours * rate;
      
      return {
        results: [
          { label: 'Annual Code Maintenance Cost', value: Math.round(cost), unit: '$', isPrimary: true },
          { label: 'Sustaining Dev Hours Required', value: Math.round(basicMaintenanceHours), unit: 'hours/yr' },
          { label: 'Estimated Code Health rating', value: complexity === 'high' ? 'Technical Debt Critical' : 'Healthy Codebase', unit: '' }
        ]
      };
    }
  },
  {
    id: 'code-complexity-calc',
    name: 'Code Complexity Analyzer Calculator',
    slug: 'code-complexity-calc',
    category: 'programming',
    description: 'Estimate software cyclomatic complexity indices and defect vulnerabilities from nesting loops.',
    formula: 'Cyclomatic Complexity (M) = Edges (E) - Nodes (N) + 2 * Components (P)',
    explanation: 'Models control-flow pathways to evaluate testing requirement burdens and maintainability risk levels.',
    example: 'An endpoint file with 24 pathways and 3 components features a cyclomatic value of 14, indicating high nesting complexity.',
    inputs: [
      { id: 'edges', label: 'Control Flow Edges (Paths)', type: 'number', defaultValue: 24, min: 1, unit: 'edges' },
      { id: 'nodes', label: 'Logical Decision Nodes (Steps)', type: 'number', defaultValue: 14, min: 1, unit: 'nodes' },
      { id: 'components', label: 'Independent Sub-routines', type: 'number', defaultValue: 3, min: 1, unit: 'functions' }
    ],
    faq: [
      { question: 'What is cyclomatic complexity?', answer: 'A software metric that measures the number of linearly independent paths through a program’s source code, indicating potential bug risks.' }
    ],
    relatedSlugs: ['software-maintenance', 'algorithm-runtime'],
    seoTitle: 'Cyclomatic Code Complexity & Defect Risk Calculator',
    seoDescription: 'Benchmark software code quality metrics and forecast maintainability scores.',
    calculate: (inputs) => {
      const e = Number(inputs.edges || 10);
      const n = Number(inputs.nodes || 8);
      const p = Number(inputs.components || 1);
      
      const complexity = e - n + (2 * p);
      
      let rating = 'Simple (Low Risk)';
      if (complexity > 10) rating = 'Moderate (Complex Pathways)';
      if (complexity > 20) rating = 'High (Difficult to Test/Maintain)';
      
      return {
        results: [
          { label: 'Cyclomatic Complexity index', value: complexity, unit: 'M', isPrimary: true },
          { label: 'Maintainability Risk Rating', value: rating, unit: '' },
          { label: 'Suggested Unit Test Coverage', value: complexity > 10 ? '90% Minimum' : '75% Standard', unit: '' }
        ]
      };
    }
  }
];
