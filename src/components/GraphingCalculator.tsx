import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Settings, 
  Play, 
  Pause, 
  RefreshCw, 
  RotateCw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Minimize2, 
  LineChart, 
  Table, 
  HelpCircle, 
  Download, 
  Sparkles, 
  Compass, 
  Sliders, 
  Box, 
  SlidersHorizontal,
  Lightbulb,
  FileSpreadsheet,
  Layers,
  ArrowUpDown,
  Search,
  BookOpen
} from 'lucide-react';
import { compileEquation, evaluateEquation, Token, normalizeEquation } from '../utils/mathParser';

// TYPES
interface GraphFunction {
  id: string;
  expression: string; // Cartesian raw expression or r-expression
  name: string; // e.g. f1, f2
  type: 'cartesian' | 'polar' | 'parametric' | 'implicit' | 'scatter';
  visible: boolean;
  locked: boolean;
  color: string;
  lineWidth: number;
  lineStyle: 'solid' | 'dashed';
  opacity: number;
  glow: boolean;
  pointStyle: 'none' | 'circle' | 'square' | 'cross';
  markerSize: number;
  
  // Parametric specific
  parametricX?: string;
  parametricY?: string;
  
  // Scatter plot specific
  scatterPoints?: { x: number; y: number }[];
  regressionType?: 'none' | 'linear' | 'quadratic' | 'exponential';
  
  // Compiled tokens
  rpnCartesian?: Token[] | null;
  rpnParamX?: Token[] | null;
  rpnParamY?: Token[] | null;
  error?: string | null;
}

interface SliderVar {
  id: string;
  name: string;
  val: number;
  min: number;
  max: number;
  step: number;
  isAnimating: boolean;
}

const PRESET_COLORS = [
  '#2563eb', // Blue
  '#dc2626', // Red
  '#16a34a', // Green
  '#9333ea', // Purple
  '#ea580c', // Orange
  '#0891b2', // Cyan
  '#db2777', // Pink
  '#ca8a04'  // Yellow
];

