import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as math from 'mathjs';
import { ZoomIn, ZoomOut, RotateCcw, Download, Info } from 'lucide-react';

interface EquationItem {
  id: string;
  expression: string;
  color: string;
  type: 'cartesian' | 'polar' | 'parametric';
  parametricY?: string; // Used only for parametric
  visible: boolean;
}

export const GraphingCanvas: React.FC = () => {
  const [equations, setEquations] = useState<EquationItem[]>([
    { id: '1', expression: 'sin(x)', color: '#3b82f6', type: 'cartesian', visible: true },
    { id: '2', expression: 'cos(2 * x)', color: '#10b981', type: 'cartesian', visible: true }
  ]);
  const [newExpr, setNewExpr] = useState('');
  const [newType, setNewType] = useState<'cartesian' | 'polar' | 'parametric'>('cartesian');
  const [newParamY, setNewParamY] = useState('');
  const [newColor, setNewColor] = useState('#ef4444');

  // Graph state in math units
  const [range, setRange] = useState({
    xMin: -10,
    xMax: 10,
    yMin: -6,
    yMax: 6
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isDragging = useRef(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const [insights, setInsights] = useState<{
    roots: { x: number; y: number; eqIndex: number }[];
    extrema: { x: number; y: number; type: 'max' | 'min'; eqIndex: number }[];
    yIntercepts: { x: number; y: number; eqIndex: number }[];
  }>({ roots: [], extrema: [], yIntercepts: [] });

  const [mouseCoord, setMouseCoord] = useState<{ x: number; y: number } | null>(null);

  // Converts pixel coordinates to math coordinates
  const pixelToMath = useCallback((px: number, py: number, width: number, height: number) => {
    const x = range.xMin + (px / width) * (range.xMax - range.xMin);
    const y = range.yMax - (py / height) * (range.yMax - range.yMin);
    return { x, y };
  }, [range]);

  // Converts math coordinates to pixel coordinates
  const mathToPixel = useCallback((x: number, y: number, width: number, height: number) => {
    const px = ((x - range.xMin) / (range.xMax - range.xMin)) * width;
    const py = ((range.yMax - y) / (range.yMax - range.yMin)) * height;
    return { px, py };
  }, [range]);

  // Numeric finder for roots, extrema, and y-intercepts inside the viewport range
  const calculateAnalysis = useCallback(() => {
    const calculatedRoots: typeof insights.roots = [];
    const calculatedExtrema: typeof insights.extrema = [];
    const calculatedYIntercepts: typeof insights.yIntercepts = [];

    equations.forEach((eq, idx) => {
      if (!eq.visible) return;

      try {
        if (eq.type === 'cartesian') {
          const compiled = math.compile(eq.expression);
          
          // 1. Y-Intercept
          try {
            const yAtZero = compiled.evaluate({ x: 0 });
            if (typeof yAtZero === 'number' && !isNaN(yAtZero) && isFinite(yAtZero)) {
              calculatedYIntercepts.push({ x: 0, y: yAtZero, eqIndex: idx });
            }
          } catch (_) {}

          // 2. Scan the viewport for roots and extrema
          const steps = 150;
          const stepSize = (range.xMax - range.xMin) / steps;
          let prevX = range.xMin;
          let prevY: number | null = null;
          let prevSlope: number | null = null;

          for (let i = 0; i <= steps; i++) {
            const currX = range.xMin + i * stepSize;
            let currY: number;
            try {
              currY = compiled.evaluate({ x: currX });
              if (typeof currY !== 'number' || isNaN(currY) || !isFinite(currY)) {
                prevY = null;
                continue;
              }
            } catch (_) {
              prevY = null;
              continue;
            }

            // Roots scanning (Intermediate Value Theorem)
            if (prevY !== null) {
              if (prevY * currY <= 0) {
                // Approximate root
                const t = Math.abs(prevY) / (Math.abs(prevY) + Math.abs(currY));
                const approxRootX = prevX + t * stepSize;
                calculatedRoots.push({ x: approxRootX, y: 0, eqIndex: idx });
              }

              // Extrema scanning (sign change of approximate slope)
              const slope = (currY - prevY) / stepSize;
              if (prevSlope !== null) {
                if (prevSlope > 0 && slope < 0) {
                  // Local Maximum
                  calculatedExtrema.push({ x: currX - stepSize / 2, y: (currY + prevY) / 2, type: 'max', eqIndex: idx });
                } else if (prevSlope < 0 && slope > 0) {
                  // Local Minimum
                  calculatedExtrema.push({ x: currX - stepSize / 2, y: (currY + prevY) / 2, type: 'min', eqIndex: idx });
                }
              }
              prevSlope = slope;
            }

            prevX = currX;
            prevY = currY;
          }
        }
      } catch (_) {}
    });

    setInsights({
      roots: calculatedRoots.slice(0, 8),
      extrema: calculatedExtrema.slice(0, 8),
      yIntercepts: calculatedYIntercepts.slice(0, 4)
    });
  }, [equations, range]);

  // Main Canvas Render
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear Screen
    ctx.clearRect(0, 0, width, height);

    // Grid System
    const xRange = range.xMax - range.xMin;
    const yRange = range.yMax - range.yMin;

    // Smart grid interval calculation
    let step = 1;
    const logRange = Math.log10(xRange);
    const orderOfMagnitude = Math.pow(10, Math.floor(logRange));
    const ratio = xRange / orderOfMagnitude;

    if (ratio < 2) step = 0.2 * orderOfMagnitude;
    else if (ratio < 5) step = 0.5 * orderOfMagnitude;
    else step = 1.0 * orderOfMagnitude;

    // Drawing Grid Lines (Vertical & Horizontal)
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#1f2937' : '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.fillStyle = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#4b5563';
    ctx.font = '10px monospace';

    // Vertical grid lines
    const firstValX = Math.ceil(range.xMin / step) * step;
    for (let val = firstValX; val <= range.xMax; val += step) {
      if (Math.abs(val) < 1e-10) continue; // Skip axis line
      const { px } = mathToPixel(val, 0, width, height);
      ctx.beginPath();
      ctx.moveTo(px, 0);
      ctx.lineTo(px, height);
      ctx.stroke();

      // Label
      ctx.fillText(val.toFixed(2).replace(/\.?0+$/, ''), px + 2, height - 10);
    }

    // Horizontal grid lines
    const firstValY = Math.ceil(range.yMin / step) * step;
    for (let val = firstValY; val <= range.yMax; val += step) {
      if (Math.abs(val) < 1e-10) continue; // Skip axis line
      const { py } = mathToPixel(0, val, width, height);
      ctx.beginPath();
      ctx.moveTo(0, py);
      ctx.lineTo(width, py);
      ctx.stroke();

      // Label
      ctx.fillText(val.toFixed(2).replace(/\.?0+$/, ''), 10, py - 2);
    }

    // Axes Lines
    ctx.strokeStyle = document.documentElement.classList.contains('dark') ? '#9ca3af' : '#374151';
    ctx.lineWidth = 2;

    // Draw X Axis
    const { py: zeroY } = mathToPixel(0, 0, width, height);
    if (zeroY >= 0 && zeroY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(width, zeroY);
      ctx.stroke();
    }

    // Draw Y Axis
    const { px: zeroX } = mathToPixel(0, 0, width, height);
    if (zeroX >= 0 && zeroX <= width) {
      ctx.beginPath();
      ctx.moveTo(zeroX, 0);
      ctx.lineTo(zeroX, height);
      ctx.stroke();
    }

    // Origin indicator '0'
    if (zeroX >= 0 && zeroX <= width && zeroY >= 0 && zeroY <= height) {
      ctx.fillText('0', zeroX + 4, zeroY - 4);
    }

    // Plot Equations
    equations.forEach((eq) => {
      if (!eq.visible) return;

      ctx.strokeStyle = eq.color;
      ctx.lineWidth = 2.5;
      ctx.beginPath();

      try {
        if (eq.type === 'cartesian') {
          const compiled = math.compile(eq.expression);
          let drawing = false;

          for (let px = 0; px < width; px++) {
            const { x } = pixelToMath(px, 0, width, height);
            try {
              const y = compiled.evaluate({ x });
              if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
                const { py } = mathToPixel(x, y, width, height);
                if (py >= -100 && py <= height + 100) {
                  if (!drawing) {
                    ctx.moveTo(px, py);
                    drawing = true;
                  } else {
                    ctx.lineTo(px, py);
                  }
                } else {
                  drawing = false;
                }
              } else {
                drawing = false;
              }
            } catch (_) {
              drawing = false;
            }
          }
          ctx.stroke();
        } else if (eq.type === 'polar') {
          // Polar plotting: r = f(theta), x = r cos(theta), y = r sin(theta)
          const compiled = math.compile(eq.expression);
          let drawing = false;

          const thetaSteps = 360;
          for (let i = 0; i <= thetaSteps; i++) {
            const theta = (i * Math.PI * 2) / 180; // Sample up to 2pi or multiple rotations
            try {
              const r = compiled.evaluate({ theta, t: theta }); // standard theta evaluation
              if (typeof r === 'number' && !isNaN(r)) {
                const x = r * Math.cos(theta);
                const y = r * Math.sin(theta);
                const { px, py } = mathToPixel(x, y, width, height);

                if (!drawing) {
                  ctx.moveTo(px, py);
                  drawing = true;
                } else {
                  ctx.lineTo(px, py);
                }
              }
            } catch (_) {}
          }
          ctx.stroke();
        } else if (eq.type === 'parametric' && eq.parametricY) {
          // Parametric plotting: x = f(t), y = g(t)
          const compiledX = math.compile(eq.expression);
          const compiledY = math.compile(eq.parametricY);
          let drawing = false;

          const tSteps = 200;
          // Sample t from -10 to 10
          for (let i = 0; i <= tSteps; i++) {
            const t = -10 + (i * 20) / tSteps;
            try {
              const x = compiledX.evaluate({ t });
              const y = compiledY.evaluate({ t });
              if (typeof x === 'number' && typeof y === 'number' && !isNaN(x) && !isNaN(y)) {
                const { px, py } = mathToPixel(x, y, width, height);
                if (!drawing) {
                  ctx.moveTo(px, py);
                  drawing = true;
                } else {
                  ctx.lineTo(px, py);
                }
              }
            } catch (_) {}
          }
          ctx.stroke();
        }
      } catch (_) {}
    });

    // Draw intercept, root, and extrema points
    insights.roots.forEach((rt) => {
      const { px, py } = mathToPixel(rt.x, rt.y, width, height);
      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });

    insights.extrema.forEach((ex) => {
      const { px, py } = mathToPixel(ex.x, ex.y, width, height);
      if (px >= 0 && px <= width && py >= 0 && py <= height) {
        ctx.fillStyle = ex.type === 'max' ? '#fbbf24' : '#a78bfa';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    });
  }, [equations, range, insights, mathToPixel, pixelToMath]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  useEffect(() => {
    calculateAnalysis();
  }, [calculateAnalysis]);

  // Adjust canvas scale dynamically on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;
      canvas.width = container.clientWidth;
      canvas.height = Math.max(container.clientHeight, 400);
      drawGraph();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawGraph]);

  // Handle Drag / Pan Operations
  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Update mouse coordinates display
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const py = e.clientY - rect.top;
    setMouseCoord(pixelToMath(px, py, canvas.width, canvas.height));

    if (!isDragging.current) return;

    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    dragStart.current = { x: e.clientX, y: e.clientY };

    const xSpan = range.xMax - range.xMin;
    const ySpan = range.yMax - range.yMin;

    const xShift = (dx / canvas.width) * xSpan;
    const yShift = (dy / canvas.height) * ySpan;

    setRange({
      xMin: range.xMin - xShift,
      xMax: range.xMax - xShift,
      yMin: range.yMin + yShift,
      yMax: range.yMax + yShift
    });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  // Zoom Helpers
  const zoom = (factor: number) => {
    const xCenter = (range.xMax + range.xMin) / 2;
    const yCenter = (range.yMax + range.yMin) / 2;
    const xSpan = (range.xMax - range.xMin) * factor;
    const ySpan = (range.yMax - range.yMin) * factor;

    setRange({
      xMin: xCenter - xSpan / 2,
      xMax: xCenter + xSpan / 2,
      yMin: yCenter - ySpan / 2,
      yMax: yCenter + ySpan / 2
    });
  };

  const resetZoom = () => {
    setRange({ xMin: -10, xMax: 10, yMin: -6, yMax: 6 });
  };

  // SVG Export Utility
  const downloadSVG = () => {
    const width = canvasRef.current?.width || 800;
    const height = canvasRef.current?.height || 500;
    
    // Generate inline representation of axis and function drawings
    let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" style="background-color: #111827;">`;

    // Draw vertical and horizontal axis
    const { px: zeroX } = mathToPixel(0, 0, width, height);
    const { py: zeroY } = mathToPixel(0, 0, width, height);

    svgContent += `<line x1="0" y1="${zeroY}" x2="${width}" y2="${zeroY}" stroke="#4b5563" stroke-width="2"/>`;
    svgContent += `<line x1="${zeroX}" y1="0" x2="${zeroX}" y2="${height}" stroke="#4b5563" stroke-width="2"/>`;

    // Convert function points to SVG paths
    equations.forEach((eq) => {
      if (!eq.visible) return;
      try {
        let pathData = '';
        if (eq.type === 'cartesian') {
          const compiled = math.compile(eq.expression);
          let drawing = false;

          for (let px = 0; px < width; px += 2) {
            const { x } = pixelToMath(px, 0, width, height);
            try {
              const y = compiled.evaluate({ x });
              if (typeof y === 'number' && !isNaN(y) && isFinite(y)) {
                const { py } = mathToPixel(x, y, width, height);
                if (py >= 0 && py <= height) {
                  if (!drawing) {
                    pathData += `M ${px} ${py}`;
                    drawing = true;
                  } else {
                    pathData += ` L ${px} ${py}`;
                  }
                } else {
                  drawing = false;
                }
              }
            } catch (_) {}
          }
        }
        if (pathData) {
          svgContent += `<path d="${pathData}" fill="none" stroke="${eq.color}" stroke-width="3"/>`;
        }
      } catch (_) {}
    });

    svgContent += `</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scientific_calculator_graph.svg';
    link.click();
    URL.revokeObjectURL(url);
  };

  // PNG Export Utility
  const downloadPNG = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = url;
    link.download = 'scientific_calculator_graph.png';
    link.click();
  };

  const handleAddEquation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpr.trim()) return;
    setEquations([
      ...equations,
      {
        id: Date.now().toString(),
        expression: newExpr,
        color: newColor,
        type: newType,
        parametricY: newType === 'parametric' ? newParamY : undefined,
        visible: true
      }
    ]);
    setNewExpr('');
    setNewParamY('');
  };

  const toggleVisibility = (id: string) => {
    setEquations(equations.map(eq => eq.id === id ? { ...eq, visible: !eq.visible } : eq));
  };

  const deleteEquation = (id: string) => {
    setEquations(equations.filter(eq => eq.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* --- FORMULA EDITOR PANEL --- */}
      <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 text-left">
        <h4 className="text-sm font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-4 font-mono">
          📈 Function Plotter
        </h4>

        <form onSubmit={handleAddEquation} className="space-y-4 mb-6">
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Equation Type</label>
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value as any)}
              className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="cartesian">Cartesian f(x)</option>
              <option value="polar">Polar r(theta)</option>
              <option value="parametric">Parametric [x(t), y(t)]</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">
              {newType === 'cartesian' ? 'f(x) =' : newType === 'polar' ? 'r(theta) =' : 'x(t) ='}
            </label>
            <input
              type="text"
              value={newExpr}
              onChange={(e) => setNewExpr(e.target.value)}
              placeholder={newType === 'cartesian' ? 'x^2 - 2*x' : newType === 'polar' ? '2 * sin(theta)' : 'sin(t)'}
              className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {newType === 'parametric' && (
            <div>
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">y(t) =</label>
              <input
                type="text"
                value={newParamY}
                onChange={(e) => setNewParamY(e.target.value)}
                placeholder="cos(t)"
                className="w-full p-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="block text-xs font-bold text-neutral-500 uppercase mb-1">Line Color</label>
              <div className="flex gap-2">
                {['#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#8b5cf6'].map(c => (
                  <button
                    type="button"
                    key={c}
                    onClick={() => setNewColor(c)}
                    className={`w-6 h-6 rounded-full transition ${newColor === c ? 'ring-2 ring-offset-2 ring-neutral-400' : 'opacity-80 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-bold text-xs transition"
            >
              Add Plot
            </button>
          </div>
        </form>

        <div className="space-y-3.5 max-h-60 overflow-y-auto pr-1">
          {equations.map((eq, i) => (
            <div key={eq.id} className="flex items-center justify-between p-3 rounded-xl border border-neutral-100 dark:border-neutral-800/60 bg-white dark:bg-neutral-950">
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: eq.color }} />
                <span className="font-mono text-sm text-neutral-800 dark:text-neutral-200 truncate">
                  {eq.type === 'parametric' ? `x:${eq.expression}, y:${eq.parametricY}` : eq.expression}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(eq.id)}
                  className={`px-2 py-1 rounded text-xs font-bold transition ${eq.visible ? 'bg-blue-50 dark:bg-cyan-950/20 text-blue-600 dark:text-cyan-400' : 'bg-neutral-100 dark:bg-neutral-850 text-neutral-400'}`}
                >
                  {eq.visible ? 'Show' : 'Hide'}
                </button>
                <button
                  onClick={() => deleteEquation(eq.id)}
                  className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-neutral-400 hover:text-red-500 rounded transition"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Dynamic coordinate tracker */}
        {mouseCoord && (
          <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-850 flex justify-between text-xs font-mono text-neutral-500">
            <span>Cursor X: {mouseCoord.x.toFixed(4)}</span>
            <span>Cursor Y: {mouseCoord.y.toFixed(4)}</span>
          </div>
        )}
      </div>

      {/* --- DRAWING CANVAS --- */}
      <div className="lg:col-span-2 flex flex-col p-4 rounded-3xl bg-neutral-900 border border-neutral-850 relative text-left" ref={containerRef}>
        
        {/* Float Control Panel */}
        <div className="absolute top-6 right-6 flex items-center gap-2 z-10 bg-neutral-950/80 backdrop-blur border border-neutral-800 p-2 rounded-xl">
          <button onClick={() => zoom(0.8)} title="Zoom In" className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg transition"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => zoom(1.2)} title="Zoom Out" className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg transition"><ZoomOut className="w-4 h-4" /></button>
          <button onClick={resetZoom} title="Reset View" className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg transition"><RotateCcw className="w-4 h-4" /></button>
          <div className="h-4 w-[1px] bg-neutral-800 mx-1" />
          <button onClick={downloadPNG} title="Download PNG" className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 rounded-lg transition"><Download className="w-4 h-4" /></button>
          <button onClick={downloadSVG} title="Download SVG" className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold transition">SVG</button>
        </div>

        {/* Viewport Range Tracker */}
        <div className="absolute bottom-6 left-6 z-10 bg-neutral-950/80 backdrop-blur border border-neutral-800 px-3 py-1.5 rounded-xl text-[10px] text-neutral-400 font-mono">
          X: [{range.xMin.toFixed(1)}, {range.xMax.toFixed(1)}] | Y: [{range.yMin.toFixed(1)}, {range.yMax.toFixed(1)}]
        </div>

        {/* Interactive Canvas Grid */}
        <canvas
          ref={canvasRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          className="w-full flex-1 rounded-2xl cursor-move bg-neutral-950 select-none"
          style={{ height: '400px' }}
        />

        {/* Extrema, Root insights */}
        {(insights.roots.length > 0 || insights.extrema.length > 0) && (
          <div className="mt-4 pt-3 border-t border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono text-neutral-400">
            <div>
              <span className="text-[#ef4444] font-bold">● Viewport Roots (f(x)=0):</span>
              <div className="mt-1 space-y-1">
                {insights.roots.map((rt, i) => (
                  <div key={i}>Eq #{rt.eqIndex + 1}: x = {rt.x.toFixed(4)}</div>
                ))}
              </div>
            </div>
            <div>
              <span className="text-[#fbbf24] font-bold">▲ Local Extrema:</span>
              <div className="mt-1 space-y-1">
                {insights.extrema.map((ex, i) => (
                  <div key={i}>Eq #{ex.eqIndex + 1}: {ex.type.toUpperCase()} ({ex.x.toFixed(3)}, {ex.y.toFixed(3)})</div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
