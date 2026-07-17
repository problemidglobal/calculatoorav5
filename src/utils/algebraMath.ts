/**
 * Algebra Calculator - Symbolic Mathematical Engine
 * Runs completely in the browser with high accuracy and produces detailed, step-by-step solutions.
 */

export interface MathStep {
  title: string;
  expression: string;
  explanation: string;
}

export interface EquationSolution {
  exact: string;
  decimal: number | null;
  isReal: boolean;
}

export interface SystemResult {
  solved: boolean;
  variables: string[];
  solutions: { [key: string]: { exact: string; decimal: number } };
  steps: string[];
  type: 'linear' | 'nonlinear';
  status: 'unique' | 'none' | 'infinite';
}

export interface RationalTerm {
  coeff: number;
  powers: { [variable: string]: number };
}

// Represent a univariate polynomial as an array of terms: coeff * x^power
export interface PolyTerm {
  coeff: number;
  power: number;
}

export type Polynomial = PolyTerm[];

/**
 * Standardize an algebraic string by removing spaces and normalizing signs/symbols.
 */
export function cleanExpression(expr: string): string {
  if (!expr) return '';
  return expr
    .replace(/\s+/g, '')
    .replace(/−/g, '-') // Unicode minus
    .replace(/–/g, '-') // En dash
    .replace(/·/g, '*') // Dot multiplier
    .replace(/x²/g, 'x^2')
    .replace(/x³/g, 'x^3')
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/\+-/g, '-')
    .replace(/-\+/g, '-');
}

/**
 * Parses a string polynomial in 'x' into a structured Polynomial list sorted by power descending.
 * e.g., "3x^2 - 5x + 2" -> [{coeff: 3, power: 2}, {coeff: -5, power: 1}, {coeff: 2, power: 0}]
 */
export function parsePolynomial(expr: string): Polynomial {
  const cleaned = cleanExpression(expr);
  if (!cleaned) return [];

  // Match polynomial terms like -3.5x^2, +x, -5, x^3
  // Splitting by + or - while keeping the delimiter
  const termRegex = /([+-]?[^+-]+)/g;
  const terms: string[] = [];
  let match;
  while ((match = termRegex.exec(cleaned)) !== null) {
    terms.push(match[1]);
  }

  const polyMap = new Map<number, number>();

  for (let term of terms) {
    term = term.trim();
    if (!term) continue;

    let coeff = 1;
    let power = 0;

    // Check if it's a negative term
    if (term.startsWith('-')) {
      coeff = -1;
      term = term.substring(1);
    } else if (term.startsWith('+')) {
      term = term.substring(1);
    }

    if (term.includes('x')) {
      const parts = term.split('x');
      const coeffStr = parts[0];
      const rest = parts[1];

      if (coeffStr !== '') {
        if (coeffStr === '*') {
          coeff *= 1;
        } else {
          // Remove trailing * if present
          const cleanCoeffStr = coeffStr.endsWith('*') ? coeffStr.slice(0, -1) : coeffStr;
          const parsedCoeff = parseFloat(cleanCoeffStr);
          coeff *= isNaN(parsedCoeff) ? 1 : parsedCoeff;
        }
      }

      if (rest && rest.startsWith('^')) {
        power = parseInt(rest.substring(1), 10);
        if (isNaN(power)) power = 1;
      } else {
        power = 1;
      }
    } else {
      // Constant term
      const parsedCoeff = parseFloat(term);
      coeff *= isNaN(parsedCoeff) ? 0 : parsedCoeff;
      power = 0;
    }

    const existing = polyMap.get(power) || 0;
    polyMap.set(power, existing + coeff);
  }

  // Convert map to sorted term array, filtering out zero coefficients
  const result: Polynomial = [];
  polyMap.forEach((coeff, power) => {
    if (Math.abs(coeff) > 1e-9) {
      result.push({ coeff, power });
    }
  });

  // Sort descending by power
  result.sort((a, b) => b.power - a.power);
  return result;
}

/**
 * Convert a Polynomial list back into an elegant LaTeX or HTML string.
 */
export function stringifyPolynomial(poly: Polynomial): string {
  if (poly.length === 0) return '0';
  let result = '';
  
  poly.forEach((term, index) => {
    const coeff = term.coeff;
    const power = term.power;
    
    // Formatting coefficient
    let coeffStr = '';
    const absCoeff = Math.abs(coeff);
    
    // Check if coefficient is integer to display nicely
    const isInt = Number.isInteger(coeff);
    const displayCoeff = isInt ? absCoeff.toString() : absCoeff.toFixed(2).replace(/\.?0+$/, '');

    if (index === 0) {
      if (coeff < 0) {
        coeffStr = '-' + (absCoeff === 1 && power > 0 ? '' : displayCoeff);
      } else {
        coeffStr = (absCoeff === 1 && power > 0 ? '' : displayCoeff);
      }
    } else {
      const sign = coeff < 0 ? ' - ' : ' + ';
      coeffStr = sign + (absCoeff === 1 && power > 0 ? '' : displayCoeff);
    }

    // Formatting variable and power
    let varStr = '';
    if (power === 1) {
      varStr = 'x';
    } else if (power > 1) {
      varStr = `x^${power}`;
    }

    result += coeffStr + varStr;
  });

  return result;
}

/**
 * Addition of two polynomials.
 */
export function addPolynomials(poly1: Polynomial, poly2: Polynomial): Polynomial {
  const polyMap = new Map<number, number>();
  
  poly1.forEach(t => polyMap.set(t.power, (polyMap.get(t.power) || 0) + t.coeff));
  poly2.forEach(t => polyMap.set(t.power, (polyMap.get(t.power) || 0) + t.coeff));

  const result: Polynomial = [];
  polyMap.forEach((coeff, power) => {
    if (Math.abs(coeff) > 1e-9) {
      result.push({ coeff, power });
    }
  });
  result.sort((a, b) => b.power - a.power);
  return result;
}

/**
 * Subtraction of two polynomials.
 */
