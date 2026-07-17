import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Trash2, 
  Copy, 
  ChevronDown, 
  ChevronUp, 
  ArrowUp,
  ArrowDown,
  RefreshCw, 
  Sparkles, 
  BookOpen, 
  Check, 
  AlertCircle, 
  Calendar, 
  Info, 
  Layers, 
  Settings, 
  Edit2,
  FileText
} from 'lucide-react';
import { Course, Semester, GradeScale } from '../types/gpa';
import GpaDashboard from './GpaDashboard';
import GpaPlanner from './GpaPlanner';
import GpaCourseTable from './GpaCourseTable';
import GpaEducative from './GpaEducative';

const DEFAULT_SCALES: GradeScale[] = [
  {
    id: '4.0',
    name: '4.0 Scale (Standard US)',
    max: 4.0,
    grades: [
      { label: 'A+', value: 4.0, minPercent: 97, maxPercent: 100 },
      { label: 'A', value: 4.0, minPercent: 93, maxPercent: 96 },
      { label: 'A-', value: 3.7, minPercent: 90, maxPercent: 92 },
      { label: 'B+', value: 3.3, minPercent: 87, maxPercent: 89 },
      { label: 'B', value: 3.0, minPercent: 83, maxPercent: 86 },
      { label: 'B-', value: 2.7, minPercent: 80, maxPercent: 82 },
      { label: 'C+', value: 2.3, minPercent: 77, maxPercent: 79 },
      { label: 'C', value: 2.0, minPercent: 73, maxPercent: 76 },
      { label: 'C-', value: 1.7, minPercent: 70, maxPercent: 72 },
      { label: 'D+', value: 1.3, minPercent: 67, maxPercent: 69 },
      { label: 'D', value: 1.0, minPercent: 60, maxPercent: 66 },
      { label: 'F', value: 0.0, minPercent: 0, maxPercent: 59 }
    ]
  },
  {
    id: '4.3',
    name: '4.3 Scale (Canada / Cornell)',
    max: 4.3,
    grades: [
      { label: 'A+', value: 4.3, minPercent: 97, maxPercent: 100 },
      { label: 'A', value: 4.0, minPercent: 93, maxPercent: 96 },
      { label: 'A-', value: 3.7, minPercent: 90, maxPercent: 92 },
      { label: 'B+', value: 3.3, minPercent: 87, maxPercent: 89 },
      { label: 'B', value: 3.0, minPercent: 83, maxPercent: 86 },
      { label: 'B-', value: 2.7, minPercent: 80, maxPercent: 82 },
      { label: 'C+', value: 2.3, minPercent: 77, maxPercent: 79 },
      { label: 'C', value: 2.0, minPercent: 73, maxPercent: 76 },
      { label: 'C-', value: 1.7, minPercent: 70, maxPercent: 72 },
      { label: 'D+', value: 1.3, minPercent: 67, maxPercent: 69 },
      { label: 'D', value: 1.0, minPercent: 60, maxPercent: 66 },
      { label: 'F', value: 0.0, minPercent: 0, maxPercent: 59 }
    ]
  },
  {
    id: '5.0',
    name: '5.0 Scale',
    max: 5.0,
    grades: [
      { label: 'A', value: 5.0, minPercent: 90, maxPercent: 100 },
      { label: 'B', value: 4.0, minPercent: 80, maxPercent: 89 },
      { label: 'C', value: 3.0, minPercent: 70, maxPercent: 79 },
      { label: 'D', value: 2.0, minPercent: 60, maxPercent: 69 },
      { label: 'F', value: 0.0, minPercent: 0, maxPercent: 59 }
    ]
  },
  {
    id: '10.0',
    name: '10.0 Point Scale',
    max: 10.0,
    grades: [
      { label: 'O', value: 10.0, minPercent: 90, maxPercent: 100 },
      { label: 'A+', value: 9.0, minPercent: 80, maxPercent: 89 },
      { label: 'A', value: 8.0, minPercent: 70, maxPercent: 79 },
      { label: 'B+', value: 7.0, minPercent: 60, maxPercent: 69 },
      { label: 'B', value: 6.0, minPercent: 50, maxPercent: 59 },
      { label: 'C', value: 5.0, minPercent: 40, maxPercent: 49 },
      { label: 'F', value: 0.0, minPercent: 0, maxPercent: 39 }
    ]
  }
];

