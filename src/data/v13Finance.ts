import { Calculator } from '../types';

export const V13_FINANCE_CALCULATORS: Calculator[] = [
  {
    id: 'loan-interest-breakdown',
    name: 'Loan Interest Breakdown Calculator',
    slug: 'loan-interest-breakdown-calculator',
    category: 'finance',
    description: 'Calculate the absolute division between principal and interest payments over your loan lifecyle.',
    seoTitle: 'Loan Interest Breakdown Calculator - Principal vs. Interest solver',
    seoDescription: 'Obtain a thorough breakdown of interest versus principal paid on any mortgage or personal loan.',
    inputs: [
      { id: 'amount', label: 'Loan Principal Amount ($)', type: 'number', defaultValue: 15000, min: 1 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 6.5, min: 0.1, step: 0.01 },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 5, min: 1, max: 50 }
    ],
    formula: 'Monthly Payment P = [A * r * (1 + r)^n] / [(1 + r)^n - 1]\nTotal Interest = (P * n) - Amount',
    explanation: 'Find out the physical amount of money paid purely as interest to the lender and see how your payments chip away at the initial borrowing balance.',
    example: 'A $15,000 loan at 6.5% interest over 5 years results in a monthly payment of $293.45. Over the term, you pay a total of $17,607.16 ($15,000 principal + $2,607.16 interest).',
    faq: [
      { question: 'What is principal vs. interest?', answer: 'The principal is the money you initially borrowed. The interest is the fee charged by the lender for borrowing that money.' },
      { question: 'How can I reduce the total interest paid?', answer: 'By making extra payments, choosing a shorter term, or securing a lower interest rate, you can significantly diminish the interest burden.' }
    ],
    relatedSlugs: ['loan-refinancing-calculator', 'loan-savings-calculator'],
    keywords: ['principal vs interest breakdown', 'borrowing cost visualizer', 'monthly amortization ratio'],
    calculate: (inputs) => {
      const p = Number(inputs.amount || 15000);
      const rate = Number(inputs.rate || 6.5) / 12 / 100;
      const termY = Number(inputs.term || 5);
      const n = termY * 12;

      let monthlyPayment = 0;
      if (rate === 0) {
        monthlyPayment = p / n;
      } else {
        monthlyPayment = (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
      }

      const totalPaid = monthlyPayment * n;
      const totalInterest = totalPaid - p;
      const interestRatio = (totalInterest / totalPaid) * 100;

      return {
        results: [
          { label: 'Monthly Payment', value: `$${monthlyPayment.toFixed(2)}`, isPrimary: true },
          { label: 'Total Principal', value: `$${p.toFixed(2)}` },
          { label: 'Total Interest Paid', value: `$${totalInterest.toFixed(2)}` },
          { label: 'Total Paid Out', value: `$${totalPaid.toFixed(2)}` },
          { label: 'Interest-to-Principal Ratio', value: `${interestRatio.toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Principal Balance', value: Math.round(p) },
          { name: 'Interest Surcharges', value: Math.round(totalInterest) }
        ]
      };
    }
  },
  {
    id: 'loan-refinancing',
    name: 'Loan Refinancing Calculator',
    slug: 'loan-refinancing-calculator',
    category: 'finance',
    description: 'Compare your existing loan with refinanced terms to identify monthly savings and lifetime amortization costs.',
    seoTitle: 'Loan Refinancing Analysis Calculator',
    seoDescription: 'Input old and new interest rates to find refinancing savings, breakeven months, and payment charts.',
    inputs: [
      { id: 'balance', label: 'Current Loan Balance ($)', type: 'number', defaultValue: 250000 },
      { id: 'termRemaining', label: 'Remaining Term (Years)', type: 'number', defaultValue: 25 },
      { id: 'currentRate', label: 'Current Interest Rate (%)', type: 'number', defaultValue: 7.2 },
      { id: 'newTerm', label: 'New Loan Term (Years)', type: 'number', defaultValue: 20 },
      { id: 'newRate', label: 'New Interest Rate (%)', type: 'number', defaultValue: 5.5 },
      { id: 'closingCosts', label: 'Refinancing Closing Costs ($)', type: 'number', defaultValue: 3500 }
    ],
    formula: 'Monthly Savings = Current Payment - New Payment\nBreakeven (months) = Closing Costs / Monthly Savings',
    explanation: 'Determine if the upfront closing fees of refinancing are offset by lower monthly rates and evaluate your lifetime cost curves.',
    example: 'Refinancing a $250,000 balance down to 5.5% from 7.2% with $3,500 fees saves $260 monthly, breaking even in under 14 months.',
    faq: [
      { question: 'When is refinancing a good idea?', answer: 'Refinancing is typically beneficial when market rates drop at least 0.75-1% below your existing rate, and you plan to stay in the home long enough to break even.' },
      { question: 'What are closing costs in refinance?', answer: 'These are administrative fees, including appraisals, lender origination charges, and title insurance, usually ranging from 2% to 5% of the loan amount.' }
    ],
    relatedSlugs: ['loan-savings-calculator', 'loan-interest-breakdown-calculator'],
    keywords: ['refinance break even timeline', 'interest saving mortgage helper', 'loan rate swap analysis'],
    calculate: (inputs) => {
      const bal = Number(inputs.balance || 250000);
      const closing = Number(inputs.closingCosts || 3500);

      const oldTermM = Number(inputs.termRemaining || 25) * 12;
      const oldRate = Number(inputs.currentRate || 7.2) / 12 / 100;
      const oldPay = oldRate === 0 ? bal / oldTermM : (bal * oldRate * Math.pow(1 + oldRate, oldTermM)) / (Math.pow(1 + oldRate, oldTermM) - 1);

      const newTermM = Number(inputs.newTerm || 20) * 12;
      const newRate = Number(inputs.newRate || 5.5) / 12 / 100;
      const newPay = newRate === 0 ? bal / newTermM : (bal * newRate * Math.pow(1 + newRate, newTermM)) / (Math.pow(1 + newRate, newTermM) - 1);

      const monthlySavings = oldPay - newPay;
      const breakevenMonths = monthlySavings > 0 ? closing / monthlySavings : 0;

      const totalOldCost = oldPay * oldTermM;
      const totalNewCost = (newPay * newTermM) + closing;
      const lifetimeSavings = totalOldCost - totalNewCost;

      return {
        results: [
          { label: 'Current Payment', value: `$${oldPay.toFixed(2)}` },
          { label: 'New Refinanced Payment', value: `$${newPay.toFixed(2)}`, isPrimary: true },
          { label: 'Monthly Cash Flow Savings', value: `$${monthlySavings.toFixed(2)}` },
          { label: 'Net Lifetime Savings', value: `$${lifetimeSavings.toFixed(2)}` },
          { label: 'Breakeven Timeline', value: breakevenMonths > 0 ? `${breakevenMonths.toFixed(1)} Months` : 'N/A' }
        ],
        chartData: [
          { name: 'Monthly Savings ($)', value: Math.max(0, Math.round(monthlySavings)) },
          { name: 'Average Cost Premium ($)', value: Math.round(closing / 10) }
        ]
      };
    }
  },
  {
    id: 'loan-savings',
    name: 'Loan Savings Calculator',
    slug: 'loan-savings-calculator',
    category: 'finance',
    description: 'Project how extra, periodic payments can speed up a amortization schedule and save thousands on lifetime interest.',
    seoTitle: 'Loan Extra Payment Interest Savings Calculator',
    seoDescription: 'Obtain total interest savings and the amount of months shaved off your loan with extra monthly payments.',
    inputs: [
      { id: 'amount', label: 'Loan Balance ($)', type: 'number', defaultValue: 40000 },
      { id: 'rate', label: 'Annual Interest Rate (%)', type: 'number', defaultValue: 5.8 },
      { id: 'term', label: 'Current Term (Years)', type: 'number', defaultValue: 10 },
      { id: 'extra', label: 'Extra Payment (Monthly) ($)', type: 'number', defaultValue: 150 }
    ],
    formula: 'Balances computed iterate Month-by-Month incorporating Extra Payment deductions.',
    explanation: 'Making consistent extra principal payments prevents the interest rate from compounding on those portions, saving massive capital and retiring the debt earlier.',
    example: 'On a $40,000 ten-year loan at 5.8%, adding $150 extra monthly saves $2,980 in total interest and retires the loan 3.2 years earlier.',
    faq: [
      { question: 'Is it better to pay off a loan early?', answer: 'Yes, if you wish to reduce guaranteed interest costs, though you should balance this against potential retirement investments.' },
      { question: 'Does extra payment target principal?', answer: 'Typically yes, but you must ensure your loan servicer does not charge prepayment penalties and applies the sum directly to the principal.' }
    ],
    relatedSlugs: ['loan-interest-breakdown-calculator', 'debt-repayment-calculator'],
    keywords: ['amortization prepay savings', 'mortgage extra payment calculator', 'debt acceleration timeline'],
    calculate: (inputs) => {
      const p = Number(inputs.amount || 40000);
      const r = Number(inputs.rate || 5.8) / 100 / 12;
      const termY = Number(inputs.term || 10);
      const extra = Number(inputs.extra || 150);

      const n = termY * 12;
      const basePayment = r === 0 ? p / n : (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);

      // Scenario 1: Standard
      let tempP1 = p;
      let totalInt1 = 0;
      for (let i = 0; i < n; i++) {
        const interest = tempP1 * r;
        totalInt1 += interest;
        const principal = basePayment - interest;
        tempP1 -= principal;
        if (tempP1 <= 0) break;
      }

      // Scenario 2: Extra
      let tempP2 = p;
      let totalInt2 = 0;
      let monthsCount2 = 0;
      while (tempP2 > 0 && monthsCount2 < 600) {
        monthsCount2++;
        const interest = tempP2 * r;
        totalInt2 += interest;
        let paymentTotal = basePayment + extra;
        if (paymentTotal > tempP2 + interest) {
          paymentTotal = tempP2 + interest;
        }
        const principal = paymentTotal - interest;
        tempP2 -= principal;
      }

      const interestSaved = Math.max(0, totalInt1 - totalInt2);
      const monthsSaved = Math.max(0, n - monthsCount2);
      const yearsSaved = monthsSaved / 12;

      return {
        results: [
          { label: 'Standard Monthly Payment', value: `$${basePayment.toFixed(2)}` },
          { label: 'Total Lifetime Interest Saved', value: `$${interestSaved.toFixed(2)}`, isPrimary: true },
          { label: 'Months Saved', value: `${monthsSaved} Months (${yearsSaved.toFixed(1)} Years)` },
          { label: 'Shorter Repayment Term', value: `${monthsCount2} Months` }
        ],
        chartData: [
          { name: 'Standard Interest Paid ($)', value: Math.round(totalInt1) },
          { name: 'Accelerated Interest Paid ($)', value: Math.round(totalInt2) }
        ]
      };
    }
  },
  {
    id: 'credit-card-payoff',
    name: 'Credit Card Payoff Calculator',
    slug: 'credit-card-payoff-calculator',
    category: 'finance',
    description: 'Calculate how long it will take to pay off your credit card balance, including total interest costs.',
    seoTitle: 'Credit Card Payoff Calculator - Speed Repayment solver',
    seoDescription: 'Explore payoff timing, total interest paid, and options for increasing monthly card payments.',
    inputs: [
      { id: 'balance', label: 'Credit Card Balance ($)', type: 'number', defaultValue: 5000 },
      { id: 'rate', label: 'Annual Percentage Rate (APR) (%)', type: 'number', defaultValue: 21.9 },
      { id: 'monthly', label: 'Monthly Budget ($)', type: 'number', defaultValue: 250 }
    ],
    formula: 'Iterative month-by-month calculation: Balance_new = Balance * (1 + APR/12) - Payment',
    explanation: 'Discover how credit card interest charges consume payments, prolonging your debt unless you pay more than the minimum amount.',
    example: 'A $5,000 balance at 21.9% APR paid off with $250 monthly takes 27 months and generates $1,392 in total interest.',
    faq: [
      { question: 'Why are credit cards so hard to clear?', answer: 'Due to revolving compound interest and typical minimum payments of only 1-3% of the outstanding balance, the principal is barely reduced.' },
      { question: 'What is a debt roll-over?', answer: 'Transferring existing higher interest credit card debt onto a new 0% APR promo card to speed up principal payoffs.' }
    ],
    relatedSlugs: ['debt-repayment-calculator', 'loan-savings-calculator'],
    keywords: ['credit card payoff plan', 'apr credit card solver', 'clear card balance months'],
    calculate: (inputs) => {
      const bal = Number(inputs.balance || 5000);
      const apr = Number(inputs.rate || 21.9) / 100 / 12;
      const budget = Number(inputs.monthly || 250);

      let currentBal = bal;
      let totalInterest = 0;
      let months = 0;

      while (currentBal > 0 && months < 360) {
        months++;
        const interest = currentBal * apr;
        totalInterest += interest;
        const totalDue = currentBal + interest;

        if (budget <= interest && months > 1) {
          // Infinite loop protection if budget doesn't cover interest
          months = 999;
          break;
        }

        if (budget >= totalDue) {
          currentBal = 0;
        } else {
          currentBal = totalDue - budget;
        }
      }

      return {
        results: [
          { label: 'Payoff Window', value: months === 999 ? 'Infinite (Inadequate Payment!)' : `${months} Months`, isPrimary: true },
          { label: 'Total Interest Surcharges', value: months === 999 ? 'N/A' : `$${totalInterest.toFixed(2)}` },
          { label: 'Total Cost Paid', value: months === 999 ? 'N/A' : `$${(bal + totalInterest).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Original Credit Squeeze', value: Math.round(bal) },
          { name: 'Interest Accumulated', value: months === 999 ? 0 : Math.round(totalInterest) }
        ]
      };
    }
  },
  {
    id: 'debt-repayment',
    name: 'Debt Repayment Calculator',
    slug: 'debt-repayment-calculator',
    category: 'finance',
    description: 'Consolidate multiple personal liabilities into a single payoff roadmap with automated amortization models.',
    seoTitle: 'Debt Repayment Calculator - Personal Payoff Plan',
    seoDescription: 'Build combined amortization schedules and forecast a debt-free date based on consolidated monthly payments.',
    inputs: [
      { id: 'totalDebt', label: 'Combined Debt Balance ($)', type: 'number', defaultValue: 30000 },
      { id: 'avgApr', label: 'Average APR (%)', type: 'number', defaultValue: 12.5 },
      { id: 'monthlyPay', label: 'Unified Monthly Budget ($)', type: 'number', defaultValue: 750 }
    ],
    formula: 'Consolidated mathematical amortization using Weighted Average APR targets.',
    explanation: 'See how structuring a single, unified monthly payoff amount consolidates your focus and accelerates debt elimination.',
    example: 'Consolidating $30,000 in debt with a 12.5% average APR is cleared in 51 months under a strict $750/month allocation, incurring $8,235 in interest.',
    faq: [
      { question: 'What is debt consolidation?', answer: 'Combining multiple debts into a single, cohesive debt, ideally with a lower interest rate, to ease tracking and reduce payments.' },
      { question: 'Is debt settlement secure?', answer: 'Usually not, as it harms credit scores and often incurs tax liabilities. Accelerated amortization payments represent a safer strategy.' }
    ],
    relatedSlugs: ['debt-free-date-calculator', 'credit-card-payoff-calculator'],
    keywords: ['debt payoff planning', 'holistic debt free mapper', 'consolidation APR visualizer'],
    calculate: (inputs) => {
      const debt = Number(inputs.totalDebt || 30000);
      const rate = Number(inputs.avgApr || 12.5) / 100 / 12;
      const budget = Number(inputs.monthlyPay || 750);

      let cur = debt;
      let totalInt = 0;
      let months = 0;

      while (cur > 0 && months < 360) {
        months++;
        const interest = cur * rate;
        totalInt += interest;
        const due = cur + interest;

        if (budget <= interest && months > 1) {
          months = 999;
          break;
        }

        if (budget >= due) {
          cur = 0;
        } else {
          cur = due - budget;
        }
      }

      return {
        results: [
          { label: 'Estimated Payoff Window', value: months === 999 ? 'Infinite' : `${months} Months`, isPrimary: true },
          { label: 'Cumulative Interest Paid', value: months === 999 ? 'N/A' : `$${totalInt.toFixed(2)}` },
          { label: 'Aggregated Final Cost', value: months === 999 ? 'N/A' : `$${(debt + totalInt).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Consolidated Debt', value: Math.round(debt) },
          { name: 'Extra Lifetime Surcharge', value: months === 999 ? 0 : Math.round(totalInt) }
        ]
      };
    }
  },
  {
    id: 'debt-free-date',
    name: 'Debt Free Date Calculator',
    slug: 'debt-free-date-calculator',
    category: 'finance',
    description: 'Calculate the calendar date when you will be fully debt-free using customized repayments.',
    seoTitle: 'Debt-Free Target Calendar Calculator',
    seoDescription: 'Pinpoint the year and month you will cross the finish line to complete financial freedom of debts.',
    inputs: [
      { id: 'balance', label: 'Outstanding Balance ($)', type: 'number', defaultValue: 18000 },
      { id: 'rate', label: 'Average APR (%)', type: 'number', defaultValue: 9.8 },
      { id: 'budget', label: 'Monthly Payment Allocation ($)', type: 'number', defaultValue: 450 }
    ],
    formula: 'Payoff timing calculation formatted into chronological calendar offset steps.',
    explanation: 'Converting abstract amortization months into a concrete date establishes clear personal targets.',
    example: 'Starting with $18,000 at 9.8% APR, paying $450 monthly clears the debt in 49 months, transforming a standard baseline into a clear milestone.',
    faq: [
      { question: 'How can I pull my debt-free date forward?', answer: 'Maximize your monthly budget, utilize windfalls (like tax refunds), or search for side incomes to pay down principal early.' }
    ],
    relatedSlugs: ['debt-repayment-calculator', 'loan-savings-calculator'],
    keywords: ['debt free target calendar', 'payoff timeline converter', 'amortization milestone date'],
    calculate: (inputs) => {
      const bal = Number(inputs.balance || 18000);
      const rate = Number(inputs.rate || 9.8) / 100 / 12;
      const pay = Number(inputs.budget || 450);

      let current = bal;
      let months = 0;
      while (current > 0 && months < 480) {
        months++;
        const interest = current * rate;
        if (pay <= interest) {
          months = 999;
          break;
        }
        const principal = pay - interest;
        current -= principal;
      }

      const today = new Date();
      if (months !== 999) {
        today.setMonth(today.getMonth() + months);
      }
      const option: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
      const dateString = months === 999 ? 'Never (Underfunded)' : today.toLocaleDateString('en-US', option);

      return {
        results: [
          { label: 'Target Debt-Free Date', value: dateString, isPrimary: true },
          { label: 'Time Remaining', value: months === 999 ? 'Infinite' : `${months} Months (${(months/12).toFixed(1)} Years)` }
        ],
        chartData: [
          { name: 'Balance Progress ($)', value: Math.round(bal) },
          { name: 'Months Left', value: months === 999 ? 0 : months }
        ]
      };
    }
  },
  {
    id: 'savings-interest',
    name: 'Savings Interest Calculator',
    slug: 'savings-interest-calculator',
    category: 'finance',
    description: 'Unlock compound growth variables for regular banking, high-yield accounts, or certificates of deposit.',
    seoTitle: 'Savings Compound Interest Growth Calculator',
    seoDescription: 'Obtain precise yield, interest earnings, and balance projection schedules for any savings account.',
    inputs: [
      { id: 'principal', label: 'Starting Balance ($)', type: 'number', defaultValue: 10000 },
      { id: 'deposit', label: 'Monthly Deposits ($)', type: 'number', defaultValue: 200 },
      { id: 'rate', label: 'Annual Interest Rate (APY) (%)', type: 'number', defaultValue: 4.5 },
      { id: 'years', label: 'Savings Term (Years)', type: 'number', defaultValue: 5 }
    ],
    formula: 'A = P * (1 + r/n)^(nt) + PMT * [((1 + r/n)^(nt) - 1) / (r/n)]',
    explanation: 'See how small, continuous monthly contributions compound over time with high interest yields to build liquid security.',
    example: 'Starting with $10,000 at a 4.5% APY and adding $200 monthly yields a secure $24,710.82 balance over 5 years.',
    faq: [
      { question: 'What is APY?', answer: 'Annual Percentage Yield. It accounts for compounding interest over a year, giving you a slightly higher effective rate than nominal interest.' }
    ],
    relatedSlugs: ['short-term-savings-calculator', 'long-term-savings-calculator'],
    keywords: ['high yield interest projection', 'liquid compound earnings', 'hysa balance curve'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 10000);
      const d = Number(inputs.deposit || 200);
      const r = Number(inputs.rate || 4.5) / 100 / 12;
      const termY = Number(inputs.years || 5);
      const periods = termY * 12;

      let balance = p;
      let totalContrib = p;

      for (let i = 0; i < periods; i++) {
        const interest = balance * r;
        balance += interest + d;
        totalContrib += d;
      }

      const totalInterest = Math.max(0, balance - totalContrib);

      return {
        results: [
          { label: 'Final Accumulated Savings', value: `$${balance.toFixed(2)}`, isPrimary: true },
          { label: 'Your Out-of-Pocket Deposits', value: `$${totalContrib.toFixed(2)}` },
          { label: 'Pure Capital Yield (Interest)', value: `$${totalInterest.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Your Core Contributions', value: Math.round(totalContrib) },
          { name: 'Pure Interest Earnings', value: Math.round(totalInterest) }
        ]
      };
    }
  },
  {
    id: 'short-term-savings',
    name: 'Short Term Savings Calculator',
    slug: 'short-term-savings-calculator',
    category: 'finance',
    description: 'Calculate targets for vacation scopes, holiday budgets, or electronics upgrades within short horizons.',
    seoTitle: 'Short-Term Monthly Savings Target Calculator',
    seoDescription: 'Analyze the monthly deposits required to reach near-term goals over 3 to 24 months.',
    inputs: [
      { id: 'target', label: 'Financial Goal Target ($)', type: 'number', defaultValue: 3000 },
      { id: 'months', label: 'Savings Duration (Months)', type: 'number', defaultValue: 12 },
      { id: 'apy', label: 'Account Interest rate (APY) (%)', type: 'number', defaultValue: 4.2 }
    ],
    formula: 'Required Contribution = [Target - Principal_Compound] / [Interest Compounding Accumulator]',
    explanation: 'Near-term goals require high safety and liquidity. Calculate the exact monthly amount needed to secure your target on time.',
    example: 'Reaching a $3,000 target in 12 months with a 4.2% interest rate requires saving $244.33 monthly.',
    faq: [
      { question: 'Where should I store short-term savings?', answer: 'In a High-Yield Savings Account (HYSA) or a high-yield checking account to protect principal from market volatility.' }
    ],
    relatedSlugs: ['long-term-savings-calculator', 'savings-interest-calculator'],
    keywords: ['short term goal planner', 'liquid cash builder tool', 'monthly piggybank targets'],
    calculate: (inputs) => {
      const tgt = Number(inputs.target || 3000);
      const m = Math.max(1, Number(inputs.months || 12));
      const rate = Number(inputs.apy || 4.2) / 100 / 12;

      let reqDeposit = 0;
      if (rate === 0) {
        reqDeposit = tgt / m;
      } else {
        const factor = (Math.pow(1 + rate, m) - 1) / rate;
        reqDeposit = tgt / factor;
      }

      return {
        results: [
          { label: 'Required Monthly Deposit', value: `$${reqDeposit.toFixed(2)}`, isPrimary: true },
          { label: 'Combined Deposits Over Term', value: `$${(reqDeposit * m).toFixed(2)}` },
          { label: 'Interest-Paid Offset Contributions', value: `$${(tgt - (reqDeposit * m)).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Self Monthly Savings Needed ($)', value: Math.round(reqDeposit) },
          { name: 'Target Horizon Span (Mos)', value: m }
        ]
      };
    }
  },
  {
    id: 'long-term-savings',
    name: 'Long Term Savings Calculator',
    slug: 'long-term-savings-calculator',
    category: 'finance',
    description: 'Map out decades of consistent savings to secure real estate down payments or future child funds.',
    seoTitle: 'Long-Term Multi-Decade Wealth Path Calculator',
    seoDescription: 'Forecast wealth accumulated over 5 to 40 years under inflation and compounding factors.',
    inputs: [
      { id: 'initial', label: 'Starting Capital ($)', type: 'number', defaultValue: 15000 },
      { id: 'monthly', label: 'Expected Monthly Savings ($)', type: 'number', defaultValue: 500 },
      { id: 'rate', label: 'Projected Long-term Yield (%)', type: 'number', defaultValue: 7.5 },
      { id: 'years', label: 'Investment Timeframe (Years)', type: 'number', defaultValue: 25 },
      { id: 'inflation', label: 'Assumed Annual Inflation (%)', type: 'number', defaultValue: 2.5 }
    ],
    formula: 'Iterative annual compound interest adjusted by continuous discounting inflation ratios.',
    explanation: 'Long-term strategies harness the exponential power of compounding interest alongside moderate risk asset structures.',
    example: 'Starting with $15,000 & adding $500 monthly over 25 years at a 7.5% yield accumulates $510,879, which adjusts to $275,389 in real purchasing power.',
    faq: [
      { question: 'Why adjust for inflation?', answer: 'Inflation reduces the future purchasing power of your money, meaning a dollar today buys less in 20 years.' }
    ],
    relatedSlugs: ['savings-interest-calculator', 'investment-return-calculator'],
    keywords: ['generational nest egg tracker', 'long range wealth predictor', 'compound yield curve'],
    calculate: (inputs) => {
      const init = Number(inputs.initial || 15000);
      const monthly = Number(inputs.monthly || 500);
      const rate = Number(inputs.rate || 7.5) / 100 / 12;
      const years = Number(inputs.years || 25);
      const infl = Number(inputs.inflation || 2.5) / 100;

      const totalM = years * 12;
      let balance = init;
      let principalTotal = init;

      for (let i = 0; i < totalM; i++) {
        balance = (balance * (1 + rate)) + monthly;
        principalTotal += monthly;
      }

      // Inflation adjustment multiplier
      const realFactor = Math.pow(1 + infl, years);
      const realValue = balance / realFactor;
      const compoundYield = balance - principalTotal;

      return {
        results: [
          { label: 'Nominal Accumulated Value', value: `$${balance.toFixed(2)}`, isPrimary: true },
          { label: 'Inflation-Adjusted (Real Value)', value: `$${realValue.toFixed(2)}` },
          { label: 'Total Principal Invested', value: `$${principalTotal.toFixed(2)}` },
          { label: 'Pure Investment Yield', value: `$${compoundYield.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Nominal Balance ($)', value: Math.round(balance) },
          { name: 'Real Value ($)', value: Math.round(realValue) }
        ]
      };
    }
  },
  {
    id: 'investment-return',
    name: 'Investment Return Calculator',
    slug: 'investment-return-calculator',
    category: 'finance',
    description: 'Determine the Return on Investment (ROI) and Annualized Rate of Return (CAGR) for any investment asset.',
    seoTitle: 'Investment Return ROI & Annualized CAGR Calculator',
    seoDescription: 'Verify dollar gains, percentage ROI, and annualized returns based on purchase and current values.',
    inputs: [
      { id: 'initialVal', label: 'Initial Purchase Value ($)', type: 'number', defaultValue: 20000 },
      { id: 'finalVal', label: 'Current / Final Value ($)', type: 'number', defaultValue: 35000 },
      { id: 'yearsHeld', label: 'Holding Duration (Years)', type: 'number', defaultValue: 5.5 }
    ],
    formula: 'ROI = [(Final - Initial) / Initial] * 100\nCAGR = (Final / Initial) ^ (1 / Years) - 1',
    explanation: 'Assess the efficiency and performance of your investment by converting raw dollar gains into percentage-based holding returns.',
    example: 'An investment of $20,000 growing to $35,000 over 5.5 years yields a 75% ROI, equating to an annualized yield (CAGR) of 10.91%.',
    faq: [
      { question: 'What is the difference between ROI and CAGR?', answer: 'ROI shows your total profit progress, while CAGR determines the steady annual compounding rate required to reach that same outcome.' }
    ],
    relatedSlugs: ['portfolio-allocation-calculator', 'investment-risk-calculator'],
    keywords: ['roi metric solver', 'compounded cagr calculator', 'holding return tracking'],
    calculate: (inputs) => {
      const init = Number(inputs.initialVal || 20000);
      const final = Number(inputs.finalVal || 35000);
      const yrs = Math.max(0.1, Number(inputs.yearsHeld || 5.5));

      const gain = final - init;
      const roi = (gain / init) * 100;
      const cagr = (Math.pow(final / init, 1 / yrs) - 1) * 100;

      return {
        results: [
          { label: 'Compounded Annual Return (CAGR)', value: `${cagr.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Percentage Return (ROI)', value: `${roi.toFixed(2)}%` },
          { label: 'Total Capital Profit ($)', value: `$${gain.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Initial Capital', value: Math.round(init) },
          { name: 'Pure Dollar Gains', value: Math.round(gain) }
        ]
      };
    }
  },
  {
    id: 'portfolio-allocation',
    name: 'Portfolio Allocation Calculator',
    slug: 'portfolio-allocation-calculator',
    category: 'finance',
    description: 'Calculate asset distributions to balance stocks, bonds, cash, and real estate matching your target allocations.',
    seoTitle: 'Portfolio Asset Allocation & Rebalancing Calculator',
    seoDescription: 'Obtain precise rebalancing adjustments based on actual vs. target portfolio weightings.',
    inputs: [
      { id: 'stocks', label: 'Current Stocks Value ($)', type: 'number', defaultValue: 60000 },
      { id: 'stocksTarget', label: 'Target Stocks (%)', type: 'number', defaultValue: 60, min: 0, max: 100 },
      { id: 'bonds', label: 'Current Bonds Value ($)', type: 'number', defaultValue: 25000 },
      { id: 'bondsTarget', label: 'Target Bonds (%)', type: 'number', defaultValue: 30, min: 0, max: 100 },
      { id: 'cash', label: 'Current Cash Value ($)', type: 'number', defaultValue: 15000 },
      { id: 'cashTarget', label: 'Target Cash (%)', type: 'number', defaultValue: 10, min: 0, max: 100 }
    ],
    formula: 'Total = Stocks + Bonds + Cash\nAdjustment = (Total * Target%) - Current',
    explanation: 'Compare your actual portfolio weightings against long-term targets to calculate the buy or sell adjustments required to restore balance.',
    example: 'A portfolio worth $100,000 with a target of 60/30/10 but current balances of $60k/$25k/$15k requires buying $5k in bonds and selling $5k of cash.',
    faq: [
      { question: 'Why is portfolio rebalancing important?', answer: 'Market movements drift assets away from your ideal allocation, often increasing risk. Rebalancing systematically buys low and sells high.' }
    ],
    relatedSlugs: ['investment-risk-calculator', 'investment-return-calculator'],
    keywords: ['portfolio rebalance helper', 'stocks bonds asset allocation', 'wealth distribution risk'],
    calculate: (inputs) => {
      const s = Number(inputs.stocks || 60000);
      const b = Number(inputs.bonds || 25000);
      const c = Number(inputs.cash || 15000);

      const sTarget = Number(inputs.stocksTarget || 60) / 100;
      const bTarget = Number(inputs.bondsTarget || 30) / 100;
      const cTarget = Number(inputs.cashTarget || 10) / 100;

      const total = s + b + c;
      const sIdeal = total * sTarget;
      const bIdeal = total * bTarget;
      const cIdeal = total * cTarget;

      const sAct = total > 0 ? (s / total) * 100 : 0;
      const bAct = total > 0 ? (b / total) * 100 : 0;
      const cAct = total > 0 ? (c / total) * 100 : 0;

      const sAdjust = sIdeal - s;
      const bAdjust = bIdeal - b;
      const cAdjust = cIdeal - c;

      return {
        results: [
          { label: 'Aggregated Portfolio Value', value: `$${total.toFixed(2)}`, isPrimary: true },
          { label: 'Sectors Weight Balance', value: `Stocks: ${sAct.toFixed(1)}% | Bonds: ${bAct.toFixed(1)}% | Cash: ${cAct.toFixed(1)}%` },
          { label: 'Stock Rebalance Step', value: sAdjust >= 0 ? `Buy $${sAdjust.toFixed(2)}` : `Sell $${Math.abs(sAdjust).toFixed(2)}` },
          { label: 'Bond Rebalance Step', value: bAdjust >= 0 ? `Buy $${bAdjust.toFixed(2)}` : `Sell $${Math.abs(bAdjust).toFixed(2)}` },
          { label: 'Cash Rebalance Step', value: cAdjust >= 0 ? `Buy $${cAdjust.toFixed(2)}` : `Sell $${Math.abs(cAdjust).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Stocks ($)', value: Math.round(s) },
          { name: 'Bonds ($)', value: Math.round(b) },
          { name: 'Cash ($)', value: Math.round(c) }
        ]
      };
    }
  },
  {
    id: 'investment-risk',
    name: 'Investment Risk Calculator',
    slug: 'investment-risk-calculator',
    category: 'finance',
    description: 'Score your individual risk tolerance and forecast maximum drawdown scenarios based on historical market trends.',
    seoTitle: 'Investment Risk Tolerance & Drawdown Estimator',
    seoDescription: 'Obtain risk priority classifications and estimate worst-case volatility based on personal investment options.',
    inputs: [
      { id: 'horizon', label: 'Time Horizon (Years)', type: 'select', defaultValue: 'long', options: [{ label: 'Under 3 years (Short)', value: 'short' }, { label: '3-10 years (Medium)', value: 'medium' }, { label: '10+ years (Long)', value: 'long' }] },
      { id: 'reaction', label: 'Reaction to a 20% Drop', type: 'select', defaultValue: 'buy', options: [{ label: 'Sell remaining immediately', value: 'sell' }, { label: 'Hold and wait for recovery', value: 'hold' }, { label: 'Sell off some assets', value: 'sell_some' }, { label: 'Buy more at discounted rates', value: 'buy' }] },
      { id: 'objective', label: 'Primary Safety Objective', type: 'select', defaultValue: 'max', options: [{ label: 'Preserve Principal Security', value: 'preserve' }, { label: 'Stable Inflation Hedge', value: 'hedge' }, { label: 'Maximize Wealth Accumulation (growth)', value: 'max' }] }
    ],
    formula: 'Score Weighting = Objective weight (40%) + Reaction weight (40%) + Horizon weight (20%)',
    explanation: 'Scoring personal risk profiles helps design an optimal strategic asset layout, ensuring peace of mind during market drops.',
    example: 'A long horizon, aggressive response to asset drops, and wealth maximization focus yield a High Appetite profile (Score 92), indicating an 80/20 growth stock portfolio layout.',
    faq: [
      { question: 'What is drawdown?', answer: 'The maximum decline from a portfolio peak to its subsequent trough, representing downside risk during periods of high market panic.' }
    ],
    relatedSlugs: ['portfolio-allocation-calculator', 'investment-return-calculator'],
    keywords: ['risk tolerance score', 'portfolio downside volatility', 'investor profile estimator'],
    calculate: (inputs) => {
      let score = 50;

      if (inputs.horizon === 'short') score -= 15;
      else if (inputs.horizon === 'long') score += 15;

      if (inputs.reaction === 'sell') score -= 25;
      else if (inputs.reaction === 'sell_some') score -= 10;
      else if (inputs.reaction === 'buy') score += 25;

      if (inputs.objective === 'preserve') score -= 20;
      else if (inputs.objective === 'max') score += 20;

      // Bound score
      score = Math.max(10, Math.min(100, score));

      let profile = 'Moderate';
      let allocation = '50/50 Stocks & Bonds';
      let maxDrawdown = '-15%';

      if (score < 35) {
        profile = 'Conservative';
        allocation = '20/80 Stocks & Bonds';
        maxDrawdown = '-5%';
      } else if (score > 75) {
        profile = 'Aggressive Growth';
        allocation = '90/10 Stocks & Bonds';
        maxDrawdown = '-35%';
      }

      return {
        results: [
          { label: 'Risk Tolerance Score', value: `${score} / 100`, isPrimary: true },
          { label: 'Aligned Investor Profile', value: profile },
          { label: 'Recommended Asset Allocation', value: allocation },
          { label: 'Worst-Case Historic Drawdown', value: maxDrawdown }
        ],
        chartData: [
          { name: 'Risk Score Value', value: score },
          { name: 'Safety Buffer Target', value: 100 - score }
        ]
      };
    }
  },
  {
    id: 'stock-average',
    name: 'Stock Average Calculator',
    slug: 'stock-average-calculator',
    category: 'finance',
    description: 'Determine the weighted average cost of multiple stock purchases (dollar-cost averaging).',
    seoTitle: 'Stock Weighted Average Buy Price Calculator',
    seoDescription: 'Input different purchase tiers and quantities to find your true average share cost.',
    inputs: [
      { id: 'price1', label: 'Purchase Price 1 ($)', type: 'number', defaultValue: 150 },
      { id: 'shares1', label: 'Shares Bought 1', type: 'number', defaultValue: 10 },
      { id: 'price2', label: 'Purchase Price 2 ($)', type: 'number', defaultValue: 120 },
      { id: 'shares2', label: 'Shares Bought 2', type: 'number', defaultValue: 15 }
    ],
    formula: 'Average Price = (Price1 * Shares1 + Price2 * Shares2) / (Shares1 + Shares2)',
    explanation: 'Track your weighted average share cost across different pricing tiers to evaluate your break-even levels.',
    example: 'Buying 10 shares at $150 and 15 shares at $120 yields a weighted average cost of $132 per share.',
    faq: [
      { question: 'What is dollar cost averaging?', answer: 'Investing a fixed dollar amount at regular intervals, regardless of share price, to reduce average purchase costs when assets decline.' }
    ],
    relatedSlugs: ['stock-profit-calculator', 'investment-return-calculator'],
    keywords: ['weighted average buy price', 'stock cost basis solver', 'dca balance optimizer'],
    calculate: (inputs) => {
      const p1 = Number(inputs.price1 || 150);
      const s1 = Number(inputs.shares1 || 10);
      const p2 = Number(inputs.price2 || 120);
      const s2 = Number(inputs.shares2 || 15);

      const totalShares = s1 + s2;
      const totalCost = (p1 * s1) + (p2 * s2);
      const avgPrice = totalShares > 0 ? totalCost / totalShares : 0;

      return {
        results: [
          { label: 'Weighted Average Share Cost', value: `$${avgPrice.toFixed(2)}`, isPrimary: true },
          { label: 'Total Capital Invested', value: `$${totalCost.toFixed(2)}` },
          { label: 'Total Shares Owned', value: totalShares.toString() }
        ],
        chartData: [
          { name: 'First Batch Cost ($)', value: Math.round(p1 * s1) },
          { name: 'Second Batch Cost ($)', value: Math.round(p2 * s2) }
        ]
      };
    }
  },
  {
    id: 'stock-profit',
    name: 'Stock Profit Calculator',
    slug: 'stock-profit-calculator',
    category: 'finance',
    description: 'Calculate your net return on stock sales, accounting for purchase price, sell commission margins, and taxes.',
    seoTitle: 'Stock Sale Net Profit and Taxes Calculator',
    seoDescription: 'Verify purchase and sale details to estimate capital gains tax obligations and net cash returns.',
    inputs: [
      { id: 'buyPrice', label: 'Buy Price Per Share ($)', type: 'number', defaultValue: 50 },
      { id: 'sellPrice', label: 'Expected Sell Price ($)', type: 'number', defaultValue: 75 },
      { id: 'shares', label: 'Number of Shares', type: 'number', defaultValue: 100 },
      { id: 'commission', label: 'Broker commission Fee (Total) ($)', type: 'number', defaultValue: 15 },
      { id: 'taxRate', label: 'Capital Gains Tax Rate (%)', type: 'number', defaultValue: 15 }
    ],
    formula: 'Net gain = [(Sell - Buy) * Shares] - Commission - Taxes',
    explanation: 'Capital gains are taxable. Use this tool to subtract transaction commissions and tax liabilities from your gross returns.',
    example: 'Selling 100 shares at $75 bought at $50 under a 15% tax rate and $15 fees yields a net profit of $2,110.',
    faq: [
      { question: 'What is capital gains tax?', answer: 'A tax levied on profits made from selling assets, which is typically discounted if held longer than 12 months.' }
    ],
    relatedSlugs: ['stock-average-calculator', 'investment-return-calculator'],
    keywords: ['capital gains tax calculator', 'stock transaction net profit', 'broker fee deduction solver'],
    calculate: (inputs) => {
      const buy = Number(inputs.buyPrice || 50);
      const sell = Number(inputs.sellPrice || 75);
      const qty = Number(inputs.shares || 100);
      const fees = Number(inputs.commission || 15);
      const taxesPct = Number(inputs.taxRate || 15) / 100;

      const grossInvest = buy * qty;
      const grossRevenue = sell * qty;
      const grossGain = grossRevenue - grossInvest;

      const taxableGain = Math.max(0, grossGain - fees);
      const taxObligation = taxableGain * taxesPct;
      const netProfit = grossGain - fees - taxObligation;

      return {
        results: [
          { label: 'Net Cash Take-home Profit', value: `$${netProfit.toFixed(2)}`, isPrimary: true },
          { label: 'Gross Profit Gain', value: `$${grossGain.toFixed(2)}` },
          { label: 'Capital Gain Tax Liability', value: `$${taxObligation.toFixed(2)}` },
          { label: 'Total Purchase Outlay', value: `$${grossInvest.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Initial Capital', value: Math.round(grossInvest) },
          { name: 'Net Profit', value: Math.round(netProfit) }
        ]
      };
    }
  },
  {
    id: 'dividend-growth',
    name: 'Dividend Growth Calculator',
    slug: 'dividend-growth-calculator',
    category: 'finance',
    description: 'Forecast forward cash flows by compounding re-invested stock dividends (DRIP) over decades.',
    seoTitle: 'Dividend Compounding Growth (DRIP) Calculator',
    seoDescription: 'Calculate long-term passive dividend cash flows assuming buy-backs and annual payout expansions.',
    inputs: [
      { id: 'principal', label: 'Initial Investment ($)', type: 'number', defaultValue: 10000 },
      { id: 'monthly', label: 'Monthly Contributions ($)', type: 'number', defaultValue: 250 },
      { id: 'yield', label: 'Initial Dividend Yield (%)', type: 'number', defaultValue: 3.8 },
      { id: 'divGrowth', label: 'Annual dividend growth Rate (%)', type: 'number', defaultValue: 5 },
      { id: 'years', label: 'Compounding Horizon (Years)', type: 'number', defaultValue: 20 },
      { id: 'drip', label: 'Reinvest Dividends (DRIP)', type: 'select', defaultValue: 'yes', options: [{ label: 'Yes (Re-invest)', value: 'yes' }, { label: 'No (Payout Cash)', value: 'no' }] }
    ],
    formula: 'Yield compounds annually with added monthly injections and custom dividend increases.',
    explanation: 'Dividend Growth (DRIP) is highly powerful. Re-invested dividends purchase additional fractional shares, expanding future payouts.',
    example: 'A $10,000 portfolio at a 3.8% starting yield with a 5% payout growth rate and $250 monthly savings accumulates $155,041, generating $6,505 in passive dividends annually in year 20.',
    faq: [
      { question: 'What is DRIP?', answer: 'Dividend Reinvestment Plan. An automated broker setup that re-invests cash dividends straight back into purchase shares.' }
    ],
    relatedSlugs: ['investment-return-calculator', 'savings-interest-calculator'],
    keywords: ['drip passive cash compounding', 'dividend growth metrics', 'forward cash flows projections'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 10000);
      const monthlyAdd = Number(inputs.monthly || 250);
      let divYieldY = Number(inputs.yield || 3.8) / 100;
      const divGrowRate = Number(inputs.divGrowth || 5) / 100;
      const yrs = Number(inputs.years || 20);
      const isDrip = inputs.drip === 'yes';

      let capital = p;
      let totalInvested = p;
      let yearlyPayout = 0;

      for (let y = 1; y <= yrs; y++) {
        yearlyPayout = capital * divYieldY;

        if (isDrip) {
          capital += yearlyPayout;
        }

        // Add monthly regular contributions
        const annualContribution = monthlyAdd * 12;
        capital += annualContribution;
        totalInvested += annualContribution;

        // Dividend yield adjustment
        divYieldY = divYieldY * (1 + divGrowRate);
      }

      return {
        results: [
          { label: 'Forward Annual Dividend Yield', value: `$${(capital * divYieldY).toFixed(2)}`, isPrimary: true },
          { label: 'Cumulative Portfolio balance', value: `$${capital.toFixed(2)}` },
          { label: 'Total Contributions Made', value: `$${totalInvested.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Self Invested Capital ($)', value: Math.round(totalInvested) },
          { name: 'Forward Annual Cash Flow ($)', value: Math.round(capital * divYieldY) }
        ]
      };
    }
  }
];
