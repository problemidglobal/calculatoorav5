import { Calculator } from '../types';

export const LOAN_CALCULATORS: Calculator[] = [
  {
    id: 'personal-loan-calculator',
    name: 'Personal Loan Calculator',
    slug: 'personal-loan-calculator',
    category: 'finance',
    description: 'Calculate monthly payments, total payments, and total interest on a personal loan with fixed interest rates and flexible terms.',
    seoTitle: 'Personal Loan Payment Calculator | Calculatoora',
    seoDescription: 'Find your monthly personal loan payments and total interest instantly. Run comparisons of terms and APR options.',
    inputs: [
      { id: 'amount', label: 'Loan Amount', type: 'number', defaultValue: 5000, step: 100, unit: '$' },
      { id: 'rate', label: 'Interest Rate (APR)', type: 'number', defaultValue: 10.5, step: 0.1, unit: '%' },
      { id: 'term', label: 'Term (Months)', type: 'number', defaultValue: 36, step: 1, unit: 'months' }
    ],
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]\nWhere P is loan amount, r is monthly interest (APR/12/100), and n is term in months.',
    explanation: 'A personal loan calculator computes fixed equal monthly installments (EMI). Personal loans are typically unsecured with interest rates heavily reliant on credit ratings.',
    example: 'A $5,000 personal loan with a 10.5% interest rate over 36 months requires a monthly payment of $162.53, resulting in $851.05 total interest.',
    faq: [
      { question: 'What is APR?', answer: 'APR stands for Annual Percentage Rate. It is the yearly cost of borrowing, which includes both the basic interest rate and any prepaid fees or administrative costs.' },
      { question: 'Are personal loan rates fixed?', answer: 'Most personal loans feature fixed interest rates, meaning your monthly installment remains exactly the same for the lifetime of the loan.' }
    ],
    relatedSlugs: ['loan-payment-calculator', 'loan-comparison-calculator', 'debt-snowball-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const n = Number(inputs.term) || 0;
      const r = (rate / 100) / 12;

      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }
      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Principal', value: p.toFixed(2), unit: '$' },
          { label: 'Total Interest Paid', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Total Overall Cost', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Loan Principal', value: p, color: '#39FF14' },
          { name: 'Total Interest', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'home-loan-calculator',
    name: 'Home Loan Calculator',
    slug: 'home-loan-calculator',
    category: 'finance',
    description: 'Calculate monthly payments, property taxes, home insurance, and complete repayment costs for home loans.',
    seoTitle: 'Home Loan & Mortgage Calculator | Calculatoora',
    seoDescription: 'Accurately estimate home loan repayments including options for taxes, insurance premiums, and total purchase prices.',
    inputs: [
      { id: 'price', label: 'Home Value', type: 'number', defaultValue: 300000, step: 1000, unit: '$' },
      { id: 'down', label: 'Down Payment', type: 'number', defaultValue: 60000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 6.5, step: 0.1, unit: '%' },
      { id: 'term', label: 'Term (Years)', type: 'number', defaultValue: 30, step: 1, unit: 'years' },
      { id: 'tax', label: 'Annual Property Tax Rate', type: 'number', defaultValue: 1.2, step: 0.05, unit: '%' }
    ],
    formula: 'Monthly Base = Principal * [r(1+r)^n] / [(1+r)^n - 1] + Monthly Property Tax\nWhere Principal = Home Value - Down Payment.',
    explanation: 'Home loans or mortgages are long-term secured loans structured over 15 to 30 years. Besides base payments, home ownership includes ongoing liabilities such as property tax.',
    example: 'For a $300,000 home with a $60,000 down payment (borrowing $240,000) at 6.5% interest over 30 years, monthly principal & interest is $1,516.94 and property tax is $300.00, totaling $1,816.94.',
    faq: [
      { question: 'What is a typical down payment?', answer: 'A traditional down payment is 20% of the home purchase price. Putting down less than 20% might require Private Mortgage Insurance (PMI).' },
      { question: 'How is property tax computed monthly?', answer: 'Annual property tax is calculated as (Home Value * Tax Rate) / 100, which is then divided by 12 to acquire the monthly addition.' }
    ],
    relatedSlugs: ['mortgage-calculator', 'rent-vs-buy-calculator', 'property-roi-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.price) || 0;
      const down = Number(inputs.down) || 0;
      const rate = Number(inputs.rate) || 0;
      const termY = Number(inputs.term) || 30;
      const taxRate = Number(inputs.tax) || 0;

      const p = Math.max(0, price - down);
      const r = (rate / 100) / 12;
      const n = termY * 12;

      let monthlyBase = 0;
      if (r === 0) {
        monthlyBase = n > 0 ? p / n : 0;
      } else {
        monthlyBase = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const monthlyTax = (price * (taxRate / 100)) / 12;
      const totalMonthly = monthlyBase + monthlyTax;
      const totalPaid = totalMonthly * n;
      const totalInterest = Math.max(0, (monthlyBase * n) - p);

      return {
        results: [
          { label: 'Total Monthly Repayment', value: totalMonthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Principal & Interest', value: monthlyBase.toFixed(2), unit: '$' },
          { label: 'Monthly Property Tax', value: monthlyTax.toFixed(2), unit: '$' },
          { label: 'Total Interest Over Term', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Total Projected Cost', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Loan Principal', value: p, color: '#39FF14' },
          { name: 'Total Interest', value: Math.round(totalInterest), color: '#3b82f6' },
          { name: 'Cumulative Property Taxes', value: Math.round(monthlyTax * n), color: '#a855f7' }
        ]
      };
    }
  },
  {
    id: 'car-loan-calculator',
    name: 'Car Loan Calculator',
    slug: 'car-loan-calculator',
    category: 'finance',
    description: 'Calculate monthly auto loan installments, sales taxes, dealer fees, and purchase valuations.',
    seoTitle: 'Car Loan Monthly Payment Calculator | Calculatoora',
    seoDescription: 'Estimate your direct car loan payments. Account for purchasing discounts, trade-ins, sales taxes, and terms.',
    inputs: [
      { id: 'price', label: 'Vehicle Retail Price', type: 'number', defaultValue: 25000, step: 500, unit: '$' },
      { id: 'down', label: 'Down Payment', type: 'number', defaultValue: 4000, step: 100, unit: '$' },
      { id: 'trade', label: 'Trade-in value', type: 'number', defaultValue: 1500, step: 100, unit: '$' },
      { id: 'tax', label: 'Sales Tax Rate', type: 'number', defaultValue: 6.25, step: 0.1, unit: '%' },
      { id: 'rate', label: 'Car Loan Interest Rate', type: 'number', defaultValue: 5.0, step: 0.1, unit: '%' },
      { id: 'term', label: 'Term (Months)', type: 'number', defaultValue: 60, step: 1, unit: 'months' }
    ],
    formula: 'Principal = Vehicle Price - Down Payment - Trade-in + Sales Tax Amount\nAmortized EMI formulas apply on computed Principal.',
    explanation: 'A Car Loan Calculator estimates the monthly payment and total lifetime cost of buying a car by incorporating your trade-in asset value, cash down payment, and State sales tax.',
    example: 'For a $25,000 vehicle with $4,000 down, $1,500 trade-in value, 6.25% sales tax (adding $1,562.50 to cost), and 5.0% interest over 60 months, the monthly payment is $401.44.',
    faq: [
      { question: 'Does a car trade-in lower sales tax?', answer: 'In many states or countries, your trade-in amount is deducted from the vehicle price before calculating sales tax, saving you cash.' },
      { question: 'What is a typical term for a car loan?', answer: 'Car loan terms are typically structured between 36 to 72 months. Shorter terms save interest but possess higher monthly payments.' }
    ],
    relatedSlugs: ['auto-loan-payment-calculator', 'loan-comparison-calculator', 'personal-loan-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.price) || 0;
      const down = Number(inputs.down) || 0;
      const trade = Number(inputs.trade) || 0;
      const taxRate = Number(inputs.tax) || 0;
      const rate = Number(inputs.rate) || 0;
      const n = Number(inputs.term) || 60;

      const salesTax = price * (taxRate / 100);
      const p = Math.max(0, price - down - trade + salesTax);
      const r = (rate / 100) / 12;

      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Sales Tax', value: salesTax.toFixed(2), unit: '$' },
          { label: 'Amount Financed', value: p.toFixed(2), unit: '$' },
          { label: 'Total Interest Paid', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Total Cost (Out of Pocket)', value: (totalPaid + down + trade).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Vehicle Principal', value: Math.round(price - down - trade), color: '#39FF14' },
          { name: 'Sales Tax', value: Math.round(salesTax), color: '#ef4444' },
          { name: 'Total Interest', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'student-loan-calculator',
    name: 'Student Loan Calculator',
    slug: 'student-loan-calculator',
    category: 'finance',
    description: 'Find your monthly student loan payments, total interest over time, and evaluate the impact of different terms.',
    seoTitle: 'Student Loan Repayment Calculator | Calculatoora',
    seoDescription: 'Obtain exact student loan monthly repayments, interest accumulation, and compound variables across major terms.',
    inputs: [
      { id: 'balance', label: 'Starting Student Loan Balance', type: 'number', defaultValue: 35000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Interest Rate', type: 'number', defaultValue: 6.8, step: 0.1, unit: '%' },
      { id: 'term', label: 'Repayment Term (Years)', type: 'number', defaultValue: 10, step: 1, unit: 'years' }
    ],
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]\nStandard amortizing formula where term is represented in years and multiplied by 12.',
    explanation: 'A student loan calculator operates over a typical ten-year standard repayment timeline. It allows users to quickly calculate cumulative Interest charges on state or private university balances.',
    example: 'A $35,000 university loan at 6.8% interest with a 10-year repayment term results in a monthly payment of $402.78 and a total lifetime payment of $48,333.60.',
    faq: [
      { question: 'What is a student loan grace period?', answer: 'A grace period is a set time (normally six months) after graduation during which the borrower is not required to make monthly loan payments. Interest may still accrue.' },
      { question: 'Can I pay off student debt early?', answer: 'Yes, almost all federal and private student loans in the US allow prepayments without penalties, reducing your interest liabilities.' }
    ],
    relatedSlugs: ['loan-payment-calculator', 'personal-loan-calculator', 'loan-comparison-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.balance) || 0;
      const rate = Number(inputs.rate) || 0;
      const termY = Number(inputs.term) || 10;

      const r = (rate / 100) / 12;
      const n = termY * 12;

      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Principal', value: p.toFixed(2), unit: '$' },
          { label: 'Total Interest Accrued', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Total Lifetime Repayment', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Student Loan Debt', value: p, color: '#39FF14' },
          { name: 'Total Interest Charge', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'business-loan-calculator',
    name: 'Business Loan Calculator',
    slug: 'business-loan-calculator',
    category: 'finance',
    description: 'Calculate monthly corporate payments, interest spreads, upfront setup fees, and true annual borrowing margins.',
    seoTitle: 'Commercial & Business Loan Calculator | Calculatoora',
    seoDescription: 'Obtain commercial loan monthly installments, absolute product costs, and processing fee metrics.',
    inputs: [
      { id: 'amount', label: 'Commercial Principal', type: 'number', defaultValue: 150000, step: 5000, unit: '$' },
      { id: 'rate', label: 'Nominal Annual Interest Rate', type: 'number', defaultValue: 8.5, step: 0.1, unit: '%' },
      { id: 'term', label: 'Loan Term (Months)', type: 'number', defaultValue: 48, step: 1, unit: 'months' },
      { id: 'fee', label: 'Upfront Origination Fee', type: 'number', defaultValue: 2, step: 0.5, unit: '%' }
    ],
    formula: 'Monthly Base = Amount * [r(1+r)^n] / [(1+r)^n - 1]\nUpfront fee is computed directly from Initial Principal.',
    explanation: 'Business loans fuel working capital or equipment expansion. Banks frequently charge upfront origination fees, which are added to the general financial profile.',
    example: 'For a $150,000 business loan at 8.5% over 48 months with a 2% ($3,000) origination fee, your monthly payment is $3,698.37 and total true borrowing cost is $180,521.84.',
    faq: [
      { question: 'What is an origination fee?', answer: 'It is an upfront fee charged by lenders to process and organize a new loan application. It is typically deducted from the disbursement value.' },
      { question: 'What collateral is required for business loans?', answer: 'This varies, but may involve real estate, corporate equipment, inventory, or a personal liability guarantee.' }
    ],
    relatedSlugs: ['loan-comparison-calculator', 'loan-payoff-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const n = Number(inputs.term) || 48;
      const feePercent = Number(inputs.fee) || 0;

      const r = (rate / 100) / 12;
      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const origFee = p * (feePercent / 100);
      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Monthly Repayment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Upfront Fee Amount', value: origFee.toFixed(2), unit: '$' },
          { label: 'Total Interest Charge', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Real Net Disbursement', value: (p - origFee).toFixed(2), unit: '$' },
          { label: 'Total Nominal Cost', value: (totalPaid + origFee).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Net Money Received', value: Math.round(p - origFee), color: '#39FF14' },
          { name: 'Upfront Origami Fee', value: Math.round(origFee), color: '#ef4444' },
          { name: 'Total Interest Spent', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'auto-loan-payment-calculator',
    name: 'Auto Loan Payment Calculator',
    slug: 'auto-loan-payment-calculator',
    category: 'finance',
    description: 'Calculate monthly payments and total cost specifically for auto loans under fixed terms and interest rates.',
    seoTitle: 'Auto Loan Payment Calculator - Car Financing | Calculatoora',
    seoDescription: 'Calculate vehicle financing payments, interest accrual, and total payment timelines accurately.',
    inputs: [
      { id: 'amount', label: 'Vehicle Loan Amount', type: 'number', defaultValue: 20000, step: 500, unit: '$' },
      { id: 'rate', label: 'Interest Rate (APR)', type: 'number', defaultValue: 4.8, step: 0.1, unit: '%' },
      { id: 'term', label: 'Financing Term (Months)', type: 'number', defaultValue: 60, step: 1, unit: 'months' }
    ],
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Focuses purely on vehicle financing contracts. It delivers precise breakdowns of principal vs interest ratios.',
    example: 'Borrowing $20,000 at 4.8% APR over 60 months results in a monthly payment of $375.56, with $2,533.60 total interest paid.',
    faq: [
      { question: 'What is a healthy auto financing term?', answer: 'Financial advisors recommend choosing 48 or 60 months to prevent the car depreciating faster than the loan balance represents.' }
    ],
    relatedSlugs: ['car-loan-calculator', 'loan-payment-calculator', 'loan-payoff-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const n = Number(inputs.term) || 60;

      const r = (rate / 100) / 12;
      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Financed Principal', value: p.toFixed(2), unit: '$' },
          { label: 'Total Interest Charge', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Total Repayment Cost', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Vehicle Debt', value: p, color: '#39FF14' },
          { name: 'Total Interest', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'loan-payment-calculator',
    name: 'Loan Payment Calculator',
    slug: 'loan-payment-calculator',
    category: 'finance',
    description: 'Solve for the mandatory periodic payment amount on any generic loan including commercial, residential, or private paper.',
    seoTitle: 'Universal Loan Payment Calculator | Calculatoora',
    seoDescription: 'The ultimate utility to determine periodic loan payments across daily, weekly, or monthly repayment frequencies.',
    inputs: [
      { id: 'amount', label: 'Principal Sum', type: 'number', defaultValue: 10000, step: 500, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 7.0, step: 0.1, unit: '%' },
      { id: 'term', label: 'Term in Months', type: 'number', defaultValue: 36, step: 1, unit: 'months' }
    ],
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Computes flat monthly amortizing parameters to help individuals analyze fixed liability budgets.',
    example: 'For a generic $10,000 principal at 7.0% APR over 36 months, the payment is $308.77 per cycle.',
    faq: [
      { question: 'Can I use this for any currency?', answer: 'Yes! The formulas operate on numerical ratios and are agnostic of currency denominations.' }
    ],
    relatedSlugs: ['personal-loan-calculator', 'loan-comparison-calculator', 'simple-interest-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const n = Number(inputs.term) || 12;

      const r = (rate / 100) / 12;
      let monthly = 0;
      if (r === 0) {
        monthly = n > 0 ? p / n : 0;
      } else {
        monthly = p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      }

      const totalPaid = monthly * n;
      const totalInterest = Math.max(0, totalPaid - p);

      return {
        results: [
          { label: 'Mandatory Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Amount Borrowed', value: p.toFixed(2), unit: '$' },
          { label: 'Total Cumulative Interest', value: totalInterest.toFixed(2), unit: '$' },
          { label: 'Sum Total Costs', value: totalPaid.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Core Principal', value: p, color: '#39FF14' },
          { name: 'Sum Interest Charges', value: Math.round(totalInterest), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'loan-payoff-calculator',
    name: 'Loan Payoff Calculator',
    slug: 'loan-payoff-calculator',
    category: 'finance',
    description: 'Determine how soon you can complete your current loan and how much interest you can save by adding extra monthly premiums.',
    seoTitle: 'Loan Payoff & Acceleration Calculator | Calculatoora',
    seoDescription: 'See how adding regular extra payments inside your loan account impacts the interest burden and speeds up debt liberation.',
    inputs: [
      { id: 'balance', label: 'Remaining Loan Balance', type: 'number', defaultValue: 15000, step: 500, unit: '$' },
      { id: 'rate', label: 'Interest Rate', type: 'number', defaultValue: 6.0, step: 0.1, unit: '%' },
      { id: 'payment', label: 'Standard Monthly Payment', type: 'number', defaultValue: 350, step: 10, unit: '$' },
      { id: 'extra', label: 'Extra Monthly Payment Add-on', type: 'number', defaultValue: 100, step: 10, unit: '$' }
    ],
    formula: 'Months = -ln[1 - (r * P) / M] / ln[1 + r]\nWhere M is the total payment (standard + extra).',
    explanation: 'By paying more than the minimum required value, the extra capital directly reduces your outstanding loan principal balance. This reduces interest calculation values for all future billing cycles.',
    example: 'With a $15,000 balance at 6.0% interest and a standard payment of $350, adding $100 extra per month reduces your payoff timeline from 49 months to 37 months, saving you $516.42 in interest fees.',
    faq: [
      { question: 'Is early payoff penalized?', answer: 'Some banks charge prepayment penalties. Ensure you consult your specific agreement contracts before expediting payoffs.' },
      { question: 'When is interest recalculated?', answer: 'Standard personal loans calculate interest charges on a daily or monthly compound outstanding balance basis.' }
    ],
    relatedSlugs: ['early-loan-payoff-calculator', 'debt-snowball-calculator', 'debt-avalanche-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.balance) || 1;
      const rate = Number(inputs.rate) || 0;
      const minPayment = Number(inputs.payment) || 1;
      const extra = Number(inputs.extra) || 0;

      const r = (rate / 100) / 12;
      const boostedPayment = minPayment + extra;

      // Calculate baseline (minimum payment only)
      let baseMonths = 0;
      let baseInterestTotal = 0;
      if (r === 0) {
        baseMonths = p / minPayment;
      } else {
        const threshold = r * p;
        if (minPayment <= threshold) {
          baseMonths = 999; // Never paid off!
        } else {
          baseMonths = -Math.log(1 - (r * p) / minPayment) / Math.log(1 + r);
        }
      }

      // Calculate accelerated payoff
      let acceleratedMonths = 0;
      if (r === 0) {
        acceleratedMonths = p / boostedPayment;
      } else {
        const threshold = r * p;
        if (boostedPayment <= threshold) {
          acceleratedMonths = 999;
        } else {
          acceleratedMonths = -Math.log(1 - (r * p) / boostedPayment) / Math.log(1 + r);
        }
      }

      const finiteBase = baseMonths < 999 ? Math.ceil(baseMonths) : 0;
      const finiteAcc = acceleratedMonths < 999 ? Math.ceil(acceleratedMonths) : 0;

      // Estimate baseline interest values
      let currentBalBase = p;
      let interestBaseSum = 0;
      if (finiteBase > 0) {
        for (let i = 0; i < finiteBase; i++) {
          const interestCharge = currentBalBase * r;
          const principalReduction = Math.min(currentBalBase, minPayment - interestCharge);
          interestBaseSum += interestCharge;
          currentBalBase -= principalReduction;
          if (currentBalBase <= 0) break;
        }
      }

      // Estimate accelerated interest values
      let currentBalAcc = p;
      let interestAccSum = 0;
      if (finiteAcc > 0) {
        for (let i = 0; i < finiteAcc; i++) {
          const interestCharge = currentBalAcc * r;
          const principalReduction = Math.min(currentBalAcc, boostedPayment - interestCharge);
          interestAccSum += interestCharge;
          currentBalAcc -= principalReduction;
          if (currentBalAcc <= 0) break;
        }
      }

      const monthsSaved = Math.max(0, finiteBase - finiteAcc);
      const interestSaved = Math.max(0, interestBaseSum - interestAccSum);

      return {
        results: [
          { label: 'Time to Payoff (Accelerated)', value: finiteAcc, unit: 'months', isPrimary: true },
          { label: 'Payoff Time Saved', value: monthsSaved, unit: 'months' },
          { label: 'Total Interest Saved', value: interestSaved.toFixed(2), unit: '$' },
          { label: 'Accelerated Total Interest Paid', value: interestAccSum.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Accelerated Interest', value: Math.round(interestAccSum), color: '#39FF14' },
          { name: 'Interest Dollars Saved', value: Math.round(interestSaved), color: '#a855f7' }
        ]
      };
    }
  },
  {
    id: 'loan-comparison-calculator',
    name: 'Loan Comparison Calculator',
    slug: 'loan-comparison-calculator',
    category: 'finance',
    description: 'Compare side-by-side two distinct loan programs with different interest rates, setup expenses, and payment timelines.',
    seoTitle: 'Loan Comparison Side-by-Side Calculator | Calculatoora',
    seoDescription: 'Instantly pit two loan variants against each other. Calculate differences in monthly payments, lifetime interest sum, and select the optimal loan offer.',
    inputs: [
      { id: 'amount', label: 'Loan Principal Balance', type: 'number', defaultValue: 50000, step: 1000, unit: '$' },
      { id: 'rateA', label: 'Loan A Interest Rate (APR)', type: 'number', defaultValue: 5.5, step: 0.1, unit: '%' },
      { id: 'termA', label: 'Loan A Term (Months)', type: 'number', defaultValue: 36, step: 1, unit: 'months' },
      { id: 'rateB', label: 'Loan B Interest Rate (APR)', type: 'number', defaultValue: 6.5, step: 0.1, unit: '%' },
      { id: 'termB', label: 'Loan B Term (Months)', type: 'number', defaultValue: 48, step: 1, unit: 'months' }
    ],
    formula: 'M_A = Standard Amortization (Principal, rateA, termA)\nM_B = Standard Amortization (Principal, rateB, termB)',
    explanation: 'A comparison utility evaluates which program generates less interest or a lower monthly impact. It handles variables across multiple loan formats.',
    example: 'Comparing Loan A ($50k, 5.5% over 36 months, payment $1,509.61) vs Loan B ($50k, 6.5% over 48 months, payment $1,185.02) displays a difference of $324.59 in monthly outflows and $2,534.50 in absolute interest.',
    faq: [
      { question: 'Why pick a shorter terms over lower payments?', answer: 'Shorter terms usually yield smaller total lifetime interest payments, and sometimes feature lower introductory APRs.' }
    ],
    relatedSlugs: ['loan-payment-calculator', 'personal-loan-calculator', 'early-loan-payoff-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.amount) || 0;
      const rA = (Number(inputs.rateA) || 0) / 100 / 12;
      const nA = Number(inputs.termA) || 12;
      const rB = (Number(inputs.rateB) || 0) / 100 / 12;
      const nB = Number(inputs.termB) || 12;

      let paymentA = rA === 0 ? p / nA : p * (rA * Math.pow(1 + rA, nA)) / (Math.pow(1 + rA, nA) - 1);
      let paymentB = rB === 0 ? p / nB : p * (rB * Math.pow(1 + rB, nB)) / (Math.pow(1 + rB, nB) - 1);

      const totalA = paymentA * nA;
      const totalB = paymentB * nB;

      const intA = Math.max(0, totalA - p);
      const intB = Math.max(0, totalB - p);

      return {
        results: [
          { label: 'Loan A Monthly Payment', value: paymentA.toFixed(2), unit: '$' },
          { label: 'Loan B Monthly Payment', value: paymentB.toFixed(2), unit: '$' },
          { label: 'Loan A Total Interest', value: intA.toFixed(2), unit: '$' },
          { label: 'Loan B Total Interest', value: intB.toFixed(2), unit: '$' },
          { label: 'Cheapest Option (Interest Basis)', value: intA < intB ? 'Loan A' : 'Loan B' }
        ],
        chartData: [
          { name: 'Loan A Interest', value: Math.round(intA), color: '#39FF14' },
          { name: 'Loan B Interest', value: Math.round(intB), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'early-loan-payoff-calculator',
    name: 'Early Loan Payoff Calculator',
    slug: 'early-loan-payoff-calculator',
    category: 'finance',
    description: 'Calculate years chopped off and absolute financial savings by initiating recurring pre-payments on your amortization calendar.',
    seoTitle: 'Early Loan Payoff Savings Calculator | Calculatoora',
    seoDescription: 'Find interest savings and timelines saved on mortgages or personal loans. Plan prepayments and see amortization effects.',
    inputs: [
      { id: 'principal', label: 'Initial Loan Amount', type: 'number', defaultValue: 100000, step: 2000, unit: '$' },
      { id: 'rate', label: 'Annual APR', type: 'number', defaultValue: 5.5, step: 0.1, unit: '%' },
      { id: 'term', label: 'Original Term (Years)', type: 'number', defaultValue: 20, step: 1, unit: 'years' },
      { id: 'prepay', label: 'Additional Payment Outlay', type: 'number', defaultValue: 150, step: 10, unit: '$' }
    ],
    formula: 'Time values are derived using logarithm calculations of reducing principal structures, measuring amortized schedules.',
    explanation: 'Early pre-payments slice directly into outstanding balances, preventing interest accumulation.',
    example: 'Pre-paying an extra $150 monthly on a $100,000, 20-year loan at 5.5% interest saves you $18,452.10 in interest and pays off 5.2 years earlier.',
    faq: [
      { question: 'Should I make a bi-weekly or one-off prepaid payment?', answer: 'Either method accelerates amortization. Paying even a tiny amount extra monthly yields large geometric compounding savings.' }
    ],
    relatedSlugs: ['loan-payoff-calculator', 'debt-snowball-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.principal) || 1;
      const rate = Number(inputs.rate) || 0;
      const termY = Number(inputs.term) || 1;
      const extra = Number(inputs.prepay) || 0;

      const r = (rate / 100) / 12;
      const n = termY * 12;

      let stdMonthly = r === 0 ? p / n : p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const baseTotalInt = (stdMonthly * n) - p;

      const boostedPayment = stdMonthly + extra;

      let acceleratedMonths = 0;
      if (r === 0) {
        acceleratedMonths = p / boostedPayment;
      } else {
        const threshold = r * p;
        if (boostedPayment <= threshold) {
          acceleratedMonths = 999;
        } else {
          acceleratedMonths = -Math.log(1 - (r * p) / boostedPayment) / Math.log(1 + r);
        }
      }

      const finiteAcc = acceleratedMonths < 999 ? Math.ceil(acceleratedMonths) : n;

      let balance = p;
      let finalIntAcc = 0;
      for (let i = 0; i < finiteAcc; i++) {
        const interest = balance * r;
        const princ = Math.min(balance, boostedPayment - interest);
        finalIntAcc += interest;
        balance -= princ;
        if (balance <= 0) break;
      }

      const yearsSaved = Math.max(0, (n - finiteAcc) / 12);
      const interestSaved = Math.max(0, baseTotalInt - finalIntAcc);

      return {
        results: [
          { label: 'Years Saved on Loan', value: yearsSaved.toFixed(1), unit: 'years', isPrimary: true },
          { label: 'Accelerated Payoff Term', value: (finiteAcc / 12).toFixed(1), unit: 'years' },
          { label: 'Total Interest Dollars Saved', value: interestSaved.toFixed(2), unit: '$' },
          { label: 'New Total Interest Expense', value: finalIntAcc.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Accelerated Interest Paid', value: Math.round(finalIntAcc), color: '#39FF14' },
          { name: 'Interest Savings', value: Math.round(interestSaved), color: '#3b82f6' }
        ]
      };
    }
  }
];
