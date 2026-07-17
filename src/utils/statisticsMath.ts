/**
 * Statistics Math Utilities for CALCULATOORA Statistics Calculator
 */

// Basic interface for statistics results
export interface DescriptiveStats {
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  mean: number;
  median: number;
  modes: number[];
  geometricMean: number | null;
  harmonicMean: number | null;
  trimmedMean: number;
  weightedMean?: number;
  sampleVariance: number;
  populationVariance: number;
  sampleStdDev: number;
  populationStdDev: number;
  coefVariation: number; // Sample CV
  meanAbsoluteDeviation: number;
  medianAbsoluteDeviation: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  deciles: number[];
  percentiles: { [key: number]: number };
  fiveNumberSummary: [number, number, number, number, number];
}

export interface DistributionStats {
  skewness: number;
  kurtosis: number;
  normalityJB: {
    statistic: number;
    pValue: number;
    isNormal: boolean;
  };
  zScores: number[];
  modifiedZScores: number[];
}

export interface ConfidenceInterval {
  confidenceLevel: number;
  marginOfError: number;
  lowerBound: number;
  upperBound: number;
}

export interface RegressionResult {
  pearson: number;
  spearman: number;
  slope: number;
  intercept: number;
  r2: number;
  equation: string;
  predictions: number[];
  residuals: number[];
  dataPoints: { x: number; y: number; yPred: number; residual: number }[];
}

