import { Calculator } from '../types';

export const V13_EDUCATION_MATH_STATS_CALCULATORS: Calculator[] = [
  {
    id: 'grade-improvement',
    name: 'Grade Improvement Calculator',
    slug: 'grade-improvement-calculator',
    category: 'education',
    description: 'Calculate the minimum scores required on future assignments to raise your overall course grade to a target level.',
    seoTitle: 'Grade Improvement & Syllabus Target Calculator',
    seoDescription: 'Forecast the results required on remaining syllabus weights to improve grades to an A, B, or C.',
    inputs: [
      { id: 'current', label: 'Current Grade (%)', type: 'number', defaultValue: 72, min: 0, max: 100 },
      { id: 'completed', label: 'completed Syllabus weight (%)', type: 'number', defaultValue: 60, min: 1, max: 99 },
      { id: 'target', label: 'Target Final Grade (%)', type: 'number', defaultValue: 80, min: 0, max: 100 }
    ],
    formula: 'Required future score = [Target - Current * (Completed / 100)] / [(100 - Completed) / 100]',
    explanation: 'See how future tests and assignments can raise your grade based on their weights, and calculate what scores you need to hit your target.',
    example: 'Having 72% over 60% of syllabus weight requires average scores of 92.00% on the remaining 40% of assignments to reach an 80% final grade.',
    faq: [
      { question: 'What if the required score is over 100%?', answer: 'This suggests your target is mathematically unattainable without extra credit, as the remaining weights are too light to pull up your current score.' }
    ],
    relatedSlugs: ['target-grade-calculator', 'academic-planner-calculator'],
    keywords: ['grade recovery calculator', 'syllabus weights calculator', 'final exam target grade'],
    calculate: (inputs) => {
      const cur = Number(inputs.current || 72);
      const compl = Number(inputs.completed || 60);
      const tgt = Number(inputs.target || 80);

      const remainingWeight = 100 - compl;
      const curWeighted = cur * (compl / 100);
      const reqWeighted = tgt - curWeighted;
      const reqScore = (reqWeighted / (remainingWeight / 100));

      return {
        results: [
          { label: 'Required Future average', value: reqScore > 100 ? 'Mathematically Impossible (>100%)' : reqScore < 0 ? '0% (Goal Achieved!)' : `${reqScore.toFixed(1)}%`, isPrimary: true },
          { label: 'Sill Active Weight Remaining', value: `${remainingWeight}%` },
          { label: 'Core Grade Contributed Already', value: `${curWeighted.toFixed(1)}% / ${tgt}%` }
        ],
        chartData: [
          { name: 'Current Weighted Score %', value: Math.round(curWeighted) },
          { name: 'Future Needed %', value: Math.round(Math.max(0, reqWeighted)) }
        ]
      };
    }
  },
  {
    id: 'target-grade',
    name: 'Target Grade Calculator',
    slug: 'target-grade-calculator',
    category: 'education',
    description: 'Calculate the specific score required on a final exam to achieve your target overall course grade.',
    seoTitle: 'Final Exam Target Grade Calculator',
    seoDescription: 'Find the score you need on your final exam to achieve an A, B, or C in your course.',
    inputs: [
      { id: 'current', label: 'Current Class Grade (%)', type: 'number', defaultValue: 82 },
      { id: 'target', label: 'Desired Class Grade Goal (%)', type: 'number', defaultValue: 85 },
      { id: 'finalWeight', label: 'Final Exam Weight (%)', type: 'number', defaultValue: 20 }
    ],
    formula: 'Required Final Exam Score = [Target - (Current * (100 - Weight)/100)] / (Weight / 100)',
    explanation: 'Uses the weight of your upcoming final exam to calculate the exact score required to reach your target course grade.',
    example: 'An 82% current grade with a 20% final exam weight requires a 97.00% on the final to achieve an 85% overall course grade.',
    faq: [
      { question: 'What is a weighted final exam?', answer: 'It is an exam whose score represents a fixed percentage of your entire course grade, regardless of the individual points on the exam itself.' }
    ],
    relatedSlugs: ['grade-improvement-calculator', 'academic-planner-calculator'],
    keywords: ['final exam requirements', 'syllabus grade helper', 'grade threshold targets'],
    calculate: (inputs) => {
      const cur = Number(inputs.current || 82);
      const tgt = Number(inputs.target || 85);
      const wt = Number(inputs.finalWeight || 20);

      const baseWeight = 100 - wt;
      const req = (tgt - (cur * (baseWeight / 100))) / (wt / 100);

      return {
        results: [
          { label: 'Required Final Exam Score', value: req > 100 ? `Mathematically Unachieveable (${req.toFixed(1)}% needed)` : req < 0 ? '0% (Already Achieved)' : `${req.toFixed(1)}%`, isPrimary: true },
          { label: 'Current Contribution (80%)', value: `${(cur * (baseWeight / 100)).toFixed(1)}%` }
        ],
        chartData: [
          { name: 'Current Contribution', value: Math.round(cur * (baseWeight / 100)) },
          { name: 'Final Exam Target Weight', value: wt }
        ]
      };
    }
  },
  {
    id: 'academic-planner',
    name: 'Academic Planner Calculator',
    slug: 'academic-planner-calculator',
    category: 'education',
    description: 'Calculate GPA results over multiple terms based on target grades and course weights.',
    seoTitle: 'Academic Planner & Multi-Term GPA Calculator',
    seoDescription: 'Obtain projected GPAs across semesters by mapping out planned course credits and target grades.',
    inputs: [
      { id: 'currGpa', label: 'Current Cumulative GPA', type: 'number', defaultValue: 3.2, min: 0, max: 4.0, step: 0.01 },
      { id: 'currCredits', label: 'Completed Credits', type: 'number', defaultValue: 45 },
      { id: 'newCredits', label: 'Planned Semester Credits', type: 'number', defaultValue: 15 },
      { id: 'targetSemesterGpa', label: 'Target Semester GPA', type: 'number', defaultValue: 3.8, min: 0, max: 4.0, step: 0.01 }
    ],
    formula: 'New Cumulative GPA = (CurrGpa * CurrCredits + TargetSemGpa * NewCredits) / (CurrCredits + NewCredits)',
    explanation: 'Track how your upcoming semester grades will affect your overall cumulative GPA to plan of study and scholarship benchmarks.',
    example: 'A student with a 3.2 GPA over 45 credits can raise their cumulative GPA to 3.35 by earning a 3.8 GPA in their next 15-credit semester.',
    faq: [
      { question: 'What is a credit hour?', answer: 'A credit hour is a measure of weekly classroom commitment, where standard university courses typically represent 3 to 4 credits.' }
    ],
    relatedSlugs: ['grade-improvement-calculator', 'study-hours-calculator'],
    keywords: ['cumulative GPA projection', 'semester credits mapping', 'academic grade planner'],
    calculate: (inputs) => {
      const curGPA = Number(inputs.currGpa || 3.2);
      const curCred = Number(inputs.currCredits || 45);
      const newCred = Number(inputs.newCredits || 15);
      const semGPA = Number(inputs.targetSemesterGpa || 3.8);

      const totalCred = curCred + newCred;
      const finalGPA = totalCred > 0 ? ((curGPA * curCred) + (semGPA * newCred)) / totalCred : 0;

      return {
        results: [
          { label: 'Projected Cumulative GPA', value: finalGPA.toFixed(3), isPrimary: true },
          { label: 'Total Credits Accrued', value: totalCred.toString() }
        ],
        chartData: [
          { name: 'Baseline GPA', value: Math.round(curGPA * 10) },
          { name: 'Projected GPA', value: Math.round(finalGPA * 10) }
        ]
      };
    }
  },
  {
    id: 'study-hours',
    name: 'Study Hours Calculator',
    slug: 'study-hours-calculator',
    category: 'education',
    description: 'Calculate suggested weekly study hours based on course difficulty and credit loads.',
    seoTitle: 'Recommended Study Hours & Homework Planner',
    seoDescription: 'Determine study hours based on your college course load and course difficulty levels.',
    inputs: [
      { id: 'credits', label: 'Total Semester Credits Enrolled', type: 'number', defaultValue: 15 },
      { id: 'difficulty', label: 'Average Course Difficulty', type: 'select', defaultValue: 'moderate', options: [{ label: 'Low Difficulty (1-2 ratio)', value: 'easy' }, { label: 'Moderate Difficulty (2-3 ratio)', value: 'moderate' }, { label: 'High Difficulty (3-4 ratio)', value: 'hard' }] }
    ],
    formula: 'Study Hours = Semester Credits * Difficulty Factor (2 for easy, 3 for moderate, 4 for hard)',
    explanation: 'Institutions typically recommend studying 2 to 3 hours outside of class for every enrolled credit. Highly technical classes can increase this requirement.',
    example: 'A student taking 15 credits with moderate difficulty should dedicate approximately 30 to 45 hours weekly to study and homework.',
    faq: [
      { question: 'What is the Carnegie Unit guideline?', answer: 'The historical standard where 1 credit hour equals 1 hour of lecture plus 2 hours of home study weekly.' }
    ],
    relatedSlugs: ['academic-planner-calculator', 'grade-improvement-calculator'],
    keywords: ['credit study hour ratio', 'weekly tuition schedule', 'homework planner helper'],
    calculate: (inputs) => {
      const cred = Number(inputs.credits || 15);
      const diff = inputs.difficulty || 'moderate';

      let multiplier = 3;
      if (diff === 'easy') multiplier = 2;
      else if (diff === 'hard') multiplier = 4;

      const totalStudy = cred * multiplier;
      const dailyStudy = totalStudy / 7;

      return {
        results: [
          { label: 'Recommended Weekly Study', value: `${totalStudy}`, unit: 'Hours', isPrimary: true },
          { label: 'Daily Study Commitment', value: `${dailyStudy.toFixed(1)} Hours/Day` }
        ],
        chartData: [
          { name: 'In-Class Lectures', value: cred },
          { name: 'Self Study Hours', value: totalStudy }
        ]
      };
    }
  },
  {
    id: 'mixed-fraction',
    name: 'Mixed Fraction Calculator',
    slug: 'mixed-fraction-calculator',
    category: 'math',
    description: 'Convert mixed numbers to improper fractions, and simplify fractional operations.',
    seoTitle: 'Mixed Number & Improper Fraction Simplifier',
    seoDescription: 'Solve mixed division fractions and convert values to improper numerators.',
    inputs: [
      { id: 'whole', label: 'Mixed Whole Number', type: 'number', defaultValue: 2 },
      { id: 'num', label: 'Numerator', type: 'number', defaultValue: 3 },
      { id: 'den', label: 'Denominator', type: 'number', defaultValue: 4, min: 1 }
    ],
    formula: 'Improper Numerator = (Whole * Denominator) + Numerator',
    explanation: 'A mixed number consists of a whole number paired with a proper fraction. Converting to an improper fraction places the entire value over a single denominator, simplifying calculations.',
    example: 'A mixed number of 2 3/4 converts to the improper fraction 11/4 (2 * 4 + 3 = 11).',
    faq: [
      { question: 'What is an improper fraction?', answer: 'A fraction where the numerator is greater than or equal to the denominator, representing a value greater than or equal to 1.' }
    ],
    relatedSlugs: ['prime-number-calculator', 'lcm-calculator'],
    keywords: ['mixed fractions conversion', 'improper fractions solver', 'school fractions simplifier'],
    calculate: (inputs) => {
      const w = Number(inputs.whole || 2);
      const n = Number(inputs.num || 3);
      const d = Math.max(1, Number(inputs.den || 4));

      const improperNum = (w * d) + n;
      const decimalVal = w + (n / d);

      return {
        results: [
          { label: 'Improper Fraction Equivalent', value: `${improperNum} / ${d}`, isPrimary: true },
          { label: 'Decimal Conversion Price', value: decimalVal.toFixed(4) }
        ],
        chartData: [
          { name: 'Whole Part', value: w },
          { name: 'Numerator Part', value: n },
          { name: 'Denominator Part', value: d }
        ]
      };
    }
  },
  {
    id: 'prime-number',
    name: 'Prime Number Calculator',
    slug: 'prime-number-calculator',
    category: 'math',
    description: 'Determine if a selected value is a prime number and identify its nearest prime neighbors.',
    seoTitle: 'Prime Number Test & Prime Factorization Classifier',
    seoDescription: 'Find nearest prime neighbors and run prime checks on any integer.',
    inputs: [
      { id: 'number', label: 'Target Integer', type: 'number', defaultValue: 97, min: 1, max: 10000000 }
    ],
    formula: 'Checks indivisibility up to the square root of the target integer.',
    explanation: 'Prime numbers are fundamental mathematical building blocks that are divisible only by 1 and themselves.',
    example: '97 is a prime number, as it has no divisors other than 1 and 97.',
    faq: [
      { question: 'Is 1 prime?', answer: 'No. By definition, prime numbers must be integers greater than 1 with exactly two positive divisors.' }
    ],
    relatedSlugs: ['lcm-calculator', 'gcd-calculator'],
    keywords: ['prime test integer solver', 'prime numbers checker', 'factorization divisors finder'],
    calculate: (inputs) => {
      const num = Math.floor(Math.max(1, Number(inputs.number || 97)));

      const isPrime = (n: number) => {
        if (n <= 1) return false;
        if (n <= 3) return true;
        if (n % 2 === 0 || n % 3 === 0) return false;
        for (let i = 5; i * i <= n; i += 6) {
          if (n % i === 0 || n % (i + 2) === 0) return false;
        }
        return true;
      };

      const status = isPrime(num) ? 'Prime Number!' : 'Composite Number (Not Prime)';

      // Finding next prime
      let nextPrime = num + 1;
      while (!isPrime(nextPrime)) {
        nextPrime++;
      }

      return {
        results: [
          { label: 'Prime Status', value: status, isPrimary: true },
          { label: 'Next Prime Number', value: nextPrime.toString() }
        ],
        chartData: [
          { name: 'Target Integer', value: num },
          { name: 'Next Prime Metric', value: nextPrime }
        ]
      };
    }
  },
  {
    id: 'lcm-calculator',
    name: 'LCM Calculator',
    slug: 'lcm-calculator',
    category: 'math',
    description: 'Calculate the Least Common Multiple (LCM) for up to three numbers.',
    seoTitle: 'Least Common Multiple (LCM) Math Calculator',
    seoDescription: 'Obtain the smallest common division multiple for any pair or triplet of values.',
    inputs: [
      { id: 'num1', label: 'Integer A', type: 'number', defaultValue: 12 },
      { id: 'num2', label: 'Integer B', type: 'number', defaultValue: 18 },
      { id: 'num3', label: 'Integer C (Optional, 1 to ignore)', type: 'number', defaultValue: 1 }
    ],
    formula: 'LCM(a, b) = |a * b| / GCD(a, b)',
    explanation: 'The Least Common Multiple (LCM) is the smallest positive integer that is divisible by all numbers in a given set.',
    example: 'The Least Common Multiple of 12 and 18 is 36.',
    faq: [
      { question: 'How is LCM used in real life?', answer: 'LCM helps solve scheduling intervals, coordinate events, and find common denominators to add fractions.' }
    ],
    relatedSlugs: ['gcd-calculator', 'prime-number-calculator'],
    keywords: ['least common division multiplier', 'fraction common base common', 'lcm math helper'],
    calculate: (inputs) => {
      const a = Math.abs(Math.floor(Number(inputs.num1 || 12)));
      const b = Math.abs(Math.floor(Number(inputs.num2 || 18)));
      const c = Math.abs(Math.floor(Number(inputs.num3 || 1)));

      // GCD function
      const gcd = (x: number, y: number): number => {
        while (y !== 0) {
          const t = y;
          y = x % y;
          x = t;
        }
        return x;
      };

      const lcm = (x: number, y: number) => {
        if (x === 0 || y === 0) return 0;
        return (x * y) / gcd(x, y);
      };

      const resBase = lcm(a, b);
      const resC = c > 1 ? lcm(resBase, c) : resBase;

      return {
        results: [
          { label: 'Least Common Multiple (LCM)', value: resC.toString(), isPrimary: true },
          { label: 'A-B GCD Basis', value: gcd(a, b).toString() }
        ],
        chartData: [
          { name: 'Val A', value: a },
          { name: 'Val B', value: b },
          { name: 'LCM Output', value: resC }
        ]
      };
    }
  },
  {
    id: 'gcd-calculator',
    name: 'GCD Calculator',
    slug: 'gcd-calculator',
    category: 'math',
    description: 'Calculate the Greatest Common Divisor (GCD) for up to three numbers.',
    seoTitle: 'Greatest Common Divisor (GCD) Math Solver',
    seoDescription: 'Find the largest common divisor (GCD) for any pair or triplet of integers.',
    inputs: [
      { id: 'num1', label: 'Integer A', type: 'number', defaultValue: 24 },
      { id: 'num2', label: 'Integer B', type: 'number', defaultValue: 36 },
      { id: 'num3', label: 'Integer C (Optional, 0 to ignore)', type: 'number', defaultValue: 0 }
    ],
    formula: 'Euclidean Algorithm: GCD(a, b) = GCD(b, a % b)',
    explanation: 'The Greatest Common Divisor (GCD) is the largest positive integer that divides all numbers in a given set without leaving a remainder.',
    example: 'The Greatest Common Divisor of 24 and 36 is 12.',
    faq: [
      { question: 'What is another name for GCD?', answer: 'Greatest Common Factor (GCF) or Highest Common Factor (HCF).' }
    ],
    relatedSlugs: ['lcm-calculator', 'prime-number-calculator'],
    keywords: ['greatest common factor gcf', 'euclidean division divisor', 'highest common factor hcf'],
    calculate: (inputs) => {
      const a = Math.abs(Math.floor(Number(inputs.num1 || 24)));
      const b = Math.abs(Math.floor(Number(inputs.num2 || 36)));
      const c = Math.abs(Math.floor(inputs.num3 || 0));

      const gcd = (x: number, y: number): number => {
        while (y !== 0) {
          const t = y;
          y = x % y;
          x = t;
        }
        return x;
      };

      const resBase = gcd(a, b);
      const resC = c > 0 ? gcd(resBase, c) : resBase;

      return {
        results: [
          { label: 'Greatest Common Divisor (GCD)', value: resC.toString(), isPrimary: true },
          { label: 'Common Divisors Base', value: resC.toString() }
        ],
        chartData: [
          { name: 'Val A', value: a },
          { name: 'Val B', value: b },
          { name: 'GCD Output', value: resC }
        ]
      };
    }
  },
  {
    id: 'weighted-mean',
    name: 'Weighted Mean Calculator',
    slug: 'weighted-mean-calculator',
    category: 'math',
    description: 'Calculate weighted average statistics based on assigned proportional weights and values.',
    seoTitle: 'Weighted Mean Average Math Solver',
    seoDescription: 'Input target grades, investments, or sample subsets with weights to find the true weighted mean.',
    inputs: [
      { id: 'val1', label: 'Value A', type: 'number', defaultValue: 85 },
      { id: 'wt1', label: 'Weight A (%)', type: 'number', defaultValue: 30 },
      { id: 'val2', label: 'Value B', type: 'number', defaultValue: 92 },
      { id: 'wt2', label: 'Weight B (%)', type: 'number', defaultValue: 50 },
      { id: 'val3', label: 'Value C', type: 'number', defaultValue: 78 },
      { id: 'wt3', label: 'Weight C (%)', type: 'number', defaultValue: 20 }
    ],
    formula: 'Weighted Mean = Σ(Value * Weight) / Σ(Weights)',
    explanation: 'A weighted mean accounts for the varying importance of different items in a dataset by scaling them based on assigned proportional weights.',
    example: 'Earning 85 (30% weight), 92 (50% weight), and 78 (20% weight) yields a weighted mean of 87.10.',
    faq: [
      { question: 'How is weighted mean used in finance?', answer: 'It is used to calculate weighted average costs of capital, portfolio returns, and inventory costs.' }
    ],
    relatedSlugs: ['quartile-calculator', 'percentile-calculator'],
    keywords: ['weighted mean average solver', 'grades average system', 'proportional distribution metrics'],
    calculate: (inputs) => {
      const v1 = Number(inputs.val1 || 85);
      const w1 = Number(inputs.wt1 || 30);
      const v2 = Number(inputs.val2 || 92);
      const w2 = Number(inputs.wt2 || 50);
      const v3 = Number(inputs.val3 || 78);
      const w3 = Number(inputs.wt3 || 20);

      const totalWeight = w1 + w2 + w3;
      const weightedSum = (v1 * w1) + (v2 * w2) + (v3 * w3);
      const wMean = totalWeight > 0 ? weightedSum / totalWeight : 0;

      return {
        results: [
          { label: 'Weighted Mean Average', value: wMean.toFixed(2), isPrimary: true },
          { label: 'Sum of All Proportions', value: totalWeight.toString() }
        ],
        chartData: [
          { name: 'Item A Contribution', value: Math.round(v1 * (w1 / totalWeight)) },
          { name: 'Item B Contribution', value: Math.round(v2 * (w2 / totalWeight)) },
          { name: 'Item C Contribution', value: Math.round(v3 * (w3 / totalWeight)) }
        ]
      };
    }
  },
  {
    id: 'quartile-calculator',
    name: 'Quartile Calculator',
    slug: 'quartile-calculator',
    category: 'math',
    description: 'Find the first, second (median), and third quartiles of a comma-separated dataset.',
    seoTitle: 'Datasets Quartiles (Q1, Q2, Q3) Statistics Calculator',
    seoDescription: 'Identify the 25th, 50th, and 75th percentile quartiles for any dataset.',
    inputs: [
      { id: 'dataset', label: 'Dataset (Comma-Separated Real Numbers)', type: 'text', defaultValue: '12, 15, 23, 24, 31, 35, 41, 48' }
    ],
    formula: 'Q1 = 25th Percentile | Q2 = Median (50th) | Q3 = 75th Percentile',
    explanation: 'Quartiles divide a sorted dataset into four equal parts to analyze data distribution and identify outliers.',
    example: 'For the dataset {12, 15, 23, 24, 31, 35, 41, 48}, the median is 27.5, Q1 is 19.0, and Q3 is 38.0.',
    faq: [
      { question: 'What is the Interquartile Range (IQR)?', answer: 'IQR is computed as Q3 - Q1, representing the middle 50% of your data.' }
    ],
    relatedSlugs: ['percentile-calculator', 'weighted-mean-calculator'],
    keywords: ['quartiles divisions finder', 'dataset median boundaries', 'interquartile bounds tracker'],
    calculate: (inputs) => {
      const text = inputs.dataset || '12, 15, 23, 24, 31, 35, 41, 48';
      const arr = text.split(',')
                      .map((val: string) => Number(val.trim()))
                      .filter((val: number) => !isNaN(val))
                      .sort((v_x: number, v_y: number) => v_x - v_y);

      if (arr.length === 0) {
        return { results: [{ label: 'Error', value: 'Invalid Dataset' }] };
      }

      const getMed = (sub: number[]) => {
        const len = sub.length;
        if (len === 0) return 0;
        const mid = Math.floor(len / 2);
        return len % 2 === 0 ? (sub[mid - 1] + sub[mid]) / 2 : sub[mid];
      };

      const q2 = getMed(arr);
      const midIdx = Math.floor(arr.length / 2);
      const lowerHalf = arr.slice(0, midIdx);
      const upperHalf = arr.length % 2 === 0 ? arr.slice(midIdx) : arr.slice(midIdx + 1);

      const q1 = getMed(lowerHalf);
      const q3 = getMed(upperHalf);

      return {
        results: [
          { label: 'First Quartile (Q1 - 25th)', value: q1.toFixed(1) },
          { label: 'Second Quartile (Q2 - Median)', value: q2.toFixed(1), isPrimary: true },
          { label: 'Third Quartile (Q3 - 75th)', value: q3.toFixed(1) },
          { label: 'Interquartile Range (IQR)', value: (q3 - q1).toFixed(1) }
        ],
        chartData: [
          { name: 'Q1 Bottom Edge', value: Math.round(q1) },
          { name: 'Median Line', value: Math.round(q2) },
          { name: 'Q3 High Roof', value: Math.round(q3) }
        ]
      };
    }
  },
  {
    id: 'percentile-calculator',
    name: 'Percentile Calculator',
    slug: 'percentile-calculator',
    category: 'math',
    description: 'Calculate specific percentile ranks or find values corresponding to a target percentile in a custom dataset.',
    seoTitle: 'Dynamic Percentile Ranks & Dataset Math Solver',
    seoDescription: 'Obtain percentile positions and identify ranks corresponding to target percentiles in your data.',
    inputs: [
      { id: 'dataset', label: 'Dataset (Comma-Separated Numbers)', type: 'text', defaultValue: '5, 8, 12, 15, 20, 24, 28, 30, 35, 40' },
      { id: 'percentile', label: 'Target Percentile (P%)', type: 'number', defaultValue: 90, min: 1, max: 99 }
    ],
    formula: 'Index n = (P / 100) * (N - 1) + 1\nInterpolate values based on rank indexing scores.',
    explanation: 'A percentile represents the value below which a given percentage of data falls.',
    example: 'In the dataset {5, 8, 12, 15, 20, 24, 28, 30, 35, 40}, the 90th percentile is 35.5 (90% of values fall below this point).',
    faq: [
      { question: 'What is the percentile rank?', answer: 'The percentage of values in a dataset that are equal to or lower than a given score.' }
    ],
    relatedSlugs: ['quartile-calculator', 'weighted-mean-calculator'],
    keywords: ['percentile value seeker', 'data point distribution', 'quantiles statistics calculator'],
    calculate: (inputs) => {
      const text = inputs.dataset || '5, 8, 12, 15, 20, 24, 28, 30, 35, 40';
      const pctVal = Number(inputs.percentile || 90) / 100;

      const arr = text.split(',')
                      .map((val: string) => Number(val.trim()))
                      .filter((val: number) => !isNaN(val))
                      .sort((v_x: number, v_y: number) => v_x - v_y);

      if (arr.length === 0) {
        return { results: [{ label: 'Error', value: 'Empty Dataset' }] };
      }

      // Linear interpolation method
      const idx = pctVal * (arr.length - 1);
      const low = Math.floor(idx);
      const high = Math.ceil(idx);
      const remainder = idx - low;

      const resultVal = arr[low] + remainder * (arr[high] - arr[low]);

      return {
        results: [
          { label: 'Value at Target Percentile', value: resultVal.toFixed(2), isPrimary: true },
          { label: 'Calculated Index Position', value: idx.toFixed(2) },
          { label: 'Total Valid Data Items', value: arr.length.toString() }
        ],
        chartData: [
          { name: 'Dataset Min', value: arr[0] },
          { name: 'Percentile Value', value: Math.round(resultVal) },
          { name: 'Dataset Max', value: arr[arr.length - 1] }
        ]
      };
    }
  }
];
