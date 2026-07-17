import { Calculator } from '../types';

export const MATH_CALCULATORS: Calculator[] = [
  {
    id: 'calculus-calculator',
    name: 'Calculus Calculator',
    slug: 'calculus-calculator',
    category: 'math',
    description: "World's most advanced client-side Calculus Calculator. Solve derivatives, indefinite and definite integrals, limits, critical and inflection points, tangent or normal lines, Taylor series, and first-order differential equations with beautiful interactive graphs and rich step-by-step solvers.",
    seoTitle: 'Ultimate Calculus Calculator - Solve Derivatives & Integrals | Calculatoora',
    seoDescription: 'The ultimate client-side calculus calculator. Calculate symbolic derivatives, integrals, limits, Taylor series, optimization, tangent/normal lines, and first-order ODEs with detailed steps and live interactive graphs.',
    inputs: [],
    formula: "Fundamental differentiation rules, antiderivatives, Riemann Sums, Trapezoidal and Simpson's numerical integration rules, Taylor series expansion, Euler & Runge-Kutta 4th-order (RK4) differential equations.",
    explanation: 'Interactive client-side calculus application combining symbolic computation, numerical methods, and custom coordinate canvas plotting.',
    example: 'Click "Basic Derivative (Power Rule)" or "Definite Integral (Sine Wave)" presets above to load complex math expressions instantly.',
    faq: [
      { question: 'What operations does this calculus calculator support?', answer: 'It supports symbolic and numerical derivatives, limits, definite and indefinite integrals, arc length, area between curves, Taylor and Maclaurin expansions, optimization, and first-order differential equations.' },
      { question: 'Is a backend or internet connection needed?', answer: 'No, all symbolic parsing and mathematical evaluations occur 100% locally inside your web browser.' }
    ],
    relatedSlugs: ['scientific-calculator', 'graphing-calculator', 'statistics-calculator'],
    calculate: () => {
      return { results: [] };
    }
  },
  {
    id: 'statistics-calculator',
    name: 'Statistics Calculator',
    slug: 'statistics-calculator',
    category: 'math',
    description: 'Ultimate professional client-side statistics solver. Calculate descriptive metrics, confidence intervals, hypothesis tests, outliers, regression analysis, and probability distributions with step-by-step math solver breakdowns and interactive visual charts.',
    seoTitle: 'Ultimate Professional Statistics Calculator | Calculatoora',
    seoDescription: 'The most advanced client-side statistics calculator. Calculate mean, median, standard deviation, hypothesis tests, correlation, regression, outliers, and probability distributions in real-time.',
    inputs: [],
    formula: 'Multiple specialized statistical formulas including Descriptive statistics, Confidence Interval approximations, ANOVA, T-Tests, and Regression.',
    explanation: 'Interactive professional client-side statistics tool with real-time math solvers.',
    example: 'Click "Load Example" to populate realistic high-school performance metrics and observe the immediate real-time calculations.',
    faq: [
      { question: 'Does this run entirely client-side?', answer: 'Yes, this calculator runs entirely inside your browser for complete data privacy and fast real-time computations.' }
    ],
    relatedSlugs: ['probability-calculator', 'average-calculator', 'scientific-calculator'],
    calculate: () => {
      return { results: [] };
    }
  },
  {
    id: 'percent-change-calculator',
    name: 'Percentage Change',
    slug: 'percent-change-calculator',
    category: 'math',
    description: 'Calculate percentage increases, decreases, differences, or absolute change values between any two numbers.',
    seoTitle: 'Percentage Change & Difference Calculator | Calculatoora',
    seoDescription: 'Accurately solve percentage increase or decrease between initial and terminal values. Perfect for price changes or analytical reporting.',
    inputs: [
      { id: 'oldVal', label: 'Starting Value (Initial)', type: 'number', defaultValue: 50, step: 1 },
      { id: 'newVal', label: 'Ending Value (Final)', type: 'number', defaultValue: 75, step: 1 }
    ],
    formula: 'Percentage Change = [ (Final - Initial) / Initial ] * 100\nPercentage Difference = [ |A - B| / ((A + B)/2) ] * 100',
    explanation: 'Percentage change tracks relative scaling: a positive result shows growth, while a negative sign projects contraction.',
    example: 'Adjusting a price from $50.00 to $75.00 represents a 50.0% percentage increase.',
    faq: [
      { question: 'What is the difference between percentage change and percentage difference?', answer: 'Percentage change uses the starting initial value as the denominator. Percentage difference compares two numbers without implying direction, using their average as the denominator.' }
    ],
    relatedSlugs: ['ratio-calculator', 'proportion-calculator', 'average-calculator-advanced'],
    calculate: (inputs) => {
      const oldV = Number(inputs.oldVal) || 1;
      const newV = Number(inputs.newVal) || 0;

      const diff = newV - oldV;
      const pctChange = (diff / Math.abs(oldV)) * 100;
      
      const absDiff = Math.abs(newV - oldV);
      const avg = (oldV + newV) / 2;
      const pctDiff = avg > 0 ? (absDiff / avg) * 100 : 0;

      return {
        results: [
          { label: 'Overall Percentage Change', value: pctChange.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Absolute Integer Shift', value: diff.toFixed(2), unit: 'amt' },
          { label: 'Directional Result', value: diff >= 0 ? 'Increase (+)' : 'Decrease (-)', unit: 'status' },
          { label: 'Percentage Difference (No-direction)', value: pctDiff.toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Initial Weight', value: Math.abs(oldV), color: '#312e81' },
          { name: 'Shift Magnitude', value: Math.round(absDiff), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'ratio-calculator',
    name: 'Ratio Calculator',
    slug: 'ratio-calculator',
    category: 'math',
    description: 'Simplify or scale ratio parameters to find proportional dimensions for design, scaling, or recipes.',
    seoTitle: 'Ratio Simplifier & Scaling Calculator | Calculatoora',
    seoDescription: 'Simplify ratios into their lowest mathematical forms. Scale recipes, design aspects, or liquid proportions.',
    inputs: [
      { id: 'ratioA', label: 'Ratio Value A', type: 'number', defaultValue: 12, step: 1 },
      { id: 'ratioB', label: 'Ratio Value B', type: 'number', defaultValue: 16, step: 1 },
      { id: 'targetA', label: 'Scale Target A (Optional)', type: 'number', defaultValue: 3, step: 1 }
    ],
    formula: 'GCD Simplifier: dividing both elements by their Greatest Common Divisor.\nScale Factor: Target B = Target A * (Ratio B / Ratio A)',
    explanation: 'Useful for designers resizing images, chefs scaling up recipe portions, or engineers calculating mechanical gear teeth distributions.',
    example: 'Simplifying a ratio of 12:16 yields 3:4. Scaling the first side down to 3 results in a scaled ratio of 3:4.',
    faq: [
      { question: 'What is a simplified ratio?', answer: 'A ratio where both integer values are reduced to their smallest possible whole numbers while maintaining the original proportions.' }
    ],
    relatedSlugs: ['proportion-calculator', 'percentage-change-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.ratioA) || 1;
      const b = Number(inputs.ratioB) || 1;
      const tA = Number(inputs.targetA) || 0;

      // Find GCD helper
      const gcd = (x: number, y: number): number => {
        return y === 0 ? x : gcd(y, x % y);
      };

      const factor = gcd(Math.abs(a), Math.abs(b));
      const simplifiedA = a / factor;
      const simplifiedB = b / factor;

      // Scale calculations
      const scaledB = tA > 0 ? tA * (b / a) : 0;

      return {
        results: [
          { label: 'Simplified Ratio standard', value: `${simplifiedA} : ${simplifiedB}`, unit: 'ratio', isPrimary: true },
          { label: 'Calculated Scaled Value B', value: scaledB > 0 ? scaledB.toFixed(2) : 'Define target', unit: 'unit' },
          { label: 'Original Ratio Decimal', value: (a / b).toFixed(4), unit: 'decimal' }
        ],
        chartData: [
          { name: 'Ratio Portion A', value: simplifiedA, color: '#39FF14' },
          { name: 'Ratio Portion B', value: simplifiedB, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'proportion-calculator',
    name: 'Proportion Calculator',
    slug: 'proportion-calculator',
    category: 'math',
    description: 'Solve the proportion equation A/B = C/D, finding the missing fourth value based on cross-multiplication protocols.',
    seoTitle: 'Proportion Solver (A/B = C/D) | Calculatoora',
    seoDescription: 'Input three parts of a proportion equation to solve for the missing variable X instantly with stepwise feedback.',
    inputs: [
      { id: 'a', label: 'Value A', type: 'number', defaultValue: 10, step: 1 },
      { id: 'b', label: 'Value B', type: 'number', defaultValue: 20, step: 1 },
      { id: 'c', label: 'Value C (or solve for X)', type: 'number', defaultValue: 30, step: 1 },
      { id: 'solveFor', label: 'Solve Target', type: 'select', defaultValue: 'd', options: [
        { label: 'Solve For Value D', value: 'd' },
        { label: 'Solve For Value C', value: 'c' }
      ]}
    ],
    formula: 'A / B = C / D\nCross-Multiplication: A * D = B * C',
    explanation: 'A proportion states that two ratios are equal. Setting them side-by-side lets you solve for missing scaling parameters in recipes, geometry, or business operations.',
    example: 'If 10 / 20 = 30 / D, solving for D yields 60.',
    faq: [
      { question: 'What is cross-multiplication?', answer: 'The algebraic trick where you multiply the numerator of one fraction by the denominator of the other, enabling quick solution of unknown parameters.' }
    ],
    relatedSlugs: ['ratio-calculator', 'percentage-change-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 1;
      const b = Number(inputs.b) || 1;
      const cInput = Number(inputs.c) || 0;
      const target = inputs.solveFor || 'd';

      let resolvedD = 0;
      let resolvedC = 0;
      let solvedStr = '';

      if (target === 'd') {
        resolvedD = (b * cInput) / a;
        solvedStr = `D = ${resolvedD.toFixed(2)}`;
      } else {
        const dDummy = 50; // Assume baseline D representation if solving for C
        resolvedC = (a * dDummy) / b;
        solvedStr = `C = ${resolvedC.toFixed(2)} (with D = ${dDummy})`;
      }

      return {
        results: [
          { label: 'Solved missing Variable', value: solvedStr, unit: 'solved', isPrimary: true },
          { label: 'Proportion Equation Ratio', value: (a / b).toFixed(4), unit: 'decimal' }
        ],
        chartData: [
          { name: 'Ratio Left (A)', value: a, color: '#39FF14' },
          { name: 'Ratio Right (B)', value: b, color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'average-calculator-advanced',
    name: 'Average Calculator',
    slug: 'average-calculator-advanced',
    category: 'math',
    description: 'Calculate statistical metrics including Mean, Median, Mode, Range, and Standard Deviation from listed numbers.',
    seoTitle: 'Statistical Mean, Median, Mode Calculator | Calculatoora',
    seoDescription: 'Input a string of comma-separated numbers to automatically extract statistical averages, range distributions, and standard deviations.',
    inputs: [
      { id: 'numbers', label: 'Numbers List (Comma Separated)', type: 'text', defaultValue: '10, 15, 20, 15, 25, 30, 45' }
    ],
    formula: 'Mean = Sum / Count\nMedian = Middle sorted value\nStandard Deviation = sqrt( Variance )',
    explanation: 'Basic statistical metrics describe the central tendencies and dispersal patterns of any numerical data set.',
    example: 'For the numbers 10,15,20,15,25,30,45, the average Mean is 22.86, the Median is 20.00, the Mode is 15.00, and the Standard Deviation is 10.74.',
    faq: [
      { question: 'What is standard deviation?', answer: 'The standard deviation is a statistic that measures the dispersion of a dataset relative to its mean. A low standard deviation indicates that the data points tend to be very close to the mean, while a high standard deviation indicates that the data points are spread out over a wider range of values.' }
    ],
    relatedSlugs: ['percentage-change-calculator', 'probability-calculator'],
    calculate: (inputs) => {
      const raw = inputs.numbers || '10, 15, 20, 15, 25, 30, 45';
      const arr = raw.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));

      if (arr.length === 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter valid numbers.', unit: 'error', isPrimary: true }],
          chartData: []
        };
      }

      // Mean
      const sum = arr.reduce((acc, v) => acc + v, 0);
      const mean = sum / arr.length;

      // Median
      const sorted = [...arr].sort((x, y) => x - y);
      const mid = Math.floor(sorted.length / 2);
      const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;

      // Mode
      const counts: Record<number, number> = {};
      let maxCount = 0;
      let mode = sorted[0];
      for (const val of sorted) {
        counts[val] = (counts[val] || 0) + 1;
        if (counts[val] > maxCount) {
          maxCount = counts[val];
          mode = val;
        }
      }

      // Range (Max - Min)
      const min = Math.min(...arr);
      const max = Math.max(...arr);
      const range = max - min;

      // Standard Deviation
      const variance = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / arr.length;
      const stdDev = Math.sqrt(variance);

      return {
        results: [
          { label: 'Statistical Mean (Average)', value: mean.toFixed(2), unit: 'avg', isPrimary: true },
          { label: 'Median (Middle Value)', value: median.toFixed(2), unit: 'median' },
          { label: 'Mode (Most Frequent)', value: mode.toFixed(2), unit: 'mode' },
          { label: 'Range (Max - Min)', value: range.toFixed(2), unit: 'spread' },
          { label: 'Population Std Deviation (σ)', value: stdDev.toFixed(2), unit: 'sigma' }
        ],
        chartData: sorted.slice(0, 5).map((v, i) => ({
          name: `Idx ${i + 1}`,
          value: v,
          color: i === 0 ? '#39FF14' : '#3b82f6'
        }))
      };
    }
  },
  {
    id: 'probability-calculator',
    name: 'Probability Calculator',
    slug: 'probability-calculator',
    category: 'math',
    description: 'Calculate chances of single and joint probability events over multiple coin flips or dice roll outcomes.',
    seoTitle: 'Solve Event Joint Probability | Calculatoora',
    seoDescription: 'Obtain joint probability bounds across independent events, coins tosses, or dice roll choices.',
    inputs: [
      { id: 'probA', label: 'Probability of Event A (%)', type: 'number', defaultValue: 50, step: 1, unit: '%' },
      { id: 'probB', label: 'Probability of Event B (%)', type: 'number', defaultValue: 20, step: 1, unit: '%' }
    ],
    formula: 'Independent AND: P(A ∩ B) = P(A) * P(B)\nUnion OR: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)',
    explanation: 'Probability dictates the percent chance or frequency of independent occurrences in statistical fields.',
    example: 'If Event A has a 50% chance and Event B has a 20% chance, the probability of BOTH occurring concurrently is exactly 10.0%.',
    faq: [
      { question: 'What is independent event probability?', answer: 'Events where the outcome of the first event does not affect or alter the chances of the second event occurring.' }
    ],
    relatedSlugs: ['percentage-change-calculator', 'average-calculator-advanced'],
    calculate: (inputs) => {
      const aPct = Number(inputs.probA) || 0;
      const bPct = Number(inputs.probB) || 0;

      const pA = aPct / 100;
      const pB = bPct / 100;

      const pAnd = pA * pB;
      const pOr = pA + pB - pAnd;
      const pNeither = 1 - pOr;

      return {
        results: [
          { label: 'Probability of Both (A AND B)', value: (pAnd * 100).toFixed(2), unit: '%', isPrimary: true },
          { label: 'Probability of Either (A OR B)', value: (pOr * 100).toFixed(2), unit: '%' },
          { label: 'Probability of Neither Occurring', value: (pNeither * 100).toFixed(2), unit: '%' }
        ],
        chartData: [
          { name: 'Joint Chance (AND)', value: Math.round(pAnd * 100), color: '#39FF14' },
          { name: 'Mutual Exclusion (Neither)', value: Math.round(pNeither * 100), color: '#312e81' }
        ]
      };
    }
  },
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    slug: 'scientific-calculator',
    category: 'math',
    description: 'A premium scientific calculator equipped with interactive HTML5 graphing, matrix algebra, complex vectors, statistics distribution, programmer bases, and a step-by-step mathematical solver.',
    seoTitle: 'Scientific Calculator - Graphing & Algebra | Calculatoora',
    seoDescription: 'Perform high-precision calculations, plot custom functions in real time, analyze matrices and vectors, solve step-by-step expressions, and explore over 100+ physical constants.',
    inputs: [],
    formula: 'Comprehensive mathematical parsing and visualization powered by local engines.',
    explanation: 'Designed for engineering, physics, mathematics, and academic research with a premium glassmorphic interface and dual light/dark adaptive design.',
    example: 'Input simple or complex expressions like "sin(pi/4) * cos(pi/6)", "det([1,2;3,4])", or "3 + 4i * 2 - i".',
    faq: [
      { question: 'What mathematical methods are supported?', answer: 'It supports basic arithmetic, advanced trigonometry, matrix algebra, vector operations, complex numbers, number theory, statistical distributions, programmer base conversion, and multi-variable graphing.' }
    ],
    relatedSlugs: ['probability-calculator', 'percentage-change-calculator', 'average-calculator-advanced'],
    calculate: () => {
      return {
        results: [
          { label: 'Scientific Engine Status', value: 'Active', unit: 'ready', isPrimary: true }
        ],
        chartData: []
      };
    }
  }
];
