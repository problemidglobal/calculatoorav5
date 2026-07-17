import * as math from 'mathjs';

/**
 * Robustly evaluates a math expression with a given scope, catching any mathematical errors.
 */
export function safeEvaluate(expr: string, scope: Record<string, number>): number {
  try {
    const cleaned = preprocessExpression(expr);
    const parsed = math.parse(cleaned);
    const compiled = parsed.compile();
    const result = compiled.evaluate(scope);
    
    if (typeof result === 'number') {
      return isNaN(result) || !isFinite(result) ? NaN : result;
    }
    if (result && typeof result === 'object' && result.isBigNumber) {
      return result.toNumber();
    }
    if (result && typeof result === 'object' && result.isComplex) {
      return result.re; // Return real part for standard graphing
    }
    return Number(result);
  } catch (e) {
    return NaN;
  }
}

/**
 * Preprocess standard human-friendly syntax into math.js compliant format.
 * E.g., implicit multiplication (2x -> 2*x) and absolute value brackets.
 */
export function preprocessExpression(expr: string): string {
  let cleaned = expr.trim();
  // Handle absolute values: |x| -> abs(x)
  let inPipe = false;
  let processedPipe = '';
  for (let i = 0; i < cleaned.length; i++) {
    const char = cleaned[i];
    if (char === '|') {
      if (!inPipe) {
        processedPipe += 'abs(';
        inPipe = true;
      } else {
        processedPipe += ')';
        inPipe = false;
      }
    } else {
      processedPipe += char;
    }
  }
  if (inPipe) processedPipe += ')';
  
  // Replace mathematical common constants and notations
  cleaned = processedPipe;
  // Let mathjs handle implicit multiplication. We can also add some standard replacements:
  // e.g., e^x -> exp(x) is handled well, but replacing e with 2.718281828459045 inside mathjs can also be useful
  return cleaned;
}

/**
 * Computes the symbolic derivative of an expression with respect to a variable.
 */
export function getSymbolicDerivative(expr: string, variable: string): string {
  try {
    const cleaned = preprocessExpression(expr);
    const deriv = math.derivative(cleaned, variable);
    return deriv.toString();
  } catch (e) {
    return 'Could not compute symbolically';
  }
}

/**
 * Generates rich step-by-step rules and text explanation for computing a derivative.
 */
