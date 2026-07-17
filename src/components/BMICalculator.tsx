import React, { useState, useMemo, useRef } from 'react';
import { 
  Scale, 
  User, 
  Calendar as CalendarIcon, 
  Activity, 
  Dumbbell, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  Info, 
  BookOpen, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  Sparkles, 
  Download, 
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Apple,
  Clock,
  ArrowRight,
  Clipboard,
  ShieldCheck,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import html2canvas from 'html2canvas';

interface BMICalculatorProps {
  onNavigate: (page: string) => void;
}

export default function BMICalculator({ onNavigate }: BMICalculatorProps) {
  // --- STATE ---
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Required fields - starts empty
  const [height, setHeight] = useState<string>('');
  const [heightFeet, setHeightFeet] = useState<string>(''); // For imperial
  const [heightInches, setHeightInches] = useState<string>(''); // For imperial
  const [weight, setWeight] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');

  // Optional fields - starts empty
  const [age, setAge] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [activity, setActivity] = useState<string>('');
  const [bodyFrame, setBodyFrame] = useState<string>('');
  const [pregnancy, setPregnancy] = useState<boolean>(false);
  const [athlete, setAthlete] = useState<boolean>(false);
  const [ethnicity, setEthnicity] = useState<string>('');

  // What-If Analysis Weight Simulator (starts empty/null until enabled)
  const [testWeight, setTestWeight] = useState<string>('');

  // FAQ Expand
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  // Capture Ref for Export
  const dashboardRef = useRef<HTMLDivElement>(null);

  // --- HANDLERS ---
  const handleClearAll = () => {
    setHeight('');
    setHeightFeet('');
    setHeightInches('');
    setWeight('');
    setGender('');
    setAge('');
    setWaist('');
    setHip('');
    setNeck('');
    setActivity('');
    setBodyFrame('');
    setPregnancy(false);
    setAthlete(false);
    setEthnicity('');
    setTestWeight('');
  };

  const handleLoadExample = () => {
    setUnit('metric');
    setHeight('175');
    setWeight('78');
    setGender('male');
    setAge('28');
    setWaist('86');
    setNeck('37');
    setHip('');
    setActivity('moderate');
    setBodyFrame('medium');
    setPregnancy(false);
    setAthlete(false);
    setEthnicity('caucasian');
    setTestWeight('70');
  };

  // --- CALCULATION LOGIC ---
  const calculations = useMemo(() => {
    // Determine the raw height and weight
    let hVal = parseFloat(height);
    if (unit === 'imperial') {
      const feet = parseFloat(heightFeet) || 0;
      const inches = parseFloat(heightInches) || 0;
      hVal = (feet * 12) + inches;
    }
    const wVal = parseFloat(weight);

    // Guard on required fields
    if (!gender || isNaN(hVal) || isNaN(wVal) || hVal <= 0 || wVal <= 0) {
      return null;
    }

    // Convert to metric for uniform formula processing
    const isMetric = unit === 'metric';
    const hCm = isMetric ? hVal : hVal * 2.54;
    const wKg = isMetric ? wVal : wVal / 2.20462;

    // Input Validations
    if (hCm < 50 || hCm > 250 || wKg < 10 || wKg > 400) {
      return { 
        isValid: false, 
        errorMessage: 'Height must be between 50–250 cm (20-98 in) and weight between 10–400 kg (22-880 lbs).' 
      };
    }

    const ageNum = age ? parseInt(age) : null;
    if (ageNum !== null && (ageNum < 2 || ageNum > 120)) {
      return {
        isValid: false,
        errorMessage: 'Age must be between 2 and 120 years.'
      };
    }

    // Calculate BMI
    const heightM = hCm / 100;
    const bmi = wKg / (heightM * heightM);

    // Ethnicity Scale adaptation
    // Asian individuals have higher body fat at lower BMIs. WHO standard modified boundaries are:
    const isAsian = ethnicity === 'east_asian' || ethnicity === 'south_asian';
    const limits = isAsian ? [18.5, 23.0, 25.0, 30.0, 35.0] : [18.5, 25.0, 30.0, 35.0, 40.0];
    const categories = isAsian 
      ? ['Underweight', 'Normal Weight', 'Overweight', 'Obese Class I', 'Obese Class II', 'Obese Class III']
      : ['Underweight', 'Normal Weight', 'Overweight', 'Obese Class I', 'Obese Class II', 'Obese Class III'];

    let catIdx = 0;
    for (let i = 0; i < limits.length; i++) {
      if (bmi >= limits[i]) {
        catIdx = i + 1;
      }
    }

    const bmiCategory = categories[catIdx];
    const healthyMinBmi = 18.5;
    const healthyMaxBmi = isAsian ? 22.9 : 24.9;

    // Healthy weight limits
    const minHealthyKg = healthyMinBmi * (heightM * heightM);
    const maxHealthyKg = healthyMaxBmi * (heightM * heightM);

    const minHealthyDisplay = isMetric ? minHealthyKg : minHealthyKg * 2.20462;
    const maxHealthyDisplay = isMetric ? maxHealthyKg : maxHealthyKg * 2.20462;

    // Ideal Weight Formulas (Requires height in inches)
    const hIn = hCm / 2.54;
    const inchesOver5Ft = Math.max(0, hIn - 60);

    const devineBase = gender === 'male' ? 50.0 + 2.3 * inchesOver5Ft : 45.5 + 2.3 * inchesOver5Ft;
    const robinsonBase = gender === 'male' ? 52.0 + 1.9 * inchesOver5Ft : 49.0 + 1.7 * inchesOver5Ft;
    const millerBase = gender === 'male' ? 56.2 + 1.41 * inchesOver5Ft : 53.1 + 1.36 * inchesOver5Ft;
    const hamwiBase = gender === 'male' ? 48.0 + 2.7 * inchesOver5Ft : 45.5 + 2.2 * inchesOver5Ft;

    // Body frame multipliers
    let frameMult = 1.0;
    if (bodyFrame === 'small') frameMult = 0.9;
    if (bodyFrame === 'large') frameMult = 1.1;

    const devine = devineBase * frameMult;
    const robinson = robinsonBase * frameMult;
    const miller = millerBase * frameMult;
    const hamwi = hamwiBase * frameMult;

    const avgIdealKg = (devine + robinson + miller + hamwi) / 4;
    const idealDisplay = isMetric ? avgIdealKg : avgIdealKg * 2.20462;

    // Weight adjustments / needed weights
    let weightDiff = 0;
    let reachDir = 'maintain'; // 'lose' | 'gain' | 'maintain'

    if (wKg < minHealthyKg) {
      weightDiff = minHealthyKg - wKg;
      reachDir = 'gain';
    } else if (wKg > maxHealthyKg) {
      weightDiff = wKg - maxHealthyKg;
      reachDir = 'lose';
    }

    const weightDiffDisplay = isMetric ? weightDiff : weightDiff * 2.20462;

    // --- WAIST-TO-HEIGHT RATIO ---
    let wthr = null;
    let wthrRisk = '';
    let wthrColor = 'text-neutral-400';
    if (waist) {
      const waistVal = parseFloat(waist);
      const waistCm = isMetric ? waistVal : waistVal * 2.54;
      wthr = waistCm / hCm;
      if (wthr < 0.4) {
        wthrRisk = 'Extremely Slim (Risk)';
        wthrColor = 'text-blue-500';
      } else if (wthr <= 0.49) {
        wthrRisk = 'Low Risk (Healthy)';
        wthrColor = 'text-green-500';
      } else if (wthr <= 0.59) {
        wthrRisk = 'Increased Risk';
        wthrColor = 'text-amber-500';
      } else {
        wthrRisk = 'High Risk';
        wthrColor = 'text-red-500';
      }
    }

    // --- WAIST-HIP RATIO ---
    let whr = null;
    let whrRisk = '';
    let whrColor = 'text-neutral-400';
    if (waist && hip) {
      const waistVal = parseFloat(waist);
      const hipVal = parseFloat(hip);
      whr = waistVal / hipVal;

      if (gender === 'male') {
        if (whr < 0.90) { whrRisk = 'Low Risk'; whrColor = 'text-green-500'; }
        else if (whr <= 0.95) { whrRisk = 'Moderate Risk'; whrColor = 'text-amber-500'; }
        else { whrRisk = 'High Risk'; whrColor = 'text-red-500'; }
      } else {
        if (whr < 0.80) { whrRisk = 'Low Risk'; whrColor = 'text-green-500'; }
        else if (whr <= 0.85) { whrRisk = 'Moderate Risk'; whrColor = 'text-amber-500'; }
        else { whrRisk = 'High Risk'; whrColor = 'text-red-500'; }
      }
    }

    // --- BODY FAT (US Navy Circumference) ---
    let bfp = null;
    let bfpCategory = '';
    let leanMass = null;
    let fatMass = null;
    if (waist && neck && (gender === 'male' || hip)) {
      const wCm = isMetric ? parseFloat(waist) : parseFloat(waist) * 2.54;
      const nCm = isMetric ? parseFloat(neck) : parseFloat(neck) * 2.54;
      const hipCm = isMetric ? parseFloat(hip || '0') : parseFloat(hip || '0') * 2.54;

      if (gender === 'male') {
        const diffLog = wCm - nCm;
        if (diffLog > 0) {
          bfp = 86.010 * Math.log10(diffLog) - 70.041 * Math.log10(hCm) + 36.76;
        }
      } else {
        const diffLog = wCm + hipCm - nCm;
        if (diffLog > 0) {
          bfp = 163.205 * Math.log10(diffLog) - 97.684 * Math.log10(hCm) - 78.387;
        }
      }

      if (bfp !== null && bfp > 0 && bfp < 80) {
        // Athlete Mode modifier (-2% fat estimation adjustment due to muscle density differences)
        if (athlete) {
          bfp = Math.max(2, bfp - 2.5);
        }

        fatMass = wKg * (bfp / 100);
        leanMass = wKg - fatMass;

        if (gender === 'male') {
          if (bfp < 6) bfpCategory = 'Essential Fat';
          else if (bfp < 14) bfpCategory = 'Athletes';
          else if (bfp < 18) bfpCategory = 'Fitness';
          else if (bfp < 25) bfpCategory = 'Acceptable';
          else bfpCategory = 'Obese';
        } else {
          if (bfp < 14) bfpCategory = 'Essential Fat';
          else if (bfp < 21) bfpCategory = 'Athletes';
          else if (bfp < 25) bfpCategory = 'Fitness';
          else if (bfp < 32) bfpCategory = 'Acceptable';
          else bfpCategory = 'Obese';
        }
      }
    }

    // --- BMR (Mifflin-St Jeor) ---
    let bmr = null;
    if (ageNum) {
      bmr = gender === 'male'
        ? (10 * wKg) + (6.25 * hCm) - (5 * ageNum) + 5
        : (10 * wKg) + (6.25 * hCm) - (5 * ageNum) - 161;

      // Pregnancy boost (additional calories)
      if (gender === 'female' && pregnancy) {
        bmr += 300; // estimated gestational basal increase
      }
    }

    // --- DAILY CALORIES (TDEE) ---
    let tdee = null;
    if (bmr && activity) {
      const mults: Record<string, number> = {
        sedentary: 1.2,
        light: 1.375,
        moderate: 1.55,
        active: 1.725,
        heavy: 1.9
      };
      tdee = bmr * (mults[activity] || 1.2);
    }

    // --- WHAT IF SIMULATION ---
    let simulatedBmi = null;
    let simulatedBmiCategory = '';
    let simulatedTdee = null;
    let simulatedBfp = null;

    const testWNum = parseFloat(testWeight);
    if (!isNaN(testWNum) && testWNum > 0) {
      const testWKg = isMetric ? testWNum : testWNum / 2.20462;
      simulatedBmi = testWKg / (heightM * heightM);

      let simCatIdx = 0;
      for (let i = 0; i < limits.length; i++) {
        if (simulatedBmi >= limits[i]) {
          simCatIdx = i + 1;
        }
      }
      simulatedBmiCategory = categories[simCatIdx];

      if (bmr) {
        const simBmr = gender === 'male'
          ? (10 * testWKg) + (6.25 * hCm) - (5 * ageNum!) + 5
          : (10 * testWKg) + (6.25 * hCm) - (5 * ageNum!) - 161;
        
        const mults: Record<string, number> = {
          sedentary: 1.2,
          light: 1.375,
          moderate: 1.55,
          active: 1.725,
          heavy: 1.9
        };
        simulatedTdee = simBmr * (mults[activity] || 1.2);
      }

      if (bfp !== null) {
        // Simple fat offset estimation based on proportional changes
        const weightRatio = testWKg / wKg;
        simulatedBfp = Math.max(3, bfp * weightRatio);
      }
    }

    return {
      isValid: true,
      bmi,
      bmiCategory,
      catIdx,
      minHealthy: minHealthyDisplay,
      maxHealthy: maxHealthyDisplay,
      idealWeight: idealDisplay,
      weightDiff: weightDiffDisplay,
      reachDir,
      wthr,
      wthrRisk,
      wthrColor,
      whr,
      whrRisk,
      whrColor,
      bfp,
      bfpCategory,
      leanMass: leanMass ? (isMetric ? leanMass : leanMass * 2.20462) : null,
      fatMass: fatMass ? (isMetric ? fatMass : fatMass * 2.20462) : null,
      bmr,
      tdee,
      devine: isMetric ? devine : devine * 2.20462,
      robinson: isMetric ? robinson : robinson * 2.20462,
      miller: isMetric ? miller : miller * 2.20462,
      hamwi: isMetric ? hamwi : hamwi * 2.20462,
      isAsian,
      wKg,
      hCm,
      // What if
      simulatedBmi,
      simulatedBmiCategory,
      simulatedTdee,
      simulatedBfp
    };
  }, [
    height, heightFeet, heightInches, weight, gender, age, waist, hip, neck, 
    activity, bodyFrame, pregnancy, athlete, ethnicity, unit, testWeight
  ]);

  // Handle PNG Download
  const handleExportPng = async () => {
    if (!dashboardRef.current) return;
    try {
      const canvas = await html2canvas(dashboardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: null
      });
      const link = document.createElement('a');
      link.download = `Calculatoora_BMI_Report_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Failed to export dashboard:', err);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Disclaimer Alert */}
      <div className="rounded-3xl border border-blue-200 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 p-5 dark:border-neutral-800 dark:from-neutral-900/40 dark:to-neutral-900/20 backdrop-blur-md flex items-start gap-4">
        <Info className="w-5 h-5 text-blue-600 dark:text-cyan-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-xs font-bold text-blue-900 dark:text-neutral-200">
            Clinical Screening Disclaimer
          </p>
          <p className="text-xs text-blue-700/80 dark:text-neutral-400 leading-relaxed">
            BMI is a screening tool and does not directly measure body fat or diagnose medical conditions. Consult healthcare professionals for personalized clinical advice.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* INPUT COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-[32px] border border-white/50 bg-white/70 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-xl shadow-2xl p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-extrabold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> BIOMETRIC MEASUREMENTS
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLoadExample}
                  className="text-xs font-bold text-blue-600 dark:text-cyan-400 hover:underline transition flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Load Example
                </button>
                <span className="text-neutral-300 dark:text-neutral-700">|</span>
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-neutral-400 hover:text-red-500 transition flex items-center gap-1 cursor-pointer"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Metric/Imperial Selector */}
            <div className="flex p-1 rounded-2xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200/40 dark:border-neutral-850">
              <button
                onClick={() => { setUnit('metric'); handleClearAll(); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  unit === 'metric'
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-md'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                Metric (cm / kg)
              </button>
              <button
                onClick={() => { setUnit('imperial'); handleClearAll(); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  unit === 'imperial'
                    ? 'bg-white dark:bg-neutral-800 text-blue-600 dark:text-cyan-400 shadow-md'
                    : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                }`}
              >
                Imperial (ft-in / lbs)
              </button>
            </div>

            <div className="space-y-5">
              
              {/* Biological Sex (Required) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                  Gender (Required)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setGender('male')}
                    className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'male'
                        ? 'border-blue-500 bg-blue-50/40 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 ring-2 ring-blue-500/20'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900/40'
                    }`}
                  >
                    <User className="w-4 h-4" /> Male
                  </button>
                  <button
                    onClick={() => setGender('female')}
                    className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      gender === 'female'
                        ? 'border-pink-500 bg-pink-50/40 text-pink-700 dark:bg-pink-950/20 dark:text-pink-400 ring-2 ring-pink-500/20'
                        : 'border-neutral-200 dark:border-neutral-800 text-neutral-600 hover:bg-neutral-50 dark:text-neutral-400 dark:hover:bg-neutral-900/40'
                    }`}
                  >
                    <User className="w-4 h-4" /> Female
                  </button>
                </div>
              </div>

              {/* Height (Required) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex justify-between">
                  <span>Height (Required)</span>
                  <span>{unit === 'metric' ? 'cm' : 'feet & inches'}</span>
                </label>
                {unit === 'metric' ? (
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={heightFeet}
                      onChange={(e) => setHeightFeet(e.target.value)}
                      placeholder="Feet (e.g. 5)"
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm"
                    />
                    <input
                      type="number"
                      value={heightInches}
                      onChange={(e) => setHeightInches(e.target.value)}
                      placeholder="Inches (e.g. 9)"
                      className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm"
                    />
                  </div>
                )}
              </div>

              {/* Weight (Required) */}
              <div className="space-y-2">
                <label className="block text-xs font-extrabold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 flex justify-between">
                  <span>Weight (Required)</span>
                  <span>{unit === 'metric' ? 'kg' : 'lbs'}</span>
                </label>
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder={unit === 'metric' ? 'e.g. 70' : 'e.g. 154'}
                  className="w-full px-4 py-3.5 rounded-2xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 focus:outline-none transition-all shadow-sm"
                />
              </div>

              {/* OPTIONAL EXPANDABLE TOGGLE CARD */}
              <div className="p-4 rounded-3xl bg-neutral-50/50 dark:bg-neutral-950/30 border border-neutral-100 dark:border-neutral-850 space-y-4">
                <span className="block text-xs font-extrabold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-blue-500" /> Optional Advanced Factors
                </span>

                <div className="grid grid-cols-2 gap-3">
                  {/* Age */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      placeholder="e.g. 28"
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm"
                    />
                  </div>

                  {/* Frame Size */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Frame Size</label>
                    <select
                      value={bodyFrame}
                      onChange={(e) => setBodyFrame(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm"
                    >
                      <option value="">Select frame...</option>
                      <option value="small">Small Frame</option>
                      <option value="medium">Medium Frame</option>
                      <option value="large">Large Frame</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {/* Waist */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Waist ({unit === 'metric' ? 'cm' : 'in'})</label>
                    <input
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      placeholder="e.g. 82"
                      className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm animate-pulse"
                    />
                  </div>

                  {/* Neck */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Neck ({unit === 'metric' ? 'cm' : 'in'})</label>
                    <input
                      type="number"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      placeholder="e.g. 38"
                      className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm"
                    />
                  </div>

                  {/* Hip */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Hip ({unit === 'metric' ? 'cm' : 'in'})</label>
                    <input
                      type="number"
                      value={hip}
                      onChange={(e) => setHip(e.target.value)}
                      disabled={gender === 'male'}
                      placeholder={gender === 'male' ? 'N/A' : 'e.g. 96'}
                      className="w-full px-2.5 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm disabled:opacity-50"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/50">
                  {/* Activity Level */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Daily Activity Level</label>
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm"
                    >
                      <option value="">Select activity...</option>
                      <option value="sedentary">Sedentary (Little or no exercise)</option>
                      <option value="light">Lightly Active (Light exercise 1-3 days/wk)</option>
                      <option value="moderate">Moderately Active (Moderate exercise 3-5 days/wk)</option>
                      <option value="active">Very Active (Hard exercise 6-7 days/wk)</option>
                      <option value="heavy">Extra Active (Very intense exercise/sports & job)</option>
                    </select>
                  </div>

                  {/* Ethnicity selection for clinically adjusted thresholds */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase">Ethnicity (Standard vs Asian scales)</label>
                    <select
                      value={ethnicity}
                      onChange={(e) => setEthnicity(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm"
                    >
                      <option value="">Select ethnicity...</option>
                      <option value="caucasian">Standard / Caucasian / Black / Hispanic</option>
                      <option value="east_asian">East Asian (WHO Lowered Risk Thresholds)</option>
                      <option value="south_asian">South Asian (WHO Lowered Risk Thresholds)</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  {/* Athlete Mode */}
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-neutral-600 dark:text-neutral-300">
                    <input
                      type="checkbox"
                      checked={athlete}
                      onChange={(e) => setAthlete(e.target.checked)}
                      className="w-4 h-4 rounded text-blue-500 border-neutral-300 focus:ring-blue-500"
                    />
                    Athlete Mode
                  </label>

                  {/* Pregnancy Status (Female only) */}
                  {gender === 'female' && (
                    <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-bold text-pink-600 dark:text-pink-400">
                      <input
                        type="checkbox"
                        checked={pregnancy}
                        onChange={(e) => setPregnancy(e.target.checked)}
                        className="w-4 h-4 rounded text-pink-500 border-neutral-300 focus:ring-pink-500"
                      />
                      Is Pregnant
                    </label>
                  )}
                </div>

              </div>

            </div>
          </div>
        </div>

        {/* RESULTS PANEL (DASHBOARD) */}
        <div className="lg:col-span-7 space-y-6" ref={dashboardRef}>
          
          <AnimatePresence mode="wait">
            {!calculations ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="rounded-[32px] border border-dashed border-neutral-300 bg-neutral-50/50 p-12 text-center space-y-5 dark:border-neutral-800 dark:bg-neutral-900/10"
              >
                <div className="w-16 h-16 bg-blue-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <Scale className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                    Awaiting Biometric Data
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto leading-relaxed">
                    Provide your height, weight, and gender on the left to instantly calculate BMI and unlock advanced clinical metrics.
                  </p>
                </div>
                <button
                  onClick={handleLoadExample}
                  className="px-6 py-3 bg-neutral-900 hover:bg-blue-600 dark:bg-neutral-800 dark:hover:bg-cyan-500 text-white rounded-xl text-xs font-bold transition shadow-md active:scale-98 cursor-pointer"
                >
                  Load Example Biometrics
                </button>
              </motion.div>
            ) : !calculations.isValid ? (
              <motion.div
                key="error"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-red-200 bg-red-50/40 p-6 text-center space-y-3 dark:border-red-950/40 dark:bg-red-950/10"
              >
                <AlertTriangle className="w-8 h-8 text-red-500 mx-auto" />
                <p className="text-xs font-bold text-red-800 dark:text-red-400">
                  {calculations.errorMessage}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                {/* PRIMARY DASHBOARD CARD */}
                <div className="rounded-[32px] border border-white/50 bg-gradient-to-br from-white/90 to-neutral-50/50 p-6 sm:p-8 shadow-2xl dark:border-neutral-800 dark:from-neutral-900 dark:to-neutral-950/60 space-y-6">
                  
                  {/* Top Bar with export and category info */}
                  <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800/60 pb-4">
                    <div className="space-y-0.5">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase tracking-widest font-mono">Screening Metrics</span>
                      <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Your Health Status</h3>
                    </div>
                    <button
                      onClick={handleExportPng}
                      className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-750 dark:text-neutral-300 transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" /> Export Image
                    </button>
                  </div>

                  {/* Main Grid: BMI Score vs Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    
                    {/* BMI Value gauge representation */}
                    <div className="flex flex-col items-center justify-center space-y-3 bg-neutral-50/60 dark:bg-neutral-950/30 p-5 rounded-3xl border border-neutral-100 dark:border-neutral-800/60">
                      
                      {/* Interactive Arch Gauge SVG */}
                      <div className="relative w-40 h-24">
                        <svg className="w-full h-full" viewBox="0 0 100 50">
                          {/* Semicircular track */}
                          <path 
                            d="M 10,45 A 35,35 0 0,1 90,45" 
                            fill="none" 
                            stroke="url(#gauge-grad)" 
                            strokeWidth="10" 
                            strokeLinecap="round" 
                          />
                          
                          {/* Dial colors definitions */}
                          <defs>
                            <linearGradient id="gauge-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                              <stop offset="0%" stopColor="#3b82f6" /> {/* Underweight */}
                              <stop offset="35%" stopColor="#10b981" /> {/* Normal */}
                              <stop offset="65%" stopColor="#f59e0b" /> {/* Overweight */}
                              <stop offset="100%" stopColor="#ef4444" /> {/* Obese */}
                            </linearGradient>
                          </defs>

                          {/* Pointer needle based on BMI */}
                          {/* Map BMI (10 to 45) to angle (180 to 0 degrees) */}
                          {(() => {
                            const clampedBmi = Math.max(10, Math.min(45, calculations.bmi));
                            const percent = (clampedBmi - 10) / (45 - 10);
                            const angle = 180 - (percent * 180); // in degrees
                            const rad = (angle * Math.PI) / 180;
                            const x = 50 + 28 * Math.cos(rad);
                            const y = 45 - 28 * Math.sin(rad);
                            return (
                              <>
                                <line 
                                  x1="50" 
                                  y1="45" 
                                  x2={x} 
                                  y2={y} 
                                  stroke="#374151" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  className="dark:stroke-neutral-300"
                                />
                                <circle cx="50" cy="45" r="4" fill="#374151" className="dark:fill-neutral-300" />
                              </>
                            );
                          })()}
                        </svg>

                        {/* Centered BMI value */}
                        <div className="absolute inset-x-0 bottom-0 text-center">
                          <span className="block text-2xl font-black text-neutral-900 dark:text-white leading-none">
                            {calculations.bmi.toFixed(1)}
                          </span>
                          <span className="text-[9px] text-neutral-400 font-extrabold uppercase font-mono tracking-wider">
                            BMI VALUE
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-center text-neutral-400 max-w-[180px]">
                        WHO scale is standard for adult weights globally.
                      </p>
                    </div>

                    {/* Category details & quick insights */}
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border ${calculations.categoryBg} text-center md:text-left`}>
                        <span className="block text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                          Current Classification
                        </span>
                        <h4 className={`text-xl font-black ${calculations.categoryColor} mt-1`}>
                          {calculations.bmiCategory}
                        </h4>
                      </div>

                      <div className="space-y-2 text-xs">
                        {/* Healthy Weight Zone details */}
                        <div className="flex justify-between items-center text-neutral-500">
                          <span>Healthy Weight Zone:</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            {calculations.minHealthy.toFixed(1)} – {calculations.maxHealthy.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                          </span>
                        </div>

                        {/* Ideal Weight range based on formulas */}
                        <div className="flex justify-between items-center text-neutral-500">
                          <span>Ideal Target Weight:</span>
                          <span className="font-bold text-neutral-800 dark:text-neutral-200">
                            ~{calculations.idealWeight.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                          </span>
                        </div>

                        {/* Difference metric */}
                        {calculations.reachDir !== 'maintain' && (
                          <div className="flex justify-between items-center text-neutral-500 pt-1.5 border-t border-neutral-100 dark:border-neutral-800/60">
                            <span>Deviation from Healthy:</span>
                            <span className="font-bold text-red-500 dark:text-red-400">
                              {calculations.reachDir === 'lose' ? '+' : '-'}{calculations.weightDiff.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                  </div>

                  {/* Healthy Weight Progress Bar */}
                  <div className="space-y-2 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                    <div className="flex justify-between items-center text-xs text-neutral-500">
                      <span>Underweight</span>
                      <span className="text-green-500 font-bold">Healthy Range ({calculations.minHealthy.toFixed(0)} - {calculations.maxHealthy.toFixed(0)})</span>
                      <span>Overweight / Obese</span>
                    </div>
                    
                    {/* Visual Progress Line */}
                    <div className="relative w-full h-3.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden flex">
                      <div className="h-full bg-blue-400" style={{ width: '25%' }} />
                      <div className="h-full bg-green-500" style={{ width: '35%' }} />
                      <div className="h-full bg-yellow-400" style={{ width: '20%' }} />
                      <div className="h-full bg-red-500" style={{ width: '20%' }} />

                      {/* Your Indicator */}
                      {(() => {
                        const clamped = Math.max(10, Math.min(45, calculations.bmi));
                        const pct = ((clamped - 10) / (45 - 10)) * 100;
                        return (
                          <div 
                            className="absolute top-0 bottom-0 w-2 bg-neutral-900 border-2 border-white dark:bg-white dark:border-neutral-900 shadow-md transition-all duration-500" 
                            style={{ left: `${pct}%`, transform: 'translateX(-50%)' }}
                          />
                        );
                      })()}
                    </div>
                  </div>

                  {/* Rule-based Smart Insight banners */}
                  <div className="p-4 rounded-2xl bg-blue-50/30 border border-blue-100/50 dark:bg-neutral-900/40 dark:border-neutral-800 flex items-start gap-3.5">
                    <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-neutral-400">Personalized Insights</span>
                      <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed font-semibold">
                        {calculations.reachDir === 'maintain' 
                          ? 'Excellent! You are inside the clinically recommended healthy BMI category. Keep up your active routine.'
                          : `Losing or gaining approximately ${calculations.weightDiff.toFixed(1)} ${unit === 'metric' ? 'kg' : 'lbs'} would place you directly within the healthy BMI category.`}
                        {calculations.isAsian && ' Calculations adjusted using WHO guidelines for Asian populations, accounting for higher relative visceral fat concentration.'}
                      </p>
                    </div>
                  </div>

                </div>

                {/* ADVANCED HEALTH INDEXES: BODY FAT, WHR, WtHR */}
                {calculations.wthr !== null && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Waist-To-Height Ratio Index */}
                    <div className="rounded-3xl border border-neutral-100 bg-white/70 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-md space-y-3">
                      <span className="block text-[10px] font-extrabold uppercase text-neutral-400 font-mono">Waist-To-Height Ratio (WtHR)</span>
                      <div className="flex justify-between items-baseline">
                        <span className="text-2xl font-black text-neutral-900 dark:text-white">
                          {calculations.wthr.toFixed(2)}
                        </span>
                        <span className={`text-xs font-black uppercase ${calculations.wthrColor}`}>
                          {calculations.wthrRisk}
                        </span>
                      </div>
                      <p className="text-[11px] text-neutral-500 leading-relaxed">
                        {calculations.wthrAdvice} A waist circumference less than half of height is generally linked to low cardiovascular risks.
                      </p>
                    </div>

                    {/* Waist-Hip Ratio if available */}
                    {calculations.whr !== null && (
                      <div className="rounded-3xl border border-neutral-100 bg-white/70 p-6 dark:border-neutral-800/80 dark:bg-neutral-900/40 backdrop-blur-md space-y-3">
                        <span className="block text-[10px] font-extrabold uppercase text-neutral-400 font-mono">Waist-Hip Ratio (WHR)</span>
                        <div className="flex justify-between items-baseline">
                          <span className="text-2xl font-black text-neutral-900 dark:text-white">
                            {calculations.whr.toFixed(2)}
                          </span>
                          <span className={`text-xs font-black uppercase ${calculations.whrColor}`}>
                            {calculations.whrRisk}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-500 leading-relaxed">
                          This ratio evaluates regional fat deposition. Ratios exceeding 0.90 for males and 0.85 for females reflect standard android fat risks.
                        </p>
                      </div>
                    )}

                  </div>
                )}

                {/* BODY FAT & COMPOSITION CARDS */}
                {calculations.bfp !== null && (
                  <div className="rounded-[32px] border border-neutral-100 bg-white/70 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40 backdrop-blur-md space-y-6">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-widest">US Navy Method</span>
                      <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Estimated Body Fat &amp; Composition</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* BFP card */}
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 text-center space-y-1">
                        <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Body Fat %</span>
                        <span className="block text-2xl font-black text-blue-600 dark:text-cyan-400">
                          {calculations.bfp.toFixed(1)}%
                        </span>
                        <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                          {calculations.bfpCategory}
                        </span>
                      </div>

                      {/* Lean mass card */}
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 text-center space-y-1">
                        <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Lean Body Mass</span>
                        <span className="block text-2xl font-black text-green-500">
                          {calculations.leanMass?.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                        </span>
                        <span className="text-[10px] text-neutral-400 block leading-normal">
                          Muscle, bones, vital fluids
                        </span>
                      </div>

                      {/* Fat mass card */}
                      <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-950/40 border border-neutral-100 dark:border-neutral-850 text-center space-y-1">
                        <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Fat Mass</span>
                        <span className="block text-2xl font-black text-red-500">
                          {calculations.fatMass?.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}
                        </span>
                        <span className="text-[10px] text-neutral-400 block leading-normal">
                          Adipose reserve tissues
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* DAILY METRIC & CALORIE ANALYSIS */}
                {calculations.bmr !== null && (
                  <div className="rounded-[32px] border border-neutral-100 bg-white/70 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40 backdrop-blur-md space-y-6">
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-widest">Metabolic &amp; Nutrition Needs</span>
                      <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Energy Expenditure &amp; Targets</h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-950/30 border border-neutral-100 dark:border-neutral-850 space-y-1">
                        <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Basal Metabolic Rate (BMR)</span>
                        <span className="text-2xl font-black text-neutral-900 dark:text-white">
                          {calculations.bmr.toFixed(0)} <span className="text-xs font-normal text-neutral-400">kcal/day</span>
                        </span>
                        <p className="text-[11px] text-neutral-500 leading-relaxed pt-1 border-t border-neutral-200/40 dark:border-neutral-800/60">
                          Calories needed purely to sustain life functions in a completely vegetative resting state.
                        </p>
                      </div>

                      {calculations.tdee !== null ? (
                        <div className="p-5 rounded-2xl bg-blue-50/30 dark:bg-neutral-950/30 border border-blue-100/40 dark:border-neutral-850 space-y-1">
                          <span className="block text-[10px] font-extrabold text-neutral-400 uppercase">Maintenance Calories (TDEE)</span>
                          <span className="text-2xl font-black text-blue-600 dark:text-cyan-400">
                            {calculations.tdee.toFixed(0)} <span className="text-xs font-normal text-neutral-400">kcal/day</span>
                          </span>
                          <p className="text-[11px] text-neutral-500 leading-relaxed pt-1 border-t border-neutral-200/40 dark:border-neutral-800/60">
                            Includes daily active expenditure depending on physical activity levels.
                          </p>
                        </div>
                      ) : (
                        <div className="p-5 rounded-2xl border border-dashed border-neutral-200 text-center flex items-center justify-center text-xs text-neutral-400">
                          Select daily activity level above to estimate total maintenance and weight management calorie targets.
                        </div>
                      )}
                    </div>

                    {calculations.tdee !== null && (
                      <div className="space-y-4 pt-2 border-t border-neutral-100 dark:border-neutral-800/60">
                        <span className="block text-xs font-extrabold text-neutral-800 dark:text-neutral-200">Weight Management Targets</span>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/30 rounded-xl border border-neutral-100 dark:border-neutral-850 text-center">
                            <span className="block text-[10px] text-neutral-400">Mild Deficit (0.25 kg/wk)</span>
                            <span className="block font-black text-neutral-800 dark:text-neutral-100 mt-1">{(calculations.tdee - 250).toFixed(0)} kcal</span>
                          </div>
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/30 rounded-xl border border-neutral-100 dark:border-neutral-850 text-center">
                            <span className="block text-[10px] text-neutral-400">Moderate Deficit (0.5 kg/wk)</span>
                            <span className="block font-black text-blue-500 mt-1">{(calculations.tdee - 500).toFixed(0)} kcal</span>
                          </div>
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/30 rounded-xl border border-neutral-100 dark:border-neutral-850 text-center">
                            <span className="block text-[10px] text-neutral-400">Aggressive Deficit (0.75 kg/wk)</span>
                            <span className="block font-black text-red-500 mt-1">{Math.max(1200, calculations.tdee - 750).toFixed(0)} kcal</span>
                          </div>
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/30 rounded-xl border border-neutral-100 dark:border-neutral-850 text-center">
                            <span className="block text-[10px] text-neutral-400">Weight Gain (+0.5 kg/wk)</span>
                            <span className="block font-black text-green-500 mt-1">{(calculations.tdee + 500).toFixed(0)} kcal</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* IDEAL WEIGHT COMPARISON TABLE */}
                <div className="rounded-[32px] border border-neutral-100 bg-white/70 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40 backdrop-blur-md space-y-4">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-widest">Clinical Standard Comparison</span>
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Ideal Weight Formula Benchmarks</h4>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-bold uppercase font-mono">
                          <th className="py-2">Formula Standard</th>
                          <th className="py-2 text-right">Ideal Weight Output</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800 text-neutral-700 dark:text-neutral-300">
                        <tr>
                          <td className="py-3 font-semibold">Devine Formula (Standard medical standard)</td>
                          <td className="py-3 text-right font-bold text-neutral-900 dark:text-white">{calculations.devine.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">Robinson Formula (Ideal lean mass emphasis)</td>
                          <td className="py-3 text-right font-bold text-neutral-900 dark:text-white">{calculations.robinson.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">Miller Formula (Metabolically conservative scale)</td>
                          <td className="py-3 text-right font-bold text-neutral-900 dark:text-white">{calculations.miller.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}</td>
                        </tr>
                        <tr>
                          <td className="py-3 font-semibold">Hamwi Formula (Traditional clinical threshold)</td>
                          <td className="py-3 text-right font-bold text-neutral-900 dark:text-white">{calculations.hamwi.toFixed(1)} {unit === 'metric' ? 'kg' : 'lbs'}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* WHAT IF CALCULATOR SCENARIOS */}
                <div className="rounded-[32px] border border-neutral-100 bg-white/70 p-6 sm:p-8 dark:border-neutral-800 dark:bg-neutral-900/40 backdrop-blur-md space-y-6">
                  <div className="space-y-1">
                    <span className="block text-[10px] font-bold text-neutral-400 uppercase font-mono tracking-widest">Weight Simulator</span>
                    <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">What-If Weight Scenario Analysis</h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Test target weight options to dynamically compare simulated BMI, body fat, and daily calorie adjustments.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-neutral-500 mb-1.5 uppercase">Simulated Weight</label>
                        <input
                          type="number"
                          value={testWeight}
                          onChange={(e) => setTestWeight(e.target.value)}
                          placeholder={`Enter weight in ${unit === 'metric' ? 'kg' : 'lbs'}...`}
                          className="w-full px-3 py-2.5 text-xs rounded-xl border border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950 text-neutral-900 dark:text-white font-semibold focus:border-blue-500 focus:outline-none transition shadow-sm"
                        />
                      </div>
                    </div>

                    {calculations.simulatedBmi !== null && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3 bg-neutral-50 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
                          <span className="block text-[9px] text-neutral-400 uppercase">Simulated BMI</span>
                          <span className="block text-lg font-black text-blue-600 dark:text-cyan-400">{calculations.simulatedBmi.toFixed(1)}</span>
                          <span className="text-[9px] font-bold text-neutral-400 uppercase block">{calculations.simulatedBmiCategory}</span>
                        </div>

                        {calculations.simulatedBfp !== null && (
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
                            <span className="block text-[9px] text-neutral-400 uppercase">Simulated Body Fat</span>
                            <span className="block text-lg font-black text-green-500">{calculations.simulatedBfp.toFixed(1)}%</span>
                          </div>
                        )}

                        {calculations.simulatedTdee !== null && (
                          <div className="p-3 bg-neutral-50 dark:bg-neutral-950/20 border border-neutral-100 dark:border-neutral-850 rounded-xl text-center">
                            <span className="block text-[9px] text-neutral-400 uppercase">Simulated TDEE Calories</span>
                            <span className="block text-lg font-black text-neutral-900 dark:text-white">{calculations.simulatedTdee.toFixed(0)} kcal</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>

      {/* COMPREHENSIVE SEO CONTENT SECTION */}
      <div className="rounded-[40px] border border-neutral-100 bg-white p-8 sm:p-12 shadow-xl dark:border-neutral-900 dark:bg-neutral-950 space-y-10">
        
        <div className="space-y-3">
          <span className="font-mono text-xs uppercase tracking-widest text-blue-600 dark:text-cyan-400 font-extrabold block">EDUCATIONAL PORTAL &amp; RESOURCE</span>
          <h2 className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-none">
            Deep Scientific Guide to BMI &amp; Body Composition
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-3xl">
            Body Mass Index remains one of the simplest, most effective screening standards utilized globally by health organizations. Discover how the formula is designed, its key limitations, and when you should prioritize other metrics such as body fat percentage or waist-to-height ratio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
          
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">What Is Body Mass Index (BMI)?</h3>
            <p>
              Body Mass Index (BMI) is a medical screening tool that estimates the relative percentage of body adipose tissue based on height and weight. First developed by Adolphe Quetelet in the 19th century, it is used by clinics, hospitals, and fitness professionals to quickly screen individuals for potential underweight, normal weight, overweight, or obese status.
            </p>
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">How Is BMI Calculated?</h3>
            <p>
              The basic standard calculation of BMI requires dividing an individual's weight in kilograms by the square of their height in meters.
            </p>
            <div className="p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 font-mono text-xs text-neutral-800 dark:text-neutral-200 space-y-2">
              <p className="font-bold">Metric Formula:</p>
              <p>BMI = weight (kg) / [height (m)]²</p>
              <p className="font-bold pt-2">Imperial Formula:</p>
              <p>BMI = [weight (lbs) / height (inches)²] * 703</p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">BMI Classification Ranges (WHO Standards)</h3>
            <div className="overflow-hidden border border-neutral-100 dark:border-neutral-800 rounded-2xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 text-neutral-400 font-bold font-mono">
                    <th className="p-3">BMI Range</th>
                    <th className="p-3">WHO Category Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 dark:divide-neutral-850">
                  <tr>
                    <td className="p-3 font-mono text-blue-500 font-bold">Below 18.5</td>
                    <td className="p-3">Underweight</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-green-500 font-bold">18.5 – 24.9</td>
                    <td className="p-3">Normal/Healthy Weight</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-yellow-500 font-bold">25.0 – 29.9</td>
                    <td className="p-3">Overweight</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-orange-500 font-bold">30.0 – 34.9</td>
                    <td className="p-3">Obesity Class I</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-red-500 font-bold">35.0 – 39.9</td>
                    <td className="p-3">Obesity Class II</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono text-purple-600 font-bold">40.0 and above</td>
                    <td className="p-3">Obesity Class III</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed border-t border-neutral-100 dark:border-neutral-800/60 pt-8">
          
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Why Select Custom Scales for Ethnicity?</h3>
            <p>
              Standard clinical research indicates that individuals of South Asian and East Asian ancestry tend to carry higher visceral adipose concentrations and face elevated metabolic risk factors (such as type 2 diabetes and hypertension) at much lower body mass indexes than standard populations. Thus, the World Health Organization recommends tighter cutoffs for Asian demographics, treating any BMI above 23.0 as overweight, and above 25.0 as clinically obese.
            </p>
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Key Limitations of BMI</h3>
            <p>
              While BMI is incredibly helpful for simple group statistics and preliminary evaluations, it has several notable limitations:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs">
              <li><strong>Does not distinguish muscle from fat:</strong> Heavily trained athletes and bodybuilders with high skeletal muscle density are frequently classified as overweight or obese, despite carrying minimal body fat.</li>
              <li><strong>Misses fat distribution:</strong> It cannot distinguish between subcutaneous fat and dangerous visceral fat stored deeply around core thoracic organs.</li>
              <li><strong>Altered by age:</strong> Seniors and older adults often lose significant muscle density (sarcopenia), leading to underestimated body fat even with a stable normal range BMI.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-neutral-900 dark:text-white">Healthy Weight Maintenance Tips</h3>
            <p>
              Reaching or sustaining a healthy clinical body weight goes far beyond the scale. It relies on a synergistic blend of steady activity, rich nutrition, and metabolic balance:
            </p>
            <ul className="list-decimal pl-5 space-y-2 text-xs">
              <li><strong>Integrate Resistance Training:</strong> Building skeletal muscle density raises your Basal Metabolic Rate (BMR), supporting steady calorie expenditure even at rest.</li>
              <li><strong>Watch Abdominal Fat Depositions:</strong> Tracking Waist-to-Height and Waist-Hip ratios helps evaluate potential visceral fat risks. Keep waist circumferences below half of height.</li>
              <li><strong>Optimize Calorie Deficits Carefully:</strong> If losing weight, use moderate caloric deficits (250–500 kcal below maintenance) to protect critical lean muscle mass and maintain energy levels.</li>
            </ul>
          </div>

        </div>

        {/* RELATED CALCULATORS CARDS */}
        <div className="space-y-5 border-t border-neutral-100 dark:border-neutral-800/60 pt-8">
          <h4 className="text-base font-extrabold text-neutral-900 dark:text-white">Related Diagnostic Tools</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-bold text-neutral-500">
            <button
              onClick={() => onNavigate('calculator:calorie-calculator')}
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-blue-50/50 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-center border border-neutral-100 dark:border-neutral-800 text-blue-600 dark:text-cyan-400 transition cursor-pointer"
            >
              Calorie Calculator
            </button>
            <button
              onClick={() => onNavigate('calculator:ideal-weight-calculator')}
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-blue-50/50 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-center border border-neutral-100 dark:border-neutral-800 text-blue-600 dark:text-cyan-400 transition cursor-pointer"
            >
              Ideal Weight Calculator
            </button>
            <button
              onClick={() => onNavigate('calculator:pregnancy-calculator')}
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-blue-50/50 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-center border border-neutral-100 dark:border-neutral-800 text-blue-600 dark:text-cyan-400 transition cursor-pointer"
            >
              Pregnancy Calculator
            </button>
            <button
              onClick={() => onNavigate('calculator:age-calculator')}
              className="p-4 rounded-2xl bg-neutral-50 hover:bg-blue-50/50 dark:bg-neutral-900 dark:hover:bg-neutral-850 text-center border border-neutral-100 dark:border-neutral-800 text-blue-600 dark:text-cyan-400 transition cursor-pointer"
            >
              Age Calculator
            </button>
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="space-y-4 border-t border-neutral-100 dark:border-neutral-800/60 pt-8">
          <h4 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-1.5">
            <HelpCircle className="w-5 h-5 text-neutral-400" /> Frequently Asked Questions
          </h4>

          <div className="space-y-3">
            {[
              {
                q: 'What is a clinically standard BMI range for adults?',
                a: 'For standard demographics, the WHO classifies a BMI between 18.5 and 24.9 as a healthy normal weight range. Any value below 18.5 is underweight, values from 25.0 to 29.9 are overweight, and values 30.0 or higher are obesity.'
              },
              {
                q: 'Why does our calculator ask for Waist, Neck, and Hip values?',
                a: 'Adding waist, neck, and hip circumferences allows our system to estimate body fat percentage using the highly regarded US Navy Circumference Method, which gives a much clearer picture of lean vs. fat distribution than weight alone.'
              },
              {
                q: 'How does pregnancy affect BMI interpretations?',
                a: 'During pregnancy, both maternal fluids and gestational weight increase rapidly to support the fetus. Standard BMI scales are highly inaccurate during this time. Pregnant individuals should consult their obstetrician for personalized healthy weight targets.'
              }
            ].map((faq, fIdx) => (
              <div 
                key={`faq-${fIdx}`}
                className="rounded-2xl border border-neutral-100 dark:border-neutral-850 bg-neutral-50/30 overflow-hidden"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === fIdx ? null : fIdx)}
                  className="w-full p-4 text-left font-bold text-xs text-neutral-850 dark:text-neutral-200 flex justify-between items-center hover:bg-neutral-100/40 dark:hover:bg-neutral-900/30 transition cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {expandedFaq === fIdx ? <ChevronUp className="w-4 h-4 shrink-0" /> : <ChevronDown className="w-4 h-4 shrink-0" />}
                </button>
                <AnimatePresence>
                  {expandedFaq === fIdx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4 text-xs text-neutral-500 leading-relaxed border-t border-neutral-100 dark:border-neutral-850"
                    >
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
