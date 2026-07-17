import React, { useRef } from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend, 
  AreaChart, 
  Area,
  LineChart,
  Line
} from 'recharts';
import html2canvas from 'html2canvas';
import { 
  Download, 
  Printer, 
  FileSpreadsheet, 
  FileText, 
  Image, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  Award,
  Zap
} from 'lucide-react';
import { CalculationResults, AmortizationRow } from './types';

interface VisualizationsProps {
  results: CalculationResults;
  currency: string;
}

export default function Visualizations({ results, currency }: VisualizationsProps) {
  const chartRef = useRef<HTMLDivElement | null>(null);

  // Parse stats
  const {
    monthlyPayment,
    totalLoanAmount,
    interestPaid,
    totalCostOfLoan,
    totalCostOfVehicle,
    amountFinanced,
    totalUpfrontCost,
    schedule,
    yearlySchedule,
    hasExtraPayments,
    extraSchedule,
    extraYearlySchedule,
    interestSaved,
    monthsSaved,
    payoffDate,
    originalPayoffDate,
    ownershipMonthlyCost,
    ownershipAnnualCost
  } = results;

  // 1. Chart Data: Payment Breakdown Pie Chart
  const pieData = [
    { name: 'Principal (Amount Financed)', value: amountFinanced, color: '#10b981' }, // emerald
    { name: 'Total Loan Interest', value: interestPaid, color: '#ef4444' }, // red
    { name: 'Upfront Fees & Tax', value: Math.max(0, totalUpfrontCost - amountFinanced), color: '#3b82f6' } // blue
  ].filter(d => d.value > 0);

  // 2. Chart Data: Principal vs Interest (Yearly)
  const yearlyChartData = yearlySchedule.map(row => ({
    year: `Year ${row.yearNumber}`,
    Principal: Math.round(row.totalPrincipalPaid),
    Interest: Math.round(row.totalInterestPaid),
    Balance: Math.round(row.remainingBalance)
  }));

  // 3. Chart Data: Loan Balance Timeline
  // Downsample monthly schedule to maximum 24 points to keep chart beautiful on mobile
  const stride = Math.max(1, Math.ceil(schedule.length / 15));
  const timelineData = schedule.filter((_, idx) => idx % stride === 0 || idx === schedule.length - 1).map(row => ({
    month: `M${row.paymentNumber}`,
    Balance: Math.round(row.remainingBalance),
    ...(hasExtraPayments ? {
      ExtraBalance: Math.round(
        extraSchedule[row.paymentNumber - 1]?.remainingBalance ?? 0
      )
    } : {})
  }));

  // Export CSV Amortization Schedule
  const exportToCSV = () => {
    const csvRows = [
      ['Payment Number', 'Payment Amount', 'Principal Paid', 'Interest Paid', 'Extra Payment Paid', 'Remaining Balance', 'Cumulative Interest', 'Cumulative Principal']
    ];

    const activeSchedule = hasExtraPayments ? extraSchedule : schedule;

    activeSchedule.forEach(row => {
      csvRows.push([
        row.paymentNumber.toString(),
        row.paymentAmount.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.extraPayment.toFixed(2),
        row.remainingBalance.toFixed(2),
        row.totalInterestPaid.toFixed(2),
        row.totalPrincipalPaid.toFixed(2)
      ]);
    });

    const csvContent = "data:text/csv;charset=utf-8," 
      + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CarPayment_Amortization_Schedule.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Chart Container as PNG
  const downloadPNG = () => {
    if (!chartRef.current) return;
    html2canvas(chartRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: null
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = 'CarPayment_Calculator_Charts.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // Trigger browser print
  const printReport = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      
      {/* Top action cards for Extra Payment savings if active */}
      {hasExtraPayments && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-neutral-800 dark:text-emerald-400">
          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">Total Interest Saved</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {currency}{interestSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">Payoff Term Shortened</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {monthsSaved} Months Saved
              </div>
            </div>
          </div>

          <div className="flex gap-3 items-center">
            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider font-bold">Accelerated Payoff Date</div>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                {payoffDate}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Export Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 shadow-sm print:hidden">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Report Export Hub
        </span>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={exportToCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 font-bold text-xs rounded-xl transition"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export CSV Schedule
          </button>
          <button 
            onClick={downloadPNG}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 hover:bg-blue-500/20 font-bold text-xs rounded-xl transition"
          >
            <Image className="w-3.5 h-3.5" />
            Download PNG Charts
          </button>
          <button 
            onClick={printReport}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 hover:bg-purple-500/20 font-bold text-xs rounded-xl transition"
          >
            <Printer className="w-3.5 h-3.5" />
            Print Full Report
          </button>
        </div>
      </div>

      {/* Render Charts inside grid */}
      <div ref={chartRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Chart 1: Payment Breakdown */}
        <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm space-y-4">
          <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-500" />
            Vehicle Lifetime Cost Allocation
          </h4>
          <div className="h-[240px] flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(val) => `${currency}${Number(val).toLocaleString(undefined, { maximumFractionDigits: 0 })}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <span className="text-xs text-neutral-400">Fill in inputs to display allocation breakdown.</span>
            )}
          </div>
        </div>

        {/* Chart 2: Amortization Curve */}
        <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm space-y-4">
          <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-500" />
            Remaining Loan Balance Timeline
          </h4>
          <div className="h-[240px]">
            {schedule.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timelineData}>
                  <XAxis dataKey="month" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                  <RechartsTooltip formatter={(val) => `${currency}${Number(val).toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Area type="monotone" dataKey="Balance" stroke="#3b82f6" fillOpacity={0.1} fill="url(#colorBal)" name="Standard Balance" />
                  {hasExtraPayments && (
                    <Area type="monotone" dataKey="ExtraBalance" stroke="#10b981" fillOpacity={0.15} fill="url(#colorExtra)" name="With Extra Payments" />
                  )}
                  <defs>
                    <linearGradient id="colorBal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExtra" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-xs text-neutral-400">Waiting for data inputs...</span>
              </div>
            )}
          </div>
        </div>

        {/* Chart 3: Principal vs Interest (Yearly) */}
        <div className="p-6 bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-sm space-y-4 md:col-span-2">
          <h4 className="text-sm font-black text-neutral-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-500" />
            Cumulative Principal vs Interest Growth (Yearly)
          </h4>
          <div className="h-[280px]">
            {yearlySchedule.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={yearlyChartData}>
                  <XAxis dataKey="year" stroke="#888888" fontSize={10} tickLine={false} />
                  <YAxis stroke="#888888" fontSize={10} tickLine={false} tickFormatter={(v) => `${currency}${v}`} />
                  <RechartsTooltip formatter={(val) => `${currency}${Number(val).toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '11px' }} />
                  <Bar dataKey="Principal" stackId="a" fill="#10b981" name="Paid Principal" />
                  <Bar dataKey="Interest" stackId="a" fill="#ef4444" name="Paid Interest" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <span className="text-xs text-neutral-400">Enter pricing info above to render amortization graph.</span>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
}