// Factorial helper
export function factorial(n: number): number {
  if (n < 0) return 0;
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

// Combinations (nCr) helper
export function nCr(n: number, r: number): number {
  if (r < 0 || r > n) return 0;
  if (r === 0 || r === n) return 1;
  let num = 1;
  let den = 1;
  for (let i = 1; i <= r; i++) {
    num *= (n - i + 1);
    den *= i;
  }
  return num / den;
}

/**
 * Standard percentile calculation (linear interpolation between closest ranks)
 */
export function getPercentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = [...arr].sort((a, b) => a - b);
  if (p <= 0) return sorted[0];
  if (p >= 100) return sorted[sorted.length - 1];

  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index - lower;

  if (lower === upper) return sorted[lower];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

/**
 * Calculate basic descriptive statistics for an array of numbers
 */
export function calculateDescriptiveStats(arr: number[]): DescriptiveStats | null {
  const n = arr.length;
  if (n === 0) return null;

  const sorted = [...arr].sort((a, b) => a - b);
  const sumVal = arr.reduce((acc, val) => acc + val, 0);
  const minVal = sorted[0];
  const maxVal = sorted[n - 1];
  const rangeVal = maxVal - minVal;
  const meanVal = sumVal / n;

  // Median (Q2)
  const medianVal = getPercentile(sorted, 50);

  // Modes
  const freqMap: { [key: number]: number } = {};
  let maxFreq = 0;
  arr.forEach((v) => {
    freqMap[v] = (freqMap[v] || 0) + 1;
    if (freqMap[v] > maxFreq) maxFreq = freqMap[v];
  });
  
  let modesVal: number[] = [];
  if (maxFreq > 1) {
    modesVal = Object.keys(freqMap)
      .map(Number)
      .filter((k) => freqMap[k] === maxFreq);
  } else {
    // If all values appear once, technically there is no mode
    modesVal = [];
  }

  // Geometric Mean (only for positive numbers)
  let geoMean: number | null = null;
  if (arr.every((v) => v > 0)) {
    const logSum = arr.reduce((acc, val) => acc + Math.log(val), 0);
    geoMean = Math.exp(logSum / n);
  }

  // Harmonic Mean (only for non-zero positive numbers)
  let harmMean: number | null = null;
  if (arr.every((v) => v > 0)) {
    const invSum = arr.reduce((acc, val) => acc + (1 / val), 0);
    harmMean = n / invSum;
  }

  // Trimmed Mean (10% trim, 5% from top, 5% from bottom)
  const trimCount = Math.floor(n * 0.05);
  const trimmedArr = sorted.slice(trimCount, n - trimCount);
  const trimmedMeanVal = trimmedArr.length > 0 
    ? trimmedArr.reduce((acc, val) => acc + val, 0) / trimmedArr.length 
    : meanVal;

  // Variance & Standard Deviation
  const sqDiffSum = arr.reduce((acc, val) => acc + Math.pow(val - meanVal, 2), 0);
  const popVarianceVal = sqDiffSum / n;
  const sampleVarianceVal = n > 1 ? sqDiffSum / (n - 1) : 0;

  const popStdDevVal = Math.sqrt(popVarianceVal);
  const sampleStdDevVal = Math.sqrt(sampleVarianceVal);

  const cv = meanVal !== 0 ? (sampleStdDevVal / Math.abs(meanVal)) * 100 : 0;

  // Mean Absolute Deviation (MAD)
  const madMean = arr.reduce((acc, val) => acc + Math.abs(val - meanVal), 0) / n;

  // Median Absolute Deviation (MAD Median)
  const absDiffFromMedian = arr.map((val) => Math.abs(val - medianVal));
  const madMedian = getPercentile(absDiffFromMedian, 50);

  // Quartiles
  const q1Val = getPercentile(sorted, 25);
  const q2Val = medianVal;
  const q3Val = getPercentile(sorted, 75);
  const iqrVal = q3Val - q1Val;

  // Deciles (10th to 90th)
  const decilesVal: number[] = [];
  for (let i = 10; i <= 90; i += 10) {
    decilesVal.push(getPercentile(sorted, i));
  }

  // Specific Percentiles
  const percentilesVal: { [key: number]: number } = {};
  const ps = [1, 5, 10, 25, 50, 75, 90, 95, 99];
  ps.forEach((p) => {
    percentilesVal[p] = getPercentile(sorted, p);
  });

  return {
    count: n,
    sum: sumVal,
    min: minVal,
    max: maxVal,
    range: rangeVal,
    mean: meanVal,
    median: medianVal,
    modes: modesVal,
    geometricMean: geoMean,
    harmonicMean: harmMean,
    trimmedMean: trimmedMeanVal,
    sampleVariance: sampleVarianceVal,
    populationVariance: popVarianceVal,
    sampleStdDev: sampleStdDevVal,
    populationStdDev: popStdDevVal,
    coefVariation: cv,
    meanAbsoluteDeviation: madMean,
    medianAbsoluteDeviation: madMedian,
    q1: q1Val,
    q2: q2Val,
    q3: q3Val,
    iqr: iqrVal,
    deciles: decilesVal,
    percentiles: percentilesVal,
    fiveNumberSummary: [minVal, q1Val, medianVal, q3Val, maxVal],
  };
}

/**
 * Calculate skewness, kurtosis, and Jarque-Bera normality indicator
 */
export function calculateDistributionStats(arr: number[], mean: number, stdDev: number): DistributionStats {
  const n = arr.length;
  if (n === 0 || stdDev === 0) {
    return {
      skewness: 0,
      kurtosis: 0,
      normalityJB: { statistic: 0, pValue: 1, isNormal: true },
      zScores: arr.map(() => 0),
      modifiedZScores: arr.map(() => 0),
    };
  }

  // Z-scores
  const zScoresVal = arr.map((val) => (val - mean) / stdDev);

  // Modified Z-scores = 0.6745 * (x - median) / MAD
  const sorted = [...arr].sort((a, b) => a - b);
  const medianVal = getPercentile(sorted, 50);
  const absDiffFromMedian = arr.map((val) => Math.abs(val - medianVal));
  const madMedian = getPercentile(absDiffFromMedian, 50);
  const modifiedZScoresVal = arr.map((val) => {
    if (madMedian === 0) return 0;
    return (0.6745 * (val - medianVal)) / madMedian;
  });

  // Skewness
  let sumCubedDiff = 0;
  let sumFourthPowerDiff = 0;
  arr.forEach((val) => {
    const diff = val - mean;
    sumCubedDiff += Math.pow(diff, 3);
    sumFourthPowerDiff += Math.pow(diff, 4);
  });

  const skewnessVal = (sumCubedDiff / n) / Math.pow(stdDev, 3);
  // Excess Kurtosis = (m4 / s^4) - 3
  const kurtosisVal = (sumFourthPowerDiff / n) / Math.pow(stdDev, 4) - 3;

  // Jarque-Bera Test statistic
  // JB = (n / 6) * (S^2 + (K^2 / 4))
  // under H0 (normal distribution), JB follows a Chi-Square distribution with 2 df.
  const jbStat = (n / 6) * (Math.pow(skewnessVal, 2) + (Math.pow(kurtosisVal, 2) / 4));
  
  // Approximate p-value using survival function of chi-square with 2 d.f.
  // P(X > jbStat) = exp(-jbStat / 2)
  const pVal = Math.exp(-jbStat / 2);

  return {
    skewness: skewnessVal,
    kurtosis: kurtosisVal,
    normalityJB: {
      statistic: jbStat,
      pValue: pVal,
      isNormal: pVal > 0.05, // reject normality if p <= 0.05
    },
    zScores: zScoresVal,
    modifiedZScores: modifiedZScoresVal,
  };
}

/**
 * Standard Normal CDF helper (approximated via error function)
 */
export function normalCDF(x: number, mean = 0, stdDev = 1): number {
  const z = (x - mean) / stdDev;
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.39894228 * Math.exp(-z * z / 2);
  let p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  if (z > 0) p = 1 - p;
  return p;
}

/**
 * Standard Normal PDF (density) helper
 */
export function normalPDF(x: number, mean = 0, stdDev = 1): number {
  const diff = x - mean;
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow(diff / stdDev, 2));
}

