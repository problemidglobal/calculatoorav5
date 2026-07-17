import { Calculator } from '../types';

export const SALARY_WORK_CALCULATORS: Calculator[] = [
  {
    id: 'salary-converter-calculator',
    name: 'Salary Calculator',
    slug: 'salary-converter-calculator',
    category: 'finance',
    description: 'Convert annual, monthly, bi-weekly, weekly, or hourly wage rates into parallel payment frequencies.',
    seoTitle: 'Wages & Salary Converter Calculator | Calculatoora',
    seoDescription: 'Perform cross-frequency conversions for salary contracts. Turn annual salary figures into realistic hourly, weekly, or monthly equivalent estimates.',
    inputs: [
      { id: 'pay', label: 'Reference Pay amount', type: 'number', defaultValue: 65000, step: 1000, unit: '$' },
      { id: 'frequency', label: 'Base Pay Period', type: 'select', defaultValue: 'annual', options: [
        { label: 'Annually', value: 'annual' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Hourly', value: 'hourly' }
      ]},
      { id: 'hours', label: 'Work Hours per Week', type: 'number', defaultValue: 40, step: 1, unit: 'hours' }
    ],
    formula: 'Annual = Hourly * Hours Per Week * 52 weeks\nMonthly = Annual / 12\nWeekly = Annual / 52',
    explanation: 'Converting wages allows job seekers to evaluate contract terms side-by-side against hourly positions.',
    example: 'Earning a $65,000 annual salary converts to $5,416.67 monthly, $1,250.00 weekly, or exactly $31.25 hourly assuming standard 40-hour workweeks.',
    faq: [
      { question: 'How many work hours are in a standard year?', answer: 'Assuming 40-hour workweeks over 52 weeks, a standard year contains exactly 2,080 working hours.' }
    ],
    relatedSlugs: ['hourly-wage-calculator', 'annual-salary-calculator', 'monthly-salary-calculator'],
    calculate: (inputs) => {
      const pay = Number(inputs.pay) || 0;
      const freq = inputs.frequency || 'annual';
      const hours = Number(inputs.hours) || 40;

      let annual = 0;
      if (freq === 'annual') annual = pay;
      else if (freq === 'monthly') annual = pay * 12;
      else if (freq === 'weekly') annual = pay * 52;
      else if (freq === 'hourly') annual = pay * hours * 52;

      const monthly = annual / 12;
      const weekly = annual / 52;
      const hourly = annual / (hours * 52);

      return {
        results: [
          { label: 'Annual Salary Equivalent', value: annual.toFixed(2), unit: '$', isPrimary: freq === 'annual' },
          { label: 'Hourly Wage equivalent', value: hourly.toFixed(2), unit: '$', isPrimary: freq === 'hourly' },
          { label: 'Monthly Pay Equivalent', value: monthly.toFixed(2), unit: '$', isPrimary: freq === 'monthly' },
          { label: 'Weekly Pay Equivalent', value: weekly.toFixed(2), unit: '$', isPrimary: freq === 'weekly' }
        ],
        chartData: [
          { name: 'Core Pay Portion (Monthly)', value: Math.round(monthly), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'hourly-wage-calculator',
    name: 'Hourly Wage Calculator',
    slug: 'hourly-wage-calculator',
    category: 'finance',
    description: 'Input your hourly pay to project weekly, monthly, and overall annual gross earnings.',
    seoTitle: 'Hourly Wage to Annual Salary Calculator | Calculatoora',
    seoDescription: 'Standard hourly pay calculator. Input overtime parameters to estimate total paycheck earnings.',
    inputs: [
      { id: 'rate', label: 'Hourly Pay Rate', type: 'number', defaultValue: 25.0, step: 0.5, unit: '$' },
      { id: 'hours', label: 'Weekly Hours Worked', type: 'number', defaultValue: 40, step: 1, unit: 'hours' }
    ],
    formula: 'Annual Salary = Hourly Rate * Hours * 52',
    explanation: 'Accurately converts hourly job bids into gross monthly and annual salary budgets.',
    example: 'Earning $25.00 per hour working 40 hours weekly totals $1,000.00 weekly and $52,000.00 gross annually.',
    faq: [
      { question: 'Does this calculate taxes?', answer: 'This represents gross pre-tax income. Adjust for federal paycheck social insurance to isolate net take-home cash.' }
    ],
    relatedSlugs: ['salary-converter-calculator', 'annual-salary-calculator', 'overtime-calculator'],
    calculate: (inputs) => {
      const rate = Number(inputs.rate) || 0;
      const hrs = Number(inputs.hours) || 40;

      const weekly = rate * hrs;
      const annual = weekly * 52;
      const monthly = annual / 12;

      return {
        results: [
          { label: 'Annual Gross Salary', value: annual.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Monthly Gross Pay', value: monthly.toFixed(2), unit: '$' },
          { label: 'Weekly Gross Pay', value: weekly.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Gross Annual Earnings', value: annual, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'annual-salary-calculator',
    name: 'Annual Salary Calculator',
    slug: 'annual-salary-calculator',
    category: 'finance',
    description: 'Calculate how a total annual salary package divides into monthly, bi-weekly, weekly, and hourly pay segments.',
    seoTitle: 'Annual Salary Wage Breakdown Calculator | Calculatoora',
    seoDescription: 'Obtain exact paycheck breakdown values from flat annual salary contract metrics.',
    inputs: [
      { id: 'annual', label: 'Gross Annual Salary Contract', type: 'number', defaultValue: 80000, step: 1000, unit: '$' },
      { id: 'hours', label: 'Hours per Week', type: 'number', defaultValue: 40, step: 1, unit: 'hours' }
    ],
    formula: 'Hourly = Annual / (Hours * 52)\nWeekly = Annual / 52\nMonthly = Annual / 12',
    explanation: 'Calculates the granular breakdown of annual salary packages, helpful for planning household expenses.',
    example: 'An $80,000 annual package equals $6,666.67 gross monthly, $1,538.46 weekly, or $38.46 hourly.',
    faq: [
      { question: 'What is a bi-weekly pay cycle?', answer: 'Bi-weekly pay cycles deliver payouts once every two weeks (26 paychecks per year), as opposed to semi-monthly which occurs twice per month (24 paychecks per year).' }
    ],
    relatedSlugs: ['salary-converter-calculator', 'monthly-salary-calculator', 'hourly-wage-calculator'],
    calculate: (inputs) => {
      const annual = Number(inputs.annual) || 0;
      const hrs = Number(inputs.hours) || 40;

      const monthly = annual / 12;
      const biweekly = annual / 26;
      const weekly = annual / 52;
      const hourly = annual / (hrs * 52);

      return {
        results: [
          { label: 'Weekly Pay segment', value: weekly.toFixed(2), unit: '$' },
          { label: 'Bi-weekly Pay Segment', value: biweekly.toFixed(2), unit: '$' },
          { label: 'Monthly Pay Segment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Hourly Pay Segment', value: hourly.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Bi-weekly Cash Outflow', value: Math.round(biweekly), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'monthly-salary-calculator',
    name: 'Monthly Salary Calculator',
    slug: 'monthly-salary-calculator',
    category: 'finance',
    description: 'Convert set base monthly salaries into equivalent annual and hourly rates of compensation.',
    seoTitle: 'Monthly Salary Conversion Calculator | Calculatoora',
    seoDescription: 'Convert monthly salary offers into annual packages or hourly wages instantly.',
    inputs: [
      { id: 'monthly', label: 'Gross Monthly Salary', type: 'number', defaultValue: 5000, step: 100, unit: '$' },
      { id: 'hours', label: 'Average Weekly Hours', type: 'number', defaultValue: 40, step: 1, unit: 'hours' }
    ],
    formula: 'Annual = Monthly * 12\nHourly = Annual / (Weeks * Hours)',
    explanation: 'Provides clear compensation equivalents for monthly pay structures.',
    example: 'A gross monthly salary of $5,000 results in a $60,000 annual package ($28.85 hourly).',
    faq: [
      { question: 'Why do monthly numbers fluctuate?', answer: 'Since months vary in calendar length (28 to 31 days), actual hourly rates can differ slightly week-to-week on monthly contracts.' }
    ],
    relatedSlugs: ['salary-converter-calculator', 'annual-salary-calculator', 'hourly-wage-calculator'],
    calculate: (inputs) => {
      const monthly = Number(inputs.monthly) || 0;
      const hrs = Number(inputs.hours) || 40;

      const annual = monthly * 12;
      const weekly = annual / 52;
      const hourly = annual / (hrs * 52);

      return {
        results: [
          { label: 'Gross Annual Equivalent', value: annual.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Weekly Pay Equivalent', value: weekly.toFixed(2), unit: '$' },
          { label: 'Hourly Pay Equivalent', value: hourly.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Monthly Base Pay', value: monthly, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'overtime-calculator',
    name: 'Overtime Calculator',
    slug: 'overtime-calculator',
    category: 'finance',
    description: 'Calculate total paycheck earnings including overtime hours at standard time-and-a-half (1.5x) or double-time (2.0x) rates.',
    seoTitle: 'Overtime Pay & Hourly Rate Calculator | Calculatoora',
    seoDescription: 'Calculate overtime paycheck totals. Input regular hours, overtime hours and pay rate multiplier.',
    inputs: [
      { id: 'rate', label: 'Regular Hourly rate', type: 'number', defaultValue: 20.0, step: 0.5, unit: '$' },
      { id: 'regHours', label: 'Regular Hours Worked', type: 'number', defaultValue: 40, step: 1, unit: 'hours' },
      { id: 'otHours', label: 'Overtime Hours Worked', type: 'number', defaultValue: 10, step: 1, unit: 'hours' },
      { id: 'otRate', label: 'Overtime multiplier', type: 'number', defaultValue: 1.5, step: 0.1, unit: 'x' }
    ],
    formula: 'Regular Pay = Rate * Regular Hours\nOvertime Pay = Rate * Multiplier * Overtime Hours\nTotal = Regular + Overtime',
    explanation: 'Calculators overtime earnings, essential for non-exempt hourly employees tracking extended shifts.',
    example: 'Working 10 overtime hours at time-and-a-half (1.5x) on a base of $20.00/hour earns $300.00 in overtime, bringing weekly pay to $1,100.00.',
    faq: [
      { question: 'What is time-and-a-half?', answer: 'A common overtime rate that multiplies the regular hourly wage by 1.5 for hours worked beyond the standard 40-hour workweek.' }
    ],
    relatedSlugs: ['hourly-wage-calculator', 'salary-converter-calculator', 'freelance-rate-calculator'],
    calculate: (inputs) => {
      const rate = Number(inputs.rate) || 0;
      const regH = Number(inputs.regHours) || 40;
      const otH = Number(inputs.otHours) || 0;
      const otMult = Number(inputs.otRate) || 1.5;

      const basePay = rate * regH;
      const otRateCalculated = rate * otMult;
      const otPay = otRateCalculated * otH;
      const totalPay = basePay + otPay;

      return {
        results: [
          { label: 'Total Gross Paycheck', value: totalPay.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Regular base Pay', value: basePay.toFixed(2), unit: '$' },
          { label: 'Overtime Pay Portion', value: otPay.toFixed(2), unit: '$' },
          { label: 'Effective Overtime Hourly Rate', value: otRateCalculated.toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Regular Base Pay', value: basePay, color: '#39FF14' },
          { name: 'Overtime Pay Premium', value: otPay, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'raise-calculator',
    name: 'Raise Calculator',
    slug: 'raise-calculator',
    category: 'finance',
    description: 'Calculate salary raises by evaluating percentage scale increases or flat dollar additions.',
    seoTitle: 'Salary Raise Percentage Calculator | Calculatoora',
    seoDescription: 'Obtain new salary totals after percentage raises. Calculate bi-weekly and monthly paycheck increases instantly.',
    inputs: [
      { id: 'current', label: 'Current annual Salary', type: 'number', defaultValue: 60000, step: 1000, unit: '$' },
      { id: 'raisePct', label: 'Raise Percentage (%)', type: 'number', defaultValue: 4.5, step: 0.1, unit: '%' }
    ],
    formula: 'Raise Value = Current Salary * (Raise % / 100)\nNew Salary = Current Salary + Raise Value',
    explanation: 'Evaluate employment compensation adjustments and track how raises impact your ongoing monthly budget.',
    example: 'A 4.5% raise on a $60,000 salary adds $2,700.00 gross annually, raising the salary to $62,700.00.',
    faq: [
      { question: 'What is a typical cost-of-living adjustment?', answer: 'Standard cost-of-living adjustments (COLA) often fall between 2% and 4% annually to offset standard currency inflation.' }
    ],
    relatedSlugs: ['salary-increase-calculator', 'salary-converter-calculator', 'budget-calculator'],
    calculate: (inputs) => {
      const cur = Number(inputs.current) || 0;
      const raisePct = Number(inputs.raisePct) || 0;

      const increment = cur * (raisePct / 100);
      const newSalary = cur + increment;

      return {
        results: [
          { label: 'New annual Gross Salary', value: newSalary.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Increase Amount', value: increment.toFixed(2), unit: '$' },
          { label: 'Monthly Paycheck Increase', value: (increment / 12).toFixed(2), unit: '$' },
          { label: 'Bi-weekly paycheck Increase', value: (increment / 26).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Original Salary', value: cur, color: '#312e81' },
          { name: 'Added Raise Capital', value: increment, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'salary-increase-calculator',
    name: 'Salary Increase Calculator',
    slug: 'salary-increase-calculator',
    category: 'finance',
    description: 'Input previous and current compensation packages to calculate the absolute percentage increase.',
    seoTitle: 'Pay Promotion & Salary Increase Calculator | Calculatoora',
    seoDescription: 'Calculate the percentage increase of your new pay promotion. Compare current and prior wages.',
    inputs: [
      { id: 'oldPay', label: 'Prior Annual Salary', type: 'number', defaultValue: 55000, step: 1000, unit: '$' },
      { id: 'newPay', label: 'New Annual Salary', type: 'number', defaultValue: 68000, step: 1000, unit: '$' }
    ],
    formula: 'Increase % = [ (New - Old) / Old ] * 100',
    explanation: 'Calculate promotion pay raises or new job offer compensation increases.',
    example: 'Promoting from $55,000 to $68,000 represents a 23.64% salary hike, adding $13,000 annually.',
    faq: [
      { question: 'What represents a strong promotional raise?', answer: 'Internal promotions typically trigger a 10% to 20% wage bump, whereas changing employers can often yield 20% to 30% increases.' }
    ],
    relatedSlugs: ['raise-calculator', 'salary-converter-calculator', 'freelance-rate-calculator'],
    calculate: (inputs) => {
      const oldP = Number(inputs.oldPay) || 1;
      const newP = Number(inputs.newPay) || 0;

      const diff = newP - oldP;
      const pct = (diff / oldP) * 100;

      return {
        results: [
          { label: 'Percentage Increase', value: pct.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Absolute annual Increase', value: diff.toFixed(2), unit: '$' },
          { label: 'Monthly take-home boost equivalent', value: (diff / 12).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Prior Base', value: oldP, color: '#312e81' },
          { name: 'Hiked Premium Margin', value: Math.max(0, diff), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'freelance-rate-calculator',
    name: 'Freelance Rate Calculator',
    slug: 'freelance-rate-calculator',
    category: 'finance',
    description: 'Calculate the required hourly rate for freelance or consulting contracts, factoring in taxes, overhead, and billable hours.',
    seoTitle: 'Freelancer Hourly Rate & Cost Builder | Calculatoora',
    seoDescription: 'Calculate target hourly contract rates for independent consultants. Factor in unbillable research, time off, and commercial overhead.',
    inputs: [
      { id: 'target', label: 'Target Net Annual Salary', type: 'number', defaultValue: 70000, step: 2000, unit: '$' },
      { id: 'expenses', label: 'Annual Business Costs (Software, Rent)', type: 'number', defaultValue: 8000, step: 200, unit: '$' },
      { id: 'vacation', label: 'Desired Paid Time Off (Weeks)', type: 'number', defaultValue: 4, step: 1, unit: 'weeks' },
      { id: 'billable', label: 'Billable Client Hours Percentage', type: 'number', defaultValue: 70, step: 5, unit: '%' }
    ],
    formula: 'Available Hours = (52 - Vacation Weeks) * 40\nBillable Hours = Available Hours * (Billable % / 100)\nHourly Rate = (Target Salary + Expenses + Taxes) / Billable Hours',
    explanation: 'Freelancing requires setting rates high enough to cover self-employment taxes, insurance, overhead, and administrative hours.',
    example: 'To replace a $70,000 corporate salary while pocketing $8,000 in software overheads and taking 4 weeks off (assuming 70% of time is billable), freelance contracts require a rate of $61.35 hourly.',
    faq: [
      { question: 'What are unbillable hours?', answer: 'Hours spent on administrative business tasks such as invoices, client acquisition, contract drafting, and accounting do not generate revenue directly, but must still be funded.' }
    ],
    relatedSlugs: ['hourly-wage-calculator', 'salary-converter-calculator', 'raised-calculator'],
    calculate: (inputs) => {
      const target = Number(inputs.target) || 0;
      const opex = Number(inputs.expenses) || 0;
      const vac = Number(inputs.vacation) || 4;
      const billablePct = Number(inputs.billable) || 70;

      // Self employment tax cushion (add 15% to target salary for basic tax insurance)
      const selfEmpTaxCushion = target * 0.15;
      const grossTargetRequired = target + opex + selfEmpTaxCushion;

      const workingWeeks = Math.max(1, 52 - vac);
      const nominalHoursAvailable = workingWeeks * 40;
      const billableHoursCalculated = nominalHoursAvailable * (billablePct / 100);

      const requiredHourlyRate = billableHoursCalculated > 0 ? grossTargetRequired / billableHoursCalculated : 0;

      return {
        results: [
          { label: 'Required Freelance Hourly Rate', value: requiredHourlyRate.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Annual Billable Hours Worked', value: Math.round(billableHoursCalculated), unit: 'hours' },
          { label: 'Estimated Annual Tax & Cost Buffer', value: (selfEmpTaxCushion + opex).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Target Personal Pay', value: target, color: '#39FF14' },
          { name: 'Taxes and Business OPEX Reserves', value: Math.round(selfEmpTaxCushion + opex), color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'paycheck-calculator',
    name: 'Paycheck Calculator',
    slug: 'paycheck-calculator',
    category: 'finance',
    description: 'Calculate gross paycheck earnings, pre-tax benefits, post-tax deductions, and estimated tax allocations entirely on the client side.',
    seoTitle: 'Paycheck Calculator | Calculatoora',
    seoDescription: 'Obtain exact paycheck breakdown values from base salary, overtime shifts, bonuses, pre-tax benefits, and post-tax deductions.',
    inputs: [
      { id: 'pay', label: 'Reference Pay', type: 'number', defaultValue: 0, step: 100, unit: '$' }
    ],
    formula: 'Gross Pay = Base Pay + Overtime + Bonuses\nTaxable Income = Gross Pay - Pre-Tax Deductions\nNet Pay = Taxable Income - Taxes - Post-Tax Deductions',
    explanation: 'A fully offline, modern paycheck simulator that tracks take-home compensation without storing any user data.',
    example: 'A gross wage of $2,000 with a $150 pre-tax premium deduction, 15% estimated taxes, and a $30 post-tax health plan leaves $1,542.50 in take-home pay.',
    faq: [
      { question: 'Is my wage data secure?', answer: 'Yes. Every calculation runs entirely client-side inside your browser sandbox. No payroll metrics or financial coordinates are ever sent to external databases or APIs.' }
    ],
    relatedSlugs: ['salary-converter-calculator', 'hourly-wage-calculator', 'overtime-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Example Gross Pay', value: '0.00', unit: '$', isPrimary: true }
        ],
        chartData: [
          { name: 'Base Pay', value: 0, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'payroll-calculator',
    name: 'Payroll Calculator',
    slug: 'payroll-calculator',
    category: 'finance',
    description: 'Calculate complete payroll costs for employees, including gross pay, pre-tax deductions, post-tax deductions, and total employer payroll costs.',
    seoTitle: 'Payroll Calculator | Calculatoora',
    seoDescription: 'Interactive Payroll Calculator for businesses, HR professionals, and startups. Compute total cost-to-employer, net payroll, gross pay, deductions, and tax allocations client-side.',
    inputs: [
      { id: 'rate', label: 'Reference Employee Count', type: 'number', defaultValue: 0, step: 1, unit: 'employees' }
    ],
    formula: 'Gross Pay = Base Salary + Overtime + Bonuses\nEmployer Cost = Payroll Tax + Retirement match + Insurance + Workers Comp + Overhead\nTotal Payroll Cost = Gross Pay + Employer Cost',
    explanation: 'A client-side payroll engine designed to calculate employer costs, employee withholdings, and total expenditures for multiple staff members simultaneously.',
    example: 'An employee with $5,000 gross monthly salary, 10% tax withholding ($500), and a 7.65% employer payroll tax ($382.50) results in a $4,500 net check and a total cost to the employer of $5,382.50.',
    faq: [
      { question: 'What is the difference between paycheck and payroll calculators?', answer: 'A paycheck calculator determines a single employee\'s net take-home pay. A payroll calculator determines the total payroll expenses of a business for one or many employees, including employer-specific costs like taxes, insurance, and overhead.' },
      { question: 'What are typical employer payroll taxes?', answer: 'In the US, standard employer taxes include FICA (6.2% Social Security, 1.45% Medicare), FUTA (Federal Unemployment), and SUTA (State Unemployment).' }
    ],
    relatedSlugs: ['paycheck-calculator', 'salary-converter-calculator', 'hourly-wage-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Example Total Payroll Expense', value: '0.00', unit: '$', isPrimary: true }
        ],
        chartData: [
          { name: 'Gross Pay', value: 0, color: '#3b82f6' }
        ]
      };
    }
  }
];
