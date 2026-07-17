import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, RefreshCw } from 'lucide-react';
import { normalPDF } from '../utils/probabilityMath';

// ==========================================
// 1. VENN DIAGRAM
// ==========================================
interface VennDiagramProps {
  probA: number;
  probB: number;
  probAAndB: number;
}
export function VennDiagram({ probA, probB, probAAndB }: VennDiagramProps) {
  const rA = useMemo(() => Math.max(30, Math.min(65, 40 + probA * 25)), [probA]);
  const rB = useMemo(() => Math.max(30, Math.min(65, 40 + probB * 25)), [probB]);
  
  // Calculate distance between centers based on overlap
  const distance = useMemo(() => {
    if (probAAndB <= 0) return 140; // No overlap
    const maxDist = 130;
    const minDist = Math.abs(rA - rB) + 10;
    const fraction = probAAndB / Math.min(probA, probB);
    return maxDist - fraction * (maxDist - minDist);
  }, [probA, probB, probAAndB, rA, rB]);

  const pA = (probA * 100).toFixed(1);
  const pB = (probB * 100).toFixed(1);
  const pBoth = (probAAndB * 100).toFixed(1);
  const pAOnly = (Math.max(0, probA - probAAndB) * 100).toFixed(1);
  const pBOnly = (Math.max(0, probB - probAAndB) * 100).toFixed(1);
  const pNeither = (Math.max(0, 1 - (probA + probB - probAAndB)) * 100).toFixed(1);

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
        Interactive Venn Diagram (Union &amp; Intersection)
      </span>
      <svg className="w-full max-w-[320px] h-[200px]" viewBox="0 0 320 200">
        <defs>
          <clipPath id="clip-a">
            <circle cx={160 - distance / 2} cy="100" r={rA} />
          </clipPath>
          <linearGradient id="grad-a" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad-b" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#db2777" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="grad-both" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Background Universe */}
        <rect x="5" y="5" width="310" height="190" rx="16" fill="none" stroke="#e5e7eb" strokeWidth="2" className="dark:stroke-neutral-800" />
        <text x="20" y="25" className="text-[10px] font-black fill-neutral-400 font-mono">Ω (Universe) = 100%</text>
        <text x="20" y="180" className="text-[10px] font-bold fill-neutral-400 font-mono">Neither: {pNeither}%</text>

        {/* Circle A */}
        <circle cx={160 - distance / 2} cy="100" r={rA} fill="url(#grad-a)" stroke="#2563eb" strokeWidth="2.5" />
        {/* Circle B */}
        <circle cx={160 + distance / 2} cy="100" r={rB} fill="url(#grad-b)" stroke="#db2777" strokeWidth="2.5" />

        {/* Intersection Overlay */}
        {probAAndB > 0 && (
          <circle cx={160 + distance / 2} cy="100" r={rB} fill="url(#grad-both)" clipPath="url(#clip-a)" />
        )}

        {/* Labels */}
        <text x={160 - distance / 2 - 10} y="100" className="text-[11px] font-black fill-blue-700 dark:fill-blue-300 font-sans" textAnchor="middle">
          A: {pAOnly}%
        </text>
        <text x={160 + distance / 2 + 10} y="100" className="text-[11px] font-black fill-pink-700 dark:fill-pink-300 font-sans" textAnchor="middle">
          B: {pBOnly}%
        </text>
        {probAAndB > 0 && (
          <text x="160" y="104" className="text-[11px] font-black fill-purple-900 dark:fill-purple-200 font-sans" textAnchor="middle">
            {pBoth}%
          </text>
        )}
      </svg>
      <div className="flex gap-4 mt-2 text-[10px] font-bold text-neutral-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-blue-500/40 border border-blue-600" /> Event A ({pA}%)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-purple-500/70 border border-purple-600" /> A ∩ B ({pBoth}%)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-pink-500/40 border border-pink-600" /> Event B ({pB}%)</span>
      </div>
    </div>
  );
}