/**
 * Approximate critical values for Student's T distribution
 * d.f. degrees of freedom, conf = confidence level (e.g. 0.95)
 */
export function getStudentTCriticalValue(df: number, conf: number): number {
  if (df <= 0) return 1.96;
  const alpha = 1 - conf;
  const p = 1 - alpha / 2;

  // Standard normal inverse CDF (z)
  let z = 0;
  if (p === 0.95) z = 1.64485;
  else if (p === 0.975) z = 1.95996;
  else if (p === 0.995) z = 2.57583;
  else {
    // Basic approximation of Normal quantile
    const t = Math.sqrt(-2 * Math.log(1 - p));
    z = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
  }

  // T-approximation based on Cornish-Fisher expansion
  const g1 = (z * z + 1) / 4;
  const g2 = (5 * Math.pow(z, 3) + 16 * z) / 96;
  const g3 = (3 * Math.pow(z, 5) + 19 * Math.pow(z, 3) + 17 * z) / 384;
  const g4 = (79 * Math.pow(z, 7) + 776 * Math.pow(z, 5) + 1482 * Math.pow(z, 3) + 1046 * z) / 92160;

  return z + g1 / df + g2 / Math.pow(df, 2) + g3 / Math.pow(df, 3) + g4 / Math.pow(df, 4);
}

/**
 * Calculate confidence intervals for mean
 */
export function calculateConfidenceIntervals(arr: number[], mean: number, stdDev: number): ConfidenceInterval[] {
  const n = arr.length;
  if (n < 2 || stdDev === 0) return [];

  const sem = stdDev / Math.sqrt(n); // Standard Error of Mean
  const levels = [0.90, 0.95, 0.99];

  return levels.map((cl) => {
    let tVal = 1.96;
    if (n < 30) {
      tVal = getStudentTCriticalValue(n - 1, cl);
    } else {
      // normal z approximation
      if (cl === 0.90) tVal = 1.645;
      else if (cl === 0.95) tVal = 1.96;
      else if (cl === 0.99) tVal = 2.576;
    }

    const margin = tVal * sem;
    return {
      confidenceLevel: cl * 100,
      marginOfError: margin,
      lowerBound: mean - margin,
      upperBound: mean + margin,
    };
  });
}

