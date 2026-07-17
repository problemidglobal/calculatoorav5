import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Printer, 
  ArrowUpDown, 
  Search, 
  Calendar 
} from 'lucide-react';
import { LoanInputs, AmortizationRow } from '../utils/ultimateLoanMath';

interface UltimateLoanAmortizationTableProps {
  schedule: AmortizationRow[];
  inputs: LoanInputs;
}

export default function UltimateLoanAmortizationTable({
  schedule,
  inputs
}: UltimateLoanAmortizationTableProps) {
  const currency = inputs.currency || '$';

  // Search filter (by year or date string)
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Sorting state
  const [sortField, setSortField] = useState<keyof AmortizationRow>('paymentNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12); // Defaults to annual chunks

  const handleSort = (field: keyof AmortizationRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const filteredAndSortedRows = useMemo(() => {
    let rows = [...schedule];

    // Search query filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r => 
        r.date.toLowerCase().includes(q) || 
        r.paymentNumber.toString().includes(q) ||
        `year ${Math.ceil(r.paymentNumber / 12)}`.includes(q)
      );
    }

    // Sorting
    rows.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortAsc ? valA - valB : valB - valA;
      }
      return sortAsc 
        ? String(valA).localeCompare(String(valB)) 
        : String(valB).localeCompare(String(valA));
    });

    return rows;
  }, [schedule, searchQuery, sortField, sortAsc]);

  // Pagination bounds
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedRows.slice(start, start + pageSize);
  }, [filteredAndSortedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredAndSortedRows.length / pageSize) || 1;

  // Reset page when search or sorting triggers changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortAsc, pageSize]);

  // CSV Export Trigger
  const handleExportCSV = () => {
    const headers = [
      'Payment #',
      'Date',
      'Scheduled Payment',
      'Principal Component',
      'Interest Component',
      'Fees Component',
      'Insurance Component',
      'Taxes Component',
      'Extra Principal Prepayment',
      'Remaining Balance',
      'Applied Rate (%)'
    ];

    const csvContent = [
      headers.join(','),
      ...schedule.map(row => [
        row.paymentNumber,
        row.date,
        row.payment.toFixed(2),
        row.principal.toFixed(2),
        row.interest.toFixed(2),
        row.fees.toFixed(2),
        row.insurance.toFixed(2),
        row.taxes.toFixed(2),
        row.extraPayment.toFixed(2),
        row.remainingBalance.toFixed(2),
        row.rateApplied.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `ultimate_loan_amortization_schedule_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable layout trigger
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 space-y-6 text-left font-sans print:border-none print:p-0">
      
      {/* Table Title and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-neutral-800 dark:text-white">Amortization Ledger</h3>
          <p className="text-[10px] text-neutral-400">Systematic breakdown of each repayment period</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          
          <button 
            onClick={handleExportCSV}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-100 text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>

          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-neutral-150 hover:bg-neutral-250 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-900 dark:text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" /> Print / PDF
          </button>

        </div>
      </div>

      {/* Filter and Page controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 print:hidden">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
            <Search className="w-4 h-4" />
          </span>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search date or Year (e.g. Year 5)..."
            className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/30 text-neutral-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/20"
          />
        </div>

        {/* Page size controller */}
        <div className="flex items-center gap-2 self-end sm:self-auto text-xs text-neutral-500">
          <span>Show:</span>
          <select 
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="py-1 px-2.5 rounded-lg border border-neutral-250 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs font-bold"
          >
            <option value="12">12 periods (1 Year)</option>
            <option value="24">24 periods (2 Years)</option>
            <option value="60">60 periods (5 Years)</option>
            <option value="120">120 periods (10 Years)</option>
            <option value="9999">Show All</option>
          </select>
        </div>

      </div>

      {/* Dynamic Data Table Container */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-150 dark:border-neutral-800/80">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-900/50 border-b border-neutral-150 dark:border-neutral-800/80 text-neutral-500 font-bold select-none">
              <th className="p-3.5 cursor-pointer hover:text-neutral-700 dark:hover:text-white transition" onClick={() => handleSort('paymentNumber')}>
                <div className="flex items-center gap-1"># <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3.5 cursor-pointer hover:text-neutral-700 dark:hover:text-white transition" onClick={() => handleSort('date')}>
                <div className="flex items-center gap-1">Date <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3.5 text-right cursor-pointer hover:text-neutral-700" onClick={() => handleSort('payment')}>
                <div className="flex items-center justify-end gap-1">Payment <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3.5 text-right cursor-pointer hover:text-neutral-700" onClick={() => handleSort('principal')}>
                <div className="flex items-center justify-end gap-1">Principal <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3.5 text-right cursor-pointer hover:text-neutral-700" onClick={() => handleSort('interest')}>
                <div className="flex items-center justify-end gap-1">Interest <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3.5 text-right cursor-pointer hover:text-neutral-700" onClick={() => handleSort('extraPayment')}>
                <div className="flex items-center justify-end gap-1">Prepay <ArrowUpDown className="w-3 h-3" /></div>
              </th>
              <th className="p-3.5 text-right cursor-pointer hover:text-neutral-700" onClick={() => handleSort('remainingBalance')}>
                <div className="flex items-center justify-end gap-1">Remaining Balance <ArrowUpDown className="w-3 h-3" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-mono text-neutral-700 dark:text-neutral-300">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <tr 
                  key={row.paymentNumber} 
                  className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-850/20 transition ${row.extraPayment > 0 ? 'bg-emerald-500/5 dark:bg-emerald-500/5' : ''}`}
                >
                  <td className="p-3.5 font-bold text-neutral-900 dark:text-neutral-100">{row.paymentNumber}</td>
                  <td className="p-3.5 whitespace-nowrap text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-neutral-400 print:hidden" />
                      <span>{row.date}</span>
                    </div>
                  </td>
                  <td className="p-3.5 text-right text-neutral-900 dark:text-white font-black">
                    {currency}{row.payment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                    {currency}{row.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-right text-rose-500 font-medium">
                    {currency}{row.interest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="p-3.5 text-right font-bold text-emerald-500">
                    {row.extraPayment > 0 ? `${currency}${row.extraPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td className="p-3.5 text-right text-neutral-900 dark:text-neutral-100 font-black">
                    {currency}{row.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-400 select-none">
                  No matching schedules located. Try clearing search filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800 print:hidden">
          <span className="text-xs text-neutral-450 dark:text-neutral-500">
            Page <strong className="text-neutral-700 dark:text-neutral-300 font-black font-mono">{currentPage}</strong> of <strong className="font-mono">{totalPages}</strong> ({filteredAndSortedRows.length} entries)
          </span>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 border border-neutral-250 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-850 transition disabled:opacity-30 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 border border-neutral-250 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-850 transition disabled:opacity-30 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
