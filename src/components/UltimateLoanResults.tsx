import React, { useState } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Activity, 
  DollarSign, 
  Calendar, 
  HelpCircle, 
  Clock, 
  ShieldAlert, 
  Check, 
  Award, 
  Download 
} from 'lucide-react';
import { LoanInputs, LoanResults, AmortizationRow } from '../utils/ultimateLoanMath';

interface UltimateLoanResultsProps {
  results: LoanResults;
  inputs: LoanInputs;
}

export default function UltimateLoanResults({
  results,
  inputs
}: UltimateLoanResultsProps) {
  const currency = inputs.currency || '$';
  const {
    schedule,
    monthlyPayment,
    totalPayment,
    totalInterest,
    totalFees,
    totalInsurance,
    totalTaxes,
    totalExtraPayments,
    interestSaved,
    timeSavedMonths,
    finalPayoffDate,
    apr,
    effectiveAnnualRate,
    trueLoanCost,
    realCostAfterInflation,
    healthScore,
    healthReasons
  } = results;

  // Active hover tooltip index for SVG interactive chart
  const [hoveredRow, setHoveredRow] = useState<AmortizationRow | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Filter or sample schedule points for charts to prevent SVG lag on large term lengths
  const sampleRate = Math.max(1, Math.ceil(schedule.length / 50));
  const chartData = schedule.filter((_, idx) => idx % sampleRate === 0 || idx === schedule.length - 1);

  // Circular gauge calculations
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (healthScore / 100) * circumference;

  const scoreColorClass = () => {
    if (healthScore >= 80) return 'stroke-emerald-500 text-emerald-500';
    if (healthScore >= 60) return 'stroke-amber-500 text-amber-500';
    return 'stroke-rose-500 text-rose-500';
  };

  const scoreBgColorClass = () => {
    if (healthScore >= 80) return 'bg-emerald-50 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border-emerald-500/10';
    if (healthScore >= 60) return 'bg-amber-50 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400 border-amber-500/10';
    return 'bg-rose-50 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400 border-rose-500/10';
  };

  // Automated Smart Insights Engine
  const generateInsights = () => {
    const list: string[] = [];
    
    // 1. Extra payment insights
    if (totalExtraPayments === 0) {
      const prospectiveSavings = computeHypotheticalSavings(inputs, 150);
      list.push(`Prepayment Accelerator: Adding just ${currency}150/month to your principal payments would save you approximately ${currency}${prospectiveSavings.toLocaleString('en-US', { maximumFractionDigits: 0 })} in interest and shorten your term by several months.`);
    }

    // 2. Interest-to-principal check
    const principalAmount = Math.max(0, inputs.amount - inputs.downPayment);
    if (totalInterest > principalAmount) {
      list.push(`Amortization Alert: Financing charges are greater than your original borrowing amount (${currency}${principalAmount.toLocaleString()}). Prioritize prepayments early in the cycle to cut the compounding spiral.`);
    }

    // 3. Compounding rule check
    if (inputs.compoundingFrequency === 'daily') {
      list.push('Daily compounding frequency increases the compound interest buildup compared to monthly compounding. Ensure your lender calculates interest based on simple daily balance or prepay regularly.');
    }

    // 4. LTV threshold
    if (results.ltv > 80 && (inputs.mortgageInsurance > 0)) {
      list.push(`Equity Threshold: Your Loan-to-Value ratio is ${results.ltv.toFixed(1)}%. Once your principal balance drops below 80% LTV (${currency}${(inputs.amount * 0.8).toLocaleString()}), you can usually request to drop Private Mortgage Insurance (PMI) to save money.`);
    }

    // 5. Grace period impact
    if (inputs.gracePeriod > 0 && inputs.graceType === 'deferred') {
      list.push('Grace Deferral Risk: Your deferred grace period is causing capitalized interest, increasing your outstanding debt principal. Try paying at least the accrued interest during the grace period.');
    }

    // 6. Inflation check
    if (inputs.inflationRate > 0) {
      const buyingPowerSaved = trueLoanCost - realCostAfterInflation;
      list.push(`Inflation Hedge: Due to inflation (${inputs.inflationRate}% APR), your future payments have less buying power. The real cost of your loan is ${currency}${realCostAfterInflation.toLocaleString('en-US', { maximumFractionDigits: 0 })}, which is ${currency}${buyingPowerSaved.toLocaleString('en-US', { maximumFractionDigits: 0 })} cheaper in today\'s buying power!`);
    }

    return list;
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. PRIMARY NUMBERS - EXECUTIVE DASHBOARD */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 dark:from-cyan-500/10 dark:to-cyan-500/5 border border-blue-500/15 p-5 rounded-3xl space-y-1 text-left relative overflow-hidden">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-cyan-400 max-w-max">
            <DollarSign className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Est. Monthly Payment</p>
          <h4 className="text-xl sm:text-2xl font-black text-blue-600 dark:text-cyan-400 font-mono">
            {currency}{monthlyPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}
          </h4>
          <p className="text-[9px] text-neutral-400">Prorated for payment frequency</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-1 text-left">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 max-w-max">
            <TrendingUp className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Total Interest Paid</p>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-850 dark:text-neutral-100 font-mono">
            {currency}{totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </h4>
          <p className="text-[9px] text-neutral-400">Compounded financing fee</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-1 text-left">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 max-w-max">
            <Clock className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Payoff Date</p>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-850 dark:text-neutral-100 font-mono">
            {finalPayoffDate}
          </h4>
          <p className="text-[9px] text-neutral-400">{schedule.length} total payments</p>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-3xl space-y-1 text-left">
          <div className="p-1.5 rounded-lg bg-violet-500/10 text-violet-600 dark:text-violet-400 max-w-max">
            <Award className="w-4 h-4" />
          </div>
          <p className="text-[10px] font-black uppercase text-neutral-400 tracking-wider">Calculated APR / EAR</p>
          <h4 className="text-xl sm:text-2xl font-black text-neutral-850 dark:text-neutral-100 font-mono">
            {apr.toFixed(2)}% / {effectiveAnnualRate.toFixed(2)}%
          </h4>
          <p className="text-[9px] text-neutral-400">Annual cost including fees</p>
        </div>

      </div>

      {/* 2. SECONDARY STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-3xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-150 dark:border-neutral-800/80">
        <div className="text-left space-y-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Principal Loan</span>
          <p className="text-sm font-black font-mono text-neutral-750 dark:text-neutral-300">
            {currency}{(Math.max(0, inputs.amount - inputs.downPayment)).toLocaleString()}
          </p>
        </div>
        <div className="text-left space-y-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Total Prepayments</span>
          <p className="text-sm font-black font-mono text-emerald-500">
            {currency}{totalExtraPayments.toLocaleString()}
          </p>
        </div>
        <div className="text-left space-y-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Interest Saved</span>
          <p className="text-sm font-black font-mono text-emerald-500">
            {currency}{interestSaved.toLocaleString()}
          </p>
        </div>
        <div className="text-left space-y-0.5">
          <span className="text-[9px] font-black uppercase tracking-wider text-neutral-400">Time Saved</span>
          <p className="text-sm font-black font-mono text-emerald-500">
            {timeSavedMonths > 0 ? `${timeSavedMonths.toFixed(1)} Months` : '0 Months'}
          </p>
        </div>
      </div>

      {/* 3. HEALTH SCORE & SMART INSIGHTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Health score circle */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle 
                cx="64" cy="64" r={radius} 
                className="stroke-neutral-100 dark:stroke-neutral-800" 
                strokeWidth="10" fill="transparent"
              />
              <circle 
                cx="64" cy="64" r={radius} 
                className={`transition-all duration-1000 ease-out ${scoreColorClass()}`}
                strokeWidth="10" fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-neutral-850 dark:text-neutral-100 font-mono">{healthScore}</span>
              <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest">Health</span>
            </div>
          </div>

          <div className="space-y-1">
            <h4 className="text-sm font-black text-neutral-800 dark:text-neutral-100">Loan Quality Audit</h4>
            <p className="text-[10px] text-neutral-400 leading-relaxed px-2">An objective analysis of your debt-service optimization rules.</p>
          </div>
        </div>

        {/* Audit Details and Insights */}
        <div className="md:col-span-2 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl text-left flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-1.5 text-xs font-black text-neutral-850 dark:text-white uppercase tracking-wider">
              <Activity className="w-4 h-4 text-blue-500" /> Loan Integrity Report
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {healthReasons.map((reason, idx) => (
                <div key={idx} className={`p-2.5 rounded-2xl border text-xs flex items-start gap-2 ${scoreBgColorClass()}`}>
                  <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-850 text-[10px] text-neutral-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-500 shrink-0 animate-pulse" />
            <span>Deterministic financial rules calculated directly in-browser.</span>
          </div>
        </div>

      </div>

      {/* 4. REVOLUTIONARY DYNAMIC INTERACTIVE VISUALIZATIONS */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-3xl space-y-6">
        
        <div className="flex flex-wrap items-center justify-between gap-3 text-left">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800 dark:text-neutral-150">Amortization &amp; Paydown Curve</h3>
            <p className="text-[10px] text-neutral-400">Interactive timeline modeling remaining balance decay over time</p>
          </div>
          <div className="text-[10px] font-bold text-neutral-500 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-850 px-2.5 py-1 rounded-full uppercase">
            Total out-of-pocket: {currency}{trueLoanCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </div>
        </div>

        {/* Beautiful Interactive Custom SVG Chart */}
        <div className="relative w-full h-64 sm:h-72">
          {chartData.length > 0 ? (
            <svg className="w-full h-full" viewBox="0 0 500 240" preserveAspectRatio="none">
              <defs>
                <linearGradient id="balance-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.00" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" className="stroke-neutral-100 dark:stroke-neutral-800/50" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="70" x2="480" y2="70" className="stroke-neutral-100 dark:stroke-neutral-800/50" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="120" x2="480" y2="120" className="stroke-neutral-100 dark:stroke-neutral-800/50" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="170" x2="480" y2="170" className="stroke-neutral-100 dark:stroke-neutral-800/50" strokeWidth="1" strokeDasharray="4 4" />
              <line x1="40" y1="210" x2="480" y2="210" className="stroke-neutral-200 dark:stroke-neutral-800" strokeWidth="1" />

              {/* Generate Amortization Area Curve */}
              <path 
                d={`M 40,210 ${chartData.map((d, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 440;
                  const maxVal = Math.max(1000, inputs.amount);
                  const y = 210 - (d.remainingBalance / maxVal) * 190;
                  return `L ${x},${y}`;
                }).join(' ')} L 480,210 Z`}
                fill="url(#balance-area)"
              />

              {/* Generate Line Curve */}
              <path 
                d={chartData.map((d, i) => {
                  const x = 40 + (i / (chartData.length - 1)) * 440;
                  const maxVal = Math.max(1000, inputs.amount);
                  const y = 210 - (d.remainingBalance / maxVal) * 190;
                  return `${i === 0 ? 'M' : 'L'} ${x},${y}`;
                }).join(' ')}
                fill="none"
                className="stroke-blue-500 dark:stroke-cyan-400"
                strokeWidth="2.5"
              />

              {/* Chart Interaction Overlay Lines / Dots */}
              {hoveredIndex !== null && (
                <>
                  {/* Vertical Guidance Line */}
                  <line 
                    x1={40 + (hoveredIndex / (chartData.length - 1)) * 440} 
                    y1="20" 
                    x2={40 + (hoveredIndex / (chartData.length - 1)) * 440} 
                    y2="210" 
                    className="stroke-blue-500/40 dark:stroke-cyan-400/40" 
                    strokeWidth="1.5" 
                    strokeDasharray="2 2"
                  />
                  {/* Hotspot node */}
                  <circle 
                    cx={40 + (hoveredIndex / (chartData.length - 1)) * 440} 
                    cy={210 - (chartData[hoveredIndex].remainingBalance / Math.max(1000, inputs.amount)) * 190} 
                    r="5" 
                    className="fill-blue-600 stroke-white dark:fill-cyan-400 dark:stroke-neutral-900" 
                    strokeWidth="1.5"
                  />
                </>
              )}

              {/* Slicing hover anchors for mouse collision */}
              {chartData.map((_, i) => {
                const x = 40 + (i / (chartData.length - 1)) * 440;
                return (
                  <rect 
                    key={i}
                    x={x - 220 / (chartData.length - 1)}
                    y="10"
                    width={440 / (chartData.length - 1)}
                    height="200"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => {
                      setHoveredIndex(i);
                      setHoveredRow(chartData[i]);
                    }}
                    onMouseLeave={() => {
                      setHoveredIndex(null);
                      setHoveredRow(null);
                    }}
                  />
                );
              })}

            </svg>
          ) : null}

          {/* Interactive Floating Tooltip */}
          {hoveredRow && (
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 p-3 rounded-2xl bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 text-[10px] space-y-1 shadow-md text-left z-20 pointer-events-none backdrop-blur-sm">
              <p className="font-bold text-neutral-800 dark:text-white">Date: {hoveredRow.date} (Payment #{hoveredRow.paymentNumber})</p>
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-neutral-400">Balance:</span>
                  <span className="font-black ml-1 text-blue-600 dark:text-cyan-400">{currency}{hoveredRow.remainingBalance.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-neutral-400">Paid:</span>
                  <span className="font-black ml-1 text-neutral-600 dark:text-neutral-300">{currency}{hoveredRow.payment.toLocaleString('en-US', { maximumFractionDigits: 0 })}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex justify-center items-center gap-6 text-[10px] text-neutral-500">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-blue-500 dark:bg-cyan-400 inline-block"></span>
            <span>Outstanding Balance</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-1.5 rounded-full bg-blue-500/20 inline-block"></span>
            <span>Capital Equity Curve</span>
          </div>
        </div>

      </div>

      {/* 5. SMART INSIGHTS CARD */}
      <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-150 dark:border-neutral-800 p-6 rounded-3xl space-y-4 text-left">
        <h3 className="text-xs font-black uppercase tracking-wider text-neutral-800 dark:text-white flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" /> Advanced Smart Insights
        </h3>
        <div className="space-y-3">
          {generateInsights().map((insight, idx) => (
            <p key={idx} className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed pl-3 border-l-2 border-blue-500">
              {insight}
            </p>
          ))}
        </div>
      </div>

    </div>
  );
}

// Sub-calculation engine to simulate prepayments dynamically for comparison cards
function computeHypotheticalSavings(inputs: LoanInputs, prospectiveMonthly: number): number {
  const amount = Number(inputs.amount) || 0;
  const downPayment = Number(inputs.downPayment) || 0;
  const termYears = Number(inputs.termYears) || 0;
  const termMonths = Number(inputs.termMonths) || 0;
  const interestRate = Number(inputs.interestRate) || 0;

  const principal = Math.max(0, amount - downPayment);
  const totalPeriodsScheduled = (termYears * 12) + termMonths;

  if (principal <= 0 || totalPeriodsScheduled <= 0 || interestRate <= 0) return 0;

  let balanceWithExtras = principal;
  let balanceWithoutExtras = principal;

  let interestWith = 0;
  let interestWithout = 0;

  const r = (interestRate / 100) / 12;

  let num = 1;
  while (balanceWithoutExtras > 0.01 && num <= 1200) {
    const iDue = balanceWithoutExtras * r;
    const pmt = (principal * r * Math.pow(1 + r, totalPeriodsScheduled)) / (Math.pow(1 + r, totalPeriodsScheduled) - 1);
    if (isNaN(pmt) || pmt <= 0) break;
    balanceWithoutExtras = balanceWithoutExtras + iDue - pmt;
    if (balanceWithoutExtras < 0) balanceWithoutExtras = 0;
    interestWithout += iDue;
    num++;
  }

  num = 1;
  while (balanceWithExtras > 0.01 && num <= 1200) {
    const iDue = balanceWithExtras * r;
    const pmt = (principal * r * Math.pow(1 + r, totalPeriodsScheduled)) / (Math.pow(1 + r, totalPeriodsScheduled) - 1);
    if (isNaN(pmt) || pmt <= 0) break;
    const finalPmt = Math.min(balanceWithExtras + iDue, pmt + prospectiveMonthly);
    balanceWithExtras = balanceWithExtras + iDue - finalPmt;
    if (balanceWithExtras < 0) balanceWithExtras = 0;
    interestWith += iDue;
    num++;
  }

  return Math.max(0, interestWithout - interestWith);
}
