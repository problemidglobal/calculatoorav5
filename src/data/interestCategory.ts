import { Calculator } from '../types';

export const INTEREST_CALCULATORS: Calculator[] = [
  {
    id: 'simple-interest-calculator',
    name: 'Simple Interest Calculator',
    slug: 'simple-interest-calculator',
    category: 'finance',
    description: 'Calculate simple interest earnings or payouts on base balances over flexible daily, monthly, or yearly periods.',
    seoTitle: 'Simple Interest Calculator (I = PRT) | Calculatoora',
    seoDescription: 'Perform rapid calculations of simple interest using the formula I = PRT. Analyze principal growth without compound accumulation.',
    inputs: [
      { id: 'principal', label: 'Starting Principal', type: 'number', defaultValue: 10000, step: 100, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 5.0, step: 0.1, unit: '%' },
      { id: 'time', label: 'Duration (Years)', type: 'number', defaultValue: 5, step: 1, unit: 'years' }
    ],
    formula: 'I = P * R * T\nWhere I is interest earned, P is principal, R is annual rate (decimal), and T is term duration in years.',
    explanation: 'Simple interest does not compound: interest is calculated purely on the initial principal value. Each year yields identical interest dollar amount payouts.',
    example: 'Depositing $10,000 at a 5.0% flat simple interest rate for 5 years yields $2,500 total interest, building a final balance of $12,500.',
    faq: [
      { question: 'What is the standard formula for simple interest?', answer: 'The formula is Interest (I) = Principal (P) * Rate (R) * Time (T).' },
      { question: 'Where is simple interest normally used?', answer: 'It is typically utilized in short-term personal notes, specific structured certificates of deposits, and basic car pawn operations.' }
    ],
    relatedSlugs: ['compound-interest-calculator-advanced', 'daily-interest-calculator', 'monthly-interest-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const rate = Number(inputs.rate) || 0;
      const t = Number(inputs.time) || 0;

      const r = rate / 100;
      const interestVal = p * r * t;
      const totalVal = p + interestVal;

      return {
        results: [
          { label: 'Interest Earned', value: interestVal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Initial Principal', value: p.toFixed(2), unit: '$' },
          { label: 'Total Accumulated Value', value: totalVal.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Principal', value: p, color: '#39FF14' },
          { name: 'Simple Interest Accumulation', value: Math.round(interestVal), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'compound-interest-calculator-advanced',
    name: 'Compound Interest Advanced',
    slug: 'compound-interest-calculator-advanced',
    category: 'finance',
    description: 'Calculate compound interest schedules with flexible compounding frequencies, monthly additions, and visual balance tracking.',
    seoTitle: 'Compound Interest Calculator Advanced | Calculatoora',
    seoDescription: 'Find compound interest growth on investments. Add monthly contributions and select compounding periods (daily, monthly, yearly).',
    inputs: [
      { id: 'principal', label: 'Initial Deposit', type: 'number', defaultValue: 10000, step: 500, unit: '$' },
      { id: 'addition', label: 'Monthly Addition', type: 'number', defaultValue: 250, step: 10, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate (APR)', type: 'number', defaultValue: 8.0, step: 0.1, unit: '%' },
      { id: 'years', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 10, step: 1, unit: 'years' },
      { id: 'frequency', label: 'Compounding frequency', type: 'select', defaultValue: 12, options: [
        { label: 'Daily (365/yr)', value: 365 },
        { label: 'Monthly (12/yr)', value: 12 },
        { label: 'Quarterly (4/yr)', value: 4 },
        { label: 'Annually (1/yr)', value: 1 }
      ]}
    ],
    formula: 'A = P*(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)] * (1 + r/n)\nWhere P is initial principal, PMT is monthly addition, r is APR, n is compound periods per year, and t is years.',
    explanation: 'Compound interest calculates earnings on previous interest cycles, generating exponential speed of growth over extended periods.',
    example: 'An initial $10,000 principal at 8% compound monthly interest with standard additions of $250/month over 10 years grows into a total of $67,787.05.',
    faq: [
      { question: 'What does compounding mean?', answer: 'Compounding means you earn interest on both your initial principal deposit and also on any previous interest earnings accumulated in previous cycles.' },
      { question: 'Does daily compounding produce much more utility than annual compounding?', answer: 'Yes, because daily compounding calculates and adds interest values on 365 cycles per year, enabling a slightly higher effective yield.' }
    ],
    relatedSlugs: ['simple-interest-calculator', 'investment-growth-calculator', 'savings-goal-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const pmt = Number(inputs.addition) || 0;
      const rateVal = Number(inputs.rate) || 0;
      const t = Number(inputs.years) || 0;
      const n = Number(inputs.frequency) || 12;

      const r = rateVal / 100;
      const totalContributions = p + (pmt * 12 * t);

      let finalSum = p;
      if (r === 0) {
        finalSum = totalContributions;
      } else {
        // Run calculation month-by-month for extreme accuracy with additions
        const monthsTotal = t * 12;
        const interestRatePerMonth = r / 12;
        
        finalSum = p * Math.pow(1 + r/n, n * t);
        
        // Add contribution compounding factor
        let additionCompoundPart = 0;
        for (let m = 1; m <= monthsTotal; m++) {
          const monthsLeft = monthsTotal - m;
          additionCompoundPart += pmt * Math.pow(1 + r/n, n * (monthsLeft / 12));
        }
        finalSum += additionCompoundPart;
      }

      const interestVal = Math.max(0, finalSum - totalContributions);

      return {
        results: [
          { label: 'Final Account Value', value: finalSum.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Capital Contributed', value: totalContributions.toFixed(2), unit: '$' },
          { label: 'Total Interest Earned', value: interestVal.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Deposit', value: p, color: '#39FF14' },
          { name: 'Total Monthly Additions', value: Math.max(0, totalContributions - p), color: '#a855f7' },
          { name: 'Total Cumulative Interest', value: Math.round(interestVal), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'daily-interest-calculator',
    name: 'Daily Interest Calculator',
    slug: 'daily-interest-calculator',
    category: 'finance',
    description: 'Calculate daily accrual rates and cumulative interest over precise numbers of days.',
    seoTitle: 'Daily Interest Accrual Calculator | Calculatoora',
    seoDescription: 'Evaluate daily interest generation on checking, savings, or commercial lines. Predict payouts based on 365 or 360 day methods.',
    inputs: [
      { id: 'principal', label: 'Principal Sum', type: 'number', defaultValue: 15000, step: 500, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate (APR)', type: 'number', defaultValue: 4.5, step: 0.1, unit: '%' },
      { id: 'days', label: 'Accrual Period (Days)', type: 'number', defaultValue: 90, step: 1, unit: 'days' }
    ],
    formula: 'Interest = Principal * (APR / 365 / 100) * Days',
    explanation: 'Many financial services track balances on a daily basis. Knowing how many cents accrue daily is useful for checking accounts or high-yield bills.',
    example: 'For a $15,000 balance at 4.5% annual APR, the interest grows by $1.85 daily, yielding $166.44 after 90 days.',
    faq: [
      { question: 'What is the 360 vs 365 day method?', answer: 'The 365-day method spreads interest evenly over 365 days. The 360-day method (often used in corporate notes) assumes 12 months with exactly 30 days.' }
    ],
    relatedSlugs: ['simple-interest-calculator', 'monthly-interest-calculator', 'annual-interest-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const rate = Number(inputs.rate) || 0;
      const days = Number(inputs.days) || 0;

      const dailyRate = (rate / 100) / 365;
      const dailyEarn = p * dailyRate;
      const totalEarn = dailyEarn * days;

      return {
        results: [
          { label: 'Cumulative Interest', value: totalEarn.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Daily Accrual Yield', value: dailyEarn.toFixed(2), unit: '$' },
          { label: 'Account Ending Balance', value: (p + totalEarn).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Base Principal', value: p, color: '#39FF14' },
          { name: 'Daily Interest', value: Math.round(totalEarn), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'monthly-interest-calculator',
    name: 'Monthly Interest Calculator',
    slug: 'monthly-interest-calculator',
    category: 'finance',
    description: 'Calculate interest payment schedules on a monthly basis for standard loan portfolios or personal savings.',
    seoTitle: 'Monthly Interest Payment Calculator | Calculatoora',
    seoDescription: 'Obtain precise monthly interest schedules. Predict monthly earnings on principal deposits immediately.',
    inputs: [
      { id: 'principal', label: 'Deposit or Principal', type: 'number', defaultValue: 25000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Annual rate', type: 'number', defaultValue: 5.25, step: 0.1, unit: '%' },
      { id: 'months', label: 'Duration (Months)', type: 'number', defaultValue: 24, step: 1, unit: 'months' }
    ],
    formula: 'Monthly Interest = Principal * (APR / 12 / 100)',
    explanation: 'A monthly interest calculator assumes standard annual interest values represent discrete interest splits delivered or accumulated on a monthly basis.',
    example: 'A $25,000 CD earning 5.25% APR yields $109.38 interest per month, totaling $2,625.00 in 24 months.',
    faq: [
      { question: 'What is monthly compounding?', answer: 'Compounding monthly means interest is computed on the outstanding balance once per calendar month, compounding prior gains.' }
    ],
    relatedSlugs: ['simple-interest-calculator', 'daily-interest-calculator', 'annual-interest-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const rate = Number(inputs.rate) || 0;
      const m = Number(inputs.months) || 0;

      const monthlyRate = (rate / 100) / 12;
      const monthlyInt = p * monthlyRate;
      const cumulativeInterest = monthlyInt * m;

      return {
        results: [
          { label: 'Total Period Interest', value: cumulativeInterest.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Standard Monthly Interest', value: monthlyInt.toFixed(2), unit: '$' },
          { label: 'Projected Total Value', value: (p + cumulativeInterest).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Capital Account', value: p, color: '#39FF14' },
          { name: 'Accumulated Monthly Yield', value: Math.round(cumulativeInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'annual-interest-calculator',
    name: 'Annual Interest Calculator',
    slug: 'annual-interest-calculator',
    category: 'finance',
    description: 'Track yearly interest earnings over multi-year spans, comparing flat-rate return values with reinvestment options.',
    seoTitle: 'Annual Interest & Yield Calculator | Calculatoora',
    seoDescription: 'Evaluate compound annually vs straightforward flat annual interest distributions with our online calculator.',
    inputs: [
      { id: 'principal', label: 'Starting Principal', type: 'number', defaultValue: 50000, step: 2000, unit: '$' },
      { id: 'rate', label: 'Annual Rate (APR)', type: 'number', defaultValue: 4.8, step: 0.1, unit: '%' },
      { id: 'years', label: 'Term in Years', type: 'number', defaultValue: 6, step: 1, unit: 'years' }
    ],
    formula: 'A = P * (1 + r)^t\nWhere r is annual interest rate and t is years.',
    explanation: 'An annual interest calculator models yearly payouts. Reinvested annual interest compounds annually.',
    example: 'Investing $50,000 at 4.8% compounding annually yields $16,211.59 in 6 years.',
    faq: [
      { question: 'What is APY?', answer: 'APY stands for Annual Percentage Yield, representing the true compound yield which is higher than nominal APR when compounding occurs multi-times.' }
    ],
    relatedSlugs: ['monthly-interest-calculator', 'compound-interest-calculator-advanced', 'effective-interest-rate-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 0;
      const rate = Number(inputs.rate) || 0;
      const yrs = Number(inputs.years) || 1;

      const r = rate / 100;
      const compoundFinal = p * Math.pow(1 + r, yrs);
      const compoundInt = Math.max(0, compoundFinal - p);
      const simpleFinal = p + (p * r * yrs);
      const simpleInt = Math.max(0, simpleFinal - p);

      return {
        results: [
          { label: 'Compound Final Value', value: compoundFinal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Reinvested compound Interest', value: compoundInt.toFixed(2), unit: '$' },
          { label: 'Flat Simple Interest (Paid Out)', value: simpleInt.toFixed(2), unit: '$' },
          { label: 'Compound Over Simple Outperformance', value: Math.max(0, compoundFinal - simpleFinal).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Principal', value: p, color: '#39FF14' },
          { name: 'Compound Interest Growth', value: Math.round(compoundInt), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'interest-rate-calculator',
    name: 'Interest Rate Calculator',
    slug: 'interest-rate-calculator',
    category: 'finance',
    description: 'Solve for the missing annual percentage interest rate (APR) when the starting principal, ending sum, and time duration parameters are known.',
    seoTitle: 'Interest Rate Finder & APR Calculator | Calculatoora',
    seoDescription: 'Calculate the accurate interest rate or APR required to transform a current principal balance into a target future weight.',
    inputs: [
      { id: 'principal', label: 'Principal Sum', type: 'number', defaultValue: 5000, step: 100, unit: '$' },
      { id: 'future', label: 'Ending Future Value', type: 'number', defaultValue: 7500, step: 100, unit: '$' },
      { id: 'years', label: 'Time Span (Years)', type: 'number', defaultValue: 5, step: 0.5, unit: 'years' }
    ],
    formula: 'R = [(Future Value / Principal)^(1/Years)] - 1\nThis calculates the compound annual interest rate.',
    explanation: 'Allows planners to discover what specific yield or compound growth margins are necessary to hit specific goals.',
    example: 'Growing $5,000 into $7,500 over 5 years mandates a compound interest rate of 8.45% annually.',
    faq: [
      { question: 'What is the simple interest rate formula?', answer: 'Simple interest rate is computed as R = Interest / (Principal * Years).' }
    ],
    relatedSlugs: ['effective-interest-rate-calculator', 'cagr-calculator', 'present-value-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 1;
      const f = Number(inputs.future) || 1;
      const y = Number(inputs.years) || 1;

      // Compound rate
      const compoundRate = (Math.pow(f / p, 1 / y) - 1) * 100;
      // Simple rate
      const simpleRate = ((f - p) / (p * y)) * 100;

      return {
        results: [
          { label: 'Required Compound Rate', value: compoundRate.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Required Simple Rate', value: simpleRate.toFixed(2), unit: '%' },
          { label: 'Absolute Dollars Margin', value: (f - p).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Sum', value: p, color: '#39FF14' },
          { name: 'Goal Growth Gap', value: Math.max(0, f - p), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'effective-interest-rate-calculator',
    name: 'Effective Interest Rate',
    slug: 'effective-interest-rate-calculator',
    category: 'finance',
    description: 'Calculate the Effective Annual Rate (EAR) or Annual Percentage Yield (APY) given the nominal interest rate and compounding frequency.',
    seoTitle: 'Effective Interest Rate APY Calculator | Calculatoora',
    seoDescription: 'Covert nominal APR into Effective Annual Rate (EAR) to accurately evaluate credit cards, home loans, or savings products.',
    inputs: [
      { id: 'nominal', label: 'Nominal rate (APR)', type: 'number', defaultValue: 12.0, step: 0.1, unit: '%' },
      { id: 'compounding', label: 'Compounding frequency', type: 'select', defaultValue: 12, options: [
        { label: 'Daily (365/yr)', value: 365 },
        { label: 'Monthly (12/yr)', value: 12 },
        { label: 'Quarterly (4/yr)', value: 4 },
        { label: 'Semiannually (2/yr)', value: 2 },
        { label: 'Continuously', value: 99999 }
      ]}
    ],
    formula: 'Continuous compounding: EAR = e^r - 1\nDiscrete compounding: EAR = (1 + r/n)^n - 1\nWhere r is nominal APR, and n represents compounds.',
    explanation: 'Because compounding accrues interest on interest, the real annual cost or yield is higher than the nominal rate. Credit card interest compounds daily, which raises the effective cost.',
    example: 'A 12% nominal credit card rate compounding daily equates to a 12.75% Effective Annual Rate (EAR) or APY.',
    faq: [
      { question: 'Why is EAR important?', answer: 'EAR represents the true economic cost or yield of a product, making it the perfect metric to compare loans or savings models.' }
    ],
    relatedSlugs: ['interest-rate-calculator', 'compound-interest-calculator-advanced', 'loan-comparison-calculator'],
    calculate: (inputs) => {
      const rNominal = Number(inputs.nominal) || 0;
      const n = Number(inputs.compounding) || 12;

      const r = rNominal / 100;
      let ear = 0;

      if (n === 99999) {
        ear = (Math.exp(r) - 1) * 100;
      } else {
        ear = (Math.pow(1 + r/n, n) - 1) * 100;
      }

      return {
        results: [
          { label: 'Effective Annual Rate (EAR)', value: ear.toFixed(4), unit: '%', isPrimary: true },
          { label: 'Nominal Annual Rate (APR)', value: rNominal.toFixed(2), unit: '%' },
          { label: 'APR vs EAR premium margin', value: (ear - rNominal).toFixed(4), unit: '%' }
        ],
        chartData: [
          { name: 'Nominal Base APR', value: rNominal, color: '#39FF14' },
          { name: 'Compounding APY Premium', value: ear - rNominal, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'cumulative-interest-calculator',
    name: 'Cumulative Interest Calculator',
    slug: 'cumulative-interest-calculator',
    category: 'finance',
    description: 'Analyze cumulative interest schedules, payment allocations, extra payment savings, and running totals over custom date ranges.',
    seoTitle: 'Cumulative Interest Calculator | Calculatoora',
    seoDescription: 'Calculate the total cumulative interest accumulated and paid on a loan over time. Plan extra payments to save interest with smart insights.',
    inputs: [
      { id: 'loanAmount', label: 'Loan Amount', type: 'number', defaultValue: '', step: 1000, unit: '$' },
      { id: 'interestRate', label: 'Interest Rate', type: 'number', defaultValue: '', step: 0.1, unit: '%' },
      { id: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: '', step: 1, unit: 'years' }
    ],
    formula: 'Monthly Payment = P * (r * (1 + r)^n) / ((1 + r)^n - 1)\nCumulative Interest = Sum of (Balance * r) across periods\nInterest Saved = Original Cumulative Interest - New Cumulative Interest',
    explanation: 'Tracks the month-by-month interest accrual on amortized loans, demonstrating why interest is paid primarily in the initial years and how extra payments accelerate savings.',
    example: 'A $300,000 loan at 6% interest for 30 years will accumulate $347,514.57 in total interest. Adding an extra $200 per month saves $64,286.99 in cumulative interest and reduces the term by 5 years.',
    faq: [
      { question: 'What is cumulative interest?', answer: 'Cumulative interest is the running sum of all interest payments made over the duration of a loan or a specific portion of its life.' },
      { question: 'Why is interest higher during early payments?', answer: 'Interest is calculated on the remaining principal balance. Because the principal balance is highest at the beginning of the loan, the early payments allocate a larger share to interest and a smaller share to principal.' }
    ],
    relatedSlugs: ['simple-interest-calculator', 'compound-interest-calculator-advanced', 'loan-comparison-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.loanAmount) || 0;
      const rateVal = Number(inputs.interestRate) || 0;
      const t = Number(inputs.loanTerm) || 0;
      
      if (p <= 0 || rateVal === 0 || t <= 0) {
        return {
          results: [
            { label: 'Cumulative Interest', value: '0.00', unit: '$', isPrimary: true }
          ]
        };
      }
      
      const r = (rateVal / 100) / 12;
      const n = t * 12;
      const monthlyPayment = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalInterest = (monthlyPayment * n) - p;
      
      return {
        results: [
          { label: 'Estimated Total Interest', value: totalInterest.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Base Payment', value: monthlyPayment.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Principal Repaid', value: p, color: '#39FF14' },
          { name: 'Cumulative Interest', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  }
];
