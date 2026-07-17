import React, { useState, useMemo, useRef } from 'react';
import { 
  Activity, 
  Flame, 
  Scale, 
  Dumbbell, 
  TrendingDown, 
  TrendingUp, 
  Heart, 
  Utensils, 
  Droplet, 
  Info, 
  BookOpen, 
  HelpCircle, 
  RefreshCw, 
  Check, 
  Sparkles, 
  ChevronRight, 
  Download, 
  AlertTriangle,
  User,
  Plus,
  Trash2,
  Layers,
  ArrowUpDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip as RechartsTooltip, 
  Legend, 
  LineChart, 
  Line, 
  CartesianGrid 
} from 'recharts';
import html2canvas from 'html2canvas';

// --- TYPES ---
interface Scenario {
  id: string;
  name: string;
  age: string;
  gender: 'male' | 'female' | '';
  weight: string;
  height: string;
  activity: string;
  customActivity: string;
  goal: string;
  unit: 'metric' | 'imperial';
  bodyFat: string;
  lbm: string;
  method: string;
  macroSplit: string;
  pregnant: boolean;
  breastfeeding: boolean;
  athlete: boolean;
}

export default function CalorieCalculator({ onNavigate }: { onNavigate: (page: string) => void }) {
  // --- STATE ---
  const [activeTab, setActiveTab] = useState<'calculator' | 'compare' | 'seo'>('calculator');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  
  // Required Inputs (start empty)
  const [age, setAge] = useState<string>('');
  const [gender, setGender] = useState<'male' | 'female' | ''>('');
  const [weight, setWeight] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [activity, setActivity] = useState<string>('');
  const [customActivity, setCustomActivity] = useState<string>('');

  // Optional Inputs
  const [targetWeight, setTargetWeight] = useState<string>('');
  const [bodyFat, setBodyFat] = useState<string>('');
  const [lbm, setLbm] = useState<string>('');
  const [neck, setNeck] = useState<string>('');
  const [waist, setWaist] = useState<string>('');
  const [hip, setHip] = useState<string>('');
  const [goal, setGoal] = useState<string>('lose_moderate');
  const [pregnant, setPregnant] = useState<boolean>(false);
  const [breastfeeding, setBreastfeeding] = useState<boolean>(false);
  const [athlete, setAthlete] = useState<boolean>(false);

  // Preference Settings
  const [method, setMethod] = useState<string>('mifflin');
  const [macroSplit, setMacroSplit] = useState<string>('balanced');
  const [customProtein, setCustomProtein] = useState<string>('30');
  const [customFat, setCustomFat] = useState<string>('30');
  const [customCarb, setCustomCarb] = useState<string>('40');
  const [mealsCount, setMealsCount] = useState<string>('3');
  const [climate, setClimate] = useState<string>('temperate');

  // Exercise Custom Duration
  const [exerciseDuration, setExerciseDuration] = useState<string>('30');

  // Scenario Sandbox State
  const [scenarios, setScenarios] = useState<Scenario[]>([]);
  const [scenarioNameInput, setScenarioNameInput] = useState<string>('');

  // Info message / notices
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Dashboard Ref for downloading PNG
  const dashboardRef = useRef<HTMLDivElement>(null);

  // --- CALCULATION FORMULAS & ENGINES ---
  const validationErrors = useMemo(() => {
    const errors: string[] = [];
    if (age) {
      const a = Number(age);
      if (isNaN(a) || a < 1 || a > 120) {
        errors.push("Age must be a valid number between 1 and 120.");
      }
    }
    if (weight) {
      const w = Number(weight);
      if (isNaN(w) || w <= 0) {
        errors.push("Weight must be a positive number.");
      }
    }
    if (height) {
      const h = Number(height);
      if (isNaN(h) || h <= 0) {
        errors.push("Height must be a positive number.");
      }
    }
    if (bodyFat) {
      const bf = Number(bodyFat);
      if (isNaN(bf) || bf < 0 || bf > 70) {
        errors.push("Body Fat % must be a number between 0 and 70.");
      }
    }
    if (customActivity && activity === 'custom') {
      const act = Number(customActivity);
      if (isNaN(act) || act < 1.0 || act > 2.5) {
        errors.push("Custom activity multiplier must be between 1.0 and 2.5.");
      }
    }
    return errors;
  }, [age, weight, height, bodyFat, activity, customActivity]);

  const hasRequiredFields = useMemo(() => {
    return age !== '' && gender !== '' && weight !== '' && height !== '' && activity !== '';
  }, [age, gender, weight, height, activity]);

  // Compute stats
  const calculatedStats = useMemo(() => {
    if (!hasRequiredFields || validationErrors.length > 0) return null;

    const ageNum = Number(age);
    const weightVal = Number(weight);
    const heightVal = Number(height);

    // Standardize to Metric for core metabolic calculations
    const weightKg = unit === 'imperial' ? weightVal * 0.45359237 : weightVal;
    const heightCm = unit === 'imperial' ? heightVal * 2.54 : heightVal;
    const targetWeightKg = targetWeight ? (unit === 'imperial' ? Number(targetWeight) * 0.45359237 : Number(targetWeight)) : null;

    // 1. Body Fat % Estimation / Navy formula
    let calculatedBF = bodyFat ? Number(bodyFat) : null;
    let bodyFatMethod = 'Direct Input';

    if (!calculatedBF && neck && waist) {
      const neckVal = Number(neck);
      const waistVal = Number(waist);
      const hipVal = Number(hip);

      const neckCm = unit === 'imperial' ? neckVal * 2.54 : neckVal;
      const waistCm = unit === 'imperial' ? waistVal * 2.54 : waistVal;
      const hipCm = unit === 'imperial' ? hipVal * 2.54 : hipVal;

      if (gender === 'male') {
        if (waistCm > neckCm) {
          const density = 1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm);
          calculatedBF = Math.max(2, Math.min(65, (495 / density) - 450));
          bodyFatMethod = 'US Navy tape method';
        }
      } else if (gender === 'female' && hip) {
        if (waistCm + hipCm > neckCm) {
          const density = 1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm);
          calculatedBF = Math.max(2, Math.min(65, (495 / density) - 450));
          bodyFatMethod = 'US Navy tape method';
        }
      }
    }

    // Fallback BMI-based body fat estimation
    const bmiVal = weightKg / Math.pow(heightCm / 100, 2);
    if (!calculatedBF) {
      const genderFactor = gender === 'male' ? 1 : 0;
      calculatedBF = (1.20 * bmiVal) + (0.23 * ageNum) - (10.8 * genderFactor) - 5.4;
      calculatedBF = Math.max(2, Math.min(65, calculatedBF));
      bodyFatMethod = 'BMI-based estimate';
    }

    // 2. Lean Body Mass & Fat Mass
    const calculatedLBM = lbm ? Number(lbm) : weightKg * (1 - calculatedBF / 100);
    const fatMass = weightKg * (calculatedBF / 100);

    // 3. BMR Methods comparison
    const bmrMifflin = gender === 'male' 
      ? 10 * weightKg + 6.25 * heightCm - 5 * ageNum + 5
      : 10 * weightKg + 6.25 * heightCm - 5 * ageNum - 161;

    const bmrHarrisOriginal = gender === 'male'
      ? 66.4730 + 13.7516 * weightKg + 5.0033 * heightCm - 6.7550 * ageNum
      : 655.0955 + 9.5634 * weightKg + 1.8496 * heightCm - 4.6756 * ageNum;

    const bmrHarrisRevised = gender === 'male'
      ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * ageNum
      : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.330 * ageNum;

    const bmrKatch = 370 + 21.6 * calculatedLBM;
    const bmrCunningham = 500 + 22 * calculatedLBM;

    // Selected BMR
    let activeBMR = bmrMifflin;
    if (method === 'harris_orig') activeBMR = bmrHarrisOriginal;
    else if (method === 'harris_rev') activeBMR = bmrHarrisRevised;
    else if (method === 'katch') activeBMR = bmrKatch;
    else if (method === 'cunningham') activeBMR = bmrCunningham;

    // 4. Activity Multiplier
    let actMultiplier = 1.2; // default sedentary
    if (activity === 'sedentary') actMultiplier = 1.2;
    else if (activity === 'light') actMultiplier = 1.375;
    else if (activity === 'moderate') actMultiplier = 1.55;
    else if (activity === 'active') actMultiplier = 1.725;
    else if (activity === 'extreme') actMultiplier = 1.9;
    else if (activity === 'custom' && customActivity) actMultiplier = Number(customActivity);

    // Total Daily Energy Expenditure
    const tdee = activeBMR * actMultiplier;

    // Goal adjustments
    let goalAdjustment = 0;
    if (goal === 'lose_mild') goalAdjustment = -250;
    else if (goal === 'lose_moderate') goalAdjustment = -500;
    else if (goal === 'lose_aggressive') goalAdjustment = -750;
    else if (goal === 'gain_lean') goalAdjustment = 250;
    else if (goal === 'gain_moderate') goalAdjustment = 500;
    else if (goal === 'gain_aggressive') goalAdjustment = 1000;

    let pregnancyAdjustment = 0;
    if (pregnant) pregnancyAdjustment = 350;
    if (breastfeeding) pregnancyAdjustment = 500;

    const targetCalories = Math.max(1000, tdee + goalAdjustment + pregnancyAdjustment);

    // 5. Macronutrients grams calculation
    // Splits: balanced, high_protein, low_carb, keto, custom
    let pPct = 30, fPct = 30, cPct = 40;
    if (macroSplit === 'high_protein') {
      pPct = 40; fPct = 25; cPct = 35;
    } else if (macroSplit === 'low_carb') {
      pPct = 35; fPct = 40; cPct = 25;
    } else if (macroSplit === 'keto') {
      pPct = 25; fPct = 70; cPct = 5;
    } else if (macroSplit === 'custom') {
      pPct = Number(customProtein) || 30;
      fPct = Number(customFat) || 30;
      cPct = Number(customCarb) || 40;
    }

    // Athlete mode modification (prioritize protein to at least 2.0g per kg of body weight)
    let athleteModified = false;
    if (athlete) {
      const minProteinGrams = weightKg * 2.2;
      const minProteinCals = minProteinGrams * 4;
      const targetProteinPct = Math.round((minProteinCals / targetCalories) * 100);
      if (targetProteinPct > pPct && macroSplit !== 'custom') {
        pPct = targetProteinPct;
        const remainder = 100 - pPct;
        fPct = Math.round(remainder * 0.4);
        cPct = 100 - pPct - fPct;
        athleteModified = true;
      }
    }

    const proteinCalories = (targetCalories * pPct) / 100;
    const fatCalories = (targetCalories * fPct) / 100;
    const carbCalories = (targetCalories * cPct) / 100;

    const proteinGrams = proteinCalories / 4;
    const fatGrams = fatCalories / 9;
    const carbGrams = carbCalories / 4;

    const fiberGrams = (targetCalories / 1000) * 14;

    // 6. Water intake calculation
    // Metric base: 35 ml/kg. Imperial base: 0.5 oz/lb.
    let baseWaterMl = weightKg * 35;
    if (climate === 'hot') baseWaterMl += 500;
    else if (climate === 'cold') baseWaterMl -= 200;

    if (actMultiplier >= 1.55) baseWaterMl += 750; // extra hydration for athletes

    const waterLiters = baseWaterMl / 1000;
    const waterOunces = baseWaterMl * 0.033814;

    // Ideal weight using Devine
    const heightInInches = heightCm / 2.54;
    let devineIdealKg = 50;
    if (heightInInches > 60) {
      devineIdealKg = gender === 'male'
        ? 50 + 2.3 * (heightInInches - 60)
        : 45.5 + 2.3 * (heightInInches - 60);
    }
    const bmiMinWeightKg = 18.5 * Math.pow(heightCm / 100, 2);
    const bmiMaxWeightKg = 24.9 * Math.pow(heightCm / 100, 2);

    return {
      bmi: bmiVal,
      bodyFat: calculatedBF,
      bodyFatMethod,
      lbm: calculatedLBM,
      fatMass,
      weightKg,
      heightCm,
      targetWeightKg,
      bmrMifflin,
      bmrHarrisOriginal,
      bmrHarrisRevised,
      bmrKatch,
      bmrCunningham,
      activeBMR,
      tdee,
      targetCalories,
      macros: {
        protein: { g: proteinGrams, cal: proteinCalories, pct: pPct },
        fat: { g: fatGrams, cal: fatCalories, pct: fPct },
        carb: { g: carbGrams, cal: carbCalories, pct: cPct },
        fiber: fiberGrams,
        athleteModified
      },
      water: { ml: baseWaterMl, liters: waterLiters, oz: waterOunces },
      idealWeight: {
        devine: devineIdealKg,
        minBmi: bmiMinWeightKg,
        maxBmi: bmiMaxWeightKg
      }
    };
  }, [
    hasRequiredFields, validationErrors, age, weight, height, gender, activity, customActivity,
    targetWeight, bodyFat, lbm, neck, waist, hip, goal, pregnant, breastfeeding, athlete,
    method, macroSplit, customProtein, customFat, customCarb, climate, unit
  ]);

  // Weight Projection over 1, 3, 6, 12 months
  const weightProjectionData = useMemo(() => {
    if (!calculatedStats) return [];
    
    const startW = unit === 'imperial' ? Number(weight) : calculatedStats.weightKg;
    const dailyDeficitOrSurplus = calculatedStats.targetCalories - calculatedStats.tdee;
    
    // 7700 kcal per kg of fat, 3500 kcal per lb of fat
    const calorieConstant = unit === 'imperial' ? 3500 : 7700;
    const weightChangePerDay = dailyDeficitOrSurplus / calorieConstant;

    const months = [0, 1, 3, 6, 12];
    return months.map(m => {
      const days = m * 30.4;
      const change = weightChangePerDay * days;
      const projW = Math.max(30, startW + change);
      return {
        month: m === 0 ? 'Start' : `${m} Mo`,
        weight: Math.round(projW * 10) / 10,
        change: Math.round(change * 10) / 10
      };
    });
  }, [calculatedStats, weight, unit]);

  // Calorie Burn (Exercise MET Calculator)
  const exerciseCalorieBurn = useMemo(() => {
    if (!calculatedStats) return [];
    
    const duration = Number(exerciseDuration) || 30;
    const weightKg = calculatedStats.weightKg;

    const activities = [
      { name: 'Running', met: 9.8, color: '#ef4444' },
      { name: 'HIIT', met: 8.0, color: '#f97316' },
      { name: 'Cycling', met: 7.5, color: '#3b82f6' },
      { name: 'Jump Rope', met: 11.0, color: '#8b5cf6' },
      { name: 'Swimming', met: 6.0, color: '#06b6d4' },
      { name: 'Rowing', met: 7.0, color: '#10b981' },
      { name: 'Stair Climbing', met: 4.0, color: '#a855f7' },
      { name: 'Walking', met: 3.5, color: '#22c55e' },
      { name: 'Strength Training', met: 3.5, color: '#ec4899' },
      { name: 'Yoga', met: 2.5, color: '#eab308' }
    ];

    return activities.map(act => {
      // Calories = MET * 3.5 * weightKg / 200 * duration
      const burned = act.met * 3.5 * weightKg / 200 * duration;
      return {
        ...act,
        calories: Math.round(burned)
      };
    });
  }, [calculatedStats, exerciseDuration]);

  // Meal Distribution Planner
  const mealDistributionData = useMemo(() => {
    if (!calculatedStats) return [];

    const totalCals = calculatedStats.targetCalories;
    const count = Number(mealsCount) || 3;
    const macros = calculatedStats.macros;

    // Suggested Splits
    let splits: number[] = [];
    let labels: string[] = [];

    if (count === 3) {
      splits = [35, 35, 30];
      labels = ['Breakfast', 'Lunch', 'Dinner'];
    } else if (count === 4) {
      splits = [30, 30, 30, 10];
      labels = ['Breakfast', 'Lunch', 'Dinner', 'PM Snack'];
    } else if (count === 5) {
      splits = [25, 10, 30, 10, 25];
      labels = ['Breakfast', 'AM Snack', 'Lunch', 'PM Snack', 'Dinner'];
    } else {
      splits = [20, 15, 20, 10, 20, 15];
      labels = ['Breakfast', 'AM Snack', 'Lunch', 'PM Snack 1', 'Dinner', 'PM Snack 2'];
    }

    return splits.map((pct, idx) => {
      const cals = (totalCals * pct) / 100;
      return {
        name: labels[idx] || `Meal ${idx + 1}`,
        pct,
        calories: Math.round(cals),
        protein: Math.round((macros.protein.g * pct) / 100),
        fat: Math.round((macros.fat.g * pct) / 100),
        carb: Math.round((macros.carb.g * pct) / 100)
      };
    });
  }, [calculatedStats, mealsCount]);

  // Rule-based clinical insights
  const healthInsights = useMemo(() => {
    if (!calculatedStats) return [];
    
    const insights: { text: string; type: 'warning' | 'success' | 'info' }[] = [];
    const b = calculatedStats.bmi;
    const bf = calculatedStats.bodyFat || 0;
    const dailyDeficitOrSurplus = calculatedStats.targetCalories - calculatedStats.tdee;

    // BMI range
    if (b < 18.5) {
      insights.push({ text: `Your BMI is ${b.toFixed(1)} (Underweight). Focus on a structured muscle-building surplus.`, type: 'warning' });
    } else if (b >= 18.5 && b <= 24.9) {
      insights.push({ text: `Your BMI is ${b.toFixed(1)} (Healthy/Normal weight range). Great job maintaining!`, type: 'success' });
    } else if (b >= 25.0 && b <= 29.9) {
      insights.push({ text: `Your BMI is ${b.toFixed(1)} (Overweight range). Standard biological models suggest a progressive calorie deficit.`, type: 'info' });
    } else {
      insights.push({ text: `Your BMI is ${b.toFixed(1)} (Obese range). Consider consulting a registered dietitian alongside a sustainable calorie deficit.`, type: 'warning' });
    }

    // Body fat classifications
    if (gender === 'male') {
      if (bf < 6) insights.push({ text: `Your estimated body fat (${bf.toFixed(1)}%) is extremely low (Essential/Athletic threshold). Ensure adequate lipid levels.`, type: 'warning' });
      else if (bf >= 6 && bf <= 13) insights.push({ text: `Your body fat (${bf.toFixed(1)}%) falls in the athletic tier. Optimized for peak muscle metabolism.`, type: 'success' });
      else if (bf >= 25) insights.push({ text: `Your body fat is ${bf.toFixed(1)}%. Prioritize lean body mass retention while dieting.`, type: 'info' });
    } else {
      if (bf < 14) insights.push({ text: `Your body fat (${bf.toFixed(1)}%) is highly depleted. Standard endocrine functions require higher dietary lipids.`, type: 'warning' });
      else if (bf >= 14 && bf <= 20) insights.push({ text: `Your body fat (${bf.toFixed(1)}%) is within the athletic tier. High neuromuscular and aerobic recovery potential.`, type: 'success' });
      else if (bf >= 32) insights.push({ text: `Your body fat is ${bf.toFixed(1)}%. Focused strength training can boost resting energy expenditure.`, type: 'info' });
    }

    // Calorie aggression levels
    if (dailyDeficitOrSurplus < -700) {
      insights.push({ text: `Your calorie deficit of ${Math.round(Math.abs(dailyDeficitOrSurplus))} kcal is highly aggressive. Prolonged extreme deficits can cause metabolic deceleration.`, type: 'warning' });
    } else if (dailyDeficitOrSurplus > 700) {
      insights.push({ text: `Your calorie surplus of ${Math.round(dailyDeficitOrSurplus)} kcal is highly accelerated. Ensure sufficient resistance stimulus to maximize skeletal muscle gain instead of adipose tissue.`, type: 'info' });
    } else if (dailyDeficitOrSurplus < 0) {
      insights.push({ text: `Steady fat loss deficit calculated (${Math.round(Math.abs(dailyDeficitOrSurplus))} kcal/day). Expected sustainable weight change: ~0.4 to 0.8 kg per week.`, type: 'success' });
    }

    // Macro protein level
    if (athlete) {
      insights.push({ text: `Athlete Mode enabled. Protein requirements scaled to 2.2g per kg of body mass to assist in rapid tissue hypertrophy and neurological recovery.`, type: 'success' });
    } else if (calculatedStats.macros.protein.pct > 35) {
      insights.push({ text: `High-Protein distribution active. Great for satiety, tissue repair, and diet-induced thermogenesis. Ensure plenty of water.`, type: 'info' });
    }

    // Pregnancy adjustments
    if (pregnant) {
      insights.push({ text: `Pregnancy mode active (+350 kcal/day applied). Do not undergo aggressive calorie deficits during gestation.`, type: 'warning' });
    }
    if (breastfeeding) {
      insights.push({ text: `Breastfeeding mode active (+500 kcal/day applied). Maintain adequate hydration and vital fatty acid profiles.`, type: 'info' });
    }

    // Projected weeks to target
    if (targetWeight) {
      const startW = Number(weight);
      const targetW = Number(targetWeight);
      const diff = targetW - startW;
      
      if ((diff < 0 && dailyDeficitOrSurplus < 0) || (diff > 0 && dailyDeficitOrSurplus > 0)) {
        const calorieConstant = unit === 'imperial' ? 3500 : 7700;
        const totalEnergyNeeded = diff * calorieConstant;
        const daysToGoal = Math.abs(totalEnergyNeeded / dailyDeficitOrSurplus);
        const weeksToGoal = daysToGoal / 7;
        insights.push({
          text: `At this steady rate of ${Math.round(Math.abs(dailyDeficitOrSurplus))} kcal/day, you will hit your target of ${targetW} ${unit === 'imperial' ? 'lbs' : 'kg'} in approximately ${Math.ceil(weeksToGoal)} weeks.`,
          type: 'success'
        });
      } else if (diff !== 0) {
        insights.push({
          text: `Your current target calories are in the opposite direction of your weight goal. Adjust your goal strategy to create a deficit or surplus accordingly.`,
          type: 'warning'
        });
      }
    }

    return insights;
  }, [calculatedStats, athlete, pregnant, breastfeeding, targetWeight, weight, unit]);

  // --- ACTIONS ---
  const handleLoadExample = () => {
    setUnit('metric');
    setAge('28');
    setGender('male');
    setWeight('78');
    setHeight('178');
    setActivity('moderate');
    setTargetWeight('72');
    setBodyFat('18');
    setNeck('38');
    setWaist('86');
    setHip('');
    setGoal('lose_moderate');
    setPregnant(false);
    setBreastfeeding(false);
    setAthlete(true);
    setMethod('mifflin');
    setMacroSplit('high_protein');
    setMealsCount('4');
    setClimate('temperate');
    setInfoMessage("Loaded realistic athlete health metrics!");
    setTimeout(() => setInfoMessage(null), 3000);
  };

  const handleClearAll = () => {
    setAge('');
    setGender('');
    setWeight('');
    setHeight('');
    setActivity('');
    setCustomActivity('');
    setTargetWeight('');
    setBodyFat('');
    setLbm('');
    setNeck('');
    setWaist('');
    setHip('');
    setGoal('lose_moderate');
    setPregnant(false);
    setBreastfeeding(false);
    setAthlete(false);
    setMethod('mifflin');
    setMacroSplit('balanced');
    setMealsCount('3');
    setClimate('temperate');
    setInfoMessage("All calorie fields and dashboards reset.");
    setTimeout(() => setInfoMessage(null), 3000);
  };

  const downloadPngReport = async () => {
    if (dashboardRef.current) {
      try {
        const canvas = await html2canvas(dashboardRef.current, {
          backgroundColor: '#0f172a', // Dark theme background for premium look
          scale: 2,
          useCORS: true
        });
        const link = document.createElement('a');
        link.download = `calorie_calculator_report_${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } catch (err) {
        setInfoMessage("Could not capture dashboard image. Please take a manual screenshot or print.");
      }
    }
  };

  // Add Scenario to Sandbox comparison
  const handleSaveScenario = () => {
    if (!hasRequiredFields) {
      setInfoMessage("Please fill in required fields first.");
      setTimeout(() => setInfoMessage(null), 3000);
      return;
    }

    const name = scenarioNameInput.trim() || `Scenario ${scenarios.length + 1}`;
    const newScenario: Scenario = {
      id: 'scen-' + Date.now(),
      name,
      age,
      gender,
      weight,
      height,
      activity,
      customActivity,
      goal,
      unit,
      bodyFat,
      lbm,
      method,
      macroSplit,
      pregnant,
      breastfeeding,
      athlete
    };

    setScenarios([...scenarios, newScenario]);
    setScenarioNameInput('');
    setInfoMessage(`Saved current configuration as: "${name}"! Check the Compare tab.`);
    setTimeout(() => setInfoMessage(null), 4000);
  };

  const handleDeleteScenario = (id: string) => {
    setScenarios(scenarios.filter(s => s.id !== id));
  };

  // --- RENDERS ---
  return (
    <div className="w-full space-y-6">
      
      {/* HEADER SECTION */}
      <div className="p-6 sm:p-10 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-black tracking-widest text-blue-600 dark:text-cyan-400 uppercase font-mono block mb-2">
            ✨ Premium Clinical Health Tool
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
            Calorie Calculator
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-2xl text-sm leading-relaxed">
            The world's most advanced, locally compiled calorie and macronutrient planner. Establishes daily basal metabolic thresholds, precise exercise expenditure, and visualizes dietary projection schedules.
          </p>
        </div>

        {/* CONTROLS */}
        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={handleLoadExample}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-500 dark:text-cyan-400" />
            Load Example
          </button>
          <button 
            onClick={handleClearAll}
            className="px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 hover:border-red-500 dark:hover:border-red-900 text-neutral-700 dark:text-neutral-300 font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>
      </div>

      {/* NOTICES BANNER */}
      {infoMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-xs font-semibold flex items-center gap-2"
        >
          <Info className="w-4 h-4 shrink-0" />
          <span>{infoMessage}</span>
        </motion.div>
      )}

      {/* TABS SELECTOR */}
      <div className="flex border-b border-neutral-200 dark:border-neutral-800">
        <button
          onClick={() => setActiveTab('calculator')}
          className={`px-6 py-4 font-bold text-sm tracking-tight border-b-2 transition flex items-center gap-2 cursor-pointer ${activeTab === 'calculator' ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
        >
          <Flame className="w-4 h-4" />
          Dashboard &amp; Calculator
        </button>
        <button
          onClick={() => setActiveTab('compare')}
          className={`px-6 py-4 font-bold text-sm tracking-tight border-b-2 transition flex items-center gap-2 cursor-pointer ${activeTab === 'compare' ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
        >
          <Layers className="w-4 h-4" />
          Compare Scenarios ({scenarios.length})
        </button>
        <button
          onClick={() => setActiveTab('seo')}
          className={`px-6 py-4 font-bold text-sm tracking-tight border-b-2 transition flex items-center gap-2 cursor-pointer ${activeTab === 'seo' ? 'border-blue-600 dark:border-cyan-400 text-blue-600 dark:text-cyan-400' : 'border-transparent text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200'}`}
        >
          <BookOpen className="w-4 h-4" />
          Educational Guide
        </button>
      </div>

      {/* CORE VIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* TAB 1: CORE CALCULATOR & DASHBOARD */}
        {activeTab === 'calculator' && (
          <>
            {/* LEFT COLUMN: PARAMETERS */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* SECTION: UNITS & REQUIRED DETAILS */}
              <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                    1. Biological Stats
                  </h3>
                  
                  {/* UNIT PICKER */}
                  <div className="flex p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-[10px] font-black uppercase">
                    <button
                      onClick={() => setUnit('metric')}
                      className={`px-3 py-1.5 rounded-md transition cursor-pointer ${unit === 'metric' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-400'}`}
                    >
                      Metric
                    </button>
                    <button
                      onClick={() => setUnit('imperial')}
                      className={`px-3 py-1.5 rounded-md transition cursor-pointer ${unit === 'imperial' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm' : 'text-neutral-400'}`}
                    >
                      Imperial
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* GENDER CLICKER */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Gender</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setGender('male')}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${gender === 'male' ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-cyan-400' : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                      >
                        Male
                      </button>
                      <button
                        onClick={() => setGender('female')}
                        className={`py-3 px-4 rounded-xl border text-sm font-bold flex items-center justify-center gap-2 transition cursor-pointer ${gender === 'female' ? 'bg-blue-600/15 border-blue-500 text-blue-600 dark:text-cyan-400' : 'bg-transparent border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'}`}
                      >
                        Female
                      </button>
                    </div>
                  </div>

                  {/* AGE, HEIGHT, WEIGHT */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">Age</label>
                      <input
                        type="number"
                        placeholder="e.g. 28"
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">
                        Height ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        placeholder={unit === 'metric' ? 'e.g. 175' : 'e.g. 69'}
                        value={height}
                        onChange={(e) => setHeight(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">
                        Weight ({unit === 'metric' ? 'kg' : 'lbs'})
                      </label>
                      <input
                        type="number"
                        placeholder={unit === 'metric' ? 'e.g. 72' : 'e.g. 158'}
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* ACTIVITY LEVEL */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Activity Level</label>
                    <select
                      value={activity}
                      onChange={(e) => setActivity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="" className="dark:bg-neutral-950">Select Activity Level</option>
                      <option value="sedentary" className="dark:bg-neutral-950">Sedentary (Little or no exercise)</option>
                      <option value="light" className="dark:bg-neutral-950">Lightly Active (Exercise 1-3 days/week)</option>
                      <option value="moderate" className="dark:bg-neutral-950">Moderately Active (Exercise 3-5 days/week)</option>
                      <option value="active" className="dark:bg-neutral-950">Very Active (Hard sports 6-7 days/week)</option>
                      <option value="extreme" className="dark:bg-neutral-950">Extremely Active (Twice daily, hard labor)</option>
                      <option value="custom" className="dark:bg-neutral-950">Custom Multiplier</option>
                    </select>
                  </div>

                  {/* CUSTOM MULTIPLIER INPUT */}
                  {activity === 'custom' && (
                    <motion.div 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-1.5"
                    >
                      <label className="text-xs font-semibold text-neutral-500">Custom Activity Multiplier</label>
                      <input
                        type="number"
                        step="0.05"
                        placeholder="e.g. 1.45"
                        value={customActivity}
                        onChange={(e) => setCustomActivity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                      />
                      <p className="text-[10px] text-neutral-400">Typical limits sit between 1.0 (minimal cellular activity) and 2.5 (extreme clinical endurance).</p>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* SECTION: OPTIONAL HEALTH STATS */}
              <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md space-y-4">
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                  2. Body Composition (Optional)
                </h3>
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  Enter tape measurements to calculate body fat percentage using the certified US Navy equations, or input numbers directly.
                </p>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">
                      Target Wt ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      placeholder={unit === 'metric' ? 'e.g. 68' : 'e.g. 150'}
                      value={targetWeight}
                      onChange={(e) => setTargetWeight(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">Body Fat %</label>
                    <input
                      type="number"
                      placeholder="e.g. 15"
                      value={bodyFat}
                      onChange={(e) => setBodyFat(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-neutral-500">
                      Lean Mass ({unit === 'metric' ? 'kg' : 'lbs'})
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 60"
                      value={lbm}
                      onChange={(e) => setLbm(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* TAPE MEASUREMENTS FOR NAVY BODY FAT */}
                <div className="space-y-3 pt-2 border-t border-neutral-200/50 dark:border-neutral-800/40">
                  <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300 block">Tape Circumference Values</span>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">
                        Neck ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        placeholder={unit === 'metric' ? 'e.g. 38' : 'e.g. 15'}
                        value={neck}
                        onChange={(e) => setNeck(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-500">
                        Waist ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        placeholder={unit === 'metric' ? 'e.g. 84' : 'e.g. 33'}
                        value={waist}
                        onChange={(e) => setWaist(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-semibold text-neutral-500 ${gender === 'male' ? 'opacity-40' : ''}`}>
                        Hip ({unit === 'metric' ? 'cm' : 'in'})
                      </label>
                      <input
                        type="number"
                        disabled={gender === 'male'}
                        placeholder={unit === 'metric' ? 'e.g. 96' : 'e.g. 38'}
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                        className={`w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${gender === 'male' ? 'opacity-40 bg-neutral-100/50 dark:bg-neutral-800/10 cursor-not-allowed' : ''}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* SECTION: GOAL & ADJUSTMENTS */}
              <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md space-y-4">
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                  3. Goal Strategy
                </h3>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-neutral-500">Primary Weight Target</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="lose_mild">Mild Fat Loss (-250 kcal/day)</option>
                    <option value="lose_moderate">Moderate Fat Loss (-500 kcal/day)</option>
                    <option value="lose_aggressive">Aggressive Fat Loss (-750 kcal/day)</option>
                    <option value="maintain">Maintain Weight (0 adjustment)</option>
                    <option value="gain_lean">Lean Bulk (+250 kcal/day)</option>
                    <option value="gain_moderate">Bulk (+500 kcal/day)</option>
                    <option value="gain_aggressive">Accelerated Bulk (+1000 kcal/day)</option>
                  </select>

                  {/* CLINICAL SPECIAL ADJUSTMENTS */}
                  <div className="pt-2 space-y-2">
                    <span className="text-xs font-bold text-neutral-500 block mb-1">Clinical Exceptions</span>
                    
                    <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={pregnant}
                        onChange={(e) => {
                          setPregnant(e.target.checked);
                          if (e.target.checked) setBreastfeeding(false);
                        }}
                        className="mt-0.5 rounded border-neutral-300 dark:border-neutral-800"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-800 dark:text-white">Pregnant (+350 kcal)</span>
                        <span className="text-[10px] text-neutral-400 block leading-normal">Adds essential maternal nutrients to sustain fetal expansion. (2nd/3rd trimester baseline).</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={breastfeeding}
                        onChange={(e) => {
                          setBreastfeeding(e.target.checked);
                          if (e.target.checked) setPregnant(false);
                        }}
                        className="mt-0.5 rounded border-neutral-300 dark:border-neutral-800"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-800 dark:text-white">Breastfeeding (+500 kcal)</span>
                        <span className="text-[10px] text-neutral-400 block leading-normal">Supplements increased thermodynamic lactation output of the mammary cells.</span>
                      </div>
                    </label>

                    <label className="flex items-start gap-2.5 p-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={athlete}
                        onChange={(e) => setAthlete(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300 dark:border-neutral-800"
                      />
                      <div className="space-y-0.5">
                        <span className="font-bold text-neutral-800 dark:text-white">Athlete Mode</span>
                        <span className="text-[10px] text-neutral-400 block leading-normal">Safeguards skeletal tissues by prioritizing protein ratios (rebalances macros automatically).</span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* SECTION: ADVANCED FORMULA SETTINGS */}
              <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md space-y-4">
                <h3 className="text-base font-extrabold text-neutral-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-blue-500 dark:text-cyan-400" />
                  4. Preference Profiles
                </h3>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-500">BMR Formula</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="mifflin">Mifflin-St Jeor (Recommended Default)</option>
                      <option value="harris_orig">Harris-Benedict (Original 1918)</option>
                      <option value="harris_rev">Revised Harris-Benedict (1984)</option>
                      <option value="katch">Katch-McArdle (Requires Body Fat / LBM)</option>
                      <option value="cunningham">Cunningham (Requires LBM)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-neutral-500">Macronutrient Split</label>
                    <select
                      value={macroSplit}
                      onChange={(e) => setMacroSplit(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="balanced">Balanced (40% C, 30% P, 30% F)</option>
                      <option value="high_protein">High Protein (35% C, 40% P, 25% F)</option>
                      <option value="low_carb">Low Carb (25% C, 35% P, 40% F)</option>
                      <option value="keto">Ketogenic (5% C, 25% P, 70% F)</option>
                      <option value="custom">Custom Percentage Splits</option>
                    </select>
                  </div>

                  {macroSplit === 'custom' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-3.5 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/20 space-y-3"
                    >
                      <div className="grid grid-cols-3 gap-3 text-xs font-mono">
                        <div>
                          <span className="block text-neutral-500 text-[10px] mb-1">Protein %</span>
                          <input
                            type="number"
                            value={customProtein}
                            onChange={(e) => setCustomProtein(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-md border dark:border-neutral-800 bg-transparent"
                          />
                        </div>
                        <div>
                          <span className="block text-neutral-500 text-[10px] mb-1">Carb %</span>
                          <input
                            type="number"
                            value={customCarb}
                            onChange={(e) => setCustomCarb(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-md border dark:border-neutral-800 bg-transparent"
                          />
                        </div>
                        <div>
                          <span className="block text-neutral-500 text-[10px] mb-1">Fat %</span>
                          <input
                            type="number"
                            value={customFat}
                            onChange={(e) => setCustomFat(e.target.value)}
                            className="w-full px-2 py-1.5 rounded-md border dark:border-neutral-800 bg-transparent"
                          />
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-neutral-400">Total Sum:</span>
                        <span className={`font-bold ${(Number(customProtein) + Number(customCarb) + Number(customFat) === 100) ? 'text-green-500' : 'text-red-500'}`}>
                          {Number(customProtein) + Number(customCarb) + Number(customFat)}% (Must equal 100%)
                        </span>
                      </div>
                    </motion.div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500">Meal Schedule</label>
                      <select
                        value={mealsCount}
                        onChange={(e) => setMealsCount(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="3">3 Meals / Day</option>
                        <option value="4">4 Meals / Day</option>
                        <option value="5">5 Meals / Day</option>
                        <option value="6">6 Meals / Day</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-neutral-500">Water Climate</label>
                      <select
                        value={climate}
                        onChange={(e) => setClimate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent dark:bg-neutral-950 text-sm text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="temperate">Temperate / Standard</option>
                        <option value="hot">Tropical / Hot (Adds +500ml)</option>
                        <option value="cold">Sub-Zero / Cold (Subtracts -200ml)</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* SAVE CONFIG TO COMPARISON */}
              <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md space-y-3">
                <span className="text-xs font-black text-neutral-900 dark:text-white block uppercase tracking-wider font-mono">
                  Sandbox Scenario Recorder
                </span>
                <p className="text-[10px] text-neutral-400 leading-normal">
                  Lock this current health state into memory. You can toggle tabs to stack and analyze differences.
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Scenario Name (e.g. Cut Diet)"
                    value={scenarioNameInput}
                    onChange={(e) => setScenarioNameInput(e.target.value)}
                    className="flex-grow px-3 py-2 text-xs rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent text-neutral-900 dark:text-white"
                  />
                  <button
                    onClick={handleSaveScenario}
                    className="px-4 py-2 rounded-xl bg-neutral-950 text-white dark:bg-white dark:text-neutral-950 text-xs font-bold transition hover:opacity-90 flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Save
                  </button>
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: HEALTH DASHBOARD */}
            <div className="lg:col-span-7">
              {!calculatedStats ? (
                <div className="h-full min-h-[500px] p-8 rounded-3xl border border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/10 flex flex-col items-center justify-center text-center space-y-4">
                  <Flame className="w-16 h-16 text-neutral-300 dark:text-neutral-700 animate-pulse" />
                  <div className="max-w-md space-y-1">
                    <h3 className="text-lg font-black text-neutral-900 dark:text-white">Awaiting Health Parameters</h3>
                    <p className="text-xs text-neutral-500 leading-relaxed">
                      Every input starts empty. Please complete Gender, Age, Height, Weight, and Activity Level on the left to initiate the thermodynamic dashboard. Only entered values participate.
                    </p>
                  </div>
                  <button 
                    onClick={handleLoadExample}
                    className="px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs transition hover:bg-blue-500 shadow-md cursor-pointer"
                  >
                    Load Sandbox Example
                  </button>
                </div>
              ) : (
                <div ref={dashboardRef} className="space-y-6">
                  
                  {/* MAIN DASHBOARD BLOCK */}
                  <div className="p-6 sm:p-8 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 text-white space-y-6 shadow-2xl relative overflow-hidden">
                    
                    {/* Background decorations */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full filter blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-400/10 rounded-full filter blur-3xl pointer-events-none" />

                    <div className="flex items-center justify-between relative z-10">
                      <div>
                        <span className="text-[10px] font-mono tracking-widest uppercase bg-white/10 px-2.5 py-1 rounded-full text-cyan-400">
                          Primary Metabolic Report
                        </span>
                        <h2 className="text-xl sm:text-2xl font-black mt-2">Active Caloric Summary</h2>
                      </div>
                      <button
                        onClick={downloadPngReport}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-neutral-300 hover:text-white transition cursor-pointer flex items-center gap-1.5 text-xs font-bold"
                        title="Download Dashboard PNG"
                      >
                        <Download className="w-4 h-4" />
                        Export PNG
                      </button>
                    </div>

                    {/* THREE CARD METRIC DISPLAY */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 relative z-10">
                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Basal Metabolic (BMR)</span>
                        <h4 className="text-2xl sm:text-3xl font-black text-cyan-300 font-mono">
                          {Math.round(calculatedStats.activeBMR).toLocaleString()}
                        </h4>
                        <span className="text-[9px] text-neutral-500">kcal / day (minimum rest)</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-1">
                        <span className="text-[10px] text-neutral-400 uppercase font-mono block">Maintenance (TDEE)</span>
                        <h4 className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                          {Math.round(calculatedStats.tdee).toLocaleString()}
                        </h4>
                        <span className="text-[9px] text-neutral-500">kcal / day (movement scaled)</span>
                      </div>

                      <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-center space-y-1 shadow-lg">
                        <span className="text-[10px] text-blue-100 uppercase font-mono block">Target Calorie Intake</span>
                        <h4 className="text-2xl sm:text-3xl font-black text-white font-mono">
                          {Math.round(calculatedStats.targetCalories).toLocaleString()}
                        </h4>
                        <span className="text-[9px] text-cyan-100 font-semibold block">
                          {Math.round(calculatedStats.targetCalories - calculatedStats.tdee) === 0 ? 'Maintenance' : 
                           Math.round(calculatedStats.targetCalories - calculatedStats.tdee) > 0 ? 
                           `+${Math.round(calculatedStats.targetCalories - calculatedStats.tdee)} kcal (Surplus)` : 
                           `${Math.round(calculatedStats.targetCalories - calculatedStats.tdee)} kcal (Deficit)`}
                        </span>
                      </div>
                    </div>

                    {/* COMPOSITION PROGRESS GAUGES */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 relative z-10 text-xs">
                      
                      {/* BMI METER */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Body Mass Index (BMI)</span>
                          <span className="font-bold text-white font-mono">{calculatedStats.bmi.toFixed(1)}</span>
                        </div>
                        {/* Custom visual bar */}
                        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden flex">
                          <div className="h-full bg-cyan-400" style={{ width: `${Math.max(10, Math.min(100, (calculatedStats.bmi / 40) * 100))}%` }} />
                        </div>
                        <div className="flex justify-between text-[8px] text-neutral-500 uppercase font-mono">
                          <span>Under &lt;18.5</span>
                          <span>Normal 18.5-25</span>
                          <span>Obese &gt;30</span>
                        </div>
                      </div>

                      {/* BODY FAT METER */}
                      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-neutral-400 font-medium">Body Fat: <em className="text-[10px] text-neutral-500 not-italic">({calculatedStats.bodyFatMethod})</em></span>
                          <span className="font-bold text-white font-mono">{(calculatedStats.bodyFat ?? 0).toFixed(1)}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-neutral-800 overflow-hidden flex">
                          <div className="h-full bg-amber-400" style={{ width: `${calculatedStats.bodyFat}%` }} />
                        </div>
                        <div className="flex justify-between text-[9px] text-neutral-500">
                          <span>Lean Mass: {Math.round(calculatedStats.lbm)} {unit === 'imperial' ? 'lbs' : 'kg'}</span>
                          <span>Fat Mass: {Math.round(calculatedStats.fatMass)} {unit === 'imperial' ? 'lbs' : 'kg'}</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* DOUBLE COLUMN: GRAPHICAL METRICS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* MACRONUTRIENT CHART */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/30 shadow-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider">Macronutrient Split</h3>
                        <span className="text-[10px] text-neutral-400">{macroSplit.toUpperCase()}</span>
                      </div>

                      {/* Custom Pie drawing/charts */}
                      <div className="h-44 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Protein', value: calculatedStats.macros.protein.cal, color: '#3b82f6' },
                                { name: 'Carbs', value: calculatedStats.macros.carb.cal, color: '#10b981' },
                                { name: 'Fat', value: calculatedStats.macros.fat.cal, color: '#f59e0b' }
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={65}
                              paddingAngle={4}
                              dataKey="value"
                            >
                              <Cell fill="#3b82f6" />
                              <Cell fill="#10b981" />
                              <Cell fill="#f59e0b" />
                            </Pie>
                            <Legend verticalAlign="bottom" height={36} iconType="circle" />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend Stats Table */}
                      <div className="space-y-2 text-xs">
                        <div className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40">
                          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                            Protein
                          </span>
                          <span className="font-mono font-bold text-neutral-800 dark:text-white">
                            {Math.round(calculatedStats.macros.protein.g)}g <span className="text-neutral-400 font-normal">({calculatedStats.macros.protein.pct}%)</span>
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40">
                          <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                            Carbohydrates
                          </span>
                          <span className="font-mono font-bold text-neutral-800 dark:text-white">
                            {Math.round(calculatedStats.macros.carb.g)}g <span className="text-neutral-400 font-normal">({calculatedStats.macros.carb.pct}%)</span>
                          </span>
                        </div>
                        <div className="flex justify-between p-2 rounded-lg bg-neutral-50 dark:bg-neutral-900/40">
                          <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold">
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                            Fats
                          </span>
                          <span className="font-mono font-bold text-neutral-800 dark:text-white">
                            {Math.round(calculatedStats.macros.fat.g)}g <span className="text-neutral-400 font-normal">({calculatedStats.macros.fat.pct}%)</span>
                          </span>
                        </div>
                        <div className="flex justify-between p-1 px-2 text-[10px] text-neutral-400">
                          <span>Fiber Target:</span>
                          <span className="font-mono font-bold">{Math.round(calculatedStats.macros.fiber)} grams</span>
                        </div>
                      </div>
                    </div>

                    {/* WEIGHT PROJECTION CHART */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/30 shadow-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider">Weight Projection</h3>
                        <span className="text-[10px] text-neutral-400">12 MONTH FORECAST</span>
                      </div>

                      <div className="h-44">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={weightProjectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#88888820" />
                            <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                            <YAxis domain={['auto', 'auto']} tick={{ fontSize: 10 }} />
                            <RechartsTooltip />
                            <Line type="monotone" dataKey="weight" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="text-[10px] text-neutral-500 leading-normal bg-neutral-100/40 dark:bg-neutral-800/10 p-2.5 rounded-xl border border-neutral-100 dark:border-neutral-800">
                        <strong className="text-neutral-800 dark:text-white block font-bold mb-1">Thermodynamic Assumption:</strong>
                        Standard adipose fat density is approximated at 7,700 kcal/kg (3,500 kcal/lb). Human systems adjust continuously; these values serve as ideal linear baselines.
                      </div>
                    </div>

                  </div>

                  {/* CLINICAL HEALTH INSIGHTS REMARKS */}
                  <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/30 shadow-md space-y-4">
                    <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider">Clinical Insights</h3>
                    <div className="space-y-3">
                      {healthInsights.map((ins, idx) => (
                        <div 
                          key={idx} 
                          className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs leading-normal font-semibold ${ins.type === 'warning' ? 'bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400' : ins.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400'}`}
                        >
                          {ins.type === 'warning' ? (
                            <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-red-500" />
                          ) : ins.type === 'success' ? (
                            <Check className="w-4.5 h-4.5 shrink-0 text-emerald-500" />
                          ) : (
                            <Info className="w-4.5 h-4.5 shrink-0 text-blue-500" />
                          )}
                          <span>{ins.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* MEAL DISTRIBUTION TABLE */}
                  <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/30 shadow-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider">Suggested Meal Distribution</h3>
                      <span className="text-[10px] text-neutral-400">{mealsCount} MEALS / DAY</span>
                    </div>

                    <div className="overflow-x-auto rounded-xl border border-neutral-200/60 dark:border-neutral-800/50">
                      <table className="w-full text-xs text-left text-neutral-500 dark:text-neutral-400">
                        <thead className="text-[10px] bg-neutral-50 dark:bg-neutral-800/40 text-neutral-400 font-mono uppercase tracking-widest border-b border-neutral-200 dark:border-neutral-800">
                          <tr>
                            <th className="px-4 py-3">Meal Slot</th>
                            <th className="px-4 py-3">Energy (kcal)</th>
                            <th className="px-4 py-3 text-blue-500">Protein</th>
                            <th className="px-4 py-3 text-emerald-500">Carbs</th>
                            <th className="px-4 py-3 text-amber-500">Fat</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                          {mealDistributionData.map((meal, idx) => (
                            <tr key={idx} className="hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition">
                              <td className="px-4 py-3 font-bold text-neutral-800 dark:text-neutral-200">{meal.name}</td>
                              <td className="px-4 py-3 font-mono font-black text-neutral-950 dark:text-white">{meal.calories}</td>
                              <td className="px-4 py-3 font-mono font-bold text-blue-600 dark:text-blue-400">{meal.protein}g</td>
                              <td className="px-4 py-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">{meal.carb}g</td>
                              <td className="px-4 py-3 font-mono font-bold text-amber-600 dark:text-amber-400">{meal.fat}g</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* WATER CALCULATOR GRID */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    
                    {/* WATER RESULTS */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/30 shadow-md space-y-4">
                      <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                        <Droplet className="w-4 h-4 text-cyan-400" />
                        Daily Hydration Intake
                      </h3>
                      <div className="grid grid-cols-2 gap-3 text-center">
                        <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                          <span className="text-[10px] text-neutral-400 block font-mono">Liters</span>
                          <span className="text-xl font-mono font-black text-neutral-900 dark:text-white">
                            {calculatedStats.water.liters.toFixed(2)} L
                          </span>
                        </div>
                        <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                          <span className="text-[10px] text-neutral-400 block font-mono">Fluid Ounces</span>
                          <span className="text-xl font-mono font-black text-neutral-900 dark:text-white">
                            {Math.round(calculatedStats.water.oz)} oz
                          </span>
                        </div>
                      </div>
                      <p className="text-[10px] text-neutral-400 leading-relaxed text-center">
                        Hydration thresholds vary based on systemic cellular structure. Sweating requires supplementary fluid matching.
                      </p>
                    </div>

                    {/* ESTIMATED EXERCISE EXPENDITURE */}
                    <div className="p-6 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white dark:bg-neutral-900/30 shadow-md space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider flex items-center gap-1.5">
                          <Dumbbell className="w-4 h-4 text-blue-500" />
                          Exercise Energy Burner
                        </h3>
                        
                        <div className="flex items-center gap-1 text-[10px]">
                          <input
                            type="number"
                            value={exerciseDuration}
                            onChange={(e) => setExerciseDuration(e.target.value)}
                            className="w-12 text-center font-mono p-0.5 border dark:border-neutral-800 rounded bg-transparent"
                          />
                          <span className="text-neutral-400">mins</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {exerciseCalorieBurn.slice(0, 6).map((item, idx) => (
                          <div key={idx} className="p-2 rounded-xl bg-neutral-100/40 dark:bg-neutral-800/20 border flex justify-between items-center">
                            <span className="text-neutral-500 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                              {item.name}
                            </span>
                            <span className="font-mono font-bold text-neutral-800 dark:text-white">{item.calories} cal</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                </div>
              )}
            </div>
          </>
        )}

        {/* TAB 2: COMPARE SCENARIOS SANDBOX */}
        {activeTab === 'compare' && (
          <div className="lg:col-span-12 space-y-6">
            
            <div className="p-6 sm:p-10 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/60 bg-white/70 dark:bg-neutral-900/30 backdrop-blur-md space-y-4">
              <h2 className="text-xl font-extrabold text-neutral-900 dark:text-white">Health Scenario Sandbox</h2>
              <p className="text-xs text-neutral-500 max-w-3xl leading-relaxed">
                Compare multiple configurations side-by-side. Save current stats on the left panel, toggle fields, then add more scenarios to view variations in BMR, target calories, body fat, and macronutrient targets.
              </p>

              {scenarios.length < 2 ? (
                <div className="p-12 text-center rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800 flex flex-col items-center justify-center space-y-3">
                  <Layers className="w-12 h-12 text-neutral-300 animate-bounce" />
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Insufficient Scenarios</h3>
                    <p className="text-[11px] text-neutral-400">Please save at least 2 configurations using the recorder on the left of the dashboard tab.</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950/20">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead className="bg-neutral-50 dark:bg-neutral-900/40 text-[10px] font-mono uppercase tracking-wider border-b border-neutral-200 dark:border-neutral-800 text-neutral-400">
                      <tr>
                        <th className="px-4 py-4 border-r border-neutral-200 dark:border-neutral-800">Parameters</th>
                        {scenarios.map(sc => (
                          <th key={sc.id} className="px-4 py-4 min-w-[200px] border-r border-neutral-200 dark:border-neutral-800 text-center relative">
                            <div className="flex items-center justify-center gap-2">
                              <span className="font-bold text-neutral-900 dark:text-white block">{sc.name}</span>
                              <button
                                onClick={() => handleDeleteScenario(sc.id)}
                                className="text-neutral-400 hover:text-red-500 transition cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                      <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                        <td className="px-4 py-3 font-bold text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">Biological Parameters</td>
                        {scenarios.map(sc => (
                          <td key={sc.id} className="px-4 py-3 text-center border-r border-neutral-200 dark:border-neutral-800">
                            {sc.gender.toUpperCase()} / {sc.age} Yrs / {sc.height} {sc.unit === 'metric' ? 'cm' : 'in'}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                        <td className="px-4 py-3 font-bold text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">Weight &amp; LBM</td>
                        {scenarios.map(sc => (
                          <td key={sc.id} className="px-4 py-3 text-center border-r border-neutral-200 dark:border-neutral-800">
                            {sc.weight} {sc.unit === 'metric' ? 'kg' : 'lbs'} 
                            {sc.bodyFat ? ` (BF: ${sc.bodyFat}%)` : ''}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                        <td className="px-4 py-3 font-bold text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">Activity Multiplier</td>
                        {scenarios.map(sc => (
                          <td key={sc.id} className="px-4 py-3 text-center border-r border-neutral-200 dark:border-neutral-800 font-mono">
                            {sc.activity === 'custom' ? `Custom: ${sc.customActivity}` : sc.activity}
                          </td>
                        ))}
                      </tr>
                      <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                        <td className="px-4 py-3 font-bold text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">Primary Goal</td>
                        {scenarios.map(sc => (
                          <td key={sc.id} className="px-4 py-3 text-center border-r border-neutral-200 dark:border-neutral-800 font-semibold text-blue-600 dark:text-cyan-400">
                            {sc.goal.replace(/_/g, ' ').toUpperCase()}
                          </td>
                        ))}
                      </tr>
                      
                      {/* Calculated comparison blocks */}
                      <tr className="bg-neutral-50 dark:bg-neutral-900/10 font-bold">
                        <td className="px-4 py-3.5 border-r border-neutral-200 dark:border-neutral-800">Calculated BMR</td>
                        {scenarios.map(sc => {
                          const wKg = sc.unit === 'imperial' ? Number(sc.weight) * 0.45359 : Number(sc.weight);
                          const hCm = sc.unit === 'imperial' ? Number(sc.height) * 2.54 : Number(sc.height);
                          let calculatedBF = sc.bodyFat ? Number(sc.bodyFat) : 15;
                          const calculatedLBM = sc.lbm ? Number(sc.lbm) : wKg * (1 - calculatedBF / 100);
                          
                          let bmr = 10 * wKg + 6.25 * hCm - 5 * Number(sc.age) + (sc.gender === 'male' ? 5 : -161);
                          if (sc.method === 'harris_orig') bmr = sc.gender === 'male' ? 66.47 + 13.75*wKg + 5*hCm - 6.7*Number(sc.age) : 655 + 9.5*wKg + 1.8*hCm - 4.6*Number(sc.age);
                          else if (sc.method === 'katch') bmr = 370 + 21.6 * calculatedLBM;

                          return (
                            <td key={sc.id} className="px-4 py-3.5 text-center border-r border-neutral-200 dark:border-neutral-800 font-mono text-neutral-900 dark:text-white">
                              {Math.round(bmr)} kcal
                            </td>
                          );
                        })}
                      </tr>

                      <tr className="bg-blue-600/5 dark:bg-cyan-400/5 font-black text-blue-700 dark:text-cyan-300">
                        <td className="px-4 py-4 border-r border-neutral-200 dark:border-neutral-800">TDEE (Daily Burn)</td>
                        {scenarios.map(sc => {
                          const wKg = sc.unit === 'imperial' ? Number(sc.weight) * 0.45359 : Number(sc.weight);
                          const hCm = sc.unit === 'imperial' ? Number(sc.height) * 2.54 : Number(sc.height);
                          let actM = 1.2;
                          if (sc.activity === 'light') actM = 1.375;
                          else if (sc.activity === 'moderate') actM = 1.55;
                          else if (sc.activity === 'active') actM = 1.725;
                          else if (sc.activity === 'extreme') actM = 1.9;
                          else if (sc.activity === 'custom') actM = Number(sc.customActivity) || 1.2;

                          const bmr = 10 * wKg + 6.25 * hCm - 5 * Number(sc.age) + (sc.gender === 'male' ? 5 : -161);
                          const tdee = bmr * actM;

                          return (
                            <td key={sc.id} className="px-4 py-4 text-center border-r border-neutral-200 dark:border-neutral-800 font-mono text-lg">
                              {Math.round(tdee).toLocaleString()} kcal
                            </td>
                          );
                        })}
                      </tr>

                      <tr className="bg-emerald-600/5 dark:bg-emerald-400/5 font-black text-emerald-700 dark:text-emerald-400">
                        <td className="px-4 py-4 border-r border-neutral-200 dark:border-neutral-800">Target Calories</td>
                        {scenarios.map(sc => {
                          const wKg = sc.unit === 'imperial' ? Number(sc.weight) * 0.45359 : Number(sc.weight);
                          const hCm = sc.unit === 'imperial' ? Number(sc.height) * 2.54 : Number(sc.height);
                          let actM = 1.2;
                          if (sc.activity === 'light') actM = 1.375;
                          else if (sc.activity === 'moderate') actM = 1.55;
                          else if (sc.activity === 'active') actM = 1.725;
                          else if (sc.activity === 'extreme') actM = 1.9;
                          else if (sc.activity === 'custom') actM = Number(sc.customActivity) || 1.2;

                          const bmr = 10 * wKg + 6.25 * hCm - 5 * Number(sc.age) + (sc.gender === 'male' ? 5 : -161);
                          const tdee = bmr * actM;

                          let adj = 0;
                          if (sc.goal === 'lose_mild') adj = -250;
                          else if (sc.goal === 'lose_moderate') adj = -500;
                          else if (sc.goal === 'lose_aggressive') adj = -750;
                          else if (sc.goal === 'gain_lean') adj = 250;
                          else if (sc.goal === 'gain_moderate') adj = 500;
                          else if (sc.goal === 'gain_aggressive') adj = 1000;

                          const target = tdee + adj + (sc.pregnant ? 350 : 0) + (sc.breastfeeding ? 500 : 0);

                          return (
                            <td key={sc.id} className="px-4 py-4 text-center border-r border-neutral-200 dark:border-neutral-800 font-mono text-lg">
                              {Math.round(target).toLocaleString()} kcal
                            </td>
                          );
                        })}
                      </tr>

                      <tr className="hover:bg-neutral-50 dark:hover:bg-neutral-800/20">
                        <td className="px-4 py-3 font-bold text-neutral-500 border-r border-neutral-200 dark:border-neutral-800">Macro Splits (Protein/Carb/Fat)</td>
                        {scenarios.map(sc => {
                          let p = 30, c = 40, f = 30;
                          if (sc.macroSplit === 'high_protein') { p = 40; c = 35; f = 25; }
                          else if (sc.macroSplit === 'low_carb') { p = 35; c = 25; f = 40; }
                          else if (sc.macroSplit === 'keto') { p = 25; c = 5; f = 70; }
                          return (
                            <td key={sc.id} className="px-4 py-3 text-center border-r border-neutral-200 dark:border-neutral-800">
                              {p}% P / {c}% C / {f}% F
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}

        {/* TAB 3: EDUCATIONAL GUIDE & SEO COMPREHENSIVE VIEW */}
        {activeTab === 'seo' && (
          <div className="lg:col-span-12 space-y-8">
            <div className="p-6 sm:p-10 rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-md shadow-xl space-y-8 prose prose-slate dark:prose-invert max-w-none text-xs leading-relaxed">
              
              {/* PRIMARY CONTENT BLOCK */}
              <div className="space-y-4">
                <h2 className="text-2xl font-black text-neutral-950 dark:text-white tracking-tight border-b pb-2">
                  Calorie Calculator: The Science of Metabolic Energy Allocation
                </h2>
                <p>
                  A <strong>calorie</strong> is a standard physical unit of thermodynamic measurement representing the energy needed to raise the temperature of exactly one gram of water by one degree Celsius. Within human nutritional metabolisms, dietary calories provide the bio-chemical fuel required for basic somatic survival, physical motion, and structural cellular growth.
                </p>
                <p>
                  To manage body mass and alter body fat composition safely, we must balance energy input (dietary consumption) with aggregate physical output. This interaction forms the baseline of the first law of thermodynamics, proving that mass can neither be created nor destroyed—only converted through complex cellular pathways.
                </p>
              </div>

              {/* CORE METRIC EXPLANATIONS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3 p-5 bg-neutral-50 dark:bg-neutral-950/20 border rounded-2xl">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider">What Is Basal Metabolic Rate (BMR)?</h3>
                  <p>
                    Your <strong>Basal Metabolic Rate (BMR)</strong> is the net energy your body requires to keep you alive and functioning while at complete, absolute rest in a temperate environment. This includes fundamental cellular processes like breathing, cardiac pump loops, neuro-transmitter synthesis, and kidney/liver filtering.
                  </p>
                  <p>
                    BMR counts for approximately 60% to 75% of your daily energy expenditure. It is heavily influenced by factors such as age (metabolism naturally declines as skeletal muscle cells degrade over time), biological gender (men typically carry higher levels of fat-burning lean mass), height, and net weight.
                  </p>
                </div>

                <div className="space-y-3 p-5 bg-neutral-50 dark:bg-neutral-950/20 border rounded-2xl">
                  <h3 className="text-sm font-black text-neutral-900 dark:text-white font-mono uppercase tracking-wider">What Is Total Daily Energy Expenditure (TDEE)?</h3>
                  <p>
                    Your <strong>Total Daily Energy Expenditure (TDEE)</strong> represents the total sum of calories burned in a single 24-hour cycle. It is calculated by multiplying your BMR with your active movement multipliers, which account for both structured training and spontaneous general actions.
                  </p>
                  <p>
                    TDEE comprises four core pillars:
                  </p>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-500">
                    <li><strong>BMR (Basal Metabolic Rate):</strong> Baseline resting metabolic upkeep (60-70%).</li>
                    <li><strong>NEAT (Non-Exercise Activity Thermogenesis):</strong> Walk cycles, typing, postural movements.</li>
                    <li><strong>EAT (Exercise Activity Thermogenesis):</strong> Structured gym routines, sports (5-15%).</li>
                    <li><strong>TEF (Thermic Effect of Food):</strong> The heat output generated by processing nutrients (~10%).</li>
                  </ul>
                </div>
              </div>

              {/* ENERGY DISCREPANCY SCENARIOS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                <div className="space-y-2 p-4 bg-red-500/5 border border-red-500/10 rounded-xl">
                  <h4 className="font-bold text-red-500 flex items-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    Calorie Deficit (Weight Loss)
                  </h4>
                  <p className="text-neutral-500">
                    Consuming fewer calories than your active TDEE forces your biological systems to extract fatty lipid chains from adipose tissue cells, resulting in steady, progressive fat loss. Keep deficits under -500 kcal for tissue retention.
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                  <h4 className="font-bold text-emerald-500 flex items-center gap-1">
                    <Check className="w-4 h-4" />
                    Calorie Maintenance (Equal Balance)
                  </h4>
                  <p className="text-neutral-500">
                    Eating exactly matching caloric volumes as your daily TDEE establishes energy equilibrium. This ensures body weight is locked in place while supporting baseline cell repair.
                  </p>
                </div>

                <div className="space-y-2 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                  <h4 className="font-bold text-blue-500 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    Calorie Surplus (Weight Gain / Bulk)
                  </h4>
                  <p className="text-neutral-500">
                    Eating more than TDEE triggers a surplus. When paired with mechanical tension (lifting weights), this excess provides cellular raw materials to build muscle, otherwise stored as adipose fat.
                  </p>
                </div>
              </div>

              {/* CLINICAL METRICS OVERVIEW */}
              <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Understanding BMI &amp; Body Fat Percentage</h3>
                <p>
                  <strong>Body Mass Index (BMI)</strong> is a quick, standardized clinical screening metric assessing general weight status relative to height. It is calculated by dividing weight in kilograms by height in meters squared. While useful for general populations, BMI can misclassify heavily muscled lifters as "overweight."
                </p>
                <p>
                  <strong>Body Fat Percentage</strong> is a much more precise biological metric, calculating the exact portion of your mass composed of fatty lipids versus bones, organs, and active muscle tissue. Maintaining healthy ranges prevents cardiovascular inflammation and safeguards hormone regulation.
                </p>
              </div>

              {/* MACRONUTRIENT ROLES */}
              <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">The Functional Role of Macronutrients</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-neutral-500">
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Protein (4 kcal/g)</span>
                    <p>The primary nitrogen-carrying building block of biological tissue. Supports skeletal muscle cell repair, enzyme synthesis, and promotes satiety due to a high thermic effect (TEF) of 20-30%.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Carbohydrates (4 kcal/g)</span>
                    <p>Stored inside muscle and liver cells as glucose and glycogen, carbs provide the primary mechanical fuel for high-intensity ATP synthesis during demanding athletic workouts.</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Healthy Fats (9 kcal/g)</span>
                    <p>Crucial for standard cellular membrane structural integrity, fat-soluble vitamin absorption (A, D, E, K), and maintaining hormonal equilibrium (e.g. testosterone, estrogen).</p>
                  </div>
                </div>
              </div>

              {/* WATER & FLUID HYDRATION */}
              <div className="space-y-2 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">The Vital Necessity of Water</h3>
                <p>
                  Water makes up roughly 60% of total human body mass. Maintaining steady hydration keeps blood plasma volume high, transports essential oxygen/glycogen, regulates internal body temperature through sweating, and keeps skeletal joints properly lubricated. Check climate variables to adapt intake during hot weather.
                </p>
              </div>

              {/* WORKED EXAMPLES */}
              <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Worked Calculations</h3>
                <div className="p-5 bg-neutral-100/40 dark:bg-neutral-800/10 rounded-2xl border text-xs space-y-3 font-mono">
                  <span className="font-bold text-neutral-800 dark:text-neutral-200 block">Example Scenario: Active Weight Loss</span>
                  <p className="leading-relaxed">
                    User: 28-Year-Old Male | Height: 178 cm | Weight: 78 kg | Activity: Moderately Active (1.55)<br />
                    1. BMR (Mifflin) = 10(78) + 6.25(178) - 5(28) + 5 = 1,757.5 kcal<br />
                    2. TDEE = 1,757.5 * 1.55 = 2,724 kcal / day<br />
                    3. Target Weight Loss (Moderate: -500 kcal) = 2,724 - 500 = 2,224 kcal / day<br />
                    4. Macronutrient Targets (40% P, 35% C, 25% F):<br />
                    &nbsp;&nbsp;• Protein: (2,224 * 0.40) / 4 = 222 grams<br />
                    &nbsp;&nbsp;• Carbs: (2,224 * 0.35) / 4 = 195 grams<br />
                    &nbsp;&nbsp;• Fat: (2,224 * 0.25) / 9 = 62 grams
                  </p>
                </div>
              </div>

              {/* FAQS */}
              <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Frequently Asked Questions</h3>
                <div className="space-y-4 text-xs text-neutral-600 dark:text-neutral-300">
                  <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                    <h4 className="font-bold text-neutral-800 dark:text-white mb-1">Which metabolic formula is most accurate?</h4>
                    <p>
                      For most individuals, the Mifflin-St Jeor formula provides the most reliable metabolic baseline. If you carry higher amounts of skeletal muscle tissue, the Katch-McArdle or Cunningham formulas (which utilize direct Lean Body Mass metrics) provide better accuracy by excluding less metabolically active adipose fat cells.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                    <h4 className="font-bold text-neutral-800 dark:text-white mb-1">What is starvation mode? Does it exist?</h4>
                    <p>
                      "Starvation mode" is a common misnomer for <strong>adaptive thermogenesis</strong>—the natural biological survival mechanism where your body slows down thyroid activity and unconscious movement (NEAT) to conserve energy during prolonged, extreme calorie deficits. It will not halt weight loss entirely, but it can slow rate of progress and deplete energy levels.
                    </p>
                  </div>
                  <div className="p-4 bg-neutral-100/40 dark:bg-neutral-800/20 rounded-2xl border">
                    <h4 className="font-bold text-neutral-800 dark:text-white mb-1">How do I retain muscle mass while cutting body fat?</h4>
                    <p>
                      Keep your deficit moderate (under 500 kcal/day), consume high amounts of high-quality protein (1.8g to 2.2g per kg of body weight), and engage in regular, progressive resistance training to signal to your body that skeletal tissue is functionally vital and should not be disassembled for fuel.
                    </p>
                  </div>
                </div>
              </div>

              {/* GLOSSARY */}
              <div className="space-y-3 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Glossary of Terms</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-neutral-500">
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Basal Metabolic Rate (BMR):</span>
                    <p className="mt-1">The energy volume required to sustain life's basic somatic cell tasks while completely at rest.</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">TDEE:</span>
                    <p className="mt-1">Total Daily Energy Expenditure. The total sum of calories metabolized in a single 24-hour physical cycle.</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">NEAT:</span>
                    <p className="mt-1">Non-Exercise Activity Thermogenesis. Energy metabolized during random daily non-structured bodily movements.</p>
                  </div>
                  <div>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">Thermogenesis:</span>
                    <p className="mt-1">The heat-generating biological process of burning cellular fuel to maintain core temperature or digest food.</p>
                  </div>
                </div>
              </div>

              {/* RELATED LINKS */}
              <div className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
                <h3 className="text-xs font-bold uppercase tracking-widest text-neutral-400">Related Calculators</h3>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button onClick={() => onNavigate('calculator:bmi-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    BMI Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:bmr-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    BMR Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:water-intake-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    Water Intake Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:retirement-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    Retirement Calculator
                  </button>
                  <button onClick={() => onNavigate('calculator:tax-calculator')} className="px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 font-bold transition">
                    Tax Calculator
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );
}
