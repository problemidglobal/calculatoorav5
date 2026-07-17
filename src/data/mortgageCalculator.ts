import { Calculator } from '../types';

export const MORTGAGE_CALCULATOR: Calculator = {
  id: 'mortgage-calculator',
  name: 'Mortgage Calculator',
  slug: 'mortgage-calculator',
  category: 'finance',
  description: 'An advanced client-side Mortgage Calculator specifically for home financing. Analyze variable ARM schedules, property tax escrow, PMI removal, unlimited closing costs, extra payments, equity appreciation, and refinance benefits.',
  seoTitle: 'Mortgage Calculator | Advanced Home Loan Planner | Calculatoora',
  seoDescription: 'Accurately plan your home purchase with our premium Mortgage Calculator. Account for property taxes, HOA fees, home insurance, PMI removal, adjustable rates (ARM), and extra payments.',
  formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]\nWhere P is loan amount (Home Price - Down Payment), r is monthly interest, and n is total months.',
  explanation: 'Mortgage payments consist of Principal and Interest (P&I) to repay the borrowed amount, plus additional items like escrow (Property Tax, Home Insurance, HOA fees) and Private Mortgage Insurance (PMI) if your down payment is less than 20% of the home price.',
  example: 'A $500,000 home with 20% down ($100,000) at 6.5% interest for 30 years results in a monthly Principal & Interest payment of $2,528.27.',
  faq: [
    {
      question: 'What is Private Mortgage Insurance (PMI)?',
      answer: 'PMI is an extra insurance premium required by conventional lenders when your down payment is less than 20% of the home purchase price. It protects the lender if you default. PMI can typically be removed once your loan-to-value (LTV) ratio drops to 80% or below.'
    },
    {
      question: 'What is included in a mortgage escrow account?',
      answer: 'Escrow accounts collect monthly portions of annual homeownership bills—such as property taxes, home insurance, and flood insurance—allowing you to pay these in equal monthly installments instead of a single large annual bill.'
    },
    {
      question: 'How do extra payments affect my mortgage payoff?',
      answer: 'Any extra payment made above the scheduled monthly installment is applied directly to your principal balance. This accelerates amortization, which reduces the time required to pay off the loan and significantly cuts the total interest paid over the life of the mortgage.'
    }
  ],
  relatedSlugs: ['home-loan-calculator', 'loan-payoff-calculator', 'rent-vs-buy-calculator'],
  inputs: [
    { id: 'homePrice', label: 'Home Price', type: 'number', defaultValue: '', step: 10000, unit: '$' },
    { id: 'interestRate', label: 'Interest Rate', type: 'number', defaultValue: '', step: 0.1, unit: '%' },
    { id: 'loanTerm', label: 'Loan Term', type: 'number', defaultValue: '', step: 5, unit: 'years' }
  ],
  calculate: (inputs) => {
    const homePrice = Number(inputs.homePrice) || 0;
    const interestRate = Number(inputs.interestRate) || 0;
    const termYears = Number(inputs.loanTerm) || 0;

    if (homePrice <= 0 || interestRate <= 0 || termYears <= 0) {
      return {
        results: [
          { label: 'Monthly Payment', value: '0.00', unit: '$', isPrimary: true }
        ]
      };
    }

    const loanAmount = homePrice;
    const r = (interestRate / 100) / 12;
    const n = termYears * 12;

    let monthly = 0;
    if (r === 0) {
      monthly = loanAmount / n;
    } else {
      monthly = loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totalPaid = monthly * n;
    const totalInterest = Math.max(0, totalPaid - loanAmount);

    return {
      results: [
        { label: 'Monthly Payment (P&I)', value: monthly.toFixed(2), unit: '$', isPrimary: true },
        { label: 'Total Interest', value: totalInterest.toFixed(2), unit: '$' },
        { label: 'Total Payment', value: totalPaid.toFixed(2), unit: '$' }
      ]
    };
  }
};
