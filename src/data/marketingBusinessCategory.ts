import { Calculator } from '../types';

export const MARKETING_BUSINESS_CALCULATORS: Calculator[] = [
  {
    id: 'mkt-ctr',
    name: 'CTR (Click-Through Rate) Calculator',
    slug: 'ctr-calc',
    category: 'marketing',
    description: 'Calculate campaign Click-Through Rate (CTR) to evaluate digital ad performance.',
    seoTitle: 'CTR (Click-Through Rate) Calculator | Calculatoora',
    seoDescription: 'Calculate CTR percentages from digital clicks and overall impressions to optimize marketing budgets.',
    inputs: [
      { id: 'clicks', label: 'Total Clicks Received', type: 'number', defaultValue: 450 },
      { id: 'impressions', label: 'Core Ad Impressions', type: 'number', defaultValue: 15400 }
    ],
    formula: 'CTR (%) = (Clicks / Impressions) * 100',
    explanation: 'CTR (Click-Through Rate) is the percentage of users who clicked on an ad after seeing it. Higher CTRs point to relevant, high-performing creative targeting.',
    example: 'An ad delivering 450 clicks from 15,400 user impressions registers a 2.92% CTR.',
    faq: [
      { question: 'What is a strong Click-Through Rate?', answer: 'For standard search ads, 2% to 5% is average. Display ads often register lower CTR ranges averaging 0.5%.' }
    ],
    relatedSlugs: ['cpc-calc', 'conversion-rate', 'marketing-cpm'],
    calculate: (inputs) => {
      const clicks = Number(inputs.clicks || 450);
      const imps = Number(inputs.impressions || 15400);

      const ctr = imps > 0 ? (clicks / imps) * 100 : 0;

      return {
        results: [
          { label: 'Calculated CTR', value: `${ctr.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Clicks counted', value: clicks.toLocaleString() },
          { label: 'Imps volume', value: imps.toLocaleString() }
        ],
        chartData: [
          { name: 'Clicks', value: clicks, color: '#39FF14' },
          { name: 'Unclicked Views', value: Math.max(0, imps - clicks), color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'mkt-cpc',
    name: 'CPC (Cost Per Click) Calculator',
    slug: 'cpc-calc',
    category: 'marketing',
    description: 'Calculate average Cost Per Click (CPC) based on ad spend and click results.',
    seoTitle: 'Ad Cost Per Click CPC Calculator | Calculatoora',
    seoDescription: 'Plan your budget and cost per click based on total spend and overall clicks.',
    inputs: [
      { id: 'spend', label: 'Overall Ad Campaign Spend ($)', type: 'number', defaultValue: 1200 },
      { id: 'clicks', label: 'Clicks volume achieved', type: 'number', defaultValue: 820 }
    ],
    formula: 'CPC = Total Spend / Clicks',
    explanation: 'CPC measures the average cost of driving a single visitor click. Minimizing CPC while maintaining traffic quality stretches campaign budgets further.',
    example: 'Spending $1,200 to acquire 820 clicks equates to a $1.46 Cost Per Click.',
    faq: [
      { question: 'What factors influence CPC parameters?', answer: 'Keyword competition (bidding wars), Quality Score, ad relevance, and audience targeting parameters directly impact CPC pricing.' }
    ],
    relatedSlugs: ['ctr-calc', 'cpa-calc'],
    calculate: (inputs) => {
      const spend = Number(inputs.spend || 1200);
      const clicks = Number(inputs.clicks || 820);

      const cpc = clicks > 0 ? spend / clicks : 0;

      return {
        results: [
          { label: 'Calculated CPC cost', value: `$${cpc.toFixed(2)}`, isPrimary: true },
          { label: 'Purchased volume clicks', value: clicks }
        ]
      };
    }
  },
  {
    id: 'mkt-cpa',
    name: 'CPA (Cost Per Acquisition) Calculator',
    slug: 'cpa-calc',
    category: 'marketing',
    description: 'Calculate cost per acquisition (CPA) to evaluate campaign conversion costs.',
    seoTitle: 'CPA Cost Per Acquisition Tool | Calculatoora',
    seoDescription: 'Evaluate campaign Cost Per Acquisition (CPA) from overall marketing spend and total conversions.',
    inputs: [
      { id: 'overallSpend', label: 'Total Marketing Spend ($)', type: 'number', defaultValue: 5000 },
      { id: 'conversions', label: 'Conversions acquired (sales/leads)', type: 'number', defaultValue: 125 }
    ],
    formula: 'CPA = Total Spend / Conversions',
    explanation: 'CPA (Cost Per Acquisition) is the cost of driving a single desired action (e.g. sale or signup). To generate profit, CPA must remain lower than customer lifetime value.',
    example: 'An ad spend of $5,000 driving 125 confirmed conversions results in a $40 CPA.',
    faq: [
      { question: 'How is CPA different from CAC?', answer: 'CPA measures the cost of a single campaign action. CAC is a holistic company metric measuring all design, sales, and marketing costs to acquire one customer.' }
    ],
    relatedSlugs: ['cpc-calc', 'cac-calc', 'roas-calc'],
    calculate: (inputs) => {
      const spend = Number(inputs.overallSpend || 5000);
      const convs = Number(inputs.conversions || 125);

      const cpa = convs > 0 ? (spend / convs) : 0;

      return {
        results: [
          { label: 'Calculated CPA cost', value: `$${cpa.toFixed(2)}`, isPrimary: true },
          { label: 'Conversions recorded', value: convs }
        ]
      };
    }
  },
  {
    id: 'mkt-cpm',
    name: 'Ad CPM Cost Calculator',
    slug: 'marketing-cpm',
    category: 'marketing',
    description: 'Calculate Cost Per Mille (CPM) to compare ad delivery costs across diverse media networks.',
    seoTitle: 'Ad Cost Per Mille CPM Calculator | Calculatoora',
    seoDescription: 'Obtain promotional CPM costs based on target marketing budgets and aggregate impressions.',
    inputs: [
      { id: 'cost', label: 'Total Ad spend cost ($)', type: 'number', defaultValue: 600 },
      { id: 'imps', label: 'Impressions views delivered', type: 'number', defaultValue: 75000 }
    ],
    formula: 'CPM = (Total Cost / Impressions) * 1000',
    explanation: 'CPM (Cost Per Mille) represents the cost of delivering 1,000 ad impressions. Brands use CPM to compare cost efficiency across different publishers and ad formats.',
    example: 'Spending $600 to deliver 75,000 ad impressions equates to an $8.00 CPM.',
    faq: [
      { question: 'What does "Mille" stand for?', answer: '"Mille" is the Latin word for thousand, making CPM the cost to acquire 1,000 ad views.' }
    ],
    relatedSlugs: ['ctr-calc', 'cpc-calc'],
    calculate: (inputs) => {
      const cost = Number(inputs.cost || 600);
      const imps = Number(inputs.imps || 75000);

      const cpm = imps > 0 ? (cost / imps) * 1000 : 0;

      return {
        results: [
          { label: 'Calculated CPM cost', value: `$${cpm.toFixed(2)}`, isPrimary: true },
          { label: 'Impressions counts', value: imps.toLocaleString() }
        ]
      };
    }
  },
  {
    id: 'mkt-conversion-rate',
    name: 'Conversion Rate Calculator',
    slug: 'conversion-rate',
    category: 'marketing',
    description: 'Calculate website conversion rate percentages based on visitor traffic and actions.',
    seoTitle: 'Conversion Rate percentage Solver | Calculatoora',
    seoDescription: 'Measure your landing page conversion rate percentage based on visits and total sales.',
    inputs: [
      { id: 'visitors', label: 'Total Unique Visitors', type: 'number', defaultValue: 10000 },
      { id: 'conversions', label: 'Conversions Count', type: 'number', defaultValue: 320 }
    ],
    formula: 'Conversion Rate (%) = (Conversions / Visitors) * 100',
    explanation: 'The conversion rate measures the percentage of visitors who complete a desired action, serving as a primary indicator of website usability and offer relevance.',
    example: 'A landing page converting 320 out of 10,000 visitors registers a 3.20% conversion rate.',
    faq: [
      { question: 'What is a strong landing page conversion rate?', answer: 'For standard retail sites, 2% is average. High-performing optimized landing pages can exceed 5% to 8% conversion rates.' }
    ],
    relatedSlugs: ['ctr-calc', 'lead-conversion'],
    calculate: (inputs) => {
      const visitors = Number(inputs.visitors || 10000);
      const convs = Number(inputs.conversions || 320);

      const rate = visitors > 0 ? (convs / visitors) * 100 : 0;

      return {
        results: [
          { label: 'Conversion Rate', value: `${rate.toFixed(2)}%`, isPrimary: true },
          { label: 'Unique Visitors tracked', value: visitors.toLocaleString() },
          { label: 'Conversions recorded', value: convs.toLocaleString() }
        ],
        chartData: [
          { name: 'Converted Visitors', value: convs, color: '#39FF14' },
          { name: 'Bounced/Noncompiled', value: Math.max(0, visitors - convs), color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'mkt-roas',
    name: 'ROAS (Return on Ad Spend) Calculator',
    slug: 'roas-calc',
    category: 'marketing',
    description: 'Calculate ROAS to measure revenue generated per dollar spent on digital ads.',
    seoTitle: 'ROAS (Return on Ad Spend) Calculator | Calculatoora',
    seoDescription: 'Measure return on digital advertising spend (ROAS) to evaluate campaign profitability.',
    inputs: [
      { id: 'revenue', label: 'Revenue earned from Ads ($)', type: 'number', defaultValue: 15100 },
      { id: 'adSpend', label: 'Overall Ad spend budget ($)', type: 'number', defaultValue: 3500 }
    ],
    formula: 'ROAS = Revenue / AdSpend',
    explanation: 'ROAS (Return on Ad Spend) measures the direct revenue returned for every advertising dollar spent. This key metric helps advertisers assess the financial performance of active campaigns.',
    example: 'Generating $15,100 from a $3,500 ad campaign spend results in a 4.31x ROAS (or $4.31 earned per $1 spent).',
    faq: [
      { question: 'What is a healthy target ROAS?', answer: 'While a 4:1 (400%) ROAS is standard, optimal benchmarks vary based on product margins and operational overhead.' }
    ],
    relatedSlugs: ['marketing-roi', 'cpa-calc'],
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 15100);
      const spend = Number(inputs.adSpend || 3500);

      const roas = spend > 0 ? (rev / spend) : 0;

      return {
        results: [
          { label: 'Calculated ROAS', value: `${roas.toFixed(2)}x`, isPrimary: true },
          { label: 'ROAS Percentage Equivelant', value: `${(roas * 100).toFixed(0)}%` },
          { label: 'Net Profit margin from Ads', value: `$${(rev - spend).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Ad Spend Cost', value: spend, color: '#f43f5e' },
          { name: 'Net Profit Return', value: Math.max(0, rev - spend), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'mkt-marketing-roi',
    name: 'Marketing ROI Calculator',
    slug: 'marketing-roi',
    category: 'marketing',
    description: 'Calculate absolute Return on Investment (ROI) across marketing channels, accounting for goods and operational overhead costs.',
    seoTitle: 'Marketing Return on Investment ROI Solver | Calculatoora',
    seoDescription: 'Input sales revenue, marketing investment, and baseline product costs to calculate net marketing ROI.',
    inputs: [
      { id: 'grossRevenue', label: 'Total Campaign Sales ($)', type: 'number', defaultValue: 25000 },
      { id: 'mktSpend', label: 'Combined Marketing Spend ($)', type: 'number', defaultValue: 6000 },
      { id: 'cogs', label: 'Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 8000 }
    ],
    formula: 'ROI (%) = ((GrossRevenue - MarketingSpend - COGS) / CombinedInvestment) * 100',
    explanation: 'Marketing ROI measures the net financial return on promotional spend, helping teams allocate budget to the most profitable channels.',
    example: 'Generating $25,000 in sales with $8,000 in product costs and $6,000 in marketing invest results in a 183.33% net Return on Investment.',
    faq: [
      { question: 'Why factor in COGS?', answer: 'Excluding product costs (COGS) can make campaigns appear highly profitable when they actually generate a net loss.' }
    ],
    relatedSlugs: ['roas-calc', 'cac-calc'],
    calculate: (inputs) => {
      const rev = Number(inputs.grossRevenue || 25000);
      const spend = Number(inputs.mktSpend || 6000);
      const cogs = Number(inputs.cogs || 8000);

      const netProfit = rev - spend - cogs;
      const roi = spend > 0 ? (netProfit / spend) * 100 : 0;

      return {
        results: [
          { label: 'Net Marketing ROI', value: `${roi.toFixed(1)}%`, isPrimary: true },
          { label: 'Net Campaign Profit', value: `$${netProfit.toLocaleString()}` },
          { label: 'Combined Expenses', value: `$${(spend + cogs).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'mkt-lead-conversion',
    name: 'Lead Conversion Value Calculator',
    slug: 'lead-conversion',
    category: 'marketing',
    description: 'Calculate average lead conversion value based on sales close rates and transaction sizes.',
    seoTitle: 'Lead Acquisition Value Estimator | Calculatoora',
    seoDescription: 'Analyze worth calculations of single leads based on contract close rates and transaction sizes.',
    inputs: [
      { id: 'avgDealValue', label: 'Average Contract Deal Value ($)', type: 'number', defaultValue: 5000 },
      { id: 'closeRate', label: 'Sales Close Rate Percentage (%)', type: 'number', defaultValue: 12 }
    ],
    formula: 'Lead Value = DealValue * (CloseRate / 100)',
    explanation: 'Lead value quantifies the individual worth of a newly acquired prospect contact, helping teams set budget caps for lead generation campaigns.',
    example: 'An sales team closing 12% of leads on contracts valued at $5,000 averages a $600 value per lead.',
    faq: [
      { question: 'How is lead value used in Google Ads?', answer: 'Setting realistic lead values allows algorithms for automated bidding to optimize ad spend for maximum conversion value.' }
    ],
    relatedSlugs: ['conversion-rate', 'cpa-calc'],
    calculate: (inputs) => {
      const deal = Number(inputs.avgDealValue || 5000);
      const rate = Number(inputs.closeRate || 12);

      const val = deal * (rate / 100);

      return {
        results: [
          { label: 'Calculated Individual Lead Value', value: `$${val.toFixed(2)}`, isPrimary: true },
          { label: 'Proportion of Leads required per Deal closed', value: `${Math.ceil(100 / rate)} leads` }
        ]
      };
    }
  },
  {
    id: 'bus-startup-runway',
    name: 'Startup Runway & Grace Calculator',
    slug: 'startup-runway',
    category: 'marketing',
    description: 'Calculate startup runway lengths based on cash reserves and monthly net burn rates.',
    seoTitle: 'Startup runway & Cash Forecast Solver | Calculatoora',
    seoDescription: 'Obtain runway estimates for startups, visualizing cash outflows to avoid capital shortfalls.',
    inputs: [
      { id: 'bankCash', label: 'Available Cash Reserves ($)', type: 'number', defaultValue: 250000 },
      { id: 'revenue', label: 'Average Monthly Revenue ($)', type: 'number', defaultValue: 15000 },
      { id: 'outflow', label: 'Monthly Operational Outflows ($)', type: 'number', defaultValue: 40000 }
    ],
    formula: 'Net Burn = Outflow - Revenue; Runway (Months) = CashReserves / NetBurn',
    explanation: 'Startup Runway measures the months a company can operate before running out of cash, which is a critical metric for planning fundraising cycles.',
    example: 'A startup with $250,000 in cash, $40,000 in outflows, and $15,000 in revenue has a net burn of $25,000, yielding a 10-month runway.',
    faq: [
      { question: 'How do you increase startup Runway?', answer: 'By reducing fixed overhead (burn rate), growing recurring revenues, or securing external equity financing.' }
    ],
    relatedSlugs: ['burn-rate', 'saas-growth'],
    calculate: (inputs) => {
      const cash = Number(inputs.bankCash || 250000);
      const rev = Number(inputs.revenue || 15000);
      const out = Number(inputs.outflow || 40000);

      const netBurn = out - rev;

      if (netBurn <= 0) {
        return {
          results: [
            { label: 'Startup Runway Length', value: 'Default Net positive Cash Flow! ♾️', isPrimary: true },
            { label: 'Net Monthly Income Surplus', value: `$${Math.abs(netBurn).toLocaleString()}` }
          ]
        };
      }

      const runway = cash / netBurn;

      return {
        results: [
          { label: 'Estimated Runway Length', value: `${runway.toFixed(1)} Months`, isPrimary: true },
          { label: 'Net Monthly Burn rate', value: `$${netBurn.toLocaleString()}` },
          { label: 'Fundraising Deadline recommendation', value: `In ${Math.max(1, Math.round(runway - 4))} Months` }
        ],
        chartData: [
          { name: 'Month 0 Available', value: cash },
          { name: 'Month 3 Balance', value: Math.max(0, cash - (netBurn * 3)) },
          { name: 'Month 6 Balance', value: Math.max(0, cash - (netBurn * 6)) },
          { name: 'Month 9 Balance', value: Math.max(0, cash - (netBurn * 9)) }
        ]
      };
    }
  },
  {
    id: 'bus-burn-rate',
    name: 'Company Cash Burn Rate Solver',
    slug: 'burn-rate',
    category: 'marketing',
    description: 'Calculate gross and net monthly cash burn rates to manage capital efficiency.',
    seoTitle: 'Cash Burn Rate Solver | Calculatoora',
    seoDescription: 'Measure your startup Gross Burn and Net Burn rates to optimize capital efficiency.',
    inputs: [
      { id: 'monthlyExpenses', label: 'Average Monthly Operating Costs ($)', type: 'number', defaultValue: 35000 },
      { id: 'monthlySales', label: 'Average Monthly Sales Revenue ($)', type: 'number', defaultValue: 12000 }
    ],
    formula: 'Gross Burn = Operating Expenses; Net Burn = Operating Expenses - Sales Revenue',
    explanation: 'Gross Burn measures total monthly cash outflows. Net Burn measures the actual cash lost monthly after factoring in sales revenue.',
    example: 'An operating spend of $35,000 alongside $12,000 in monthly sales results in a $23,000 Net Burn Rate.',
    faq: [
      { question: 'Why track Gross Burn alongside Net Burn?', answer: 'Gross Burn reflects total overhead expenses. If revenue suddenly drops, Gross Burn shows the maximum cash outflow the company must handle.' }
    ],
    relatedSlugs: ['startup-runway', 'saas-growth'],
    calculate: (inputs) => {
      const exp = Number(inputs.monthlyExpenses || 35000);
      const sales = Number(inputs.monthlySales || 12000);

      const net = exp - sales;

      return {
        results: [
          { label: 'Monthly Net Burn rate', value: `$${net.toLocaleString()}`, isPrimary: true },
          { label: 'Monthly Gross Burn rate', value: `$${exp.toLocaleString()}` },
          { label: 'Revenue Outflow coverage', value: `${((sales / exp) * 100).toFixed(0)}%` }
        ]
      };
    }
  },
  {
    id: 'bus-cac-calc',
    name: 'CAC (Customer Acquisition Cost) Calculator',
    slug: 'cac-calc',
    category: 'marketing',
    description: 'Calculate Customer Acquisition Cost (CAC) to evaluate acquisition campaign efficiency.',
    seoTitle: 'CAC (Customer Acquisition Cost) Calculator | Calculatoora',
    seoDescription: 'Input team, program, and marketing software spends to calculate average customer acquisition costs.',
    inputs: [
      { id: 'marketingSpend', label: 'Ad & Program Spend ($)', type: 'number', defaultValue: 15000 },
      { id: 'salesSalaries', label: 'Sales & Marketing Salaries ($)', type: 'number', defaultValue: 12000 },
      { id: 'customersCount', label: 'New Customers Acquired', type: 'number', defaultValue: 180 }
    ],
    formula: 'CAC = (MarketingSpend + SalesSalaries) / CustomersAcquired',
    explanation: 'Customer Acquisition Cost (CAC) measures the total cost of acquiring a single customer. Keeping CAC lower than Customer Lifetime Value (LTV) is essential for long-term profitability.',
    example: 'Spending $27,000 across sales and marketing to acquire 180 new customers results in a $150 CAC.',
    faq: [
      { question: 'What is a typical healthy CAC multiplier?', answer: 'SaaS companies typically aim for an LTV to CAC ratio of 3:1 or higher to ensure sustainable growth.' }
    ],
    relatedSlugs: ['clv-calc', 'startup-runway'],
    calculate: (inputs) => {
      const marketing = Number(inputs.marketingSpend || 15000);
      const salaries = Number(inputs.salesSalaries || 1200);
      const count = Number(inputs.customersCount || 180);

      const cac = count > 0 ? ((marketing + salaries) / count) : 0;

      return {
        results: [
          { label: 'Customer Acquisition Cost (CAC)', value: `$${cac.toFixed(2)}`, isPrimary: true },
          { label: 'Active sales/marketing cost share', value: `$${(marketing / count).toFixed(2)}` }
        ]
      };
    }
  },
  {
    id: 'bus-clv-calc',
    name: 'Customer Lifetime Value (LTV) Calculator',
    slug: 'clv-calc',
    category: 'marketing',
    description: 'Calculate Customer Lifetime Value (LTV) and evaluate LTV:CAC efficiency ratios.',
    seoTitle: 'LTV Customer Lifetime Value Calculator | Calculatoora',
    seoDescription: 'Analyze Customer Lifetime Value (LTV) and ratios based on order values, repeat rates, and customer lifetimes.',
    inputs: [
      { id: 'orderValue', label: 'Average Order Value ($)', type: 'number', defaultValue: 120 },
      { id: 'purchaseFreq', label: 'Annual Order placements (frequency)', type: 'number', defaultValue: 4 },
      { id: 'lifetimeYears', label: 'Customer Retention length (Years)', type: 'number', defaultValue: 3.5 },
      { id: 'cac', label: 'Customer Acquisition Cost (CAC) ($)', type: 'number', defaultValue: 150 }
    ],
    formula: 'LTV = OrderValue * PurchaseFrequency * RetentionDuration; Ratio = LTV / CAC',
    explanation: 'Customer Lifetime Value (LTV) measures the total revenue a customer generates during their relationship with your business. High LTV values support scalable growth models.',
    example: 'An average order of $120 placed 4 times annually over 3.5 retention years yields a $1,680 LTV, representing a stellar 11.2x return on a $150 CAC.',
    faq: [
      { question: 'What LTV:CAC ratio is ideal?', answer: 'A 3:1 ratio is standard for growing companies. A 1:1 ratio points to unsustainable customer acquisition costs.' }
    ],
    relatedSlugs: ['cac-calc', 'mrr-calc'],
    calculate: (inputs) => {
      const order = Number(inputs.orderValue || 120);
      const freq = Number(inputs.purchaseFreq || 4);
      const years = Number(inputs.lifetimeYears || 3.5);
      const cacVal = Number(inputs.cac || 150);

      const ltv = order * freq * years;
      const ratio = cacVal > 0 ? (ltv / cacVal) : 0;

      let healthReview = 'High Profit Scalability ✅';
      if (ratio < 3) healthReview = 'Thin Margins / CAC Risk ⚠️';
      if (ratio < 1) healthReview = 'Acquisition Deficit Range 🛑';

      return {
        results: [
          { label: 'Customer Lifetime Value (LTV)', value: `$${ltv.toLocaleString()}`, isPrimary: true },
          { label: 'LTV : CAC Efficiency Ratio', value: `${ratio.toFixed(2)}x` },
          { label: 'Strategic Growth review', value: healthReview }
        ],
        chartData: [
          { name: 'Acquisition Cost (CAC)', value: cacVal, color: '#f43f5e' },
          { name: 'Lifetime Profit Margin', value: Math.max(0, ltv - cacVal), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'bus-saas-growth',
    name: 'SaaS Business Growth Simulator',
    slug: 'saas-growth',
    category: 'marketing',
    description: 'Project compounding monthly subscription revenue, factoring in subscriber growth and churn.',
    seoTitle: 'SaaS Subscription Growth Simulator | Calculatoora',
    seoDescription: 'Forecast monthly recurring revenue (MRR) growth curves over 12 months, factoring in growth and churn.',
    inputs: [
      { id: 'startMrr', label: 'Initial MRR ($)', type: 'number', defaultValue: 10000 },
      { id: 'growthRate', label: 'Monthly Growth Rate (%)', type: 'number', defaultValue: 15 },
      { id: 'churnRate', label: 'Monthly Revenue Churn (%)', type: 'number', defaultValue: 3 }
    ],
    formula: 'Net Monthly Growth = GrowthRate - ChurnRate; Monthly compounding simulation.',
    explanation: 'Subscription models compound growth over time. Factoring in churn is essential for projecting realistic MRR horizons.',
    example: 'Growing at 15% monthly with 3% revenue churn net, a $10,000 initial MRR compounds to $38,924 across 12 months.',
    faq: [
      { question: 'What is net-negative churn?', answer: 'When expansion revenue from existing customers exceeds lost revenue from cancellations, driving growth without adding new accounts.' }
    ],
    relatedSlugs: ['mrr-calc', 'churn-rate'],
    calculate: (inputs) => {
      const start = Number(inputs.startMrr || 10000);
      const growth = Number(inputs.growthRate || 15) / 100;
      const churn = Number(inputs.churnRate || 3) / 100;

      const netCompoundingRate = 1 + (growth - churn);
      const m12 = start * Math.pow(netCompoundingRate, 12);

      return {
        results: [
          { label: 'MRR in 12 Months', value: `$${Math.round(m12).toLocaleString()}`, isPrimary: true },
          { label: 'Net compounding growth rate', value: `${((netCompoundingRate - 1) * 100).toFixed(1)}% / month` },
          { label: 'Annual Revenue Run-Rate', value: `$${Math.round(m12 * 12).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Month 0', value: start },
          { name: 'Month 3', value: Math.round(start * Math.pow(netCompoundingRate, 3)) },
          { name: 'Month 6', value: Math.round(start * Math.pow(netCompoundingRate, 6)) },
          { name: 'Month 9', value: Math.round(start * Math.pow(netCompoundingRate, 9)) },
          { name: 'Month 12', value: Math.round(m12) }
        ]
      };
    }
  },
  {
    id: 'bus-mrr-calc',
    name: 'MRR (Monthly Recurring Revenue) Calculator',
    slug: 'mrr-calc',
    category: 'marketing',
    description: 'Calculate Monthly Recurring Revenue (MRR) based on subscriber cohorts and contract tiers.',
    seoTitle: 'MRR (Monthly Recurring Revenue) Calculator | Calculatoora',
    seoDescription: 'Calculate MRR based on subscriber tiers, average order values, and account expansion revenue.',
    inputs: [
      { id: 'subscribersCount', label: 'Active Subscribers count', type: 'number', defaultValue: 320 },
      { id: 'arpu', label: 'Average Revenue Per User (ARPU) ($)', type: 'number', defaultValue: 49 },
      { id: 'addons', label: 'Monthly Add-on Sales ($)', type: 'number', defaultValue: 1200 }
    ],
    formula: 'MRR = (Subscribers * ARPU) + Addons',
    explanation: 'Monthly Recurring Revenue (MRR) is the core metric for subscription businesses, representing highly predictable revenue streams.',
    example: '320 active customers billed at $49 monthly with $1,200 in custom add-ons generates a $16,880 MRR.',
    faq: [
      { question: 'What is ARPU?', answer: 'Average Revenue Per User. It measures the average monthly revenue generated per active subscription account.' }
    ],
    relatedSlugs: ['arr-calc', 'saas-growth', 'clv-calc'],
    calculate: (inputs) => {
      const subs = Number(inputs.subscribersCount || 320);
      const arpu = Number(inputs.arpu || 49);
      const addons = Number(inputs.addons || 1200);

      const mrr = (subs * arpu) + addons;

      return {
        results: [
          { label: 'Monthly Recurring Revenue (MRR)', value: `$${mrr.toLocaleString()}`, isPrimary: true },
          { label: 'Yearly Run Rate (ARR)', value: `$${(mrr * 12).toLocaleString()}` }
        ]
      };
    }
  },
  {
    id: 'bus-arr-calc',
    name: 'ARR (Annual Recurring Revenue) Calculator',
    slug: 'arr-calc',
    category: 'marketing',
    description: 'Project predictability metrics into stable Annual Recurring Revenue curves.',
    seoTitle: 'ARR Annual Run Rate Solver | Calculatoora',
    seoDescription: 'Calculate Annual Recurring Revenue (ARR) based on recurring subscriptions and multi-year contract values.',
    inputs: [
      { id: 'mrr', label: 'Active MRR base ($)', type: 'number', defaultValue: 16500 }
    ],
    formula: 'ARR = MRR * 12',
    explanation: 'Annual Recurring Revenue (ARR) measures recurring revenue on an annualized basis, showing long-term scalability to partners and investors.',
    example: 'An organic business maintaining a stable $16,500 monthly recurring revenue operates at a $198,000 ARR.',
    faq: [
      { question: 'Should one-time consulting fees count toward ARR?', answer: 'No. ARR only includes predictable, recurring contract revenue. One-time setup or consulting fees should be excluded.' }
    ],
    relatedSlugs: ['mrr-calc', 'saas-growth'],
    calculate: (inputs) => {
      const mrr = Number(inputs.mrr || 16500);
      const arr = mrr * 12;

      return {
        results: [
          { label: 'Annual Recurring Revenue (ARR)', value: `$${arr.toLocaleString()}`, isPrimary: true },
          { label: 'Daily Revenue average equivalent', value: `$${(arr / 365).toFixed(2)}` }
        ]
      };
    }
  },
  {
    id: 'bus-churn-rate',
    name: 'SaaS Churn Rate Solver',
    slug: 'churn-rate',
    category: 'marketing',
    description: 'Calculate customer and revenue churn rate percentages to assess retention health.',
    seoTitle: 'SaaS Churn & Active Cancellation Solver | Calculatoora',
    seoDescription: 'Input starting values and cancellations to calculate your monthly customer churn rate percentage.',
    inputs: [
      { id: 'startSubs', label: 'Starting Monthly Subscribers', type: 'number', defaultValue: 1200 },
      { id: 'cancellations', label: 'Cancellations count in period', type: 'number', defaultValue: 42 }
    ],
    formula: 'Churn Rate (%) = (Cancellations / StartingSubscribers) * 100',
    explanation: 'Churn rate is the percentage of subscribers who cancel their subscriptions during a given period. Business sustainability relies directly on minimizing churn.',
    example: 'Losing 42 from a starting tier of 1,200 accounts translates to a 3.50% churn rate.',
    faq: [
      { question: 'What is a typical SaaS churn rate?', answer: 'For B2B SaaS, a monthly churn rate between 1% and 2% is excellent. B2C SaaS platforms often experience higher churn rates, averaging 3% to 5%.' }
    ],
    relatedSlugs: ['saas-growth', 'mrr-calc'],
    calculate: (inputs) => {
      const start = Number(inputs.startSubs || 1200);
      const diff = Number(inputs.cancellations || 42);

      const churn = start > 0 ? ((diff / start) * 100) : 0;
      const lifespan = churn > 0 ? (100 / churn) : 0; // average customer lifespan in months

      return {
        results: [
          { label: 'Monthly Customer Churn Rate', value: `${churn.toFixed(2)}%`, isPrimary: true },
          { label: 'Average Customer Lifespan', value: `${lifespan.toFixed(1)} months` },
          { label: 'Retention Rate equivalent', value: `${(100 - churn).toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Retained Customers', value: Math.max(0, start - diff), color: '#39FF14' },
          { name: 'Churned Customers', value: diff, color: '#f43f5e' }
        ]
      };
    }
  }
];