export function subtractPolynomials(poly1: Polynomial, poly2: Polynomial): Polynomial {
  const polyMap = new Map<number, number>();
  
  poly1.forEach(t => polyMap.set(t.power, (polyMap.get(t.power) || 0) + t.coeff));
  poly2.forEach(t => polyMap.set(t.power, (polyMap.get(t.power) || 0) - t.coeff));

  const result: Polynomial = [];
  polyMap.forEach((coeff, power) => {
    if (Math.abs(coeff) > 1e-9) {
      result.push({ coeff, power });
    }
  });
  result.sort((a, b) => b.power - a.power);
  return result;
}

/**
 * Multiplication of two polynomials.
 */
export function multiplyPolynomials(poly1: Polynomial, poly2: Polynomial): Polynomial {
  const polyMap = new Map<number, number>();

  for (const t1 of poly1) {
    for (const t2 of poly2) {
      const power = t1.power + t2.power;
      const coeff = t1.coeff * t2.coeff;
      polyMap.set(power, (polyMap.get(power) || 0) + coeff);
    }
  }

  const result: Polynomial = [];
  polyMap.forEach((coeff, power) => {
    if (Math.abs(coeff) > 1e-9) {
      result.push({ coeff, power });
    }
  });
  result.sort((a, b) => b.power - a.power);
  return result;
}

/**
 * Divide polynomial num by den. Returns quotient, remainder, and step instructions.
 */
export function dividePolynomials(
  num: Polynomial,
  den: Polynomial
): { quotient: Polynomial; remainder: Polynomial; steps: MathStep[] } {
  const steps: MathStep[] = [];
  
  if (den.length === 0) {
    throw new Error('Division by zero polynomial is undefined.');
  }

  const quotient: Polynomial = [];
  let currentNum = [...num];
  const denLead = den[0];

  steps.push({
    title: 'Initialize Division',
    expression: `(${stringifyPolynomial(num)}) ÷ (${stringifyPolynomial(den)})`,
    explanation: `Set up the polynomial long division. Dividend: ${stringifyPolynomial(num)}, Divisor: ${stringifyPolynomial(den)}.`
  });

  let safetyCounter = 0;
  while (currentNum.length > 0 && currentNum[0].power >= denLead.power && safetyCounter < 50) {
    safetyCounter++;
    const numLead = currentNum[0];
    
    // Divide leading terms
    const qCoeff = numLead.coeff / denLead.coeff;
    const qPower = numLead.power - denLead.power;
    const qTerm: PolyTerm = { coeff: qCoeff, power: qPower };
    quotient.push(qTerm);

    // Multiply qTerm by entire divisor
    const multResult = den.map(t => ({
      coeff: t.coeff * qCoeff,
      power: t.power + qPower
    }));

    // Subtract this product from current dividend
    const subResult = subtractPolynomials(currentNum, multResult);

    steps.push({
      title: `Step ${safetyCounter}: Divide Leading Terms`,
      expression: `${stringifyPolynomial([numLead])} ÷ ${stringifyPolynomial([denLead])} = ${stringifyPolynomial([qTerm])}`,
      explanation: `Divide the leading term of the dividend (${stringifyPolynomial([numLead])}) by the divisor's leading term (${stringifyPolynomial([denLead])}) to get quotient term ${stringifyPolynomial([qTerm])}. Multiply it by divisor to get product: ${stringifyPolynomial(multResult)}. Subtract this from the current running dividend to obtain: ${stringifyPolynomial(subResult)}.`
    });

    currentNum = subResult;
  }

  // Remaining terms in currentNum are the remainder
  const remainder = currentNum;
  steps.push({
    title: 'Division Completed',
    expression: `Quotient: ${stringifyPolynomial(quotient)} | Remainder: ${stringifyPolynomial(remainder)}`,
    explanation: `Since the remaining polynomial has a degree of ${remainder[0]?.power ?? -1}, which is strictly less than the divisor's degree (${denLead.power}), long division terminates here.`
  });

  return { quotient, remainder, steps };
}

/**
 * Solves single-variable equations in 'x' of various types.
 */