export function getDerivativeSteps(expr: string, variable: string): { steps: string[]; finalResult: string } {
  const steps: string[] = [];
  try {
    const cleaned = preprocessExpression(expr);
    const deriv = math.derivative(cleaned, variable);
    const resultStr = deriv.toString();

    steps.push(`🎯 Goal: Calculate the derivative of f(${variable}) = ${expr} with respect to ${variable}.`);
    
    // Parse the mathjs node tree to describe rules
    const parsed = math.parse(cleaned);
    
    steps.push(`🔍 Analyzing the function structure...`);
    
    if (parsed.type === 'OperatorNode') {
      const opNode = parsed as any;
      if (opNode.op === '+') {
        steps.push(`📝 Apply the Sum Rule: d/d${variable} [u + v] = du/d${variable} + dv/d${variable}`);
        opNode.args.forEach((arg: any, index: number) => {
          try {
            const subDeriv = math.derivative(arg, variable).toString();
            steps.push(`   • Step ${index + 1}: Derivative of term [${arg.toString()}] is [${subDeriv}]`);
          } catch {
            steps.push(`   • Step ${index + 1}: Derivative of term [${arg.toString()}]`);
          }
        });
      } else if (opNode.op === '-') {
        steps.push(`📝 Apply the Difference Rule: d/d${variable} [u - v] = du/d${variable} - dv/d${variable}`);
        opNode.args.forEach((arg: any, index: number) => {
          try {
            const subDeriv = math.derivative(arg, variable).toString();
            steps.push(`   • Step ${index + 1}: Derivative of term [${arg.toString()}] is [${subDeriv}]`);
          } catch {
            steps.push(`   • Step ${index + 1}: Derivative of term [${arg.toString()}]`);
          }
        });
      } else if (opNode.op === '*') {
        steps.push(`📝 Apply the Product Rule: d/d${variable} [u * v] = u * dv/d${variable} + v * du/d${variable}`);
        const u = opNode.args[0]?.toString() || 'u';
        const v = opNode.args[1]?.toString() || 'v';
        const du = math.derivative(u, variable).toString();
        const dv = math.derivative(v, variable).toString();
        steps.push(`   • Identify components: u = ${u}, v = ${v}`);
        steps.push(`   • Compute component derivatives: du/d${variable} = ${du}, dv/d${variable} = ${dv}`);
        steps.push(`   • Assemble: (${u}) * (${dv}) + (${v}) * (${du})`);
      } else if (opNode.op === '/') {
        steps.push(`📝 Apply the Quotient Rule: d/d${variable} [u / v] = (v * du/d${variable} - u * dv/d${variable}) / v^2`);
        const u = opNode.args[0]?.toString() || 'u';
        const v = opNode.args[1]?.toString() || 'v';
        const du = math.derivative(u, variable).toString();
        const dv = math.derivative(v, variable).toString();
        steps.push(`   • Identify components: numerator u = ${u}, denominator v = ${v}`);
        steps.push(`   • Compute component derivatives: du/d${variable} = ${du}, dv/d${variable} = ${dv}`);
        steps.push(`   • Assemble: ((${v}) * (${du}) - (${u}) * (${dv})) / (${v})^2`);
      } else if (opNode.op === '^') {
        steps.push(`📝 Apply the Power Rule / Exponential Rule: d/d${variable} [u^v]`);
        const base = opNode.args[0]?.toString() || 'u';
        const exponent = opNode.args[1]?.toString() || 'v';
        if (!exponent.includes(variable)) {
          steps.push(`   • Exponent [${exponent}] is constant with respect to ${variable}.`);
          steps.push(`   • Apply General Power Rule: d/d${variable} [g(${variable})^n] = n * g(${variable})^(n-1) * g'(${variable})`);
          steps.push(`   • Formula: ${exponent} * (${base})^(${exponent}-1) * d/d${variable}[${base}]`);
        } else if (!base.includes(variable)) {
          steps.push(`   • Base [${base}] is constant. Apply exponential rules: d/d${variable}[a^u] = a^u * ln(a) * du/d${variable}`);
        } else {
          steps.push(`   • Both base and exponent contain ${variable}. Use logarithmic differentiation: y = u^v => ln(y) = v * ln(u)`);
        }
      }
    } else if (parsed.type === 'FunctionNode') {
      const funcNode = parsed as any;
      const funcName = funcNode.name;
      const arg = funcNode.args[0]?.toString() || 'x';
      const argDeriv = math.derivative(funcNode.args[0], variable).toString();
      steps.push(`📝 Apply Chain Rule: d/d${variable} [${funcName}(g(${variable}))] = ${funcName}'(g(${variable})) * g'(${variable})`);
      steps.push(`   • Outer function is: ${funcName}(u)`);
      steps.push(`   • Inner function is: g(${variable}) = ${arg}`);
      steps.push(`   • Inner derivative g'(${variable}) = ${argDeriv}`);
    } else {
      steps.push(`📝 Identify simple algebraic term: f(${variable}) = ${expr}`);
      steps.push(`   • Apply fundamental rules: d/d${variable}[${variable}] = 1, d/d${variable}[constant] = 0`);
    }

    steps.push(`🔄 Simplify the resulting derivative expression...`);
    const simplified = math.simplify(deriv).toString();
    steps.push(`✅ Final Derivative Result: f'(${variable}) = ${simplified}`);
    
    return { steps, finalResult: simplified };
  } catch (e) {
    return {
      steps: [
        `🎯 Goal: Compute derivative of ${expr} with respect to ${variable}.`,
        `⚠️ Symbolic derivation encountered an expression it could not expand step-by-step.`,
        `🔄 Attempting direct computation...`,
        `✅ Result achieved: ${getSymbolicDerivative(expr, variable)}`
      ],
      finalResult: getSymbolicDerivative(expr, variable)
    };
  }
}

/**
 * Computes numerical derivative of an expression at a point.
 */
export function getNumericalDerivative(expr: string, variable: string, point: number, h = 1e-5): number {
  const f_plus = safeEvaluate(expr, { [variable]: point + h });
  const f_minus = safeEvaluate(expr, { [variable]: point - h });
  const deriv = (f_plus - f_minus) / (2 * h);
  return isNaN(deriv) || !isFinite(deriv) ? NaN : deriv;
}

/**
 * Computes numerical limit of an expression as variable approaches point from left, right, or both.
 */
