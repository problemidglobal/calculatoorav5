import { Calculator } from '../types';

export const V17_PART3_CALCULATORS: Calculator[] = [
  // ====================================== FINANCE ======================================
  {
    id: 'fin-retirement-planning',
    name: 'Retirement Nest Egg Calculator',
    slug: 'fin-retirement-planning',
    category: 'finance',
    description: 'Calculate your projected retirement fund and trace necessary monthly contribution milestones.',
    formula: 'Nest Egg = P * (1 + r)^n + monthly * (((1 + r)^n - 1) / r)',
    explanation: 'Projects compounding returns over your working years and adjusts for buying power inflation shifts.',
    example: 'Starting at age 30 with $20,000 and saving $500 monthly at a 7% return yields around $602,000 by age 60.',
    inputs: [
      { id: 'currAge', label: 'Current Age', type: 'number', defaultValue: 30, min: 18, max: 80 },
      { id: 'retAge', label: 'Desired Retirement Age', type: 'number', defaultValue: 65, min: 40, max: 90 },
      { id: 'savings', label: 'Current Existing Savings', type: 'number', defaultValue: 25000, min: 0, step: 1000, unit: '$' },
      { id: 'monthly', label: 'Monthly Investment Saving', type: 'number', defaultValue: 400, min: 0, step: 50, unit: '$' },
      { id: 'growth', label: 'Expected Annual Growth Yield', type: 'number', defaultValue: 7, min: 1, max: 15, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'What compound return should I expect?', answer: 'The historical average annual inflation-adjusted return of the S&P 500 is approximately 6-7% over long-term periods.' }
    ],
    relatedSlugs: ['fin-401k-growth', 'fin-ira-traditional-roth', 'fin-compound-interest'],
    seoTitle: 'Retirement Savings Nest Egg & Savings Milestone Calculator',
    seoDescription: 'Obtain retirement nest egg totals and model required monthly savings milestones.',
    calculate: (inputs) => {
      const cAge = Number(inputs.currAge || 30);
      const rAge = Number(inputs.retAge || 65);
      const pv = Number(inputs.savings || 0);
      const pmt = Number(inputs.monthly || 0);
      const r = Number(inputs.growth || 7) / 100 / 12;
      const n = Math.max(0, (rAge - cAge) * 12);
      
      const futureSavings = pv * Math.pow(1 + r, n);
      const futureContributions = r > 0 ? pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r) : pmt * n;
      const totalNestEgg = futureSavings + futureContributions;
      
      return {
        results: [
          { label: 'Projected Retirement Nest Egg', value: Math.round(totalNestEgg), unit: '$', isPrimary: true },
          { label: 'Cumulative Personal Contributions', value: pmt * n, unit: '$' },
          { label: 'Compounded Investment Returns', value: Math.max(0, Math.round(totalNestEgg - pv - pmt * n)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'fin-401k-growth',
    name: '401k Accumulation Calculator',
    slug: 'fin-401k-growth',
    category: 'finance',
    description: 'Calculate standard tax-advantaged 401k future values including company match rules.',
    formula: 'Match Limit = Match % * maxMatch % cap',
    explanation: 'Integrates payroll contributions matching guidelines to calculate true compounding portfolios.',
    example: 'A $100,000 worker contributing 6% with 50% match on first 6% gets an extra $3,000 matches yearly.',
    inputs: [
      { id: 'salary', label: 'Current Base Salary', type: 'number', defaultValue: 85000, min: 10000, step: 2000, unit: '$/yr' },
      { id: 'savingPct', label: 'Your Contribution Rate', type: 'number', defaultValue: 6, min: 1, max: 30, unit: '%' },
      { id: 'matchPct', label: 'Employer Match Percentage', type: 'number', defaultValue: 50, min: 0, max: 100, unit: '%' },
      { id: 'matchLimitPct', label: 'Employer Match Maximum Cap', type: 'number', defaultValue: 6, min: 0, max: 20, unit: '%' },
      { id: 'horizon', label: 'Working Years Horizon', type: 'number', defaultValue: 20, min: 1, max: 50, unit: 'years' }
    ],
    faq: [
      { question: 'What does "employer match maximum cap" mean?', answer: 'The ceiling percentage of your base salary up to which your company will match your retirement fund deposits.' }
    ],
    relatedSlugs: ['fin-retirement-planning', 'fin-ira-traditional-roth'],
    seoTitle: '401(k) Future Value Growth & Company Match Calculator',
    seoDescription: 'Benchmark maximum employee 401k contribution projections and company match rewards.',
    calculate: (inputs) => {
      const salary = Number(inputs.salary || 50000);
      const savePct = Number(inputs.savingPct || 5) / 100;
      const matchPct = Number(inputs.matchPct || 50) / 100;
      const matchLimit = Number(inputs.matchLimitPct || 6) / 100;
      const years = Number(inputs.horizon || 20);
      
      const r = 0.07 / 12; // 7% standard growth
      const n = years * 12;
      
      const yearlyPersonal = salary * savePct;
      const matchedShare = Math.min(savePct, matchLimit);
      const yearlyEmployer = salary * matchedShare * matchPct;
      
      const monthlyPmt = (yearlyPersonal + yearlyEmployer) / 12;
      const futValue = r > 0 ? monthlyPmt * ((Math.pow(1 + r, n) - 1) / r) : monthlyPmt * n;
      
      return {
        results: [
          { label: 'Projected 401k Account Value', value: Math.round(futValue), unit: '$', isPrimary: true },
          { label: 'Annual Company Matches Added', value: Math.round(yearlyEmployer), unit: '$' },
          { label: 'Total Personal Capital Invested', value: Math.round(yearlyPersonal * years), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'fin-ira-traditional-roth',
    name: 'Traditional vs Roth IRA Calculator',
    slug: 'fin-ira-traditional-roth',
    category: 'finance',
    description: 'Compare Traditional and Roth tax structures to identify optimal post-retirement earnings.',
    formula: 'Traditional AfterTax = Total * (1 - retirementTax %); Roth AfterTax = Total',
    explanation: 'Models upfront tax-deductions against tax-free withdrawals at your anticipated retirement brackets.',
    example: 'Having high income today favors Traditional IRAs, while low starting tax rates favor Roth accounts.',
    inputs: [
      { id: 'contrib', label: 'Annual Contribution', type: 'number', defaultValue: 7000, min: 100, max: 20000, unit: '$/yr' },
      { id: 'currTax', label: 'Your Current Income Tax Bracket', type: 'number', defaultValue: 24, min: 0, max: 50, unit: '%' },
      { id: 'retTax', label: 'Anticipated Retirement Tax Bracket', type: 'number', defaultValue: 12, min: 0, max: 50, unit: '%' },
      { id: 'years', label: 'Investment Duration', type: 'number', defaultValue: 25, min: 1, max: 50, unit: 'years' }
    ],
    faq: [
      { question: 'What is the primary difference in Roth IRAs?', answer: 'Roth contributions are funded with post-tax dollars, meaning all future compounding capital gains and withdrawals are completely tax-free.' }
    ],
    relatedSlugs: ['fin-retirement-planning', 'fin-401k-growth', 'fin-compound-interest'],
    seoTitle: 'Traditional vs Roth IRA Retirement Tax Calculator',
    seoDescription: 'Obtain tax comparisons of Traditional vs Roth IRA setups over multiple years.',
    calculate: (inputs) => {
      const pmt = Number(inputs.contrib || 6500);
      const currTax = Number(inputs.currTax || 22) / 100;
      const retTax = Number(inputs.retTax || 15) / 100;
      const terms = Number(inputs.years || 20);
      
      const r = 0.07;
      
      // Traditional IRA: pre-tax dollars compound, but pay tax on the backend
      let tradValue = 0;
      for (let i = 0; i < terms; i++) {
        tradValue = (tradValue + pmt) * (1 + r);
      }
      const tradNetOfTax = tradValue * (1 - retTax);
      
      // Roth IRA: pay tax upfront, so net contribution is lower if comparing out-of-pocket budget
      // Or if depositing full limit, we compare equal deposit values:
      let rothValue = 0;
      for (let i = 0; i < terms; i++) {
        rothValue = (rothValue + pmt) * (1 + r);
      }
      
      // Traditional opportunity cost: traditional saved tax upfront which could be separately invested
      const directTaxShieldSavings = pmt * currTax;
      let taxShieldFund = 0;
      for (let i = 0; i < terms; i++) {
        taxShieldFund = (taxShieldFund + directTaxShieldSavings) * (1 + r);
      }
      // traditional net combines the tax shield fund
      const adjustedTradNet = tradNetOfTax + (taxShieldFund * (1 - currTax)); // tax shield gets capital gains tax context
      
      return {
        results: [
          { label: 'Roth Net Post-Tax value', value: Math.round(rothValue), unit: '$', isPrimary: true },
          { label: 'Traditional Net (Tax Shield adjusted)', value: Math.round(adjustedTradNet), unit: '$' },
          { label: 'Recommendation', value: retTax < currTax ? 'Traditional Preferred' : 'Roth Preferred' }
        ]
      };
    }
  },
  {
    id: 'fin-etf-growth',
    name: 'Stock Portfolio & Fee Calculator',
    slug: 'fin-etf-growth',
    category: 'finance',
    description: 'Calculate Stock or ETF portfolio values after deducting annual management expense ratios (ER).',
    formula: 'Net Return = Gross Return - Expense Ratio %',
    explanation: 'Isolates fund management fees to demonstrate the impact of fees on long-term compound performance.',
    example: 'A portfolio scaling to $250,000 under a 1.5% management fee wastes over $18,000 to administrative fees.',
    inputs: [
      { id: 'principal', label: 'Starting Balance', type: 'number', defaultValue: 10000, min: 0, step: 500, unit: '$' },
      { id: 'monthly', label: 'Recurring Monthly Deposit', type: 'number', defaultValue: 300, min: 0, step: 50, unit: '$' },
      { id: 'returns', label: 'Average Annual Return', type: 'number', defaultValue: 8, min: 1, max: 20, step: 0.1, unit: '%' },
      { id: 'expense', label: 'Fund Expense Ratio (ER)', type: 'number', defaultValue: 0.75, min: 0, max: 5, step: 0.05, unit: '%' },
      { id: 'years', label: 'Horizon Timeline', type: 'number', defaultValue: 20, min: 1, max: 50, unit: 'years' }
    ],
    faq: [
      { question: 'What is an Expense Ratio?', answer: 'The annual percentage fee a mutual fund or Exchange-Traded Fund (ETF) charges investors to cover operating and portfolio management expenses.' }
    ],
    relatedSlugs: ['fin-compound-interest', 'fin-inflation-impact', 'fin-net-worth'],
    seoTitle: 'Mutual Fund & ETF Expense Fee Growth Calculator',
    seoDescription: 'Obtain projected investment portfolios net of annual fund expense ratios.',
    calculate: (inputs) => {
      const pv = Number(inputs.principal || 10000);
      const pmt = Number(inputs.monthly || 200);
      const gr = Number(inputs.returns || 8) / 100;
      const fees = Number(inputs.expense || 0.5) / 100;
      const terms = Number(inputs.years || 15);
      
      const rGross = gr / 12;
      const rNet = (gr - fees) / 12;
      const n = terms * 12;
      
      const valGross = pv * Math.pow(1 + rGross, n) + (rGross > 0 ? pmt * ((Math.pow(1 + rGross, n) - 1) / rGross) * (1 + rGross) : pmt * n);
      const valNet = pv * Math.pow(1 + rNet, n) + (rNet > 0 ? pmt * ((Math.pow(1 + rNet, n) - 1) / rNet) * (1 + rNet) : pmt * n);
      
      const lostToFees = valGross - valNet;
      
      return {
        results: [
          { label: 'Portfolio Net Market Value', value: Math.round(valNet), unit: '$', isPrimary: true },
          { label: 'Compounded Fees Handed to Fund', value: Math.round(lostToFees), unit: '$' },
          { label: 'Hypothetical Maximum Unfeeed Value', value: Math.round(valGross), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'fin-compound-interest',
    name: 'Compound Interest Calculator',
    slug: 'fin-compound-interest',
    category: 'finance',
    description: 'Calculate compounding yields across daily, monthly, and yearly intervals.',
    formula: 'A = P * (1 + r/n)^(nt)',
    explanation: 'Models interest compounding directly on accrued interest to maximize long-term savings projections.',
    example: 'A $5,000 principal returning 6% compounded monthly grows to $9,096 in exactly 10 years.',
    inputs: [
      { id: 'principal', label: 'Starting Principal Deposit', type: 'number', defaultValue: 5000, min: 100, step: 500, unit: '$' },
      { id: 'rate', label: 'Nominal Yearly Rate (APR)', type: 'number', defaultValue: 6.5, min: 0.1, max: 50, step: 0.1, unit: '%' },
      { id: 'years', label: 'Years of Growth Term', type: 'number', defaultValue: 10, min: 1, max: 100, unit: 'years' },
      { id: 'freq', label: 'Compounding Cadence Frequency', type: 'select', defaultValue: '12', options: [
        { label: 'Annually (1x/yr)', value: '1' },
         { label: 'Quarterly (4x/yr)', value: '4' },
         { label: 'Monthly (12x/yr)', value: '12' },
         { label: 'Daily (365x/yr)', value: '365' }
      ]}
    ],
    faq: [
      { question: 'What is APY vs APR?', answer: 'APR (Annual Percentage Rate) is the raw interest rate. APY (Annual Percentage Yield) represents the actual return earned when compounding intervals are factored in.' }
    ],
    relatedSlugs: ['fin-retirement-planning', 'fin-etf-growth', 'fin-dividend-yield'],
    seoTitle: 'Daily and Monthly Compound Interest Calculator',
    seoDescription: 'Accurately forecast interest compounding over custom years and tracking velocities.',
    calculate: (inputs) => {
      const pv = Number(inputs.principal || 1000);
      const apr = Number(inputs.rate || 5) / 100;
      const terms = Number(inputs.years || 5);
      const freq = Number(inputs.freq || 12);
      
      const finalVal = pv * Math.pow(1 + apr / freq, freq * terms);
      const earnings = finalVal - pv;
      const apy = (Math.pow(1 + apr / freq, freq) - 1) * 100;
      
      return {
        results: [
          { label: 'Compounded Account Balance', value: Math.round(finalVal), unit: '$', isPrimary: true },
          { label: 'Accumulated Interest Earnings', value: Math.round(earnings), unit: '$' },
          { label: 'Calculated Equivalent APY Yield', value: Number(apy.toFixed(3)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'fin-credit-card-payoff',
    name: 'Credit Card Payoff Calculator',
    slug: 'fin-credit-card-payoff',
    category: 'finance',
    description: 'Calculate months required to pay off credit card balances under structured payment targets.',
    formula: 'N = -log(1 - r*B/P) / log(1 + r)',
    explanation: 'Models interest amortizations to demonstrate the cost of making minimum card payments.',
    example: 'A $3,000 card balance at 21% APR paid at $100 monthly takes 44 months and consumes $1,328 in interest.',
    inputs: [
      { id: 'balance', label: 'Outstanding Card Balance', type: 'number', defaultValue: 3000, min: 100, step: 250, unit: '$' },
      { id: 'rate', label: 'Card Interest Rate (APR)', type: 'number', defaultValue: 21.9, min: 1, max: 45, step: 0.1, unit: '%' },
      { id: 'pmt', label: 'Fixed Monthly Payment', type: 'number', defaultValue: 120, min: 10, step: 10, unit: '$' }
    ],
    faq: [
      { question: 'Why is minimum payment dangerous?', answer: 'Minimum payments (often 2-3% of balances) barely cover monthly interest accrual, dragging debt timelines out to decades while inflating interest paid.' }
    ],
    relatedSlugs: ['fin-debt-consolidation', 'fin-compound-interest'],
    seoTitle: 'Credit Card Debt payoff, amortization timeline calculator',
    seoDescription: 'Obtain required months and calculate interest saved by increasing card deposits.',
    calculate: (inputs) => {
      const b = Number(inputs.balance || 1000);
      const apr = Number(inputs.rate || 18) / 100;
      const pmt = Number(inputs.pmt || 50);
      
      const r = apr / 12;
      
      // Check if payment covers monthly interest
      if (pmt <= b * r) {
        return {
          results: [
            { label: 'Payoff Duration', value: 'Infinity (Payment too low)', isPrimary: true },
            { label: 'Monthly Interest Accrual', value: Math.round(b * r), unit: '$/month' }
          ]
        };
      }
      
      const months = -Math.log(1 - (r * b) / pmt) / Math.log(1 + r);
      const totalPaid = pmt * months;
      const totalInterest = totalPaid - b;
      
      return {
        results: [
          { label: 'Payoff Duration Milestone', value: Math.ceil(months), unit: 'months', isPrimary: true },
          { label: 'Cumulative Card Interest Paid', value: Math.round(totalInterest), unit: '$' },
          { label: 'Overall Payment Sum Expense', value: Math.round(totalPaid), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'fin-debt-consolidation',
    name: 'Debt Consolidation Savings Calculator',
    slug: 'fin-debt-consolidation',
    category: 'finance',
    description: 'Compare multi-loan interest totals with equivalent consolidated low-rate loans.',
    formula: 'Monthly Savings = SUM(Previous Payments) - Consolidated Payment',
    explanation: 'Demonstrates the cash-flow impact of moving several small card debts into a single personal loan.',
    example: 'Consolidating $15,000 in debts at 22% APR down to 10% APR saves over $120 monthly in interest payments.',
    inputs: [
      { id: 'debtAmount', label: 'Total Current Debt Balance', type: 'number', defaultValue: 15000, min: 1000, step: 1000, unit: '$' },
      { id: 'debtApr', label: 'Average Combined APR', type: 'number', defaultValue: 21, min: 1, max: 45, unit: '%' },
      { id: 'consApr', label: 'Consolidated Loan Target APR', type: 'number', defaultValue: 11, min: 1, max: 30, unit: '%' },
      { id: 'consTerm', label: 'Target Payback Horizon', type: 'number', defaultValue: 36, min: 12, max: 120, unit: 'months' }
    ],
    faq: [
      { question: 'What is a consolidation loan?', answer: 'A single, lower-interest installment loan used to pay off multiple high-interest revolving card balances, simplifying payments.' }
    ],
    relatedSlugs: ['fin-credit-card-payoff', 'fin-compound-interest'],
    seoTitle: 'Debt Consolidation Monthly Payment & Interest Savings Calculator',
    seoDescription: 'Compare high-interest card portfolios with low-APR personal consolidation plans.',
    calculate: (inputs) => {
      const debt = Number(inputs.debtAmount || 5000);
      const prvApr = Number(inputs.debtApr || 20) / 100;
      const newApr = Number(inputs.consApr || 10) / 100;
      const m = Number(inputs.consTerm || 36);
      
      const rNew = newApr / 12;
      const pmNew = debt * (rNew * Math.pow(1 + rNew, m)) / (Math.pow(1 + rNew, m) - 1);
      
      const rPrv = prvApr / 12;
      const pmPrv = debt * (rPrv * Math.pow(1 + rPrv, m)) / (Math.pow(1 + rPrv, m) - 1);
      
      const monthlySavings = pmPrv - pmNew;
      const interestSaved = (pmPrv * m) - (pmNew * m);
      
      return {
        results: [
          { label: 'Cumulative Interest Saved', value: Math.round(interestSaved), unit: '$', isPrimary: true },
          { label: 'Consolidated Monthly Payment', value: Math.round(pmNew), unit: '$/month' },
          { label: 'Monthly Payment Decrease Margin', value: Math.round(monthlySavings), unit: '$/month' }
        ]
      };
    }
  },
  {
    id: 'fin-emergency-fund',
    name: 'Emergency Fund Safety Calculator',
    slug: 'fin-emergency-fund',
    category: 'finance',
    description: 'Calculate target cash reserves needed to cover core living expenses across recessions.',
    formula: 'Reserves = (Rent + Food + Utilities + Debt) * Duration months',
    explanation: 'Profiles fixed expenses to determine optimal cash cushion targets in checking or savings.',
    example: 'An individual spending $2,800 monthly on rent, bills, and groceries needs a $16,800 emergency fund to cover 6 months.',
    inputs: [
      { id: 'rent', label: 'Rent or Mortgage Payments', type: 'number', defaultValue: 1500, min: 0, step: 100, unit: '$/mo' },
      { id: 'food', label: 'Basic Grocery & Food Spend', type: 'number', defaultValue: 500, min: 0, step: 50, unit: '$/mo' },
      { id: 'utils', label: 'Mandatory Bills & Utilities', type: 'number', defaultValue: 350, min: 0, step: 50, unit: '$/mo' },
      { id: 'safetyMonths', label: 'Intended Protection Period', type: 'select', defaultValue: '6', options: [
        { label: '3 Months (Lean and tactical)', value: '3' },
         { label: '6 Months (Recommended baseline)', value: '6' },
         { label: '12 Months (High career uncertainty)', value: '12' }
      ]}
    ],
    faq: [
      { question: 'Where should I hold emergency funds?', answer: 'In highly liquid, safe accounts like High-Yield Savings Accounts (HYSA) or Money Market Funds, rather than volatile stock portfolios.' }
    ],
    relatedSlugs: ['fin-net-worth', 'fin-compound-interest'],
    seoTitle: 'Family Emergency Fund & Cash Reserves Planner',
    seoDescription: 'Accurately size cash cushion targets using custom monthly living budgets.',
    calculate: (inputs) => {
      const rent = Number(inputs.rent || 1000);
      const food = Number(inputs.food || 300);
      const utils = Number(inputs.utils || 200);
      const months = Number(inputs.safetyMonths || 6);
      
      const monBase = rent + food + utils;
      const targetFund = monBase * months;
      
      return {
        results: [
          { label: 'Required Cash Safety Targets', value: targetFund, unit: '$', isPrimary: true },
          { label: 'Core Monthly Living Expenses', value: monBase, unit: '$/month' },
          { label: 'Equivalent Safety Daily Budget', value: Number((monBase / 30).toFixed(1)), unit: '$/day' }
        ]
      };
    }
  },
  {
    id: 'fin-net-worth',
    name: 'Personal Net Worth Calculator',
    slug: 'fin-net-worth',
    category: 'finance',
    description: 'Aggregate financial assets and subtract outstanding liabilities to track true personal wealth.',
    formula: 'Net Worth = Total Assets - Total Liabilities',
    explanation: 'Summarizes physical equity, cash, and stock shares against properties and credit card balances.',
    example: 'Owning a $300,000 house with a $180,000 mortgage and $40,000 in index portfolios yields a net worth of $160,000.',
    inputs: [
      { id: 'home', label: 'Properties / Physical Real Estate', type: 'number', defaultValue: 320000, min: 0, step: 5000, unit: '$' },
      { id: 'invest', label: 'Stocks, ETFs, & IRA Portfolios', type: 'number', defaultValue: 75000, min: 0, step: 2000, unit: '$' },
      { id: 'cash', label: 'Liquid Savings & Bank Reserves', type: 'number', defaultValue: 18000, min: 0, step: 500, unit: '$' },
      { id: 'mortgage', label: 'Mortgage Loan Debt Balance', type: 'number', defaultValue: 195000, min: 0, step: 5000, unit: '$' },
      { id: 'otherDebt', label: 'Credit Card & Student Debts', type: 'number', defaultValue: 12000, min: 0, step: 500, unit: '$' }
    ],
    faq: [
      { question: 'Why does Net Worth matter more than salary?', answer: 'Earnings only reflect active income cash flows. Net Worth measures actual retained wealth and long-term financial independence.' }
    ],
    relatedSlugs: ['fin-retirement-planning', 'fin-emergency-fund', 'fin-compound-interest'],
    seoTitle: 'Personal Net Worth Asset Allocation Balance Calculator',
    seoDescription: 'Obtain consolidated equity, property value, and debt balances to find your net worth online.',
    calculate: (inputs) => {
      const home = Number(inputs.home || 0);
      const invest = Number(inputs.invest || 0);
      const cash = Number(inputs.cash || 0);
      const mortgage = Number(inputs.mortgage || 0);
      const oDebt = Number(inputs.otherDebt || 0);
      
      const assets = home + invest + cash;
      const liabilities = mortgage + oDebt;
      const nw = assets - liabilities;
      
      return {
        results: [
          { label: 'Calculated Net Worth', value: nw, unit: '$', isPrimary: true },
          { label: 'Consolidated Asset Values', value: assets, unit: '$' },
          { label: 'Consolidated Liabilities Debt', value: liabilities, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'fin-dividend-yield',
    name: 'Dividend Income & Yield Calculator',
    slug: 'fin-dividend-yield',
    category: 'finance',
    description: 'Calculate dividend cash returns and track monthly portfolio income schedules.',
    formula: 'Yield % = Annual Dividend / Purchase Price * 100',
    explanation: 'Converts share counts and cash distributions into passive retirement income trajectories.',
    example: 'Holding 500 shares of a $60 stock paying $2.40 yearly dividends pays $1,200 annually, yielding 4.0%.',
    inputs: [
      { id: 'price', label: 'Average Share Purchase Price', type: 'number', defaultValue: 65, min: 1, step: 1, unit: '$' },
      { id: 'shares', label: 'Number of Shares Owned', type: 'number', defaultValue: 300, min: 1 },
      { id: 'divShare', label: 'Annual Dividend Per Share', type: 'number', defaultValue: 2.10, min: 0.01, step: 0.1, unit: '$/yr' }
    ],
    faq: [
      { question: 'What is DRIP (Dividend Reinvestment)?', answer: 'The automated process of using cash dividends to buy additional fractional shares, speeding up portfolio compounding.' }
    ],
    relatedSlugs: ['fin-etf-growth', 'fin-compound-interest', 'fin-retirement-planning'],
    seoTitle: 'Passive Stock Dividend Yield & Monthly Income Calculator',
    seoDescription: 'Obtain yearly dividend cash flows based on stock holdings.',
    calculate: (inputs) => {
      const price = Number(inputs.price || 10);
      const shares = Number(inputs.shares || 10);
      const div = Number(inputs.divShare || 0.5);
      
      const totalCapital = price * shares;
      const annualDiv = shares * div;
      const yieldPct = totalCapital > 0 ? (annualDiv / totalCapital) * 100 : 0;
      
      return {
        results: [
          { label: 'Annual Passive Dividend Income', value: Math.round(annualDiv), unit: '$/year', isPrimary: true },
          { label: 'Dividend Yield Rate', value: Number(yieldPct.toFixed(2)), unit: '%' },
          { label: 'Averaged Monthly Return Cash', value: Number((annualDiv / 12).toFixed(2)), unit: '$/month' }
        ]
      };
    }
  },
  {
    id: 'fin-inflation-impact',
    name: 'Inflation Purchasing Power Calculator',
    slug: 'fin-inflation-impact',
    category: 'finance',
    description: 'Model compounding annual inflation rates to find future cash purchasing power.',
    formula: 'Future Value = Current Cash / (1 + Inflation % / 100) ^ Years',
    explanation: 'Tracks purchasing power declines to highlight the hazard of keeping large cash savings uninvested.',
    example: 'Keeping $50,000 cash under a mattress matches only $30,477 in purchasing power in 15 years under 3.3% inflation.',
    inputs: [
      { id: 'amt', label: 'Starting Cash Savings Balance', type: 'number', defaultValue: 20000, min: 100, step: 1000, unit: '$' },
      { id: 'rate', label: 'Expected Annual Inflation Rate', type: 'number', defaultValue: 3.2, min: 0.1, max: 100, step: 0.1, unit: '%' },
      { id: 'years', label: 'Timeline Duration Horizon', type: 'number', defaultValue: 15, min: 1, max: 100, unit: 'years' }
    ],
    faq: [
      { question: 'Why does inflation occur?', answer: 'Compounding credit expansion, global supply imbalances, and money printing steadily devalue currency purchasing power over time.' }
    ],
    relatedSlugs: ['fin-retirement-planning', 'fin-etf-growth', 'fin-compound-interest'],
    seoTitle: 'Cash Purchasing Power Inflation Loss Calculator',
    seoDescription: 'Obtain compound decay metrics showing how inflation reduces future cash balances.',
    calculate: (inputs) => {
      const amt = Number(inputs.amt || 1000);
      const inf = Number(inputs.rate || 3) / 100;
      const years = Number(inputs.years || 10);
      
      const lostVal = amt / Math.pow(1 + inf, years);
      const lostDelta = amt - lostVal;
      
      return {
        results: [
          { label: 'Remaining Future Buying Power', value: Math.round(lostVal), unit: '$', isPrimary: true },
          { label: 'Cumulative Power Value Lost', value: Math.round(lostDelta), unit: '$' },
          { label: 'Devaluation Ratio Result', value: Number(((lostVal / amt) * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'fin-bracket-tax',
    name: 'US Income Tax Estimator',
    slug: 'fin-bracket-tax',
    category: 'finance',
    description: 'Calculate effective federal income tax liabilities using standard US bracket schedules.',
    formula: 'Tax = Sum of (Income in bracket range * Bracket tax rate)',
    explanation: 'Integrates progressive brackets and standard deductions to calculate real average tax burdens.',
    example: 'A single tax-filer earning $95,000 pays an estimated $12,900 in federal taxes, yielding a 13.5% effective rate.',
    inputs: [
      { id: 'income', label: 'Gross Annual Household Income', type: 'number', defaultValue: 95000, min: 1000, step: 5000, unit: '$' },
      { id: 'status', label: 'Filing Status Group', type: 'select', defaultValue: 'single', options: [
        { label: 'Single filer', value: 'single' },
         { label: 'Married filing jointly', value: 'married' }
      ]}
    ],
    faq: [
      { question: 'What is marginal vs effective tax rate?', answer: 'Marginal tax is the rate applied to your highest dollar of income. Effective tax is the actual weighted percentage of your total income paid to the government.' }
    ],
    relatedSlugs: ['fin-retirement-planning', 'fin-net-worth', 'pm-resource-pricing'],
    seoTitle: 'US Progressive Income Tax & Bracket Estimator',
    seoDescription: 'Obtain progressive average tax liabilities after applying federal standard deductions.',
    calculate: (inputs) => {
      const income = Number(inputs.income || 50000);
      const status = String(inputs.status || 'single');
      
      // Standard Deductions 
      const deduction = status === 'married' ? 29200 : 14600;
      const taxable = Math.max(0, income - deduction);
      
      // Marginal Brackets Simplified for calculations (Single standard)
      const bracketsSingle = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];
      
      const bracketsMarried = [
        { limit: 23200, rate: 0.10 },
        { limit: 94300, rate: 0.12 },
        { limit: 201050, rate: 0.22 },
        { limit: 383900, rate: 0.24 },
        { limit: 487450, rate: 0.32 },
        { limit: 731200, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];
      
      const brackets = status === 'married' ? bracketsMarried : bracketsSingle;
      
      let tax = 0;
      let remaining = taxable;
      let previousLimit = 0;
      let maxBracket = 10;
      
      for (const b of brackets) {
        const range = b.limit - previousLimit;
        const chunk = Math.min(remaining, range);
        tax += chunk * b.rate;
        remaining -= chunk;
        if (chunk > 0) maxBracket = b.rate * 100;
        if (remaining <= 0) break;
        previousLimit = b.limit;
      }
      
      const effectiveRate = income > 0 ? (tax / income) * 100 : 0;
      
      return {
        results: [
          { label: 'Estimated Federal Tax Owed', value: Math.round(tax), unit: '$', isPrimary: true },
          { label: 'Effective Income Tax Rate', value: Number(effectiveRate.toFixed(1)), unit: '%' },
          { label: 'Highest Marginal bracket hit', value: `${maxBracket}%` }
        ]
      };
    }
  },

  // ====================================== BUSINESS ======================================
  {
    id: 'bus-saas-cac-ltv',
    name: 'SaaS LTV to CAC Unit Economics Calculator',
    slug: 'bus-saas-cac-ltv',
    category: 'business',
    description: 'Calculate Customer Lifetime Value (LTV) and evaluate LTV-to-CAC marketing multipliers.',
    formula: 'LTV = ARPU / Churn Rate; Ratio = LTV / CAC',
    explanation: 'Validates subscription business models by comparing client acquisition costs against lifetime revenues.',
    example: 'A $50/mo user churned at 5% monthly generates $1,000 LTV. With a $200 CAC, the LTV-to-CAC ratio stands at premium 5x multipliers.',
    inputs: [
      { id: 'arpu', label: 'Average Account Revenue (ARPU)', type: 'number', defaultValue: 45, min: 1, unit: '$/mo' },
      { id: 'churn', label: 'Monthly Customer Churn Rate', type: 'number', defaultValue: 4, min: 0.1, max: 100, step: 0.1, unit: '%' },
      { id: 'cac', label: 'Customer Acquisition Cost (CAC)', type: 'number', defaultValue: 180, min: 1, step: 10, unit: '$' }
    ],
    faq: [
      { question: 'What is a good LTV to CAC ratio?', answer: 'A ratio over 3.0 is standard for healthy, scaling SaaS startups. Ratios below 2.0 indicate high acquisition costs or high customer churn.' }
    ],
    relatedSlugs: ['bus-churn', 'bus-breakeven', 'pm-project-roi'],
    seoTitle: 'SaaS Unit Economics LTV & CAC Ratio Calculator',
    seoDescription: 'Benchmark subscription lifetime value coefficients against customer acquisition costs.',
    calculate: (inputs) => {
      const arpu = Number(inputs.arpu || 20);
      const churn = Number(inputs.churn || 5) / 100;
      const cac = Number(inputs.cac || 100);
      
      const ltv = churn > 0 ? arpu / churn : 0;
      const ratio = cac > 0 ? ltv / cac : 0;
      const payback = arpu > 0 ? cac / arpu : 0;
      
      return {
        results: [
          { label: 'Customer Lifetime Value (LTV)', value: Math.round(ltv), unit: '$', isPrimary: true },
          { label: 'Ratio (LTV : CAC Limit)', value: `${Number(ratio.toFixed(2))}x` },
          { label: 'Fin payback timeline speed', value: Number(payback.toFixed(1)), unit: 'months' }
        ]
      };
    }
  },
  {
    id: 'bus-breakeven',
    name: 'Business Breakeven Point Calculator',
    slug: 'bus-breakeven',
    category: 'business',
    description: 'Calculate manufacturing sales targets required to cover initial fixed business overheads.',
    formula: 'Units = Fixed Expenses / (Sales Price - Cost per Unit)',
    explanation: 'Models profit boundaries to show when business revenues cross over into net operational profitability.',
    example: 'Selling widgets at $15 with $5 manufacturing costs and $10,000 fixed overheads demands 1,000 unit sales to break even.',
    inputs: [
      { id: 'fixed', label: 'Fixed Monthly Overhead Costs', type: 'number', defaultValue: 8000, min: 100, step: 500, unit: '$' },
      { id: 'price', label: 'Average Unit Selling Price', type: 'number', defaultValue: 45, min: 0.1, step: 1, unit: '$' },
      { id: 'cogs', label: 'Incremental Variable COGS per Unit', type: 'number', defaultValue: 25, min: 0, step: 1, unit: '$' }
    ],
    faq: [
      { question: 'What is margin definition?', answer: 'The selling price of an item minus its incremental variable cost, representing the cash contribution of each sale toward paying off fixed overheads.' }
    ],
    relatedSlugs: ['bus-saas-cac-ltv', 'bus-gross-margin', 'bus-investment-roi'],
    seoTitle: 'Commercial Breakeven Sales & Volumetric Weight Calculator',
    seoDescription: 'Obtain the exact count of sales units needed each month to pay off monthly overhead bills.',
    calculate: (inputs) => {
      const fixed = Number(inputs.fixed || 5000);
      const price = Number(inputs.price || 10);
      const cogs = Number(inputs.cogs || 4);
      
      const margin = price - cogs;
      if (margin <= 0) {
        return {
          results: [
            { label: 'Breakeven Point', value: 'Never (Price below cost)', isPrimary: true },
            { label: 'Variable Unit Loss Margin', value: Math.round(margin), unit: '$/unit' }
          ]
        };
      }
      
      const units = fixed / margin;
      const breakevenRevenue = units * price;
      
      return {
        results: [
          { label: 'Required Monthly Unit Sales', value: Math.ceil(units), unit: 'units', isPrimary: true },
          { label: 'Breakeven Monthly Revenue', value: Math.round(breakevenRevenue), unit: '$' },
          { label: 'Marginal cash margin ratio', value: Number(((margin / price) * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'bus-churn',
    name: 'Customer Churn & Retention Calculator',
    slug: 'bus-churn',
    category: 'business',
    description: 'Calculate monthly customer attrition rates and corresponding losses in revenue runrates.',
    formula: 'Churn % = Attrited accounts / Starting portfolios * 100',
    explanation: 'Analyzes user churn rates to help determine client retention wellness.',
    example: 'Losing 15 out of 300 base customers in an active month scales out to structural 5% monthly churn rates.',
    inputs: [
      { id: 'start', label: 'Starting Active Customers Count', type: 'number', defaultValue: 500, min: 1 },
      { id: 'lost', label: 'Customers Lost during Period', type: 'number', defaultValue: 20, min: 0 },
      { id: 'arpu', label: 'Customer Monthly Subscription Cost', type: 'number', defaultValue: 40, min: 1, unit: '$/mo' }
    ],
    faq: [
      { question: 'Why is churn critical in enterprise sales?', answer: 'Even a modest 5% monthly churn compound drains up to 46% of your customer base over a single calendar year, necessitating expensive acquisition streams to maintain stable revenue.' }
    ],
    relatedSlugs: ['bus-saas-cac-ltv', 'bus-gross-margin'],
    seoTitle: 'Customer Retention & Churn Rate Loss Calculator',
    seoDescription: 'Track user attrition rates and forecast revenue run-rate impacts.',
    calculate: (inputs) => {
      const start = Number(inputs.start || 100);
      const lost = Number(inputs.lost || 0);
      const arpu = Number(inputs.arpu || 20);
      
      const rate = start > 0 ? (lost / start) * 100 : 0;
      const retention = 100 - rate;
      const mrrLost = lost * arpu;
      
      return {
        results: [
          { label: 'Monthly Customer Churn Rate', value: `${rate.toFixed(1)}%`, isPrimary: true },
          { label: 'Monthly Customer Retention Rate', value: `${retention.toFixed(1)}%` },
          { label: 'Lost MRR (Monthly Run-rate loss)', value: `$${Math.round(mrrLost).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'bus-gross-margin',
    name: 'Gross Margin & Profit Calculator',
    slug: 'bus-gross-margin',
    category: 'business',
    description: 'Calculate corporate gross margins, total profits, and markup multipliers.',
    formula: 'Gross Margin % = (Revenue - COGS) / Revenue * 100',
    explanation: 'Audits basic profit boundaries, guiding retail and manufacture pricing rules.',
    example: 'Selling a device for $100 featuring $45 in hardware source materials yields a 55% gross margin.',
    inputs: [
      { id: 'rev', label: 'Unit Product Sales Revenue', type: 'number', defaultValue: 120, min: 0.1, step: 5, unit: '$' },
      { id: 'cogs', label: 'Variable Cost of Goods (COGS)', type: 'number', defaultValue: 54, min: 0, step: 5, unit: '$' }
    ],
    faq: [
      { question: 'What is Gross Margin vs Markup?', answer: 'Margin is the share of selling price that represents profit. Markup is the percentage added to raw cost price to calculate retail selling price.' }
    ],
    relatedSlugs: ['bus-breakeven', 'bus-saas-cac-ltv', 'bus-investment-roi'],
    seoTitle: 'Gross Profit Margin & Retail Markup Calculator',
    seoDescription: 'Analyze sales margins online and calculate markup percentages.',
    calculate: (inputs) => {
      const rev = Number(inputs.rev || 100);
      const cogs = Number(inputs.cogs || 50);
      
      const profit = rev - cogs;
      const margin = rev > 0 ? (profit / rev) * 100 : 0;
      const markup = cogs > 0 ? (profit / cogs) * 100 : 0;
      
      return {
        results: [
          { label: 'Gross Profit Margin Rate', value: `${margin.toFixed(1)}%`, isPrimary: true },
          { label: 'Incremental Gross Profit Cash', value: Number(profit.toFixed(2)), unit: '$' },
          { label: 'Retail Markup Applied', value: `${markup.toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'bus-investment-roi',
    name: 'Business ROI & Net returns Calculator',
    slug: 'bus-investment-roi',
    category: 'business',
    description: 'Calculate net investment gains and return-on-investment percentage thresholds.',
    formula: 'ROI = (Gains - Initial Investment cost) / Investment * 100',
    explanation: 'Provides solid, humble ratios to map active capital performance benchmarks.',
    example: 'Investing $10,000 in marketing channels that generate $14,000 in sales returns yields a 40% ROI.',
    inputs: [
      { id: 'inv', label: 'Starting Capital Invested', type: 'number', defaultValue: 10000, min: 10, step: 500, unit: '$' },
      { id: 'gain', label: 'Total Value Earned (Return)', type: 'number', defaultValue: 13500, min: 0, step: 500, unit: '$' }
    ],
    faq: [
      { question: 'What is a typical marketing channel ROI?', answer: 'For standard digital advertisements, returning $3 in sales for every $1 spent represents a healthy 200% gross ROI.' }
    ],
    relatedSlugs: ['pm-project-roi', 'bus-saas-cac-ltv', 'bus-breakeven'],
    seoTitle: 'Commercial Business Return on Investment Calculator',
    seoDescription: 'Obtain ROI percentages and net capital profits on financial campaigns.',
    calculate: (inputs) => {
      const inv = Number(inputs.inv || 1000);
      const gain = Number(inputs.gain || 1200);
      
      const profit = gain - inv;
      const roi = inv > 0 ? (profit / inv) * 100 : 0;
      
      return {
        results: [
          { label: 'Net Return on Investment', value: `${roi.toFixed(1)}%`, isPrimary: true },
          { label: 'Net Generated Business Profit', value: profit, unit: '$' },
          { label: 'Value multiplier scale', value: Number((gain / inv).toFixed(2)), unit: 'x return' }
        ]
      };
    }
  },
  {
    id: 'bus-inventory-turnover',
    name: 'Inventory Turnover & Pipeline Calculator',
    slug: 'bus-inventory-turnover',
    category: 'business',
    description: 'Calculate inventory turnover ratios and average pipeline warehouse days-held.',
    formula: 'Turns = COGS / Average Inventory; Days = 365 / Turns',
    explanation: 'Measures inventory utilization rates to help direct factory replenishment policies.',
    example: 'An annual COGS of $100,000 holding $20,000 average inventory turns over 5 times, taking 73 days.',
    inputs: [
      { id: 'cogs', label: 'Annual Cost of Goods (COGS)', type: 'number', defaultValue: 120000, min: 100, step: 5000, unit: '$' },
      { id: 'begInv', label: 'Beginning Year Inventory Value', type: 'number', defaultValue: 25000, min: 0, step: 1000, unit: '$' },
      { id: 'endInv', label: 'Ending Year Inventory Value', type: 'number', defaultValue: 15000, min: 0, step: 1000, unit: '$' }
    ],
    faq: [
      { question: 'Why does a high inventory turnover help businesses?', answer: 'A high ratio suggests strong sales velocity, keeping warehousing storage fees low and preventing stock obsolescence.' }
    ],
    relatedSlugs: ['bus-breakeven', 'bus-gross-margin', 'bus-cash-flow-forecast'],
    seoTitle: 'Warehouse Inventory Turnover & Asset Velocity Calculator',
    seoDescription: 'Verify active storage turnaround frequencies and days-held metrics online.',
    calculate: (inputs) => {
      const cogs = Number(inputs.cogs || 10000);
      const beg = Number(inputs.begInv || 1000);
      const end = Number(inputs.endingInventory || 1000);
      
      const avg = (beg + end) / 2;
      const turns = avg > 0 ? cogs / avg : 0;
      const days = turns > 0 ? 365 / turns : 0;
      
      return {
        results: [
          { label: 'Annual Inventory Turnover Rate', value: Number(turns.toFixed(2)), unit: 'turns / year', isPrimary: true },
          { label: 'Averaged Storage Days-Held', value: Math.round(days), unit: 'days in warehouse' },
          { label: 'Calculated Average Stock Value', value: Math.round(avg), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'bus-cash-flow-forecast',
    name: 'Business Runway & Cashburn Planner',
    slug: 'bus-cash-flow-forecast',
    category: 'business',
    description: 'Forecast monthly start-up runway horizons and structural net capital change metrics.',
    formula: 'Runway Months = Current Cash Balance / Net Monthly Cashburn',
    explanation: 'Traces cash inflows against active payroll and lease expenses to show operational runway.',
    example: 'Starting with $100,000 cash, spending $15,000 monthly but collecting $5,000 in customer sales yields 10 months of net runway.',
    inputs: [
      { id: 'starting', label: 'Current Bank Cash Reserves', type: 'number', defaultValue: 80000, min: 100, step: 5000, unit: '$' },
      { id: 'inflow', label: 'Monthly Inward Revenue Inflow', type: 'number', defaultValue: 12000, min: 0, step: 1000, unit: '$/mo' },
      { id: 'outflow', label: 'Monthly Business Cash Outflow', type: 'number', defaultValue: 22000, min: 0, step: 1000, unit: '$/mo' }
    ],
    faq: [
      { question: 'What is gross burn vs net burn?', answer: 'Gross burn is total monthly expenses. Net burn is actual monthly losses after subtracting customer receipts, which represents the real cash drain rate.' }
    ],
    relatedSlugs: ['bus-saas-cac-ltv', 'bus-breakeven', 'pm-resource-pricing'],
    seoTitle: 'Startup Operational Capital Runway & Net Cash-Burn Planner',
    seoDescription: 'Obtain target operational milestones showing months of runway remaining.',
    calculate: (inputs) => {
      const balance = Number(inputs.starting || 10000);
      const inflow = Number(inputs.inflow || 0);
      const outflow = Number(inputs.outflow || 0);
      
      const netBurn = outflow - inflow;
      
      if (netBurn <= 0) {
        return {
          results: [
            { label: 'Runway Horizon Timeline', value: 'Infinite (Cash flow positive)', isPrimary: true },
            { label: 'Net Monthly Earnings Margin', value: `$${Math.abs(netBurn).toLocaleString()}`, unit: '/ month' }
          ]
        };
      }
      
      const runway = balance / netBurn;
      
      return {
        results: [
          { label: 'Remaining Operational Runway', value: Number(runway.toFixed(1)), unit: 'months', isPrimary: true },
          { label: 'Startup Net Monthly Loss Burn', value: `$${netBurn.toLocaleString()}`, unit: '/ month' },
          { label: 'Yearly Run-rate Deficit', value: `$${(netBurn * 12).toLocaleString()}` }
        ]
      };
    }
  },

  // ====================================== HEALTH ======================================
  {
    id: 'health-target-heart-rate',
    name: 'Karvonen Target Heart Rate Calculator',
    slug: 'health-target-heart-rate',
    category: 'health',
    description: 'Calculate target heart rate training zones using resting profiles and age indexes.',
    formula: 'Target Rate = ((Max Heart Rate - Resting Heart Rate) * Intensity %) + Resting Heart Rate',
    explanation: 'Applies Karvonen principles to outline safe, individualized cardiovascular exercise bounds.',
    example: 'A 30-year-old with a 60 RESTING bpm training at 70% intensity targets 151 steady-state beats.',
    inputs: [
      { id: 'age', label: 'Workout Person Age', type: 'number', defaultValue: 30, min: 10, max: 100 },
      { id: 'resting', label: 'Measured Resting Heart Rate', type: 'number', defaultValue: 65, min: 30, max: 120, unit: 'bpm' },
      { id: 'intensity', label: 'Target Exercise Intensity', type: 'number', defaultValue: 70, min: 40, max: 95, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'Why factor in resting heart rate (RHR)?', answer: 'Sourcing resting metrics dynamically profiles your stroke volume and generic cardiorespiratory fitness, adapting targets to fit real body conditions.' }
    ],
    relatedSlugs: ['health-one-rep-max', 'health-goal-weight-timeline'],
    seoTitle: 'Karvonen Cardio Training Target Heart Rate Zones',
    seoDescription: 'Obtain aerobic and anaerobic target heart rate regions online.',
    calculate: (inputs) => {
      const age = Number(inputs.age || 30);
      const rhr = Number(inputs.resting || 60);
      const intensity = Number(inputs.intensity || 70) / 100;
      
      const mhr = 220 - age;
      const hrr = mhr - rhr;
      const target = (hrr * intensity) + rhr;
      
      return {
        results: [
          { label: 'Target Training Heart Rate', value: Math.round(target), unit: 'bpm (beats/min)', isPrimary: true },
          { label: 'Calculated Maximum Heart Rate', value: mhr, unit: 'bpm' },
          { label: 'Heart Rate Reserve (HRR)', value: hrr, unit: 'bpm' }
        ]
      };
    }
  },
  {
    id: 'health-one-rep-max',
    name: 'Strength One-Rep Max Calculator',
    slug: 'health-one-rep-max',
    category: 'health',
    description: 'Estimate your maximum muscular strength loading boundaries of major compound exercises.',
    formula: 'One-Rep Max = Weight / (1.0278 - 0.0278 * Reps)',
    explanation: 'Uses Epley standard strength scales, compiling lighter repetitions to estimate top single-effort lifts.',
    example: 'Benching 200 lb for 8 reps estimates a true theoretical single rep max potential at exactly 255 lb.',
    inputs: [
      { id: 'weight', label: 'Lifting Resistance Load', type: 'number', defaultValue: 150, min: 1, step: 5, unit: 'lbs' },
      { id: 'reps', label: 'Completed Repetitions (Reps)', type: 'number', defaultValue: 6, min: 1, max: 15 }
    ],
    faq: [
      { question: 'Is the Epley single effort lift estimate accurate?', answer: 'It is highly accurate for reps under 10. Once reps stretch past ten, localized muscular endurance overshadows pure explosive strength fibers.' }
    ],
    relatedSlugs: ['health-target-heart-rate', 'health-saturated-fat'],
    seoTitle: 'Explosive Lifting One-Rep Max Epley Standard Calculator',
    seoDescription: 'Benchmark maximum muscle strength bounds and find optimal working sets online.',
    calculate: (inputs) => {
      const weight = Number(inputs.weight || 100);
      const reps = Number(inputs.reps || 1);
      
      if (reps === 1) {
        return {
          results: [
            { label: 'Estimated One-Rep Max (1RM)', value: weight, unit: 'lbs', isPrimary: true },
            { label: 'Working Set Ratio (85% - 5RM)', value: Math.round(weight * 0.85), unit: 'lbs' }
          ]
        };
      }
      
      const epleymax = weight * (1 + reps / 30);
      const onerepmax = epleymax;
      
      return {
        results: [
          { label: 'Estimated One-Rep Max (1RM)', value: Math.round(onerepmax), unit: 'lbs', isPrimary: true },
          { label: '85% intensity (Hypertrophy 5RM)', value: Math.round(onerepmax * 0.85), unit: 'lbs' },
          { label: '70% intensity (Endurance 12RM)', value: Math.round(onerepmax * 0.70), unit: 'lbs' }
        ]
      };
    }
  },
  {
    id: 'health-pregnancy-due-date',
    name: 'Pregnancy Due Date Calculator',
    slug: 'health-pregnancy-due-date',
    category: 'health',
    description: 'Forecast pregnancy milestones and estimate expected birth dates using ovulation timings.',
    formula: 'Due Date = Last Period Calendar + 280 Days',
    explanation: 'Applies standard gynecological Naegele rules to map out key baby development milestones.',
    example: 'An individual starting her last period 45 days ago is currently in week 6, expecting birth in 235 days.',
    inputs: [
      { id: 'periodDaysAgo', label: 'Days Since Last Period Started', type: 'number', defaultValue: 45, min: 1, max: 280 }
    ],
    faq: [
      { question: 'What is Naegele\'s Rule?', answer: 'The diagnostic standard which adds 280 days (or 40 full weeks) to the starting date of your last menstrual cycle to estimate births.' }
    ],
    relatedSlugs: ['health-ovulation-cycle', 'health-goal-weight-timeline'],
    seoTitle: 'Pregnancy Due Date & Trimester Milestone Calculator',
    seoDescription: 'Determine pregnancy milestones and estimate your baby due dates online.',
    calculate: (inputs) => {
      const days = Number(inputs.periodDaysAgo || 40);
      
      const completedWeeks = Math.floor(days / 7);
      const excessDays = days % 7;
      
      const gestationTotalDays = 280;
      const daysRemaining = Math.max(0, gestationTotalDays - days);
      
      let trimester = 'First';
      if (completedWeeks >= 27) trimester = 'Third';
      else if (completedWeeks >= 13) trimester = 'Second';
      
      return {
        results: [
          { label: 'Current Pregnancy Progress', value: `Week ${completedWeeks}, Day ${excessDays}`, isPrimary: true },
          { label: 'Active Development Trimester', value: `${trimester} Trimester` },
          { label: 'Estimated Days to Birth', value: daysRemaining, unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'health-ovulation-cycle',
    name: 'Ovulation & Fertility Calculator',
    slug: 'health-ovulation-cycle',
    category: 'health',
    description: 'Find your monthly ovulation schedules and pinpoint peak fertility windows.',
    formula: 'Ovulation Day = Cycle Days - 14 Days from next expected start',
    explanation: 'Maps out luteal phases to help users identify their peak monthly conceiving window.',
    example: 'An individual with a standard 30-day cycle ovulates on day 16, maximizing fertility during days 11-17.',
    inputs: [
      { id: 'cycle', label: 'Avg Length of Cycle', type: 'number', defaultValue: 28, min: 21, max: 35, unit: 'days' },
      { id: 'daysAgo', label: 'Days Since Last Period Began', type: 'number', defaultValue: 10, min: 1, max: 35 }
    ],
    faq: [
      { question: 'What is the "fertile window"?', answer: 'The 6-day span including the day of ovulation and the preceding 5 days, during which conception is biologically possible.' }
    ],
    relatedSlugs: ['health-pregnancy-due-date', 'health-target-heart-rate'],
    seoTitle: 'Fertile Window & Ovulation Schedule Predictor',
    seoDescription: 'Obtain estimated ovulation and active conceiving opportunities online.',
    calculate: (inputs) => {
      const cycle = Number(inputs.cycle || 28);
      const daysAgo = Number(inputs.daysAgo || 10);
      
      const ovulationDayIndex = cycle - 14;
      const daysToOvulation = ovulationDayIndex - daysAgo;
      
      const windowStart = ovulationDayIndex - 5;
      const windowEnd = ovulationDayIndex;
      
      let status = 'Standard phase';
      if (daysAgo >= windowStart && daysAgo <= windowEnd) {
        status = 'Peak Fertility Window Open';
      } else if (daysAgo > ovulationDayIndex) {
        status = 'Luteal phase (Post-ovulation)';
      }
      
      return {
        results: [
          { label: 'Current Ovulation Relationship', value: daysToOvulation >= 0 ? `Expected in ${daysToOvulation} days` : `Occurred ${Math.abs(daysToOvulation)} days ago`, isPrimary: true },
          { label: 'Fertile Window Range', value: `Days ${windowStart} to ${windowEnd} of cycle` },
          { label: 'Calculated Cycle Phase Status', value: status }
        ]
      };
    }
  },
  {
    id: 'health-saturated-fat',
    name: 'Saturated Fat Calories Calculator',
    slug: 'health-saturated-fat',
    category: 'health',
    description: 'Track healthy nutrition boundaries by converting grams of saturated fat into total calorie shares.',
    formula: 'Share Rating % = (Fat Grams * 9 kcal) / Daily Calories * 100',
    explanation: 'Applies American Heart Association guidelines (AHA), which advise keeping saturated fat intake below 6% of daily calories.',
    example: 'Consuming 20g of saturated fat on a 2,000 calorie plan represents a high 9.0% energy profile, exceeding recommendations.',
    inputs: [
      { id: 'cals', label: 'Daily Energy Intake Target', type: 'number', defaultValue: 2000, min: 1000, step: 100, unit: 'kcal' },
      { id: 'satGrams', label: 'Saturated Fats Consumed', type: 'number', defaultValue: 15, min: 0, max: 100, unit: 'grams' }
    ],
    faq: [
      { question: 'Why does saturated fat deserve strict limits?', answer: 'Excessive saturated fat raises blood LDL cholesterol, increasing the risk of cardiorespiratory plaque buildup and other circulatory issues.' }
    ],
    relatedSlugs: ['health-macros-split', 'health-target-heart-rate'],
    seoTitle: 'AHA Saturated Fat Energy Percentage Calculator',
    seoDescription: 'Verify daily healthy saturated fat intake limits online based on AHA standards.',
    calculate: (inputs) => {
      const cals = Number(inputs.cals || 2000);
      const sat = Number(inputs.satGrams || 10);
      
      const satCals = sat * 9;
      const pct = cals > 0 ? (satCals / cals) * 100 : 0;
      
      const status = pct <= 6 ? 'Excellent (AHA Compliant)' : 'Caution (Exceeding AHA 6% recommendation)';
      
      return {
        results: [
          { label: 'Percentage of Saturated Energy', value: `${pct.toFixed(1)}%`, isPrimary: true },
          { label: 'Total Calories from Saturated Fat', value: Math.round(satCals), unit: 'kcal' },
          { label: 'Nutritional Sizing Classification', value: status }
        ]
      };
    }
  },
  {
    id: 'health-goal-weight-timeline',
    name: 'Goal Weight Loss Timeline Calculator',
    slug: 'health-goal-weight-timeline',
    category: 'health',
    description: 'Calculate realistic timelines needed to achieve healthy target weights using caloric deficits.',
    formula: 'Weeks = (Current Weight - Target Weight) * 3500 / Daily Calorie Deficit',
    explanation: 'Models energy balance guidelines, assuming 3,500 kilocalories of deficit burn yields exactly one pound of fat loss.',
    example: 'Losing 15 pounds with a steady 500 kcal daily deficit is projected to take 15 weeks.',
    inputs: [
      { id: 'current', label: 'Your Active Base Weight', type: 'number', defaultValue: 185, min: 50, step: 5, unit: 'lbs' },
      { id: 'target', label: 'Desired Health Target Weight', type: 'number', defaultValue: 170, min: 45, step: 5, unit: 'lbs' },
      { id: 'deficit', label: 'Target Daily Deficit Size', type: 'select', defaultValue: '500', options: [
        { label: 'Slow and steady (250 kcal/day)', value: '250' },
         { label: 'Recommended balance (500 kcal/day)', value: '500' },
         { label: 'Challenging target (1000 kcal/day)', value: '1000' }
      ]}
    ],
    faq: [
      { question: 'Why is rapid weight loss discouraged?', answer: 'Loss rates exceeding 2 pounds weekly can starve muscles of protein, trigger metabolic slowdowns, and increase the likelihood of weight rebound.' }
    ],
    relatedSlugs: ['health-target-heart-rate', 'health-macros-split'],
    seoTitle: 'Adipose Tissue Goal Weight loss Duration Calculator',
    seoDescription: 'Obtain realistic health milestones and calculate target dates for weight loss.',
    calculate: (inputs) => {
      const curr = Number(inputs.current || 150);
      const tar = Number(inputs.target || 140);
      const gap = curr - tar;
      const def = Number(inputs.deficit || 500);
      
      if (gap <= 0) {
        return {
          results: [
            { label: 'Projected Duration', value: 'Achieved / Already at or below target', isPrimary: true }
          ]
        };
      }
      
      const totalCaloriesGoalDeficit = gap * 3500;
      const days = totalCaloriesGoalDeficit / def;
      const weeks = days / 7;
      
      return {
        results: [
          { label: 'Required Duration Timeline', value: Number(weeks.toFixed(1)), unit: 'weeks', isPrimary: true },
          { label: 'Target Daily Burn Deficit', value: def, unit: 'kcal / day' },
          { label: 'Required Combined Calorie Deficit', value: Math.round(totalCaloriesGoalDeficit), unit: 'overall kcal' }
        ]
      };
    }
  },
  {
    id: 'health-macros-split',
    name: 'Macronutrient Split Calculator',
    slug: 'health-macros-split',
    category: 'health',
    description: 'Calculate daily targets for protein, carbohydrate, and fat intake based on calorie goals.',
    formula: 'Grams = Calorie allocation / calories per gram of macro type',
    explanation: 'Converts target calories into precise macro weights (protein and carbs yield 4 kcal/g, fats yield 9 kcal/g).',
    example: 'A 2,000 kcal high-protein plan (40% protein, 30% carb, 30% fat) requires 200g protein, 150g carb, and 67g fat.',
    inputs: [
      { id: 'calsTarget', label: 'Daily Calorie Intake Target', type: 'number', defaultValue: 1800, min: 800, max: 8000, step: 50, unit: 'kcal' },
      { id: 'split', label: 'Macronutrient Split Ratio', type: 'select', defaultValue: 'balanced', options: [
        { label: 'Balanced plan (30% Protein / 40% Carbs / 30% Fat)', value: 'balanced' },
        { label: 'Low Carbohydrate (40% Protein / 20% Carbs / 40% Fat)', value: 'lowcarb' },
        { label: 'High Protein / Lean (45% Protein / 35% Carbs / 20% Fat)', value: 'highpro' }
      ]}
    ],
    faq: [
      { question: 'Do carbohydrates inhibit fat loss?', answer: 'No, caloric deficits are the primary driver of fat loss. Selecting carb limits is a matter of personal satiety, energy levels, and training preferences.' }
    ],
    relatedSlugs: ['health-saturated-fat', 'health-goal-weight-timeline'],
    seoTitle: 'Daily Macronutrient Nutrition Grams Sizing Calculator',
    seoDescription: 'Accurately convert daily calorie targets into optimal macro weights.',
    calculate: (inputs) => {
      const cals = Number(inputs.calsTarget || 2000);
      const split = String(inputs.split || 'balanced');
      
      let pPct = 0.30;
      let cPct = 0.40;
      let fPct = 0.30;
      
      if (split === 'lowcarb') {
        pPct = 0.40; cPct = 0.20; fPct = 0.40;
      } else if (split === 'highpro') {
        pPct = 0.45; cPct = 0.35; fPct = 0.20;
      }
      
      const pGrams = (cals * pPct) / 4;
      const cGrams = (cals * cPct) / 4;
      const fGrams = (cals * fPct) / 9;
      
      return {
        results: [
          { label: 'Daily Target Protein', value: Math.round(pGrams), unit: 'grams', isPrimary: true },
          { label: 'Daily Target Carbohydrate', value: Math.round(cGrams), unit: 'grams' },
          { label: 'Daily Target Fat', value: Math.round(fGrams), unit: 'grams' }
        ]
      };
    }
  }
];
