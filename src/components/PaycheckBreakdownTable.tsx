import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  FileSpreadsheet, 
  Printer, 
  ChevronLeft, 
  ChevronRight,
  Receipt
} from 'lucide-react';
import { PaycheckResults, PaycheckInputs } from '../utils/paycheckMath';

interface PaycheckBreakdownTableProps {
  results: PaycheckResults | null;
  inputs: PaycheckInputs;
}

interface CombinedRow {
  id: number;
  incomeType: string;
  incomeAmount: number;
  deductionType: string;
  deductionAmount: number;
  netEffect: number;
}

export default function PaycheckBreakdownTable({
  results,
  inputs
}: PaycheckBreakdownTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof CombinedRow>('id');
  const [sortAsc, setSortAsc] = useState(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Build combined rows
  const combinedRows = useMemo<CombinedRow[]>(() => {
    if (!results) return [];
    
    const { earningsRows, deductionsRows } = results;
    const maxLen = Math.max(earningsRows.length, deductionsRows.length);
    const rows: CombinedRow[] = [];

    for (let i = 0; i < maxLen; i++) {
      const earn = earningsRows[i] || { label: '', amount: 0 };
      const ded = deductionsRows[i] || { label: '', amount: 0 };

      rows.push({
        id: i + 1,
        incomeType: earn.label,
        incomeAmount: earn.amount,
        deductionType: ded.label,
        deductionAmount: ded.amount,
        netEffect: earn.amount - ded.amount
      });
    }

    return rows;
  }, [results]);

  const handleSort = (field: keyof CombinedRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Sort rows
  const processedRows = useMemo(() => {
    let rows = [...combinedRows];

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r => 
        r.incomeType.toLowerCase().includes(q) ||
        r.deductionType.toLowerCase().includes(q)
      );
    }

    // Sort rows
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
  }, [combinedRows, searchQuery, sortField, sortAsc]);

  // Paginated Rows
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [processedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;

  // Reset pagination index
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, sortField, sortAsc, pageSize]);

  // CSV Export Helper
  const handleExportCSV = () => {
    if (combinedRows.length === 0) return;
    const headers = ['Income Type', 'Income Amount', 'Deduction Type', 'Deduction Amount', 'Net Effect'];
    const rows = combinedRows.map(r => [
      r.incomeType || 'N/A',
      r.incomeAmount.toFixed(2),
      r.deductionType || 'N/A',
      r.deductionAmount.toFixed(2),
      r.netEffect.toFixed(2)
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "paycheck_ledger_breakdown.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const tableHeaderCell = (field: keyof CombinedRow, label: string) => (
    <th 
      onClick={() => handleSort(field)}
      className="py-3 px-4 text-left text-xs font-bold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider cursor-pointer select-none hover:bg-neutral-50 dark:hover:bg-neutral-850 transition-colors"
    >
      <div className="flex items-center gap-1.5">
        {label}
        <ArrowUpDown className={`w-3.5 h-3.5 ${sortField === field ? 'text-blue-500' : 'text-neutral-400'}`} />
      </div>
    </th>
  );

  if (!results || combinedRows.length === 0) {
    return (
      <div className="p-8 text-center border border-dashed border-neutral-150 dark:border-neutral-800 rounded-3xl text-xs text-neutral-400">
        Please complete inputs to generate paycheck breakdown ledger ledger items.
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fadeIn">
      
      {/* Table Header Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 items-center">
        
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="paycheck-ledger-search"
            type="text"
            placeholder="Search income, benefit, or deduction types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 justify-end">
          <button
            id="btn-export-ledger-csv"
            type="button"
            onClick={handleExportCSV}
            className="p-2 text-xs font-black text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 border border-neutral-150 dark:border-neutral-800 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>Export CSV</span>
          </button>
          <button
            id="btn-print-ledger"
            type="button"
            onClick={handlePrint}
            className="p-2 text-xs font-black text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 border border-neutral-150 dark:border-neutral-800 rounded-xl transition flex items-center gap-1 cursor-pointer"
          >
            <Printer className="w-4 h-4 text-blue-500" />
            <span>Print paystub</span>
          </button>
        </div>

      </div>

      {/* Main Table */}
      <div className="overflow-x-auto rounded-3xl border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
        <table className="min-w-full divide-y divide-neutral-150 dark:divide-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
          <thead className="bg-neutral-50/50 dark:bg-neutral-950/20">
            <tr>
              {tableHeaderCell('incomeType', 'Income Type')}
              {tableHeaderCell('incomeAmount', 'Amount')}
              {tableHeaderCell('deductionType', 'Deduction Type')}
              {tableHeaderCell('deductionAmount', 'Deduction Amount')}
              {tableHeaderCell('netEffect', 'Net Effect')}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <tr 
                  key={row.id}
                  className="hover:bg-blue-500/5 dark:hover:bg-cyan-500/5 transition duration-150"
                >
                  {/* Income Type */}
                  <td className="py-3 px-4 font-black text-neutral-800 dark:text-neutral-200">
                    {row.incomeType || <span className="text-neutral-300 dark:text-neutral-600">&mdash;</span>}
                  </td>
                  {/* Income Amount */}
                  <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                    {row.incomeAmount > 0 ? `$${Math.round(row.incomeAmount).toLocaleString()}` : <span className="text-neutral-300 dark:text-neutral-600">&mdash;</span>}
                  </td>
                  {/* Deduction Type */}
                  <td className="py-3 px-4 font-bold text-neutral-700 dark:text-neutral-300">
                    {row.deductionType || <span className="text-neutral-300 dark:text-neutral-600">&mdash;</span>}
                  </td>
                  {/* Deduction Amount */}
                  <td className="py-3 px-4 font-semibold text-rose-500 dark:text-rose-400">
                    {row.deductionAmount > 0 ? `$${Math.round(row.deductionAmount).toLocaleString()}` : <span className="text-neutral-300 dark:text-neutral-600">&mdash;</span>}
                  </td>
                  {/* Net Effect */}
                  <td className={`py-3 px-4 font-black ${row.netEffect >= 0 ? 'text-neutral-900 dark:text-white' : 'text-rose-500'}`}>
                    ${Math.round(row.netEffect).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-neutral-400 font-medium">
                  No payroll records match your query filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-neutral-50 dark:bg-neutral-950/20 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Show:</span>
          <select
            id="ledger-page-size"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="py-1 px-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
          >
            <option value="5">5 rows</option>
            <option value="10">10 rows</option>
            <option value="20">20 rows</option>
          </select>
          <span className="ml-1">({processedRows.length} total entries)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-ledger-prev"
            type="button"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            id="btn-ledger-next"
            type="button"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
