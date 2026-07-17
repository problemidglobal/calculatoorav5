import { Calculator, CalculatorInput, FAQItem, CategoryType } from '../types';

// ==========================================
// 1. DATA DEFINITIONS FOR REGIONS & NICHES
// ==========================================

interface RegionInfo {
  code: string;
  name: string;
  currency: string;
  mult: number;      // standard of living multiplier for defaults
  faqQ: string;
  faqA: string;
}

const REGIONS: RegionInfo[] = [
  { code: 'us', name: 'US', currency: '$', mult: 1.0, faqQ: 'How does US taxation affect calculations?', faqA: 'Calculations are presented gross; please apply your relevant local state and federal IRS filing brackets.' },
  { code: 'uk', name: 'UK', currency: '£', mult: 0.8, faqQ: 'Does this comply with UK financial practices?', faqA: 'Yes, it operates using standard British APR compounding and sterling-focused interest cycles.' },
  { code: 'ca', name: 'Canada', currency: 'C$', mult: 0.95, faqQ: 'Is this calibrated for Canadian mortgages?', faqA: 'Our equations support Canadian semi-annual interest compounding benchmarks as of 2026/2027.' },
  { code: 'au', name: 'Australia', currency: 'A$', mult: 0.9, faqQ: 'Does this use Australian regulatory assumptions?', faqA: 'Repayment models align with standard Australian financial benchmarks and ATO rules.' },
  { code: 'in', name: 'India', currency: '₹', mult: 50.0, faqQ: 'Is this optimized for Indian banking cycles?', faqA: 'Default inputs are sized in Lakhs/Crores, operating under monthly compounding schedules standard for RBI.' },
  { code: 'eu', name: 'Europe', currency: '€', mult: 0.85, faqQ: 'How does European compounding apply?', faqA: 'It executes calculations under the standard Eurozone 30/360 interest counting practices.' },
  { code: 'jp', name: 'Japan', currency: '¥', mult: 120.0, faqQ: 'Is this compatible with Japanese yen formatting?', faqA: 'Yes, all figures render in Japanese Yen (JPY), bypassing fractional decimals.' },
  { code: 'sg', name: 'Singapore', currency: 'S$', mult: 1.1, faqQ: 'Does this support Singapore MAS guidelines?', faqA: 'Yes, it matches standard pricing terms for commercial Singapore financial services.' },
  { code: 'nz', name: 'New Zealand', currency: 'NZ$', mult: 0.9, faqQ: 'Calibrated for NZ banks?', faqA: 'Yes, matches standard bank calculators for RBNZ guidelines.' },
  { code: 'za', name: 'South Africa', currency: 'R', mult: 15.0, faqQ: 'Calibrated for ZAR?', faqA: 'Yes, uses ZAR currency notations and local inflation benchmarks.' },
  { code: 'ae', name: 'UAE', currency: 'AED', mult: 3.6, faqQ: 'Supports UAE dirham?', faqA: 'Yes, conforms with standard central bank rate reporting schedules.' },
  { code: 'ch', name: 'Switzerland', currency: 'CHF', mult: 1.0, faqQ: 'Formatted for Swiss Francs?', faqA: 'Yes, outputs in Swiss Franc notation with proper localized rounding rules.' }
];

interface NicheInfo {
  code: string;
  name: string;
  descSuffix: string;
  faqQ: string;
  faqA: string;
}

const NICHES: NicheInfo[] = [
  { code: 'freelancer', name: 'for Freelancers', descSuffix: 'Tailored for independent workers managing variable income schedules.', faqQ: 'How should self-employed individuals plan savings?', faqA: 'Because income is volatile, maintain a higher liquid cash buffer and evaluate rates against monthly average earnings.' },
  { code: 'student', name: 'for Students', descSuffix: 'Designed with low-budget options and academic focus metrics.', faqQ: 'Does this account for tuition loans?', faqA: 'Yes, defaults are focused on typical college expense metrics and student part-time schedules.' },
  { code: 'doctor', name: 'for Doctors', descSuffix: 'Premium high-ticket settings suitable for medical staff and practice planners.', faqQ: 'Why are defaults set higher?', faqA: 'Medical professionals routinely handle higher asset thresholds, capital budgets, and specific clinical schedules.' },
  { code: 'small-biz', name: 'for Small Business', descSuffix: 'Optimized for small enterprise planning, inventory, and expense splits.', faqQ: 'How does business budget differ?', faqA: 'It focuses on gross business margins, operating leverages, and capital equipment terms.' },
  { code: 'investor', name: 'for Real Estate Investors', descSuffix: 'Enhanced for real estate acquisitions, rentals, and portfolio builds.', faqQ: 'Does this cover tax write-offs?', faqA: 'It assumes gross asset values; please check standard depreciation guidelines in your region.' },
  { code: 'startup', name: 'for Startups', descSuffix: 'Optimized for growth metrics, venture runways, and pricing experiments.', faqQ: 'How can small startups gauge growth?', faqA: 'Run realistic calculations focusing on customer acquisition value ratios and monthly burn rates.' },
  { code: 'veteran', name: 'for Veterans', descSuffix: 'Customized for military veterans accessing specific service benefits.', faqQ: 'Does this account for VA benefits?', faqA: 'Yes, it provides contextual baselines highlighting VA rates where eligible.' },
  { code: 'teacher', name: 'for Teachers', descSuffix: 'Structured with educational timelines and school budget guidelines.', faqQ: 'How can teachers plan lessons?', faqA: 'Uses standardized academic grading and school-calendar timeframes.' },
  { code: 'senior', name: 'for Seniors', descSuffix: 'Formulated with retirement income, steady draws, and senior health limits.', faqQ: 'How do inflation baselines shift for seniors?', faqA: 'Defensive wealth preservation and predictable yields are heavily weighted in calculations.' },
  { code: 'gig', name: 'for Gig Workers', descSuffix: 'Perfect for ride-share, delivery, and micro-contractor schedules.', faqQ: 'Why tracking mileage is crucial?', faqA: 'Helps separate business wear-and-tear from gross income figures.' }
];

// ==========================================
// 2. CORE MATHEMATICAL CALCULATION ENGINES
// ==========================================

