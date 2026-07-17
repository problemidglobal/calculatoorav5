import React, { useState, useMemo } from 'react';
import { 
  ArrowUpDown, 
  Search, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Filter,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { CarAmortizationRow, CarLoanInputs } from '../utils/carLoanMath';

interface CarLoanAmortizationTableProps {
  schedule: CarAmortizationRow[];
  inputs: CarLoanInputs;
}

export default function CarLoanAmortizationTable({
  schedule,
  inputs
}: CarLoanAmortizationTableProps) {
  // Filters and Queries
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'extras' | 'milestones'>('all');

  // Sorting
  const [sortField, setSortField] = useState<keyof CarAmortizationRow>('paymentNumber');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(12); // defaults to 12 months (1 year per page)

  const handleSort = (field: keyof CarAmortizationRow) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter & Sort calculation
  const processedRows = useMemo(() => {
    let rows = [...schedule];

    // Filter type
    if (filterType === 'extras') {
      rows = rows.filter(r => r.extraPayment > 0);
    } else if (filterType === 'milestones') {
      // Show first payment of each year and the final payoff payment
      rows = rows.filter(r => (r.paymentNumber - 1) % 12 === 0 || r.endingBalance === 0);
    }

    // Search filter
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      rows = rows.filter(r => 
        r.date.toLowerCase().includes(q) || 
        r.paymentNumber.toString().includes(q) ||
        `year ${Math.ceil(r.paymentNumber / 12)}`.includes(q)
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
  }, [schedule, filterType, searchQuery, sortField, sortAsc]);

  // Paginated Rows slice
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [processedRows, currentPage, pageSize]);

  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;

  // Reset page index on filter or search updates
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, sortField, sortAsc, pageSize]);

  // Export CSV Helper
  const handleExportCSV = () => {
    if (schedule.length === 0) return;
    const headers = ['Payment #', 'Date', 'Beginning Balance', 'Regular Payment', 'Principal Component', 'Interest Component', 'Extra Payment', 'Ending Balance', 'APR %'];
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

  // Simple print handler
  const handlePrint = () => {
    window.print();
  };

  const tableHeaderCell = (field: keyof CarAmortizationRow, label: string) => (
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

  return (
    <div className="space-y-4 animate-fadeIn">
      {/* Search, Filter, Actions Toolbar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-center bg-white dark:bg-neutral-900 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800">
        
        {/* Search */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="table-search"
            type="text"
            placeholder="Search dates, payment #, year..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs py-2 pl-9 pr-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950 text-neutral-800 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500/30 transition-all"
          />
        </div>

        {/* Filter Selection */}
        <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl justify-self-stretch lg:justify-self-center">
          <button
            id="filter-all"
            onClick={() => setFilterType('all')}
            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
              filterType === 'all' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-sm' 
                : 'text-neutral-500'
            }`}
          >
            All Payments
          </button>
          <button
            id="filter-extras"
            onClick={() => setFilterType('extras')}
            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
              filterType === 'extras' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-sm' 
                : 'text-neutral-500'
            }`}
          >
            Only Prepayments
          </button>
          <button
            id="filter-milestones"
            onClick={() => setFilterType('milestones')}
            className={`px-3 py-1.5 text-[10px] font-black rounded-lg transition-all cursor-pointer ${
              filterType === 'milestones' 
                ? 'bg-white dark:bg-neutral-900 text-blue-600 dark:text-cyan-400 shadow-sm' 
                : 'text-neutral-500'
            }`}
          >
            Yearly Milestones
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end lg:justify-self-end">
          <button
            id="btn-export-table-csv"
            onClick={handleExportCSV}
            className="p-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 border border-neutral-150 dark:border-neutral-800 rounded-xl transition flex items-center gap-1 cursor-pointer"
            title="Download CSV file"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-500" />
            <span>CSV</span>
          </button>
          <button
            id="btn-print-table"
            onClick={handlePrint}
            className="p-2 text-xs font-bold text-neutral-600 dark:text-neutral-400 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-950 dark:hover:bg-neutral-800 border border-neutral-150 dark:border-neutral-800 rounded-xl transition flex items-center gap-1 cursor-pointer"
            title="Print Schedule"
          >
            <Printer className="w-4 h-4 text-blue-500" />
            <span>Print</span>
          </button>
        </div>
      </div>

      {/* Main Table responsive wrap */}
      <div className="overflow-x-auto rounded-3xl border border-neutral-150 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <table className="min-w-full divide-y divide-neutral-150 dark:divide-neutral-800 text-xs text-neutral-700 dark:text-neutral-300">
          <thead className="bg-neutral-50/50 dark:bg-neutral-950/20">
            <tr>
              {tableHeaderCell('paymentNumber', 'No.')}
              {tableHeaderCell('date', 'Payment Date')}
              {tableHeaderCell('beginningBalance', 'Starting Bal')}
              {tableHeaderCell('regularPayment', 'Base PMT')}
              {tableHeaderCell('principal', 'Principal Component')}
              {tableHeaderCell('interest', 'Interest Component')}
              {tableHeaderCell('extraPayment', 'Extra Paid')}
              {tableHeaderCell('endingBalance', 'Ending Bal')}
              {tableHeaderCell('rateApplied', 'Rate APR')}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/60">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((r) => (
                <tr 
                  key={r.paymentNumber}
                  className="hover:bg-blue-500/5 dark:hover:bg-cyan-500/5 transition duration-150"
                >
                  <td className="py-3 px-4 font-bold text-neutral-500 dark:text-neutral-400">
                    {r.paymentNumber}
                  </td>
                  <td className="py-3 px-4 font-extrabold text-neutral-800 dark:text-neutral-200">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 font-medium">
                    ${Math.round(r.beginningBalance).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-semibold text-neutral-900 dark:text-neutral-100">
                    ${Math.round(r.regularPayment).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                    ${Math.round(r.principal).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-rose-500 dark:text-rose-400 font-bold">
                    ${Math.round(r.interest).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-purple-600 dark:text-purple-400 font-bold">
                    {r.extraPayment > 0 ? `$${Math.round(r.extraPayment).toLocaleString()}` : '-'}
                  </td>
                  <td className="py-3 px-4 font-bold text-neutral-900 dark:text-white">
                    ${Math.round(r.endingBalance).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-[10px] font-mono text-neutral-400">
                    {r.rateApplied}%
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="py-12 text-center text-neutral-400 font-medium">
                  No records match your query filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-neutral-50 dark:bg-neutral-950/20 p-4 rounded-2xl border border-neutral-150 dark:border-neutral-800">
        <div className="flex items-center gap-2 text-xs text-neutral-500">
          <span>Show rows:</span>
          <select
            id="page-size-selector"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="py-1 px-2 text-xs rounded-lg border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white focus:outline-none"
          >
            <option value="12">12 (1 Year)</option>
            <option value="24">24 (2 Years)</option>
            <option value="36">36 (3 Years)</option>
            <option value="60">60 (5 Years)</option>
            <option value="100">100</option>
          </select>
          <span className="ml-2">({processedRows.length} total payments found)</span>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="btn-prev-page"
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            id="btn-next-page"
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:pointer-events-none transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
