import { Calculator } from '../types';

export const V20_PART1_CALCULATORS: Calculator[] = [
  // ====================================== HUMAN RESOURCES ======================================
  {
    id: 'salary-comparison',
    name: 'Salary Comparison Calculator',
    slug: 'salary-comparison',
    category: 'human-resources',
    description: 'Compare two detailed compensation packages side-by-side, taking base salary, bonuses, benefits, and taxes into account.',
    formula: 'Total Package = Base Salary + Bonuses + Benefits Value - Est. Taxes',
    explanation: 'Helps job candidates evaluate multiple employment offers objectively. It aggregates direct cash items, non-cash perks, tax brackets, and cost-of-living adjustments (COLA) to identify the true highest-value offer.',
    example: 'Offer A: $100K base, 10% bonus, $5K benefits. Offer B: $110K base, 2% bonus, $1K benefits. This tool shows which provides higher net value.',
    inputs: [
      { id: 'baseA', label: 'Offer A - Base Salary ($/yr)', type: 'number', defaultValue: 95000, min: 0 },
      { id: 'bonusA', label: 'Offer A - Annual Bonus ($/yr)', type: 'number', defaultValue: 8000, min: 0 },
      { id: 'benefitsA', label: 'Offer A - Benefits Value ($/yr)', type: 'number', defaultValue: 6000, min: 0 },
      { id: 'taxRateA', label: 'Offer A - Est. Tax Rate (%)', type: 'number', defaultValue: 22, min: 0, max: 100, step: 0.5 },
      { id: 'baseB', label: 'Offer B - Base Salary ($/yr)', type: 'number', defaultValue: 105000, min: 0 },
      { id: 'bonusB', label: 'Offer B - Annual Bonus ($/yr)', type: 'number', defaultValue: 2000, min: 0 },
      { id: 'benefitsB', label: 'Offer B - Benefits Value ($/yr)', type: 'number', defaultValue: 4500, min: 0 },
      { id: 'taxRateB', label: 'Offer B - Est. Tax Rate (%)', type: 'number', defaultValue: 24, min: 0, max: 100, step: 0.5 }
    ],
    faq: [
      { question: 'What counts as benefits value?', answer: 'Benefits value includes healthcare coverage premiums paid by the employer, 401(k) retirement matching, tuition reimbursements, gym memberships, stock options, and paid time off (converted to a cash equivalent).' },
      { question: 'Why is the tax rate applied to bonuses as well?', answer: 'In most tax systems, bonuses are treated as ordinary income or supplemental income, and are subject to federal and state income taxes in the same categories.' }
    ],
    relatedSlugs: ['employee-cost', 'hiring-cost', 'working-hours'],
    seoTitle: 'Salary & Compensation Offer Comparison Calculator | Calculatoora',
    seoDescription: 'Compare job offer packages side-by-side. Calculate cash components, benefits values, tax rates, and bonuses to determine your actual net compensation.',
    calculate: (inputs) => {
      const baseA = Number(inputs.baseA || 0);
      const bonusA = Number(inputs.bonusA || 0);
      const benefitsA = Number(inputs.benefitsA || 0);
      const taxRateA = Number(inputs.taxRateA || 0) / 100;

      const baseB = Number(inputs.baseB || 0);
      const bonusB = Number(inputs.bonusB || 0);
      const benefitsB = Number(inputs.benefitsB || 0);
      const taxRateB = Number(inputs.taxRateB || 0) / 100;

      const totalGrossA = baseA + bonusA + benefitsA;
      const netA = (baseA + bonusA) * (1 - taxRateA) + benefitsA;

      const totalGrossB = baseB + bonusB + benefitsB;
      const netB = (baseB + bonusB) * (1 - taxRateB) + benefitsB;

      const diffGross = totalGrossB - totalGrossA;
      const pctDiffGross = totalGrossA > 0 ? (diffGross / totalGrossA) * 100 : 0;
      const diffNet = netB - netA;
      const pctDiffNet = netA > 0 ? (diffNet / netA) * 100 : 0;

      const prefer = netB > netA ? 'Offer B' : netB < netA ? 'Offer A' : 'Both represent equivalent value';

      return {
        results: [
          { label: 'Recommended Choice', value: prefer, isPrimary: true },
          { label: 'Offer A Total Gross', value: totalGrossA.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Offer A Net Annual Value', value: netA.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Offer B Total Gross', value: totalGrossB.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Offer B Net Annual Value', value: netB.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Net Difference (B - A)', value: diffNet.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Net Difference Percentage', value: `${pctDiffNet > 0 ? '+' : ''}${pctDiffNet.toFixed(1)}%` }
        ],
        chartData: {
          labels: ['Gross Offer A', 'Net Offer A', 'Gross Offer B', 'Net Offer B'],
          values: [totalGrossA, netA, totalGrossB, netB],
          colors: ['#3b82f6', '#10b981', '#6366f1', '#8b5cf6']
        }
      };
    }
  },
  {
    id: 'employee-cost',
    name: 'Employee Cost Calculator',
    slug: 'employee-cost',
    category: 'human-resources',
    description: 'Calculate the total actual cost of hiring and retaining an employee, including taxes, benefits, overhead, and insurance.',
    formula: 'Total Employee Burden = Base Salary + Payroll Taxes + Benefits Cost + Overhead Allowance',
    explanation: 'Hiring a worker costs significantly more than their flat salary. This calculator computes federal/state payroll tax percentages (unemployment, security), healthcare metrics, PTO adjustments, and facilities overhead.',
    example: 'An employee with an $80K annual base salary may run an actual employer cost close to $105K after summing taxes and benefits.',
    inputs: [
      { id: 'salary', label: 'Employee Base Salary ($/yr)', type: 'number', defaultValue: 75000, min: 0 },
      { id: 'payrollTax', label: 'Employer Payroll Taxes (FICA, FUTA, SUTA) (%)', type: 'number', defaultValue: 8.5, min: 0, max: 100, step: 0.1 },
      { id: 'benefits', label: 'Healthcare & Insurance Contributions ($/yr)', type: 'number', defaultValue: 6000, min: 0 },
      { id: 'retirement', label: 'Company 401(k) / Retirement Matching ($/yr)', type: 'number', defaultValue: 2500, min: 0 },
      { id: 'overhead', label: 'Office Space, Hardware & Softwares Allowance ($/yr)', type: 'number', defaultValue: 4000, min: 0 }
    ],
    faq: [
      { question: 'What is the standard employee burden multiplier?', answer: 'In corporate finance, the standard burden multiplier scales between 1.25x and 1.4x of the employee\'s base salary, representing retirement matches, health packages, space rental, and equipment leases.' },
      { question: 'Does employer social security tax have a cap?', answer: 'Yes, in the US, the Social Security tax (6.2%) stops accruing once an employee\'s earnings exceed the yearly wage limit, which is adjusted annually by the IRS.' }
    ],
    relatedSlugs: ['salary-comparison', 'hiring-cost', 'hr-budget'],
    seoTitle: 'Total Cost of Employee Calculator | Employer Burden Analysis',
    seoDescription: 'Accurately estimate the full cost of an employee to a business. Computes salary, payroll tax, health, 401k match, and administrative overhead.',
    calculate: (inputs) => {
      const salary = Number(inputs.salary || 0);
      const payrollTaxRate = Number(inputs.payrollTax || 0) / 100;
      const benefits = Number(inputs.benefits || 0);
      const retirement = Number(inputs.retirement || 0);
      const overhead = Number(inputs.overhead || 0);

      const taxCost = salary * payrollTaxRate;
      const totalCost = salary + taxCost + benefits + retirement + overhead;
      const multiplier = salary > 0 ? totalCost / salary : 0;

      return {
        results: [
          { label: 'Total Fully-Burdened Cost', value: totalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Salary to Cost Ratio (Burden Multiplier)', value: `${multiplier.toFixed(2)}x`, isPrimary: true },
          { label: 'Estimated Payroll Taxes', value: taxCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Direct Benefits & Matching Cost', value: (benefits + retirement).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Office/Equipment Overhead', value: overhead.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ],
        chartData: {
          labels: ['Base Salary', 'Payroll Taxes', 'Benefits / Retirement', 'Overhead Spends'],
          values: [salary, taxCost, benefits + retirement, overhead],
          colors: ['#10b981', '#ef4444', '#f59e0b', '#3b82f6']
        }
      };
    }
  },
  {
    id: 'hiring-cost',
    name: 'Hiring Cost Calculator',
    slug: 'hiring-cost',
    category: 'human-resources',
    description: 'Structure and forecast total costs associated with sourcing, interviewing, background checking, and onboarding new workforce hires.',
    formula: 'Cost Per Hire = Sourcing Fees + Sourcing Interview Hours Cost + Agency Fees + Background & Admin Costs + Training Allocation',
    explanation: 'Organizations often underestimate the cost of recruiting. This calculator tracks board directory placement fees, recruiter labor rates, onboarding materials, internal interview schedules, and training timelines.',
    example: 'Hiring an engineer with job boards at $500, recruiter agency percentage of $5,000, and 20 internal staff interview hours results in thousands of dollars in hidden costs.',
    inputs: [
      { id: 'boardFees', label: 'Job Boards & Advertising Fees ($)', type: 'number', defaultValue: 450, min: 0 },
      { id: 'agencyFees', label: 'External Agency / Headhunter Commissions ($)', type: 'number', defaultValue: 2500, min: 0 },
      { id: 'interviewHours', label: 'Internal Staff Sourcing & Interviewing (Hours)', type: 'number', defaultValue: 24, min: 0 },
      { id: 'averageStaffRate', label: 'Average Staff Rate ($/hr)', type: 'number', defaultValue: 55, min: 0 },
      { id: 'backgroundAdmin', label: 'Background Screening & HR Administration ($)', type: 'number', defaultValue: 200, min: 0 },
      { id: 'onboardTrainingValue', label: 'Onboarding & Training Materials Spends ($)', type: 'number', defaultValue: 1200, min: 0 }
    ],
    faq: [
      { question: 'What is the average cost-per-hire globally?', answer: 'According to HR publications, the average cost-per-hire is approximately $4,700, and can skyrocket to over $15,000 for executive-level, specialized technical, or highly competitive sales positions.' },
      { question: 'Should internal staff hours count as a real cost?', answer: 'Yes! Internal staff hours spent looking through résumés and conducting video/on-site interviews represent highly valuable developer or manager time lost to core business productivity.' }
    ],
    relatedSlugs: ['employee-cost', 'employee-turnover', 'hr-budget'],
    seoTitle: 'Hiring & Recruiting Cost Calculator | Cost-Per-Hire Budgeting',
    seoDescription: 'Find your actual full hiring and recruitment costs. Tracks sourcing ads, internal interviewer labor value, screening fees, and onboarding training costs.',
    calculate: (inputs) => {
      const boardFees = Number(inputs.boardFees || 0);
      const agencyFees = Number(inputs.agencyFees || 0);
      const interviewHours = Number(inputs.interviewHours || 0);
      const averageStaffRate = Number(inputs.averageStaffRate || 0);
      const backgroundAdmin = Number(inputs.backgroundAdmin || 0);
      const onboardTrainingValue = Number(inputs.onboardTrainingValue || 0);

      const internalHoursCost = interviewHours * averageStaffRate;
      const totalRecruitmentCost = boardFees + agencyFees + internalHoursCost + backgroundAdmin + onboardTrainingValue;

      return {
        results: [
          { label: 'Total Cost-Per-Hire', value: totalRecruitmentCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Internal Labor Cost (Interviews)', value: internalHoursCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'External Sourcing & Placement Costs', value: (boardFees + agencyFees).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Admin, Screening & Onboarding Spend', value: (backgroundAdmin + onboardTrainingValue).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'employee-turnover',
    name: 'Employee Turnover Calculator',
    slug: 'employee-turnover',
    category: 'human-resources',
    description: 'Calculate your annual employee turnover rate and model the total financial damage of lost resources and workforce restarts.',
    formula: 'Turnover Rate = (Terminations during Period / Average Headcount) * 100',
    explanation: 'A high attrition rate decreases morale and imposes thousands of dollars in overhead. This calculator evaluates yearly separation ratios and multiplies them against standard fully-burdened replacement indicators.',
    example: 'Separating 10 workers in a 100-person firm creates a 10% turnover rate, resulting in substantial replacement costs.',
    inputs: [
      { id: 'terminations', label: 'Separated Employees (During Period)', type: 'number', defaultValue: 12, min: 0 },
      { id: 'averageHeadcount', label: 'Average Headcount of Organization', type: 'number', defaultValue: 80, min: 1 },
      { id: 'replacementCostMultiplier', label: 'Est. Replacement Cost per Worker ($)', type: 'number', defaultValue: 18000, min: 0 }
    ],
    faq: [
      { question: 'What is a typical healthy annual turnover rate?', answer: 'Average annual corporate turnover rate is around 10% to 15%, varying by industry (hospitality and retail are much higher, often exceeding 50%).' },
      { question: 'What makes up employee replacement costs?', answer: 'It is a combination of direct separation packages, hiring fees, candidate vetting, loss of tribal knowledge, and the lower efficiency of new starts in their first 90 days.' }
    ],
    relatedSlugs: ['retention-rate', 'hiring-cost', 'employee-cost'],
    seoTitle: 'Employee Attrition & Turnover Calculator | HR Financial Leakage',
    seoDescription: 'Calculate employee turnover percentages and model the annual financial damage of losing, recruiting, and retraining staff.',
    calculate: (inputs) => {
      const terminations = Number(inputs.terminations || 0);
      const avgHeadcount = Number(inputs.averageHeadcount || 1);
      const replacementCost = Number(inputs.replacementCostMultiplier || 15000);

      const turnoverRate = (terminations / avgHeadcount) * 100;
      const financialLoss = terminations * replacementCost;

      return {
        results: [
          { label: 'Annual Attrition / Turnover Rate', value: `${turnoverRate.toFixed(1)}%`, isPrimary: true },
          { label: 'Total Annual Financial Damage', value: financialLoss.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Average Staff Headcount', value: Math.round(avgHeadcount) },
          { label: 'Estimated Cost per Separation', value: replacementCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'retention-rate',
    name: 'Retention Rate Calculator',
    slug: 'retention-rate',
    category: 'human-resources',
    description: 'Determine the proportion of employees who stayed with the organization throughout a specified timeframe.',
    formula: 'Retention Rate = (Remaining Staff from Start Cohort / Initial Staff at Start) * 100',
    explanation: 'Tracks employee loyalty and engagement levels. New hires added during the calculation window are excluded to focus strictly on original cohort longevity.',
    example: 'Starting with 50 employees and keeping 45 of those same employees through December yields a 90% retention rate.',
    inputs: [
      { id: 'startCount', label: 'Staff Count at Start of Period', type: 'number', defaultValue: 60, min: 1 },
      { id: 'remainedCount', label: 'Number of Original Staff Remaining at End', type: 'number', defaultValue: 54, min: 0 }
    ],
    faq: [
      { question: 'How is retention rate different from attrition rate?', answer: 'Retention tracks only the original cohort remaining. Attrition/Turnover rates count the total exits (including replacements hired mid-cycle), meaning you can have high turnover but decent cohort retention if departures are concentrated.' }
    ],
    relatedSlugs: ['employee-turnover', 'employee-cost', 'working-hours'],
    seoTitle: 'Employee Retention Rate Calculator | Cohort Stability Audit',
    seoDescription: 'Benchmark company stability by auditing start-to-end staff retention percentages. Understand cohort churn rates.',
    calculate: (inputs) => {
      const startCount = Number(inputs.startCount || 1);
      const remainedCount = Number(inputs.remainedCount || 0);

      const validatedRemained = Math.min(startCount, remainedCount);
      const retentionRate = (validatedRemained / startCount) * 100;
      const churnRate = 100 - retentionRate;

      return {
        results: [
          { label: 'Staff Retention Rate', value: `${retentionRate.toFixed(1)}%`, isPrimary: true },
          { label: 'Cohort Churn Rate', value: `${churnRate.toFixed(1)}%`, isPrimary: true },
          { label: 'Lost Staff from Cohort', value: startCount - validatedRemained }
        ]
      };
    }
  },
  {
    id: 'working-hours',
    name: 'Working Hours Calculator',
    slug: 'working-hours',
    category: 'human-resources',
    description: 'Calculate net annual working hours for personnel by subtracting vacation days, federal holidays, and sick leaves.',
    formula: 'Net Working Hours = (Weeks Per Year - Vacation/Sick Weeks) * Weekly Hours - Holiday Hours',
    explanation: 'Allows HR professionals and contractors to project exact billable hour availability, structure salary ratios, and estimate client invoicing capacities.',
    example: 'A standard 52 weeks is adjusted for 10 holidays and 15 vacation/sick days, revealing true billable delivery metrics.',
    inputs: [
      { id: 'weeklyHours', label: 'Standard Weekly Working Hours', type: 'number', defaultValue: 40, min: 0, max: 168 },
      { id: 'weeksPerYear', label: 'Total Weeks per Year', type: 'number', defaultValue: 52, min: 1, max: 52 },
      { id: 'vacationDays', label: 'Annual Vacation / PTO Days Offered', type: 'number', defaultValue: 15, min: 0 },
      { id: 'holidays', label: 'Paid Federal/Corporate Holidays', type: 'number', defaultValue: 10, min: 0 },
      { id: 'sickLeaves', label: 'Estimated Unpaid or Paid Off-Work Sick Days', type: 'number', defaultValue: 5, min: 0 }
    ],
    faq: [
      { question: 'What is the standard standard full-time hours pool?', answer: 'A common benchmark is 2,080 hours per year (52 weeks x 40 hours) before taking vacations, federal/local holidays, and personal sick leaves into account.' }
    ],
    relatedSlugs: ['overtime-calculator', 'salary-comparison', 'leave-balance'],
    seoTitle: 'Annual Net Working Hours Calculator | Billable Hours Tracker',
    seoDescription: 'Compute actual annual billable and administrative work hours by subtracting holidays, sick periods, and vacation allowances.',
    calculate: (inputs) => {
      const weeklyHours = Number(inputs.weeklyHours || 0);
      const weeksPerYear = Number(inputs.weeksPerYear || 52);
      const vacationDays = Number(inputs.vacationDays || 0);
      const holidays = Number(inputs.holidays || 0);
      const sickLeaves = Number(inputs.sickLeaves || 0);

      const grossHours = weeksPerYear * weeklyHours;
      const dailyHours = weeklyHours / 5; // standard 5 days offset

      const totalOffDays = vacationDays + holidays + sickLeaves;
      const offHours = totalOffDays * dailyHours;

      const netWorkingHours = Math.max(0, grossHours - offHours);

      return {
        results: [
          { label: 'Net Annual Working Hours', value: Math.round(netWorkingHours).toLocaleString(), unit: 'hrs', isPrimary: true },
          { label: 'Gross Annual Hours Capacity', value: Math.round(grossHours).toLocaleString(), unit: 'hrs' },
          { label: 'Total Deducted Off-Hours', value: Math.round(offHours).toLocaleString(), unit: 'hrs' },
          { label: 'Total Calendar Off-Days', value: totalOffDays, unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'overtime-calculator',
    name: 'Overtime Calculator',
    slug: 'overtime-calculator',
    category: 'human-resources',
    description: 'Calculate standard, overtime (1.5x), and double-time (2x) payouts to estimate gross wages for hourly employees.',
    formula: 'Gross Income = (Standard Hours * Base Hourly Rate) + (Overtime Hours * Base * Overtime Multiplier)',
    explanation: 'Quickly audits weekly wage allocations for shift work, manufacturing, or service systems. Understand tax splits and adjusted gross payouts.',
    example: 'Working 50 hours in a 40-hour work week at $22/hr with a 1.5x multiplier means 10 hours of overtime, yielding a significant shift bonus.',
    inputs: [
      { id: 'hourlyRate', label: 'Base Hourly Rate ($/hr)', type: 'number', defaultValue: 25, min: 0, step: 0.1 },
      { id: 'regularHoursLimit', label: 'Standard Weekly Hour Limit', type: 'number', defaultValue: 40, min: 0, max: 100 },
      { id: 'actualHours', label: 'Total Actual Hours Worked this Week', type: 'number', defaultValue: 48, min: 0, max: 168 },
      { id: 'otMultiplier', label: 'Overtime Multiplier Scale (e.g., 1.5x)', type: 'number', defaultValue: 1.5, min: 1, max: 3, step: 0.1 },
      { id: 'doubleOtHours', label: 'Component Double-Time Hours (2.0x)', type: 'number', defaultValue: 0, min: 0 }
    ],
    faq: [
      { question: 'What is the standard standard overtime threshold?', answer: 'In the US, under the FLSA, non-exempt employees must be paid 1.5x their regular hourly rate for all hours worked over 40 in a single workweek.' }
    ],
    relatedSlugs: ['working-hours', 'salary-comparison', 'leave-balance'],
    seoTitle: 'Hourly Overtime Pay Calculator | Gross Weekly Wage Solver',
    seoDescription: 'Estimate your gross weekly and monthly wages with overtime. Handles normal, 1.5x overtime, and double-time multipliers.',
    calculate: (inputs) => {
      const rate = Number(inputs.hourlyRate || 0);
      const regularLimit = Number(inputs.regularHoursLimit || 40);
      const actual = Number(inputs.actualHours || 0);
      const otMult = Number(inputs.otMultiplier || 1.5);
      const dotHours = Number(inputs.doubleOtHours || 0);

      const standardHours = Math.min(regularLimit, actual - dotHours);
      const otHours = Math.max(0, (actual - dotHours) - standardHours);

      const standardPay = standardHours * rate;
      const otPay = otHours * rate * otMult;
      const dotPay = dotHours * rate * 2;

      const totalGrossPay = standardPay + otPay + dotPay;
      const averageHourlyRate = actual > 0 ? totalGrossPay / actual : 0;

      return {
        results: [
          { label: 'Total Gross Payout', value: totalGrossPay.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Effective Hourly Rate', value: averageHourlyRate.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Standard Payout', value: standardPay.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), unit: `(${standardHours} hrs)` },
          { label: 'Overtime Payout (OT)', value: otPay.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), unit: `(${otHours} hrs)` },
          { label: 'Double Time Payout (DT)', value: dotPay.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), unit: `(${dotHours} hrs)` }
        ]
      };
    }
  },
  {
    id: 'vacation-days',
    name: 'Vacation Days Accrual Calculator',
    slug: 'vacation-days',
    category: 'human-resources',
    description: 'Track vacation, sick days, and PTO milestones by calculating accumulated leave based on custom accrual schedules.',
    formula: 'Current Balance = Starting Balance + (Accrual Rate * Elapsed Months) - Vacation Days Used',
    explanation: 'Models monthly or pay-period accruals over a year. Let HR planners analyze end-of-year balances, carry-over limits, and payouts.',
    example: 'Starting with 5 days, earning 1.5 days/month, and taking 10 days off over a 6-month timeline projects your remaining PTO.',
    inputs: [
      { id: 'startBalance', label: 'Starting PTO Balance (Days)', type: 'number', defaultValue: 10, min: 0 },
      { id: 'accrualRate', label: 'Accrual Rate per Month (Days/Month)', type: 'number', defaultValue: 1.67, min: 0, step: 0.01 },
      { id: 'monthsElapsed', label: 'Time Elapsed (Months)', type: 'number', defaultValue: 8, min: 0, max: 12 },
      { id: 'daysUsed', label: 'Vacation Days Used/Scheduled', type: 'number', defaultValue: 6, min: 0 }
    ],
    faq: [
      { question: 'How many vacation days per year is 1.67 per month?', answer: 'An accrual rate of 1.67 days per month equals roughly 20 calendar vacation days per year.' }
    ],
    relatedSlugs: ['leave-balance', 'working-hours', 'hr-budget'],
    seoTitle: 'Vacation Days & PTO Accrual Calculator | Earned Leave Modeler',
    seoDescription: 'Compute your aggregate accrued vacation and PTO days. Handles fixed starting balances, monthly rates, and used allotments.',
    calculate: (inputs) => {
      const starting = Number(inputs.startBalance || 0);
      const rate = Number(inputs.accrualRate || 0);
      const elapsed = Number(inputs.monthsElapsed || 0);
      const used = Number(inputs.daysUsed || 0);

      const accrued = rate * elapsed;
      const totalAvailable = starting + accrued;
      const balance = Math.max(0, totalAvailable - used);

      return {
        results: [
          { label: 'Current PTO Balance', value: balance.toFixed(1), unit: 'days', isPrimary: true },
          { label: 'Total Days Earning Rate', value: accrued.toFixed(1), unit: 'days' },
          { label: 'Total Available Days (Starting + Accrued)', value: totalAvailable.toFixed(1), unit: 'days' },
          { label: 'Days Availed', value: used.toFixed(1), unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'leave-balance',
    name: 'Leave Balance Calculator',
    slug: 'leave-balance',
    category: 'human-resources',
    description: 'Calculate net remaining balances across all corporate leave types, such as sick leave, parental, personal, or sabbatical categories.',
    formula: 'Leave Type Profit = Allocations - Leaves Used',
    explanation: 'Maintains granular tracking across complex multi-bucket corporate limits to avoid compliance issues.',
    example: 'Standard balance structures can be evaluated dynamically, mapping sick hours and extended parental days.',
    inputs: [
      { id: 'sickAllocated', label: 'Sick Leave Allotment (Days/yr)', type: 'number', defaultValue: 10, min: 0 },
      { id: 'sickUsed', label: 'Sick Leave Days Used', type: 'number', defaultValue: 3, min: 0 },
      { id: 'personalAllocated', label: 'Personal Allotment (Days/yr)', type: 'number', defaultValue: 4, min: 0 },
      { id: 'personalUsed', label: 'Personal Days Used', type: 'number', defaultValue: 1, min: 0 },
      { id: 'parentalAllocated', label: 'Parental Balance Allotment', type: 'number', defaultValue: 10, min: 0 },
      { id: 'parentalUsed', label: 'Parental Days Used', type: 'number', defaultValue: 0, min: 0 }
    ],
    faq: [
      { question: 'Why list separate leave buckets instead of simple PTO?', answer: 'Many jurisdictions legally enforce distinct sick leaves and parent support limits, which must be tracked independently to meet compliance standards.' }
    ],
    relatedSlugs: ['vacation-days', 'working-hours', 'hr-budget'],
    seoTitle: 'Sick Leave & Parental Balance Calculator | HR Compliance Tracker',
    seoDescription: 'Sum and monitor remaining days in separate corporate benefit pools, supporting sick, personal, and specialized leaves.',
    calculate: (inputs) => {
      const sAlloc = Number(inputs.sickAllocated || 0);
      const sUsed = Number(inputs.sickUsed || 0);
      const pAlloc = Number(inputs.personalAllocated || 0);
      const pUsed = Number(inputs.personalUsed || 0);
      const parAlloc = Number(inputs.parentalAllocated || 0);
      const parUsed = Number(inputs.parentalUsed || 0);

      const sickRem = Math.max(0, sAlloc - sUsed);
      const personalRem = Math.max(0, pAlloc - pUsed);
      const parentalRem = Math.max(0, parAlloc - parUsed);
      const totalRemaining = sickRem + personalRem + parentalRem;

      return {
        results: [
          { label: 'Total Remaining All Leaves', value: totalRemaining, unit: 'days', isPrimary: true },
          { label: 'Sick Leave Balance', value: sickRem, unit: 'days' },
          { label: 'Personal Leave Balance', value: personalRem, unit: 'days' },
          { label: 'Parental Leave Balance', value: parentalRem, unit: 'days' }
        ]
      };
    }
  },
  {
    id: 'hr-budget',
    name: 'HR Budget Calculator',
    slug: 'hr-budget',
    category: 'human-resources',
    description: 'Calculate the comprehensive human resources budget allocation, outlining tooling, hiring campaigns, training costs, and culture budgets.',
    formula: 'Total HR Budget = Sourcing Ads + Tools & Licensing + (Training Per Employee * Headcount) + Engagement Spend',
    explanation: 'Supports HR directors and managers in formulating annual budget plans. Generates dynamic cost-per-employee indices for corporate allocation planning.',
    example: 'An $8,000 SaaS platform spend, paired with $2,000 in onboarding resources per employee, creates a structured HR cost map.',
    inputs: [
      { id: 'hrHeadcount', label: 'Total Team Count (Employees)', type: 'number', defaultValue: 40, min: 1 },
      { id: 'sourcingAds', label: 'Sourcing & Ad Postings Annual Budget ($)', type: 'number', defaultValue: 15000, min: 0 },
      { id: 'softwareLicenses', label: 'HRIS, ATS & Softwares Annual Subscriptions ($)', type: 'number', defaultValue: 8500, min: 0 },
      { id: 'trainingPerHead', label: 'Onboarding / Training Cost Per Employee ($)', type: 'number', defaultValue: 1500, min: 0 },
      { id: 'eventsEngagement', label: 'Company Events & Wellness Budget ($/yr)', type: 'number', defaultValue: 10000, min: 0 }
    ],
    faq: [
      { question: 'What is a typical HR budget per employee?', answer: 'Depending on the industry, corporate HR budgets average between $1,200 and $3,500 per headcount annually, heavily weighted toward training and SaaS systems.' }
    ],
    relatedSlugs: ['hiring-cost', 'employee-cost', 'employee-turnover'],
    seoTitle: 'Human Resources Budget & Cost Allocation Calculator | Calculatoora',
    seoDescription: 'Structure corporate HR investments. Calculate annual recruitment, HRIS system licenses, employee development, and engagement budgets.',
    calculate: (inputs) => {
      const headcount = Number(inputs.hrHeadcount || 1);
      const ads = Number(inputs.sourcingAds || 0);
      const tools = Number(inputs.softwareLicenses || 0);
      const training = Number(inputs.trainingPerHead || 0);
      const events = Number(inputs.eventsEngagement || 0);

      const aggregateTraining = training * headcount;
      const totalHRBudget = ads + tools + aggregateTraining + events;
      const costPerHead = totalHRBudget / headcount;

      return {
        results: [
          { label: 'Total HR Budget Allocation', value: totalHRBudget.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'HR Budget Per Employee', value: costPerHead.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Total Training Allocation', value: aggregateTraining.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Direct HR Admin Tools Cost', value: tools.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },

  // ====================================== SUPPLY CHAIN ======================================
  {
    id: 'inventory-cost-calculator',
    name: 'Inventory Cost Calculator',
    slug: 'inventory-cost-calculator',
    category: 'supply-chain',
    description: 'Calculate the total carrying cost of holding merchandise stock, including depreciation, storage premiums, and alternate capital fees.',
    formula: 'Annual Carrying Cost = Average Stock Value * (Storage % + Alternate Capital % + Risk %)',
    explanation: 'Keeping surplus warehousing inventory eats up valuable cash flow. This calculator breaks down physical rent, heating, insurance, depreciation risk limits, and opportunity metrics of working funds.',
    example: 'Holding $200K of average inventory with standard carrying rates of 25% costs an organization $50K per year.',
    inputs: [
      { id: 'avgValue', label: 'Average Inventory Asset Value ($)', type: 'number', defaultValue: 150000, min: 0 },
      { id: 'storagePercent', label: 'Warehousing & Physical Storage Costs (%)', type: 'number', defaultValue: 12, min: 0, max: 100, step: 0.1 },
      { id: 'capitalCostPercent', label: 'Company Cost of Capital / Opportunity Rate (%)', type: 'number', defaultValue: 8, min: 0, max: 100, step: 0.1 },
      { id: 'riskPercent', label: 'Obsolescence / Shrinkage / Damage Risk (%)', type: 'number', defaultValue: 5, min: 0, max: 100, step: 0.1 }
    ],
    faq: [
      { question: 'What is a typical annual inventory carrying cost rate?', answer: 'Most manufacturing and retail organizations experience carrying cost rates between 20% and 30% of the average value of inventory held per year.' }
    ],
    relatedSlugs: ['inventory-turnover', 'economic-order-quantity', 'warehouse-cost'],
    seoTitle: 'Inventory Carrying Cost Calculator | Warehousing Asset Holding Cost',
    seoDescription: 'Find your actual inventory holding costs by adding storage rates, company capital opportunity costs, and deterioration risk indicators.',
    calculate: (inputs) => {
      const avgValue = Number(inputs.avgValue || 0);
      const storage = Number(inputs.storagePercent || 0) / 100;
      const capital = Number(inputs.capitalCostPercent || 0) / 100;
      const risk = Number(inputs.riskPercent || 0) / 100;

      const totalCarryingRate = storage + capital + risk;
      const sumHoldingCost = avgValue * totalCarryingRate;

      return {
        results: [
          { label: 'Total Annual Carrying Cost', value: sumHoldingCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Combined Carrying Cost Rate', value: `${(totalCarryingRate * 100).toFixed(1)}%`, isPrimary: true },
          { label: 'Opportunity & Funding Cost Value', value: (avgValue * capital).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Physical Storage Cost Value', value: (avgValue * storage).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Obsolescence & Theft Damage value', value: (avgValue * risk).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ],
        chartData: {
          labels: ['SaaS & Storage Cost', 'Capital Spends', 'Deprecation Risk'],
          values: [avgValue * storage, avgValue * capital, avgValue * risk],
          colors: ['#3b82f6', '#10b981', '#f59e0b']
        }
      };
    }
  },
  {
    id: 'inventory-turnover',
    name: 'Inventory Turnover Calculator',
    slug: 'inventory-turnover',
    category: 'supply-chain',
    description: 'Determine how many times you sold and replaced your business stock of goods within a standard year, and calculate Days Sales of Inventory (DSI).',
    formula: 'Inventory Turnover = Cost of Goods Sold / Average Inventory',
    explanation: 'A fundamental benchmark of product movement, efficiency, and company liquidity. Low turnover suggests slack marketing or market stagnation.',
    example: 'A product with a $500K yearly COGS and an average inventory baseline of $100K has an inventory turnover of 5x per year.',
    inputs: [
      { id: 'cogs', label: 'Annual Cost of Goods Sold (COGS) ($)', type: 'number', defaultValue: 400000, min: 0 },
      { id: 'beginningInv', label: 'Beginning Inventory Value ($)', type: 'number', defaultValue: 85000, min: 0 },
      { id: 'endingInv', label: 'Ending Inventory Value ($)', type: 'number', defaultValue: 75000, min: 0 }
    ],
    faq: [
      { question: 'What does Days Sales of Inventory (DSI) represent?', answer: 'DSI measures the average number of days it takes to turn inventory into direct client sales. A lower DSI is highly preferred because it demonstrates fast conversion speeds.' }
    ],
    relatedSlugs: ['inventory-cost-calculator', 'economic-order-quantity', 'supply-cost'],
    seoTitle: 'Inventory Turnover & Days Sales of Inventory (DSI) Calculator',
    seoDescription: 'Obtain inventory movement metrics. Calculate COGS, starting and ending stock value to estimate turnover rates and days sales averages.',
    calculate: (inputs) => {
      const cogs = Number(inputs.cogs || 1);
      const beginningInv = Number(inputs.beginningInv || 0);
      const endingInv = Number(inputs.endingInv || 0);

      const avgInv = (beginningInv + endingInv) / 2;
      const turnoverRatio = avgInv > 0 ? cogs / avgInv : 0;
      const dsi = turnoverRatio > 0 ? 365 / turnoverRatio : 0;

      return {
        results: [
          { label: 'Inventory Turnover Ratio', value: `${turnoverRatio.toFixed(2)}x`, isPrimary: true },
          { label: 'Days Sales of Inventory (DSI)', value: `${dsi.toFixed(1)} days`, isPrimary: true },
          { label: 'Average Inventory Value', value: avgInv.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'supply-cost',
    name: 'Supply Cost Calculator',
    slug: 'supply-cost',
    category: 'supply-chain',
    description: 'Calculate overall landed costs for product shipments, folding in raw item wholesale pricing, shipping overheads, and customs tariffs.',
    formula: 'Total Landed Cost = (Unit Factory Price * Order Units) + Freight fees + Customs Fees + Insurance',
    explanation: 'Allows import/export planners to audit total shipping invoices and calculate the accurate per-unit landed price required for product retail markup.',
    example: 'Buying 1,000 widgets at $12 each, with $1,500 shipping, and a 10% customs fee.',
    inputs: [
      { id: 'orderUnits', label: 'Order Quantity (Units)', type: 'number', defaultValue: 1200, min: 1 },
      { id: 'unitPrice', label: 'Raw Unit Factory Cost ($)', type: 'number', defaultValue: 14, min: 0, step: 0.1 },
      { id: 'freightFees', label: 'Aggregate Freight / Shipping Costs ($)', type: 'number', defaultValue: 1800, min: 0 },
      { id: 'customsTariff', label: 'Customs Duties & Tariffs (%)', type: 'number', defaultValue: 8, min: 0, max: 100, step: 0.1 },
      { id: 'insuranceMisc', label: 'Insurance & Miscellaneous Fees ($)', type: 'number', defaultValue: 350, min: 0 }
    ],
    faq: [
      { question: 'Why is calculating "landed cost" so critical?', answer: 'If a small business bases retail pricing only on the unit factory cost without freight and customs factored in, they might operate at a loss after paying these overheads.' }
    ],
    relatedSlugs: ['economic-order-quantity', 'inventory-cost-calculator', 'delivery-cost'],
    seoTitle: 'Total Landed Supply Cost Calculator | Unit Price Estimator',
    seoDescription: 'Benchmark product import costs. Compute total factory price, shipping logistics overheads, and import taxation to find actual unit margins.',
    calculate: (inputs) => {
      const units = Number(inputs.orderUnits || 1);
      const unitCost = Number(inputs.unitPrice || 0);
      const freight = Number(inputs.freightFees || 0);
      const tariffPercent = Number(inputs.customsTariff || 0) / 100;
      const insurance = Number(inputs.insuranceMisc || 0);

      const rawSubtotal = units * unitCost;
      const customsCost = rawSubtotal * tariffPercent;
      const totalLanded = rawSubtotal + freight + customsCost + insurance;
      const landedUnitCost = units > 0 ? totalLanded / units : 0;
      const markupPremiumPercent = unitCost > 0 ? ((landedUnitCost - unitCost) / unitCost) * 100 : 0;

      return {
        results: [
          { label: 'Total Landed Cost of Shipment', value: totalLanded.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'True Cost Per Landed Unit', value: landedUnitCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Factory Cost Subtotal', value: rawSubtotal.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Customs & Logistics Overhead', value: (customsCost + freight + insurance).toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) },
          { label: 'Logistics Markup on Raw Price', value: `+${markupPremiumPercent.toFixed(1)}%` }
        ]
      };
    }
  },
  {
    id: 'economic-order-quantity',
    name: 'Economic Order Quantity (EOQ) Calculator',
    slug: 'economic-order-quantity',
    category: 'supply-chain',
    description: 'Calculate the mathematical Economic Order Quantity to limit company distribution overhead, inventory storage, and booking costs.',
    formula: 'EOQ = Sqrt((2 * Annual Demand * Ordering Cost) / Annual Holding Cost per Unit)',
    explanation: 'Models optimal replenishment triggers. Maximizes company cash flow by calculating exactly when and how much stock to order to minimize storage fees and shipment fees.',
    example: 'An annual demand of 10,000 units, ordering fee of $40 per shipment, and holding cost of $2 per unit.',
    inputs: [
      { id: 'annualDemand', label: 'Annual Demand (Units/Year)', type: 'number', defaultValue: 12000, min: 1 },
      { id: 'orderingCost', label: 'Ordering Cost per Order / Setup Fees ($)', type: 'number', defaultValue: 80, min: 0 },
      { id: 'holdingCostUnit', label: 'Annual Holding Cost per Unit ($/yr)', type: 'number', defaultValue: 3, min: 0.01, step: 0.01 }
    ],
    faq: [
      { question: 'What does the Economic Order Quantity solve?', answer: 'It answers the classic inventory balance question: Ordering in bulk saves on shipping but creates high holding costs; ordering frequently saves holding cost but boosts shipping/admin fees. EOQ is the perfect sweet spot that minimizes the sum of both.' }
    ],
    relatedSlugs: ['inventory-cost-calculator', 'inventory-turnover', 'stock-planning'],
    seoTitle: 'Economic Order Quantity (EOQ) Calculator | Inventory Replenishment Solver',
    seoDescription: 'Find your business\'s optimal purchase order size using classical EOQ mathematics. Minimizes setup fees and carrying expenses.',
    calculate: (inputs) => {
      const demand = Number(inputs.annualDemand || 1);
      const setup = Number(inputs.orderingCost || 0);
      const carry = Number(inputs.holdingCostUnit || 1);

      const eoq = Math.sqrt((2 * demand * setup) / carry);
      const optimalOrdersCount = eoq > 0 ? demand / eoq : 0;
      const combinedTotalCost = (optimalOrdersCount * setup) + ((eoq / 2) * carry);

      return {
        results: [
          { label: 'Optimal Order Quantity (EOQ)', value: Math.round(eoq).toLocaleString(), unit: 'units', isPrimary: true },
          { label: 'Optimal Orders Per Year', value: optimalOrdersCount.toFixed(1), unit: 'times', isPrimary: true },
          { label: 'Calculated Minimum Annual Carrying & Ordering Cost', value: combinedTotalCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'delivery-cost',
    name: 'Delivery Cost Calculator',
    slug: 'supply-chain',
    category: 'supply-chain',
    description: 'Structure transportation shipping metrics. Tracks fuel prices, logistics vehicle efficiencies, driver standard wages, and tolls.',
    formula: 'Cost = (Distance / Fuel Economy) * Fuel Price + Transit Time * Wage + Tolls',
    explanation: 'Used by localized operations and delivery fleets to construct correct cost schemas for routes or customer shipping rates.',
    example: 'A delivery travel distance of 250 miles with a heavy truck getting 8 mpg, driver working 6 hours, and $50 toll pricing.',
    inputs: [
      { id: 'distance', label: 'Delivery Distance (Miles)', type: 'number', defaultValue: 180, min: 1 },
      { id: 'fuelEconomy', label: 'Vehicle Fuel Economy (MPG)', type: 'number', defaultValue: 15, min: 1, step: 0.5 },
      { id: 'fuelPrice', label: 'Gas / Fuel Price ($/Gallon)', type: 'number', defaultValue: 3.65, min: 0, step: 0.01 },
      { id: 'transitHours', label: 'Driver Transit Time (Hours)', type: 'number', defaultValue: 4, min: 0, step: 0.5 },
      { id: 'driverWage', label: 'Driver Hourly Salary ($/hour)', type: 'number', defaultValue: 24, min: 0 },
      { id: 'tollsMisc', label: 'Tolls & Highway/Transit Permits ($)', type: 'number', defaultValue: 15, min: 0 }
    ],
    faq: [
      { question: 'Why is fuel economy weighted so heavily in commercial deliveries?', answer: 'For large trailer trucks (running 6-10 mpg), fuel costs often exceed direct staff labor salaries. Keeping optimal route plans is critical to overall profitability.' }
    ],
    relatedSlugs: ['warehouse-cost', 'supply-cost', 'stock-planning'],
    seoTitle: 'Fleet Outbound & Delivery Cost Calculator | Route Expenses Solver',
    seoDescription: 'Find your delivery and freight costs per route or trip. Covers heavy vehicle fuel burn, labor rates, and tolls.',
    calculate: (inputs) => {
      const distance = Number(inputs.distance || 1);
      const fuelEcon = Number(inputs.fuelEconomy || 1);
      const gasPrice = Number(inputs.fuelPrice || 0);
      const hours = Number(inputs.transitHours || 0);
      const wage = Number(inputs.driverWage || 0);
      const tolls = Number(inputs.tollsMisc || 0);

      const fuelSpent = (distance / fuelEcon) * gasPrice;
      const laborSpent = hours * wage;
      const totalDeliveryCost = fuelSpent + laborSpent + tolls;
      const costPerMile = distance > 0 ? totalDeliveryCost / distance : 0;

      return {
        results: [
          { label: 'Total Delivery Outlay', value: totalDeliveryCost.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Outlay Cost Per Mile', value: costPerMile.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Fuel Spend Portion', value: fuelSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) },
          { label: 'Driver Labor Portion', value: laborSpent.toLocaleString('en-US', { style: 'currency', currency: 'USD' }) }
        ]
      };
    }
  },
  {
    id: 'warehouse-cost',
    name: 'Warehouse Cost Calculator',
    slug: 'warehouse-cost',
    category: 'supply-chain',
    description: 'Calculate average monthly warehousing expenses, outlining rent rates, basic utilities, and handling labor allocations.',
    formula: 'Warehouse Expense = Facility Lease + Utility Bills + Personnel Salaries',
    explanation: 'Audits physical footprint costs and maps out cost ratios per foot. Excellent for monitoring unutilized or excess pallet space.',
    example: 'Leasing 20,000 sq ft at $1.5/sq ft, with monthly utility bills and labor.',
    inputs: [
      { id: 'leaseCost', label: 'Monthly Facility Rent / Lease ($/month)', type: 'number', defaultValue: 12000, min: 0 },
      { id: 'utilityCost', label: 'Monthly Power & Climate Control Utility ($)', type: 'number', defaultValue: 3200, min: 0 },
      { id: 'staffSalaries', label: 'Aggregate Monthly Warehouse Staff Labor ($)', type: 'number', defaultValue: 18000, min: 0 },
      { id: 'totalSqFt', label: 'Total Space Dimensions (Sq. Footage)', type: 'number', defaultValue: 15000, min: 1 },
      { id: 'utilizationPercent', label: 'Utilized Storage Capacity Percentage (%)', type: 'number', defaultValue: 75, min: 0, max: 100 }
    ],
    faq: [
      { question: 'What is the standard standard utility cost in general fulfillment warehouses?', answer: 'Climate control for perishable goods or high-end electronics greatly elevates utility costs. Standard facilities averages $0.15 to $0.40 per square foot.' }
    ],
    relatedSlugs: ['inventory-cost-calculator', 'economic-order-quantity', 'delivery-cost'],
    seoTitle: 'Warehousing Facility Cost Calculator | Cost-Per-Square-Foot',
    seoDescription: 'Accurately map logistics and storage overhead. Tracks facility leasing prices, utility metrics, labor allocations, and utilization margins.',
    calculate: (inputs) => {
      const lease = Number(inputs.leaseCost || 0);
      const utilities = Number(inputs.utilityCost || 0);
      const labor = Number(inputs.staffSalaries || 0);
      const area = Number(inputs.totalSqFt || 1);
      const utilsPercent = Number(inputs.utilizationPercent || 100) / 100;

      const monthlyOverhead = lease + utilities + labor;
      const costPerSqFt = area > 0 ? monthlyOverhead / area : 0;
      const wastedCost = monthlyOverhead * (1 - utilsPercent);

      return {
        results: [
          { label: 'Total Warehouse Monthly Cost', value: monthlyOverhead.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), isPrimary: true },
          { label: 'Cost Per Square Foot', value: costPerSqFt.toLocaleString('en-US', { style: 'currency', currency: 'USD' }), isPrimary: true },
          { label: 'Value of Unutilized Storage Space', value: wastedCost.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) }
        ]
      };
    }
  },
  {
    id: 'stock-planning',
    name: 'Stock Planning & Reorder Point Calculator',
    slug: 'stock-planning',
    category: 'supply-chain',
    description: 'Find your optimal safety inventory levels and calculate precise lead-time stock reorder triggers to prevent out-of-stock scenarios.',
    formula: 'Reorder Point (ROP) = (Average Daily Demand * Transit Lead Time) + Safety Stock Balance',
    explanation: 'Calculates the threshold of stock units that triggers the creation of a purchase order. Bridges delivery lag phases with safety reserves.',
    example: 'Selling 150 widgets a day with a 10-day supplier fulfillment delay and 5 days of safety stock.',
    inputs: [
      { id: 'dailyDemand', label: 'Average Daily Units Sold (Demand)', type: 'number', defaultValue: 80, min: 0 },
      { id: 'leadTimeDays', label: 'Supplier Lead Time (Days to Receive)', type: 'number', defaultValue: 12, min: 1 },
      { id: 'safetyStockDays', label: 'Safety Stock Buffer Allowance (Days)', type: 'number', defaultValue: 5, min: 0 }
    ],
    faq: [
      { question: 'Why is safety stock critical in unpredictable industries?', answer: 'Safety stock buffers unpredictable consumer demand spikes and unexpected supplier shipment delays, preventing lost revenue from stockouts.' }
    ],
    relatedSlugs: ['economic-order-quantity', 'inventory-cost-calculator', 'inventory-turnover'],
    seoTitle: 'Reorder Point (ROP) & Safety Stock Calculator | Logistics Planner',
    seoDescription: 'Prevent inventory shortfalls. Calculate exact warehouse reorder thresholds using lead times, daily sales averages, and safety stock days.',
    calculate: (inputs) => {
      const dailySales = Number(inputs.dailyDemand || 0);
      const leadTime = Number(inputs.leadTimeDays || 1);
      const safetyDays = Number(inputs.safetyStockDays || 0);

      const safetyStock = dailySales * safetyDays;
      const transitStockDemand = dailySales * leadTime;
      const reorderThreshold = transitStockDemand + safetyStock;

      return {
        results: [
          { label: 'Reorder Point (ROP) Threshold', value: Math.round(reorderThreshold).toLocaleString(), unit: 'units', isPrimary: true },
          { label: 'Safety Stock Reserve Volume', value: Math.round(safetyStock).toLocaleString(), unit: 'units', isPrimary: true },
          { label: 'Transit Window Product Demand', value: Math.round(transitStockDemand).toLocaleString(), unit: 'units' }
        ]
      };
    }
  },
  {
    id: 'demand-forecast',
    name: 'Demand Forecast Calculator',
    slug: 'demand-forecast',
    category: 'supply-chain',
    description: 'Forecast potential consumer demand levels for upcoming cycles using exponential smoothing or weighted average techniques.',
    formula: 'WMA Forecast = (M1 * W1) + (M2 * W2) + (M3 * W3)',
    explanation: 'Formulates logical inventory purchase estimates by analyzing unit movement patterns in the three previous periods.',
    example: 'Selling 500 units in April, 550 in May, and 610 in June predicts upcoming July demand.',
    inputs: [
      { id: 'salesMonth3', label: 'Sales 3 Months Ago (Units) (Weight 20%)', type: 'number', defaultValue: 1000, min: 0 },
      { id: 'salesMonth2', label: 'Sales 2 Months Ago (Units) (Weight 30%)', type: 'number', defaultValue: 1200, min: 0 },
      { id: 'salesMonth1', label: 'Sales Last Month (Units) (Weight 50%)', type: 'number', defaultValue: 1450, min: 0 },
      { id: 'growthBias', label: 'Growth/Seasonal Bias Factor (%)', type: 'number', defaultValue: 5, min: -50, max: 100 }
    ],
    faq: [
      { question: 'How do weighting mechanisms improve forecasting?', answer: 'Applying high weights to recent sales cycles captures current market changes (fashion trends, price changes) better than standard historical averages.' }
    ],
    relatedSlugs: ['stock-planning', 'economic-order-quantity', 'inventory-cost-calculator'],
    seoTitle: 'Consumer Demand & Sales Forecasting Calculator | Inventory Modeler',
    seoDescription: 'Predict next-month product demand. Combines weighted averages of historical records with custom adjustments.',
    calculate: (inputs) => {
      const m3 = Number(inputs.salesMonth3 || 0);
      const m2 = Number(inputs.salesMonth2 || 0);
      const m1 = Number(inputs.salesMonth1 || 0);
      const growth = Number(inputs.growthBias || 0) / 100;

      const weightedAverage = (m3 * 0.2) + (m2 * 0.3) + (m1 * 0.5);
      const biasedForecast = weightedAverage * (1 + growth);

      return {
        results: [
          { label: 'Projected Next Month Sales Demand', value: Math.round(biasedForecast).toLocaleString(), unit: 'units', isPrimary: true },
          { label: 'Historical Weighted average', value: Math.round(weightedAverage).toLocaleString(), unit: 'units' },
          { label: 'Aggregate Adjustments Impact', value: Math.round(weightedAverage * growth).toLocaleString(), unit: 'units' }
        ]
      };
    }
  }
];
