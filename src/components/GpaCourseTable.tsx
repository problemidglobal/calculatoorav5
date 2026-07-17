import React, { useState } from 'react';
import { Search, Download, Printer, Filter, ChevronUp, ChevronDown, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { Semester, Course, GradeScale } from '../types/gpa';

interface GpaCourseTableProps {
  semesters: Semester[];
  scale: GradeScale;
}

type SortField = 'name' | 'credits' | 'gradePoints' | 'qualityPoints' | 'semester' | 'weightType';
type SortOrder = 'asc' | 'desc';

export default function GpaCourseTable({ semesters, scale }: GpaCourseTableProps) {
  const [search, setSearch] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [weightFilter, setWeightFilter] = useState('all');

  const [sortField, setSortField] = useState<SortField>('semester');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  // Flatten courses with semester context
  const allCoursesWithSemester = semesters.flatMap(s => 
    s.courses.map(c => {
      const cred = parseFloat(c.credits) || 0;
      const match = scale.grades.find(g => g.label === c.grade);
      const gradePts = match ? match.value : parseFloat(c.grade) || 0;
      
      let weightVal = 0;
      if (c.weightType === 'honors' || c.weightType === 'college') {
        weightVal = 0.5;
      } else if (c.weightType === 'ap' || c.weightType === 'ib') {
        weightVal = 1.0;
      } else if (c.weightType === 'custom') {
        weightVal = parseFloat(c.customWeightPoints) || 0;
      }

      const qualityPoints = (gradePts + weightVal) * cred;

      return {
        ...c,
        semesterId: s.id,
        semesterName: s.name,
        semesterYear: s.year,
        gradePoints: gradePts,
        weightVal,
        qualityPoints
      };
    })
  );

  // Apply filters & search
  const filteredCourses = allCoursesWithSemester.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || 
                          c.notes.toLowerCase().includes(search.toLowerCase());
    const matchesSemester = semesterFilter === 'all' || c.semesterId === semesterFilter;
    const matchesCategory = categoryFilter === 'all' || c.category === categoryFilter;
    const matchesWeight = weightFilter === 'all' || c.weightType === weightFilter;

    return matchesSearch && matchesSemester && matchesCategory && matchesWeight;
  });

  // Apply sorting
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    let aVal: any = a[sortField];
    let bVal: any = b[sortField];

    if (sortField === 'semester') {
      aVal = a.semesterName;
      bVal = b.semesterName;
    }

    if (typeof aVal === 'string') {
      return sortOrder === 'asc' 
        ? aVal.localeCompare(bVal) 
        : bVal.localeCompare(aVal);
    } else {
      return sortOrder === 'asc' 
        ? (aVal as number) - (bVal as number) 
        : (bVal as number) - (aVal as number);
    }
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // CSV Export Helper
  const exportToCSV = () => {
    const headers = ['Course Name', 'Credits', 'Grade', 'Grade Points', 'Weight Class', 'Rigor Points', 'Quality Points', 'Semester', 'Category', 'Notes'];
    const rows = filteredCourses.map(c => [
      c.name || 'Unnamed Class',
      c.credits || '0',
      c.grade || 'N/A',
      c.gradePoints.toFixed(2),
      c.weightType.toUpperCase(),
      c.weightVal.toFixed(2),
      c.qualityPoints.toFixed(2),
      c.semesterName || 'N/A',
      c.category || 'N/A',
      c.notes || ''
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `GPA_Course_Catalog_${new Date().getFullYear()}.csv`;
    link.click();
  };

  // Direct Browser Print Trigger
  const handlePrint = () => {
    window.print();
  };

  const uniqueCategories = Array.from(new Set(allCoursesWithSemester.map(c => c.category).filter(Boolean)));

  return (
    <div className="bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-neutral-800 shadow-md space-y-6">
      {/* Table Headers */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            Consolidated Academic Catalog
          </h3>
          <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
            A comprehensive, structured ledger of all entered coursework with multi-metric query controls.
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button
            onClick={exportToCSV}
            disabled={filteredCourses.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Download className="w-4 h-4" />
            CSV Export
          </button>
          <button
            onClick={handlePrint}
            disabled={filteredCourses.length === 0}
            className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-xs transition cursor-pointer disabled:opacity-50 shadow-sm"
          >
            <Printer className="w-4 h-4" />
            Print Report
          </button>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 dark:bg-neutral-950/40 p-4 rounded-xl border border-slate-200 dark:border-neutral-800">
        {/* Full-Text Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#4B5563] dark:text-[#CBD5E1]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search classes or notes..."
            className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-lg pl-9 pr-4 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 transition shadow-sm"
          />
        </div>

        {/* Semester Filter */}
        <div className="relative">
          <select
            value={semesterFilter}
            onChange={(e) => setSemesterFilter(e.target.value)}
            className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] transition shadow-sm"
          >
            <option value="all">All Semesters</option>
            {semesters.map(s => (
              <option key={s.id} value={s.id}>{s.name || 'Unnamed Term'}</option>
            ))}
          </select>
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] transition shadow-sm"
          >
            <option value="all">All Categories</option>
            {uniqueCategories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Weight Rigor Filter */}
        <div className="relative">
          <select
            value={weightFilter}
            onChange={(e) => setWeightFilter(e.target.value)}
            className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-lg px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] transition shadow-sm"
          >
            <option value="all">All Weight Classes</option>
            <option value="none">Standard Unweighted</option>
            <option value="honors">Honors (+0.50)</option>
            <option value="ap">AP (+1.00)</option>
            <option value="ib">IB (+1.00)</option>
            <option value="college">College (+0.50)</option>
            <option value="custom">Custom Weight</option>
          </select>
        </div>
      </div>

      {/* Main Table Grid */}
      <div className="overflow-x-auto border border-slate-200 dark:border-neutral-800 rounded-xl">
        <table className="w-full text-left text-xs text-[#4B5563] dark:text-[#CBD5E1]">
          <thead className="bg-slate-50 dark:bg-neutral-950/40 text-[#111827] dark:text-[#F9FAFB] uppercase font-mono text-[10px] select-none">
            <tr className="divide-x divide-slate-200 dark:divide-neutral-800">
              <th onClick={() => handleSort('name')} className="p-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-neutral-850/50">
                <div className="flex items-center gap-1">
                  Course
                  {sortField === 'name' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th onClick={() => handleSort('credits')} className="p-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-neutral-850/50 text-center w-24">
                <div className="flex items-center justify-center gap-1">
                  Credits
                  {sortField === 'credits' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th onClick={() => handleSort('gradePoints')} className="p-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-neutral-850/50 text-center w-28">
                <div className="flex items-center justify-center gap-1">
                  Grade Points
                  {sortField === 'gradePoints' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th onClick={() => handleSort('weightType')} className="p-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-neutral-850/50 text-center w-28">
                <div className="flex items-center justify-center gap-1">
                  Weight
                  {sortField === 'weightType' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th onClick={() => handleSort('qualityPoints')} className="p-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-neutral-850/50 text-center w-32">
                <div className="flex items-center justify-center gap-1">
                  Quality Points
                  {sortField === 'qualityPoints' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
              <th onClick={() => handleSort('semester')} className="p-3 cursor-pointer hover:bg-slate-200/50 dark:hover:bg-neutral-850/50 w-36">
                <div className="flex items-center gap-1">
                  Semester
                  {sortField === 'semester' && (sortOrder === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />)}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-neutral-800">
            {sortedCourses.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-[#4B5563] dark:text-[#CBD5E1] italic">
                  No courses match the current query criteria.
                </td>
              </tr>
            ) : (
              sortedCourses.map((c, idx) => (
                <tr key={c.id || idx} className="hover:bg-slate-50/40 dark:hover:bg-neutral-950/20 transition-colors divide-x divide-slate-100 dark:divide-neutral-850/20">
                  <td className="p-3">
                    <span className="font-semibold text-[#111827] dark:text-[#F9FAFB] block">
                      {c.name || <span className="text-slate-400 italic">Untitled Course</span>}
                    </span>
                    {c.notes && (
                      <span className="text-[10px] text-[#4B5563] dark:text-[#CBD5E1] font-light block mt-0.5 max-w-xs truncate">
                        {c.notes}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-center font-mono font-bold text-[#374151] dark:text-[#D1D5DB]">
                    {parseFloat(c.credits) ? parseFloat(c.credits).toFixed(1) : '0.0'}
                  </td>
                  <td className="p-3 text-center font-mono">
                    <span className="font-extrabold text-blue-600 dark:text-cyan-400 block">{c.grade || 'N/A'}</span>
                    <span className="text-[9px] text-[#4B5563] dark:text-[#CBD5E1] block">({c.gradePoints.toFixed(2)} pts)</span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                      c.weightType === 'ap' || c.weightType === 'ib'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/30 dark:text-purple-300'
                        : c.weightType !== 'none'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}>
                      {c.weightType === 'none' ? 'unweighted' : `${c.weightType} (+${c.weightVal.toFixed(2)})`}
                    </span>
                  </td>
                  <td className="p-3 text-center font-mono font-extrabold text-[#111827] dark:text-[#F9FAFB]">
                    {c.qualityPoints.toFixed(2)}
                  </td>
                  <td className="p-3">
                    <span className="font-semibold text-[#374151] dark:text-[#D1D5DB] block truncate max-w-[120px]">
                      {c.semesterName || 'Unnamed Semester'}
                    </span>
                    {c.semesterYear && (
                      <span className="text-[10px] text-[#4B5563] dark:text-[#CBD5E1] block">{c.semesterYear}</span>
                    )}
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