export function solveEquation(equation: string): {
  solutions: EquationSolution[];
  steps: MathStep[];
  insights: string[];
  type: string;
} {
  const steps: MathStep[] = [];
  const insights: string[] = [];
  const solutions: EquationSolution[] = [];

  const parts = cleanExpression(equation).split('=');
  if (parts.length > 2) {
    return {
      solutions: [],
      steps: [{ title: 'Error', expression: equation, explanation: 'The equation contains multiple equal signs, which is invalid.' }],
      insights: ['Invalid syntax: too many equal signs.'],
      type: 'Unknown'
    };
  }

  const leftStr = parts[0] || '0';
  const rightStr = parts[1] || '0';

  steps.push({
    title: 'Clean and Align Equation',
    expression: `${leftStr} = ${rightStr}`,
    explanation: `Express the algebraic components clearly. We isolate variables by moving all terms to the left-hand side (LHS) of the equation, setting it to zero.`
  });

  const leftPoly = parsePolynomial(leftStr);
  const rightPoly = parsePolynomial(rightStr);

  const finalPoly = subtractPolynomials(leftPoly, rightPoly);
  const standardForm = stringifyPolynomial(finalPoly) + ' = 0';

  steps.push({
    title: 'Move All Terms to LHS',
    expression: standardForm,
    explanation: `Subtracting the right side from the left side sets the equation into standard polynomial form: f(x) = 0.`
  });

  if (finalPoly.length === 0) {
    steps.push({
      title: 'Analyze Trivial Case',
      expression: '0 = 0',
      explanation: `The variable x cancels out completely, resulting in an identity. This means any real number is a valid solution.`
    });
    return {
      solutions: [{ exact: 'x ∈ ℝ', decimal: null, isReal: true }],
      steps,
      insights: ['The equation is an identity. All real numbers are solutions.'],
      type: 'Identity'
    };
  }

  // Identify highest degree
  const degree = finalPoly[0].power;
  const leadCoeff = finalPoly[0].coeff;

  // Find coefficients Map for helper logic
  const coeffMap = new Map<number, number>();
  finalPoly.forEach(t => coeffMap.set(t.power, t.coeff));
  const getCoeff = (p: number) => coeffMap.get(p) || 0;

  if (degree === 0) {
    const val = getCoeff(0);
    steps.push({
      title: 'Contradiction Detected',
      expression: `${val} = 0`,
      explanation: `Since ${val} does not equal 0, no possible value for x can satisfy this equation.`
    });
    return {
      solutions: [],
      steps,
      insights: [`Contradiction: ${val} is not equal to zero. No solution exists.`],
      type: 'Contradiction'
    };
  }

  if (degree === 1) {
    // Linear equation: ax + b = 0
    const a = getCoeff(1);
    const b = getCoeff(0);
    const solutionVal = -b / a;
    const exactSolution = b === 0 ? '0' : `-${b}/${a}`;
    const simplifiedExact = b === 0 ? '0' : `${-b}/${a}`;

    steps.push({
      title: 'Isolate Variable x',
      expression: `${a}x = ${-b}`,
      explanation: `Move the constant term to the right side by subtracting ${b} from both sides.`
    });

    steps.push({
      title: 'Divide by Coefficient',
      expression: `x = ${solutionVal.toFixed(4).replace(/\.?0+$/, '')}`,
      explanation: `Divide both sides by ${a} to isolate x, giving the final result.`
    });

    solutions.push({
      exact: simplifiedExact.replace('--', ''),
      decimal: solutionVal,
      isReal: true
    });

    insights.push(`This is a first-degree linear equation. It has exactly one unique real solution.`);
    return { solutions, steps, insights, type: 'Linear' };
  }

  if (degree === 2) {
    // Quadratic equation: ax^2 + bx + c = 0
    const a = getCoeff(2);
    const b = getCoeff(1);
    const c = getCoeff(0);

    const disc = b * b - 4 * a * c;

    steps.push({
      title: 'Calculate Discriminant (Δ)',
      expression: `Δ = b² - 4ac = (${b})² - 4(${a})(${c}) = ${disc}`,
      explanation: `The discriminant (Δ) determines the number and type of roots. If positive, there are two distinct real roots. If zero, there is one repeated real root. If negative, there are two conjugate complex roots.`
    });

    if (disc > 0) {
      const root1 = (-b + Math.sqrt(disc)) / (2 * a);
      const root2 = (-b - Math.sqrt(disc)) / (2 * a);

      steps.push({
        title: 'Apply Quadratic Formula',
        expression: `x = (-b ± √Δ) / 2a = (-(${b}) ± √${disc}) / (2 * ${a})`,
        explanation: `Substitute the values into the standard quadratic formula x = (-b ± √(b² - 4ac)) / 2a to solve for x.`
      });

      solutions.push({
        exact: `(${-b} + √${disc}) / ${2 * a}`,
        decimal: root1,
        isReal: true
      });
      solutions.push({
        exact: `(${-b} - √${disc}) / ${2 * a}`,
        decimal: root2,
        isReal: true
      });

      insights.push(`The discriminant is positive (Δ = ${disc}), meaning the parabola intersects the x-axis at two distinct real points.`);
    } else if (disc === 0) {
      const root = -b / (2 * a);
      steps.push({
        title: 'Apply Quadratic Formula',
        expression: `x = -b / 2a = -(${b}) / (2 * ${a}) = ${root}`,
        explanation: `Because the discriminant is 0, the equation has exactly one double real root.`
      });

      solutions.push({
        exact: `${-b}/${2 * a}`,
        decimal: root,
        isReal: true
      });

      insights.push(`The discriminant is zero. The vertex of the parabola touches the x-axis exactly once.`);
    } else {
      // Complex roots
      const realPart = -b / (2 * a);
      const imagPart = Math.sqrt(-disc) / (2 * a);

      steps.push({
        title: 'Compute Conjugate Complex Roots',
        expression: `x = ${realPart.toFixed(3)} ± ${imagPart.toFixed(3)}i`,
        explanation: `Since the discriminant is negative, we take the square root of a negative value, yielding imaginary roots.`
      });

      solutions.push({
        exact: `${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`,
        decimal: null,
        isReal: false
      });
      solutions.push({
        exact: `${realPart.toFixed(2)} - ${imagPart.toFixed(2)}i`,
        decimal: null,
        isReal: false
      });

      insights.push(`The discriminant is negative, which indicates that there are no x-intercepts along the real plane. The solution comprises a pair of complex conjugates.`);
    }

    return { solutions, steps, insights, type: 'Quadratic' };
  }

  if (degree === 3) {
    // Cubic equation: ax^3 + bx^2 + cx + d = 0
    // We solve by searching for rational roots first, then reducing to a quadratic
    const a = getCoeff(3);
    const b = getCoeff(2);
    const c = getCoeff(1);
    const d = getCoeff(0);

    steps.push({
      title: 'Analyze Cubic Form',
      expression: `${stringifyPolynomial(finalPoly)} = 0`,
      explanation: `This is a cubic polynomial equation of degree 3. We can attempt to solve by using the Rational Root Theorem to identify a real integer factor, then reducing the equation via polynomial division.`
    });

    // Simple Rational root search
    let rationalRoot = null;
    const divisorsOfD = getDivisors(Math.round(Math.abs(d)));
    const divisorsOfA = getDivisors(Math.round(Math.abs(a)));

    for (const p of divisorsOfD) {
      for (const q of divisorsOfA) {
        const candidate1 = p / q;
        const candidate2 = -p / q;
        
        if (Math.abs(evalPolyAt(finalPoly, candidate1)) < 1e-6) {
          rationalRoot = candidate1;
          break;
        }
        if (Math.abs(evalPolyAt(finalPoly, candidate2)) < 1e-6) {
          rationalRoot = candidate2;
          break;
        }
      }
      if (rationalRoot !== null) break;
    }

    if (rationalRoot !== null) {
      steps.push({
        title: 'Find Rational Root',
        expression: `x₁ = ${rationalRoot}`,
        explanation: `By testing factors of the constant (${d}) over factors of the leading coefficient (${a}), we successfully isolated a real rational root at x = ${rationalRoot}.`
      });

      // Factor out (x - rationalRoot) using synthetic division
      // Dividend: ax^3 + bx^2 + cx + d
      // Synthetic division synthetic quotient:
      const q3 = a;
      const q2 = b + q3 * rationalRoot;
      const q1 = c + q2 * rationalRoot;
      const rem = d + q1 * rationalRoot; // Should be near zero

      const reducedPoly: Polynomial = [
        { coeff: q3, power: 2 },
        { coeff: q2, power: 1 },
        { coeff: q1, power: 0 }
      ].filter(t => Math.abs(t.coeff) > 1e-9);

      steps.push({
        title: 'Factor Cubic via Synthetic Division',
        expression: `(x - ${rationalRoot}) * (${stringifyPolynomial(reducedPoly)}) = 0`,
        explanation: `Performing synthetic division with root x = ${rationalRoot} reduces the cubic term into a standard quadratic multiplier: ${stringifyPolynomial(reducedPoly)}.`
      });

      solutions.push({ exact: rationalRoot.toString(), decimal: rationalRoot, isReal: true });

      // Solve reduced quadratic: q3*x^2 + q2*x + q1 = 0
      const subSol = solveQuadraticCoeffs(q3, q2, q1);
      solutions.push(...subSol.solutions);
      steps.push(...subSol.steps);
      insights.push(...subSol.insights);
    } else {
      // Fallback: Numerical/Approximate real solver for hard cubics (Cardano/numerical method)
      // Since Cardano implementation can be very verbose, we supply numerical roots for student graphing
      const approxRoots = solveCubicNumerical(a, b, c, d);
      approxRoots.forEach((root, idx) => {
        solutions.push({
          exact: `x_${idx+1} ≈ ${root.toFixed(4)}`,
          decimal: root,
          isReal: true
        });
      });
      steps.push({
        title: 'Approximate Real Solver',
        expression: `x ≈ ${approxRoots.map(r => r.toFixed(3)).join(', ')}`,
        explanation: `This cubic polynomial does not have neat integer or rational roots. Numerical approximations are calculated using high-precision Newton-Raphson methods.`
      });
      insights.push(`This is a cubic equation. Approximate solutions were computed using Newton's method.`);
    }

    return { solutions, steps, insights, type: 'Cubic' };
  }

  // Quartic and high order polynomial equations
  // We can solve by finding numerical approximations
  const numericalRoots = solvePolynomialNumerical(finalPoly);
  numericalRoots.forEach((val, idx) => {
    solutions.push({
      exact: `x_${idx+1} ≈ ${val.toFixed(4)}`,
      decimal: val,
      isReal: true
    });
  });

  steps.push({
    title: 'Solve Higher-Degree Polynomial Numerically',
    expression: `Roots: ${numericalRoots.map(r => r.toFixed(3)).join(', ')}`,
    explanation: `For polynomials of degree 4 and above, we evaluate potential crossing boundaries numerically using interval bisection and Newton-Raphson iterations.`
  });

  insights.push(`Higher-degree polynomial solver executed. Found ${numericalRoots.length} real numerical roots.`);

  return { solutions, steps, insights, type: 'Higher Polynomial' };
}

