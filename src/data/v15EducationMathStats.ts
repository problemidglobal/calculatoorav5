import { Calculator } from '../types';

export const V15_EDUCATION_MATH_STATS_CALCULATORS: Calculator[] = [
  // EDUCATION
  {
    id: 'v15-course-grade',
    name: 'Course Grade Calculator',
    slug: 'v15-course-grade-calculator',
    category: 'education',
    description: 'Calculate your current overall score in a course based on weighted assignment, exam, and participation categories.',
    seoTitle: 'Weighted Course Grade Calculator',
    seoDescription: 'Obtain exact weighted course averages. Plug assignment grades, quizzes, and midterm marks in to find required final exam scores.',
    inputs: [
      { id: 'midtermGrade', label: 'Midterm Exam Grade (%)', type: 'number', defaultValue: 85 },
      { id: 'midtermWeight', label: 'Midterm Weight (%)', type: 'number', defaultValue: 25 },
      { id: 'hwGrade', label: 'Homework Assignments Grade (%)', type: 'number', defaultValue: 95 },
      { id: 'hwWeight', label: 'Homework Weight (%)', type: 'number', defaultValue: 35 },
      { id: 'finalWeight', label: 'Remaining Final Exam Weight (%)', type: 'number', defaultValue: 40 }
    ],
    formula: 'Current Weighted Grade = (Midterm*Midweight + HW*HWweight) / (Midweight + HWweight)\nRequired Final Score to earn 90 (A-) = (90 - Current Weighted*ActiveWeight) / Final Exam Weight',
    explanation: 'Weighted grades prioritize major deliverables (like midterms or essays) over minor tasks (like daily homework). It is critical to know your standing before finals.',
    example: 'With an 85% midterm (weighted 25%) and 95% homework (weighted 35%), your current weighted grade is 90.83%. To achieve an A grade (90%) overall, you need to score at least 88.75% on the final exam (weighted 40%).',
    faq: [
      { question: 'What is a weighted grade average?', answer: 'An average where different components contribute differently to the final score, determined by each category\'s syllabus weight percentage.' },
      { question: 'Why is my average different than raw score totals?', answer: 'Raw totals assume all points are worth the same, whereas weighted models prioritize exams and major projects over basic assignments.' }
    ],
    relatedSlugs: ['v15-semester-planner-calculator', 'v15-study-schedule-calculator'],
    calculate: (inputs) => {
      const mG = Number(inputs.midtermGrade || 0);
      const mW = Number(inputs.midtermWeight || 25);
      const hG = Number(inputs.hwGrade || 0);
      const hW = Number(inputs.hwWeight || 35);
      const fW = Number(inputs.finalWeight || 40);

      const knownWeight = mW + hW;
      const currentGrade = knownWeight > 0 ? ((mG * mW) + (hG * hW)) / knownWeight : 0;
      const preFinalPortion = (currentGrade * knownWeight) / 100;
      const requiredForA = fW > 0 ? (90 - preFinalPortion) / (fW / 100) : 0;

      return {
        results: [
          { label: 'Current Weighted Grade', value: `${currentGrade.toFixed(2)}%`, isPrimary: true },
          { label: 'Total Syllabus Weight Accounted', value: `${knownWeight}%` },
          { label: 'Final Exam Score Required for A (90%)', value: requiredForA <= 0 ? 'Locked In' : requiredForA > 100 ? `${requiredForA.toFixed(2)}% (Needs Extra Credit)` : `${requiredForA.toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Your Midterm Contribution', value: Math.round(mG * mW / 100) },
          { name: 'Your HW Contribution', value: Math.round(hG * hW / 100) },
          { name: 'Remaining Final Exam Weight', value: fW }
        ]
      };
    }
  },
  {
    id: 'v15-semester-planner',
    name: 'Semester Planner',
    slug: 'v15-semester-planner-calculator',
    category: 'education',
    description: 'Structure and balance your semester credit hours, estimating safe and productive weekly study time investments.',
    seoTitle: 'Semester Credit Load & Study Time Planner',
    seoDescription: 'Obtain estimated academic time budgets. Plug semester credit hours in to find weekly study and homework milestones.',
    inputs: [
      { id: 'creditHours', label: 'Semester Credit Hours Enrolled', type: 'number', defaultValue: 15 },
      { id: 'difficulty', label: 'Average Course Difficulty', type: 'select', defaultValue: 'moderate', options: [
        { label: 'Average / Mainstream (2h study per credit)', value: '2' },
        { label: 'Heavy STEM / Law (3h study per credit)', value: '3' },
        { label: 'Accelerated / Elite (4h study per credit)', value: '4' }
      ]}
    ],
    formula: 'Weekly Study Hours = Credit Hours * Study Factor\nTotal Academic Time = Credit Hours (In-class) + Study Hours',
    explanation: 'Higher education guidelines recommend spending 2 to 3 hours studying outside of class for every 1 credit hour enrolled to ensure academic success.',
    example: 'Enrolled in 15 credits with moderate courses requires 30 hours of weekly study outside of class, resulting in a 45-hour overall weekly academic commitment.',
    faq: [
      { question: 'What counts as a full-time credit load?', answer: 'Typically, 12 to 15 credit hours per semester is considered full-time, translating to about 36 to 45 hours of weekly academic efforts.' },
      { question: 'What represents the Carnegie study unit standard?', answer: 'The Carnegie unit standard dictates spending 2 hours of external study for every 1 hour spent inside standard lecture halls.' }
    ],
    relatedSlugs: ['v15-course-grade-calculator', 'v15-study-schedule-calculator'],
    calculate: (inputs) => {
      const credits = Number(inputs.creditHours || 12);
      const factor = Number(inputs.difficulty || 2);

      const studyHours = credits * factor;
      const totalWeeklyWorkload = credits + studyHours;

      return {
        results: [
          { label: 'Target Weekly Study Hours', value: `${studyHours} Hours / Week`, isPrimary: true },
          { label: 'Primary Class Lectures duration', value: `${credits} Hours / Week` },
          { label: 'Overall Academic Time commitment', value: `${totalWeeklyWorkload} Hours / Week` }
        ],
        chartData: [
          { name: 'In-Class Lectures', value: credits },
          { name: 'External Study Time', value: studyHours }
        ]
      };
    }
  },
  {
    id: 'v15-study-schedule',
    name: 'Study Schedule Planner',
    slug: 'v15-study-schedule-calculator',
    category: 'education',
    description: 'Map out your study schedule across weekday and weekend intervals based on active course requirements.',
    seoTitle: 'Daily & Weekly Study Schedule Planner',
    seoDescription: 'Divide your weekly study targets across available days. Plan balanced blocks of study time while preserving recovery gaps.',
    inputs: [
      { id: 'totalStudyNeeded', label: 'Required Weekly Study Time (Hours)', type: 'number', defaultValue: 28 },
      { id: 'availableDays', label: 'Study Days Available per Week', type: 'number', defaultValue: 5, min: 1, max: 7 },
      { id: 'intensityStyle', label: 'Study Block Style', type: 'select', defaultValue: 'standard', options: [
        { label: 'Standard study blocks (45-min Pomodoro)', value: '45' },
        { label: 'Deep Work sessions (90-min blocks)', value: '90' }
      ]}
    ],
    formula: 'Daily Study = Weekly Study Needed / Available Days\nSession Count = Daily Study * 60 / Block Duration',
    explanation: 'Splitting your study targets into balanced daily blocks keeps mental fatigue low, supporting deep focus and long-term memory retention.',
    example: 'Planning 28 hours of study across 5 days requires 5.6 hours of daily study. This breaks down into approximately 7 standard 45-minute Pomodoro sessions daily.',
    faq: [
      { question: 'What is the Pomodoro technique?', answer: 'A productivity method involving 25 or 45 minutes of focused work followed by a 5 or 15 minute break to maintain study rhythm.' },
      { question: 'Why limit deep focus blocks to 90 minutes?', answer: 'Research shows the human brain can only sustain peak cognitive focus for about 90 minutes before requiring a recovery break.' }
    ],
    relatedSlugs: ['v15-semester-planner-calculator', 'v15-learning-goal-calculator'],
    calculate: (inputs) => {
      const needed = Number(inputs.totalStudyNeeded || 20);
      const days = Number(inputs.availableDays || 5);
      const block = Number(inputs.intensityStyle || 45);

      const dailyHours = days > 0 ? needed / days : 0;
      const totalDailyMinutes = dailyHours * 60;
      const sessionsPerDay = block > 0 ? totalDailyMinutes / block : 0;

      return {
        results: [
          { label: 'Daily Study Commitment', value: `${dailyHours.toFixed(1)} Hours / Day`, isPrimary: true },
          { label: 'Recommended Sessions Daily', value: `${Math.ceil(sessionsPerDay)} sessions` },
          { label: 'Session Type Selected', value: `${block}-minute focus blocks` }
        ],
        chartData: [
          { name: 'Daily Study Hours', value: Math.round(dailyHours) },
          { name: 'Estimated Leisure Hours', value: 16 - Math.round(dailyHours) }
        ]
      };
    }
  },
  {
    id: 'v15-exam-countdown',
    name: 'Exam Countdown & Study Planner',
    slug: 'v15-exam-countdown-calculator',
    category: 'education',
    description: 'Calculate the days left before a major exam and estimate the daily study hours needed to cover your remaining review pages.',
    seoTitle: 'Exam Preparation & Countdown Study Calculator',
    seoDescription: 'Input upcoming exam dates and review page count to discover daily reading requirements and keep your preparation on track.',
    inputs: [
      { id: 'chaptersToStudy', label: 'Remaining Textbook Chapters / Review Pages', type: 'number', defaultValue: 12 },
      { id: 'daysUntilExam', label: 'Days Remaining Until Exam Date', type: 'number', defaultValue: 21 },
      { id: 'hoursPerChapter', label: 'Study Hours Required per Chapter', type: 'number', defaultValue: 3 }
    ],
    formula: 'Required review speed = Chapters / Days Remaining\nTotal Study Workload = Chapters * Hours per Chapter',
    explanation: 'Planning your study schedule based on the days left before an exam prevents cramming, building confidence and supporting active recall.',
    example: 'Reviewing 12 textbook chapters over 21 days requires studying 0.57 chapters daily, translating to a target of 1.71 hours of reading every day.',
    faq: [
      { question: 'Why is cramming the night before an exam ineffective?', answer: 'Cramming causes elevated stress levels and only stores facts in temporary short-term memory, leading to fast recall fade.' },
      { question: 'What is active recall?', answer: 'A highly effective study practice where you quiz yourself on key concepts instead of passively re-reading highlighting lines.' }
    ],
    relatedSlugs: ['v15-study-schedule-calculator', 'v15-learning-goal-calculator'],
    calculate: (inputs) => {
      const chapters = Number(inputs.chaptersToStudy || 10);
      const days = Number(inputs.daysUntilExam || 7);
      const hPerC = Number(inputs.hoursPerChapter || 2);

      const reviewSpeedDaily = days > 0 ? chapters / days : 0;
      const totalHours = chapters * hPerC;
      const hoursDaily = days > 0 ? totalHours / days : 0;

      return {
        results: [
          { label: 'Chapters to Master Daily', value: `${reviewSpeedDaily.toFixed(2)} chapters / day`, isPrimary: true },
          { label: 'Recommended Study Daily', value: `${hoursDaily.toFixed(2)} Hours / Day` },
          { label: 'Overall Exam Preparation workload', value: `${totalHours} focused hours` }
        ],
        chartData: [
          { name: 'Days Left', value: days },
          { name: 'Chapters Left', value: chapters }
        ]
      };
    }
  },
  {
    id: 'v15-learning-goal',
    name: 'Learning Goal Calculator',
    slug: 'v15-learning-goal-calculator',
    category: 'education',
    description: 'Calculate the total study days and hours required to master a new skill or program based on standard difficulty curves.',
    seoTitle: 'Skill Acquisition & Learning Timeline Planner',
    seoDescription: 'Obtain estimated study milestones to acquire new skills. Factor in target difficulty tiers to calculate realistic project timelines.',
    inputs: [
      { id: 'skillDifficulty', label: 'Skill Difficulty Target', type: 'select', defaultValue: 'competent', options: [
        { label: 'Casual / Basic Literacy (20 hrs)', value: '20' },
        { label: 'Professional Competency (120 hrs)', value: '120' },
        { label: 'Deep Expert Mastery (1000 hrs)', value: '1000' }
      ]},
      { id: 'dailyPractice', label: 'Committed Daily Practice (Hours)', type: 'number', defaultValue: 1.5 }
    ],
    formula: 'Timeline (Days) = Targeted Learning Hours / Daily Study Commitment',
    explanation: 'Setting metrics-based study goals and breaking them down into daily practice blocks ensures you maintain momentum while acquiring new skills.',
    example: 'Reaching professional competency in a programming framework (120 hours) with 1.5 hours of daily practice requires exactly 80 days of committed study.',
    faq: [
      { question: 'Is the 10,000-hour mastery rule real?', answer: 'The 10k-hour rule represents a general guideline for reaching absolute world-class performance, but you can build professional competency in much less time.' },
      { question: 'How can I stay consistent during long study plans?', answer: 'Set small daily milestones, attach rewards to completed modules, and study at the same time each day to build a habit.' }
    ],
    relatedSlugs: ['v15-study-schedule-calculator', 'v15-academic-cost-calculator'],
    calculate: (inputs) => {
      const goalHours = Number(inputs.skillDifficulty || 120);
      const hoursPerDay = Number(inputs.dailyPractice || 1.5);

      const daysRequired = hoursPerDay > 0 ? goalHours / hoursPerDay : 0;
      const weeksRequired = daysRequired / 7;

      return {
        results: [
          { label: 'Projected Study Timeline', value: `${Math.ceil(daysRequired)} Days (${weeksRequired.toFixed(1)} Weeks)`, isPrimary: true },
          { label: 'Overall Study Hours Required', value: `${goalHours} focus hours` },
          { label: 'Weekly Practice Commitment', value: `${(hoursPerDay * 7).toFixed(1)} Hours` }
        ],
        chartData: [
          { name: 'Target Hours', value: goalHours },
          { name: 'Committed Practice', value: Math.round(hoursPerDay * 10) }
        ]
      };
    }
  },
  {
    id: 'v15-academic-cost',
    name: 'Academic Cost Calculator',
    slug: 'v15-academic-cost-calculator',
    category: 'education',
    description: 'Calculate the total real cost of a semester of classes, including credit tuition fees, campus housing, and learning materials.',
    seoTitle: 'Semester Academic Cost & College Expense Planner',
    seoDescription: 'Obtain accurate breakdowns of college semester expenses. Factor in tuition per credit, housing, meal programs, and textbook costs.',
    inputs: [
      { id: 'creditsCount', label: 'Semester Credit Hours', type: 'number', defaultValue: 15 },
      { id: 'tuitionPerCredit', label: 'Tuition Cost per Credit ($)', type: 'number', defaultValue: 450 },
      { id: 'campusFees', label: 'Campus Registration & Activity Fees ($)', type: 'number', defaultValue: 800 },
      { id: 'dormsMeals', label: 'Housing & Meal Programs cost ($)', type: 'number', defaultValue: 5500 },
      { id: 'textbooksCost', label: 'Course Textbooks & Tech Materials ($)', type: 'number', defaultValue: 600 }
    ],
    formula: 'Total Cost = (Credits * Price/Credit) + Campus Fees + Housing/Meals + Materials',
    explanation: 'Calculating your total semester academic expenses helps you estimate student loan requirements and plan balanced budgets.',
    example: 'Taking 15 credits at $450/credit with $800 in fees, $5,500 dorm fees, and $600 in book costs results in a semester total of $13,650.',
    faq: [
      { question: 'What is the best way to lower catalog book costs?', answer: 'Rent digital textbooks, buy used copies, or check college libraries for direct textbook reservations.' },
      { question: 'How is tuition calculated for full-time loads?', answer: 'Many public universities offer a flat tuition rate for credit loads between 12 and 18 hours, rather than charging per credit.' }
    ],
    relatedSlugs: ['v15-degree-cost-calculator', 'v15-learning-goal-calculator'],
    calculate: (inputs) => {
      const credits = Number(inputs.creditsCount || 15);
      const price = Number(inputs.tuitionPerCredit || 450);
      const fees = Number(inputs.campusFees || 800);
      const housing = Number(inputs.dormsMeals || 0);
      const books = Number(inputs.textbooksCost || 0);

      const tuitionTotal = credits * price;
      const grandTotal = tuitionTotal + fees + housing + books;

      return {
        results: [
          { label: 'Total Estimated Cost / Semester', value: `$${grandTotal.toLocaleString()}`, isPrimary: true },
          { label: 'Tuition Fee Subtotal', value: `$${tuitionTotal.toLocaleString()}` },
          { label: 'Housing & Meals Subtotal', value: `$${housing.toLocaleString()}` },
          { label: 'Mandatory Fees & Textbooks', value: `$${(fees + books).toLocaleString()}` }
        ],
        chartData: [
          { name: 'Tuition', value: tuitionTotal },
          { name: 'Fees & Materials', value: fees + books },
          { name: 'Room & Board', value: housing }
        ]
      };
    }
  },
  {
    id: 'v15-degree-cost',
    name: 'Degree Cost Calculator',
    slug: 'v15-degree-cost-calculator',
    category: 'education',
    description: 'Project the total multi-year expense of completing your college degree, factoring in tuition increases and loan interest.',
    seoTitle: 'Four-Year College Degree Total Cost Calculator',
    seoDescription: 'Forecast the full cost of completing a bachelor’s degree. Plan for annual tuition inflation and organic living expenses.',
    inputs: [
      { id: 'annualBaseCost', label: 'Base Cost per Year ($)', type: 'number', defaultValue: 25000 },
      { id: 'yearsDuration', label: 'Program Duration (Years)', type: 'number', defaultValue: 4 },
      { id: 'tuitionInflation', label: 'Annual College Tuition Inflation (%)', type: 'number', defaultValue: 3.5 }
    ],
    formula: 'Cost_t = Cost_t-1 * (1 + Inflation / 100), summed across the program duration.',
    explanation: 'Tuition fees historically rise faster than standard inflation. Projecting these multi-year compounded costs is vital for long-term college savings.',
    example: 'A 4-year college degree program starting at a $25,000 base with a 3.5% annual tuition increase will cost a total of $105,357 to complete.',
    faq: [
      { question: 'Why does college tuition rise historically fast?', answer: 'Administrative growth, updated facility construction, and increased demand for student campus amenities historically drive up prices.' },
      { question: 'How do student loan interest rates affect my total cost?', answer: 'Loan interest can easily add 20% to 50% or more to your actual out-of-pocket costs after graduation, depending on your repayment speed.' }
    ],
    relatedSlugs: ['v15-academic-cost-calculator', 'v15-learning-goal-calculator'],
    calculate: (inputs) => {
      const base = Number(inputs.annualBaseCost || 20000);
      const yrs = Number(inputs.yearsDuration || 4);
      const inf = Number(inputs.tuitionInflation || 3.5) / 100;

      let grandTotal = 0;
      let currentYearCost = base;
      const breakdowns = [];

      for (let y = 1; y <= yrs; y++) {
        grandTotal += currentYearCost;
        breakdowns.push({ year: `Year ${y}`, cost: Math.round(currentYearCost) });
        currentYearCost = currentYearCost * (1 + inf);
      }

      return {
        results: [
          { label: 'Overall Estimated Degree Cost', value: `$${Math.round(grandTotal).toLocaleString()}`, isPrimary: true },
          { label: 'Average Annual Cost', value: `$${Math.round(grandTotal / yrs).toLocaleString()}` },
          { label: 'Class Year 4 Cost', value: `$${Math.round(breakdowns[breakdowns.length - 1]?.cost || base).toLocaleString()}` }
        ],
        chartData: breakdowns.map(b => ({ name: b.year, value: b.cost }))
      };
    }
  },

  // MATH
  {
    id: 'v15-fraction-percentage',
    name: 'Fraction to Percentage Calculator',
    slug: 'v15-fraction-percentage-calculator',
    category: 'math',
    description: 'Convert any raw mathematical fraction into its equivalent percentage string instantly, with steps.',
    seoTitle: 'Fraction to Percentage Converter',
    seoDescription: 'Convert any fraction to a percentage with structural step-by-step instructions. Divide numerators by denominators with ease.',
    inputs: [
      { id: 'numerator', label: 'Numerator (Top Number)', type: 'number', defaultValue: 5 },
      { id: 'denominator', label: 'Denominator (Bottom Number)', type: 'number', defaultValue: 8 }
    ],
    formula: 'Percentage = (Numerator / Denominator) * 100',
    explanation: 'Converting fractions into percentages normalizes values onto a standard 1-to-100 scale, making comparison and performance analysis simple.',
    example: 'Converting the fraction 5/8 into a percentage yields exactly 62.50%.',
    faq: [
      { question: 'What is a numerator vs a denominator?', answer: 'The numerator (top) represents how many parts we are focusing on, while the denominator (bottom) is the total number of equal parts.' },
      { question: 'Can denominator values ever equal zero?', answer: 'No, division by zero is mathematically undefined, meaning denominator inputs must always be non-zero.' }
    ],
    relatedSlugs: ['v15-percentage-fraction-calculator', 'v15-decimal-percentage-calculator'],
    calculate: (inputs) => {
      const top = Number(inputs.numerator || 1);
      const bot = Number(inputs.denominator || 1);

      if (bot === 0) {
        return {
          results: [{ label: 'Error Status', value: 'Cannot divide by zero', isPrimary: true }]
        };
      }

      const percent = (top / bot) * 100;

      return {
        results: [
          { label: 'Result Percentage Value', value: `${percent.toFixed(3)}%`, isPrimary: true },
          { label: 'Decimal Equivalent', value: (top / bot).toFixed(5) },
          { label: 'Original Fraction representation', value: `${top} / ${bot}` }
        ],
        chartData: [
          { name: 'Numerator Parts', value: top },
          { name: 'Remaining Parts', value: Math.max(0, bot - top) }
        ]
      };
    }
  },
  {
    id: 'v15-percentage-fraction',
    name: 'Percentage to Fraction Calculator',
    slug: 'v15-percentage-fraction-calculator',
    category: 'math',
    description: 'Convert any percentage value back into a simplified mathematical fraction.',
    seoTitle: 'Percentage to Fraction Simplifier Converter',
    seoDescription: 'Obtain simplified fractions from raw percentages. View common-divisor steps and prime reductions.',
    inputs: [
      { id: 'percentValue', label: 'Percentage value (%)', type: 'number', defaultValue: 62.5 }
    ],
    formula: 'Convert Percentage to fraction: P / 100\nSimplify using the Greatest Common Divisor (GCD).',
    explanation: 'Expressing percentages as simplified fractions gives you clean, clean integer ratios often used in construction and craft layouts.',
    example: 'A percentage of 62.5% converts to 625/1000, which simplifies to the fraction 5/8 using the GCD of 125.',
    faq: [
      { question: 'How is a decimal percentage simplified?', answer: 'We multiply BOTH numerator and denominator by 10 for every digit after the decimal point to remove the decimal before running the GCD.' },
      { question: 'What represents GCD?', answer: 'Greatest Common Divisor, the largest positive integer that divides both numbers without leaving a remainder.' }
    ],
    relatedSlugs: ['v15-fraction-percentage-calculator', 'v15-decimal-percentage-calculator'],
    calculate: (inputs) => {
      const pct = Number(inputs.percentValue || 50);

      // Convert to fraction base 100
      let numerator = pct;
      let denominator = 100;

      // Multiply to remove decimals
      while (numerator % 1 !== 0) {
        numerator *= 10;
        denominator *= 10;
      }

      // Greatest Common Divisor helper
      const findGcd = (x: number, y: number): number => {
        return y ? findGcd(y, x % y) : x;
      };

      const gcd = Math.abs(findGcd(numerator, denominator));
      const simplifiedTop = numerator / gcd;
      const simplifiedBot = denominator / gcd;

      return {
        results: [
          { label: 'Simplified Fraction', value: `${simplifiedTop} / ${simplifiedBot}`, isPrimary: true },
          { label: 'Unsimplified raw fraction', value: `${Math.round(numerator)} / ${denominator}` },
          { label: 'Greatest Common Divisor used', value: gcd }
        ],
        chartData: [
          { name: 'Fraction Portion', value: simplifiedTop },
          { name: 'Remainder Portion', value: Math.max(1, simplifiedBot - simplifiedTop) }
        ]
      };
    }
  },
  {
    id: 'v15-decimal-percentage',
    name: 'Decimal to Percentage Calculator',
    slug: 'v15-decimal-percentage-calculator',
    category: 'math',
    description: 'Multiply standard float decimal values by 100 to translate them instantly to percentage notation.',
    seoTitle: 'Decimal to Percentage Conversion Solver',
    seoDescription: 'Convert decimals directly into percentages. Enter floats to display percentage indicators and step-by-step math conversions.',
    inputs: [
      { id: 'decimalFloat', label: 'Decimal float value', type: 'number', defaultValue: 0.156, step: 0.001 }
    ],
    formula: 'Percentage = Float * 100',
    explanation: 'Converting float decimals to percentages scales standard mathematical probabilities onto a human-friendly, readable percentage baseline.',
    example: 'A decimal float premium of 0.156 translates directly to a percentage value of 15.60%.',
    faq: [
      { question: 'Why multiply by 100 to find the percentage?', answer: 'Percentage literally translates to "per 100," meaning we are converting a fraction of 1 into its equivalent fraction of 100.' },
      { question: 'Is 1.0 equivalent to 100%?', answer: 'Yes, 1.0 represents a complete whole, which is exactly equivalent to 100%.' }
    ],
    relatedSlugs: ['v15-fraction-percentage-calculator', 'v15-percentage-fraction-calculator'],
    calculate: (inputs) => {
      const dec = Number(inputs.decimalFloat || 0);

      const percent = dec * 100;

      return {
        results: [
          { label: 'Resulting Percentage', value: `${percent.toFixed(2)}%`, isPrimary: true },
          { label: 'Original Float value', value: dec.toString() },
          { label: 'Mathematical Formula', value: `${dec} × 100 = ${percent}%` }
        ],
        chartData: [
          { name: 'Decimal float equivalent', value: Math.round(dec * 100) },
          { name: 'Remainder to whole (100)', value: Math.max(0, 100 - Math.round(dec * 100)) }
        ]
      };
    }
  },
  {
    id: 'v15-number-factor',
    name: 'Number Factor Calculator',
    slug: 'v15-number-factor-calculator',
    category: 'math',
    description: 'Find all positive and negative mathematical factors of any chosen composite integer.',
    seoTitle: 'Number Factor Finder | Complete Integer Divisors',
    seoDescription: 'List all whole-number factors of an integer. Display positive and negative divisor sets with prime classifications.',
    inputs: [
      { id: 'targetInteger', label: 'Enter Integer Target', type: 'number', defaultValue: 144 }
    ],
    formula: 'Check all integers d where target % d === 0.',
    explanation: 'Factors are the building blocks of numbers. Learning all whole divisors for a number is crucial for finding common denominators and simplifying algebra.',
    example: 'Factorizing the integer 144 reveals exactly 15 positive divisors: 1, 2, 3, 4, 6, 8, 9, 12, 16, 18, 24, 36, 48, 72, 144.',
    faq: [
      { question: 'What is a prime number?', answer: 'A prime number is an integer greater than 1 that only has two positive factors: 1 and itself.' },
      { question: 'How is a factor different from a multiple?', answer: 'A factor divides a number evenly, while a multiple is the result of multiplying that number by another integer.' }
    ],
    relatedSlugs: ['v15-prime-factor-calculator', 'v15-divisibility-calculator'],
    calculate: (inputs) => {
      const n = Math.abs(Math.round(Number(inputs.targetInteger || 12)));

      const factors = [];
      for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
          factors.push(i);
          if (n / i !== i) {
            factors.push(n / i);
          }
        }
      }
      factors.sort((a, b) => a - b);

      return {
        results: [
          { label: 'Positive Factor divisors', value: factors.join(', '), isPrimary: true },
          { label: 'Total Divisors count', value: factors.length },
          { label: 'Factor Type Classification', value: factors.length === 2 ? 'Prime Number' : 'Composite Number' }
        ],
        chartData: [
          { name: 'Divisors Count', value: factors.length },
          { name: 'Square Root Floor', value: Math.floor(Math.sqrt(n)) }
        ]
      };
    }
  },
  {
    id: 'v15-prime-factor',
    name: 'Prime Factor Calculator',
    slug: 'v15-prime-factor-calculator',
    category: 'math',
    description: 'Deconstruct any target integer into its foundational prime number multipliers.',
    seoTitle: 'Prime Factorization & Integer Factor Tree Solver',
    seoDescription: 'Break down composite integers into prime products. Display factor trees and exponential equations.',
    inputs: [
      { id: 'targetNumber', label: 'Enter Integer Target', type: 'number', defaultValue: 360 }
    ],
    formula: 'Recursive trial division of the target integer by prime numbers starting at 2.',
    explanation: 'The Fundamental Theorem of Arithmetic states that every integer greater than 1 is either prime itself or can be represented as a unique product of prime numbers.',
    example: 'Factorizing 360 yields the prime product: 2^3 × 3^2 × 5.',
    faq: [
      { question: 'Why does prime factorization matter in cryptography?', answer: 'Modern security encryption algorithms (like RSA) rely on the difficulty of finding the prime factors of extremely large numbers.' },
      { question: 'Why is the number 1 not considered a prime number?', answer: 'Including 1 as a prime would violate the uniqueness of prime factorization, as you could multiply any product buy 1 infinitely.' }
    ],
    relatedSlugs: ['v15-number-factor-calculator', 'v15-divisibility-calculator'],
    calculate: (inputs) => {
      let num = Math.abs(Math.round(Number(inputs.targetNumber || 360)));

      if (num <= 1) {
        return {
          results: [{ label: 'Prime Factors', value: 'None (Requires integer > 1)', isPrimary: true }]
        };
      }

      const factors: Record<number, number> = {};
      let d = 2;
      const original = num;

      while (num > 1) {
        while (num % d === 0) {
          factors[d] = (factors[d] || 0) + 1;
          num /= d;
        }
        d++;
        if (d * d > num) {
          if (num > 1) {
            factors[num] = (factors[num] || 0) + 1;
            break;
          }
        }
      }

      const productString = Object.entries(factors)
        .map(([prime, power]) => (power > 1 ? `${prime}^${power}` : prime))
        .join(' × ');

      const listString = Object.keys(factors).join(', ');

      return {
        results: [
          { label: 'Exponential Prime Product', value: productString, isPrimary: true },
          { label: 'Distinct Prime Divisors', value: listString },
          { label: 'Input Number Verified', value: original }
        ],
        chartData: Object.entries(factors).map(([p, pow]) => ({ name: `Prime ${p}`, value: pow }))
      };
    }
  },
  {
    id: 'v15-divisibility',
    name: 'Divisibility Calculator',
    slug: 'v15-divisibility-calculator',
    category: 'math',
    description: 'Verify if a large integer is divisible by standard divider inputs, detailing the mathematical divisibility rule.',
    seoTitle: 'Divisibility Rule Checker & Modular Math Solver',
    seoDescription: 'Test integer divisibility with modular math. View divisibility rules for numbers from 2 to 13, including division steps and remainders.',
    inputs: [
      { id: 'targetNum', label: 'Large Target Integer', type: 'number', defaultValue: 12345 },
      { id: 'divisor', label: 'Divisor Test target', type: 'number', defaultValue: 3 }
    ],
    formula: 'Checks if Target Modulo Divisor === 0.',
    explanation: 'Using simple arithmetic shortcuts (such as summing digits to check for divisibility by 3) lets you analyze integer factors fast of large composite numbers.',
    example: 'We check if 12,345 is divisible by 3. Summing its digits yields 1 + 2 + 3 + 4 + 5 = 15. Since 15 is divisible by 3, 12,345 is divisible by 3 (yielding exactly 4,115).',
    faq: [
      { question: 'What is the divisibility shortcut rule for 3?', answer: 'If the sum of a number\'s digits is divisible by 3, the entire number is divisible by 3 without a remainder.' },
      { question: 'What occurs when modulo equals non-zero?', answer: 'The result represents the integer remainder. For example, 10 modulo 3 leaves a remainder of 1.' }
    ],
    relatedSlugs: ['v15-number-factor-calculator', 'v15-prime-factor-calculator'],
    calculate: (inputs) => {
      const target = Math.round(Number(inputs.targetNum || 0));
      const div = Math.round(Number(inputs.divisor || 3));

      if (div === 0) {
        return {
          results: [{ label: 'Status', value: 'Division by zero is undefined', isPrimary: true }]
        };
      }

      const mod = target % div;
      const isDivisible = mod === 0;

      return {
        results: [
          { label: 'Divisible Option Status', value: isDivisible ? 'Yes, Divisible' : 'Not Divisible', isPrimary: true },
          { label: 'Division Quotient output', value: (target / div).toFixed(4) },
          { label: 'Modulo Division Remainder', value: mod }
        ],
        chartData: [
          { name: 'Modulo Remainder', value: mod },
          { name: 'Divisor Portion', value: div }
        ]
      };
    }
  },
  {
    id: 'v15-rounding-advanced',
    name: 'Advanced Rounding Calculator',
    slug: 'v15-rounding-advanced-calculator',
    category: 'math',
    description: 'Round float variables using advanced programming and accounting schedules, including banker\'s rounding and truncation.',
    seoTitle: 'Advanced Rounding Modes & Decimal Solver',
    seoDescription: 'Round decimals using multiple mathematical models: Round half-up, half-even (banker\'s rounding), round up, round down, and truncation.',
    inputs: [
      { id: 'floatNum', label: 'Target Decimal Float', type: 'number', defaultValue: 156.457, step: 0.0001 },
      { id: 'precisionDigits', label: 'Precision Decimal Places', type: 'number', defaultValue: 2 },
      { id: 'roundingMode', label: 'Rounding Logic Model', type: 'select', defaultValue: 'half-up', options: [
        { label: 'Round Half-Up (Standard Math)', value: 'half-up' },
        { label: 'Round Half-Even (Banker’s Rule)', value: 'half-even' },
        { label: 'Round Up (Ceiling)', value: 'up' },
        { label: 'Round Down (Floor)', value: 'down' },
        { label: 'Truncate (Cut decimal trailing)', value: 'truncate' }
      ]}
    ],
    formula: 'Rounding methodologies alter final digits to prevent geometric accumulation of rounding errors.',
    explanation: 'Bankers and tax offices use "Round Half-Even" (banker\'s rounding). This rounding model rounds to the nearest even digit on exact halves, reducing statistical bias across large datasets.',
    example: 'Rounding 156.457 to 2 decimal places using standard "Round Half-Up" logic yields exactly 156.46. Truncating the same value yields 156.45.',
    faq: [
      { question: 'Why do finance teams use banker\'s rounding?', answer: 'Standard rounding always rounds halves up, creating a upward statistical bias over thousands of transactions. Rounding to the nearest even digit eliminates this bias.' },
      { question: 'How does truncation differ from rounding down?', answer: 'Rounding down rounds towards negative infinity, whereas truncation simply deletes all digits past the desired decimal place.' }
    ],
    relatedSlugs: ['v15-decimal-percentage-calculator', 'v15-scientific-advanced-calculator'],
    calculate: (inputs) => {
      const num = Number(inputs.floatNum || 0);
      const dec = Number(inputs.precisionDigits || 0);
      const mode = String(inputs.roundingMode || 'half-up');

      let rounded = num;
      const factor = Math.pow(10, dec);

      if (mode === 'half-up') {
        rounded = Math.round(num * factor) / factor;
      } else if (mode === 'up') {
        rounded = Math.ceil(num * factor) / factor;
      } else if (mode === 'down') {
        rounded = Math.floor(num * factor) / factor;
      } else if (mode === 'truncate') {
        rounded = Math.trunc(num * factor) / factor;
      } else if (mode === 'half-even') {
        // Banker's rounding implementation
        const temp = num * factor;
        const floorVal = Math.floor(temp);
        const diff = temp - floorVal;
        if (diff < 0.5) {
          rounded = floorVal / factor;
        } else if (diff > 0.5) {
          rounded = Math.ceil(temp) / factor;
        } else {
          rounded = (floorVal % 2 === 0 ? floorVal : Math.ceil(temp)) / factor;
        }
      }

      return {
        results: [
          { label: 'Rounded Numerical Value', value: rounded.toFixed(dec), isPrimary: true },
          { label: 'Original float input', value: num.toString() },
          { label: 'Rounding Scheme Applied', value: mode.toUpperCase() }
        ],
        chartData: [
          { name: 'Before Rounding', value: Math.round(num) },
          { name: 'After Rounding', value: Math.round(rounded) }
        ]
      };
    }
  },
  {
    id: 'v15-scientific-advanced',
    name: 'Advanced Scientific Calculator',
    slug: 'v15-scientific-advanced-calculator',
    category: 'math',
    description: 'Solve advanced logarithmic, trigonometric, hyperbolic, and exponential scientific formulas.',
    seoTitle: 'Advanced Scientific Trigonometry & Log Solver',
    seoDescription: 'Obtain logarithmic indexes. Calculate sine, cosine, tangent, and natural logs (ln) with clear math explanations.',
    inputs: [
      { id: 'primaryValue', label: 'Primary Numeric Value (X)', type: 'number', defaultValue: 5 },
      { id: 'mathFunction', label: 'Mathematical Function to Run', type: 'select', defaultValue: 'log10', options: [
        { label: 'Common Logarithm (log10)', value: 'log10' },
        { label: 'Natural Logarithm (ln)', value: 'ln' },
        { label: 'Sine Function (sin - in Rad)', value: 'sin' },
        { label: 'Cosine Function (cos - in Rad)', value: 'cos' },
        { label: 'Square Root (√x)', value: 'sqrt' }
      ]}
    ],
    formula: 'Resolves targeted functions using the standard Javascript Math object.',
    explanation: 'Advanced functions (such as logarithmic axes) model exponential real-world decay and growth, like sound levels (decibels) or earthquake intensity.',
    example: 'Computing the common logarithm (log10) of x = 5 yields exactly 0.699.',
    faq: [
      { question: 'What is natural logarithm (ln)?', answer: 'Natural log (ln) is calculation of logarithms to the mathematical constant base e (approximately 2.71828).' },
      { question: 'Why does trigonometry default to radian measurements?', answer: 'In mathematical sciences, radians provide a natural coordinate scaling based on radius arc lengths, simplifying core calculus conversions.' }
    ],
    relatedSlugs: ['v15-rounding-advanced-calculator', 'v15-fraction-percentage-calculator'],
    calculate: (inputs) => {
      const x = Number(inputs.primaryValue || 0);
      const fn = String(inputs.mathFunction || 'log10');

      let result = 0;
      let label = 'Result Value';

      if (fn === 'log10') {
        result = x > 0 ? Math.log10(x) : NaN;
        label = 'Logarithm (base 10) output';
      } else if (fn === 'ln') {
        result = x > 0 ? Math.log(x) : NaN;
        label = 'Natural Logarithm (ln) output';
      } else if (fn === 'sin') {
        result = Math.sin(x);
        label = 'Sine result (Radians)';
      } else if (fn === 'cos') {
        result = Math.cos(x);
        label = 'Cosine result (Radians)';
      } else if (fn === 'sqrt') {
        result = x >= 0 ? Math.sqrt(x) : NaN;
        label = 'Square root output';
      }

      return {
        results: [
          { label, value: isNaN(result) ? 'Math Error (Invalid input domain)' : result.toFixed(6), isPrimary: true },
          { label: 'Calculated Function', value: fn.toUpperCase() },
          { label: 'Input Variable Value', value: x }
        ],
        chartData: [
          { name: 'X Input', value: Math.round(x) },
          { name: 'Y Output Metric', value: isNaN(result) ? 0 : Math.round(result * 10) }
        ]
      };
    }
  },

  // STATISTICS
  {
    id: 'v15-average-advanced',
    name: 'Advanced Average Calculator',
    slug: 'v15-average-advanced-calculator',
    category: 'math', // Keep statistical categories under general MATH to align with App.tsx routes or let's double check route mappings
    description: 'Calculate average metrics across a dataset, tracking arithmetic, geometric, and harmonic means simultaneously.',
    seoTitle: 'Advanced Statistical Means & Averages Calculator',
    seoDescription: 'Check multiple means for a dataset. Calculate arithmetic, geometric, and harmonic averages with clear step explanations.',
    inputs: [
      { id: 'dataSeries', label: 'Comma-separated Numbers', type: 'text', defaultValue: '10, 20, 30, 40, 50' }
    ],
    formula: 'Arithmetic Mean = Sum / N\nGeometric Mean = (Product) ^ (1/N)\nHarmonic Mean = N / Sum(1/x)',
    explanation: 'Comparing mean styles is crucial for analyzing different types of data. Use arithmetic mean for standard scales, geometric mean for growth rates, and harmonic mean for rates and ratios.',
    example: 'For the numbers: 10, 20, 30, 40, 50, the Arithmetic Mean is 30.00, the Geometric Mean is 26.05, and the Harmonic Mean is 21.90.',
    faq: [
      { question: 'When is geometric mean preferred?', answer: 'Geometric mean is the standard for investment growth rates and compounding percentages, preventing bias from extreme values.' },
      { question: 'Can harmonic mean handle zero values?', answer: 'No, division by zero is undefined, so harmonic calculations require all dataset numbers to be non-zero.' }
    ],
    relatedSlugs: ['v15-weighted-average-calculator', 'v15-standard-error-calculator'],
    calculate: (inputs) => {
      const raw = String(inputs.dataSeries || '10, 20, 30, 40, 50');
      const arr = raw.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v) && v > 0);

      if (arr.length === 0) {
        return {
          results: [{ label: 'Mean Value', value: 'Please enter valid positive numbers', isPrimary: true }]
        };
      }

      // Arithmetic
      const sum = arr.reduce((acc, c) => acc + c, 0);
      const arithmetic = sum / arr.length;

      // Geometric
      const productLog = arr.reduce((acc, c) => acc + Math.log(c), 0);
      const geometric = Math.exp(productLog / arr.length);

      // Harmonic
      const harmonicDenom = arr.reduce((acc, c) => acc + (1 / c), 0);
      const harmonic = arr.length / harmonicDenom;

      return {
        results: [
          { label: 'Arithmetic Mean (Standard Average)', value: arithmetic.toFixed(4), isPrimary: true },
          { label: 'Geometric Mean (Growth Average)', value: geometric.toFixed(4) },
          { label: 'Harmonic Mean (Rates Average)', value: harmonic.toFixed(4) },
          { label: 'Dataset Size Count', value: arr.length }
        ],
        chartData: [
          { name: 'Arithmetic', value: Math.round(arithmetic) },
          { name: 'Geometric', value: Math.round(geometric) },
          { name: 'Harmonic', value: Math.round(harmonic) }
        ]
      };
    }
  },
  {
    id: 'v15-weighted-average',
    name: 'Weighted Average Calculator',
    slug: 'v15-weighted-average-calculator',
    category: 'math',
    description: 'Calculate weighted averages where specific inputs carry more statistical influence than companion values.',
    seoTitle: 'Weighted Average & Multi-Category Solver',
    seoDescription: 'Calculate weighted averages. Combine multiple values and assigned weight percentages to find precise final scores.',
    inputs: [
      { id: 'valuesList', label: 'Comma-separated Values', type: 'text', defaultValue: '80, 90, 70' },
      { id: 'weightsList', label: 'Comma-separated Weights', type: 'text', defaultValue: '50, 30, 20' }
    ],
    formula: 'Weighted Average = Sum(Value_i * Weight_i) / Sum(Weights)',
    explanation: 'Weighted averages are essential in financial portfolios, GPA calculations, and accounting, ensuring key items contribute proportionally to the final result.',
    example: 'Combining values [80, 90, 70] with weights [50, 30, 20] yields a weighted average of exactly 81.00.',
    faq: [
      { question: 'Do weights need to sum to 100?', answer: 'No! The formula divides by the sum of the weights, so the math remains accurate regardless of the weight scale.' },
      { question: 'What is standard portfol weighted return?', answer: 'The return of a stock portfolio where each asset contribution is scaled by its weight percentage in the total fund.' }
    ],
    relatedSlugs: ['v15-average-advanced-calculator', 'v15-standard-error-calculator'],
    calculate: (inputs) => {
      const vRaw = String(inputs.valuesList || '80, 90, 70');
      const wRaw = String(inputs.weightsList || '50, 30, 20');

      const vals = vRaw.split(',').map(x => Number(x.trim())).filter(x => !isNaN(x));
      const weights = wRaw.split(',').map(x => Number(x.trim())).filter(x => !isNaN(x));

      if (vals.length === 0 || vals.length !== weights.length) {
        return {
          results: [{ label: 'Average', value: 'Values and Weights lengths must match', isPrimary: true }]
        };
      }

      let numerator = 0;
      let denominator = 0;
      for (let i = 0; i < vals.length; i++) {
        numerator += vals[i] * weights[i];
        denominator += weights[i];
      }

      const weightedAvg = denominator > 0 ? numerator / denominator : 0;

      return {
        results: [
          { label: 'Weighted Average Result', value: weightedAvg.toFixed(4), isPrimary: true },
          { label: 'Sum of All Weights', value: denominator.toString() },
          { label: 'Input Elements verified', value: vals.length }
        ],
        chartData: vals.map((v, i) => ({ name: `Val ${v}`, value: weights[i] }))
      };
    }
  },
  {
    id: 'v15-standard-error',
    name: 'Standard Error Calculator',
    slug: 'v15-standard-error-calculator',
    category: 'math',
    description: 'Calculate the standard error of the mean (SEM) of a raw numeric dataset to analyze sampling variance.',
    seoTitle: 'Standard Error of the Mean (SEM) Calculator',
    seoDescription: 'Determine standard errors for research datasets. Retrieve standard deviation and SEM with clear formula breakdowns.',
    inputs: [
      { id: 'numericSample', label: 'Comma-separated Sample Dataset', type: 'text', defaultValue: '12, 15, 18, 14, 20, 22' }
    ],
    formula: 'Standard Deviation (σ) = √ (Sum((x - mean)^2) / (N - 1))\nStandard Error (SEM) = σ / √ N',
    explanation: 'Standard Error measures how closely a sample mean represents the true population mean, making it essential for academic research and polling.',
    example: 'For the sample dataset [12, 15, 18, 14, 20, 22], the sample standard deviation is 3.78, and the Standard Error of the Mean (SEM) is 1.54.',
    faq: [
      { question: 'What is standard deviation vs standard error?', answer: 'Standard deviation (SD) measures the spread of individual values in a sample. Standard error (SEM) measures the expected variance of the sample mean itself.' },
      { question: 'How can I lower standard error?', answer: 'Increasing your sample size (N) naturally reduces standard error, as a larger dataset narrows the variance of the sample mean.' }
    ],
    relatedSlugs: ['v15-average-advanced-calculator', 'v15-variability-calculator'],
    calculate: (inputs) => {
      const raw = String(inputs.numericSample || '12, 15, 18, 14, 20, 22');
      const arr = raw.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v));

      const n = arr.length;
      if (n < 2) {
        return {
          results: [{ label: 'SEM', value: 'Please enter at least 2 sample values', isPrimary: true }]
        };
      }

      const mean = arr.reduce((a, b) => a + b, 0) / n;
      const varianceSum = arr.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0);
      const stdev = Math.sqrt(varianceSum / (n - 1));
      const sem = stdev / Math.sqrt(n);

      return {
        results: [
          { label: 'Standard Error of the Mean (SEM)', value: sem.toFixed(4), isPrimary: true },
          { label: 'Sample Standard Deviation (SD)', value: stdev.toFixed(4) },
          { label: 'Sample Dataset Mean (Average)', value: mean.toFixed(4) },
          { label: 'Total Sample Size (N)', value: n }
        ],
        chartData: [
          { name: 'Standard Error (SEM)', value: Math.round(sem * 10) },
          { name: 'Standard Deviation (SD)', value: Math.round(stdev * 10) }
        ]
      };
    }
  },
  {
    id: 'v15-variability',
    name: 'Variability Calculator',
    slug: 'v15-variability-calculator',
    category: 'math',
    description: 'Calculate standard indicators of data spread, including range, variance, and standard deviation.',
    seoTitle: 'Statistical Variability & Range Solver',
    seoDescription: 'Determine range, variance, standard deviation, and coefficient of variation for any numerical sample.',
    inputs: [
      { id: 'dataSample', label: 'Comma-separated Numbers', type: 'text', defaultValue: '5, 10, 15, 20, 25' }
    ],
    formula: 'Range = Max - Min\nVariance (s^2) = Sum((x - mean)^2) / (N - 1)',
    explanation: 'Variability measures how spread out values are in a dataset. Low variability indicates clustered, consistent data, while high variability shows widespread points.',
    example: 'For the dataset [5, 10, 15, 20, 25], the range is 20, the sample variance is 62.5, and the sample standard deviation is 7.91.',
    faq: [
      { question: 'Why divide by N-1 in sample variance?', answer: 'Bessel\'s correction (N-1) corrects the downward bias in sample variance estimations, making them more representative of the overall population.' },
      { question: 'What does Coefficient of Variation measure?', answer: 'The ratio of standard deviation to the mean, showing relative variability independent of the dataset\'s measurement scale.' }
    ],
    relatedSlugs: ['v15-standard-error-calculator', 'v15-data-comparison-calculator'],
    calculate: (inputs) => {
      const raw = String(inputs.dataSample || '5, 10, 15, 20, 25');
      const arr = raw.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v));

      const n = arr.length;
      if (n < 2) {
        return {
          results: [{ label: 'Variability', value: 'Requires at least 2 sample entries', isPrimary: true }]
        };
      }

      const max = Math.max(...arr);
      const min = Math.min(...arr);
      const range = max - min;

      const mean = arr.reduce((a, b) => a + b, 0) / n;
      const squaredDiffs = arr.reduce((acc, c) => acc + Math.pow(c - mean, 2), 0);
      const variance = squaredDiffs / (n - 1);
      const stdev = Math.sqrt(variance);

      return {
        results: [
          { label: 'Sample Standard Deviation', value: stdev.toFixed(4), isPrimary: true },
          { label: 'Sample Variance (s^2)', value: variance.toFixed(4) },
          { label: 'Computed Data Range', value: range.toString() },
          { label: 'Coefficient of Variation', value: `${((stdev / mean) * 100).toFixed(2)}%` }
        ],
        chartData: [
          { name: 'Range Bounds', value: range },
          { name: 'Standard Deviation', value: Math.round(stdev) }
        ]
      };
    }
  },
  {
    id: 'v15-data-comparison',
    name: 'Data Comparison Calculator',
    slug: 'v15-data-comparison-calculator',
    category: 'math',
    description: 'Compare two numerical datasets, tracking statistical differences in overall means, ranges, and variance profiles.',
    seoTitle: 'Statistical Dataset Comparison & Variant Solver',
    seoDescription: 'Directly compare two data series. Contrast means, variance, and standard deviations side-by-side with clear visual insights.',
    inputs: [
      { id: 'groupA', label: 'Dataset Group A', type: 'text', defaultValue: '10, 12, 15, 13, 11' },
      { id: 'groupB', label: 'Dataset Group B', type: 'text', defaultValue: '14, 16, 18, 15, 17' }
    ],
    formula: 'Calculates mean, variance, and range separately for Group A and Group B, displaying the delta between them.',
    explanation: 'Direct statistical comparisons reveal meaningful differences between control and test groups in healthcare, education, and marketing experiments.',
    example: 'Comparing Group A [10, 12, 15, 13, 11] with Group B [14, 16, 18, 15, 17] reveals that Group B has a higher mean (16.0 compared to 12.2) and a similar standard deviation.',
    faq: [
      { question: 'Why compare datasets using standard deviation alongside means?', answer: 'Two groups can share the same average while having widely different distributions, meaning SD is essential to reveal consistency differences.' },
      { question: 'What is a statistical Cohen\'s d effect size?', answer: 'A standardized index measuring the magnitude of the difference between two group means, showing the practical significance of the delta.' }
    ],
    relatedSlugs: ['v15-variability-calculator', 'v15-regression-calculator'],
    calculate: (inputs) => {
      const parseList = (str: string) => str.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v));

      const arrA = parseList(inputs.groupA || '10, 12, 15, 13, 11');
      const arrB = parseList(inputs.groupB || '14, 16, 18, 15, 17');

      if (arrA.length < 2 || arrB.length < 2) {
        return {
          results: [{ label: 'Status', value: 'Both datasets must have at least 2 entries', isPrimary: true }]
        };
      }

      const meanOf = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
      const varOf = (arr: number[], m: number) => arr.reduce((acc, c) => acc + Math.pow(c - m, 2), 0) / (arr.length - 1);

      const meanA = meanOf(arrA);
      const meanB = meanOf(arrB);
      const varA = varOf(arrA, meanA);
      const varB = varOf(arrB, meanB);

      const meanDelta = meanB - meanA;

      return {
        results: [
          { label: 'Group A Mean Average', value: meanA.toFixed(2), isPrimary: true },
          { label: 'Group B Mean Average', value: meanB.toFixed(2), isPrimary: true },
          { label: 'Average Delta Shift', value: `${meanDelta > 0 ? '+' : ''}${meanDelta.toFixed(2)}` },
          { label: 'SD Comparison (A vs B)', value: `${Math.sqrt(varA).toFixed(2)} vs ${Math.sqrt(varB).toFixed(2)}` }
        ],
        chartData: [
          { name: 'Group A Mean', value: Math.round(meanA) },
          { name: 'Group B Mean', value: Math.round(meanB) }
        ]
      };
    }
  },
  {
    id: 'v15-regression',
    name: 'Regression Calculator',
    slug: 'v15-regression-calculator',
    category: 'math',
    description: 'Calculate the line of best fit for a dataset using linear regression (Y = aX + b), tracking correlation vectors.',
    seoTitle: 'Linear Regression Line of Best Fit Calculator',
    seoDescription: 'Plot linear regression variables. Find slopes, intercepts, and correlation coefficients (R) for coordinate pairs.',
    inputs: [
      { id: 'xValues', label: 'X Coordinate values (independent)', type: 'text', defaultValue: '1, 2, 3, 4, 5' },
      { id: 'yValues', label: 'Y Coordinate values (dependent)', type: 'text', defaultValue: '5, 8, 11, 14, 17' }
    ],
    formula: 'Slope (a) = (N*Σxy - Σx*Σy) / (N*Σx^2 - (Σx)^2)\nIntercept (b) = (Σy - a*Σx) / N',
    explanation: 'Linear regression models the relationship between dependent and independent coordinates, helping you project trends based on historical data.',
    example: 'For coordinates X [1, 2, 3, 4, 5] and Y [5, 8, 11, 14, 17], individual coordinates align perfectly on the regression line: Y = 3.00X + 2.00, with a correlation (R) of 1.00.',
    faq: [
      { question: 'What does R-squared measure?', answer: 'The statistical proportion of variance in the dependent variable that is predictable from the independent model.' },
      { question: 'Why does correlation not prove causation?', answer: 'Two variables can move together due to a third confounding variable, rather than one causing the other.' }
    ],
    relatedSlugs: ['v15-trend-calculator', 'v15-data-comparison-calculator'],
    calculate: (inputs) => {
      const xs = (inputs.xValues || '1,2,3,4,5').split(',').map(Number);
      const ys = (inputs.yValues || '5,8,11,14,17').split(',').map(Number);

      const n = Math.min(xs.length, ys.length);

      if (n < 2) {
        return {
          results: [{ label: 'Line Coordinates', value: 'Requires at least 2 coordinate pairs', isPrimary: true }]
        };
      }

      let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0, sumYY = 0;
      for (let i = 0; i < n; i++) {
        sumX += xs[i];
        sumY += ys[i];
        sumXY += xs[i] * ys[i];
        sumXX += xs[i] * xs[i];
        sumYY += ys[i] * ys[i];
      }

      const denom = (n * sumXX) - (sumX * sumX);
      const slope = denom !== 0 ? ((n * sumXY) - (sumX * sumY)) / denom : 0;
      const intercept = (sumY - (slope * sumX)) / n;

      return {
        results: [
          { label: 'Linear Fit Formula', value: `Y = ${slope.toFixed(2)} * X + ${intercept.toFixed(2)}`, isPrimary: true },
          { label: 'Calculated Slope (Value "a")', value: slope.toFixed(4) },
          { label: 'Y-Intercept (Value "b")', value: intercept.toFixed(4) }
        ],
        chartData: xs.map((x, idx) => ({ name: `Pt ${x}`, value: ys[idx] }))
      };
    }
  },
  {
    id: 'v15-trend',
    name: 'Trend Calculator',
    slug: 'v15-trend-calculator',
    category: 'math',
    description: 'Calculate average percentage trend changes across chronological periods to project future developments.',
    seoTitle: 'Chronological Trend Rate & Projection Solver',
    seoDescription: 'Analyze business or statistical trend rates. Compare time periods side-by-side to find compounding compound growth metrics.',
    inputs: [
      { id: 'initialVal', label: 'Starting Metric Value', type: 'number', defaultValue: 1500 },
      { id: 'finalVal', label: 'Ending Metric Value', type: 'number', defaultValue: 3000 },
      { id: 'periodsCount', label: 'Time Periods Count (e.g., Years)', type: 'number', defaultValue: 5 }
    ],
    formula: 'Trend Percentage Increase = ((Ending - Starting) / Starting) * 100\nCompounded Rate = (Ending / Starting) ^ (1 / Periods) - 1',
    explanation: 'Identifying average compound trend changes helps you forecast inventory needs, user acquisition, and overall business growth.',
    example: 'Growing from a starting value of 1,500 to 3,000 over 5 years represents an overall trend increase of 100.00%, growing at a compound rate of 14.87% per year.',
    faq: [
      { question: 'What is the main advantage of trend rates?', answer: 'Weighted compound trend rates smooth out short-term fluctuations, highlighting the long-term direction of your data.' },
      { question: 'Can trends predict unexpected market events?', answer: 'No, trends rely entirely on historical data and cannot anticipate sudden systemic shifts or black swan events.' }
    ],
    relatedSlugs: ['v15-regression-calculator', 'v15-average-advanced-calculator'],
    calculate: (inputs) => {
      const init = Number(inputs.initialVal || 1);
      const fin = Number(inputs.finalVal || 1);
      const p = Number(inputs.periodsCount || 1);

      const totalShift = ((fin - init) / init) * 100;
      const cagr = (Math.pow(fin / init, 1 / p) - 1) * 100;

      return {
        results: [
          { label: 'Compound Period Trend Rate', value: `${cagr.toFixed(2)}% per period`, isPrimary: true },
          { label: 'Overall Percent Shift', value: `${totalShift.toFixed(2)}%` },
          { label: 'Absolute Growth Yield', value: (fin - init).toLocaleString() }
        ],
        chartData: [
          { name: 'Start', value: init },
          { name: 'Terminal', value: fin }
        ]
      };
    }
  }
];