// ==========================================
// 2. BELL CURVE (NORMAL DISTRIBUTION)
// ==========================================
interface BellCurveProps {
  mean: number;
  stdDev: number;
  x1: number | null;
  x2: number | null;
  type: 'less' | 'greater' | 'between';
}
export function BellCurve({ mean, stdDev, x1, x2, type }: BellCurveProps) {
  const points = useMemo(() => {
    const pts = [];
    const minX = mean - 4 * stdDev;
    const maxX = mean + 4 * stdDev;
    const step = (maxX - minX) / 80;

    for (let x = minX; x <= maxX; x += step) {
      // Gaussian function
      const exponent = -Math.pow(x - mean, 2) / (2 * Math.pow(stdDev, 2));
      const y = (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
      pts.push({ x, y });
    }
    return pts;
  }, [mean, stdDev]);

  const maxValY = useMemo(() => Math.max(...points.map(p => p.y)), [points]);

  // Convert points to SVG coordinates
  const svgWidth = 320;
  const svgHeight = 160;
  const padding = 20;

  const toSvgX = (valX: number) => {
    const minX = mean - 4 * stdDev;
    const maxX = mean + 4 * stdDev;
    return padding + ((valX - minX) / (maxX - minX)) * (svgWidth - 2 * padding);
  };

  const toSvgY = (valY: number) => {
    return svgHeight - padding - (valY / maxValY) * (svgHeight - 2 * padding);
  };

  // Build smooth curve path
  const curvePath = useMemo(() => {
    if (points.length === 0) return '';
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${toSvgX(p.x)} ${toSvgY(p.y)}`).join(' ');
  }, [points]);

  // Highlighted Shaded Area path
  const shadePath = useMemo(() => {
    if (points.length === 0) return '';
    const shadedPts = points.filter(p => {
      if (type === 'less' && x1 !== null) return p.x <= x1;
      if (type === 'greater' && x1 !== null) return p.x >= x1;
      if (type === 'between' && x1 !== null && x2 !== null) {
        const start = Math.min(x1, x2);
        const end = Math.max(x1, x2);
        return p.x >= start && p.x <= end;
      }
      return false;
    });

    if (shadedPts.length === 0) return '';

    // Create a closed polygon down to bottom axis
    const firstX = toSvgX(shadedPts[0].x);
    const lastX = toSvgX(shadedPts[shadedPts.length - 1].x);
    const bottomY = svgHeight - padding;

    let path = `M ${firstX} ${bottomY} `;
    shadedPts.forEach(p => {
      path += `L ${toSvgX(p.x)} ${toSvgY(p.y)} `;
    });
    path += `L ${lastX} ${bottomY} Z`;
    return path;
  }, [points, x1, x2, type, mean, stdDev]);

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
        Gaussian Bell Curve (Normal Distribution σ={stdDev.toFixed(1)})
      </span>
      <svg className="w-full max-w-[320px] h-[160px]" viewBox="0 0 320 160">
        {/* Shaded Area */}
        {shadePath && (
          <path d={shadePath} fill="#10b981" fillOpacity="0.3" stroke="#059669" strokeWidth="1" strokeDasharray="3,3" />
        )}
        
        {/* Main Curve */}
        <path d={curvePath} fill="none" stroke="#2563eb" strokeWidth="2.5" />

        {/* Mean line (Center) */}
        <line 
          x1={toSvgX(mean)} 
          y1={padding} 
          x2={toSvgX(mean)} 
          y2={svgHeight - padding} 
          stroke="#6b7280" 
          strokeWidth="1.5" 
          strokeDasharray="4,4" 
        />
        <text x={toSvgX(mean)} y="15" className="text-[9px] font-black fill-neutral-500 font-mono" textAnchor="middle">
          μ={mean}
        </text>

        {/* Standard Deviation Tick Marks */}
        {[-2, -1, 1, 2].map(sd => {
          const val = mean + sd * stdDev;
          return (
            <g key={sd}>
              <line 
                x1={toSvgX(val)} 
                y1={svgHeight - padding - 4} 
                x2={toSvgX(val)} 
                y2={svgHeight - padding + 4} 
                stroke="#9ca3af" 
                strokeWidth="1" 
              />
              <text x={toSvgX(val)} y={svgHeight - 4} className="text-[8px] fill-neutral-400 font-mono" textAnchor="middle">
                {sd > 0 ? `+${sd}σ` : `${sd}σ`}
              </text>
            </g>
          );
        })}

        {/* Dynamic Boundary line */}
        {x1 !== null && !isNaN(x1) && (
          <g>
            <line 
              x1={toSvgX(x1)} 
              y1={toSvgY(normalPDF(x1, mean, stdDev))} 
              x2={toSvgX(x1)} 
              y2={svgHeight - padding} 
              stroke="#ef4444" 
              strokeWidth="2" 
            />
            <circle cx={toSvgX(x1)} cy={toSvgY(normalPDF(x1, mean, stdDev))} r="4" fill="#ef4444" />
          </g>
        )}

        {/* Bottom Baseline */}
        <line x1={padding} y1={svgHeight - padding} x2={svgWidth - padding} y2={svgHeight - padding} stroke="#d1d5db" strokeWidth="1.5" className="dark:stroke-neutral-800" />
      </svg>
      <div className="flex gap-4 mt-2 text-[10px] font-bold text-neutral-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-500" /> Probability Density (PDF)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-600" /> Target Shaded Region</span>
      </div>
    </div>
  );
}

// ==========================================
// 3. BINOMIAL / POISSON PMF BAR CHART
// ==========================================
interface DiscreteChartProps {
  pmfData: { k: number; prob: number }[];
  targetK: number | null;
  compare: 'equal' | 'less' | 'greater';
}
export function DiscreteChart({ pmfData, targetK, compare }: DiscreteChartProps) {
  const maxProb = useMemo(() => Math.max(0.01, ...pmfData.map(d => d.prob)), [pmfData]);
  const width = 320;
  const height = 160;
  const padding = 24;

  const barWidth = useMemo(() => {
    return (width - 2 * padding) / pmfData.length * 0.75;
  }, [pmfData.length]);

  const gap = useMemo(() => {
    return (width - 2 * padding) / pmfData.length * 0.25;
  }, [pmfData.length]);

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2 font-mono">
        Probability Mass Function (PMF) Distribution
      </span>
      <svg className="w-full max-w-[320px] h-[160px]" viewBox="0 0 320 160">
        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => {
          const yVal = height - padding - p * (height - 2 * padding);
          return (
            <g key={idx}>
              <line x1={padding} y1={yVal} x2={width - padding} y2={yVal} stroke="#e5e7eb" strokeWidth="0.5" className="dark:stroke-neutral-800" strokeDasharray="2,2" />
              <text x={padding - 4} y={yVal + 3} className="text-[8px] fill-neutral-400 font-mono text-right" textAnchor="end">
                {(p * maxProb * 100).toFixed(0)}%
              </text>
            </g>
          );
        })}

        {/* Bars */}
        {pmfData.map((d, i) => {
          const barHeight = (d.prob / maxProb) * (height - 2 * padding);
          const x = padding + i * (barWidth + gap) + gap / 2;
          const y = height - padding - barHeight;

          // Determine if this k fits the target comparison
          let isHighlighted = false;
          if (targetK !== null) {
            if (compare === 'equal') isHighlighted = d.k === targetK;
            if (compare === 'less') isHighlighted = d.k <= targetK;
            if (compare === 'greater') isHighlighted = d.k >= targetK;
          }

          return (
            <g key={d.k} className="group cursor-help">
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={Math.max(2, barHeight)}
                rx="3"
                fill={isHighlighted ? '#10b981' : '#3b82f6'}
                fillOpacity={isHighlighted ? 0.9 : 0.6}
                className="transition-all duration-300 hover:fill-blue-600"
              />
              {/* Tooltip on hover */}
              <title>{`k = ${d.k}: ${(d.prob * 100).toFixed(2)}%`}</title>
              {/* x-axis label */}
              {pmfData.length <= 15 || i % Math.ceil(pmfData.length / 10) === 0 ? (
                <text x={x + barWidth / 2} y={height - 6} className="text-[8px] fill-neutral-400 font-mono font-bold" textAnchor="middle">
                  {d.k}
                </text>
              ) : null}
            </g>
          );
        })}

        {/* Bottom baseline */}
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#9ca3af" strokeWidth="1.5" className="dark:stroke-neutral-800" />
      </svg>
      <div className="flex gap-4 mt-2 text-[10px] font-bold text-neutral-500">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-400" /> Non-Target Outcomes</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-500" /> Target Outcome (Selected k)</span>
      </div>
    </div>
  );
}

// ==========================================
// 4. PASCAL TRIANGLE VISUALIZATION
// ==========================================
export function PascalTriangle() {
  const rows = [
    [1],
    [1, 1],
    [1, 2, 1],
    [1, 3, 3, 1],
    [1, 4, 6, 4, 1],
    [1, 5, 10, 10, 5, 1]
  ];

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-3 font-mono">
        Pascal's Triangle (Binomial Coefficient Multipliers)
      </span>
      <div className="space-y-1 w-full flex flex-col items-center select-none font-mono">
        {rows.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-1 justify-center">
            {row.map((val, cIdx) => (
              <motion.div
                key={cIdx}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: rIdx * 0.1 + cIdx * 0.05 }}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[10px] sm:text-xs font-black text-neutral-800 dark:text-neutral-200 shadow-sm"
              >
                {val}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. COIN FLIP SIMULATION VISUALIZER
// ==========================================
export function CoinFlipper() {
  const [flipping, setFlipping] = useState(false);
  const [coinSide, setCoinSide] = useState<'heads' | 'tails'>('heads');
  const [history, setHistory] = useState<'H' | 'T'>([]);

  const flipCoin = () => {
    if (flipping) return;
    setFlipping(true);
    const runs = 12;
    let currentRun = 0;
    
    const interval = setInterval(() => {
      setCoinSide(Math.random() > 0.5 ? 'heads' : 'tails');
      currentRun++;
      if (currentRun >= runs) {
        clearInterval(interval);
        const finalSide = Math.random() > 0.5 ? 'heads' : 'tails';
        setCoinSide(finalSide);
        setHistory(prev => [finalSide === 'heads' ? 'H' : 'T', ...prev].slice(0, 8));
        setFlipping(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800 w-full">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-3 font-mono">
        Live Coin Toss Simulator
      </span>

      <div className="relative w-28 h-28 flex items-center justify-center">
        <motion.div
          animate={flipping ? { rotateY: 360 * 3, scale: [1, 1.3, 1] } : {}}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          onClick={flipCoin}
          className={`w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center shadow-2xl cursor-pointer select-none transition-all duration-300 ${
            coinSide === 'heads'
              ? 'bg-amber-100 border-amber-500 text-amber-700 dark:bg-amber-950 dark:border-amber-400 dark:text-amber-300'
              : 'bg-neutral-200 border-neutral-500 text-neutral-700 dark:bg-neutral-800 dark:border-neutral-400 dark:text-neutral-300'
          }`}
        >
          <span className="text-sm font-black uppercase tracking-widest">{coinSide}</span>
          <span className="text-[8px] font-extrabold text-neutral-400 dark:text-neutral-500">P(0.5)</span>
        </motion.div>
      </div>

      <button
        onClick={flipCoin}
        disabled={flipping}
        className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${flipping ? 'animate-spin' : ''}`} />
        Flip Coin
      </button>

      {/* History */}
      <div className="flex gap-1.5 mt-3 items-center min-h-[30px]">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 font-mono mr-1">History:</span>
        {history.length === 0 ? (
          <span className="text-[9px] text-neutral-400 italic font-mono">No tosses yet</span>
        ) : (
          history.map((h, i) => (
            <span
              key={i}
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black font-mono shadow-sm border ${
                h === 'H' 
                  ? 'bg-amber-100 text-amber-800 border-amber-300' 
                  : 'bg-neutral-200 text-neutral-800 border-neutral-300'
              }`}
            >
              {h}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 6. DICE ROLL SIMULATION VISUALIZER
// ==========================================
export function DiceRoller() {
  const [rolling, setRolling] = useState(false);
  const [dieVal, setDieVal] = useState<number>(6);
  const [dieVal2, setDieVal2] = useState<number>(1);
  const [history, setHistory] = useState<number[]>([]);

  const rollDice = () => {
    if (rolling) return;
    setRolling(true);
    let currentStep = 0;
    const totalSteps = 10;

    const interval = setInterval(() => {
      setDieVal(Math.floor(Math.random() * 6) + 1);
      setDieVal2(Math.floor(Math.random() * 6) + 1);
      currentStep++;
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        const finalVal1 = Math.floor(Math.random() * 6) + 1;
        const finalVal2 = Math.floor(Math.random() * 6) + 1;
        setDieVal(finalVal1);
        setDieVal2(finalVal2);
        setHistory(prev => [finalVal1 + finalVal2, ...prev].slice(0, 8));
        setRolling(false);
      }
    }, 80);
  };

  const renderDots = (val: number) => {
    const dotsMap: Record<number, number[]> = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };
    const activeDots = dotsMap[val] || [];
    return Array.from({ length: 9 }).map((_, idx) => (
      <div key={idx} className="w-2.5 h-2.5 flex items-center justify-center">
        {activeDots.includes(idx) && (
          <div className="w-2 h-2 rounded-full bg-neutral-900 dark:bg-neutral-100" />
        )}
      </div>
    ));
  };

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800 w-full">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-3 font-mono">
        Standard 2-Dice Roller
      </span>

      <div className="flex gap-4">
        {/* Die 1 */}
        <motion.div
          animate={rolling ? { rotate: [0, 180, 360], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 shadow-lg p-2.5 grid grid-cols-3 grid-rows-3 gap-0.5 justify-items-center items-center select-none"
        >
          {renderDots(dieVal)}
        </motion.div>

        {/* Die 2 */}
        <motion.div
          animate={rolling ? { rotate: [0, -180, -360], scale: [1, 1.2, 1] } : {}}
          transition={{ duration: 0.8 }}
          className="w-16 h-16 rounded-2xl bg-white dark:bg-neutral-800 border-2 border-neutral-300 dark:border-neutral-700 shadow-lg p-2.5 grid grid-cols-3 grid-rows-3 gap-0.5 justify-items-center items-center select-none"
        >
          {renderDots(dieVal2)}
        </motion.div>
      </div>

      <button
        onClick={rollDice}
        disabled={rolling}
        className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${rolling ? 'animate-spin' : ''}`} />
        Roll Dice
      </button>

      {/* Sum & History */}
      <div className="flex gap-1.5 mt-3 items-center min-h-[30px]">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 font-mono">
          Sum: <span className="text-blue-600 dark:text-cyan-400 font-black">{dieVal + dieVal2}</span> | History:
        </span>
        {history.length === 0 ? (
          <span className="text-[9px] text-neutral-400 italic font-mono">No rolls yet</span>
        ) : (
          history.map((h, i) => (
            <span
              key={i}
              className="w-5 h-5 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 flex items-center justify-center text-[10px] font-black font-mono shadow-sm text-neutral-800 dark:text-neutral-200"
            >
              {h}
            </span>
          ))
        )}
      </div>
    </div>
  );
}

// ==========================================
// 7. DECK CARD VISUALIZER
// ==========================================
export function CardVisualizer() {
  const [currentCard, setCurrentCard] = useState<{ suit: string; val: string } | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [drawing, setDrawing] = useState(false);

  const suits = ['♠', '♥', '♦', '♣'];
  const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

  const drawCard = () => {
    if (drawing) return;
    setDrawing(true);
    let steps = 0;
    const interval = setInterval(() => {
      const randSuit = suits[Math.floor(Math.random() * 4)];
      const randVal = values[Math.floor(Math.random() * 13)];
      setCurrentCard({ suit: randSuit, val: randVal });
      steps++;
      if (steps > 8) {
        clearInterval(interval);
        const finalSuit = suits[Math.floor(Math.random() * 4)];
        const finalVal = values[Math.floor(Math.random() * 13)];
        setCurrentCard({ suit: finalSuit, val: finalVal });
        setHistory(prev => [`${finalVal}${finalSuit}`, ...prev].slice(0, 6));
        setDrawing(false);
      }
    }, 70);
  };

  const isRed = currentCard?.suit === '♥' || currentCard?.suit === '♦';

  return (
    <div className="flex flex-col items-center p-4 bg-neutral-50/50 dark:bg-neutral-900/30 rounded-3xl border border-neutral-200/40 dark:border-neutral-800 w-full">
      <span className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 mb-3 font-mono">
        Standard 52-Card Deck Drawer
      </span>

      <motion.div
        whileHover={{ scale: 1.05 }}
        onClick={drawCard}
        className={`w-20 h-28 rounded-2xl border-2 flex flex-col justify-between p-2.5 shadow-xl cursor-pointer select-none relative bg-white dark:bg-neutral-800 transition-all ${
          isRed ? 'border-red-500 text-red-500' : 'border-neutral-400 text-neutral-900 dark:text-neutral-100 dark:border-neutral-700'
        }`}
      >
        {currentCard ? (
          <>
            <div className="text-xs font-black self-start leading-none flex flex-col items-center">
              <span>{currentCard.val}</span>
              <span className="text-[10px]">{currentCard.suit}</span>
            </div>
            <div className="text-3xl font-black self-center leading-none">
              {currentCard.suit}
            </div>
            <div className="text-xs font-black self-end rotate-180 leading-none flex flex-col items-center">
              <span>{currentCard.val}</span>
              <span className="text-[10px]">{currentCard.suit}</span>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 border border-white flex flex-col items-center justify-center p-1 text-center">
            <span className="text-white text-xs font-black font-mono">DECK</span>
            <span className="text-blue-100 text-[8px] font-bold uppercase tracking-widest mt-1">Tap Draw</span>
          </div>
        )}
      </motion.div>

      <button
        onClick={drawCard}
        disabled={drawing}
        className="mt-4 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${drawing ? 'animate-spin' : ''}`} />
        Draw Card
      </button>

      {/* History */}
      <div className="flex gap-1.5 mt-3 items-center min-h-[30px]">
        <span className="text-[9px] font-extrabold uppercase tracking-wider text-neutral-400 font-mono mr-1">History:</span>
        {history.length === 0 ? (
          <span className="text-[9px] text-neutral-400 italic font-mono">No draws yet</span>
        ) : (
          history.map((card, i) => {
            const lastChar = card[card.length - 1];
            const red = lastChar === '♥' || lastChar === '♦';
            return (
              <span
                key={i}
                className={`px-1.5 py-0.5 rounded border text-[10px] font-black font-mono shadow-sm bg-white dark:bg-neutral-850 ${
                  red ? 'text-red-500 border-red-200' : 'text-neutral-800 dark:text-neutral-200 border-neutral-300'
                }`}
              >
                {card}
              </span>
            );
          })
        )}
      </div>
    </div>
  );
}
