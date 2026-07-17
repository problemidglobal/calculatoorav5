import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Target, 
  Percent, 
  HelpCircle, 
  AlertCircle, 
  Briefcase, 
  Activity, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  Calculator,
  ArrowRight
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  InvestmentResults, 
  InvestmentInputs,
  solveMonthlyContribution,
  solveYearsToGoal,
  solveRequiredReturn
} from '../utils/ultimateInvestmentMath';

interface UltimateInvestmentResultsProps {
  results: InvestmentResults;
  inputs: InvestmentInputs;
}

export default function UltimateInvestmentResults({
  results,
  inputs
}: UltimateInvestmentResultsProps) {
  const [activeTab, setActiveTab] = useState<'growth' | 'breakdown' | 'portfolio' | 'goals'>('growth');
  
  // Interactive Goal solver states
  const [solverType, setSolverType] = useState<'sip' | 'years' | 'return'>('sip');
  const [solverGoal, setSolverGoal] = useState<number>(inputs.investmentGoal || 1000000);
  const [solverYears, setSolverYears] = useState<number>(inputs.investmentPeriodYears || 10);
  const [solverReturn, setSolverReturn] = useState<number>(inputs.annualReturn || 8);
  const [solverInitial, setSolverInitial] = useState<number>(inputs.initialInvestment || 10000);
  const [solverMonthly, setSolverMonthly] = useState<number>(inputs.monthlyContribution || 500);

  // Compute solver results
  const solvedSIPResult = useMemo(() => {
    return solveMonthlyContribution(solverGoal, solverYears, solverReturn, solverInitial);
  }, [solverGoal, solverYears, solverReturn, solverInitial]);

  const solvedYearsResult = useMemo(() => {
    return solveYearsToGoal(solverGoal, solverInitial, solverMonthly, solverReturn);
  }, [solverGoal, solverInitial, solverMonthly, solverReturn]);

  const solvedReturnResult = useMemo(() => {
    return solveRequiredReturn(solverGoal, solverInitial, solverMonthly, solverYears);
  }, [solverGoal, solverInitial, solverMonthly, solverYears]);

  const currencySymbol = inputs.currency || '$';

  // Format currency helper
  const formatVal = (val: number) => {
    return currencySymbol + Math.round(val).toLocaleString();
  };

  const chartData = useMemo(() => {
    // We downsample chart points if period is long to ensure performance
    const totalPoints = results.schedule.length;
    const step = Math.max(1, Math.ceil(totalPoints / 120)); // maximum 120 plot points
    const points = [];
    
    for (let i = 0; i < totalPoints; i += step) {
      points.push(results.schedule[i]);
    }
    // Always include final row
    if (totalPoints > 0 && points[points.length - 1]?.month !== totalPoints) {
      points.push(results.schedule[totalPoints - 1]);
    }
    
    return points.map(row => ({
      name: row.date,
      'Expected Value': Math.round(row.nominalBalance),
      'Real Value (Inflation Adjusted)': Math.round(row.realBalance),
      'Total Contributions': Math.round(row.totalContributions),
      'Worst Case (90% Conf)': Math.round(row.worstCaseBalance),
      'Best Case (90% Conf)': Math.round(row.bestCaseBalance),
      'Cumulative Fees': Math.round(row.totalFeesPaid),
      'Cumulative Taxes': Math.round(row.totalTaxesPaid),
    }));
  }, [results.schedule]);

  // Asset allocation charts
  const portfolioAllocationData = useMemo(() => {
    if (inputs.assets.length === 0) {
      return [
        { name: 'Core Single Pool', value: 100, color: '#3b82f6' }
      ];
    }
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#ef4444'];
    return inputs.assets.map((a, idx) => ({
      name: a.name || `Asset ${idx+1}`,
      value: Number(a.percentage) || 0,
      color: colors[idx % colors.length]
    })).filter(a => a.value > 0);
  }, [inputs.assets]);

  return (
    <div className="space-y-6 font-sans text-left">
      
      {/* SECTION A: KEY SUMMARY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Nominal Future Value */}
        <div className="p-4 bg-gradient-to-br from-blue-500/10 to-transparent dark:from-cyan-500/10 dark:to-transparent rounded-2xl border border-blue-500/15 dark:border-cyan-500/15">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400 dark:text-neutral-400">Nominal Portfolio Value</span>
          <div className="text-xl lg:text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
            {formatVal(results.finalNominalValue)}
          </div>
          <p className="text-[10px] text-neutral-450 mt-1 font-medium">Future dollar balance before inflation drag</p>
        </div>

        {/* Metric 2: Real Purchasing Power */}
        <div className="p-4 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-2xl border border-emerald-500/15">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Real Purchasing Power</span>
          <div className="text-xl lg:text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {formatVal(results.finalRealValue)}
          </div>
          <p className="text-[10px] text-neutral-450 mt-1 font-medium">Adjusted for {inputs.inflationRate}% annual inflation</p>
        </div>

        {/* Metric 3: Profit ROI */}
        <div className="p-4 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-2xl border border-indigo-500/15">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Total Net Gain</span>
          <div className="text-xl lg:text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-1">
            {formatVal(results.netProfit)}
          </div>
          <p className="text-[10px] text-indigo-500 dark:text-indigo-400 mt-1 font-black uppercase text-[9px] tracking-wider">
            ROI: {results.roi.toFixed(1)}% ({results.moneyMultiple.toFixed(2)}x Return)
          </p>
        </div>

        {/* Metric 4: Safe Withdrawal (FIRE Target) */}
        <div className="p-4 bg-gradient-to-br from-purple-500/10 to-transparent rounded-2xl border border-purple-500/15">
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Monthly Safe Withdrawal</span>
          <div className="text-xl lg:text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">
            {formatVal(results.safeWithdrawalEstimateMonthly)}
          </div>
          <p className="text-[10px] text-neutral-450 mt-1 font-medium">Est. monthly income based on 4% rule</p>
        </div>

      </div>

      {/* SECTION B: INTERACTIVE CHART TABS */}
      <div className="border-b border-neutral-150 dark:border-neutral-800 flex items-center justify-between pb-1 overflow-x-auto gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('growth')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition select-none cursor-pointer ${
              activeTab === 'growth'
                ? 'bg-neutral-850 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Growth Chart
          </button>
          
          <button
            onClick={() => setActiveTab('breakdown')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition select-none cursor-pointer ${
              activeTab === 'breakdown'
                ? 'bg-neutral-850 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Wealth breakdown
          </button>

          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition select-none cursor-pointer ${
              activeTab === 'portfolio'
                ? 'bg-neutral-850 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Portfolio & Health
          </button>

          <button
            onClick={() => setActiveTab('goals')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition select-none cursor-pointer ${
              activeTab === 'goals'
                ? 'bg-neutral-850 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Interactive goal planners
          </button>
        </div>
      </div>

      {/* TAB CONTENTS */}
      {activeTab === 'growth' && (
        <div className="space-y-4">
          <div className="p-4 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white mb-3">
              Growth Projection Timeline (Expected, Real, and Contributions)
            </h4>
            <div className="h-64 lg:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorExp" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorReal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorContrib" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64748b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#64748b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} tickFormatter={(val) => currencySymbol + (val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000).toFixed(0) + 'K' : val)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="Expected Value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorExp)" />
                  <Area type="monotone" dataKey="Real Value (Inflation Adjusted)" stroke="#10b981" strokeWidth={1.5} fillOpacity={1} fill="url(#colorReal)" strokeDasharray="4 4" />
                  <Area type="monotone" dataKey="Total Contributions" stroke="#64748b" strokeWidth={1} fillOpacity={1} fill="url(#colorContrib)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Volatility Scenarios Bands */}
          <div className="p-4 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">
                Risk Confidence Bands (Expected, Best, and Worst cases)
              </h4>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                <Activity className="w-3 h-3" /> Volatility: {inputs.volatility}%
              </span>
            </div>
            <p className="text-[10px] text-neutral-450 mb-3">
              This projections model evaluates standard deviations over time. The Worst Case is the 10th percentile outcome, and the Best Case is the 90th percentile.
            </p>
            <div className="h-64 lg:h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorBest" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorWorst" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" className="dark:hidden" />
                  <CartesianGrid strokeDasharray="3 3" stroke="#262626" className="hidden dark:block" />
                  <XAxis dataKey="name" stroke="#a3a3a3" fontSize={10} tickLine={false} />
                  <YAxis stroke="#a3a3a3" fontSize={10} tickLine={false} tickFormatter={(val) => currencySymbol + (val >= 1000000 ? (val/1000000).toFixed(1) + 'M' : val >= 1000 ? (val/1000).toFixed(0) + 'K' : val)} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#171717', borderColor: '#262626', borderRadius: '12px' }}
                    labelStyle={{ color: '#fff', fontWeight: 'bold', fontSize: '11px' }}
                    itemStyle={{ fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Area type="monotone" dataKey="Best Case (90% Conf)" stroke="#8b5cf6" strokeWidth={1.5} fillOpacity={1} fill="url(#colorBest)" />
                  <Area type="monotone" dataKey="Expected Value" stroke="#3b82f6" strokeWidth={2} fill="none" />
                  <Area type="monotone" dataKey="Worst Case (90% Conf)" stroke="#f43f5e" strokeWidth={1.5} fillOpacity={1} fill="url(#colorWorst)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center mt-3 border-t border-neutral-100 dark:border-neutral-800 pt-3">
              <div>
                <span className="text-[9px] font-bold text-rose-500 uppercase">Worst Case Outcome</span>
                <p className="text-sm font-black text-rose-500">{formatVal(results.finalWorstCaseValue)}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-blue-500 uppercase">Expected Outcome</span>
                <p className="text-sm font-black text-blue-500">{formatVal(results.finalNominalValue)}</p>
              </div>
              <div>
                <span className="text-[9px] font-bold text-purple-500 uppercase">Best Case Outcome</span>
                <p className="text-sm font-black text-purple-500">{formatVal(results.finalBestCaseValue)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'breakdown' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Ledger/Contribution Breakdown Card */}
          <div className="p-5 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">
              Wealth Asset Accrual Ledger
            </h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium">Initial Seed Capital</span>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{formatVal(inputs.initialInvestment)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium">Total Additional Contributions</span>
                <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">{formatVal(results.totalContributions - inputs.initialInvestment)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium">Capital Appreciation & Interest</span>
                <span className="text-xs font-bold text-emerald-500">+{formatVal(results.totalGains)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium">Total Gross Dividends Earned</span>
                <span className="text-xs font-bold text-indigo-500">+{formatVal(results.totalDividends)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium">Platform & Management Fees</span>
                <span className="text-xs font-bold text-rose-500">-{formatVal(results.totalFees)}</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-xs text-neutral-500 font-medium">Taxes (CGT, Dividends, Annual Wealth)</span>
                <span className="text-xs font-bold text-rose-500">-{formatVal(results.totalTaxes)}</span>
              </div>
              {results.totalWithdrawals > 0 && (
                <div className="flex items-center justify-between py-1.5 border-b border-neutral-100 dark:border-neutral-800">
                  <span className="text-xs text-neutral-500 font-medium">Cumulative Paid-out Cashflows</span>
                  <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">-{formatVal(results.totalWithdrawals)}</span>
                </div>
              )}
              <div className="flex items-center justify-between py-2 pt-4 border-t border-neutral-200 dark:border-neutral-800 font-black text-neutral-850 dark:text-white">
                <span className="text-sm">Final Compounded Balance</span>
                <span className="text-sm text-blue-600 dark:text-cyan-400">{formatVal(results.finalNominalValue)}</span>
              </div>
            </div>
          </div>

          {/* Fees and Taxes Drag visualizer */}
          <div className="p-5 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white mb-2">
                Compound Leakage & Drag Analysis
              </h4>
              <p className="text-[10px] text-neutral-450 mb-4">
                This evaluates how much potential compounding growth was lost to annual wealth taxes, capital gains, dividend levies, and management fees.
              </p>

              <div className="space-y-4">
                {/* Visual bar graph comparing Gross Vs Net */}
                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-neutral-500">Taxes Paid Drag</span>
                    <span className="text-rose-500">{formatVal(results.totalTaxes)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-rose-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (results.totalTaxes / (results.finalNominalValue || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-neutral-500">Fees Paid Drag</span>
                    <span className="text-amber-500">{formatVal(results.totalFees)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-amber-500 h-full rounded-full" 
                      style={{ width: `${Math.min(100, (results.totalFees / (results.finalNominalValue || 1)) * 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-bold mb-1">
                    <span className="text-neutral-500">Inflation purchasing power reduction</span>
                    <span className="text-neutral-400">{formatVal(results.finalNominalValue - results.finalRealValue)}</span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-neutral-400 dark:bg-neutral-600 h-full rounded-full" 
                      style={{ width: `${Math.min(100, ((results.finalNominalValue - results.finalRealValue) / (results.finalNominalValue || 1)) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl text-[10px] font-medium leading-relaxed border border-blue-500/10 mt-4">
              <strong>Smart Optimization advice:</strong> {results.totalFees > results.totalContributions * 0.1 ? 'Your expense structures are relatively high. Switching to a low cost broker or institutional-class index ETFs can increase your compounding returns by up to 15% over long timelines.' : 'Your investment ledger has clean, optimal fee parameters. This preserves maximum returns for long-term compound gains.'}
            </div>
          </div>

        </div>
      )}

      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Portfolio Allocations & Rebalancing suggestions */}
          <div className="p-5 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">
              Portfolio Allocations & Asset Splits
            </h4>
            
            {inputs.assets.length === 0 ? (
              <div className="text-center py-8">
                <Briefcase className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-xs text-neutral-400 italic">No assets added. Expand "Asset Portfolio Allocation" in the sidebar to add asset splits.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="h-44 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={portfolioAllocationData} layout="vertical" margin={{ left: -10, right: 10, top: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#262626" />
                      <XAxis type="number" fontSize={10} tickLine={false} />
                      <YAxis dataKey="name" type="category" fontSize={9} tickLine={false} width={80} />
                      <Tooltip contentStyle={{ backgroundColor: '#171717', borderColor: '#262626' }} />
                      <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]}>
                        {portfolioAllocationData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-300">Rebalancing Strategy</span>
                  <p className="text-[10px] text-neutral-450 leading-relaxed">
                    Check allocations semi-annually. To maintain target splits without trigger tax events, route all new contributions to underweight categories first.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Portfolio Health Card */}
          <div className="p-5 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">
                  Portfolio Health Evaluation Score
                </h4>
                <span className={`text-xs font-black px-2.5 py-1 rounded-full ${
                  results.portfolioHealthScore >= 80 
                    ? 'bg-emerald-500/15 text-emerald-500' 
                    : results.portfolioHealthScore >= 50 
                    ? 'bg-amber-500/15 text-amber-500' 
                    : 'bg-rose-500/15 text-rose-500'
                }`}>
                  {results.portfolioHealthScore}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    results.portfolioHealthScore >= 80 
                      ? 'bg-emerald-500' 
                      : results.portfolioHealthScore >= 50 
                      ? 'bg-amber-500' 
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${results.portfolioHealthScore}%` }}
                />
              </div>

              {/* Checklist details */}
              <div className="space-y-2 max-h-56 overflow-y-auto">
                {results.portfolioHealthRemarks.map((remark, idx) => {
                  const isNegative = remark.includes('High') || remark.includes('Concentration') || remark.includes('Inflation risk') || remark.includes('No portfolio');
                  return (
                    <div key={idx} className="flex gap-2.5 items-start p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-850 bg-neutral-50/40 dark:bg-neutral-900/20 text-[10.5px]">
                      {isNegative ? (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      )}
                      <p className="text-neutral-600 dark:text-neutral-350 font-medium leading-relaxed">{remark}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="text-[9px] text-neutral-400 italic text-center mt-3">
              *Evaluated across diversification indices, step-up multipliers, inflation guards, and net fee ratios.
            </div>
          </div>

        </div>
      )}

      {activeTab === 'goals' && (
        <div className="p-5 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 space-y-5">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-500 dark:text-cyan-400" /> Interactive Goal Solvers
            </h4>
            <p className="text-[10px] text-neutral-450 mt-1">
              Want to hit a different target? Use these custom solvers to calculate your required contribution, time, or rate.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setSolverType('sip')}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer select-none ${
                solverType === 'sip'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850'
              }`}
            >
              Solve Monthly SIP
            </button>

            <button
              onClick={() => setSolverType('years')}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer select-none ${
                solverType === 'years'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850'
              }`}
            >
              Solve Years Needed
            </button>

            <button
              onClick={() => setSolverType('return')}
              className={`py-2 px-2 text-xs font-bold rounded-xl border transition cursor-pointer select-none ${
                solverType === 'return'
                  ? 'bg-blue-500/10 text-blue-600 dark:text-cyan-400 border-blue-500/30'
                  : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-850'
              }`}
            >
              Solve Rate Return
            </button>
          </div>

          {/* SOLVER PANEL */}
          <div className="p-4 rounded-xl bg-neutral-50/50 dark:bg-neutral-900/30 border border-neutral-150 dark:border-neutral-800/80 space-y-4">
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Target Goal</label>
                <input
                  type="number"
                  value={solverGoal}
                  onChange={(e) => setSolverGoal(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-850 rounded-lg bg-white dark:bg-neutral-900"
                />
              </div>

              <div>
                <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Initial Capital</label>
                <input
                  type="number"
                  value={solverInitial}
                  onChange={(e) => setSolverInitial(Math.max(0, Number(e.target.value)))}
                  className="w-full text-xs font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-850 rounded-lg bg-white dark:bg-neutral-900"
                />
              </div>

              {solverType !== 'years' && (
                <div>
                  <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Term (Years)</label>
                  <input
                    type="number"
                    value={solverYears}
                    onChange={(e) => setSolverYears(Math.max(1, Number(e.target.value)))}
                    className="w-full text-xs font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-850 rounded-lg bg-white dark:bg-neutral-900"
                  />
                </div>
              )}

              {solverType !== 'return' && (
                <div>
                  <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Expected Return %</label>
                  <input
                    type="number"
                    value={solverReturn}
                    onChange={(e) => setSolverReturn(Number(e.target.value))}
                    className="w-full text-xs font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-850 rounded-lg bg-white dark:bg-neutral-900"
                  />
                </div>
              )}

              {solverType !== 'sip' && (
                <div>
                  <label className="block text-[9px] font-bold text-neutral-450 uppercase mb-1">Monthly SIP</label>
                  <input
                    type="number"
                    value={solverMonthly}
                    onChange={(e) => setSolverMonthly(Math.max(0, Number(e.target.value)))}
                    className="w-full text-xs font-bold px-2 py-1.5 border border-neutral-200 dark:border-neutral-850 rounded-lg bg-white dark:bg-neutral-900"
                  />
                </div>
              )}
            </div>

            {/* ANSWER ACCORDION */}
            <div className="p-4 bg-blue-500/10 dark:bg-cyan-500/5 rounded-xl border border-blue-500/20 dark:border-cyan-500/10 flex flex-col justify-center items-center text-center">
              {solverType === 'sip' && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">Required Monthly SIP Contribution</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
                    {formatVal(solvedSIPResult)}
                  </div>
                  <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed max-w-sm">
                    Deposit {formatVal(solvedSIPResult)} every month starting with {formatVal(solverInitial)} to accumulate {formatVal(solverGoal)} in {solverYears} years at {solverReturn}% annual growth.
                  </p>
                </>
              )}

              {solverType === 'years' && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">Years until Goal Reached</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
                    {solvedYearsResult === Infinity ? 'Never' : solvedYearsResult.toFixed(1) + ' Years'}
                  </div>
                  <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed max-w-sm">
                    Investing {formatVal(solverMonthly)}/month starting with {formatVal(solverInitial)} will take {solvedYearsResult === Infinity ? 'infinity' : solvedYearsResult.toFixed(1)} years to reach {formatVal(solverGoal)} at {solverReturn}% compound growth.
                  </p>
                </>
              )}

              {solverType === 'return' && (
                <>
                  <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400">Required Annual Compound Return Rate</span>
                  <div className="text-2xl font-black text-blue-600 dark:text-cyan-400 mt-1">
                    {solvedReturnResult.toFixed(2)}%
                  </div>
                  <p className="text-[10px] text-neutral-450 mt-1 leading-relaxed max-w-sm">
                    You need an annual compound return rate of {solvedReturnResult.toFixed(2)}% over {solverYears} years to turn {formatVal(solverInitial)} initial + {formatVal(solverMonthly)}/month into {formatVal(solverGoal)}.
                  </p>
                </>
              )}
            </div>

          </div>
        </div>
      )}

      {/* SECTION C: GOALS AND DEADLINES ALERTS */}
      <div className="p-4 bg-white dark:bg-neutral-900/60 rounded-2xl border border-neutral-150 dark:border-neutral-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 text-blue-600 dark:text-cyan-400 rounded-xl">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Goal Accumulation Status</h5>
            <p className="text-[10px] text-neutral-400 font-medium">
              Target goal set to {formatVal(inputs.investmentGoal)}
            </p>
          </div>
        </div>

        <div>
          {results.goalReached ? (
            <div className="text-right">
              <span className="text-[10px] font-black uppercase bg-emerald-500/15 text-emerald-500 px-3 py-1 rounded-full">
                Target Reached!
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 font-medium">Est. {results.estimatedCompletionDate} (Month {results.monthsToGoal})</p>
            </div>
          ) : (
            <div className="text-right font-sans">
              <span className="text-[10px] font-black uppercase bg-amber-500/15 text-amber-500 px-3 py-1 rounded-full">
                {results.goalProgressPercent.toFixed(1)}% Completed
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 font-medium">Short of goal by {formatVal(inputs.investmentGoal - results.finalNominalValue)}</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
