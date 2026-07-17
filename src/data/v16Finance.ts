import { Calculator } from '../types';

export const V16_FINANCE_CALCULATORS: Calculator[] = [
  {
    id: 'tax-planning',
    name: 'Tax Planning Calculator',
    slug: 'tax-planning',
    category: 'finance',
    description: 'Optimize deductions, taxable brackets, and estimated tax credits to minimize overall liabilities.',
    formula: 'Taxable Income = Gross Income - Deductions; Net Tax = (Taxable Income * Rate) - Credits',
    explanation: 'Combines income slabs, standard/itemized deductions, and eligible tax credits to present your marginal bracket and calculate net legal tax obligations.',
    example: 'A gross income of $75,000 with $12,000 deductions and $1,000 credits results in $63,000 taxable income and an estimated progressive tax of ~$8,660.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Annual Income', type: 'number', defaultValue: 75000, min: 0, step: 1000, unit: '$' },
      { id: 'deductions', label: 'Allowable Deductions', type: 'number', defaultValue: 14600, min: 0, step: 100, unit: '$' },
      { id: 'credits', label: 'Eligible Tax Credits', type: 'number', defaultValue: 1000, min: 0, step: 100, unit: '$' }
    ],
    faq: [
      { question: 'What is the standard deduction?', answer: 'It is a fixed dollar amount that reduces your taxable income, based on filing status, age, and visual specifications.' },
      { question: 'How is a tax credit different from a tax deduction?', answer: 'Deductions lower your taxable income before the tax rate is applied, while tax credits reduce your actual calculated tax bill dollar-for-dollar.' }
    ],
    relatedSlugs: ['income-tax-estimator', 'savings-projection'],
    seoTitle: 'Tax Planning & Deduction Optimization Calculator',
    seoDescription: 'Calculate progressive federal tax obligations and maximize deduction savings with our advanced tax planner.',
    calculate: (inputs) => {
      const gross = Number(inputs.grossIncome || 0);
      const ded = Number(inputs.deductions || 0);
      const cred = Number(inputs.credits || 0);
      
      const taxable = Math.max(0, gross - ded);
      
      // Basic progresive structure simulation
      let tax = 0;
      let marginalRate = 0;
      if (taxable <= 11600) {
        tax = taxable * 0.10;
        marginalRate = 10;
      } else if (taxable <= 47150) {
        tax = 1160 + (taxable - 11600) * 0.12;
        marginalRate = 12;
      } else if (taxable <= 100525) {
        tax = 5426 + (taxable - 47150) * 0.22;
        marginalRate = 22;
      } else if (taxable <= 191950) {
        tax = 17168.5 + (taxable - 100525) * 0.24;
        marginalRate = 24;
      } else {
        tax = 39110.5 + (taxable - 191950) * 0.32;
        marginalRate = 32;
      }
      
      const netTax = Math.max(0, tax - cred);
      const effectiveRate = gross > 0 ? (netTax / gross) * 100 : 0;
      
      return {
        results: [
          { label: 'Taxable Income', value: Math.round(taxable), unit: '$', isPrimary: true },
          { label: 'Estimated Tax Liability', value: Math.round(netTax), unit: '$' },
          { label: 'Marginal Tax Rate', value: marginalRate, unit: '%' },
          { label: 'Effective Tax Rate', value: Number(effectiveRate.toFixed(2)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'income-tax-estimator',
    name: 'Income Tax Estimator',
    slug: 'income-tax-estimator',
    category: 'finance',
    description: 'Get a quick estimate of your take-home pay and tax brackets based on local filing status rules.',
    formula: 'Net Take Home = Gross Income - Federal Tax - Retirement Contributions',
    explanation: 'Subtracts progressive tax brackets and retirement withholdings from your annual gross to determine your estimated net monthly take-home salary.',
    example: 'An $80,000 salary with 6% pre-tax retirement contributing and standard single filing yields ~$5,000 in monthly net take-home.',
    inputs: [
      { id: 'gross', label: 'Gross Annual Salary', type: 'number', defaultValue: 80000, min: 0, unit: '$' },
      { id: 'filing', label: 'Filing Status', type: 'select', defaultValue: 'single', options: [
        { label: 'Single filer', value: 'single' },
        { label: 'Married filing jointly', value: 'married' }
      ]},
      { id: 'preTaxRetirement', label: 'Pre-Tax Retirement Contribution', type: 'number', defaultValue: 6, min: 0, max: 100, unit: '%' }
    ],
    faq: [
      { question: 'What does pre-tax mean?', answer: 'It refers to money set aside for plans like a 401(k) before income taxes are calculated, lowering your current taxable income.' },
      { question: 'Does this include state taxes?', answer: 'This is a progressive US Federal tax baseline estimator. State tax rules vary significantly and are not modeled here.' }
    ],
    relatedSlugs: ['tax-planning', 'savings-projection'],
    seoTitle: 'Take-Home Salary & Progressive Tax Bracket Estimator',
    seoDescription: 'Estimate your progressive tax bracket and net take-home salary with custom retirement projections.',
    calculate: (inputs) => {
      const gross = Number(inputs.gross || 0);
      const filing = String(inputs.filing || 'single');
      const retPct = Number(inputs.preTaxRetirement || 0);
      
      const retirementContrib = gross * (retPct / 100);
      const standardDeduction = filing === 'single' ? 14600 : 29200;
      const taxable = Math.max(0, gross - retirementContrib - standardDeduction);
      
      let tax = 0;
      if (filing === 'single') {
        if (taxable <= 11600) tax = taxable * 0.10;
        else if (taxable <= 47150) tax = 1160 + (taxable - 11600) * 0.12;
        else if (taxable <= 100525) tax = 5426 + (taxable - 47150) * 0.22;
        else tax = 17168.5 + (taxable - 100525) * 0.24;
      } else {
        if (taxable <= 23200) tax = taxable * 0.10;
        else if (taxable <= 94300) tax = 2320 + (taxable - 23200) * 0.12;
        else tax = 10852 + (taxable - 94300) * 0.22;
      }
      
      const netTakeHome = gross - retirementContrib - tax;
      const monthlyTakeHome = netTakeHome / 12;
      
      return {
        results: [
          { label: 'Annual Net Take-Home', value: Math.round(netTakeHome), unit: '$', isPrimary: true },
          { label: 'Monthly Take-Home Pay', value: Math.round(monthlyTakeHome), unit: '$' },
          { label: 'Retirement Contributed', value: Math.round(retirementContrib), unit: '$' },
          { label: 'Estimated Federal Tax', value: Math.round(tax), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'savings-projection',
    name: 'Savings Projection Calculator',
    slug: 'savings-projection',
    category: 'finance',
    description: 'Project future savings balances over various time horizons with monthly compounding intervals.',
    formula: 'A = P * (1 + r/n)^(n*t) + PMT * [((1 + r/n)^(n*t) - 1) / (r/n)]',
    explanation: 'Models monthly added capital with compound annual interest rates over structural year intervals.',
    example: 'Starting with $10,000 and contributing $500 monthly at 6% yield compounding monthly results in ~$163,800 in 15 years.',
    inputs: [
      { id: 'initial', label: 'Starting Capital', type: 'number', defaultValue: 10000, min: 0, unit: '$' },
      { id: 'monthly', label: 'Monthly Added Deposit', type: 'number', defaultValue: 500, min: 0, unit: '$' },
      { id: 'rate', label: 'Expected Annual Interest Rate', type: 'number', defaultValue: 6, min: 0, max: 30, step: 0.1, unit: '%' },
      { id: 'years', label: 'Savings Year Horizon', type: 'number', defaultValue: 15, min: 1, max: 60, unit: 'yrs' }
    ],
    faq: [
      { question: 'What is compound interest?', answer: 'Compounding is direct growth where interest earned begins generating its own interest in subsequent periods.' },
      { question: 'How frequent is the compounding modeled?', answer: 'This calculator applies monthly compounding, which matches standard retail bank certificates of deposit and savings models.' }
    ],
    relatedSlugs: ['wealth-growth', 'financial-goal'],
    seoTitle: 'Future Value compound Savings Projection Calculator',
    seoDescription: 'Calculate compound interest and monthly additions over decades with interactive timeline projections.',
    calculate: (inputs) => {
      const p = Number(inputs.initial || 0);
      const pmt = Number(inputs.monthly || 0);
      const r = Number(inputs.rate || 0) / 100;
      const t = Number(inputs.years || 0);
      const n = 12; // Monthly
      
      const totalMonths = t * n;
      const mr = r / n;
      
      let balance = p;
      let interestEarned = 0;
      let totalContrib = p;
      const chartData = [];
      
      for (let month = 1; month <= totalMonths; month++) {
        const interest = balance * mr;
        balance += interest + pmt;
        interestEarned += interest;
        totalContrib += pmt;
        
        if (month % 12 === 0) {
          chartData.push({
            year: month / 12,
            principal: totalContrib,
            interest: interestEarned,
            balance: balance
          });
        }
      }
      
      return {
        results: [
          { label: 'Projected End Balance', value: Math.round(balance), unit: '$', isPrimary: true },
          { label: 'Total Contributions', value: Math.round(totalContrib), unit: '$' },
          { label: 'Total Interest Earned', value: Math.round(interestEarned), unit: '$' }
        ],
        chartData
      };
    }
  },
  {
    id: 'wealth-growth',
    name: 'Wealth Growth Calculator',
    slug: 'wealth-growth',
    category: 'finance',
    description: 'Estimate real wealth horizons factoring in expected returns alongside structural inflation offsets.',
    formula: 'Real Return Rate = [(1 + Nominal Rate) / (1 + Inflation Rate)] - 1',
    explanation: 'Adjusts future capital valuations back to current buying power equivalents using adjustable index deflation rates.',
    example: 'Investing $50,000 plus $1,000/mo for 35 years at 8% returns with 2.5% inflation results in $2.4M nominal but $1.3M in buying power.',
    inputs: [
      { id: 'initialWealth', label: 'Current Invested Net Worth', type: 'number', defaultValue: 50000, min: 0, unit: '$' },
      { id: 'monthlyInvest', label: 'Monthly Investment Addition', type: 'number', defaultValue: 1000, min: 0, unit: '$' },
      { id: 'growthRate', label: 'Annual Expected Return', type: 'number', defaultValue: 8, min: 0, max: 25, step: 0.1, unit: '%' },
      { id: 'inflation', label: 'Expected Average Inflation', type: 'number', defaultValue: 2.5, min: 0, max: 15, step: 0.1, unit: '%' },
      { id: 'years', label: 'Growth Horizon Years', type: 'number', defaultValue: 30, min: 1, max: 60, unit: 'yrs' }
    ],
    faq: [
      { question: 'Why does inflation level tracking matter?', answer: 'Inflation regularly dilutes future cash purchasing capability. Calculating the "real" rate shows how much your bundle of assets actually commands later.' },
      { question: 'Can returns be modeled dynamically?', answer: 'This applies static compounding. Real equity markets vary year to year, but historical projections rely on these reliable CAGR baselines.' }
    ],
    relatedSlugs: ['savings-projection', 'financial-goal'],
    seoTitle: 'Nominal vs Real Wealth Growth Inflation-Adjusted Calculator',
    seoDescription: 'Estimate your future compounding wealth index value in both nominal cash and inflation-adjusted buying power.',
    calculate: (inputs) => {
      const p = Number(inputs.initialWealth || 0);
      const pmt = Number(inputs.monthlyInvest || 0);
      const returnRate = Number(inputs.growthRate || 0) / 100;
      const inflationRate = Number(inputs.inflation || 0) / 100;
      const years = Number(inputs.years || 0);
      
      const realRate = ((1 + returnRate) / (1 + inflationRate)) - 1;
      
      let balanceNominal = p;
      let balanceReal = p;
      
      for (let m = 1; m <= years * 12; m++) {
        balanceNominal = balanceNominal * (1 + returnRate / 12) + pmt;
        balanceReal = balanceReal * (1 + realRate / 12) + pmt;
      }
      
      return {
        results: [
          { label: 'Nominal Future Value', value: Math.round(balanceNominal), unit: '$', isPrimary: true },
          { label: 'Inflation-Adjusted Real Value', value: Math.round(balanceReal), unit: '$' },
          { label: 'Nominal Gain Output', value: Math.round(balanceNominal - p - (pmt * years * 12)), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'financial-goal',
    name: 'Financial Goal Calculator',
    slug: 'financial-goal',
    category: 'finance',
    description: 'Calculate the precise monthly deposit needed to reach a targeted total cash pile by a deadline.',
    formula: 'Monthly Contribution = [Target - Initial * (1+r)^t] / [((1+r)^t - 1) / r]',
    explanation: 'Back-calculates compounding intervals to supply the exact consistent monthly dollar savings threshold required.',
    example: 'To reach a $100,000 goal in 5 years starting with $15,000 at 7% investment returns, you need to save $1,059 every month.',
    inputs: [
      { id: 'target', label: 'Desired Goal Target Amount', type: 'number', defaultValue: 100000, min: 1, unit: '$' },
      { id: 'years', label: 'Timeline in Years', type: 'number', defaultValue: 5, min: 1, max: 40, unit: 'yrs' },
      { id: 'initial', label: 'Already Accumulated Capital', type: 'number', defaultValue: 15000, min: 0, unit: '$' },
      { id: 'annualRate', label: 'Expected Annual Growth', type: 'number', defaultValue: 7, min: 0, max: 30, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'What if my actual returns vary?', answer: 'Lower returns mean you will fall short of the goal unless you slightly elevate monthly deposits. Monitor progress quarterly.' },
      { question: 'Is this tax-adjusted?', answer: 'This represents capital growth. Tax rules under custom investment brackets depend on specific local accounts.' }
    ],
    relatedSlugs: ['savings-projection', 'money-timeline'],
    seoTitle: 'Target Savings financial Goal Plan Calculator',
    seoDescription: 'Find out the exact dollar amount you must save weekly or monthly to achieve your long-term target.',
    calculate: (inputs) => {
      const target = Number(inputs.target || 0);
      const years = Number(inputs.years || 0);
      const initial = Number(inputs.initial || 0);
      const rate = Number(inputs.annualRate || 0) / 100;
      
      const totalMonths = years * 12;
      const mr = rate / 12;
      
      const futureValueOfInitial = initial * Math.pow(1 + mr, totalMonths);
      const remainingTarget = Math.max(0, target - futureValueOfInitial);
      
      let monthlyRate = 0;
      if (mr > 0) {
        monthlyRate = remainingTarget / ((Math.pow(1 + mr, totalMonths) - 1) / mr);
      } else {
        monthlyRate = remainingTarget / totalMonths;
      }
      
      const weeklyDeposit = monthlyRate * 12 / 52;
      
      return {
        results: [
          { label: 'Required Monthly Savings', value: Math.round(monthlyRate), unit: '$', isPrimary: true },
          { label: 'Required Weekly Savings', value: Math.round(weeklyDeposit), unit: '$' },
          { label: 'Shortfall Target to Earn', value: Math.round(remainingTarget), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'money-timeline',
    name: 'Money Timeline Calculator',
    slug: 'money-timeline',
    category: 'finance',
    description: 'Determine how long a fixed lump sum lasts under active regular periodic withdrawals.',
    formula: 't = ln[PMT / (PMT - PV * r)] / ln[1 + r]',
    explanation: 'Solves the reverse amortization formula to find the exact horizon point when capital reserves fall to zero.',
    example: 'Starting with $20,000 and drawing $2,000 monthly, with capital growing at 5% APR, lasts for exactly 10.4 months.',
    inputs: [
      { id: 'balance', label: 'Starting Capital Pool', type: 'number', defaultValue: 20000, min: 1, unit: '$' },
      { id: 'withdrawal', label: 'Monthly Withdrawal Amount', type: 'number', defaultValue: 2000, min: 1, unit: '$' },
      { id: 'yieldRate', label: 'Annual Investment Growth %', type: 'number', defaultValue: 5, min: 0, max: 25, unit: '%' }
    ],
    faq: [
      { question: 'What if withdrawal amounts grow with inflation?', answer: 'If we increase cash drawing targets to meet price levels, depletion occurs significantly faster than modeled here.' },
      { question: 'What is the safe withdrawal rate threshold?', answer: 'If monthly growth rate yields exceed the drawing percentage, the corpus theoretically lasts indefinitely.' }
    ],
    relatedSlugs: ['financial-goal', 'net-worth-projection'],
    seoTitle: 'Wealth Drawdown & Depletion Timeline Calculator',
    seoDescription: 'Find out exactly how many years and months a retirement fund or savings cash pile serves under regular outflows.',
    calculate: (inputs) => {
      const p = Number(inputs.balance || 0);
      const w = Number(inputs.withdrawal || 0);
      const r = (Number(inputs.yieldRate || 0) / 100) / 12;
      
      if (w <= p * r) {
        return {
          results: [
            { label: 'Reserve Depletion Horizon', value: 'Infinite (Grows Forever)', unit: '', isPrimary: true },
            { label: 'Estimated Monthly Yield Earned', value: Math.round(p * r), unit: '$' }
          ]
        };
      }
      
      let months = 0;
      let temp = p;
      while (temp > 0 && months < 1200) { // Limit to 100 years
        temp = temp * (1 + r) - w;
        months++;
      }
      
      const years = Math.floor(months / 12);
      const remainingMonths = months % 12;
      const outputText = years > 0 ? `${years} years, ${remainingMonths} months` : `${months} months`;
      
      return {
        results: [
          { label: 'Reserve Depletion Horizon', value: outputText, unit: '', isPrimary: true },
          { label: 'Total Withdrawals Count', value: months, unit: 'payments' },
          { label: 'Total Value Distributed', value: Math.round(months * w), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'cash-flow-forecast',
    name: 'Cash Flow Forecast Calculator',
    slug: 'cash-flow-forecast',
    category: 'finance',
    description: 'Forecast monthly net cash positions over a 12-month trailing horizon with compound growth.',
    formula: 'Next Cash Position = Previous Cash + Inflows * (1 + g_in) - Outflows * (1 + g_out)',
    explanation: 'Models monthly revenue expansions against escalating expenditures over a systematic annual timeline.',
    example: 'Starting with $10,000 with monthly inflows of $6,000 expanding at 3%/yr and outflows of $4,500 expanding at 2%/yr accumulates ~$30,000 in reserves.',
    inputs: [
      { id: 'startupCash', label: 'Starting Cash Reserve', type: 'number', defaultValue: 10000, min: 0, unit: '$' },
      { id: 'inflows', label: 'Inflow Amount (Monthly)', type: 'number', defaultValue: 6000, min: 0, unit: '$' },
      { id: 'outflows', label: 'Outflow Amount (Monthly)', type: 'number', defaultValue: 4500, min: 0, unit: '$' },
      { id: 'inflowGrowth', label: 'Annual Inflow Trend Growth', type: 'number', defaultValue: 3, min: -20, max: 50, step: 0.1, unit: '%' },
      { id: 'outflowGrowth', label: 'Annual Outflow Trend Growth', type: 'number', defaultValue: 2, min: -20, max: 50, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'Why is cash flow tracking vital?', answer: 'A business can be profitable on paper but still run out of physical cash if invoicing delays clash with standard utility timelines.' }
    ],
    relatedSlugs: ['expense-forecast', 'spending-trend'],
    seoTitle: 'Professional Annual Cash Flow Forecasting Calculator',
    seoDescription: 'Forecast monthly working capital positions and cash surpluses over an interactive 12-month calendar.',
    calculate: (inputs) => {
      const reserve = Number(inputs.startupCash || 0);
      const inf = Number(inputs.inflows || 0);
      const outf = Number(inputs.outflows || 0);
      const ig = Number(inputs.inflowGrowth || 0) / 100 / 12;
      const og = Number(inputs.outflowGrowth || 0) / 100 / 12;
      
      let currentReserves = reserve;
      let totalSurplus = 0;
      
      for (let m = 1; m <= 12; m++) {
        const stepInflow = inf * Math.pow(1 + ig, m);
        const stepOutflow = outf * Math.pow(1 + og, m);
        const netMonth = stepInflow - stepOutflow;
        currentReserves += netMonth;
        totalSurplus += netMonth;
      }
      
      return {
        results: [
          { label: 'Reserve Balances at Year End', value: Math.round(currentReserves), unit: '$', isPrimary: true },
          { label: 'Cumulative Net cash Surplus', value: Math.round(totalSurplus), unit: '$' },
          { label: 'Average Monthly Operating Margin', value: Number(((inf - outf) / (inf || 1) * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'expense-forecast',
    name: 'Expense Forecast Calculator',
    slug: 'expense-forecast',
    category: 'finance',
    description: 'Project inflation-linked household or corporate expenses across detailed future year intervals.',
    formula: 'Future Expense = Base Expense * (1 + Inflation)^Years',
    explanation: 'Scales key expense sectors by average historical cost escalations to predict your future budget requirements.',
    example: 'A $3,300 monthly core expense index with a 3% inflation rate rises to $3,825/mo in 5 years.',
    inputs: [
      { id: 'housing', label: 'Monthly Housing Costs', type: 'number', defaultValue: 1500, min: 0, unit: '$' },
      { id: 'food', label: 'Monthly Food & Groceries', type: 'number', defaultValue: 600, min: 0, unit: '$' },
      { id: 'utilities', label: 'Monthly Utilities & Internet', type: 'number', defaultValue: 300, min: 0, unit: '$' },
      { id: 'other', label: 'Other Discretionary Outlays', type: 'number', defaultValue: 900, min: 0, unit: '$' },
      { id: 'horizon', label: 'Projection Years', type: 'number', defaultValue: 5, min: 1, max: 25, unit: 'yrs' },
      { id: 'inflation', label: 'Assumed Annual Inflation', type: 'number', defaultValue: 3, min: 0, max: 15, step: 0.1, unit: '%' }
    ],
    faq: [
      { question: 'What can I do to offset rising expenses?', answer: 'Focus on scaling income yields, investing in inflation-hedged assets, or periodically audit subscriptions and utilities.' }
    ],
    relatedSlugs: ['cash-flow-forecast', 'spending-trend'],
    seoTitle: 'Future Cost & Expense Inflation forecast Calculator',
    seoDescription: 'Forecast monthly budget requirements by core expense categories to hedge against historical inflation trends.',
    calculate: (inputs) => {
      const house = Number(inputs.housing || 0);
      const food = Number(inputs.food || 0);
      const util = Number(inputs.utilities || 0);
      const oth = Number(inputs.other || 0);
      const yrs = Number(inputs.horizon || 0);
      const inf = Number(inputs.inflation || 0) / 100;
      
      const currentMonthlyTotal = house + food + util + oth;
      const futureMonthlyTotal = currentMonthlyTotal * Math.pow(1 + inf, yrs);
      
      return {
        results: [
          { label: 'Forecasted Monthly Cost', value: Math.round(futureMonthlyTotal), unit: '$', isPrimary: true },
          { label: 'Current Base Monthly Cost', value: currentMonthlyTotal, unit: '$' },
          { label: 'Total Annual Outlay Difference', value: Math.round((futureMonthlyTotal - currentMonthlyTotal) * 12), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'spending-trend',
    name: 'Spending Trend Calculator',
    slug: 'spending-trend',
    category: 'finance',
    description: 'Track week-over-week spending metrics to visualize budget variance and predict end-of-month trajectories.',
    formula: 'Projected Spend = (Sum of Spent Days / Active Days) * 30',
    explanation: 'Collates sequential spending inputs to determine whether you will finish above or safely under your parameters.',
    example: 'With a $4,000 budget and spending totaling $3,900 over 4 weeks, your average daily spend profile stays under threshold.',
    inputs: [
      { id: 'budget', label: 'Monthly Spending Ceiling', type: 'number', defaultValue: 4000, min: 1, unit: '$' },
      { id: 'w1', label: 'Week 1 Spent', type: 'number', defaultValue: 900, min: 0, unit: '$' },
      { id: 'w2', label: 'Week 2 Spent', type: 'number', defaultValue: 1100, min: 0, unit: '$' },
      { id: 'w3', label: 'Week 3 Spent', type: 'number', defaultValue: 850, min: 0, unit: '$' },
      { id: 'w4', label: 'Week 4 Spent', type: 'number', defaultValue: 1050, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is budget variance?', answer: 'The difference between your designated spending target and your actual spending. positive variation implies saved cash.' }
    ],
    relatedSlugs: ['expense-forecast', 'cash-flow-forecast'],
    seoTitle: 'Weekly Spending Trend & Budget Variance Calculator',
    seoDescription: 'Monitor standard budget variances and predict final monthly spending based on actual weekly records.',
    calculate: (inputs) => {
      const budget = Number(inputs.budget || 0);
      const w1 = Number(inputs.w1 || 0);
      const w2 = Number(inputs.w2 || 0);
      const w3 = Number(inputs.w3 || 0);
      const w4 = Number(inputs.w4 || 0);
      
      const totalSpent = w1 + w2 + w3 + w4;
      const variance = budget - totalSpent;
      const dailyAverage = totalSpent / 28;
      
      return {
        results: [
          { label: 'Actual Monthly Expense', value: totalSpent, unit: '$', isPrimary: true },
          { label: 'Budget Variance Margin', value: variance, unit: '$' },
          { label: 'Average Daily Cost', value: Math.round(dailyAverage), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'net-worth-projection',
    name: 'Net Worth Projection Calculator',
    slug: 'net-worth-projection',
    category: 'finance',
    description: 'Simulate progressive asset growth alongside systematic debt paydown structures over long durations.',
    formula: 'Future Net Worth = Asset_0(1+r)^t + Sum(Debt_0 - Paydown * t)',
    explanation: 'Integrates compound asset growth and static principal repayments to track your net worth evolution over time.',
    example: 'Starting with $250,000 in assets yielding 6% growth combined with $120,000 liabilities paid down at $10,000/yr yields over ~$347,000 net worth expansion over 10 years.',
    inputs: [
      { id: 'currentAssets', label: 'Present Assets Value', type: 'number', defaultValue: 250000, min: 0, unit: '$' },
      { id: 'currentLiabilities', label: 'Present Outstanding Debts', type: 'number', defaultValue: 120000, min: 0, unit: '$' },
      { id: 'assetGrowth', label: 'Assumed Asset CAGR Rate', type: 'number', defaultValue: 6, min: 0, max: 25, unit: '%' },
      { id: 'annualDebtPayment', label: 'Annual Combined Debt Paydown', type: 'number', defaultValue: 10000, min: 0, unit: '$' },
      { id: 'projectionYears', label: 'Timeline of Forecast', type: 'number', defaultValue: 10, min: 1, max: 40, unit: 'yrs' }
    ],
    faq: [
      { question: 'Should my primary home balance be counted?', answer: 'Yes, both residential real estate market values and outstanding mortgage balances count under your asset-liability spectrum.' }
    ],
    relatedSlugs: ['wealth-growth', 'money-timeline'],
    seoTitle: 'Future Net Worth compound Projection Calculator',
    seoDescription: 'Simulate asset compounding trends against long-term liability reductions to see your net wealth trajectory.',
    calculate: (inputs) => {
      const a = Number(inputs.currentAssets || 0);
      const l = Number(inputs.currentLiabilities || 0);
      const r = Number(inputs.assetGrowth || 0) / 100;
      const paydown = Number(inputs.annualDebtPayment || 0);
      const yrs = Number(inputs.projectionYears || 0);
      
      const futureAssets = a * Math.pow(1 + r, yrs);
      const futureLiabilities = Math.max(0, l - (paydown * yrs));
      const startingNetWorth = a - l;
      const futureNetWorth = futureAssets - futureLiabilities;
      
      return {
        results: [
          { label: 'Projected Net Worth', value: Math.round(futureNetWorth), unit: '$', isPrimary: true },
          { label: 'Starting Net Worth Baseline', value: startingNetWorth, unit: '$' },
          { label: 'Forecasted Total Assets', value: Math.round(futureAssets), unit: '$' },
          { label: 'Forecasted Total Debts', value: Math.round(futureLiabilities), unit: '$' }
        ]
      };
    }
  }
];
