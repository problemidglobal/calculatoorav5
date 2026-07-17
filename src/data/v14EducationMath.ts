import { Calculator } from '../types';

export const V14_EDUCATION_MATH_CALCULATORS: Calculator[] = [
  // EDUCATION
  {
    id: 'learning-time',
    name: 'Learning Time Calculator',
    slug: 'learning-time-calculator',
    category: 'education',
    description: 'Estimate the total calendar time required to master a custom skill or curriculum based on daily focus schedules.',
    seoTitle: 'Skill Learning Time & Mastery Hours Planner',
    seoDescription: 'Input target mastery hours and daily study duration to calculate your learning timeline.',
    inputs: [
      { id: 'masteryHours', label: 'Required Target Study Hours', type: 'number', defaultValue: 120, helpText: 'e.g. 100-150h for moderate skills, 10000h for world-class mastery' },
      { id: 'dailyHours', label: 'Daily Planned Study Hours', type: 'number', defaultValue: 1.5, step: 0.1 },
      { id: 'weeklyDays', label: 'Study Days per Week', type: 'number', defaultValue: 5, min: 1, max: 7 }
    ],
    formula: 'Weeks Required = Target Hours / (Daily Hours * Days per Week)\nTotal Days = Weeks Required * 7',
    explanation: 'Uses a simple pacing model to convert study limits into concrete calendar deadlines, maintaining realistic progression milestones.',
    example: 'A 120-hour professional certification with a daily study hour of 1.5 hours, 5 days a week, takes exactly 16.0 weeks of focused study.',
    faq: [
      { question: 'Is the 10,000-hour mastery rule real?', answer: 'The 10k hours concept represents world-class expert levels. General career-competence level can be achieved in 100-200 hours of focused study.' },
      { question: 'Why does study frequency matter?', answer: 'Space-rehearsal studies show that consistent, smaller daily blocks improve memory retention better than crammed sessions.' }
    ],
    relatedSlugs: ['exam-preparation-calculator', 'study-goal-calculator'],
    calculate: (inputs) => {
      const target = Number(inputs.masteryHours || 120);
      const daily = Number(inputs.dailyHours || 1.5);
      const days = Number(inputs.weeklyDays || 5);

      const hoursPerWeek = daily * days;
      const weeksNeeded = hoursPerWeek > 0 ? target / hoursPerWeek : 0;
      const totalCalendarDays = Math.ceil(weeksNeeded * 7);

      return {
        results: [
          { label: 'Time Horizon Required', value: `${weeksNeeded.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Total Calendar Days', value: `${totalCalendarDays} Days` },
          { label: 'Weekly Study Capacity', value: `${hoursPerWeek.toFixed(1)} Hours/week` },
          { label: 'Days Omitted as Rest', value: `${Math.ceil(weeksNeeded * (7 - days))} Days` }
        ],
        chartData: [
          { name: 'Study Hours Banked', value: target },
          { name: 'Rest Days Allocated', value: Math.ceil(weeksNeeded * (7 - days)) }
        ]
      };
    }
  },
  {
    id: 'exam-prep',
    name: 'Exam Preparation Calculator',
    slug: 'exam-preparation-calculator',
    category: 'education',
    description: 'Calculate the daily pacing required to cover all lessons and practice materials before your exam date.',
    seoTitle: 'Exam Preparation & Pacing Planner',
    seoDescription: 'Log outstanding chapters and target dates to generate a structured exam preparation timeline.',
    inputs: [
      { id: 'chapters', label: 'Total Chapters/Topics to Cover', type: 'number', defaultValue: 18 },
      { id: 'daysLeft', label: 'Days Remaining Until Exam', type: 'number', defaultValue: 30 },
      { id: 'reviewBuffer', label: 'Buffer Days for Practice Exams', type: 'number', defaultValue: 5 }
    ],
    formula: 'Daily Pacing Rate = Chapters / (Days Left - Review Buffer)',
    explanation: 'Deducting review buffers ensures you finish lessons early, leaving safe margins for final practice tests and mock revisions.',
    example: 'With 18 chapters and 30 days left, dedicating 5 buffer days means you must cover exactly 0.72 chapters per study day.',
    faq: [
      { question: 'What is a review buffer?', answer: 'A block of days set aside right before the exam solely for taking mock tests, practicing past papers, and resting.' },
      { question: 'How do I handle falling behind?', answer: 'Adjust your study schedule to increase daily study hours or reduce non-essential activities until you catch up.' }
    ],
    relatedSlugs: ['learning-time-calculator', 'study-goal-calculator'],
    calculate: (inputs) => {
      const chpt = Number(inputs.chapters || 18);
      const days = Number(inputs.daysLeft || 30);
      const buffer = Number(inputs.reviewBuffer || 5);

      const studyDays = Math.max(1, days - buffer);
      const rate = chpt / studyDays;

      return {
        results: [
          { label: 'Study Rate Required', value: `${rate.toFixed(2)} Chapters/day`, isPrimary: true },
          { label: 'Total Study Days', value: `${studyDays} study-days` },
          { label: 'Rehearsal Practice Gaps', value: `${buffer} buffer-days` },
          { label: 'Weekly chapter rate', value: `${(rate * 7).toFixed(1)} Chapters/week` }
        ],
        chartData: [
          { name: 'Active Study Days', value: studyDays },
          { name: 'Rehearsal Buffer Days', value: buffer }
        ]
      };
    }
  },
  {
    id: 'course-completion',
    name: 'Course Completion Calculator',
    slug: 'course-completion-calculator',
    category: 'education',
    description: 'Monitor and project your course graduation timeline based on active progress rates.',
    seoTitle: 'Online Course Completion Rate Tracker',
    seoDescription: 'Input course videos or documents already completed to calculate your expected graduation dates.',
    inputs: [
      { id: 'totalLectures', label: 'Total Course Lectures/Modules', type: 'number', defaultValue: 60 },
      { id: 'doneLectures', label: 'Lectures Completed So Far', type: 'number', defaultValue: 15 },
      { id: 'weeklyCompletion', label: 'Weekly Completion Speed', type: 'number', defaultValue: 3 }
    ],
    formula: 'Remaining Lessons = Total - Completed\nWeeks to Finish = Remaining / Weekly Speed',
    explanation: 'Keeps online learners accountable. Provides reliable completion dates for certifications and degree courses.',
    example: 'Completing 15 out of 60 lectures at a speed of 3 lectures per week means you have 45 remaining, taking exactly 15.0 weeks to graduate.',
    faq: [
      { question: 'What is the average online course completion rate?', answer: 'Studies show typical self-paced MOOC completion rates range from 5-15%. Using a completion planner can increase graduation rates by up to 40%.' },
      { question: 'How can I stay on track?', answer: 'Schedule consistent blocks of time for video lessons and set weekly completion targets.' }
    ],
    relatedSlugs: ['exam-preparation-calculator', 'assignment-planner-calculator'],
    calculate: (inputs) => {
      const tot = Number(inputs.totalLectures || 60);
      const done = Number(inputs.doneLectures || 15);
      const speed = Number(inputs.weeklyCompletion || 3);

      const remaining = Math.max(0, tot - done);
      const weeks = speed > 0 ? remaining / speed : 0;
      const pct = tot > 0 ? (done / tot) * 100 : 0;

      return {
        results: [
          { label: 'Weeks Remaining to Finish', value: `${weeks.toFixed(1)} Weeks`, isPrimary: true },
          { label: 'Active Completion Percentage', value: `${pct.toFixed(1)}% Completed` },
          { label: 'Lectures Left to Watch', value: `${remaining} Modules` },
          { label: 'Expected Days to End', value: `${Math.ceil(weeks * 7)} Days` }
        ],
        chartData: [
          { name: 'Modules Finished', value: done },
          { name: 'Modules Remaining', value: remaining }
        ]
      };
    }
  },
  {
    id: 'assignment-planner',
    name: 'Assignment Planner Calculator',
    slug: 'assignment-planner-calculator',
    category: 'education',
    description: 'Calculate the required daily writing volumes and research pacing to complete your academic essays and terms papers on time.',
    seoTitle: 'Weekly Essay Assignment write planner',
    seoDescription: 'Map out academic paper milestones. Set custom word counts and draft buffers to stay on schedule.',
    inputs: [
      { id: 'wordCount', label: 'Total Target Word Count', type: 'number', defaultValue: 3000 },
      { id: 'days', label: 'Days Remaining Until Deadline', type: 'number', defaultValue: 12 },
      { id: 'draftBuffer', label: 'Editing & Review Buffer (Days)', type: 'number', defaultValue: 2 }
    ],
    formula: 'Daily Writing Speed = Words / (Days - Draft Buffer)',
    explanation: 'Uses pacing targets to deconstruct complex long-form essays into manageable daily writing goals, reducing last-minute stress.',
    example: 'A 3,000-word essay with 12 days left and a 2-day buffer requires a consistent writing rate of exactly 300 words per day.',
    faq: [
      { question: 'Why is an editing buffer recommended?', answer: 'An editing buffer leaves time for proofreading, checking citations, formatting bibliographies, and receiving feedback from peers.' },
      { question: 'What is a typical academic writing rate?', answer: 'Most students can write 250-500 words of high-quality, research-backed academic prose per hour.' }
    ],
    relatedSlugs: ['course-completion-calculator', 'study-goal-calculator'],
    calculate: (inputs) => {
      const words = Number(inputs.wordCount || 3000);
      const days = Number(inputs.days || 12);
      const buffer = Number(inputs.draftBuffer || 2);

      const writingDays = Math.max(1, days - buffer);
      const dailyY = words / writingDays;

      return {
        results: [
          { label: 'Required Daily Word Count', value: `${Math.ceil(dailyY)} Words/day`, isPrimary: true },
          { label: 'Active Writing Days', value: `${writingDays} Days` },
          { label: 'Dedicated Editing Days', value: `${buffer} Days` },
          { label: 'Weekly output pace', value: `${Math.ceil(dailyY * 5)} Words/week (5-day basis)` }
        ],
        chartData: [
          { name: 'Writing Days', value: writingDays },
          { name: 'Formatting days', value: buffer }
        ]
      };
    }
  },
  {
    id: 'v14-study-goal',
    name: 'Study Goal Calculator',
    slug: 'study-goal-calculator',
    category: 'education',
    description: 'Establish and track personalized weekly study hour targets based on your course difficulty and grading benchmarks.',
    seoTitle: 'Academic Weekly Study Goal Tracker',
    seoDescription: 'Input weekly hours to plan study routines that align with your graduation requirements.',
    inputs: [
      { id: 'courseCredits', label: 'Weekly Course Credits Taken', type: 'number', defaultValue: 15 },
      { id: 'multiplier', label: 'Preparation Level (Hours per credit)', type: 'number', defaultValue: 2, min: 1, max: 4 }
    ],
    formula: 'Required Study Hours = Credits * hours-per-credit-mult',
    explanation: 'Higher education guidelines suggest taking 2 to 3 self-study hours per credit unit weekly to secure honors grades.',
    example: 'Enrolling in 15 credits with a moderate 2-hour self-preparation multiplier requires exactly 30.0 hours of weekly self-study.',
    faq: [
      { question: 'What are credit-hour benchmarks?', answer: 'Typically, a university credit represents 1 hour in lecture plus 2-3 hours of independent studying weekly.' },
      { question: 'How do I distribute my study load?', answer: 'Scatter your target study hours across 4 to 5 days, incorporating consistent Pomodoro blocks to maintain focus.' }
    ],
    relatedSlugs: ['learning-time-calculator', 'academic-performance-calculator'],
    calculate: (inputs) => {
      const cred = Number(inputs.courseCredits || 15);
      const mult = Number(inputs.multiplier || 2);

      const target = cred * mult;

      return {
        results: [
          { label: 'Required Weekly Study Goal', value: `${target.toFixed(1)} Hours/week`, isPrimary: true },
          { label: 'Average Daily Study Load', value: `${(target / 5).toFixed(1)} Hours (5-day basis)` },
          { label: 'Annual Cumulative Projection', value: `${(target * 32).toFixed(0)} Hours (32-week academic year)` }
        ],
        chartData: [
          { name: 'Independent Study Hours', value: target },
          { name: 'Lecture attendance (est.)', value: cred }
        ]
      };
    }
  },
  {
    id: 'academic-performance',
    name: 'Academic Performance Calculator',
    slug: 'academic-performance-calculator',
    category: 'education',
    description: 'Calculate your required final exam grade to achieve your target overall course percentage.',
    seoTitle: 'Required Final Exam Grade Calculator',
    seoDescription: 'Input current quiz grades and weight ratios to calculate the score needed on your final exam.',
    inputs: [
      { id: 'currentGrade', label: 'Current Class Grade Average (%)', type: 'number', defaultValue: 82 },
      { id: 'targetGrade', label: 'Desired Final Overall Grade (%)', type: 'number', defaultValue: 85 },
      { id: 'finalWeight', label: 'Final Exam Weight Ratio (%)', type: 'number', defaultValue: 25 }
    ],
    formula: 'Required Grade = [ Target - Current * (1 - Weight / 100) ] / (Weight / 100)',
    explanation: 'Calculating your required grade allows you to allocate study time efficiently across classes during finals week.',
    example: 'Holding an 82% grade with a 25% final exam weight means you must score at least 94% on the final to secure an 85% overall course grade.',
    faq: [
      { question: 'What if the required final grade is above 100%?', answer: 'This indicates your target is mathematically impossible with your current grade. You may need to adjust your target or ask your instructor for extra credit opportunities.' },
      { question: 'How is weighted grading calculated?', answer: 'Final Grade = (Current Grade * Current Weight) + (Final Exam Grade * Final Weight).' }
    ],
    relatedSlugs: ['grade-point-calculator', 'study-goal-calculator'],
    calculate: (inputs) => {
      const cur = Number(inputs.currentGrade || 82);
      const tar = Number(inputs.targetGrade || 85);
      const wRaw = Number(inputs.finalWeight || 25);

      const w = wRaw / 100;
      const req = (tar - (cur * (1 - w))) / w;

      return {
        results: [
          { label: 'Required Final Exam Score', value: req > 100 ? `Impossible: ${req.toFixed(1)}% needed` : req < 0 ? `Secured: 0% needed` : `${req.toFixed(1)}%`, isPrimary: true },
          { label: 'Current Class Weight Proportion', value: `${(100 - wRaw).toFixed(0)}%` },
          { label: 'Grade Deficit Gap', value: `${Math.max(0, tar - cur).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Class Weight Proportion', value: 100 - wRaw },
          { name: 'Final Exam Weight', value: wRaw }
        ]
      };
    }
  },
  {
    id: 'grade-point',
    name: 'Grade Point Calculator',
    slug: 'grade-point-calculator',
    category: 'education',
    description: 'Calculate your semester GPA or cumulative GPA based on course grades and credit weights.',
    seoTitle: 'Syllabus Credit GPA Grade Point Solver',
    seoDescription: 'Find your semester grade point average with ease. Map letter grades to credit scales.',
    inputs: [
      { id: 'grade1', label: 'Course 1 Letter Grade', type: 'select', defaultValue: 'A', options: [
        { label: 'A (4.0 Pt)', value: '4.0' },
        { label: 'B (3.0 Pt)', value: '3.0' },
        { label: 'C (2.0 Pt)', value: '2.0' },
        { label: 'D (1.0 Pt)', value: '1.0' },
        { label: 'F (0.0 Pt)', value: '0.0' }
      ]},
      { id: 'credits1', label: 'Course 1 Credit Units', type: 'number', defaultValue: 4 },
      { id: 'grade2', label: 'Course 2 Letter Grade', type: 'select', defaultValue: 'B', options: [
        { label: 'A (4.0 Pt)', value: '4.0' },
        { label: 'B (3.0 Pt)', value: '3.0' },
        { label: 'C (2.0 Pt)', value: '2.0' },
        { label: 'D (1.0 Pt)', value: '1.0' },
        { label: 'F (0.0 Pt)', value: '0.0' }
      ]},
      { id: 'credits2', label: 'Course 2 Credit Units', type: 'number', defaultValue: 3 }
    ],
    formula: 'GPA = Sum(Grade Point_i * Credits_i) / Total Credits',
    explanation: 'Calculating your weighted GPA provides an accurate measure of your academic standing for scholarships, internships, and transcripts.',
    example: 'Receiving an A in a 4-credit course and a B in a 3-credit course yields an overall GPA of 3.57.',
    faq: [
      { question: 'What is a weighted GPA?', answer: 'A weighted GPA accounts for course difficulty, typically awarding extra points for AP, IB, or honors classes (up to a 5.0 scale).' },
      { question: 'How is cumulative GPA calculated?', answer: 'Cumulative GPA is calculated by dividing your total grade points earned across all semesters by your total attempted credits.' }
    ],
    relatedSlugs: ['academic-performance-calculator', 'study-goal-calculator'],
    calculate: (inputs) => {
      const g1 = Number(inputs.grade1 || '4.0');
      const c1 = Number(inputs.credits1 || 4);
      const g2 = Number(inputs.grade2 || '3.0');
      const c2 = Number(inputs.credits2 || 3);

      const points = (g1 * c1) + (g2 * c2);
      const totalCredits = c1 + c2;
      const gpa = totalCredits > 0 ? points / totalCredits : 0;

      return {
        results: [
          { label: 'Expected Semester GPA', value: gpa.toFixed(2), isPrimary: true },
          { label: 'Total Credits Attempted', value: `${totalCredits} Credits` },
          { label: 'Honor Grade Points Secured', value: `${points.toFixed(1)} Points` }
        ],
        chartData: [
          { name: 'Course 1 points', value: g1 * c1 },
          { name: 'Course 2 points', value: g2 * c2 }
        ]
      };
    }
  },

  // MATHEMATICS
  {
    id: 'number-calculator',
    name: 'Number Calculator',
    slug: 'number-calculator',
    category: 'math',
    description: 'Perform basic math operations including addition, subtraction, multiplication, division, and modulo.',
    seoTitle: 'Universal Number Mathematics Solver',
    seoDescription: 'Perform multi-part arithmetic operations and modulo equations in real-time with comprehensive breakdown steps.',
    inputs: [
      { id: 'numA', label: 'Operand Value A', type: 'number', defaultValue: 15 },
      { id: 'operator', label: 'Arithmetic Operator', type: 'select', defaultValue: 'add', options: [
        { label: 'Addition (+)', value: 'add' },
        { label: 'Subtraction (-)', value: 'subtract' },
        { label: 'Multiplication (×)', value: 'multiply' },
        { label: 'Division (÷)', value: 'divide' },
        { label: 'Modulo (Remainder %)', value: 'modulo' }
      ]},
      { id: 'numB', label: 'Operand Value B', type: 'number', defaultValue: 4 }
    ],
    formula: 'Result is determined directly by the chosen mathematical operator.',
    explanation: 'Quick arithmetic operator solver to resolve core values with modular decimals.',
    example: 'An Operand A of 15 with a Modulo operator and Operand B of 4 yields a remainder of 3.',
    faq: [
      { question: 'What does the Modulo operator calculate?', answer: 'Modulo calculates the remainder left over after dividing one integer by another. For example, 15 % 4 leaves a remainder of 3.' },
      { question: 'What is a divide-by-zero error?', answer: 'Dividing any number by 0 is mathematically undefined and will return an error.' }
    ],
    relatedSlugs: ['absolute-value-calculator', 'rounding-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.numA || 0);
      const op = String(inputs.operator || 'add');
      const b = Number(inputs.numB || 0);

      let res = 0;
      let label = 'Sum';
      switch (op) {
        case 'add': res = a + b; label = 'Total Sum'; break;
        case 'subtract': res = a - b; label = 'Total Difference'; break;
        case 'multiply': res = a * b; label = 'Total Product'; break;
        case 'divide': res = b !== 0 ? a / b : 0; label = 'Quotient'; break;
        case 'modulo': res = b !== 0 ? a % b : 0; label = 'Modulo Remainder'; break;
      }

      return {
        results: [
          { label: label, value: op === 'divide' && b === 0 ? 'Undefined (Zero Div)' : res % 1 !== 0 ? res.toFixed(4) : res, isPrimary: true },
          { label: 'Operand A Base', value: a },
          { label: 'Operand B Base', value: b }
        ],
        chartData: [
          { name: 'Operand A', value: Math.abs(a) },
          { name: 'Operand B', value: Math.abs(b) }
        ]
      };
    }
  },
  {
    id: 'abs-value',
    name: 'Absolute Value Calculator',
    slug: 'absolute-value-calculator',
    category: 'math',
    description: 'Calculate the absolute value (distance from zero) of any real number.',
    seoTitle: 'Absolute Value Math Solver | Number distance to zero',
    seoDescription: 'Obtain the absolute positive magnitude of real or negative integers instantly.',
    inputs: [
      { id: 'num', label: 'Input positive or negative value', type: 'number', defaultValue: -45.67 }
    ],
    formula: '|x| = x (if x >= 0) or -x (if x < 0)',
    explanation: 'The absolute value of a number represents its distance from zero on a number line, ignoring negative direction signs.',
    example: 'The absolute value of -45.67 is exactly 45.67.',
    faq: [
      { question: 'Are absolute values always positive?', answer: 'Yes, because distance cannot be negative. The absolute value of 0 is 0.' },
      { question: 'Is absolute value used in real life?', answer: 'Yes, for measuring deviations, errors, and physical distances where direction is irrelevant.' }
    ],
    relatedSlugs: ['number-calculator', 'rounding-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.num || 0);
      const res = Math.abs(v);

      return {
        results: [
          { label: 'Absolute Value |x|', value: res, isPrimary: true },
          { label: 'Original value', value: v },
          { label: 'Distance from Zero', value: res }
        ],
        chartData: [
          { name: 'Val Offset', value: Math.round(res) }
        ]
      };
    }
  },
  {
    id: 'v14-rounding',
    name: 'Rounding Calculator',
    slug: 'rounding-calculator',
    category: 'math',
    description: 'Round decimals up, down, or to the nearest whole integer or floating decimal placement.',
    seoTitle: 'Decimal Precision & Rounding Calculator',
    seoDescription: 'Round numbers to specific decimal places or significant figures using standard mathematical rounding rules.',
    inputs: [
      { id: 'value', label: 'Decimal Value to Round', type: 'number', defaultValue: 12.34567 },
      { id: 'places', label: 'Decimal Precision (Places)', type: 'number', defaultValue: 2, min: 0, max: 10 },
      { id: 'mode', label: 'Rounding Type', type: 'select', defaultValue: 'nearest', options: [
        { label: 'Round to Nearest (Half Up)', value: 'nearest' },
        { label: 'Round Down/Truncate (Floor)', value: 'down' },
        { label: 'Round Up (Ceiling)', value: 'up' }
      ]}
    ],
    formula: 'Calculated using standard JS rounding: Math.round, Math.floor, or Math.ceil.',
    explanation: 'Simplifies data analysis and reporting by formatting raw floating-point numbers into clean, standardized decimals.',
    example: 'Rounding 12.34567 to 2 decimal places using "Nearest" yields 12.35. Using "Floor" yields 12.34.',
    faq: [
      { question: 'What is standard Rounding (Half Up)?', answer: 'If the digit following your target decimal place is 5 or greater, round the target digit up. Otherwise, leave it unchanged.' },
      { question: 'What is round truncation?', answer: 'Truncation simply removes all trailing decimals past the target place without modifying the remaining digits.' }
    ],
    relatedSlugs: ['decimal-calculator', 'number-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.value || 0);
      const p = Number(inputs.places || 0);
      const mode = String(inputs.mode || 'nearest');

      const mult = Math.pow(10, p);
      let res = v;

      if (mode === 'nearest') {
        res = Math.round(v * mult) / mult;
      } else if (mode === 'down') {
        res = Math.floor(v * mult) / mult;
      } else if (mode === 'up') {
        res = Math.ceil(v * mult) / mult;
      }

      return {
        results: [
          { label: 'Rounded Output Value', value: res, isPrimary: true },
          { label: 'Original Raw Input', value: v },
          { label: 'Decimal Precision applied', value: `${p} places` }
        ],
        chartData: [
          { name: 'Original', value: Math.abs(v) },
          { name: 'Rounded', value: Math.abs(res) }
        ]
      };
    }
  },
  {
    id: 'decimal-calculator',
    name: 'Decimal Calculator',
    slug: 'decimal-calculator',
    category: 'math',
    description: 'Perform precise operations on decimals, avoiding IEEE 754 float precision errors common in web development.',
    seoTitle: 'Precision Floating Point Decimal Calculator',
    seoDescription: 'Obtain exact decimal outputs for calculations, bypassing common web float-rounding glitches.',
    inputs: [
      { id: 'numA', label: 'Decimal Value A', type: 'number', defaultValue: 0.1 },
      { id: 'operator', label: 'Operator', type: 'select', defaultValue: 'add', options: [
        { label: 'Plus (+)', value: 'add' },
        { label: 'Minus (-)', value: 'subtract' },
        { label: 'Multiply (×)', value: 'multiply' },
        { label: 'Divide (÷)', value: 'divide' }
      ]},
      { id: 'numB', label: 'Decimal Value B', type: 'number', defaultValue: 0.2 }
    ],
    formula: 'Bypasses standard float calculation bugs by scales math constants: (A * 10^k + B * 10^k) / 10^k',
    explanation: 'Computers represent decimals internally as binary floats (IEEE 754), which can lead to unexpected rounding errors like 0.1 + 0.2 = 0.30000000000000004. This calculator bypasses these errors to provide exact results.',
    example: 'Adding 0.1 and 0.2 yields an exact sum of 0.3.',
    faq: [
      { question: 'Why do computers trigger float errors?', answer: 'Computers store fractional numbers as binary fractions. Some decimals, like 0.1, cannot be represented exactly in binary, resulting in minor rounding discrepancies.' },
      { question: 'Is this float-bypassing technique standard?', answer: 'Yes. Financial and scientific software utilizes specialized decimal scaling libraries to guarantee absolute accuracy.' }
    ],
    relatedSlugs: ['rounding-calculator', 'number-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.numA || 0);
      const op = String(inputs.operator || 'add');
      const b = Number(inputs.numB || 0);

      // Simple scale bypass
      const getDecLength = (num: number) => {
        const parts = String(num).split('.');
        return parts.length > 1 ? parts[1].length : 0;
      };

      const scale = Math.pow(10, Math.max(getDecLength(a), getDecLength(b)));
      let res = 0;

      if (op === 'add') {
        res = (a * scale + b * scale) / scale;
      } else if (op === 'subtract') {
        res = (a * scale - b * scale) / scale;
      } else if (op === 'multiply') {
        res = ((a * scale) * (b * scale)) / (scale * scale);
      } else if (op === 'divide') {
        res = b !== 0 ? (a * scale) / (b * scale) : 0;
      }

      return {
        results: [
          { label: 'Exact Precision Result', value: resStr(res), isPrimary: true },
          { label: 'Unscaled Float Result', value: op === 'add' ? String(a + b) : 'N/A' }
        ],
        chartData: [
          { name: 'Input A', value: Math.abs(a) },
          { name: 'Input B', value: Math.abs(b) }
        ]
      };

      function resStr(n: number) {
        return n % 1 !== 0 ? String(parseFloat(n.toFixed(12))) : String(n);
      }
    }
  },
  {
    id: 'frac-to-dec',
    name: 'Fraction to Decimal Calculator',
    slug: 'fraction-to-decimal-calculator',
    category: 'math',
    description: 'Convert proper, improper, or mixed fractions to accurate floating decimals with step-by-step divisions.',
    seoTitle: 'Fraction to Decimal Mathematical Converter',
    seoDescription: 'Input numerator and denominator values to instantly generate precise decimal divisions.',
    inputs: [
      { id: 'whole', label: 'Whole Number (Optional)', type: 'number', defaultValue: 0 },
      { id: 'numerator', label: 'Numerator', type: 'number', defaultValue: 3 },
      { id: 'denominator', label: 'Denominator', type: 'number', defaultValue: 8 }
    ],
    formula: 'Decimal = Whole + (Numerator / Denominator)',
    explanation: 'Converts school fractions to decimals to simplify calculations and comparisons.',
    example: 'Converting 3/8 yields 0.375. A mixed fraction of 2 1/4 converts to 2.25.',
    faq: [
      { question: 'What is a repeating decimal?', answer: 'A decimal with a digit or sequence of digits that repeats infinitely, such as 1/3 = 0.3333... or 1/7 = 0.142857...' },
      { question: 'What is a proper vs improper fraction?', answer: 'A proper fraction has a numerator less than its denominator. An improper fraction is larger, representing a value greater than 1.0.' }
    ],
    relatedSlugs: ['decimal-to-fraction-calculator', 'mixed-number-converter'],
    calculate: (inputs) => {
      const whole = Number(inputs.whole || 0);
      const num = Number(inputs.numerator || 3);
      const den = Number(inputs.denominator || 8);

      let dec = whole;
      if (den !== 0) {
        dec += num / den;
      }

      return {
        results: [
          { label: 'Converted Decimal', value: den === 0 ? 'Undefined (Zero Div)' : dec % 1 !== 0 ? dec.toFixed(6) : String(dec), isPrimary: true },
          { label: 'Fraction representation', value: `${whole > 0 ? whole + ' ' : ''}${num}/${den}` },
          { label: 'Simple quotient', value: den !== 0 ? (num / den).toFixed(6) : '0' }
        ],
        chartData: [
          { name: 'Whole Part', value: whole },
          { name: 'Fractional Part', value: den !== 0 ? num / den : 0 }
        ]
      };
    }
  },
  {
    id: 'dec-to-frac',
    name: 'Decimal to Fraction Calculator',
    slug: 'decimal-to-fraction-calculator',
    category: 'math',
    description: 'Convert any decimal value back to its simplest reduced proper or mixed fraction representation.',
    seoTitle: 'Decimal to Fraction Solver | Fraction Simplifier',
    seoDescription: 'Convert terminating decimals into fully reduced fractional numerators and denominators.',
    inputs: [
      { id: 'decimalVal', label: 'Decimal Value to Convert', type: 'number', defaultValue: 0.625 }
    ],
    formula: 'Find factors, scale by power of 10, then divide by the Greatest Common Divisor (GCD).',
    explanation: 'Simplifying decimal entries into fractions makes them easier to use for carpentry, baking recipes, and blueprints.',
    example: 'Converting 0.625 yields 5/8.',
    faq: [
      { question: 'How is the conversion calculated?', answer: 'Scale the decimal by a power of 10 to turn it into a whole number (e.g., 0.625 becomes 625/1000). Then, choose the Greatest Common Divisor (125) to simplify the fraction to 5/8.' },
      { question: 'Can repeating decimals be converted here?', answer: 'This calculator is optimized for terminating decimals. Repeating decimals require algebraic formulas (e.g. x = 0.333...).' }
    ],
    relatedSlugs: ['fraction-to-decimal-calculator', 'mixed-number-converter'],
    calculate: (inputs) => {
      const val = Number(inputs.decimalVal || 0.625);

      const whole = Math.floor(val);
      const frac = val - whole;

      let numStr = (frac).toFixed(9);
      let power = 9;
      // strip trailing zeros of decimal representation
      while (numStr.endsWith('0') && power > 0) {
        numStr = numStr.slice(0, -1);
        power--;
      }

      const num = Math.round(frac * Math.pow(10, power));
      const den = Math.round(Math.pow(10, power));

      const gcd = (x: number, y: number): number => {
        return y === 0 ? x : gcd(y, x % y);
      };

      const div = gcd(num, den);
      const simpNum = num / div;
      const simpDen = den / div;

      const mixedRep = `${whole > 0 ? whole + ' ' : ''}${simpNum}/${simpDen}`;
      const improperRep = `${(whole * simpDen + simpNum)}/${simpDen}`;

      return {
        results: [
          { label: 'Simplest Mixed Fraction', value: val === 0 ? '0' : mixedRep, isPrimary: true },
          { label: 'Improper Fraction', value: val === 0 ? '0' : improperRep },
          { label: 'Greatest Common Divisor (GCD)', value: div }
        ],
        chartData: [
          { name: 'Numerator', value: simpNum },
          { name: 'Denominator', value: simpDen }
        ]
      };
    }
  },
  {
    id: 'mixed-number-conv',
    name: 'Mixed Number Converter',
    slug: 'mixed-number-converter',
    category: 'math',
    description: 'Convert mixed numbers to improper fractions or decimal equivalents and vice-versa.',
    seoTitle: 'Mixed Number Fraction Converter',
    seoDescription: 'Obtain transition ratios between mixed integers and improper fractions.',
    inputs: [
      { id: 'whole', label: 'Whole Number Base', type: 'number', defaultValue: 3 },
      { id: 'num', label: 'Numerator', type: 'number', defaultValue: 2 },
      { id: 'den', label: 'Denominator', type: 'number', defaultValue: 5 }
    ],
    formula: 'Improper Numerator = (Whole * Denominator) + Numerator\nImproper Fraction = Improper Numerator / Denominator',
    explanation: 'Easily convert mixed fractions to improper fractions for advanced multiplication or division.',
    example: 'Converting 3 2/5 yields an improper fraction of 17/5, or 3.40 as a decimal.',
    faq: [
      { question: 'What is a mixed number?', answer: 'A mixed number combines a whole number and a proper fraction, such as 3 2/5.' },
      { question: 'How do you convert back to a mixed number?', answer: 'Divide the numerator by the denominator. The quotient becomes the whole number, and the remainder forms the numerator of the remaining fraction.' }
    ],
    relatedSlugs: ['decimal-to-fraction-calculator', 'fraction-to-decimal-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.whole || 0);
      const n = Number(inputs.num || 2);
      const d = Number(inputs.den || 5);

      const impNum = (w * d) + n;
      const dec = d !== 0 ? w + (n / d) : 0;

      return {
        results: [
          { label: 'Improper Fraction Output', value: d === 0 ? 'Undefined' : `${impNum}/${d}`, isPrimary: true },
          { label: 'Decimal Equivalent value', value: d === 0 ? 'Undefined' : dec.toFixed(4) },
          { label: 'Check representation', value: `${w} and ${n}/${d}` }
        ],
        chartData: [
          { name: 'Whole Part Value', value: w },
          { name: 'Fractional Decimal Portion', value: d !== 0 ? n / d : 0 }
        ]
      };
    }
  },
  {
    id: 'ratio-pct',
    name: 'Ratio Percentage Calculator',
    slug: 'ratio-percentage-calculator',
    category: 'math',
    description: 'Convert standard geometric or financial ratios directly into percentages.',
    seoTitle: 'Ratio to Percentage Converter | Proportion math solver',
    seoDescription: 'Input ratio ratios (e.g. 4 to 5) to receive the exact part-to-part or part-to-whole percentage indexes.',
    inputs: [
      { id: 'numA', label: 'Ratio Aspect A', type: 'number', defaultValue: 3 },
      { id: 'numB', label: 'Ratio Aspect B', type: 'number', defaultValue: 5 }
    ],
    formula: 'Part-to-Part % = (A / B) * 100\nPart-to-Whole % = (A / (A + B)) * 100',
    explanation: 'Converts ratios to percentages to simplify comparison and data analysis across different sample sizes.',
    example: 'A ratio of 3:5 represents a part-to-part ratio of 60.0% and a part-to-total ratio of 37.50%.',
    faq: [
      { question: 'What is part-to-part vs part-to-whole?', answer: 'Part-to-part compares two separate groups (e.g. 3 dogs to 5 cats = 60%). Part-to-whole compares one group to the combined total (3 dogs out of 8 animals total = 37.5%).' },
      { question: 'What is a 1-to-1 ratio as a percentage?', answer: 'Part-to-part is 100%, and part-to-whole is 50%.' }
    ],
    relatedSlugs: ['exponent-rules-calculator', 'number-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.numA || 3);
      const b = Number(inputs.numB || 5);

      const partToPart = b !== 0 ? (a / b) * 100 : 0;
      const partToWhole = (a + b) !== 0 ? (a / (a + b)) * 100 : 0;

      return {
        results: [
          { label: 'Part-to-Whole Percentage', value: `${partToWhole.toFixed(2)}%`, isPrimary: true },
          { label: 'Part-to-Part Percentage', value: `${partToPart.toFixed(2)}%` },
          { label: 'Simplified ratio colon', value: `${a} : ${b}` }
        ],
        chartData: [
          { name: 'Group A', value: a },
          { name: 'Group B', value: b }
        ]
      };
    }
  },
  {
    id: 'exponent-rules',
    name: 'Exponent Rules Calculator',
    slug: 'exponent-rules-calculator',
    category: 'math',
    description: 'Solve exponent equations and demonstrate rules including product, quotient, and power of power calculations.',
    seoTitle: 'Exponent Rules Calculator & Power Solver',
    seoDescription: 'Input bases and power indexes to solve exponent equations with step-by-step math explanations.',
    inputs: [
      { id: 'base', label: 'Base Number (x)', type: 'number', defaultValue: 2 },
      { id: 'exponentA', label: 'Exponent index A (n)', type: 'number', defaultValue: 3 },
      { id: 'exponentB', label: 'Exponent index B (m)', type: 'number', defaultValue: 4 }
    ],
    formula: 'x^n * x^m = x^(n+m)\n(x^n)^m = x^(n*m)',
    explanation: 'Uses exponential rules to solve equations step-by-step, helping students understand algebraic concepts.',
    example: 'For a base of 2 with exponents of 3 and 4: 2^3 = 8, 2^4 = 16. The product 2^3 * 2^4 equals 2^7 = 128.',
    faq: [
      { question: 'What is a negative exponent?', answer: 'A negative exponent indicates the reciprocal of the base raised to the positive power, where x^-n = 1 / x^n.' },
      { question: 'What is any number raised to the power of 0?', answer: 'Any non-zero real number raised to the power of 0 is exactly 1.' }
    ],
    relatedSlugs: ['ratio-percentage-calculator', 'number-calculator'],
    calculate: (inputs) => {
      const x = Number(inputs.base || 2);
      const n = Number(inputs.exponentA || 3);
      const m = Number(inputs.exponentB || 4);

      const valA = Math.pow(x, n);
      const valB = Math.pow(x, m);
      const valProduct = Math.pow(x, n + m);
      const valPowerOfPower = Math.pow(x, n * m);

      return {
        results: [
          { label: 'Power of Power (x^n)^m', value: valPowerOfPower > 1e12 ? valPowerOfPower.toExponential(4) : valPowerOfPower, isPrimary: true },
          { label: 'Product Rule x^n * x^m', value: valProduct > 1e12 ? valProduct.toExponential(4) : valProduct },
          { label: 'Value of x^n', value: valA },
          { label: 'Value of x^m', value: valB }
        ],
        chartData: [
          { name: 'x^n', value: Math.min(100000, valA) },
          { name: 'x^m', value: Math.min(100000, valB) }
        ]
      };
    }
  },

  // STATISTICS
  {
    id: 'stat-distribution',
    name: 'Statistical Distribution Calculator',
    slug: 'statistical-distribution-calculator',
    category: 'math', // We put statistics calculators under category 'math' or 'data-science'. Let's classify as 'math'
    description: 'Calculate high-performance Normal Distribution densities and cumulative probability thresholds with Z-scores.',
    seoTitle: 'Normal Statistical Distribution Z-Score Calculator',
    seoDescription: 'Generate dynamic cumulative probabilities (p-values) from standard normal distributions.',
    inputs: [
      { id: 'mean', label: 'Distribution Mean (μ)', type: 'number', defaultValue: 100 },
      { id: 'stdDev', label: 'Standard Deviation (σ)', type: 'number', defaultValue: 15 },
      { id: 'value', label: 'Observation Value (X)', type: 'number', defaultValue: 115 }
    ],
    formula: 'Z-score = (X - μ) / σ\np-value is calculated using standard error approximations.',
    explanation: 'Uses standard deviations to assess how exceptional a specific observations is compared to standard distributions.',
    example: 'With a mean of 100 and a standard deviation of 15, an observed value of 115 has a Z-score of 1.0, colocated at the 84.13th percentile.',
    faq: [
      { question: 'What is a Z-score?', answer: 'A Z-score measures how many standard deviations an observation is above or below the mean.' },
      { question: 'What does the p-value represent?', answer: 'The p-value is the probability of obtaining a score more extreme than the observed value if the null hypothesis is true.' }
    ],
    relatedSlugs: ['confidence-level-calculator', 'margin-of-error-calculator'],
    calculate: (inputs) => {
      const mean = Number(inputs.mean || 100);
      const dev = Number(inputs.stdDev || 15);
      const x = Number(inputs.value || 115);

      const z = dev > 0 ? (x - mean) / dev : 0;

      // Error approximation for standard cumulative normal distribution
      const cdf = (val: number) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(val));
        const d = 0.3989423 * Math.exp(-val * val / 2);
        const prob = 1 - d * (0.3193815 * t - 0.3565638 * t * t + 1.781478 * Math.pow(t, 3) - 1.821256 * Math.pow(t, 4) + 1.330274 * Math.pow(t, 5));
        return val >= 0 ? prob : 1 - prob;
      };

      const probPercentile = cdf(z) * 100;

      return {
        results: [
          { label: 'Cumulative Probability', value: `${probPercentile.toFixed(2)}%`, isPrimary: true },
          { label: 'Calculated Z-Score', value: z.toFixed(4) },
          { label: 'Observation Percentile Rank', value: `${probPercentile.toFixed(1)}th percentile` },
          { label: 'Standard Deviation Margin', value: `${Math.abs(z).toFixed(2)} std dev` }
        ],
        chartData: [
          { name: 'X Observation Value', value: x },
          { name: 'Distribution Mean', value: mean }
        ]
      };
    }
  },
  {
    id: 'sample-mean',
    name: 'Sample Mean Calculator',
    slug: 'sample-mean-calculator',
    category: 'math',
    description: 'Calculate the sample mean, variance, and standard deviation of a custom dataset.',
    seoTitle: 'Sample Mean & Standard Deviation Calculator',
    seoDescription: 'Input comma-separated data values to instantly calculate the sample mean, variance, and standard deviation.',
    inputs: [
      { id: 'dataset', label: 'Dataset (Comma-separated)', type: 'text', defaultValue: '10, 15, 12, 18, 20, 22, 14, 16' }
    ],
    formula: 'Sample Mean x̄ = Sum(x_i) / n\nSample Variance s^2 = Sum(x_i - x̄)^2 / (n - 1)',
    explanation: 'Find statistical signals and spread variables for custom sample sets.',
    example: 'For the dataset "10, 15, 12, 18, 20, 22, 14, 16", the sample mean is 15.87, and the standard deviation is 3.98.',
    faq: [
      { question: 'Why divide by (n - 1) instead of n?', answer: 'Dividing by (n - 1) for samples (Bessels Correction) corrects for potential bias in estimating the true population variance.' },
      { question: 'What is standard deviation?', answer: 'Standard deviation measures the typical dispersion of data points around their mean.' }
    ],
    relatedSlugs: ['population-mean-calculator', 'data-range-calculator'],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '10, 15, 12, 18, 20, 22, 14, 16');
      const arr = raw.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0);

      const n = arr.length;
      if (n === 0) {
        return { results: [{ label: 'Mean', value: '0', isPrimary: true }] };
      }

      const sum = arr.reduce((acc, c) => acc + c, 0);
      const mean = sum / n;

      const sumSqDiff = arr.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0);
      const variance = n > 1 ? sumSqDiff / (n - 1) : 0;
      const stdDev = Math.sqrt(variance);

      return {
        results: [
          { label: 'Sample Mean x̄', value: mean.toFixed(4), isPrimary: true },
          { label: 'Sample Std Deviation (s)', value: stdDev.toFixed(4) },
          { label: 'Sample Variance (s^2)', value: variance.toFixed(4) },
          { label: 'Sample Count (n)', value: n }
        ],
        chartData: arr.map((val, idx) => ({ name: `Pt ${idx+1}`, value: val }))
      };
    }
  },
  {
    id: 'pop-mean',
    name: 'Population Mean Calculator',
    slug: 'population-mean-calculator',
    category: 'math',
    description: 'Calculate the population mean and variance for a complete, closed statistical population.',
    seoTitle: 'Population Mean & Variance Calculator',
    seoDescription: 'Obtain exact population statistical means and parameters for complete closed datasets.',
    inputs: [
      { id: 'dataset', label: 'Complete Population (Comma-separated)', type: 'text', defaultValue: '8, 12, 14, 10, 15, 13, 11' }
    ],
    formula: 'μ = Sum(x_i) / N\nVariance σ^2 = Sum(x_i - μ)^2 / N',
    explanation: 'Unlike sample estimates, complete population variance uses the total count (N) directly since the entire dataset is known.',
    example: 'For the population "8, 12, 14, 10, 15, 13, 11", the population mean is exactly 11.86, and the population standard deviation is 2.23.',
    faq: [
      { question: 'When should I use population parameters?', answer: 'Use population parameters when you have access to data for every individual in the population (e.g. grades for every student in a class).' },
      { question: 'Why is there no Bessel correction?', answer: 'Because no inference is needed — we are calculating the exact parameters directly from the complete population dataset.' }
    ],
    relatedSlugs: ['sample-mean-calculator', 'data-range-calculator'],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '8, 12, 14, 10, 15, 13, 11');
      const arr = raw.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0);

      const N = arr.length;
      if (N === 0) {
        return { results: [{ label: 'Mean', value: '0', isPrimary: true }] };
      }

      const sum = arr.reduce((acc, c) => acc + c, 0);
      const mean = sum / N;

      const sumSqDiff = arr.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0);
      const variance = sumSqDiff / N;
      const stdDev = Math.sqrt(variance);

      return {
        results: [
          { label: 'Population Mean (μ)', value: mean.toFixed(4), isPrimary: true },
          { label: 'Population Std Deviation (σ)', value: stdDev.toFixed(4) },
          { label: 'Population Variance (σ^2)', value: variance.toFixed(4) },
          { label: 'Population Count (N)', value: N }
        ],
        chartData: arr.map((val, idx) => ({ name: `Individual ${idx+1}`, value: val }))
      };
    }
  },
  {
    id: 'confidence-level',
    name: 'Confidence Level Calculator',
    slug: 'confidence-level-calculator',
    category: 'math',
    description: 'Calculate critical Z-critical values corresponding to specific statistical confidence benchmarks.',
    seoTitle: 'Z-Critical Confidence Interval Calculator',
    seoDescription: 'Input target confidence levels (e.g. 95%) to generate critical Z-score coordinates.',
    inputs: [
      { id: 'confidence', label: 'Desired Confidence Level (%)', type: 'number', defaultValue: 95, min: 50, max: 99.9 }
    ],
    formula: 'Alpha α = 1 - Confidence / 100\nZ-critical is solved using standard normal area coordinates.',
    explanation: 'Z-critical values define boundaries of significance. A 95% confidence level corresponds to a Z-critical value of 1.96 standard errors.',
    example: 'For a 95% confidence level, the calculated critical value (Z-critical) is 1.9600.',
    faq: [
      { question: 'What is the confidence interval?', answer: 'The interval of values that is expected to contain the true population parameter with a specified probability.' },
      { question: 'What are standard critical values?', answer: '90% confidence corresponds to Z = 1.645, 95% to Z = 1.96, and 99% to Z = 2.576.' }
    ],
    relatedSlugs: ['stat-distribution-calculator', 'margin-of-error-calculator'],
    calculate: (inputs) => {
      const conf = Number(inputs.confidence || 95);

      const alpha = 1 - (conf / 100);
      const area = 1 - (alpha / 2);

      // Simple inverse CDF normal distribution approximation
      const p = area;
      const c0 = 2.515517, c1 = 0.802853, c2 = 0.010328;
      const d1 = 1.432788, d2 = 0.189269, d3 = 0.001308;
      const t = Math.sqrt(-2 * Math.log(1 - p));
      const z = t - ((c0 + c1 * t + c2 * t * t) / (1 + d1 * t + d2 * t * t + d3 * t * t * t));

      return {
        results: [
          { label: 'Critical Value (Z-critical)', value: z.toFixed(4), isPrimary: true },
          { label: 'Alpha Significance Level α', value: alpha.toFixed(4) },
          { label: 'Unchecked Margin Area', value: `${(alpha/2 * 100).toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Confidence Width', value: conf },
          { name: 'Alpha Area combined', value: Math.round((100 - conf)) }
        ]
      };
    }
  },
  {
    id: 'margin-of-error',
    name: 'Margin of Error Calculator',
    slug: 'margin-of-error-calculator',
    category: 'math',
    description: 'Calculate the margin of error of a sample based on confidence level, sample size, and standard deviation.',
    seoTitle: 'Survey Margin of Error (MOE) Calculator',
    seoDescription: 'Calculate survey margin of error of your sample based on confidence levels and size thresholds.',
    inputs: [
      { id: 'confidence', label: 'Confidence Level (%)', type: 'number', defaultValue: 95 },
      { id: 'sampleSize', label: 'Sample Size (n)', type: 'number', defaultValue: 400 },
      { id: 'stdDev', label: 'Population Standard Deviation (or 0.5 estimate)', type: 'number', defaultValue: 0.5 }
    ],
    formula: 'Margin of Error = Z-critical * (Standard Deviation / sqrt(n))',
    explanation: 'Measures standard random sampling error, helping you determine how closely sample findings match the broad population.',
    example: 'For a 95% confidence level, a sample size of 400, and a 0.5 standard deviation, the margin of error is 4.90%.',
    faq: [
      { question: 'Why use 0.5 for standard deviation?', answer: 'A 0.5 standard deviation represents the maximum possible variance, guaranteeing a conservative estimate of the margin of error.' },
      { question: 'How can I halve my margin of error?', answer: 'To halve the margin of error, you must increase the sample size by a factor of 4 due to the square root in the denominators.' }
    ],
    relatedSlugs: ['confidence-level-calculator', 'statistical-significance-calculator'],
    calculate: (inputs) => {
      const conf = Number(inputs.confidence || 95);
      const n = Number(inputs.sampleSize || 400);
      const dev = Number(inputs.stdDev || 0.5);

      // Inverse CDF approximation
      const area = 1 - ((1 - conf/100) / 2);
      const t = Math.sqrt(-2 * Math.log(1 - area));
      const z = t - ((2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t));

      const moe = n > 0 ? z * (dev / Math.sqrt(n)) : 0;

      return {
        results: [
          { label: 'Margin of Error', value: `${(moe * 100).toFixed(2)}%`, isPrimary: true },
          { label: 'Calculated Z-Critical value', value: z.toFixed(4) },
          { label: 'Standard Error coefficient', value: n > 0 ? (dev / Math.sqrt(n)).toFixed(6) : '0' }
        ],
        chartData: [
          { name: 'Confidence Interval Width', value: Math.round(conf) },
          { name: 'Margin of Error (%)', value: Math.round(moe * 100) }
        ]
      };
    }
  },
  {
    id: 'data-range',
    name: 'Data Range Calculator',
    slug: 'data-range-calculator',
    category: 'math',
    description: 'Calculate the absolute range, minimum, maximum, and midrange of a statistical dataset.',
    seoTitle: 'Statistical Data Range Calculator',
    seoDescription: 'Identify data spread. Calculate ranges and midpoints for custom data samples.',
    inputs: [
      { id: 'dataset', label: 'Dataset (Comma-separated)', type: 'text', defaultValue: '5, 12, 45, 18, 22, 9, 31' }
    ],
    formula: 'Range = Maximum Value - Minimum Value\nMidrange = (Maximum + Minimum) / 2',
    explanation: 'A quick measure of statistical dispersion, helping you identify outstanding outliers in your dataset.',
    example: 'For the dataset "5, 12, 45, 18, 22, 9, 31", the minimum is 5, the maximum is 45, and the range is exactly 40.',
    faq: [
      { question: 'What are the limits of the Range metric?', answer: 'The range is highly sensitive to outliers. A single extreme value can artificially inflate the range, making it less representative of typical variability.' },
      { question: 'What is midrange?', answer: 'Midrange is the arithmetic mean of the maximum and minimum values in a dataset.' }
    ],
    relatedSlugs: ['sample-mean-calculator', 'population-mean-calculator'],
    calculate: (inputs) => {
      const raw = String(inputs.dataset || '5, 12, 45, 18, 22, 9, 31');
      const arr = raw.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v));

      if (arr.length === 0) {
        return { results: [{ label: 'Range', value: '0', isPrimary: true }] };
      }

      const min = Math.min(...arr);
      const max = Math.max(...arr);
      const rangeVal = max - min;
      const midrange = (max + min) / 2;

      return {
        results: [
          { label: 'Absolute Data Range', value: rangeVal, isPrimary: true },
          { label: 'Minimum Observed Value', value: min },
          { label: 'Maximum Observed Value', value: max },
          { label: 'Midrange Center Check', value: midrange }
        ],
        chartData: [
          { name: 'Minimum', value: min },
          { name: 'Maximum', value: max },
          { name: 'Midrange', value: midrange }
        ]
      };
    }
  },
  {
    id: 'stat-significance',
    name: 'Statistical Significance Calculator',
    slug: 'statistical-significance-calculator',
    category: 'math',
    description: 'Perform independent two-sample t-tests to evaluate the statistical significance of differences between sample groups.',
    seoTitle: 'A/B Test Statistical Significance Calculator',
    seoDescription: 'A/B test significance. Compare conversions and totals to find significant lifts and p-values.',
    inputs: [
      { id: 'visitorsA', label: 'Group A Sample Size (e.g. Visitors)', type: 'number', defaultValue: 1000 },
      { id: 'conversionsA', label: 'Group A Successes (e.g. Conversions)', type: 'number', defaultValue: 80 },
      { id: 'visitorsB', label: 'Group B Sample Size', type: 'number', defaultValue: 1050 },
      { id: 'conversionsB', label: 'Group B Successes', type: 'number', defaultValue: 110 }
    ],
    formula: 'Z = (p_B - p_A) / sqrt(p_pool * (1 - p_pool) * (1/n_A + 1/n_B))',
    explanation: 'Uses a Z-test for proportions to evaluate if observed differences in conversions represent a real improvement or simple random variation.',
    example: 'Comparing 80 successes out of 1,000 visitors (8%) against 110 out of 1,050 visitors (10.48%) yields a Z-score of 1.78, indicating a statistical significance of 92.5%.',
    faq: [
      { question: 'What is the typical significance benchmark?', answer: 'A 95% significance level (p-value <= 0.05) is the standard benchmark for declaring an experiment successful.' },
      { question: 'What represents the null hypothesis here?', answer: 'The null hypothesis assumes the two groups perform identically, and any observed differences are due to random chance.' }
    ],
    relatedSlugs: ['margin-of-error-calculator', 'confidence-level-calculator'],
    calculate: (inputs) => {
      const nA = Number(inputs.visitorsA || 1000);
      const cA = Number(inputs.conversionsA || 80);
      const nB = Number(inputs.visitorsB || 1050);
      const cB = Number(inputs.conversionsB || 110);

      const pA = nA > 0 ? cA / nA : 0;
      const pB = nB > 0 ? cB / nB : 0;

      const pPool = (conversionsSum()) / (numSum());
      const standardError = Math.sqrt(pPool * (1 - pPool) * (1/nA + 1/nB));
      const z = standardError > 0 ? (pB - pA) / standardError : 0;

      // cdf Z-score resolver
      const cdf = (val: number) => {
        const t = 1 / (1 + 0.2316419 * Math.abs(val));
        const d = 0.3989423 * Math.exp(-val * val / 2);
        const prob = 1 - d * (0.3193815 * t - 0.3565638 * t * t + 1.781478 * t*t*t - 1.821256 * Math.pow(t, 4) + 1.330274 * Math.pow(t, 5));
        return val >= 0 ? prob : 1 - prob;
      };

      const probSig = (1 - (2 * (1 - cdf(Math.abs(z))))) * 100;
      const confidence = Math.max(0, Math.min(99.99, probSig));

      return {
        results: [
          { label: 'Statistical Significance', value: `${confidence.toFixed(2)}%`, isPrimary: true },
          { label: 'Group A Conversion Rate', value: `${(pA * 100).toFixed(2)}%` },
          { label: 'Group B Conversion Rate', value: `${(pB * 100).toFixed(2)}%` },
          { label: 'Calculated test Z-score', value: z.toFixed(4) }
        ],
        chartData: [
          { name: 'Group A successes', value: cA },
          { name: 'Group B successes', value: cB }
        ]
      };

      function conversionsSum() { return cA + cB; }
      function numSum() { return nA + nB; }
    }
  }
];
