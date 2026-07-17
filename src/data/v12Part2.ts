import { Calculator } from '../types';

export const V12_PART2_CALCULATORS: Calculator[] = [
  // ==================== REAL ESTATE PROFESSIONAL ====================
  {
    id: 'property-investment',
    name: 'Property Investment Calculator',
    slug: 'property-investment-calculator',
    category: 'real-estate-pro',
    description: 'Calculate property acquisition costs, loan metrics, and yearly cash-on-cash yield projections.',
    seoTitle: 'Property Investment Cash-on-Cash Return Calculator',
    seoDescription: 'Forecast your property acquisition yields and net returns with professional real estate metrics.',
    inputs: [
      { id: 'purchasePrice', label: 'Purchase Price ($)', type: 'number', defaultValue: 280000 },
      { id: 'downPayPct', label: 'Down Payment (%)', type: 'number', defaultValue: 20 },
      { id: 'monthlyExpenses', label: 'Monthly Operating Costs ($)', type: 'number', defaultValue: 800 },
      { id: 'monthlyRent', label: 'Expected Monthly Rent ($)', type: 'number', defaultValue: 2100 }
    ],
    formula: 'Cash Needed = Purchase Price * Down Payment %\nYearly NOI = (Rent * 12) - (Expenses * 12)\nCoC Yield = NOI / Cash Needed * 100',
    explanation: 'Investors use the Cash-on-Cash (CoC) yield metric to evaluate the performance of cash invested in income properties compared to other asset classes.',
    example: 'A $280,000 property purchased with 20% down ($56,000) that generates $2,100 in monthly rent against operating costs of $800 provides a 27.8% CoC return when purchased with cash.',
    faq: [{ question: 'What is a good Cash-on-Cash return?', answer: 'Real estate investors typically target a Cash-on-Cash return between 8% and 12%.' }],
    relatedSlugs: ['property-cash-flow-calculator', 'real-estate-roi-calculator'],
    keywords: ['real estate cash on cash return', 'property investment yield', 'noi margin calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice || 280000);
      const dp = Number(inputs.downPayPct || 20) / 100;
      const exp = Number(inputs.monthlyExpenses || 800);
      const rent = Number(inputs.monthlyRent || 2100);

      const cashNeeded = price * dp;
      const yearlyRent = rent * 12;
      const yearlyOp = exp * 12;
      const noi = yearlyRent - yearlyOp;
      const coc = cashNeeded > 0 ? (noi / cashNeeded) * 100 : 0;

      return {
        results: [
          { label: 'Estimated Cash-on-Cash Return', value: `${coc.toFixed(2)}%`, isPrimary: true },
          { label: 'Out-Of-Pocket Down Payment', value: cashNeeded.toLocaleString(), unit: '$' },
          { label: 'Annual Net Operating Income (NOI)', value: noi.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Operating Costs', value: yearlyOp },
          { name: 'Net Income Profit', value: Math.max(0, noi) }
        ]
      };
    }
  },
  {
    id: 'property-cash-flow',
    name: 'Property Cash Flow Calculator',
    slug: 'property-cash-flow-calculator',
    category: 'real-estate-pro',
    description: 'Calculate net operating income (NOI) and monthly property cash flow, accounting for vacancy reserves.',
    seoTitle: 'Rental Property Cash Flow & Vacancy Reserve Estimator',
    seoDescription: 'Obtain exact property cash flow projections after deducting vacancy reserves, taxes, and service fees.',
    inputs: [
      { id: 'grossRent', label: 'Expected Gross Monthly Rent ($)', type: 'number', defaultValue: 1800 },
      { id: 'vacancyPct', label: 'Vacancy Allocation reserve (%)', type: 'number', defaultValue: 5 },
      { id: 'mortgage', label: 'Monthly Mortgage Payment ($)', type: 'number', defaultValue: 950 },
      { id: 'hoaTaxes', label: 'Taxes, HOA, & Monthly Fees ($)', type: 'number', defaultValue: 350 }
    ],
    formula: 'Adjusted Rent = Gross Rent * (1 - Vacancy%)\nCash Flow = Adjusted Rent - Mortgage - Fees',
    explanation: 'Healthy cash flows require allocating a vacancy reserve (typically 5% to 8%) to cover times when the property is unrented.',
    example: 'Adjusting $1,800 gross rent for standard 5% vacancy ($90) covers mortgage and HOA fees, generating $500 in monthly net cash flow.',
    faq: [{ question: 'What is a vacancy rate?', answer: 'The historical percentage of time a property remains unrented.' }],
    relatedSlugs: ['rental-cash-flow-calculator', 'property-investment-calculator'],
    keywords: ['property cash flow yield', 'vacancy protection buffer', 'real estate ledger tool'],
    calculate: (inputs) => {
      const gRent = Number(inputs.grossRent || 1800);
      const vac = Number(inputs.vacancyPct || 5) / 100;
      const mort = Number(inputs.mortgage || 950);
      const fees = Number(inputs.hoaTaxes || 350);

      const realRent = gRent * (1 - vac);
      const cashflow = realRent - mort - fees;

      return {
        results: [
          { label: 'Net Monthly Cash Flow', value: cashflow.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Vacancy Loss Reserve', value: (gRent * vac).toFixed(2), unit: '$' },
          { label: 'Aggregate Debt & Operational Outlays', value: (mort + fees).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Mortgage & Fees', value: mort + fees },
          { name: 'Net Cash Flow', value: Math.max(0, cashflow) },
          { name: 'Vacancy Buffer', value: gRent * vac }
        ]
      };
    }
  },
  {
    id: 'rental-cash-flow',
    name: 'Rental Cash Flow Calculator',
    slug: 'rental-cash-flow-calculator',
    category: 'real-estate-pro',
    description: 'Calculate net rental property cash flow by balancing gross revenues against property management fees.',
    seoTitle: 'Rental Management Cash Flow & Profitability Calculator',
    seoDescription: 'Forecast net rental yields, accounting for standard property management and maintenance fees.',
    inputs: [
      { id: 'rentIncome', label: 'Monthly Rental Rent Income ($)', type: 'number', defaultValue: 2500 },
      { id: 'pmFeePct', label: 'Property Manager Service fee (%)', type: 'number', defaultValue: 10 },
      { id: 'maintCost', label: 'Monthly Maintenance & Repair reserves ($)', type: 'number', defaultValue: 200 }
    ],
    formula: 'Net Monthly Cash Flow = Rent - (Rent * PM%) - Maintenance',
    explanation: 'Hiring a property manager (typically costing 8% to 12% of rent) frees up your time but must be balanced against operating margins.',
    example: 'A $2,500 rental property pays $250 in management fees and reserves $200 for maintenance, generating $2,050 in net cash flow.',
    faq: [{ question: 'How much should I set aside for maintenance?', answer: 'The 1% rule suggests allocating 1% of the property\'s value in annual maintenance reserves.' }],
    relatedSlugs: ['property-cash-flow-calculator', 'real-estate-roi-calculator'],
    keywords: ['rental property management fees', 'maintenance escrow reserve', 'rental net yields'],
    calculate: (inputs) => {
      const rent = Number(inputs.rentIncome || 2500);
      const pm = Number(inputs.pmFeePct || 10) / 100;
      const maint = Number(inputs.maintCost || 200);

      const pmFee = rent * pm;
      const net = rent - pmFee - maint;

      return {
        results: [
          { label: 'Net Monthly Cash Flow', value: net.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Property Management fee', value: pmFee.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Property Management', value: pmFee },
          { name: 'Maintenance Reserve', value: maint },
          { name: 'Net Return', value: Math.max(0, net) }
        ]
      };
    }
  },
  {
    id: 'real-estate-roi',
    name: 'Real Estate ROI Calculator',
    slug: 'real-estate-roi-calculator',
    category: 'real-estate-pro',
    description: 'Calculate real estate return on investment (ROI) by balancing capital improvements against property appreciation.',
    seoTitle: 'Standard Real Estate Return on Investment (ROI) Calculator',
    seoDescription: 'Obtain precise home asset ROI metrics, accounting for transaction fees and capital upgrades.',
    inputs: [
      { id: 'initialBase', label: 'Original Purchase Price ($)', type: 'number', defaultValue: 250000 },
      { id: 'renovations', label: 'Renovation & Capital Improvements ($)', type: 'number', defaultValue: 30000 },
      { id: 'sellPrice', label: 'Est. Final Selling Price ($)', type: 'number', defaultValue: 340000 },
      { id: 'closingCost', label: 'Selling Agent fees & Closing Costs ($)', type: 'number', defaultValue: 20000 }
    ],
    formula: 'Cost Basis = Original Purchase + Renovations + Closing Costs\nProfit = Selling Price - Cost Basis\nROI = Profit / Cost Basis * 100',
    explanation: 'Home renovations can increase your selling price, but high transaction and closing fees can quickly reduce your overall profits.',
    example: 'A $250,000 property with $30,000 in renovations sells for $340,000. Deducting $20,000 in closing costs generates an actual ROI of 13.33%.',
    faq: [{ question: 'What is a typical real estate commission rate?', answer: 'Real estate commissions average 5% to 6% of the final selling price in the United States.' }],
    relatedSlugs: ['house-flipping-calculator', 'property-appreciation-calculator'],
    keywords: ['home return on investment real estate', 'closing cost fee reductions', 'remodel valuation index'],
    calculate: (inputs) => {
      const orig = Number(inputs.initialBase || 250000);
      const reno = Number(inputs.renovations || 30000);
      const sell = Number(inputs.sellPrice || 340000);
      const close = Number(inputs.closingCost || 20000);

      const totalCostBasis = orig + reno + close;
      const profit = sell - totalCostBasis;
      const roi = totalCostBasis > 0 ? (profit / totalCostBasis) * 100 : 0;

      return {
        results: [
          { label: 'Reconciled Investment ROI', value: `${roi.toFixed(2)}%`, isPrimary: true },
          { label: 'Absolute Transaction Profit', value: profit.toLocaleString(), unit: '$' },
          { label: 'Accumulated Cost Basis', value: totalCostBasis.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Cost Basis', value: totalCostBasis },
          { name: 'Investment Gain Profit', value: Math.max(0, profit) }
        ]
      };
    }
  },
  {
    id: 'house-flipping',
    name: 'House Flipping Calculator',
    slug: 'house-flipping-calculator',
    category: 'real-estate-pro',
    description: 'Structure rehabilitation pro-formas using the standard 70% rule of thumb.',
    seoTitle: 'House Flipping Profit Projector (70% Rule)',
    seoDescription: 'Calculate the maximum allowable offer (MAO) for a property flip using the 70% rule.',
    inputs: [
      { id: 'arv', label: 'After Repair Market Value (ARV) ($)', type: 'number', defaultValue: 350000 },
      { id: 'repairEst', label: 'Estimated Renovation Costs ($)', type: 'number', defaultValue: 50000 },
      { id: 'targetProfit', label: 'Desired Flipping Profit Margin ($)', type: 'number', defaultValue: 45000 }
    ],
    formula: 'MAO = (ARV * 70%) - Repair Costs',
    explanation: 'The 70% rule suggests investors should pay no more than 70% of a property\'s post-repair value, minus estimated renovation costs.',
    example: 'A property with an post-repair value of $350,000 that needs $50,000 in renovations yields a maximum allowable offer of $195,000.',
    faq: [{ question: 'What is After Repair Value (ARV)?', answer: 'The estimated market value of a property after all planned renovations are completed.' }],
    relatedSlugs: ['real-estate-roi-calculator', 'property-investment-calculator'],
    keywords: ['house flip mao 70 rule', 'rehab profit estimate', 'purchasing bid constraint'],
    calculate: (inputs) => {
      const arvVal = Number(inputs.arv || 350000);
      const repair = Number(inputs.repairEst || 50000);
      const desired = Number(inputs.targetProfit || 45000);

      const mao = (arvVal * 0.70) - repair;
      const projectedCost = mao + repair;
      const profitIfMao = arvVal - projectedCost;

      return {
        results: [
          { label: 'Maximum Allowable Offer (MAO)', value: mao.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Acquired Cost Basis', value: projectedCost.toFixed(2), unit: '$' },
          { label: 'Projected Net Flip Profit', value: profitIfMao.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'MAO maximum bid', value: Math.max(0, mao) },
          { name: 'Rehabilitation Outgo', value: repair },
          { name: 'Target Spread Profit', value: Math.max(0, profitIfMao) }
        ]
      };
    }
  },
  {
    id: 'property-appreciation',
    name: 'Property Appreciation Calculator',
    slug: 'property-appreciation-calculator',
    category: 'real-estate-pro',
    description: 'Calculate long-term property value appreciation using compounding interest models.',
    seoTitle: 'Future Property Value & Appreciation Compound Solver',
    seoDescription: 'Forecast the future value of a property based on long-term regional appreciation rates.',
    inputs: [
      { id: 'baseVal', label: 'Current Property Value ($)', type: 'number', defaultValue: 300000 },
      { id: 'years', label: 'Timeline Horizon (Years)', type: 'number', defaultValue: 10 },
      { id: 'ratePct', label: 'Annual Appreciation Rate (%)', type: 'number', defaultValue: 4.2 }
    ],
    formula: 'Future Value = Current Value * (1 + AppreciationRate)^Years',
    explanation: 'Home appreciation compounds over time, which can significantly build household equity and net worth over long holding periods.',
    example: 'A $300,000 home appreciating at a standard 4.2% annually grows in value to over $452,680 in 10 years.',
    faq: [{ question: 'What is the historical US housing appreciation rate?', answer: 'The long-term average for housing appreciation in the US is approximately 3% to 5% annually.' }],
    relatedSlugs: ['property-comparison-calculator', 'real-estate-roi-calculator'],
    keywords: ['housing compound valuation', 'equity appreciation projector', 'historical annual property growth'],
    calculate: (inputs) => {
      const base = Number(inputs.baseVal || 300000);
      const yrs = Number(inputs.years || 10);
      const rate = Number(inputs.ratePct || 4.2) / 100;

      const futureValue = base * Math.pow(1 + rate, yrs);
      const growth = futureValue - base;

      return {
        results: [
          { label: 'Projected Future Market Value', value: futureValue.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Accumulated Home Equity Gain', value: growth.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Starting Property Value', value: base },
          { name: 'Estimated Equity Growth', value: Math.round(growth) }
        ]
      };
    }
  },
  {
    id: 'property-comparison',
    name: 'Property Comparison Calculator',
    slug: 'property-comparison-calculator',
    category: 'real-estate-pro',
    description: 'Compare price-to-rent and capitalization rates for two properties side-by-side.',
    seoTitle: 'Real Estate Multi-Asset Cap Rate Comparison Tool',
    seoDescription: 'Compare net cap rates and yields for two real estate assets side-by-side.',
    inputs: [
      { id: 'price1', label: 'Property A Price ($)', type: 'number', defaultValue: 250000 },
      { id: 'rent1', label: 'Property A Monthly Rent ($)', type: 'number', defaultValue: 1800 },
      { id: 'price2', label: 'Property B Price ($)', type: 'number', defaultValue: 320000 },
      { id: 'rent2', label: 'Property B Monthly Rent ($)', type: 'number', defaultValue: 2400 }
    ],
    formula: 'Gross Yield = (Rent * 12) / Purchase Price * 100',
    explanation: 'Comparing capitalization rates side-by-side helps identify the most cash-flow-efficient property before acquisition.',
    example: 'Property A (low cost, high rent) may generate higher yield percentages despite its lower absolute sales price.',
    faq: [{ question: 'What is a capitalization (Cap) rate?', answer: 'Capitalization rate evaluates rental property yield without accounting for leverage or financing costs.' }],
    relatedSlugs: ['property-appreciation-calculator', 'property-investment-calculator'],
    keywords: ['property yield comparison', 'price to Rent index comparison', 'real estate investment yield metrics'],
    calculate: (inputs) => {
      const p1 = Number(inputs.price1 || 250000);
      const r1 = Number(inputs.rent1 || 1800);
      const p2 = Number(inputs.price2 || 320000);
      const r2 = Number(inputs.rent2 || 2400);

      const yield1 = p1 > 0 ? ((r1 * 12) / p1) * 100 : 0;
      const yield2 = p2 > 0 ? ((r2 * 12) / p2) * 100 : 0;

      return {
        results: [
          { label: 'Property A Gross Yield Return', value: `${yield1.toFixed(2)}%`, isPrimary: true },
          { label: 'Property B Gross Yield Return', value: `${yield2.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Property A', value: Math.round(yield1 * 10) / 10 },
          { name: 'Property B', value: Math.round(yield2 * 10) / 10 }
        ]
      };
    }
  },

  // ==================== SMALL BUSINESS ====================
  {
    id: 'business-startup',
    name: 'Business Startup Cost Calculator',
    slug: 'business-startup-cost-calculator',
    category: 'small-business',
    description: 'Calculate and total your initial business startup costs and needed operating capital reserves.',
    seoTitle: 'Startup Cost Budget & Capital Reserves Calculator',
    seoDescription: 'Total your launch coordinates, equipment costs, and operational reserves to secure funding.',
    inputs: [
      { id: 'equipCost', label: 'Necessary Equipment & Licensing ($)', type: 'number', defaultValue: 15000 },
      { id: 'marketCost', label: 'Marketing, Legal, & Setup ($)', type: 'number', defaultValue: 8000 },
      { id: 'monthlyRun', label: 'Target Monthly Operating Cash ($)', type: 'number', defaultValue: 4500 },
      { id: 'reserveMonths', label: 'Capital Reserve Months planned', type: 'number', defaultValue: 6, min: 1 }
    ],
    formula: 'Required Capital = Equipment + Marketing + (Monthly Cash Runway * Months)',
    explanation: 'Under-capitalization is a major cause of business failure. Enforcing a 6-month cash reserve provides a safety net during launch.',
    example: 'With $15k in equipment, $8k in marketing, and a 6-month reserve for $4.5k monthly runway, you need $50,000 in total seed funding.',
    faq: [{ question: 'What is a typical business runway?', answer: 'Most startup advisors recommend keeping a runway of 6 to 12 months for essential cash flow needs.' }],
    relatedSlugs: ['business-loan-planning-calculator', 'business-break-even-calculator'],
    keywords: ['business startup costs budget', 'cash runway reserve finder', 'reconciled initial expenses'],
    calculate: (inputs) => {
      const eq = Number(inputs.equipCost || 15000);
      const mkt = Number(inputs.marketCost || 8000);
      const run = Number(inputs.monthlyRun || 4500);
      const mos = Number(inputs.reserveMonths || 6);

      const reserves = run * mos;
      const total = eq + mkt + reserves;

      return {
        results: [
          { label: 'Minimum Required Capital', value: total.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Cash Reserves Escrow', value: reserves.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Capital Expenditures', value: eq + mkt },
          { name: 'Reserve Runway', value: reserves }
        ]
      };
    }
  },
  {
    id: 'business-loan-planning',
    name: 'Business Loan Planning Calculator',
    slug: 'business-loan-planning-calculator',
    category: 'small-business',
    description: 'Calculate business loan payments and debt-service coverage ratios (DSCR).',
    seoTitle: 'Business Loan Amortization & DSCR Calculator',
    seoDescription: 'Project business loan obligations and verify your debt-service coverage ratio (DSCR).',
    inputs: [
      { id: 'loanAmt', label: 'Requested Funding Amount ($)', type: 'number', defaultValue: 100000 },
      { id: 'years', label: 'Loan Term Period (Years)', type: 'number', defaultValue: 7 },
      { id: 'apr', label: 'Interest Rate (APR) (%)', type: 'number', defaultValue: 6.5 },
      { id: 'ebitda', label: 'Annual Business Income (EBITDA) ($)', type: 'number', defaultValue: 32000 }
    ],
    formula: 'Monthly Payment via standard amortization\nDSCR = EBITDA / Annual Debt Service',
    explanation: 'Lenders evaluate your Debt-Service Coverage Ratio (DSCR) to ensure your business generates enough cash to comfortably service its loans.',
    example: 'A $100,000 loan over 7 years at 6.5% interest requires $17,816 in annual payments, yielding a healthy DSCR of 1.80 against an EBITDA of $32,000.',
    faq: [{ question: 'What is a secure DSCR?', answer: 'Commercial lenders generally require a DSCR of 1.25 or higher to approve business financing.' }],
    relatedSlugs: ['business-startup-cost-calculator', 'business-break-even-calculator'],
    keywords: ['commercial loan dscr solver', 'small business loan amortization', 'debt service coverage ratio'],
    calculate: (inputs) => {
      const amt = Number(inputs.loanAmt || 100000);
      const yrs = Number(inputs.years || 7);
      const rateMonth = (Number(inputs.apr || 6.5) / 100) / 12;
      const pmtMonths = yrs * 12;
      const ebit = Number(inputs.ebitda || 32000);

      const moPmt = rateMonth > 0 ? amt * (rateMonth * Math.pow(1 + rateMonth, pmtMonths)) / (Math.pow(1 + rateMonth, pmtMonths) - 1) : amt / pmtMonths;
      const yrDebtService = moPmt * 12;
      const dscr = yrDebtService > 0 ? ebit / yrDebtService : 0;

      return {
        results: [
          { label: 'Monthly Repayment Amount', value: moPmt.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Debt-Service Coverage Ratio (DSCR)', value: dscr.toFixed(2) },
          { label: 'Annual Debt Service', value: yrDebtService.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Income EBITDA', value: ebit },
          { name: 'Annual Debt Service', value: Math.round(yrDebtService) }
        ]
      };
    }
  },
  {
    id: 'business-break-even-calculator',
    name: 'Business Break Even Calculator',
    slug: 'business-break-even-calculator',
    category: 'small-business',
    description: 'Calculate the break-even sales volume needed to cover your fixed and variable operational costs.',
    seoTitle: 'Variable Unit Margin & Break-Even Volume Calculator',
    seoDescription: 'Find the minimum sales volume required to cover your fixed and variable business costs.',
    inputs: [
      { id: 'fixedCosts', label: 'Monthly Fixed Costs (Rent, Salaries) ($)', type: 'number', defaultValue: 6000 },
      { id: 'unitPrice', label: 'Individual Product Unit Retail Price ($)', type: 'number', defaultValue: 25 },
      { id: 'unitVariable', label: 'Variable Cost per unit ($)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Contribution Margin = Unit Price - Variable Cost\nBreak Even Quantity = Fixed Costs / Contribution Margin',
    explanation: 'Calculating your break-even point helps you establish viable product pricing and sales targets to shield against business losses.',
    example: 'Selling a $25 item with a $10 variable cost produces a $15 contribution margin, meaning you must sell 400 units monthly to cover $6,000 in fixed costs.',
    faq: [{ question: 'What are fixed versus variable costs?', answer: 'Fixed costs (like rent) remain constant regardless of sales, while variable costs (like raw materials) scale with production volume.' }],
    relatedSlugs: ['business-revenue-forecast-calculator', 'business-profit-forecast-calculator'],
    keywords: ['break even sales volume', 'product margin target', 'amortization fixed overhead'],
    calculate: (inputs) => {
      const fixed = Number(inputs.fixedCosts || 6000);
      const price = Number(inputs.unitPrice || 25);
      const variable = Number(inputs.unitVariable || 10);

      const margin = price - variable;
      const qty = margin > 0 ? Math.ceil(fixed / margin) : 0;
      const dollars = qty * price;

      return {
        results: [
          { label: 'Break-Even Units Volume', value: qty.toLocaleString(), isPrimary: true },
          { label: 'Break-Even Sales Revenue', value: dollars.toLocaleString(), unit: '$' },
          { label: 'Unit Contribution Margin', value: margin.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Fixed Overhead Cost', value: fixed },
          { name: 'Variable cost of Sale', value: qty * variable }
        ]
      };
    }
  },
  {
    id: 'business-revenue-forecast',
    name: 'Business Revenue Forecast Calculator',
    slug: 'business-revenue-forecast-calculator',
    category: 'small-business',
    description: 'Forecast annual business revenues based on baseline volumes and expected growth percentages.',
    seoTitle: 'Business Revenue Growth Projection Calculator',
    seoDescription: 'Forecast monthly and annual sales revenues based on compound growth targets.',
    inputs: [
      { id: 'baseMonthlyRev', label: 'Starting monthly Revenue ($)', type: 'number', defaultValue: 12000 },
      { id: 'monthlyGrowth', label: 'Expected monthly Growth Rate (%)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Month(N) Revenue = Base * (1 + Growth)^N',
    explanation: 'Even small monthly growth rates compound significantly over the course of a year, helping you forecast and set more ambitious sales targets.',
    example: 'Starting with $12,000 in monthly revenue and growing at 3% month-over-month increases your monthly sales to over $16,610 by month 12.',
    faq: [{ question: 'Is compounding growth sustainable?', answer: 'Early on, compounding growth can be rapid, but it typically plateaus as a business matures and saturates its market.' }],
    relatedSlugs: ['business-break-even-calculator', 'business-profit-forecast-calculator'],
    keywords: ['compounding revenue forecast', 'business growth target ledger', 'sales volume projections'],
    calculate: (inputs) => {
      const start = Number(inputs.baseMonthlyRev || 12000);
      const growth = Number(inputs.monthlyGrowth || 3) / 100;

      let totalYr = 0;
      let cur = start;
      const chartPoints = [];

      for (let m = 1; m <= 12; m++) {
        totalYr += cur;
        chartPoints.push({ name: `Month ${m}`, value: Math.round(cur) });
        cur *= (1 + growth);
      }

      return {
        results: [
          { label: 'Forecasted Year 1 Revenue', value: Math.round(totalYr).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Month 12 Exit Run-Rate', value: Math.round(cur).toLocaleString(), unit: '$' }
        ],
        chartData: chartPoints
      };
    }
  },
  {
    id: 'employee-cost-calculator',
    name: 'Employee Cost Calculator',
    slug: 'employee-cost-calculator',
    category: 'small-business',
    description: 'Calculate the true cost of an employee, including payroll taxes, benefits, and insurance overhead.',
    seoTitle: 'Full Employee Burden & Payroll Benefit Cost Calculator',
    seoDescription: 'Find the total cost of hiring an employee by adding payroll taxes and benefit overhead to their base salary.',
    inputs: [
      { id: 'salary', label: 'Annual Employee Base Salary ($)', type: 'number', defaultValue: 60000 },
      { id: 'ficaFuta', label: 'Payroll Taxes (FICA, FUTA) (%)', type: 'number', defaultValue: 8.5 },
      { id: 'benefits', label: 'Annual Health & General Benefits ($)', type: 'number', defaultValue: 7200 }
    ],
    formula: 'Fully Burdened Cost = Base Salary * (1 + Taxes%) + Benefits',
    explanation: 'The true cost of hiring an employee extends beyond their base salary to include required payroll taxes, benefits, and operating overhead.',
    example: 'An employee with a $60,000 base salary costs approximately $72,300 annually after accounting for 8.5% in payroll taxes and $7,200 in healthcare benefits.',
    faq: [{ question: 'What is the average employee burden rate?', answer: 'The fully burdened cost of an employee typically runs 1.25 to 1.4 times their base salary.' }],
    relatedSlugs: ['business-expense-calculator'],
    keywords: ['fully burdened employee salary', 'payroll benefits calculation', 'w2 employer overhead'],
    calculate: (inputs) => {
      const sal = Number(inputs.salary || 60000);
      const taxPct = Number(inputs.ficaFuta || 8.5) / 100;
      const ben = Number(inputs.benefits || 7200);

      const taxes = sal * taxPct;
      const total = sal + taxes + ben;

      return {
        results: [
          { label: 'Fully Burdened Annual Employee Cost', value: Math.round(total).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Employer Payroll Taxes', value: Math.round(taxes).toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Base Salary', value: sal },
          { name: 'Benefits escrows', value: ben },
          { name: 'Employer Taxes', value: Math.round(taxes) }
        ]
      };
    }
  },
  {
    id: 'business-expense-calculator',
    name: 'Business Expense Calculator',
    slug: 'business-expense-calculator',
    category: 'small-business',
    description: 'Budget monthly fixed overhead costs against your variable operational expenses.',
    seoTitle: 'Business Expense Budget & COGS Calculator',
    seoDescription: 'Plan your business balance sheets by totaling and categorizing fixed and variable expenses.',
    inputs: [
      { id: 'rentOffice', label: 'Monthly Office rent / software ($)', type: 'number', defaultValue: 1800 },
      { id: 'marketingOut', label: 'Monthly Advertising & Sales outlays ($)', type: 'number', defaultValue: 1200 },
      { id: 'cogsUnits', label: 'Estimated Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 3500 }
    ],
    formula: 'Monthly Outflow = Rent + Marketing + COGS',
    explanation: 'Keeping a clear record of fixed and variable expenses helps identify ways to optimize your operating margins and protect cash flow.',
    example: 'A business spending $1,800 on rent, $1,200 on marketing, and $3,500 on inventory has a baseline of $6,500 in monthly expenses.',
    faq: [{ question: 'What is COGS?', answer: 'Cost of Goods Sold - the direct material and labor expenses required to produce and sell a product.' }],
    relatedSlugs: ['employee-cost-calculator', 'business-profit-forecast-calculator'],
    keywords: ['operating expenses budget', 'cogs material costs tracker', 'fixed business costs ledger'],
    calculate: (inputs) => {
      const rent = Number(inputs.rentOffice || 1800);
      const mkt = Number(inputs.marketingOut || 1200);
      const cogs = Number(inputs.cogsUnits || 3500);

      const total = rent + mkt + cogs;

      return {
        results: [
          { label: 'Total Monthly Operating Expenses', value: total.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Fixed Administrative Portion', value: rent.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Fixed Overhead', value: rent },
          { name: 'Sales & Marketing', value: mkt },
          { name: 'Raw Material COGS', value: cogs }
        ]
      };
    }
  },
  {
    id: 'business-profit-forecast',
    name: 'Business Profit Forecast Calculator',
    slug: 'business-profit-forecast-calculator',
    category: 'small-business',
    description: 'Forecast annual net profitability by balancing your gross revenue projections against expenses.',
    seoTitle: 'Business Net Profit Margin Forecast Tool',
    seoDescription: 'Forecast your annual business profit margins based on revenue and expense projections.',
    inputs: [
      { id: 'grossSales', label: 'Projected Gross Annual Sales ($)', type: 'number', defaultValue: 150000 },
      { id: 'costBasisSum', label: 'Total Annual Expenses & Burden Cost ($)', type: 'number', defaultValue: 95000 }
    ],
    formula: 'Net Profit = Gross Sales - Total Expenses\nProfit Margin = (Net Profit / Gross Sales) * 100',
    explanation: 'Focusing on your net profit margin (rather than just gross sales) is essential to preserve long-term business profitability.',
    example: 'A business generating $150,000 in gross sales against $95,000 in total expenses yields a healthy 36.67% net profit margin.',
    faq: [{ question: 'What is a typical healthy profit margin?', answer: 'While margins vary by industry, a net profit margin of 10% is average, while 20% or higher is excellent.' }],
    relatedSlugs: ['business-revenue-forecast-calculator', 'business-break-even-calculator'],
    keywords: ['business net profit margin', 'annual earnings projections', 'sales ledger profitability'],
    calculate: (inputs) => {
      const rev = Number(inputs.grossSales || 150000);
      const exp = Number(inputs.costBasisSum || 95000);

      const profit = rev - exp;
      const margin = rev > 0 ? (profit / rev) * 100 : 0;

      return {
        results: [
          { label: 'Projected Annual Net Profit', value: profit.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Yearly Net Profit Margin', value: `${margin.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Retained Net profit', value: Math.max(0, profit) },
          { name: 'Operating Expenses', value: exp }
        ]
      };
    }
  },

  // ==================== FREELANCE & CREATOR ECONOMY ====================
  {
    id: 'freelance-project',
    name: 'Freelance Project Rate Calculator',
    slug: 'freelance-project-calculator',
    category: 'freelance-creator',
    description: 'Calculate profitable freelance project rates that account for non-billable administrative hours.',
    seoTitle: 'Freelance Hourly-Equivalent Project Rate Calculator',
    seoDescription: 'Set profitable freelance project rates that cover your overhead, taxes, and non-billable setup hours.',
    inputs: [
      { id: 'hourlyTarget', label: 'Target Hourly Rate ($)', type: 'number', defaultValue: 75 },
      { id: 'billableHrs', label: 'Estimated Project Billable Work Hours', type: 'number', defaultValue: 40 },
      { id: 'taxReserve', label: 'Tax & Overhead Allocation reserve (%)', type: 'number', defaultValue: 25 }
    ],
    formula: 'Base Rate = Hourly Target * Billable Hours\nAdjusted Project Rate = Base Rate / (1 - Tax Reserve%/100)',
    explanation: 'Freelancers must account for non-billable administration, client management, and self-employment taxes within their project rates.',
    example: 'A 40-hour project targeting a $75/hour rate requires a base of $3,000, which increases to $4,000 to cover self-employment taxes and overhead.',
    faq: [{ question: 'What is self-employment tax?', answer: 'In the US, freelancers pay a 15.3% self-employment tax to cover Social Security and Medicare.' }],
    relatedSlugs: ['freelancer-income-calculator', 'creator-income-calculator'],
    keywords: ['freelancer project fee rates', 'hourly rate equivalent cost', 'self employment taxes margin'],
    calculate: (inputs) => {
      const target = Number(inputs.hourlyTarget || 75);
      const hrs = Number(inputs.billableHrs || 40);
      const tax = Number(inputs.taxReserve || 25) / 100;

      const base = target * hrs;
      const full = tax < 1 ? base / (1 - tax) : base;

      return {
        results: [
          { label: 'Recommended Flat Project Rate', value: full.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Base Hourly Labor Value', value: base.toFixed(2), unit: '$' },
          { label: 'Tax & Overhead Reserves', value: (full - base).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Labor Base Cost', value: base },
          { name: 'Tax & Overhead Reserve', value: Math.round(full - base) }
        ]
      };
    }
  },
  {
    id: 'freelancer-income',
    name: 'Freelancer Income Calculator',
    slug: 'freelancer-income-calculator',
    category: 'freelance-creator',
    description: 'Calculate the gross annual billing needed to reach your post-tax take-home income goals.',
    seoTitle: 'Freelancer Annual Gross Billing & Take-Home Solver',
    seoDescription: 'Calculate the annual gross billings needed to reach your take-home income goals after self-employment overhead.',
    inputs: [
      { id: 'takeHomeGoal', label: 'Desired Net Take-Home Salary ($)', type: 'number', defaultValue: 70000 },
      { id: 'taxMargin', label: 'Self Employment taxes + Business expense (%)', type: 'number', defaultValue: 30 }
    ],
    formula: 'Required Gross Billings = Net Income Goal / (1 - Tax/Overhead %)',
    explanation: 'Unlike traditional employees, freelancers are responsible for all operating costs and taxes, requiring higher gross rates to reach matching net take-home pay.',
    example: 'To clear a $70,000 net take-home salary with 30% allocated to taxes and expenses, you need to bill at least $100,000 in gross annual revenue.',
    faq: [{ question: 'What are common write-offs for freelancers?', answer: 'A portion of home office space, internet, software subscriptions, and professional equipment can often be tax-deductible.' }],
    relatedSlugs: ['freelance-project-calculator', 'creator-income-calculator'],
    keywords: ['freelancer gross billings target', 'net income calculation self employed', 'annual billing requirements'],
    calculate: (inputs) => {
      const goal = Number(inputs.takeHomeGoal || 70000);
      const margin = Number(inputs.taxMargin || 30) / 100;

      const gross = margin < 1 ? goal / (1 - margin) : goal;
      const weeklyBill = gross / 48; // Assume 4 weeks unpaid vacation

      return {
        results: [
          { label: 'Required Gross Annual Billings', value: Math.round(gross).toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Target Weekly Billings (48 Active Weeks)', value: weeklyBill.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Net Earnings Takeaway', value: goal },
          { name: 'Tax & Expense Outlay', value: Math.round(gross - goal) }
        ]
      };
    }
  },
  {
    id: 'creator-income-calculator',
    name: 'Creator Income Calculator',
    slug: 'creator-income-calculator',
    category: 'freelance-creator',
    description: 'Calculate multi-stream content creator revenue across sponsorships, ad programs, and digital products.',
    seoTitle: 'Multi-Channel Content Creator Income Calculator',
    seoDescription: 'Aggregate and forecast your monthly multi-stream content creator revenues.',
    inputs: [
      { id: 'sponsorships', label: 'Monthly Brand Sponsorships revenue ($)', type: 'number', defaultValue: 2500 },
      { id: 'adrev', label: 'Monthly Stream / YouTube Ad Program ($)', type: 'number', defaultValue: 1200 },
      { id: 'products', label: 'Monthly Online Merch & Course sales ($)', type: 'number', defaultValue: 800 }
    ],
    formula: 'Monthly Total = Sponsorships + Ad Revenue + Merc/Course Sales',
    explanation: 'Successful content creators build a diverse set of revenue streams, reducing their financial dependence on shifting platform algorithms.',
    example: 'A creator earning $2,500 from sponsorships, $1,200 in ad revenue, and $800 from digital products averages $4,500 in monthly earnings.',
    faq: [{ question: 'What is RPM in ad monetization?', answer: 'Revenue Per Mille - the net earnings a creator receives per 1,000 video or page views.' }],
    relatedSlugs: ['sponsorship-calculator', 'content-revenue-calculator'],
    keywords: ['multi stream creator salary', 'ad monetization payouts', 'digital product royalties'],
    calculate: (inputs) => {
      const sp = Number(inputs.sponsorships || 2500);
      const ad = Number(inputs.adrev || 1200);
      const pr = Number(inputs.products || 800);

      const total = sp + ad + pr;
      const annual = total * 12;

      return {
        results: [
          { label: 'Expected Monthly Earnings', value: total.toLocaleString(), unit: '$', isPrimary: true },
          { label: 'Projected Annual Earnings', value: annual.toLocaleString(), unit: '$' }
        ],
        chartData: [
          { name: 'Sponsorships', value: sp },
          { name: 'Ad Revenue', value: ad },
          { name: 'Digital sales', value: pr }
        ]
      };
    }
  },
  {
    id: 'sponsorship-calculator',
    name: 'Sponsorship Calculator',
    slug: 'sponsorship-calculator',
    category: 'freelance-creator',
    description: 'Calculate fair sponsorship pricing based on view count and active CPM benchmarks.',
    seoTitle: 'Content Creator Fair Sponsorship CPM Calculator',
    seoDescription: 'Find fair sponsorship rates for your content channels based on view counts and CPM benchmarks.',
    inputs: [
      { id: 'avgViews', label: 'Average Video / Post Views count', type: 'number', defaultValue: 25000 },
      { id: 'cpmRate', label: 'Assumed Campaign CPM ($ per 1,000 views)', type: 'number', defaultValue: 25 }
    ],
    formula: 'Fair Sponsor Fee = (Average Views / 1000) * CPM Rate',
    explanation: 'Brands measure sponsorship value using CPM (Cost Per Mille), representing the cost to reach 1,000 viewers through your content channels.',
    example: 'An video channel averaging 25,000 views secures a fair sponsorship value of $625 per post at an industry-standard CPM of $25.',
    faq: [{ question: 'What is a typical niche CPM?', answer: 'CPM rates vary by audience, ranging from $10 for lifestyle content to over $40 for finance and tech.' }],
    relatedSlugs: ['brand-deal-calculator', 'creator-income-calculator'],
    keywords: ['creator brand sponsorship rate', 'cpm view campaign budget', 'merchandiser influencer payout'],
    calculate: (inputs) => {
      const views = Number(inputs.avgViews || 25000);
      const cpm = Number(inputs.cpmRate || 25);

      const rate = (views / 1000) * cpm;

      return {
        results: [
          { label: 'Fair Post Sponsorship Fee', value: rate.toFixed(2), unit: '$', isPrimary: true },
          { label: 'CPM Sizing Basis', value: cpm.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Sponsor Fee', value: Math.round(rate) }
        ]
      };
    }
  },
  {
    id: 'brand-deal-calculator',
    name: 'Brand Deal Calculator',
    slug: 'brand-deal-calculator',
    category: 'freelance-creator',
    description: 'Value comprehensive brand deals including content production, usage rights, and agency margins.',
    seoTitle: 'Influencer Brand Deal & Usage Rights Valuator',
    seoDescription: 'Calculate fair brand package values by including content creation, usage rights, and revision fees.',
    inputs: [
      { id: 'baseRate', label: 'Content Creation Base Fee ($)', type: 'number', defaultValue: 500 },
      { id: 'exclusivityMonths', label: 'Exclusivity Period (Months) planned', type: 'number', defaultValue: 3 },
      { id: 'exclusivitySurcharge', label: 'Exclusivity Surcharge per Month (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Brand Deal Total = Base Fee * [1 + (Exclusivity Months * Monthly Surcharge %)]',
    explanation: 'Exclusivity clauses prevent you from working with competing brands, which should carry a monthly premium to compensate for potential lost partnerships.',
    example: 'A $500 base content package with a 3-month exclusivity clause at 15% monthly increases your total deal value to $725.',
    faq: [{ question: 'Why charge for exclusivity?', answer: 'Exclusivity prevents you from earning sponsorship income from competing brands during the campaign.' }],
    relatedSlugs: ['sponsorship-calculator', 'creator-income-calculator'],
    keywords: ['brand campaign contract rates', 'exclusivity fee calculations', 'influencer deliverables pricing'],
    calculate: (inputs) => {
      const base = Number(inputs.baseRate || 500);
      const mos = Number(inputs.exclusivityMonths || 3);
      const surcharge = Number(inputs.exclusivitySurcharge || 15) / 100;

      const exclCost = base * (mos * surcharge);
      const total = base + exclCost;

      return {
        results: [
          { label: 'Recommended Brand Deal Package', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Exclusivity Surcharge Premium', value: exclCost.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Production base', value: base },
          { name: 'Exclusivity premium', value: Math.round(exclCost) }
        ]
      };
    }
  },
  {
    id: 'content-revenue-calculator',
    name: 'Content Revenue Calculator',
    slug: 'content-revenue-calculator',
    category: 'freelance-creator',
    description: 'Calculate potential blog, newsletter, or video channel revenues based on subscriber metrics and conversion rates.',
    seoTitle: 'Newsletter & Premium Content Revenue Projection Tool',
    seoDescription: 'Forecast monthly recurring revenue for subscription platforms based on conversion rates.',
    inputs: [
      { id: 'subscribers', label: 'Active Page / List Readers count', type: 'number', defaultValue: 10000 },
      { id: 'converPct', label: 'Premium Conversion Conversion rate (%)', type: 'number', defaultValue: 2 },
      { id: 'monthlyCost', label: 'Premium Tier Subscription Fee ($/Month)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Monthly Recurring Revenue = Subs * Conversion% * Subscription Fee',
    explanation: 'Converting even a small fraction of your audience (usually 1.5% to 3%) into paid subscribers can build a sustainable baseline of recurring revenue.',
    example: 'A reader list of 10,000 subscribers converting at 2% into paid $5/month members generates $1,000 in monthly recurring revenue.',
    faq: [{ question: 'How can I increase conversion rates?', answer: 'Offer high-value gating options, exclusive content, and tier pricing packages.' }],
    relatedSlugs: ['creator-income-calculator', 'creator-goal-calculator'],
    keywords: ['newsletter recurring model', 'paid subscription conversion', 'creator cash flow forecasts'],
    calculate: (inputs) => {
      const subs = Number(inputs.subscribers || 10000);
      const conv = Number(inputs.converPct || 2) / 100;
      const fee = Number(inputs.monthlyCost || 5);

      const premiumSells = subs * conv;
      const mrr = premiumSells * fee;
      const arr = mrr * 12;

      return {
        results: [
          { label: 'Estimated Monthly Recurring Revenue (MRR)', value: mrr.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Contract Value equivalent (ARR)', value: arr.toFixed(2), unit: '$' },
          { label: 'Acquired Paid Supporters Count', value: Math.round(premiumSells) }
        ],
        chartData: [
          { name: 'Free Audience', value: subs - Math.round(premiumSells) },
          { name: 'Paid Supporters', value: Math.round(premiumSells) }
        ]
      };
    }
  },
  {
    id: 'creator-goal-calculator',
    name: 'Creator Goal Calculator',
    slug: 'creator-goal-calculator',
    category: 'freelance-creator',
    description: 'Find the total page or video views needed to hit your monthly creator income goals.',
    seoTitle: 'Ad-Revenue Page Views Needed Target Finder',
    seoDescription: 'Find the monthly page views or video plays required to hit your creator income goals.',
    inputs: [
      { id: 'payoutGoal', label: 'Desired Monthly Income Goal ($)', type: 'number', defaultValue: 2000 },
      { id: 'marketCpm', label: 'Average Platform RPM ($ per 1,000 views)', type: 'number', defaultValue: 8 }
    ],
    formula: 'Views Needed = (Income Goal / RPM) * 1000',
    explanation: 'Calculating the traffic volume needed to reach your income goals helps you evaluate and shift towards digital products and direct sponsorships.',
    example: 'To clear a $2,000 monthly income goal with an average RPM of $8, you need to generate approximately 250,000 monthly views.',
    faq: [{ question: 'What is the difference between CPM and RPM?', answer: 'CPM measures the cost advertisers pay, while RPM measures the actual net revenue creators earn per 1,000 views.' }],
    relatedSlugs: ['sponsorship-calculator', 'content-revenue-calculator'],
    keywords: ['views required income goal', 'creator monetization target', 'traffic volume solver'],
    calculate: (inputs) => {
      const goal = Number(inputs.payoutGoal || 2000);
      const rpm = Number(inputs.marketCpm || 8);

      const viewsNeeded = rpm > 0 ? (goal / rpm) * 1000 : 0;

      return {
        results: [
          { label: 'Monthly Views / Plays Required', value: Math.ceil(viewsNeeded).toLocaleString(), isPrimary: true },
          { label: 'Views Required per Day equivalent', value: Math.ceil(viewsNeeded / 30).toLocaleString() }
        ]
      };
    }
  }
];