export function getNumericalLimit(
  expr: string,
  variable: string,
  point: number,
  direction: 'left' | 'right' | 'both' = 'both'
): { value: number; limitExists: boolean; leftValue: number; rightValue: number; explanation: string } {
  const h_values = [1e-2, 1e-3, 1e-4, 1e-5, 1e-6, 1e-7, 1e-8];
  
  // Left limit calculation
  let leftValue = NaN;
  for (const h of h_values) {
    const val = safeEvaluate(expr, { [variable]: point - h });
    if (!isNaN(val) && isFinite(val)) {
      leftValue = val;
    }
  }

  // Right limit calculation
  let rightValue = NaN;
  for (const h of h_values) {
    const val = safeEvaluate(expr, { [variable]: point + h });
    if (!isNaN(val) && isFinite(val)) {
      rightValue = val;
    }
  }

  let limitExists = false;
  let finalValue = NaN;
  let explanation = '';

  if (direction === 'left') {
    limitExists = !isNaN(leftValue) && isFinite(leftValue);
    finalValue = leftValue;
    explanation = `Computed left-sided limit by approaching ${point} from below: x = [${(point - 0.01).toFixed(4)}, ${(point - 0.0001).toFixed(4)}]. Values trend to ${leftValue.toFixed(6)}.`;
  } else if (direction === 'right') {
    limitExists = !isNaN(rightValue) && isFinite(rightValue);
    finalValue = rightValue;
    explanation = `Computed right-sided limit by approaching ${point} from above: x = [${(point + 0.01).toFixed(4)}, ${(point + 0.0001).toFixed(4)}]. Values trend to ${rightValue.toFixed(6)}.`;
  } else {
    // Both
    const leftOK = !isNaN(leftValue) && isFinite(leftValue);
    const rightOK = !isNaN(rightValue) && isFinite(rightValue);
    
    if (leftOK && rightOK) {
      const diff = Math.abs(leftValue - rightValue);
      if (diff < 1e-3) {
        limitExists = true;
        finalValue = (leftValue + rightValue) / 2;
        explanation = `The left-sided limit is approx ${leftValue.toFixed(6)} and the right-sided limit is approx ${rightValue.toFixed(6)}. Since both sides match within tolerance, the limit exists and equals ${finalValue.toFixed(6)}.`;
      } else {
        limitExists = false;
        explanation = `The left-sided limit is approx ${leftValue.toFixed(6)} but the right-sided limit is approx ${rightValue.toFixed(6)}. Since the left-hand and right-hand limits do not match, the general limit DOES NOT EXIST.`;
      }
    } else if (leftOK) {
      limitExists = false;
      explanation = `The left limit converges to ${leftValue.toFixed(6)} but the right limit is undefined or approaches infinity. The general limit does not exist.`;
    } else if (rightOK) {
      limitExists = false;
      explanation = `The right limit converges to ${rightValue.toFixed(6)} but the left limit is undefined or approaches infinity. The general limit does not exist.`;
    } else {
      limitExists = false;
      explanation = `Both left-sided and right-sided limits are undefined, oscillatory, or infinite. The general limit does not exist.`;
    }
  }

  return {
    value: finalValue,
    limitExists,
    leftValue,
    rightValue,
    explanation
  };
}

/**
 * Computes numerical integration using Riemann Sums, Trapezoidal Rule, Simpson's Rule or Midpoint Rule.
 */
