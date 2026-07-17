import { Calculator } from '../types';

export const V15_BUSINESS_CALCULATORS: Calculator[] = [
  {
    id: 'v15-business-valuation',
    name: 'Business Valuation Calculator',
    slug: 'v15-business-valuation-calculator',
    category: 'business',
    description: 'Calculate your company’s estimated market value using multiple industry-standard valuation methods.',
    seoTitle: 'Business Valuation Calculator | Multi-Method Business Estimator',
    seoDescription: 'Estime the financial value of your business. Run SDE multiples, EBITDA multipliers, and Discounted Cash Flow models in real-time.',
    inputs: [
      { id: 'ebitda', label: 'Annual EBITDA ($)', type: 'number', defaultValue: 150000 },
      { id: 'multiple', label: 'Industry EBITDA Multiple', type: 'number', defaultValue: 4.5, step: 0.1 },
      { id: 'assets', label: 'Net Business Asset value ($)', type: 'number', defaultValue: 50000 },
      { id: 'annualSde', label: 'Seller’s Discretionary Earnings (SDE) ($)', type: 'number', defaultValue: 120000 },
      { id: 'sdeMultiple', label: 'SDE Multiple', type: 'number', defaultValue: 3.0, step: 0.1 }
    ],
    formula: 'EBITDA Value = EBITDA * EBITDA Multiple\nSDE Value = SDE * SDE Multiple\nNet Asset Valuation = Net Assets\nAverage Valuation = Average of SDE & EBITDA Valuations plus Net Assets.',
    explanation: 'Small and medium businesses are usually valued on a multiple of Seller\'s Discretionary Earnings (SDE) or EBITDA. This tool averages both methods to estimate fair market value.',
    example: 'For a company with $150,000 EBITDA valued at a 4.5x multiple, and $120,000 SDE valued at a 3.0x multiple, the estimated business value average is $517,500.',
    faq: [
      { question: 'What is the main difference between EBITDA and SDE?', answer: 'EBITDA reflects institutional operating profits. SDE (Seller\'s Discretionary Earnings) adds back owner compensation, benefits, and personal expenses to show total owner returns.' },
      { question: 'How do I choose an appropriate industry multiple?', answer: 'Small local storefronts typically trade at 2x to 3x SDE. Tech startups or high-growth healthcare providers can command multiples of 5x to 10x EBITDA or more.' }
    ],
    relatedSlugs: ['v15-company-growth-calculator', 'v15-cash-reserve-calculator'],
    calculate: (inputs) => {
      const ebitda = Number(inputs.ebitda || 0);
      const multi = Number(inputs.multiple || 1);
      const sde = Number(inputs.annualSde || 0);
      const sdeMulti = Number(inputs.sdeMultiple || 1);
      const netAssets = Number(inputs.assets || 0);

      const ebitdaVal = ebitda * multi;
      const sdeVal = sde * sdeMulti;
      const averageVal = (ebitdaVal + sdeVal) / 2 + netAssets;

      return {
        results: [
          { label: 'Estimated Business Value', value: `$${Math.round(averageVal).toLocaleString()}`, isPrimary: true },
          { label: 'EBITDA Multiple Valuation', value: `$${Math.round(ebitdaVal).toLocaleString()}` },
          { label: 'SDE Multiple Valuation', value: `$${Math.round(sdeVal).toLocaleString()}` },
          { label: 'Net Asset Base', value: `$${netAssets.toLocaleString()}` }
        ],
        chartData: [
          { name: 'EBITDA Value', value: ebitdaVal },
          { name: 'SDE Value', value: sdeVal },
          { name: 'Assets', value: netAssets }
        ]
      };
    }
  },
  {
    id: 'v15-company-growth',
    name: 'Company Growth Calculator',
    slug: 'v15-company-growth-calculator',
    category: 'business',
    description: 'Project your company\'s future revenue, expenses, and net margins over a five-year horizon based on annual growth rate targets.',
    seoTitle: 'Yearly Company Growth & Profit Margin Projector',
    seoDescription: 'Model 5-year corporate expansion paths. View forecasted yields and net profit developments relative to operating costs.',
    inputs: [
      { id: 'startRevenue', label: 'Starting Year Revenue ($)', type: 'number', defaultValue: 500000 },
      { id: 'revenueGrowth', label: 'Expected Revenue Growth rate (%)', type: 'number', defaultValue: 12 },
      { id: 'startExpense', label: 'Starting Year Expenses ($)', type: 'number', defaultValue: 350000 },
      { id: 'expenseGrowth', label: 'Expected Expense Growth rate (%)', type: 'number', defaultValue: 6 }
    ],
    formula: 'Future Revenue_t = Revenue_t-1 * (1 + Revenue Growth / 100)\nFuture Expenses_t = Expenses_t-1 * (1 + Expense Growth / 100)',
    explanation: 'Comparing your revenue growth curve against your expense trends shows your operating leverage—how your profitability expands as operations scale.',
    example: 'Growing $500,000 revenue at 12% and $350,000 expenses at 6% results in Year 5 revenue of $786,759 and expenses of $441,747, expanding your annual profit margin from 30% to 43.8%.',
    faq: [
      { question: 'What is operating leverage?', answer: 'Operating leverage is a business metric measuring how much a startup can grow revenue without incurring a proportional increase in operating expenses.' },
      { question: 'Why keep expense growth lower than revenue growth?', answer: 'When expenses grow slower than sales, profit margins expand exponentially, compounding the enterprise value of the company.' }
    ],
    relatedSlugs: ['v15-business-valuation-calculator', 'v15-revenue-target-calculator'],
    calculate: (inputs) => {
      const r0 = Number(inputs.startRevenue || 1);
      const rg = Number(inputs.revenueGrowth || 0) / 100;
      const e0 = Number(inputs.startExpense || 0);
      const eg = Number(inputs.expenseGrowth || 0) / 100;

      // Project up to 5 years
      const revYr5 = r0 * Math.pow(1 + rg, 5);
      const expYr5 = e0 * Math.pow(1 + eg, 5);
      const profitYr5 = Math.max(0, revYr5 - expYr5);
      const marginYr5 = (profitYr5 / revYr5) * 100;

      return {
        results: [
          { label: 'Year 5 Projected Revenue', value: `$${Math.round(revYr5).toLocaleString()}`, isPrimary: true },
          { label: 'Year 5 Projected Expenses', value: `$${Math.round(expYr5).toLocaleString()}` },
          { label: 'Year 5 Net Profit Surplus', value: `$${Math.round(profitYr5).toLocaleString()}` },
          { label: 'Year 5 Net Profit Margin', value: `${marginYr5.toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Start Revenue', value: r0 },
          { name: 'Year 5 Revenue', value: Math.round(revYr5) },
          { name: 'Year 5 Expenses', value: Math.round(expYr5) }
        ]
      };
    }
  },
  {
    id: 'v15-revenue-target',
    name: 'Revenue Target Calculator',
    slug: 'v15-revenue-target-calculator',
    category: 'business',
    description: 'Calculate the total volume of sales or services required to conquer custom monthly net profit milestones.',
    seoTitle: 'Sales Revenue Target & Net Profit Solver',
    seoDescription: 'Find the required revenue to meet your net profit targets. Factor in fixed operational costs and variable margin percentages.',
    inputs: [
      { id: 'netProfitGoal', label: 'Desired Net Profit Target ($)', type: 'number', defaultValue: 20000 },
      { id: 'fixedExpenses', label: 'Monthly Fixed Costs ($)', type: 'number', defaultValue: 15000, helpText: 'Rent, salaries, subscriptions' },
      { id: 'variableMargin', label: 'Product Gross Margin (%)', type: 'number', defaultValue: 65, helpText: 'Revenue minus cost of goods sold' }
    ],
    formula: 'Required Revenue = (Desired profit + Fixed Expenses) / (Gross Margin / 100)',
    explanation: 'Calculating the revenue needed to secure your profit goals ensures your sales pricing models support your real overhead and growth costs.',
    example: 'To yield $20,000 in net profit with $15,000 in monthly fixed costs and a 65% gross product margin, you need to generate exactly $53,846 in raw sales.',
    faq: [
      { question: 'What counts as a fixed cost?', answer: 'Costs that do not fluctuate with sales volume, such as office leases, full-time staff salaries, and software software accounts.' },
      { question: 'How is variable margin percentage computed?', answer: 'Variable margin represents your product markup: (Retail Price - Cost of Goods Sold) / Retail Price.' }
    ],
    relatedSlugs: ['v15-sales-forecast-calculator', 'v15-profit-margin-analysis-calculator'],
    calculate: (inputs) => {
      const target = Number(inputs.netProfitGoal || 0);
      const fixed = Number(inputs.fixedExpenses || 0);
      const margin = Number(inputs.variableMargin || 1) / 100;

      const requiredSales = margin > 0 ? (target + fixed) / margin : 0;

      return {
        results: [
          { label: 'Required Monthly Revenue', value: `$${Math.round(requiredSales).toLocaleString()}`, isPrimary: true },
          { label: 'Total Sales Costs (COGS)', value: `$${Math.round(requiredSales * (1 - margin)).toLocaleString()}` },
          { label: 'Fixed Costs Portion', value: `$${fixed.toLocaleString()}` },
          { label: 'Break-Even Sales Revenue', value: `$${Math.round(fixed / margin).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Target Revenue', value: Math.round(requiredSales) },
          { name: 'Cost of Goods', value: Math.round(requiredSales * (1 - margin)) },
          { name: 'Fixed Overhead', value: fixed }
        ]
      };
    }
  },
  {
    id: 'v15-sales-forecast',
    name: 'Sales Forecast Calculator',
    slug: 'v15-sales-forecast-calculator',
    category: 'business',
    description: 'Predict next year’s monthly corporate sales outcomes based on customer pipeline acquisition trends.',
    seoTitle: 'Corporate Sales & Leads Funnel Forecasting Calculator',
    seoDescription: 'Obtain digital sales forecasts. Enter starting deals, lead conversion metrics, and contract values to see expected income pipelines.',
    inputs: [
      { id: 'monthlyLeads', label: 'Monthly Leads Generated', type: 'number', defaultValue: 1000 },
      { id: 'conversionRate', label: 'Lead-to-Customer conversion Rate (%)', type: 'number', defaultValue: 2.5, step: 0.1 },
      { id: 'avgDealValue', label: 'Average Contract / Deal Value ($)', type: 'number', defaultValue: 350 },
      { id: 'churnRate', label: 'Monthly Customer Churn Rate (%)', type: 'number', defaultValue: 1.5, step: 0.1 }
    ],
    formula: 'New Monthly Revenue = Leads * (Conversion Rate / 100) * Deal Value\nAdjusted projections factor in compounding churn on the active base.',
    explanation: 'Sales forecasting helps you manage inventory, plan hiring schedules, and secure capital buffers based on predictable lead trends.',
    example: 'Generating 1,000 monthly leads with a 2.5% conversion rate and a $350 average contract value yields exactly $8,750 in new monthly deal revenue.',
    faq: [
      { question: 'What does customer churn rate measure?', answer: 'The percentage of recurring customers who cancel subscriptions or stop purchasing within a given monthly timeframe.' },
      { question: 'How do I boost my conversion metrics?', answer: 'Optimize your sales script messaging, reduce page loading speeds on checkout pathways, and provide clear product demonstrations.' }
    ],
    relatedSlugs: ['v15-revenue-target-calculator', 'v15-profit-margin-analysis-calculator'],
    calculate: (inputs) => {
      const leads = Number(inputs.monthlyLeads || 0);
      const conv = Number(inputs.conversionRate || 0) / 100;
      const deal = Number(inputs.avgDealValue || 0);
      const churn = Number(inputs.churnRate || 0) / 100;

      const newCustomers = leads * conv;
      const initialVol = newCustomers * deal;

      // Project compound revenue trajectory over 12 months with churn subtraction
      let activeM = initialVol;
      let compoundedYearRev = 0;
      for (let m = 1; m <= 12; m++) {
        compoundedYearRev += activeM;
        activeM = (activeM + initialVol) * (1 - churn);
      }

      return {
        results: [
          { label: 'Initial New Monthly Revenue', value: `$${initialVol.toLocaleString()}`, isPrimary: true },
          { label: 'New Monthly Customer Count', value: `${newCustomers.toFixed(1)} accounts` },
          { label: 'Projected 12-Month Total Revenue', value: `$${Math.round(compoundedYearRev).toLocaleString()}` },
          { label: 'Annual Churn Drag Impact', value: `$${Math.round((initialVol * 12) - compoundedYearRev).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Initial Month', value: Math.round(initialVol) },
          { name: 'Compounded Year', value: Math.round(compoundedYearRev) }
        ]
      };
    }
  },
  {
    id: 'v15-profit-margin-analysis',
    name: 'Profit Margin Analysis Calculator',
    slug: 'v15-profit-margin-analysis-calculator',
    category: 'business',
    description: 'Analyze the health of your retail business by tracking gross, operating, and net margins side by side.',
    seoTitle: 'Profit Margin Analyzer & Cost Structure Solver',
    seoDescription: 'Obtain deep product analyses. Input production variables, logistics costs, and taxes to see your true net profitability.',
    inputs: [
      { id: 'totalSales', label: 'Overall Sales Revenue ($)', type: 'number', defaultValue: 100000 },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 40000 },
      { id: 'operatingExpenses', label: 'Operating Costs (OPEX) ($)', type: 'number', defaultValue: 30000 },
      { id: 'taxesAndInterest', label: 'Taxes & Loan Interest ($)', type: 'number', defaultValue: 10000 }
    ],
    formula: 'Gross Margin = (Sales - COGS) / Sales * 100\nOperating Margin = (Sales - COGS - OPEX) / Sales * 100\nNet Margin = (Sales - COGS - OPEX - Taxes & Interest) / Sales * 100',
    explanation: 'A healthy business keeps healthy margins across all three tiers, ensuring operational costs and tax liabilities don\'t erase product profitability.',
    example: 'For $100,000 in sales with $40,000 COGS, $30,000 OPEX, and $10,000 in taxes, your Gross Margin is 60%, your Operating Margin is 30%, and your Net Margin is 10%.',
    faq: [
      { question: 'Why does Net Margin matter more than Gross Margin?', answer: 'Gross Margin only tracks direct product costs. Net Margin is the final metric that accounts for all operating, tax, and interest expenses, showing actual business profitability.' },
      { question: 'What is a typical healthy net margin?', answer: 'Healthy net margins vary widely by industry. Consulting businesses frequently run at 30% to 50%, while grocery chains and retail outlets operate on thin margins of 2% to 10%.' }
    ],
    relatedSlugs: ['v15-revenue-target-calculator', 'v15-business-budget-planner-calculator'],
    calculate: (inputs) => {
      const s = Number(inputs.totalSales || 1);
      const c = Number(inputs.cogs || 0);
      const o = Number(inputs.operatingExpenses || 0);
      const t = Number(inputs.taxesAndInterest || 0);

      const gross = Math.max(0, s - c);
      const operating = Math.max(0, gross - o);
      const net = Math.max(0, operating - t);

      const grossPct = (gross / s) * 100;
      const operatingPct = (operating / s) * 100;
      const netPct = (net / s) * 100;

      return {
        results: [
          { label: 'Net Profit Margin Ratio', value: `${netPct.toFixed(1)}%`, isPrimary: true },
          { label: 'Gross Product Margin Ratio', value: `${grossPct.toFixed(1)}%` },
          { label: 'Operating Margin Ratio', value: `${operatingPct.toFixed(1)}%` },
          { label: 'Net Profit ($)', value: `$${net.toLocaleString()}` }
        ],
        chartData: [
          { name: 'COGS cost', value: c },
          { name: 'OPEX cost', value: o },
          { name: 'Taxes-Interest', value: t },
          { name: 'Net Cash Left', value: net }
        ]
      };
    }
  },
  {
    id: 'v15-expense-forecast',
    name: 'Expense Forecast Calculator',
    slug: 'v15-expense-forecast-calculator',
    category: 'business',
    description: 'Map out and project company operational and capital expenses over upcoming years to ensure cost control.',
    seoTitle: 'Corporate Expense & OPEX Forecasting Screen',
    seoDescription: 'Forecast future business expenses. Factor in compound annual inflation across rent, salaries, and marketing pipelines.',
    inputs: [
      { id: 'rentUtilities', label: 'Monthly Rent & Utilities ($)', type: 'number', defaultValue: 4000 },
      { id: 'wagesSalaries', label: 'Monthly Employee Salaries ($)', type: 'number', defaultValue: 15000 },
      { id: 'marketingCosts', label: 'Monthly Marketing Budget ($)', type: 'number', defaultValue: 3000 },
      { id: 'averageInflation', label: 'Estimated Annual Cost Increase (%)', type: 'number', defaultValue: 4.5 }
    ],
    formula: 'Future Monthly Expense = Base Expense * (1 + Inflation / 100) ^ Year',
    explanation: 'Forecasting your business expenses helps you find opportunities to optimize operational efficiency and prevent unexpected cash shortages.',
    example: 'A business with $22,000 in monthly expenses, with costs rising at 4.5% annually, will face a monthly overhead of $27,416 by Year 5.',
    faq: [
      { question: 'Why plan for compound annual cost increases?', answer: 'Inflation silently drives up business overhead over time, raising prices on everything from supplier materials to office utilities.' },
      { question: 'What is the best way to control rising operational expenses?', answer: 'Review your recurring service contracts annually, leverage volume discounts, and automate manual administrative tasks.' }
    ],
    relatedSlugs: ['v15-cash-reserve-calculator', 'v15-business-budget-planner-calculator'],
    calculate: (inputs) => {
      const rent = Number(inputs.rentUtilities || 0);
      const wages = Number(inputs.wagesSalaries || 0);
      const mkt = Number(inputs.marketingCosts || 0);
      const inf = Number(inputs.averageInflation || 0) / 100;

      const baseMonthly = rent + wages + mkt;
      const yr5Monthly = baseMonthly * Math.pow(1 + inf, 5);

      return {
        results: [
          { label: 'Current Total Monthly Expense', value: `$${baseMonthly.toLocaleString()}`, isPrimary: true },
          { label: 'Year 5 Projected Monthly Expense', value: `$${Math.round(yr5Monthly).toLocaleString()}` },
          { label: 'Estimated 5-Year Expense Growth', value: `$${Math.round(yr5Monthly - baseMonthly).toLocaleString()}` },
          { label: 'Total Annual Outflow (Year 1)', value: `$${(baseMonthly * 12).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Rent', value: rent },
          { name: 'Wages', value: wages },
          { name: 'Marketing', value: mkt },
          { name: 'Inflation delta', value: Math.round(yr5Monthly - baseMonthly) }
        ]
      };
    }
  },
  {
    id: 'v15-business-budget-planner',
    name: 'Business Budget Planner',
    slug: 'v15-business-budget-planner-calculator',
    category: 'business',
    description: 'Plan your startup company\'s funding allocations across core operational channels to ensure profit margins are met.',
    seoTitle: 'Startup Business Budget Planner & Outlay Solver',
    seoDescription: 'Organize operating and capital expenses for your business. Budget for salaries, inventory, rents, and marketing to protect cash flow.',
    inputs: [
      { id: 'monthlyAvailable', label: 'Monthly Working Capital ($)', type: 'number', defaultValue: 30000 },
      { id: 'salaryPct', label: 'Salaries & Wages Budget (%)', type: 'number', defaultValue: 40 },
      { id: 'inventoryPct', label: 'Inventory & Materials Budget (%)', type: 'number', defaultValue: 25 },
      { id: 'marketingPct', label: 'Marketing & Acquisition Budget (%)', type: 'number', defaultValue: 15 },
      { id: 'reservePct', label: 'Cash Reserve Allocation (%)', type: 'number', defaultValue: 10 }
    ],
    formula: 'Channel Allocation = Monthly Capital * (Channel Percentage / 100)',
    explanation: 'Structuring budgets ensures standard organizational margins remain healthy, helping to avoid over-allocating funds to minor departments.',
    example: 'With $30,000 in monthly capital, dedicating 40% to salaries allocates $12,000, 25% to inventory allocates $7,500, 15% to marketing allocates $4,500, and 10% to reserves allocates $3,000.',
    faq: [
      { question: 'What is a typical healthy reserve target?', answer: 'Most business advisors recommend dedicating 10% of monthly capital directly into cash reserves to withstand sudden market shifts.' },
      { question: 'Why does budgeting require regular reviews?', answer: 'Real-world business conditions change constantly, meaning your budget allocation weights need regular adjustments to match your current operational goals.' }
    ],
    relatedSlugs: ['v15-cash-reserve-calculator', 'v15-profit-margin-analysis-calculator'],
    calculate: (inputs) => {
      const total = Number(inputs.monthlyAvailable || 0);
      const sal = Number(inputs.salaryPct || 0) / 100;
      const inv = Number(inputs.inventoryPct || 0) / 100;
      const mkt = Number(inputs.marketingPct || 0) / 100;
      const res = Number(inputs.reservePct || 0) / 100;

      const salVal = total * sal;
      const invVal = total * inv;
      const mktVal = total * mkt;
      const resVal = total * res;

      const remainder = Math.max(0, total - (salVal + invVal + mktVal + resVal));

      return {
        results: [
          { label: 'Salaries Budget Allocation', value: `$${salVal.toLocaleString()}`, isPrimary: true },
          { label: 'Inventory & Materials Allocation', value: `$${invVal.toLocaleString()}` },
          { label: 'Marketing Allocation', value: `$${mktVal.toLocaleString()}` },
          { label: 'Safety Cash Reserves Entry', value: `$${resVal.toLocaleString()}` },
          { label: 'Unallocated Capital Margin', value: `$${remainder.toLocaleString()}` }
        ],
        chartData: [
          { name: 'Salaries', value: salVal },
          { name: 'Inventory', value: invVal },
          { name: 'Marketing', value: mktVal },
          { name: 'Reserves', value: resVal },
          { name: 'Other Buffer', value: remainder }
        ]
      };
    }
  },
  {
    id: 'v15-cash-reserve',
    name: 'Cash Reserve Calculator',
    slug: 'v15-cash-reserve-calculator',
    category: 'business',
    description: 'Calculate how many months of operational runway your current cash reserves provide based on monthly burn rate.',
    seoTitle: 'Business Cash Reserve Runway & Burn Rate Calculator',
    seoDescription: 'Determine your company’s financial runway in months. Track cash reserves against variable monthly burn rates.',
    inputs: [
      { id: 'currentCash', label: 'Current Bank Cash Reserves ($)', type: 'number', defaultValue: 120000 },
      { id: 'monthlyExpenses', label: 'Average Monthly Operating Cost ($)', type: 'number', defaultValue: 25000 },
      { id: 'monthlyRevenue', label: 'Average Monthly Sales Revenue ($)', type: 'number', defaultValue: 10000 }
    ],
    formula: 'Net Monthly Burn = Operating Cost - Sales Revenue\nRunway (Months) = Current Cash / Net Monthly Burn',
    explanation: 'Understanding your cash runway is the foundation of small business risk management, letting you know how long you can operate before needing additional funding.',
    example: 'With $120,000 in cash, $25,000 in monthly costs, and $10,000 in sales, your net monthly burn is $15,000, giving you an operational runway of exactly 8.0 months.',
    faq: [
      { question: 'What is net burn vs gross burn?', answer: 'Gross burn is your total cash spending per month. Net burn is your gross burn minus passenger sales revenue, showing actual cash loss.' },
      { question: 'What is a healthy runway length?', answer: 'Pre-revenue startups generally require a cash reserve runway of 12 to 18 months, while mature cash-flowing businesses can safely operate on a 3 to 6 month runway.' }
    ],
    relatedSlugs: ['v15-business-budget-planner-calculator', 'v15-expense-forecast-calculator'],
    calculate: (inputs) => {
      const cash = Number(inputs.currentCash || 0);
      const expenses = Number(inputs.monthlyExpenses || 0);
      const sales = Number(inputs.monthlyRevenue || 0);

      const netBurn = Math.max(0, expenses - sales);
      const runway = netBurn > 0 ? cash / netBurn : Infinity;

      return {
        results: [
          { label: 'Cash Reserves Runway', value: runway === Infinity ? 'Infinite Runway (Profitable)' : `${runway.toFixed(1)} Months`, isPrimary: true },
          { label: 'Net Monthly Burn Rate', value: `$${netBurn.toLocaleString()}` },
          { label: 'Gross Monthly Burn Rate', value: `$${expenses.toLocaleString()}` }
        ],
        chartData: [
          { name: 'Current Cash', value: cash },
          { name: 'Net Burn Offset', value: netBurn }
        ]
      };
    }
  }
];