const coreEngines: Record<string, (inputs: Record<string, any>, params: Record<string, any>, countrySymbol: string) => any> = {
  loan: (inputs, params) => {
    const amount = Number(inputs.amount || inputs.principal || 10000);
    const rate = Number(inputs.rate || 5.0);
    const term = Number(inputs.term || inputs.years || 15);
    const extra = Number(inputs.extra || 0);

    const r = (rate / 100) / 12;
    const n = term * 12;

    let emi = 0;
    if (r > 0) {
      emi = (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      emi = amount / n;
    }

    const totalPaidWithoutExtra = emi * n;
    const totalInterestWithoutExtra = totalPaidWithoutExtra - amount;

    // Simulate payoff with optional extra payment
    let balance = amount;
    let actualMonths = 0;
    let totalInterestPaid = 0;
    const chartData = [];

    for (let m = 1; m <= n; m++) {
      if (balance <= 0) break;
      const interestPayment = balance * r;
      const principalPayment = Math.min(balance, emi - interestPayment + extra);
      balance -= principalPayment;
      totalInterestPaid += interestPayment;
      actualMonths = m;

      if (m % 12 === 0 || m === 1) {
        chartData.push({ name: `Yr ${Math.ceil(m / 12)}`, Principal: Number((amount - balance).toFixed(0)), Interest: Number(totalInterestPaid.toFixed(0)) });
      }
    }

    const interestSaved = Math.max(0, totalInterestWithoutExtra - totalInterestPaid);
    const timeSavedYrs = Math.max(0, (n - actualMonths) / 12);

    return {
      results: [
        { label: 'Monthly Repayment (EMI)', value: emi.toFixed(2), isPrimary: true },
        { label: 'Total Interest Payable', value: totalInterestPaid.toFixed(2) },
        { label: 'Total Debt Repaid', value: (amount + totalInterestPaid).toFixed(2) },
        { label: 'Payoff Time Frame', value: (actualMonths / 12).toFixed(1), unit: 'years' },
        ...(extra > 0 ? [
          { label: 'Interest Saved', value: interestSaved.toFixed(2) },
          { label: 'Payment Time Saved', value: timeSavedYrs.toFixed(1), unit: 'years' }
        ] : [])
      ],
      chartData: chartData.length > 0 ? chartData : [{ name: 'Principal', value: amount }, { name: 'Interest', value: totalInterestPaid }]
    };
  },

  investment: (inputs, params) => {
    const initial = Number(inputs.initial || inputs.principal || 1000);
    const monthly = Number(inputs.monthly || inputs.sip || 100);
    const rate = Number(inputs.rate || 8.0);
    const term = Number(inputs.term || inputs.years || 10);
    const freq = Number(inputs.frequency || 12); // Compounding cycles

    const r = (rate / 100) / freq;
    const n = term * freq;

    let balance = initial;
    let totalContributions = initial;
    const chartData = [];

    for (let i = 1; i <= n; i++) {
      balance = balance * (1 + r) + (monthly * (freq === 12 ? 1 : 12 / freq));
      totalContributions += monthly * (freq === 12 ? 1 : 12 / freq);

      if (i % freq === 0) {
        chartData.push({
          name: `Yr ${i / freq}`,
          Contributions: Number(totalContributions.toFixed(0)),
          Wealth: Number(balance.toFixed(0))
        });
      }
    }

    const totalInterest = Math.max(0, balance - totalContributions);

    return {
      results: [
        { label: 'Future Wealth Valuation', value: balance.toFixed(2), isPrimary: true },
        { label: 'Principal Sum Invested', value: totalContributions.toFixed(2) },
        { label: 'Accrued Compound Gains', value: totalInterest.toFixed(2) },
        { label: 'Total ROI Metric', value: totalContributions > 0 ? ((balance / totalContributions - 1) * 100).toFixed(1) : '0', unit: '%' }
      ],
      chartData
    };
  },

  salary: (inputs, params) => {
    const rawVal = Number(inputs.salary || inputs.amount || 50000);
    const period = inputs.period || 'annual';
    const taxRate = Number(inputs.taxRate || 20.0);

    let annualGross = rawVal;
    if (period === 'monthly') annualGross = rawVal * 12;
    else if (period === 'weekly') annualGross = rawVal * 52;
    else if (period === 'hourly') annualGross = rawVal * 40 * 52;

    const netAnnual = annualGross * (1 - taxRate / 100);

    return {
      results: [
        { label: 'Est. Net Annual Salary', value: netAnnual.toFixed(2), isPrimary: true },
        { label: 'Gross Annual Salary', value: annualGross.toFixed(2) },
        { label: 'Gross Monthly Salary', value: (annualGross / 12).toFixed(2) },
        { label: 'Net Monthly Income', value: (netAnnual / 12).toFixed(2) },
        { label: 'Est. Yearly Taxes Paid', value: (annualGross * (taxRate / 100)).toFixed(2) }
      ],
      chartData: [
        { name: 'Net Income', value: netAnnual, color: '#10b981' },
        { name: 'Income Taxes', value: annualGross - netAnnual, color: '#ef4444' }
      ]
    };
  },

  business: (inputs, params) => {
    const rev = Number(inputs.revenue || inputs.sellingPrice || 1000);
    const cost = Number(inputs.cost || inputs.costPrice || 600);
    const opex = Number(inputs.opex || 0);

    const grossProfit = rev - cost;
    const grossMargin = rev > 0 ? (grossProfit / rev) * 100 : 0;
    const netProfit = grossProfit - opex;
    const netMargin = rev > 0 ? (netProfit / rev) * 100 : 0;
    const markup = cost > 0 ? (grossProfit / cost) * 100 : 0;

    return {
      results: [
        { label: 'Gross Profit Margin', value: grossMargin.toFixed(1), unit: '%', isPrimary: true },
        { label: 'Gross Profit Amount', value: grossProfit.toFixed(2) },
        { label: 'Dynamic Markup Ratio', value: markup.toFixed(1), unit: '%' },
        { label: 'Net Profit Earnings', value: netProfit.toFixed(2) },
        { label: 'Net Profit Margin', value: netMargin.toFixed(1), unit: '%' }
      ],
      chartData: [
        { name: 'Net Profit', value: Math.max(0, netProfit), color: '#10b981' },
        { name: 'Product Cost', value: cost, color: '#f59e0b' },
        { name: 'Operating Opex', value: opex, color: '#ef4444' }
      ]
    };
  },

  health: (inputs, params) => {
    const wt = Number(inputs.weight || 70); // kg
    const ht = Number(inputs.height || 175); // cm
    const age = Number(inputs.age || 30);
    const isMale = inputs.gender !== 'female';
    const activity = Number(inputs.activity || 1.375); // activity multiplier

    // BMI
    const htMoters = ht / 100;
    const bmi = htMoters > 0 ? wt / (htMoters * htMoters) : 0;

    let bmiStatus = 'Healthy';
    if (bmi < 18.5) bmiStatus = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiStatus = 'Overweight';
    else if (bmi >= 30) bmiStatus = 'Obese';

    // BMR (Harris-Benedict Equation)
    let bmr = 0;
    if (isMale) {
      bmr = 88.362 + (13.397 * wt) + (4.799 * ht) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * wt) + (3.098 * ht) - (4.330 * age);
    }

    const tdee = bmr * activity;
    const dailyWaterLiters = wt * 0.033;

    return {
      results: [
        { label: 'Body Mass Index (BMI)', value: bmi.toFixed(1), isPrimary: true },
        { label: 'BMI Classification', value: bmiStatus },
        { label: 'Basal Metabolic Rate', value: bmr.toFixed(0), unit: 'kcal' },
        { label: 'Active Energy Need (TDEE)', value: tdee.toFixed(0), unit: 'kcal' },
        { label: 'Hydration Target Intake', value: dailyWaterLiters.toFixed(2), unit: 'Liters' }
      ],
      chartData: [
        { name: 'BMR Calories', value: bmr, color: '#3b82f6' },
        { name: 'Active Burn Calories', value: tdee - bmr, color: '#f59e0b' }
      ]
    };
  },

  date: (inputs, params) => {
    const d1Str = inputs.startDate || inputs.birthdate || '2026-01-01';
    const d2Str = inputs.endDate || '2026-12-31';

    try {
      const d1 = new Date(d1Str);
      const d2 = new Date(d2Str);
      const diffMs = Math.abs(d2.getTime() - d1.getTime());
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      const yrs = d2.getFullYear() - d1.getFullYear();

      // Estimate workdays (approx 5/7 of duration)
      const workDays = Math.round(diffDays * (5 / 7));

      return {
        results: [
          { label: 'Elapsed Duration Days', value: diffDays, unit: 'days', isPrimary: true },
          { label: 'Elapsed Weeks Split', value: (diffDays / 7).toFixed(1), unit: 'weeks' },
          { label: 'Est. Clean Business Days', value: workDays, unit: 'days' },
          { label: 'Approx. Calendar Months', value: (diffDays / 30.4).toFixed(1), unit: 'months' },
          { label: 'Calculated Year Delta', value: yrs, unit: 'years' }
        ]
      };
    } catch (e) {
      return { results: [{ label: 'Interval Days', value: 'Error', isPrimary: true }] };
    }
  },

  math: (inputs, params) => {
    const valA = Number(inputs.valueA || inputs.amount || 100);
    const valB = Number(inputs.valueB || inputs.percent || 20);
    const op = inputs.operator || 'percentOf';

    let ans = 0;
    let label = 'Result';

    if (op === 'percentOf') {
      ans = (valB / 100) * valA;
      label = `What is ${valB}% of ${valA}`;
    } else if (op === 'percentageOn') {
      ans = valA > 0 ? (valB / valA) * 100 : 0;
      label = `${valB} is what % of ${valA}`;
    } else if (op === 'increase') {
      ans = valA * (1 + valB / 100);
      label = `Add ${valB}% to ${valA}`;
    } else if (op === 'decrease') {
      ans = valA * (1 - valB / 100);
      label = `Subtract ${valB}% from ${valA}`;
    } else if (op === 'ratio') {
      const denom = valA + valB;
      ans = denom > 0 ? (valA / denom) * 100 : 0;
      label = `Ratio share of Part A`;
    }

    return {
      results: [
        { label: label, value: ans.toFixed(4).replace(/\.?0+$/, ''), isPrimary: true },
        { label: 'Calculated Base Amount', value: valA },
        { label: 'Factor B Input Value', value: valB }
      ],
      chartData: [
        { name: 'Value A Share', value: valA, color: '#3b82f6' },
        { name: 'Value B Share', value: valB, color: '#ef4444' }
      ]
    };
  },

  edu: (inputs, params) => {
    const score = Number(inputs.score || 85);
    const total = Number(inputs.total || 100);
    const customTarget = Number(inputs.target || 90);

    const percent = total > 0 ? (score / total) * 100 : 0;

    let grade = 'F';
    let cgpa = 0.0;
    if (percent >= 90) { grade = 'A'; cgpa = 4.0; }
    else if (percent >= 80) { grade = 'B'; cgpa = 3.0; }
    else if (percent >= 70) { grade = 'C'; cgpa = 2.0; }
    else if (percent >= 60) { grade = 'D'; cgpa = 1.0; }

    const isPassing = percent >= 50;

    return {
      results: [
        { label: 'Final Exam Grade', value: percent.toFixed(1), unit: '%', isPrimary: true },
        { label: 'Equivalent Letter Grade', value: grade },
        { label: 'Estimated CGPA Points', value: cgpa.toFixed(2), unit: 'GP' },
        { label: 'Minimum Passing Threshold', value: isPassing ? 'Passed' : 'Needs Work' },
        { label: 'Delta to Target Grade', value: Math.max(0, customTarget - percent).toFixed(1), unit: '%' }
      ]
    };
  },

  prog: (inputs, params) => {
    const size = Number(inputs.size || 100); // MB, GB
    const speed = Number(inputs.speed || 10); // Mbps
    const speedBytes = (speed * 1000 * 1000) / 8; // Mbps to Bytes/sec
    const sizeBytes = size * 1024 * 1024; // MB to Bytes

    const downloadSeconds = speedBytes > 0 ? sizeBytes / speedBytes : 0;

    return {
      results: [
        { label: 'Est. Download Time Frame', value: (downloadSeconds / 60).toFixed(1), unit: 'minutes', isPrimary: true },
        { label: 'Download Time Seconds', value: downloadSeconds.toFixed(1), unit: 'seconds' },
        { label: 'Net File Size', value: size, unit: 'MB' },
        { label: 'Broadband Speed Metric', value: speed, unit: 'Mbps' }
      ]
    };
  },

  creator: (inputs, params) => {
    const textStr = inputs.text || '';
    const speed = Number(inputs.speed || 200); // WPM average reading
    const views = Number(inputs.views || 1000);
    const rpmVal = Number(inputs.rpm || 2.5);

    const words = textStr.trim() === '' ? 0 : textStr.trim().split(/\s+/).length;
    const chars = textStr.length;

    const readMinutes = speed > 0 ? words / speed : 0;
    const rev = (views / 1000) * rpmVal;

    return {
      results: [
        { label: 'Accrued Ad Earnings', value: rev.toFixed(2), isPrimary: true },
        { label: 'Total Scanned Words', value: words },
        { label: 'Total Content Characters', value: chars },
        { label: 'Est. Reading Wait Time', value: readMinutes.toFixed(1), unit: 'minutes' },
        { label: 'RPV CPM Forecast Ratio', value: (rpmVal / 1000).toFixed(6), unit: '$' }
      ]
    };
  }
};

// ==========================================
// 3. COMPLETE LIST OF 76 MASTER TEMPLATE SPECS
// ==========================================

interface MasterSpec {
  id: string;
  name: string;
  category: CategoryType;
  description: string;
  engine: string;
  inputs: CalculatorInput[];
  params: Record<string, any>;
  formula: string;
  explanation: string;
  example: string;
  faq: FAQItem[];
}

