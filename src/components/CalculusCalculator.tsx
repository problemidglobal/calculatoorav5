import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  RefreshCw, 
  Copy, 
  Download, 
  Trash2, 
  History as HistoryIcon, 
  Sparkles, 
  BookOpen, 
  Plus, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Info, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  Printer, 
  Check, 
  AlertCircle,
  TrendingUp,
  HelpCircle,
  Layers,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import {
  safeEvaluate,
  getSymbolicDerivative,
  getDerivativeSteps,
  getNumericalDerivative,
  getNumericalLimit,
  getNumericalIntegral,
  getSymbolicIndefiniteIntegral,
  solveBisection,
  solveNewtonRaphson,
  getCriticalAndInflectionPoints,
  getTaylorSeries,
  getOdeSolver,
  getOdeDirectionField,
  analyzeSequenceAndSeries
} from '../utils/calculusMath';

interface HistoryItem {
  id: string;
  timestamp: string;
  operation: string;
  inputs: Record<string, string>;
  result: string;
}

export default function CalculusCalculator({ onNavigate }: { onNavigate?: (view: string) => void }) {
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'solver' | 'comparison' | 'ode' | 'sequences' | 'guide'>('solver');
  
  // Selected Operation
  const [operation, setOperation] = useState<string>('derivative');
  
  // Dynamic Input States (all start empty as per GLOBAL INPUT RULE)
  const [funcInput, setFuncInput] = useState<string>('');
  const [funcGInput, setFuncGInput] = useState<string>(''); // For area between curves
  const [variableInput, setVariableInput] = useState<string>('');
  const [pointInput, setPointInput] = useState<string>('');
  const [lowerLimitInput, setLowerLimitInput] = useState<string>('');
  const [upperLimitInput, setUpperLimitInput] = useState<string>('');
  const [orderInput, setOrderInput] = useState<string>('');
  const [dirInput, setDirInput] = useState<'both' | 'left' | 'right'>('both');
  const [numMethodInput, setNumMethodInput] = useState<'left' | 'right' | 'midpoint' | 'trapezoidal' | 'simpson'>('simpson');
  const [subdivisionsInput, setSubdivisionsInput] = useState<string>('');
  
  // Parametric / Polar inputs
  const [paramXInput, setParamXInput] = useState<string>('');
  const [paramYInput, setParamYInput] = useState<string>('');
  const [polarRInput, setPolarRInput] = useState<string>('');
  const [boundMinInput, setBoundMinInput] = useState<string>('');
  const [boundMaxInput, setBoundMaxInput] = useState<string>('');

  // ODE inputs
  const [odeDyDx, setOdeDyDx] = useState<string>('');
  const [odeXVar, setOdeXVar] = useState<string>('');
  const [odeYVar, setOdeYVar] = useState<string>('');
  const [odeX0, setOdeX0] = useState<string>('');
  const [odeY0, setOdeY0] = useState<string>('');
  const [odeXEnd, setOdeXEnd] = useState<string>('');
  const [odeMethod, setOdeMethod] = useState<'euler' | 'rk4'>('rk4');

  // Related Rates dynamic scenario
  const [relatedRatesScenario, setRelatedRatesScenario] = useState<string>('circle-area');
  const [relatedInputRate, setRelatedInputRate] = useState<string>('');
  const [relatedInputVar, setRelatedInputVar] = useState<string>('');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copied, setCopied] = useState<boolean>(false);
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({ 0: true, 1: true });
  const [graphZoom, setGraphZoom] = useState<number>(30); // pixels per unit
  const [graphPan, setGraphPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isGraphFullscreen, setIsGraphFullscreen] = useState<boolean>(false);
  const [hoveredCoord, setHoveredCoord] = useState<{ x: number; y: number } | null>(null);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const graphContainerRef = useRef<HTMLDivElement | null>(null);

  // --- PRESETS & EXAMPLES ---
  const EXAMPLES = [
    {
      name: 'Basic Derivative (Power Rule)',
      op: 'derivative',
      fields: { func: 'x^3 - 3x^2 + 2x - 5', val: 'x' }
    },
    {
      name: 'Definite Integral (Sine Wave)',
      op: 'definite-integral',
      fields: { func: 'sin(x)', val: 'x', lower: '0', upper: 'pi', subdivisions: '60', numMethod: 'simpson' }
    },
    {
      name: 'Taylor Approximation (Cos Series)',
      op: 'taylor-series',
      fields: { func: 'cos(x)', val: 'x', pt: '0', order: '6' }
    },
    {
      name: 'Tangent Line Solver',
      op: 'tangent-line',
      fields: { func: 'x^2 - 4x + 4', val: 'x', pt: '3' }
    },
    {
      name: 'Bisection Method Root Finding',
      op: 'numerical-integration', // Also handles numerical solvers
      fields: { func: 'x^2 - 2', val: 'x', lower: '1', upper: '2' }
    },
    {
      name: 'First-Order ODE (Direction Field)',
      op: 'ode',
      fields: { odeDyDx: 'y - x', odeXVar: 'x', odeYVar: 'y', odeX0: '0', odeY0: '1', odeXEnd: '3' }
    }
  ];

  // Load Example Callback
  const handleLoadExample = (ex: typeof EXAMPLES[0]) => {
    // Reset everything first
    handleClearAll();
    
    setOperation(ex.op);
    if (ex.fields.func) setFuncInput(ex.fields.func);
    if (ex.fields.val) setVariableInput(ex.fields.val);
    if (ex.fields.pt) setPointInput(ex.fields.pt);
    if (ex.fields.lower) setLowerLimitInput(ex.fields.lower);
    if (ex.fields.upper) setUpperLimitInput(ex.fields.upper);
    if (ex.fields.subdivisions) setSubdivisionsInput(ex.fields.subdivisions);
    if (ex.fields.numMethod) setNumMethodInput(ex.fields.numMethod as any);
    if (ex.fields.order) setOrderInput(ex.fields.order);
    
    if (ex.op === 'ode') {
      setActiveTab('ode');
      if (ex.fields.odeDyDx) setOdeDyDx(ex.fields.odeDyDx);
      if (ex.fields.odeXVar) setOdeXVar(ex.fields.odeXVar);
      if (ex.fields.odeYVar) setOdeYVar(ex.fields.odeYVar);
      if (ex.fields.odeX0) setOdeX0(ex.fields.odeX0);
      if (ex.fields.odeY0) setOdeY0(ex.fields.odeY0);
      if (ex.fields.odeXEnd) setOdeXEnd(ex.fields.odeXEnd);
    } else {
      setActiveTab('solver');
    }
  };

  // Clear all callback
  const handleClearAll = () => {
    setFuncInput('');
    setFuncGInput('');
    setVariableInput('');
    setPointInput('');
    setLowerLimitInput('');
    setUpperLimitInput('');
    setOrderInput('');
    setSubdivisionsInput('');
    setParamXInput('');
    setParamYInput('');
    setPolarRInput('');
    setBoundMinInput('');
    setBoundMaxInput('');
    setOdeDyDx('');
    setOdeXVar('');
    setOdeYVar('');
    setOdeX0('');
    setOdeY0('');
    setOdeXEnd('');
    setRelatedInputRate('');
    setRelatedInputVar('');
    setErrors({});
  };

  // --- CALCULATE LIVE RESULTS ---
  const getCalculatedOutput = () => {
    const localErrors: Record<string, string> = {};
    
    // Default fallback variables if left empty (but keep empty display)
    const activeVar = variableInput.trim() || 'x';
    const numSubdivisions = parseInt(subdivisionsInput) || 50;
    const taylorCenter = parseFloat(pointInput) || 0;
    const taylorDegree = parseInt(orderInput) || 4;

    const lowerBoundVal = lowerLimitInput.toLowerCase() === 'pi' ? Math.PI : parseFloat(lowerLimitInput);
    const upperBoundVal = upperLimitInput.toLowerCase() === 'pi' ? Math.PI : parseFloat(upperLimitInput);

    // Validate main function
    if (activeTab === 'solver' && !funcInput.trim()) {
      return null; // Empty input means no calculations run yet
    }

    try {
      if (operation === 'derivative') {
        const symDeriv = getSymbolicDerivative(funcInput, activeVar);
        const stepsData = getDerivativeSteps(funcInput, activeVar);
        const pointVal = parseFloat(pointInput);
        let slopeAtPt = NaN;
        if (!isNaN(pointVal)) {
          slopeAtPt = getNumericalDerivative(funcInput, activeVar, pointVal);
        }

        const insights: string[] = [];
        if (!isNaN(slopeAtPt)) {
          if (Math.abs(slopeAtPt) < 1e-4) {
            insights.push(`The derivative is zero at ${activeVar} = ${pointVal}. This represents a stationary/critical point.`);
          } else {
            insights.push(`The slope of the curve at ${activeVar} = ${pointVal} is ${slopeAtPt.toFixed(4)}.`);
          }
        }

        return {
          finalAnswer: symDeriv,
          decimalApprox: isNaN(slopeAtPt) ? null : slopeAtPt.toFixed(6),
          steps: stepsData.steps,
          insights,
          data: { symDeriv, slopeAtPt }
        };
      }

      if (operation === 'partial-derivative') {
        const respectVar = variableInput.trim() || 'x';
        const deriv = getSymbolicDerivative(funcInput, respectVar);
        return {
          finalAnswer: `∂f/∂${respectVar} = ${deriv}`,
          steps: [
            `🎯 Goal: Compute the partial derivative of f(x, y) = ${funcInput} with respect to ${respectVar}.`,
            `🔍 Keep all variables except ${respectVar} constant.`,
            `✅ Computed partial derivative: ${deriv}`
          ],
          insights: [`Successfully parsed multivariate scope client-side.`]
        };
      }

      if (operation === 'higher-derivative') {
        const orderNum = parseInt(orderInput) || 2;
        let currentDeriv = funcInput;
        const stepsList = [`🎯 Goal: Compute high-order derivative (Order ${orderNum}) of ${funcInput}.`];
        
        for (let i = 1; i <= orderNum; i++) {
          currentDeriv = getSymbolicDerivative(currentDeriv, activeVar);
          stepsList.push(`   • Order ${i} derivative: ${currentDeriv}`);
        }
        
        return {
          finalAnswer: `d^${orderNum}y/d${activeVar}^${orderNum} = ${currentDeriv}`,
          steps: stepsList,
          insights: [`Computed order ${orderNum} derivative successfully.`]
        };
      }

      if (operation === 'indefinite-integral') {
        const result = getSymbolicIndefiniteIntegral(funcInput, activeVar);
        return {
          finalAnswer: result.result,
          steps: result.steps,
          insights: [`Constant of integration (C) represented standard real bounds.`]
        };
      }

      if (operation === 'definite-integral' || operation === 'area-under-curve') {
        if (isNaN(lowerBoundVal) || isNaN(upperBoundVal)) return null;
        
        const integralData = getNumericalIntegral(
          funcInput,
          activeVar,
          lowerBoundVal,
          upperBoundVal,
          numSubdivisions,
          numMethodInput
        );

        const insights = [
          integralData.value > 0 
            ? `The integral represents a positive accumulated area under the function.` 
            : `The integral represents a negative net area.`
        ];

        return {
          finalAnswer: integralData.value.toFixed(6),
          steps: integralData.steps,
          insights,
          samplePoints: integralData.samplePoints,
          data: { integralValue: integralData.value }
        };
      }

      if (operation === 'area-between-curves') {
        if (isNaN(lowerBoundVal) || isNaN(upperBoundVal) || !funcGInput.trim()) return null;
        
        // Compute difference function f(x) - g(x)
        const diffExpr = `abs((${funcInput}) - (${funcGInput}))`;
        const integralData = getNumericalIntegral(
          diffExpr,
          activeVar,
          lowerBoundVal,
          upperBoundVal,
          numSubdivisions,
          'simpson'
        );

        return {
          finalAnswer: integralData.value.toFixed(6),
          steps: [
            `🎯 Goal: Compute area between curves f(${activeVar}) = ${funcInput} and g(${activeVar}) = ${funcGInput} on interval [${lowerBoundVal}, ${upperBoundVal}].`,
            `📝 Integration formulation: ∫ |f(${activeVar}) - g(${activeVar})| d${activeVar} from a to b.`,
            `🔄 Executing numerical integration bounds...`,
            `✅ Enclosed shaded area equals exactly ${integralData.value.toFixed(6)}.`
          ],
          insights: [`Calculated absolute delta enclosure safely.`]
        };
      }

      if (operation === 'arc-length') {
        if (isNaN(lowerBoundVal) || isNaN(upperBoundVal)) return null;
        
        const firstDeriv = getSymbolicDerivative(funcInput, activeVar);
        const integrand = `sqrt(1 + (${firstDeriv})^2)`;
        const integralData = getNumericalIntegral(
          integrand,
          activeVar,
          lowerBoundVal,
          upperBoundVal,
          numSubdivisions,
          'simpson'
        );

        return {
          finalAnswer: integralData.value.toFixed(6),
          steps: [
            `🎯 Goal: Compute arc length of curves on [${lowerBoundVal}, ${upperBoundVal}].`,
            `📝 Formula: s = ∫ sqrt(1 + [f'(${activeVar})]^2) d${activeVar}`,
            `🔍 Computed derivative f'(${activeVar}) = ${firstDeriv}`,
            `📝 Assembled integrand: ${integrand}`,
            `✅ Arc length = ${integralData.value.toFixed(6)}`
          ],
          insights: [`Calculated curve length along the manifold.`]
        };
      }

      if (operation === 'limit' || operation === 'one-sided-limit') {
        const targetPt = parseFloat(pointInput);
        if (isNaN(targetPt)) return null;

        const dir = operation === 'one-sided-limit' ? dirInput : 'both';
        const limitRes = getNumericalLimit(funcInput, activeVar, targetPt, dir);

        return {
          finalAnswer: limitRes.limitExists ? limitRes.value.toFixed(6) : 'Does Not Exist (DNE)',
          steps: [
            `🎯 Goal: Evaluate limit of f(${activeVar}) as ${activeVar} approaches ${targetPt} (direction: ${dir}).`,
            limitRes.explanation
          ],
          insights: [limitRes.limitExists ? 'Approach values converge cleanly.' : 'Values oscillatory or diverge to infinity.']
        };
      }

      if (operation === 'taylor-series' || operation === 'maclaurin-series') {
        const center = operation === 'maclaurin-series' ? 0 : taylorCenter;
        const result = getTaylorSeries(funcInput, activeVar, center, taylorDegree);

        return {
          finalAnswer: result.formula,
          steps: [
            `🎯 Goal: Compute Taylor polynomial degree ${taylorDegree} centered at c = ${center}.`,
            `📝 Formula: P_n(x) = Sum ( f^(n)(c) / n! * (x - c)^n )`,
            `✅ Expansion formula LaTeX structure:`,
            result.latex
          ],
          insights: [`Highly accurate near the expansion point.`]
        };
      }

      if (operation === 'tangent-line' || operation === 'normal-line') {
        const pt = parseFloat(pointInput);
        if (isNaN(pt)) return null;

        const f_val = safeEvaluate(funcInput, { [activeVar]: pt });
        const slope = getNumericalDerivative(funcInput, activeVar, pt);

        if (isNaN(f_val) || isNaN(slope)) return null;

        const isTangent = operation === 'tangent-line';
        let lineEquation = '';
        let stepText = '';

        if (isTangent) {
          lineEquation = `${slope.toFixed(3)} * (${activeVar} - ${pt}) + ${f_val.toFixed(3)}`;
          stepText = `📝 Tangent equation point-slope form: y - f(c) = f'(c)(x - c) → y = ${slope.toFixed(3)}(x - ${pt}) + ${f_val.toFixed(3)}`;
        } else {
          const normalSlope = -1 / slope;
          lineEquation = `${normalSlope.toFixed(3)} * (${activeVar} - ${pt}) + ${f_val.toFixed(3)}`;
          stepText = `📝 Normal line slope is negative reciprocal: m_n = -1/f'(c) = ${normalSlope.toFixed(3)}. Equation: y = ${normalSlope.toFixed(3)}(x - ${pt}) + ${f_val.toFixed(3)}`;
        }

        return {
          finalAnswer: lineEquation,
          steps: [
            `🎯 Goal: Construct tangent/normal line solver at ${activeVar} = ${pt}.`,
            `🔍 Evaluate function: f(${pt}) = ${f_val.toFixed(4)}`,
            `🔍 Compute derivative slope: f'(${pt}) = ${slope.toFixed(4)}`,
            stepText
          ],
          insights: [`Constructed linear tangent coordinate space.`]
        };
      }

      if (operation === 'optimization' || operation === 'critical-points') {
        const ptRange: [number, number] = [lowerBoundVal || -5, upperBoundVal || 5];
        const res = getCriticalAndInflectionPoints(funcInput, activeVar, ptRange);

        const ansList = res.critical.map(c => `x=${c.x.toFixed(3)} (${c.type})`);
        
        return {
          finalAnswer: ansList.length > 0 ? ansList.join(', ') : 'No extrema detected in range.',
          steps: [
            `🎯 Goal: Locate critical stationary points in interval [${ptRange[0]}, ${ptRange[1]}].`,
            `📝 Solved using first derivative sign inversion f'(x) = 0.`,
            `✅ Discovered critical spots: ${ansList.join('; ')}`
          ],
          insights: [`Extrema points are highly dependent on domain constraint bounds.`]
        };
      }

      if (operation === 'numerical-integration') {
        // Standard numerical bisection / NR solver or custom solver rules
        const ptRange: [number, number] = [lowerBoundVal || 1, upperBoundVal || 2];
        const res = solveBisection(funcInput, activeVar, ptRange[0], ptRange[1]);
        
        return {
          finalAnswer: `Root x ≈ ${res.root.toFixed(6)}`,
          steps: res.steps,
          insights: [`Secured numerical root isolation on boundaries.`]
        };
      }

    } catch (err: any) {
      return {
        finalAnswer: 'Error in math processing.',
        steps: [`⚠️ Problem: ${err.message || 'Check syntax or divisions by zero'}`],
        insights: ['Check that parenthesized groupings are balanced.']
      };
    }
    return null;
  };

  const calculatedOutput = getCalculatedOutput();

  // --- DRAW COORDINATE CANVAS SYSTEM ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas responsive to dimensions
    const dpr = window.devicePixelRatio || 1;
    const width = canvas.parentElement?.clientWidth || 400;
    const height = 300;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Grid center logic
    const centerX = width / 2 + graphPan.x;
    const centerY = height / 2 + graphPan.y;
    const zoom = graphZoom;

    // Clear Screen
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#0a0a0a' : '#fcfcfc';
    ctx.fillRect(0, 0, width, height);

    // Draw Grid lines
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#262626' : '#e5e5e5';
    ctx.lineWidth = 0.5;

    const step = 1; // unit interval
    const gridSpacing = zoom * step;

    // Horizontal grids
    for (let y = centerY % gridSpacing; y < height; y += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Vertical grids
    for (let x = centerX % gridSpacing; x < width; x += gridSpacing) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw coordinate axes
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#525252' : '#a3a3a3';
    ctx.lineWidth = 1.5;
    
    // X-Axis
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(width, centerY);
    ctx.stroke();

    // Y-Axis
    ctx.beginPath();
    ctx.moveTo(centerX, 0);
    ctx.lineTo(centerX, height);
    ctx.stroke();

    // Draw labels / ticks
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#a3a3a3' : '#525252';
    ctx.font = '9px monospace';
    
    // Numbers on x-axis
    for (let xPos = centerX; xPos < width; xPos += gridSpacing) {
      const val = (xPos - centerX) / zoom;
      if (val !== 0) {
        ctx.fillText(val.toFixed(0), xPos - 3, centerY + 12);
      }
    }
    for (let xPos = centerX - gridSpacing; xPos > 0; xPos -= gridSpacing) {
      const val = (xPos - centerX) / zoom;
      ctx.fillText(val.toFixed(0), xPos - 5, centerY + 12);
    }
    // Numbers on y-axis
    for (let yPos = centerY; yPos < height; yPos += gridSpacing) {
      const val = -(yPos - centerY) / zoom;
      if (val !== 0) {
        ctx.fillText(val.toFixed(0), centerX + 6, yPos + 3);
      }
    }
    for (let yPos = centerY - gridSpacing; yPos > 0; yPos -= gridSpacing) {
      const val = -(yPos - centerY) / zoom;
      ctx.fillText(val.toFixed(0), centerX + 6, yPos + 3);
    }

    // Safe plot Cartesian function curve f(x)
    const activeVar = variableInput.trim() || 'x';
    const hasFunc = funcInput.trim().length > 0;

    const plotFunction = (exprStr: string, color: string, thickness = 2) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = thickness;
      let first = true;

      for (let pixelX = 0; pixelX < width; pixelX++) {
        const cartesianX = (pixelX - centerX) / zoom;
        const cartesianY = safeEvaluate(exprStr, { [activeVar]: cartesianX });

        if (!isNaN(cartesianY) && isFinite(cartesianY)) {
          const pixelY = centerY - cartesianY * zoom;
          if (pixelY >= 0 && pixelY <= height) {
            if (first) {
              ctx.moveTo(pixelX, pixelY);
              first = false;
            } else {
              ctx.lineTo(pixelX, pixelY);
            }
          } else {
            first = true; // Break line continuity on jump
          }
        } else {
          first = true;
        }
      }
      ctx.stroke();
    };

    // Draw shaded area for integrations
    if (
      hasFunc && 
      (operation === 'definite-integral' || operation === 'area-under-curve' || operation === 'area-between-curves')
    ) {
      const lower = parseFloat(lowerLimitInput);
      const upper = parseFloat(upperLimitInput);
      if (!isNaN(lower) && !isNaN(upper)) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.22)'; // Soft blue shadow
        ctx.beginPath();
        
        let started = false;
        const minPixelX = Math.max(0, Math.floor(centerX + lower * zoom));
        const maxPixelX = Math.min(width, Math.floor(centerX + upper * zoom));

        for (let pixelX = minPixelX; pixelX <= maxPixelX; pixelX++) {
          const cartesianX = (pixelX - centerX) / zoom;
          const cartesianY = safeEvaluate(funcInput, { [activeVar]: cartesianX });
          
          if (!isNaN(cartesianY) && isFinite(cartesianY)) {
            const pixelY = centerY - cartesianY * zoom;
            if (!started) {
              ctx.moveTo(pixelX, centerY);
              ctx.lineTo(pixelX, pixelY);
              started = true;
            } else {
              ctx.lineTo(pixelX, pixelY);
            }
          }
        }
        if (started) {
          ctx.lineTo(maxPixelX, centerY);
          ctx.closePath();
          ctx.fill();
        }
      }
    }

    // Plot primary function
    if (hasFunc) {
      plotFunction(funcInput, '#3b82f6', 2.5); // Vibrant blue
    }

    // Plot secondary curve comparison
    if (funcGInput.trim().length > 0) {
      plotFunction(funcGInput, '#10b981', 1.5); // green
    }

    // Plot Taylor series overlay
    if (operation === 'taylor-series' && calculatedOutput && calculatedOutput.finalAnswer) {
      plotFunction(calculatedOutput.finalAnswer, '#e11d48', 1.5); // Rose color for Taylor approximation
    }

    // Draw cursor coordinate indicator
    if (hoveredCoord) {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(hoveredCoord.x, hoveredCoord.y, 4, 0, 2 * Math.PI);
      ctx.fill();

      // Draw coordinates box
      const cartX = (hoveredCoord.x - centerX) / zoom;
      const cartY = -(hoveredCoord.y - centerY) / zoom;

      ctx.fillStyle = 'rgba(0,0,0,0.85)';
      ctx.fillRect(hoveredCoord.x + 8, hoveredCoord.y - 25, 100, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.fillText(`(${cartX.toFixed(2)}, ${cartY.toFixed(2)})`, hoveredCoord.x + 12, hoveredCoord.y - 12);
    }

  }, [graphZoom, graphPan, funcInput, funcGInput, variableInput, pointInput, lowerLimitInput, upperLimitInput, operation, activeTab, hoveredCoord, calculatedOutput]);

  // Handle zooming / panning controls
  const handleZoom = (factor: number) => {
    setGraphZoom(prev => Math.max(5, prev + factor));
  };

  const handlePan = (dx: number, dy: number) => {
    setGraphPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const resetGraph = () => {
    setGraphZoom(30);
    setGraphPan({ x: 0, y: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setHoveredCoord({ x, y });
  };

  const handleMouseLeave = () => {
    setHoveredCoord(null);
  };

  // --- EXPORT PNG GRAPHICS ---
  const handleExportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `calculatoora_calculus_graph.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleCopyResult = () => {
    if (!calculatedOutput) return;
    navigator.clipboard.writeText(calculatedOutput.finalAnswer);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full space-y-10" id="calculus-calculator-container">
      {/* Title & Glowing Banner Hero */}
      <div className="relative rounded-3xl overflow-hidden border border-neutral-200/40 dark:border-neutral-800/60 bg-gradient-to-r from-blue-600/10 via-cyan-500/5 to-transparent p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl space-y-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-cyan-400 font-mono uppercase tracking-widest">
            <Sparkles className="w-3 h-3" /> Suite Version 22 Premium
          </span>
          <h1 className="text-2xl sm:text-4xl font-black text-neutral-950 dark:text-white tracking-tight leading-none">
            Calculus Calculator
          </h1>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed font-medium">
            Solve derivatives, integrals, limits, series approximations, and differential equations in real-time with beautiful interactive graphs and comprehensive educational steps.
          </p>
        </div>
      </div>

      {/* Preset Fast Examples Selector Bar */}
      <div className="bg-white/40 dark:bg-neutral-900/40 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/40 p-4">
        <h4 className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1.5 font-mono">
          <Info className="w-3 h-3" /> Quick Load Calculus Presets
        </h4>
        <div className="flex flex-wrap gap-2">
          {EXAMPLES.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => handleLoadExample(ex)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-neutral-900 hover:bg-blue-500 dark:hover:bg-cyan-500 hover:text-white border border-neutral-200 dark:border-neutral-800 transition shadow-sm cursor-pointer"
            >
              {ex.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Feature Navigation tabs */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800 gap-1 overflow-x-auto pb-0.5 scrollbar-thin">
        <button
          onClick={() => setActiveTab('solver')}
          className={`px-5 py-2.5 text-xs font-bold transition whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'solver'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          🎓 Calculus Solver
        </button>
        <button
          onClick={() => setActiveTab('comparison')}
          className={`px-5 py-2.5 text-xs font-bold transition whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'comparison'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          📊 Dual Curve comparison
        </button>
        <button
          onClick={() => setActiveTab('ode')}
          className={`px-5 py-2.5 text-xs font-bold transition whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'ode'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          🌀 Differential Equations (ODE)
        </button>
        <button
          onClick={() => setActiveTab('guide')}
          className={`px-5 py-2.5 text-xs font-bold transition whitespace-nowrap border-b-2 cursor-pointer ${
            activeTab === 'guide'
              ? 'border-blue-600 text-blue-600 dark:border-cyan-400 dark:text-cyan-400'
              : 'border-transparent text-neutral-500 hover:text-neutral-900 dark:hover:text-white'
          }`}
        >
          📖 Interactive Master Guide
        </button>
      </div>

      {/* --- DASHBOARD WRAPPER BENTO GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: CONTROLS & DYNAMIC INPUT PANELS (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          <AnimatePresence mode="wait">
            {activeTab === 'solver' && (
              <motion.div
                key="solver-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 p-6 shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white tracking-tight">
                    Select Calculus Operation
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    The solver will dynamically customize all inputs and plot outputs instantly.
                  </p>
                </div>

                {/* Grid operation selector */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    { id: 'derivative', name: 'Derivative d/dx' },
                    { id: 'partial-derivative', name: 'Partial Derivative' },
                    { id: 'higher-derivative', name: 'Higher-Order' },
                    { id: 'indefinite-integral', name: 'Indefinite Integral' },
                    { id: 'definite-integral', name: 'Definite Integral' },
                    { id: 'area-under-curve', name: 'Area Under Curve' },
                    { id: 'area-between-curves', name: 'Area Between' },
                    { id: 'arc-length', name: 'Arc Length' },
                    { id: 'limit', name: 'Limit Solver' },
                    { id: 'one-sided-limit', name: 'One-Sided Limit' },
                    { id: 'taylor-series', name: 'Taylor Series' },
                    { id: 'maclaurin-series', name: 'Maclaurin Series' },
                    { id: 'tangent-line', name: 'Tangent Line' },
                    { id: 'normal-line', name: 'Normal Line' },
                    { id: 'optimization', name: 'Optimization' },
                    { id: 'numerical-integration', name: 'Numerical Solver' }
                  ].map(opItem => (
                    <button
                      key={opItem.id}
                      onClick={() => setOperation(opItem.id)}
                      className={`p-3 rounded-2xl text-left border text-xs font-bold transition flex flex-col justify-between cursor-pointer h-16 ${
                        operation === opItem.id
                          ? 'border-blue-500 dark:border-cyan-400 bg-blue-50/50 dark:bg-cyan-950/20 text-blue-600 dark:text-cyan-400'
                          : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300'
                      }`}
                    >
                      <span>{opItem.name}</span>
                      <span className="text-[9px] font-normal text-neutral-400">Select</span>
                    </button>
                  ))}
                </div>

                <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

                {/* DYNAMIC FORM CONTROLS */}
                <div className="space-y-4">
                  
                  {/* MAIN FUNCTION EXPRESSION */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300 flex justify-between items-center">
                      <span>Function f(x)</span>
                      <span className="text-[10px] font-normal text-neutral-400 font-mono">e.g. x^3 - 2x + 1</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. x^3-2x+1"
                      value={funcInput}
                      onChange={(e) => setFuncInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500/20"
                    />
                  </div>

                  {/* SECOND FUNCTION f(y) or g(x) FOR COMPARATIVE WRAPPERS */}
                  {(operation === 'area-between-curves') && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        Second Function g(x)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. x^2"
                        value={funcGInput}
                        onChange={(e) => setFuncGInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>
                  )}

                  {/* VARIABLE SELECTION */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        Variable (default x)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. x"
                        value={variableInput}
                        onChange={(e) => setVariableInput(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500/20"
                      />
                    </div>

                    {/* EVALUATION / TANGENT / LIMIT APPROACH POINT */}
                    {['derivative', 'limit', 'one-sided-limit', 'taylor-series', 'tangent-line', 'normal-line'].includes(operation) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          {operation === 'taylor-series' ? 'Expansion Point (Center)' : 'Point (Center)'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 2"
                          value={pointInput}
                          onChange={(e) => setPointInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none focus:border-blue-500 dark:focus:border-cyan-400 focus:ring-1 focus:ring-blue-500/20"
                        />
                      </div>
                    )}

                    {/* LIMIT DIRECTIONS */}
                    {operation === 'one-sided-limit' && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          Direction
                        </label>
                        <select
                          value={dirInput}
                          onChange={(e) => setDirInput(e.target.value as any)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                        >
                          <option value="both">Both sides (Approximation)</option>
                          <option value="left">Left hand Approaching (-)</option>
                          <option value="right">Right hand Approaching (+)</option>
                        </select>
                      </div>
                    )}

                    {/* HIGHER-ORDER DERIVATIVE SECTOR */}
                    {['higher-derivative', 'taylor-series'].includes(operation) && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          {operation === 'taylor-series' ? 'Order / Degree' : 'Derivative Order'}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 4"
                          value={orderInput}
                          onChange={(e) => setOrderInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                        />
                      </div>
                    )}
                  </div>

                  {/* INTEGRATION BOUNDS & NUMERICAL CHOICES */}
                  {['definite-integral', 'area-under-curve', 'area-between-curves', 'arc-length', 'optimization', 'numerical-integration'].includes(operation) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          Lower Limit
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 0"
                          value={lowerLimitInput}
                          onChange={(e) => setLowerLimitInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          Upper Limit
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 5"
                          value={upperLimitInput}
                          onChange={(e) => setUpperLimitInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* NUMERICAL INTEGRATION ALGORITHMS */}
                  {['definite-integral', 'area-under-curve'].includes(operation) && (
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          Numerical Method
                        </label>
                        <select
                          value={numMethodInput}
                          onChange={(e) => setNumMethodInput(e.target.value as any)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                        >
                          <option value="simpson">Simpson's Rule (Parabolic)</option>
                          <option value="trapezoidal">Trapezoidal Rule</option>
                          <option value="midpoint">Midpoint Rule</option>
                          <option value="left">Left Riemann Sum</option>
                          <option value="right">Right Riemann Sum</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                          Subdivisions (n)
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 100"
                          value={subdivisionsInput}
                          onChange={(e) => setSubdivisionsInput(e.target.value)}
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Action clear / reset panel */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={handleClearAll}
                      className="px-4 py-2.5 rounded-xl text-xs font-bold border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Clear All Inputs
                    </button>
                  </div>

                </div>

              </motion.div>
            )}

            {/* DUAL CURVE COMPARISON WIDGET */}
            {activeTab === 'comparison' && (
              <motion.div
                key="comparison-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 p-6 shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white tracking-tight">
                    What-If Analysis &amp; Comparison
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Compare two distinct mathematical functions on the same visual coordinate canvas instantly.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                      Primary Function f(x)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. x^2"
                      value={funcInput}
                      onChange={(e) => setFuncInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                      Comparison Function g(x)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. cos(x)"
                      value={funcGInput}
                      onChange={(e) => setFuncGInput(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-blue-100 dark:border-neutral-800 text-xs text-blue-700 dark:text-cyan-400 space-y-2">
                    <span className="font-extrabold flex items-center gap-1"><Info className="w-3.5 h-3.5" /> Color Coding Indicator</span>
                    <p className="text-[11px]">Primary Function is represented in <strong className="text-blue-500 font-bold">Blue</strong>. Secondary Function is represented in <strong className="text-emerald-500 font-bold">Green</strong> on the canvas graph panel.</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* FIRST ORDER ODE SYSTEMS */}
            {activeTab === 'ode' && (
              <motion.div
                key="ode-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 p-6 shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white tracking-tight">
                    First-Order ODE Solver
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Solve dy/dx = f(x, y) with Euler or RK4 Runge-Kutta numerical integration and visual direction fields.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                      Derivative f(x, y) = dy/dx
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. y - x"
                      value={odeDyDx}
                      onChange={(e) => setOdeDyDx(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs font-medium focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        Independent (x)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. x"
                        value={odeXVar}
                        onChange={(e) => setOdeXVar(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-950 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        Dependent (y)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. y"
                        value={odeYVar}
                        onChange={(e) => setOdeYVar(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-950 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        x0
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 0"
                        value={odeX0}
                        onChange={(e) => setOdeX0(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-950 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        y0
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 1"
                        value={odeY0}
                        onChange={(e) => setOdeY0(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-950 dark:text-white focus:outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                        xEnd
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3"
                        value={odeXEnd}
                        onChange={(e) => setOdeXEnd(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-neutral-200 bg-neutral-50 dark:bg-neutral-950 text-xs text-neutral-950 dark:text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-neutral-700 dark:text-neutral-300">
                      Numerical Method
                    </label>
                    <select
                      value={odeMethod}
                      onChange={(e) => setOdeMethod(e.target.value as any)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white text-xs focus:outline-none"
                    >
                      <option value="rk4">Runge-Kutta 4th Order (Highly Accurate)</option>
                      <option value="euler">Euler's Method (First-Order Approximation)</option>
                    </select>
                  </div>

                  {odeDyDx.trim() && (
                    <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-4 border border-neutral-200 dark:border-neutral-800 space-y-2">
                      <span className="text-xs font-bold text-neutral-800 dark:text-white flex items-center gap-1">⚡ Dynamic Solution Log</span>
                      {(() => {
                        const x0Val = parseFloat(odeX0) || 0;
                        const y0Val = parseFloat(odeY0) || 0;
                        const xEndVal = parseFloat(odeXEnd) || 2;
                        const sol = getOdeSolver(odeDyDx, odeXVar || 'x', odeYVar || 'y', x0Val, y0Val, xEndVal, 50, odeMethod);
                        return (
                          <div className="space-y-1.5 text-[11px] text-neutral-500 font-mono">
                            {sol.steps.slice(0, 4).map((s, idx) => (
                              <p key={idx}>{s}</p>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* INTERACTIVE COMPREHENSIVE GUIDE */}
            {activeTab === 'guide' && (
              <motion.div
                key="guide-tab"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 p-6 shadow-xl space-y-6"
              >
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white tracking-tight">
                    Mathematical Glossary &amp; Formulas
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    A concise summary of basic undergraduate calculus laws and core formulas.
                  </p>
                </div>

                <div className="space-y-4 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  <div className="border-l-2 border-blue-500 pl-3">
                    <h4 className="font-extrabold text-neutral-900 dark:text-white">The Power Rule</h4>
                    <p className="text-[11px]">d/dx [x^n] = n * x^(n-1)</p>
                  </div>

                  <div className="border-l-2 border-blue-500 pl-3">
                    <h4 className="font-extrabold text-neutral-900 dark:text-white">Fundamental Theorem of Calculus</h4>
                    <p className="text-[11px]">∫_a^b f(x)dx = F(b) - F(a) where F'(x) = f(x)</p>
                  </div>

                  <div className="border-l-2 border-blue-500 pl-3">
                    <h4 className="font-extrabold text-neutral-900 dark:text-white">The Chain Rule</h4>
                    <p className="text-[11px]">d/dx [f(g(x))] = f'(g(x)) * g'(x)</p>
                  </div>

                  <div className="border-l-2 border-blue-500 pl-3">
                    <h4 className="font-extrabold text-neutral-900 dark:text-white">Taylor Series Definition</h4>
                    <p className="text-[11px]">P_n(x) = Sum ( f^(n)(c)/n! * (x - c)^n )</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* REALTIME RESULTS SOLVER BREAKDOWN PANEL */}
          <AnimatePresence>
            {calculatedOutput && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 p-6 shadow-xl space-y-6"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-sm font-black text-neutral-400 uppercase tracking-wider font-mono">
                      Calculation Dashboard
                    </h3>
                  </div>
                  <button
                    onClick={handleCopyResult}
                    className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-white transition text-xs flex items-center gap-1 font-bold cursor-pointer"
                  >
                    {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Result'}
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white space-y-1.5">
                    <span className="text-[10px] font-bold tracking-widest uppercase opacity-75">Final Answer Form</span>
                    <h2 className="text-xl sm:text-2xl font-black font-mono break-all">{calculatedOutput.finalAnswer}</h2>
                    {calculatedOutput.decimalApprox && (
                      <p className="text-xs opacity-90">Decimal Approximation: {calculatedOutput.decimalApprox}</p>
                    )}
                  </div>

                  {/* Smart Rule-Based Insights */}
                  {calculatedOutput.insights && calculatedOutput.insights.length > 0 && (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-neutral-950 border border-emerald-150 dark:border-neutral-800 space-y-1">
                      <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">Smart Insights</span>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400">{calculatedOutput.insights[0]}</p>
                    </div>
                  )}

                  {/* Step-by-Step Dropdown Breakdown */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono block">Step-By-Step Solution Breakdown</span>
                    
                    {calculatedOutput.steps.map((stepText, idx) => (
                      <div key={idx} className="border border-neutral-100 dark:border-neutral-800 rounded-2xl overflow-hidden">
                        <button
                          onClick={() => setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          className="w-full px-4 py-3 bg-neutral-50 dark:bg-neutral-950 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition flex justify-between items-center text-xs font-bold text-neutral-700 dark:text-neutral-200 cursor-pointer"
                        >
                          <span>Step {idx + 1}: {stepText.slice(0, 45)}...</span>
                          {expandedSteps[idx] ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        
                        {expandedSteps[idx] && (
                          <div className="px-4 py-3 bg-white dark:bg-neutral-900 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed font-mono whitespace-pre-wrap break-all">
                            {stepText}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE GRAPH & SYSTEM INFORMATION (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/80 p-5 shadow-xl space-y-4" ref={graphContainerRef}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-black text-neutral-900 dark:text-white tracking-tight">
                  Interactive Coordinate Plotter
                </h3>
                <p className="text-[10px] text-neutral-400 font-mono">
                  Real-time visualization space. Drag &amp; zoom enabled.
                </p>
              </div>

              {/* Reset view */}
              <button
                onClick={resetGraph}
                className="p-2 rounded-lg bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-800 text-neutral-500 transition text-[10px] font-bold flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" /> Reset View
              </button>
            </div>

            {/* Custom Interactive Canvas Element */}
            <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 shadow-inner group">
              <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="w-full block cursor-crosshair transition-all"
                style={{ height: '300px' }}
              />

              {/* Canvas controlsoverlay on hover */}
              <div className="absolute bottom-3 right-3 flex gap-1 bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-xl p-1.5 border border-neutral-200 dark:border-neutral-800 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleZoom(5)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-white cursor-pointer"
                  title="Zoom In"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleZoom(-5)}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-white cursor-pointer"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={handleExportPNG}
                  className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-white cursor-pointer"
                  title="Export PNG Graphic"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Directions tips */}
            <div className="flex justify-between items-center text-[10px] text-neutral-400 font-mono">
              <span>Zoom Scale: {graphZoom}px/unit</span>
              <span>Pan Offsets: X={graphPan.x}, Y={graphPan.y}</span>
            </div>
          </div>

          {/* ADVANCED SMART INFORMATION CARDS */}
          <div className="bg-white/40 dark:bg-neutral-900/40 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/40 p-6 space-y-4">
            <h4 className="text-xs font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-1">
              <BookOpen className="w-4 h-4 text-blue-500" /> Educational Math Notes
            </h4>
            
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              All calculations and graphing curves are executed safely 100% client-side. The mathematical parsers compile code in real-time instantly without transferring variables or equations to third-party databases.
            </p>

            <div className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 space-y-2">
              <span className="font-bold text-neutral-900 dark:text-white block">Undergraduate Calculus Coverage</span>
              <ul className="space-y-1 text-[11px] list-disc list-inside">
                <li>Limits &amp; One-Sided Limit convergences</li>
                <li>Symbolic &amp; Numerical Derivations</li>
                <li>Indefinite/Definite Integration shadow intervals</li>
                <li>Taylor expansions up to degree 10</li>
              </ul>
            </div>
          </div>

        </div>

      </div>

      {/* --- IN-DEPTH SEO EDUCATIONAL SUITE --- */}
      <section className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/85 p-6 sm:p-10 space-y-8" id="calculus-calculator-seo">
        
        <div className="space-y-4">
          <h2 className="text-xl sm:text-3xl font-black text-neutral-950 dark:text-white tracking-tight">
            What Is Calculus? A Comprehensive Guide
          </h2>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            Calculus is the mathematical study of continuous change. Just as geometry is the study of shape and algebra is the study of generalizations of arithmetic operations, calculus is the study of rates of change and accumulation. Developed independently by Isaac Newton and Gottfried Wilhelm Leibniz in the late 17th century, it has become the bedrock of physics, engineering, economics, computer science, and data modeling.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">1. Limits and Continuity</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Limits provide the foundation for all calculus. A limit tells us what value a function is approaching as the input variable gets closer and closer to a certain point, even if the function is not defined at that point. Continuity means there are no jumps, breaks, or holes in the function's curve.
            </p>

            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">2. Derivatives and Rates of Change</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              The derivative represents the instantaneous rate of change of a function. Geometrically, it is the slope of the tangent line to the curve at a specific coordinate. Derivatives are used to optimize systems, find maximal profit or minimal cost, and track velocities or accelerations in real-time.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">3. Integrals and Accumulation</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Integration is the reverse process of differentiation (anti-differentiation). The definite integral represents the net accumulated area under a curve between two points. It is used to calculate center of mass, probability densities, arc length, volume of solids of revolution, and total physical work.
            </p>

            <h3 className="text-sm font-extrabold text-neutral-900 dark:text-white">4. Infinite Series and Taylor Polynomials</h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Infinite series allow us to approximate complex, transcendental functions (like sines, cosines, and exponentials) as simple, infinite polynomials. Taylor and Maclaurin expansions approximate curves with incredible accuracy near a selected center point.
            </p>
          </div>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

        {/* CORE CALCULUS RULES */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-neutral-950 dark:text-white tracking-tight">
            Fundamental Calculus Differentiation and Integration Rules
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/40">
              <span className="text-[10px] font-extrabold text-blue-500 font-mono uppercase block mb-1">Product Rule</span>
              <p className="text-xs font-bold text-neutral-800 dark:text-white font-mono">d/dx [u * v] = u * v' + v * u'</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/40">
              <span className="text-[10px] font-extrabold text-blue-500 font-mono uppercase block mb-1">Quotient Rule</span>
              <p className="text-xs font-bold text-neutral-800 dark:text-white font-mono">d/dx [u / v] = (v * u' - u * v') / v^2</p>
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/40">
              <span className="text-[10px] font-extrabold text-blue-500 font-mono uppercase block mb-1">Fundamental Theorem</span>
              <p className="text-xs font-bold text-neutral-800 dark:text-white font-mono">d/dx [∫_a^x f(t)dt] = f(x)</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

        {/* WORKED EXAMPLES */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-neutral-950 dark:text-white tracking-tight">
            Common Worked Calculus Examples
          </h3>
          
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/40 text-xs">
              <h4 className="font-extrabold text-neutral-900 dark:text-white">Example 1: Find Derivative of f(x) = 4x^3 - 5x^2 + 7</h4>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Using the sum, constant multiple, and power rules term-by-term:
                <br />
                d/dx [4x^3] = 4 * 3x^2 = 12x^2
                <br />
                d/dx [-5x^2] = -5 * 2x = -10x
                <br />
                d/dx [7] = 0
                <br />
                Result: <strong>f'(x) = 12x^2 - 10x</strong>
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/40 text-xs">
              <h4 className="font-extrabold text-neutral-900 dark:text-white">Example 2: Compute Definite Integral ∫_1^3 2x dx</h4>
              <p className="text-neutral-500 dark:text-neutral-400 mt-1 leading-relaxed">
                Find the anti-derivative: F(x) = x^2.
                <br />
                Evaluate at bounds using the Fundamental Theorem: F(3) - F(1) = 3^2 - 1^2 = 9 - 1 = 8.
                <br />
                Result: <strong>Definite Integral = 8</strong>
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

        {/* FAQs */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-neutral-950 dark:text-white tracking-tight">
            Frequently Asked Questions (FAQ)
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-neutral-600 dark:text-neutral-400">
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-neutral-900 dark:text-white">What is the difference between derivative and integral?</h4>
              <p className="leading-relaxed">A derivative measures the slope or rate of change at a specific point on a function. An integral measures the total accumulated area under the curve between two bounds. They are mathematically inverse operations.</p>
            </div>
            <div className="space-y-1.5">
              <h4 className="font-extrabold text-neutral-900 dark:text-white">How accurate are the numerical integration solvers?</h4>
              <p className="leading-relaxed">Extremely accurate. Using Simpson's Rule or Trapezoidal integration with subdivisions of n=100 generally provides floating-point accuracy up to 6 or more decimal places, which is perfectly suited for undergraduate academic and professional engineering problems.</p>
            </div>
          </div>
        </div>

        <div className="h-px bg-neutral-100 dark:bg-neutral-800" />

        {/* RELATED CALCULATORS FOR PORTFOLIO NAVIGATIONAL VALUE */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-extrabold text-neutral-400 uppercase tracking-widest font-mono">Related Calculatoora Utilities</h4>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { name: 'Derivative Solver', slug: 'scientific-calculator' },
              { name: 'Integral Solver', slug: 'scientific-calculator' },
              { name: 'Limit Solver', slug: 'scientific-calculator' },
              { name: 'Graphing Calculator', slug: 'graphing-calculator' },
              { name: 'Algebra Solver', slug: 'algebra-calculator' },
              { name: 'Geometry Solver', slug: 'geometry-calculator' }
            ].map((rc, idx) => (
              <a
                key={idx}
                href={`#/${rc.slug}`}
                onClick={(e) => {
                  e.preventDefault();
                  if (onNavigate) onNavigate(`calculator:${rc.slug}`);
                }}
                className="px-3.5 py-2 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 transition cursor-pointer font-bold"
              >
                {rc.name}
              </a>
            ))}
          </div>
        </div>

      </section>

    </div>
  );
}
