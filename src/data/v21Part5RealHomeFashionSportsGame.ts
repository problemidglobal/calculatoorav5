import { Calculator } from '../types';

export const V21_PART5_CALCULATORS: Calculator[] = [
  // ====================================== REAL WORLD TOOLS ======================================
  {
    id: 'distance-calc',
    name: 'Advanced Distance Conversion Calculator',
    slug: 'distance-calc',
    category: 'real-world-tools',
    description: 'Convert distances between Miles, Kilometers, Nautical Miles, and Astronomical Units (AU).',
    formula: 'Distance = Input distance * conversion multiplier',
    explanation: 'Applies precise mathematical multipliers to convert distances across global standard and astronomical units.',
    example: 'Converting 150 Kilometers outputs roughly 81 Nautical Miles.',
    inputs: [
      { id: 'distanceVal', label: 'Input Distance Value', type: 'number', defaultValue: 100, min: 0.001 },
      { id: 'sourceUnit', label: 'Source Distance Unit', type: 'select', defaultValue: 'km', options: [
        { label: 'Kilometers (km)', value: 'km' },
        { label: 'Miles (mi)', value: 'mi' },
        { label: 'Nautical Miles (NM)', value: 'nm' },
        { label: 'Astronomical Units (AU)', value: 'au' }
      ]}
    ],
    faq: [
      { question: 'What is a Nautical Mile details?', answer: 'A Nautical Mile is historically based on one minute of arc of latitude along any meridian, equivalent to exactly 1,852 meters (1.1508 miles).' }
    ],
    relatedSlugs: ['unit-converter-adv', 'travel-time'],
    seoTitle: 'Advanced Distance Unit Converter | Miles, km, Nautical Miles',
    seoDescription: 'Convert distances between Miles, Kilometers, Nautical Miles, and Astronomical Units (AU) with our high-precision calculator.',
    calculate: (inputs) => {
      const val = Number(inputs.distanceVal || 100);
      const src = inputs.sourceUnit || 'km';

      // convert everything to Meters first
      let meters = 0;
      if (src === 'km') meters = val * 1000;
      else if (src === 'mi') meters = val * 1609.344;
      else if (src === 'nm') meters = val * 1852;
      else if (src === 'au') meters = val * 1.495978707e11;

      const km = meters / 1000;
      const mi = meters / 1609.344;
      const nm = meters / 1852;
      const au = meters / 1.495978707e11;

      return {
        results: [
          { label: 'Metric Kilometers (km)', value: `${km.toFixed(4)} km`, isPrimary: src !== 'km' },
          { label: 'US Miles (mi)', value: `${mi.toFixed(4)} mi`, isPrimary: src !== 'mi' },
          { label: 'Nautical Miles (NM)', value: `${nm.toFixed(4)} NM` },
          { label: 'Astronomical Units (AU)', value: au.toExponential(4) }
        ]
      };
    }
  },
  {
    id: 'timezone-diff',
    name: 'Time Difference & Timezone Calculator',
    slug: 'timezone-diff',
    category: 'real-world-tools',
    description: 'Calculate hour differences and event times between global timezones.',
    formula: 'Time Difference = Target timezoneOffset - Source timezoneOffset',
    explanation: 'Calculates the exact hour offset between timezones to help you coordinate global meetings and travel.',
    example: 'New York (EST, GMT-5) is 8 hours behind Riyadh (AST, GMT+3).',
    inputs: [
      { id: 'sourceOffset', label: 'Source timezone Offset (GMT)', type: 'select', defaultValue: '-5', options: [
        { label: 'US Eastern / New York (GMT-5)', value: '-5' },
        { label: 'GMT Baseline Central London (GMT+0)', value: '0' },
        { label: 'US Pacific / Los Angeles (GMT-8)', value: '-8' },
        { label: 'Japan Standard / Tokyo (GMT+9)', value: '9' }
      ]},
      { id: 'targetOffset', label: 'Target timezone Offset (GMT)', type: 'select', defaultValue: '9', options: [
        { label: 'Japan Standard / Tokyo (GMT+9)', value: '9' },
        { label: 'US Eastern / New York (GMT-5)', value: '-5' },
        { label: 'Central European / Paris (GMT+1)', value: '1' },
         { label: 'US Pacific / Los Angeles (GMT-8)', value: '-8' }
      ]}
    ],
    faq: [
      { question: 'Does Daylight Saving Time affect timezone offsets?', answer: 'Yes! Daylight Saving Time changes timezone offsets by one hour in affected regions, typically starting in spring and ending in autumn.' }
    ],
    relatedSlugs: ['travel-time', 'date-calc-adv'],
    seoTitle: 'Global Timezone Difference & Meeting Coordinator',
    seoDescription: 'Calculate the hour difference between major global timezones. Coordinate international meetings easily.',
    calculate: (inputs) => {
      const src = Number(inputs.sourceOffset || -5);
      const tgt = Number(inputs.targetOffset || 9);

      const diff = tgt - src;
      const absDiff = Math.abs(diff);
      const text = diff >= 0 ? `${absDiff} Hours Ahead` : `${absDiff} Hours Behind`;

      return {
        results: [
          { label: 'Target Time Difference', value: text, isPrimary: true },
          { label: 'Source GMT Offset', value: `GMT ${src >= 0 ? '+' : ''}${src}` },
          { label: 'Target GMT Offset', value: `GMT ${tgt >= 0 ? '+' : ''}${tgt}` }
        ]
      };
    }
  },
  {
    id: 'age-advanced',
    name: 'Advanced Age in Dates & Minutes Sizer',
    slug: 'age-advanced',
    category: 'real-world-tools',
    description: 'Calculate your exact age down to months, days, hours, and minutes based on your birthdate.',
    formula: 'Age = Current Date - Birthdate',
    explanation: 'Converts birthdate intervals into exact age units, revealing fascinating milestones.',
    example: 'Waking up on June 19, 2026, when born on March 15, 1995.',
    inputs: [
      { id: 'birthDate', label: 'Your Date of Birth', type: 'date', defaultValue: '1995-03-15' }
    ],
    faq: [
      { question: 'Why does age calculation require days logic?', answer: 'Our calculator accounts for varying month lengths and leap years to provide a precise calculation of your age.' }
    ],
    relatedSlugs: ['date-calc-adv', 'timezone-diff'],
    seoTitle: 'Advanced Age, Months, Days & minutes Calculator',
    seoDescription: 'Calculate your exact age in years, months, days, and minutes. Track age milestones and leap years easily.',
    calculate: (inputs) => {
      const bStr = inputs.birthDate || '1995-03-15';
      const bDate = new Date(bStr);
      const now = new Date(); // assume current metadata time or real runtime

      const diffMs = now.getTime() - bDate.getTime();
      const totalDays = Math.floor(diffMs / 86400000);
      const years = Math.floor(totalDays / 365.25);
      const months = Math.floor((totalDays % 365.25) / 30.4375);
      const days = Math.floor((totalDays % 365.25) % 30.4375);

      return {
        results: [
          { label: 'Exact Age Calculated', value: `${years} Years, ${months} Months, ${days} Days`, isPrimary: true },
          { label: 'Cumulative Days Lived', value: `${totalDays.toLocaleString()} Days`, isPrimary: true },
          { label: 'Approximate Minutes Lived', value: `${Math.floor(diffMs / 60000).toLocaleString()} Minutes` }
        ]
      };
    }
  },
  {
    id: 'date-calc-adv',
    name: 'Advanced Business Date offset planner',
    slug: 'date-calc-adv',
    category: 'real-world-tools',
    description: 'Project future deadline dates or milestones by adding or subtracting calendar days.',
    formula: 'Target Date = Start Date +/- Day offset',
    explanation: 'Tracks deadlines and project milestones by adding or subtracting custom day offsets.',
    example: 'Adding 45 calendar days to a starting date of June 19, 2026.',
    inputs: [
      { id: 'startDate', label: 'Starting Calendar Date', type: 'date', defaultValue: '2026-06-19' },
      { id: 'daysOffset', label: 'Offset Duration (Days)', type: 'number', defaultValue: 45, min: -1000, max: 1000, step: 1 }
    ],
    faq: [
      { question: 'Does this calculator exclude weekends?', answer: 'This tool handles simple calendar days. Working day calculators offer more targeted options for business projects.' }
    ],
    relatedSlugs: ['age-advanced', 'timezone-diff'],
    seoTitle: 'Calendar Date addition & Subtraction Offset Planner',
    seoDescription: 'Project future business dates. Calculate deadlines by adding or subtracting custom calendar day offsets.',
    calculate: (inputs) => {
      const sStr = inputs.startDate || '2026-06-19';
      const offset = Number(inputs.daysOffset || 45);

      const d = new Date(sStr);
      d.setDate(d.getDate() + offset);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      const formatted = d.toLocaleDateString('en-US', options);

      return {
        results: [
          { label: 'Target Project Date', value: formatted, isPrimary: true },
          { label: 'Offset Distance applied', value: `${offset} Days` }
        ]
      };
    }
  },
  {
    id: 'percentage-adv',
    name: 'Advanced Percentage Solver',
    slug: 'percentage-adv',
    category: 'real-world-tools',
    description: 'Solve complex percentage equations including increases, decreases, fractions, and proportions.',
    formula: 'Percentage Increase = ((Ending - Starting) / Starting) * 100',
    explanation: 'Quickly calculates percentage changes and ratios, helping you solve business, budget, and math problems.',
    example: 'A budget increase from $1,200 to $1,500 represents a 25% percentage increase.',
    inputs: [
      { id: 'mathMode', label: 'Math calculation Mode', type: 'select', defaultValue: 'diff', options: [
        { label: 'Percentage Increase / Decrease (X to Y)', value: 'diff' },
        { label: 'Find what X percent of Y is', value: 'portion' }
      ]},
      { id: 'valX', label: 'Value X', type: 'number', defaultValue: 1200, min: 0.01 },
      { id: 'valY', label: 'Value Y', type: 'number', defaultValue: 1500, min: 0.01 }
    ],
    faq: [
      { question: 'What is a negative percentage change?', answer: 'A negative percentage change indicates a percentage decrease between the starting value and the ending value.' }
    ],
    relatedSlugs: ['unit-converter-adv', 'distance-calc'],
    seoTitle: 'Advanced Percentage Increase & Ratio Calculator',
    seoDescription: 'Solve complex percentage equations. Calculate percentage increases, portions, and ratios easily.',
    calculate: (inputs) => {
      const mode = inputs.mathMode || 'diff';
      const x = Number(inputs.valX || 1200);
      const y = Number(inputs.valY || 1500);

      let resultText = '';
      if (mode === 'diff') {
        const diff = y - x;
        const pct = (diff / x) * 100;
        resultText = `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`;
      } else {
        const val = (x / 100) * y;
        resultText = val.toLocaleString();
      }

      return {
        results: [
          { label: mode === 'diff' ? 'Percentage Change' : 'Percentage portion Value', value: resultText, isPrimary: true },
          { label: 'Value X input', value: x },
          { label: 'Value Y input', value: y }
        ]
      };
    }
  },
  {
    id: 'unit-converter-adv',
    name: 'Comprehensive unit Converter',
    slug: 'unit-converter-adv',
    category: 'real-world-tools',
    description: 'Convert physical units across weight, temperature, and volume metrics.',
    formula: 'Output = Input * conversion coefficient',
    explanation: 'Converts physical units to help you follow international recipes, metrics, and business specs.',
    example: 'Converting 85 kg to US pounds outputs 187.4 lbs.',
    inputs: [
      { id: 'valInput', label: 'Input Unit Value', type: 'number', defaultValue: 85, min: 0.001 },
      { id: 'convMode', label: 'Physical Dimension Category', type: 'select', defaultValue: 'weight', options: [
        { label: 'Weight (kg to lbs)', value: 'weight' },
        { label: 'Temperature (Celsius to Fahrenheit)', value: 'temp' }
      ]}
    ],
    faq: [
      { question: 'Why use standard metric conversion ratios?', answer: 'Standard metric conversion ratios ensure high accuracy and prevent measurement errors across science, safety, and baking applications.' }
    ],
    relatedSlugs: ['percentage-adv', 'distance-calc'],
    seoTitle: 'Comprehensive physical unit Converter | Weight, Temp',
    seoDescription: 'Convert physical units across weight and temperature metrics. Follow international recipes easily.',
    calculate: (inputs) => {
      const val = Number(inputs.valInput || 85);
      const mode = inputs.convMode || 'weight';

      let output = 0;
      let label = '';
      if (mode === 'weight') {
        output = val * 2.20462;
        label = 'Pounds (lbs)';
      } else {
        output = (val * 9/5) + 32;
        label = 'Fahrenheit (°F)';
      }

      return {
        results: [
          { label: label, value: `${output.toFixed(2)}`, isPrimary: true },
          { label: 'Raw input value', value: val }
        ]
      };
    }
  },

  // ====================================== HOME SERVICES ======================================
  {
    id: 'cleaning-cost',
    name: 'Home Cleaning Cost Estimator',
    slug: 'cleaning-cost',
    category: 'home-services',
    description: 'Estimate home cleaning costs based on house size, room counts, and custom deep clean multipliers.',
    formula: 'Cost = Base charge + Bedrooms * 25 + Bathrooms * 35 + deep clean multipliers',
    explanation: 'Calculates cleaning costs based on room counts and deep cleaning options, helping you plan household expenses.',
    example: 'A standard 3-bedroom, 2-bathroom apartment cleaning fee.',
    inputs: [
      { id: 'bedrooms', label: 'Count of Bedrooms', type: 'number', defaultValue: 3, min: 1 },
      { id: 'bathrooms', label: 'Count of Bathrooms', type: 'number', defaultValue: 2, min: 1 },
      { id: 'cleanType', label: 'Required Cleaning Type', type: 'select', defaultValue: 'standard', options: [
        { label: 'Standard Recurring Sweep (1.0x multiplier)', value: 'standard' },
        { label: 'Comprehensive Deep Cleaning (1.5x multiplier)', value: 'deep' }
      ]}
    ],
    faq: [
      { question: 'Why is there a deep cleaning premium?', answer: 'Deep cleaning requires extra time and specialized materials to clean inside ovens, baseboards, and window tracks, justifying the premium.' }
    ],
    relatedSlugs: ['repair-cost', 'maintenance-planner-home'],
    seoTitle: 'Residential Deep & Recurring Home Cleaning Cost Estimator',
    seoDescription: 'Estimate residential cleaning costs. Model deep cleaning services based on bedroom and bathroom counts.',
    calculate: (inputs) => {
      const beds = Number(inputs.bedrooms || 3);
      const baths = Number(inputs.bathrooms || 2);
      const type = inputs.cleanType || 'standard';

      const base = 80; // base callout fee
      const roomFees = (beds * 25) + (baths * 35);
      const sub = base + roomFees;
      const mult = type === 'deep' ? 1.5 : 1.0;
      const total = sub * mult;

      return {
        results: [
          { label: 'Estimated Cleaning Cost', value: total.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Baseline Callout Fee', value: base.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'repair-cost',
    name: 'Home Repair Contractor cost Estimator',
    slug: 'repair-cost',
    category: 'home-services',
    description: 'Estimate home repair costs using contractor hourly rates and typical material cost reserves.',
    formula: 'Cost = Contractor Hours * Work Hourly Rate + Material Reserves',
    explanation: 'Estimates home repair costs, helping homeowners coordinate maintenance work and budget contractor fees.',
    example: 'A plumbing repair modeled over 4 hours of professional contract labor.',
    inputs: [
      { id: 'estimatedHours', label: 'Estimated Contractor Labor Hours', type: 'number', defaultValue: 3.5, min: 0.5, step: 0.5 },
      { id: 'contractorHourly', label: 'Contractor Hourly Rate ($/Hour)', type: 'number', defaultValue: 85, min: 20 },
      { id: 'materialsCap', label: 'Materials & Replacements Cost ($)', type: 'number', defaultValue: 150, min: 0 }
    ],
    faq: [
      { question: 'Why do contractor hourly rates vary?', answer: 'Licensed specialists like plumbers and electricians charge higher hourly rates than general handymen due to licensing and liability costs.' }
    ],
    relatedSlugs: ['cleaning-cost', 'maintenance-planner-home'],
    seoTitle: 'Handyman & Contractor Repair Labor Cost Estimator',
    seoDescription: 'Estimate handyman and contractor repair costs. Sizer repair labour budgets based on hourly project scopes.',
    calculate: (inputs) => {
      const hrs = Number(inputs.estimatedHours || 3.5);
      const rate = Number(inputs.contractorHourly || 85);
      const mats = Number(inputs.materialsCap || 150);

      const laborTotal = hrs * rate;
      const combinedTotal = laborTotal + mats;

      return {
        results: [
          { label: 'Estimated Repair Cost', value: combinedTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Contractor Labor Total', value: laborTotal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'maintenance-planner-home',
    name: 'Yearly Home Maintenance Reserve Planner',
    slug: 'maintenance-planner-home',
    category: 'home-services',
    description: 'Budget yearly home maintenance and repair reserves based on structural age and replacement values.',
    formula: 'Maintenance Reserve = Home Value * Age multiplier (1% to 2.5% safe range)',
    explanation: 'Helps homeowners plan maintenance reserves, preventing surprise repair costs and preserving property values.',
    example: 'Budgeting maintenance for a 15-year-old home valued at $320,000.',
    inputs: [
      { id: 'homeEquityVal', label: 'Current Home Purchase/Market Value ($)', type: 'number', defaultValue: 320000, min: 1000 },
      { id: 'buildingAgeY', label: 'Age of Home Structural building (Years)', type: 'number', defaultValue: 15, min: 0, max: 200 }
    ],
    faq: [
      { question: 'Why does a home\'s age affect maintenance reserves?', answer: 'Older homes require regular maintenance because major components (like roofs and plumbing) wear out and need replacement.' }
    ],
    relatedSlugs: ['cleaning-cost', 'repair-cost'],
    seoTitle: 'Annual Home Maintenance Reserve & repairs Budget Planner',
    seoDescription: 'Determine annual budget reserves for home repairs. Set aside monthly maintenance funds based on property age.',
    calculate: (inputs) => {
      const val = Number(inputs.homeEquityVal || 320000);
      const age = Number(inputs.buildingAgeY || 15);

      // set safer multiplier based on building age
      let mult = 0.01; // 1% for modern builds
      if (age > 10) mult = 0.015;
      if (age > 25) mult = 0.025;

      const annualRefFund = val * mult;
      const monthlyFund = annualRefFund / 12;

      return {
        results: [
          { label: 'Recommended Annual Reserve', value: annualRefFund.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Monthly Savings Target', value: monthlyFund.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'utility-cost',
    name: 'Household Electricity & Water Utility Forecaster',
    slug: 'utility-cost',
    category: 'home-services',
    description: 'Forecast monthly electricity, water, and gas utility bills based on house size and thermostat ranges.',
    formula: 'Utility bill = Base municipal charge + Area sqft * comfort factor',
    explanation: 'Estimates utility costs, helping households budget and identify potential energy savings.',
    example: 'A standard 1,200 sqft apartment during hot summer utility billing cycles.',
    inputs: [
      { id: 'apartmentSqft', label: 'Affected Living Area Size (SqFt)', type: 'number', defaultValue: 1200, min: 100 },
      { id: 'seasonProfile', label: 'Climate / Seasons Profile', type: 'select', defaultValue: 'summer', options: [
        { label: 'Hot Summer AC Peaks (heavy load)', value: 'summer' },
        { label: 'Mild Spring/Autumn (moderate load)', value: 'spring' }
      ]}
    ],
    faq: [
      { question: 'How is physical household utility usage minimized?', answer: 'Minimize utility bills by using LED lighting, sealing window leaks, and setting smart thermostats to energy-saving temperatures.' }
    ],
    relatedSlugs: ['cleaning-cost', 'maintenance-planner-home'],
    seoTitle: 'Household Utility Cost & Smart Thermostat bill Forecast',
    seoDescription: 'Forecast monthly electricity and water utility bills. Estimate household utility costs based on square footage.',
    calculate: (inputs) => {
      const size = Number(inputs.apartmentSqft || 1200);
      const season = inputs.seasonProfile || 'summer';

      const baseMunicipalCharge = 45;
      let ratePerSqft = 0.08; // moderate spring/autumn rate
      if (season === 'summer') ratePerSqft = 0.15; // summer AC peak rate

      const totalBillVal = baseMunicipalCharge + (size * ratePerSqft);

      return {
        results: [
          { label: 'Projected Monthly utility Bill', value: totalBillVal.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Base Municipal Callout portion', value: baseMunicipalCharge.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'home-services-misc',
    name: 'Landscaping & Home Services Sizer',
    slug: 'home-services-misc',
    category: 'home-services',
    description: 'Estimate landscaping, roofing, and general contractor support fees based on hourly paces and area size.',
    formula: 'Cost = Area sizes * Lawn rate + Callout overhead',
    explanation: 'Estimates landscaper and project services fees, helping you plan structural gardening budgets.',
    example: 'Mowing a 3,500 sqft residential back yard.',
    inputs: [
      { id: 'yardSqft', label: 'Total Yard Lawn Area Size (SqFt)', type: 'number', defaultValue: 3500, min: 100 }
    ],
    faq: [
      { question: 'Why does landscaping cost vary?', answer: 'Sloped yards, dense shrubbery, and premium sod require more labor and specialized equipment, increasing landscaping costs.' }
    ],
    relatedSlugs: ['cleaning-cost', 'repair-cost'],
    seoTitle: 'Landscaping Sod & Lawn Mowing Project Service Sizer',
    seoDescription: 'Estimate landscaping and lawn mowing service costs. Sizer project contractor budgets based on yard size.',
    calculate: (inputs) => {
      const size = Number(inputs.yardSqft || 3500);

      const baseCalloutOverhead = 50;
      const lawnMowingRateSqft = 0.012; // 1.2 cents per sqft
      const totalSodMowCost = baseCalloutOverhead + (size * lawnMowingRateSqft);

      return {
        results: [
          { label: 'Estimated Mowing Service Cost', value: totalSodMowCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Mowing labor portion', value: (size * lawnMowingRateSqft).toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },

  // ====================================== FASHION & LIFESTYLE ======================================
  {
    id: 'clothing-size',
    name: 'International Clothing Size translator',
    slug: 'clothing-size',
    category: 'fashion-lifestyle',
    description: 'Translate clothing sizes across US, UK, EU, and Asian benchmarks based on measurements.',
    formula: 'Size = Chest measurement translated to target country grid',
    explanation: 'Helps shoppers buy apparel internationally, preventing sizing errors and shipping returns.',
    example: 'A US chest size of 40 inches translates to an EU size 50 jacket.',
    inputs: [
      { id: 'chestInches', label: 'Chest Circumference Measurement (Inches)', type: 'number', defaultValue: 40, min: 20, max: 65 }
    ],
    faq: [
      { question: 'Why do sizes vary internationally?', answer: 'Sizing standards are managed by regional trade bodies, meaning sizes vary (e.g., EU sizes are typically 10 digits higher than US values).' }
    ],
    relatedSlugs: ['fabric-calc', 'fashion-budget'],
    seoTitle: 'US, UK, EU, Japanese International Clothing Size translator',
    seoDescription: 'Translate clothing sizes across US, UK, EU, and Japanese benchmarks based on physical measurements.',
    calculate: (inputs) => {
      const inches = Number(inputs.chestInches || 40);

      // simple apparel translation tables
      const usSize = inches >= 44 ? 'XL' : inches >= 40 ? 'L' : inches >= 36 ? 'M' : 'S';
      const euSizeNum = Math.round(inches * 1.25); // simple approximation multiplier

      return {
        results: [
          { label: 'US Sizing Category', value: usSize, isPrimary: true },
          { label: 'Estimated EU Jacket Size', value: `Size ${euSizeNum}`, isPrimary: true },
          { label: 'Approximate Chest (cm)', value: `${Math.round(inches * 2.54)} cm` }
        ]
      };
    }
  },
  {
    id: 'fabric-calc',
    name: 'DIY Sewing Fabric & drape Yardage Sizer',
    slug: 'fabric-calc',
    category: 'fashion-lifestyle',
    description: 'Calculate required fabric yardage based on design type and surface dimensions.',
    formula: 'Fabric Yardage = (Surface Length * Width) / (Single bolt Fabric Width)',
    explanation: 'Helps sewing enthusiasts and decorators estimate fabric requirements, minimizing design waste.',
    example: 'Draping a tablecloth of 110 inches length.',
    inputs: [
      { id: 'curtainLengthIn', label: 'Required Surface Length (Inches)', type: 'number', defaultValue: 110, min: 10 },
      { id: 'fabricBoltWidth', label: 'Fabric Bolt Width standard (Inches)', type: 'select', defaultValue: '54', options: [
        { label: 'Heavy upholstery Bolt (54" Wide)', value: '54' },
        { label: 'Standard sewing craft Bolt (45" Wide)', value: '45' }
      ]}
    ],
    faq: [
      { question: 'Why add a sewing seam allowance?', answer: 'Seam allowances ensure sewing templates fit precisely without running short during assembly.' }
    ],
    relatedSlugs: ['clothing-size', 'wardrobe-cost'],
    seoTitle: 'DIY Apparel Drapery & Sewing Fabric Yardage Sizer',
    seoDescription: 'Calculate curtain and sewing fabric yardage. Track sewing requirements based on standard bolt widths.',
    calculate: (inputs) => {
      const len = Number(inputs.curtainLengthIn || 110);
      const width = Number(inputs.fabricBoltWidth || 54);

      const seamBuffer = len * 0.12; // add 12% for stitching seam allowances
      const finalInchesTotal = len + seamBuffer;
      const yardsNeeded = finalInchesTotal / 36; // 36 inches in 1 yard of fabric

      return {
        results: [
          { label: 'Required Fabric Yards', value: `${yardsNeeded.toFixed(2)} Yards`, isPrimary: true },
          { label: 'Total Inches Needed (with seam)', value: `${finalInchesTotal.toFixed(1)} inches`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'fashion-budget',
    name: 'Seasonal Wardrobe budget tracker',
    slug: 'fashion-budget',
    category: 'fashion-lifestyle',
    description: 'Track seasonal wardrobe budgets, budgeting expenses based on prioritize shopping desires.',
    formula: 'Available balance = Seasonal Limit - Spent items total',
    explanation: 'Helps shoppers track shopping budgets, preventing duplicate purchases and promoting sustainable shopping.',
    example: 'Budgeting $800 for summer fashion items.',
    inputs: [
      { id: 'seasonalLimit', label: 'Seasonal Fashion Budget ($)', type: 'number', defaultValue: 800, min: 10 }
    ],
    faq: [
      { question: 'Why maintain shopping records?', answer: 'Tracking shopping budgets prevents duplicate purchases, helping you build high-quality wardrobes within budget limits.' }
    ],
    relatedSlugs: ['wardrobe-cost', 'clothing-size'],
    seoTitle: 'Seasonal Clothing Shopping & Fashion Budget Tracker',
    seoDescription: 'Track seasonal wardrobe budgets. Plan retail shopping limits to curb impulse buying.',
    calculate: (inputs) => {
      const topLimit = Number(inputs.seasonalLimit || 800);

      const essentialsCap = topLimit * 0.60;
      const statementAccessories = topLimit * 0.40;

      return {
        results: [
          { label: 'Essentials Budget Portion (60%)', value: essentialsCap.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Accessories Budget Portion (40%)', value: statementAccessories.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'wardrobe-cost',
    name: 'Cost-Per-Wear (CPW) Luxury Item Sizer',
    slug: 'wardrobe-cost',
    category: 'fashion-lifestyle',
    description: 'Calculate Cost-Per-Wear (CPW) of luxury items based on purchase price and wearing frequency.',
    formula: 'Cost Per Wear (CPW) = Purchase Price / Times Worn',
    explanation: 'Measures clothing cost-efficiencies over time, helping shoppers evaluate fashion purchases.',
    example: 'A $300 luxury wool coat worn 60 times drops to a highly efficient $5 per wear.',
    inputs: [
      { id: 'itemPrice', label: 'Luxury Item Purchase Price ($)', type: 'number', defaultValue: 300, min: 1 },
      { id: 'timesWornYear', label: 'Expected Times Worn per Year', type: 'number', defaultValue: 60, min: 1 }
    ],
    faq: [
      { question: 'Does high price always mean low efficiency?', answer: 'Not always! High-quality classic apparel (like boots or jackets) can deliver lower Cost-Per-Wear than cheap fast-fashion alternatives.' }
    ],
    relatedSlugs: ['fashion-budget', 'clothing-size'],
    seoTitle: 'Cost-Per-Wear (CPW) Luxury Fashion Sizing Calculator',
    seoDescription: 'Calculate the Cost-Per-Wear of luxury clothing. Evaluate clothing value and justify premium purchases.',
    calculate: (inputs) => {
      const pr = Number(inputs.itemPrice || 300);
      const times = Number(inputs.timesWornYear || 60);

      const cpw = pr / times;

      return {
        results: [
          { label: 'Cost-Per-Wear (CPW)', value: cpw.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Expected 2-Year CPM Value', value: (pr / (times * 2)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true }
        ]
      };
    }
  },

  // ====================================== SPORTS ANALYTICS ======================================
  {
    id: 'sports-pace',
    name: 'Running Pace, Distance & time Calculator',
    slug: 'sports-pace',
    category: 'sports',
    description: 'Calculate athlete running paces (min/mile, min/km) based on workout distance and duration.',
    formula: 'Pace = Total Duration / Total Distance',
    explanation: 'Models running paces and speed profiles, helping athletes target race goals.',
    example: 'Running a 5k (3.1 miles) in 24 minutes requires a steady 7:44 min/mile pace.',
    inputs: [
      { id: 'distanceTargetMiles', label: 'Workout Distance (Miles)', type: 'number', defaultValue: 3.1, min: 0.1, step: 0.1 },
      { id: 'durationMins', label: 'Workout Duration (Minutes)', type: 'number', defaultValue: 24, min: 1 }
    ],
    faq: [
      { question: 'Why pace run metrics?', answer: 'Pacing prevents early fatigue, helping runners manage energy and hit performance targets safely.' }
    ],
    relatedSlugs: ['sports-heart-rate', 'fitness-1rm'],
    seoTitle: 'Athlete Running Pace Speed, Distance & duration Calculator',
    seoDescription: 'Calculate athlete running and cycling paces. Model target split speeds based on workout miles.',
    calculate: (inputs) => {
      const d = Number(inputs.distanceTargetMiles || 3.1);
      const mins = Number(inputs.durationMins || 24);

      const totalSec = mins * 60;
      const secPerMile = totalSec / d;

      const paceMins = Math.floor(secPerMile / 60);
      const paceSecs = Math.round(secPerMile % 60);
      const paceString = `${paceMins}:${paceSecs.toString().padStart(2, '0')} min/mile`;

      const speedMph = d / (mins / 60);

      return {
        results: [
          { label: 'Workout Running Pace', value: paceString, isPrimary: true },
          { label: 'Average Travel Speed', value: `${speedMph.toFixed(2)} mph`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'sports-heart-rate',
    name: 'Karvonen Target Heart Rate Zone Planner',
    slug: 'sports-heart-rate',
    category: 'sports',
    description: 'Calculate personalized target heart rate zones using the Karvonen formula based on age and resting heart rate.',
    formula: 'Target HR = [(HRmax - HRresting) * Intensity %] + HRresting\nWhere HRmax = 220 - Age.',
    explanation: 'Models custom workout zones to help athletes target fitness and cardiovascular endurance goals.',
    example: 'A 30-year-old athlete with a resting heart rate of 62 bpm targeting cardio health.',
    inputs: [
      { id: 'athleteAge', label: 'Your Age (Years)', type: 'number', defaultValue: 30, min: 5, max: 100 },
      { id: 'restingHr', label: 'Resting Heart Rate (bpm)', type: 'number', defaultValue: 62, min: 30, max: 120 }
    ],
    faq: [
      { question: 'Why use resting heart rate in calculations?', answer: 'The Karvonen formula incorporates Heart Rate Reserve (HRR) to tailor training zones to your current cardiovascular fitness level.' }
    ],
    relatedSlugs: ['sports-pace', 'fitness-1rm'],
    seoTitle: 'Karvonen Target Heart Rate Training Zones Calculator',
    seoDescription: 'Calculate target heart rate training zones. Tailor cardiovascular exercises based on resting pulse rates easily.',
    calculate: (inputs) => {
      const age = Number(inputs.athleteAge || 30);
      const rHr = Number(inputs.restingHr || 62);

      const maxHr = 220 - age;
      const hrr = maxHr - rHr; // Heart Rate Reserve

      // Cardio Zone: 70% to 85% intensity
      const lowerHr = (hrr * 0.70) + rHr;
      const upperHr = (hrr * 0.85) + rHr;

      return {
        results: [
          { label: 'Cardio Training Zone', value: `${Math.round(lowerHr)} - ${Math.round(upperHr)} bpm`, isPrimary: true },
          { label: 'Max Calculated Heart Rate', value: `${maxHr} bpm`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'sports-batting-avg',
    name: 'Baseball Batting Average & Stats Sizer',
    slug: 'sports-batting-avg',
    category: 'sports',
    description: 'Calculate baseball batting averages and hitting statistics based on plate appearances.',
    formula: 'Batting Average (BA) = Total Hits / Official At Bats',
    explanation: 'Standard sports statistics metric evaluating baseball player performance and hitting efficiency.',
    example: 'An player returning 45 hits in 150 official at bats.',
    inputs: [
      { id: 'atBats', label: 'Official At-Bats Count', type: 'number', defaultValue: 150, min: 1 },
      { id: 'hitsCount', label: 'Total Base Hits Secured', type: 'number', defaultValue: 45, min: 0 }
    ],
    faq: [
      { question: 'What is a strong batting average?', answer: 'A batting average of .300 or above is widely considered excellent in major league professional baseball leagues.' }
    ],
    relatedSlugs: ['sports-pace', 'sports-heart-rate'],
    seoTitle: 'Baseball Player Batting Average Hits Sizer',
    seoDescription: 'Calculate player batting statistics. Convert hits and at-bats into batting averages easily.',
    calculate: (inputs) => {
      const bats = Number(inputs.atBats || 150);
      const hits = Math.min(bats, Number(inputs.hitsCount || 45));

      const avgVal = hits / bats;

      return {
        results: [
          { label: 'Batting Average Rating', value: avgVal.toFixed(3), isPrimary: true },
          { label: 'Current Strike Out Ratio', value: `${((1 - avgVal) * 100).toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'sports-score-tracker',
    name: 'Team Win Margin Statistics Tracker',
    slug: 'sports-score-tracker',
    category: 'sports',
    description: 'Track sports match point scoring and calculate average win margins.',
    formula: 'Win Margin = Score Team A - Score Team B',
    explanation: 'Help coaches and analysts review competitive score margins across league matches.',
    example: 'Home team scoring 98 points while allowing the visitor team 85.',
    inputs: [
      { id: 'homeScore', label: 'Home Team Scoring points', type: 'number', defaultValue: 98, min: 0 },
      { id: 'visitorScore', label: 'Visitor Team Scoring points', type: 'number', defaultValue: 85, min: 0 }
    ],
    faq: [
      { question: 'Why track point spread dynamics?', answer: 'Analyzing point spreads reveals defensive and offensive capabilities across league competitive standings.' }
    ],
    relatedSlugs: ['sports-pace', 'sports-batting-avg'],
    seoTitle: 'Team Scoring Point Spread Win Margin Calculator',
    seoDescription: 'Evaluate team competitive margins. Convert home and visitor points into a point-spread rating easily.',
    calculate: (inputs) => {
      const h = Number(inputs.homeScore || 98);
      const v = Number(inputs.visitorScore || 85);

      const margin = h - v;
      const winString = margin > 0 ? `Home Win by ${margin}` : margin < 0 ? `Visitor Win by ${Math.abs(margin)}` : 'Tie Match';

      return {
        results: [
          { label: 'Match Winning margin', value: winString, isPrimary: true },
          { label: 'Raw point spread', value: `${margin >= 0 ? '+' : ''}${margin}` }
        ]
      };
    }
  },
  {
    id: 'fitness-1rm',
    name: 'One-Rep Max (1RM) Sports Sizer',
    slug: 'fitness-1rm',
    category: 'sports',
    description: 'Estimate your theoretical One-Rep Max (1RM) for weightlifting using the Epley formula.',
    formula: '1RM = w * (1 + r / 30)\nWhere w is lift weight, r is repetitions count.',
    explanation: 'Standard exercise physiology equation estimating maximal strength without lifting heavy loads directly.',
    example: 'Bench pressing 225 lbs for 5 repetitions yields a theoretical 1RM of 262.5 lbs.',
    inputs: [
      { id: 'liftWeightLbs', label: 'Lift Exercise Weight (lbs)', type: 'number', defaultValue: 185, min: 1 },
      { id: 'repCount', label: 'Completed Repetitions (Reps)', type: 'number', defaultValue: 6, min: 1, max: 20 }
    ],
    faq: [
      { question: 'Is the 1RM estimate accurate?', answer: '1RM estimates are highly accurate for sub-maximal repetitions (between 3 and 8 reps), though predictions become less reliable as repetitions exceed 10.' }
    ],
    relatedSlugs: ['sports-pace', 'sports-heart-rate'],
    seoTitle: 'One-Rep Max (1RM) Weightlifting strength Calculator',
    seoDescription: 'Estimate your lifting One-Rep Max using the Epley formula. Calculate strength limits safely based on repetitions.',
    calculate: (inputs) => {
      const w = Number(inputs.liftWeightLbs || 185);
      const r = Number(inputs.repCount || 6);

      const max1rm = w * (1 + r / 30);

      return {
        results: [
          { label: 'One-Rep Max (1RM)', value: `${max1rm.toFixed(1)} lbs`, isPrimary: true },
          { label: '85% Training Load Target', value: `${(max1rm * 0.85).toFixed(1)} lbs`, isPrimary: true },
          { label: '70% Hypertrophy Load Target', value: `${(max1rm * 0.70).toFixed(1)} lbs` }
        ]
      };
    }
  },

  // ====================================== GAMING ======================================
  {
    id: 'gaming-xp',
    name: 'Gaming RPG Character XP Sizer',
    slug: 'gaming-xp',
    category: 'gaming',
    description: 'Calculate experience points (XP) required to level up based on standard exponential curves.',
    formula: 'XP Required = Base XP * (Skill Level ^ exponent)',
    explanation: 'Models progression difficulty in RPG and MMO games, revealing leveling requirements.',
    example: 'An MMORPG level 12 challenge requiring an standard 1.5x exponent curve.',
    inputs: [
      { id: 'targetLevel', label: 'Target level of Character', type: 'number', defaultValue: 12, min: 1 },
      { id: 'baseXp', label: 'Difficulty Base XP (Level 1 req)', type: 'number', defaultValue: 1000, min: 100 },
      { id: 'exponentRate', label: 'Progression Curve Exponent Rate (e.g., 1.5)', type: 'number', defaultValue: 1.5, min: 1.0, max: 2.5, step: 0.1 }
    ],
    faq: [
      { question: 'What is leveling progression?', answer: 'Leveling curves use exponential exponents to require more XP for each level, ensuring milestones feel rewarding.' }
    ],
    relatedSlugs: ['gaming-playtime', 'gaming-match-level'],
    seoTitle: 'RPG Gaming Character XP progression curve Calculator',
    seoDescription: 'Project gaming character experience goals. Sizer required leveling levels based on curve exponents.',
    calculate: (inputs) => {
      const target = Number(inputs.targetLevel || 12);
      const base = Number(inputs.baseXp || 1000);
      const exponent = Number(inputs.exponentRate || 1.5);

      const cumulativeRawXp = base * Math.pow(target, exponent);

      return {
        results: [
          { label: 'Required XP to reach Level', value: Math.ceil(cumulativeRawXp).toLocaleString(), isPrimary: true },
          { label: 'Target level selected', value: `Level ${target}`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'gaming-playtime',
    name: 'Game Level & playing Timeline estimator',
    slug: 'gaming-playtime',
    category: 'gaming',
    description: 'Calculate playing hours or total matches required to reach a target character level.',
    formula: 'Required Matches = Target level XP / Average XP earned per match',
    explanation: 'Estimates gaming time and matchups required to reach your target character level.',
    example: 'Reaching a 25,000 XP tier by averaging 450 XP per standard competitive match.',
    inputs: [
      { id: 'requiredXp', label: 'Required XP for target level', type: 'number', defaultValue: 25000, min: 100 },
      { id: 'matchXpEarned', label: 'Average XP earned per Match', type: 'number', defaultValue: 450, min: 10 },
      { id: 'avgMatchMins', label: 'Average Match Duration (Minutes)', type: 'number', defaultValue: 15, min: 1 }
    ],
    faq: [
      { question: 'Why track match duration averages?', answer: 'Tracking match durations helps you estimate the playing hours needed to clear battlepasses and hit server tiers.' }
    ],
    relatedSlugs: ['gaming-xp', 'gaming-progress'],
    seoTitle: 'Schedules Gaming Match counts & hours Estimator',
    seoDescription: 'Estimate gaming match counts and playtimes. Calculate required matches to clear battlepasses based on average XP.',
    calculate: (inputs) => {
      const xp = Number(inputs.requiredXp || 25000);
      const earned = Number(inputs.matchXpEarned || 450);
      const mins = Number(inputs.avgMatchMins || 15);

      const matches = Math.ceil(xp / earned);
      const totalMinutes = matches * mins;
      const totalHours = totalMinutes / 60;

      return {
        results: [
          { label: 'Required Match counts', value: `${matches} matches`, isPrimary: true },
          { label: 'Total Gaming Playtime', value: `${totalHours.toFixed(1)} Hours`, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'gaming-playtime-tracker',
    name: 'Weekly Gaming Session Time tracker',
    slug: 'gaming-playtime-tracker',
    category: 'gaming',
    description: 'Track weekly playing hours and compare habits to general gaming populations.',
    formula: 'Playtime = Hours per Day * Session Days',
    explanation: 'Reviews weekly gaming hours, helping players balance screen times and lifestyles.',
    example: 'Playing 2.5 hours daily across 4 days in a week.',
    inputs: [
      { id: 'hoursDaily', label: 'Average Gaming Hours per Day (Hours)', type: 'number', defaultValue: 2.5, min: 0.1, step: 0.1 },
      { id: 'sessionDays', label: 'Session Days per Week (Days)', type: 'number', defaultValue: 4, min: 1, max: 7 }
    ],
    faq: [
      { question: 'What is a balanced gaming schedule?', answer: 'Health departments recommend keeping leisure screen schedules under 2 hours daily to maintain sleep quality and physical health.' }
    ],
    relatedSlugs: ['gaming-playtime', 'gaming-xp'],
    seoTitle: 'Weekly Gaming Screen Time habits Tracker',
    seoDescription: 'Track weekly gaming hours. Compare active playtimes to recommend healthy leisure limits.',
    calculate: (inputs) => {
      const h = Number(inputs.hoursDaily || 2.5);
      const days = Number(inputs.sessionDays || 4);

      const weekly = h * days;
      let ranking = 'Casual Gamer';
      if (weekly > 25) ranking = 'Heavy Enthusiast Gamer';
      else if (weekly >= 12) ranking = 'Standard Hobbyist';

      return {
        results: [
          { label: 'Weekly Active Playtime', value: `${weekly} Hours/Week`, isPrimary: true },
          { label: 'Player Habits Category', value: ranking, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'gaming-progress',
    name: 'RPG Achievement & Achievements progress Sizer',
    slug: 'gaming-progress',
    category: 'gaming',
    description: 'Track trophy collections and achievements progress milestones.',
    formula: 'Achievement Progress = (Collected Trophies / Total curried Trophies) * 100',
    explanation: 'Tracks game achievement progress percentage, helping completionist players target 100% completions.',
    example: 'Collecting 15 out of 45 campaign achievements.',
    inputs: [
      { id: 'collectedTrophies', label: 'Collected Achievements', type: 'number', defaultValue: 15, min: 0 },
      { id: 'totalTrophies', label: 'Total Achievements in Game', type: 'number', defaultValue: 45, min: 1 }
    ],
    faq: [
      { question: 'What is a completionist run?', answer: 'A completionist run involves collecting every trophy, finding all collectibles, and completing all side quests in a game.' }
    ],
    relatedSlugs: ['gaming-xp', 'gaming-playtime'],
    seoTitle: 'RPG Gaming Trophies Completion progress Checklist',
    seoDescription: 'Track gaming achievement progress. Calculate completion percentages for trophy collections.',
    calculate: (inputs) => {
      const col = Number(inputs.collectedTrophies || 15);
      const tot = Number(inputs.totalTrophies || 45);

      const pct = (col / tot) * 100;

      return {
        results: [
          { label: 'Completion Progress', value: `${pct.toFixed(1)}%`, isPrimary: true },
          { label: 'Trophies Remaining', value: tot - col, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'gaming-dps',
    name: 'Gaming RPG Damage & DPS Score Sizer',
    slug: 'gaming-dps',
    category: 'gaming',
    description: 'Calculate average DPS (Damage Per Second) and raw impact damage based on stats (Basic damage, crit chance %, and crit multiplier).',
    formula: 'Average Hit = Base Damage * (1 + Crit Chance % * Crit Multiplier)',
    explanation: 'Standard math used by game developers and min-max analysts to optimize weapon stats and talent specs.',
    example: 'An MMORPG weapon with 150 base damage, 25% crit chance, and a 2.0x crit multiplier.',
    inputs: [
      { id: 'baseDamageUnit', label: 'Weapon / Skill Base Damage', type: 'number', defaultValue: 150, min: 1 },
      { id: 'critChancePct', label: 'Critical Hit Chance Percentage (%)', type: 'number', defaultValue: 25, min: 0, max: 100 },
      { id: 'critMultiplierVal', label: 'Critical Damage Multiplier (e.g., 2.0 for double damage)', type: 'number', defaultValue: 2.0, min: 1.0, max: 5.0, step: 0.1 }
    ],
    faq: [
      { question: 'What is DPS optimization?', answer: 'DPS optimization involves balancing speed, accuracy, and armor penetration to maximize your damage output during boss battles.' }
    ],
    relatedSlugs: ['gaming-xp', 'gaming-playtime'],
    seoTitle: 'Weapon Damage Per Second (DPS) RPG Min-Max Optimizer',
    seoDescription: 'Calculate weapon damage and average DPS. Model critical hit chances and damage multipliers easily.',
    calculate: (inputs) => {
      const base = Number(inputs.baseDamageUnit || 150);
      const crit = Number(inputs.critChancePct || 25) / 100;
      const mult = Number(inputs.critMultiplierVal || 2.0);

      const avgDamageSingle = base * (1 + (crit * (mult - 1)));
      const burstMaxDamage = base * mult;

      return {
        results: [
          { label: 'Average Attack Damage (DPS)', value: `${Math.round(avgDamageSingle)} dmg`, isPrimary: true },
          { label: 'Critical Hit Burst Damage', value: `${Math.round(burstMaxDamage)} dmg`, isPrimary: true }
        ]
      };
    }
  }
];
