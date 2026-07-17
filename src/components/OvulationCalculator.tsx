import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar as CalendarIcon, 
  Heart, 
  Sparkles, 
  Trash2, 
  Activity, 
  ArrowRight, 
  Info, 
  Baby, 
  TrendingUp, 
  Compass, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Smile,
  BookOpen,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface OvulationCalculatorProps {
  onNavigate: (page: string) => void;
}

// Symptom list options
const SYMPTOMS_LIST = [
  { id: 'mucus_eggwhite', label: 'Egg-White Cervical Mucus (Highly Fertile)', category: 'mucus', score: 30, description: 'Clear, stretchy, resembles raw egg white. Conducive to sperm transport.' },
  { id: 'mucus_watery', label: 'Watery/Wet Cervical Mucus (Fertile)', category: 'mucus', score: 20, description: 'Thin, slippery, watery consistency indicating high estrogen and fertility.' },
  { id: 'lh_positive', label: 'Positive Ovulation Test (LH Surge)', category: 'lh', score: 50, description: 'Luteinizing Hormone peak detected on test strip. Ovulation occurs in 24-36 hrs.' },
  { id: 'bbt_rise', label: 'Basal Body Temp Rise (Post-Ovulation)', category: 'bbt', score: 5, description: 'Subtle temperature rise (0.5-1°F) indicating progesterone release after ovulation.' },
  { id: 'cramps', label: 'Mittelschmerz (One-sided pelvic pain)', category: 'physical', score: 10, description: 'Lower abdominal cramping felt on one side during egg release.' },
  { id: 'tender_breasts', label: 'Breast Tenderness', category: 'physical', score: 5, description: 'Hormonal fluctuations causing breast sensitivity or fullness.' },
  { id: 'mood_libido', label: 'Increased Libido', category: 'physical', score: 10, description: 'Nature\'s hormonal driver, typically peaking during the fertile window.' }
];

