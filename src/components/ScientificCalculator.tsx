import React, { useState, useEffect, useRef } from 'react';
import * as math from 'mathjs';
import { 
  Plus, Minus, Divide, Hash, Compass, BookOpen, Layers,
  List, History, Star, Bookmark, Clipboard, Check, HelpCircle, 
  Settings, Undo2, Redo2, RefreshCw, Trash2, ShieldAlert, Zap,
  Play, Volume2, ArrowRightLeft, Cpu, Binary, Search, Download, Sparkles, Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Import modular parts
import { SCIENTIFIC_CONSTANTS } from './scientific/constantsData';
import { UNIT_CATEGORIES, UNITS_DATA, convertUnit, UnitCategory } from './scientific/unitConverterData';
import { GraphingCanvas } from './scientific/GraphingCanvas';
import { EducationalContent } from './scientific/EducationalContent';

interface ScientificCalculatorProps {
  onNavigate: (view: string) => void;
}

export default function ScientificCalculator({ onNavigate }: ScientificCalculatorProps) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'scientific' | 'matrices' | 'vectors_complex' | 'stats_prob' | 'number_theory' | 'converter' | 'graphing' | 'steps'>('scientific');

  // Display and parser state
  const [expression, setExpression] = useState('');
  const [prevAns, setPrevAns] = useState('0');
  const [liveResult, setLiveResult] = useState('0');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [angleMode, setAngleMode] = useState<'deg' | 'rad' | 'grad'>('deg');
  const [shiftMode, setShiftMode] = useState(false);

  // Undo / Redo stacks
  const [undoStack, setUndoStack] = useState<string[]>([]);
  const [redoStack, setRedoStack] = useState<string[]>([]);

  // Clipboard success state
  const [copied, setCopied] = useState(false);
  const [copiedLaTeX, setCopiedLaTeX] = useState(false);

  // Variable Named Memory Registers
  const [variables, setVariables] = useState<Record<string, number>>({
    A: 0, B: 0, C: 0, X: 0, Y: 0, Z: 0, M: 0
  });
  const [memoryHistory, setMemoryHistory] = useState<{ name: string; value: number; timestamp: string }[]>([]);

  // Browser Session History
  const [calcHistory, setCalcHistory] = useState<{
    id: string;
    expr: string;
    result: string;
    pinned: boolean;
    favorite: boolean;
    timestamp: string;
  }[]>([]);
  const [historySearch, setHistorySearch] = useState('');

  // --- MATRICES STATE ---
  const [matrixSize, setMatrixSize] = useState<2 | 3 | 4>(3);
  const [matrixA, setMatrixA] = useState<number[][]>([
    [1, 2, 3, 0],
    [0, 1, 4, 0],
    [5, 6, 0, 0],
    [0, 0, 0, 1]
  ]);
  const [matrixB, setMatrixB] = useState<number[][]>([
    [2, 0, -1, 0],
    [1, 3, 4, 0],
    [0, 1, 2, 0],
    [0, 0, 0, 1]
  ]);
  const [matrixResult, setMatrixResult] = useState<number[][] | null>(null);
  const [matrixScalar, setMatrixScalar] = useState<string>('2');
  const [matrixAnalysis, setMatrixAnalysis] = useState<{
    detA?: number;
    detB?: number;
    detRes?: number;
    rankA?: number;
    invA?: number[][] | string;
    eigenvaluesA?: any;
    isSingularA?: boolean;
  }>({});

  // --- VECTORS & COMPLEX STATE ---
  const [vectorU, setVectorU] = useState({ x: '3', y: '-4', z: '0' });
  const [vectorV, setVectorV] = useState({ x: '1', y: '2', z: '5' });
  const [vectorResult, setVectorResult] = useState<any>({});
  const [complexReal, setComplexReal] = useState('3');
  const [complexImag, setComplexImag] = useState('4');
  const [complexResult, setComplexResult] = useState<any>({});

  // --- NUMBER THEORY & FRACTIONS ---
  const [numTheoryVal, setNumTheoryVal] = useState('120');
  const [numTheoryVal2, setNumTheoryVal2] = useState('45');
  const [numTheoryResult, setNumTheoryResult] = useState<any>({});
  const [fractionWhole, setFractionWhole] = useState('');
  const [fractionNum, setFractionNum] = useState('3');
  const [fractionDen, setFractionDen] = useState('4');
  const [fractionWhole2, setFractionWhole2] = useState('');
  const [fractionNum2, setFractionNum2] = useState('1');
  const [fractionDen2, setFractionDen2] = useState('2');
  const [fractionOp, setFractionOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [fractionResult, setFractionResult] = useState<any>({});

  // --- STATISTICS & PROBABILITY ---
  const [statsData, setStatsData] = useState('12, 15, 14, 18, 22, 20, 14, 16, 25');
  const [statsResult, setStatsResult] = useState<any>({});
  const [probMode, setProbMode] = useState<'binomial' | 'poisson' | 'normal' | 'simulation'>('simulation');
  const [probBinomial, setProbBinomial] = useState({ n: '10', p: '0.5', k: '5' });
  const [probPoisson, setProbPoisson] = useState({ lambda: '3', k: '2' });
  const [probNormal, setProbNormal] = useState({ mean: '0', sd: '1', x: '1' });
  const [probResult, setProbResult] = useState<string>('');
  
  // Simulation tallies
  const [coinFlips, setCoinFlips] = useState({ heads: 0, tails: 0, total: 0 });
  const [diceRolls, setDiceRolls] = useState<Record<number, number>>({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 });

  // --- CONSTANTS & CONVERSION ---
  const [constantSearch, setConstantSearch] = useState('');
  const [selectedConstantCategory, setSelectedConstantCategory] = useState<string>('All');
  
  const [convCategory, setConvCategory] = useState<UnitCategory>('Length');
  const [convFromUnit, setConvFromUnit] = useState('m');
  const [convToUnit, setConvToUnit] = useState('km');
  const [convFromValue, setConvFromValue] = useState('1');
  const [convToValue, setConvToValue] = useState('0.001');

  // --- PROGRAMMER MODE ENHANCEMENTS ---
  const [progMode, setProgMode] = useState<'bin' | 'oct' | 'dec' | 'hex'>('dec');
  const [progValue, setProgValue] = useState('42');
  const [progResult, setProgResult] = useState<any>({});

  // --- SMART INSIGHTS STATE ---
  const [smartInsights, setSmartInsights] = useState<string[]>([]);

  // --- STEP-BY-STEP SOLVER STATE ---
  const [stepOutput, setStepOutput] = useState<{
    steps: { name: string; formula: string; explanation: string }[];
    final: string;
  } | null>(null);

  // --- REAL-TIME CALCULATION LISTENER ---
  useEffect(() => {
    if (!expression.trim()) {
      setLiveResult('0');
      setIsValid(true);
      setErrorMessage('');
      setSmartInsights([]);
      return;
    }

    try {
      // Configure mathjs to handle angle modes
      let mathExpr = expression;

      // Replace common displays into parsable syntax
      mathExpr = mathExpr.replace(/π/g, 'pi');
      mathExpr = mathExpr.replace(/e_charge/g, '1.602176634e-19');

      // Create configuration scope for Trig calculations in Deg/Rad/Grad
      const scope: Record<string, any> = { ...variables };

      // Build trigonometric function wrappers based on selected angle mode
      let evalExpr = mathExpr;
      if (angleMode === 'deg') {
        // deg conversion wrappers
        evalExpr = evalExpr.replace(/sin\(/g, 'sin(deg * ');
        evalExpr = evalExpr.replace(/cos\(/g, 'cos(deg * ');
        evalExpr = evalExpr.replace(/tan\(/g, 'tan(deg * ');
        evalExpr = evalExpr.replace(/asin\(/g, 'asin('); // asin returns radians by default, can be custom mapped
      } else if (angleMode === 'grad') {
        evalExpr = evalExpr.replace(/sin\(/g, 'sin(grad * ');
        evalExpr = evalExpr.replace(/cos\(/g, 'cos(grad * ');
        evalExpr = evalExpr.replace(/tan\(/g, 'tan(grad * ');
      }

      // Evaluate
      const res = math.evaluate(evalExpr, scope);
      let formattedResult = '';

      if (typeof res === 'number') {
        formattedResult = math.format(res, { precision: 14 });
      } else if (res && res.isComplex) {
        formattedResult = `${res.re >= 0 ? '' : '-'}${Math.abs(res.re).toFixed(4)} ${res.im >= 0 ? '+' : '-'} ${Math.abs(res.im).toFixed(4)}i`;
      } else if (res && typeof res.toString === 'function') {
        formattedResult = res.toString();
      } else {
        formattedResult = String(res);
      }

      setLiveResult(formattedResult);
      setIsValid(true);
      setErrorMessage('');

      // Smart Insights Trigger Logic (Rule-based)
      const insights: string[] = [];
      if (expression.includes('/0')) {
        insights.push('⚠️ Division by zero detected. Result will evaluate to Infinity or Undefined.');
      }
      if (expression.includes('!')) {
        const factMatch = expression.match(/(\d+)\s*!/);
        if (factMatch && parseInt(factMatch[1]) > 170) {
          insights.push('⚠️ Large factorial may overflow standard 64-bit float precision.');
        }
      }
      if (typeof res === 'number' && Number.isInteger(res) && res > 1000000) {
        insights.push('💡 This result can be expressed in Scientific Notation: ' + res.toExponential(4));
      }
      // Check fraction simplification possibility
      if (expression.match(/\d+\/\d+/)) {
        const fracMatch = expression.match(/(\d+)\/(\d+)/);
        if (fracMatch) {
          const num = parseInt(fracMatch[1]);
          const den = parseInt(fracMatch[2]);
          const gcd = math.gcd(num, den);
          if (gcd > 1) {
            insights.push(`💡 Fraction ${num}/${den} can be simplified to ${num/gcd}/${den/gcd}.`);
          }
        }
      }

      setSmartInsights(insights);

    } catch (err: any) {
      setIsValid(false);
      setErrorMessage(err.message || 'Syntax Error');
    }
  }, [expression, angleMode, variables]);

  // Real-time Unit conversion observer
  useEffect(() => {
    try {
      const val = parseFloat(convFromValue);
      if (!isNaN(val)) {
        const out = convertUnit(val, convFromUnit, convToUnit, convCategory);
        setConvToValue(out.toFixed(6).replace(/\.?0+$/, ''));
      } else {
        setConvToValue('0');
      }
    } catch (_) {
      setConvToValue('0');
    }
  }, [convCategory, convFromUnit, convToUnit, convFromValue]);

  // Load first option of the category whenever category changes
  useEffect(() => {
    const list = UNITS_DATA[convCategory];
    if (list && list.length >= 2) {
      setConvFromUnit(list[0].key);
      setConvToUnit(list[1].key);
    }
  }, [convCategory]);

  // --- MATRICES LOGIC ---
  const handleMatrixSolve = (operation: 'add' | 'subtract' | 'multiply' | 'transposeA' | 'inverseA' | 'detA' | 'scalarA') => {
    try {
      // Extract active matrix blocks matching selected size
      const A = matrixA.slice(0, matrixSize).map(r => r.slice(0, matrixSize));
      const B = matrixB.slice(0, matrixSize).map(r => r.slice(0, matrixSize));

      let res: any = null;
      let analysis: typeof matrixAnalysis = {};

      if (operation === 'add') {
        res = math.add(A, B);
      } else if (operation === 'subtract') {
        res = math.subtract(A, B);
      } else if (operation === 'multiply') {
        res = math.multiply(A, B);
      } else if (operation === 'transposeA') {
        res = math.transpose(A);
      } else if (operation === 'inverseA') {
        const d = math.det(A);
        if (d === 0) {
          analysis.isSingularA = true;
          res = 'Matrix is Singular (det = 0). Cannot calculate inverse.';
        } else {
          res = math.inv(A);
        }
      } else if (operation === 'detA') {
        const d = math.det(A);
        analysis.detA = d;
      } else if (operation === 'scalarA') {
        const s = parseFloat(matrixScalar);
        if (!isNaN(s)) {
          res = math.multiply(A, s);
        }
      }

      if (res && Array.isArray(res)) {
        setMatrixResult(res);
      } else if (typeof res === 'string') {
        setMatrixAnalysis({ ...analysis, invA: res });
      }

      // Compute general insights
      try {
        analysis.detA = math.det(A);
        analysis.detB = math.det(B);
        analysis.isSingularA = analysis.detA === 0;
        
        // Eigenvalues (using math.js if square and supported, otherwise custom fallback)
        if (matrixSize === 2) {
          // Analytical 2x2 eigenvalue formula: tr(A) +- sqrt(tr(A)^2 - 4 det(A)) / 2
          const tr = A[0][0] + A[1][1];
          const det = A[0][0]*A[1][1] - A[0][1]*A[1][0];
          const desc = tr*tr - 4*det;
          if (desc >= 0) {
            analysis.eigenvaluesA = [
              ((tr + Math.sqrt(desc)) / 2).toFixed(4),
              ((tr - Math.sqrt(desc)) / 2).toFixed(4)
            ];
          } else {
            analysis.eigenvaluesA = [
              `${(tr/2).toFixed(2)} + ${(Math.sqrt(-desc)/2).toFixed(2)}i`,
              `${(tr/2).toFixed(2)} - ${(Math.sqrt(-desc)/2).toFixed(2)}i`
            ];
          }
        }
      } catch (_) {}

      setMatrixAnalysis(prev => ({ ...prev, ...analysis }));

    } catch (err: any) {
      alert('Matrix Error: ' + err.message);
    }
  };

  // --- VECTORS & COMPLEX LOGIC ---
  const computeVectorOps = () => {
    try {
      const u = [parseFloat(vectorU.x) || 0, parseFloat(vectorU.y) || 0, parseFloat(vectorU.z) || 0];
      const v = [parseFloat(vectorV.x) || 0, parseFloat(vectorV.y) || 0, parseFloat(vectorV.z) || 0];

      const magU = math.norm(u) as number;
      const magV = math.norm(v) as number;
      const dot = math.dot(u, v);
      const cross = math.cross(u, v) as number[];
      
      const normU = magU > 0 ? math.divide(u, magU) as number[] : [0,0,0];
      const normV = magV > 0 ? math.divide(v, magV) as number[] : [0,0,0];

      // Angle between vectors
      let angle = 0;
      if (magU > 0 && magV > 0) {
        angle = Math.acos(dot / (magU * magV)) * (180 / Math.PI); // degrees
      }

      // Projection of U onto V
      let projUonV = [0,0,0];
      if (magV > 0) {
        const factor = dot / (magV * magV);
        projUonV = math.multiply(v, factor) as number[];
      }

      setVectorResult({
        magU: magU.toFixed(4),
        magV: magV.toFixed(4),
        dot: dot.toFixed(4),
        cross: `[${cross.map(x => x.toFixed(2)).join(', ')}]`,
        normU: `[${normU.map(x => x.toFixed(2)).join(', ')}]`,
        normV: `[${normV.map(x => x.toFixed(2)).join(', ')}]`,
        angle: angle.toFixed(2) + '°',
        proj: `[${projUonV.map(x => x.toFixed(2)).join(', ')}]`
      });
    } catch (_) {}
  };

  const computeComplexOps = () => {
    try {
      const r = parseFloat(complexReal) || 0;
      const im = parseFloat(complexImag) || 0;
      const c = math.complex(r, im);

      const magnitude = math.abs(c);
      const argument = math.arg(c) * (180 / Math.PI); // Angle in degrees

      setComplexResult({
        magnitude: magnitude.toFixed(4),
        argDeg: argument.toFixed(2) + '°',
        argRad: math.arg(c).toFixed(4) + ' rad',
        polar: `${magnitude.toFixed(3)} ∠ ${argument.toFixed(1)}°`,
        euler: `${magnitude.toFixed(3)} · e^(${math.arg(c).toFixed(3)}i)`
      });
    } catch (_) {}
  };

  useEffect(() => {
    computeVectorOps();
  }, [vectorU, vectorV]);

  useEffect(() => {
    computeComplexOps();
  }, [complexReal, complexImag]);


  // --- NUMBER THEORY & FRACTIONS LOGIC ---
  const handleSolveNumTheory = () => {
    try {
      const a = Math.abs(parseInt(numTheoryVal)) || 1;
      const b = Math.abs(parseInt(numTheoryVal2)) || 1;

      const isPrime = math.isPrime(a);
      const gcd = math.gcd(a, b);
      const lcm = math.lcm(a, b);

      // Divisors
      const divisors: number[] = [];
      for (let i = 1; i <= Math.sqrt(a); i++) {
        if (a % i === 0) {
          divisors.push(i);
          if (i !== a / i) divisors.push(a / i);
        }
      }
      divisors.sort((x, y) => x - y);

      // Simple prime factorization
      let temp = a;
      const factors: number[] = [];
      for (let i = 2; i <= temp; i++) {
        while (temp % i === 0) {
          factors.push(i);
          temp /= i;
        }
      }

      setNumTheoryResult({
        isPrime: isPrime ? 'Yes, Prime' : 'No, Composite',
        gcd,
        lcm,
        divisors: divisors.join(', '),
        factorization: factors.join(' × ') || '1'
      });

    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleSolveFraction = () => {
    try {
      const w1 = parseInt(fractionWhole) || 0;
      const n1 = parseInt(fractionNum) || 0;
      const d1 = parseInt(fractionDen) || 1;

      const w2 = parseInt(fractionWhole2) || 0;
      const n2 = parseInt(fractionNum2) || 0;
      const d2 = parseInt(fractionDen2) || 1;

      // Convert mixed to improper
      const impNum1 = w1 * d1 + n1;
      const impNum2 = w2 * d2 + n2;

      const f1 = math.fraction(impNum1, d1);
      const f2 = math.fraction(impNum2, d2);

      let res: any;
      if (fractionOp === '+') res = math.add(f1, f2);
      else if (fractionOp === '-') res = math.subtract(f1, f2);
      else if (fractionOp === '*') res = math.multiply(f1, f2);
      else if (fractionOp === '/') res = math.divide(f1, f2);

      // Improper Fraction representation
      const resNum = res.s * res.n;
      const resDen = res.d;

      // Simplify and get Mixed Fraction
      const gcd = math.gcd(Math.abs(resNum), resDen);
      const simplifiedNum = resNum / gcd;
      const simplifiedDen = resDen / gcd;

      const whole = Math.floor(Math.abs(simplifiedNum) / simplifiedDen);
      const remNum = Math.abs(simplifiedNum) % simplifiedDen;
      const sign = simplifiedNum < 0 ? '-' : '';

      setFractionResult({
        improper: `${simplifiedNum}/${simplifiedDen}`,
        mixed: remNum === 0 ? `${sign}${whole}` : `${sign}${whole > 0 ? whole + ' ' : ''}${remNum}/${simplifiedDen}`,
        decimal: (simplifiedNum / simplifiedDen).toFixed(4).replace(/\.?0+$/, '')
      });

    } catch (err: any) {
      alert('Fraction Error: ' + err.message);
    }
  };

  // --- STATISTICS LOGIC ---
  const handleSolveStats = () => {
    try {
      const arr = statsData.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
      if (arr.length === 0) return;

      arr.sort((x, y) => x - y);

      const mean = math.mean(arr);
      const median = math.median(arr);
      const variancePop = math.variance(arr, 'uncorrected');
      const varianceSample = math.variance(arr, 'biased'); // sample variance standard in maths
      const stdPop = math.std(arr, 'uncorrected');
      const stdSample = math.std(arr, 'biased');

      // Mode
      const counts: Record<number, number> = {};
      let maxCount = 0;
      let mode: number[] = [];
      arr.forEach(val => {
        counts[val] = (counts[val] || 0) + 1;
        if (counts[val] > maxCount) {
          maxCount = counts[val];
        }
      });
      if (maxCount > 1) {
        Object.keys(counts).forEach(k => {
          if (counts[parseFloat(k)] === maxCount) {
            mode.push(parseFloat(k));
          }
        });
      }

      // Quartiles
      const q1 = math.quantileSeq(arr, 0.25) as number;
      const q3 = math.quantileSeq(arr, 0.75) as number;

      setStatsResult({
        count: arr.length,
        min: arr[0],
        max: arr[arr.length - 1],
        mean: Number(mean).toFixed(4).replace(/\.?0+$/, ''),
        median: Number(median).toFixed(4).replace(/\.?0+$/, ''),
        mode: mode.length > 0 ? mode.join(', ') : 'None',
        variancePop: Number(variancePop).toFixed(4).replace(/\.?0+$/, ''),
        varianceSample: Number(varianceSample).toFixed(4).replace(/\.?0+$/, ''),
        stdPop: Number(stdPop).toFixed(4).replace(/\.?0+$/, ''),
        stdSample: Number(stdSample).toFixed(4).replace(/\.?0+$/, ''),
        q1: Number(q1).toFixed(2),
        q3: Number(q3).toFixed(2),
        sorted: arr.join(', ')
      });

    } catch (err: any) {
      alert('Stats Error: ' + err.message);
    }
  };

  // --- PROBABILITY DISTRIBUTION SOLVER ---
  const solveProbability = () => {
    try {
      if (probMode === 'binomial') {
        const n = parseInt(probBinomial.n) || 1;
        const p = parseFloat(probBinomial.p) || 0.5;
        const k = parseInt(probBinomial.k) || 0;

        // P(X = k) = C(n, k) * p^k * (1-p)^(n-k)
        const comb = math.combinations(n, k);
        const ans = comb * Math.pow(p, k) * Math.pow(1 - p, n - k);
        setProbResult(`P(X = ${k}) = ${ans.toFixed(6)} (${(ans * 100).toFixed(3)}%)`);
      } else if (probMode === 'poisson') {
        const lambda = parseFloat(probPoisson.lambda) || 1;
        const k = parseInt(probPoisson.k) || 0;

        // P(X = k) = (lambda^k * e^-lambda) / k!
        const ans = (Math.pow(lambda, k) * Math.exp(-lambda)) / math.factorial(k);
        setProbResult(`P(X = ${k}) = ${ans.toFixed(6)} (${(ans * 100).toFixed(3)}%)`);
      } else if (probMode === 'normal') {
        const mean = parseFloat(probNormal.mean) || 0;
        const sd = parseFloat(probNormal.sd) || 1;
        const x = parseFloat(probNormal.x) || 1;

        // Probability density function of normal distribution
        const exponent = -Math.pow(x - mean, 2) / (2 * sd * sd);
        const ans = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
        setProbResult(`f(x) Density = ${ans.toFixed(6)}`);
      }
    } catch (_) {
      setProbResult('Invalid parameters');
    }
  };

  useEffect(() => {
    solveProbability();
  }, [probBinModeTrigger(), probBinomial, probPoisson, probNormal]);

  function probBinModeTrigger() {
    return probMode;
  }

  // Coin Toss simulator helper
  const handleCoinToss = () => {
    const isHeads = Math.random() < 0.5;
    setCoinFlips(prev => ({
      heads: prev.heads + (isHeads ? 1 : 0),
      tails: prev.tails + (isHeads ? 0 : 1),
      total: prev.total + 1
    }));
  };

  // Dice roll simulator helper
  const handleDiceRoll = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    setDiceRolls(prev => ({
      ...prev,
      [roll]: prev[roll] + 1
    }));
  };

  // --- VARIABLE REGISTER LOGIC ---
  const saveVariable = (name: string) => {
    const val = parseFloat(liveResult);
    if (!isNaN(val)) {
      setVariables(prev => ({ ...prev, [name]: val }));
      setMemoryHistory(prev => [
        { name, value: val, timestamp: new Date().toLocaleTimeString() },
        ...prev
      ]);
    }
  };

  // --- KEYPAD ACTION HANDLERS ---
  const handleKeyPress = (val: string) => {
    // Save state for Undo stack
    setUndoStack([...undoStack, expression]);
    setRedoStack([]); // Clear Redo on new action

    if (val === 'C') {
      setExpression('');
    } else if (val === 'DEL') {
      setExpression(prev => prev.slice(0, -1));
    } else if (val === 'ANS') {
      setExpression(prev => prev + prevAns);
    } else if (val === '=') {
      if (isValid && liveResult !== '0') {
        setPrevAns(liveResult);
        // Save to browser history
        setCalcHistory(prev => [
          {
            id: Date.now().toString(),
            expr: expression,
            result: liveResult,
            pinned: false,
            favorite: false,
            timestamp: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
        setExpression(liveResult);
      }
    } else if (val === 'deg_rad') {
      setAngleMode(angleMode === 'deg' ? 'rad' : angleMode === 'rad' ? 'grad' : 'deg');
    } else {
      setExpression(prev => prev + val);
    }
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const prev = undoStack[undoStack.length - 1];
      setRedoStack([...redoStack, expression]);
      setExpression(prev);
      setUndoStack(undoStack.slice(0, -1));
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const next = redoStack[redoStack.length - 1];
      setUndoStack([...undoStack, expression]);
      setExpression(next);
      setRedoStack(redoStack.slice(0, -1));
    }
  };

  // --- DYNAMIC LaTeX AND EXPORTS ---
  const copyToClipboard = (text: string, isLaTeX: boolean = false) => {
    navigator.clipboard.writeText(text);
    if (isLaTeX) {
      setCopiedLaTeX(true);
      setTimeout(() => setCopiedLaTeX(false), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Format expression for simple colored display (Syntax Highlighting)
  const renderHighlightedExpression = () => {
    if (!expression) {
      return <span className="text-neutral-400 dark:text-neutral-600 select-none">0</span>;
    }

    // Replace and wrap operators, brackets, functions
    const tokens = expression.split(/(\+|-|\*|\/|\(|\)|\^|sin|cos|tan|log|ln|sqrt|pi|e)/g);
    return tokens.map((tok, idx) => {
      if (['+', '-', '*', '/'].includes(tok)) {
        return <span key={idx} className="text-fuchsia-500 dark:text-pink-400 font-bold">{tok}</span>;
      }
      if (['(', ')'].includes(tok)) {
        return <span key={idx} className="text-emerald-500 dark:text-emerald-400 font-bold">{tok}</span>;
      }
      if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(tok)) {
        return <span key={idx} className="text-blue-500 dark:text-cyan-400 font-medium">{tok}</span>;
      }
      if (['pi', 'e'].includes(tok)) {
        return <span key={idx} className="text-yellow-500 dark:text-yellow-400 font-semibold">{tok}</span>;
      }
      return <span key={idx}>{tok}</span>;
    });
  };

  // --- PROGRAMMER CONVERSION LOGIC ---
  const handleProgConvert = (val: string, system: 'bin' | 'oct' | 'dec' | 'hex') => {
    try {
      setProgValue(val);
      let decimalVal = 0;

      if (system === 'bin') decimalVal = parseInt(val, 2);
      else if (system === 'oct') decimalVal = parseInt(val, 8);
      else if (system === 'dec') decimalVal = parseInt(val, 10);
      else if (system === 'hex') decimalVal = parseInt(val, 16);

      if (isNaN(decimalVal)) {
        setProgResult({});
        return;
      }

      setProgResult({
        bin: decimalVal.toString(2),
        oct: decimalVal.toString(8),
        dec: decimalVal.toString(10),
        hex: decimalVal.toString(16).toUpperCase()
      });
    } catch (_) {}
  };

  useEffect(() => {
    handleProgConvert(progValue, progMode);
  }, [progMode, progValue]);


  // --- STEP-BY-STEP SOLVER LOGIC ---
  const handleGenerateSteps = () => {
    if (!expression.trim()) return;
    try {
      const steps: { name: string; formula: string; explanation: string }[] = [];
      let current = expression;

      // 1. Simplification Step
      steps.push({
        name: "Input Mathematical Expression",
        formula: current,
        explanation: "Parsed original customer algebraic text safely into browser parsing stack."
      });

      // 2. Constants Replacement
      if (current.includes('pi') || current.includes('π')) {
        current = current.replace(/pi|π/g, '3.14159');
        steps.push({
          name: "Constant Replacement",
          formula: current,
          explanation: "Substituted trigonometric ratio constant Pi with standard approximation 3.14159."
        });
      }

      // 3. Evaluation and Sub-operations
      const value = math.evaluate(expression, variables);
      steps.push({
        name: "Operator Substitution",
        formula: String(value),
        explanation: "Applied priority order of mathematical operations (PEMDAS/BODMAS) and compiled sub-formulas."
      });

      setStepOutput({
        steps,
        final: String(value)
      });
      setActiveTab('steps');
    } catch (_) {
      alert("Please ensure you have a valid expression to solve steps.");
    }
  };

  // --- RESET/CLEAR ALL ENGINE ---
  const handleClearAll = () => {
    setExpression('');
    setPrevAns('0');
    setLiveResult('0');
    setVariables({ A: 0, B: 0, C: 0, X: 0, Y: 0, Z: 0, M: 0 });
    setMemoryHistory([]);
    setCalcHistory([]);
    setMatrixResult(null);
    setMatrixAnalysis({});
    setVectorResult({});
    setComplexResult({});
    setStatsResult({});
    setStepOutput(null);
    setSmartInsights([]);
  };

  return (
    <div className="max-w-7xl mx-auto py-4">
      
      {/* --- PREMIUM BRAND HEADER --- */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-neutral-100 dark:border-neutral-800/80 pb-6 mb-8 gap-4 text-left">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-cyan-400 flex items-center gap-1.5 font-mono">
            <Compass className="w-4 h-4 animate-spin-slow text-blue-500" /> ULTIMATE CALCULATION SUITE
          </span>
          <h1 className="text-4xl font-black text-neutral-900 dark:text-white mt-1 tracking-tight">
            Scientific Calculator
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1 max-w-2xl leading-relaxed">
            Professional mathematical hardware emulator. Process matrices, vectors, trigonometry, statistical regression, complex planes, and interactive graphing entirely local.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleClearAll}
            className="px-4 py-2.5 rounded-2xl text-xs font-bold border border-red-250 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition active:scale-97 flex items-center gap-1"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear All Data
          </button>
        </div>
      </div>

      {/* --- TOP TAB SYSTEM DECK --- */}
      <div className="flex flex-wrap gap-1.5 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-8">
        {[
          { id: 'scientific', label: '🧮 Classical Pad', activeColor: 'bg-blue-600 dark:bg-cyan-600 text-white' },
          { id: 'matrices', label: '🔲 Matrices (det/eigen)', activeColor: 'bg-emerald-600 dark:bg-emerald-500 text-white' },
          { id: 'vectors_complex', label: '📐 Vectors & Complex Plane', activeColor: 'bg-indigo-600 dark:bg-indigo-500 text-white' },
          { id: 'stats_prob', label: '📊 Stats & Probability', activeColor: 'bg-amber-600 dark:bg-amber-500 text-white' },
          { id: 'number_theory', label: '🔢 Primes & Fractions', activeColor: 'bg-purple-600 dark:bg-purple-500 text-white' },
          { id: 'converter', label: '🔄 14-Category Converter', activeColor: 'bg-teal-600 dark:bg-teal-500 text-white' },
          { id: 'graphing', label: '📈 Interactive Grapher', activeColor: 'bg-pink-600 dark:bg-pink-500 text-white' },
          { id: 'steps', label: '📚 Step Solution', activeColor: 'bg-fuchsia-600 dark:bg-fuchsia-500 text-white' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${activeTab === tab.id ? tab.activeColor : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-850'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* --- MAIN TAB DECK ROUTING --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
          className="min-h-[500px]"
        >
          
          {/* ========================================================
              TAB: CLASSIC SCIENTIFIC PAD
             ======================================================== */}
          {activeTab === 'scientific' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* MAIN CALCULATOR LEFT COLUMN */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                
                {/* ADVANCED DIGITAL SCREEN DISPLAY */}
                <div className="relative p-6 rounded-3xl bg-neutral-900 border border-neutral-800 text-right font-mono flex flex-col justify-end overflow-hidden group shadow-inner">
                  {/* Angle and shift markers */}
                  <div className="absolute top-4 left-4 flex gap-2 text-[10px] uppercase font-bold text-neutral-500">
                    <span className={`px-1.5 py-0.5 rounded ${angleMode === 'deg' ? 'bg-blue-900/40 text-blue-400' : 'bg-neutral-800'}`}>Deg</span>
                    <span className={`px-1.5 py-0.5 rounded ${angleMode === 'rad' ? 'bg-cyan-900/40 text-cyan-400' : 'bg-neutral-800'}`}>Rad</span>
                    <span className={`px-1.5 py-0.5 rounded ${angleMode === 'grad' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-neutral-800'}`}>Grad</span>
                    {shiftMode && <span className="px-1.5 py-0.5 rounded bg-yellow-900/40 text-yellow-400 animate-pulse">Shift</span>}
                  </div>

                  <div className="absolute top-4 right-4 flex gap-1">
                    <button onClick={handleUndo} title="Undo" className="p-1 hover:bg-neutral-850 text-neutral-400 rounded"><Undo2 className="w-4 h-4" /></button>
                    <button onClick={handleRedo} title="Redo" className="p-1 hover:bg-neutral-850 text-neutral-400 rounded"><Redo2 className="w-4 h-4" /></button>
                  </div>

                  {/* Active Expression editor */}
                  <div className="text-neutral-300 text-xl font-medium tracking-tight mb-2 truncate break-all h-10 mt-6 overflow-x-auto select-all">
                    {renderHighlightedExpression()}
                  </div>

                  {/* Dynamic real-time calculated result */}
                  <div className="text-white text-4xl font-black select-all tracking-tight truncate">
                    {liveResult}
                  </div>

                  {/* Error validation banner */}
                  {!isValid && (
                    <div className="mt-2 text-red-400 text-xs flex items-center gap-1 border-t border-red-900/40 pt-2 justify-start">
                      <ShieldAlert className="w-3.5 h-3.5" /> Syntax Error: {errorMessage}
                    </div>
                  )}
                </div>

                {/* SCIENTIFIC KEYPAD BOARD */}
                <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-sm">
                  
                  {/* TOP OPERATORS KEYPAD RAIL */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-4 font-bold text-xs font-mono">
                    <button onClick={() => setShiftMode(!shiftMode)} className={`p-3 rounded-xl transition ${shiftMode ? 'bg-yellow-100 dark:bg-yellow-950/20 text-yellow-600 dark:text-yellow-400' : 'bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400'}`}>SHIFT</button>
                    <button onClick={() => handleKeyPress('deg_rad')} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl transition uppercase">Mode</button>
                    <button onClick={() => copyToClipboard(liveResult)} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl transition flex items-center justify-center gap-1">{copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Clipboard className="w-3.5 h-3.5" />} Copy</button>
                    <button onClick={handleGenerateSteps} className="p-3 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-xl transition">Solve Steps</button>
                    <button onClick={() => handleKeyPress('C')} className="p-3 bg-red-100 hover:bg-red-200 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-xl transition col-span-2">CLEAR</button>
                  </div>

                  {/* GENERAL FUNCTION GRID */}
                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 font-mono font-bold text-sm">
                    {/* Transcendental trigonometric rows */}
                    {[
                      { show: 'sin(', shift: 'asin(', label: 'sin', shiftLabel: 'sin⁻¹' },
                      { show: 'cos(', shift: 'acos(', label: 'cos', shiftLabel: 'cos⁻¹' },
                      { show: 'tan(', shift: 'atan(', label: 'tan', shiftLabel: 'tan⁻¹' },
                      { show: 'csc(', shift: 'acsc(', label: 'csc', shiftLabel: 'csc⁻¹' },
                      { show: 'sec(', shift: 'asec(', label: 'sec', shiftLabel: 'sec⁻¹' },
                      { show: 'cot(', shift: 'acot(', label: 'cot', shiftLabel: 'cot⁻¹' },
                    ].map(f => (
                      <button
                        key={f.label}
                        onClick={() => handleKeyPress(shiftMode ? f.shift : f.show)}
                        className="p-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-850/80 text-blue-600 dark:text-cyan-400 text-xs transition active:scale-95"
                      >
                        {shiftMode ? f.shiftLabel : f.label}
                      </button>
                    ))}

                    {/* Hyperbolic functions */}
                    {[
                      { show: 'sinh(', label: 'sinh' },
                      { show: 'cosh(', label: 'cosh' },
                      { show: 'tanh(', label: 'tanh' },
                      { show: 'log10(', label: 'log₁₀' },
                      { show: 'log2(', label: 'log₂' },
                      { show: 'ln(', label: 'ln' },
                    ].map(f => (
                      <button
                        key={f.label}
                        onClick={() => handleKeyPress(f.show)}
                        className="p-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-850/80 text-teal-600 dark:text-emerald-400 text-xs transition active:scale-95"
                      >
                        {f.label}
                      </button>
                    ))}

                    {/* Advanced operations power factorial */}
                    {[
                      { show: '^2', label: 'x²' },
                      { show: '^3', label: 'x³' },
                      { show: '^', label: 'x^y' },
                      { show: 'sqrt(', label: '√' },
                      { show: 'cbrt(', label: '³√' },
                      { show: '!', label: 'x!' },
                    ].map(o => (
                      <button
                        key={o.label}
                        onClick={() => handleKeyPress(o.show)}
                        className="p-3.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-850/80 text-neutral-700 dark:text-neutral-300 text-xs transition active:scale-95"
                      >
                        {o.label}
                      </button>
                    ))}

                    {/* Basic Layout board numbers and core arithmetic */}
                    {['7', '8', '9', '/'].map(k => (
                      <button
                        key={k}
                        onClick={() => handleKeyPress(k)}
                        className={`p-4 rounded-xl transition font-black active:scale-95 ${['/'].includes(k) ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-cyan-400' : 'bg-white hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-850 text-neutral-800 dark:text-neutral-200'}`}
                      >
                        {k}
                      </button>
                    ))}
                    <button onClick={() => handleKeyPress('DEL')} className="p-4 rounded-xl bg-amber-100 hover:bg-amber-200 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 font-bold font-mono text-xs transition">DEL</button>
                    <button onClick={() => handleKeyPress('(')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-500 rounded-xl text-xs transition">(</button>

                    {['4', '5', '6', '*'].map(k => (
                      <button
                        key={k}
                        onClick={() => handleKeyPress(k)}
                        className={`p-4 rounded-xl transition font-black active:scale-95 ${['*'].includes(k) ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-cyan-400' : 'bg-white hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-850 text-neutral-800 dark:text-neutral-200'}`}
                      >
                        {k}
                      </button>
                    ))}
                    <button onClick={() => handleKeyPress('pi')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-yellow-600 dark:text-yellow-400 text-xs transition">π</button>
                    <button onClick={() => handleKeyPress(')')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-500 rounded-xl text-xs transition">)</button>

                    {['1', '2', '3', '-'].map(k => (
                      <button
                        key={k}
                        onClick={() => handleKeyPress(k)}
                        className={`p-4 rounded-xl transition font-black active:scale-95 ${['-'].includes(k) ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-cyan-400' : 'bg-white hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-850 text-neutral-800 dark:text-neutral-200'}`}
                      >
                        {k}
                      </button>
                    ))}
                    <button onClick={() => handleKeyPress('e')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-yellow-600 dark:text-yellow-400 text-xs transition">e</button>
                    <button onClick={() => handleKeyPress('mod')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-500 text-xs transition">mod</button>

                    {['0', '.', '=', '+'].map(k => (
                      <button
                        key={k}
                        onClick={() => handleKeyPress(k)}
                        className={`p-4 rounded-xl transition font-black active:scale-95 ${k === '=' ? 'bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white col-span-2' : ['+'].includes(k) ? 'bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/20 text-blue-600 dark:text-cyan-400' : 'bg-white hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-850 text-neutral-800 dark:text-neutral-200'}`}
                      >
                        {k}
                      </button>
                    ))}
                    <button onClick={() => handleKeyPress('ANS')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-500 text-xs transition font-bold font-mono">ANS</button>
                    <button onClick={() => handleKeyPress('i')} className="p-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-indigo-500 text-xs transition font-black">i</button>
                  </div>

                </div>

                {/* SMART INSIGHTS ALERT FLOATER PANEL */}
                {smartInsights.length > 0 && (
                  <div className="p-5 rounded-3xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950/30">
                    <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5 font-mono mb-2">
                      <Sparkles className="w-4 h-4 text-amber-500" /> Smart Live Insights
                    </span>
                    <div className="space-y-1.5">
                      {smartInsights.map((ins, i) => (
                        <p key={i} className="text-xs text-neutral-600 dark:text-neutral-300 font-medium">
                          {ins}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* MEMORY & VARIABLE DECK / HISTORY DECK RIGHT PANEL */}
              <div className="lg:col-span-4 flex flex-col gap-6">
                
                {/* NAMED VARIABLES MEMORY REGISTERS */}
                <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 font-mono">
                    💾 Variables & Memory Registers
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-mono">
                    {Object.keys(variables).map((key) => (
                      <div key={key} className="p-3 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800/80 rounded-xl flex items-center justify-between">
                        <div>
                          <span className="text-blue-500 font-black">{key}</span>
                          <div className="text-neutral-800 dark:text-neutral-200 font-bold truncate max-w-[80px]">{variables[key]}</div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => saveVariable(key)}
                            className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-850 rounded hover:bg-blue-500 hover:text-white transition-all text-[8px] font-bold"
                            title="Store Active Result"
                          >
                            STO
                          </button>
                          <button
                            onClick={() => setExpression(prev => prev + key)}
                            className="px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-850 rounded hover:bg-neutral-200 transition-all text-[8px] font-bold"
                          >
                            RECALL
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* BRACKET AND FORMULA SESSION HISTORY */}
                <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex-1 flex flex-col max-h-[380px] overflow-hidden">
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-2 font-mono">
                    🕰️ Browser Session History
                  </span>

                  <div className="relative mb-3 shrink-0">
                    <input
                      type="text"
                      placeholder="Search history..."
                      value={historySearch}
                      onChange={(e) => setHistorySearch(e.target.value)}
                      className="w-full pl-8 pr-4 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs text-neutral-800 dark:text-neutral-300 focus:outline-none"
                    />
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                  </div>

                  <div className="space-y-2.5 overflow-y-auto flex-1 pr-1 text-left">
                    {calcHistory
                      .filter(h => h.expr.toLowerCase().includes(historySearch.toLowerCase()) || h.result.includes(historySearch))
                      .map((h) => (
                        <div
                          key={h.id}
                          className="p-3 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl relative group"
                        >
                          <div className="text-[10px] text-neutral-400 font-mono flex justify-between">
                            <span>{h.timestamp}</span>
                            <div className="flex gap-2">
                              <button onClick={() => setExpression(h.expr)} className="text-blue-500 hover:underline">Insert</button>
                              <button onClick={() => setCalcHistory(calcHistory.filter(x => x.id !== h.id))} className="text-red-500 hover:underline">×</button>
                            </div>
                          </div>
                          <div className="font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1 select-all break-all">{h.expr}</div>
                          <div className="font-mono text-xs text-neutral-500 mt-0.5 select-all break-all">= {h.result}</div>
                        </div>
                    ))}
                    {calcHistory.length === 0 && (
                      <div className="text-center py-6 text-xs text-neutral-400 italic">
                        No operations calculated in this browser session.
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ========================================================
              TAB: MATRIX ALGEBRA
             ======================================================== */}
          {activeTab === 'matrices' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Matrices Controller</h3>
                  <div className="flex gap-2 text-xs">
                    {[2, 3, 4].map(s => (
                      <button
                        key={s}
                        onClick={() => setMatrixSize(s as any)}
                        className={`px-3 py-1.5 rounded-lg font-bold transition-all ${matrixSize === s ? 'bg-emerald-600 text-white' : 'bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-400'}`}
                      >
                        {s}x{s}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* MATRIX A */}
                  <div>
                    <span className="block text-xs font-extrabold uppercase tracking-widest text-emerald-500 mb-3 font-mono">
                      Matrix A
                    </span>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}>
                      {Array.from({ length: matrixSize }).map((_, r) =>
                        Array.from({ length: matrixSize }).map((_, c) => (
                          <input
                            key={`A-${r}-${c}`}
                            type="number"
                            value={matrixA[r][c] || ''}
                            onChange={(e) => {
                              const copy = [...matrixA];
                              copy[r][c] = parseFloat(e.target.value) || 0;
                              setMatrixA(copy);
                            }}
                            className="p-2.5 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-center text-sm"
                          />
                        ))
                      )}
                    </div>
                  </div>

                  {/* MATRIX B */}
                  <div>
                    <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 font-mono">
                      Matrix B
                    </span>
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}>
                      {Array.from({ length: matrixSize }).map((_, r) =>
                        Array.from({ length: matrixSize }).map((_, c) => (
                          <input
                            key={`B-${r}-${c}`}
                            type="number"
                            value={matrixB[r][c] || ''}
                            onChange={(e) => {
                              const copy = [...matrixB];
                              copy[r][c] = parseFloat(e.target.value) || 0;
                              setMatrixB(copy);
                            }}
                            className="p-2.5 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-center text-sm"
                          />
                        ))
                      )}
                    </div>
                  </div>

                </div>

                {/* Operations board */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <button onClick={() => handleMatrixSolve('add')} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">A + B</button>
                  <button onClick={() => handleMatrixSolve('subtract')} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">A - B</button>
                  <button onClick={() => handleMatrixSolve('multiply')} className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition">A × B</button>
                  <button onClick={() => handleMatrixSolve('transposeA')} className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition">Aᵀ (Transpose)</button>
                  <button onClick={() => handleMatrixSolve('inverseA')} className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition">A⁻¹ (Inverse)</button>
                  <button onClick={() => handleMatrixSolve('detA')} className="px-4 py-2.5 rounded-xl bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-200 font-bold text-xs transition">det(A)</button>
                </div>

                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    value={matrixScalar}
                    onChange={(e) => setMatrixScalar(e.target.value)}
                    placeholder="Scalar"
                    className="w-20 p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-sm font-mono text-center"
                  />
                  <button onClick={() => handleMatrixSolve('scalarA')} className="px-4 py-2.5 rounded-xl bg-neutral-200 dark:bg-neutral-850 text-neutral-800 dark:text-neutral-200 font-bold text-xs">Multiply A by Scalar</button>
                </div>

              </div>

              {/* MATRIX ANALYSIS AND HEATMAP VISUALIZER */}
              <div className="flex flex-col gap-6">
                
                {/* HEATMAP GRAPH */}
                <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 font-mono">
                    🎨 Matrix Heatmap Visualization (A)
                  </span>

                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850">
                    <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${matrixSize}, minmax(0, 1fr))` }}>
                      {Array.from({ length: matrixSize }).map((_, r) =>
                        Array.from({ length: matrixSize }).map((_, c) => {
                          const val = matrixA[r][c] || 0;
                          const abs = Math.abs(val);
                          // Calculate background opacity based on magnitude
                          const maxVal = Math.max(...matrixA.flat().map(Math.abs)) || 1;
                          const opacity = Math.min(Math.max(abs / maxVal, 0.1), 0.95);
                          return (
                            <div
                              key={`H-${r}-${c}`}
                              className="w-14 h-14 rounded-lg flex items-center justify-center font-mono text-xs font-bold shadow-sm transition-all"
                              style={{
                                backgroundColor: `rgba(16, 185, 129, ${opacity})`,
                                color: opacity > 0.55 ? '#ffffff' : '#111827'
                              }}
                              title={`Cell [${r+1},${c+1}]: ${val}`}
                            >
                              {val}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>

                {/* MATRIX RESULT AND CORE METRICS */}
                <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex-1">
                  <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 font-mono">
                    📊 Solve Outcome & Matrix Analysis
                  </span>

                  {matrixResult ? (
                    <div className="mb-6">
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-2">Computation Matrix</label>
                      <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl max-w-sm font-mono text-sm leading-relaxed">
                        {matrixResult.map((r, ri) => (
                          <div key={ri} className="flex gap-4 justify-center">
                            {r.map((v, ci) => (
                              <span key={ci} className="w-16 text-center truncate">{v.toFixed(3).replace(/\.?0+$/, '')}</span>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-xs text-neutral-400 italic">
                      Choose an algebra operation on the left to reveal coordinates.
                    </div>
                  )}

                  <div className="space-y-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    {matrixAnalysis.detA !== undefined && (
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                        <span>Determinant of A:</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{matrixAnalysis.detA.toFixed(4).replace(/\.?0+$/, '')}</span>
                      </div>
                    )}
                    {matrixAnalysis.isSingularA !== undefined && (
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                        <span>Is A Singular (det=0)?</span>
                        <span className="font-bold text-amber-500">{matrixAnalysis.isSingularA ? 'Yes, Invertible: NO' : 'No, Invertible: YES'}</span>
                      </div>
                    )}
                    {matrixAnalysis.eigenvaluesA && (
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                        <span>Eigenvalues (A):</span>
                        <span className="font-bold text-emerald-500">{matrixAnalysis.eigenvaluesA.join(', ')}</span>
                      </div>
                    )}
                    {matrixAnalysis.invA && typeof matrixAnalysis.invA === 'string' && (
                      <div className="text-amber-500 font-bold border border-amber-200 bg-amber-50 dark:bg-amber-950/10 p-2.5 rounded-xl">
                        {matrixAnalysis.invA}
                      </div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          )}


          {/* ========================================================
              TAB: VECTORS & COMPLEX PLANE
             ======================================================== */}
          {activeTab === 'vectors_complex' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              
              {/* VECTORS CALCULATION CARD */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">Vector Vectorial Math (U & V)</h3>
                  
                  {/* INPUTS CONTAINER */}
                  <div className="space-y-4 mb-6">
                    <div>
                      <span className="block text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-2 font-mono">Vector U (X, Y, Z)</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map(coord => (
                          <div key={coord} className="flex items-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5">
                            <span className="text-[10px] font-black text-neutral-400 uppercase mr-2">{coord}</span>
                            <input
                              type="number"
                              value={(vectorU as any)[coord]}
                              onChange={(e) => setVectorU({ ...vectorU, [coord]: e.target.value })}
                              className="w-full bg-transparent font-mono text-sm border-none focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <span className="block text-xs font-extrabold uppercase tracking-widest text-indigo-500 mb-2 font-mono">Vector V (X, Y, Z)</span>
                      <div className="grid grid-cols-3 gap-2">
                        {['x', 'y', 'z'].map(coord => (
                          <div key={coord} className="flex items-center bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-2.5 py-1.5">
                            <span className="text-[10px] font-black text-neutral-400 uppercase mr-2">{coord}</span>
                            <input
                              type="number"
                              value={(vectorV as any)[coord]}
                              onChange={(e) => setVectorV({ ...vectorV, [coord]: e.target.value })}
                              className="w-full bg-transparent font-mono text-sm border-none focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* RESULTS SHEET */}
                  <div className="space-y-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300 border-t border-neutral-200 dark:border-neutral-800 pt-4">
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Magnitude of Vector U:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{vectorResult.magU}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Magnitude of Vector V:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{vectorResult.magV}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Dot Product (U · V):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{vectorResult.dot}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Cross Product (U × V):</span>
                      <span className="font-bold text-indigo-500">{vectorResult.cross}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Angle Between (U, V):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{vectorResult.angle}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Projection (Proj_v U):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{vectorResult.proj}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Normalized U (Unit Vector):</span>
                      <span className="font-bold text-neutral-500">{vectorResult.normU}</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* COMPLEX PLANE PORTABLE VISUALIZER */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6">
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">Complex Plane Visualization</h3>
                  
                  {/* REAL IMAG COMPLEX INPUTS */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Real Axis (x)</label>
                      <input
                        type="number"
                        value={complexReal}
                        onChange={(e) => setComplexReal(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Imaginary Axis (yi)</label>
                      <input
                        type="number"
                        value={complexImag}
                        onChange={(e) => setComplexImag(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-sm"
                      />
                    </div>
                  </div>

                  {/* ACTIVE VECTOR PLANE DIAGRAM */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 mb-6">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono mb-2">Complex Plane (Argand) Diagram</span>
                    
                    <svg className="w-56 h-56" viewBox="0 0 200 200">
                      {/* Grid Lines */}
                      <line x1="0" y1="100" x2="200" y2="100" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-neutral-800" />
                      <line x1="100" y1="0" x2="100" y2="200" stroke="#e5e7eb" strokeWidth="1" className="dark:stroke-neutral-800" />

                      {/* Coordinate Labels */}
                      <text x="180" y="112" className="text-[8px] fill-neutral-400 font-mono font-bold">Real</text>
                      <text x="105" y="15" className="text-[8px] fill-neutral-400 font-mono font-bold">Imag</text>

                      {/* Vector line projection based on coordinate size */}
                      {(() => {
                        const r = parseFloat(complexReal) || 0;
                        const im = parseFloat(complexImag) || 0;
                        const mag = Math.sqrt(r*r + im*im) || 1;
                        // Limit scale to stay inside bounds
                        const scale = 75 / Math.max(Math.abs(r), Math.abs(im), 1);
                        const targetX = 100 + r * scale;
                        const targetY = 100 - im * scale; // invert Y coordinate in SVG space

                        return (
                          <>
                            {/* Circle sweep guide */}
                            <circle cx="100" cy="100" r={mag * scale} fill="none" stroke="rgba(99, 102, 241, 0.15)" strokeWidth="1" strokeDasharray="2" />
                            {/* Angle indicator */}
                            <path d={`M 100 100 L 120 100 A 20 20 0 0 ${im >= 0 ? 0 : 1} ${100 + 20 * (r / mag)} ${100 - 20 * (im / mag)}`} fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                            {/* Coordinate Vector line */}
                            <line x1="100" y1="100" x2={targetX} y2={targetY} stroke="#6366f1" strokeWidth="3" strokeLinecap="round" />
                            <circle cx={targetX} cy={targetY} r="5" fill="#6366f1" />
                          </>
                        );
                      })()}
                    </svg>
                  </div>

                  {/* CONVERTED FORMULAS METRICS */}
                  <div className="space-y-3.5 text-xs font-mono text-neutral-600 dark:text-neutral-300">
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Rectangular Notation:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{complexReal} + {complexImag}i</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Magnitude / Absolute (r):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{complexResult.magnitude}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Argument Angle (θ):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{complexResult.argDeg}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Polar Notation (r∠θ):</span>
                      <span className="font-bold text-indigo-500">{complexResult.polar}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Euler's exponential:</span>
                      <span className="font-bold text-indigo-500">{complexResult.euler}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}


          {/* ========================================================
              TAB: STATISTICS & PROBABILITY
             ======================================================== */}
          {activeTab === 'stats_prob' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              
              {/* COMPREHENSIVE STATISTICS BOARD */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-5">
                <div>
                  <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-2">Descriptive Statistics Dataset</h3>
                  <p className="text-xs text-neutral-500 mb-4">Input values separated by commas (e.g. 10, 20, 15...)</p>

                  <textarea
                    rows={3}
                    value={statsData}
                    onChange={(e) => setStatsData(e.target.value)}
                    className="w-full p-4 rounded-2xl border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-sm mb-4 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    onClick={handleSolveStats}
                    className="w-full py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl transition shadow-[0_4px_15px_rgba(245,158,11,0.2)]"
                  >
                    Analyze Dataset
                  </button>

                  {/* EXTRACTED METRICS COMPILATION */}
                  {statsResult.count ? (
                    <div className="space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-300 mt-6 border-t border-neutral-200 dark:border-neutral-850 pt-4">
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Sample Count (n):</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.count}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Mean Average (μ):</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.mean}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Median (Q2):</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.median}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Mode:</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.mode}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Variance (Sample):</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.varianceSample}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Std Deviation (Sample, s):</span>
                        <span className="font-bold text-amber-500">{statsResult.stdSample}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Quartile 1 (Q1) / Quartile 3 (Q3):</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.q1} / {statsResult.q3}</span>
                      </div>
                      <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-1.5">
                        <span>Range Min / Max:</span>
                        <span className="font-bold text-neutral-800 dark:text-neutral-100">{statsResult.min} ... {statsResult.max}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-xs text-neutral-400 italic">
                      Click Analyze Dataset to parse and draw the distribution stats.
                    </div>
                  )}

                </div>
              </div>

              {/* PROBABILITY DISTRIBUTION AND INTERACTIVE SIMULATORS */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col gap-6">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-white">Probability Suite</h3>
                    <select
                      value={probMode}
                      onChange={(e) => setProgMode(e.target.value as any)}
                      onClick={(e) => {
                        const target = e.target as HTMLSelectElement;
                        setProbMode(target.value as any);
                      }}
                      className="p-2 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-lg text-xs font-mono font-bold"
                    >
                      <option value="simulation">🎲 Flip/Roll Sim</option>
                      <option value="binomial">📈 Binomial PDF</option>
                      <option value="poisson">📈 Poisson PDF</option>
                      <option value="normal">📈 Normal Bell Curve</option>
                    </select>
                  </div>

                  {/* ACTIVE CONFIGURATION FORM FOR DISTRIBUTIONS */}
                  {probMode === 'binomial' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Trials (n)</label>
                          <input type="number" value={probBinomial.n} onChange={(e) => setProbBinomial({...probBinomial, n: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Prob (p)</label>
                          <input type="number" step="0.05" value={probBinomial.p} onChange={(e) => setProbBinomial({...probBinomial, p: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Successes (k)</label>
                          <input type="number" value={probBinomial.k} onChange={(e) => setProbBinomial({...probBinomial, k: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 font-mono text-sm text-center font-bold text-indigo-600 dark:text-cyan-400">
                        {probResult}
                      </div>
                    </div>
                  )}

                  {probMode === 'poisson' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Lambda (Rate λ)</label>
                          <input type="number" value={probPoisson.lambda} onChange={(e) => setProbPoisson({...probPoisson, lambda: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Occurrences (k)</label>
                          <input type="number" value={probPoisson.k} onChange={(e) => setProbPoisson({...probPoisson, k: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 font-mono text-sm text-center font-bold text-indigo-600 dark:text-cyan-400">
                        {probResult}
                      </div>
                    </div>
                  )}

                  {probMode === 'normal' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Mean (μ)</label>
                          <input type="number" value={probNormal.mean} onChange={(e) => setProbNormal({...probNormal, mean: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">Std Dev (σ)</label>
                          <input type="number" value={probNormal.sd} onChange={(e) => setProbNormal({...probNormal, sd: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-neutral-500 uppercase mb-1">X point</label>
                          <input type="number" value={probNormal.x} onChange={(e) => setProbNormal({...probNormal, x: e.target.value})} className="w-full p-2.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono text-center" />
                        </div>
                      </div>
                      <div className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 font-mono text-sm text-center font-bold text-indigo-600 dark:text-cyan-400">
                        {probResult}
                      </div>
                    </div>
                  )}

                  {/* INTERACTIVE COIN AND DICE SIMULATOR */}
                  {probMode === 'simulation' && (
                    <div className="space-y-6">
                      
                      {/* COIN TOSS BOARD */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850">
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-3 font-mono">
                          🪙 Interactive Coin Flip Sim
                        </span>
                        <div className="flex items-center justify-between gap-4 mb-3">
                          <button
                            onClick={handleCoinToss}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition"
                          >
                            Flip Coin
                          </button>
                          <span className="font-mono text-xs font-bold text-neutral-500">Total Flips: {coinFlips.total}</span>
                        </div>
                        <div className="flex gap-4 text-xs font-mono">
                          <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-lg text-center">
                            <span className="text-blue-500 font-bold">Heads:</span> {coinFlips.heads} ({coinFlips.total > 0 ? ((coinFlips.heads / coinFlips.total) * 100).toFixed(1) : 0}%)
                          </div>
                          <div className="flex-1 bg-neutral-50 dark:bg-neutral-900 p-2 rounded-lg text-center">
                            <span className="text-amber-500 font-bold">Tails:</span> {coinFlips.tails} ({coinFlips.total > 0 ? ((coinFlips.tails / coinFlips.total) * 100).toFixed(1) : 0}%)
                          </div>
                        </div>
                      </div>

                      {/* DICE ROLLING STATISTICS PANEL */}
                      <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850">
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-3 font-mono">
                          🎲 6-Sided Dice Roll Distribution
                        </span>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={handleDiceRoll}
                            className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition"
                          >
                            Roll Die
                          </button>
                          <span className="font-mono text-xs font-bold text-neutral-500">
                            Total Rolls: {(Object.values(diceRolls) as number[]).reduce((a, b) => a + b, 0)}
                          </span>
                        </div>

                        {/* Interactive dynamic bar gauges */}
                        <div className="space-y-2 font-mono text-xs">
                          {[1, 2, 3, 4, 5, 6].map(num => {
                            const count = diceRolls[num] || 0;
                            const total = (Object.values(diceRolls) as number[]).reduce((a, b) => a + b, 0) || 1;
                            const percent = (count / total) * 100;
                            return (
                              <div key={num} className="flex items-center gap-3">
                                <span className="font-bold text-neutral-500 w-3">{num}</span>
                                <div className="flex-1 bg-neutral-100 dark:bg-neutral-900 h-2.5 rounded-full overflow-hidden">
                                  <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${percent}%` }} />
                                </div>
                                <span className="w-12 text-right">{count} r</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </div>

            </div>
          )}


          {/* ========================================================
              TAB: NUMBER THEORY & FRACTIONS
             ======================================================== */}
          {activeTab === 'number_theory' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left">
              
              {/* NUMBER THEORY BLOCK */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">Number Theory (Prime Factor, GCD/LCM)</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Value A</label>
                    <input
                      type="number"
                      value={numTheoryVal}
                      onChange={(e) => setNumTheoryVal(e.target.value)}
                      className="w-full p-3 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-sm text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Value B</label>
                    <input
                      type="number"
                      value={numTheoryVal2}
                      onChange={(e) => setNumTheoryVal2(e.target.value)}
                      className="w-full p-3 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-sm text-center"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSolveNumTheory}
                  className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition shadow-[0_4px_15px_rgba(168,85,247,0.2)] mb-6"
                >
                  Analyze Integers
                </button>

                {numTheoryResult.isPrime ? (
                  <div className="space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Is Value A Prime?</span>
                      <span className="font-bold text-purple-500">{numTheoryResult.isPrime}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Prime Factorization (A):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{numTheoryResult.factorization}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Greatest Common Divisor (GCD):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{numTheoryResult.gcd}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Least Common Multiple (LCM):</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{numTheoryResult.lcm}</span>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-neutral-400">Divisors of A:</span>
                      <span className="p-2.5 rounded-xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 leading-relaxed font-bold max-h-24 overflow-y-auto">{numTheoryResult.divisors}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-400 italic">
                    Configure integer variables and click Analyze to view factorization tree.
                  </div>
                )}
              </div>

              {/* FRACTIONS INTEGRATOR BLOCK */}
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">Mixed & Improper Fraction Arithmetic</h3>
                
                {/* DUAL FRACTION INPUT CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  
                  {/* FRACTION 1 */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-3 font-mono">Fraction 1</span>
                    <div className="flex items-center gap-2 font-mono">
                      <input type="number" placeholder="W" value={fractionWhole} onChange={(e) => setFractionWhole(e.target.value)} className="w-12 p-2 rounded border border-neutral-200 dark:border-neutral-800 bg-transparent text-center" title="Whole integer (optional)" />
                      <div className="flex flex-col gap-1">
                        <input type="number" placeholder="N" value={fractionNum} onChange={(e) => setFractionNum(e.target.value)} className="w-12 p-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-transparent text-center" title="Numerator" />
                        <div className="h-[1px] bg-neutral-300 dark:bg-neutral-800" />
                        <input type="number" placeholder="D" value={fractionDen} onChange={(e) => setFractionDen(e.target.value)} className="w-12 p-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-transparent text-center" title="Denominator" />
                      </div>
                    </div>
                  </div>

                  {/* FRACTION 2 */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850">
                    <span className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-3 font-mono">Fraction 2</span>
                    <div className="flex items-center gap-2 font-mono">
                      <input type="number" placeholder="W" value={fractionWhole2} onChange={(e) => setFractionWhole2(e.target.value)} className="w-12 p-2 rounded border border-neutral-200 dark:border-neutral-800 bg-transparent text-center" title="Whole integer (optional)" />
                      <div className="flex flex-col gap-1">
                        <input type="number" placeholder="N" value={fractionNum2} onChange={(e) => setFractionNum2(e.target.value)} className="w-12 p-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-transparent text-center" title="Numerator" />
                        <div className="h-[1px] bg-neutral-300 dark:bg-neutral-800" />
                        <input type="number" placeholder="D" value={fractionDen2} onChange={(e) => setFractionDen2(e.target.value)} className="w-12 p-1.5 rounded border border-neutral-200 dark:border-neutral-800 bg-transparent text-center" title="Denominator" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Operations selectors */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex gap-2">
                    {['+', '-', '*', '/'].map((op) => (
                      <button
                        key={op}
                        onClick={() => setFractionOp(op as any)}
                        className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-all ${fractionOp === op ? 'bg-purple-600 text-white' : 'bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850'}`}
                      >
                        {op}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleSolveFraction}
                    className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition"
                  >
                    Solve Fraction
                  </button>
                </div>

                {/* RESULT SCREEN */}
                {fractionResult.improper ? (
                  <div className="space-y-3 font-mono text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Improper Form:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{fractionResult.improper}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Simplified Mixed Form:</span>
                      <span className="font-bold text-purple-500 text-sm">{fractionResult.mixed}</span>
                    </div>
                    <div className="flex justify-between border-b border-neutral-100 dark:border-neutral-850 pb-2">
                      <span>Decimal Equivalency:</span>
                      <span className="font-bold text-neutral-800 dark:text-neutral-100">{fractionResult.decimal}</span>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center text-xs text-neutral-400 italic">
                    Build Fraction segments and click Solve Fraction to compute arithmetic.
                  </div>
                )}

              </div>

            </div>
          )}


          {/* ========================================================
              TAB: CONSTANTS & UNIT CONVERSION
             ======================================================== */}
          {activeTab === 'converter' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
              
              {/* OFFLINE UNIT CONVERTER LEFT BLOCK */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4">14-Category Offline Unit Converter</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  
                  {/* CATEGORIES COLUMN */}
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">Conversion Category</label>
                    <div className="space-y-1 max-h-[280px] overflow-y-auto border border-neutral-200 dark:border-neutral-800 p-1.5 rounded-xl bg-white dark:bg-neutral-950">
                      {UNIT_CATEGORIES.map(cat => (
                        <button
                          key={cat}
                          onClick={() => setConvCategory(cat)}
                          className={`w-full text-left p-2 rounded-lg text-xs font-bold transition-all ${convCategory === cat ? 'bg-teal-600 text-white' : 'hover:bg-neutral-100 dark:hover:bg-neutral-900'}`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* UNITS VALUE AND FROM TO CONTROLS */}
                  <div className="sm:col-span-2 flex flex-col gap-4">
                    
                    <div>
                      <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">From Value</label>
                      <input
                        type="number"
                        value={convFromValue}
                        onChange={(e) => setConvFromValue(e.target.value)}
                        className="w-full p-3 rounded-xl border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-950 font-mono text-sm"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">From Unit</label>
                        <select
                          value={convFromUnit}
                          onChange={(e) => setConvFromUnit(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono"
                        >
                          {(UNITS_DATA[convCategory] || []).map(u => (
                            <option key={u.key} value={u.key}>{u.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-neutral-500 uppercase mb-1.5">To Unit</label>
                        <select
                          value={convToUnit}
                          onChange={(e) => setConvToUnit(e.target.value)}
                          className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs font-mono"
                        >
                          {(UNITS_DATA[convCategory] || []).map(u => (
                            <option key={u.key} value={u.key}>{u.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/10 border border-teal-100 dark:border-teal-950/30 font-mono text-center">
                      <span className="block text-[10px] font-extrabold uppercase tracking-widest text-teal-500 mb-1">Converted Output</span>
                      <div className="text-xl font-black text-teal-600 dark:text-cyan-400 select-all">
                        {convToValue}
                      </div>
                    </div>

                  </div>

                </div>

                {/* UNIT RATIO DIAGRAM */}
                <div className="p-4 rounded-2xl bg-white dark:bg-neutral-950 border border-neutral-250 dark:border-neutral-850">
                  <span className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400 mb-2 font-mono">Comparative Ratio Diagram</span>
                  <div className="flex flex-col gap-2.5 text-xs font-mono">
                    <div>
                      <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                        <span>{convFromUnit}</span>
                        <span>1.0</span>
                      </div>
                      <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-3 rounded-full overflow-hidden">
                        <div className="bg-teal-500 h-full w-full" />
                      </div>
                    </div>
                    <div>
                      {(() => {
                        const factor = convertUnit(1, convFromUnit, convToUnit, convCategory);
                        // Clip comparative bar limit safely
                        const pct = Math.min(Math.max(factor * 100, 2), 100);

                        return (
                          <>
                            <div className="flex justify-between text-[10px] text-neutral-500 mb-1">
                              <span>{convToUnit}</span>
                              <span>{factor.toExponential(4)}</span>
                            </div>
                            <div className="w-full bg-neutral-100 dark:bg-neutral-900 h-3 rounded-full overflow-hidden">
                              <div className="bg-indigo-500 h-full transition-all duration-300" style={{ width: `${pct}%` }} />
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                </div>

              </div>

              {/* SEARCHABLE SCIENTIFIC CONSTANTS PANEL */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 flex flex-col max-h-[620px] overflow-hidden">
                <span className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3 font-mono">
                  🔬 Search 100+ Scientific Constants
                </span>

                <div className="relative mb-3 shrink-0">
                  <input
                    type="text"
                    placeholder="Search by name, category, or units..."
                    value={constantSearch}
                    onChange={(e) => setConstantSearch(e.target.value)}
                    className="w-full pl-8 pr-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-xs text-neutral-800 dark:text-neutral-300 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-neutral-400 absolute left-2.5 top-2.5" />
                </div>

                {/* CATEGORY TAG FILTERS */}
                <div className="flex flex-wrap gap-1.5 mb-4 shrink-0 overflow-x-auto pb-1 text-xs">
                  {['All', 'Universal', 'Electromagnetic', 'Atomic & Nuclear', 'Physicochemical', 'Earth & Astronomy', 'Mathematical'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedConstantCategory(cat)}
                      className={`px-2 py-1 rounded-lg font-bold transition-all ${selectedConstantCategory === cat ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-neutral-950 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-850 border border-neutral-200/50 dark:border-neutral-800'}`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 overflow-y-auto flex-1 pr-1">
                  {SCIENTIFIC_CONSTANTS
                    .filter(c => selectedConstantCategory === 'All' || c.category === selectedConstantCategory)
                    .filter(c => c.name.toLowerCase().includes(constantSearch.toLowerCase()) || c.symbol.toLowerCase().includes(constantSearch.toLowerCase()))
                    .map((c, i) => (
                      <div
                        key={i}
                        className="p-3.5 bg-white dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-800/80 rounded-2xl relative group hover:border-indigo-400 dark:hover:border-cyan-500 transition-all duration-150 text-left"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-500 dark:text-cyan-400 font-mono bg-indigo-50 dark:bg-cyan-950/20 px-2 py-0.5 rounded-lg">{c.symbol}</span>
                          <button
                            onClick={() => {
                              setExpression(prev => prev + c.symbol);
                              setActiveTab('scientific');
                            }}
                            className="text-[10px] text-blue-500 dark:text-cyan-400 font-bold opacity-0 group-hover:opacity-100 hover:underline transition-all"
                          >
                            Insert to Expression
                          </button>
                        </div>
                        <h4 className="font-bold text-neutral-800 dark:text-neutral-200 text-xs mt-1.5">{c.name}</h4>
                        <div className="font-mono text-xs text-neutral-900 dark:text-neutral-100 mt-1 select-all break-all">{c.value.toExponential(6)} <span className="text-neutral-400 text-[10px]">{c.unit}</span></div>
                        <p className="text-[10px] text-neutral-400 mt-1 leading-normal font-sans">{c.description}</p>
                      </div>
                  ))}
                </div>

              </div>

            </div>
          )}


          {/* ========================================================
              TAB: INTERACTIVE GRAPHING
             ======================================================== */}
          {activeTab === 'graphing' && (
            <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
              <GraphingCanvas />
            </div>
          )}


          {/* ========================================================
              TAB: STEP-BY-STEP MATHEMATICAL SOLUTION MODE
             ======================================================== */}
          {activeTab === 'steps' && (
            <div className="max-w-4xl mx-auto p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-left">
              <h3 className="text-lg font-bold text-neutral-800 dark:text-white mb-4 flex items-center gap-1.5">
                📚 Formula Steps Breakdown (PEMDAS/BODMAS Execution)
              </h3>

              {stepOutput ? (
                <div className="space-y-6">
                  <div className="space-y-4">
                    {stepOutput.steps.map((st, i) => (
                      <div key={i} className="flex gap-4 relative">
                        {/* Timeline visual bar */}
                        {i < stepOutput.steps.length - 1 && (
                          <div className="w-[1.5px] bg-neutral-250 dark:bg-neutral-800 absolute top-8 bottom-0 left-4" />
                        )}
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white font-mono font-black flex items-center justify-center shrink-0 z-10 text-xs">
                          {i + 1}
                        </div>
                        <div className="p-4 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-850 rounded-2xl flex-1 shadow-sm">
                          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">{st.name}</span>
                          <h4 className="font-mono text-sm font-semibold text-neutral-800 dark:text-neutral-200 mt-1 select-all break-all">{st.formula}</h4>
                          <p className="text-xs text-neutral-500 mt-1 font-sans">{st.explanation}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-mono font-black text-center text-lg shadow-md">
                    <span>Final Answer: {stepOutput.final}</span>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center text-neutral-400 italic">
                  To view steps, type any mathematical expression in the "Classical Pad" first and click "Solve Steps".
                </div>
              )}
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      {/* --- EDUCATIONAL SECTION & GLOSSARY (SEO) --- */}
      <EducationalContent onNavigate={onNavigate} />

    </div>
  );
}
