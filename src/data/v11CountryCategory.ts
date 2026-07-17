import { Calculator } from '../types';

export const V11_COUNTRY_CALCULATORS: Calculator[] = [
  // ==================== UNITED STATES ====================
  {
    id: 'us-income-tax',
    name: 'US Income Tax Calculator',
    slug: 'us-income-tax',
    category: 'country',
    description: 'Calculate federal income tax liabilities using the latest progressive tax brackets, standard deduction values, and tax rates.',
    seoTitle: 'US Federal Income Tax Calculator | Calculatoora',
    seoDescription: 'Accurately estimate your US progressive federal income tax liability. Best alternative to calculator.net tax tools.',
    inputs: [
      { id: 'income', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 85000, step: 2500 },
      { id: 'status', label: 'Filing Status', type: 'select', defaultValue: 'single', options: [
        { label: 'Single Filer', value: 'single' },
        { label: 'Married Filing Jointly', value: 'married' },
        { label: 'Head of Household', value: 'hoh' }
      ]}
    ],
    formula: 'Taxable Income = Gross Income - Standard Deduction\nTax Liability computed using progressive IRS bracket tiers.',
    explanation: 'The US federal tax code uses progressive tax brackets. Taxable income is calculated after deducting the standard deduction amount ($14,600 for Single filers in 2024/2025). The remaining balance is taxed at tiered rates up to 37%.',
    example: 'For a Single filer earning $85,000, subtracting $14,600 results in $70,400 of taxable income. Under the progressive US tiers, the estimated federal income tax liability is approximately $10,500.',
    faq: [
      { question: 'What is the standard deduction for US filers?', answer: 'The standard deduction significantly lowers taxable income. It currently sits at $14,600 for single filers and $29,200 for married couples filing jointly.' },
      { question: 'What is the difference between marginal and effective tax rates?', answer: 'Your marginal rate is the highest tier your last dollar touches. Your effective rate is the physical percentage of your total income paid as tax.' }
    ],
    relatedSlugs: ['us-salary-after-tax', 'us-property-tax'],
    keywords: ['us tax', 'income tax', 'federal tax bracket', 'irs single tax married tax'],
    calculate: (inputs) => {
      const income = Number(inputs.income || 85000);
      const status = inputs.status || 'single';

      const deduction = status === 'married' ? 29200 : status === 'hoh' ? 21900 : 14600;
      const taxable = Math.max(0, income - deduction);

      // Simple US brackets
      let brackets = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: 243725, rate: 0.32 },
        { limit: 609350, rate: 0.35 },
        { limit: Infinity, rate: 0.37 }
      ];

      if (status === 'married') {
        brackets = [
          { limit: 23200, rate: 0.10 },
          { limit: 94300, rate: 0.12 },
          { limit: 201050, rate: 0.22 },
          { limit: 383900, rate: 0.24 },
          { limit: 487450, rate: 0.32 },
          { limit: 731200, rate: 0.35 },
          { limit: Infinity, rate: 0.37 }
        ];
      }

      let tax = 0;
      let prevLimit = 0;
      const bracketDetails = [];

      for (const b of brackets) {
        if (taxable > prevLimit) {
          const taxableInBracket = Math.min(taxable - prevLimit, b.limit - prevLimit);
          const bracketTax = taxableInBracket * b.rate;
          tax += bracketTax;
          bracketDetails.push({ name: `${(b.rate * 100).toFixed(0)}% Bracket`, tax: bracketTax });
          prevLimit = b.limit;
        } else {
          break;
        }
      }

      const netIncome = income - tax;
      const effectiveRate = income > 0 ? (tax / income) * 100 : 0;

      return {
        results: [
          { label: 'Estimated Federal Tax', value: tax.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Estimated Take-Home Income', value: netIncome.toFixed(2), unit: '$' },
          { label: 'Effective Tax Rate', value: effectiveRate.toFixed(1), unit: '%' },
          { label: 'Standard Deduction Claimed', value: deduction.toFixed(0), unit: '$' }
        ],
        chartData: bracketDetails.map(bd => ({ name: bd.name, value: Math.round(bd.tax), color: '#3b82f6' }))
      };
    }
  },
  {
    id: 'us-sales-tax',
    name: 'US Sales Tax Calculator',
    slug: 'us-sales-tax',
    category: 'country',
    description: 'Calculate total retail purchase costs including state sales taxes, custom local rates, and net values.',
    seoTitle: 'US State Sales Tax Calculator | Calculatoora',
    seoDescription: 'Calculate sales tax across US states. Instantly lookup default rates for CA, NY, TX, FL, and more.',
    inputs: [
      { id: 'amount', label: 'Item Base Price ($)', type: 'number', defaultValue: 1500, step: 50 },
      { id: 'state', label: 'State & Default Tax Rate', type: 'select', defaultValue: 'ca', options: [
        { label: 'California (7.25%)', value: '7.25' },
        { label: 'New York (4.00%)', value: '4.00' },
        { label: 'Texas (6.25%)', value: '6.25' },
        { label: 'Florida (6.00%)', value: '6.00' },
        { label: 'Illinois (6.25%)', value: '6.25' },
        { label: 'Washington (6.50%)', value: '6.50' },
        { label: 'Oregon (0.00%)', value: '0.00' }
      ]},
      { id: 'localRate', label: 'Additional Local / County Tax (%)', type: 'number', defaultValue: 1.5, min: 0, max: 10, step: 0.1 }
    ],
    formula: 'Sales Tax = Base Price * (State Rate + Local Rate) / 100\nTotal Bill = Base Price + Sales Tax',
    explanation: 'Unlike many countries that levy VAT, the US uses a state-by-state Sales and Use tax system. Rates vary by municipal jurisdictions, often combining state, county, and flat transit-district levies.',
    example: 'Purchasing a $1500 tech product in California (7.25% state rate) with a local county tax of 1.5% results in an 8.75% cumulative rate. The tax amount is $131.25, leading to a total bill of $1631.25.',
    faq: [
      { question: 'Which US states have no state sales tax?', answer: 'Alaska, Delaware, Montana, New Hampshire, and Oregon impose 0% state sales tax on retail transactions.' }
    ],
    relatedSlugs: ['us-income-tax', 'us-property-tax'],
    keywords: ['sales tax US', 'california tax solver', 'retail purchase tax', 'state tax rates'],
    calculate: (inputs) => {
      const amt = Number(inputs.amount || 1500);
      const stateRate = Number(inputs.state || 7.25);
      const localRate = Number(inputs.localRate || 1.5);

      const combinedRate = stateRate + localRate;
      const taxAmt = amt * (combinedRate / 100);
      const total = amt + taxAmt;

      return {
        results: [
          { label: 'Total Sales Tax Charge', value: taxAmt.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Purchase Amount', value: total.toFixed(2), unit: '$' },
          { label: 'Combined Retail Tax Rate', value: combinedRate.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Base Item Cost', value: Math.round(amt), color: '#3b82f6' },
          { name: 'Sales Tax Charged', value: Math.round(taxAmt), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'us-property-tax',
    name: 'US Property Tax Calculator',
    slug: 'us-property-tax',
    category: 'country',
    description: 'Calculate real estate property taxes based on assessed home values and millage property tax rates.',
    seoTitle: 'US Annual Property Tax Calculator | Calculatoora',
    seoDescription: 'Obtain estimated annual real estate tax totals based on assessed home valuations and state property averages.',
    inputs: [
      { id: 'assessVal', label: 'Assessed Property Valuation ($)', type: 'number', defaultValue: 450000, step: 10000 },
      { id: 'rateType', label: 'US State (Typical Rates)', type: 'select', defaultValue: 'tx', options: [
        { label: 'Texas (1.68%)', value: '1.68' },
        { label: 'California (0.75%)', value: '0.75' },
        { label: 'New Jersey (2.47%)', value: '2.47' },
        { label: 'New York (1.73%)', value: '1.73' },
        { label: 'Florida (0.91%)', value: '0.91' },
        { label: 'Hawaii (0.29%)', value: '0.29' }
      ]}
    ],
    formula: 'Property Tax = Assessed Value * (Tax Rate % / 100)',
    explanation: 'US Real Estate property taxes are collected locally by counties, school zones, and city areas. Tax amounts are calculated on the official property assessed valuation rather than current open market selling prices.',
    example: 'A Texas home assessed at $450,000 with a rate of 1.68% carries an estimated annual property tax bill of $7,560, split into monthly escrow values of $630.',
    faq: [
      { question: 'What is a property tax millage rate?', answer: 'One mill equals $1 of tax for every $1000 of assessed home value. A millage rate of 20 mills equates to a 2% property tax rate.' }
    ],
    relatedSlugs: ['us-income-tax', 'us-mortgage-calculator'],
    keywords: ['property tax', 'real estate tax us', 'assessment fee', 'home escrow tax'],
    calculate: (inputs) => {
      const val = Number(inputs.assessVal || 450000);
      const rate = Number(inputs.rateType || 1.68);

      const tax = val * (rate / 100);
      const monthly = tax / 12;

      return {
        results: [
          { label: 'Annual Property Tax Liabilities', value: tax.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Escrow Property Tax Allocations', value: monthly.toFixed(2), unit: '$' },
          { label: 'Selected Standard Millage Rate', value: rate.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Estimated Tax Charge', value: Math.round(tax), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'us-salary-after-tax',
    name: 'US Salary After Tax Calculator',
    slug: 'us-salary-after-tax',
    category: 'country',
    description: 'Track take-home salary after deducting standard US federal income taxes, Medicare, and Social Security dues (FICA).',
    seoTitle: 'US Salary After Tax Take Home Pay | Calculatoora',
    seoDescription: 'Detailed US check stub breakdown. Model federal withholdings, Social Security, and Medicare values.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Annual Salary ($)', type: 'number', defaultValue: 95000, step: 2500 },
      { id: 'status', label: 'Filing Status', type: 'select', defaultValue: 'single', options: [
        { label: 'Single Filer', value: 'single' },
        { label: 'Married Jointly', value: 'married' }
      ]}
    ],
    formula: 'FICA Tax = Social Security (6.2% up to $168,600 limit) + Medicare (1.45%)\nFederal Tax progressive calculations on net after FICA deductions.',
    explanation: 'W2 earners see their paychecks reduced by two structural tiers: FICA taxes (which pool into federal health and retirement lines) and progressive federal income tax withholdings.',
    example: 'Earning $95,000 as a Single Filer: Social Security holds $5,890, Medicare holds $1,377.50, and estimated federal progressive tax holds $11,920. Net take-home is $75,812.50.',
    faq: [
      { question: 'What is the limit for Social Security tax calculations?', answer: 'The Social Security tax of 6.2% stops accruing once your calendar earnings cross the FICA wage ceiling ($168,600).' }
    ],
    relatedSlugs: ['us-income-tax', 'us-mortgage-calculator'],
    keywords: ['payroll deductions check', 'take home pay us', 'fica medicare check', 'net paycheck solver'],
    calculate: (inputs) => {
      const income = Number(inputs.grossIncome || 95000);
      const status = inputs.status || 'single';

      const socSec = Math.min(income, 168600) * 0.062;
      const medicare = income * 0.0145;
      const FICA = socSec + medicare;

      const deduction = status === 'married' ? 29200 : 14600;
      const taxable = Math.max(0, income - deduction);

      let brackets = [
        { limit: 11600, rate: 0.10 },
        { limit: 47150, rate: 0.12 },
        { limit: 100525, rate: 0.22 },
        { limit: 191950, rate: 0.24 },
        { limit: Infinity, rate: 0.32 }
      ];

      let fedTax = 0;
      let prevLimit = 0;
      for (const b of brackets) {
        if (taxable > prevLimit) {
          const taxableInBracket = Math.min(taxable - prevLimit, b.limit - prevLimit);
          fedTax += taxableInBracket * b.rate;
          prevLimit = b.limit;
        } else {
          break;
        }
      }

      const totalTaxes = fedTax + FICA;
      const netPay = income - totalTaxes;

      return {
        results: [
          { label: 'Estimated Annual Take-Home Pay', value: netPay.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Federal Income Tax Withholding', value: fedTax.toFixed(2), unit: '$' },
          { label: 'Total FICA Tax Contributions', value: FICA.toFixed(2), unit: '$' },
          { label: 'Social Security Component (6.2%)', value: socSec.toFixed(2), unit: '$' },
          { label: 'Medicare Component (1.45%)', value: medicare.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Net Take-Home', value: Math.round(netPay), color: '#10b981' },
          { name: 'Federal Tax', value: Math.round(fedTax), color: '#f59e0b' },
          { name: 'FICA (Medicare/SS)', value: Math.round(FICA), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'us-mortgage-calculator',
    name: 'US Mortgage Calculator',
    slug: 'us-mortgage-calculator',
    category: 'country',
    description: 'Calculate complete US monthly mortgage payments, factoring in principal, interest, annual property tax escrow, and insurance.',
    seoTitle: 'US Mortgage Payment with Escrow Calculator | Calculatoora',
    seoDescription: 'Estimate full monthly house payments in the US. Calculate real estate tax escrow, PMI, and homeowner insurance.',
    inputs: [
      { id: 'homePrice', label: 'Home System Purchase Price ($)', type: 'number', defaultValue: 380000, step: 10000 },
      { id: 'downPayment', label: 'Down Payment ($)', type: 'number', defaultValue: 76000, step: 5000 },
      { id: 'interestRate', label: 'Loan Interest APR (%)', type: 'number', defaultValue: 6.8, step: 0.1 },
      { id: 'loanTerm', label: 'Loan Term Years', type: 'number', defaultValue: 30, min: 10, max: 40, step: 5 },
      { id: 'propertyTaxRate', label: 'Property Tax Rate Annual (%)', type: 'number', defaultValue: 1.1, step: 0.1 },
      { id: 'insurance', label: 'Annual Homeowner Insurance ($)', type: 'number', defaultValue: 1400, step: 100 }
    ],
    formula: 'Monthly PI = Principal * [r(1+r)^n] / [(1+r)^n - 1]\nWhere r = APR / 12 / 100, n = Term in months.\nMonthly Tax Escrow = (Home Price * Tax Rate) / 12\nMonthly Insurance = Annual Insur. / 12',
    explanation: 'Home financing in the US comprises Principal and Interest (PI), paired with Property Tax Escrows and Homeowner Insurance (PITI). If down payments fall below 20%, Private Mortgage Insurance (PMI) is added.',
    example: 'For a $380,000 home with $76,000 down (20%), a 30-year loan at 6.8% is $1983.84. Adding property taxes (1.1%, $348.33/mo) and insurance ($116.67/mo) yields a $2448.84 monthly payment.',
    faq: [
      { question: 'Why does 20% down payment prevent PMI?', answer: 'US mortgage lenders require Private Mortgage Insurance (PMI) for loans exceeding 80% Loan-to-Value (LTV) to protect against default risk.' }
    ],
    relatedSlugs: ['us-property-tax', 'us-income-tax'],
    keywords: ['mortgage escrow US', 'piti payment calculator', 'home buying budget', 'thirty year fixed loan'],
    calculate: (inputs) => {
      const price = Number(inputs.homePrice || 380000);
      const down = Number(inputs.downPayment || 76000);
      const apr = Number(inputs.interestRate || 6.8);
      const term = Number(inputs.loanTerm || 30);
      const taxRate = Number(inputs.propertyTaxRate || 1.1);
      const ins = Number(inputs.insurance || 1400);

      const principal = Math.max(0, price - down);
      const r = (apr / 100) / 12;
      const n = term * 12;

      let monthlyPI = 0;
      if (r > 0) {
        monthlyPI = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        monthlyPI = principal / n;
      }

      const monthlyTax = (price * (taxRate / 100)) / 12;
      const monthlyIns = ins / 12;
      const totalPmt = monthlyPI + monthlyTax + monthlyIns;

      return {
        results: [
          { label: 'Total Estimated Monthly PITI', value: totalPmt.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Principal & Interest portion', value: monthlyPI.toFixed(2), unit: '$' },
          { label: 'Property Tax monthly escrow', value: monthlyTax.toFixed(2), unit: '$' },
          { label: 'Homeowner Insurance portion', value: monthlyIns.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'P&I Portion', value: Math.round(monthlyPI), color: '#3b82f6' },
          { name: 'Taxes', value: Math.round(monthlyTax), color: '#f59e0b' },
          { name: 'Insurance', value: Math.round(monthlyIns), color: '#ef4444' }
        ]
      };
    }
  },

  // ==================== UNITED KINGDOM ====================
  {
    id: 'uk-income-tax',
    name: 'UK Income Tax Calculator',
    slug: 'uk-income-tax',
    category: 'country',
    description: 'Calculate UK income tax liabilities based on HM Revenue and Customs (HMRC) progressive tax bands.',
    seoTitle: 'UK Income Tax & PAYE Calculator | Calculatoora',
    seoDescription: 'Determine your UK Income Tax, Personal Allowance limits, and progressive bands based on HMRC guidelines.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Annual Salary (£)', type: 'number', defaultValue: 45000, step: 2000 },
      { id: 'allowanceCode', label: 'HMRC Personal Allowance (£)', type: 'number', defaultValue: 12570, step: 100 }
    ],
    formula: 'Personal Allowance = Max {12570 - Max[0, Gross - 100000]/2, 0}\nProgressive bands: 20% (Basic), 40% (Higher), 45% (Additional).',
    explanation: 'The standard UK Personal Allowance is £12,570. For high earners, this allowance is phased out at a rate of £1 for every £2 earned above £100,000. Remaining income is taxed progressively.',
    example: 'A gross salary of £45,000 yields £32,430 of taxable income in the Basic Rate band (rest covered of £12,570). Basic tax is (£32,430 * 20%) = £6,486.',
    faq: [
      { question: 'What is HMRC Personal Allowance tapering?', answer: 'For individuals earning over £100,000, standard personal allowance is reduced by £1 for every £2 of income, reaching £0 at £125,140.' }
    ],
    relatedSlugs: ['uk-vat-calculator', 'uk-salary-calculator'],
    keywords: ['uk income tax', 'hmrc tax return', 'paye system bands', 'personal allowance'],
    calculate: (inputs) => {
      const income = Number(inputs.grossIncome || 45000);
      let standardAllowance = Number(inputs.allowanceCode || 12570);

      // Phase out personal allowance
      if (income > 100000) {
        const excess = income - 100000;
        standardAllowance = Math.max(0, standardAllowance - (excess / 2));
      }

      const taxable = Math.max(0, income - standardAllowance);
      let tax = 0;

      // 2024/2025 Standard UK rates
      // Basic rate up to 37700 over personal allowance -> taxed at 20%
      // Higher rate up to 125140 over allowance -> taxed at 40%
      // Additional rate above -> taxed at 45%
      const basicLimit = 37700;
      const higherLimit = 125140 - 12570; // 112570

      let basicTax = 0;
      let higherTax = 0;
      let additionalTax = 0;

      if (taxable <= basicLimit) {
        basicTax = taxable * 0.20;
      } else if (taxable <= higherLimit) {
        basicTax = basicLimit * 0.20;
        higherTax = (taxable - basicLimit) * 0.40;
      } else {
        basicTax = basicLimit * 0.20;
        higherTax = (higherLimit - basicLimit) * 0.40;
        additionalTax = (taxable - higherLimit) * 0.45;
      }

      tax = basicTax + higherTax + additionalTax;
      const netPay = income - tax;

      return {
        results: [
          { label: 'UK Income Tax Liability', value: tax.toFixed(2), unit: '£', isPrimary: true },
          { label: 'Take-Home After Income Tax', value: netPay.toFixed(2), unit: '£' },
          { label: 'Effective Personal Allowance', value: standardAllowance.toFixed(0), unit: '£' },
          { label: 'Basic Band Tax Paid (20%)', value: basicTax.toFixed(2), unit: '£' },
          { label: 'Higher Band Tax Paid (40%)', value: higherTax.toFixed(2), unit: '£' }
        ],
        chartData: [
          { name: 'Basic Band', value: Math.round(basicTax), color: '#3b82f6' },
          { name: 'Higher Band', value: Math.round(higherTax), color: '#f59e0b' },
          { name: 'Additional Band', value: Math.round(additionalTax), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'uk-vat-calculator',
    name: 'UK VAT Calculator',
    slug: 'uk-vat-calculator',
    category: 'country',
    description: 'Add or extract United Kingdom Value Added Tax (VAT) using standard, reduced, or zero-rated schedules.',
    seoTitle: 'UK VAT Return & Extraction Calculator | Calculatoora',
    seoDescription: 'Add or strip UK Value Added Tax (VAT). Calculates 20% standard, 5% reduced, or flat rate configurations.',
    inputs: [
      { id: 'amount', label: 'Item Cash Amount (£)', type: 'number', defaultValue: 120, step: 10 },
      { id: 'vatRate', label: 'UK VAT Class Code', type: 'select', defaultValue: '20', options: [
        { label: 'Standard Rate (20%)', value: '20' },
        { label: 'Reduced Rate (5%)', value: '5' },
        { label: 'Zero Rated (0%)', value: '0' }
      ]},
      { id: 'action', label: 'VAT Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Add VAT (Excluding VAT)', value: 'add' },
        { label: 'Remove VAT (Including VAT)', value: 'remove' }
      ]}
    ],
    formula: 'Add: Tax = Net * (Rate / 100), Gross = Net + Tax\nRemove: Net = Gross / (1 + Rate / 100), Tax = Gross - Net',
    explanation: 'UK business products must show VAT computations. Standard VAT is 20%. When extracting VAT from an inclusive sticker price, divide by 1.20 to locate the true net cost.',
    example: 'For a £120 gross purchase containing standard 20% VAT, removing the tax yields £100 net price and £20 VAT charge.',
    faq: [
      { question: 'What items qualify for the 5% reduced UK VAT?', answer: 'Children\'s car seats, domestic solar panels, and domestic utility fuels like electricity and natural gas fall under the 5% rate.' }
    ],
    relatedSlugs: ['uk-income-tax', 'uk-stamp-duty'],
    keywords: ['uk vat', 'value added tax return', 'strip vat calculation', 'tax extraction uk'],
    calculate: (inputs) => {
      const amt = Number(inputs.amount || 120);
      const rate = Number(inputs.vatRate || 20);
      const action = inputs.action || 'add';

      let net = 0;
      let vat = 0;
      let gross = 0;

      if (action === 'add') {
        net = amt;
        vat = net * (rate / 100);
        gross = net + vat;
      } else {
        gross = amt;
        net = gross / (1 + (rate / 100));
        vat = gross - net;
      }

      return {
        results: [
          { label: action === 'add' ? 'Total to Pay (Gross)' : 'Net Base Price', value: (action === 'add' ? gross : net).toFixed(2), unit: '£', isPrimary: true },
          { label: 'Calculated VAT Portion', value: vat.toFixed(2), unit: '£' },
          { label: 'VAT Inclusive Base Price', value: gross.toFixed(2), unit: '£' },
          { label: 'VAT Exclusive Net Price', value: net.toFixed(2), unit: '£' }
        ],
        chartData: [
          { name: 'Net', value: Math.round(net), color: '#3b82f6' },
          { name: 'VAT', value: Math.round(vat), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'uk-salary-calculator',
    name: 'UK Salary Calculator',
    slug: 'uk-salary-calculator',
    category: 'country',
    description: 'Calculate UK take-home salary after deducting both Income Tax and National Insurance (NI) Class 1 contributions.',
    seoTitle: 'UK Net Salary After NI & Tax | Calculatoora',
    seoDescription: 'Detailed UK wage take-home slip. Calculates PAYE, NI contributions, and net pay.',
    inputs: [
      { id: 'yearlyGross', label: 'Gross Annual Earnings (£)', type: 'number', defaultValue: 38000, step: 1000 },
      { id: 'niCategory', label: 'NI Code Category', type: 'select', defaultValue: 'A', options: [
        { label: 'Category A (Standard Class 1)', value: 'A' },
        { label: 'Category B (Reduced Rate)', value: 'B' }
      ]}
    ],
    formula: 'Net Salary = Gross - Income Tax - National Insurance Contributions\nNI Category A: 8% on earnings between £12,570 and £50,270; 2% above.',
    explanation: 'Your UK take-home pay is affected by two progressive HMRC systems: PAYE income tax and National Insurance (NI), which acts as a secondary federal payroll tax.',
    example: 'Earning £38,000 yields £5,086 of PAYE tax and £2,034 of National Insurance contributions. Your net annual take-home salary is £30,880.',
    faq: [
      { question: 'What is the recent Class 1 NI percentage rate reduction?', answer: 'HMRC lowered the main employee NI rate from 10% to 8% in early 2024 to support structural take-home wages.' }
    ],
    relatedSlugs: ['uk-income-tax', 'uk-stamp-duty'],
    keywords: ['paye slip checker', 'uk national insurance tax', 'uk take home salary', 'net earnings hrmc'],
    calculate: (inputs) => {
      const gross = Number(inputs.yearlyGross || 38000);

      // 1. Income Tax calculation
      const standardAllowance = 12570;
      const taxable = Math.max(0, gross - standardAllowance);
      let tax = 0;
      if (taxable <= 37700) {
        tax = taxable * 0.20;
      } else {
        const basicTax = 37700 * 0.20;
        tax = basicTax + (taxable - 37700) * 0.40;
      }

      // 2. Class 1 National Insurance Calculation (8% on primary threshold to upper limit)
      // Primary threshold (£1048/mo -> £12,570/yr)
      // Upper Earnings Limit (£4189/mo -> £50,270/yr)
      let ni = 0;
      const primaryLim = 12570;
      const upperLim = 50270;

      if (gross > primaryLim) {
        const niBaseAmt = Math.min(gross, upperLim) - primaryLim;
        ni += niBaseAmt * 0.08;
        if (gross > upperLim) {
          ni += (gross - upperLim) * 0.02;
        }
      }

      const netSalary = gross - tax - ni;

      return {
        results: [
          { label: 'Estimated Net Annual Salary', value: netSalary.toFixed(2), unit: '£', isPrimary: true },
          { label: 'Monthly Net Take-Home', value: (netSalary / 12).toFixed(2), unit: '£' },
          { label: 'Weekly Net Take-Home', value: (netSalary / 52).toFixed(2), unit: '£' },
          { label: 'Annual UK PAYE Tax Deductions', value: tax.toFixed(2), unit: '£' },
          { label: 'Annual UK National Insurance Paid', value: ni.toFixed(2), unit: '£' }
        ],
        chartData: [
          { name: 'Net Take-Home', value: Math.round(netSalary), color: '#10b981' },
          { name: 'Income Tax', value: Math.round(tax), color: '#3b82f6' },
          { name: 'National Insurance', value: Math.round(ni), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'uk-stamp-duty',
    name: 'UK Stamp Duty Calculator',
    slug: 'uk-stamp-duty',
    category: 'country',
    description: 'Calculate Stamp Duty Land Tax (SDLT) liabilities on property purchases in England and Northern Ireland.',
    seoTitle: 'UK Stamp Duty Land Tax (SDLT) Calculator | Calculatoora',
    seoDescription: 'Obtain Stamp Duty Land Tax totals. Supports Standard rates, First-Time Buyer relief, and Buy-to-Let surcharges.',
    inputs: [
      { id: 'purchasePrice', label: 'Property Purchase Price (£)', type: 'number', defaultValue: 325000, step: 10000 },
      { id: 'status', label: 'Buyer Status Class', type: 'select', defaultValue: 'standard', options: [
        { label: 'Standard Residential (Next Main Home)', value: 'standard' },
        { label: 'First-Time Buyer (Relief eligible)', value: 'first' },
        { label: 'Buy-to-Let / Additional Property (+3%)', value: 'additional' }
      ]}
    ],
    formula: 'SDLT progressively taxed in brackets: £0-£250k: 0%, £250k-£925k: 5%, £925k-£1.5m: 10%.\nSurcharge of 3% added to brackets for additional properties.',
    explanation: 'Stamp Duty (SDLT) is a progressive tax levied when buying property or land in England and Northern Ireland. First-time buyers receive relief on properties up to £425,000.',
    example: 'Buying a standard residential home for £325,000 results in £3,750 SDLT (0% on first £250k, 5% on next £75k). A first-time buyer pays £0.',
    faq: [
      { question: 'Does Stamp Duty apply to property in Scotland or Wales?', answer: 'No. Scotland levies the Land and Buildings Transaction Tax (LBTT), and Wales levies Land Transaction Tax (LTT).' }
    ],
    relatedSlugs: ['uk-income-tax', 'uk-salary-calculator'],
    keywords: ['stamp duty land tax', 'sdlt calculator', 'first time buyer relief', 'property tax uk'],
    calculate: (inputs) => {
      const price = Number(inputs.purchasePrice || 325000);
      const status = inputs.status || 'standard';

      let sdlt = 0;
      const bracketRates = [];

      if (status === 'first' && price <= 625000) {
        // First-time buyer relief: 0% up to 425k, 5% on 425k-625k
        if (price > 425000) {
          sdlt = (price - 425000) * 0.05;
        }
      } else {
        // Standard progression
        // Band 1: 0 to 250k
        // Band 2: 250 to 925k (5%)
        // Band 3: 925k to 1.5m (10%)
        // Band 4: Above 1.5m (12%)
        const surcharge = status === 'additional' ? 0.03 : 0.0;

        let prev = 0;
        const limits = [
          { l: 250000, r: 0.00 },
          { l: 925000, r: 0.05 },
          { l: 1500000, r: 0.10 },
          { l: Infinity, r: 0.12 }
        ];

        for (const limit of limits) {
          if (price > prev) {
            const range = Math.min(price - prev, limit.l - prev);
            sdlt += range * (limit.r + surcharge);
            prev = limit.l;
          } else {
            break;
          }
        }
      }

      return {
        results: [
          { label: 'Calculated HMRC Stamp Duty (SDLT)', value: sdlt.toFixed(2), unit: '£', isPrimary: true },
          { label: 'Effective Stamp Duty Rate', value: price > 0 ? ((sdlt / price) * 100).toFixed(2) : '0.00', unit: '%' },
          { label: 'Net Capital Outlay (Price + Tax)', value: (price + sdlt).toFixed(2), unit: '£' }
        ],
        chartData: [
          { name: 'Purchase Base', value: price },
          { name: 'SDLT Stamp Duty', value: Math.round(sdlt) }
        ]
      };
    }
  },

  // ==================== CANADA ====================
  {
    id: 'canada-tax',
    name: 'Canada Income Tax Calculator',
    slug: 'canada-tax',
    category: 'country',
    description: 'Calculate Canadian progressive federal income taxes, accounting for standard personal basic amounts.',
    seoTitle: 'Canada Federal Income Tax Calculator | Calculatoora',
    seoDescription: 'Estimate federal tax in Canada. Progressive tax bracket thresholds under the CRA regime.',
    inputs: [
      { id: 'income', label: 'Gross Annual Income ($)', type: 'number', defaultValue: 72000, step: 2000 },
      { id: 'basicAmount', label: 'Basic Personal Amount ($)', type: 'number', defaultValue: 15705, step: 100 }
    ],
    formula: 'Taxable Income = Earnings - Personal Basic Credit\nFederal Tax is set in progressive steps: 15%, 20.5%, 26%, 29%, 33%.',
    explanation: 'Under the Canada Revenue Agency (CRA), federal tax is calculated progressively. Standard basic personal credits mean the first $15,705 of earnings is tax-sheltered.',
    example: 'Earning $72,000 gross yields an estimated federal tax portion of $8,350 after applying standard progressive tiers.',
    faq: [
      { question: 'Does this compute province-specific taxes?', answer: 'This calculator targets federal CRA rates. Provincial tax is levied additionally based on provinces like Ontario or British Columbia.' }
    ],
    relatedSlugs: ['canada-gst', 'canada-mortgage'],
    keywords: ['canada tax cra', 'provincial credit', 'basic personal amount', 'federal progressive tax'],
    calculate: (inputs) => {
      const income = Number(inputs.income || 72000);
      const bpa = Number(inputs.basicAmount || 15705);

      const taxable = Math.max(0, income - bpa);
      let tax = 0;

      // CRA General Federal brackets
      const brackets = [
        { limit: 55867, rate: 0.15 },
        { limit: 111733, rate: 0.205 },
        { limit: 173205, rate: 0.26 },
        { limit: 246752, rate: 0.29 },
        { limit: Infinity, rate: 0.33 }
      ];

      let prev = 0;
      for (const b of brackets) {
        if (taxable > prev) {
          const bracketDiff = Math.min(taxable - prev, b.limit - prev);
          tax += bracketDiff * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      const netIncome = income - tax;

      return {
        results: [
          { label: 'CRA Federal Tax Liabilities', value: tax.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Take Home After Federal Tax', value: netIncome.toFixed(2), unit: '$' },
          { label: 'Standard Basic personal Credit', value: bpa.toFixed(0), unit: '$' }
        ],
        chartData: [
          { name: 'CRA Tax Deductions', value: Math.round(tax), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'canada-gst',
    name: 'Canada GST & HST Calculator',
    slug: 'canada-gst',
    category: 'country',
    description: 'Add or extract Canadian Goods and Services Tax (GST) and Harmonized Sales Tax (HST) provincial codes.',
    seoTitle: 'Canada GST / HST Sales Tax Calculator | Calculatoora',
    seoDescription: 'Find GST and HST portions in Canadian provinces like Ontario (13% HST), BC (5% GST), and Alberta.',
    inputs: [
      { id: 'price', label: 'Item Cash Price ($)', type: 'number', defaultValue: 500, step: 25 },
      { id: 'province', label: 'Province Tax Rating', type: 'select', defaultValue: 'on', options: [
        { label: 'Ontario (13% HST)', value: '13' },
        { label: 'Alberta (5% GST)', value: '5' },
        { label: 'BC / Quebec (12% GST+PST)', value: '12' },
        { label: 'Nova Scotia (15% HST)', value: '15' }
      ]},
      { id: 'action', label: 'GST Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Add Tax to Net', value: 'add' },
        { label: 'Remove Tax from Gross', value: 'remove' }
      ]}
    ],
    formula: 'GST HST amount is standard percentage conversion based on localized province lists.',
    explanation: 'Canada levies a unified 5% federal GST. Several eastern provinces merge this with provincial taxes to form Harmonized Sales Tax (HST), ranging up to 15%.',
    example: 'For an Ontario merchant billing $500 including HST (13%), extracting tax yields a net of $442.48 and $57.52 HST tax.',
    faq: [
      { question: 'What is the standard GST rate across Alberta?', answer: 'Alberta imposes no provincial sales tax (PST), meaning physical sales carry only the 5% federal GST.' }
    ],
    relatedSlugs: ['canada-tax', 'canada-mortgage'],
    keywords: ['goods and services tax canada', 'ontario hst', 'alberta bill extractor', 'pst gst sales tax'],
    calculate: (inputs) => {
      const price = Number(inputs.price || 500);
      const rate = Number(inputs.province || 13);
      const action = inputs.action || 'add';

      let base = 0;
      let tax = 0;
      let total = 0;

      if (action === 'add') {
        base = price;
        tax = base * (rate / 100);
        total = base + tax;
      } else {
        total = price;
        base = total / (1 + (rate / 100));
        tax = total - base;
      }

      return {
        results: [
          { label: action === 'add' ? 'Total Gross Price' : 'Net Base Price', value: (action === 'add' ? total : base).toFixed(2), unit: '$', isPrimary: true },
          { label: 'GST / HST Portion', value: tax.toFixed(2), unit: '$' },
          { label: 'Tax Percentage Rate Applied', value: rate.toFixed(1), unit: '%' }
        ],
        chartData: [
          { name: 'Net Price', value: Math.round(base) },
          { name: 'Canadian GST/HST', value: Math.round(tax) }
        ]
      };
    }
  },
  {
    id: 'canada-mortgage',
    name: 'Canada Mortgage Calculator',
    slug: 'canada-mortgage',
    category: 'country',
    description: 'Calculate Canadian home loans, using semi-annual compounding regulations on amortization schedules.',
    seoTitle: 'Canadian Semi-Annual Compound Mortgage Calculator | Calculatoora',
    seoDescription: 'Obtain monthly home payments using Canadian regulations. Supports semi-annual compounding math.',
    inputs: [
      { id: 'principal', label: 'Total Loan Principal ($)', type: 'number', defaultValue: 350000, step: 10000 },
      { id: 'apr', label: 'Stated Mortgage Rate (%)', type: 'number', defaultValue: 5.4, step: 0.1 },
      { id: 'term', label: 'Amortization Period (Years)', type: 'number', defaultValue: 25, min: 10, max: 30, step: 5 }
    ],
    formula: 'Effective Monthly Rate (i_m) = [1 + (APR/200)]^(2/12) - 1\nPI Payment = Principal * [i_m * (1 + i_m)^n] / [(1 + i_m)^n - 1]',
    explanation: 'Canadian mortgage guidelines require interest rates to compound semi-annually rather than monthly. This makes the monthly interest factor slightly lower than standard US mortgage calculations.',
    example: 'For a $350,000 mortgage at 5.4% interest amortized over 25 years, the regulated Canadian compound rule leads to a monthly payment of $2,118.84.',
    faq: [
      { question: 'Why compound semi-annually in Canada?', answer: 'This is a historical consumer protection guideline enforced by Canadian Bank Acts, slightly pacing down overall interest compound speeds.' }
    ],
    relatedSlugs: ['canada-tax', 'canada-gst'],
    keywords: ['canadian compound mortgage', 'semi annual compounding', 'amortization limit canada', 'bank house loan'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 350000);
      const apr = Number(inputs.apr || 5.4);
      const years = Number(inputs.term || 25);

      const r_semi = apr / 200;
      const r_monthly = Math.pow(1 + r_semi, 2 / 12) - 1;
      const n = years * 12;

      let monthly = 0;
      if (r_monthly > 0) {
        monthly = p * r_monthly * Math.pow(1 + r_monthly, n) / (Math.pow(1 + r_monthly, n) - 1);
      } else {
        monthly = p / n;
      }

      const totalPaid = monthly * n;
      const interestPaid = totalPaid - p;

      return {
        results: [
          { label: 'Canadian Monthly Payment (P&I)', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Equivalent Monthly Interest Rate', value: (r_monthly * 100).toFixed(4), unit: '%' },
          { label: 'Total Accumulative Amortized Interest', value: interestPaid.toFixed(2), unit: '$' },
          { label: 'Total Principal Borrowed Balance', value: p.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Initial Principal', value: Math.round(p) },
          { name: 'Lifetime Interest', value: Math.round(interestPaid) }
        ]
      };
    }
  },

  // ==================== AUSTRALIA ====================
  {
    id: 'australia-tax',
    name: 'Australia Income Tax Calculator',
    slug: 'australia-tax',
    category: 'country',
    description: 'Calculate income tax structures based on the Australian Taxation Office (ATO) progressive resident rates.',
    seoTitle: 'Australia ATO Income Tax Calculator | Calculatoora',
    seoDescription: 'Accurately forecast ATO income tax liabilities using standard Australian progressive bands.',
    inputs: [
      { id: 'income', label: 'Gross Annual Salary (A$)', type: 'number', defaultValue: 90000, step: 2500 }
    ],
    formula: 'ATO tax bands: $0-$18.2k: 0%, $18.2k-$45k: 16%, $45k-$135k: 30%, $135k-$190k: 37%, above: 45%.',
    explanation: 'The standard resident tax brackets are sourced directly from the Australian Taxation Office (ATO), including recent Stage 3 personal tax revisions designed to help middle-bracket earners.',
    example: 'Earning A$90,000 gross yields an ATO tax liability of A$17,788 per year using progressive marginal rates.',
    faq: [
      { question: 'What is the ATO tax-free threshold value?', answer: 'Unrestricted residents do not pay physical taxes on the first A$18,200 of gross yearly earnings.' }
    ],
    relatedSlugs: ['australia-gst', 'australia-salary'],
    keywords: ['australian tax system', 'ato progressive return', 'income tax free threshold', 'stage three brackets'],
    calculate: (inputs) => {
      const income = Number(inputs.income || 90000);

      // ATO 2024/2025 brackets for Australian residents
      const brackets = [
        { limit: 18200, rate: 0.00 },
        { limit: 45000, rate: 0.16 }, // Stage 3 tax changes
        { limit: 135000, rate: 0.30 },
        { limit: 190000, rate: 0.37 },
        { limit: Infinity, rate: 0.45 }
      ];

      let tax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (income > prev) {
          const taxableRange = Math.min(income - prev, b.limit - prev);
          tax += taxableRange * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      const netIncome = income - tax;

      return {
        results: [
          { label: 'Estimated ATO Income Tax', value: tax.toFixed(2), unit: 'A$', isPrimary: true },
          { label: 'Take-Home Salary After Tax', value: netIncome.toFixed(2), unit: 'A$' },
          { label: 'ATO Marginal Bracket Rate', value: income > 190000 ? '45%' : income > 135000 ? '37%' : income > 45000 ? '30%' : income > 18200 ? '16%' : '0%' }
        ],
        chartData: [
          { name: 'Estimated Net Pay', value: Math.round(netIncome) },
          { name: 'ATO Tax Paid', value: Math.round(tax) }
        ]
      };
    }
  },
  {
    id: 'australia-gst',
    name: 'Australia GST Calculator',
    slug: 'australia-gst',
    category: 'country',
    description: 'Quickly calculate 10% Australia Goods and Services Tax added or extracted from commercial items.',
    seoTitle: 'Australia 10% GST Calculator | Calculatoora',
    seoDescription: 'Perform simple addition or extraction of Australia\'s standard 10% Goods and Services Tax (GST).',
    inputs: [
      { id: 'price', label: 'Commercial Price (A$)', type: 'number', defaultValue: 220, step: 10 },
      { id: 'action', label: 'GST Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Add 10% GST (Excluding GST)', value: 'add' },
        { label: 'Remove 10% GST (Including GST)', value: 'remove' }
      ]}
    ],
    formula: 'Add: GST = Net * 10%, Gross = Net * 1.1\nRemove: Net = Gross / 1.1, GST = Gross - Net',
    explanation: 'Australia levies a flat 10% Goods and Services Tax (GST) on most services and physical transactions structure. When stripping GST, divide the sticker price by exactly 11.',
    example: 'A gross pricing of A$220 with 10% GST corresponds to A$200 of net pricing and A$20 of GST tax.',
    faq: [
      { question: 'What items are GST-exempt in Australia?', answer: 'Basic fresh groceries, medical services, dental treatments, educational school tuitions, and standard child care services qualify for 0% GST.' }
    ],
    relatedSlugs: ['australia-tax', 'australia-salary'],
    keywords: ['ato gst solver', 'goods and services tax australia', 'strip GST calculator', 'ten percent surcharge'],
    calculate: (inputs) => {
      const price = Number(inputs.price || 220);
      const action = inputs.action || 'add';

      let base = 0;
      let tax = 0;
      let total = 0;

      if (action === 'add') {
        base = price;
        tax = base * 0.10;
        total = base + tax;
      } else {
        total = price;
        base = total / 1.10;
        tax = total - base;
      }

      return {
        results: [
          { label: action === 'add' ? 'Total Gross Price (GST Inc)' : 'Net Base Price (GST Ex)', value: (action === 'add' ? total : base).toFixed(2), unit: 'A$', isPrimary: true },
          { label: 'Calculated GST Component', value: tax.toFixed(2), unit: 'A$' },
          { label: 'GST Inclusive Price', value: total.toFixed(2), unit: 'A$' }
        ],
        chartData: [
          { name: 'Base Cost', value: Math.round(base) },
          { name: 'ATO GST portion', value: Math.round(tax) }
        ]
      };
    }
  },
  {
    id: 'australia-salary',
    name: 'Australia Salary Calculator',
    slug: 'australia-salary',
    category: 'country',
    description: 'Calculate Australian net salary, combining sliding resident tax bracket limits and the 2% Medicare surcharge levy.',
    seoTitle: 'Australia Net Salary after Tax & Medicare | Calculatoora',
    seoDescription: 'Obtain net paycheck amounts in Australia. Track PAYE, Medicare levies, and superannuation expectations.',
    inputs: [
      { id: 'grossIncome', label: 'Gross Annual CTC (A$)', type: 'number', defaultValue: 95000, step: 2500 },
      { id: 'medicareExempt', label: 'Medicare Surcharge Levy Scheme', type: 'select', defaultValue: 'standard', options: [
        { label: 'Standard Levy (2.0%)', value: '2' },
        { label: 'Exempt / Low Income (0.0%)', value: '0' }
      ]}
    ],
    formula: 'Medicare Levy = Gross * Levy Rate (Standard 2.0%)\nNet Pay = Gross - Progressive ATO Tax - Medicare Levy',
    explanation: 'In Australia, standard paychecks have both progressive ATO resident taxes and a flat 2.0% Medicare levy subtracted. Employers also pay compulsory Superannuation retirement splits on top of gross salary balances.',
    example: 'Earning A$95,000 as a standard resident leads to A$19,288 of progressive tax and A$1,900 of Medicare levy. Net take-home salary is A$73,812.',
    faq: [
      { question: 'What is the Superannuation Guarantee (SG)?', answer: 'SG is your retirement security fund. Australian companies are legally bound to pay a set percentage (currently 11.5%) of standard earnings.' }
    ],
    relatedSlugs: ['australia-tax', 'australia-gst'],
    keywords: ['salary check australia', 'paye checking ato', 'medicare levy rate', 'take home pay au'],
    calculate: (inputs) => {
      const gross = Number(inputs.grossIncome || 95000);
      const levyRate = Number(inputs.medicareExempt || 2);

      // 1. Tax
      const brackets = [
        { limit: 18200, rate: 0.00 },
        { limit: 45000, rate: 0.16 },
        { limit: 135000, rate: 0.30 },
        { limit: 190000, rate: 0.37 },
        { limit: Infinity, rate: 0.45 }
      ];

      let tax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (gross > prev) {
          const taxableRange = Math.min(gross - prev, b.limit - prev);
          tax += taxableRange * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      // 2. Medicare Levy
      const medicare = gross * (levyRate / 100);

      const netSalary = gross - tax - medicare;

      return {
        results: [
          { label: 'Estimated Net Take-Home Pay', value: netSalary.toFixed(2), unit: 'A$', isPrimary: true },
          { label: 'Monthly Australian pay deposit', value: (netSalary / 12).toFixed(2), unit: 'A$' },
          { label: 'Fortnightly pay deposit', value: (netSalary / 26).toFixed(2), unit: 'A$' },
          { label: 'Annual ATO Progressive Tax', value: tax.toFixed(2), unit: 'A$' },
          { label: 'Annual Medicare Levy Paid', value: medicare.toFixed(2), unit: 'A$' }
        ],
        chartData: [
          { name: 'Net Take-Home', value: Math.round(netSalary), color: '#10b981' },
          { name: 'ATO Income Tax', value: Math.round(tax), color: '#3b82f6' },
          { name: 'Medicare Surcharge', value: Math.round(medicare), color: '#ef4444' }
        ]
      };
    }
  },

  // ==================== INDIA ====================
  {
    id: 'india-income-tax',
    name: 'India Income Tax Calculator',
    slug: 'india-income-tax',
    category: 'country',
    description: 'Evaluate India personal income tax liabilities, comparing the standard Old tax regime versus the revised New progressive tax regime.',
    seoTitle: 'India Income Tax Old vs New Regime | Calculatoora',
    seoDescription: 'Determine taxable income in India for financial year calculations. Compares Old and New regimes.',
    inputs: [
      { id: 'salaryCTC', label: 'Annual Taxable Gross CTC (₹)', type: 'number', defaultValue: 1200000, step: 50000 },
      { id: 'standardDeduction', label: 'Standard Salaried Deductions (₹)', type: 'number', defaultValue: 75000, step: 5000 }
    ],
    formula: 'New Regime (FY 2024-25): progressive rates matching: ₹0-₹3L (0%), ₹3L-₹7L (5%), ₹7L-₹10L (10%), ₹10L-₹14L (15%), ₹14L-₹15L (20%), Above ₹15L (30%).',
    explanation: 'Finance Act rules present citizens two filing regime structures. The New Regime is the central standard, providing lower tax bracket barriers while retiring customized exemptions (80C, 80D, etc.).',
    example: 'Earning ₹12L standard salaried gross under the New Regime: After subtracting the ₹75,000 standard deduction, the progressive tax totals ₹70,000 plus a 4% health & education cess.',
    faq: [
      { question: 'What is health and education cess in India?', answer: 'Cess is an additional surcharge tax rate of 4% levied on top of your primary calculated income tax liability to support public schooling and health structures.' }
    ],
    relatedSlugs: ['india-gst', 'india-salary'],
    keywords: ['india tax regime', 'income tax return itp', 'section 80C old regime deductions', 'health and education cess'],
    calculate: (inputs) => {
      const g = Number(inputs.salaryCTC || 1200000);
      const stdDed = Number(inputs.standardDeduction || 75000);

      const netTaxableNew = Math.max(0, g - stdDed);

      // New Reg brackets FY 24-25:
      // ₹0 - 3,00,000: NIL
      // ₹3,00,001 - 7,00,000: 5%
      // ₹7,00,001 - 10,00,000: 10%
      // ₹10,00,001 - 14,00,000: 15%
      // ₹14,00,001 - 15,00,000: 20%
      // Above 15,00,000: 30%
      const brackets = [
        { limit: 300000, rate: 0.00 },
        { limit: 700000, rate: 0.05 },
        { limit: 1000000, rate: 0.10 },
        { limit: 1400000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
      ];

      let baseTax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (netTaxableNew > prev) {
          const taxableRange = Math.min(netTaxableNew - prev, b.limit - prev);
          baseTax += taxableRange * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      // Cess
      const cess = baseTax * 0.04;
      const totalTax = baseTax + cess;
      const netPay = g - totalTax;

      return {
        results: [
          { label: 'Estimated New Regime Tax Due', value: totalTax.toFixed(0), unit: '₹', isPrimary: true },
          { label: 'Take-Home Salary After Tax', value: netPay.toFixed(0), unit: '₹' },
          { label: 'Base Tax (Excluding Cess)', value: baseTax.toFixed(0), unit: '₹' },
          { label: 'Education & Health Cess (4%)', value: cess.toFixed(0), unit: '₹' }
        ],
        chartData: [
          { name: 'Take Home Salary', value: Math.round(netPay) },
          { name: 'Income Tax', value: Math.round(totalTax) }
        ]
      };
    }
  },
  {
    id: 'india-gst',
    name: 'India GST Calculator',
    slug: 'india-gst',
    category: 'country',
    description: 'Add or extract Indian Goods and Services Tax (GST) using standard slab configurations.',
    seoTitle: 'India GST Act Slab Rate Calculator | Calculatoora',
    seoDescription: 'Find CGST, SGST, and IGST allocations across India standard brackets (5%, 12%, 18%, 28%).',
    inputs: [
      { id: 'amount', label: 'Transaction Amount (₹)', type: 'number', defaultValue: 15000, step: 500 },
      { id: 'gstSlab', label: 'GST Tax Slab System', type: 'select', defaultValue: '18', options: [
        { label: 'Utility Goods (5%)', value: '5' },
        { label: 'Standard items (12%)', value: '12' },
        { label: 'Major services (18%)', value: '18' },
        { label: 'Luxury Goods (28%)', value: '28' }
      ]},
      { id: 'action', label: 'Calculate Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Add Tax to Base', value: 'add' },
        { label: 'Strip Tax from Total', value: 'remove' }
      ]}
    ],
    formula: 'Tax = Amount * (Slab / 100), Split equally into SGST and CGST for intra-state sales.',
    explanation: 'India GST has standard categorized slabs (5%, 12%, 18%, 28%). Intra-state operations split the tax equally into Central GST (CGST) and State GST (SGST).',
    example: 'For an ₹15,000 transaction under standard 18% GST: Adding tax results in ₹2,700 GST (₹1,350 SGST and ₹1,350 CGST), totaling ₹17,700 gross.',
    faq: [
      { question: 'What is IGST in India?', answer: 'Integrated GST (IGST) is collected on inter-state commerce transactions and directly pocketed by the central government.' }
    ],
    relatedSlugs: ['india-income-tax', 'india-salary'],
    keywords: ['india gst slabs', 'cgst sgst calculator', 'reverse tax search', 'indian business billing'],
    calculate: (inputs) => {
      const amt = Number(inputs.amount || 15000);
      const slab = Number(inputs.gstSlab || 18);
      const action = inputs.action || 'add';

      let base = 0;
      let gst = 0;
      let total = 0;

      if (action === 'add') {
        base = amt;
        gst = base * (slab / 100);
        total = base + gst;
      } else {
        total = amt;
        base = total / (1 + (slab / 100));
        gst = total - base;
      }

      const cgst = gst / 2;
      const sgst = cgst;

      return {
        results: [
          { label: action === 'add' ? 'Total Billing Price' : 'Tax-Excluded Price', value: (action === 'add' ? total : base).toFixed(2), unit: '₹', isPrimary: true },
          { label: 'Combined GST Tax Amount', value: gst.toFixed(2), unit: '₹' },
          { label: 'Central CGST Tax Component', value: cgst.toFixed(2), unit: '₹' },
          { label: 'State SGST Tax Component', value: sgst.toFixed(2), unit: '₹' }
        ],
        chartData: [
          { name: 'Base Cost', value: Math.round(base) },
          { name: 'CGST', value: Math.round(cgst) },
          { name: 'SGST', value: Math.round(sgst) }
        ]
      };
    }
  },
  {
    id: 'india-salary',
    name: 'India Salary Calculator',
    slug: 'india-salary',
    category: 'country',
    description: 'Calculate Indian in-hand (take-home) monthly income starting from annual cost-to-company (CTC) values, accounting for standard contributions.',
    seoTitle: 'India Annual CTC to In-Hand Salary | Calculatoora',
    seoDescription: 'Estimate Indian monthly take-home salary after subtracting Provident Funds (EPF) and New regime taxes.',
    inputs: [
      { id: 'ctcBillion', label: 'Gross Annual CTC (₹)', type: 'number', defaultValue: 1500000, step: 50000 },
      { id: 'providentFund', label: 'Employee EPF monthly deduction (₹)', type: 'number', defaultValue: 1800, step: 100 }
    ],
    formula: 'In Hand Salary = Gross CTC - Progressive New Tax - Annual EPF Contributions',
    explanation: 'Indian companies detail pay slips as CTC (Cost to Company). True in-hand monthly deposits are realized after clearing Employee Provident Fund (EPF), Professional Taxes, and progressive taxes.',
    example: 'A gross CTC of ₹15,00,000 yields ₹1,40,000 tax under the New Regime. Subtracting ₹21,600 annual EPF leaves a take-home of ₹13,38,400 (approx. ₹1,11,533/mo).',
    faq: [
      { question: 'What is the standard Provident Fund (EPF) rate?', answer: 'The standard employee contribution is 12% of basic wage structures, or capped at ₹1,800/month by default.' }
    ],
    relatedSlugs: ['india-income-tax', 'india-gst'],
    keywords: ['in hand salary', 'ctc base deductions', 'provident fund calculator', 'payroll index india'],
    calculate: (inputs) => {
      const ctc = Number(inputs.ctcBillion || 1500000);
      const epf = Number(inputs.providentFund || 1800) * 12;

      // 1. New Regime Tax on CTC minus basic exemptions
      const taxable = Math.max(0, ctc - 75000);
      const brackets = [
        { limit: 300000, rate: 0.00 },
        { limit: 700000, rate: 0.05 },
        { limit: 1000000, rate: 0.10 },
        { limit: 1400000, rate: 0.15 },
        { limit: 1500000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 }
      ];

      let baseTax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (taxable > prev) {
          const taxableRange = Math.min(taxable - prev, b.limit - prev);
          baseTax += taxableRange * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      const tax = baseTax * 1.04;
      const netPayAnnual = ctc - tax - epf;
      const netPayMonthly = netPayAnnual / 12;

      return {
        results: [
          { label: 'Estimated Monthly Take-Home', value: netPayMonthly.toFixed(0), unit: '₹', isPrimary: true },
          { label: 'Estimated Annual Net Pay', value: netPayAnnual.toFixed(0), unit: '₹' },
          { label: 'Annual Income Tax Charge', value: tax.toFixed(0), unit: '₹' },
          { label: 'Annual Employee EPF Savings', value: epf.toFixed(0), unit: '₹' }
        ],
        chartData: [
          { name: 'Monthly Take Home', value: Math.round(netPayMonthly), color: '#10b981' },
          { name: 'Taxes/Fees portion', value: Math.round(tax / 12), color: '#ef4444' }
        ]
      };
    }
  },

  // ==================== GLOBAL SINGLE-COUNTRY ADDITIONS ====================
  {
    id: 'germany-tax',
    name: 'Germany Tax Calculator',
    slug: 'germany-tax',
    category: 'country',
    description: 'Calculate Germany income taxes (Einkommensteuertarif) with standard solidarity surcharges (Solidaritätszuschlag).',
    seoTitle: 'Germany Income Tax Einkommensteuer | Calculatoora',
    seoDescription: 'Obtain net salary estimates in Germany. Calculates Einkommensteuer and solidary surcharges.',
    inputs: [
      { id: 'brackets', label: 'German Annual Income (€)', type: 'number', defaultValue: 60000, step: 2000 },
      { id: 'classCode', label: 'Tax Class (Steuerklasse)', type: 'select', defaultValue: 'I', options: [
        { label: 'Class I (Single Filer)', value: 'I' },
        { label: 'Class III (Married / Single earner)', value: 'III' }
      ]}
    ],
    formula: 'German progressive formula is based on mathematical zones starting at 14% up to 42% (or 45% Reichensteuer).',
    explanation: 'Germany employs a dense progressive tax system with specialized zone formulas. Solidaritätszuschlag (5.5%) is additionally calculated on high income thresholds.',
    example: 'Earning €60,000 as a Steuerklasse I filer results in an estimated Einkommensteuer tax of €11,920 annually.',
    faq: [
      { question: 'What is solidarity surcharge (Soli) in Germany?', answer: 'An extra tax levy created to support German reunification efforts, currently exempt for low and mid-income brackets.' }
    ],
    relatedSlugs: ['uk-income-tax', 'us-income-tax'],
    keywords: ['steuerklasse return', 'einkommensteuer tariff', 'germany tax return', 'soli taxable'],
    calculate: (inputs) => {
      const income = Number(inputs.brackets || 60000);
      const taxClass = inputs.classCode || 'I';

      // Germany simplified prog tariff
      const allowance = taxClass === 'III' ? 23200 : 11600;
      const taxable = Math.max(0, income - allowance);

      let tax = 0;
      if (taxable > 0) {
        if (taxable <= 50000) {
          tax = taxable * 0.18;
        } else if (taxable <= 100000) {
          tax = 9000 + (taxable - 50000) * 0.32;
        } else {
          tax = 25000 + (taxable - 100000) * 0.42;
        }
      }

      const soli = tax > 18000 ? tax * 0.055 : 0;
      const net = income - tax - soli;

      return {
        results: [
          { label: 'German Einkommensteuer Tax', value: tax.toFixed(2), unit: '€', isPrimary: true },
          { label: 'German Net Annual Pay', value: net.toFixed(2), unit: '€' },
          { label: 'Solidarity Surcharge (Soli)', value: soli.toFixed(2), unit: '€' }
        ],
        chartData: [
          { name: 'Einkommensteuer', value: Math.round(tax) },
          { name: 'Soli Surcharge', value: Math.round(soli) }
        ]
      };
    }
  },
  {
    id: 'france-tax',
    name: 'France Tax Calculator',
    slug: 'france-tax',
    category: 'country',
    description: 'Calculate France progressive income tax (Impôt sur le revenu) using standard quotients and bracket sizes.',
    seoTitle: 'France Income Tax Impôt sur le revenu | Calculatoora',
    seoDescription: 'Calculate Impôt sur le revenu under the France tax regime. Analyzes progressive tax brackets and parts.',
    inputs: [
      { id: 'income', label: 'Net Annual Taxable Income (€)', type: 'number', defaultValue: 45000, step: 2000 },
      { id: 'parts', label: 'Household Quotient Code (Parts)', type: 'number', defaultValue: 1, min: 1, max: 5, step: 0.5 }
    ],
    formula: 'Quotient = Income / Parts\nProgressive Tax = Computed progressive tax on Quotient * Parts',
    explanation: 'French taxation utilizes the "parts familiales" system. Family quotient math divides gross household income by parts before progressive taxation is assessed to protect larger families.',
    example: 'Earning €45,000 as a single person (1 Part) yields an estimatedフランス income tax of €6,480.',
    faq: [
      { question: 'What is the French Barème Progressif?', answer: 'The standard prog tiers of 0%, 11%, 30%, 41%, and 45% applied progressively across income quotients.' }
    ],
    relatedSlugs: ['germany-tax'],
    keywords: ['impot sur le revenu', 'france tax brackets', 'parts familiales quotient', 'french brackets'],
    calculate: (inputs) => {
      const income = Number(inputs.income || 45000);
      const parts = Number(inputs.parts || 1);

      const quotient = income / parts;
      let qTax = 0;

      // Impôt bands 2024
      const bands = [
        { limit: 11294, rate: 0.00 },
        { limit: 28797, rate: 0.11 },
        { limit: 82341, rate: 0.30 },
        { limit: 177106, rate: 0.41 },
        { limit: Infinity, rate: 0.45 }
      ];

      let prev = 0;
      for (const b of bands) {
        if (quotient > prev) {
          const taxableRange = Math.min(quotient - prev, b.limit - prev);
          qTax += taxableRange * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      const totalTax = qTax * parts;
      const net = income - totalTax;

      return {
        results: [
          { label: 'French Impôt sur le revenu', value: totalTax.toFixed(2), unit: '€', isPrimary: true },
          { label: 'France Net Income after Tax', value: net.toFixed(2), unit: '€' },
          { label: 'Taxable Quotient Amount', value: quotient.toFixed(0), unit: '€' }
        ],
        chartData: [
          { name: 'Income tax', value: Math.round(totalTax) }
        ]
      };
    }
  },
  {
    id: 'japan-tax',
    name: 'Japan Tax Calculator',
    slug: 'japan-tax',
    category: 'country',
    description: 'Estimate Japan progressive national income taxes and flat resident tax (住民税) liabilities.',
    seoTitle: 'Japan National and Resident Tax Calculator | Calculatoora',
    seoDescription: 'Check standard Japan progressive earnings taxes. Calculates National Tax + 10% Local Resident Tax.',
    inputs: [
      { id: 'income', label: 'Gross Annual Earnings (¥)', type: 'number', defaultValue: 6000000, step: 200000 },
      { id: 'deductions', label: 'Standard Employment Deductions (¥)', type: 'number', defaultValue: 1600000, step: 100000 }
    ],
    formula: 'Taxable = Income - Employment Deductions\nNational Tax progressive sliding scale + Local Resident Tax (flat 10%)',
    explanation: 'Japan taxes wages on a two-tier federal structure: progressive National Income Tax (5% to 45% based on CRA) and flat 10% Local Resident Tax (Juminzei).',
    example: 'Earning ¥6,000,000 gross with a ¥1,600,000 employment rebate leads to about ¥340,000 national tax and ¥440,000 resident tax.',
    faq: [
      { question: 'What is Japan Juminzei tax?', answer: 'The resident tax is a flat 10% tax allocated to prefectures and city-zone wards to maintain public infrastructure.' }
    ],
    relatedSlugs: ['singapore-tax'],
    keywords: ['japan income tax calculator', 'juminzei resident tax', 'employment rebate tokyo', 'japanese tax brackets'],
    calculate: (inputs) => {
      const g = Number(inputs.income || 6000000);
      const ded = Number(inputs.deductions || 1600000);

      const taxable = Math.max(0, g - ded);

      // Progressive National Tax
      const brackets = [
        { limit: 1950000, rate: 0.05 },
        { limit: 3300000, rate: 0.10 },
        { limit: 6950000, rate: 0.20 },
        { limit: 9000000, rate: 0.23 },
        { limit: Infinity, rate: 0.33 }
      ];

      let natTax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (taxable > prev) {
          const taxableInBracket = Math.min(taxable - prev, b.limit - prev);
          natTax += taxableInBracket * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      // Resident Tax (flat 10% of taxable)
      const resTax = taxable * 0.10;
      const totalTax = natTax + resTax;
      const netPay = g - totalTax;

      return {
        results: [
          { label: 'Comprehensive Japanese Tax Due', value: totalTax.toFixed(0), unit: '¥', isPrimary: true },
          { label: 'National Progressive Income Tax', value: natTax.toFixed(0), unit: '¥' },
          { label: 'Flat 10% Resident Tax (住民税)', value: resTax.toFixed(0), unit: '¥' },
          { label: 'Net Annual Salary After Tax', value: netPay.toFixed(0), unit: '¥' }
        ],
        chartData: [
          { name: 'Net Income', value: Math.round(netPay) },
          { name: 'National Tax', value: Math.round(natTax) },
          { name: 'Resident Tax', value: Math.round(resTax) }
        ]
      };
    }
  },
  {
    id: 'singapore-tax',
    name: 'Singapore Tax Calculator',
    slug: 'singapore-tax',
    category: 'country',
    description: 'Calculate Singapore progressive resident personal income tax liabilities under Inland Revenue Authority models.',
    seoTitle: 'Singapore IRAS Resident Income Tax | Calculatoora',
    seoDescription: 'A streamlined calculator comparing tax scales in Singapore using the progressive IRAS resident rates.',
    inputs: [
      { id: 'income', label: 'Assessable Annual Income (S$)', type: 'number', defaultValue: 120000, step: 5000 }
    ],
    formula: 'First S$20k (0%), next S$10k (2%), next S$10k (3.50%), next S$40k (7%), next S$40k (11.5%), next S$40k (15%).',
    explanation: 'Singapore levies low personal income tax rates. Resident tax is computed progressively under IRAS limits.',
    example: 'An annual salary of S$120,000 incurs S$7,950 in total taxes (an effective rate of just 6.6%).',
    faq: [
      { question: 'Who qualifies for tax-residency in Singapore?', answer: 'Standard foreigners working in Singapore for 183 days or more in a calendar year qualify as progressive tax residents.' }
    ],
    relatedSlugs: ['japan-tax'],
    keywords: ['iras tax solver', 'singapore low resident tax', 'singapore income return', 'assessable yield iras'],
    calculate: (inputs) => {
      const g = Number(inputs.income || 120000);

      const brackets = [
        { limit: 20000, rate: 0.00 },
        { limit: 30000, rate: 0.02 },
        { limit: 40000, rate: 0.035 },
        { limit: 80000, rate: 0.07 },
        { limit: 120000, rate: 0.115 },
        { limit: 160000, rate: 0.15 },
        { limit: Infinity, rate: 0.18 }
      ];

      let tax = 0;
      let prev = 0;
      for (const b of brackets) {
        if (g > prev) {
          const chunk = Math.min(g - prev, b.limit - prev);
          tax += chunk * b.rate;
          prev = b.limit;
        } else {
          break;
        }
      }

      const net = g - tax;

      return {
        results: [
          { label: 'Estimated IRAS Personal Tax', value: tax.toFixed(2), unit: 'S$', isPrimary: true },
          { label: 'Take Home Salary after Tax', value: net.toFixed(2), unit: 'S$' },
          { label: 'IRAS effective tax rate', value: ((tax / g) * 100).toFixed(1), unit: '%' }
        ],
        chartData: [
          { name: 'Take-Home Net', value: Math.round(net) },
          { name: 'IRAS tax portion', value: Math.round(tax) }
        ]
      };
    }
  },
  {
    id: 'uae-salary',
    name: 'UAE Salary Calculator',
    slug: 'uae-salary',
    category: 'country',
    description: 'Calculate monthly take-home income in the UAE, detailing statutory basic offsets and standard End of Service gratuity offsets.',
    seoTitle: 'UAE Salary & End Of Service Gratuity | Calculatoora',
    seoDescription: 'Detail UAE wage items. Features basic salary allocation and standard End of Service Gratuity payouts.',
    inputs: [
      { id: 'monthlyGross', label: 'Monthly Gross Salary (AED)', type: 'number', defaultValue: 25000, step: 1000 },
      { id: 'basicPercent', label: 'Basic Salary allocation (%)', type: 'number', defaultValue: 60, min: 20, max: 100, step: 5 },
      { id: 'yearsOfService', label: 'Years Of Service (For gratuity check)', type: 'number', defaultValue: 5, min: 1, max: 20, step: 1 }
    ],
    formula: 'Net Monthly Income = Monthly Gross (due to 0% resident personal income tax)\nGratuity (21 days of basic wage per year for first 5 years).',
    explanation: 'The UAE levies 0% personal income tax on salaries and allowances, meaning physical gross salary equals monthly cash take-home. Companies calculate dynamic gratuity balances under UAE Labour Law structural zones.',
    example: 'For a monthly salary of AED 25,000 (basic = AED 15,000) and 5 years of service, the statutory End of Service (EOS) gratuity payout equates to AED 75,000.',
    faq: [
      { question: 'Do UAE residents pay income taxes on foreign rent earnings?', answer: 'No, personal salaries, interest earnings, dividends, investment portfolios, and real estate yields carry 0% income tax in the UAE.' }
    ],
    relatedSlugs: ['singapore-tax'],
    keywords: ['uae gratuity solver', 'dubai personal tax free', 'united arab emirates wage check', 'basic contract wage'],
    calculate: (inputs) => {
      const gross = Number(inputs.monthlyGross || 25000);
      const basicPct = Number(inputs.basicPercent || 60);
      const yrs = Number(inputs.yearsOfService || 5);

      const basicMonthly = gross * (basicPct / 100);
      const dailyBasic = basicMonthly / 30;

      // UAE Gratuity formula:
      // Less than 1 year: NIL
      // 1 to 5 years: 21 days basic salary for each year
      // Above 5 years: 30 days basic salary for each additional year
      let gratuity = 0;
      if (yrs >= 1) {
        if (yrs <= 5) {
          gratuity = dailyBasic * 21 * yrs;
        } else {
          gratuity = (dailyBasic * 21 * 5) + (dailyBasic * 30 * (yrs - 5));
        }
      }

      return {
        results: [
          { label: 'Monthly UAE Net Pay (0% Tax)', value: gross.toFixed(2), unit: 'AED', isPrimary: true },
          { label: 'Stated Monthly Basic Contract Salary', value: basicMonthly.toFixed(2), unit: 'AED' },
          { label: 'Hired Accrued EOS Gratuity Bonus', value: gratuity.toFixed(0), unit: 'AED' }
        ],
        chartData: [
          { name: 'Monthly Pay', value: gross },
          { name: 'Yearly EOS accrual', value: Math.round(gratuity / yrs) }
        ]
      };
    }
  }
];
