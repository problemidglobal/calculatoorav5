import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, PiggyBank, HeartHandshake } from 'lucide-react';

interface EMILoanAffordabilityProps {
  monthlyEmi: number;
  otherFees: number;
  currency: string;
}

export default function EMILoanAffordability({ monthlyEmi, otherFees, currency }: EMILoanAffordabilityProps) {
  const [monthlyIncome, setMonthlyIncome] = useState<string>('');

  const incomeNum = Number(monthlyIncome) || 0;
  const totalMonthlyCost = monthlyEmi + otherFees;

  // Calculations
  const emiToIncomeRatio = incomeNum > 0 ? (totalMonthlyCost / incomeNum) * 100 : 0;
  const recommendedMaxEmi = incomeNum * 0.40; // 40% of income is standard maximum
  const remainingDisposable = Math.max(0, incomeNum - totalMonthlyCost);

  // Status Level
  let burdenStatus: 'low' | 'moderate' | 'high' | 'critical' = 'low';
  let burdenColor = 'text-emerald-500 bg-emerald-500/10 border-emerald-500/25';
  let burdenLabel = 'Low Burden (Safe)';
  let burdenDescription = 'Your debt obligations are well within healthy financial boundaries, leaving ample buffer for savings and life expenses.';

  if (emiToIncomeRatio >= 50) {
    burdenStatus = 'critical';
    burdenColor = 'text-rose-500 bg-rose-500/10 border-rose-500/25';
    burdenLabel = 'Critical Burden (Overleveraged)';
    burdenDescription = 'Warning: Over half of your monthly gross income is consumed by this loan. Financial advisors strongly discourage exceeding a 50% debt ratio as it poses high risk of default.';
  } else if (emiToIncomeRatio >= 40) {
    burdenStatus = 'high';
    burdenColor = 'text-orange-500 bg-orange-500/10 border-orange-500/25';
    burdenLabel = 'High Burden (Stretched)';
    burdenDescription = 'Your loan obligations are consuming a substantial portion of your budget. You may experience cash-flow strain and struggle to save.';
  } else if (emiToIncomeRatio >= 30) {
    burdenStatus = 'moderate';
    burdenColor = 'text-amber-500 bg-amber-500/10 border-amber-500/25';
    burdenLabel = 'Moderate Burden (Noticeable)';
    burdenDescription = 'Your EMI is within standard limits, but represents a noticeable monthly commitment. Track other fixed obligations carefully.';
  }

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <HeartHandshake className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
        <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
          Loan Affordability Index
        </h3>
      </div>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6">
        Enter your monthly take-home salary to analyze if this installment matches your financial goals safely.
      </p>

      {/* Income Input */}
      <div className="mb-6">
        <label className="block text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
          Your Monthly Net Income
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none font-mono text-sm font-bold text-neutral-400">
            {currency}
          </span>
          <input
            type="number"
            placeholder="e.g. 8000"
            value={monthlyIncome}
            onChange={(e) => setMonthlyIncome(e.target.value)}
            className="pl-9 pr-4 py-3 w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400 text-sm font-mono font-semibold"
          />
        </div>
      </div>

      {incomeNum > 0 ? (
        <div className="space-y-6">
          {/* Status Flag */}
          <div className={`p-4 rounded-2xl border ${burdenColor} flex gap-3 items-start`}>
            {burdenStatus === 'low' ? (
              <ShieldCheck className="w-5 h-5 shrink-0" />
            ) : (
              <AlertTriangle className="w-5 h-5 shrink-0" />
            )}
            <div>
              <span className="text-sm font-bold block mb-1">{burdenLabel}</span>
              <p className="text-xs font-medium opacity-85 leading-relaxed">{burdenDescription}</p>
            </div>
          </div>

          {/* Affordability Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-850">
              <span className="text-xs text-neutral-400 font-bold block mb-1">Debt-to-Income Ratio</span>
              <span className="text-2xl font-black text-neutral-800 dark:text-white font-mono">
                {emiToIncomeRatio.toFixed(1)}%
              </span>
              <div className="w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full mt-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    burdenStatus === 'low' ? 'bg-emerald-500' :
                    burdenStatus === 'moderate' ? 'bg-amber-500' :
                    burdenStatus === 'high' ? 'bg-orange-500' : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, emiToIncomeRatio)}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-850">
              <span className="text-xs text-neutral-400 font-bold block mb-1">Recommended Max EMI</span>
              <span className="text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono">
                {currency}{recommendedMaxEmi.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 font-bold">
                Based on 40% threshold
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-850">
              <span className="text-xs text-neutral-400 font-bold block mb-1">Leftover Cashflow</span>
              <span className="text-2xl font-black text-neutral-850 dark:text-white font-mono flex items-center gap-1.5">
                <PiggyBank className="w-5 h-5 text-neutral-500 shrink-0" />
                {currency}{remainingDisposable.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 font-bold">
                Disposable monthly income
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/60 border border-neutral-100 dark:border-neutral-850">
              <span className="text-xs text-neutral-400 font-bold block mb-1">Affordability Score</span>
              <span className={`text-2xl font-black font-mono ${
                burdenStatus === 'low' ? 'text-emerald-500' :
                burdenStatus === 'moderate' ? 'text-amber-500' :
                burdenStatus === 'high' ? 'text-orange-500' : 'text-rose-500'
              }`}>
                {burdenStatus === 'low' ? 'A+' :
                 burdenStatus === 'moderate' ? 'B' :
                 burdenStatus === 'high' ? 'C-' : 'D'}
              </span>
              <p className="text-[10px] text-neutral-400 mt-1 font-bold">
                Overall budget health
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-44 flex flex-col items-center justify-center border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl p-4 text-center">
          <HeartHandshake className="w-8 h-8 text-neutral-300 dark:text-neutral-700 mb-2" />
          <p className="text-xs font-semibold text-neutral-400 dark:text-neutral-500 max-w-xs">
            Awaiting income input. Enter your net income above to unlock cashflow insights and safety scores.
          </p>
        </div>
      )}
    </div>
  );
}
