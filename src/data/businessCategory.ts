import { Calculator } from '../types';

export const BUSINESS_CALCULATORS: Calculator[] = [
  {
    id: 'profit-margin-calculator-advanced',
    name: 'Profit Margin Calculator',
    slug: 'profit-margin-calculator-advanced',
    category: 'business',
    description: 'Calculate product sales margins, markup parameters, and net corporate profits from cost layouts.',
    seoTitle: 'Profit Margin & Pricing Cost Calculator | Calculatoora',
    seoDescription: 'Obtain precise revenue margins and markups. Isolate pricing structures for wholesale or retail distribution channels.',
    inputs: [
      { id: 'cost', label: 'Unit Cost Price (COGS)', type: 'number', defaultValue: 60, step: 1, unit: '$' },
      { id: 'revenue', label: 'Unit Selling Price (Revenue)', type: 'number', defaultValue: 100, step: 1, unit: '$' }
    ],
    formula: 'Profit Margin = [ (Revenue - Cost) / Revenue ] * 100\nMarkup = [ (Revenue - Cost) / Cost ] * 100',
    explanation: 'Profit margin is the share of selling price that represents pure profit. Markup is the percentage added on top of a product is cost price to reach the final selling price.',
    example: 'For an item with a $60 raw cost sold for $100, the gross profit is $40.00, representing a 40.0% Profit Margin and a 66.67% Markup yield.',
    faq: [
      { question: 'What is the main difference between Margin and Markup?', answer: 'Margin is calculated relative to the selling price, while Markup is calculated relative to the cost price.' }
    ],
    relatedSlugs: ['gross-profit-calculator', 'markup-calculator', 'break-even-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const rev = Number(inputs.revenue) || 0;

      const profit = Math.max(0, rev - cost);
      const margin = rev > 0 ? (profit / rev) * 100 : 0;
      const markup = cost > 0 ? (profit / cost) * 100 : 0;

      return {
        results: [
          { label: 'Calculated Gross Profit', value: profit.toFixed(2), unit: '$' },
          { label: 'Product Profit Margin', value: margin.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Assessed Price Markup', value: markup.toFixed(2), unit: '%' },
          { label: 'Total Unit sales Revenue', value: rev.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Cost of Goods Sold (COGS)', value: cost, color: '#312e81' },
          { name: 'Net Unit Profit Margin', value: profit, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'gross-profit-calculator',
    name: 'Gross Profit Calculator',
    slug: 'gross-profit-calculator',
    category: 'business',
    description: 'Track total corporate revenues vs the Cost of Goods Sold (COGS) to calculate gross margins.',
    seoTitle: 'Gross Profit & Margin Calculator | Calculatoora',
    seoDescription: 'Accurately separate manufacturing costs from gross income metrics to monitor raw business profitability.',
    inputs: [
      { id: 'revenue', label: 'Gross Sales Revenue', type: 'number', defaultValue: 250000, step: 5000, unit: '$' },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS)', type: 'number', defaultValue: 150000, step: 2000, unit: '$' }
    ],
    formula: 'Gross Profit = Revenue - COGS\nGross Margin = (Gross Profit / Revenue) * 100',
    explanation: 'Gross Profit evaluates a business is core productivity before accounting for structural tax, rent or marketing costs.',
    example: 'Generating $250,000 in sales with $150,000 in raw manufacturing costs leaves $100,000 gross profit, showing a 40.0% gross margin.',
    faq: [
      { question: 'What counts as COGS?', answer: 'Raw materials, assembly line workers wages, and factory power consumed during production of sold items represent COGS.' }
    ],
    relatedSlugs: ['net-profit-calculator', 'profit-margin-calculator-advanced', 'break-even-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue) || 0;
      const cogs = Number(inputs.cogs) || 0;

      const gross = Math.max(0, rev - cogs);
      const margin = rev > 0 ? (gross / rev) * 100 : 0;

      return {
        results: [
          { label: 'Gross Profit Margin Amount', value: gross.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Gross Profit Margin Rate', value: margin.toFixed(2), unit: '%' },
          { label: 'Cost of Goods Sold', value: cogs.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Cost of Goods (COGS)', value: cogs, color: '#312e81' },
          { name: 'Gross Profit Reserve', value: gross, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'net-profit-calculator',
    name: 'Net Profit Calculator',
    slug: 'net-profit-calculator',
    category: 'business',
    description: 'Calculate net corporate take-home gains by subtracting operating overhead, taxes, and interest from revenues.',
    seoTitle: 'Net Profit Margin Calculator | Calculatoora',
    seoDescription: 'Obtain absolute net profit. Put in COGS, advertising overheads, interest, and tax rates for business reporting.',
    inputs: [
      { id: 'revenue', label: 'Gross Sales Revenue', type: 'number', defaultValue: 500000, step: 10000, unit: '$' },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS)', type: 'number', defaultValue: 200000, step: 5000, unit: '$' },
      { id: 'operating', label: 'Operating Expenses (OPEX)', type: 'number', defaultValue: 120000, step: 2000, unit: '$' },
      { id: 'tax', label: 'State & Corporate Taxes Paid', type: 'number', defaultValue: 30000, step: 1000, unit: '$' }
    ],
    formula: 'Net Profit = Revenue - COGS - OPEX - Taxes\nNet Margin = (Net Profit / Revenue) * 100',
    explanation: 'Net Profit is the ultimate bottom-line. It reveals whether a business is operationally viable after accounting for all structural overhads.',
    example: 'For $500,000 revenue, $200,000 COGS, $120,000 OPEX and $30,000 taxes, your Net Profit works out to $150,000 with a 30.0% net margin.',
    faq: [
      { question: 'What is OPEX?', answer: 'Operating Expenses include office rents, selling expenses, management salaries, advertising, and utility bills.' }
    ],
    relatedSlugs: ['gross-profit-calculator', 'profit-margin-calculator-advanced', 'break-even-calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue) || 0;
      const cogs = Number(inputs.cogs) || 0;
      const opex = Number(inputs.operating) || 0;
      const tax = Number(inputs.tax) || 0;

      const net = Math.max(0, rev - cogs - opex - tax);
      const margin = rev > 0 ? (net / rev) * 100 : 0;

      return {
        results: [
          { label: 'Net Profit (Bottom Line)', value: net.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Net Profit Margin Rate', value: margin.toFixed(2), unit: '%' },
          { label: 'Total Business Deductions', value: (cogs + opex + tax).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Core Net Profit', value: net, color: '#39FF14' },
          { name: 'Raw COGS', value: cogs, color: '#ef4444' },
          { name: 'Operating OPEX', value: opex, color: '#f59e0b' },
          { name: 'Corporate Tax', value: tax, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'markup-calculator',
    name: 'Markup Calculator',
    slug: 'markup-calculator',
    category: 'business',
    description: 'Calculate product selling prices and markup percentages based on raw manufacturing cost inputs.',
    seoTitle: 'Markup Calculator - Pricing Cost | Calculatoora',
    seoDescription: 'Solve corresponding selling values or markups instantly. Plan pricing architectures to sustain gross margins.',
    inputs: [
      { id: 'cost', label: 'Raw Cost Price', type: 'number', defaultValue: 50, step: 1, unit: '$' },
      { id: 'markup', label: 'Markup Percentage Wanted', type: 'number', defaultValue: 50, step: 5, unit: '%' }
    ],
    formula: 'Selling Price = Cost * (1 + Markup / 100)\nProfit = Selling Price - Cost',
    explanation: 'Markup determines the premium percentage a business tacks onto a cost base. High markups are required in cosmetics and software.',
    example: 'A $50 item marked up by 50% sells for $75.00, yielding a $25.00 profit and a 33.33% profit margin.',
    faq: [
      { question: 'Why specify markup over margins?', answer: 'Many companies prefer markup because it calculates prices directly from stable COGS inputs.' }
    ],
    relatedSlugs: ['profit-margin-calculator-advanced', 'gross-profit-calculator', 'break-even-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const markup = Number(inputs.markup) || 0;

      const price = cost * (1 + (markup / 100));
      const profit = Math.max(0, price - cost);
      const margin = price > 0 ? (profit / price) * 100 : 0;

      return {
        results: [
          { label: 'Target Selling Price', value: price.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Absolute Unit Profit', value: profit.toFixed(2), unit: '$' },
          { label: 'Effective Profit Margin', value: margin.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Product Cost Base', value: cost, color: '#312e81' },
          { name: 'Unit Markup Profit Price', value: profit, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'break-even-calculator',
    name: 'Break Even Calculator',
    slug: 'break-even-calculator',
    category: 'business',
    description: 'Determine the unit volume or revenue necessary to cover all fixed costs to reach absolute profitability.',
    seoTitle: 'Break-Even Point Units & Sales Calculator | Calculatoora',
    seoDescription: 'Identify the break-even points in sales or units. Account for fixed overhead and unit margins easily.',
    inputs: [
      { id: 'fixed', label: 'Fixed Costs (Rent, Salaries)', type: 'number', defaultValue: 10000, step: 500, unit: '$' },
      { id: 'price', label: 'Selling Price per Unit', type: 'number', defaultValue: 80, step: 1, unit: '$' },
      { id: 'variable', label: 'Variable Cost per Unit', type: 'number', defaultValue: 30, step: 1, unit: '$' }
    ],
    formula: 'Break-Even Units = Fixed Costs / (Price - Variable Cost)\nWhere Price - Variable Cost is the unit contribution margin.',
    explanation: 'A business breaks even when its contribution margin pool equals its fixed costs, resulting in a net profit of zero.',
    example: 'With $10,000 in fixed costs, a selling price of $80 per unit, and variable costs of $30 (making $50 margins), you must retail 200 units to break even.',
    faq: [
      { question: 'What is fixed versus variable cost?', answer: 'Fixed costs (rent, insurance, base salaries) stay steady regardless of sales. Variable costs (packaging, shipping, raw materials) scale up with production.' }
    ],
    relatedSlugs: ['profit-margin-calculator-advanced', 'revenue-calculator', 'pricing-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.fixed) || 0;
      const p = Number(inputs.price) || 0;
      const v = Number(inputs.variable) || 0;

      const contribution = Math.max(1, p - v);
      const units = Math.ceil(f / contribution);
      const sales = units * p;

      return {
        results: [
          { label: 'Break-Even Unit Volume', value: units, unit: 'units', isPrimary: true },
          { label: 'Required Break-Even Sales', value: sales.toFixed(2), unit: '$' },
          { label: 'Unit Contribution Margin', value: contribution.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Fixed Overhead', value: f, color: '#ef4444' },
          { name: 'Break-Even Sales Revenue', value: sales, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'revenue-calculator',
    name: 'Revenue Calculator',
    slug: 'revenue-calculator',
    category: 'business',
    description: 'Calculate total gross sales volume and revenues based on quantity metrics and unit prices.',
    seoTitle: 'Gross Sales Revenue Calculator | Calculatoora',
    seoDescription: 'Calculate absolute sales revenues. Estimate gross revenue limits across product price bands.',
    inputs: [
      { id: 'price', label: 'Average Unit price', type: 'number', defaultValue: 120, step: 5, unit: '$' },
      { id: 'quantity', label: 'Quantity Sold', type: 'number', defaultValue: 500, step: 10 }
    ],
    formula: 'Revenue = Price * Quantity',
    explanation: 'Revenue (top-line) is the total money collected from sales before any operations deducations are accounted for.',
    example: 'Selling 500 units of a $120 product generates $60,000.00 gross sales revenue.',
    faq: [
      { question: 'What is top-line vs bottom-line?', answer: 'Top-line refers to gross sales revenue, while bottom-line is net profit after all expenses.' }
    ],
    relatedSlugs: ['gross-profit-calculator', 'cost-calculator', 'break-even-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.price) || 0;
      const q = Number(inputs.quantity) || 0;

      const rev = p * q;

      return {
        results: [
          { label: 'Gross Sales Revenue', value: rev.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Items Sold', value: q, unit: 'units' }
        ],
        chartData: [
          { name: 'Total Revenue Pool', value: rev, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'cost-calculator',
    name: 'Cost Calculator',
    slug: 'cost-calculator',
    category: 'business',
    description: 'Determine total project production costs based on fixed overhead assets and scaling variable unit variables.',
    seoTitle: 'Total Business Production Cost Calculator | Calculatoora',
    seoDescription: 'Analyze fixed and variable corporate expenses. Isolate average manufacturing costs dynamically.',
    inputs: [
      { id: 'fixed', label: 'Annual Fixed Overhead Costs', type: 'number', defaultValue: 20000, step: 1000, unit: '$' },
      { id: 'variable', label: 'Variable Cost per Unit', type: 'number', defaultValue: 15, step: 0.5, unit: '$' },
      { id: 'quantity', label: 'Annual Units Produced', type: 'number', defaultValue: 2500, step: 50 }
    ],
    formula: 'Total Cost = Fixed Cost + (Variable Cost * Quantity)\nAverage Cost = Total Cost / Quantity',
    explanation: 'Monitoring total cost assists corporate managers in scaling production to achieve economies of scale.',
    example: 'With $20,000 fixed costs, producing 2,500 units at $15 variable cost makes a total cost of $57,500.00, averaging $23.00 per unit.',
    faq: [
      { question: 'What is economies of scale?', answer: 'Decreased average units costs achieved when production volumes scale up because fixed costs are spread over a larger number of units.' }
    ],
    relatedSlugs: ['break-even-calculator', 'revenue-calculator', 'net-profit-calculator'],
    calculate: (inputs) => {
      const f = Number(inputs.fixed) || 0;
      const v = Number(inputs.variable) || 0;
      const q = Number(inputs.quantity) || 0;

      const varTotal = v * q;
      const total = f + varTotal;
      const avg = q > 0 ? total / q : 0;

      return {
        results: [
          { label: 'Total Production Cost', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Average Cost per Unit', value: avg.toFixed(2), unit: '$' },
          { label: 'Cumulative Variable Costs', value: varTotal.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Fixed Overhead Costs', value: f, color: '#ef4444' },
          { name: 'Variable Product Costs', value: varTotal, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'pricing-calculator',
    name: 'Pricing Calculator',
    slug: 'pricing-calculator',
    category: 'business',
    description: 'Establish unit retail or service pricing based on raw COGS costs and target profit margins.',
    seoTitle: 'Optimal Product Pricing Calculator | Calculatoora',
    seoDescription: 'Find target prices based on COGS and required margin percentages. Secure profitability safely.',
    inputs: [
      { id: 'cost', label: 'Unit Cost (COGS)', type: 'number', defaultValue: 40, step: 1, unit: '$' },
      { id: 'margin', label: 'Target Profit Margin Name', type: 'number', defaultValue: 30, step: 5, unit: '%' }
    ],
    formula: 'Price = Cost / (1 - Margin / 100)',
    explanation: 'Pricing programs help companies set retail tags that guarantee specific gross margins without pricing their products out of local markets.',
    example: 'A product costing $40.00 requires a $57.14 pricing tag to secure a 30.0% gross profit margin.',
    faq: [
      { question: 'Why does cost / 0.7 not match markup?', answer: 'Multiplying cost by 1.3 yields a markup price of $52, but dividing by 0.7 yields $57.14, representing the difference between margin and markup.' }
    ],
    relatedSlugs: ['profit-margin-calculator-advanced', 'retail-price-calculator', 'discount-calculator'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const margin = Number(inputs.margin) || 0;

      const denominator = 1 - (margin / 100);
      const price = denominator > 0 ? cost / denominator : cost;
      const netProfit = Math.max(0, price - cost);

      return {
        results: [
          { label: 'Optimal Pricing tag', value: price.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Profit Cash earned', value: netProfit.toFixed(2), unit: '$' },
          { label: 'Required Markup Equivalent', value: cost > 0 ? ((netProfit / cost) * 100).toFixed(2) : 0, unit: '%' }
        ],
        chartData: [
          { name: 'Cost Price', value: cost, color: '#312e81' },
          { name: 'Yield Income Margin', value: Math.round(netProfit), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'commission-calculator',
    name: 'Commission Calculator',
    slug: 'commission-calculator',
    category: 'business',
    description: 'Calculate referral commissions, real estate broker fees, or corporate sales bonuses.',
    seoTitle: 'Sales Bonus & Commission Calculator | Calculatoora',
    seoDescription: 'Obtain corporate sales commission payouts based on sales amounts and commission rates.',
    inputs: [
      { id: 'sales', label: 'Gross Sales Deal Value', type: 'number', defaultValue: 80000, step: 1000, unit: '$' },
      { id: 'rate', label: 'Commission Rate Percentage', type: 'number', defaultValue: 5.5, step: 0.1, unit: '%' }
    ],
    formula: 'Commission = Sales * (Rate / 100)',
    explanation: 'Sales commission structures motivate business development teams by directly sharing sales revenues.',
    example: 'Facilitating a $80,000 real estate sale on a 5.5% commission rate earns a $4,400.00 payout.',
    faq: [
      { question: 'What is a tiered commission structural pool?', answer: 'Tiered commissions increase commission percentages as sales volumes hit higher performance benchmarks.' }
    ],
    relatedSlugs: ['hourly-wage-calculator', 'pricing-calculator', 'freelance-rate-calculator'],
    calculate: (inputs) => {
      const sales = Number(inputs.sales) || 0;
      const rate = Number(inputs.rate) || 0;

      const comm = sales * (rate / 100);
      const net = Math.max(0, sales - comm);

      return {
        results: [
          { label: 'Commission Payout Earned', value: comm.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Net Retention Sale Balance', value: net.toFixed(2), unit: '$' },
          { label: 'Absolute Deal Valuation', value: sales.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Company Net Sales Retention', value: net, color: '#39FF14' },
          { name: 'Sales Agent Commission Commission', value: comm, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'discount-calculator-advanced',
    name: 'Discount Calculator',
    slug: 'discount-calculator-advanced',
    category: 'business',
    description: 'Determine sales prices, absolute savings, and sales tax impacts during major retail shopping promotions.',
    seoTitle: 'Retail Sales Price & Discount Calculator | Calculatoora',
    seoDescription: 'Solve sale prices after percentage discounts. Factor sales taxes automatically to predict final checkout costs.',
    inputs: [
      { id: 'original', label: 'Original Retail price', type: 'number', defaultValue: 125, step: 5, unit: '$' },
      { id: 'discount', label: 'Discount Percentage', type: 'number', defaultValue: 25, step: 1, unit: '%' },
      { id: 'tax', label: 'Sales Tax Rate option', type: 'number', defaultValue: 8.0, step: 0.1, unit: '%' }
    ],
    formula: 'Discount Amount = Original Price * (Discount / 100)\nSale Price = Original Price - Discount Amount\nFinal Price = Sale Price * (1 + Tax / 100)',
    explanation: 'Allows retail consumers to quickly estimate pure savings on discounted tags, while tracking the final post-tax out-of-pocket spend.',
    example: 'An $125 coat discounted by 25% costs $93.75 before tax. Adding 8.0% sales tax brings the checkout cost to $101.25, saving you $31.25.',
    faq: [
      { question: 'What is stackable discounting?', answer: 'Stackable discounts apply second-tier percentage reductions (like loyalty program cards) on top of already marked-down prices.' }
    ],
    relatedSlugs: ['sale-price-calculator', 'coupon-savings-calculator', 'price-difference-calculator'],
    calculate: (inputs) => {
      const orig = Number(inputs.original) || 0;
      const disc = Number(inputs.discount) || 0;
      const taxRate = Number(inputs.tax) || 0;

      const discountAmt = orig * (disc / 100);
      const sale = orig - discountAmt;
      const taxAmt = sale * (taxRate / 100);
      const finalPrice = sale + taxAmt;

      return {
        results: [
          { label: 'Final Checkout Cost', value: finalPrice.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Discount Dollars Saved', value: discountAmt.toFixed(2), unit: '$' },
          { label: 'Sale price before Tax', value: sale.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Promo Sale Cost', value: Math.round(sale), color: '#39FF14' },
          { name: 'Discount Saved Dollars', value: Math.round(discountAmt), color: '#3b82f6' },
          { name: 'Assigned Sales Tax', value: Math.round(taxAmt), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'wholesale-price-calculator',
    name: 'Wholesale Price Calculator',
    slug: 'wholesale-price-calculator',
    category: 'business',
    description: 'Calculate wholesale pricing from cost bases to supply other B2B firms or distributors.',
    seoTitle: 'B2B Wholesale Pricing Calculator | Calculatoora',
    seoDescription: 'Determine target wholesale pricing structures from product cost bases. Protect business margins.',
    inputs: [
      { id: 'cost', label: 'Manufacturing Cost Base', type: 'number', defaultValue: 24, step: 1, unit: '$' },
      { id: 'wholesaleMarkup', label: 'Wholesale Profit Markup', type: 'number', defaultValue: 35, step: 5, unit: '%' }
    ],
    formula: 'Wholesale Price = Cost * (1 + Wholesale Markup / 100)',
    explanation: 'Wholesale represents bulk business-to-business (B2B) trade pricing tiers, which are significantly lower than final retail costs.',
    example: 'Manufacturing cost of $24.00 with a 35% wholesale markup yields a B2B wholesale price of $32.40 per item.',
    faq: [
      { question: 'What is wholesale versus retail pricing?', answer: 'Wholesale is bulk pricing for retail traders. Retail (MSRP) is the price charged to endpoints, typically double the wholesale price (keystone pricing).' }
    ],
    relatedSlugs: ['retail-price-calculator', 'pricing-calculator', 'profit-margin-calculator-advanced'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost) || 0;
      const mult = Number(inputs.wholesaleMarkup) || 0;

      const wholesale = cost * (1 + (mult / 100));
      const unitProfit = Math.max(0, wholesale - cost);

      return {
        results: [
          { label: 'Calculated Wholesale Price', value: wholesale.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Wholesale Profit per Unit', value: unitProfit.toFixed(2), unit: '$' },
          { label: 'Effective wholesale Margin', value: wholesale > 0 ? ((unitProfit / wholesale) * 100).toFixed(2) : 0, unit: '%' }
        ],
        chartData: [
          { name: 'Manufacturing Expense Cost', value: cost, color: '#312e81' },
          { name: 'Wholesale Profit Yield', value: Math.round(unitProfit), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'retail-price-calculator',
    name: 'Retail Price Calculator',
    slug: 'retail-price-calculator',
    category: 'business',
    description: 'Calculate recommended retail prices (RRP / MSRP) based on wholesale costs and retail pricing markups.',
    seoTitle: 'Retail MSRP Price & Markup Calculator | Calculatoora',
    seoDescription: 'Generate recommended retail prices based on wholesale inputs. Maintain healthy retail gross margins.',
    inputs: [
      { id: 'wholesale', label: 'Wholesale Cost Price', type: 'number', defaultValue: 32.40, step: 1, unit: '$' },
      { id: 'retailMarkup', label: 'Retail Pricing Markup', type: 'number', defaultValue: 100, step: 10, unit: '%' }
    ],
    formula: 'Retail Price = Wholesale Price * (1 + Retail Markup / 100)',
    explanation: 'Retail pricing represents traditional MSRP tags. Standard keystone retail models mark wholesale prices up by 100% (double the cost).',
    example: 'Buying a wholesale item for $32.40 and marking it up by 100% yields a recommended retail price of $64.80.',
    faq: [
      { question: 'What is MSRP?', answer: 'MSRP represents the Manufacturer is Suggested Retail Price, designed to coordinate prices across third-party retail shops.' }
    ],
    relatedSlugs: ['wholesale-price-calculator', 'pricing-calculator', 'profit-margin-calculator-advanced'],
    calculate: (inputs) => {
      const wholesale = Number(inputs.wholesale) || 0;
      const markup = Number(inputs.retailMarkup) || 0;

      const retail = wholesale * (1 + (markup / 100));
      const profit = Math.max(0, retail - wholesale);

      return {
        results: [
          { label: 'Suggested Retail Price (MSRP)', value: retail.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Retail Gross Profit Margin', value: profit.toFixed(2), unit: '$' },
          { label: 'Retail Profit Margin Rate', value: retail > 0 ? ((profit / retail) * 100).toFixed(2) : 0, unit: '%' }
        ],
        chartData: [
          { name: 'Wholesale Cost Price', value: wholesale, color: '#312e81' },
          { name: 'Retailer Sales Margins', value: Math.round(profit), color: '#39FF14' }
        ]
      };
    }
  }
];