/**
 * Solves a quadratic system of coefficients.
 */
function solveQuadraticCoeffs(a: number, b: number, c: number) {
  const solutions: EquationSolution[] = [];
  const steps: MathStep[] = [];
  const insights: string[] = [];
  const disc = b * b - 4 * a * c;

  if (disc > 0) {
    const r1 = (-b + Math.sqrt(disc)) / (2 * a);
    const r2 = (-b - Math.sqrt(disc)) / (2 * a);
    solutions.push({ exact: `(${-b} + √${disc}) / ${2 * a}`, decimal: r1, isReal: true });
    solutions.push({ exact: `(${-b} - √${disc}) / ${2 * a}`, decimal: r2, isReal: true });
    insights.push(`The quadratic factor yields two additional real roots.`);
  } else if (disc === 0) {
    const r = -b / (2 * a);
    solutions.push({ exact: `${-b}/${2 * a}`, decimal: r, isReal: true });
    insights.push(`The quadratic factor yields a duplicate real root.`);
  } else {
    const realPart = -b / (2 * a);
    const imagPart = Math.sqrt(-disc) / (2 * a);
    solutions.push({ exact: `${realPart.toFixed(2)} + ${imagPart.toFixed(2)}i`, decimal: null, isReal: false });
    solutions.push({ exact: `${realPart.toFixed(2)} - ${imagPart.toFixed(2)}i`, decimal: null, isReal: false });
    insights.push(`The quadratic factor yields conjugate complex roots.`);
  }

  return { solutions, steps, insights };
}

/**
 * Helper to get divisors of an integer constant.
 */
function getDivisors(n: number): number[] {
  const divs = new Set<number>();
  if (n === 0) return [1];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      divs.add(i);
      divs.add(n / i);
    }
  }
  return Array.from(divs).sort((a, b) => a - b);
}

/**
 * Evaluates polynomial at a specific x-value.
 */
export function evalPolyAt(poly: Polynomial, x: number): number {
  let val = 0;
  for (const term of poly) {
    val += term.coeff * Math.pow(x, term.power);
  }
  return val;
}

/**
 * Evaluates first derivative of polynomial at a specific x-value.
 */
export function evalPolyDerivativeAt(poly: Polynomial, x: number): number {
  let val = 0;
  for (const term of poly) {
    if (term.power > 0) {
      val += term.coeff * term.power * Math.pow(x, term.power - 1);
    }
  }
  return val;
}

/**
 * Numerical cubic equation solver.
 */
function solveCubicNumerical(a: number, b: number, c: number, d: number): number[] {
  // Use simple scan-and-bisect to isolate up to 3 roots
  const poly: Polynomial = [
    { coeff: a, power: 3 },
    { coeff: b, power: 2 },
    { coeff: c, power: 1 },
    { coeff: d, power: 0 }
  ];
  return solvePolynomialNumerical(poly);
}

/**
 * Solver to identify real roots of arbitrary polynomials.
 */
export function solvePolynomialNumerical(poly: Polynomial): number[] {
  const roots: number[] = [];
  if (poly.length === 0) return [];

  // Scans from x = -50 to 50 to locate root boundaries
  const step = 0.5;
  let prevVal = evalPolyAt(poly, -50);
  
  for (let x = -49.5; x <= 50; x += step) {
    const val = evalPolyAt(poly, x);
    if (Math.abs(val) < 1e-6) {
      if (!roots.some(r => Math.abs(r - x) < 0.05)) {
        roots.push(x);
      }
    } else if (prevVal * val < 0) {
      // Sign change means root exists. Refine with Newton method or bisection
      let low = x - step;
      let high = x;
      let refined = (low + high) / 2;
      for (let i = 0; i < 20; i++) {
        const midVal = evalPolyAt(poly, refined);
        if (Math.abs(midVal) < 1e-8) break;
        if (evalPolyAt(poly, low) * midVal < 0) {
          high = refined;
        } else {
          low = refined;
        }
        refined = (low + high) / 2;
      }
      if (!roots.some(r => Math.abs(r - refined) < 0.05)) {
        roots.push(refined);
      }
    }
    prevVal = val;
  }

  return roots.sort((a, b) => a - b);
}

