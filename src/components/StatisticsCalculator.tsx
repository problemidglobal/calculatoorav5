import React, { useState, useMemo, useEffect } from 'react';
import {
  Sparkles,
  HelpCircle,
  RefreshCw,
  Download,
  Info,
  Layers,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Trash2,
  Plus,
  BookOpen,
  TrendingUp,
  Sliders,
  Scale,
  Activity,
  Calculator,
  ArrowRightLeft,
  BookMarked
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  calculateDescriptiveStats,
  calculateDistributionStats,
  calculateConfidenceIntervals,
  detectOutliers,
  runOneSampleZTest,
  runOneSampleTTest,
  runTwoSampleTTest,
  runPairedTTest,
  runChiSquareTest,
  runAnova,
  calculateRegression,
  calculateEffectSize,
  DescriptiveStats,
  ConfidenceInterval,
  RegressionResult,
  OneSampleTestResult,
  TwoSampleTTestResult,
  ChiSquareResult,
  AnovaResult,
  normalCDF,
  factorial,
  nCr
} from '../utils/statisticsMath';
import StatisticsVisualizer from './StatisticsVisualizer';

interface StatisticsCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function StatisticsCalculator({ onNavigate }: StatisticsCalculatorProps) {
  // --- STATE CONTROLS ---
  const [activeInputTab, setActiveInputTab] = useState<'raw' | 'table' | 'freq' | 'grouped' | 'weighted'>('raw');
  const [groupComparisonEnabled, setGroupComparisonEnabled] = useState<boolean>(false);
  const [selectedExplainingStat, setSelectedExplainingStat] = useState<string>('mean');

  // --- OUTLIER FILTERING CONTROLS ---
  const [outlierFilterMode, setOutlierFilterMode] = useState<'include' | 'exclude'>('include');

  // --- INPUT STATES ---
  // Mode 1: Raw List (Comma separated, one per line, spreadsheet paste)
  const [rawText, setRawText] = useState<string>('');
  
  // Mode 2: Interactive Table
  const [tableRows, setTableRows] = useState<string[]>([]);
  const [tableInputVal, setTableInputVal] = useState<string>('');

  // Mode 3: Frequency Table
  const [freqRows, setFreqRows] = useState<{ val: string; freq: string }[]>([
    { val: '', freq: '' },
    { val: '', freq: '' },
    { val: '', freq: '' }
  ]);

  // Mode 4: Grouped Data (Class Interval + Frequency)
  const [groupedRows, setGroupedRows] = useState<{ lower: string; upper: string; freq: string }[]>([
    { lower: '', upper: '', freq: '' },
    { lower: '', upper: '', freq: '' },
    { lower: '', upper: '', freq: '' }
  ]);

  // Mode 5: Weighted Observations
  const [weightedRows, setWeightedRows] = useState<{ val: string; weight: string }[]>([
    { val: '', weight: '' },
    { val: '', weight: '' },
    { val: '', weight: '' }
  ]);

  // --- GROUP B INPUTS (FOR COMPARISON MODE) ---
  const [groupBRawText, setGroupBRawText] = useState<string>('');

  // --- HYPOTHESIS TEST CONTROLS ---
  const [hypothesizedMean, setHypothesizedMean] = useState<string>('');
  const [knownPopStdDev, setKnownPopStdDev] = useState<string>('');
  const [testAlpha, setTestAlpha] = useState<number>(0.05);
  const [testTail, setTestTail] = useState<'two' | 'left' | 'right'>('two');

  // --- TWO-SAMPLE & COMPARISON CONTROLS ---
  const [equalVarianceToggle, setEqualVarianceToggle] = useState<boolean>(false);

  // --- CORRELATION & REGRESSION X-Y INPUTS ---
  const [regressionXText, setRegressionXText] = useState<string>('');
  const [regressionYText, setRegressionYText] = useState<string>('');
  const [predictionTargetX, setPredictionTargetX] = useState<string>('');

  // --- PROBABILITY DISTRIBUTION QUICK CALCULATOR ---
  const [activeDist, setActiveDist] = useState<'normal' | 'binomial' | 'poisson' | 'geometric' | 'hyper' | 'uniform' | 'exponential'>('normal');
  const [distParams, setDistParams] = useState<{ [key: string]: string }>({
    normalMean: '',
    normalSd: '',
    normalX: '',
    binomN: '',
    binomP: '',
    binomK: '',
    poissonLambda: '',
    poissonK: '',
    geomP: '',
    geomK: '',
    hyperN: '',
    hyperK: '',
    hyperSampleN: '',
    hyperSuccessK: '',
    uniformMin: '',
    uniformMax: '',
    uniformX: '',
    expLambda: '',
    expX: ''
  });

  // --- VALIDATION ERROR STATE ---
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [groupBValidationErrors, setGroupBValidationErrors] = useState<string[]>([]);

  // --- HANDLERS FOR USER DATA SOURCING ---
  
  // Parse numeric list from text input
  const parseList = (text: string, isGroupB = false) => {
    if (!text.trim()) return [];
    // Handles commas, spaces, tabs, newlines, semicolons
    const rawTokens = text.split(/[\s,;\t\n]+/);
    const parsed: number[] = [];
    const errors: string[] = [];

    rawTokens.forEach((t) => {
      const token = t.trim();
      if (!token) return;
      const numVal = Number(token);
      if (isNaN(numVal)) {
        errors.push(`"${token}" is not a valid number`);
      } else {
        parsed.push(numVal);
      }
    });

    if (isGroupB) {
      setGroupBValidationErrors(errors);
    } else {
      setValidationErrors(errors);
    }

    return parsed;
  };

  // Compile active input datasets
  const activeDataset: number[] = useMemo(() => {
    let rawList: number[] = [];
    setValidationErrors([]);

    if (activeInputTab === 'raw') {
      rawList = parseList(rawText);
    } else if (activeInputTab === 'table') {
      rawList = tableRows.map(Number).filter((v) => !isNaN(v));
    } else if (activeInputTab === 'freq') {
      const list: number[] = [];
      const errors: string[] = [];
      freqRows.forEach((row, i) => {
        if (!row.val.trim() && !row.freq.trim()) return;
        const v = Number(row.val);
        const f = Number(row.freq);
        if (isNaN(v) || row.val === '') {
          errors.push(`Row ${i + 1}: Invalid value`);
        }
        if (isNaN(f) || row.freq === '' || f < 0) {
          errors.push(`Row ${i + 1}: Frequency must be a non-negative number`);
        } else {
          for (let j = 0; j < f; j++) {
            list.push(v);
          }
        }
      });
      if (errors.length > 0) setValidationErrors(errors);
      rawList = list;
    } else if (activeInputTab === 'grouped') {
      // Grouped midpoint representation
      const list: number[] = [];
      const errors: string[] = [];
      groupedRows.forEach((row, i) => {
        if (!row.lower.trim() && !row.upper.trim() && !row.freq.trim()) return;
        const l = Number(row.lower);
        const u = Number(row.upper);
        const f = Number(row.freq);
        if (isNaN(l) || isNaN(u) || l > u) {
          errors.push(`Row ${i + 1}: Invalid boundaries`);
        }
        if (isNaN(f) || f < 0) {
          errors.push(`Row ${i + 1}: Frequency must be non-negative`);
        } else {
          const midpoint = (l + u) / 2;
          for (let j = 0; j < f; j++) {
            list.push(midpoint);
          }
        }
      });
      if (errors.length > 0) setValidationErrors(errors);
      rawList = list;
    } else if (activeInputTab === 'weighted') {
      const list: number[] = [];
      const errors: string[] = [];
      weightedRows.forEach((row, i) => {
        if (!row.val.trim() && !row.weight.trim()) return;
        const v = Number(row.val);
        const w = Number(row.weight);
        if (isNaN(v)) errors.push(`Row ${i + 1}: Invalid value`);
        if (isNaN(w) || w < 0) errors.push(`Row ${i + 1}: Weight must be positive`);
        else {
          // Approximate weighted points for descriptive stats by expanding
          // e.g. weight * 10 or similar, but let's treat weights as frequencies for calculations
          const weightInt = Math.round(w * 100);
          for (let j = 0; j < weightInt; j++) {
            list.push(v);
          }
        }
      });
      if (errors.length > 0) setValidationErrors(errors);
      rawList = list;
    }

    return rawList;
  }, [activeInputTab, rawText, tableRows, freqRows, groupedRows, weightedRows]);

  // Group B dataset compiled
  const groupBDataset: number[] = useMemo(() => {
    if (!groupComparisonEnabled) return [];
    return parseList(groupBRawText, true);
  }, [groupBRawText, groupComparisonEnabled]);

  // --- OUTLIER TREATMENT INTERCEPT ---
  const datasetAfterOutlierTreatment = useMemo(() => {
    if (activeDataset.length === 0) return [];
    
    // Preliminary descriptive analysis to find outliers
    const tempStats = calculateDescriptiveStats(activeDataset);
    if (!tempStats) return activeDataset;

    if (outlierFilterMode === 'include') return activeDataset;

    // Detect using IQR Outlier thresholds
    const iqr = tempStats.q3 - tempStats.q1;
    const lowerBound = tempStats.q1 - 1.5 * iqr;
    const upperBound = tempStats.q3 + 1.5 * iqr;

    return activeDataset.filter((v) => v >= lowerBound && v <= upperBound);
  }, [activeDataset, outlierFilterMode]);