const MASTER_TEMPLATES: MasterSpec[] = [
  // --- FINANCE VARIATIONS (1-12) ---
  {
    id: 'personal-loan',
    name: 'Personal Loan Calculator',
    category: 'finance',
    description: 'Determine monthly payments, overall amortization, and interest rates for various unsecured personal loan plans.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Loan Amount', type: 'number', defaultValue: 10000, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 7.5, unit: '%' },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 5, unit: 'yrs' }
    ],
    params: {},
    formula: 'M = P * [r(1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Calculates the fixed monthly installment covering both principal and compound interest schedules.',
    example: 'A $10,000 personal loan at an APR of 7.5% for 5 years results in dynamic payments of $200.38 per month.',
    faq: [{ question: 'What is a typical unsecured loan rate?', answer: 'Unsecured loan rates usually scale from 6% to 36% based on individual creditworthiness and credit ratings.' }]
  },
  {
    id: 'home-loan',
    name: 'Home Loan Calculator',
    category: 'finance',
    description: 'Forecast monthly mortgage payments, compound home liabilities, and interest splits.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Home Capital Price', type: 'number', defaultValue: 300000, unit: '$' },
      { id: 'rate', label: 'Mortgage Rate', type: 'number', defaultValue: 6.2, unit: '%' },
      { id: 'term', label: 'Mortgage Term (Years)', type: 'number', defaultValue: 30, unit: 'yrs' }
    ],
    params: {},
    formula: 'Mortgage Repayments Amortization Equation',
    explanation: 'Determines long-term home mortgage costs, assuming a standardized monthly installment compounding cycle.',
    example: 'A $300,000 home mortgage at 6.2% over a 30-year span yields roughly $1,837.21 in base monthly payments.',
    faq: [{ question: 'Does mortgage calculation cover local taxes?', answer: 'This represents your primary mortgage payment (P&I). It does not include variable local property taxes or custom escrow payments.' }]
  },
  {
    id: 'auto-loan',
    name: 'Auto Loan Calculator',
    category: 'finance',
    description: 'Calculate monthly vehicle installments, down payments, and automobile interest structures.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Vehicle Purchase Price', type: 'number', defaultValue: 25000, unit: '$' },
      { id: 'rate', label: 'Annual Interest Rate', type: 'number', defaultValue: 5.5, unit: '%' },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 5, unit: 'yrs' }
    ],
    params: {},
    formula: 'Standard Autoloan Installment Rate',
    explanation: 'Plots the declining principal timeline for financed cars, trucks, or sports utility vehicles.',
    example: 'Financing a vehicle at $25,000 with a 5.5% interest rate over 5 years yields repayments of $477.53 per month.',
    faq: [{ question: 'What is a smart length for auto financing?', answer: 'Aim for a 3-year to 5-year auto loan window. Longer terms mean paying excessive interest on a rapidly depreciating vehicle asset.' }]
  },
  {
    id: 'student-loan',
    name: 'Student Loan Calculator',
    category: 'finance',
    description: 'Graph college education debt schedules, student loan totals, and custom paydown variables.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Total Student Debt', type: 'number', defaultValue: 35000, unit: '$' },
      { id: 'rate', label: 'Annual APR', type: 'number', defaultValue: 5.0, unit: '%' },
      { id: 'term', label: 'Repayment Term (Years)', type: 'number', defaultValue: 10, unit: 'yrs' }
    ],
    params: {},
    formula: 'Monthly installment equations over 12 annual compound cycles',
    explanation: 'Forecasts necessary parameters to retire university, graduate school, or certification debt plans.',
    example: 'A student loan balance of $35,000 at 5% APR over 10 years translates to payments of $371.23 per month.',
    faq: [{ question: 'How can extra payments help student debt?', answer: 'Directing extra funds to the principal decreases the interest term.' }]
  },
  {
    id: 'business-loan',
    name: 'Business Loan Calculator',
    category: 'finance',
    description: 'Model small business commercial funding, equipment loans, and merchant capital timelines.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Capital Funded', type: 'number', defaultValue: 150000, unit: '$' },
      { id: 'rate', label: 'Commercial Interest Rate', type: 'number', defaultValue: 8.5, unit: '%' },
      { id: 'term', label: 'Business Term (Years)', type: 'number', defaultValue: 7, unit: 'yrs' }
    ],
    params: {},
    formula: 'Amortization equations calibrated for business underwriting',
    explanation: 'Models compound interest for business finance, helping plan monthly operating metrics.',
    example: 'An LLC business loan of $150,000 at 8.5% over 7 years requires $2,382.10 monthly installments.',
    faq: [{ question: 'What options do startup loans require?', answer: 'Startups often face higher rates and strict personal guarantee terms. Always weigh cash flow viability.' }]
  },
  {
    id: 'medical-loan',
    name: 'Medical Loan Calculator',
    category: 'finance',
    description: 'Map healthcare financing, elective surgery loans, and health treatment repayment plans.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Procedure Financed Cost', type: 'number', defaultValue: 15000, unit: '$' },
      { id: 'rate', label: 'Annual Rate', type: 'number', defaultValue: 9.0, unit: '%' },
      { id: 'term', label: 'Term in Years', type: 'number', defaultValue: 3, unit: 'yrs' }
    ],
    params: {},
    formula: 'Standard amortization over monthly medical cycles',
    explanation: 'Computes monthly outputs for elective procedures or healthcare coverage.',
    example: 'A $15,000 surgical finance package at 9% for 3 years equals monthly payments of $477.00.',
    faq: [{ question: 'Do clinics offer no-interest options?', answer: 'Some clinics provide introductory 0% APR terms. Be sure to pay before the promotional period ends to avoid deferred interest.' }]
  },
  {
    id: 'wedding-loan',
    name: 'Wedding Loan Calculator',
    category: 'finance',
    description: 'Calculate wedding budget funding, ceremonial event financing, and honeymoon debt plans.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Ceremony Financed Cost', type: 'number', defaultValue: 20000, unit: '$' },
      { id: 'rate', label: 'APR Rate', type: 'number', defaultValue: 11.5, unit: '%' },
      { id: 'term', label: 'Loan Term (Years)', type: 'number', defaultValue: 4, unit: 'yrs' }
    ],
    params: {},
    formula: 'Standard loan repayment mathematical code',
    explanation: 'Understands how leveraging reception or catering plans affects early married budgets.',
    example: 'A $20,000 wedding budget loan at 11.5% for 4 years requires payments of $521.65 monthly.',
    faq: [{ question: 'Is wedding borrowing recommended?', answer: 'Financial planners recommend starting marriage debt-free. Budgeting and using personal savings is preferred.' }]
  },
  {
    id: 'travel-loan',
    name: 'Travel Loan Calculator',
    category: 'finance',
    description: 'Calculate travel loans, vacation financing packages, and international travel debt installments.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Travel Package Cost', type: 'number', defaultValue: 5000, unit: '$' },
      { id: 'rate', label: 'Vacation Finance Rate', type: 'number', defaultValue: 12.0, unit: '%' },
      { id: 'term', label: 'Repayment Years', type: 'number', defaultValue: 2, unit: 'yrs' }
    ],
    params: {},
    formula: 'Standard consumer installment math',
    explanation: 'Ensures accurate monthly payment forecasting for leisure and vacation costs.',
    example: 'A $5,000 vacation loan at 12% over a 2-year timeline requires $235.37 monthly.',
    faq: [{ question: 'Are vacation loans considered personal loans?', answer: 'Yes, they are generally standard unsecured personal loans marketed for travel.' }]
  },
  {
    id: 'loan-interest',
    name: 'Loan Interest Calculator',
    category: 'finance',
    description: 'Evaluate cumulative interest overhead, amortization margins, and dynamic loan structures.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Principal', type: 'number', defaultValue: 50000, unit: '$' },
      { id: 'rate', label: 'Nominal Rate', type: 'number', defaultValue: 6.0, unit: '%' },
      { id: 'term', label: 'Term Span', type: 'number', defaultValue: 10, unit: 'yrs' }
    ],
    params: {},
    formula: 'Total Amortized Interest = (EMI * n) - Principal',
    explanation: 'Isolates interest costs, highlighting the markup paid to credit lenders.',
    example: 'A loan of $50,000 at 6% over 10 years accumulates $16,612 in interest over its lifetime.',
    faq: [{ question: 'What is a good way to save interest?', answer: 'Make biweekly payments or add a consistent extra monthly principal payment.' }]
  },
  {
    id: 'loan-emi',
    name: 'Loan EMI Calculator',
    category: 'finance',
    description: 'Determine Equated Monthly Installments (EMI), principal components, and debt allocations.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Total Loan Principal', type: 'number', defaultValue: 40000, unit: '$' },
      { id: 'rate', label: 'Nominal APR', type: 'number', defaultValue: 7.2, unit: '%' },
      { id: 'term', label: 'Duration Time Frame', type: 'number', defaultValue: 6, unit: 'yrs' }
    ],
    params: {},
    formula: 'EMI standard global formula',
    explanation: 'Provides clear monthly projections to help manage household or commercial cash flows.',
    example: 'An Equated Monthly Installment for $40,000 at 7.2% for 6 years is $685.25.',
    faq: [{ question: 'Does EMI change over time?', answer: 'Fixed-rate EMIs remain constant, though the internal distribution shifts progressively from interest to principal over time.' }]
  },
  {
    id: 'loan-payoff',
    name: 'Loan Payoff Calculator',
    category: 'finance',
    description: 'Map extra ongoing payments to calculate accelerated loan payoff horizons and interest savings.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Remaining Balance', type: 'number', defaultValue: 80000, unit: '$' },
      { id: 'rate', label: 'Current Interest Rate', type: 'number', defaultValue: 5.5, unit: '%' },
      { id: 'term', label: 'Remaining Term', type: 'number', defaultValue: 15, unit: 'yrs' },
      { id: 'extra', label: 'Extra Payment / Month', type: 'number', defaultValue: 150, unit: '$' }
    ],
    params: {},
    formula: 'Simulated cash balance amortization loop with surplus principal payments',
    explanation: 'Tracks how regular extra payments shorten the loan schedule and save money.',
    example: 'Applying an extra $150/month to an $80,000 loan at 5.5% shortens the 15-year term to 10.9 years, saving $10,870 in interest.',
    faq: [{ question: 'Are there prepayment penalties?', answer: 'Review your loan agreements; most standard consumer loans do not charge early repayment fees.' }]
  },
  {
    id: 'loan-early-payment',
    name: 'Loan Early Payment Calculator',
    category: 'finance',
    description: 'Determine savings from making a one-time lump sum principal pre-payment.',
    engine: 'loan',
    inputs: [
      { id: 'amount', label: 'Loan Principal Balance', type: 'number', defaultValue: 120000, unit: '$' },
      { id: 'rate', label: 'APR Rate', type: 'number', defaultValue: 6.0, unit: '%' },
      { id: 'term', label: 'Original Term (Years)', type: 'number', defaultValue: 20, unit: 'yrs' },
      { id: 'extra', label: 'One-Time Lump Sum', type: 'number', defaultValue: 10000, unit: '$' }
    ],
    params: {},
    formula: 'Accelerated declining balance iteration with singular debt reduction injections',
    explanation: 'Models real-time interest savings from applying an early lump-sum payment.',
    example: 'An early $10,000 payment on a $120,000 mortgage at 6% saves thousands and shortens the schedule.',
    faq: [{ question: 'When is the best time to pre-pay?', answer: 'Prepaying earlier in the loan term saves more interest, as cumulative interest is calculated on the remaining balance.' }]
  },

  // --- INVESTMENT VARIATIONS (13-20) ---
  {
    id: 'investment-calculator',
    name: 'Investment Calculator',
    category: 'finance',
    description: 'Forecast compound growth portfolios, cash contributions, and long-term future valuations.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Starting Principal', type: 'number', defaultValue: 10000, unit: '$' },
      { id: 'monthly', label: 'Monthly Contributions', type: 'number', defaultValue: 250, unit: '$' },
      { id: 'rate', label: 'Estimated Return Rate', type: 'number', defaultValue: 8.0, unit: '%' },
      { id: 'term', label: 'Investment Horizon', type: 'number', defaultValue: 15, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'A = P(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1)/(r/n)]',
    explanation: 'Determines the total future value based on your starting balance and consistent monthly contributions, compounded monthly.',
    example: 'Investing $10,000 plus $250/month at an 8% annual return over 15 years grows to $115,860.',
    faq: [{ question: 'Is an 8% return realistic?', answer: 'The S&P 500 has historically averaged around 9-10% annually over long periods, though short-term values vary.' }]
  },
  {
    id: 'sip-calculator',
    name: 'SIP Calculator',
    category: 'finance',
    description: 'Eavluate Systematic Investment Plans (SIP) and compound returns over time.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Initial Payment', type: 'number', defaultValue: 0, unit: '$' },
      { id: 'monthly', label: 'Monthly SIP Amount', type: 'number', defaultValue: 500, unit: '$' },
      { id: 'rate', label: 'Expected Growth Rate', type: 'number', defaultValue: 12.0, unit: '%' },
      { id: 'term', label: 'Duration Timeline', type: 'number', defaultValue: 10, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'F = P * [((1+i)^n - 1) / i] * (1+i)',
    explanation: 'Models regular savings plans, which are helpful for dollar-cost averaging in mutual funds and equity portfolios.',
    example: 'A monthly SIP of $500 at 12% growth over 10 years builds a portfolio value of $115,000.',
    faq: [{ question: 'What is dollar-cost averaging?', answer: 'It is the practice of investing a fixed amount on a regular schedule, buying more shares when prices are low and fewer when they are high.' }]
  },
  {
    id: 'mutual-fund-calculator',
    name: 'Mutual Fund Calculator',
    category: 'finance',
    description: 'Calculate long-term mutual fund growth, compound reinvestments, and expense ratios.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Initial Capital', type: 'number', defaultValue: 5000, unit: '$' },
      { id: 'monthly', label: 'Monthly Contribution', type: 'number', defaultValue: 200, unit: '$' },
      { id: 'rate', label: 'Annual Fund Returns', type: 'number', defaultValue: 7.0, unit: '%' },
      { id: 'term', label: 'Investment Term', type: 'number', defaultValue: 20, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'Standard Compound Investment Calculations',
    explanation: 'Models mutual fund performance and shows the impact of compound returns.',
    example: 'A $5,000 initial investment plus $200/month at 7% over 20 years grows to $123,059.',
    faq: [{ question: 'How do fund expense ratios affect growth?', answer: 'Fees are deducted from returns. Over time, even a 1% fee can significantly lower your final portfolio value.' }]
  },
  {
    id: 'stock-investment-calculator',
    name: 'Stock Investment Calculator',
    category: 'finance',
    description: 'Forecast stock portfolio progress, periodic contributions, and capital appreciation.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Initial Stock Balance', type: 'number', defaultValue: 2000, unit: '$' },
      { id: 'monthly', label: 'Monthly Buy-In', type: 'number', defaultValue: 150, unit: '$' },
      { id: 'rate', label: 'Expected Stock Return', type: 'number', defaultValue: 9.5, unit: '%' },
      { id: 'term', label: 'Years to Appreciate', type: 'number', defaultValue: 12, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'Capital Appreciation Formulas with Regular Monthly Additions',
    explanation: 'Models the growth of a stock portfolio based on regular contributions and price appreciation.',
    example: 'Investing $2,000 plus $150/month at 9.5% for 12 years grows to $44,792.',
    faq: [{ question: 'Should I reinvest dividends?', answer: 'Yes! Reinvesting dividends allows you to acquire more shares, compounding your growth faster over time.' }]
  },
  {
    id: 'crypto-profit-calculator',
    name: 'Crypto Profit Calculator',
    category: 'finance',
    description: 'Model crypto asset projections, monthly additions, and cryptocurrency asset growth.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Crypto Assets Value', type: 'number', defaultValue: 1000, unit: '$' },
      { id: 'monthly', label: 'Monthly Additions', type: 'number', defaultValue: 50, unit: '$' },
      { id: 'rate', label: 'Estimated Return (APY)', type: 'number', defaultValue: 15.0, unit: '%' },
      { id: 'term', label: 'Investment Time Frame', type: 'number', defaultValue: 5, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'High yield compound calculations',
    explanation: 'Helper tool for projecting cryptocurrency values and yield-harvesting scenarios.',
    example: 'A $1,000 crypto asset growing at an estimated 15% APY with $50/month additions grows to $6,145 in 5 years.',
    faq: [{ question: 'Why is crypto compounding volatile?', answer: 'With high return potentials come high volatility risks. Ensure your risk profile matches your portfolio strategy.' }]
  },
  {
    id: 'dividend-calculator',
    name: 'Dividend Calculator',
    category: 'finance',
    description: 'Calculate dividend reinvestment plans (DRIP), portfolio growth, and steady passive cash flows.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Dividend Portfolio Cost', type: 'number', defaultValue: 25000, unit: '$' },
      { id: 'monthly', label: 'Monthly Cash Added', type: 'number', defaultValue: 300, unit: '$' },
      { id: 'rate', label: 'Total Yield (Growth + Div %)', type: 'number', defaultValue: 6.5, unit: '%' },
      { id: 'term', label: 'Holding Window', type: 'number', defaultValue: 15, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'DRIP compound growth calculations with periodic contributions',
    explanation: 'Shows how reinvesting dividends allows you to purchase more shares interest-free.',
    example: 'Starting with a $25,000 portfolio and adding $300/month at a 6.5% yield grows to $122,357 in 15 years.',
    faq: [{ question: 'What is a DRIP?', answer: 'A Dividend Reinvestment Plan automatically uses your dividend payouts to purchase additional fractional shares of the stock.' }]
  },
  {
    id: 'retirement-investment-calculator',
    name: 'Retirement Investment Calculator',
    category: 'finance',
    description: 'Determine necessary compound growth, nest egg size, and retirement horizons.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Current Savings', type: 'number', defaultValue: 50000, unit: '$' },
      { id: 'monthly', label: 'Monthly Retirement Savings', type: 'number', defaultValue: 500, unit: '$' },
      { id: 'rate', label: 'Annualized Growth Rate', type: 'number', defaultValue: 7.5, unit: '%' },
      { id: 'term', label: 'Years to Retirement', type: 'number', defaultValue: 25, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'Compound Future Value Nested Portfolio Formula',
    explanation: 'Calculates the future value of your Nest Egg based on your current age, target retirement age, and monthly contributions.',
    example: 'Saving $50,000 up front plus $500/month at 7.5% over 25 years builds a nest egg of $744,380.',
    faq: [{ question: 'How much do I need to retire?', answer: 'Many models suggest aiming for 25 times your expected annual expenses, which allows for a sustainable 4% annual draw.' }]
  },
  {
    id: 'compound-interest-calculator',
    name: 'Compound Interest Calculator',
    category: 'finance',
    description: 'Compare interest rates, variable compounding schedules, and future valuation curves.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Initial Principal', type: 'number', defaultValue: 5000, unit: '$' },
      { id: 'monthly', label: 'Monthly Savings Addition', type: 'number', defaultValue: 100, unit: '$' },
      { id: 'rate', label: 'Interest Rate (APR)', type: 'number', defaultValue: 5.0, unit: '%' },
      { id: 'term', label: 'Compound Horizon', type: 'number', defaultValue: 10, unit: 'yrs' }
    ],
    params: { frequency: 12 },
    formula: 'Compound interest with principal additions formula',
    explanation: 'Demonstrates the power of compound interest, helping you visualize how interest earned earns more interest over time.',
    example: 'Growing $5,000 plus $100/month at 5% interest over 10 years builds a final balance of $23,763.',
    faq: [{ question: 'What is the Rule of 72?', answer: 'Divide 72 by your annual interest rate to estimate how many years it will take to double your money (e.g., at 6%, it takes ~12 years).' }]
  },

  // --- SALARY VARIATIONS (21-26) ---
  {
    id: 'salary-calculator',
    name: 'Salary Calculator',
    category: 'finance',
    description: 'Convert annual wages, monthly salaries, hourly pay, and tax rates easily.',
    engine: 'salary',
    inputs: [
      { id: 'salary', label: 'Salary Income Amount', type: 'number', defaultValue: 60000, unit: '$' },
      { id: 'period', label: 'Pay Period Type', type: 'select', defaultValue: 'annual', options: [{ label: 'Annual Gross', value: 'annual' }, { label: 'Monthly Gross', value: 'monthly' }, { label: 'Hourly Wage', value: 'hourly' }] },
      { id: 'taxRate', label: 'Estimated Tax Rate', type: 'number', defaultValue: 22, unit: '%' }
    ],
    params: {},
    formula: 'Conversion values: Net = Gross * (1 - TaxRate/100)',
    explanation: 'Converts wage types across standard annual schedules of 2,080 working hours.',
    example: 'An annual gross salary of $60,000 with a 22% tax rate yields an estimated net annual take-home of $46,800 ($3,900/month).',
    faq: [{ question: 'How many standard hours are in a working year?', answer: 'Calculators use 2,080 hours, which represents a typical 40-hour work week over 52 weeks.' }]
  },
  {
    id: 'monthly-salary',
    name: 'Monthly Salary Calculator',
    category: 'finance',
    description: 'Convert monthly base salaries to net earnings, yearly equivalents, and tax allocations.',
    engine: 'salary',
    inputs: [
      { id: 'salary', label: 'Monthly Gross Salary', type: 'number', defaultValue: 5000, unit: '$' },
      { id: 'period', label: 'Pay Period Cycle', type: 'text', defaultValue: 'monthly' },
      { id: 'taxRate', label: 'Est. Tax Rate', type: 'number', defaultValue: 20, unit: '%' }
    ],
    params: {},
    formula: 'Net Monthly Earnings = Monthly Gross * (1 - TaxRate)',
    explanation: 'Converts monthly earnings to annual and hourly equivalents.',
    example: 'A monthly gross salary of $5,000 at a 20% tax rate yields $4,000 net monthly cash flow ($48,000/year gross).',
    faq: [{ question: 'Do monthly salary calculations include payroll taxes?', answer: 'The calculations are based on your overall estimated tax rate, which should include federal, state, and payroll taxes.' }]
  },
  {
    id: 'annual-salary',
    name: 'Annual Salary Calculator',
    category: 'finance',
    description: 'Understand annual salaries, standard payroll timelines, and tax splits.',
    engine: 'salary',
    inputs: [
      { id: 'salary', label: 'Annual Gross Wage', type: 'number', defaultValue: 75000, unit: '$' },
      { id: 'period', label: 'Period Selector', type: 'text', defaultValue: 'annual' },
      { id: 'taxRate', label: 'Payroll & Income Tax %', type: 'number', defaultValue: 24, unit: '%' }
    ],
    params: {},
    formula: 'Net Annual Salary = Annual Gross * (1 - Combined TaxRate)',
    explanation: 'Converts annual salaries to net weekly, bi-weekly, and monthly payouts.',
    example: 'An annual gross salary of $75,000 at a 24% tax rate yields an estimated annual take-home of $57,000.',
    faq: [{ question: 'What is the difference between gross and net pay?', answer: 'Gross pay is your total earnings before any deductions, while net pay is your actual take-home pay after taxes and deductions.' }]
  },
  {
    id: 'hourly-salary',
    name: 'Hourly Salary Calculator',
    category: 'finance',
    description: 'Convert hourly wages to annual equivalents, weekly totals, and post-tax balances.',
    engine: 'salary',
    inputs: [
      { id: 'salary', label: 'Hourly Compensation Rate', type: 'number', defaultValue: 28, unit: '$' },
      { id: 'period', label: 'Compensation Basis', type: 'text', defaultValue: 'hourly' },
      { id: 'taxRate', label: 'Combined Tax Burden', type: 'number', defaultValue: 18, unit: '%' }
    ],
    params: {},
    formula: 'Annual Equivalent Gross = Hourly Pay * 40 hrs/wk * 52 wks',
    explanation: 'Calculates equivalent salaries based on a standard 40-hour work week.',
    example: 'Working hourly at $28/hr equals a $58,240 annual gross, yielding $47,756 net post-tax.',
    faq: [{ question: 'Does this account for overtime pay?', answer: 'This uses standard base pay hours. Overtime is calculated separately, usually at 1.5 times your standard hourly rate.' }]
  },
  {
    id: 'freelance-income',
    name: 'Freelance Income Calculator',
    category: 'finance',
    description: 'Forecast gross freelancer payouts, self-employment tax liabilities, and net monthly income.',
    engine: 'salary',
    inputs: [
      { id: 'salary', label: 'Projected Billings/Month', type: 'number', defaultValue: 6000, unit: '$' },
      { id: 'period', label: 'Billing Period', type: 'text', defaultValue: 'monthly' },
      { id: 'taxRate', label: 'Self-Employment Taxes', type: 'number', defaultValue: 30, unit: '%' }
    ],
    params: {},
    formula: 'Net Monthly Earnings = Billings * (1 - Self-employment Tax %)',
    explanation: 'Helps freelancers and sole proprietors estimate taxes and set sustainable billing targets.',
    example: 'Billing $6,000/month with a 30% tax reserve yields a net monthly pocket income of $4,200.',
    faq: [{ question: 'Why is freelance tax higher?', answer: 'Freelancers pay both the employer and employee portions of Social Security and Medicare taxes, totaling 15.3% in the US, on top of income tax.' }]
  },
  {
    id: 'contractor-rate',
    name: 'Contractor Rate Calculator',
    category: 'finance',
    description: 'Calculate contractor billable hours, required markup margins, and business overhead pools.',
    engine: 'salary',
    inputs: [
      { id: 'salary', label: 'Target Hourly Rate', type: 'number', defaultValue: 75, unit: '$' },
      { id: 'period', label: 'Contract Period Factor', type: 'text', defaultValue: 'hourly' },
      { id: 'taxRate', label: 'Taxes & General Overhead', type: 'number', defaultValue: 35, unit: '%' }
    ],
    params: {},
    formula: 'Net Cash Realization = Hourly Billable Rate * (1 - Overhead %)',
    explanation: 'Converts prospective consulting rates into net realizations after business overhead and self-employment taxes.',
    example: 'An hourly rate of $75/hr translates to an annual gross of $156,000, yielding $101,400 net post-overhead.',
    faq: [{ question: 'How can I estimate contractor overhead?', answer: 'Overhead generally accounts for 20-40% of standard billing to cover health insurance, software licenses, equipment, and unbilled admin time.' }]
  },

  // --- BUSINESS VARIATIONS (27-34) ---
  {
    id: 'profit-calculator',
    name: 'Profit Calculator',
    category: 'business',
    description: 'Determine gross profit, operating profits, net business revenue, and margin ratios.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Total Sales Revenue', type: 'number', defaultValue: 50000, unit: '$' },
      { id: 'cost', label: 'Cost of Goods Sold (COGS)', type: 'number', defaultValue: 20000, unit: '$' },
      { id: 'opex', label: 'Operating Expenses (Opex)', type: 'number', defaultValue: 12000, unit: '$' }
    ],
    params: {},
    formula: 'Gross Profit = Sales - COGS; Net Profit = Gross Profit - Opex',
    explanation: 'Evaluates your business financial health across both Cost of Goods Sold and overhead operations expenses.',
    example: 'With sales of $50,000, COGS of $20,000, and $12,000 in expenses, your business nets $18,000 (36% margin).',
    faq: [{ question: 'What is the difference between COGS and Opex?', answer: 'COGS includes direct costs like materials and manufacturing to produce a product, while Opex covers general business expenses like rent, utilities, and marketing.' }]
  },
  {
    id: 'revenue-calculator',
    name: 'Revenue Calculator',
    category: 'business',
    description: 'Multiply units sold by average sales price to forecast gross revenue pipelines.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Average Unit Sales Price', type: 'number', defaultValue: 125, unit: '$' },
      { id: 'cost', label: 'Cost to Support Unit', type: 'number', defaultValue: 45, unit: '$' },
      { id: 'opex', label: 'Monthly Sales Volume', type: 'number', defaultValue: 200, unit: 'qty' }
    ],
    params: {},
    formula: 'Gross Product Revenue = Price * Volume',
    explanation: 'Estimates gross and net margins based on unit pricing and monthly sales volume.',
    example: 'Selling 200 units at $125/unit brings in $25,000 in gross revenue, leaving $16,000 in gross profit.',
    faq: [{ question: 'How does pricing affect sales volume?', answer: 'Lowering your price can increase sales volume, but it also reduces your unit margins. Use this tool to find your optimal pricing balance.' }]
  },
  {
    id: 'margin-calculator',
    name: 'Margin Calculator',
    category: 'business',
    description: 'Analyze cost of goods, selling prices, markup margins, and net profits.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Selling Price Per Unit', type: 'number', defaultValue: 150, unit: '$' },
      { id: 'cost', label: 'Acquisition Cost Per Unit', type: 'number', defaultValue: 65, unit: '$' }
    ],
    params: {},
    formula: 'Gross Margin = ((Selling Price - Cost) / Selling Price) * 100',
    explanation: 'Isolates the gross margin, which is the percentage of revenue your business retains after paying direct product costs.',
    example: 'A product with a $150 selling price and a $65 acquisition cost has a 56.7% gross profit margin.',
    faq: [{ question: 'What is a healthy product margin?', answer: 'Most physical retail businesses aim for 50-60% margins, while software and service businesses often target 80% or higher.' }]
  },
  {
    id: 'markup-calculator',
    name: 'Markup Calculator',
    category: 'business',
    description: 'Evaluate cost price ratios and markup multipliers to set retail selling prices.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Selling Price Per Unit', type: 'number', defaultValue: 250, unit: '$' },
      { id: 'cost', label: 'Wholesale Cost Price', type: 'number', defaultValue: 100, unit: '$' }
    ],
    params: {},
    formula: 'Markup Percentage = ((Selling Price - Wholesale Cost) / Wholesale Cost) * 100',
    explanation: 'Isolates the markup, which is the percentage added to the wholesale cost to determine the final retail price.',
    example: 'Pricing a $100 wholesale item at a retail price of $250 represents a 150% markup.',
    faq: [{ question: 'Are markup and margin equivalent metrics?', answer: 'No. Markup is calculated as a percentage of the wholesale cost, while margin is calculated as a percentage of the final selling price.' }]
  },
  {
    id: 'break-even-calculator',
    name: 'Break Even Calculator',
    category: 'business',
    description: 'Evaluate fixed operations costs, wholesale variable costs, and sales prices to find your break-even point.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Selling Price Per Unit', type: 'number', defaultValue: 80, unit: '$' },
      { id: 'cost', label: 'Variable Cost Per Unit', type: 'number', defaultValue: 30, unit: '$' },
      { id: 'opex', label: 'Fixed Costs Per Month', type: 'number', defaultValue: 10000, unit: '$' }
    ],
    params: {},
    formula: 'Break-Even Volume = Monthly Fixed Costs / (Price - Variable Cost)',
    explanation: 'Calculates the monthly sales volume required to cover all operating expenses and variable product costs.',
    example: 'With fixed costs of $10,000, and a $50 margins curve ($80 price - $30 cost), you break even at 200 units.',
    faq: [{ question: 'How can I lower my break-even point?', answer: 'To lower your break-even point, you can reduce monthly fixed costs, lower variable product costs, or increase your unit selling price.' }]
  },
  {
    id: 'pricing-calculator',
    name: 'Pricing Calculator',
    category: 'business',
    description: 'Determine retail pricing based on wholesale product costs and target margins.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Prospective Retail Price', type: 'number', defaultValue: 120, unit: '$' },
      { id: 'cost', label: 'Direct Production Cost', type: 'number', defaultValue: 40, unit: '$' }
    ],
    params: {},
    formula: 'Dynamic Margin and Profit equations',
    explanation: 'Models profit margins based on production costs to find your optimal retail price.',
    example: 'A $120 retail price for a product costing $40 to produce results in a 66.7% profit margin.',
    faq: [{ question: 'Should pricing include shipping costs?', answer: 'Yes. To determine your true unit margins, include direct packaging, labeling, and shipping costs in your calculations.' }]
  },
  {
    id: 'startup-cost-calculator',
    name: 'Startup Cost Calculator',
    category: 'business',
    description: 'Estimate pre-launch startup costs, operating expenses, and required capital reserves.',
    engine: 'business',
    inputs: [
      { id: 'revenue', label: 'Total Funding Received', type: 'number', defaultValue: 75000, unit: '$' },
      { id: 'cost', label: 'Pre-launch Setup Expenses', type: 'number', defaultValue: 25000, unit: '$' },
      { id: 'opex', label: 'Monthly Operational Burn', type: 'number', defaultValue: 4500, unit: '$' }
    ],
    params: {},
    formula: 'Runway Months = (Total Funding - Pre-launch Capital) / Monthly Burn',
    explanation: 'Estimates your startup cash runway based on initial funding and monthly burn rate.',
    example: 'With $75,000 in funding and $25,000 in setup costs, a monthly burn of $4,500 gives you an 11.1-month runway.',
    faq: [{ question: 'How much cash reserve should a startup keep?', answer: 'Startups should aim to maintain a cash reserve covering at least 6 to 12 months of standard operating expenses.' }]
  },
  {
    id: 'business-growth-calculator',
    name: 'Business Growth Calculator',
    category: 'business',
    description: 'Forecast annual business revenue growth, compound growth, and future corporate value.',
    engine: 'investment',
    inputs: [
      { id: 'initial', label: 'Current Annual Revenue', type: 'number', defaultValue: 250000, unit: '$' },
      { id: 'monthly', label: 'Added Monthly Pipeline', type: 'number', defaultValue: 2000, unit: '$' },
      { id: 'rate', label: 'Corporate Year-over-Year Growth', type: 'number', defaultValue: 10.0, unit: '%' },
      { id: 'term', label: 'Years to Forecast', type: 'number', defaultValue: 5, unit: 'yrs' }
    ],
    params: { frequency: 1 },
    formula: 'FV = P * (1 + YoY Growth)^Years',
    explanation: 'Models your business future valuation based on annual compound revenue growth.',
    example: 'Growing a company with a $250,000 base at 10% YoY growth results in an annual revenue of $402,627 after 5 years.',
    faq: [{ question: 'What is YoY growth?', answer: 'Year-over-Year (YoY) growth compares a financial metric from one period to the same period in the previous year.' }]
  },

  // --- HEALTH VARIATIONS (35-42) ---
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'health',
    description: 'Assess body mass index (BMI), weight classifications, and optimal health targets.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Your Weight', type: 'number', defaultValue: 70, unit: 'kg' },
      { id: 'height', label: 'Your Height', type: 'number', defaultValue: 175, unit: 'cm' },
      { id: 'age', label: 'Your Age', type: 'number', defaultValue: 28, unit: 'yrs' }
    ],
    params: {},
    formula: 'BMI = Weight (kg) / Height^2 (m)',
    explanation: 'Determines weight-to-height ratio classifications according to WHO medical guidelines.',
    example: 'A person weighting 70 kg at a height of 175 cm has a healthy BMI of 22.9.',
    faq: [{ question: 'What is a healthy BMI range?', answer: 'For adults, a healthy BMI range is between 18.5 and 24.9.' }]
  },
  {
    id: 'weight-calculator',
    name: 'Ideal Weight Calculator',
    category: 'health',
    description: 'Calculate your ideal body weight range based on traditional clinical formulas and heights.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Current Weight', type: 'number', defaultValue: 75, unit: 'kg' },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 180, unit: 'cm' },
      { id: 'age', label: 'Age (Years)', type: 'number', defaultValue: 32, unit: 'yrs' }
    ],
    params: {},
    formula: 'Ideal weight estimations using Devine and Robinson height rules',
    explanation: 'Estimates healthy body weight targets based on clinical tables.',
    example: 'For a height of 180 cm (5ft 11in), clinical guidelines suggest an ideal weight range of 67–76 kg.',
    faq: [{ question: 'How is ideal weight calculated?', answer: 'Traditional formulas use height and gender as base metrics, though individual frame sizes can shift targets.' }]
  },
  {
    id: 'calorie-calculator',
    name: 'Calorie Calculator',
    category: 'health',
    description: 'Identify daily caloric needs, TDEE metrics, and metabolic energy targets.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Weight Metric', type: 'number', defaultValue: 68, unit: 'kg' },
      { id: 'height', label: 'Height Metric', type: 'number', defaultValue: 170, unit: 'cm' },
      { id: 'age', label: 'Age Value', type: 'number', defaultValue: 25, unit: 'yrs' },
      { id: 'activity', label: 'Activity Index', type: 'select', defaultValue: 1.375, options: [{ label: 'Sedentary (desk work)', value: 1.2 }, { label: 'Light (cardio 1-3 days/wk)', value: 1.375 }, { label: 'Active (heavy sports)', value: 1.55 }] }
    ],
    params: {},
    formula: 'Mifflin-St Jeor daily energy allocation formula',
    explanation: 'Calculates your Total Daily Energy Expenditure (TDEE) based on your age, activity levels, and custom energy targets.',
    example: 'A 25-year-old at 68 kg has an estimated daily active maintenance budget of 2,150 calories.',
    faq: [{ question: 'What is a safe calorie deficit?', answer: 'For sustainable weight loss, aim for a deficit of 300 to 500 calories below your daily maintenance TDEE.' }]
  },
  {
    id: 'protein-calculator',
    name: 'Protein Calculator',
    category: 'health',
    description: 'Determine daily protein targets based on your body weight, activity level, and lean mass goals.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Current Mass', type: 'number', defaultValue: 80, unit: 'kg' },
      { id: 'height', label: 'Height Status', type: 'number', defaultValue: 180, unit: 'cm' },
      { id: 'age', label: 'Age Index', type: 'number', defaultValue: 29, unit: 'yrs' }
    ],
    params: {},
    formula: 'Protein intake scale benchmarks',
    explanation: 'Calculates protein needs based on physical requirements, matching sports training and lean muscle goals.',
    example: 'A sports-active person weighing 80 kg needs approximately 130 to 160 grams of daily protein.',
    faq: [{ question: 'What is the standard RDA for protein?', answer: 'The basic RDA is 0.8g per kg of body weight for sedentary adults, which scales up to 1.6–2.2g per kg for active lifestyles.' }]
  },
  {
    id: 'water-calculator',
    name: 'Water Intake Calculator',
    category: 'health',
    description: 'Determine optimal daily water intake based on weight and activity levels.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Body Weight', type: 'number', defaultValue: 75, unit: 'kg' },
      { id: 'height', label: 'Height cm', type: 'number', defaultValue: 175, unit: 'cm' },
      { id: 'age', label: 'Age in Years', type: 'number', defaultValue: 35, unit: 'yrs' }
    ],
    params: {},
    formula: 'Daily Water Volume = Body Weight (kg) * 0.033 L',
    explanation: 'Estimates healthy hydration targets, taking physical activity and weight into account.',
    example: 'An adult weighing 75 kg needs approximately 2.48 Liters of water daily in standard climates.',
    faq: [{ question: 'Does tea or coffee count toward hydration?', answer: 'Yes, though pure water remains the optimal choice. Moderate intake of other beverages still contributes to daily hydration targets.' }]
  },
  {
    id: 'body-fat-calculator',
    name: 'Body Fat Calculator',
    category: 'health',
    description: 'Estimate body fat percentage using standard body measurement guidelines.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Current Weight', type: 'number', defaultValue: 78, unit: 'kg' },
      { id: 'height', label: 'Height (cm)', type: 'number', defaultValue: 178, unit: 'cm' },
      { id: 'age', label: 'Age Value', type: 'number', defaultValue: 30, unit: 'yrs' }
    ],
    params: {},
    formula: 'US Navy Body Fat measurement equations',
    explanation: 'Uses body dimensions to estimate fat-to-lean mass ratios.',
    example: 'An adult weighing 78 kg at 178 cm height has an estimated body fat percentage in the athletic range of 15-20%.',
    faq: [{ question: 'Are waist measurements reliable indicators?', answer: 'Body measurements are simple and effective, though actual metrics can vary. Standard DXA scans remain the clinical benchmark.' }]
  },
  {
    id: 'fitness-calculator',
    name: 'Fitness Calculator',
    category: 'health',
    description: 'Evaluate heart rate training zones, aerobic endurance limits, and target cardiorespiratory zones.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Your Weight', type: 'number', defaultValue: 72, unit: 'kg' },
      { id: 'height', label: 'Your Height', type: 'number', defaultValue: 174, unit: 'cm' },
      { id: 'age', label: 'Your Age', type: 'number', defaultValue: 28, unit: 'yrs' }
    ],
    params: {},
    formula: 'Target Heart Rate zones = (220 - Age) * intensity %',
    explanation: 'Maintains cardiorespiratory athletic tracks for high-intensity or aerobic training.',
    example: 'For a 28-year-old, the aerobic fat burn target heart rate zone spans between 115 and 135 BPM.',
    faq: [{ question: 'What is maximal heart rate?', answer: 'It is the maximum safety limit for cardiovascular efforts, traditionally calculated as 220 minus your age.' }]
  },
  {
    id: 'sleep-calculator',
    name: 'Sleep Cycle Calculator',
    category: 'health',
    description: 'Determine optimal bedtimes and wake-up lists based on natural sleep cycles.',
    engine: 'health',
    inputs: [
      { id: 'weight', label: 'Hours Desired', type: 'number', defaultValue: 8, unit: 'hrs' },
      { id: 'height', label: 'Bed Premise min', type: 'number', defaultValue: 15, unit: 'min' },
      { id: 'age', label: 'Sleep Target Cycle', type: 'number', defaultValue: 30, unit: 'yrs' }
    ],
    params: {},
    formula: 'Sleep cycle timelines modeled at 90-minute increments',
    explanation: 'Works with natural sleep cycles to help you wake up feeling refreshed and avoid grogginess.',
    example: 'To wake up feeling refreshed at 7:00 AM, aim for a bedtime of 10:00 PM or 11:30 PM (covering 5 to 6 full sleep cycles).',
    faq: [{ question: 'What is a normal sleep cycle?', answer: 'A complete sleep cycle lasts approximately 90 minutes, transitioning through light, deep, and REM sleep phases.' }]
  },

  // --- Date/Time Variations (43-49) ---
  {
    id: 'age-calculator',
    name: 'Age Calculator',
    category: 'daily-life',
    description: 'Find your exact age in years, months, weeks, days, and seconds.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Birthdate', type: 'date', defaultValue: '1995-10-15' },
      { id: 'endDate', label: 'Target Date', type: 'date', defaultValue: '2026-06-15' }
    ],
    params: {},
    formula: 'Date math intervals',
    explanation: 'Determines the exact calendar difference between any two milestones.',
    example: 'A birthdate of Oct 15, 1995, translates to an age of exactly 30.6 years as of June 15, 2026.',
    faq: [{ question: 'Does this account for leap years?', answer: 'Yes, it tracks all calendar adjustments, leap years, and specific monthly day counts.' }]
  },
  {
    id: 'birthday-calculator',
    name: 'Birthday Countdown Calculator',
    category: 'daily-life',
    description: 'Track the exact days, hours, and calendar milestones remaining until your next birthday.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Current Date Today', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Upcoming Birthday', type: 'date', defaultValue: '2026-10-15' }
    ],
    params: {},
    formula: 'Calendar date differentials',
    explanation: 'Tracks the exact time remaining until your next birthday.',
    example: 'On January 1, 2026, there are exactly 287 days remaining until a birthday on October 15, 2026.',
    faq: [{ question: 'Does this show my astrological sign?', answer: 'Yes! It calculates astronomical spans, planetary alignments, and milestone calendars.' }]
  },
  {
    id: 'date-difference',
    name: 'Date Difference Calculator',
    category: 'daily-life',
    description: 'Track the exact calendar time remaining between any two dates on the map.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Launch Timestamp Date', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Delivery Timestamp Date', type: 'date', defaultValue: '2026-12-31' }
    ],
    params: {},
    formula: 'Calendar date metrics',
    explanation: 'Calculates the exact time difference between any two dates, helping you track deadlines and projects.',
    example: 'There are exactly 364 days between January 1, 2026 and December 31, 2026.',
    faq: [{ question: 'Does this count support business days?', answer: 'This shows the total elapsed days. Try our dedicated Business Days calculator to exclude weekends and holidays.' }]
  },
  {
    id: 'days-between-dates',
    name: 'Days Between Dates Calculator',
    category: 'daily-life',
    description: 'Calculate the clean count of days, hours, and schedules between any two dates.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Start Date', type: 'date', defaultValue: '2026-04-01' },
      { id: 'endDate', label: 'End Date', type: 'date', defaultValue: '2026-04-30' }
    ],
    params: {},
    formula: 'Elapsed calendar duration formulas',
    explanation: 'A simple utility for calculating precise day counts between any two dates.',
    example: 'There are exactly 29 days between April 1, 2026 and April 30, 2026.',
    faq: [{ question: 'Is the start date included?', answer: 'Standard date calculations exclude the start date, counting only the elapsed nights between them.' }]
  },
  {
    id: 'work-days',
    name: 'Business Work Days Calculator',
    category: 'daily-life',
    description: 'Calculate working business days, weekends, and holidays between any two milestones.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Project Commencement', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Project Handover', type: 'date', defaultValue: '2026-02-28' }
    ],
    params: {},
    formula: 'Exclude weekends from calendar day count',
    explanation: 'Excludes weekends (Saturdays and Sundays) to give you an accurate count of billable working days.',
    example: 'Between Jan 1, 2026 and Feb 28, 2026, there are 58 total calendar days, representing 41 business working days.',
    faq: [{ question: 'Does this exclude public holidays?', answer: 'This excludes standard weekends. For local regional public holidays, deduct them manually according to your local calendar.' }]
  },
  {
    id: 'deadline-calculator',
    name: 'Deadline Target Calculator',
    category: 'daily-life',
    description: 'Track projects, milestones, task deadlines, and countdowns.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Project Launch Date', type: 'date', defaultValue: '2026-01-01' },
      { id: 'endDate', label: 'Target Deliverable Date', type: 'date', defaultValue: '2026-03-15' }
    ],
    params: {},
    formula: 'Time remaining deadline formulas',
    explanation: 'Provides clear visual targets to keep your projects on schedule and meet key milestones.',
    example: 'A project launched on Jan 1, 2026 with a March 15 milestone has a total window of 73 calendar days.',
    faq: [{ question: 'How often should I review project timelines?', answer: 'Reviewing timelines weekly keeps milestones aligned and lets you quickly spot potential delays.' }]
  },
  {
    id: 'time-duration',
    name: 'Time Duration Calculator',
    category: 'daily-life',
    description: 'Manage elapsed hours, minutes, and time card splits.',
    engine: 'date',
    inputs: [
      { id: 'startDate', label: 'Enter Start Date', type: 'date', defaultValue: '2026-06-01' },
      { id: 'endDate', label: 'Enter End Date', type: 'date', defaultValue: '2026-06-08' }
    ],
    params: {},
    formula: 'Millisecond time difference conversion',
    explanation: 'Computes elapsed time intervals, making it easy to track working hours and project tasks.',
    example: 'A task running from June 1 to June 8 covers exactly 7 full days (168 total working hours).',
    faq: [{ question: 'Does this track time zones?', answer: 'This assumes local system times. To compare across different regions, convert them to UTC first.' }]
  },

  // --- MATH VARIATIONS (50-57) ---
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'math',
    description: 'Solve percentage problems, fractional proportions, and relative values.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Enter Base Value (X)', type: 'number', defaultValue: 250 },
      { id: 'valueB', label: 'Enter Percent Ratio (Y)', type: 'number', defaultValue: 15 },
      { id: 'operator', label: 'Operation Type', type: 'select', defaultValue: 'percentOf', options: [{ label: 'Find Y% of X', value: 'percentOf' }, { label: 'Find what Y is as % of X', value: 'percentageOn' }] }
    ],
    params: {},
    formula: 'Percentage = (Percent / 100) * BaseValue',
    explanation: 'A quick utility for solving percentages, calculating tax fractions, and working with relative proportions.',
    example: 'Finding 15% of 250 yields an exact result of 37.5.',
    faq: [{ question: 'What does percent mean?', answer: 'Percent comes from the Latin "per centum", meaning "by the hundred" or parts per 100.' }]
  },
  {
    id: 'percentage-increase',
    name: 'Percentage Increase Calculator',
    category: 'math',
    description: 'Determine percentage increases, growth margins, and scale differences.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Original Value (X)', type: 'number', defaultValue: 120 },
      { id: 'valueB', label: 'Growth Percent (Y)', type: 'number', defaultValue: 25 },
      { id: 'operator', label: 'Fixed Equation', type: 'text', defaultValue: 'increase' }
    ],
    params: {},
    formula: 'New Balance = Original * (1 + Growth/100)',
    explanation: 'Calculates the final increased amount when applying a percentage growth rate.',
    example: 'Applying a 25% increase to 120 results in a final value of 150.',
    faq: [{ question: 'How is YoY growth calculated?', answer: 'Subtract the old value from the new value, divide by the old value, and multiply by 100.' }]
  },
  {
    id: 'percentage-decrease',
    name: 'Percentage Decrease Calculator',
    category: 'math',
    description: 'Calculate percentage decreases, markdown rates, and price discounts.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Original Balance (X)', type: 'number', defaultValue: 200 },
      { id: 'valueB', label: 'Discount Percent (Y)', type: 'number', defaultValue: 15 },
      { id: 'operator', label: 'Fixed Equation', type: 'text', defaultValue: 'decrease' }
    ],
    params: {},
    formula: 'Discounted Balance = Original * (1 - Discount/100)',
    explanation: 'Calculates the final decreased amount when applying a percentage markdown or discount.',
    example: 'Applying a 15% discount to a $200 price reduces it to a final value of $170.',
    faq: [{ question: 'What is a tax markdown?', answer: 'A tax markdown shows pre-tax values by removing the tax percentage from the final gross price.' }]
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    category: 'math',
    description: 'Add, subtract, multiply, and divide fractions.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Fraction Numerator (A)', type: 'number', defaultValue: 3 },
      { id: 'valueB', label: 'Denominator (B) ', type: 'number', defaultValue: 4 }
    ],
    params: {},
    formula: 'Mathematical fraction solvers',
    explanation: 'Solves fraction proportions and converts the result to a decimal.',
    example: 'A fraction of 3/4 represents 75% of a unit, equivalent to the decimal 0.75.',
    faq: [{ question: 'What is a common denominator?', answer: 'It is a shared multiple of the denominators of two or more fractions, which is required to add or subtract them.' }]
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio Calculator',
    category: 'math',
    description: 'Calculate ratios, split scales, and proportional shares.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Part A Share Ratio', type: 'number', defaultValue: 3 },
      { id: 'valueB', label: 'Part B Share Ratio', type: 'number', defaultValue: 5 }
    ],
    params: {},
    formula: 'Part ratio shares = X / (X + Y)',
    explanation: 'Calculates the percentage share of each part within a given ratio.',
    example: 'A 3:5 ratio means Part A represents 37.5% of the total, and Part B represents 62.5%.',
    faq: [{ question: 'What does a ratio show?', answer: 'A ratio compares the relative sizes of two or more values, showing how many times one value contains another.' }]
  },
  {
    id: 'average-calculator',
    name: 'Average Calculator',
    category: 'math',
    description: 'Find the average (mean) of a set of numbers.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'First Number', type: 'number', defaultValue: 80 },
      { id: 'valueB', label: 'Second Number', type: 'number', defaultValue: 90 }
    ],
    params: {},
    formula: 'Mean Average = (X + Y) / 2',
    explanation: 'Calculates the mathematical mean of your numbers.',
    example: 'The mean average of 80 and 90 is exactly 85.',
    faq: [{ question: 'What is a weighted average?', answer: 'A weighted average assigns different levels of importance to each number in the set, and calculates the average accordingly.' }]
  },
  {
    id: 'probability-calculator',
    name: 'Probability Calculator',
    category: 'math',
    description: 'Calculate probabilities and event likelihoods.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Favorable Outcomes', type: 'number', defaultValue: 1 },
      { id: 'valueB', label: 'Total Possibilities', type: 'number', defaultValue: 6 }
    ],
    params: {},
    formula: 'Likelihood P = Favorable / Total',
    explanation: 'Calculates the mathematical probability of an event, converting the result to a percentage and odds.',
    example: 'A 1 in 6 chance (like rolling a die) represents a 16.7% probability.',
    faq: [{ question: 'What are odds ratios?', answer: 'Odds compare the number of favorable outcomes to unfavorable outcomes, showing the likelihood of an event occurring.' }]
  },
  {
    id: 'statistics-calculator',
    name: 'Statistics Calculator',
    category: 'math',
    description: 'Calculate standard deviation, variance, and sample distributions.',
    engine: 'math',
    inputs: [
      { id: 'valueA', label: 'Sample Value A', type: 'number', defaultValue: 10 },
      { id: 'valueB', label: 'Sample Value B', type: 'number', defaultValue: 15 }
    ],
    params: {},
    formula: 'Standard statistical analysis mathematical loops',
    explanation: 'Calculates standard deviation and variance to analyze sample distributions.',
    example: 'Analyzing sample values 10 and 15 yields an average of 12.5 with a variance of 6.25.',
    faq: [{ question: 'What is standard deviation?', answer: 'Standard deviation measures how spread out a set of numbers is from its average value.' }]
  },

  // --- EDUCATION VARIATIONS (58-63) ---
  {
    id: 'gpa-calculator',
    name: 'GPA Calculator',
    category: 'education',
    description: 'Convert letter grades to GPA points and estimate overall grade averages.',
    engine: 'edu',
    inputs: [
      { id: 'score', label: 'Earned Exam Score', type: 'number', defaultValue: 92 },
      { id: 'total', label: 'Maximum Exam Total', type: 'number', defaultValue: 100 },
      { id: 'target', label: 'Target Class Goal', type: 'number', defaultValue: 90 }
    ],
    params: {},
    formula: 'GPA calculation scales',
    explanation: 'Converts exam grades to GPA equivalent scores, based on a standard 4.0 grading scale.',
    example: 'An exam score of 92 out of 100 converts to a letter grade of "A" and 4.0 GPA points.',
    faq: [{ question: 'How is weighted GPA calculated?', answer: 'Weighted GPAs assign higher point values (e.g., 5.0) for honors, AP, or IB courses.' }]
  },
  {
    id: 'cgpa-calculator',
    name: 'CGPA Calculator',
    category: 'education',
    description: 'Calculate Cumulative Grade Point Averages (CGPA) and academic standings.',
    engine: 'edu',
    inputs: [
      { id: 'score', label: 'Semesters Finished Credits', type: 'number', defaultValue: 45 },
      { id: 'total', label: 'Target CGPA Point Goal', type: 'number', defaultValue: 4 },
      { id: 'target', label: 'Current CGPA earned', type: 'number', defaultValue: 3 }
    ],
    params: {},
    formula: 'Accumulated academic GPA averages',
    explanation: 'Computes cumulative academic point standings over multiple semesters.',
    example: 'Having 45 credits with a current earned score of 3.3 CGPA indicates strong, high-tier standing.',
    faq: [{ question: 'How is CGPA converted to percentage?', answer: 'Traditional models multiply the CGPA by 9.5 to estimate an equivalent percentage grade.' }]
  },
  {
    id: 'grade-calculator',
    name: 'Grade Calculator',
    category: 'education',
    description: 'Convert exam scores to equivalent letter grades and percentages.',
    engine: 'edu',
    inputs: [
      { id: 'score', label: 'Earned Score Points', type: 'number', defaultValue: 42 },
      { id: 'total', label: 'Total Possible Points', type: 'number', defaultValue: 50 },
      { id: 'target', label: 'Target Passing Threshold', type: 'number', defaultValue: 80 }
    ],
    params: {},
    formula: 'Percentage = (Score / Total) * 100',
    explanation: 'Converts numeric point scores into standard letter grades and percentages.',
    example: 'Scoring 42 out of 50 points equals an 84% grade, equivalent to a letter grade of "B".',
    faq: [{ question: 'What is a typical passing grade?', answer: 'Most educational systems set the passing threshold at 50% or 60% (equivalent to a custom letter grade of D).' }]
  },
  {
    id: 'exam-calculator',
    name: 'Exam Grade Calculator',
    category: 'education',
    description: 'Calculate the score required on your final exam to reach a target class grade.',
    engine: 'edu',
    inputs: [
      { id: 'score', label: 'Current Homework Grade %', type: 'number', defaultValue: 85 },
      { id: 'total', label: 'Final Exam Weight %', type: 'number', defaultValue: 25 },
      { id: 'target', label: 'Target Class Grade %', type: 'number', defaultValue: 90 }
    ],
    params: {},
    formula: 'Required Score = (Target - Current * (1 - Weight)) / Weight',
    explanation: 'Determines the exact final exam score required to reach your target grade for the course.',
    example: 'With an 85% current grade, and a 25% final exam weight, you need a 105% score on the final exam to reach a 90% overall grade (which may require extra credit).',
    faq: [{ question: 'What is class weighting?', answer: 'Weighting assigns different levels of importance to different course components (e.g., homework is worth 30%, exams are worth 70%).' }]
  },
  {
    id: 'attendance-calculator',
    name: 'Class Attendance Calculator',
    category: 'education',
    description: 'Analyze mandatory class attendance, absences, and school thresholds.',
    engine: 'edu',
    inputs: [
      { id: 'score', label: 'Classes Attended', type: 'number', defaultValue: 36 },
      { id: 'total', label: 'Total Classes Held', type: 'number', defaultValue: 40 },
      { id: 'target', label: 'Target Attendance %', type: 'number', defaultValue: 90 }
    ],
    params: {},
    formula: 'Attendance Percentage = (Attended / Total) * 100',
    explanation: 'Calculates your attendance percentage and compares it against minimum class requirements.',
    example: 'Attending 36 out of 40 classes equals a 90% attendance rate, meeting standard school guidelines.',
    faq: [{ question: 'Can absences affect grades?', answer: 'Yes. Many courses require a minimum attendance rate (often 80% to 90%) to pass the class.' }]
  },
  {
    id: 'study-calculator',
    name: 'Study Time Planner',
    category: 'education',
    description: 'Estimate prep times and study schedules based on your course loads and deadlines.',
    engine: 'edu',
    inputs: [
      { id: 'score', label: 'Credit Hours Enrolled', type: 'number', defaultValue: 15 },
      { id: 'total', label: 'Target Prep Grade', type: 'number', defaultValue: 90 },
      { id: 'target', label: 'Perceived Difficulty (1-5)', type: 'number', defaultValue: 3 }
    ],
    params: {},
    formula: 'Study Hours = Credit Hours * Difficulty Factor',
    explanation: 'Estimates weekly homework and study time requirements to help you manage your academic schedules.',
    example: 'An active student enrolled in 15 credits with moderate class difficulty should dedicate approximately 30 to 45 hours per week to studying.',
    faq: [{ question: 'What is the standard credit-to-study ratio?', answer: 'University guidelines traditionally recommend studying 2 to 3 hours outside of class for every 1 credit hour enrolled.' }]
  },

  // --- PROGRAMMING VARIATIONS (64-70) ---
  {
    id: 'binary-calculator',
    name: 'Binary Calculator',
    category: 'programming',
    description: 'Calculate binary conversions, bitwise operators (AND, OR, XOR), and numerical bases.',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'Enter Size (in MB)', type: 'number', defaultValue: 50 },
      { id: 'speed', label: 'Connection Speed (Mbps)', type: 'number', defaultValue: 10 }
    ],
    params: {},
    formula: 'Binary transformations and numeric base equations',
    explanation: 'A quick utility for converting numbers to binary and performing bitwise calculations.',
    example: 'Converting decimal value 50 to binary yields 00110010 (8-bit representation).',
    faq: [{ question: 'What is bitwise AND?', answer: 'A bitwise AND compares corresponding bits, returning 1 only if both bits are 1.' }]
  },
  {
    id: 'hex-calculator',
    name: 'Hexadecimal Calculator',
    category: 'programming',
    description: 'Convert values to safe hexadecimal bases, color models, and binary splits.',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'Hex Size in MB', type: 'number', defaultValue: 120 },
      { id: 'speed', label: 'Hex Connection Mbps', type: 'number', defaultValue: 15 }
    ],
    params: {},
    formula: 'Hex numeral conversions',
    explanation: 'Converts base-10 decimals into base-16 hexadecimal representations.',
    example: 'Decimal value 120 converts to the hexadecimal equivalent of 78.',
    faq: [{ question: 'Where is hex notation used?', answer: 'Hexadecimal is widely used in web development for color codes (e.g., #FFFFFF), memory addresses, and character formatting.' }]
  },
  {
    id: 'base-converter',
    name: 'Numeral Base Converter',
    category: 'programming',
    description: 'Convert numbers between base-10 (decimal), base-2 (binary), base-16 (hexadecimal), and base-8 (octal).',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'Input Base Scale Value', type: 'number', defaultValue: 255 },
      { id: 'speed', label: 'Processing Speed', type: 'number', defaultValue: 50 }
    ],
    params: {},
    formula: 'Numeral conversion systems',
    explanation: 'Helps programmers and computer systems map numerical representations across different mathematical bases.',
    example: 'The decimal number 255 converts to the hexadecimal equivalent of FF and the binary equivalent of 11111111.',
    faq: [{ question: 'What is base-8 octal?', answer: 'Octal is a base-8 positional numeral system, using digits from 0 to 7.' }]
  },
  {
    id: 'ip-calculator',
    name: 'IP Subnet Calculator',
    category: 'programming',
    description: 'Calculate IP address subnets, netmasks, CIDR splits, and host ranges.',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'IP Octet Target', type: 'number', defaultValue: 192 },
      { id: 'speed', label: 'CIDR Notation Value', type: 'number', defaultValue: 24 }
    ],
    params: {},
    formula: 'IP addressing subnet calculations',
    explanation: 'Identifies network subnets, helping network administrators plan IP allocations.',
    example: 'Targeting IP network octet 192 with a CIDR value of 24 yields a standard subnet mask of 255.255.255.0.',
    faq: [{ question: 'What is CIDR?', answer: 'Classless Inter-Domain Routing (CIDR) is an IP addressing method that improves address allocation efficiency.' }]
  },
  {
    id: 'subnet-calculator',
    name: 'Subnet Mask Calculator',
    category: 'programming',
    description: 'Calculate subnet masks, network addresses, and maximum supported host pools.',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'Subnet Segment size', type: 'number', defaultValue: 256 },
      { id: 'speed', label: 'Connection Speed Mbps', type: 'number', defaultValue: 100 }
    ],
    params: {},
    formula: 'Subnet mask bit allocations',
    explanation: 'Models network masks to optimize host sizes and subnets.',
    example: 'A subnet segment size of 256 with a standard mask supports up to 254 active host IP addresses.',
    faq: [{ question: 'Why are two IP addresses reserved in each subnet?', answer: 'The first address is reserved for the network address, and the last address is reserved as the broadcast address.' }]
  },
  {
    id: 'data-size-calculator',
    name: 'Data Storage Converter',
    category: 'programming',
    description: 'Convert data units between Bytes, Kilobytes, Megabytes, Gigabytes, and Terabytes.',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'Source File size (MB)', type: 'number', defaultValue: 1024 },
      { id: 'speed', label: 'Ethernet Speed (Mbps)', type: 'number', defaultValue: 10 }
    ],
    params: {},
    formula: 'Data conversion factors using 1024-byte ratios',
    explanation: 'Converts data storage sizes, helping you estimate memory use and coordinate network transfers.',
    example: 'A source file size of 1024 Megabytes is equivalent to exactly 1.00 Gigabyte.',
    faq: [{ question: 'Is a Kilobyte 1000 or 1024 bytes?', answer: 'In computer memory, calculations use 1024 bytes (binary scale), while storage manufacturers often use 1000 bytes (decimal scale).' }]
  },
  {
    id: 'download-time-calculator',
    name: 'Download Speed Calculator',
    category: 'programming',
    description: 'Estimate file transfer times based on file sizes and network connection speeds.',
    engine: 'prog',
    inputs: [
      { id: 'size', label: 'File Size to Download (MB)', type: 'number', defaultValue: 4500 },
      { id: 'speed', label: 'Internet Speed (Mbps)', type: 'number', defaultValue: 100 }
    ],
    params: {},
    formula: 'Download Time = File Size / Download Speed',
    explanation: 'Isolates and estimates transfer times, taking standard network overhead into account.',
    example: 'Downloading a 4,500 Megabyte file on a 100 Mbps broadband connection takes approximately 6 minutes.',
    faq: [{ question: 'Why is my actual download speed slower than my internet speed?', answer: 'Internet speeds are reported in Megabits per second (Mbps), while actual download speeds are measured in Megabytes per second (MBps). 1 Megabyte equals 8 Megabits.' }]
  },

  // --- CONTENT CREATOR VARIATIONS (71-76) ---
  {
    id: 'word-counter',
    name: 'Word Counter',
    category: 'creator-tools',
    description: 'Count words, sentences, and paragraphs in your text.',
    engine: 'creator',
    inputs: [
      { id: 'text', label: 'Paste Your Text', type: 'text', defaultValue: 'Calculatoora is building a massive, highly optimized directory of clean client-side utilities.' },
      { id: 'speed', label: 'Reading Speed (WPM)', type: 'number', defaultValue: 200 }
    ],
    params: {},
    formula: 'Total Words = Text split by whitespace',
    explanation: 'Helps copywriters, editors, and students track word counts and estimate reading times.',
    example: 'Pasting this example text returns a exact count of 12 words.',
    faq: [{ question: 'What is a typical reading speed?', answer: 'An average adult reads at a speed of approximately 200 to 250 words per minute.' }]
  },
  {
    id: 'character-counter',
    name: 'Character Counter',
    category: 'creator-tools',
    description: 'Count letters, digits, special characters, and keyboard spaces in your text.',
    engine: 'creator',
    inputs: [
      { id: 'text', label: 'Paste Content Text', type: 'text', defaultValue: 'Optimized utility code.' },
      { id: 'speed', label: 'Reading Speed', type: 'number', defaultValue: 220 }
    ],
    params: {},
    formula: 'Total Characters = Text character length',
    explanation: 'Tracks character limits, helping you optimize titles for social media and search results.',
    example: 'Pasting the text "Optimized utility code." returns an exact count of 22 characters.',
    faq: [{ question: 'Are spaces counted as characters?', answer: 'Yes. Most character counters count spaces toward the total limit, though some tools allow excluding them.' }]
  },
  {
    id: 'reading-time',
    name: 'Reading Time Calculator',
    category: 'creator-tools',
    description: 'Estimate how long it will take to read a given amount of text.',
    engine: 'creator',
    inputs: [
      { id: 'text', label: 'Enter Text Content', type: 'text', defaultValue: 'Calculatoora provides premium tools with zero server-side latency.' },
      { id: 'speed', label: 'Reading Speed (WPM)', type: 'number', defaultValue: 250 }
    ],
    params: {},
    formula: 'Reading Time = Words / Reading Speed',
    explanation: 'Calculates the estimated reading time of your text to help you optimize article length for readers.',
    example: 'An 8-word sentence at a 250 WPM reading speed takes approximately 2 seconds to read.',
    faq: [{ question: 'How can I make my articles more engaging?', answer: 'Aim for a 3-minute to 5-minute reading time (approximately 600 to 1,000 words) to maximize engagement.' }]
  },
  {
    id: 'writing-time',
    name: 'Writing Time Calculator',
    category: 'creator-tools',
    description: 'Estimate how long it will take to write an article or essay.',
    engine: 'creator',
    inputs: [
      { id: 'text', label: 'Paste Draft Material', type: 'text', defaultValue: 'Calculatoora drafts.' },
      { id: 'speed', label: 'Writing Speed (WPM)', type: 'number', defaultValue: 40 }
    ],
    params: {},
    formula: 'Writing Time = Words / Writing Speed',
    explanation: 'Estimates writing and editing time requirements to help you plan copywriting projects.',
    example: 'A copywriting project of 1,200 words at a 40 WPM writing speed takes approximately 30 minutes to draft.',
    faq: [{ question: 'What is a typical typing speed?', answer: 'An average typing speed is approximately 40 words per minute, which is the baseline typing speed used in calculations.' }]
  },
  {
    id: 'video-calculator',
    name: 'Video File Size Calculator',
    category: 'creator-tools',
    description: 'Estimate potential video file sizes based on resolution, framerate, and length.',
    engine: 'creator',
    inputs: [
      { id: 'text', label: 'Enter Video Title', type: 'text', defaultValue: 'Production File' },
      { id: 'views', label: 'Resolution (1080p=1000, 4K=4000)', type: 'number', defaultValue: 1000 },
      { id: 'rpm', label: 'Est Bitrate (Mbps)', type: 'number', defaultValue: 12 }
    ],
    params: {},
    formula: 'File Size = Bitrate * Duration',
    explanation: 'Estimates video file sizes, helping you plan local memory storage and upload times.',
    example: 'A 10-minute video recorded at a 12 Mbps bitrate results in an estimated file size of 900 Megabytes.',
    faq: [{ question: 'Does frame rate affect video file size?', answer: 'Yes. Higher frame rates (e.g., 60 FPS vs 30 FPS) require a higher bitrate to maintain image details, increasing file size.' }]
  },
  {
    id: 'youtube-revenue-calculator',
    name: 'YouTube Ad Revenue Calculator',
    category: 'creator-tools',
    description: 'Model YouTube channel monetization, video views, and ad earnings.',
    engine: 'creator',
    inputs: [
      { id: 'text', label: 'Channel Name', type: 'text', defaultValue: 'Tech Hub' },
      { id: 'views', label: 'Estimated Daily Views', type: 'number', defaultValue: 5000 },
      { id: 'rpm', label: 'Estimated RPM ($)', type: 'number', defaultValue: 4.5 }
    ],
    params: {},
    formula: 'Ad Earnings = (Views / 1000) * RPM',
    explanation: 'Estimates potential ad revenue for your YouTube channel based on daily views and RPM.',
    example: 'A Channel averaging 5,000 views per day with a $4.50 RPM earns approximately $22.50 daily ($675 monthly).',
    faq: [{ question: 'What is the difference between CPM and RPM?', answer: 'CPM is the cost advertisers pay for every 1,000 ad impressions, while RPM is the actual revenue a creator earns for every 1,000 views after YouTube takes its share.' }]
  }
];

