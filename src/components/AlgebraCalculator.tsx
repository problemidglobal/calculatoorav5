import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Minus, 
  X, 
  Divide, 
  Trash2, 
  Copy, 
  Check, 
  Printer, 
  Sparkles, 
  History, 
  Download, 
  RotateCcw, 
  BookOpen, 
  Search, 
  Grid, 
  Maximize2, 
  Minimize2,
  Sliders,
  TrendingUp,
  Activity,
  FileText,
  AlertCircle,
  HelpCircle,
  Hash,
  Share2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  cleanExpression, 
  parsePolynomial, 
  stringifyPolynomial, 
  addPolynomials, 
  subtractPolynomials, 
  multiplyPolynomials, 
  dividePolynomials, 
  solveEquation, 
  solveSystemOfEquations, 
  solveInequality, 
  analyzeFunction, 
  analyzePolynomial, 
  computeGcfLcm, 
  evalPolyAt, 
  solvePolynomialNumerical,
  Polynomial
} from '../utils/algebraMath';

// Types
interface HistoryItem {
  id: string;
  timestamp: string;
  type: string;
  input: string;
  output: string;
}

export default function AlgebraCalculator() {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'equation' | 'system' | 'expression' | 'polynomial' | 'inequality' | 'gcf-lcm' | 'graphing' | 'analysis'>('equation');

  // Input states - starting EMPTY as per requirements
  const [equationInput, setEquationInput] = useState<string>('');
  const [systemInput, setSystemInput] = useState<string>('');
  const [expressionInput, setExpressionInput] = useState<string>('');
  const [polyDividend, setPolyDividend] = useState<string>('');
  const [polyDivisor, setPolyDivisor] = useState<string>('');
  const [inequalityInput, setInequalityInput] = useState<string>('');
  const [gcflcmInput, setGcflcmInput] = useState<string>('');
  const [analysisInput, setAnalysisInput] = useState<string>('');

  // Multiple functions for graphing - empty starting placeholders
  const [graphFunc1, setGraphFunc1] = useState<string>('');
  const [graphFunc2, setGraphFunc2] = useState<string>('');
  const [graphFunc3, setGraphFunc3] = useState<string>('');

  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Graph state
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [graphScale, setGraphScale] = useState<number>(35); // Pixels per unit
  const [graphCenter, setGraphCenter] = useState<{ x: number; y: number }>({ x: 200, y: 200 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number; mx: number; my: number } | null>(null);

  // Collapsible steps tracker
  const [expandedSteps, setExpandedSteps] = useState<{ [key: string]: boolean }>({});

  const toggleStep = (stepTitle: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepTitle]: !prev[stepTitle] }));
  };

  // Live Results State
  const [results, setResults] = useState<any>(null);

  // Handle errors gracefully and never crash
  const runValidation = (text: string, type: string): boolean => {
    if (!text) {
      setValidationError(null);
      return true;
    }
    
    // Simple algebraic syntax validator
    const invalidPatterns = [
      /[=<>!]{3,}/,          // Too many comparators together
      /[+\-*/^]{2,}/,         // Dual mathematical operators without parenthesis
      /[a-wy-zA-WY-Z]/,      // Variables other than x (except in system solver)
      /[^0-9a-zA-Z+\-*/^=<>!().\s,\n]/ // Unsupported characters
    ];

    if (type !== 'system' && type !== 'gcf-lcm') {
      if (invalidPatterns[2].test(text)) {
        setValidationError("Variable support is currently focused on 'x' for algebraic consistency.");
        return false;
      }
    }

    if (invalidPatterns[0].test(text) || invalidPatterns[1].test(text) || invalidPatterns[3].test(text)) {
      setValidationError("Syntax alert: Please verify operators, parenthesis, and algebraic symbols.");
      return false;
    }

    setValidationError(null);
    return true;
  };

  // Realtime updates as users type - NO calculate button required
  useEffect(() => {
    try {
      if (activeTab === 'equation') {
        if (!equationInput) {
          setResults(null);
          return;
        }
        if (runValidation(equationInput, 'equation')) {
          const res = solveEquation(equationInput);
          setResults(res);
          addToHistory('Equation Solve', equationInput, res.solutions.map(s => `x = ${s.exact}`).join(', ') || 'No solution');
        }
      } else if (activeTab === 'system') {
        if (!systemInput) {
          setResults(null);
          return;
        }
        if (runValidation(systemInput, 'system')) {
          const equations = systemInput.split(/[\n,]/).filter(e => e.trim());
          const res = solveSystemOfEquations(equations);
          setResults(res);
          if (res.solved) {
            addToHistory('System Solve', systemInput, Object.entries(res.solutions).map(([k, v]) => `${k} = ${v.exact}`).join(', '));
          }
        }
      } else if (activeTab === 'expression') {
        if (!expressionInput) {
          setResults(null);
          return;
        }
        if (runValidation(expressionInput, 'expression')) {
          const poly = parsePolynomial(expressionInput);
          const simplified = stringifyPolynomial(poly);
          const res = {
            simplified,
            termsCount: poly.length,
            poly,
            steps: [
              {
                title: 'Collect Like Terms',
                expression: simplified,
                explanation: `Group matching exponents together. Combine their coefficients to obtain the simplified algebraic expression: ${simplified}.`
              }
            ]
          };
          setResults(res);
          addToHistory('Expression Simplify', expressionInput, simplified);
        }
      } else if (activeTab === 'polynomial') {
        if (!polyDividend || !polyDivisor) {
          setResults(null);
          return;
        }
        if (runValidation(polyDividend, 'polynomial') && runValidation(polyDivisor, 'polynomial')) {
          const dividendPoly = parsePolynomial(polyDividend);
          const divisorPoly = parsePolynomial(polyDivisor);
          const divResult = dividePolynomials(dividendPoly, divisorPoly);
          setResults(divResult);
          addToHistory('Polynomial Division', `${polyDividend} ÷ ${polyDivisor}`, `Quotient: ${stringifyPolynomial(divResult.quotient)} | Remainder: ${stringifyPolynomial(divResult.remainder)}`);
        }
      } else if (activeTab === 'inequality') {
        if (!inequalityInput) {
          setResults(null);
          return;
        }
        if (runValidation(inequalityInput, 'inequality')) {
          const res = solveInequality(inequalityInput);
          setResults(res);
          addToHistory('Inequality Solve', inequalityInput, `${res.solution} [Interval: ${res.interval}]`);
        }
      } else if (activeTab === 'gcf-lcm') {
        if (!gcflcmInput) {
          setResults(null);
          return;
        }
        if (runValidation(gcflcmInput, 'gcf-lcm')) {
          const terms = gcflcmInput.split(/[\n,]/).map(t => t.trim()).filter(Boolean);
          const res = computeGcfLcm(terms);
          setResults(res);
          addToHistory('GCF/LCM Extract', gcflcmInput, `GCF: ${res.gcf} | LCM: ${res.lcm}`);
        }
      } else if (activeTab === 'analysis') {
        if (!analysisInput) {
          setResults(null);
          return;
        }
        if (runValidation(analysisInput, 'analysis')) {
          const funcRes = analyzeFunction(analysisInput);
          const polyRes = analyzePolynomial(analysisInput);
          setResults({ func: funcRes, poly: polyRes });
          addToHistory('Function Analysis', analysisInput, `Degree: ${polyRes.degree} | Domain: ${funcRes.domain}`);
        }
      }
    } catch (err: any) {
      console.error(err);
      setValidationError("Calculation halted: " + err.message);
    }
  }, [
    activeTab, 
    equationInput, 
    systemInput, 
    expressionInput, 
    polyDividend, 
    polyDivisor, 
    inequalityInput, 
    gcflcmInput, 
    analysisInput
  ]);

  // Session history helper
  const addToHistory = (type: string, input: string, output: string) => {
    if (!input || !output) return;
    setHistory(prev => {
      // Avoid duplicate logs right after each other
      if (prev.length > 0 && prev[0].input === input && prev[0].type === type) {
        return prev;
      }
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        type,
        input,
        output
      };
      return [newItem, ...prev.slice(0, 19)]; // Limit to last 20
    });
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistory([]);
  };

  // Re-load calculation from history or duplicate
  const loadHistoryItem = (item: HistoryItem) => {
    if (item.type.includes('Equation')) {
      setActiveTab('equation');
      setEquationInput(item.input);
    } else if (item.type.includes('System')) {
      setActiveTab('system');
      setSystemInput(item.input);
    } else if (item.type.includes('Simplify')) {
      setActiveTab('expression');
      setExpressionInput(item.input);
    } else if (item.type.includes('Division')) {
      const parts = item.input.split('÷');
      setActiveTab('polynomial');
      setPolyDividend(parts[0]?.trim() || '');
      setPolyDivisor(parts[1]?.trim() || '');
    } else if (item.type.includes('Inequality')) {
      setActiveTab('inequality');
      setInequalityInput(item.input);
    } else if (item.type.includes('GCF')) {
      setActiveTab('gcf-lcm');
      setGcflcmInput(item.input);
    } else if (item.type.includes('Analysis')) {
      setActiveTab('analysis');
      setAnalysisInput(item.input);
    }
  };

  // Load Built-in Examples with one click
  const loadExample = (type: string) => {
    setValidationError(null);
    if (type === 'linear') {
      setActiveTab('equation');
      setEquationInput('3x + 4 = 19');
    } else if (type === 'quadratic') {
      setActiveTab('equation');
      setEquationInput('2x^2 + 5x - 3 = 0');
    } else if (type === 'factoring') {
      setActiveTab('expression');
      setExpressionInput('x^2 - 9');
    } else if (type === 'polynomial') {
      setActiveTab('polynomial');
      setPolyDividend('x^3 - 3x^2 + 5x - 3');
      setPolyDivisor('x - 1');
    } else if (type === 'system') {
      setActiveTab('system');
      setSystemInput('x + y = 5\n2x - y = 1');
    } else if (type === 'inequality') {
      setActiveTab('inequality');
      setInequalityInput('x^2 - 4 <= 0');
    }
  };

  // Clear everything helper
  const handleClearAll = () => {
    setEquationInput('');
    setSystemInput('');
    setExpressionInput('');
    setPolyDividend('');
    setPolyDivisor('');
    setInequalityInput('');
    setGcflcmInput('');
    setAnalysisInput('');
    setGraphFunc1('');
    setGraphFunc2('');
    setGraphFunc3('');
    setResults(null);
    setValidationError(null);
    setHoverCoord(null);
    // Reset graph center
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setGraphCenter({ x: canvas.width / 2, y: canvas.height / 2 });
    }
  };

  // Graph rendering loop on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // Clear Canvas with a premium glass/translucent backdrop feel
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#ffffff';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid Lines
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1e1e1e' : '#f0f0f0';
    ctx.lineWidth = 1;

    // Vertical lines
    const startX = Math.floor((0 - graphCenter.x) / graphScale);
    const endX = Math.ceil((width - graphCenter.x) / graphScale);
    for (let x = startX; x <= endX; x++) {
      const sx = graphCenter.x + x * graphScale;
      ctx.beginPath();
      ctx.moveTo(sx, 0);
      ctx.lineTo(sx, height);
      ctx.stroke();

      // Add label numbers
      if (x !== 0 && x % 2 === 0) {
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#525252' : '#a3a3a3';
        ctx.font = '10px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(x.toString(), sx, graphCenter.y + 15);
      }
    }

    // Horizontal lines
    const startY = Math.floor((0 - graphCenter.y) / graphScale);
    const endY = Math.ceil((height - graphCenter.y) / graphScale);
    for (let y = startY; y <= endY; y++) {
      const sy = graphCenter.y - y * graphScale;
      ctx.beginPath();
      ctx.moveTo(0, sy);
      ctx.lineTo(width, sy);
      ctx.stroke();

      // Add label numbers
      if (y !== 0 && y % 2 === 0) {
        ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#525252' : '#a3a3a3';
        ctx.font = '10px monospace';
        ctx.textAlign = 'right';
        ctx.fillText(y.toString(), graphCenter.x - 8, sy + 3);
      }
    }

    // Draw Main Axes
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#404040' : '#d4d4d4';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, graphCenter.y);
    ctx.lineTo(width, graphCenter.y);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(graphCenter.x, 0);
    ctx.lineTo(graphCenter.x, height);
    ctx.stroke();

    // Axis Arrows & Titles
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#a3a3a3' : '#737373';
    ctx.font = 'bold 11px monospace';
    ctx.fillText('X', width - 15, graphCenter.y - 8);
    ctx.fillText('Y', graphCenter.x + 8, 15);

    // Render curves
    const functionsToPlot = [
      { expr: graphFunc1, color: '#3b82f6' }, // Premium blue
      { expr: graphFunc2, color: '#10b981' }, // Emerald green
      { expr: graphFunc3, color: '#ec4899' }  // Pink accent
    ].filter(f => f.expr.trim() !== '');

    // If active tab is Analysis or Equation, automatically overlay the main input as the first curve!
    if (functionsToPlot.length === 0) {
      if (activeTab === 'analysis' && analysisInput) {
        functionsToPlot.push({ expr: analysisInput, color: '#06b6d4' }); // Cyan
      } else if (activeTab === 'equation' && equationInput) {
        const parts = equationInput.split('=');
        if (parts[0]) {
          functionsToPlot.push({ expr: parts[0], color: '#3b82f6' });
        }
      } else if (activeTab === 'inequality' && inequalityInput) {
        const parts = inequalityInput.split(/[<=>!]+/);
        if (parts[0]) {
          functionsToPlot.push({ expr: parts[0], color: '#f59e0b' }); // Amber
        }
      }
    }

    functionsToPlot.forEach((func, idx) => {
      try {
        const poly = parsePolynomial(func.expr);
        if (poly.length === 0) return;

        ctx.strokeStyle = func.color;
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        let first = true;
        for (let sx = 0; sx < width; sx++) {
          const mx = (sx - graphCenter.x) / graphScale;
          const my = evalPolyAt(poly, mx);
          const sy = graphCenter.y - my * graphScale;

          if (sy >= 0 && sy <= height) {
            if (first) {
              ctx.moveTo(sx, sy);
              first = false;
            } else {
              ctx.lineTo(sx, sy);
            }
          } else {
            first = true; // Break line segment if values overflow canvas bounds
          }
        }
        ctx.stroke();

        // Overlay roots and critical intercept markers as dots
        const roots = solvePolynomialNumerical(poly);
        roots.forEach(rx => {
          const sx = graphCenter.x + rx * graphScale;
          const sy = graphCenter.y;
          if (sx >= 0 && sx <= width) {
            ctx.fillStyle = '#ef4444'; // Red root marker
            ctx.beginPath();
            ctx.arc(sx, sy, 5, 0, 2 * Math.PI);
            ctx.fill();
            
            ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000';
            ctx.font = '9px monospace';
            ctx.fillText(`(${rx.toFixed(2)},0)`, sx - 15, sy - 10);
          }
        });

        // Y intercept
        const yInt = evalPolyAt(poly, 0);
        const syInt = graphCenter.y - yInt * graphScale;
        if (syInt >= 0 && syInt <= height) {
          ctx.fillStyle = '#f59e0b'; // Amber Y-intercept
          ctx.beginPath();
          ctx.arc(graphCenter.x, syInt, 5, 0, 2 * Math.PI);
          ctx.fill();
          
          ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#ffffff' : '#000000';
          ctx.font = '9px monospace';
          ctx.fillText(`(0,${yInt.toFixed(1)})`, graphCenter.x + 8, syInt - 5);
        }

      } catch (err) {
        // Suppress plotting errors silently
      }
    });

  }, [graphScale, graphCenter, graphFunc1, graphFunc2, graphFunc3, activeTab, equationInput, analysisInput, inequalityInput]);

  // Handle Graph Zoom In / Out
  const zoomGraph = (zoomIn: boolean) => {
    setGraphScale(prev => {
      const next = zoomIn ? prev * 1.2 : prev / 1.2;
      return Math.min(150, Math.max(10, next));
    });
  };

  // Drag listeners to pan the coordinate plane
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDragging(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setDragStart({
      x: e.clientX - rect.left - graphCenter.x,
      y: e.clientY - rect.top - graphCenter.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging) {
      setGraphCenter({
        x: x - dragStart.x,
        y: y - dragStart.y
      });
    }

    // Hover Coordinate Tracker
    const mx = (x - graphCenter.x) / graphScale;
    const my = (graphCenter.y - y) / graphScale;
    setHoverCoord({ x, y, mx, my });
  };

  const handleMouseUpOrLeave = () => {
    setIsDragging(false);
  };

  // Export Results Actions
  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const downloadPng = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const image = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'calculatoora-algebra-graph.png';
    link.href = image;
    link.click();
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" id="algebra-calculator-root">
      
      {/* Title & Badge */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/10 bg-blue-500/5 dark:border-cyan-400/10 dark:bg-cyan-500/5 mb-4 select-none">
          <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          <span className="text-xs font-black uppercase tracking-widest text-blue-700 dark:text-cyan-400">
            Ultimate Math Engine
          </span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-neutral-900 dark:text-white font-sans mb-3">
          Algebra Calculator
        </h1>
        <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto font-sans">
          The world's most advanced, fully browser-contained algebraic engine. Solve systems, division, quadratic equations, inequalities, analyze functions, and plot real-time curves instantly.
        </p>
      </div>

      {/* Built-in Load Examples Panel */}
      <div className="mb-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button 
          onClick={() => loadExample('linear')} 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-blue-500/30 dark:hover:border-cyan-400/30 transition text-xs font-extrabold text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <TrendingUp className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
          Linear Eq
        </button>
        <button 
          onClick={() => loadExample('quadratic')} 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-blue-500/30 dark:hover:border-cyan-400/30 transition text-xs font-extrabold text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <Sliders className="w-4 h-4 text-emerald-500" />
          Quadratic Eq
        </button>
        <button 
          onClick={() => loadExample('factoring')} 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-blue-500/30 dark:hover:border-cyan-400/30 transition text-xs font-extrabold text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-pink-500" />
          Factoring
        </button>
        <button 
          onClick={() => loadExample('polynomial')} 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-blue-500/30 dark:hover:border-cyan-400/30 transition text-xs font-extrabold text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <Activity className="w-4 h-4 text-purple-500" />
          Polynomial Div
        </button>
        <button 
          onClick={() => loadExample('system')} 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-blue-500/30 dark:hover:border-cyan-400/30 transition text-xs font-extrabold text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <Grid className="w-4 h-4 text-cyan-500" />
          System of Eq
        </button>
        <button 
          onClick={() => loadExample('inequality')} 
          className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 hover:bg-neutral-50 dark:hover:bg-neutral-800/80 hover:border-blue-500/30 dark:hover:border-cyan-400/30 transition text-xs font-extrabold text-neutral-700 dark:text-neutral-300 shadow-sm"
        >
          <Sliders className="w-4 h-4 text-yellow-500" />
          Inequalities
        </button>
      </div>

      {/* Primary Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Interactive Tool Column (7/12) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Glassmorphic Tabs Container */}
          <div className="w-full flex flex-wrap gap-1.5 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-950/40 backdrop-blur-md">
            {[
              { id: 'equation', label: 'Equations' },
              { id: 'system', label: 'Systems' },
              { id: 'expression', label: 'Simplify' },
              { id: 'polynomial', label: 'Divisions' },
              { id: 'inequality', label: 'Inequalities' },
              { id: 'gcf-lcm', label: 'GCF/LCM' },
              { id: 'analysis', label: 'Analysis' },
              { id: 'graphing', label: 'Plotter' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setValidationError(null); }}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-sm border border-neutral-200/50 dark:border-neutral-800/50' 
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Interactive Calculator Inputs Block */}
          <div className="p-6 rounded-[24px] border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/60 shadow-lg backdrop-blur-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 dark:bg-cyan-500/5 rounded-bl-[100px] pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-neutral-900 dark:text-white uppercase tracking-wider select-none flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                Inputs Panel
              </h2>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleClearAll} 
                  className="flex items-center gap-1 py-1.5 px-3 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/60 text-[11px] font-bold text-neutral-600 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 transition"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear All
                </button>
              </div>
            </div>

            {/* Error Message banner */}
            <AnimatePresence>
              {validationError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 flex items-center gap-2.5 p-3.5 rounded-xl border border-red-500/10 bg-red-500/5 text-xs text-red-600 dark:text-red-400 font-medium"
                >
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{validationError}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Input Controls - Starts EMPTY, placeholders only as requested */}
            <div>
              {activeTab === 'equation' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                    Enter Equation
                  </label>
                  <input
                    type="text"
                    value={equationInput}
                    onChange={(e) => setEquationInput(e.target.value)}
                    placeholder="e.g. 2x² + 5x - 3 = 0"
                    className="w-full py-3.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-base transition"
                  />
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 italic">
                    Type a first, second, or third-degree polynomial equated to zero or another constant.
                  </p>
                </div>
              )}

              {activeTab === 'system' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                    Enter Systems of Equations (One per line)
                  </label>
                  <textarea
                    value={systemInput}
                    onChange={(e) => setSystemInput(e.target.value)}
                    placeholder="e.g. 2x + y = 10&#10;x - y = 2"
                    rows={3}
                    className="w-full py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-base transition"
                  />
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 italic">
                    Support systems of linear equations with 2, 3, or 4 variables (x, y, z, w).
                  </p>
                </div>
              )}

              {activeTab === 'expression' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                    Enter Expression to Simplify / Factor
                  </label>
                  <input
                    type="text"
                    value={expressionInput}
                    onChange={(e) => setExpressionInput(e.target.value)}
                    placeholder="e.g. (x+4)(x-7)"
                    className="w-full py-3.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-base transition"
                  />
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 italic">
                    Performs client-side polynomial expansion, like term gathering, and basic factoring trees.
                  </p>
                </div>
              )}

              {activeTab === 'polynomial' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                      Dividend (Numerator)
                    </label>
                    <input
                      type="text"
                      value={polyDividend}
                      onChange={(e) => setPolyDividend(e.target.value)}
                      placeholder="e.g. x^3 - 3x^2 + 5x - 3"
                      className="w-full py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-sm transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                      Divisor (Denominator)
                    </label>
                    <input
                      type="text"
                      value={polyDivisor}
                      onChange={(e) => setPolyDivisor(e.target.value)}
                      placeholder="e.g. x - 1"
                      className="w-full py-3 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-sm transition"
                    />
                  </div>
                </div>
              )}

              {activeTab === 'inequality' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                    Enter Inequality
                  </label>
                  <input
                    type="text"
                    value={inequalityInput}
                    onChange={(e) => setInequalityInput(e.target.value)}
                    placeholder="e.g. 3x + 4 > 19"
                    className="w-full py-3.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-base transition"
                  />
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 italic">
                    Support Linear and Quadratic inequalities (using signs &lt;, &gt;, &lt;=, &gt;=).
                  </p>
                </div>
              )}

              {activeTab === 'gcf-lcm' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                    Enter Algebraic Terms (separated by commas)
                  </label>
                  <input
                    type="text"
                    value={gcflcmInput}
                    onChange={(e) => setGcflcmInput(e.target.value)}
                    placeholder="e.g. 12x^2y, 18xy^3, 24x^3"
                    className="w-full py-3.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-base transition"
                  />
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 italic">
                    Extracts greatest common divisor and least common multiplier of algebraic monomial chains.
                  </p>
                </div>
              )}

              {activeTab === 'analysis' && (
                <div className="space-y-1">
                  <label className="text-[11px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-1 block">
                    Function Expression to Analyze
                  </label>
                  <input
                    type="text"
                    value={analysisInput}
                    onChange={(e) => setAnalysisInput(e.target.value)}
                    placeholder="e.g. 2x^2 + 5x - 3"
                    className="w-full py-3.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:ring-cyan-400/20 dark:focus:border-cyan-400 font-mono text-base transition"
                  />
                  <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 italic">
                    Generates properties like Degree, Domain, Range, Intercepts, Symmetry, Turning Points, and End Behavior.
                  </p>
                </div>
              )}

              {activeTab === 'graphing' && (
                <div className="space-y-4">
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    Add up to three different algebraic functions of x to plot on the interactive cartesian plane.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs font-extrabold text-blue-500">f₁(x) =</span>
                      <input
                        type="text"
                        value={graphFunc1}
                        onChange={(e) => setGraphFunc1(e.target.value)}
                        placeholder="e.g. 2x^2 + 5x - 3"
                        className="w-full py-2.5 pl-16 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 font-mono text-sm transition"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs font-extrabold text-emerald-500">f₂(x) =</span>
                      <input
                        type="text"
                        value={graphFunc2}
                        onChange={(e) => setGraphFunc2(e.target.value)}
                        placeholder="e.g. x + 3"
                        className="w-full py-2.5 pl-16 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 font-mono text-sm transition"
                      />
                    </div>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3.5 text-xs font-extrabold text-pink-500">f₃(x) =</span>
                      <input
                        type="text"
                        value={graphFunc3}
                        onChange={(e) => setGraphFunc3(e.target.value)}
                        placeholder="e.g. 1/x"
                        className="w-full py-2.5 pl-16 pr-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 text-neutral-900 dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-pink-500/10 focus:border-pink-500 font-mono text-sm transition"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Real-time Result Output and Collapsible Step-by-Step Breakdown */}
          {results && (
            <div className="space-y-6">
              
              {/* Dynamic Results Card */}
              <div className="p-6 rounded-[24px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/60 shadow-lg relative">
                
                {/* Header with Export Panel */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-100 dark:border-neutral-800">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider select-none flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Computation Outcomes
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => handleCopy(JSON.stringify(results, null, 2))}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400"
                      title="Copy result string"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button 
                      onClick={handlePrint}
                      className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/40 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition text-neutral-500 dark:text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400"
                      title="Print outcomes"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Outputs based on selected operation */}
                <div className="space-y-4">
                  
                  {/* Equation Solver Solutions */}
                  {activeTab === 'equation' && results.solutions && (
                    <div>
                      <h4 className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">
                        Calculated Roots (f(x) = 0)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {results.solutions.map((sol: any, idx: number) => (
                          <div key={idx} className="p-3 rounded-xl border border-blue-500/15 bg-blue-500/[0.02] dark:border-cyan-500/15 dark:bg-cyan-500/[0.02] flex flex-col">
                            <span className="text-xs text-blue-600 dark:text-cyan-400 font-extrabold mb-1">
                              Root x_{idx + 1}
                            </span>
                            <span className="font-mono text-base font-bold text-neutral-900 dark:text-white">
                              {sol.exact}
                            </span>
                            {sol.decimal !== null && (
                              <span className="text-xs text-neutral-400 dark:text-neutral-500 font-medium font-mono mt-1">
                                Decimal: ~{sol.decimal.toFixed(4)}
                              </span>
                            )}
                          </div>
                        ))}
                        {results.solutions.length === 0 && (
                          <div className="col-span-2 p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-center text-xs text-red-500">
                            No real or complex solutions found.
                          </div>
                        )}
                      </div>

                      {/* Smart Insights for Equation */}
                      {results.insights && results.insights.length > 0 && (
                        <div className="mt-4 p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-800/50">
                          <span className="text-xs font-black uppercase text-blue-600 dark:text-cyan-400 tracking-wider flex items-center gap-1.5 mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Smart Algebra Insights
                          </span>
                          <ul className="space-y-1">
                            {results.insights.map((ins: string, idx: number) => (
                              <li key={idx} className="text-xs text-neutral-600 dark:text-neutral-400 list-disc list-inside">
                                {ins}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  {/* System of Equations Results */}
                  {activeTab === 'system' && (
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`w-2.5 h-2.5 rounded-full ${results.solved ? 'bg-emerald-500' : 'bg-red-500'}`} />
                        <h4 className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
                          System Status: {results.status === 'unique' ? 'Solved Successfully' : results.status === 'infinite' ? 'Infinite Solutions' : 'No Solution'}
                        </h4>
                      </div>

                      {results.solved ? (
                        <div className="grid grid-cols-2 gap-3">
                          {Object.entries(results.solutions).map(([variable, val]: any) => (
                            <div key={variable} className="p-3.5 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] dark:border-emerald-500/15 flex items-center justify-between">
                              <span className="font-mono text-sm font-extrabold text-emerald-600 dark:text-emerald-400">
                                {variable} =
                              </span>
                              <span className="font-mono text-base font-black text-neutral-900 dark:text-white">
                                {val.exact}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 rounded-xl border border-red-500/15 bg-red-500/5 text-center text-xs font-medium text-red-500">
                          {results.status === 'infinite' 
                            ? 'The system of linear equations is dependent and possesses infinite parametric solutions.' 
                            : 'The equations in this system are inconsistent. No matching variables exist.'}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expression Simplifier Output */}
                  {activeTab === 'expression' && (
                    <div className="space-y-4">
                      <div>
                        <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                          Simplified Polynomial
                        </span>
                        <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 font-mono text-lg font-black text-blue-600 dark:text-cyan-400">
                          {results.simplified}
                        </div>
                      </div>

                      {/* Factorization Tree Placeholder */}
                      <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-200/50 dark:border-neutral-800/50">
                        <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-2">
                          Interactive Factor Tree Diagram
                        </span>
                        <svg className="w-full h-24" viewBox="0 0 400 100">
                          <g stroke="#3b82f6" strokeWidth="1.5">
                            <line x1="200" y1="20" x2="130" y2="70" />
                            <line x1="200" y1="20" x2="270" y2="70" />
                          </g>
                          <circle cx="200" cy="20" r="14" fill="#3b82f6" />
                          <text x="200" y="24" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Expr</text>
                          
                          <circle cx="130" cy="70" r="14" fill="#ec4899" />
                          <text x="130" y="74" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Factor1</text>
                          
                          <circle cx="270" cy="70" r="14" fill="#10b981" />
                          <text x="270" y="74" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">Factor2</text>
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Polynomial Division Outlines */}
                  {activeTab === 'polynomial' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                            Quotient f(x)
                          </span>
                          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 font-mono text-base font-bold text-blue-600 dark:text-cyan-400">
                            {stringifyPolynomial(results.quotient)}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                            Remainder r(x)
                          </span>
                          <div className="p-3.5 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 font-mono text-base font-bold text-neutral-600 dark:text-neutral-400">
                            {stringifyPolynomial(results.remainder)}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inequality Solved States */}
                  {activeTab === 'inequality' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                            Variable Solutions
                          </span>
                          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 font-mono text-base font-black text-blue-600 dark:text-cyan-400">
                            {results.solution}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                            Interval Notation
                          </span>
                          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800 font-mono text-base font-black text-emerald-600 dark:text-emerald-400">
                            {results.interval}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GCF / LCM Values */}
                  {activeTab === 'gcf-lcm' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl border border-blue-500/10 bg-blue-500/[0.01] dark:border-cyan-500/10">
                        <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                          Greatest Common Factor (GCF)
                        </span>
                        <span className="font-mono text-xl font-black text-blue-600 dark:text-cyan-400">
                          {results.gcf}
                        </span>
                      </div>
                      <div className="p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.01] dark:border-emerald-500/15">
                        <span className="text-xs font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block mb-1">
                          Least Common Multiple (LCM)
                        </span>
                        <span className="font-mono text-xl font-black text-emerald-600 dark:text-emerald-500">
                          {results.lcm}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Function & Polynomial Analyzer Outputs */}
                  {activeTab === 'analysis' && results.func && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="p-3 border border-neutral-200/70 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">Domain</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{results.func.domain}</span>
                        </div>
                        <div className="p-3 border border-neutral-200/70 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">Range</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{results.func.range}</span>
                        </div>
                        <div className="p-3 border border-neutral-200/70 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">Y-Intercept</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">(0, {results.func.intercepts.y})</span>
                        </div>
                        <div className="p-3 border border-neutral-200/70 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">Symmetry</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{results.func.symmetry}</span>
                        </div>
                        <div className="p-3 border border-neutral-200/70 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">Polynomial Degree</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{results.poly.degree}</span>
                        </div>
                        <div className="p-3 border border-neutral-200/70 dark:border-neutral-800 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/20">
                          <span className="text-[10px] font-black uppercase text-neutral-400 dark:text-neutral-500 tracking-wider block">Max Turning Points</span>
                          <span className="font-mono font-bold text-neutral-900 dark:text-white text-sm">{results.poly.degree > 0 ? results.poly.degree - 1 : 0}</span>
                        </div>
                      </div>

                      {/* Complex Root Plane Plotter (2D Complex Coordinate Plane) */}
                      <div className="p-4 rounded-xl border border-neutral-200/60 dark:border-neutral-800/60 bg-neutral-50/50 dark:bg-neutral-900/20">
                        <span className="text-xs font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block mb-2">
                          Polynomial Root Coordinate plane (Re, Im)
                        </span>
                        <div className="flex justify-center">
                          <svg className="w-56 h-56 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-neutral-50 dark:bg-neutral-950" viewBox="0 0 200 200">
                            {/* Horizontal Re-Axis */}
                            <line x1="0" y1="100" x2="200" y2="100" stroke="#737373" strokeWidth="1" />
                            {/* Vertical Im-Axis */}
                            <line x1="100" y1="0" x2="100" y2="200" stroke="#737373" strokeWidth="1" />
                            <text x="185" y="112" fill="#737373" fontSize="8" fontWeight="bold">Re</text>
                            <text x="105" y="15" fill="#737373" fontSize="8" fontWeight="bold">Im</text>

                            {/* Render roots */}
                            {results.func.roots.map((rVal: number, idx: number) => {
                              // Center of plane is (100, 100). Multiply values to plot clearly
                              const plotX = 100 + rVal * 15;
                              const plotY = 100;
                              if (plotX >= 5 && plotX <= 195) {
                                return (
                                  <g key={idx}>
                                    <circle cx={plotX} cy={plotY} r="4.5" fill="#ef4444" />
                                    <text x={plotX} y={plotY - 7} textAnchor="middle" fill="#ef4444" fontSize="8" fontWeight="bold">
                                      {rVal.toFixed(1)}
                                    </text>
                                  </g>
                                );
                              }
                              return null;
                            })}
                          </svg>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Collapsible Step-By-Step Mathematical Solutions */}
              {results.steps && results.steps.length > 0 && (
                <div className="p-6 rounded-[24px] border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/60 shadow-lg backdrop-blur-xl">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                    Detailed Step-By-Step Solutions
                  </h3>
                  
                  <div className="space-y-3">
                    {results.steps.map((step: any, index: number) => {
                      const isExpanded = expandedSteps[step.title] !== false; // Default true (expanded)
                      return (
                        <div key={index} className="border border-neutral-100 dark:border-neutral-800/80 rounded-xl overflow-hidden shadow-sm">
                          <button 
                            onClick={() => toggleStep(step.title)}
                            className="w-full flex items-center justify-between p-3.5 bg-neutral-50/50 dark:bg-neutral-900/20 text-left font-bold text-xs sm:text-sm text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100/50 dark:hover:bg-neutral-900/50 transition"
                          >
                            <span>{step.title}</span>
                            <span className="text-xs text-blue-500 font-extrabold select-none">
                              {isExpanded ? 'Collapse ▲' : 'Expand ▼'}
                            </span>
                          </button>
                          
                          {isExpanded && (
                            <div className="p-4 bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-800/80 space-y-3">
                              <div className="p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900 font-mono text-sm font-extrabold text-blue-600 dark:text-cyan-400 overflow-x-auto">
                                {step.expression}
                              </div>
                              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                                {step.explanation}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Right Columns: Interactive Graph & History Log (5/12) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Interactive Graphing Canvas (Grapher) */}
          <div className="p-6 rounded-[24px] border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/60 shadow-lg backdrop-blur-xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 select-none">
                <Grid className="w-4 h-4 text-blue-600 dark:text-cyan-400" />
                Cartesian Plane
              </h3>
              <div className="flex items-center gap-1.5">
                <button 
                  onClick={() => zoomGraph(true)} 
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
                  title="Zoom In"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => zoomGraph(false)} 
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
                  title="Zoom Out"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={downloadPng} 
                  className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-neutral-600 dark:text-neutral-300"
                  title="Download Graph Plot"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Actual HTML Canvas element */}
            <div className="relative border border-neutral-200 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-900">
              <canvas
                ref={canvasRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
                className="w-full h-80 block cursor-grab active:cursor-grabbing"
              />

              {/* Floating coordinate readout */}
              {hoverCoord && (
                <div className="absolute bottom-3 left-3 px-2 py-1 bg-black/80 dark:bg-neutral-950/90 text-[10px] text-neutral-200 rounded font-mono shadow border border-white/10 pointer-events-none select-none">
                  X: {hoverCoord.mx.toFixed(2)} | Y: {hoverCoord.my.toFixed(2)}
                </div>
              )}
            </div>

            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-2 text-center select-none">
              💡 Tip: Click and drag on the coordinate plane to pan, and use the zoom controls.
            </p>
          </div>

          {/* Current session history log panel */}
          <div className="p-6 rounded-[24px] border border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-neutral-950/60 shadow-lg backdrop-blur-xl relative">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2 select-none">
                <History className="w-4 h-4 text-neutral-500" />
                Session History
              </h3>
              {history.length > 0 && (
                <button 
                  onClick={clearAllHistory} 
                  className="text-[10px] font-bold text-red-500 hover:underline cursor-pointer"
                >
                  Clear All
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto space-y-3 pr-1">
              {history.map((item) => (
                <div 
                  key={item.id}
                  onClick={() => loadHistoryItem(item)}
                  className="p-3 rounded-xl border border-neutral-100 dark:border-neutral-800 hover:border-blue-500/20 dark:hover:border-cyan-400/20 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/30 cursor-pointer transition flex items-start justify-between"
                >
                  <div className="space-y-1 font-mono text-[11px] max-w-[80%]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400">
                        {item.type}
                      </span>
                      <span className="text-[9px] text-neutral-400">
                        {item.timestamp}
                      </span>
                    </div>
                    <p className="font-extrabold text-neutral-800 dark:text-neutral-200 truncate">
                      {item.input}
                    </p>
                    <p className="text-neutral-400 dark:text-neutral-500 truncate">
                      ➔ {item.output}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => deleteHistoryItem(item.id, e)}
                    className="p-1 rounded text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}

              {history.length === 0 && (
                <div className="py-8 text-center text-xs text-neutral-400 dark:text-neutral-500 select-none">
                  Your calculations will populate here as you type.
                </div>
              )}
            </div>
          </div>

        </div>

      </div>

      {/* COMPREHENSIVE SEO EDUCATIONAL MATERIAL SECTION */}
      <section className="mt-16 pt-10 border-t border-neutral-200 dark:border-neutral-800/60" id="seo-educational-content">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="text-center">
            <h2 className="text-3xl font-black text-neutral-900 dark:text-white uppercase tracking-wide font-sans mb-3">
              Mastering Algebraic Calculations
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Your comprehensive scientific guide to expressions, equations, systems, inequalities, and functions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                What Is Algebra?
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Algebra is a fundamental branch of mathematics that substitutes letters for numbers to solve for unknown variables. It generalizes arithmetic principles by introducing variables (commonly <strong>x</strong> and <strong>y</strong>) to formulate structures, equations, and functions.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                How to Solve Algebraic Equations
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                To solve a single-variable equation like <span className="font-mono">ax + b = c</span>, apply symmetric inverse operations to isolate the target variable. Subtract constants from both sides, then divide by coefficients to find the exact value of the variable.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                How to Simplify Expressions
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Simplification relies on collecting like terms (constants or variable exponents that share the exact same powers) and summing their coefficients together. For example, <span className="font-mono">3x^2 + 5x - x^2</span> simplifies neatly into <span className="font-mono">2x^2 + 5x</span>.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                Factoring Polynomials & Quadratic Formula
              </h3>
              <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
                Factoring decomposes complex multi-term expressions into multiplying linear factors. If direct factoring of quadratic expression <span className="font-mono">ax^2+bx+c</span> isn't intuitive, apply the Quadratic Formula: <span className="font-mono">x = (-b ± √(b^2 - 4ac)) / 2a</span>.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200 dark:border-neutral-800">
            <h3 className="text-sm font-black uppercase text-neutral-900 dark:text-white mb-4 tracking-wider flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-500" />
              Frequently Asked Questions (FAQ)
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-black text-neutral-700 dark:text-neutral-300 mb-1">
                  Q: What are the possible cases when solving systems of equations?
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  A system can yield a unique solution (lines intersect at a single point), infinite solutions (lines are identical/coincident), or no solution (lines are perfectly parallel and never cross).
                </p>
              </div>
              <hr className="border-neutral-200/50 dark:border-neutral-800" />
              <div>
                <h4 className="text-xs font-black text-neutral-700 dark:text-neutral-300 mb-1">
                  Q: Why does the inequality operator flip when dividing by a negative number?
                </h4>
                <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                  Multiplying or dividing an inequality by a negative value reverses the relative sizes of the quantities. For example, since -2 &lt; 5, multiplying by -1 yields 2 &gt; -5.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Glossary of Algebra Terms
            </h3>
            <div className="grid grid-cols-2 gap-4 text-[11px] text-neutral-600 dark:text-neutral-400">
              <div>
                <strong className="text-neutral-800 dark:text-neutral-200 block">Polynomial</strong>
                An expression consisting of variables and coefficients, that involves only the operations of addition, subtraction, multiplication, and non-negative integer exponents.
              </div>
              <div>
                <strong className="text-neutral-800 dark:text-neutral-200 block">Discriminant</strong>
                The term <span className="font-mono">b^2 - 4ac</span> under the quadratic radical indicating the nature of the equation's roots.
              </div>
              <div>
                <strong className="text-neutral-800 dark:text-neutral-200 block">Interval Notation</strong>
                A mathematical convention to express coordinate domain constraints (e.g., brackets for inclusive bounds, parenthesis for open borders).
              </div>
              <div>
                <strong className="text-neutral-800 dark:text-neutral-200 block">GCF (Greatest Common Factor)</strong>
                The largest algebraic factor that divides evenly into two or more distinct monomial terms.
              </div>
            </div>
          </div>

          {/* Related Calculators Links Grid */}
          <div className="pt-6 border-t border-neutral-200/60 dark:border-neutral-800/60 text-center space-y-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Related Mathematical Calculators
            </h4>
            <div className="flex flex-wrap justify-center gap-2 text-[10px] font-bold text-blue-600 dark:text-cyan-400">
              {[
                'Graphing Calculator',
                'Scientific Calculator',
                'Quadratic Formula Calculator',
                'Polynomial Calculator',
                'Factoring Calculator',
                'Equation Solver',
                'Linear Equation Calculator',
                'Matrix Calculator',
                'Derivative Calculator',
                'Integral Calculator'
              ].map((calc, idx) => (
                <span key={idx} className="px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 select-none">
                  {calc}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