export default function GraphingCalculator() {
  // Functions state
  const [functions, setFunctions] = useState<GraphFunction[]>([
    {
      id: 'f1',
      expression: '', // Starts empty as per guidelines
      name: 'f₁(x)',
      type: 'cartesian',
      visible: true,
      locked: false,
      color: '#2563eb',
      lineWidth: 2.5,
      lineStyle: 'solid',
      opacity: 0.9,
      glow: true,
      pointStyle: 'none',
      markerSize: 5,
    }
  ]);
  
  const [activeFuncId, setActiveFuncId] = useState<string>('f1');
  const [sliders, setSliders] = useState<SliderVar[]>([
    { id: 'v1', name: 'a', val: 1, min: -10, max: 10, step: 0.1, isAnimating: false },
    { id: 'v2', name: 'b', val: 0, min: -10, max: 10, step: 0.1, isAnimating: false }
  ]);
  
  // Viewport bounds
  const [viewport, setViewport] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -10,
    yMax: 10
  });

  // UI tabs
  const [activeTab, setActiveTab] = useState<'functions' | 'analysis' | 'comparison' | 'table' | 'statistics' | '3d'>('functions');
  
  // Grid/Axis Controls
  const [gridVisible, setGridVisible] = useState(true);
  const [axisVisible, setAxisVisible] = useState(true);
  const [minorGrid, setMinorGrid] = useState(true);
  const [snapGrid, setSnapGrid] = useState(false);
  const [darkGrid, setDarkGrid] = useState(false);
  
  // Size of canvas area
  const [graphHeight, setGraphHeight] = useState(550);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Table state
  const [tableStart, setTableStart] = useState(-5);
  const [tableEnd, setTableEnd] = useState(5);
  const [tableStep, setTableStep] = useState(1);
  const [tableSearch, setTableSearch] = useState('');
  const [tableSortAsc, setTableSortAsc] = useState(true);
  
  // Analysis parameters
  const [integralA, setIntegralA] = useState(-2);
  const [integralB, setIntegralB] = useState(2);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; val: number; slope: number; dist: number; angle: number; funcName: string } | null>(null);

  // 3D parameters
  const [equation3D, setEquation3D] = useState(''); // starts empty
  const [rotate3D, setRotate3D] = useState({ x: 0.6, y: 0.6 });
  const [zoom3D, setZoom3D] = useState(35);
  const [style3D, setStyle3D] = useState<'wireframe' | 'surface' | 'mesh'>('surface');
  const [lighting3D, setLighting3D] = useState(true);
  
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas3DRef = useRef<HTMLCanvasElement>(null);
  const dragStartRef = useRef<{ x: number; y: number; viewport: typeof viewport } | null>(null);
  const isDraggingRef = useRef(false);
  const drag3DStartRef = useRef<{ x: number; y: number; rot: typeof rotate3D } | null>(null);
  const isDragging3DRef = useRef(false);
  const animationFrameRef = useRef<number | null>(null);

  // Compile equation bindings when changed
  const compiledFunctions = useMemo(() => {
    return functions.map((fn) => {
      let rpnCartesian: Token[] | null = null;
      let rpnParamX: Token[] | null = null;
      let rpnParamY: Token[] | null = null;
      let error: string | null = null;
      
      if (fn.type === 'cartesian' || fn.type === 'polar' || fn.type === 'implicit') {
        if (fn.expression) {
          const norm = normalizeEquation(fn.expression);
          const comp = compileEquation(norm.cleaned);
          rpnCartesian = comp.rpn;
          error = comp.error;
        }
      } else if (fn.type === 'parametric') {
        if (fn.parametricX && fn.parametricY) {
          const compX = compileEquation(fn.parametricX);
          const compY = compileEquation(fn.parametricY);
          rpnParamX = compX.rpn;
          rpnParamY = compY.rpn;
          error = compX.error || compY.error;
        }
      }
      
      return {
        ...fn,
        rpnCartesian,
        rpnParamX,
        rpnParamY,
        error
      };
    });
  }, [functions]);

  // Dictionary of animation variables
  const sliderVars = useMemo(() => {
    const vars: Record<string, number> = {};
    sliders.forEach((s) => {
      vars[s.name] = s.val;
    });
    return vars;
  }, [sliders]);

  // Compiled 3D equation
  const compiled3D = useMemo(() => {
    if (!equation3D) return null;
    const { cleaned } = normalizeEquation(equation3D);
    return compileEquation(cleaned).rpn;
  }, [equation3D]);

  // Handle active function helper
  const activeCompiledFunc = useMemo(() => {
    return compiledFunctions.find(f => f.id === activeFuncId) || compiledFunctions[0];
  }, [compiledFunctions, activeFuncId]);

  // Handle slide animations inside requestAnimationFrame
  useEffect(() => {
    const animate = () => {
      let changed = false;
      setSliders((prev) => 
        prev.map((s) => {
          if (s.isAnimating) {
            changed = true;
            let nextVal = s.val + s.step;
            if (nextVal > s.max) {
              nextVal = s.min;
            }
            return { ...s, val: parseFloat(nextVal.toFixed(4)) };
          }
          return s;
        })
      );
      
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  // Duplicate function
  const duplicateFunction = (id: string) => {
    const fn = functions.find((f) => f.id === id);
    if (!fn) return;
    const newId = `f_${Date.now()}`;
    const newFn: GraphFunction = {
      ...fn,
      id: newId,
      name: `${fn.name.split('(')[0]}₂(${fn.type === 'polar' ? 'θ' : fn.type === 'parametric' ? 't' : 'x'})`,
      color: PRESET_COLORS[functions.length % PRESET_COLORS.length]
    };
    setFunctions([...functions, newFn]);
    setActiveFuncId(newId);
  };

  // Add standard blank function
  const addFunction = (type: 'cartesian' | 'polar' | 'parametric' | 'implicit' | 'scatter' = 'cartesian') => {
    const newId = `f_${Date.now()}`;
    const count = functions.length + 1;
    let name = `f${count}(x)`;
    let expr = '';
    let parametricX = '';
    let parametricY = '';
    let scatterPoints: { x: number; y: number }[] | undefined;
    
    if (type === 'polar') {
      name = `r${count}(θ)`;
    } else if (type === 'parametric') {
      name = `p${count}(t)`;
      parametricX = '';
      parametricY = '';
    } else if (type === 'implicit') {
      name = `g${count}(x,y)`;
    } else if (type === 'scatter') {
      name = `S${count}`;
      scatterPoints = [
        { x: -3, y: -2 },
        { x: -1, y: 1 },
        { x: 1, y: 0 },
        { x: 3, y: 4 },
        { x: 5, y: 3 }
      ];
    }
    
    const newFn: GraphFunction = {
      id: newId,
      expression: expr,
      name,
      type,
      visible: true,
      locked: false,
      color: PRESET_COLORS[functions.length % PRESET_COLORS.length],
      lineWidth: 2.5,
      lineStyle: 'solid',
      opacity: 0.9,
      glow: true,
      pointStyle: type === 'scatter' ? 'circle' : 'none',
      markerSize: type === 'scatter' ? 8 : 5,
      parametricX,
      parametricY,
      scatterPoints,
      regressionType: type === 'scatter' ? 'linear' : undefined
    };
    
    setFunctions([...functions, newFn]);
    setActiveFuncId(newId);
  };

  const deleteFunction = (id: string) => {
    if (functions.length <= 1) {
      // Just clear instead of deleting the last one
      setFunctions([
        {
          id: 'f1',
          expression: '',
          name: 'f₁(x)',
          type: 'cartesian',
          visible: true,
          locked: false,
          color: '#2563eb',
          lineWidth: 2.5,
          lineStyle: 'solid',
          opacity: 0.9,
          glow: true,
          pointStyle: 'none',
          markerSize: 5,
        }
      ]);
      setActiveFuncId('f1');
      return;
    }
    const filtered = functions.filter((f) => f.id !== id);
    setFunctions(filtered);
    if (activeFuncId === id) {
      setActiveFuncId(filtered[0].id);
    }
  };

  const clearAll = () => {
    setFunctions([
      {
        id: 'f1',
        expression: '',
        name: 'f₁(x)',
        type: 'cartesian',
        visible: true,
        locked: false,
        color: '#2563eb',
        lineWidth: 2.5,
        lineStyle: 'solid',
        opacity: 0.9,
        glow: true,
        pointStyle: 'none',
        markerSize: 5,
      }
    ]);
    setActiveFuncId('f1');
    setSliders([
      { id: 'v1', name: 'a', val: 1, min: -10, max: 10, step: 0.1, isAnimating: false },
      { id: 'v2', name: 'b', val: 0, min: -10, max: 10, step: 0.1, isAnimating: false }
    ]);
    setViewport({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
    setHoveredPoint(null);
    setEquation3D('');
  };

  const zoom = (factor: number) => {
    setViewport((prev) => {
      const xCenter = (prev.xMin + prev.xMax) / 2;
      const yCenter = (prev.yMin + prev.yMax) / 2;
      const xHalfRange = ((prev.xMax - prev.xMin) / 2) * factor;
      const yHalfRange = ((prev.yMax - prev.yMin) / 2) * factor;
      return {
        xMin: xCenter - xHalfRange,
        xMax: xCenter + xHalfRange,
        yMin: yCenter - yHalfRange,
        yMax: yCenter + yHalfRange
      };
    });
  };

  const resetView = () => {
    setViewport({ xMin: -10, xMax: 10, yMin: -10, yMax: 10 });
  };

  const centerOrigin = () => {
    setViewport((prev) => {
      const xHalf = (prev.xMax - prev.xMin) / 2;
      const yHalf = (prev.yMax - prev.yMin) / 2;
      return {
        xMin: -xHalf,
        xMax: xHalf,
        yMin: -yHalf,
        yMax: yHalf
      };
    });
  };

  const fitAll = () => {
    // Fits standard range
    setViewport({ xMin: -12, xMax: 12, yMin: -8, yMax: 8 });
  };

  // Preload examples
  const loadExample = (exName: string) => {
    clearAll();
    switch (exName) {
      case 'quadratic':
        setFunctions([
          {
            id: 'f1',
            expression: 'a*x^2 + b*x - 4',
            name: 'f₁(x)',
            type: 'cartesian',
            visible: true,
            locked: false,
            color: '#2563eb',
            lineWidth: 3,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
          }
        ]);
        setSliders([
          { id: 'v1', name: 'a', val: 1, min: -5, max: 5, step: 0.1, isAnimating: false },
          { id: 'v2', name: 'b', val: -2, min: -5, max: 5, step: 0.1, isAnimating: false }
        ]);
        setViewport({ xMin: -6, xMax: 6, yMin: -10, yMax: 5 });
        break;
      case 'circle':
        setFunctions([
          {
            id: 'f1',
            expression: 'x^2 + y^2 = 25',
            name: 'Circle',
            type: 'implicit',
            visible: true,
            locked: false,
            color: '#db2777',
            lineWidth: 3,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
          }
        ]);
        setViewport({ xMin: -8, xMax: 8, yMin: -8, yMax: 8 });
        break;
      case 'sine':
        setFunctions([
          {
            id: 'f1',
            expression: 'a*sin(x + b)',
            name: 'f₁(x)',
            type: 'cartesian',
            visible: true,
            locked: false,
            color: '#0891b2',
            lineWidth: 3,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
          }
        ]);
        setSliders([
          { id: 'v1', name: 'a', val: 2.5, min: -5, max: 5, step: 0.1, isAnimating: false },
          { id: 'v2', name: 'b', val: 1.5, min: -5, max: 5, step: 0.1, isAnimating: false }
        ]);
        setViewport({ xMin: -10, xMax: 10, yMin: -5, yMax: 5 });
        break;
      case 'polar':
        setFunctions([
          {
            id: 'f1',
            expression: '4*sin(5*theta)',
            name: 'r₁(θ)',
            type: 'polar',
            visible: true,
            locked: false,
            color: '#9333ea',
            lineWidth: 2.5,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
          }
        ]);
        setViewport({ xMin: -6, xMax: 6, yMin: -6, yMax: 6 });
        break;
      case 'parametric':
        setFunctions([
          {
            id: 'f1',
            expression: '',
            name: 'p₁(t)',
            type: 'parametric',
            visible: true,
            locked: false,
            color: '#ea580c',
            lineWidth: 3,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
            parametricX: '4*cos(t)',
            parametricY: '3*sin(t)'
          }
        ]);
        setViewport({ xMin: -6, xMax: 6, yMin: -4, yMax: 4 });
        break;
      case 'stats':
        setFunctions([
          {
            id: 'f1',
            expression: '',
            name: 'S₁',
            type: 'scatter',
            visible: true,
            locked: false,
            color: '#16a34a',
            lineWidth: 1.5,
            lineStyle: 'dashed',
            opacity: 0.9,
            glow: false,
            pointStyle: 'circle',
            markerSize: 8,
            scatterPoints: [
              { x: -4, y: -3.5 },
              { x: -2, y: -1.2 },
              { x: 0, y: 0.5 },
              { x: 1, y: 1.8 },
              { x: 3, y: 2.9 },
              { x: 5, y: 4.8 }
            ],
            regressionType: 'linear'
          }
        ]);
        setViewport({ xMin: -6, xMax: 6, yMin: -5, yMax: 6 });
        break;
      case 'ellipse':
        setFunctions([
          {
            id: 'f1',
            expression: '(x/5)^2 + (y/3)^2 = 1',
            name: 'Ellipse',
            type: 'implicit',
            visible: true,
            locked: false,
            color: '#db2777',
            lineWidth: 3,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
          }
        ]);
        setViewport({ xMin: -8, xMax: 8, yMin: -5, yMax: 5 });
        break;
      case 'hyperbola':
        setFunctions([
          {
            id: 'f1',
            expression: '(x/3)^2 - (y/2)^2 = 1',
            name: 'Hyperbola',
            type: 'implicit',
            visible: true,
            locked: false,
            color: '#0891b2',
            lineWidth: 3,
            lineStyle: 'solid',
            opacity: 0.9,
            glow: true,
            pointStyle: 'none',
            markerSize: 5,
          }
        ]);
        setViewport({ xMin: -10, xMax: 10, yMin: -8, yMax: 8 });
        break;
      default:
        break;
    }
  };

  // Render 2D Graph onto Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Support responsive sizing & retina displays
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    // Pixel helper converts math coords to screen pixels
    const toScreenX = (x: number) => {
      return ((x - viewport.xMin) / (viewport.xMax - viewport.xMin)) * width;
    };
    const toScreenY = (y: number) => {
      return height - ((y - viewport.yMin) / (viewport.yMax - viewport.yMin)) * height;
    };
    
    // Pixel helper converts screen pixels to math coords
    const toMathX = (px: number) => {
      return viewport.xMin + (px / width) * (viewport.xMax - viewport.xMin);
    };
    const toMathY = (py: number) => {
      return viewport.yMin + ((height - py) / height) * (viewport.yMax - viewport.yMin);
    };
    
    // 1. Clear with theme-conscious background
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#171717' : '#fafafa';
    ctx.fillRect(0, 0, width, height);
    
    // Define Grid Spacing dynamically
    const xRange = viewport.xMax - viewport.xMin;
    const log10 = Math.log10(xRange);
    const gridPow = Math.floor(log10);
    let step = Math.pow(10, gridPow);
    
    // Adjust step density
    if (xRange / step < 4) {
      step /= 2;
    } else if (xRange / step > 10) {
      step *= 2;
    }
    
    const minorStep = step / 5;
    
    // 2. Draw Minor Grid
    if (gridVisible && minorGrid) {
      ctx.strokeStyle = darkGrid 
        ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.12)')
        : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.03)');
      ctx.lineWidth = 0.5;
      
      const xStart = Math.floor(viewport.xMin / minorStep) * minorStep;
      for (let x = xStart; x <= viewport.xMax; x += minorStep) {
        ctx.beginPath();
        ctx.moveTo(toScreenX(x), 0);
        ctx.lineTo(toScreenX(x), height);
        ctx.stroke();
      }
      
      const yStart = Math.floor(viewport.yMin / minorStep) * minorStep;
      for (let y = yStart; y <= viewport.yMax; y += minorStep) {
        ctx.beginPath();
        ctx.moveTo(0, toScreenY(y));
        ctx.lineTo(width, toScreenY(y));
        ctx.stroke();
      }
    }
    
    // 3. Draw Major Grid
    if (gridVisible) {
      ctx.strokeStyle = darkGrid
        ? (isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)')
        : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.08)');
      ctx.lineWidth = 1;
      
      const xStart = Math.floor(viewport.xMin / step) * step;
      for (let x = xStart; x <= viewport.xMax; x += step) {
        ctx.beginPath();
        ctx.moveTo(toScreenX(x), 0);
        ctx.lineTo(toScreenX(x), height);
        ctx.stroke();
      }
      
      const yStart = Math.floor(viewport.yMin / step) * step;
      for (let y = yStart; y <= viewport.yMax; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, toScreenY(y));
        ctx.lineTo(width, toScreenY(y));
        ctx.stroke();
      }
    }
    
    // 4. Draw Primary Coordinate Axes
    if (axisVisible) {
      ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.5)';
      ctx.lineWidth = 1.5;
      
      // X Axis
      const yZero = toScreenY(0);
      if (yZero >= 0 && yZero <= height) {
        ctx.beginPath();
        ctx.moveTo(0, yZero);
        ctx.lineTo(width, yZero);
        ctx.stroke();
      }
      
      // Y Axis
      const xZero = toScreenX(0);
      if (xZero >= 0 && xZero <= width) {
        ctx.beginPath();
        ctx.moveTo(xZero, 0);
        ctx.lineTo(xZero, height);
        ctx.stroke();
      }
      
      // Axis text labels & ticks
      ctx.fillStyle = isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.7)';
      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      
      // X major ticks
      const xStart = Math.floor(viewport.xMin / step) * step;
      for (let x = xStart; x <= viewport.xMax; x += step) {
        if (Math.abs(x) < 0.0001) continue; // skip 0
        const sx = toScreenX(x);
        const sy = yZero >= 0 && yZero <= height ? yZero : height - 15;
        ctx.beginPath();
        ctx.moveTo(sx, sy - 3);
        ctx.lineTo(sx, sy + 3);
        ctx.stroke();
        ctx.fillText(parseFloat(x.toFixed(4)).toString(), sx, sy + 6);
      }
      
      // Y major ticks
      ctx.textAlign = 'right';
      ctx.textBaseline = 'middle';
      const yStart = Math.floor(viewport.yMin / step) * step;
      for (let y = yStart; y <= viewport.yMax; y += step) {
        if (Math.abs(y) < 0.0001) continue; // skip 0
        const sy = toScreenY(y);
        const sx = xZero >= 0 && xZero <= width ? xZero : 15;
        ctx.beginPath();
        ctx.moveTo(sx - 3, sy);
        ctx.lineTo(sx + 3, sy);
        ctx.stroke();
        ctx.fillText(parseFloat(y.toFixed(4)).toString(), sx - 6, sy);
      }
      
      // Origin label
      if (xZero >= 0 && xZero <= width && yZero >= 0 && yZero <= height) {
        ctx.fillText('0', xZero - 6, yZero + 6);
      }
    }
    
    // 5. Draw Functions Plotting
    compiledFunctions.forEach((fn) => {
      if (!fn.visible) return;
      
      ctx.save();
      ctx.strokeStyle = fn.color;
      ctx.lineWidth = fn.lineWidth;
      ctx.globalAlpha = fn.opacity;
      
      if (fn.lineStyle === 'dashed') {
        ctx.setLineDash([5, 5]);
      } else {
        ctx.setLineDash([]);
      }
      
      // Optional premium outer glow
      if (fn.glow) {
        ctx.shadowColor = fn.color;
        ctx.shadowBlur = 8;
      }
      
      // 5a. CARTESIAN (y = f(x))
      if (fn.type === 'cartesian' && fn.rpnCartesian) {
        ctx.beginPath();
        let first = true;
        
        // Check for definite integral shading if selected as active
        const isIntegralActive = activeFuncId === fn.id && activeTab === 'analysis';
        let integralPoints: {x: number, y: number}[] = [];
        
        // Loop over vertical columns of pixels
        for (let px = 0; px <= width; px += 0.5) {
          const x = toMathX(px);
          const y = evaluateEquation(fn.rpnCartesian, { x, ...sliderVars });
          
          if (!isNaN(y) && isFinite(y)) {
            const py = toScreenY(y);
            
            // Collect points for integral shading
            if (isIntegralActive && x >= integralA && x <= integralB) {
              integralPoints.push({ x, y });
            }
            
            // Draw lines, but protect against crazy discontinuity spikes
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true; // Lift pen
          }
        }
        ctx.stroke();
        
        // If integrating, fill area under the curve in secondary alpha layer
        if (integralPoints.length > 0) {
          ctx.save();
          ctx.globalAlpha = 0.22;
          ctx.fillStyle = fn.color;
          ctx.shadowBlur = 0; // Disable shadow for shade
          ctx.setLineDash([]);
          ctx.beginPath();
          
          // Move to base axis of first point
          const firstScreen = toScreenX(integralPoints[0].x);
          ctx.moveTo(firstScreen, toScreenY(0));
          
          integralPoints.forEach((pt) => {
            ctx.lineTo(toScreenX(pt.x), toScreenY(pt.y));
          });
          
          const lastScreen = toScreenX(integralPoints[integralPoints.length - 1].x);
          ctx.lineTo(lastScreen, toScreenY(0));
          ctx.closePath();
          ctx.fill();
          ctx.restore();
          
          // Draw dashed bounds
          ctx.save();
          ctx.strokeStyle = fn.color;
          ctx.lineWidth = 1.5;
          ctx.setLineDash([3, 3]);
          ctx.beginPath();
          ctx.moveTo(toScreenX(integralA), toScreenY(0));
          ctx.lineTo(toScreenX(integralA), toScreenY(evaluateEquation(fn.rpnCartesian, { x: integralA, ...sliderVars })));
          ctx.moveTo(toScreenX(integralB), toScreenY(0));
          ctx.lineTo(toScreenX(integralB), toScreenY(evaluateEquation(fn.rpnCartesian, { x: integralB, ...sliderVars })));
          ctx.stroke();
          ctx.restore();
        }
      }
      
      // 5b. POLAR (r = f(theta))
      else if (fn.type === 'polar' && fn.rpnCartesian) {
        ctx.beginPath();
        let first = true;
        const totalSteps = 720;
        
        for (let s = 0; s <= totalSteps; s++) {
          const theta = (s / totalSteps) * Math.PI * 4; // theta from 0 to 4pi
          const r = evaluateEquation(fn.rpnCartesian, { theta, ...sliderVars });
          
          if (!isNaN(r) && isFinite(r)) {
            const x = r * Math.cos(theta);
            const y = r * Math.sin(theta);
            const px = toScreenX(x);
            const py = toScreenY(y);
            
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }
      
      // 5c. PARAMETRIC (x = x(t), y = y(t))
      else if (fn.type === 'parametric' && fn.rpnParamX && fn.rpnParamY) {
        ctx.beginPath();
        let first = true;
        const totalSteps = 400;
        const tMin = -Math.PI * 2;
        const tMax = Math.PI * 2;
        
        for (let s = 0; s <= totalSteps; s++) {
          const t = tMin + (s / totalSteps) * (tMax - tMin);
          const x = evaluateEquation(fn.rpnParamX, { t, ...sliderVars });
          const y = evaluateEquation(fn.rpnParamY, { t, ...sliderVars });
          
          if (!isNaN(x) && isFinite(x) && !isNaN(y) && isFinite(y)) {
            const px = toScreenX(x);
            const py = toScreenY(y);
            
            if (first) {
              ctx.moveTo(px, py);
              first = false;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            first = true;
          }
        }
        ctx.stroke();
      }
      
      // 5d. IMPLICIT EQUATION zero-crossing marching squares grid
      else if (fn.type === 'implicit' && fn.rpnCartesian) {
        // Grid dimension
        const gridX = 90;
        const gridY = 60;
        
        const cellW = width / gridX;
        const cellH = height / gridY;
        
        // Evaluate points on a screen grid
        const values = new Array(gridX + 1).fill(0).map(() => new Array(gridY + 1).fill(0));
        for (let i = 0; i <= gridX; i++) {
          const mx = toMathX(i * cellW);
          for (let j = 0; j <= gridY; j++) {
            const my = toMathY(j * cellH);
            values[i][j] = evaluateEquation(fn.rpnCartesian, { x: mx, y: my, ...sliderVars });
          }
        }
        
        // Simple marching contour lines
        ctx.shadowBlur = 0; // Marching squares struggles with shadowBlur glow performance
        for (let i = 0; i < gridX; i++) {
          const x1 = i * cellW;
          const x2 = (i + 1) * cellW;
          
          for (let j = 0; j < gridY; j++) {
            const y1 = j * cellH;
            const y2 = (j + 1) * cellH;
            
            // Corners: top-left, top-right, bottom-right, bottom-left
            // Note: j is from top-down screen coordinate
            const vTL = values[i][j];
            const vTR = values[i + 1][j];
            const vBR = values[i + 1][j + 1];
            const vBL = values[i][j + 1];
            
            // Draw contours where zero crossing occurs
            // Top segment crossing
            const crossingTop = (vTL >= 0 && vTR < 0) || (vTL < 0 && vTR >= 0);
            // Right segment crossing
            const crossingRight = (vTR >= 0 && vBR < 0) || (vTR < 0 && vBR >= 0);
            // Bottom segment crossing
            const crossingBottom = (vBL >= 0 && vBR < 0) || (vBL < 0 && vBR >= 0);
            // Left segment crossing
            const crossingLeft = (vTL >= 0 && vBL < 0) || (vTL < 0 && vBL >= 0);
            
            const points: { x: number; y: number }[] = [];
            
            if (crossingTop) {
              const t = Math.abs(vTL) / (Math.abs(vTL) + Math.abs(vTR));
              points.push({ x: x1 + t * cellW, y: y1 });
            }
            if (crossingRight) {
              const t = Math.abs(vTR) / (Math.abs(vTR) + Math.abs(vBR));
              points.push({ x: x2, y: y1 + t * cellH });
            }
            if (crossingBottom) {
              const t = Math.abs(vBL) / (Math.abs(vBL) + Math.abs(vBR));
              points.push({ x: x1 + t * cellW, y: y2 });
            }
            if (crossingLeft) {
              const t = Math.abs(vTL) / (Math.abs(vTL) + Math.abs(vBL));
              points.push({ x: x1, y: y1 + t * cellH });
            }
            
            if (points.length >= 2) {
              ctx.beginPath();
              ctx.moveTo(points[0].x, points[0].y);
              ctx.lineTo(points[1].x, points[1].y);
              ctx.stroke();
            }
          }
        }
      }
      
      // 5e. SCATTER PLOTS & REGRESSION
      else if (fn.type === 'scatter' && fn.scatterPoints) {
        ctx.shadowBlur = 0; // No glow for raw scatter dots
        
        // Plot raw data points
        fn.scatterPoints.forEach((pt) => {
          const px = toScreenX(pt.x);
          const py = toScreenY(pt.y);
          
          if (px >= 0 && px <= width && py >= 0 && py <= height) {
            ctx.fillStyle = fn.color;
            ctx.beginPath();
            
            if (fn.pointStyle === 'circle') {
              ctx.arc(px, py, fn.markerSize, 0, Math.PI * 2);
              ctx.fill();
            } else if (fn.pointStyle === 'square') {
              ctx.rect(px - fn.markerSize, py - fn.markerSize, fn.markerSize * 2, fn.markerSize * 2);
              ctx.fill();
            } else if (fn.pointStyle === 'cross') {
              ctx.strokeStyle = fn.color;
              ctx.lineWidth = 2;
              ctx.moveTo(px - fn.markerSize, py);
              ctx.lineTo(px + fn.markerSize, py);
              ctx.moveTo(px, py - fn.markerSize);
              ctx.lineTo(px, py + fn.markerSize);
              ctx.stroke();
            }
          }
        });
        
        // Calculate & Plot regression curves
        if (fn.regressionType && fn.regressionType !== 'none') {
          const pts = fn.scatterPoints;
          const N = pts.length;
          
          if (N >= 2) {
            let slope = 0;
            let intercept = 0;
            
            // Linear regression variables
            let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
            pts.forEach((p) => {
              sumX += p.x;
              sumY += p.y;
              sumXY += p.x * p.y;
              sumXX += p.x * p.x;
            });
            
            const denom = (N * sumXX - sumX * sumX);
            if (denom !== 0) {
              slope = (N * sumXY - sumX * sumY) / denom;
              intercept = (sumY - slope * sumX) / N;
              
              // Draw line
              ctx.strokeStyle = fn.color;
              ctx.lineWidth = 1.5;
              ctx.setLineDash([4, 4]);
              
              ctx.beginPath();
              const leftY = slope * viewport.xMin + intercept;
              const rightY = slope * viewport.xMax + intercept;
              ctx.moveTo(0, toScreenY(leftY));
              ctx.lineTo(width, toScreenY(rightY));
              ctx.stroke();
            }
          }
        }
      }
      
      ctx.restore();
    });
    
    // 6. Hover analysis node
    if (hoveredPoint) {
      ctx.save();
      const hx = toScreenX(hoveredPoint.x);
      const hy = toScreenY(hoveredPoint.y);
      
      if (hx >= 0 && hx <= width && hy >= 0 && hy <= height) {
        // Draw target crosshair
        ctx.strokeStyle = isDark ? '#ffffff' : '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(hx, hy, 6, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#2563eb';
        ctx.beginPath();
        ctx.arc(hx, hy, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Tooltip container
        ctx.fillStyle = isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)';
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 1;
        
        const textLines = [
          `Function: ${hoveredPoint.funcName}`,
          `X: ${hoveredPoint.x.toFixed(4)}`,
          `Y: ${hoveredPoint.y.toFixed(4)}`,
          `Slope: ${isNaN(hoveredPoint.slope) ? 'N/A' : hoveredPoint.slope.toFixed(4)}`,
          `Distance: ${hoveredPoint.dist.toFixed(4)}`,
          `Angle: ${hoveredPoint.angle.toFixed(1)}°`
        ];
        
        // Measure tooltip height/width
        ctx.font = '11px "JetBrains Mono", monospace';
        let tooltipW = 160;
        let tooltipH = textLines.length * 15 + 10;
        
        // Position tooltip appropriately to prevent overflowing edges
        let tx = hx + 15;
        let ty = hy - tooltipH / 2;
        if (tx + tooltipW > width) tx = hx - tooltipW - 15;
        if (ty < 10) ty = 10;
        if (ty + tooltipH > height) ty = height - tooltipH - 10;
        
        // Round rectangle
        ctx.beginPath();
        ctx.roundRect(tx, ty, tooltipW, tooltipH, 6);
        ctx.fill();
        ctx.stroke();
        
        // Text drawing
        ctx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        textLines.forEach((line, index) => {
          ctx.fillText(line, tx + 8, ty + 6 + index * 15);
        });
      }
      ctx.restore();
    }
  }, [compiledFunctions, viewport, gridVisible, axisVisible, minorGrid, snapGrid, darkGrid, hoveredPoint, integralA, integralB, activeFuncId, activeTab, sliderVars]);

  // Handle Dragging / Panning graph in 2D
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    
    // Lock start viewport position
    dragStartRef.current = {
      x: px,
      y: py,
      viewport: { ...viewport }
    };
    isDraggingRef.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    
    if (isDraggingRef.current && dragStartRef.current) {
      const dx = px - dragStartRef.current.x;
      const dy = py - dragStartRef.current.y;
      
      const width = rect.width;
      const height = rect.height;
      
      const xSpan = dragStartRef.current.viewport.xMax - dragStartRef.current.viewport.xMin;
      const ySpan = dragStartRef.current.viewport.yMax - dragStartRef.current.viewport.yMin;
      
      const mathDx = (dx / width) * xSpan;
      const mathDy = (dy / height) * ySpan;
      
      setViewport({
        xMin: dragStartRef.current.viewport.xMin - mathDx,
        xMax: dragStartRef.current.viewport.xMax - mathDx,
        yMin: dragStartRef.current.viewport.yMin + mathDy, // Flip Y axis
        yMax: dragStartRef.current.viewport.yMax + mathDy
      });
    } else {
      // Hover analysis of points
      const mx = viewport.xMin + (px / rect.width) * (viewport.xMax - viewport.xMin);
      
      // Find active visible Cartesian function to inspect
      const inspectFunc = compiledFunctions.find(f => f.visible && f.type === 'cartesian' && f.rpnCartesian);
      if (inspectFunc && inspectFunc.rpnCartesian) {
        const my = evaluateEquation(inspectFunc.rpnCartesian, { x: mx, ...sliderVars });
        if (!isNaN(my) && isFinite(my)) {
          // Calculate numerical slope
          const h = 0.0001;
          const yPlus = evaluateEquation(inspectFunc.rpnCartesian, { x: mx + h, ...sliderVars });
          const yMinus = evaluateEquation(inspectFunc.rpnCartesian, { x: mx - h, ...sliderVars });
          const slope = (yPlus - yMinus) / (2 * h);
          
          const dist = Math.sqrt(mx * mx + my * my);
          let angle = Math.atan2(my, mx) * (180 / Math.PI);
          if (angle < 0) angle += 360;
          
          setHoveredPoint({
            x: mx,
            y: my,
            val: my,
            slope,
            dist,
            angle,
            funcName: inspectFunc.name
          });
        } else {
          setHoveredPoint(null);
        }
      } else {
        setHoveredPoint(null);
      }
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    dragStartRef.current = null;
  };

  // Zoom on wheel scroll
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? 1.15 : 0.85;
    zoom(factor);
  };

  // Dragging / rotating in 3D Mode
  const handle3DMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    drag3DStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      rot: { ...rotate3D }
    };
    isDragging3DRef.current = true;
  };

  const handle3DMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging3DRef.current && drag3DStartRef.current) {
      const dx = e.clientX - drag3DStartRef.current.x;
      const dy = e.clientY - drag3DStartRef.current.y;
      
      setRotate3D({
        x: drag3DStartRef.current.rot.x + dy * 0.007,
        y: drag3DStartRef.current.rot.y - dx * 0.007
      });
    }
  };

  const handle3DMouseUp = () => {
    isDragging3DRef.current = false;
    drag3DStartRef.current = null;
  };

  const handle3DWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const factor = e.deltaY > 0 ? -2 : 2;
    setZoom3D(prev => Math.max(10, Math.min(100, prev + factor)));
  };

  // Render 3D Orthographic Mesh Canvas
  useEffect(() => {
    if (activeTab !== '3d') return;
    const canvas = canvas3DRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const width = rect.width;
    const height = rect.height;
    
    const isDark = document.documentElement.classList.contains('dark');
    ctx.fillStyle = isDark ? '#171717' : '#fafafa';
    ctx.fillRect(0, 0, width, height);
    
    // Grid coordinate space: -5 to 5
    const steps = 24;
    const size = 5;
    const dx = (size * 2) / steps;
    
    interface Point3D {
      x: number;
      y: number;
      z: number;
      px: number;
      py: number;
      depth: number;
    }
    
    // Sample heights of f(x, y)
    const points: Point3D[][] = [];
    for (let i = 0; i <= steps; i++) {
      const mx = -size + i * dx;
      points[i] = [];
      for (let j = 0; j <= steps; j++) {
        const my = -size + j * dx;
        
        // Evaluate height
        let mz = 0;
        if (compiled3D) {
          mz = evaluateEquation(compiled3D, { x: mx, y: my, ...sliderVars });
          if (isNaN(mz) || !isFinite(mz)) mz = 0;
        } else {
          // default ripple shape if empty
          mz = Math.cos(Math.sqrt(mx*mx + my*my)) * 1.5;
        }
        
        // Standard 3D matrix rotations
        // 1. Yaw (Y-axis rotation)
        const x1 = mx * Math.cos(rotate3D.y) - mz * Math.sin(rotate3D.y);
        const z1 = mx * Math.sin(rotate3D.y) + mz * Math.cos(rotate3D.y);
        const y1 = my;
        
        // 2. Pitch (X-axis rotation)
        const y2 = y1 * Math.cos(rotate3D.x) - z1 * Math.sin(rotate3D.x);
        const z2 = y1 * Math.sin(rotate3D.x) + z1 * Math.cos(rotate3D.x);
        const x2 = x1;
        
        // Scale projection onto screen coordinates
        const scale = zoom3D;
        const px = width / 2 + x2 * scale;
        const py = height / 2 - y2 * scale;
        
        points[i][j] = {
          x: mx,
          y: my,
          z: mz,
          px,
          py,
          depth: z2
        };
      }
    }
    
    // Create list of Quad Polygons
    interface Quad {
      p1: Point3D;
      p2: Point3D;
      p3: Point3D;
      p4: Point3D;
      avgDepth: number;
    }
    
    const quads: Quad[] = [];
    for (let i = 0; i < steps; i++) {
      for (let j = 0; j < steps; j++) {
        const p1 = points[i][j];
        const p2 = points[i + 1][j];
        const p3 = points[i + 1][j + 1];
        const p4 = points[i][j + 1];
        const avgDepth = (p1.depth + p2.depth + p3.depth + p4.depth) / 4;
        
        quads.push({ p1, p2, p3, p4, avgDepth });
      }
    }
    
    // Painter's sorting algorithm: draw far elements first, near elements last
    quads.sort((a, b) => b.avgDepth - a.avgDepth);
    
    // Draw elements
    quads.forEach((q) => {
      ctx.beginPath();
      ctx.moveTo(q.p1.px, q.p1.py);
      ctx.lineTo(q.p2.px, q.p2.py);
      ctx.lineTo(q.p3.px, q.p3.py);
      ctx.lineTo(q.p4.px, q.p4.py);
      ctx.closePath();
      
      if (style3D === 'surface' || style3D === 'mesh') {
        // Height-based dynamic gradient shading
        const zMid = (q.p1.z + q.p2.z + q.p3.z + q.p4.z) / 4;
        const normalizedH = Math.min(1, Math.max(0, (zMid + 2) / 4)); // clamp to 0-1
        
        // High-end blue-cyan color palette with basic depth shadow
        const rVal = Math.floor(37 + normalizedH * 20);
        const gVal = Math.floor(99 + normalizedH * 100);
        const bVal = Math.floor(235 - normalizedH * 35);
        
        let lightCoeff = 1;
        if (lighting3D) {
          // Basic normal flat shading
          const ux = q.p2.px - q.p1.px;
          const uy = q.p2.py - q.p1.py;
          const vx = q.p3.px - q.p1.px;
          const vy = q.p3.py - q.p1.py;
          
          // Cross-product vector
          const nx = ux * vy - uy * vx;
          const len = Math.sqrt(nx * nx);
          lightCoeff = len !== 0 ? Math.abs(nx / len) : 0.8;
          lightCoeff = 0.5 + 0.5 * lightCoeff; // limit shadow extremes
        }
        
        ctx.fillStyle = `rgba(${Math.floor(rVal * lightCoeff)}, ${Math.floor(gVal * lightCoeff)}, ${Math.floor(bVal * lightCoeff)}, 0.85)`;
        ctx.fill();
      }
      
      if (style3D === 'wireframe' || style3D === 'mesh') {
        ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.18)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    });
    
  }, [equation3D, rotate3D, zoom3D, style3D, lighting3D, activeTab, sliderVars, compiled3D]);

  // Table Data Generator
  const tableRows = useMemo(() => {
    if (!activeCompiledFunc || (!activeCompiledFunc.rpnCartesian && activeCompiledFunc.type !== 'polar')) {
      return [];
    }
    
    const rows = [];
    const minStep = Math.max(0.001, tableStep);
    
    for (let x = tableStart; x <= tableEnd; x += minStep) {
      let y = evaluateEquation(activeCompiledFunc.rpnCartesian || [], { x, ...sliderVars });
      if (isNaN(y) || !isFinite(y)) y = NaN;
      rows.push({ x: parseFloat(x.toFixed(4)), y: isNaN(y) ? 'Undefined' : parseFloat(y.toFixed(4)) });
    }
    
    // Handle table search
    let filtered = rows;
    if (tableSearch) {
      filtered = rows.filter((r) => 
        r.x.toString().includes(tableSearch) || 
        r.y.toString().includes(tableSearch)
      );
    }
    
    // Sort rows
    filtered.sort((a, b) => {
      const valA = typeof a.y === 'string' ? -Infinity : a.y;
      const valB = typeof b.y === 'string' ? -Infinity : b.y;
      return tableSortAsc ? valA - valB : valB - valA;
    });
    
    return filtered;
  }, [activeCompiledFunc, tableStart, tableEnd, tableStep, tableSearch, tableSortAsc, sliderVars]);

  // Numerical analysis statistics calculation
  const liveAnalysis = useMemo(() => {
    if (!activeCompiledFunc || !activeCompiledFunc.rpnCartesian || activeCompiledFunc.type !== 'cartesian') {
      return null;
    }
    
    const rpn = activeCompiledFunc.rpnCartesian;
    const roots: number[] = [];
    const extrema: { type: 'max' | 'min'; x: number; y: number }[] = [];
    
    // Intercepts
    const yIntercept = evaluateEquation(rpn, { x: 0, ...sliderVars });
    
    // Numerical solver using sign crossings & bisection
    const sampleCount = 600;
    const searchMin = -12;
    const searchMax = 12;
    const dX = (searchMax - searchMin) / sampleCount;
    
    let lastY = evaluateEquation(rpn, { x: searchMin, ...sliderVars });
    let lastX = searchMin;
    
    for (let i = 1; i <= sampleCount; i++) {
      const x = searchMin + i * dX;
      const y = evaluateEquation(rpn, { x, ...sliderVars });
      
      if (!isNaN(y) && !isNaN(lastY)) {
        // Sign crossing root finder (Bisection Method)
        if (y * lastY < 0) {
          let rootL = lastX;
          let rootR = x;
          for (let iter = 0; iter < 8; iter++) {
            const mid = (rootL + rootR) / 2;
            const midY = evaluateEquation(rpn, { x: mid, ...sliderVars });
            if (midY * evaluateEquation(rpn, { x: rootL, ...sliderVars }) < 0) {
              rootR = mid;
            } else {
              rootL = mid;
            }
          }
          roots.push(parseFloat(((rootL + rootR) / 2).toFixed(4)));
        }
        
        // Extrema detection (turning points check slope derivative sign changes)
        // Check numerical 1st derivative
        const h = 0.005;
        const dCurrent = (evaluateEquation(rpn, { x: x + h, ...sliderVars }) - evaluateEquation(rpn, { x: x - h, ...sliderVars })) / (2 * h);
        const dLast = (evaluateEquation(rpn, { x: lastX + h, ...sliderVars }) - evaluateEquation(rpn, { x: lastX - h, ...sliderVars })) / (2 * h);
        
        if (dCurrent * dLast < 0 && !isNaN(dCurrent) && !isNaN(dLast)) {
          // Sign cross in derivative indicates extremum
          const isMax = dLast > 0 && dCurrent < 0;
          extrema.push({
            type: isMax ? 'max' : 'min',
            x: parseFloat(((x + lastX) / 2).toFixed(4)),
            y: parseFloat(evaluateEquation(rpn, { x: (x + lastX) / 2, ...sliderVars }).toFixed(4))
          });
        }
      }
      
      lastY = y;
      lastX = x;
    }
    
    // Compute definite integral visual result
    let areaVal = 0;
    const intSteps = 200;
    const stepSize = (integralB - integralA) / intSteps;
    for (let s = 0; s < intSteps; s++) {
      const ix = integralA + (s + 0.5) * stepSize;
      const iy = evaluateEquation(rpn, { x: ix, ...sliderVars });
      if (!isNaN(iy)) {
        areaVal += iy * stepSize;
      }
    }
    
    return {
      roots: roots.slice(0, 4), // limit size
      extrema: extrema.slice(0, 4),
      yIntercept: isNaN(yIntercept) ? 'Undefined' : parseFloat(yIntercept.toFixed(4)),
      area: parseFloat(areaVal.toFixed(4))
    };
  }, [activeCompiledFunc, integralA, integralB, sliderVars]);

  // Multiple functions comparison summary
  const comparisonSummary = useMemo(() => {
    // Collect two visible Cartesian equations
    const list = compiledFunctions.filter(f => f.visible && f.type === 'cartesian' && f.rpnCartesian);
    if (list.length < 2) return null;
    
    const fn1 = list[0];
    const fn2 = list[1];
    
    // Numerical intersections finder
    const intersections: number[] = [];
    let sumDiff = 0;
    let maxDiff = -Infinity;
    let minDiff = Infinity;
    
    const steps = 400;
    const bounds = -10;
    const dx = 20 / steps;
    
    for (let i = 0; i <= steps; i++) {
      const x = bounds + i * dx;
      const y1 = evaluateEquation(fn1.rpnCartesian!, { x, ...sliderVars });
      const y2 = evaluateEquation(fn2.rpnCartesian!, { x, ...sliderVars });
      
      if (!isNaN(y1) && !isNaN(y2)) {
        const diff = Math.abs(y1 - y2);
        sumDiff += diff * dx;
        if (diff > maxDiff) maxDiff = diff;
        if (diff < minDiff) minDiff = diff;
        
        // Sign crossing difference (intersections)
        if (i > 0) {
          const prevX = x - dx;
          const prevY1 = evaluateEquation(fn1.rpnCartesian!, { x: prevX, ...sliderVars });
          const prevY2 = evaluateEquation(fn2.rpnCartesian!, { x: prevX, ...sliderVars });
          
          if ((y1 - y2) * (prevY1 - prevY2) < 0) {
            intersections.push(parseFloat(((x + prevX) / 2).toFixed(4)));
          }
        }
      }
    }
    
    return {
      f1Name: fn1.name,
      f2Name: fn2.name,
      intersections: intersections.slice(0, 4),
      areaBetween: parseFloat(sumDiff.toFixed(4)),
      maxDiff: isFinite(maxDiff) ? parseFloat(maxDiff.toFixed(4)) : 0,
      minDiff: isFinite(minDiff) ? parseFloat(minDiff.toFixed(4)) : 0
    };
  }, [compiledFunctions, sliderVars]);

  // Rule-based smart insights
  const smartInsights = useMemo(() => {
    const insights: string[] = [];
    if (!activeCompiledFunc || !activeCompiledFunc.rpnCartesian) {
      return ["No active equation to analyze. Try entering one like 'x^2 - 4'."];
    }
    
    const rpn = activeCompiledFunc.rpnCartesian;
    
    // Check parity (Symmetry)
    let isEven = true;
    let isOdd = true;
    const testPoints = [-3, -1, 1, 3];
    testPoints.forEach((val) => {
      const yPos = evaluateEquation(rpn, { x: val, ...sliderVars });
      const yNeg = evaluateEquation(rpn, { x: -val, ...sliderVars });
      if (!isNaN(yPos) && !isNaN(yNeg)) {
        if (Math.abs(yPos - yNeg) > 0.01) isEven = false;
        if (Math.abs(yPos + yNeg) > 0.01) isOdd = false;
      } else {
        isEven = false;
        isOdd = false;
      }
    });
    
    if (isEven) insights.push("The graph is symmetric about the y-axis (Even Function).");
    if (isOdd) insights.push("The graph has rotational symmetry about the origin (Odd Function).");
    
    // Behavior Check
    const yAtBigX = evaluateEquation(rpn, { x: 100, ...sliderVars });
    const yAtNegBigX = evaluateEquation(rpn, { x: -100, ...sliderVars });
    
    if (yAtBigX > 1000 && yAtNegBigX > 1000) {
      insights.push("End behavior: The function approaches positive infinity as x approaches ±∞.");
    } else if (yAtBigX < -1000 && yAtNegBigX < -1000) {
      insights.push("End behavior: The function approaches negative infinity as x approaches ±∞.");
    } else if (yAtBigX > 1000 && yAtNegBigX < -1000) {
      insights.push("End Behavior: The function approaches +∞ as x → +∞, and -∞ as x → -∞.");
    }
    
    if (liveAnalysis) {
      if (liveAnalysis.roots.length === 0) {
        insights.push("The function does not cross the x-axis in the tested range (no real roots).");
      } else {
        insights.push(`The function has ${liveAnalysis.roots.length} real root(s) in this coordinate window.`);
      }
      
      if (liveAnalysis.extrema.length > 0) {
        insights.push(`The graph has ${liveAnalysis.extrema.length} local turning points (critical coordinates).`);
      }
    }
    
    return insights.length > 0 ? insights : ["Calculating complex insights. The function behaves normally across the testing grid."];
  }, [activeCompiledFunc, liveAnalysis, sliderVars]);

  // Export functions
  const exportPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `calculatoora-graph-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const exportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,X,Y\n';
    tableRows.forEach((r) => {
      csvContent += `${r.x},${r.y}\n`;
    });
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'calculatoora-data-table.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="graphing-calculator-container" className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-slate-800 dark:text-slate-100 select-none">
      
      {/* 1. LEFT CONTROLS PANEL (width 5 cols on lg) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* TAB SWITCHERS */}
        <div className="flex flex-wrap bg-white/70 dark:bg-neutral-900/80 backdrop-blur-md rounded-xl p-1.5 border border-slate-200/50 dark:border-neutral-800/60 shadow-sm gap-1">
          <button
            id="tab-functions"
            onClick={() => setActiveTab('functions')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'functions' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Functions
          </button>
          
          <button
            id="tab-analysis"
            onClick={() => setActiveTab('analysis')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'analysis' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Analysis
          </button>
          
          <button
            id="tab-comparison"
            onClick={() => setActiveTab('comparison')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'comparison' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Compare
          </button>
          
          <button
            id="tab-table"
            onClick={() => setActiveTab('table')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === 'table' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            Table
          </button>

          <button
            id="tab-3d"
            onClick={() => setActiveTab('3d')}
            className={`flex-1 py-2 px-3 text-xs font-bold rounded-lg transition-all duration-200 flex items-center justify-center gap-2 ${
              activeTab === '3d' 
                ? 'bg-blue-600 text-white shadow-md' 
                : 'text-slate-500 dark:text-neutral-400 hover:bg-slate-100 dark:hover:bg-neutral-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            3D Mode
          </button>
        </div>

        {/* TABS INNER BODY CONTAINER */}
        <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-neutral-800/60 shadow-lg min-h-[450px]">
          
          {/* TAB 1: FUNCTIONS MANAGEMENT */}
          {activeTab === 'functions' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-neutral-800 pb-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-blue-500" />
                  Unlimited Functions
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => addFunction('cartesian')}
                    className="p-1 px-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold rounded-lg hover:bg-blue-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    y=f(x)
                  </button>
                  <button
                    onClick={() => addFunction('polar')}
                    className="p-1 px-2.5 bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 text-xs font-bold rounded-lg hover:bg-purple-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    r=f(θ)
                  </button>
                  <button
                    onClick={() => addFunction('parametric')}
                    className="p-1 px-2.5 bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 text-xs font-bold rounded-lg hover:bg-orange-100 transition flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    x,y(t)
                  </button>
                </div>
              </div>

              {/* LIST OF EQUATIONS */}
              <div className="flex flex-col gap-3.5 max-h-[350px] overflow-y-auto pr-1">
                {compiledFunctions.map((fn, idx) => (
                  <div 
                    key={fn.id}
                    onClick={() => setActiveFuncId(fn.id)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                      activeFuncId === fn.id
                        ? 'bg-blue-50/50 dark:bg-blue-950/10 border-blue-500/40 shadow-sm'
                        : 'bg-slate-50/50 dark:bg-neutral-800/20 border-slate-100 dark:border-neutral-800/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        {/* Function Color Circle */}
                        <div 
                          className="w-3.5 h-3.5 rounded-full border border-white dark:border-neutral-900 shadow-sm flex-shrink-0"
                          style={{ backgroundColor: fn.color }}
                        />
                        <span className="text-xs font-mono font-semibold text-slate-400 dark:text-neutral-500">
                          {fn.name}
                        </span>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-1.5 opacity-80 hover:opacity-100">
                        <button
                          title="Hide/Show"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, visible: !f.visible } : f));
                          }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded text-slate-500 transition"
                        >
                          {fn.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-rose-500" />}
                        </button>
                        <button
                          title="Duplicate"
                          onClick={(e) => { e.stopPropagation(); duplicateFunction(fn.id); }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded text-slate-500 transition"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Delete"
                          onClick={(e) => { e.stopPropagation(); deleteFunction(fn.id); }}
                          className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded text-rose-500 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Expression Box */}
                    {fn.type === 'parametric' ? (
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">x(t) =</span>
                          <input
                            type="text"
                            placeholder="e.g. 4*cos(t)"
                            value={fn.parametricX || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, parametricX: v } : f));
                            }}
                            className="flex-1 bg-white dark:bg-neutral-950 px-2.5 py-1 text-xs font-mono border border-slate-200 dark:border-neutral-800 rounded focus:border-blue-500 outline-none transition"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">y(t) =</span>
                          <input
                            type="text"
                            placeholder="e.g. 3*sin(t)"
                            value={fn.parametricY || ''}
                            onChange={(e) => {
                              const v = e.target.value;
                              setFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, parametricY: v } : f));
                            }}
                            className="flex-1 bg-white dark:bg-neutral-950 px-2.5 py-1 text-xs font-mono border border-slate-200 dark:border-neutral-800 rounded focus:border-blue-500 outline-none transition"
                          />
                        </div>
                      </div>
                    ) : fn.type === 'scatter' ? (
                      <div className="text-xs text-slate-500 dark:text-neutral-400 bg-slate-100/50 dark:bg-neutral-950 p-2 rounded border border-slate-100 dark:border-neutral-800/50">
                        Scatter Plot ({fn.scatterPoints?.length} Points). Check stats tab to configure custom tables.
                      </div>
                    ) : (
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                          {fn.type === 'polar' ? 'r = ' : 'y = '}
                        </span>
                        <input
                          type="text"
                          placeholder={fn.type === 'polar' ? 'e.g. 4*cos(3*theta)' : fn.type === 'implicit' ? 'e.g. x^2 + y^2 = 25' : 'e.g. x^2 - 3x - 4'}
                          value={fn.expression}
                          onChange={(e) => {
                            const v = e.target.value;
                            setFunctions(prev => prev.map(f => f.id === fn.id ? { ...f, expression: v } : f));
                          }}
                          className="w-full bg-white dark:bg-neutral-950 pl-10 pr-3 py-1.5 text-xs font-mono border border-slate-200 dark:border-neutral-800 rounded focus:border-blue-500 outline-none transition"
                        />
                      </div>
                    )}

                    {/* Syntax error flagger */}
                    {fn.error && (
                      <div className="text-[10px] text-rose-500 mt-1.5 font-mono bg-rose-500/5 p-1 px-2 rounded">
                        ⚠️ {fn.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* SLIDERS SECTION */}
              <div className="border-t border-slate-100 dark:border-neutral-800 pt-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-2 flex items-center justify-between">
                  <span>ANIMATION SLIDERS</span>
                  <Sliders className="w-3 h-3 text-slate-400" />
                </h4>
                
                <div className="flex flex-col gap-3">
                  {sliders.map((s) => (
                    <div key={s.id} className="bg-slate-50 dark:bg-neutral-800/10 p-2.5 rounded-lg border border-slate-100 dark:border-neutral-800/30">
                      <div className="flex items-center justify-between text-xs font-mono mb-1">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-blue-600 dark:text-cyan-400">{s.name}</span>
                          <span className="text-slate-400">=</span>
                          <span className="font-bold">{s.val}</span>
                        </div>
                        <button
                          onClick={() => {
                            setSliders(prev => prev.map(v => v.id === s.id ? { ...v, isAnimating: !v.isAnimating } : v));
                          }}
                          className={`p-1 rounded text-[10px] uppercase font-bold transition flex items-center gap-1 ${
                            s.isAnimating ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-700' : 'bg-slate-200 dark:bg-neutral-800 text-slate-600 hover:bg-slate-300'
                          }`}
                        >
                          {s.isAnimating ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5" />}
                          {s.isAnimating ? 'Pause' : 'Animate'}
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-slate-400">{s.min}</span>
                        <input
                          type="range"
                          min={s.min}
                          max={s.max}
                          step={s.step}
                          value={s.val}
                          onChange={(e) => {
                            const val = parseFloat(parseFloat(e.target.value).toFixed(2));
                            setSliders(prev => prev.map(v => v.id === s.id ? { ...v, val } : v));
                          }}
                          className="flex-1 accent-blue-600 h-1 rounded-lg cursor-pointer bg-slate-200 dark:bg-neutral-800"
                        />
                        <span className="text-[10px] font-mono text-slate-400">{s.max}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: LIVE ANALYSIS & INTEGRAL CALCULATOR */}
          {activeTab === 'analysis' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 border-b border-slate-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Live Analysis & Calculus
              </h3>
              
              <div className="text-xs text-slate-500 dark:text-neutral-400 mb-2">
                Analyzing Active Equation: <strong className="text-blue-600 dark:text-cyan-400">{activeCompiledFunc.name} = {activeCompiledFunc.expression || 'Empty'}</strong>
              </div>

              {liveAnalysis ? (
                <div className="flex flex-col gap-3.5">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase">Y-Intercept</span>
                      <p className="text-sm font-mono font-bold mt-0.5">{liveAnalysis.yIntercept}</p>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase">Roots (X Intercepts)</span>
                      <p className="text-xs font-mono font-bold mt-0.5 max-h-12 overflow-y-auto">
                        {liveAnalysis.roots.length > 0 ? liveAnalysis.roots.join(', ') : 'None Found'}
                      </p>
                    </div>
                  </div>

                  <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase block mb-1">Local Extrema (Max/Min)</span>
                    <div className="flex flex-col gap-1 max-h-24 overflow-y-auto">
                      {liveAnalysis.extrema.length > 0 ? (
                        liveAnalysis.extrema.map((ex, idx) => (
                          <div key={idx} className="flex justify-between items-center text-xs font-mono border-b border-slate-100 dark:border-neutral-800/30 pb-0.5">
                            <span className={`capitalize font-bold ${ex.type === 'max' ? 'text-emerald-500' : 'text-rose-500'}`}>{ex.type}</span>
                            <span>({ex.x}, {ex.y})</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-xs text-slate-400">None in visible bounds.</span>
                      )}
                    </div>
                  </div>

                  {/* DEFINITE INTEGRAL CALCULATOR BOUNDS */}
                  <div className="bg-blue-50/50 dark:bg-blue-950/10 p-3.5 rounded-xl border border-blue-100 dark:border-blue-900/40 mt-1">
                    <span className="text-[11px] font-bold text-blue-600 dark:text-cyan-400 uppercase block mb-2">Definite Integral Tool (Shaded area)</span>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono">Start Interval (a)</label>
                        <input
                          type="number"
                          value={integralA}
                          onChange={(e) => setIntegralA(Number(e.target.value))}
                          className="w-full bg-white dark:bg-neutral-950 text-xs font-mono p-1 border border-slate-200 dark:border-neutral-800 rounded mt-0.5"
                        />
                      </div>
                      
                      <div>
                        <label className="text-[10px] text-slate-400 font-mono">End Interval (b)</label>
                        <input
                          type="number"
                          value={integralB}
                          onChange={(e) => setIntegralB(Number(e.target.value))}
                          className="w-full bg-white dark:bg-neutral-950 text-xs font-mono p-1 border border-slate-200 dark:border-neutral-800 rounded mt-0.5"
                        />
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white dark:bg-neutral-950 p-2 rounded border border-slate-100 dark:border-neutral-800/40">
                      <span className="text-xs font-mono text-slate-400">∫ a→b f(x)dx =</span>
                      <span className="font-mono text-sm font-bold text-blue-600 dark:text-cyan-400">{liveAnalysis.area}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-10">
                  Select a Cartesian y=f(x) function to view roots, intercepts, extrema, and integrate.
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FUNCTION COMPARISONS */}
          {activeTab === 'comparison' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 border-b border-slate-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-500" />
                Multi-Function Comparison
              </h3>
              
              {comparisonSummary ? (
                <div className="flex flex-col gap-3.5">
                  <div className="text-xs bg-violet-50 dark:bg-violet-950/20 text-violet-700 dark:text-violet-300 p-2.5 rounded-lg border border-violet-100 dark:border-violet-900/20">
                    Comparing visible equations: <strong className="font-mono">{comparisonSummary.f1Name}</strong> and <strong className="font-mono">{comparisonSummary.f2Name}</strong>.
                  </div>

                  <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase block mb-1">Intersections (Sign Crossings)</span>
                    <p className="text-xs font-mono font-bold">
                      {comparisonSummary.intersections.length > 0 
                        ? comparisonSummary.intersections.map(x => `x = ${x}`).join(', ') 
                        : 'None in test range.'}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                    <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase block mb-1">Integral Area Between Curves</span>
                    <p className="text-sm font-mono font-bold text-violet-600 dark:text-violet-400">{comparisonSummary.areaBetween}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase">Max Gap Difference</span>
                      <p className="text-sm font-mono font-bold mt-0.5">{comparisonSummary.maxDiff}</p>
                    </div>
                    
                    <div className="bg-slate-50 dark:bg-neutral-800/20 p-3 rounded-xl border border-slate-100 dark:border-neutral-800/40">
                      <span className="text-[10px] font-bold text-slate-400 dark:text-neutral-500 uppercase">Min Gap Difference</span>
                      <p className="text-sm font-mono font-bold mt-0.5">{comparisonSummary.minDiff}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-400 text-center py-10">
                  Ensure at least 2 Cartesian y=f(x) equations are visible to run comparisons.
                </div>
              )}
            </div>
          )}

          {/* TAB 4: AUTOMATIC TABLE VIEW */}
          {activeTab === 'table' && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 border-b border-slate-100 dark:border-neutral-800 pb-2 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
                  Generated Table
                </span>
                <button
                  onClick={exportCSV}
                  className="p-1 px-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold rounded hover:bg-emerald-100 transition flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Export CSV
                </button>
              </h3>

              <div className="grid grid-cols-3 gap-1.5 text-[10px] font-mono">
                <div>
                  <label className="text-slate-400">Start X</label>
                  <input
                    type="number"
                    value={tableStart}
                    onChange={(e) => setTableStart(Number(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 p-1 border border-slate-200 dark:border-neutral-800 rounded mt-0.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400">End X</label>
                  <input
                    type="number"
                    value={tableEnd}
                    onChange={(e) => setTableEnd(Number(e.target.value))}
                    className="w-full bg-white dark:bg-neutral-950 p-1 border border-slate-200 dark:border-neutral-800 rounded mt-0.5 text-xs"
                  />
                </div>
                <div>
                  <label className="text-slate-400">Step Size</label>
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={tableStep}
                    onChange={(e) => setTableStep(Math.max(0.1, Number(e.target.value)))}
                    className="w-full bg-white dark:bg-neutral-950 p-1 border border-slate-200 dark:border-neutral-800 rounded mt-0.5 text-xs"
                  />
                </div>
              </div>

              {/* Table search & sort */}
              <div className="flex gap-2 my-1">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search coordinates..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="w-full bg-white dark:bg-neutral-950 pl-7 pr-2 py-1 text-xs border border-slate-200 dark:border-neutral-800 rounded outline-none"
                  />
                </div>
                <button
                  onClick={() => setTableSortAsc(!tableSortAsc)}
                  className="p-1 px-2.5 bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-300 text-xs rounded hover:bg-slate-200 transition flex items-center gap-1"
                >
                  <ArrowUpDown className="w-3 h-3" />
                  Sort Y
                </button>
              </div>

              {/* SpreadSheet table */}
              <div className="overflow-y-auto max-h-[220px] rounded border border-slate-100 dark:border-neutral-800">
                <table className="w-full text-left text-xs font-mono border-collapse bg-white dark:bg-neutral-950">
                  <thead className="bg-slate-50 dark:bg-neutral-900 sticky top-0 text-slate-400 border-b border-slate-200 dark:border-neutral-800">
                    <tr>
                      <th className="p-2 border-r border-slate-100 dark:border-neutral-800/40">X Coordinate</th>
                      <th className="p-2">Y (Value)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/30">
                    {tableRows.slice(0, 100).map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-50/20 dark:hover:bg-blue-950/5">
                        <td className="p-2 border-r border-slate-100 dark:border-neutral-800/40 text-slate-500">{row.x}</td>
                        <td className="p-2 font-bold text-blue-600 dark:text-cyan-400">{row.y}</td>
                      </tr>
                    ))}
                    {tableRows.length === 0 && (
                      <tr>
                        <td colSpan={2} className="text-center p-4 text-slate-400">No matching row values found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: 3D MATHEMATICAL TOPOLOGY MODE */}
          {activeTab === '3d' && (
            <div className="flex flex-col gap-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-neutral-400 border-b border-slate-100 dark:border-neutral-800 pb-2 flex items-center gap-2">
                <Box className="w-4 h-4 text-cyan-500" />
                3D Function Plotter
              </h3>

              <div className="text-xs text-slate-500 dark:text-neutral-400 mb-1">
                Enter a 3D height topology equation: <strong className="text-blue-600 dark:text-cyan-400">z = f(x, y)</strong>
              </div>

              {/* 3D equation text box */}
              <div className="relative">
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  z =
                </span>
                <input
                  type="text"
                  placeholder="e.g. cos(sqrt(x^2 + y^2)) * 1.5"
                  value={equation3D}
                  onChange={(e) => setEquation3D(e.target.value)}
                  className="w-full bg-white dark:bg-neutral-950 pl-10 pr-3 py-2 text-xs font-mono border border-slate-200 dark:border-neutral-800 rounded focus:border-blue-500 outline-none transition"
                />
              </div>

              {/* Drag/rotations helper */}
              <p className="text-[10px] text-slate-400 font-mono italic">
                💡 Left-click and DRAG the 3D surface to rotate the viewport. Scroll wheel to zoom.
              </p>

              {/* Rendering details configuration */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <label className="text-[10px] text-slate-400 uppercase font-bold block mb-1">Render Style</label>
                  <select
                    value={style3D}
                    onChange={(e) => setStyle3D(e.target.value as any)}
                    className="w-full bg-white dark:bg-neutral-950 text-xs p-1.5 border border-slate-200 dark:border-neutral-800 rounded font-mono"
                  >
                    <option value="surface">Filled Shading</option>
                    <option value="wireframe">Wireframe Grid</option>
                    <option value="mesh">Mesh Surface</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <input
                    type="checkbox"
                    id="lighting-toggle"
                    checked={lighting3D}
                    onChange={(e) => setLighting3D(e.target.checked)}
                    className="accent-blue-600"
                  />
                  <label htmlFor="lighting-toggle" className="text-xs font-semibold text-slate-600 dark:text-neutral-400 cursor-pointer select-none">
                    Flat Lighting
                  </label>
                </div>
              </div>

              {/* Visual 3D Canvas Box */}
              <div className="relative rounded-xl overflow-hidden border border-slate-200/50 dark:border-neutral-800/60 shadow-inner mt-2">
                <canvas
                  ref={canvas3DRef}
                  onMouseDown={handle3DMouseDown}
                  onMouseMove={handle3DMouseMove}
                  onMouseUp={handle3DMouseUp}
                  onMouseLeave={handle3DMouseUp}
                  onWheel={handle3DWheel}
                  className="w-full h-[220px] block cursor-grab active:cursor-grabbing bg-slate-50 dark:bg-neutral-900"
                />
              </div>
            </div>
          )}

        </div>

        {/* EXAMPLES PRESETS */}
        <div className="bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md rounded-2xl p-5 border border-slate-200/50 dark:border-neutral-800/60 shadow-md">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            LOAD PRESET EXAMPLES
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'quadratic', label: 'Quadratic Curve' },
              { id: 'circle', label: 'Circle (Implicit)' },
              { id: 'ellipse', label: 'Ellipse (Implicit)' },
              { id: 'hyperbola', label: 'Hyperbola' },
              { id: 'sine', label: 'Sine & Sliders' },
              { id: 'polar', label: 'Rose polar' },
              { id: 'parametric', label: 'Ellipse parametric' },
              { id: 'stats', label: 'Scatter Regression' }
            ].map((preset) => (
              <button
                key={preset.id}
                onClick={() => loadExample(preset.id)}
                className="p-1 px-2.5 bg-slate-100 hover:bg-blue-600 hover:text-white dark:bg-neutral-800/50 dark:hover:bg-blue-600 text-[11px] font-bold rounded-lg text-slate-600 dark:text-neutral-300 transition"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* 2. RIGHT GRAPH VISUALIZER PANEL (width 7 cols on lg) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* VIEWPORT GRAPH STAGE CARDS */}
        <div className={`relative bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200/60 dark:border-neutral-800/60 shadow-xl overflow-hidden group transition-all duration-300 ${
          isFullscreen ? 'fixed inset-0 z-50 rounded-none' : ''
        }`}>
          
          {/* HEADER OPTIONS */}
          <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10 pointer-events-none">
            
            {/* Viewport Scale Indicator */}
            <div className="bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-slate-200/50 dark:border-neutral-800/60 text-[10px] font-mono p-1 px-2 rounded-lg pointer-events-auto text-slate-500 dark:text-neutral-400 shadow-sm flex items-center gap-2">
              <span className="font-bold">X:</span> [{viewport.xMin.toFixed(1)}, {viewport.xMax.toFixed(1)}]
              <span className="font-bold">Y:</span> [{viewport.yMin.toFixed(1)}, {viewport.yMax.toFixed(1)}]
            </div>

            {/* Quick Canvas Actions toolbar */}
            <div className="flex items-center gap-1.5 pointer-events-auto">
              <button
                onClick={() => zoom(0.8)}
                title="Zoom In"
                className="w-8 h-8 rounded-lg bg-white/90 dark:bg-neutral-950/90 hover:bg-blue-600 hover:text-white backdrop-blur-md text-slate-600 dark:text-neutral-300 border border-slate-200/50 dark:border-neutral-800/60 transition shadow-sm flex items-center justify-center"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              
              <button
                onClick={() => zoom(1.2)}
                title="Zoom Out"
                className="w-8 h-8 rounded-lg bg-white/90 dark:bg-neutral-950/90 hover:bg-blue-600 hover:text-white backdrop-blur-md text-slate-600 dark:text-neutral-300 border border-slate-200/50 dark:border-neutral-800/60 transition shadow-sm flex items-center justify-center"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <button
                onClick={resetView}
                title="Reset Coordinates"
                className="w-8 h-8 rounded-lg bg-white/90 dark:bg-neutral-950/90 hover:bg-blue-600 hover:text-white backdrop-blur-md text-slate-600 dark:text-neutral-300 border border-slate-200/50 dark:border-neutral-800/60 transition shadow-sm flex items-center justify-center"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                title="Fullscreen"
                className="w-8 h-8 rounded-lg bg-white/90 dark:bg-neutral-950/90 hover:bg-blue-600 hover:text-white backdrop-blur-md text-slate-600 dark:text-neutral-300 border border-slate-200/50 dark:border-neutral-800/60 transition shadow-sm flex items-center justify-center"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>

          </div>

          {/* ACTIVE 2D PLOT CANVAS CANVAS */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onWheel={handleWheel}
            style={{ height: isFullscreen ? '100vh' : `${graphHeight}px` }}
            className="w-full block cursor-crosshair bg-slate-50 dark:bg-neutral-900 transition-colors"
          />

          {/* LOWER RIGHT GRID GRID OPTIONS DRAWER (Absolute inside Canvas) */}
          <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center pointer-events-none z-10">
            
            {/* Dynamic Hover point description */}
            <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-200/40 text-[10px] text-slate-400 font-mono">
              💡 Left click drag to Pan. Mouse Wheel to Zoom.
            </div>

            {/* Grid togglers toolbar */}
            <div className="bg-white/95 dark:bg-neutral-950/95 border border-slate-200/50 dark:border-neutral-800/60 p-1.5 rounded-xl pointer-events-auto shadow-md flex items-center gap-1.5 text-xs">
              <button
                onClick={() => setGridVisible(!gridVisible)}
                className={`p-1 px-2 rounded-lg transition-all text-[10px] font-mono font-bold ${
                  gridVisible ? 'bg-blue-500 text-white' : 'text-slate-400 dark:text-neutral-500'
                }`}
              >
                Grid
              </button>
              
              <button
                onClick={() => setAxisVisible(!axisVisible)}
                className={`p-1 px-2 rounded-lg transition-all text-[10px] font-mono font-bold ${
                  axisVisible ? 'bg-blue-500 text-white' : 'text-slate-400 dark:text-neutral-500'
                }`}
              >
                Axes
              </button>

              <button
                onClick={() => setMinorGrid(!minorGrid)}
                className={`p-1 px-2 rounded-lg transition-all text-[10px] font-mono font-bold ${
                  minorGrid ? 'bg-blue-500 text-white' : 'text-slate-400 dark:text-neutral-500'
                }`}
              >
                Minor
              </button>
            </div>

          </div>

        </div>

        {/* BOTTOM SECTION: ANALYTICS DASHBOARD & SMART INSIGHTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Live Dashboard metrics */}
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-neutral-800/60 shadow-lg">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
              <LineChart className="w-3.5 h-3.5 text-blue-500" />
              LIVE METRICS DASHBOARD
            </h4>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="border-b border-slate-100 dark:border-neutral-800 pb-2">
                <span className="text-slate-400 block">Total Functions</span>
                <strong className="text-sm font-bold">{functions.length}</strong>
              </div>
              <div className="border-b border-slate-100 dark:border-neutral-800 pb-2">
                <span className="text-slate-400 block">Visible Graphs</span>
                <strong className="text-sm font-bold text-emerald-500">
                  {functions.filter(f => f.visible).length}
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Active Equation Type</span>
                <strong className="text-sm capitalize text-blue-600 dark:text-cyan-400">{activeCompiledFunc.type}</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Formula Plotter</span>
                <strong className="text-sm text-purple-500">Pure Client-side</strong>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-neutral-800">
              <button
                onClick={exportPNG}
                className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-blue-500" /> Export PNG
              </button>
              <button
                onClick={clearAll}
                className="py-2 px-4 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1"
              >
                Clear All
              </button>
            </div>
          </div>

          {/* Smart Insights summary cards */}
          <div className="bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md rounded-2xl p-6 border border-slate-200/60 dark:border-neutral-800/60 shadow-lg flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-neutral-500 mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              SMART ALGEBRAIC INSIGHTS
            </h4>
            <div className="flex-1 flex flex-col gap-2 overflow-y-auto max-h-[140px] pr-1">
              {smartInsights.map((ins, idx) => (
                <div key={idx} className="flex gap-2 text-xs text-slate-600 dark:text-neutral-300 leading-relaxed bg-amber-50/20 dark:bg-amber-950/5 p-2 rounded-lg border border-amber-500/10">
                  <span className="text-amber-500 font-bold select-none">✦</span>
                  <p>{ins}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* SEO & Educational Section */}
      <div className="lg:col-span-12 mt-16 bg-white/40 dark:bg-neutral-900/40 backdrop-blur-md rounded-2xl p-8 md:p-12 border border-slate-200/50 dark:border-neutral-800/50 shadow-xl space-y-12 select-text">
        <header className="border-b border-slate-200 dark:border-neutral-800 pb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            The Ultimate Guide to Using a <span className="text-blue-600 dark:text-cyan-400">Graphing Calculator</span>
          </h2>
          <p className="mt-2 text-slate-500 dark:text-neutral-400 leading-relaxed text-sm">
            Learn the foundational mechanics of cartesian plotting, polar grids, parametric paths, and live calculus analysis.
          </p>
        </header>

        {/* 1. What Is a Graphing Calculator? */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
            What Is a Graphing Calculator?
          </h3>
          <p className="text-slate-600 dark:text-neutral-300 leading-relaxed text-sm">
            A <strong>Graphing Calculator</strong> is a specialized mathematical visualization tool capable of plotting 2D and 3D functions, solving simultaneous equations, and performing complex calculus operations. While traditional scientific calculators return numerical solutions, graphing tools map mathematical expressions onto Cartesian coordinate grids or custom coordinate systems (like polar grids). This unlocks deep intuitive understandings of function behavior, roots, asymptotes, and rates of change.
          </p>
        </section>

        {/* 2. How to Graph Equations */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
            How to Graph Equations
          </h3>
          <p className="text-slate-600 dark:text-neutral-300 leading-relaxed text-sm">
            Plotting functions inside our browser-based graphing engine is simple:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600 dark:text-neutral-300">
            <li>Choose your coordinate system (Cartesian <code className="bg-slate-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-cyan-400 font-mono">y = f(x)</code>, Polar <code className="bg-slate-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-blue-600 dark:text-cyan-400 font-mono">r = f(θ)</code>, or Parametric).</li>
            <li>Input your mathematical expression using standard operators (<code className="font-mono">+</code>, <code className="font-mono">-</code>, <code className="font-mono">*</code>, <code className="font-mono">/</code>, <code className="font-mono">^</code>) and functions (like <code className="font-mono">sin</code>, <code className="font-mono">cos</code>, <code className="font-mono">ln</code>).</li>
            <li>Press Enter or watch the canvas render instantly as you type!</li>
            <li>Pinch or use your mouse wheel to zoom, and drag with your mouse cursor to pan around the coordinate viewport.</li>
          </ol>
        </section>

        {/* 3. Deep-Dive Math Concepts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Cartesian Coordinates */}
          <div className="space-y-3 bg-slate-50/50 dark:bg-neutral-800/25 p-5 rounded-xl border border-slate-100 dark:border-neutral-800/40">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Cartesian Coordinates</h4>
            <p className="text-slate-600 dark:text-neutral-300 text-xs leading-relaxed">
              Named after René Descartes, the Cartesian coordinate system maps points in 2D space using horizontal (X) and vertical (Y) axes. Any point is uniquely defined by an ordered pair <code className="font-mono">(x, y)</code> representing perpendicular distances from the origin (0,0).
            </p>
          </div>

          {/* Polar Graphs */}
          <div className="space-y-3 bg-slate-50/50 dark:bg-neutral-800/25 p-5 rounded-xl border border-slate-100 dark:border-neutral-800/40">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Polar Graphs</h4>
            <p className="text-slate-600 dark:text-neutral-300 text-xs leading-relaxed">
              Polar coordinates represent points via distance from origin <code className="font-mono">r</code> and angle of rotation <code className="font-mono">θ</code> (theta). This system is ideal for sketching circular patterns, cardioids, and spiral structures where Cartesian equations would be extremely convoluted.
            </p>
          </div>

          {/* Parametric Equations */}
          <div className="space-y-3 bg-slate-50/50 dark:bg-neutral-800/25 p-5 rounded-xl border border-slate-100 dark:border-neutral-800/40">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Parametric Equations</h4>
            <p className="text-slate-600 dark:text-neutral-300 text-xs leading-relaxed">
              In parametric equations, coordinates <code className="font-mono">x</code> and <code className="font-mono">y</code> are not expressed directly in terms of each other, but rather independently through a helper variable <code className="font-mono">t</code> (the parameter, often representing time). This allows plotting intricate self-intersecting loops and complex orbits.
            </p>
          </div>

          {/* Polynomial & Trig Functions */}
          <div className="space-y-3 bg-slate-50/50 dark:bg-neutral-800/25 p-5 rounded-xl border border-slate-100 dark:border-neutral-800/40">
            <h4 className="font-bold text-slate-900 dark:text-white text-base">Polynomials & Trig</h4>
            <p className="text-slate-600 dark:text-neutral-300 text-xs leading-relaxed">
              Polynomials (like quadratic curves) model gravity and projectiles, while Trigonometric functions (<code className="font-mono">sin(x)</code>, <code className="font-mono">cos(x)</code>) represent periodic waves, sound frequencies, and optical oscillations.
            </p>
          </div>
        </div>

        {/* 4. Live Calculus Analysis Explainer */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
            Live Calculus: Slope, Area & Derivatives
          </h3>
          <p className="text-slate-600 dark:text-neutral-300 leading-relaxed text-sm">
            Modern graphing software doesn't stop at visualization. Advanced calculation metrics reveal:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-600 dark:text-neutral-300">
            <li><strong>Slope & Derivatives:</strong> The derivative at any point represents the rate of change or instantaneous slope. Geometrically, this corresponds to the slope of the tangent line touching the curve at that precise coordinate.</li>
            <li><strong>Area Under the Curve (Integrals):</strong> Definitive integration accumulates the net area bounded by the function curve and the horizontal x-axis between two boundary limits <code className="font-mono">[a, b]</code>. This serves fundamental roles in probability, geometry, and physics.</li>
            <li><strong>Graph Interpretation:</strong> Dynamic charts identify inflection points, roots (where <code className="font-mono">y = 0</code>), extrema (crests and valleys), and asymptotic lines where values approach infinity.</li>
          </ul>
        </section>

        {/* 5. High-Impact Examples */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
            Mathematical Presets & Examples
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600 dark:text-neutral-300 border border-slate-100 dark:border-neutral-800/40 rounded-xl overflow-hidden">
              <thead className="bg-slate-100/50 dark:bg-neutral-800/40 text-slate-700 dark:text-white text-xs uppercase font-mono">
                <tr>
                  <th className="p-3">Category</th>
                  <th className="p-3">Equation</th>
                  <th className="p-3">Behavior / Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-neutral-800/40 text-xs">
                <tr>
                  <td className="p-3 font-semibold">Trigonometric Wave</td>
                  <td className="p-3 font-mono text-blue-600 dark:text-cyan-400">sin(x) * cos(x/2)</td>
                  <td className="p-3">Produces structured harmonic wave peaks with fluctuating envelopes.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Damped Sine Wave</td>
                  <td className="p-3 font-mono text-blue-600 dark:text-cyan-400">sin(5*x) / x</td>
                  <td className="p-3">Classic sinc function illustrating decaying oscillation cycles toward infinity.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Polar Rose</td>
                  <td className="p-3 font-mono text-blue-600 dark:text-cyan-400">4 * sin(5*theta)</td>
                  <td className="p-3">Symmetric polar equation creating a highly aesthetic five-petal flower shape.</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold">Parametric Ellipse</td>
                  <td className="p-3 font-mono text-blue-600 dark:text-cyan-400">x = 3*cos(t), y = 2*sin(t)</td>
                  <td className="p-3">Draws a balanced planetary orbit path mapped relative to independent time parameters.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 6. Frequently Asked Questions */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
            Frequently Asked Questions (FAQ)
          </h3>
          <div className="space-y-4 text-sm text-slate-600 dark:text-neutral-300">
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">How do I trace points on the graph?</h5>
              <p className="leading-relaxed text-xs">Simply move your cursor across the graph viewport. A responsive, smart target crosshair will lock onto the active equation curve, revealing live coordinates, instantaneous slope, distance, and angle parameters in real-time.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">What does "Undefined" mean in the table rows?</h5>
              <p className="leading-relaxed text-xs">This happens when a mathematical value is out of bounds or cannot be evaluated—for instance, taking the logarithm of a negative number (<code className="font-mono">ln(-1)</code>) or dividing by zero.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-white mb-1">How does the 3D topology mode function?</h5>
              <p className="leading-relaxed text-xs">It evaluates height values <code className="font-mono">z = f(x, y)</code> over a 24x24 computational matrix grid. The visual mesh is projected onto your screen using an orthographic transformation, fully sorted via depth-buffer vectors.</p>
            </div>
          </div>
        </section>

        {/* 7. Glossary */}
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span className="w-1.5 h-6 bg-blue-600 dark:bg-cyan-400 rounded-full"></span>
            Mathematical Glossary
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-neutral-300">
            <div>
              <dt className="font-bold text-slate-900 dark:text-white mb-1">Asymptote</dt>
              <dd className="leading-relaxed">A line that a curve approaches infinitely closely but never actually meets or crosses.</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900 dark:text-white mb-1">Inflection Point</dt>
              <dd className="leading-relaxed">A point on a curve at which the concavity changes from upward to downward or vice versa.</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900 dark:text-white mb-1">Definite Integral</dt>
              <dd className="leading-relaxed">The exact accumulated area bounded under a functional curve between defined boundary parameters.</dd>
            </div>
            <div>
              <dt className="font-bold text-slate-900 dark:text-white mb-1">Parametric Parameter</dt>
              <dd className="leading-relaxed">An independent variable that maps coordinate systems (like horizontal and vertical dimensions) separately.</dd>
            </div>
          </dl>
        </section>

        {/* 8. Related Calculators */}
        <section className="space-y-4 border-t border-slate-200 dark:border-neutral-800 pt-8">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">Related Calculators on Calculatoora</h3>
          <div className="flex flex-wrap gap-2 text-xs">
            {[
              { name: 'Scientific Calculator', link: '#//calculators/scientific-calculator' },
              { name: 'Algebra Calculator', link: '#//calculators/algebra-calculator' },
              { name: 'Derivative Calculator', link: '#//calculators/derivative-calculator' },
              { name: 'Integral Calculator', link: '#//calculators/integral-calculator' },
              { name: 'Quadratic Formula Calculator', link: '#//calculators/quadratic-formula-calculator' },
              { name: 'Linear Equation Calculator', link: '#//calculators/linear-equation-calculator' },
              { name: 'Matrix Calculator', link: '#//calculators/matrix-calculator' },
              { name: 'Statistics Calculator', link: '#//calculators/statistics-calculator' }
            ].map((calc, index) => (
              <a
                key={index}
                href={calc.link}
                className="p-2 bg-slate-100 hover:bg-blue-50 dark:bg-neutral-800/50 dark:hover:bg-blue-950/30 text-slate-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 rounded-lg transition border border-slate-200/20"
              >
                {calc.name}
              </a>
            ))}
          </div>
        </section>
      </div>

      {/* JSON-LD Structured Data Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Graphing Calculator",
              "description": "An advanced, high-performance web-based graphing calculator implementing Cartesian, Polar, Parametric, and Implicit coordinates with live numerical analysis.",
              "url": "https://calculatoora.com/calculators/graphing-calculator",
              "applicationCategory": "EducationalApplication",
              "operatingSystem": "All"
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://calculatoora.com/"
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Calculators",
                  "item": "https://calculatoora.com/#/calculators"
                },
                {
                  "@type": "ListItem",
                  "position": 3,
                  "name": "Graphing Calculator",
                  "item": "https://calculatoora.com/calculators/graphing-calculator"
                }
              ]
            },
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I trace points on the graph?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Simply move your cursor across the graph viewport. A responsive, smart target crosshair will lock onto the active equation curve, revealing live coordinates, instantaneous slope, distance, and angle parameters in real-time."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What does 'Undefined' mean in the table rows?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "This happens when a mathematical value is out of bounds or cannot be evaluated—for instance, taking the logarithm of a negative number (ln(-1)) or dividing by zero."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How does the 3D topology mode function?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "It evaluates height values z = f(x, y) over a 24x24 computational matrix grid. The visual mesh is projected onto your screen using an orthographic transformation, fully sorted via depth-buffer vectors."
                  }
                }
              ]
            }
          ])
        }}
      />

    </div>
  );
}