export default function GpaCalculator() {
  // State: Scale settings
  const [scaleType, setScaleType] = useState<string>('4.0');
  const [customGrades, setCustomGrades] = useState<GradeScale>({
    id: 'custom',
    name: 'Custom Grade Scale',
    max: 4.0,
    grades: [
      { label: 'A', value: 4.0 },
      { label: 'B', value: 3.0 },
      { label: 'C', value: 2.0 },
      { label: 'D', value: 1.0 },
      { label: 'F', value: 0.0 }
    ]
  });

  // Current active scale helper
  const activeScale: GradeScale = scaleType === 'custom' 
    ? customGrades 
    : DEFAULT_SCALES.find(s => s.id === scaleType) || DEFAULT_SCALES[0];

  // Helper to create an empty, blank course row starting empty
  const createEmptyCourse = (): Course => ({
    id: 'course-' + Math.random().toString(36).substr(2, 9),
    name: '',
    credits: '',
    grade: '',
    weightType: 'none',
    customWeightPoints: '',
    category: 'Math',
    notes: ''
  });

  // State: list of semesters
  const [semesters, setSemesters] = useState<Semester[]>([
    {
      id: 'sem-1',
      name: 'Semester 1',
      year: 'Freshman Year',
      courses: [createEmptyCourse(), createEmptyCourse()]
    }
  ]);

  // Collapsed Semesters track
  const [collapsedSemesters, setCollapsedSemesters] = useState<Record<string, boolean>>({});

  // Prior cumulative values
  const [priorGpa, setPriorGpa] = useState<string>('');
  const [priorCredits, setPriorCredits] = useState<string>('');

  // Target GPA
  const [targetGpa, setTargetGpa] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'dashboard' | 'planner' | 'catalog'>('dashboard');

  // Custom grade scales builder helpers
  const [newCustomLabel, setNewCustomLabel] = useState('');
  const [newCustomValue, setNewCustomValue] = useState('');

  // Validation feedback triggers
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Clear validation when inputs change
  const validateField = (courseId: string, credits: string, grade: string) => {
    const errors = { ...validationErrors };
    const credNum = parseFloat(credits);

    if (credits !== '' && (isNaN(credNum) || credNum < 0)) {
      errors[courseId] = 'Credits must be a positive number';
    } else {
      delete errors[courseId];
    }
    setValidationErrors(errors);
  };

  // Add Course to Semester
  const addCourse = (semId: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: [...sem.courses, createEmptyCourse()]
        };
      }
      return sem;
    }));
  };

  // Duplicate Course row
  const duplicateCourse = (semId: string, course: Course) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: [...sem.courses, { ...course, id: 'course-' + Math.random().toString(36).substr(2, 9) }]
        };
      }
      return sem;
    }));
  };

  // Delete Course
  const deleteCourse = (semId: string, courseId: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: sem.courses.filter(c => c.id !== courseId)
        };
      }
      return sem;
    }));
  };

  // Move Course row up/down (Bulletproof Reorder)
  const moveCourse = (semId: string, index: number, direction: 'up' | 'down') => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        const nextCourses = [...sem.courses];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;
        if (targetIndex >= 0 && targetIndex < nextCourses.length) {
          const temp = nextCourses[index];
          nextCourses[index] = nextCourses[targetIndex];
          nextCourses[targetIndex] = temp;
        }
        return { ...sem, courses: nextCourses };
      }
      return sem;
    }));
  };

  // Update Course fields
  const updateCourseField = (semId: string, courseId: string, field: keyof Course, value: any) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        return {
          ...sem,
          courses: sem.courses.map(c => {
            if (c.id === courseId) {
              const updated = { ...c, [field]: value };
              if (field === 'credits' || field === 'grade') {
                validateField(courseId, updated.credits, updated.grade);
              }
              return updated;
            }
            return c;
          })
        };
      }
      return sem;
    }));
  };

  // Add Semester
  const addSemester = () => {
    const newSemId = 'sem-' + (semesters.length + 1);
    setSemesters(prev => [
      ...prev,
      {
        id: newSemId,
        name: `Semester ${semesters.length + 1}`,
        year: 'Academic Year',
        courses: [createEmptyCourse(), createEmptyCourse()]
      }
    ]);
  };

  // Duplicate Semester
  const duplicateSemester = (sem: Semester) => {
    const newSemId = 'sem-' + Math.random().toString(36).substr(2, 9);
    setSemesters(prev => [
      ...prev,
      {
        ...sem,
        id: newSemId,
        name: `${sem.name} (Copy)`,
        courses: sem.courses.map(c => ({ ...c, id: 'course-' + Math.random().toString(36).substr(2, 9) }))
      }
    ]);
  };

  // Delete Semester
  const deleteSemester = (semId: string) => {
    setSemesters(prev => prev.filter(s => s.id !== semId));
  };

  // Update Semester names
  const updateSemesterMeta = (semId: string, field: 'name' | 'year', value: string) => {
    setSemesters(prev => prev.map(sem => {
      if (sem.id === semId) {
        return { ...sem, [field]: value };
      }
      return sem;
    }));
  };

  // Toggle Collapse Semester
  const toggleCollapseSemester = (semId: string) => {
    setCollapsedSemesters(prev => ({
      ...prev,
      [semId]: !prev[semId]
    }));
  };

  // Add custom grade point mapping
  const addCustomGradeRow = () => {
    const val = parseFloat(newCustomValue);
    if (!newCustomLabel || isNaN(val) || val < 0) return;

    setCustomGrades(prev => {
      const grades = [...prev.grades, { label: newCustomLabel.toUpperCase(), value: val }];
      const sorted = grades.sort((a, b) => b.value - a.value);
      const maxVal = Math.max(...sorted.map(g => g.value), 4.0);
      return {
        ...prev,
        max: maxVal,
        grades: sorted
      };
    });
    setNewCustomLabel('');
    setNewCustomValue('');
  };

  // Delete custom grade point mapping
  const deleteCustomGradeRow = (label: string) => {
    setCustomGrades(prev => {
      const remaining = prev.grades.filter(g => g.label !== label);
      return {
        ...prev,
        grades: remaining
      };
    });
  };

  // LOAD EXAMPLE DATA (Populates realistic academic transcript)
  const handleLoadExample = () => {
    setScaleType('4.0');
    setPriorGpa('3.60');
    setPriorCredits('45');
    setTargetGpa('3.75');

    setSemesters([
      {
        id: 'ex-sem-1',
        name: 'Fall Term',
        year: 'Sophomore Year',
        courses: [
          {
            id: 'ex-c1',
            name: 'Organic Chemistry I',
            credits: '4',
            grade: 'A-',
            weightType: 'college',
            customWeightPoints: '',
            category: 'Science',
            notes: 'Fulfills major core corequisite'
          },
          {
            id: 'ex-c2',
            name: 'Linear Algebra',
            credits: '3',
            grade: 'A',
            weightType: 'none',
            customWeightPoints: '',
            category: 'Math',
            notes: 'Elective focus option'
          },
          {
            id: 'ex-c3',
            name: 'Intro to Philosophy',
            credits: '3',
            grade: 'B+',
            weightType: 'none',
            customWeightPoints: '',
            category: 'Humanities',
            notes: 'Writing intensive gen-ed'
          },
          {
            id: 'ex-c4',
            name: 'AP European History',
            credits: '3',
            grade: 'B',
            weightType: 'ap',
            customWeightPoints: '',
            category: 'Humanities',
            notes: 'High school transition credit'
          }
        ]
      },
      {
        id: 'ex-sem-2',
        name: 'Spring Term',
        year: 'Sophomore Year',
        courses: [
          {
            id: 'ex-c5',
            name: 'Computer Science II',
            credits: '4',
            grade: 'A',
            weightType: 'college',
            customWeightPoints: '',
            category: 'Engineering',
            notes: 'Coding-heavy laboratory'
          },
          {
            id: 'ex-c6',
            name: 'Discrete Mathematics',
            credits: '3',
            grade: 'A-',
            weightType: 'none',
            customWeightPoints: '',
            category: 'Math',
            notes: 'Rigorous proof logic'
          },
          {
            id: 'ex-c7',
            name: 'Physics Lab',
            credits: '1',
            grade: 'A+',
            weightType: 'honors',
            customWeightPoints: '',
            category: 'Science',
            notes: 'Experimental optics'
          }
        ]
      }
    ]);
  };

  // CLEAR ALL DATA (Empties all inputs and lists completely)
  const handleClearAll = () => {
    setPriorGpa('');
    setPriorCredits('');
    setTargetGpa('');
    setValidationErrors({});
    setSemesters([
      {
        id: 'sem-1',
        name: 'Semester 1',
        year: 'Academic Year',
        courses: [
          {
            id: 'clr-c1',
            name: '',
            credits: '',
            grade: '',
            weightType: 'none',
            customWeightPoints: '',
            category: 'Math',
            notes: ''
          }
        ]
      }
    ]);
  };

  return (
    <div className="space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      
      {/* Grade Scale Selection & Setup */}
      <div className="bg-white/88 dark:bg-[#12141c]/88 border border-slate-200/60 dark:border-neutral-800/60 shadow-xl backdrop-blur-sm p-8 rounded-3xl space-y-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black text-[#111827] dark:text-[#F9FAFB] tracking-tight flex items-center gap-2">
              <GraduationCap className="w-8 h-8 text-blue-500" />
              Scale Setup & Prior Metrics
            </h2>
            <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] max-w-xl">
              Establish your primary grading system, target benchmarks, and any previous accumulated history before entering semesters.
            </p>
          </div>

          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={handleLoadExample}
              className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-4 py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/30 font-bold rounded-2xl text-xs transition active:scale-95 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {/* Grade Scale Select */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-blue-500" />
              Select Grade Scale
            </label>
            <select
              value={scaleType}
              onChange={(e) => setScaleType(e.target.value)}
              className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm transition"
            >
              <option value="4.0">4.0 Scale (Standard)</option>
              <option value="4.3">4.3 Scale</option>
              <option value="5.0">5.0 Scale</option>
              <option value="10.0">10 Point Scale</option>
              <option value="custom">Custom Scale Builder</option>
            </select>
          </div>

          {/* Prior Cumulative GPA */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-500" />
              Prior Cumulative GPA
            </label>
            <input
              type="number"
              step="0.01"
              value={priorGpa}
              onChange={(e) => setPriorGpa(e.target.value)}
              placeholder="e.g. 3.45"
              className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm transition"
            />
          </div>

          {/* Prior Total Credits */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-500" />
              Prior Total Credits
            </label>
            <input
              type="number"
              step="1"
              value={priorCredits}
              onChange={(e) => setPriorCredits(e.target.value)}
              placeholder="e.g. 64"
              className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm transition"
            />
          </div>

          {/* Goal/Target GPA */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              Target Goal GPA
            </label>
            <input
              type="number"
              step="0.01"
              value={targetGpa}
              onChange={(e) => setTargetGpa(e.target.value)}
              placeholder="e.g. 3.80"
              className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm transition"
            />
          </div>
        </div>

        {/* Custom Scale Builder Subpanel */}
        {scaleType === 'custom' && (
          <div className="bg-slate-50 dark:bg-neutral-950 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-1.5">
              <Edit2 className="w-4 h-4 text-blue-500" />
              Custom Scale Point Builder
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
              Create your own grading mapping. Letters will automatically populate the course selection dropdowns in the panels below.
            </p>

            <div className="flex flex-col sm:flex-row items-end gap-3 max-w-lg">
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider">Grade Symbol</span>
                <input
                  type="text"
                  value={newCustomLabel}
                  onChange={(e) => setNewCustomLabel(e.target.value)}
                  placeholder="e.g. A++"
                  className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <div className="space-y-1 flex-1">
                <span className="text-[10px] font-bold text-[#374151] dark:text-[#D1D5DB] uppercase tracking-wider">Point Value</span>
                <input
                  type="number"
                  step="0.1"
                  value={newCustomValue}
                  onChange={(e) => setNewCustomValue(e.target.value)}
                  placeholder="e.g. 4.5"
                  className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                />
              </div>
              <button
                type="button"
                onClick={addCustomGradeRow}
                className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl text-xs shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                Add Mapping
              </button>
            </div>

            {/* Custom Scales List */}
            <div className="flex flex-wrap gap-2 pt-2">
              {customGrades.grades.map((g) => (
                <div key={g.label} className="flex items-center gap-2 bg-white dark:bg-neutral-800 border border-slate-200 dark:border-neutral-700 px-3 py-1.5 rounded-xl text-xs shadow-sm">
                  <span className="font-bold text-[#111827] dark:text-[#F9FAFB]">{g.label}</span>
                  <span className="text-blue-500 dark:text-cyan-400 font-mono">({g.value.toFixed(2)})</span>
                  <button
                    onClick={() => deleteCustomGradeRow(g.label)}
                    className="text-slate-400 hover:text-rose-500 transition ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Active Study Semesters Section - Full Width */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#F9FAFB] flex items-center gap-2 tracking-tight">
              <BookOpen className="w-6 h-6 text-blue-500" />
              Active Study Semesters
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
              Manage distinct study terms and register courses within each semester block.
            </p>
          </div>
          <button
            onClick={addSemester}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-2xl text-xs shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Semester
          </button>
        </div>

        {semesters.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 dark:border-neutral-800 rounded-3xl bg-white/50 dark:bg-neutral-900/10">
            <Calendar className="w-10 h-10 text-slate-400 dark:text-neutral-500 mb-2" />
            <h5 className="font-bold text-[#111827] dark:text-[#F9FAFB] text-sm">No Active Semesters</h5>
            <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] max-w-xs mt-1">
              Your academic timeline is empty. Add a semester to begin registering classes.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {semesters.map((sem) => {
              const isCollapsed = !!collapsedSemesters[sem.id];
              return (
                <div 
                  key={sem.id} 
                  className="bg-white/88 dark:bg-[#12141c]/88 backdrop-blur-sm border border-slate-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-md transition-all duration-250"
                >
                  {/* Semester Header Card */}
                  <div className="bg-slate-50/60 dark:bg-neutral-950/40 px-5 py-4 border-b border-slate-200 dark:border-neutral-800/80 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <button
                        onClick={() => toggleCollapseSemester(sem.id)}
                        className="p-1 hover:bg-slate-200/50 dark:hover:bg-neutral-800 rounded transition text-[#4B5563] dark:text-[#CBD5E1]"
                      >
                        {isCollapsed ? <ChevronDown className="w-4.5 h-4.5" /> : <ChevronUp className="w-4.5 h-4.5" />}
                      </button>
                      
                      {/* Name input */}
                      <input
                        type="text"
                        value={sem.name}
                        onChange={(e) => updateSemesterMeta(sem.id, 'name', e.target.value)}
                        placeholder="e.g. Fall 2026"
                        className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-neutral-700 focus:border-blue-500 focus:outline-none font-extrabold text-[#111827] dark:text-[#F9FAFB] text-base py-0.5 max-w-[140px] focus:scale-[1.02] transition"
                      />

                      <span className="text-slate-300 dark:text-neutral-700">/</span>

                      {/* Year input */}
                      <input
                        type="text"
                        value={sem.year}
                        onChange={(e) => updateSemesterMeta(sem.id, 'year', e.target.value)}
                        placeholder="e.g. Sophomore Year"
                        className="bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-neutral-700 focus:border-blue-500 focus:outline-none text-xs font-semibold text-[#4B5563] dark:text-[#CBD5E1] py-0.5 max-w-[120px]"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-end">
                      <button
                        onClick={() => addCourse(sem.id)}
                        className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 font-bold rounded-xl text-[10px] transition cursor-pointer shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Class
                      </button>
                      <button
                        onClick={() => duplicateSemester(sem)}
                        className="p-1.5 bg-white hover:bg-slate-50 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400 rounded-xl transition cursor-pointer shadow-sm"
                        title="Duplicate Semester"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => deleteSemester(sem.id)}
                        className="p-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/20 dark:hover:bg-rose-950/30 border border-rose-200 dark:border-rose-900/30 text-rose-500 rounded-xl transition cursor-pointer shadow-sm"
                        title="Delete Semester"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Course rows container */}
                  {!isCollapsed && (
                    <div className="p-4 space-y-4 bg-white/40 dark:bg-[#12141c]/20">
                      {sem.courses.length === 0 ? (
                        <div className="py-8 text-center text-[#4B5563] dark:text-[#CBD5E1] text-xs italic">
                          No courses in this semester yet. Click "Add Class" above.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {sem.courses.map((course, index) => {
                            const err = validationErrors[course.id];
                            return (
                              <div 
                                key={course.id} 
                                className={`p-4 bg-slate-50/50 dark:bg-neutral-950/20 border rounded-xl space-y-3 relative transition-all ${
                                  err ? 'border-rose-400 dark:border-rose-900/40 bg-rose-500/5' : 'border-slate-200 dark:border-neutral-800/60'
                                }`}
                              >
                                {/* First Line inputs */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                                  {/* Reorder up/down handles */}
                                  <div className="sm:col-span-1 flex sm:flex-col gap-1 shrink-0 items-center justify-start sm:justify-center">
                                    <button
                                      disabled={index === 0}
                                      onClick={() => moveCourse(sem.id, index, 'up')}
                                      className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-850 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                                    >
                                      <ArrowUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      disabled={index === sem.courses.length - 1}
                                      onClick={() => moveCourse(sem.id, index, 'down')}
                                      className="p-1 hover:bg-slate-200 dark:hover:bg-neutral-850 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 disabled:opacity-20 cursor-pointer"
                                    >
                                      <ArrowDown className="w-3.5 h-3.5" />
                                    </button>
                                  </div>

                                  {/* Course Name */}
                                  <div className="sm:col-span-4 space-y-1">
                                    <input
                                      type="text"
                                      value={course.name}
                                      onChange={(e) => updateCourseField(sem.id, course.id, 'name', e.target.value)}
                                      placeholder="e.g. Calculus I"
                                      className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm transition"
                                    />
                                  </div>

                                  {/* Credits */}
                                  <div className="sm:col-span-2 space-y-1">
                                    <input
                                      type="number"
                                      min="0"
                                      step="0.5"
                                      value={course.credits}
                                      onChange={(e) => updateCourseField(sem.id, course.id, 'credits', e.target.value)}
                                      placeholder="Credits"
                                      className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] text-center font-mono placeholder-slate-400 dark:placeholder-neutral-500 shadow-sm transition"
                                    />
                                  </div>

                                  {/* Grade Select */}
                                  <div className="sm:col-span-2 space-y-1">
                                    <select
                                      value={course.grade}
                                      onChange={(e) => updateCourseField(sem.id, course.id, 'grade', e.target.value)}
                                      className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] shadow-sm transition"
                                    >
                                      <option value="">Grade</option>
                                      {activeScale.grades.map((g) => (
                                        <option key={g.label} value={g.label}>
                                          {g.label} ({g.value.toFixed(1)})
                                        </option>
                                      ))}
                                    </select>
                                  </div>

                                  {/* Weight selector */}
                                  <div className="sm:col-span-2 space-y-1">
                                    <select
                                      value={course.weightType}
                                      onChange={(e) => updateCourseField(sem.id, course.id, 'weightType', e.target.value)}
                                      className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 text-[#111827] dark:text-[#F9FAFB] shadow-sm transition"
                                    >
                                      <option value="none">Rigor (None)</option>
                                      <option value="honors">Honors (+0.5)</option>
                                      <option value="ap">AP (+1.0)</option>
                                      <option value="ib">IB (+1.0)</option>
                                      <option value="college">College (+0.5)</option>
                                      <option value="custom">Custom</option>
                                    </select>
                                  </div>

                                  {/* Duplicate / Delete Course Row */}
                                  <div className="sm:col-span-1 flex gap-2 shrink-0 justify-end">
                                    <button
                                      onClick={() => duplicateCourse(sem.id, course)}
                                      className="p-1.5 hover:bg-slate-200 dark:hover:bg-neutral-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer"
                                      title="Duplicate Class"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>
                                    <button
                                      onClick={() => deleteCourse(sem.id, course.id)}
                                      className="p-1.5 hover:bg-rose-100 dark:hover:bg-rose-950/40 text-slate-400 hover:text-rose-500 rounded-lg cursor-pointer"
                                      title="Delete Class"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                {/* Second Line inputs for custom weight and categories */}
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-2 border-t border-slate-200 dark:border-neutral-800/60">
                                  {/* Category selection */}
                                  <div className="sm:col-start-2 sm:col-span-3 space-y-1">
                                    <select
                                      value={course.category}
                                      onChange={(e) => updateCourseField(sem.id, course.id, 'category', e.target.value)}
                                      className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-[10px] font-semibold text-[#374151] dark:text-[#D1D5DB] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    >
                                      <option value="Math">Math</option>
                                      <option value="Science">Science</option>
                                      <option value="Humanities">Humanities</option>
                                      <option value="Arts">Arts</option>
                                      <option value="Engineering">Engineering</option>
                                      <option value="Language">Language</option>
                                      <option value="Business">Business</option>
                                      <option value="Other">Other Category</option>
                                    </select>
                                  </div>

                                  {/* Notes field */}
                                  <div className="sm:col-span-5 space-y-1">
                                    <input
                                      type="text"
                                      value={course.notes}
                                      onChange={(e) => updateCourseField(sem.id, course.id, 'notes', e.target.value)}
                                      placeholder="e.g. Needs B+ for engineering major requirement"
                                      className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-2.5 py-1.5 text-[10px] font-medium text-[#4B5563] dark:text-[#CBD5E1] placeholder-slate-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                    />
                                  </div>

                                  {/* Custom weight modifier input (if "custom" is selected) */}
                                  {course.weightType === 'custom' && (
                                    <div className="sm:col-span-3 space-y-1">
                                      <input
                                        type="number"
                                        step="0.1"
                                        value={course.customWeightPoints}
                                        onChange={(e) => updateCourseField(sem.id, course.id, 'customWeightPoints', e.target.value)}
                                        placeholder="Points e.g. 0.75"
                                        className="w-full bg-white dark:bg-[#12141c] border border-slate-300 dark:border-neutral-700 rounded-xl px-2 py-1.5 text-[10px] font-semibold text-[#111827] dark:text-[#F9FAFB] focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* Validation error banner */}
                                {err && (
                                  <div className="text-[10px] font-bold text-rose-500 flex items-center gap-1">
                                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                    {err}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Performance & Planning Hub - Stacked, Full Width Below */}
      <div className="space-y-6 pt-8 border-t border-slate-200 dark:border-neutral-800/80">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-[#111827] dark:text-[#F9FAFB] tracking-tight">
              Performance & Planning Hub
            </h3>
            <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1]">
              Analyze your performance, simulate GPA scenarios, and view your consolidated course ledger.
            </p>
          </div>

          {/* Navigation Panel Tabs */}
          <div className="bg-slate-100 dark:bg-neutral-800/60 p-1 rounded-2xl flex border border-slate-200 dark:border-neutral-850/80 min-w-[320px] w-full sm:w-auto self-stretch sm:self-auto">
            {[
              { id: 'dashboard', name: 'Dashboard' },
              { id: 'planner', name: 'What-If Planner' },
              { id: 'catalog', name: 'Raw Catalog' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white dark:bg-neutral-700 text-[#111827] dark:text-[#F9FAFB] shadow-md'
                    : 'text-[#4B5563] hover:text-[#111827] dark:text-[#CBD5E1] dark:hover:text-[#F9FAFB]'
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content rendering */}
        <div className="transition-all duration-300">
          {activeTab === 'dashboard' && (
            <GpaDashboard 
              semesters={semesters} 
              scale={activeScale} 
              priorGpa={priorGpa}
              priorCredits={priorCredits}
              targetGpa={targetGpa}
            />
          )}

          {activeTab === 'planner' && (
            <GpaPlanner 
              scale={activeScale} 
              priorGpa={priorGpa}
              priorCredits={priorCredits}
              semesters={semesters}
            />
          )}

          {activeTab === 'catalog' && (
            <GpaCourseTable 
              semesters={semesters} 
              scale={activeScale}
            />
          )}
        </div>
      </div>

      {/* Structured educational guidance */}
      <GpaEducative />
    </div>
  );
}
