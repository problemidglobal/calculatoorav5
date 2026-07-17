import React, { useMemo } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  Percent, 
  ShieldCheck, 
  Briefcase, 
  ArrowRight, 
  Info, 
  FileText,
  Calendar,
  Layers,
  Award,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  LineChart, 
  Line 
} from 'recharts';
import { PaycheckResults, PaycheckInputs, getPayFrequencyMultiplier } from '../utils/paycheckMath';

interface PaycheckResultsPanelProps {
  results: PaycheckResults | null;
  inputs: PaycheckInputs;
}

export default function PaycheckResultsPanel({
  results,
  inputs
}: PaycheckResultsPanelProps) {

  // If results is null, show instructions
  if (!results || results.totalEarnings === 0) {
    return (
      <div className="bg-white dark:bg-neutral-900 border border-neutral-150 dark:border-neutral-800 rounded-3xl p-8 text-center space-y-4 shadow-sm animate-fadeIn">
        <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500">
          <DollarSign className="w-8 h-8 animate-pulse" />
        </div>
        <h3 className="text-lg font-black text-neutral-800 dark:text-white">Awaiting Coordinates</h3>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 max-w-sm mx-auto leading-relaxed">
          Please enter your core paycheck details (Earning Method, Pay Rate, and Pay Frequency) on the left panel to compile high-fidelity payroll calculations.
        </p>
      </div>
    );
  }

  const {
    basePay,
    totalOvertimeEarnings,
    bonusEarnings,
    commissionEarnings,
    totalBenefitsAndAllowances,
    totalEarnings,
    preTaxDeductions,
    taxableIncome,
    estimatedTaxes,
    postTaxDeductions,
    totalDeductions,
    netPay,
    effectiveHourlyRate,
    effectiveDailyRate,
    effectiveWeeklyPay,
    effectiveMonthlyPay,
    effectiveAnnualSalary,
    earningsRows,
    deductionsRows,
    frequencyConversions
  } = results;

  // 1. Generate Smart Rule-Based Insights
  const smartInsights = useMemo(() => {
    const list: string[] = [];

    const gross = totalEarnings;
    if (gross <= 0) return list;

    // Deduction ratio
    const dedRatio = (totalDeductions / gross) * 100;
    if (dedRatio > 0) {
      list.push(`Your combined deductions and taxes absorb ${dedRatio.toFixed(1)}% of your gross earnings.`);
    }

    // Overtime share
    const otRatio = (totalOvertimeEarnings / gross) * 100;
    if (otRatio > 0) {
      list.push(`Overtime contributions account for ${otRatio.toFixed(1)}% of this paycheck's total income.`);
    }

    // Bonus share
    const bonusRatio = (bonusEarnings / gross) * 100;
    if (bonusRatio > 0) {
      list.push(`Bonuses represent ${bonusRatio.toFixed(1)}% of this paycheck.`);
    }

    // Commission share
    const commRatio = (commissionEarnings / gross) * 100;
    if (commRatio > 0) {
      list.push(`Commission payouts contribute ${commRatio.toFixed(1)}% of your earnings.`);
    }

    // Pre-Tax Savings Insight
    if (preTaxDeductions > 0 && Number(inputs.estimatedTaxRate) > 0) {
      const taxSaved = preTaxDeductions * (Number(inputs.estimatedTaxRate) / 100);
      list.push(`Your pre-tax contributions saved you approximately $${Math.round(taxSaved).toLocaleString()} in deferred tax withholdings today.`);
    }

    // Retained Cash Ratio
    const retainRatio = (netPay / gross) * 100;
    if (retainRatio >= 80) {
      list.push(`Outstanding! You retain a high ratio of take-home cash (${retainRatio.toFixed(1)}% of gross).`);
    } else if (retainRatio < 60) {
      list.push(`Your take-home ratio is ${retainRatio.toFixed(1)}%. Review elective retirement contributions or standard withholdings to optimize net cash flows.`);
    }

    return list;
  }, [results, inputs]);

  // Chart 1: Income Breakdown Chart Data
  const incomeChartData = useMemo(() => {
    const data = [];
    if (basePay > 0) data.push({ name: 'Base Pay', value: basePay, color: '#3b82f6' });
    if (totalOvertimeEarnings > 0) data.push({ name: 'Overtime', value: totalOvertimeEarnings, color: '#6366f1' });
    if (bonusEarnings > 0) data.push({ name: 'Bonus', value: bonusEarnings, color: '#eab308' });
    if (commissionEarnings > 0) data.push({ name: 'Commission', value: commissionEarnings, color: '#10b981' });
    if (totalBenefitsAndAllowances > 0) data.push({ name: 'Allowances/Benefits', value: totalBenefitsAndAllowances, color: '#ec4899' });
    return data;
  }, [basePay, totalOvertimeEarnings, bonusEarnings, commissionEarnings, totalBenefitsAndAllowances]);

  // Chart 2: Deductions Breakdown Chart Data
  const deductionChartData = useMemo(() => {
    const data = [];
    if (preTaxDeductions > 0) data.push({ name: 'Pre-Tax', value: preTaxDeductions, color: '#f59e0b' });
    if (postTaxDeductions > 0) data.push({ name: 'Post-Tax', value: postTaxDeductions, color: '#ec4899' });
    if (estimatedTaxes > 0) data.push({ name: 'Taxes', value: estimatedTaxes, color: '#ef4444' });
    return data;
  }, [preTaxDeductions, postTaxDeductions, estimatedTaxes]);

  // Chart 3: Annualized Projection Chart Data (Bar graph of cumulative growth over 12 months)
  const projectionChartData = useMemo(() => {
    const monthlyGross = effectiveAnnualSalary / 12; // let's base it on monthly paycheck
    const monthlyNet = netPay * (12 / getPayFrequencyMultiplier(inputs.payFrequency, {
      hoursPerDay: Number(inputs.hoursPerDay) || 8,
      daysPerWeek: Number(inputs.daysPerWeek) || 5,
      weeksPerYear: Number(inputs.weeksPerYear) || 52,
      workDaysPerMonth: Number(inputs.workDaysPerMonth) || 21.67
    }));

    const data = [];
    let cumulativeGross = 0;
    let cumulativeNet = 0;
    let cumulativeDeductions = 0;

    const mult = getPayFrequencyMultiplier(inputs.payFrequency, {
      hoursPerDay: Number(inputs.hoursPerDay) || 8,
      daysPerWeek: Number(inputs.daysPerWeek) || 5,
      weeksPerYear: Number(inputs.weeksPerYear) || 52,
      workDaysPerMonth: Number(inputs.workDaysPerMonth) || 21.67
    });

    const singlePaycheckGross = totalEarnings;
    const singlePaycheckNet = netPay;
    const singlePaycheckDeductions = totalDeductions;

    // Project over next 12 periods or standard quarters
    for (let i = 1; i <= 6; i++) {
      const stepLabel = `Period ${i}`;
      cumulativeGross += singlePaycheckGross;
      cumulativeNet += singlePaycheckNet;
      cumulativeDeductions += singlePaycheckDeductions;

      data.push({
        name: stepLabel,
        'Cumulative Gross': Math.round(cumulativeGross),
        'Cumulative Take-Home': Math.round(cumulativeNet),
        'Cumulative Deductions & Taxes': Math.round(cumulativeDeductions),
      });
    }

    return data;
  }, [totalEarnings, netPay, totalDeductions, inputs]);

  // Simple download of results data as JSON/text
  const handleExportPNG = () => {
    // Generate a beautiful, clean summary text block
    const summaryText = `
--------------------------------------------------
     CALCULATOORA - PAYCHECK SUMMARY
--------------------------------------------------
Earning Method: ${inputs.earningMethod.toUpperCase()}
Pay Frequency: ${inputs.payFrequency.toUpperCase()}

GROSS EARNINGS: $${totalEarnings.toFixed(2)}
--------------------------------------------------
- Base Pay: $${basePay.toFixed(2)}
- Overtime Pay: $${totalOvertimeEarnings.toFixed(2)}
- Bonus Pay: $${bonusEarnings.toFixed(2)}
- Commission: $${commissionEarnings.toFixed(2)}
- Benefits/Allowances: $${totalBenefitsAndAllowances.toFixed(2)}

DEDUCTIONS & TAXES: $${totalDeductions.toFixed(2)}
--------------------------------------------------
- Pre-Tax Deductions: $${preTaxDeductions.toFixed(2)}
- Post-Tax Deductions: $${postTaxDeductions.toFixed(2)}
- Estimated Income Taxes: $${estimatedTaxes.toFixed(2)}

NET TAKE-HOME PAY: $${netPay.toFixed(2)}
--------------------------------------------------
Effective Converted Annual Net: $${effectiveAnnualSalary.toFixed(2)}
Effective Converted Monthly Net: $${effectiveMonthlyPay.toFixed(2)}
Effective Converted Weekly Net: $${effectiveWeeklyPay.toFixed(2)}
Effective Converted Hourly Net: $${effectiveHourlyRate.toFixed(2)}
--------------------------------------------------
Generated on: ${new Date().toLocaleDateString()}
    `;

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `paycheck_summary_${inputs.earningMethod}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. Glassmorphic Core Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Gross Pay Card */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 dark:from-neutral-900 dark:to-blue-950/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-900/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-blue-500/10 rounded-full blur-xl"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">Gross Pay (This Paycheck)</span>
            <div className="text-3xl font-black text-neutral-800 dark:text-white select-all">
              ${Math.round(totalEarnings).toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-3 font-bold block">
            Before taxes & deductions
          </span>
        </div>

        {/* Total Deductions Card */}
        <div className="bg-gradient-to-br from-rose-50 to-rose-100/30 dark:from-neutral-900 dark:to-rose-950/10 p-5 rounded-3xl border border-rose-100 dark:border-rose-900/20 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-rose-500/10 rounded-full blur-xl"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest block">Total Deductions & Taxes</span>
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400 select-all">
              ${Math.round(totalDeductions).toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] text-rose-500/70 mt-3 font-bold block flex justify-between">
            <span>Pre: ${Math.round(preTaxDeductions)}</span>
            <span>Post: ${Math.round(postTaxDeductions)}</span>
            <span>Tax: ${Math.round(estimatedTaxes)}</span>
          </span>
        </div>

        {/* Net Take-Home Pay Card */}
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-neutral-900 dark:to-emerald-950/10 p-5 rounded-3xl border border-emerald-150 dark:border-emerald-900/30 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl"></div>
          <div className="space-y-1">
            <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest block">Net Take-Home Pay</span>
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 select-all">
              ${Math.round(netPay).toLocaleString()}
            </div>
          </div>
          <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-3 font-bold block">
            Actual net pay deposited
          </span>
        </div>
      </div>

      {/* 2. Pay Frequency Cross-Conversions Dashboard */}
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-150 dark:border-neutral-800 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h4 className="text-xs font-black text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-neutral-400" />
            Parallel Pay Frequencies Conversion
          </h4>
          <button
            id="btn-export-txt-summary"
            type="button"
            onClick={handleExportPNG}
            className="text-[10px] py-1 px-2.5 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-850 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 font-extrabold flex items-center gap-1 transition cursor-pointer"
          >
            <Download className="w-3 h-3 text-blue-500" />
            <span>Save Text Paystub</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Hourly Equivalent', val: effectiveHourlyRate },
            { label: 'Daily Equivalent', val: effectiveDailyRate },
            { label: 'Weekly Equivalent', val: effectiveWeeklyPay },
            { label: 'Biweekly Equivalent', val: netPay * (26 / getPayFrequencyMultiplier(inputs.payFrequency, { hoursPerDay: 8, daysPerWeek: 5, weeksPerYear: 52, workDaysPerMonth: 21.67 })) }, // estimate based on frequency conversion
            { label: 'Monthly Equivalent', val: effectiveMonthlyPay },
            { label: 'Annual Equivalent', val: effectiveAnnualSalary },
          ].map((item, i) => (
            <div key={i} className="p-3 bg-neutral-50/50 dark:bg-neutral-950/20 rounded-2xl border border-neutral-100 dark:border-neutral-850/60 text-center">
              <span className="text-[10px] font-extrabold text-neutral-400 dark:text-neutral-500 block mb-1">
                {item.label}
              </span>
              <span className="text-sm font-black text-neutral-800 dark:text-neutral-200">
                ${Math.round(item.val).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Visual Interactive Chart Center */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Income Breakdown Chart */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-800 space-y-4 shadow-sm">
          <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
            Paycheck Earnings Breakdown
          </span>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {incomeChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{ background: '#171717', border: 'none', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-[10px] font-bold">
            {incomeChartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }}></span>
                <span className="text-neutral-600 dark:text-neutral-400">{entry.name} (${Math.round(entry.value).toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Deductions Breakdown Chart */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-800 space-y-4 shadow-sm">
          <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
            Deductions & Taxes Composition
          </span>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              {deductionChartData.length > 0 ? (
                <PieChart>
                  <Pie
                    data={deductionChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {deductionChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${Number(value).toLocaleString()}`}
                    contentStyle={{ background: '#171717', border: 'none', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                  />
                </PieChart>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-xs text-neutral-400 font-medium">No deductions entered to map.</span>
                </div>
              )}
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center text-[10px] font-bold">
            {deductionChartData.map((entry, index) => (
              <div key={index} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: entry.color }}></span>
                <span className="text-neutral-600 dark:text-neutral-400">{entry.name} (${Math.round(entry.value).toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Cumulative Earnings Progression */}
        <div className="bg-white dark:bg-neutral-900 p-5 rounded-3xl border border-neutral-150 dark:border-neutral-800 space-y-4 shadow-sm md:col-span-2">
          <span className="text-xs font-black text-neutral-400 uppercase tracking-widest block">
            6-Period Cumulative Paycheck Projection
          </span>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectionChartData}>
                <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} />
                <YAxis stroke="#888888" fontSize={11} tickLine={false} />
                <Tooltip 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  contentStyle={{ background: '#171717', border: 'none', borderRadius: '12px', fontSize: '11px', color: '#fff' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="Cumulative Gross" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cumulative Take-Home" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Cumulative Deductions & Taxes" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Smart Insights Panel */}
      {smartInsights.length > 0 && (
        <div className="bg-gradient-to-r from-blue-500/5 to-purple-500/5 p-5 rounded-3xl border border-blue-500/10 space-y-3">
          <h4 className="text-xs font-black text-blue-600 dark:text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Briefcase className="w-4 h-4" />
            Smart Paycheck Insights
          </h4>
          <ul className="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 leading-normal font-semibold">
            {smartInsights.map((insight, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-blue-500 font-bold shrink-0">&bull;</span>
                <span>{insight}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}
