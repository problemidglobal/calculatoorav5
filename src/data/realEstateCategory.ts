import { Calculator } from '../types';

export const REAL_ESTATE_CALCULATORS: Calculator[] = [
  {
    id: 'mortgage-calculator-advanced',
    name: 'Mortgage Calculator',
    slug: 'mortgage-calculator-advanced',
    category: 'finance',
    description: 'Calculate comprehensive mortgage payments including home interest, property tax, and PMI insurance premiums.',
    seoTitle: 'Advanced Mortgage & Interest Payment Calculator | Calculatoora',
    seoDescription: 'Obtain exact monthly home loans payments. Breakdown amortization schedules, property taxes, and home insurances.',
    inputs: [
      { id: 'homePrice', label: 'Home Purchase Price', type: 'number', defaultValue: 350000, step: 5000, unit: '$' },
      { id: 'downPayment', label: 'Down Payment Amount', type: 'number', defaultValue: 70000, step: 2000, unit: '$' },
      { id: 'interest', label: 'Annual Interest Rate (APR)', type: 'number', defaultValue: 6.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Amortization Term (Years)', type: 'number', defaultValue: 30, step: 5, unit: 'years' },
      { id: 'tax', label: 'Annual Property Tax Rate', type: 'number', defaultValue: 1.2, step: 0.05, unit: '%' }
    ],
    formula: 'M = P * [ i(1+i)^n ] / [ (1+i)^n - 1 ]\nWhere P is loan balance, i is monthly rate, n represent amortization months.',
    explanation: 'Home financing models monthly principal and interest P&I payments. Adding escrow taxes protects users from hidden housing costs.',
    example: 'Buying an $350k house with $70k down at 6.5% interest on a 30-year term creates a $1,769.82 P&I cost, plus property tax totaling $2,119.82 monthly.',
    faq: [
      { question: 'What is a standard down payment?', answer: 'Traditional banking prefers a 20% down payment to avoid having to pay Private Mortgage Insurance (PMI).' }
    ],
    relatedSlugs: ['mortgage-payment-calculator', 'house-affordability-calculator', 'rent-vs-buy-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.homePrice) || 0;
      const down = Number(inputs.downPayment) || 0;
      const rateVal = Number(inputs.interest) || 0;
      const t = Number(inputs.years) || 30;
      const taxRate = Number(inputs.tax) || 1.2;

      const loan = Math.max(0, price - down);
      const r = (rateVal / 100) / 12;
      const n = t * 12;

      let monthlyPI = 0;
      if (r === 0) {
        monthlyPI = loan / n;
      } else {
        monthlyPI = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const propertyTaxMonthly = (price * (taxRate / 100)) / 12;
      const insuranceMonthly = 100; // Average baseline insurance representation
      const totalMonthly = monthlyPI + propertyTaxMonthly + insuranceMonthly;

      const totalInterest = (monthlyPI * n) - loan;

      return {
        results: [
          { label: 'Total Monthly Mortgage Payment', value: totalMonthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Principal & Interest (P&I)', value: monthlyPI.toFixed(2), unit: '$' },
          { label: 'Est. Monthly Property Tax', value: propertyTaxMonthly.toFixed(2), unit: '$' },
          { label: 'Total Estimated Interest Paid', value: totalInterest.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Core Loan Principal', value: loan, color: '#39FF14' },
          { name: 'Total Amortized Interest', value: Math.round(totalInterest), color: '#3b82f6' },
          { name: 'Property Tax escrow (30y)', value: Math.round(propertyTaxMonthly * n), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'mortgage-payment-calculator',
    name: 'Mortgage Payment Calculator',
    slug: 'mortgage-payment-calculator',
    category: 'finance',
    description: 'Calculate monthly loan amortizations, exploring payment adjustments based on various home values or down payments.',
    seoTitle: 'Mortgage Interest & Payment Calculator | Calculatoora',
    seoDescription: 'Accurately model monthly financial obligations for home purchases. Easily view cumulative interest amortizers.',
    inputs: [
      { id: 'loan', label: 'Total Mortgage Loan Balance', type: 'number', defaultValue: 250000, step: 5000, unit: '$' },
      { id: 'rate', label: 'Mortgage rate (APR)', type: 'number', defaultValue: 6.0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Amortization Term', type: 'number', defaultValue: 30, step: 5, unit: 'years' }
    ],
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Calculates the pure principal and interest payout to service home loans.',
    example: 'Servicing a $250,000 mortgage at 6.0% APR results in monthly payments of $1,498.88 over 30 years.',
    faq: [
      { question: 'What is loan amortization?', answer: 'Amortization is the process of gradually paying off a debt over time through regular, equal payments, with more of each payment going toward principal as time goes on.' }
    ],
    relatedSlugs: ['mortgage-calculator-advanced', 'house-affordability-calculator', 'property-roi-calculator'],
    calculate: (inputs) => {
      const loan = Number(inputs.loan) || 0;
      const rateVal = Number(inputs.rate) || 0;
      const t = Number(inputs.years) || 30;

      const r = (rateVal / 100) / 12;
      const n = t * 12;

      let monthlyPI = 0;
      if (r === 0) {
        monthlyPI = loan / n;
      } else {
        monthlyPI = loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPayments = monthlyPI * n;
      const totalInterest = Math.max(0, totalPayments - loan);

      return {
        results: [
          { label: 'Monthly Payment (P&I)', value: monthlyPI.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Interest Charge', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Cumulative Lifetime Outlay', value: totalPayments.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Loan Mortgage Principal', value: loan, color: '#39FF14' },
          { name: 'Total Amortized Interest', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'house-affordability-calculator',
    name: 'House Affordability Calculator',
    slug: 'house-affordability-calculator',
    category: 'finance',
    description: 'Calculate your maximum house purchase budget using standard debt-to-income (DTI) leverage brackets.',
    seoTitle: 'How Much House Can I Afford? | Calculatoora',
    seoDescription: 'Obtain your maximum housing purchase capability using the 28 / 36 debt ratio rule.',
    inputs: [
      { id: 'income', label: 'Annual Household Gross Income', type: 'number', defaultValue: 100000, step: 2000, unit: '$' },
      { id: 'debts', label: 'Monthly Debt payments (Car, Cards)', type: 'number', defaultValue: 450, step: 20, unit: '$' },
      { id: 'down', label: 'Down Payment Saved Cash', type: 'number', defaultValue: 50000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Expected Mortgage APR', type: 'number', defaultValue: 6.5, step: 0.1, unit: '%' }
    ],
    formula: 'Conservative payment: 28% of gross monthly income.\nAggressive payment: 36% of gross monthly income, minus current debts.',
    explanation: 'Lenders evaluate mortgage candidates using Debt-To-Income (DTI) rules. Under the standard corporate 28/36 rule, housing expenditures should not exceed 28%, and total debt payments should not exceed 36% of gross income.',
    example: 'An annual household income of $100,000 paired with monthly debts of $450 and a $50k down payment qualifies for a maximum affordable home price of $351,643.00.',
    faq: [
      { question: 'What counts as monthly debt?', answer: 'Auto payments, student loans, minimum credit card payments, and personal lines count. Utilities, groceries, or streaming apps do not count as debt.' }
    ],
    relatedSlugs: ['mortgage-calculator-advanced', 'rent-vs-buy-calculator', 'budget-calculator'],
    calculate: (inputs) => {
      const grossAnnual = Number(inputs.income) || 0;
      const monthlyDebts = Number(inputs.debts) || 0;
      const down = Number(inputs.down) || 0;
      const rateVal = Number(inputs.rate) || 6.5;

      const monthlyGross = grossAnnual / 12;

      // 28% Rule (Housing alone)
      const allowedHousing28 = monthlyGross * 0.28;
      // 36% Rule (Total Debt)
      const allowedTotal36 = (monthlyGross * 0.36) - monthlyDebts;

      // Select lower of the two values for safety
      const targetMonthlyMortgageFee = Math.min(allowedHousing28, allowedTotal36);

      // Back-calculate loan amount from monthly payment
      const r = (rateVal / 100) / 12;
      const n = 360; // 30y basis

      let maxLoan = 0;
      if (r === 0) {
        maxLoan = targetMonthlyMortgageFee * n;
      } else {
        maxLoan = targetMonthlyMortgageFee * (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n));
      }

      const totalPurchPrice = maxLoan + down;

      return {
        results: [
          { label: 'Comfortable Home Purchase Budget', value: totalPurchPrice.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Maximum Monthly Payment qualified', value: targetMonthlyMortgageFee.toFixed(2), unit: '$' },
          { label: 'Required Home Loan Amount', value: maxLoan.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Mortgage Loan capacity', value: Math.round(maxLoan), color: '#39FF14' },
          { name: 'Down Payment Capital', value: down, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'rent-vs-buy-calculator',
    name: 'Rent vs Buy Calculator',
    slug: 'rent-vs-buy-calculator',
    category: 'finance',
    description: 'Compare long-term cumulative costs between renting and buying a property over multi-year periods.',
    seoTitle: 'Rent vs Buy Housing Cost Comparison | Calculatoora',
    seoDescription: 'Perform structured financial analysis to decide whether you should buy a home or rent. Estimate financial tipping points.',
    inputs: [
      { id: 'rent', label: 'Monthly Rent Cost', type: 'number', defaultValue: 1800, step: 50, unit: '$' },
      { id: 'price', label: 'Home Purchase Value', type: 'number', defaultValue: 350000, step: 5000, unit: '$' },
      { id: 'years', label: 'Holding/Stay Timeline', type: 'number', defaultValue: 10, step: 1, unit: 'years' },
      { id: 'rate', label: 'Home appreciation rate yearly', type: 'number', defaultValue: 3.5, step: 0.1, unit: '%' }
    ],
    formula: 'Renting costs = Sum of rent payments with rent inflation.\nBuying costs = Down payment + mortgage interest + upkeep taxes - home appreciation value.',
    explanation: 'Buying incurs heavy upfront cash fees but builds equity over time. Renting is often cheaper in the short run but offers zero long-term capital preservation.',
    example: 'Renting for $1,800/month costs $253k over 10 years. Buying a $350k home settles into an optimal tipping point, saving you $45k after 10 years of property appreciation.',
    faq: [
      { question: 'What is the standard holding period to warrant buying?', answer: 'Typically, it takes 5 to 7 years of residency to recover the upfront transaction fees (commission, closing costs) associated with purchasing.' }
    ],
    relatedSlugs: ['mortgage-calculator-advanced', 'house-affordability-calculator', 'property-roi-calculator'],
    calculate: (inputs) => {
      const rent = Number(inputs.rent) || 0;
      const price = Number(inputs.price) || 0;
      const yrs = Number(inputs.years) || 12;
      const appRate = Number(inputs.rate) || 3.5;

      // Simple rental aggregate
      let totalRentCost = 0;
      let currRent = rent;
      for (let y = 1; y <= yrs; y++) {
        totalRentCost += currRent * 12;
        currRent *= 1.025; // 2.5% rent inflation baseline representation
      }

      // Simple buying aggregate
      const down = price * 0.10;
      const loan = price - down;
      const monthlyPI = loan * (0.065/12 * Math.pow(1.0054, yrs*12)) / (Math.pow(1.0054, yrs*12) - 1);
      const mortgageInterestChargePaid = (monthlyPI * yrs * 12) - loan;
      const transactionCosts = price * 0.05; // Buying fees
      const maintenanceFeesCombined = price * 0.01 * yrs; // 1% yearly maintenance baseline

      const appreciatedFinalHomeValue = price * Math.pow(1 + (appRate/100), yrs);
      const grossEquityEarned = appreciatedFinalHomeValue - price;

      const netBuyCostsTotal = down + mortgageInterestChargePaid + transactionCosts + maintenanceFeesCombined - grossEquityEarned;

      return {
        results: [
          { label: 'Cumulative Cost Renting', value: totalRentCost.toFixed(2), unit: '$', isPrimary: totalRentCost < netBuyCostsTotal },
          { label: 'Net Cumulative Cost Buying', value: netBuyCostsTotal.toFixed(2), unit: '$', isPrimary: netBuyCostsTotal < totalRentCost },
          { label: 'Projected Home Equity Earned', value: grossEquityEarned.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: '10-Year Renting Cash Out', value: Math.round(totalRentCost), color: '#ef4444' },
          { name: '10-Year Net Buying Cost', value: Math.round(Math.max(0, netBuyCostsTotal)), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'property-roi-calculator',
    name: 'Property ROI Calculator',
    slug: 'property-roi-calculator',
    category: 'finance',
    description: 'Calculate Cap Rates, cash flow, and Cash-on-Cash returns for prospective commercial rental property investments.',
    seoTitle: 'Rental Property ROI & Cap Rate Calculator | Calculatoora',
    seoDescription: 'Input property valuations, rent structures, and financing configurations to evaluate real estate cap rates and ROI.',
    inputs: [
      { id: 'price', label: 'Purchase Price valuation', type: 'number', defaultValue: 200000, step: 5000, unit: '$' },
      { id: 'down', label: 'Cash Down Payment', type: 'number', defaultValue: 50000, step: 1000, unit: '$' },
      { id: 'rent', label: 'Gross Monthly rent Income', type: 'number', defaultValue: 1800, step: 50, unit: '$' },
      { id: 'opex', label: 'Monthly Operating bills (Tax, Ins)', type: 'number', defaultValue: 600, step: 20, unit: '$' }
    ],
    formula: 'Cap Rate = [ (Annual Gross Rent - Annual OPEX) / Purchase Price ] * 100\nCash-on-Cash = [ Annual Cash Flow / Down Payment ] * 100',
    explanation: 'Evaluating cash flow requires balancing rental revenues against operating expenses and mortgage debt service.',
    example: 'A $200k property bought with $50k down, bringing $1,800 monthly rent and $600 OPEX, achieves a 7.2% Cap Rate.',
    faq: [
      { question: 'What is a healthy Cap Rate?', answer: 'Healthy Cap Rates typically fall between 5% and 10%, though local targets vary based on market risk profiles.' }
    ],
    relatedSlugs: ['rental-income-calculator', 'real-estate-profit-calculator', 'mortgage-payment-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.price) || 1;
      const down = Number(inputs.down) || 1;
      const rent = Number(inputs.rent) || 0;
      const opex = Number(inputs.opex) || 0;

      const annualRent = rent * 12;
      const annualOpex = opex * 12;
      const noi = annualRent - annualOpex;

      const capRate = (noi / price) * 100;
      
      // Mortgage cost on remaining loan amount of $150k represented as $948/mo
      const loan = price - down;
      const mortgageYearlyCost = loan > 0 ? 950 * 12 : 0;
      
      const cashFlow = noi - mortgageYearlyCost;
      const cocReturn = (cashFlow / down) * 100;

      return {
        results: [
          { label: 'Assessed Property Cap Rate', value: capRate.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Cash-on-Cash Return Rate', value: cocReturn.toFixed(2), unit: '%' },
          { label: 'Net Operating Income (NOI)', value: noi.toFixed(2), unit: '$' },
          { label: 'Estimated Annual Cash Flow', value: cashFlow.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Your Net Operating Income (NOI)', value: Math.round(noi), color: '#39FF14' },
          { name: 'Core Operating Expenses', value: Math.round(annualOpex), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'rental-income-calculator',
    name: 'Rental Income Calculator',
    slug: 'rental-income-calculator',
    category: 'finance',
    description: 'Structure monthly and annual cash flow projections, accounting for vacancy rates and upkeep allocations.',
    seoTitle: 'Rental Property Cash Flow Calculator | Calculatoora',
    seoDescription: 'Perform modular financial mapping of rental yields. Subtract occupancy vacancy reserves and maintenance allocations.',
    inputs: [
      { id: 'rent', label: 'Nominal Monthly Rent', type: 'number', defaultValue: 1500, step: 50, unit: '$' },
      { id: 'vacancy', label: 'Estimated Vacancy Rate percentage', type: 'number', defaultValue: 5.0, step: 0.5, unit: '%' },
      { id: 'maintenance', label: 'Repairs & Capital Reserves', type: 'number', defaultValue: 150, step: 10, unit: '$' }
    ],
    formula: 'Effective Rent = Gross Rent * (1 - Vacancy / 100) - Upkeep Reserves',
    explanation: 'Experienced property owners hedge against occupancy interruptions by reserving 5-10% of revenue for vacancies and repairs.',
    example: 'A $1,500 rental property with a 5.0% vacancy rate and a $150 maintenance reserve yields an effective monthly rental cash flow of $1,275.00.',
    faq: [
      { question: 'What is a vacancy rate?', answer: 'The percentage of time a property sits unoccupied, producing zero rental revenue.' }
    ],
    relatedSlugs: ['property-roi-calculator', 'real-estate-profit-calculator', 'mortgage-calculator-advanced'],
    calculate: (inputs) => {
      const rent = Number(inputs.rent) || 0;
      const vac = Number(inputs.vacancy) || 0;
      const maint = Number(inputs.maintenance) || 0;

      const grossYearly = rent * 12;
      const vacancyLoss = grossYearly * (vac / 100);
      const effectiveGrossYearly = grossYearly - vacancyLoss;
      const netCashIncome = effectiveGrossYearly - (maint * 12);

      return {
        results: [
          { label: 'Effective Net Rental Income Yearly', value: netCashIncome.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Weekly Net Rental Equivalent', value: (netCashIncome / 52).toFixed(2), unit: '$' },
          { label: 'Vacancy Financial Losses (Yearly)', value: vacancyLoss.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Core Net Profit Retention', value: netCashIncome, color: '#39FF14' },
          { name: 'Vacancy Downtime Losses', value: Math.round(vacancyLoss), color: '#ef4444' },
          { name: 'Repairs Reserves Capital', value: maint * 12, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'real-estate-profit-calculator',
    name: 'Real Estate Profit Calculator',
    slug: 'real-estate-profit-calculator',
    category: 'finance',
    description: 'Calculate capital gains and final proceeds from real estate property sales, subtracting agent commissions and rehab costs.',
    seoTitle: 'Home Sale Profit & Net Proceeds Calculator | Calculatoora',
    seoDescription: 'Accurately model net cash proceeds from home sales. Account for broker fees, renovation costs, and mortgage payoffs.',
    inputs: [
      { id: 'sale', label: 'Property selling price', type: 'number', defaultValue: 380000, step: 5000, unit: '$' },
      { id: 'purchase', label: 'Original Purchase Price', type: 'number', defaultValue: 280000, step: 5000, unit: '$' },
      { id: 'renovations', label: 'Renovations & Rehabilitation Costs', type: 'number', defaultValue: 15000, step: 500, unit: '$' },
      { id: 'commission', label: 'Agent Fee Commissions percentage', type: 'number', defaultValue: 6.0, step: 0.1, unit: '%' }
    ],
    formula: 'Net Proceeds = Selling Price - Purchase Price - Renovations - (Selling Price * Commission percentage)',
    explanation: 'Home sale proceed calculations subtract original purchase basis, repair investments, and broker fees from gross proceeds to find net return.',
    example: 'Selling a $380,000 house bought for $280,000 (with $15,000 in repairs and 6.0% broker fees) yields a net profit of $62,200.00.',
    faq: [
      { question: 'How is broker commission calculated?', answer: 'Broker commission is usually 5% to 6% of the final sale price, split between the buyer is and seller is agents.' }
    ],
    relatedSlugs: ['property-roi-calculator', 'rental-income-calculator', 'capital-gains-tax-calculator'],
    calculate: (inputs) => {
      const sale = Number(inputs.sale) || 0;
      const purchase = Number(inputs.purchase) || 0;
      const reno = Number(inputs.renovations) || 0;
      const commRate = Number(inputs.commission) || 0;

      const commissionFee = sale * (commRate / 100);
      const totalCostBasis = purchase + reno + commissionFee;
      const profitVal = sale - totalCostBasis;

      return {
        results: [
          { label: 'Net Procedural Profit Gain', value: profitVal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Realtor Commission fees', value: commissionFee.toFixed(2), unit: '$' },
          { label: 'Integrated Cost Basis pool', value: totalCostBasis.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Property Purchase', value: purchase, color: '#312e81' },
          { name: 'Realtor Fees and Repairs', value: Math.round(reno + commissionFee), color: '#ef4444' },
          { name: 'Real Profit Margin Net', value: Math.max(0, profitVal), color: '#39FF14' }
        ]
      };
    }
  }
];