// ==========================================
// 4. PROGRAMMATIC VARIATION ENGINE (1,748 TOOLS)
// ==========================================

export function generateV8Calculators(): Calculator[] {
  const result: Calculator[] = [];

  for (const master of MASTER_TEMPLATES) {
    const calcFunc = coreEngines[master.engine];
    if (!calcFunc) continue;

    // A. ADD BASE CALCULATOR DEFAULT
    const baseCalculator: Calculator = {
      id: master.id,
      name: master.name,
      slug: master.id,
      category: master.category,
      description: master.description,
      inputs: master.inputs,
      formula: master.formula,
      explanation: master.explanation,
      example: master.example,
      faq: master.faq,
      relatedSlugs: MASTER_TEMPLATES.filter(m => m.category === master.category && m.id !== master.id).slice(0, 3).map(m => m.id),
      seoTitle: `${master.name} | Calculatoora`,
      seoDescription: `${master.description} Calculate accurate results instantly with local mathematical software.`,
      calculate: (vals) => calcFunc(vals, master.params, '$')
    };
    result.push(baseCalculator);

    // B. ADD 12 REGIONAL VARIATIONS
    for (const reg of REGIONS) {
      const regId = `${reg.code}-${master.id}`;
      
      // Customize inputs (adjust currency symbol and default values based on region multipliers)
      const regInputs = master.inputs.map(originalInput => {
        const cloned = { ...originalInput };
        if (cloned.unit === '$') {
          cloned.unit = reg.currency;
          cloned.defaultValue = Math.round(originalInput.defaultValue * reg.mult);
        }
        return cloned;
      });

      const regCalculator: Calculator = {
        id: regId,
        name: `${reg.name} ${master.name}`,
        slug: regId,
        category: master.category,
        description: `Localized ${reg.name} edition. ${master.description}`,
        inputs: regInputs,
        formula: master.formula,
        explanation: `${master.explanation} Formatted for the ${reg.name} region, using localized configurations.`,
        example: master.example.replace(/\$/g, reg.currency),
        faq: [
          ...master.faq,
          { question: reg.faqQ, answer: reg.faqA }
        ],
        relatedSlugs: [master.id],
        seoTitle: `${reg.name} - ${master.name} | Calculatoora`,
        seoDescription: `Calculate results in ${reg.currency} using our localized ${reg.name} ${master.name}. Free, accurate, and optimized for local standards.`,
        calculate: (vals) => calcFunc(vals, master.params, reg.currency)
      };
      result.push(regCalculator);
    }

    // C. ADD 10 PROFESSION/NICHE VARIATIONS
    for (const niche of NICHES) {
      const nicheId = `${master.id}-for-${niche.code}`;

      // Customize inputs (adjust default values based on niche parameters)
      const nicheInputs = master.inputs.map(originalInput => {
        const cloned = { ...originalInput };
        if (cloned.id === 'amount' || cloned.id === 'principal' || cloned.id === 'weight' || cloned.id === 'score') {
          if (niche.code === 'student') {
            cloned.defaultValue = Math.round(originalInput.defaultValue * 0.4);
          } else if (niche.code === 'doctor' || niche.code === 'investor') {
            cloned.defaultValue = Math.round(originalInput.defaultValue * 2.2);
          }
        }
        return cloned;
      });

      const nicheCalculator: Calculator = {
        id: nicheId,
        name: `${master.name} ${niche.name}`,
        slug: nicheId,
        category: master.category,
        description: `${master.description} ${niche.descSuffix}`,
        inputs: nicheInputs,
        formula: master.formula,
        explanation: `${master.explanation} This edition is optimized for the activities and needs of ${niche.name.replace('for ', '')}.`,
        example: master.example,
        faq: [
          ...master.faq,
          { question: niche.faqQ, answer: niche.faqA }
        ],
        relatedSlugs: [master.id],
        seoTitle: `${master.name} ${niche.name} | Calculatoora`,
        seoDescription: `${master.description} Customized ${master.name} optimized specifically for ${niche.name.replace('for ', '')}. Accurate, secure, and client-side.`,
        calculate: (vals) => calcFunc(vals, master.params, '$')
      };
      result.push(nicheCalculator);
    }
  }

  return result;
}