export function getNumericalIntegral(
  expr: string,
  variable: string,
  lower: number,
  upper: number,
  n = 100,
  method: 'left' | 'right' | 'midpoint' | 'trapezoidal' | 'simpson' = 'simpson'
): { value: number; steps: string[]; samplePoints: { x: number; y: number; width: number }[] } {
  const steps: string[] = [];
  const samplePoints: { x: number; y: number; width: number }[] = [];
  
  if (lower === upper) {
    return { value: 0, steps: [`Bounds are equal: integral from ${lower} to ${upper} is 0.`], samplePoints: [] };
  }

  const dx = (upper - lower) / n;
  let sum = 0;

  steps.push(`📐 Integrating f(${variable}) = ${expr} from a = ${lower} to b = ${upper} with n = ${n} subdivisions.`);
  steps.push(`📊 Delta ${variable} (step size) dx = (b - a)/n = (${upper} - ${lower})/${n} = ${dx.toFixed(6)}`);

  if (method === 'left') {
    steps.push(`📝 Utilizing Left Riemann Sum: Sum(f(x_i) * dx) where x_i starts at a.`);
    for (let i = 0; i < n; i++) {
      const xi = lower + i * dx;
      const yi = safeEvaluate(expr, { [variable]: xi });
      if (!isNaN(yi) && isFinite(yi)) {
        sum += yi;
        samplePoints.push({ x: xi, y: yi, width: dx });
      }
    }
    const total = sum * dx;
    steps.push(`✅ Left Riemann Sum = ${total.toFixed(6)}`);
    return { value: total, steps, samplePoints };

  } else if (method === 'right') {
    steps.push(`📝 Utilizing Right Riemann Sum: Sum(f(x_i) * dx) where x_i starts at a + dx.`);
    for (let i = 1; i <= n; i++) {
      const xi = lower + i * dx;
      const yi = safeEvaluate(expr, { [variable]: xi });
      if (!isNaN(yi) && isFinite(yi)) {
        sum += yi;
        samplePoints.push({ x: xi - dx, y: yi, width: dx });
      }
    }
    const total = sum * dx;
    steps.push(`✅ Right Riemann Sum = ${total.toFixed(6)}`);
    return { value: total, steps, samplePoints };

  } else if (method === 'midpoint') {
    steps.push(`📝 Utilizing Midpoint Riemann Sum: Sum(f(x_mid) * dx) where x_mid = x_i + dx/2.`);
    for (let i = 0; i < n; i++) {
      const xi = lower + i * dx;
      const xMid = xi + dx / 2;
      const yi = safeEvaluate(expr, { [variable]: xMid });
      if (!isNaN(yi) && isFinite(yi)) {
        sum += yi;
        samplePoints.push({ x: xi, y: yi, width: dx });
      }
    }
    const total = sum * dx;
    steps.push(`✅ Midpoint Riemann Sum = ${total.toFixed(6)}`);
    return { value: total, steps, samplePoints };

  } else if (method === 'trapezoidal') {
    steps.push(`📝 Utilizing Trapezoidal Rule: dx/2 * [f(a) + 2*f(x_1) + ... + 2*f(x_n-1) + f(b)]`);
    const f_a = safeEvaluate(expr, { [variable]: lower }) || 0;
    const f_b = safeEvaluate(expr, { [variable]: upper }) || 0;
    sum += (f_a + f_b) / 2;
    
    samplePoints.push({ x: lower, y: f_a, width: 0 });

    for (let i = 1; i < n; i++) {
      const xi = lower + i * dx;
      const yi = safeEvaluate(expr, { [variable]: xi });
      if (!isNaN(yi) && isFinite(yi)) {
        sum += yi;
        samplePoints.push({ x: xi, y: yi, width: dx });
      }
    }
    samplePoints.push({ x: upper, y: f_b, width: dx });

    const total = sum * dx;
    steps.push(`✅ Trapezoidal Integration Value = ${total.toFixed(6)}`);
    return { value: total, steps, samplePoints };

  } else {
    // Simpson's Rule
    steps.push(`📝 Utilizing Simpson's Rule (parabolic approximation): dx/3 * [f(a) + 4*f(x_1) + 2*f(x_2) + ... + f(b)]`);
    const f_a = safeEvaluate(expr, { [variable]: lower }) || 0;
    const f_b = safeEvaluate(expr, { [variable]: upper }) || 0;
    
    let oddSum = 0;
    let evenSum = 0;

    samplePoints.push({ x: lower, y: f_a, width: 0 });

    for (let i = 1; i < n; i++) {
      const xi = lower + i * dx;
      const yi = safeEvaluate(expr, { [variable]: xi });
      if (!isNaN(yi) && isFinite(yi)) {
        if (i % 2 === 0) {
          evenSum += yi;
        } else {
          oddSum += yi;
        }
        samplePoints.push({ x: xi, y: yi, width: dx });
      }
    }
    samplePoints.push({ x: upper, y: f_b, width: dx });

    const total = (dx / 3) * (f_a + f_b + 4 * oddSum + 2 * evenSum);
    steps.push(`   • Weight factors: f(a)=${f_a.toFixed(4)}, odd sum = ${oddSum.toFixed(4)} (x4), even sum = ${evenSum.toFixed(4)} (x2), f(b)=${f_b.toFixed(4)}`);
    steps.push(`✅ Simpson's Rule Value = ${total.toFixed(6)}`);
    return { value: total, steps, samplePoints };
  }
}

/**
 * Robust rules-based symbolic indefinte integration for classic structures.
 */
