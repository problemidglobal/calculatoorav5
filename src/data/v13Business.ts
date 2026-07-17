import { Calculator } from '../types';

export const V13_BUSINESS_CALCULATORS: Calculator[] = [
  {
    id: 'gross-margin',
    name: 'Gross Margin Calculator',
    slug: 'gross-margin-calculator',
    category: 'business',
    description: 'Calculate your gross profit and gross margin percentage based on cost of goods sold (COGS) and revenue.',
    seoTitle: 'Gross Margin % and Markup Revenue Calculator',
    seoDescription: 'Input revenue and product cost of goods sold to reveal gross profits, and target gross margin thresholds.',
    inputs: [
      { id: 'revenue', label: 'Gross Revenue / Selling Price ($)', type: 'number', defaultValue: 100 },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 40 }
    ],
    formula: 'Gross Profit = Revenue - COGS\nGross Margin (%) = (Gross Profit / Revenue) * 100\nMarkup (%) = (Gross Profit / COGS) * 100',
    explanation: 'Gross margin measures how efficiently a company generates profit relative to the direct costs of manufacturing or procuring goods.',
    example: 'Selling a product for $100 that costs $40 to buy produces a $60 Gross Profit, representing a 60% Gross Margin and a 150% markup percentage.',
    faq: [
      { question: 'What is the margin vs. markup difference?', answer: 'Margin is profit divided by the sale price, while markup is profit divided by buy cost. Margins can never exceed 100%, but markups can.' }
    ],
    relatedSlugs: ['net-margin-calculator', 'operating-margin-calculator'],
    keywords: ['gross profit margin solver', 'cogs revenue converter', 'retail mark up percentage'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 100);
      const cogs = Number(inputs.cogs || 40);

      const profit = rev - cogs;
      const margin = rev > 0 ? (profit / rev) * 100 : 0;
      const markup = cogs > 0 ? (profit / cogs) * 100 : 0;

      return {
        results: [
          { label: 'Gross Margin Percentage', value: `${margin.toFixed(2)}%`, isPrimary: true },
          { label: 'Gross Profit Earned', value: `$${profit.toFixed(2)}` },
          { label: 'Markup Percentage', value: `${markup.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Cost of Goods (COGS)', value: Math.round(cogs) },
          { name: 'Gross Profit Margin', value: Math.round(profit) }
        ]
      };
    }
  },
  {
    id: 'net-margin',
    name: 'Net Margin Calculator',
    slug: 'net-margin-calculator',
    category: 'business',
    description: 'Determine total net profit margin by incorporating all operating overheads, interests, and tax deductions.',
    seoTitle: 'Net Income Margin & Business Profitability Calculator',
    seoDescription: 'Compare gross revenues vs. aggregated costs to evaluate net company profitability metrics.',
    inputs: [
      { id: 'revenue', label: 'Total Revenue ($)', type: 'number', defaultValue: 500000 },
      { id: 'cogs', label: 'Total COGS ($)', type: 'number', defaultValue: 200000 },
      { id: 'expenses', label: 'Operating Expenses (Overhead) ($)', type: 'number', defaultValue: 150000 },
      { id: 'taxInterest', label: 'Taxes & Interest Surcharges ($)', type: 'number', defaultValue: 30000 }
    ],
    formula: 'Net Income = Revenue - COGS - Expenses - TaxInterest\nNet Margin (%) = (Net Income / Revenue) * 100',
    explanation: 'Net profit percentage shows exactly how much of each dollar earned by the company turns into pure pocketable profit.',
    example: 'A business with $500k revenue, $200k COGS, $150k overhead, and $30k taxes earns a $120k Net profit (24.00% Net Margin).',
    faq: [
      { question: 'What is a typical healthy net margin limit?', answer: 'Industry average net margins hover around 10%. Margins exceeding 20% denote high cash efficiency and low capital constraints.' }
    ],
    relatedSlugs: ['operating-margin-calculator', 'gross-margin-calculator'],
    keywords: ['net profit margin calculator', 'net income yield', 'operating overhead deductions'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 500000);
      const cogs = Number(inputs.cogs || 200000);
      const opex = Number(inputs.expenses || 150000);
      const tax = Number(inputs.taxInterest || 30000);

      const netIncome = rev - cogs - opex - tax;
      const netPct = rev > 0 ? (netIncome / rev) * 100 : 0;

      return {
        results: [
          { label: 'Net Profit Margin Percentage', value: `${netPct.toFixed(2)}%`, isPrimary: true },
          { label: 'Absolute Net Income ($)', value: `$${netIncome.toFixed(2)}` },
          { label: 'Aggregate Overhead Costs', value: `$${(cogs + opex + tax).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Pure Net Income', value: Math.max(0, Math.round(netIncome)) },
          { name: 'Aggregated Overheads', value: Math.round(cogs + opex + tax) }
        ]
      };
    }
  },
  {
    id: 'operating-margin',
    name: 'Operating Margin Calculator',
    slug: 'operating-margin-calculator',
    category: 'business',
    description: 'Calculate operating revenue margins (EBIT margin) to assess core business performance before non-operating items.',
    seoTitle: 'Operating Profit Margin (EBIT) Calculator',
    seoDescription: 'Obtain professional EBIT indicators and evaluate operational cash conversion ratios.',
    inputs: [
      { id: 'revenue', label: 'Core Sales Revenue ($)', type: 'number', defaultValue: 250000 },
      { id: 'cogs', label: 'Direct Product COGS ($)', type: 'number', defaultValue: 90000 },
      { id: 'opex', label: 'Operating Costs (Rent, Salaries, Marketing) ($)', type: 'number', defaultValue: 80000 }
    ],
    formula: 'Operating income (EBIT) = Revenue - COGS - Opex\nOperating Margin (%) = (EBIT / Revenue) * 100',
    explanation: 'Operating margin measures the profitability of core business activities, ignoring financing costs and tax liabilities.',
    example: 'With $250k revenue, $90k COGS, and $80k opex, Operating Income is $80k, or a 32.00% Operating Margin.',
    faq: [
      { question: 'Why ignore taxes in operating margin?', answer: 'Taxes and interest are variable financial items that do not reflect the raw efficiency of the core operational model.' }
    ],
    relatedSlugs: ['net-margin-calculator', 'gross-margin-calculator'],
    keywords: ['ebit operating margin solver', 'pre-tax conversion metrics', 'core utility ratio calculator'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 250000);
      const cogs = Number(inputs.cogs || 90000);
      const opex = Number(inputs.opex || 80000);

      const ebit = rev - cogs - opex;
      const margin = rev > 0 ? (ebit / rev) * 100 : 0;

      return {
        results: [
          { label: 'Operating Margin Pct (EBIT)', value: `${margin.toFixed(2)}%`, isPrimary: true },
          { label: 'EBIT (Operating Income)', value: `$${ebit.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Product/Direct Cost', value: Math.round(cogs) },
          { name: 'Overhead & Op-Ex', value: Math.round(opex) },
          { name: 'Operating Income (EBIT)', value: Math.max(0, Math.round(ebit)) }
        ]
      };
    }
  },
  {
    id: 'ebitda-calculator',
    name: 'EBITDA Calculator',
    slug: 'ebitda-calculator',
    category: 'business',
    description: 'Calculate Earnings Before Interest, Taxes, Depreciation, and Amortization (EBITDA), a key metric for company valuation.',
    seoTitle: 'EBITDA Valuation Metric Calculator',
    seoDescription: 'Find net business EBITDA and convert it to enterprise cash health scores.',
    inputs: [
      { id: 'netIncome', label: 'Net Income / Post-tax profit ($)', type: 'number', defaultValue: 100000 },
      { id: 'interest', label: 'Interest Expenses ($)', type: 'number', defaultValue: 12000 },
      { id: 'taxes', label: 'Tax Liabilities ($)', type: 'number', defaultValue: 25000 },
      { id: 'depr', label: 'Depreciation ($)', type: 'number', defaultValue: 8000 },
      { id: 'amort', label: 'Amortization ($)', type: 'number', defaultValue: 5000 }
    ],
    formula: 'EBITDA = Net Income + Interest + Taxes + Depreciation + Amortization',
    explanation: 'EBITDA acts as a proxy for operational cash flow, allowing analysts to compare companies across different tax and credit regimes.',
    example: 'A company with $100k net income, $12k interest, $25k tax, $8k depreciation, and $5k amortization has $150,000 EBITDA.',
    faq: [
      { question: 'What is depreciation vs. amortization?', answer: 'Depreciation spreads out the cost of tangible physical assets (like machinery) over time, while amortization spreads out intangible assets (like patents).' }
    ],
    relatedSlugs: ['operating-margin-calculator', 'business-profitability-calculator'],
    keywords: ['ebitda cash proxy maker', 'earnings before depreciation tax', 'leverage valuations tracker'],
    calculate: (inputs) => {
      const net = Number(inputs.netIncome || 100000);
      const interest = Number(inputs.interest || 12000);
      const taxes = Number(inputs.taxes || 25000);
      const depr = Number(inputs.depr || 8000);
      const amort = Number(inputs.amort || 5000);

      const ebitda = net + interest + taxes + depr + amort;

      return {
        results: [
          { label: 'EBITDA Result', value: `$${ebitda.toFixed(2)}`, isPrimary: true },
          { label: 'Aggregate Adjustments Added', value: `$${(interest + taxes + depr + amort).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Core Net Income ($)', value: Math.round(net) },
          { name: 'Adjustments Added ($)', value: Math.round(interest + taxes + depr + amort) }
        ]
      };
    }
  },
  {
    id: 'business-profitability',
    name: 'Business Profitability Calculator',
    slug: 'business-profitability-calculator',
    category: 'business',
    description: 'Calculate major business profitability ratios, including Return on Assets (ROA) and Return on Equity (ROE).',
    seoTitle: 'Business Profitability & Allocation Metrics Calculator',
    seoDescription: 'Obtain Return on Equity (ROE), Return on Assets (ROA), and capital efficiency ratings.',
    inputs: [
      { id: 'netProfit', label: 'Annual Net Profits ($)', type: 'number', defaultValue: 80000 },
      { id: 'assets', label: 'Total Business Assets ($)', type: 'number', defaultValue: 400000 },
      { id: 'equity', label: 'Shareholder Equity ($)', type: 'number', defaultValue: 200000 }
    ],
    formula: 'ROA (%) = (Net Profits / Assets) * 100\nROE (%) = (Net Profits / Equity) * 100',
    explanation: 'Assess the efficiency with which a business generates profits compared to its asset-base or equity investments.',
    example: 'Earning $80,000 against $400,000 in assets and $200,000 in equity yields a 20.00% ROA and a 40.00% ROE.',
    faq: [
      { question: 'What is shareholder equity?', answer: 'The net value of a business computed as total assets minus total liabilities, representing the owners interest.' }
    ],
    relatedSlugs: ['net-margin-calculator', 'ebitda-calculator'],
    keywords: ['roa roe efficiency solver', 'capital utilization return', 'corporate profitability ratios'],
    calculate: (inputs) => {
      const profit = Number(inputs.netProfit || 80000);
      const assets = Number(inputs.assets || 400000);
      const equity = Number(inputs.equity || 200000);

      const roa = assets > 0 ? (profit / assets) * 100 : 0;
      const roe = equity > 0 ? (profit / equity) * 100 : 0;

      return {
        results: [
          { label: 'Return on Equity (ROE)', value: `${roe.toFixed(2)}%`, isPrimary: true },
          { label: 'Return on Assets (ROA)', value: `${roa.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Return on Assets %', value: Math.round(roa) },
          { name: 'Return on Equity %', value: Math.round(roe) }
        ]
      };
    }
  },
  {
    id: 'business-growth',
    name: 'Business Growth Rate Calculator',
    slug: 'business-growth-rate-calculator',
    category: 'business',
    description: 'Calculate compounded or linear growth rates over multiple consecutive fiscal cycles.',
    seoTitle: 'Business Growth Rate & CAGR Calculator',
    seoDescription: 'Plot linear period or CAGR growth across consecutive fiscal cycles.',
    inputs: [
      { id: 'startVal', label: 'Prior Year Metric ($ or units)', type: 'number', defaultValue: 120000 },
      { id: 'endVal', label: 'Current Year Metric ($ or units)', type: 'number', defaultValue: 185000 }
    ],
    formula: 'Growth Rate (%) = [(Current - Prior) / Prior] * 100',
    explanation: 'Measure period-over-period expansion to track progress and plan future targets.',
    example: 'Growing annual recurring metrics from $120,000 to $185,000 yields a strong 54.17% growth rate.',
    faq: [
      { question: 'Why trace period growth?', answer: 'It is essential for forecasting hiring plans, budget allocations, and checking business model viability.' }
    ],
    relatedSlugs: ['revenue-growth-calculator', 'sales-growth-calculator'],
    keywords: ['business CAGR tracker', 'annual expansion metric', 'period over period revenue'],
    calculate: (inputs) => {
      const prior = Number(inputs.startVal || 120000);
      const cur = Number(inputs.endVal || 185000);

      const change = cur - prior;
      const rate = prior > 0 ? (change / prior) * 100 : 0;

      return {
        results: [
          { label: 'Absolute Growth Rate', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Absolute Shift Volume', value: change >= 0 ? `+${change.toFixed(0)}` : change.toFixed(0) }
        ],
        chartData: [
          { name: 'Prior Baseline', value: Math.round(prior) },
          { name: 'Current Output', value: Math.round(cur) }
        ]
      };
    }
  },
  {
    id: 'revenue-growth',
    name: 'Revenue Growth Calculator',
    slug: 'revenue-growth-calculator',
    category: 'business',
    description: 'Track year-over-year (YoY) and quarter-over-quarter (QoQ) top-line sales growth progress.',
    seoTitle: 'YoY and QoQ Revenue Growth Curve Calculator',
    seoDescription: 'Compare old vs. new revenues lists to pinpoint precise top-line sales scaling percentages.',
    inputs: [
      { id: 'oldRev', label: 'Previous Period Revenue ($)', type: 'number', defaultValue: 45000 },
      { id: 'newRev', label: 'Current Period Revenue ($)', type: 'number', defaultValue: 62000 }
    ],
    formula: 'Revenue Growth (%) = [(New Revenue - Old Revenue) / Old Revenue] * 100',
    explanation: 'Top-line expansion is a primary driver of startup valuations. Track adjustments to monitor traction.',
    example: 'Increasing quarterly revenue from $45,000 to $62,000 reflects a robust 37.78% growth rate.',
    faq: [
      { question: 'What is top-line growth?', answer: 'Top-line refers strictly to total gross sales or revenues, as opposed to bottle-line net profit.' }
    ],
    relatedSlugs: ['business-growth-rate-calculator', 'sales-growth-calculator'],
    keywords: ['top line scaling calculator', 'yoy revenue growth tool', 'startup sales traction'],
    calculate: (inputs) => {
      const oldVal = Number(inputs.oldRev || 45000);
      const newVal = Number(inputs.newRev || 62000);

      const change = newVal - oldVal;
      const rate = oldVal > 0 ? (change / oldVal) * 100 : 0;

      return {
        results: [
          { label: 'Revenue Growth Percentage', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Absolute Cash Delta', value: `$${change.toFixed(2)}` }
        ],
        chartData: [
          { name: 'Old Cash Basin ($)', value: Math.round(oldVal) },
          { name: 'Revenue Intake ($)', value: Math.round(newVal) }
        ]
      };
    }
  },
  {
    id: 'sales-growth',
    name: 'Sales Growth Calculator',
    slug: 'sales-growth-calculator',
    category: 'business',
    description: 'Calculate unit sales volume growth over specific trade intervals.',
    seoTitle: 'Product Unit Sales Growth Metrics Calculator',
    seoDescription: 'Obtain pure sales volumes adjustments and percentage growth curves.',
    inputs: [
      { id: 'oldUnits', label: 'Previous Period Units Sold', type: 'number', defaultValue: 3500 },
      { id: 'newUnits', label: 'Current Period Units Sold', type: 'number', defaultValue: 4800 }
    ],
    formula: 'Sales Growth (%) = [(New Units - Old Units) / Old Units] * 100',
    explanation: 'Isolate unit velocity changes to understand market demand trends without the distortion of price changes.',
    example: 'Increasing units sold from 3,500 to 4,800 reflects a healthy 37.14% product sales growth rate.',
    faq: [
      { question: 'How can sales growth lead revenue growth?', answer: 'If unit volume growth outpaces revenue growth, it suggests a decline in average selling prices due to promotions or bundling.' }
    ],
    relatedSlugs: ['revenue-growth-calculator', 'business-growth-rate-calculator'],
    keywords: ['unit sale volume growth', 'organic product velocity', 'turnover growth calculator'],
    calculate: (inputs) => {
      const oldUnits = Number(inputs.oldUnits || 3500);
      const newUnits = Number(inputs.newUnits || 4800);

      const change = newUnits - oldUnits;
      const rate = oldUnits > 0 ? (change / oldUnits) * 100 : 0;

      return {
        results: [
          { label: 'Sales Volume Growth Pct', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Ad-hoc Units Growth Delta', value: change.toString() }
        ],
        chartData: [
          { name: 'Prior Unit Sales', value: oldUnits },
          { name: 'Recent Unit Sales', value: newUnits }
        ]
      };
    }
  },
  {
    id: 'customer-retention',
    name: 'Customer Retention Calculator',
    slug: 'customer-retention-calculator',
    category: 'business',
    description: 'Calculate Customer Retention Rate (CRR) to assess customer loyalty and longevity.',
    seoTitle: 'Customer Retention Rate (CRR) Metric Calculator',
    seoDescription: 'Trace client loyalty percentages and evaluate CRM operations.',
    inputs: [
      { id: 'startCustomers', label: 'Customers at Start of Period (S)', type: 'number', defaultValue: 1200 },
      { id: 'endCustomers', label: 'Customers at End of Period (E)', type: 'number', defaultValue: 1350 },
      { id: 'newCustomers', label: 'New Customers Acquired during Period (N)', type: 'number', defaultValue: 300 }
    ],
    formula: 'CRR (%) = [(E - N) / S] * 100',
    explanation: 'CRR measures the percentage of starting customers a business successfully retains over a specific timeframe.',
    example: 'Starting with 1,200 customers, acquiring 300, and ending with 1,350 yields an 87.50% Customer Retention Rate.',
    faq: [
      { question: 'What is a healthy CRR?', answer: 'For standard subscription services, retaining over 85% annually is considered excellent. B2C ratios typically range lower, around 65%.' }
    ],
    relatedSlugs: ['churn-calculator', 'business-growth-rate-calculator'],
    keywords: ['customer retention rate crr', 'customer count loyalty index', 'retention index calculator'],
    calculate: (inputs) => {
      const s = Number(inputs.startCustomers || 1200);
      const e = Number(inputs.endCustomers || 1350);
      const n = Number(inputs.newCustomers || 300);

      const retained = e - n;
      const crr = s > 0 ? (retained / s) * 100 : 0;

      return {
        results: [
          { label: 'Customer Retention Rate (CRR)', value: `${crr.toFixed(2)}%`, isPrimary: true },
          { label: 'Core Retained Customers', value: retained.toString() },
          { label: 'Period Customer Attrition Count', value: Math.max(0, s - retained).toString() }
        ],
        chartData: [
          { name: 'Retained Customers', value: Math.round(retained) },
          { name: 'New Customers Acquired', value: Math.round(n) }
        ]
      };
    }
  },
  {
    id: 'churn',
    name: 'Customer Churn Calculator',
    slug: 'churn-calculator',
    category: 'business',
    description: 'Track aggregate customer churn metrics to identify and address customer leakage.',
    seoTitle: 'Customer Churn Rate & Lifetime Expansion Calculator',
    seoDescription: 'Input starting customer counts and churned accounts to find your exact customer attrition rate.',
    inputs: [
      { id: 'startCust', label: 'Starting Customer Count', type: 'number', defaultValue: 2000 },
      { id: 'churnedCust', label: 'Churned / Leaked Customers', type: 'number', defaultValue: 80 }
    ],
    formula: 'Churn Rate (%) = (Churned Customers / Starting Customers) * 100\nAvg Customer Life = 1 / Churn Rate',
    explanation: 'Track operational customer loss rates over specific monitoring intervals to identify opportunities to improve retention.',
    example: 'Losing 80 customers out of a starting base of 2,000 reflects a 4.00% monthly churn rate, implying an average customer lifespan of 25 months.',
    faq: [
      { question: 'Why does churn compound?', answer: 'A high churn rate requires constant user acquisition just to break even, severely capping potential business growth.' }
    ],
    relatedSlugs: ['customer-retention-calculator', 'business-growth-rate-calculator'],
    keywords: ['churn loss metrics', 'customer leakage tracker', 'membership drop out solver'],
    calculate: (inputs) => {
      const s = Number(inputs.startCust || 2000);
      const c = Number(inputs.churnedCust || 80);

      const rate = s > 0 ? (c / s) * 100 : 0;
      const life = rate > 0 ? 100 / rate : 0;

      return {
        results: [
          { label: 'Period Churn Rate Percentage', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Average Customer Lifespan', value: life > 0 ? `${life.toFixed(1)} Periods` : 'Infinite' }
        ],
        chartData: [
          { name: 'Retained Accounts', value: s - c },
          { name: 'Churned Accounts', value: c }
        ]
      };
    }
  }
];
