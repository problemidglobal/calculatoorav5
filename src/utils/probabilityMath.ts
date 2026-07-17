// Probability Mathematical Utility Functions

// Factorial with memoization to prevent stack overflow and optimize speed
const factorialCache: number[] = [1, 1];
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n >= 171) return Infinity; // JS numbers overflow above 170!
  if (factorialCache[n] !== undefined) return factorialCache[n];
  let res = factorialCache[factorialCache.length - 1];
  for (let i = factorialCache.length; i <= n; i++) {
    res *= i;
    factorialCache[i] = res;
  }
  return res;
}

// Combinations: n Choose r - iteratively computed to avoid overflow
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  if (r > n / 2) r = n - r;
  let res = 1;
  for (let i = 1; i <= r; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
}

// Permutations: n Pr
export function nPr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  let res = 1;
  for (let i = 0; i < r; i++) {
    res *= (n - i);
  }
  return res;
}

// Error Function approximation (erf) for normal distribution
export function erf(x: number): number {
  // Abramowitz and Stegun formula 7.1.26 approximation
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  const absX = Math.abs(x);

  const t = 1.0 / (1.0 + p * absX);
  const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-absX * absX);

  return sign * y;
}

// Normal Distribution PDF
export function normalPDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return 0;
  const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
}

// Normal Distribution Cumulative Density Function (CDF)
export function normalCDF(x: number, mean: number, stdDev: number): number {
  if (stdDev <= 0) return x >= mean ? 1 : 0;
  return 0.5 * (1 + erf((x - mean) / (stdDev * Math.sqrt(2))));
}

// Binomial PMF: P(X = k)
export function binomialPMF(k: number, n: number, p: number): number {
  if (k < 0 || k > n || p < 0 || p > 1) return 0;
  return nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

// Binomial CDF: P(X <= k)
export function binomialCDF(k: number, n: number, p: number): number {
  let sum = 0;
  const limit = Math.min(k, n);
  for (let i = 0; i <= limit; i++) {
    sum += binomialPMF(i, n, p);
  }
  return Math.min(1, Math.max(0, sum));
}

// Poisson PMF: P(X = k)
export function poissonPMF(k: number, lambda: number): number {
  if (k < 0 || lambda <= 0) return 0;
  // To avoid overflow for large k, we use log probability space
  // P(X = k) = exp(k * ln(lambda) - lambda - ln(k!))
  let lnKFact = 0;
  for (let i = 1; i <= k; i++) {
    lnKFact += Math.log(i);
  }
  const lnProb = k * Math.log(lambda) - lambda - lnKFact;
  return Math.exp(lnProb);
}

// Poisson CDF: P(X <= k)
export function poissonCDF(k: number, lambda: number): number {
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += poissonPMF(i, lambda);
  }
  return Math.min(1, sum);
}

// Hypergeometric PMF: P(X = k)
export function hypergeometricPMF(k: number, N: number, K: number, n: number): number {
  if (k < 0 || k > n || k > K || (n - k) > (N - K)) return 0;
  return (nCr(K, k) * nCr(N - K, n - k)) / nCr(N, n);
}

// Hypergeometric CDF: P(X <= k)
export function hypergeometricCDF(k: number, N: number, K: number, n: number): number {
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += hypergeometricPMF(i, N, K, n);
  }
  return Math.min(1, sum);
}

// Geometric PMF: P(X = k)
export function geometricPMF(k: number, p: number): number {
  if (k <= 0 || p <= 0 || p > 1) return 0;
  return Math.pow(1 - p, k - 1) * p;
}

// Geometric CDF: P(X <= k)
export function geometricCDF(k: number, p: number): number {
  if (k <= 0 || p <= 0 || p > 1) return 0;
  return 1 - Math.pow(1 - p, k);
}

// Help format fractions using greatest common divisor (GCD)
export function getFraction(decimal: number): string {
  if (isNaN(decimal) || decimal <= 0 || decimal >= 1) return '';
  const tolerance = 1.0e-9;
  let h1 = 1, h2 = 0, k1 = 0, k2 = 1;
  let b = decimal;
  do {
    const a = Math.floor(b);
    const aux = h1; h1 = a * h1 + h2; h2 = aux;
    const auxK = k1; k1 = a * k1 + k2; k2 = auxK;
    b = 1 / (b - a);
  } while (Math.abs(decimal - h1 / k1) > decimal * tolerance);
  return `${h1}/${k1}`;
}