/**
 * Outliers analysis
 */
export interface OutliersAnalysis {
  iqrBounds: { lower: number; upper: number };
  zBounds: { lower: number; upper: number };
  modZBounds: { lower: number; upper: number };
  iqrOutlierIndices: number[];
  zOutlierIndices: number[];
  modZOutlierIndices: number[];
  allOutlierIndices: number[];
}

export function detectOutliers(arr: number[], q1: number, q3: number, mean: number, stdDev: number): OutliersAnalysis {
  const iqr = q3 - q1;
  const iqrLower = q1 - 1.5 * iqr;
  const iqrUpper = q3 + 1.5 * iqr;

  const zLower = mean - 3 * stdDev;
  const zUpper = mean + 3 * stdDev;

  const sorted = [...arr].sort((a, b) => a - b);
  const medianVal = getPercentile(sorted, 50);
  const absDiffFromMedian = arr.map((val) => Math.abs(val - medianVal));
  const madMedian = getPercentile(absDiffFromMedian, 50);

  const iqrOutlierIndices: number[] = [];
  const zOutlierIndices: number[] = [];
  const modZOutlierIndices: number[] = [];
  const allOutlierIndicesSet = new Set<number>();

  arr.forEach((val, i) => {
    // IQR
    if (val < iqrLower || val > iqrUpper) {
      iqrOutlierIndices.push(i);
      allOutlierIndicesSet.add(i);
    }

    // Z-score
    if (stdDev !== 0) {
      const z = (val - mean) / stdDev;
      if (Math.abs(z) > 3) {
        zOutlierIndices.push(i);
        allOutlierIndicesSet.add(i);
      }
    }

    // Modified Z-score
    if (madMedian !== 0) {
      const modZ = (0.6745 * (val - medianVal)) / madMedian;
      if (Math.abs(modZ) > 3.5) {
        modZOutlierIndices.push(i);
        allOutlierIndicesSet.add(i);
      }
    }
  });

  // Calculate modified z bounds conceptually for displaying
  // modZ = 3.5 -> 3.5 * mad / 0.6745 = x - median
  const modZOffset = madMedian !== 0 ? (3.5 * madMedian) / 0.6745 : 0;
  const modZLower = medianVal - modZOffset;
  const modZUpper = medianVal + modZOffset;

  return {
    iqrBounds: { lower: iqrLower, upper: iqrUpper },
    zBounds: { lower: zLower, upper: zUpper },
    modZBounds: { lower: modZLower, upper: modZUpper },
    iqrOutlierIndices,
    zOutlierIndices,
    modZOutlierIndices,
    allOutlierIndices: Array.from(allOutlierIndicesSet),
  };
}

/**
 * Hypothesis Tests
 */
export interface OneSampleTestResult {
  statName: string;
  statistic: number;
  df?: number;
  pValue: number;
  criticalValue: number;
  decision: string;
}

