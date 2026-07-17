import { Calculator } from '../types';

export const EDUCATION_CALCULATORS: Calculator[] = [
  {
    id: 'edu-gpa',
    name: 'GPA Calculator',
    slug: 'gpa-calculator',
    category: 'education',
    description: 'Calculate weighted and unweighted GPA, plan future semesters, simulate grades, and export reports.',
    seoTitle: 'GPA Calculator | Calculatoora',
    seoDescription: 'The world\'s most advanced GPA Calculator. Compute weighted/unweighted cumulative averages, convert grade scales, and plan your GPA goals.',
    inputs: [
      { id: 'grades', label: 'Alphabet Grades list (Comma Separated)', type: 'text', defaultValue: 'A, B, A, C' },
      { id: 'credits', label: 'Credit Hours list (Corresponding order)', type: 'text', defaultValue: '3, 4, 3, 3' }
    ],
    formula: 'GPA = Sum of (Subject Grade Points * Credit Hours) / Total Credit Hours',
    explanation: 'Grade Point Average (GPA) evaluates student performance on a standardized 4.0 scale, weighting courses by credit hours.',
    example: 'Grades of A(4.0), B(3.0), A(4.0), and C(2.0) for courses of 3, 4, 3, and 3 credit hours yield a GPA of 3.23.',
    faq: [
      { question: 'What are the standard 4.0 grade points?', answer: 'A = 4.0, B = 3.0, C = 2.0, D = 1.0, F = 0.0 points under global standard policies.' }
    ],
    relatedSlugs: ['cgpa-calculator', 'grade-calculator'],
    calculate: (inputs) => {
      const rawG = inputs.grades || 'A, B, A, C';
      const rawC = inputs.credits || '3, 4, 3, 3';

      const grades = rawG.split(',').map(s => s.trim().toUpperCase());
      const credits = rawC.split(',').map(s => Number(s.trim())).filter(n => !isNaN(n) && n > 0);

      const len = Math.min(grades.length, credits.length);

      if (len === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter matching grades and credits lists.', isPrimary: true }]
        };
      }

      const mapPoint: Record<string, number> = {
        'A+': 4.0, 'A': 4.0, 'A-': 3.7,
        'B+': 3.3, 'B': 3.0, 'B-': 2.7,
        'C+': 2.3, 'C': 2.0, 'C-': 1.7,
        'D+': 1.3, 'D': 1.0, 'F': 0.0
      };

      let sumPoints = 0;
      let totalCr = 0;

      for (let i = 0; i < len; i++) {
        const grade = grades[i];
        const credit = credits[i];
        const gPt = mapPoint[grade] !== undefined ? mapPoint[grade] : 3.0; // default B
        sumPoints += gPt * credit;
        totalCr += credit;
      }

      const gpa = totalCr > 0 ? sumPoints / totalCr : 3.0;

      return {
        results: [
          { label: 'Semester GPA Index', value: gpa.toFixed(2), unit: 'GPA', isPrimary: true },
          { label: 'Counted Semester Credits', value: totalCr, unit: 'Credits' }
        ],
        chartData: [
          { name: 'Scored points', value: Number(gpa.toFixed(2)), color: '#39FF14' },
          { name: 'Unearned points', value: Number((4 - gpa).toFixed(2)), color: '#1e293b' }
        ]
      };
    }
  },
  {
    id: 'edu-cgpa',
    name: 'CGPA Cumulative Calculator',
    slug: 'cgpa-calculator',
    category: 'education',
    description: 'Calculate your Cumulative GPA using historical semester averages and total credits earned.',
    seoTitle: 'Cumulative CGPA Academic Solver | Calculatoora',
    seoDescription: 'Obtain precise cumulative study scores by weighted GPA merging methods.',
    inputs: [
      { id: 'prevCgpa', label: 'Prior Cumulative CGPA', type: 'number', defaultValue: 3.4 },
      { id: 'prevCredits', label: 'Prior Cumulative Credits Earned', type: 'number', defaultValue: 60 },
      { id: 'currGpa', label: 'Current Semester GPA', type: 'number', defaultValue: 3.8 },
      { id: 'currCredits', label: 'Current Semester Credits', type: 'number', defaultValue: 15 }
    ],
    formula: 'CGPA = ( (Prior CGPA * Prior Credits) + (Current GPA * Current Credits) ) / Total Credits',
    explanation: 'CGPA weights all grades earned over years, using cumulative credits to calculate a weighted lifetime academic average.',
    example: 'A student with a 3.4 CGPA over 60 credits who earns a 3.8 GPA over 15 credits this semester raises their overall CGPA to 3.48.',
    faq: [
      { question: 'Why does CGPA change slowly over time?', answer: 'As you earn more credits, each individual semester carries a smaller relative weight, making the cumulative average more stable.' }
    ],
    relatedSlugs: ['gpa-calculator', 'grade-calculator'],
    calculate: (inputs) => {
      const pCg = Number(inputs.prevCgpa) || 3.0;
      const pCr = Number(inputs.prevCredits) || 30;
      const cGp = Number(inputs.currGpa) || 3.0;
      const cCr = Number(inputs.currCredits) || 12;

      const totalCredits = pCr + cCr;
      const finalCg = totalCredits > 0 ? ((pCg * pCr) + (cGp * cCr)) / totalCredits : 3.0;

      return {
        results: [
          { label: 'Cumulative Academic CGPA', value: finalCg.toFixed(2), unit: 'index', isPrimary: true },
          { label: 'Earned Lifetime Credits', value: totalCredits, unit: 'Credits' }
        ]
      };
    }
  },
  {
    id: 'edu-grade',
    name: 'Alphabet Grade Solver',
    slug: 'grade-calculator',
    category: 'education',
    description: 'Convert percentage scores into standard alphabetical high school or university grades.',
    seoTitle: 'Percentage Grade to Letter Converter | Calculatoora',
    seoDescription: 'Input exam scores to map letters.',
    inputs: [
      { id: 'percent', label: 'Syllabus Score Percentage (%)', type: 'number', defaultValue: 86, min: 0, max: 100 }
    ],
    formula: 'A >= 90%, B >= 80%, C >= 70%, D >= 60%, F < 60%',
    explanation: 'Quickly map test raw numbers back onto letters with performance adjectives.',
    example: 'An 86% syllabus score converts to a Grade "B" - designated as Meritorious.',
    faq: [
      { question: 'Does a grade curve affect the score?', answer: 'Yes, scaled curves adjust numerical limits depending on class averages to normalize raw scores.' }
    ],
    relatedSlugs: ['gpa-calculator', 'exam-score-calculator'],
    calculate: (inputs) => {
      const pct = Number(inputs.percent) || 85;

      let l = 'F';
      let state = 'Did not scale';

      if (pct >= 90) {
        l = 'A';
        state = 'Excellent - High Mastery 🟢';
      } else if (pct >= 80) {
        l = 'B';
        state = 'Good - Competent performance 🟢';
      } else if (pct >= 70) {
        l = 'C';
        state = 'Satisfactory performance 🟡';
      } else if (pct >= 60) {
        l = 'D';
        state = 'Passing credit margin 🔴';
      } else {
        l = 'F';
        state = 'Failing credit - Seek tutoring support 🔴';
      }

      return {
        results: [
          { label: 'Resolved Letter Grade', value: l, isPrimary: true },
          { label: 'Status indicator', value: state }
        ]
      };
    }
  },
  {
    id: 'edu-exam-score',
    name: 'Simple Exam Score Calculator',
    slug: 'exam-score-calculator',
    category: 'education',
    description: 'Calculate grades and percentages from total questions and correct answers.',
    seoTitle: 'Exam Raw Test Percent Solver | Calculatoora',
    seoDescription: 'Calculate test score percentages based on correct answer counts.',
    inputs: [
      { id: 'total', label: 'Total Exam Questions', type: 'number', defaultValue: 50 },
      { id: 'correct', label: 'Correct Answers count', type: 'number', defaultValue: 43 }
    ],
    formula: 'Score % = (Correct Answers / Total Questions) * 100',
    explanation: 'Quickly calculate test scores when reviewing graded worksheets or homework.',
    example: 'Answering 43 of 50 questions correctly earns an 86.00% score.',
    faq: [
      { question: 'What if questions have unequal weight?', answer: 'Use weighted grading averages instead of simple counts if specific sections carry higher credit coefficients.' }
    ],
    relatedSlugs: ['grade-calculator', 'final-grade-calculator'],
    calculate: (inputs) => {
      const t = Number(inputs.total) || 10;
      const c = Number(inputs.correct) || 0;

      if (c > t) {
        return {
          results: [{ label: 'Error', value: 'Correct answers cannot exceed total questions.', isPrimary: true }]
        };
      }

      const pct = (c / t) * 100;

      return {
        results: [
          { label: 'Calculated Grade percentage', value: pct.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Count of Incorrect Answers', value: t - c }
        ],
        chartData: [
          { name: 'Correct answers', value: c, color: '#39FF14' },
          { name: 'Incorrect answers', value: t - c, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'edu-final-g',
    name: 'Final Grade Core Target Solver',
    slug: 'final-grade-calculator',
    category: 'education',
    description: 'Calculate the accurate exam score needed to achieve your target class grade, factoring in active weights.',
    seoTitle: 'Required Final Exam Grade Solver | Calculatoora',
    seoDescription: 'Obtain exact final exam scores required to secure your target target class grade.',
    inputs: [
      { id: 'current', label: 'Current Class Grade (%)', type: 'number', defaultValue: 78 },
      { id: 'target', label: 'Target Final Grade (%)', type: 'number', defaultValue: 82 },
      { id: 'weight', label: 'Final Exam Weight % of Overall Grade', type: 'number', defaultValue: 25, min: 1, max: 99 }
    ],
    formula: 'Required Score = [ Target - (Current * (1 - Weight/100)) ] / (Weight/100)',
    explanation: 'Final exams often carry high syllabus weights. This calculator calculates the exact score needed on your final to achieve your target overall grade.',
    example: 'Holding a 78% class grade, achieving an 82% overall grade with a 25% weighted final exam requires scoring at least 94% on the final.',
    faq: [
      { question: 'What if the required score exceeds 100%?', answer: 'Syllabus limits mean you cannot achieve your target grade unless the class offers extra credit opportunities.' }
    ],
    relatedSlugs: ['grade-calculator', 'exam-score-calculator'],
    calculate: (inputs) => {
      const c = Number(inputs.current) || 75;
      const tg = Number(inputs.target) || 80;
      const w = Number(inputs.weight) || 20;

      const scaleW = w / 100;
      const needed = (tg - (c * (1 - scaleW))) / scaleW;

      return {
        results: [
          { label: 'Required Final Exam Score', value: needed.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Possibility Status', value: needed > 100 ? 'Requires Extra Credit ⚠️' : needed <= 50 ? 'Low pressure opportunity' : 'Acheivable target' }
        ]
      };
    }
  },
  {
    id: 'edu-attendance',
    name: 'Class Attendance Tracker',
    slug: 'attendance-calculator',
    category: 'education',
    description: 'Calculate the minimum attendance rates required to maintain course enrollment eligibility.',
    seoTitle: 'Minimum Class Attendance Solver | Calculatoora',
    seoDescription: 'Calculate minimum course attendances to secure academic compliance limits.',
    inputs: [
      { id: 'totalClasses', label: 'Total Semester Classes', type: 'number', defaultValue: 45 },
      { id: 'requirement', label: 'Minimum Required Attendance Rate (%)', type: 'number', defaultValue: 80 },
      { id: 'absentCount', label: 'Number of Absences to date', type: 'number', defaultValue: 3 }
    ],
    formula: 'Allowed Absences = Total Classes * (1 - Requirement / 100) \nActive Rate = [ (Total - Absences) / Total ] * 100',
    explanation: 'Many academic institutions enforce mandatory attendance rules to maintain eligibility for year-end exams.',
    example: 'In a 45-class course requiring 80% attendance, you can miss up to 9 classes. With 3 absences to date, your active attendance rate is 93.3%.',
    faq: [
      { question: 'Does a medical note excuse absences?', answer: 'Typically yes, institutional administrators usually mark medical absences as excused, excluding them from calculations.' }
    ],
    relatedSlugs: ['study-time-calculator'],
    calculate: (inputs) => {
      const tc = Number(inputs.totalClasses) || 40;
      const req = Number(inputs.requirement) || 75;
      const ab = Number(inputs.absentCount) || 0;

      const activeRate = ((tc - ab) / tc) * 100;
      const allowedAbsences = Math.floor(tc * (1 - (req / 100)));
      const remainingAbsencesBuffer = allowedAbsences - ab;

      return {
        results: [
          { label: 'Active Attendance Rate', value: activeRate.toFixed(1), unit: '%', isPrimary: true },
          { label: 'Minimum compliance limit', value: req, unit: '%' },
          { label: 'Allowed Term Absences total', value: allowedAbsences },
          { label: 'Absence Buffer remaining', value: remainingAbsencesBuffer >= 0 ? remainingAbsencesBuffer : 0, unit: 'classes' }
        ],
        chartData: [
          { name: 'Classes Attended', value: tc - ab, color: '#39FF14' },
          { name: 'Absences', value: ab, color: '#ef4444' }
        ]
      };
    }
  },
  {
    id: 'edu-study-time',
    name: 'Study Time Planner',
    slug: 'study-time-calculator',
    category: 'education',
    description: 'Plan study time allocations using the classic 2:1 ratio for college course difficulty.',
    seoTitle: 'Course Credit Hours Study Planner | Calculatoora',
    seoDescription: 'Plan homework and study hours based on credit hours and class difficulty.',
    inputs: [
      { id: 'credits', label: 'Weekly Credit Hours', type: 'number', defaultValue: 15 },
      { id: 'difficulty', label: 'Course Difficulty Scale', type: 'select', defaultValue: 'custom', options: [
        { label: 'Standard study (2 hours per credit)', value: 'standard' },
        { label: 'Intense study (3 hours per credit)', value: 'custom' },
        { label: 'Light study (1 hour per credit)', value: 'easy' }
      ]}
    ],
    formula: 'Necessary Study Hours = Course Credit Hours * Study_Multiplier',
    explanation: 'Syllabus guidelines recommend dedicated out-of-class study time for each active course credit hour to ensure success.',
    example: 'A student taking 15 credits with intense courses requires approximately 45 hours of weekly study time.',
    faq: [
      { question: 'What is the pomodoro study technique?', answer: 'A time management system where you break your study day into 25-minute focus intervals followed by 5-minute active breaks.' }
    ],
    relatedSlugs: ['reading-time-calculator', 'attendance-calculator'],
    calculate: (inputs) => {
      const cr = Number(inputs.credits) || 12;
      const diff = inputs.difficulty || 'standard';

      let mult = 2;
      if (diff === 'custom') mult = 3;
      else if (diff === 'easy') mult = 1;

      const study = cr * mult;

      return {
        results: [
          { label: 'Recommended Studies Duration', value: study, unit: 'Hours/week', isPrimary: true },
          { label: 'Study hour per credit multiplier', value: mult }
        ]
      };
    }
  },
  {
    id: 'edu-read-time',
    name: 'Speed Reading Planner',
    slug: 'reading-time-calculator',
    category: 'education',
    description: 'Estimate the reading time required to finish book chapters based on page counts and reading speeds.',
    seoTitle: 'Book Page Speed Reading Planner | Calculatoora',
    seoDescription: 'Calculate reading times based on word counts and individual reading speeds.',
    inputs: [
      { id: 'pages', label: 'Remaining Book Pages', type: 'number', defaultValue: 35 },
      { id: 'words', label: 'Avg Words per Page', type: 'number', defaultValue: 250 },
      { id: 'wpm', label: 'Your Reading Speed (WPM)', type: 'select', defaultValue: '200', options: [
        { label: 'Slow Reader (150 WPM)', value: '150' },
        { label: 'Average Reader (200 WPM)', value: '200' },
        { label: 'Fast Reader (300 WPM)', value: '300' },
        { label: 'Speed Reader (500 WPM)', value: '500' }
      ]}
    ],
    formula: 'Total Words = Pages * Words_per_Page \nDuration (Minutes) = Total Words / WPM speed',
    explanation: 'Reading speeds vary. Evaluating page word counts allows you to schedule realistic reading blocks.',
    example: 'Reading a 35-page chapter averaging 250 words per page at a standard speed (200 WPM) takes approximately 43.75 minutes.',
    faq: [
      { question: 'What is a typical average human reading speed?', answer: 'Most adults read non-technical prose at approximately 200 to 250 words per minute (WPM).' }
    ],
    relatedSlugs: ['study-time-calculator'],
    calculate: (inputs) => {
      const p = Number(inputs.pages) || 10;
      const words = Number(inputs.words) || 250;
      const wpm = Number(inputs.wpm) || 200;

      const totalWords = p * words;
      const mins = totalWords / wpm;

      return {
        results: [
          { label: 'Estimated Reading Duration', value: mins.toFixed(1), unit: 'Minutes', isPrimary: true },
          { label: 'Calculated Overall Words count', value: totalWords }
        ]
      };
    }
  }
];
