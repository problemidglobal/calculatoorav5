import { Calculator } from '../types';

export const V15_FINANCE_CALCULATORS: Calculator[] = [
  // PERSONAL MONEY
  {
    id: 'v15-net-income',
    name: 'Net Income Calculator',
    slug: 'v15-net-income-calculator',
    category: 'finance',
    description: 'Calculate your true net income after deducting taxes, retirement contributions, and insurance premiums.',
    seoTitle: 'Net Income Calculator | True Take-Home Pay Estimator',
    seoDescription: 'Obtain your exact hourly or yearly net take-home salary. Enter tax brackets and deductions for custom pay stub simulations.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 75000 },
      { id: 'taxRate', label: 'Effective Tax Rate (%)', type: 'number', defaultValue: 24 },
      { id: 'preTaxDeductions', label: 'Monthly Pre-Tax Deductions ($)', type: 'number', defaultValue: 300, helpText: 'Health insurance, pre-tax 401k' },
      { id: 'postTaxDeductions', label: 'Monthly Post-Tax Deductions ($)', type: 'number', defaultValue: 100, helpText: 'Roth IRA, voluntary deductions' }
    ],
    formula: 'Annual Net Income = (Gross Annual - (Pre-Tax Deductions * 12)) * (1 - Tax Rate / 100) - (Post-Tax Deductions * 12)',
    explanation: 'Differentiating your gross earnings from your net take-home pay is vital for personal financial stability, budgeting, and living expense ratios.',
    example: 'For a gross annual salary of $75,000, with $300 monthly pre-tax deductions and a 24% tax rate, plus $100 post-tax monthly deductions, your Net Annual Income is $52,044.',
    faq: [
      { question: 'What is the easiest way to estimate effective tax rate?', answer: 'Check your last year tax filing return or refer to federal tax brackets to sum your marginal tax streams.' },
      { question: 'Are standard deductions calculated before or after taxes?', answer: 'Standard pre-tax deductions lower your taxable income base. Post-tax deductions are subtracted directly from your check after taxes.' }
    ],
    relatedSlugs: ['v15-after-tax-income-calculator', 'v15-monthly-cash-flow-calculator'],
    calculate: (inputs) => {
      const gross = Number(inputs.grossIncome || 0);
      const taxRate = Number(inputs.taxRate || 0) / 100;
      const preTaxMD = Number(inputs.preTaxDeductions || 0);
      const postTaxMD = Number(inputs.postTaxDeductions || 0);

      const annualPreTax = preTaxMD * 12;
      const taxableBase = Math.max(0, gross - annualPreTax);
      const taxPaid = taxableBase * taxRate;
      const annualPostTax = postTaxMD * 12;
      const netAnnual = Math.max(0, taxableBase - taxPaid - annualPostTax);

      return {
        results: [
          { label: 'Net Annual Income', value: `$${netAnnual.toLocaleString()}`, isPrimary: true },
          { label: 'Net Monthly Income', value: `$${Math.round(netAnnual / 12).toLocaleString()}`, isPrimary: false },
          { label: 'Total Annual Taxes Paid', value: `$${Math.round(taxPaid).toLocaleString()}` },
          { label: 'Annual Pre-Tax Deductions', value: `$${annualPreTax.toLocaleString()}` }
        ],
        chartData: [
          { name: 'Net Income', value: Math.round(netAnnual) },
          { name: 'Taxes', value: Math.round(taxPaid) },
          { name: 'Deductions', value: Math.round(annualPreTax + annualPostTax) }
        ]
      };
    }
  },
  {
    id: 'v15-after-tax-income',
    name: 'After-Tax Income Calculator',
    slug: 'v15-after-tax-income-calculator',
    category: 'finance',
    description: 'Calculate your exact net disposable earnings after accounting for federal, state, and local taxes.',
    seoTitle: 'After-Tax Income Calculator | Premium Wealth Planner',
    seoDescription: 'Accurately convert gross income to net after-tax salary. Get instant breakdowns of tax liabilities and monthly disposable portions.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 90000 },
      { id: 'fedTax', label: 'Federal Income Tax (%)', type: 'number', defaultValue: 15 },
      { id: 'stateTax', label: 'State & Local Tax (%)', type: 'number', defaultValue: 5 },
      { id: 'ficaTax', label: 'FICA / Payroll Tax (%)', type: 'number', defaultValue: 7.65 }
    ],
    formula: 'Total Tax Rate = Federal + State + FICA\nAfter-Tax Income = Gross Income * (1 - Total Tax Rate / 100)',
    explanation: 'Federal income taxes, state taxes, and FICA (Medicare and Social Security) reduce your gross salary. Knowing their combined impact provides your realistic after-tax baseline.',
    example: 'For $90,000 gross annual income with a combined tax rate of 27.65%, your net after-tax income is $65,115 (or $5,426.25 monthly).',
    faq: [
      { question: 'What is FICA tax?', answer: 'FICA represents the Federal Insurance Contributions Act, which funds Social Security (6.2%) and Medicare (1.45%) systems.' },
      { question: 'How can I lower my FICA taxes?', answer: 'FICA taxes are generally hard to lower unless you utilize pre-tax employer plans like HSA contributions or pre-tax health premium shares.' }
    ],
    relatedSlugs: ['v15-net-income-calculator', 'v15-monthly-cash-flow-calculator'],
    calculate: (inputs) => {
      const gross = Number(inputs.grossIncome || 0);
      const fed = Number(inputs.fedTax || 0);
      const state = Number(inputs.stateTax || 0);
      const fica = Number(inputs.ficaTax || 0);

      const totalTaxPercent = fed + state + fica;
      const totalTaxPaid = gross * (totalTaxPercent / 100);
      const netIncome = Math.max(0, gross - totalTaxPaid);

      return {
        results: [
          { label: 'After-Tax Annual Income', value: `$${netIncome.toLocaleString()}`, isPrimary: true },
          { label: 'After-Tax Monthly Income', value: `$${Math.round(netIncome / 12).toLocaleString()}` },
          { label: 'Total Annual Taxes Deducted', value: `$${Math.round(totalTaxPaid).toLocaleString()}` },
          { label: 'Effective Overall Tax Rate', value: `${totalTaxPercent.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'After-Tax Income', value: Math.round(netIncome) },
          { name: 'Federal Tax', value: Math.round(gross * fed / 100) },
          { name: 'State Tax', value: Math.round(gross * state / 100) },
          { name: 'FICA Tax', value: Math.round(gross * fica / 100) }
        ]
      };
    }
  },
  {
    id: 'v15-monthly-cash-flow',
    name: 'Monthly Cash Flow Calculator',
    slug: 'v15-monthly-cash-flow-calculator',
    category: 'finance',
    description: 'Calculate your net monthly cash flow surplus or deficit by tracking global income channels against living expenses.',
    seoTitle: 'Monthly Cash Flow Surplus & Deficit Calculator',
    seoDescription: 'Find your monthly net cash flow. Balance personal income streams against essential and discretionary costs to optimize savings.',
    inputs: [
      { id: 'monthlySalary', label: 'Primary Monthly Net Salary ($)', type: 'number', defaultValue: 4500 },
      { id: 'sideIncome', label: 'Other Monthly Income ($)', type: 'number', defaultValue: 500, helpText: 'Investments, side-hustles' },
      { id: 'essentials', label: 'Essential Costs ($)', type: 'number', defaultValue: 2200, helpText: 'Rent, groceries, utilities, debt' },
      { id: 'discretionary', label: 'Discretionary Expenses ($)', type: 'number', defaultValue: 1200, helpText: 'Dining out, shopping, leisure' }
    ],
    formula: 'Net Cash Flow = Total Inflows - (Essentials + Discretionary)',
    explanation: 'Maintaining positive monthly cash flow ensures you are not living beyond your means, enabling you to construct an emergency buffer or fund investment portfolios.',
    example: 'With $5,000 in total income and $3,400 in total expenses, your monthly net cash flow is a positive $1,600 surplus.',
    faq: [
      { question: 'What is positive vs negative cash flow?', answer: 'Positive cash flow means you spend less than you earn, creating savings. Negative cash flow indicates your expenses exceed your incoming cash, leading to rising debt.' },
      { question: 'How can I fix a negative cash flow situation?', answer: 'Work on reducing discretionary bills and review essential service subscriptions to cut overhead immediately.' }
    ],
    relatedSlugs: ['v15-expense-percentage-calculator', 'v15-savings-rate-calculator'],
    calculate: (inputs) => {
      const salary = Number(inputs.monthlySalary || 0);
      const side = Number(inputs.sideIncome || 0);
      const essential = Number(inputs.essentials || 0);
      const discretionary = Number(inputs.discretionary || 0);

      const totalIncome = salary + side;
      const totalExpense = essential + discretionary;
      const cashFlow = totalIncome - totalExpense;

      return {
        results: [
          { label: 'Net Monthly Cash Flow', value: `$${cashFlow.toLocaleString()}`, isPrimary: true },
          { label: 'Total Monthly Income', value: `$${totalIncome.toLocaleString()}` },
          { label: 'Total Monthly Expenses', value: `$${totalExpense.toLocaleString()}` },
          { label: 'Cash Flow Health Status', value: cashFlow > 500 ? 'Healthy Surplus' : cashFlow >= 0 ? 'Balanced' : 'Budget Deficit' }
        ],
        chartData: [
          { name: 'Net Income Inflow', value: totalIncome },
          { name: 'Essential Cost', value: essential },
          { name: 'Discretionary Cost', value: discretionary },
          { name: 'Remaining Flow', value: Math.max(0, cashFlow) }
        ]
      };
    }
  },
  {
    id: 'v15-expense-percentage',
    name: 'Expense Percentage Calculator',
    slug: 'v15-expense-percentage-calculator',
    category: 'finance',
    description: 'Calculate what percentage of your income is allocated to essential and discretionary expenses.',
    seoTitle: 'Expense Percentage & Income Ratio Solver',
    seoDescription: 'Examine custom 50/30/20 budget configurations. Determine what percentage of net pay funds your living costs, housing, and entertainment.',
    inputs: [
      { id: 'monthlyNetIncome', label: 'Net Monthly Income ($)', type: 'number', defaultValue: 5000 },
      { id: 'housing', label: 'Rent or Mortgage Cost ($)', type: 'number', defaultValue: 1600 },
      { id: 'livingExpenses', label: 'Other Essential Costs ($)', type: 'number', defaultValue: 1200, helpText: 'Groceries, utilities, health' },
      { id: 'discretionary', label: 'Discretionary / Leisure ($)', type: 'number', defaultValue: 900 }
    ],
    formula: 'Allocation Percent = (Specific expense category / Net Income) * 100',
    explanation: 'Visualizing expense percentages lets you test your adherence to rules of thumb like the 50/30/20 guideline, aiming for optimal savings capacity.',
    example: 'With $5,000 net income and a $1,600 rent, your housing consumes 32% of your budget. Your overall essential and discretionary expenses make up 56% and 18%, leaving a 26% savings potential.',
    faq: [
      { question: 'What is the 50/30/20 budget framework?', answer: 'An intuitive rule dividing net income into 50% for Needs (essentials), 30% for Wants (lifestyle), and 20% for Savings or debt reduction.' },
      { question: 'Which index recommends keeping housing under 30%?', answer: 'Most traditional financial planners recommend allocating no more than 30% of your gross or net income to rent or mortgage payments.' }
    ],
    relatedSlugs: ['v15-savings-rate-calculator', 'v15-money-allocation-calculator'],
    calculate: (inputs) => {
      const net = Number(inputs.monthlyNetIncome || 1);
      const hsg = Number(inputs.housing || 0);
      const living = Number(inputs.livingExpenses || 0);
      const desc = Number(inputs.discretionary || 0);

      const totalHsgPct = (hsg / net) * 100;
      const totalLivingPct = (living / net) * 100;
      const totalDescPct = (desc / net) * 100;
      const savedAmount = Math.max(0, net - (hsg + living + desc));
      const totalSavedPct = (savedAmount / net) * 100;

      return {
        results: [
          { label: 'Housing Cost Ratio', value: `${totalHsgPct.toFixed(1)}%`, isPrimary: true },
          { label: 'Lifestyles & Needs Ratio', value: `${totalLivingPct.toFixed(1)}%` },
          { label: 'Discretionary Spend Ratio', value: `${totalDescPct.toFixed(1)}%` },
          { label: 'Remaining Savings Rate', value: `${totalSavedPct.toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Housing', value: Math.round(totalHsgPct) },
          { name: 'Other Essentials', value: Math.round(totalLivingPct) },
          { name: 'Discretionary', value: Math.round(totalDescPct) },
          { name: 'Savings Margin', value: Math.max(0, Math.round(totalSavedPct)) }
        ]
      };
    }
  },
  {
    id: 'v15-savings-rate',
    name: 'Savings Rate Calculator',
    slug: 'v15-savings-rate-calculator',
    category: 'finance',
    description: 'Calculate your exact personal savings rate percentage based on real net income and positive surpluses.',
    seoTitle: 'Personal Savings Rate Percentage Calculator',
    seoDescription: 'Obtain your actual savings rate. Compare personal cash stockpiles against monthly earnings to accelerate retirement planning.',
    inputs: [
      { id: 'monthlyNetIncome', label: 'Net Monthly Income ($)', type: 'number', defaultValue: 6000 },
      { id: 'monthlySaved', label: 'Amount Saved per Month ($)', type: 'number', defaultValue: 1200 },
      { id: 'employerMatch', label: 'Employer 401k/Match Contribution ($)', type: 'number', defaultValue: 200 }
    ],
    formula: 'Savings Rate = ((Monthly Saved + Employer Match) / (Net Income + Employer Match)) * 100',
    explanation: 'Your savings rate is the single most important factor determining your path to financial freedom. High savings rates compound fast, shaving decades off your working life.',
    example: 'Saving $1,200 out of a $6,000 net income with a $200 employer match results in an effective net savings rate of 22.58%.',
    faq: [
      { question: 'What is a good target savings rate?', answer: 'Aim for a baseline of 10% to 15%. High savers seeking early retirement (FIRE movement) frequently target 30% to 50% or more.' },
      { question: 'Should I include retirement matches in my rate?', answer: 'Yes! Employer 401k matches represent real financial compensation that directly boosts your asset development.' }
    ],
    relatedSlugs: ['v15-money-allocation-calculator', 'v15-financial-health-score-calculator'],
    calculate: (inputs) => {
      const net = Number(inputs.monthlyNetIncome || 1);
      const saved = Number(inputs.monthlySaved || 0);
      const match = Number(inputs.employerMatch || 0);

      const totalNumerator = saved + match;
      const totalDenominator = net + match;
      const rate = (totalNumerator / totalDenominator) * 100;

      return {
        results: [
          { label: 'Calculated Savings Rate', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Saved Monthly', value: `$${totalNumerator.toLocaleString()}` },
          { label: 'Projected Annual Savings', value: `$${(totalNumerator * 12).toLocaleString()}` },
          { label: 'Milestone Evaluation', value: rate >= 20 ? 'Excellent Saver Tier' : rate >= 10 ? 'Healthy Tier' : 'Needs Optimization' }
        ],
        chartData: [
          { name: 'Saved amount', value: totalNumerator },
          { name: 'Expenses', value: Math.max(0, net - saved) }
        ]
      };
    }
  },
  {
    id: 'v15-money-allocation',
    name: 'Money Allocation Calculator',
    slug: 'v15-money-allocation-calculator',
    category: 'finance',
    description: 'Distribute your monthly net paycheck based on popular budgeting frameworks or custom weight targets.',
    seoTitle: 'Paycheck Money Allocation Planner | 50/30/20 Budgeting',
    seoDescription: 'Divide your salary into needs, wants, and investments automatically. Compare allocation modes for financial clarity.',
    inputs: [
      { id: 'netPaycheck', label: 'Paycheck Net Amount ($)', type: 'number', defaultValue: 4000 },
      { id: 'framework', label: 'Allocation Rule', type: 'select', defaultValue: '503020', options: [
        { label: '50/30/20 Rule (Needs / Wants / Savings)', value: '503020' },
        { label: '70/15/15 Rule (Survival / Goals / Fun)', value: '701515' },
        { label: '80/20 Simple Rule (Spending / Saving)', value: '8020' },
        { label: 'Wealth-Builder (30/20/50 aggressive)', value: '302050' }
      ]}
    ],
    formula: 'Calculation segments pay by predetermined percentages mapping directly to the selected budget guideline.',
    explanation: 'Automating paycheck division prevents lifestyle creep and ensures your wealth building remains a consistent priority.',
    example: 'A $4,000 net paycheck split via the 50/30/20 strategy allocates $2,000 for Needs, $1,200 for Wants, and $800 to savings or debt paydowns.',
    faq: [
      { question: 'What does the wealth builder mode stand for?', answer: 'It is an aggressive strategy for high earners, devoting 30% to essential living, 20% to lifestyle, and 50% straight to investment accounts.' },
      { question: 'Should debt payments be put in savings or necessities?', answer: 'Minimum payments on loans are necessities, but extra principal paydowns should be sourced from the 20% savings slot.' }
    ],
    relatedSlugs: ['v15-expense-percentage-calculator', 'v15-savings-rate-calculator'],
    calculate: (inputs) => {
      const pay = Number(inputs.netPaycheck || 0);
      const rule = String(inputs.framework || '503020');

      let labelA = 'Needs (50%)', valA = 0.5 * pay;
      let labelB = 'Wants (30%)', valB = 0.3 * pay;
      let labelC = 'Savings (20%)', valC = 0.2 * pay;

      if (rule === '701515') {
        labelA = 'Living Essentials (70%)'; valA = 0.7 * pay;
        labelB = 'Lifestyle Fun (15%)'; valB = 0.15 * pay;
        labelC = 'Savings Goals (15%)'; valC = 0.15 * pay;
      } else if (rule === '8020') {
        labelA = 'General Spending (80%)'; valA = 0.8 * pay;
        labelB = 'Unallocated Buffer (0%)'; valB = 0;
        labelC = 'Direct Savings (20%)'; valC = 0.2 * pay;
      } else if (rule === '302050') {
        labelA = 'Lean Essentials (30%)'; valA = 0.3 * pay;
        labelB = 'Comfort Wants (20%)'; valB = 0.2 * pay;
        labelC = 'Aggressive Wealth (50%)'; valC = 0.5 * pay;
      }

      return {
        results: [
          { label: labelA, value: `$${Math.round(valA).toLocaleString()}`, isPrimary: true },
          { label: labelB, value: `$${Math.round(valB).toLocaleString()}` },
          { label: labelC, value: `$${Math.round(valC).toLocaleString()}` },
          { label: 'Total Allocated Paycheck', value: `$${Math.round(valA + valB + valC).toLocaleString()}` }
        ],
        chartData: [
          { name: labelA, value: Math.round(valA) },
          { name: labelB, value: Math.round(valB) },
          { name: labelC, value: Math.round(valC) }
        ]
      };
    }
  },
  {
    id: 'v15-financial-health-score',
    name: 'Financial Health Score Calculator',
    slug: 'v15-financial-health-score-calculator',
    category: 'finance',
    description: 'Calculate your comprehensive financial health score out of 100 based on key macroeconomic benchmarks.',
    seoTitle: 'Financial Health Score & Stability Index Calculator',
    seoDescription: 'Obtain an objective diagnostic review of your household finances. Grade your savings, debt ratio, and safety cushions.',
    inputs: [
      { id: 'monthlyNetIncome', label: 'Net Monthly Income ($)', type: 'number', defaultValue: 5000 },
      { id: 'emergencyFunds', label: 'Total Liquid Savings Pool ($)', type: 'number', defaultValue: 15000, helpText: 'Cash in bank or near-cash savings' },
      { id: 'monthlySavings', label: 'Monthly Savings Allocation ($)', type: 'number', defaultValue: 1000 },
      { id: 'monthlyDebt', label: 'Total Minimum Monthly Debt ($)', type: 'number', defaultValue: 500, helpText: 'Minimum credit card, auto, student, or real-estate debts' }
    ],
    formula: 'Score components: Emergency fund coverage (35 points) + Savings rate (35 points) + Debt-to-income ratio (30 points).',
    explanation: 'A balanced score indicates solid buffers against recessions or medical issues while building sustainable retirement assets.',
    example: 'With $5,000 net income, $15,000 in liquid cash, $1,000 monthly savings, and $500 monthly debt, your Financial Health Score is a strong 88/100.',
    faq: [
      { question: 'What does a score under 50 suggest?', answer: 'A score under 50 warns of structural fragility, typically due to lack of an emergency reserve or excessive debt obligations.' },
      { question: 'How is the emergency fund tier graded?', answer: 'Optimal emergency coverage represents 3 to 6 months of absolute living expenses. Less than 1 month yields minimum points.' }
    ],
    relatedSlugs: ['v15-savings-rate-calculator', 'v15-monthly-cash-flow-calculator'],
    calculate: (inputs) => {
      const net = Number(inputs.monthlyNetIncome || 1);
      const reserves = Number(inputs.emergencyFunds || 0);
      const saved = Number(inputs.monthlySavings || 0);
      const debt = Number(inputs.monthlyDebt || 0);

      // 1. Emergency reserve score (Max 35 points)
      const monthlySpend = Math.max(1, net - saved);
      const monthsCovered = reserves / monthlySpend;
      let eScore = 0;
      if (monthsCovered >= 6) eScore = 35;
      else if (monthsCovered >= 3) eScore = 25 + (monthsCovered - 3) * 3.33;
      else eScore = (monthsCovered / 3) * 25;

      // 2. Savings rate score (Max 35 points)
      const saveRate = (saved / net) * 100;
      let sScore = 0;
      if (saveRate >= 20) sScore = 35;
      else if (saveRate >= 10) sScore = 20 + (saveRate - 10) * 1.5;
      else sScore = (saveRate / 10) * 20;

      // 3. Debt to income score (Max 30 points)
      const dtiRatio = (debt / net) * 100;
      let dScore = 0;
      if (dtiRatio <= 10) dScore = 30;
      else if (dtiRatio <= 36) dScore = 30 - (dtiRatio - 10) * 1;
      else if (dtiRatio <= 50) dScore = 4;
      else dScore = 0;

      const score = Math.min(100, Math.max(0, Math.round(eScore + sScore + dScore)));

      let status = 'Vulnerable';
      if (score >= 80) status = 'Excellent Stability';
      else if (score >= 60) status = 'Stable Foundation';
      else if (score >= 40) status = 'Fair';

      return {
        results: [
          { label: 'Overall Financial Health Score', value: `${score} / 100`, isPrimary: true },
          { label: 'Emergency Fund Coverage', value: `${monthsCovered.toFixed(1)} Months`, isPrimary: false },
          { label: 'Debt-To-Income Ratio (DTI)', value: `${dtiRatio.toFixed(1)}%` },
          { label: 'Financial Health Grade', value: status }
        ],
        chartData: [
          { name: 'Your Score', value: score },
          { name: 'Deficit points', value: 100 - score }
        ]
      };
    }
  },

  // BANKING
  {
    id: 'v15-bank-interest',
    name: 'Bank Interest Calculator',
    slug: 'v15-bank-interest-calculator',
    category: 'finance',
    description: 'Calculate compound interest on cash accounts, tracking real dollar growth across standard savings options.',
    seoTitle: 'Bank Interest & Compounding Wealth Calculator',
    seoDescription: 'Obtain exact monthly bank interest payments. Compare standard checking accounts against High Yield Savings Accounts (HYSA).',
    inputs: [
      { id: 'principal', label: 'Starting Balance ($)', type: 'number', defaultValue: 10000 },
      { id: 'apy', label: 'Annual Percentage Yield (APY %)', type: 'number', defaultValue: 4.25, step: 0.1 },
      { id: 'years', label: 'Duration (Years)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Future Value = Principal * (1 + APY / 100) ^ Years',
    explanation: 'High Yield Savings Accounts (HYSAs) generate standard monthly compound yields that significantly outperform low-yield local checking reserves.',
    example: 'Starting with $10,000 at 4.25% APY over 5 years yields an accrued interest of $2,313.44, ending with a clean $12,313.44 balance.',
    faq: [
      { question: 'Why does APY differ from regular interest rate?', answer: 'APY (Annual Percentage Yield) includes the impact of compound frequency in its calculation, whereas APR (interest rate) is simple non-compounded interest.' },
      { question: 'Is online savings bank interest taxed?', answer: 'Yes, earned interest is treated as ordinary taxable income and reported yearly on standard Form 1099-INT.' }
    ],
    relatedSlugs: ['v15-deposit-calculator', 'v15-fixed-deposit-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 0);
      const a = Number(inputs.apy || 0) / 100;
      const y = Number(inputs.years || 1);

      const totalValue = p * Math.pow(1 + a, y);
      const interestEarned = totalValue - p;

      return {
        results: [
          { label: 'Ending Account Balance', value: `$${totalValue.toFixed(2)}`, isPrimary: true },
          { label: 'Total Interest Earned', value: `$${interestEarned.toFixed(2)}` },
          { label: 'Average Weekly Growth', value: `$${(interestEarned / (y * 52)).toFixed(2)}` },
          { label: 'Average Monthly Yield', value: `$${(interestEarned / (y * 12)).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Initial Deposit', value: Math.round(p) },
          { name: 'Interest Yield', value: Math.round(interestEarned) }
        ]
      };
    }
  },
  {
    id: 'v15-deposit',
    name: 'Savings Deposit Calculator',
    slug: 'v15-deposit-calculator',
    category: 'finance',
    description: 'Calculate your ending bank balance and compound interest on accounts with periodic custom deposits.',
    seoTitle: 'Savings Deposit & Regular Savings Calculator',
    seoDescription: 'Obtain future values of savings plans. Factor in monthly recurring deposit additions combined with high APY compounding.',
    inputs: [
      { id: 'initialBalance', label: 'Initial Startup Deposit ($)', type: 'number', defaultValue: 5000 },
      { id: 'monthlyDeposit', label: 'Additional Monthly Deposit ($)', type: 'number', defaultValue: 250 },
      { id: 'apy', label: 'Annual APY (%)', type: 'number', defaultValue: 4.5, step: 0.1 },
      { id: 'years', label: 'Savings Term (Years)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Future Value computed by compounding both the initial lump-sum and additional annuity payments monthly.',
    explanation: 'Combining initial principal with recurring savings plans builds a powerful compound snowball effect, accelerating your target reserves.',
    example: 'Starting with $5,000 and contributing $250 monthly at a 4.5% APY over 5 years results in an ending balance of $22,965.',
    faq: [
      { question: 'Why does monthly deposit timing matter?', answer: 'Depositing early in the month maximizes compound intervals, maximizing interest yields on the accrued balance.' },
      { question: 'What represents FDV standard terms?', answer: 'Future Deposit Value models target liquid portfolios built for home downs or weddings.' }
    ],
    relatedSlugs: ['v15-bank-interest-calculator', 'v15-recurring-deposit-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.initialBalance || 0);
      const mD = Number(inputs.monthlyDeposit || 0);
      const apy = Number(inputs.apy || 0) / 100;
      const yrs = Number(inputs.years || 1);

      const n = 12; // compound monthly
      const totalMonths = yrs * 12;
      const ratePerMonth = apy / 12;

      let balance = p;
      let totalInvested = p;

      for (let i = 0; i < totalMonths; i++) {
        balance = balance * (1 + ratePerMonth) + mD;
        totalInvested += mD;
      }

      const totalInterest = Math.max(0, balance - totalInvested);

      return {
        results: [
          { label: 'Ending Total Balance', value: `$${balance.toFixed(2)}`, isPrimary: true },
          { label: 'Total Money Contributed', value: `$${totalInvested.toLocaleString()}` },
          { label: 'Compounded Interest Yield', value: `$${totalInterest.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Your Contributions', value: Math.round(totalInvested) },
          { name: 'Compound Interest', value: Math.round(totalInterest) }
        ]
      };
    }
  },
  {
    id: 'v15-fixed-deposit',
    name: 'Fixed Deposit Calculator',
    slug: 'v15-fixed-deposit-calculator',
    category: 'finance',
    description: 'Calculate maturity payouts and yields on banking CD (Certificate of Deposit) or Fixed Deposit (FD) accounts.',
    seoTitle: 'Fixed Deposit (FD) Certificate maturity Calculator',
    seoDescription: 'Input initial FD amounts, interest schedules, and compound terms to find exit values and overall tax deductions.',
    inputs: [
      { id: 'principal', label: 'FD Principal Amount ($)', type: 'number', defaultValue: 20000 },
      { id: 'interestRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5.1 },
      { id: 'tenureYears', label: 'Tenure (Years)', type: 'number', defaultValue: 3 },
      { id: 'compounding', label: 'Compounding frequency', type: 'select', defaultValue: 'quarterly', options: [
        { label: 'Monthly Compounding', value: '12' },
        { label: 'Quarterly Compounding', value: '4' },
        { label: 'Half-Yearly Compounding', value: '2' },
        { label: 'Annual Compounding', value: '1' }
      ]}
    ],
    formula: 'Maturity Value = Principal * (1 + Rate / n) ^ (n * Years)',
    explanation: 'Fixed digital deposits lock cash for predefined terms to yield higher contractual rates than standard variable saving tiers.',
    example: 'An FD of $20,000 at 5.1% compounded quarterly for 3 years yields exactly $3,275.52 interest at a maturity value of $23,275.52.',
    faq: [
      { question: 'Can I withdraw money early from fixed certificates?', answer: 'Early exits typically trigger penalty fees, potentially reducing your overall returns to below standard savings rates.' },
      { question: 'Why is quarterly compounding the default for some banks?', answer: 'Many international and national financial institutions settle fixed deposit rates quarterly as per corporate governance schedules.' }
    ],
    relatedSlugs: ['v15-recurring-deposit-calculator', 'v15-deposit-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 0);
      const r = Number(inputs.interestRate || 0) / 100;
      const yrs = Number(inputs.tenureYears || 1);
      const n = Number(inputs.compounding || 4);

      const maturityVal = p * Math.pow(1 + (r / n), n * yrs);
      const totalEarned = maturityVal - p;

      return {
        results: [
          { label: 'Maturity Value Standard', value: `$${maturityVal.toFixed(2)}`, isPrimary: true },
          { label: 'Contract Interest Earned', value: `$${totalEarned.toFixed(2)}` },
          { label: 'Annualized Percent Return', value: `${((Math.pow(1 + r/n, n) - 1) * 100).toFixed(2)}% (Effective Yield)` }
        ],
        chartData: [
          { name: 'Initial FD Principal', value: Math.round(p) },
          { name: 'Fixed Interest Yield', value: Math.round(totalEarned) }
        ]
      };
    }
  },
  {
    id: 'v15-recurring-deposit',
    name: 'Recurring Deposit Calculator',
    slug: 'v15-recurring-deposit-calculator',
    category: 'finance',
    description: 'Calculate maturity payouts and compound interest on RD (Recurring Deposit) accounts with consistent monthly funding.',
    seoTitle: 'Recurring Deposit (RD) Compound Interest Calculator',
    seoDescription: 'Maximize monthly bank investment routines. Predict RD account growth and structural exit payouts.',
    inputs: [
      { id: 'monthlyFund', label: 'Monthly Deposit Amount ($)', type: 'number', defaultValue: 500 },
      { id: 'annualRate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5.5 },
      { id: 'tenureMonths', label: 'Term Duration (Months)', type: 'number', defaultValue: 24 }
    ],
    formula: 'Maturity Value is calculated as a series of compounded monthly deposits over the chosen tenure.',
    explanation: 'Recurring deposits allow you to capture fixed-deposit rates while deploying capital out of standard monthly wages rather than a single upfront lump sum.',
    example: 'A 24-month RD of $500 monthly at 5.5% interest delivers $12,709.84 total payout ($12,000 deposits + $709.84 interest).',
    faq: [
      { question: 'How is RD interest taxed?', answer: 'RD interest is fully taxable under standard interest tax rules, often deducted at source (TDS) once baseline thresholds are breached.' },
      { question: 'What occurs if I miss an monthly RD installment?', answer: 'Banks may apply standard penalty fees or revert the maturity interest rates to a lower tier.' }
    ],
    relatedSlugs: ['v15-fixed-deposit-calculator', 'v15-deposit-calculator'],
    calculate: (inputs) => {
      const mon = Number(inputs.monthlyFund || 0);
      const r = Number(inputs.annualRate || 0) / 100;
      const t = Number(inputs.tenureMonths || 12);

      let maturity = 0;
      let invested = 0;

      // Calculations are typical of standard RD: compound interest monthly
      const monthlyRate = r / 12;
      for (let i = 1; i <= t; i++) {
        invested += mon;
        maturity += mon * Math.pow(1 + monthlyRate, t - i + 1);
      }

      const interest = Math.max(0, maturity - invested);

      return {
        results: [
          { label: 'Maturity Value (RD)', value: `$${maturity.toFixed(2)}`, isPrimary: true },
          { label: 'Total Invested Capital', value: `$${invested.toLocaleString()}` },
          { label: 'Total Interest Earned', value: `$${interest.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Total Invested', value: invested },
          { name: 'Interest Yield', value: Math.round(interest) }
        ]
      };
    }
  },
  {
    id: 'v15-account-growth',
    name: 'Account Growth Calculator',
    slug: 'v15-account-growth-calculator',
    category: 'finance',
    description: 'Calculate long-term treasury or checking account wealth projection over custom year horizons.',
    seoTitle: 'Checking & Savings Account Growth Calculator',
    seoDescription: 'Simulate long-term wealth assets. Factor in compounding frequency and regular paycheck sweeps to see accurate account growth.',
    inputs: [
      { id: 'startBalance', label: 'Initial Checking/Savings Balance ($)', type: 'number', defaultValue: 10000 },
      { id: 'monthlyContributions', label: 'Paycheck Monthly Sweep ($)', type: 'number', defaultValue: 400 },
      { id: 'estimatedApy', label: 'Estimated Account APY (%)', type: 'number', defaultValue: 4.0 },
      { id: 'horizonYears', label: 'Projection Horizon (Years)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Balance_t = Balance_t-1 * (1 + Rate) + Sweep',
    explanation: 'Consistently sweeping excess paycheck cash into high-yield accounts generates an accelerating compounding effect over ten-year horizons.',
    example: 'Starting with $10,000 with a $400 monthly sweep at 4% APY will compound to $73,506 after 10 years.',
    faq: [
      { question: 'What is a paycheck sweep?', answer: 'Automatically moving excess checking account funds to a savings account to prevent uninvested cash drag.' },
      { question: 'Is compounding frequency material over simple years?', answer: 'Daily or monthly compounding adds extra pennies compared to annual compounding, but behavior remains the main driver of wealth growth.' }
    ],
    relatedSlugs: ['v15-deposit-calculator', 'v15-bank-interest-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.startBalance || 0);
      const s = Number(inputs.monthlyContributions || 0);
      const apy = Number(inputs.estimatedApy || 0) / 100;
      const yrs = Number(inputs.horizonYears || 1);

      const mRate = apy / 12;
      const totalMonths = yrs * 12;
      let futureVal = p;
      let invested = p;

      for (let i = 0; i < totalMonths; i++) {
        futureVal = futureVal * (1 + mRate) + s;
        invested += s;
      }
      const interest = Math.max(0, futureVal - invested);

      return {
        results: [
          { label: 'Ending Account Balance', value: `$${futureVal.toFixed(2)}`, isPrimary: true },
          { label: 'Your Lifetime Contributions', value: `$${invested.toLocaleString()}` },
          { label: 'Total Interest Earned', value: `$${interest.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Contributions', value: Math.round(invested) },
          { name: 'Interest Component', value: Math.round(interest) }
        ]
      };
    }
  },

  // INVESTMENT
  {
    id: 'v15-investment-fee',
    name: 'Investment Fee Calculator',
    slug: 'v15-investment-fee-calculator',
    category: 'finance',
    description: 'Calculate the lifetime cost of mutual fund or index ETF expense ratios on your long-term investment capital.',
    seoTitle: 'ETF & Investment Mutual Fund Fee Cost Calculator',
    seoDescription: 'See how index fund and active manager expense ratios chip away at your retirement wealth over decades.',
    inputs: [
      { id: 'initialBalance', label: 'Initial Portfolio Value ($)', type: 'number', defaultValue: 50000 },
      { id: 'monthlyContribution', label: 'Monthly Contribution ($)', type: 'number', defaultValue: 500 },
      { id: 'expectedReturn', label: 'Expected Annual Return (%)', type: 'number', defaultValue: 8.0 },
      { id: 'expenseRatio', label: 'Fund Expense Ratio / Fee (%)', type: 'number', defaultValue: 0.75, step: 0.05 },
      { id: 'horizonYears', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 30 }
    ],
    formula: 'Fee Cost = Future Value (without fees) - Future Value (reduced by expense ratio)',
    explanation: 'Expense ratios are subtracted directly from a fund\'s assets. Even seemingly tiny percentages compound into massive losses over 30-year investing periods.',
    example: 'A 0.75% fee on a $50,000 starting portfolio with $500 monthly deposits over 30 years costs you exactly $114,642 in lost wealth.',
    faq: [
      { question: 'What is a typical healthy expense ratio?', answer: 'Broad index ETFs (e.g. S&P 500 trackers) typically cost 0.03% to 0.10%. Actively managed mutual funds frequently ask 0.75% to 1.50%.' },
      { question: 'Are expense ratios billed in a separate statement?', answer: 'No, they are baked directly into daily stock nav assets, making them invisible until you project the compounding drag.' }
    ],
    relatedSlugs: ['v15-management-fee-calculator', 'v15-inflation-adjusted-return-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.initialBalance || 0);
      const mC = Number(inputs.monthlyContribution || 0);
      const r = Number(inputs.expectedReturn || 0) / 100;
      const f = Number(inputs.expenseRatio || 0) / 100;
      const yrs = Number(inputs.horizonYears || 1);

      // Compounded monthly
      const projection = (rate: number) => {
        let bal = p;
        const mRate = rate / 12;
        const limit = yrs * 12;
        for (let idx = 0; idx < limit; idx++) {
          bal = bal * (1 + mRate) + mC;
        }
        return bal;
      };

      const highFeeReturn = r - f;
      const balanceNoFee = projection(r);
      const balanceWithFee = projection(highFeeReturn);
      const feeCostTotal = balanceNoFee - balanceWithFee;

      return {
        results: [
          { label: 'Lost to Fees & Drag', value: `$${feeCostTotal.toFixed(2)}`, isPrimary: true },
          { label: 'Ending Balance With Fees', value: `$${balanceWithFee.toFixed(2)}` },
          { label: 'Ending balance Fee-Free', value: `$${balanceNoFee.toFixed(2)}` },
          { label: 'Percent Lost to Fees', value: `${((feeCostTotal / balanceNoFee) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Retained Account Value', value: Math.round(balanceWithFee) },
          { name: 'Siphoned by Fees', value: Math.round(feeCostTotal) }
        ]
      };
    }
  },
  {
    id: 'v15-management-fee',
    name: 'Management Fee Calculator',
    slug: 'v15-management-fee-calculator',
    category: 'finance',
    description: 'Analyze wealth drag from personal financial advisor flat or percent-based annual asset management fees (AUM).',
    seoTitle: 'AUM Wealth Advisor Annual Management Fee Solver',
    seoDescription: 'Obtain exact advisor fee counts. Model how 1% annual advisory charges affect retirement nests over decades.',
    inputs: [
      { id: 'portfolioPrincipal', label: 'Total Managed Portfolio ($)', type: 'number', defaultValue: 250000 },
      { id: 'annualAdvisorFee', label: 'Advising Annual Fee (AUM %)', type: 'number', defaultValue: 1.0, step: 0.1 },
      { id: 'projectedGrowth', label: 'Estimated Annual Growth (%)', type: 'number', defaultValue: 7.5 },
      { id: 'timelineYears', label: 'AUM Planning Timeline (Years)', type: 'number', defaultValue: 20 }
    ],
    formula: 'Advisor Drag = Portfolio (no fee compounded) - Portfolio (AUM fee deducted)',
    explanation: 'Assets Under Management (AUM) fees are calculated yearly. An advisor charging 1% per annum compounds into a major wealth siphon over decades of savings.',
    example: 'On a $250,000 managed account growing at 7.5%, a 1.0% annual management fee costs you $158,541 in cumulative value over 20 years.',
    faq: [
      { question: 'What does standard AUM represent?', answer: 'Assets Under Management. The advisor takes a direct percentage slice of your total assets yearly, regardless of portfolio performance.' },
      { question: 'What is fee-only financial advice?', answer: 'Hourly or project flat fees. These bypass AUM percentages and keep long-term compounding benefits in your custody.' }
    ],
    relatedSlugs: ['v15-investment-fee-calculator', 'v15-real-return-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.portfolioPrincipal || 0);
      const aFee = Number(inputs.annualAdvisorFee || 0) / 100;
      const g = Number(inputs.projectedGrowth || 0) / 100;
      const yrs = Number(inputs.timelineYears || 1);

      // Simple yearly compound for advisor fee comparisons
      let balNoFee = p;
      let balWithFee = p;

      for (let y = 0; y < yrs; y++) {
        balNoFee = balNoFee * (1 + g);
        balWithFee = balWithFee * (1 + (g - aFee));
      }

      const totalAdvisorTake = balNoFee - balWithFee;

      return {
        results: [
          { label: 'Advising Cumulative Fee Cost', value: `$${totalAdvisorTake.toFixed(2)}`, isPrimary: true },
          { label: 'Final Managed nest value', value: `$${balWithFee.toFixed(2)}` },
          { label: 'Hypothetical Self-Managed value', value: `$${balNoFee.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Ending Nest', value: Math.round(balWithFee) },
          { name: 'Lost to Advisor Fees', value: Math.round(totalAdvisorTake) }
        ]
      };
    }
  },
  {
    id: 'v15-inflation-adjusted-return',
    name: 'Inflation Adjusted Return Calculator',
    slug: 'v15-inflation-adjusted-return-calculator',
    category: 'finance',
    description: 'Calculate real purchasing power return rates on asset investments by adjusting for variable inflation rates.',
    seoTitle: 'Inflation-Adjusted & Real Purchasing Power Returns Calculator',
    seoDescription: 'Convert nominal yields into real outcomes. View how currency purchasing power decay alters investment futures.',
    inputs: [
      { id: 'nominalReturn', label: 'Nominal Annual Return (%)', type: 'number', defaultValue: 9.5 },
      { id: 'annualInflation', label: 'Average Inflation Rate (%)', type: 'number', defaultValue: 3.0 }
    ],
    formula: 'Real Return = ((1 + Nominal / 100) / (1 + Inflation / 100) - 1) * 100',
    explanation: 'Nominal returns represent raw numerical currency growth. Real returns reflect actual purchasing power improvements, protecting capital against currency debasement.',
    example: 'With a 9.5% nominal return and 3.0% annual inflation, your real inflation-adjusted investment return is 6.31%.',
    faq: [
      { question: 'Is simple subtraction (9.5 - 3 = 6.5) correct?', answer: 'Simple subtraction is a close approximation, but dividing the compounding index values calculates true purchasing power mathematically.' },
      { question: 'What represents typical historical US CPI inflation?', answer: 'Historically, average US CPI inflation runs around 2% to 3.5% per annum.' }
    ],
    relatedSlugs: ['v15-real-return-calculator', 'v15-investment-withdrawal-calculator'],
    calculate: (inputs) => {
      const nom = Number(inputs.nominalReturn || 0) / 100;
      const inf = Number(inputs.annualInflation || 0) / 100;

      const realReturn = ((1 + nom) / (1 + inf) - 1) * 100;

      return {
        results: [
          { label: 'Real Inflation-Adjusted Return', value: `${realReturn.toFixed(2)}%`, isPrimary: true },
          { label: 'Raw Nominal return rate', value: `${(nom * 100).toFixed(2)}%` },
          { label: 'Purchasing Power Loss rate', value: `${(inf * 100).toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Real Return (%)', value: Math.max(0, Math.round(realReturn)) },
          { name: 'Inflation Drag (%)', value: Math.round(inf * 100) }
        ]
      };
    }
  },
  {
    id: 'v15-real-return',
    name: 'Real Return Calculator',
    slug: 'v15-real-return-calculator',
    category: 'finance',
    description: 'Calculate net investment returns after accounting for both tax liabilities and inflation rates simultaneously.',
    seoTitle: 'Real Return & Double Drag Calculator | Taxes + Inflation',
    seoDescription: 'Input portfolio parameters, capital gains brackets, and average CPI weights to discover your actual net returns.',
    inputs: [
      { id: 'nominalYield', label: 'Nominal Annual Yield (%)', type: 'number', defaultValue: 10.0 },
      { id: 'taxBracket', label: 'Investment Income Tax Bracket (%)', type: 'number', defaultValue: 15 },
      { id: 'inflationRate', label: 'Average CPI Inflation (%)', type: 'number', defaultValue: 3.2 }
    ],
    formula: 'Tax Deducted Return = Nominal Yield * (1 - Tax Bracket / 100)\nReal Return = ((1 + Tax Deducted) / (1 + Inflation) - 1) * 100',
    explanation: 'Taxes and inflation act as a double drag on investments. Securing real returns requires understanding how these two factors erode your raw yields.',
    example: 'For a 10% nominal return taxed at 15% under a 3.2% inflation regime, your actual real investment yield is 5.14%.',
    faq: [
      { question: 'Does holding in a Roth IRA avoid the tax drag?', answer: 'Yes! Tax-sheltered accounts (like Roth IRAs or HSAs) eliminate the tax drag on portfolio growth and withdrawals.' },
      { question: 'Why is standard nominal yield deceptive?', answer: 'Nominal yield ignores the reality that both tax obligations and currency depreciation silently reduce your eventual purchasing power.' }
    ],
    relatedSlugs: ['v15-inflation-adjusted-return-calculator', 'v15-investment-withdrawal-calculator'],
    calculate: (inputs) => {
      const nom = Number(inputs.nominalYield || 0) / 100;
      const tax = Number(inputs.taxBracket || 0) / 100;
      const inf = Number(inputs.inflationRate || 0) / 100;

      const nominalAfterTax = nom * (1 - tax);
      const finalRealReturn = ((1 + nominalAfterTax) / (1 + inf) - 1) * 100;

      return {
        results: [
          { label: 'Actual Net Real Yield', value: `${finalRealReturn.toFixed(2)}%`, isPrimary: true },
          { label: 'After-Tax Nominal Yield', value: `${(nominalAfterTax * 100).toFixed(2)}%` },
          { label: 'Raw nominal output', value: `${(nom * 100).toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Net Real Return (%)', value: Math.max(0, Math.round(finalRealReturn)) },
          { name: 'Taxes Deducted (%)', value: Math.round(nom * tax * 100) },
          { name: 'Inflation Loss (%)', value: Math.round(inf * 100) }
        ]
      };
    }
  },
  {
    id: 'v15-investment-withdrawal',
    name: 'Investment Withdrawal Calculator',
    slug: 'v15-investment-withdrawal-calculator',
    category: 'finance',
    description: 'Calculate how long your retirement portfolio will last under custom regular drawdown rates.',
    seoTitle: 'Investment Withdrawal & Portfolio Longevity Calculator',
    seoDescription: 'Obtain passive retirement drawdown lengths. Measure how fast nest eggs deplete under inflation-adjusted monthly budgets.',
    inputs: [
      { id: 'nestEgg', label: 'Retirement Nest Egg Balance ($)', type: 'number', defaultValue: 1000000 },
      { id: 'monthlyWithdrawal', label: 'Expected Monthly Drawdown ($)', type: 'number', defaultValue: 4000 },
      { id: 'portfolioRate', label: 'Growth Return Pattern (% APY)', type: 'number', defaultValue: 6.5 },
      { id: 'inflationAdjust', label: 'Adjust Drawdown for Inflation?', type: 'select', defaultValue: 'yes', options: [
        { label: 'Yes, CPI Adjusted (3% per year)', value: 'yes' },
        { label: 'No, Fixed Monthly Amount', value: 'no' }
      ]}
    ],
    formula: 'Simulates month-by-month withdrawals with compound growth, adjusting withdrawal amounts yearly if requested.',
    explanation: 'Safely modeling drawdowns ensures you do not outlive your retirement funds by overspending during market downturns.',
    example: 'A $1,000,000 portfolio growing at 6.5% with a $4,000 monthly drawdown, adjusted yearly for 3% inflation, will sustain your lifestyle for 432 months (exactly 36.0 years).',
    faq: [
      { question: 'What is the standard 4% retirement rule?', answer: 'The 4% rule suggests withdrawing 4% of your starting retirement portfolio in year one, then adjusting that amount for inflation annually, ensuring high survival odds over 30 years.' },
      { question: 'Does sequence of returns risk change these numbers?', answer: 'Yes. Sustained market drops early in retirement force you to withdraw from depreciated principal, which can shorten portfolio longevity.' }
    ],
    relatedSlugs: ['v15-real-return-calculator', 'v15-compound-monthly-growth-calculator'],
    calculate: (inputs) => {
      const nest = Number(inputs.nestEgg || 0);
      const rawW = Number(inputs.monthlyWithdrawal || 0);
      const r = Number(inputs.portfolioRate || 0) / 100;
      const adj = String(inputs.inflationAdjust || 'yes');

      let currentBalance = nest;
      const mGrowth = r / 12;
      let monthCount = 0;
      let yearlyW = rawW * 12;

      let draw = rawW;
      // Loop month by month up to 100 years max
      while (currentBalance > draw && monthCount < 1200) {
        currentBalance = currentBalance * (1 + mGrowth) - draw;
        monthCount++;

        // Apply annual 3% inflation adjustment to the drawdown amount if requested
        if (adj === 'yes' && monthCount % 12 === 0) {
          draw = draw * 1.03;
        }
      }

      const yearsResult = monthCount / 12;

      return {
        results: [
          { label: 'Portfolio Longevity', value: monthCount >= 1200 ? 'Infinite / Self-Sustaining' : `${yearsResult.toFixed(1)} Years (${monthCount} Months)`, isPrimary: true },
          { label: 'Total Drawdowns Collected', value: `$${(draw * monthCount).toLocaleString()}` },
          { label: 'Exit Portfolio Balance', value: `$${Math.round(currentBalance).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Initial Capital', value: nest },
          { name: 'Approx. Safe drawdown (4% yr)', value: Math.round(nest * 0.04 / 12) }
        ]
      };
    }
  },
  {
    id: 'v15-compound-monthly-growth',
    name: 'Compound Monthly Growth Calculator',
    slug: 'v15-compound-monthly-growth-calculator',
    category: 'finance',
    description: 'Calculate structural growth trends using Compound Monthly Growth Rate (CMGR) comparisons.',
    seoTitle: 'Compound Monthly Growth Rate (CMGR) Calculator',
    seoDescription: 'Find your monthly geometric growth rate. Compare historical balances to evaluate company sales performance.',
    inputs: [
      { id: 'startVal', label: 'Starting Value ($ or Units)', type: 'number', defaultValue: 1000 },
      { id: 'endVal', label: 'Ending Value ($ or Units)', type: 'number', defaultValue: 5000 },
      { id: 'monthSpan', label: 'Time Span (Months)', type: 'number', defaultValue: 12 }
    ],
    formula: 'CMGR = ((Ending Value / Starting Value) ^ (1 / Time Span)) - 1',
    explanation: 'CMGR measures geometric progression over monthly timelines, offering standard metrics for analyzing startup revenue development.',
    example: 'Growing from an initial $1,000 starting asset to $5,000 over exactly 12 months represents a Compound Monthly Growth Rate of 14.35%.',
    faq: [
      { question: 'Why geometric growth over simple average rate?', answer: 'Simple averages ignore compounding, which can artificially inflate estimated growth velocity over longer series.' },
      { question: 'What represents typical CMGR targets?', answer: 'Early startups frequently target 10% to 15% CMGR to demonstrate competitive growth velocities to venture partners.' }
    ],
    relatedSlugs: ['v15-investment-fee-calculator', 'v15-real-return-calculator'],
    calculate: (inputs) => {
      const start = Number(inputs.startVal || 1);
      const end = Number(inputs.endVal || 1);
      const m = Number(inputs.monthSpan || 1);

      const cmgr = (Math.pow(end / start, 1 / m) - 1) * 100;

      return {
        results: [
          { label: 'Compound Monthly Growth Rate (CMGR)', value: `${cmgr.toFixed(2)}%`, isPrimary: true },
          { label: 'Overall Multiplier Factor', value: `${(end / start).toFixed(2)}x` },
          { label: 'Absolute Increase Amount', value: (end - start).toLocaleString() }
        ],
        chartData: [
          { name: 'Starting Value', value: start },
          { name: 'Compound End Value', value: end }
        ]
      };
    }
  }
];
