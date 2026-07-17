import { Calculator } from '../types';

export const V7_SCIENCE_CALCULATORS: Calculator[] = [
  {
    id: 'fraction-simplifier',
    name: 'Fraction Simplifier',
    slug: 'fraction-simplifier',
    category: 'math',
    description: 'Simplify any fraction to its simplest, lowest terms instantly.',
    seoTitle: 'Fraction Simplifier & Solver | Calculatoora',
    seoDescription: 'Simplify complex fractions to lowest terms. Find the greatest common divisor for any numerator and denominator.',
    inputs: [
      { id: 'numerator', label: 'Numerator', type: 'number', defaultValue: 24, step: 1 },
      { id: 'denominator', label: 'Denominator', type: 'number', defaultValue: 36, step: 1 }
    ],
    formula: 'Simplified Fraction = (Numerator / GCD) / (Denominator / GCD)',
    explanation: 'Uncovers the Greatest Common Divisor (GCD) to divide both values down to their irreducible fractional form.',
    example: 'Simplifying 24/36 uses a GCD of 12, reducing the fraction to 2/3.',
    faq: [{ question: 'What is Greatest Common Divisor (GCD)?', answer: 'The largest positive integer that divides both the numerator and denominator without leaving a remainder.' }],
    relatedSlugs: ['fraction-calculator', 'mixed-number-calculator'],
    calculate: (inputs) => {
      const num = Math.round(Number(inputs.numerator)) || 0;
      const den = Math.round(Number(inputs.denominator)) || 1;

      const getGcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : getGcd(b, a % b);
      const gcdVal = getGcd(num, den);

      const simNum = num / gcdVal;
      const simDen = den / gcdVal;

      return {
        results: [
          { label: 'Simplified Fraction Form', value: `${simNum}/${simDen}`, isPrimary: true },
          { label: 'Decimal value Equivalency', value: (num / den).toFixed(5) }
        ]
      };
    }
  },
  {
    id: 'fraction-calculator',
    name: 'Fraction Calculator',
    slug: 'fraction-calculator',
    category: 'math',
    description: 'Perform basic math operations—addition, subtraction, multiplication, and division—on fractions.',
    seoTitle: 'Fraction Arithmetic Calculator | Calculatoora',
    seoDescription: 'Add, subtract, multiply, or divide fractions with our step-by-step math solver.',
    inputs: [
      { id: 'numA', label: 'Fraction A Numerator', type: 'number', defaultValue: 1, step: 1 },
      { id: 'denA', label: 'Fraction A Denominator', type: 'number', defaultValue: 2, step: 1 },
      { id: 'operator', label: 'Action Operation', type: 'select', defaultValue: '+', options: [
        { label: 'Add (+)', value: '+' },
        { label: 'Subtract (-)', value: '-' },
        { label: 'Multiply (×)', value: '*' },
        { label: 'Divide (÷)', value: '/' }
      ] },
      { id: 'numB', label: 'Fraction B Numerator', type: 'number', defaultValue: 1, step: 1 },
      { id: 'denB', label: 'Fraction B Denominator', type: 'number', defaultValue: 3, step: 1 }
    ],
    formula: 'Performs standard fractional arithmetic laws.',
    explanation: 'Calculatess denominators to preserve exact whole numbers without rounding to decimals.',
    example: '1/2 + 1/3 translates to 3/6 + 2/6, yielding a sum of 5/6.',
    faq: [{ question: 'How is division handled?', answer: 'Multiply the first fraction by the reciprocal (flipped version) of the second fraction.' }],
    relatedSlugs: ['fraction-simplifier', 'mixed-number-calculator'],
    calculate: (inputs) => {
      const nA = Number(inputs.numA) || 0;
      const dA = Number(inputs.denA) || 1;
      const op = inputs.operator || '+';
      const nB = Number(inputs.numB) || 0;
      const dB = Number(inputs.denB) || 1;

      let resNum = 0;
      let resDen = 1;

      if (op === '+') {
        resNum = nA * dB + nB * dA;
        resDen = dA * dB;
      } else if (op === '-') {
        resNum = nA * dB - nB * dA;
        resDen = dA * dB;
      } else if (op === '*') {
        resNum = nA * nB;
        resDen = dA * dB;
      } else if (op === '/') {
        resNum = nA * dB;
        resDen = dA * nB;
      }

      const getGcd = (a: number, b: number): number => b === 0 ? Math.abs(a) : getGcd(b, a % b);
      const gcdVal = getGcd(resNum, resDen);
      const finalNum = resNum / (gcdVal || 1);
      const finalDen = resDen / (gcdVal || 1);

      return {
        results: [
          { label: 'Resulting Fraction', value: `${finalNum}/${finalDen}`, isPrimary: true },
          { label: 'Resulting Decimal', value: (resNum / resDen).toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'mixed-number-calculator',
    name: 'Mixed Number Calculator',
    slug: 'mixed-number-calculator',
    category: 'math',
    description: 'Convert mixed numbers into improper fractions or decimal equivalents.',
    seoTitle: 'Mixed Fraction Converting Solver | Calculatoora',
    seoDescription: 'Multiply whole numbers by denominators and add numerators to convert mixed numbers to improper fractions.',
    inputs: [
      { id: 'whole', label: 'Whole Number Integer', type: 'number', defaultValue: 3, step: 1 },
      { id: 'numerator', label: 'Fraction Numerator', type: 'number', defaultValue: 1, step: 1 },
      { id: 'denominator', label: 'Fraction Denominator', type: 'number', defaultValue: 2, step: 1 }
    ],
    formula: 'Improper Numerator = (Whole * Denominator) + Numerator',
    explanation: 'Combines whole numbers with fractional parts to simplify complex engineering measurements.',
    example: 'Enter 3 and 1/2 to convert the value into 7/2 (or 3.50 in decimal format).',
    faq: [{ question: 'What is an improper fraction?', answer: 'A fraction where the numerator is larger than or equal to the denominator.' }],
    relatedSlugs: ['fraction-simplifier', 'fraction-calculator'],
    calculate: (inputs) => {
      const wh = Math.round(Number(inputs.whole)) || 0;
      const num = Math.round(Number(inputs.numerator)) || 0;
      const den = Math.round(Number(inputs.denominator)) || 1;

      const impNum = (wh * den) + num;
      const dec = wh + (num / den);

      return {
        results: [
          { label: 'Improper Fraction Output', value: `${impNum}/${den}`, isPrimary: true },
          { label: 'Solved Decimal value', value: dec.toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'ratio-simplifier',
    name: 'Ratio Simplifier',
    slug: 'ratio-simplifier',
    category: 'math',
    description: 'Simplify ratios into their simplest positive whole-number proportions.',
    seoTitle: 'Ratio Simplifier & Solver | Calculatoora',
    seoDescription: 'Simplify proportions and ratios. Find GCD matches to reduce dual-item ratios to lowest integers.',
    inputs: [
      { id: 'partA', label: 'Asset Ratio Part A (First)', type: 'number', defaultValue: 15, step: 1 },
      { id: 'partB', label: 'Asset Ratio Part B (Second)', type: 'number', defaultValue: 45, step: 1 }
    ],
    formula: 'Simplified Ratio = (Part A / GCD) : (Part B / GCD)',
    explanation: 'Reduces proportional ratios to their simplest formats for recipes, designs, or financial splits.',
    example: 'A ratio of 15:45 is simplified using a GCD of 15, reducing the proportion to a clean 1:3.',
    faq: [{ question: 'Are fraction laws valid here?', answer: 'Yes! Ratios express similar proportional relationships as standard fraction structures.' }],
    relatedSlugs: ['proportion-calculator', 'fraction-simplifier'],
    calculate: (inputs) => {
      const a = Math.round(Number(inputs.partA)) || 1;
      const b = Math.round(Number(inputs.partB)) || 1;

      const getGcd = (x: number, y: number): number => y === 0 ? Math.abs(x) : getGcd(y, x % y);
      const gcd = getGcd(a, b);

      return {
        results: [
          { label: 'Simplified Ratio Format', value: `${a / gcd}:${b / gcd}`, isPrimary: true },
          { label: 'Proportional decimal Rate', value: (a / b).toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'proportion-calculator',
    name: 'Proportion Calculator',
    slug: 'proportion-calculator',
    category: 'math',
    description: 'Solve for the missing value (x) in proportion ratios.',
    seoTitle: 'Ratio Proportion Solver (Solve for X) | Calculatoora',
    seoDescription: 'Find the missing value in standard equal proportions (A/B = C/D) using cross-multiplication.',
    inputs: [
      { id: 'valA', label: 'A value (Numerator Left)', type: 'number', defaultValue: 4, step: 1 },
      { id: 'valB', label: 'B value (Denominator Left)', type: 'number', defaultValue: 8, step: 1 },
      { id: 'valC', label: 'C value (Numerator Right)', type: 'number', defaultValue: 10, step: 1 }
    ],
    formula: 'D (x) = (B * C) / A',
    explanation: 'Uses cross-multiplication (A/B = C/D) to solve for the missing proportion variable.',
    example: 'In the proportion 4/8 = 10/D, cross-multiplying solves for D as 20.',
    faq: [{ question: 'What is a typical use case?', answer: 'Scale recipe ingredients or map dimensional blueprints accurately using proportional scaling.' }],
    relatedSlugs: ['ratio-simplifier', 'fraction-simplifier'],
    calculate: (inputs) => {
      const a = Number(inputs.valA) || 1;
      const b = Number(inputs.valB) || 0;
      const c = Number(inputs.valC) || 0;

      const d = a !== 0 ? (b * c) / a : 0;
      return {
        results: [
          { label: 'Solved Proportion (D)', value: d.toFixed(4), isPrimary: true },
          { label: 'Proportional Equivalence', value: `${a}/${b} = ${c}/${d.toFixed(1)}` }
        ]
      };
    }
  },
  {
    id: 'percentage-difference-calculator',
    name: 'Percentage Difference Calculator',
    slug: 'percentage-difference-calculator',
    category: 'math',
    description: 'Calculate the percentage difference between two positive numbers.',
    seoTitle: 'Percentage Difference Solver | Calculatoora',
    seoDescription: 'Determine the percentage difference between two numbers, relative to their average value.',
    inputs: [
      { id: 'valA', label: 'First Value (A)', type: 'number', defaultValue: 45, step: 1 },
      { id: 'valB', label: 'Second Value (B)', type: 'number', defaultValue: 55, step: 1 }
    ],
    formula: 'Difference = (|A - B| / ((A + B) / 2)) * 100',
    explanation: 'Compares two values relative to their average when there is no clear default or baseline value.',
    example: 'The percentage difference between 45 and 55 is 20.00%.',
    faq: [{ question: 'How is this different from percentage change?', answer: 'Percentage change uses an explicit starting value, while percentage difference uses the average of both values as the shared baseline.' }],
    relatedSlugs: ['percentage-error-calculator', 'ratio-simplifier'],
    calculate: (inputs) => {
      const a = Number(inputs.valA) || 0;
      const b = Number(inputs.valB) || 0;

      const absDiff = Math.abs(a - b);
      const avg = (a + b) / 2;
      const pct = avg > 0 ? (absDiff / avg) * 100 : 0;

      return {
        results: [
          { label: 'Percentage Difference Value', value: pct.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Absolute Integer Diff', value: absDiff.toFixed(2) }
        ]
      };
    }
  },
  {
    id: 'percentage-error-calculator',
    name: 'Percentage Error Calculator',
    slug: 'percentage-error-calculator',
    category: 'math',
    description: 'Calculate scientific percentage errors by comparing experimental results with known theoretical standards.',
    seoTitle: 'Percentage Error Solver | Calculatoora',
    seoDescription: 'Determine the percentage error of your measurements by comparing experimental and theoretical values.',
    inputs: [
      { id: 'exp', label: 'Experimental Observed Value', type: 'number', defaultValue: 9.5, step: 0.1 },
      { id: 'theo', label: 'Theoretical Actual Value', type: 'number', defaultValue: 9.81, step: 0.1 }
    ],
    formula: 'Error Percentage = (|Experimental - Theoretical| / Theoretical) * 100',
    explanation: 'Measures the accuracy of experimental trials relative to accepted scientific constants.',
    example: 'Measuring gravity at 9.50 m/s² instead of the theoretical 9.81 m/s² results in a 3.16% experimental error.',
    faq: [{ question: 'Can percentage error be negative?', answer: 'No, scientific percentage error formulas use absolute values to measure raw deviation.' }],
    relatedSlugs: ['percentage-difference-calculator', 'scientific-notation-calculator'],
    calculate: (inputs) => {
      const exp = Number(inputs.exp) || 0;
      const theo = Number(inputs.theo) || 1;

      const err = (Math.abs(exp - theo) / Math.abs(theo)) * 100;
      return {
        results: [
          { label: 'Calculated Percentage Error', value: err.toFixed(2), unit: '%', isPrimary: true },
          { label: 'Absolute Deviation Difference', value: Math.abs(exp - theo).toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'scientific-notation-calculator',
    name: 'Scientific Notation Calculator',
    slug: 'scientific-notation-calculator',
    category: 'math',
    description: 'Convert large or small floating-point decimals into clean scientific notation (x * 10^y).',
    seoTitle: 'Scientific Notation Converter | Calculatoora',
    seoDescription: 'Quickly convert numbers between standard decimal format and scientific notation.',
    inputs: [
      { id: 'val', label: 'Input Decimal Number', type: 'number', defaultValue: 1250000, step: 100 }
    ],
    formula: 'Scientific standard: a × 10^b (where 1 ≤ |a| < 10)',
    explanation: 'Simplifies complex decimals to make working with extremely large or small numbers manageable.',
    example: 'Converting 1,250,000 into scientific notation yields 1.25 × 10⁶.',
    faq: [{ question: 'Why use scientific notation?', answer: 'It simplifies decimal representations and makes working with astronomical scales or quantum measurements easier.' }],
    relatedSlugs: ['percentage-error-calculator', 'exponent-calculator'],
    calculate: (inputs) => {
      const val = Number(inputs.val) || 0;
      return {
        results: [
          { label: 'Scientific Notation Equivalency', value: val.toExponential(4).replace('e+', ' × 10^').replace('e-', ' × 10^-'), isPrimary: true },
          { label: 'E-Notation Output Code', value: val.toExponential(4) }
        ]
      };
    }
  },
  {
    id: 'exponent-calculator',
    name: 'Exponent Calculator',
    slug: 'exponent-calculator',
    category: 'math',
    description: 'Solve exponent equations by raising bases to custom power levels.',
    seoTitle: 'Exponent Power Solver | Calculatoora',
    seoDescription: 'Calculate exponent values. Raise positive or negative bases to custom power levels.',
    inputs: [
      { id: 'base', label: 'Base Number (x)', type: 'number', defaultValue: 2, step: 0.5 },
      { id: 'power', label: 'Exponent Power (y)', type: 'number', defaultValue: 8, step: 1 }
    ],
    formula: 'Result = Base ^ Power',
    explanation: 'Multiplies the base number by itself the number of times specified by the exponent.',
    example: 'Raising a base of 2 to the 8th power results in 256.',
    faq: [{ question: 'What does a negative exponent mean?', answer: 'A negative exponent represents the reciprocal of the base raised to the positive power (e.g., 2^-3 = 1/8).' }],
    relatedSlugs: ['logarithm-calculator', 'scientific-notation-calculator'],
    calculate: (inputs) => {
      const b = Number(inputs.base) || 0;
      const p = Number(inputs.power) || 0;
      const ans = Math.pow(b, p);
      return {
        results: [
          { label: 'Calculated Power Outcome', value: ans.toFixed(5), isPrimary: true },
          { label: 'Isolate Multiplier representation', value: `${b} multiplied ${p} times` }
        ]
      };
    }
  },
  {
    id: 'logarithm-calculator',
    name: 'Logarithm Calculator',
    slug: 'logarithm-calculator',
    category: 'math',
    description: 'Calculate logarithms for any positive base and argument.',
    seoTitle: 'Logarithm (Log & Ln) Solver | Calculatoora',
    seoDescription: 'Find natural log (ln) and common log (log10) values for any positive base.',
    inputs: [
      { id: 'arg', label: 'Logarithm Argument (x)', type: 'number', defaultValue: 100, step: 1 },
      { id: 'base', label: 'Log Base value (Default 10)', type: 'number', defaultValue: 10, step: 1 }
    ],
    formula: 'log_b(x) = ln(x) / ln(b)',
    explanation: 'Solves for the exponent needed to produce a given number from a specific base.',
    example: 'The base-10 logarithm of 100 is 2, since 10² = 100.',
    faq: [{ question: 'What is a Natural Log (ln)?', answer: 'A natural logarithm uses mathematical constant Euler\'s number "e" (approximately 2.71828) as its base.' }],
    relatedSlugs: ['exponent-calculator', 'scientific-notation-calculator'],
    calculate: (inputs) => {
      const x = Number(inputs.arg) || 1;
      const b = Number(inputs.base) || 10;

      if (x <= 0 || b <= 0 || b === 1) {
        return { results: [{ label: 'Error', value: 'Invalid inputs', isPrimary: true }] };
      }

      const logVal = Math.log(x) / Math.log(b);
      return {
        results: [
          { label: 'Logarithm Value', value: logVal.toFixed(6), isPrimary: true },
          { label: 'Natural Log ln(x)', value: Math.log(x).toFixed(6) }
        ]
      };
    }
  },
  {
    id: 'mean-calculator',
    name: 'Mean Calculator',
    slug: 'mean-calculator',
    category: 'math',
    description: 'Calculate the mathematical mean (average) of any dataset.',
    seoTitle: 'Arithmetic Mean Solver | Calculatoora',
    seoDescription: 'Calculate the arithmetic average of a dataset by entering comma-separated numbers.',
    inputs: [
      { id: 'dataset', label: 'Comma-Separated Data Values', type: 'text', defaultValue: '10, 15, 20, 25, 30' }
    ],
    formula: 'Mean = Sum of Values / Number of Items',
    explanation: 'Sum all numbers in a dataset and divide by the total number of items to find the arithmetic average.',
    example: 'The mean of "10, 15, 20, 25, 30" is 20.00.',
    faq: [{ question: 'Does the mean get skewed by outliers?', answer: 'Yes, extreme outliers can significantly skew the mean, making median a better measure of central tendency in those cases.' }],
    relatedSlugs: ['median-calculator', 'standard-deviation-calculator'],
    calculate: (inputs) => {
      const raw = inputs.dataset || '';
      const arr = raw.split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));

      if (arr.length === 0) return { results: [{ label: 'Error', value: 'No numbers provided', isPrimary: true }] };
      const sum = arr.reduce((acc: number, curr: number) => acc + curr, 0);
      const mean = sum / arr.length;

      return {
        results: [
          { label: 'Arithmetic Mean', value: mean.toFixed(4), isPrimary: true },
          { label: 'Count of Data Points', value: arr.length }
        ]
      };
    }
  },
  {
    id: 'median-calculator',
    name: 'Median Calculator',
    slug: 'median-calculator',
    category: 'math',
    description: 'Find the middle value (median) of any sorted numerical dataset.',
    seoTitle: 'Dataset Median Finder | Calculatoora',
    seoDescription: 'Find the median of a dataset. Sort and locate the middle value of any comma-separated list of numbers.',
    inputs: [
      { id: 'dataset', label: 'Comma-Separated Numbers', type: 'text', defaultValue: '12, 3, 5, 8, 19, 21' }
    ],
    formula: 'Median = Middle value in a sorted dataset.',
    explanation: 'Sorts values from lowest to highest. If the dataset has an odd number of items, the median is the middle value. If even, it is the average of the two middle values.',
    example: 'For the values "12, 3, 5, 8, 19, 21", the sorted list is "3, 5, 8, 12, 19, 21", yielding a median of 10.00.',
    faq: [{ question: 'Why use median over mean?', answer: 'Median is highly resistant to extreme outliers, making it ideal for skewed datasets like household income statistics.' }],
    relatedSlugs: ['mean-calculator', 'mode-calculator'],
    calculate: (inputs) => {
      const raw = inputs.dataset || '';
      const arr = raw.split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n)).sort((x: number, y: number) => x - y);

      if (arr.length === 0) return { results: [{ label: 'Error', value: 'No numbers provided', isPrimary: true }] };
      const mid = Math.floor(arr.length / 2);
      const med = arr.length % 2 !== 0 ? arr[mid] : (arr[mid - 1] + arr[mid]) / 2;

      return {
        results: [
          { label: 'Dataset Median', value: med.toFixed(2), isPrimary: true },
          { label: 'Sorted Dataset Representation', value: arr.slice(0, 10).join(', ') + (arr.length > 10 ? '...' : '') }
        ]
      };
    }
  },
  {
    id: 'mode-calculator',
    name: 'Mode Calculator',
    slug: 'mode-calculator',
    category: 'math',
    description: 'Find the most frequently occurring value (mode) in a numerical dataset.',
    seoTitle: 'Dataset Mode Solver | Calculatoora',
    seoDescription: 'Find the mode of a dataset. Locate the most frequently occurring numbers in any comma-separated list of values.',
    inputs: [
      { id: 'dataset', label: 'Comma-Separated Dataset', type: 'text', defaultValue: '1, 2, 2, 3, 4, 4, 4, 5' }
    ],
    formula: 'Mode = Value with the highest occurrence frequency.',
    explanation: 'Analyzes dataset frequency to surface the most commonly repeated number.',
    example: 'In the set "1, 2, 2, 3, 4, 4, 4, 5", the value 4 occurs three times, making it the mode.',
    faq: [{ question: 'Can a dataset have multiple modes?', answer: 'Yes! If multiple values tie for the highest frequency, the dataset is bimodal or multimodal.' }],
    relatedSlugs: ['mean-calculator', 'median-calculator'],
    calculate: (inputs) => {
      const raw = inputs.dataset || '';
      const arr = raw.split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));

      if (arr.length === 0) return { results: [{ label: 'Error', value: 'No numbers provided', isPrimary: true }] };

      const freqs: Record<number, number> = {};
      arr.forEach(n => freqs[n] = (freqs[n] || 0) + 1);

      let maxFreq = 0;
      let modes: number[] = [];

      Object.entries(freqs).forEach(([k, v]) => {
        if (v > maxFreq) {
          maxFreq = v;
          modes = [Number(k)];
        } else if (v === maxFreq && v > 1) {
          modes.push(Number(k));
        }
      });

      return {
        results: [
          { label: 'Identified Mode(s)', value: modes.length > 0 && maxFreq > 1 ? modes.join(', ') : 'No Mode (All values unique)', isPrimary: true },
          { label: 'Highest Frequency Count', value: maxFreq }
        ]
      };
    }
  },
  {
    id: 'range-calculator',
    name: 'Range Calculator',
    slug: 'range-calculator',
    category: 'math',
    description: 'Calculate the mathematical range (difference between maximum and minimum values) of a dataset.',
    seoTitle: 'Dataset Range Solver | Calculatoora',
    seoDescription: 'Find the mathematical range of a dataset by subtract the minimum value from the maximum value.',
    inputs: [
      { id: 'dataset', label: 'Comma-Separated Data', type: 'text', defaultValue: '8, 14, 25, 4, 30, 9' }
    ],
    formula: 'Range = Maximum Value - Minimum Value',
    explanation: 'Quickly measure the absolute spread of a numerical dataset.',
    example: 'For "8, 14, 25, 4, 30, 9", the range is 30 minus 4, which equals 26.',
    faq: [{ question: 'Is range sensitive to outliers?', answer: 'Yes, since it only uses the minimum and maximum values, extreme outliers can heavily skew the calculated range.' }],
    relatedSlugs: ['variance-calculator', 'standard-deviation-calculator'],
    calculate: (inputs) => {
      const raw = inputs.dataset || '';
      const arr = raw.split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));

      if (arr.length === 0) return { results: [{ label: 'Error', value: 'No numbers provided', isPrimary: true }] };
      const max = Math.max(...arr);
      const min = Math.min(...arr);

      return {
        results: [
          { label: 'Dataset Range', value: (max - min).toFixed(2), isPrimary: true },
          { label: 'Maximum Value', value: max.toFixed(2) },
          { label: 'Minimum Value', value: min.toFixed(2) }
        ]
      };
    }
  },
  {
    id: 'variance-calculator',
    name: 'Variance Calculator',
    slug: 'variance-calculator',
    category: 'math',
    description: 'Calculate population and sample variance of any numerical dataset.',
    seoTitle: 'Variance (Sample & Population) Calculator | Calculatoora',
    seoDescription: 'Determine population and sample variance by entering comma-separated numbers.',
    inputs: [
      { id: 'dataset', label: 'Comma-Separated Values', type: 'text', defaultValue: '4, 8, 15, 16, 23, 42' }
    ],
    formula: 'Sample Variance = Sum(x_i - mean)^2 / (N - 1)',
    explanation: 'Measures how far numbers in a dataset are spread out from their average value.',
    example: 'For the dataset "4, 8, 15, 16, 23, 42", sample variance is 196.80.',
    faq: [{ question: 'What is the difference between sample and population variance?', answer: 'Sample variance uses N-1 as the divisor to avoid bias when estimating a larger population, while population variance divides directly by the total count N.' }],
    relatedSlugs: ['standard-deviation-calculator', 'range-calculator'],
    calculate: (inputs) => {
      const raw = inputs.dataset || '';
      const arr = raw.split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));

      if (arr.length < 2) return { results: [{ label: 'Error', value: 'Requires at least 2 numbers', isPrimary: true }] };

      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const squaredDiffs = arr.map(v => Math.pow(v - mean, 2));
      const sumSq = squaredDiffs.reduce((a, b) => a + b, 0);

      const sampleVar = sumSq / (arr.length - 1);
      const popVar = sumSq / arr.length;

      return {
        results: [
          { label: 'Sample Variance (s²)', value: sampleVar.toFixed(4), isPrimary: true },
          { label: 'Population Variance (σ²)', value: popVar.toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'standard-deviation-calculator',
    name: 'Standard Deviation Calculator',
    slug: 'standard-deviation-calculator',
    category: 'math',
    description: 'Calculate sample and population standard deviation to measure dataset volatility.',
    seoTitle: 'Standard Deviation Solver | Calculatoora',
    seoDescription: 'Find standard deviation and variance. Enter comma-separated values to calculate data dispersion.',
    inputs: [
      { id: 'dataset', label: 'Comma-Separated Values', type: 'text', defaultValue: '10, 12, 23, 23, 16, 23, 21, 16' }
    ],
    formula: 'Standard Deviation = Square Root of Variance',
    explanation: 'Quantifies the amount of variation or dispersion in a set of numerical values.',
    example: 'For the values "10, 12, 23, 23, 16, 23, 21, 16", the sample standard deviation is 5.55.',
    faq: [{ question: 'What does a small standard deviation indicate?', answer: 'It means the data points tend to cluster closely around the mean, representing lower volatility.' }],
    relatedSlugs: ['variance-calculator', 'mean-calculator'],
    calculate: (inputs) => {
      const raw = inputs.dataset || '';
      const arr = raw.split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));

      if (arr.length < 2) return { results: [{ label: 'Error', value: 'Requires at least 2 numbers', isPrimary: true }] };

      const mean = arr.reduce((a, b) => a + b, 0) / arr.length;
      const sumSq = arr.map(v => Math.pow(v - mean, 2)).reduce((a, b) => a + b, 0);

      const sampleSdev = Math.sqrt(sumSq / (arr.length - 1));
      const popSdev = Math.sqrt(sumSq / arr.length);

      return {
        results: [
          { label: 'Sample Standard Deviation (s)', value: sampleSdev.toFixed(4), isPrimary: true },
          { label: 'Population Standard Deviation (σ)', value: popSdev.toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'probability-distribution-calculator',
    name: 'Probability Distribution Calculator',
    slug: 'probability-distribution-calculator',
    category: 'math',
    description: 'Calculate binomial probability distributions.',
    seoTitle: 'Binomial Probability Distribution | Calculatoora',
    seoDescription: 'Calculate binomial probabilities by entering trial counts, success rates, and target successes.',
    inputs: [
      { id: 'trials', label: 'Number of Trials (n)', type: 'number', defaultValue: 10, step: 1 },
      { id: 'prob', label: 'Probability of Success (p)', type: 'number', defaultValue: 0.5, step: 0.05 },
      { id: 'successes', label: 'Target Successes (k)', type: 'number', defaultValue: 5, step: 1 }
    ],
    formula: 'P(X = k) = (n choose k) * p^k * (1-p)^(n-k)',
    explanation: 'Solves for the probability of achieving a specific number of successes in fixed independent trials.',
    example: 'Finding the probability of flipping exactly 5 heads (successes) in 10 coin flips (trials) yields 24.61%.',
    faq: [{ question: 'What is a binomial trial?', answer: 'An experiment with exactly two possible mutually exclusive outcomes, often labeled as success or failure.' }],
    relatedSlugs: ['standard-deviation-calculator', 'correlation-calculator'],
    calculate: (inputs) => {
      const n = Math.round(Number(inputs.trials)) || 1;
      const p = Number(inputs.prob) || 0.5;
      const k = Math.round(Number(inputs.successes)) || 0;

      if (p < 0 || p > 1 || k < 0 || k > n) {
        return { results: [{ label: 'Error', value: 'Probability must be 0 to 1, k must be <= n', isPrimary: true }] };
      }

      const fact = (num: number): number => num <= 1 ? 1 : num * fact(num - 1);
      const comb = fact(n) / (fact(k) * fact(n - k));
      const binProb = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);

      return {
        results: [
          { label: 'Binomial Probability P(X = k)', value: (binProb * 100).toFixed(2), unit: '%', isPrimary: true },
          { label: 'Probability Decimal', value: binProb.toFixed(6) }
        ]
      };
    }
  },
  {
    id: 'correlation-calculator',
    name: 'Correlation Calculator',
    slug: 'correlation-calculator',
    category: 'math',
    description: 'Calculate Pearson correlation coefficient (r) between two analytical data profiles.',
    seoTitle: 'Pearson Correlation Coefficient Solver | Calculatoora',
    seoDescription: 'Analyze the linear relationship between two variables to determine their core correlation strength (r).',
    inputs: [
      { id: 'xlist', label: 'Variable X (Comma-Separated)', type: 'text', defaultValue: '1, 2, 3, 4, 5' },
      { id: 'ylist', label: 'Variable Y (Comma-Separated)', type: 'text', defaultValue: '2, 4, 5, 4, 6' }
    ],
    formula: 'Pearson r = Covariance(X,Y) / (s_X * s_Y)',
    explanation: 'Measures the strength and direction of the linear relationship between two datasets on a scale from -1.0 to +1.0.',
    example: 'For X "1, 2, 3, 4, 5" and Y "2, 4, 5, 4, 6", the calculated Pearson correlation is +0.85.',
    faq: [{ question: 'What does r = 0 mean?', answer: 'It indicates there is no linear relationship between the two variables.' }],
    relatedSlugs: ['mean-calculator', 'standard-deviation-calculator'],
    calculate: (inputs) => {
      const xl = (inputs.xlist || '').split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));
      const yl = (inputs.ylist || '').split(',').map((v: string) => Number(v.trim())).filter((n: number) => !isNaN(n));

      if (xl.length !== yl.length || xl.length < 2) {
        return { results: [{ label: 'Error', value: 'Dataset lengths must match (min 2 items)', isPrimary: true }] };
      }

      const n = xl.length;
      const sumX = xl.reduce((a, b) => a + b, 0);
      const sumY = yl.reduce((a, b) => a + b, 0);
      const sumXY = xl.map((x, i) => x * yl[i]).reduce((a, b) => a + b, 0);
      const sumXSq = xl.map(x => x * x).reduce((a, b) => a + b, 0);
      const sumYSq = yl.map(y => y * y).reduce((a, b) => a + b, 0);

      const num = n * sumXY - sumX * sumY;
      const den = Math.sqrt((n * sumXSq - sumX * sumX) * (n * sumYSq - sumY * sumY));
      const r = den !== 0 ? num / den : 0;

      return {
        results: [
          { label: 'Pearson Correlation Coefficient (r)', value: r.toFixed(4), isPrimary: true },
          { label: 'Correlation Strength', value: Math.abs(r) >= 0.7 ? 'Strong' : Math.abs(r) >= 0.3 ? 'Moderate' : 'Weak' }
        ]
      };
    }
  },
  {
    id: 'velocity-calculator',
    name: 'Velocity Calculator',
    slug: 'velocity-calculator',
    category: 'science',
    description: 'Calculate average velocity by dividing displacement by total elapsed time.',
    seoTitle: 'Velocity (Speed) Calculator | Calculatoora',
    seoDescription: 'Find average velocity by entering displacement and total travel time.',
    inputs: [
      { id: 'distance', label: 'Displacement / Distance', type: 'number', defaultValue: 100, step: 1, unit: 'm' },
      { id: 'time', label: 'Time Elapsed', type: 'number', defaultValue: 10, step: 0.5, unit: 's' }
    ],
    formula: 'Velocity (v) = Distance (d) / Time (t)',
    explanation: 'Velocity measures displacement over elapsed time in a specific direction.',
    example: 'Traveling 100 meters in 10 seconds yields a velocity of 10.00 m/s.',
    faq: [{ question: 'What is the standard unit of velocity?', answer: 'The SI unit of velocity is meters per second (m/s), but kilometers per hour (km/h) is commonly used.' }],
    relatedSlugs: ['acceleration-calculator', 'distance-calculator-physics'],
    calculate: (inputs) => {
      const d = Number(inputs.distance) || 0;
      const t = Number(inputs.time) || 1;
      const v = d / t;
      return {
        results: [
          { label: 'Average Velocity', value: v.toFixed(3), unit: 'm/s', isPrimary: true },
          { label: 'Velocity km/h Equivalency', value: (v * 3.6).toFixed(2), unit: 'km/h' }
        ]
      };
    }
  },
  {
    id: 'acceleration-calculator',
    name: 'Acceleration Calculator',
    slug: 'acceleration-calculator',
    category: 'science',
    description: 'Calculate change in velocity divided by time elapsed.',
    seoTitle: 'Physics Acceleration Solver | Calculatoora',
    seoDescription: 'Calculate physical acceleration by entering initial velocity, final velocity, and elapsed time.',
    inputs: [
      { id: 'v0', label: 'Initial Velocity (v0)', type: 'number', defaultValue: 0, step: 1, unit: 'm/s' },
      { id: 'v1', label: 'Final Velocity (v1)', type: 'number', defaultValue: 25, step: 1, unit: 'm/s' },
      { id: 'time', label: 'Time Interval (t)', type: 'number', defaultValue: 5, step: 0.5, unit: 's' }
    ],
    formula: 'Acceleration (a) = (Final Velocity - Initial Velocity) / Time',
    explanation: 'Acceleration measures how quickly velocity changes over time.',
    example: 'Accelerating from 0 to 25 m/s in 5 seconds represents an acceleration of 5.00 m/s².',
    faq: [{ question: 'What is negative acceleration?', answer: 'Often called deceleration, negative acceleration occurs when an object is slowing down.' }],
    relatedSlugs: ['velocity-calculator', 'force-calculator-physics'],
    calculate: (inputs) => {
      const v0 = Number(inputs.v0) || 0;
      const v1 = Number(inputs.v1) || 0;
      const t = Number(inputs.time) || 1;

      const a = (v1 - v0) / t;
      return {
        results: [
          { label: 'Linear Acceleration (a)', value: a.toFixed(3), unit: 'm/s²', isPrimary: true },
          { label: 'G-Force Equivalency', value: (a / 9.80665).toFixed(3), unit: 'G' }
        ]
      };
    }
  },
  {
    id: 'distance-calculator-physics',
    name: 'Distance Calculator',
    slug: 'distance-calculator-physics',
    category: 'science',
    description: 'Calculate displacement based on velocity and elapsed time.',
    seoTitle: 'Physics travel Distance Solver | Calculatoora',
    seoDescription: 'Find displacement by entering velocity and total travel time.',
    inputs: [
      { id: 'velocity', label: 'Constant Velocity', type: 'number', defaultValue: 15, step: 1, unit: 'm/s' },
      { id: 'time', label: 'Time Elapsed', type: 'number', defaultValue: 12, step: 0.5, unit: 's' }
    ],
    formula: 'Distance (d) = Velocity (v) * Time (t)',
    explanation: 'Calculators total displacement based on constant velocity and travel duration.',
    example: 'Traveling at 15 m/s for 12 seconds yields a distance of 180 meters.',
    faq: [{ question: 'How is varying velocity handled?', answer: 'Average velocity must be used; for accelerating objects, use kinematics equations.' }],
    relatedSlugs: ['velocity-calculator', 'acceleration-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.velocity) || 0;
      const t = Number(inputs.time) || 0;
      return {
        results: [
          { label: 'Calculated Displacement', value: (v * t).toFixed(2), unit: 'meters', isPrimary: true },
          { label: 'Distance feet Equivalency', value: (v * t * 3.28084).toFixed(1), unit: 'ft' }
        ]
      };
    }
  },
  {
    id: 'force-calculator-physics',
    name: 'Force Calculator',
    slug: 'force-calculator-physics',
    category: 'science',
    description: 'Calculate physical force using Newton\'s second law (mass times acceleration).',
    seoTitle: 'Newton\'s Force (F = ma) Solver | Calculatoora',
    seoDescription: 'Calculate force in Newtons by entering physical mass and linear acceleration details.',
    inputs: [
      { id: 'mass', label: 'Object Mass (m)', type: 'number', defaultValue: 12, step: 0.5, unit: 'kg' },
      { id: 'accel', label: 'Linear Acceleration (a)', type: 'number', defaultValue: 9.8, step: 0.1, unit: 'm/s²' }
    ],
    formula: 'Force (F) = Mass (m) * Acceleration (a)',
    explanation: 'Isolates the linear push or pull force required to accelerate a physical mass.',
    example: 'Accelerating a 12 kg mass at 9.8 m/s² requires a force of 117.60 Newtons.',
    faq: [{ question: 'What is 1 Newton of force?', answer: 'The force required to accelerate a 1 kilogram mass at a rate of 1 meter per second squared.' }],
    relatedSlugs: ['acceleration-calculator', 'momentum-calculator-physics'],
    calculate: (inputs) => {
      const m = Number(inputs.mass) || 0;
      const a = Number(inputs.accel) || 0;
      return {
        results: [
          { label: 'Resulting Force (F)', value: (m * a).toFixed(2), unit: 'Newtons (N)', isPrimary: true },
          { label: 'Impact force pound Equivalency', value: (m * a * 0.224809).toFixed(2), unit: 'lbf' }
        ]
      };
    }
  },
  {
    id: 'energy-calculator-physics',
    name: 'Energy Calculator',
    slug: 'energy-calculator-physics',
    category: 'science',
    description: 'Calculate kinetic energy based on mass and velocity.',
    seoTitle: 'Kinetic Energy Solver | Calculatoora',
    seoDescription: 'Find kinetic energy in Joules by entering mass and physical velocity.',
    inputs: [
      { id: 'mass', label: 'Object Mass', type: 'number', defaultValue: 8, step: 0.5, unit: 'kg' },
      { id: 'velocity', label: 'Object Velocity', type: 'number', defaultValue: 10, step: 0.5, unit: 'm/s' }
    ],
    formula: 'Kinetic Energy (KE) = 0.5 * Mass * Velocity^2',
    explanation: 'Measures the active kinetic energy of a moving object.',
    example: 'An 8 kg mass moving at 10 m/s generates 400.00 Joules of kinetic energy.',
    faq: [{ question: 'What is a Joule?', answer: 'The SI unit of energy, equivalent to the work done by a force of one Newton moving through a distance of one meter.' }],
    relatedSlugs: ['momentum-calculator-physics', 'power-calculator-physics'],
    calculate: (inputs) => {
      const m = Number(inputs.mass) || 0;
      const v = Number(inputs.velocity) || 0;
      const ke = 0.5 * m * Math.pow(v, 2);
      return {
        results: [
          { label: 'Kinetic Energy (KE)', value: ke.toFixed(2), unit: 'Joules (J)', isPrimary: true },
          { label: 'Energy calorie Equivalency', value: (ke * 0.239006).toFixed(2), unit: 'cal' }
        ]
      };
    }
  },
  {
    id: 'momentum-calculator-physics',
    name: 'Momentum Calculator',
    slug: 'momentum-calculator-physics',
    category: 'science',
    description: 'Calculate physical linear momentum based on mass and velocity.',
    seoTitle: 'Linear Momentum Solver | Calculatoora',
    seoDescription: 'Find linear momentum by entering mass and physical velocity.',
    inputs: [
      { id: 'mass', label: 'Physical Mass (m)', type: 'number', defaultValue: 15, step: 0.5, unit: 'kg' },
      { id: 'velocity', label: 'Linear Velocity (v)', type: 'number', defaultValue: 4, step: 0.5, unit: 'm/s' }
    ],
    formula: 'Momentum (p) = Mass (m) * Velocity (v)',
    explanation: 'Momentum measures the mass of an object multiplied by its velocity.',
    example: 'A 15 kg mass traveling at 4 m/s generates 60.00 kg·m/s of momentum.',
    faq: [{ question: 'How is momentum conserved?', answer: 'The law of conservation of momentum states that the total momentum of a closed system remains constant if no external forces act on it.' }],
    relatedSlugs: ['force-calculator-physics', 'energy-calculator-physics'],
    calculate: (inputs) => {
      const m = Number(inputs.mass) || 0;
      const v = Number(inputs.velocity) || 0;
      return {
        results: [
          { label: 'Linear Momentum (p)', value: (m * v).toFixed(2), unit: 'kg·m/s', isPrimary: true },
          { label: 'Combined kinetic Energy Equivalency', value: (0.5 * m * v * v).toFixed(1), unit: 'Joules' }
        ]
      };
    }
  },
  {
    id: 'power-calculator-physics',
    name: 'Power Calculator',
    slug: 'power-calculator-physics',
    category: 'science',
    description: 'Calculate mechanical power as work divided by elapsed time.',
    seoTitle: 'Physics Power Solver (Watts) | Calculatoora',
    seoDescription: 'Find mechanical power in Watts by entering physical work and elapsed time.',
    inputs: [
      { id: 'work', label: 'Work Done / Energy', type: 'number', defaultValue: 1500, step: 50, unit: 'J' },
      { id: 'time', label: 'Time Elapsed', type: 'number', defaultValue: 3, step: 0.1, unit: 's' }
    ],
    formula: 'Power (P) = Work (W) / Time (t)',
    explanation: 'Power measures the rate at which work is done or energy is transferred.',
    example: 'Performing 1,500 Joules of work in 3 seconds generates 500 Watts of power.',
    faq: [{ question: 'What is horsepower?', answer: 'A unit of power equivalent to approximately 746 Watts.' }],
    relatedSlugs: ['energy-calculator-physics', 'force-calculator-physics'],
    calculate: (inputs) => {
      const w = Number(inputs.work) || 0;
      const t = Number(inputs.time) || 1;
      return {
        results: [
          { label: 'Mechanical Power (P)', value: (w / t).toFixed(2), unit: 'Watts (W)', isPrimary: true },
          { label: 'Power Horsepower Equivalency', value: (w / t / 745.699872).toFixed(3), unit: 'HP' }
        ]
      };
    }
  },
  {
    id: 'wave-calculator',
    name: 'Wave Calculator',
    slug: 'wave-calculator',
    category: 'science',
    description: 'Calculate velocity, frequency, or wavelength of waves in physical mediums.',
    seoTitle: 'Wave Velocity & Wavelength Solver | Calculatoora',
    seoDescription: 'Determine wave velocity by multiplying wavelength by frequency.',
    inputs: [
      { id: 'wavelength', label: 'Wavelength (λ)', type: 'number', defaultValue: 2.5, step: 0.1, unit: 'm' },
      { id: 'frequency', label: 'Wave Frequency (f)', type: 'number', defaultValue: 120, step: 5, unit: 'Hz' }
    ],
    formula: 'Velocity (v) = Wavelength (λ) * Frequency (f)',
    explanation: 'Calculates wave propagation speed in light or sound mediums.',
    example: 'A wavelength of 2.5 meters oscillating at 120 Hz travels at 300 m/s.',
    faq: [{ question: 'What is wave period?', answer: 'The reciprocal of frequency (1/f), representing the time taken for one complete wave cycle to pass a point.' }],
    relatedSlugs: ['frequency-calculator', 'velocity-calculator'],
    calculate: (inputs) => {
      const w = Number(inputs.wavelength) || 0;
      const f = Number(inputs.frequency) || 0;
      return {
        results: [
          { label: 'Wave Velocity (v)', value: (w * f).toFixed(2), unit: 'm/s', isPrimary: true },
          { label: 'Wave Period (T)', value: f > 0 ? (1 / f).toFixed(6) : 'Infinity', unit: 's' }
        ]
      };
    }
  },
  {
    id: 'frequency-calculator',
    name: 'Frequency Calculator',
    slug: 'frequency-calculator',
    category: 'science',
    description: 'Calculate wave frequency based on propagation velocity and wavelength.',
    seoTitle: 'Frequency & Period Solver | Calculatoora',
    seoDescription: 'Find wave frequencies in Hertz by entering propagation velocity and wavelength details.',
    inputs: [
      { id: 'velocity', label: 'Wave velocity', type: 'number', defaultValue: 343, step: 10, unit: 'm/s' },
      { id: 'wavelength', label: 'Wavelength (λ)', type: 'number', defaultValue: 0.5, step: 0.05, unit: 'm' }
    ],
    formula: 'Frequency (f) = Velocity (v) / Wavelength (λ)',
    explanation: 'Solves for the number of wave cycles passing a fixed point per unit of time.',
    example: 'A sound wave traveling at 343 m/s with a 0.5 meter wavelength has a frequency of 686 Hz.',
    faq: [{ question: 'What is the limit of human hearing?', answer: 'Humans can typically detect sound frequencies between 20 Hz and 20,000 Hz (20 kHz).' }],
    relatedSlugs: ['wave-calculator', 'power-calculator-physics'],
    calculate: (inputs) => {
      const v = Number(inputs.velocity) || 343;
      const w = Number(inputs.wavelength) || 1;

      const f = w > 0 ? v / w : 0;
      return {
        results: [
          { label: 'Calculated Frequency (f)', value: f.toFixed(2), unit: 'Hertz (Hz)', isPrimary: true },
          { label: 'Wave period Equivalency', value: f > 0 ? (1 / f).toFixed(6) : '0', unit: 's' }
        ]
      };
    }
  }
];
