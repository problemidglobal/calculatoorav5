import React, { useState, useRef } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Coins, 
  ShieldCheck, 
  Calendar,
  Sparkles,
  Flame,
  Target,
  ArrowRight,
  Download,
  Activity,
  HeartCrack,
  Info
} from 'lucide-react';
import { RetirementInputs, RetirementResults as MathResults } from '../utils/retirementMath';
import html2canvas from 'html2canvas';

interface RetirementResultsProps {
  results: MathResults;
  inputs: RetirementInputs;
  setInputs: React.Dispatch<React.SetStateAction<RetirementInputs>>;
}

export default function RetirementResults({ results, inputs, setInputs }: RetirementResultsProps) {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'charts' | 'fire' | 'montecarlo' | 'goal'>('overview');
  const [chartSelection, setChartSelection] = useState<'growth' | 'contrib_vs_growth' | 'purchasing_power' | 'inflation_impact'>('growth');
  
  const dashboardRef = useRef<HTMLDivElement>(null);

  const cur = inputs.currency || '$';

  // Format currency with selected symbol
  const formatMoney = (val: number) => {
    return val.toLocaleString('en-US', {
      style: 'currency',
      currency: inputs.currency === '€' ? 'EUR' : inputs.currency === '£' ? 'GBP' : inputs.currency === '¥' ? 'JPY' : inputs.currency === '₹' ? 'INR' : 'USD',
      maximumFractionDigits: 0
    }).replace('USD', '$').replace('EUR', '€').replace('GBP', '£').replace('JPY', '¥').replace('INR', '₹');
  };

  const readinessColorMap = {
    'Ready': {
      text: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      bar: 'bg-emerald-500',
      bgGradient: 'from-emerald-500/10 to-transparent'
    },
    'Almost Ready': {
      text: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      bar: 'bg-blue-500',
      bgGradient: 'from-blue-500/10 to-transparent'
    },
    'Behind Target': {
      text: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
      bar: 'bg-amber-500',
      bgGradient: 'from-amber-500/10 to-transparent'
    },
    'Needs Improvement': {
      text: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
      bar: 'bg-rose-500',
      bgGradient: 'from-rose-500/10 to-transparent'
    }
  };

  const statusConfig = readinessColorMap[results.readinessStatus] || readinessColorMap['Needs Improvement'];

  // Safe withdrawal rate spending amount
  const swrSpending = results.projectedNestEgg * (inputs.swrPercent / 100);

  // Transform deterministic timeline data for charting
  const deterministicChartData = results.deterministicTimeline.map(item => ({
    ageStr: `Age ${item.age}`,
    age: item.age,
    Balance: Math.round(item.endingBalance),
    Contributions: Math.round(item.contribution),
    Withdrawals: Math.round(item.withdrawal),
    Gains: Math.round(item.investmentReturn),
    PurchasingPower: Math.round(item.purchasingPowerValue),
    CumulativeInflationCost: Math.round(Math.max(0, item.endingBalance - item.purchasingPowerValue)),
    Spending: Math.round(item.spendingNeed)
  }));

  // Transform Monte Carlo data for charting
  const mcChartData = results.monteCarloTimeline.map(item => ({
    ageStr: `Age ${item.age}`,
    'Worst Case (10th Percentile)': Math.round(item.p10),
    'Expected Case (50th Percentile)': Math.round(item.p50),
    'Best Case (90th Percentile)': Math.round(item.p90),
  }));

  // Handle PNG Download
  const handleDownloadDashboard = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        backgroundColor: '#171717',
        scale: 2,
        useCORS: true
      });
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `Calculatoora_Retirement_Readiness_Dashboard.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Failed to capture dashboard image', e);
    }
  };

  // Rule-based Smart Insights generator
  const generateSmartInsights = () => {
    const insights: { type: 'success' | 'warning' | 'info'; text: string }[] = [];
    
    // Insight 1: Age Goal reachability
    if (results.exhaustionAge === null) {
      insights.push({
        type: 'success',
        text: `Excellent sustainability: Your retirement savings are projected to cover your living expenses for your full lifetime through Age ${inputs.lifeExpectancy}.`
      });
    } else {
      insights.push({
        type: 'warning',
        text: `Portfolio depletion: Your savings are projected to run out at Age ${results.exhaustionAge}, which is ${inputs.lifeExpectancy - results.exhaustionAge} years before your life expectancy of ${inputs.lifeExpectancy}.`
      });
    }

    // Insight 2: Sourcing impact (increasing contributions test)
    const futureAgeReach = results.exhaustionAge || inputs.lifeExpectancy;
    const additionalMonthlySavings = 100;
    const preReturnDec = (inputs.preRetireReturn || 0) / 100;
    const yearsToRetire = Math.max(1, (inputs.retirementAge || 65) - (inputs.currentAge || 30));
    const grownValueOfAdditionalSavings = additionalMonthlySavings * 12 * ((Math.pow(1 + preReturnDec, yearsToRetire) - 1) / (preReturnDec || 0.01));
    
    insights.push({
      type: 'info',
      text: `Actionable Leverage: Adding just ${cur}${additionalMonthlySavings} more to your monthly contribution would grow your nest egg by an extra ${formatMoney(grownValueOfAdditionalSavings)} by retirement age.`
    });

    // Insight 3: Inflation Impact
    const finalRow = results.deterministicTimeline[results.deterministicTimeline.length - 1];
    if (finalRow) {
      const inflationLoss = finalRow.endingBalance - finalRow.purchasingPowerValue;
      if (inflationLoss > 0) {
        insights.push({
          type: 'warning',
          text: `Purchasing Power Alert: Inflation at ${inputs.inflationRate}% will reduce your final net worth's purchasing power by ${formatMoney(inflationLoss)} in cumulative real value.`
        });
      }
    }

    // Insight 4: Monte Carlo Success rates
    if (results.monteCarloSuccessRate >= 85) {
      insights.push({
        type: 'success',
        text: `High down-market resilience: With an ${results.monteCarloSuccessRate}% Monte Carlo survival probability, your strategy is highly robust against random market crashes.`
      });
    } else if (results.monteCarloSuccessRate >= 50) {
      insights.push({
        type: 'warning',
        text: `Moderate risk exposure: Your Monte Carlo success rate is ${results.monteCarloSuccessRate}%. A sequence of poor returns early in retirement could put your longevity capital at risk.`
      });
    } else {
      insights.push({
        type: 'warning',
        text: `High vulnerability: Your portfolio has only a ${results.monteCarloSuccessRate}% probability of surviving standard historic market volatility. Increasing contributions or reducing SWR spending is recommended.`
      });
    }

    return insights;
  };

  return (
    <div ref={dashboardRef} className="space-y-6 text-left">
      
      {/* SECTION TOP: KEY SCORES BLOCK */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* READINESS SCORE CARD */}
        <div className="p-6 rounded-3xl border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Readiness Rating</span>
              <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border ${statusConfig.text}`}>
                {results.readinessStatus}
              </span>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <h2 className="text-5xl font-black tracking-tight text-neutral-850 dark:text-white leading-none">
                {results.retirementReadinessScore}
              </h2>
              <span className="text-xs font-semibold text-neutral-400">/ 100 score</span>
            </div>

            {/* Custom progress gauge */}
            <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${statusConfig.bar}`}
                style={{ width: `${results.retirementReadinessScore}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-[10px] text-neutral-400 leading-normal mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
            Ratings combine capital sufficiency factors, lifetime longevity ratios, and market downside protection.
          </p>
        </div>

        {/* NEST EGG SAVINGS GAP CARD */}
        <div className="p-6 rounded-3xl border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Savings Gap / Surplus</span>
              {results.savingsGap > 0 ? (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              ) : (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              )}
            </div>

            <div>
              <h2 className={`text-3xl font-black tracking-tight leading-none ${results.savingsGap > 0 ? 'text-rose-500 dark:text-rose-400' : 'text-emerald-500 dark:text-emerald-400'}`}>
                {results.savingsGap > 0 ? formatMoney(results.savingsGap) : 'Fully Funded!'}
              </h2>
              <p className="text-[10px] text-neutral-400 mt-1.5 font-medium">
                {results.savingsGap > 0 ? 'Shortfall needed to meet target SWR draws' : 'Portfolio exceeds baseline retirement spending targets'}
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500">
                <span>Projected Nest Egg:</span>
                <span className="text-neutral-700 dark:text-neutral-300">{formatMoney(results.projectedNestEgg)}</span>
              </div>
              <div className="flex items-center justify-between text-[9px] font-black uppercase text-neutral-400 dark:text-neutral-500">
                <span>Required Nest Egg:</span>
                <span className="text-neutral-700 dark:text-neutral-300">{formatMoney(results.requiredNestEgg)}</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-neutral-400 leading-normal mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800/50">
            Targets are discounted against guaranteed income streams (Social Security/pensions) and the {inputs.swrPercent}% withdrawal rate.
          </p>
        </div>

        {/* MONTE CARLO PROBABILITY CARD */}
        <div className="p-6 rounded-3xl border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 relative overflow-hidden flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500">Longevity Success Rate</span>
              <Activity className="w-4 h-4 text-blue-500" />
            </div>

            <div className="flex items-baseline gap-2">
              <h2 className="text-5xl font-black tracking-tight text-neutral-850 dark:text-white leading-none">
                {results.monteCarloSuccessRate}%
              </h2>
              <span className="text-xs font-semibold text-neutral-450">of pathways survive</span>
            </div>

            <p className="text-[10px] text-neutral-500 dark:text-neutral-400 leading-relaxed">
              In <strong>{inputs.monteCarloCount || 500}</strong> stochastic market pathways factoring return volatility, your portfolio successfully avoids insolvency.
            </p>
          </div>

          <div className="flex items-center gap-1.5 mt-5 p-2 rounded-xl bg-neutral-100/50 dark:bg-neutral-905 border border-neutral-200/50 dark:border-neutral-800">
            {results.monteCarloSuccessRate >= 85 ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            )}
            <span className="text-[9px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest truncate">
              {results.monteCarloSuccessRate >= 85 ? 'High resilience strategy' : 'Suggest increasing deposits or reducing spending'}
            </span>
          </div>
        </div>

      </div>

      {/* SUB-DASHBOARD TABS SELECTOR */}
      <div className="flex items-center justify-between border-b border-neutral-150 dark:border-neutral-800/80 pb-2">
        <div className="flex gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer select-none ${
              activeSubTab === 'overview'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveSubTab('charts')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer select-none ${
              activeSubTab === 'charts'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Charts Suite
          </button>
          <button
            onClick={() => setActiveSubTab('montecarlo')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer select-none ${
              activeSubTab === 'montecarlo'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Risk Analysis
          </button>
          <button
            onClick={() => setActiveSubTab('fire')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer select-none ${
              activeSubTab === 'fire'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            FIRE Mode
          </button>
          <button
            onClick={() => setActiveSubTab('goal')}
            className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition cursor-pointer select-none ${
              activeSubTab === 'goal'
                ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-700'
                : 'text-neutral-400 hover:text-neutral-700'
            }`}
          >
            Goal Planner
          </button>
        </div>

        <button
          onClick={handleDownloadDashboard}
          className="flex items-center gap-1 text-[9px] font-black text-neutral-500 hover:text-neutral-800 dark:hover:text-white uppercase tracking-widest px-2.5 py-1.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-850 transition select-none cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" /> Save PDF/PNG
        </button>
      </div>

      {/* ACTIVE SUB TAB DISPLAY */}
      <div>
        
        {/* SUB-TAB A: OVERVIEW & SMART INSIGHTS */}
        {activeSubTab === 'overview' && (
          <div className="space-y-6">
            
            {/* SUB METRICS BANNER GRID */}
            <div className="p-5 border border-neutral-150 dark:border-neutral-800 bg-white/40 dark:bg-neutral-900/20 rounded-2xl grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Nest Egg at Retirement</span>
                <p className="text-xl font-black text-neutral-850 dark:text-white leading-tight">
                  {formatMoney(results.projectedNestEgg)}
                </p>
                <span className="text-[9px] text-neutral-400 block">Accrued at Age {inputs.retirementAge}</span>
              </div>
              
              <div className="space-y-1">
                <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Est. SWR Spend (Annual)</span>
                <p className="text-xl font-black text-neutral-850 dark:text-white leading-tight">
                  {formatMoney(swrSpending)}
                </p>
                <span className="text-[9px] text-neutral-400 block">At {inputs.swrPercent}% withdrawal rate</span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Years Portfolio Sustained</span>
                <p className="text-xl font-black text-neutral-850 dark:text-white leading-tight">
                  {results.exhaustionAge === null ? 'Full Lifetime' : `${results.exhaustionAge - inputs.retirementAge} Years`}
                </p>
                <span className="text-[9px] text-neutral-400 block">
                  {results.exhaustionAge === null ? `Past Life Expectancy` : `Runs out at Age ${results.exhaustionAge}`}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[9px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">Net Gains Accrued</span>
                <p className="text-xl font-black text-neutral-850 dark:text-white leading-tight">
                  {formatMoney(results.totalGains)}
                </p>
                <span className="text-[9px] text-neutral-400 block">Total compounding returns</span>
              </div>
            </div>

            {/* SMART INSIGHTS LIST */}
            <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-3xl space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Rule-Based Smart Insights
              </h3>

              <div className="space-y-3">
                {generateSmartInsights().map((ins, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850">
                    <div className="p-1.5 rounded-lg shrink-0 mt-0.5">
                      {ins.type === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : ins.type === 'warning' ? (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-neutral-800 dark:text-neutral-200 leading-normal">{ins.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* SUB-TAB B: DETAILED CHARTS SUITE */}
        {activeSubTab === 'charts' && (
          <div className="space-y-6">
            <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-3xl space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Aesthetic Visualizations</h3>
                  <span className="text-[9px] text-neutral-400 block">Compare timeline variables dynamically across the accumulation and retirement phases</span>
                </div>

                {/* Chart Toggles */}
                <div className="flex flex-wrap gap-1 p-0.5 bg-neutral-100 dark:bg-neutral-950 rounded-xl border border-neutral-250 dark:border-neutral-850">
                  <button
                    onClick={() => setChartSelection('growth')}
                    className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition ${
                      chartSelection === 'growth' ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-450'
                    }`}
                  >
                    Wealth Growth
                  </button>
                  <button
                    onClick={() => setChartSelection('contrib_vs_growth')}
                    className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition ${
                      chartSelection === 'contrib_vs_growth' ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-450'
                    }`}
                  >
                    Contrib vs Growth
                  </button>
                  <button
                    onClick={() => setChartSelection('purchasing_power')}
                    className={`px-2.5 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-lg transition ${
                      chartSelection === 'purchasing_power' ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-sm' : 'text-neutral-450'
                    }`}
                  >
                    Inflation Impact
                  </button>
                </div>
              </div>

              {/* Chart Canvas */}
              <div className="h-[340px] w-full">
                {chartSelection === 'growth' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={deterministicChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.15} />
                      <XAxis dataKey="ageStr" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${cur}${(v / 1000).toLocaleString()}k`} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: any) => [formatMoney(Number(v)), 'Ending Balance']} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="Balance" name="Deterministic Net Worth" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#balanceGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {chartSelection === 'contrib_vs_growth' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={deterministicChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <defs>
                        <linearGradient id="gainGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="contribGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.15} />
                      <XAxis dataKey="ageStr" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${cur}${(v / 1000).toLocaleString()}k`} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: any) => formatMoney(Number(v))} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      <Area type="monotone" dataKey="Gains" name="Market Investment Growth" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#gainGrad)" />
                      <Area type="monotone" dataKey="Contributions" name="Personal Contributions Saved" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#contribGrad)" />
                    </AreaChart>
                  </ResponsiveContainer>
                )}

                {chartSelection === 'purchasing_power' && (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={deterministicChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.15} />
                      <XAxis dataKey="ageStr" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                      <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${cur}${(v / 1000).toLocaleString()}k`} />
                      <Tooltip contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: any) => formatMoney(Number(v))} />
                      <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                      <Line type="monotone" dataKey="Balance" name="Face Value (Raw Balance)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                      <Line type="monotone" dataKey="PurchasingPower" name="Purchasing Power (Real Inflation Discounted)" stroke="#ec4899" strokeWidth={2.5} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        )}

        {/* SUB-TAB C: STOCHASTIC MONTE CARLO & HISTOGRAM */}
        {activeSubTab === 'montecarlo' && (
          <div className="space-y-6">
            
            {/* STOCHASTIC VOLATILITY PLOT */}
            <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-3xl space-y-4">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Stochastic Monte Carlo Risk Bands</h3>
                  <span className="text-[9px] text-neutral-400 block">Surveys {inputs.monteCarloCount || 500} simulated market pathways factoring random sequence of returns</span>
                </div>
              </div>

              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={mcChartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.15} />
                    <XAxis dataKey="ageStr" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} />
                    <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} tickFormatter={(v) => `${cur}${(v / 1000).toLocaleString()}k`} />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: any) => formatMoney(Number(v))} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '10px' }} />
                    <Line type="monotone" dataKey="Best Case (90th Percentile)" stroke="#10b981" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                    <Line type="monotone" dataKey="Expected Case (50th Percentile)" stroke="#3b82f6" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="Worst Case (10th Percentile)" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="3 3" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* DISTRIBUTION HISTOGRAM */}
            <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-3xl space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Monte Carlo Distribution Histogram</h3>
                <span className="text-[9px] text-neutral-400 block">Percentage frequency of ending wealth outcomes at Age {inputs.lifeExpectancy}</span>
              </div>

              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={results.monteCarloHistogram} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#888888" strokeOpacity={0.1} />
                    <XAxis dataKey="rangeLabel" stroke="#888888" fontSize={8} tickLine={false} />
                    <YAxis stroke="#888888" fontSize={9} tickLine={false} axisLine={false} unit="%" />
                    <Tooltip contentStyle={{ backgroundColor: 'rgba(23, 23, 23, 0.95)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px', fontSize: '11px', color: '#fff' }} formatter={(v: any) => [`${v}%`, 'Percent of Simulations']} />
                    <Bar dataKey="percentage" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                      {results.monteCarloHistogram.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#ef4444' : index === results.monteCarloHistogram.length - 1 ? '#10b981' : '#3b82f6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

          </div>
        )}

        {/* SUB-TAB D: FIRE MODE CONTROLLER */}
        {activeSubTab === 'fire' && (
          <div className="space-y-6">
            
            <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500 fill-orange-500/20" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Financial Independence Retire Early (FIRE) Engine</h3>
                    <span className="text-[9px] text-neutral-400 block">Accelerate independence based on strict rule modeling</span>
                  </div>
                </div>
              </div>

              {/* FIRE Metric cards */}
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-orange-500/5 border border-orange-500/10 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-orange-500 tracking-wider">Years until FIRE</span>
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mt-1">
                    {results.fireResults.yearsUntilFIRE !== null ? `${results.fireResults.yearsUntilFIRE} Years` : 'N/A'}
                  </p>
                  <span className="text-[8px] text-neutral-400 block mt-1">
                    {results.fireResults.yearsUntilFIRE !== null ? `Estimated at Age ${inputs.currentAge + results.fireResults.yearsUntilFIRE}` : 'Target not met in simulation'}
                  </span>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-2xl">
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">FIRE Target (25x Spend)</span>
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mt-1">
                    {formatMoney(results.fireResults.fireTarget)}
                  </p>
                  <span className="text-[8px] text-neutral-400 block mt-1">Based on retirement spending</span>
                </div>

                <div className="p-4 bg-neutral-50 dark:bg-neutral-950 border border-neutral-150 dark:border-neutral-850 rounded-2xl col-span-2 lg:col-span-1">
                  <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Safe Withdrawal (SWR)</span>
                  <p className="text-2xl font-black text-neutral-800 dark:text-white mt-1">
                    {formatMoney(results.fireResults.safeWithdrawalEstimate)}
                  </p>
                  <span className="text-[8px] text-neutral-400 block mt-1">Annual drawing power</span>
                </div>
              </div>

              {/* Advanced FIRE tiers */}
              <div className="p-4 border border-neutral-150 dark:border-neutral-800 rounded-2xl bg-neutral-50 dark:bg-neutral-955 space-y-4">
                <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest block">Comparative FIRE Framework Tiers</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-150 dark:border-neutral-800">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-800 dark:text-white block">Lean FIRE Target</span>
                      <span className="text-[8px] text-neutral-400">Minimalist spending override (75% tier)</span>
                    </div>
                    <span className="text-xs font-black text-neutral-850 dark:text-white">
                      {formatMoney(results.fireResults.leanFireTarget)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-150 dark:border-neutral-800">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-800 dark:text-white block">Fat FIRE Target</span>
                      <span className="text-[8px] text-neutral-400">Abundant spending tier (125% tier)</span>
                    </div>
                    <span className="text-xs font-black text-neutral-850 dark:text-white">
                      {formatMoney(results.fireResults.fatFireTarget)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-900 rounded-xl border border-neutral-150 dark:border-neutral-800 md:col-span-2">
                    <div>
                      <span className="text-[10px] font-bold text-neutral-800 dark:text-white block">Coast FIRE Target</span>
                      <span className="text-[8px] text-neutral-400">Current savings needed such that zero further deposits are required to reach the target at retirement age</span>
                    </div>
                    <span className="text-xs font-black text-neutral-850 dark:text-white">
                      {formatMoney(results.fireResults.coastFireTarget)}
                    </span>
                  </div>

                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUB-TAB E: INTERACTIVE GOAL PLANNER */}
        {activeSubTab === 'goal' && (
          <div className="space-y-6">
            
            <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-3xl space-y-6">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-blue-500" />
                  <div>
                    <h3 className="text-xs font-black uppercase tracking-wider text-neutral-850 dark:text-white">Target-Driven Goal Planner</h3>
                    <span className="text-[9px] text-neutral-400 block">Instantly calculate parameters required to meet exact nest egg values</span>
                  </div>
                </div>
              </div>

              {/* Goal Planner Inputs */}
              <div className="p-4 bg-neutral-100/50 dark:bg-neutral-950 border border-neutral-200/55 dark:border-neutral-850 rounded-2xl space-y-4">
                <span className="text-[9px] font-black uppercase text-neutral-400 tracking-wider">Configure Financial Targets</span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[9px] font-black text-neutral-450 uppercase mb-1.5">Target Savings Goal</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                      <input
                        type="number"
                        value={inputs.goalPlanner?.targetSavings ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                          setInputs(prev => ({
                            ...prev,
                            goalPlanner: { ...prev.goalPlanner, targetSavings: val as any }
                          }));
                        }}
                        placeholder="e.g. 1500000"
                        className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-250 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-neutral-450 uppercase mb-1.5">Target Retirement Age</label>
                    <input
                      type="number"
                      value={inputs.goalPlanner?.targetAge ?? ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                        setInputs(prev => ({
                          ...prev,
                          goalPlanner: { ...prev.goalPlanner, targetAge: val as any }
                        }));
                      }}
                      placeholder="e.g. 60"
                      className="w-full text-xs font-bold px-3 py-2 border border-neutral-255 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] font-black text-neutral-450 uppercase mb-1.5">Desired Yearly Income</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-neutral-400 text-xs font-bold">{cur}</span>
                      <input
                        type="number"
                        value={inputs.goalPlanner?.targetIncome ?? ''}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Math.max(0, Number(e.target.value));
                          setInputs(prev => ({
                            ...prev,
                            goalPlanner: { ...prev.goalPlanner, targetIncome: val as any }
                          }));
                        }}
                        placeholder="e.g. 80000"
                        className="w-full text-xs font-bold pl-7 pr-3 py-2 border border-neutral-255 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-850 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Goal Planner outputs */}
              <div className="space-y-4">
                <span className="text-[10px] font-black uppercase text-neutral-400 tracking-widest block">Calculated Goal Planner Parameters</span>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase text-blue-500 tracking-wider">Required Monthly Contribution</span>
                      <p className="text-xl font-black text-neutral-800 dark:text-white mt-1">
                        {results.goalPlannerResults.requiredMonthlyContribution !== null && results.goalPlannerResults.requiredMonthlyContribution > 0
                          ? formatMoney(results.goalPlannerResults.requiredMonthlyContribution)
                          : 'Fully Covered!'}
                      </p>
                    </div>
                    <span className="text-[8px] text-neutral-400 mt-2 block">Monthly savings required to meet Target Savings from starting balance</span>
                  </div>

                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase text-indigo-500 tracking-wider">Required Investment Return</span>
                      <p className="text-xl font-black text-neutral-800 dark:text-white mt-1">
                        {results.goalPlannerResults.requiredAnnualReturn !== null
                          ? `${results.goalPlannerResults.requiredAnnualReturn.toFixed(2)}%`
                          : '0.00%'}
                      </p>
                    </div>
                    <span className="text-[8px] text-neutral-400 mt-2 block">Annual compounding yield needed to hit targets with current contribution limits</span>
                  </div>

                  <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase text-emerald-500 tracking-wider">Required Retirement Age</span>
                      <p className="text-xl font-black text-neutral-800 dark:text-white mt-1">
                        Age {results.goalPlannerResults.requiredRetirementAge ?? 'N/A'}
                      </p>
                    </div>
                    <span className="text-[8px] text-neutral-400 mt-2 block">Earliest age you will hit Target Savings with current constraints</span>
                  </div>

                  <div className="p-4 bg-rose-500/5 border border-rose-500/10 rounded-2xl flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-black uppercase text-rose-500 tracking-wider">Goal Savings Deficit</span>
                      <p className="text-xl font-black text-neutral-850 dark:text-white mt-1">
                        {formatMoney(results.goalPlannerResults.savingsGap)}
                      </p>
                    </div>
                    <span className="text-[8px] text-neutral-400 mt-2 block">Difference between Target Savings and projected Nest Egg</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