  // --- ADVANCED CALCULATIONS DESPATCH ---
  const descriptiveStats: DescriptiveStats | null = useMemo(() => {
    return calculateDescriptiveStats(datasetAfterOutlierTreatment);
  }, [datasetAfterOutlierTreatment]);

  const distributionStats = useMemo(() => {
    if (!descriptiveStats) return null;
    return calculateDistributionStats(datasetAfterOutlierTreatment, descriptiveStats.mean, descriptiveStats.populationStdDev);
  }, [datasetAfterOutlierTreatment, descriptiveStats]);

  const confidenceIntervals: ConfidenceInterval[] = useMemo(() => {
    if (!descriptiveStats) return [];
    return calculateConfidenceIntervals(datasetAfterOutlierTreatment, descriptiveStats.mean, descriptiveStats.sampleStdDev);
  }, [datasetAfterOutlierTreatment, descriptiveStats]);

  const outlierAnalysis = useMemo(() => {
    if (!descriptiveStats) return null;
    return detectOutliers(activeDataset, descriptiveStats.q1, descriptiveStats.q3, descriptiveStats.mean, descriptiveStats.sampleStdDev);
  }, [activeDataset, descriptiveStats]);

  // --- CORRELATION & REGRESSION PROCESSOR ---
  const regressionResult: RegressionResult | null = useMemo(() => {
    const xList = parseList(regressionXText);
    const yList = parseList(regressionYText);
    if (xList.length < 2 || yList.length < 2) return null;
    return calculateRegression(xList, yList);
  }, [regressionXText, regressionYText]);

  // Prediction solver using regression
  const predictionYResult = useMemo(() => {
    if (!regressionResult || !predictionTargetX) return null;
    const targetX = Number(predictionTargetX);
    if (isNaN(targetX)) return null;
    return regressionResult.intercept + regressionResult.slope * targetX;
  }, [regressionResult, predictionTargetX]);

  // --- GROUP COMPARISON STATISTICS ---
  const groupAStats = descriptiveStats;
  const groupBStats: DescriptiveStats | null = useMemo(() => {
    if (!groupComparisonEnabled || groupBDataset.length === 0) return null;
    return calculateDescriptiveStats(groupBDataset);
  }, [groupBDataset, groupComparisonEnabled]);

  const groupComparisonResults = useMemo(() => {
    if (!groupComparisonEnabled || !groupAStats || !groupBStats || datasetAfterOutlierTreatment.length === 0 || groupBDataset.length === 0) return null;
    
    // Comparative t-test
    const tTest = runTwoSampleTTest(datasetAfterOutlierTreatment, groupBDataset, testAlpha, equalVarianceToggle);
    const effectSize = calculateEffectSize(datasetAfterOutlierTreatment, groupBDataset);

    return {
      tTest,
      effectSize,
      meanDiff: groupAStats.mean - groupBStats.mean,
      varRatio: groupBStats.sampleVariance !== 0 ? groupAStats.sampleVariance / groupBStats.sampleVariance : 0
    };
  }, [groupComparisonEnabled, groupAStats, groupBStats, datasetAfterOutlierTreatment, groupBDataset, testAlpha, equalVarianceToggle]);

  // --- HYPOTHESIS TESTS ON ACTIVE DATA ---
  const activeHypothesisTests = useMemo(() => {
    if (!descriptiveStats || datasetAfterOutlierTreatment.length < 2) return null;

    const hypM = Number(hypothesizedMean) || 0;
    const popSD = Number(knownPopStdDev) || 0;

    // One-Sample T Test
    const oneSampleT = runOneSampleTTest(datasetAfterOutlierTreatment, hypM, testAlpha, testTail);
    
    // One-Sample Z Test (if known population standard deviation is provided)
    const oneSampleZ = popSD > 0 
      ? runOneSampleZTest(datasetAfterOutlierTreatment, hypM, popSD, testAlpha, testTail) 
      : null;

    return {
      oneSampleT,
      oneSampleZ,
      hypM,
      popSD
    };
  }, [descriptiveStats, datasetAfterOutlierTreatment, hypothesizedMean, knownPopStdDev, testAlpha, testTail]);

  // --- PROBABILITY DISTRIBUTION QUICK CALCULATIONS ---
  const calculatedProbability = useMemo(() => {
    const params = distParams;
    try {
      if (activeDist === 'normal') {
        const mean = Number(params.normalMean);
        const sd = Number(params.normalSd);
        const x = Number(params.normalX);
        if (isNaN(mean) || isNaN(sd) || isNaN(x) || sd <= 0) return null;
        
        // P(X <= x)
        const cum = normalCDF(x, mean, sd);
        const density = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / sd, 2));
        return {
          cdf: cum,
          pdf: density,
          greater: 1 - cum
        };
      }
      if (activeDist === 'binomial') {
        const n = Math.round(Number(params.binomN));
        const p = Number(params.binomP);
        const k = Math.round(Number(params.binomK));
        if (isNaN(n) || isNaN(p) || isNaN(k) || n < 1 || p < 0 || p > 1 || k < 0 || k > n) return null;

        // P(X = k) = nCr * p^k * (1-p)^(n-k)
        const pmf = nCr(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
        
        // Cumulative P(X <= k)
        let cdf = 0;
        for (let i = 0; i <= k; i++) {
          cdf += nCr(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
        }
        return { pmf, cdf, greater: 1 - cdf + pmf };
      }
      if (activeDist === 'poisson') {
        const lambda = Number(params.poissonLambda);
        const k = Math.round(Number(params.poissonK));
        if (isNaN(lambda) || isNaN(k) || lambda <= 0 || k < 0) return null;

        // P(X = k) = e^(-lambda) * lambda^k / k!
        const pmf = Math.exp(-lambda) * Math.pow(lambda, k) / factorial(k);
        let cdf = 0;
        for (let i = 0; i <= k; i++) {
          cdf += Math.exp(-lambda) * Math.pow(lambda, i) / factorial(i);
        }
        return { pmf, cdf, greater: 1 - cdf + pmf };
      }
      if (activeDist === 'geometric') {
        const p = Number(params.geomP);
        const k = Math.round(Number(params.geomK));
        if (isNaN(p) || isNaN(k) || p <= 0 || p > 1 || k < 1) return null;

        // P(X = k) = p * (1-p)^(k-1)
        const pmf = p * Math.pow(1 - p, k - 1);
        const cdf = 1 - Math.pow(1 - p, k);
        return { pmf, cdf, greater: 1 - cdf + pmf };
      }
      if (activeDist === 'hyper') {
        const N = Math.round(Number(params.hyperN));
        const K = Math.round(Number(params.hyperK));
        const n = Math.round(Number(params.hyperSampleN));
        const k = Math.round(Number(params.hyperSuccessK));
        if (isNaN(N) || isNaN(K) || isNaN(n) || isNaN(k) || N < 1 || K < 0 || K > N || n < 1 || n > N || k < 0 || k > K || k > n) return null;

        // P(X = k) = (K cr k) * ((N-K) cr (n-k)) / (N cr n)
        const pmf = (nCr(K, k) * nCr(N - K, n - k)) / nCr(N, n);
        
        let cdf = 0;
        for (let i = 0; i <= k; i++) {
          cdf += (nCr(K, i) * nCr(N - K, n - i)) / nCr(N, n);
        }
        return { pmf, cdf, greater: 1 - cdf + pmf };
      }
      if (activeDist === 'uniform') {
        const min = Number(params.uniformMin);
        const max = Number(params.uniformMax);
        const x = Number(params.uniformX);
        if (isNaN(min) || isNaN(max) || isNaN(x) || min >= max) return null;

        let pdf = 0;
        let cdf = 0;
        if (x >= min && x <= max) {
          pdf = 1 / (max - min);
          cdf = (x - min) / (max - min);
        } else if (x > max) {
          cdf = 1;
        }

        return { pdf, cdf, greater: 1 - cdf };
      }
      if (activeDist === 'exponential') {
        const lambda = Number(params.expLambda);
        const x = Number(params.expX);
        if (isNaN(lambda) || isNaN(x) || lambda <= 0 || x < 0) return null;

        const pdf = lambda * Math.exp(-lambda * x);
        const cdf = 1 - Math.exp(-lambda * x);
        return { pdf, cdf, greater: 1 - cdf };
      }
    } catch {
      return null;
    }
    return null;
  }, [activeDist, distParams]);

