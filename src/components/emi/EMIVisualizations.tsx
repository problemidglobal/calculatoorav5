import React, { useRef, useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { Download, ChartPie, TrendingDown, Layers, Milestone } from 'lucide-react';
import html2canvas from 'html2canvas';
import { EMIPaymentRow, EMICalculationResults } from '../../utils/emiMath';

interface EMIVisualizationsProps {
  results: EMICalculationResults;
  baseline: EMICalculationResults;
  currency: string;
}

export default function EMIVisualizations({ results, baseline, currency }: EMIVisualizationsProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [activeChart, setActiveChart] = useState<'balance' | 'pie' | 'composition' | 'impact'>('balance');
  const [isExporting, setIsExporting] = useState(false);

  // Generate downsampled data for timeline charts to keep Recharts highly performant
  const downsampledData = React.useMemo(() => {
    const rows = results.rows;
    if (rows.length === 0) return [];

    const targetPoints = 40;
    const step = Math.max(1, Math.floor(rows.length / targetPoints));
    
    const data = [];
    for (let i = 0; i < rows.length; i += step) {
      const row = rows[i];
      // Find corresponding baseline row at same payment index
      const baseRow = baseline.rows[i] || null;

      data.push({
        name: row.paymentDate,
        paymentIndex: row.paymentNumber,
        balance: Math.round(row.remainingBalance),
        interestPaid: Math.round(row.interestPaid),
        principalPaid: Math.round(row.principalPaid + row.extraPayment),
        runningInterest: Math.round(row.runningInterest),
        baseBalance: baseRow ? Math.round(baseRow.remainingBalance) : 0,
      });
    }

    // Always include the last row if not already added
    const lastRow = rows[rows.length - 1];
    const lastBaseRow = baseline.rows[baseline.rows.length - 1] || null;
    const alreadyAdded = data.find(d => d.paymentIndex === lastRow.paymentNumber);
    if (!alreadyAdded) {
      data.push({
        name: lastRow.paymentDate,
        paymentIndex: lastRow.paymentNumber,
        balance: Math.round(lastRow.remainingBalance),
        interestPaid: Math.round(lastRow.interestPaid),
        principalPaid: Math.round(lastRow.principalPaid + lastRow.extraPayment),
        runningInterest: Math.round(lastRow.runningInterest),
        baseBalance: lastBaseRow ? Math.round(lastBaseRow.remainingBalance) : 0,
      });
    }

    return data;
  }, [results, baseline]);

  // Distribution Pie Chart Data
  const pieData = [
    { name: 'Total Principal', value: results.totalPrincipal, color: '#3b82f6' }, // Premium Blue
    { name: 'Total Interest', value: results.totalInterest, color: '#f59e0b' },   // Amber
    { name: 'Additional Fees / Cost', value: results.totalExtraFees, color: '#10b981' } // Emerald
  ];

  // Export Chart container to PNG
  const downloadPNG = async () => {
    if (!chartContainerRef.current) return;
    setIsExporting(true);
    try {
      // Set temporary white background for dark mode compatibility during screenshot
      const isDark = document.documentElement.classList.contains('dark');
      if (isDark) {
        chartContainerRef.current.style.backgroundColor = '#171717';
      } else {
        chartContainerRef.current.style.backgroundColor = '#ffffff';
      }

      const canvas = await html2canvas(chartContainerRef.current, {
        useCORS: true,
        scale: 2, // Retinal display resolution
        backgroundColor: isDark ? '#171717' : '#ffffff',
      });
      
      chartContainerRef.current.style.backgroundColor = ''; // restore original

      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `calculatoora_emi_visual_analytics.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Failed to export charts:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const formatCurrency = (val: number) => {
    return `${currency}${val.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Top Selector Rail */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Interactive Visualization Dashboard
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Compare repayment balances, schedules, and savings curves instantly.
          </p>
        </div>

        <button
          onClick={downloadPNG}
          disabled={isExporting}
          className="self-start md:self-auto px-3.5 py-1.5 text-xs font-bold bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl transition flex items-center gap-1.5 border border-transparent dark:border-neutral-850"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? 'Generating PNG...' : 'Download Charts PNG'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1 bg-neutral-50 dark:bg-neutral-950 rounded-2xl mb-6 border border-neutral-100 dark:border-neutral-850 self-start">
        <button
          onClick={() => setActiveChart('balance')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeChart === 'balance'
              ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Milestone className="w-3.5 h-3.5" />
          Balance Curve
        </button>

        <button
          onClick={() => setActiveChart('pie')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeChart === 'pie'
              ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <ChartPie className="w-3.5 h-3.5" />
          Cost Distribution
        </button>

        <button
          onClick={() => setActiveChart('composition')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
            activeChart === 'composition'
              ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
              : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          EMI Composition
        </button>

        {results.hasExtraPayments && (
          <button
            onClick={() => setActiveChart('impact')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              activeChart === 'impact'
                ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-sm border border-neutral-200/50 dark:border-neutral-700'
                : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
            Prepayment Impact
          </button>
        )}
      </div>

      {/* Charts Box */}
      <div 
        ref={chartContainerRef} 
        className="h-80 w-full p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 flex items-center justify-center overflow-hidden"
      >
        {downsampledData.length === 0 ? (
          <p className="text-sm text-neutral-400">Please provide a valid loan setup to render charts.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {activeChart === 'balance' ? (
              <AreaChart data={downsampledData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#888888" />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 9 }} stroke="#888888" />
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Outstanding Balance']}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '11px', color: '#171717' }}
                />
                <Area type="monotone" dataKey="balance" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorBalance)" />
              </AreaChart>
            ) : activeChart === 'pie' ? (
              <PieChart>
                <Pie
                  data={pieData.filter(d => d.value > 0)}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.filter(d => d.value > 0).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => [formatCurrency(Number(value)), 'Amount']}
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '11px', color: '#171717' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            ) : activeChart === 'composition' ? (
              <AreaChart data={downsampledData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.01}/>
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#888888" />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 9 }} stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '11px', color: '#171717' }}
                  formatter={(value: any, name: string) => [formatCurrency(Number(value)), name === 'principalPaid' ? 'Principal Repayment' : 'Interest Accrued']}
                />
                <Area type="monotone" dataKey="principalPaid" stackId="1" stroke="#3b82f6" strokeWidth={2} fill="url(#colorPrincipal)" />
                <Area type="monotone" dataKey="interestPaid" stackId="1" stroke="#f59e0b" strokeWidth={2} fill="url(#colorInterest)" />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </AreaChart>
            ) : (
              <LineChart data={downsampledData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e5e5" className="dark:stroke-neutral-800" />
                <XAxis dataKey="name" tick={{ fontSize: 9 }} stroke="#888888" />
                <YAxis tickFormatter={formatCurrency} tick={{ fontSize: 9 }} stroke="#888888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: 'none', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', fontSize: '11px', color: '#171717' }}
                  formatter={(value: any, name: string) => [formatCurrency(Number(value)), name === 'balance' ? 'Prepaid Plan Balance' : 'Base Plan Balance']}
                />
                <Line type="monotone" dataKey="baseBalance" stroke="#ef4444" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Base Loan Schedule" />
                <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={3} dot={false} name="With Prepayments" />
                <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Progress indicators */}
      {results.rows.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
            <span className="text-xs text-neutral-400 font-bold block mb-1">Repayment Speed</span>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-neutral-800 dark:text-white">
                {results.hasExtraPayments ? `${results.rows.length} Payments` : 'Regular Pace'}
              </span>
              {results.hasExtraPayments && (
                <span className="text-xs font-semibold text-emerald-500 mb-1">
                  ({Math.round(results.timeSavedMonths)}m saved)
                </span>
              )}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
            <span className="text-xs text-neutral-400 font-bold block mb-1">Cumulative Interest Ratio</span>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-neutral-800 dark:text-white">
                {results.interestPercent.toFixed(1)}%
              </span>
              <span className="text-xs text-neutral-500 mb-1">
                of total cost
              </span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-850">
            <span className="text-xs text-neutral-400 font-bold block mb-1">Total out of pocket</span>
            <div className="flex items-end gap-2">
              <span className="text-lg font-bold text-neutral-800 dark:text-white">
                {currency}{(results.totalPayment + results.totalExtraFees).toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <span className="text-xs text-neutral-500 mb-1">
                incl. fees
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
