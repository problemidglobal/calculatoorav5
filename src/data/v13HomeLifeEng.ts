import { Calculator } from '../types';

export const V13_HOME_LIFE_ENG_CALCULATORS: Calculator[] = [
  {
    id: 'concrete-estimator',
    name: 'Concrete Estimator',
    slug: 'concrete-estimator',
    category: 'engineering',
    description: 'Calculate the total volume and bags of concrete required for a slab of any length, width, and depth.',
    seoTitle: 'Slab Concrete Volume and Bags Estimator',
    seoDescription: 'Find required concrete volume in cubic yards or count total standard bags of concrete needed.',
    inputs: [
      { id: 'length', label: 'Slab Length (Feet)', type: 'number', defaultValue: 10 },
      { id: 'width', label: 'Slab Width (Feet)', type: 'number', defaultValue: 10 },
      { id: 'depth', label: 'Slab Depth (Inches)', type: 'number', defaultValue: 4 },
      { id: 'bagSize', label: 'Purchased Bag Weight', type: 'select', defaultValue: '80', options: [{ label: '80 lb Concrete Bags (0.6 cu ft yield)', value: '80' }, { label: '60 lb Concrete Bags (0.45 cu ft yield)', value: '60' }, { label: '40 lb Concrete Bags (0.3 cu ft yield)', value: '40' }] }
    ],
    formula: 'Volume (Cubic Feet) = Length * Width * (Depth / 12)\nVolume (Cubic Yards) = Volume (Cubic Feet) / 27',
    explanation: 'Calculate concrete requirements by converting all dimensions to feet to find cubic volume, then dividing by standard bag yields to determine the total bags needed.',
    example: 'A 10ft x 10ft slab with a 4-inch depth requires 33.33 cubic feet (1.23 cubic yards), requiring approximately 56 bags of 80 lb concrete mix.',
    faq: [
      { question: 'Why add extra concrete for spillage?', answer: 'We recommend adding an extra 10% to cover volume loss from sub-grade variations, form bending, and spillage.' }
    ],
    relatedSlugs: ['gravel-estimator', 'asphalt-estimator'],
    keywords: ['slab concrete cubic yards', 'bags of concrete calculation', 'masonry budget materials planner'],
    calculate: (inputs) => {
      const len = Number(inputs.length || 10);
      const wid = Number(inputs.width || 10);
      const dep = Number(inputs.depth || 4) / 12; // deep in feet
      const bag = inputs.bagSize || '80';

      const cuFt = len * wid * dep;
      const cuYards = cuFt / 27;

      let yieldFactor = 0.6; // cubic feet per bag
      if (bag === '60') yieldFactor = 0.45;
      else if (bag === '40') yieldFactor = 0.3;

      const bagsNeeded = Math.ceil(cuFt / yieldFactor);

      return {
        results: [
          { label: 'Total Volume of Concrete', value: `${cuYards.toFixed(2)}`, unit: 'Cubic Yards', isPrimary: true },
          { label: 'Bags of Ready Mix Needed', value: `${bagsNeeded} Bags (${bag} lb each)` },
          { label: 'Cubic Feet Volume Equivalent', value: `${cuFt.toFixed(1)} cu. ft.` }
        ],
        chartData: [
          { name: 'Pure Slab Volume (cu.ft.)', value: Math.round(cuFt) },
          { name: 'Yield Bags Count Needed', value: bagsNeeded }
        ]
      };
    }
  },
  {
    id: 'gravel-estimator',
    name: 'Gravel Estimator',
    slug: 'gravel-estimator',
    category: 'engineering',
    description: 'Calculate the total weight and volume of gravel, sand, or aggregate stone required for driveways or paths.',
    seoTitle: 'Driveway Gravel and Aggregate Stone Estimator',
    seoDescription: 'Find the total weight in tons and volume in cubic yards of driveway gravel needed.',
    inputs: [
      { id: 'length', label: 'Driveway Length (Feet)', type: 'number', defaultValue: 30 },
      { id: 'width', label: 'Driveway Width (Feet)', type: 'number', defaultValue: 12 },
      { id: 'depth', label: 'Gravel Depth (Inches)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Volume (cu.yd) = [Length * Width * (Depth/12)] / 27\nWeight (Tons) = Volume (cu.yd) * 1.4 (dry gravel constant)',
    explanation: 'Estimate gravel requirements by converting dimensions to cubic yards and multiplying by aggregate density constants (approximately 1.4 tons per cubic yard).',
    example: 'A driveway measuring 30ft x 12ft at an aggregate depth of 3 inches requires 3.33 cubic yards, representing approximately 4.67 tons of dry gravel.',
    faq: [
      { question: 'Does gravel compress after compaction?', answer: 'Yes. Crushed stone aggregates typically compress by 15% to 20% after mechanical rolling and compaction.' }
    ],
    relatedSlugs: ['concrete-estimator', 'asphalt-estimator'],
    keywords: ['gravel tons calculator', 'crushed stone path capacity', 'aggregates cubic yards calculator'],
    calculate: (inputs) => {
      const len = Number(inputs.length || 30);
      const wid = Number(inputs.width || 12);
      const dep = Number(inputs.depth || 3) / 12;

      const cuFt = len * wid * dep;
      const cuYards = cuFt / 27;
      const tons = cuYards * 1.4; // 1 cu yard is approx 1.4 tons

      return {
        results: [
          { label: 'Total Gravel Weight Needed', value: `${tons.toFixed(2)}`, unit: 'Tons', isPrimary: true },
          { label: 'Volume Requirements', value: `${cuYards.toFixed(2)} Cubic Yards` },
          { label: 'Slab Volume equivalent', value: `${cuFt.toFixed(1)} Cubic Feet` }
        ],
        chartData: [
          { name: 'Cubic Yards Needed', value: Math.round(cuYards) },
          { name: 'Expected Tons Weight', value: Math.round(tons) }
        ]
      };
    }
  },
  {
    id: 'asphalt-estimator',
    name: 'Asphalt Estimator',
    slug: 'asphalt-estimator',
    category: 'engineering',
    description: 'Calculate hot-mix asphalt tonnage and coverage volume requirements for driveways or parking spots.',
    seoTitle: 'Hot-Mix Asphalt Driveway Tonnage Estimator',
    seoDescription: 'Find hot asphalt tonnage and coverage limits for driveways or walkways.',
    inputs: [
      { id: 'length', label: 'Asphalt Area Length (Feet)', type: 'number', defaultValue: 40 },
      { id: 'width', label: 'Asphalt Area Width (Feet)', type: 'number', defaultValue: 15 },
      { id: 'depth', label: 'Compacted Depth (Inches)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Weight (Tons) = Length * Width * (Depth / 12) * 0.0725 (hot mix density constant)',
    explanation: 'Estimate hot-mix asphalt weight using a standard material density of approximately 145 lbs/cu.ft (0.0725 tons per cubic foot at 1-inch thickness).',
    example: 'Paving a 40ft x 15ft driveway at a 2-inch compacted depth requires approximately 7.25 tons of hot-mix asphalt.',
    faq: [
      { question: 'What is the standard depth for home driveways?', answer: 'Residential driveways typically perform best at a minimum 2-inch compacted asphalt depth on top of a 6-inch solid gravel sub-grade.' }
    ],
    relatedSlugs: ['concrete-estimator', 'gravel-estimator'],
    keywords: ['asphalt tonnage driveway', 'paving materials calculator', 'asphalt blacktop requirements'],
    calculate: (inputs) => {
      const len = Number(inputs.length || 40);
      const wid = Number(inputs.width || 15);
      const dep = Number(inputs.depth || 2);

      const area = len * wid;
      // 1 sq ft of asphalt 1 inch thick weighs approx 12 lbs
      const weightLbs = area * dep * 12;
      const tons = weightLbs / 2000;

      return {
        results: [
          { label: 'Asphalt Tonnage Required', value: `${tons.toFixed(2)}`, unit: 'Tons', isPrimary: true },
          { label: 'Surface Square Area', value: `${area} Sq. Ft.` },
          { label: 'Approximate Weight in Pounds', value: `${Math.round(weightLbs).toLocaleString()} lbs` }
        ],
        chartData: [
          { name: 'Paved Area (Sq.Ft.)', value: area },
          { name: 'Asphalt Weight (lbs / 10)', value: Math.round(weightLbs / 10) }
        ]
      };
    }
  },
  {
    id: 'wood-beam-deflection',
    name: 'Wood Beam Deflection Calculator',
    slug: 'wood-beam-deflection-calculator',
    category: 'engineering',
    description: 'Calculate maximum deflection and safe load limits for simple span wood structural beams under uniform load.',
    seoTitle: 'Wood Beam Load Deflection and Span Calculator',
    seoDescription: 'Input beam dimensions and lumber species to determine structural wood beam physical deflection limits.',
    inputs: [
      { id: 'span', label: 'Unsupported Beam Span (Feet)', type: 'number', defaultValue: 12 },
      { id: 'load', label: 'Uniformly Distributed Load (lbs/foot)', type: 'number', defaultValue: 100 },
      { id: 'width', label: 'Beam Actual Width (Inches)', type: 'number', defaultValue: 1.5 },
      { id: 'depth', label: 'Beam Actual Depth (Inches)', type: 'number', defaultValue: 7.25 },
      { id: 'species', label: 'Lumber Species/Modulus of Elasticity (E)', type: 'select', defaultValue: 'doug_fir', options: [{ label: 'Douglas Fir (E = 1.6M psi)', value: 'doug_fir' }, { label: 'Southern Pine (E = 1.4M psi)', value: 'pine' }, { label: 'Spruce-Pine-Fir (E = 1.2M psi)', value: 'spf' }] }
    ],
    formula: 'Deflection Δ = (5 * w * L^4) / (384 * E * I)\nMoment of Inertia (I) = (Width * Depth^3) / 12',
    explanation: 'Uses technical engineering formulas to calculate wood beam deflection under uniform load, comparing results against L/360 criteria (the standard building limit for supporting ceilings).',
    example: 'A Spruce-Pine-Fir 2x8 floor joist (1.5" x 7.25") spanning 12 feet under a 100 lbs/foot load experiences approximately 0.283 inches of deflection, which is safe under standard building codes.',
    faq: [
      { question: 'What is the L/360 building ceiling limit?', answer: 'The standard architectural limit where a beam\'s deflection under dead load must not exceed Span (in inches) / 360, preventing cracking in ceiling plaster.' }
    ],
    relatedSlugs: ['concrete-estimator', 'pipe-flow-calculator'],
    keywords: ['lumber joists deflection limits', 'moment of inertia beams', 'wood spanning limit code'],
    calculate: (inputs) => {
      const spanFt = Number(inputs.span || 12);
      const loadFt = Number(inputs.load || 100);
      const b = Number(inputs.width || 1.5);
      const h = Number(inputs.depth || 7.25);
      const spec = inputs.species || 'doug_fir';

      let eElasticity = 1.6e6; // psi
      if (spec === 'pine') eElasticity = 1.4e6;
      else if (spec === 'spf') eElasticity = 1.2e6;

      const spanIn = spanFt * 12;
      const loadIn = loadFt / 12; // lbs per inch

      // Moment of Inertia for rectangle I = b * h^3 / 12
      const iInertia = (b * Math.pow(h, 3)) / 12;

      // Deflection formula for uniform distributed load: 5 * w * L^4 / (384 * E * I)
      const def = (5 * loadIn * Math.pow(spanIn, 4)) / (384 * eElasticity * iInertia);
      const limit360 = spanIn / 360;

      const codePass = def <= limit360 ? 'Safe (Meets L/360 standard)' : 'Too Weak (Fails L/360 standard)';

      return {
        results: [
          { label: 'Calculated Beam Deflection', value: `${def.toFixed(3)}`, unit: 'Inches', isPrimary: true },
          { label: 'L/360 Code Spanning Limit', value: `${limit360.toFixed(3)} Inches` },
          { label: 'Structural Safety assessment', value: codePass }
        ],
        chartData: [
          { name: 'Physical Deflection', value: Math.round(def * 1000) },
          { name: 'Allowable L/360 Limit', value: Math.round(limit360 * 1000) }
        ]
      };
    }
  },
  {
    id: 'pipe-flow',
    name: 'Pipe Flow Calculator',
    slug: 'pipe-flow-calculator',
    category: 'engineering',
    description: 'Calculate discharge rates and water velocity through circular piping structures.',
    seoTitle: 'Hydraulic Water Pipe Velocity and Flow Rate Calculator',
    seoDescription: 'Obtain volumetric discharge rates and flow velocities based on pipe diameter.',
    inputs: [
      { id: 'diameter', label: 'Piping Inner Diameter (Inches)', type: 'number', defaultValue: 2, min: 0.1 },
      { id: 'velocity', label: 'Average Water Velocity (Feet / Second)', type: 'number', defaultValue: 5, step: 0.1 }
    ],
    formula: 'Flow Area A = π * (Diameter / 2)^2\nFlow Rate Q = Area * Velocity * 448.831 (to GPM)',
    explanation: 'Evaluate plumbing and irrigation capacities by calculating cross-sectional area and multiplying by velocity to find volumetric flow rates.',
    example: 'A 2-inch diameter pipe carrying water at a velocity of 5 fps discharges approximately 48.9 gallons per minute.',
    faq: [
      { question: 'What is a safe water velocity for piping?', answer: 'For domestic plumbing, we recommend maintaining velocities below 5 to 8 feet per second to prevent pipe erosion and water hammer noise.' }
    ],
    relatedSlugs: ['hydraulic-cylinder-calculator', 'air-flow-cfm-calculator'],
    keywords: ['plumbing flow rate gpm', 'water velocity capacity', 'pipe cross sectional area'],
    calculate: (inputs) => {
      const dIn = Number(inputs.diameter || 2);
      const v = Number(inputs.velocity || 5);

      const rFt = (dIn / 2) / 12;
      const area = Math.PI * rFt * rFt; // Sq. Ft.
      const dischargeCfs = area * v; // cubic feet per second
      const dischargeGpm = dischargeCfs * 448.831;

      return {
        results: [
          { label: 'Volumetric Flow Discharge', value: `${dischargeGpm.toFixed(1)}`, unit: 'Gallons / Minute (GPM)', isPrimary: true },
          { label: 'Piping cross section Area', value: `${(area * 144).toFixed(3)} Sq. Inches` }
        ],
        chartData: [
          { name: 'Diameter (Inches)', value: Math.round(dIn) },
          { name: 'Flow Rate GPM', value: Math.round(dischargeGpm) }
        ]
      };
    }
  },
  {
    id: 'hydraulic-cylinder',
    name: 'Hydraulic Cylinder Calculator',
    slug: 'hydraulic-cylinder-calculator',
    category: 'engineering',
    description: 'Calculate force capabilities, rod sizing ratios, and oil flow requirements for dual-action hydraulic cylinders.',
    seoTitle: 'Hydraulic Cylinder Force and GPM Flow Calculator',
    seoDescription: 'Input bore, rod diameter, and system pressures to determine push and pull forces for hydraulic cylinders.',
    inputs: [
      { id: 'bore', label: 'Cylinder Bore Diameter (Inches)', type: 'number', defaultValue: 3 },
      { id: 'rod', label: 'Pistons Rod Diameter (Inches)', type: 'number', defaultValue: 1.5 },
      { id: 'psi', label: 'System Hydraulic Pressure (PSI)', type: 'number', defaultValue: 2500 }
    ],
    formula: 'Push Force = Bore_Area * PSI\nPull Force = (Bore_Area - Rod_Area) * PSI',
    explanation: 'Calculate cylinder capabilities under pressure by finding active piston surface areas and multiplying by system pressure.',
    example: 'A cylinder with a 3-inch bore and a 1.5-inch rod operating at 2,500 PSI produces 17,671 lbs of push force and 13,253 lbs of pull force.',
    faq: [
      { question: 'Why does pull force range smaller?', answer: 'Because the piston rod takes up space inside the cylinder, reducing the effective surface area of the piston exposed to pressurized fluid during retraction.' }
    ],
    relatedSlugs: ['pipe-flow-calculator', 'air-flow-cfm-calculator'],
    keywords: ['cylinder load tonnage push', 'hydraulic systems load calculator', 'piston rod retraction forces'],
    calculate: (inputs) => {
      const bore = Number(inputs.bore || 3);
      const rod = Number(inputs.rod || 1.5);
      const psi = Number(inputs.psi || 2500);

      const boreArea = Math.PI * Math.pow(bore / 2, 2);
      const rodArea = Math.PI * Math.pow(rod / 2, 2);

      const pushForce = boreArea * psi;
      const pullForce = (boreArea - rodArea) * psi;

      return {
        results: [
          { label: 'Cylinder Push Force', value: `${Math.round(pushForce).toLocaleString()}`, unit: 'lbs Force', isPrimary: true },
          { label: 'Cylinder Pull Force (Retraction)', value: `${Math.round(pullForce).toLocaleString()}`, unit: 'lbs Force' },
          { label: 'Effective Push Area', value: `${boreArea.toFixed(2)} Sq. Inches` }
        ],
        chartData: [
          { name: 'Bore Surface Area (sq.in)', value: Math.round(boreArea * 10) },
          { name: 'Rod Surface Area (sq.in)', value: Math.round(rodArea * 10) }
        ]
      };
    }
  },
  {
    id: 'air-flow-cfm',
    name: 'Air Flow CFM Calculator',
    slug: 'air-flow-cfm-calculator',
    category: 'engineering',
    description: 'Calculate HVAC air changes per hour (ACH) or convert air velocity and duct sizing to Cubic Feet per Minute (CFM).',
    seoTitle: 'HVAC Air Changes Hourly and CFM Calculator',
    seoDescription: 'Deconstruct office air changes per hour (ACH) or find duct CFM velocity levels.',
    inputs: [
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 15 },
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 12 },
      { id: 'height', label: 'Room Ceiling Height (Feet)', type: 'number', defaultValue: 8 },
      { id: 'ach', label: 'Target Air Changes Hourly (ACH)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Volume (cu.ft.) = L * W * H\nRequired CFM = (Volume * ACH) / 60',
    explanation: 'Air change calculation guarantees sufficient ventilation by measuring room volume and dividing by active time cycles to find the required airflow in Cubic Feet per Minute (CFM).',
    example: 'A 15ft x 12ft room with 8ft ceilings has a volume of 1,440 cubic feet. Achieving 5 air changes per hour requires a ventilation rate of 120 Cubic Feet per Minute (CFM).',
    faq: [
      { question: 'What is a typical healthy ACH target?', answer: 'Residential living rooms typically perform best at 4-6 ACH, public classroom spaces require 6-8 ACH, and specialized medical clinics target 12+ ACH.' }
    ],
    relatedSlugs: ['pipe-flow-calculator', 'hydraulic-cylinder-calculator'],
    keywords: ['duct velocity cfm', 'hvac room air turnover Rate', 'ventilation design planner'],
    calculate: (inputs) => {
      const l = Number(inputs.length || 15);
      const w = Number(inputs.width || 12);
      const h = Number(inputs.height || 8);
      const ach = Number(inputs.ach || 5);

      const vol = l * w * h;
      const cfm = (vol * ach) / 60;

      return {
        results: [
          { label: 'Required Air Flow Rate', value: `${cfm.toFixed(0)}`, unit: 'CFM (Cubic Feet / Minute)', isPrimary: true },
          { label: 'Total Room Cubic Volume', value: `${vol.toLocaleString()} Cubic Feet` }
        ],
        chartData: [
          { name: 'Room Volume (cu.ft./10)', value: Math.round(vol / 10) },
          { name: 'Required Flow (CFM)', value: Math.round(cfm) }
        ]
      };
    }
  },
  {
    id: 'gas-mileage',
    name: 'Gas Mileage Calculator',
    slug: 'gas-mileage-calculator',
    category: 'daily-life',
    description: 'Calculate average fuel fuel economics (MPG or L/100km) based on odometer trip counts.',
    seoTitle: 'Miles Per Gallon (MPG) Fuel Economy Calculator',
    seoDescription: 'Input miles driven and gallons used to calculate your average vehicle fuel efficiency (MPG).',
    inputs: [
      { id: 'miles', label: 'Miles Traveled on Trip', type: 'number', defaultValue: 320 },
      { id: 'gallons', label: 'Gallons of Gas Consumed', type: 'number', defaultValue: 11.5 }
    ],
    formula: 'Fuel Economy (MPG) = Miles Traveled / Gallons used',
    explanation: 'Track fuel economy over regular odometer trips to monitor vehicle health and plan fuel budgets.',
    example: 'Traveling 320 miles on 11.5 gallons of gas represents an average fuel efficiency of 27.83 MPG.',
    faq: [
      { question: 'What is a typical healthy MPG score?', answer: 'Standard sedans typically average 25-35 MPG, hybrid vehicles exceed 45+ MPG, and large utility vehicles often score under 18 MPG.' }
    ],
    relatedSlugs: ['ev-savings-calculator', 'caffeine-calculator'],
    keywords: ['miles driven gallon tracker', 'fuel economics calculator', 'gas usage car mileage'],
    calculate: (inputs) => {
      const miles = Number(inputs.miles || 320);
      const gals = Number(inputs.gallons || 11.5);

      const mpg = gals > 0 ? (miles / gals) : 0;
      const metricEquivalent = mpg > 0 ? (235.215 / mpg) : 0; // L/100km

      return {
        results: [
          { label: 'Average Fuel Economy', value: `${mpg.toFixed(2)}`, unit: 'Miles / Gallon (MPG)', isPrimary: true },
          { label: 'Metric Equivalent', value: `${metricEquivalent.toFixed(2)} Liters / 100 km` }
        ],
        chartData: [
          { name: 'Miles Driven', value: Math.round(miles / 10) },
          { name: 'Fuel Economy (MPG)', value: Math.round(mpg) }
        ]
      };
    }
  },
  {
    id: 'ev-savings',
    name: 'Electric Vehicle Savings Calculator',
    slug: 'ev-savings-calculator',
    category: 'daily-life',
    description: 'Compare fuel costs vs. utility grid charging rates to calculate financial savings from driving an electric vehicle.',
    seoTitle: 'EV Charging vs. Gas Fuel Savings Calculator',
    seoDescription: 'Obtain monthly driving fuel savings by comparing standard gas vehicles with electric vehicles.',
    inputs: [
      { id: 'distance', label: 'Monthly Driving Output (Miles)', type: 'number', defaultValue: 1000 },
      { id: 'mpg', label: 'Gas Vehicle Fuel Efficiency (MPG)', type: 'number', defaultValue: 25 },
      { id: 'gasCost', label: 'Local Gas Price per Gallon ($)', type: 'number', defaultValue: 3.6 },
      { id: 'elecCost', label: 'Electricity Price per kWh ($)', type: 'number', defaultValue: 0.16 },
      { id: 'evEfficiency', label: 'EV Efficiency rate (Miles / kWh)', type: 'number', defaultValue: 3.5 }
    ],
    formula: 'Gas Cost = (Miles / MPG) * Gas_Price\nEV Cost = (Miles / EV_Efficiency) * kWh_Price',
    explanation: 'Evaluate the economic impact of switching to an electric vehicle by comparing fuel costs with home charging rates over your monthly driving volume.',
    example: 'Driving 1,000 miles in a 25 MPG gas vehicle costing $3.60/gallon costs $144.00, while charging an EV at 16¢/kWh costs approximately $45.71, delivering $98.29 in monthly savings.',
    faq: [
      { question: 'What is standard EV battery health?', answer: 'Modern electric vehicle lithium battery arrays typically retain over 80% capacity after 8-10 years of typical daily driving.' }
    ],
    relatedSlugs: ['gas-mileage-calculator', 'sleep-cycle-calculator'],
    keywords: ['electric cars cost save', 'charging vs gas comparison', 'home energy fuel efficiency'],
    calculate: (inputs) => {
      const distance = Number(inputs.distance || 1000);
      const mpg = Number(inputs.mpg || 25);
      const gas = Number(inputs.gasCost || 3.6);
      const kw = Number(inputs.elecCost || 0.16);
      const evE = Number(inputs.evEfficiency || 3.5);

      const gasTotal = mpg > 0 ? (distance / mpg) * gas : 0;
      const evTotal = evE > 0 ? (distance / evE) * kw : 0;

      const monthlySavings = gasTotal - evTotal;

      return {
        results: [
          { label: 'Monthly Financial Savings', value: `$${monthlySavings.toFixed(2)}`, isPrimary: true },
          { label: 'Monthly Gas Cost Equivalent', value: `$${gasTotal.toFixed(2)}` },
          { label: 'Monthly EV Charging Cost', value: `$${evTotal.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Monthly Gas Cost ($)', value: Math.round(gasTotal) },
          { name: 'Monthly EV Charging Cost ($)', value: Math.round(evTotal) }
        ]
      };
    }
  },
  {
    id: 'caffeine',
    name: 'Caffeine Calculator',
    slug: 'caffeine-calculator',
    category: 'daily-life',
    description: 'Calculate caffeine half-life degradation rates to identify optimal timeframes for restful sleep.',
    seoTitle: 'Daily Coffee Caffeine Half-Life Sleep Planner',
    seoDescription: 'Trace caffeine blood level decay curves to prevent sleep disruption from coffee or teas.',
    inputs: [
      { id: 'amount', label: 'Caffeine Consumed', type: 'number', defaultValue: 120, unit: 'mg' },
      { id: 'source', label: 'Caffeine Source Description', type: 'select', defaultValue: 'drip', options: [{ label: '1 Cup Drip Coffee (120 mg)', value: 'drip' }, { label: '1 Shot Espresso (80 mg)', value: 'espresso' }, { label: 'Double Energy Can (160 mg)', value: 'energy' }, { label: 'Classic Black Tea (45 mg)', value: 'tea' }] },
      { id: 'hours', label: 'Hours Passed Since Consumption', type: 'number', defaultValue: 6 }
    ],
    formula: 'Active Caffeine Remaining = Base Amount * 0.5 ^ (HoursPassed / 5.7)',
    explanation: 'Track caffeine decay using an average metabolic half-life of 5.7 hours. Residual caffeine levels above 30 mg can disrupt sleep quality and REM patterns.',
    example: 'Consuming 120 mg of caffeine (1 cup of coffee) leaves approximately 58 mg in your system after 6 hours, which can affect sleep quality if bedtime is near.',
    faq: [
      { question: 'What is the maximum safe daily caffeine intake?', answer: 'The FDA recommends limiting daily caffeine intake to 400 mg or less for healthy adults to prevent side effects like anxiety and heart palpitations.' }
    ],
    relatedSlugs: ['sleep-cycle-calculator', 'gas-mileage-calculator'],
    keywords: ['caffeine half life tracer', 'sleep coffee timing window', 'caffeine daily allowance'],
    calculate: (inputs) => {
      const customVal = Number(inputs.amount || 120);
      const src = inputs.source || 'drip';
      const hours = Number(inputs.hours || 6);

      let baseAmount = customVal;
      if (src === 'espresso') baseAmount = 80;
      else if (src === 'energy') baseAmount = 160;
      else if (src === 'tea') baseAmount = 45;

      const remaining = baseAmount * Math.pow(0.5, hours / 5.7);

      return {
        results: [
          { label: 'Remaining System Caffeine', value: `${remaining.toFixed(1)} mg`, isPrimary: true },
          { label: 'Caffeine Initial dose', value: `${baseAmount} mg` },
          { label: 'Sleep Block assessment', value: remaining > 30 ? 'High residual levels (may disrupt sleep)' : 'Low residual levels (safe for sleep)' }
        ],
        chartData: [
          { name: 'Initial Dose (mg)', value: baseAmount },
          { name: 'Remaining in System (mg)', value: Math.round(remaining) }
        ]
      };
    }
  },
  {
    id: 'sleep-cycle',
    name: 'Sleep Cycle Calculator',
    slug: 'sleep-cycle-calculator',
    category: 'daily-life',
    description: 'Calculate your target wake-up times based on natural 90-minute sleep cycles to wake up rested.',
    seoTitle: '90-Minute REM Sleep Cycle and Alarm Planner',
    seoDescription: 'Plan your bedtime or alarm times based on natural 90-minute REM sleep cycles to wake up feeling refreshed.',
    inputs: [
      { id: 'h', label: 'Hour You Intend to Sleep', type: 'number', defaultValue: 23, min: 0, max: 23 },
      { id: 'm', label: 'Minute You Intend to Sleep', type: 'number', defaultValue: 0, min: 0, max: 59 },
      { id: 'latency', label: 'Avg Time to Fall Asleep (Minutes)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Optimal wake times are calculated at intervals of 1.5-hour sleep cycles from bedtime.',
    explanation: 'Wake up feeling refreshed by aligning your alarm with the end of a 90-minute REM cycle, minimizing sleep inertia and grogginess.',
    example: 'Falling asleep at 11:15 PM (bedtime of 11:00 PM plus 15 minutes of sleep latency) suggests waking up at 6:45 AM (5 full sleep cycles) to wake up feeling rested.',
    faq: [
      { question: 'What is sleep inertia?', answer: 'The feeling of grogginess experienced when waking up suddenly in the middle of a deep sleep cycle.' }
    ],
    relatedSlugs: ['caffeine-calculator', 'weather-wind-chill-calculator'],
    keywords: ['sleep patterns alarm timing', '90 min rem periods', 'prevent morning groggy sleep'],
    calculate: (inputs) => {
      const hr = Number(inputs.h || 23);
      const min = Number(inputs.m || 0);
      const lat = Number(inputs.latency || 15);

      const formatTime = (totalMinutes: number) => {
        let clean = totalMinutes % 1440;
        if (clean < 0) clean += 1440;
        const hPart = Math.floor(clean / 60);
        const mPart = Math.floor(clean % 60);
        const ampm = hPart >= 12 ? 'PM' : 'AM';
        const displayH = hPart % 12 || 12;
        return `${displayH}:${mPart.toString().padStart(2, '0')} ${ampm}`;
      };

      const startMin = (hr * 60) + min + lat;

      // 5, 6, and 4 sleep cycles (90 min cycles)
      const wake5 = startMin + (90 * 5);
      const wake6 = startMin + (90 * 6);
      const wake4 = startMin + (90 * 4);

      return {
        results: [
          { label: 'Healthy wake target (5 cycles)', value: formatTime(wake5), isPrimary: true },
          { label: 'Longer rest target (6 cycles)', value: formatTime(wake6) },
          { label: 'Shorter rest target (4 cycles)', value: formatTime(wake4) }
        ],
        chartData: [
          { name: '4 Cycles rest mins', value: 90 * 4 },
          { name: '5 Cycles rest mins', value: 90 * 5 },
          { name: '6 Cycles rest mins', value: 90 * 6 }
        ]
      };
    }
  },
  {
    id: 'paint-volume',
    name: 'Paint Area Calculator',
    slug: 'paint-volume-calculator',
    category: 'home-tools',
    description: 'Calculate the total gallons of paint required to cover your walls, accounting for window and door cutouts.',
    seoTitle: 'Dynamic Room Paint Gallons and Coverage Calculator',
    seoDescription: 'Input room dimensions, doorways, and windows to calculate your required wall paint volume.',
    inputs: [
      { id: 'length', label: 'Room Length (Feet)', type: 'number', defaultValue: 14 },
      { id: 'width', label: 'Room Width (Feet)', type: 'number', defaultValue: 12 },
      { id: 'height', label: 'Wall Height (Feet)', type: 'number', defaultValue: 8 },
      { id: 'doors', label: 'Number of Doors (Standard 21 sq.ft)', type: 'number', defaultValue: 1 },
      { id: 'windows', label: 'Number of Windows (Standard 15 sq.ft)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Wall Area = 2 * (L + W) * H\nNet Area = Wall Area - (Doors * 21) - (Windows * 15)\nPaint Required (Gallons) = Net Area / 350 (standard coverage)',
    explanation: 'Uses technical paint coverage metrics (approximately 350 sq.ft per gallon) to determine the volume of paint required for your project after subtracting window and door areas.',
    example: 'A 14ft x 12ft room with 8ft walls containing 1 door and 2 windows has 365 sq.ft of net wall surface area, requiring approximately 1.04 gallons per coat.',
    faq: [
      { question: 'Should I calculate for 2 coats of paint?', answer: 'Yes. Most professional painting projects require two coats of paint for uniform color and durable coverage.' }
    ],
    relatedSlugs: ['tile-count-calculator', 'concrete-estimator'],
    keywords: ['paint liters gallons bounds', 'wall coverage paint estimator', 'home decor remodel volume'],
    calculate: (inputs) => {
      const len = Number(inputs.length || 14);
      const wid = Number(inputs.width || 12);
      const h = Number(inputs.height || 8);
      const doors = Number(inputs.doors || 1);
      const windows = Number(inputs.windows || 2);

      const grossArea = 2 * (len + wid) * h;
      const netArea = Math.max(0, grossArea - (doors * 21) - (windows * 15));
      const gallons = netArea / 350;

      return {
        results: [
          { label: 'Paint Required (1 Coat)', value: `${gallons.toFixed(2)}`, unit: 'Gallons', isPrimary: true },
          { label: 'Recommended (2 Coats)', value: `${(gallons * 2).toFixed(2)} Gallons` },
          { label: 'Net Wall surface area', value: `${netArea} Sq. Ft.` }
        ],
        chartData: [
          { name: 'Gross Wall Area', value: grossArea },
          { name: 'Subtracted Doors/Windows', value: grossArea - netArea }
        ]
      };
    }
  },
  {
    id: 'tile-count',
    name: 'Tile Count Calculator',
    slug: 'tile-count-calculator',
    category: 'home-tools',
    description: 'Calculate the total tiles required for a floor layout, including default allowances for cutting waste.',
    seoTitle: 'Flooring Tile Count and Coverage Calculator',
    seoDescription: 'Find the total tiles required for custom room flooring projects, including default allowances for waste.',
    inputs: [
      { id: 'fLength', label: 'Floor Area Length (Feet)', type: 'number', defaultValue: 10 },
      { id: 'fWidth', label: 'Floor Area Width (Feet)', type: 'number', defaultValue: 10 },
      { id: 'tSize', label: 'Standard Tile Dimensions', type: 'select', defaultValue: '12x12', options: [{ label: '12 in. x 12 in. (1 Sq.Ft.)', value: '12x12' }, { label: '18 in. x 18 in. (2.25 Sq.Ft.)', value: '18x18' }, { label: '6 in. x 6 in. (0.25 Sq.Ft.)', value: '6x6' }] },
      { id: 'waste', label: 'Material Waste Allowance (%)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Floor Area = Length * Width\nTile Area = (Tile Length * Tile Width) / 144\nTotal Tiles = (Floor Area / Tile Area) * (1 + Waste%)',
    explanation: 'Calculate tile requirements by dividing floor area by tile area and adding material waste allowances for cuts, borders, and potential breakage.',
    example: 'Tiling a 10ft x 10ft floor (100 sq.ft) with 12"x12" tiles requires exactly 100 tiles. Adding a 10% waste allowance requires a total of 110 tiles.',
    faq: [
      { question: 'Why add a waste allowance?', answer: 'Tiling requires cutting materials to fit corners, curves, and borders, meaning some portion of the tiles will be discarded.' }
    ],
    relatedSlugs: ['paint-volume-calculator', 'concrete-estimator'],
    keywords: ['tile counts square feet', 'flooring pavers remodels', 'layout cut patterns'],
    calculate: (inputs) => {
      const len = Number(inputs.fLength || 10);
      const width = Number(inputs.fWidth || 10);
      const val = inputs.tSize || '12x12';
      const waste = Number(inputs.waste || 10) / 100;

      const fArea = len * width;
      let tArea = 1; // sq ft of tile

      if (val === '18x18') tArea = 2.25;
      else if (val === '6x6') tArea = 0.25;

      const baseTiles = fArea / tArea;
      const totalTiles = Math.ceil(baseTiles * (1 + waste));

      return {
        results: [
          { label: 'Total Tiles Required', value: `${totalTiles}`, unit: 'Tiles', isPrimary: true },
          { label: 'Plotted floor Area', value: `${fArea} Sq. Ft.` },
          { label: 'Waste Coverage Amount', value: `${Math.ceil(baseTiles * waste)} Tiles` }
        ],
        chartData: [
          { name: 'Floor Area (Sq.Ft.)', value: fArea },
          { name: 'Estimated Tiles Needed', value: totalTiles }
        ]
      };
    }
  }
];
