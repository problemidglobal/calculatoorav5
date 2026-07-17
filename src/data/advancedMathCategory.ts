import { Calculator } from '../types';

export const ADVANCED_MATH_CALCULATORS: Calculator[] = [
  // ====================================== MATHEMATICS ======================================
  {
    id: 'math-algebra-solve',
    name: 'Algebra Calculator',
    slug: 'algebra-calculator',
    category: 'math',
    description: 'Solve the simple algebra equation a * x + b = c for the variable x.',
    seoTitle: 'Algebra Linear Equation Solver | Calculatoora',
    seoDescription: 'Solve simple algebra equations (ax + b = c) for variable X instantly.',
    inputs: [
      { id: 'a', label: 'Coefficient a', type: 'number', defaultValue: 5 },
      { id: 'b', label: 'Constant b', type: 'number', defaultValue: 10 },
      { id: 'c', label: 'Constant c', type: 'number', defaultValue: 30 }
    ],
    formula: 'x = (c - b) / a',
    explanation: 'Basic algebra isolates the variable x by performing inverse operations symmetrically on both sides of the equation.',
    example: 'For the equation 5x + 10 = 30, solving for x yields 4.0.',
    faq: [
      { question: 'What if coefficient a is zero?', answer: 'If a = 0 and b != c, no solution exists for x as division by zero is mathematically undefined.' }
    ],
    relatedSlugs: ['equation-solver', 'linear-equation-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 1;
      const b = Number(inputs.b) || 0;
      const c = Number(inputs.c) || 0;

      if (a === 0) {
        return {
          results: [{ label: 'Error', value: 'Coefficient a cannot be zero.', isPrimary: true }]
        };
      }

      const x = (c - b) / a;

      return {
        results: [
          { label: 'Solved variable value (x)', value: x.toFixed(3), isPrimary: true },
          { label: 'Equation representation', value: `${a}x + ${b} = ${c}` }
        ]
      };
    }
  },
  {
    id: 'math-equation-solver',
    name: 'Equation Solver (Ratios)',
    slug: 'equation-solver',
    category: 'math',
    description: 'Solve equations in the format (x / a) = (b / c), finding the unknown variable x.',
    seoTitle: 'Algebra Ratio Equation Solver | Calculatoora',
    seoDescription: 'Model ratios to find missing values using cross-multiplication mathematics.',
    inputs: [
      { id: 'a', label: 'Constant a', type: 'number', defaultValue: 4 },
      { id: 'b', label: 'Constant b', type: 'number', defaultValue: 15 },
      { id: 'c', label: 'Constant c', type: 'number', defaultValue: 5 }
    ],
    formula: 'x = (a * b) / c',
    explanation: 'Cross-multiplying allows you to solve proportional equations and find the missing scaling parameter.',
    example: 'For (x / 4) = (15 / 5), cross-multiplying yields x = 12.0.',
    faq: [
      { question: 'What are direct proportions?', answer: 'Proportions where one variable scales linearly with another, maintaining a constant ratio.' }
    ],
    relatedSlugs: ['algebra-calculator', 'proportion-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 1;
      const b = Number(inputs.b) || 0;
      const c = Number(inputs.c) || 1;

      if (c === 0) {
        return {
          results: [{ label: 'Error', value: 'Constant c cannot be zero.', isPrimary: true }]
        };
      }

      const x = (a * b) / c;

      return {
        results: [
          { label: 'Value of x', value: x.toFixed(3), isPrimary: true },
          { label: 'Normalized Ratio', value: (b / c).toFixed(4) }
        ]
      };
    }
  },
  {
    id: 'math-linear-eq',
    name: 'Linear Equation System Solver',
    slug: 'linear-equation-calculator',
    category: 'math',
    description: 'Solve systems of two linear equations in two variables (x and y) using Cramer’s Rule.',
    seoTitle: 'Systems of 2x2 Linear Equations Solver | Calculatoora',
    seoDescription: 'Solve systems of lines and find coordinate intercepts instantly.',
    inputs: [
      { id: 'a1', label: 'Equation 1: a1', type: 'number', defaultValue: 2 },
      { id: 'b1', label: 'Equation 1: b1', type: 'number', defaultValue: 3 },
      { id: 'c1', label: 'Equation 1: c1', type: 'number', defaultValue: 12 },
      { id: 'a2', label: 'Equation 2: a2', type: 'number', defaultValue: 1 },
      { id: 'b2', label: 'Equation 2: b2', type: 'number', defaultValue: -1 },
      { id: 'c2', label: 'Equation 2: c2', type: 'number', defaultValue: 1 }
    ],
    formula: 'Cramer’s Rule: D = a1*b2 - a2*b1 \nDx = c1*b2 - c2*b1, Dy = a1*c2 - a2*c1 \nx = Dx / D, y = Dy / D',
    explanation: 'A system of linear equations represents intersecting lines: solving for x and y finds the exact coordinates of their intersection.',
    example: 'For the system: 2x + 3y = 12 and x - y = 1, solving yields coordinates x = 3.0, y = 2.0.',
    faq: [
      { question: 'What does a zero determinant mean?', answer: 'If determinant D is zero, the lines are either parallel (no intersection) or collinear (coincident).' }
    ],
    relatedSlugs: ['algebra-calculator', 'quadratic-calculator'],
    calculate: (inputs) => {
      const a1 = Number(inputs.a1) || 1;
      const b1 = Number(inputs.b1) || 0;
      const c1 = Number(inputs.c1) || 0;
      const a2 = Number(inputs.a2) || 1;
      const b2 = Number(inputs.b2) || 0;
      const c2 = Number(inputs.c2) || 0;

      const D = a1 * b2 - a2 * b1;

      if (D === 0) {
        return {
          results: [{ label: 'Error', value: 'System determinant is zero. Lines are parallel or collinear.', isPrimary: true }]
        };
      }

      const Dx = c1 * b2 - c2 * b1;
      const Dy = a1 * c2 - a2 * c1;

      const x = Dx / D;
      const y = Dy / D;

      return {
        results: [
          { label: 'Coordinate intercept x', value: x.toFixed(3), isPrimary: true },
          { label: 'Coordinate intercept y', value: y.toFixed(3), isPrimary: true },
          { label: 'System Determinant', value: D }
        ]
      };
    }
  },
  {
    id: 'math-quadratic',
    name: 'Quadratic Equation Calculator',
    slug: 'quadratic-calculator',
    category: 'math',
    description: 'Solve standard second-degree equations (a*x² + b*x + c = 0) to find real or complex roots.',
    seoTitle: 'Quadratic Formula Solver & Extractor | Calculatoora',
    seoDescription: 'Obtain precise solutions for quadratic equations containing real or complex roots.',
    inputs: [
      { id: 'a', label: 'Coefficient a (x²)', type: 'number', defaultValue: 1 },
      { id: 'b', label: 'Coefficient b (x)', type: 'number', defaultValue: -5 },
      { id: 'c', label: 'Constant c', type: 'number', defaultValue: 6 }
    ],
    formula: 'x = (-b ± sqrt(b² - 4ac)) / 2a',
    explanation: 'Quadratic equations describe parabolas. Solving for the roots finds the points where the parabola crosses the x-axis.',
    example: 'For x² - 5x + 6 = 0, solving yields roots x1 = 3.0 and x2 = 2.0.',
    faq: [
      { question: 'What is the discriminant?', answer: 'The expression b² - 4ac under the square root. If positive, there are two distinct real roots; if zero, one real root; and if negative, two complex conjugate roots.' }
    ],
    relatedSlugs: ['algebra-calculator', 'polynomial-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 1;
      const b = Number(inputs.b) || 0;
      const c = Number(inputs.c) || 0;

      if (a === 0) {
        return {
          results: [{ label: 'Error', value: 'Coefficient a cannot be zero.', isPrimary: true }]
        };
      }

      const disc = b * b - 4 * a * c;

      if (disc > 0) {
        const x1 = (-b + Math.sqrt(disc)) / (2 * a);
        const x2 = (-b - Math.sqrt(disc)) / (2 * a);
        return {
          results: [
            { label: 'First Real Root (x1)', value: x1.toFixed(3), isPrimary: true },
            { label: 'Second Real Root (x2)', value: x2.toFixed(3), isPrimary: true },
            { label: 'Discriminant value (Δ)', value: disc }
          ]
        };
      } else if (disc === 0) {
        const x = -b / (2 * a);
        return {
          results: [
            { label: 'Double Real Root (x)', value: x.toFixed(3), isPrimary: true },
            { label: 'Discriminant value (Δ)', value: disc }
          ]
        };
      } else {
        const real = -b / (2 * a);
        const imag = Math.sqrt(-disc) / (2 * a);
        return {
          results: [
            { label: 'Complex Root 1', value: `${real.toFixed(3)} + ${imag.toFixed(3)}i`, isPrimary: true },
            { label: 'Complex Root 2', value: `${real.toFixed(3)} - ${imag.toFixed(3)}i`, isPrimary: true },
            { label: 'Discriminant value (Δ)', value: disc }
          ]
        };
      }
    }
  },
  {
    id: 'math-polynomial',
    name: 'Polynomial Evaluator',
    slug: 'polynomial-calculator',
    category: 'math',
    description: 'Evaluate polynomial expressions like a*x³ + b*x² + c*x + d for a given input value of x.',
    seoTitle: 'Polynomial Value Solver | Calculatoora',
    seoDescription: 'Evaluate third-degree polynomials for a given variable value.',
    inputs: [
      { id: 'a', label: 'Coefficient a (x³)', type: 'number', defaultValue: 2 },
      { id: 'b', label: 'Coefficient b (x²)', type: 'number', defaultValue: -3 },
      { id: 'c', label: 'Coefficient c (x)', type: 'number', defaultValue: 1 },
      { id: 'd', label: 'Constant d', type: 'number', defaultValue: 5 },
      { id: 'x', label: 'Variable x value', type: 'number', defaultValue: 2 }
    ],
    formula: 'P(x) = a*x³ + b*x² + c*x + d',
    explanation: 'Evaluating polynomials calculates the height value (y-intercept) of cubic functions at a specific point on the coordinate axis.',
    example: 'For polynomial P(x) = 2x³ - 3x² + x + 5, evaluating at x = 2 yields 11.0.',
    faq: [
      { question: 'What is polynomial degree?', answer: 'The highest exponent of the variable in the polynomial expression (e.g. 3 for a cubic polynomial).' }
    ],
    relatedSlugs: ['quadratic-calculator', 'algebra-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 0;
      const b = Number(inputs.b) || 0;
      const c = Number(inputs.c) || 0;
      const d = Number(inputs.d) || 0;
      const x = Number(inputs.x) || 0;

      const res = a * Math.pow(x, 3) + b * Math.pow(x, 2) + c * x + d;

      return {
        results: [
          { label: 'Polynomial Result P(x)', value: res.toFixed(3), isPrimary: true },
          { label: 'Evaluated function', value: `P(${x})` }
        ]
      };
    }
  },
  {
    id: 'math-factor',
    name: 'Factor Calculator',
    slug: 'factor-calculator',
    category: 'math',
    description: 'Identify all integer factors and identify primes for any whole number.',
    seoTitle: 'Integer Factor Finder & Prime Checker | Calculatoora',
    seoDescription: 'Obtain factor lists and verify prime integer statuses instantly.',
    inputs: [
      { id: 'num', label: 'Integer value', type: 'number', defaultValue: 72, min: 1, max: 100000 }
    ],
    formula: 'Divide N by all integers up to sqrt(N) to identify all exact divisors with zero remainder.',
    explanation: 'Factors are integers that multiply together to yield a target number, revealing the divisibility structure of numbers.',
    example: 'Evaluating 72 reveals 12 factors: 1, 2, 3, 4, 6, 8, 9, 12, 18, 24, 36, and 72.',
    faq: [
      { question: 'What defines a prime number?', answer: 'A positive integer greater than 1 that has exactly two distinct factors: 1 and itself.' }
    ],
    relatedSlugs: ['square-root-calculator'],
    calculate: (inputs) => {
      const v = Math.round(Number(inputs.num) || 1);

      if (v <= 0) {
        return {
          results: [{ label: 'Error', value: 'Please enter a positive integer.', isPrimary: true }]
        };
      }

      const factors: number[] = [];
      for (let i = 1; i <= Math.sqrt(v); i++) {
        if (v % i === 0) {
          factors.push(i);
          if (v / i !== i) {
            factors.push(v / i);
          }
        }
      }
      factors.sort((a, b) => a - b);
      const isPrime = factors.length === 2;

      return {
        results: [
          { label: 'Discovered Integer Factors', value: factors.join(', '), isPrimary: true },
          { label: 'Overall Factors Count', value: factors.length },
          { label: 'Is Prime status', value: isPrime ? 'Yes (Prime)' : 'No (Composite)' }
        ]
      };
    }
  },
  {
    id: 'math-exponent',
    name: 'Exponent and Power Solver',
    slug: 'exponent-calculator',
    category: 'math',
    description: 'Solve exponent powers (x^y) for standard bases and exponents.',
    seoTitle: 'Exponent Power Calculator (x^y) | Calculatoora',
    seoDescription: 'Raise values to powers or compute negative exponents easily.',
    inputs: [
      { id: 'base', label: 'Base x', type: 'number', defaultValue: 3 },
      { id: 'exp', label: 'Exponent y', type: 'number', defaultValue: 4 }
    ],
    formula: 'Result = Base ^ Exponent',
    explanation: 'Exponents denote repeated multiplication of a base value by itself matching the exponent number.',
    example: '3 raised to the power of 4 (3 * 3 * 3 * 3) yields exactly 81.0.',
    faq: [
      { question: 'What is a negative exponent?', answer: 'A negative exponent indicates reciprocal division (e.g. 3^-4 equals 1 / 3^4 = 1/81).' }
    ],
    relatedSlugs: ['log-calculator', 'cube-root-calculator'],
    calculate: (inputs) => {
      const base = Number(inputs.base) || 1;
      const exp = Number(inputs.exp) || 0;

      const res = Math.pow(base, exp);

      return {
        results: [
          { label: 'Solved Exponential Product', value: res.toString(), isPrimary: true }
        ],
        chartData: [
          { name: 'Base', value: Math.abs(base), color: '#312e81' },
          { name: 'Exponent', value: Math.abs(exp), color: '#39FF14' }
        ]
      };
    }
  },
  {
    id: 'math-log',
    name: 'Logarithm Calculator',
    slug: 'log-calculator',
    category: 'math',
    description: 'Calculate natural logarithms (ln) and common base-10 logarithms (log).',
    seoTitle: 'Logarithm (ln, log10, logB) Solver | Calculatoora',
    seoDescription: 'Evaluate logarithms for science, statistics, or custom bases.',
    inputs: [
      { id: 'val', label: 'Power Value', type: 'number', defaultValue: 100 },
      { id: 'base', label: 'Base (or choose 10 / e)', type: 'select', defaultValue: '10', options: [
        { label: 'Common base 10 (log10)', value: '10' },
        { label: 'Natural base e (ln)', value: 'e' },
        { label: 'Binary base 2 (log2)', value: '2' }
      ]}
    ],
    formula: 'log_B(x) = ln(x) / ln(B)',
    explanation: 'Logarithms calculate the inverse of exponents, determining the power exponent required to produce a given number from a base.',
    example: 'The common base-10 logarithm of 100 is exactly 2.0.',
    faq: [
      { question: 'What is base e?', answer: 'Euler’s number (e) is an irrational mathematical constant approximately equal to 2.71828, essential in finance growth modeling and physics.' }
    ],
    relatedSlugs: ['exponent-calculator'],
    calculate: (inputs) => {
      const v = Number(inputs.val) || 10;
      const bStr = inputs.base || '10';

      if (v <= 0) {
        return {
          results: [{ label: 'Error', value: 'Input values must exceed zero for logarithm calculations.', isPrimary: true }]
        };
      }

      let res = 0;
      let label = 'log10';

      if (bStr === '10') {
        res = Math.log10(v);
        label = 'Decimal Logarithm (log10)';
      } else if (bStr === 'e') {
        res = Math.log(v);
        label = 'Natural Logarithm (ln)';
      } else {
        res = Math.log2(v);
        label = 'Binary Logarithm (log2)';
      }

      return {
        results: [
          { label, value: res.toFixed(5), isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'math-sqrt',
    name: 'Square Root Calculator',
    slug: 'square-root-calculator',
    category: 'math',
    description: 'Calculate principal square roots and factor prime components of numbers.',
    seoTitle: 'Square Root & Prime Factor Radicand Solver | Calculatoora',
    seoDescription: 'Obtain principal square root values instantly.',
    inputs: [
      { id: 'radicand', label: 'Radicand Value (N)', type: 'number', defaultValue: 144, min: 0 }
    ],
    formula: 'y = sqrt(x) if y² = x',
    explanation: 'Calculating a square root determines the value that, when multiplied by itself, yields the original number.',
    example: 'The principal square root of 144 is exactly 12.0.',
    faq: [
      { question: 'Can negative numbers have real square roots?', answer: 'No, squaring any real number always yields a positive result. Square roots of negative numbers require complex/imaginary numbers (denoted as i).' }
    ],
    relatedSlugs: ['cube-root-calculator', 'exponent-calculator'],
    calculate: (inputs) => {
      const r = Number(inputs.radicand) || 0;

      if (r < 0) {
        return {
          results: [{ label: 'Error', value: 'Input must be non-negative for real roots.', isPrimary: true }]
        };
      }

      const res = Math.sqrt(r);

      return {
        results: [
          { label: 'Principal Square Root', value: res.toFixed(5), isPrimary: true },
          { label: 'Squared value check', value: (res * res).toFixed(1) }
        ]
      };
    }
  },
  {
    id: 'math-cuberoot',
    name: 'Cube Root Calculator',
    slug: 'cube-root-calculator',
    category: 'math',
    description: 'Calculate cube roots of numbers, accommodating positive and negative values.',
    seoTitle: 'Cube Root (∛x) Mathematical Solver | Calculatoora',
    seoDescription: 'Calculate cube roots quickly across standard integers.',
    inputs: [
      { id: 'val', label: 'Val (x)', type: 'number', defaultValue: 125 }
    ],
    formula: 'y = cbrt(x) if y³ = x',
    explanation: 'Calculating a cube root determines the value that, when cubed (multiplied by itself twice), yields the original number.',
    example: 'The cube root of 125 is exactly 5.0, and the cube root of -125 is exactly -5.0.',
    faq: [
      { question: 'Why can negative numbers have real cube roots?', answer: 'Multiplying negative numbers an odd number of times preserves the negative sign (e.g. -5 * -5 * -5 = -125).' }
    ],
    relatedSlugs: ['square-root-calculator', 'exponent-calculator'],
    calculate: (inputs) => {
      const x = Number(inputs.val) || 0;
      const res = Math.cbrt(x);

      return {
        results: [
          { label: 'Calculated Cube Root (∛)', value: res.toFixed(5), isPrimary: true },
          { label: 'Cubed check to verify', value: (res * res * res).toFixed(1) }
        ]
      };
    }
  },
  {
    id: 'math-matrix-2x2',
    name: 'Matrix 2x2 Operator',
    slug: 'matrix-calculator',
    category: 'math',
    description: 'Calculate transpose, inverse, and coordinate operations on standard 2x2 matrices.',
    seoTitle: 'Matrix 2x2 Transpose & Inverse Solver | Calculatoora',
    seoDescription: 'Evaluate spatial coordinate inverse metrics of 2x2 matrices.',
    inputs: [
      { id: 'm00', label: 'Row 1, Col 1', type: 'number', defaultValue: 4 },
      { id: 'm01', label: 'Row 1, Col 2', type: 'number', defaultValue: 7 },
      { id: 'm10', label: 'Row 2, Col 1', type: 'number', defaultValue: 2 },
      { id: 'm11', label: 'Row 2, Col 2', type: 'number', defaultValue: 6 }
    ],
    formula: 'Determinant = A*D - B*C \nInverse = (1/Det) * [[D, -B], [-C, A]]',
    explanation: 'Matrices organize linear equations and spatial transformations, acting as a foundation for computer graphics and 3D programming engines.',
    example: 'For matrix [[4, 7], [2, 6]], the determinant is 10.0, and the transpose yields [[4, 2], [7, 6]].',
    faq: [
      { question: 'What is a singular matrix?', answer: 'A matrix with a determinant of zero, meaning it cannot be inverted.' }
    ],
    relatedSlugs: ['determinant-calculator', 'vector-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.m00) || 0;
      const b = Number(inputs.m01) || 0;
      const c = Number(inputs.m10) || 0;
      const d = Number(inputs.m11) || 0;

      const det = a * d - b * c;
      const transposeStr = `[[${a}, ${c}], [${b}, ${d}]]`;

      let inverseStr = 'Undefined (det = 0)';
      if (det !== 0) {
        inverseStr = `[[${(d / det).toFixed(2)}, ${(-b / det).toFixed(2)}], [${(-c / det).toFixed(2)}, ${(a / det).toFixed(2)}]]`;
      }

      return {
        results: [
          { label: 'Determinant (det A)', value: det, isPrimary: true },
          { label: 'Transpose Matrix T', value: transposeStr },
          { label: 'Inverse Matrix A⁻¹', value: inverseStr }
        ]
      };
    }
  },
  {
    id: 'math-determinant',
    name: 'Determinant Calculator',
    slug: 'determinant-calculator',
    category: 'math',
    description: 'Calculate 2x2 determinants value solutions and analyze linear scaling.',
    seoTitle: 'Matrix 2x2 Determinant scaling Solver | Calculatoora',
    seoDescription: 'Obtain 2x2 determinants instantly.',
    inputs: [
      { id: 'a', label: 'Val a (top left)', type: 'number', defaultValue: 3 },
      { id: 'b', label: 'Val b (top right)', type: 'number', defaultValue: 8 },
      { id: 'c', label: 'Val c (bottom left)', type: 'number', defaultValue: 4 },
      { id: 'd', label: 'Val d (bottom right)', type: 'number', defaultValue: 6 }
    ],
    formula: 'Det = a * d - b * c',
    explanation: 'The determinant measures the scaling factor of the linear transform described by a matrix, reflecting the area amplification of spatial shapes.',
    example: 'For [[3, 8], [4, 6]], the determinant scales to exactly -14.0.',
    faq: [
      { question: 'What does a negative determinant represent?', answer: 'A negative determinant indicates that the linear transformation reverses spatial orientation (e.g., flipping a shape over).' }
    ],
    relatedSlugs: ['matrix-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.a) || 0;
      const b = Number(inputs.b) || 0;
      const c = Number(inputs.c) || 0;
      const d = Number(inputs.d) || 0;

      const det = a * d - b * c;

      return {
        results: [
          { label: 'Determinant Value', value: det, isPrimary: true }
        ]
      };
    }
  },
  {
    id: 'math-vector-dot',
    name: 'Vector 2D Calculator',
    slug: 'vector-calculator',
    category: 'math',
    description: 'Calculate dot product, magnitudes, and angular steps between two 2D coordinate vectors.',
    seoTitle: '2D Vector Dot Product Solver | Calculatoora',
    seoDescription: 'Calculate dot products and magnitudes between 2D directional vectors.',
    inputs: [
      { id: 'ux', label: 'Vector U: x', type: 'number', defaultValue: 3 },
      { id: 'uy', label: 'Vector U: y', type: 'number', defaultValue: 4 },
      { id: 'vx', label: 'Vector V: x', type: 'number', defaultValue: 5 },
      { id: 'vy', label: 'Vector V: y', type: 'number', defaultValue: -2 }
    ],
    formula: 'Dot Product = Ux*Vx + Uy*Vy \nMagnitude = sqrt(x² + y²)',
    explanation: 'Vectors define physical magnitudes directions. The dot product determines spatial alignment, holding positive values when pointing in similar directions.',
    example: 'For vectors U(3,4) and V(5,-2), the dot product is 7.0, and the magnitude of U is 5.0.',
    faq: [
      { question: 'What is an orthogonal vector?', answer: 'Vectors whose dot product is zero, meaning they are perfectly perpendicular (90 degrees apart).' }
    ],
    relatedSlugs: ['matrix-calculator'],
    calculate: (inputs) => {
      const ux = Number(inputs.ux) || 0;
      const uy = Number(inputs.uy) || 0;
      const vx = Number(inputs.vx) || 0;
      const vy = Number(inputs.vy) || 0;

      const dot = ux * vx + uy * vy;
      const magU = Math.sqrt(ux * ux + uy * uy);
      const magV = Math.sqrt(vx * vx + vy * vy);

      return {
        results: [
          { label: 'Vector Dot Product', value: dot, isPrimary: true },
          { label: 'Magnitude of Vector U', value: magU.toFixed(3) },
          { label: 'Magnitude of Vector V', value: magV.toFixed(3) }
        ]
      };
    }
  },
  {
    id: 'math-triangle',
    name: 'Triangle Trigonometry Calculator',
    slug: 'triangle-calculator',
    category: 'math',
    description: 'Solve right-triangle Hypotenuse lengths, areas, and internal angles using the Pythagorean Theorem and trigonometric functions.',
    seoTitle: 'Right Triangle Pythagorean Trigonometry Solver | Calculatoora',
    seoDescription: 'Solve right triangle properties, angles, and area calculations easily.',
    inputs: [
      { id: 'sideA', label: 'Opposite Side a', type: 'number', defaultValue: 6 },
      { id: 'sideB', label: 'Adjacent Side b', type: 'number', defaultValue: 8 }
    ],
    formula: 'Hypotenuse c = sqrt(a² + b²) \nArea = 0.5 * a * b',
    explanation: 'Trigonometric formulas relate the side lengths of a right triangle to its acute internal angles, essential for land surveying and physics calculations.',
    example: 'A right triangle with sides of 6.0 and 8.0 has a hypotenuse of 10.0 and a total area of 24.0.',
    faq: [
      { question: 'What is the sine function?', answer: 'The trigonometric ratio of the opposite side length over the hypotenuse length for a given acute angle.' }
    ],
    relatedSlugs: ['circle-calculator', 'geometry-calculator'],
    calculate: (inputs) => {
      const a = Number(inputs.sideA) || 3;
      const b = Number(inputs.sideB) || 4;

      const c = Math.sqrt(a * a + b * b);
      const area = 0.5 * a * b;
      const alpha = Math.atan2(a, b) * (180 / Math.PI); // degrees
      const beta = 90 - alpha;

      return {
        results: [
          { label: 'Hypotenuse (c)', value: c.toFixed(3), isPrimary: true },
          { label: 'Triangle Area', value: area.toFixed(2) },
          { label: 'Angle Alpha (α opposite a)', value: `${alpha.toFixed(1)}°` },
          { label: 'Angle Beta (β opposite b)', value: `${beta.toFixed(1)}°` }
        ],
        chartData: [
          { name: 'Side a', value: a, color: '#312e81' },
          { name: 'Side b', value: b, color: '#39FF14' },
          { name: 'Hypotenuse c', value: Math.round(c), color: '#3b82f6' }
        ]
      };
    }
  },
  {
    id: 'math-circle-sol',
    name: 'Circle Geometry Calculator',
    slug: 'circle-calculator',
    category: 'math',
    description: 'Evaluate physical circle properties (including circumference and area) given coordinates or radii.',
    seoTitle: 'Circle Radius Area & Circumference Solver | Calculatoora',
    seoDescription: 'Determine circle geometries based on radius parameters.',
    inputs: [
      { id: 'radius', label: 'Circle Radius (r)', type: 'number', defaultValue: 7, min: 0 }
    ],
    formula: 'Circumference = 2 * π * r \nArea = π * r²',
    explanation: 'The mathematical constant Pi (π ≈ 3.14159) represents the fixed ratio of any circle’s circumference to its diameter.',
    example: 'A circle with a radius of 7.0 has an area of 153.94 and a circumference of 43.98.',
    faq: [
      { question: 'What is the value of Pi?', answer: 'Pi represents the infinite, non-repeating decimal constant approximately equal to 3.14159.' }
    ],
    relatedSlugs: ['triangle-calculator', 'geometry-calculator'],
    calculate: (inputs) => {
      const r = Number(inputs.radius) || 1;

      const area = Math.PI * r * r;
      const circum = 2 * Math.PI * r;

      return {
        results: [
          { label: 'Calculated Circle Area', value: area.toFixed(3), isPrimary: true },
          { label: 'Circle Circumference', value: circum.toFixed(3) },
          { label: 'Circle Diameter', value: (r * 2).toFixed(1) }
        ]
      };
    }
  },
  {
    id: 'math-geometry-3d',
    name: '3D Geometry Volumetric Solver',
    slug: 'geometry-calculator',
    category: 'math',
    description: 'Calculate volume and surface area statistics of spheres, cylinders, and cones.',
    seoTitle: '3D Volumetric Shape Solver | Calculatoora',
    seoDescription: 'Model 3D volumes of spheres, cylinders, and cones.',
    inputs: [
      { id: 'shape', label: 'Target 3D Shape', type: 'select', defaultValue: 'cylinder', options: [
        { label: 'Cylinder', value: 'cylinder' },
        { label: 'Sphere', value: 'sphere' },
        { label: 'Cone', value: 'cone' }
      ]},
      { id: 'radius', label: 'Radius (r)', type: 'number', defaultValue: 5 },
      { id: 'height', label: 'Height (h) [Cylinder/Cone]', type: 'number', defaultValue: 12 }
    ],
    formula: 'Sphere Vol = (4/3)*π*r³ \nCylinder Vol = π*r²*h \nCone Vol = (1/3)*π*r²*h',
    explanation: 'Calculating the volume of three-dimensional geometric shapes is fundamental for manufacturing sizing and material storage engineering.',
    example: 'A cylinder with a 5.0 radius and 12.0 height holds a volume of exactly 942.48 cubic units.',
    faq: [
      { question: 'Why does a cone hold exactly 1/3 of a cylinder?', answer: 'A cone and a cylinder with identical base dimensions and heights share a 1:3 volume ratio under integral calculus derivations.' }
    ],
    relatedSlugs: ['circle-calculator', 'triangle-calculator'],
    calculate: (inputs) => {
      const shape = inputs.shape || 'cylinder';
      const r = Number(inputs.radius) || 1;
      const h = Number(inputs.height) || 1;

      let vol = 0;
      let label = 'Cylinder Volume';

      if (shape === 'cylinder') {
        vol = Math.PI * r * r * h;
        label = 'Computed Cylinder Volume';
      } else if (shape === 'sphere') {
        vol = (4 / 3) * Math.PI * Math.pow(r, 3);
        label = 'Computed Sphere Volume';
      } else {
        vol = (1 / 3) * Math.PI * r * r * h;
        label = 'Computed Cone Volume';
      }

      return {
        results: [
          { label, value: vol.toFixed(3), unit: 'units³', isPrimary: true }
        ]
      };
    }
  },

  // ====================================== STATISTICS ======================================
  {
    id: 'stats-stddev',
    name: 'Standard Deviation Solver',
    slug: 'standard-deviation-calculator',
    category: 'math',
    description: 'Calculate sample and population standard deviation, mean average, and variances of datasets.',
    seoTitle: 'Detailed Standard Deviation Calculator | Calculatoora',
    seoDescription: 'Input a series of comma-separated numbers to run full statistical analyses.',
    inputs: [
      { id: 'values', label: 'Dataset (Comma Separated)', type: 'text', defaultValue: '12, 18, 22, 17, 30, 25' }
    ],
    formula: 'StdDev s = sqrt( Sum((x_i - mean)²)/(N - 1) ) \nPopulation σ = sqrt( Sum((x_i - mean)²)/N )',
    explanation: 'Standard deviation measures dataset dispersion. High standard deviation indicates that data points are widely spread relative to the mean average.',
    example: 'For dataset 12, 18, 22, 17, 30, 25, the standard deviation is 6.22.',
    faq: [
      { question: 'Why divide by N-1 in sample calculations?', answer: 'Bessel’s correction: dividing by N-1 compensates for bias when estimating population variances from a limited sample size.' }
    ],
    relatedSlugs: ['variance-calculator', 'z-score-calculator'],
    calculate: (inputs) => {
      const raw = inputs.values || '12, 18, 22, 17, 30, 25';
      const arr = raw.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));

      if (arr.length < 2) {
        return {
          results: [{ label: 'Error', value: 'Please enter at least 2 valid numbers.', isPrimary: true }]
        };
      }

      const mean = arr.reduce((acc, v) => acc + v, 0) / arr.length;
      const sumSq = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);

      const sampleVar = sumSq / (arr.length - 1);
      const popVar = sumSq / arr.length;

      const sampleSd = Math.sqrt(sampleVar);
      const popSd = Math.sqrt(popVar);

      return {
        results: [
          { label: 'Sample Standard Deviation (s)', value: sampleSd.toFixed(4), isPrimary: true },
          { label: 'Population Standard Deviation (σ)', value: popSd.toFixed(4) },
          { label: 'Arithmetic Mean (Average)', value: mean.toFixed(2) },
          { label: 'Sample Variance (s²)', value: sampleVar.toFixed(4) }
        ],
        chartData: arr.map((v, i) => ({
          name: `Pt ${i + 1}`,
          value: v,
          color: '#39FF14'
        }))
      };
    }
  },
  {
    id: 'stats-variance',
    name: 'Variance Calculator',
    slug: 'variance-calculator',
    category: 'math',
    description: 'Verify population and sample dataset variance limits to calculate overall dispersion.',
    seoTitle: 'Sample & Population Variance Solver | Calculatoora',
    seoDescription: 'Analyze dataset variance and spread parameters instantly.',
    inputs: [
      { id: 'values', label: 'Dataset (Comma Separated)', type: 'text', defaultValue: '5, 10, 15, 20, 25' }
    ],
    formula: 'Variance = Mean of squared differences from the Arithmetic Mean.',
    explanation: 'Variance measures how far data points are spread out from their average, equal to the standard deviation squared.',
    example: 'For dataset 5, 10, 15, 20, 25, the sample variance averages to exactly 62.50.',
    faq: [
      { question: 'Why can variance be large?', answer: 'Because variance squares the differences from the mean, its units are squared, causing values to appear larger than standard deviations.' }
    ],
    relatedSlugs: ['standard-deviation-calculator', 'z-score-calculator'],
    calculate: (inputs) => {
      const raw = inputs.values || '5, 10, 15, 20, 25';
      const arr = raw.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));

      if (arr.length < 2) {
        return {
          results: [{ label: 'Error', value: 'Please enter at least 2 valid numbers.', isPrimary: true }]
        };
      }

      const mean = arr.reduce((acc, v) => acc + v, 0) / arr.length;
      const sumSq = arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0);
      const sVar = sumSq / (arr.length - 1);

      return {
        results: [
          { label: 'Sample Variance (s²)', value: sVar.toFixed(3), isPrimary: true },
          { label: 'Population Variance (σ²)', value: (sumSq / arr.length).toFixed(3) }
        ]
      };
    }
  },
  {
    id: 'stats-zscore',
    name: 'Z Score Calculator',
    slug: 'z-score-calculator',
    category: 'math',
    description: 'Calculate standard Z-scores and analyze relative standard deviations for data points.',
    seoTitle: 'Standard Z-Score & Probability Solver | Calculatoora',
    seoDescription: 'Verify data point positions relative to population means and standard deviations.',
    inputs: [
      { id: 'val', label: 'Data Point Observed (x)', type: 'number', defaultValue: 85 },
      { id: 'mean', label: 'Population Mean (μ)', type: 'number', defaultValue: 70 },
      { id: 'sd', label: 'Standard Deviation (σ)', type: 'number', defaultValue: 10, min: 0.001 }
    ],
    formula: 'Z = (x - μ) / σ',
    explanation: 'A Z-score indicates how many standard deviations an individual data point lies above or below the population mean.',
    example: 'For a score of 85.0 with a mean of 70.0 and deviation of 10.0, the Z-score is 1.50.',
    faq: [
      { question: 'What does a negative Z-score signify?', answer: 'A negative Z-score indicates that the observed data point lies below the population mean.' }
    ],
    relatedSlugs: ['standard-deviation-calculator', 'normal-distribution-calculator'],
    calculate: (inputs) => {
      const x = Number(inputs.val) || 0;
      const m = Number(inputs.mean) || 0;
      const sd = Number(inputs.sd) || 1;

      const z = (x - m) / sd;

      return {
        results: [
          { label: 'Calculated Z-Score', value: z.toFixed(4), isPrimary: true },
          { label: 'Distance from Mean', value: `${(x - m).toFixed(1)} units` }
        ]
      };
    }
  },
  {
    id: 'stats-normal-dist',
    name: 'Normal Distribution CDF Calculator',
    slug: 'normal-distribution-calculator',
    category: 'math',
    description: 'Evaluate cumulative probability density under normal distribution curves.',
    seoTitle: 'Normal Distribution Cumulative Solver | Calculatoora',
    seoDescription: 'Calculate percentile thresholds and normal curve boundaries.',
    inputs: [
      { id: 'zValue', label: 'Standard Z-score', type: 'number', defaultValue: 1.96 }
    ],
    formula: 'CDF P(Z <= z) = 0.5 * (1 + Erf(z / sqrt(2)))',
    explanation: 'The Normal Distribution (Bell Curve) models random variables. Calculating the CDF determines the percentile rank associated with a given Z-score.',
    example: 'A Z-score of 1.96 represents approximately the 97.5th percentile.',
    faq: [
      { question: 'Why is 1.96 standard in stats?', answer: 'An interval defined by ±1.96 standard deviations from the mean contains exactly 95% of the total distribution.' }
    ],
    relatedSlugs: ['z-score-calculator', 'standard-deviation-calculator'],
    calculate: (inputs) => {
      const z = Number(inputs.zValue) || 0;

      // Numerical approximation of error function (Erf)
      const erf = (x: number): number => {
        const a1 =  0.254829592;
        const a2 = -0.284496736;
        const a3 =  1.421413741;
        const a4 = -1.453152027;
        const a5 =  1.061405429;
        const p  =  0.3275911;

        const sign = x < 0 ? -1 : 1;
        const absX = Math.abs(x);

        const t = 1.0 / (1.0 + p * absX);
        const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

        return sign * y;
      };

      const cdf = 0.5 * (1 + erf(z / Math.sqrt(2)));

      return {
        results: [
          { label: 'Cumulative Probability P(Z <= z)', value: cdf.toFixed(5), isPrimary: true },
          { label: 'Percentile Rank', value: `${(cdf * 100).toFixed(2)}%` }
        ]
      };
    }
  },
  {
    id: 'stats-sample-size',
    name: 'Sample Size Choice Calculator',
    slug: 'sample-size-calculator',
    category: 'math',
    description: 'Determine the correct sample size needed for scientific surveys based on confidence levels and margins of error.',
    seoTitle: 'Scientific Survey Sample Size Calculator | Calculatoora',
    seoDescription: 'Solve sample group sizes required for representative polling results.',
    inputs: [
      { id: 'confidence', label: 'Confidence level desired', type: 'select', defaultValue: '95', options: [
        { label: '95% Confidence (z=1.96)', value: '95' },
        { label: '99% Confidence (z=2.576)', value: '99' },
        { label: '90% Confidence (z=1.645)', value: '90' }
      ]},
      { id: 'margin', label: 'Margin of Error Allowed (%)', type: 'number', defaultValue: 5, min: 1, max: 20 }
    ],
    formula: 'Sample Size N = (Z² * p * (1-p)) / MoE² \n(p assumed 0.5 for maximum variance protection)',
    explanation: 'Calculating the required sample size ensures that polls and surveys gather sufficient data to reflect the broader population accurately within a set margin of error.',
    example: 'Conducting a survey with 95% confidence and a 5% margin of error requires a sample size of at least 384 participants.',
    faq: [
      { question: 'Why assume p = 0.5?', answer: 'Assuming a 50% split (p=0.5) maximizes the calculated required sample size, ensuring conservative and robust statistical validity.' }
    ],
    relatedSlugs: ['confidence-interval-calculator'],
    calculate: (inputs) => {
      const conf = inputs.confidence || '95';
      const moePct = Number(inputs.margin) || 5;

      const zMap: Record<string, number> = { '95': 1.96, '99': 2.576, '90': 1.645 };
      const z = zMap[conf] || 1.96;
      const moe = moePct / 100;

      const p = 0.5; // default high variance
      const n = (z * z * p * (1 - p)) / (moe * moe);

      return {
        results: [
          { label: 'Required Participants Size (N)', value: Math.ceil(n), isPrimary: true },
          { label: 'Confidence Multiplier z', value: z }
        ]
      };
    }
  },
  {
    id: 'stats-confidence-int',
    name: 'Confidence Interval Solver',
    slug: 'confidence-interval-calculator',
    category: 'math',
    description: 'Calculate sample confidence intervals for means using population standard deviations.',
    seoTitle: 'Sample Mean Confidence Interval Solver | Calculatoora',
    seoDescription: 'Isolate statistical margins of error and mean boundaries.',
    inputs: [
      { id: 'mean', label: 'Sample Mean Observed', type: 'number', defaultValue: 120 },
      { id: 'sd', label: 'Standard Deviation (σ)', type: 'number', defaultValue: 15 },
      { id: 'n', label: 'Sample size (N)', type: 'number', defaultValue: 100, min: 1 }
    ],
    formula: 'Margin of Error = z * (σ / sqrt(N))\nInterval = Mean ± MoE',
    explanation: 'A confidence interval bounds the range of values that likely holds the true population parameter based on sample metrics.',
    example: 'For a sample mean of 120 with a standard deviation of 15 over 100 observations, the 95% confidence interval is 117.06 to 122.94.',
    faq: [
      { question: 'What is standard error?', answer: 'The standard deviation of the sample mean estimate: calculated as σ / sqrt(N).' }
    ],
    relatedSlugs: ['sample-size-calculator', 'z-score-calculator'],
    calculate: (inputs) => {
      const mean = Number(inputs.mean) || 0;
      const sd = Number(inputs.sd) || 1;
      const N = Number(inputs.n) || 10;

      const z = 1.96; // 95% default
      const stderr = sd / Math.sqrt(N);
      const moe = z * stderr;

      return {
        results: [
          { label: 'Lower Bound (95% Conf)', value: (mean - moe).toFixed(3), isPrimary: true },
          { label: 'Upper Bound (95% Conf)', value: (mean + moe).toFixed(3), isPrimary: true },
          { label: 'Calculated Margin of Error (MoE)', value: moe.toFixed(3) }
        ]
      };
    }
  },
  {
    id: 'stats-correlation',
    name: 'Correlation Solver (Pearson r)',
    slug: 'correlation-calculator',
    category: 'math',
    description: 'Calculate the Pearson Correlation Coefficient (r) to measure strength of relationships between two data variables.',
    seoTitle: 'Pearson Correlation Coefficient Solver | Calculatoora',
    seoDescription: 'Obtain precise linear correlation indicators between variable datasets.',
    inputs: [
      { id: 'xValues', label: 'Variable X (Comma Separated)', type: 'text', defaultValue: '1, 2, 3, 4, 5' },
      { id: 'yValues', label: 'Variable Y (Comma Separated)', type: 'text', defaultValue: '2, 4, 5, 4, 6' }
    ],
    formula: 'Pearson r = Covariance(X,Y) / (StdDev(X) * StdDev(Y))',
    explanation: 'The Pearson correlation coefficient ranges from -1.0 (perfect negative correlation) to +1.0 (perfect positive correlation), measuring the direction and strength of a linear relationship between two variables.',
    example: 'For datasets [1,2,3,4,5] and [2,4,5,4,6], Pearson’s r is 0.853, indicating a strong positive correlation.',
    faq: [
      { question: 'Does correlation reveal causation?', answer: 'No, a high correlation coefficient simply indicates that two variables move together, but does not prove that one causes the other.' }
    ],
    relatedSlugs: ['variance-calculator', 'standard-deviation-calculator'],
    calculate: (inputs) => {
      const rawX = inputs.xValues || '1, 2, 3, 4, 5';
      const rawY = inputs.yValues || '2, 4, 5, 4, 6';

      const x = rawX.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));
      const y = rawY.split(',').map(n => Number(n.trim())).filter(n => !isNaN(n));

      const len = Math.min(x.length, y.length);

      if (len < 3) {
        return {
          results: [{ label: 'Error', value: 'Please enter at least 3 matching variables pairs.', isPrimary: true }]
        };
      }

      const meanX = x.slice(0, len).reduce((a, b) => a + b, 0) / len;
      const meanY = y.slice(0, len).reduce((a, b) => a + b, 0) / len;

      let num = 0;
      let denX = 0;
      let denY = 0;

      for (let i = 0; i < len; i++) {
        const xDiff = x[i] - meanX;
        const yDiff = y[i] - meanY;
        num += xDiff * yDiff;
        denX += xDiff * xDiff;
        denY += yDiff * yDiff;
      }

      const r = (denX * denY) !== 0 ? num / Math.sqrt(denX * denY) : 0;
      const rSq = r * r;

      return {
        results: [
          { label: 'Pearson Correlation (r)', value: r.toFixed(3), isPrimary: true },
          { label: 'Coefficient of Determination (R²)', value: rSq.toFixed(3) },
          { label: 'Relationship Strength', value: Math.abs(r) >= 0.7 ? 'Strong relationship' : 'Moderate/Weak relationship' }
        ]
      };
    }
  },
  {
    id: 'graphing-calculator',
    name: 'Graphing Calculator',
    slug: 'graphing-calculator',
    category: 'math',
    description: 'Solve, plot, and analyze equations with the browser\'s most advanced graphing calculator. Plot unlimited functions, analyze roots, turning points, intersections, derivatives, integrals, and view 3D coordinates.',
    seoTitle: 'Graphing Calculator | Calculatoora',
    seoDescription: 'An advanced mathematical graphing calculator. Plot Cartesian, Polar, Parametric, and Implicit equations client-side with full point analysis, derivatives, integrals, regression, and 3D mode.',
    inputs: [],
    formula: 'y = f(x)',
    explanation: 'Interactive graphing interface to plot functions, find critical points, compute derivatives/integrals, compare systems of functions, and render 3D topologies fully client-side.',
    example: 'Enter y = x^2 - 4 to graph a parabola with roots at x = -2 and x = 2.',
    faq: [
      { question: 'How do I type exponents?', answer: 'Use the carat symbol (^), e.g., x^2 for x-squared.' },
      { question: 'What coordinate systems are supported?', answer: 'Cartesian (x, y), Polar (r, theta), Parametric (x(t), y(t)), and 3D (x, y, z) functions.' }
    ],
    relatedSlugs: ['algebra-calculator', 'linear-equation-calculator', 'derivative-calculator'],
    calculate: (inputs) => {
      return {
        results: [
          { label: 'Status', value: 'Ready', isPrimary: true }
        ]
      };
    }
  }
];
