import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';
import { Download, Info } from 'lucide-react';
import { normalPDF, getPercentile } from '../utils/statisticsMath';

interface VisualizerProps {
  data: number[];
  stats: any; // DescriptiveStats from statisticsMath
  regression?: any; // RegressionResult from statisticsMath
  groupComparison?: {
    enabled: boolean;
    dataA: number[];
    dataB: number[];
    statsA: any;
    statsB: any;
  };
}

export default function StatisticsVisualizer({ data, stats, regression, groupComparison }: VisualizerProps) {
  const sortedData = useMemo(() => [...data].sort((a, b) => a - b), [data]);
  const count = sortedData.length;

  // 1. Histogram & Frequency Polygon & Ogive data calculation
  const { histogramData, polygonData, ogiveData } = useMemo(() => {
    if (count === 0) return { histogramData: [], polygonData: [], ogiveData: [] };

    const min = stats.min;
    const max = stats.max;
    const range = stats.range;

    // Sturges' rule for bin count
    const k = Math.max(5, Math.ceil(Math.log2(count) + 1));
    const binWidth = range === 0 ? 1 : range / k;

    const bins = [];
    for (let i = 0; i < k; i++) {
      const start = min + i * binWidth;
      const end = start + binWidth;
      bins.push({
        start,
        end,
        label: `${start.toFixed(2)} - ${end.toFixed(2)}`,
        midpoint: start + binWidth / 2,
        count: 0,
        cumulativeCount: 0
      });
    }

    // Place values in bins
    sortedData.forEach((val) => {
      let placed = false;
      for (let i = 0; i < k; i++) {
        const bin = bins[i];
        // For the last bin, include the upper boundary
        if (i === k - 1) {
          if (val >= bin.start && val <= bin.end) {
            bin.count++;
            placed = true;
            break;
          }
        } else {
          if (val >= bin.start && val < bin.end) {
            bin.count++;
            placed = true;
            break;
          }
        }
      }
      if (!placed && range === 0 && bins[0]) {
        bins[0].count++;
      }
    });

    // Compute cumulative
    let accum = 0;
    bins.forEach((bin) => {
      accum += bin.count;
      bin.cumulativeCount = accum;
    });

    const hData = bins.map((bin) => ({
      name: bin.label,
      Frequency: bin.count,
      midpoint: bin.midpoint
    }));

    const pData = bins.map((bin) => ({
      name: bin.midpoint.toFixed(2),
      Frequency: bin.count
    }));

    // Ogive starts at zero at the lower boundary of the first bin
    const oData = [
      { name: bins[0].start.toFixed(2), 'Cumulative %': 0 }
    ];
    bins.forEach((bin) => {
      oData.push({
        name: bin.end.toFixed(2),
        'Cumulative %': Math.round((bin.cumulativeCount / count) * 100)
      });
    });

    return { histogramData: hData, polygonData: pData, ogiveData: oData };
  }, [sortedData, count, stats]);

  // 2. Bar Chart & Pie Chart data (unique value distribution)
  const uniqueDistribution = useMemo(() => {
    if (count === 0) return [];
    const counts: { [key: number]: number } = {};
    data.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });

    return Object.keys(counts)
      .map((key) => ({
        value: Number(key),
        Frequency: counts[Number(key)]
      }))
      .sort((a, b) => a.value - b.value);
  }, [data, count]);

  // Colors for charts
  const COLORS = ['#2563eb', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#ef4444'];

  // 3. Normal Distribution Curve
  const normalDistributionCurve = useMemo(() => {
    if (count === 0 || stats.populationStdDev === 0) return [];
    const mean = stats.mean;
    const sd = stats.populationStdDev;
    const startX = mean - 3.5 * sd;
    const endX = mean + 3.5 * sd;
    const step = (endX - startX) / 100;

    const points = [];
    for (let i = 0; i <= 100; i++) {
      const x = startX + i * step;
      const pdf = normalPDF(x, mean, sd);
      points.push({
        x: Number(x.toFixed(4)),
        y: Number(pdf.toFixed(6))
      });
    }
    return points;
  }, [count, stats]);

  // 4. Q-Q Plot
  const qqPlotData = useMemo(() => {
    if (count < 2) return [];
    // Theoretical quantiles for normal distribution
    // p = (i - 0.5) / n
    // Z-score at p
    const mean = stats.mean;
    const sd = stats.populationStdDev;

    return sortedData.map((val, idx) => {
      const p = (idx + 0.5) / count;
      // Inverse standard normal CDF approximation
      const t = Math.sqrt(-2 * Math.log(Math.min(p, 1 - p)));
      let z = t - (2.515517 + 0.802853 * t + 0.010328 * t * t) / (1 + 1.432788 * t + 0.189269 * t * t + 0.001308 * t * t * t);
      if (p < 0.5) z = -z;

      const theoretical = mean + z * sd;
      return {
        theoretical: Number(theoretical.toFixed(4)),
        observed: val
      };
    });
  }, [sortedData, count, stats]);

  // 5. Stem and Leaf Plot (beautiful representation)
  const stemLeafOutput = useMemo(() => {
    if (count === 0) return 'No data available.';
    // Find scale: usually tens stem and ones leaf, or ones stem and decimals leaf
    // Let's decide scale based on standard deviation and range
    const maxVal = stats.max;
    const minVal = stats.min;
    const range = maxVal - minVal;

    let divisor = 10;
    if (range < 5 && range > 0) {
      divisor = 1; // stem is integer, leaf is first decimal
    } else if (range >= 100) {
      divisor = 100; // stem is hundreds, leaf is tens
    }

    const stems: { [key: number]: number[] } = {};

    sortedData.forEach((val) => {
      let stemVal, leafVal;
      if (divisor === 1) {
        stemVal = Math.floor(val);
        leafVal = Math.round((val - stemVal) * 10) % 10;
      } else if (divisor === 10) {
        stemVal = Math.floor(val / 10);
        leafVal = Math.round(val) % 10;
      } else {
        stemVal = Math.floor(val / 100);
        leafVal = Math.floor((val % 100) / 10);
      }

      if (!stems[stemVal]) stems[stemVal] = [];
      stems[stemVal].push(leafVal);
    });

    return Object.keys(stems)
      .map(Number)
      .sort((a, b) => a - b)
      .map((stem) => {
        const leaves = stems[stem].sort((a, b) => a - b).join(' ');
        return `${stem.toString().padStart(3, ' ')} | ${leaves}`;
      })
      .join('\n');
  }, [sortedData, count, stats]);

  // 6. Dot Plot calculation
  const dotPlotData = useMemo(() => {
    if (count === 0) return [];
    // Count frequencies of distinct values
    const valueCounts: { [key: number]: number } = {};
    data.forEach((val) => {
      valueCounts[val] = (valueCounts[val] || 0) + 1;
    });

    const uniqueValues = Object.keys(valueCounts)
      .map(Number)
      .sort((a, b) => a - b);

    // Limit to max 30 distinct values to draw comfortably
    if (uniqueValues.length > 30) {
      return []; // Return empty if too continuous, we'll guide the UI
    }

    return uniqueValues.map((val) => ({
      value: val,
      dots: Array(valueCounts[val]).fill(0)
    }));
  }, [data, count]);

  // Trigger HTML download or screenshot download for card
  const downloadChart = (chartId: string, filename: string) => {
    const element = document.getElementById(chartId);
    if (!element) return;
    import('html2canvas').then((html2canvasModule) => {
      const h2c = (html2canvasModule.default || html2canvasModule) as any;
      h2c(element, {
        backgroundColor: document.documentElement.classList.contains('dark') ? '#171717' : '#ffffff',
        scale: 2
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    });
  };

  if (count === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 text-center text-neutral-500">
        Enter sample dataset to render charts automatically.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Grid of Standard Visualizations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 1. HISTOGRAM */}
        <div id="chart-histogram" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Histogram</h3>
              <p className="text-xs text-neutral-500">Frequency distribution across calculated ranges</p>
            </div>
            <button
              onClick={() => downloadChart('chart-histogram', 'histogram.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Histogram Chart as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="Frequency" fill="url(#blueGrad)" radius={[4, 4, 0, 0]} barSize={50} />
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.85} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.25} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. NORMAL DISTRIBUTION CURVE */}
        <div id="chart-normal-curve" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Normal Distribution Curve</h3>
              <p className="text-xs text-neutral-500">Theoretical probability density mapping (Bell Curve)</p>
            </div>
            <button
              onClick={() => downloadChart('chart-normal-curve', 'bell_curve.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Normal Curve as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            {stats.populationStdDev === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500">
                Cannot render standard curve when standard deviation is zero.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={normalDistributionCurve} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                  <XAxis dataKey="x" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#fff'
                    }}
                  />
                  <Area type="monotone" dataKey="y" stroke="#06b6d4" fill="url(#cyanGrad)" strokeWidth={2} />
                  <defs>
                    <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. SCATTER PLOT & REGRESSION LINE */}
        <div id="chart-regression" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Scatter Plot with Regression</h3>
              <p className="text-xs text-neutral-500">{regression ? `Linear Equation: ${regression.equation}` : 'Correlation & scatter observation'}</p>
            </div>
            <button
              onClick={() => downloadChart('chart-regression', 'regression_scatter.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Scatter Plot as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            {regression && regression.dataPoints.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={regression.dataPoints} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                  <XAxis dataKey="x" type="number" name="X" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis dataKey="y" type="number" name="Y" stroke="#888888" fontSize={10} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#fff'
                    }}
                  />
                  <Scatter name="Observations" dataKey="y" fill="#2563eb" size={60} />
                  <Line name="Regression Trend" dataKey="yPred" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-xs text-neutral-500 px-8 text-center space-y-2">
                <Info className="w-5 h-5 text-neutral-400" />
                <p>To view regression visualizers, enter two-variable datasets (X and Y variables) under the correlation panel.</p>
              </div>
            )}
          </div>
        </div>

        {/* 4. BOX AND WHISKER PLOT (STUNNING SVG) */}
        <div id="chart-boxplot" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Box & Whisker Plot</h3>
              <p className="text-xs text-neutral-500">Distribution, quartiles, median & outliers</p>
            </div>
            <button
              onClick={() => downloadChart('chart-boxplot', 'boxplot.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Boxplot as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full flex items-center justify-center">
            {stats && count > 0 ? (
              <div className="w-full h-full max-w-lg flex flex-col justify-center space-y-4 px-4 select-none">
                {/* SVG Canvas */}
                <svg viewBox="0 0 500 120" className="w-full h-auto overflow-visible">
                  {/* Outer scale / axis line */}
                  <line x1="40" y1="90" x2="460" y2="90" stroke="#888888" strokeWidth="1" strokeDasharray="3 3" />
                  
                  {/* Axis scale values */}
                  <text x="40" y="110" fontSize="10" fill="#888888" textAnchor="middle">{stats.min.toFixed(1)}</text>
                  <text x="250" y="110" fontSize="10" fill="#888888" textAnchor="middle">{stats.median.toFixed(1)}</text>
                  <text x="460" y="110" fontSize="10" fill="#888888" textAnchor="middle">{stats.max.toFixed(1)}</text>

                  {/* Calculations mapping min -> 40, max -> 460 */}
                  {(() => {
                    const min = stats.min;
                    const max = stats.max;
                    const range = max - min || 1;
                    const scale = (val: number) => 40 + ((val - min) / range) * 420;

                    const xMin = scale(stats.min);
                    const xQ1 = scale(stats.q1);
                    const xMedian = scale(stats.median);
                    const xQ3 = scale(stats.q3);
                    const xMax = scale(stats.max);

                    return (
                      <g>
                        {/* Whiskers (dashed) */}
                        <line x1={xMin} y1="50" x2={xQ1} y2="50" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={xQ3} y1="50" x2={xMax} y2="50" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />

                        {/* Whiskers boundary caps */}
                        <line x1={xMin} y1="35" x2={xMin} y2="65" stroke="#4b5563" strokeWidth="3" />
                        <line x1={xMax} y1="35" x2={xMax} y2="65" stroke="#4b5563" strokeWidth="3" />

                        {/* Box (Q1 to Q3) */}
                        <rect 
                          x={xQ1} 
                          y="25" 
                          width={Math.max(2, xQ3 - xQ1)} 
                          height="50" 
                          fill="url(#boxGrad)" 
                          stroke="#2563eb" 
                          strokeWidth="2" 
                          rx="4"
                        />

                        {/* Median line */}
                        <line x1={xMedian} y1="25" x2={xMedian} y2="75" stroke="#ef4444" strokeWidth="3" />

                        {/* Annotations */}
                        <text x={xQ1} y="15" fontSize="8" fill="#3b82f6" fontWeight="bold" textAnchor="middle">Q1: {stats.q1.toFixed(1)}</text>
                        <text x={xMedian} y="92" fontSize="9" fill="#ef4444" fontWeight="bold" textAnchor="middle">Med: {stats.median.toFixed(1)}</text>
                        <text x={xQ3} y="15" fontSize="8" fill="#3b82f6" fontWeight="bold" textAnchor="middle">Q3: {stats.q3.toFixed(1)}</text>

                        {/* Box Fill Gradient */}
                        <defs>
                          <linearGradient id="boxGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
                          </linearGradient>
                        </defs>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            ) : (
              <div className="text-sm text-neutral-500">Provide observations.</div>
            )}
          </div>
        </div>

        {/* 5. FREQUENCY POLYGON */}
        <div id="chart-polygon" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Frequency Polygon</h3>
              <p className="text-xs text-neutral-500">Continuous representation of frequency distribution</p>
            </div>
            <button
              onClick={() => downloadChart('chart-polygon', 'frequency_polygon.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Frequency Polygon as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={polygonData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="Frequency" stroke="#8b5cf6" strokeWidth={3} dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 6. OGIVE (CUMULATIVE PERCENTAGE POLYGON) */}
        <div id="chart-ogive" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Ogive (Cumulative % Curve)</h3>
              <p className="text-xs text-neutral-500">Distribution cumulative trends to 100%</p>
            </div>
            <button
              onClick={() => downloadChart('chart-ogive', 'ogive_curve.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Ogive as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ogiveData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} domain={[0, 100]} unit="%" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="Cumulative %" stroke="#10b981" strokeWidth={3} dot={{ stroke: '#10b981', strokeWidth: 2, r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7. Q-Q PLOT */}
        <div id="chart-qq" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Q-Q Plot (Quantile-Quantile)</h3>
              <p className="text-xs text-neutral-500">Compare data distribution with theoretical normal</p>
            </div>
            <button
              onClick={() => downloadChart('chart-qq', 'qq_plot.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Q-Q Plot as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            {count < 2 ? (
              <div className="h-full flex items-center justify-center text-xs text-neutral-500">
                Requires at least 2 data points for Q-Q projection.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                  <XAxis dataKey="theoretical" type="number" name="Theoretical Quantiles" stroke="#888888" fontSize={10} tickLine={false} label={{ value: 'Theoretical Quantiles', position: 'bottom', offset: -5, fontSize: 10 }} />
                  <YAxis dataKey="observed" type="number" name="Sample Quantiles" stroke="#888888" fontSize={10} tickLine={false} label={{ value: 'Observed Quantiles', angle: -90, position: 'left', offset: 10, fontSize: 10 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(23, 23, 23, 0.95)',
                      border: 'none',
                      borderRadius: '16px',
                      color: '#fff'
                    }}
                  />
                  <Scatter name="Quantile Map" data={qqPlotData} fill="#ec4899" size={50} />
                </ScatterChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 8. LINE CHART & SEQUENCE */}
        <div id="chart-sequence" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Line Chart (Observation Sequence)</h3>
              <p className="text-xs text-neutral-500">Individual values mapped over sequence indices</p>
            </div>
            <button
              onClick={() => downloadChart('chart-sequence', 'line_sequence.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Line Sequence Chart as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.map((val, i) => ({ index: i + 1, value: val }))} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="index" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff'
                  }}
                />
                <Line type="linear" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 9. BAR CHART (DISTRIBUTION BY COUNT) */}
        <div id="chart-bar" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Bar Chart</h3>
              <p className="text-xs text-neutral-500">Absolute counts of distinct data observations</p>
            </div>
            <button
              onClick={() => downloadChart('chart-bar', 'bar_counts.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Bar Chart as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={uniqueDistribution} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:stroke-neutral-800" vertical={false} />
                <XAxis dataKey="value" stroke="#888888" fontSize={10} tickLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="Frequency" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 10. PIE CHART */}
        <div id="chart-pie" className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 relative group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider">Pie Chart</h3>
              <p className="text-xs text-neutral-500">Proportional representation of unique data points</p>
            </div>
            <button
              onClick={() => downloadChart('chart-pie', 'pie_chart.png')}
              className="p-2 text-neutral-400 hover:text-blue-500 dark:hover:text-cyan-400 transition"
              title="Download PNG"
              aria-label="Download Pie Chart as PNG"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={uniqueDistribution}
                  dataKey="Frequency"
                  nameKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  label={({ value }) => `Val: ${value}`}
                >
                  {uniqueDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(23, 23, 23, 0.95)',
                    border: 'none',
                    borderRadius: '16px',
                    color: '#fff'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Grid of Stem & Leaf Plot and Dot Plot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* STEM AND LEAF PLOT */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-2">Stem and Leaf Plot</h3>
          <p className="text-xs text-neutral-500 mb-4">A semi-graphical method to display the distribution structure</p>
          <div className="bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-4 border border-neutral-150 dark:border-neutral-900 overflow-x-auto">
            <pre className="font-mono text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {stemLeafOutput}
            </pre>
          </div>
        </div>

        {/* DOT PLOT */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-2">Dot Plot</h3>
          <p className="text-xs text-neutral-500 mb-4">Visually stack individual data occurrences</p>
          
          {dotPlotData.length > 0 ? (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
              {dotPlotData.map((row, idx) => (
                <div key={idx} className="flex items-center space-x-4 border-b border-neutral-100 dark:border-neutral-850 pb-1 text-xs">
                  <span className="w-16 font-mono font-bold text-neutral-600 dark:text-neutral-400 text-right">{row.value} :</span>
                  <div className="flex flex-wrap gap-1">
                    {row.dots.map((_, i) => (
                      <span key={i} className="w-3.5 h-3.5 rounded-full bg-blue-500 dark:bg-cyan-400 shadow-sm animate-pulse inline-block" />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-neutral-500 flex items-center justify-center h-48 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              Dot plot works best for datasets with fewer than 30 unique numerical values.
            </div>
          )}
        </div>

      </div>

      {/* Group Comparison Boxplots if applicable */}
      {groupComparison?.enabled && (
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider mb-4">Comparative Boxplots (Group A vs Group B)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-2 text-center">Group A</h4>
              {/* Boxplot Group A */}
              <div className="h-44 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-4">
                <svg viewBox="0 0 500 120" className="w-full h-auto overflow-visible">
                  <line x1="40" y1="90" x2="460" y2="90" stroke="#888888" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="40" y="110" fontSize="10" fill="#888888" textAnchor="middle">{groupComparison.statsA?.min.toFixed(1)}</text>
                  <text x="250" y="110" fontSize="10" fill="#888888" textAnchor="middle">{groupComparison.statsA?.median.toFixed(1)}</text>
                  <text x="460" y="110" fontSize="10" fill="#888888" textAnchor="middle">{groupComparison.statsA?.max.toFixed(1)}</text>
                  {(() => {
                    const statsA = groupComparison.statsA;
                    if (!statsA) return null;
                    const min = statsA.min;
                    const max = statsA.max;
                    const range = max - min || 1;
                    const scale = (val: number) => 40 + ((val - min) / range) * 420;
                    return (
                      <g>
                        <line x1={scale(statsA.min)} y1="50" x2={scale(statsA.q1)} y2="50" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={scale(statsA.q3)} y1="50" x2={scale(statsA.max)} y2="50" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={scale(statsA.min)} y1="35" x2={scale(statsA.min)} y2="65" stroke="#4b5563" strokeWidth="3" />
                        <line x1={scale(statsA.max)} y1="35" x2={scale(statsA.max)} y2="65" stroke="#4b5563" strokeWidth="3" />
                        <rect x={scale(statsA.q1)} y="25" width={Math.max(2, scale(statsA.q3) - scale(statsA.q1))} height="50" fill="url(#boxA)" stroke="#2563eb" strokeWidth="2" rx="4" />
                        <line x1={scale(statsA.median)} y1="25" x2={scale(statsA.median)} y2="75" stroke="#ef4444" strokeWidth="3" />
                        <defs>
                          <linearGradient id="boxA" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#93c5fd" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#2563eb" stopOpacity={0.15} />
                          </linearGradient>
                        </defs>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest mb-2 text-center">Group B</h4>
              {/* Boxplot Group B */}
              <div className="h-44 flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 rounded-2xl p-4">
                <svg viewBox="0 0 500 120" className="w-full h-auto overflow-visible">
                  <line x1="40" y1="90" x2="460" y2="90" stroke="#888888" strokeWidth="1" strokeDasharray="3 3" />
                  <text x="40" y="110" fontSize="10" fill="#888888" textAnchor="middle">{groupComparison.statsB?.min.toFixed(1)}</text>
                  <text x="250" y="110" fontSize="10" fill="#888888" textAnchor="middle">{groupComparison.statsB?.median.toFixed(1)}</text>
                  <text x="460" y="110" fontSize="10" fill="#888888" textAnchor="middle">{groupComparison.statsB?.max.toFixed(1)}</text>
                  {(() => {
                    const statsB = groupComparison.statsB;
                    if (!statsB) return null;
                    const min = statsB.min;
                    const max = statsB.max;
                    const range = max - min || 1;
                    const scale = (val: number) => 40 + ((val - min) / range) * 420;
                    return (
                      <g>
                        <line x1={scale(statsB.min)} y1="50" x2={scale(statsB.q1)} y2="50" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={scale(statsB.q3)} y1="50" x2={scale(statsB.max)} y2="50" stroke="#6b7280" strokeWidth="2" strokeDasharray="4 4" />
                        <line x1={scale(statsB.min)} y1="35" x2={scale(statsB.min)} y2="65" stroke="#4b5563" strokeWidth="3" />
                        <line x1={scale(statsB.max)} y1="35" x2={scale(statsB.max)} y2="65" stroke="#4b5563" strokeWidth="3" />
                        <rect x={scale(statsB.q1)} y="25" width={Math.max(2, scale(statsB.q3) - scale(statsB.q1))} height="50" fill="url(#boxB)" stroke="#10b981" strokeWidth="2" rx="4" />
                        <line x1={scale(statsB.median)} y1="25" x2={scale(statsB.median)} y2="75" stroke="#ef4444" strokeWidth="3" />
                        <defs>
                          <linearGradient id="boxB" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#a7f3d0" stopOpacity={0.6} />
                            <stop offset="100%" stopColor="#10b981" stopOpacity={0.15} />
                          </linearGradient>
                        </defs>
                      </g>
                    );
                  })()}
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
