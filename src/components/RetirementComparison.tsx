import React, { useMemo } from 'react';
import { 
  Scale, 
  Sparkles, 
  TrendingUp, 
  ShieldAlert, 
  PiggyBank, 
  Calendar,
  AlertTriangle,
  Flame,
  Frown,
  Activity
} from 'lucide-react';
import { computeRetirementProjection, RetirementInputs } from '../utils/retirementMath';

interface RetirementComparisonProps {
  currentInputs: RetirementInputs;
}

export default function RetirementComparison({ currentInputs }: RetirementComparisonProps) {
  
  // Compute scenarios side-by-side
  const scenarios = useMemo(() => {
    // 1. Current Baseline
    const baselineResults = computeRetirementProjection(currentInputs);

    // 2. Scenario B: Early Retirement (-3 Years)
    const earlyRetireInputs: RetirementInputs = {
      ...currentInputs,
      retirementAge: Math.max((currentInputs.currentAge || 30) + 1, (currentInputs.retirementAge || 65) - 3)
    };
    const earlyResults = computeRetirementProjection(earlyRetireInputs);

    // 3. Scenario C: Downside Market / Inflation Spike (Gains dropped by 1.5%, Inflation up by 1%)
    const downsideInputs: RetirementInputs = {
      ...currentInputs,
      preRetireReturn: Math.max(0, (currentInputs.preRetireReturn || 7.5) - 1.5),
      postRetireReturn: Math.max(0, (currentInputs.postRetireReturn || 5.0) - 1.5),
      inflationRate: (currentInputs.inflationRate || 2.5) + 1.0
    };
    const downsideResults = computeRetirementProjection(downsideInputs);

    // 4. Scenario D: Aggressive Savings (+$150/mo, +3% Step-up boost)
    const aggSavingsInputs: RetirementInputs = {
      ...currentInputs,
      monthlyContribution: (currentInputs.monthlyContribution || 0) + 150,
      contributionStepUp: (currentInputs.contributionStepUp || 0) + 3.0
    };
    const aggResults = computeRetirementProjection(aggSavingsInputs);

    return [
      {
        id: 'baseline',
        title: 'Current Plan',
        desc: 'Based strictly on your active control panel inputs',
        icon: <Activity className="w-4 h-4 text-blue-500" />,
        results: baselineResults,
        inputs: currentInputs,
        colorClass: 'border-blue-500/20 bg-blue-500/5',
        badgeColor: 'text-blue-500 bg-blue-500/10 border-blue-500/20'
      },
      {
        id: 'early',
        title: 'Early Retirement',
        desc: 'Retire 3 years earlier than current timeline target',
        icon: <Calendar className="w-4 h-4 text-amber-500" />,
        results: earlyResults,
        inputs: earlyRetireInputs,
        colorClass: 'border-amber-500/20 bg-amber-500/5',
        badgeColor: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
      },
      {
        id: 'downside',
        title: 'Downside Market / Inflation',
        desc: '-1.5% Return decline, +1.0% Inflation spike risk',
        icon: <Frown className="w-4 h-4 text-rose-500" />,
        results: downsideResults,
        inputs: downsideInputs,
        colorClass: 'border-rose-500/20 bg-rose-500/5',
        badgeColor: 'text-rose-500 bg-rose-500/10 border-rose-500/20'
      },
      {
        id: 'aggressive',
        title: 'Optimized / High Savings',
        desc: 'Boost monthly deposits by $150 and annual step-up by 3%',
        icon: <Flame className="w-4 h-4 text-emerald-500" />,
        results: aggResults,
        inputs: aggSavingsInputs,
        colorClass: 'border-emerald-500/20 bg-emerald-500/5',
        badgeColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
      }
    ];
  }, [currentInputs]);

  const cur = currentInputs.currency || '$';

  const formatMoney = (val: number) => {
    return cur + Math.round(val).toLocaleString();
  };

  return (
    <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-2xl space-y-6 text-left">
      
      {/* HEADER SECTION */}
      <div>
        <h3 className="text-sm font-black text-neutral-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-blue-500" />
          Retirement Scenario Comparison
        </h3>
        <p className="text-[10px] text-neutral-400 font-medium">Model different pathways to understand risk tolerance and find optimal strategies</p>
      </div>

      {/* MATRIX DECKS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {scenarios.map((sc) => {
          const survivalYears = sc.results.exhaustionAge === null 
            ? 'Full Lifetime' 
            : `${sc.results.exhaustionAge - sc.inputs.retirementAge} Years`;

          return (
            <div 
              key={sc.id}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${sc.colorClass}`}
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-neutral-950 shadow-sm border border-neutral-100 dark:border-neutral-850">
                      {sc.icon}
                    </div>
                    <h4 className="text-xs font-black text-neutral-850 dark:text-white">{sc.title}</h4>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-400 leading-normal">{sc.desc}</p>

                {/* Core differences list */}
                <div className="space-y-2 pt-2 border-t border-neutral-200/30">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 font-bold uppercase">Retirement Age:</span>
                    <span className="font-black text-neutral-850 dark:text-white">{sc.inputs.retirementAge}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 font-bold uppercase">Monthly Save:</span>
                    <span className="font-black text-neutral-850 dark:text-white">{formatMoney(sc.inputs.monthlyContribution)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 font-bold uppercase">Pre Return Rate:</span>
                    <span className="font-black text-neutral-850 dark:text-white">{sc.inputs.preRetireReturn}%</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="text-neutral-400 font-bold uppercase">Inflation Rate:</span>
                    <span className="font-black text-neutral-850 dark:text-white">{sc.inputs.inflationRate}%</span>
                  </div>
                </div>

                {/* Key results box */}
                <div className="bg-white/90 dark:bg-neutral-950/90 rounded-xl p-3 border border-neutral-100 dark:border-neutral-850 space-y-2 mt-4 text-left">
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Nest Egg:</span>
                    <p className="text-sm font-black text-blue-600 dark:text-cyan-400">{formatMoney(sc.results.projectedNestEgg)}</p>
                  </div>
                  
                  <div className="space-y-0.5 border-t border-neutral-100 dark:border-neutral-850 pt-1.5">
                    <span className="text-[9px] font-bold text-neutral-450 uppercase">Survival Time:</span>
                    <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-250">{survivalYears}</p>
                    {sc.results.exhaustionAge !== null && (
                      <span className="text-[9px] text-rose-500 inline-block">Exhausts at Age {sc.results.exhaustionAge}</span>
                    )}
                  </div>

                  <div className="space-y-0.5 border-t border-neutral-100 dark:border-neutral-850 pt-1.5">
                    <span className="text-[9px] font-bold text-neutral-450 uppercase">Monte Carlo Success:</span>
                    <p className="text-[11px] font-black text-neutral-800 dark:text-neutral-250">{sc.results.monteCarloSuccessRate}%</p>
                  </div>
                </div>
              </div>

              {/* Status bar */}
              <div className="mt-5 pt-3 border-t border-neutral-200/30 flex justify-center">
                <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${
                  sc.results.retirementReadinessScore >= 80 
                    ? 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10' 
                    : sc.results.retirementReadinessScore >= 50 
                      ? 'text-amber-500 bg-amber-500/5 border-amber-500/10' 
                      : 'text-rose-500 bg-rose-500/5 border-rose-500/10'
                }`}>
                  Ready: {sc.results.retirementReadinessScore}/100
                </span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