export function getSymbolicIndefiniteIntegral(expr: string, variable: string): { result: string; steps: string[] } {
  const steps: string[] = [];
  const normalized = expr.trim().toLowerCase().replace(/\s+/g, '');
  steps.push(`🎯 Goal: Compute the indefinite integral: ∫ (${expr}) d${variable}`);

  // Base patterns match
  if (normalized === '0' || normalized === '') {
    steps.push(`📝 ∫ 0 d${variable} = C (Integral of a zero is a constant)`);
    return { result: 'C', steps };
  }
  if (normalized === '1' || normalized === 'x') {
    if (normalized === '1') {
      steps.push(`📝 ∫ 1 d${variable} = ${variable} + C`);
      return { result: `${variable} + C`, steps };
    }
  }

  // Linear / polynomial term pattern matching
  const polyMatch = normalized.match(/^([+-]?\d*(?:\.\d+)?)\*?([a-zA-Z])(?:\^([+-]?\d+))?$/);
  if (polyMatch) {
    const coeffStr = polyMatch[1];
    const v = polyMatch[2];
    const powStr = polyMatch[3];

    if (v === variable) {
      let coeff = coeffStr === '' || coeffStr === '+' ? 1 : coeffStr === '-' ? -1 : parseFloat(coeffStr);
      let power = powStr ? parseInt(powStr) : 1;

      if (power === -1) {
        steps.push(`📝 Apply the Power Rule exception (Natural Logarithm): ∫ x^-1 dx = ln(|x|) + C`);
        const result = coeff === 1 ? `ln(|${variable}|) + C` : `${coeff} * ln(|${variable}|) + C`;
        return { result, steps };
      } else {
        steps.push(`📝 Apply the Power Rule: ∫ x^n dx = (x^(n+1)) / (n+1) for n ≠ -1`);
        const newPower = power + 1;
        const newCoeff = coeff / newPower;
        steps.push(`   • Exponent n = ${power} → n + 1 = ${newPower}`);
        steps.push(`   • Adjust Coefficient: ${coeff} / ${newPower} = ${newCoeff}`);
        
        let term = '';
        if (newCoeff === 1) term = `${variable}^${newPower}`;
        else if (newCoeff === -1) term = `-${variable}^${newPower}`;
        else term = `${newCoeff.toFixed(4)} * ${variable}^${newPower}`;
        
        return { result: `${term} + C`, steps };
      }
    }
  }

  // Trigonometric Matches
  if (normalized === 'sin(x)' || normalized === 'sin(' + variable + ')') {
    steps.push(`📝 Trigonometric rule: ∫ sin(${variable}) d${variable} = -cos(${variable}) + C`);
    return { result: `-cos(${variable}) + C`, steps };
  }
  if (normalized === 'cos(x)' || normalized === 'cos(' + variable + ')') {
    steps.push(`📝 Trigonometric rule: ∫ cos(${variable}) d${variable} = sin(${variable}) + C`);
    return { result: `sin(${variable}) + C`, steps };
  }
  if (normalized === 'exp(x)' || normalized === 'e^x' || normalized === 'e^' + variable) {
    steps.push(`📝 Exponential rule: ∫ e^${variable} d${variable} = e^${variable} + C`);
    return { result: `e^${variable} + C`, steps };
  }
  if (normalized === '1/x' || normalized === `1/${variable}`) {
    steps.push(`📝 Logarithmic rule: ∫ 1/${variable} d${variable} = ln(|${variable}|) + C`);
    return { result: `ln(|${variable}|) + C`, steps };
  }

  // Polynomial expansion helper
  try {
    const parsed = math.parse(expr);
    if (parsed.type === 'OperatorNode' && (parsed as any).op === '+') {
      steps.push(`📝 Apply Term-by-Term Integration (linearity of integrals): ∫(f(x) + g(x))dx = ∫f(x)dx + ∫g(x)dx`);
      const terms: string[] = [];
      (parsed as any).args.forEach((arg: any) => {
        const sub = getSymbolicIndefiniteIntegral(arg.toString(), variable);
        terms.push(sub.result.replace(' + C', ''));
        steps.push(`   • For term [${arg.toString()}]: ${sub.result}`);
      });
      return { result: `${terms.join(' + ')} + C`, steps };
    }
  } catch {}

  // Standard fallback
  steps.push(`💡 This complex function does not map to a standard basic library anti-derivative form.`);
  steps.push(`📊 Representing anti-derivative symbolically as: F(${variable}) = ∫ (${expr}) d${variable} + C`);
  return { result: `∫(${expr})d${variable} + C`, steps };
}

/**
 * Solves standard root-finding with Bisection Method.
 */
export function solveBisection(expr: string, variable: string, a: number, b: number, tol = 1e-6, maxIter = 100): { root: number; steps: string[] } {
  const steps: string[] = [];
  steps.push(`🧗 Bisection Method solver in interval [${a}, ${b}].`);
  
  let fa = safeEvaluate(expr, { [variable]: a });
  let fb = safeEvaluate(expr, { [variable]: b });

  if (isNaN(fa) || isNaN(fb)) {
    return { root: NaN, steps: [`⚠️ Evaluation failed at interval endpoints.`] };
  }

  if (fa * fb > 0) {
    steps.push(`⚠️ f(a) = ${fa.toFixed(4)} and f(b) = ${fb.toFixed(4)} have the SAME sign. Bisection method may not converge unless f(a)*f(b) < 0.`);
    return { root: NaN, steps };
  }

  let mid = a;
  let iter = 0;
  while (iter < maxIter && (b - a) / 2 > tol) {
    mid = (a + b) / 2;
    const fmid = safeEvaluate(expr, { [variable]: mid });
    steps.push(`   • Iter ${iter+1}: interval = [${a.toFixed(5)}, ${b.toFixed(5)}], mid = ${mid.toFixed(5)}, f(mid) = ${fmid.toFixed(5)}`);
    
    if (Math.abs(fmid) < 1e-12) {
      break;
    }
    if (fa * fmid < 0) {
      b = mid;
      fb = fmid;
    } else {
      a = mid;
      fa = fmid;
    }
    iter++;
  }
  
  steps.push(`✅ Root found at ${mid.toFixed(6)} after ${iter} iterations.`);
  return { root: mid, steps };
}