  // --- PRESET EXAMPLE LOADER ---
  const handleLoadExample = () => {
    // Premium representative statistical example data (no defaults loaded prior to click)
    const dataset = [12, 15, 18, 14, 22, 25, 20, 18, 16, 24, 28, 19, 15, 21, 18];
    
    if (activeInputTab === 'raw') {
      setRawText(dataset.join(', '));
    } else if (activeInputTab === 'table') {
      setTableRows(dataset.map(String));
    } else if (activeInputTab === 'freq') {
      // Frequency representation of the dataset
      setFreqRows([
        { val: '12', freq: '1' },
        { val: '15', freq: '2' },
        { val: '18', freq: '3' },
        { val: '20', freq: '2' },
        { val: '22', freq: '2' },
        { val: '25', freq: '3' },
        { val: '28', freq: '2' }
      ]);
    } else if (activeInputTab === 'grouped') {
      setGroupedRows([
        { lower: '10', upper: '15', freq: '3' },
        { lower: '15', upper: '20', freq: '7' },
        { lower: '20', upper: '25', freq: '4' },
        { lower: '25', upper: '30', freq: '1' }
      ]);
    } else if (activeInputTab === 'weighted') {
      setWeightedRows([
        { val: '15', weight: '0.2' },
        { val: '18', weight: '0.35' },
        { val: '22', weight: '0.15' },
        { val: '25', weight: '0.3' }
      ]);
    }

    // Load correlation dummy regression data
    setRegressionXText('10, 14, 16, 18, 22, 24, 28');
    setRegressionYText('150, 185, 200, 225, 260, 280, 310');
    setPredictionTargetX('20');

    // Load group B example
    if (groupComparisonEnabled) {
      setGroupBRawText('14, 16, 17, 15, 24, 26, 21, 23, 19, 20');
    }

    // Set probability inputs
    setDistParams({
      normalMean: '100',
      normalSd: '15',
      normalX: '115',
      binomN: '10',
      binomP: '0.5',
      binomK: '5',
      poissonLambda: '4',
      poissonK: '3',
      geomP: '0.2',
      geomK: '4',
      hyperN: '50',
      hyperK: '10',
      hyperSampleN: '5',
      hyperSuccessK: '2',
      uniformMin: '0',
      uniformMax: '10',
      uniformX: '5',
      expLambda: '0.5',
      expX: '2'
    });

    setHypothesizedMean('18');
    setKnownPopStdDev('5');
    setValidationErrors([]);
  };

  // --- RESET ALL CHANNELS ---
  const handleClearAll = () => {
    setRawText('');
    setTableRows([]);
    setTableInputVal('');
    setFreqRows([
      { val: '', freq: '' },
      { val: '', freq: '' },
      { val: '', freq: '' }
    ]);
    setGroupedRows([
      { lower: '', upper: '', freq: '' },
      { lower: '', upper: '', freq: '' },
      { lower: '', upper: '', freq: '' }
    ]);
    setWeightedRows([
      { val: '', weight: '' },
      { val: '', weight: '' },
      { val: '', weight: '' }
    ]);
    setGroupBRawText('');
    setRegressionXText('');
    setRegressionYText('');
    setPredictionTargetX('');
    setHypothesizedMean('');
    setKnownPopStdDev('');
    setDistParams({
      normalMean: '',
      normalSd: '',
      normalX: '',
      binomN: '',
      binomP: '',
      binomK: '',
      poissonLambda: '',
      poissonK: '',
      geomP: '',
      geomK: '',
      hyperN: '',
      hyperK: '',
      hyperSampleN: '',
      hyperSuccessK: '',
      uniformMin: '',
      uniformMax: '',
      uniformX: '',
      expLambda: '',
      expX: ''
    });
    setValidationErrors([]);
    setGroupBValidationErrors([]);
  };

