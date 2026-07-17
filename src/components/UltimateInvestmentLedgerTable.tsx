import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Search, 
  TrendingUp, 
  Coins, 
  Briefcase, 
  Shield 
} from 'lucide-react';
import { InvestmentResults, InvestmentInputs, ProjectionRow } from '../utils/ultimateInvestmentMath';

interface UltimateInvestmentLedgerTableProps {
  results: InvestmentResults;
  inputs: InvestmentInputs;
}

export default function UltimateInvestmentLedgerTable({
  results,
  inputs
}: UltimateInvestmentLedgerTableProps) {
  const [viewType, setViewType] = useState<'yearly' | 'monthly'>('yearly');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  const currencySymbol = inputs.currency || '$';

  // Format currency helper
  const formatVal = (val: number) => {
    return currencySymbol + Math.round(val).toLocaleString();
  };

  // Compile yearly rollups from the monthly schedule
  const yearlyRollup = useMemo(() => {
    const rollups: any[] = [];
    let currentYr = 1;
    let yrContrib = 0;
    let yrWithdraw = 0;
    let yrInterest = 0;
    let yrDividends = 0;
    let yrFees = 0;
    let yrTaxes = 0;
    let lastNominalBal = inputs.initialInvestment;
    let lastRealBal = inputs.initialInvestment;
    let dateStr = '';

    for (let i = 0; i < results.schedule.length; i++) {
      const row = results.schedule[i];
      
      // Accumulate
      yrContrib = row.totalContributions; // already cumulative in row
      yrWithdraw += row.totalWithdrawals - (results.schedule[i-1]?.totalWithdrawals || 0); // make incremental or cumulative? Let's keep it incremental to sum up
      yrInterest += row.interestIncome;
      yrDividends += row.dividendIncome;
      yrFees += row.totalFeesPaid - (results.schedule[i-1]?.totalFeesPaid || 0);
      yrTaxes += row.totalTaxesPaid - (results.schedule[i-1]?.totalTaxesPaid || 0);
      
      lastNominalBal = row.nominalBalance;
      lastRealBal = row.realBalance;
      dateStr = row.date;

      if (row.year !== results.schedule[i+1]?.year) {
        // Year completed, push rollup
        rollups.push({
          year: row.year,
          date: dateStr,
          nominalBalance: lastNominalBal,
          realBalance: lastRealBal,
          totalContributions: yrContrib,
          interestIncome: yrInterest,
          dividendIncome: yrDividends,
          feesPaid: yrFees,
          taxesPaid: yrTaxes,
          withdrawals: row.totalWithdrawals // cumulative
        });

        // Reset incremental registers
        yrWithdraw = 0;
        yrInterest = 0;
        yrDividends = 0;
        yrFees = 0;
        yrTaxes = 0;
      }
    }
    return rollups;
  }, [results.schedule, inputs.initialInvestment]);

  // Determine current active rows
  const activeRows = useMemo(() => {
    const rawList = viewType === 'yearly' ? yearlyRollup : results.schedule;
    
    // Filter by query
    if (!searchQuery) return rawList;
    
    return rawList.filter((row: any) => {
      const label = viewType === 'yearly' ? `Year ${row.year}` : row.date;
      return label.toLowerCase().includes(searchQuery.toLowerCase());
    });
  }, [viewType, yearlyRollup, results.schedule, searchQuery]);

  // Pagination bounds
  const totalPages = Math.ceil(activeRows.length / itemsPerPage);
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return activeRows.slice(start, start + itemsPerPage);
  }, [activeRows, currentPage]);

  const handleExportCSV = () => {
    const rawList = viewType === 'yearly' ? yearlyRollup : results.schedule;
    const headers = [
      viewType === 'yearly' ? 'Year' : 'Month',
      'Date',
      'Contributions',
      'Interest Earned',
      'Dividends Paid',
      'Fees Deducted',
      'Taxes Levied',
      'Cumulative Cashouts',
      'Nominal Ending Balance',
      'Real Ending Balance'
    ];

    const csvContent = [
      headers.join(','),
      ...rawList.map((row: any) => [
        viewType === 'yearly' ? row.year : row.month,
        row.date,
        row.totalContributions.toFixed(2),
        (row.interestIncome ?? row.totalInterestEarned).toFixed(2),
        (row.dividendIncome ?? row.totalDividendsEarned).toFixed(2),
        (row.feesPaid ?? row.totalFeesPaid).toFixed(2),
        (row.taxesPaid ?? row.totalTaxesPaid).toFixed(2),
        (row.withdrawals ?? row.totalWithdrawals).toFixed(2),
        row.nominalBalance.toFixed(2),
        row.realBalance.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `calculatoora_investment_${viewType}_projection.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 font-sans text-left">
      
      {/* LEDGER BAR HEADERS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-neutral-50 dark:bg-neutral-905 p-3 rounded-2xl border border-neutral-150 dark:border-neutral-800">
        <div className="flex gap-2">
          <button
            onClick={() => { setViewType('yearly'); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition select-none cursor-pointer ${
              viewType === 'yearly'
                ? 'bg-neutral-850 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Yearly Rollup
          </button>
          <button
            onClick={() => { setViewType('monthly'); setCurrentPage(1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition select-none cursor-pointer ${
              viewType === 'monthly'
                ? 'bg-neutral-850 dark:bg-white text-white dark:text-neutral-900'
                : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }`}
          >
            Monthly Timeline
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-400">
              <Search className="w-3.5 h-3.5" />
            </span>
            <input
              type="text"
              placeholder={viewType === 'yearly' ? 'Search year...' : 'Search date...'}
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-2.5 py-1.5 text-xs font-bold w-36 sm:w-44 border border-neutral-200 dark:border-neutral-800 rounded-xl bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="p-2 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-350 rounded-xl hover:bg-neutral-200 dark:hover:bg-neutral-700 transition flex items-center gap-1 text-xs font-bold cursor-pointer select-none"
            title="Download CSV Statement"
          >
            <Download className="w-3.5 h-3.5" /> <span className="hidden md:inline">Export</span>
          </button>
        </div>
      </div>

      {/* TABLE DATA */}
      <div className="overflow-x-auto border border-neutral-150 dark:border-neutral-800 rounded-2xl bg-white dark:bg-neutral-900/40">
        <table className="min-w-full divide-y divide-neutral-150 dark:divide-neutral-800 text-left text-xs">
          <thead className="bg-neutral-50 dark:bg-neutral-905 select-none font-black text-neutral-400 uppercase tracking-wider text-[9px]">
            <tr>
              <th className="px-4 py-3 text-center w-16">{viewType === 'yearly' ? 'Year' : 'Month'}</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3 text-right">Contributions</th>
              <th className="px-4 py-3 text-right flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3 text-neutral-400" /> Growth Yield
              </th>
              <th className="px-4 py-3 text-right">
                <Coins className="w-3 h-3 inline mr-1 text-neutral-400" /> Dividends
              </th>
              <th className="px-4 py-3 text-right">
                <Briefcase className="w-3 h-3 inline mr-1 text-neutral-400" /> Fees
              </th>
              <th className="px-4 py-3 text-right">
                <Shield className="w-3 h-3 inline mr-1 text-neutral-400" /> Taxes
              </th>
              <th className="px-4 py-3 text-right">Cashouts</th>
              <th className="px-4 py-3 text-right font-bold text-neutral-800 dark:text-white">Ending Balance</th>
              <th className="px-4 py-3 text-right text-emerald-500">Real Bal.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-150 dark:divide-neutral-850 text-[11px] font-bold text-neutral-600 dark:text-neutral-300">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-neutral-400 italic">
                  No matching ledger transactions found. Try adjusting your search.
                </td>
              </tr>
            ) : (
              paginatedRows.map((row: any, idx) => {
                const label = viewType === 'yearly' ? `Yr ${row.year}` : `#${row.month}`;
                return (
                  <tr 
                    key={idx} 
                    className="hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-center font-mono text-neutral-400">{label}</td>
                    <td className="px-4 py-2.5 text-neutral-800 dark:text-neutral-200">{row.date}</td>
                    <td className="px-4 py-2.5 text-right font-mono">{formatVal(row.totalContributions)}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-600 dark:text-emerald-400">
                      +{formatVal(row.interestIncome ?? row.totalInterestEarned)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-indigo-500">
                      +{formatVal(row.dividendIncome ?? row.totalDividendsEarned)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-rose-500">
                      -{formatVal(row.feesPaid ?? row.totalFeesPaid)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-rose-500">
                      -{formatVal(row.taxesPaid ?? row.totalTaxesPaid)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-neutral-500">
                      {row.withdrawals > 0 ? `-${formatVal(row.withdrawals)}` : '$0'}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-blue-600 dark:text-cyan-400 font-extrabold text-[12px]">
                      {formatVal(row.nominalBalance)}
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-emerald-500 font-extrabold">
                      {formatVal(row.realBalance)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-3 border border-neutral-150 dark:border-neutral-800 rounded-2xl bg-neutral-50/40 dark:bg-neutral-900/10">
          <span className="text-[10px] text-neutral-400 font-medium">
            Showing Page {currentPage} of {totalPages} ({activeRows.length} Ledger cycles)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 transition cursor-pointer"
            >
              Prev
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 disabled:opacity-40 transition cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