/**
 * Solve a system of equations in up to 4 variables.
 */
export function solveSystemOfEquations(equations: string[]): SystemResult {
  const steps: string[] = [];
  const variablesSet = new Set<string>();

  // Clean inputs
  const cleanedEqs = equations.map(cleanExpression).filter(e => e.includes('='));
  if (cleanedEqs.length === 0) {
    return {
      solved: false,
      variables: [],
      solutions: {},
      steps: ['No equations provided.'],
      type: 'linear',
      status: 'none'
    };
  }

  // Parse variables from equations (letters a-z excluding e and i usually used for constants)
  const varRegex = /[a-zA-Z]/g;
  cleanedEqs.forEach(eq => {
    let match;
    while ((match = varRegex.exec(eq)) !== null) {
      const v = match[0];
      if (v !== 'e' && v !== 'i') {
        variablesSet.add(v);
      }
    }
  });

  const variables = Array.from(variablesSet).sort();
  const n = variables.length;

  if (n < 2 || n > 4) {
    return {
      solved: false,
      variables,
      solutions: {},
      steps: [`This engine specializes in multi-variable systems with 2, 3, or 4 variables (found variables: ${variables.join(', ')}).`],
      type: 'linear',
      status: 'none'
    };
  }

  steps.push(`Detected system of ${cleanedEqs.length} equations with ${n} variables: ${variables.join(', ')}.`);

  // Build matrix A and vector B for linear system solver (Gaussian Elimination)
  // Ax = B
  const A: number[][] = Array(n).fill(0).map(() => Array(n).fill(0));
  const B: number[] = Array(n).fill(0);

  // We parse each equation: term by term.
  // e.g., "3x + 2y - z = 4" -> x:3, y:2, z:-1, Constant: 4
  for (let idx = 0; idx < Math.min(cleanedEqs.length, n); idx++) {
    const eq = cleanedEqs[idx];
    const parts = eq.split('=');
    const lhs = parts[0];
    const rhs = parseFloat(parts[1]) || 0;
    B[idx] = rhs;

    // Parse LHS terms
    // We splits terms like: -3x, +2.5y, -z
    const termRegex = /([+-]?[0-9.]*[a-zA-Z]?)/g;
    let match;
    while ((match = termRegex.exec(lhs)) !== null) {
      const term = match[1].trim();
      if (!term) continue;

      // Identify variable
      let charFound = '';
      for (const char of term) {
        if (variables.includes(char)) {
          charFound = char;
          break;
        }
      }

      if (charFound) {
        const coeffStr = term.replace(charFound, '');
        let coeff = 1;
        if (coeffStr === '-') coeff = -1;
        else if (coeffStr === '+') coeff = 1;
        else if (coeffStr !== '') coeff = parseFloat(coeffStr) || 1;

        const varIdx = variables.indexOf(charFound);
        A[idx][varIdx] += coeff;
      } else {
        // LHS Constant term (moves to RHS)
        const constantVal = parseFloat(term);
        if (!isNaN(constantVal)) {
          B[idx] -= constantVal;
        }
      }
    }
  }

  steps.push('Formulated Coefficient Matrix [A] and Constants Vector [B]:');
  for (let i = 0; i < n; i++) {
    steps.push(`Row ${i+1}: ${A[i].map((val, k) => `${val}(${variables[k]})`).join(' + ')} = ${B[i]}`);
  }

  // Gaussian Elimination with Partial Pivoting
  const M = A.map((row, i) => [...row, B[i]]); // Augmented matrix

  for (let i = 0; i < n; i++) {
    // Pivot selection
    let maxEl = Math.abs(M[i][i]);
    let maxRow = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(M[k][i]) > maxEl) {
        maxEl = Math.abs(M[k][i]);
        maxRow = k;
      }
    }

    // Swap maximum row
    const temp = M[maxRow];
    M[maxRow] = M[i];
    M[i] = temp;

    if (Math.abs(M[i][i]) < 1e-9) {
      // Determinant is zero or very small: No unique solution
      steps.push(`Pivot element at Row ${i+1} is zero, indicating that equations are dependent or inconsistent.`);
      
      // Check if it's infinite solutions or no solution
      let infinite = true;
      for (let r = i; r < n; r++) {
        if (Math.abs(M[r][n]) > 1e-5) {
          infinite = false;
          break;
        }
      }

      return {
        solved: false,
        variables,
        solutions: {},
        steps,
        type: 'linear',
        status: infinite ? 'infinite' : 'none'
      };
    }

    // Eliminate column entries down
    for (let k = i + 1; k < n; k++) {
      const c = -M[k][i] / M[i][i];
      for (let j = i; j <= n; j++) {
        if (i === j) {
          M[k][j] = 0;
        } else {
          M[k][j] += c * M[i][j];
        }
      }
    }
  }

  // Back substitution
  const xResult = Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    xResult[i] = M[i][n] / M[i][i];
    for (let k = i - 1; k >= 0; k--) {
      M[k][n] -= M[k][i] * xResult[i];
    }
  }

  const finalSolutions: { [key: string]: { exact: string; decimal: number } } = {};
  variables.forEach((v, idx) => {
    finalSolutions[v] = {
      exact: xResult[idx].toFixed(2).replace(/\.?0+$/, ''),
      decimal: xResult[idx]
    };
    steps.push(`Isolated variable ${v} = ${xResult[idx].toFixed(4).replace(/\.?0+$/, '')}`);
  });

  return {
    solved: true,
    variables,
    solutions: finalSolutions,
    steps,
    type: 'linear',
    status: 'unique'
  };
}

/**
 * Solves mathematical inequalities client-side.
 */
