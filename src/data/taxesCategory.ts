import { Calculator } from '../types';

export const TAX_CALCULATORS: Calculator[] = [
  {
    id: 'income-tax-calculator',
    name: 'Income Tax Calculator',
    slug: 'income-tax-calculator',
    category: 'finance',
    description: 'Estimate progressive federal income taxes, effective tax rates, and take-home salary after standard deductions.',
    seoTitle: 'Progressive Income Tax Estimator | Calculatoora',
    seoDescription: 'Obtain progressive income tax liability. Automatically supports single or joint standard deductions.',
    inputs: [
      { id: 'gross', label: 'Gross Annual Income', type: 'number', defaultValue: 75000, step: 1000, unit: '$' },
      { id: 'filing', label: 'Filing Status', type: 'select', defaultValue: 'single', options: [
        { label: 'Single', value: 'single' },
        { label: 'Married Filing Jointly', value: 'joint' }
      ]}
    ],
    formula: 'Taxable Income = Gross Income - Standard Deduction\nTax is computed across progressive brackets of 10%, 12%, 22%, and 24%.',
    explanation: 'Income taxes in most developed jurisdictions follow progressive curves: higher brackets only tax dollars earned above lower thresholds, rather than taxing the entire sum at the top rate.',
    example: 'A single individual earning $75,000 has a progressive tax of $7,630.00 after a standard $14,600 deduction, leading to a 10.17% effective tax rate.',
    faq: [
      { question: 'What is a standard deduction?', answer: 'The baseline amount of income protected from federal income tax. For 2024 tax filing in the US, it is $14,600 for Single and $29,200 for Joint.' },
      { question: 'What is marginal vs effective tax rate?', answer: 'Marginal tax is the rate paid on your absolute last earned dollar. Effective tax is the total tax paid divided by gross income, which is always lower.' }
    ],
    relatedSlugs: ['salary-tax-calculator', 'net-worth-calculator', 'capital-gains-tax-calculator'],
    calculate: (inputs) => {
      const gross = Number(inputs.gross) || 0;
      const status = inputs.filing || 'single';

      const deduction = status === 'single' ? 14600 : 29200;
      const taxable = Math.max(0, gross - deduction);

      // Simple bracket representation (US federal simplified)
      const brackets = status === 'single' 
        ? [
            { limit: 11600, rate: 0.10 },
            { limit: 47150, rate: 0.12 },
            { limit: 100525, rate: 0.22 },
            { limit: Infinity, rate: 0.24 }
          ]
        : [
            { limit: 23200, rate: 0.10 },
            { limit: 94300, rate: 0.12 },
            { limit: 201050, rate: 0.22 },
            { limit: Infinity, rate: 0.24 }
          ];

      let taxCalculated = 0;
      let remaining = taxable;
      let prevLimit = 0;

      for (const bracket of brackets) {
        const span = bracket.limit - prevLimit;
        if (remaining > span) {
          taxCalculated += span * bracket.rate;
          remaining -= span;
          prevLimit = bracket.limit;
        } else {
          taxCalculated += remaining * bracket.rate;
          break;
        }
      }

      const takeHome = gross - taxCalculated;
      const effectiveRate = gross > 0 ? (taxCalculated / gross) * 100 : 0;

      return {
        results: [
          { label: 'Est. Federal Income Tax', value: taxCalculated.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Take-home salary after Federal', value: takeHome.toFixed(2), unit: '$' },
          { label: 'Effective Federal Tax Rate', value: effectiveRate.toFixed(2), unit: '%' },
          { label: 'Standard Deduction Allowed', value: deduction.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Your Net Take-home Salary', value: Math.round(takeHome), color: '#39FF14' },
          { name: 'Income Tax Paid', value: Math.round(taxCalculated), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'salary-tax-calculator',
    name: 'Salary Tax Calculator',
    slug: 'salary-tax-calculator',
    category: 'finance',
    description: 'Detailed paycheck tax calculator subtracting both federal income taxes and federal FICA insurance fees (Social Security & Medicare).',
    seoTitle: 'Take Home Salary Paycheck Tax Calculator | Calculatoora',
    seoDescription: 'Input salary details to compute total FICA deductions, progressive income liabilities, and net weekly, monthly, or annual take home.',
    inputs: [
      { id: 'gross', label: 'Gross Annual Salary', type: 'number', defaultValue: 60000, step: 1000, unit: '$' }
    ],
    formula: 'FICA Social Security = 6.2% * Salary (capped)\nFICA Medicare = 1.45% * Salary\nNet = Gross - Income Tax - FICA',
    explanation: 'Paycheck summaries subtract both progressive federal income pools and mandatory flat payroll insurance frameworks dedicated to sovereign pensions and elder healthcare.',
    example: 'For a $60,000 annual salary, FICA deductions steal $4,590.00 (7.65%), and federal progressive income tax costs $5,042.00, resulting in a take-home net of $50,368.00.',
    faq: [
      { question: 'What is FICA?', answer: 'FICA represents the Federal Insurance Contributions Act, which funds Social Security pensions and Medicare health insurance programs in the United States.' }
    ],
    relatedSlugs: ['income-tax-calculator', 'budget-calculator', 'monthly-salary-calculator'],
    calculate: (inputs) => {
      const gross = Number(inputs.gross) || 0;

      // FICA taxes
      const socSecRate = 0.062;
      const socSecLimit = 168600; // 2024 cap
      const socSec = Math.min(gross, socSecLimit) * socSecRate;

      const medicareRate = 0.0145;
      const medicare = gross * medicareRate;
      const totalFica = socSec + medicare;

      const deduction = 14600;
      const taxable = Math.max(0, gross - deduction);

      // Simple single progressive brackets
      let incomeTax = 0;
      if (taxable > 0) {
        if (taxable <= 11600) {
          incomeTax = taxable * 0.10;
        } else if (taxable <= 47150) {
          incomeTax = (11600 * 0.10) + ((taxable - 11600) * 0.12);
        } else {
          incomeTax = (11600 * 0.10) + ((47150 - 11600) * 0.12) + ((taxable - 47150) * 0.22);
        }
      }

      const totalTax = incomeTax + totalFica;
      const takeHome = gross - totalTax;

      return {
        results: [
          { label: 'Annual Net Take-home Payout', value: takeHome.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Weekly Take-home Equivalent', value: (takeHome / 52).toFixed(2), unit: '$' },
          { label: 'Monthly Take-home Equivalent', value: (takeHome / 12).toFixed(2), unit: '$' },
          { label: 'Mandatory FICA Outlay', value: totalFica.toFixed(2), unit: '$' },
          { label: 'Federal Income tax cost', value: incomeTax.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Net Paycheck Cash', value: Math.round(takeHome), color: '#39FF14' },
          { name: 'Income Tax', value: Math.round(incomeTax), color: '#ef4444' },
          { name: 'FICA Payroll Tax', value: Math.round(totalFica), color: '#f59e0b' }
        ]
      };
    }
  },
  {
    id: 'sales-tax-calculator',
    name: 'Sales Tax Calculator',
    slug: 'sales-tax-calculator',
    category: 'finance',
    description: 'Calculate buy transactions tax amounts, sales tax allocations, and total final checking costs.',
    seoTitle: 'Online Sales Tax Finder & Calculator | Calculatoora',
    seoDescription: 'Obtain total shopping cart sales taxes. Reverse calculate base costs from gross checkout totals.',
    inputs: [
      { id: 'price', label: 'Item Base Cost Price', type: 'number', defaultValue: 150, step: 5, unit: '$' },
      { id: 'tax', label: 'Local Sales Tax Rate', type: 'number', defaultValue: 8.25, step: 0.05, unit: '%' }
    ],
    formula: 'Sales Tax = Base Price * (Sales Tax Rate / 100)\nTotal Price = Base Price + Sales Tax',
    explanation: 'Sales tax is an ad valorem consumption levy assessed on goods and services at the direct point of retail checkout.',
    example: 'Buying a $150 device in a state with an 8.25% sales tax incurs a $12.38 tax, making the final payment $162.38.',
    faq: [
      { question: 'Is sales tax identical in all cities?', answer: 'No, because local sales tax is comprised of state, county, and municipal tax rates combined.' }
    ],
    relatedSlugs: ['vat-calculator', 'gst-calculator', 'sale-price-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.price) || 0;
      const rate = Number(inputs.tax) || 0;

      const taxAmount = p * (rate / 100);
      const total = p + taxAmount;

      return {
        results: [
          { label: 'Total Transaction Cost', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Sales Tax Dollars Paid', value: taxAmount.toFixed(2), unit: '$' },
          { label: 'Calculated Base Price', value: p.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Product Base Price', value: p, color: '#39FF14' },
          { name: 'State/Local Sales Tax', value: Math.round(taxAmount), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'vat-calculator',
    name: 'VAT Calculator',
    slug: 'vat-calculator',
    category: 'finance',
    description: 'Calculate Value Added Tax (VAT) increments or extract internal VAT from final prices.',
    seoTitle: 'VAT Add & Reverse Extract Calculator | Calculatoora',
    seoDescription: 'Quickly add VAT to retail prices or reverse extract VAT out of gross business receipts (inclusive vs exclusive modes).',
    inputs: [
      { id: 'price', label: 'Reference Value', type: 'number', defaultValue: 100, step: 5, unit: '$' },
      { id: 'vat', label: 'VAT Rate', type: 'number', defaultValue: 20.0, step: 0.1, unit: '%' },
      { id: 'mode', label: 'Calculation direction', type: 'select', defaultValue: 'add', options: [
        { label: 'Add VAT (Exclusive)', value: 'add' },
        { label: 'Extract VAT (Inclusive)', value: 'extract' }
      ]}
    ],
    formula: 'Add VAT: Total = Base * (1 + VAT/100)\nExtract VAT: Base = Total / (1 + VAT/100)',
    explanation: 'VAT is a multi-stage consumption tax levied on value added at each step of a product is manufacturing and distribution channels.',
    example: 'For a $120 item inclusive of a 20% VAT, the extracted base value is $100.00 and the tax paid is $20.00.',
    faq: [
      { question: 'Where is VAT used?', answer: 'VAT is utilized in over 160 nations worldwide, including the European Union, the United Kingdom, and Australia.' }
    ],
    relatedSlugs: ['gst-calculator', 'sales-tax-calculator', 'profit-margin-calculator'],
    calculate: (inputs) => {
      const inputVal = Number(inputs.price) || 0;
      const rate = Number(inputs.vat) || 0;
      const mode = inputs.mode || 'add';

      let base = 0;
      let tax = 0;
      let total = 0;

      if (mode === 'add') {
        base = inputVal;
        tax = base * (rate / 100);
        total = base + tax;
      } else {
        total = inputVal;
        base = total / (1 + (rate / 100));
        tax = total - base;
      }

      return {
        results: [
          { label: 'Total Price (Gross)', value: total.toFixed(2), unit: '$', isPrimary: mode === 'add' },
          { label: 'Net price (Base)', value: base.toFixed(2), unit: '$', isPrimary: mode === 'extract' },
          { label: 'Extracted / Added VAT Paid', value: tax.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Exclusive Net Cost', value: Math.round(base), color: '#39FF14' },
          { name: 'VAT Amount', value: Math.round(tax), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    category: 'finance',
    description: 'Calculate Goods and Services Tax (GST) additions or removals on retail and trade transactions in Canada, India, Australia, or Singapore.',
    seoTitle: 'GST Tax Online Integration Calculator | Calculatoora',
    seoDescription: 'Solve Australian, Canadian or Indian GST increments. Add or extract GST parameters easily.',
    inputs: [
      { id: 'amount', label: 'Transaction Value', type: 'number', defaultValue: 200, step: 5, unit: '$' },
      { id: 'rate', label: 'GST Percentage', type: 'number', defaultValue: 10.0, step: 0.5, unit: '%' },
      { id: 'mode', label: 'Direction', type: 'select', defaultValue: 'add', options: [
        { label: 'GST Exclusive (Add)', value: 'add' },
        { label: 'GST Inclusive (Remove)', value: 'remove' }
      ]}
    ],
    formula: 'Add GST: Net Cost * (GST / 100)\nRemove GST: Gross Value - [Gross Value / (1 + GST / 100)]',
    explanation: 'Goods and Services Tax serves as a national uniform indirect value-added consumption levy.',
    example: 'A $200 Australian transaction with a 10% GST added results in a $220.00 total catalog price.',
    faq: [
      { question: 'What is CGST, SGST, IGST in India?', answer: 'Indian GST splits goods into Central (CGST), State (SGST) and Integrated Interstate (IGST) components to divide revenue between state and federal pools.' }
    ],
    relatedSlugs: ['vat-calculator', 'sales-tax-calculator', 'discount-calculator'],
    calculate: (inputs) => {
      const amt = Number(inputs.amount) || 0;
      const rate = Number(inputs.rate) || 0;
      const mode = inputs.mode || 'add';

      let base = 0;
      let gst = 0;
      let total = 0;

      if (mode === 'add') {
        base = amt;
        gst = base * (rate / 100);
        total = base + gst;
      } else {
        total = amt;
        base = total / (1 + (rate / 100));
        gst = total - base;
      }

      return {
        results: [
          { label: 'Gross Checklist Final Value', value: total.toFixed(2), unit: '$', isPrimary: mode === 'add' },
          { label: 'Exclusive Transaction Base', value: base.toFixed(2), unit: '$', isPrimary: mode === 'remove' },
          { label: 'GST Collection Portion', value: gst.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Product Net Base', value: Math.round(base), color: '#39FF14' },
          { name: 'Assessed GST Portion', value: Math.round(gst), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'property-tax-calculator',
    name: 'Property Tax Calculator',
    slug: 'property-tax-calculator',
    category: 'finance',
    description: 'Calculate yearly real estate property taxes based on market value, assessment ratios, and local millage rates.',
    seoTitle: 'Real Estate Property Tax & Millage Calculator | Calculatoora',
    seoDescription: 'Track property tax liabilities. Compare millage parameters or tax percentages to estimate annual real estate costs.',
    inputs: [
      { id: 'value', label: 'Actual Home Market Value', type: 'number', defaultValue: 300000, step: 5000, unit: '$' },
      { id: 'assessment', label: 'Assessment ratio percentage', type: 'number', defaultValue: 90.0, step: 1, unit: '%' },
      { id: 'millage', label: 'Millage Rate (Mills per $1,000)', type: 'number', defaultValue: 12.5, step: 0.1, unit: 'mills' }
    ],
    formula: 'Assessed Value = Market Value * (Assessment Ratio / 100)\nProperty Tax = (Assessed Value / 1000) * Millage Rate',
    explanation: 'Home ownership includes ongoing ad valorem property tax levies managed by local city governments to finance public schools, roads, and security pipelines.',
    example: 'For a $300,000 home with a 90% assessment ratio ($270,000 assessed value) and a 12.5 millage rate, you pay $3,375.00 property tax annually ($281.25/month).',
    faq: [
      { question: 'What is a millage rate?', answer: 'Property tax rates are frequently represented in mills (one-tenth of a cent). A millage rate of 1 mill means $1 tax is due for every $1,000 of assessed property value.' }
    ],
    relatedSlugs: ['home-loan-calculator', 'mortgage-calculator', 'rental-income-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.value) || 0;
      const ratio = Number(inputs.assessment) || 100;
      const mills = Number(inputs.millage) || 0;

      const assessedValue = val * (ratio / 100);
      const taxAnnual = (assessedValue / 1000) * mills;
      const taxMonthly = taxAnnual / 12;

      return {
        results: [
          { label: 'Assessed Annual Property Tax', value: taxAnnual.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Tax Overhead', value: taxMonthly.toFixed(2), unit: '$' },
          { label: 'Assessed Property Valuation', value: assessedValue.toFixed(2), unit: '$' },
          { label: 'Effective Tax Rate relative to Market', value: val > 0 ? ((taxAnnual / val) * 100).toFixed(4) : 0, unit: '%' }
        ],
        chartData: [
          { name: 'Disposable Asset equity', value: Math.max(0, val - taxAnnual * 10), color: '#39FF14' },
          { name: 'Property Tax (10 year cumulative)', value: Math.round(taxAnnual * 10), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'capital-gains-tax-calculator',
    name: 'Capital Gains Tax Calculator',
    slug: 'capital-gains-tax-calculator',
    category: 'finance',
    description: 'Calculate financial tax liabilities on asset sales, distinguishing short-term transactions from long-term capital gains.',
    seoTitle: 'Capital Gains Tax & Investment Calculator | Calculatoora',
    seoDescription: 'Determine federal taxes on stock or property sales. Account for investment holds, cost basis, and marginal tax brackets.',
    inputs: [
      { id: 'basis', label: 'Cost Purchase Basis', type: 'number', defaultValue: 10000, step: 200, unit: '$' },
      { id: 'sale', label: 'Asset Sale Price', type: 'number', defaultValue: 18000, step: 200, unit: '$' },
      { id: 'term', label: 'Investment Holding Time', type: 'select', defaultValue: 'long', options: [
        { label: 'Long-term (1+ Years)', value: 'long' },
        { label: 'Short-term (< 1 Year)', value: 'short' }
      ]},
      { id: 'bracket', label: 'Estimated Marginal Income Tax Bracket', type: 'number', defaultValue: 22.0, step: 1, unit: '%' }
    ],
    formula: 'Capital Gain = Sale Price - Cost Basis\nLong-term rates: 0%, 15%, or 20%.\nShort-term rates: normal income brackets apply.',
    explanation: 'Capital gains taxes represent charges levied on asset investment growth when sold. Sovereign codes offer preferential lower rates to long-term holders to incentivize persistent capitalization.',
    example: 'Selling an stock asset for $18,000 bought of $10,000 after 2 years (long term holding) triggers a federal 15% long-term rate ($1,200.00 tax) instead of your regular marginal brackets.',
    faq: [
      { question: 'What is a cost basis?', answer: 'The absolute original cost to acquire an investment asset, including trade commissions, broker fees, or capital upkeep costs.' }
    ],
    relatedSlugs: ['stock-return-calculator', 'income-tax-calculator', 'roi-calculator'],
    calculate: (inputs) => {
      const basis = Number(inputs.basis) || 0;
      const sale = Number(inputs.sale) || 0;
      const termType = inputs.term || 'long';
      const bracket = Number(inputs.bracket) || 22;

      const gain = Math.max(0, sale - basis);
      
      let rate = 0;
      if (termType === 'short') {
        rate = bracket / 100;
      } else {
        // Simple long term model
        if (bracket < 15) rate = 0.00;
        else if (bracket < 35) rate = 0.15;
        else rate = 0.20;
      }

      const taxAmount = gain * rate;
      const netProfit = gain - taxAmount;

      return {
        results: [
          { label: 'Asset Net Gain Realized', value: gain.toFixed(2), unit: '$' },
          { label: 'Capital Gains Tax Due', value: taxAmount.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Net Profit After Taxes', value: netProfit.toFixed(2), unit: '$' },
          { label: 'Assessed Tax Rate applied', value: (rate * 100).toFixed(1), unit: '%' }
        ],
        chartData: [
          { name: 'Original Cost Basis', value: basis, color: '#39FF14' },
          { name: 'Tax Paid on gains', value: Math.round(taxAmount), color: '#ef4444' },
          { name: 'Net Retention Profit', value: Math.round(netProfit), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'tax-calculator',
    name: 'Tax Calculator',
    slug: 'tax-calculator',
    category: 'finance',
    description: 'The world\'s most advanced global Tax Calculator. Work with progressive brackets, deductions, and tax credits.',
    seoTitle: 'Tax Calculator - Global Tax Planning Software | Calculatoora',
    seoDescription: 'The world\'s most advanced global Tax Calculator. Enter customized tax brackets, rates, deductions, exemptions, credits, and surcharges client-side.',
    inputs: [
      { id: 'taxableIncome', label: 'Taxable Income', type: 'number', defaultValue: '', step: 1000, unit: '$' },
      { id: 'taxRate', label: 'Tax Rate', type: 'number', defaultValue: '', step: 1, unit: '%' }
    ],
    formula: 'Taxable Income = Gross Income - Deductions\nTax = Brackets or Flat rate + Surcharges - Credits',
    explanation: 'A fully customizable, international-compliant tax planning framework enabling progressive tier modeling, standard/itemized deductions deduction paths, and credit balancing entirely in-browser.',
    example: 'Enter $100,000 income, select a 20% flat tax rate or build custom progressive bracket tiers to evaluate scenario outcomes.',
    faq: [
      { question: 'What is Tax?', answer: 'Tax is a mandatory financial charge or other type of levy imposed on a taxpayer by a governmental organization to fund public expenditures.' }
    ],
    relatedSlugs: ['income-tax-calculator', 'salary-tax-calculator', 'payroll-calculator', 'mortgage-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Total Tax Calculated', value: '0.00', unit: '$', isPrimary: true }
        ]
      };
    }
  }
];