export function runOneSampleZTest(arr: number[], hypMean: number, popStdDev: number, alpha = 0.05, tail: 'two' | 'left' | 'right' = 'two'): OneSampleTestResult {
  const n = arr.length;
  const mean = arr.reduce((acc, v) => acc + v, 0) / n;
  
  // z = (x_bar - mu) / (sigma / sqrt(n))
  const sem = popStdDev / Math.sqrt(n);
  const z = sem !== 0 ? (mean - hypMean) / sem : 0;

  let pVal = 0;
  let critVal = 0;

  if (tail === 'two') {
    pVal = 2 * (1 - normalCDF(Math.abs(z)));
    critVal = 1.96; // for alpha = 0.05
    if (alpha === 0.01) critVal = 2.576;
    if (alpha === 0.10) critVal = 1.645;
  } else if (tail === 'left') {
    pVal = normalCDF(z);
    critVal = -1.645;
    if (alpha === 0.01) critVal = -2.33;
    if (alpha === 0.10) critVal = -1.28;
  } else {
    pVal = 1 - normalCDF(z);
    critVal = 1.645;
    if (alpha === 0.01) critVal = 2.33;
    if (alpha === 0.10) critVal = 1.28;
  }

  const reject = pVal < alpha;
  const decision = reject 
    ? `Reject Null Hypothesis (H0). There is sufficient evidence that the population mean is different from ${hypMean} at α=${alpha}.` 
    : `Fail to Reject Null Hypothesis (H0). There is not enough evidence to conclude the population mean is different from ${hypMean} at α=${alpha}.`;

  return {
    statName: 'Z-Statistic',
    statistic: z,
    pValue: pVal,
    criticalValue: critVal,
    decision,
  };
}

export function runOneSampleTTest(arr: number[], hypMean: number, alpha = 0.05, tail: 'two' | 'left' | 'right' = 'two'): OneSampleTestResult {
  const n = arr.length;
  const mean = arr.reduce((acc, v) => acc + v, 0) / n;
  const variance = n > 1 ? arr.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n - 1) : 0;
  const stdDev = Math.sqrt(variance);

  // t = (x_bar - mu) / (s / sqrt(n))
  const sem = stdDev / Math.sqrt(n);
  const t = sem !== 0 ? (mean - hypMean) / sem : 0;
  const df = n - 1;

  // Approximate p-value using Student T distribution CDF approximation
  // Let's approximate CDF of T using t-to-z transformation
  const z = t * (1 - 1 / (4 * df)) / Math.sqrt(1 + t * t / (2 * df));
  let pVal = 0;
  if (tail === 'two') {
    pVal = 2 * (1 - normalCDF(Math.abs(z)));
  } else if (tail === 'left') {
    pVal = normalCDF(z);
  } else {
    pVal = 1 - normalCDF(z);
  }

  const critVal = getStudentTCriticalValue(df, 1 - (tail === 'two' ? alpha : alpha * 2));

  const reject = pVal < alpha;
  const decision = reject 
    ? `Reject H0. Evidence suggests the population mean is different from ${hypMean} (p = ${pVal.toFixed(4)} < α).` 
    : `Fail to Reject H0. Insufficient evidence (p = ${pVal.toFixed(4)} >= α).`;

  return {
    statName: 'T-Statistic',
    statistic: t,
    df,
    pValue: pVal,
    criticalValue: tail === 'left' ? -critVal : critVal,
    decision,
  };
}

export interface TwoSampleTTestResult {
  tStatistic: number;
  df: number;
  pValue: number;
  meanA: number;
  meanB: number;
  stdDevA: number;
  stdDevB: number;
  decision: string;
}