/**
 * Solves standard root-finding with Newton-Raphson Method.
 */
export function solveNewtonRaphson(expr: string, variable: string, guess: number, tol = 1e-6, maxIter = 50): { root: number; steps: string[] } {
  const steps: string[] = [];
  steps.push(`🧗 Newton-Raphson Method solver starting at guess x0 = ${guess}.`);

  let x = guess;
  let iter = 0;

  while (iter < maxIter) {
    const fx = safeEvaluate(expr, { [variable]: x });
    const dfx = getNumericalDerivative(expr, variable, x);

    if (isNaN(fx) || isNaN(dfx) || Math.abs(dfx) < 1e-12) {
      steps.push(`⚠️ Derivative is zero or evaluation failed at x = ${x}. Convergence failed.`);
      return { root: NaN, steps };
    }

    const nextX = x - fx / dfx;
    steps.push(`   • Iter ${iter+1}: x_curr = ${x.toFixed(6)}, f(x) = ${fx.toFixed(6)}, f'(x) = ${dfx.toFixed(6)} → x_next = ${nextX.toFixed(6)}`);

    if (Math.abs(nextX - x) < tol) {
      x = nextX;
      break;
    }
    x = nextX;
    iter++;
  }

  steps.push(`✅ Root found at ${x.toFixed(6)} after ${iter} iterations.`);
  return { root: x, steps };
}

/**
 * Scans interval to find local extreme critical and inflection points of a function.
 */
export function getCriticalAndInflectionPoints(expr: string, variable: string, range: [number, number]): { critical: {x: number, y: number, type: string}[], inflection: {x: number, y: number}[] } {
  const critical: {x: number, y: number, type: string}[] = [];
  const inflection: {x: number, y: number}[] = [];
  const [minX, maxX] = range;
  const stepsCount = 120;
  const dx = (maxX - minX) / stepsCount;

  // Let's pre-sample derivatives
  const pts: { x: number; y: number; dy: number; d2y: number }[] = [];
  for (let i = 0; i <= stepsCount; i++) {
    const x = minX + i * dx;
    const y = safeEvaluate(expr, { [variable]: x });
    const dy = getNumericalDerivative(expr, variable, x);
    const d2y = getNumericalDerivative(getSymbolicDerivative(expr, variable), variable, x); // second derivative
    pts.push({ x, y, dy, d2y });
  }

  // Scan for sign changes in first derivative (Critical Points / Extrema)
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];

    if (p1.dy * p2.dy < 0) {
      // Find exact zero of dy using bisection
      const dExpr = getSymbolicDerivative(expr, variable);
      const res = solveBisection(dExpr, variable, p1.x, p2.x, 1e-5, 20);
      if (!isNaN(res.root)) {
        const cx = res.root;
        const cy = safeEvaluate(expr, { [variable]: cx });
        const cd2y = getNumericalDerivative(dExpr, variable, cx); // second deriv
        const type = cd2y > 0 ? 'Local Minimum' : cd2y < 0 ? 'Local Maximum' : 'Saddle / Flat';
        critical.push({ x: cx, y: cy, type });
      }
    }
  }

  // Scan for sign changes in second derivative (Inflection Points)
  for (let i = 0; i < pts.length - 1; i++) {
    const p1 = pts[i];
    const p2 = pts[i + 1];

    if (p1.d2y * p2.d2y < 0) {
      const d2Expr = getSymbolicDerivative(getSymbolicDerivative(expr, variable), variable);
      const res = solveBisection(d2Expr, variable, p1.x, p2.x, 1e-5, 20);
      if (!isNaN(res.root)) {
        const ix = res.root;
        const iy = safeEvaluate(expr, { [variable]: ix });
        inflection.push({ x: ix, y: iy });
      }
    }
  }

  return { critical, inflection };
}

/**
 * Computes Taylor series terms around a center up to degree N.
 */