export default function OvulationCalculator({ onNavigate }: OvulationCalculatorProps) {
  // UI Tabs
  const [activeTab, setActiveTab] = useState<'calendar' | 'timeline' | 'insights' | 'whatif' | 'health'>('calendar');

  // Input States starting strictly EMPTY
  const [lmpDate, setLmpDate] = useState<string>('');
  const [cycleLength, setCycleLength] = useState<string>('');
  const [lutealLength, setLutealLength] = useState<string>('');
  const [isIrregular, setIsIrregular] = useState<boolean>(false);
  const [shortestCycle, setShortestCycle] = useState<string>('');
  const [longestCycle, setLongestCycle] = useState<string>('');

  // Health and BMI Optional Inputs
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>('cm');

  // Symptom tracker states
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  // Selected Day in Calendar for detailed Daily Insight
  const [selectedCalDay, setSelectedCalDay] = useState<Date | null>(null);

  // Calendar Navigation month offset
  const [currentMonthOffset, setCurrentMonthOffset] = useState<number>(0);

  // FAQ open indexes
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Clear All
  const handleClearAll = () => {
    setLmpDate('');
    setCycleLength('');
    setLutealLength('');
    setIsIrregular(false);
    setShortestCycle('');
    setLongestCycle('');
    setWeight('');
    setHeight('');
    setSelectedSymptoms([]);
    setSelectedCalDay(null);
    setCurrentMonthOffset(0);
  };

  // Load Example
  const handleLoadExample = () => {
    const today = new Date();
    // set LMP to 10 days ago so calculations fall perfectly within view
    const lmp = new Date(today);
    lmp.setDate(today.getDate() - 10);
    
    // Format YYYY-MM-DD
    const lmpFormatted = lmp.toISOString().split('T')[0];
    
    setLmpDate(lmpFormatted);
    setCycleLength('28');
    setLutealLength('14');
    setIsIrregular(false);
    setShortestCycle('26');
    setLongestCycle('32');
    setWeight('62');
    setHeight('168');
    setSelectedSymptoms(['mucus_eggwhite', 'mood_libido']);
    setSelectedCalDay(null);
    setCurrentMonthOffset(0);
  };

  // Safe local date parser to prevent timezone shifts
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

  // MAIN OVULATION AND CYCLE METRICS RESOLUTION LOGIC
  const calculateCycles = () => {
    const hasInputs = lmpDate && (isIrregular ? (shortestCycle && longestCycle) : cycleLength);
    if (!hasInputs) return null;

    const lmp = parseLocalDate(lmpDate);
    if (!lmp) return null;

    const defaultLuteal = lutealLength ? Number(lutealLength) : 14;
    const avgCycle = isIrregular 
      ? Math.round((Number(shortestCycle) + Number(longestCycle)) / 2)
      : (cycleLength ? Number(cycleLength) : 28);

    const shortestVal = isIrregular ? Number(shortestCycle) : avgCycle;
    const longestVal = isIrregular ? Number(longestCycle) : avgCycle;

    // Generate cycle sequences for next 6 cycles
    const cyclesData = [];
    let currentLmp = new Date(lmp.getTime());

    for (let i = 0; i < 6; i++) {
      const nextPeriodStart = new Date(currentLmp.getTime());
      if (i > 0) {
        nextPeriodStart.setDate(currentLmp.getDate());
      }

      // Predicted Ovulation Day: typically (cycle length - luteal phase) days from current period start
      // For irregular cycles, we estimate based on midpoints of cycle lengths
      const ovulationDate = new Date(nextPeriodStart.getTime());
      ovulationDate.setDate(nextPeriodStart.getDate() + (avgCycle - defaultLuteal));

      // Fertile Window: 5 days before ovulation and day of ovulation
      const fertileStart = new Date(ovulationDate.getTime());
      fertileStart.setDate(ovulationDate.getDate() - 5);

      const fertileEnd = new Date(ovulationDate.getTime());
      fertileEnd.setDate(ovulationDate.getDate() + 1); // egg remains viable for up to 24 hours

      // In case of irregular cycle mode, clinical Standard Days / Calendar Rhythm formulas apply:
      // Fertile window starts on (shortest cycle - 18) days and ends on (longest cycle - 11) days
      const irregularFertileStart = new Date(nextPeriodStart.getTime());
      irregularFertileStart.setDate(nextPeriodStart.getDate() + (shortestVal - 18));

      const irregularFertileEnd = new Date(nextPeriodStart.getTime());
      irregularFertileEnd.setDate(nextPeriodStart.getDate() + (longestVal - 11));

      // Pregnancy Test Best Date: 14 days after ovulation
      const testDate = new Date(ovulationDate.getTime());
      testDate.setDate(ovulationDate.getDate() + 14);

      // Period Duration (typically estimated at 5 days)
      const periodEnd = new Date(nextPeriodStart.getTime());
      periodEnd.setDate(nextPeriodStart.getDate() + 4);

      cyclesData.push({
        cycleIndex: i + 1,
        periodStart: nextPeriodStart,
        periodEnd: periodEnd,
        ovulation: ovulationDate,
        fertileStart: isIrregular ? irregularFertileStart : fertileStart,
        fertileEnd: isIrregular ? irregularFertileEnd : fertileEnd,
        nextPeriodExpected: new Date(nextPeriodStart.getTime() + avgCycle * 24 * 60 * 60 * 1000),
        testDate: testDate
      });

      // Shift currentLmp to next cycle's expected start date
      currentLmp = new Date(nextPeriodStart.getTime() + avgCycle * 24 * 60 * 60 * 1000);
    }

    return {
      cycles: cyclesData,
      currentCycle: cyclesData[0],
      avgCycle,
      luteal: defaultLuteal
    };
  };

  const results = calculateCycles();

  // Dynamic status evaluation
  const getDayStatus = (date: Date) => {
    if (!results) return 'low';
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    for (const cyc of results.cycles) {
      const pStart = new Date(cyc.periodStart.getFullYear(), cyc.periodStart.getMonth(), cyc.periodStart.getDate()).getTime();
      const pEnd = new Date(cyc.periodEnd.getFullYear(), cyc.periodEnd.getMonth(), cyc.periodEnd.getDate()).getTime();
      const fStart = new Date(cyc.fertileStart.getFullYear(), cyc.fertileStart.getMonth(), cyc.fertileStart.getDate()).getTime();
      const fEnd = new Date(cyc.fertileEnd.getFullYear(), cyc.fertileEnd.getMonth(), cyc.fertileEnd.getDate()).getTime();
      const ov = new Date(cyc.ovulation.getFullYear(), cyc.ovulation.getMonth(), cyc.ovulation.getDate()).getTime();
      const test = new Date(cyc.testDate.getFullYear(), cyc.testDate.getMonth(), cyc.testDate.getDate()).getTime();

      if (dateMidnight >= pStart && dateMidnight <= pEnd) {
        return 'period';
      }
      if (dateMidnight === ov) {
        return 'ovulation';
      }
      if (dateMidnight >= fStart && dateMidnight <= fEnd) {
        return 'fertile';
      }
      if (dateMidnight === test) {
        return 'test';
      }
    }
    return 'low';
  };

  // Calculate dynamic chance of conception
  const getConceptionChance = (date: Date) => {
    if (!results) return { probability: 0, rating: 'Extremely Low', color: 'text-neutral-400' };
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    // Check symptoms boosts
    let symptomBoost = 0;
    selectedSymptoms.forEach(sid => {
      const sym = SYMPTOMS_LIST.find(s => s.id === sid);
      if (sym) symptomBoost += sym.score;
    });

    for (const cyc of results.cycles) {
      const ov = new Date(cyc.ovulation.getFullYear(), cyc.ovulation.getMonth(), cyc.ovulation.getDate()).getTime();
      const diffDays = Math.round((dateMidnight - ov) / (1000 * 60 * 60 * 24));

      // Est probabilities based on day relative to ovulation (Day 0)
      let probability = 0;
      if (diffDays === 0) probability = 33;        // Day of ovulation
      else if (diffDays === -1) probability = 35;   // Day before ovulation
      else if (diffDays === -2) probability = 30;   // 2 days before
      else if (diffDays === -3) probability = 18;   // 3 days before
      else if (diffDays === -4) probability = 12;   // 4 days before
      else if (diffDays === -5) probability = 8;    // 5 days before
      else if (diffDays === 1) probability = 5;     // 1 day after ovulation (egg lives ~24 hrs)
      else if (diffDays >= -7 && diffDays <= -6) probability = 1; // very small baseline
      else probability = 0;

      // Apply symptoms multiplier/boost (capped at 85% to be realistic and medically sound)
      let finalProb = Math.min(85, probability + Math.round(symptomBoost * (probability > 0 ? 0.8 : 0.05)));

      if (finalProb > 50) {
        return { probability: finalProb, rating: 'Peak Fertility 🌟', color: 'text-amber-500 font-extrabold' };
      } else if (finalProb > 25) {
        return { probability: finalProb, rating: 'High Fertility 🌸', color: 'text-blue-500 font-bold' };
      } else if (finalProb > 5) {
        return { probability: finalProb, rating: 'Moderate Fertility', color: 'text-teal-500 font-medium' };
      } else if (finalProb > 0) {
        return { probability: finalProb, rating: 'Low Fertility', color: 'text-neutral-500' };
      }
    }
    return { probability: 0, rating: 'Minimal / Non-Fertile Phase', color: 'text-neutral-400' };
  };

  // Gender timing probabilities (Shettles Method)
  const getGenderTimingInfo = (date: Date) => {
    if (!results) return null;
    const dateMidnight = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

    for (const cyc of results.cycles) {
      const ov = new Date(cyc.ovulation.getFullYear(), cyc.ovulation.getMonth(), cyc.ovulation.getDate()).getTime();
      const diffDays = Math.round((dateMidnight - ov) / (1000 * 60 * 60 * 24));

      if (diffDays === 0 || diffDays === 1) {
        return {
          favors: 'Boy ♂',
          explanation: 'Intercourse on the day of ovulation or shortly after favors male (Y) sperm, which are faster swimmers but shorter-lived in acidic environments.',
          probability: '65%'
        };
      } else if (diffDays >= -4 && diffDays <= -2) {
        return {
          favors: 'Girl ♀',
          explanation: 'Intercourse 2-4 days prior to ovulation favors female (X) sperm, which are slower but more resilient and can survive longer in pelvic tracts.',
          probability: '65%'
        };
      }
    }
    return null;
  };

  // Calendar rendering setup
  const getDaysInMonthIndex = () => {
    const startBase = results ? results.currentCycle.ovulation : new Date();
    const targetMonth = new Date(startBase.getFullYear(), startBase.getMonth() + currentMonthOffset, 1);
    
    const year = targetMonth.getFullYear();
    const month = targetMonth.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday, etc.
    const numDays = new Date(year, month + 1, 0).getDate();

    const daysArray = [];
    // Pad previous month days
    for (let i = 0; i < firstDayIndex; i++) {
      daysArray.push(null);
    }
    // Add current month days
    for (let d = 1; d <= numDays; d++) {
      daysArray.push(new Date(year, month, d));
    }

    return {
      days: daysArray,
      title: targetMonth.toLocaleDateString(undefined, { year: 'numeric', month: 'long' })
    };
  };

  const calMonthDetails = getDaysInMonthIndex();

  // BMI calculation
  const calculateBMI = () => {
    if (!weight || !height) return null;
    const wNum = Number(weight);
    const hNum = Number(height);
    if (isNaN(wNum) || isNaN(hNum) || hNum === 0) return null;

    let bmiVal = 0;
    if (weightUnit === 'kg' && heightUnit === 'cm') {
      bmiVal = wNum / Math.pow(hNum / 100, 2);
    } else if (weightUnit === 'lbs' && heightUnit === 'in') {
      bmiVal = (wNum / Math.pow(hNum, 2)) * 703;
    } else if (weightUnit === 'kg' && heightUnit === 'in') {
      bmiVal = wNum / Math.pow(hNum * 0.0254, 2);
    } else {
      // lbs and cm
      bmiVal = (wNum / 2.20462) / Math.pow(hNum / 100, 2);
    }

    let bmiCategory = 'Normal Weight';
    let impactOnOvulation = 'Healthy weight ranges strongly support regular endocrine cascades and steady follicular stimulation.';
    let color = 'text-green-500';

    if (bmiVal < 18.5) {
      bmiCategory = 'Underweight';
      impactOnOvulation = 'Low body adipose concentrations can lead to decreased GnRH release, resulting in sporadic ovulation (oligomenorrhea) or complete amenorrhea.';
      color = 'text-blue-500';
    } else if (bmiVal >= 25 && bmiVal < 30) {
      bmiCategory = 'Overweight';
      impactOnOvulation = 'Slightly higher adipose counts can increase circulating estrogen baseline loads, which might cause subtle cycle variations.';
      color = 'text-amber-500';
    } else if (bmiVal >= 30) {
      bmiCategory = 'Obese';
      impactOnOvulation = 'Excess fatty tissue elevates aromatization of androgens into estrogen. This can result in estrogen dominance, anovulation, or PCOS-like patterns.';
      color = 'text-red-500';
    }

    return {
      value: bmiVal.toFixed(1),
      category: bmiCategory,
      impact: impactOnOvulation,
      color: color
    };
  };

  const bmiAnalysis = calculateBMI();

  // Daily dynamic message block if calendar day clicked
  const getSelectedDayMessage = () => {
    if (!selectedCalDay || !results) return null;
    
    const status = getDayStatus(selectedCalDay);
    const conception = getConceptionChance(selectedCalDay);
    const genderTiming = getGenderTimingInfo(selectedCalDay);

    let mainDesc = '';
    let healthGuide = '';

    switch (status) {
      case 'period':
        mainDesc = 'Menstrual Flow Phase (Cycle Days 1-5).';
        healthGuide = 'The uterine lining is shedding due to progesterone drop-off. Estrogen levels are at their lowest baseline. Rest and nourish your body.';
        break;
      case 'ovulation':
        mainDesc = 'PEAK OVULATION DAY! 🎉';
        healthGuide = 'The mature egg is released from the ovary into the fallopian tubes, viable for 12 to 24 hours. The luteinizing hormone (LH) surge has peaked. This represents the ultimate window of natural conception.';
        break;
      case 'fertile':
        mainDesc = 'Fertile Window Active 🌸';
        healthGuide = 'High-fertility follicular phase. Estrogen is rising, stimulating thin, watery cervical mucus that keeps sperm viable for up to 5 days. Intercourse during this window is highly likely to result in conception.';
        break;
      case 'test':
        mainDesc = 'Optimal Pregnancy Testing Window 🧪';
        healthGuide = 'If conception occurred, hCG hormone counts should now be sufficiently elevated to register on sensitive home pregnancy tests. Highly recommended day for accurate testing.';
        break;
      default:
        mainDesc = 'Luteal / Post-Ovulatory Phase.';
        healthGuide = 'Progesterone is dominating to support potential egg implantation. Natural fertility potential is low. The egg is no longer viable for fertilization in this cycle.';
    }

    return {
      date: selectedCalDay,
      status: status,
      conceptionChance: conception,
      gender: genderTiming,
      description: mainDesc,
      guide: healthGuide
    };
  };

  const dayDetail = getSelectedDayMessage();

  return (
    <div className="space-y-8 font-sans">
      {/* Disclaimer Alert banner */}
      <div className="bg-blue-50/80 dark:bg-neutral-900/40 backdrop-blur-md rounded-2xl p-4 border border-blue-100 dark:border-neutral-800 flex items-start gap-3 shadow-sm">
        <Info className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <p className="text-xs text-blue-800 dark:text-neutral-300 leading-relaxed font-semibold">
          <span className="font-bold">Medical Disclaimer:</span> This calculator provides educational estimates only and should not replace medical advice from qualified healthcare professionals. It should not be used for contraception planning or official gynecological diagnosis.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Advanced Input & Control console */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-[32px] border border-white/50 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-200/50 dark:border-neutral-800/60 pb-4">
              <span className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Tracker Parameters
              </span>
              <button 
                onClick={handleClearAll}
                className="flex items-center gap-1 text-xs font-bold text-neutral-400 hover:text-red-500 transition cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear All
              </button>
            </div>

            {/* Inputs Body */}
            <div className="space-y-5">
              
              {/* LMP Date */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300">
                  First Day of Last Period (LMP)
                </label>
                <input
                  type="date"
                  value={lmpDate}
                  onChange={(e) => setLmpDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-cyan-400/10 transition shadow-sm"
                />
                <p className="text-[10px] text-neutral-400">Specify the day your last menstrual flow began.</p>
              </div>

              {/* Irregular cycle mode toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/20 border border-neutral-100 dark:border-neutral-800/50">
                <div className="space-y-0.5 pr-2">
                  <span className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">Irregular Cycle Mode</span>
                  <span className="block text-[10px] text-neutral-400 leading-snug">Track fertility using Standard Days formulas for varying cycles.</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input 
                    type="checkbox" 
                    checked={isIrregular} 
                    onChange={(e) => setIsIrregular(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-10 h-6 bg-neutral-200 dark:bg-neutral-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Standard Cycle Length vs Irregular Range */}
              {!isIrregular ? (
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 flex justify-between">
                    <span>Average Cycle Length</span>
                    <span className="text-xs text-neutral-400 font-normal">days</span>
                  </label>
                  <input
                    type="number"
                    min="20"
                    max="45"
                    placeholder="e.g. 28"
                    value={cycleLength}
                    onChange={(e) => setCycleLength(e.target.value)}
                    className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition shadow-sm font-mono"
                  />
                  <p className="text-[10px] text-neutral-400">Regular cycles are typically between 24 and 35 days.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Shortest Cycle (Days)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="45"
                      placeholder="e.g. 26"
                      value={shortestCycle}
                      onChange={(e) => setShortestCycle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition shadow-sm font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300">
                      Longest Cycle (Days)
                    </label>
                    <input
                      type="number"
                      min="20"
                      max="45"
                      placeholder="e.g. 32"
                      value={longestCycle}
                      onChange={(e) => setLongestCycle(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition shadow-sm font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Luteal Phase (Advanced Setting) */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 flex justify-between">
                  <span>Luteal Phase Duration (Optional)</span>
                  <span className="text-xs text-neutral-400 font-normal">days</span>
                </label>
                <input
                  type="number"
                  min="10"
                  max="20"
                  placeholder="e.g. 14 (Default)"
                  value={lutealLength}
                  onChange={(e) => setLutealLength(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition shadow-sm font-mono"
                />
                <p className="text-[10px] text-neutral-400">Days from ovulation to next cycle. Default is 14.</p>
              </div>

              {/* Load Example Data Link Button */}
              <button
                type="button"
                onClick={handleLoadExample}
                className="w-full py-3.5 rounded-2xl text-xs font-bold text-blue-600 dark:text-cyan-400 bg-blue-50/60 dark:bg-cyan-500/5 border border-blue-200/50 dark:border-cyan-400/15 hover:bg-blue-100/50 dark:hover:bg-cyan-400/10 transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Example Data
              </button>

            </div>
          </div>
        </div>

        {/* Right Side: Tabbed Interface & Interactive Results dashboards */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Main Navigation Sub-tabs */}
          <div className="flex gap-2 p-1.5 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800 overflow-x-auto select-none">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'calendar'
                  ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" /> Interactive Calendar
            </button>
            <button
              onClick={() => setActiveTab('timeline')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Multi-Cycle Forecast
            </button>
            <button
              onClick={() => setActiveTab('insights')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'insights'
                  ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" /> Symptoms &amp; Insights
            </button>
            <button
              onClick={() => setActiveTab('whatif')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'whatif'
                  ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" /> What-If Analysis
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                activeTab === 'health'
                  ? 'bg-white dark:bg-neutral-850 text-blue-600 dark:text-cyan-400 shadow-md'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
              }`}
            >
              <Baby className="w-3.5 h-3.5" /> BMI &amp; Wellness
            </button>
          </div>

          <AnimatePresence mode="wait">
            {!results ? (
              <motion.div
                key="empty-state"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-[32px] border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/10 p-12 text-center space-y-4"
              >
                <div className="w-14 h-14 bg-blue-100 dark:bg-cyan-950/40 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Heart className="w-7 h-7 text-blue-500 dark:text-cyan-400" />
                </div>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  Ready to map your cycle?
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Enter your first day of last period and typical cycle length on the left parameters sidebar to unlock clinical estimates, interactive calendars, multi-cycle timelines, and personalized fertility insights.
                </p>
                <button
                  type="button"
                  onClick={handleLoadExample}
                  className="px-6 py-3 bg-neutral-900 hover:bg-blue-600 dark:bg-neutral-800 dark:hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-98 cursor-pointer"
                >
                  Explore with Example Data
                </button>
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                {/* INTERACTIVE CALENDAR TAB */}
                {activeTab === 'calendar' && (
                  <div className="space-y-6">
                    {/* Month Navigator Header */}
                    <div className="flex items-center justify-between bg-white dark:bg-neutral-900/30 border border-neutral-200/40 dark:border-neutral-800 p-4 rounded-2xl shadow-sm backdrop-blur-md">
                      <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">
                        {calMonthDetails.title}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => setCurrentMonthOffset(p => p - 1)}
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setCurrentMonthOffset(0)}
                          className="px-3 py-1 bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-850 dark:hover:bg-neutral-800 text-[10px] font-bold text-neutral-500 rounded-md transition cursor-pointer"
                        >
                          Today's Cycle Month
                        </button>
                        <button
                          onClick={() => setCurrentMonthOffset(p => p + 1)}
                          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-600 dark:text-neutral-400 cursor-pointer"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Legend block */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3 bg-neutral-50/50 dark:bg-neutral-900/20 rounded-2xl border border-neutral-100 dark:border-neutral-800/30 text-[11px] font-bold select-none">
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-red-500 block shrink-0 shadow-sm" /> Menstrual Flow
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-blue-500 block shrink-0 shadow-sm" /> Fertile Window
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-yellow-500 block shrink-0 shadow-sm" /> Peak Ovulation Day
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300">
                        <span className="w-3 h-3 rounded-full bg-green-500 block shrink-0 shadow-sm" /> Pregnancy Test Date
                      </div>
                      <div className="flex items-center gap-1.5 text-neutral-700 dark:text-neutral-300 col-span-2 sm:col-span-1">
                        <span className="w-3 h-3 rounded-full bg-neutral-200 dark:bg-neutral-700 block shrink-0 shadow-sm" /> Low Fertility
                      </div>
                    </div>

                    {/* Actual Grid Calendar */}
                    <div className="rounded-[32px] border border-white/50 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl overflow-hidden p-6">
                      <div className="grid grid-cols-7 gap-1 text-center font-bold text-neutral-400 dark:text-neutral-500 text-xs mb-3 font-mono uppercase tracking-wider select-none">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                          <div key={d} className="py-1">{d}</div>
                        ))}
                      </div>

                      <div className="grid grid-cols-7 gap-2">
                        {calMonthDetails.days.map((day, dIdx) => {
                          if (day === null) {
                            return <div key={`pad-${dIdx}`} className="aspect-square bg-transparent rounded-2xl" />;
                          }

                          const status = getDayStatus(day);
                          const conception = getConceptionChance(day);
                          const isSelected = selectedCalDay && selectedCalDay.toDateString() === day.toDateString();

                          let classes = 'bg-neutral-50 hover:bg-neutral-100 dark:bg-neutral-900/20 dark:hover:bg-neutral-800 text-neutral-800 dark:text-neutral-300';
                          
                          if (status === 'period') {
                            classes = 'bg-red-500/15 border border-red-500/30 text-red-600 dark:text-red-400 font-extrabold hover:bg-red-500/20';
                          } else if (status === 'ovulation') {
                            classes = 'bg-yellow-500/20 border-2 border-yellow-500 text-yellow-700 dark:text-yellow-400 font-extrabold hover:bg-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.25)]';
                          } else if (status === 'fertile') {
                            classes = 'bg-blue-500/15 border border-blue-500/30 text-blue-600 dark:text-blue-400 font-extrabold hover:bg-blue-500/25';
                          } else if (status === 'test') {
                            classes = 'bg-green-500/15 border border-green-500/30 text-green-600 dark:text-green-400 font-extrabold hover:bg-green-500/25';
                          }

                          if (isSelected) {
                            classes += ' ring-4 ring-offset-2 ring-blue-500 dark:ring-cyan-400 dark:ring-offset-neutral-900 scale-102 transition-transform duration-300';
                          }

                          return (
                            <button
                              key={`day-${day.getTime()}`}
                              onClick={() => setSelectedCalDay(day)}
                              className={`aspect-square rounded-2xl flex flex-col items-center justify-center relative cursor-pointer group transition-all duration-300 ${classes}`}
                            >
                              <span className="text-xs sm:text-sm font-black">{day.getDate()}</span>
                              
                              {/* Small indicator dots/markers */}
                              {status === 'ovulation' && (
                                <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-yellow-500 animate-ping" />
                              )}
                              {conception.probability > 30 && status !== 'ovulation' && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-blue-500" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed selected day clinical insight card */}
                    <AnimatePresence mode="wait">
                      {dayDetail ? (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-[32px] border border-blue-100 dark:border-neutral-800/80 bg-blue-50/20 dark:bg-neutral-950/20 backdrop-blur-md p-6 space-y-4 shadow-sm"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/50 dark:border-neutral-800/60 pb-3">
                            <div className="space-y-0.5">
                              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Detailed Fertility Insight</span>
                              <h5 className="text-base font-extrabold text-neutral-900 dark:text-white">
                                {formatDateLabel(dayDetail.date)}
                              </h5>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                              dayDetail.status === 'period' ? 'bg-red-100 text-red-600 dark:bg-red-500/10' :
                              dayDetail.status === 'ovulation' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10' :
                              dayDetail.status === 'fertile' ? 'bg-blue-100 text-blue-600 dark:bg-blue-500/10' :
                              dayDetail.status === 'test' ? 'bg-green-100 text-green-600 dark:bg-green-500/10' :
                              'bg-neutral-100 text-neutral-600 dark:bg-neutral-800'
                            }`}>
                              {dayDetail.description}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                            <div className="space-y-2.5">
                              <span className="font-bold text-neutral-800 dark:text-neutral-200 block">Biological Phase Activity</span>
                              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                {dayDetail.guide}
                              </p>
                            </div>

                            <div className="space-y-3 p-4 rounded-2xl bg-white dark:bg-neutral-900/60 border border-neutral-200/40 dark:border-neutral-800/60">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-bold text-neutral-500">Conception Likelihood:</span>
                                <span className={dayDetail.conceptionChance.color}>{dayDetail.conceptionChance.rating} ({dayDetail.conceptionChance.probability}%)</span>
                              </div>
                              
                              {/* Progress bar visual */}
                              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-2 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-500" 
                                  style={{ width: `${dayDetail.conceptionChance.probability}%` }}
                                />
                              </div>

                              {dayDetail.gender && (
                                <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
                                  <div className="flex justify-between items-center text-xs">
                                    <span className="font-bold text-neutral-500">Gender Timing Bias:</span>
                                    <span className="text-blue-600 dark:text-cyan-400 font-extrabold">{dayDetail.gender.favors} ({dayDetail.gender.probability})</span>
                                  </div>
                                  <p className="text-[10px] text-neutral-400 leading-normal">
                                    {dayDetail.gender.explanation}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <div className="text-center p-6 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-2xl text-xs text-neutral-400">
                          Click on any highlighted calendar day above to view detailed endocrinology guides, conception chance estimates, and baby gender bias analyses.
                        </div>
                      )}
                    </AnimatePresence>

                  </div>
                )}

                {/* MULTI-CYCLE FORECAST TAB */}
                {activeTab === 'timeline' && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-neutral-900 dark:text-white">6-Month Fertile &amp; Cycle Forecast</h4>
                      <p className="text-xs text-neutral-400">Estimated timelines based on your parameters. Useful for future family planning and vacation scheduling.</p>
                    </div>

                    <div className="space-y-4">
                      {results.cycles.map((cyc) => (
                        <motion.div
                          key={`timeline-${cyc.cycleIndex}`}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: cyc.cycleIndex * 0.05 }}
                          className="rounded-2xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/60 dark:bg-neutral-900/30 p-5 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-100/60 dark:bg-cyan-950/40 text-blue-600 dark:text-cyan-400 font-black flex items-center justify-center shrink-0">
                              #{cyc.cycleIndex}
                            </div>
                            <div>
                              <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Predicted Cycle Start</span>
                              <span className="block text-sm font-extrabold text-neutral-900 dark:text-white">
                                {formatDateLabel(cyc.periodStart)}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 grow md:ml-8 text-xs border-t md:border-t-0 border-neutral-100 dark:border-neutral-800 pt-3 md:pt-0">
                            <div>
                              <span className="block text-[9px] font-mono text-neutral-400 uppercase">Period Duration</span>
                              <span className="block font-bold text-red-500 dark:text-red-400 mt-0.5">
                                {cyc.periodStart.getDate()} – {cyc.periodEnd.getDate()} {cyc.periodStart.toLocaleDateString(undefined, { month: 'short' })}
                              </span>
                            </div>
                            <div>
                              <span className="block text-[9px] font-mono text-neutral-400 uppercase">Fertile Window Range</span>
                              <span className="block font-bold text-blue-500 dark:text-cyan-400 mt-0.5">
                                {cyc.fertileStart.getDate()} – {cyc.fertileEnd.getDate()} {cyc.fertileStart.toLocaleDateString(undefined, { month: 'short' })}
                              </span>
                            </div>
                            <div className="col-span-2 sm:col-span-1">
                              <span className="block text-[9px] font-mono text-neutral-400 uppercase">Peak Ovulation Day</span>
                              <span className="block font-bold text-yellow-600 dark:text-yellow-400 mt-0.5">
                                {formatDateLabel(cyc.ovulation)}
                              </span>
                            </div>
                          </div>

                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SYMPTOMS & CLINICAL INSIGHTS TAB */}
                {activeTab === 'insights' && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-neutral-900 dark:text-white">Dynamic Symptom Logger</h4>
                      <p className="text-xs text-neutral-400">Log observed symptoms to dynamically refine your ovulation likelihood forecasts.</p>
                    </div>

                    {/* Symptoms selection matrix */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {SYMPTOMS_LIST.map((sym) => {
                        const isSelected = selectedSymptoms.includes(sym.id);
                        return (
                          <button
                            key={sym.id}
                            onClick={() => {
                              setSelectedSymptoms(prev => 
                                isSelected ? prev.filter(x => x !== sym.id) : [...prev, sym.id]
                              );
                            }}
                            className={`p-4 rounded-2xl border text-left flex items-start gap-3 cursor-pointer transition-all duration-300 ${
                              isSelected
                                ? 'bg-blue-500/10 border-blue-500 dark:bg-cyan-400/10 dark:border-cyan-400'
                                : 'bg-white dark:bg-neutral-900/30 border-neutral-200/50 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700'
                            }`}
                          >
                            <span className={`w-5 h-5 rounded-full border shrink-0 mt-0.5 flex items-center justify-center font-bold text-xs ${
                              isSelected ? 'bg-blue-500 border-blue-500 text-white dark:bg-cyan-400 dark:border-cyan-400 dark:text-neutral-950' : 'border-neutral-300 text-transparent'
                            }`}>
                              ✓
                            </span>
                            <div className="space-y-1">
                              <span className="block text-xs font-extrabold text-neutral-850 dark:text-neutral-100">{sym.label}</span>
                              <span className="block text-[10px] text-neutral-400 leading-snug">{sym.description}</span>
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    {/* Clinical ovulation overview */}
                    <div className="rounded-[32px] border border-neutral-200/50 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/20 backdrop-blur-md p-6 space-y-4">
                      <h5 className="text-sm font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5 font-mono">
                        <Smile className="w-4 h-4 text-blue-500" /> Educational Phase Analytics
                      </h5>
                      
                      <div className="space-y-3.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                        <p>
                          Your cycle is divided into several phases. If you entered a regular <span className="font-extrabold text-blue-500">{results.avgCycle}-day</span> cycle, the estimated phases are:
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5 border border-neutral-100 dark:border-neutral-800">
                            <span className="block font-bold text-red-500">1. Menstrual Phase (Days 1–5)</span>
                            <span className="block text-[10px] text-neutral-400 leading-relaxed">Shedding of uterine tissue, low hormone concentrations, signaling the start of a brand new follicular cascade.</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5 border border-neutral-100 dark:border-neutral-800">
                            <span className="block font-bold text-blue-500">2. Follicular Phase (Days 1–13)</span>
                            <span className="block text-[10px] text-neutral-400 leading-relaxed">Estrogen rises rapidly, stimulating follicle maturation in the ovaries and building up thick uterine linings.</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5 border border-neutral-100 dark:border-neutral-800">
                            <span className="block font-bold text-yellow-500">3. Ovulatory Phase (Day 14)</span>
                            <span className="block text-[10px] text-neutral-400 leading-relaxed">Luteinizing hormone (LH) surge releases the mature oocyte. Fertilization window is highly optimized.</span>
                          </div>
                          <div className="p-4 rounded-2xl bg-neutral-50/50 dark:bg-neutral-900/30 space-y-1.5 border border-neutral-100 dark:border-neutral-800">
                            <span className="block font-bold text-purple-500">4. Luteal Phase (Days 15–28)</span>
                            <span className="block text-[10px] text-neutral-400 leading-relaxed">Progesterone is released from empty follicle shell (corpus luteum) to secure endometrium for embryo implantation.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

                {/* WHAT-IF ANALYSIS */}
                {activeTab === 'whatif' && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-neutral-900 dark:text-white">What-If Fertility Sensitivity</h4>
                      <p className="text-xs text-neutral-400">See exactly how changes in your cycle length alter the timing of your peak fertile window.</p>
                    </div>

                    <div className="rounded-[32px] border border-white/50 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 space-y-6">
                      
                      <div className="space-y-4">
                        <span className="block text-xs font-bold text-neutral-400 uppercase tracking-widest font-mono">Simulate Cycle Shifting</span>
                        
                        <div className="space-y-5">
                          {/* 2 days shorter */}
                          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-0.5">
                              <span className="block text-xs font-black text-neutral-850 dark:text-neutral-100">If cycle is 2 days SHORTER ({results.avgCycle - 2} Days)</span>
                              <span className="block text-[10px] text-neutral-400">Ovulation day is pulled forward, meaning early peak fertile window.</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono">Shifted Peak Day</span>
                              <span className="block text-xs font-extrabold text-blue-600 dark:text-cyan-400">
                                {(() => {
                                  const d = new Date(results.currentCycle.ovulation);
                                  d.setDate(d.getDate() - 2);
                                  return formatDateLabel(d);
                                })()}
                              </span>
                            </div>
                          </div>

                          {/* Base calculated */}
                          <div className="p-4 rounded-2xl bg-blue-500/5 dark:bg-cyan-400/5 border border-blue-500/20 dark:border-cyan-400/25 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-0.5">
                              <span className="block text-xs font-black text-blue-600 dark:text-cyan-400">Your Base Cycle Estimate ({results.avgCycle} Days)</span>
                              <span className="block text-[10px] text-neutral-400">Current baseline calculation from input average.</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono">Peak Day</span>
                              <span className="block text-xs font-extrabold text-yellow-600 dark:text-yellow-400">
                                {formatDateLabel(results.currentCycle.ovulation)}
                              </span>
                            </div>
                          </div>

                          {/* 2 days longer */}
                          <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900/40 border border-neutral-200/50 dark:border-neutral-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="space-y-0.5">
                              <span className="block text-xs font-black text-neutral-850 dark:text-neutral-100">If cycle is 2 days LONGER ({results.avgCycle + 2} Days)</span>
                              <span className="block text-[10px] text-neutral-400">Ovulation day is pushed back, extending pre-fertile follicular phases.</span>
                            </div>
                            <div className="text-right">
                              <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono">Shifted Peak Day</span>
                              <span className="block text-xs font-extrabold text-purple-600 dark:text-cyan-400">
                                {(() => {
                                  const d = new Date(results.currentCycle.ovulation);
                                  d.setDate(d.getDate() + 2);
                                  return formatDateLabel(d);
                                })()}
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                )}

                {/* BMI & WELLNESS TAB */}
                {activeTab === 'health' && (
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="text-lg font-black text-neutral-900 dark:text-white">BMI, Adipose Balance &amp; Endocrinology</h4>
                      <p className="text-xs text-neutral-400">Calculate your BMI and understand the biological link between body mass, fat ratios, and ovulatory regularities.</p>
                    </div>

                    <div className="rounded-[32px] border border-white/50 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 sm:p-8 space-y-6">
                      
                      {/* BMI Calculator Inline */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Weight */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 flex justify-between">
                            <span>Your Weight</span>
                            <span className="flex items-center gap-1.5 font-normal">
                              <button 
                                onClick={() => setWeightUnit('kg')}
                                className={`text-[9px] font-bold ${weightUnit === 'kg' ? 'text-blue-500 underline' : 'text-neutral-400'}`}
                              >
                                kg
                              </button>
                              <span>/</span>
                              <button 
                                onClick={() => setWeightUnit('lbs')}
                                className={`text-[9px] font-bold ${weightUnit === 'lbs' ? 'text-blue-500 underline' : 'text-neutral-400'}`}
                              >
                                lbs
                              </button>
                            </span>
                          </label>
                          <input
                            type="number"
                            placeholder={weightUnit === 'kg' ? 'e.g. 62' : 'e.g. 135'}
                            value={weight}
                            onChange={(e) => setWeight(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition font-mono text-xs"
                          />
                        </div>

                        {/* Height */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 flex justify-between">
                            <span>Your Height</span>
                            <span className="flex items-center gap-1.5 font-normal">
                              <button 
                                onClick={() => setHeightUnit('cm')}
                                className={`text-[9px] font-bold ${heightUnit === 'cm' ? 'text-blue-500 underline' : 'text-neutral-400'}`}
                              >
                                cm
                              </button>
                              <span>/</span>
                              <button 
                                onClick={() => setHeightUnit('in')}
                                className={`text-[9px] font-bold ${heightUnit === 'in' ? 'text-blue-500 underline' : 'text-neutral-400'}`}
                              >
                                in
                              </button>
                            </span>
                          </label>
                          <input
                            type="number"
                            placeholder={heightUnit === 'cm' ? 'e.g. 168' : 'e.g. 66'}
                            value={height}
                            onChange={(e) => setHeight(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 dark:focus:border-cyan-400 focus:outline-none transition font-mono text-xs"
                          />
                        </div>
                      </div>

                      {/* BMI Output Analysis */}
                      <AnimatePresence mode="wait">
                        {bmiAnalysis ? (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/50 border border-neutral-200/50 dark:border-neutral-800/80 space-y-4"
                          >
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="text-neutral-500">Calculated Body Mass Index (BMI):</span>
                              <span className={`${bmiAnalysis.color} text-sm font-black`}>
                                {bmiAnalysis.value} kg/m² ({bmiAnalysis.category})
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                              <span className="block font-bold text-neutral-800 dark:text-neutral-200">Endocrine &amp; Fertility Impact:</span>
                              <p className="leading-normal">{bmiAnalysis.impact}</p>
                            </div>
                          </motion.div>
                        ) : (
                          <div className="p-4 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 text-center text-xs text-neutral-400 leading-relaxed">
                            Fill in your weight and height values above to check your BMI and learn how body mass indices affect natural estrogen balances, ovarian health, and follicle maturation periods.
                          </div>
                        )}
                      </AnimatePresence>

                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

      </div>

      {/* Integrated Scientific FAQs & Explanations Block */}
      <div className="rounded-[32px] border border-white/50 dark:border-neutral-850 bg-white/70 dark:bg-neutral-900/40 backdrop-blur-xl shadow-xl p-6 sm:p-8 space-y-6">
        <h4 className="text-lg font-black text-neutral-950 dark:text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" /> Deep Scientific FAQ &amp; Educational Center
        </h4>

        <div className="space-y-3 max-w-4xl">
          {[
            {
              question: 'How does the Ovulation Calculator estimate fertile windows?',
              answer: 'Our engine uses the calendar/rhythm estimation standard. Ovulation day is estimated by subtracting your luteal phase duration (typically 14 days) from the expected next period date. Since sperm can survive up to 5 days in supportive cervical secretions, and the egg remains viable for up to 24 hours, the fertile window spans the 5 days before ovulation plus ovulation day itself.'
            },
            {
              question: 'How does Irregular Cycle Mode calculate fertile timelines?',
              answer: 'If you have irregular cycles, standard calendar dating is inaccurate. Our Irregular Cycle Mode uses clinical Ogino-Knaus standard algorithms. The fertile window starts based on (Shortest Cycle Length - 18) days from your LMP and ends on (Longest Cycle Length - 11) days from LMP. This expands the window to provide safe coverage for tracking variables.'
            },
            {
              question: 'What is the Shettles Method for baby gender timing bias?',
              answer: 'The Shettles Method suggests that male (Y) sperm are smaller, faster, but less resilient to acidic vaginal environments. Intercourse occurring on the day of ovulation or immediately after favors male conception. Conversely, female (X) sperm are slower but larger and significantly more resilient, meaning intercourse 2-4 days prior to ovulation when mucus is more protective favors female oocyte fertilization.'
            },
            {
              question: 'Why are body mass indices (BMI) linked to menstrual regularities?',
              answer: 'Fat cells (adipose tissue) produce estrogen. When BMI is low (under 18.5), deficient estrogen production can prevent the LH surge from firing, resulting in anovulation. Conversely, high BMIs (above 30) can lead to excessive baseline estrogen levels, which suppresses follicular growth and can cause irregular cycle structures or insulin-resistant PCOS profiles.'
            }
          ].map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div 
                key={idx} 
                className="rounded-2xl border border-neutral-250/30 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/20 backdrop-blur-sm overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full px-5 py-4 flex justify-between items-center text-left text-xs font-extrabold text-neutral-850 dark:text-white hover:bg-neutral-100/50 dark:hover:bg-neutral-800/20 transition cursor-pointer"
                >
                  <span className="pr-4">{item.question}</span>
                  {isOpen 
                    ? <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 rotate-90 transition-transform" />
                    : <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0 transition-transform" />
                  }
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-neutral-100 dark:border-neutral-800/40">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
