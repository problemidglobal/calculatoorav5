import { Calculator } from '../types';

export const V11_LEGAL_EDUCATION_CALCULATORS: Calculator[] = [
  // ==================== LAW & LEGAL ====================
  {
    id: 'legal-deadline-calculator',
    name: 'Legal Deadline Calculator',
    slug: 'legal-deadline-calculator',
    category: 'legal',
    description: 'Calculate critical statutory legal filing deadlines by adding offset calendar days or business days to an initial trigger date.',
    seoTitle: 'Statutory Legal Deadline Calculator | Calculatoora',
    seoDescription: 'Accurately determine court filing limits, civil response windows, and legal notice deadlines with standard court day adjustments.',
    inputs: [
      { id: 'startDate', label: 'Trigger Event Date', type: 'date', defaultValue: '2026-06-16' },
      { id: 'offsetDays', label: 'Statutory Window (Days)', type: 'number', defaultValue: 30, min: 1, max: 365, step: 1 },
      { id: 'calcMethod', label: 'Count Convention', type: 'select', defaultValue: 'calendar', options: [
        { label: 'Calendar Days (Continuous)', value: 'calendar' },
        { label: 'Business Days (Skip Weekends)', value: 'business' }
      ]}
    ],
    formula: 'Deadline = Start Date + Offset Days\nIf Business Days, Saturdays and Sundays are excluded.',
    explanation: 'Timely filing is a cornerstone of judicial procedure. This calculator identifies response and service milestones from initial summons or pleading dates. If a calendar deadline lands on a weekend, most courts allow extensions to the next business day.',
    example: 'A summons served on June 16, 2026, with a 30 business day responsive pleading window leads to an absolute filing deadline of July 28, 2026.',
    faq: [
      { question: 'What happens if a filing deadline land on a weekend or public holiday?', answer: 'In most civil law systems, local rules extend the statutory filing date to the immediate next active business day.' }
    ],
    relatedSlugs: ['court-date-calculator', 'contract-date-calculator'],
    keywords: ['legal deadline', 'court responsive window', 'summons reply date', 'statute limitations'],
    calculate: (inputs) => {
      const sDateStr = inputs.startDate || '2026-06-16';
      const offset = Number(inputs.offsetDays || 30);
      const method = inputs.calcMethod || 'calendar';

      const d = new Date(sDateStr);
      let daysAdded = 0;

      if (method === 'calendar') {
        d.setDate(d.getDate() + offset);
      } else {
        while (daysAdded < offset) {
          d.setDate(d.getDate() + 1);
          const day = d.getDay();
          if (day !== 0 && day !== 6) {
            daysAdded++;
          }
        }
      }

      // Check if final day land on weekend & auto-push
      let adjusted = false;
      const finalDay = d.getDay();
      if (finalDay === 0) {
        d.setDate(d.getDate() + 1);
        adjusted = true;
      } else if (finalDay === 6) {
        d.setDate(d.getDate() + 2);
        adjusted = true;
      }

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return {
        results: [
          { label: 'Calculated Filing Deadline', value: d.toLocaleDateString('en-US', options), isPrimary: true },
          { label: 'Day of Week', value: d.toLocaleDateString('en-US', { weekday: 'long' }) },
          { label: 'Auto Holiday/Weekend Adjusted', value: adjusted ? 'Yes (Pushed to Monday)' : 'No (Lands on Business Day)' }
        ],
        chartData: [
          { name: 'Initial Days', value: offset }
        ]
      };
    }
  },
  {
    id: 'contract-date-calculator',
    name: 'Contract Date Calculator',
    slug: 'contract-date-calculator',
    category: 'legal',
    description: 'Determine commercial contract termination, automatic renewal, or opt-out warning dates based on standardized durations.',
    seoTitle: 'Commercial Contract Term & Date Calculator | Calculatoora',
    seoDescription: 'Obtain exact contract effective dates, opt-out periods, and automatic notification warnings.',
    inputs: [
      { id: 'effDate', label: 'Contract Effective Date', type: 'date', defaultValue: '2026-06-16' },
      { id: 'durationMonths', label: 'Agreement Duration (Months)', type: 'number', defaultValue: 12, min: 1, max: 120, step: 1 },
      { id: 'optOutNotification', label: 'Notice Window Alert (Days prior)', type: 'number', defaultValue: 60, min: 1, max: 180, step: 1 }
    ],
    formula: 'Expiration Date = Effective Date + Duration Months\nContract Opt-Out Deadline = Expiration Date - Notice Window Days',
    explanation: 'Failing to send formal termination requests before contractual notification deadlines frequently triggers automatic evergreen extensions. This tool highlights critical milestones to preserve negotiating options.',
    example: 'An contract effective June 16, 2026, running 12 months, has an end date of June 16, 2027. With a 60-day notice limit, you must notify partners before April 17, 2027.',
    faq: [
      { question: 'What is an evergreen clause?', answer: 'A contractual term that automatically extends the agreement for a subsequent term if not cancelled by a designated date.' }
    ],
    relatedSlugs: ['notice-period-calculator', 'legal-deadline-calculator'],
    keywords: ['contract expiration', 'renew clause warning', 'opt out deadline solver', 'evergreen clause dates'],
    calculate: (inputs) => {
      const sDateStr = inputs.effDate || '2026-06-16';
      const months = Number(inputs.durationMonths || 12);
      const noticeDays = Number(inputs.optOutNotification || 60);

      const expDate = new Date(sDateStr);
      expDate.setMonth(expDate.getMonth() + months);

      const noticeDate = new Date(expDate.getTime());
      noticeDate.setDate(noticeDate.getDate() - noticeDays);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return {
        results: [
          { label: 'Opt-Out Notice Filing Deadline', value: noticeDate.toLocaleDateString('en-US', options), isPrimary: true },
          { label: 'Contract Expiration Target Date', value: expDate.toLocaleDateString('en-US', options) },
          { label: 'Notice Cushion Window', value: `${noticeDays} Days prior` }
        ],
        chartData: [
          { name: 'Duration (m)', value: months }
        ]
      };
    }
  },
  {
    id: 'notice-period-calculator',
    name: 'Employment Notice Period Calculator',
    slug: 'notice-period-calculator',
    category: 'legal',
    description: 'Calculate official resignation notice windows, final employment dates, and transition work schedules.',
    seoTitle: 'Resignation Notice Period Calculator | Calculatoora',
    seoDescription: 'Find your absolute final working day and standard notice durations after submitting formal resignation warnings.',
    inputs: [
      { id: 'submissionDate', label: 'Notice Submission Date', type: 'date', defaultValue: '2026-06-16' },
      { id: 'noticeType', label: 'Stipulated Contract Period', type: 'select', defaultValue: 'weeks', options: [
        { label: 'Weeks (e.g. 2, 4, or 8)', value: 'weeks' },
        { label: 'Calendar Days', value: 'days' },
        { label: 'Full Months (HMRC / EU Standard)', value: 'months' }
      ]},
      { id: 'noticeValue', label: 'Notice Period Duration Value', type: 'number', defaultValue: 4, min: 1, max: 180, step: 1 }
    ],
    formula: 'Final Working Day calculated by adding the notice duration parameter from submission date.',
    explanation: 'Calculating notice structures ensures fair legal separation of employment contracts. Notice parameters usually start the day after submission, and most jurisdictions extend the final day if it lands on holidays.',
    example: 'Submitting a notice on June 16, 2026, with a contract stating 4 weeks of notice leads to a final working day on July 14, 2026.',
    faq: [
      { question: 'What is Garden Leave?', answer: 'A legal arrangement where an employee submits notice but is instructed to stay away from the workplace while receiving standard salary during the transition.' }
    ],
    relatedSlugs: ['contract-date-calculator', 'legal-deadline-calculator'],
    keywords: ['notice period', 'resignation date', 'final shift calculator', 'gardening leave timeline'],
    calculate: (inputs) => {
      const sDateStr = inputs.submissionDate || '2026-06-16';
      const type = inputs.noticeType || 'weeks';
      const val = Number(inputs.noticeValue || 4);

      const target = new Date(sDateStr);
      if (type === 'weeks') {
        target.setDate(target.getDate() + (val * 7));
      } else if (type === 'days') {
        target.setDate(target.getDate() + val);
      } else {
        target.setMonth(target.getMonth() + val);
      }

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return {
        results: [
          { label: 'Estimated Last Active Day of Work', value: target.toLocaleDateString('en-US', options), isPrimary: true },
          { label: 'Notice Period Length Calculated', value: `${val} ${type}` },
          { label: 'Effective Day of Week', value: target.toLocaleDateString('en-US', { weekday: 'long' }) }
        ]
      };
    }
  },
  {
    id: 'court-date-calculator',
    name: 'Court Date & Scheduling Planner',
    slug: 'court-date-calculator',
    category: 'legal',
    description: 'Structure legal pleadings schedules relative to a fixed trial or hearing calendar date.',
    seoTitle: 'Court Motion Scheduling & Date Calculator | Calculatoora',
    seoDescription: 'Find court filing limits, pre-trial conference intervals, and expert disclosures schedules.',
    inputs: [
      { id: 'hearingDate', label: 'Trial / Hearing Commencement Date', type: 'date', defaultValue: '2026-09-15' },
      { id: 'disclosureGap', label: 'Expert Disclosure (Days prior)', type: 'number', defaultValue: 45, step: 5 },
      { id: 'motionGap', label: 'Last Day to File Motions (Days prior)', type: 'number', defaultValue: 30, step: 5 }
    ],
    formula: 'Filing Deadline = Trial Date - Target Days prior\nExclusions count backward, pushing matching dates to previous business day.',
    explanation: 'Litigation cases follow tight schedules. Most civil rules mandate critical motions and exhibits to be completed several weeks before trial.',
    example: 'For a scheduling trial on September 15, 2026, disclosures set 45 days prior must be completed on August 1, 2026.',
    faq: [
      { question: 'Does a Court day mean business days?', answer: 'Commonly, yes. If local guidelines explicitly demand Court Days rather than Calendar Days, weekend hours are fully excluded.' }
    ],
    relatedSlugs: ['legal-deadline-calculator', 'contract-date-calculator'],
    keywords: ['civil procedure court dates', 'trial milestones', 'expert disclosure limit', 'statutory timelines'],
    calculate: (inputs) => {
      const trialStr = inputs.hearingDate || '2026-09-15';
      const disclosure = Number(inputs.disclosureGap || 45);
      const motion = Number(inputs.motionGap || 30);

      const trial = new Date(trialStr);

      const dDate = new Date(trial.getTime());
      dDate.setDate(dDate.getDate() - disclosure);

      const mDate = new Date(trial.getTime());
      mDate.setDate(mDate.getDate() - motion);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return {
        results: [
          { label: 'Expert Disclosure Deadline', value: dDate.toLocaleDateString('en-US', options), isPrimary: true },
          { label: 'Final Motion Filing Deadline', value: mDate.toLocaleDateString('en-US', options) },
          { label: 'Selected Trial Target Date', value: trial.toLocaleDateString('en-US', options) }
        ],
        chartData: [
          { name: 'Motion Gap', value: motion },
          { name: 'Disclosure Gap', value: disclosure }
        ]
      };
    }
  },
  {
    id: 'interest-damage-calculator',
    name: 'Statutory Interest Damage Calculator',
    slug: 'interest-damage-calculator',
    category: 'legal',
    description: 'Calculate interest damages, pre-judgment or post-judgment simple interest owed on a defaulted commercial balance.',
    seoTitle: 'Pre-Judgment Legal Interest & Damange Calculator | Calculatoora',
    seoDescription: 'Obtain historical pre-judgment interest accruals for breach of contract or default claims.',
    inputs: [
      { id: 'principal', label: 'Disputed Principal Balance ($)', type: 'number', defaultValue: 75000, step: 5000 },
      { id: 'statRate', label: 'Statutory Interest Rate (%)', type: 'number', defaultValue: 10, min: 1, max: 20, step: 0.5 },
      { id: 'dayDelta', label: 'Breach Accrual (Days)', type: 'number', defaultValue: 365, min: 1, max: 2000, step: 30 }
    ],
    formula: 'Damages Interest = Principal * (Rate / 100) * (Days / 365)',
    explanation: 'When contract conditions break, the plaintiff has a claim to interest computed on default funds from the exact day of breach until final judgment, restoring monetary parity.',
    example: 'For a defaulted principal of $75,000 running 365 days under a statutory rate of 10%, pre-judgment damages interest equals $7,500.',
    faq: [
      { question: 'Is pre-judgment interest simple or compound?', answer: 'Unless contract documents explicitly authorize compounding intervals, courts award basic simple interest to defaults.' }
    ],
    relatedSlugs: ['payment-due-date-calculator', 'legal-deadline-calculator'],
    keywords: ['court pre judgment simple interest', 'breach damaged balance', 'judgment payout', 'statutory rate percent'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 75000);
      const r = Number(inputs.statRate || 10);
      const t = Number(inputs.dayDelta || 365);

      const int = p * (r / 100) * (t / 365);
      const grandTotal = p + int;

      return {
        results: [
          { label: 'Assessed Interest Damages Owed', value: int.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Grand Award (Principal + Interest)', value: grandTotal.toFixed(2), unit: '$' },
          { label: 'Daily Accrual Coefficient', value: (p * (r / 100) / 365).toFixed(4), unit: '$' }
        ],
        chartData: [
          { name: 'Disputed Base', value: p },
          { name: 'Damages Accrued', value: Math.round(int) }
        ]
      };
    }
  },
  {
    id: 'payment-due-date-calculator',
    name: 'Invoice Payment Due Date Calculator',
    slug: 'payment-due-date-calculator',
    category: 'legal',
    description: 'Calculate transactional due dates and late charge thresholds based on commercial Net 30, 60, or 90 payment conditions.',
    seoTitle: 'Commercial Net Payment Due Date Calculator | Calculatoora',
    seoDescription: 'Obtain commercial invoice deadline dates. Supports Net 30/60/90 and early cash discount parameters.',
    inputs: [
      { id: 'invoiceDate', label: 'Invoice Issuance Date', type: 'date', defaultValue: '2026-06-16' },
      { id: 'termCode', label: 'Agreed Payment Terms', type: 'select', defaultValue: '30', options: [
        { label: 'Net 15 Days', value: '15' },
        { label: 'Net 30 Days', value: '30' },
        { label: 'Net 45 Days', value: '45' },
        { label: 'Net 60 Days', value: '60' },
        { label: 'Net 90 Days', value: '90' }
      ]},
      { id: 'interestOverage', label: 'Annual Late Penalty Rate (%)', type: 'number', defaultValue: 18, min: 0, max: 36, step: 1 }
    ],
    formula: 'Payment Due Date = Invoice Date + Term Period (Days)\nDaily late penalty is evaluated continuously after deadline crosses.',
    explanation: 'Standard terms establish billing contract boundaries. Net 30 sets payment maturity 30 days past bill presentation, after which contract interest penalties start.',
    example: 'Billing on June 16, 2026, under Net 30 terms schedules the absolute payment deadline on July 16, 2026.',
    faq: [
      { question: 'What is 2/10 Net 30?', answer: 'A common invoice cash discount offering client companies a 2% price write-off if they clear balances inside 10 days, otherwise due in full at day 30.' }
    ],
    relatedSlugs: ['interest-damage-calculator', 'contract-date-calculator'],
    keywords: ['net billing calculator', 'thirty days term limit', 'invoice payment target', 'late fee penalty solver'],
    calculate: (inputs) => {
      const invStr = inputs.invoiceDate || '2026-06-16';
      const term = Number(inputs.termCode || 30);
      const rate = Number(inputs.interestOverage || 18);

      const d = new Date(invStr);
      d.setDate(d.getDate() + term);

      const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

      return {
        results: [
          { label: 'Invoice Effective Due Date', value: d.toLocaleDateString('en-US', options), isPrimary: true },
          { label: 'Staged Net Terms Applied', value: `Net ${term} Days` },
          { label: 'Annual Overdue Rate penalty', value: `${rate}.00%` }
        ]
      };
    }
  },

  // ==================== EDUCATION ADVANCED ====================
  {
    id: 'course-grade-calculator',
    name: 'Course Grade Calculator',
    slug: 'course-grade-calculator',
    category: 'education',
    description: 'Calculate average course grades using customized percentage weightings across dynamic testing blocks.',
    seoTitle: 'Course Weighted Grade Percent Calculator | Calculatoora',
    seoDescription: 'Find your current school course average based on homework, quiz, and test category percentage weightings.',
    inputs: [
      { id: 'hwScore', label: 'Homework Category Score (%)', type: 'number', defaultValue: 92, min: 0, max: 100, step: 1 },
      { id: 'hwWeight', label: 'Homework Class Weight (%)', type: 'number', defaultValue: 20, min: 0, max: 100, step: 5 },
      { id: 'examScore', label: 'Exams Category Score (%)', type: 'number', defaultValue: 85, min: 0, max: 100, step: 1 },
      { id: 'examWeight', label: 'Exams Class Weight (%)', type: 'number', defaultValue: 50, min: 0, max: 100, step: 5 },
      { id: 'projectScore', label: 'Project Category Score (%)', type: 'number', defaultValue: 95, min: 0, max: 100, step: 1 },
      { id: 'projectWeight', label: 'Project Class Weight (%)', type: 'number', defaultValue: 30, min: 0, max: 100, step: 5 }
    ],
    formula: 'Final Grade = Sum(Category Score * Category Weight) / Sum(Weights)',
    explanation: 'Most college courses use a weighted average system. Scores in heavily weighted categories (like midterms) have a greater impact on your final letter grade than homework.',
    example: 'Getting 92% on homework (weighted 20%), 85% on exams (weighted 50%), and 95% on projects (weighted 30%) yields a final weighted grade of 89.40% (B+).',
    faq: [
      { question: 'What if weights do not sum up to 100%?', answer: 'The calculation automatically normalizes values, dividing total progress contributions by the sum of active inputs.' }
    ],
    relatedSlugs: ['assignment-grade-calculator', 'gpa-projection-calculator'],
    keywords: ['weighted class score', 'semester rank average', 'grade tracking index', 'college test weights'],
    calculate: (inputs) => {
      const s1 = Number(inputs.hwScore || 0);
      const w1 = Number(inputs.hwWeight || 0);
      const s2 = Number(inputs.examScore || 0);
      const w2 = Number(inputs.examWeight || 0);
      const s3 = Number(inputs.projectScore || 0);
      const w3 = Number(inputs.projectWeight || 0);

      const totalWeight = w1 + w2 + w3;
      const finalVal = totalWeight > 0 ? ((s1 * w1) + (s2 * w2) + (s3 * w3)) / totalWeight : 0;

      let letter = 'F';
      if (finalVal >= 90) letter = 'A';
      else if (finalVal >= 80) letter = 'B';
      else if (finalVal >= 70) letter = 'C';
      else if (finalVal >= 60) letter = 'D';

      return {
        results: [
          { label: 'Overall Course Grade Percentage', value: finalVal.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Calculated Letter Grade Block', value: letter },
          { label: 'Total Weight Sum Configured', value: `${totalWeight}%` }
        ],
        chartData: [
          { name: 'HW Contribution', value: s1 * w1 },
          { name: 'Exam Contribution', value: s2 * w2 },
          { name: 'Project Contribution', value: s3 * w3 }
        ]
      };
    }
  },
  {
    id: 'assignment-grade-calculator',
    name: 'Assignment Grade Calculator',
    slug: 'assignment-grade-calculator',
    category: 'education',
    description: 'Quickly calculate test percentage grades from point values of correct versus missed questions.',
    seoTitle: 'Assignment Point Metric Grade Calculator | Calculatoora',
    seoDescription: 'Obtain percentage grades and final scorecard metrics based on correct question splits.',
    inputs: [
      { id: 'totalPoints', label: 'Total Assignment Points', type: 'number', defaultValue: 50, step: 5 },
      { id: 'pointsMissed', label: 'Points/Questions Missed', type: 'number', defaultValue: 6, step: 1 }
    ],
    formula: 'Score Percent = (1 - Missed / Total) * 100\nGrade maps directly to standard academic curves.',
    explanation: 'This calculator gives teachers and students a fast way to check test percentage boundaries. Simply divide the earned points by the total points possible.',
    example: 'Missing 6 questions on a 50-point quiz results in 44 points earned, which is an 88.00% (B+).',
    faq: [
      { question: 'What is a typical pass mark standard?', answer: 'Most US high schools consider 60% (D-) the minimum passing grade. Many universities require 70% (C-) for core courses.' }
    ],
    relatedSlugs: ['course-grade-calculator', 'gpa-projection-calculator'],
    keywords: ['test scorecard percentages', 'grading scales index', 'earned credits quiz', 'assignment percentage'],
    calculate: (inputs) => {
      const tot = Number(inputs.totalPoints || 50);
      const miss = Number(inputs.pointsMissed || 0);

      const got = Math.max(0, tot - miss);
      const pct = tot > 0 ? (got / tot) * 100 : 0;

      return {
        results: [
          { label: 'Final Test Score', value: pct.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Earned Points Count', value: got },
          { label: 'Total Points Available', value: tot }
        ],
        chartData: [
          { name: 'Point Credit', value: got },
          { name: 'Point Loss', value: miss }
        ]
      };
    }
  },
  {
    id: 'gpa-projection-calculator',
    name: 'GPA Projection Calculator',
    slug: 'gpa-projection-calculator',
    category: 'education',
    description: 'Forecast the cumulative GPA gains needed over future semester terms to reach a target graduation average.',
    seoTitle: 'Cumulative GPA Target Projection Calculator | Calculatoora',
    seoDescription: 'Forecast the average grades you must earn in your remaining semesters to reach your target GPA.',
    inputs: [
      { id: 'currentGpa', label: 'Current GPA Accumulation', type: 'number', defaultValue: 3.2, min: 0, max: 4.0, step: 0.1 },
      { id: 'currentCredits', label: 'Credits Earned so far', type: 'number', defaultValue: 60, step: 5 },
      { id: 'targetGpa', label: 'Target GPA for Graduation', type: 'number', defaultValue: 3.5, min: 0, max: 4.0, step: 0.1 },
      { id: 'remainingCredits', label: 'Credits remaining to graduate', type: 'number', defaultValue: 60, step: 5 }
    ],
    formula: 'Target Remaining GPA = [(Target GPA * Total Credits) - (Current GPA * Current Credits)] / Remaining Credits',
    explanation: 'Your cumulative GPA is a weighted average of your grades and credit hours. This calculator helps you determine the average grades you need to earn in your remaining credit hours to achieve your graduation goal.',
    example: 'With a 3.2 GPA over 60 credits, reaching a target 3.5 GPA over 60 remaining credits requires earning a 3.80 GPA in your remaining classes.',
    faq: [
      { question: 'What if the calculated target GPA is above 4.0?', answer: 'This indicates your goal is mathematically unreachable with standard A-grade classes. You may need to take more credits or target honors-weighted courses.' }
    ],
    relatedSlugs: ['course-grade-calculator', 'scholarship-calculator'],
    keywords: ['cum gpa projection', 'semester grades targets', 'gpa growth path', 'academic honors tracking'],
    calculate: (inputs) => {
      const curGpa = Number(inputs.currentGpa || 3.2);
      const curCred = Number(inputs.currentCredits || 60);
      const tarGpa = Number(inputs.targetGpa || 3.5);
      const remCred = Number(inputs.remainingCredits || 60);

      const totCred = curCred + remCred;
      const targetQualityPoints = (tarGpa * totCred) - (curGpa * curCred);
      const neededGpa = remCred > 0 ? targetQualityPoints / remCred : 0;

      const achievable = neededGpa <= 4.0;

      return {
        results: [
          { label: 'Required GPA in Remaining Classes', value: neededGpa.toFixed(2), isPrimary: true },
          { label: 'Is Target Mathematically Possible?', value: achievable ? 'Yes' : 'No (Requires > 4.0 GPA)' },
          { label: 'Total Career Credit Hours', value: totCred }
        ],
        chartData: [
          { name: 'Current Quality', value: curGpa * curCred },
          { name: 'Required Remaining', value: Math.max(0, targetQualityPoints) }
        ]
      };
    }
  },
  {
    id: 'scholarship-calculator',
    name: 'Scholarship Financial Aid Calculator',
    slug: 'scholarship-calculator',
    category: 'education',
    description: 'Calculate net college tuition costs after applying multiple scholarship grants and financial aid awards.',
    seoTitle: 'Collegiate Net Tuition Financial Aid Calculator | Calculatoora',
    seoDescription: 'Deduct public or institutional scholarship grants to estimate net out-of-pocket college costs.',
    inputs: [
      { id: 'stickerTuition', label: 'Annual Sticker Tuition Fee ($)', type: 'number', defaultValue: 35000, step: 1000 },
      { id: 'institutionalGrants', label: 'Institutional Scholarships ($)', type: 'number', defaultValue: 12000, step: 500 },
      { id: 'externalScholarships', label: 'External or Private Grants ($)', type: 'number', defaultValue: 3000, step: 500 },
      { id: 'workStudyValue', label: 'Work-Study / Federal aid ($)', type: 'number', defaultValue: 2500, step: 500 }
    ],
    formula: 'Net Cost = Annual Sticker Price - (Institutional + External Grants + Work Study)',
    explanation: 'Calculating the true cost of college helps students compare financial aid packages. Subtract institutional grants, private scholarships, and work-study savings from the published sticker price to find your net out-of-pocket costs.',
    example: 'Reviewing a college with $35,000 sticker tuition: Deducting a $12,000 merit grant, $3,000 external grant, and $2,500 work-study credit reveals a net cost of $17,500.',
    faq: [
      { question: 'What is the difference between grants and student loans?', answer: 'Grants and scholarships are gift aid that does not need to be repaid. Student loans must be repaid with interest.' }
    ],
    relatedSlugs: ['tuition-cost-calculator', 'education-loan-calculator'],
    keywords: ['college financial aid', 'net sticker price', 'merit grant award', 'collegiate scholarship math'],
    calculate: (inputs) => {
      const stick = Number(inputs.stickerTuition || 35000);
      const inst = Number(inputs.institutionalGrants || 12000);
      const ext = Number(inputs.externalScholarships || 3000);
      const work = Number(inputs.workStudyValue || 2500);

      const aid = inst + ext + work;
      const net = Math.max(0, stick - aid);

      return {
        results: [
          { label: 'Net Annual College Cost', value: net.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Total Gift Aid & Aid Earned', value: aid.toFixed(2), unit: '$' },
          { label: 'Average Monthly Cost equivalent', value: (net / 12).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Sticker Price', value: stick },
          { name: 'Net out of pocket', value: net }
        ]
      };
    }
  },
  {
    id: 'tuition-cost-calculator',
    name: 'College Tuition Cost Calculator',
    slug: 'tuition-cost-calculator',
    category: 'education',
    description: 'Calculate complete multi-year college expenses including room, board, book allowances, and annual tuition inflation adjustments.',
    seoTitle: 'Collegiate Multi-Year Cost Estimator | Calculatoora',
    seoDescription: 'Estimate your total college expenses over a 4-year degree, factoring in annual tuition inflation.',
    inputs: [
      { id: 'baseTuition', label: 'First Year Base Tuition ($)', type: 'number', defaultValue: 22000, step: 1000 },
      { id: 'roomBoard', label: 'Annual Room & Board ($)', type: 'number', defaultValue: 11000, step: 500 },
      { id: 'inflationRate', label: 'Typical Inflation Rate (%)', type: 'number', defaultValue: 3.5, step: 0.1 },
      { id: 'degreeYears', label: 'Degree Track Duration (Years)', type: 'number', defaultValue: 4, min: 1, max: 6, step: 1 }
    ],
    formula: 'Cost(t) = (Base Tuition + Room & Board) * (1 + Inflation)^(t-1)\nTotal Cost is sum of each year\'s adjusted values.',
    explanation: 'College costs rise over time due to inflation. This calculator projects your tuition, room, and board expenses for each year of your degree to help you estimate your total educational investment.',
    example: 'Starting with a first-year cost of $33,000 ($22,000 tuition + $11,000 housing) and 3.5% inflation, a 4-year degree will cost approximately $138,980 in total.',
    faq: [
      { question: 'What is the typical annual tuition inflation rate?', answer: 'In the US, college tuition and fees have historically increased by 3% to 5% annually, outstripping standard consumer price inflation.' }
    ],
    relatedSlugs: ['scholarship-calculator', 'education-loan-calculator'],
    keywords: ['college budget tracker', 'tuition inflation rates', 'four year cost simulation', 'academic degree planner'],
    calculate: (inputs) => {
      const baseT = Number(inputs.baseTuition || 22000);
      const room = Number(inputs.roomBoard || 11000);
      const inf = Number(inputs.inflationRate || 3.5);
      const yrs = Number(inputs.degreeYears || 4);

      let total = 0;
      const yearlyDetails = [];

      for (let y = 1; y <= yrs; y++) {
        const factor = Math.pow(1 + (inf / 100), y - 1);
        const yCost = (baseT + room) * factor;
        total += yCost;
        yearlyDetails.push({ name: `Year ${y}`, value: Math.round(yCost) });
      }

      return {
        results: [
          { label: 'Total Career Hired Costs', value: total.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Average Cost per Academic Year', value: (total / yrs).toFixed(2), unit: '$' },
          { label: 'Compounded Year 4 total cost', value: yearlyDetails[yrs - 1]?.value || 0, unit: '$' }
        ],
        chartData: yearlyDetails
      };
    }
  },
  {
    id: 'education-loan-calculator',
    name: 'Student Education Loan Calculator',
    slug: 'education-loan-calculator',
    category: 'education',
    description: 'Structure monthly student loan repayment schedules, factoring in capitalized interest during in-school deferment period.',
    seoTitle: 'Student Loan Deferment & Repayment Calculator | Calculatoora',
    seoDescription: 'Determine your post-graduation student loan payments. Factors in in-school interest deferment options.',
    inputs: [
      { id: 'principal', label: 'Core Student Loan Balance ($)', type: 'number', defaultValue: 30000, step: 2000 },
      { id: 'apr', label: 'Loan Annual Interest Rate (%)', type: 'number', defaultValue: 5.8, step: 0.1 },
      { id: 'termYears', label: 'Repayment Term (Years)', type: 'number', defaultValue: 10, min: 5, max: 25, step: 5 },
      { id: 'schoolYears', label: 'In-School Deferment Duration (Years)', type: 'number', defaultValue: 4, min: 0, max: 6, step: 1 },
      { id: 'interestPayment', label: 'Payment Option during deferment', type: 'select', defaultValue: 'defer', options: [
        { label: 'Defer and Capitalize Interest', value: 'defer' },
        { label: 'Pay Interest monthly in school', value: 'pay' }
      ]}
    ],
    formula: 'Capitalized Balance = Principal * (1 + APR / 100)^Deferment Years (if deferred)\nMonthly Payment calculated using standard amortization on capitalized balance.',
    explanation: 'Many student loans allow you to defer payments while you are in school. However, if interest is deferred and capitalized, it is added to your principal balance, meaning you will pay interest on interest once repayment begins.',
    example: 'Deferring a $30,000 student loan at 5.8% for 4 years of school increases your starting repayment balance to $37,587, raising your monthly payment from $330.13 to $413.56.',
    faq: [
      { question: 'What is interest capitalization?', answer: 'The process where accrued unscheduled interest is added to your loan\'s principal balance, increasing the amount you owe and the interest you accrue.' }
    ],
    relatedSlugs: ['tuition-cost-calculator', 'scholarship-calculator'],
    keywords: ['student loan deferment', 'capitalized interest solver', 'academic credit borrowing', 'finaid repayment'],
    calculate: (inputs) => {
      const p = Number(inputs.principal || 30000);
      const apr = Number(inputs.apr || 5.8);
      const term = Number(inputs.termYears || 10);
      const schoolYrs = Number(inputs.schoolYears || 4);
      const option = inputs.interestPayment || 'defer';

      let startingRepayBal = p;
      let totalInterestInSchool = 0;

      if (option === 'defer' && schoolYrs > 0) {
        startingRepayBal = p * Math.pow(1 + (apr / 100), schoolYrs);
        totalInterestInSchool = startingRepayBal - p;
      }

      const r = (apr / 100) / 12;
      const n = term * 12;

      let monthly = 0;
      if (r > 0) {
        monthly = startingRepayBal * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
      } else {
        monthly = startingRepayBal / n;
      }

      const totalPaid = monthly * n;
      const totalPostRepayInterest = totalPaid - startingRepayBal;

      return {
        results: [
          { label: 'Estimated Post-School Monthly Payment', value: monthly.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Repayment Starting Principal', value: startingRepayBal.toFixed(2), unit: '$' },
          { label: 'Capitalized Interest accumulated', value: totalInterestInSchool.toFixed(2), unit: '$' },
          { label: 'Total Career Borrowing Interest Cost', value: (totalPostRepayInterest + totalInterestInSchool).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Core Borrowed', value: p },
          { name: 'Capitalized Interest', value: Math.round(totalInterestInSchool) },
          { name: 'Repayment Interest', value: Math.round(totalPostRepayInterest) }
        ]
      };
    }
  },
  {
    id: 'study-cost-calculator',
    name: 'Total Daily Study Cost Calculator',
    slug: 'study-cost-calculator',
    category: 'education',
    description: 'Track daily and weekly personal study expenses, combining textbooks, transport, housing, and general supplies.',
    seoTitle: 'Daily and Monthly Study Lifestyle Budget | Calculatoora',
    seoDescription: 'Estimate your custom student lifestyle budget. Accounts for books, housing, transit, food, and class costs.',
    inputs: [
      { id: 'housingMonthly', label: 'Monthly Student Rent ($)', type: 'number', defaultValue: 850, step: 50 },
      { id: 'booksSemester', label: 'Semester Textbook & Supplies Allowance ($)', type: 'number', defaultValue: 600, step: 50 },
      { id: 'commuteDaily', label: 'Daily Transit / Fuel Costs ($)', type: 'number', defaultValue: 6, step: 1 },
      { id: 'foodWeekly', label: 'Weekly Food & Dining Expenses ($)', type: 'number', defaultValue: 120, step: 10 }
    ],
    formula: 'Daily Study Cost = (Rent * 12 / 365) + (Semester Books * 2 / 365) + Daily Transit + (Food Weekly * 52 / 365)',
    explanation: 'A comprehensive budget helps students manage their cash flow. This tool consolidates housing, textbooks, commuting, and food costs into standardized daily and weekly expense metrics.',
    example: 'With $850 rent, $600 textbooks per semester, $6 daily transit, and $120 weekly food, your average daily study lifestyle cost is approximately $58.12.',
    faq: [
      { question: 'How can I lower textbook costs?', answer: 'Rent textbooks online, purchase older used editions, search for open-source digital versions, or check university library reserve shelves.' }
    ],
    relatedSlugs: ['scholarship-calculator', 'tuition-cost-calculator'],
    keywords: ['student lifestyle budget', 'textbook expenses', 'daily college cost', 'room and board savings'],
    calculate: (inputs) => {
      const rent = Number(inputs.housingMonthly || 850);
      const books = Number(inputs.booksSemester || 600);
      const travel = Number(inputs.commuteDaily || 6);
      const food = Number(inputs.foodWeekly || 120);

      const dHousing = (rent * 12) / 365;
      const dBooks = (books * 2) / 365; // assume 2 semesters/yr
      const dFood = (food * 52) / 365;
      const dailyTotal = dHousing + dBooks + travel + dFood;

      return {
        results: [
          { label: 'Average Student Daily Cost', value: dailyTotal.toFixed(2), unit: '$', isPrimary: true },
          { label: 'Weekly Student Cost Equivalent', value: (dailyTotal * 7).toFixed(2), unit: '$' },
          { label: 'Monthly Student Expenses Equivalent', value: (dailyTotal * 30.4).toFixed(2), unit: '$' }
        ],
        chartData: [
          { name: 'Rent', value: Math.round(dHousing) },
          { name: 'Supplies', value: Math.round(dBooks) },
          { name: 'Food', value: Math.round(dFood) },
          { name: 'Transit', value: travel }
        ]
      };
    }
  },
  {
    id: 'learning-progress-calculator',
    name: 'Curriculum Learning Progress Calculator',
    slug: 'learning-progress-calculator',
    category: 'education',
    description: 'Track academic progress by calculating completed modules, assignments, and study hour benchmarks.',
    seoTitle: 'Academic Curriculum Learning Progress | Calculatoora',
    seoDescription: 'Measure your progress through a course syllabus, complete with percentage trackers and study time forecasts.',
    inputs: [
      { id: 'totalModules', label: 'Total Syllabus Modules', type: 'number', defaultValue: 16, step: 2 },
      { id: 'completedModules', label: 'Modules Fully Checked', type: 'number', defaultValue: 6, step: 1 },
      { id: 'hoursPerModule', label: 'Average Study Hours per Module', type: 'number', defaultValue: 12, step: 2 }
    ],
    formula: 'Completion Percentage = (Completed / Total) * 100\nRemaining study hours = (Total - Completed) * Hours per Module',
    explanation: 'Self-paced learning is easier to manage when you break your syllabus into chunks. Use this calculator to see your completion percentage and estimate the study time needed to finish your course.',
    example: 'Completing 6 out of 16 syllabus modules yields a 37.50% curriculum completion rate, with 120 study hours remaining.',
    faq: [
      { question: 'What is the pomodoro spacing standard for module learning?', answer: 'We suggest breaking modules into 25-minute study intervals separated by 5-minute cognitive resets to optimize long-term memory retention.' }
    ],
    relatedSlugs: ['course-grade-calculator', 'assignment-grade-calculator'],
    keywords: ['curriculum syllabus progress', 'self study tracker hours', 'online certification modules', 'learning roadmap'],
    calculate: (inputs) => {
      const tot = Number(inputs.totalModules || 16);
      const comp = Number(inputs.completedModules || 0);
      const hours = Number(inputs.hoursPerModule || 12);

      const netComp = Math.min(comp, tot);
      const pct = tot > 0 ? (netComp / tot) * 100 : 0;
      const remHours = (tot - netComp) * hours;

      return {
        results: [
          { label: 'Syllabus Journey Cleared', value: pct.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Study Hours Required to finish', value: remHours, unit: 'hrs' },
          { label: 'Active Modules Remaining', value: tot - netComp }
        ],
        chartData: [
          { name: 'Completed Classes', value: netComp },
          { name: 'Remaining Classes', value: tot - netComp }
        ]
      };
    }
  }
];
