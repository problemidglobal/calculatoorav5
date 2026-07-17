import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, 
  Baby, 
  Clock, 
  Sparkles, 
  Trash2, 
  Download, 
  ChevronRight, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle, 
  AlertCircle, 
  HelpCircle, 
  Activity, 
  ArrowRight, 
  Info, 
  Heart, 
  Compass, 
  Scale, 
  Utensils, 
  Dumbbell, 
  Moon, 
  TrendingUp, 
  ExternalLink,
  List,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';
import { WEEKLY_DEVELOPMENT, WeekData } from '../data/pregnancyWeeklyData';

interface PregnancyCalculatorProps {
  onNavigate: (page: string) => void;
}

export default function PregnancyCalculator({ onNavigate }: PregnancyCalculatorProps) {
  // Navigation sub-tabs
  const [activeTab, setActiveTab] = useState<'tracker' | 'planner' | 'weight' | 'education'>('tracker');

  // Input states starting strictly EMPTY
  const [method, setMethod] = useState<'lmp' | 'conception' | 'ivf' | 'ultrasound' | 'duedate'>('lmp');
  const [lmpDate, setLmpDate] = useState<string>('');
  const [conceptionDate, setConceptionDate] = useState<string>('');
  const [ivfDate, setIvfDate] = useState<string>('');
  const [ivfType, setIvfType] = useState<'day3' | 'day5'>('day5');
  const [ultrasoundDate, setUltrasoundDate] = useState<string>('');
  const [ultrasoundWeeks, setUltrasoundWeeks] = useState<string>('');
  const [ultrasoundDays, setUltrasoundDays] = useState<string>('');
  const [dueDateInput, setDueDateInput] = useState<string>('');

  // Optional Inputs
  const [cycleLength, setCycleLength] = useState<string>(''); // Default empty, allowed 20-45
  const [maternalAge, setMaternalAge] = useState<string>('');
  const [prePregnancyWeight, setPrePregnancyWeight] = useState<string>('');
  const [currentWeight, setCurrentWeight] = useState<string>('');
  const [maternalHeight, setMaternalHeight] = useState<string>('');
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('imperial');

  // Validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  // Timeline & active week selection
  const [selectedWeekNum, setSelectedWeekNum] = useState<number>(28); // Default exploring week

  // Interactive FAQ / Accordion index
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Print/Download ref
  const captureRef = useRef<HTMLDivElement | null>(null);

  // Time ticking for countdown
  const [now, setNow] = useState<Date>(new Date());
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Safe local date parser to avoid timezone shift
  const parseLocalDate = (dateStr: string) => {
    if (!dateStr) return null;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDateLabel = (date: Date | null) => {
    if (!date) return 'N/A';
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // MAIN PREGNANCY CALCULATOR RESOLUTION LOGIC
  const calculatePregnancy = () => {
    let edd: Date | null = null;
    let eqLmp: Date | null = null; // Equivalent LMP date (standardized start)

    const cycleDays = cycleLength ? Number(cycleLength) : 28;

    // Guard cycle length
    if (cycleLength && (cycleDays < 20 || cycleDays > 45)) {
      // Handled in validation but fallback check
    }

    if (method === 'lmp' && lmpDate) {
      const lmp = parseLocalDate(lmpDate);
      if (lmp) {
        // Medical formula: EDD = LMP + 280 days + (CycleLength - 28)
        const totalDaysToDue = 280 + (cycleDays - 28);
        edd = new Date(lmp.getTime());
        edd.setDate(edd.getDate() + totalDaysToDue);

        // Equivalent LMP standard is: EDD - 280
        eqLmp = new Date(edd.getTime());
        eqLmp.setDate(eqLmp.getDate() - 280);
      }
    } else if (method === 'conception' && conceptionDate) {
      const conception = parseLocalDate(conceptionDate);
      if (conception) {
        // EDD = Conception + 266 days
        edd = new Date(conception.getTime());
        edd.setDate(edd.getDate() + 266);

        // Equivalent LMP = Conception - 14 days
        eqLmp = new Date(conception.getTime());
        eqLmp.setDate(eqLmp.getDate() - 14);
      }
    } else if (method === 'ivf' && ivfDate) {
      const transfer = parseLocalDate(ivfDate);
      if (transfer) {
        edd = new Date(transfer.getTime());
        if (ivfType === 'day3') {
          // EDD = Transfer + 263 days
          edd.setDate(edd.getDate() + 263);
          eqLmp = new Date(transfer.getTime());
          eqLmp.setDate(eqLmp.getDate() - 17);
        } else {
          // EDD = Transfer + 261 days
          edd.setDate(edd.getDate() + 261);
          eqLmp = new Date(transfer.getTime());
          eqLmp.setDate(eqLmp.getDate() - 19);
        }
      }
    } else if (method === 'ultrasound' && ultrasoundDate && ultrasoundWeeks) {
      const usDate = parseLocalDate(ultrasoundDate);
      const usW = Number(ultrasoundWeeks) || 0;
      const usD = Number(ultrasoundDays) || 0;
      
      if (usDate) {
        const usGestationInDays = (usW * 7) + usD;
        
        // Equivalent LMP = Ultrasound Date - usGestationInDays
        eqLmp = new Date(usDate.getTime());
        eqLmp.setDate(eqLmp.getDate() - usGestationInDays);

        // EDD = Equivalent LMP + 280 days
        edd = new Date(eqLmp.getTime());
        edd.setDate(edd.getDate() + 280);
      }
    } else if (method === 'duedate' && dueDateInput) {
      const due = parseLocalDate(dueDateInput);
      if (due) {
        edd = due;
        eqLmp = new Date(edd.getTime());
        eqLmp.setDate(eqLmp.getDate() - 280);
      }
    }

    if (!edd || !eqLmp) return null;

    // Calculate details relative to today (or local timezone target date)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const msDiff = today.getTime() - eqLmp.getTime();
    const daysPregnant = Math.floor(msDiff / (1000 * 60 * 60 * 24));

    const totalPregnancyDays = 280;
    const daysRemaining = Math.max(0, totalPregnancyDays - daysPregnant);
    const weeksPregnant = Math.floor(daysPregnant / 7);
    const remainingDaysInWeek = daysPregnant % 7;

    const currentWeekNum = Math.max(1, Math.min(42, weeksPregnant + 1));
    const progressPercent = Math.min(100, Math.max(0, (daysPregnant / totalPregnancyDays) * 100));

    // Trimesters:
    // T1: 1 - 13 weeks (days 0 to 97)
    // T2: 14 - 27 weeks (days 98 to 195)
    // T3: 28+ weeks (days 196 to 280+)
    let trimesterName = 'First';
    let trimesterProgress = 0;
    if (daysPregnant >= 196) {
      trimesterName = 'Third';
      trimesterProgress = Math.min(100, ((daysPregnant - 196) / 84) * 100);
    } else if (daysPregnant >= 98) {
      trimesterName = 'Second';
      trimesterProgress = Math.min(100, ((daysPregnant - 98) / 98) * 100);
    } else {
      trimesterName = 'First';
      trimesterProgress = Math.min(100, (daysPregnant / 98) * 100);
    }

    // Pregnancy Month Calculation (Standard obstetric month averages 4.4 weeks / 31 days)
    // Month 1: Weeks 1-4, Month 2: Weeks 5-8, Month 3: Weeks 9-13, Month 4: Weeks 14-17,
    // Month 5: Weeks 18-21, Month 6: Weeks 22-25, Month 7: Weeks 26-30, Month 8: Weeks 31-35, Month 9: Weeks 36-40
    let currentMonth = 1;
    if (currentWeekNum >= 36) currentMonth = 9;
    else if (currentWeekNum >= 31) currentMonth = 8;
    else if (currentWeekNum >= 26) currentMonth = 7;
    else if (currentWeekNum >= 22) currentMonth = 6;
    else if (currentWeekNum >= 18) currentMonth = 5;
    else if (currentWeekNum >= 14) currentMonth = 4;
    else if (currentWeekNum >= 9) currentMonth = 3;
    else if (currentWeekNum >= 5) currentMonth = 2;

    // Trimester dates
    const t1Start = new Date(eqLmp.getTime());
    const t1End = new Date(eqLmp.getTime());
    t1End.setDate(t1End.getDate() + 97); // 13 weeks 6 days

    const t2Start = new Date(t1End.getTime());
    t2Start.setDate(t2Start.getDate() + 1);
    const t2End = new Date(eqLmp.getTime());
    t2End.setDate(t2End.getDate() + 195); // 27 weeks 6 days

    const t3Start = new Date(t2End.getTime());
    t3Start.setDate(t3Start.getDate() + 1);
    const t3End = new Date(edd.getTime());

    // Milestones Dates
    const milestones = {
      heartbeat: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 35); // 5 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 42); // 6 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      firstTrimesterEnd: formatDateLabel(t1End),
      anatomyScan: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 126); // 18 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 154); // 22 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      viability: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 168); // 24 weeks
        return formatDateLabel(d);
      })(),
      thirdTrimesterStart: formatDateLabel(t3Start),
      fullTerm: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 259); // 37 weeks
        return formatDateLabel(d);
      })(),
      dueDate: formatDateLabel(edd),
      postTerm: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 294); // 42 weeks
        return formatDateLabel(d);
      })()
    };

    // Appointment Planner Dates
    const planner = {
      firstPrenatal: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 56); // 8 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 84); // 12 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      nuchalScan: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 77); // 11 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 95); // 13 weeks 4 days
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      anatomyScan: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 126); // 18 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 154); // 22 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      glucoseScreening: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 168); // 24 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 196); // 28 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      gbsTest: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 245); // 35 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 259); // 37 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      growthScan: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 224); // 32 weeks
        const d2 = new Date(eqLmp.getTime());
        d2.setDate(d2.getDate() + 252); // 36 weeks
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })(),
      finalCheckups: (() => {
        const d = new Date(eqLmp.getTime());
        d.setDate(d.getDate() + 266); // 38 weeks
        const d2 = new Date(edd.getTime());
        return `${formatDateLabel(d)} - ${formatDateLabel(d2)}`;
      })()
    };

    return {
      edd,
      eqLmp,
      daysPregnant,
      daysRemaining,
      weeksPregnant,
      remainingDaysInWeek,
      currentWeekNum,
      progressPercent,
      trimesterName,
      trimesterProgress,
      currentMonth,
      trimesters: {
        t1: { start: t1Start, end: t1End },
        t2: { start: t2Start, end: t2End },
        t3: { start: t3Start, end: t3End }
      },
      milestones,
      planner
    };
  };

  const calcResults = calculatePregnancy();

  // Dynamically set timeline week if results are calculated and it hasn't been manually set
  useEffect(() => {
    if (calcResults) {
      setSelectedWeekNum(calcResults.currentWeekNum);
    }
  }, [calcResults?.currentWeekNum]);

  // Sync inputs validation
  useEffect(() => {
    const errors: Record<string, string> = {};
    if (cycleLength) {
      const cycleDays = Number(cycleLength);
      if (isNaN(cycleDays) || cycleDays < 20 || cycleDays > 45) {
        errors.cycleLength = "Cycle length must be between 20 and 45 days.";
      }
    }
    if (maternalAge) {
      const age = Number(maternalAge);
      if (isNaN(age) || age < 12 || age > 60) {
        errors.maternalAge = "Maternal age should be a realistic range (12 - 60).";
      }
    }
    setValidationErrors(errors);
  }, [cycleLength, maternalAge]);

  // Load realistic pregnancy example
  const handleLoadExample = () => {
    // Let's set the method to 'lmp' and load a date that puts them at week ~24
    // Week 24 = 24 * 7 = 168 days ago.
    const exampleLmp = new Date();
    exampleLmp.setDate(exampleLmp.getDate() - 165); // approx 23.5 weeks
    
    // Format to YYYY-MM-DD
    const yyyy = exampleLmp.getFullYear();
    const mm = String(exampleLmp.getMonth() + 1).padStart(2, '0');
    const dd = String(exampleLmp.getDate()).padStart(2, '0');
    
    setMethod('lmp');
    setLmpDate(`${yyyy}-${mm}-${dd}`);
    setCycleLength('28');
    setMaternalAge('31');
    setPrePregnancyWeight('140');
    setCurrentWeight('155');
    setMaternalHeight('64'); // 5ft 4in
    setUnitSystem('imperial');
    setActiveTab('tracker');
  };

  // Clear all fields
  const handleClearAll = () => {
    setLmpDate('');
    setConceptionDate('');
    setIvfDate('');
    setIvfType('day5');
    setUltrasoundDate('');
    setUltrasoundWeeks('');
    setUltrasoundDays('');
    setDueDateInput('');
    setCycleLength('');
    setMaternalAge('');
    setPrePregnancyWeight('');
    setCurrentWeight('');
    setMaternalHeight('');
    setSelectedWeekNum(28);
    setValidationErrors({});
  };

  // WHO BMI Calculation & Weight Gain Guidelines
  const getBmiResults = () => {
    const w = Number(prePregnancyWeight);
    const h = Number(maternalHeight);
    if (!w || !h) return null;

    let bmi = 0;
    if (unitSystem === 'metric') {
      // metric: kg, cm
      const heightM = h / 100;
      bmi = w / (heightM * heightM);
    } else {
      // imperial: lbs, inches
      bmi = (w / (h * h)) * 703;
    }

    let category = 'Normal';
    let rangeLbs = '25 – 35';
    let rangeKg = '11.5 – 16';
    let weeklyLbs = '0.8 – 1.0';
    let weeklyKg = '0.35 – 0.45';

    if (bmi < 18.5) {
      category = 'Underweight';
      rangeLbs = '28 – 40';
      rangeKg = '12.5 – 18';
      weeklyLbs = '1.0 – 1.3';
      weeklyKg = '0.45 – 0.6';
    } else if (bmi >= 25 && bmi < 30) {
      category = 'Overweight';
      rangeLbs = '15 – 25';
      rangeKg = '7 – 11.5';
      weeklyLbs = '0.5 – 0.7';
      weeklyKg = '0.23 – 0.33';
    } else if (bmi >= 30) {
      category = 'Obese';
      rangeLbs = '11 – 20';
      rangeKg = '5 – 9';
      weeklyLbs = '0.4 – 0.6';
      weeklyKg = '0.18 – 0.27';
    }

    const currentW = Number(currentWeight);
    let actualGain = 0;
    if (currentW && w) {
      actualGain = currentW - w;
    }

    return {
      bmi: Number(bmi.toFixed(1)),
      category,
      range: unitSystem === 'imperial' ? `${rangeLbs} lbs` : `${rangeKg} kg`,
      weekly: unitSystem === 'imperial' ? `${weeklyLbs} lbs` : `${weeklyKg} kg`,
      rangeMin: unitSystem === 'imperial' ? Number(rangeLbs.split(' – ')[0]) : Number(rangeKg.split(' – ')[0]),
      rangeMax: unitSystem === 'imperial' ? Number(rangeLbs.split(' – ')[1]) : Number(rangeKg.split(' – ')[1]),
      actualGain: currentW && w ? Number(actualGain.toFixed(1)) : null
    };
  };

  const bmiResults = getBmiResults();

  // Export PDF / Download PNG
  const handleDownloadReport = async () => {
    if (!captureRef.current) return;
    try {
      const canvas = await html2canvas(captureRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#0c0a09' : '#ffffff'
      });
      const link = document.createElement('a');
      link.download = `Calculatoora_Pregnancy_Report_${new Date().toISOString().slice(0, 10)}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error("Failed to generate image report:", error);
    }
  };

  // Fetch current week data or fall back
  const selectedWeekData: WeekData = WEEKLY_DEVELOPMENT.find(w => w.week === selectedWeekNum) || WEEKLY_DEVELOPMENT[27];

  // Live countdown to due date helper
  const getCountdownString = () => {
    if (!calcResults?.edd) return null;
    const timeRemaining = calcResults.edd.getTime() - now.getTime();
    if (timeRemaining <= 0) return "Your Due Date has arrived!";

    const totalSecs = Math.floor(timeRemaining / 1000);
    const secs = totalSecs % 60;
    const mins = Math.floor(totalSecs / 60) % 60;
    const hours = Math.floor(totalSecs / 3600) % 24;
    const days = Math.floor(totalSecs / 86400);

    return { days, hours, mins, secs };
  };

  const countdown = getCountdownString();

  return (
    <div className="w-full text-neutral-800 dark:text-neutral-100" ref={captureRef}>
      {/* HEADER SECTION */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600/10 via-cyan-500/5 to-purple-600/5 p-8 border border-neutral-200/50 dark:border-neutral-800/50 mb-8 backdrop-blur-xl">
        <div className="absolute top-0 right-0 p-4 opacity-15">
          <Baby className="w-48 h-48 text-blue-500" />
        </div>
        <div className="max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-cyan-400 mb-4 border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Advanced Medical Pregnancy Dating
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 bg-clip-text text-transparent">
            Pregnancy Calculator
          </h1>
          <p className="mt-2 text-sm sm:text-base text-neutral-500 dark:text-neutral-400 leading-relaxed">
            Determine your accurate estimated due date (EDD), track baby&apos;s development week-by-week, plan prenatal milestones, and estimate healthy pregnancy weight gain curves based on five certified obstetrical dating methods.
          </p>
          
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleLoadExample}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20 dark:shadow-cyan-500/10 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" /> Load Example
            </button>
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 active:scale-95 transition flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Clear All
            </button>
          </div>
        </div>
      </div>

      {/* THREE COLUMN GRID - INPUTS, INSIGHTS & OPTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
        
        {/* INPUTS COLUMN */}
        <div className="lg:col-span-7 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-900 dark:text-neutral-100 mb-6">
            <Calendar className="w-5 h-5 text-blue-500" />
            Pregnancy Calculation Details
          </h2>

          {/* METHOD SWITCHER */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-2 select-none">
              Dating Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'lmp', label: 'LMP' },
                { id: 'conception', label: 'Conception' },
                { id: 'ivf', label: 'IVF' },
                { id: 'ultrasound', label: 'Ultrasound' },
                { id: 'duedate', label: 'Due Date' }
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id as any)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer text-center truncate ${
                    method === m.id
                      ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-cyan-400'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC METOD INPUTS */}
          <div className="space-y-4 mb-6">
            {method === 'lmp' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300">
                  First Day of Last Menstrual Period <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={lmpDate}
                    onChange={(e) => setLmpDate(e.target.value)}
                    className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                    placeholder="Select Date"
                  />
                </div>
              </motion.div>
            )}

            {method === 'conception' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300">
                  Estimated Conception Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={conceptionDate}
                  onChange={(e) => setConceptionDate(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                  placeholder="Select Date"
                />
              </motion.div>
            )}

            {method === 'ivf' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-1">
                      Embryo Transfer Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={ivfDate}
                      onChange={(e) => setIvfDate(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                      placeholder="Select Date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-1">
                      Embryo Type <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <button
                        onClick={() => setIvfType('day3')}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                          ivfType === 'day3'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-cyan-400'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        Day 3 Transfer
                      </button>
                      <button
                        onClick={() => setIvfType('day5')}
                        className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer text-center ${
                          ivfType === 'day5'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-600 dark:text-cyan-400'
                            : 'border-neutral-200 dark:border-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800'
                        }`}
                      >
                        Day 5 Blastocyst
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {method === 'ultrasound' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-1">
                      Ultrasound Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={ultrasoundDate}
                      onChange={(e) => setUltrasoundDate(e.target.value)}
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                      placeholder="Select Date"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-1">
                      Ultrasound Weeks <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={ultrasoundWeeks}
                      onChange={(e) => setUltrasoundWeeks(e.target.value)}
                      min="0"
                      max="42"
                      placeholder="e.g. 10"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300 mb-1">
                      Ultrasound Days
                    </label>
                    <input
                      type="number"
                      value={ultrasoundDays}
                      onChange={(e) => setUltrasoundDays(e.target.value)}
                      min="0"
                      max="6"
                      placeholder="0–6 (e.g. 4)"
                      className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {method === 'duedate' && (
              <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                <label className="block text-sm font-bold text-neutral-600 dark:text-neutral-300">
                  Known Expected Due Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={dueDateInput}
                  onChange={(e) => setDueDateInput(e.target.value)}
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                  placeholder="Select Date"
                />
              </motion.div>
            )}
          </div>

          <div className="border-t border-neutral-100 dark:border-neutral-800 my-6 pt-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 mb-4 select-none">
              Optional Pregnancy Metrics
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-300">
                    Cycle Length (days)
                  </label>
                  <span className="text-xs text-neutral-400">Norm: 20-45</span>
                </div>
                <input
                  type="number"
                  value={cycleLength}
                  onChange={(e) => setCycleLength(e.target.value)}
                  placeholder="e.g. 28"
                  className={`w-full bg-neutral-50 dark:bg-neutral-950 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-1 transition text-neutral-800 dark:text-neutral-100 ${
                    validationErrors.cycleLength 
                      ? 'border-red-500 focus:border-red-500 focus:ring-red-500/30' 
                      : 'border-neutral-200 dark:border-neutral-800 focus:border-blue-500 focus:ring-blue-500/30'
                  }`}
                />
                {validationErrors.cycleLength && (
                  <span className="text-xs text-red-500 flex items-center gap-1 mt-1">
                    <AlertCircle className="w-3 h-3" /> {validationErrors.cycleLength}
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-600 dark:text-neutral-300">
                  Maternal Age (years)
                </label>
                <input
                  type="number"
                  value={maternalAge}
                  onChange={(e) => setMaternalAge(e.target.value)}
                  placeholder="e.g. 29"
                  className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition text-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mt-4 items-end bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60">
              <div className="col-span-3 mb-2 flex justify-between items-center">
                <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                  Weight Gain Tracker Settings
                </span>
                <div className="flex rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-800">
                  <button
                    onClick={() => setUnitSystem('imperial')}
                    className={`px-2 py-1 text-[10px] font-bold cursor-pointer ${
                      unitSystem === 'imperial'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-neutral-900 text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    Imperial
                  </button>
                  <button
                    onClick={() => setUnitSystem('metric')}
                    className={`px-2 py-1 text-[10px] font-bold cursor-pointer ${
                      unitSystem === 'metric'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-neutral-900 text-neutral-400 hover:text-neutral-600'
                    }`}
                  >
                    Metric
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-500">
                  Height ({unitSystem === 'imperial' ? 'in' : 'cm'})
                </label>
                <input
                  type="number"
                  value={maternalHeight}
                  onChange={(e) => setMaternalHeight(e.target.value)}
                  placeholder={unitSystem === 'imperial' ? 'e.g. 64' : 'e.g. 162'}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-500">
                  Pre-pregnancy Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
                </label>
                <input
                  type="number"
                  value={prePregnancyWeight}
                  onChange={(e) => setPrePregnancyWeight(e.target.value)}
                  placeholder={unitSystem === 'imperial' ? 'e.g. 130' : 'e.g. 59'}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-neutral-500">
                  Current Weight ({unitSystem === 'imperial' ? 'lbs' : 'kg'})
                </label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(e.target.value)}
                  placeholder={unitSystem === 'imperial' ? 'e.g. 142' : 'e.g. 64'}
                  className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-500 text-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RESULTS & SMART INSIGHTS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <AnimatePresence mode="wait">
            {!calcResults ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-950 border border-dashed border-neutral-300 dark:border-neutral-800 rounded-3xl p-8 text-center flex flex-col items-center justify-center min-h-[420px]"
              >
                <Baby className="w-16 h-16 text-neutral-400 dark:text-neutral-600 animate-bounce mb-4" />
                <h3 className="text-lg font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                  No Active Pregnancy Calculation
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 max-w-sm mb-6 leading-relaxed">
                  Every input starts completely empty to respect medical precision. Choose a dating method and fill in required fields or click <strong>&quot;Load Example&quot;</strong> to view.
                </p>
                <button
                  onClick={handleLoadExample}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg hover:shadow-cyan-500/20 active:scale-95 transition cursor-pointer"
                >
                  Quick Load Demo Example
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="active-results"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 dark:from-black dark:via-neutral-950 dark:to-black text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-neutral-800/80 relative overflow-hidden"
              >
                {/* Visual glow accent */}
                <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl" />

                <div className="flex justify-between items-center mb-6">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                    Calculation Results
                  </span>
                  <button
                    onClick={handleDownloadReport}
                    className="p-2 bg-neutral-800/50 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition cursor-pointer"
                    title="Download PNG Summary"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>

                {/* HERO RESULT DISPLAY */}
                <div className="text-center pb-6 border-b border-neutral-800/50 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                    Estimated Due Date (EDD)
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-cyan-400 tracking-tight mt-1">
                    {formatDateLabel(calcResults.edd)}
                  </div>
                  <div className="text-xs text-neutral-400 mt-1 flex items-center justify-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    Estimated date of natural spontaneous birth.
                  </div>
                </div>

                {/* DETAILED SPLIT PROGRESS */}
                <div className="grid grid-cols-2 gap-4 text-center mb-6">
                  <div className="bg-neutral-800/30 border border-neutral-800/60 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Gestational Age
                    </span>
                    <span className="text-lg font-extrabold text-white mt-1 block">
                      {calcResults.weeksPregnant}w {calcResults.remainingDaysInWeek}d
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      ({calcResults.daysPregnant} Days Pregnant)
                    </span>
                  </div>

                  <div className="bg-neutral-800/30 border border-neutral-800/60 rounded-2xl p-4">
                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">
                      Pregnancy Progress
                    </span>
                    <span className="text-lg font-extrabold text-white mt-1 block">
                      {calcResults.progressPercent.toFixed(1)}%
                    </span>
                    <span className="text-[10px] text-neutral-400 mt-1 block">
                      ({calcResults.daysRemaining} Days Left)
                    </span>
                  </div>
                </div>

                {/* HORIZONTAL MINI-PROGRESS TRACKS */}
                <div className="space-y-4 mb-6">
                  <div>
                    <div className="flex justify-between text-xs font-bold text-neutral-400 mb-1">
                      <span>Total Pregnancy Progress</span>
                      <span className="text-cyan-400">{calcResults.progressPercent.toFixed(0)}%</span>
                    </div>
                    <div className="w-full bg-neutral-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-cyan-400 h-2 rounded-full transition-all duration-500" 
                        style={{ width: `${calcResults.progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[10px] text-neutral-400">
                    <div className="flex flex-col">
                      <span className="font-bold text-white mb-0.5">Trimester 1</span>
                      <span className="truncate">End: {formatDateLabel(calcResults.trimesters.t1.end)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white mb-0.5">Trimester 2</span>
                      <span className="truncate">End: {formatDateLabel(calcResults.trimesters.t2.end)}</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-white mb-0.5">Trimester 3</span>
                      <span className="truncate">Due: {formatDateLabel(calcResults.trimesters.t3.end)}</span>
                    </div>
                  </div>
                </div>

                {/* SMART INSIGHTS ENGINE */}
                <div className="bg-gradient-to-br from-blue-950/40 to-cyan-950/40 border border-cyan-800/30 rounded-2xl p-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Smart Pregnancy Insights
                  </h4>
                  <ul className="text-xs text-neutral-300 space-y-2 leading-relaxed">
                    <li>
                      • You are in <strong className="text-white">Week {calcResults.currentWeekNum}</strong>, currently in Month <strong className="text-white">{calcResults.currentMonth}</strong> of your pregnancy.
                    </li>
                    {calcResults.weeksPregnant < 13 ? (
                      <li>• You are currently navigating your <strong>First Trimester</strong>. Heart development is active, and embryogenesis is finalizing!</li>
                    ) : calcResults.weeksPregnant >= 13 && calcResults.weeksPregnant < 28 ? (
                      <li>• You are in your <strong>Second Trimester</strong>. Fetal viability occurs at week 24, and your anatomy ultrasound window spans weeks 18–22.</li>
                    ) : (
                      <li>• You have entered your <strong>Third Trimester</strong>. The countdown is truly active! Your baby is piling on fat reserves and finalizing lung dynamics.</li>
                    )}
                    {calcResults.daysRemaining > 0 ? (
                      <li>
                        • Approximately <strong className="text-white">{calcResults.daysRemaining} days</strong> remain until your estimated due date of birth.
                      </li>
                    ) : (
                      <li>• Your expected due date has been reached! Monitor closely for real birth contractions.</li>
                    )}
                    {maternalAge && Number(maternalAge) >= 35 && (
                      <li className="text-yellow-400/90 font-medium">
                        • Note: Maternal age is 35+. Consider discussing screening tests like cell-free DNA (cfDNA) or NIPT with your OB/GYN.
                      </li>
                    )}
                  </ul>
                </div>

                {/* LIVE COUNTDOWN TO DUE DATE */}
                {countdown && typeof countdown === 'object' && (
                  <div className="mt-4 pt-4 border-t border-neutral-800/40 text-center">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                      Live Precision Countdown to Birth
                    </span>
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {[
                        { val: countdown.days, lbl: 'Days' },
                        { val: countdown.hours, lbl: 'Hours' },
                        { val: countdown.mins, lbl: 'Mins' },
                        { val: countdown.secs, lbl: 'Secs' }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-neutral-900/80 rounded-xl p-2 border border-neutral-800">
                          <span className="font-mono text-lg font-black text-cyan-400 block tracking-tight">
                            {String(item.val).padStart(2, '0')}
                          </span>
                          <span className="text-[8px] uppercase font-bold text-neutral-500">
                            {item.lbl}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* DETAILED RESULTS NAVIGATION TABS */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 mb-8">
        <div className="flex gap-4 overflow-x-auto pb-px scrollbar-none">
          {[
            { id: 'tracker', label: 'Interactive Week-by-Week Tracker' },
            { id: 'planner', label: 'Obstetric Appointment Planner' },
            { id: 'weight', label: 'Pregnancy Weight Gain Curves' },
            { id: 'education', label: 'Medical SEO & Due Date Science' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3 px-1 border-b-2 text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400 font-extrabold'
                  : 'border-transparent text-neutral-400 dark:text-neutral-500 hover:text-neutral-600 dark:hover:text-neutral-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TRACKER TAB */}
      {activeTab === 'tracker' && (
        <div className="space-y-6">
          
          {/* HORIZONTAL SCROLLABLE TIMELINE TRACK */}
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 select-none">
                Interactive Week Timeline (Weeks 1 – 42)
              </h3>
              {calcResults && (
                <span className="text-xs bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-cyan-400 px-2.5 py-1 rounded-full font-bold">
                  You are in Week {calcResults.currentWeekNum}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-800">
              {Array.from({ length: 42 }).map((_, idx) => {
                const wNum = idx + 1;
                const isCurrent = calcResults?.currentWeekNum === wNum;
                const isSelected = selectedWeekNum === wNum;
                
                return (
                  <button
                    key={wNum}
                    onClick={() => setSelectedWeekNum(wNum)}
                    className={`flex-none w-12 h-12 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-blue-600 dark:bg-cyan-500 border-blue-600 dark:border-cyan-500 text-white shadow-md shadow-blue-500/10'
                        : isCurrent
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-400 text-blue-600 dark:text-cyan-400 font-bold ring-2 ring-blue-500/20'
                        : 'bg-neutral-50 dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-500 dark:text-neutral-400'
                    }`}
                  >
                    <span className="text-[9px] font-bold uppercase">Wk</span>
                    <span className="text-xs font-black">{wNum}</span>

                    {/* Current Week Dot */}
                    {isCurrent && !isSelected && (
                      <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-cyan-400 animate-ping" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* WEEKLY METRICS & COMPARISON PANEL */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* BABY DEVELOPMENT & SIZE ILLUSTRATION */}
            <div className="lg:col-span-4 bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-neutral-900 dark:to-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 rounded-3xl p-6 flex flex-col justify-between">
              
              <div>
                <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 uppercase tracking-widest block mb-1">
                  Fetal Size Visualization
                </span>
                <h3 className="text-xl font-bold text-neutral-800 dark:text-white">
                  Week {selectedWeekNum}: {selectedWeekData.fruit}
                </h3>
              </div>

              {/* SIZE ILLUSTRATION CARD */}
              <div className="my-6 py-8 bg-white dark:bg-neutral-950 border border-neutral-200/50 dark:border-neutral-800/50 rounded-2xl flex flex-col items-center justify-center relative overflow-hidden">
                <div className="text-6xl animate-bounce mb-4 select-none">
                  {selectedWeekData.fruitEmoji}
                </div>
                <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-widest font-bold">
                  Size Comparison Equivalent
                </div>

                {/* Grid Overlay Graphic */}
                <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 opacity-5 pointer-events-none">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div key={i} className="border-[0.5px] border-neutral-400" />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="bg-white dark:bg-neutral-950/50 border border-neutral-200/40 dark:border-neutral-800/40 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Estimated Length</span>
                  <div className="text-sm font-extrabold text-neutral-800 dark:text-white mt-1">
                    {selectedWeekData.lengthCm} cm
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    ({selectedWeekData.lengthIn} inches)
                  </div>
                </div>

                <div className="bg-white dark:bg-neutral-950/50 border border-neutral-200/40 dark:border-neutral-800/40 rounded-xl p-3">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase">Estimated Weight</span>
                  <div className="text-sm font-extrabold text-neutral-800 dark:text-white mt-1">
                    {selectedWeekData.weightG >= 1000 
                      ? `${(selectedWeekData.weightG / 1000).toFixed(2)} kg` 
                      : `${selectedWeekData.weightG} g`}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    ({selectedWeekData.weightOz} oz)
                  </div>
                </div>
              </div>
            </div>

            {/* SYMPTOMS & MOTHER CHANGES PANEL */}
            <div className="lg:col-span-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex gap-2 border-b border-neutral-100 dark:border-neutral-800 pb-4 mb-6">
                  <span className="text-sm font-bold text-neutral-800 dark:text-white border-b-2 border-blue-500 pb-4 -mb-4">
                    Fetal &amp; Maternal Changes
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-blue-600 dark:text-cyan-400 flex items-center gap-1.5 mb-2">
                        <Activity className="w-4 h-4" /> Baby Development Milestones
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                        {selectedWeekData.milestones.map((item, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span>•</span> <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 mb-2">
                        <Heart className="w-4 h-4 text-rose-500" /> Typical Symptoms
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                        {selectedWeekData.symptoms.map((item, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span>•</span> <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-700 dark:text-neutral-200 flex items-center gap-1.5 mb-2">
                        <Compass className="w-4 h-4 text-emerald-500" /> Body Changes
                      </h4>
                      <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
                        {selectedWeekData.bodyChanges.map((item, i) => (
                          <li key={i} className="flex gap-1.5">
                            <span>•</span> <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-neutral-50 dark:bg-neutral-950 p-4 rounded-2xl border border-neutral-100 dark:border-neutral-800 space-y-3">
                      <h5 className="text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                        Healthy Guidance Tips
                      </h5>
                      <div className="grid grid-cols-3 gap-2 text-center text-[10px]">
                        <div className="bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <Utensils className="w-4 h-4 text-orange-400 mx-auto mb-1" />
                          <span className="font-bold block">Nutrition</span>
                          <span className="text-[8px] text-neutral-400 block truncate" title={selectedWeekData.nutrition[0]}>
                            {selectedWeekData.nutrition[0]}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <Dumbbell className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                          <span className="font-bold block">Exercise</span>
                          <span className="text-[8px] text-neutral-400 block truncate" title={selectedWeekData.exercise[0]}>
                            {selectedWeekData.exercise[0]}
                          </span>
                        </div>
                        <div className="bg-white dark:bg-neutral-900 p-2 rounded-xl border border-neutral-100 dark:border-neutral-800">
                          <Moon className="w-4 h-4 text-purple-400 mx-auto mb-1" />
                          <span className="font-bold block">Sleep</span>
                          <span className="text-[8px] text-neutral-400 block truncate" title={selectedWeekData.sleep[0]}>
                            {selectedWeekData.sleep[0]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-100 dark:border-neutral-800 text-[10px] text-neutral-400 dark:text-neutral-500 leading-relaxed italic flex items-center gap-1.5">
                <Info className="w-4 h-4 text-blue-500 flex-shrink-0" /> Note: This fetal progress data is based on general statistics. Fetal developmental timelines differ on a wide variance.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OBSTETRIC APPOINTMENT PLANNER */}
      {activeTab === 'planner' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mb-6">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Standard Obstetrical Appointment Planner
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Below is the clinically suggested educational schedule of prenatal scans and screenings based on your calculated gestational age. Speak with your healthcare provider to construct your customized clinic schedule.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {!calcResults ? (
              <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
                <Calendar className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
                <span className="text-sm font-bold text-neutral-500">Calculate due date to view personalized prenatal windows.</span>
              </div>
            ) : (
              <div className="space-y-4">
                {[
                  {
                    id: 'first',
                    name: 'First Prenatal Appointment',
                    weeks: 'Weeks 8 – 12',
                    desc: 'Initial health intake, medical history verification, early dating ultrasound scan, blood screening, and genetic testing consultations.',
                    dateRange: calcResults.planner.firstPrenatal
                  },
                  {
                    id: 'nuchal',
                    name: 'Nuchal Translucency Scan',
                    weeks: 'Weeks 11 – 13',
                    desc: 'Highly specialized ultrasound screening evaluating chromosomal safety, checking nasal bone development and fluid thickness in the baby\'s neck.',
                    dateRange: calcResults.planner.nuchalScan
                  },
                  {
                    id: 'anatomy',
                    name: 'Fetal Anatomy Survey Scan',
                    weeks: 'Weeks 18 – 22',
                    desc: 'Critical head-to-toe structural ultrasound scanning evaluating the development of all organs (heart chambers, brain, spine, kidneys, limb structures) and placenta position.',
                    dateRange: calcResults.planner.anatomyScan
                  },
                  {
                    id: 'glucose',
                    name: 'Glucose Challenge Screening',
                    weeks: 'Weeks 24 – 28',
                    desc: 'Mandatory clinical screening for gestational diabetes mellitus using a standardized sugar beverage challenge and lab blood checks.',
                    dateRange: calcResults.planner.glucoseScreening
                  },
                  {
                    id: 'growth',
                    name: 'Growth/Biophysical Scan (Optional)',
                    weeks: 'Weeks 32 – 36',
                    desc: 'Optional ultrasound evaluating baby\'s growth velocity, estimated weight percentiles, amniotic fluid pocket volumes, and physical presentation.',
                    dateRange: calcResults.planner.growthScan
                  },
                  {
                    id: 'gbs',
                    name: 'Group B Streptococcus (GBS) Culture',
                    weeks: 'Weeks 35 – 37',
                    desc: 'Routine diagnostic cotton-swab culture evaluating GBS colonization in mothers. Essential for setting postpartum safety antibiotics protocols during active labor.',
                    dateRange: calcResults.planner.gbsTest
                  },
                  {
                    id: 'final',
                    name: 'Weekly Late Prenatal Checkups',
                    weeks: 'Weeks 38 – 40',
                    desc: 'Frequent non-stress monitoring checkups, cervix readiness check, position evaluation, maternal blood pressure surveillance, and preparation of final labor directives.',
                    dateRange: calcResults.planner.finalCheckups
                  }
                ].map((item, idx) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={item.id}
                      className="p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-neutral-300 dark:hover:border-neutral-700 transition"
                    >
                      <div className="max-w-xl">
                        <div className="flex flex-wrap gap-2 items-center">
                          <span className="text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full">
                            {item.weeks}
                          </span>
                          <span className="text-sm font-bold text-neutral-800 dark:text-white">
                            {item.name}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                      
                      <div className="bg-white dark:bg-neutral-900 border border-neutral-200/50 dark:border-neutral-800 p-3 rounded-xl min-w-[200px] text-center shadow-sm">
                        <span className="text-[10px] font-bold uppercase text-neutral-400 tracking-wider block">
                          Suggested Calendar Window
                        </span>
                        <span className="text-xs font-black text-neutral-800 dark:text-cyan-400 mt-1 block">
                          {item.dateRange}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* WEIGHT GAIN ESTIMATOR */}
      {activeTab === 'weight' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="max-w-2xl mb-6">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-500" />
              Pregnancy Weight Gain Curves (IOM Guidelines)
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
              Enter your pre-pregnancy weight, current weight, and height in the sidebar to calculate your BMI and generate your recommended pregnancy weight gain trajectory curve.
            </p>
          </div>

          {!bmiResults ? (
            <div className="text-center py-12 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl">
              <Scale className="w-12 h-12 text-neutral-400 mx-auto mb-3 animate-pulse" />
              <span className="text-sm font-bold text-neutral-500">
                Please enter Maternal Height &amp; Pre-pregnancy Weight in the sidebar to compute BMI and generate weight gain curves.
              </span>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              
              {/* BMI RESULTS FEEDBACK */}
              <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
                <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950 border border-neutral-200/60 dark:border-neutral-800/60 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block">
                      Pre-Pregnancy BMI Category
                    </span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-2xl font-black text-neutral-800 dark:text-white">
                        {bmiResults.bmi}
                      </span>
                      <span className="text-sm font-bold text-blue-600 dark:text-cyan-400">
                        ({bmiResults.category})
                      </span>
                    </div>
                  </div>

                  <div className="border-t border-neutral-200 dark:border-neutral-800 my-4" />

                  <div className="space-y-3 text-xs text-neutral-600 dark:text-neutral-300">
                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-400">IOM Suggested Gain:</span>
                      <span className="font-extrabold text-neutral-800 dark:text-white">
                        {bmiResults.range}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="font-bold text-neutral-400">Trimester 2 &amp; 3 Weekly Gain:</span>
                      <span className="font-extrabold text-neutral-800 dark:text-white">
                        {bmiResults.weekly}
                      </span>
                    </div>

                    {bmiResults.actualGain !== null && (
                      <div className="flex justify-between items-center bg-blue-50/50 dark:bg-blue-950/20 p-2.5 rounded-xl border border-blue-100 dark:border-blue-900/40">
                        <span className="font-bold text-blue-600 dark:text-cyan-400">Your Current Weight Gain:</span>
                        <span className="font-extrabold text-blue-700 dark:text-cyan-400">
                          {bmiResults.actualGain} {unitSystem === 'imperial' ? 'lbs' : 'kg'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/10 dark:to-orange-950/10 border border-yellow-200/50 dark:border-yellow-900/30 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  <h4 className="font-bold text-yellow-700 dark:text-yellow-500 mb-1 flex items-center gap-1">
                    <Info className="w-4 h-4" /> Healthy Weight Gain Advice
                  </h4>
                  During Trimester 1, weight gain is minimal (typically 1–5 lbs). Most weight is gained in Trimesters 2 and 3 as the baby, amniotic fluid, and placenta expand. Never attempt weight-loss diets during pregnancy without physician oversight.
                </div>
              </div>

              {/* CURVE PLOT SVG CHART */}
              <div className="lg:col-span-7 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-200/60 dark:border-neutral-800/60 p-4 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest block mb-2 text-center">
                    IOM Shaded Recommendation Curve (Weeks 1 – 40)
                  </span>

                  {/* HIGH FIDELITY CUSTOM SVG CHART */}
                  <div className="w-full h-64 relative bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800/60 rounded-xl overflow-hidden p-2">
                    <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                      {/* Grid Lines */}
                      <line x1="40" y1="20" x2="380" y2="20" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-neutral-800" />
                      <line x1="40" y1="60" x2="380" y2="60" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-neutral-800" />
                      <line x1="40" y1="100" x2="380" y2="100" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-neutral-800" />
                      <line x1="40" y1="140" x2="380" y2="140" stroke="#f1f5f9" strokeWidth="1" className="dark:stroke-neutral-800" />
                      <line x1="40" y1="180" x2="380" y2="180" stroke="#e2e8f0" strokeWidth="1.5" className="dark:stroke-neutral-700" />

                      {/* X and Y Axis borders */}
                      <line x1="40" y1="20" x2="40" y2="180" stroke="#e2e8f0" strokeWidth="1.5" className="dark:stroke-neutral-700" />

                      {/* SHADED REGION FOR RECOMMENDED WEIGHT GAIN */}
                      {/* Let's plot standard polynomial curves for T1 (weeks 1-13) slow gain, T2-3 fast gain */}
                      {/* Min curve points: (40, 180) -> (140, 175) -> (380, 100) */}
                      {/* Max curve points: (40, 180) -> (140, 165) -> (380, 40) */}
                      <path
                        d="M 40,180 Q 140,172 380,110 L 380,50 Q 140,162 40,180 Z"
                        fill="rgba(59, 130, 246, 0.12)"
                        stroke="rgba(59, 130, 246, 0.4)"
                        strokeWidth="1.5"
                      />

                      {/* LABELS */}
                      <text x="35" y="183" textAnchor="end" fontSize="8" className="fill-neutral-400 font-mono">0</text>
                      <text x="35" y="143" textAnchor="end" fontSize="8" className="fill-neutral-400 font-mono">10</text>
                      <text x="35" y="103" textAnchor="end" fontSize="8" className="fill-neutral-400 font-mono">20</text>
                      <text x="35" y="63" textAnchor="end" fontSize="8" className="fill-neutral-400 font-mono">30</text>
                      <text x="35" y="23" textAnchor="end" fontSize="8" className="fill-neutral-400 font-mono">40+</text>

                      {/* Weeks Labels */}
                      <text x="40" y="195" textAnchor="middle" fontSize="8" className="fill-neutral-400 font-mono">Wk 1</text>
                      <text x="140" y="195" textAnchor="middle" fontSize="8" className="fill-neutral-400 font-mono">Wk 13</text>
                      <text x="260" y="195" textAnchor="middle" fontSize="8" className="fill-neutral-400 font-mono">Wk 27</text>
                      <text x="380" y="195" textAnchor="middle" fontSize="8" className="fill-neutral-400 font-mono">Wk 40</text>

                      {/* User Current Marker dot if weight gain actual is present and calculated weeks are active */}
                      {calcResults && bmiResults.actualGain !== null && (
                        (() => {
                          const wk = calcResults.currentWeekNum;
                          // Convert week (1-40) to x-coord (40 to 380)
                          const pctX = Math.min(100, Math.max(0, (wk - 1) / 39));
                          const xCoord = 40 + (pctX * 340);

                          // Convert actual gain to y-coord (180 to 20)
                          // Let's say 40 units is full height (160px span). So 1 lbs = 4px y-shift.
                          const yCoord = Math.max(20, Math.min(180, 180 - (bmiResults.actualGain * 3.5)));

                          return (
                            <g>
                              <circle cx={xCoord} cy={yCoord} r="5" fill="#ef4444" className="animate-ping" />
                              <circle cx={xCoord} cy={yCoord} r="4" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                              <text x={xCoord > 200 ? xCoord - 10 : xCoord + 10} y={yCoord - 10} fontSize="8" fontWeight="bold" textAnchor={xCoord > 200 ? "end" : "start"} className="fill-neutral-900 dark:fill-white">
                                You ({bmiResults.actualGain} {unitSystem === 'imperial' ? 'lbs' : 'kg'})
                              </text>
                            </g>
                          );
                        })()
                      )}
                    </svg>
                  </div>
                </div>

                <span className="text-[9px] text-neutral-400 text-center mt-3 leading-relaxed">
                  Shaded region maps the standard healthy clinical guideline envelope for normal-weight/ovulatory pregnancies. Individual charts differ.
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* COMPREHENSIVE EDUCATIONAL REVIEWS */}
      {activeTab === 'education' && (
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm space-y-10">
          
          {/* SECTIONS */}
          <div>
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white border-b border-neutral-100 dark:border-neutral-800 pb-3 mb-4">
              Scientific Principles of Pregnancy Gestation &amp; Dating
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              <div className="space-y-4">
                <p>
                  Pregnancy is traditionally tracked on a <strong className="text-neutral-800 dark:text-white">40-week timeline (280 days)</strong> starting from the first day of the Last Menstrual Period (LMP). While ovulation and actual conception happen roughly two weeks later, standard clinical metrics count these two pre-conception weeks because LMP is historically the easiest milestone for mothers to recall.
                </p>
                <p>
                  Our tool resolves dating equations using standard obstetrical algorithms representing multiple clinical dating methods:
                </p>
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong>Last Menstrual Period (LMP):</strong> Employs Naegele&apos;s Rule: <code className="bg-neutral-100 dark:bg-neutral-950 px-1.5 py-0.5 rounded text-xs">EDD = LMP + 280 Days + (Cycle Length - 28)</code>. This adjusts for mothers with non-standard 28-day menstrual cycles.
                  </li>
                  <li>
                    <strong>Conception Date:</strong> Calculates backwards by placing conception exactly at day 14 of a standard cycle: <code className="bg-neutral-100 dark:bg-neutral-950 px-1.5 py-0.5 rounded text-xs">EDD = Conception + 266 Days</code>.
                  </li>
                </ul>
              </div>

              <div className="space-y-4">
                <ul className="space-y-2 list-disc pl-5">
                  <li>
                    <strong>In Vitro Fertilization (IVF):</strong> The exact transfer date of an IVF embryo is the most precise pregnancy milestone. Dating depends on the age of the transferred blastocyst: Day-3 transfer uses <code className="bg-neutral-100 dark:bg-neutral-950 px-1.5 py-0.5 rounded text-xs">Transfer + 263 Days</code>, whereas Day-5 transfer uses <code className="bg-neutral-100 dark:bg-neutral-950 px-1.5 py-0.5 rounded text-xs">Transfer + 261 Days</code>.
                  </li>
                  <li>
                    <strong>Ultrasound Dating:</strong> The medical gold standard in early first-trimester dating. Back-calculates the equivalent LMP by subtracting the measured gestational age (weeks + days) from the date of ultrasound performance.
                  </li>
                  <li>
                    <strong>Expected Due Date (EDD) Back-calculation:</strong> Works backward from a known due date to estimate current progress.
                  </li>
                </ul>
                <p>
                  Clinically, due dates are estimates. Only about 4% to 5% of mothers deliver on their exact calculated EDD; 90% deliver within two weeks on either side of this milestone date.
                </p>
              </div>
            </div>
          </div>

          {/* TRIMESTER TABLE GUIDE */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Pregnancy Trimester Guidelines
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                    <th className="py-2.5 font-bold">Trimester</th>
                    <th className="py-2.5 font-bold">Weeks Covered</th>
                    <th className="py-2.5 font-bold">Fetal Milestones</th>
                    <th className="py-2.5 font-bold">Maternal Symptoms</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-600 dark:text-neutral-300">
                  <tr>
                    <td className="py-3 font-extrabold text-neutral-800 dark:text-white">First Trimester</td>
                    <td className="py-3">Weeks 1 – 13</td>
                    <td className="py-3">Cell division, organogenesis, heartbeat begins, limb buds form, nervous system architecture solidifies.</td>
                    <td className="py-3">Morning sickness, fatigue, breast tenderness, frequent urination, mood swings.</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-extrabold text-neutral-800 dark:text-white">Second Trimester</td>
                    <td className="py-3">Weeks 14 – 27</td>
                    <td className="py-3">Distinct bone ossification, sensory system active, hair and nails emerge, baby kicks are felt, swallowing amniotic fluids.</td>
                    <td className="py-3">Honeymoon surge in energy, abdominal skin stretching, round ligament twinges, mild ankle swelling.</td>
                  </tr>
                  <tr>
                    <td className="py-3 font-extrabold text-neutral-800 dark:text-white">Third Trimester</td>
                    <td className="py-3">Weeks 28 – 40+</td>
                    <td className="py-3">Rapid fat deposits, brain development acceleration, lung surfactant maturation, turning head-down (vertex).</td>
                    <td className="py-3">Shortness of breath, fatigue, backaches, Braxton Hicks contractions, frequent urination.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* WORKED EXAMPLES */}
          <div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-4">
              Pregnancy Calculations Worked Examples
            </h3>
            <div className="space-y-4">
              <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-sm">
                <h4 className="font-bold text-neutral-800 dark:text-white mb-2">Example 1: Last Menstrual Period (LMP) Dating</h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  A mother reports her last menstrual period started on <strong className="text-neutral-800 dark:text-white">January 1, 2026</strong>. She has a standard 28-day cycle.
                  <br />
                  Using Naegele&apos;s Rule:
                  <br />
                  <code className="block bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800 font-mono text-xs my-2">
                    EDD = January 1, 2026 + 280 Days = October 8, 2026.
                  </code>
                  Since her cycle length is a standard 28 days, no additional days are added. She is due on October 8, 2026.
                </p>
              </div>

              <div className="bg-neutral-50 dark:bg-neutral-950 p-5 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-sm">
                <h4 className="font-bold text-neutral-800 dark:text-white mb-2">Example 2: IVF Day-5 Blastocyst Dating</h4>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  An embryo transfer is completed on <strong className="text-neutral-800 dark:text-white">April 10, 2026</strong> using a frozen 5-day blastocyst.
                  <br />
                  Using standard IVF blastocyst dating calculations:
                  <br />
                  <code className="block bg-white dark:bg-neutral-900 p-2 rounded border border-neutral-200 dark:border-neutral-800 font-mono text-xs my-2">
                    EDD = April 10, 2026 + 261 Days = December 27, 2026.
                  </code>
                  The equivalent LMP is April 10 - 19 days = March 22, 2026.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQS ACCORDION SECTION */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-blue-500" />
          Pregnancy Calculator - Frequently Asked Questions
        </h3>
        
        <div className="space-y-4">
          {[
            {
              q: "How accurate is the estimated due date (EDD)?",
              a: "Due dates are educational guidelines. Only about 5% of babies arrive on their exact calculated due date. Most full-term babies are born between 37 and 42 weeks of gestation. Early first-trimester ultrasounds (performed before 13 weeks) are medically considered the most precise method of establishing pregnancy dating."
            },
            {
              q: "Can I use this calculator if my cycle length is irregular?",
              a: "Yes. By selecting the Last Menstrual Period (LMP) dating method, you can type in your custom average cycle length (between 20 and 45 days). The algorithm automatically adjusts the calculation, shifting your expected due date to match your luteal phase timeline."
            },
            {
              q: "How does IVF pregnancy dating differ?",
              a: "In spontaneous pregnancies, dating assumes conception happened about two weeks after LMP. With In Vitro Fertilization (IVF), the exact conception or cell expansion age of the embryo is known. Therefore, we calculate backward from the Transfer Date: adding 263 days for Day-3 embryo transfers, or adding 261 days for Day-5 blastocyst transfers."
            },
            {
              q: "Why does gestational age start before conception?",
              a: "Medical systems start tracking gestational age from the first day of your last menstrual period because historically it is the most reliable physical milestone. As a result, during the first two weeks of your measured pregnancy, you are not actually pregnant yet."
            },
            {
              q: "How is healthy pregnancy weight gain determined?",
              a: "Healthy pregnancy weight gain ranges are based on your calculated pre-pregnancy Body Mass Index (BMI) in accordance with Institute of Medicine guidelines. Underweight mothers are recommended to gain more weight (28-40 lbs), while obese mothers are advised to gain less (11-20 lbs)."
            }
          ].map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div key={index} className="border-b border-neutral-100 dark:border-neutral-800 pb-4">
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center text-left py-2 font-bold text-sm sm:text-base text-neutral-800 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-cyan-400 transition"
                >
                  <span>{item.q}</span>
                  {isOpen ? <ChevronUp className="w-5 h-5 text-neutral-400" /> : <ChevronDown className="w-5 h-5 text-neutral-400" />}
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed"
                    >
                      {item.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* GLOSSARY SECTION */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-6">
          Pregnancy Calculations Medical Glossary
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed text-neutral-600 dark:text-neutral-300">
          <div>
            <p className="mb-3">
              <strong className="text-neutral-800 dark:text-white block mb-0.5">Estimated Due Date (EDD)</strong>
              The forecasted calendar date on which a spontaneous natural birth is expected to occur.
            </p>
            <p className="mb-3">
              <strong className="text-neutral-800 dark:text-white block mb-0.5">Gestational Age (GA)</strong>
              The measured age of the pregnancy counted in weeks and days from the first day of the last period.
            </p>
            <p className="mb-3">
              <strong className="text-neutral-800 dark:text-white block mb-0.5">Naegele&apos;s Rule</strong>
              A standard medical dating formula adding 280 days (40 weeks) to the first day of the last menstrual period.
            </p>
          </div>

          <div>
            <p className="mb-3">
              <strong className="text-neutral-800 dark:text-white block mb-0.5">Fetal Viability</strong>
              The gestational threshold (typically 24 completed weeks) where a fetus has a reasonable chance of survival outside the womb.
            </p>
            <p className="mb-3">
              <strong className="text-neutral-800 dark:text-white block mb-0.5">Braxton Hicks</strong>
              Painless, irregular tightening uterine contractions that prepare the cervix and uterus for active labor.
            </p>
            <p className="mb-3">
              <strong className="text-neutral-800 dark:text-white block mb-0.5">Nuchal Translucency</strong>
              A collection of fluid behind the baby&apos;s neck measured via ultrasound during weeks 11–13 to screen for chromosomal abnormalities.
            </p>
          </div>
        </div>
      </div>

      {/* RELATED CALCULATORS */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-sm mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 mb-4 select-none">
          Related Health &amp; Fertility Tools
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: "Due Date Calculator", slug: "health-pregnancy-due-date" },
            { name: "Ovulation Calculator", slug: "health-ovulation-cycle" },
            { name: "BMI Calculator", slug: "bmi-advanced-calculator" },
            { name: "Water Intake Calculator", slug: "water-intake-advanced-calculator" }
          ].map((calc, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(`calculator:${calc.slug}`)}
              className="p-3 bg-neutral-50 dark:bg-neutral-950 hover:bg-blue-50 dark:hover:bg-neutral-800 border border-neutral-200/50 dark:border-neutral-800 rounded-xl text-left text-xs font-bold transition text-neutral-600 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-cyan-400 cursor-pointer flex justify-between items-center"
            >
              <span>{calc.name}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          ))}
        </div>
      </div>

      {/* CLINICAL DISCLAIMER */}
      <div className="bg-rose-50 dark:bg-rose-950/10 border border-rose-200 dark:border-rose-900/30 rounded-3xl p-6 flex items-start gap-4 mb-10">
        <AlertCircle className="w-6 h-6 text-rose-500 flex-shrink-0" />
        <div className="text-xs sm:text-sm text-rose-800 dark:text-rose-300 leading-relaxed">
          <strong className="font-bold text-rose-900 dark:text-rose-400 block mb-1">
            Clinical Disclaimer &amp; Guidance
          </strong>
          This Pregnancy Calculator is an educational estimator only. It does not provide medical diagnoses, treatment plans, or replace professional obstetrical consultation. Always discuss individual prenatal plans, warning symptoms, and labor questions directly with a qualified healthcare professional or licensed obstetrician.
        </div>
      </div>
    </div>
  );
}
