import { Calculator } from '../types';

export const DATE_TIME_CALCULATORS: Calculator[] = [
  {
    id: 'age-advanced-calculator',
    name: 'Age Advanced Calculator',
    slug: 'age-advanced-calculator',
    category: 'daily-life',
    description: 'Calculate absolute biological age down to years, months, weeks, days, and seconds, with a countdown to your next birthday.',
    seoTitle: 'Advanced Age & Birthday Countdown Calculator | Calculatoora',
    seoDescription: 'Accurately pinpoint historical dates and calculate age in years, months, or total days lived. Find next birthday countdown schedules.',
    inputs: [
      { id: 'birthdate', label: 'Select Date of Birth', type: 'date', defaultValue: '1995-06-15' }
    ],
    formula: 'Age = Current Timestamp - Birthdate Timestamp\nCalculated down to precise calendar leaps.',
    explanation: 'Drawn from native browser calendar systems. Pinpoints biological ages across multi-frequency segments.',
    example: 'An individual born on June 15, 1995 evaluated in 2026 is exactly 31 years old, has lived 11,323 days, and countdowns exactly 365 days to their next birthday.',
    faq: [
      { question: 'Does it calculate leap years?', answer: 'Yes, our timeline algorithms correctly factor in leap year adjustments (adding February 29th) for all historic intervals.' }
    ],
    relatedSlugs: ['days-between-dates-calculator', 'time-duration-calculator', 'working-days-calculator'],
    calculate: (inputs) => {
      const bstr = inputs.birthdate || '1995-06-15';
      const bdate = new Date(bstr);
      const now = new Date();

      if (bdate > now) {
        return {
          results: [{ label: 'Error message', value: 'Birthdate cannot sit in the future.', unit: 'error', isPrimary: true }],
          chartData: []
        };
      }

      // Compute exact age
      let y = now.getFullYear() - bdate.getFullYear();
      let m = now.getMonth() - bdate.getMonth();
      let d = now.getDate() - bdate.getDate();

      if (d < 0) {
        m--;
        // Get days of previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        d += prevMonth.getDate();
      }
      if (m < 0) {
        y--;
        m += 12;
      }

      const totalMs = now.getTime() - bdate.getTime();
      const totalDays = Math.floor(totalMs / (1000 * 60 * 60 * 24));
      const totalWeeks = Math.floor(totalDays / 7);

      // Countdown to next birth year
      const nextB = new Date(bdate);
      nextB.setFullYear(now.getFullYear());
      if (nextB < now) {
        nextB.setFullYear(now.getFullYear() + 1);
      }
      const countdownMs = nextB.getTime() - now.getTime();
      const countdownDays = Math.ceil(countdownMs / (1000 * 60 * 60 * 24));

      return {
        results: [
          { label: 'Accurate biological Age', value: `${y} Years, ${m} Months, ${d} Days`, unit: 'age', isPrimary: true },
          { label: 'Total Calendar Days Lived', value: totalDays.toString(), unit: 'days' },
          { label: 'Total Weeks Lived', value: totalWeeks.toString(), unit: 'weeks' },
          { label: 'Days Until Next Birthday Celebration', value: countdownDays.toString(), unit: 'days' }
        ],
        chartData: [
          { name: 'Days Lived', value: totalDays, color: '#39FF14' },
          { name: 'Days Until Next Birthday', value: countdownDays, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'days-between-dates-calculator',
    name: 'Days Between Dates',
    slug: 'days-between-dates-calculator',
    category: 'daily-life',
    description: 'Find total days, weeks, and months between two target calendar dates with optional weekend filters.',
    seoTitle: 'Calculate Days Between Dates | Calculatoora',
    seoDescription: 'Obtain absolute elapsed time between any two dates. Filter out weekend spans if desired.',
    inputs: [
      { id: 'start', label: 'Start Date', type: 'date', defaultValue: '2026-01-01' },
      { id: 'end', label: 'End Date', type: 'date', defaultValue: '2026-12-31' }
    ],
    formula: 'Days = (End Date MS - Start Date MS) / (1000 * 60 * 60 * 24)',
    explanation: 'Simple calculation of the aggregate distance between dates, useful for lease tracking, milestone goals, or travel plans.',
    example: 'From January 1, 2026 to December 31, 2026 represents exactly 364 calendar days gap (365 days span).',
    faq: [
      { question: 'Is the end date included?', answer: 'Our standard calculation subtracts dates mathematically, representing elapsed days. You can add 1 if you wish to count the start date as Day 1.' }
    ],
    relatedSlugs: ['age-advanced-calculator', 'working-days-calculator', 'date-add-subtract-calculator'],
    calculate: (inputs) => {
      const sstr = inputs.start || '2026-01-01';
      const estr = inputs.end || '2026-12-31';

      const d1 = new Date(sstr);
      const d2 = new Date(estr);

      const diffMs = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const weeks = (days / 7).toFixed(1);
      const months = (days / 30.437).toFixed(1); // average month duration

      return {
        results: [
          { label: 'Total Elapsed Calendar Days', value: days, unit: 'days', isPrimary: true },
          { label: 'Equivalent Weeks Span', value: weeks, unit: 'weeks' },
          { label: 'Equivalent Months Span', value: months, unit: 'months' }
        ],
        chartData: [
          { name: 'Calendar Days Gap', value: days, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'date-add-subtract-calculator',
    name: 'Date Calculator',
    slug: 'date-add-subtract-calculator',
    category: 'daily-life',
    description: 'Add or subtract days, weeks, months, and years from any starting date to isolate project milestone targets.',
    seoTitle: 'Date Add & Subtract Calculator | Calculatoora',
    seoDescription: 'Project future deadline dates. Input target calendar adjustments to calculate terminal target dates.',
    inputs: [
      { id: 'start', label: 'Starting Date', type: 'date', defaultValue: '2026-06-15' },
      { id: 'action', label: 'Operation', type: 'select', defaultValue: 'add', options: [
        { label: 'Add Time (+)', value: 'add' },
        { label: 'Subtract Time (-)', value: 'subtract' }
      ]},
      { id: 'count', label: 'Quantity of Units', type: 'number', defaultValue: 45, step: 1 },
      { id: 'unit', label: 'Calendar Unit', type: 'select', defaultValue: 'days', options: [
        { label: 'Days', value: 'days' },
        { label: 'Weeks', value: 'weeks' },
        { label: 'Months', value: 'months' },
        { label: 'Years', value: 'years' }
      ]}
    ],
    formula: 'Target Date = Start Date +/- (Quantity * Unit Time)',
    explanation: 'Project managers use target estimators to forecast timeline deliveries, sprint gates, and maturity periods.',
    example: 'Adding 45 days onto a June 15, 2026 start date calculates precisely to July 30, 2026.',
    faq: [
      { question: 'Does the calculator shift months correctly?', answer: 'Yes, date arithmetic methods correctly step through month boundaries (such as transitioning from July 31st into August) and year milestones.' }
    ],
    relatedSlugs: ['days-between-dates-calculator', 'working-days-calculator', 'time-duration-calculator'],
    calculate: (inputs) => {
      const sstr = inputs.start || '2026-06-15';
      const action = inputs.action || 'add';
      const qty = Number(inputs.count) || 0;
      const unit = inputs.unit || 'days';

      const d = new Date(sstr);
      const sign = action === 'add' ? 1 : -1;

      if (unit === 'days') {
        d.setDate(d.getDate() + (qty * sign));
      } else if (unit === 'weeks') {
        d.setDate(d.getDate() + (qty * 7 * sign));
      } else if (unit === 'months') {
        d.setMonth(d.getMonth() + (qty * sign));
      } else if (unit === 'years') {
        d.setFullYear(d.getFullYear() + (qty * sign));
      }

      const formatted = d.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      return {
        results: [
          { label: 'Calculated Target Date', value: formatted, unit: 'date', isPrimary: true },
          { label: 'Raw Date String', value: d.toISOString().split('T')[0], unit: 'string' }
        ],
        chartData: [
          { name: 'Reference days modification', value: qty, color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'working-days-calculator',
    name: 'Working Days Calculator',
    slug: 'working-days-calculator',
    category: 'daily-life',
    description: 'Calculate business days between two dates, automatically filtering out weekends (Saturdays and Sundays).',
    seoTitle: 'Business & Working Days Calculator | Calculatoora',
    seoDescription: 'Calculate pure working days. Filter out weekend dates to plan commercial project delivery cycles.',
    inputs: [
      { id: 'start', label: 'Project Start Date', type: 'date', defaultValue: '2026-01-01' },
      { id: 'end', label: 'Project End Date', type: 'date', defaultValue: '2026-01-31' }
    ],
    formula: 'Loops through the range of calendar dates, testing each index with "getDay()" to filter out weekend days.',
    explanation: 'Used for payroll forecasting, manufacturing timelines, and client service metrics where weekend timelines do not count.',
    example: 'From January 1, 2026 to January 31, 2026, there are exactly 30 total elapsed days. Filtering out weekends reveals 22 pure working business days.',
    faq: [
      { question: 'Does this factor in local holiday filters?', answer: 'This baseline model focuses on filtration of weekends. For custom local structural holidays, subtract those dates manually from the net result.' }
    ],
    relatedSlugs: ['days-between-dates-calculator', 'date-add-subtract-calculator', 'time-duration-calculator'],
    calculate: (inputs) => {
      const sstr = inputs.start || '2026-01-01';
      const estr = inputs.end || '2026-01-31';

      let d1 = new Date(sstr);
      const d2 = new Date(estr);

      let totalDays = 0;
      let workDays = 0;

      // Ensure chronological order
      if (d1 > d2) {
        d1 = new Date(estr);
      }

      const temp = new Date(d1);
      while (temp <= d2) {
        totalDays++;
        const dayOfWeek = temp.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Not Sunday (0) and not Saturday (6)
          workDays++;
        }
        temp.setDate(temp.getDate() + 1);
      }

      const weekends = totalDays - workDays;

      return {
        results: [
          { label: 'Net Working Business Days', value: workDays, unit: 'days', isPrimary: true },
          { label: 'Weekend Days Filtered', value: weekends, unit: 'days' },
          { label: 'Total Elapsed Calendar Days', value: totalDays, unit: 'days' }
        ],
        chartData: [
          { name: 'Core Working Days', value: workDays, color: '#39FF14' },
          { name: 'Weekend Leisure Days', value: weekends, color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'time-duration-calculator',
    name: 'Time Duration Calculator',
    slug: 'time-duration-calculator',
    category: 'daily-life',
    description: 'Calculate elapsed hours and minutes between two times on a 12-hour or 24-hour cycle.',
    seoTitle: 'Determine Time Duration Hours | Calculatoora',
    seoDescription: 'Obtain exact time duration gaps. Input start and end hours/minutes to calculate payroll work hours.',
    inputs: [
      { id: 'startTime', label: 'Starting Time (HH:MM)', type: 'text', defaultValue: '09:00' },
      { id: 'endTime', label: 'Ending Time (HH:MM)', type: 'text', defaultValue: '17:30' }
    ],
    formula: 'Minutes Diff = (End Minutes + End Hours * 60) - (Start Minutes + Start Hours * 60)',
    explanation: 'A quick tool for shift workers, athletes tracking lap paces, or mechanics filing service invoices.',
    example: 'Working from 09:00 AM to 17:30 (5:30 PM) is 8 hours and 30 minutes of total elapsed time.',
    faq: [
      { question: 'Can I calculate spanning midnight?', answer: 'Yes, if the end time is earlier than the start time, our algorithm assumes the shift crossed past midnight into the next day and calculates correctly.' }
    ],
    relatedSlugs: ['age-advanced-calculator', 'working-days-calculator', 'days-between-dates-calculator'],
    calculate: (inputs) => {
      const s = inputs.startTime || '09:00';
      const e = inputs.endTime || '17:30';

      const sParts = s.split(':');
      const eParts = e.split(':');

      const sH = Number(sParts[0]) || 0;
      const sM = Number(sParts[1]) || 0;
      let eH = Number(eParts[0]) || 0;
      const eM = Number(eParts[1]) || 0;

      let startMinTotal = sH * 60 + sM;
      let endMinTotal = eH * 60 + eM;

      // Handle midnight crossing
      if (endMinTotal < startMinTotal) {
        endMinTotal += 24 * 60;
      }

      const diff = endMinTotal - startMinTotal;
      const hours = Math.floor(diff / 60);
      const minutes = diff % 60;

      return {
        results: [
          { label: 'Net Elapsed Duration', value: `${hours} Hours, ${minutes} Minutes`, unit: 'time', isPrimary: true },
          { label: 'Total Equal Minutes', value: diff.toString(), unit: 'minutes' },
          { label: 'Equivalent Decimal Hours', value: (diff / 60).toFixed(2), unit: 'hours' }
        ],
        chartData: [
          { name: 'Equivalent Elapsed Minutes', value: diff, color: '#39FF14' }
        ]
      };
    }
  }
];
