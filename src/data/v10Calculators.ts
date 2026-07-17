import { Calculator } from '../types';

export const V10_CALCULATORS: Calculator[] = [
  // ==================== CATEGORY: AUTOMOTIVE COMPLETE ====================
  {
    id: 'car-lease-calculator',
    name: 'Car Lease Calculator',
    slug: 'car-lease-calculator',
    category: 'engineering',
    description: 'Calculate monthly car lease payments including depreciation fee, money factor finance fee, and sales tax.',
    seoTitle: 'Car Lease Payment Calculator | Calculatoora',
    seoDescription: 'Accurately estimate monthly lease payments on a new vehicle, factoring in MSRP, cap cost reduction, money factor, and residual values.',
    inputs: [
      { id: 'msrp', label: 'Vehicle MSRP ($)', type: 'number', defaultValue: 35000, step: 1000 },
      { id: 'negotiatedPrice', label: 'Negotiated Capitalized Cost ($)', type: 'number', defaultValue: 32000, step: 1000 },
      { id: 'downPayment', label: 'Down Payment & Trade-In Credit ($)', type: 'number', defaultValue: 3000, step: 500 },
      { id: 'leaseTerm', label: 'Lease Term (Months)', type: 'number', defaultValue: 36, min: 12, max: 72, step: 12 },
      { id: 'residualPercent', label: 'Residual Value percentage (%)', type: 'number', defaultValue: 55, min: 20, max: 80, step: 1 },
      { id: 'moneyFactor', label: 'Money Factor (Lease APR / 2400)', type: 'number', defaultValue: 0.0025, step: 0.0001 },
      { id: 'taxRate', label: 'Monthly Sales Tax Rate (%)', type: 'number', defaultValue: 8.5, min: 0, max: 20, step: 0.1 }
    ],
    formula: 'Monthly Lease Payment = Depreciation Fee + Finance Fee + Monthly Sales Tax\nDepreciation Fee = (Net Adj. Cap Cost - Residual Value) / Term\nFinance Fee = (Net Adj. Cap Cost + Residual Value) * Money Factor\nMonthly Tax = (Depreciation Fee + Finance Fee) * Tax Rate',
    explanation: 'Lease payments are composed of three parts. Depreciation reflects the vehicle\'s lost value over the lease term. The Finance Fee represents the interest fee charged by the financing institution, calculated via the money factor on combined cap cost and residual value. Lastly, monthly local sales taxes are levied on these fees.',
    example: 'For a $35,000 car leased for 36 months helper, with $32,000 negotiated price, $3,000 down payment, 55% residual value ($19,250), 0.0025 Money Factor, and 8.5% tax, the resulting monthly payment is $426.68 ($270.83 depreciation + $120.63 finance + $33.27 tax).',
    faq: [
      { question: 'What is a good Money Factor value?', answer: 'A money factor can be converted to APR by multiplying it by 2400. For example, 0.0025 * 2400 is equivalent to a 6.0% APR interest rate.' },
      { question: 'Can I negotiate the residual percentage?', answer: 'No, residual percentages of vehicles are set in stone by the manufacturer\'s finance division and cannot be negotiated.' }
    ],
    relatedSlugs: ['car-payment-calculator', 'car-affordability-calculator'],
    keywords: ['car lease', 'lease payment', 'residual value', 'money factor'],
    calculate: (inputs) => {
      const msrp = Number(inputs.msrp || 35000);
      const capCost = Number(inputs.negotiatedPrice || 32000);
      const down = Number(inputs.downPayment || 3000);
      const term = Number(inputs.leaseTerm || 36);
      const residPercent = Number(inputs.residualPercent || 55);
      const mf = Number(inputs.moneyFactor || 0.0025);
      const taxRate = Number(inputs.taxRate || 8.5);

      const netCapCost = Math.max(0, capCost - down);
      const residualValue = msrp * (residPercent / 100);
      
      const depreciationTotal = Math.max(0, netCapCost - residualValue);
      const monthlyDepreciation = term > 0 ? depreciationTotal / term : 0;
      
      const monthlyFinance = (netCapCost + residualValue) * mf;
      const subTotal = monthlyDepreciation + monthlyFinance;
      const monthlyTax = subTotal * (taxRate / 100);
      const finalMonthly = subTotal + monthlyTax;

      return {
        results: [
          { label: 'Total Monthly Lease Payment', value: finalMonthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Base Monthly Depreciation Fee', value: monthlyDepreciation.toFixed(2), unit: '$' },
          { label: 'Monthly Finance Charge', value: monthlyFinance.toFixed(2), unit: '$' },
          { label: 'Monthly Sales Tax Contribution', value: monthlyTax.toFixed(2), unit: '$' },
          { label: 'Residual Vehicle Value', value: residualValue.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Depreciation', value: Math.round(monthlyDepreciation), color: '#3b82f6' },
          { name: 'Finance Charge', value: Math.round(monthlyFinance), color: '#f59e0b' },
          { name: 'Sales Tax', value: Math.round(monthlyTax), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'car-payment-calculator',
    name: 'Car Payment Calculator',
    slug: 'car-payment-calculator',
    category: 'engineering',
    description: 'Structure monthly loan payments on new or pre-owned vehicles, including tax, title, interest, and trade-in adjustments.',
    seoTitle: 'Car Payment Loan Calculator | Calculatoora',
    seoDescription: 'Quickly find monthly vehicle loan payments with our free car payment calculator. Customize down payments, trades, and interest parameters.',
    inputs: [
      { id: 'price', label: 'Vehicle Purchase Price ($)', type: 'number', defaultValue: 28000, step: 1000 },
      { id: 'downPayment', label: 'Down Payment ($)', type: 'number', defaultValue: 4000, step: 500 },
      { id: 'tradeValue', label: 'Trade-In Allowance ($)', type: 'number', defaultValue: 3000, step: 500 },
      { id: 'interestRate', label: 'Annual Loan Interest Rate (%)', type: 'number', defaultValue: 5.9, step: 0.1 },
      { id: 'termMonths', label: 'Loan Term (Months)', type: 'number', defaultValue: 60, min: 12, max: 96, step: 12 },
      { id: 'salesTax', label: 'Purchase Sales Tax (%)', type: 'number', defaultValue: 7.0, step: 0.5 },
      { id: 'fees', label: 'Dealer fees & Registration Costs ($)', type: 'number', defaultValue: 950, step: 50 }
    ],
    formula: 'Loan Amount = Purchase Price - Down Payment - Trade-In + Fees + Taxes\nMonthly Payment = Loan Amount * [r(1+r)^n] / [(1+r)^n - 1]\nWhere r = APR / 12 / 100, n = Term in months.',
    explanation: 'A vehicle payment calculator maps out standard interest amortization schedules on a vehicle loan. It factors in trade-ins and down payments to lower the core borrowing balance, then applies the simple interest compounding rate.',
    example: 'For a $28,000 vehicle with a $4,000 down payment, $3,000 trade-in value, 5.9% interest over 60 months, 7.0% tax ($1,960), and $950 registration, the total loan is $23,910. The payment is $461.50 per month.',
    faq: [
      { question: 'What is a typical vehicle loan term length?', answer: 'The most popular terms are 60 to 72 months, though shorter terms (like 48 months) save substantial interest over time.' },
      { question: 'Are trade-ins tax deductible?', answer: 'In many states, yes! You only pay sales tax on the net price after the trade-in allowance value is deducted.' }
    ],
    relatedSlugs: ['car-lease-calculator', 'car-affordability-calculator'],
    keywords: ['car payment', 'auto loan', 'trade in credit', 'vehicle finance'],
    calculate: (inputs) => {
      const price = Number(inputs.price || 28000);
      const down = Number(inputs.downPayment || 4000);
      const trade = Number(inputs.tradeValue || 3000);
      const apr = Number(inputs.interestRate || 5.9);
      const term = Number(inputs.termMonths || 60);
      const taxRate = Number(inputs.salesTax || 7.0);
      const fees = Number(inputs.fees || 950);

      const netSalesPrice = price - trade;
      const taxAmount = Math.max(0, netSalesPrice) * (taxRate / 100);
      const loanAmount = Math.max(0, price - down - trade + taxAmount + fees);

      const r = (apr / 100) / 12;
      const n = term;
      
      let monthly = 0;
      if (r > 0) {
        monthly = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        monthly = loanAmount / n;
      }

      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - loanAmount);

      return {
        results: [
          { label: 'Estimated Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Amount Borrowed', value: loanAmount.toFixed(2), unit: '$' },
          { label: 'Total Interest Charge Paid', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Acquisition Sales Tax Paid', value: taxAmount.toFixed(2), unit: '$' },
          { label: 'Total Loan Principal + Interest', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Principal Balance', value: Math.round(loanAmount), color: '#10b981' },
          { name: 'Interest Charge', value: Math.round(totalInterest), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'car-affordability-calculator',
    name: 'Car Affordability Calculator',
    slug: 'car-affordability-calculator',
    category: 'engineering',
    description: 'Find out what price car you can afford based on your target monthly budget, down payment, and loan conditions.',
    seoTitle: 'What Car Can I Afford? Calculator | Calculatoora',
    seoDescription: 'Our free Car Affordability Calculator calculates your maximum purchase budget based on targeted monthly cash allowances.',
    inputs: [
      { id: 'targetPayment', label: 'Maximum Monthly Auto Budget ($)', type: 'number', defaultValue: 450, step: 50 },
      { id: 'downPayment', label: 'Cash Down Payment ($)', type: 'number', defaultValue: 3000, step: 500 },
      { id: 'tradeValue', label: 'Net Trade-In equity ($)', type: 'number', defaultValue: 2000, step: 500 },
      { id: 'interestRate', label: 'Expected Annual Loan Rate (%)', type: 'number', defaultValue: 6.5, step: 0.1 },
      { id: 'termMonths', label: 'Target Loan Term (Months)', type: 'number', defaultValue: 60, min: 12, max: 84, step: 12 },
      { id: 'salesTax', label: 'Est. Sales Tax Rate (%)', type: 'number', defaultValue: 6.5, step: 0.5 }
    ],
    formula: 'Purchase Value Limit = (Loan Amount + Down Payment + Trade-In) / (1 + Tax Rate / 100)\nLoan Amount = P = PMT * [1 - (1+r)^-n] / r\nWhere r = Monthly interest rate, n = Months.',
    explanation: 'This calculator works backward from a healthy monthly installment budget limit, determining the net loan amount. Then, it factors in down payments, trade-ins, and local purchase sales taxes to calculate the sticker price you can safely shop for.',
    example: 'If your target payment is $450/month over 60 months at a 6.5% interest rate, the loan principal translates to $22,860. Factoring in $3,000 cash down and $2,000 trade-in with 6.5% tax, your target car purchase price is approximately $26,160.',
    faq: [
      { question: 'What is the 10% rule of vehicle affordability?', answer: 'Financial advisors recommend capping your combined car-related outputs (payment, insurance, maintenance) at 10% of your gross monthly earnings.' },
      { question: 'How do trade-ins lower taxes?', answer: 'In many regions, you are only tax-assessed on the net price difference after your trade-in is credited, expanding your spending power.' }
    ],
    relatedSlugs: ['car-payment-calculator', 'car-lease-calculator'],
    keywords: ['car budget', 'affordability calculator', 'vehicle finance limits', 'purchase power'],
    calculate: (inputs) => {
      const targetPmt = Number(inputs.targetPayment || 450);
      const down = Number(inputs.downPayment || 3000);
      const trade = Number(inputs.tradeValue || 2000);
      const apr = Number(inputs.interestRate || 6.5);
      const term = Number(inputs.termMonths || 60);
      const taxRate = Number(inputs.salesTax || 6.5);

      const r = (apr / 100) / 12;
      const n = term;

      let maxLoan = 0;
      if (r > 0) {
        maxLoan = targetPmt * (1 - Math.pow(1 + r, -n)) / r;
      } else {
        maxLoan = targetPmt * n;
      }

      // Convert from Loan amount + Down + Trade to Purchase Sticker Price accounting for tax
      // Loan Amount = (Sticker - Trade)*tax + Sticker - Down - Trade
      // Loan Amount = Sticker*(1+tax) - Trade*(1+tax) - Down - Trade... Sticker = (Loan + Down + Trade + Trade*tax) / (1+tax)
      const tMult = (taxRate / 100);
      const stickerPrice = (maxLoan + down + trade + (trade * tMult)) / (1 + tMult);
      const totalTax = Math.max(0, stickerPrice - trade) * tMult;

      return {
        results: [
          { label: 'Maximum Affordable Sticker Price', value: stickerPrice.toFixed(0), unit: '$', isPrimary: true },
          { label: 'Calculated Maximum Loan Size', value: maxLoan.toFixed(2), unit: '$' },
          { label: 'Total Cash Down + Trade Credited', value: (down + trade).toFixed(2), unit: '$' },
          { label: 'Estimated Acquisition Sales Tax', value: totalTax.toFixed(2), unit: '$' },
          { label: 'Total 5-Year Payment Outlay', value: (targetPmt * term).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Loan Outlay', value: Math.round(maxLoan), color: '#3b82f6' },
          { name: 'Down Payment', value: Math.round(down), color: '#10b981' },
          { name: 'Trade-In Equity', value: Math.round(trade), color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'car-depreciation-calculator',
    name: 'Car Depreciation Calculator',
    slug: 'car-depreciation-calculator',
    category: 'engineering',
    description: 'Calculate vehicle depreciation over age intervals (years 1 to 10) to forecast resale values.',
    seoTitle: 'Car Depreciation & Resale Value Calculator | Calculatoora',
    seoDescription: 'Calculate vehicle residual values over up to 10 years of ownership. Use standard custom depreciation rates per brand type.',
    inputs: [
      { id: 'purchasePrice', label: 'Initial Purchase Price ($)', type: 'number', defaultValue: 32000, step: 1000 },
      { id: 'vehicleSegment', label: 'Vehicle Class Segment', type: 'select', defaultValue: 'standard', options: [
        { label: 'Economy / Standard (Clean deprecation)', value: 'standard' },
        { label: 'Luxury Cars/SUVs (Faster deprecation)', value: 'luxury' },
        { label: 'Trucks / Heavy Commercial (Slower deprecation)', value: 'truck' },
        { label: 'Electric Vehicles (High early depreciation)', value: 'ev' }
      ]},
      { id: 'ownershipYears', label: 'Forecast Age (Years)', type: 'number', defaultValue: 5, min: 1, max: 10, step: 1 }
    ],
    formula: 'Value(t) = Purchase Price * Math.pow(1 - Rate_1, 1) * Math.pow(1 - Rate_y, t - 1)\nStandard: Year 1 = 20%, subsequent = 15%/yr\nLuxury: Year 1 = 25%, subsequent = 18%/yr\nEV: Year 1 = 28%, subsequent = 17%/yr',
    explanation: 'Vehicles lose a high percentage of baseline value during the first year of leaving the dealership, followed by a steadier annual decline thereafter. This calculator predicts your vehicle\'s remaining value based on class segment curves.',
    example: 'A standard $32,000 passenger vehicle depreciates roughly 20% in the first year and 15% each year after. After 5 years, it maintains about 41.7% of its initial value, trading at roughly $13,348.',
    faq: [
      { question: 'Why do EVs depreciate faster description?', answer: 'EV depreciation values are traditionally high due to rapid technological expansions, battery wear anxieties, and fluctuations in tax-incentive guidelines.' },
      { question: 'How can I slow down depreciation speed?', answer: 'Maintain detailed service histories, keep miles below the national average (roughly 12,000 miles/yr), and park in covered garages.' }
    ],
    relatedSlugs: ['car-payment-calculator', 'car-lease-calculator'],
    keywords: ['car depreciation', 'vehicle value', 'resale price', 'residual multiplier'],
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice || 32000);
      const segment = inputs.vehicleSegment || 'standard';
      const years = Number(inputs.ownershipYears || 5);

      // Setup depreciation rates
      let y1Rate = 0.20;
      let standardRate = 0.15;
      if (segment === 'luxury') { y1Rate = 0.25; standardRate = 0.18; }
      else if (segment === 'truck') { y1Rate = 0.15; standardRate = 0.12; }
      else if (segment === 'ev') { y1Rate = 0.28; standardRate = 0.17; }

      let currentValue = price;
      const chartValues = [];
      chartValues.push({ name: 'Year 0', Value: Math.round(price) });

      for (let y = 1; y <= 10; y++) {
        if (y === 1) {
          currentValue = currentValue * (1 - y1Rate);
        } else {
          currentValue = currentValue * (1 - standardRate);
        }
        chartValues.push({ name: `Yr ${y}`, Value: Math.round(currentValue) });
      }

      const activeValue = chartValues[years]?.Value || currentValue;
      const totalLost = price - activeValue;
      const lostPercent = (totalLost / price) * 100;

      return {
        results: [
          { label: `Estimated Resale Value at Year ${years}`, value: activeValue.toFixed(0), unit: '$', isPrimary: true },
          { label: 'Total Depreciated Capital Lost', value: totalLost.toFixed(0), unit: '$' },
          { label: 'Cumulative Value Lost (%)', value: lostPercent.toFixed(1), unit: '%' },
          { label: 'First Year Depreciation Drop', value: (price * y1Rate).toFixed(0), unit: '$' }
        ],
        chartData: chartValues
      };
    }
  },
  {
    id: 'fuel-consumption-calculator',
    name: 'Fuel Consumption Calculator',
    slug: 'fuel-consumption-calculator',
    category: 'engineering',
    description: 'Calculate fuel consumption metrics (L/100km, MPG) and estimate trip fuel costs based on distance and vehicle efficiency.',
    seoTitle: 'Fuel Consumption and Cost Calculator | Calculatoora',
    seoDescription: 'Calculate vehicle fuel consumption rates and plan your trip fuel budgets. Converts metrics between MPG and Liters.',
    inputs: [
      { id: 'distance', label: 'Trip Distance (miles or km)', type: 'number', defaultValue: 250, step: 10 },
      { id: 'fuelUsed', label: 'Fuel Consumed (Gallons or Liters)', type: 'number', defaultValue: 10.5, step: 0.5 },
      { id: 'pricePerUnit', label: 'Price per Fuel Unit ($)', type: 'number', defaultValue: 3.85, step: 0.05 },
      { id: 'unitType', label: 'Measurement Metric Units', type: 'select', defaultValue: 'imperial', options: [
        { label: 'US/Imperial (Miles and Gallons)', value: 'imperial' },
        { label: 'Metric System (Kilometers and Liters)', value: 'metric' }
      ]}
    ],
    formula: 'Imperial Mode: Fuel Economy (MPG) = Distance (mi) / Fuel (gal)\nMetric Mode: Fuel Economy (L/100km) = (Fuel (L) / Distance (km)) * 100\nTotal Cost = Fuel Used * Price per Unit',
    explanation: 'We calculate your car\'s volumetric efficiency based on the physical fuel consumed over your recorded odometer delta, giving you a functional diagnostic rating and predicting exact monetary output ratios.',
    example: 'Driving 250 miles on 10.5 gallons of gasoline results in a fuel consumption of 23.8 MPG. At a price of $3.85/gallon, this trip costs exactly $40.43.',
    faq: [
      { question: 'What is a good average highway fuel economy?', answer: 'For standard gas sedans, an efficiency above 30 MPG (or below 7.8 L/100km) is considered highly efficient.' },
      { question: 'How can cold weather affect fuel consumption?', answer: 'Cold weather increases fuel consumption due to lengthy engine heating times, elevated air density drag, and winter tire tread resistances.' }
    ],
    relatedSlugs: ['car-depreciation-calculator', 'car-lease-calculator'],
    keywords: ['fuel consumption', 'mpg calculator', 'trip fuel cost', 'gas mileage converter'],
    calculate: (inputs) => {
      const distance = Number(inputs.distance || 250);
      const fuelUsed = Number(inputs.fuelUsed || 10.5);
      const price = Number(inputs.pricePerUnit || 3.85);
      const unitType = inputs.unitType || 'imperial';

      const economy = fuelUsed > 0 ? distance / fuelUsed : 0;
      const metricRate = distance > 0 ? (fuelUsed / distance) * 100 : 0;
      const totalCost = fuelUsed * price;

      const results = unitType === 'imperial' ? [
        { label: 'Vehicle Fuel Economy (MPG)', value: economy.toFixed(1), unit: 'miles/gal', isPrimary: true },
        { label: 'Total Trip Fuel Cost', value: totalCost.toFixed(2), unit: '$' },
        { label: 'Fuel Consumed', value: fuelUsed.toFixed(1), unit: 'Gallons' },
        { label: 'Cost per Mile traveled', value: distance > 0 ? (totalCost / distance).toFixed(3) : '0', unit: '$' }
      ] : [
        { label: 'Fuel consumption (L/100km)', value: metricRate.toFixed(1), unit: 'L/100km', isPrimary: true },
        { label: 'Total Trip Fuel Cost', value: totalCost.toFixed(2), unit: '$' },
        { label: 'Fuel Consumed', value: fuelUsed.toFixed(1), unit: 'Liters' },
        { label: 'Cost per Kilometer traveled', value: distance > 0 ? (totalCost / distance).toFixed(3) : '0', unit: '$' }
      ];

      return {
        results,
        chartData: [
          { name: 'Fuel Spent Cost', value: Math.round(totalCost), color: '#ef4444' }
        ]
      };
    }
  },
  // Adding more tools in AUTOMOTIVE
  {
    id: 'ev-charging-cost-calculator',
    name: 'EV Charging Cost Calculator',
    slug: 'ev-charging-cost-calculator',
    category: 'engineering',
    description: 'Calculate the electricity cost to charge an electric vehicle based on battery capacity, charge delta, and local utility rates.',
    seoTitle: 'Electric Vehicle (EV) Charging Cost Calculator | Calculatoora',
    seoDescription: 'Find out how much it costs to top off your EV battery at home or at public chargers, including residential power parameters.',
    inputs: [
      { id: 'batterySize', label: 'EV Battery Capacity (kWh)', type: 'number', defaultValue: 75, step: 5 },
      { id: 'startState', label: 'Starting Battery Level (%)', type: 'number', defaultValue: 10, min: 0, max: 99, step: 5 },
      { id: 'endState', label: 'Target Charge State (%)', type: 'number', defaultValue: 80, min: 1, max: 100, step: 5 },
      { id: 'electricityRate', label: 'Utility Rate ($ per kWh)', type: 'number', defaultValue: 0.16, step: 0.01 },
      { id: 'chargerEfficiency', label: 'Charging Efficiency (%)', type: 'number', defaultValue: 90, min: 50, max: 100, step: 1 }
    ],
    formula: 'Energy Needed (kWh) = Battery Size * (End % - Start %) / 100 / (Efficiency / 100)\nCharging Cost = Energy Needed * Electricity Rate',
    explanation: 'Home EV chargers lose about 10% to 15% of grid electricity as heat during the conversion of alternating current (AC) to direct current (DC). This tool factors in charger efficiency losses to output real utility billing charges.',
    example: 'Charging a 75 kWh battery from 10% to 80% requires adding 52.5 kWh of energy. Backed by a 90% charging efficiency, the total grid energy drawn is 58.3 kWh, costing $9.33 at a $0.16/kWh rate.',
    faq: [
      { question: 'Why is EV charging not 100% efficient?', answer: 'Thermal heat generation in high-power wiring, cooling fan activity, and inverter conversion loops waste minor fractions of incoming grid power.' },
      { question: 'Is domestic charging cheaper than commercial fast charging?', answer: 'Typically, yes. Commercial Level 3 DC fast charging often costs 2 to 3 times more per kWh due to premium network demands.' }
    ],
    relatedSlugs: ['car-payment-calculator', 'car-lease-calculator'],
    keywords: ['ev charge cost', 'tesla charge solver', 'electric car utility cost', 'kwh power expense'],
    calculate: (inputs) => {
      const size = Number(inputs.batterySize || 75);
      const start = Number(inputs.startState || 10);
      const end = Number(inputs.endState || 80);
      const rate = Number(inputs.electricityRate || 0.16);
      const eff = Number(inputs.chargerEfficiency || 90);

      const chargeDelta = Math.max(0, end - start);
      const addedKwhNet = size * (chargeDelta / 100);
      const addedKwhGross = eff > 0 ? addedKwhNet / (eff / 100) : 0;
      const cost = addedKwhGross * rate;

      return {
        results: [
          { label: 'Estimated Cost to Charge', value: cost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Grid Electricity Drawn', value: addedKwhGross.toFixed(1), unit: 'kWh' },
          { label: 'Net Battery Energy Added', value: addedKwhNet.toFixed(1), unit: 'kWh' },
          { label: 'Theoretical Cost at 100% Efficiency', value: (addedKwhNet * rate).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Charged Power Cost', value: Math.round(cost), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'tire-size-calculator',
    name: 'Tire Size Calculator',
    slug: 'tire-size-calculator',
    category: 'engineering',
    description: 'Compare two different tire sizes to see differences in sidewall height, overall diameter, and speedometer delta.',
    seoTitle: 'Tire Size Comparison & Speedometer Calculator | Calculatoora',
    seoDescription: 'Compare tire dimensions and speedometer speed error percentage when altering vehicle wheel diameters.',
    inputs: [
      { id: 'width1', label: 'Tire 1 Width (mm)', type: 'number', defaultValue: 225, step: 5 },
      { id: 'aspect1', label: 'Tire 1 Aspect Ratio (%)', type: 'number', defaultValue: 45, step: 5 },
      { id: 'rim1', label: 'Tire 1 Rim Diameter (inches)', type: 'number', defaultValue: 18, step: 1 },
      { id: 'width2', label: 'Tire 2 Width (mm)', type: 'number', defaultValue: 245, step: 5 },
      { id: 'aspect2', label: 'Tire 2 Aspect Ratio (%)', type: 'number', defaultValue: 40, step: 5 },
      { id: 'rim2', label: 'Tire 2 Rim Diameter (inches)', type: 'number', defaultValue: 19, step: 1 }
    ],
    formula: 'Sidewall Height = Width * (Aspect Ratio / 100)\nOverall Diameter = (Sidewall Height * 2 / 25.4) + Rim Diameter\nSpeedometer Difference % = (Diameter 2 - Diameter 1) / Diameter 1 * 100',
    explanation: 'Upgrading to larger custom rims or altering tire aspect ratios updates the total wheel diameter. This calculator exposes changes to ride height, tire clearance, and errors in speedometer logs caused by changing circumference metrics.',
    example: 'Transitioning from 225/45R18 (Diameter: 25.97 inches) to 245/40R19 (Diameter: 26.72 inches) increases the overall diameter by 2.9%. When your speedometer reads 60 mph, you are actually traveling at 61.7 mph.',
    faq: [
      { question: 'What is deep tire aspect ratio?', answer: 'The percentage rating of a tire\'s sidewall section height compared to its flat tread width.' },
      { question: 'Can diameter mismatch damage AWD drivetrains?', answer: 'Yes! All-Wheel Drive (AWD) computers require uniform rotational feeds. Minor variations in tire diameters can trigger major heat wear in differentials.' }
    ],
    relatedSlugs: ['car-payment-calculator', 'fuel-consumption-calculator'],
    keywords: ['tire comparison', 'wheel size calculator', 'speedometer correction', 'sidewall thickness'],
    calculate: (inputs) => {
      const w1 = Number(inputs.width1 || 225);
      const a1 = Number(inputs.aspect1 || 45);
      const r1 = Number(inputs.rim1 || 18);
      const w2 = Number(inputs.width2 || 245);
      const a2 = Number(inputs.aspect2 || 40);
      const r2 = Number(inputs.rim2 || 19);

      const side1Mm = w1 * (a1 / 100);
      const side1In = side1Mm / 25.4;
      const diam1 = (side1In * 2) + r1;

      const side2Mm = w2 * (a2 / 100);
      const side2In = side2Mm / 25.4;
      const diam2 = (side2In * 2) + r2;

      const diffPct = ((diam2 - diam1) / diam1) * 100;
      const actualSpeedAt60 = 60 * (diam2 / diam1);

      return {
        results: [
          { label: 'Tire 1 Overall Diameter', value: diam1.toFixed(2), unit: 'inches' },
          { label: 'Tire 2 Overall Diameter', value: diam2.toFixed(2), unit: 'inches' },
          { label: 'Diameter Variance Percentage', value: diffPct.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Actual Speed at 60 mph Display', value: actualSpeedAt60.toFixed(1), unit: 'mph' },
          { label: 'Tire 2 Sidewall Thickness', value: side2Mm.toFixed(0), unit: 'mm' }
        ],
        chartData: [
          { name: 'Tire 1 Diam', value: Math.round(diam1 * 10) },
          { name: 'Tire 2 Diam', value: Math.round(diam2 * 10) }
        ]
      };
    }
  },
  {
    id: 'horsepower-calculator',
    name: 'Horsepower Calculator',
    slug: 'horsepower-calculator',
    category: 'engineering',
    description: 'Calculate engine horsepower or torque based on dynamic mechanical rotation variables.',
    seoTitle: 'Engine Horsepower & Torque RPM Calculator | Calculatoora',
    seoDescription: 'Obtain engine HP from crankshaft rotational velocity. Free engine torque tool.',
    inputs: [
      { id: 'torque', label: 'Engine Shaft Torque (lb-ft)', type: 'number', defaultValue: 300, step: 10 },
      { id: 'rpmValue', label: 'Rotational Velocity (RPM)', type: 'number', defaultValue: 5252, min: 500, max: 15000, step: 250 }
    ],
    formula: 'Power (HP) = [Torque (lb-ft) * RPM] / 5252\nTorque (lb-ft) = [HP * 5252] / RPM',
    explanation: 'Horsepower represents the total physical mechanical rate of work performed. Since HP is derived mathematically from mechanical torque multiplied by rotational velocity (RPM), at exactly 5252 RPM, Torque and Horsepower yields will always be equal.',
    example: 'An engine outputting 300 lb-ft of torque at 6000 RPM produces exactly 342.7 HP.',
    faq: [
      { question: 'Why does the graph intersect at 5252?', answer: 'The conversion factor 5252 is derived from the definition of horsepower relative to angular velocity measurements in radians.' }
    ],
    relatedSlugs: ['car-payment-calculator', 'tire-size-calculator'],
    keywords: ['engine horsepower', 'torque converter', 'automotive performance', 'rpm tool'],
    calculate: (inputs) => {
      const t = Number(inputs.torque || 300);
      const rpm = Number(inputs.rpmValue || 5252);

      const hp = (t * rpm) / 5252;

      return {
        results: [
          { label: 'Estimated Shaft Horsepower (HP)', value: hp.toFixed(1), unit: 'HP', isPrimary: true },
          { label: 'Input Crankshaft Torque', value: t.toFixed(0), unit: 'lb-ft' },
          { label: 'Spindle Shaft Speed', value: rpm.toFixed(0), unit: 'RPM' }
        ],
        chartData: [
          { name: 'HP Metric', value: Math.round(hp) },
          { name: 'Torque Metric', value: Math.round(t) }
        ]
      };
    }
  },

  // ==================== CATEGORY: AVIATION ====================
  {
    id: 'flight-time-calculator',
    name: 'Flight Time Calculator',
    slug: 'flight-time-calculator',
    category: 'science',
    description: 'Calculate aviation flight duration based on flat distance, cruising speed, and headwind/tailwind coefficients.',
    seoTitle: 'Aviation Flight Time & Wind Drift Calculator | Calculatoora',
    seoDescription: 'Find approximate gate-to-gate flight durations factoring in cruising speed, wind, and altitude climbs.',
    inputs: [
      { id: 'distanceMiles', label: 'Total Flight Distance (Nautical Miles)', type: 'number', defaultValue: 1200, step: 50 },
      { id: 'cruiseSpeed', label: 'Cruise True Airspeed (TAS - Knots)', type: 'number', defaultValue: 450, step: 10 },
      { id: 'windVector', label: 'Wind speed vector (- for headwind, + for tailwind)', type: 'number', defaultValue: -25, step: 5 },
      { id: 'taxiTime', label: 'Ground Taxi & Climb Overhead (Minutes)', type: 'number', defaultValue: 30, min: 0, max: 120, step: 5 }
    ],
    formula: 'Ground Speed (GS) = True Airspeed + Wind Vector\nFlight Time (Hours) = (Distance / GS) + (Taxi Overhead / 60)',
    explanation: 'Aviation flight planners calculate dynamic Ground Speed by adjusting TAS for atmospheric wind direction variables. Total estimated time on route maps this net airspeed to geographic coordinates, appending ground taxi buffers.',
    example: 'For a 1200 nautical mile flight at 450 knots TAS against a 25-knot headwind (Ground Speed = 425 knots), flight time is 2.82 hours (2 hours 49 minutes) plus 30 minutes ground overhead, equaling 3h 19m.',
    faq: [
      { question: 'Why does wind direction matter so much in aviation?', answer: 'An aircraft flies suspended in a moving block of air. A tailwind carries the coordinate frame ahead, increasing speed over the ground, while headwind forces represent persistent air drag.' }
    ],
    relatedSlugs: ['mach-number-calculator', 'nautical-distance-calculator'],
    keywords: ['flight time', 'ground speed', 'nautical calculation', 'wind vector'],
    calculate: (inputs) => {
      const dist = Number(inputs.distanceMiles || 1200);
      const tas = Number(inputs.cruiseSpeed || 450);
      const wind = Number(inputs.windVector || -25);
      const taxi = Number(inputs.taxiTime || 30);

      const gs = Math.max(50, tas + wind);
      const airHours = dist / gs;
      const totalHours = airHours + (taxi / 60);

      const hrs = Math.floor(totalHours);
      const mins = Math.round((totalHours - hrs) * 60);

      return {
        results: [
          { label: 'Total Door-to-Door Duration', value: `${hrs}h ${mins}m`, isPrimary: true },
          { label: 'Net Ground-Speed (GS)', value: gs.toFixed(0), unit: 'knots' },
          { label: 'Cruising Flight Duration ONLY', value: airHours.toFixed(2), unit: 'hours' },
          { label: 'Assumed Ground Buffer Time', value: taxi.toFixed(0), unit: 'mins' }
        ],
        chartData: [
          { name: 'Ground Speed', value: gs },
          { name: 'True Airspeed', value: tas }
        ]
      };
    }
  },
  {
    id: 'mach-number-calculator',
    name: 'Mach Number Calculator',
    slug: 'mach-number-calculator',
    category: 'science',
    description: 'Calculate mach speeds based on airspeed and local ambient temperature coordinates.',
    seoTitle: 'Mach Number Airspeed Calculator | Calculatoora',
    seoDescription: 'Calculate Mach threshold speeds from flight inputs and local atmospheric temperature readings.',
    inputs: [
      { id: 'airspeedKnots', label: 'True Airspeed (TAS - Knots)', type: 'number', defaultValue: 350, step: 10 },
      { id: 'altitudeFeet', label: 'Flight Altitude (Feet)', type: 'number', defaultValue: 30000, step: 1000 }
    ],
    formula: 'Speed of Sound (a) = 29.037 * Sqrt(Temp in Kelvin)\nWhere Temp standard atmospheric lapse is calculated at altitude.\nMach = True Airspeed / Speed of Sound',
    explanation: 'The speed of sound is not a fixed physical constant; it varies with absolute ambient atmospheric temperature. This calculator projects local air temperature at altitude under the standard ICAO atmosphere model to define supersonic thresholds.',
    example: 'At 30,000 feet, standard temperature drops to -44.4°C. The speed of sound becomes approximately 589 knots. Flying at 350 knots TAS corresponds to exactly Mach 0.59.',
    faq: [
      { question: 'What is Mach 1?', answer: 'Mach 1 represents the local speed of sound. Going beyond this speed means traveling faster than acoustic pressure waves can form, triggering supersonic sonic booms.' }
    ],
    relatedSlugs: ['flight-time-calculator'],
    keywords: ['mach number', 'speed of sound', 'aviation physics', 'supersonic speed'],
    calculate: (inputs) => {
      const tas = Number(inputs.airspeedKnots || 350);
      const alt = Number(inputs.altitudeFeet || 30000);

      // Simple ISA model: Sea level = 15C, temp lapse -1.98C per 1000ft
      const isaTempC = Math.max(-56.5, 15 - (1.98 * alt / 1000));
      const tempK = isaTempC + 273.15;
      
      // Speed of sound in knots: a = c = 38.967 * Sqrt(K)
      const speedOfSoundKnots = 38.967 * Math.sqrt(tempK);
      const mach = tas / speedOfSoundKnots;

      return {
        results: [
          { label: 'Equivalent Speed Ratio (Mach)', value: mach.toFixed(3), isPrimary: true },
          { label: 'Local Speed of Sound', value: speedOfSoundKnots.toFixed(1), unit: 'knots' },
          { label: 'Assumed ISA air Temperature', value: isaTempC.toFixed(1), unit: '°C' }
        ],
        chartData: [
          { name: 'Airspeed', value: tas },
          { name: 'Acoustic Lim', value: Math.round(speedOfSoundKnots) }
        ]
      };
    }
  },

  // ==================== CATEGORY: MARINE / BOATING ====================
  {
    id: 'boat-speed-calculator',
    name: 'Boat Speed Calculator',
    slug: 'boat-speed-calculator',
    category: 'science',
    description: 'Calculate a vessel\'s theoretical displacement hull speed limit based on its load water line length (LWL).',
    seoTitle: 'Theoretical Boat Hull Speed Calculator | Calculatoora',
    seoDescription: 'Find maximum displacement speeds of sailing and motor yachts based on physical waterline dimensions.',
    inputs: [
      { id: 'lwlFeet', label: 'Waterline length (LWL - Feet)', type: 'number', defaultValue: 36, min: 5, max: 200, step: 1 }
    ],
    formula: 'Theoretical Hull Speed (Knots) = 1.34 * Sqrt(LWL in feet)',
    explanation: 'Displacement boat hulls push a volume of local water. This physically shapes a wave system that grows with velocity. A boat cannot easily climb over its bow wave, establishing a physical displacement hull speed wall defined purely by waterline dimensions.',
    example: 'A modern yacht with a 36-foot waterline (LWL) has a theoretical top displacement hull speed of 1.34 * Sqrt(36) = 8.04 knots.',
    faq: [
      { question: 'Can displacement boats go faster than hull speed?', answer: 'Only if they are lightweight planing hulls or multihulls that possess sufficient engine power to climb past physical water mounds, skimming on the surface.' }
    ],
    relatedSlugs: ['nautical-distance-calculator'],
    keywords: ['displacement boat', 'hull speed sailboat', 'waterline calculation', 'vessel velocity'],
    calculate: (inputs) => {
      const lwl = Number(inputs.lwlFeet || 36);
      const speed = 1.34 * Math.sqrt(lwl);

      return {
        results: [
          { label: 'Theoretical Top Hull Speed', value: speed.toFixed(2), unit: 'knots', isPrimary: true },
          { label: 'Speed in standard Miles Per Hour', value: (speed * 1.15078).toFixed(2), unit: 'mph' },
          { label: 'Speed in Kilometers Per Hour', value: (speed * 1.852).toFixed(2), unit: 'km/h' }
        ],
        chartData: [
          { name: 'Hull Speed (kts)', value: Math.round(speed * 10) }
        ]
      };
    }
  },
  {
    id: 'nautical-distance-calculator',
    name: 'Nautical Distance Calculator',
    slug: 'nautical-distance-calculator',
    category: 'science',
    description: 'Convert travel distances seamlessly between standard land miles, metric kilometers, and aviation nautical miles.',
    seoTitle: 'Nautical Distance Conversion Calculator | Calculatoora',
    seoDescription: 'Calculate metric and imperial conversions of nautical miles for maritime and aviation planning.',
    inputs: [
      { id: 'inputDistance', label: 'Distance Value to Convert', type: 'number', defaultValue: 100, step: 10 },
      { id: 'inputUnit', label: 'Starting Distance Unit', type: 'select', defaultValue: 'naut', options: [
        { label: 'Nautical Miles (NM)', value: 'naut' },
        { label: 'Statute Miles (mi)', value: 'stat' },
        { label: 'Kilometers (km)', value: 'km' }
      ]}
    ],
    formula: '1 NM = 1.15078 Statute Miles = 1.852 Kilometers',
    explanation: 'Nautical miles represent distance wrapped to the Earth\'s physical sphere coordinates, with 1 NM defining exactly one arc-minute of latitude.',
    example: 'A maritime course of 100 Nautical Miles (NM) converts to exactly 115.1 statute miles or 185.2 kilometers.',
    faq: [
      { question: 'Why do aviation and shipping use nautical miles?', answer: 'Because standard NM dimensions tie directly to meridian circles and standard global grid coordinates, simplifying sea route tracking.' }
    ],
    relatedSlugs: ['boat-speed-calculator', 'flight-time-calculator'],
    keywords: ['nautical miles conversion', 'distance convert', 'aviation miles', 'sea distance planner'],
    calculate: (inputs) => {
      const val = Number(inputs.inputDistance || 100);
      const unit = inputs.inputUnit || 'naut';

      let nm = 0;
      if (unit === 'naut') nm = val;
      else if (unit === 'stat') nm = val / 1.15078;
      else if (unit === 'km') nm = val / 1.852;

      const stat = nm * 1.15078;
      const km = nm * 1.852;

      return {
        results: [
          { label: 'Converted Nautical Miles (NM)', value: nm.toFixed(2), unit: 'NM', isPrimary: unit === 'naut' ? false : true },
          { label: 'Equivalent Statute Miles (mi)', value: stat.toFixed(2), unit: 'miles' },
          { label: 'Equivalent Kilometers (km)', value: km.toFixed(2), unit: 'km' }
        ],
        chartData: [
          { name: 'Nautical', value: Math.round(nm) },
          { name: 'Statute mi', value: Math.round(stat) },
          { name: 'Metric km', value: Math.round(km) }
        ]
      };
    }
  },

  // ==================== CATEGORY: CONSTRUCTION ====================
  {
    id: 'concrete-calculator',
    name: 'Concrete Calculator',
    slug: 'concrete-calculator',
    category: 'construction',
    description: 'Calculate structural poured concrete volumes in cubic yards and standard 60lb/80lb bag counts based on dimensions.',
    seoTitle: 'Concrete Slab Slab Volume & Bag Calculator | Calculatoora',
    seoDescription: 'Determine concrete volumes for slabs, footings, or post holes. Calculate counts of premixed bags instantly.',
    inputs: [
      { id: 'length', label: 'Slab Length (Feet)', type: 'number', defaultValue: 10, step: 1 },
      { id: 'width', label: 'Slab Width (Feet)', type: 'number', defaultValue: 10, step: 1 },
      { id: 'thickness', label: 'Slab Thickness (Inches)', type: 'number', defaultValue: 4, min: 1, max: 24, step: 1 },
      { id: 'wastePct', label: 'Included Waste Contingency (%)', type: 'number', defaultValue: 10, min: 0, max: 50, step: 1 }
    ],
    formula: 'Volume (Cu Ft) = Length * Width * (Thickness / 12)\nVolume (Cu Yards) = Volume (Cu Ft) / 27\nTotal Bags (80lb) = Volume (Cu Ft) / 0.60',
    explanation: 'Poured construction slabs and footings require precise volume predictions. Premixed dry concrete bags produce a set volume of liquid slurry upon mixing. This tool converts structural footprint dimensions directly into clean material counts.',
    example: 'Pouring a 10ft x 10ft patio slab at 4 inches thick yields 33.3 cubic feet of required compound. Factoring in 10% contingency, you require 1.36 cubic yards of dry mix, which translates to roughly 61 standard 80lb bags.',
    faq: [
      { question: 'How much volume does an 80lb bag of dry concrete yield?', answer: 'One standard 80lb bag of premixed concrete powder yields approximately 0.60 cubic feet of liquid slurry.' },
      { question: 'What is a typical slab depth for house driveways?', answer: 'Residential driveways supporting vehicle loads require an absolute minimum thickness of 4 inches over solid gravel baselines.' }
    ],
    relatedSlugs: ['brick-calculator', 'wall-area-calculator'],
    keywords: ['concrete volume', 'cement bag calculator', 'slab material estimator', 'cubic yards builder'],
    calculate: (inputs) => {
      const len = Number(inputs.length || 10);
      const wid = Number(inputs.width || 10);
      const thick = Number(inputs.thickness || 4);
      const waste = Number(inputs.wastePct || 10);

      const baseCuFt = len * wid * (thick / 12);
      const totalCuFt = baseCuFt * (1 + waste / 100);
      const cuYards = totalCuFt / 27;

      // Bag volumes: 80lb bag matches 0.60 cu ft, 60lb bag matches 0.45 cu ft
      const bags80 = totalCuFt / 0.60;
      const bags60 = totalCuFt / 0.45;

      return {
        results: [
          { label: 'Required Concrete Volume', value: cuYards.toFixed(2), unit: 'Cubic Yards', isPrimary: true },
          { label: 'Total Volume in Cubic Feet', value: totalCuFt.toFixed(1), unit: 'cu ft' },
          { label: 'Standard 80lb Premix Bag Count', value: Math.ceil(bags80), unit: 'bags' },
          { label: 'Standard 60lb Premix Bag Count', value: Math.ceil(bags60), unit: 'bags' }
        ],
        chartData: [
          { name: 'Slab Area', value: len * wid },
          { name: 'Cubic Volume', value: Math.round(totalCuFt) }
        ]
      };
    }
  },
  {
    id: 'construction-calculator',
    name: 'Construction Calculator',
    slug: 'construction-calculator',
    category: 'construction',
    description: 'The world\'s most advanced professional-grade contractor-level construction estimator and planning hub.',
    seoTitle: 'Ultimate Construction Cost & Material Estimator | Calculatoora',
    seoDescription: 'Calculate structural material takeoff lists, project volumes, overall costs, wastage buffers, and labor timelines instantly with our premium estimator.',
    inputs: [
      { id: 'areaLength', label: 'Project Length', type: 'number', defaultValue: 15 },
      { id: 'areaWidth', label: 'Project Width', type: 'number', defaultValue: 10 }
    ],
    formula: 'Area = Length * Width\nVolume = Length * Width * Thickness\nGrand Cost = Materials + Labor + Rent + Transport + Taxes',
    explanation: 'Professional construction planning relies on material takeoff sheets and meticulous waste multipliers. This engine converts structural sizes into itemized component counts dynamically.',
    example: 'Planning a residential house footprint of 45ft x 30ft with 10ft ceiling height outputs 1,350 sq ft of floor area and 500 cubic yards of internal volume, requiring custom steel rebar, structural framing, and concrete bag count calculations.',
    faq: [
      { question: 'Why does every input start empty on the Construction planning hub?', answer: 'Professional contractor builds must start with neutral default metrics to avoid unverified hidden numbers affecting multi-material totals.' }
    ],
    relatedSlugs: ['concrete-calculator', 'brick-calculator'],
    keywords: ['Construction Calculator', 'Building Material Calculator', 'Construction Cost Calculator', 'Building Calculator', 'Construction Estimator', 'Home Construction Calculator'],
    calculate: () => {
      return {
        results: [],
        chartData: []
      };
    }
  },
  {
    id: 'brick-calculator',
    name: 'Brick and Mortar Calculator',
    slug: 'brick-calculator',
    category: 'construction',
    description: 'Calculate standard bricks and mortar bags required to construct walls based on dimensional area inputs.',
    seoTitle: 'Masonry Brick & Mortar Bag Calculator | Calculatoora',
    seoDescription: 'Estimate brick counts and mortar requirements for structural masonry walls. Standard and custom brick sizes supported.',
    inputs: [
      { id: 'wallLen', label: 'Wall Total Length (Feet)', type: 'number', defaultValue: 12, step: 1 },
      { id: 'wallHt', label: 'Wall Total Height (Feet)', type: 'number', defaultValue: 6, step: 1 },
      { id: 'brickType', label: 'Standard Brick Dimensions', type: 'select', defaultValue: 'modular', options: [
        { label: 'Standard Modular (7-5/8" x 2-1/4" x 3-5/8")', value: 'modular' },
        { label: 'Queen Size Brick (9-5/8" x 2-3/4" x 2-3/4")', value: 'queen' },
        { label: 'Roman Size Brick (11-5/8" x 1-5/8" x 3-5/8")', value: 'roman' }
      ]},
      { id: 'jointSize', label: 'Mortar Joint Thickness (Inches)', type: 'number', defaultValue: 0.375, min: 0.25, max: 0.75, step: 0.125 },
      { id: 'wastePct', label: 'Breakage Contingency (%)', type: 'number', defaultValue: 10, min: 0, max: 30, step: 5 }
    ],
    formula: 'Surface area of wall = Length * Height\nEff Brick Area = (Brick Length + Joint) * (Brick Height + Joint)\nBricks Count = Wall Area / Eff Brick Area\nMortar volume derived from standard masonry yields.',
    explanation: 'Masonry builds are planned by calculating brick sizes added to surrounding mortar joint depths. Dividing total wall area by this effective brick footprint gives accurate structural component units.',
    example: 'Building a 12ft x 6ft wall (72 sq ft area) using modular bricks with standard 3/8" joints requires about 490 bricks. With a 10% waste buffer, aim for 539 bricks and 4 bags of structural masonry mortar.',
    faq: [
      { question: 'What is structural mortar joint thickness?', answer: 'The standard joint thickness is 3/8" (0.375 inches), balancing brick bonding tolerances with mortar compound durability.' }
    ],
    relatedSlugs: ['concrete-calculator', 'wall-area-calculator'],
    keywords: ['brick wall calculator', 'masonry math', 'mortar count', 'wall bricks'],
    calculate: (inputs) => {
      const len = Number(inputs.wallLen || 12);
      const ht = Number(inputs.wallHt || 6);
      const bType = inputs.brickType || 'modular';
      const joint = Number(inputs.jointSize || 0.375);
      const waste = Number(inputs.wastePct || 10);

      const wallArea = len * ht * 144; // sq inches

      let bL = 7.625;
      let bH = 2.25;
      if (bType === 'queen') { bL = 9.625; bH = 2.75; }
      else if (bType === 'roman') { bL = 11.625; bH = 1.625; }

      const effL = bL + joint;
      const effH = bH + joint;
      const effArea = effL * effH;

      const baseBricks = wallArea / effArea;
      const finalBricks = Math.ceil(baseBricks * (1 + waste / 100));
      const mortarBags = Math.ceil(finalBricks * 0.0075); // approx mortar bags per brick

      return {
        results: [
          { label: 'Bricks Unit Count Required', value: finalBricks, unit: 'pcs', isPrimary: true },
          { label: 'Total Wall Surface Area', value: (len * ht).toFixed(1), unit: 'sq ft' },
          { label: 'Masonry Mortar Bags (80lb)', value: mortarBags, unit: 'bags' },
          { label: 'Estimated Structural Brick Weight', value: Math.round(finalBricks * 4.5), unit: 'lbs' }
        ],
        chartData: [
          { name: 'Bricks Count', value: finalBricks }
        ]
      };
    }
  },
  {
    id: 'wall-area-calculator',
    name: 'Wall Area & Paint Estimator',
    slug: 'wall-area-calculator',
    category: 'construction',
    description: 'Calculate net square footage of walls, deducting doors and window cutouts to buy correct quantities of paint or wall coverings.',
    seoTitle: 'Interior Wall Area & Paint Gallon Calculator | Calculatoora',
    seoDescription: 'Determine exact surface areas for room walls, minus openings. Estimate required paint volumes instantly.',
    inputs: [
      { id: 'roomL', label: 'Room Length (Feet)', type: 'number', defaultValue: 15, step: 1 },
      { id: 'roomW', label: 'Room Width (Feet)', type: 'number', defaultValue: 12, step: 1 },
      { id: 'roomH', label: 'Ceiling Height (Feet)', type: 'number', defaultValue: 8, min: 6, max: 18, step: 1 },
      { id: 'doorsCount', label: 'Number of standard Doors', type: 'number', defaultValue: 1, min: 0, max: 10 },
      { id: 'windowsCount', label: 'Number of standard Windows', type: 'number', defaultValue: 2, min: 0, max: 20 },
      { id: 'paintCoats', label: 'Number of Paint Coats desired', type: 'number', defaultValue: 2, min: 1, max: 4 }
    ],
    formula: 'Wall Area Gross = 2 * (Length + Width) * Height\nDeductions = (DoorCount * 21) + (WindowCount * 15)\nPaint Gallons = Net Area * Coats / 350',
    explanation: 'Standard professional calculations isolate real paint footprint sizes by subtracting unpainted openings. A single gallon of standard latex paint typically covers about 350 square feet of smooth drywall.',
    example: 'For a 15ft x 12ft room with 8ft ceilings, gross wall surface area is 432 sq ft. Subtracting 1 door (21 sq ft) and 2 windows (30 sq ft) gives a net wall area of 381 sq ft. To apply 2 coats, you require 2.18 gallons of paint.',
    faq: [
      { question: 'What coverage is assumed for paint gallons?', answer: 'Professional paint projects assume roughly 350 to 400 square feet per gallon of primer or premium paint.' }
    ],
    relatedSlugs: ['concrete-calculator', 'brick-calculator'],
    keywords: ['paint estimator', 'wall covering surface', 'wall template square footage', 'drywall area calculator'],
    calculate: (inputs) => {
      const len = Number(inputs.roomL || 15);
      const wid = Number(inputs.roomW || 12);
      const ht = Number(inputs.roomH || 8);
      const doors = Number(inputs.doorsCount || 1);
      const windows = Number(inputs.windowsCount || 2);
      const coats = Number(inputs.paintCoats || 2);

      const gross = 2 * (len + wid) * ht;
      const deductions = (doors * 21) + (windows * 15);
      const net = Math.max(0, gross - deductions);

      const gallonsNeeded = (net * coats) / 350;

      return {
        results: [
          { label: 'Net Wall Surface Area', value: net.toFixed(1), unit: 'sq ft', isPrimary: true },
          { label: 'Required Primers/Paints', value: gallonsNeeded.toFixed(2), unit: 'gallons' },
          { label: 'Gross Area before Deductions', value: gross.toFixed(1), unit: 'sq ft' },
          { label: 'Sum Cutout Deductions', value: deductions.toFixed(1), unit: 'sq ft' }
        ],
        chartData: [
          { name: 'Net Painted Area', value: Math.round(net) },
          { name: 'Unpainted Cutouts', value: Math.round(deductions) }
        ]
      };
    }
  },

  // ==================== CATEGORY: HOME FINANCE ====================
  {
    id: 'renovation-budget-calculator',
    name: 'Home Renovation Budget Calculator',
    slug: 'renovation-budget-calculator',
    category: 'finance',
    description: 'Establish initial capital allocations for partial or complete home remodeling drafts based on material tiers.',
    seoTitle: 'Home Renovation Budget Planner Calculator | Calculatoora',
    seoDescription: 'Plan cost allocation splits for kitchen, bathroom, and structural interior remodeling projects.',
    inputs: [
      { id: 'remodelArea', label: 'Target Floor Area (sq ft)', type: 'number', defaultValue: 1200, step: 100 },
      { id: 'qualityTier', label: 'Construction finish standard', type: 'select', defaultValue: 'mid', options: [
        { label: 'Budget/DIY (Standard components)', value: 'low' },
        { label: 'Mid-Tier Professional (General builds)', value: 'mid' },
        { label: 'High-End Premium (Custom millwork & architecture)', value: 'hand' }
      ]},
      { id: 'contingencyFactor', label: 'Allowance Contingency Buffer (%)', type: 'number', defaultValue: 15, min: 5, max: 40, step: 5 }
    ],
    formula: 'Low: $50 / sq ft, Mid: $125 / sq ft, High-end: $275 / sq ft\nBudget Net = Area * CostPerSqFt\nBudget Total = Budget Net * (1 + Contingency / 100)',
    explanation: 'Home renovations require strict project budget frameworks under a contingency safety net to cover hidden insulation, plumbing, or structurally damaged lumber once walls are opened.',
    example: 'Renovating a 1,200 sq ft home at a mid-tier spec ($125/sq ft) costs $150,000 baseline. Retaining a 15% contingency buffer brings the total project financing target to $172,500.',
    faq: [
      { question: 'What is a typical renovation contingency percentage?', answer: 'Between 15% to 20% is considered safe to manage supply line changes and surprise mechanical adjustments.' }
    ],
    relatedSlugs: ['concrete-calculator', 'wall-area-calculator'],
    keywords: ['home renovation budget', 'remodel cost estimator', 'remodeling calculator'],
    calculate: (inputs) => {
      const area = Number(inputs.remodelArea || 1200);
      const tier = inputs.qualityTier || 'mid';
      const cont = Number(inputs.contingencyFactor || 15);

      let subCost = 125;
      if (tier === 'low') subCost = 50;
      else if (tier === 'hand') subCost = 275;

      const base = area * subCost;
      const withCont = base * (1 + cont / 100);

      return {
        results: [
          { label: 'Total Targeted Capital Required', value: withCont.toFixed(0), unit: '$', isPrimary: true },
          { label: 'Base Construction Estimate', value: base.toFixed(0), unit: '$' },
          { label: 'Project Contingency Buffer Cash', value: (withCont - base).toFixed(0), unit: '$' },
          { label: 'Assumed cost per square foot', value: subCost, unit: '$/sq ft' }
        ],
        chartData: [
          { name: 'Core Renovation', value: base },
          { name: 'Contingency', value: withCont - base }
        ]
      };
    }
  },

  // ==================== CATEGORY: ONLINE BUSINESS ====================
  {
    id: 'subscription-revenue-calculator',
    name: 'Subscription Revenue Forecaster',
    slug: 'subscription-revenue-calculator',
    category: 'finance',
    description: 'Forecast SaaS monthly recurring revenue (MRR) and annual recurring revenue (ARR) growth over time under subscriber churn inputs.',
    seoTitle: 'SaaS Subscription MRR & Churn Revenue Calculator | Calculatoora',
    seoDescription: 'Obtain multi-month MRR and ARR curves based on active growth additions and subscription churn ratios.',
    inputs: [
      { id: 'startingMrr', label: 'Starting subscription MRR ($)', type: 'number', defaultValue: 5000, step: 500 },
      { id: 'newMrrMonthly', label: 'New monthly MRR growth ($)', type: 'number', defaultValue: 1200, step: 100 },
      { id: 'churnRate', label: 'Monthly Subscriber Churn Rate (%)', type: 'number', defaultValue: 4.5, min: 0, max: 50, step: 0.1 },
      { id: 'forecastMonths', label: 'Forecast Period Span (Months)', type: 'number', defaultValue: 12, min: 6, max: 36, step: 6 }
    ],
    formula: 'Next Month MRR = Current MRR + New Monthly Growth - (Current MRR * Churn Rate)\nAnnual ARR = Current MRR * 12',
    explanation: 'SaaS growth represents a race between customer acquisition rate and subscriber subscriber attrition (churn rate). High churn leaks MRR, capping ultimate potential growth thresholds.',
    example: 'Starting with $5,000 MRR, adding $1,200 MRR monthly, under a 4.5% churn results in $13,678 MRR by month 12. Churn offset cancels out growth faster as base MRR scales.',
    faq: [
      { question: 'What is a healthy monthly churn rate limit?', answer: 'For standard B2B SaaS startups, a churn below 2% monthly is considered excellent. Higher B2C churn can exceed 5%.' }
    ],
    relatedSlugs: ['renovation-budget-calculator'],
    keywords: ['saas mrr forecaster', 'recurrent revenue metric', 'churn cost estimator', 'subscribers arr calculator'],
    calculate: (inputs) => {
      const starting = Number(inputs.startingMrr || 5000);
      const addition = Number(inputs.newMrrMonthly || 1200);
      const churn = Number(inputs.churnRate || 4.5);
      const duration = Number(inputs.forecastMonths || 12);

      let currentMrr = starting;
      const chartData = [];
      chartData.push({ name: 'Start', MRR: Math.round(starting) });

      for (let m = 1; m <= duration; m++) {
        const churnLoss = currentMrr * (churn / 100);
        currentMrr = currentMrr + addition - churnLoss;
        chartData.push({ name: `M${m}`, MRR: Math.round(currentMrr) });
      }

      const arr = currentMrr * 12;

      return {
        results: [
          { label: `Projected MRR (Month ${duration})`, value: currentMrr.toFixed(0), unit: '$', isPrimary: true },
          { label: 'Projected ARR Runway Scale', value: arr.toFixed(0), unit: '$' },
          { label: 'Monthly Attrition Leak Rate', value: (currentMrr * (churn / 100)).toFixed(2), unit: '$/mo' }
        ],
        chartData
      };
    }
  },

  // ==================== CATEGORY: ENVIRONMENT ====================
  {
    id: 'carbon-footprint-calculator',
    name: 'Carbon Footprint Calculator',
    slug: 'carbon-footprint-calculator',
    category: 'science',
    description: 'Calculate your annual carbon footprint in metric tonnes of CO2 equivalent based on home utility and travel metrics.',
    seoTitle: 'Personal Carbon Footprint & Offset Calculator | Calculatoora',
    seoDescription: 'Quantify personal carbon dioxide equivalents based on monthly energy variables and flight behaviors.',
    inputs: [
      { id: 'electricityKwh', label: 'Monthly Home Electricity (kWh)', type: 'number', defaultValue: 650, step: 50 },
      { id: 'gasTherms', label: 'Monthly Home Gas (Therms)', type: 'number', defaultValue: 30, step: 5 },
      { id: 'carMiles', label: 'Annual Car Travel Distance (Miles)', type: 'number', defaultValue: 12000, step: 1000 },
      { id: 'carEfficiency', label: 'Average Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 25, min: 10, max: 100 },
      { id: 'flightsYrs', label: 'Yearly Short-Haul Flights Count', type: 'number', defaultValue: 3, min: 0 }
    ],
    formula: 'CO2 Elec = kWh * 0.857 lbs/kWh\nCO2 Gas = therms * 11.7 lbs/therm\nCO2 Auto = (Miles / MPG) * 19.6 lbs/gallon\nCO2 Flights = Flights * 550 lbs',
    explanation: 'Home electricity grid draws fossil fuels depending on local regional generation grids. This personal footprint uses average EPA coefficients to sum overall annual carbon emissions.',
    example: 'An average household with 12,000 driving miles (25 MPG), 650 kWh monthly electric use, and 3 flights emits roughly 9.5 metric tonnes of carbon emissions annually.',
    faq: [
      { question: 'How can I lower my residential carbon footprint?', answer: 'Transition to heat-pump climate solutions, upgrade appliances to premium heat standards, and choose utility providers operating solar facilities.' }
    ],
    relatedSlugs: ['nautical-distance-calculator'],
    keywords: ['carbon footprint', 'co2 equivalent calculator', 'emissions footprint tracker'],
    calculate: (inputs) => {
      const kwh = Number(inputs.electricityKwh || 650);
      const therms = Number(inputs.gasTherms || 30);
      const autoMiles = Number(inputs.carMiles || 12000);
      const mpg = Number(inputs.carEfficiency || 25);
      const flights = Number(inputs.flightsYrs || 3);

      // Conversions to annual lbs
      const elecAnnual = kwh * 12 * 0.857;
      const gasAnnual = therms * 12 * 11.7;
      const autoAnnual = mpg > 0 ? (autoMiles / mpg) * 19.6 : 0;
      const flightsAnnual = flights * 550;

      const totalLbs = elecAnnual + gasAnnual + autoAnnual + flightsAnnual;
      const metricTonnes = totalLbs / 2204.62;

      return {
        results: [
          { label: 'Annual Carbon Footprint', value: metricTonnes.toFixed(2), unit: 'Metric Tonnes CO2e', isPrimary: true },
          { label: 'Vehicle Emissions Share', value: (autoAnnual / 2204.62).toFixed(2), unit: 'tonnes' },
          { label: 'Utility Emissions Share', value: ((elecAnnual + gasAnnual) / 2204.62).toFixed(2), unit: 'tonnes' },
          { label: 'Tree Offsets Required to Balance', value: Math.ceil(metricTonnes * 45), unit: 'trees' }
        ],
        chartData: [
          { name: 'Vehicle', value: Math.round(autoAnnual) },
          { name: 'Utilities', value: Math.round(elecAnnual + gasAnnual) },
          { name: 'Flights', value: Math.round(flightsAnnual) }
        ]
      };
    }
  },

  // ==================== CATEGORY: FREELANCER ====================
  {
    id: 'freelance-hourly-rate-calculator',
    name: 'Freelancer Hourly Rate Calculator',
    slug: 'freelance-hourly-rate-calculator',
    category: 'finance',
    description: 'Calculate your target freelance freelance rate based on targeted standard net pay goals, taxes, overhead, and billable hour realities.',
    seoTitle: 'Freelance Hourly Rate Target Calculator | Calculatoora',
    seoDescription: 'Plan absolute freelancer hour billings factoring in self-employment taxes, equipment overhead, and vacation intervals.',
    inputs: [
      { id: 'targetNetPay', label: 'Desired Net Salary Goal ($)', type: 'number', defaultValue: 80000, step: 5000 },
      { id: 'overheadCosts', label: 'Annual Business Expenses ($)', type: 'number', defaultValue: 8000, step: 1000 },
      { id: 'taxReserve', label: 'Calculated Income Tax Reserve (%)', type: 'number', defaultValue: 30, min: 0, max: 60 },
      { id: 'vacationWeeks', label: 'Weeks off per year (Holiday/Sick)', type: 'number', defaultValue: 4, min: 0, max: 12 },
      { id: 'billableRatio', label: 'Weekly Billable Hours Limit', type: 'number', defaultValue: 25, min: 5, max: 40 }
    ],
    formula: 'Required Gross Revenue = (Net Salary + Overhead) / (1 - TaxRate/100)\nWorking Weeks = 52 - Vacation Weeks\nTotal Billable Hours = Working Weeks * Billable Hours Limit\nHourly Rate = Required Gross Revenue / Billable Hours',
    explanation: 'Freelancing requires setting rates high enough to insulate yourself against unbillable admin/marketing work, paid holiday pauses, and self-employment payroll obligations.',
    example: 'For an $80,000 net income target with $8,000 overhead and 30% taxes on gross, you need $122,860 gross revenue. Over 48 working weeks at 25 billable hours/week (1200 hours), your hourly rate target should be $102.38.',
    faq: [
      { question: 'Why are billable hours capped at 25 per week?', answer: 'In freelancing, substantial hours are drawn into accounting, proposal drafting, tool configuration, and client acquisition, capping absolute billable focuses.' }
    ],
    relatedSlugs: ['subscription-revenue-calculator'],
    keywords: ['freelance rate', 'hourly calculator', 'contractor pricing model', 'consultant math'],
    calculate: (inputs) => {
      const net = Number(inputs.targetNetPay || 80000);
      const overhead = Number(inputs.overheadCosts || 8000);
      const tax = Number(inputs.taxReserve || 30);
      const offWeeks = Number(inputs.vacationWeeks || 4);
      const bHours = Number(inputs.billableRatio || 25);

      const reqGross = (net + overhead) / (1 - tax / 100);
      const workWeeks = Math.max(1, 52 - offWeeks);
      const totalHours = workWeeks * bHours;
      const rate = totalHours > 0 ? reqGross / totalHours : 0;

      return {
        results: [
          { label: 'Minimum Billing Hourly Rate Target', value: rate.toFixed(2), unit: '$/hour', isPrimary: true },
          { label: 'Total Annual Gross Billing Target', value: reqGross.toFixed(0), unit: '$' },
          { label: 'Calculated Annual Income Taxes Paid', value: (reqGross * (tax / 100)).toFixed(0), unit: '$' },
          { label: 'Total Annual Billable hours', value: totalHours, unit: 'hours' }
        ],
        chartData: [
          { name: 'Target Net', value: net },
          { name: 'Overhead Costs', value: overhead },
          { name: 'Tax Pool', value: reqGross * (tax / 100) }
        ]
      };
    }
  },
  {
    id: 'love-calculator',
    name: 'Love Calculator',
    slug: 'love-calculator',
    category: 'lifestyle',
    description: 'The world\'s most beautiful interactive client-side Love Calculator. Find compatibility scores, timelines, and relation insights instantly.',
    seoTitle: 'Love Calculator – Free Online Love Match Calculator | Calculatoora',
    seoDescription: 'Calculate a fun love compatibility score instantly using our free Love Calculator. Beautiful, responsive, client-side, and privacy-friendly.',
    inputs: [
      { id: 'yourName', label: 'Your Name', type: 'text', defaultValue: '' },
      { id: 'partnerName', label: 'Partner\'s Name', type: 'text', defaultValue: '' }
    ],
    formula: 'Symmetrical Unicode mapping hash formula: SymmetricalNameSum(Name1, Name2) % 100',
    explanation: 'Find relationship chemistry metrics using ancient character mapping and date timeline comparisons for premium entertainment calculations.',
    example: 'Enter names like Alex and Taylor with an optional anniversary date to calculate compatibility score, timeline milestones, and premium digital share cards.',
    faq: [
      { question: 'Is the Love Calculator accurate?', answer: 'The calculations are for fun and entertainment purposes only. Relationships thrive on mutual communication, trust, respect, and deep emotional bonds, which cannot be measured by algorithms.' },
      { question: 'How is the score computed deterministically?', answer: 'The engine uses a stable mathematical hash based on Unicode values of characters in both names combined with chronological anniversary intervals. This ensures that the same entries always yield the same fun score.' }
    ],
    relatedSlugs: ['age-calculator', 'pregnancy-calculator', 'ovulation-calculator'],
    keywords: [
      'Love Calculator',
      'Relationship Calculator',
      'Love Match Calculator',
      'Couple Calculator',
      'Love Match Test',
      'Crush Calculator'
    ],
    calculate: (inputs) => {
      // Custom internal calculation handled dynamically inside component
      return {
        results: [
          { label: 'Cosmic Match Rating', value: '75', unit: '%', isPrimary: true }
        ],
        chartData: []
      };
    }
  },
  {
    id: 'car-payment-calculator',
    name: 'Car Payment Calculator',
    slug: 'car-payment-calculator',
    category: 'finance',
    description: 'Calculate your monthly car payment with our advanced auto loan estimator. Supports trade-ins, taxes, warranties, lease vs buy comparisons, and extra payment schedules.',
    seoTitle: 'Ultimate Car Payment Calculator - Live Amortization & Payoff Plan',
    seoDescription: 'Accurately estimate monthly car payments, trade-in values, sales tax, residual leases, and total auto ownership costs with our premium live auto loan payment calculator.',
    inputs: [
      { id: 'vehiclePrice', label: 'Vehicle Price', type: 'number', defaultValue: '' },
      { id: 'downPayment', label: 'Down Payment', type: 'number', defaultValue: '' },
      { id: 'interestRate', label: 'Interest Rate', type: 'number', defaultValue: '' },
      { id: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: '' }
    ],
    formula: 'PMT = P * [r(1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Finds your exact monthly auto payment using compounding interest calculations on the net amount financed (after factoring trade-ins, down payments, fees, and rebates).',
    example: 'Enter $35,000 for Vehicle Price, $5,000 for Down Payment, and 6.49% for Interest Rate over 60 months to see amortization schedules, smart suggestions, and lifetime ownership metrics.',
    faq: [
      { question: 'How is the monthly car payment calculated?', answer: 'It is computed using the monthly interest rate, total term, and the net financed amount. If there is a sales tax, dealer fees, or warranties, they are added to the principal before interest compiles.' },
      { question: 'What is a good payment-to-income ratio?', answer: 'A common rule of thumb is to keep your monthly car payment under 10% of your gross monthly income, and total auto ownership costs under 20%.' }
    ],
    relatedSlugs: ['emi-calculator', 'gas-mileage-calculator', 'savings-calculator'],
    keywords: [
      'Car Payment Calculator',
      'Monthly Car Payment Calculator',
      'Auto Payment Calculator',
      'Vehicle Payment Calculator',
      'Car Finance Calculator',
      'Car Loan Payment Calculator',
      'Lease vs Buy Calculator'
    ],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Monthly Payment', value: '0', unit: '$', isPrimary: true }
        ],
        chartData: []
      };
    }
  }
];