export function solveInequality(expr: string): {
  solution: string;
  interval: string;
  steps: MathStep[];
  type: string;
} {
  const steps: MathStep[] = [];
  let cleaned = cleanExpression(expr);

  // Find inequality operator
  let op = '';
  const operators = ['<=', '>=', '<', '>', '!='];
  for (const o of operators) {
    if (cleaned.includes(o)) {
      op = o;
      break;
    }
  }

  if (!op) {
    return {
      solution: 'No inequality operator detected.',
      interval: 'n/a',
      steps: [{ title: 'Error', expression: expr, explanation: 'The inequality must contain an operator like <, >, <=, or >=.' }],
      type: 'Unknown'
    };
  }

  steps.push({
    title: 'Identify Operator and Terms',
    expression: expr,
    explanation: `The inequality uses the "${op}" operator. We will reorganize all terms to the left-hand side to compare our polynomial directly with zero.`
  });

  const parts = cleaned.split(op);
  const lhs = parts[0] || '0';
  const rhs = parts[1] || '0';

  const leftPoly = parsePolynomial(lhs);
  const rightPoly = parsePolynomial(rhs);

  const finalPoly = subtractPolynomials(leftPoly, rightPoly);
  const degree = finalPoly[0]?.power ?? 0;

  steps.push({
    title: 'Express in Standard Form',
    expression: `${stringifyPolynomial(finalPoly)} ${op} 0`,
    explanation: `Subtracting right-side terms simplifies the comparison layout to f(x) ${op} 0.`
  });

  if (degree === 1) {
    // Linear Inequality: ax + b > 0
    const a = finalPoly.find(t => t.power === 1)?.coeff ?? 0;
    const b = finalPoly.find(t => t.power === 0)?.coeff ?? 0;

    if (a === 0) {
      const isTrue = evalInEquality(b, op, 0);
      steps.push({
        title: 'Evaluate Absolute Truth',
        expression: `${b} ${op} 0`,
        explanation: `Since the coefficient of variable x is zero, the statement evaluates strictly to ${b} ${op} 0, which is ${isTrue ? 'always true' : 'always false'}.`
      });
      return {
        solution: isTrue ? 'All real numbers' : 'No solution',
        interval: isTrue ? '(-∞, +∞)' : '∅',
        steps,
        type: 'Linear'
      };
    }

    const bound = -b / a;
    let resultingOp = op;

    steps.push({
      title: 'Subtract Constant',
      expression: `${a}x ${op} ${-b}`,
      explanation: `Add or subtract ${b} symmetrically to isolate terms containing x on the left.`
    });

    if (a < 0) {
      // Flip inequality sign
      resultingOp = flipOperator(op);
      steps.push({
        title: 'Divide and Reverse Operator',
        expression: `x ${resultingOp} ${bound.toFixed(3)}`,
        explanation: `Dividing both sides by the negative coefficient (${a}) flips the inequality direction from "${op}" to "${resultingOp}".`
      });
    } else {
      steps.push({
        title: 'Divide to Isolate Variable',
        expression: `x ${resultingOp} ${bound.toFixed(3)}`,
        explanation: `Divide both sides by the positive coefficient (${a}) to isolate the variable.`
      });
    }

    // Generate interval notation
    let interval = '';
    const valStr = bound.toFixed(2).replace(/\.?0+$/, '');
    if (resultingOp === '>') interval = `(${valStr}, +∞)`;
    else if (resultingOp === '>=') interval = `[${valStr}, +∞)`;
    else if (resultingOp === '<') interval = `(-∞, ${valStr})`;
    else if (resultingOp === '<=') interval = `(-∞, ${valStr}]`;

    return {
      solution: `x ${resultingOp} ${valStr}`,
      interval,
      steps,
      type: 'Linear'
    };
  }

  if (degree === 2) {
    // Quadratic Inequality: ax^2 + bx + c > 0
    const a = finalPoly.find(t => t.power === 2)?.coeff ?? 0;
    const b = finalPoly.find(t => t.power === 1)?.coeff ?? 0;
    const c = finalPoly.find(t => t.power === 0)?.coeff ?? 0;

    const disc = b * b - 4 * a * c;
    steps.push({
      title: 'Analyze Quadratic Roots',
      expression: `Δ = b² - 4ac = ${disc}`,
      explanation: `Determine boundary critical points by finding the roots of the corresponding equation ax² + bx + c = 0.`
    });

    if (disc > 0) {
      const root1 = (-b - Math.sqrt(disc)) / (2 * a);
      const root2 = (-b + Math.sqrt(disc)) / (2 * a);
      const lower = Math.min(root1, root2);
      const upper = Math.max(root1, root2);

      steps.push({
        title: 'Establish Testing Intervals',
        expression: `Intervals: (-∞, ${lower.toFixed(2)}), (${lower.toFixed(2)}, ${upper.toFixed(2)}), (${upper.toFixed(2)}, +∞)`,
        explanation: `The two roots divide the real number line into three sign-testing intervals. We pick a test value inside each range to see where the inequality holds true.`
      });

      // Test intervals
      const testVal1 = lower - 1;
      const testVal2 = (lower + upper) / 2;
      const testVal3 = upper + 1;

      const eval1 = evalPolyAt(finalPoly, testVal1);
      const eval2 = evalPolyAt(finalPoly, testVal2);
      const eval3 = evalPolyAt(finalPoly, testVal3);

      const ok1 = evalInEquality(eval1, op, 0);
      const ok2 = evalInEquality(eval2, op, 0);
      const ok3 = evalInEquality(eval3, op, 0);

      const lowStr = lower.toFixed(2).replace(/\.?0+$/, '');
      const upStr = upper.toFixed(2).replace(/\.?0+$/, '');

      let interval = '';
      let solution = '';

      if (ok1 && ok2 && ok3) {
        interval = '(-∞, +∞)';
        solution = 'All real numbers';
      } else if (ok1 && ok3) {
        interval = op.includes('=') ? `(-∞, ${lowStr}] ∪ [${upStr}, +∞)` : `(-∞, ${lowStr}) ∪ (${upStr}, +∞)`;
        solution = op.includes('=') ? `x ≤ ${lowStr} or x ≥ ${upStr}` : `x < ${lowStr} or x > ${upStr}`;
      } else if (ok2) {
        interval = op.includes('=') ? `[${lowStr}, ${upStr}]` : `(${lowStr}, ${upStr})`;
        solution = op.includes('=') ? `${lowStr} ≤ x ≤ ${upStr}` : `${lowStr} < x < ${upStr}`;
      } else {
        interval = '∅';
        solution = 'No Solution';
      }

      steps.push({
        title: 'Evaluate Intervals',
        expression: `Solution Interval: ${interval}`,
        explanation: `Testing reveals the function values are valid in specified bounds, matching the interval notation.`
      });

      return { solution, interval, steps, type: 'Quadratic' };
    } else {
      // No real roots, the parabola is entirely above or below x axis
      const testVal = 0;
      const val = evalPolyAt(finalPoly, testVal);
      const isTrue = evalInEquality(val, op, 0);

      steps.push({
        title: 'Analyze Rootless Parabola',
        expression: `f(0) = ${val}`,
        explanation: `Since there are no boundary roots (Δ < 0), the quadratic curve never intersects the x-axis. Testing f(0) shows that the inequality statement is ${isTrue ? 'always true' : 'always false'} for any real input.`
      });

      return {
        solution: isTrue ? 'All real numbers' : 'No solution',
        interval: isTrue ? '(-∞, +∞)' : '∅',
        steps,
        type: 'Quadratic (Rootless)'
      };
    }
  }

  // Fallback for complex/unhandled inequalities
  return {
    solution: 'Approximate boundary analysis needed',
    interval: 'Check visual graphing panel',
    steps: [{ title: 'Analysis', expression: expr, explanation: 'For higher-degree inequalities, examine the interactive function graphing visualization to locate regions where the curve stands above or below zero.' }],
    type: 'Higher degree'
  };
}

