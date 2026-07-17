import { Calculator } from '../types';

export const V7_FINANCE_B_CALCULATORS: Calculator[] = [
  {
    id: 'business-profit-calculator',
    name: 'Business Profit Calculator',
    slug: 'business-profit-calculator',
    category: 'business',
    description: 'Calculate net and gross business profit from overall revenue streams and cost profiles.',
    seoTitle: 'Business Profitability Calculator | Calculatoora',
    seoDescription: 'Find your net profit margin by inputting gross business revenue, cost of goods sold, and operating overheads.',
    inputs: [
      { id: 'revenue', label: 'Overall Gross Revenue', type: 'number', defaultValue: 150000, step: 2500, unit: '$' },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS)', type: 'number', defaultValue: 60000, step: 1000, unit: '$' },
      { id: 'expenses', label: 'Overhead Operating Expenses', type: 'number', defaultValue: 45000, step: 1000, unit: '$' }
    ],
    formula: 'Gross Profit = Revenue - COGS\nNet Profit = Gross Profit - Expenses',
    explanation: 'Differentiating between production limits and administrative overhead keeps operating budgets sustainable.',
    example: 'Earn $150,000, subtract $60,000 COGS to get $90,000 gross profit. Subtract $45,000 operational overhead to find your true net profit of $45,000.',
    faq: [{ question: 'What is a healthy profit margin?', answer: 'Average net margins vary significantly by industry, but 10% to 20% is broadly considered healthy for most small businesses.' }],
    relatedSlugs: ['business-margin-calculator', 'break-even-point-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue) || 0;
      const cogs = Number(inputs.cogs) || 0;
      const ops = Number(inputs.expenses) || 0;

      const gross = rev - cogs;
      const net = gross - ops;
      const margin = rev > 0 ? (net / rev) * 100 : 0;

      return {
        results: [
          { label: 'Net Profit', value: net.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Gross Profit Margins', value: gross.toFixed(2), unit: '$' },
          { label: 'Net Profit Margin Ratio', value: margin.toFixed(1), unit: '%' }
        ],
        chartData: [
          { name: 'Cost of Goods (COGS)', value: cogs, color: '#f59e0b' },
          { name: 'Operating Overhead', value: ops, color: '#ef4444' },
          { name: 'Net Retention', value: Math.max(0, net), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'business-margin-calculator',
    name: 'Business Margin Calculator',
    slug: 'business-margin-calculator',
    category: 'business',
    description: 'Calculate gross profit margin, markup ratio, and absolute margins from unit selling prices.',
    seoTitle: 'Gross Margin & Markup Calculator | Calculatoora',
    seoDescription: 'Find your product profit margins and markup percentages to optimize pricing and maximize revenue.',
    inputs: [
      { id: 'cost', label: 'Unit Item Production Cost', type: 'number', defaultValue: 35, step: 1, unit: '$' },
      { id: 'price', label: 'Unit Selling Price', type: 'number', defaultValue: 95, step: 1, unit: '$' }
    ],
    formula: 'Margin = ((Price - Cost) / Price) * 100\nMarkup = ((Price - Cost) / Cost) * 100',
    explanation: 'Understand the distinct difference between profit margins (based on retail sales) and markups (based on underlying costs).',
    example: 'For a $35 item sold at $95: margin is 63.16%, and markup stands at 171.43%.',
    faq: [{ question: 'Why is margin always lower than markup?', answer: 'Margin is calculated relative to the final retail price, which is always higher than the cost baseline used to determine markup.' }],
    relatedSlugs: ['business-profit-calculator', 'product-pricing-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 1;
      const price = Number(inputs.price) || 1;

      const profit = price - cost;
      const margin = price > 0 ? (profit / price) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        results: [
          { label: 'Gross Margin', value: margin.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Product Markup Ratio', value: markup.toFixed(2), unit: '%' },
          { label: 'Net Profit Per Unit', value: profit.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'operating-cost-calculator',
    name: 'Operating Cost Calculator',
    slug: 'operating-cost-calculator',
    category: 'business',
    description: 'Add up monthly fixed and variable utility costs to find your ongoing burn rate.',
    seoTitle: 'Business Operating Cost Planner | Calculatoora',
    seoDescription: 'Aggregate administration, utility, marketing, and wages to evaluate true monthly operating expenses.',
    inputs: [
      { id: 'rent', label: 'Monthly Corporate Rent', type: 'number', defaultValue: 3200, step: 100, unit: '$' },
      { id: 'salaries', label: 'Operational Staff Wages', type: 'number', defaultValue: 12000, step: 500, unit: '$' },
      { id: 'tech', label: 'Software & Utilities Subscription', type: 'number', defaultValue: 1500, step: 50, unit: '$' },
      { id: 'marketing', label: 'Ad & Channel Spend', type: 'number', defaultValue: 2500, step: 100, unit: '$' }
    ],
    formula: 'Total Operating Costs = Rent + Wages + Utilities + Marketing',
    explanation: 'Consolidating overhead keeps startups aligned on burn rates and cash runway indicators.',
    example: 'Totaling Rent ($3.2k), Wages ($12k), Software ($1.5k), and Ads ($2.5k) results in monthly cash outlays of $19,200.00.',
    faq: [{ question: 'Are operating costs tax deductible?', answer: 'Yes! Crucial business expenditures directly lower your taxable net profit.' }],
    relatedSlugs: ['business-profit-calculator', 'salary-budget-calculator'],
    calculate: (inputs) => {
      const r = Number(inputs.rent) || 0;
      const s = Number(inputs.salaries) || 0;
      const t = Number(inputs.tech) || 0;
      const m = Number(inputs.marketing) || 0;

      const total = r + s + t + m;
      return {
        results: [
          { label: 'Monthly Operating Overhead', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Operating Burn Rate', value: (total * 12).toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'break-even-point-calculator',
    name: 'Break Even Point Calculator',
    slug: 'break-even-point-calculator',
    category: 'business',
    description: 'Calculate the volume of units or revenue required to cross the zero loss threshold.',
    seoTitle: 'Break-Even Analysis Calculator | Calculatoora',
    seoDescription: 'Find your break-even point in unit sales. Solve cost structures to determine when revenue covers fixed expenses.',
    inputs: [
      { id: 'fixed', label: 'Total Annual Fixed Costs', type: 'number', defaultValue: 50000, step: 1000, unit: '$' },
      { id: 'price', label: 'Selling Price Per Unit', type: 'number', defaultValue: 120, step: 2, unit: '$' },
      { id: 'variable', label: 'Variable Cost Per Unit', type: 'number', defaultValue: 40, step: 1, unit: '$' }
    ],
    formula: 'Break-Even Units = Fixed Costs / (Price - Variable Cost)',
    explanation: 'Determines the minimum sales volume required to cover your fixed operating expenses.',
    example: 'With $50,000 fixed costs, an item price of $120, and variable costs of $40: you must sell 625 units annually to break even.',
    faq: [{ question: 'What is the contribution margin?', answer: 'The contribution margin represents the profit earned on each unit (Price minus Variable Cost) that helps pay down fixed overhead.' }],
    relatedSlugs: ['business-margin-calculator', 'business-profit-calculator'],
    calculate: (inputs) => {
      const fixed = Number(inputs.fixed) || 0;
      const price = Number(inputs.price) || 0;
      const variable = Number(inputs.variable) || 0;

      const contrib = price - variable;
      const units = contrib > 0 ? fixed / contrib : 0;
      const breakEvenRev = units * price;

      return {
        results: [
          { label: 'Required Break-Even Unit Volume', value: Math.ceil(units), unit: 'Units Sold', isPrimary: true },
          { label: 'Required Sales Revenue Limit', value: breakEvenRev.toFixed(2), unit: '$' },
          { label: 'Unit Contribution Profit Margin', value: contrib.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'inventory-cost-calculator',
    name: 'Inventory Cost Calculator',
    slug: 'inventory-cost-calculator',
    category: 'business',
    description: 'Assess carrying, purchasing, and handling holding expenses of physical inventory warehouses.',
    seoTitle: 'Inventory Carriage & Hold Calculator | Calculatoora',
    seoDescription: 'Calculate the total cost of carrying inventory. Track unit purchases, warehouse rates, and maintenance premiums.',
    inputs: [
      { id: 'value', label: 'Average Value of Stored Inventory', type: 'number', defaultValue: 80000, step: 1000, unit: '$' },
      { id: 'holdingRate', label: 'Annual Holding Cost Rate (Average 25%)', type: 'number', defaultValue: 25, min: 1, max: 75, step: 1, unit: '%' }
    ],
    formula: 'Carrying Costs = Average Value * (Holding Rate / 100)',
    explanation: 'Storage, spoilage, and insurance chip away at capital. This tool highlights hidden logistics costs.',
    example: 'Carrying $80,000 of materials under a standard 25.00% annual holding rate costs $20,000.00 in hidden expenses.',
    faq: [{ question: 'What is a standard inventory holding cost rate?', answer: 'Most physical retail businesses suffer warehouse carrying costs between 20% and 30% annually.' }],
    relatedSlugs: ['inventory-turnover-calculator', 'product-profit-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.value) || 0;
      const pct = (Number(inputs.holdingRate) || 25) / 100;
      const carrying = val * pct;
      return {
        results: [
          { label: 'Annual Stock Carrying Costs', value: carrying.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Daily Storage Expense Burden', value: (carrying / 365).toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'inventory-turnover-calculator',
    name: 'Inventory Turnover Calculator',
    slug: 'inventory-turnover-calculator',
    category: 'business',
    description: 'Calculate inventory turnover rates to track sales speed and operational bottlenecks.',
    seoTitle: 'Inventory Turnover Rate Solver | Calculatoora',
    seoDescription: 'Obtain turnover ratio and average days on shelf from cost of goods sold and average stock levels.',
    inputs: [
      { id: 'cogs', label: 'Cost of Goods Sold Annual (COGS)', type: 'number', defaultValue: 120000, step: 2000, unit: '$' },
      { id: 'averageStock', label: 'Average On-Shelf Stock Value', type: 'number', defaultValue: 25000, step: 500, unit: '$' }
    ],
    formula: 'Turnover Rate = COGS / Average Stock Value\nDays on Shelf = 365 / Turnover Rate',
    explanation: 'A higher turnover rate indicates fast sales and strong supply chain asset efficiency.',
    example: 'With $120,000 COGS and $25,000 average stock, inventory turns 4.8 times annually, lasting about 76 days on shelf.',
    faq: [{ question: 'What is a strong retail turnover target?', answer: 'A turnover ratio between 4 and 8 is typical for balanced retail and inventory pipelines.' }],
    relatedSlugs: ['inventory-cost-calculator', 'wholesale-calculator'],
    calculate: (inputs) => {
      const cogs = Number(inputs.cogs) || 1;
      const avg = Number(inputs.averageStock) || 1;

      const rate = cogs / avg;
      const shelfDays = rate > 0 ? 365 / rate : 0;

      return {
        results: [
          { label: 'Inventory Turnover Ratio', value: rate.toFixed(2), unit: 'Turns/Yr', isPrimary: true },
          { label: 'Average Days Stasis Shelf', value: Math.ceil(shelfDays), unit: 'Days' }
        ]
      };
    }
  },
  {
    id: 'employee-cost-calculator',
    name: 'Employee Cost Calculator',
    slug: 'employee-cost-calculator',
    category: 'business',
    description: 'Calculate the true hourly or yearly cost of employment, factoring in taxes and employee benefits.',
    seoTitle: 'Employee Full Cost Loader | Calculatoora',
    seoDescription: 'Obtain exact calculations of full employee costs, incorporating social taxes, wages, and benefit premiums.',
    inputs: [
      { id: 'salary', label: 'Base Annual Salary Dues', type: 'number', defaultValue: 70000, step: 1000, unit: '$' },
      { id: 'benefits', label: 'Insurance, Allowances & Benefits', type: 'number', defaultValue: 12000, step: 500, unit: '$' },
      { id: 'taxes', label: 'FICA & Payroll Taxes (Average %)', type: 'number', defaultValue: 7.65, step: 0.1, unit: '%' }
    ],
    formula: 'Total Payroll cost = Salary + Benefits + (Taxes % * Salary)',
    explanation: 'The true cost of hiring goes beyond raw wages. This loader helps projects project overhead budgets.',
    example: 'A base salary of $70,000, plus $12,000 in benefits, and a 7.65% payroll tax results in an actual employee cost of $87,355.00.',
    faq: [{ question: 'What is the employer payroll tax?', answer: 'In the US, the employer portion of FICA payroll taxes is 7.65% for Social Security and Medicare up to statutory limits.' }],
    relatedSlugs: ['salary-budget-calculator', 'business-profit-calculator'],
    calculate: (inputs) => {
      const base = Number(inputs.salary) || 0;
      const ben = Number(inputs.benefits) || 0;
      const rate = (Number(inputs.taxes) || 7.65) / 100;

      const taxDues = base * rate;
      const total = base + ben + taxDues;

      return {
        results: [
          { label: 'True Annual Corporate Cost', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Employer Payroll Tax Burden', value: taxDues.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'salary-budget-calculator',
    name: 'Salary Budget Calculator',
    slug: 'salary-budget-calculator',
    category: 'business',
    description: 'Determine what portion of annual revenue is allocated to employee salaries.',
    seoTitle: 'Salary Pool Budget Planner | Calculatoora',
    seoDescription: 'Evaluate household or corporate salary budgets relative to gross income projections.',
    inputs: [
      { id: 'revenue', label: 'Expected Company revenue', type: 'number', defaultValue: 500000, step: 5000, unit: '$' },
      { id: 'budgetPct', label: 'Target Salary Allocation', type: 'number', defaultValue: 40, min: 10, max: 80, step: 1, unit: '%' }
    ],
    formula: 'Salary Pool = Revenue * (Budget % / 100)',
    explanation: 'Keeping payroll costs in proportion to revenue ensures sustainable growth.',
    example: 'For sales revenue of $500,000, a safe 40.00% corporate salary pool provides $200,000.00 for employee compensation.',
    faq: [{ question: 'What is a typical payroll percentage?', answer: 'Most service and knowledge industries spend 40% to 60% of gross revenues on team compensation.' }],
    relatedSlugs: ['employee-cost-calculator', 'operating-cost-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue) || 0;
      const pct = (Number(inputs.budgetPct) || 30) / 100;
      const wages = rev * pct;
      return {
        results: [
          { label: 'Maximum Allocated Salary Pool', value: wages.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Compensation Budget Limit', value: (wages / 12).toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'business-growth-calculator',
    name: 'Business Growth Calculator',
    slug: 'business-growth-calculator',
    category: 'business',
    description: 'Project future corporate revenues using a compound annual growth rate (CAGR).',
    seoTitle: 'Business CAGR Growth Projector | Calculatoora',
    seoDescription: 'Simulate business compound growths. Predict future sales volumes under compound yearly expectations.',
    inputs: [
      { id: 'startVal', label: 'Current Base Sales Revenue', type: 'number', defaultValue: 250000, step: 5000, unit: '$' },
      { id: 'growth', label: 'Expected Annual CAGR Rate', type: 'number', defaultValue: 12, step: 0.5, unit: '%' },
      { id: 'years', label: 'Growth Project Horizon (Years)', type: 'number', defaultValue: 5, step: 1, unit: 'yrs' }
    ],
    formula: 'Future Value = Current Base * (1 + CAGR % / 100) ^ Years',
    explanation: 'Models future growth based on past performance using a compound annual growth rate.',
    example: 'A base revenue of $250,000 compounding at a 12.00% CAGR will grow to $440,585.42 in 5 years.',
    faq: [{ question: 'What is a standard SME growth rate?', answer: 'Healthy small businesses grow at an average rate of 10% to 15% annually.' }],
    relatedSlugs: ['business-profit-calculator', 'wealth-projection-calculator'],
    calculate: (inputs) => {
      const base = Number(inputs.startVal) || 0;
      const app = (Number(inputs.growth) || 12) / 100;
      const yrs = Number(inputs.years) || 5;

      const futureValue = base * Math.pow(1 + app, yrs);
      const increase = futureValue - base;

      return {
        results: [
          { label: 'Projected Target Sales Volume', value: futureValue.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Net Revenue Increase', value: increase.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'product-profit-calculator',
    name: 'Product Profit Calculator',
    slug: 'product-profit-calculator',
    category: 'business',
    description: 'Determine profit margins and markups for individual retail items.',
    seoTitle: 'Retail Product Unit profitability | Calculatoora',
    seoDescription: 'Find net margins on retail inventory by accounting for wholesale prices, shipping, and handling costs.',
    inputs: [
      { id: 'wholesale', label: 'Wholesale Item Cost', type: 'number', defaultValue: 12, step: 0.5, unit: '$' },
      { id: 'sellingPrice', label: 'Unit Selling Price', type: 'number', defaultValue: 35, step: 1, unit: '$' },
      { id: 'shippingCost', label: 'Unit Shipping Fees Paid', type: 'number', defaultValue: 3.5, step: 0.25, unit: '$' }
    ],
    formula: 'Net Profit = Selling Price - Wholesale Cost - Shipping\nNet Margin = (Net Profit / Selling Price) * 100',
    explanation: 'E-commerce operations must account for shipping costs to accurate estimate unit profitability.',
    example: 'Selling a $12 wholesale item for $35, with $3.50 shipping, yields $19.50 profit per unit—a 55.71% net profit margin.',
    faq: [{ question: 'Is margin calculated before or after handling?', answer: 'Ensure you include packaging, labels, and fulfillment costs in the shipping/handling input.' }],
    relatedSlugs: ['product-pricing-calculator', 'shipping-cost-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.wholesale) || 0;
      const price = Number(inputs.sellingPrice) || 1;
      const ship = Number(inputs.shippingCost) || 0;

      const totalCos = cost + ship;
      const profit = price - totalCos;
      const margin = price > 0 ? (profit / price) * 100 : 0;

      return {
        results: [
          { label: 'Net Profit Per Unit', value: profit.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Retail Sales Margin Output', value: margin.toFixed(2), unit: '%' },
          { label: 'Combined Production Cost Dues', value: totalCos.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'product-pricing-calculator',
    name: 'Product Pricing Calculator',
    slug: 'product-pricing-calculator',
    category: 'business',
    description: 'Determine retail pricing for your products based on target profit margins.',
    seoTitle: 'Target Margin Pricing Calculator | Calculatoora',
    seoDescription: 'Solve retail pricing. Enter your manufacturing cost and desired margin to find the matching retail price.',
    inputs: [
      { id: 'cost', label: 'Total Unit Production Cost', type: 'number', defaultValue: 25, step: 1, unit: '$' },
      { id: 'targetMargin', label: 'Desired Gross margin Target', type: 'number', defaultValue: 60, min: 10, max: 95, step: 1, unit: '%' }
    ],
    formula: 'Retail Selling Price = Production Cost / (1 - Desired Margin / 100)',
    explanation: 'Helps businesses set prices based on financial margin targets rather than arbitrary markup percentages.',
    example: 'To yield a 60.00% gross margin on a $25 production cost, set the retail selling price to $62.50.',
    faq: [{ question: 'How is margin-based pricing different from markup pricing?', answer: 'Margin-based pricing calculates prices using the final retail revenue, making it more accurate for direct gross profitability budgeting.' }],
    relatedSlugs: ['product-profit-calculator', 'business-margin-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 1;
      const m = (Number(inputs.targetMargin) || 60) / 100;

      const price = m < 1 ? cost / (1 - m) : cost;
      const profit = price - cost;

      return {
        results: [
          { label: 'Target Selling Price Retail', value: price.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Resulting Net Profit Per Sale', value: profit.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'marketplace-fee-calculator',
    name: 'Marketplace Fee Calculator',
    slug: 'marketplace-fee-calculator',
    category: 'business',
    description: 'Calculate net payouts after e-commerce marketplace commission scales and transaction fees.',
    seoTitle: 'Online Marketplace Payout Fee Calculator | Calculatoora',
    seoDescription: 'Find your net payout from popular e-commerce platforms by factoring in processing commissions and shipping overheads.',
    inputs: [
      { id: 'price', label: 'Selling Price of Product', type: 'number', defaultValue: 50, step: 1, unit: '$' },
      { id: 'commissionPct', label: 'Marketplace Referral Fee Rate', type: 'number', defaultValue: 15, step: 0.5, unit: '%' },
      { id: 'fixedTxFee', label: 'Fixed Transaction Fee', type: 'number', defaultValue: 0.30, step: 0.05, unit: '$' }
    ],
    formula: 'Marketplace Fee = (Referral Fee % * Price) + Fixed Transaction Fee\nNet Payout = Price - Marketplace Fee',
    explanation: 'Account for referral commissions and processing costs to accurately project net margins on third-party eCommerce platforms.',
    example: 'A $50 item sold with a 15.00% marketplace fee and $0.30 fixed processing costs nets a payout of $42.20.',
    faq: [{ question: 'What is Amazon Referral Fee standard?', answer: 'Amazon typically charges commission referral fees between 8% and 15%, depending on the product category.' }],
    relatedSlugs: ['order-profit-calculator', 'product-pricing-calculator'],
    calculate: (inputs) => {
      const price = Number(inputs.price) || 0;
      const pct = (Number(inputs.commissionPct) || 15) / 100;
      const fix = Number(inputs.fixedTxFee) || 0;

      const fee = price * pct + fix;
      const pay = Math.max(0, price - fee);

      return {
        results: [
          { label: 'Net Platform Payout', value: pay.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Marketplace Commissions Paid', value: fee.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'shipping-cost-calculator',
    name: 'Shipping Cost Calculator',
    slug: 'shipping-cost-calculator',
    category: 'business',
    description: 'Calculates dimensional shipping weights to estimate transit and handling charges.',
    seoTitle: 'Dimensional Shipping Weight Calculator | Calculatoora',
    seoDescription: 'Find dimensional weight and avoid retail shipping surcharges by evaluating box dimensions.',
    inputs: [
      { id: 'length', label: 'Package Length', type: 'number', defaultValue: 12, step: 1, unit: 'in' },
      { id: 'width', label: 'Package Width', type: 'number', defaultValue: 10, step: 1, unit: 'in' },
      { id: 'height', label: 'Package Height', type: 'number', defaultValue: 8, step: 1, unit: 'in' },
      { id: 'divisor', label: 'Dimensional Divisor (Standard 139)', type: 'number', defaultValue: 139, step: 1, unit: 'div' }
    ],
    formula: 'Dimensional Weight = (Length * Width * Height) / Divisor',
    explanation: 'Logistics carriers charge based on package volume rather than physical weight if the dimensional weight is higher.',
    example: 'A bulky but lightweight 12x10x8 inch package yields a dimensional billing weight of 6.9 lbs.',
    faq: [{ question: 'What is a typical shipping divisor?', answer: 'UPS and FedEx use a standard commercial divisor of 139 for express domestic shipments.' }],
    relatedSlugs: ['product-profit-calculator', 'order-profit-calculator'],
    calculate: (inputs) => {
      const l = Number(inputs.length) || 1;
      const w = Number(inputs.width) || 1;
      const h = Number(inputs.height) || 1;
      const d = Number(inputs.divisor) || 139;

      const dimwt = (l * w * h) / d;
      return {
        results: [
          { label: 'Carrier Dimensional Weight', value: dimwt.toFixed(2), unit: 'lbs', isPrimary: true },
          { label: 'Package Volume Capacity', value: (l * w * h).toFixed(0), unit: 'cu in' }
        ]
      };
    }
  },
  {
    id: 'order-profit-calculator',
    name: 'Order Profit Calculator',
    slug: 'order-profit-calculator',
    category: 'business',
    description: 'Evaluate net margins on multi-unit retail orders.',
    seoTitle: 'Multi-Item Order Profitability | Calculatoora',
    seoDescription: 'Input inventory costs, order totals, processing fees, and shipping costs to calculate overall order margins.',
    inputs: [
      { id: 'quantity', label: 'Order Quantity', type: 'number', defaultValue: 5, step: 1, unit: 'qty' },
      { id: 'unitPrice', label: 'Selling Price Per Unit', type: 'number', defaultValue: 25, step: 1, unit: '$' },
      { id: 'unitCost', label: 'Wholesale Cost Per Unit', type: 'number', defaultValue: 10, step: 0.5, unit: '$' },
      { id: 'shippingCost', label: 'Total Shipping & Packaging Cost', type: 'number', defaultValue: 15, step: 1, unit: '$' }
    ],
    formula: 'Order Profit = (Quantity * Price) - (Quantity * Wholesale Cost) - Shipping',
    explanation: 'Assess the impact of bulk orders, packing, and shipping fees on overall profitability.',
    example: 'Selling 5 units at $25 each, with a $10 unit cost and $15 shipping fee, returns a net order profit of $60.00.',
    faq: [{ question: 'How can I lower order processing costs?', answer: 'Group multiple items into a single shipment to reduce dimensional shipping overhead.' }],
    relatedSlugs: ['shipping-cost-calculator', 'product-profit-calculator'],
    calculate: (inputs) => {
      const q = Number(inputs.quantity) || 1;
      const p = Number(inputs.unitPrice) || 0;
      const c = Number(inputs.unitCost) || 0;
      const s = Number(inputs.shippingCost) || 0;

      const revenue = q * p;
      const expenses = (q * c) + s;
      const profit = revenue - expenses;
      const margin = revenue > 0 ? (profit / revenue) * 100 : 0;

      return {
        results: [
          { label: 'Order Net Profit', value: profit.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Order Gross Margin Output', value: margin.toFixed(2), unit: '%' },
          { label: 'Combined Order Revenue', value: revenue.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'discount-strategy-calculator',
    name: 'Discount Strategy Calculator',
    slug: 'discount-strategy-calculator',
    category: 'business',
    description: 'Evaluate overall revenue impacts of promotional discounts on retail product sales volumes.',
    seoTitle: 'Promotional Discount Margins | Calculatoora',
    seoDescription: 'Find how much additional sales volume is needed to recover business margins after applying retail discounts.',
    inputs: [
      { id: 'normalPrice', label: 'Retail Price (Normal)', type: 'number', defaultValue: 50, step: 1, unit: '$' },
      { id: 'cost', label: 'Item Base Cost', type: 'number', defaultValue: 20, step: 0.5, unit: '$' },
      { id: 'discountPct', label: 'Promotional Discount rate', type: 'number', defaultValue: 20, min: 0, max: 80, step: 5, unit: '%' }
    ],
    formula: 'New Profit = Normal Price * (1 - Discount %) - cost\nRequired Volume Raise = (Normal Profit / New Profit - 1) * 100',
    explanation: 'Discounts depress gross margins. This formula reveals how much sales volume must increase to preserve normal baseline profit pools.',
    example: 'Offering a 20.00% discount on a $50 item with $20 baseline costs reduces profit from $30 to $20; you must boost sales volumes by 50% to stay even.',
    faq: [{ question: 'What is the danger of heavy discounting?', answer: 'Overly aggressive discounting can erode your brand value and compress net profit margins below sustainable levels.' }],
    relatedSlugs: ['retail-margin-calculator', 'business-margin-calculator'],
    calculate: (inputs) => {
      const pricing = Number(inputs.normalPrice) || 1;
      const cost = Number(inputs.cost) || 0;
      const disc = (Number(inputs.discountPct) || 20) / 100;

      const normProfit = pricing - cost;
      const discountedPrice = pricing * (1 - disc);
      const discProfit = discountedPrice - cost;

      const reqVolMultiplier = discProfit > 0 ? (normProfit / discProfit - 1) * 100 : 999;
      return {
        results: [
          { label: 'Discounted Retail Unit Price', value: discountedPrice.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Reduced Net Profit Per Unit', value: discProfit.toFixed(2), unit: '$' },
          { label: 'Required Sales Volume Increase', value: reqVolMultiplier === 999 ? 'Deficit' : reqVolMultiplier.toFixed(1), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'wholesale-calculator',
    name: 'Wholesale Calculator',
    slug: 'wholesale-calculator',
    category: 'business',
    description: 'Calculate bulk wholesale pricing from base manufacturing costs.',
    seoTitle: 'Wholesale Unit Margin Solver | Calculatoora',
    seoDescription: 'Find bulk wholesale price points and retail markups based on target markup rates.',
    inputs: [
      { id: 'cost', label: 'Unit Manufacturing Cost', type: 'number', defaultValue: 8, step: 0.5, unit: '$' },
      { id: 'wholesaleMarkup', label: 'Wholesale Markup Percentage', type: 'number', defaultValue: 50, step: 5, unit: '%' }
    ],
    formula: 'Wholesale Price = Cost * (1 + Wholesale Markup / 100)',
    explanation: 'Helps manufacturers determine bulk pricing to cover overhead while leaving room for retail markup scales.',
    example: 'An $8 production item using a 50.00% wholesale markup is priced at $12.00 for bulk wholesale.',
    faq: [{ question: 'What is a typical Keystoning strategy?', answer: 'Keystoning is doubling the wholesale cost (a 100% markup) to set retail price guidelines.' }],
    relatedSlugs: ['retail-margin-calculator', 'product-pricing-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const mk = (Number(inputs.wholesaleMarkup) || 50) / 100;

      const wsPrice = cost * (1 + mk);
      const suggestedRetail = wsPrice * 2.0;

      return {
        results: [
          { label: 'Target Wholesale Selling Price', value: wsPrice.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Suggested Keystone Retail Price', value: suggestedRetail.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'retail-margin-calculator',
    name: 'Retail Margin Calculator',
    slug: 'retail-margin-calculator',
    category: 'business',
    description: 'Calculate average retail profit margins on inventory acquisition costs.',
    seoTitle: 'Retailer Sales Margin Calculator | Calculatoora',
    seoDescription: 'Determine retail gross profit margins and markups by analyzing stock acquisition costs.',
    inputs: [
      { id: 'wholesaleCost', label: 'Wholesale Purchase Price', type: 'number', defaultValue: 15, step: 1, unit: '$' },
      { id: 'retailPrice', label: 'Retail Price Tag', type: 'number', defaultValue: 39, step: 1, unit: '$' }
    ],
    formula: 'Gross Margin = ((Retail Price - Wholesale Cost) / Retail Price) * 100',
    explanation: 'Assess item performance using retail sales margin metrics.',
    example: 'Purchasing stock at $15 wholesale and selling at $39 retail generates a 61.54% gross profit margin.',
    faq: [{ question: 'What is a typical retail margin?', answer: 'Durable and apparel retail operations target gross margins between 50% and 65%.' }],
    relatedSlugs: ['wholesale-calculator', 'business-margin-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.wholesaleCost) || 1;
      const pr = Number(inputs.retailPrice) || 1;

      const diff = pr - cost;
      const margin = pr > 0 ? (diff / pr) * 100 : 0;

      return {
        results: [
          { label: 'Gross Retail Sales Margin', value: margin.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Product Unit Margin Income', value: diff.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'conversion-funnel-calculator',
    name: 'Conversion Funnel Calculator',
    slug: 'conversion-funnel-calculator',
    category: 'marketing',
    description: 'Analyze e-commerce conversion rates through standard visitor stages.',
    seoTitle: 'E-commerce Conversion Funnel Calculator | Calculatoora',
    seoDescription: 'Assess marketing funnel drops. Highlight performance changes by analyzing impressions, clicks, and sales volumes side-by-side.',
    inputs: [
      { id: 'visitors', label: 'Total Page Visitors', type: 'number', defaultValue: 10000, step: 500, unit: 'vis' },
      { id: 'carts', label: 'Total Add-To-Carts', type: 'number', defaultValue: 800, step: 50, unit: 'cart' },
      { id: 'orders', label: 'Completed Sales Orders', type: 'number', defaultValue: 180, step: 10, unit: 'qty' }
    ],
    formula: 'Add-to-Cart Rate = Cart / Visitors\nTotal Conversion Rate = Orders / Visitors',
    explanation: 'Pinpoints leakage in customer acquisition paths to optimize user experience and boost checkouts.',
    example: 'For 10,000 visitors, 800 additions, and 180 actual checkouts: your cart conversion rate is 8.00%, with a final sales conversion rate of 1.80%.',
    faq: [{ question: 'What is a healthy ecommerce conversion rate?', answer: 'Average retail ecommerce checkout success rates range from 1.5% to 3%.' }],
    relatedSlugs: ['customer-acquisition-cost-calculator', 'ad-budget-calculator'],
    calculate: (inputs) => {
      const vis = Number(inputs.visitors) || 1;
      const cart = Number(inputs.carts) || 0;
      const ord = Number(inputs.orders) || 0;

      const cartRate = (cart / vis) * 100;
      const convRate = (ord / vis) * 100;
      const dropRate = cart > 0 ? ((cart - ord) / cart) * 100 : 0;

      return {
        results: [
          { label: 'Final Purchase Conversion Rate', value: convRate.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Visitor Add-to-Cart Conversion', value: cartRate.toFixed(2), unit: '%' },
          { label: 'Shopping Cart Abandonment Rate', value: dropRate.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Pure Traffic Bounce', value: Math.max(0, vis - cart), color: '#3b82f6' },
          { name: 'Carts Saved But Abandoned', value: cart - ord, color: '#f59e0b' },
          { name: 'Purchasers Logged', value: ord, color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'customer-acquisition-cost-calculator',
    name: 'Customer Acquisition Cost Calculator',
    slug: 'customer-acquisition-cost-calculator',
    category: 'marketing',
    description: 'Calculate Customer Acquisition Cost (CAC) by dividing total marketing spend by newly won customers.',
    seoTitle: 'CAC Customer Acquisition Cost Calculator | Calculatoora',
    seoDescription: 'Find your real Customer Acquisition Cost to evaluate marketing channel efficiency.',
    inputs: [
      { id: 'spend', label: 'Total Marketing & Advertising Spend', type: 'number', defaultValue: 15000, step: 500, unit: '$' },
      { id: 'newCustomers', label: 'Number of Customers Acquired', type: 'number', defaultValue: 600, step: 20, unit: 'qty' }
    ],
    formula: 'CAC = Total spend / Newly won Customers',
    explanation: 'Assess marketing efficiency. Understanding customer acquisition costs helps guide ad budgets.',
    example: 'Spending $15,000 on ad channels to close 600 new buyers results in a $25.00 CAC.',
    faq: [{ question: 'How is CAC evaluated against Lifetime Value?', answer: 'Sustainable businesses target a healthy LTV:CAC ratio of 3:1 or higher.' }],
    relatedSlugs: ['customer-lifetime-value-calculator', 'email-marketing-roi-calculator'],
    calculate: (inputs) => {
      const sp = Number(inputs.spend) || 0;
      const cust = Number(inputs.newCustomers) || 1;
      const cac = sp / cust;
      return {
        results: [
          { label: 'Customer Acquisition Cost (CAC)', value: cac.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Assumed Customer Count', value: cust, unit: 'Buyers' }
        ]
      };
    }
  },
  {
    id: 'customer-lifetime-value-calculator',
    name: 'Customer Lifetime Value Calculator',
    slug: 'customer-lifetime-value-calculator',
    category: 'marketing',
    description: 'Calculate Customer Lifetime Value (LTV) to project compound revenue from repeat buyers.',
    seoTitle: 'Customer Lifetime Value LTV Planner | Calculatoora',
    seoDescription: 'Simulate average buyer transaction values, frequencies, and retention rates to identify overall customer values.',
    inputs: [
      { id: 'averageOrder', label: 'Average Order Value (AOV)', type: 'number', defaultValue: 85, step: 5, unit: '$' },
      { id: 'frequency', label: 'Yearly Purchases per Customer', type: 'number', defaultValue: 4, step: 1, unit: 'turns/yr' },
      { id: 'retentionYrs', label: 'Average Customer Lifespan', type: 'number', defaultValue: 3, step: 1, unit: 'yrs' }
    ],
    formula: 'Customer Lifetime Value (LTV) = AOV * Frequency * Lifespan',
    explanation: 'Long-term business viability is driven by repeat purchases, making customer lifetime value a key performance metric.',
    example: 'With an average order value of $85, 4 yearly purchases, and a 3-year lifespan: each customer has a projected LTV of $1,020.00.',
    faq: [{ question: 'How can I lift customer LTV scores?', answer: 'Implement post-purchase email flows, reward setups, and subscription options to encourage repeat buys.' }],
    relatedSlugs: ['customer-acquisition-cost-calculator', 'campaign-profit-calculator'],
    calculate: (inputs) => {
      const aov = Number(inputs.averageOrder) || 0;
      const freq = Number(inputs.frequency) || 1;
      const life = Number(inputs.retentionYrs) || 1;

      const ltv = aov * freq * life;
      return {
        results: [
          { label: 'Customer Lifetime Value (LTV)', value: ltv.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Worth Allocation', value: (aov * freq).toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'email-marketing-roi-calculator',
    name: 'Email Marketing ROI Calculator',
    slug: 'email-marketing-roi-calculator',
    category: 'marketing',
    description: 'Calculate the return on investment of promotional email blasts.',
    seoTitle: 'Email Campaign return on Investment (ROI) | Calculatoora',
    seoDescription: 'Find email campaign profitability by parsing subscriber click-throughs, sales conversions, and subscription fees.',
    inputs: [
      { id: 'audience', label: 'Total Email Subscribers Sent', type: 'number', defaultValue: 25000, step: 1000, unit: 'sub' },
      { id: 'clickRate', label: 'Average Click-Through Rate (CTR)', type: 'number', defaultValue: 2.5, step: 0.1, unit: '%' },
      { id: 'convRate', label: 'In-Store Sales Conversion Rate', type: 'number', defaultValue: 3.2, step: 0.1, unit: '%' },
      { id: 'aov', label: 'Average Profit per Checkout Sale', type: 'number', defaultValue: 45, step: 1, unit: '$' },
      { id: 'cost', label: 'Campaign Software Cost', type: 'number', defaultValue: 250, step: 10, unit: '$' }
    ],
    formula: 'Orders = Subscribers * Click % * Conversion %\nRevenue = Orders * AOV\nROI = ((Revenue - Cost) / Cost) * 100',
    explanation: 'Calculates overall email conversion returns relative to software subscriptions and list maintenance overhead.',
    example: 'For 25,000 emails sent with a 2.5% CTR: 625 clickers yield 20 orders (at 3.20% conversion) worth $900—returning a 260.00% email ROI against $250 software costs.',
    faq: [{ question: 'What is a typical email marketing click rate?', answer: 'Industry average click-through rates range from 1.5% to 3%, depending on personalization and list quality.' }],
    relatedSlugs: ['customer-acquisition-cost-calculator', 'campaign-profit-calculator'],
    calculate: (inputs) => {
      const aud = Number(inputs.audience) || 0;
      const ctr = (Number(inputs.clickRate) || 2.5) / 100;
      const conv = (Number(inputs.convRate) || 3) / 100;
      const aov = Number(inputs.aov) || 0;
      const cost = Number(inputs.cost) || 1;

      const clickers = aud * ctr;
      const ordersUnit = clickers * conv;
      const earningsValue = ordersUnit * aov;
      const roi = ((earningsValue - cost) / cost) * 100;

      return {
        results: [
          { label: 'Campaign Return on Investment', value: roi.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Gross Revenue Generated', value: earningsValue.toFixed(2), unit: '$' },
          { label: 'Completed Purchases Logged', value: Math.round(ordersUnit), unit: 'Sales' }
        ]
      };
    }
  },
  {
    id: 'ad-budget-calculator',
    name: 'Ad Budget Calculator',
    slug: 'ad-budget-calculator',
    category: 'marketing',
    description: 'Plan required digital ad spend budgets based on sales acquisition targets.',
    seoTitle: 'Ad Spend Allocation Planner | Calculatoora',
    seoDescription: 'Find required ad budgets by entering target customer acquisition volumes and ad channel CAC costs.',
    inputs: [
      { id: 'targetCustomers', label: 'Desired New Customers Acquired', type: 'number', defaultValue: 100, step: 5, unit: 'qty' },
      { id: 'targetCAC', label: 'Expected Acquisition Cost (CAC)', type: 'number', defaultValue: 35, step: 1, unit: '$' }
    ],
    formula: 'Required Ad Budget = Target Customers * Expected CAC',
    explanation: 'Aligns brand goals with financial reality by calculating the budget needed to hit customer targets.',
    example: 'Acquiring 100 customers with a standard $35 acquisition threshold requires a $3,500.00 ad budget.',
    faq: [{ question: 'How is baseline CAC determined?', answer: 'Benchmark past campaigns by dividing total marketing spend by new customers.' }],
    relatedSlugs: ['campaign-profit-calculator', 'customer-acquisition-cost-calculator'],
    calculate: (inputs) => {
      const cust = Number(inputs.targetCustomers) || 0;
      const cac = Number(inputs.targetCAC) || 0;
      return {
        results: [
          { label: 'Required Ad Channel Budget', value: (cust * cac).toFixed(2), unit: '$', isPrimary: true },
          { label: 'Expected Customer Conversion', value: cust, unit: 'Users' }
        ]
      };
    }
  },
  {
    id: 'campaign-profit-calculator',
    name: 'Campaign Profit Calculator',
    slug: 'campaign-profit-calculator',
    category: 'marketing',
    description: 'Assess the net profitability of digital ad campaigns after deducting overall ad spend.',
    seoTitle: 'SME Campaign Net Profitability | Calculatoora',
    seoDescription: 'Input ad costs and sales revenue to measure return on ad spend and net campaign profitability.',
    inputs: [
      { id: 'revenue', label: 'Overall Campaign Revenue', type: 'number', defaultValue: 8500, step: 100, unit: '$' },
      { id: 'spend', label: 'Total Digital Ad Spend', type: 'number', defaultValue: 3000, step: 100, unit: '$' }
    ],
    formula: 'Net campaign Profit = Revenue - Ad Spend\nROAS = Revenue / Ad Spend',
    explanation: 'Measures campaign efficiency using Return on Ad Spend (ROAS).',
    example: 'Generating $8,500 in sales from $3,000 ad spend returns a net profit of $5,500 (representing a 2.83x ROAS).',
    faq: [{ question: 'What is a strong ROAS benchmark?', answer: 'A ROAS of 3.0x or higher is considered healthy for online product campaigns.' }],
    relatedSlugs: ['ad-budget-calculator', 'customer-acquisition-cost-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue) || 0;
      const sp = Number(inputs.spend) || 1;

      const profit = rev - sp;
      const roas = rev / sp;

      return {
        results: [
          { label: 'Campaign Net Profitability', value: profit.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Return on Ad Spend (ROAS)', value: roas.toFixed(2), unit: 'x' }
        ],
        chartData: [
          { name: 'Ad Spend Loss', value: sp, color: '#ef4444' },
          { name: 'Net Campaign Earnings', value: Math.max(0, profit), color: '#10b981' }
        ]
      };
    }
  },
  {
    id: 'marketing-budget-calculator',
    name: 'Marketing Budget Calculator',
    slug: 'marketing-budget-calculator',
    category: 'marketing',
    description: 'Determine what portion of annual business revenue is allocated to marketing budgets.',
    seoTitle: 'Annual Marketing Budget Planner | Calculatoora',
    seoDescription: 'Find your sustainable annual marketing budget by analyzing gross business revenues.',
    inputs: [
      { id: 'revenue', label: 'Expected Company annual Revenue', type: 'number', defaultValue: 450000, step: 5000, unit: '$' },
      { id: 'allocationPct', label: 'Marketing Allocation Fee (Average %)', type: 'number', defaultValue: 8, min: 2, max: 25, step: 0.5, unit: '%' }
    ],
    formula: 'Marketing Budget = revenue * (Allocation % / 100)',
    explanation: 'Helps businesses set and stick to sustainable marketing and advertising budgets.',
    example: 'An business generating $450,000 in gross sales with an 8.00% marketing allocation budget funds a yearly marketing campaign of $36,000.00.',
    faq: [{ question: 'What is the standard marketing allocation percentage?', answer: 'Traditional businesses allocate 5% to 10% of revenue to marketing, while fast-growing startups may spend 15% to 25%.' }],
    relatedSlugs: ['ad-budget-calculator', 'campaign-profit-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue) || 0;
      const pct = (Number(inputs.allocationPct) || 8) / 100;
      const cost = rev * pct;
      return {
        results: [
          { label: 'Annual Marketing Budget Limit', value: cost.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Advertising Allowance', value: (cost / 12).toFixed(2), unit: '$' }
        ]
      };
    }
  }
];
