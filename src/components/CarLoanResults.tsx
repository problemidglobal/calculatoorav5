import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  DollarSign, 
  Calendar, 
  HelpCircle, 
  Activity, 
  ShieldCheck, 
  Award, 
  Download, 
  ArrowRight,
  Gauge,
  FileText,
  AlertTriangle,
  Lightbulb
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
import { CarLoanResults as CarLoanResultsData, CarLoanInputs } from '../utils/carLoanMath';

interface CarLoanResultsProps {
  results: CarLoanResultsData | null;
  inputs: CarLoanInputs;
}

export default function CarLoanResults({
  results,
  inputs
}: CarLoanResultsProps) {
  const [activeChartTab, setActiveChartTab] = useState<'balance' | 'costs' | 'tco'>('balance');

  // If no valid results yet, show initial friendly state
  if (!results) {
    return (
      <div className="p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800 text-center space-y-4">
        <div className="w-16 h-16 bg-blue-500/5 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto border border-blue-500/10">
          <Activity className="w-8 h-8 animate-pulse" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h4 className="font-extrabold text-neutral-800 dark:text-neutral-200 text-lg">Awaiting Your Input</h4>
          <p className="text-sm text-neutral-400 dark:text-neutral-500">
            Enter the required **Vehicle Purchase Price**, **Interest Rate**, and **Loan Term** on the left to activate the real-time financial simulation.
          </p>
        </div>
      </div>
    );
  }

  const {
    loanAmount,
    financedAmount,
    monthlyPayment,
    biweeklyPayment,
    weeklyPayment,
    totalInterest,
    totalPayment,
    aprEstimate,
    principalPaid,
    downPaymentPaid,
    netTradeInCredit,
    tradeInLoanBalancePaid,
    totalTaxesPaid,
    totalFeesPaid,
    totalAddonsPaid,
    totalVehicleCost,
    totalCashNeededUpfront,
    interestSaved,
    timeSavedMonths,
    payoffDate,
    loanProgressPercent,
    maxRecommendedLoan,
    maxRecommendedMonthlyBudget,
    dtiRatioPercent,
    affordabilityStatus,
    affordabilityScore,
    schedule,
    fiveYearOwnershipCost,
    ownershipBreakdown,
  } = results;

  // 1. Chart Data Formatting
  // Let's sample down the schedule for the balance area chart (e.g. up to 60 points) to avoid lagging
  const balanceChartData = useMemo(() => {
    if (schedule.length === 0) return [];
    
    const skipCount = Math.max(1, Math.ceil(schedule.length / 60));
    const data = [];
    
    // Add start point
    data.push({
      month: 0,
      Balance: Math.round(financedAmount),
      Interest: 0,
      PrincipalPaid: 0
    });

    let accumulatedInterest = 0;
    let accumulatedPrincipal = 0;

    for (let i = 0; i < schedule.length; i++) {
      accumulatedInterest += schedule[i].interest;
      accumulatedPrincipal += schedule[i].principal + schedule[i].extraPayment;

      if ((i + 1) % skipCount === 0 || (i + 1) === schedule.length) {
        data.push({
          month: schedule[i].paymentNumber,
          Balance: Math.round(schedule[i].endingBalance),
          Interest: Math.round(accumulatedInterest),
          PrincipalPaid: Math.round(accumulatedPrincipal)
        });
      }
    }
    return data;
  }, [schedule, financedAmount]);

  // Cost breakdown chart data
  const costBreakdownData = useMemo(() => {
    return [
      { name: 'Vehicle Price', Amount: Number(inputs.carPrice) || 0, color: '#2563eb' },
      { name: 'Sales Tax', Amount: Math.round(totalTaxesPaid), color: '#3b82f6' },
      { name: 'Fees & Addons', Amount: Math.round(totalFeesPaid + totalAddonsPaid), color: '#60a5fa' },
      { name: 'Rebates/Trade Credit', Amount: Math.round((Number(inputs.dealerRebate) || 0) + (Number(inputs.manufacturerIncentive) || 0) + (Number(inputs.cashDiscount) || 0) + netTradeInCredit), color: '#10b981' },
      { name: 'Down Payment', Amount: Math.round(downPaymentPaid), color: '#8b5cf6' }
    ];
  }, [inputs, totalTaxesPaid, totalFeesPaid, totalAddonsPaid, netTradeInCredit, downPaymentPaid]);

  // Rule-based Smart Advisor Insights
  const advisorInsights = useMemo(() => {
    const list: { type: 'success' | 'warning' | 'info'; title: string; text: string }[] = [];
    
    const carPriceNum = Number(inputs.carPrice) || 0;
    const baseRate = Number(inputs.interestRate) || 0;
    const termVal = inputs.termUnit === 'years' ? (Number(inputs.loanTerm) || 0) * 12 : (Number(inputs.loanTerm) || 0);

    // Insight 1: Down payment leverage
    if (carPriceNum > 0 && baseRate > 0 && termVal > 0) {
      const addedDownPayment = 2000;
      const r = (baseRate / 100) / 12;
      const monthlySaving = (addedDownPayment * r * Math.pow(1 + r, termVal)) / (Math.pow(1 + r, termVal) - 1);
      const totalSaving = (monthlySaving * termVal) - addedDownPayment;

      list.push({
        type: 'success',
        title: 'Down Payment Leverage',
        text: `Increasing your down payment by just $${addedDownPayment.toLocaleString()} reduces your monthly payment by approx. $${Math.round(monthlySaving)}/month and saves $${Math.max(0, Math.round(totalSaving)).toLocaleString()} in finance interest.`
      });
    }

    // Insight 2: Prepayment impact
    if (interestSaved > 0 && timeSavedMonths > 0) {
      list.push({
        type: 'success',
        title: 'Accelerated Payoff Active',
        text: `Your current extra payments schedule pays off the vehicle ${timeSavedMonths} months early, saving you $${Math.round(interestSaved).toLocaleString()} in overall interest charges.`
      });
    } else if (baseRate > 4) {
      // simulate extra $100/mo payoff
      const simExtra = 100;
      list.push({
        type: 'info',
        title: 'Extra Payment Impact',
        text: `Adding an extra $${simExtra}/month from the start of your loan shortens your amortization term and saves hundreds of dollars in cumulative compounding interest.`
      });
    }

    // Insight 3: Taxes & Fees ratio
    const feesPct = carPriceNum > 0 ? ((totalFeesPaid + totalTaxesPaid) / carPriceNum) * 100 : 0;
    if (feesPct > 10) {
      list.push({
        type: 'warning',
        title: 'High Upfront Costs',
        text: `Government taxes and dealer fees account for ${feesPct.toFixed(1)}% of your vehicle purchase price. If financed, you'll pay interest on these fees over the full term.`
      });
    }

    // Insight 4: DTI Warnings
    if (inputs.annualIncome) {
      if (affordabilityStatus === 'Over-leveraged') {
        list.push({
          type: 'warning',
          title: 'High Debt Ratio Warning',
          text: `Your monthly payment represents a high percentage of your income. Consider a larger down payment, cheaper vehicle, or longer term to preserve financial headroom.`
        });
      } else if (affordabilityStatus === 'Conservative' || affordabilityStatus === 'Moderate') {
        list.push({
          type: 'success',
          title: 'Comfortable Budget Profile',
          text: `Your proposed car installment aligns perfectly with recommended financial guidelines, leaving generous margins for other household allocations.`
        });
      }
    }

    return list;
  }, [inputs, interestSaved, timeSavedMonths, totalFeesPaid, totalTaxesPaid, affordabilityStatus]);

  // Export CSV Helper
  const handleExportCSV = () => {
    if (schedule.length === 0) return;
    const headers = ['Payment #', 'Date', 'Beginning Balance', 'Regular Payment', 'Principal Paid', 'Interest Paid', 'Extra Payment', 'Ending Balance', 'APR %'];
    const rows = schedule.map(r => [
      r.paymentNumber,
      r.date,
      r.beginningBalance.toFixed(2),
      r.regularPayment.toFixed(2),
      r.principal.toFixed(2),
      r.interest.toFixed(2),
      r.extraPayment.toFixed(2),
      r.endingBalance.toFixed(2),
      r.rateApplied.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "car_loan_amortization_schedule.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. Core Installment & Highlight Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Prime Installment Display */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-radial bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-lg space-y-4 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <TrendingUp className="w-64 h-64" />
          </div>

          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-xs font-black text-blue-100 uppercase tracking-widest block">Estimated Car Installment</span>
              <h2 id="installment-display" className="text-4xl md:text-5xl font-black flex items-baseline tracking-tight">
                ${Math.round(monthlyPayment).toLocaleString()}
                <span className="text-base font-medium text-blue-200">/mo</span>
              </h2>
            </div>
            <div className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-xs text-xs font-bold text-blue-100 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              Premium Engine
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
            <div>
              <span className="text-[10px] text-blue-200 block font-bold uppercase tracking-widest">Bi-Weekly</span>
              <span className="text-sm font-extrabold">${Math.round(biweeklyPayment)}</span>
            </div>
            <div className="border-x border-white/10">
              <span className="text-[10px] text-blue-200 block font-bold uppercase tracking-widest">Weekly</span>
              <span className="text-sm font-extrabold">${Math.round(weeklyPayment)}</span>
            </div>
            <div>
              <span className="text-[10px] text-blue-200 block font-bold uppercase tracking-widest">Total Payoffs</span>
              <span className="text-sm font-extrabold">{schedule.length} months</span>
            </div>
          </div>
        </div>

        {/* Upfront Cash requirement */}
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xs flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">Upfront Cash Needed</span>
            <h3 className="text-3xl font-black text-neutral-800 dark:text-neutral-100">
              ${Math.round(totalCashNeededUpfront).toLocaleString()}
            </h3>
            <span className="text-[10px] text-neutral-400 block font-medium">Down payment + upfront paid taxes/fees.</span>
          </div>

          <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between text-xs font-bold text-neutral-500 dark:text-neutral-400">
            <span>Payoff Target Date:</span>
            <span className="text-neutral-800 dark:text-white">{payoffDate}</span>
          </div>
        </div>
      </div>

      {/* 2. Key Amortization Highlights Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-widest">Financed Amount</span>
          <span className="text-lg font-black text-neutral-800 dark:text-white">
            ${Math.round(financedAmount).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-widest">Estimated APR</span>
          <span className="text-lg font-black text-neutral-800 dark:text-white">
            {aprEstimate.toFixed(2)}%
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-widest">Total Interest Paid</span>
          <span className="text-lg font-black text-neutral-800 dark:text-white">
            ${Math.round(totalInterest).toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800">
          <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-widest">Total Out-of-Pocket Cost</span>
          <span className="text-lg font-black text-neutral-800 dark:text-white">
            ${Math.round(totalVehicleCost).toLocaleString()}
          </span>
        </div>
      </div>

      {/* 3. Extra Prepayment Savings Showcase */}
      {interestSaved > 0 && (
        <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between text-emerald-800 dark:text-emerald-400 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm block">Prepayment Acceleration Active!</span>
              <p className="text-xs text-emerald-600/80 dark:text-emerald-400/80">You will pay off your car **{timeSavedMonths} months early**, skipping interest charges.</p>
            </div>
          </div>
          <div className="text-right">
            <span className="text-xs text-neutral-400 block font-bold uppercase tracking-widest">Total Saved</span>
            <span className="text-xl font-black">${Math.round(interestSaved).toLocaleString()}</span>
          </div>
        </div>
      )}

      {/* 4. Affordability Profiler Scorecard */}
      {inputs.annualIncome && (
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <Gauge className="w-5 h-5 text-blue-500" />
            <h4 className="font-black text-neutral-900 dark:text-white text-sm">Affordability Profiler Summary</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* DTI Gauge */}
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-neutral-400 block">Debt-to-Income Classification</span>
              <div className="flex items-baseline justify-center md:justify-start gap-1.5">
                <span className={`text-2xl font-black ${
                  affordabilityStatus === 'Conservative' ? 'text-emerald-600 dark:text-emerald-400' :
                  affordabilityStatus === 'Moderate' ? 'text-blue-600 dark:text-blue-400' :
                  affordabilityStatus === 'Aggressive' ? 'text-amber-600 dark:text-amber-400' :
                  'text-rose-600 dark:text-rose-400'
                }`}>
                  {affordabilityStatus}
                </span>
                <span className="text-xs text-neutral-400">({dtiRatioPercent.toFixed(1)}% DTI)</span>
              </div>
              <div className="w-full h-2.5 bg-neutral-100 dark:bg-neutral-850 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    affordabilityStatus === 'Conservative' ? 'bg-emerald-500' :
                    affordabilityStatus === 'Moderate' ? 'bg-blue-500' :
                    affordabilityStatus === 'Aggressive' ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.max(5, dtiRatioPercent))}%` }}
                />
              </div>
            </div>

            {/* Monthly Budget Comparisons */}
            <div className="space-y-1.5 border-y md:border-y-0 md:border-x border-neutral-100 dark:border-neutral-800 py-4 md:py-0 md:px-6">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-widest">Recommended Max Car Payment</span>
              <span className="text-base font-black text-neutral-800 dark:text-white">
                ${Math.round(maxRecommendedMonthlyBudget).toLocaleString()}/mo
              </span>
              <span className="text-[10px] text-neutral-400 block">Based on conservative 10% income allocation rules.</span>
            </div>

            {/* Recommended Loan Size */}
            <div className="space-y-1.5 md:pl-6">
              <span className="text-[10px] text-neutral-400 font-bold uppercase block tracking-widest">Recommended Max Loan Size</span>
              <span className="text-base font-black text-neutral-800 dark:text-white">
                ${Math.round(maxRecommendedLoan).toLocaleString()}
              </span>
              <span className="text-[10px] text-neutral-400 block">Scaled dynamically to current loan terms and rates.</span>
            </div>
          </div>
        </div>
      )}

      {/* 5. Smart Rule-Based Advisory Insights */}
      <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-150 dark:border-neutral-800 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <h4 className="font-black text-neutral-900 dark:text-white text-sm">Financing Advisory & Smart Insights</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {advisorInsights.map((ins, i) => (
            <div key={i} className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800/50 space-y-1">
              <span className={`text-[10px] font-black uppercase tracking-widest ${
                ins.type === 'success' ? 'text-emerald-500' :
                ins.type === 'warning' ? 'text-rose-500' :
                'text-blue-500'
              }`}>
                {ins.title}
              </span>
              <p className="text-xs font-medium text-neutral-600 dark:text-neutral-400 leading-relaxed">{ins.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Chart Navigation Toggles */}
      <div className="space-y-4">
        <div className="flex flex-wrap justify-between items-center gap-2">
          <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-2xl">
            <button
              id="tab-chart-balance"
              type="button"
              onClick={() => setActiveChartTab('balance')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition ${
                activeChartTab === 'balance' 
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Loan Balance Amortization
            </button>
            <button
              id="tab-chart-costs"
              type="button"
              onClick={() => setActiveChartTab('costs')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition ${
                activeChartTab === 'costs' 
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              Purchase Cost Structure
            </button>
            <button
              id="tab-chart-tco"
              type="button"
              onClick={() => setActiveChartTab('tco')}
              className={`px-4 py-2 text-xs font-black rounded-xl transition ${
                activeChartTab === 'tco' 
                  ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-blue-400 shadow-xs' 
                  : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
              }`}
            >
              5-Year Ownership Projection
            </button>
          </div>

          <button
            id="btn-export-csv"
            onClick={handleExportCSV}
            className="px-3 py-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Export Schedule (CSV)
          </button>
        </div>

        {/* Dynamic Chart Showcase */}
        <div className="h-80 w-full bg-white dark:bg-neutral-900/60 p-5 border border-neutral-150 dark:border-neutral-800/80 rounded-3xl relative">
          {activeChartTab === 'balance' && (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={balanceChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" className="hidden dark:block" />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'Month Number', position: 'insideBottom', offset: -5, fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip 
                  formatter={(value: any) => [`$${Number(value).toLocaleString()}`]} 
                  contentStyle={{ backgroundColor: '#111', color: '#fff', borderRadius: '12px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="Balance" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
                <Area type="monotone" dataKey="Interest" stroke="#ef4444" strokeWidth={1.5} fillOpacity={0} />
                <Area type="monotone" dataKey="PrincipalPaid" stroke="#10b981" strokeWidth={1.5} fillOpacity={0} name="Principal Paid" />
              </AreaChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'costs' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBreakdownData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" className="hidden dark:block" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#888' }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`]} contentStyle={{ backgroundColor: '#111', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="Amount" radius={[10, 10, 0, 0]}>
                  {costBreakdownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {activeChartTab === 'tco' && (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ownershipBreakdown} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" className="dark:hidden" />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222" className="hidden dark:block" />
                <XAxis dataKey="year" tick={{ fontSize: 10, fill: '#888' }} label={{ value: 'Ownership Year', position: 'insideBottom', offset: -5, fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                <Tooltip formatter={(value) => [`$${Number(value).toLocaleString()}`]} contentStyle={{ backgroundColor: '#111', color: '#fff', borderRadius: '12px', fontSize: '12px' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="depreciation" stackId="a" fill="#3b82f6" name="Depreciation" />
                <Bar dataKey="fuelOrCharging" stackId="a" fill="#10b981" name="Fuel / Electricity" />
                <Bar dataKey="insurance" stackId="a" fill="#fbbf24" name="Insurance Premium" />
                <Bar dataKey="maintenance" stackId="a" fill="#ef4444" name="Maintenance" />
                <Bar dataKey="loanPayments" stackId="a" fill="#8b5cf6" name="Loan Payments" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <p className="text-[10px] text-neutral-400 dark:text-neutral-500 text-center">
          *5-Year Ownership Projection incorporates dynamic vehicle category depreciation trends, average fueling/charging variables, and scheduled loan payments.
        </p>
      </div>
    </div>
  );
}