export function runTwoSampleTTest(arrA: number[], arrB: number[], alpha = 0.05, equalVar = false): TwoSampleTTestResult {
  const nA = arrA.length;
  const nB = arrB.length;
  const meanA = arrA.reduce((acc, v) => acc + v, 0) / nA;
  const meanB = arrB.reduce((acc, v) => acc + v, 0) / nB;

  const varA = nA > 1 ? arrA.reduce((acc, v) => acc + Math.pow(v - meanA, 2), 0) / (nA - 1) : 0;
  const varB = nB > 1 ? arrB.reduce((acc, v) => acc + Math.pow(v - meanB, 2), 0) / (nB - 1) : 0;

  const stdDevA = Math.sqrt(varA);
  const stdDevB = Math.sqrt(varB);

  let t = 0;
  let df = 0;

  if (equalVar) {
    // Pooled Variance
    const pooledVar = ((nA - 1) * varA + (nB - 1) * varB) / (nA + nB - 2);
    const sem = Math.sqrt(pooledVar * (1 / nA + 1 / nB));
    t = sem !== 0 ? (meanA - meanB) / sem : 0;
    df = nA + nB - 2;
  } else {
    // Welch's T Test
    const sem = Math.sqrt(varA / nA + varB / nB);
    t = sem !== 0 ? (meanA - meanB) / sem : 0;
    
    // Welch-Satterthwaite equation for d.f.
    const num = Math.pow(varA / nA + varB / nB, 2);
    const den = Math.pow(varA / nA, 2) / (nA - 1) + Math.pow(varB / nB, 2) / (nB - 1);
    df = den !== 0 ? num / den : 1;
  }

  // Approximate T-test p-value using T-to-Z transform
  const z = t * (1 - 1 / (4 * df)) / Math.sqrt(1 + t * t / (2 * df));
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));

  const reject = pValue < alpha;
  const decision = reject 
    ? `Reject H0. There is a statistically significant difference between Group A and Group B (p = ${pValue.toFixed(5)} < α).` 
    : `Fail to Reject H0. The difference between Group A and Group B is not statistically significant (p = ${pValue.toFixed(5)} >= α).`;

  return {
    tStatistic: t,
    df,
    pValue,
    meanA,
    meanB,
    stdDevA,
    stdDevB,
    decision,
  };
}

export function runPairedTTest(arrA: number[], arrB: number[], alpha = 0.05): TwoSampleTTestResult {
  const n = Math.min(arrA.length, arrB.length);
  const diffs = [];
  for (let i = 0; i < n; i++) {
    diffs.push(arrA[i] - arrB[i]);
  }

  const meanDiff = diffs.reduce((acc, v) => acc + v, 0) / n;
  const varDiff = n > 1 ? diffs.reduce((acc, v) => acc + Math.pow(v - meanDiff, 2), 0) / (n - 1) : 0;
  const stdDevDiff = Math.sqrt(varDiff);

  const sem = stdDevDiff / Math.sqrt(n);
  const t = sem !== 0 ? meanDiff / sem : 0;
  const df = n - 1;

  const z = t * (1 - 1 / (4 * df)) / Math.sqrt(1 + t * t / (2 * df));
  const pValue = 2 * (1 - normalCDF(Math.abs(z)));

  const meanA = arrA.reduce((acc, v) => acc + v, 0) / n;
  const meanB = arrB.reduce((acc, v) => acc + v, 0) / n;
  const stdDevA = Math.sqrt(arrA.reduce((acc, v) => acc + Math.pow(v - meanA, 2), 0) / (n - 1));
  const stdDevB = Math.sqrt(arrB.reduce((acc, v) => acc + Math.pow(v - meanB, 2), 0) / (n - 1));

  const reject = pValue < alpha;
  const decision = reject
    ? `Reject H0. The paired differences indicate a statistically significant change (p = ${pValue.toFixed(5)} < α).`
    : `Fail to Reject H0. The paired differences do not show a statistically significant change (p = ${pValue.toFixed(5)} >= α).`;

  return {
    tStatistic: t,
    df,
    pValue,
    meanA,
    meanB,
    stdDevA,
    stdDevB,
    decision,
  };
}

/**
 * Chi-Square Goodness of Fit Test
 * obs: observed frequencies, exp: expected frequencies
 */
export interface ChiSquareResult {
  chiSquare: number;
  df: number;
  pValue: number;
  decision: string;
}

