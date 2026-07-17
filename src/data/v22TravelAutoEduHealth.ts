import { Calculator } from '../types';

export const V22_PART4_CALCULATORS: Calculator[] = [
  {
    id: 'gas-mileage-calculator',
    name: 'Gas Mileage Calculator',
    slug: 'gas-mileage-calculator',
    category: 'travel',
    description: 'Calculate fuel efficiency, gas mileage, trip costs, conversions, and analyze vehicle mileage logs.',
    formula: 'MPG = Distance / Fuel Used\nL/100km = (Fuel Used / Distance) * 100',
    explanation: 'Track operational costs, optimize road trip refueling milestones, and compare efficiency metrics.',
    example: 'A vehicle that travels 300 miles using 12 gallons of gas has a gas mileage of exactly 25 MPG.',
    inputs: [
      { id: 'odomStart', label: 'Starting Odometer', type: 'number', defaultValue: '', min: 0 },
      { id: 'odomEnd', label: 'Ending Odometer', type: 'number', defaultValue: '', min: 0 },
      { id: 'odomFuel', label: 'Fuel Added', type: 'number', defaultValue: '', min: 0 }
    ],
    faq: [
      { question: 'What is the difference between US and UK MPG?', answer: 'A US gallon is approximately 3.785 Liters, while a UK gallon is 4.546 Liters. Thus, UK MPG values are ~20% higher than US MPG for the same fuel efficiency.' }
    ],
    relatedSlugs: ['trip-fuel', 'car-depreciation'],
    seoTitle: 'Ultimate Gas Mileage & MPG Calculator | Calculatoora',
    seoDescription: 'Calculate gas mileage, convert between MPG, L/100km, km/L, analyze multi-vehicle comparisons, and manage an interactive mileage log completely offline.',
    calculate: (inputs) => {
      const start = Number(inputs.odomStart || 0);
      const end = Number(inputs.odomEnd || 0);
      const fuel = Number(inputs.odomFuel || 0);
      
      const dist = end > start ? end - start : 0;
      const mpg = fuel > 0 ? dist / fuel : 0;
      
      return {
        results: [
          { label: 'Distance Travelled', value: dist.toFixed(1) + ' Miles', isPrimary: true },
          { label: 'Gas Mileage', value: mpg.toFixed(1) + ' MPG' }
        ],
        chartData: [
          { name: 'Fuel Efficiency', value: mpg }
        ]
      };
    }
  },
  // ====================================== TRAVEL PLANNING ======================================
  {
    id: 'trip-fuel',
    name: 'Trip Fuel Calculator',
    slug: 'trip-fuel',
    category: 'travel',
    description: 'Calculate total trip fuel costs and required volumes based on distance, gas price, and vehicle parameters.',
    formula: 'Required Fuel = Distance / MPG\nTotal Gas Cost = Required Fuel * Price per Gallon',
    explanation: 'Sizes road trip budgets, assisting families and fleet logistics managers estimating fuel replenishment fees.',
    example: 'Driving a 450-mile route in a car that averages 30 MPG with fuel priced at $3.60/gallon costs exactly $54.00.',
    inputs: [
      { id: 'tripDist', label: 'Trip Distance (Miles)', type: 'number', defaultValue: 300, min: 1 },
      { id: 'mpgAvg', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 25, min: 5 },
      { id: 'gasCost', label: 'Fuel Price ($/Gallon)', type: 'number', defaultValue: 3.50, min: 0.5 }
    ],
    faq: [
      { question: 'Does highway driving improve MPG?', answer: 'Yes. Constant highway cruise speeds prevent standard city stop-and-go energy waste, significantly raising fuel economy.' }
    ],
    relatedSlugs: ['travel-budget', 'car-depreciation'],
    seoTitle: 'Road Trip Gas Price & MPG Expense Calculator',
    seoDescription: 'Forecast the net gas cost of driving long distances using custom vehicle fuel efficiency parameters.',
    calculate: (inputs) => {
      const dist = Number(inputs.tripDist || 300);
      const mpg = Number(inputs.mpgAvg || 25);
      const price = Number(inputs.gasCost || 3.50);
      
      const gallons = dist / mpg;
      const total = gallons * price;
      return {
        results: [
          { label: 'Estimated Fuel Bill', value: '$' + total.toFixed(2), isPrimary: true },
          { label: 'Required Fuel Volume', value: gallons.toFixed(1) + ' Gallons' },
          { label: 'Fuel cost per Mile driven', value: '$' + (total / dist).toFixed(3) }
        ],
        chartData: [
          { name: 'Fuel Expense', value: total }
        ]
      };
    }
  },
  {
    id: 'luggage-sizer',
    name: 'Luggage Linear Sizer',
    slug: 'luggage-sizer',
    category: 'travel',
    description: 'Verify suitcase linear dimensions and checking weights against major global airline baggage limits.',
    formula: 'Linear Dimensions = Length + Width + Height',
    explanation: 'Checks if custom carry-on suitcases fall within baggage sizing boxes at airport terminal gates.',
    example: 'A bag measuring 22" x 14" x 9" equals 45 linear inches, fully matching standard domestic carry-on limits.',
    inputs: [
      { id: 'lenIn', label: 'Suitcase Length (Inches)', type: 'number', defaultValue: 22, min: 1 },
      { id: 'widIn', label: 'Suitcase Width (Inches)', type: 'number', defaultValue: 14, min: 1 },
      { id: 'heiIn', label: 'Suitcase Height (Inches)', type: 'number', defaultValue: 9, min: 1 }
    ],
    faq: [
      { question: 'What are standard international linear limits?', answer: 'Most commercial airlines globally restrict checked suitcases to a maximum of 62 linear inches (158 cm) before imposing penalty fees.' }
    ],
    relatedSlugs: ['trip-fuel', 'travel-budget'],
    seoTitle: 'Airline Carry-on Carry Sizing Guide & Calculator',
    seoDescription: 'Find when your suitcases violate commercial airline sizing restricts by calculating linear inches.',
    calculate: (inputs) => {
      const l = Number(inputs.lenIn || 22);
      const w = Number(inputs.widIn || 14);
      const h = Number(inputs.heiIn || 9);
      
      const linear = l + w + h;
      const pass = linear <= 45; // standard domestic carry-on limit
      return {
        results: [
          { label: 'Total Linear Dimension', value: linear + ' Inches', isPrimary: true },
          { label: 'Carry-On Suitability', value: pass ? 'Approved / Fits' : 'FAIL - Over standard Carryon limits' },
          { label: 'Metric Equivalent', value: Math.round(linear * 2.54) + ' Linear cm' }
        ],
        chartData: [
          { name: 'Length', value: l },
          { name: 'Width', value: w },
          { name: 'Height', value: h }
        ]
      };
    }
  },
  {
    id: 'time-zone',
    name: 'Flight Time & Arrival Calculator',
    slug: 'time-zone',
    category: 'travel',
    description: 'Calculate target landing times and flight offsets across global UTC coordinate lines.',
    formula: 'Arrival Time (UTC) = Departure Time (UTC) + Flight Duration',
    explanation: 'Traces what time your friends and relatives are waking up in destination capitals, adjusting for localized flight times.',
    example: 'Boarding a 10-hour flight in New York (EST / UTC-5) at 1 PM lands in London (GMT / UTC+0) at exactly 4 AM local time.',
    inputs: [
      { id: 'flightDuration', label: 'Flight Duration (Hours)', type: 'number', defaultValue: 8, min: 1 },
      { id: 'departOffset', label: 'Departure Time Zone Offset (UTC)', type: 'number', defaultValue: -5, min: -12, max: 14 },
      { id: 'arrivalOffset', label: 'Arrival Time Zone Offset (UTC)', type: 'number', defaultValue: 1, min: -12, max: 14 }
    ],
    faq: [
      { question: 'What does UTC stand for?', answer: 'UTC is Coordinated Universal Time, the absolute standard clock scale that maps local time coordinates around the world.' }
    ],
    relatedSlugs: ['travel-budget', 'luggage-sizer'],
    seoTitle: 'Inter-continental Flight Arrival Offset Sizer',
    seoDescription: 'Project target destination landing times across worldwide meridian zone borders.',
    calculate: (inputs) => {
      const fd = Number(inputs.flightDuration || 8);
      const dep = Number(inputs.departOffset || -5);
      const arr = Number(inputs.arrivalOffset || 1);
      
      const netZoneShift = arr - dep;
      const clockHoursAdded = fd + netZoneShift;
      return {
        results: [
          { label: 'Clock Shift Hours', value: (clockHoursAdded > 0 ? '+' : '') + clockHoursAdded + ' hrs', isPrimary: true },
          { label: 'Net Meridian Shift', value: netZoneShift + ' zones' },
          { label: 'Arrival Status Recommendation', value: clockHoursAdded > 12 ? 'Severe Jetlag Risk' : 'Standard Flight Transition' }
        ],
        chartData: [
          { name: 'Flight elapsed', value: fd },
          { name: 'Meridian Shift', value: netZoneShift }
        ]
      };
    }
  },
  {
    id: 'travel-budget',
    name: 'Ultimate Travel Budget Sizer',
    slug: 'travel-budget',
    category: 'travel',
    description: 'Aggregate flight tickets, hotels, daily restaurant spends, and contingency margins to form detailed vacation budgets.',
    formula: 'Total Cost = Flight Cost + (Hotel Cost * Days) + (Daily Food * Days) + Activities + Contingency',
    explanation: 'Budgets recreational or company business travel, keeping spending within hard card brackets.',
    example: 'A 7-day vacation with $400 flights, $150/night lodging, and $80/day meal pools requires a grand total of $2,311 including reserves.',
    inputs: [
      { id: 'flightWw', label: 'Flight & Transits Tickets ($)', type: 'number', defaultValue: 450, min: 0 },
      { id: 'hotelRate', label: 'Nightly Hotel Lodging ($/Night)', type: 'number', defaultValue: 120, min: 0 },
      { id: 'daysCount', label: 'Trip Total Calendar Days', type: 'number', defaultValue: 7, min: 1 },
      { id: 'foodDaily', label: 'Daily Meals & Activities Allowance ($/day)', type: 'number', defaultValue: 90, min: 1 }
    ],
    faq: [
      { question: 'Why plan a travel contingency buffer?', answer: 'Always set aside 10-15% surplus budget. Unexpected taxi rates, dynamic tour price changes, and medical emergencies can arise on vacations.' }
    ],
    relatedSlugs: ['trip-fuel', 'time-zone'],
    seoTitle: 'Family Vacation & Business Travel Cost Sizer',
    seoDescription: 'Structure complete itinerary spending budgets by aggregating lodging, transits, and daily food allocations.',
    calculate: (inputs) => {
      const flight = Number(inputs.flightWw || 450);
      const hotel = Number(inputs.hotelRate || 120);
      const days = Number(inputs.daysCount || 7);
      const daily = Number(inputs.foodDaily || 90);
      
      const baseHotel = hotel * days;
      const baseFood = daily * days;
      const totalBase = flight + baseHotel + baseFood;
      const contingency = totalBase * 0.12; // 12% emergency fund
      const netExpense = totalBase + contingency;
      return {
        results: [
          { label: 'Total Trip Budget Required', value: '$' + Math.ceil(netExpense).toLocaleString(), isPrimary: true },
          { label: 'Total Base Lodging', value: '$' + baseHotel.toLocaleString() },
          { label: 'Emergency Reserve Buffer (12%)', value: '$' + Math.round(contingency).toLocaleString() }
        ],
        chartData: [
          { name: 'Transits/Flights', value: flight },
          { name: 'Hotels', value: baseHotel },
          { name: 'Food & Fun', value: baseFood },
          { name: 'Reserve', value: contingency }
        ]
      };
    }
  },
  {
    id: 'currency-sizer',
    name: 'Currency Markup Calculator',
    slug: 'currency-sizer',
    category: 'travel',
    description: 'Check true exchange values while factoring in credit card foreign transaction fees and banking service spreads.',
    formula: 'Effective cost = Local Price * Exchange Ratio * (1 + Transaction Fee %)',
    explanation: 'Avoid hidden exchange fees when browsing foreign boutiques or paying at restaurant card terminals abroad.',
    example: 'Buying a €100 jacket with a card charging a 3% foreign transaction fee on a 1.08 exchange rate costs exactly $111.24.',
    inputs: [
      { id: 'foreignPrice', label: 'Foreign Local Item Price Euro/Yen/etc', type: 'number', defaultValue: 120, min: 1 },
      { id: 'exchRate', label: 'Current Base Exchange rate (e.g. 1.09)', type: 'number', defaultValue: 1.09, min: 0.01, step: 0.01 },
      { id: 'bankFee', label: 'Credit Card Foreign Transaction Fee (%)', type: 'select', defaultValue: 3, options: [
        { label: 'No transaction fee (0%)', value: 0 },
        { label: 'Standard travel card (1.5%)', value: 1.5 },
        { label: 'Basic consumer debit card (3.0%)', value: 3.0 }
      ]}
    ],
    faq: [
      { question: 'Should you pay in home currency at local ATMs?', answer: 'No. Dynamic Currency Conversion (DCC) lets local ATMs set their own predatory processing markups. Always choose local currencies.' }
    ],
    relatedSlugs: ['travel-budget', 'time-zone'],
    seoTitle: 'Foreign Card Transaction Fee & Conversion Calculator',
    seoDescription: 'Calculate true retail exchange costs by modeling base conversion rates against bank card transaction markups.',
    calculate: (inputs) => {
      const price = Number(inputs.foreignPrice || 120);
      const ex = Number(inputs.exchRate || 1.09);
      const fee = Number(inputs.bankFee || 3) / 100;
      
      const baseHomeValue = price * ex;
      const bankCut = baseHomeValue * fee;
      const finalCost = baseHomeValue + bankCut;
      return {
        results: [
          { label: 'Effective Home Currency Cost', value: '$' + finalCost.toFixed(2), isPrimary: true },
          { label: 'Financial FX Markup Sizer', value: '$' + bankCut.toFixed(2) },
          { label: 'Base Exchange Conversion', value: '$' + baseHomeValue.toFixed(2) }
        ],
        chartData: [
          { name: 'Exchanged Value', value: baseHomeValue },
          { name: 'Bank Card Spread', value: bankCut }
        ]
      };
    }
  },

  // ====================================== AUTOMOTIVE ======================================
  {
    id: 'car-depreciation',
    name: 'Car Depreciation Calculator',
    slug: 'car-depreciation',
    category: 'automotive',
    description: 'Project vehicle residual value drops over a 10-year period using brand decay curves.',
    formula: 'Residual Value = Initial Price * (1 - Annual Decay Rate) ^ Years',
    explanation: 'Tracks how quickly new cars lose value after leaving dealer lots, helping you compare different vehicle classes.',
    example: 'Buying a new $45,000 sports car results in a residual value of around $18,432 after five years of average mileage.',
    inputs: [
      { id: 'carPrice', label: 'Vehicle Purchase Price ($)', type: 'number', defaultValue: 35000, min: 1000, step: 1000 },
      { id: 'decayProfile', label: 'Vehicle Class Decay Profile', type: 'select', defaultValue: 15, options: [
        { label: 'Reliable Commuter Sedans (~12% annual drop)', value: 12 },
        { label: 'Standard Trucks / SUVs (~15% annual drop)', value: 15 },
        { label: 'Luxury Sports cars (~22% annual drop)', value: 22 }
      ]}
    ],
    faq: [
      { question: 'At what year does depreciation slow down?', answer: 'The sharpest drop occurs in Years 1-3. By Year 5, cars stabilize, dropping to lower single-digit annual decays.' }
    ],
    relatedSlugs: ['vehicle-leasing', 'trip-fuel'],
    seoTitle: 'Used Automobile Residual Value & Depreciation Calculator',
    seoDescription: 'Forecast Used car value drops over a 10-year model timeline by tracking different vehicle class decay rates.',
    calculate: (inputs) => {
      const price = Number(inputs.carPrice || 35000);
      const drop = Number(inputs.decayProfile || 15) / 100;
      
      const yr1 = price * (1 - drop);
      const yr5 = price * Math.pow(1 - drop, 5);
      const yr10 = price * Math.pow(1 - drop, 10);
      return {
        results: [
          { label: 'Value after 5 Years', value: '$' + Math.round(yr5).toLocaleString(), isPrimary: true },
          { label: 'Value after 1 Year', value: '$' + Math.round(yr1).toLocaleString() },
          { label: 'Value after 10 Years', value: '$' + Math.round(yr10).toLocaleString() }
        ],
        chartData: [
          { name: 'MSRP Base', value: price },
          { name: 'Year 1 Value', value: yr1 },
          { name: 'Year 5 Value', value: yr5 },
          { name: 'Year 10 Value', value: yr10 }
        ]
      };
    }
  },
  {
    id: 'vehicle-leasing',
    name: 'Vehicle Lease Payment Calculator',
    slug: 'vehicle-leasing',
    category: 'automotive',
    description: 'Calculate monthly vehicle lease payments based on money factors, capitalized costs, and residual values.',
    formula: 'Monthly Base = (Cap Cost - Residual) / Term + (Cap Cost + Residual) * Money Factor',
    explanation: 'De-mystifies dealership finance desks. Confirms the real interest rate buried inside vehicle lease sheets.',
    example: 'Leasing a $40,000 truck with a $24,000 residual on a 36-month term with a 0.0025 money factor costs exactly $604 monthly.',
    inputs: [
      { id: 'grossPrice', label: 'Cap Cost / Capitalized Price ($)', type: 'number', defaultValue: 38000, min: 2000 },
      { id: 'residualAmt', label: 'Dealer Guaranteed Residual Value ($)', type: 'number', defaultValue: 22000, min: 1000 },
      { id: 'leaseTerm', label: 'Lease Duration (Months)', type: 'number', defaultValue: 36, min: 12, max: 84 },
      { id: 'moneyFactor', label: 'Money Factor (decimal interest score)', type: 'number', defaultValue: 0.0025, min: 0.0001, max: 0.01, step: 0.0001 }
    ],
    faq: [
      { question: 'How is a Money Factor converted to APR?', answer: 'Convert a money factor back to standard APR interest percentages by multiplying the money factor decimal by exactly 2400.' }
    ],
    relatedSlugs: ['car-depreciation', 'trip-fuel'],
    seoTitle: 'Dealership Lease Monthly Payment Sizer',
    seoDescription: 'Verify monthly car lease payments using capitalized vehicle purchase prices and MONEY FACTOR interest ratios.',
    calculate: (inputs) => {
      const cap = Number(inputs.grossPrice || 38000);
      const res = Number(inputs.residualAmt || 22000);
      const term = Number(inputs.leaseTerm || 36);
      const mf = Number(inputs.moneyFactor || 0.0025);
      
      const depreciationCharge = (cap - res) / term;
      const financeCharge = (cap + res) * mf;
      const monthlyPmt = depreciationCharge + financeCharge;
      return {
        results: [
          { label: 'Estimated Monthly Lease', value: '$' + monthlyPmt.toFixed(2), isPrimary: true },
          { label: 'Interest Charge portion', value: '$' + financeCharge.toFixed(2) },
          { label: 'Sizer APR Equivalent', value: (mf * 2400).toFixed(2) + '%' }
        ],
        chartData: [
          { name: 'Depreciation Portion', value: depreciationCharge },
          { name: 'Finance Charge', value: financeCharge }
        ]
      };
    }
  },
  {
    id: 'tire-size',
    name: 'Tire Size Comparison Calculator',
    slug: 'tire-size',
    category: 'automotive',
    description: 'Calculate and compare tire dimensions, sidewall heights, speedometers differences, and total diameters.',
    formula: 'Sidewall Height = Width * Aspect Ratio\nDiameter (in) = Rim Diameter + (2 * Sidewall / 25.4)',
    explanation: 'Decodes numerical codes on tire walls (e.g., 245/40 R18), validating fitment clearances before you purchase custom aftermarket wheel sets.',
    example: 'A 245/40 R18 tire features a 25.7-inch total diameter with a sidewall height measuring 3.86 inches.',
    inputs: [
      { id: 'widthMm', label: 'Tire Section Width (mm)', type: 'number', defaultValue: 225, min: 125, max: 355 },
      { id: 'aspectRatio', label: 'Sidewall Aspect Ratio (%)', type: 'number', defaultValue: 45, min: 20, max: 90 },
      { id: 'rimDiameter', label: 'Rim Wheel Diameter (Inches)', type: 'number', defaultValue: 17, min: 10, max: 26 }
    ],
    faq: [
      { question: 'What does Aspect Ratio represent?', answer: 'The aspect ratio is the percentage of the tire\'s width that determines how tall the sidewall extends from the metal wheel rim.' }
    ],
    relatedSlugs: ['car-depreciation', 'engine-displacement'],
    seoTitle: 'Wheel Tire Diameter & Rim Clearance Sizer',
    seoDescription: 'Decode tire codes and calculate aggregate tire diameters, sidewall heights, and rolling circumferences.',
    calculate: (inputs) => {
      const w = Number(inputs.widthMm || 225);
      const rat = Number(inputs.aspectRatio || 45) / 100;
      const rim = Number(inputs.rimDiameter || 17);
      
      const sidewallMm = w * rat;
      const sidewallIn = sidewallMm / 25.4;
      const totalDiamIn = rim + (sidewallIn * 2);
      const circumferenceIn = totalDiamIn * Math.PI;
      return {
        results: [
          { label: 'Total Outer Diameter', value: totalDiamIn.toFixed(2) + ' Inches', isPrimary: true },
          { label: 'Sidewall Height', value: sidewallIn.toFixed(2) + ' Inches' },
          { label: 'Tire Outer Circumference', value: circumferenceIn.toFixed(2) + ' Inches' }
        ],
        chartData: [
          { name: 'Rim Size', value: rim },
          { name: 'Sidewall x2', value: sidewallIn * 2 }
        ]
      };
    }
  },
  {
    id: 'ev-charging',
    name: 'EV Charging Simulator',
    slug: 'ev-charging',
    category: 'automotive',
    description: 'Simulate vehicle charging milestones based on battery capacity, charger kW output, and battery thermal caps.',
    formula: 'Charging Hours = Battery Capacity * (Target SoC - Start SoC) / (Charger power kW * Thermal Efficiency)',
    explanation: 'Simulates charge-speed slowdowns above 80% SoC, helping road trippers optimize charging stops.',
    example: 'An EV with a 75 kWh battery charging from 10% to 80% on a 150 kW DC Fast charger takes approximately 23 minutes.',
    inputs: [
      { id: 'batteryKwh', label: 'Battery Capacity (kWh)', type: 'number', defaultValue: 75, min: 10 },
      { id: 'sourceKw', label: 'Available Charger Power (kW)', type: 'select', defaultValue: 50, options: [
        { label: 'Standard Wall Plug (1.4 kW AC Level 1)', value: 1.4 },
        { label: 'Upgraded Garage Station (7.2 kW AC Level 2)', value: 7.2 },
        { label: 'Commercial Node (50.0 kW DC Fast Charger)', value: 50 },
        { label: 'Supercharger Network (150.0 kW DC Fast)', value: 150 }
      ]},
      { id: 'targetSoC', label: 'Target State of Charge (%)', type: 'number', defaultValue: 80, min: 20, max: 100 }
    ],
    faq: [
      { question: 'Why does EV charging speed slow down past 80%?', answer: 'As batteries fill, cell voltages peak, forcing battery management systems to reduce current to safely limit cell heating.' }
    ],
    relatedSlugs: ['car-depreciation', 'trip-fuel'],
    seoTitle: 'Electric Vehicle EV Home & DC Fast Charge Simulator',
    seoDescription: 'Simulate electric vehicle charge durations at home or at highway charging stations.',
    calculate: (inputs) => {
      const cap = Number(inputs.batteryKwh || 75);
      const pwr = Number(inputs.sourceKw || 50);
      const target = Number(inputs.targetSoC || 80);
      const start = 15; // standard base battery state
      
      const netKwhNeeded = cap * ((target - start) / 100);
      // DC Fast drops efficiency above 80%
      const efficiency = pwr > 40 ? 0.82 : 0.90;
      let hours = netKwhNeeded / (pwr * efficiency);
      if (target > 80) {
        hours += (cap * 0.20) / (Math.min(pwr, 11) * 0.90); // pad 20% slow topping charge
      }
      return {
        results: [
          { label: 'Estimated Charging Time', value: hours > 1 ? hours.toFixed(1) + ' Hours' : (hours * 60).toFixed(0) + ' Minutes', isPrimary: true },
          { label: 'Energy Transferred', value: netKwhNeeded.toFixed(1) + ' kWh' },
          { label: 'Active average efficiency', value: (efficiency * 100).toFixed(0) + '%' }
        ],
        chartData: [
          { name: 'Current Energy (15%)', value: cap * 0.15 },
          { name: 'Simulated Charge', value: netKwhNeeded }
        ]
      };
    }
  },
  {
    id: 'engine-displacement',
    name: 'Engine Displacement Calculator',
    slug: 'engine-displacement',
    category: 'automotive',
    description: 'Calculate engine total sweeping volume (Cubic Centimeters or CC) based on cylinder bore, piston stroke, and cylinder count.',
    formula: 'Displacement (CC) = Pi * (Bore / 2)^2 * Stroke * Cylinders / 1000',
    explanation: 'Tracks pure physical sweeps inside engine blocks. Translates millimeter dimensions into standardized cubic liter capacities.',
    example: 'An classic 8-cylinder engine with a 101.6mm bore and 88.4mm stroke sweeps 5.7 liters of air-fuel mixture.',
    inputs: [
      { id: 'boreMm', label: 'Cylinder Piston Bore (mm)', type: 'number', defaultValue: 85, min: 20 },
      { id: 'strokeMm', label: 'Piston Stroke Length (mm)', type: 'number', defaultValue: 88, min: 20 },
      { id: 'cylinders', label: 'Total Cylinders Count', type: 'number', defaultValue: 4, min: 1, max: 16 }
    ],
    faq: [
      { question: 'What is engine Bore and Stroke?', answer: 'Bore represents the horizontal diameter of the circular piston cylinder. Stroke measures the vertical distance the piston travels inside the block.' }
    ],
    relatedSlugs: ['tire-size', 'car-depreciation'],
    seoTitle: 'Combustion Engine CC & Liters Volume Displacement Calculator',
    seoDescription: 'Convert millimeter bore and stroke sizes into engine cylinder replacement CC swept capacities.',
    calculate: (inputs) => {
      const b = Number(inputs.boreMm || 85);
      const s = Number(inputs.strokeMm || 88);
      const cyl = Number(inputs.cylinders || 4);
      
      const singleCylVol = Math.PI * Math.pow(b / 20, 2) * (s / 10); // CC scale
      const totalCC = singleCylVol * cyl;
      const liters = totalCC / 1000;
      return {
        results: [
          { label: 'Piston Swept Displacement', value: totalCC.toFixed(0) + ' cc', isPrimary: true },
          { label: 'Engine Capacity Liters', value: liters.toFixed(1) + ' Liters' },
          { label: 'Single Cylinder sweep volume', value: Math.round(singleCylVol) + ' cc' }
        ],
        chartData: [
          { name: 'Single Cylinder', value: singleCylVol },
          { name: 'Cumulative Displacement (cc)', value: totalCC }
        ]
      };
    }
  },

  // ====================================== EDUCATION ======================================
  {
    id: 'gpa-calc',
    name: 'GPA Semester Calculator',
    slug: 'gpa-calc',
    category: 'education',
    description: 'Calculate semestral grade-point averages using custom letter grades and course credit weights.',
    formula: 'GPA = Sum(Grade Points * Credits) / Total Credits',
    explanation: 'Converts alphabetical scores (A, B, C) into standard collegiate scoring systems (e.g., 4.0 scale).',
    example: 'An student completing two 4-credit courses grade A (4.0) and one 3-credit course grade B (3.0) earns a 3.72 terminal GPA.',
    inputs: [
      { id: 'grade1', label: 'Class 1 Target Letter Grade', type: 'select', defaultValue: 4.0, options: [
        { label: 'Grade A (4.0)', value: 4.0 },
        { label: 'Grade B (3.0)', value: 3.0 },
        { label: 'Grade C (2.0)', value: 2.0 },
        { label: 'Grade D (1.0)', value: 1.0 }
      ]},
      { id: 'cred1', label: 'Class 1 Sizing Credits (usually 3 or 4)', type: 'number', defaultValue: 4, min: 1 },
      { id: 'grade2', label: 'Class 2 Letter Grade', type: 'select', defaultValue: 3.0, options: [
        { label: 'Grade A (4.0)', value: 4.0 },
        { label: 'Grade B (3.0)', value: 3.0 },
        { label: 'Grade C (2.0)', value: 2.0 },
        { label: 'Grade D (1.0)', value: 1.0 }
      ]},
      { id: 'cred2', label: 'Class 2 Credits', type: 'number', defaultValue: 3, min: 1 }
    ],
    faq: [
      { question: 'What is a weighted GPA rating?', answer: 'Weighted scales award extra points for Advanced Placement (AP) coursework, adjusting the scale from 4.0 up to 5.0.' }
    ],
    relatedSlugs: ['study-hour', 'exam-grade'],
    seoTitle: 'Collegiate Semester weighted GPA Calculator',
    seoDescription: 'Input custom letters and class credits to generate weighted point scores.',
    calculate: (inputs) => {
      const g1 = Number(inputs.grade1 || 4.0);
      const c1 = Number(inputs.cred1 || 4);
      const g2 = Number(inputs.grade2 || 3.0);
      const c2 = Number(inputs.cred2 || 3);
      
      const totalPoints = (g1 * c1) + (g2 * c2);
      const totalCredits = c1 + c2;
      const gpa = totalPoints / totalCredits;
      return {
        results: [
          { label: 'Calculated Grade Average', value: gpa.toFixed(2), isPrimary: true },
          { label: 'Total Credits weight Sizer', value: totalCredits + ' credits' },
          { label: 'Academic standing level', value: gpa >= 3.5 ? 'Deans Honor List' : 'Good standard rating' }
        ],
        chartData: [
          { name: 'Class 1 Points', value: g1 * c1 },
          { name: 'Class 2 Points', value: g2 * c2 }
        ]
      };
    }
  },
  {
    id: 'study-hour',
    name: 'Study Hour Balance Calculator',
    slug: 'study-hour',
    category: 'education',
    description: 'Estimate required weekly study hours based on course credit loads and content difficulty.',
    formula: 'Study Hours Weekly = Credits * Difficulty Coefficient (typically 2 to 3 hrs per credit)',
    explanation: 'Translates standard university workloads into calendar guidelines, helping students balance academic demands.',
    example: 'Enrolling in 15 semester credits with standard difficulty recommends at least 30 hours of weekly independent studying.',
    inputs: [
      { id: 'creditLoad', label: 'Total Semester Credits Enrolled', type: 'number', defaultValue: 15, min: 1 },
      { id: 'diffRate', label: 'Syllabus Difficulty Multiplier', type: 'select', defaultValue: 2, options: [
        { label: 'Basic Coursework (2 hours study per credit)', value: 2 },
        { label: 'Moderate STEM/Writing (2.5 hours per credit)', value: 2.5 },
        { label: 'Advanced Medical/Law/Engineering (3 hours per credit)', value: 3.0 }
      ]}
    ],
    faq: [
      { question: 'Does study timing follow corporate hours?', answer: 'Yes. Carrying 15 heavy credits requiring 30 study hours equals a 45-hour full-time dedication weekly.' }
    ],
    relatedSlugs: ['gpa-calc', 'exam-grade'],
    seoTitle: 'Semester Credit-to-Study Hour Weekly Tracker',
    seoDescription: 'Plan out study hours matching college credit assignments and difficulty levels.',
    calculate: (inputs) => {
      const cred = Number(inputs.creditLoad || 15);
      const mult = Number(inputs.diffRate || 2);
      
      const studyHrs = cred * mult;
      return {
        results: [
          { label: 'Weekly Study Hours Needed', value: studyHrs.toFixed(1) + ' Hours/week', isPrimary: true },
          { label: 'Expected Total Academic Load', value: (cred + studyHrs).toFixed(0) + ' Hours/week' }
        ],
        chartData: [
          { name: 'Classroom Hours', value: cred },
          { name: 'Independent Review', value: studyHrs }
        ]
      };
    }
  },
  {
    id: 'graduation-date',
    name: 'Academic Graduation Progress Planner',
    slug: 'graduation-date',
    category: 'education',
    description: 'Project college graduation timelines by mapping credit backlogs against semestral credit speeds.',
    formula: 'Semesters Remaining = (Required Graduation Credits - Earned Credits) / Average Credits Per Semester',
    explanation: 'Models clear graduation target paths, helping students plan transfer courses and accelerated schedules.',
    example: 'A student who has earned 45 credits of a 120-credit degree, taking 15 credits per semester, needs exactly 5 semesters to graduate.',
    inputs: [
      { id: 'totalRequired', label: 'Credits Required for Degree', type: 'number', defaultValue: 120, min: 30 },
      { id: 'earnedCredits', label: 'Already Completed Earned Credits', type: 'number', defaultValue: 45, min: 0 },
      { id: 'semesterSpeed', label: 'Target Credits Loaded per Semester', type: 'number', defaultValue: 15, min: 3 }
    ],
    faq: [
      { question: 'Do summer credits accelerate graduation times?', answer: 'Yes. Completing 6-12 credits during summer semesters can wipe out an entire standard fall/spring backlog.' }
    ],
    relatedSlugs: ['gpa-calc', 'study-hour'],
    seoTitle: 'College Degree Completion & Semester Progress Sizer',
    seoDescription: 'Plot remaining collegiate semesters ahead of target graduation dates.',
    calculate: (inputs) => {
      const req = Number(inputs.totalRequired || 120);
      const earn = Number(inputs.earnedCredits || 45);
      const spd = Number(inputs.semesterSpeed || 15);
      
      const remaining = Math.max(0, req - earn);
      const semestersLeft = remaining / spd;
      return {
        results: [
          { label: 'Semesters Remaining', value: semestersLeft.toFixed(1), isPrimary: true },
          { label: 'Course Credits Outstanding', value: remaining + ' credits' },
          { label: 'Aggregate Completion Ratio', value: ((earn / req) * 100).toFixed(0) + '%' }
        ],
        chartData: [
          { name: 'Completed Block', value: earn },
          { name: 'Remaining Backlog', value: remaining }
        ]
      };
    }
  },
  {
    id: 'student-loan-payoff',
    name: 'Student Loan Amortization Calculator',
    slug: 'student-loan-payoff',
    category: 'education',
    description: 'Plot college debt payoff schedules, tracking monthly installments and interest accrued over time.',
    formula: 'Monthly Installment = Principal * Interest / (1 - (1 + Interest)^-Periods)',
    explanation: 'Estimates how high-yield interest ratios prolong college load timelines, helping graduates model extra payment strategies to save on interest.',
    example: 'A $30,000 student loan carrying 6.8% interest amortized over 10 years requires monthly payments of $345.',
    inputs: [
      { id: 'loanAmt', label: 'Starting Student Loan Debt Balance ($)', type: 'number', defaultValue: 35000, min: 1000, step: 1000 },
      { id: 'ratePct', label: 'Annual Loan Interest Rate (%)', type: 'number', defaultValue: 5.5, min: 0.1, step: 0.1 },
      { id: 'yearsDuration', label: 'Repayment Term (Years)', type: 'number', defaultValue: 10, min: 1 }
    ],
    faq: [
      { question: 'What is a loan amortization schedule?', answer: 'Amortization details monthly payment ratios, breaking down what percentage of your payment is applied to the principal balance vs interest charges.' }
    ],
    relatedSlugs: ['gpa-calc', 'graduation-date'],
    seoTitle: 'Collegiate Student Loan Interest Sizer',
    seoDescription: 'Amortize outstanding student loan structures and gauge the financial impact of making overpayments.',
    calculate: (inputs) => {
      const p = Number(inputs.loanAmt || 35000);
      const yrRate = Number(inputs.ratePct || 5.5) / 100;
      const yrs = Number(inputs.yearsDuration || 10);
      
      const r = yrRate / 12;
      const n = yrs * 12;
      const monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPaid = monthly * n;
      const lifetimeInterest = totalPaid - p;
      return {
        results: [
          { label: 'Estimated Monthly Installment', value: '$' + monthly.toFixed(2), isPrimary: true },
          { label: 'Lifetime Interest fee Accrued', value: '$' + lifetimeInterest.toFixed(0) },
          { label: 'Cumulative Debt Outlay', value: '$' + Math.ceil(totalPaid).toLocaleString() }
        ],
        chartData: [
          { name: 'Core Borrowed Principal', value: p },
          { name: 'Accrued Interest Cost', value: lifetimeInterest }
        ]
      };
    }
  },
  {
    id: 'exam-grade',
    name: 'Exam Target Grade Calculator',
    slug: 'exam-grade',
    category: 'education',
    description: 'Calculate target exam scores required to maintain or achieve a desired final class grade.',
    formula: 'Target Exam Score = (Desired Grade - Current Grade * (1 - Weight)) / Weight',
    explanation: 'Takes the anxiety out of finals week by telling you the minimum exam score needed to keep desired term averages.',
    example: 'To pull off a final class score of 90% in a syllabus where the final exam represents 30% of the grade, with a current grade of 88%, you need a 94.6% on the final.',
    inputs: [
      { id: 'curGrade', label: 'Current Term Class Grade (%)', type: 'number', defaultValue: 85, min: 1, max: 100 },
      { id: 'desiredGrade', label: 'Desired Class Grade target (%)', type: 'number', defaultValue: 90, min: 1, max: 100 },
      { id: 'examWeight', label: 'Upcoming Final Exam Weight (%)', type: 'number', defaultValue: 25, min: 5, max: 95 }
    ],
    faq: [
      { question: 'What happens if the calculation yields over 100%?', answer: 'If the required score exceeds 100%, achieving your top target is mathematically impossible based on your current term scores, even with a perfect final exam score.' }
    ],
    relatedSlugs: ['gpa-calc', 'study-hour'],
    seoTitle: 'Final Exam Target Term Grade Sizer',
    seoDescription: 'Calculate target final exam percentages required to hit specific overall term letter grades.',
    calculate: (inputs) => {
      const cur = Number(inputs.curGrade || 85);
      const want = Number(inputs.desiredGrade || 90);
      const wt = Number(inputs.examWeight || 25) / 100;
      
      const missingRaw = want - (cur * (1 - wt));
      const targetScore = missingRaw / wt;
      return {
        results: [
          { label: 'Required Score on Exam', value: targetScore > 100 ? 'Infeasible (>100%)' : targetScore.toFixed(1) + '%', isPrimary: true },
          { label: 'Target exam weight margin', value: (wt * 100) + '%' },
          { label: 'Required class score drop to fail (70%)', value: Math.max(0, (cur - 70)).toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Current Weighted base', value: cur * (1 - wt) },
          { name: 'Remaining relative final', value: targetScore * wt }
        ]
      };
    }
  },

  // ====================================== HEALTH ======================================
  {
    id: 'bmi-calc',
    name: 'BMI Body Mass Index Calculator',
    slug: 'bmi-calc',
    category: 'health',
    description: 'Calculate Imperial and Metric Body Mass Index (BMI) ranges and health classification bands.',
    formula: 'Imperial BMI = (Weight lbs * 703) / (Height inches ^ 2)\nMetric BMI = Weight kg / (Height meters ^ 2)',
    explanation: 'Uses standard World Health Organization BMI thresholds to map body weight categories.',
    example: 'An adult holding 175 lbs standing 5ft 10in tall carries a Body Mass Index score of 25.1.',
    inputs: [
      { id: 'weightLbs', label: 'Body Weight (Pounds)', type: 'number', defaultValue: 165, min: 40 },
      { id: 'heightFt', label: 'Height - Feet Component', type: 'number', defaultValue: 5, min: 3, max: 8 },
      { id: 'heightIn', label: 'Height - Inches Component', type: 'number', defaultValue: 9, min: 0, max: 11 }
    ],
    faq: [
      { question: 'Does BMI measure muscle mass percentage?', answer: 'No. BMI is a population-level density ratio that does not distinguish heavy bone structures or dense muscle from fat tissues.' }
    ],
    relatedSlugs: ['caloric-intake', 'macro-sizer'],
    seoTitle: 'Collegiate Body Mass Index BMI Metric-range Calculator',
    seoDescription: 'Check raw BMI scores and health ranges set by the World Health Organization.',
    calculate: (inputs) => {
      const lbs = Number(inputs.weightLbs || 165);
      const ft = Number(inputs.heightFt || 5);
      const inch = Number(inputs.heightIn || 9);
      
      const totHeightIns = (ft * 12) + inch;
      const bmi = (lbs * 703) / (totHeightIns * totHeightIns);
      
      let classVerdict = 'Normal weight';
      if (bmi < 18.5) classVerdict = 'Underweight range';
      else if (bmi >= 25 && bmi < 29.9) classVerdict = 'Overweight range';
      else if (bmi >= 30) classVerdict = 'Obesity threshold';
      
      return {
        results: [
          { label: 'Calculated BMI Score', value: bmi.toFixed(1) + ' index', isPrimary: true },
          { label: 'Weight Classification', value: classVerdict },
          { label: 'Theoretical Normal range', value: '18.5 to 24.9 index' }
        ],
        chartData: [
          { name: 'Underweight', value: 18.5 },
          { name: 'Your BMI', value: bmi },
          { name: 'Overweight', value: 25 }
        ]
      };
    }
  },
  {
    id: 'caloric-intake',
    name: 'Caloric Intake & Activity Sizer',
    slug: 'caloric-intake',
    category: 'health',
    description: 'Calculate daily Basal Metabolic Rate (BMR) energy expenditure and maintenance calories.',
    formula: 'BMR (Men) = 66 + (6.23 * lbs) + (12.7 * inches) - (6.8 * age)',
    explanation: 'Finds your standard baseline metabolic burn, incorporating activity multipliers to assist in weight loss planning.',
    example: 'A 28-year-old male athlete standing 5ft 10in tall weighing 180 lbs burns around 1,844 BMR calories at rest.',
    inputs: [
      { id: 'weightLbs', label: 'Body Weight (Pounds)', type: 'number', defaultValue: 175, min: 30 },
      { id: 'heightFt', label: 'Height - Feet Component', type: 'number', defaultValue: 5, min: 3 },
      { id: 'heightIn', label: 'Height - Inches Component', type: 'number', defaultValue: 10, min: 0 },
      { id: 'ageYears', label: 'Current Age (Years)', type: 'number', defaultValue: 30, min: 1 },
      { id: 'activeMult', label: 'Weekly Physical Activity Tier', type: 'select', defaultValue: 1.375, options: [
        { label: 'Sedentary - Desk job / couch (1.20 multiplier)', value: 1.2 },
        { label: 'Light Exercise - Walk 1-3 days (1.37 multiplier)', value: 1.375 },
        { label: 'Intense Training - Gym 5-6 days (1.55 multiplier)', value: 1.55 }
      ]}
    ],
    faq: [
      { question: 'What is BMR vs TDEE?', answer: 'BMR is energy burned staying completely motionless. TDEE is Total Daily Energy Expenditure, compiling active movements with BMR.' }
    ],
    relatedSlugs: ['bmi-calc', 'macro-sizer'],
    seoTitle: 'Standard BMR & Caloric Metabolic burn Calculator',
    seoDescription: 'Determine daily nutritional energy maintenance totals.',
    calculate: (inputs) => {
      const lbs = Number(inputs.weightLbs || 175);
      const ft = Number(inputs.heightFt || 5);
      const inch = Number(inputs.heightIn || 10);
      const age = Number(inputs.ageYears || 30);
      const mult = Number(inputs.activeMult || 1.375);
      
      const totHeightIns = (ft * 12) + inch;
      const bmrVal = 66 + (6.23 * lbs) + (12.7 * totHeightIns) - (6.76 * age);
      const tdee = bmrVal * mult;
      return {
        results: [
          { label: 'Active Maintenance Energy (TDEE)', value: Math.round(tdee) + ' calories/day', isPrimary: true },
          { label: 'Basal Rest Metabolic Burn (BMR)', value: Math.round(bmrVal) + ' calories' },
          { label: 'Deficit weight loss target (500 cal)', value: Math.round(tdee - 500) + ' calories' }
        ],
        chartData: [
          { name: 'BMR Floor', value: bmrVal },
          { name: 'Active Energy Burn', value: tdee - bmrVal }
        ]
      };
    }
  },
  {
    id: 'macro-sizer',
    name: 'Macro Nutritional Sizer',
    slug: 'macro-sizer',
    category: 'health',
    description: 'Structure custom macronutrient goals by converting energetic calorie tiers into physical gram weights.',
    formula: 'Protein Grams = Daily Calorie target * Percent / 4\nFats Grams = Daily Calorie target * Percent / 9',
    explanation: 'Translates daily dietary structures (e.g., standard fat loss or intense muscle building) into exact kitchen scales targets.',
    example: 'A target of 2,000 calories split with 30% Protein translates to exactly 150 grams of dietary protein.',
    inputs: [
      { id: 'dietCal', label: 'Daily Planned Calorie Intake', type: 'number', defaultValue: 2000, min: 500 },
      { id: 'protPct', label: 'Protein Target Percent (%)', type: 'number', defaultValue: 30, min: 10, max: 60 }
    ],
    faq: [
      { question: 'How do macros scale across grams?', answer: 'Each gram of Protein represents 4 calories. Carbs represent 4 calories. Dietary fats carry 9 calories per gram.' }
    ],
    relatedSlugs: ['bmi-calc', 'caloric-intake'],
    seoTitle: 'Protein Carbohydrate & Fats Kitchen Gram Sizer',
    seoDescription: 'Split daily nutritional targets into physical gram totals for macro tracking.',
    calculate: (inputs) => {
      const cal = Number(inputs.dietCal || 2000);
      const prot = Number(inputs.protPct || 30) / 100;
      const fatPct = 0.25; // 25% fat standard
      const carbPct = 1.0 - (prot + fatPct);
      
      const pGrams = (cal * prot) / 4;
      const fGrams = (cal * fatPct) / 9;
      const cGrams = (cal * carbPct) / 4;
      return {
        results: [
          { label: 'Protein Goal', value: Math.round(pGrams) + ' grams', isPrimary: true },
          { label: 'Carbs Goal', value: Math.round(cGrams) + ' grams' },
          { label: 'Healthy Fats Goal', value: Math.round(fGrams) + ' grams' }
        ],
        chartData: [
          { name: 'Protein', value: Math.round(pGrams * 4) },
          { name: 'Carbs', value: Math.round(cGrams * 4) },
          { name: 'Fats', value: Math.round(fGrams * 9) }
        ]
      };
    }
  },
  {
    id: 'heart-rate-calc',
    name: 'Heart Rate Target Zone Calculator',
    slug: 'heart-rate-calc',
    category: 'health',
    description: 'Calculate target heart rate training intensities based on age, resting heart rate, and training targets.',
    formula: 'Max HR = 220 - Age\nTarget HR = ((Max HR - Resting HR) * Intensity Percentage) + Resting HR',
    explanation: 'Uses the Karvonen formula to help athletes calibrate safe cardiovascular pacing profiles during sports training.',
    example: 'For a 30-year-old tracker with a 60 bpm resting pulse, training at 70% intensity maps to 151 bpm.',
    inputs: [
      { id: 'ageYrs', label: 'Current Age (Years)', type: 'number', defaultValue: 30, min: 5 },
      { id: 'restHR', label: 'Resting Cardiac Pulse (bpm)', type: 'number', defaultValue: 65, min: 30 }
    ],
    faq: [
      { question: 'What is rest heart rate standard range?', answer: 'Healthy resting heart rates range between 60 to 100 beats per minute, while trained athletes can drop below 50 bpm.' }
    ],
    relatedSlugs: ['bmi-calc', 'water-intake'],
    seoTitle: 'Aerobic Karvonen Cardio Heart Rate Sizer',
    seoDescription: 'Find athletic fat-burning and peak aerobic heart rate training thresholds using aged standard formulas.',
    calculate: (inputs) => {
      const age = Number(inputs.ageYrs || 30);
      const rest = Number(inputs.restHR || 65);
      
      const maxHr = 220 - age;
      const reserve = maxHr - rest;
      const fatBurn = (reserve * 0.6) + rest;
      const cardio = (reserve * 0.8) + rest;
      return {
        results: [
          { label: 'Target Aerobic Zone (Cardio)', value: Math.round(cardio) + ' bpm', isPrimary: true },
          { label: 'Fat Burning Zone (60%)', value: Math.round(fatBurn) + ' bpm' },
          { label: 'Age Maximum Heart Pulse limit', value: maxHr + ' bpm' }
        ],
        chartData: [
          { name: 'Cardio Target', value: cardio }
        ]
      };
    }
  },
  {
    id: 'water-intake',
    name: 'Daily Hydration Calculator',
    slug: 'water-intake',
    category: 'health',
    description: 'Sizer daily standard water hydration needs factoring in body mass, temperatures, and physical activities duration.',
    formula: 'Daily Water (oz) = Weight (lbs) * 0.5 + (Exercise Minutes * 0.35)',
    explanation: 'Ensures muscle recovery, joint lubrication, and cognitive clarity, especially during hot summer seasons.',
    example: 'An 160 lb person exercising for 45 minutes daily should consume about 95 ounces of fluid.',
    inputs: [
      { id: 'bodyWeightLbs', label: 'Body Weight (Pounds)', type: 'number', defaultValue: 160, min: 40 },
      { id: 'exerciseMinutes', label: 'Daily Active Workout length (Minutes)', type: 'number', defaultValue: 30, min: 0 }
    ],
    faq: [
      { question: 'Does tea or coffee support dynamic hydration?', answer: 'Yes. While caffeine has minor diuretic components, standard coffee and herbal teas still contribute to daily water targets.' }
    ],
    relatedSlugs: ['bmi-calc', 'heart-rate-calc'],
    seoTitle: 'Daily Water Nutrition Hydration Sizer',
    seoDescription: 'Plot daily fluid intake benchmarks by weighting body mass metrics against workout intervals.',
    calculate: (inputs) => {
      const lbs = Number(inputs.bodyWeightLbs || 160);
      const mins = Number(inputs.exerciseMinutes || 30);
      
      const targetOz = (lbs * 0.5) + (mins * 0.35);
      const liters = targetOz * 0.0295735;
      return {
        results: [
          { label: 'Recommended Hydration Target', value: targetOz.toFixed(0) + ' fl oz', isPrimary: true },
          { label: 'Metric Liters Equivalent', value: liters.toFixed(1) + ' Liters' },
          { label: 'Standard 8oz Glasses count', value: Math.ceil(targetOz / 8) + ' glasses' }
        ],
        chartData: [
          { name: 'Water Target', value: targetOz }
        ]
      };
    }
  },
  {
    id: 'sleep-cycle',
    name: 'REM Sleep Cycle Calculator',
    slug: 'sleep-cycle',
    category: 'health',
    description: 'Calculate optimal wakeup boundaries by analyzing classic 90-minute neural REM intervals.',
    formula: 'Wakeup timestamps = Sleep Time + (Multiples of 1.5 Hours) + 14 minutes sleep latency',
    explanation: 'Helps track brain rest. Avoid waking up mid-REM cycle, preventing grogginess and sleep inertia in the mornings.',
    example: 'Going to bed at 11:00 PM recommends waking up at 5:14 AM or 6:44 AM for optimal grog-free energy.',
    inputs: [
      { id: 'latencyMin', label: 'Time to drift asleep (Minutes)', type: 'number', defaultValue: 15, min: 0, max: 60 }
    ],
    faq: [
      { question: 'Why does waking up mid-cycle cause exhaustion?', answer: 'Waking up during deep slow-wave REM sleep cycles interrupts brain delta-wave patterns, triggering heavy physical fatigue.' }
    ],
    relatedSlugs: ['bmi-calc', 'water-intake'],
    seoTitle: 'Optimal Wakeup REM 90-Minute Sleeping Cycle Sizer',
    seoDescription: 'Optimize sleep schedules to wake up refreshed at completed REM boundaries.',
    calculate: (inputs) => {
      const latency = Number(inputs.latencyMin || 15);
      const cycleMin = 90;
      
      // predict relative durations for completed cycles
      const cy4 = (cycleMin * 4) + latency;
      const cy5 = (cycleMin * 5) + latency;
      const cy6 = (cycleMin * 6) + latency;
      return {
        results: [
          { label: 'Optimal Sleep Session (5 Cycle Target)', value: (cy5 / 60).toFixed(1) + ' Hours', isPrimary: true },
          { label: 'Quick restorative stretch (4 cycles)', value: (cy4 / 60).toFixed(1) + ' Hours' },
          { label: 'Deep ultimate rest rating (6 cycles)', value: (cy6 / 60).toFixed(1) + ' Hours' }
        ],
        chartData: [
          { name: 'Cycle 4', value: cy4 },
          { name: 'Cycle 5', value: cy5 },
          { name: 'Cycle 6', value: cy6 }
        ]
      };
    }
  }
];