export function getTaylorSeries(expr: string, variable: string, center: number, degree: number): { formula: string; latex: string; terms: { power: number; coeff: number; termStr: string }[] } {
  const terms: { power: number; coeff: number; termStr: string }[] = [];
  let formulaParts: string[] = [];
  let latexParts: string[] = [];

  // Degree 0 (f(c))
  let currentExpr = expr;
  let f_val = safeEvaluate(currentExpr, { [variable]: center });
  let factorial = 1;

  if (!isNaN(f_val)) {
    terms.push({ power: 0, coeff: f_val, termStr: `${f_val.toFixed(3)}` });
    if (Math.abs(f_val) > 1e-5) {
      formulaParts.push(f_val.toFixed(3));
      latexParts.push(f_val.toFixed(3));
    }
  }

  for (let n = 1; n <= degree; n++) {
    factorial *= n;
    try {
      const deriv = math.derivative(currentExpr, variable);
      currentExpr = deriv.toString();
      const derivVal = safeEvaluate(currentExpr, { [variable]: center });
      if (isNaN(derivVal) || !isFinite(derivVal)) break;

      const coeff = derivVal / factorial;
      if (Math.abs(coeff) > 1e-6) {
        const xTerm = center === 0 ? `${variable}` : `(${variable} - ${center})`;
        const xTermLatex = center === 0 ? `${variable}` : `(${variable} - ${center})`;
        
        const termStr = n === 1 ? `${coeff.toFixed(3)}*${xTerm}` : `${coeff.toFixed(3)}*${xTerm}^${n}`;
        const termLatex = n === 1 ? `${coeff.toFixed(3)}${xTermLatex}` : `${coeff.toFixed(3)}${xTermLatex}^{${n}}`;

        terms.push({ power: n, coeff, termStr });
        formulaParts.push((coeff > 0 && formulaParts.length > 0 ? ' + ' : ' ') + termStr);
        latexParts.push((coeff > 0 && latexParts.length > 0 ? ' + ' : ' ') + termLatex);
      }
    } catch {
      break;
    }
  }

  return {
    formula: formulaParts.join('').trim(),
    latex: latexParts.join('').trim() + ' + ...',
    terms
  };
}

/**
 * Performs First-Order ODE separation/linear categorization, and returns RK4/Euler paths + direction fields.
 */
export function getOdeSolver(
  dy_dx: string,
  xVar: string,
  yVar: string,
  x0: number,
  y0: number,
  xEnd: number,
  stepsCount = 60,
  method: 'euler' | 'rk4' = 'rk4'
): { points: { x: number; y: number }[]; steps: string[] } {
  const points: { x: number; y: number }[] = [{ x: x0, y: y0 }];
  const steps: string[] = [];

  const h = (xEnd - x0) / stepsCount;
  let currX = x0;
  let currY = y0;

  steps.push(`🚀 Solving ODE: dy/d${xVar} = f(${xVar}, ${yVar}) = ${dy_dx}`);
  steps.push(`📍 Initial conditions: ${xVar}_0 = ${x0}, ${yVar}_0 = ${y0}, Step size h = ${h.toFixed(4)}`);

  for (let i = 0; i < stepsCount; i++) {
    if (method === 'euler') {
      const slope = safeEvaluate(dy_dx, { [xVar]: currX, [yVar]: currY });
      if (isNaN(slope) || !isFinite(slope)) break;
      currY = currY + h * slope;
      currX = currX + h;
    } else {
      // Runge-Kutta 4th Order
      const k1 = safeEvaluate(dy_dx, { [xVar]: currX, [yVar]: currY });
      const k2 = safeEvaluate(dy_dx, { [xVar]: currX + h/2, [yVar]: currY + (h/2)*k1 });
      const k3 = safeEvaluate(dy_dx, { [xVar]: currX + h/2, [yVar]: currY + (h/2)*k2 });
      const k4 = safeEvaluate(dy_dx, { [xVar]: currX + h, [yVar]: currY + h*k3 });

      if (isNaN(k1) || isNaN(k2) || isNaN(k3) || isNaN(k4)) break;

      currY = currY + (h/6) * (k1 + 2*k2 + 2*k3 + k4);
      currX = currX + h;
    }
    points.push({ x: currX, y: currY });
    if (i < 3) {
      steps.push(`   • Step ${i+1}: ${xVar} = ${currX.toFixed(4)}, ${yVar} = ${currY.toFixed(4)}`);
    }
  }

  steps.push(`🏁 Integration completed. Produced ${points.length} coordinates.`);
  return { points, steps };
}

/**
 * Slope fields vectors generator for visualization on coordinate canvas.
 */
export function getOdeDirectionField(
  dy_dx: string,
  xVar: string,
  yVar: string,
  xRange: [number, number],
  yRange: [number, number],
  count = 15
): { x: number; y: number; dx: number; dy: number }[] {
  const field: { x: number; y: number; dx: number; dy: number }[] = [];
  const [xMin, xMax] = xRange;
  const [yMin, yMax] = yRange;

  const dxStep = (xMax - xMin) / count;
  const dyStep = (yMax - yMin) / count;

  for (let i = 0; i <= count; i++) {
    const x = xMin + i * dxStep;
    for (let j = 0; j <= count; j++) {
      const y = yMin + j * dyStep;
      const slope = safeEvaluate(dy_dx, { [xVar]: x, [yVar]: y });
      
      if (!isNaN(slope) && isFinite(slope)) {
        // Normalize vector length for display
        const angle = Math.atan(slope);
        const length = 0.4 * Math.min(dxStep, dyStep);
        const dx = length * Math.cos(angle);
        const dy = length * Math.sin(angle);
        field.push({ x, y, dx, dy });
      }
    }
  }

  return field;
}

