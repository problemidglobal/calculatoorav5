import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';
import { EMIPaymentRow } from '../../utils/emiMath';

interface EMIPaymentsTableProps {
  rows: EMIPaymentRow[];
  currency: string;
}

export default function EMIPaymentsTable({ rows, currency }: EMIPaymentsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [pageSize, setPageSize] = useState<number>(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<keyof EMIPaymentRow | 'paymentNumber'>('paymentNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Handle Sort
  const handleSort = (field: keyof EMIPaymentRow) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Filter & Sort Rows
  const processedRows = useMemo(() => {
    let result = [...rows];

    // Search filter
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        row => 
          row.paymentNumber.toString().includes(term) ||
          row.paymentDate.toLowerCase().includes(term)
      );
    }

    // Sorting
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' 
          ? (valA as string).localeCompare(valB as string) 
          : (valB as string).localeCompare(valA as string);
      } else {
        return sortOrder === 'asc'
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }
    });

    return result;
  }, [rows, searchTerm, sortField, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedRows.length / pageSize) || 1;
  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedRows.slice(start, start + pageSize);
  }, [processedRows, currentPage, pageSize]);

  // Export CSV
  const exportToCSV = () => {
    const headers = [
      'Payment No.',
      'Payment Date',
      'Opening Balance',
      'EMI Payment',
      'Principal Paid',
      'Interest Paid',
      'Extra Payment',
      'Remaining Balance',
      'Running Interest',
      'Running Principal'
    ];

    const csvContent = [
      headers.join(','),
      ...rows.map(row => [
        row.paymentNumber,
        `"${row.paymentDate}"`,
        row.openingBalance.toFixed(2),
        row.emi.toFixed(2),
        row.principalPaid.toFixed(2),
        row.interestPaid.toFixed(2),
        row.extraPayment.toFixed(2),
        row.remainingBalance.toFixed(2),
        row.runningInterest.toFixed(2),
        row.runningPrincipal.toFixed(2)
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `calculatoora_emi_amortization.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print schedule
  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
      {/* Table Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
            Amortization Schedule
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            Analyze, search, and export your detailed periodic payoff log.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-neutral-400" />
            </span>
            <input
              type="text"
              placeholder="Search month or date..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-4 py-2 w-full text-sm bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-cyan-400"
            />
          </div>

          {/* Export buttons */}
          <button
            onClick={exportToCSV}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
            title="Download CSV"
          >
            <Download className="w-4 h-4" />
            CSV
          </button>
          
          <button
            onClick={triggerPrint}
            className="p-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl transition flex items-center gap-1.5 text-xs font-semibold"
            title="Print Schedule"
          >
            <Printer className="w-4 h-4" />
            Print / PDF
          </button>
        </div>
      </div>

      {/* Amortization Table */}
      <div className="overflow-x-auto rounded-2xl border border-neutral-100 dark:border-neutral-800">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400 font-semibold border-b border-neutral-150 dark:border-neutral-800 select-none">
              {[
                { label: 'No.', field: 'paymentNumber' },
                { label: 'Date', field: 'paymentDate' },
                { label: 'Opening Balance', field: 'openingBalance' },
                { label: 'Scheduled EMI', field: 'emi' },
                { label: 'Principal Paid', field: 'principalPaid' },
                { label: 'Interest Paid', field: 'interestPaid' },
                { label: 'Extra Principal', field: 'extraPayment' },
                { label: 'Remaining Balance', field: 'remainingBalance' },
              ].map((col) => (
                <th
                  key={col.label}
                  onClick={() => handleSort(col.field as keyof EMIPaymentRow)}
                  className="px-4 py-3 cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    <ArrowUpDown className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 font-mono text-xs">
            {paginatedRows.length > 0 ? (
              paginatedRows.map((row) => (
                <tr 
                  key={row.paymentNumber} 
                  className={`hover:bg-neutral-50/50 dark:hover:bg-neutral-800/40 transition ${
                    row.extraPayment > 0 ? 'bg-emerald-500/5 dark:bg-emerald-500/10' : ''
                  }`}
                >
                  <td className="px-4 py-2.5 font-bold text-neutral-800 dark:text-neutral-200">{row.paymentNumber}</td>
                  <td className="px-4 py-2.5 font-sans font-medium text-neutral-600 dark:text-neutral-300">{row.paymentDate}</td>
                  <td className="px-4 py-2.5 text-neutral-600 dark:text-neutral-300">{currency}{row.openingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2.5 font-bold text-blue-600 dark:text-cyan-400">{currency}{row.emi.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-200">{currency}{row.principalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className="px-4 py-2.5 text-neutral-700 dark:text-neutral-200">{currency}{row.interestPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td className={`px-4 py-2.5 font-bold ${row.extraPayment > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-neutral-400 dark:text-neutral-600'}`}>
                    {row.extraPayment > 0 ? `+${currency}${row.extraPayment.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
                  </td>
                  <td className="px-4 py-2.5 font-bold text-neutral-800 dark:text-white">{currency}{row.remainingBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center py-8 font-sans text-neutral-400">
                  No records matching the filter. Enter your loan details.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      {processedRows.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-2">
            <span>Show</span>
            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg p-1.5 focus:outline-none"
            >
              {[10, 25, 50, 100, 500].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
            <span>of {processedRows.length} payments</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg disabled:opacity-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3">Page {currentPage} of {totalPages}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 rounded-lg disabled:opacity-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