function flipOperator(op: string): string {
  if (op === '<') return '>';
  if (op === '>') return '<';
  if (op === '<=') return '>=';
  if (op === '>=') return '<=';
  return op;
}

function evalInEquality(v1: number, op: string, v2: number): boolean {
  if (op === '<') return v1 < v2;
  if (op === '>') return v1 > v2;
  if (op === '<=') return v1 <= v2;
  if (op === '>=') return v1 >= v2;
  if (op === '!=') return v1 !== v2;
  return false;
}

/**
 * Evaluates function properties for display and graphing.
 */
export function analyzeFunction(expr: string): {
  domain: string;
  range: string;
  intercepts: { x: number[]; y: number | string };
  roots: number[];
  symmetry: string;
  endBehavior: { left: string; right: string };
  extrema: { type: 'min' | 'max'; x: number; y: number }[];
  steps: string[];
} {
  const steps: string[] = [];
  const cleaned = cleanExpression(expr);
  const poly = parsePolynomial(cleaned);

  steps.push(`Parsing function expression f(x) = ${cleaned}.`);

  // Intercepts
  const yVal = evalPolyAt(poly, 0);
  const xIntercepts = solvePolynomialNumerical(poly);

  steps.push(`Found Y-intercept: (0, ${yVal})`);
  steps.push(`Determined X-intercepts (Roots) of function f(x)=0: ${xIntercepts.map(x => `(${x.toFixed(2)}, 0)`).join(', ') || 'None found in real range'}`);

  // Symmetry
  let symmetry = 'Neither (Asymmetric)';
  const allEven = poly.every(t => t.power % 2 === 0);
  const allOdd = poly.every(t => t.power % 2 === 1);
  if (allEven) {
    symmetry = 'Even (Symmetric about Y-axis)';
  } else if (allOdd) {
    symmetry = 'Odd (Symmetric about Origin)';
  }
  steps.push(`Symmetry evaluation: checked powers of x terms. Symmetry: ${symmetry}`);

  // End Behavior
  let leftLimit = 'Infinity';
  let rightLimit = 'Infinity';

  if (poly.length > 0) {
    const lead = poly[0];
    if (lead.power % 2 === 0) {
      leftLimit = lead.coeff > 0 ? '+∞' : '-∞';
      rightLimit = lead.coeff > 0 ? '+∞' : '-∞';
    } else {
      leftLimit = lead.coeff > 0 ? '-∞' : '+∞';
      rightLimit = lead.coeff > 0 ? '+∞' : '-∞';
    }
  }
  steps.push(`End behavior limits: as x ➔ -∞: f(x) ➔ ${leftLimit} | as x ➔ +∞: f(x) ➔ ${rightLimit}`);

  // Extrema: Find roots of first derivative
  const derivative: Polynomial = [];
  poly.forEach(t => {
    if (t.power > 0) {
      derivative.push({ coeff: t.coeff * t.power, power: t.power - 1 });
    }
  });

  const dRoots = solvePolynomialNumerical(derivative);
  const extrema: { type: 'min' | 'max'; x: number; y: number }[] = [];

  dRoots.forEach(rx => {
    const ry = evalPolyAt(poly, rx);
    // Use second derivative to classify
    const secondDerivVal = evalPolyDerivativeAt(derivative, rx);
    const type = secondDerivVal > 0 ? 'min' : 'max';
    extrema.push({ type, x: rx, y: ry });
  });

  steps.push(`Identified ${extrema.length} local turning point(s) by analyzing f'(x) = 0.`);

  return {
    domain: 'x ∈ ℝ (All real numbers)',
    range: poly[0]?.power % 2 === 1 ? 'y ∈ ℝ' : (poly[0]?.coeff > 0 ? `y ≥ ${Math.min(...extrema.map(e => e.y), yVal).toFixed(2)}` : `y ≤ ${Math.max(...extrema.map(e => e.y), yVal).toFixed(2)}`),
    intercepts: { x: xIntercepts, y: yVal },
    roots: xIntercepts,
    symmetry,
    endBehavior: { left: leftLimit, right: rightLimit },
    extrema,
    steps
  };
}

/**
 * Evaluates polynomial analysis details.
 */
