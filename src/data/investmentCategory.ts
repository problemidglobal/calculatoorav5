import { Calculator } from '../types';

export const INVESTMENT_CALCULATORS: Calculator[] = [
  {
    id: 'future-value-calculator',
    name: 'Future Value Calculator',
    slug: 'future-value-calculator',
    category: 'finance',
    description: 'Calculate the future value (FV) of an asset or capital balance based on fixed compounding interest rates.',
    seoTitle: 'Future Value (FV) Calculator | Calculatoora',
    seoDescription: 'Obtain precise future valuations of capital investments. Account for inflation or periodic additions seamlessly.',
    inputs: [
      { id: 'pv', label: 'Present Value (PV)', type: 'number', defaultValue: 10000, step: 500, unit: '$' },
      { id: 'rate', label: 'Expected Yield (APR)', type: 'number', defaultValue: 7.0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Time Span (Years)', type: 'number', defaultValue: 10, step: 1, unit: 'years' },
      { id: 'frequency', label: 'Compounding frequency', type: 'select', defaultValue: 1, options: [
        { label: 'Annually (1/yr)', value: 1 },
        { label: 'Monthly (12/yr)', value: 12 },
        { label: 'Quarterly (4/yr)', value: 4 },
        { label: 'Daily (365/yr)', value: 365 }
      ]}
    ],
    formula: 'FV = PV * (1 + r/n)^(n*t)\nWhere PV = Present Value, r = nominal rate, n = compounds per year, t = years.',
    explanation: 'The Future Value explores how current liquidity swells across any compound environment.',
    example: 'A $10,000 liquid capital balance experiencing 7.0% annual compounding interest grows to $19,671.51 in exactly 10 years.',
    faq: [
      { question: 'What is inflation tracking?', answer: 'Future value calculations assume nominal currency values. Correcting for inflation uses an inflation discount rate to get the real value.' }
    ],
    relatedSlugs: ['present-value-calculator', 'cagr-calculator', 'compound-interest-calculator-advanced'],
    calculate: (inputs) => {
      const pv = Number(inputs.pv) || 0;
      const rate = Number(inputs.rate) || 0;
      const y = Number(inputs.years) || 0;
      const n = Number(inputs.frequency) || 1;

      const r = rate / 100;
      const fv = pv * Math.pow(1 + r/n, n * y);
      const gain = Math.max(0, fv - pv);

      return {
        results: [
          { label: 'Ending Future Value (FV)', value: fv.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Initial Principal (PV)', value: pv.toFixed(2), unit: '$' },
          { label: 'Nominal Growth Earnings', value: gain.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Present Value Principal', value: pv, color: '#39FF14' },
          { name: 'Compounded Yield Growth', value: Math.round(gain), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'present-value-calculator',
    name: 'Present Value Calculator',
    slug: 'present-value-calculator',
    category: 'finance',
    description: 'Determine the present value (PV) or current worth of a target future cash sum based on a set discount rate.',
    seoTitle: 'Present Value (PV) Cash Discount Calculator | Calculatoora',
    seoDescription: 'Find the current worth of a future payment or cash flow. Input discount rates and compounding intervals to isolate the present value.',
    inputs: [
      { id: 'fv', label: 'Future Value Target (FV)', type: 'number', defaultValue: 25000, step: 500, unit: '$' },
      { id: 'rate', label: 'Discount Rate Annual', type: 'number', defaultValue: 6.0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Time of payment (Years)', type: 'number', defaultValue: 5, step: 1, unit: 'years' }
    ],
    formula: 'PV = FV / (1 + r)^t\nWhere FV is Future Value, r is the discount rate, and t is the timeline in years.',
    explanation: 'Present Value represents the core tenant of time-value-of-money: a dollar in hand today is worth more than a dollar tomorrow due to alternative investment yields.',
    example: 'Receiving a guaranteed payout of $25,000 in 5 years, discounted at 6.0% annually, is worth exactly $18,681.45 today.',
    faq: [
      { question: 'What is a discount rate?', answer: 'The discount rate represents the expected rate of return on alternative investments or the general cost of capital.' }
    ],
    relatedSlugs: ['future-value-calculator', 'interest-rate-calculator', 'cagr-calculator'],
    calculate: (inputs) => {
      const fv = Number(inputs.fv) || 0;
      const rate = Number(inputs.rate) || 0;
      const t = Number(inputs.years) || 1;

      const r = rate / 100;
      const pv = fv / Math.pow(1 + r, t);
      const discount = Math.max(0, fv - pv);

      return {
        results: [
          { label: 'Required Present Value (PV)', value: pv.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Target Future Value (FV)', value: fv.toFixed(2), unit: '$' },
          { label: 'Discount Amount (Time Loss)', value: discount.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Current Present Value', value: Math.round(pv), color: '#39FF14' },
          { name: 'Future Discount Loss', value: Math.round(discount), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'cagr-calculator',
    name: 'CAGR Calculator',
    slug: 'cagr-calculator',
    category: 'finance',
    description: 'Calculate the Compound Annual Growth Rate (CAGR) of any investment portfolio or commercial metric over a set timeline of years.',
    seoTitle: 'Compound Annual Growth Rate (CAGR) Calculator | Calculatoora',
    seoDescription: 'Find the CAGR of stock holdings, business revenues, or mutual funds over years using initial and final capital values.',
    inputs: [
      { id: 'initial', label: 'Beginning Asset Value', type: 'number', defaultValue: 10000, step: 500, unit: '$' },
      { id: 'final', label: 'Ending Asset Value', type: 'number', defaultValue: 21500, step: 1000, unit: '$' },
      { id: 'years', label: 'Duration (Years)', type: 'number', defaultValue: 5, step: 0.5, unit: 'years' }
    ],
    formula: 'CAGR = (Ending Value / Beginning Value)^(1 / Years) - 1',
    explanation: 'CAGR calculates the steady annual rate of return that would be required to grow an investment from its beginning balance to its ending balance, smoothing out temporary intermediate volatility.',
    example: 'Growing an equity account from $10,000 to $21,500 over 5 years yields a CAGR of 16.54% annually.',
    faq: [
      { question: 'What is the main difference between CAGR and average annual return?', answer: 'CAGR accounts for compounding and represents the true exponential growth rate. Average Annual Return is a simple arithmetic average that ignores compounding sequences.' }
    ],
    relatedSlugs: ['roi-calculator', 'future-value-calculator', 'investment-growth-calculator'],
    calculate: (inputs) => {
      const b = Number(inputs.initial) || 1;
      const e = Number(inputs.final) || 1;
      const y = Number(inputs.years) || 1;

      const cagr = (Math.pow(e / b, 1 / y) - 1) * 100;
      const absoluteReturn = ((e - b) / b) * 100;

      return {
        results: [
          { label: 'Compound Annual Rate (CAGR)', value: cagr.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Total Absolute Return', value: absoluteReturn.toFixed(2), unit: '%' },
          { label: 'Gain Valuations', value: (e - b).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Principal Asset', value: b, color: '#39FF14' },
          { name: 'Grown Valuation Margin', value: Math.max(0, e - b), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    slug: 'sip-calculator',
    category: 'finance',
    description: 'Calculate future wealth and interest gains generated via a Systematic Investment Plan (SIP) in mutual funds or equity products.',
    seoTitle: 'SIP Mutual Fund Wealth Calculator | Calculatoora',
    seoDescription: 'Accurately project mutual fund and stock compound SIP value based on regular monthly contributions and estimated annual yields.',
    inputs: [
      { id: 'monthly', label: 'Monthly Investment Sum', type: 'number', defaultValue: 500, step: 50, unit: '$' },
      { id: 'rate', label: 'Estimated Annual Return Rate', type: 'number', defaultValue: 12.0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Target Horizon (Years)', type: 'number', defaultValue: 15, step: 1, unit: 'years' }
    ],
    formula: 'M = P * [((1 + i)^n - 1) / i] * (1 + i)\nWhere i is monthly rate (R / 12 / 100), n represents months (years * 12).',
    explanation: 'Systematic Investment Plans let retail investors benefit from dollar-cost averaging by regularly contributing fixed sums, harnessing robust compounding.',
    example: 'Investing $500 monthly into a mutual fund with a 12.0% annual return yield for 15 years results in $90,000 deposited, growing to a massive projected wealth of $252,284.66.',
    faq: [
      { question: 'What is dollar-cost averaging?', answer: 'DCA is purchasing more shares when asset values are low and fewer when they are expensive, reducing the average cost of shares over time.' }
    ],
    relatedSlugs: ['investment-growth-calculator', 'savings-goal-calculator', 'compound-interest-calculator-advanced'],
    calculate: (inputs) => {
      const p = Number(inputs.monthly) || 0;
      const annualR = Number(inputs.rate) || 0;
      const yrs = Number(inputs.years) || 1;

      const i = (annualR / 100) / 12;
      const n = yrs * 12;

      let finalSum = 0;
      if (i === 0) {
        finalSum = p * n;
      } else {
        finalSum = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
      }

      const totalDeposited = p * n;
      const interestEarned = Math.max(0, finalSum - totalDeposited);

      return {
        results: [
          { label: 'Projected Portfolio Value', value: finalSum.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Invested Capital', value: totalDeposited.toFixed(2), unit: '$' },
          { label: 'Total Wealth Compounded', value: interestEarned.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Nominal Funds Placed', value: totalDeposited, color: '#39FF14' },
          { name: 'Compounded Growth Yield', value: Math.round(interestEarned), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'investment-growth-calculator',
    name: 'Investment Growth Calculator',
    slug: 'investment-growth-calculator',
    category: 'finance',
    description: 'Calculate how stock markets, retirement index funds, or business investments expand over years under compound gains.',
    seoTitle: 'Investment Growth & Yield Projector | Calculatoora',
    seoDescription: 'Find out how fast compound index funds build up. Account for capital gains taxes or inflation factors dynamically.',
    inputs: [
      { id: 'starting', label: 'Starting Balance', type: 'number', defaultValue: 25000, step: 1000, unit: '$' },
      { id: 'monthly', label: 'Monthly Contributions', type: 'number', defaultValue: 400, step: 20, unit: '$' },
      { id: 'yieldRate', label: 'Estimated Annual Yield', type: 'number', defaultValue: 9.5, step: 0.1, unit: '%' },
      { id: 'years', label: 'Investment Span', type: 'number', defaultValue: 20, step: 1, unit: 'years' }
    ],
    formula: 'Iterative month-by-month compounding structure factoring regular ongoing contributions.',
    explanation: 'This calculator displays the power of consistent periodic additions paired with historical Stock market returns.',
    example: 'Growing $25k starting capital with $400 monthly add-ons at 9.5% average annual yield for 20 years results in $412,410.87 accumulated wealth.',
    faq: [
      { question: 'What is the historical S&P 500 average yield?', answer: 'Historically, the S&P 500 index averages about 10% annual nominal yield over multi-decade sequences before inflation corrections.' }
    ],
    relatedSlugs: ['sip-calculator', 'cagr-calculator', 'retirement-calculator'],
    calculate: (inputs) => {
      const start = Number(inputs.starting) || 0;
      const monthly = Number(inputs.monthly) || 0;
      const rateVal = Number(inputs.yieldRate) || 0;
      const y = Number(inputs.years) || 12;

      const r = (rateVal / 100) / 12;
      const totalMonths = y * 12;

      let currentVal = start;
      let totalContributed = start;

      for (let i = 0; i < totalMonths; i++) {
        currentVal = (currentVal + monthly) * (1 + r);
        totalContributed += monthly;
      }

      const overallGain = Math.max(0, currentVal - totalContributed);

      return {
        results: [
          { label: 'Ending Portfolio Balance', value: currentVal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Out of Pocket Deposits', value: totalContributed.toFixed(2), unit: '$' },
          { label: 'Nominal Growth Gain', value: overallGain.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Deposited Sums', value: totalContributed, color: '#39FF14' },
          { name: 'Compounded Assets Interest', value: Math.round(overallGain), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'stock-return-calculator',
    name: 'Stock Return Calculator',
    slug: 'stock-return-calculator',
    category: 'finance',
    description: 'Calculate profit margins, capital gains taxes, buy/sell trading commission impacts, and overall return on financial equities.',
    seoTitle: 'Stock Trading Return & ROI Calculator | Calculatoora',
    seoDescription: 'Find buy / sell stock transaction returns. Feed dividend earnings, commissions, and share volumes to compute pure ROI.',
    inputs: [
      { id: 'shares', label: 'Number of Shares Bought', type: 'number', defaultValue: 100, step: 5 },
      { id: 'buy', label: 'Purchase Price per Share', type: 'number', defaultValue: 150, step: 1, unit: '$' },
      { id: 'sell', label: 'Sale Price per Share', type: 'number', defaultValue: 195, step: 1, unit: '$' },
      { id: 'commission', label: 'Total Commissions / Broker Fees', type: 'number', defaultValue: 15, step: 1, unit: '$' },
      { id: 'div', label: 'Cumulative Dividend Income Earned', type: 'number', defaultValue: 250, step: 10, unit: '$' }
    ],
    formula: 'Net Return = (Sale Value - Buy Value) + Dividends - Commissions\nROI = (Net Return / Buy Cost) * 100',
    explanation: 'Isolating equities returns relies on calculating both capital appreciation and ongoing cash flows via dividend payments.',
    example: 'Trading 100 shares of a firm bought at $150 and sold at $195 (adding $250 in dividends, subtracted $15 fee) creates $4,735.00 net gain representing a 31.5% ROI.',
    faq: [
      { question: 'What are capital gains?', answer: 'Capital gains are profits earned by selling assets at prices higher than initial purchase valuations.' }
    ],
    relatedSlugs: ['dividend-calculator', 'cagr-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const count = Number(inputs.shares) || 0;
      const buyP = Number(inputs.buy) || 0;
      const sellP = Number(inputs.sell) || 0;
      const comm = Number(inputs.commission) || 0;
      const divs = Number(inputs.div) || 0;

      const initialCost = count * buyP;
      const saleVal = count * sellP;
      const netGain = (saleVal - initialCost) + divs - comm;
      const roi = initialCost > 0 ? (netGain / initialCost) * 100 : 0;

      return {
        results: [
          { label: 'Net Profit Realized', value: netGain.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Overall Stock ROI', value: roi.toFixed(2), unit: '%' },
          { label: 'Gross Sale Value', value: saleVal.toFixed(2), unit: '$' },
          { label: 'Total Principal Cost', value: initialCost.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Capital Place', value: initialCost, color: '#39FF14' },
          { name: 'Traded Capital gains', value: Math.max(0, netGain), color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'dividend-calculator',
    name: 'Dividend Calculator',
    slug: 'dividend-calculator',
    category: 'finance',
    description: 'Calculate annual income, quarterly or monthly payouts, and cash yields generated from equity dividend assets.',
    seoTitle: 'Dividend Yield & Income Calculator | Calculatoora',
    seoDescription: 'Obtain prospective dividend payments from stock holdings. Account for dividend growth rates over years.',
    inputs: [
      { id: 'shares', label: 'Shares Owned', type: 'number', defaultValue: 250, step: 10 },
      { id: 'price', label: 'Share Price', type: 'number', defaultValue: 85, step: 1, unit: '$' },
      { id: 'divShare', label: 'Annual Dividend per Share', type: 'number', defaultValue: 3.4, step: 0.1, unit: '$' },
      { id: 'growth', label: 'Estimated dividend Growth Rate', type: 'number', defaultValue: 4.5, step: 0.1, unit: '%' }
    ],
    formula: 'Yield = (Dividend Per Share / Stock Price) * 100\nAnnual Income = Shares Owned * Dividend Per Share',
    explanation: 'Dividend-paying stocks offer both capital growth prospects and defensive cash flow reserves.',
    example: 'Owning 250 shares valued at $85 each with a dividend payment of $3.40 per year yields $850.00 in passive yearly payouts, showing a 4.0% yield.',
    faq: [
      { question: 'What is dividend re-investment (DRIP)?', answer: 'DRIP is automatically using cash dividends received to purchase additional fractional shares of the same stock, compounding share density.' }
    ],
    relatedSlugs: ['stock-return-calculator', 'investment-growth-calculator', 'savings-goal-calculator'],
    calculate: (inputs) => {
      const count = Number(inputs.shares) || 0;
      const shPrice = Number(inputs.price) || 1;
      const divS = Number(inputs.divShare) || 0;
      const growth = Number(inputs.growth) || 0;

      const totalValue = count * shPrice;
      const annualInc = count * divS;
      const yieldPct = (divS / shPrice) * 100;
      const monthlyInc = annualInc / 12;

      // Projecting year 5 dividend
      const year5DivS = divS * Math.pow(1 + (growth / 100), 5);
      const year5Inc = count * year5DivS;

      return {
        results: [
          { label: 'Annual Dividend Income', value: annualInc.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Current Dividend Yield', value: yieldPct.toFixed(2), unit: '%' },
          { label: 'Estimated Monthly Income', value: monthlyInc.toFixed(2), unit: '$' },
          { label: 'Projected Portfolio Value', value: totalValue.toFixed(2), unit: '$' },
          { label: 'Year 5 Annual Income Goal', value: year5Inc.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Stock Net Equity', value: totalValue, color: '#39FF14' },
          { name: 'Current Annual Dividends', value: Math.round(annualInc), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'portfolio-calculator',
    name: 'Portfolio Calculator',
    slug: 'portfolio-calculator',
    category: 'finance',
    description: 'Track and balance assets allocations across cash, equity index funds, government bonds, and alternatives.',
    seoTitle: 'Investment Portfolio Allocation Calculator | Calculatoora',
    seoDescription: 'Input different asset weights to rebalance holdings. Maintain visual layouts of asset diversities.',
    inputs: [
      { id: 'stocks', label: 'Stocks & Equities Value', type: 'number', defaultValue: 60000, step: 1000, unit: '$' },
      { id: 'bonds', label: 'Fixed Income / Bonds Value', type: 'number', defaultValue: 25000, step: 1000, unit: '$' },
      { id: 'cash', label: 'Cash & Short-Term Bills Value', type: 'number', defaultValue: 10000, step: 500, unit: '$' },
      { id: 'crypto', label: 'Alternative Assets / Crypto', type: 'number', defaultValue: 5000, step: 500, unit: '$' }
    ],
    formula: 'Allocation Share = (Asset Value / Total Portfolio Value) * 100',
    explanation: 'A diversified portfolio balances volatility across different asset classes according to investor risk profiles.',
    example: 'Placing values of $60k Stocks, $25k Bonds, $10k Cash, and $5k Crypto yields a diversified portfolio totaling $100,000.',
    faq: [
      { question: 'What is rebalancing?', answer: 'Rebalancing is correcting deviations from target asset allocations by selling overperforming pieces and buying underperforming ones.' }
    ],
    relatedSlugs: ['investment-growth-calculator', 'dividend-calculator', 'net-worth-calculator'],
    calculate: (inputs) => {
      const s = Math.max(0, Number(inputs.stocks) || 0);
      const b = Math.max(0, Number(inputs.bonds) || 0);
      const c = Math.max(0, Number(inputs.cash) || 0);
      const alt = Math.max(0, Number(inputs.crypto) || 0);

      const total = s + b + c + alt;
      const sPct = total > 0 ? (s / total) * 100 : 0;
      const bPct = total > 0 ? (b / total) * 100 : 0;
      const cPct = total > 0 ? (c / total) * 100 : 0;
      const altPct = total > 0 ? (alt / total) * 100 : 0;

      return {
        results: [
          { label: 'Stocks Weight', value: sPct.toFixed(1), unit: '%' },
          { label: 'Bonds Weight', value: bPct.toFixed(1), unit: '%' },
          { label: 'Cash Weight', value: cPct.toFixed(1), unit: '%' },
          { label: 'Alternatives Weight', value: altPct.toFixed(1), unit: '%' },
          { label: 'Total Integrated Asset holdings', value: total.toFixed(2), unit: '$', isPrimary: true }
        ],
        chartData: [
          { name: 'Stocks & Indexes', value: s, color: '#39FF14' },
          { name: 'Fixed Revenue Bonds', value: b, color: '#3b82f6' },
          { name: 'Liquid Checking Cash', value: c, color: '#a855f7' },
          { name: 'Alternatives / Crypto', value: alt, color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'retirement-calculator',
    name: 'Retirement Calculator',
    slug: 'retirement-calculator',
    category: 'finance',
    description: 'Model prospective savings nesting eggs to determine whether you can comfortably sustain retirement expenditures.',
    seoTitle: 'Retirement Savings & Nest Egg Calculator | Calculatoora',
    seoDescription: 'Obtain customized projections of retirement net worth. Estimate maximum yearly drawdown sums.',
    inputs: [
      { id: 'age', label: 'Current Age', type: 'number', defaultValue: 30, step: 1, unit: 'years' },
      { id: 'retage', label: 'Target Retirement Age', type: 'number', defaultValue: 65, step: 1, unit: 'years' },
      { id: 'savings', label: 'Current Retirement Savings', type: 'number', defaultValue: 20000, step: 1000, unit: '$' },
      { id: 'monthly', label: 'Monthly Savings Addition', type: 'number', defaultValue: 500, step: 20, unit: '$' },
      { id: 'preYield', label: 'Expected Return Rate (Pre-retirement)', type: 'number', defaultValue: 8.0, step: 0.1, unit: '%' }
    ],
    formula: 'End Value = savings * (1+r)^t + PMT * [((1+r)^(t*12) - 1) / r]',
    explanation: 'Models compound growth prior to cessation of work, indicating prospective long-term nest eggs.',
    example: 'Starting at age 30 with $20k bank balances and adding $500 monthly at 8% compound yield creates a nest egg of $1,349,634.62 by age 65.',
    faq: [
      { question: 'What is the 4% rule?', answer: 'The 4% rule describes a safe historical withdrawal rate from a balanced portfolio that prevents running out of funds over 30 retirement years.' }
    ],
    relatedSlugs: ['pension-calculator', 'financial-independence-calculator', 'savings-goal-calculator'],
    calculate: (inputs) => {
      const ageNow = Number(inputs.age) || 30;
      const ageRet = Number(inputs.retage) || 65;
      const startS = Number(inputs.savings) || 0;
      const addm = Number(inputs.monthly) || 0;
      const rPre = Number(inputs.preYield) || 0;

      const spanY = Math.max(0, ageRet - ageNow);
      const r = (rPre / 100) / 12;
      const totalMonths = spanY * 12;

      let currentVal = startS;
      let totalSavedSelf = startS;

      for (let i = 0; i < totalMonths; i++) {
        currentVal = (currentVal + addm) * (1 + r);
        totalSavedSelf += addm;
      }

      const totalEarnedCompound = Math.max(0, currentVal - totalSavedSelf);
      const drawdown4PctYear = currentVal * 0.04;

      return {
        results: [
          { label: 'Projected Retirement Nest Egg', value: currentVal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Personal Capital Contributions', value: totalSavedSelf.toFixed(2), unit: '$' },
          { label: 'Interest Compounded Growth', value: totalEarnedCompound.toFixed(2), unit: '$' },
          { label: 'First Year Drawdown (4% Rule)', value: drawdown4PctYear.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Self Deposited Funds', value: totalSavedSelf, color: '#39FF14' },
          { name: 'Geometric Growth Cash', value: Math.round(totalEarnedCompound), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'pension-calculator',
    name: 'Pension Calculator',
    slug: 'pension-calculator',
    category: 'finance',
    description: 'Calculate future corporate or state pension annuity payments based on years of service and salary scales.',
    seoTitle: 'Defined Benefit Pension Calculator | Calculatoora',
    seoDescription: 'Obtain accurate pension payouts for workers. Estimate defined benefit cash annuities.',
    inputs: [
      { id: 'salary', label: 'Expected Final Annual Salary', type: 'number', defaultValue: 80000, step: 1000, unit: '$' },
      { id: 'service', label: 'Years of Service Accumulated', type: 'number', defaultValue: 25, step: 1, unit: 'years' },
      { id: 'multiplier', label: 'Pension Factor Multiplier per year', type: 'number', defaultValue: 1.8, step: 0.1, unit: '%' }
    ],
    formula: 'Annual Pension Benefit = Final Salary * (Years of Service) * (Multiplier / 100)',
    explanation: 'A pension calculator models defined benefit payouts. Employees accumulate pension assets proportional to their service duration.',
    example: 'An final salary of $80,000 for 25 years under a 1.8% annual benefit multiplier provides a guaranteed pension of $36,000.00 yearly.',
    faq: [
      { question: 'What is a defined benefit plan?', answer: 'A defined benefit plan (pension) guarantees a specific lifetime monthly payout upon retirement, unlike a defined contribution plan (401k) which depends on market swings.' }
    ],
    relatedSlugs: ['retirement-calculator', 'financial-independence-calculator', 'hourly-wage-calculator'],
    calculate: (inputs) => {
      const sal = Number(inputs.salary) || 0;
      const yrs = Number(inputs.service) || 0;
      const mult = Number(inputs.multiplier) || 0;

      const annualBenefit = sal * yrs * (mult / 100);
      const monthlyBenefit = annualBenefit / 12;

      return {
        results: [
          { label: 'Annual Pension Annuity', value: annualBenefit.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Pension income', value: monthlyBenefit.toFixed(2), unit: '$' },
          { label: 'Income Replacement Ratio', value: ((annualBenefit / sal) * 100).toFixed(1), unit: '%' }
        ],
        chartData: [
          { name: 'Retained Pension Income', value: Math.round(annualBenefit), color: '#39FF14' },
          { name: 'Forfeited Salary Wedge', value: Math.max(0, sal - annualBenefit), color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'savings-goal-calculator',
    name: 'Savings Goal Calculator',
    slug: 'savings-goal-calculator',
    category: 'finance',
    description: 'Isolate the required periodic monthly deposits needed to hit a future financial nest egg target.',
    seoTitle: 'Savings Goal Calculator - Target Savings | Calculatoora',
    seoDescription: 'Obtain precise monthly savings metrics required to achieve capital goals. Account for compounding dividend yields.',
    inputs: [
      { id: 'target', label: 'Target Savings Goal', type: 'number', defaultValue: 50000, step: 1000, unit: '$' },
      { id: 'start', label: 'Current Starting Balance', type: 'number', defaultValue: 5000, step: 100, unit: '$' },
      { id: 'rate', label: 'Annual Compound Yield Rate', type: 'number', defaultValue: 5.0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Time Horizon to Hit Goal', type: 'number', defaultValue: 5, step: 1, unit: 'years' }
    ],
    formula: 'Monthly Contribution = [Target - PV*(1+r)^n] / [((1+r)^n - 1)/r]',
    explanation: 'This calculator works backward from a future investment goal, subtracting growth on your starting balance to find the necessary monthly savings outline.',
    example: 'Reaching a $50,000 goal in 5 years starting with $5,000 in a 5.0% compound account requires monthly deposits of $639.46.',
    faq: [
      { question: 'Does a starting balance reduce payments?', answer: 'Yes, starting capital compounds over the timeline, which decreases the monthly contribution required to hit the target.' }
    ],
    relatedSlugs: ['investment-growth-calculator', 'sip-calculator', 'compound-interest-calculator-advanced'],
    calculate: (inputs) => {
      const target = Number(inputs.target) || 1;
      const start = Number(inputs.start) || 0;
      const rateVal = Number(inputs.rate) || 0;
      const y = Number(inputs.years) || 1;

      const r = (rateVal / 100) / 12;
      const n = y * 12;

      const futureValueOfStart = start * Math.pow(1 + r, n);
      const remainingDeficit = Math.max(0, target - futureValueOfStart);

      let mandatoryMonthlyContribution = 0;
      if (r === 0) {
        mandatoryMonthlyContribution = remainingDeficit / n;
      } else {
        mandatoryMonthlyContribution = remainingDeficit / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
      }

      const totalSelfContributed = start + (mandatoryMonthlyContribution * n);
      const interestHarvested = Math.max(0, target - totalSelfContributed);

      return {
        results: [
          { label: 'Required Monthly Contribution', value: mandatoryMonthlyContribution.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Deficit Solved from Compound Growth', value: interestHarvested.toFixed(2), unit: '$' },
          { label: 'Your Out of pocket Outflow', value: totalSelfContributed.toFixed(2), unit: '$' },
          { label: 'Present Value Offset', value: futureValueOfStart.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Self Cash Deposited', value: Math.round(totalSelfContributed), color: '#39FF14' },
          { name: 'Interest Yield Subsidy', value: Math.round(interestHarvested), color: '#3b82f6' }
        ]
      };
    }
  }
];
