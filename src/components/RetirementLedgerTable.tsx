import React, { useState, useMemo } from 'react';
import { Download, Search, TableProperties } from 'lucide-react';
import { RetirementInputs, YearProjection } from '../utils/retirementMath';

interface RetirementLedgerTableProps {
  timeline: YearProjection[];
  inputs: RetirementInputs;
}

export default function RetirementLedgerTable({ timeline, inputs }: RetirementLedgerTableProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const cur = inputs.currency || '$';

  const formatMoney = (val: number) => {
    return cur + Math.round(val).toLocaleString();
  };

  // Filter rows based on search query (e.g., searching for "65" or "Retired")
  const filteredTimeline = useMemo(() => {
    if (!searchQuery.trim()) return timeline;
    return timeline.filter(row => {
      const ageStr = row.age.toString();
      const phaseStr = row.isRetired ? 'retired' : 'accumulation';
      return ageStr.includes(searchQuery) || phaseStr.includes(searchQuery.toLowerCase());
    });
  }, [timeline, searchQuery]);

  // Export to CSV helper
  const handleExportCSV = () => {
    const headers = [
      'Age',
      'Phase',
      'Starting Balance',
      'Contribution',
      'Social Security',
      'Withdrawal',
      'Investment Return',
      'Ending Balance',
      'Purchasing Power (Today\'s $)'
    ];

    const rows = timeline.map(row => [
      row.age,
      row.isRetired ? 'Retired' : 'Accumulating',
      Math.round(row.startingBalance),
      Math.round(row.contribution),
      Math.round(row.socialSecurity),
      Math.round(row.withdrawal),
      Math.round(row.investmentReturn),
      Math.round(row.endingBalance),
      Math.round(row.purchasingPowerValue)
    ]);

    const csvContent = 
      'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `retirement_schedule_age_${inputs.currentAge}_to_${inputs.lifeExpectancy}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 border border-neutral-150 dark:border-neutral-800 bg-white/60 dark:bg-neutral-900/40 rounded-2xl space-y-4 text-left">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-black text-neutral-850 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
            <TableProperties className="w-4 h-4 text-blue-500" />
            Year-by-Year Lifetime Schedule
          </h3>
          <p className="text-[10px] text-neutral-400 font-medium">Full asset flows, contributions, social security benefits, and inflation indices</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-neutral-400" />
            <input
              type="text"
              placeholder="Search age, phase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 pr-4 py-1.5 text-[11px] font-bold border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-905 rounded-xl text-neutral-800 dark:text-white focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-cyan-400 bg-blue-500/5 hover:bg-blue-500/10 dark:bg-cyan-400/5 dark:hover:bg-cyan-400/10 border border-blue-500/15 dark:border-cyan-400/15 hover:border-blue-500/30 dark:hover:border-cyan-400/30 rounded-xl transition cursor-pointer select-none"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
      </div>

      {/* TABLE WORKSPACE */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-150 dark:border-neutral-800/80">
        <table className="w-full text-left border-collapse font-sans text-xs">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-150 dark:border-neutral-850 text-[10px] text-neutral-400 uppercase font-bold tracking-wider">
              <th className="py-3 px-4">Age</th>
              <th className="py-3 px-4">Phase</th>
              <th className="py-3 px-4 text-right">Starting Bal</th>
              <th className="py-3 px-4 text-right">Contribution</th>
              <th className="py-3 px-4 text-right">SS Benefit</th>
              <th className="py-3 px-4 text-right">Withdrawal</th>
              <th className="py-3 px-4 text-right">Market Gains</th>
              <th className="py-3 px-4 text-right">Ending Bal</th>
              <th className="py-3 px-4 text-right text-blue-600 dark:text-cyan-400">Purchasing Power</th>
            </tr>
          </thead>
          <tbody>
            {filteredTimeline.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center font-bold text-neutral-450 uppercase">
                  No matching entries found
                </td>
              </tr>
            ) : (
              filteredTimeline.map((row) => (
                <tr 
                  key={row.age}
                  className="border-b border-neutral-100 dark:border-neutral-850 hover:bg-neutral-50/50 dark:hover:bg-neutral-900/10 font-medium text-neutral-700 dark:text-neutral-300 transition-all"
                >
                  <td className="py-3 px-4 font-black text-neutral-800 dark:text-white">
                    {row.age}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2 py-0.5 text-[9px] font-black uppercase rounded-lg border ${
                      row.isRetired 
                        ? 'text-amber-500 bg-amber-500/5 border-amber-500/10' 
                        : 'text-blue-500 bg-blue-500/5 border-blue-500/10'
                    }`}>
                      {row.isRetired ? 'Retired' : 'Accumulating'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">{formatMoney(row.startingBalance)}</td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">
                    {row.contribution > 0 ? `+${formatMoney(row.contribution)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-indigo-600 dark:text-indigo-400">
                    {row.socialSecurity > 0 ? `+${formatMoney(row.socialSecurity)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-500">
                    {row.withdrawal > 0 ? `-${formatMoney(row.withdrawal)}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-500">
                    {row.investmentReturn > 0 ? `+${formatMoney(row.investmentReturn)}` : row.investmentReturn < 0 ? `-${formatMoney(Math.abs(row.investmentReturn))}` : '—'}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-neutral-850 dark:text-white">
                    {formatMoney(row.endingBalance)}
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-blue-600 dark:text-cyan-400 bg-blue-500/5 dark:bg-cyan-500/5">
                    {formatMoney(row.purchasingPowerValue)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}
