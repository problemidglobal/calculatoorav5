import { Calculator } from '../types';

export const V22_PART5_CALCULATORS: Calculator[] = [
  // ====================================== FINANCE & BUSINESS ======================================
  {
    id: 'roi-calc',
    name: 'ROI Investment Calculator',
    slug: 'roi-calc',
    category: 'business',
    description: 'Calculate absolute and annualized Return on Investment (ROI) percentages for assets and business portfolios.',
    formula: 'ROI (%) = (Gain - Initial Cost) / Initial Cost * 100\nAnnualized ROI (%) = ((1 + Total ROI) ^ (1 / Years) - 1) * 100',
    explanation: 'Sizers investment returns, helping retail traders compare stock portfolios against real estate or bonds.',
    example: 'Buying a business pool for $20,000 and harvesting $28,000 cash 3 years later achieves a 40% overall ROI, or 11.87% annualized.',
    inputs: [
      { id: 'startFee', label: 'Initial Financial Cost ($)', type: 'number', defaultValue: 10000, min: 100 },
      { id: 'endValue', label: 'Terminal Portfolio Value ($)', type: 'number', defaultValue: 14500, min: 10 },
      { id: 'yearsDuration', label: 'Investment Hold Duration (Years)', type: 'number', defaultValue: 3.5, min: 0.1, step: 0.1 }
    ],
    faq: [
      { question: 'What is a good annualized ROI?', answer: 'Typical historical stock indices (like the S&P 500) average a 7% to 10% annualized return after adjusting for inflation.' }
    ],
    relatedSlugs: ['breakeven', 'markup-profit'],
    seoTitle: 'Annualized Portfolio Return on Investment ROI Calculator',
    seoDescription: 'Benchmark investment performance by converting raw capital gains into annualized ROI rates.',
    calculate: (inputs) => {
      const start = Number(inputs.startFee || 10000);
      const end = Number(inputs.endValue || 14500);
      const yrs = Number(inputs.yearsDuration || 3.5);
      
      const gain = end - start;
      const roi = (gain / start) * 100;
      const annRoi = (Math.pow(end / start, 1 / yrs) - 1) * 100;
      return {
        results: [
          { label: 'Total ROI Return', value: roi.toFixed(1) + '%', isPrimary: true },
          { label: 'Annualized ROI Rate', value: annRoi.toFixed(2) + '%/year' },
          { label: 'Net Capital Gains realized', value: '$' + gain.toLocaleString() }
        ],
        chartData: [
          { name: 'Principal Investment', value: start },
          { name: 'Value Growth Cap', value: gain }
        ]
      };
    }
  },
  {
    id: 'breakeven',
    name: 'Business Breakeven Calculator',
    slug: 'breakeven',
    category: 'business',
    description: 'Determine units needed to sell to cover fixed overhead expenses and startup costs.',
    formula: 'Breakeven Units = Fixed Costs / (Unit Retail Price - Variable Cost per Unit)',
    explanation: 'Aids startup founders calculating minimum sales velocities required to offset monthly rent and storage outlays.',
    example: 'A bakery carrying $3,000 fixed monthly rent retailing $5 loaves that cost $2 in flour can break even at exactly 1,000 loaves sold.',
    inputs: [
      { id: 'fixedExpenses', label: 'Fixed Monthly Overhead Costs ($)', type: 'number', defaultValue: 4500, min: 10, step: 100 },
      { id: 'unitPrice', label: 'Unit Retail Selling Price ($)', type: 'number', defaultValue: 12, min: 0.1, step: 0.5 },
      { id: 'unitCost', label: 'Unit Variable Cost ($)', type: 'number', defaultValue: 4.50, min: 0, step: 0.5 }
    ],
    faq: [
      { question: 'What are fixed vs variable costs?', answer: 'Fixed costs (rent, insurance, salaries) stay constant regardless of volume. Variable costs (flour, packaging, merchant fees) scale unit-by-unit with sales.' }
    ],
    relatedSlugs: ['roi-calc', 'markup-profit'],
    seoTitle: 'Corporate Unit-Margin Breakeven Sales Calculator',
    seoDescription: 'Find when your startup shifts into operations profitability by analyzing fixed costs against unit markup margins.',
    calculate: (inputs) => {
      const fixed = Number(inputs.fixedExpenses || 4500);
      const price = Number(inputs.unitPrice || 12);
      const cost = Number(inputs.unitCost || 4.50);
      
      const margin = price - cost;
      const units = margin > 0 ? Math.ceil(fixed / margin) : 0;
      return {
        results: [
          { label: 'Breakeven Sales Volumes', value: units > 0 ? units.toLocaleString() + ' Units' : 'Infeasible Margin', isPrimary: true },
          { label: 'Unit Contribution Margin', value: '$' + margin.toFixed(2) },
          { label: 'Breakeven Gross Revenue', value: '$' + (units * price).toLocaleString() }
        ],
        chartData: [
          { name: 'Unit Cost Sizer', value: cost },
          { name: 'Contribution Margin', value: margin }
        ]
      };
    }
  },
  {
    id: 'markup-profit',
    name: 'Markup & Profit Margin Calculator',
    slug: 'markup-profit',
    category: 'business',
    description: 'Calculate product markup vs profit margins percentages to establish proper retail pricing structures.',
    formula: 'Profit Margin (%) = (Price - Cost) / Price * 100\nMarkup Percentage (%) = (Price - Cost) / Cost * 100',
    explanation: 'Aids retail operations and e-commerce merchants pricing items, distinguishing markup rates from margin percentages.',
    example: 'An item costing $20 priced at $30 carries a 50% markup rate, while yielding a 33.3% gross profit margin.',
    inputs: [
      { id: 'itemCost', label: 'Wholesale Item Cost ($)', type: 'number', defaultValue: 50, min: 0.1 },
      { id: 'retailPrice', label: 'Retail Sales Price Target ($)', type: 'number', defaultValue: 80, min: 0.1 }
    ],
    faq: [
      { question: 'Can profit margin ever exceed 100%?', answer: 'No. Profit margin is calculated as profit divided by selling price, meaning it caps realistically below 100% (unless costs are negative).' }
    ],
    relatedSlugs: ['roi-calc', 'breakeven'],
    seoTitle: 'Retail Product Markup & Profit Margin Calculator',
    seoDescription: 'Contrast wholesale prices with retail tags to lock in markup rates and margin metrics.',
    calculate: (inputs) => {
      const cost = Number(inputs.itemCost || 50);
      const price = Number(inputs.retailPrice || 80);
      
      const profit = Math.max(-cost, price - cost);
      const margin = (profit / price) * 100;
      const markup = (profit / cost) * 100;
      return {
        results: [
          { label: 'Gross Profit Margin', value: margin.toFixed(1) + '%', isPrimary: true },
          { label: 'Item Retail Markup', value: markup.toFixed(1) + '%' },
          { label: 'Net Profit dollar margin', value: '$' + profit.toFixed(2) }
        ],
        chartData: [
          { name: 'Merchant Base Cost', value: cost },
          { name: 'Gained Retail Margin', value: profit }
        ]
      };
    }
  },
  {
    id: 'customer-lifetime-value',
    name: 'Customer Lifetime Value Calculator',
    slug: 'customer-lifetime-value',
    category: 'business',
    description: 'Forecast the net present dollar value of a subscriber account based on purchasing frequencies and churn percentages.',
    formula: 'LTV = Average Order Volume * Purchase Frequency * Customer Lifespan Months',
    explanation: 'Helps SaaS operations evaluate the maximum amount they can spend to acquire a single customer while remaining profitable.',
    example: 'A customer spending $45 monthly who stays averaged over 18 semesters yields a $810 Lifetime Value.',
    inputs: [
      { id: 'arpu', label: 'Average Monthly Bill / ARPU ($/Month)', type: 'number', defaultValue: 35, min: 1 },
      { id: 'churnPct', label: 'Monthly Subscriber Churn Rate (%)', type: 'number', defaultValue: 4.5, min: 0.1, max: 99 }
    ],
    faq: [
      { question: 'What is subscriber churn rate?', answer: 'Churn rate is the percentage of your existing customer database that cancels their active monthly subscriptions during a given time period.' }
    ],
    relatedSlugs: ['cac-calc', 'roi-calc'],
    seoTitle: 'SaaS Customer Lifetime Value LTV Calculator',
    seoDescription: 'Project long-term subscriber profit payouts by matching monthly bill sizes with database churn rates.',
    calculate: (inputs) => {
      const arpu = Number(inputs.arpu || 35);
      const churn = Number(inputs.churnPct || 4.5) / 100;
      
      const expectedMonthsLifespan = 1 / churn;
      const ltvVal = arpu * expectedMonthsLifespan;
      return {
        results: [
          { label: 'Customer Lifetime Value (LTV)', value: '$' + ltvVal.toFixed(0), isPrimary: true },
          { label: 'Average User Lifespan', value: expectedMonthsLifespan.toFixed(1) + ' Months' },
          { label: 'Annual Contract Value equivalent', value: '$' + (arpu * 12).toLocaleString() }
        ],
        chartData: [
          { name: 'Monthly Base ARPU', value: arpu },
          { name: 'Expected LTV Pool', value: ltvVal }
        ]
      };
    }
  },
  {
    id: 'cac-calc',
    name: 'Customer Acquisition Calculator',
    slug: 'cac',
    category: 'business',
    description: 'Calculate Customer Acquisition Cost (CAC) by dividing total marketing outlays by physical sign-up counts.',
    formula: 'CAC = (Total Ad Costs + Staff Wages) / Net New Customers Acquired',
    explanation: 'Weighs business marketing channels efficiency, detailing advertising returns across PPC, social, and print campaigns.',
    example: 'Spending $5,000 on Facebook ads to acquire 125 active paying users results in a CAC value of exactly $40.00.',
    inputs: [
      { id: 'adSpent', label: 'Total Marketing Budget Spent ($)', type: 'number', defaultValue: 8000, min: 10 },
      { id: 'newSignups', label: 'Net New Customers Acquired', type: 'number', defaultValue: 250, min: 1 }
    ],
    faq: [
      { question: 'What is the target LTV to CAC ratio?', answer: 'Healthy growing businesses target an LTV:CAC ratio of at least 3:1, indicating customers spend triple what it costs to find them.' }
    ],
    relatedSlugs: ['customer-lifetime-value', 'roi-calc'],
    seoTitle: 'CAC Marketing Channel Acquisition Cost Calculator',
    seoDescription: 'Calculate the acquisition cost per signup to determine the efficiency of your marketing campaigns.',
    calculate: (inputs) => {
      const bill = Number(inputs.adSpent || 8000);
      const count = Number(inputs.newSignups || 250);
      const cac = bill / count;
      return {
        results: [
          { label: 'Customer Acquisition Cost (CAC)', value: '$' + cac.toFixed(2), isPrimary: true },
          { label: 'Marketing Efficiency rating', value: cac > 150 ? 'Premium/Niche acquisition' : cac > 40 ? 'Standard casual rate' : 'Highly Optimized Flow' }
        ],
        chartData: [
          { name: 'Single Acquisition Cost', value: cac }
        ]
      };
    }
  },
  {
    id: 'discount-calculator',
    name: 'Discount & Sales Tax Calculator',
    slug: 'discount',
    category: 'business',
    description: 'Calculate final retail costs of promotional items, incorporating multi-tier discount cuts and state sales taxes.',
    formula: 'Discounted Price = Base Price * (1 - Discount Rate)\nFinal Price = Discounted Price * (1 + Tax Rate)',
    explanation: 'Finds your final cost at the checkout register, preventing surprises from added sales taxes or overlapping discount coupons.',
    example: 'Buying a $120 coat running a 25% promo drop with state sales tax rated at 8% returns a final register charge of $97.20.',
    inputs: [
      { id: 'retailPrice', label: 'Base Item Retail Price ($)', type: 'number', defaultValue: 120, min: 1 },
      { id: 'discountPct', label: 'Store Discount Rate (%)', type: 'number', defaultValue: 20, min: 1, max: 99 },
      { id: 'taxPct', label: 'Local Government Sales Tax (%)', type: 'number', defaultValue: 8.5, min: 0, max: 25, step: 0.1 }
    ],
    faq: [
      { question: 'How do overlapping discounts work?', answer: 'Store systems rarely add percents together (like 20% + 10% = 30%). They instead apply discounts sequentially, multiplying the values.' }
    ],
    relatedSlugs: ['markup-profit', 'roi-calc'],
    seoTitle: 'Promotional Store Markdown & Sales Tax Calculator',
    seoDescription: 'Track register transaction charges by modeling product markdowns with state sales tax rates.',
    calculate: (inputs) => {
      const base = Number(inputs.retailPrice || 120);
      const disc = Number(inputs.discountPct || 20) / 100;
      const tax = Number(inputs.taxPct || 8.5) / 100;
      
      const discAmt = base * disc;
      const sub = base - discAmt;
      const taxAmt = sub * tax;
      const grandTotal = sub + taxAmt;
      return {
        results: [
          { label: 'Expected Checkout Cost', value: '$' + grandTotal.toFixed(2), isPrimary: true },
          { label: 'Saved Discount Pool', value: '$' + discAmt.toFixed(2) },
          { label: 'Government Sales Tax', value: '$' + taxAmt.toFixed(2) }
        ],
        chartData: [
          { name: 'Discount Saved', value: discAmt },
          { name: 'Register Total', value: grandTotal }
        ]
      };
    }
  },

  // ====================================== MANUFACTURING ======================================
  {
    id: 'oee-mfg',
    name: 'OEE Equipment Effectiveness Calculator',
    slug: 'oee-mfg',
    category: 'manufacturing',
    description: 'Calculate Overall Equipment Effectiveness (OEE) based on mechanical availability, speed performance, and product quality rates.',
    formula: 'OEE (%) = Availability (%) * Performance (%) * Quality (%)',
    explanation: 'Uses lean manufacturing principles to audit machine tool productivity, helping plant managers identify bottleneck sources on production lines.',
    example: 'A cnc milling node scoring 90% availability, run at 85% motor performance, producing 98% defect-free parts yields a 74.97% overall OEE score.',
    inputs: [
      { id: 'availPct', label: 'Availability Rate (%) (Uptime vs Planned)', type: 'number', defaultValue: 90, min: 10, max: 100 },
      { id: 'perfPct', label: 'Performance Speed Ratio (%) (Actual vs Design speed)', type: 'number', defaultValue: 85, min: 10, max: 100 },
      { id: 'qualPct', label: 'Quality Rate (%) (Good parts vs Total runs)', type: 'number', defaultValue: 98, min: 10, max: 100 }
    ],
    faq: [
      { question: 'What is a world-class OEE score?', answer: 'Typical factory lines average ~60% OEE. Highly optimized, world-class lean production plants target OEE scores above 85%.' }
    ],
    relatedSlugs: ['lead-time', 'cycle-time'],
    seoTitle: 'Lean Factory Overall Equipment OEE Metric Sizer',
    seoDescription: 'Calculate Overall Equipment Effectiveness by multiplying factory availability, machinery speeds, and scrap ratios.',
    calculate: (inputs) => {
      const av = Number(inputs.availPct || 90) / 100;
      const pf = Number(inputs.perfPct || 85) / 100;
      const ql = Number(inputs.qualPct || 98) / 100;
      const oee = av * pf * ql * 100;
      return {
        results: [
          { label: 'Overall Equipment Effectiveness (OEE)', value: oee.toFixed(2) + '%', isPrimary: true },
          { label: 'Manufacturing Waste Loss', value: (100 - oee).toFixed(2) + '%' },
          { label: 'Performance Classification', value: oee >= 85 ? 'World Class/Lean Standard' : oee >= 65 ? 'Reasonable Factory Output' : 'Severely Bottlenecked Operational Loss' }
        ],
        chartData: [
          { name: 'Active OEE', value: oee },
          { name: 'Lost Scrap/Stoppage', value: 100 - oee }
        ]
      };
    }
  },
  {
    id: 'lead-time',
    name: 'Manufacturing Lead Time Calculator',
    slug: 'lead-time',
    category: 'manufacturing',
    description: 'Calculate cumulative order-to-delivery lead times based on queuing, tooling, machining, and logistics steps.',
    formula: 'Lead Time = Order Logistics Processing + Tooling Queue + Machining Runs + Terminal Shipping',
    explanation: 'Maps industrial throughput timelines, assisting distribution managers with realistic client delivery estimates.',
    example: 'An order requiring 2 days office processing, 5 days on the machining queue, and 3 shipping transits averages a 10-day lead time.',
    inputs: [
      { id: 'procDays', label: 'Order Processing & Admin (Days)', type: 'number', defaultValue: 2, min: 0.1 },
      { id: 'queueDays', label: 'Machining Queue Wait (Days)', type: 'number', defaultValue: 4, min: 0.1 },
      { id: 'runDays', label: 'Active Part Machining/Build (Days)', type: 'number', defaultValue: 3, min: 0.1 },
      { id: 'shipDays', label: 'Transit Shipping & Delivery (Days)', type: 'number', defaultValue: 3, min: 0.1 }
    ],
    faq: [
      { question: 'How can Lead Times be compressed in production?', answer: 'Deploy Kanban scheduling, establish reliable local supply chains, remove inventory queues, and automate order bookings.' }
    ],
    relatedSlugs: ['oee-mfg', 'cycle-time'],
    seoTitle: 'Client Fulfillment Cumulative Lead Time Sizer',
    seoDescription: 'Calculate full order lead times by tracking queuing, active machining, and logistics transits.',
    calculate: (inputs) => {
      const proc = Number(inputs.procDays || 2);
      const queue = Number(inputs.queueDays || 4);
      const run = Number(inputs.runDays || 3);
      const ship = Number(inputs.shipDays || 3);
      const total = proc + queue + run + ship;
      return {
        results: [
          { label: 'Total Client Lead Time', value: total.toFixed(1) + ' Days', isPrimary: true },
          { label: 'Core Factory Floor Elapsed', value: (queue + run).toFixed(1) + ' Days' },
          { label: 'Outbound Logistics Ratio', value: ((ship / total) * 100).toFixed(0) + '%' }
        ],
        chartData: [
          { name: 'Admin', value: proc },
          { name: 'Queueing', value: queue },
          { name: 'Machining', value: run },
          { name: 'Logistics', value: ship }
        ]
      };
    }
  },
  {
    id: 'cycle-time',
    name: 'Cycle Time Calculator',
    slug: 'cycle-time',
    category: 'manufacturing',
    description: 'Calculate machinery cycle times using net operating hours and successful parts output volumes.',
    formula: 'Cycle Time = Net Operating Hours * 60 / Total Parts Produced',
    explanation: 'Tracks active hardware speeds. Highlights line performance, detailing minutes or seconds spent printing single units.',
    example: 'A factory line producing 120 vehicle components during an 8-hour shift ticks at a cycle speed of exactly 4.0 minutes per component.',
    inputs: [
      { id: 'shiftHours', label: 'Active Shift Operating Duration (Hours)', type: 'number', defaultValue: 8, min: 1 },
      { id: 'partsCount', label: 'Successful Parts Produced in Shift', type: 'number', defaultValue: 160, min: 1 }
    ],
    faq: [
      { question: 'What is Takt Time vs Cycle Time?', answer: 'Cycle time measures how fast your machines actually finish a part. Takt time is the speed limit required to match customer demand schedules (available time/customer orders).' }
    ],
    relatedSlugs: ['oee-mfg', 'lead-time'],
    seoTitle: 'Machinery Active Mechanical Cycle Time Tracker',
    seoDescription: 'Find machinery cycle speeds by tracking operating hours against shift component counts.',
    calculate: (inputs) => {
      const hrs = Number(inputs.shiftHours || 8);
      const parts = Number(inputs.partsCount || 160);
      
      const totalSeconds = hrs * 3600;
      const secondsPerPart = totalSeconds / parts;
      return {
        results: [
          { label: 'Finished Part Cycle Time', value: (secondsPerPart / 60).toFixed(2) + ' Minutes/part', isPrimary: true },
          { label: 'Speed rate in Seconds', value: Math.ceil(secondsPerPart) + ' Seconds/part' },
          { label: 'Expected Weekly Output capacity', value: Math.round(parts * 5).toLocaleString() + ' parts' }
        ],
        chartData: [
          { name: 'Single production loop', value: secondsPerPart }
        ]
      };
    }
  },
  {
    id: 'scrap-rate',
    name: 'Scrap Rate & Defect Cost Calculator',
    slug: 'scrap-rate',
    category: 'manufacturing',
    description: 'Calculate raw material scrap percentages and financial defect write-offs inside production plants.',
    formula: 'Scrap Rate (%) = Defective Units / Total Parts Run * 100',
    explanation: 'Highlights processing defects and quality variance issues, projecting annual scrap financial write-offs on materials.',
    example: 'Erecting 5,000 plastic housings with 150 failed castings generates a scrap rate of 3.0%, losing $3,000 in raw stock.',
    inputs: [
      { id: 'totalRun', label: 'Total Production Run Parts Count', type: 'number', defaultValue: 8000, min: 10 },
      { id: 'failedCount', label: 'Failed Defective Castings/Parts count', type: 'number', defaultValue: 160, min: 0 },
      { id: 'materialCost', label: 'Material Cost per Scrap Part ($)', type: 'number', defaultValue: 14, min: 0.1 }
    ],
    faq: [
      { question: 'What is a typical industrial scrap rate?', answer: 'Highly optimized precision injection molding targets scrap rates below 1%. Complex metal stamping can hit 3-5% before line fine-tuning.' }
    ],
    relatedSlugs: ['oee-mfg', 'cycle-time'],
    seoTitle: 'Production Line Defect Cost Scrap-rate Sizer',
    seoDescription: 'Calculate final factory scrap percentage rates and material financial waste costs.',
    calculate: (inputs) => {
      const run = Number(inputs.totalRun || 8000);
      const fail = Number(inputs.failedCount || 160);
      const price = Number(inputs.materialCost || 14);
      
      const scrap = (fail / run) * 100;
      const loss = fail * price;
      return {
        results: [
          { label: 'Total Scrap Rate %', value: scrap.toFixed(2) + '%', isPrimary: true },
          { label: 'Direct Material Financial Loss', value: '$' + loss.toLocaleString() },
          { label: 'Successful Yield', value: (100 - scrap).toFixed(2) + '%' }
        ],
        chartData: [
          { name: 'Successful parts', value: run - fail },
          { name: 'Scrapped parts', value: fail }
        ]
      };
    }
  },

  // ====================================== SCIENCE LAB ======================================
  {
    id: 'molarity-lab',
    name: 'Molarity Solution Chemistry Calculator',
    slug: 'molarity-lab',
    category: 'science-lab',
    description: 'Calculate required solute weights to achieve precise chemical molarity solutions in water.',
    formula: 'Molarity (M) = Moles of Solute / Liters of Solution\nRequired Mass (g) = Molarity (M) * Volume (L) * Solute Molar Mass (g/mol)',
    explanation: 'Aids lab technicians and university students preparing chemical reagents or custom buffers.',
    example: 'Generating 250 mL of a 0.5 M Sodium Chloride (Solute Mass 58.44) reagent requires exactly 7.30 grams of NaCl.',
    inputs: [
      { id: 'molarMass', label: 'Solute Molecular Weight (g/mol, e.g., NaCl ~58.44)', type: 'number', defaultValue: 58.44, min: 1 },
      { id: 'targetMolar', label: 'Target Molecular Concentration (Molarity M)', type: 'number', defaultValue: 0.5, min: 0.001, step: 0.05 },
      { id: 'volumeMl', label: 'Target Solution Volume Container (mL)', type: 'number', defaultValue: 500, min: 1, step: 10 }
    ],
    faq: [
      { question: 'What is molarity?', answer: 'Molarity (M) is a concentration score representing the moles of dissolved molecules per liter of aqueous solution.' }
    ],
    relatedSlugs: ['dilution-lab', 'ph-lab'],
    seoTitle: 'Scientific Chemical Solution Molarity weight Sizer',
    seoDescription: 'Find required chemical solute mass measurements using molecular weights and target laboratory volumes.',
    calculate: (inputs) => {
      const mass = Number(inputs.molarMass || 58.44);
      const conc = Number(inputs.targetMolar || 0.5);
      const vol = Number(inputs.volumeMl || 500) / 1000; // to liters
      
      const massGrams = conc * vol * mass;
      return {
        results: [
          { label: 'Solute Weight Needed', value: massGrams.toFixed(3) + ' grams', isPrimary: true },
          { label: 'Solute molar density', value: conc + ' mol/L' },
          { label: 'Water volume scaled', value: (vol * 1000).toFixed(0) + ' mL' }
        ],
        chartData: [
          { name: 'Water Base', value: vol * 1000 },
          { name: 'Solute Mass', value: massGrams }
        ]
      };
    }
  },
  {
    id: 'dilution-lab',
    name: 'Dilution Solution Sizer',
    slug: 'dilution-lab',
    category: 'science-lab',
    description: 'Scale stock chemical concentration parameters down using standard C1 * V1 = C2 * V2 scaling pathways.',
    formula: 'V1 = (C2 * V2) / C1\nAdded Buffer Volume = V2 - V1',
    explanation: 'Calculates the volume of high-concentration stock solution and distilled buffer water needed to achieve weaker target concentrations.',
    example: 'Diluting 10M Hydrochloric acid stock down to 2M to fill a 100 mL reaction flask requires 20 mL of stock combined with 80 mL of pure water.',
    inputs: [
      { id: 'stockConc', label: 'Stock Concentration (C1)', type: 'number', defaultValue: 10, min: 0.01 },
      { id: 'targetConc', label: 'Target Concentration (C2)', type: 'number', defaultValue: 2, min: 0.01 },
      { id: 'targetVolMl', label: 'Desired Target Volume (V2) (mL)', type: 'number', defaultValue: 200, min: 1 }
    ],
    faq: [
      { question: 'Does C1V1 = C2V2 work for all substances?', answer: 'Yes. The math relies on the law of conservation of mass, asserting the total moles of chemical solute remain unchanged when adding pure water.' }
    ],
    relatedSlugs: ['molarity-lab', 'ph-lab'],
    seoTitle: 'C1V1 Stock Solution Chemistry Dilution Sizer',
    seoDescription: 'Accurately size active stock volumes and water buffers to hit your target chemical concentrations.',
    calculate: (inputs) => {
      const c1 = Number(inputs.stockConc || 10);
      const c2 = Number(inputs.targetConc || 2);
      const v2 = Number(inputs.targetVolMl || 200);
      
      const v1 = (c2 * v2) / c1;
      const buffer = Math.max(0, v2 - v1);
      return {
        results: [
          { label: 'Required Stock Volume (V1)', value: v1.toFixed(1) + ' mL', isPrimary: true },
          { label: 'Pure Distilled Water Buffer', value: buffer.toFixed(1) + ' mL' },
          { label: 'Total Reagent volume', value: v2 + ' mL' }
        ],
        chartData: [
          { name: 'Active Stock volume', value: v1 },
          { name: 'Added distil Water', value: buffer }
        ]
      };
    }
  },
  {
    id: 'half-life-calc',
    name: 'Radioactive Half-Life Decay Calculator',
    slug: 'half-life-calc',
    category: 'science-lab',
    description: 'Calculate Isotope decay timelines and decay quantities based on starting masses and half-life cycles.',
    formula: 'Remaining Mass = Starting Mass * (0.5) ^ (Elapsed Time / Half-life Constant)',
    explanation: 'Models nuclear decomposition and pharmacokinetics drug clears under standard exponential waste equations.',
    example: 'An 80-gram chemical isotope carrying a 4-year half-life decomposes to only 20 grams after 8 years have passed.',
    inputs: [
      { id: 'startingMass', label: 'Isotope Beginning Mass (grams)', type: 'number', defaultValue: 100, min: 0.1 },
      { id: 'halfLifeSecs', label: 'Half-Life Cycle Constant (Days)', type: 'number', defaultValue: 15, min: 0.1 },
      { id: 'timePassed', label: 'Decay Time Elapsed (Days)', type: 'number', defaultValue: 30, min: 0 }
    ],
    faq: [
      { question: 'What is a cellular half-life?', answer: 'A cellular half-life models the time window required for a substance to reduce its atomic weight or biological efficacy by exactly 50%.' }
    ],
    relatedSlugs: ['molarity-lab', 'ph-lab'],
    seoTitle: 'Isotope Radioactive Exponential Decay Sizer',
    seoDescription: 'Model decay speeds of radioisotopes or pharmaceutical blood clearances using compound half-lifes.',
    calculate: (inputs) => {
      const start = Number(inputs.startingMass || 100);
      const hl = Number(inputs.halfLifeSecs || 15);
      const passed = Number(inputs.timePassed || 30);
      
      const remaining = start * Math.pow(0.5, passed / hl);
      const decomposed = start - remaining;
      return {
        results: [
          { label: 'Remaining Active mass', value: remaining.toFixed(3) + ' grams', isPrimary: true },
          { label: 'Decomposed scrap mass value', value: decomposed.toFixed(3) + ' grams' },
          { label: 'Disintegration Ratio', value: ((decomposed / start) * 100).toFixed(1) + '%' }
        ],
        chartData: [
          { name: 'Starting', value: start },
          { name: 'Remaining After Elapsed', value: remaining }
        ]
      };
    }
  },
  {
    id: 'ph-lab',
    name: 'pH Hydroxide concentration Calculator',
    slug: 'ph-lab',
    category: 'science-lab',
    description: 'Calculate solution acidity (pH) and alkalinity based on active Hydrogen [H+] ion molar concentrations.',
    formula: 'pH = -Log10( H+ Concentration )',
    explanation: 'Finds your solution\'s acidity or alkalinity on a logarithmic scale, helping you classify substances from battery acids to household lyes.',
    example: 'A pool hydrogen ion presence of 1.0x10^-7 moles per liter matches a neutral pH of exactly 7.0.',
    inputs: [
      { id: 'coPower', label: 'Negative Log Power (-x in 10^-x)', type: 'number', defaultValue: 7, min: 0, max: 15, step: 0.1 }
    ],
    faq: [
      { question: 'What does pH literally represent?', answer: 'pH translates directly as the "Potential of Hydrogen", tracing logarithmically the abundance of reactive H+ ions in your solution.' }
    ],
    relatedSlugs: ['molarity-lab', 'dilution-lab'],
    seoTitle: 'Aqueous pH Acidity logarithmic Calculator',
    seoDescription: 'Convert Hydrogen molarity densities into scientific chemistry pH scale indexes.',
    calculate: (inputs) => {
      const p = Number(inputs.coPower || 7);
      const hConc = Math.pow(10, -p);
      const pHVal = p; // exact math by definition
      
      let typeStr = 'Neutral Balance';
      if (pHVal < 6.5) typeStr = 'Strongly Acidic substance';
      else if (pHVal > 7.5) typeStr = 'Highly Alkaline standard';
      return {
        results: [
          { label: 'Calculated pH Level', value: pHVal.toFixed(1) + ' pH', isPrimary: true },
          { label: 'Solution acidity Type', value: typeStr },
          { label: 'Hydrogen Concentration', value: hConc.toExponential(3) + ' mol/L' }
        ],
        chartData: [
          { name: 'Acidity Index', value: pHVal },
          { name: 'Alkaline Scope', value: Math.max(0, 14 - pHVal) }
        ]
      };
    }
  },

  // ====================================== VIDEO PRODUCTION ======================================
  {
    id: 'bitrate-video',
    name: 'Video File Sizer & Bitrate Calculator',
    slug: 'bitrate-video',
    category: 'video-production',
    description: 'Calculate final video file size weights based on shooting time and bitrate selections.',
    formula: 'File Size (GB) = (Video Bitrate + Audio Bitrate) kbps * Duration Seconds / 8,000,000',
    explanation: 'Aids editors preparing exports, aligning raw footage outputs to upload bandwidth limits.',
    example: 'A 2-hour movie rendered at an average 8,000 kbps targets a 7.2 GB payload.',
    inputs: [
      { id: 'filmMins', label: 'Raw Movie Duration (Minutes)', type: 'number', defaultValue: 60, min: 1 },
      { id: 'bitrateV', label: 'Video Encoding Bitrate (kbps)', type: 'select', defaultValue: 5000, options: [
        { label: 'Basic SD web stream (1000 kbps)', value: 1000 },
        { label: 'High Quality HD Youtube (5000 kbps)', value: 5000 },
        { label: 'Broadcast 1080p stream (12000 kbps)', value: 12000 },
        { label: 'Ultra HD 4K high profile (25000 kbps)', value: 25000 }
      ]}
    ],
    faq: [
      { question: 'Why does audio count toward file sizes?', answer: 'Even high-definition videos pack stereo soundtracks. Typical audio streams (such as AAC at 256 kbps) must be bundled into raw file payloads.' }
    ],
    relatedSlugs: ['video-storage-cap', 'frame-rate'],
    seoTitle: 'Target Video Bitrate encoding File Sizer',
    seoDescription: 'Input duration and bitrates to plan video rendering sizes.',
    calculate: (inputs) => {
      const mins = Number(inputs.filmMins || 60);
      const vBit = Number(inputs.bitrateV || 5000);
      const secs = mins * 60;
      
      const totalKbits = (vBit + 256) * secs; // include standard 256kbps audio
      const bytes = (totalKbits * 1000) / 8;
      const totalGB = bytes / 1000000000;
      return {
        results: [
          { label: 'Estimated File Size', value: totalGB.toFixed(2) + ' GB', isPrimary: true },
          { label: 'Net active Kilobits', value: (vBit + 256).toLocaleString() + ' kbps' },
          { label: 'Theoretical megabytes sizing', value: (bytes / 1000000).toFixed(0) + ' MB' }
        ],
        chartData: [
          { name: 'Video stream', value: vBit },
          { name: 'Audio stream', value: 256 }
        ]
      };
    }
  },
  {
    id: 'aspect-ratio-calc',
    name: 'Resolution Aspect Ratio Calculator',
    slug: 'aspect-ratio-calc',
    category: 'video-production',
    description: 'Calculate and match image aspect ratios, scaling canvas resolutions cleanly.',
    formula: 'Aspect Ratio = GCD( Width, Height )',
    explanation: 'Tracks horizontal-to-vertical pixel proportions, preventing cropping or ugly black bars on YouTube or TikTok players.',
    example: 'An image measuring 1920 pixels wide by 1080 pixels high reduces to a standard 16:9 widescreen ratio.',
    inputs: [
      { id: 'pixW', label: 'Resolution Width (pixels)', type: 'number', defaultValue: 1920, min: 10 },
      { id: 'pixH', label: 'Resolution Height (pixels)', type: 'number', defaultValue: 1080, min: 10 }
    ],
    faq: [
      { question: 'What is a common social media ratio?', answer: 'Mobile devices use 9:16 vertical displays for Shorts/Reels, which is wide 1080x1920 HD screens rotated sideways.' }
    ],
    relatedSlugs: ['bitrate-video', 'video-storage-cap'],
    seoTitle: 'Widescreen Aspect Ratio Resolution Converter',
    seoDescription: 'Find pixel scale factors by dividing vertical and horizontal canvas structures.',
    calculate: (inputs) => {
      const w = Number(inputs.pixW || 1920);
      const h = Number(inputs.pixH || 1080);
      
      const gcd = (a: number, b: number): number => b ? gcd(b, a % b) : a;
      const factor = gcd(w, h);
      const ratioW = w / factor;
      const ratioH = h / factor;
      return {
        results: [
          { label: 'Calculated Aspect Ratio', value: ratioW + ':' + ratioH, isPrimary: true },
          { label: 'Total active Pixels count', value: ((w * h) / 1000000).toFixed(2) + ' Megapixels' }
        ],
        chartData: [
          { name: 'Width Ratio', value: ratioW },
          { name: 'Height Ratio', value: ratioH }
        ]
      };
    }
  },
  {
    id: 'video-storage-cap',
    name: 'Camera Storage Capacity Calculator',
    slug: 'video-storage-cap',
    category: 'video-production',
    description: 'Calculate standard shooting durations on flash cards based on camera resolutions and video formats.',
    formula: 'Storage Hours = Card Capacity GB / Sizer format GB per hour',
    explanation: 'Assists location camera crews planning their gear loads, ensuring they pack enough dynamic SanDisk memory cards.',
    example: 'An 64 GB SD card shooting compressed 1080p ProRes 422 (requires ~15 GB/hr) fills up in exactly 4.2 hours.',
    inputs: [
      { id: 'cardGb', label: 'Card Memory Capacity (GB)', type: 'number', defaultValue: 128, min: 8 },
      { id: 'camFormat', label: 'Camera Video Capture Format', type: 'select', defaultValue: 42, options: [
        { label: '4K ProRes 422 High Profile (~42 GB/hour)', value: 42 },
        { label: '1080p ProRes 422 Standard (~15 GB/hour)', value: 15 },
        { label: 'Highly compressed H264 MP4 (~2.5 GB/hour)', value: 2.5 }
      ]}
    ],
    faq: [
      { question: 'What is a high-speed card rate?', answer: 'Capturing uncompressed 4K formats requires fast write-speeds (like V90 or CFexpress), preventing frame drop errors on modern camera bodies.' }
    ],
    relatedSlugs: ['bitrate-video', 'aspect-ratio-calc'],
    seoTitle: 'Camera SD Card Shooting Hour Sizer',
    seoDescription: 'Find when your camera memory card overflows by modeling video formats against card capacities.',
    calculate: (inputs) => {
      const cap = Number(inputs.cardGb || 128);
      const rate = Number(inputs.camFormat || 42);
      
      const hours = cap / rate;
      return {
        results: [
          { label: 'Available Shooting Time', value: hours.toFixed(1) + ' Hours', isPrimary: true },
          { label: 'Hourly Sizer card demand', value: rate + ' GB/hour' },
          { label: 'Theoretical minutes remaining', value: Math.round(hours * 60) + ' minutes' }
        ],
        chartData: [
          { name: 'Enviably Used Capacity', value: cap }
        ]
      };
    }
  },
  {
    id: 'frame-rate',
    name: 'Time-Lapse Interval Calculator',
    slug: 'frame-rate',
    category: 'video-production',
    description: 'Calculate time-lapse shooting intervals, real-world recording durations, and final video clips lengths.',
    formula: 'Required Frames = Clip Duration Sec * Project Framerate fps\nShooting Time = Required Frames * Shooting Interval Sec',
    explanation: 'Guides nature documentary crews capturing cloud transits, telling them exactly how long to leave cameras shooting.',
    example: 'To yield a 10-second sunset clip played at 24fps with an interval of 5 seconds, leave your camera active for 20 minutes.',
    inputs: [
      { id: 'videoLengthSecs', label: 'Desired Output Clip Duration (Seconds)', type: 'number', defaultValue: 15, min: 1 },
      { id: 'fpsVal', label: 'Video Playback Frame-Rate (fps)', type: 'select', defaultValue: 24, options: [
        { label: '24 fps - Standard Cinematic track', value: 24 },
        { label: '30 fps - Smooth TV broadcast standard', value: 30 },
        { label: '60 fps - High Action Gaming fluid look', value: 60 }
      ]},
      { id: 'timeLapseInt', label: 'Shooting Interval Duration (Seconds)', type: 'number', defaultValue: 4, min: 0.5, step: 0.5 }
    ],
    faq: [
      { question: 'What are typical interval recommendations?', answer: 'Moving clouds demand fast 2-5 second intervals. Slow blooming flowers require long 10-20 minute intervals.' }
    ],
    relatedSlugs: ['bitrate-video', 'video-storage-cap'],
    seoTitle: 'Time-Lapse Shooting Interval Planning Sizer',
    seoDescription: 'Determine camera active durations needed to produce custom cinematic time-lapse clips.',
    calculate: (inputs) => {
      const len = Number(inputs.videoLengthSecs || 15);
      const fps = Number(inputs.fpsVal || 24);
      const interval = Number(inputs.timeLapseInt || 4);
      
      const rawFrames = len * fps;
      const netShootingSeconds = rawFrames * interval;
      const minutesActive = netShootingSeconds / 60;
      return {
        results: [
          { label: 'Required Shooting Time', value: minutesActive.toFixed(1) + ' Minutes', isPrimary: true },
          { label: 'Total Frames Captured', value: rawFrames + ' frames' },
          { label: 'Acceleration Factor ratio', value: (netShootingSeconds / len).toFixed(0) + 'x speedup' }
        ],
        chartData: [
          { name: 'Output speed play', value: len },
          { name: 'Camera active times', value: minutesActive * 60 }
        ]
      };
    }
  },

  // ====================================== SPORTS ======================================
  {
    id: 'pace-run',
    name: 'Running Pace Calculator',
    slug: 'pace-run',
    category: 'sports',
    description: 'Calculate required running speeds or split durations to complete marathons and sport target times.',
    formula: 'Time Per Mile = Total Time Minutes / Distance Miles',
    explanation: 'Ensures marathon runners and track athletes calibrate split pacing properly to crush their target race times.',
    example: 'Completing a standard 10 km (6.21 miles) race within 50 minutes requires operating at an 8:03 minute/mile pace.',
    inputs: [
      { id: 'runDist', label: 'Target Race Distance', type: 'select', defaultValue: '10k', options: [
        { label: '5k Running (3.11 miles)', value: '5k' },
        { label: '10k Running (6.21 miles)', value: '10k' },
        { label: 'Half Marathon (13.11 miles)', value: 'half' },
        { label: 'Full Marathon (26.22 miles)', value: 'full' }
      ]},
      { id: 'limitMins', label: 'Aimed Goal Target Duration (Minutes)', type: 'number', defaultValue: 55, min: 10 }
    ],
    faq: [
      { question: 'What is splits training?', answer: 'Splits tracking is logging single lap intervals (e.g., repeating 1-mile laps) to track cardiovascular fatigue throughout a long race.' }
    ],
    relatedSlugs: ['caloric-burn-sport', 'sleep-cycle'],
    seoTitle: 'Marathon Split Speed Running Pace Calculator',
    seoDescription: 'Find miles and kilometer paces needed to finish your next road race under target time goals.',
    calculate: (inputs) => {
      const distId = String(inputs.runDist || '10k');
      const targetMin = Number(inputs.limitMins || 55);
      
      let milesFloat = 6.21371;
      if (distId === '5k') milesFloat = 3.10686;
      else if (distId === 'half') milesFloat = 13.1094;
      else if (distId === 'full') milesFloat = 26.2188;
      
      const paceVal = targetMin / milesFloat;
      const paceMin = Math.floor(paceVal);
      const paceSec = Math.round((paceVal - paceMin) * 60);
      return {
        results: [
          { label: 'Target Running Pace', value: paceMin + ':' + (paceSec < 10 ? '0' : '') + paceSec + ' /mile', isPrimary: true },
          { label: 'Speed Equivalent mph', value: (60 / paceVal).toFixed(2) + ' mph' },
          { label: 'Speed Equivalent kph', value: ((60 / paceVal) * 1.60934).toFixed(2) + ' km/h' }
        ],
        chartData: [
          { name: 'Miles Float', value: milesFloat }
        ]
      };
    }
  },
  {
    id: 'caloric-burn-sport',
    name: 'Sports Caloric Burn Calculator',
    slug: 'caloric-burn-sport',
    category: 'sports',
    description: 'Calculate aerobic caloric burn rates across different sports using standard Metabolic Equivalent of Task (MET) multipliers.',
    formula: 'Calories Burned = MET Value * 3.5 * Weight kg / 200 * Duration Minutes',
    explanation: 'Calculates structural food energy burn metrics, evaluating metabolic outputs during sports like tennis, climbing, or swimming cycles.',
    example: 'An 180 lb athlete running intense basketball drills for 45 minutes burns approximately 521 calories.',
    inputs: [
      { id: 'bodyMassLbs', label: 'Body Mass Weight (Pounds)', type: 'number', defaultValue: 170, min: 40 },
      { id: 'sportAct', label: 'Sports Activity Selection', type: 'select', defaultValue: 8, options: [
        { label: 'Leisured Lap Swimming (MET ~6.0)', value: 6 },
        { label: 'Competitive Basketball (MET ~8.0)', value: 8 },
        { label: 'Running / Jogging 10 min/mile (MET ~9.8)', value: 9.8 },
        { label: 'Casual Bicycling/Spin (MET ~5.5)', value: 5.5 }
      ]},
      { id: 'elapsedMin', label: 'Activity Duration (Minutes)', type: 'number', defaultValue: 45, min: 1 }
    ],
    faq: [
      { question: 'What is a MET coefficient?', answer: 'MET models "Metabolic Equivalent of Task", rating biological oxygen costs during training against resting BMR rates.' }
    ],
    relatedSlugs: ['pace-run', 'water-intake'],
    seoTitle: 'Sports MET Cardio Calorie Burning Sizer',
    seoDescription: 'Contrast fitness sports to check expected cardiac calorie burns based on duration and weight.',
    calculate: (inputs) => {
      const lbs = Number(inputs.bodyMassLbs || 170);
      const met = Number(inputs.sportAct || 8);
      const duration = Number(inputs.elapsedMin || 45);
      
      const kg = lbs * 0.453592;
      const calBurnVal = met * 3.5 * kg / 200 * duration;
      return {
        results: [
          { label: 'Estimated Calories Burned', value: Math.round(calBurnVal) + ' kcal', isPrimary: true },
          { label: 'Average MET intensity', value: met + ' METs' },
          { label: 'Equivalent running miles burn', value: (calBurnVal / 110).toFixed(1) + ' miles' }
        ],
        chartData: [
          { name: 'Estimated Card Burn', value: calBurnVal }
        ]
      };
    }
  },
  {
    id: 'tournament-draw',
    name: 'Tournament Bracket Bracket Drawer',
    slug: 'tournament-draw',
    category: 'sports',
    description: 'Calculate tournament bracket brackets, identifying bye slots and game counts for single-elimination formats.',
    formula: 'Matches Count = Entries - 1\nNext Power of 2 - Entries = Bye slots required',
    explanation: 'Aids sport coaches and gaming league developers seeding competitive multiplayer draws.',
    example: 'Assembling a tournament with 11 competitors requires exactly 10 games, with 5 tournament bracket competitors receiving first-round byes.',
    inputs: [
      { id: 'playersNum', label: 'Competitive Players / Teams count', type: 'number', defaultValue: 12, min: 2, max: 256 }
    ],
    faq: [
      { question: 'Why are Bye slots necessary?', answer: 'Byes fill the first round, bringing remaining team counts to perfect powers of 2 (4, 8, 16, 32) so subsequent rounds run as perfect head-to-head pairs.' }
    ],
    relatedSlugs: ['pace-run', 'caloric-burn-sport'],
    seoTitle: 'Single Elimination Bye Slot & Match Bracket Sizer',
    seoDescription: 'Structure tournament grids and calculate first-round byes based on total entries.',
    calculate: (inputs) => {
      const p = Number(inputs.playersNum || 12);
      
      const matchTimes = p - 1;
      let powerVal = 2;
      while (powerVal < p) {
        powerVal *= 2;
      }
      const byesVal = powerVal - p;
      const rounds = Math.log2(powerVal);
      return {
        results: [
          { label: 'Required Match games', value: matchTimes + ' Matches', isPrimary: true },
          { label: 'First Round Bye Slots', value: byesVal + ' Byes' },
          { label: 'Total Tournament Rounds', value: rounds + ' rounds' }
        ],
        chartData: [
          { name: 'Competing Teams', value: p },
          { name: 'First Round Byes', value: byesVal }
        ]
      };
    }
  }
];