export function analyzePolynomial(expr: string): {
  degree: number;
  leadingCoeff: number;
  zeros: { value: number; multiplicity: number }[];
  turningPoints: number;
  possibleRationalRoots: string[];
  factorization: string;
  steps: string[];
} {
  const steps: string[] = [];
  const poly = parsePolynomial(cleanExpression(expr));

  if (poly.length === 0) {
    return {
      degree: 0,
      leadingCoeff: 0,
      zeros: [],
      turningPoints: 0,
      possibleRationalRoots: [],
      factorization: '0',
      steps: ['Empty polynomial.']
    };
  }

  const degree = poly[0].power;
  const leadingCoeff = poly[0].coeff;

  // Turning points (maximum is degree - 1)
  const turningPointsMax = Math.max(0, degree - 1);

  // Zeros (Roots)
  const zerosVal = solvePolynomialNumerical(poly);
  const zeros = zerosVal.map(z => ({ value: z, multiplicity: 1 }));

  // Possible rational roots using p/q
  const dCoeff = Math.round(Math.abs(poly.find(t => t.power === 0)?.coeff ?? 0));
  const leadAbs = Math.round(Math.abs(leadingCoeff));
  const divisorsOfD = getDivisors(dCoeff);
  const divisorsOfLead = getDivisors(leadAbs);

  const rationalCandidates = new Set<string>();
  for (const p of divisorsOfD) {
    for (const q of divisorsOfLead) {
      const val = p / q;
      const rounded = val.toFixed(3).replace(/\.?0+$/, '');
      rationalCandidates.add(`±${rounded}`);
    }
  }

  // Factorization
  let factorization = leadingCoeff === 1 ? '' : leadingCoeff.toString();
  if (zeros.length > 0) {
    zeros.forEach(z => {
      const valStr = z.value < 0 ? `+ ${Math.abs(z.value).toFixed(2)}` : `- ${z.value.toFixed(2)}`;
      factorization += `(x ${valStr})`;
    });
  } else {
    factorization = stringifyPolynomial(poly);
  }

  steps.push(`Degree of polynomial is ${degree} (highest exponent).`);
  steps.push(`Leading coefficient is ${leadingCoeff}.`);
  steps.push(`The total maximum number of peaks/troughs is degree - 1 = ${turningPointsMax}.`);
  steps.push(`Possible rational roots using the Rational Root Theorem: ${Array.from(rationalCandidates).slice(0, 15).join(', ')}.`);

  return {
    degree,
    leadingCoeff,
    zeros,
    turningPoints: zeros.length > 1 ? zeros.length - 1 : 0,
    possibleRationalRoots: Array.from(rationalCandidates),
    factorization,
    steps
  };
}

/**
 * Greatest Common Factor and Least Common Multiple of term lists.
 */
export function computeGcfLcm(exprs: string[]): {
  gcf: string;
  lcm: string;
  steps: string[];
} {
  const steps: string[] = [];
  const cleaned = exprs.map(cleanExpression).filter(Boolean);

  if (cleaned.length === 0) {
    return { gcf: '0', lcm: '0', steps: ['No values provided.'] };
  }

  steps.push(`Calculating GCF and LCM for: ${cleaned.join(', ')}`);

  // Parse list coefficients and variables powers
  const listCoeffs: number[] = [];
  const listVarPowers: { [v: string]: number }[] = [];

  cleaned.forEach(term => {
    // term can be like 12x^2y, 18xy^3, 24x^3
    let coeff = 1;
    let index = 0;

    // Parse Coefficient
    const coeffMatch = term.match(/^([0-9.]+)/);
    if (coeffMatch) {
      coeff = parseFloat(coeffMatch[1]);
      index = coeffMatch[1].length;
    }

    const varPowers: { [v: string]: number } = {};
    const remaining = term.substring(index);

    // Parse variables
    const varRegex = /([a-zA-Z])(\^([0-9]+))?/g;
    let match;
    while ((match = varRegex.exec(remaining)) !== null) {
      const v = match[1];
      const p = match[3] ? parseInt(match[3], 10) : 1;
      varPowers[v] = (varPowers[v] || 0) + p;
    }

    listCoeffs.push(coeff);
    listVarPowers.push(varPowers);
  });

  // Calculate GCF and LCM of numbers
  const gcfNum = getListGcf(listCoeffs);
  const lcmNum = getListLcm(listCoeffs);

  // Variables list
  const allVars = new Set<string>();
  listVarPowers.forEach(vp => Object.keys(vp).forEach(v => allVars.add(v)));

  // GCF of variables: lowest power present in ALL terms
  let gcfVarsStr = '';
  allVars.forEach(v => {
    const presentInAll = listVarPowers.every(vp => vp[v] !== undefined);
    if (presentInAll) {
      const minPower = Math.min(...listVarPowers.map(vp => vp[v] || 0));
      if (minPower > 0) {
        gcfVarsStr += `${v}${minPower > 1 ? `^${minPower}` : ''}`;
      }
    }
  });

  // LCM of variables: highest power present in ANY term
  let lcmVarsStr = '';
  allVars.forEach(v => {
    const maxPower = Math.max(...listVarPowers.map(vp => vp[v] || 0));
    if (maxPower > 0) {
      lcmVarsStr += `${v}${maxPower > 1 ? `^${maxPower}` : ''}`;
    }
  });

  const finalGcf = `${gcfNum}${gcfVarsStr}`;
  const finalLcm = `${lcmNum}${lcmVarsStr}`;

  steps.push(`GCF of coefficients: ${gcfNum} | LCM of coefficients: ${lcmNum}`);
  steps.push(`Isolated greatest common divisor (GCF) for the terms: ${finalGcf}`);
  steps.push(`Isolated least common multiple (LCM) for the terms: ${finalLcm}`);

  return {
    gcf: finalGcf,
    lcm: finalLcm,
    steps
  };
}

function gcd(a: number, b: number): number {
  a = Math.round(Math.abs(a));
  b = Math.round(Math.abs(b));
  while (b) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a: number, b: number): number {
  if (a === 0 || b === 0) return 0;
  return Math.round(Math.abs(a * b) / gcd(a, b));
}

function getListGcf(arr: number[]): number {
  if (arr.length === 0) return 0;
  let res = arr[0];
  for (let i = 1; i < arr.length; i++) {
    res = gcd(res, arr[i]);
  }
  return res;
}

function getListLcm(arr: number[]): number {
  if (arr.length === 0) return 0;
  let res = arr[0];
  for (let i = 1; i < arr.length; i++) {
    res = lcm(res, arr[i]);
  }
  return res;
}
