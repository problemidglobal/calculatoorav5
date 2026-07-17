import { Calculator } from '../types';

export const PERSONAL_FINANCE_CALCULATORS: Calculator[] = [
  {
    id: 'budget-calculator',
    name: 'Budget Calculator',
    slug: 'budget-calculator',
    category: 'finance',
    description: 'Structure annual or monthly income using the popular 50/30/20 budget framework.',
    seoTitle: '50/30/20 Budgeting Rule Calculator | Calculatoora',
    seoDescription: 'Input post-tax income to obtain exact allocations for essential needs, discretionary wants, and savings goals.',
    inputs: [
      { id: 'income', label: 'Post-Tax Net Income Monthly', type: 'number', defaultValue: 5000, step: 100, unit: '$' }
    ],
    formula: 'Needs = 50% * Income\nWants = 30% * Income\nSavings & Debt = 20% * Income',
    explanation: 'The 50/30/20 budgeting rule balances basic shelter/food needs with personal lifestyle wishes, reserving 20% to build security or eliminate debts.',
    example: 'For a $5,000 monthly take-home income, allocate $2,500 for Needs, $1,500 for Wants, and $1,000 for Savings.',
    faq: [
      { question: 'What falls under Needs?', answer: 'Rent, mortgage, groceries, health insurance, essential utilities, and minimum debt payments count as Needs.' },
      { question: 'What falls under wants?', answer: 'Dining out, vacation funds, premium streaming subscriptions, and luxury items fall under Wants.' }
    ],
    relatedSlugs: ['monthly-budget-calculator', 'expense-calculator', 'net-worth-calculator'],
    calculate: (inputs) => {
      const inc = Number(inputs.income) || 0;
      const needs = inc * 0.50;
      const wants = inc * 0.30;
      const savings = inc * 0.20;

      return {
        results: [
          { label: 'Take-home Income', value: inc.toFixed(2), unit: '$' },
          { label: 'Essential Needs (50% rule)', value: needs.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Discretionary Wants (30% rule)', value: wants.toFixed(2), unit: '$' },
          { label: 'Savings & Debt Payoff (20%)', value: savings.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Needs (Rent, Food)', value: Math.round(needs), color: '#ef4444' },
          { name: 'Wants (Leisure, Gear)', value: Math.round(wants), color: '#3b82f6' },
          { name: 'Savings & Investing', value: Math.round(savings), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'monthly-budget-calculator',
    name: 'Monthly Budget Calculator',
    slug: 'monthly-budget-calculator',
    category: 'finance',
    description: 'Detailed monthly budget calculator tracking rent, groceries, leisure, auto expenses, and debt outflows side-by-side.',
    seoTitle: 'Detailed Monthly Budget & Expense Planner | Calculatoora',
    seoDescription: 'A dynamic modular budgeting tool to catalog fixed housing costs, utilities, transport, food and savings deficits.',
    inputs: [
      { id: 'income', label: 'Monthly Post-Tax Income', type: 'number', defaultValue: 4500, step: 100, unit: '$' },
      { id: 'housing', label: 'Rent / Mortgage payment', type: 'number', defaultValue: 1400, step: 50, unit: '$' },
      { id: 'groceries', label: 'Groceries & Foods', type: 'number', defaultValue: 450, step: 10, unit: '$' },
      { id: 'utilities', label: 'Utilities & Phone Plans', type: 'number', defaultValue: 250, step: 10, unit: '$' },
      { id: 'transport', label: 'Car Loan & Gasoline', type: 'number', defaultValue: 400, step: 10, unit: '$' },
      { id: 'leisure', label: 'Subscriptions & Leisure', type: 'number', defaultValue: 300, step: 10, unit: '$' }
    ],
    formula: 'Remaining Cash = Income - Sum of All Expenses',
    explanation: 'A fully specified budget ensures that you live below your means and identifies leakages in discretionary spending categories.',
    example: 'For a $4,500 income and configured expenses totaling $3,100, you retain a $1,400 surplus for investments or debt snowflake additions.',
    faq: [
      { question: 'What is a zero-based budget?', answer: 'A budgeting method where every single dollar of income is assigned to a specific category (including savings) so the net remaining balance equals zero.' }
    ],
    relatedSlugs: ['budget-calculator', 'expense-calculator', 'emergency-fund-calculator'],
    calculate: (inputs) => {
      const inc = Number(inputs.income) || 0;
      const h = Number(inputs.housing) || 0;
      const g = Number(inputs.groceries) || 0;
      const u = Number(inputs.utilities) || 0;
      const t = Number(inputs.transport) || 0;
      const l = Number(inputs.leisure) || 0;

      const totalExp = h + g + u + t + l;
      const leftover = inc - totalExp;

      return {
        results: [
          { label: 'Unallocated Cash Surplus', value: leftover.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Monthly Outflows', value: totalExp.toFixed(2), unit: '$' },
          { label: 'Housing Cost Ratio', value: inc > 0 ? ((h / inc) * 100).toFixed(1) : 0, unit: '%' },
          { label: 'Savings Potential Rate', value: inc > 0 ? ((leftover / inc) * 100).toFixed(1) : 0, unit: '%' }
        ],
        chartData: [
          { name: 'Leftover Surplus', value: Math.max(0, leftover), color: '#39FF14' },
          { name: 'Rent & Housing', value: h, color: '#ef4444' },
          { name: 'Daily Goods & Food', value: g, color: '#f59e0b' },
          { name: 'Utilities/Car/Fun', value: u + t + l, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'expense-calculator',
    name: 'Expense Calculator',
    slug: 'expense-calculator',
    category: 'finance',
    description: 'Convert daily or weekly micropayments into true annual compound drains on cash flows.',
    seoTitle: 'Recurring Expense Drain Calculator | Calculatoora',
    seoDescription: 'Analyze how small subscriptions, habits, or daily coffee runs aggregate into huge annual costs.',
    inputs: [
      { id: 'cost', label: 'Item cost amount', type: 'number', defaultValue: 6.5, step: 0.5, unit: '$' },
      { id: 'frequency', label: 'Purchase Frequency', type: 'select', defaultValue: 30, options: [
        { label: 'Every Day', value: 365 },
        { label: 'Twice a week', value: 104 },
        { label: 'Once a week', value: 52 },
        { label: 'Once a month', value: 12 }
      ]}
    ],
    formula: 'Annual Outlay = Cost * Yearly Frequency',
    explanation: 'Many small habits (such as subscriptions or daily snacks) feel negligible, but calculating their multi-year compound sum assists in long-term financial sobriety.',
    example: 'Buying a $6.50 specialty coffee every day accumulates to $2,372.50 in a year, which could grow to $13,607.00 if invested at 8% compound interest for 5 years.',
    faq: [
      { question: 'What is opportunity cost?', answer: 'The forgone benefit of choosing one option over another. For instance, coffee money spent cannot earn stock market dividends.' }
    ],
    relatedSlugs: ['budget-calculator', 'monthly-budget-calculator', 'savings-goal-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const freq = Number(inputs.frequency) || 30;

      const annual = cost * freq;
      const monthly = annual / 12;
      
      // Projecting compounding if invested at 8%
      let compound10Y = 0;
      const monthlySavings = annual / 12;
      const r = 0.08 / 12;
      for (let i = 0; i < 120; i++) {
        compound10Y = (compound10Y + monthlySavings) * (1 + r);
      }

      return {
        results: [
          { label: 'Annual Total Expense Drain', value: annual.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Average Monthly Cost Impact', value: monthly.toFixed(2), unit: '$' },
          { label: '10-year Invested Value Opportunity', value: compound10Y.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Yearly Expense Drain', value: Math.round(annual), color: '#ef4444' },
          { name: 'Hypothetical Investment Growth Opportunity', value: Math.round(compound10Y / 10), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'net-worth-calculator',
    name: 'Net Worth Calculator',
    slug: 'net-worth-calculator',
    category: 'finance',
    description: 'Calculate net personal wealth by balancing accumulated financial assets against outstanding debt liabilities.',
    seoTitle: 'Personal Net Worth Statement Calculator | Calculatoora',
    seoDescription: 'Balance assets (cash, equities, home equity) against debts (loans, card balances). Project your true balance sheet.',
    inputs: [
      { id: 'cash', label: 'Cash & Checking Deposits', type: 'number', defaultValue: 12000, step: 500, unit: '$' },
      { id: 'stocks', label: 'Investment Portfolio Value', type: 'number', defaultValue: 55000, step: 1000, unit: '$' },
      { id: 'home', label: 'Home / Real Estate Value', type: 'number', defaultValue: 320000, step: 2000, unit: '$' },
      { id: 'auto', label: 'Car Valuation', type: 'number', defaultValue: 18000, step: 500, unit: '$' },
      { id: 'mortgage', label: 'Mortgage Loan Outstanding', type: 'number', defaultValue: 240000, step: 2000, unit: '$' },
      { id: 'student', label: 'Student & Personal Loans Debt', type: 'number', defaultValue: 15000, step: 500, unit: '$' }
    ],
    formula: 'Net Worth = Sum of Assets - Sum of Liabilities',
    explanation: 'A net worth calculator serves as a high-level scorecard of your holistic financial condition. Solid asset additions build wealth, while borrowing structures expand liabilities.',
    example: 'Having assets worth $405,000 (home, stock, vehicle, checkings) combined with liabilities of $255,000 (mortgages, college balance) makes your net worth $150,000.',
    faq: [
      { question: 'Should I list highly depreciating assets?', answer: 'Generally, exclude items like electronics, furniture, or clothes. Cars can be listed at their current blue book value.' }
    ],
    relatedSlugs: ['portfolio-calculator', 'debt-calculator', 'financial-independence-calculator'],
    calculate: (inputs) => {
      const cashVal = Number(inputs.cash) || 0;
      const stocksVal = Number(inputs.stocks) || 0;
      const homeVal = Number(inputs.home) || 0;
      const autoVal = Number(inputs.auto) || 0;
      
      const mortgageVal = Number(inputs.mortgage) || 0;
      const studentVal = Number(inputs.student) || 0;

      const assets = cashVal + stocksVal + homeVal + autoVal;
      const liabilities = mortgageVal + studentVal;
      const netWorth = assets - liabilities;

      return {
        results: [
          { label: 'Current Net Worth', value: netWorth.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Aggregated Assets', value: assets.toFixed(2), unit: '$' },
          { label: 'Total Accumulated Liabilities', value: liabilities.toFixed(2), unit: '$' },
          { label: 'Debt-to-Asset Ratio', value: assets > 0 ? ((liabilities / assets) * 100).toFixed(1) : 0, unit: '%' }
        ],
        chartData: [
          { name: 'Assets Portfolio', value: assets, color: '#39FF14' },
          { name: 'Liabilities Stack', value: liabilities, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'debt-calculator',
    name: 'Debt Calculator',
    slug: 'debt-calculator',
    category: 'finance',
    description: 'Analyse multiple loan obligations to find average rates and total structural debt burdens.',
    seoTitle: 'Total Outstanding Debt Burden Calculator | Calculatoora',
    seoDescription: 'Obtain integrated metrics about your loan liabilities. View average rates and prepare amortization strategies.',
    inputs: [
      { id: 'card', label: 'Credit Card Balance', type: 'number', defaultValue: 3500, step: 100, unit: '$' },
      { id: 'cardRate', label: 'Credit Card APR', type: 'number', defaultValue: 19.9, step: 0.1, unit: '%' },
      { id: 'car', label: 'Car Loan Balance', type: 'number', defaultValue: 12000, step: 500, unit: '$' },
      { id: 'carRate', label: 'Car Loan APR', type: 'number', defaultValue: 4.5, step: 0.1, unit: '%' }
    ],
    formula: 'Weighted Interest Rate = Sum(Debt_i * Rate_i) / Total Debt',
    explanation: 'Combines credit accounts into single interfaces, helping users isolate how fast high-interest lines accumulate costs.',
    example: 'With $3,500 credit card debt at 19.9% and $12,000 auto financing at 4.5%, your average weighted interest rate is 7.98% across a total debt pool of $15,500.',
    faq: [
      { question: 'What is a weighted interest rate?', answer: 'It is an average that weights each interest rate by the corresponding size of the debt balance, reflecting the true cost of your overall debt portfolio.' }
    ],
    relatedSlugs: ['debt-snowball-calculator', 'debt-avalanche-calculator', 'net-worth-calculator'],
    calculate: (inputs) => {
      const d1 = Number(inputs.card) || 0;
      const r1 = Number(inputs.cardRate) || 0;
      const d2 = Number(inputs.car) || 0;
      const r2 = Number(inputs.carRate) || 0;

      const total = d1 + d2;
      const weightedRate = total > 0 ? ((d1 * r1) + (d2 * r2)) / total : 0;
      const annualCost = (d1 * (r1 / 100)) + (d2 * (r2 / 100));

      return {
        results: [
          { label: 'Total Consolidated Debt Balance', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Weighted Average APR', value: weightedRate.toFixed(2), unit: '%' },
          { label: 'Est. Annual Interest Charge', value: annualCost.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Credit Cards Debt', value: d1, color: '#ef4444' },
          { name: 'Auto Financing Liabilities', value: d2, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'debt-snowball-calculator',
    name: 'Debt Snowball Calculator',
    slug: 'debt-snowball-calculator',
    category: 'finance',
    description: 'Accelerate debt payoff by paying down accounts smallest to largest, creating quick psychological wins.',
    seoTitle: 'Debt Snowball Method Payoff Calculator | Calculatoora',
    seoDescription: 'Obtain precise repayment paths for multiple credit lines using Dave Ramsey is Snowball Method.',
    inputs: [
      { id: 'debtSmall', label: 'Smallest Debt Balance', type: 'number', defaultValue: 1200, step: 100, unit: '$' },
      { id: 'rateSmall', label: 'Smallest Debt APR', type: 'number', defaultValue: 18.0, step: 0.1, unit: '%' },
      { id: 'debtLarge', label: 'Largest Debt Balance', type: 'number', defaultValue: 8000, step: 200, unit: '$' },
      { id: 'rateLarge', label: 'Largest Debt APR', type: 'number', defaultValue: 6.0, step: 0.1, unit: '%' },
      { id: 'extra', label: 'Extra Paydown Cash Monthly', type: 'number', defaultValue: 200, step: 10, unit: '$' }
    ],
    formula: 'All extra liquidity is directed exclusively to the smallest balance first, regardless of APR variations.',
    explanation: 'The Debt Snowball method focuses on behavior modulations: closing out small credit accounts quickly delivers psychological dopamine, maintaining your motivation for larger debts.',
    example: 'Paying $200 extra monthly under the Snowball sequence settles the $1,200 account first inside a few months, and then rolls all funds over to settle your larger $8,000 balance.',
    faq: [
      { question: 'Who developed the Debt Snowball?', answer: 'The concept was popularized by wealth educator Dave Ramsey as a primary behavioral framework for getting out of debt.' }
    ],
    relatedSlugs: ['debt-avalanche-calculator', 'debt-calculator', 'loan-payoff-calculator'],
    calculate: (inputs) => {
      const dS = Number(inputs.debtSmall) || 0;
      const rS = Number(inputs.rateSmall) || 0;
      const dL = Number(inputs.debtLarge) || 0;
      const rL = Number(inputs.rateLarge) || 0;
      const extra = Number(inputs.extra) || 0;

      // Simple modeling of paydown
      const totalBalance = dS + dL;
      const r_S = rS / 100 / 12;
      const r_L = rL / 100 / 12;

      let monthsS = 0;
      let balanceS = dS;
      let interestS = 0;
      // Small payment includes extra cash
      while (balanceS > 0 && monthsS < 240) {
        monthsS++;
        const interest = balanceS * r_S;
        interestS += interest;
        const paid = Math.min(balanceS, 100 + extra - interest);
        balanceS -= paid;
        if (balanceS <= 0) break;
      }

      let monthsL = 0;
      let balanceL = dL;
      let interestL = 0;
      // Large payment gets extra only after small sits zero
      while (balanceL > 0 && monthsL < 240) {
        monthsL++;
        const currentExtra = monthsL > monthsS ? extra : 0;
        const interest = balanceL * r_L;
        interestL += interest;
        const paid = Math.min(balanceL, 200 + currentExtra - interest);
        balanceL -= paid;
        if (balanceL <= 0) break;
      }

      const totalMonths = Math.max(monthsS, monthsL);
      const totalInt = interestS + interestL;

      return {
        results: [
          { label: 'Time to Full Debt Liberation', value: totalMonths, unit: 'months', isPrimary: true },
          { label: 'Settle Smallest Debt in', value: monthsS, unit: 'months' },
          { label: 'Cumulative Interest Paid', value: totalInt.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Debt Pool', value: totalBalance, color: '#ef4444' },
          { name: 'Total Interest Charge', value: Math.round(totalInt), color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'debt-avalanche-calculator',
    name: 'Debt Avalanche Calculator',
    slug: 'debt-avalanche-calculator',
    category: 'finance',
    description: 'Systematically wipe out multiple debts by prioritizing accounts with the highest interest rates, saving the maximum amount of cash.',
    seoTitle: 'Debt Avalanche Interest Minimizer Calculator | Calculatoora',
    seoDescription: 'Solve mathematically optimal repayment programs. Focus extra payments on highest APR debts first.',
    inputs: [
      { id: 'highRateDebt', label: 'Highest APR Debt Balance', type: 'number', defaultValue: 3000, step: 100, unit: '$' },
      { id: 'rateHigh', label: 'Highest Debt Rate (APR)', type: 'number', defaultValue: 21.0, step: 0.1, unit: '%' },
      { id: 'lowRateDebt', label: 'Lower APR Debt Balance', type: 'number', defaultValue: 6000, step: 200, unit: '$' },
      { id: 'rateLow', label: 'Lower Debt Rate (APR)', type: 'number', defaultValue: 5.0, step: 0.1, unit: '%' },
      { id: 'extra', label: 'Extra Payment Monthly', type: 'number', defaultValue: 250, step: 10, unit: '$' }
    ],
    formula: 'Extra monthly payments are funnelled entirely into the debt account with the highest interest rate.',
    explanation: 'The Debt Avalanche is mathematically superior. Accelerating high APR paydowns saves massive sums of interest.',
    example: 'Directing $250 extra onto a $3,000 credit card balance at 21% APR settling it first avoids costly compounding, before taking on the $6,000 low APR balance.',
    faq: [
      { question: 'Why pick Avalanche over Snowball?', answer: 'The Avalanche method ALWAYS results in the lowest possible total interest payments. However, the Snowball is sometimes preferred for psychological momentum.' }
    ],
    relatedSlugs: ['debt-snowball-calculator', 'debt-calculator', 'loan-payoff-calculator'],
    calculate: (inputs) => {
      const dH = Number(inputs.highRateDebt) || 0;
      const rH = Number(inputs.rateHigh) || 0;
      const dL = Number(inputs.lowRateDebt) || 0;
      const rL = Number(inputs.rateLow) || 0;
      const extra = Number(inputs.extra) || 0;

      const totalBalance = dH + dL;
      const r_H = rH / 100 / 12;
      const r_L = rL / 100 / 12;

      let monthsH = 0;
      let balanceH = dH;
      let interestH = 0;
      while (balanceH > 0 && monthsH < 240) {
        monthsH++;
        const interest = balanceH * r_H;
        interestH += interest;
        const paid = Math.min(balanceH, 100 + extra - interest);
        balanceH -= paid;
        if (balanceH <= 0) break;
      }

      let monthsL = 0;
      let balanceL = dL;
      let interestL = 0;
      while (balanceL > 0 && monthsL < 240) {
        monthsL++;
        const currentExtra = monthsL > monthsH ? extra : 0;
        const interest = balanceL * r_L;
        interestL += interest;
        const paid = Math.min(balanceL, 150 + currentExtra - interest);
        balanceL -= paid;
        if (balanceL <= 0) break;
      }

      const totalMonths = Math.max(monthsH, monthsL);
      const totalInt = interestH + interestL;

      return {
        results: [
          { label: 'Time to Full Debt Liberation', value: totalMonths, unit: 'months', isPrimary: true },
          { label: 'High APR Debt Settled in', value: monthsH, unit: 'months' },
          { label: 'Total Cumulative Interest Cost', value: totalInt.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Debt Principal', value: totalBalance, color: '#ef4444' },
          { name: 'Avalanche Interest Cost', value: Math.round(totalInt), color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'emergency-fund-calculator',
    name: 'Emergency Fund Calculator',
    slug: 'emergency-fund-calculator',
    category: 'finance',
    description: 'Calculate your target liquid cash reserves to cushion against job transitions or critical life disruptions.',
    seoTitle: 'Emergency Fund Savings Rule Calculator | Calculatoora',
    seoDescription: 'Determine target liquid emergency funds based on monthly overhead inputs and choice of defensive time horizons.',
    inputs: [
      { id: 'expense', label: 'Essential Monthly Budget Overhead', type: 'number', defaultValue: 3200, step: 100, unit: '$' },
      { id: 'horizon', label: 'Coverage Target (Months)', type: 'select', defaultValue: 6, options: [
        { label: '3 Months (Standard)', value: 3 },
        { label: '6 Months (Recommended)', value: 6 },
        { label: '9 Months (Self-Employed)', value: 9 },
        { label: '12 Months (Conservative)', value: 12 }
      ]}
    ],
    formula: 'Target Fund = Monthly Overhead * Coverage Horizon',
    explanation: 'An emergency fund serves as an insurance buffer. Holding high-liquidity cash prevents premature sales of stock assets during recessions.',
    example: 'Sustaining a basic $3,200 monthly lifestyle budget requires a robust $19,200 cash buffer to comfortably survive 6 months of job interruption.',
    faq: [
      { question: 'Where should I hold emergency funds?', answer: 'Keep this capital in High-Yield Savings Accounts (HYSAs) or short-term Cash Instruments yielding secure interest while maintaining instant cash access.' }
    ],
    relatedSlugs: ['budget-calculator', 'monthly-budget-calculator', 'savings-goal-calculator'],
    calculate: (inputs) => {
      const exp = Number(inputs.expense) || 0;
      const h = Number(inputs.horizon) || 6;

      const target = exp * h;

      return {
        results: [
          { label: 'Target Cash Reserve Buffer', value: target.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Safety Overhead Covered', value: exp.toFixed(2), unit: '$' },
          { label: 'Survival Time Secured', value: h, unit: 'months' }
        ],
        chartData: [
          { name: 'Required Secure Buffer Cash', value: target, color: '#39FF14' },
          { name: 'Monthly Budget Burn', value: exp, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'financial-independence-calculator',
    name: 'Financial Independence / FIRE',
    slug: 'financial-independence-calculator',
    category: 'finance',
    description: 'Determine your custom FIRE (Financial Independence, Retire Early) number based on prospective yearly burn parameters.',
    seoTitle: 'FIRE (Financial Independence Retire Early) Calculator | Calculatoora',
    seoDescription: 'Find your target FIRE investment goals. Track the path to absolute financial liberation.',
    inputs: [
      { id: 'expenses', label: 'Desired Annual Living Expenses', type: 'number', defaultValue: 50000, step: 1000, unit: '$' },
      { id: 'current', label: 'Current Non-Pension Investments', type: 'number', defaultValue: 100000, step: 5000, unit: '$' },
      { id: 'rate', label: 'Safe Withdrawal Rate (SWR)', type: 'number', defaultValue: 4.0, step: 0.1, unit: '%' }
    ],
    formula: 'FIRE Number = Annual Expenses * (100 / SWR)',
    explanation: 'Your FIRE number is the specific investment corpus size required to permanently fund your post-career life via interest and dividend distributions without drawing down principal.',
    example: 'Aiming to support $50,000 in yearly expenditures with a 4.0% Safe Withdrawal Rate (SWR) mandates a core capital block of $1,250,000.',
    faq: [
      { question: 'What is Barista FIRE?', answer: 'A subset of financial independence where you accumulate enough assets to fund basic lifestyle costs, but work part-time (e.g. as a barista) to cover health insurance premiums.' }
    ],
    relatedSlugs: ['retirement-calculator', 'savings-goal-calculator', 'portfolio-calculator'],
    calculate: (inputs) => {
      const exp = Number(inputs.expenses) || 1;
      const cur = Number(inputs.current) || 0;
      const swr = Number(inputs.rate) || 4;

      const fireNum = exp * (100 / swr);
      const gap = Math.max(0, fireNum - cur);
      const progressPct = fireNum > 0 ? (cur / fireNum) * 100 : 0;

      return {
        results: [
          { label: 'Target FIRE Wealth Number', value: fireNum.toFixed(2), unit: '$', isPrimary: true },
          { label: 'FIRE Goal Completed', value: progressPct.toFixed(1), unit: '%' },
          { label: 'Savings Shortfall To Settle', value: gap.toFixed(2), unit: '$' },
          { label: 'Safe Monthly Payout (SWR Basis)', value: (exp / 12).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Current Invested Capital', value: cur, color: '#39FF14' },
          { name: 'Remaining Gap to Independence', value: Math.round(gap), color: '#312e81' }
        ]
      };
    }
  }
];
