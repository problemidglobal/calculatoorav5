import { Calculator } from '../types';

export const V14_FINANCE_CALCULATORS: Calculator[] = [
  // PERSONAL FINANCE
  {
    id: 'monthly-income',
    name: 'Monthly Income Calculator',
    slug: 'monthly-income-calculator',
    category: 'finance',
    description: 'Calculate your true net and gross monthly income based on hourly, weekly, bi-weekly, or annual earnings.',
    seoTitle: 'Monthly Income & Salary Calculator | Gross vs Net Earned Income',
    seoDescription: 'Find your actual monthly take-home pay. Input wages, bonus rates, and tax deductions to see accurate gross and net monthly breakdowns.',
    inputs: [
      { id: 'rate', label: 'Earnings Amount ($)', type: 'number', defaultValue: 5000 },
      { id: 'frequency', label: 'Pay Frequency', type: 'select', defaultValue: 'annual', options: [
        { label: 'Hour', value: 'hourly' },
        { label: 'Week', value: 'weekly' },
        { label: 'Bi-Weekly (Every 2 Weeks)', value: 'biweekly' },
        { label: 'Semi-Monthly (Twice a Month)', value: 'semimonthly' },
        { label: 'Month', value: 'monthly' },
        { label: 'Year', value: 'annual' }
      ]},
      { id: 'hoursPerWeek', label: 'Hours worked per week (if hourly)', type: 'number', defaultValue: 40 },
      { id: 'taxRate', label: 'Estimated Tax Deduction Rate (%)', type: 'number', defaultValue: 22, min: 0, max: 100 }
    ],
    formula: 'Gross Monthly = Earnings normalized to monthly equivalent.\nNet Monthly = Gross Monthly * (1 - Tax Rate / 100).',
    explanation: 'Converting income from different pay structures into a monthly standard is essential for accurate budgeting and lease approval thresholds.',
    example: 'An annual wage of $60,000 gives $5,000 gross monthly. If taxed at 22%, the net taking home amounts to $3,900 monthly.',
    faq: [
      { question: 'What is the difference between gross and net income?', answer: 'Gross income is your total pay before any taxes, social security, or insurance are deducted. Net income is what is deposited into your bank account after these deductions.' },
      { question: 'How is a bi-weekly paycheck converted to monthly?', answer: 'There are 26 bi-weekly periods in a year. We multiply the paycheck by 26 and divide by 12 months to find the true monthly average.' }
    ],
    relatedSlugs: ['annual-income-calculator', 'disposable-income-calculator'],
    calculate: (inputs) => {
      const amt = Number(inputs.rate || 0);
      const freq = String(inputs.frequency || 'annual');
      const hpw = Number(inputs.hoursPerWeek || 40);
      const tax = Number(inputs.taxRate || 0);

      let grossAnnual = 0;
      switch (freq) {
        case 'hourly':
          grossAnnual = amt * hpw * 52;
          break;
        case 'weekly':
          grossAnnual = amt * 52;
          break;
        case 'biweekly':
          grossAnnual = amt * 26;
          break;
        case 'semimonthly':
          grossAnnual = amt * 24;
          break;
        case 'monthly':
          grossAnnual = amt * 12;
          break;
        case 'annual':
        default:
          grossAnnual = amt;
          break;
      }

      const grossMonthly = grossAnnual / 12;
      const netMonthly = grossMonthly * (1 - tax / 100);
      const annualTaxes = grossAnnual * (tax / 100);

      return {
        results: [
          { label: 'Gross Monthly Income', value: `$${grossMonthly.toFixed(2)}`, isPrimary: true },
          { label: 'Net Monthly (Take-Home)', value: `$${netMonthly.toFixed(2)}` },
          { label: 'Gross Annual Salary', value: `$${grossAnnual.toFixed(2)}` },
          { label: 'Monthly Tax Deducted', value: `$${(grossMonthly - netMonthly).toFixed(2)}` },
          { label: 'Annual Taxes Withheld', value: `$${annualTaxes.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Monthly Take-Home', value: Math.round(netMonthly) },
          { name: 'Monthly Tax Outflow', value: Math.round(grossMonthly - netMonthly) }
        ]
      };
    }
  },
  {
    id: 'annual-income',
    name: 'Annual Income Calculator',
    slug: 'annual-income-calculator',
    category: 'finance',
    description: 'Convert your pay rates from hourly, daily, or monthly structures to an annual salary estimate.',
    seoTitle: 'Annual Income & Yearly Salary Converter',
    seoDescription: 'Obtain your comprehensive yearly income projection. Account for work days, vacation hours, and variable overtime earnings.',
    inputs: [
      { id: 'rate', label: 'Pay Rate ($)', type: 'number', defaultValue: 25 },
      { id: 'frequency', label: 'Rate Frequency', type: 'select', defaultValue: 'hourly', options: [
        { label: 'Hourly', value: 'hourly' },
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' }
      ]},
      { id: 'hoursPerDay', label: 'Hours per workday (for hourly/daily)', type: 'number', defaultValue: 8 },
      { id: 'weeksPerYear', label: 'Paid Weeks per Year', type: 'number', defaultValue: 52, min: 1, max: 52 },
      { id: 'bonus', label: 'Additional Annual Bonuses ($)', type: 'number', defaultValue: 2000 }
    ],
    formula: 'Annual = (Base Rate * Frequency Factor) + Bonus',
    explanation: 'Evaluate your macro financial posture by seeing what your standard working hours represent over a full operational year.',
    example: 'An hourly rate of $25 per hour working 40 hours per week over 52 weeks plus a $2,000 bonus yields an annual income of $54,000.',
    faq: [
      { question: 'Should I include unpaid vacations?', answer: 'Yes, if you have unpaid time off, reduce the "Paid Weeks per Year" input to reflect only the active weeks for which you receive wages.' },
      { question: 'Does this calculate taxes?', answer: 'This calculator is focused on pre-tax gross annual revenue. Use the Monthly Income Calculator to analyze tax deductions.' }
    ],
    relatedSlugs: ['monthly-income-calculator', 'savings-percentage-calculator'],
    calculate: (inputs) => {
      const rate = Number(inputs.rate || 0);
      const freq = String(inputs.frequency || 'hourly');
      const hpd = Number(inputs.hoursPerDay || 8);
      const wpy = Number(inputs.weeksPerYear || 52);
      const bonus = Number(inputs.bonus || 0);

      let baseAnnual = 0;
      if (freq === 'hourly') {
        const hpw = (hpd * wpy) / 52;
        baseAnnual = rate * hpw * wpy;
      } else if (freq === 'daily') {
        const daysPerWeek = 5;
        baseAnnual = rate * daysPerWeek * wpy;
      } else if (freq === 'weekly') {
        baseAnnual = rate * wpy;
      } else if (freq === 'monthly') {
        baseAnnual = rate * 12;
      }

      const totalAnnual = baseAnnual + bonus;

      return {
        results: [
          { label: 'Total Annual Income', value: `$${totalAnnual.toFixed(2)}`, isPrimary: true },
          { label: 'Base Salary', value: `$${baseAnnual.toFixed(2)}` },
          { label: 'Monthly Equivalent', value: `$${(totalAnnual / 12).toFixed(2)}` },
          { label: 'Weekly Equivalent', value: `$${(totalAnnual / wpy).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Base Salary', value: Math.round(baseAnnual) },
          { name: 'Bonus Component', value: Math.round(bonus) }
        ]
      };
    }
  },
  {
    id: 'disposable-income',
    name: 'Disposable Income Calculator',
    slug: 'disposable-income-calculator',
    category: 'finance',
    description: 'Determine your disposable and discretionary income after accounting for compulsory taxes and living costs.',
    seoTitle: 'Disposable Income & Discretionary Savings Calculator',
    seoDescription: 'Find how much cash is actually left for savings and leisure. Subtract mandatory liabilities and recurring bills from your income.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Monthly Income ($)', type: 'number', defaultValue: 6000 },
      { id: 'taxes', label: 'Monthly Taxes & Social Levies ($)', type: 'number', defaultValue: 1200 },
      { id: 'mandatoryDeductions', label: 'Other Mandatory Deductions ($)', type: 'number', defaultValue: 300, helpText: 'e.g. compulsory union dues, health insurance' },
      { id: 'essentialExpenses', label: 'Essential Costs (Rent, Food, Utilities) ($)', type: 'number', defaultValue: 2500 }
    ],
    formula: 'Disposable Income = Gross Income - Taxes - Deductions\nDiscretionary Income = Disposable Income - Essential Expenses',
    explanation: 'Disposable income is income remaining after taxes. Discretionary income is what is left after tax obligations and essential cost-of-living bills have been satisfied.',
    example: 'With $6,000 gross monthly, $1,200 taxes, and $300 mandatory deductions, your Disposable Income is $4,500. Subtracting $2,500 for housing & food leaves $2,000 in Discretionary cash.',
    faq: [
      { question: 'Why is separating disposable and discretionary income important?', answer: 'Disposable income measures what you can spend on anything after government taxes. Discretionary income is the golden number for recreational play or investing because it ignores essential living survival costs.' },
      { question: 'What qualifies as an essential expense?', answer: 'Rent, mortgage, groceries, health insurance, minimum debt obligations, and active public transport or car bills.' }
    ],
    relatedSlugs: ['budget-allocation-calculator', 'expense-ratio-calculator'],
    calculate: (inputs) => {
      const gross = Number(inputs.grossIncome || 0);
      const tax = Number(inputs.taxes || 0);
      const mand = Number(inputs.mandatoryDeductions || 0);
      const essentials = Number(inputs.essentialExpenses || 0);

      const disposable = Math.max(0, gross - tax - mand);
      const discretionary = Math.max(0, disposable - essentials);

      return {
        results: [
          { label: 'Monthly Disposable Income', value: `$${disposable.toFixed(2)}`, isPrimary: true },
          { label: 'Discretionary Leftover', value: `$${discretionary.toFixed(2)}` },
          { label: 'Total Deductions & Taxes', value: `$${(tax + mand).toFixed(2)}` },
          { label: 'Essential Cost Strain', value: `${disposable > 0 ? ((essentials / disposable) * 100).toFixed(1) : '0'}%` }
        ],
        chartData: [
          { name: 'Discretionary Outpost', value: Math.round(discretionary) },
          { name: 'Essential Cost Base', value: Math.round(essentials) },
          { name: 'Taxes & Levies', value: Math.round(tax + mand) }
        ]
      };
    }
  },
  {
    id: 'savings-percentage',
    name: 'Savings Percentage Calculator',
    slug: 'savings-percentage-calculator',
    category: 'finance',
    description: 'Verify what proportion of your post-tax or gross earnings is routed to long-term wealth investments.',
    seoTitle: 'Savings Rate Percentage Calculator | Wealth Savings Ratio',
    seoDescription: 'Log your financial savings rate. Calculate what ratio of your earnings is captured as savings with simple inputs.',
    inputs: [
      { id: 'income', label: 'Net Monthly Take-Home ($)', type: 'number', defaultValue: 4500 },
      { id: 'amountSaved', label: 'Amount Saved/Invested Monthly ($)', type: 'number', defaultValue: 900 },
      { id: 'employerMatch', label: 'Employer Retirement Match (optional) ($)', type: 'number', defaultValue: 150 }
    ],
    formula: 'Savings Percentage = ((Monthly Savings + Match) / (Net Income + Match)) * 100',
    explanation: 'A healthy savings percentage is widely considered the strongest indicator of early retirement capabilities and safety margin cushions.',
    example: 'Saving $900 out of a $4,500 take-home income signifies a standard 20.0% savings metric. Including a $150 employer match elevates this rate to 22.6%.',
    faq: [
      { question: 'What is a typical benchmark savings target?', answer: 'The conventional 50/30/20 budget framework suggests allocating at least 20% of net income toward savings and investing allocations.' },
      { question: 'Does paying down principal count as savings?', answer: 'Yes! Placing payments over the principal on real estate or loans builds net equity value and functions identically to static cash savings.' }
    ],
    relatedSlugs: ['budget-allocation-calculator', 'wealth-accumulation-calculator'],
    calculate: (inputs) => {
      const inc = Number(inputs.income || 1);
      const saved = Number(inputs.amountSaved || 0);
      const match = Number(inputs.employerMatch || 0);

      const totalAllocated = saved + match;
      const baseNumerator = inc + match;
      const rate = baseNumerator > 0 ? (totalAllocated / baseNumerator) * 100 : 0;

      return {
        results: [
          { label: 'Total Savings Rate %', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Monthly Wealth Built', value: `$${totalAllocated.toFixed(2)}` },
          { label: 'Standard Savings Portion', value: `$${saved.toFixed(2)}` },
          { label: 'Employer Benefit Portion', value: `$${match.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Retained Savings', value: Math.round(totalAllocated) },
          { name: 'Dispersed Utilities', value: Math.max(0, Math.round(inc - saved)) }
        ]
      };
    }
  },
  {
    id: 'personal-expense-ratio-calc',
    name: 'Personal Expense Ratio Calculator',
    slug: 'personal-expense-ratio-calculator',
    category: 'finance',
    description: 'Calculate your personal income expense ratio to determine how much of your revenue goes toward cost overheads.',
    seoTitle: 'Personal Expense Ratio & Cost Metrics Solver',
    seoDescription: 'Differentiate variables between income and spending flows. See expense-to-earnings ratios instantly.',
    inputs: [
      { id: 'monthlyIncome', label: 'Total Monthly Income ($)', type: 'number', defaultValue: 5000 },
      { id: 'fixedCosts', label: 'Fixed Costs (Rent, Car, Utilities) ($)', type: 'number', defaultValue: 2100 },
      { id: 'variableCosts', label: 'Variable Costs (Dining, Clothes) ($)', type: 'number', defaultValue: 900 }
    ],
    formula: 'Expense Ratio = ((Fixed Costs + Variable Costs) / Income) * 100',
    explanation: 'Lowering your personal expense ratio increases the financial surplus that can be funneled into assets, accelerating financial security.',
    example: 'Generating $5,000 monthly with $2,100 fixed costs and $900 variable expenditures represents an Expense Ratio of 60%.',
    faq: [
      { question: 'What is a dangerous personal expense ratio?', answer: 'Ratios above 85-90% indicate a very thin margin of safety, leaving you highly vulnerable to simple cash flow shocks or job interruptions.' },
      { question: 'What are variable costs?', answer: 'Expenses that change from month to month, like clothing, travel, hobbies, entertainment, and optional restaurant outings.' }
    ],
    relatedSlugs: ['disposable-income-calculator', 'budget-allocation-calculator'],
    calculate: (inputs) => {
      const inc = Number(inputs.monthlyIncome || 1);
      const fix = Number(inputs.fixedCosts || 0);
      const vari = Number(inputs.variableCosts || 0);

      const totalOut = fix + vari;
      const ratio = (totalOut / inc) * 100;
      const remainingMargin = Math.max(0, 100 - ratio);

      return {
        results: [
          { label: 'Personal Expense Ratio', value: `${ratio.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Monthly Outflow', value: `$${totalOut.toFixed(2)}` },
          { label: 'Unspent Cash Margins', value: `$${(inc - totalOut).toFixed(2)}` },
          { label: 'Unspent Percentage', value: `${remainingMargin.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Fixed Overhead', value: Math.round(fix) },
          { name: 'Variable Spending', value: Math.round(vari) },
          { name: 'Surplus Reserve', value: Math.max(0, Math.round(inc - totalOut)) }
        ]
      };
    }
  },
  {
    id: 'budget-allocation',
    name: 'Budget Allocation Calculator',
    slug: 'budget-allocation-calculator',
    category: 'finance',
    description: 'Incorporate financial budget framework rules (like 50/30/20) onto your custom earnings base.',
    seoTitle: 'Budget Allocation & Spending Guideline Calculator',
    seoDescription: 'Divide your pay slips into smart target categories. Instantly calculate recommended margins for needs, wants, and savings goals.',
    inputs: [
      { id: 'netIncome', label: 'Net Monthly Earnings ($)', type: 'number', defaultValue: 4000 },
      { id: 'rule', label: 'Budget Allocation Strategy', type: 'select', defaultValue: '503020', options: [
        { label: '50 / 30 / 20 Rule (Standard Needs, Wants, Savings)', value: '503020' },
        { label: '70 / 20 / 10 Rule (Spending, Savings, Debt/Giving)', value: '702010' },
        { label: '80 / 20 Rule (Consolidated Living vs Savings)', value: '8020' }
      ]}
    ],
    formula: 'Yield depends entirely on framework selected: e.g. 50/30/20 allocates 50% to needs, 30% to wants, 20% to wealth.',
    explanation: 'Using strict, rule-based frameworks relieves the stress of micro-tracking every penny and maintains clear limits on recreational lifestyle inflation.',
    example: 'For standard take-home earnings of $4,000, the 50/30/20 protocol prescribes $2,000 for survival liabilities, $1,200 for hobby wants, and $800 for cash reserves.',
    faq: [
      { question: 'What belongs in the Needs category?', answer: 'Rent, medical bills, essential transportation, basic clothing, insurance premiums, and groceries.' },
      { question: 'What the 80/20 budget prioritizes?', answer: 'The 80/20 framework simplifies your tracking: 20% is directly allocated to savings as soon as you are paid, and the remaining 80% is freely spent on everything else.' }
    ],
    relatedSlugs: ['savings-percentage-calculator', 'spending-habit-calculator'],
    calculate: (inputs) => {
      const inc = Number(inputs.netIncome || 0);
      const rule = String(inputs.rule || '503020');

      let resultsList: { label: string; value: string | number; isPrimary?: boolean }[] = [];
      let chartItems: { name: string; value: number }[] = [];

      if (rule === '503020') {
        const needs = inc * 0.5;
        const wants = inc * 0.3;
        const savings = inc * 0.2;
        resultsList = [
          { label: 'Needs (50% Target Limit)', value: `$${needs.toFixed(2)}`, isPrimary: true },
          { label: 'Wants (30% Target Limit)', value: `$${wants.toFixed(2)}` },
          { label: 'Savings & Debt (20% Target Limit)', value: `$${savings.toFixed(2)}` }
        ];
        chartItems = [
          { name: 'Needs (50%)', value: needs },
          { name: 'Wants (30%)', value: wants },
          { name: 'Savings (20%)', value: savings }
        ];
      } else if (rule === '702010') {
        const spending = inc * 0.7;
        const savings = inc * 0.2;
        const extra = inc * 0.1;
        resultsList = [
          { label: 'Living Expenses (70% Target Limit)', value: `$${spending.toFixed(2)}`, isPrimary: true },
          { label: 'Savings & Investing (20% Target Limit)', value: `$${savings.toFixed(2)}` },
          { label: 'Debt Repay & Charities (10% Target Limit)', value: `$${extra.toFixed(2)}` }
        ];
        chartItems = [
          { name: 'Living Expenses (70%)', value: spending },
          { name: 'Savings (20%)', value: savings },
          { name: 'Debt & Giving (10%)', value: extra }
        ];
      } else {
        const living = inc * 0.8;
        const savings = inc * 0.2;
        resultsList = [
          { label: 'General Spent Cost (80% Target Limit)', value: `$${living.toFixed(2)}`, isPrimary: true },
          { label: 'Pay Yourself First Savings (20% Target)', value: `$${savings.toFixed(2)}` }
        ];
        chartItems = [
          { name: 'General Outflow (80%)', value: living },
          { name: 'Wealth Reserves (20%)', value: savings }
        ];
      }

      return {
        results: resultsList,
        chartData: chartItems
      };
    }
  },
  {
    id: 'spending-habit',
    name: 'Spending Habit Calculator',
    slug: 'spending-habit-calculator',
    category: 'finance',
    description: 'See the absolute future value yield of small recurring habits like coffees, lunches, or ride hailing if redirected to compound interest accounts.',
    seoTitle: 'Recurring Spending Habit Opportunity Cost Calculator',
    seoDescription: 'Find the real cost of minor spending actions. Convert simple habit amounts into huge long-term asset compound equations.',
    inputs: [
      { id: 'habitCost', label: 'Habit Spend Amount ($)', type: 'number', defaultValue: 10 },
      { id: 'cycle', label: 'Frequency of Spending', type: 'select', defaultValue: 'daily', options: [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' }
      ]},
      { id: 'rate', label: 'Opportunity Interest Return (%)', type: 'number', defaultValue: 8 },
      { id: 'years', label: 'Analysis Time Horizon (Years)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Future Value of Annuity = C * [((1 + r)^n) - 1] / r',
    explanation: 'Small systemic expenditures seem harmless in the short run, but looking through an opportunity-cost lens exposes thousands lost in growth.',
    example: 'Buying a $10 meal daily is $300 a month. Over 15 years, if placed in a balanced asset yielding 8%, it would grow to $104,748.',
    faq: [
      { question: 'Should I stop all small luxuries?', answer: 'Not necessarily! This is designed to highlight conscious spending habits, so you can direct funding away from low-value treats toward high-value growth assets.' },
      { question: 'Is 8% a realistic return rate?', answer: 'Yes, 8% is historical average annual stock index market return (inflation-adjusted is closer to 7%).' }
    ],
    relatedSlugs: ['budget-allocation-calculator', 'savings-percentage-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.habitCost || 0);
      const cycle = String(inputs.cycle || 'daily');
      const annualR = Number(inputs.rate || 8) / 100;
      const yrs = Number(inputs.years || 15);

      let monthlyCont = 0;
      if (cycle === 'daily') {
        monthlyCont = cost * 30.416;
      } else if (cycle === 'weekly') {
        monthlyCont = (cost * 52) / 12;
      } else {
        monthlyCont = cost;
      }

      const r = annualR / 12;
      const n = yrs * 12;

      let fv = 0;
      if (r === 0) {
        fv = monthlyCont * n;
      } else {
        fv = monthlyCont * (Math.pow(1 + r, n) - 1) / r;
      }

      const totalSpentCash = monthlyCont * n;
      const interestForgone = Math.max(0, fv - totalSpentCash);

      return {
        results: [
          { label: 'Compounded Value In-Hand', value: `$${fv.toFixed(2)}`, isPrimary: true },
          { label: 'Raw Money Directly Spent', value: `$${totalSpentCash.toFixed(2)}` },
          { label: 'Forgone Compound Growth', value: `$${interestForgone.toFixed(2)}` },
          { label: 'Monthly Outflow Cost', value: `$${monthlyCont.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Raw Savings Base', value: Math.round(totalSpentCash) },
          { name: 'Forgone Compound Profit', value: Math.round(interestForgone) }
        ]
      };
    }
  },

  // LOANS
  {
    id: 'v14-loan-cost',
    name: 'Loan Cost Calculator',
    slug: 'loan-cost-calculator',
    category: 'finance',
    description: 'Calculate your total borrowing costs including principal, interest rates, upfront financing fees, and service margins.',
    seoTitle: 'True Borrowing Loan Cost & Interest Solver',
    seoDescription: 'Input loan structures to discover immediate APR margins and see total payback volumes.',
    inputs: [
      { id: 'principal', label: 'Borrowing Amount ($)', type: 'number', defaultValue: 25000 },
      { id: 'rate', label: 'Stated Interest Rate (%)', type: 'number', defaultValue: 6.8 },
      { id: 'years', label: 'Term (Years)', type: 'number', defaultValue: 5 },
      { id: 'originationFee', label: 'Upfront Origination Fees ($)', type: 'number', defaultValue: 500 }
    ],
    formula: 'Total Cost = (Monthly Payment * Term Months) + Origination Fee',
    explanation: 'Exposes how stated promotional interest rates differ from actual cash paid, incorporating upfront fee margins.',
    example: 'A $25,000 five-year loan at 6.8% with $500 origination fees entails standard payments of $492.65/mo. Total payback equals $30,059.21.',
    faq: [
      { question: 'What is APR vs Interest Rate?', answer: 'Interest rate determines monthly payment size, while APR (Annual Percentage Rate) incorporates upfront loan generation fees, presenting true overhead ratios.' },
      { question: 'Can upfront fees be rolled into the loan?', answer: 'Often yes, but this causes interest to accumulate on those fees too, increasing overall debt burden.' }
    ],
    relatedSlugs: ['loan-comparison-tool', 'interest-savings-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 25000);
      const r = Number(inputs.rate || 6.8) / 100 / 12;
      const yrs = Number(inputs.years || 5);
      const fee = Number(inputs.originationFee || 0);

      const n = yrs * 12;
      const monthlyPay = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPaymentsSum = monthlyPay * n;
      const totalInterest = Math.max(0, totalPaymentsSum - p);
      const trueOverheadCost = totalPaymentsSum + fee;

      return {
        results: [
          { label: 'Total Repayment Cost', value: `$${trueOverheadCost.toFixed(2)}`, isPrimary: true },
          { label: 'Monthly Repayment', value: `$${monthlyPay.toFixed(2)}` },
          { label: 'Raw Principal Borrowed', value: `$${p.toFixed(2)}` },
          { label: 'Total Interest Charge', value: `$${totalInterest.toFixed(2)}` },
          { label: 'Upfront Fees Offset', value: `$${fee.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Initial Principal', value: Math.round(p) },
          { name: 'Interest Charge', value: Math.round(totalInterest) },
          { name: 'Transaction Fees', value: Math.round(fee) }
        ]
      };
    }
  },
  {
    id: 'v14-loan-comparison',
    name: 'Loan Comparison Tool',
    slug: 'loan-comparison-tool',
    category: 'finance',
    description: 'Compare two loans side-by-side to find the lowest monthly liability and long-term interest cost.',
    seoTitle: 'Loan Comparison Tool | Side-By-Side Rate Solver',
    seoDescription: 'Compare interest rates, loan terms, and payments for two loan scenarios to find the best financial deal.',
    inputs: [
      { id: 'loanAAmount', label: 'Loan A Principal ($)', type: 'number', defaultValue: 100000 },
      { id: 'loanARate', label: 'Loan A Interest Rate (%)', type: 'number', defaultValue: 6.5 },
      { id: 'loanATerm', label: 'Loan A Term (Years)', type: 'number', defaultValue: 30 },
      { id: 'loanBAmount', label: 'Loan B Principal ($)', type: 'number', defaultValue: 100000 },
      { id: 'loanBRate', label: 'Loan B Interest Rate (%)', type: 'number', defaultValue: 5.5 },
      { id: 'loanBTerm', label: 'Loan B Term (Years)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Monthly payment for each is calculated, then total lifetime interest of both options is compared.',
    explanation: 'Easily compare a 30-year loan with a high rate against a 15-year alternative with low rate ratios.',
    example: 'Comparing a $100,000 30-year mortgage at 6.5% to a 15-year loan at 5.5% exposes $88,272 in lifetime interest savings by switching.',
    faq: [
      { question: 'Should I choose lower payments or lower interest?', answer: 'Lower payments (longer terms) reduce monthly budgeting strain, but cost significantly more in total interest. Shorter terms save interest but demand safe, stable cash flows.' },
      { question: 'Does a small rate difference matter?', answer: 'Yes, on large loans like real estate, even a 0.25% difference translates to thousands of dollars in lifetime payments.' }
    ],
    relatedSlugs: ['loan-cost-calculator', 'interest-savings-calculator'],
    calculate: (inputs) => {
      const pA = Number(inputs.loanAAmount || 100000);
      const rA = Number(inputs.loanARate || 6.5) / 100 / 12;
      const tA = Number(inputs.loanATerm || 30) * 12;

      const pB = Number(inputs.loanBAmount || 100000);
      const rB = Number(inputs.loanBRate || 5.5) / 100 / 12;
      const tB = Number(inputs.loanBTerm || 15) * 12;

      const payA = rA === 0 ? pA / tA : (pA * rA * Math.pow(1 + rA, tA)) / (Math.pow(1 + rA, tA) - 1);
      const payB = rB === 0 ? pB / tB : (pB * rB * Math.pow(1 + rB, tB)) / (Math.pow(1 + rB, tB) - 1);

      const totA = payA * tA;
      const totB = payB * tB;

      const intA = Math.max(0, totA - pA);
      const intB = Math.max(0, totB - pB);

      return {
        results: [
          { label: 'Loan A Monthly Cost', value: `$${payA.toFixed(2)}` },
          { label: 'Loan B Monthly Cost', value: `$${payB.toFixed(2)}` },
          { label: 'Loan A Total Interest', value: `$${intA.toFixed(2)}` },
          { label: 'Loan B Total Interest', value: `$${intB.toFixed(2)}` },
          { label: 'Difference in Interest', value: `$${Math.abs(intA - intB).toFixed(2)}`, isPrimary: true }
        ],
        chartData: [
          { name: 'Loan A Total Interest', value: Math.round(intA) },
          { name: 'Loan B Total Interest', value: Math.round(intB) }
        ]
      };
    }
  },
  {
    id: 'v14-interest-savings',
    name: 'Interest Savings Calculator',
    slug: 'interest-savings-calculator',
    category: 'finance',
    description: 'Calculate the absolute amount of interest saved by making extra monthly overpayments on your loan.',
    seoTitle: 'Prepayment Loan Interest Savings Calculator',
    seoDescription: 'Find exactly how many dollars of future interest charges you will save by overpaying your principal balance.',
    inputs: [
      { id: 'balance', label: 'Remaining Loan Balance ($)', type: 'number', defaultValue: 50000 },
      { id: 'rate', label: 'Interest Rate (%)', type: 'number', defaultValue: 6 },
      { id: 'term', label: 'Remaining Term (Years)', type: 'number', defaultValue: 15 },
      { id: 'overpayment', label: 'Extra Payment Monthly ($)', type: 'number', defaultValue: 100 }
    ],
    formula: 'Amortization loops subtract extra amounts over balance, accumulating month-to-month interest margins.',
    explanation: 'Placing extra funds directly onto the principal balance shortens the interest-compounding timeline, delivering immediate savings.',
    example: 'Adding $100 extra monthly to a $50,000 loan at 6% with 15 years left saves $5,821 in lifetime interest charges.',
    faq: [
      { question: 'Is it safe to prepay loans?', answer: 'Check with your lender to ensure there are no pre-payment penalties on your contract.' },
      { question: 'Why does extra payments save so much?', answer: 'Because interest compiles on the active outstanding balance. Shrinking that balance prevents interest from accruing in future months.' }
    ],
    relatedSlugs: ['loan-cost-calculator', 'payment-frequency-calculator'],
    calculate: (inputs) => {
      const bal = Number(inputs.balance || 50000);
      const rateAn = Number(inputs.rate || 6);
      const yrs = Number(inputs.term || 15);
      const extra = Number(inputs.overpayment || 100);

      const r = rateAn / 100 / 12;
      const n = yrs * 12;

      const basePay = r === 0 ? bal / n : (bal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      // standard track
      let activeBalStd = bal;
      let totIntStd = 0;
      for (let i = 0; i < n; i++) {
        const intAmt = activeBalStd * r;
        totIntStd += intAmt;
        const princPaid = basePay - intAmt;
        activeBalStd -= princPaid;
        if (activeBalStd <= 0) break;
      }

      // accelerated track
      let activeBalAcc = bal;
      let totIntAcc = 0;
      let monthsCount = 0;
      while (activeBalAcc > 0 && monthsCount < 600) {
        monthsCount++;
        const intAmt = activeBalAcc * r;
        totIntAcc += intAmt;
        let actualPay = basePay + extra;
        if (actualPay > activeBalAcc + intAmt) {
          actualPay = activeBalAcc + intAmt;
        }
        const princPaid = actualPay - intAmt;
        activeBalAcc -= princPaid;
      }

      const saved = Math.max(0, totIntStd - totIntAcc);
      const timelineSaved = Math.max(0, n - monthsCount);

      return {
        results: [
          { label: 'Total Interest Saved', value: `$${saved.toFixed(2)}`, isPrimary: true },
          { label: 'Months Shaved Off', value: `${timelineSaved} Months (${(timelineSaved/12).toFixed(1)} Years)` },
          { label: 'Prepaid Total Interest', value: `$${totIntAcc.toFixed(2)}` },
          { label: 'Standard Total Interest', value: `$${totIntStd.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Standard Interest Cost', value: Math.round(totIntStd) },
          { name: 'Prepaid Interest Cost', value: Math.round(totIntAcc) }
        ]
      };
    }
  },
  {
    id: 'v14-payment-frequency',
    name: 'Payment Frequency Calculator',
    slug: 'payment-frequency-calculator',
    category: 'finance',
    description: 'Compare weekly, bi-weekly, semi-monthly, and monthly payment options to find the best repayment strategy.',
    seoTitle: 'Loan Payment Frequency Savings Calculator',
    seoDescription: 'Analyze payments across monthly, bi-weekly, and weekly cycles. Learn how accelerated schedules save interest.',
    inputs: [
      { id: 'amount', label: 'Loan Amount ($)', type: 'number', defaultValue: 100000 },
      { id: 'rate', label: 'Annual Rate (%)', type: 'number', defaultValue: 5 },
      { id: 'years', label: 'Term in Years', type: 'number', defaultValue: 30 }
    ],
    formula: 'Cycles correspond to year subdivisions. Regular bi-weekly splits standard monthly in half, adding one extra pay-month equivalent/yr.',
    explanation: 'Accelerated bi-weekly payments result in 26 half-payments a year, which is equivalent to 13 full payments instead of 12. This significantly reduces your loan term without major lifestyle adjustments.',
    example: 'For a $100,000, 30-year loan at 5%, switching to an accelerated bi-weekly payment reduces your mortgage length by 4.8 years and saves $17,422 in interest.',
    faq: [
      { question: 'What is the secret of bi-weekly payments?', answer: 'Because you budget half-monthly payments every two weeks, you end up making 26 half-payments (or 13 full monthly payments) each calendar year.' },
      { question: 'What is semi-monthly vs. bi-weekly?', answer: 'Semi-monthly occurs exactly 24 times per year (twice a month), which matches standard pay cycles but does NOT accelerate principal paydown.' }
    ],
    relatedSlugs: ['loan-cost-calculator', 'loan-balance-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount || 100000);
      const annRate = Number(inputs.rate || 5) / 100;
      const yrs = Number(inputs.years || 30);

      const rMonthly = annRate / 12;
      const nMonthly = yrs * 12;
      const monthlyPayStd = rMonthly === 0 ? p / nMonthly : (p * rMonthly * Math.pow(1 + rMonthly, nMonthly)) / (Math.pow(1 + rMonthly, nMonthly) - 1);

      // Accelerated bi-weekly standard logic
      const biweeklyPay = monthlyPayStd / 2;
      const rBiweekly = annRate / 26;
      let activeBalBi = p;
      let monthsBi = 0;
      let totalPaidBi = 0;
      let totalInterestBi = 0;

      while (activeBalBi > 0 && monthsBi < 1300) {
        monthsBi++;
        const interest = activeBalBi * rBiweekly;
        totalInterestBi += interest;
        const pay = Math.min(activeBalBi + interest, biweeklyPay);
        activeBalBi += interest - pay;
        totalPaidBi += pay;
      }

      const totalPaidMonthly = monthlyPayStd * nMonthly;
      const totalInterestMonthly = Math.max(0, totalPaidMonthly - p);
      const interestSaved = Math.max(0, totalInterestMonthly - totalInterestBi);
      const yearsSaved = Math.max(0, yrs - (monthsBi / 26));

      return {
        results: [
          { label: 'Standard Monthly Payment', value: `$${monthlyPayStd.toFixed(2)}` },
          { label: 'Accelerated Bi-Weekly Payment', value: `$${biweeklyPay.toFixed(2)}`, isPrimary: true },
          { label: 'Interest Saved via Bi-Weekly', value: `$${interestSaved.toFixed(2)}` },
          { label: 'Years Shaved Off', value: `${yearsSaved.toFixed(1)} Years` },
          { label: 'Bi-Weekly Lifetime Interest', value: `$${totalInterestBi.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Monthly Int. Total', value: Math.round(totalInterestMonthly) },
          { name: 'Bi-weekly Int. Total', value: Math.round(totalInterestBi) }
        ]
      };
    }
  },
  {
    id: 'v14-loan-balance',
    name: 'Loan Balance Calculator',
    slug: 'loan-balance-calculator',
    category: 'finance',
    description: 'Calculate your outstanding loan balance at any point in the loan term based on the number of payments made.',
    seoTitle: 'Calculate Outstanding Amortized Loan Balance',
    seoDescription: 'Obtain current residual principal weights at any month of your mortgage or car loan schedule.',
    inputs: [
      { id: 'principal', label: 'Original Principal ($)', type: 'number', defaultValue: 40000 },
      { id: 'rate', label: 'Annual Rate (%)', type: 'number', defaultValue: 5.5 },
      { id: 'term', label: 'Term (Years)', type: 'number', defaultValue: 10 },
      { id: 'paymentsMade', label: 'Elapsed Payments Made (Months)', type: 'number', defaultValue: 24 }
    ],
    formula: 'B = P * [ (1 + r)^n - (1 + r)^p ] / [ (1 + r)^n - 1 ]\nWhere p is payments made.',
    explanation: 'Shed light on current residual debt balances without having to wait for bank statements or servicer portals.',
    example: 'For a $40,000 loan at 5.5% with a 10-year term, after 24 monthly payments have been made, your outstanding principal balance is $33,524.11.',
    faq: [
      { question: 'Why does my balance go down so slowly initially?', answer: 'In the early phase of an amortized loan, the interest burden is calculated on the highest principal balance, meaning the majority of your payment is consumed by interest charges.' },
      { question: 'Does extra payments modify this formula?', answer: 'Yes! Placing extra payments speeds up principal offset, meaning your actual balance will be lower than this standard calculation.' }
    ],
    relatedSlugs: ['remaining-debt-calculator', 'loan-cost-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 40000);
      const annRate = Number(inputs.rate || 5.5) / 100;
      const yrs = Number(inputs.term || 10);
      const made = Number(inputs.paymentsMade || 24);

      const r = annRate / 12;
      const n = yrs * 12;

      let balance = p;
      if (r !== 0) {
        const factorN = Math.pow(1 + r, n);
        const factorP = Math.pow(1 + r, made);
        balance = p * (factorN - factorP) / (factorN - 1);
      } else {
        balance = p * (1 - made / n);
      }

      balance = Math.max(0, balance);
      const equityBuilt = Math.max(0, p - balance);

      return {
        results: [
          { label: 'Remaining Loan Balance', value: `$${balance.toFixed(2)}`, isPrimary: true },
          { label: 'Equity Built So Far', value: `$${equityBuilt.toFixed(2)}` },
          { label: 'Original Debt Total', value: `$${p.toFixed(2)}` },
          { label: 'Percent Debt Remaining', value: `${((balance / p) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Owed Principal', value: Math.round(balance) },
          { name: 'Equity Paid', value: Math.round(equityBuilt) }
        ]
      };
    }
  },
  {
    id: 'v14-remaining-debt',
    name: 'Remaining Debt Calculator',
    slug: 'remaining-debt-calculator',
    category: 'finance',
    description: 'Aggregate and analyze all your current debt liabilities to track your debt payoff progress.',
    seoTitle: 'Remaining Debt Portfolio & Paydown Calculator',
    seoDescription: 'Log outstanding loans, credit cards, and lines of credit. Find your blended interest rate and overall debt payoff timeline.',
    inputs: [
      { id: 'debt1', label: 'Credit Card Debt ($)', type: 'number', defaultValue: 5000 },
      { id: 'rate1', label: 'Credit Card Rate (%)', type: 'number', defaultValue: 19.9 },
      { id: 'debt2', label: 'Student Loan Balance ($)', type: 'number', defaultValue: 25000 },
      { id: 'rate2', label: 'Student Loan Rate (%)', type: 'number', defaultValue: 5.2 },
      { id: 'debt3', label: 'Car Loan Balance ($)', type: 'number', defaultValue: 15000 },
      { id: 'rate3', label: 'Car Loan Rate (%)', type: 'number', defaultValue: 6.5 }
    ],
    formula: 'Blended Interest Rate = sum(Debt_i * Rate_i) / Total Debt',
    explanation: 'Aggregating debt helps you visualize your combined liabilities and calculate a weighted average rate to optimize snowball or avalanche paydown actions.',
    example: 'Consolidating $5,000 at 19.9%, $25,000 at 5.2%, and $15,000 at 6.5% equals $45,000 in total debt, carrying a blended interest rate of 7.27%.',
    faq: [
      { question: 'What is a weighted blended rate?', answer: 'It is the true interest rate representing your portfolio. It prevents treating all loans of different sizes identically.' },
      { question: 'Should I pay high-rate or small-balance debt first?', answer: 'The avalanche method targets the highest interest rate first (saving the most money), while the snowball targets the smallest balance first (for psychological wins).' }
    ],
    relatedSlugs: ['loan-balance-calculator', 'loan-comparison-tool'],
    calculate: (inputs) => {
      const d1 = Number(inputs.debt1 || 0);
      const r1 = Number(inputs.rate1 || 0);
      const d2 = Number(inputs.debt2 || 0);
      const r2 = Number(inputs.rate2 || 0);
      const d3 = Number(inputs.debt3 || 0);
      const r3 = Number(inputs.rate3 || 0);

      const totalDebt = d1 + d2 + d3;
      let blendedRate = 0;
      if (totalDebt > 0) {
        blendedRate = ((d1 * r1) + (d2 * r2) + (d3 * r3)) / totalDebt;
      }

      return {
        results: [
          { label: 'Total Outstanding Debt', value: `$${totalDebt.toFixed(2)}`, isPrimary: true },
          { label: 'Blended Weighted Rate', value: `${blendedRate.toFixed(2)}%` },
          { label: 'Credit Card Proportion', value: `${totalDebt > 0 ? ((d1 / totalDebt) * 100).toFixed(1) : '0'}%` },
          { label: 'Student Loan Proportion', value: `${totalDebt > 0 ? ((d2 / totalDebt) * 100).toFixed(1) : '0'}%` },
          { label: 'Car Loan Proportion', value: `${totalDebt > 0 ? ((d3 / totalDebt) * 100).toFixed(1) : '0'}%` }
        ],
        chartData: [
          { name: 'Credit Card', value: d1 },
          { name: 'Student Loan', value: d2 },
          { name: 'Car Loan', value: d3 }
        ]
      };
    }
  },

  // INVESTMENT
  {
    id: 'v14-investment-time-horizon',
    name: 'Investment Time Horizon Calculator',
    slug: 'investment-time-horizon-calculator',
    category: 'finance',
    description: 'Determine the exact years required to reach your target savings nest egg based on periodic compounding deposits.',
    seoTitle: 'Investment Time Horizon & Target Year Calculator',
    seoDescription: 'Obtain precisely how long you must hold assets to reach a portfolio milestone under regular interest projections.',
    inputs: [
      { id: 'target', label: 'Target Portfolio Milestone ($)', type: 'number', defaultValue: 500000 },
      { id: 'principal', label: 'Starting Investment Balance ($)', type: 'number', defaultValue: 10000 },
      { id: 'addition', label: 'Monthly Savings Deposit ($)', type: 'number', defaultValue: 500 },
      { id: 'rate', label: 'Projected Annual Return (%)', type: 'number', defaultValue: 7.5 }
    ],
    formula: 'Time is solved iteratively by compounding monthly additions under interest targets: FV = PV(1+r)^t + PMT * [((1+r)^t - 1)/r]',
    explanation: 'Understand the timeline required to reach financial milestones based on your current savings rate and average historical stock market returns.',
    example: 'With $10,000 starting, saving $500 monthly at 7.5% interest, it will take 27.6 years of compounding to reach $500,000.',
    faq: [
      { question: 'How can I shorten my time horizon?', answer: 'Shorten target timescales by increasing your monthly deposit contribution or adopting diversified equity structures with higher net yield rates.' },
      { question: 'Does inflation affect time horizons?', answer: 'Yes. To adjust for inflation, subtract the average inflation rate (typically 2-3%) from your projected return rate.' }
    ],
    relatedSlugs: ['investment-goal-calculator', 'wealth-accumulation-calculator'],
    calculate: (inputs) => {
      const target = Number(inputs.target || 500000);
      const init = Number(inputs.principal || 10000);
      const addition = Number(inputs.addition || 500);
      const annRate = Number(inputs.rate || 7.5) / 100;

      const r = annRate / 12;
      let balance = init;
      let months = 0;

      if (balance >= target) {
        months = 0;
      } else {
        // Iterate up to 1200 months (100 years)
        while (balance < target && months < 1200) {
          months++;
          balance = (balance * (1 + r)) + addition;
        }
      }

      const totalDeposited = init + (addition * months);
      const compoundInterestEarned = Math.max(0, balance - totalDeposited);
      const years = months / 12;

      return {
        results: [
          { label: 'Time Horizon Required', value: `${years.toFixed(1)} Years (${months} Months)`, isPrimary: true },
          { label: 'Total Deposits Made', value: `$${totalDeposited.toFixed(2)}` },
          { label: 'Interest Profit Accumulated', value: `$${compoundInterestEarned.toFixed(2)}` },
          { label: 'Estimated Balance Attained', value: `$${balance.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Total Invested Out-of-Pocket', value: Math.round(totalDeposited) },
          { name: 'Compounded Net Growth', value: Math.round(compoundInterestEarned) }
        ]
      };
    }
  },
  {
    id: 'v14-investment-goal',
    name: 'Investment Goal Calculator',
    slug: 'investment-goal-calculator',
    category: 'finance',
    description: 'Determine the exact monthly deposits needed to reach a target financial milestone within a specific timeframe.',
    seoTitle: 'Investment Goal Contributor Calculator',
    seoDescription: 'Obtain precisely how much cash you must save each month to achieve capital objectives.',
    inputs: [
      { id: 'target', label: 'Desired Wealth Target ($)', type: 'number', defaultValue: 100000 },
      { id: 'years', label: 'Timeframe to Achieve (Years)', type: 'number', defaultValue: 10 },
      { id: 'initialBalance', label: 'Starting Capital Nest Egg ($)', type: 'number', defaultValue: 5000 },
      { id: 'rate', label: 'Expected Annual Yield (%)', type: 'number', defaultValue: 8 }
    ],
    formula: 'PMT = [ Goal - PV*(1+r)^n ] / [ ((1+r)^n - 1) / r ]',
    explanation: 'Reverse-engineer your financial goals to establish clear monthly budgets that keep your retirement plans on schedule.',
    example: 'To amass $100,000 in 10 years starting with $5,000 at an 8% yield, you need to invest exactly $537.40 monthly.',
    faq: [
      { question: 'What if PMT is too high for my current budget?', answer: 'Either extend the years timeframe, seek a higher-yielding investment asset class, or lower the desired wealth target.' },
      { question: 'How is compound interest calculated here?', answer: 'This uses standard monthly compounding, assuming deposits are made at the end of each monthly period.' }
    ],
    relatedSlugs: ['investment-time-horizon-calculator', 'wealth-accumulation-calculator'],
    calculate: (inputs) => {
      const g = Number(inputs.target || 100000);
      const yrs = Number(inputs.years || 10);
      const init = Number(inputs.initialBalance || 5000);
      const annRate = Number(inputs.rate || 8) / 100;

      const r = annRate / 12;
      const n = yrs * 12;

      const compoundInit = init * Math.pow(1 + r, n);
      const numerator = g - compoundInit;
      let neededPMT = 0;

      if (numerator > 0) {
        if (r === 0) {
          neededPMT = numerator / n;
        } else {
          neededPMT = numerator / ((Math.pow(1 + r, n) - 1) / r);
        }
      }

      const totalSavedOutofPocket = init + (neededPMT * n);
      const growthProfit = Math.max(0, g - totalSavedOutofPocket);

      return {
        results: [
          { label: 'Required Monthly Deposit', value: `$${neededPMT.toFixed(2)}`, isPrimary: true },
          { label: 'Cumulative Personal Savings', value: `$${totalSavedOutofPocket.toFixed(2)}` },
          { label: 'Investment Growth Portion', value: `$${growthProfit.toFixed(2)}` },
          { label: 'Compound Growth Multiple', value: `${(g / totalSavedOutofPocket).toFixed(2)}x` }
        ],
        chartData: [
          { name: 'Self Invested Portion', value: Math.round(totalSavedOutofPocket) },
          { name: 'Growth Yield Margin', value: Math.round(growthProfit) }
        ]
      };
    }
  },
  {
    id: 'v14-portfolio-return',
    name: 'Portfolio Return Calculator',
    slug: 'portfolio-return-calculator',
    category: 'finance',
    description: 'Calculate the expected weighted rate of return for a multi-asset investment portfolio.',
    seoTitle: 'Weighted Portfolio Return Rate Calculator',
    seoDescription: 'Find the blended expected return rate of a diversifed wealth portfolio containing stocks, bonds, and cash.',
    inputs: [
      { id: 'stockAlloc', label: 'Stocks Allocation ($)', type: 'number', defaultValue: 60000 },
      { id: 'stockReturn', label: 'Expected Stock Return (%)', type: 'number', defaultValue: 9.5 },
      { id: 'bondAlloc', label: 'Bonds Allocation ($)', type: 'number', defaultValue: 30000 },
      { id: 'bondReturn', label: 'Expected Bond Return (%)', type: 'number', defaultValue: 4.5 },
      { id: 'cashAlloc', label: 'Cash Allocations ($)', type: 'number', defaultValue: 10000 },
      { id: 'cashReturn', label: 'Expected Cash Yield (%)', type: 'number', defaultValue: 3.8 }
    ],
    formula: 'Portfolio Return = Sum(Asset Allocation_i * Expected Return_i) / Total Portfolio Value',
    explanation: 'Assess your diversified capital holdings. Ensure assets are correctly allocated and align with long-term compound rules.',
    example: 'Allocating $60k at 9.5% return, $30k at 4.5% return, and $10k at 3.8% return represents an overall annual return of 7.43%.',
    faq: [
      { question: 'What is a typical balanced portfolio asset allocation?', answer: 'A common rule of thumb is the 60/40 index split: 60% of assets allocated to broad stock market funds and 40% to stable bonds.' },
      { question: 'Are forward return projections guaranteed?', answer: 'No. Projections are historical estimates. Actual returns fluctuate based on market cycles.' }
    ],
    relatedSlugs: ['risk-return-calculator', 'asset-growth-calculator'],
    calculate: (inputs) => {
      const sa = Number(inputs.stockAlloc || 0);
      const sr = Number(inputs.stockReturn || 0);
      const ba = Number(inputs.bondAlloc || 0);
      const br = Number(inputs.bondReturn || 0);
      const ca = Number(inputs.cashAlloc || 0);
      const cr = Number(inputs.cashReturn || 0);

      const totalVal = sa + ba + ca;
      let blended = 0;
      if (totalVal > 0) {
        blended = ((sa * sr) + (ba * br) + (ca * cr)) / totalVal;
      }

      return {
        results: [
          { label: 'Portfolio Returns Weighted', value: `${blended.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Portfolio Valuation', value: `$${totalVal.toFixed(2)}` },
          { label: 'Stocks Weight %', value: `${totalVal > 0 ? ((sa / totalVal) * 100).toFixed(1) : '0'}%` },
          { label: 'Bonds Weight %', value: `${totalVal > 0 ? ((ba / totalVal) * 100).toFixed(1) : '0'}%` }
        ],
        chartData: [
          { name: 'Stocks', value: sa },
          { name: 'Bonds', value: ba },
          { name: 'Cash Reserves', value: ca }
        ]
      };
    }
  },
  {
    id: 'v14-risk-return',
    name: 'Risk Return Calculator',
    slug: 'risk-return-calculator',
    category: 'finance',
    description: 'Calculate the Sharpe Ratio to evaluate the risk-adjusted performance of your investments.',
    seoTitle: 'Investment Risk-Adjusted Sharpe Ratio Calculator',
    seoDescription: 'Input asset volatility ratios and yields relative to safe Treasury bonds to find the Sharpe Risk metrics.',
    inputs: [
      { id: 'return', label: 'Expected Asset Return (%)', type: 'number', defaultValue: 12 },
      { id: 'rfRate', label: 'Risk-Free Treasury Return (%)', type: 'number', defaultValue: 4.2 },
      { id: 'stdDev', label: 'Portfolio Volatility / Std. Dev (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Sharpe Ratio = (Expected Portfolio Return - Risk-Free Return) / Volatility Standard Deviation',
    explanation: 'Sharpe Ratio measures excess return per unit of dispersion risk. High ratios indicate better risk-adjusted returns.',
    example: 'A stock returning 12% relative to a 4.2% stable Treasury bond, with a standard deviation risk of 15%, yields a Sharpe Ratio of 0.52.',
    faq: [
      { question: 'What is a good Sharpe Ratio?', answer: 'Ratios above 1.0 are considered good, above 2.0 very good, and above 3.0 exceptional.' },
      { question: 'What is the risk-free rate of return?', answer: 'The return on risk-free government securities, typically US Treasury bills, since they are backed by the full faith of the government.' }
    ],
    relatedSlugs: ['portfolio-return-calculator', 'asset-growth-calculator'],
    calculate: (inputs) => {
      const ret = Number(inputs.return || 0);
      const rf = Number(inputs.rfRate || 0);
      const dev = Number(inputs.stdDev || 1);

      const ratio = dev > 0 ? (ret - rf) / dev : 0;

      return {
        results: [
          { label: 'Sharpe ratio metric', value: ratio.toFixed(2), isPrimary: true },
          { label: 'Excess Portfolio Yield', value: `${(ret - rf).toFixed(2)}%` },
          { label: 'Investment Yield Margin', value: `${ret.toFixed(1)}%` },
          { label: 'Relative Volatility', value: `${dev.toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Excess Return (%)', value: Math.max(0, Math.round(ret - rf)) },
          { name: 'Risk-Free Base (%)', value: Math.round(rf) }
        ]
      };
    }
  },
  {
    id: 'v14-asset-growth',
    name: 'Asset Growth Calculator',
    slug: 'asset-growth-calculator',
    category: 'finance',
    description: 'Track how an asset appreciates over time based on an annual growth rate and compounding cycles.',
    seoTitle: 'Asset Appreciation Compounding Growth Calculator',
    seoDescription: 'Project real asset values over years. Easily configure simple custom annual compound appreciate factors.',
    inputs: [
      { id: 'principal', label: 'Starting Asset Value ($)', type: 'number', defaultValue: 50000 },
      { id: 'appreciation', label: 'Annual Growth Rate (%)', type: 'number', defaultValue: 6.5 },
      { id: 'years', label: 'Holding Period (Years)', type: 'number', defaultValue: 20 },
      { id: 'compound', label: 'Compounding frequency', type: 'select', defaultValue: 'annual', options: [
        { label: 'Annual', value: 'annual' },
        { label: 'Semi-Annually', value: 'semiannual' },
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Monthly', value: 'monthly' }
      ]}
    ],
    formula: 'A = P * (1 + r/n)^(n*t)\nWhere n is compounding intervals per year.',
    explanation: 'Assets like real estate, collectibles, or index funds grow exponentially due to compounding growth. This calculator isolates that growth trajectory.',
    example: 'A $50,000 real estate purchase appreciating 6.5% annually compounded will grow in asset value to $176,183.67 after 20 years.',
    faq: [
      { question: 'Why does compound frequency matter?', answer: 'The more frequently interest is compounded, the higher your final balance. Compounding monthly generates slightly higher returns than compounding annually.' },
      { question: 'Does this account for taxable events?', answer: 'This represents gross appreciation. Realized gains are typically subject to capital gains taxes upon sale.' }
    ],
    relatedSlugs: ['portfolio-return-calculator', 'wealth-accumulation-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 50000);
      const annRate = Number(inputs.appreciation || 6.5) / 100;
      const yrs = Number(inputs.years || 20);
      const freq = String(inputs.compound || 'annual');

      let n = 1;
      if (freq === 'semiannual') n = 2;
      else if (freq === 'quarterly') n = 4;
      else if (freq === 'monthly') n = 12;

      const totalVal = p * Math.pow(1 + annRate / n, n * yrs);
      const gain = Math.max(0, totalVal - p);

      return {
        results: [
          { label: 'Appreciated Asset Value', value: `$${totalVal.toFixed(2)}`, isPrimary: true },
          { label: 'Absolute Capital Gain', value: `$${gain.toFixed(2)}` },
          { label: 'Total Growth Percentage', value: `${((gain / p) * 100).toFixed(1)}%` },
          { label: 'Growth Multiple Factor', value: `${(totalVal / p).toFixed(2)}x` }
        ],
        chartData: [
          { name: 'Initial Capital', value: Math.round(p) },
          { name: 'Appreciated Gain', value: Math.round(gain) }
        ]
      };
    }
  },
  {
    id: 'v14-wealth-accumulation',
    name: 'Wealth Accumulation Calculator',
    slug: 'wealth-accumulation-calculator',
    category: 'finance',
    description: 'Model real-life wealth accumulation and retirement nest eggs across multiple decades with dynamic savings cycles.',
    seoTitle: 'Decadal Wealth Accumulation Compounding Calculator',
    seoDescription: 'Obtain projected wealth trajectories over your working career. Enter monthly savings and watch savings compound.',
    inputs: [
      { id: 'starting', label: 'Starting Wealth Balance ($)', type: 'number', defaultValue: 15000 },
      { id: 'savings', label: 'Monthly Wealth Deposited ($)', type: 'number', defaultValue: 600 },
      { id: 'rate', label: 'Blended Compounding Rate (%)', type: 'number', defaultValue: 8.2 },
      { id: 'years', label: 'Accumulation Span (Years)', type: 'number', defaultValue: 30 }
    ],
    formula: 'Future Value = Starting * (1 + r)^n + Monthly * [ (1 + r)^n - 1 ] / r',
    explanation: 'Consistency outpaces market-timing. Setting aside regular monthly deposits builds substantial wealth long-term.',
    example: 'A $15,000 start with $600 monthly savings at 8.2% annual growth over 30 years accumulates a net portfolio value of $1,102,878.',
    faq: [
      { question: 'How is historical market growth typically measured?', answer: 'The S&P 500 stock index has returned approximately 10% annually over the last 100 years before inflation adjustment.' },
      { question: 'What is wealth accumulation velocity?', answer: 'The speed at which interest profits outpace out-of-pocket savings deposits, typically occurring around year 10-15 of consistent investing.' }
    ],
    relatedSlugs: ['investment-time-horizon-calculator', 'investment-goal-calculator'],
    calculate: (inputs) => {
      const init = Number(inputs.starting || 15000);
      const savings = Number(inputs.savings || 600);
      const annRate = Number(inputs.rate || 8.2) / 100;
      const yrs = Number(inputs.years || 30);

      const r = annRate / 12;
      const n = yrs * 12;

      let totalVal = init;
      if (r === 0) {
        totalVal = init + (savings * n);
      } else {
        totalVal = (init * Math.pow(1 + r, n)) + savings * (Math.pow(1 + r, n) - 1) / r;
      }

      const rawDeposits = init + (savings * n);
      const compoundingYield = Math.max(0, totalVal - rawDeposits);

      return {
        results: [
          { label: 'Accumulated Portfolio Balance', value: `$${totalVal.toFixed(2)}`, isPrimary: true },
          { label: 'Cumulative Deposits Made', value: `$${rawDeposits.toFixed(2)}` },
          { label: 'Earnings from Interest', value: `$${compoundingYield.toFixed(2)}` },
          { label: 'Compound Interest Ratio', value: `${((compoundingYield / totalVal) * 100).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Personal Cash Placed', value: Math.round(rawDeposits) },
          { name: 'Accumulated Compounding', value: Math.round(compoundingYield) }
        ]
      };
    }
  }
];