export function runChiSquareTest(obs: number[], exp: number[], alpha = 0.05): ChiSquareResult {
  let chiSquare = 0;
  const n = obs.length;
  for (let i = 0; i < n; i++) {
    const expected = exp[i] || 1;
    chiSquare += Math.pow(obs[i] - expected, 2) / expected;
  }
  const df = n - 1;

  // Approximate Chi-Square p-value
  // For df = 1, p = 1 - erf(sqrt(chiSquare/2))
  // For larger df, Wilson-Hilferty transformation:
  // Z = ( (ChiSq/df)^(1/3) - (1 - 2/(9*df)) ) / sqrt( 2 / (9*df) )
  let pValue = 0;
  if (df === 1) {
    const z = Math.sqrt(chiSquare);
    pValue = 2 * (1 - normalCDF(z));
  } else {
    const term1 = Math.pow(chiSquare / df, 1 / 3);
    const term2 = 1 - 2 / (9 * df);
    const denom = Math.sqrt(2 / (9 * df));
    const z = (term1 - term2) / denom;
    pValue = 1 - normalCDF(z);
  }

  const reject = pValue < alpha;
  const decision = reject
    ? `Reject H0. Observed frequencies differ significantly from expected (p = ${pValue.toFixed(5)} < α).`
    : `Fail to Reject H0. Observed frequencies are consistent with expected (p = ${pValue.toFixed(5)} >= α).`;

  return {
    chiSquare,
    df,
    pValue,
    decision,
  };
}

/**
 * One-Way ANOVA (Analysis of Variance)
 */
export interface AnovaResult {
  fStatistic: number;
  dfBetween: number;
  dfWithin: number;
  pValue: number;
  ssBetween: number;
  ssWithin: number;
  msBetween: number;
  msWithin: number;
  decision: string;
}

export function runAnova(groups: number[][], alpha = 0.05): AnovaResult {
  const k = groups.length;
  const groupMeans = groups.map((g) => g.reduce((acc, v) => acc + v, 0) / g.length);
  const groupCounts = groups.map((g) => g.length);
  const totalN = groupCounts.reduce((acc, c) => acc + c, 0);

  const grandSum = groups.reduce((acc, g) => acc + g.reduce((sum, v) => sum + v, 0), 0);
  const grandMean = grandSum / totalN;

  // SS Between
  let ssBetween = 0;
  for (let i = 0; i < k; i++) {
    ssBetween += groupCounts[i] * Math.pow(groupMeans[i] - grandMean, 2);
  }

  // SS Within (SS Error)
  let ssWithin = 0;
  for (let i = 0; i < k; i++) {
    const gMean = groupMeans[i];
    groups[i].forEach((val) => {
      ssWithin += Math.pow(val - gMean, 2);
    });
  }

  const dfBetween = k - 1;
  const dfWithin = totalN - k;

  const msBetween = dfBetween > 0 ? ssBetween / dfBetween : 0;
  const msWithin = dfWithin > 0 ? ssWithin / dfWithin : 0;

  const f = msWithin !== 0 ? msBetween / msWithin : 0;

  // Approximate F p-value using Paulson approximation
  // Under H0, F follows F-distribution with dfBetween, dfWithin
  // We approximate using normal distribution transform
  let pValue = 0.5;
  if (dfBetween > 0 && dfWithin > 0 && f > 0) {
    const d1 = dfBetween;
    const d2 = dfWithin;
    const theta = Math.atan2(d1 * f, d2);
    // standard approximation
    const num = Math.pow(2 / (9 * d1), 1 / 3) * (1 - 2 / (9 * d2)) - Math.pow(2 / (9 * d2), 1 / 3) * (1 - 2 / (9 * d1)) * Math.pow(f, 1 / 3);
    const denom = Math.sqrt(Math.pow(2 / (9 * d1), 2 / 3) + Math.pow(2 / (9 * d2), 2 / 3) * Math.pow(f, 2 / 3));
    const z = num / denom;
    pValue = 1 - normalCDF(z);
  }

  const reject = pValue < alpha;
  const decision = reject
    ? `Reject H0. At least one group mean is significantly different from others (p = ${pValue.toFixed(5)} < α).`
    : `Fail to Reject H0. No statistically significant differences found among group means (p = ${pValue.toFixed(5)} >= α).`;

  return {
    fStatistic: f,
    dfBetween,
    dfWithin,
    pValue,
    ssBetween,
    ssWithin,
    msBetween,
    msWithin,
    decision,
  };
}