  // --- DOWNLOAD EXPORTS HANDLERS ---
  const handleExportCSV = () => {
    if (activeDataset.length === 0) return;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Index,Value\n';
    activeDataset.forEach((val, i) => {
      csvContent += `${i + 1},${val}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'calculatoora_statistics_dataset.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJSON = () => {
    if (activeDataset.length === 0) return;
    const jsonOutput = {
      calculator: 'Calculatoora Ultimate Statistics Solver',
      timestamp: new Date().toISOString(),
      rawDataset: activeDataset,
      outliersFilteredDataset: datasetAfterOutlierTreatment,
      descriptiveStats,
      distributionStats,
      confidenceIntervals,
      regressionResult
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(jsonOutput, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', 'calculatoora_statistics_report.json');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportXLS = () => {
    // Generate a clean HTML format representing Excel structure
    if (activeDataset.length === 0 || !descriptiveStats) return;

    let xlsHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>Statistics Report</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        <style>
          th { background-color: #2563eb; color: #ffffff; font-weight: bold; }
          td, th { border: 1px solid #dddddd; text-align: left; padding: 8px; font-family: sans-serif; }
        </style>
      </head>
      <body>
        <h2>Calculatoora Statistics Calculator - Excel Audit</h2>
        <table>
          <tr><th>Statistic</th><th>Value</th></tr>
          <tr><td>Sample Count (N)</td><td>${descriptiveStats.count}</td></tr>
          <tr><td>Sum</td><td>${descriptiveStats.sum}</td></tr>
          <tr><td>Mean</td><td>${descriptiveStats.mean.toFixed(4)}</td></tr>
          <tr><td>Median</td><td>${descriptiveStats.median}</td></tr>
          <tr><td>Minimum</td><td>${descriptiveStats.min}</td></tr>
          <tr><td>Maximum</td><td>${descriptiveStats.max}</td></tr>
          <tr><td>Range</td><td>${descriptiveStats.range}</td></tr>
          <tr><td>Sample Variance</td><td>${descriptiveStats.sampleVariance.toFixed(4)}</td></tr>
          <tr><td>Population Variance</td><td>${descriptiveStats.populationVariance.toFixed(4)}</td></tr>
          <tr><td>Sample Std Dev</td><td>${descriptiveStats.sampleStdDev.toFixed(4)}</td></tr>
          <tr><td>Population Std Dev</td><td>${descriptiveStats.populationStdDev.toFixed(4)}</td></tr>
          <tr><td>Coefficient of Variation (%)</td><td>${descriptiveStats.coefVariation.toFixed(2)}%</td></tr>
          <tr><td>Interquartile Range (IQR)</td><td>${descriptiveStats.iqr}</td></tr>
          <tr><td>Q1 (25th Percentile)</td><td>${descriptiveStats.q1}</td></tr>
          <tr><td>Q3 (75th Percentile)</td><td>${descriptiveStats.q3}</td></tr>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([xlsHTML], { type: 'application/vnd.ms-excel' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'calculatoora_statistics_ledger.xls';
    link.click();
  };

  const handleExportPDFReport = () => {
    // Beautiful clean PDF report download via iframe print setup
    if (activeDataset.length === 0 || !descriptiveStats) return;

    const reportWindow = window.open('', '_blank');
    if (!reportWindow) return;

    reportWindow.document.write(`
      <html>
        <head>
          <title>Statistics Analysis Report - Calculatoora</title>
          <style>
            body { font-family: 'Inter', system-ui, sans-serif; color: #1f2937; line-height: 1.5; padding: 40px; }
            h1 { font-size: 24px; color: #2563eb; margin-bottom: 5px; }
            h2 { font-size: 18px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px; margin-top: 30px; }
            .meta { font-size: 12px; color: #6b7280; margin-bottom: 30px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            th { background-color: #f9fafb; font-weight: bold; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            .footer { margin-top: 50px; font-size: 11px; text-align: center; color: #9ca3af; }
          </style>
        </head>
        <body>
          <h1>Descriptive & Inferential Statistics Ledger</h1>
          <div class="meta">Generated via CALCULATOORA Premium Solver on ${new Date().toLocaleDateString()}</div>

          <div class="grid">
            <div>
              <h2>Descriptive Overview</h2>
              <table>
                <tr><td>Observations (N)</td><td>${descriptiveStats.count}</td></tr>
                <tr><td>Sum</td><td>${descriptiveStats.sum}</td></tr>
                <tr><td>Arithmetic Mean</td><td>${descriptiveStats.mean.toFixed(4)}</td></tr>
                <tr><td>Median</td><td>${descriptiveStats.median}</td></tr>
                <tr><td>Modes</td><td>${descriptiveStats.modes.join(', ') || 'No mode'}</td></tr>
                <tr><td>Minimum</td><td>${descriptiveStats.min}</td></tr>
                <tr><td>Maximum</td><td>${descriptiveStats.max}</td></tr>
                <tr><td>Range</td><td>${descriptiveStats.range}</td></tr>
              </table>
            </div>

            <div>
              <h2>Dispersion & Shape</h2>
              <table>
                <tr><td>Sample Variance</td><td>${descriptiveStats.sampleVariance.toFixed(4)}</td></tr>
                <tr><td>Sample Std Dev (s)</td><td>${descriptiveStats.sampleStdDev.toFixed(4)}</td></tr>
                <tr><td>Population Std Dev (σ)</td><td>${descriptiveStats.populationStdDev.toFixed(4)}</td></tr>
                <tr><td>Coeff. of Variation (CV)</td><td>${descriptiveStats.coefVariation.toFixed(2)}%</td></tr>
                <tr><td>Mean Absolute Deviation</td><td>${descriptiveStats.meanAbsoluteDeviation.toFixed(4)}</td></tr>
                <tr><td>Median Abs. Deviation</td><td>${descriptiveStats.medianAbsoluteDeviation.toFixed(4)}</td></tr>
                <tr><td>Skewness</td><td>${distributionStats?.skewness.toFixed(4)}</td></tr>
                <tr><td>Excess Kurtosis</td><td>${distributionStats?.kurtosis.toFixed(4)}</td></tr>
              </table>
            </div>
          </div>

          <h2>Quantile Division</h2>
          <table>
            <tr>
              <th>Min (0%)</th>
              <th>Q1 (25%)</th>
              <th>Median (50%)</th>
              <th>Q3 (75%)</th>
              <th>Max (100%)</th>
              <th>IQR</th>
            </tr>
            <tr>
              <td>${descriptiveStats.min}</td>
              <td>${descriptiveStats.q1}</td>
              <td>${descriptiveStats.median}</td>
              <td>${descriptiveStats.q3}</td>
              <td>${descriptiveStats.max}</td>
              <td>${descriptiveStats.iqr}</td>
            </tr>
          </table>

          <h2>Confidence Intervals for Population Mean (μ)</h2>
          <table>
            <tr><th>Confidence Level</th><th>Margin of Error</th><th>Interval Range</th></tr>
            ${confidenceIntervals.map(ci => `
              <tr>
                <td>${ci.confidenceLevel}%</td>
                <td>±${ci.marginOfError.toFixed(4)}</td>
                <td>[${ci.lowerBound.toFixed(4)}, ${ci.upperBound.toFixed(4)}]</td>
              </tr>
            `).join('')}
          </table>

          <div class="footer">Calculatoora © 2026 - World's Largest Calculation Hub</div>
          <script>window.print();</script>
        </body>
      </html>
    `);
    reportWindow.document.close();
  };

  // --- STEP-BY-STEP CALCULATION GENERATOR ENGINE ---
  const currentExplanationHTML = useMemo(() => {
    if (!descriptiveStats) return { formula: '', substitution: '', steps: [], explanation: '' };

    const selected = selectedExplainingStat;

    if (selected === 'mean') {
      return {
        formula: '\\bar{X} = \\frac{\\sum_{i=1}^{n} X_i}{n}',
        substitution: `\\bar{X} = \\frac{${descriptiveStats.sum}}{${descriptiveStats.count}}`,
        steps: [
          `Add all numerical observations in the dataset to find the sum: ${descriptiveStats.sum}.`,
          `Count the total number of items in the dataset (n): ${descriptiveStats.count}.`,
          `Divide the sum by the count: ${descriptiveStats.sum} / ${descriptiveStats.count} = ${descriptiveStats.mean.toFixed(4)}.`
        ],
        explanation: 'The mean represents the mathematical average center of your data, showing the value that would result if your data points were evenly divided.'
      };
    }

    if (selected === 'variance') {
      return {
        formula: 's^2 = \\frac{\\sum_{i=1}^{n} (X_i - \\bar{X})^2}{n - 1}',
        substitution: `s^2 = \\frac{\\sum (X_i - ${descriptiveStats.mean.toFixed(2)})^2}{${descriptiveStats.count} - 1}`,
        steps: [
          `Calculate the Mean of your dataset: ${descriptiveStats.mean.toFixed(4)}.`,
          `Subtract the Mean from each data point, square the result, and sum those squared differences.`,
          `For your dataset, the sum of squared deviations (SSD) is ${(descriptiveStats.sampleVariance * (descriptiveStats.count - 1)).toFixed(4)}.`,
          `Divide the sum of squared deviations by n - 1 (since this is a sample variance): ${(descriptiveStats.sampleVariance * (descriptiveStats.count - 1)).toFixed(4)} / (${descriptiveStats.count} - 1) = ${descriptiveStats.sampleVariance.toFixed(4)}.`
        ],
        explanation: 'Variance measures the degree of spread or dispersion in your dataset, showing how far individual observations deviate from the mean.'
      };
    }

    if (selected === 'stddev') {
      return {
        formula: 's = \\sqrt{s^2}',
        substitution: `s = \\sqrt{${descriptiveStats.sampleVariance.toFixed(4)}}`,
        steps: [
          `Calculate the sample variance of your dataset: ${descriptiveStats.sampleVariance.toFixed(4)}.`,
          `Take the positive square root of the variance: √${descriptiveStats.sampleVariance.toFixed(4)}.`,
          `The resulting standard deviation is ${descriptiveStats.sampleStdDev.toFixed(4)}.`
        ],
        explanation: 'Standard Deviation is the most common metric of dispersion. It represents the average distance of data points from the mean, expressed in the same units as the original data.'
      };
    }

    if (selected === 'median') {
      return {
        formula: '\\text{Median} = P_{50}',
        substitution: `Sorted Data: [${[...datasetAfterOutlierTreatment].sort((a,b)=>a-b).join(', ')}]`,
        steps: [
          'Arrange your numerical dataset in ascending order.',
          `Find the middle position. If n is odd, the median is the center value. If n is even, it is the average of the two middle values.`,
          `For n = ${descriptiveStats.count}, the median value is calculated as ${descriptiveStats.median}.`
        ],
        explanation: 'The median is the exact middle of the sorted dataset. 50% of the observations fall below the median and 50% lie above it. It is highly resistant to extreme outliers.'
      };
    }

    if (selected === 'zscore') {
      return {
        formula: 'Z = \\frac{X - \\bar{X}}{s}',
        substitution: `Z = \\frac{X - ${descriptiveStats.mean.toFixed(2)}}{${descriptiveStats.sampleStdDev.toFixed(2)}}`,
        steps: [
          `Calculate the dataset Mean: ${descriptiveStats.mean.toFixed(4)}.`,
          `Calculate the dataset Standard Deviation: ${descriptiveStats.sampleStdDev.toFixed(4)}.`,
          `For any value X, subtract the mean and divide by the standard deviation to find how many standard deviations X is away from the mean.`
        ],
        explanation: 'A Z-score indicates how many standard deviations a specific observation lies above or below the mean. Z-scores greater than 3 or less than -3 are typically flagged as outliers.'
      };
    }

    return { formula: '', substitution: '', steps: [], explanation: '' };
  }, [descriptiveStats, selectedExplainingStat, datasetAfterOutlierTreatment]);


  return (
    <div className="space-y-12 select-none text-neutral-800 dark:text-neutral-200">
      
      {/* HEADER HERO AREA */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="bg-blue-500/30 text-blue-100 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-widest inline-flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> CALCULATOORA ULTIMATE
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Statistics Calculator</h1>
            <p className="text-blue-100 max-w-xl text-sm leading-relaxed">
              Professional real-time statistical analysis, dynamic data visualization, confidence interval solvers, linear regression modeling, and hypothesis testing in one click.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleLoadExample}
              className="px-5 py-3 bg-white text-blue-700 font-bold text-sm rounded-2xl hover:bg-neutral-50 active:scale-95 transition shadow-lg inline-flex items-center gap-2"
              aria-label="Load Realistic Example Dataset"
            >
              <RefreshCw className="w-4 h-4 text-blue-700" /> Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="px-5 py-3 bg-blue-700/50 border border-blue-400/30 text-white font-bold text-sm rounded-2xl hover:bg-blue-700/70 active:scale-95 transition inline-flex items-center gap-2"
              aria-label="Clear All Fields"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>
      </div>

      {/* PARENT BENTO CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CONTROLS & DATA ENTRY (5 COLS) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* INPUT METHOD SELECTION CARD */}
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-blue-500" />
                <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Data Sourcing</h2>
              </div>
              <div className="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-xl">
                <button
                  onClick={() => setGroupComparisonEnabled(!groupComparisonEnabled)}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-lg transition-all ${groupComparisonEnabled ? 'bg-blue-600 text-white shadow-sm' : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
                  aria-label="Toggle Comparative Group Comparison Mode"
                >
                  Group comparison
                </button>
              </div>
            </div>

            {/* TABS FOR INPUT CHANNELS */}
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5 mb-6">
              {[
                { id: 'raw', label: 'Raw List' },
                { id: 'table', label: 'Table' },
                { id: 'freq', label: 'Frequency' },
                { id: 'grouped', label: 'Grouped' },
                { id: 'weighted', label: 'Weighted' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInputTab(tab.id as any)}
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${activeInputTab === tab.id ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900 text-blue-600 dark:text-cyan-400' : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* DYNAMIC TAB CONSOLE */}
            <div className="space-y-4">
              
              {/* TAB 1: RAW LIST AREA */}
              {activeInputTab === 'raw' && (
                <div className="space-y-2">
                  <label htmlFor="raw-text-input" className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Dataset observations</label>
                  <textarea
                    id="raw-text-input"
                    rows={6}
                    placeholder="e.g. 12, 15, 18, 20, 25"
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    aria-label="Comma-separated raw dataset values"
                  />
                  <p className="text-[10px] text-neutral-400">Separated by commas, tabs, spaces, or one per line.</p>
                </div>
              )}

              {/* TAB 2: INTERACTIVE TABLE */}
              {activeInputTab === 'table' && (
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add observation value"
                      value={tableInputVal}
                      onChange={(e) => setTableInputVal(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (tableInputVal.trim()) {
                            setTableRows([...tableRows, tableInputVal]);
                            setTableInputVal('');
                          }
                        }
                      }}
                      className="flex-1 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (tableInputVal.trim()) {
                          setTableRows([...tableRows, tableInputVal]);
                          setTableInputVal('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Add Row
                    </button>
                  </div>

                  <div className="max-h-48 overflow-y-auto border border-neutral-150 dark:border-neutral-850 rounded-xl divide-y divide-neutral-100 dark:divide-neutral-850">
                    {tableRows.length === 0 ? (
                      <p className="p-4 text-xs text-center text-neutral-500">No data points in table.</p>
                    ) : (
                      tableRows.map((row, i) => (
                        <div key={i} className="flex items-center justify-between px-4 py-2 text-xs font-mono">
                          <span>Row {i + 1} :</span>
                          <span className="font-bold">{row}</span>
                          <button
                            onClick={() => setTableRows(tableRows.filter((_, idx) => idx !== i))}
                            className="p-1 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 rounded"
                            aria-label={`Delete observation value row ${i + 1}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: FREQUENCY TABLE */}
              {activeInputTab === 'freq' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <span>Value</span>
                    <span>Frequency</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {freqRows.map((row, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Value"
                          value={row.val}
                          onChange={(e) => {
                            const newRows = [...freqRows];
                            newRows[i].val = e.target.value;
                            setFreqRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                        <input
                          type="number"
                          placeholder="Frequency"
                          value={row.freq}
                          onChange={(e) => {
                            const newRows = [...freqRows];
                            newRows[i].freq = e.target.value;
                            setFreqRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setFreqRows([...freqRows, { val: '', freq: '' }])}
                    className="w-full py-2 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Row Pairs
                  </button>
                </div>
              )}

              {/* TAB 4: GROUPED DATA */}
              {activeInputTab === 'grouped' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    <span>Lower Boundary</span>
                    <span>Upper Boundary</span>
                    <span>Frequency</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {groupedRows.map((row, i) => (
                      <div key={i} className="grid grid-cols-3 gap-2">
                        <input
                          type="number"
                          placeholder="L"
                          value={row.lower}
                          onChange={(e) => {
                            const newRows = [...groupedRows];
                            newRows[i].lower = e.target.value;
                            setGroupedRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                        <input
                          type="number"
                          placeholder="U"
                          value={row.upper}
                          onChange={(e) => {
                            const newRows = [...groupedRows];
                            newRows[i].upper = e.target.value;
                            setGroupedRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                        <input
                          type="number"
                          placeholder="Freq"
                          value={row.freq}
                          onChange={(e) => {
                            const newRows = [...groupedRows];
                            newRows[i].freq = e.target.value;
                            setGroupedRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setGroupedRows([...groupedRows, { lower: '', upper: '', freq: '' }])}
                    className="w-full py-2 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Range Class
                  </button>
                </div>
              )}

              {/* TAB 5: WEIGHTED OBSERVATIONS */}
              {activeInputTab === 'weighted' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4 text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    <span>Observed Value</span>
                    <span>Weight</span>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                    {weightedRows.map((row, i) => (
                      <div key={i} className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          placeholder="Value"
                          value={row.val}
                          onChange={(e) => {
                            const newRows = [...weightedRows];
                            newRows[i].val = e.target.value;
                            setWeightedRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                        <input
                          type="number"
                          step="0.01"
                          placeholder="Weight"
                          value={row.weight}
                          onChange={(e) => {
                            const newRows = [...weightedRows];
                            newRows[i].weight = e.target.value;
                            setWeightedRows(newRows);
                          }}
                          className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 text-xs font-mono"
                        />
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setWeightedRows([...weightedRows, { val: '', weight: '' }])}
                    className="w-full py-2 bg-neutral-100 dark:bg-neutral-850 hover:bg-neutral-200 dark:hover:bg-neutral-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-4 h-4" /> Add Weighted Item
                  </button>
                </div>
              )}

              {/* OUTLIER CONTROLLER ACTION */}
              {activeDataset.length > 0 && (
                <div className="pt-4 border-t border-neutral-100 dark:border-neutral-850 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-600 dark:text-neutral-400 inline-flex items-center gap-1">
                    <Sliders className="w-3.5 h-3.5" /> Outliers
                  </span>
                  <div className="flex gap-1 bg-neutral-100 dark:bg-neutral-950 p-1 rounded-xl">
                    <button
                      onClick={() => setOutlierFilterMode('include')}
                      className={`px-3 py-1 rounded-lg transition ${outlierFilterMode === 'include' ? 'bg-white dark:bg-neutral-850 font-bold text-blue-600 dark:text-cyan-400' : 'text-neutral-500'}`}
                    >
                      Include
                    </button>
                    <button
                      onClick={() => setOutlierFilterMode('exclude')}
                      className={`px-3 py-1 rounded-lg transition ${outlierFilterMode === 'exclude' ? 'bg-white dark:bg-neutral-850 font-bold text-blue-600 dark:text-cyan-400' : 'text-neutral-500'}`}
                    >
                      Exclude
                    </button>
                  </div>
                </div>
              )}

              {/* DYNAMIC VALIDATION ERROR CONSOLE */}
              {validationErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200/40 rounded-2xl p-4 text-xs text-red-600 dark:text-red-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertCircle className="w-4 h-4" /> Validation errors
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5">
                    {validationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>

          {/* GROUP B DATA ENTRY IF COMPARISON MODE ENABLED */}
          {groupComparisonEnabled && (
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-2">Group B Sourcing</h3>
              <p className="text-xs text-neutral-500 mb-4">Enter secondary comparative dataset values</p>
              <textarea
                rows={4}
                placeholder="e.g. 14, 16, 17, 15, 24, 26"
                value={groupBRawText}
                onChange={(e) => setGroupBRawText(e.target.value)}
                className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition"
                aria-label="Comma-separated Group B comparative dataset values"
              />

              {groupBValidationErrors.length > 0 && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200/40 rounded-2xl p-4 text-xs text-red-600 dark:text-red-400 mt-2 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-4 h-4" /> Group B errors
                  </div>
                  <ul className="list-disc pl-4">
                    {groupBValidationErrors.map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* INFERENTIAL CONTROLS AND HYPOTHESIS TESTING BAR */}
          {activeDataset.length > 1 && (
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Hypothesis testing limits</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label htmlFor="hyp-mean-input" className="block text-neutral-400 font-bold mb-1 uppercase tracking-wider">Hypothesized Mean (μ0)</label>
                  <input
                    id="hyp-mean-input"
                    type="number"
                    placeholder="e.g. 18"
                    value={hypothesizedMean}
                    onChange={(e) => setHypothesizedMean(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="known-sd-input" className="block text-neutral-400 font-bold mb-1 uppercase tracking-wider">Known Population Std Dev (σ) [for Z Test]</label>
                  <input
                    id="known-sd-input"
                    type="number"
                    placeholder="e.g. 5"
                    value={knownPopStdDev}
                    onChange={(e) => setKnownPopStdDev(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 text-sm focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label htmlFor="alpha-select" className="block text-neutral-400 font-bold mb-1 uppercase tracking-wider">Alpha (α)</label>
                    <select
                      id="alpha-select"
                      value={testAlpha}
                      onChange={(e) => setTestAlpha(Number(e.target.value))}
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 focus:outline-none"
                    >
                      <option value="0.01">0.01 (99% conf)</option>
                      <option value="0.05">0.05 (95% conf)</option>
                      <option value="0.10">0.10 (90% conf)</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tail-select" className="block text-neutral-400 font-bold mb-1 uppercase tracking-wider">Alternate hypothesis (Tail)</label>
                    <select
                      id="tail-select"
                      value={testTail}
                      onChange={(e) => setTestTail(e.target.value as any)}
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 focus:outline-none"
                    >
                      <option value="two">Two-Tailed (≠)</option>
                      <option value="left">Left-Tailed (&lt;)</option>
                      <option value="right">Right-Tailed (&gt;)</option>
                    </select>
                  </div>
                </div>

                {groupComparisonEnabled && (
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-bold text-neutral-600 dark:text-neutral-400">Assume Equal Variances</span>
                    <input
                      type="checkbox"
                      checked={equalVarianceToggle}
                      onChange={(e) => setEqualVarianceToggle(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-600 border-neutral-300 focus:ring-blue-500"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: DETAILED STATISTICAL REPORTS & CHARTS (7 COLS) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* RESULTS BOX */}
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-8">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-850">
              <h2 className="text-base font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" /> Statistical Ledger
              </h2>
              {activeDataset.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleExportCSV}
                    className="p-2 text-neutral-500 hover:text-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl transition"
                    title="Export CSV"
                    aria-label="Export Data as CSV"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportXLS}
                    className="p-2 text-neutral-500 hover:text-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl transition"
                    title="Export Excel"
                    aria-label="Export Data as Excel"
                  >
                    <FileSpreadsheet className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportJSON}
                    className="p-2 text-neutral-500 hover:text-blue-500 hover:bg-neutral-50 dark:hover:bg-neutral-850 rounded-xl transition"
                    title="Export JSON"
                    aria-label="Export Data as JSON"
                  >
                    <Layers className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleExportPDFReport}
                    className="px-3 py-1.5 bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-cyan-400 hover:bg-blue-100 font-bold rounded-xl text-xs transition"
                    aria-label="Print or Download PDF Report"
                  >
                    PDF Report
                  </button>
                </div>
              )}
            </div>

            {activeDataset.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-950 rounded-full flex items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 text-neutral-400">
                  <Info className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-neutral-850 dark:text-neutral-150">Dataset is currently empty</h3>
                  <p className="text-xs text-neutral-500 max-w-sm mt-1">
                    Click the <strong className="text-blue-500">"Load Example"</strong> button above or select an input mode on the left to enter numerical statistics observations.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                
                {/* DESCRIPTIVE STATS GRID */}
                {descriptiveStats && (
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Descriptive Statistics</h3>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {[
                        { label: 'Sample Count (n)', value: descriptiveStats.count, note: 'Valid counts' },
                        { label: 'Sum', value: descriptiveStats.sum, note: 'Sum of values' },
                        { label: 'Mean (Average)', value: descriptiveStats.mean.toFixed(4), note: 'Center gravity' },
                        { label: 'Median (Q2)', value: descriptiveStats.median, note: 'Exact middle' },
                        { label: 'Modes', value: descriptiveStats.modes.join(', ') || 'No mode', note: 'Highest freq' },
                        { label: 'Minimum', value: descriptiveStats.min, note: 'Lower boundary' },
                        { label: 'Maximum', value: descriptiveStats.max, note: 'Upper boundary' },
                        { label: 'Range', value: descriptiveStats.range, note: 'Spread length' },
                        { label: 'Sample Variance', value: descriptiveStats.sampleVariance.toFixed(4), note: 'Spread dispersion' },
                        { label: 'Pop Variance', value: descriptiveStats.populationVariance.toFixed(4), note: 'Pop dispersion' },
                        { label: 'Sample Std Dev (s)', value: descriptiveStats.sampleStdDev.toFixed(4), note: 'Avg deviation' },
                        { label: 'Pop Std Dev (σ)', value: descriptiveStats.populationStdDev.toFixed(4), note: 'Pop deviation' },
                        { label: 'Geometric Mean', value: descriptiveStats.geometricMean ? descriptiveStats.geometricMean.toFixed(4) : 'N/A', note: 'Product root' },
                        { label: 'Harmonic Mean', value: descriptiveStats.harmonicMean ? descriptiveStats.harmonicMean.toFixed(4) : 'N/A', note: 'Reciprocal mean' },
                        { label: 'Trimmed Mean (10%)', value: descriptiveStats.trimmedMean.toFixed(4), note: 'Outlier proof' },
                        { label: 'Coef. of Variation', value: `${descriptiveStats.coefVariation.toFixed(2)}%`, note: 'Dispersion comparison' }
                      ].map((card, i) => (
                        <div key={i} className="bg-neutral-50 dark:bg-neutral-950 p-4 border border-neutral-100 dark:border-neutral-850 rounded-2xl relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/60 dark:bg-cyan-500/50 rounded-full" />
                          <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">{card.label}</div>
                          <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 mt-1 truncate">{card.value}</div>
                          <div className="text-[9px] text-neutral-400 mt-0.5">{card.note}</div>
                        </div>
                      ))}
                    </div>

                    {/* FIVE NUMBER SUMMARY AND SHAPE */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* QUANTILES PANEL */}
                      <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-150 dark:border-neutral-850 space-y-3">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Five Number Summary</h4>
                        <div className="grid grid-cols-5 gap-2 text-center text-[10px] font-bold text-neutral-500">
                          <div>
                            <div>Min</div>
                            <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{descriptiveStats.min}</div>
                          </div>
                          <div>
                            <div>Q1 (25%)</div>
                            <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{descriptiveStats.q1}</div>
                          </div>
                          <div>
                            <div>Med (50%)</div>
                            <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{descriptiveStats.median}</div>
                          </div>
                          <div>
                            <div>Q3 (75%)</div>
                            <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{descriptiveStats.q3}</div>
                          </div>
                          <div>
                            <div>Max</div>
                            <div className="text-xs font-extrabold text-neutral-800 dark:text-neutral-200 mt-1">{descriptiveStats.max}</div>
                          </div>
                        </div>
                        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs text-neutral-600 dark:text-neutral-400">
                          <span>Interquartile Range (IQR):</span>
                          <strong className="font-bold">{descriptiveStats.iqr}</strong>
                        </div>
                      </div>

                      {/* DISTRIBUTION SHAPE PANEL */}
                      <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-150 dark:border-neutral-850 space-y-3">
                        <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-50 uppercase tracking-wider">Distribution shape & normality</h4>
                        <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-400">
                          <div className="flex justify-between">
                            <span>Skewness:</span>
                            <span className="font-bold">{distributionStats?.skewness.toFixed(4)} ({distributionStats?.skewness === 0 ? 'Symmetric' : distributionStats?.skewness! > 0 ? 'Right Skewed' : 'Left Skewed'})</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Excess Kurtosis:</span>
                            <span className="font-bold">{distributionStats?.kurtosis.toFixed(4)} ({distributionStats?.kurtosis === 0 ? 'Mesokurtic' : distributionStats?.kurtosis! > 0 ? 'Leptokurtic' : 'Platykurtic'})</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Normality (JB Test):</span>
                            <span className={`font-bold ${distributionStats?.normalityJB.isNormal ? 'text-emerald-500' : 'text-amber-500'}`}>{distributionStats?.normalityJB.isNormal ? 'Normal Distribution' : 'Non-Normal Distribution'}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* CONFIDENCE INTERVALS */}
                {confidenceIntervals.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Confidence Intervals for Population Mean (μ)</h3>
                    <div className="max-h-48 overflow-x-auto border border-neutral-150 dark:border-neutral-850 rounded-2xl">
                      <table className="w-full text-left text-xs divide-y divide-neutral-200 dark:divide-neutral-800">
                        <thead className="bg-neutral-50 dark:bg-neutral-950 text-[10px] uppercase font-bold text-neutral-500">
                          <tr>
                            <th className="px-6 py-3">Confidence Level</th>
                            <th className="px-6 py-3">Margin of Error</th>
                            <th className="px-6 py-3">Lower Bound</th>
                            <th className="px-6 py-3">Upper Bound</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                          {confidenceIntervals.map((ci, i) => (
                            <tr key={i} className="hover:bg-neutral-50 dark:hover:bg-neutral-850 transition">
                              <td className="px-6 py-4 font-bold">{ci.confidenceLevel}%</td>
                              <td className="px-6 py-4">±{ci.marginOfError.toFixed(4)}</td>
                              <td className="px-6 py-4 font-mono">{ci.lowerBound.toFixed(4)}</td>
                              <td className="px-6 py-4 font-mono">{ci.upperBound.toFixed(4)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* HYPOTHESIS TESTS MODULE */}
                {activeHypothesisTests && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Hypothesis testing audit</h3>
                    <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-5 space-y-4">
                      
                      {/* Z-Test */}
                      {activeHypothesisTests.oneSampleZ ? (
                        <div className="space-y-2">
                          <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">One-Sample Z-Test</h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                            <div>Z-Score: <strong className="text-neutral-900 dark:text-neutral-50">{activeHypothesisTests.oneSampleZ.statistic.toFixed(4)}</strong></div>
                            <div>Critical Z: <strong className="text-neutral-900 dark:text-neutral-50">±{Math.abs(activeHypothesisTests.oneSampleZ.criticalValue).toFixed(3)}</strong></div>
                            <div>p-value: <strong className="text-neutral-900 dark:text-neutral-50">{activeHypothesisTests.oneSampleZ.pValue.toFixed(5)}</strong></div>
                          </div>
                          <p className="text-xs text-neutral-500 italic mt-1">{activeHypothesisTests.oneSampleZ.decision}</p>
                        </div>
                      ) : (
                        <div className="text-xs text-neutral-500 italic">
                          Provide known Population Std Dev (σ) on left control column to activate Z-Test analysis.
                        </div>
                      )}

                      {/* T-Test */}
                      <div className="pt-4 border-t border-neutral-150 dark:border-neutral-800 space-y-2">
                        <h4 className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider">One-Sample Student's T-Test</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                          <div>T-Score: <strong className="text-neutral-900 dark:text-neutral-50">{activeHypothesisTests.oneSampleT.statistic.toFixed(4)}</strong></div>
                          <div>Deg. Freedom (df): <strong className="text-neutral-900 dark:text-neutral-50">{activeHypothesisTests.oneSampleT.df}</strong></div>
                          <div>Critical T: <strong className="text-neutral-900 dark:text-neutral-50">±{Math.abs(activeHypothesisTests.oneSampleT.criticalValue).toFixed(3)}</strong></div>
                          <div>p-value: <strong className="text-neutral-900 dark:text-neutral-50">{activeHypothesisTests.oneSampleT.pValue.toFixed(5)}</strong></div>
                        </div>
                        <p className="text-xs text-neutral-500 italic mt-1">{activeHypothesisTests.oneSampleT.decision}</p>
                      </div>

                    </div>
                  </div>
                )}

                {/* GROUP COMPARISON MODULE */}
                {groupComparisonEnabled && groupComparisonResults && (
                  <div className="space-y-4">
                    <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Comparative group findings</h3>
                    <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-5 space-y-4 text-xs">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-xs font-bold text-neutral-400 uppercase mb-2">Group comparison metrics</h4>
                          <div className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
                            <div className="flex justify-between"><span>Mean Difference (A - B):</span><strong className="text-neutral-900 dark:text-neutral-50">{groupComparisonResults.meanDiff.toFixed(4)}</strong></div>
                            <div className="flex justify-between"><span>Variance F-Ratio:</span><strong className="text-neutral-900 dark:text-neutral-50">{groupComparisonResults.varRatio.toFixed(4)}</strong></div>
                            <div className="flex justify-between"><span>Effect Size (Cohen's d):</span><strong className="text-neutral-900 dark:text-neutral-50">{groupComparisonResults.effectSize.toFixed(4)}</strong></div>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-neutral-400 uppercase mb-2">Two-Sample T-Test Summary</h4>
                          <div className="space-y-1.5 text-neutral-600 dark:text-neutral-400">
                            <div className="flex justify-between"><span>T-statistic:</span><strong className="text-neutral-900 dark:text-neutral-50">{groupComparisonResults.tTest.tStatistic.toFixed(4)}</strong></div>
                            <div className="flex justify-between"><span>d.f.:</span><strong className="text-neutral-900 dark:text-neutral-50">{groupComparisonResults.tTest.df.toFixed(1)}</strong></div>
                            <div className="flex justify-between"><span>p-value:</span><strong className="text-neutral-900 dark:text-neutral-50">{groupComparisonResults.tTest.pValue.toFixed(5)}</strong></div>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-neutral-500 italic pt-2 border-t border-neutral-150 dark:border-neutral-800">{groupComparisonResults.tTest.decision}</p>
                    </div>
                  </div>
                )}

              </div>
            )}
          </div>

          {/* DYNAMIC REGRESSION LINE AND PEARSON CORRELATION (X-Y) */}
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm space-y-6">
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Correlation & regression modeling</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="reg-x-input" className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Independent Variables (X)</label>
                <textarea
                  id="reg-x-input"
                  rows={3}
                  placeholder="e.g. 10, 14, 16, 18, 22"
                  value={regressionXText}
                  onChange={(e) => setRegressionXText(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label="Independent variables X dataset"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="reg-y-input" className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Dependent Variables (Y)</label>
                <textarea
                  id="reg-y-input"
                  rows={3}
                  placeholder="e.g. 150, 185, 200, 225, 260"
                  value={regressionYText}
                  onChange={(e) => setRegressionYText(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 font-mono text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  aria-label="Dependent variables Y dataset"
                />
              </div>
            </div>

            {regressionResult ? (
              <div className="space-y-4">
                <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-2xl p-5 space-y-3 text-xs">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Pearson r</div>
                      <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 mt-1">{regressionResult.pearson.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Spearman ρ</div>
                      <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 mt-1">{regressionResult.spearman.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">R² Coefficient</div>
                      <div className="text-sm font-extrabold text-neutral-900 dark:text-neutral-50 mt-1">{regressionResult.r2.toFixed(4)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Regression Equation</div>
                      <div className="text-sm font-extrabold text-blue-600 dark:text-cyan-400 mt-1 font-mono">{regressionResult.equation}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100/40 rounded-2xl p-5 space-y-3">
                  <h4 className="text-xs font-bold text-neutral-850 dark:text-neutral-150 uppercase">What-If Regression Predictor Engine</h4>
                  <div className="flex gap-2 text-xs">
                    <input
                      type="number"
                      placeholder="Enter target X value"
                      value={predictionTargetX}
                      onChange={(e) => setPredictionTargetX(e.target.value)}
                      className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-2 flex-1 focus:outline-none"
                    />
                    <div className="bg-neutral-100 dark:bg-neutral-950 rounded-xl px-4 py-2 flex items-center gap-1">
                      <span>Predicted Y:</span>
                      <strong className="text-blue-600 dark:text-cyan-400 font-mono font-bold">{predictionYResult !== null ? predictionYResult.toFixed(4) : '—'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-neutral-500 bg-neutral-50 dark:bg-neutral-950 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 text-center">
                Correlation calculations activate when both X and Y inputs hold equal number of multiple numerical observations.
              </div>
            )}
          </div>

        </div>
      </div>

      {/* DETAILED CHARTS VISUALIZATIONS BAR */}
      {activeDataset.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" /> Interactive visualizations
            </h2>
            <p className="text-xs text-neutral-500">Premium fully-responsive charts can be downloaded as PNG</p>
          </div>
          
          <StatisticsVisualizer 
            data={activeDataset} 
            stats={descriptiveStats} 
            regression={regressionResult}
            groupComparison={{
              enabled: groupComparisonEnabled,
              dataA: datasetAfterOutlierTreatment,
              dataB: groupBDataset,
              statsA: groupAStats,
              statsB: groupBStats
            }}
          />
        </div>
      )}

      {/* COGNITIVE STEP BY STEP TUTORIAL MATHEMATICS PANEL */}
      {descriptiveStats && (
        <div className="bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-850 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" /> Step-by-Step Statistical Solver
              </h2>
              <p className="text-xs text-neutral-500">Select any metric to visualize the math substitution and derivation loops</p>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'mean', label: 'Arithmetic Mean' },
                { id: 'variance', label: 'Sample Variance' },
                { id: 'stddev', label: 'Standard Deviation' },
                { id: 'median', label: 'Median Calculation' },
                { id: 'zscore', label: 'Z-Score Conversion' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedExplainingStat(tab.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${selectedExplainingStat === tab.id ? 'bg-blue-600 border-blue-600 text-white shadow-md' : 'border-neutral-200 dark:border-neutral-850 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850'}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 text-xs leading-relaxed">
            <div className="md:col-span-4 space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Formula</span>
                <div className="font-mono text-sm text-blue-600 dark:text-cyan-400 font-bold py-2 overflow-x-auto">
                  {currentExplanationHTML.formula}
                </div>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 p-5 rounded-2xl space-y-2">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Substitution</span>
                <div className="font-mono text-sm text-neutral-800 dark:text-neutral-200 py-2 overflow-x-auto">
                  {currentExplanationHTML.substitution}
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 p-6 rounded-3xl space-y-4">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Calculated Derivation Loop</span>
                <ol className="list-decimal pl-5 space-y-3 text-neutral-750 dark:text-neutral-250">
                  {currentExplanationHTML.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <div className="pt-4 border-t border-neutral-150 dark:border-neutral-800">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Aesthetic Explanation</span>
                  <p className="text-neutral-600 dark:text-neutral-400 mt-1 font-semibold">{currentExplanationHTML.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PROBABILITY DISTRIBUTION QUICK CALCULATOR WIDGET */}
      <div className="bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm space-y-6">
        <div>
          <h2 className="text-base font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-blue-500" /> Probability Distributions Quick Solver
          </h2>
          <p className="text-xs text-neutral-500">Fast probability modeling with normal, binomial, Poisson, geometric, uniform, and exponential shapes</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="md:col-span-1 space-y-1">
            {[
              { id: 'normal', label: 'Normal' },
              { id: 'binomial', label: 'Binomial' },
              { id: 'poisson', label: 'Poisson' },
              { id: 'geometric', label: 'Geometric' },
              { id: 'hyper', label: 'Hypergeometric' },
              { id: 'uniform', label: 'Uniform' },
              { id: 'exponential', label: 'Exponential' }
            ].map((dist) => (
              <button
                key={dist.id}
                onClick={() => setActiveDist(dist.id as any)}
                className={`w-full text-left px-4 py-2.5 text-xs font-bold rounded-xl transition ${activeDist === dist.id ? 'bg-blue-600 text-white shadow-md' : 'text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850'}`}
              >
                {dist.label} Distribution
              </button>
            ))}
          </div>

          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6 bg-neutral-50 dark:bg-neutral-950 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-850 text-xs">
            {/* Dynamic input fields based on distribution */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-neutral-400 uppercase tracking-widest text-[10px]">Distribution parameters</h3>
              
              {activeDist === 'normal' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Mean (μ)</label>
                    <input type="number" placeholder="e.g. 100" value={distParams.normalMean} onChange={(e) => setDistParams({ ...distParams, normalMean: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Std Dev (σ)</label>
                    <input type="number" placeholder="e.g. 15" value={distParams.normalSd} onChange={(e) => setDistParams({ ...distParams, normalSd: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">X Bound</label>
                    <input type="number" placeholder="e.g. 115" value={distParams.normalX} onChange={(e) => setDistParams({ ...distParams, normalX: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeDist === 'binomial' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Trials (n)</label>
                    <input type="number" placeholder="e.g. 10" value={distParams.binomN} onChange={(e) => setDistParams({ ...distParams, binomN: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Success Probability (p)</label>
                    <input type="number" step="0.05" placeholder="e.g. 0.5" value={distParams.binomP} onChange={(e) => setDistParams({ ...distParams, binomP: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Successes (k)</label>
                    <input type="number" placeholder="e.g. 5" value={distParams.binomK} onChange={(e) => setDistParams({ ...distParams, binomK: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeDist === 'poisson' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Average Rate (λ)</label>
                    <input type="number" placeholder="e.g. 4" value={distParams.poissonLambda} onChange={(e) => setDistParams({ ...distParams, poissonLambda: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Events (k)</label>
                    <input type="number" placeholder="e.g. 3" value={distParams.poissonK} onChange={(e) => setDistParams({ ...distParams, poissonK: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeDist === 'geometric' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Success Probability (p)</label>
                    <input type="number" step="0.05" placeholder="e.g. 0.2" value={distParams.geomP} onChange={(e) => setDistParams({ ...distParams, geomP: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Trials until Success (k)</label>
                    <input type="number" placeholder="e.g. 4" value={distParams.geomK} onChange={(e) => setDistParams({ ...distParams, geomK: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeDist === 'hyper' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-500 font-bold mb-1">Pop Size (N)</label>
                      <input type="number" placeholder="e.g. 50" value={distParams.hyperN} onChange={(e) => setDistParams({ ...distParams, hyperN: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-neutral-500 font-bold mb-1">Pop Success (K)</label>
                      <input type="number" placeholder="e.g. 10" value={distParams.hyperK} onChange={(e) => setDistParams({ ...distParams, hyperK: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-neutral-500 font-bold mb-1">Sample (n)</label>
                      <input type="number" placeholder="e.g. 5" value={distParams.hyperSampleN} onChange={(e) => setDistParams({ ...distParams, hyperSampleN: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-neutral-500 font-bold mb-1">Sample Success (k)</label>
                      <input type="number" placeholder="e.g. 2" value={distParams.hyperSuccessK} onChange={(e) => setDistParams({ ...distParams, hyperSuccessK: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {activeDist === 'uniform' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Min (a)</label>
                    <input type="number" placeholder="e.g. 0" value={distParams.uniformMin} onChange={(e) => setDistParams({ ...distParams, uniformMin: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Max (b)</label>
                    <input type="number" placeholder="e.g. 10" value={distParams.uniformMax} onChange={(e) => setDistParams({ ...distParams, uniformMax: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Value (x)</label>
                    <input type="number" placeholder="e.g. 5" value={distParams.uniformX} onChange={(e) => setDistParams({ ...distParams, uniformX: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                </div>
              )}

              {activeDist === 'exponential' && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Rate (λ)</label>
                    <input type="number" placeholder="e.g. 0.5" value={distParams.expLambda} onChange={(e) => setDistParams({ ...distParams, expLambda: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-neutral-500 font-bold mb-1">Value (x)</label>
                    <input type="number" placeholder="e.g. 2" value={distParams.expX} onChange={(e) => setDistParams({ ...distParams, expX: e.target.value })} className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl px-3 py-1.5 focus:outline-none" />
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col justify-center space-y-4">
              <h3 className="font-extrabold text-neutral-400 uppercase tracking-widest text-[10px]">Calculated outcomes</h3>
              {calculatedProbability ? (
                <div className="space-y-4">
                  {calculatedProbability.pmf !== undefined && (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 flex justify-between items-center">
                      <span className="font-bold">Probability P(X = k):</span>
                      <strong className="text-sm font-mono text-blue-600 dark:text-cyan-400">{calculatedProbability.pmf.toFixed(6)}</strong>
                    </div>
                  )}
                  {calculatedProbability.pdf !== undefined && (
                    <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 flex justify-between items-center">
                      <span className="font-bold">Density f(x):</span>
                      <strong className="text-sm font-mono text-blue-600 dark:text-cyan-400">{calculatedProbability.pdf.toFixed(6)}</strong>
                    </div>
                  )}
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 flex justify-between items-center">
                    <span className="font-bold">Cumulative P(X &le; x):</span>
                    <strong className="text-sm font-mono text-blue-600 dark:text-cyan-400">{calculatedProbability.cdf.toFixed(6)}</strong>
                  </div>
                  <div className="bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 rounded-2xl p-4 flex justify-between items-center">
                    <span className="font-bold">Survival P(X &gt; x):</span>
                    <strong className="text-sm font-mono text-blue-600 dark:text-cyan-400">{calculatedProbability.greater.toFixed(6)}</strong>
                  </div>
                </div>
              ) : (
                <p className="text-neutral-500 italic">Enter parameters to evaluate probabilities instantly.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* SEO COMPREHENSIVE EDUCATIONAL MATERIAL */}
      <div className="bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 shadow-sm space-y-12">
        
        {/* EDUCATIONAL TOPICS GRID */}
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-blue-500" /> Statistical Knowledge Hub
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
            
            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 dark:text-neutral-50 text-sm">What is Statistics?</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Statistics is the mathematical branch that deals with the collection, analysis, interpretation, presentation, and organization of data. It plays an active role in scientific progress, enabling researchers to identify patterns, evaluate hypotheses, and draw conclusions from observed sample trials.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 dark:text-neutral-50 text-sm">Descriptive vs Inferential</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <strong>Descriptive Statistics</strong> summarizes, characterizes, and maps out the sample dataset features (e.g. mean, median, standard deviation). <strong>Inferential Statistics</strong> uses probability properties to make predictions, generalize, or test hypotheses about a wider parent population based on sample findings.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 dark:text-neutral-50 text-sm">Mean vs Median vs Mode</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                The <strong>Mean</strong> is the mathematical average, susceptible to skewness. The <strong>Median</strong> is the exact central rank point of sorted values, resistant to skew. The <strong>Mode</strong> is the most frequently occurring value in the sample cluster.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 dark:text-neutral-50 text-sm">Variance & Standard Deviation</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Variance represents the average squared distance from the mean, whereas standard deviation is its positive square root. A small standard deviation suggests observations are tightly bound to the mean, while a large standard deviation indicates high dispersion.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 dark:text-neutral-50 text-sm">Linear Regression & Correlation</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                Correlation measures the linear relationship strength and direction (Pearson r) between two variables. Regression creates a predictive mathematical model line <span className="font-mono">y = mx + c</span>, calculating slope and intercepts to forecast future occurrences.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-bold text-neutral-950 dark:text-neutral-50 text-sm">Confidence Intervals</h3>
              <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                A confidence interval calculates a range of values bounded by a margin of error within which the true population parameter is expected to lie. Higher confidence levels require wider interval spreads to capture potential sample errors.
              </p>
            </div>

          </div>
        </div>

        {/* WORKED EXAMPLES */}
        <div className="border-t border-neutral-100 dark:border-neutral-850 pt-8 space-y-6 text-xs">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Worked Statistical Example</h3>
          <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-6 border border-neutral-150 dark:border-neutral-850 space-y-3 leading-relaxed">
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Problem Statement:</h4>
            <p>Analyze a small sample dataset representing high-school exam test performance: <strong>[12, 15, 18, 20, 25]</strong>.</p>
            
            <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Step 1: Count and Sum</h4>
            <p>Total sample elements (n) = 5. Sum of values = 12 + 15 + 18 + 20 + 25 = 90.</p>

            <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Step 2: Mean and Median</h4>
            <p>Mean (Average) = 90 / 5 = 18. Since there are 5 elements, the median is the center sorted value (3rd item) = 18.</p>

            <h4 className="font-bold text-neutral-800 dark:text-neutral-200">Step 3: Sample Variance</h4>
            <p>Sum of squared deviations: (12-18)² + (15-18)² + (18-18)² + (20-18)² + (25-18)² = (-6)² + (-3)² + 0² + 2² + 7² = 36 + 9 + 0 + 4 + 49 = 98.</p>
            <p>Sample Variance (s²) = 98 / (5 - 1) = 24.5. Standard Deviation = √24.5 = 4.95.</p>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div className="border-t border-t-neutral-100 dark:border-t-neutral-850 pt-8 space-y-4 text-xs">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Frequently Asked Questions (FAQ)</h3>
          <div className="space-y-4">
            {[
              { q: 'What is the difference between sample variance and population variance?', a: 'Sample variance uses Bessel\'s correction (n - 1) in the denominator to account for the bias of estimating a population parameter from a small subset. Population variance uses (n) because it encompasses the entire universe of values.' },
              { q: 'What qualifies as an outlier?', a: 'Traditionally, outliers are flagged if they lie beyond 1.5 times the Interquartile Range (IQR) from the lower and upper quartiles, or if their standard normal Z-score has an absolute value greater than 3.' },
              { q: 'What is the Jarque-Bera (JB) normality test?', a: 'The JB test is a goodness-of-fit test that determines whether sample data matches skewness and kurtosis characteristics of a standard normal distribution (which has skewness 0 and excess kurtosis 0).' }
            ].map((faq, i) => (
              <div key={i} className="space-y-1">
                <h4 className="font-bold text-neutral-950 dark:text-neutral-50">{faq.q}</h4>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* GLOSSARY */}
        <div className="border-t border-neutral-100 dark:border-neutral-850 pt-8 space-y-4 text-xs">
          <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm">Statistical Glossary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { term: 'Hypothesis Testing', def: 'A statistical procedure to decide whether to reject or fail to reject a null assertion based on sample evidence.' },
              { term: 'P-Value', def: 'The probability, assuming the null hypothesis is true, of obtaining a test statistic at least as extreme as the one observed.' },
              { term: 'Coefficient of Variation (CV)', def: 'The ratio of standard deviation to mean, indicating relative dispersion regardless of scale.' },
              { term: 'Median Absolute Deviation (MAD)', def: 'A robust measure of statistical dispersion, calculated as the median of absolute deviations from the median.' }
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <span className="font-bold text-neutral-950 dark:text-neutral-50">{item.term}</span>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{item.def}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RELATED CALCULATORS SECTION */}
        <div className="border-t border-neutral-100 dark:border-neutral-850 pt-8 text-xs flex flex-wrap items-center justify-between gap-4">
          <span className="font-bold text-neutral-500 uppercase tracking-widest">Related Premium Tools</span>
          <div className="flex flex-wrap gap-2">
            {[
              { name: 'Probability Calculator', slug: 'probability-calculator' },
              { name: 'Z-Score Calculator', slug: 'z-score-calculator' },
              { name: 'Percentage Calculator', slug: 'percentage-calculator' },
              { name: 'Graphing Calculator', slug: 'graphing-calculator' },
              { name: 'Scientific Calculator', slug: 'scientific-calculator' }
            ].map((calc, i) => (
              <a
                key={i}
                href={`#/${calc.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`calculator:${calc.slug}`);
                }}
                className="px-3.5 py-1.5 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-850 font-bold rounded-xl border border-neutral-150 dark:border-neutral-850 text-neutral-600 dark:text-neutral-300 transition"
              >
                {calc.name}
              </a>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
