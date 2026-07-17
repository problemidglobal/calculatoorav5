import { Calculator } from '../types';

export const V16_BUSINESS_CALCULATORS: Calculator[] = [
  {
    id: 'business-valuation',
    name: 'Business Valuation Calculator',
    slug: 'business-valuation',
    category: 'business',
    description: 'Estimate company enterprise value using standardized EBITDA or Seller Discretionary Earnings (SDE) industry multiples.',
    formula: 'Value = EBITDA * Multiple + Cash - Debt',
    explanation: 'Applies normalized industry performance multipliers to annual operating earnings, adjusting for balance sheet liquidity and cumulative long-term debt.',
    example: 'An annual EBITDA of $350,000 with a conservative 4.5x multiple, $50,000 cash, and $30,000 debt yields a $1,595,000 business valuation.',
    inputs: [
      { id: 'ebitda', label: 'EBITDA or SDE Earnings', type: 'number', defaultValue: 350000, min: 0, unit: '$' },
      { id: 'multiple', label: 'Industry Multiple (x)', type: 'number', defaultValue: 4.5, min: 1, max: 25, step: 0.1, unit: 'x' },
      { id: 'cash', label: 'Business Cash Reserves', type: 'number', defaultValue: 50000, min: 0, unit: '$' },
      { id: 'debt', label: 'Outstanding Long-term Debt', type: 'number', defaultValue: 30000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is EBITDA?', answer: 'Earnings Before Interest, Taxes, Depreciation, and Amortization. It serves as a standard proxy for operating cash profitability.' },
      { question: 'When is SDE used instead of EBITDA?', answer: 'Seller Discretionary Earnings (SDE) is typically used for smaller, owner-operated businesses, adding back the owner’s compensation.' }
    ],
    relatedSlugs: ['startup-valuation', 'revenue-forecast'],
    seoTitle: 'EBITDA and SDE Business Valuation Model Calculator',
    seoDescription: 'Accurately estimate your company enterprise valuation using adjustable EBITDA or SDE multiples and cash adjustments.',
    calculate: (inputs) => {
      const ebit = Number(inputs.ebitda || 0);
      const mult = Number(inputs.multiple || 0);
      const cash = Number(inputs.cash || 0);
      const debt = Number(inputs.debt || 0);
      
      const coreValue = ebit * mult;
      const enterpriseVal = coreValue + cash - debt;
      
      return {
        results: [
          { label: 'Estimated Enterprise Value', value: Math.round(enterpriseVal), unit: '$', isPrimary: true },
          { label: 'Core Multiplied Valuation', value: Math.round(coreValue), unit: '$' },
          { label: 'Net Liquid Cash Adjustments', value: cash - debt, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'startup-valuation',
    name: 'Startup Valuation Calculator',
    slug: 'startup-valuation',
    category: 'business',
    description: 'Score early-stage or pre-revenue venture valuation using Berkus scoring methods.',
    formula: 'Valuation = Sum of Scores across 5 Risk Factors (Up to $500k each)',
    explanation: 'Assigns monetary values to five vital startup components: core concept, working prototype, management team quality, strategic alliances, and initial sales progress.',
    example: 'A star idea with high-caliber founders and a functioning prototype but lacking formal sales might score $1,800,000.',
    inputs: [
      { id: 'idea', label: 'Sound Idea (Potential Risk Check)', type: 'range', defaultValue: 80, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'team', label: 'Management Team Quality', type: 'range', defaultValue: 90, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'prototype', label: 'Functioning Technology/Prototype', type: 'range', defaultValue: 60, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'alliances', label: 'Strategic Partnerships / Board', type: 'range', defaultValue: 40, min: 0, max: 100, step: 5, unit: '%' },
      { id: 'sales', label: 'Initial Traction & Sales Process', type: 'range', defaultValue: 20, min: 0, max: 100, step: 5, unit: '%' }
    ],
    faq: [
      { question: 'What is the Berkus Method?', answer: 'An angel investing methodology designed by Dave Berkus to value early pre-revenue companies without relying on nonexistent cash flows.' },
      { question: 'What is the maximum valuation achievable under Berkus?', answer: 'The baseline classic model tops out at $2.5 million ($500k max allocated per each of the five risk mitigation parameters).' }
    ],
    relatedSlugs: ['business-valuation', 'revenue-forecast'],
    seoTitle: 'Pre-Revenue Venture Startup Valuation Calculator',
    seoDescription: 'Apply the celebrated Berkus Method to value pre-seed and seed stage startups lacking historical cash cycles.',
    calculate: (inputs) => {
      const maxAllo = 500000;
      const ideaS = (Number(inputs.idea || 0) / 100) * maxAllo;
      const teamS = (Number(inputs.team || 0) / 100) * maxAllo;
      const protoS = (Number(inputs.prototype || 0) / 100) * maxAllo;
      const allyS = (Number(inputs.alliances || 0) / 100) * maxAllo;
      const saleS = (Number(inputs.sales || 0) / 100) * maxAllo;
      
      const totalVal = ideaS + teamS + protoS + allyS + saleS;
      
      return {
        results: [
          { label: 'Berkus Method Valuation', value: Math.round(totalVal), unit: '$', isPrimary: true },
          { label: 'Concept & Team Contribution', value: Math.round(ideaS + teamS), unit: '$' },
          { label: 'Product & Partnerships Value', value: Math.round(protoS + allyS), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'revenue-forecast',
    name: 'Revenue Forecast Calculator',
    slug: 'revenue-forecast',
    category: 'business',
    description: 'Predict organic sales pipelines using custom conversion funnels, visitor counts, and Average Order Values (AOV).',
    formula: 'Revenue = Traffic * Conversion Rate * Average Order Value',
    explanation: 'Models monthly online or retail traffic parameters alongside sales Conversion and AOV to output forward revenues.',
    example: '50,000 monthly unique store visitors converting at 2.5% with an average basket tag of $75 creates $93,750 in monthly revenue.',
    inputs: [
      { id: 'traffic', label: 'Expected Monthly Traffic/leads', type: 'number', defaultValue: 50000, min: 0, unit: 'users' },
      { id: 'conversion', label: 'Sales Conversion Rate', type: 'number', defaultValue: 2.5, min: 0, max: 100, step: 0.1, unit: '%' },
      { id: 'aov', label: 'Average Order Value (AOV)', type: 'number', defaultValue: 75, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'Crucial steps to lift revenue performance?', answer: 'Focus on improving Conversion Rate via trust indicators (CRO) or upselling related offerings to heighten Average Order Value.' }
    ],
    relatedSlugs: ['profit-forecast', 'sales-target'],
    seoTitle: 'Traffic Conversion-Led Revenue Forecast Calculator',
    seoDescription: 'Predict company revenues by varying inbound traffic channels, customer conversion multipliers and purchase sizes.',
    calculate: (inputs) => {
      const traf = Number(inputs.traffic || 0);
      const conv = Number(inputs.conversion || 0) / 100;
      const aov = Number(inputs.aov || 0);
      
      const monthlyOrders = traf * conv;
      const monthlyRev = monthlyOrders * aov;
      const annualRev = monthlyRev * 12;
      
      return {
        results: [
          { label: 'Estimated Monthly Revenue', value: Math.round(monthlyRev), unit: '$', isPrimary: true },
          { label: 'Projected Annual Revenue', value: Math.round(annualRev), unit: '$' },
          { label: 'Purchases Generated Monthly', value: Math.round(monthlyOrders), unit: 'orders' }
        ]
      };
    }
  },
  {
    id: 'profit-forecast',
    name: 'Profit Forecast Calculator',
    slug: 'profit-forecast',
    category: 'business',
    description: 'Calculate future net income positions by factoring cost-of-goods and operating burn rates.',
    formula: 'Net Profit = Revenue - COGS - Operating Expenses',
    explanation: 'Takes top-line revenue forecasts, applies product margins to separate gross, then subtracts monthly operational overhead.',
    example: 'A monthly revenue of $100,000 with 40% product cost (COGS) and $30,000 static staff/rental costs leaves a $30,000 net monthly profit.',
    inputs: [
      { id: 'revenue', label: 'Expected Monthly Revenue', type: 'number', defaultValue: 100000, min: 0, unit: '$' },
      { id: 'cogsPct', label: 'Cost of Goods Sold (COGS)', type: 'number', defaultValue: 40, min: 0, max: 100, unit: '%' },
      { id: 'opex', label: 'Monthly Operating/Fixed Costs', type: 'number', defaultValue: 30000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What falls under operating expenses (OPEX)?', answer: 'Rent, marketing, human resource payroll, diagnostic insurances, cloud hosting services, and general office utilities.' }
    ],
    relatedSlugs: ['revenue-forecast', 'sales-target'],
    seoTitle: 'EBIT Net Profit and Operating Margin Forecast Calculator',
    seoDescription: 'Inputs gross revenue projections, cost of sales (COGS), and fixed costs to estimate net business profits.',
    calculate: (inputs) => {
      const rev = Number(inputs.revenue || 0);
      const cogsP = Number(inputs.cogsPct || 0) / 100;
      const opex = Number(inputs.opex || 0);
      
      const cogsVal = rev * cogsP;
      const grossProfit = rev - cogsVal;
      const netProfit = grossProfit - opex;
      const netPct = rev > 0 ? (netProfit / rev) * 100 : 0;
      
      return {
        results: [
          { label: 'Net Monthly Profit', value: Math.round(netProfit), unit: '$', isPrimary: true },
          { label: 'Gross Operating Profit', value: Math.round(grossProfit), unit: '$' },
          { label: 'Net Profit Margin Ratio', value: Number(netPct.toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'sales-target',
    name: 'Sales Target Calculator',
    slug: 'sales-target',
    category: 'business',
    description: 'Determine the exact unit volume or dollar revenue target required to break even or hit specific profit goals.',
    formula: 'Target Revenue = (Fixed Costs + Target Profit) / (1 - Variable Cost %)',
    explanation: 'Finds the exact critical mass point for commercial products given specific manufacturing variables and overheads.',
    example: 'To achieve a target profit of $20,000 with $10,000 fixed costs and a variable cost of 30%, you need $42,857 in total sales.',
    inputs: [
      { id: 'desiredProfit', label: 'Target Monthly Net Profit', type: 'number', defaultValue: 20000, min: 0, unit: '$' },
      { id: 'fixedCosts', label: 'Monthly Fixed Costs (OPEX)', type: 'number', defaultValue: 10000, min: 0, unit: '$' },
      { id: 'variableCostPct', label: 'Product Variable Cost per Unit', type: 'number', defaultValue: 30, min: 0, max: 99, unit: '%' }
    ],
    faq: [
      { question: 'What is a variable cost?', answer: 'Costs that scale directly with production volumes (e.g., packaging material, raw components, shipping stamps).' },
      { question: 'What is the Break-Even point?', answer: 'The revenue value where net profit represents exactly zero, meaning the firm has covered all variable and static costs.' }
    ],
    relatedSlugs: ['revenue-forecast', 'profit-forecast'],
    seoTitle: 'Target Sales and Break-Even Volume Calculator',
    seoDescription: 'Estimate exactly how much product volume or general revenue you must register monthly to cover OPEX and hit profits.',
    calculate: (inputs) => {
      const dP = Number(inputs.desiredProfit || 0);
      const fC = Number(inputs.fixedCosts || 0);
      const vC = Number(inputs.variableCostPct || 0) / 100;
      
      const denom = (1 - vC);
      const targetRevenue = (fC + dP) / denom;
      const breakEvenRevenue = fC / denom;
      
      return {
        results: [
          { label: 'Required Monthly Sales', value: Math.round(targetRevenue), unit: '$', isPrimary: true },
          { label: 'Break-Even Revenue Floor', value: Math.round(breakEvenRevenue), unit: '$' },
          { label: 'Net Margin Under Target', value: Number((dP / targetRevenue * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'business-kpi',
    name: 'Business KPI Calculator',
    slug: 'business-kpi',
    category: 'business',
    description: 'Analyze SaaS and company metrics including Customer Acquisition Cost (CAC), Lifetime Value (LTV), and LTV:CAC ratios.',
    formula: 'LTV = Average Purchase Value * Purchase Frequency * Customer Lifespan; Ratio = LTV / CAC',
    explanation: 'Correlates unit sales economics to reveal whether your marketing spend generates a healthy long-term ROI.',
    example: 'With $150 average spend, 3 purchases/yr, 5-year holding life, and a $100 marketing cost per acquisition (CAC), the healthy LTV is $2,250 creating a highly valuable 22.5:1 ratio.',
    inputs: [
      { id: 'acquisitionSpend', label: 'Total Marketing Spend (Monthly)', type: 'number', defaultValue: 10000, min: 0, unit: '$' },
      { id: 'customersAcquired', label: 'New Cust acquired (Monthly)', type: 'number', defaultValue: 100, min: 1, unit: 'cust' },
      { id: 'apv', label: 'Average Ticket Value per Purchase', type: 'number', defaultValue: 150, min: 1, unit: '$' },
      { id: 'frequency', label: 'Annual Purchases per Client', type: 'number', defaultValue: 3, min: 1, unit: 'times' },
      { id: 'lifespan', label: 'Customer Longevity (Years)', type: 'number', defaultValue: 5, min: 1, unit: 'yrs' }
    ],
    faq: [
      { question: 'What is a healthy LTV to CAC ratio?', answer: 'A common benchmark limit is 3:1 or higher. Lower ratios suggest you are spending over-aggressively on marketing relative to user value.' }
    ],
    relatedSlugs: ['business-growth-projection', 'sales-target'],
    seoTitle: 'Customer Acquisition CAC and LTV Metric KPI Calculator',
    seoDescription: 'Measure core unit economics and customer retention indicators such as dynamic LTV to CAC proportions.',
    calculate: (inputs) => {
      const spend = Number(inputs.acquisitionSpend || 0);
      const acquired = Number(inputs.customersAcquired || 1);
      const apv = Number(inputs.apv || 0);
      const freq = Number(inputs.frequency || 0);
      const life = Number(inputs.lifespan || 1);
      
      const cac = spend / acquired;
      const annualMargin = apv * freq;
      const ltv = annualMargin * life;
      const ratio = cac > 0 ? ltv / cac : 0;
      
      return {
        results: [
          { label: 'Customer Lifetime Value (LTV)', value: Math.round(ltv), unit: '$', isPrimary: true },
          { label: 'Customer Acquisition Cost (CAC)', value: Math.round(cac), unit: '$' },
          { label: 'LTV to CAC Ratio Proportion', value: Number(ratio.toFixed(1)), unit: ':1' }
        ]
      };
    }
  },
  {
    id: 'business-growth-projection',
    name: 'Business Growth Projection Calculator',
    slug: 'business-growth-projection',
    category: 'business',
    description: 'Forecast recurring revenues and subscriber indices based on positive compounding monthly trajectories.',
    formula: 'Future MRR = Current MRR * (1 + Growth Rate)^Months',
    explanation: 'Models recurring revenue gains (MRR) compounded by regular sales expansions, net of user attrition (churn).',
    example: 'A modern SaaS with $30,000 MRR growing at 8% monthly, suffering 3% churn, increases MRR to ~$52,300 in 12 months.',
    inputs: [
      { id: 'currentMrr', label: 'Current Monthly Recurring (MRR)', type: 'number', defaultValue: 30000, min: 0, unit: '$' },
      { id: 'growthRate', label: 'Inbound Monthly Growth Rate', type: 'number', defaultValue: 8, min: 0, max: 100, step: 0.1, unit: '%' },
      { id: 'churnRate', label: 'Monthly Retractive Churn Rate', type: 'number', defaultValue: 3, min: 0, max: 50, step: 0.1, unit: '%' },
      { id: 'months', label: 'Forecasting Timeline', type: 'number', defaultValue: 12, min: 1, max: 60, unit: 'mths' }
    ],
    faq: [
      { question: 'What constitutes churn rate?', answer: 'The percentage of recurring customers who cancel subscriptions or terminate accounts over a specific month.' }
    ],
    relatedSlugs: ['business-kpi', 'revenue-forecast'],
    seoTitle: 'SaaS Recurring MRR Growth and Churn forecast Calculator',
    seoDescription: 'Project Monthly Recurring Revenue (MRR) milestones while adjusting for real-world user churn attrition.',
    calculate: (inputs) => {
      const current = Number(inputs.currentMrr || 0);
      const growPct = Number(inputs.growthRate || 0) / 100;
      const churnPct = Number(inputs.churnRate || 0) / 100;
      const totalM = Number(inputs.months || 1);
      
      // Net Growth Rate = growth - churn
      const netGrowth = growPct - churnPct;
      const projectedMrr = current * Math.pow(1 + netGrowth, totalM);
      const arr = projectedMrr * 12;
      
      return {
        results: [
          { label: 'Forecasted Future MRR', value: Math.round(projectedMrr), unit: '$', isPrimary: true },
          { label: 'Equivalent Projected ARR', value: Math.round(arr), unit: '$' },
          { label: 'Net Compounded Monthly Growth', value: Number((netGrowth * 100).toFixed(1)), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'employee-cost',
    name: 'Employee Cost Calculator',
    slug: 'employee-cost',
    category: 'business',
    description: 'Calculate the total cost of an employee (Fully Burdened Rate) incorporating benefits, taxes, insurance, and equipment overhead.',
    formula: 'Total Cost = Base Salary + Benefits + Employer Taxes + Recruiting/Tech overhead',
    explanation: 'Adds legislative employer taxes (FICA, FUTA, SUTA) and health plans on top of base salary allocations.',
    example: 'A specialist earning a $100,000 base salary costs the employer ~$130,500 after 20% benefits and 10.5% taxes/overheads.',
    inputs: [
      { id: 'baseSalary', label: 'Employee Annual Base Salary', type: 'number', defaultValue: 100000, min: 0, unit: '$' },
      { id: 'benefitsPct', label: 'Health & Retirement Perks %', type: 'number', defaultValue: 20, min: 0, max: 100, unit: '%' },
      { id: 'employerTaxesPct', label: 'Employer Taxes & FICA %', type: 'number', defaultValue: 8.5, min: 0, max: 30, step: 0.1, unit: '%' },
      { id: 'techOverhead', label: 'Annual Equipment / Software Seat', type: 'number', defaultValue: 2000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is a fully burdened rate?', answer: 'The comprehensive cost of employing an individual, including workspace real estate, software licenses, and compensation.' }
    ],
    relatedSlugs: ['hiring-cost', 'business-valuation'],
    seoTitle: 'Fully Burdened Employee Cost Calculator',
    seoDescription: 'Calculate the complete burden cost of an employee including healthcare, insurance premiums and taxes.',
    calculate: (inputs) => {
      const base = Number(inputs.baseSalary || 0);
      const ben = Number(inputs.benefitsPct || 0) / 100;
      const tax = Number(inputs.employerTaxesPct || 0) / 100;
      const overhead = Number(inputs.techOverhead || 0);
      
      const benefitsValue = base * ben;
      const taxesValue = base * tax;
      const totalburden = base + benefitsValue + taxesValue + overhead;
      const hourlyBurden = totalburden / 2080; // Standard full-time hours
      
      return {
        results: [
          { label: 'Fully Burdened Annual Cost', value: Math.round(totalburden), unit: '$', isPrimary: true },
          { label: 'Burdened Hourly Rate Equivalent', value: Number(hourlyBurden.toFixed(2)), unit: '$/hr' },
          { label: 'Employer Taxes & Benefits Value', value: Math.round(benefitsValue + taxesValue), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'hiring-cost',
    name: 'Hiring Cost Calculator',
    slug: 'hiring-cost',
    category: 'business',
    description: 'Calculate recruiting and onboarding overhead expenditures to fill a single professional vacancy.',
    formula: 'Hiring Cost = Ads + Agency Fees + Internal HR Hours Cost + Training materials',
    explanation: 'Models the comprehensive cost of sourcing, interview auditing, recruiter premiums, onboarding setups, and initial training.',
    example: 'An $80,000 position with internal HR spending 40 hours, $1,500 ads, and $5,000 recruiter fees runs $8,100 in structural hiring cost.',
    inputs: [
      { id: 'agencyFees', label: 'External Agency / headhunter Cost', type: 'number', defaultValue: 5000, min: 0, unit: '$' },
      { id: 'listingSpend', label: 'Job Boards & Ad Spend', type: 'number', defaultValue: 1500, min: 0, unit: '$' },
      { id: 'hrRate', label: 'Internal HR Hourly Comp Rate', type: 'number', defaultValue: 40, min: 0, unit: '$/hr' },
      { id: 'hrHours', label: 'Total HR Interview Processing Hours', type: 'number', defaultValue: 40, min: 0, unit: 'hrs' },
      { id: 'trainingOnboarding', label: 'Training and Onboarding materials', type: 'number', defaultValue: 1000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'Why perform hiring cost projections?', answer: 'Ensures executive departments preserve adequate reserves during active capital expansions or company staffing phases to avoid cash shortages.' }
    ],
    relatedSlugs: ['employee-cost', 'sales-target'],
    seoTitle: 'Acquisition & Recruitment Hiring Cost Calculator',
    seoDescription: 'Project the true direct capital and resource cost spent per hire when advertising and onboarding a new professional.',
    calculate: (inputs) => {
      const agency = Number(inputs.agencyFees || 0);
      const list = Number(inputs.listingSpend || 0);
      const hrRate = Number(inputs.hrRate || 0);
      const hrHrs = Number(inputs.hrHours || 0);
      const training = Number(inputs.trainingOnboarding || 0);
      
      const hrCost = hrRate * hrHrs;
      const totalHiringCost = agency + list + hrCost + training;
      
      return {
        results: [
          { label: 'Total Cost to Fill Role', value: Math.round(totalHiringCost), unit: '$', isPrimary: true },
          { label: 'Internal Labor Resource Burn', value: Math.round(hrCost), unit: '$' },
          { label: 'External Advertising & Outsourcing', value: agency + list, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'business-sustainability',
    name: 'Business Sustainability Calculator',
    slug: 'business-sustainability',
    category: 'business',
    description: 'Calculate corporate waste reduction benefits, carbon footprint offsets, and sustainability investments ROI.',
    formula: 'Annual Saved Cost = Raw Material Reduction + Energy Savings - Green Surcharges',
    explanation: 'Models operational cost adjustments and material reductions when transitioning to sustainable methods.',
    example: 'Reducing annual packaging weight by 2,000 kg and dropping electricity usage by 15,000 kWh saves $8,400 annually against a $3,000 offset audit.',
    inputs: [
      { id: 'paperWeight', label: 'Raw Packaging Saved (Annual)', type: 'number', defaultValue: 2000, min: 0, unit: 'kg' },
      { id: 'kwhRate', label: 'Monthly Electricity Saved', type: 'number', defaultValue: 1250, min: 0, unit: 'kWh' },
      { id: 'costPerKwh', label: 'Average Rate per kWh Cost', type: 'number', defaultValue: 0.16, min: 0.01, max: 1.00, step: 0.01, unit: '$/kWh' },
      { id: 'carbonCreditCost', label: 'Annual Eco Program/Credit Cost', type: 'number', defaultValue: 3000, min: 0, unit: '$' }
    ],
    faq: [
      { question: 'What is the carbon impact of electricity savings?', answer: 'Depending on your region, 1 kWh of conserved coal/gas power translates to approximately 0.38 - 0.5 kg of atmospheric carbon offset.' }
    ],
    relatedSlugs: ['business-kpi', 'profit-forecast'],
    seoTitle: 'Corporate Green ROI & Sustainability Cost Calculator',
    seoDescription: 'Measure your business electricity savings, waste reduction benefits, and eco program operational offsets.',
    calculate: (inputs) => {
      const kgSaved = Number(inputs.paperWeight || 0);
      const kwhMonth = Number(inputs.kwhRate || 0);
      const kwRate = Number(inputs.costPerKwh || 0);
      const credits = Number(inputs.carbonCreditCost || 0);
      
      const annualKwhCostSavings = kwhMonth * 12 * kwRate;
      const rawMaterialSavingsValue = kgSaved * 1.5; // Assume static $1.5/kg packaging raw material cost recovery
      const grossAnnualEcoSavings = annualKwhCostSavings + rawMaterialSavingsValue;
      const netEcoProfit = grossAnnualEcoSavings - credits;
      
      // Carbon tons saved calculation (rough estimate)
      const co2MetricTonsSaved = (kwhMonth * 12 * 0.45) / 1000;
      
      return {
        results: [
          { label: 'Net Annual Sustainability Impact', value: Math.round(netEcoProfit), unit: '$', isPrimary: true },
          { label: 'Annual Electricity Cost Saved', value: Math.round(annualKwhCostSavings), unit: '$' },
          { label: 'CO2 Atmosphere Mitigations', value: Number(co2MetricTonsSaved.toFixed(1)), unit: 'Metric Tons' }
        ]
      };
    }
  }
];