/**
 * Correlation and Regression for X and Y values
 */
export function calculateRegression(xArr: number[], yArr: number[]): RegressionResult | null {
  const n = Math.min(xArr.length, yArr.length);
  if (n < 2) return null;

  const meanX = xArr.reduce((acc, v) => acc + v, 0) / n;
  const meanY = yArr.reduce((acc, v) => acc + v, 0) / n;

  // Pearson Correlation Coefficient
  let numPearson = 0;
  let denX = 0;
  let denY = 0;

  for (let i = 0; i < n; i++) {
    const dx = xArr[i] - meanX;
    const dy = yArr[i] - meanY;
    numPearson += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const pearson = denX !== 0 && denY !== 0 
    ? numPearson / Math.sqrt(denX * denY) 
    : 0;

  // Spearman Rank Correlation
  const getRanks = (arr: number[]) => {
    const sortedWithIndex = arr.map((val, idx) => ({ val, idx }));
    sortedWithIndex.sort((a, b) => a.val - b.val);
    
    const ranks = new Array(arr.length).fill(0);
    let i = 0;
    while (i < sortedWithIndex.length) {
      let j = i;
      while (j < sortedWithIndex.length && sortedWithIndex[j].val === sortedWithIndex[i].val) {
        j++;
      }
      // Mean rank for ties
      const avgRank = (i + 1 + j) / 2;
      for (let k = i; k < j; k++) {
        ranks[sortedWithIndex[k].idx] = avgRank;
      }
      i = j;
    }
    return ranks;
  };

  const ranksX = getRanks(xArr);
  const ranksY = getRanks(yArr);

  let d2Sum = 0;
  for (let i = 0; i < n; i++) {
    const d = ranksX[i] - ranksY[i];
    d2Sum += d * d;
  }
  const spearman = 1 - (6 * d2Sum) / (n * (n * n - 1));

  // Linear Regression Equation: Y = Intercept + Slope * X
  // Slope = Sum((x - meanX) * (y - meanY)) / Sum((x - meanX)^2)
  const slope = denX !== 0 ? numPearson / denX : 0;
  const intercept = meanY - slope * meanX;
  const r2 = pearson * pearson;

  const equation = `y = ${intercept >= 0 ? '' : '-'}${Math.abs(intercept).toFixed(4)} ${slope >= 0 ? '+' : '-'} ${Math.abs(slope).toFixed(4)}x`;

  const predictions: number[] = [];
  const residuals: number[] = [];
  const dataPoints = [];

  for (let i = 0; i < n; i++) {
    const x = xArr[i];
    const y = yArr[i];
    const yPred = intercept + slope * x;
    const residual = y - yPred;

    predictions.push(yPred);
    residuals.push(residual);
    dataPoints.push({ x, y, yPred, residual });
  }

  return {
    pearson,
    spearman,
    slope,
    intercept,
    r2,
    equation,
    predictions,
    residuals,
    dataPoints,
  };
}

/**
 * Cohen's d Effect Size for Two Groups
 */
export function calculateEffectSize(arrA: number[], arrB: number[]): number {
  const nA = arrA.length;
  const nB = arrB.length;
  if (nA === 0 || nB === 0) return 0;

  const meanA = arrA.reduce((a, b) => a + b, 0) / nA;
  const meanB = arrB.reduce((a, b) => a + b, 0) / nB;

  const varA = nA > 1 ? arrA.reduce((acc, v) => acc + Math.pow(v - meanA, 2), 0) / (nA - 1) : 0;
  const varB = nB > 1 ? arrB.reduce((acc, v) => acc + Math.pow(v - meanB, 2), 0) / (nB - 1) : 0;

  const pooledSD = Math.sqrt(((nA - 1) * varA + (nB - 1) * varB) / (nA + nB - 2));
  return pooledSD !== 0 ? (meanA - meanB) / pooledSD : 0;
}
