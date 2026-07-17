import { Calculator } from '../types';

export const V19_PART3_CALCULATORS: Calculator[] = [
  // ====================================== EDUCATION ======================================
  {
    id: 'gpa-calc',
    name: 'GPA Calculator',
    slug: 'gpa-calc',
    category: 'education',
    description: 'Calculate semester or cumulative Grade Point Average (GPA) using letter grades and credits.',
    formula: 'GPA = SUM(Grade Points * Class Credits) / SUM(Class Credits)',
    explanation: 'Converts letters (A, B, C...) into numeric grade points, multiplying them by class weight credit sizes to determine average GPA.',
    example: 'An A (4.0 points, 3 credits) and a B (3.0 points, 4 credits) combine for a cumulative GPA of 3.43.',
    inputs: [
      { id: 'class1Grade', label: 'Class 1 Letter Grade', type: 'select', defaultValue: 'A', options: [
        { label: 'A (4.0 Points)', value: '4.0' },
        { label: 'B (3.0 Points)', value: '3.0' },
        { label: 'C (2.0 Points)', value: '2.0' },
        { label: 'D (1.0 Point)', value: '1.0' },
        { label: 'F (0.0 Points)', value: '0.0' }
      ]},
      { id: 'class1Credits', label: 'Class 1 Credit Hours', type: 'number', defaultValue: 3, min: 1, max: 10 },
      { id: 'class2Grade', label: 'Class 2 Letter Grade', type: 'select', defaultValue: 'B', options: [
        { label: 'A (4.0 Points)', value: '4.0' },
        { label: 'B (3.0 Points)', value: '3.0' },
        { label: 'C (2.0 Points)', value: '2.0' },
        { label: 'D (1.0 Point)', value: '1.0' },
        { label: 'F (0.0 Points)', value: '0.0' }
      ]},
      { id: 'class2Credits', label: 'Class 2 Credit Hours', type: 'number', defaultValue: 4, min: 1, max: 10 }
    ],
    faq: [
      { question: 'What is a weighted GPA class?', answer: 'Weighted GPAs account for honors or Advanced Placement (AP) classes, assigning increased points (up to 5.0 for an A) to reward difficult coursework.' }
    ],
    relatedSlugs: ['study-planner', 'exam-prep-time'],
    seoTitle: 'Semester & Cumulative Credit Weighted GPA Calculator',
    seoDescription: 'Input target letter grades and course credits to calculate cumulative semester grade point averages.',
    calculate: (inputs) => {
      const g1 = Number(inputs.class1Grade || 4.0);
      const c1 = Number(inputs.class1Credits || 3);
      const g2 = Number(inputs.class2Grade || 3.0);
      const c2 = Number(inputs.class2Credits || 3);

      const totalCredits = c1 + c2;
      const totalPoints = (g1 * c1) + (g2 * c2);
      const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0.0;

      return {
        results: [
          { label: 'Calculated Cumulative GPA', value: gpa.toFixed(2), isPrimary: true },
          { label: 'Total Completed Credit Hours', value: totalCredits, unit: 'credits', isPrimary: true },
          { label: 'Grading Classification', value: gpa >= 3.5 ? 'Deans List Standard' : 'Good Standing' }
        ]
      };
    }
  },
  {
    id: 'study-planner',
    name: 'Study Planner / Time Calculator',
    slug: 'study-planner',
    category: 'education',
    description: 'Design balanced weekly course review schedules, planning study targets for complex topics.',
    formula: 'Weekly Study Hours = Course Credit Hours * Study Hours Multiplier',
    explanation: 'Uses difficulty levels (Easy, Standard, Hard) to configure the optimal hours required to prepare for course finals.',
    example: 'A difficult 3-credit engineering module requires roughly 9 focused study hours per week outside of class.',
    inputs: [
      { id: 'weeklyCredits', label: 'Total Credit Hours This Semester', type: 'number', defaultValue: 15, min: 1, max: 30 },
      { id: 'difficultyMultiplier', label: 'Average Course Difficulty Level', type: 'select', defaultValue: '2', options: [
        { label: 'Standard Prep (2 hrs study / credit hour)', value: '2' },
        { label: 'Intensive Technical Prep (3 hrs study / credit hour)', value: '3' },
        { label: 'Light Prep (1 hr study / credit hour)', value: '1' }
      ]}
    ],
    faq: [
      { question: 'Standard study-to-class ratio?', answer: 'The academic golden rule recommends studying at least 2 hours outside of class for every 1 credit hour spent in traditional classrooms.' }
    ],
    relatedSlugs: ['gpa-calc', 'exam-prep-time'],
    seoTitle: 'Weekly Academic Schedule Study Planner Calculator',
    seoDescription: 'Plan your weekly study schedule based on total credit loads and average course difficulty.',
    calculate: (inputs) => {
      const credits = Number(inputs.weeklyCredits || 12);
      const mult = Number(inputs.difficultyMultiplier || 2);

      const neededHours = credits * mult;
      const dailyStudyTime = neededHours / 7;

      return {
        results: [
          { label: 'Suggested Study prep time', value: neededHours, unit: 'hours / week', isPrimary: true },
          { label: 'Daily Study Committment', value: dailyStudyTime.toFixed(1), unit: 'hours / day', isPrimary: true },
          { label: 'Study Ratio Multiplier Selected', value: `${mult} hours` }
        ]
      };
    }
  },
  {
    id: 'student-loan-repayment',
    name: 'Student Loan Repayment Calculator',
    slug: 'student-loan-repayment',
    category: 'education',
    description: 'Estimate student loan repayment paths, interest weights, and early pay-off terms.',
    formula: 'Monthly Payment = [P * r * (1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Applies standard amortization to student loans, projecting total interest and repayment dates.',
    example: 'A $30,000 student loan at 5.5% interest on a standard 10-year term requires $326 monthly.',
    inputs: [
      { id: 'principalAmount', label: 'Outstanding Loan Balance ($)', type: 'number', defaultValue: 35000, min: 1000, step: 1000 },
      { id: 'annualInterestRate', label: 'Annual Loan Interest Rate (%)', type: 'number', defaultValue: 5.8, min: 0.1, max: 20, step: 0.1 },
      { id: 'termYears', label: 'Repayment Term Period (Years)', type: 'number', defaultValue: 10, min: 1, max: 30 }
    ],
    faq: [
      { question: 'What is a federal unsubsidized loan?', answer: 'Unsubsidized loans accrue interest from the moment of disbursement. Interest continues to accumulate while you are enrolled in school.' }
    ],
    relatedSlugs: ['tuition-cost', 'simple-loan'],
    seoTitle: 'Student Loan Repayment & Interest Amortization Calculator',
    seoDescription: 'Estimate monthly student loan repayments, total interest costs, and early payoff schedules.',
    calculate: (inputs) => {
      const p = Number(inputs.principalAmount || 20000);
      const rateAnnual = Number(inputs.annualInterestRate || 5.0) / 100;
      const yrs = Number(inputs.termYears || 10);

      const r = rateAnnual / 12;
      const n = yrs * 12;

      let pmt = 0;
      if (r > 0) {
        pmt = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        pmt = p / n;
      }

      const overallPaymentSum = pmt * n;
      const netInterestSum = overallPaymentSum - p;

      return {
        results: [
          { label: 'Monthly Student Loan Bill', value: pmt.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Accumulated Interest', value: Math.round(netInterestSum), unit: '$', isPrimary: true },
          { label: 'Total Lifetime Repayment Amount', value: Math.round(overallPaymentSum), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'tuition-cost',
    name: 'Tuition Cost Calculator',
    slug: 'tuition-cost',
    category: 'education',
    description: 'Estimate overall university tuition, housing fees, books, and lifestyle expenses.',
    formula: 'Net Tuition Cost = (Tuition + Boarding + Supplies) - Scholarships',
    explanation: 'Combines academic costs, dorm rates, books, and scholarship resources to project net out-of-pocket tuition costs.',
    example: 'An in-state public university costing $10,500 in annual tuition + $12,000 room & board totals $22,500 gross.',
    inputs: [
      { id: 'tuitionAnnualRate', label: 'Annual Tuition Rates ($)', type: 'number', defaultValue: 12500, min: 0, step: 500 },
      { id: 'dormRoomBoardAnnual', label: 'Dorm Housing & Meal Boards ($)', type: 'number', defaultValue: 11000, min: 0, step: 100 },
      { id: 'booksSuppliesAnnual', label: 'Books, Technology & Lab Fees ($)', type: 'number', defaultValue: 1200, min: 0, step: 50 },
      { id: 'scholarshpsGrantsAward', label: 'Awarded Scholarships & Grants ($)', type: 'number', defaultValue: 3500, min: 0, step: 100 }
    ],
    faq: [
      { question: 'Difference between grants and scholarships?', answer: 'Both represent financial aid that does not require repayment. Grants are typically need-based, whereas scholarships are awarded based on merit.' }
    ],
    relatedSlugs: ['student-loan-repayment', 'gpa-calc'],
    seoTitle: 'University College Net Tuition & Boarding Cost Calculator',
    seoDescription: 'Estimate overall university tuition costs, meal plans, books, and housing expenses.',
    calculate: (inputs) => {
      const tuition = Number(inputs.tuitionAnnualRate || 10000);
      const bed = Number(inputs.dormRoomBoardAnnual || 8000);
      const books = Number(inputs.booksSuppliesAnnual || 1000);
      const grants = Number(inputs.scholarshpsGrantsAward || 0);

      const grossYearlySum = tuition + bed + books;
      const netOutofPocketYearly = Math.max(0, grossYearlySum - grants);
      const standard4YearDegreeInvestment = netOutofPocketYearly * 4;

      return {
        results: [
          { label: 'Yearly Out-of-Pocket Cost', value: Math.round(netOutofPocketYearly), unit: '$', isPrimary: true },
          { label: 'Degree Investment Estimate (4 Year)', value: Math.round(standard4YearDegreeInvestment), unit: '$', isPrimary: true },
          { label: 'Gross Campus Cost before Grants', value: grossYearlySum, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'exam-prep-time',
    name: 'Exam Preparation Time Calculator',
    slug: 'exam-prep-time',
    category: 'education',
    description: 'Calculate study times and review schedules needed to prepare for technical exam milestones.',
    formula: 'Time Required = (Chapters to Review * Hours per Chapter) + Prep Practice Mock Exams',
    explanation: 'Estimates preparation hours required for an exam, factoring in study days, core chapters, and practice exams.',
    example: 'Reviewing 10 textbook chapters with 2 practice exams requires ~36 focused preparation hours.',
    inputs: [
      { id: 'chaptersLeft', label: 'Total Course Chapters to Cover', type: 'number', defaultValue: 12, min: 1, max: 100 },
      { id: 'minutesPerChapter', label: 'Study Time per Chapter (mins)', type: 'number', defaultValue: 120, min: 10, max: 600, step: 10 },
      { id: 'mockPracticeExams', label: 'Mock Practice Exams Planned', type: 'number', defaultValue: 3, min: 0, max: 20 },
      { id: 'examCountdownDays', label: 'Days Remaining Until Exam', type: 'number', defaultValue: 14, min: 1, max: 365 }
    ],
    faq: [
      { question: 'What is spaced repetition in studying?', answer: 'Spaced repetition involves reviewing material at increasing intervals over time to improve memory retention compared to last-minute cramming.' }
    ],
    relatedSlugs: ['study-planner', 'gpa-calc'],
    seoTitle: 'Exam Preparation Time & Daily Study Commitment Calculator',
    seoDescription: 'Calculate required study times for exams based on your review speed, mock exams, and countdown calendar.',
    calculate: (inputs) => {
      const chapters = Number(inputs.chaptersLeft || 5);
      const minPerCh = Number(inputs.minutesPerChapter || 60);
      const mocks = Number(inputs.mockPracticeExams || 1);
      const days = Math.max(1, Number(inputs.examCountdownDays || 7));

      const chapterHours = (chapters * minPerCh) / 60;
      const mockHours = mocks * 3.5; // standard 3.5 hours tracking for exams and audits
      const overallHoursGoal = chapterHours + mockHours;
      const dailyHoursCommitment = overallHoursGoal / days;

      return {
        results: [
          { label: 'Suggested Daily Study Time', value: dailyHoursCommitment.toFixed(1), unit: 'hours / day', isPrimary: true },
          { label: 'Cumulative Preparation Hours', value: overallHoursGoal.toFixed(1), unit: 'hours', isPrimary: true },
          { label: 'Status Recommendation', value: dailyHoursCommitment > 4.0 ? 'Intense study schedule' : 'Highly manageable pace' }
        ]
      };
    }
  },

  // ====================================== BUSINESS ======================================
  {
    id: 'startup-cost',
    name: 'Startup Cost Calculator',
    slug: 'startup-cost',
    category: 'business',
    description: 'Calculate startup costs, including corporate registration, equipment, branding, and capital reserves.',
    formula: 'Start Costs = Administrative Filings + Equipment Setup + 6-Month OpEx Runway',
    explanation: 'Models startup capitalization, helping founders establish an operational cash runway.',
    example: 'Starting a software business often requires $1,500 in filing/legal costs, $3,500 in technology equipment, and a $12,000 capital reserve.',
    inputs: [
      { id: 'legalFilingsLicensing', label: 'Legal Filings, Licensing & Incorporation ($)', type: 'number', defaultValue: 1200, min: 0, step: 100 },
      { id: 'equipmentMachineryTech', label: 'Equipment, Software & Office Setup ($)', type: 'number', defaultValue: 5000, min: 0, step: 250 },
      { id: 'monthlyOpexRateGoal', label: 'Target Monthly OpEx Runway ($)', type: 'number', defaultValue: 3000, min: 0, step: 100 },
      { id: 'monthsRunwayReserve', label: 'Months of OpEx Capital Reserve', type: 'select', defaultValue: 6, options: [
        { label: '6 Months Capital Reserve (Recommended)', value: 6 },
        { label: '3 Months Capital Reserve (Lean setup)', value: 3 },
        { label: '12 Months Capital Reserve (Secure setup)', value: 12 }
      ]}
    ],
    faq: [
      { question: 'What is working capital runway?', answer: 'Working capital runway represents the cash reserve needed to cover business operating costs before reaching profitability.' }
    ],
    relatedSlugs: ['break-even', 'profit-margin'],
    seoTitle: 'Business Startup Cost & Capital Runway Planner',
    seoDescription: 'Calculate startup legal, technology, and operating costs, planning a custom cash reserve runway.',
    calculate: (inputs) => {
      const legal = Number(inputs.legalFilingsLicensing || 0);
      const gear = Number(inputs.equipmentMachineryTech || 0);
      const opex = Number(inputs.monthlyOpexRateGoal || 1000);
      const runway = Number(inputs.monthsRunwayReserve || 6);

      const runwayCapitalSum = opex * runway;
      const grossStartupCapitalReq = legal + gear + runwayCapitalSum;

      return {
        results: [
          { label: 'Required Startup Capitalization', value: Math.round(grossStartupCapitalReq), unit: '$', isPrimary: true },
          { label: 'Operating Capital Reserve', value: Math.round(runwayCapitalSum), unit: '$', isPrimary: true },
          { label: 'Asset Capex Capital', value: gear, unit: '$' }
        ]
      };
    }
  },
  {
    id: 'break-even',
    name: 'Break-Even Calculator',
    slug: 'break-even',
    category: 'business',
    description: 'Calculate break-even units and target revenues based on fixed costs and pricing.',
    formula: 'Break-Even Units = Fixed Costs / (Unit Price - Unit Variable Cost)',
    explanation: 'Acore microeconomics tool solving the minimum volume threshold where profits offset business expenses.',
    example: 'Under $12,000 monthly overhead, selling $45 items with a $15 variable cost breaks even at 400 sales.',
    inputs: [
      { id: 'monthlyOverheadFixed', label: 'Monthly Fixed Costs ($)', type: 'number', defaultValue: 8000, min: 1, step: 100 },
      { id: 'unitCustomerPrice', label: 'Single Unit Customer Sale Price ($)', type: 'number', defaultValue: 50, min: 1, step: 5 },
      { id: 'unitMfgVariableCost', label: 'Unit Production Variable Cost ($)', type: 'number', defaultValue: 18, min: 0, step: 1 }
    ],
    faq: [
      { question: 'What is variable cost contribution margin?', answer: 'Contribution margin is the unit sale price minus its variable cost. This margin is used to pay down fixed overhead expenses.' }
    ],
    relatedSlugs: ['startup-cost', 'profit-margin'],
    seoTitle: 'Business Unit Break-Even Volume and Revenue Calculator',
    seoDescription: 'Graph the break-even points for production lines using fixed monthly costs and variable expenses.',
    calculate: (inputs) => {
      const fixed = Number(inputs.monthlyOverheadFixed || 1000);
      const price = Number(inputs.unitCustomerPrice || 10);
      const variableCost = Number(inputs.unitMfgVariableCost || 0);

      const contributionMargin = price - variableCost;
      const bEUnits = contributionMargin > 0 ? fixed / contributionMargin : 0;
      const bERevenue = bEUnits * price;

      return {
        results: [
          { label: 'Monthly Break-Even Sales', value: contributionMargin > 0 ? Math.ceil(bEUnits) : 'Variable cost higher than price', unit: 'units', isPrimary: true },
          { label: 'Target Monthly Break-Even Revenue', value: contributionMargin > 0 ? Math.round(bERevenue) : 0, unit: '$', isPrimary: true },
          { label: 'Unit Contribution Margin', value: contributionMargin.toFixed(2), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'profit-margin',
    name: 'Profit Margin Calculator',
    slug: 'profit-margin',
    category: 'business',
    description: 'Calculate gross margins, operating margins, and profit ratios based on pricing and costs.',
    formula: 'Gross Margin % = [(Revenue - COGS) / Revenue] * 100',
    explanation: 'Solve margins on raw inventory sales to isolate gross yields, determining profitability.',
    example: 'Selling an online curriculum at $250 with $50 production costs secures an 80% Gross Profit Margin.',
    inputs: [
      { id: 'estimatedMonthGrossRev', label: 'Monthly Gross Business Revenue ($)', type: 'number', defaultValue: 18000, min: 1, step: 500 },
      { id: 'costOfGoodsCOGS', label: 'Direct Labor & Material Cost (COGS) ($)', type: 'number', defaultValue: 6200, min: 0, step: 100 }
    ],
    faq: [
      { question: 'Difference between Gross and Operating margins?', answer: 'Gross margin only subtracts direct materials and labor (COGS). Operating margin also accounts for administrative overhead like rent, utilities, and corporate marketing.' }
    ],
    relatedSlugs: ['break-even', 'cac-calc'],
    seoTitle: 'Gross & Net Profit Margin Pricing Calculator',
    seoDescription: 'Calculate gross margins, corporate profit yields, and business expense ratios based on revenue lists.',
    calculate: (inputs) => {
      const revenue = Number(inputs.estimatedMonthGrossRev || 5000);
      const cogs = Number(inputs.costOfGoodsCOGS || 1000);

      const grossProfitValue = revenue - cogs;
      const marginRatio = revenue > 0 ? (grossProfitValue / revenue) : 0;

      return {
        results: [
          { label: 'Gross Profit Margin', value: (marginRatio * 100).toFixed(1), unit: '%', isPrimary: true },
          { label: 'Gross Monthly Profit Earnings', value: Math.round(grossProfitValue), unit: '$', isPrimary: true },
          { label: 'Operating Cost Percentage', value: (100 - (marginRatio * 100)).toFixed(1), unit: '%' }
        ]
      };
    }
  },
  {
    id: 'cac-calc',
    name: 'Customer Acquisition Cost (CAC) Calculator',
    slug: 'cac-calc',
    category: 'business',
    description: 'Calculate CAC and Customer Lifetime Value (LTV) ratios based on marketing spend and acquisition volume.',
    formula: 'CAC = Total Marketing Spend / New Customers Acquired',
    explanation: 'Measures sales and marketing efficiency, comparing acquisition costs (CAC) against customer lifetime value (LTV).',
    example: 'Spending $4,000 to acquire 80 customers yields a CAC of $50.',
    inputs: [
      { id: 'monthlyAdwordsSpend', label: 'Monthly Sales & Marketing Ad Spend ($)', type: 'number', defaultValue: 5000, min: 1, step: 250 },
      { id: 'clientsAcquiredCount', label: 'New Customer Signups Acquired', type: 'number', defaultValue: 125, min: 1 },
      { id: 'annualCustLtvValue', label: 'Projected Customer Lifetime Value (LTV) ($)', type: 'number', defaultValue: 250, min: 1, step: 10 }
    ],
    faq: [
      { question: 'What is a sustainable LTV to CAC ratio?', answer: 'A healthy SaaS or subscription business aims for an LTV to CAC ratio of 3:1 or higher, demonstrating sustainable marketing yields.' }
    ],
    relatedSlugs: ['profit-margin', 'break-even'],
    seoTitle: 'LTV to CAC Customer Acquisition Cost Ratio Calculator',
    seoDescription: 'Optimize sales funnels, calculating customer acquisition costs (CAC) and customer lifetime values (LTV).',
    calculate: (inputs) => {
      const spend = Number(inputs.monthlyAdwordsSpend || 1000);
      const acquired = Number(inputs.clientsAcquiredCount || 10);
      const ltv = Number(inputs.annualCustLtvValue || 150);

      const cac = acquired > 0 ? spend / acquired : 0;
      const ltvToCacRatio = cac > 0 ? ltv / cac : 0;

      return {
        results: [
          { label: 'Customer Acquisition Cost (CAC)', value: cac.toFixed(2), unit: '$', isPrimary: true },
          { label: 'LTV : CAC Strength Ratio', value: ltvToCacRatio.toFixed(2), isPrimary: true },
          { label: 'Acquisition Efficiency Status', value: ltvToCacRatio >= 3.0 ? 'Highly Scalable Performance' : 'High acquisition cost' }
        ]
      };
    }
  },

  // ====================================== FINANCE ======================================
  {
    id: 'savings-interest',
    name: 'Savings Interest Calculator',
    slug: 'savings-interest',
    category: 'finance',
    description: 'Calculate compounds and future balances in high-yield savings accounts.',
    formula: 'A = P * (1 + r/n)^(n*t)',
    explanation: 'Models savings account growth based on monthly deposits and high-yield interest rates.',
    example: 'Starting with $5,000 and saving $300 monthly at a 4.5% rate yields $25,861 over 5 years.',
    inputs: [
      { id: 'startingDeposit', label: 'Starting Balance ($)', type: 'number', defaultValue: 5000, min: 0, step: 500 },
      { id: 'monthlySavingsRate', label: 'Recurring Monthly Deposit ($)', type: 'number', defaultValue: 250, min: 0, step: 50 },
      { id: 'annualYieldApy', label: 'Annual Percentage Yield (APY) (%)', type: 'number', defaultValue: 4.5, min: 0.1, max: 20, step: 0.1 },
      { id: 'savingsLengthYears', label: 'Savings Duration (Years)', type: 'number', defaultValue: 5, min: 1, max: 50 }
    ],
    faq: [
      { question: 'What is APY compound interest?', answer: 'Annual Percentage Yield (APY) represents the real rate of return on savings, factoring in monthly compounding interest.' }
    ],
    relatedSlugs: ['investment-yield', 'emergency-fund'],
    seoTitle: 'APY Compound Interest High-Yield Savings Calculator',
    seoDescription: 'Plan savings goals, forecasting balances and compound yields on recurring monthly deposits.',
    calculate: (inputs) => {
      const principal = Number(inputs.startingDeposit || 0);
      const monthly = Number(inputs.monthlySavingsRate || 0);
      const apy = Number(inputs.annualYieldApy || 1.0) / 100;
      const yrs = Number(inputs.savingsLengthYears || 5);

      const months = yrs * 12;
      const rateMonthly = apy / 12;

      let balance = principal;
      let totalDeposits = principal;

      for (let i = 0; i < months; i++) {
        balance = balance * (1 + rateMonthly) + monthly;
        totalDeposits += monthly;
      }

      const interestGained = balance - totalDeposits;

      return {
        results: [
          { label: 'Projected Savings Balance', value: Math.round(balance), unit: '$', isPrimary: true },
          { label: 'Total Principal Saved', value: totalDeposits, unit: '$', isPrimary: true },
          { label: 'Interest Earnings Gained', value: Math.round(interestGained), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'investment-yield',
    name: 'Investment Yield Calculator',
    slug: 'investment-yield',
    category: 'finance',
    description: 'Project stock market portfolio growths using historical equity yield averages.',
    formula: 'A = P * (1 + r)^t',
    explanation: 'Calculates investment growth over time based on starting capital, monthly contributions, and average stock returns.',
    example: 'A $10,000 index fund growing at 8% annually with $500 monthly additions yields ~105,400 after 10 years.',
    inputs: [
      { id: 'initialInvestment', label: 'Initial Portfolio Capital ($)', type: 'number', defaultValue: 10000, min: 0, step: 1000 },
      { id: 'monthlyContribution', label: 'Monthly Investment Addition ($)', type: 'number', defaultValue: 400, min: 0, step: 50 },
      { id: 'marketRateOfReturn', label: 'Assumed Annual Investment Yield (%)', type: 'number', defaultValue: 8.5, min: 1.0, max: 30.0, step: 0.5 },
      { id: 'investmentHorizonYears', label: 'Investment Horizon (Years)', type: 'number', defaultValue: 15, min: 1, max: 60 }
    ],
    faq: [
      { question: 'What is the standard historical S&P 500 yield average?', answer: 'The S&P 500 has produced a historical average annual return of roughly 10% (around 7% to 8% when adjusted for inflation).' }
    ],
    relatedSlugs: ['savings-interest', 'emergency-fund'],
    seoTitle: 'Investment Portfolio Growth & APY Yield Calculator',
    seoDescription: 'Project investment growth, mapping compounding stock returns on monthly portfolio contributions.',
    calculate: (inputs) => {
      const init = Number(inputs.initialInvestment || 0);
      const monthly = Number(inputs.monthlyContribution || 0);
      const rate = Number(inputs.marketRateOfReturn || 7.0) / 100;
      const yrs = Number(inputs.investmentHorizonYears || 10);

      const rMonthly = rate / 12;
      const months = yrs * 12;

      let balance = init;
      let investedBaseSum = init;

      for (let i = 0; i < months; i++) {
        balance = balance * (1 + rMonthly) + monthly;
        investedBaseSum += monthly;
      }

      const totalCapitalGrowth = balance - investedBaseSum;

      return {
        results: [
          { label: 'Projected Portfolio Balance', value: Math.round(balance), unit: '$', isPrimary: true },
          { label: 'Total Invested Contributions', value: investedBaseSum, unit: '$', isPrimary: true },
          { label: 'Compound Interest Earnings', value: Math.round(totalCapitalGrowth), unit: '$' }
        ]
      };
    }
  },
  {
    id: 'emergency-fund',
    name: 'Emergency Fund Calculator',
    slug: 'emergency-fund',
    category: 'finance',
    description: 'Calculate 3-month and 6-month emergency cash reserves based on basic living, rent, and food expenses.',
    formula: 'Emergency Reserve = Monthly Mandatory Expenses * Target Months',
    explanation: 'Helps users calculate a rainy day fund to cover mandatory living expenses during unexpected events.',
    example: 'Under $2,800 in mandatory monthly expenses, a 6-month safety net targets exactly $16,800.',
    inputs: [
      { id: 'residentialRentPayments', label: 'Monthly Rent or Mortgage Bill ($)', type: 'number', defaultValue: 1500, min: 0, step: 50 },
      { id: 'monthlyGroceriesUtilities', label: 'Monthly Groceries, Utility, & Insurance costs ($)', type: 'number', defaultValue: 850, min: 0, step: 50 },
      { id: 'autoLeaseRepayments', label: 'Auto Loans & Commuting Bills ($)', type: 'number', defaultValue: 400, min: 0, step: 20 },
      { id: 'coverageMonthsTarget', label: 'Desirable Survival Months Runway', type: 'select', defaultValue: 6, options: [
        { label: '6 Month Safe Buffer Runway', value: 6 },
        { label: '3 Month Basic Runway', value: 3 },
        { label: '12 Month High-Density Runway', value: 12 }
      ]}
    ],
    faq: [
      { question: 'Why is a dedicated cash reserve crucial?', answer: 'An emergency fund covers mandatory expenses during unexpected events (such as job loss or medical bills), helping you avoid high-interest credit card debt.' }
    ],
    relatedSlugs: ['savings-interest', 'simple-loan'],
    seoTitle: '3-Month & 6-Month Emergency Cash Fund Calculator',
    seoDescription: 'Calculate essential living costs, mapping custom 3-month, 6-month, and 12-month standby emergency reserves.',
    calculate: (inputs) => {
      const rent = Number(inputs.residentialRentPayments || 0);
      const utility = Number(inputs.monthlyGroceriesUtilities || 0);
      const car = Number(inputs.autoLeaseRepayments || 0);
      const months = Number(inputs.coverageMonthsTarget || 6);

      const netMandatoryMonthExpense = rent + utility + car;
      const combinedOverallStandbyReq = netMandatoryMonthExpense * months;

      return {
        results: [
          { label: 'Standby Emergency Fund Target', value: Math.round(combinedOverallStandbyReq), unit: '$', isPrimary: true },
          { label: 'Mandatory Monthly Base Costs', value: netMandatoryMonthExpense, unit: '$', isPrimary: true },
          { label: 'Daily Bare-Bones Survival Budget', value: Math.round(netMandatoryMonthExpense / 30), unit: '$ / day' }
        ]
      };
    }
  },
  {
    id: 'simple-loan',
    name: 'Simple Loan Calculator',
    slug: 'simple-loan',
    category: 'finance',
    description: 'Calculate principal schedules, monthly payments, and interest margins for personal loans.',
    formula: 'Payment = [P * r * (1+r)^n] / [(1+r)^n - 1]',
    explanation: 'Uses personal loan rates to solve monthly payments and total interest costs.',
    example: 'A $12,000 personal loan at 7.5% interest on a 3-year term requires $373 monthly.',
    inputs: [
      { id: 'desiredPrincipalVolume', label: 'Requested Loan Amount ($)', type: 'number', defaultValue: 15000, min: 500, step: 500 },
      { id: 'personalLoanAPR', label: 'Loan Representative APR (%)', type: 'number', defaultValue: 8.5, min: 0.1, max: 35, step: 0.1 },
      { id: 'amortizationPeriodMonths', label: 'Amortization Period (Months)', type: 'number', defaultValue: 36, min: 6, max: 120, step: 6 }
    ],
    faq: [
      { question: 'What is loan amortization?', answer: 'Amortization divides your loan into equal monthly payments, with a portion going to interest and the rest paying down the principal.' }
    ],
    relatedSlugs: ['savings-interest', 'emergency-fund'],
    seoTitle: 'Amortized Personal Loan Payment & APR Calculator',
    seoDescription: 'Estimate monthly personal loan payments and overall interest costs based on loan term and APR.',
    calculate: (inputs) => {
      const p = Number(inputs.desiredPrincipalVolume || 10000);
      const apr = Number(inputs.personalLoanAPR || 7.5) / 100;
      const months = Number(inputs.amortizationPeriodMonths || 36);

      const r = apr / 12;
      let monthBill = 0;

      if (r > 0) {
        monthBill = (p * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
      } else {
        monthBill = p / months;
      }

      const overallPrincipalRepaid = monthBill * months;
      const totalAccumulatedInterest = overallPrincipalRepaid - p;

      return {
        results: [
          { label: 'Monthly Repayment Bill', value: monthBill.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Principal & Interest Sum', value: Math.round(overallPrincipalRepaid), unit: '$', isPrimary: true },
          { label: 'Lifetime Paid Interest Surcharge', value: Math.round(totalAccumulatedInterest), unit: '$' }
        ]
      };
    }
  },

  // ====================================== HEALTH ======================================
  {
    id: 'water-intake',
    name: 'Water Intake Calculator',
    slug: 'water-intake',
    category: 'health',
    description: 'Calculate daily water requirements based on weight, weather, and activity levels.',
    formula: 'Water (oz) = Weight (lbs) * 0.67 + Activity Adjustment',
    explanation: 'Establishes daily hydration targets based on body weight, climate settings, and workout duration.',
    example: 'A 160-pound individual doing a 45-minute workout in dry climates needs ~120 ounces of water daily.',
    inputs: [
      { id: 'userWeightLbs', label: 'Your Current Weight (lbs)', type: 'number', defaultValue: 165, min: 50, max: 500 },
      { id: 'dailyWorkoutMins', label: 'Average Daily Active Exercise (Minutes)', type: 'number', defaultValue: 30, min: 0, max: 300, step: 5 },
      { id: 'generalLocalClimate', label: 'Regional Climate Atmosphere', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Moderate Temperate', value: 'moderate' },
        { label: 'Hot / Humid Dry Heat (High perspiration)', value: 'hot' }
      ]}
    ],
    faq: [
      { question: 'What is water intoxication (hyponatremia)?', answer: 'Hyponatremia occurs when excessive water consumption dilutes blood sodium levels. Ensure you balance high water intake with electrolytes.' }
    ],
    relatedSlugs: ['calorie-burn', 'sleep-cycles'],
    seoTitle: 'Daily Hydration Water Intake Calculator',
    seoDescription: 'Calculate your daily water intake requirements based on body weight, climate, and exercise times.',
    calculate: (inputs) => {
      const weight = Number(inputs.userWeightLbs || 150);
      const sports = Number(inputs.dailyWorkoutMins || 0);
      const weather = inputs.generalLocalClimate || 'moderate';

      let baseOz = weight * 0.67;
      
      // Add 12 oz of water for every 30 mins of active workout
      const activityBufferOz = (sports / 30) * 12;
      
      let climateBufferOz = 0;
      if (weather === 'hot') {
        climateBufferOz = 18;
      }

      const totalOzNeeded = baseOz + activityBufferOz + climateBufferOz;
      const standard8OzCups = totalOzNeeded / 8;

      return {
        results: [
          { label: 'Daily Hydration Target', value: Math.round(totalOzNeeded), unit: 'fl oz', isPrimary: true },
          { label: 'Equivalent 8-oz Cups', value: standard8OzCups.toFixed(1), unit: 'cups', isPrimary: true },
          { label: 'Liters Equivalent', value: (totalOzNeeded * 0.02957).toFixed(2), unit: 'Liters' }
        ]
      };
    }
  },
  {
    id: 'calorie-burn',
    name: 'Calorie Burn Calculator',
    slug: 'calorie-burn',
    category: 'health',
    description: 'Estimate calories burned across multiple activities using standardized Metabolic Equivalents (METs).',
    formula: 'Calories Burned = MET * Weight (kg) * Duration (hours)',
    explanation: 'Uses specific MET (Metabolic Equivalent) activity levels to calculate calories burned based on exercise duration and body weight.',
    example: 'A 170-pound (77kg) person jogging at a moderate pace (7 METs) for 1 hour burns ~539 calories.',
    inputs: [
      { id: 'activityMETSelect', label: 'Selected Activity & Pace', type: 'select', defaultValue: 'run-slow', options: [
        { label: 'Running / Jogging (Moderate: 8.0 METs)', value: 'run-slow' },
        { label: 'Cycling/Stationary Bike (Intense: 7.0 METs)', value: 'cycle' },
        { label: 'Bodyweight Resistance & Weight Lifting (6.0 METs)', value: 'lift' },
        { label: 'Casual Walking / Hiking (3.5 METs)', value: 'walk' }
      ]},
      { id: 'bodyWeightLbs', label: 'Body Weight (lbs)', type: 'number', defaultValue: 170, min: 50, max: 600 },
      { id: 'exerciseMinutes', label: 'Exercise Session Duration (Minutes)', type: 'number', defaultValue: 45, min: 1, max: 480 }
    ],
    faq: [
      { question: 'What is a MET in fitness?', answer: 'Metabolic Equivalent of Task (MET) measures physical activity intensity relative to energy expended at rest (1 MET).' }
    ],
    relatedSlugs: ['water-intake', 'heart-rate-zones'],
    seoTitle: 'Metabolic Equivalent (MET) Calorie Burn Calculator',
    seoDescription: 'Calculate calories burned across multiple exercises using standardized Metabolic Equivalents.',
    calculate: (inputs) => {
      const act = inputs.activityMETSelect || 'run-slow';
      const weightLbs = Number(inputs.bodyWeightLbs || 150);
      const mins = Number(inputs.exerciseMinutes || 30);

      let met = 3.5;
      if (act === 'run-slow') met = 8.0;
      if (act === 'cycle') met = 7.0;
      if (act === 'lift') met = 6.0;

      const bodyWeightKg = weightLbs / 2.20462;
      const durationHours = mins / 60;
      const caloriesBurned = met * bodyWeightKg * durationHours;

      return {
        results: [
          { label: 'Calories Burned', value: Math.round(caloriesBurned), unit: 'kcal', isPrimary: true },
          { label: 'Effort Level Equivalent', value: act === 'walk' ? 'Low Intensity' : 'Moderate to High Intensity', isPrimary: true },
          { label: 'Metabolism Burn Rate', value: Math.round(caloriesBurned / durationHours), unit: 'kcal / hr' }
        ]
      };
    }
  },
  {
    id: 'sleep-cycles',
    name: 'Sleep Cycles Calculator',
    slug: 'sleep-cycles',
    category: 'health',
    description: 'Calculate optimal times to sleep or wake up based on natural 90-minute REM cycles.',
    formula: 'Target Wake Time = Bedtime + (N * 90 mins) + Sleep Onset Buffer',
    explanation: 'Uses 90-minute sleep cycle intervals to help you wake up feeling refreshed instead of groggy.',
    example: 'Falling asleep at 10:00 PM with five 90-minute cycles aligns for a refreshing 5:30 AM wakeup.',
    inputs: [
      { id: 'timeCalculationMode', label: 'Planning Mode Choice', type: 'select', defaultValue: 'wake', options: [
        { label: 'I plan to Wake Up at a specific time', value: 'wake' },
        { label: 'I plan to Fall Asleep at a specific time', value: 'sleep' }
      ]},
      { id: 'targetTimeStr', label: 'Desired Time (HH:MM Format - e.g., 07:00)', type: 'text', defaultValue: '07:00' }
    ],
    faq: [
      { question: 'What is a sleep cycle?', answer: 'A full sleep cycle lasts about 90 minutes on average, transitioning through light sleep, deep sleep, and REM phases.' }
    ],
    relatedSlugs: ['water-intake', 'heart-rate-zones'],
    seoTitle: 'REM Sleep Cycle Wakeup & Bedtime Calculator',
    seoDescription: 'Calculate the best times to fall asleep or wake up to align with natural 90-minute sleep cycles.',
    calculate: (inputs) => {
      const mode = inputs.timeCalculationMode || 'wake';
      const timeStr = String(inputs.targetTimeStr || '07:00');

      const parts = timeStr.split(':');
      let selectHour = 7;
      let selectMin = 0;
      if (parts.length === 2) {
        selectHour = Number(parts[0]);
        selectMin = Number(parts[1]);
      }

      // Convert target input to minutes from midnight
      const baseMinutes = selectHour * 60 + selectMin;
      const averageSleepOnsetLag = 14; // minutes it takes cards to fall asleep

      let cycleResultStr = '';
      if (mode === 'wake') {
        // Find optimal bedtimes before wake time (5 cycles = 450 minutes)
        const bedtimeMins = (baseMinutes - 450 - averageSleepOnsetLag + 1440) % 1440;
        const bH = Math.floor(bedtimeMins / 60);
        const bM = Math.floor(bedtimeMins % 60);
        cycleResultStr = `${bH.toString().padStart(2, '0')}:${bM.toString().padStart(2, '0')}`;
      } else {
        // Find optimal wake times after sleep time (5 cycles = 450 minutes)
        const wakeupMins = (baseMinutes + 450 + averageSleepOnsetLag) % 1440;
        const wH = Math.floor(wakeupMins / 60);
        const wM = Math.floor(wakeupMins % 60);
        cycleResultStr = `${wH.toString().padStart(2, '0')}:${wM.toString().padStart(2, '0')}`;
      }

      return {
        results: [
          { label: mode === 'wake' ? 'Optimal Bedtime' : 'Optimal Wake Time', value: cycleResultStr, isPrimary: true },
          { label: 'Cycle Duration', value: '5 Sleep Cycles', unit: '7.5 hours', isPrimary: true },
          { label: 'Sleep Onset Buffer', value: '14 minutes included' }
        ]
      };
    }
  },
  {
    id: 'heart-rate-zones',
    name: 'Heart Rate Zones Calculator',
    slug: 'heart-rate-zones',
    category: 'health',
    description: 'Determine personalized cardiovascular target training zones using the Karvonen formula.',
    formula: 'Target HR = [(Max HR - Resting HR) * %Intensity] + Resting HR',
    explanation: 'Calculates target heart rate zones based on age, resting heart rate, and training intensity.',
    example: 'A 30-year-old with a resting pulse of 60 achieves an aerobic cruising range of 138-151 BPM.',
    inputs: [
      { id: 'userAgeYears', label: 'Your Current Age (Years)', type: 'number', defaultValue: 30, min: 1, max: 110 },
      { id: 'restingHeartRateBpm', label: 'Your Resting Heart Rate (BPM)', type: 'number', defaultValue: 62, min: 30, max: 150 }
    ],
    faq: [
      { question: 'Difference between aerobic and anaerobic cardiovascular zones?', answer: 'The aerobic zone (70-80% of max HR) utilizes oxygen for sustainable endurance, whereas the anaerobic zone (80-90% of max HR) powers short, high-intensity efforts.' }
    ],
    relatedSlugs: ['calorie-burn', 'water-intake'],
    seoTitle: 'Karvonen Aerobic Cardiovascular Training Zone Calculator',
    seoDescription: 'Calculate heart rate zones based on your resting pulse and age to optimize cardiovascular training.',
    calculate: (inputs) => {
      const age = Number(inputs.userAgeYears || 30);
      const rhr = Number(inputs.restingHeartRateBpm || 60);

      // Haskell & Fox Maximum heart rate formula
      const maxHr = 220 - age;
      const heartRateReserve = maxHr - rhr;

      // Fat burn zone (60% to 70% intensity)
      const fatBurnMin = Math.round(heartRateReserve * 0.60 + rhr);
      const fatBurnMax = Math.round(heartRateReserve * 0.70 + rhr);

      // Aerobic endurance zone (70% to 80% intensity)
      const aerobicMin = Math.round(heartRateReserve * 0.70 + rhr);
      const aerobicMax = Math.round(heartRateReserve * 0.80 + rhr);

      return {
        results: [
          { label: 'Aerobic Target Range', value: `${aerobicMin} - ${aerobicMax}`, unit: 'BPM', isPrimary: true },
          { label: 'Fat Burn Target Range', value: `${fatBurnMin} - ${fatBurnMax}`, unit: 'BPM', isPrimary: true },
          { label: 'Maximum Estimated Heart Rate', value: maxHr, unit: 'BPM' }
        ]
      };
    }
  },

  // ====================================== SPACE & ASTRONOMY ======================================
  {
    id: 'light-year-dist',
    name: 'Light Year Distance Calculator',
    slug: 'light-year-dist',
    category: 'space-astronomy',
    description: 'Calculate light travel distances across years, parsecs, and astronomical units.',
    formula: 'Light Year = Speed of Light * 1 year in seconds',
    explanation: 'Interprets immense interstellar distances, converting light years, parsecs, and planetary units.',
    example: 'Traveling at light speed, reaching Mars from Earth takes about 12.5 minutes average.',
    inputs: [
      { id: 'lightTravelPeriod', label: 'Time Elapsed for Light Travel', type: 'number', defaultValue: 1, min: 0.0001, max: 10000000 },
      { id: 'timeUnitSelected', label: 'Time Horizon Unit', type: 'select', defaultValue: 'years', options: [
        { label: 'Standard Years (Julian)', value: 'years' },
        { label: 'Travel Days (24H)', value: 'days' },
        { label: 'Travel Minutes', value: 'mins' }
      ]}
    ],
    faq: [
      { question: 'What is a parsec?', answer: 'A parsec is an astronomical unit of distance equal to about 3.26 light-years. It is based on parallax angles observed from Earth\'s orbit.' }
    ],
    relatedSlugs: ['gravitational-force', 'escape-velocity'],
    seoTitle: 'Interstellar Light Year vs Parsec Distance Calculator',
    seoDescription: 'Calculate light travel distances in miles and kilometers over years, days, or minutes.',
    calculate: (inputs) => {
      const duration = Number(inputs.lightTravelPeriod || 1);
      const unit = inputs.timeUnitSelected || 'years';

      let yearsFraction = duration;
      if (unit === 'days') yearsFraction = duration / 365.25;
      if (unit === 'mins') yearsFraction = duration / (365.25 * 1440);

      // 1 light year = 9.461e12 km
      const distanceTrillionKm = yearsFraction * 9.461;
      const conversionToParsecs = yearsFraction / 3.26156;

      return {
        results: [
          { label: 'Light Travel Distance', value: distanceTrillionKm.toFixed(3), unit: 'trillion km', isPrimary: true },
          { label: 'Calculated Parsec Units', value: conversionToParsecs.toFixed(3), unit: 'pc', isPrimary: true },
          { label: 'Travel Distance in AU', value: Math.round(yearsFraction * 63241.1).toLocaleString(), unit: 'AU' }
        ]
      };
    }
  },
  {
    id: 'gravitational-force',
    name: 'Gravitational Force Calculator',
    slug: 'gravitational-force',
    category: 'space-astronomy',
    description: 'Calculate physical attraction forces between celestial bodies using Newton\'s Law of Universal Gravitation.',
    formula: 'F = G * (m1 * m2) / r^2',
    explanation: 'Uses mass scales and orbital distances to solve gravitational attraction pull forces in Newtons.',
    example: 'The gravitational force between Earth and the Moon is approximately 1.98 * 10^20 Newtons.',
    inputs: [
      { id: 'orbitingCelestialBody', label: 'Space Orbit Object System', type: 'select', defaultValue: 'earth-moon', options: [
        { label: 'Earth & Moon System (384,000 km distance)', value: 'earth-moon' },
        { label: 'Sun & Earth System (1.0 Astronomical unit)', value: 'sun-earth' }
      ]},
      { id: 'customMassBody1', label: 'Or override Mass M1 (x 10^24 kg)', type: 'number', defaultValue: 5.97, min: 0.001 },
      { id: 'customDistanceBody', label: 'Or override Orbit Orbit distance R (km)', type: 'number', defaultValue: 384400, min: 1 }
    ],
    faq: [
      { question: 'What is G in gravity physics?', answer: 'The universal gravitational constant (G) is equal to 6.6743 × 10⁻¹¹ N·m²/kg², serving as a fundamental scaling factor in cosmic astrophysics.' }
    ],
    relatedSlugs: ['light-year-dist', 'escape-velocity'],
    seoTitle: 'Universal Gravitation Attraction Force & Mass Calculator',
    seoDescription: 'Calculate the gravitational attraction between celestial bodies based on mass profiles and orbital distances.',
    calculate: (inputs) => {
      const system = inputs.orbitingCelestialBody || 'earth-moon';
      let rKm = Number(inputs.customDistanceBody || 384400);
      let m1 = Number(inputs.customMassBody1 || 5.97) * 1e24;

      let m2 = 0.073 * 1e24; // moon weight default
      if (system === 'sun-earth') {
        m1 = 1.989e30; // sun
        m2 = 5.972e24; // earth
        rKm = 1.496e8; // sun-earth distance
      }

      const rMeters = rKm * 1000;
      const G = 6.6743e-11;
      const gravityForceNewtons = G * (m1 * m2) / Math.pow(rMeters, 2);

      return {
        results: [
          { label: 'Calculated Attracting Force', value: gravityForceNewtons.toExponential(3), unit: 'Newtons', isPrimary: true },
          { label: 'Central Mass Scale (M1)', value: m1.toExponential(2), unit: 'kg', isPrimary: true },
          { label: 'System Distance (R)', value: rKm.toLocaleString(), unit: 'km' }
        ]
      };
    }
  },
  {
    id: 'escape-velocity',
    name: 'Escape Velocity Calculator',
    slug: 'escape-velocity',
    category: 'space-astronomy',
    description: 'Calculate escape velocities for planets and star surfaces using mass and radius ratios.',
    formula: 'v_e = SQRT(2 * G * M / R)',
    explanation: 'Determines the minimum velocity required to escape a celestial body\'s gravitational field without further propulsion.',
    example: 'Escaping Earth\'s gravitational pull requires a launch velocity of 11.18 km/s (approx. 25,000 mph).',
    inputs: [
      { id: 'systemPlanetTarget', label: 'Planet Target System', type: 'select', defaultValue: 'earth', options: [
        { label: 'Earth (Mass: 5.97e24 kg, Radius: 6,371 km)', value: 'earth' },
        { label: 'Mars (Mass: 6.39e23 kg, Radius: 3,389 km)', value: 'mars' },
        { label: 'Jupiter (Mass: 1.898e27 kg, Radius: 69,911 km)', value: 'jupiter' }
      ]}
    ],
    faq: [
      { question: 'Why does Jupiter require such a high launch velocity?', answer: 'Jupiter has an immense mass (318 times that of Earth), pulling launcher objects back with strong gravitational acceleration.' }
    ],
    relatedSlugs: ['gravitational-force', 'gravity-comparison'],
    seoTitle: 'Escape Velocity Space Launch Acceleration Calculator',
    seoDescription: 'Calculate planet launching escape speeds based on astronomical mass arrays and radial profiles.',
    calculate: (inputs) => {
      const target = inputs.systemPlanetTarget || 'earth';

      let mKg = 5.97e24;
      let rM = 6371e3;

      if (target === 'mars') {
        mKg = 6.39e23;
        rM = 3389e3;
      } else if (target === 'jupiter') {
        mKg = 1.898e27;
        rM = 69911e3;
      }

      const G = 6.6743e-11;
      const escapeV_Ms = Math.sqrt((2 * G * mKg) / rM);
      const escapeV_Kms = escapeV_Ms / 1000;

      return {
        results: [
          { label: 'Required Escape Velocity', value: escapeV_Kms.toFixed(2), unit: 'km / sec', isPrimary: true },
          { label: 'Hourly Escape Speed Match', value: Math.round(escapeV_Kms * 3600).toLocaleString(), unit: 'km / hour', isPrimary: true },
          { label: 'Equivalent Mach Velocity', value: (escapeV_Ms / 343).toFixed(1), unit: 'Mach' }
        ]
      };
    }
  },
  {
    id: 'gravity-comparison',
    name: 'Planet Weight / Gravity Comparison Calculator',
    slug: 'gravity-comparison',
    category: 'space-astronomy',
    description: 'Calculate and compare weights across multiple solar system planets.',
    formula: 'Weight_Planet = Weight_Earth * (Gravity_Planet / Gravity_Earth)',
    explanation: 'Uses surface gravity ratios of solar planets to show how much an object would weigh on another celestial body.',
    example: 'A 180-pound person would weigh only 68 pounds on Mars, but a whopping 455 pounds on Jupiter.',
    inputs: [
      { id: 'weightEarthQty', label: 'Your Weight on Earth (lbs)', type: 'number', defaultValue: 150, min: 10, max: 1000 },
      { id: 'planetDests', label: 'Destination Space Planet', type: 'select', defaultValue: 'mars', options: [
        { label: 'Mars (38% Earth gravity strength)', value: 'mars' },
        { label: 'The Moon (16.6% Earth gravity strength)', value: 'moon' },
        { label: 'Jupiter (253% Earth gravity strength)', value: 'jupiter' }
      ]}
    ],
    faq: [
      { question: 'Why does gravity vary by planet?', answer: 'Surface gravity depends on a planet\'s mass and physical radius, altering the gravitational pull experienced at its surface.' }
    ],
    relatedSlugs: ['escape-velocity', 'keplerian-period'],
    seoTitle: 'Solar Planet Weight & Gravity Comparison Calculator',
    seoDescription: 'Calculate your weight on Mars, the Moon, and Jupiter based on surface gravity ratios.',
    calculate: (inputs) => {
      const wt = Number(inputs.weightEarthQty || 150);
      const planet = inputs.planetDests || 'mars';

      let gravityRatio = 0.38; // Mars default
      if (planet === 'moon') gravityRatio = 0.166;
      if (planet === 'jupiter') gravityRatio = 2.53;

      const targetWt = wt * gravityRatio;

      return {
        results: [
          { label: 'Weight on Destination Planet', value: targetWt.toFixed(1), unit: 'lbs', isPrimary: true },
          { label: 'Surface gravity relative to Earth', value: (gravityRatio * 100).toFixed(1), unit: '%', isPrimary: true },
          { label: 'Sensation Rating', value: gravityRatio < 1 ? 'Lighter feeling jump' : 'Heavy, high muscular strain' }
        ]
      };
    }
  },
  {
    id: 'keplerian-period',
    name: 'Keplerian Period / Orbital Speed Calculator',
    slug: 'keplerian-period',
    category: 'space-astronomy',
    description: 'Calculate orbital periods and velocities using Kepler\'s Third Law of Planetary Motion.',
    formula: 'T^2 = a^3 [for solar Kepler orbits]',
    explanation: 'Uses orbital radii (in Astronomical Units) to calculate the orbital period (in Earth years) for solar path satellites.',
    example: 'An orbit at 5.2 AU (Jupiter\'s distance) has a Keplerian period of exactly 11.8 Earth years.',
    inputs: [
      { id: 'orbitalSemiMajorAu', label: 'Orbital Distance (Semi-Major Axis) (AU)', type: 'number', defaultValue: 5.2, min: 0.05, max: 100.0, step: 0.1 }
    ],
    faq: [
      { question: 'What is Kepler\'s Third Law?', answer: 'Kepler\'s Third Law states that the square of a planet\'s orbital period is directly proportional to the cube of its semi-major axis.' }
    ],
    relatedSlugs: ['gravitational-force', 'gravity-comparison'],
    seoTitle: 'Keplerian Planet Orbital Period & Speed Calculator',
    seoDescription: 'Calculate the orbital period of celestial bodies based on orbital distance (in Astronomical Units).',
    calculate: (inputs) => {
      const a = Number(inputs.orbitalSemiMajorAu || 1);

      // T = SQRT(a^3)
      const periodYrs = Math.sqrt(Math.pow(a, 3));
      
      // Calculate average orbital speed in km/s: circumference / period
      // Base Earth speed is 29.78 km/s
      const orbitalSpeedKms = 29.78 / Math.sqrt(a);

      return {
        results: [
          { label: 'Orbital Period (T)', value: periodYrs.toFixed(2), unit: 'Earth Years', isPrimary: true },
          { label: 'Average Orbital Speed', value: orbitalSpeedKms.toFixed(1), unit: 'km / sec', isPrimary: true },
          { label: 'Aggregate Days in Year', value: Math.ceil(periodYrs * 365.25), unit: 'days' }
        ]
      };
    }
  },

  // ====================================== WEATHER & CLIMATE ======================================
  {
    id: 'wind-chill',
    name: 'Wind Chill Calculator',
    slug: 'wind-chill',
    category: 'weather-climate',
    description: 'Calculate perceived wind chill indicators based on air temperature and wind speed.',
    formula: 'Wind Chill = 35.74 + 0.6215*T - 35.75*v^0.16 + 0.4275*T*v^0.16',
    explanation: 'Calculates perceived temperatures (US National Weather Service formula) to evaluate frostbite risks during cold weather.',
    example: 'A 20°F day under a 20 mph wind gusts yields an icy wind chill of 4°F.',
    inputs: [
      { id: 'ambientAirTempF', label: 'Ambient Air Temperature (°F)', type: 'number', defaultValue: 25, min: -60, max: 50 },
      { id: 'windVelocityMph', label: 'Wind Velocity Speed (mph)', type: 'number', defaultValue: 15, min: 3, max: 100 }
    ],
    faq: [
      { question: 'When is Wind Chill index valid?', answer: 'The wind chill formula applies to cold temperatures below 50°F and wind speeds exceeding 3 mph.' }
    ],
    relatedSlugs: ['dew-point-calc', 'carbon-footprint'],
    seoTitle: 'Dynamic Wind Chill Frostbite Risk Calculator',
    seoDescription: 'Calculate cold wind chill ratings and frostbite risks based on wind speed and temperature.',
    calculate: (inputs) => {
      const t = Number(inputs.ambientAirTempF || 30);
      const v = Number(inputs.windVelocityMph || 10);

      let windChill = t;
      if (t <= 50 && v >= 3) {
        windChill = 35.74 + (0.6215 * t) - (35.75 * Math.pow(v, 0.16)) + (0.4275 * t * Math.pow(v, 0.16));
      }

      const frostbiteRisk = windChill < -15 ? 'High (Under 20 minutes danger)' : 'Minimal';

      return {
        results: [
          { label: 'Perceived Wind Chill', value: Math.round(windChill), unit: '°F', isPrimary: true },
          { label: 'Frostbite Risk Tier', value: frostbiteRisk, isPrimary: true },
          { label: 'Ambient Air Temperature', value: t, unit: '°F' }
        ]
      };
    }
  },
  {
    id: 'dew-point-calc',
    name: 'Relative Humidity / Dew Point Calculator',
    slug: 'dew-point-calc',
    category: 'weather-climate',
    description: 'Calculate dew points and humidity bounds using ambient temperatures and relative humidity.',
    formula: 'Dew Point = T - ((100 - RH)/5) (Magnus-Tetens Approximation)',
    explanation: 'Estimates dew point temperatures, helping users predict precipitation risks and mugginess levels.',
    example: 'At 75°F and 60% relative humidity, moisture condenses at a dew point of 59°F.',
    inputs: [
      { id: 'bulbTempFahrenheit', label: 'Ambient Temp (°F)', type: 'number', defaultValue: 72, min: -20, max: 120 },
      { id: 'humidityPercentage', label: 'Relative Humidity (%)', type: 'number', defaultValue: 55, min: 1, max: 100 }
    ],
    faq: [
      { question: 'What does dew point measure?', answer: 'Dew point represents the temperature to which air must be cooled to saturate, causing moisture to condense into fog, dew, or frost.' }
    ],
    relatedSlugs: ['wind-chill', 'rain-harvesting'],
    seoTitle: 'Dew Point Temperature & Relative Humidity Calculator',
    seoDescription: 'Calculate dew points and humidity bounds to predict precipitation risks and mugginess levels.',
    calculate: (inputs) => {
      const t = Number(inputs.bulbTempFahrenheit || 70);
      const rh = Number(inputs.humidityPercentage || 50);

      const tC = (t - 32) * (5 / 9);
      // Magnus-Tetens approximation
      const dewPointC = tC - ((100 - rh) / 5);
      const dewPointF = (dewPointC * 9 / 5) + 32;

      let muggyLevel = 'Comfortable dry air';
      if (dewPointF > 60) muggyLevel = 'Muggy humid air';
      if (dewPointF > 70) muggyLevel = 'Extremely sticky weather';

      return {
        results: [
          { label: 'Dew Point Temperature', value: Math.round(dewPointF), unit: '°F', isPrimary: true },
          { label: 'Observed Humidity Comfort', value: muggyLevel, isPrimary: true },
          { label: 'Dew Point Celsius Match', value: dewPointC.toFixed(1), unit: '°C' }
        ]
      };
    }
  },
  {
    id: 'rain-harvesting',
    name: 'Rain Harvesting / Storm Runoff Calculator',
    slug: 'rain-harvesting',
    category: 'weather-climate',
    description: 'Calculate rainwater harvesting potential and storm runoff volumes using roof dimensions.',
    formula: 'Gallons Harvested = Roof Area (sq ft) * Rainfall (inches) * 0.62',
    explanation: 'Estimates rainfall runoff volumes based on catchment area (roof size) and rainfall depth.',
    example: 'A 1,500 sq ft roof receiving 1 inch of rainfall yields exactly 930 gallons of storable rainwater.',
    inputs: [
      { id: 'roofCatchmentAreaSqFt', label: 'Catchment Area / Roof Size (sq ft)', type: 'number', defaultValue: 1500, min: 10, max: 100000 },
      { id: 'measuredRainfallInches', label: 'Storm Rainfall Depth (inches)', type: 'number', defaultValue: 1.0, min: 0.1, max: 20.0, step: 0.1 }
    ],
    faq: [
      { question: 'How is the rainwater runoff coefficient determined?', answer: 'A coefficient of 0.62 represents the volume of water collected by 1 inch of rain on a 1-square-foot surface, assuming a 15% loss to evaporation.' }
    ],
    relatedSlugs: ['dew-point-calc', 'solar-panel'],
    seoTitle: 'Rainwater Harvesting & Catchment Collection Calculator',
    seoDescription: 'Estimate storm runoff volume and rainwater harvesting potential based on catchment size and rainfall.',
    calculate: (inputs) => {
      const area = Number(inputs.roofCatchmentAreaSqFt || 1000);
      const rain = Number(inputs.measuredRainfallInches || 1.0);

      // 1 inch of rain on 1 sq ft yields 0.623 gallons of water
      const theoreticalGallons = area * rain * 0.623;
      const actualYieldWithLoss = theoreticalGallons * 0.90; // 10% structural collection losses

      return {
        results: [
          { label: 'Collected Water Volume', value: Math.round(actualYieldWithLoss), unit: 'Gallons', isPrimary: true },
          { label: 'Theoretical Runoff Value', value: Math.round(theoreticalGallons), unit: 'Gallons', isPrimary: true },
          { label: 'Staggered 55-Gal Prep Barrels Required', value: Math.ceil(actualYieldWithLoss / 55) }
        ]
      };
    }
  },
  {
    id: 'carbon-footprint',
    name: 'Carbon Footprint Calculator',
    slug: 'carbon-footprint',
    category: 'weather-climate',
    description: 'Calculate monthly CO₂ emissions based on utility usage and vehicle travel mileage.',
    formula: 'CO₂ emissions = Electric kWh * 0.85 + Gas Gallons * 19.6',
    explanation: 'Uses standard EPA conversion factors to calculate greenhouse gas emissions from utility usage and commuting.',
    example: 'Using 500 kWh of electricity and driving 1,000 miles monthly produces ~1,200 lbs of CO₂ emissions.',
    inputs: [
      { id: 'electricityMonthlyKwh', label: 'Monthly Electricity Usage (kWh)', type: 'number', defaultValue: 450, min: 0 },
      { id: 'automotiveGasSpentGallons', label: 'Average Gas Spent (Gallons / month)', type: 'number', defaultValue: 45, min: 0 }
    ],
    faq: [
      { question: 'What is a carbon offset?', answer: 'Carbon offsets fund environmental projects (such as reforestation or renewable energy) that reduce or capture greenhouse gas emissions to balance out carbon footprints.' }
    ],
    relatedSlugs: ['solar-panel', 'rain-harvesting'],
    seoTitle: 'Personal Carbon Footprint & CO₂ Emission Calculator',
    seoDescription: 'Calculate greenhouse gas emissions from utility usage and vehicle commuting based on EPA standards.',
    calculate: (inputs) => {
      const kwh = Number(inputs.electricityMonthlyKwh || 0);
      const gasGallons = Number(inputs.automotiveGasSpentGallons || 0);

      // EPA CO2 emission conversion factors:
      // Electricity: 0.85 lbs CO2 per kWh (average utility grid mix)
      // Gasoline: 19.6 lbs CO2 per gallon burnt
      const electricCO2 = kwh * 0.85;
      const gasolineCO2 = gasGallons * 19.6;
      const combinedOverallCO2Lbs = electricCO2 + gasolineCO2;

      return {
        results: [
          { label: 'Monthly Carbon Footprint', value: Math.round(combinedOverallCO2Lbs), unit: 'lbs CO₂', isPrimary: true },
          { label: 'Annual Footprint Projected', value: Math.round((combinedOverallCO2Lbs * 12) / 2000), unit: 'Metric Tons', isPrimary: true },
          { label: 'Offset Trees Required', value: Math.ceil((combinedOverallCO2Lbs * 12) / 48), unit: 'trees / year' }
        ]
      };
    }
  },
  {
    id: 'solar-panel',
    name: 'Solar Panel Generation Estimator',
    slug: 'solar-panel',
    category: 'weather-climate',
    description: 'Calculate solar energy generation potentials and project utility savings based on sunshine hours.',
    formula: 'Energy Output = System Capacity (kW) * Peak Sunshine Hours * Efficiency Factor',
    explanation: 'Calculates solar energy potential and utility bill savings based on system size and regional peak sunshine hours.',
    example: 'A 6 kW solar panel array in a region with 4.5 peak sun hours per day produces ~729 kWh of energy monthly.',
    inputs: [
      { id: 'solarSystemSizeKw', label: 'Solar Panel Array Size (kW)', type: 'number', defaultValue: 6.0, min: 1.0, max: 100.0, step: 0.5 },
      { id: 'peakSunHoursDaily', label: 'Average Peak Daily Sunshine (Hours)', type: 'number', defaultValue: 4.5, min: 1.0, max: 10.0, step: 0.1 },
      { id: 'localElectricCostKwh', label: 'Grid Electricity Retail Cost ($/kWh)', type: 'number', defaultValue: 0.17, min: 0.05, max: 1.0, step: 0.01 }
    ],
    faq: [
      { question: 'What are peaks sunshine hours?', answer: 'Peak sun hours represent the period when solar radiation intensity averages 1,000 watts per square meter, serving as the benchmark for solar solar panel output formulas.' }
    ],
    relatedSlugs: ['carbon-footprint', 'rain-harvesting'],
    seoTitle: 'Solar Panel Energy Output & Utility Bill Savings Calculator',
    seoDescription: 'Estimate energy potential and utility savings based on solar array size and peak sunshine hours.',
    calculate: (inputs) => {
      const size = Number(inputs.solarSystemSizeKw || 5.0);
      const hours = Number(inputs.peakSunHoursDaily || 4.0);
      const cost = Number(inputs.localElectricCostKwh || 0.15);

      const dailyGenerationKwh = size * hours * 0.82; // 18% structural clipping/inverter loss
      const monthlyGenerationKwh = dailyGenerationKwh * 30.4;
      const monthlySavingsDollars = monthlyGenerationKwh * cost;

      return {
        results: [
          { label: 'Monthly Energy Output', value: Math.round(monthlyGenerationKwh), unit: 'kWh / month', isPrimary: true },
          { label: 'Monthly Utility Bill Savings', value: Math.round(monthlySavingsDollars), unit: '$ / month', isPrimary: true },
          { label: 'Daily Energy Output', value: dailyGenerationKwh.toFixed(1), unit: 'kWh / day' }
        ]
      };
    }
  },

  // ====================================== AGRICULTURE ======================================
  {
    id: 'crop-yield',
    name: 'Crop Yield Estimator',
    slug: 'crop-yield',
    category: 'agriculture',
    description: 'Calculate crop harvests and storage requirements based on field size and planting density.',
    formula: 'Harvest yield = Plant Count * Harvest Weight per Plant',
    explanation: 'Estimates crop yields using field size, raw row spacing, and crop weight averages.',
    example: 'A 1-acre corn field with standard planting density yields roughly 160 bushels.',
    inputs: [
      { id: 'acreFieldsWeight', label: 'Cultivable Crop Area (Acres)', type: 'number', defaultValue: 5.0, min: 0.1, max: 10000 },
      { id: 'agricultureCropType', label: 'Farmed Crop Archetype', type: 'select', defaultValue: 'corn', options: [
        { label: 'Silo Grain Corn (165 bushels per acre average)', value: 'corn' },
        { label: 'Wheat grain (1 or 2 high cuts: 50 bushels per acre)', value: 'wheat' },
        { label: 'Soybeans (45 bushels per acre)', value: 'soy' }
      ]}
    ],
    faq: [
      { question: 'How is crop yield data standardized?', answer: 'Yield estimates are standardized using crop-specific bushel weights, helping farmers plan elevator processing storage.' }
    ],
    relatedSlugs: ['fertilizer-coverage', 'soil-amendment'],
    seoTitle: 'Grain Corn & Wheat Crop Yield Estimator',
    seoDescription: 'Calculate crop harvests and storage requirements based on field size and planting density.',
    calculate: (inputs) => {
      const acres = Number(inputs.acreFieldsWeight || 1);
      const crop = inputs.agricultureCropType || 'corn';

      let bushelsPerAcre = 165;
      if (crop === 'wheat') bushelsPerAcre = 50;
      if (crop === 'soy') bushelsPerAcre = 45;

      const totalBushels = acres * bushelsPerAcre;
      const standardBushelWeightLbs = crop === 'corn' ? 56 : 60; // corn standard 56 lbs, wheat standard 60 lbs
      const totalTons = (totalBushels * standardBushelWeightLbs) / 2000;

      return {
        results: [
          { label: 'Aggregated Harvest Yield', value: Math.round(totalBushels), unit: 'Bushels', isPrimary: true },
          { label: 'Overall Structural Weight', value: totalTons.toFixed(1), unit: 'Tons', isPrimary: true },
          { label: 'Standard Rating', value: acres > 50 ? 'Commercial farm level' : 'Family homestead level' }
        ]
      };
    }
  },
  {
    id: 'fertilizer-coverage',
    name: 'Fertilizer Coverage Calculator',
    slug: 'fertilizer-coverage',
    category: 'agriculture',
    description: 'Calculate proper fertilizer application rates using N-P-K ingredient ratios.',
    formula: 'Application Weight = Target Nitrogen Weight / Nitrogen Percentage',
    explanation: 'Uses N-P-K nutrient ratios to calculate the exact crop fertilizer weights needed for target fields, preventing burning.',
    example: 'Applying 1 pound of Nitrogen per 1,000 sq ft using a 10-10-10 blend requires 10 pounds of fertilizer.',
    inputs: [
      { id: 'fieldAreaSqFt', label: 'Field Coverage Area (sq ft)', type: 'number', defaultValue: 10000, min: 100 },
      { id: 'fertilizerNPKRation', label: 'Representative N-P-K Nutrient Blend', type: 'select', defaultValue: 'triple10', options: [
        { label: 'Triple 10 Balanced (10% N, 10% P, 10% K)', value: 'triple10' },
        { label: 'High Nitrogen Blend (21% N, 0% P, 0% K)', value: 'highN' },
        { label: 'Turf Starter Blend (24% N, 25% P, 4% K)', value: 'starter' }
      ]},
      { id: 'targetNitrogenLbsSqFt', label: 'Target Nitrogen Rate (lbs / 1,000 sq ft)', type: 'number', defaultValue: 1.0, min: 0.1, max: 4.0, step: 0.1 }
    ],
    faq: [
      { question: 'What does N-P-K stand for in agriculture?', answer: 'N-P-K represents the percentages of Nitrogen (N) for foliage, Phosphorus (P) for roots, and Potassium (K) for overall plant vascular health.' }
    ],
    relatedSlugs: ['crop-yield', 'soil-amendment'],
    seoTitle: 'NPK Agricultural Fertilizer Coverage & Weight Calculator',
    seoDescription: 'Calculate the weight of fertilizer needed for target fields using N-P-K ingredient ratios.',
    calculate: (inputs) => {
      const area = Number(inputs.fieldAreaSqFt || 1000);
      const blend = inputs.fertilizerNPKRation || 'triple10';
      const targetN = Number(inputs.targetNitrogenLbsSqFt || 1.0);

      let nPercent = 0.10;
      if (blend === 'highN') nPercent = 0.21;
      if (blend === 'starter') nPercent = 0.24;

      const rawBagsNeeded1000SqFt = targetN / nPercent;
      const finalWeightRequiredLbs = rawBagsNeeded1000SqFt * (area / 1000);

      return {
        results: [
          { label: 'Required Fertilizer Weight', value: Math.round(finalWeightRequiredLbs), unit: 'lbs', isPrimary: true },
          { label: 'Nitrogen Active Component', value: Math.round(finalWeightRequiredLbs * nPercent), unit: 'lbs', isPrimary: true },
          { label: 'Coverage Area', value: area.toLocaleString(), unit: 'sq ft' }
        ]
      };
    }
  },
  {
    id: 'soil-amendment',
    name: 'Soil Amendment Calculator',
    slug: 'soil-amendment',
    category: 'agriculture',
    description: 'Calculate organic matter, lime, or sulfur weights to raise soil quality.',
    formula: 'Amendment Weight = Field Area * Target Depth * Specific Mass',
    explanation: 'Uses depth metrics and density scales to calculate compost and topsoil volumes for crop fields.',
    example: 'Covering 1,000 sq ft with 2 inches of rich compost requires about 6 cubic yards of organic bulk.',
    inputs: [
      { id: 'gardenBedAreaSqFt', label: 'Field Coverage Area (sq ft)', type: 'number', defaultValue: 500, min: 10, max: 100000 },
      { id: 'compostDepthInches', label: 'Desired Treatment Depth (inches)', type: 'number', defaultValue: 2, min: 0.5, max: 12, step: 0.5 }
    ],
    faq: [
      { question: 'Why add organic compost?', answer: 'Organic compost improves physical soil structure, builds water retention capacity, and stimulates beneficial soil microbiomes.' }
    ],
    relatedSlugs: ['crop-yield', 'irrigation-water'],
    seoTitle: 'Bulk Soil Compost & Garden Amendment Volume Calculator',
    seoDescription: 'Calculate compost and topsoil volumes in cubic yards based on field size and desired treatment depth.',
    calculate: (inputs) => {
      const area = Number(inputs.gardenBedAreaSqFt || 100);
      const depth = Number(inputs.compostDepthInches || 2);

      const depthFeet = depth / 12;
      const cubicFeet = area * depthFeet;
      const cubicYards = cubicFeet / 27;

      return {
        results: [
          { label: 'compost Bulk Volume', value: cubicYards.toFixed(1), unit: 'Cubic Yards', isPrimary: true },
          { label: 'Standard cubic Feet bulk', value: Math.round(cubicFeet), unit: 'cu ft', isPrimary: true },
          { label: 'Individual 2 cu ft Bags Alternative', value: Math.ceil(cubicFeet / 2), unit: 'bags' }
        ]
      };
    }
  },
  {
    id: 'irrigation-water',
    name: 'Irrigation Water Calculator',
    slug: 'irrigation-water',
    category: 'agriculture',
    description: 'Calculate dynamic crop water requirements based on field dimensions and evapotranspiration rates.',
    formula: 'Irrigation Volume = Evapotranspiration Rate * Area * Efficiency Buffer',
    explanation: 'Estimates irrigation needs based on evapotranspiration (soil water evaporation and plant transpiration rates).',
    example: 'irrigation a 2-acre plot requiring 0.2 inches of daily water takes ~10,800 gallons of water.',
    inputs: [
      { id: 'cultivationAreaAcres', label: 'Cultivation Field Area (Acres)', type: 'number', defaultValue: 2.0, min: 0.1, max: 5000 },
      { id: 'climateEvaporationIn', label: 'Daily Evapotranspiration Rate (inches)', type: 'number', defaultValue: 0.20, min: 0.01, max: 1.5, step: 0.01 }
    ],
    faq: [
      { question: 'What is evapotranspiration (ET)?', answer: 'Evapotranspiration measures water loss from soil surface evaporation combined with water movement through crop root leaves in warm climates.' }
    ],
    relatedSlugs: ['soil-amendment', 'crop-yield'],
    seoTitle: 'Evapotranspiration & Agricultural Irrigation Water Volume Calculator',
    seoDescription: 'Calculate required irrigation water volumes based on evapotranspiration rates and field acreage.',
    calculate: (inputs) => {
      const acres = Number(inputs.cultivationAreaAcres || 1);
      const et = Number(inputs.climateEvaporationIn || 0.15);

      const acreFootGallons = 325851; // 1 acre-foot is 325,851 gallons
      const depthFeet = et / 12;
      const irrigationGallonsTheoretical = acres * depthFeet * acreFootGallons;
      const irrigationGallonsWithSystemOverheadLoss = irrigationGallonsTheoretical * 1.15; // 15% piping pressure and wind spray drift loss

      return {
        results: [
          { label: 'Required Irrigation Volume', value: Math.round(irrigationGallonsWithSystemOverheadLoss), unit: 'Gallons / day', isPrimary: true },
          { label: 'Acres to Cover', value: acres, unit: 'Acres', isPrimary: true },
          { label: 'Equivalent Acre-Inches', value: (acres * et).toFixed(2), unit: 'ac-in' }
        ]
      };
    }
  },
  {
    id: 'livestock-feed',
    name: 'Livestock Feed Intake Calculator',
    slug: 'livestock-feed',
    category: 'agriculture',
    description: 'Calculate daily organic feed weights for cattle, swine, and sheep based on weight benchmarks.',
    formula: 'Daily Feed = Body Weight * Consumption Percentage',
    explanation: 'Uses animal body weights and feed intake benchmarks (typically 2-3% of body weight) to calculate daily feed requirements.',
    example: 'A herd of 10 beef cattle (avg weight: 1,100 lbs apiece) eating a 2.5% daily dry matter ration requires 275 pounds of feed daily.',
    inputs: [
      { id: 'livestockCategoryCode', label: 'Animal Category Profile', type: 'select', defaultValue: 'cattle', options: [
        { label: 'Beef Cattle (2.5% of body weight consumption)', value: 'cattle' },
        { label: 'Swine / Pig (Dry Feed Mix: 3.5% of body weight consumption)', value: 'swine' },
        { label: 'Sheep / Ewes (Dry Matter: 3.0% of body weight consumption)', value: 'sheep' }
      ]},
      { id: 'livestockAverageWeightLbs', label: 'Average Body Weight (lbs / head)', type: 'number', defaultValue: 1100, min: 50 },
      { id: 'herdHeadCounts', label: 'Number of Animals in Herd', type: 'number', defaultValue: 12, min: 1 }
    ],
    faq: [
      { question: 'What is dry matter intake (DMI)?', answer: 'Dry matter intake measures consumption with food moisture content removed, standardizing nutrition targets across wet pasture or dry grain formulas.' }
    ],
    relatedSlugs: ['crop-yield', 'fertilizer-coverage'],
    seoTitle: 'Daily Herd Livestock Feed Weight Calculator',
    seoDescription: 'Calculate organic dry matter feed requirements for sheep, swine, and cattle based on weight and herd size.',
    calculate: (inputs) => {
      const type = inputs.livestockCategoryCode || 'cattle';
      const weight = Number(inputs.livestockAverageWeightLbs || 1000);
      const size = Number(inputs.herdHeadCounts || 10);

      let pct = 0.025; // cattle dry feed
      if (type === 'swine') pct = 0.035;
      if (type === 'sheep') pct = 0.030;

      const dailyFeedPerHeadLbs = weight * pct;
      const dailyFeedHerdLbs = dailyFeedPerHeadLbs * size;

      return {
        results: [
          { label: 'Daily Feed for Herd', value: Math.round(dailyFeedHerdLbs), unit: 'lbs / day', isPrimary: true },
          { label: 'Weekly Feed Supply Required', value: Math.round(dailyFeedHerdLbs * 7), unit: 'lbs / week', isPrimary: true },
          { label: 'Daily Feed Per Animal', value: dailyFeedPerHeadLbs.toFixed(1), unit: 'lbs / head' }
        ]
      };
    }
  }
];