/**
 * Tests a infinite sequence of series formulas for convergence behavior.
 */
export function analyzeSequenceAndSeries(expr: string, variable: string): { sequenceConvergence: string; seriesConvergence: string; steps: string[] } {
  const steps: string[] = [];
  const normalized = expr.trim().toLowerCase().replace(/\s+/g, '');
  
  steps.push(`🎯 Goal: Analyze infinite sequence a_n = ${expr} and infinite series Σ a_n.`);

  // Evaluate sequence elements at large n values
  const n_10 = safeEvaluate(expr, { [variable]: 10 });
  const n_100 = safeEvaluate(expr, { [variable]: 100 });
  const n_1000 = safeEvaluate(expr, { [variable]: 1000 });
  const n_5000 = safeEvaluate(expr, { [variable]: 5000 });

  let sequenceConvergence = 'Unknown';
  let seriesConvergence = 'Unknown';

  if (!isNaN(n_5000)) {
    const diff = Math.abs(n_5000 - n_1000);
    if (diff < 1e-4) {
      const limitVal = n_5000;
      sequenceConvergence = `CONVERGES to ${limitVal.toFixed(4)}`;
      steps.push(`📈 Sequence terms trend: a_10 = ${n_10.toFixed(4)}, a_100 = ${n_100.toFixed(4)}, a_1000 = ${n_1000.toFixed(4)}, a_5000 = ${n_5000.toFixed(4)}`);
      
      if (Math.abs(limitVal) > 1e-4) {
        seriesConvergence = 'DIVERGES';
        steps.push(`📝 Apply the Divergence Test (nth Term Test):`);
        steps.push(`   • Since lim (n→∞) a_n = ${limitVal.toFixed(4)} ≠ 0, the infinite series Σ a_n MUST DIVERGE.`);
      } else {
        steps.push(`📝 Divergence Test is inconclusive since lim (n→∞) a_n = 0.`);
      }
    } else if (n_5000 > n_1000 && n_5000 > 10) {
      sequenceConvergence = 'DIVERGES to ∞';
      seriesConvergence = 'DIVERGES';
      steps.push(`📈 Sequence terms are rapidly expanding without bound.`);
    } else {
      sequenceConvergence = 'DIVERGES (Oscillatory or Infinite)';
      seriesConvergence = 'DIVERGES';
      steps.push(`📉 Sequence values do not stabilize.`);
    }
  }

  // Geometric series pattern check: a * r^n
  const geoMatch = normalized.match(/^[+-]?\d*\*?\(([+-]?\d*(?:\.\d+)?)\)\^[na-zA-Z]$/) || normalized.match(/^([+-]?\d*(?:\.\d+)?)\^[na-zA-Z]$/);
  if (geoMatch) {
    const ratioStr = geoMatch[1] || normalized.split('^')[0];
    const r = parseFloat(ratioStr);
    if (!isNaN(r)) {
      steps.push(`📝 Identified Geometric Series: ratio r = ${r}`);
      if (Math.abs(r) < 1) {
        seriesConvergence = 'CONVERGES (Geometric Series Test)';
        steps.push(`   • Since |r| = |${r}| < 1, the series converges absolutely to a / (1 - r).`);
      } else {
        seriesConvergence = 'DIVERGES (Geometric Series Test)';
        steps.push(`   • Since |r| = |${r}| ≥ 1, the series diverges.`);
      }
    }
  }

  // p-series check: 1 / n^p
  const pMatch = normalized.match(/^1\/[na-zA-Z]\^(\d*(?:\.\d+)?)$/) || normalized.match(/^1\/[na-zA-Z]$/);
  if (pMatch) {
    const pVal = pMatch[1] ? parseFloat(pMatch[1]) : 1;
    steps.push(`📝 Identified p-Series: p = ${pVal}`);
    if (pVal > 1) {
      seriesConvergence = 'CONVERGES (p-Series Test)';
      steps.push(`   • Since p = ${pVal} > 1, the infinite p-series converges.`);
    } else {
      seriesConvergence = 'DIVERGES (p-Series Test)';
      steps.push(`   • Since p = ${pVal} ≤ 1, the infinite p-series (e.g. harmonic series) diverges.`);
    }
  }

  return {
    sequenceConvergence,
    seriesConvergence,
    steps
  };
}
